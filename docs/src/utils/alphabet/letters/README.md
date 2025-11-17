# Letter Glyphs (A-Z)

This directory contains the individual glyph definitions for all 26 uppercase letters (A-Z) used in the blocky text rendering system.

> **Note**: For general information about the glyph system, see [`../README.md`](../README.md). For symbol glyphs, see [`../symbols/README.md`](../symbols/README.md).

## Overview

Each letter is defined as a `Glyph` object that represents the visual appearance of the character using a 7-row grid system. These glyphs are combined to render text in a blocky, pixel-art style.

## Letter Set

All 26 uppercase letters are available with varying widths for visual proportion:

### Narrow Letters (1-2 columns)

- **I** (1 column): Vertical line with top serif and gap
- **J** (3 columns): Hook shape with descender

### Regular Letters (3-4 columns)

- **A, B, C, D, E, F, G, H, K, L, N, O, P, Q, R, S, T, U, V, X, Y, Z**

### Wide Letters (5 columns)

- **M**: Wide M-shape with central peak
- **W**: Wide W-shape with central valley

## File Structure

Each letter file follows a consistent pattern:

```typescript
import { type Glyph } from '../types';

/**
 * Glyph definition for the letter '[X]'.
 *
 * [Detailed description]
 *
 * ## Visual Representation
 * [ASCII grid showing the letter]
 *
 * ## Grid Details
 * - Width: [N] columns
 * - Height: 7 rows (standard)
 * - Color zones: [description]
 *
 * ## Character Design
 * [Design rationale]
 *
 * @type {Glyph}
 * @example [usage examples]
 * @see [related references]
 */
export const letter[X]: Glyph = {
  rows: {
    0: [/* row 0 cells */],
    1: [/* row 1 cells */],
    2: [/* row 2 cells */],
    3: [/* row 3 cells */],
    4: [/* row 4 cells */],
    5: [/* row 5 cells */],
    6: [/* row 6 cells */],
  },
};
```

## Letter Examples

### Letter A (Regular Width - 4 columns)

```typescript
export const letterA: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [0, 0, 0, 1], // Right side (primary)
    3: [1, 1, 1, 1], // Middle bar (secondary)
    4: [1, 0, 0, 1], // Sides (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
```

Visual representation:

```
+---+---+---+---+
|   |   |   |   |  Row 0 (padding)
+---+---+---+---+
| █ | █ | █ | █ |  Row 1 (PRIMARY)
+---+---+---+---+
|   |   |   | █ |  Row 2 (PRIMARY)
+---+---+---+---+
| █ | █ | █ | █ |  Row 3 (SECONDARY)
+---+---+---+---+
| █ |   |   | █ |  Row 4 (SECONDARY)
+---+---+---+---+
| █ | █ | █ | █ |  Row 5 (SECONDARY)
+---+---+---+---+
|   |   |   |   |  Row 6 (padding)
+---+---+---+---+
```

### Letter I (Narrow - 1 column)

```typescript
export const letterI: Glyph = {
  rows: {
    0: [1], // Top serif (primary)
    1: [0], // Gap for spacing
    2: [1], // Upper stem (primary)
    3: [1], // Middle stem (secondary)
    4: [1], // Lower stem (secondary)
    5: [1], // Bottom stem (secondary)
    6: [0], // Bottom padding
  },
};
```

Visual representation:

```
+---+
| █ |  Row 0 (PRIMARY)
+---+
|   |  Row 1 (gap)
+---+
| █ |  Row 2 (PRIMARY)
+---+
| █ |  Row 3 (SECONDARY)
+---+
| █ |  Row 4 (SECONDARY)
+---+
| █ |  Row 5 (SECONDARY)
+---+
|   |  Row 6 (padding)
+---+
```

### Letter M (Wide - 5 columns)

```typescript
export const letterM: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 1, 0, 1], // M shape upper (primary)
    3: [1, 0, 1, 0, 1], // M shape middle (secondary)
    4: [1, 0, 0, 0, 1], // Sides (secondary)
    5: [1, 0, 0, 0, 1], // Sides bottom (secondary)
    6: [0, 0, 0, 0, 0], // Bottom padding
  },
};
```

Visual representation:

```
+---+---+---+---+---+
|   |   |   |   |   |  Row 0 (padding)
+---+---+---+---+---+
| █ | █ | █ | █ | █ |  Row 1 (PRIMARY)
+---+---+---+---+---+
| █ |   | █ |   | █ |  Row 2 (PRIMARY)
+---+---+---+---+---+
| █ |   | █ |   | █ |  Row 3 (SECONDARY)
+---+---+---+---+---+
| █ |   |   |   | █ |  Row 4 (SECONDARY)
+---+---+---+---+---+
| █ |   |   |   | █ |  Row 5 (SECONDARY)
+---+---+---+---+---+
|   |   |   |   |   |  Row 6 (padding)
+---+---+---+---+---+
```

## Usage

### Accessing Letter Glyphs

