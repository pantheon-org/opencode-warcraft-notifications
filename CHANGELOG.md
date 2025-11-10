# Changelog

All notable changes to the Warcraft II Notifications Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive onboarding documentation for new contributors
- Detailed contributing guidelines with code standards
- Security policy and vulnerability reporting procedures
- Changelog for tracking version history

### Changed

- Enhanced documentation structure and navigation

## [1.0.155] - 2025-11-10

### Added

- Complete documentation suite
- User Guide with installation and configuration
- API Documentation with technical reference
- Architecture Documentation with system diagrams
- Development Guide with workflow and testing
- Deployment Guide with operations procedures
- CI/CD Pipeline Documentation
- GitHub Workflows documentation
- GitHub Pages deployment
- JSON schema for plugin configuration
- Schema validation scripts

### Changed

- Improved README with better structure and navigation
- Enhanced documentation cross-references
- Updated package metadata

### Fixed

- Documentation links and references
- Configuration examples

## [1.0.0] - 2025-11-01

### Added

- Initial release of Warcraft II Notifications Plugin
- Support for Alliance and Horde faction sounds
- 100+ authentic Warcraft II unit voice clips
- Bundled sound files (no network dependency)
- Cross-platform support (macOS and Linux)
- Configurable faction selection (alliance/horde/both)
- Custom sound directory configuration
- Platform-specific audio playback
- System notifications with session summaries
- Comprehensive test suite
- TypeScript type definitions
- ESLint and Prettier configuration
- Automated CI/CD pipeline
- AI-powered version management
- Automated release and publishing
- Auto-merge bot for approved PRs
- Branch and release cleanup workflows

### Features

#### Core Functionality

- **Idle Detection**: Triggers on OpenCode session idle events
- **Sound Playback**: Plays authentic Warcraft II sounds
- **Notifications**: Shows system notifications with summaries
- **Faction Selection**: Choose Alliance, Horde, or both
- **Bundled Sounds**: Pre-packaged WAV files, no downloads needed

#### Configuration

- **Multi-level Config**: Project-specific and global configuration
- **Environment Variables**: `SOUNDS_DATA_DIR`, `SOUNDS_BASE_URL`
- **Schema Validation**: JSON schema for configuration validation
- **Safe Defaults**: Sensible defaults for all settings

#### Platform Support

- **macOS**: Uses `afplay` and `osascript`
- **Linux**: Uses `canberra-gtk-play` and `notify-send`
- **Cross-platform Paths**: Handles platform-specific directories

#### Sound Management

- **Bundled Installation**: Copies sounds to user directory on first run
- **Faction Organization**: Sounds organized by faction subdirectories
- **Random Selection**: Picks random sounds for variety
- **Fallback Sounds**: Uses system sounds if files missing

#### Development

- **TypeScript**: Full type safety
- **Bun Runtime**: Fast JavaScript runtime
- **Comprehensive Tests**: Unit, integration, and edge case tests
- **Code Quality**: ESLint, Prettier, and type checking
- **Documentation**: Complete documentation suite

#### CI/CD

- **PR Validation**: Automated testing and linting
- **Smart Version Bump**: AI-powered version determination
- **Release Automation**: Automated GitHub releases and npm publishing
- **Auto-Merge**: Automatic merging of approved PRs
- **Cleanup Workflows**: Automated cleanup of branches and releases
- **Documentation Deployment**: Automated GitHub Pages deployment

---

## Version History

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Incompatible API changes
- **MINOR** version: Backwards-compatible functionality additions
- **PATCH** version: Backwards-compatible bug fixes

### Release Types

- **Major Release** (X.0.0): Breaking changes, major features
- **Minor Release** (1.X.0): New features, enhancements
- **Patch Release** (1.0.X): Bug fixes, minor improvements

---

## Upgrade Guide

### From 1.0.x to 1.1.x (Future)

When upgrading to a minor version:

1. **Update the plugin**:

   ```bash
   npm update @pantheon-ai/opencode-warcraft-notifications
   ```

2. **Review changelog**: Check for new features and changes

3. **Update configuration**: Add any new configuration options

4. **Test**: Verify plugin works as expected

### From 0.x to 1.0.0 (Historical)

Initial release - no upgrade path needed.

---

## Deprecation Policy

### Deprecation Process

1. **Announcement**: Feature marked as deprecated in release notes
2. **Warning Period**: Minimum 3 months before removal
3. **Migration Guide**: Documentation provided for alternatives
4. **Removal**: Feature removed in next major version

### Currently Deprecated

_No features currently deprecated_

---

## Breaking Changes

### 1.0.0

Initial release - no breaking changes.

---

## Security Updates

### Security Advisories

Security updates are marked with 🔒 in the changelog.

### Reporting Security Issues

See [SECURITY.md](./SECURITY.md) for reporting procedures.

### Security Fixes

_No security issues reported yet_

---

## Migration Guides

### Configuration Changes

#### 1.0.0 → 1.1.0 (Future Example)

If configuration format changes in the future:

**Old format**:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "alliance"
  }
}
```

**New format** (example):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "factions": ["alliance"],
    "volume": 0.8
  }
}
```

Migration guide would be provided here.

---

## Known Issues

### Current Issues

Track known issues on [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues).

### Workarounds

None currently needed.

---

## Roadmap

### Planned Features

See [GitHub Projects](https://github.com/pantheon-org/opencode-warcraft-notifications/projects) for planned features.

### Feature Requests

Submit feature requests via [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues/new?template=feature_request.md).

---

## Contributors

### Core Team

- **@thoroc** - Project Lead & Maintainer
- **Pantheon AI Team** - Core Contributors

### Community Contributors

Thank you to all contributors who have helped improve this project!

See [Contributors](https://github.com/pantheon-org/opencode-warcraft-notifications/graphs/contributors) for a complete list.

---

## Release Notes Format

Each release includes:

### Added

New features and capabilities

### Changed

Changes to existing functionality

### Deprecated

Features marked for removal

### Removed

Features removed in this version

### Fixed

Bug fixes

### Security

Security updates and fixes

---

## Links

- **Repository**: [GitHub](https://github.com/pantheon-org/opencode-warcraft-notifications)
- **npm Package**: [npm](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications)
- **Documentation**: [GitHub Pages](https://pantheon-org.github.io/opencode-warcraft-notifications/)
- **Issues**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)

---

**Changelog Maintained By**: Pantheon AI Team  
**Last Updated**: 2025-11-10

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc
