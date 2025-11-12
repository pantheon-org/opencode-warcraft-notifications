#!/usr/bin/env bash
set -e

# Create version bump PR
# Usage: create-version-pr.sh <new_version> <current_version> <version_type> <branch_name>

NEW_VERSION="$1"
CURRENT_VERSION="$2"
VERSION_TYPE="$3"
BRANCH_NAME="$4"

if [ -z "$NEW_VERSION" ] || [ -z "$CURRENT_VERSION" ] || [ -z "$VERSION_TYPE" ] || [ -z "$BRANCH_NAME" ]; then
  echo "Usage: create-version-pr.sh <new_version> <current_version> <version_type> <branch_name>" >&2
  exit 1
fi

# Configure git
git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"

# Create branch
git checkout -b "$BRANCH_NAME"

# Update package.json
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Commit changes
git add package.json
git commit -m "chore: bump version to $NEW_VERSION

Version Type: $VERSION_TYPE
Previous Version: $CURRENT_VERSION"

# Push branch
git push origin "$BRANCH_NAME"

# Generate PR body
COMMITS_PREVIEW=$(cat commits.txt 2>/dev/null | head -20 || echo "No commit history available")

# Create PR
gh pr create \
  --title "chore: bump version to v${NEW_VERSION}" \
  --body "## Version Bump: v${CURRENT_VERSION} → v${NEW_VERSION}

### Analysis
- **Type**: ${VERSION_TYPE^^}
- **Current Version**: ${CURRENT_VERSION}
- **New Version**: ${NEW_VERSION}

### Changes Since Last Release
\`\`\`
${COMMITS_PREVIEW}
\`\`\`

### Next Steps
1. ✅ This PR will be reviewed and auto-merged
2. 🏷️ A git tag v${NEW_VERSION} will be created after merge
3. 📦 npm package will be published automatically
4. 📚 Documentation will be updated

---
*This PR was automatically created by the Version Update workflow.*" \
  --base main \
  --head "$BRANCH_NAME" \
  --label "version-bump,automation"

echo "✅ Created version bump PR for v${NEW_VERSION}"
