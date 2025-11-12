# GitHub Workflows

This directory contains the CI/CD pipeline for the project.

## Workflow Overview

### Automated Release Pipeline

1. **[1-validate.yml](1-validate.yml)** - PR Validation
   - Runs on: Pull requests
   - Actions: Lint, type-check, test, build
   - Purpose: Ensure code quality before merge

2. **[2-version-update.yml](2-version-update.yml)** - Version Management
   - Runs on: Push to main (excluding docs/workflow changes)
   - Actions: Analyze commits → Calculate version → Create version PR
   - Purpose: Automated semantic versioning

3. **[3-auto-merge.yml](3-auto-merge.yml)** - Auto-merge Version PRs
   - Runs on: Version PR creation
   - Actions: Auto-approve and merge version bump PRs
   - Purpose: Streamline version updates

4. **[4-create-tag.yml](4-create-tag.yml)** - Tag Creation
   - Runs on: Version bump commit merged to main
   - Actions: Create git tag from package.json version
   - Purpose: Trigger release pipeline

5. **[5-publish.yml](5-publish.yml)** - Release & Publish
   - Runs on: Tag push (v\*) or manual trigger
   - Actions: Publish to npm → Deploy docs → Create GitHub release
   - Purpose: Complete release process

6. **[6-cleanup.yml](6-cleanup.yml)** - Cleanup
   - Runs on: After publish workflow
   - Actions: Delete old branches, cleanup artifacts
   - Purpose: Repository maintenance

### Independent Workflows

7. **[deploy-docs.yml](deploy-docs.yml)** - Documentation Deployment
   - Runs on: Push to main with docs/\*\* changes
   - Actions: Build docs → Deploy to docs branch
   - Purpose: Independent docs deployment (no version required)
   - Note: Docs also deploy as part of release pipeline (workflow 5)

8. **[repo-config-check.yml](repo-config-check.yml)** - Repository Config Check
   - Runs on: Schedule (weekly) or manual trigger
   - Actions: Verify repository settings
   - Purpose: Ensure squash merge strategy

## Workflow Triggers

### Code Changes → Full Release Pipeline

```
Feature PR → [1] Validate → Merge to main → [2] Version Update →
[3] Auto-merge → [4] Create Tag → [5] Publish (npm + docs + release) → [6] Cleanup
```

### Documentation Changes → Immediate Deployment

```
Docs PR → [1] Validate → Merge to main → [deploy-docs] Deploy to docs branch
```

### Manual Operations

```bash
# Manually publish a release
gh workflow run 5-publish.yml -f tag=v1.2.3

# Manually deploy docs
gh workflow run deploy-docs.yml

# Force version bump
gh workflow run 2-version-update.yml -f version_type=minor
```

## Path Filters

### Workflow 2 (Version Update) - Ignores:

- `.github/**` - Workflow changes don't trigger versions
- `docs/**` - Documentation changes don't trigger versions
- `*.md` - README/markdown changes don't trigger versions

### Deploy Docs Workflow - Triggers on:

- `docs/**` - Any documentation changes

## Permissions

All workflows use:

- `contents: write` - For git operations
- `pull-requests: write` - For PR management (where needed)
- `pages: write` - For docs deployment
- `id-token: write` - For npm provenance

## Concurrency

All workflows use concurrency groups to prevent parallel runs:

- `group: workflow-name-${{ github.ref }}`
- `cancel-in-progress`: varies by workflow

## Secrets Required

- `GITHUB_TOKEN` - Automatic (provided by GitHub Actions)
- `WORKFLOW_PAT` - Personal Access Token for creating PRs and triggering workflows (required - owned by thoroc)
- `NPM_TOKEN` - For publishing to npm registry

**Note**: This repository requires `WORKFLOW_PAT` because GitHub Actions is not permitted to create pull requests. The auto-merge workflow is configured to accept version bump PRs from both `github-actions[bot]` and the WORKFLOW_PAT owner (`thoroc`).

## Troubleshooting

### Documentation Not Deploying

**Symptom**: Docs changes merged but not visible

**Cause**: Could be one of:

1. Workflow not triggered (check paths)
2. Build failure (check logs)
3. Deploy step failed (check permissions)

**Solution**:

```bash
# Check workflow runs
gh run list --workflow=deploy-docs.yml --limit 5

# View specific run
gh run view <run-id>

# Manually trigger deployment
gh workflow run deploy-docs.yml
```

### Version Not Bumping

**Symptom**: PR merged but no version PR created

**Cause**: Could be one of:

1. Changes in ignored paths (docs/workflows/markdown)
2. Workflow-generated commit (has `[skip ci]`)
3. No conventional commit pattern

**Solution**:

```bash
# Check workflow runs
gh run list --workflow=2-version-update.yml --limit 5

# Manually trigger version bump
gh workflow run 2-version-update.yml -f version_type=patch
```

### Tag Not Created

**Symptom**: Version PR merged but no tag created

**Cause**: Commit message doesn't match pattern `chore: bump version to X.Y.Z`

**Solution**: The version PR should have the correct message format automatically. If not, check workflow 2 logs.

### Publish Not Triggered

**Symptom**: Tag exists but publish didn't run

**Cause**: Workflow 5 only triggers on tags matching `v*`

**Solution**:

```bash
# Check if tag matches pattern
git tag -l "v*"

# Manually trigger publish
gh workflow run 5-publish.yml -f tag=v1.2.3
```

## Testing Workflows Locally

Use [act](https://github.com/nektos/act) for local testing:

```bash
# Install act
brew install act

# Test validation workflow
act pull_request -W .github/workflows/1-validate.yml

# Test docs deployment
act push -W .github/workflows/deploy-docs.yml
```

## Best Practices

1. **Don't skip workflows**: Avoid `[skip ci]` unless necessary
2. **Use conventional commits**: Ensures correct version bumping
3. **Test locally**: Run `bun run lint` and `bun test` before pushing
4. **Review version PRs**: Auto-merge is enabled but review is good practice
5. **Monitor deployments**: Check Actions tab after merging
6. **Docs independence**: Documentation can deploy without a release

## Related Documentation

- [Scripts Documentation](scripts/README.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated:** 2025-11-12  
**Maintained By:** Pantheon AI Team
