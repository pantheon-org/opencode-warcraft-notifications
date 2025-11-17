# Glyph Letter Definitions

This directory contains the individual glyph definitions for all 26 letters (A-Z) used in the blocky text rendering system.

## Overview

Each letter is defined as a `Glyph` object that represents the visual appearance of the character using a 7-row grid system. These glyphs are used by the text rendering utilities to generate blocky, pixel-art style text suitable for logos and headers.

## What is a Glyph?

A **Glyph** is a visual representation of a single character using a grid-based system:

- **7 rows** (indexed 0-6) for consistent character height
- **1-5 columns** per row (width varies by letter)
- **Binary values** (0 or 1) for each cell:
  - `0` = Empty/blank cell (no visual representation)
  - `1` = Filled cell (rendered with PRIMARY or SECONDARY color)

### Color Assignment

Filled cells (`1`) are automatically assigned colors based on their row position:

- **Rows 0-2 and 6**: PRIMARY color (main foreground color)
- **Rows 3-5**: SECONDARY color (accent color for depth and shading)

This automatic assignment creates visual depth and character to the rendered text.

## Grid System

The 7-row grid system is structured as follows:

```
Row 0: Top padding/ascender space (often empty)
Row 1: Upper portion of character
Row 2: Upper-middle portion
Row 3: Middle portion (switches to secondary color)
Row 4: Lower-middle portion
Row 5: Bottom portion
Row 6: Bottom padding/descender space (often empty)
```

### Width Variations

Different letters have different widths to maintain visual proportion:

| Width       | Letters                                                          | Columns |
| ----------- | ---------------------------------------------------------------- | ------- |
| **Narrow**  | I, J                                                             | 1-2     |
| **Regular** | A, B, C, D, E, F, G, H, K, L, N, O, P, Q, R, S, T, U, V, X, Y, Z | 3-4     |
| **Wide**    | M, W                                                             | 5       |

## File Structure

Each letter file follows a consistent pattern:

```typescript
import { type Glyph } from './types';

/**
 * Letter [X] representation
 * @type {Glyph}
 *
 * [Visual ASCII representation of the letter]
 *
 * Example usage:
 * const blocks = textToBlocks('[X]');
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

## Example Glyph Definitions

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
| █ | █ | █ | █ |  Row 1 (primary)
+---+---+---+---+
|   |   |   | █ |  Row 2 (primary)
+---+---+---+---+
| █ | █ | █ | █ |  Row 3 (secondary)
+---+---+---+---+
| █ |   |   | █ |  Row 4 (secondary)
+---+---+---+---+
| █ | █ | █ | █ |  Row 5 (secondary)
+---+---+---+---+
|   |   |   |   |  Row 6 (padding)
+---+---+---+---+
```

### Letter I (Narrow - 1 column)

```typescript
export const letterI: Glyph = {
  rows: {
    0: [1], // Top (primary)
    1: [0], // Gap
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
| █ |  Row 0 (primary)
+---+
|   |  Row 1 (gap)
+---+
| █ |  Row 2 (primary)
+---+
| █ |  Row 3 (secondary)
+---+
| █ |  Row 4 (secondary)
+---+
| █ |  Row 5 (secondary)
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
| █ | █ | █ | █ | █ |  Row 1 (primary)
+---+---+---+---+---+
| █ |   | █ |   | █ |  Row 2 (primary)
+---+---+---+---+---+
| █ |   | █ |   | █ |  Row 3 (secondary)
+---+---+---+---+---+
| █ |   |   |   | █ |  Row 4 (secondary)
+---+---+---+---+---+
| █ |   |   |   | █ |  Row 5 (secondary)
+---+---+---+---+---+
|   |   |   |   |   |  Row 6 (padding)
+---+---+---+---+---+
```

## Usage

These glyph definitions are used by the rendering system to convert text into visual blocks:

```typescript
import { textToBlocks } from '../block';
import { ALPHABET } from '../types';

// Convert text to blocks
const blocks = textToBlocks('HELLO');

// Access individual letter glyphs
const letterH = ALPHABET.H;
const letterE = ALPHABET.E;
```

The `textToBlocks` function:

1. Converts input text to uppercase
2. Looks up each letter's glyph definition
3. Converts the grid to positioned blocks with colors
4. Returns an array of `Block` objects with `x`, `y`, and `color` properties

## Design Guidelines

When creating or modifying glyph definitions:

1. **Use rows 0 and 6 sparingly**: These are typically empty for padding
2. **Maintain consistent stroke width**: Use solid lines for better readability
3. **Balance the character**: Ensure visual weight is distributed evenly
4. **Test readability**: Characters should be recognizable at the intended size
5. **Follow the grid**: Stay within the 7-row height constraint
6. **Consider color transition**: Row 3 marks the transition to secondary color

## Related Files

- **`types.ts`**: Type definitions for `Glyph`, `CellType`, and `LetterName`
- **`../types.ts`**: The `ALPHABET` mapping of all letters to glyphs
- **`../block.ts`**: Rendering utilities that use these glyphs
- **`../theme.ts`**: Color theme definitions and mapping logic

## Testing

All glyph definitions are tested to ensure:

- Each letter has exactly 7 rows (0-6)
- Each cell contains valid values (0 or 1)
- The glyph is properly exported and accessible in the ALPHABET

See `../letters.test.ts` for the test implementation.

## Visual References

For visual examples of rendered text using these glyphs, see:

- `/docs/samples/opencode.svg` - OPENCODE logo
- `/docs/samples/warcraft.svg` - WARCRAFT text
- `/docs/samples/a-z-test-.svg` - Full alphabet test
- `/docs/samples/hello-world.svg` - HELLO WORLD example

## Contributing

When adding a new letter or modifying an existing one:

1. Follow the existing file naming pattern: `letter-[x].ts`
2. Include the visual ASCII representation in the JSDoc comment
3. Ensure the export name follows the pattern: `letter[X]`
4. Test the visual appearance by generating an SVG sample
5. Update tests if necessary
6. Verify the letter renders correctly at different sizes

## Additional Documentation

For more information about the blocky text system:

- See `/docs/BLOCKY-TEXT-README.md` for the full system documentation
- See `types.ts` for detailed type documentation
- See `../block.ts` for rendering implementation details
