---
title: Documentation Deployment Migration Plan
description: Step-by-step guide for migrating to the docs branch deployment workflow
---

# Documentation Deployment Migration Plan

This document provides a comprehensive, step-by-step plan for migrating the documentation deployment from the current setup to the new **docs branch workflow**.

## Migration Overview

### Current State

- Documentation built with Astro/Starlight
- Generated artifacts may exist in `dist/` directory on main branch
- Deployment uses GitHub Pages with artifacts uploaded directly
- Build artifacts tracked in version control (undesirable)

### Target State

- Source markdown files remain on `main` branch
- Generated artifacts automatically deployed to `docs` branch
- GitHub Pages serves from `docs` branch
- No build artifacts in main branch version control
- Automated CI/CD pipeline handles all deployments

### Migration Scope

- Update `.gitignore` to exclude build artifacts on main branch
- Modify GitHub Actions workflow for docs branch deployment
- Remove existing build artifacts from main branch history
- Create and configure `docs` branch
- Update GitHub Pages settings
- Verify deployment works correctly

## Prerequisites

Before starting the migration:

- [ ] Administrator access to the GitHub repository
- [ ] Understanding of Git branching and GitHub Actions
- [ ] Backup of current main branch (optional but recommended)
- [ ] All pending documentation PRs merged or noted

### Required Permissions

- Repository **write** access
- GitHub Actions enabled
- GitHub Pages enabled
- Ability to modify branch protection rules (if any)

## Migration Steps

### Phase 1: Preparation (5 minutes)

#### Step 1.1: Verify Current State

```bash
# Clone or update your local repository
git clone https://github.com/pantheon-org/opencode-warcraft-notifications.git
cd opencode-warcraft-notifications
git checkout main
git pull origin main

# Check for existing build artifacts
ls -la dist/ 2>/dev/null
ls -la docs/dist/ 2>/dev/null

# Check git status
git status
```

**Expected output**: May show `dist/` directory with generated files.

#### Step 1.2: Create a Backup Branch (Optional)

```bash
# Create backup of current state
git checkout -b backup/pre-docs-migration
git push origin backup/pre-docs-migration
git checkout main
```

**Purpose**: Safety net in case rollback is needed.

### Phase 2: Update Main Branch (10 minutes)

#### Step 2.1: Update `.gitignore`

The `.gitignore` file has been updated to exclude build artifacts:

```gitignore
# Generated documentation artifacts (deployed to docs branch)
dist/
.astro/

# Documentation build artifacts
docs/node_modules/
docs/.astro/
docs/dist/
```

**Verification**:

```bash
# Check that .gitignore is updated
cat .gitignore | grep -A 5 "Generated documentation artifacts"
```

#### Step 2.2: Remove Build Artifacts from Version Control

```bash
# Remove build artifacts from Git tracking (if they exist)
git rm -r --cached dist/ 2>/dev/null || true
git rm -r --cached docs/dist/ 2>/dev/null || true
git rm -r --cached docs/.astro/ 2>/dev/null || true
git rm -r --cached .astro/ 2>/dev/null || true

# Check status - should show deleted files
git status
```

#### Step 2.3: Commit Changes

```bash
# Commit the removal of build artifacts
git add .gitignore
git commit -m "chore: Remove build artifacts from version control

- Update .gitignore to exclude dist/ and .astro/ directories
- Remove build artifacts from Git tracking
- Prepare for docs branch deployment workflow"

# Push to main
git push origin main
```

**Expected result**: Build artifacts no longer tracked on main branch.

### Phase 3: Update GitHub Actions Workflow (5 minutes)

The workflow file `.github/workflows/deploy-docs.yml` has been updated to:

1. Deploy to `docs` branch instead of directly to GitHub Pages
2. Use `peaceiris/actions-gh-pages@v4` action
3. Set appropriate permissions and concurrency controls

#### Step 3.1: Verify Workflow Update

