---
title: 'Home'
description: 'Warcraft II Notifications Plugin for OpenCode'
---

<div align="center" markdown="1">

# 🎮 Warcraft II Notifications Plugin for OpenCode

[![npm version](https://img.shields.io/npm/v/@pantheon-ai/opencode-warcraft-notifications.svg)](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/) [![Bun](https://img.shields.io/badge/Bun-1.0-orange.svg)](https://bun.sh/) [![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue.svg)](https://pantheon-org.github.io/opencode-warcraft-notifications/)

**Enhance your OpenCode experience with nostalgic Warcraft II unit sounds!**

This plugin plays authentic Warcraft II unit audio clips from both Alliance and Horde factions when your OpenCode session goes idle, bringing back memories of commanding orcs, knights, trolls, and mages in the classic RTS game.

[Quick Start](#quick-start) • [Documentation](/index) • [Contributing](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)

</div>

---

## Features

- 🎵 **100+ Authentic Sounds**: Complete collection of Warcraft II Alliance and Horde unit voices
- 📦 **Bundled Sounds**: Includes pre-bundled WAV assets copied into a per-user data directory on first use (no runtime network dependency by default)
- 🎲 **Random Selection**: Plays a different sound each time for variety
- ⚔️ **Faction Choice**: Choose Alliance, Horde, or both factions
- 💻 **Cross-Platform**: Works on macOS and Linux
- 🎨 **Toast Notifications**: In-app toast notifications with authentic voice lines (e.g., "Yes, milord?" / "Work, work.")
- 🚀 **Automated Releases**: Fully automated CI/CD pipeline with AI-powered version management
- 📚 **Comprehensive Documentation**: Complete documentation suite for users, developers, and operators
- 🎮 **Unit Variety**: Includes voices from:
  - **Alliance**: Human Units (peasants, knights, mages), Elven Archers, Dwarven Demolition Squad, Naval Units
  - **Horde**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units
  - Special completion sounds

## Documentation

This project includes comprehensive documentation for all users:

### For Users

- **[User Guide](/user-guide)** - Installation, configuration, and usage
- **[FAQ](/user-guide#faq)** - Common questions and answers

### For Developers

- **[Development Guide](/development)** - Setup, workflow, and contributing
- **[API Documentation](/api)** - Complete technical reference
- **[Architecture](/architecture)** - System design and components

### For Operations

- **[Deployment Guide](/deployment)** - Installation and operations
- **[CI/CD Pipeline](/pipeline)** - Complete pipeline technical reference
- **[GitHub Workflows](/github-workflows)** - CI/CD setup guides

### Complete Documentation

- **[Documentation Index](/)** - Complete documentation map and navigation

## Quick Start

### 1. Installation

Add the plugin to your [OpenCode config](https://opencode.ai/docs/config/):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@pantheon-ai/opencode-warcraft-notifications"]
}
```

### 2. Restart OpenCode

```bash
opencode
```

### 3. Enjoy!

When your OpenCode session goes idle, you'll hear Warcraft II sounds and see a notification.

On first run, the plugin automatically copies bundled WAV files to your local plugin data directory (no network downloads required).

### Next Steps

- **Configure factions**: See [Configuration](#configuration) below
- **Customize sounds**: See [User Guide - Customization](/user-guide#customization)
- **Troubleshoot**: See [User Guide - Troubleshooting](/user-guide#troubleshooting)

## Configuration

### Faction Selection

Choose which faction sounds to play:

- `"alliance"` - Play only Alliance unit sounds
- `"horde"` - Play only Horde unit sounds
- `"both"` - Play random sounds from both factions (default)

**Project-specific** (`.opencode/plugin.json`):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "alliance"
  }
}
```

**Global** (`~/.config/opencode/plugin.json`):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "horde"
  }
}
```

### Custom Sound Directory

You can customize where sound files are stored:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/custom/sounds",
    "faction": "both"
  }
}
```

### Configuration Precedence

1. Project-specific `plugin.json` `soundsDir` setting
2. `SOUNDS_DATA_DIR` environment variable
3. Platform-specific default directory

For complete configuration options and examples, see:

- **[User Guide - Configuration](/user-guide#configuration)**
- **[API Documentation - Configuration](/api#plugin-configuration-module)**
- **[Schemas Documentation](/schemas)**

## How It Works

1. **Idle Detection**: When your OpenCode session goes idle, the plugin triggers
2. **Sound Selection**: Randomly selects a Warcraft II unit sound from your configured faction(s)
3. **Sound Playback**: Plays the sound using platform-specific audio tools
4. **Toast Notification**: Shows an in-app toast with the voice line as the title (e.g., "Yes, milord?") and your session summary

The plugin includes 100+ authentic sounds from both factions, including:

- Unit selection sounds ("Yes, my lord?" / "Zug zug!")
- Acknowledgment sounds ("For the Alliance!" / "Lok tar!")
- Work completion sounds ("Work complete!" / "Jobs done!")

### Sound Factions

**Alliance Units**: Peasants, Knights, Mages, Elven Archers, Dwarven Demolition Squad, Naval Units

**Horde Units**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units

For the complete list of sounds and examples, see:

- **[User Guide - Sound Factions](/user-guide#sound-factions)**
- **[Architecture - Sound Data](/architecture#sound-data-module)**

## Platform Support

- **macOS**: Uses `afplay` for audio playback
- **Linux**: Uses `canberra-gtk-play` for audio playback
- **Toast Notifications**: Cross-platform using OpenCode's built-in toast system

For detailed platform-specific setup and troubleshooting, see:

- [User Guide - Installation](/user-guide#installation)
- [Deployment Guide - Platform-Specific Setup](/deployment#platform-specific-setup)

## Sound Sources

All sound files are bundled with the plugin from Warcraft II archives. The plugin:

- Includes 100+ pre-bundled WAV files in the `data/` directory
- Copies files to local storage on first use
- No network downloads required during runtime
- Ensures authentic game audio quality

For technical details, see:

- **[Architecture - Bundled Sounds](/architecture#bundled-sounds-module)**
- **[Deployment - Sound Management](/deployment#sound-file-management)**

## Updating

> [!WARNING]
> OpenCode does NOT auto-update plugins

To get the latest version:

```bash
(cd ~ && sed -i.bak '/"@pantheon-ai\/opencode-warcraft-notifications"/d' .cache/opencode/package.json && \
rm -rf .cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications && \
echo "Plugin update script finished successfully.")
```

```bash
opencode  # Reinstalls latest
```

For more details, see the [User Guide - Updating](/user-guide#updating-the-plugin).

## Development

For development instructions, see the [Development Guide](/development).

Quick start:

```bash
# Run tests
bun test

# Run type checking
bun run type-check

# Run linting
bun run lint
```

See the [Development Guide](/development) for complete development workflow, testing strategies, and contributing guidelines.

---

## Troubleshooting

Having issues? Check these resources:

- **[User Guide - Troubleshooting](/user-guide#troubleshooting)** - Common issues and solutions
- **[User Guide - FAQ](/user-guide#faq)** - Frequently asked questions
- **[Deployment Guide - Troubleshooting](/deployment#troubleshooting)** - Deployment and configuration issues

## Contributing

We welcome contributions! Please see:

- **[Contributing Guide](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/CONTRIBUTING.md)** - How to contribute
- **[Development Guide](/development)** - Development setup and workflow
- **[Onboarding Guide](/onboarding)** - New contributor onboarding
- **[Architecture Documentation](/architecture)** - System design
- **[API Documentation](/api)** - Technical reference

## License

MIT License - see [LICENSE](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)
- **Documentation**: [Documentation Index](/index)
- **Live Docs**: [GitHub Pages](https://pantheon-org.github.io/opencode-warcraft-notifications/)
- **Security**: [Security Policy](https://github.com/pantheon-org/opencode-warcraft-notifications/blob/main/SECURITY.md)

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

> **Note:** This plugin uses an advanced AI-powered workflow system for automated versioning, publishing, and auto-merging. See [GitHub Workflows Documentation](/github-workflows) for details.
