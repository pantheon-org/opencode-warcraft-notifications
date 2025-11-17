# Alphabet Module - Usage Guide

Complete guide for generating blocky text SVG logos using the new alphabet system.

## Table of Contents

- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Color Themes](#color-themes)
- [Migration Guide](#migration-guide)

---

## Quick Start

### Basic Usage

```typescript
import { blockyTextToSVG } from './alphabet';

// Generate SVG with default settings (light theme, 6px blocks)
const svg = blockyTextToSVG('HELLO WORLD');

// Display in HTML
document.getElementById('logo').innerHTML = svg;
```

**Output dimensions**: Automatically calculated based on text length and character widths

- Height: 42px (7 rows × 6px)
- Width: Variable (depends on characters)

### Custom Styling

```typescript
// Dark theme with larger blocks
const svg = blockyTextToSVG('WARCRAFT', {
  theme: 'dark', // Use dark color scheme
  blockSize: 10, // 10px blocks (default: 6)
  charSpacing: 2, // 2-block spacing between chars (default: 1)
});
```

---

## API Reference

### `blockyTextToSVG(text, options?)`

Converts text to blocky pixel-art SVG.

**Parameters:**

| Parameter             | Type                | Default    | Description                                 |
| --------------------- | ------------------- | ---------- | ------------------------------------------- |
| `text`                | `string`            | _required_ | Text to render (A-Z, symbols: `-\|'"?!`)    |
| `options.theme`       | `'light' \| 'dark'` | `'light'`  | Color theme                                 |
| `options.blockSize`   | `number`            | `6`        | Size of each pixel block in px              |
| `options.charSpacing` | `number`            | `1`        | Spacing between characters (in block units) |

**Returns:** `string` - Complete SVG markup ready to render

**Example:**

```typescript
const svg = blockyTextToSVG('OPENCODE', {
  theme: 'light',
  blockSize: 6,
  charSpacing: 1,
});

console.log(svg);
// <svg width="234" height="42" viewBox="0 0 234 42" ...>
//   <path d="M0 6H6V12H0V6Z" fill="#F1ECEC"/>
//   ...
// </svg>
```

### `textToBlocks(text, options?)`

Converts text to an array of positioned color blocks (for custom rendering).

**Returns:** `Block[]`

```typescript
type Block = {
  x: number; // X position in pixels
  y: number; // Y position in pixels
  color: string; // Hex color code
};
```

**Example:**

```typescript
import { textToBlocks } from './alphabet';

const blocks = textToBlocks('HELLO', {
  theme: 'dark',
  blockSize: 20,
  charSpacing: 2,
});

// Custom rendering (Canvas, WebGL, etc.)
blocks.forEach((block) => {
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x, block.y, 20, 20);
});
```

### Helper Functions

```typescript
import {
  getAvailableCharacters, // Get letters only
  getAvailableSymbols, // Get symbols only
  getAllAvailableCharacters, // Get all characters
} from './alphabet';

getAvailableCharacters();
// ['A', 'B', 'C', ..., 'Z']

getAvailableSymbols();
// ['-', '|', "'", '"', '?', '!']

getAllAvailableCharacters();
// ['A', 'B', ..., 'Z', '-', '|', "'", '"', '?', '!']
```

---

## Examples

### Example 1: Simple Logo

```typescript
import { blockyTextToSVG } from './alphabet';

const logoSVG = blockyTextToSVG('MY LOGO');
document.getElementById('header').innerHTML = logoSVG;
```

### Example 2: Astro Component

```astro
---
import { blockyTextToSVG } from '../utils/alphabet';

const titleSVG = blockyTextToSVG('WARCRAFT', {
  theme: 'light',
  blockSize: 6,
  charSpacing: 1,
});
---

<div set:html={titleSVG} class="site-title" />

<style>
  .site-title :global(svg) {
    width: auto;
    height: 2.5rem;
  }
</style>
```

### Example 3: Dynamic Text with Theme Toggle

```typescript
import { blockyTextToSVG } from './alphabet';

function renderLogo(text: string, isDarkMode: boolean) {
  return blockyTextToSVG(text, {
    theme: isDarkMode ? 'dark' : 'light',
    blockSize: 8,
    charSpacing: 1,
  });
}

// Usage
const logo = renderLogo('HELLO', false); // Light theme
const darkLogo = renderLogo('HELLO', true); // Dark theme
```

### Example 4: Generating SVG Files

```typescript
import { blockyTextToSVG } from './alphabet';
import { writeFileSync } from 'fs';

const samples = ['OPENCODE', 'WARCRAFT', 'HELLO WORLD'];

samples.forEach((text) => {
  const svg = blockyTextToSVG(text);
  const filename = text.replace(/[^A-Z]/g, '-').toLowerCase();
  writeFileSync(`./output/${filename}.svg`, svg);
});
```

---

## Color Themes

The alphabet system supports two built-in themes:

### Light Theme (Default)

```typescript
{
  backgroundColor: '#FFFFFF',
  primaryColor: '#F1ECEC',    // Light gray (rows 0-2, 6)
  secondaryColor: '#B7B1B1',  // Medium gray (rows 3-5)
  tertiaryColor: '#4B4646',   // Dark gray (future use)
}
```

**Visual appearance:** Light characters with subtle depth

### Dark Theme

```typescript
{
  backgroundColor: '#000000',
  primaryColor: '#FFFFFF',    // White (rows 0-2, 6)
  secondaryColor: '#626262',  // Gray (rows 3-5)
  tertiaryColor: '#626262',   // Gray (future use)
}
```

**Visual appearance:** Bright white characters on dark background

### Automatic Color Assignment

Colors are assigned automatically based on row position:

```
Row 0: PRIMARY   (typically padding)
Row 1: PRIMARY   (upper portion)
Row 2: PRIMARY   (upper-middle)
Row 3: SECONDARY (middle - color transition)
Row 4: SECONDARY (lower-middle)
Row 5: SECONDARY (bottom)
Row 6: PRIMARY   (typically padding)
```

This creates natural visual depth without manual color coding.

---

## Migration Guide

### From Old `blocky-text-to-svg.ts`

**OLD API:**

```typescript
import { blockyTextToSVG } from './blocky-text-to-svg';

const svg = blockyTextToSVG('TEXT', {
  colorLight: '#F1ECEC',
  colorMedium: '#B7B1B1',
  colorDark: '#4B4646',
  blockSize: 6,
  charSpacing: 6, // In pixels!
});
```

**NEW API:**

```typescript
import { blockyTextToSVG } from './alphabet';

const svg = blockyTextToSVG('TEXT', {
  theme: 'light', // Replaces explicit colors
  blockSize: 6,
  charSpacing: 1, // Now in block units (1 = 6px)
});
```

### Key Differences

| Aspect                | Old API             | New API                             |
| --------------------- | ------------------- | ----------------------------------- |
| **Colors**            | Explicit RGB values | Theme-based (`'light'` or `'dark'`) |
| **Spacing**           | Pixels (`6` = 6px)  | Block units (`1` = 1 block = 6px)   |
| **Character width**   | Fixed 4 columns     | Variable 1-5 columns                |
| **Color assignment**  | Manual per cell     | Automatic by row                    |
| **Available symbols** | 4 symbols           | 6 symbols                           |

### Spacing Conversion

```typescript
// OLD: charSpacing in pixels
charSpacing: 6; // 6 pixels between characters

// NEW: charSpacing in block units
charSpacing: 1; // 1 block = 6px (with blockSize=6)

// Formula: newCharSpacing = oldCharSpacing / blockSize
// Example: 12px spacing with 6px blocks = 12/6 = 2
```

---

## Performance Tips

1. **Cache SVG output** - Generate once, reuse multiple times
2. **Use appropriate blockSize** - Smaller = more detail, larger = better performance
3. **Limit character spacing** - Excessive spacing increases SVG complexity
4. **Validate text input** - Only A-Z and supported symbols (use `getAllAvailableCharacters()`)

---

## Troubleshooting

### Character not rendering?

```typescript
import { getAllAvailableCharacters } from './alphabet';

const text = 'Hello123'; // Contains unsupported characters
const available = getAllAvailableCharacters();

// Filter to supported characters only
const validText = text
  .toUpperCase()
  .split('')
  .filter((char) => available.includes(char))
  .join('');

const svg = blockyTextToSVG(validText); // 'HELLO'
```

### Wrong dimensions?

The system automatically calculates width based on:

- Number of characters
- Width of each character (1-5 columns)
- Block size
- Character spacing

```typescript
// Manual width calculation
import { calculateWidth } from './alphabet';

const width = calculateWidth('HELLO', {
  theme: 'light',
  blockSize: 6,
  charSpacing: 1,
});

console.log(width); // Actual pixel width
```

### Colors not matching design?

Use the built-in themes or check theme definitions:

```typescript
import { lightTheme, darkTheme } from './alphabet';

console.log(lightTheme);
// {
//   backgroundColor: '#FFFFFF',
//   primaryColor: '#F1ECEC',
//   secondaryColor: '#B7B1B1',
//   tertiaryColor: '#4B4646',
// }
```

---

## Additional Resources

- **[Main README](./README.md)** - Complete glyph system documentation
- **[Letters Documentation](./glyphs/letters/README.md)** - Letter-specific details
- **[Symbols Documentation](./glyphs/symbols/README.md)** - Symbol-specific details
- **[Theme System](./theme.ts)** - Color theme implementation
- **[Block Renderer](./block.ts)** - Rendering implementation

---

## Contributing

See [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for guidelines on adding new glyphs or improving the rendering system.
