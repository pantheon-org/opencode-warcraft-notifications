# Quick Start: Renew npm Token for CI/CD

**Time Required:** 5 minutes  
**Issue:** Publish workflow failing with E404 error due to expired npm token

## Immediate Fix (5 Steps)

### 1. Generate Token on npmjs.com

```
→ https://www.npmjs.com/settings/YOUR_USERNAME/tokens
→ "Generate New Token" → "Granular Access Token"

Token Configuration:
  Name: GitHub Actions - opencode-warcraft-notifications
  Expiration: 1 year
  Packages: @pantheon-ai/opencode-warcraft-notifications
  Permissions: Read and write
```

### 2. Copy Token

The token starts with `npm_` - copy it immediately (shown only once)

### 3. Update GitHub Secret

```bash
gh secret set NPM_TOKEN
# Paste token when prompted
```

### 4. Test It

```bash
gh workflow run 2-publish.yml -f tag=v1.1.0
gh run watch
```

### 5. Set Renewal Reminder

Add calendar reminder for **1 year from today** to renew the token

## Alternative: Via GitHub UI

Can't use CLI? Update via web:

1. Go to: https://github.com/pantheon-org/opencode-warcraft-notifications/settings/secrets/actions
2. Click "NPM_TOKEN" → "Update secret"
3. Paste new token → "Update secret"

## Verify Success

Successful publish will show:

```
✅ Successfully published @pantheon-ai/opencode-warcraft-notifications@X.X.X to npm
✅ Package verified on npm
```

## Common Errors

**"E404 Not Found"** → Token expired or invalid  
**"E403 Forbidden"** → Account not member of @pantheon-ai  
**"EPUBLISHCONFLICT"** → Version already published (this is OK)

## Next Steps

See [docs/npm-authentication.md](./npm-authentication.md) for:

- Detailed setup instructions
- Security best practices
- Troubleshooting guide
- Alternative authentication methods