```bash
# Review the updated workflow
cat .github/workflows/deploy-docs.yml
```

Key changes to verify:

- `permissions: contents: write` (instead of `pages: write`)
- Single `build-and-deploy` job (instead of separate build/deploy)
- Uses `peaceiris/actions-gh-pages@v4` action
- Publishes to `docs` branch
- Source directory is `./docs/dist`

#### Step 3.2: Commit Workflow Changes

If the workflow wasn't already committed:

```bash
git add .github/workflows/deploy-docs.yml
git commit -m "feat: Deploy documentation to docs branch

- Update workflow to use peaceiris/actions-gh-pages action
- Deploy generated site to docs branch
- Remove direct GitHub Pages deployment
- Maintain deployment history on docs branch"

git push origin main
```

### Phase 4: Create and Configure Docs Branch (10 minutes)

#### Step 4.1: Trigger First Deployment

The `docs` branch will be created automatically by the workflow on first run.

**Option A: Automatic trigger** (if changes pushed to `docs/**`):

```bash
# Make a small change to trigger workflow
touch docs/src/content/docs/.trigger
git add docs/src/content/docs/.trigger
git commit -m "docs: Trigger initial docs branch deployment"
git push origin main
rm docs/src/content/docs/.trigger
git add docs/src/content/docs/.trigger
git commit -m "docs: Remove trigger file"
git push origin main
```

**Option B: Manual trigger**:

1. Go to: `https://github.com/pantheon-org/opencode-warcraft-notifications/actions`
2. Click **Deploy Documentation to GitHub Pages**
3. Click **Run workflow** → Select `main` branch → Click **Run workflow**

#### Step 4.2: Monitor Workflow Execution

```bash
# Watch workflow status in terminal
gh run list --workflow=deploy-docs.yml --limit 1
gh run watch
```

Or monitor via GitHub UI:

1. Navigate to **Actions** tab
2. Watch the **Deploy Documentation to GitHub Pages** workflow
3. Verify it completes successfully

**Expected duration**: 2-5 minutes

#### Step 4.3: Verify Docs Branch Creation

```bash
# Fetch all branches
git fetch --all

# List all branches (should see docs branch)
git branch -a | grep docs

# Switch to docs branch to inspect
git checkout docs
ls -la

# Should see generated files:
# - _astro/
# - pagefind/
# - *.html
# - favicon.svg
# - etc.

# Switch back to main
git checkout main
```

**Expected result**: `docs` branch exists with generated static site.

### Phase 5: Configure GitHub Pages (5 minutes)

#### Step 5.1: Update GitHub Pages Settings

1. Navigate to repository settings:

   ```
   https://github.com/pantheon-org/opencode-warcraft-notifications/settings/pages
   ```

2. Under **Source**:
   - Select: **Deploy from a branch**

3. Under **Branch**:
   - Select: **docs**
   - Select: **/ (root)**

4. Click **Save**

#### Step 5.2: Wait for GitHub Pages Deployment

GitHub Pages will automatically deploy from the `docs` branch:

1. Monitor at: `https://github.com/pantheon-org/opencode-warcraft-notifications/deployments`
2. Wait for **github-pages** deployment to complete (1-2 minutes)
3. Status should show: ✅ **Active**

### Phase 6: Verification (10 minutes)

#### Step 6.1: Verify Site is Accessible

```bash
# Open the documentation site
open https://pantheon-org.github.io/opencode-warcraft-notifications/

# Or use curl to verify
curl -I https://pantheon-org.github.io/opencode-warcraft-notifications/
```

**Expected result**: HTTP 200 OK, site loads correctly.

#### Step 6.2: Verify Navigation and Links

Manual testing checklist:

- [ ] Homepage loads
- [ ] Navigation menu works
- [ ] All internal links work
- [ ] Search functionality works
- [ ] Images and assets load
- [ ] CSS styling is correct
- [ ] Mobile view works

