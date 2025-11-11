---
title: Architecture
description: System architecture and design
---

# Architecture Documentation

## Overview

The Warcraft II Notifications Plugin is an OpenCode plugin that enhances the development experience by playing authentic Warcraft II unit sounds when the IDE session goes idle. The plugin is built with TypeScript and uses the Bun runtime for optimal performance.

## System Architecture

```mermaid
graph TB
    subgraph "OpenCode Runtime"
        OC[OpenCode Core]
        PE[Plugin Engine]
    end

    subgraph "Plugin Entry Point"
        NP[NotificationPlugin<br/>index.ts]
    end

    subgraph "Core Modules"
        NC[Notification Controller<br/>notification.ts]
        SV[Schema Validator<br/>schema-validator.ts]
        PC[Plugin Config<br/>plugin-config.ts]
        SM[Sound Manager<br/>sounds.ts]
        BS[Bundled Sounds<br/>bundled-sounds.ts]
    end

    subgraph "Sound Data"
        SD[Sound Data Index<br/>sound-data/index.ts]
        AS[Alliance Sounds<br/>sound-data/alliance.ts]
        HS[Horde Sounds<br/>sound-data/horde.ts]
        ST[Sound Types<br/>sound-data/types.ts]
    end

    subgraph "Storage Layer"
        FS[File System]
        DD[Data Directory<br/>~/.local/share/opencode/...]
        BD[Bundled Data<br/>data/alliance/<br/>data/horde/]
    end

    subgraph "Platform Services"
        MAC[macOS<br/>afplay + osascript]
        LIN[Linux<br/>canberra-gtk-play + notify-send]
    end

    OC --> PE
    PE --> NP
    NP --> NC
    NC --> PC
    PC --> SV
    NC --> SM
    NC --> BS
    SM --> SD
    BS --> SD
    SD --> AS
    SD --> HS
    SD --> ST
    BS --> FS
    BS --> DD
    BS --> BD
    NC --> MAC
    NC --> LIN

    style NP fill:#e1f5ff
    style NC fill:#fff3e0
    style SV fill:#ffebee
    style PC fill:#f3e5f5
    style SM fill:#e8f5e9
    style BS fill:#fff9c4
    style SD fill:#fce4ec
```

## Component Architecture

### 1. Plugin Entry Point (`index.ts`)

**Purpose**: Exports the main plugin interface to OpenCode.

**Responsibilities**:

- Export `NotificationPlugin` as the primary plugin interface
- Serve as the entry point for OpenCode plugin loading

**Dependencies**: `notification.ts`

### 2. Notification Controller (`notification.ts`)

**Purpose**: Core plugin logic that orchestrates event handling and notification delivery.

**Key Responsibilities**:

- Listen for OpenCode session idle events
- Load plugin configuration
- Install bundled sounds on first run
- Select random sounds based on faction preference
- Play sounds and display notifications using platform-specific commands
- Extract and format session summaries

**Event Flow**:

```mermaid
sequenceDiagram
    participant OC as OpenCode
    participant NC as Notification Controller
    participant PC as Plugin Config
    participant BS as Bundled Sounds
    participant SM as Sound Manager
    participant OS as Operating System

    OC->>NC: Initialize Plugin
    NC->>PC: Load Configuration
    PC-->>NC: Config (soundsDir, faction)
    NC->>BS: Install Bundled Sounds
    BS->>BS: Check if sounds exist
    BS->>BS: Copy from data/ if missing
    BS-->>NC: Installation Complete

    loop Session Active
        OC->>NC: message.part.updated event
        NC->>NC: Store last message
    end

    OC->>NC: session.idle event
    NC->>NC: Extract summary from last message
    NC->>SM: Get random sound path (faction)
    SM-->>NC: Sound file path
    NC->>BS: Check sound exists
    BS-->>NC: Exists: true/false

    alt Sound exists
        NC->>OS: Play sound (afplay/canberra-gtk-play)
    else Sound missing
        NC->>OS: Play fallback sound
    end

    NC->>OS: Display notification
```

**Configuration Integration**:

