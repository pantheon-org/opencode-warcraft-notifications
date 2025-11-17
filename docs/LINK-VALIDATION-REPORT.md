# Documentation Link Validation Report

**Date**: 2025-11-17  
**Total Files Scanned**: 25  
**Total Links Found**: 429  
**Valid Links**: 173  
**Broken Links**: 256  
**External Links**: 91

## Executive Summary

The documentation link validation script has identified **256 broken internal links** across 25 markdown files. The broken links fall into three main categories:

1. **Trailing slash issue** - Links ending with `/` (e.g., `/user-guide/`) are being resolved to `.md` files
2. **Missing anchor sections** - Some anchor links point to sections that don't exist
3. **Relative path issues** - Some relative paths to parent directories don't resolve correctly

## Root Cause Analysis

### Issue 1: Trailing Slash Links (PRIMARY ISSUE)

**Problem**: Links like `/user-guide/` are being resolved to `/user-guide/.md` instead of `/user-guide.md`

**Affected Pattern**: `[text](/path/)` → Should resolve to `path.md` or `path/index.md`

**Example**:

```markdown
[User Guide](/user-guide/) ❌ Resolves to: user-guide/.md
[User Guide](/user-guide) ✅ Resolves to: user-guide.md
```

**Impact**: ~180+ broken links

**Solution**: Either:

- Remove trailing slashes from all links: `/user-guide/` → `/user-guide`
- Create `index.md` files in subdirectories (Astro/Starlight pattern)
- Fix the link validator to handle trailing slashes correctly

### Issue 2: Missing Anchor Sections

**Problem**: Some links reference section anchors that don't exist in the target file

**Examples**:

