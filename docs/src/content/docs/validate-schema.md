---
title: 'Schema Validation'
description: 'JSON schema validation guide'
---

# Schema Validation Guide

## Overview

This guide explains how to validate plugin configuration files against the JSON schema to ensure correct configuration syntax and values.

## What is Schema Validation?

Schema validation ensures that your `plugin.json` configuration file:

- Uses correct property names
- Contains valid values (e.g., faction must be "alliance", "horde", or "both")
- Follows the expected structure
- Prevents configuration errors before runtime

### Two Types of Validation

This guide covers **build-time and IDE validation** using the JSON schema file. The plugin also performs **runtime validation** when it loads:

- **Build-time/IDE validation** (this guide): Validates syntax while editing with tools like VS Code
- **Runtime validation**: Automatic validation when the plugin loads (see [Troubleshooting Guide](/troubleshooting#configuration-validation-errors) for runtime errors)

Both types use the same schema definition, ensuring consistency.

## Quick Start

### Validate the Example Configuration

Run the validation script to ensure the example configuration is valid:

```bash
bun run validate:schema
```

Or with npm:

```bash
npm run validate:schema
```

**Expected Output**:

```
OK: example is valid against schema
```

### Validate Your Own Configuration

To validate your own `plugin.json` file:

```bash
node scripts/validate-schema.cjs docs/schemas/plugin.json.schema path/to/your/plugin.json
```

**Examples**:

```bash
# Validate global configuration
node scripts/validate-schema.cjs docs/schemas/plugin.json.schema ~/.config/opencode/plugin.json

# Validate project-specific configuration
node scripts/validate-schema.cjs docs/schemas/plugin.json.schema .opencode/plugin.json
```

## Schema File Reference

### Location

- **Schema**: `docs/schemas/plugin.json.schema`
- **Example**: `docs/schemas/plugin.json.example`

### Schema URL

For IDE autocomplete and validation, reference the schema in your `plugin.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/pantheon-org/opencode-warcraft-notifications/main/docs/schemas/plugin.json.schema",
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/sounds",
    "faction": "both"
  }
}
```

## Configuration Properties

### Valid Properties

#### `soundsDir` (optional)

**Type**: `string`  
**Description**: Directory where sound files should be stored and cached

**Valid Examples**:

```json
"soundsDir": "/home/user/.cache/opencode-warcraft-sounds"
"soundsDir": "/path/to/custom/sounds"
"soundsDir": "C:\\Users\\Username\\AppData\\Local\\OpenCode\\Sounds"
```

**Invalid Examples**:

```json
"soundsDir": 123                    // ❌ Must be a string
"soundsDir": null                   // ❌ Must be a string or omitted
"soundsDir": ""                     // ⚠️ Valid but not recommended
```

#### `faction` (optional)

**Type**: `string`  
**Enum**: `"alliance"`, `"horde"`, `"both"`  
**Default**: `"both"`  
**Description**: Which faction sounds to play

**Valid Examples**:

```json
"faction": "alliance"               // ✅ Play only Alliance sounds
"faction": "horde"                  // ✅ Play only Horde sounds
"faction": "both"                   // ✅ Play both factions (default)
```

**Invalid Examples**:

```json
"faction": "orc"                    // ❌ Not a valid faction
"faction": "ALLIANCE"               // ❌ Must be lowercase
"faction": true                     // ❌ Must be a string
```

## Common Validation Errors

### Error: Invalid Property Name

**Error Message**:

```
INVALID: example does not validate against schema
Errors:
- /@pantheon-ai/opencode-warcraft-notifications additionalProperties must NOT have additional properties
```

**Cause**: Using a property name not defined in the schema

**Example**:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundDirectory": "/path/to/sounds", // ❌ Wrong property name
    "faction": "both"
  }
}
```

**Fix**: Use correct property names

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/sounds", // ✅ Correct property name
    "faction": "both"
  }
}
```

### Error: Invalid Faction Value

**Error Message**:

```
INVALID: example does not validate against schema
Errors:
- /@pantheon-ai/opencode-warcraft-notifications/faction must be equal to one of the allowed values
```

**Cause**: Using an invalid faction value

**Example**:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "orcs" // ❌ Invalid value
  }
}
```

**Fix**: Use valid faction values

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "horde" // ✅ Valid value
  }
}
```

### Error: Wrong Type

**Error Message**:

```
INVALID: example does not validate against schema
Errors:
- /@pantheon-ai/opencode-warcraft-notifications/soundsDir must be string
```

**Cause**: Using wrong data type

**Example**:

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": 123 // ❌ Number instead of string
  }
}
```

**Fix**: Use correct data type

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/path/to/sounds" // ✅ String
  }
}
```

## IDE Integration

### Visual Studio Code

To enable autocomplete and inline validation in VS Code:

