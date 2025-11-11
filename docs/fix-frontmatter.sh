#!/usr/bin/env bash
set -e

DOCS_DIR="src/content/docs"
JEKYLL_BACKUP="../docs-jekyll-backup"

# Function to extract first heading from file
extract_title() {
    local file="$1"
    # Get first # heading and remove the # symbols
    grep -m 1 "^#[^#]" "$file" 2>/dev/null | sed 's/^#* *//' | sed 's/ *$//' || echo ""
}

# Function to create frontmatter block
create_frontmatter() {
    local title="$1"
    local description="$2"
    
    echo "---"
    echo "title: $title"
    if [ -n "$description" ]; then
        echo "description: $description"
    fi
    echo "---"
    echo ""
}

# Function to update file with frontmatter
update_file() {
    local file="$1"
    local title="$2"
    local description="$3"
    
    # Check if file already has proper frontmatter
    if head -5 "$file" | grep -q "^title:"; then
        echo "  ✓ $file (already has frontmatter)"
        return
    fi
    
    # Remove empty frontmatter if present
    local content_start=1
    if head -3 "$file" | grep -q "^---$"; then
        # Find where content starts (after second ---)
        content_start=$(awk '/^---$/{c++; if(c==2){print NR+1; exit}}' "$file")
    fi
    
    # Extract content
    tail -n +$content_start "$file" > "$file.tmp"
    
    # Create new file with frontmatter
    {
        create_frontmatter "$title" "$description"
        cat "$file.tmp"
    } > "$file.new"
    
    mv "$file.new" "$file"
    rm "$file.tmp"
    
    echo "  ✓ $file"
}

echo "Fixing frontmatter for all content files..."
echo ""

# Main content files
echo "Main pages:"
update_file "$DOCS_DIR/user-guide.md" "User Guide" "Installation, configuration, and usage guide"
update_file "$DOCS_DIR/api.md" "API Documentation" "Complete API reference for the plugin"
update_file "$DOCS_DIR/architecture.md" "Architecture" "System architecture and design"
update_file "$DOCS_DIR/development.md" "Development Guide" "Development setup and contributing"
update_file "$DOCS_DIR/deployment.md" "Deployment Guide" "Installation and deployment instructions"
update_file "$DOCS_DIR/pipeline.md" "CI/CD Pipeline" "Automated release pipeline documentation"
update_file "$DOCS_DIR/troubleshooting.md" "Troubleshooting" "Common issues and solutions"
update_file "$DOCS_DIR/onboarding.md" "Onboarding" "New contributor onboarding guide"
update_file "$DOCS_DIR/validate-schema.md" "Schema Validation" "JSON schema validation guide"

echo ""
echo "GitHub Workflows:"
update_file "$DOCS_DIR/github-workflows/index.md" "GitHub Workflows" "CI/CD workflows and automation"
update_file "$DOCS_DIR/github-workflows/architecture-summary.md" "Workflow Architecture" "Architecture of the CI/CD system"
update_file "$DOCS_DIR/github-workflows/cleanup-old-releases.md" "Cleanup Old Releases" "Automated release cleanup workflow"
update_file "$DOCS_DIR/github-workflows/cycle-prevention-fix.md" "Cycle Prevention" "Preventing workflow cycles"
update_file "$DOCS_DIR/github-workflows/overview.md" "Workflows Overview" "Overview of all workflows"
update_file "$DOCS_DIR/github-workflows/setup-guide.md" "Setup Guide" "Setting up GitHub workflows"
update_file "$DOCS_DIR/github-workflows/squash-merge-configuration.md" "Squash Merge Config" "Configuring squash merge workflows"

echo ""
echo "Schemas:"
update_file "$DOCS_DIR/schemas/index.md" "Plugin Schema" "JSON schema for plugin configuration"

echo ""
echo "Homepage (index.mdx):"
# Index needs special handling - it's already converted
if ! head -5 "$DOCS_DIR/index.mdx" | grep -q "^title:"; then
    echo "  ✓ Adding frontmatter to index.mdx"
    sed -i.bak '1i\
---\
title: Home\
description: Warcraft II Notifications Plugin for OpenCode\
---\
' "$DOCS_DIR/index.mdx"
    rm "$DOCS_DIR/index.mdx.bak"
fi

echo ""
echo "✅ All frontmatter fixed!"
echo ""
echo "Next steps:"
echo "  1. Run 'bun run build' to verify pages build"
echo "  2. Check for '18 page(s) built' message"
