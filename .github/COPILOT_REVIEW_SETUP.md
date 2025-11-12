# GitHub Copilot Code Review Setup

This document explains how GitHub Copilot automatic code review is configured in this repository.

## 🎯 What's Configured

This repository is set up with **automatic GitHub Copilot code reviews** that trigger on every pull request.

## 🚀 How It Works

### Automatic Reviews

When you open or update a PR:

1. **Workflow Triggers**: The `copilot-review.yml` workflow automatically runs
2. **Copilot Analyzes**: GitHub Copilot reviews your code changes (~30 seconds)
3. **Feedback Provided**: Copilot leaves comments with suggestions and improvements
4. **One-Click Fixes**: Many suggestions can be applied with a single click

### Workflow Integration

The Copilot review is integrated into our existing validation workflow:

```
Pull Request Opened/Updated
    ↓
1. Validate (Lint, Test, Build) ← Your existing checks
2. Security Analysis            ← Your existing checks
3. PR Analysis                  ← Your existing checks
4. Copilot Review              ← ✨ NEW: AI code review
```

## 📁 Configuration Files

### 1. `.github/workflows/1-validate.yml`

Updated to include a `copilot-review` job that:

- Requests Copilot as a reviewer
- Adds an informative comment to the PR
- Waits for review completion
- Handles cases where Copilot isn't available

### 2. `.github/workflows/copilot-review.yml`

Dedicated workflow for Copilot reviews that:

- Runs automatically on PR events
- Can be manually triggered for any PR
- Skips draft PRs and bot PRs
- Handles re-reviews on code changes
- Updates status comments

### 3. `.github/copilot-instructions.md`

Custom instructions that guide Copilot to:

- Focus on project-specific concerns
- Check sound file paths and faction logic
- Verify TypeScript types and test coverage
- Follow Warcraft theme consistency
- Provide constructive feedback

## 🛠️ Setup Requirements

### For Repository Admins

To enable Copilot reviews, you need:

1. **GitHub Copilot Subscription**:
   - Individual: $10/month
   - Business: $19/user/month
   - Enterprise: $39/user/month

2. **Enable in Repository Settings**:

   ```
   Repository Settings → Code review → Enable GitHub Copilot
   ```

3. **Configure Automatic Reviews** (Optional):
   ```
   Repository Settings → Code review → Auto-request reviews
   ```

### For Contributors

Nothing special required! Just:

1. Open a PR as usual
2. Wait for Copilot's review (~30 seconds)
3. Review the feedback in the "Files changed" tab
4. Apply suggestions or dismiss as appropriate

## 💡 Using Copilot Reviews

### Review Comments

Copilot will comment on:

- 🔴 **Critical**: Security issues, bugs, crashes
- 🟡 **Important**: Missing tests, bad patterns
- 🟢 **Nice-to-have**: Optimizations, improvements

### Applying Suggestions

When Copilot suggests a code change:

1. Click **"Commit suggestion"** on the review comment
2. The change is applied to your branch
3. Continue working or open for human review

### Re-reviews

Copilot automatically re-reviews when you:

- Push new commits to the PR
- Manually request a re-review (click ↻ next to Copilot in reviewers)

## 🤔 FAQ

### Q: Does Copilot's review block merging?

**A:** No! Copilot reviews are "Comment" type, not "Request changes". They're advisory only.

### Q: Can I disable Copilot review for a specific PR?

**A:** Yes, mark the PR as "Draft" or remove Copilot from reviewers manually.

### Q: What if Copilot isn't available?

**A:** The workflow will comment on the PR with setup instructions. See [AI_CODE_REVIEWERS_GUIDE.md](../../AI_CODE_REVIEWERS_GUIDE.md) for alternatives.

### Q: How much does this cost?

**A:** Copilot reviews are included in your Copilot subscription at no extra charge.

### Q: Can I customize what Copilot reviews?

**A:** Yes! Edit `.github/copilot-instructions.md` to change review focus areas.

### Q: Should I trust Copilot's suggestions?

**A:** Copilot is a helpful tool, but:

- ✅ Always use human judgment
- ✅ Test suggested changes
- ✅ Get human review for critical code
- ✅ Provide feedback (👍👎) to improve quality

### Q: What data does Copilot see?

**A:** Copilot sees:

- Your PR diff (changed files only)
- Custom instructions from `.github/copilot-instructions.md`
- Public repository metadata

Copilot does NOT see:

- Private repository data (unless you've granted access)
- Secret/environment variables
- Historical code from closed PRs

See [GitHub Copilot data usage](https://docs.github.com/en/copilot/overview-of-github-copilot/about-github-copilot-for-individuals#about-data-collection) for details.

## 🔧 Troubleshooting

### Copilot Review Not Requested

If the workflow fails to request Copilot:

1. **Check Copilot is enabled**: Repository Settings → Code review
2. **Verify subscription**: Your organization has an active Copilot subscription
3. **Check permissions**: The `GITHUB_TOKEN` has `pull-requests: write` permission
4. **Manual trigger**: Go to Actions → Copilot Code Review → Run workflow

### Review Takes Too Long

The workflow waits up to 90 seconds. If Copilot hasn't reviewed by then:

1. Check the PR - review may still complete shortly
2. Re-trigger the workflow manually
3. Manually add Copilot as a reviewer from PR sidebar

### Review Comments Not Appearing

If Copilot is requested but no comments appear:

1. Copilot may have found no issues (good news!)
2. Check the "Files changed" tab for inline comments
3. Look for a review summary at the bottom of the Conversation tab

## 🎓 Learn More

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Code Review Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)
- [AI Code Reviewers Guide](../../AI_CODE_REVIEWERS_GUIDE.md) - Compare Copilot, Claude, and Gemini

## 🤝 Contributing to Review Quality

Help improve Copilot's reviews:

1. **Provide Feedback**: Use 👍👎 on review comments
2. **Update Instructions**: Suggest improvements to `.github/copilot-instructions.md`
3. **Report Issues**: If Copilot misses critical issues, let maintainers know
4. **Share Wins**: Found a bug thanks to Copilot? Share in PR comments!

---

**Status**: ✅ Active  
**Last Updated**: November 12, 2024  
**Maintainer**: @pantheon-org team

_For the Alliance! For the Horde! For clean code with AI!_ ⚔️
