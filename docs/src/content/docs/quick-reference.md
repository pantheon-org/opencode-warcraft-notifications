---
title: 'Quick Reference'
description: 'Quick reference guide for common tasks and commands'
---

# Quick Reference Guide

## Installation & Setup

### Install Plugin

```json
// ~/.config/opencode/opencode.json or .opencode/opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@pantheon-ai/opencode-warcraft-notifications"]
}
```

### Configure Faction

```json
// ~/.config/opencode/plugin.json or .opencode/plugin.json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "alliance" // or "horde" or "both"
  }
}
```

### Custom Sound Directory

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/custom/path/to/sounds",
    "faction": "both"
  }
}
```

---

## Common Commands

### Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Watch mode
bun test --watch

# Type checking
bun run type-check

# Linting
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check

# Clean build artifacts
bun run clean

# Build
bun run build

# Development mode
bun run dev
```

### Testing Specific Modules

```bash
# Test specific file
bun test src/sounds.test.ts

# Test with pattern
bun test --test-name-pattern="faction"

# Verbose output
bun run test:verbose
```

### Documentation

```bash
# Navigate to docs directory
cd docs

# Install dependencies
bun install

# Start dev server
bun run dev

# Build documentation
bun run build

# Preview build
bun run preview
```

---

## File Locations

### Configuration Files

| File                    | Location                           | Purpose                          |
| ----------------------- | ---------------------------------- | -------------------------------- |
| OpenCode Config         | `~/.config/opencode/opencode.json` | Global OpenCode configuration    |
| Plugin Config           | `~/.config/opencode/plugin.json`   | Global plugin configuration      |
| Project OpenCode Config | `.opencode/opencode.json`          | Project-specific OpenCode config |
| Project Plugin Config   | `.opencode/plugin.json`            | Project-specific plugin config   |

### Data Directories

| Platform | Default Location                                                                         |
| -------- | ---------------------------------------------------------------------------------------- |
| macOS    | `~/Library/Application Support/opencode/storage/plugin/opencode-warcraft-notifications/sounds/` |
| Linux    | `~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/sounds/`                |
| Windows  | `%APPDATA%\opencode\storage\plugin\opencode-warcraft-notifications\`                     |

### Sound Files

```
<data-directory>/
├── alliance/
│   ├── human_selected1.wav
│   ├── human_acknowledge1.wav
│   ├── elf_selected1.wav
│   ├── dwarf_selected1.wav
│   ├── knight_selected1.wav
│   ├── mage_selected1.wav
│   ├── peasant_selected1.wav
│   ├── ship_selected1.wav
│   ├── work_completed.wav
│   └── jobs_done.wav
└── horde/
    ├── orc_selected1.wav
    ├── orc_acknowledge1.wav
    ├── death_knight_selected1.wav
    ├── dragon_selected1.wav
    ├── goblin_sapper_selected1.wav
    ├── ogre_selected1.wav
    ├── ogre_mage_selected1.wav
    ├── troll_selected1.wav
    ├── horde_ship_selected1.wav
    └── orc_work_completed.wav
```

---

## Environment Variables

| Variable          | Purpose                        | Default           |
| ----------------- | ------------------------------ | ----------------- |
| `DEBUG_OPENCODE`  | Enable debug logging           | `false`           |
| `SOUNDS_DATA_DIR` | Override data directory        | Platform-specific |
| `SOUNDS_BASE_URL` | Legacy: Base URL for downloads | N/A (bundled)     |

### Usage

```bash
# Enable debug mode
DEBUG_OPENCODE=1 opencode

# Custom data directory
SOUNDS_DATA_DIR=/custom/path opencode
```

---

## API Quick Reference

### Sound Selection

```typescript
import { getRandomSoundPathFromFaction } from './sounds.js';

// Get random sound from faction
const soundPath = getRandomSoundPathFromFaction('alliance');
// Returns: '/path/to/data/alliance/human_selected1.wav'

// Get random sound from both factions
const anySoundPath = getRandomSoundPathFromFaction('both');
```

### Configuration

```typescript
import { loadPluginConfig } from './plugin-config.js';

// Load plugin configuration
const config = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
// Returns: { faction?: 'alliance' | 'horde' | 'both', soundsDir?: string }
```

### Sound Validation

```typescript
import { soundExists } from './sounds.js';

