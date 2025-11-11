---
title: 'GitHub Workflows Documentation'
description: 'This directory contains all documentation related to GitHub Actions workflows, automation, and CI/CD processes for this project.'
---

# GitHub Workflows Documentation

This directory contains all documentation related to GitHub Actions workflows, automation, and CI/CD processes for this project.

## 📁 Documentation Structure

### Core Documentation

- **[Overview](./overview.md)** - Comprehensive documentation for all GitHub Actions workflows
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

This repository uses several automated workflows:

- **Smart Version Bump** - Intelligent semantic versioning based on commit analysis
- **Release & Publish** - Automated npm publishing and GitHub releases
- **Deploy Documentation** - Automated documentation build and deployment to GitHub Pages
- **PR Validation** - Comprehensive testing and validation for pull requests
- **Auto-Merge Bot** - Automated merging for version sync PRs
- **Sync Package Version** - Legacy fallback for version synchronization

## Key Features

- ✅ Automated semantic versioning with AI analysis
- ✅ Comprehensive testing and validation
- ✅ Automated npm publishing
- ✅ GitHub release management
- ✅ Automated documentation deployment to GitHub Pages
- ✅ Two-branch documentation workflow (main → docs)
- ✅ Cycle prevention and race condition protection
- ✅ Squash merge enforcement

## Recent Updates

- **Workflow Cycle Prevention** - Fixed excessive version releases (see [Cycle Prevention Fix](./cycle-prevention-fix.md))
- **Architecture Refactoring** - Streamlined workflow architecture (see [Architecture Summary](./architecture-summary.md))
- **Enhanced Documentation** - Comprehensive guides and troubleshooting

For the most up-to-date information, refer to the individual documentation files in this directory.