1. **Add schema reference** to your `plugin.json`:

   ```json
   {
     "$schema": "https://raw.githubusercontent.com/pantheon-org/opencode-warcraft-notifications/main/docs/schemas/plugin.json.schema",
     "@pantheon-ai/opencode-warcraft-notifications": {
       "soundsDir": "/path/to/sounds",
       "faction": "both"
     }
   }
   ```

2. **Install JSON extension** (if not already installed):
   - Extension: "JSON" by Microsoft (built-in)

3. **Benefits**:
   - Autocomplete for property names
   - Inline validation errors
   - Hover documentation
   - Enum value suggestions

### JetBrains IDEs (IntelliJ, WebStorm, etc.)

JetBrains IDEs automatically detect and use JSON schemas from `$schema` references.

## Valid Configuration Examples

### Example 1: Minimal Configuration (Use Defaults)

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {}
}
```

**Result**: Uses all defaults (faction: "both", platform-specific soundsDir)

### Example 2: Alliance Only

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "faction": "alliance"
  }
}
```

**Result**: Plays only Alliance sounds, default soundsDir

### Example 3: Custom Sound Directory

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/home/user/custom-sounds"
  }
}
```

**Result**: Uses custom directory, both factions (default)

### Example 4: Full Configuration

```json
{
  "@pantheon-ai/opencode-warcraft-notifications": {
    "soundsDir": "/home/user/.cache/opencode-warcraft-sounds",
    "faction": "both"
  }
}
```

**Result**: All options explicitly configured

## Manual Validation

### Using Node.js

```javascript
const fs = require('fs');
const Ajv = require('ajv');

const schema = JSON.parse(fs.readFileSync('docs/schemas/plugin.json.schema', 'utf8'));
const config = JSON.parse(fs.readFileSync('.opencode/plugin.json', 'utf8'));

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

if (validate(config)) {
  console.log('✅ Configuration is valid');
} else {
  console.error('❌ Configuration is invalid:');
  console.error(validate.errors);
}
```

### Using Online Validators

1. Go to [jsonschemavalidator.net](https://www.jsonschemavalidator.net/)
2. Paste the schema from `docs/schemas/plugin.json.schema`
3. Paste your configuration JSON
4. Click "Validate"

## Troubleshooting

### Schema Not Found

**Problem**: IDE can't find schema at GitHub URL

**Solutions**:

1. Use local schema reference:

   ```json
   "$schema": "./docs/schemas/plugin.json.schema"
   ```

2. Wait for GitHub to update cache (may take a few minutes after push)

3. Use raw GitHub URL explicitly

### Validation Script Errors

**Problem**: `node scripts/validate-schema.cjs` fails

**Common Causes**:

1. **Missing AJV dependency**

   ```bash
   bun install ajv
   # or
   npm install ajv
   ```

2. **File not found**

   ```bash
   # Check files exist
   ls -la docs/schemas/plugin.json.schema
   ls -la docs/schemas/plugin.json.example
   ```

3. **Invalid JSON syntax**
   ```bash
   # Validate JSON syntax first
   cat docs/schemas/plugin.json.example | jq .
   ```

### Configuration Ignored

**Problem**: Valid configuration but plugin doesn't use it

**Solutions**:

1. **Check file location**:
   - Project: `.opencode/plugin.json`
   - Global: `~/.config/opencode/plugin.json`

2. **Verify JSON syntax**:

   ```bash
   cat ~/.config/opencode/plugin.json | jq .
   ```

3. **Check plugin name** is exactly:

   ```
   @pantheon-ai/opencode-warcraft-notifications
   ```

4. **Restart OpenCode** after configuration changes

## Testing Your Configuration

### Test Validation Script

```bash
# Test with valid example
bun run validate:schema
# Expected: OK: example is valid against schema

# Test with invalid config
echo '{"@pantheon-ai/opencode-warcraft-notifications":{"faction":"invalid"}}' > /tmp/test.json
node scripts/validate-schema.cjs docs/schemas/plugin.json.schema /tmp/test.json
# Expected: INVALID: example does not validate against schema
```

### Test Configuration Loading

Enable debug mode to see configuration loading:

```bash
DEBUG_OPENCODE=1 opencode
```

Look for log messages showing:

- Configuration file loaded
- soundsDir path
- faction setting

## Related Documentation

- **[Configuration Guide](/user-guide#configuration)** - Complete configuration reference
- **[Schema README](./schemas/README.md)** - Schema documentation overview
- **[API Documentation](/api#plugin-configuration-module)** - Configuration API details
- **[Deployment Guide](/deployment#configuration)** - Configuration deployment

## Resources

- **JSON Schema Specification**: [json-schema.org](https://json-schema.org/)
- **AJV Validator**: [ajv.js.org](https://ajv.js.org/)
- **Online Validator**: [jsonschemavalidator.net](https://www.jsonschemavalidator.net/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-10  
**Maintained By**: Pantheon AI Team
