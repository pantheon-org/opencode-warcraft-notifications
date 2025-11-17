---
title: Workflow Migration Guide
description: Guide for migrating from old workflow structure to new sequential orchestration
---

# Workflow Migration Guide

## Migration Date: 2025-11-11

This guide documents the migration from the old workflow structure to the new orchestrated workflow system.

---

## Overview of Changes

### Old Structure (Issues)

- ❌ Version bumps happened immediately on main push
- ❌ No PR review for version changes
- ❌ Broken AI dependency (Gemini CLI)
- ❌ Redundant sync-package-version workflow
- ❌ Complex orchestration with race conditions
- ❌ Difficult to debug workflow loops

### New Structure (Solutions)

- ✅ Version bumps via reviewable PR
- ✅ Clear sequential workflow (1→2→3→4→5→6)
- ✅ Conventional commits (no AI dependency)
- ✅ Single purpose per workflow
- ✅ Loop prevention safeguards
- ✅ Easy to debug and maintain

---

## New Workflow Files

| #   | File                    | Purpose                  | Trigger            |
| --- | ----------------------- | ------------------------ | ------------------ |
| 1   | `1-validate.yml`        | Lint, test, build PR     | PR opened/updated  |
| 2   | `2-version-update.yml`  | Create version bump PR   | Push to main       |
| 3   | `3-auto-merge.yml`      | Auto-merge version PR    | PR checks complete |
| 4   | `4-create-tag.yml`      | Create git tag           | Version PR merged  |
| 5   | `5-publish.yml`         | Publish npm/docs/release | Tag pushed         |
| 6   | `6-cleanup.yml`         | Clean releases/branches  | After publish      |
| -   | `repo-config-check.yml` | Verify squash merge      | Weekly/manual      |

---

## Breaking Changes

### Workflow Names Changed

If you have any external systems referencing workflow names, update them:

| Old Name               | New Name                              |
| ---------------------- | ------------------------------------- |
| `PR Validation`        | `1. Validate PR (Lint, Test, Build)`  |
| `Smart Version Bump`   | `2. Version Update (Create PR)`       |
| `Auto-Merge Bot`       | `3. Auto-Merge Version PR`            |
| N/A                    | `4. Create Tag (After Version Merge)` |
| `Release & Publish`    | `5. Publish Release (npm + Docs)`     |
| `Cleanup Old Releases` | `6. Cleanup (Releases & Branches)`    |

### Workflow Triggers Changed

**2-version-update.yml** (formerly smart-version-bump.yml):

- **Old**: Triggered on push to main, created tag immediately
- **New**: Triggered on push to main, creates version bump PR instead

**4-create-tag.yml** (new workflow):

- Creates git tags after version bump PR is merged
- Triggers 5-publish.yml via tag push

### Removed Workflows

These workflows have been completely removed and replaced:

- `auto-merge-bot.yml` → Replaced by `3-auto-merge.yml`
- `sync-package-version.yml` → Removed (redundant)
- `deploy-docs.yml` → Merged into `5-publish.yml`
- `cleanup-merged-branches.yml` → Merged into `6-cleanup.yml`
- `cleanup-old-releases.yml` → Merged into `6-cleanup.yml`
- `pr-validation.yml` → Replaced by `1-validate.yml`
- `smart-version-bump.yml` → Replaced by `2-version-update.yml`
- `release-publish.yml` → Replaced by `5-publish.yml`

---

## Migration Steps

### For Repository Maintainers

1. **Review New Workflows**

   ```bash
   # View workflow documentation
   cat docs/src/content/docs/github-workflows/sequential-orchestration.md
   ```

2. **Verify Repository Settings**

   ```bash
   node .github/scripts/check-repo-config.cjs
   ```

   Required settings:
   - ✅ Allow squash merging
   - ❌ Disable merge commits
   - ❌ Disable rebase merging
   - ✅ Auto-delete head branches

3. **Update Branch Protection**
   - Go to Settings → Branches → main
   - Require status checks: `validate`, `security`, `pr-analysis`

4. **Test the Flow**

   ```bash
   # Create a test PR with a feature
   git checkout -b test/new-feature
   echo "test" >> README.md
   git commit -m "feat: test new workflow"
   git push origin test/new-feature

   # Create PR and observe workflow progression
   gh pr create --title "feat: test new workflow" --body "Testing migration"
   ```

5. **Monitor First Release**
   - Watch Actions tab for workflow progression
   - Verify version bump PR is created
   - Confirm auto-merge works
   - Check tag creation
   - Verify npm publication
   - Confirm docs deployment

### For Contributors

No changes required! The contribution process remains the same:

1. Create feature branch
2. Make changes with conventional commits
3. Open PR
4. Workflows validate automatically
5. After merge, release happens automatically

---

## Expected Behavior After Migration

### Scenario: New Feature PR