#### Step 6.3: Test End-to-End Workflow

```bash
# Make a test change to documentation
cd docs/src/content/docs
echo "\n## Test Update\n\nThis is a test of the automated deployment." >> index.md

# Commit and push
git add index.md
git commit -m "docs: Test automated deployment workflow"
git push origin main

# Monitor workflow
gh run watch
```

**Expected behavior**:

1. Workflow triggers automatically
2. Site rebuilds successfully
3. Changes appear on `docs` branch
4. GitHub Pages updates within 1-2 minutes
5. Changes visible on live site

#### Step 6.4: Verify Main Branch Cleanliness

```bash
# Switch to main branch
git checkout main

# Verify no build artifacts
git status

# Should show clean working directory
# No dist/, .astro/, docs/dist/, or docs/.astro/ directories tracked
```

#### Step 6.5: Rollback Test Change

```bash
# Remove test change
cd docs/src/content/docs
git checkout HEAD~1 index.md

# Or manually remove the test section
git add index.md
git commit -m "docs: Remove test content"
git push origin main
```

### Phase 7: Documentation Updates (5 minutes)

#### Step 7.1: Add New Documentation

Add references to the new documentation:

1. Update `docs/src/content/docs/deployment.md`:
   - Link to branch structure documentation
   - Explain docs branch workflow

2. Update `docs/src/content/docs/pipeline.md`:
   - Document the new deployment workflow
   - Update workflow diagrams

3. Update `README.md`:
   - Update deployment instructions if needed

#### Step 7.2: Update Sidebar Configuration

Edit `docs/astro.config.mjs` to add the new documentation page:

```javascript
sidebar: [
  // ... existing items
  {
    label: 'Deployment',
    collapsed: false,
    items: [
      { label: 'Deployment Guide', link: '/deployment/' },
      { label: 'CI/CD Pipeline', link: '/pipeline/' },
      { label: 'Docs Branch Structure', link: '/docs-branch-structure/' }, // Add this
    ],
  },
  // ... rest of sidebar
];
```

Commit changes:

```bash
git add docs/astro.config.mjs
git commit -m "docs: Add docs branch structure to sidebar"
git push origin main
```

## Post-Migration Verification

### Checklist

Complete this checklist to verify successful migration:

- [ ] Main branch contains only source markdown files (no `dist/`)
- [ ] `.gitignore` properly excludes build artifacts
- [ ] `docs` branch exists and contains generated site
- [ ] GitHub Pages configured to use `docs` branch
- [ ] Documentation site accessible at production URL
- [ ] All links and navigation work correctly
- [ ] Workflow triggers automatically on docs changes
- [ ] Workflow completes successfully (check Actions tab)
- [ ] Changes to markdown propagate to live site
- [ ] No errors in workflow logs
- [ ] Build artifacts no longer in main branch git history

### Common Issues and Solutions

#### Issue 1: Workflow fails with permission error

**Error**: "Permission denied" or "Resource not accessible by integration"

**Solution**:

```bash
# Verify workflow permissions in deploy-docs.yml
permissions:
  contents: write  # Required for pushing to docs branch
```

Also check repository settings:

1. Settings → Actions → General
2. Workflow permissions → Set to "Read and write permissions"

#### Issue 2: GitHub Pages not updating

**Error**: Site shows old content after deployment

**Solution**:

1. Check GitHub Pages deployment status in **Deployments** tab
2. Verify `docs` branch has latest commits: `git log origin/docs`
3. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Check if GitHub Pages is configured correctly in Settings → Pages

#### Issue 3: Docs branch not created

**Error**: Workflow completes but no `docs` branch appears

**Solution**:

1. Check workflow logs for errors
2. Verify `peaceiris/actions-gh-pages@v4` action output
3. Manually create branch if needed:
   ```bash
   git checkout --orphan docs
   git rm -rf .
   echo "Placeholder" > README.md
   git add README.md
   git commit -m "Initialize docs branch"
   git push origin docs
   ```
