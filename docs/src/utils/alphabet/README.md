# Blocky Text Glyph System

This directory contains the complete glyph system for the blocky text rendering engine used in the Warcraft Notifications project. The system provides pixel-art style text rendering with letters and symbols.

## Overview

The glyph system consists of:

- **26 Letters (A-Z)**: Uppercase alphabet characters ([`letters/`](./letters/))
- **6 Symbols**: Punctuation and special characters ([`symbols/`](./symbols/))
- **Type System**: TypeScript definitions for glyphs and characters ([`types.ts`](./types.ts))
- **Rendering Engine**: Conversion utilities from text to visual blocks ([`block.ts`](./block.ts))
- **Theme System**: Color schemes for light and dark modes ([`theme.ts`](./theme.ts))

## What is a Glyph?

A **Glyph** is a visual representation of a single character using a grid-based system:

- **7 rows** (indexed 0-6) for consistent character height
- **1-5 columns** per row (width varies by character)
- **Binary values** (0 or 1) for each cell:
  - `0` = Empty/blank cell (no visual representation)
  - `1` = Filled cell (rendered with PRIMARY or SECONDARY color)

### Color Assignment

Filled cells (`1`) are automatically assigned colors based on their row position:

- **Rows 0-2 and 6**: PRIMARY color (main foreground color)
  - Light theme: `#000000` (black)
  - Dark theme: `#FFFFFF` (white)
- **Rows 3-5**: SECONDARY color (accent color for depth and shading)
  - Light theme: `#9d9d9dff` (gray)
  - Dark theme: `#626262ff` (dark gray)

This automatic assignment creates visual depth and character to the rendered text.

## Grid System

The 7-row grid system is structured as follows:

```
Row 0: Top padding/ascender space (often empty) - PRIMARY zone
Row 1: Upper portion of character              - PRIMARY zone
Row 2: Upper-middle portion                    - PRIMARY zone
Row 3: Middle portion                          - SECONDARY zone
Row 4: Lower-middle portion                    - SECONDARY zone
Row 5: Bottom portion                          - SECONDARY zone
Row 6: Bottom padding/descender space          - PRIMARY zone (typically padding)
```

## Directory Structure

```
alphabet/
├── README.md                    # This file - overall glyph system documentation
├── types.ts                     # Core type definitions and exports
├── block.ts                     # Rendering utilities
├── theme.ts                     # Color theme definitions
├── letters/                     # Letter glyphs (A-Z)
│   ├── README.md               # Letter-specific documentation
│   ├── letter-a.ts
│   ├── letter-b.ts
│   └── ... (26 total)
└── symbols/                     # Symbol glyphs
    ├── README.md               # Symbol-specific documentation
    ├── symbol-hyphen.ts
    ├── symbol-pipe.ts
    ├── symbol-apostrophe.ts
    ├── symbol-quote.ts
    ├── symbol-question.ts
    └── symbol-exclamation.ts
```

## Available Characters

### Letters (26 characters)

All uppercase letters A-Z are available. Letters vary in width:

| Width       | Letters                                                          | Columns |
| ----------- | ---------------------------------------------------------------- | ------- |
| **Narrow**  | I, J                                                             | 1-2     |
| **Regular** | A, B, C, D, E, F, G, H, K, L, N, O, P, Q, R, S, T, U, V, X, Y, Z | 3-4     |
| **Wide**    | M, W                                                             | 5       |

See [`letters/README.md`](./letters/README.md) for detailed letter documentation.

### Symbols (6 characters)

| Symbol | Name        | Width | Description                        |
| ------ | ----------- | ----- | ---------------------------------- |
| `-`    | Hyphen      | 3     | Horizontal line for compound words |
| `\|`   | Pipe        | 1     | Vertical line for separators       |
| `'`    | Apostrophe  | 1     | Single quote for contractions      |
| `"`    | Quote       | 2     | Double quote marks for quoted text |
| `?`    | Question    | 4     | Question mark for interrogatives   |
| `!`    | Exclamation | 1     | Exclamation point for emphasis     |

See [`symbols/README.md`](./symbols/README.md) for detailed symbol documentation.

## Quick Start

### Basic Usage

```typescript
import { textToBlocks } from './block';
import { ALPHABET, SYMBOLS } from './types';

// Render text with letters
const blocks = textToBlocks('HELLO');

// Access individual glyphs
const letterH = ALPHABET.H;
const hyphen = SYMBOLS['-'];
const question = SYMBOLS['?'];
```

### Get Available Characters

```typescript
import { getAvailableCharacters, getAvailableSymbols, getAllAvailableCharacters } from './types';

// Get letters only
const letters = getAvailableCharacters();
// Returns: ['A', 'B', 'C', ..., 'Z']

// Get symbols only
const symbols = getAvailableSymbols();
// Returns: ['-', '|', "'", '"', '?', '!']

// Get all characters
const all = getAllAvailableCharacters();
// Returns: ['A', 'B', ..., 'Z', '-', '|', "'", '"', '?', '!']
```

