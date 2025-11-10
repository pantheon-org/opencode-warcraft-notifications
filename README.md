# Warcraft II Notifications Plugin for OpenCode

Enhance your OpenCode experience with nostalgic Warcraft II unit sounds! This plugin plays authentic Warcraft II unit audio clips from both Alliance and Horde factions when your OpenCode session goes idle, bringing back memories of commanding orcs, knights, trolls, and mages in the classic RTS game.

## Features

- 🎵 **100+ Authentic Sounds**: Complete collection of Warcraft II Alliance and Horde unit voices
- 📦 **Bundled Sounds**: Includes pre-bundled WAV assets copied into a per-user data directory on first use (no runtime network dependency by default)
- 🎲 **Random Selection**: Plays a different sound each time for variety
- ⚔️ **Faction Choice**: Choose Alliance, Horde, or both factions
- 💻 **Cross-Platform**: Works on macOS and Linux
- 📱 **Smart Notifications**: Shows session summary with the sound notification
- 🚀 **Automated Releases**: Fully automated CI/CD pipeline with AI-powered version management
- 📚 **Comprehensive Documentation**: Complete documentation suite for users, developers, and operators
- 🎮 **Unit Variety**: Includes voices from:
  - **Alliance**: Human Units (peasants, knights, mages), Elven Archers, Dwarven Demolition Squad, Naval Units
  - **Horde**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units
  - Special completion sounds

## Documentation

This project includes comprehensive documentation for all users:

### For Users

- **[User Guide](./docs/USER_GUIDE.md)** - Installation, configuration, and usage
- **[FAQ](./docs/USER_GUIDE.md#faq)** - Common questions and answers

### For Developers

- **[Development Guide](./docs/DEVELOPMENT.md)** - Setup, workflow, and contributing
- **[API Documentation](./docs/API.md)** - Complete technical reference
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and components

### For Operations

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Installation and operations
- **[CI/CD Pipeline](./docs/PIPELINE.md)** - Complete pipeline technical reference
- **[GitHub Workflows](./docs/github-workflows/README.md)** - CI/CD setup guides

### Complete Documentation

- **[Documentation Index](./docs/README.md)** - Complete documentation map and navigation

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
- **Customize sounds**: See [User Guide - Customization](./docs/USER_GUIDE.md#customization)
- **Troubleshoot**: See [User Guide - Troubleshooting](./docs/USER_GUIDE.md#troubleshooting)

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

- **[User Guide - Configuration](./docs/USER_GUIDE.md#configuration)**
- **[API Documentation - Configuration](./docs/API.md#plugin-configuration-module)**
- **[Schemas Documentation](./docs/schemas/README.md)**

## How It Works

1. **Idle Detection**: When your OpenCode session goes idle, the plugin triggers
2. **Sound Selection**: Randomly selects a Warcraft II unit sound from your configured faction(s)
3. **Sound Playback**: Plays the sound using platform-specific audio tools
4. **Notification**: Shows a system notification with your session summary

The plugin includes 100+ authentic sounds from both factions, including:

- Unit selection sounds ("Yes, my lord?" / "Zug zug!")
- Acknowledgment sounds ("For the Alliance!" / "Lok tar!")
- Work completion sounds ("Work complete!" / "Jobs done!")

### Sound Factions

**Alliance Units**: Peasants, Knights, Mages, Elven Archers, Dwarven Demolition Squad, Naval Units

**Horde Units**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units

For the complete list of sounds and examples, see:

- **[User Guide - Sound Factions](./docs/USER_GUIDE.md#sound-factions)**
- **[Architecture - Sound Data](./docs/ARCHITECTURE.md#sound-data-module)**

## Platform Support

- **macOS**: Uses `afplay` for audio and `osascript` for notifications
- **Linux**: Uses `canberra-gtk-play` for audio and `notify-send` for notifications

For detailed platform-specific setup and troubleshooting, see:

- [User Guide - Installation](./docs/USER_GUIDE.md#installation)
- [Deployment Guide - Platform-Specific Setup](./docs/DEPLOYMENT.md#platform-specific-setup)

## Sound Sources

All sound files are bundled with the plugin from Warcraft II archives. The plugin:

- Includes 100+ pre-bundled WAV files in the `data/` directory
- Copies files to local storage on first use
- No network downloads required during runtime
- Ensures authentic game audio quality

For technical details, see:

- **[Architecture - Bundled Sounds](./docs/ARCHITECTURE.md#bundled-sounds-module)**
- **[Deployment - Sound Management](./docs/DEPLOYMENT.md#sound-file-management)**

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

For more details, see the [User Guide - Updating](./docs/USER_GUIDE.md#updating-the-plugin).

## Development

For development instructions, see the [Development Guide](./docs/DEVELOPMENT.md).

Quick start:

```bash
# Run tests
bun test

# Run type checking
bun run type-check

# Run linting
bun run lint
```

See the [Development Guide](./docs/DEVELOPMENT.md) for complete development workflow, testing strategies, and contributing guidelines.

---

## Troubleshooting

Having issues? Check these resources:

- **[User Guide - Troubleshooting](./docs/USER_GUIDE.md#troubleshooting)** - Common issues and solutions
- **[User Guide - FAQ](./docs/USER_GUIDE.md#faq)** - Frequently asked questions
- **[Deployment Guide - Troubleshooting](./docs/DEPLOYMENT.md#troubleshooting)** - Deployment and configuration issues

## Contributing

We welcome contributions! Please see:

- **[Development Guide](./docs/DEVELOPMENT.md)** - Development setup and workflow
- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - System design
- **[API Documentation](./docs/API.md)** - Technical reference

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/pantheon-org/opencode-warcraft-notifications/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pantheon-org/opencode-warcraft-notifications/discussions)
- **Documentation**: [Documentation Index](./docs/README.md)

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

> **Note:** This plugin uses an advanced AI-powered workflow system for automated versioning, publishing, and auto-merging. See [GitHub Workflows Documentation](./docs/github-workflows/README.md) for details.
