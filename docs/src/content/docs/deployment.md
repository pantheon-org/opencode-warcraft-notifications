---
title: 'Deployment Guide'
description: 'Installation and deployment instructions'
---

# Deployment Guide

## Overview

This guide covers deployment, installation, configuration, and operational aspects of the Warcraft II Notifications Plugin for OpenCode.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Platform-Specific Setup](#platform-specific-setup)
- [Deployment Architecture](#deployment-architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Security](#security)

## Configuration

### Configuration Hierarchy

```mermaid
graph TD
    A[Configuration Request] --> B{Project Config?}
    B -->|Yes| C[.opencode/plugin.json]
    B -->|No| D{Global Config?}
    D -->|Yes| E[~/.config/opencode/plugin.json]
    D -->|No| F{Environment Variable?}
    F -->|Yes| G[SOUNDS_DATA_DIR]
    F -->|No| H[Platform Default]

    C --> I[Final Config]
    E --> I
    G --> I
    H --> I

    style C fill:#4caf50
    style E fill:#ff9800
    style G fill:#2196f3
    style H fill:#9e9e9e
```

### Project-Specific Configuration

**Location**: `<project>/.opencode/plugin.json`

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/project/sounds",
    "faction": "alliance"
  }
}
```

**Use Case**: Different sound preferences per project

### Global Configuration

**Location**: `~/.config/opencode/plugin.json`

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/home/user/.cache/warcraft-sounds",
    "faction": "horde"
  }
}
```

**Use Case**: User-wide default preferences

### Environment Variables

```bash
# Override data directory
export SOUNDS_DATA_DIR=/custom/sounds/path

# Enable debug logging
export DEBUG_OPENCODE=1

# Override base URL (legacy)
export SOUNDS_BASE_URL=https://custom-cdn.com/sounds
```

### Configuration Options

#### `soundsDir`

