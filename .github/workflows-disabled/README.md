# Legacy Workflows - Reference Only

⚠️ **DO NOT MOVE THESE FILES BACK TO .github/workflows/** ⚠️

## Purpose

These are the **original complex workflow files** that contained embedded JavaScript logic. They have been **replaced by simplified workflows** that use external scripts.

## Why These Are Disabled

1. **YAML Syntax Issues**: Complex JavaScript embedded in YAML caused frequent syntax errors
2. **Maintenance Problems**: Hard to debug, test, and modify
3. **Escaping Issues**: Template variables and multiline strings caused problems
4. **Fragility**: Small syntax errors broke entire workflows

## Current Active Replacements

| Legacy File | Active Replacement | External Script |
|-------------|-------------------|-----------------|
| `auto-merge-bot.yml` | `.github/workflows/auto-merge-bot.yml` | `.github/scripts/auto-merge.cjs` |
| `sync-package-version.yml` | `.github/workflows/sync-package-version.yml` | `.github/scripts/sync-version.cjs` |

## Architecture Improvement

**Before (these files):**
```yaml
- name: Complex logic
  uses: actions/github-script@v7
  with:
    script: |
      // 200+ lines of JavaScript embedded in YAML
      // Complex escaping and template variables
      // Hard to debug and test
```

**After (current active workflows):**
```yaml
- name: Run external script
  run: node .github/scripts/script-name.cjs
```

## Status

- ✅ **Active workflows working perfectly**
- ✅ **External scripts approach proven successful**
- ✅ **No YAML syntax issues**
- 📚 **These files kept for reference/documentation only**

## If You Need to Reference

These files contain the original logic that was extracted to external scripts. Useful for:
- Understanding the original implementation
- Comparing with current approach
- Educational/documentation purposes

**Do NOT re-enable these workflows** - they will cause the same syntax issues we just fixed.