- Reads `soundsDir` from plugin configuration
- Reads `faction` preference (alliance/horde/both)
- Falls back to platform-specific defaults

### 3. Schema Validator (`schema-validator.ts`)

**Purpose**: Validates plugin configuration against JSON schema at runtime using Zod.

**Key Responsibilities**:

- Validate configuration structure and values
- Provide detailed, actionable error messages
- Support both error-throwing and non-throwing validation modes
- Ensure type safety for configuration objects

**Validation Flow**:

```mermaid
flowchart LR
    A[Config Object] --> B[validatePluginConfig]
    B --> C{Valid?}
    C -->|Yes| D[Return valid: true]
    C -->|No| E[Format Errors]
    E --> F[Return valid: false, errors]

    style D fill:#4caf50,color:#000
    style F fill:#f44336,color:#fff
```

**Validation Rules**:

- `faction`: Must be `'alliance'`, `'horde'`, or `'both'` (optional)
- `soundsDir`: Must be a string (optional)
- No unrecognized keys allowed (strict mode)

**Error Message Format**:

```
[Warcraft Notifications] Configuration validation failed:
  - faction: Invalid enum value. Must be one of: 'alliance', 'horde', 'both'
  Configuration file: /path/to/.opencode/plugin.json
```

**Performance**: Validation completes in <0.1ms, meeting the <100ms requirement.

### 4. Plugin Configuration (`plugin-config.ts`)

**Purpose**: Manages plugin configuration loading, validation, and default directory resolution.

**Key Features**:

```mermaid
graph LR
    A[Configuration Sources] --> B{Priority Order}
    B -->|1. Highest| C[Project .opencode/plugin.json]
    B -->|2. Medium| D[Global ~/.config/opencode/plugin.json]
    B -->|3. Lowest| E[Platform Defaults]

    E --> F{Platform}
    F -->|macOS| G[~/Library/Application Support/...]
    F -->|Linux| H[~/.local/share/...]
    F -->|Windows| I[%APPDATA%/...]

    style C fill:#4caf50
    style D fill:#ff9800
    style E fill:#2196f3
```

**Configuration Schema**:

```typescript
interface WarcraftNotificationConfig {
  soundsDir?: string; // Custom sound storage directory
  faction?: 'alliance' | 'horde' | 'both'; // Faction preference
}
```

**Platform-Specific Defaults**:

- **macOS**: `~/Library/Application Support/opencode/storage/plugin/<package-name>`
- **Linux**: `~/.local/share/opencode/storage/plugin/<package-name>`
- **Windows** (planned): `%APPDATA%\opencode\storage\plugin\<package-name>`

> **Note**: Windows support is planned for a future release. Currently supported: macOS and Linux.

**Environment Variable Overrides**:

- `SOUNDS_DATA_DIR`: Override default data directory
- `SOUNDS_BASE_URL`: Override download base URL (legacy)

### 5. Sound Manager (`sounds.ts`)

**Purpose**: Manages sound file selection, path resolution, and faction-based filtering.

**Sound Organization**:

```mermaid
graph TB
    subgraph "Alliance Sounds"
        A1[Human Units<br/>6 selected + 4 acknowledge]
        A2[Knights<br/>4 selected + 4 acknowledge]
        A3[Elven Archers<br/>4 selected + 4 acknowledge]
        A4[Dwarven Squad<br/>2 selected + 5 acknowledge]
        A5[Mages<br/>3 selected + 3 acknowledge]
        A6[Peasants<br/>4 selected + 4 acknowledge]
        A7[Ships<br/>4 selected + 3 acknowledge]
        A8[Special<br/>work_completed.wav<br/>jobs_done.wav]
    end

    subgraph "Horde Sounds"
        H1[Orcs<br/>6 selected + 4 acknowledge]
        H2[Death Knights<br/>2 selected + 3 acknowledge]
        H3[Dragons<br/>1 selected + 2 acknowledge]
        H4[Goblin Sappers<br/>4 selected + 4 acknowledge]
        H5[Ogres<br/>4 selected + 3 acknowledge]
        H6[Ogre-Mages<br/>4 selected + 3 acknowledge]
        H7[Trolls<br/>3 selected + 3 acknowledge]
        H8[Horde Ships<br/>4 selected + 3 acknowledge]
        H9[Special<br/>orc_work_completed.wav]
    end

    style A8 fill:#4caf50
    style H9 fill:#f44336
```

