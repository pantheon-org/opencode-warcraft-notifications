# GitHub Workflows Setup Guide

This document explains the new GitHub Actions workflow setup for automated testing, intelligent versioning, and publishing.

## 🏗️ Workflow Architecture

### 1. **PR Validation** (`pr-validation.yml`)
- **Triggers:** All pull requests to `main` or `develop`
- **Purpose:** Quality assurance before merge
- **Features:**
  - Linting, testing, type checking
  - Build verification
  - Security scanning with Trivy
  - PR size analysis and warnings
  - Code coverage reporting

### 2. **Smart Version Bump** (`smart-version-bump.yml`) 
- **Triggers:** Push to `main` branch or manual workflow dispatch
- **Purpose:** AI-powered semantic versioning
- **Features:**
  - Analyzes commit history using Google Gemini AI
  - Determines version bump type (major/minor/patch)
  - Updates `package.json` version
  - Creates Git tags automatically
  - Generates changelogs

### 3. **Release & Publish** (`release-publish.yml`)
- **Triggers:** New version tags (`v*`) or manual dispatch
- **Purpose:** Build, test, and publish to npm
- **Features:**
  - Full test suite execution
  - Version validation
  - npm publication with provenance
  - Detailed GitHub release creation
  - Post-publish validation

## 🔧 Required Setup

### 1. GitHub Secrets

Add these secrets to your repository (`Settings > Secrets and variables > Actions`):

```bash
# Required for npm publishing
NPM_TOKEN=your_npm_token_here

# Required for AI-powered version analysis (optional but recommended)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional for enhanced code coverage
CODECOV_TOKEN=your_codecov_token_here
```

### 2. NPM Token Setup

1. Go to [npmjs.com](https://npmjs.com) and log in
2. Click on your profile → "Access Tokens"
3. Generate a new token with "Automation" type
4. Add it as `NPM_TOKEN` secret in GitHub

### 3. Google AI API Key (for smart versioning)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it as `GOOGLE_AI_API_KEY` secret in GitHub

*Note: If no AI API key is provided, the workflow falls back to conventional commit analysis.*

### 4. Branch Protection Rules

Set up branch protection for `main`:

1. Go to `Settings > Branches`
2. Add rule for `main` branch
3. Enable:
   - "Require a pull request before merging"
   - "Require status checks to pass before merging"
   - Select the "validate" check from PR Validation workflow
   - "Require branches to be up to date before merging"

## 📋 Workflow Behavior

### Pull Request Flow

1. **Developer creates PR** → `pr-validation.yml` runs
2. **All checks pass** → PR can be merged
3. **PR merged to main** → `smart-version-bump.yml` analyzes changes
4. **Version bump needed** → New tag created → `release-publish.yml` publishes

### Manual Version Bump

You can manually trigger version bumps:

1. Go to `Actions > Smart Version Bump`
2. Click "Run workflow"
3. Choose version type: `auto`, `major`, `minor`, or `patch`

### Manual Publishing

If you need to republish a version:

1. Go to `Actions > Release & Publish`
2. Click "Run workflow"
3. Enter the tag name (e.g., `v1.2.3`)

## 🤖 AI Version Analysis

The smart versioning workflow uses AI to analyze:

- **Commit messages** (conventional commits preferred)
- **File changes** (new files, deletions, core modifications)
- **Overall impact** assessment

### Version Bump Rules

- **MAJOR:** Breaking changes, API changes, major architecture changes
- **MINOR:** New features, backwards-compatible additions
- **PATCH:** Bug fixes, documentation, small improvements
- **NONE:** CI/config changes, formatting only

### Conventional Commits (Recommended)

For best AI analysis results, use conventional commit format:

```bash
feat: add new sound notification system
fix: resolve audio playback issue  
docs: update README with new examples
BREAKING CHANGE: remove deprecated API methods
```

## 🔍 Monitoring & Debugging

### Workflow Status

Monitor workflows in the `Actions` tab:
- Green ✅ = Success
- Red ❌ = Failed (check logs)
- Yellow 🟡 = In progress

### Common Issues

1. **NPM publish fails:**
   - Check NPM_TOKEN secret is set
   - Verify token has correct permissions
   - Ensure version isn't already published

2. **AI version analysis fails:**
   - Check GOOGLE_AI_API_KEY secret
   - Review commit messages for clarity
   - Fallback to conventional commit analysis

3. **Tests fail in CI:**
   - Check if all dependencies are installed
   - Verify test environment compatibility
   - Review test logs in Actions tab

### Debugging Tips

```bash
# Check workflow logs
# Go to Actions > [Workflow] > [Run] > Click on job steps

# Manually test version analysis locally
git log --oneline --no-merges HEAD~5..HEAD

# Test build locally
bun install
bun run lint
bun run test
bun run build
```

## 📦 Package.json Requirements

Ensure your `package.json` has:

```json
{
  "name": "@your-org/package-name",
  "version": "1.0.0",
  "scripts": {
    "lint": "eslint src/",
    "test": "bun test src",
    "test:coverage": "bun test --coverage src/",
    "type-check": "bun tsc --noEmit",
    "format:check": "prettier --check \"**/*.{ts,js,json,md}\"",
    "build": "bun tsc"
  }
}
```

## 🚀 Migration from Old Workflows

1. **Backup existing workflows:**
   ```bash
   mv .github/workflows .github/workflows-backup
   ```

2. **Create new workflow directory:**
   ```bash
   mkdir -p .github/workflows
   ```

3. **Add the three new workflow files** (already created)

4. **Update branch protection rules** to use new workflow names

5. **Add required secrets** to repository settings

6. **Test with a small PR** to verify everything works

## 📊 Benefits of New Setup

- **🤖 Intelligent Versioning:** AI-powered semantic version determination
- **🔒 Enhanced Security:** Vulnerability scanning and provenance publishing  
- **📈 Better Monitoring:** Coverage reports, PR analysis, detailed release notes
- **⚡ Improved Efficiency:** Automated workflows reduce manual overhead
- **🎯 Quality Gates:** Comprehensive validation before merge and publish
- **📚 Rich Documentation:** Auto-generated changelogs and release notes

## 🆘 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Verify all secrets are properly configured
3. Review this documentation for common solutions
4. Test locally using the same commands as CI

---

*This setup provides a production-ready CI/CD pipeline with intelligent automation while maintaining full control and transparency.*