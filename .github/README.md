# GitHub Configuration Directory

This directory contains GitHub-specific configuration files including workflows, scripts, and templates.

## Structure

```
.github/
├── scripts/                    # External workflow scripts
│   ├── auto-merge.cjs         # Auto-merge logic for version sync PRs
│   └── sync-version.cjs       # Version synchronization script
└── workflows/                  # GitHub Actions workflows
    ├── auto-merge-bot.yml     # Auto-merge workflow (uses external script)
    ├── pr-validation.yml      # PR validation and testing
    ├── release-publish.yml    # Release publishing workflow
    ├── smart-version-bump.yml # Smart version bumping
    └── sync-package-version.yml # Package version sync (uses external script)
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
# Note: Global gitignore has **/.github pattern, so we need to explicitly include
!.github/
!.github/workflows/
!.github/workflows/**
!.github/scripts/
!.github/scripts/**

# Ignore system files in .github but keep workflows and scripts
.github/.DS_Store
```

This overrides global gitignore patterns that might exclude `.github` directories.

## Implementation Notes

This workflow architecture was designed to solve maintainability issues with complex embedded JavaScript in YAML files. The external scripts approach provides:

- **Better Error Handling**: Scripts can be tested independently
- **Easier Debugging**: Standard Node.js debugging tools work
- **No YAML Escaping Issues**: Complex template variables and multiline strings handled properly
- **Version Control**: Scripts have proper syntax highlighting and diff support