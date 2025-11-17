#!/bin/bash

###############################################################################
# Documentation Link Fixer - Simplified Version
#
# This script fixes common broken link patterns in documentation.
#
# Usage:
#   ./scripts/fix-doc-links.sh
#
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOCS_DIR="docs/src/content/docs"
BACKUP_DIR="docs/src/content/docs.backup"

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                     Documentation Link Fixer                             ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if docs directory exists
if [ ! -d "$DOCS_DIR" ]; then
  echo -e "${RED}Error: Documentation directory not found: $DOCS_DIR${NC}"
  exit 1
fi

# Create backup
echo -e "${BLUE}Creating backup...${NC}"
if [ -d "$BACKUP_DIR" ]; then
  echo -e "${YELLOW}Warning: Backup already exists${NC}"
  read -p "Overwrite? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
  fi
  rm -rf "$BACKUP_DIR"
fi
cp -r "$DOCS_DIR" "$BACKUP_DIR"
echo -e "${GREEN}✓ Backup created${NC}"
echo ""

# Count files
TOTAL_FILES=$(find "$DOCS_DIR" -name "*.md" -type f | wc -l | tr -d ' ')
echo -e "${BLUE}Found $TOTAL_FILES markdown files${NC}"
echo ""

echo "════════════════════════════════════════════════════════════════════════════"
echo "                              Applying Fixes                                "
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

# Fix 1: Remove trailing slashes from internal links
echo -e "${YELLOW}Fix 1: Removing trailing slashes from internal links${NC}"
COUNT=0
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
  if grep -q '](/[^)]*/)' "$file" 2>/dev/null; then
    # Use perl for more reliable regex replacement
    perl -i -pe 's|\]\((/[^)]*)/\)|]($1)|g' "$file"
    MATCHES=$(grep -o '](/' "$file" | wc -l | tr -d ' ')
    echo "  Fixed: $(basename "$file")"
    COUNT=$((COUNT + 1))
  fi
done
echo -e "${GREEN}✓ Processed files${NC}"
echo ""

# Fix 2: Fix ../README.md references
echo -e "${YELLOW}Fix 2: Fixing ../README.md references${NC}"
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
  if grep -q '\.\./README\.md' "$file" 2>/dev/null; then
    sed -i '' 's|../README\.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/README.md|g' "$file"
    echo "  Fixed: $(basename "$file")"
  fi
done
echo -e "${GREEN}✓ Processed files${NC}"
echo ""

# Fix 3: Fix ../LICENSE references
echo -e "${YELLOW}Fix 3: Fixing ../LICENSE references${NC}"
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
  if grep -q '\.\./LICENSE' "$file" 2>/dev/null; then
    sed -i '' 's|../LICENSE|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/LICENSE|g' "$file"
    echo "  Fixed: $(basename "$file")"
  fi
done
echo -e "${GREEN}✓ Processed files${NC}"
echo ""

# Fix 4: Fix ../SECURITY.md references
echo -e "${YELLOW}Fix 4: Fixing ../SECURITY.md references${NC}"
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
  if grep -q '\.\./SECURITY\.md' "$file" 2>/dev/null; then
    sed -i '' 's|../SECURITY\.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/SECURITY.md|g' "$file"
    echo "  Fixed: $(basename "$file")"
  fi
done
echo -e "${GREEN}✓ Processed files${NC}"
echo ""

# Fix 5: Fix src/content/README.md references
echo -e "${YELLOW}Fix 5: Fixing src/content/README.md references${NC}"
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
  if grep -q 'src/content/README\.md' "$file" 2>/dev/null; then
    sed -i '' 's|src/content/README\.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/README.md|g' "$file"
    echo "  Fixed: $(basename "$file")"
  fi
done
echo -e "${GREEN}✓ Processed files${NC}"
echo ""

# Summary
echo "════════════════════════════════════════════════════════════════════════════"
echo "                                 Summary                                    "
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}FIXES APPLIED${NC}"
echo ""
echo "Next steps:"
echo "  1. Run validation: bun run validate:docs-links"
echo "  2. Review changes: git diff docs/"
echo "  3. Test locally: cd docs && bun run dev"
echo ""
echo "To restore from backup:"
echo "  rm -rf $DOCS_DIR"
echo "  mv $BACKUP_DIR $DOCS_DIR"
echo ""
echo -e "${BLUE}Done!${NC}"
