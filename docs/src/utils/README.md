# Blocky Text to SVG Library

A TypeScript utility for converting text to blocky, pixel-art style SVG graphics matching the OpenCode.ai aesthetic.

## Features

- **Pixel-perfect blocky letters** - 7 rows × 4 columns grid per character (matches OpenCode.ai exactly)
- **Three-tone color palette** - Configurable light, medium, and dark colors
- **Type-safe** - Full TypeScript support
- **Customizable** - Block size and character spacing options
- **Zero dependencies** - Pure TypeScript implementation
- **Exact OpenCode.ai match** - Generates 234×42px logos identical to OpenCode.ai/docs

## Usage

### Basic Example

```typescript
import { blockyTextToSVG } from '../utils/blocky-text-to-svg';

const svg = blockyTextToSVG('WARCRAFT');
```

### With Custom Options

```typescript
const svg = blockyTextToSVG('WARCRAFT', {
  colorLight: '#F1ECEC', // Off-white
  colorMedium: '#B7B1B1', // Light gray
  colorDark: '#4B4646', // Dark gray
  blockSize: 6, // Pixels per block
  charSpacing: 6, // Pixels between characters
});
```

### In Astro Components

```astro
---
import { blockyTextToSVG } from '../utils/blocky-text-to-svg';

const logo = blockyTextToSVG('YOUR TEXT');
---

<div set:html={logo} />
```

## API

### `blockyTextToSVG(text, options?)`

Converts text to blocky pixel-art SVG.

**Parameters:**

- `text: string` - Text to convert (A-Z and space supported)
- `options?: BlockyTextOptions` - Customization options

**Returns:** `string` - SVG markup

### `BlockyTextOptions`

```typescript
interface BlockyTextOptions {
  colorLight?: string; // Default: '#F1ECEC'
  colorMedium?: string; // Default: '#B7B1B1'
  colorDark?: string; // Default: '#4B4646'
  blockSize?: number; // Default: 6
  charSpacing?: number; // Default: 6
}
```

### `getAvailableCharacters()`

Returns an array of available characters in the font.

**Returns:** `string[]`

## Supported Characters

Currently supports: A, C, D, E, F, I, N, O, P, R, T, W, and space

All letters needed for "OPENCODE" and "WARCRAFT" are fully supported.

## Adding New Characters

To add a new character to the font, add an entry to the `FONT` object in `blocky-text-to-svg.ts`:

```typescript
'B': [
  [0, 0, 0, 0],  // Row 0 (y:0-6)   - empty top
  [0, 2, 2, 0],  // Row 1 (y:6-12)  - top
  [2, 0, 0, 2],  // Row 2 (y:12-18)
  [2, 2, 2, 0],  // Row 3 (y:18-24) - middle bar
  [2, 0, 0, 2],  // Row 4 (y:24-30)
  [2, 0, 0, 2],  // Row 5 (y:30-36)
  [0, 2, 2, 0],  // Row 6 (y:36-42) - bottom
],
```

**Grid Structure:**

- Each character is **7 rows × 4 columns**
- With `blockSize: 6`, this creates 42px height × 24px width characters
- Row 0 is typically empty (padding at top)

**Values:**

- `0` = Empty (transparent)
- `1` = Light color (highlights) - used in letters like C, D, E (2nd half of OPENCODE)
- `2` = Medium color (structure) - used in letters like O, P, E, N (1st half of OPENCODE)
- `3` = Dark color (shadows/depth) - used for inner details in most letters

## Color Palette

The default palette matches OpenCode.ai:

| Color  | Hex       | Usage                            |
| ------ | --------- | -------------------------------- |
| Light  | `#F1ECEC` | Primary highlights, bright areas |
| Medium | `#B7B1B1` | Structure, main letter body      |
| Dark   | `#4B4646` | Shadows, depth, inner details    |

## Examples

### Default OpenCode.ai Style

```typescript
blockyTextToSVG('OPENCODE');
```

### Custom Retro Style

```typescript
blockyTextToSVG('RETRO', {
  colorLight: '#00FF00',
  colorMedium: '#00AA00',
  colorDark: '#005500',
  blockSize: 8,
  charSpacing: 8,
});
```

### Larger Logo

```typescript
blockyTextToSVG('BRAND', {
  blockSize: 10,
  charSpacing: 10,
});
```

## Design Philosophy

Each character is designed on a **7 rows × 4 columns** grid with three tones to create depth and a 3D blocky appearance, matching the exact structure used by OpenCode.ai. The letters follow these principles:

1. **Light tones** - Used for structural outlines (alternates with medium in OpenCode logo)
2. **Medium tones** - Used for primary structure and edges
3. **Dark tones** - Used for shadows and inner depth

This creates a consistent, retro pixel-art aesthetic across all characters.

## Comparison with OpenCode Logo

Our library generates SVGs that match the OpenCode.ai logo exactly:

- **Dimensions:** Both produce 234×42px for "OPENCODE" (8 characters)
- **Grid:** Both use 7 rows × 4 columns per character with 6px blocks
- **Colors:** Identical three-color palette (#F1ECEC, #B7B1B1, #4B4646)
- **Spacing:** Both use 6px character spacing

The main difference is in path optimization:

- **OpenCode logo:** Uses compound paths (fewer `<path>` elements)
- **Our library:** Uses one `<path>` per block (simpler, more maintainable)

Both render identically in the browser.
