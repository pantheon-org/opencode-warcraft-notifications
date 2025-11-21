# GitHub Workflows

This directory contains the CI/CD pipeline for the project.

## Workflow Overview

### Automated Release Pipeline

1. **[1-validate.yml](1-validate.yml)** - PR Validation
   - Runs on: Pull requests
   - Actions: Lint, type-check, test, build
   - Purpose: Ensure code quality before merge

2. **[2-publish.yml](2-publish.yml)** - Release & Publish
   - Runs on: Tag push (v\*) or manual trigger
   - Actions: Publish to npm → Deploy docs → Create GitHub release
   - Purpose: Complete release process

3. **[3-cleanup.yml](3-cleanup.yml)** - Cleanup
   - Runs on: After publish workflow
   - Actions: Delete old branches, cleanup artifacts
   - Purpose: Repository maintenance

4. **[release-please.yml](release-please.yml)** - Release Please (Version Management)
   - Runs on: Push to main
   - Actions: Analyze commits → Create/update release PR → Create tag on merge
   - Purpose: Automated semantic versioning using Google's Release Please
   - Note: Replaces workflows 2-4 from previous architecture

### Independent Workflows

5. **[deploy-docs.yml](deploy-docs.yml)** - Documentation Deployment
   - Runs on: Push to main with docs/\*\* changes
   - Actions: Build docs → Deploy to docs branch
   - Purpose: Independent docs deployment (no version required)
   - Note: Docs also deploy as part of release pipeline (workflow 2)

6. **[chores-docs-regenerate.yml](chores-docs-regenerate.yml)** - Documentation Regeneration
   - Runs on: Push to main (`.github/**`, `src/**`) or manual trigger
   - Actions: AI analysis → Update docs → Create PR
   - Purpose: Automated documentation maintenance using OpenCode
   - Note: Keeps docs in sync when code or workflows change
   - See: [Documentation Regeneration Guide](../../docs/src/content/docs/github-workflows/docs-regeneration.md)

7. **[chores-pages.yml](chores-pages.yml)** - GitHub Pages Check
   - Runs on: Schedule (daily) or manual trigger
   - Actions: Verify Pages configuration
   - Purpose: Ensure Pages uses correct branch

8. **[chores-repo-config.yml](chores-repo-config.yml)** - Repository Config Check
   - Runs on: Schedule (weekly) or manual trigger
   - Actions: Verify repository settings
   - Purpose: Ensure squash merge strategy

9. **[chores-dependabot.yml](chores-dependabot.yml)** - Dependabot PR Management
   - Runs on: Schedule (daily at 2:00 AM UTC) or manual trigger
   - Actions: Recreate failing PRs, rebase all PRs, close stale PRs
   - Purpose: Automated maintenance of Dependabot pull requests

10. **[chores-cleanup-releases.yml](chores-cleanup-releases.yml)** - Release Cleanup
    - Runs on: Schedule (monthly on 1st) or manual trigger
    - Actions: Delete old releases based on retention policy
    - Purpose: Keep releases page manageable while preserving version history
    - Retention: 10 stable releases, 2 pre-releases, 0 drafts

## Workflow Triggers

### Code Changes → Full Release Pipeline

```
Feature PR → [1] Validate → Merge to main → [release-please] Create/Update Release PR →
Manual Merge → [2] Publish (npm + docs + release) → [3] Cleanup
```

**Note**: Release Please automatically creates/updates a release PR with changelog based on conventional commits.

### Documentation Changes → Immediate Deployment

```
Docs PR → [1] Validate → Merge to main → [deploy-docs] Deploy to docs branch
```

### Workflow Changes → Documentation Update

```
Workflow PR → [1] Validate → Merge to main → [8] Doc Regeneration (analyzes new workflows)
```

### Manual Operations