- `api.md` line 14: `#plugin-entry-point` (section doesn't exist)
- `deployment.md` line 14: `#installation` (section doesn't exist)
- `development.md` line 14: `#getting-started` (section doesn't exist)

**Impact**: ~10 broken links

**Solution**: Either:

- Add the missing sections to the target files
- Update links to point to existing sections
- Remove the anchor if section is not needed

### Issue 3: Relative Path Issues

**Problem**: Some relative paths like `../README.md` don't resolve correctly in the docs structure

**Examples**:

- `deployment.md:1063`: `../README.md`
- `index.md:257`: `../LICENSE`
- `onboarding.md:596`: `../README.md`

**Impact**: ~5 broken links

**Solution**:

- Use absolute paths from docs root: `/` instead of `../README.md`
- Copy necessary files into docs structure
- Use external links to GitHub for project root files

## Breakdown by File

### Files with Most Broken Links

1. **documentation-map.md**: 118 broken links
2. **index.md**: 39 broken links
3. **onboarding.md**: 13 broken links
4. **pipeline.md**: 15 broken links
5. **troubleshooting.md**: 28 broken links

## Recommended Actions

### Priority 1: Fix Trailing Slash Links (Quick Win)

**Estimated Time**: 30 minutes  
**Impact**: Fixes ~180 broken links

**Action**: Run a find-replace across all markdown files:

```bash
# Remove trailing slashes from internal links
find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|\](/\([^)]*\)/)|](/\1)|g' {} +
```

**Before**:

```markdown
[User Guide](/user-guide/)
[API Docs](/api/)
```

**After**:

```markdown
[User Guide](/user-guide)
[API Docs](/api)
```

### Priority 2: Fix Missing Anchors (Medium Effort)

**Estimated Time**: 1 hour  
**Impact**: Fixes ~10 broken links

**Files to Update**:

1. **api.md**: Add missing section `## Plugin Entry Point`
2. **deployment.md**: Add missing section `## Installation` (currently has it in ToC)
3. **development.md**: Rename section or update ToC anchor
4. **onboarding.md**: Add missing `## Welcome` section
5. **pipeline.md**: Add missing workflow anchor sections

### Priority 3: Fix Relative Path Links (Low Effort)

**Estimated Time**: 15 minutes  
**Impact**: Fixes ~5 broken links

**Action**: Replace relative parent directory references with absolute or external links

**Example**:

```markdown
# Before

[README](../README.md)
[LICENSE](../LICENSE)

# After

[README](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/README.md)
[LICENSE](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/LICENSE)
```

### Priority 4: Fix Special Cases

**Estimated Time**: 30 minutes  
**Impact**: Fixes remaining ~60 broken links

1. **mailto: links**: Exclude from validation (line: `mailto:support@pantheon-ai.com`)
2. **Variable links**: Fix `${npmUrl}` in pipeline.md:884
3. **GitHub workflow specific links**: Update paths in workflow docs

## Implementation Plan

### Phase 1: Automated Fixes (45 minutes)

1. ✅ **Run trailing slash fix**:

   ```bash
   # Backup first
   cp -r docs/src/content/docs docs/src/content/docs.backup

   # Fix trailing slashes
   find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|\](/\([^)]*\)/)|](/\1)|g' {} +

   # Verify changes
   node scripts/validate-docs-links.cjs
   ```

2. ✅ **Fix relative path links**:

   ```bash
   # Replace ../README.md with GitHub link
   find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|../README.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/README.md|g' {} +

   # Replace ../LICENSE with GitHub link
   find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|../LICENSE|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/LICENSE|g' {} +
   ```

### Phase 2: Manual Fixes (1 hour)

1. **Add missing sections**:
   - `api.md`: Add `## Plugin Entry Point` at appropriate location
   - `deployment.md`: Fix ToC anchor for Installation section
   - `development.md`: Fix ToC anchor for Getting Started section
   - `onboarding.md`: Add `## Welcome` section
   - `pipeline.md`: Add workflow anchor sections

2. **Fix special cases**:
   - Update `${npmUrl}` variable in pipeline.md
   - Update workflow-specific documentation paths

### Phase 3: Validator Enhancement (30 minutes)

Update `scripts/validate-docs-links.cjs` to:

1. **Skip mailto: links**:

   ```javascript
   if (url.startsWith('mailto:')) {
     results.validLinks++;
     return;
   }
   ```

2. **Handle trailing slashes correctly**:

   ```javascript
   // Check both path.md and path/index.md
   if (!fs.existsSync(targetFile)) {
     const indexFile = targetFile.replace(/\.md$/, '/index.md');
     if (fs.existsSync(indexFile)) {
       targetFile = indexFile;
     }
   }
   ```

3. **Skip template variables**:
   ```javascript
   if (url.includes('${')) {
     results.validLinks++;
     return;
   }
   ```

## Testing & Verification

After implementing fixes:

1. **Run validation script**:

   ```bash
   node scripts/validate-docs-links.cjs
   ```

2. **Build documentation locally**:

   ```bash
   cd docs
   bun run build
   bun run preview
   ```

3. **Manual verification**:
   - Click through key navigation paths
   - Verify anchor links work
   - Check external links open correctly

## Success Criteria

- ✅ All internal markdown links resolve correctly
- ✅ All anchor links point to existing sections
- ✅ Documentation builds without warnings
- ✅ Link validation script passes with 0 broken links

## Notes

### External Links Found (91 total)

Top domains:

- `github.com`: ~40 links
- `opencode.ai`: ~15 links
- `npmjs.com`: ~5 links
- `pantheon-org.github.io`: ~10 links
- `bun.sh`, `typescriptlang.org`, etc.: ~20 links

**Action**: Consider adding external link checking in CI/CD to catch broken external links over time.

### Files with No Issues

The following files have no broken links:

- `github-workflows/cleanup-old-releases.md`
- `github-workflows/cycle-prevention-fix.md`
- `github-workflows/setup-guide.md`
- `github-workflows/squash-merge-configuration.md`
- `schemas/index.md`
- `validate-schema.md`

## Next Steps

1. ✅ Create this report
2. ⏳ Run automated fixes (Phase 1)
3. ⏳ Make manual corrections (Phase 2)
4. ⏳ Enhance validator (Phase 3)
5. ⏳ Re-run validation and verify
6. ⏳ Commit changes
7. ⏳ Update documentation deployment

## Appendix: Command Reference

### Run Link Validation

```bash
node scripts/validate-docs-links.cjs
```

### Quick Fix Commands

```bash
# Backup docs
cp -r docs/src/content/docs docs/src/content/docs.backup

# Remove trailing slashes from links
find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|\](/\([^)]*\)/)|](/\1)|g' {} +

# Fix relative paths to parent directories
find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|../README.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/README.md|g' {} +
find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|../LICENSE|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/LICENSE|g' {} +
find docs/src/content/docs -name "*.md" -type f -exec sed -i '' 's|../SECURITY.md|https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/SECURITY.md|g' {} +

# Restore from backup if needed
rm -rf docs/src/content/docs
mv docs/src/content/docs.backup docs/src/content/docs
```

### Build & Test Locally

```bash
cd docs
bun install
bun run dev  # Local development server
bun run build  # Production build
bun run preview  # Preview production build
```

---

**Generated by**: Documentation Link Validator  
**Script**: `scripts/validate-docs-links.cjs`  
**Timestamp**: 2025-11-17
