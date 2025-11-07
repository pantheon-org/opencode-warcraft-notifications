# GitHub Actions Workflows Documentation

This document provides comprehensive documentation for all GitHub Actions workflows in this repository.

> **🔧 AUTOMATION REQUIREMENT:** For full automation, you MUST set up a Personal Access Token (PAT) as `WORKFLOW_PAT` secret. Without it, the Smart Version Bump workflow cannot trigger follow-up workflows automatically. See [PAT Setup Guide](#personal-access-token-pat-setup) for details.

## 📋 Workflow Overview

The repository uses 4 streamlined GitHub Actions workflows that provide comprehensive CI/CD automation:

| Workflow                                      | File                       | Triggers             | Purpose                                 |
| --------------------------------------------- | -------------------------- | -------------------- | --------------------------------------- |
| [PR Validation](#pr-validation)               | `pr-validation.yml`        | Pull Requests        | Quality assurance and security scanning |
| [Smart Version Bump](#smart-version-bump)     | `smart-version-bump.yml`   | Push to main, Manual | AI-powered semantic versioning          |
| [Sync Package Version](#sync-package-version) | `sync-package-version.yml` | Tag creation         | Sync package.json with Git tags         |
| [Release & Publish](#release--publish)        | `release-publish.yml`      | Tag creation, Manual | Build, test, and publish to npm         |

## 🔄 Workflow Flow

```mermaid
graph TD
    A[Developer creates PR] --> B[PR Validation runs]
    B --> C{All checks pass?}
    C -->|No| D[Fix issues and push]
    D --> B
    C -->|Yes| E[PR merged to main]
    E --> F[Smart Version Bump analyzes changes]
    F --> G{Version bump needed?}
    G -->|No| H[No further action]
    G -->|Yes| I[Create new Git tag]
    I --> J[Sync Package Version creates PR]
    J --> K[Auto-merge PR with version sync]
    K --> L[Release & Publish triggers]
    L --> M[Build, test, and publish to npm]
    M --> N[Create GitHub release]
```

---

## PR Validation

**File:** `.github/workflows/pr-validation.yml`  
**Purpose:** Comprehensive quality assurance for all pull requests

### Triggers

- Pull requests to `main` or `develop` branches
- PR events: `opened`, `synchronize`, `reopened`

### Jobs

#### 1. Validate (`validate`)

Performs comprehensive code quality checks:

```yaml
steps:
  - Checkout repository (with full history)
  - Setup Bun runtime
  - Cache dependencies
  - Install dependencies (frozen lockfile)
  - Check code formatting
  - Run ESLint
  - Run TypeScript type checking
  - Run tests with coverage
  - Build project
  - Upload coverage reports to Codecov
```

**Requirements:**

- All formatting must pass (`bun run format:check`)
- Linting must pass (`bun run lint`)
- Type checking must pass (`bun run type-check`)
- All tests must pass with coverage (`bun run test:coverage`)
- Project must build successfully (`bun run build`)

#### 2. Security (`security`)

Performs security vulnerability scanning:

```yaml
steps:
  - Checkout repository
  - Run Trivy vulnerability scanner
  - Upload SARIF results to GitHub Security tab
```

**Features:**

- Scans filesystem for vulnerabilities
- Generates SARIF format reports
- Integrates with GitHub Security Dashboard

#### 3. PR Analysis (`pr-analysis`)

Analyzes PR size and complexity:

```yaml
steps:
  - Checkout repository (with full history)
  - Analyze PR metrics (files, lines added/deleted)
  - Comment warning for large PRs
```

**Thresholds:**

- **Large PR Warning:** >20 files changed OR >500 lines added
- Automatically comments on large PRs suggesting breakdown

### Environment Requirements

- **Node.js/Bun:** Latest Bun version
- **Dependencies:** All dev dependencies must be installable
- **Scripts:** Must have `format:check`, `lint`, `type-check`, `test:coverage`, `build`

### Secrets Used

- `CODECOV_TOKEN` (optional) - For coverage reporting

---

## Smart Version Bump

**File:** `.github/workflows/smart-version-bump.yml`  
**Purpose:** AI-powered semantic version analysis and tagging

### Triggers

- Push to `main` branch (automatic analysis)
- Manual workflow dispatch with version type override

### Manual Inputs

- `version_type`: Choice of `auto`, `major`, `minor`, `patch` (default: `auto`)

### Jobs

#### 1. Analyze Changes (`analyze-changes`)

Uses AI to determine appropriate version bump:

```yaml
steps:
  - Checkout repository (full history)
  - Setup Node.js
  - Get commit history since last tag
  - Install Google AI CLI (Gemini)
  - Analyze changes with AI
  - Make final version decision
```

**AI Analysis Process:**

1. Gathers commit messages since last tag
2. Gathers file change statistics
3. Sends to Google Gemini AI for analysis
4. Falls back to conventional commit analysis if AI fails

**Version Bump Rules:**

- **MAJOR:** Breaking changes, API changes, major architecture changes
- **MINOR:** New features, backwards-compatible additions
- **PATCH:** Bug fixes, documentation, small improvements
- **NONE:** CI/config changes, formatting only

**Conventional Commit Fallback:**

- `BREAKING CHANGE` or `!:` → MAJOR
- `feat:` or `feature:` → MINOR
- `fix:`, `bugfix:`, `patch:` → PATCH
- `docs:`, `chore:`, `ci:`, `style:`, `refactor:` → PATCH

#### 2. Create Tag (`create-tag`)

Creates and pushes the new version tag:

```yaml
steps:
  - Checkout repository
  - Configure Git with GitHub Action credentials
  - Create annotated tag with release notes
  - Push tag to origin
```

**Tag Format:** `v{major}.{minor}.{patch}` (e.g., `v1.2.3`)

**Tag Message Includes:**

- Version type and AI analysis result
- Information about triggered workflows

### Environment Requirements

- **Node.js:** Version 20
- **Git:** Full repository history access

### Secrets Used

- `GOOGLE_AI_API_KEY` (optional) - For AI-powered analysis
- `GITHUB_TOKEN` (automatic) - For repository access

### Outputs

- `should_bump`: Whether version should be bumped
- `version_type`: Type of version bump (major/minor/patch)
- `new_version`: The new version string
- `changelog`: Generated changelog content

---

## Sync Package Version

**File:** `.github/workflows/sync-package-version.yml`  
**Purpose:** Automatically sync package.json version with Git tags

### Triggers

- Push events for tags matching `v*` pattern

### Jobs

#### 1. Sync Package Version (`sync-package-version`)

Ensures package.json version matches the Git tag:

```yaml
steps:
  - Checkout repository (full history)
  - Setup Node.js
  - Extract version from tag
  - Check if package.json needs update
  - Configure Git credentials
  - Create version sync branch
  - Update package.json version
  - Commit and push changes
  - Create auto-merge PR
```

**Process Flow:**

1. **Version Extraction:** Extracts version from tag (removes `v` prefix)
2. **Comparison:** Compares with current package.json version
3. **Skip if Matched:** Exits early if versions already match
4. **Branch Creation:** Creates branch `sync-version/{tag}`
5. **File Update:** Updates package.json using Node.js JSON manipulation
6. **PR Creation:** Creates auto-merging PR for version sync

**Branch Protection Compliance:**

- Creates PR instead of direct push to respect branch protection
- PR includes `[skip ci]` to avoid triggering redundant workflows
- Auto-merge is attempted based on repository settings

### Environment Requirements

- **Node.js:** Version 20
- **Git:** Repository write access

### Secrets Used

- `GITHUB_TOKEN` (automatic) - For repository and PR operations

### PR Details

- **Title:** `chore: sync package.json version to {version}`
- **Branch:** `sync-version/v{version}`
- **Auto-merge:** Enabled when branch protection allows
- **Labels:** None (can be customized)

---

## Release & Publish

**File:** `.github/workflows/release-publish.yml`  
**Purpose:** Build, test, validate, and publish releases to npm

### Triggers

- Push events for tags matching `v*` pattern (automatic)
- Manual workflow dispatch with tag input

### Manual Inputs

- `tag`: Tag to publish (e.g., `v1.2.3`) - required for manual dispatch

### Jobs

#### 1. Build, Test & Publish (`publish`)

Comprehensive build and publishing pipeline:

```yaml
steps:
  - Checkout repository (full history)
  - Setup Bun runtime
  - Setup Node.js for npm publishing
  - Get version from tag
  - Verify package.json version matches tag
  - Cache dependencies
  - Install dependencies
  - Run full test suite
  - Verify npm token
  - Check if version already published
  - Publish to npm (if not already published)
  - Create detailed GitHub release (for tag pushes)
  - Post-publish validation
  - Notify on success
```

**Full Test Suite Includes:**

- Linting (`bun run lint`)
- Type checking (`bun run type-check`)
- Unit tests with coverage (`bun run test:coverage`)
- Build verification (`bun run build`)

**Version Validation:**

- Ensures package.json version exactly matches tag version
- Fails fast if versions don't match to prevent inconsistent releases

**npm Publishing:**

- Uses provenance for enhanced security
- Publishes with public access
- Skips if version already exists on npm
- Validates publication after success

**GitHub Release Creation:**

- Only for tag-triggered runs (not manual dispatch)
- Includes npm package information
- Shows build and test status
- Provides installation instructions

**Post-Publish Validation:**

- Waits 10 seconds for npm propagation
- Verifies package is accessible via npm registry
- Fails if validation doesn't pass

### Environment Requirements

- **Bun:** Latest version for build tooling
- **Node.js:** Version 20 for npm publishing
- **npm Registry:** Access to npmjs.org
- **Package Scripts:** `lint`, `type-check`, `test:coverage`, `build`

### Secrets Used

- `NPM_TOKEN` (required) - npm automation token for publishing

### Failure Scenarios

1. **Version Mismatch:** package.json version ≠ tag version
2. **Test Failures:** Any test, lint, or build step fails
3. **Missing npm Token:** NPM_TOKEN secret not configured
4. **Publication Failure:** npm publish command fails
5. **Validation Failure:** Published package not accessible (usually temporary)

### Success Outputs

- **npm Package:** Published to npm registry with provenance
- **GitHub Release:** Detailed release with package information
- **Notifications:** Summary of publication results

---

## 🔧 Setup Requirements

### Repository Secrets

Add these secrets in `Settings > Secrets and variables > Actions`:

```bash
# Required for npm publishing
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Required for workflow automation (enables automatic tag-triggered workflows)
WORKFLOW_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional for AI-powered version analysis
GOOGLE_AI_API_KEY=AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional for enhanced code coverage reporting
CODECOV_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> **⚠️ CRITICAL:** The `WORKFLOW_PAT` is required for full automation. Without it, the Smart Version Bump workflow cannot trigger the Sync Package Version and Release & Publish workflows automatically.

### NPM Token Setup

1. Go to [npmjs.com](https://npmjs.com) → Profile → Access Tokens
2. Generate "Automation" token
3. Add as `NPM_TOKEN` secret in GitHub

### Google AI API Key Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create new API key
3. Add as `GOOGLE_AI_API_KEY` secret in GitHub

### Personal Access Token (PAT) Setup

**Required for full workflow automation.** This PAT enables the Smart Version Bump workflow to trigger subsequent workflows automatically.

#### Step 1: Create Personal Access Token

1. **Go to GitHub Settings:**
   - Click your profile picture → Settings
   - Navigate to **Developer settings** (bottom of left sidebar)
   - Click **Personal access tokens** → **Tokens (classic)**

2. **Generate New Token:**
   - Click **Generate new token** → **Generate new token (classic)**
   - **Note:** Enter descriptive name like "Workflow Automation - [Repository Name]"
   - **Expiration:** Choose appropriate duration (90 days recommended)

3. **Select Required Scopes:**
   ```
   ✅ repo (Full control of private repositories)
     ✅ Full control of private repositories
   ✅ workflow (Update GitHub Action workflows)
   ✅ write:packages (Upload packages to GitHub Package Registry)
   ✅ read:packages (Download packages from GitHub Package Registry)
   ```

4. **Generate and Copy Token:**
   - Click **Generate token**
   - **IMPORTANT:** Copy the token immediately (starts with `ghp_`)
   - You won't be able to see it again!

#### Step 2: Add PAT to Repository Secrets

1. **Navigate to Repository Settings:**
   - Go to your repository → Settings tab
   - Click **Secrets and variables** → **Actions**

2. **Add Repository Secret:**
   - Click **New repository secret**
   - **Name:** `WORKFLOW_PAT`
   - **Secret:** Paste the PAT token (starts with `ghp_`)
   - Click **Add secret**

#### Step 3: Verify PAT Permissions

The PAT must have access to your repository:

1. **For Organization Repositories:**
   - The PAT owner must be a repository collaborator with **Write** or **Admin** access
   - Organization may need to approve PAT usage (check organization settings)

2. **For Personal Repositories:**
   - PAT automatically has access to your own repositories

#### Why PAT is Required

**GitHub Security Limitation:** Workflows triggered by `GITHUB_TOKEN` cannot trigger other workflows. This prevents infinite workflow loops but breaks our automation chain.

**The Problem:**
```
Smart Version Bump (uses GITHUB_TOKEN) → Creates tag → ❌ No follow-up workflows triggered
```

**The Solution:**
```
Smart Version Bump (uses WORKFLOW_PAT) → Creates tag → ✅ Triggers Sync + Release workflows
```

#### PAT Security Best Practices

1. **Scope Minimization:** Only grant required permissions
2. **Regular Rotation:** Set reasonable expiration dates (90 days recommended)
3. **Monitoring:** Review PAT usage in GitHub settings regularly
4. **Revocation:** Immediately revoke if compromised
5. **Documentation:** Keep record of what each PAT is used for

#### Troubleshooting PAT Issues

- **Workflows not triggering:** Verify PAT has `repo` and `workflow` scopes
- **Permission denied:** Check repository access permissions
- **Token expired:** Generate new PAT and update secret
- **Organization restrictions:** Contact organization admin for PAT approval

### Branch Protection Rules

Configure branch protection for `main` branch:

1. **Go to:** `Settings > Branches`
2. **Add rule for:** `main` branch
3. **Enable:**
   - "Require a pull request before merging"
   - "Require status checks to pass before merging"
   - Select required checks:
     - `validate` (from PR Validation)
     - `security` (from PR Validation)
     - `pr-analysis` (from PR Validation)
   - "Require branches to be up to date before merging"

### Package.json Requirements

Ensure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "lint": "eslint src/",
    "type-check": "bun tsc --noEmit --project tsconfig.test.json",
    "test": "bun test src",
    "test:coverage": "bun test --coverage src/",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,cjs,css}\"",
    "build": "bun tsc"
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### PR Validation Failures

- **Formatting:** Run `bun run format` to fix formatting
- **Linting:** Fix ESLint errors shown in logs
- **Type Errors:** Fix TypeScript compilation errors
- **Test Failures:** Review test logs and fix failing tests
- **Build Failures:** Check build logs for compilation issues

#### Smart Version Bump Issues

- **No Version Bump:** Check if commits contain meaningful changes
- **AI Analysis Fails:** Verify `GOOGLE_AI_API_KEY` secret or rely on fallback
- **Tag Already Exists:** Workflow skips if tag already exists (safe)
- **Follow-up Workflows Not Triggered:** See [Automation Chain Issues](#automation-chain-issues) below

#### Automation Chain Issues

**CRITICAL:** If Smart Version Bump creates tags but Sync Package Version and Release & Publish workflows don't trigger:

**Root Cause:** Using `GITHUB_TOKEN` instead of Personal Access Token (PAT)

**Symptoms:**
- ✅ Smart Version Bump workflow completes successfully
- ✅ Git tag is created (e.g., `v1.2.3`)
- ❌ Sync Package Version workflow never runs
- ❌ Release & Publish workflow never runs
- ❌ Package.json version remains unchanged
- ❌ No npm package published

**Solution:**
1. **Set up WORKFLOW_PAT:** Follow [PAT Setup Guide](#personal-access-token-pat-setup)
2. **Verify Workflows Use PAT:** Both Smart Version Bump and Sync Package Version should use `${{ secrets.WORKFLOW_PAT || secrets.GITHUB_TOKEN }}`
3. **Test Automation:** Make a small change, merge PR, verify full workflow chain

**Manual Workaround (if PAT unavailable):**
```bash
# 1. Check current versions
git tag -l --sort=-v:refname | head -3
node -p "require('./package.json').version"

# 2. Update package.json to match latest tag
NEW_VERSION="1.2.3"  # Replace with actual tag version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Updated to:', pkg.version);
"

# 3. Commit and push version sync
git add package.json
git commit -m "chore: sync package.json version to $NEW_VERSION"
git push

# 4. Manually trigger release
gh workflow run "Release & Publish" -f tag=v$NEW_VERSION
```

#### Sync Package Version Issues

- **PR Creation Fails:** Check `GITHUB_TOKEN` permissions
- **Auto-merge Fails:** Review branch protection settings
- **Version Already Synced:** Workflow skips if no sync needed (safe)

#### Release & Publish Issues

- **Version Mismatch:** Ensure Smart Version Bump ran before manual publish
- **npm Token Invalid:** Verify `NPM_TOKEN` secret and permissions
- **Package Already Published:** Workflow skips publishing (safe)
- **Post-publish Validation Fails:** Usually temporary npm propagation delay

### Debug Commands

```bash
# Test locally before pushing
bun install
bun run lint
bun run type-check
bun run test:coverage
bun run build

# Check workflow status
gh workflow list
gh run list --limit 5

# View specific workflow run
gh run view <run-id>
gh run view <run-id> --log-failed

# Manual workflow triggers
gh workflow run "Smart Version Bump" -f version_type=patch
gh workflow run "Release & Publish" -f tag=v1.2.3
```

### Monitoring

- **Actions Tab:** Monitor all workflow runs
- **Security Tab:** Review Trivy scan results
- **Packages:** Check published npm packages
- **Releases:** Review GitHub releases

---

## 🚀 Best Practices

### Development Workflow

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Use conventional commits for better AI analysis:
   ```bash
   feat: add new notification sound system
   fix: resolve audio playback timing issue
   docs: update API documentation
   BREAKING CHANGE: remove deprecated methods
   ```
4. Create PR - wait for all checks to pass
5. Merge PR - automatic versioning and publishing follows

### Version Management

- **Let AI decide:** Use automatic versioning for most changes
- **Manual override:** Use workflow dispatch for specific version types
- **Breaking changes:** Use `BREAKING CHANGE:` in commit messages
- **Documentation:** Document version changes in commit messages

### Release Management

- **Trust the automation:** Workflows handle versioning and publishing
- **Monitor releases:** Check Actions tab for any failures
- **Validate publications:** Verify packages appear on npm
- **Emergency fixes:** Use manual workflow dispatch if needed

### Security

- **Keep secrets updated:** Rotate tokens regularly
- **Monitor security scans:** Review Trivy results in Security tab
- **Dependency updates:** Regularly update dependencies
- **Branch protection:** Maintain strict branch protection rules

---

_This documentation is maintained alongside the workflows. Update when making workflow changes._