**Key Functions**:

- `getRandomSoundFromFaction(faction)`: Select random sound by faction
- `getRandomSoundPathFromFaction(faction, dataDir)`: Get full path to random sound
- `determineSoundFaction(filename)`: Determine faction from filename
- `soundExists(filename, faction, dataDir)`: Check if sound file exists
- `getSoundsByFaction(faction)`: Get all sounds for a faction

**Faction Detection Logic**:

```typescript
// Horde sounds start with specific prefixes
if (
  filename.startsWith('orc_') ||
  filename.startsWith('death_knight_') ||
  filename.startsWith('dragon_') ||
  filename.startsWith('goblin_sapper_') ||
  filename.startsWith('ogre_') ||
  filename.startsWith('troll_') ||
  filename.startsWith('horde_ship_')
) {
  return 'horde';
}
// Default to alliance
return 'alliance';
```

### 6. Bundled Sounds Manager (`bundled-sounds.ts`)

**Purpose**: Handles installation and verification of bundled sound files.

**Installation Flow**:

```mermaid
flowchart TD
    A[Plugin Initialization] --> B{Bundled data/ exists?}
    B -->|No| C[Skip installation]
    B -->|Yes| D[Read data/ directory]
    D --> E{Subdirectories?}
    E -->|Yes| F[Process alliance/ and horde/]
    E -->|No| G[Process root .wav files]

    F --> H{For each .wav file}
    H --> I{File exists in target?}
    I -->|Yes| J[Skip file]
    I -->|No| K[Copy to target faction dir]

    G --> L{Determine faction from filename}
    L --> M[Copy to appropriate faction dir]

    J --> N[Continue]
    K --> N
    M --> N
    N --> O{More files?}
    O -->|Yes| H
    O -->|No| P[Installation Complete]

    style K fill:#4caf50
    style M fill:#4caf50
    style P fill:#2196f3
```

**Key Features**:

- **Non-destructive**: Never overwrites existing files
- **Faction-aware**: Organizes sounds into alliance/ and horde/ subdirectories
- **Idempotent**: Safe to run multiple times
- **Error-tolerant**: Continues on individual file failures

**Directory Structure**:

```
<dataDir>/
├── alliance/
│   ├── human_selected1.wav
│   ├── knight_acknowledge1.wav
│   ├── elf_selected1.wav
│   └── ... (50+ files)
└── horde/
    ├── orc_selected1.wav
    ├── death_knight_acknowledge1.wav
    ├── dragon_selected1.wav
    └── ... (50+ files)
```

### 7. Sound Data Module (`sound-data/`)

**Purpose**: Centralized sound metadata and file list management.

**Module Structure**:

```mermaid
graph TB
    subgraph "Sound Data Module"
        IDX[index.ts<br/>Exports & Utilities]
        TYP[types.ts<br/>Type Definitions]
        ALL[alliance.ts<br/>Alliance Sound Entries]
        HOR[horde.ts<br/>Horde Sound Entries]
    end

    IDX --> TYP
    IDX --> ALL
    IDX --> HOR

    subgraph "Type Definitions"
        SF[SoundFile<br/>filename, url, description,<br/>faction, subdirectory]
        SE[SoundEntry<br/>filename, path, description]
    end

    TYP --> SF
    TYP --> SE

    subgraph "Utility Functions"
        BST[buildSoundsToDownload]
        BAST[buildAllSoundsToDownload]
        GSFL[getSoundFileList]
        GSC[getSoundCounts]
    end

    IDX --> BST
    IDX --> BAST
    IDX --> GSFL
    IDX --> GSC

    style IDX fill:#e1f5ff
    style TYP fill:#fff3e0
    style ALL fill:#e8f5e9
    style HOR fill:#ffebee
```

**Data Structure**:

