# Documentation Link Validation & Fixing Tools

This directory contains tools for validating and fixing internal links in the project documentation.

## Tools Overview

### 1. `validate-docs-links.cjs` - Link Validation Script

Validates all internal markdown links in `docs/src/content/docs/` to ensure they point to existing files and sections.

**Features:**

- ✅ Validates markdown links in all documentation files
- ✅ Checks if linked files exist
- ✅ Validates section anchors (heading references)
- ✅ Reports broken links with line numbers
- ✅ Generates comprehensive summary report
- ✅ Tracks external links separately
- ✅ Exit code 0 for success, 1 for broken links (CI/CD friendly)

**Usage:**

```bash
# Run validation
node scripts/validate-docs-links.cjs

# Or use npm script
bun run validate:docs-links
```

**Output:**

- Summary of files scanned and links found
- List of all broken links with file locations and line numbers
- List of missing files
- List of missing anchors
- External links summary by domain

### 2. `fix-doc-links.sh` - Automated Link Fixer

Automatically fixes the most common broken link patterns in documentation.

**Features:**

- ✅ Removes trailing slashes from internal links (`/path/` → `/path`)
- ✅ Fixes relative parent directory references (`../README.md` → GitHub URL)
- ✅ Creates automatic backups before changes
- ✅ Supports dry-run mode to preview changes
- ✅ Colored terminal output
- ✅ Progress reporting

**Usage:**

```bash
# Preview changes without applying them
./scripts/fix-doc-links.sh --dry-run
# Or: bun run fix:docs-links:dry-run

# Apply fixes with backup (default)
./scripts/fix-doc-links.sh
# Or: bun run fix:docs-links

# Apply fixes without backup
./scripts/fix-doc-links.sh --no-backup

# Just create backup without applying fixes
./scripts/fix-doc-links.sh --backup --dry-run
```

**Fixes Applied:**

1. **Trailing slash removal**: `/user-guide/` → `/user-guide`
2. **Parent README references**: `../README.md` → GitHub link
3. **Parent LICENSE references**: `../LICENSE` → GitHub link
4. **Parent SECURITY references**: `../SECURITY.md` → GitHub link
5. **Invalid src/content paths**: Converted to GitHub links

## Workflow

### Initial Setup

1. **Install dependencies** (if not already installed):

   ```bash
   bun install
   ```

2. **Make scripts executable**:
   ```bash
   chmod +x scripts/fix-doc-links.sh
   ```

### Regular Usage

#### Step 1: Validate Documentation

```bash
# Check current state
bun run validate:docs-links
```

This will output:

- Total files scanned
- Total links found
- Number of valid vs broken links
- Detailed breakdown of issues

#### Step 2: Preview Fixes

```bash
# See what would be fixed without making changes
bun run fix:docs-links:dry-run
```

Review the output to understand what will be changed.

#### Step 3: Apply Automated Fixes

```bash
# Apply fixes (creates backup automatically)
bun run fix:docs-links
```

The script will:

- Create backup at `docs/src/content/docs.backup/`
- Apply all automated fixes
- Report number of fixes applied
- Show next steps

#### Step 4: Re-validate

```bash
# Check if fixes worked
bun run validate:docs-links
```

#### Step 5: Manual Fixes

For remaining broken links, manually fix:

- Missing anchor sections
- Special cases not covered by automation
- Logic errors in link destinations

#### Step 6: Test Documentation

```bash
# Build and preview locally
cd docs
bun run dev
# Visit http://localhost:4321

# Test production build
bun run build
bun run preview
```

Click through navigation and verify all links work.

### Emergency Rollback

If something goes wrong:

```bash
# Restore from backup
rm -rf docs/src/content/docs
mv docs/src/content/docs.backup docs/src/content/docs
```

## NPM Scripts Reference

Add these to your workflow:

```bash
# Validation
bun run validate:docs-links       # Validate all doc links

# Fixing
bun run fix:docs-links:dry-run    # Preview fixes
bun run fix:docs-links            # Apply fixes

# Testing
bun run docs:dev                  # Start dev server
bun run docs:build                # Build production site
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Validate Documentation

on:
  pull_request:
    paths:
      - 'docs/**'
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  validate-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Validate documentation links
        run: bun run validate:docs-links
```

## Common Issues & Solutions

### Issue: Trailing Slashes

**Problem**: Links like `/user-guide/` don't resolve correctly

**Solution**: Run `bun run fix:docs-links` to remove trailing slashes

### Issue: Missing Anchors

**Problem**: Links to `#section-name` but section doesn't exist

**Solution**: Either:

1. Add the missing section to the target file
2. Update link to point to correct section
3. Remove anchor if not needed

### Issue: Relative Path References

**Problem**: Links like `../README.md` don't work in docs structure

**Solution**: Convert to absolute GitHub URLs (automated by fix script)

### Issue: External Links Broken

**Problem**: External website links return 404

**Solution**: Update or remove broken external links (not automated)

## Report Files

### `docs/LINK-VALIDATION-REPORT.md`

Comprehensive report generated after running validation, containing:

- Executive summary
- Root cause analysis
- Breakdown by file
- Recommended actions
- Implementation plan
- Success criteria

**Generated by**: `validate-docs-links.cjs`

## Best Practices

1. **Run validation before committing**:

   ```bash
   bun run validate:docs-links
   ```

2. **Use dry-run first**:

   ```bash
   bun run fix:docs-links:dry-run
   ```

3. **Always review changes**:

   ```bash
   git diff docs/
   ```

4. **Test locally after fixes**:

   ```bash
   cd docs && bun run dev
   ```

5. **Commit validation report**:
   ```bash
   git add docs/LINK-VALIDATION-REPORT.md
   git commit -m "docs: Update link validation report"
   ```

## Troubleshooting

### Script Won't Run

```bash
# Make executable
chmod +x scripts/fix-doc-links.sh

# Check Node.js version (needs 18+)
node --version
```

### Backup Already Exists

```bash
# Remove old backup
rm -rf docs/src/content/docs.backup

# Or rename it
mv docs/src/content/docs.backup docs/src/content/docs.backup.old
```

### Permission Denied

```bash
# Fix permissions
chmod +x scripts/fix-doc-links.sh
chmod +x scripts/validate-docs-links.cjs
```

## Technical Details

### Link Resolution Logic

The validator resolves links using this hierarchy:

1. **External links**: Skip validation (tracked separately)
2. **Anchor-only links** (`#section`): Check current file
3. **Absolute links** (`/path`): Resolve from docs root
4. **Relative links** (`./path`, `../path`): Resolve from current file location

### Anchor Generation

Section headings are converted to anchors using:

```javascript
anchor = heading
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-');
```

Example: `## Getting Started` → `#getting-started`

### File Extensions

Links without extensions are automatically checked for `.md`:

- `/user-guide` → checks for `user-guide.md`
- `/api/` → checks for `api/.md` (invalid)

## Future Enhancements

Potential improvements:

1. **External link validation**: Check HTTP status of external links
2. **Dead code detection**: Find unused images and assets
3. **Link suggestions**: Suggest correct links for broken ones
4. **Auto-fix anchors**: Automatically update incorrect anchor references
5. **VS Code extension**: Real-time link validation in editor
6. **Pre-commit hook**: Auto-validate before git commit

## Support

For issues or questions:

- Check this README first
- Review `docs/LINK-VALIDATION-REPORT.md`
- Open an issue on GitHub
- Contact: support@pantheon-ai.com

## License

MIT License - Same as project license

---

**Last Updated**: 2025-11-17  
**Maintained By**: Pantheon AI Team
