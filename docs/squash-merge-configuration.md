# Repository Merge Strategy Configuration

## Issue: Multiple Releases per Merge Request

Our merge request should always be a squash so we do not have excessive number of releases being created. We want one and only one release per merge request.

## Root Cause

The current setup can create multiple releases because:
1. Version bumping runs on every push to main (`smart-version-bump.yml`)
2. If PRs are merged with regular merge commits instead of squash, multiple commits can trigger multiple version bumps
3. Each version bump creates a new tag, which triggers a new release

## Solution Implementation

### 1. Repository Settings (Manual Configuration Required)

**⚠️ IMPORTANT: These settings must be configured manually in GitHub repository settings.**

Go to: https://github.com/pantheon-org/opencode-warcraft-notifications/settings

#### General Settings → Pull Requests
- ✅ **Allow squash merging** (should be enabled)
- ❌ **Allow merge commits** (should be disabled)  
- ❌ **Allow rebase merging** (should be disabled)
- ✅ **Automatically delete head branches** (recommended)

#### General Settings → Pull Requests → Merge Button
- ✅ **Default to squash merging**
- Set default squash merge commit message to: **Pull request title and commit details**

### 2. Branch Protection Rules

Configure branch protection for `main`:
- ✅ **Require pull request reviews**
- ✅ **Require status checks to pass**
  - Select: `validate`, `security`, `pr-analysis` (from PR Validation workflow)
- ✅ **Require branches to be up to date**
- ✅ **Restrict pushes that create files larger than 100MB**

### 3. Workflow Improvements

The existing workflows are already well-configured:

#### Current Good Practices:
- Auto-merge bot already uses `--squash` (`auto-merge.cjs:139`)
- Smart version bumping analyzes all commits since last tag
- Release publishing is properly triggered by tags only
- Version sync PRs are handled automatically

#### Additional Protection

The `smart-version-bump.yml` workflow already has good protection against duplicate releases:
- Checks if tag already exists locally and remotely (`smart-version-bump.yml:233-241`)
- Skips version update if tag exists to prevent duplicate releases

## Verification Steps

1. **Check Repository Settings**:
   ```bash
   # Use GitHub CLI to verify current settings
   gh api repos/pantheon-org/opencode-warcraft-notifications --jq '.allow_squash_merge, .allow_merge_commit, .allow_rebase_merge'
   ```

2. **Test Merge Behavior**:
   - Create a test PR with multiple commits
   - Verify that only squash merge option is available
   - Confirm only one release is created after merge

3. **Monitor Workflow Execution**:
   - Check that smart-version-bump runs only once per squash merge
   - Verify that release-publish creates only one release per version tag

## Implementation Checklist

- [ ] Configure repository merge settings (manual step required)
- [ ] Set up branch protection rules (manual step required)  
- [ ] Test with a sample PR
- [ ] Monitor release creation behavior
- [ ] Document the process for team members

## Emergency Rollback

If multiple releases are accidentally created:
1. Delete excessive tags: `git tag -d v1.x.x && git push origin :v1.x.x`
2. Delete excessive releases from GitHub Releases page
3. Manually adjust version in package.json if needed
4. Re-run smart version bump if necessary

## Benefits of This Configuration

1. **Single Release per PR**: Each merged PR creates exactly one commit on main
2. **Clean Git History**: Linear history makes it easier to track changes
3. **Predictable Versioning**: One squash commit = one version analysis = one potential release
4. **Automated Safety**: Existing workflows already protect against duplicate tags/releases