// Check if sound exists
const exists = await soundExists('human_selected1.wav', 'alliance');
// Returns: boolean
```

### Bundled Sounds

```typescript
import { installBundledSoundsIfMissing } from './bundled-sounds.js';

// Install bundled sounds if missing
await installBundledSoundsIfMissing('/custom/data/dir');
```

---

## Configuration Schema

### Full Configuration Example

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "both",
    "soundsDir": "/custom/path/to/sounds"
  }
}
```

### Schema Definition

```typescript
interface WarcraftNotificationConfig {
  /** Which faction sounds to use */
  faction?: 'alliance' | 'horde' | 'both';

  /** Custom directory for sound files */
  soundsDir?: string;
}
```

### Validation

Configuration is validated using Zod:

```typescript
const WarcraftNotificationConfigSchema = z.object({
  soundsDir: z.string().optional(),
  faction: z.enum(['alliance', 'horde', 'both']).optional(),
});
```

---

## Troubleshooting Quick Fixes

### No Sound Playing

```bash
# Check sound files exist
ls -la ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/sounds/

# Reinstall plugin
cd ~ && sed -i.bak '/"@pantheon-ai\/opencode-warcraft-notifications"/d' .cache/opencode/package.json
rm -rf .cache/opencode/node_modules/@pantheon-ai/opencode-warcraft-notifications
opencode
```

### Configuration Not Working

```bash
# Verify configuration file
cat ~/.config/opencode/plugin.json

# Check for validation errors
DEBUG_OPENCODE=1 opencode
```

### macOS Audio Issues

```bash
# Test audio manually
afplay /System/Library/Sounds/Glass.aiff

# Check permissions
ls -la ~/Library/Application\ Support/opencode/
```

### Linux Audio Issues

```bash
# Test audio manually
canberra-gtk-play --id=message

# Install audio tools if missing
sudo apt-get install libcanberra-gtk-module
```

---

## Platform-Specific Commands

### macOS

```bash
# Play sound
afplay /path/to/sound.wav

# Show notification
osascript -e 'display notification "message" with title "title"'

# Check data directory
ls -la ~/Library/Application\ Support/opencode/storage/plugin/opencode-warcraft-notifications/sounds/
```

### Linux

```bash
# Play sound
canberra-gtk-play --id=message

# Show notification
notify-send 'title' 'message'

# Check data directory
ls -la ~/.local/share/opencode/storage/plugin/opencode-warcraft-notifications/sounds/
```

---

## Git Workflow

### Create Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(sounds): add rare sound category"

# Push to fork
git push origin feature/your-feature-name
```

### Conventional Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements

---

## CI/CD Quick Reference

### Workflows

| Workflow                | Trigger                | Purpose                    |
| ----------------------- | ---------------------- | -------------------------- |
| PR Validation           | Pull request           | Run tests and linting      |
| Smart Version Bump      | Push to main           | Determine version bump     |
| Release & Publish       | Version bump PR merged | Create release and publish |
| Auto-Merge Bot          | PR approved            | Auto-merge approved PRs    |
| Cleanup Merged Branches | Branch merged          | Delete merged branches     |
| Cleanup Old Releases    | Schedule               | Remove old releases        |
| Deploy Docs             | Push to main           | Deploy documentation       |

### Manual Workflow Triggers

```bash
# Trigger workflow manually (GitHub CLI)
gh workflow run smart-version-bump.yml

# View workflow runs
gh run list

# View workflow details
gh run view <run-id>
```

---

## Useful Links

### Documentation

- [Home](/) - Project overview
- [User Guide](/user-guide/) - Installation and usage
- [Development Guide](/development/) - Development setup
- [API Documentation](/api/) - API reference
- [Architecture](/architecture/) - System design
- [Troubleshooting](/troubleshooting/) - Common issues

### External Resources

- [GitHub Repository](https://github.com/pantheon-org/opencode-warcraft-notifications)
- [npm Package](https://www.npmjs.com/package/@pantheon-ai/opencode-warcraft-notifications)
- [OpenCode Documentation](https://opencode.ai/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Bun Documentation](https://bun.sh/)

---

## Keyboard Shortcuts (Documentation Site)

| Shortcut       | Action               |
| -------------- | -------------------- |
| `/`            | Focus search         |
| `Ctrl/Cmd + K` | Open command palette |
| `Esc`          | Close search/modals  |

---

_"Work complete!"_ - Warcraft II Peasant  
_"Zug zug!"_ - Warcraft II Orc

**Last Updated**: 2025-11-11
