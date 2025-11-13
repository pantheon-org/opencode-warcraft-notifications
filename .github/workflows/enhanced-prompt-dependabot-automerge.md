# Enhanced Prompt

**Title:** Add auto-merge capability for passing Dependabot PRs to the chores-dependabot.yml workflow

**Goal:** Modify the existing `.github/workflows/chores-dependabot.yml` GitHub Actions workflow to automatically squash merge any open Dependabot pull request that has all CI/CD pipelines passing (all status checks successful). This ensures approved dependency updates are merged without manual intervention while maintaining code quality through required checks.

**Context:**

- The repository already has a `chores-dependabot.yml` workflow that manages Dependabot PRs (recreating failing ones, rebasing, closing stale PRs)
- The workflow currently runs daily at 2:00 AM UTC and supports manual dispatch with different actions
- Repository uses squash merge strategy as the standard (enforced by repo config checks)
- Dependabot PRs go through the standard validation workflow (`1-validate.yml`) which includes linting, testing, type checking, and security scanning
- The workflow already has permissions for `pull-requests: write` which is sufficient for merging

**Inputs:**

- Current workflow file: `.github/workflows/chores-dependabot.yml` (314 lines)
- Repository merge strategy: squash merge only (enforced)
- Status check requirements: All checks must pass (SUCCESS, NEUTRAL, or SKIPPED conclusions)
- GitHub CLI (`gh`) is already available in the workflow environment
- GITHUB_TOKEN secret is already configured with necessary permissions

**Deliverables:**

1. Modified `.github/workflows/chores-dependabot.yml` with a new workflow_dispatch action option called `merge-passing`
2. New scheduled job step (or separate action) that identifies and squash merges passing Dependabot PRs
3. Updated workflow to include this auto-merge in the daily scheduled run alongside recreating failing PRs
4. Summary report section that shows count of PRs merged automatically
5. Error handling that creates issues if auto-merge fails persistently

**Constraints & Limitations:**

- Must use `gh pr merge --squash` command (repository enforces squash merge only)
- Only merge PRs where ALL status checks have conclusion of SUCCESS, NEUTRAL, or SKIPPED
- Do NOT merge PRs with any FAILURE, TIMED_OUT, STARTUP_FAILURE, or PENDING/IN_PROGRESS status
- Must include rate limiting delays (2 second sleep between operations) to avoid GitHub API limits
- Must maintain existing workflow structure and all current actions (recreate-failing, rebase-all, close-stale)
- Use GitHub Actions YAML syntax; maintain consistency with existing workflow style
- Must not merge PRs that have required reviews unless they are already approved

**Quality Standards & Acceptance Criteria:**

- Workflow successfully identifies passing Dependabot PRs using `gh pr list` with JSON output and jq filtering
- Only PRs with all passing checks are merged (testable by checking statusCheckRollup array)
- Squash merge is used exclusively (verify with `--squash` flag)
- Summary report includes count of successfully merged PRs and any failures
- Workflow includes proper error handling with output variables
- Rate limiting is respected with sleep delays between merge operations
- Existing actions (recreate-failing, rebase-all, close-stale) continue to work unchanged
- New action can be triggered manually via `gh workflow run chores-dependabot.yml -f action=merge-passing`

**Style & Tone:**
Technical, professional, and consistent with existing GitHub Actions workflow conventions. Use emoji indicators (✅, ❌, 🔄, 📊) matching the current workflow style. Include clear echo statements for logging. Target audience: DevOps engineers and repository maintainers familiar with GitHub Actions and CI/CD pipelines.

**Clarifying Questions:**

1. Should the auto-merge run as part of the daily scheduled workflow (alongside recreate-failing), or only on manual dispatch?
2. Are there any specific Dependabot PR patterns to exclude from auto-merge (e.g., major version bumps, specific dependencies)?
3. Should the workflow wait for pending checks to complete before deciding to merge, or skip PRs with any pending checks?

**Example Output:**

```yaml
# New workflow_dispatch option
options:
  - recreate-failing
  - rebase-all
  - close-stale
  - merge-passing  # NEW OPTION

# New step in workflow
- name: Auto-merge passing Dependabot PRs
  if: ${{ github.event_name == 'schedule' || github.event.inputs.action == 'merge-passing' }}
  run: |
    # Identify passing PRs
    gh pr list --author app/dependabot --state open \
      --json number,statusCheckRollup \
      --jq '.[] | select(.statusCheckRollup | all(.conclusion == "SUCCESS" or .conclusion == "NEUTRAL" or .conclusion == "SKIPPED")) | .number'
    # Squash merge each passing PR
    gh pr merge "$pr_number" --squash --auto
```

**"Do not do" list:**

1. Do not add approval or review requirements that bypass repository branch protection rules
2. Do not merge PRs with any failing, pending, or incomplete status checks
3. Do not change the existing workflow actions (recreate-failing, rebase-all, close-stale) or their functionality