```typescript
import { ALPHABET } from '../types';
import { letterA } from './letter-a';

// Access from ALPHABET constant
const glyphA = ALPHABET.A;
const glyphH = ALPHABET.H;
const glyphZ = ALPHABET.Z;

// Or import directly
const glyph = letterA;
```

### Rendering Text

```typescript
import { textToBlocks } from '../block';

// Convert text to blocks
const blocks = textToBlocks('HELLO');

// The function automatically:
// 1. Converts to uppercase
// 2. Looks up each letter in ALPHABET
// 3. Converts grids to positioned blocks
// 4. Applies colors based on row position
```

## Letter Characteristics

### Design Patterns

1. **Top Bar**: Many letters (A, E, F, H, etc.) start with a horizontal bar at row 1
2. **Vertical Stems**: Letters like I, J, L use single-column stems
3. **Curves**: Letters like O, C, Q use filled rectangles to approximate curves
4. **Diagonals**: Letters like V, W, X, Z use stepped patterns for diagonal lines
5. **Enclosed Spaces**: Letters like A, B, D, O, P, Q, R have internal empty spaces

### Common Row Patterns

- **Row 0**: Usually empty for top padding
- **Rows 1-2**: Upper portion of letter (PRIMARY color)
- **Row 3**: Transition row (SECONDARY color) - often has crossbars
- **Rows 4-5**: Lower portion of letter (SECONDARY color)
- **Row 6**: Usually empty for bottom padding, except descenders (J, Q, Y)

## Letter Reference

All 26 letters with their widths:

| Letter | Width | Notes                                   |
| ------ | ----- | --------------------------------------- |
| A      | 4     | Top bar with crossbar                   |
| B      | 4     | Left stem with double bulges            |
| C      | 4     | Open right side                         |
| D      | 4     | Left stem with right bulge              |
| E      | 4     | Left stem with three horizontal bars    |
| F      | 4     | Left stem with two top horizontal bars  |
| G      | 4     | C-shape with bottom-right extension     |
| H      | 4     | Two stems with crossbar                 |
| I      | 1     | Single vertical line with top serif     |
| J      | 3     | Hook shape with descender               |
| K      | 4     | Left stem with diagonal branches        |
| L      | 3     | Left stem with bottom bar               |
| M      | 5     | Wide M-shape with central peak          |
| N      | 4     | Two stems with diagonal connector       |
| O      | 4     | Enclosed rectangle                      |
| P      | 4     | Left stem with top bulge, descends to 6 |
| Q      | 4     | O with bottom-right extension, descends |
| R      | 4     | P with diagonal leg                     |
| S      | 4     | S-curve using stacked horizontal bars   |
| T      | 4     | Top bar with center stem                |
| U      | 4     | Two stems connected at bottom           |
| V      | 5     | Wide V-shape converging downward        |
| W      | 5     | Wide W-shape with central valley        |
| X      | 5     | Crossed diagonals                       |
| Y      | 4     | Y-shape with descender stem             |
| Z      | 3     | Z-shape with diagonal                   |

## Design Guidelines for Letters

When creating or modifying letter glyphs:

1. **Maintain proportions**: Keep visual weight balanced
2. **Use consistent stroke width**: Typically 1 cell, occasionally 2 for emphasis
3. **Respect color zones**: PRIMARY (rows 0-2, 6), SECONDARY (rows 3-5)
4. **Top/bottom padding**: Use rows 0 and 6 for spacing, except special cases
5. **Readability first**: Ensure letters are recognizable at small sizes
6. **Width consistency**: Similar-shaped letters should have similar widths
7. **Test in context**: Verify letters look good next to each other

## Related Files

- **[`../README.md`](../README.md)**: Overall glyph system documentation
- **[`../types.ts`](../types.ts)**: Type definitions and ALPHABET constant
- **[`../symbols/README.md`](../symbols/README.md)**: Symbol glyph documentation
- **[`../block.ts`](../block.ts)**: Rendering utilities
- **[`../theme.ts`](../theme.ts)**: Color theme definitions
- **[`../letters.test.ts`](../letters.test.ts)**: Letter tests

## Contributing

When adding or modifying a letter:

1. **Follow naming**: `letter-[x].ts` with export `letter[X]`
2. **Include full documentation**: JSDoc with visual representation
3. **Update ALPHABET**: Add to the constant in `../types.ts`
4. **Update LetterName type**: Add to the union type if new letter
5. **Test thoroughly**: Verify appearance in SVG samples
6. **Check consistency**: Compare with similar letters for proportions

## Testing

Letter glyphs are validated in `../letters.test.ts` and `../types.test.ts`:

```bash
bun test
```

Tests verify:

- All 26 letters are present in ALPHABET
- Each letter has 7 rows
- Each row has 1-5 columns
- Cells contain only 0 or 1 values
- Glyphs are properly exported

## Visual Examples

See rendered examples in:

- `/docs/samples/a-z-test-.svg` - Full alphabet display
- `/docs/samples/hello-world.svg` - HELLO WORLD example
- `/docs/samples/opencode.svg` - OPENCODE logo
- `/docs/samples/warcraft.svg` - WARCRAFT text