```typescript
// Alliance sound entry example
{
  filename: 'human_selected1.wav',
  path: 'human_selected1.wav',
  description: 'Human unit selected - "Yes, my lord?"'
}

// Horde sound entry example
{
  filename: 'orc_selected1.wav',
  path: 'orc_selected1.wav',
  description: 'Orc unit selected - "Zug zug!"'
}
```

**Key Functions**:

- `buildSoundsToDownload(faction, baseUrl)`: Build download list for faction
- `buildAllSoundsToDownload(baseUrl)`: Build complete download list
- `getSoundFileList(faction?)`: Get list of expected filenames
- `getSoundCounts()`: Get sound counts by faction

## Data Flow

### Plugin Initialization Flow

```mermaid
sequenceDiagram
    participant OC as OpenCode
    participant NP as NotificationPlugin
    participant PC as PluginConfig
    participant SV as SchemaValidator
    participant BS as BundledSounds
    participant FS as FileSystem

    OC->>NP: Load Plugin
    NP->>PC: loadPluginConfig(pluginName)

    PC->>FS: Check .opencode/plugin.json
    alt Project config exists
        FS-->>PC: Project config
        PC->>SV: validateAndSanitizeConfig(config)
        alt Valid config
            SV-->>PC: Validated config
        else Invalid config
            SV-->>PC: Throw validation error
        end
    else No project config
        PC->>FS: Check ~/.config/opencode/plugin.json
        alt Global config exists
            FS-->>PC: Global config
            PC->>SV: validateAndSanitizeConfig(config)
            SV-->>PC: Validated config
        else No global config
            PC-->>PC: Use platform defaults
        end
    end

    PC-->>NP: Config (soundsDir, faction)

    NP->>BS: installBundledSoundsIfMissing(soundsDir)
    BS->>FS: Check data/ directory

    alt Bundled data exists
        BS->>FS: Read data/alliance/ and data/horde/
        loop For each .wav file
            BS->>FS: Check if file exists in target
            alt File missing
                BS->>FS: Copy file to target
            end
        end
    end

    BS-->>NP: Installation complete
    NP-->>OC: Plugin ready
```

### Idle Notification Flow

```mermaid
sequenceDiagram
    participant OC as OpenCode
    participant NC as NotificationController
    participant SM as SoundManager
    participant BS as BundledSounds
    participant OS as OS Services

    OC->>NC: session.idle event
    NC->>NC: getIdleSummary(lastMessage)
    NC->>SM: getRandomSoundPathFromFaction(faction, dataDir)
    SM->>SM: getRandomSoundFromFaction(faction)
    SM->>SM: determineSoundFaction(filename)
    SM->>SM: getSoundPath(filename, faction, dataDir)
    SM-->>NC: /path/to/faction/sound.wav

    NC->>BS: soundExists(filename, faction, dataDir)
    BS->>BS: Check file system
    BS-->>NC: exists: boolean

    alt macOS
        alt Sound exists
            NC->>OS: afplay /path/to/sound.wav
        else Sound missing
            NC->>OS: afplay /System/Library/Sounds/Glass.aiff
        end
        NC->>OS: osascript display notification
    else Linux
        NC->>OS: canberra-gtk-play --id=message
        NC->>OS: notify-send 'opencode' 'summary'
    end
```

## Platform Integration

### macOS Integration

```mermaid
graph LR
    A[Notification Controller] --> B{macOS Detected}
    B --> C[afplay]
    B --> D[osascript]

    C --> E[Play WAV file]
    D --> F[Display notification]

    E --> G[Audio Output]
    F --> H[Notification Center]

    style C fill:#4caf50
    style D fill:#2196f3
```

**Commands Used**:

```bash
# Play sound
afplay /path/to/sound.wav

# Display notification
osascript -e 'display notification "summary" with title "opencode"'
```

### Linux Integration

```mermaid
graph LR
    A[Notification Controller] --> B{Linux Detected}
    B --> C[canberra-gtk-play]
    B --> D[notify-send]

    C --> E[Play system sound]
    D --> F[Display notification]

    E --> G[Audio Output]
    F --> H[Desktop Notification]

    style C fill:#4caf50
    style D fill:#2196f3
```

