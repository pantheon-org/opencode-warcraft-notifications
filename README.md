# Warcraft II Alliance Notifications Plugin for OpenCode

Enhance your OpenCode experience with nostalgic Warcraft II Alliance unit sounds! This plugin plays authentic Warcraft II Alliance unit audio clips when your OpenCode session goes idle, bringing back memories of commanding peasants, knights, and mages in the classic RTS game.

## Features

- 🎵 **50+ Authentic Sounds**: Complete collection of Warcraft II Alliance unit voices
- 🔄 **Auto-Download**: Automatically downloads sound files on first use
- 🎲 **Random Selection**: Plays a different sound each time for variety
- 💻 **Cross-Platform**: Works on macOS and Linux
- 📱 **Smart Notifications**: Shows session summary with the sound notification
- 🎮 **Unit Variety**: Includes voices from:
  - Human Units (peasants, knights, mages)
  - Elven Archers
  - Dwarven Demolition Squad
  - Naval Units
  - Special completion sounds

## Setup

1. Add the plugin to your [OpenCode config](https://opencode.ai/docs/config/):

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "plugin": ["@pantheon-ai/opencode-warcraft-notification"]
   }
   ```

2. Restart OpenCode or reload your configuration.

3. The plugin will automatically download Warcraft II Alliance sounds on first idle event.

## How It Works

- **Idle Detection**: When your OpenCode session goes idle, the plugin triggers
- **Sound Playback**: Plays a random Warcraft II Alliance unit sound
- **Notification**: Shows a system notification with your session summary
- **Sound Categories**: Includes unit selection sounds ("Yes, my lord?") and acknowledgment sounds ("For the Alliance!")

### Example Sounds

- **Human Units**: "Your command?", "Yes, sire?", "At your service"
- **Knights**: "Your majesty?", "For the king!", "Defending your honor"
- **Elven Archers**: "Your eminence?", "For the alliance!", "By your command"
- **Dwarven Squad**: "Aye, laddie!", "What do you want?", "Move out!"
- **Mages**: "What is it?", "Do you need assistance?", "Very well"
- **Ships**: "Captain on the bridge!", "Aye aye sir!", "Under way"

## Platform Support

- **macOS**: Uses `afplay` for audio and `osascript` for notifications
- **Linux**: Uses `canberra-gtk-play` for audio and `notify-send` for notifications

## Sound Sources

Sounds are downloaded from the Warcraft II sound archive at thanatosrealms.com, ensuring authentic game audio quality.

## Updating

> [!WARNING]
> OpenCode does NOT auto-update plugins

To get the latest version:

```bash
(cd ~ && sed -i.bak '/"opencode-warcraft-notification"/d' .cache/opencode/package.json && \
rm -rf .cache/opencode/node_modules/opencode-warcraft-notification && \
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

This will verify sound downloads and test random sound selection.

---

_"Work complete!"_ - Warcraft II Peasant
