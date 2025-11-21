# npm Authentication for CI/CD

This document explains how to set up automated npm publishing for the GitHub Actions workflow.

## Problem

The publish workflow was failing with:

```
npm error 404 Not Found - PUT https://registry.npmjs.org/@pantheon-ai%2fopencode-warcraft-notifications
```

This indicates the `NPM_TOKEN` secret has expired or lacks proper permissions.

## Solutions

### Option 1: Granular Access Token (Recommended for Simplicity)

This is the most straightforward approach for automated publishing.

#### Steps:

1. **Log into npmjs.com** with an account that has publish access to `@pantheon-ai/opencode-warcraft-notifications`

2. **Navigate to Token Settings:**
   - Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Select "Granular Access Token"

3. **Configure the Token:**
   - **Name:** `GitHub Actions - opencode-warcraft-notifications`
   - **Expiration:**
     - For automation: Choose **1 year** (you'll need to renew annually)
     - For testing: Choose shorter duration
   - **Packages and scopes:**
     - Select "Only select packages and scopes"
     - Choose `@pantheon-ai/opencode-warcraft-notifications`
     - Set permissions to: **Read and write**
   - **IP Ranges:** Leave empty (GitHub Actions uses dynamic IPs)
   - **Organizations:** Ensure `@pantheon-ai` is included

4. **Copy the Token:**
   - The token will only be shown once - copy it immediately
   - Format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **Update GitHub Secret:**

   ```bash
   # Using GitHub CLI
   gh secret set NPM_TOKEN
   # Paste the token when prompted
   ```

   Or via GitHub UI:
   - Go to: https://github.com/pantheon-org/opencode-warcraft-notifications/settings/secrets/actions
   - Click "NPM_TOKEN" → "Update secret"
   - Paste the new token

6. **Test the Workflow:**
   ```bash
   # Trigger manually with existing tag
   gh workflow run 2-publish.yml -f tag=v1.1.0
   ```

#### Token Renewal Process:

When the token expires in 1 year:

1. **Set a Calendar Reminder** for 2 weeks before expiration
2. **Generate a new token** following steps 2-3 above
3. **Update the GitHub secret** (step 5)
4. **Verify** with a test publish or dry-run

### Option 2: npm Provenance with GitHub OIDC (Most Secure)

**Note:** This feature requires npm to trust GitHub as an identity provider. As of 2024, npm supports provenance but still requires a token for authentication.

#### Current Status:

- Workflow already has `id-token: write` permission ✅
- Still requires `NPM_TOKEN` for authentication
- Adds provenance attestation to published packages

The `--provenance` flag in the workflow provides:

- Supply chain security
- Verifiable build provenance
- Links package to specific GitHub commit

**This is already enabled** in the workflow but still requires a valid NPM_TOKEN.

### Option 3: Automation Token (Legacy - Not Recommended)

npm "Automation" tokens are now deprecated in favor of Granular Access Tokens. Use Option 1 instead.

## Current Workflow Configuration

The workflow (`.github/workflows/2-publish.yml`) is configured to:

- ✅ Use provenance attestation (`--provenance` flag)
- ✅ Check if version already published (prevents duplicates)
- ✅ Verify package.json matches tag version
- ✅ Provide detailed error messages
- ✅ Support public access for scoped packages

## Verification

After updating the token, verify it works:

```bash
# Check secret is set
gh secret list | grep NPM_TOKEN

# Manually trigger workflow
gh workflow run 2-publish.yml -f tag=v1.1.0

# Watch the run
gh run watch
```

## Troubleshooting

### Error: E404 Not Found

- **Cause:** Token expired or lacks permissions
- **Fix:** Generate new granular access token with "Read and write" permissions

### Error: E403 Forbidden

- **Cause:** Token doesn't have access to @pantheon-ai organization
- **Fix:** Ensure your npm account is a member of @pantheon-ai with publish rights

### Error: EPUBLISHCONFLICT

- **Cause:** Version already published to npm
- **Fix:** This is expected - the workflow skips republishing

### Token Expiry Notification

npm doesn't send expiry notifications automatically. Set up:

1. **Calendar reminder** for renewal date
2. **Document** the expiry date in team wiki/docs
3. **Monitor** workflow failures for auth errors

## Security Best Practices

1. **Never commit tokens** to the repository
2. **Use granular tokens** with minimal required permissions
3. **Set appropriate expiration** (1 year for automation)
4. **Rotate tokens** before expiration
5. **Audit token usage** periodically in npm dashboard

## Related Documentation

- [npm Granular Access Tokens](https://docs.npmjs.com/about-access-tokens)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Workflow File](.github/workflows/2-publish.yml)

## Support

If you continue to have issues:

1. Check npm organization membership: https://www.npmjs.com/settings/pantheon-ai/members
2. Verify token permissions in npm dashboard
3. Review recent workflow runs: https://github.com/pantheon-org/opencode-warcraft-notifications/actions