**Commands Used**:

```bash
# Play sound
canberra-gtk-play --id=message

# Display notification
notify-send 'opencode' 'summary'
```

## Configuration Precedence

```mermaid
graph TD
    A[Configuration Request] --> B{Project .opencode/plugin.json exists?}
    B -->|Yes| C[Use project config]
    B -->|No| D{Global ~/.config/opencode/plugin.json exists?}
    D -->|Yes| E[Use global config]
    D -->|No| F{SOUNDS_DATA_DIR env var set?}
    F -->|Yes| G[Use env var]
    F -->|No| H[Use platform default]

    C --> I[Merge with defaults]
    E --> I
    G --> I
    H --> I

    I --> J[Final Configuration]

    style C fill:#4caf50
    style E fill:#ff9800
    style G fill:#2196f3
    style H fill:#9e9e9e
```

**Priority Order** (highest to lowest):

1. Project-specific `.opencode/plugin.json` `soundsDir` setting
2. Global `~/.config/opencode/plugin.json` `soundsDir` setting
3. `SOUNDS_DATA_DIR` environment variable
4. Platform-specific default directory

## Testing Architecture

### Test Structure

```mermaid
graph TB
    subgraph "Test Types"
        UT[Unit Tests<br/>*.unit.test.ts]
        IT[Integration Tests<br/>*.test.ts]
        ET[Edge Case Tests<br/>*.edge.test.ts]
        FT[Failure Tests<br/>*.failures.test.ts]
    end

    subgraph "Test Utilities"
        TU[test-utils.ts<br/>Mock helpers]
    end

    subgraph "Test Coverage"
        TC1[Plugin Config Tests]
        TC2[Sound Manager Tests]
        TC3[Bundled Sounds Tests]
        TC4[Notification Tests]
        TC5[Sound Data Tests]
    end

    UT --> TU
    IT --> TU
    ET --> TU
    FT --> TU

    TU --> TC1
    TU --> TC2
    TU --> TC3
    TU --> TC4
    TU --> TC5

    style UT fill:#4caf50
    style IT fill:#2196f3
    style ET fill:#ff9800
    style FT fill:#f44336
```

**Test Categories**:

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test component interactions
- **Edge Case Tests**: Test boundary conditions and unusual inputs
- **Failure Tests**: Test error handling and recovery

**Test Utilities** (`test-utils.ts`):

- Mock file system operations
- Mock environment variables
- Mock platform detection
- Create temporary test directories

## Security Considerations

### File System Security

```mermaid
graph TD
    A[File Operation Request] --> B{Path Validation}
    B -->|Valid| C{Permission Check}
    B -->|Invalid| D[Reject Operation]

    C -->|Allowed| E{Operation Type}
    C -->|Denied| D

    E -->|Read| F[Read File]
    E -->|Write| G{Overwrite Check}

    G -->|File exists| H[Skip Write]
    G -->|File missing| I[Write File]

    F --> J[Success]
    H --> J
    I --> J

    style D fill:#f44336
    style J fill:#4caf50
```

**Security Measures**:

- **No overwrites**: Existing files are never overwritten
- **Directory validation**: All paths are validated before use
- **Permission checks**: File operations respect system permissions
- **No network operations**: All sounds are bundled, no runtime downloads

### Configuration Security

- **No code execution**: Configuration is pure JSON data
- **Path sanitization**: All paths are sanitized before use
- **Environment isolation**: Environment variables are scoped appropriately

## Performance Considerations

### Lazy Loading

```mermaid
graph LR
    A[Plugin Load] --> B[Load Config]
    B --> C[Check Sound Cache]
    C --> D{First Run?}
    D -->|Yes| E[Install Sounds]
    D -->|No| F[Skip Installation]
    E --> G[Ready]
    F --> G

    style E fill:#ff9800
    style F fill:#4caf50
```

**Optimization Strategies**:

- **Sound cache**: Verified sounds are cached to avoid repeated checks
- **Lazy installation**: Sounds are only installed on first run
- **Minimal file I/O**: File operations are minimized and cached

### Memory Management

