# GitHub Pages Setup Instructions

## Overview

This document provides step-by-step instructions for enabling GitHub Pages for the project documentation.

## Prerequisites

- Repository administrator access
- GitHub repository: `pantheon-org/opencode-warcraft-notifications`
- Documentation files in `/docs` directory
- GitHub Actions workflow: `.github/workflows/deploy-docs.yml`

## Setup Steps

### 1. Enable GitHub Pages

**Note**: This step requires repository administrator permissions.

1. Navigate to the repository on GitHub:

   ```
   https://github.com/pantheon-org/opencode-warcraft-notifications
   ```

2. Click **Settings** tab

3. In the left sidebar, click **Pages** (under "Code and automation")

4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
   - This enables GitHub Actions to deploy to GitHub Pages

5. Save changes (if prompted)

### 2. Verify Workflow Permissions

The workflow file already includes the required permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

No additional configuration is needed.

### 3. Trigger Initial Deployment

#### Option A: Push to Main (Automatic)

If the workflow file is merged to `main` branch, it will automatically trigger when:

- Any file in `docs/**` is modified
- The workflow file itself is modified

#### Option B: Manual Dispatch

1. Go to **Actions** tab in the repository
2. Click on **Deploy Documentation to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Click **Run workflow**

### 4. Monitor Deployment

1. Go to **Actions** tab
2. Click on the running workflow
3. Monitor the progress:
   - **Build** job: Builds documentation with Jekyll
   - **Deploy** job: Deploys to GitHub Pages

Typical deployment time: 2-5 minutes

### 5. Verify Site is Live

Once deployment completes:

1. **Check the Actions tab**:
   - Green checkmark indicates successful deployment
   - Click on the workflow run to see deployment URL

2. **Access the documentation site**:

   ```
   https://pantheon-org.github.io/opencode-warcraft-notifications/
   ```

3. **Verify from command line**:

   ```bash
   curl -I https://pantheon-org.github.io/opencode-warcraft-notifications/ | grep "HTTP"
   ```

   Expected output: `HTTP/2 200`

## Configuration Details

### Jekyll Configuration

The documentation uses Jekyll with the Cayman theme:

**File**: `docs/_config.yml`

```yaml
theme: jekyll-theme-cayman
title: Warcraft II Notifications Plugin
description: OpenCode plugin for Warcraft II notification sounds
show_downloads: false
```

### Workflow Triggers

The deployment workflow triggers on:

1. **Push to main branch** with changes to:
   - Any file in `docs/**` directory
   - The workflow file itself

2. **Manual workflow dispatch**:
   - Can be triggered from Actions tab
   - Useful for testing or force-redeployment

### Concurrency Control

The workflow uses concurrency control to prevent deployment conflicts:

```yaml
concurrency:
  group: 'pages'
  cancel-in-progress: false
```

This ensures:

- Only one deployment runs at a time
- In-progress deployments complete (not cancelled)
- Queued deployments wait for current one to finish

## Troubleshooting

### Site Not Accessible

**Symptom**: 404 error when accessing the site

**Solutions**:

1. **Verify GitHub Pages is enabled**:
   - Go to Settings → Pages
   - Ensure Source is set to "GitHub Actions"

2. **Check workflow status**:
   - Go to Actions tab
   - Verify latest workflow run succeeded (green checkmark)
   - Review logs if failed (red X)

3. **Wait for DNS propagation**:
   - Initial deployment may take 5-10 minutes
   - Subsequent deployments are faster (1-2 minutes)

4. **Check GITHUB_TOKEN permissions**:
   - The workflow requires `pages: write` permission
   - This is configured in the workflow file

### Build Failures

**Symptom**: Workflow fails during build job

**Solutions**:

1. **Check workflow logs**:
   - Click on failed workflow run
   - Expand "Build with Jekyll" step
   - Review error messages

2. **Common issues**:
   - Invalid YAML in `_config.yml`
   - Broken markdown syntax
   - Broken internal links
   - Missing front matter in markdown files

3. **Test locally** (optional):
   ```bash
   cd docs
   bundle install
   bundle exec jekyll serve
   # Visit http://localhost:4000
   ```

### Deployment Failures

**Symptom**: Build succeeds but deployment fails

**Solutions**:

1. **Check repository permissions**:
   - Ensure GitHub Actions has permission to deploy to Pages
   - Go to Settings → Actions → General
   - Under "Workflow permissions", ensure "Read and write permissions" is selected

2. **Verify environment**:
   - The `github-pages` environment is created automatically
   - Check Settings → Environments to verify it exists

3. **Check workflow permissions**:
   - The workflow must have `id-token: write` permission
   - This is already configured in the workflow file

### Content Not Updating

**Symptom**: Site is live but shows old content

**Solutions**:

1. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or use incognito/private browsing mode

2. **Verify changes were committed**:

   ```bash
   git log --oneline docs/
   ```

3. **Check workflow was triggered**:
   - Go to Actions tab
   - Verify a new workflow run started after your changes
   - Check that it completed successfully

4. **Wait for deployment to complete**:
   - Check Actions tab for completion status
   - Typical deployment takes 2-5 minutes

## Post-Setup Verification

### Checklist

- [ ] GitHub Pages enabled in repository settings
- [ ] Workflow file exists and is valid YAML
- [ ] Initial deployment completed successfully
- [ ] Documentation site is accessible at expected URL
- [ ] All documentation pages load correctly
- [ ] Internal links work properly
- [ ] Jekyll theme renders correctly
- [ ] Navigation is functional

### Test Pages

Visit these pages to verify everything works:

- [Home/Index](https://pantheon-org.github.io/opencode-warcraft-notifications/)
- [User Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/USER_GUIDE.html)
- [API Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/API.html)
- [Architecture](https://pantheon-org.github.io/opencode-warcraft-notifications/ARCHITECTURE.html)
- [Development Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/DEVELOPMENT.html)
- [Deployment Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/DEPLOYMENT.html)

## Maintenance

### Regular Updates

Documentation is automatically deployed when:

1. Changes are pushed to `main` branch in `docs/**`
2. No manual intervention required
3. Deployment typically completes in 2-5 minutes

### Monitoring

Monitor documentation deployment health:

- **Workflow status**: Check Actions tab regularly
- **Site availability**: Periodic HTTP checks
- **Build time**: Track deployment duration
- **Error rate**: Monitor workflow failures

### Manual Redeployment

If you need to redeploy without changes:

1. Go to Actions tab
2. Select "Deploy Documentation to GitHub Pages"
3. Click "Run workflow"
4. Select branch and run

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [Cayman Theme Documentation](https://github.com/pages-themes/cayman)

## Support

For issues with GitHub Pages setup:

1. **Check this document** for troubleshooting steps
2. **Review GitHub Actions logs** for specific errors
3. **Create an issue** on GitHub with details:
   - Workflow run URL
   - Error messages
   - Steps to reproduce

---

**Document Version**: 1.0  
**Last Updated**: November 10, 2025  
**Maintained By**: Pantheon AI Team
