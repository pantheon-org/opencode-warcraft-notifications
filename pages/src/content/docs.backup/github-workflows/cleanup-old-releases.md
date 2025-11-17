---
title: 'Cleanup Old Releases Workflow'
description: '**File -** `.github/workflows/cleanup-old-releases.yml`'
---

# Cleanup Old Releases Workflow

**File:** `.github/workflows/cleanup-old-releases.yml`  
**Purpose:** Automatically maintain a limited number of releases to prevent repository bloat

## Overview

The Cleanup Old Releases workflow automatically manages repository releases by implementing a retention policy that keeps only the most relevant releases while removing outdated ones. This helps maintain repository performance and reduces storage costs.

## Retention Policy

The workflow implements a carefully designed retention strategy:

- **Major Versions**: Keep up to **5 latest major versions** (e.g., v5.x.x, v4.x.x, v3.x.x, v2.x.x, v1.x.x)
- **Current Major**: Keep up to **10 latest minor/patch releases** for the **current (newest) major version only**
- **Older Majors**: Keep only the **latest release** for each older major version

### Example Retention Logic

```typescript
// Before cleanup:
v3.2.5, v3.2.4, v3.2.3, v3.2.2, v3.2.1, v3.1.9, v3.1.8, v3.1.7, v3.1.6, v3.1.5, v3.1.4, v3.1.3
v2.8.1, v2.8.0, v2.7.9, v2.7.8, v2.7.7, v2.7.6
v1.15.2, v1.15.1, v1.15.0

// After cleanup:
v3.2.5, v3.2.4, v3.2.3, v3.2.2, v3.2.1, v3.1.9, v3.1.8, v3.1.7, v3.1.6, v3.1.5  (10 kept - current major)
v2.8.1                                                                               (1 kept - latest of v2.x.x)
v1.15.2                                                                              (1 kept - latest of v1.x.x)

// Deleted:
// - v3.1.4, v3.1.3 (exceeded 10 limit for current major v3.x.x)
// - v2.8.0, v2.7.9, v2.7.8, v2.7.7, v2.7.6 (older releases from v2.x.x)
// - v1.15.1, v1.15.0 (older releases from v1.x.x)
```

## Triggers

The workflow runs in three scenarios:

### 1. Scheduled Execution

- **When**: Every Sunday at 2:00 AM UTC
- **Purpose**: Regular maintenance to keep releases within limits
- **Mode**: Live execution (actually deletes releases)

### 2. After New Releases

- **When**: Automatically triggered when new tags are pushed (v\* pattern)
- **Purpose**: Immediate cleanup after publishing new releases
- **Mode**: Live execution (actually deletes releases)

### 3. Manual Execution

- **When**: On-demand via GitHub Actions UI or CLI
- **Purpose**: Testing, emergency cleanup, or maintenance
- **Mode**: Dry-run by default (shows what would be deleted)

## Workflow Parameters

### Input Parameters

| Parameter | Type    | Default | Description                                                        |
| --------- | ------- | ------- | ------------------------------------------------------------------ |
| `dry_run` | boolean | `true`  | When `true`, shows what would be deleted without actually deleting |

## Jobs and Steps

### Job: `cleanup-releases`

**Runtime**: Ubuntu Latest  
**Permissions**: `contents: write` (required for deleting releases and tags)

#### Steps Overview

1. **Checkout Repository**
   - Uses `actions/checkout@v4`
   - Provides access to repository metadata

2. **Setup Node.js**
   - Uses `actions/setup-node@v4` with Node.js 20
   - Required for GitHub API operations

3. **Cleanup Old Releases**
   - Main logic implemented in GitHub Script
   - Comprehensive release analysis and cleanup

4. **Summary**
   - Displays retention policy and execution information
   - Provides guidance for manual execution

#### Detailed Cleanup Process

The main cleanup step performs the following operations:

1. **Fetch All Releases**

   ```javascript
   const { data: releases } = await github.rest.repos.listReleases({
     owner: context.repo.owner,
     repo: context.repo.repo,
     per_page: 100,
   });
   ```

2. **Parse Semantic Versions**
   - Validates each release tag against semantic version format (`v1.2.3`)
   - Skips releases with invalid version formats
   - Extracts major, minor, patch, and prerelease components

3. **Sort and Group**
   - Sorts releases by semantic version (newest first)
   - Groups releases by major version number
   - Identifies current (latest) major version

4. **Apply Retention Rules**
   - **Current Major**: Keep up to 10 most recent releases
   - **Older Majors**: Keep only the latest release from each major version
   - **Excess Majors**: Mark entire major versions for deletion (beyond 5 major limit)