```
1. Developer creates PR: "feat: add alliance sounds"
   → 1-validate.yml runs (lint, test, build)
   ✅ All checks pass

2. Maintainer approves and merges PR (squash merge)
   → 2-version-update.yml analyzes commits
   → Finds "feat:" prefix
   → Determines MINOR version bump needed
   → Creates PR: "chore: bump version to v1.2.0"
   ✅ Version bump PR created

3. Version bump PR triggers workflows
   → 1-validate.yml runs on PR
   → 3-auto-merge.yml monitors checks
   ✅ All checks pass → auto-merge enabled
   ✅ PR auto-merged with squash

4. Version PR merged to main
   → 4-create-tag.yml detects version commit
   → Creates annotated tag v1.2.0
   → Pushes tag to origin
   ✅ Tag v1.2.0 created

5. Tag pushed triggers publish
   → 5-publish.yml starts
   → Publishes to npm with provenance
   → Deploys docs to docs branch
   → Creates GitHub release
   ✅ Release v1.2.0 published

6. Publish completes
   → 6-cleanup.yml runs
   → Cleans old releases (if >10 for major)
   → Deletes merged version-bump branch
   ✅ Repository cleaned

Total Time: ~10 minutes
Result: v1.2.0 published to npm, docs updated, release created
```

---

## Rollback Plan

If issues occur, you can rollback:

### Option 1: Disable New Workflows

```bash
# Disable workflows in GitHub UI
# Settings → Actions → Workflows → Disable each new workflow
```

### Option 2: Manual Release Process

```bash
# Temporarily use manual releases
npm version patch  # or minor, or major
git push origin main --tags
gh workflow run 5-publish.yml -f tag=v1.2.3
```

---

## Troubleshooting

### Issue: Version PR Not Created

**Symptoms**: After merging PR to main, no version bump PR appears

**Solutions**:

1. Check workflow run in Actions tab for errors
2. Verify commit doesn't contain `[skip ci]`
3. Check commit modified files outside `paths-ignore`
4. Manually trigger: `gh workflow run 2-version-update.yml`

### Issue: Auto-Merge Not Working

**Symptoms**: Version bump PR created but not auto-merging

**Solutions**:

1. Check `WORKFLOW_PAT` secret exists and has correct permissions
2. Verify all status checks passed (not just some)
3. Check PR title matches: `chore: bump version to v*`
4. Manually enable: `gh pr merge <number> --squash --auto`

### Issue: Tag Not Created

**Symptoms**: Version PR merged but no tag appears

**Solutions**:

1. Check 4-create-tag.yml workflow logs
2. Verify commit message starts with `chore: bump version`
3. Check tag doesn't already exist: `git tag -l`
4. Manually create: `git tag v1.2.0 && git push origin v1.2.0`

### Issue: npm Publish Failed

**Symptoms**: Tag created but npm publish failed

**Solutions**:

1. Check `NPM_TOKEN` secret is valid
2. Verify package.json version matches tag
3. Check if version already published: `npm view <package>@<version>`
4. Manually publish: `npm publish --access public`

---

## Monitoring

### Key Metrics to Watch

After migration, monitor these for 1-2 weeks:

1. **Workflow Success Rate**
   - Target: >95% success rate
   - Check: Actions tab → Workflows

2. **Release Frequency**
   - Should remain consistent with before
   - Check: Releases tab

3. **PR to Release Time**
   - Target: <15 minutes
   - Measure: PR merge time to release creation

4. **Failed Workflow Notifications**
   - Watch for: workflow failure emails
   - Investigate: any repeated failures

### Dashboard Links

- **Actions**: `https://github.com/pantheon-org/opencode-warcraft-notifications/actions`
- **Releases**: `https://github.com/pantheon-org/opencode-warcraft-notifications/releases`
- **npm**: `https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications`

---

## Post-Migration Tasks

### Immediate (Week 1)

- [ ] Test complete flow with real PR
- [ ] Monitor first 3-5 releases
- [ ] Update team on new process
- [ ] Document any issues found

### Short Term (Month 1)

- [ ] Collect feedback from contributors
- [ ] Optimize workflow performance
- [ ] Document any edge cases
- [ ] Update contribution guidelines if needed

### Long Term (Quarter 1)

- [ ] Review workflow metrics
- [ ] Consider additional improvements
- [ ] Update related documentation
- [ ] Share learnings with team

---

## Additional Resources

- [Workflow Documentation](/github-workflows/sequential-orchestration)
- [Script Documentation](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/.github/scripts/README.md)
- [Contributing Guide](/contributing)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Questions or Issues?

If you encounter any issues during or after migration:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review workflow logs in Actions tab
3. Create an issue with:
   - Workflow name and run number
   - Error message or unexpected behavior
   - Steps to reproduce

---

**Migration Performed**: 2025-11-11  
**Migration Lead**: Workflow Restructuring Initiative  
**Rollback Deadline**: 2025-11-18 (if major issues found)
