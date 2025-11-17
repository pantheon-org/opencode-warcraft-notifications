# Link Fixing Solution for GitHub Pages Deployment

## Problem

When deploying an Astro/Starlight site to GitHub Pages with a base path (e.g., `/opencode-warcraft-notifications`), some internal links in markdown content were not being rewritten with the base path, resulting in broken links.

## Root Cause

Astro's base path configuration (`base: '/opencode-warcraft-notifications'`) correctly handles most links, but links in markdown content that reference other pages (e.g., `[Guide](/user-guide/)`) were being rendered as-is without the base path, resulting in broken 404 links like `https://pantheon-org.github.io/user-guide/` instead of `https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/`.

## Solution

A two-part automated solution:

### 1. Link Fixing Script (`fix-links.js`)

A post-build script that:

- Scans all HTML files in the `dist/` directory
- Identifies internal links missing the base path
- Adds the base path to those links
- Preserves external links, anchors, and assets

The script uses regex pattern matching to find links like `href="/user-guide/"` and converts them to `href="/opencode-warcraft-notifications/user-guide/"`.

### 2. Link Verification Script (`test-links.js`)

A testing script that:

- Extracts all internal links from HTML files
- Verifies each link points to an existing file or resource
- Reports any broken or missing links
- Checks that all links have the correct base path

## Implementation

### Package.json Scripts

```json
{
  "scripts": {
    "fix-links": "node fix-links.js",
    "test-links": "node test-links.js",
    "build": "bun run transform && astro build && bun run fix-links",
    "verify": "bun run test-links"
  }
}
```

The `build` script automatically runs `fix-links` after the Astro build completes.

### CI/CD Integration

The GitHub Actions workflow (`deploy-docs.yml`) uses `bun run build`, which automatically includes the link fixing step. No workflow changes were needed.

## Testing

### Manual Testing

```bash
# Build the site
cd pages
bun run build

# Verify all links
bun run verify
```

### Expected Output

```
🔍 Testing internal links in HTML files...

Base path: /opencode-warcraft-notifications
Dist directory: /Users/thomas.roche/Projects/github/pantheon-org/opencode-warcraft-notifications/pages/dist

Found 99 unique internal link(s)

✅ All internal links are valid!
```

## Files Modified

### New Files

1. `pages/fix-links.js` - Post-build link fixing script
2. `pages/test-links.js` - Link verification test script
3. `pages/LINK-FIX-README.md` - This documentation

### Modified Files

1. `pages/package.json` - Added new scripts
2. `docs/github-workflows/migration-guide.md` - Fixed contributing link to use external URL

## How It Works

### Link Fixing Process

1. **Pattern Matching**: Uses regex `/href="(\/(?!opencode-warcraft-notifications(?:\/|"|$))(?:[^"#\s][^"]*?)?)"/g` to find internal links missing the base path

2. **Path Normalization**:
   - Skips external links (http://, https://, //)
   - Skips relative paths (../)
   - Skips links already containing the base path
   - Preserves anchor links (#section)

3. **Path Rewriting**: Prepends the base path to matching links

### Link Verification Process

1. **Link Extraction**: Extracts all `href` attributes from HTML files

2. **Path Resolution**: Converts URLs to file system paths:
   - Removes base path for file lookup
   - Adds `index.html` for directory paths
   - Preserves file extensions for assets

3. **Validation**: Checks if the target file exists

## Maintenance

### When to Update

Update the scripts if:

- The base path changes
- New link patterns need to be handled
- Asset types change (CSS, JS, images, etc.)

### Configuration

The base path is defined at the top of both scripts:

```javascript
const BASE_PATH = '/opencode-warcraft-notifications';
```

Update this if the repository or base path changes.

## Future Improvements

Potential enhancements:

1. **Configuration File**: Move base path to a shared config
2. **Link Report**: Generate a report of all links and their status
3. **External Link Checking**: Verify external links are reachable
4. **Performance**: Optimize for large sites with many pages
5. **Incremental Updates**: Only process changed files

## Troubleshooting

### Links Still Broken After Build

1. Check if `fix-links.js` ran successfully:

   ```bash
   cd pages
   bun run fix-links
   ```

2. Verify the output shows files being fixed

3. Run the verification:
   ```bash
   bun run verify
   ```

### Test Reports Broken Links

1. Check if the file exists in `dist/`:

   ```bash
   ls -la dist/path/to/file/
   ```

2. Check if it's a markdown link issue - links should be relative to the docs root

3. For external links in markdown, use full URLs instead of paths

### Build Fails on CI

1. Check the workflow logs for the `fix-links` step
2. Ensure `fix-links.js` has no syntax errors
3. Verify the `dist/` directory exists before running `fix-links`

## Summary

This solution provides an automated, reliable way to ensure all internal links work correctly on GitHub Pages with a custom base path. The combination of automatic fixing during build and verification testing ensures broken links are caught before deployment.