5. **Safety Analysis**
   - Calculates what will be kept vs. deleted
   - Displays detailed summary before any actions
   - Shows exact release names and creation dates

6. **Execute Deletions** (if not dry-run)
   - Deletes releases via GitHub API
   - Removes associated Git tags
   - Includes rate limiting to avoid API limits
   - Continues on individual failures
   - Reports success/failure statistics

## Execution Modes

### Dry Run Mode (Default)

**Purpose**: Safe analysis and testing

```bash
# Manual execution (dry run)
gh workflow run "Cleanup Old Releases"
# OR explicitly
gh workflow run "Cleanup Old Releases" -f dry_run=true
```

**Behavior**:

- ✅ Analyzes all releases and shows detailed report
- ✅ Displays exactly what would be deleted
- ✅ No actual deletions performed
- ✅ Safe to run anytime

**Sample Output**:

```
🧹 Starting release cleanup (dry run: true)
📦 Found 25 total releases
📊 Parsed 25 valid releases
🏷️ Found 3 major version groups: v3.x.x, v2.x.x, v1.x.x
📌 Keeping major versions: v3.x.x, v2.x.x, v1.x.x
📦 Current major v3: keeping 10/15 releases
📦 Older major v2: keeping 1/6 releases (latest only)
📦 Older major v1: keeping 1/3 releases (latest only)

📊 Summary:
  ✅ Releases to keep: 12
  🗑️ Releases to delete: 13

📋 Releases to delete:
  - v3.1.4 (3.1.4) - created 2024-10-15T10:30:00Z
  - v3.1.3 (3.1.3) - created 2024-10-10T14:20:00Z
  [...]

🔍 DRY RUN: No releases were actually deleted.
💡 To perform the actual cleanup, run this workflow with 'dry_run' set to false.
```

### Live Execution Mode

**Purpose**: Actually delete releases

```bash
# Manual execution (live deletions)
gh workflow run "Cleanup Old Releases" -f dry_run=false
```

**Behavior**:

- 🗑️ Actually deletes old releases and associated Git tags
- ⚠️ **Irreversible** - deleted releases cannot be recovered
- 📊 Reports deletion success/failure statistics
- ⏱️ Includes delays between API calls to avoid rate limiting

**Sample Output**:

```
[... same analysis as dry run ...]

🗑️ Starting deletion process...
🗑️ Deleting release: v3.1.4
🏷️ Deleted tag: v3.1.4
🗑️ Deleting release: v3.1.3
🏷️ Deleted tag: v3.1.3
[...]

✅ Cleanup completed!
  🗑️ Successfully deleted: 13 releases
  📦 Remaining releases: 12
```

### Automatic Execution

**Scheduled** (Weekly):

- Runs every Sunday at 2:00 AM UTC
- Uses live execution mode (`dry_run=false`)
- Provides consistent maintenance without manual intervention

**After Releases** (Triggered):

- Runs automatically when new version tags are pushed
- Uses live execution mode (`dry_run=false`)
- Keeps release history current immediately after new releases

## Error Handling and Safety

### Built-in Safety Features

1. **Dry Run Default**: Manual executions default to safe mode
2. **Detailed Logging**: Shows exactly what will happen before doing it
3. **Version Validation**: Skips releases with invalid version formats
4. **Graceful Failures**: Continues cleanup even if individual deletions fail
5. **Rate Limiting**: Includes delays to avoid GitHub API rate limits

### Error Scenarios

| Error                           | Cause                                          | Behavior                                            |
| ------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| **Permission Denied**           | Insufficient GitHub token permissions          | Workflow fails with clear error message             |
| **Invalid Version Format**      | Release tag doesn't follow semantic versioning | Skips the release, continues with others            |
| **Individual Deletion Failure** | API error for specific release                 | Logs error, continues with remaining deletions      |
| **Rate Limiting**               | Too many API calls                             | Built-in delays prevent this; retry later if needed |
| **No Releases Found**           | Repository has no releases                     | Exits gracefully with informational message         |

## Use Cases

### Regular Maintenance

- **Automated**: Weekly cleanup keeps release history manageable
- **Post-Release**: Immediate cleanup after new releases maintains current limits
- **Storage**: Reduces repository storage used by old release artifacts

### Repository Health

- **Performance**: Fewer releases improve GitHub UI performance
- **Organization**: Clean release history makes navigation easier
- **Compliance**: Meet organizational data retention policies

### Development Workflow

- **CI/CD Integration**: Automatically triggered after release publishing
- **Testing**: Dry-run mode allows safe testing before live execution
- **Emergency**: Manual execution for immediate cleanup when needed

