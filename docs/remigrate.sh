#!/usr/bin/env bash
set -e

SRC="../docs-jekyll-backup"
DEST="src/content/docs"

echo "Re-migrating content with proper frontmatter..."

# Function to add frontmatter and copy content
migrate_file() {
    local src_file="$1"
    local dest_file="$2"
    local title="$3"
    local description="$4"
    
    {
        echo "---"
        echo "title: $title"
        echo "description: $description"
        echo "---"
        echo ""
        cat "$src_file"
    } > "$dest_file"
    
    echo "  ✓ $(basename $dest_file)"
}

# Main pages
echo "Main pages:"
migrate_file "$SRC/USER_GUIDE.md" "$DEST/user-guide.md" "User Guide" "Installation, configuration, and usage guide"
migrate_file "$SRC/API.md" "$DEST/api.md" "API Documentation" "Complete API reference for the plugin"
migrate_file "$SRC/ARCHITECTURE.md" "$DEST/architecture.md" "Architecture" "System architecture and design"
migrate_file "$SRC/DEVELOPMENT.md" "$DEST/development.md" "Development Guide" "Development setup and contributing"
migrate_file "$SRC/DEPLOYMENT.md" "$DEST/deployment.md" "Deployment Guide" "Installation and deployment instructions"
migrate_file "$SRC/PIPELINE.md" "$DEST/pipeline.md" "CI/CD Pipeline" "Automated release pipeline documentation"
migrate_file "$SRC/TROUBLESHOOTING.md" "$DEST/troubleshooting.md" "Troubleshooting" "Common issues and solutions"
migrate_file "$SRC/ONBOARDING.md" "$DEST/onboarding.md" "Onboarding" "New contributor onboarding guide"
migrate_file "$SRC/VALIDATE_SCHEMA.md" "$DEST/validate-schema.md" "Schema Validation" "JSON schema validation guide"

echo ""
echo "GitHub Workflows:"
migrate_file "$SRC/github-workflows/README.md" "$DEST/github-workflows/index.md" "GitHub Workflows" "CI/CD workflows and automation"
migrate_file "$SRC/github-workflows/architecture-summary.md" "$DEST/github-workflows/architecture-summary.md" "Workflow Architecture" "Architecture of the CI/CD system"
migrate_file "$SRC/github-workflows/cleanup-old-releases.md" "$DEST/github-workflows/cleanup-old-releases.md" "Cleanup Old Releases" "Automated release cleanup workflow"
migrate_file "$SRC/github-workflows/cycle-prevention-fix.md" "$DEST/github-workflows/cycle-prevention-fix.md" "Cycle Prevention" "Preventing workflow cycles"
migrate_file "$SRC/github-workflows/overview.md" "$DEST/github-workflows/overview.md" "Workflows Overview" "Overview of all workflows"
migrate_file "$SRC/github-workflows/setup-guide.md" "$DEST/github-workflows/setup-guide.md" "Setup Guide" "Setting up GitHub workflows"
migrate_file "$SRC/github-workflows/squash-merge-configuration.md" "$DEST/github-workflows/squash-merge-configuration.md" "Squash Merge Config" "Configuring squash merge workflows"

echo ""
echo "Schemas:"
migrate_file "$SRC/schemas/README.md" "$DEST/schemas/index.md" "Plugin Schema" "JSON schema for plugin configuration"

echo ""
echo "Homepage:"
# Index.md special handling
{
    echo "---"
    echo "title: Home"
    echo "description: Warcraft II Notifications Plugin for OpenCode"
    echo "---"
    echo ""
    cat "$SRC/index.md"
} > "$DEST/index.mdx"
echo "  ✓ index.mdx"

echo ""
echo "✅ All files re-migrated with full content!"
