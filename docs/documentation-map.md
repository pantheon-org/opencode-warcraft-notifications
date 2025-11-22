---
title: 'Documentation Map'
description: 'Complete navigation guide for all project documentation'
---

## Overview

This document provides a comprehensive map of all documentation available for the Warcraft II Notifications Plugin. Use this guide to quickly find the information you need.

## Quick Navigation

### 🚀 Getting Started

- **[Home](/)** - Project overview and quick start
- **[User Guide](/user-guide/)** - Installation and usage instructions
- **[Quick Start](#quick-start-checklist)** - Step-by-step setup guide

### 👨‍💻 For Developers

- **[Development Guide](/development/)** - Development environment and workflow
- **[API Documentation](/api/)** - Complete API reference
- **[Architecture](/architecture/)** - System design and components
- **[Onboarding](/onboarding/)** - New contributor guide
- **[Contributing](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)** - Contribution guidelines

### 🚢 For Operations

- **[Deployment Guide](/deployment/)** - Installation and operations
- **[CI/CD Pipeline](/pipeline/)** - Pipeline technical reference
- **[GitHub Workflows](/github-workflows/)** - Workflow documentation
- **[npm Publishing](/npmjs/)** - npm authentication and token management
- **[Documentation Deployment](/deployment/#documentation-deployment)** - How docs are deployed

### ⚙️ Configuration

- **[Plugin Schema](/schemas/)** - Configuration schema reference
- **[Schema Validation](/validate-schema/)** - Validation guide
- **[User Guide - Configuration](/user-guide/#configuration)** - Configuration examples

### 🔧 Troubleshooting

- **[Troubleshooting Guide](/troubleshooting/)** - Common issues and solutions
- **[User Guide - FAQ](/user-guide/#faq)** - Frequently asked questions
- **[Deployment - Troubleshooting](/deployment/#troubleshooting)** - Deployment issues

---

## Documentation by Audience

### For End Users

#### Getting Started

1. **[Installation](/user-guide/#installation)** - How to install the plugin
2. **[Configuration](/user-guide/#configuration)** - Basic configuration options
3. **[Using the Plugin](/user-guide/#using-the-plugin)** - How to use features
4. **[Sound Factions](/user-guide/#sound-factions)** - Available sound options

#### Customization

- **[Custom Sound Directory](/user-guide/#custom-sound-directory)** - Using custom sounds
- **[Faction Selection](/user-guide/#faction-selection)** - Choosing Alliance/Horde
- **[Configuration Examples](/user-guide/#configuration-examples)** - Real-world examples

#### Support

- **[Troubleshooting](/troubleshooting/)** - Problem resolution
- **[FAQ](/user-guide/#faq)** - Common questions
- **[Updating](/user-guide/#updating-the-plugin)** - How to update

### For Developers

#### Setup

1. **[Development Environment](/development/#development-environment)** - IDE and tools setup
2. **[Project Structure](/development/#project-structure)** - Codebase organization
3. **[Initial Setup](/development/#getting-started)** - First-time setup

#### Development

- **[Development Workflow](/development/#development-workflow)** - Day-to-day workflow
- **[Testing](/development/#testing)** - Testing strategies and tools
- **[Code Quality](/development/#code-quality)** - Linting and formatting
- **[Debugging](/development/#debugging)** - Debugging techniques

#### Architecture

- **[System Architecture](/architecture/#system-architecture)** - High-level design
- **[Component Architecture](/architecture/#component-architecture)** - Module details
- **[Data Flow](/architecture/#data-flow)** - How data moves through the system
- **[Module Dependencies](/architecture/#module-dependencies)** - Dependency graph

#### API Reference

- **[Notification Module](/api/#notification-module)** - Core plugin logic
- **[Sound Manager](/api/#sound-manager-module)** - Sound selection and playback
- **[Configuration](/api/#plugin-configuration-module)** - Configuration management
- **[Schema Validator](/api/#schema-validator-module)** - Configuration validation
- **[Bundled Sounds](/api/#bundled-sounds-module)** - Sound file management

#### Contributing

- **[Contributing Guide](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md#code-of-conduct)** - Community standards
- **[Pull Request Process](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md#pull-request-process)** - PR guidelines

### For DevOps/Operations

#### Deployment

1. **[Deployment Overview](/deployment/#overview)** - Deployment strategies
2. **[Platform-Specific Setup](/deployment/#platform-specific-setup)** - macOS/Linux setup
3. **[Sound File Management](/deployment/#sound-file-management)** - Managing sound files
4. **[Configuration Management](/deployment/#configuration-management)** - Managing configs

#### CI/CD

- **[Pipeline Overview](/pipeline/)** - Complete pipeline reference
- **[GitHub Workflows](/github-workflows/)** - Workflow documentation
- **[npm Publishing](/npmjs/)** - npm authentication and publishing
- **[Smart Version Bump](/github-workflows/overview/#smart-version-bump)** - Automated versioning
- **[Release & Publish](/github-workflows/overview/#release-publish)** - Release automation
- **[Auto-Merge Bot](/github-workflows/overview/#auto-merge-bot)** - PR automation

#### Operations

- **[Monitoring](/deployment/#monitoring)** - Monitoring and logging
- **[Troubleshooting](/deployment/#troubleshooting)** - Operational issues
- **[Backup & Recovery](/deployment/#backup-recovery)** - Data management

---

## Documentation by Topic

### Installation & Setup

| Document                           | Section                                             | Description           |
| ---------------------------------- | --------------------------------------------------- | --------------------- |
| [User Guide](/user-guide/)         | [Installation](/user-guide/#installation)           | End-user installation |
| [Development Guide](/development/) | [Getting Started](/development/#getting-started)    | Developer setup       |
| [Deployment Guide](/deployment/)   | [Installation](/deployment/#installation)           | Production deployment |
| [Onboarding](/onboarding/)         | [Environment Setup](/onboarding/#environment-setup) | New contributor setup |

### Configuration

| Document                          | Section                                                           | Description              |
| --------------------------------- | ----------------------------------------------------------------- | ------------------------ |
| [User Guide](/user-guide/)        | [Configuration](/user-guide/#configuration)                       | User configuration guide |
| [API Documentation](/api/)        | [Plugin Configuration](/api/#plugin-configuration-module)         | Configuration API        |
| [Schema Documentation](/schemas/) | [Schema Reference](/schemas/)                                     | JSON schema details      |
| [Deployment Guide](/deployment/)  | [Configuration Management](/deployment/#configuration-management) | Production config        |

### Architecture & Design

| Document                       | Section                                                         | Description        |
| ------------------------------ | --------------------------------------------------------------- | ------------------ |
| [Architecture](/architecture/) | [System Architecture](/architecture/#system-architecture)       | High-level design  |
| [Architecture](/architecture/) | [Component Architecture](/architecture/#component-architecture) | Module details     |
| [Architecture](/architecture/) | [Data Flow](/architecture/#data-flow)                           | Data flow diagrams |
| [API Documentation](/api/)     | [Type Definitions](/api/#type-definitions)                      | TypeScript types   |

### Testing

| Document                           | Section                                              | Description           |
| ---------------------------------- | ---------------------------------------------------- | --------------------- |
| [Development Guide](/development/) | [Testing](/development/#testing)                     | Testing strategies    |
| [Development Guide](/development/) | [Unit Tests](/development/#unit-tests)               | Unit testing guide    |
| [Development Guide](/development/) | [Integration Tests](/development/#integration-tests) | Integration testing   |
| [Development Guide](/development/) | [Test Coverage](/development/#test-coverage)         | Coverage requirements |

### CI/CD & Automation

| Document                               | Section                                            | Description           |
| -------------------------------------- | -------------------------------------------------- | --------------------- |
| [Pipeline Documentation](/pipeline/)   | [Overview](/pipeline/#overview)                    | Pipeline architecture |
| [GitHub Workflows](/github-workflows/) | [Workflows](/github-workflows/overview/)           | Workflow details      |
| [GitHub Workflows](/github-workflows/) | [Setup Guide](/github-workflows/setup-guide/)      | Workflow setup        |
| [npm Publishing](/npmjs/)              | [Authentication](/npmjs/authentication/)           | npm token management  |
| [npm Publishing](/npmjs/)              | [Token Renewal](/npmjs/token-renewal/)             | Quick token renewal   |
| [Deployment Guide](/deployment/)       | [CI/CD Integration](/deployment/#cicd-integration) | Deployment automation |

### Troubleshooting

| Document                                   | Section                                          | Description                |
| ------------------------------------------ | ------------------------------------------------ | -------------------------- |
| [Troubleshooting Guide](/troubleshooting/) | [Common Issues](/troubleshooting/#common-issues) | General problems           |
| [User Guide](/user-guide/)                 | [Troubleshooting](/user-guide/#troubleshooting)  | User issues                |
| [Deployment Guide](/deployment/)           | [Troubleshooting](/deployment/#troubleshooting)  | Deployment issues          |
| [User Guide](/user-guide/)                 | [FAQ](/user-guide/#faq)                          | Frequently asked questions |

---

## Quick Start Checklist

### For Users

- [ ] Read [Home](/) for project overview
- [ ] Follow [Installation Guide](/user-guide/#installation)
- [ ] Configure [Faction Preference](/user-guide/#faction-selection)
- [ ] Test the plugin with OpenCode
- [ ] Review [Troubleshooting](/troubleshooting/) if needed

### For Developers

- [ ] Read [Development Guide](/development/)
- [ ] Set up [Development Environment](/development/#development-environment)
- [ ] Review [Architecture](/architecture/)
- [ ] Read [API Documentation](/api/)
- [ ] Review [Contributing Guidelines](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)
- [ ] Run tests: `bun test`
- [ ] Check code quality: `bun run lint && bun run type-check`

### For DevOps

- [ ] Read [Deployment Guide](/deployment/)
- [ ] Review [Pipeline Documentation](/pipeline/)
- [ ] Understand [GitHub Workflows](/github-workflows/)
- [ ] Set up [Monitoring](/deployment/#monitoring)
- [ ] Configure [CI/CD](/deployment/#cicd-integration)

---

## Documentation Standards

All documentation in this project follows these standards:

### Structure

- Clear hierarchical organization
- Table of contents for long documents
- Consistent heading levels
- Cross-references between related documents

### Content

- Code examples with syntax highlighting
- Mermaid diagrams for visual representation
- Step-by-step instructions
- Real-world examples
- Troubleshooting sections

### Maintenance

- Regular updates with code changes
- Version information in headers
- Last updated dates
- Clear ownership and contact information

---

## External Resources

### Project Links

- **GitHub Repository**: [pantheon-org/opencode-warcraft-notifications](https://github.com/pantheon-org/opencode-warcraft-notifications)
- **npm Package**: [@pantheon-ai/opencode-warcraft-notifications](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications)
- **Live Documentation**: [GitHub Pages](https://pantheon-org.github.io/opencode-warcraft-notifications/)
- **Issue Tracker**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)

### OpenCode Resources

- **OpenCode Documentation**: [opencode.ai/docs](https://opencode.ai/docs/)
- **Plugin Development**: [opencode.ai/docs/plugins](https://opencode.ai/docs/plugins/)
- **Configuration**: [opencode.ai/docs/config](https://opencode.ai/docs/config/)

### Related Technologies

- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)
- **Bun**: [bun.sh](https://bun.sh/)
- **Zod**: [zod.dev](https://zod.dev/)
- **Astro Starlight**: [starlight.astro.build](https://starlight.astro.build/)

---

## Contributing to Documentation

Documentation improvements are always welcome! See:

- **[Contributing Guide](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md#documentation)** - Documentation contribution guidelines
- **[Documentation Standards](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md#documentation-standards)** - Style and formatting standards

### How to Contribute

1. **Find an Issue**: Check [documentation issues](https://github.com/pantheon-org/opencode-warcraft-notifications/labels/documentation)
2. **Make Changes**: Edit documentation files in `docs/src/content/docs/`
3. **Test Locally**: Run `cd docs && bun run dev` to preview
4. **Submit PR**: Create a pull request with your changes

---

## Support

Need help? Here's where to go:

- **User Questions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Security Issues**: [Security Policy](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/SECURITY.md)
- **General Inquiries**: [support@pantheon-ai.com](mailto:support@pantheon-ai.com)

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

**Last Updated**: 2025-11-11  
**Maintained By**: Pantheon AI Team
