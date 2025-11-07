# GitHub Workflows Setup Guide

This document explains the streamlined GitHub Actions workflow setup for automated testing, intelligent versioning, and publishing.

> 📖 **For detailed workflow documentation including step-by-step breakdowns, troubleshooting, and configuration details, see [GitHub Workflows Overview](./overview.md)**

## 🎯 **Streamlined Architecture Overview**

The workflow system has been optimized from 7 legacy workflows down to **4 essential workflows** that provide comprehensive automation:

- **43% reduction** in workflow complexity (7 → 4 workflows)
- **AI-powered** semantic versioning
- **Enhanced security** and quality gates
- **Branch protection compliance** with automated PR creation
- **Comprehensive automation** with intelligent decision-making

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
  - Creates Git tags automatically
  - Generates changelogs

### 3. **Sync Package Version** (`sync-package-version.yml`)

- **Triggers:** New Git tags (`v*`)
- **Purpose:** Sync package.json version with Git tags
- **Features:**
  - Automatically updates package.json to match tag version
  - Creates auto-merging PR to respect branch protection
  - Skips if version already matches
  - Maintains version consistency across repository

### 4. **Release & Publish** (`release-publish.yml`)

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

_Note: If no AI API key is provided, the workflow falls back to conventional commit analysis._

### 4. Branch Protection Rules

Set up branch protection for `main`:

1. Go to `Settings > Branches`
2. Add rule for `main` branch
3. Enable:
   - "Require a pull request before merging"
   - "Require status checks to pass before merging"
   - Select these checks from the workflows:
     - **"validate"** (from PR Validation workflow)
     - **"security"** (from PR Validation workflow)
     - **"pr-analysis"** (from PR Validation workflow)
   - "Require branches to be up to date before merging"

## 📋 Workflow Behavior

### Pull Request Flow

1. **Developer creates PR** → `pr-validation.yml` runs
2. **All checks pass** → PR can be merged
3. **PR merged to main** → `smart-version-bump.yml` analyzes changes
4. **Version bump needed** → New tag created
5. **Tag created** → `sync-package-version.yml` syncs package.json via PR
6. **Version synced** → `release-publish.yml` publishes to npm

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

## 🚀 Migration from Legacy Workflows

### What Was Removed

The following legacy workflows have been **removed** as they were redundant:

- ❌ **`ci.yml`** - Basic CI superseded by comprehensive `pr-validation.yml`
- ❌ **`bump-version.yml`** - Manual PR-based versioning superseded by AI-powered `smart-version-bump.yml`
- ❌ **`release-on-main.yml`** - Basic releases superseded by integrated smart versioning
- ❌ **`release.yml`** - Basic npm publishing superseded by comprehensive `release-publish.yml`

### Migration Steps (if needed)

1. **Update branch protection rules** to use new workflow names:
   - Use "validate", "security", and "pr-analysis" checks from PR Validation workflow

2. **Add required secrets** to repository settings (see above)

3. **Test with a small PR** to verify everything works

### Workflow Comparison

| Old System (7 workflows)    | New System (4 workflows)         | Improvement                       |
| --------------------------- | -------------------------------- | --------------------------------- |
| Basic CI testing            | Comprehensive PR validation      | ✅ Security + Coverage + Analysis |
| Manual version bumping      | AI-powered semantic versioning   | ✅ Intelligent automation         |
| Branch protection conflicts | Auto-merging version sync PRs    | ✅ Branch protection compliant    |
| Fragmented release process  | Integrated release pipeline      | ✅ Streamlined flow               |
| Basic npm publishing        | Comprehensive publish validation | ✅ Provenance + Validation        |

## 📊 Benefits of New Setup

- **🤖 Intelligent Versioning:** AI-powered semantic version determination
- **🔒 Enhanced Security:** Vulnerability scanning and provenance publishing
- **📈 Better Monitoring:** Coverage reports, PR analysis, detailed release notes
- **⚡ Improved Efficiency:** Automated workflows reduce manual overhead
- **🎯 Quality Gates:** Comprehensive validation before merge and publish
- **🔒 Branch Protection Compliant:** Auto-merging PRs respect all protection rules
- **📚 Rich Documentation:** Auto-generated changelogs and release notes

## 🆘 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Verify all secrets are properly configured
3. Review this documentation for common solutions
4. Test locally using the same commands as CI

---

## 📚 Additional Documentation

- **[GitHub Workflows Overview](./overview.md)** - Comprehensive technical documentation for all workflows
- **[Sounds Usage Guide](../sounds-usage.md)** - How to use the notification sounds
- **[Sounds Download Strategy](../sounds-download-strategy.md)** - Sound asset management

---

_This setup provides a production-ready CI/CD pipeline with intelligent automation while maintaining full control and transparency._
