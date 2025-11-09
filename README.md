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
- 🎮 **Unit Variety**: Includes voices from:
  - **Alliance**: Human Units (peasants, knights, mages), Elven Archers, Dwarven Demolition Squad, Naval Units
  - **Horde**: Orcs, Death Knights, Dragons, Goblin Sappers, Ogres, Ogre-Mages, Troll Axethrowers, Naval Units
  - Special completion sounds

## Setup

1. Add the plugin to your [OpenCode config](https://opencode.ai/docs/config/):

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "plugin": ["@pantheon-ai/opencode-warcraft-notifications"]
   }
   ```

2. Restart OpenCode or reload your configuration.

3. On first run the plugin copies bundled WAV files from the repo's `data/` directory into your local plugin data directory; the runtime does not perform network downloads by default.

## Configuration

### Custom Sound Directory

You can customize where sound files are stored by creating a `plugin.json` file:

### Faction Selection

Choose which faction sounds to play using the `faction` configuration option:

- `"alliance"` - Play only Alliance unit sounds
- `"horde"` - Play only Horde unit sounds
- `"both"` - Play random sounds from both factions (default)

**Project-specific configuration** (`.opencode/plugin.json` in your project root):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/project/sounds",
    "faction": "both"
  }
}
```

**Global configuration** (`~/.config/opencode/plugin.json`):

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/home/user/.cache/warcraft-sounds",
    "faction": "horde"
  }
}
```

See [docs/schemas/plugin.json.example](./docs/schemas/plugin.json.example) for a complete example and [docs/schemas/plugin.json.schema](./docs/schemas/plugin.json.schema) for the JSON schema.

### Default Locations

If no configuration is provided, the plugin computes a default per-platform data directory and stores sounds there. Precedence for the effective sounds directory is:

1. Project-specific `plugin.json` `soundsDir` setting
2. `SOUNDS_DATA_DIR` environment variable (absolute path)
3. Computed default data directory (platform-specific; e.g. Linux: `~/.local/share/opencode/storage/plugin/<package-name>`, macOS: `~/Library/Application Support/opencode/storage/plugin/<package-name>`, Windows: `%APPDATA%\opencode\storage\plugin\<package-name>`)

You can override storage by providing `soundsDir` in your project or global `plugin.json`, or by setting `SOUNDS_DATA_DIR`.

## How It Works

- **Idle Detection**: When your OpenCode session goes idle, the plugin triggers
- **Sound Playback**: Plays a random Warcraft II unit sound from your selected faction(s)
- **Notification**: Shows a system notification with your session summary
- **Sound Categories**: Includes unit selection sounds ("Yes, my lord?" / "Zug zug!") and acknowledgment sounds ("For the Alliance!" / "Lok tar!")

### Example Sounds

**Alliance Units:**

- **Human Units**: "Your command?", "Yes, sire?", "At your service"
- **Knights**: "Your majesty?", "For the king!", "Defending your honor"
- **Elven Archers**: "Your eminence?", "For the alliance!", "By your command"
- **Dwarven Squad**: "Aye, laddie!", "What do you want?", "Move out!"
- **Mages**: "What is it?", "Do you need assistance?", "Very well"
- **Ships**: "Captain on the bridge!", "Aye aye sir!", "Under way"

**Horde Units:**

- **Orcs**: "Zug zug!", "Lok tar!", "Dah boo!"
- **Death Knights**: "Yes?", "Make it quick", "Of course, master"
- **Ogres**: "Huh what?", "Yes master", "Okay"
- **Ogre-Mages**: "Yes master?", "Of course", "Right away"
- **Troll Axethrowers**: "D'you call me?", "Who d'you want to kill?", "You the boss"
- **Goblin Sappers**: "What?", "Yes boss", "Certainly"
- **Dragons**: Dragon roars and acknowledgments
- **Horde Ships**: "Done building ship", "Argh?", "Aye matey?"

## Platform Support

- **macOS**: Uses `afplay` for audio and `osascript` for notifications
- **Linux**: Uses `canberra-gtk-play` for audio and `notify-send` for notifications

## Sound Sources

The repository includes bundled WAV assets sourced from the Warcraft II archives (original sources include thanatosrealms.com). The runtime uses the bundled files by default and does not fetch from the network unless you explicitly implement or call download helpers.

This ensures authentic game audio quality while avoiding runtime network dependencies.

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

## Development

Test the plugin functionality:

```bash
bun run src/notification.test.ts
```

This will verify sound selection and playback behavior using the test harness (tests use the bundled `data/` assets by default).

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

> **Note:** This plugin now uses an advanced AI-powered workflow system for automated versioning, publishing, and auto-merging of version sync PRs.
