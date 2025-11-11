#!/usr/bin/env bash
set -e

# Analyze commits and determine version bump type
# Uses conventional commit patterns to determine semantic version bump

COMMITS_FILE="${1:-commits.txt}"
VERSION_TYPE="patch"

if [ ! -f "$COMMITS_FILE" ] || [ ! -s "$COMMITS_FILE" ]; then
  echo "No commits to analyze"
  echo "none"
  exit 0
fi

# Analyze conventional commits (prioritize highest level)
if grep -qi "BREAKING CHANGE\|!:" "$COMMITS_FILE"; then
  VERSION_TYPE="major"
  echo "📈 Found breaking changes - MAJOR version bump" >&2
elif grep -qi "^feat\|^feature" "$COMMITS_FILE"; then
  VERSION_TYPE="minor"
  echo "✨ Found new features - MINOR version bump" >&2
elif grep -qi "^fix\|^bugfix\|^patch" "$COMMITS_FILE"; then
  VERSION_TYPE="patch"
  echo "🐛 Found bug fixes - PATCH version bump" >&2
elif grep -qi "^docs\|^doc\|^chore\|^ci\|^build\|^style\|^refactor" "$COMMITS_FILE"; then
  VERSION_TYPE="patch"
  echo "🔧 Found maintenance changes - PATCH version bump" >&2
else
  VERSION_TYPE="patch"
  echo "❓ No conventional commit patterns - defaulting to PATCH" >&2
fi

# Count commit types for logging
FEAT_COUNT=$(grep -ci "^feat\|^feature" "$COMMITS_FILE" 2>/dev/null || echo "0")
FIX_COUNT=$(grep -ci "^fix\|^bugfix" "$COMMITS_FILE" 2>/dev/null || echo "0")
BREAKING_COUNT=$(grep -ci "BREAKING CHANGE\|!:" "$COMMITS_FILE" 2>/dev/null || echo "0")

echo "📊 Analysis:" >&2
echo "  Features: $FEAT_COUNT" >&2
echo "  Fixes: $FIX_COUNT" >&2
echo "  Breaking: $BREAKING_COUNT" >&2
echo "  Decision: $VERSION_TYPE" >&2

# Output the version type
echo "$VERSION_TYPE"
