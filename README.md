# 🎮 Warcraft II Notifications Plugin for OpenCode

[![npm version](https://img.shields.io/npm/v/@pantheon-ai/opencode-warcraft-notifications.svg)](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-orange.svg)](https://bun.sh/)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue.svg)](https://pantheon-org.github.io/opencode-warcraft-notifications/)

**Enhance your OpenCode experience with nostalgic Warcraft II unit sounds!**

This plugin plays authentic Warcraft II unit audio clips from both Alliance and Horde factions when your OpenCode session goes idle, bringing back memories of commanding orcs, knights, trolls, and mages in the classic RTS game.

[Quick Start](#quick-start) • [Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/) • [Contributing](CONTRIBUTING.md)

---

## Features

- 🎵 **110+ Authentic Sounds**: Complete collection of Warcraft II Alliance and Horde unit voices
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

### Quick Access

- **[📚 Documentation Site](https://pantheon-org.github.io/opencode-warcraft-notifications/)** - Complete documentation (recommended)
- **[🗺️ Documentation Map](https://pantheon-org.github.io/opencode-warcraft-notifications/documentation-map/** - Navigation guide
- **[⚡ Quick Reference](https://pantheon-org.github.io/opencode-warcraft-notifications/quick-reference/** - Common tasks and commands

### For Users

- **[User Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/** - Installation, configuration, and usage
- **[FAQ](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#faq)** - Common questions and answers
- **[Troubleshooting](https://pantheon-org.github.io/opencode-warcraft-notifications/troubleshooting/** - Problem resolution

### For Developers

- **[Development Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/development/** - Setup, workflow, and contributing
- **[API Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/api/** - Complete technical reference
- **[Architecture](https://pantheon-org.github.io/opencode-warcraft-notifications/architecture/** - System design and components
- **[Onboarding](https://pantheon-org.github.io/opencode-warcraft-notifications/onboarding/** - New contributor guide

### For Operations

- **[Deployment Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/deployment/** - Installation and operations
- **[CI/CD Pipeline](https://pantheon-org.github.io/opencode-warcraft-notifications/pipeline/** - Complete pipeline technical reference
- **[GitHub Workflows](https://pantheon-org.github.io/opencode-warcraft-notifications/github-workflows/** - CI/CD setup guides

### Additional Resources

- **[Security Policy](SECURITY.md)** - Security and vulnerability reporting
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[GitHub Releases](https://github.com/pantheon-org/opencode-warcraft-notifications/releases)** - Version history and release notes

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
- **Customize sounds**: See [User Guide - Customization](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#customization)
- **Troubleshoot**: See [Troubleshooting Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/troubleshooting/

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

### Toast Notifications

By default, the plugin shows toast notifications with the Warcraft II voice line as the title when your session goes idle. You can disable this feature if you prefer silent mode (sound only):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "showDescriptionInToast": false
  }
}
```

**Example with toast enabled (default):**

- Toast Title: `"Yes, milord?"`
- Toast Message: `Created notification system with sound descriptions`
- Sound plays: `human_selected1.wav`

**Example with toast disabled:**

- Sound plays: `human_selected1.wav`
- No visual notification shown

### Custom Sound Directory

You can customize where sound files are stored:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/custom/sounds",
    "faction": "both",
    "showDescriptionInToast": true
  }
}
```

### Configuration Precedence

1. Project-specific `plugin.json` `soundsDir` setting
2. `SOUNDS_DATA_DIR` environment variable
3. Platform-specific default directory

For complete configuration options and examples, see:

- **[User Guide - Configuration](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#configuration)**
- **[API Documentation - Configuration](https://pantheon-org.github.io/opencode-warcraft-notifications/api/#configuration-module)**
- **[Schemas Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/schemas/**

## How It Works

1. **Idle Detection**: When your OpenCode session goes idle, the plugin triggers
2. **Sound Selection**: Randomly selects a Warcraft II unit sound from your configured faction(s)
3. **Sound Playback**: Plays the sound using platform-specific audio tools
4. **Toast Notification**: Shows an in-app toast with the voice line as the title (e.g., "Yes, milord?") and your session summary

The plugin includes 110+ authentic sounds from both factions, including:

- Unit selection sounds ("Yes, my lord?" / "Zug zug!")
- Acknowledgment sounds ("For the Alliance!" / "Lok tar!")
- Work completion sounds ("Work complete!" / "Jobs done!")

### Sound Factions

**Alliance Units**: Peasants, Knights, Mages, Elven Archers, Dwarven Demolition Squad, Naval Units

**Horde Units**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units

For the complete list of sounds and examples, see:

- **[User Guide - Sound Factions](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#sound-factions)**
- **[Architecture - Sound Data](https://pantheon-org.github.io/opencode-warcraft-notifications/architecture/#sound-data-module)**

## Platform Support

- **macOS**: Uses `afplay` for audio playback
- **Linux**: Uses `canberra-gtk-play` for audio playback
- **Toast Notifications**: Cross-platform using OpenCode's built-in toast system

For detailed platform-specific setup and troubleshooting, see:

- [User Guide - Installation](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#installation)
- [Deployment Guide - Platform-Specific Setup](https://pantheon-org.github.io/opencode-warcraft-notifications/deployment/#platform-specific-setup)

## Sound Sources

All sound files are bundled with the plugin from Warcraft II archives. The plugin:

- Includes 110+ pre-bundled WAV files in the `data/` directory
- Copies files to local storage on first use
- No network downloads required during runtime
- Ensures authentic game audio quality

For technical details, see:

- **[Architecture - Bundled Sounds](https://pantheon-org.github.io/opencode-warcraft-notifications/architecture/#bundled-sounds-module)**
- **[Deployment - Sound Management](https://pantheon-org.github.io/opencode-warcraft-notifications/deployment/#sound-file-management)**

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

For more details, see the [User Guide - Updating](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#updating-the-plugin).

## Development

For development instructions, see the [Development Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/development/.

Quick start:

```bash
# Run tests
bun test

# Run type checking
bun run type-check

# Run linting
bun run lint
```

### Documentation Workflow

This project uses a two-directory approach for documentation:

- **`./docs/`** - Source documentation (markdown files)
- **`./pages/`** - Astro Starlight build configuration

To work with documentation:

```bash
# Transform docs from source to build directory
bun run pages:transform

# Start development server with live reload
bun run pages:dev

# Build static site for production
bun run pages:build

# Preview production build
bun run pages:preview
```

**Documentation Flow:**

1. Edit markdown files in `./docs/`
2. Run `bun run pages:transform` to copy to `./pages/src/content/docs/`
3. Run `bun run pages:build` to generate static site in `./pages/dist/`
4. GitHub Actions automatically deploys to `docs` branch → GitHub Pages

For more details, see the [Development Guide - Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/development/#documentation-workflow).

### Debugging

To debug the plugin and see detailed logging:

```bash
# Enable debug logging
DEBUG_OPENCODE=1 opencode

# Test toast notifications manually
bun run test-toast-manual.ts
```

The debug mode will log:

- All event types received by the plugin
- Message text saved for idle summaries
- Session idle events and handling
- Toast notification attempts and results
- Sound file selection and playback

See the [Development Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/development/ for complete development workflow, testing strategies, and contributing guidelines.

---

## Troubleshooting

Having issues? Check these resources:

- **[Troubleshooting Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/troubleshooting/** - Common issues and solutions
- **[User Guide - FAQ](https://pantheon-org.github.io/opencode-warcraft-notifications/user-guide/#faq)** - Frequently asked questions
- **[Deployment Guide - Troubleshooting](https://pantheon-org.github.io/opencode-warcraft-notifications/deployment/#troubleshooting)** - Deployment and configuration issues

## Contributing

We welcome contributions! Please see:

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Development Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/development/** - Development setup and workflow
- **[Onboarding Guide](https://pantheon-org.github.io/opencode-warcraft-notifications/onboarding/** - New contributor onboarding
- **[Architecture Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/architecture/** - System design
- **[API Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/api/** - Technical reference

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)
- **Documentation**: [Live Documentation](https://pantheon-org.github.io/opencode-warcraft-notifications/)
- **Source Docs**: [Documentation Source](docs/)

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

<!-- Test workflow validation - 2025-11-12 -->