4. Re-run workflow

#### Issue 4: Build artifacts still in main branch

**Error**: `git status` shows `dist/` or `.astro/` directories

**Solution**:

```bash
# Verify .gitignore includes these patterns
grep "dist/" .gitignore
grep ".astro/" .gitignore

# Remove from tracking
git rm -r --cached dist/ docs/dist/ docs/.astro/ .astro/
git commit -m "chore: Remove remaining build artifacts"
git push origin main

# Clean local working directory
rm -rf dist/ docs/dist/ docs/.astro/ .astro/
```

#### Issue 5: Circular workflow triggers

**Error**: Workflow keeps triggering itself indefinitely

**Solution**:
The updated workflow prevents this by:

1. Only triggering on `main` branch pushes
2. Only triggering on changes to `docs/**` paths
3. Using `peaceiris/actions-gh-pages` which doesn't trigger workflows

Verify `deploy-docs.yml`:

```yaml
on:
  push:
    branches: [main] # NOT docs branch
    paths:
      - 'docs/**'
```

## Rollback Procedure

If migration encounters critical issues:

### Step 1: Revert Main Branch Changes

```bash
# If backup branch was created
git checkout main
git reset --hard backup/pre-docs-migration
git push origin main --force

# Or use git revert for specific commits
git revert <commit-hash>
git push origin main
```

### Step 2: Restore Previous Workflow

```bash
# Checkout old workflow from git history
git checkout <previous-commit-hash> .github/workflows/deploy-docs.yml
git commit -m "chore: Rollback to previous deployment workflow"
git push origin main
```

### Step 3: Delete Docs Branch (if needed)

```bash
# Delete local and remote docs branch
git branch -D docs
git push origin --delete docs
```

### Step 4: Reconfigure GitHub Pages

1. Go to Settings → Pages
2. Change source back to previous configuration
3. Re-deploy manually if needed

## Success Criteria

Migration is considered successful when:

1. ✅ Main branch is clean (no build artifacts)
2. ✅ Docs branch contains complete static site
3. ✅ GitHub Pages serves from docs branch
4. ✅ Workflow runs successfully on docs changes
5. ✅ Documentation is accessible at production URL
6. ✅ All links and navigation work correctly
7. ✅ No workflow errors or warnings
8. ✅ Deployment history preserved on docs branch

## Timeline

Estimated time for complete migration:

| Phase                  | Duration   | Description                         |
| ---------------------- | ---------- | ----------------------------------- |
| Preparation            | 5 min      | Verify state, create backup         |
| Update Main Branch     | 10 min     | Update .gitignore, remove artifacts |
| Update Workflow        | 5 min      | Commit workflow changes             |
| Create Docs Branch     | 10 min     | Trigger first deployment            |
| Configure GitHub Pages | 5 min      | Update repository settings          |
| Verification           | 10 min     | Test all functionality              |
| Documentation          | 5 min      | Update related docs                 |
| **Total**              | **50 min** | Complete migration                  |

## Next Steps

After successful migration:

1. **Monitor**: Watch first few deployments to ensure stability
2. **Document**: Update any team runbooks or documentation
3. **Communicate**: Notify team members of new workflow
4. **Train**: Ensure contributors understand docs branch workflow
5. **Optimize**: Consider adding caching to speed up builds

## Support

If you encounter issues during migration:

- Check workflow logs in Actions tab
- Review [Branch Structure Documentation](./docs-branch-structure.md)
- Consult [CI/CD Pipeline Documentation](./pipeline.md)
- Open issue: https://github.com/pantheon-org/opencode-warcraft-notifications/issues

## Related Documentation

- [Documentation Branch Structure](./docs-branch-structure.md)
- [CI/CD Pipeline](./pipeline.md)
- [Deployment Guide](./deployment.md)
- [Development Guide](./development.md)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-11  
**Migration Status**: Ready for implementation
