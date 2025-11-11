---
title: Plugin Schema
description: JSON schema for plugin configuration
---

# Plugin Configuration Schemas

This directory contains configuration schemas and examples for the Warcraft II Alliance and Horde notifications plugin.

## Files

- **`plugin.json.schema`** - JSON Schema definition for plugin configuration validation
- **`plugin.json.example`** - Example plugin.json configuration file

## Usage

### Using the JSON Schema

You can use the JSON schema for validation and IDE autocompletion by adding a `$schema` reference to your `plugin.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/pantheon-org/opencode-warcraft-notifications/main/docs/schemas/plugin.json.schema",
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/custom/sounds",
    "faction": "both"
  }
}
```

### Configuration Locations

The plugin looks for `plugin.json` files in:

1. **Project-specific**: `.opencode/plugin.json` (in your project root)
2. **Global**: `~/.config/opencode/plugin.json` (or OS-specific config directory)

### Configuration Properties

- **`soundsDir`** (optional): Custom directory path where sound files will be stored and cached
  - If not specified, defaults to `~/.config/opencode/sounds`
  - Can be overridden by the `SOUNDS_DATA_DIR` environment variable

- **`faction`** (optional): Which faction sounds to use
  - Allowed values: `"alliance"`, `"horde"`, `"both"`
  - Default: `"both"` (random selection from both factions)
  - Use `"alliance"` to play only Alliance sounds, `"horde"` to play only Horde sounds
