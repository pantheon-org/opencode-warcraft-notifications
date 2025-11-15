# Blocky Text to SVG Library

A TypeScript utility for converting text to blocky, pixel-art style SVG graphics matching the OpenCode.ai aesthetic.

## Features

- **Pixel-perfect blocky letters** - 6x6 grid per character
- **Three-tone color palette** - Configurable light, medium, and dark colors
- **Type-safe** - Full TypeScript support
- **Customizable** - Block size and character spacing options
- **Zero dependencies** - Pure TypeScript implementation

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

Currently supports: A, C, E, F, I, N, O, R, T, W, and space

## Adding New Characters

To add a new character to the font, add an entry to the `FONT` object in `blocky-text-to-svg.ts`:

```typescript
'B': [
  [2, 2, 2, 2, 0, 0],  // Row 0
  [2, 1, 0, 0, 2, 0],  // Row 1
  [2, 2, 2, 2, 0, 0],  // Row 2
  [2, 1, 0, 0, 2, 0],  // Row 3
  [2, 1, 0, 0, 2, 0],  // Row 4
  [2, 2, 2, 2, 0, 0],  // Row 5
],
```

**Values:**

- `0` = Empty (transparent)
- `1` = Light color (highlights)
- `2` = Medium color (structure)
- `3` = Dark color (shadows/depth)

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

Each character is designed on a 6x6 grid with three tones to create depth and a 3D blocky appearance. The letters follow these principles:

1. **Light tones** - Used for top-left areas and highlights
2. **Medium tones** - Used for primary structure and edges
3. **Dark tones** - Used for shadows and inner depth

This creates a consistent, retro pixel-art aesthetic across all characters.
