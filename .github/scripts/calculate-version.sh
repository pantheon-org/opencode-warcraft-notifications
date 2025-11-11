#!/usr/bin/env bash
set -e

# Calculate new semantic version based on current version and bump type
# Usage: calculate-version.sh <current_version> <bump_type>

CURRENT_VERSION="${1:-0.0.0}"
BUMP_TYPE="${2:-patch}"

# Parse version
IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
major=${version_parts[0]:-0}
minor=${version_parts[1]:-0}
patch=${version_parts[2]:-0}

# Remove 'v' prefix if present
major=${major#v}

# Apply version bump
case $BUMP_TYPE in
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  patch)
    patch=$((patch + 1))
    ;;
  *)
    echo "Invalid bump type: $BUMP_TYPE. Must be major, minor, or patch" >&2
    exit 1
    ;;
esac

NEW_VERSION="${major}.${minor}.${patch}"
echo "$NEW_VERSION"