**Type**: `string` (optional)  
**Description**: Custom directory for sound file storage  
**Default**: Platform-specific (see [Platform-Specific Setup](#platform-specific-setup))

**Example**:

```json
{
  "soundsDir": "/custom/sounds/path"
}
```

#### `faction`

**Type**: `'alliance' | 'horde' | 'both'` (optional)  
**Description**: Which faction sounds to play  
**Default**: `'both'`

**Options**:

- `'alliance'`: Play only Alliance unit sounds
- `'horde'`: Play only Horde unit sounds
- `'both'`: Play random sounds from both factions

**Example**:

```json
{
  "faction": "horde"
}
```

---

## Platform-Specific Setup

### macOS

#### Default Locations

```bash
# Configuration
~/.config/opencode/plugin.json

# Sound storage
~/Library/Application Support/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/
```

#### Required Commands

```bash
# Audio playback (built-in)
afplay

# Notifications (built-in)
osascript
```

#### Verification

```bash
# Test audio playback
afplay /System/Library/Sounds/Glass.aiff
```

**Note**: The plugin uses OpenCode's built-in toast notification system, so no additional notification setup is required.

### Linux

#### Default Locations

```bash
# Configuration
~/.config/opencode/plugin.json

# Sound storage (XDG compliant)
~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/
```

#### Required Commands

```bash
# Audio playback
sudo apt-get install libcanberra-gtk-module  # Ubuntu/Debian
sudo dnf install libcanberra-gtk3            # Fedora
sudo pacman -S libcanberra                   # Arch
```

#### Verification

```bash
# Test audio playback
canberra-gtk-play --id=message
```

**Note**: The plugin uses OpenCode's built-in toast notification system, so no additional notification setup is required.

### Windows

#### Default Locations

```powershell
# Configuration
%APPDATA%\opencode\plugin.json

# Sound storage
%APPDATA%\opencode\storage\plugin\opencode-warcraft-notifications\
```

#### Status

> **Note**: Windows support is planned for a future release. Currently supported: macOS and Linux.

---

## Deployment Architecture

### Package Distribution

```mermaid
graph TB
    subgraph "Development"
        A[Source Code]
        B[Tests]
        C[Build]
    end

    subgraph "CI/CD"
        D[GitHub Actions]
        E[Version Bump]
        F[Build Package]
    end

    subgraph "Distribution"
        G[npm Registry]
        H[GitHub Releases]
    end

    subgraph "Installation"
        I[OpenCode]
        J[User System]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    G --> I
    I --> J

    style G fill:#4caf50
    style H fill:#2196f3
    style I fill:#ff9800
```

### Package Structure

```
@pantheon-ai/opencode-warcraft-notifications/
├── index.ts                 # Entry point
├── src/                     # Source code
│   ├── notification.ts
│   ├── plugin-config.ts
│   ├── sounds.ts
│   ├── bundled-sounds.ts
│   └── sound-data/
├── data/                    # Bundled sounds (50+ MB)
│   ├── alliance/
│   └── horde/
├── docs/                    # Documentation
│   └── schemas/
├── package.json
└── README.md
```

### Installation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant OC as OpenCode
    participant NPM as npm Registry
    participant FS as File System
    participant P as Plugin

    U->>OC: Add plugin to config
    OC->>NPM: Install package
    NPM-->>FS: Download package
    FS-->>OC: Package installed
    OC->>P: Load plugin
    P->>P: Load configuration
    P->>FS: Check sound files
    alt Sounds missing
        P->>FS: Copy from data/ to user dir
    end
    P-->>OC: Plugin ready
    OC-->>U: Plugin active
```

---

## CI/CD Pipeline

### Workflow Overview

```mermaid
graph LR
    A[Push to main] --> B[Smart Version Bump]
    B --> C[Release & Publish]
    C --> D[npm Publish]
    C --> E[GitHub Release]

    F[Pull Request] --> G[PR Validation]
    G --> H[Tests]
    G --> I[Linting]
    G --> J[Type Check]

    style B fill:#4caf50
    style C fill:#2196f3
    style D fill:#ff9800
    style E fill:#9c27b0
```

### Workflows

#### 1. Smart Version Bump

**Trigger**: Push to `main` branch  
**Purpose**: Automatically determine and apply semantic version bump

**Steps**:

1. Analyze commits since last tag
2. Use AI (Gemini) + conventional commits to determine version type
3. Cross-validate decisions
4. Update `package.json`
5. Create git tag
6. Push tag (triggers release)

**Version Types**:

- **MAJOR**: Breaking changes, API changes
- **MINOR**: New features, backwards-compatible additions
- **PATCH**: Bug fixes, documentation, improvements

#### 2. Release & Publish

**Trigger**: New git tag (`v*`)  
**Purpose**: Build and publish package to npm

**Steps**:

1. Checkout code at tag
2. Install dependencies
3. Run tests
4. Build package
5. Publish to npm
6. Create GitHub release with changelog

#### 3. PR Validation

**Trigger**: Pull request creation/update  
**Purpose**: Validate code quality before merge

**Steps**:

1. Run all tests
2. Check linting
3. Verify type checking
4. Check formatting
5. Validate schemas

#### 4. Auto-Merge Bot

**Trigger**: Version sync PRs  
**Purpose**: Automatically merge version synchronization PRs

**Conditions**:

- PR created by GitHub Actions
- Title contains "sync package.json version"
- All checks pass

#### 5. Cleanup Workflows

**Cleanup Old Releases**:

- Runs weekly
- Keeps last 10 releases
- Deletes older releases

**Cleanup Merged Branches**:

- Runs on PR merge
- Deletes merged feature branches

### Deployment Checklist

- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Documentation updated
- [ ] Version bump appropriate
- [ ] No breaking changes (unless MAJOR)
- [ ] Changelog generated

---

## Monitoring

### Health Checks

#### Plugin Installation

```bash
# Check if plugin is installed
ls -la ~/.cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications/

# Check plugin version
cat ~/.cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications/package.json | grep version
```

#### Sound Files

```bash
# Check sound directory
ls -la ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/

# Count alliance sounds
ls -1 ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/alliance/ | wc -l

# Count horde sounds
ls -1 ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/horde/ | wc -l
```

#### Configuration

```bash
# Check project config
cat .opencode/plugin.json

# Check global config
cat ~/.config/opencode/plugin.json

# Check environment variables
echo $SOUNDS_DATA_DIR
echo $DEBUG_OPENCODE
```

### Debug Logging

Enable debug mode:

```bash
DEBUG_OPENCODE=1 opencode
```

**Debug Output**:

- Configuration loading attempts
- Sound installation progress
- File operation results
- Event handling
- Error details

### Performance Metrics

**Plugin Load Time**: < 100ms  
**Sound Installation Time**: < 5s (first run)  
**Event Response Time**: < 50ms  
**Memory Footprint**: < 10MB

---

## Troubleshooting

### Common Issues

#### 1. Sound Not Playing

**Symptoms**: No sound when session goes idle

**Diagnosis**:

```bash
# Check if sound files exist
ls -la ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/alliance/

# Check platform commands
which afplay        # macOS
which canberra-gtk-play  # Linux

# Test sound playback manually
afplay ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/alliance/human_selected1.wav
```

**Solutions**:

1. **Files missing**: Reinstall plugin or manually copy from `data/`
2. **Permission issues**: `chmod 644 *.wav`
3. **Command missing**: Install required packages (see [Platform-Specific Setup](#platform-specific-setup))

#### 2. Wrong Faction Playing

**Symptoms**: Horde sounds play when Alliance is configured

**Diagnosis**:

```bash
# Check configuration
cat .opencode/plugin.json
cat ~/.config/opencode/plugin.json
```

**Solutions**:

1. Verify `faction` setting in configuration
2. Check configuration precedence (project > global > default)
3. Restart OpenCode after configuration changes

#### 3. Configuration Not Loading

**Symptoms**: Custom configuration ignored

**Diagnosis**:

```bash
# Validate JSON syntax
cat .opencode/plugin.json | jq .

# Check file permissions
ls -la .opencode/plugin.json
```

**Solutions**:

1. Fix JSON syntax errors
2. Ensure file is readable: `chmod 644 .opencode/plugin.json`
3. Verify plugin name matches exactly: `@pantheon-ai/opencode-warcraft-notifications`

#### 4. Plugin Not Loading

**Symptoms**: Plugin doesn't activate

**Diagnosis**:

```bash
# Check if plugin is installed
ls -la ~/.cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications/

# Check OpenCode config
cat ~/.config/opencode/opencode.json
```

**Solutions**:

1. Verify plugin is in `opencode.json` configuration
2. Reinstall plugin: Remove from cache and restart OpenCode
3. Check OpenCode logs for errors

#### 5. Notification Not Showing

**Symptoms**: Sound plays but no notification appears

**Diagnosis**:

```bash
# Test notification manually
osascript -e 'display notification "Test" with title "OpenCode"'  # macOS
notify-send 'OpenCode' 'Test'  # Linux
```

**Solutions**:

1. **macOS**: Check System Preferences > Notifications > Script Editor
2. **Linux**: Install `libnotify-bin` package
3. Check notification permissions

### Debug Workflow

```mermaid
flowchart TD
    A[Issue Reported] --> B{Type?}
    B -->|Sound| C[Check sound files]
    B -->|Config| D[Check configuration]
    B -->|Plugin| E[Check installation]

    C --> F{Files exist?}
    F -->|No| G[Reinstall/Copy files]
    F -->|Yes| H[Check permissions]

    D --> I{Valid JSON?}
    I -->|No| J[Fix syntax]
    I -->|Yes| K[Check precedence]

    E --> L{Plugin installed?}
    L -->|No| M[Install plugin]
    L -->|Yes| N[Check OpenCode config]

    style G fill:#ff9800
    style J fill:#f44336
    style M fill:#ff9800
```

---

## Maintenance

### Updates

#### Automatic Updates

**Note**: OpenCode does NOT auto-update plugins

#### Manual Update

```bash
# Remove plugin from cache
cd ~
sed -i.bak '/"@pantheon-ai\/opencode-warcraft-notifications"/d' .cache/opencode/package.json
rm -rf .cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications

# Restart OpenCode (reinstalls latest)
opencode
```

#### Check for Updates

```bash
# Check current version
cat ~/.cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications/package.json | grep version

# Check latest version
npm view @pantheon-ai/opencode-warcraft-notifications version
```

### Backup

#### Configuration Backup

```bash
# Backup project config
cp .opencode/plugin.json .opencode/plugin.json.backup

# Backup global config
cp ~/.config/opencode/plugin.json ~/.config/opencode/plugin.json.backup
```

#### Sound Files Backup

```bash
# Backup sound directory
tar -czf warcraft-sounds-backup.tar.gz ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/
```

### Cleanup

#### Remove Plugin

```bash
# Remove from OpenCode config
# Edit ~/.config/opencode/opencode.json and remove plugin entry

# Remove cached plugin
rm -rf ~/.cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications

# Remove sound files (optional)
rm -rf ~/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/sounds/
```

#### Clear Cache

```bash
# Clear Bun cache
bun pm cache rm

# Clear npm cache
npm cache clean --force
```

---

## Security

### Security Considerations

#### 1. File System Security

```mermaid
graph TD
    A[File Operation] --> B{Validate Path}
    B -->|Valid| C{Check Permissions}
    B -->|Invalid| D[Reject]
    C -->|Allowed| E{Overwrite?}
    C -->|Denied| D
    E -->|Exists| F[Skip]
    E -->|Missing| G[Write]

    style D fill:#f44336
    style F fill:#ff9800
    style G fill:#4caf50
```

**Measures**:

- No file overwrites (existing files preserved)
- Path validation before operations
- Respect system permissions
- No arbitrary code execution

#### 2. Configuration Security

**Measures**:

- Configuration is pure JSON (no code execution)
- Path sanitization
- Environment variable scoping
- No sensitive data in configuration

#### 3. Network Security

**Measures**:

- No runtime network operations
- All sounds bundled with package
- No external API calls
- No telemetry or tracking

#### 4. Dependency Security

**Measures**:

- Minimal dependencies
- Regular dependency updates
- Automated security scanning (GitHub Dependabot)
- No known vulnerabilities

### Security Best Practices

1. **Keep plugin updated**: Install security patches promptly
2. **Verify configuration**: Review `plugin.json` for unexpected changes
3. **Monitor file permissions**: Ensure sound files have appropriate permissions
4. **Use official sources**: Install only from npm registry or official GitHub repository

### Reporting Security Issues

**Do NOT** open public issues for security vulnerabilities.

**Contact**: security@pantheon-ai.com

**Include**:

- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## Operational Procedures

### Deployment Checklist

- [ ] Version bump appropriate
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog generated
- [ ] No breaking changes (unless MAJOR)
- [ ] Security scan clean
- [ ] Performance acceptable

### Rollback Procedure

If a release has critical issues:

1. **Identify last good version**:

   ```bash
   npm view @pantheon-ai/opencode-warcraft-notifications versions
   ```

2. **Install specific version**:

   ```bash
   # In opencode.json (example version)
   {
     "plugin": ["@pantheon-ai/opencode-warcraft-notifications@latest"]
   }
   ```

3. **Report issue**: Create GitHub issue with details

4. **Fix and release**: Follow normal release process

### Monitoring Checklist

- [ ] Plugin installation successful
- [ ] Sound files present
- [ ] Configuration loaded correctly
- [ ] Events triggering properly
- [ ] No errors in logs
- [ ] Performance acceptable

---

## Documentation Deployment

### GitHub Pages

The project documentation is automatically deployed to GitHub Pages at:

**URL**: https://pantheon-org.github.io/opencode-warcraft-notifications/

#### Deployment Architecture

The documentation uses a **two-branch deployment workflow**:

```mermaid
graph TB
    A[Push to main branch] --> B{Changed docs/** ?}
    B -->|Yes| C[Trigger deploy-docs.yml]
    B -->|No| D[Skip deployment]
    C --> E[Checkout main branch]
    E --> F[Setup Bun runtime]
    F --> G[Install dependencies]
    G --> H[Build with Astro]
    H --> I[Generate docs/dist/]
    I --> J[Deploy to docs branch]
    J --> K[GitHub Pages serves docs branch]

    style C fill:#4caf50
    style J fill:#2196f3
    style K fill:#ff9800
```

**Branch Structure**:

- **`main` branch**: Contains source markdown files and build configuration
- **`docs` branch**: Contains generated static site artifacts (auto-generated)

This separation ensures:

- Version control tracks only meaningful source changes
- Generated artifacts don't pollute main branch history
- Documentation builds and deploys automatically via CI/CD

For complete branch structure details, see [Docs Branch Structure](/docs-branch-structure/).

#### Automatic Deployment

Documentation is automatically deployed when:

- Changes are pushed to `main` branch in the `docs/**` directory
- Workflow file `.github/workflows/deploy-docs.yml` is modified
- Manual workflow dispatch is triggered

**Workflow**: `.github/workflows/deploy-docs.yml`

```yaml
name: Deploy Documentation to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/deploy-docs.yml'
  workflow_dispatch:

permissions:
  contents: write # Required for pushing to docs branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source branch
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: |
          cd docs
          bun install

      - name: Transform and build with Astro
        run: |
          cd docs
          bun run build

      - name: Deploy to docs branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: docs
          publish_dir: ./docs/dist
          force_orphan: false
          enable_jekyll: false
          commit_message: 'docs: Deploy documentation from commit ${{ github.sha }}'
```

**Key Features**:

- **Static Site Generator**: Astro with Starlight theme
- **Build Tool**: Bun (fast package management and builds)
- **Deployment Action**: `peaceiris/actions-gh-pages@v4`
- **Target Branch**: `docs` (orphan branch, auto-created)
- **Concurrency Control**: Prevents overlapping deployments

#### Manual Deployment

To manually trigger documentation deployment:

1. Navigate to [GitHub Actions](https://github.com/pantheon-org/opencode-warcraft-notifications/actions/workflows/deploy-docs.yml)
2. Click "Run workflow"
3. Select branch (usually `main`)
4. Click "Run workflow" button

**Expected Duration**: 2-5 minutes

#### Initial Setup

**Required**: Repository administrator must configure GitHub Pages:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select:
   - Source: **Deploy from a branch**
3. Under **Branch**, select:
   - Branch: **docs**
   - Directory: **/ (root)**
4. Click **Save**

**Important**: The `docs` branch is automatically created by the workflow on first run. If it doesn't exist yet, trigger the workflow manually.

#### Verification

After deployment completes (typically 2-5 minutes):

```bash
# Check site is live
curl -I https://pantheon-org.github.io/opencode-warcraft-notifications/ | grep "200 OK"

# Open in browser
open https://pantheon-org.github.io/opencode-warcraft-notifications/

# Verify docs branch exists
git fetch --all
git branch -a | grep docs
```

**Verification Checklist**:

- [ ] Documentation site loads at production URL
- [ ] Navigation menu works correctly
- [ ] All internal links function properly
- [ ] Search functionality works
- [ ] Images and assets load correctly
- [ ] CSS styling is applied
- [ ] Mobile view renders correctly

#### Build Process

The documentation build process consists of:

1. **Transform**: `transform-docs.js` processes source markdown files
2. **Build**: Astro compiles markdown to HTML with Starlight theme
3. **Output**: Static site generated in `docs/dist/`
4. **Deploy**: Contents of `docs/dist/` pushed to `docs` branch
5. **Serve**: GitHub Pages serves from `docs` branch

**Build Configuration**: `docs/astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://pantheon-org.github.io',
  base: '/opencode-warcraft-notifications',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'Warcraft Notifications',
      description: 'OpenCode plugin for Warcraft II notification sounds',
      // ... sidebar configuration
    }),
  ],
});
```

#### Troubleshooting

**Site not accessible**:

1. Verify GitHub Pages is configured to use `docs` branch (Settings → Pages)
2. Check workflow run status in Actions tab
3. Ensure `docs` branch exists: `git branch -a | grep docs`
4. Verify workflow has `contents: write` permission
5. Wait 5-10 minutes for DNS propagation

**Build failures**:

1. Check workflow logs in Actions tab
2. Review Astro build output for errors
3. Verify all markdown files have valid frontmatter
4. Check for broken internal links
5. Ensure dependencies are up to date

**Content not updating**:

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify changes were committed to `docs/**` on main branch
3. Check workflow was triggered (Actions tab)
4. Verify `docs` branch has new commits
5. Wait for GitHub Pages deployment to complete (1-2 minutes)

**Docs branch not created**:

1. Manually trigger workflow (Actions → Deploy Documentation → Run workflow)
2. Check workflow logs for permission errors
3. Verify `GITHUB_TOKEN` has write access
4. Check repository Actions permissions (Settings → Actions → General)

**Build artifacts in main branch**:

If you see `dist/` or `.astro/` directories in `git status` on main branch:

```bash
# Remove from tracking
git rm -r --cached dist/ docs/dist/ docs/.astro/ .astro/
git commit -m "chore: Remove build artifacts from version control"
git push origin main

# Clean local working directory
rm -rf dist/ docs/dist/ docs/.astro/ .astro/
```

#### Monitoring

Monitor documentation deployment health:

- **Workflow status**: [GitHub Actions](https://github.com/pantheon-org/opencode-warcraft-notifications/actions/workflows/deploy-docs.yml)
- **Deployment history**: [Deployments](https://github.com/pantheon-org/opencode-warcraft-notifications/deployments)
- **Site availability**: Regular HTTP 200 checks
- **Build time**: Typical deployment takes 2-5 minutes
- **Docs branch commits**: Track deployment history

#### Related Documentation

- [Docs Branch Structure](/docs-branch-structure/) - Complete branch organization specification
- [Docs Migration Plan](/docs-migration-plan/) - Migration guide from old workflow
- [CI/CD Pipeline](/pipeline/) - Complete pipeline documentation
- [Development Guide](/development/) - Local documentation development

---

## Support

### Documentation

- [README](../README.md) - Quick start guide
- [API Documentation](/api/) - API reference
- [Architecture](/architecture/) - System design
- [Development Guide](/development/) - Development workflows
- [Live Documentation Site](https://pantheon-org.github.io/opencode-warcraft-notifications/) - GitHub Pages

### Community

- [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions) - Questions and discussions

### Contact

- **Email**: support@pantheon-ai.com
- **GitHub**: [@pantheon-org](https://github.com/pantheon-org)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Pantheon AI Team