### Rendering Pipeline

The rendering system converts text to visual blocks through this pipeline:

```
Input Text → textToBlocks() → Block Array → SVG/Canvas Rendering
```

1. **Input**: Text string (e.g., "HELLO WORLD!")
2. **Lookup**: Each character is looked up in ALPHABET or SYMBOLS
3. **Convert**: Glyph grids are converted to positioned blocks
4. **Color**: Each block gets PRIMARY or SECONDARY color based on row
5. **Output**: Array of `Block` objects with `x`, `y`, and `color` properties

## Type System

### Core Types

```typescript
// Cell type for individual grid cells
type CellType = 'blank' | 'primary' | 'secondary';

// Glyph structure
type Glyph = {
  rows: Record<number, number[]>; // 7 rows (0-6), each with 1-5 columns
};

// Letter names (A-Z)
type LetterName = 'A' | 'B' | 'C' | ... | 'Z';

// Symbol names
type SymbolName = '-' | '|' | "'" | '"' | '?' | '!';

// Collections
type Alphabet = { [key in LetterName]: Glyph };
type Symbols = { [key in SymbolName]: Glyph };
```

### Exports

```typescript
// Constants
export const ALPHABET: Alphabet; // All letter glyphs
export const SYMBOLS: Symbols; // All symbol glyphs
export const cellType; // Cell type constants

// Types
export type { Glyph, CellType, LetterName, SymbolName, Alphabet, Symbols };

// Utilities
export function getAvailableCharacters(): string[];
export function getAvailableSymbols(): string[];
export function getAllAvailableCharacters(): string[];
```

## Design Guidelines

When creating or modifying glyph definitions:

1. **Use rows 0 and 6 sparingly**: These are typically empty for padding
2. **Maintain consistent stroke width**: Use solid lines for better readability
3. **Balance the character**: Ensure visual weight is distributed evenly
4. **Test readability**: Characters should be recognizable at the intended size
5. **Follow the grid**: Stay within the 7-row height constraint
6. **Consider color transition**: Row 3 marks the transition to secondary color
7. **Document thoroughly**: Include visual ASCII representations in JSDoc

## Example Glyph Structure

```typescript
import { type Glyph } from './types';

export const letterA: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (PRIMARY)
    2: [0, 0, 0, 1], // Right side (PRIMARY)
    3: [1, 1, 1, 1], // Middle bar (SECONDARY)
    4: [1, 0, 0, 1], // Sides (SECONDARY)
    5: [1, 1, 1, 1], // Bottom bar (SECONDARY)
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

## Testing

All glyph definitions are tested to ensure:

- Each glyph has exactly 7 rows (0-6)
- Each row contains 1-5 columns
- Each cell contains valid values (0 or 1)
- Glyphs are properly exported and accessible

Run tests with:

```bash
bun test
```

See test files:

- `types.test.ts` - Type and structure validation
- `letters.test.ts` - Letter-specific tests
- `block.test.ts` - Rendering tests
- `theme.test.ts` - Color theme tests

## Visual Examples

Sample renderings using these glyphs:

- [`/docs/samples/opencode.svg`](../../../samples/opencode.svg) - OPENCODE logo
- [`/docs/samples/warcraft.svg`](../../../samples/warcraft.svg) - WARCRAFT text
- [`/docs/samples/a-z-test-.svg`](../../../samples/a-z-test-.svg) - Full alphabet test
- [`/docs/samples/hello-world.svg`](../../../samples/hello-world.svg) - HELLO WORLD example
- [`/docs/samples/quick-fix-.svg`](../../../samples/quick-fix-.svg) - QUICK FIX! example

## Related Documentation

- **[`/docs/BLOCKY-TEXT-README.md`](../../../BLOCKY-TEXT-README.md)**: Complete system documentation
- **[`letters/README.md`](./letters/README.md)**: Letter-specific documentation (A-Z)
- **[`symbols/README.md`](./symbols/README.md)**: Symbol-specific documentation
- **[`block.ts`](./block.ts)**: Rendering implementation details
- **[`theme.ts`](./theme.ts)**: Color theme system

## Contributing

When adding new glyphs or modifying existing ones:

1. **Follow naming conventions**:
   - Letters: `letter-[x].ts` with export `letter[X]`
   - Symbols: `symbol-[name].ts` with export `symbol[Name]`

2. **Include comprehensive documentation**:
   - JSDoc header with description
   - Visual ASCII grid representation
   - Grid details (width, height, color zones)
   - Character design rationale
   - Usage examples

3. **Update type system**:
   - Add to `LetterName` or `SymbolName` type
   - Add to `ALPHABET` or `SYMBOLS` constant
   - Update helper functions if needed

4. **Test thoroughly**:
   - Verify visual appearance by generating SVG samples
   - Ensure tests pass
   - Check readability at different sizes

5. **Document changes**:
   - Update relevant README files
   - Add examples if introducing new features
   - Update type documentation

## License

See project root for license information.
