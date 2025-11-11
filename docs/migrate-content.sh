#!/usr/bin/env bash

# Content migration script for Jekyll to Astro/Starlight

set -e

SOURCE_DIR="../docs-jekyll-backup"
TARGET_DIR="./src/content/docs"

# Function to convert Jekyll frontmatter to Starlight format
convert_frontmatter() {
    local file="$1"
    local output="$2"
    
    # Extract title and description if present
    local title=$(grep "^title:" "$file" | sed 's/title: //' | tr -d '\r')
    local desc=$(grep "^description:" "$file" | sed 's/description: //' | tr -d '\r')
    
    # Create Starlight frontmatter
    echo "---" > "$output"
    if [ -n "$title" ]; then
        echo "title: $title" >> "$output"
    fi
    if [ -n "$desc" ]; then
        echo "description: $desc" >> "$output"
    fi
    echo "---" >> "$output"
    echo "" >> "$output"
    
    # Add content without original frontmatter
    awk '/^---/{if(++c==2){p=1;next}}p' "$file" >> "$output"
}

# Function to update internal links
update_links() {
    local file="$1"
    
    # Update markdown links
    sed -i.bak -E \
        -e 's|\[([^\]]+)\]\(USER_GUIDE\.md([#][^)]+)?\)|[\1](/user-guide/\2)|g' \
        -e 's|\[([^\]]+)\]\(API\.md([#][^)]+)?\)|[\1](/api/\2)|g' \
        -e 's|\[([^\]]+)\]\(ARCHITECTURE\.md([#][^)]+)?\)|[\1](/architecture/\2)|g' \
        -e 's|\[([^\]]+)\]\(DEVELOPMENT\.md([#][^)]+)?\)|[\1](/development/\2)|g' \
        -e 's|\[([^\]]+)\]\(DEPLOYMENT\.md([#][^)]+)?\)|[\1](/deployment/\2)|g' \
        -e 's|\[([^\]]+)\]\(PIPELINE\.md([#][^)]+)?\)|[\1](/pipeline/\2)|g' \
        -e 's|\[([^\]]+)\]\(TROUBLESHOOTING\.md([#][^)]+)?\)|[\1](/troubleshooting/\2)|g' \
        -e 's|\[([^\]]+)\]\(ONBOARDING\.md([#][^)]+)?\)|[\1](/onboarding/\2)|g' \
        -e 's|\[([^\]]+)\]\(VALIDATE_SCHEMA\.md([#][^)]+)?\)|[\1](/validate-schema/\2)|g' \
        -e 's|\[([^\]]+)\]\(README\.md([#][^)]+)?\)|[\1](/\2)|g' \
        -e 's|\[([^\]]+)\]\(github-workflows/README\.md([#][^)]+)?\)|[\1](/github-workflows/\2)|g' \
        -e 's|\[([^\]]+)\]\(github-workflows/([^)]+)\.md([#][^)]+)?\)|[\1](/github-workflows/\2/\3)|g' \
        -e 's|\[([^\]]+)\]\(schemas/README\.md([#][^)]+)?\)|[\1](/schemas/\2)|g' \
        -e 's|\[([^\]]+)\]\(\.\./CONTRIBUTING\.md\)|[\1](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)|g' \
        "$file"
    
    rm -f "$file.bak"
}

# Convert callouts
convert_callouts() {
    local file="$1"
    
    # Convert GitHub-style callouts to Starlight asides
    sed -i.bak -E \
        -e 's|> \[!NOTE\]|:::note|g' \
        -e 's|> \[!TIP\]|:::tip|g' \
        -e 's|> \[!WARNING\]|:::caution|g' \
        -e 's|> \[!IMPORTANT\]|:::note[Important]|g' \
        -e 's|> \[!CAUTION\]|:::caution|g' \
        "$file"
    
    # Add closing ::: for callouts (simple approach - may need manual review)
    # This is a basic conversion; complex callouts may need manual fixing
    
    rm -f "$file.bak"
}

echo "Starting content migration..."

# Migrate main content files
declare -A files=(
    ["index.md"]="index.mdx"
    ["USER_GUIDE.md"]="user-guide.md"
    ["API.md"]="api.md"
    ["ARCHITECTURE.md"]="architecture.md"
    ["DEVELOPMENT.md"]="development.md"
    ["DEPLOYMENT.md"]="deployment.md"
    ["PIPELINE.md"]="pipeline.md"
    ["TROUBLESHOOTING.md"]="troubleshooting.md"
    ["ONBOARDING.md"]="onboarding.md"
    ["VALIDATE_SCHEMA.md"]="validate-schema.md"
)

for src in "${!files[@]}"; do
    target="${files[$src]}"
    if [ -f "$SOURCE_DIR/$src" ]; then
        echo "Migrating $src to $target..."
        convert_frontmatter "$SOURCE_DIR/$src" "$TARGET_DIR/$target"
        update_links "$TARGET_DIR/$target"
        convert_callouts "$TARGET_DIR/$target"
    fi
done

# Migrate GitHub Workflows subdirectory
if [ -d "$SOURCE_DIR/github-workflows" ]; then
    echo "Migrating github-workflows directory..."
    for file in "$SOURCE_DIR/github-workflows"/*.md; do
        if [ -f "$file" ]; then
            basename=$(basename "$file")
            target_name="${basename%.md}"
            
            # README.md becomes index.md
            if [ "$basename" = "README.md" ]; then
                target_name="index"
            fi
            
            target_file="$TARGET_DIR/github-workflows/$target_name.md"
            echo "  - $basename to github-workflows/$target_name.md"
            convert_frontmatter "$file" "$target_file"
            update_links "$target_file"
            convert_callouts "$target_file"
        fi
    done
fi

# Migrate Schemas subdirectory
if [ -d "$SOURCE_DIR/schemas" ]; then
    echo "Migrating schemas directory..."
    
    # Migrate README.md to index.md
    if [ -f "$SOURCE_DIR/schemas/README.md" ]; then
        echo "  - README.md to schemas/index.md"
        convert_frontmatter "$SOURCE_DIR/schemas/README.md" "$TARGET_DIR/schemas/index.md"
        update_links "$TARGET_DIR/schemas/index.md"
        convert_callouts "$TARGET_DIR/schemas/index.md"
    fi
    
    # Copy JSON schema files
    for file in "$SOURCE_DIR/schemas"/*.{json,example}; do
        if [ -f "$file" ]; then
            basename=$(basename "$file")
            echo "  - Copying $basename"
            cp "$file" "$TARGET_DIR/schemas/$basename"
        fi
    done
fi

echo "Content migration complete!"
echo ""
echo "Manual review needed for:"
echo "  - index.mdx (HTML/MDX conversion)"
echo "  - Complex callouts (may need closing :::)"
echo "  - Code block titles"
echo "  - Image paths (if any)"
