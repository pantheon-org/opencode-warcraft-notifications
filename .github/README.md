# GitHub Configuration Directory

This directory contains GitHub-specific configuration files including workflows, scripts, and templates.

## Structure

```
.github/
├── scripts/                    # External workflow scripts
│   ├── auto-merge.cjs         # Auto-merge logic for version sync PRs
│   └── sync-version.cjs       # Version synchronization script
├── workflows/                  # GitHub Actions workflows
│   ├── auto-merge-bot.yml     # Auto-merge workflow (uses external script)
│   ├── pr-validation.yml      # PR validation and testing
│   ├── release-publish.yml    # Release publishing workflow
│   ├── smart-version-bump.yml # Smart version bumping
│   └── sync-package-version.yml # Package version sync (uses external script)
└── workflows-disabled/        # Legacy workflows (DO NOT RE-ENABLE)
    ├── README.md              # Documentation explaining why these are disabled
    ├── auto-merge-bot.yml     # Legacy complex auto-merge workflow (REFERENCE ONLY)
    └── sync-package-version.yml # Legacy complex version sync workflow (REFERENCE ONLY)
```

## Workflow Architecture

### External Scripts Approach

The workflows in this repository use an external scripts approach for better maintainability:

- **Complex logic** is moved to `.cjs` files in the `scripts/` directory
- **Workflow YAML files** are kept simple and just call the external scripts
- **Benefits**: Better testability, easier debugging, no YAML escaping issues

### Key Workflows

1. **PR Validation** (`pr-validation.yml`): Runs tests, linting, and builds on PRs
2. **Smart Version Bump** (`smart-version-bump.yml`): Automatically bumps versions and creates releases
3. **Sync Package Version** (`sync-package-version.yml`): Syncs package.json version with Git tags
4. **Auto-Merge Bot** (`auto-merge-bot.yml`): Automatically merges version sync PRs after validation

## GitIgnore Configuration

The repository `.gitignore` includes specific patterns to ensure `.github` files are tracked:

```gitignore
# GitHub Actions - override global gitignore that excludes .github directories
!.github/
!.github/**
.github/.DS_Store
```

This overrides global gitignore patterns that might exclude `.github` directories.

## Important Notes

### workflows-disabled/ Directory

⚠️ **DO NOT move files from `workflows-disabled/` back to `workflows/`** ⚠️

The `workflows-disabled/` directory contains legacy workflow files that:
- Had complex embedded JavaScript causing YAML syntax errors
- Were replaced by the current simplified workflows + external scripts approach
- Are kept for reference and documentation purposes only
- Will cause the same issues we fixed if re-enabled

See `workflows-disabled/README.md` for detailed explanation.