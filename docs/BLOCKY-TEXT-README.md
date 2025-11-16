# Blocky Text-to-SVG Library

Convert text to blocky, pixel-art style SVG matching the OpenCode.ai aesthetic.

## Overview

This library generates SVG logos in the distinctive OpenCode.ai blocky style. Each character uses a 7-row × 4-column grid with 6px blocks and a three-tone color palette.

## Features

- **Pixel-Perfect OpenCode Logo**: Letters O, P, E, N, C, D decoded directly from the official logo
- **Full Alphabet Support**: Complete A-Z coverage (31 characters total)
- **Three-Tone Color Palette**: Off-white (#F1ECEC), light gray (#B7B1B1), dark gray (#4B4646)
- **Consistent Grid System**: 7 rows × 4 columns per character, 6px blocks, 6px spacing
- **Customizable Options**: Override colors, block size, and character spacing

## Installation

```typescript
import { blockyTextToSVG } from './utils/blocky-text-to-svg';
```

## Basic Usage

```typescript
// Generate simple logo
const svg = blockyTextToSVG('OPENCODE');
// Returns: <svg width="234" height="42">...</svg>

// Use in HTML
document.body.innerHTML = svg;
```

## Available Characters

**Letters (A-Z):** Full uppercase alphabet  
**Punctuation:** Space, -, \_, !, ?

**Total:** 31 characters

```typescript
import { getAvailableCharacters } from './utils/blocky-text-to-svg';

const chars = getAvailableCharacters();
console.log(chars); // [' ', '!', '-', '?', 'A', 'B', 'C', ...]
```

## Custom Options

```typescript
const svg = blockyTextToSVG('HELLO', {
  colorLight: '#FFFFFF', // Off-white highlights
  colorMedium: '#CCCCCC', // Light gray secondary
  colorDark: '#333333', // Dark gray shadows
  blockSize: 8, // Larger 8px blocks
  charSpacing: 8, // More spacing between chars
});
```

## Examples

### Example 1: OpenCode Logo

```typescript
const logo = blockyTextToSVG('OPENCODE');
// Dimensions: 234×42px (pixel-perfect match)
```

### Example 2: Project Name

```typescript
const warcraft = blockyTextToSVG('WARCRAFT');
// Dimensions: 234×42px
```

### Example 3: Full Sentence

```typescript
const hello = blockyTextToSVG('HELLO WORLD');
// Dimensions: 324×42px
```

### Example 4: With Punctuation

```typescript
const question = blockyTextToSVG('QUICK FIX?');
// Dimensions: 294×42px
```

### Example 5: Custom Colors

```typescript
const custom = blockyTextToSVG('CUSTOM', {
  colorLight: '#FFE4E4',
  colorMedium: '#FF9999',
  colorDark: '#CC0000',
});
// Red-themed variation
```

## Dimensions

The library calculates dimensions automatically:

- **Height:** Always 42px (7 rows × 6px)
- **Width:** `charCount × 30px - 6px`
  - Each char: 24px (4 cols × 6px)
  - Spacing: 6px between chars
  - Formula: `(charCount × (24 + 6)) - 6`

| Text        | Characters | Width | Height |
| ----------- | ---------- | ----- | ------ |
| OPENCODE    | 8          | 234px | 42px   |
| HELLO       | 5          | 144px | 42px   |
| HELLO WORLD | 11         | 324px | 42px   |

## Grid System

Each character occupies a 7-row × 4-column grid:

```
Row 0: y=0-6px    (often empty or extends above)
Row 1: y=6-12px   (top section)
Row 2: y=12-18px
Row 3: y=18-24px  (middle section)
Row 4: y=24-30px
Row 5: y=30-36px  (bottom section)
Row 6: y=36-42px  (often empty or extends below)

Col 0: x=0-6px    (left edge)
Col 1: x=6-12px
Col 2: x=12-18px
Col 3: x=18-24px  (right edge)
```

## Color System

Each grid cell can be:

- `0` = Empty (transparent)
- `1` = Light color (#F1ECEC) - For highlights
- `2` = Medium color (#B7B1B1) - Primary color
- `3` = Dark color (#4B4646) - Shadows/depth

Example letter 'O':

```typescript
[
  [0, 0, 0, 0], // Row 0: empty
  [2, 2, 2, 2], // Row 1: full medium
  [2, 3, 3, 2], // Row 2: medium edges + dark center
  [2, 3, 3, 2], // Row 3: hollow center
  [2, 3, 3, 2], // Row 4: hollow center
  [2, 2, 2, 2], // Row 5: full medium
  [0, 0, 0, 0], // Row 6: empty
];
```

## Design Principles

1. **Minimalism**: Simple solid shapes, no gradients
2. **Three-Tone Palette**: Light, medium, dark - that's it
3. **Consistent Grid**: All characters follow 7×4 grid
4. **OpenCode Aesthetic**: Matches official logo exactly

## Technical Details

### SVG Generation Process

1. Convert text to uppercase
2. Look up each character in font definition
3. Convert grid to positioned blocks with colors
4. Generate SVG path elements for each block
5. Calculate total dimensions
6. Return complete SVG string

### Performance

- **Fast Generation**: ~1ms per character
- **Small Output**: ~800 bytes per character
- **No Dependencies**: Pure TypeScript

### Browser Compatibility

Works in all modern browsers supporting SVG (IE9+).

## Sample Files

Visual examples are available in `docs/samples/`:

- `opencode.svg` - Pixel-perfect OpenCode logo reproduction
- `warcraft.svg` - WARCRAFT in blocky style
- `hello-world.svg` - HELLO WORLD example
- `a-z-test-.svg` - Alphabet + punctuation demo
- `quick-fix-.svg` - Question mark and hyphen demo

## Testing

```bash
cd docs
bun test blocky-text-to-svg
# 27 tests, 317 assertions
```

## Future Enhancements

- [ ] Add numbers (0-9)
- [ ] Add more punctuation (: . , @ #)
- [ ] Add lowercase letters
- [ ] Add animation effects
- [ ] Add dark mode color variants
- [ ] Extract as standalone npm package

## Credits

Based on analysis of the official OpenCode.ai logo at:
https://opencode.ai/docs/_astro/logo-dark.DOStV66V.svg

## License

Part of the opencode-warcraft-notifications project.
