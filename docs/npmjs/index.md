---
title: 'npm Publishing Documentation'
description: 'npm registry authentication, publishing, and maintenance'
---

# npm Publishing Documentation

This directory contains documentation for npm registry operations, authentication, and CI/CD publishing workflows.

## Documents

### [Authentication](./authentication.md)

Comprehensive guide to setting up and maintaining npm authentication for CI/CD pipelines.

**Topics covered:**

- Granular Access Token setup (recommended)
- npm Provenance with GitHub OIDC
- Token permissions and security
- Troubleshooting authentication issues

**When to read:** Setting up automated publishing or when tokens expire

### [Token Renewal](./token-renewal.md)

Quick reference guide for renewing expired npm tokens.

**Topics covered:**

- 5-minute token renewal process
- Step-by-step instructions
- Common error resolutions
- Quick verification steps

**When to read:** When publish workflow fails with authentication errors

## Quick Links

- **npm Package**: [@pantheon-ai/opencode-warcraft-notifications](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications)
- **Token Settings**: [npm Access Tokens](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
- **GitHub Secrets**: [Repository Secrets](https://github.com/pantheon-org/opencode-warcraft-notifications/settings/secrets/actions)
- **Publish Workflow**: [.github/workflows/2-publish.yml](../../.github/workflows/2-publish.yml)

## Common Tasks

### Check Current Published Version

```bash
npm view @pantheon-ai/opencode-warcraft-notifications version
```

### List All Published Versions

```bash
npm view @pantheon-ai/opencode-warcraft-notifications versions
```

### Check GitHub Secret Status

```bash
gh secret list | grep NPM_TOKEN
```

### Manually Trigger Publish

```bash
gh workflow run 2-publish.yml -f tag=v1.1.0
```

## Related Documentation

- [Deployment Guide](../deployment.md) - Overall deployment and installation
- [Pipeline Documentation](../pipeline.md) - Complete CI/CD pipeline overview
- [GitHub Workflows](../github-workflows/) - Detailed workflow documentation
- [Troubleshooting](../troubleshooting.md) - General troubleshooting guide

## Emergency Contacts

If you encounter critical publishing issues:

1. **Check Workflow Runs**: https://github.com/pantheon-org/opencode-warcraft-notifications/actions
2. **Review npm Dashboard**: https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications
3. **Check Token Expiration**: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

## Support

For npm-specific issues:

- Review [authentication.md](./authentication.md) for token setup
- Check [token-renewal.md](./token-renewal.md) for quick fixes
- Consult [troubleshooting.md](../troubleshooting.md) for general issues
