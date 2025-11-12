#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Usage: $0 [owner/repo]

Checks the GitHub Pages source configuration for a repository and verifies
it is set to branch: "docs" and path: "/".

By default the script will try to detect the repository from the current
Git remote `origin`. You can optionally pass `owner/repo` as the first arg.

The script will use the environment variable `GITHUB_TOKEN` for authenticated
requests if present (recommended). If not present the request will be
unauthenticated and may be rate-limited.

Dependencies: curl, jq (optional), python (used as a jq fallback if jq missing)

Examples:
  # autodetect repo from git remote
  ./scripts/check_pages_source.sh

  # explicit repo
  ./scripts/check_pages_source.sh pantheon-org/opencode-warcraft-notifications

USAGE
  exit 2
}

repo_arg=${1:-""}
if [ -z "$repo_arg" ]; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Not inside a git repo and no repo provided" >&2
    usage
  fi
  remote_url=$(git config --get remote.origin.url || true)
  if [ -z "$remote_url" ]; then
    echo "No git remote 'origin' found and no repo provided" >&2
    usage
  fi

  if [[ "$remote_url" =~ ^git@github.com:([^/]+)/([^/]+)(\.git)?$ ]]; then
    owner="${BASH_REMATCH[1]}"
    repo="${BASH_REMATCH[2]}"
  elif [[ "$remote_url" =~ ^https://github.com/([^/]+)/([^/]+)(\.git)?$ ]]; then
    owner="${BASH_REMATCH[1]}"
    repo="${BASH_REMATCH[2]}"
  else
    # best-effort fallback
    repo=$(basename -s .git "$remote_url")
    owner=$(basename "$(dirname "$remote_url")")
  fi
else
  owner=$(echo "$repo_arg" | cut -d/ -f1)
  repo=$(echo "$repo_arg" | cut -d/ -f2)
  if [ -z "$owner" ] || [ -z "$repo" ]; then
    echo "Invalid repo argument. Expecting owner/repo." >&2
    usage
  fi
fi

api_base="https://api.github.com/repos/$owner/$repo"
pages_api="$api_base/pages"
builds_api="$pages_api/builds"

auth_header=()
if [ -n "${GITHUB_TOKEN:-}" ]; then
  auth_header=( -H "Authorization: Bearer $GITHUB_TOKEN" )
else
  echo "Warning: GITHUB_TOKEN not set. Requests will be unauthenticated and may be rate-limited." >&2
fi

echo "Querying GitHub Pages settings for $owner/$repo..."

resp=$(curl -sS -H "Accept: application/vnd.github+json" "${auth_header[@]}" "$pages_api" ) || {
  echo "Failed to query GitHub API at $pages_api" >&2
  exit 3
}

# Check for API error message
message=$(printf "%s" "$resp" | (jq -r '.message // empty' 2>/dev/null || python - <<'PY'
import sys, json
try:
    o=json.load(sys.stdin)
    print(o.get('message',''))
except Exception:
    pass
PY
)) || true

if [ -n "$message" ]; then
  echo "GitHub API returned message: $message" >&2
  echo "Full response:"
  printf "%s\n" "$resp"
  exit 4
fi

# parse using jq when available, fallback to python
if command -v jq >/dev/null 2>&1; then
  branch=$(printf "%s" "$resp" | jq -r '.source.branch // empty')
  path=$(printf "%s" "$resp" | jq -r '.source.path // empty')
else
  branch=$(python - <<'PY'
import sys, json
try:
    o=json.load(sys.stdin)
    src=o.get('source',{})
    print(src.get('branch',''))
except Exception:
    pass
PY
<<<"$resp")
  path=$(python - <<'PY'
import sys, json
try:
    o=json.load(sys.stdin)
    src=o.get('source',{})
    print(src.get('path',''))
except Exception:
    pass
PY
<<<"$resp")
fi

branch=${branch:-}
path=${path:-}

echo "Pages source branch: '${branch:-<none>}'"
echo "Pages source path: '${path:-<none>}'"

wanted_branch="docs"
wanted_path="/"

ok=true
if [ "$branch" != "$wanted_branch" ]; then
  echo "Mismatch: branch is '$branch' expected '$wanted_branch'" >&2
  ok=false
fi
if [ "$path" != "$wanted_path" ]; then
  echo "Mismatch: path is '$path' expected '$wanted_path'" >&2
  ok=false
fi

# show latest Pages build (if available)
builds_resp=$(curl -sS -H "Accept: application/vnd.github+json" "${auth_header[@]}" "$builds_api" || true)
if [ -n "$builds_resp" ]; then
  echo "\nLatest Pages build (top result):"
  if command -v jq >/dev/null 2>&1; then
    printf "%s\n" "$builds_resp" | jq '.[0] | {id: .id, status: .status, created_at: .created_at, commit: (if (.commit|type) == "object" then .commit.sha elif (.commit|type) == "string" then .commit else null end)}'
  else
    # print a short prefix if jq missing
    printf "%s\n" "$builds_resp" | sed -n '1,12p'
  fi
fi

if [ "$ok" = true ]; then
  echo "\nOK: Pages is configured to serve from '$wanted_branch' at path '$wanted_path'"
  exit 0
else
  echo "\nFAIL: Pages configuration does not match expected settings." >&2
  echo "To fix: set Pages source to branch 'docs' and path '/' (see Settings → Pages or use the API)." >&2
  exit 5
fi
