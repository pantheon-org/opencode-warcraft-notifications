---
title: 'GitHub Workflows Documentation'
description: 'This directory contains all documentation related to GitHub Actions workflows, automation, and CI/CD processes for this project.'
---

This directory contains all documentation related to GitHub Actions workflows, automation, and CI/CD processes for this project.

## 📁 Documentation Structure

### Core Documentation

- **[Sequential Orchestration](./sequential-orchestration.md)** - NEW: Complete guide to the sequential workflow system
- **[Migration Guide](./migration-guide.md)** - NEW: Guide for migrating to new workflow structure
- **[Overview](./overview.md)** - Legacy: Original workflow documentation
- **[Setup Guide](./setup-guide.md)** - Step-by-step workflow setup instructions
- **[Architecture Summary](./architecture-summary.md)** - Complete workflow architecture and refactoring history

### Configuration & Fixes

- **[Cycle Prevention Fix](./cycle-prevention-fix.md)** - Solution for workflow cycle causing excessive releases
- **[Squash Merge Configuration](./squash-merge-configuration.md)** - Repository merge strategy configuration

## Quick Start

1. **New to the project?** Start with the [Setup Guide](./setup-guide.md)
2. **Need workflow details?** Check the [Overview](./overview.md)
3. **Troubleshooting?** See specific fix documentation above

## Workflow Types

This repository uses **sequential orchestrated workflows** (see [Sequential Orchestration](./sequential-orchestration.md)):

### Automated Release Pipeline

1. **Validate PR** (1-validate.yml) - Lint, test, build, security scan
2. **Version Update** (2-version-update.yml) - Analyze commits & create version PR
3. **Auto-Merge** (3-auto-merge.yml) - Auto-merge version PRs
4. **Create Tag** (4-create-tag.yml) - Create git tags from version
5. **Publish Release** (5-publish.yml) - Publish npm, docs, and GitHub release
6. **Cleanup** (6-cleanup.yml) - Clean old releases and branches

### Independent Workflows

- **Deploy Documentation** (deploy-docs.yml) - Deploys docs immediately on `docs/**` changes (no version required)
- **Repository Config Check** (repo-config-check.yml) - Verify squash merge settings

## Key Features

- ✅ Sequential orchestrated workflow (1→2→3→4→5→6)
- ✅ Version updates via reviewable PR
- ✅ Conventional commit analysis (no AI dependency)
- ✅ Comprehensive testing and validation
- ✅ Automated npm publishing with provenance
- ✅ GitHub release management
- ✅ Automated documentation deployment to GitHub Pages
- ✅ Cycle prevention and race condition protection
- ✅ Squash merge enforcement
- ✅ Extracted shell scripts for maintainability

## Recent Updates

### 2025-11-12

- **📚 NEW: Independent Docs Deployment** - Documentation now deploys immediately on `docs/**` changes without requiring a release
- **📖 Enhanced Documentation** - Added comprehensive README for all workflows

### 2025-11-11

- **🎉 NEW: Sequential Orchestration** - Complete workflow restructuring (see [Sequential Orchestration](./sequential-orchestration.md))
- **📖 NEW: Migration Guide** - Step-by-step migration instructions (see [Migration Guide](./migration-guide.md))
- **🔧 Extracted Scripts** - Complex logic moved to shell scripts for better maintainability
- **✅ Clean YAML** - All workflows now use properly formatted YAML
- **🔄 Removed Redundancy** - Eliminated sync-package-version workflow
- **🚫 Removed AI Dependency** - Now uses conventional commits only

For the most up-to-date information, refer to the individual documentation files in this directory.