```bash
# Manually publish a release
gh workflow run 2-publish.yml -f tag=v1.2.3

# Manually deploy docs
gh workflow run deploy-docs.yml

# Regenerate documentation with AI
gh workflow run chores-docs-regenerate.yml -f ai_provider=anthropic -f create_pr=true
# Providers: anthropic, openai, google, github

# Or use the helper script (interactive):
.github/scripts/trigger-docs-regeneration.sh

# Manage Dependabot PRs
gh workflow run chores-dependabot.yml -f action=recreate-failing  # Default: recreate failing PRs
gh workflow run chores-dependabot.yml -f action=rebase-all        # Rebase all Dependabot PRs
gh workflow run chores-dependabot.yml -f action=close-stale -f max_age_days=90  # Close PRs older than 90 days

# Clean up old releases
gh workflow run chores-cleanup-releases.yml  # Runs automatically monthly
```

## Path Filters

### Release Please Workflow:

- Analyzes all commits to main branch
- Creates release PRs based on conventional commits
- No path filters - evaluates all changes

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

**AI Documentation (at least one required):**

- `ANTHROPIC_API_KEY` - For Anthropic Claude (recommended)
- `OPENAI_API_KEY` - For OpenAI ChatGPT
- `GOOGLE_API_KEY` - For Google Gemini
- `GITHUB_TOKEN` - For GitHub Copilot (already available by default)

**Note**: This repository requires `WORKFLOW_PAT` because GitHub Actions is not permitted to create pull requests. The auto-merge workflow is configured to accept version bump PRs from both `github-actions[bot]` and the WORKFLOW_PAT owner (`thoroc`).

**AI Documentation**: At least one AI provider key is required for the documentation regeneration workflow. Choose based on your preference and available credits.

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

### Release PR Not Created

**Symptom**: PR merged but no release PR created

**Cause**: Could be one of:

1. No conventional commit patterns detected
2. Release Please workflow failed

**Solution**:

```bash
# Check workflow runs
gh run list --workflow=release-please.yml --limit 5

# View specific run
gh run view <run-id>

# Manually trigger Release Please
gh workflow run release-please.yml
```

### Tag Not Created

**Symptom**: Release PR merged but no tag created

**Cause**: Release Please workflow handles tag creation automatically on PR merge

**Solution**: Check Release Please workflow logs for any errors

### Publish Not Triggered

**Symptom**: Tag exists but publish didn't run

**Cause**: Workflow 2 only triggers on tags matching `v*`

**Solution**:

```bash
# Check if tag matches pattern
git tag -l "v*"

# Manually trigger publish
gh workflow run 2-publish.yml -f tag=v1.2.3
```

### Dependabot PRs Failing

**Symptom**: Multiple Dependabot PRs are failing CI checks

**Cause**: Could be one of:

1. Dependency conflicts
2. Breaking changes in updated packages
3. Outdated PR needs rebase

**Solution**:

```bash
# Check status of all Dependabot PRs
gh pr list --author app/dependabot

# Recreate all failing PRs (runs automatically daily at 2:00 AM UTC)
gh workflow run chores-dependabot.yml -f action=recreate-failing

# Rebase all Dependabot PRs
gh workflow run chores-dependabot.yml -f action=rebase-all

# Or manually trigger recreate on specific PR
gh pr comment <PR#> --body "@dependabot recreate"

# Or manually rebase specific PR
gh pr comment <PR#> --body "@dependabot rebase"
```

### Too Many Stale Dependabot PRs

**Symptom**: Many old Dependabot PRs accumulating

**Cause**: PRs not being merged or closed

**Solution**:

```bash
# Close PRs older than 90 days (default)
gh workflow run chores-dependabot.yml -f action=close-stale

# Close PRs older than 60 days
gh workflow run chores-dependabot.yml -f action=close-stale -f max_age_days=60

# Or manually close specific PR
gh pr close <PR#> --comment "Closing stale PR"
```

### Too Many Old Releases

**Symptom**: Releases page cluttered with old versions

**Cause**: Automated releases accumulating over time

**Solution**:

```bash
# Manually trigger cleanup (runs automatically monthly)
gh workflow run chores-cleanup-releases.yml

# Check recent cleanup runs
gh run list --workflow=chores-cleanup-releases.yml --limit 5

# View specific run details
gh run view <run-id>
```

**Retention Policy**:

- Stable releases: Last 10 kept (tags preserved for version history)
- Pre-releases: Last 2 kept (tags deleted)
- Draft releases: All deleted

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

**Last Updated:** 2025-11-21  
**Maintained By:** Pantheon AI Team
