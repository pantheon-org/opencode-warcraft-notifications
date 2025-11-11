---
title: 'API Documentation'
description: 'Complete API reference for the plugin'
---

# API Documentation

## Overview

This document provides comprehensive API documentation for the Warcraft II Notifications Plugin. The plugin exposes several modules with public APIs for sound management, configuration, and notification handling.

## Table of Contents

- [Plugin Entry Point](#plugin-entry-point)
- [Notification Module](#notification-module)
- [Schema Validator Module](#schema-validator-module)
- [Plugin Configuration Module](#plugin-configuration-module)
- [Sound Manager Module](#sound-manager-module)
- [Bundled Sounds Module](#bundled-sounds-module)
- [Sound Data Module](#sound-data-module)
- [Type Definitions](#type-definitions)
- [Usage Examples](#usage-examples)

## Notification Module

### `notification.ts`

Core plugin implementation that handles OpenCode events and triggers notifications.

#### `NotificationPlugin`

```typescript
const NotificationPlugin: Plugin = async (ctx: PluginContext) => Promise<PluginHandlers>;
```

**Description**: Main plugin function that initializes the notification system and returns event handlers.

**Parameters**:

- `ctx: PluginContext` - OpenCode plugin context containing:
  - `project` - Project information
  - `client` - OpenCode client interface
  - `$` - Shell command executor
  - `worktree` - Git worktree information

**Returns**: `Promise<PluginHandlers>` - Object containing event handlers

**Event Handlers**:

##### `event()`

```typescript
event: async ({ event }: { event: OpenCodeEvent }) => Promise<void>;
```

Handles OpenCode events:

- **`message.part.updated`**: Captures message text for idle summary

  ```typescript
  {
    type: 'message.part.updated',
    properties: {
      part: {
        type: 'text',
        messageID: string,
        text: string
      }
    }
  }
  ```

- **`session.idle`**: Triggers sound and notification
  ```typescript
  {
    type: 'session.idle';
  }
  ```

**Platform-Specific Behavior**:

**macOS**:

```bash
# Play sound
afplay /path/to/sound.wav

# Display notification
osascript -e 'display notification "summary" with title "opencode"'
```

**Linux**:

```bash
# Play sound
canberra-gtk-play --id=message

# Display notification
notify-send 'opencode' 'summary'
```

#### `getIdleSummary()`

```typescript
const getIdleSummary = (text: string | null) => string | undefined;
```

**Description**: Extracts a concise summary from message text for display in notifications.

**Parameters**:

- `text: string | null` - The message text to extract summary from

**Returns**: `string | undefined` - Extracted summary or undefined if no text

**Behavior**:

1. Looks for `Summary:` or `*Summary:*` pattern at end of text
2. If found, returns the summary text
3. If not found, truncates text to 80 characters
4. Returns undefined if text is null

**Examples**:

```typescript
getIdleSummary('Some text\n*Summary:* Task completed');
// Returns: 'Task completed'

getIdleSummary(
  'This is a very long message that exceeds eighty characters and needs to be truncated',
);
// Returns: 'This is a very long message that exceeds eighty characters and needs to be tr...'

getIdleSummary('Short message');
// Returns: 'Short message'

getIdleSummary(null);
// Returns: undefined
```

---

## Schema Validator Module

### `schema-validator.ts`

Provides runtime validation of plugin configuration against the JSON schema using Zod.

#### Types

##### `ValidationResult`

```typescript
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

**Description**: Result object returned by validation functions.

**Properties**:

- `valid: boolean` - Whether the configuration is valid
- `errors?: string[]` - Critical errors that must be fixed (if invalid)
- `warnings?: string[]` - Non-critical warnings (if any)

#### Functions

##### `validatePluginConfig()`

```typescript
export const validatePluginConfig = (config: unknown): ValidationResult
```

**Description**: Validates plugin configuration against the schema without throwing errors.

**Parameters**:

- `config: unknown` - The configuration object to validate

**Returns**: `ValidationResult` - Validation result with valid flag and any errors or warnings

**Example**:

```typescript
const result = validatePluginConfig({ faction: 'alliance' });
if (result.valid) {
  console.log('Configuration is valid');
} else {
  console.error('Validation errors:', result.errors);
}
```

**Validation Rules**:

- `faction` must be one of: `'alliance'`, `'horde'`, `'both'` (if provided)
- `soundsDir` must be a string (if provided)
- No unrecognized configuration keys are allowed

**Error Examples**:

```typescript
// Invalid faction
validatePluginConfig({ faction: 'night-elf' });
// Returns: { valid: false, errors: ['faction: Invalid enum value. Must be one of: \'alliance\', \'horde\', \'both\''] }

// Wrong type for soundsDir
validatePluginConfig({ soundsDir: 123 });
// Returns: { valid: false, errors: ['soundsDir: Expected string, received undefined'] }

// Unrecognized keys
validatePluginConfig({ faction: 'alliance', unknownKey: 'value' });
// Returns: { valid: false, errors: ['Unrecognized configuration key(s): unknownKey. Only \'soundsDir\' and \'faction\' are allowed.'] }
```

##### `validateAndSanitizeConfig()`

```typescript
export const validateAndSanitizeConfig = (config: unknown): WarcraftNotificationConfig
```

**Description**: Validates configuration and returns a typed, sanitized version. Throws error if invalid.

**Parameters**:

- `config: unknown` - The configuration object to validate

**Returns**: `WarcraftNotificationConfig` - Validated and typed configuration object

**Throws**: Error if validation fails with detailed error messages

**Example**:

```typescript
try {
  const config = validateAndSanitizeConfig({ faction: 'alliance' });
  console.log('Using faction:', config.faction); // TypeScript knows config is typed
} catch (error) {
  console.error('Configuration invalid:', error.message);
}
```

**Error Format**:

```
[Warcraft Notifications] Configuration validation failed:
  - faction: Invalid enum value. Must be one of: 'alliance', 'horde', 'both'
  Configuration file: /path/to/.opencode/plugin.json
```

---

## Plugin Configuration Module

### `plugin-config.ts`

Manages plugin configuration loading, validation, and platform-specific directory resolution.

#### Types

##### `Faction`

```typescript
export type Faction = 'alliance' | 'horde' | 'both';
```

**Description**: Represents the available Warcraft II factions.

##### `WarcraftNotificationConfig`

```typescript
export interface WarcraftNotificationConfig {
  soundsDir?: string;
  faction?: Faction;
}
```

**Description**: Configuration interface for the plugin.

**Properties**:

- `soundsDir?: string` - Custom directory for sound file storage
- `faction?: Faction` - Which faction sounds to play (default: 'both')

For schema validation and IDE autocomplete support, see the [Schema Validation Guide](/validate-schema/).

#### Functions

##### `getConfigDir()`

```typescript
export const getConfigDir = (): string
```

**Description**: Returns the appropriate configuration directory based on the operating system.

**Returns**: `string` - Configuration directory path

**Platform-Specific Paths**:

- **macOS**: `~/.config`
- **Windows**: `%APPDATA%` or `~/AppData/Roaming`
- **Linux**: `$XDG_CONFIG_HOME` or `~/.config`

**Example**:

```typescript
const configDir = getConfigDir();
// macOS: '/Users/username/.config'
// Linux: '/home/username/.config'
// Windows: 'C:\Users\username\AppData\Roaming'
```

##### `getDefaultSoundsDir()`

```typescript
export const getDefaultSoundsDir = (): string
```

**Description**: Returns the default sounds directory location based on platform and package name.

**Returns**: `string` - Default sounds directory path

**Platform-Specific Paths**:

- **macOS**: `~/Library/Application Support/opencode/storage/plugin/<package-name>`
- **Windows**: `%APPDATA%\opencode\storage\plugin\<package-name>`
- **Linux**: `~/.local/share/opencode/storage/plugin/<package-name>`

**Example**:

```typescript
const soundsDir = getDefaultSoundsDir();
// macOS: '/Users/username/Library/Application Support/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications'
// Linux: '/home/username/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications'
```

##### `getDefaultDataDir()`

```typescript
export const getDefaultDataDir = (): string
```

**Description**: Returns the default data directory, honoring `SOUNDS_DATA_DIR` environment variable.

**Returns**: `string` - Default data directory path

**Environment Variables**:

- `SOUNDS_DATA_DIR` - Override default data directory

**Example**:

```typescript
// Without environment variable
const dataDir = getDefaultDataDir();
// Returns: platform-specific default

// With environment variable
process.env.SOUNDS_DATA_DIR = '/custom/path';
const dataDir = getDefaultDataDir();
// Returns: '/custom/path'
```

##### `loadPluginConfig()`

```typescript
export const loadPluginConfig = async (pluginName: string): Promise<WarcraftNotificationConfig>
```

**Description**: Loads and validates plugin configuration from plugin.json files with priority order.

**Parameters**:

- `pluginName: string` - Name of the plugin (e.g., '@pantheon-ai/opencode-warcraft-notifications')

**Returns**: `Promise<WarcraftNotificationConfig>` - Validated plugin configuration object

**Throws**: Error if configuration validation fails

**Configuration Priority** (highest to lowest):

1. Project-specific: `<project>/.opencode/plugin.json`
2. Global: `~/.config/opencode/plugin.json`
3. Empty config (uses defaults)

**Validation**: Configuration is automatically validated against the JSON schema. Invalid configurations will throw an error with detailed validation messages.

**Example**:

```typescript
const config = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
// Returns: { soundsDir?: string, faction?: Faction }

// With project config
// .opencode/plugin.json:
// {
//   "@pantheon-ai/opencode-warcraft-notifications": {
//     "soundsDir": "/custom/sounds",
//     "faction": "horde"
//   }
// }
// Returns: { soundsDir: '/custom/sounds', faction: 'horde' }

// With invalid config - throws error:
// {
//   "@pantheon-ai/opencode-warcraft-notifications": {
//     "faction": "invalid"
//   }
// }
// Throws: Error with validation details
```

#### Constants

##### `DEFAULT_DATA_DIR`

```typescript
export const DEFAULT_DATA_DIR: string;
```

**Description**: Default data directory computed at module load time.

**Value**: `process.env.SOUNDS_DATA_DIR ?? getDefaultSoundsDir()`

##### `DEFAULT_BASE_URL`

```typescript
export const DEFAULT_BASE_URL: string;
```

**Description**: Default base URL for downloading sound files (legacy).

**Value**: `process.env.SOUNDS_BASE_URL ?? 'https://www.thanatosrealms.com/war2/sounds/humans'`

---

## Sound Manager Module

### `sounds.ts`

Manages sound file selection, path resolution, and faction-based filtering.

#### Constants

##### `allianceSounds`

```typescript
export const allianceSounds: {
  humanSelected: readonly string[];
  humanAcknowledge: readonly string[];
  dwarfSelected: readonly string[];
  dwarfAcknowledge: readonly string[];
  elfSelected: readonly string[];
  elfAcknowledge: readonly string[];
  knightSelected: readonly string[];
  knightAcknowledge: readonly string[];
  mageSelected: readonly string[];
  mageAcknowledge: readonly string[];
  peasantSelected: readonly string[];
  peasantAcknowledge: readonly string[];
  shipSelected: readonly string[];
  shipAcknowledge: readonly string[];
  special: readonly string[];
};
```

**Description**: Alliance sound categories and their associated sound files.

**Categories**:

- `humanSelected`: Human unit selection sounds (6 files)
- `humanAcknowledge`: Human unit acknowledgment sounds (4 files)
- `dwarfSelected`: Dwarven unit selection sounds (2 files)
- `dwarfAcknowledge`: Dwarven unit acknowledgment sounds (5 files)
- `elfSelected`: Elven unit selection sounds (4 files)
- `elfAcknowledge`: Elven unit acknowledgment sounds (4 files)
- `knightSelected`: Knight selection sounds (4 files)
- `knightAcknowledge`: Knight acknowledgment sounds (4 files)
- `mageSelected`: Mage selection sounds (3 files)
- `mageAcknowledge`: Mage acknowledgment sounds (3 files)
- `peasantSelected`: Peasant selection sounds (4 files)
- `peasantAcknowledge`: Peasant acknowledgment sounds (4 files)
- `shipSelected`: Ship selection sounds (4 files)
- `shipAcknowledge`: Ship acknowledgment sounds (3 files)
- `special`: Special completion sounds (2 files)

##### `hordeSounds`

```typescript
export const hordeSounds: {
  orcSelected: readonly string[];
  orcAcknowledge: readonly string[];
  deathKnightSelected: readonly string[];
  deathKnightAcknowledge: readonly string[];
  dragonSelected: readonly string[];
  dragonAcknowledge: readonly string[];
  goblinSapperSelected: readonly string[];
  goblinSapperAcknowledge: readonly string[];
  ogreSelected: readonly string[];
  ogreAcknowledge: readonly string[];
  ogreMageSelected: readonly string[];
  ogreMageAcknowledge: readonly string[];
  trollSelected: readonly string[];
  trollAcknowledge: readonly string[];
  hordeShipSelected: readonly string[];
  hordeShipAcknowledge: readonly string[];
  special: readonly string[];
};
```

**Description**: Horde sound categories and their associated sound files.

**Categories**:

- `orcSelected`: Orc unit selection sounds (6 files)
- `orcAcknowledge`: Orc unit acknowledgment sounds (4 files)
- `deathKnightSelected`: Death Knight selection sounds (2 files)
- `deathKnightAcknowledge`: Death Knight acknowledgment sounds (3 files)
- `dragonSelected`: Dragon selection sounds (1 file)
- `dragonAcknowledge`: Dragon acknowledgment sounds (2 files)
- `goblinSapperSelected`: Goblin Sapper selection sounds (4 files)
- `goblinSapperAcknowledge`: Goblin Sapper acknowledgment sounds (4 files)
- `ogreSelected`: Ogre selection sounds (4 files)
- `ogreAcknowledge`: Ogre acknowledgment sounds (3 files)
- `ogreMageSelected`: Ogre-Mage selection sounds (4 files)
- `ogreMageAcknowledge`: Ogre-Mage acknowledgment sounds (3 files)
- `trollSelected`: Troll selection sounds (3 files)
- `trollAcknowledge`: Troll acknowledgment sounds (3 files)
- `hordeShipSelected`: Horde Ship selection sounds (4 files)
- `hordeShipAcknowledge`: Horde Ship acknowledgment sounds (3 files)
- `special`: Special completion sounds (1 file)

##### `sounds`

```typescript
export const sounds: typeof allianceSounds & typeof hordeSounds;
```

**Description**: Combined sounds object for backward compatibility.

#### Functions

##### `getSoundPath()`

```typescript
export const getSoundPath = (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string
): string
```

**Description**: Get the full path to a sound file in the faction-specific subdirectory.

**Parameters**:

- `filename: string` - Sound filename (e.g., 'human_selected1.wav')
- `faction: 'alliance' | 'horde'` - Faction the sound belongs to
- `dataDir?: string` - Optional override data directory

**Returns**: `string` - Absolute path to the sound file

**Example**:

```typescript
const path = getSoundPath('human_selected1.wav', 'alliance');
// Returns: '/home/user/.local/share/opencode/storage/plugin/@pantheon-ai/opencode-warcraft-notifications/alliance/human_selected1.wav'

const customPath = getSoundPath('orc_selected1.wav', 'horde', '/custom/sounds');
// Returns: '/custom/sounds/horde/orc_selected1.wav'
```

##### `soundExists()`

```typescript
export const soundExists = async (
  filename: string,
  faction: 'alliance' | 'horde',
  dataDir?: string,
  existsFn?: (path: string) => Promise<boolean>
): Promise<boolean>
```

**Description**: Check whether a sound file exists in the faction-specific data directory.

**Parameters**:

- `filename: string` - Name of the sound file
- `faction: 'alliance' | 'horde'` - Faction the sound belongs to
- `dataDir?: string` - Optional override data directory
- `existsFn?: (path: string) => Promise<boolean>` - Optional custom exists function (for testing)

**Returns**: `Promise<boolean>` - True if the file exists

**Example**:

```typescript
const exists = await soundExists('human_selected1.wav', 'alliance');
// Returns: true or false

const customExists = await soundExists('orc_selected1.wav', 'horde', '/custom/sounds');
// Returns: true or false
```

##### `determineSoundFaction()`

```typescript
export const determineSoundFaction = (filename: string): 'alliance' | 'horde'
```

**Description**: Determine which faction a sound belongs to based on its filename.

**Parameters**:

- `filename: string` - Sound filename

**Returns**: `'alliance' | 'horde'` - The faction the sound belongs to

**Detection Logic**:

- Horde sounds start with: `orc_`, `death_knight_`, `dragon_`, `goblin_sapper_`, `ogre_`, `troll_`, `horde_ship_`
- All other sounds default to Alliance

**Example**:

```typescript
determineSoundFaction('human_selected1.wav');
// Returns: 'alliance'

determineSoundFaction('orc_selected1.wav');
// Returns: 'horde'

determineSoundFaction('death_knight_acknowledge1.wav');
// Returns: 'horde'
```

##### `getSoundsByFaction()`

```typescript
export const getSoundsByFaction = (faction: Faction): string[]
```

**Description**: Get all sound filenames for a specific faction.

**Parameters**:

- `faction: Faction` - The faction to get sounds from ('alliance', 'horde', or 'both')

**Returns**: `string[]` - Array of sound filenames

**Example**:

```typescript
const allianceSounds = getSoundsByFaction('alliance');
// Returns: ['human_selected1.wav', 'human_selected2.wav', ...]

const hordeSounds = getSoundsByFaction('horde');
// Returns: ['orc_selected1.wav', 'orc_selected2.wav', ...]

const allSounds = getSoundsByFaction('both');
// Returns: [...allianceSounds, ...hordeSounds]
```

##### `getRandomSoundFromFaction()`

```typescript
export const getRandomSoundFromFaction = (faction: Faction): string
```

**Description**: Pick a random sound filename from the specified faction(s).

**Parameters**:

- `faction: Faction` - 'alliance', 'horde', or 'both'

**Returns**: `string` - Random sound filename

**Example**:

```typescript
const sound = getRandomSoundFromFaction('alliance');
// Returns: 'human_selected3.wav' (random)

const hordeSound = getRandomSoundFromFaction('horde');
// Returns: 'orc_acknowledge2.wav' (random)

const anySound = getRandomSoundFromFaction('both');
// Returns: any sound from either faction (random)
```

##### `getRandomSoundPathFromFaction()`

```typescript
export const getRandomSoundPathFromFaction = (faction: Faction, dataDir?: string): string
```

**Description**: Pick a random sound from a specific faction and return its full path.

**Parameters**:

- `faction: Faction` - 'alliance', 'horde', or 'both'
- `dataDir?: string` - Optional override data directory

**Returns**: `string` - Absolute path to a random sound file

**Example**:

```typescript
const path = getRandomSoundPathFromFaction('alliance');
// Returns: '/home/user/.local/share/.../alliance/human_selected3.wav' (random)

const customPath = getRandomSoundPathFromFaction('horde', '/custom/sounds');
// Returns: '/custom/sounds/horde/orc_selected1.wav' (random)
```

##### `getRandomSoundFromCategory()`

```typescript
export const getRandomSoundFromCategory = (category: keyof typeof sounds): string
```

**Description**: Pick a random sound from a named category.

**Parameters**:

- `category: keyof typeof sounds` - Category key (e.g., 'humanSelected', 'orcAcknowledge')

**Returns**: `string` - Random sound filename from the category

**Example**:

```typescript
const sound = getRandomSoundFromCategory('humanSelected');
// Returns: 'human_selected3.wav' (random from humanSelected category)

const orcSound = getRandomSoundFromCategory('orcAcknowledge');
// Returns: 'orc_acknowledge2.wav' (random from orcAcknowledge category)
```

##### `getAllSounds()`

```typescript
export const getAllSounds = (): string[]
```

**Description**: Return a flat list of every known sound filename (backward compatibility).

**Returns**: `string[]` - Array of all sound filenames

**Example**:

```typescript
const allSounds = getAllSounds();
// Returns: ['human_selected1.wav', 'human_selected2.wav', ..., 'orc_selected1.wav', ...]
```

##### `getRandomSound()`

```typescript
export const getRandomSound = (): string
```

**Description**: Pick a random sound filename from the full set (backward compatibility).

**Returns**: `string` - Random sound filename

**Example**:

```typescript
const sound = getRandomSound();
// Returns: any sound from either faction (random)
```

##### `getRandomSoundPath()`

```typescript
export const getRandomSoundPath = (dataDir?: string): string
```

**Description**: Pick a random sound filename and return its resolved path (backward compatibility).

**Parameters**:

- `dataDir?: string` - Optional override data directory

**Returns**: `string` - Absolute path to a random sound file

**Example**:

```typescript
const path = getRandomSoundPath();
// Returns: '/home/user/.local/share/.../alliance/human_selected3.wav' (random)
```

##### `getAllianceSoundCategories()`

```typescript
export const getAllianceSoundCategories = (): (keyof typeof allianceSounds)[]
```

**Description**: Get all Alliance sound category keys.

**Returns**: `(keyof typeof allianceSounds)[]` - Array of category keys

**Example**:

```typescript
const categories = getAllianceSoundCategories();
// Returns: ['humanSelected', 'humanAcknowledge', 'dwarfSelected', ...]
```

##### `getHordeSoundCategories()`

```typescript
export const getHordeSoundCategories = (): (keyof typeof hordeSounds)[]
```

**Description**: Get all Horde sound category keys.

**Returns**: `(keyof typeof hordeSounds)[]` - Array of category keys

**Example**:

```typescript
const categories = getHordeSoundCategories();
// Returns: ['orcSelected', 'orcAcknowledge', 'deathKnightSelected', ...]
```

---

## Bundled Sounds Module

### `bundled-sounds.ts`

Handles installation and verification of bundled sound files.

#### Functions

##### `soundExists()`

```typescript
export const soundExists = async (filename: string, dataDir?: string): Promise<boolean>
```

**Description**: Check whether a bundled sound file exists in the plugin data directory.

**Parameters**:

- `filename: string` - Sound filename
- `dataDir?: string` - Optional override for the base data directory

**Returns**: `Promise<boolean>` - True if the file exists

**Example**:

```typescript
const exists = await soundExists('human_selected1.wav');
// Returns: true or false

const customExists = await soundExists('orc_selected1.wav', '/custom/sounds');
// Returns: true or false
```

##### `ensureSoundAvailable()`

```typescript
export const ensureSoundAvailable = async (
  filename: string,
  dataDir?: string
): Promise<boolean>
```

**Description**: Ensure the given bundled sound is available in the data directory.

**Parameters**:

- `filename: string` - Sound filename
- `dataDir?: string` - Optional override for the base data directory

**Returns**: `Promise<boolean>` - True if the sound is available

**Note**: Currently this simply checks if the file exists. Future implementations may attempt installation from bundled data when missing.

**Example**:

```typescript
const available = await ensureSoundAvailable('human_selected1.wav');
// Returns: true or false
```

##### `installBundledSoundsIfMissing()`

```typescript
export const installBundledSoundsIfMissing = async (dataDir?: string): Promise<void>
```

**Description**: Install bundled sounds from the repository `data/` directory into the user's plugin data directory when missing.

**Parameters**:

- `dataDir?: string` - Optional override for the base data directory

**Returns**: `Promise<void>`

**Behavior**:

- Reads from `<cwd>/data/` directory
- Processes `alliance/` and `horde/` subdirectories
- Copies only `.wav` files
- Never overwrites existing files
- Creates target directories as needed
- Continues on individual file failures

**Directory Structure**:

```
data/
├── alliance/
│   ├── human_selected1.wav
│   ├── knight_acknowledge1.wav
│   └── ...
└── horde/
    ├── orc_selected1.wav
    ├── death_knight_acknowledge1.wav
    └── ...
```

**Target Structure**:

```
<dataDir>/
├── alliance/
│   ├── human_selected1.wav
│   ├── knight_acknowledge1.wav
│   └── ...
└── horde/
    ├── orc_selected1.wav
    ├── death_knight_acknowledge1.wav
    └── ...
```

**Example**:

```typescript
await installBundledSoundsIfMissing();
// Installs sounds to default data directory

await installBundledSoundsIfMissing('/custom/sounds');
// Installs sounds to custom directory
```

##### `getSoundFileList()`

```typescript
export const getSoundFileList = (): string[]
```

**Description**: Return the list of known bundled sound filenames.

**Returns**: `string[]` - Array of bundled sound filenames

**Example**:

```typescript
const sounds = getSoundFileList();
// Returns: ['human_selected1.wav', 'human_selected2.wav', ..., 'orc_selected1.wav', ...]
```

---

## Sound Data Module

### `sound-data/index.ts`

Centralized sound metadata and file list management.

#### Types

```typescript
export type { SoundFile, SoundEntry } from './types.js';
```

#### Functions

##### `buildSoundsToDownload()`

```typescript
export const buildSoundsToDownload = (
  faction: 'alliance' | 'horde',
  baseUrl: string
): SoundFile[]
```

**Description**: Build the list of `SoundFile` objects for a specific faction.

**Parameters**:

- `faction: 'alliance' | 'horde'` - The faction to build sounds for
- `baseUrl: string` - Base URL to prepend to each entry's path

**Returns**: `SoundFile[]` - Array of `SoundFile` objects ready for download

**Note**: Horde sounds use a hardcoded base URL: `https://www.thanatosrealms.com/war2/sounds/orcs`

**Example**:

```typescript
const allianceSounds = buildSoundsToDownload('alliance', 'https://example.com/sounds');
// Returns: [
//   {
//     filename: 'human_selected1.wav',
//     url: 'https://example.com/sounds/human_selected1.wav',
//     description: 'Human unit selected - "Yes, my lord?"',
//     faction: 'alliance',
//     subdirectory: 'alliance'
//   },
//   ...
// ]
```

##### `buildAllSoundsToDownload()`

```typescript
export const buildAllSoundsToDownload = (allianceBaseUrl: string): SoundFile[]
```

**Description**: Build the list of all `SoundFile` objects for both factions.

**Parameters**:

- `allianceBaseUrl: string` - Base URL for Alliance sounds

**Returns**: `SoundFile[]` - Array of `SoundFile` objects for both factions

**Example**:

```typescript
const allSounds = buildAllSoundsToDownload('https://example.com/sounds');
// Returns: [...allianceSounds, ...hordeSounds]
```

##### `getSoundFileList()`

```typescript
export const getSoundFileList = (faction?: 'alliance' | 'horde'): string[]
```

**Description**: Return the list of expected sound filenames for a specific faction.

**Parameters**:

- `faction?: 'alliance' | 'horde'` - Optional faction filter

**Returns**: `string[]` - Array of sound filenames

**Example**:

```typescript
const allianceSounds = getSoundFileList('alliance');
// Returns: ['human_selected1.wav', 'human_selected2.wav', ...]

const hordeSounds = getSoundFileList('horde');
// Returns: ['orc_selected1.wav', 'orc_selected2.wav', ...]

const allSounds = getSoundFileList();
// Returns: [...allianceSounds, ...hordeSounds]
```

##### `getSoundCounts()`

```typescript
export const getSoundCounts = (): {
  alliance: number;
  horde: number;
  total: number;
}
```

**Description**: Get the count of sounds for each faction.

**Returns**: Object with counts for each faction

**Example**:

```typescript
const counts = getSoundCounts();
// Returns: { alliance: 50, horde: 50, total: 100 }
```

---

## Type Definitions

### `sound-data/types.ts`

#### `SoundFile`

```typescript
export interface SoundFile {
  filename: string;
  url: string;
  description: string;
  faction: Faction;
  subdirectory: 'alliance' | 'horde';
}
```

**Description**: Represents a sound file with download metadata.

**Properties**:

- `filename: string` - Sound filename (e.g., 'human_selected1.wav')
- `url: string` - Full URL for downloading the sound
- `description: string` - Human-readable description of the sound
- `faction: Faction` - Faction the sound belongs to
- `subdirectory: 'alliance' | 'horde'` - Subdirectory for organizing sounds

#### `SoundEntry`

```typescript
export interface SoundEntry {
  filename: string;
  path: string;
  description: string;
}
```

**Description**: Represents a sound entry in the sound data catalog.

**Properties**:

- `filename: string` - Sound filename
- `path: string` - Relative path to the sound file
- `description: string` - Human-readable description

---

## Usage Examples

### Basic Plugin Usage

```typescript
// In opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@pantheon-ai/opencode-warcraft-notifications"]
}
```

### Custom Configuration

```typescript
// In .opencode/plugin.json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/custom/sounds/path",
    "faction": "horde"
  }
}
```

### Programmatic Sound Selection

```typescript
import { getRandomSoundFromFaction, getSoundPath } from './src/sounds';

// Get a random Alliance sound
const allianceSound = getRandomSoundFromFaction('alliance');
console.log(allianceSound); // 'human_selected3.wav'

// Get full path to the sound
const soundPath = getSoundPath(allianceSound, 'alliance');
console.log(soundPath); // '/home/user/.local/share/.../alliance/human_selected3.wav'
```

### Checking Sound Availability

```typescript
import { soundExists } from './src/sounds';

// Check if a sound exists
const exists = await soundExists('human_selected1.wav', 'alliance');
if (exists) {
  console.log('Sound is available');
} else {
  console.log('Sound is missing');
}
```

### Installing Bundled Sounds

```typescript
import { installBundledSoundsIfMissing } from './src/bundled-sounds';

// Install sounds to default location
await installBundledSoundsIfMissing();

// Install sounds to custom location
await installBundledSoundsIfMissing('/custom/sounds');
```

### Loading Configuration

```typescript
import { loadPluginConfig } from './src/plugin-config';

// Load plugin configuration
const config = await loadPluginConfig('@pantheon-ai/opencode-warcraft-notifications');
console.log(config.soundsDir); // '/custom/sounds' or undefined
console.log(config.faction); // 'alliance', 'horde', 'both', or undefined
```

### Getting Sound Metadata

```typescript
import { getSoundCounts, getSoundFileList } from './src/sound-data';

// Get sound counts
const counts = getSoundCounts();
console.log(`Alliance: ${counts.alliance}, Horde: ${counts.horde}, Total: ${counts.total}`);

// Get all Alliance sound filenames
const allianceSounds = getSoundFileList('alliance');
console.log(allianceSounds); // ['human_selected1.wav', ...]
```

### Platform-Specific Sound Playback

```typescript
// macOS
import { $ } from 'bun';

const soundPath = '/path/to/sound.wav';
await $`afplay ${soundPath}`;
await $`osascript -e 'display notification "Message" with title "Title"'`;

// Linux
await $`canberra-gtk-play --id=message`;
await $`notify-send 'Title' 'Message'`;
```

---

## Error Handling

### Configuration Loading Errors

```typescript
try {
  const config = await loadPluginConfig(pluginName);
} catch (error) {
  // Configuration loading failed
  // Plugin will use default configuration
  console.warn('Failed to load config:', error);
}
```

### Sound Installation Errors

```typescript
try {
  await installBundledSoundsIfMissing(dataDir);
} catch (error) {
  // Installation failed
  // Plugin will attempt to use existing sounds
  console.error('Failed to install sounds:', error);
}
```

### Sound Playback Errors

```typescript
try {
  const soundPath = getRandomSoundPathFromFaction(faction);
  const exists = await soundExists(filename, faction);

  if (exists) {
    await $`afplay ${soundPath}`;
  } else {
    // Fallback to system sound
    await $`afplay /System/Library/Sounds/Glass.aiff`;
  }
} catch (error) {
  console.error('Failed to play sound:', error);
}
```

---

## Environment Variables

### `SOUNDS_DATA_DIR`

**Description**: Override the default data directory for sound storage.

**Example**:

```bash
export SOUNDS_DATA_DIR=/custom/sounds/path
```

### `SOUNDS_BASE_URL`

**Description**: Override the default base URL for downloading sounds (legacy).

**Example**:

```bash
export SOUNDS_BASE_URL=https://custom-cdn.com/sounds
```

### `DEBUG_OPENCODE`

**Description**: Enable debug logging for troubleshooting.

**Example**:

```bash
export DEBUG_OPENCODE=1
```

---

## Best Practices

### 1. Configuration Management

- Use project-specific configuration for project-specific sound preferences
- Use global configuration for user-wide defaults
- Avoid hardcoding paths in code

### 2. Sound Selection

- Use `getRandomSoundFromFaction()` for faction-specific randomization
- Use `getRandomSoundFromCategory()` for category-specific sounds
- Check sound existence before playback

### 3. Error Handling

- Always provide fallback sounds for missing files
- Log errors with `DEBUG_OPENCODE` enabled
- Handle platform-specific command failures gracefully

### 4. Performance

- Cache sound existence checks to avoid repeated file system operations
- Use lazy loading for sound installation
- Minimize file I/O operations

---

## Related Documentation

- [Architecture Documentation](/architecture/) - System design and components
- [Development Guide](/development/) - Development setup and workflow
- [User Guide](/user-guide/) - End-user documentation
- [Schema Validation Guide](/validate-schema/) - Configuration validation

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Pantheon AI Team
