# Dependabot PR Management - Quick Reference

## Overview

The Dependabot PR Management workflow (`chores-dependabot.yml`) automatically maintains Dependabot pull requests by recreating failing PRs, rebasing all PRs, or closing stale PRs.

## Schedule

- **Runs Daily**: 2:00 AM UTC
- **Default Action**: Recreate failing PRs

## Available Actions

### 1. Recreate Failing PRs (Default)

Automatically recreates Dependabot PRs that have failed CI checks.

```bash
# Manual trigger
gh workflow run chores-dependabot.yml -f action=recreate-failing
```

**What it does:**

- Identifies all open Dependabot PRs with failing status checks
- Comments `@dependabot recreate` on each failing PR
- Dependabot discards existing changes and creates a fresh PR
- Useful when PRs fail due to conflicts or breaking changes

**When to use:**

- PRs are failing CI after dependency updates
- Conflicts need to be resolved automatically
- Breaking changes need fresh analysis

### 2. Rebase All PRs

Rebases all open Dependabot PRs against the latest main branch.

```bash
# Manual trigger
gh workflow run chores-dependabot.yml -f action=rebase-all
```

**What it does:**

- Finds all open Dependabot PRs
- Comments `@dependabot rebase` on each PR
- Dependabot rebases the PR against latest main
- Preserves existing changes while updating base

**When to use:**

- After merging significant changes to main
- PRs are outdated but don't need recreation
- Want to trigger CI re-runs on latest code

### 3. Close Stale PRs

Closes Dependabot PRs older than a specified number of days.

```bash
# Close PRs older than 90 days (default)
gh workflow run chores-dependabot.yml -f action=close-stale

# Close PRs older than 60 days
gh workflow run chores-dependabot.yml -f action=close-stale -f max_age_days=60

# Close PRs older than 30 days
gh workflow run chores-dependabot.yml -f action=close-stale -f max_age_days=30
```

**What it does:**

- Identifies Dependabot PRs older than specified days
- Closes each PR with a comment explaining why
- Dependabot will create new PRs if updates are still relevant

**When to use:**

- Cleaning up old, unmerged PRs
- Dependency updates are no longer relevant
- Want fresh PRs for long-pending updates

## Manual Dependabot Commands

You can also interact with Dependabot directly on individual PRs:

```bash
# Rebase a specific PR
gh pr comment <PR#> --body "@dependabot rebase"

# Recreate a specific PR
gh pr comment <PR#> --body "@dependabot recreate"

# Merge a specific PR when CI passes
gh pr comment <PR#> --body "@dependabot merge"

# Squash and merge
gh pr comment <PR#> --body "@dependabot squash and merge"

# Close a specific PR
gh pr comment <PR#> --body "@dependabot close"

# Reopen a closed PR
gh pr comment <PR#> --body "@dependabot reopen"

# Ignore this dependency
gh pr comment <PR#> --body "@dependabot ignore this dependency"

# Ignore this major version
gh pr comment <PR#> --body "@dependabot ignore this major version"

# Ignore this minor version
gh pr comment <PR#> --body "@dependabot ignore this minor version"

# Ignore this patch version
gh pr comment <PR#> --body "@dependabot ignore this patch version"
```

## Monitoring Dependabot PRs

### List All Open Dependabot PRs

```bash
gh pr list --author app/dependabot
```

### Check PR Status with Details

```bash
gh pr list --author app/dependabot --json number,title,statusCheckRollup
```

### Count PRs by Status

```bash
# Count total open PRs
gh pr list --author app/dependabot --json number --jq 'length'

# List failing PRs
gh pr list --author app/dependabot --json number,title,statusCheckRollup \
  --jq '.[] | select(.statusCheckRollup | any(.conclusion == "FAILURE")) | .number'

# List passing PRs
gh pr list --author app/dependabot --json number,title,statusCheckRollup \
  --jq '.[] | select(.statusCheckRollup | all(.conclusion == "SUCCESS")) | .number'
```

### View Specific PR Details

```bash
gh pr view <PR#>
gh pr checks <PR#>
```

## Workflow Outputs

The workflow generates a summary report showing:

- **Total open Dependabot PRs**
- **Passing PRs** (✅)
- **Failing PRs** (❌)
- **Pending PRs** (⏳)
- **Actions performed** (recreated, rebased, closed)

View the summary in:

- GitHub Actions run page → Summary tab
- Workflow run logs

## Error Handling

### Workflow Failure

If the workflow fails, it automatically:

1. Creates an issue titled "⚠️ Dependabot PR Management Failed"
2. Labels it with: `dependabot-management`, `automation`, `dependencies`
3. Includes workflow run details and troubleshooting steps
4. On subsequent failures, adds comments to existing issue

### Rate Limiting

The workflow includes 2-second delays between PR operations to avoid GitHub API rate limits.

## Best Practices

1. **Let it run automatically**: The daily schedule handles most cases
2. **Use recreate for conflicts**: When PRs have merge conflicts or breaking changes
3. **Use rebase for updates**: When you just merged changes to main
4. **Close stale PRs periodically**: Keep the PR list clean and relevant
5. **Monitor the summary**: Check workflow summaries to understand PR health

## Integration with Other Workflows

The Dependabot management workflow runs independently but complements:

- **1-validate.yml**: Validates Dependabot PRs like any other PR
- **3-auto-merge.yml**: Can auto-merge passing Dependabot PRs (if configured)
- **6-cleanup.yml**: Cleans up merged Dependabot branches

## Troubleshooting

### Workflow Not Running

```bash
# Check recent workflow runs
gh run list --workflow=chores-dependabot.yml --limit 5

# View specific run details
gh run view <run-id>
```

### PRs Not Being Recreated

**Possible causes:**

- PRs are not actually failing (check status)
- GitHub API rate limits reached
- Dependabot is busy with other repositories

**Solution:**

- Wait a few hours and try again
- Check workflow run logs
- Manually recreate specific PRs

### Too Many PRs Created

**Possible causes:**

- Multiple version updates available
- Dependabot configuration allows many PRs

**Solution:**

- Review `.github/dependabot.yml` configuration
- Use `close-stale` action to reduce count
- Merge or close PRs that aren't needed

## Configuration

The workflow requires these permissions:

```yaml
permissions:
  contents: read # Read repository content
  pull-requests: write # Comment on and manage PRs
  issues: write # Create issues on failures
```

No secrets beyond `GITHUB_TOKEN` (automatic) are required.

## Related Files

- Workflow: `.github/workflows/chores-dependabot.yml`
- Dependabot config: `.github/dependabot.yml`
- Workflow docs: `.github/workflows/README.md`

## Quick Command Reference

```bash
# View all Dependabot PRs
gh pr list --author app/dependabot

# Recreate failing PRs
gh workflow run chores-dependabot.yml -f action=recreate-failing

# Rebase all PRs
gh workflow run chores-dependabot.yml -f action=rebase-all

# Close stale PRs (>90 days)
gh workflow run chores-dependabot.yml -f action=close-stale

# Check workflow runs
gh run list --workflow=chores-dependabot.yml

# View workflow file
cat .github/workflows/chores-dependabot.yml
```

---

**Last Updated:** 2025-11-13  
**Workflow:** chores-dependabot.yml  
**Maintainer:** Pantheon AI Team
