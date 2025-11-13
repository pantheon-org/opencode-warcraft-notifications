# Documentation Regeneration Quick Reference

## Quick Start

### Local Regeneration

```bash
# Set your API key (choose one)
export ANTHROPIC_API_KEY="your-key-here"     # For Claude
# export OPENAI_API_KEY="your-key-here"      # For ChatGPT
# export GOOGLE_API_KEY="your-key-here"      # For Gemini
# export GITHUB_TOKEN="your-token-here"      # For Copilot

# Run regeneration
.github/scripts/regenerate-docs-local.sh

# Review changes
git diff docs/src/content/docs/

# Test build
cd docs && bun run build && bun run preview

# Commit if satisfied
git commit -am "docs: regenerate documentation"
```

### Trigger Via GitHub Actions

```bash
# Interactive prompt
.github/scripts/trigger-docs-regeneration.sh

# Or directly with gh CLI
gh workflow run chores-docs-regenerate.yml \
  --field ai_provider=anthropic \
  --field create_pr=true
# Providers: anthropic, openai, google, github
```

## What It Does

1. **Analyzes** your codebase using AI (OpenCode)
2. **Updates** documentation to match current implementation
3. **Validates** changes and tests build
4. **Creates PR** with updated documentation

## When It Runs

- ✅ **Automatically** when you push changes to `.github/**` or `src/**`
- ✅ **Manually** when you trigger it via GitHub Actions or CLI

## Important Notes

⚠️ **Non-Blocking**: This workflow never blocks other workflows

- If no API keys found → Exits with warning (not error)
- If provider unavailable → Falls back to available provider
- If regeneration fails → Other workflows continue unaffected

## Files Updated

- `docs/src/content/docs/index.md` - Main landing page
- `docs/src/content/docs/user-guide.md` - User documentation
- `docs/src/content/docs/api.md` - API reference
- `docs/src/content/docs/architecture.md` - Architecture
- `docs/src/content/docs/development.md` - Dev guide
- `docs/src/content/docs/deployment.md` - Deployment guide
- `docs/src/content/docs/pipeline.md` - CI/CD docs

## Workflow Options

### AI Provider

Choose from four supported providers:

- **anthropic** (recommended): Anthropic Claude 3.5 Sonnet - Best for comprehensive analysis
- **openai**: OpenAI ChatGPT (GPT-4 Turbo) - Balanced performance
- **google**: Google Gemini 2.0 Flash - Fast and efficient
- **github**: GitHub Copilot (GPT-4o) - Integrated with GitHub

### Triggers

- **Push to main**: Automatically when `.github/**` or `src/**` files change
- **Manual**: Can be triggered manually anytime via GitHub Actions or CLI

## Reviewing PRs

When a regeneration PR is created:

1. **Check accuracy** of technical content
2. **Verify examples** match current code
3. **Test locally** if needed
4. **Merge** when satisfied

## Troubleshooting

### "No changes detected"

Documentation is already up-to-date. This is normal.

### "Build failed"

Check workflow logs for syntax errors. May need manual fixes.

### "API rate limit"

Wait for rate limit reset or use different provider.

## Advanced Usage

### Custom Prompt

Edit the prompt in `.github/workflows/chores-docs-regenerate.yml`:

```yaml
- name: Create documentation regeneration prompt
  run: |
    cat > .github/scripts/regenerate-docs-prompt.txt << 'EOF'
    # Your custom instructions here
    EOF
```

### Adjust Trigger Paths

Add or modify paths in workflow:

```yaml
push:
  paths:
    - '.github/**'
    - 'src/**'
    # Add more:
    # - 'package.json'
    # - 'index.ts'
```

## More Info

- [Full Documentation](../docs/src/content/docs/github-workflows/docs-regeneration.md)
- [Workflow File](chores-docs-regenerate.yml)
- [Local Script](../scripts/regenerate-docs-local.sh)

---

**Last Updated:** 2025-01-14