- **Small footprint**: Plugin maintains minimal state
- **No sound buffering**: Sounds are played directly from disk
- **Efficient data structures**: Sound lists use const arrays

## Extension Points

### Adding New Sounds

```mermaid
flowchart TD
    A[Add New Sound] --> B[Add .wav to data/faction/]
    B --> C[Add entry to sound-data/faction.ts]
    C --> D[Update sound category in sounds.ts]
    D --> E[Run tests]
    E --> F{Tests pass?}
    F -->|Yes| G[Commit changes]
    F -->|No| H[Fix issues]
    H --> E

    style G fill:#4caf50
    style H fill:#f44336
```

### Adding New Factions

To add a new faction (e.g., "neutral"):

1. **Update types** (`plugin-config.ts`):

   ```typescript
   export type Faction = 'alliance' | 'horde' | 'neutral' | 'both';
   ```

2. **Create sound data** (`sound-data/neutral.ts`):

   ```typescript
   export const neutralSoundEntries: SoundEntry[] = [
     { filename: 'neutral_sound1.wav', path: 'neutral_sound1.wav', description: '...' },
   ];
   ```

3. **Update sound manager** (`sounds.ts`):

   ```typescript
   export const neutralSounds = {
     /* ... */
   };
   export const getSoundsByFaction = (faction: Faction): string[] => {
     switch (faction) {
       case 'neutral':
         return Object.values(neutralSounds).flat();
       // ...
     }
   };
   ```

4. **Update bundled sounds** (`bundled-sounds.ts`):
   - Add neutral faction detection logic
   - Update installation to handle neutral/ subdirectory

## Deployment Architecture

### NPM Package Structure

```
@pantheon-ai/opencode-warcraft-notifications/
├── index.ts                 # Entry point
├── src/                     # Source code
│   ├── notification.ts
│   ├── plugin-config.ts
│   ├── sounds.ts
│   ├── bundled-sounds.ts
│   └── sound-data/
├── data/                    # Bundled sounds
│   ├── alliance/
│   └── horde/
├── docs/                    # Documentation
├── package.json
└── README.md
```

### Installation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant OC as OpenCode
    participant NPM as npm Registry
    participant FS as File System

    U->>OC: Add plugin to config
    OC->>NPM: Install @pantheon-ai/opencode-warcraft-notifications
    NPM-->>FS: Download package
    FS-->>OC: Package installed
    OC->>OC: Load plugin
    OC->>FS: Copy bundled sounds to user data dir
    FS-->>OC: Sounds ready
    OC-->>U: Plugin active
```

## Monitoring and Debugging

### Debug Mode

Enable debug logging with:

```bash
DEBUG_OPENCODE=1 opencode
```

**Debug Output**:

- Configuration loading attempts
- Sound installation progress
- File operation results
- Error details

### Common Issues

```mermaid
graph TD
    A[Issue Detected] --> B{Issue Type}
    B -->|Sound not playing| C[Check file exists]
    B -->|Wrong faction| D[Check config]
    B -->|No notification| E[Check platform commands]

    C --> F{File exists?}
    F -->|No| G[Run installation]
    F -->|Yes| H[Check permissions]

    D --> I[Verify plugin.json]
    E --> J[Verify afplay/notify-send]

    style G fill:#ff9800
    style I fill:#2196f3
    style J fill:#4caf50
```

## Future Architecture Considerations

### Potential Enhancements

1. **Custom Sound Packs**
   - Support for user-provided sound packs
   - Sound pack marketplace integration

2. **Advanced Configuration**
   - Per-event sound mapping
   - Volume control
   - Sound categories (selected vs. acknowledge)

3. **Analytics**
   - Track most played sounds
   - Usage statistics
   - Performance metrics

4. **Multi-platform Expansion**
   - Windows support
   - Web-based OpenCode support
   - Mobile notifications

---

## Related Documentation

- [API Documentation](API.md) - Complete technical API reference
- [Development Guide](DEVELOPMENT.md) - Development setup and workflow
- [Deployment Guide](DEPLOYMENT.md) - Installation and operations
- [User Guide](USER_GUIDE.md) - End-user documentation

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Pantheon AI Team