## Monitoring and Troubleshooting

### Monitoring Commands

```bash
# Check recent workflow runs
gh run list --workflow="cleanup-old-releases.yml" --limit 10

# View specific workflow execution
gh run view <run-id> --log

# List current releases
gh release list --limit 20

# Count releases by major version
gh release list --json tagName --jq '.[].tagName' |
  grep -E '^v[0-9]+\.' | cut -d. -f1 | sort | uniq -c
```

### Common Issues and Solutions

#### No Releases Deleted

- **Cause**: All releases are within retention limits
- **Solution**: Normal operation, no action needed
- **Check**: Verify current release count vs. limits

#### Permission Errors

- **Cause**: `GITHUB_TOKEN` lacks `contents: write` permission
- **Solution**: Check repository workflow permissions
- **Verify**: Ensure workflow has proper permissions block

#### Workflow Not Triggering

- **Cause**: Branch protection or workflow permissions
- **Solution**: Check repository settings and workflow file syntax
- **Debug**: Use manual execution to test functionality

#### Rate Limiting Errors

- **Cause**: Too many API calls in short period
- **Solution**: Workflow includes built-in delays; retry later
- **Prevention**: Don't run multiple instances simultaneously

### Debug Commands

```bash
# Test with dry run
gh workflow run "Cleanup Old Releases" -f dry_run=true

# Check workflow file syntax
npx yaml valid .github/workflows/cleanup-old-releases.yml

# View recent releases
gh release list --json tagName,createdAt --jq '.[] | "\(.tagName) - \(.createdAt)"' | head -20

# Check repository permissions
gh api repos/:owner/:repo --jq '.permissions'
```

## Best Practices

### Before Implementation

1. **Test First**: Always run in dry-run mode before live execution
2. **Backup Important**: Consider backing up important release artifacts externally
3. **Review Policy**: Ensure retention numbers match project needs

### During Operation

1. **Monitor Logs**: Review weekly cleanup logs for unexpected behavior
2. **Track Storage**: Monitor repository storage usage trends
3. **Version Strategy**: Maintain consistent semantic versioning

### Maintenance

1. **Regular Review**: Periodically review retention policy effectiveness
2. **Adjust Numbers**: Modify retention counts based on project evolution
3. **Documentation**: Keep usage documentation current with any changes

## Integration with Other Workflows

### Upstream Dependencies

- **Smart Version Bump**: Creates new tags that trigger this workflow
- **Release & Publish**: Creates releases that may be subject to cleanup

### Downstream Effects

- **Storage Reduction**: Reduces repository storage usage
- **API Performance**: Fewer releases improve GitHub API response times
- **User Experience**: Cleaner release history improves navigation

## Security Considerations

### Permissions Required

- `contents: write` - Required to delete releases and Git tags
- Repository access - Workflow must have access to target repository

### Data Protection

- **Irreversible**: Deleted releases cannot be recovered
- **Git Tags**: Associated tags are also deleted from Git history
- **Artifacts**: Release artifacts (binaries, etc.) are permanently removed

### Access Control

- **Branch Protection**: Workflow file changes subject to normal PR process
- **Manual Execution**: Requires repository write access
- **Scheduled Execution**: Runs with repository-level permissions

## Configuration

### Customizing Retention Policy

To modify retention numbers, edit the workflow file:

```yaml
# Keep up to 5 major versions
const majorsToKeep = majorVersions.slice(0, 5);

# Keep up to 10 releases for current major
const keepCount = Math.min(10, releases.length);
```

### Adjusting Schedule

```yaml
schedule:
  # Run weekly on Sundays at 2 AM UTC
  - cron: '0 2 * * 0'
  # Change to daily: '0 2 * * *'
  # Change to monthly: '0 2 1 * *'
```

### Modifying Triggers

```yaml
on:
  push:
    tags:
      - 'v*' # Trigger on version tags
      # - 'release-*' # Alternative trigger pattern
```

## Emergency Recovery

### Tag Recreation

If tags are accidentally deleted:

```bash
# Find commit hash for version
git log --oneline --grep="v1.2.3"

# Recreate tag
git tag v1.2.3 <commit-hash>
git push origin v1.2.3
```

### Release Recreation

If releases are accidentally deleted:

```bash
# Recreate release from existing tag
gh release create v1.2.3 --title "Release v1.2.3" --notes "Recreated release"
```

**Note**: Original release artifacts cannot be recovered and must be rebuilt.

---

_This documentation covers the complete functionality of the Cleanup Old Releases workflow. For questions or issues, refer to the troubleshooting section or repository maintainers._
