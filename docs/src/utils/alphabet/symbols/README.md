# Symbol Glyphs

This directory contains the glyph definitions for punctuation marks and special characters used in the blocky text rendering system.

> **Note**: For general information about the glyph system, see [`../README.md`](../README.md). For letter glyphs, see [`../letters/README.md`](../letters/README.md).

## Overview

Each symbol is defined as a `Glyph` object using the same 7-row grid system as letters. Symbols enable full text rendering with punctuation marks, quotes, and special characters.

## Available Symbols

The system includes 6 symbols for common punctuation:

| Symbol | Name        | Width | File                    | Description                        |
| ------ | ----------- | ----- | ----------------------- | ---------------------------------- |
| `-`    | Hyphen      | 3     | `symbol-hyphen.ts`      | Horizontal line for compound words |
| `\|`   | Pipe        | 1     | `symbol-pipe.ts`        | Vertical line for separators       |
| `'`    | Apostrophe  | 1     | `symbol-apostrophe.ts`  | Single quote for contractions      |
| `"`    | Quote       | 2     | `symbol-quote.ts`       | Double quote marks for quoted text |
| `?`    | Question    | 4     | `symbol-question.ts`    | Question mark for interrogatives   |
| `!`    | Exclamation | 1     | `symbol-exclamation.ts` | Exclamation point for emphasis     |

## File Structure

Each symbol file follows a consistent pattern:

```typescript
import { type Glyph } from '../types';

/**
 * Glyph definition for the [symbol name] symbol '[char]'.
 *
 * [Detailed description]
 *
 * ## Visual Representation
 * [ASCII grid showing the symbol]
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
export const symbol[Name]: Glyph = {
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

## Symbol Details

### Hyphen (`-`) - 3 columns

A simple horizontal line centered vertically, used for compound words and ranges.

```typescript
export const symbolHyphen: Glyph = {
  rows: {
    0: [0, 0, 0], // Empty
    1: [0, 0, 0], // Empty
    2: [0, 0, 0], // Empty (PRIMARY zone)
    3: [1, 1, 1], // Horizontal line (SECONDARY)
    4: [0, 0, 0], // Empty (SECONDARY zone)
    5: [0, 0, 0], // Empty (SECONDARY zone)
    6: [0, 0, 0], // Empty
  },
};
```

Visual:

```
+---+---+---+
|   |   |   |  Rows 0-2
+---+---+---+
| █ | █ | █ |  Row 3 (SECONDARY)
+---+---+---+
|   |   |   |  Rows 4-6
+---+---+---+
```

**Usage**: `"WARCRAFT-2"`, `"A-Z"`, `"1-10"`

### Pipe (`|`) - 1 column

A full-height vertical line used as a separator or delimiter.

```typescript
export const symbolPipe: Glyph = {
  rows: {
    0: [1], // Top (PRIMARY)
    1: [1], // (PRIMARY)
    2: [1], // (PRIMARY)
    3: [1], // (SECONDARY)
    4: [1], // (SECONDARY)
    5: [1], // (SECONDARY)
    6: [1], // Bottom (PRIMARY)
  },
};
```

Visual:

```
+---+
| █ |  Rows 0-6 (full height)
+---+
```

**Usage**: `"A|B|C"`, `"LEFT|RIGHT"`, `"YES|NO"`

### Apostrophe (`'`) - 1 column

A small mark at the top for contractions and possessives.

```typescript
export const symbolApostrophe: Glyph = {
  rows: {
    0: [0], // Empty
    1: [1], // Top of mark (PRIMARY)
    2: [1], // Bottom of mark (PRIMARY)
    3: [0], // Empty (SECONDARY zone)
    4: [0], // Empty
    5: [0], // Empty
    6: [0], // Empty
  },
};
```

Visual:

```
+---+
|   |  Row 0
+---+
| █ |  Rows 1-2 (PRIMARY)
+---+
|   |  Rows 3-6
+---+
```

**Usage**: `"DON'T"`, `"IT'S"`, `"ALICE'S"`

### Quote (`"`) - 2 columns

Double marks at the top for quoted text.

```typescript
export const symbolQuote: Glyph = {
  rows: {
    0: [1, 1], // Top of marks (PRIMARY)
    1: [1, 1], // Bottom of marks (PRIMARY)
    2: [0, 0], // Empty (PRIMARY zone)
    3: [0, 0], // Empty (SECONDARY zone)
    4: [0, 0], // Empty
    5: [0, 0], // Empty
    6: [0, 0], // Empty
  },
};
```

Visual:

```
+---+---+
| █ | █ |  Rows 0-1 (PRIMARY)
+---+---+
|   |   |  Rows 2-6
+---+---+
```

**Usage**: `"HELLO"`, `"WORLD"`, `"YES"`

### Question (`?`) - 4 columns

Question mark with curved top, descending line, and bottom dot.

```typescript
export const symbolQuestion: Glyph = {
  rows: {
    0: [1, 1, 1, 1], // Top curve (PRIMARY)
    1: [1, 0, 0, 1], // Sides of curve (PRIMARY)
    2: [0, 0, 0, 1], // Right descending (PRIMARY)
    3: [0, 0, 1, 0], // Middle descending (SECONDARY)
    4: [0, 0, 1, 0], // Stem (SECONDARY)
    5: [0, 0, 0, 0], // Gap (SECONDARY zone)
    6: [0, 0, 1, 0], // Bottom dot (PRIMARY)
  },
};
```

Visual:

```
+---+---+---+---+
| █ | █ | █ | █ |  Row 0 (PRIMARY)
+---+---+---+---+
| █ |   |   | █ |  Row 1 (PRIMARY)
+---+---+---+---+
|   |   |   | █ |  Row 2 (PRIMARY)
+---+---+---+---+
|   |   | █ |   |  Rows 3-4 (SECONDARY)
+---+---+---+---+
|   |   |   |   |  Row 5 (gap)
+---+---+---+---+
|   |   | █ |   |  Row 6 (dot)
+---+---+---+---+
```

**Usage**: `"WHY?"`, `"READY?"`, `"WHO?"`

### Exclamation (`!`) - 1 column

Exclamation mark with vertical stem and bottom dot.

```typescript
export const symbolExclamation: Glyph = {
  rows: {
    0: [1], // Top of stem (PRIMARY)
    1: [1], // Upper stem (PRIMARY)
    2: [1], // Middle-upper stem (PRIMARY)
    3: [1], // Middle stem (SECONDARY)
    4: [1], // Lower stem (SECONDARY)
    5: [0], // Gap (SECONDARY zone)
    6: [1], // Bottom dot (PRIMARY)
  },
};
```

Visual:

```
+---+
| █ |  Rows 0-4 (stem)
+---+
|   |  Row 5 (gap)
+---+
| █ |  Row 6 (dot)
+---+
```

**Usage**: `"WATCH OUT!"`, `"YES!"`, `"VICTORY!"`

## Usage

### Accessing Symbol Glyphs

```typescript
import { SYMBOLS } from '../types';
import { symbolHyphen } from './symbol-hyphen';

// Access from SYMBOLS constant
const hyphen = SYMBOLS['-'];
const pipe = SYMBOLS['|'];
const apostrophe = SYMBOLS["'"];
const quote = SYMBOLS['"'];
const question = SYMBOLS['?'];
const exclamation = SYMBOLS['!'];

// Or import directly
const glyph = symbolHyphen;
```

### Rendering Text with Symbols

```typescript
import { textToBlocks } from '../block';

// Text with hyphen
const blocks1 = textToBlocks('A-Z');

// Text with apostrophe
const blocks2 = textToBlocks("DON'T");

// Text with question mark
const blocks3 = textToBlocks('WHY?');

// Text with exclamation
const blocks4 = textToBlocks('YES!');

// Text with pipe separator
const blocks5 = textToBlocks('LEFT|RIGHT');
```

### Get Available Symbols

```typescript
import { getAvailableSymbols, getAllAvailableCharacters } from '../types';

// Get symbols only
const symbols = getAvailableSymbols();
// Returns: ['-', '|', "'", '"', '?', '!']

// Get all characters (letters + symbols)
const all = getAllAvailableCharacters();
// Returns: ['A', 'B', ..., 'Z', '-', '|', "'", '"', '?', '!']
```

## Symbol Characteristics

### Design Patterns

1. **Minimal**: Symbols use minimal cells to maintain clarity
2. **Top-aligned**: Quote marks and apostrophes appear at top (rows 0-2)
3. **Center-aligned**: Hyphen is vertically centered (row 3)
4. **Full-height**: Pipe spans all 7 rows
5. **Compound**: Question and exclamation have stems plus dots

### Common Features

- **Narrow widths**: Most symbols are 1-2 columns (except hyphen: 3, question: 4)
- **Clear separation**: Gaps (row 5) separate stems from dots in ? and !
- **Color zones**: Follow same PRIMARY/SECONDARY rules as letters
- **Consistent spacing**: Symbols align with letter baselines

## Symbol Design Guidelines

When creating or modifying symbol glyphs:

1. **Keep it simple**: Symbols should be immediately recognizable
2. **Minimal width**: Use only the columns needed for clarity
3. **Respect conventions**: Follow standard symbol appearance
4. **Test in context**: Verify symbols work with letters
5. **Consider spacing**: Symbols should not crowd adjacent letters
6. **Use standard positions**: Top for quotes, center for hyphen, full for pipe
7. **Follow color zones**: PRIMARY (rows 0-2, 6), SECONDARY (rows 3-5)

## Symbol Reference Table

Quick reference with positioning details:

| Symbol | Width | Position | Rows Used | Color Zones                |
| ------ | ----- | -------- | --------- | -------------------------- |
| `-`    | 3     | Center   | 3         | SECONDARY (row 3)          |
| `\|`   | 1     | Full     | 0-6       | PRIMARY (0-2,6), SEC (3-5) |
| `'`    | 1     | Top      | 1-2       | PRIMARY (rows 1-2)         |
| `"`    | 2     | Top      | 0-1       | PRIMARY (rows 0-1)         |
| `?`    | 4     | Full     | 0-6       | PRIMARY (0-2,6), SEC (3-4) |
| `!`    | 1     | Full     | 0-6       | PRIMARY (0-2,6), SEC (3-4) |

## Related Files

- **[`../README.md`](../README.md)**: Overall glyph system documentation
- **[`../types.ts`](../types.ts)**: Type definitions and SYMBOLS constant
- **[`../letters/README.md`](../letters/README.md)**: Letter glyph documentation
- **[`../block.ts`](../block.ts)**: Rendering utilities
- **[`../theme.ts`](../theme.ts)**: Color theme definitions

## Contributing

When adding or modifying a symbol:

1. **Follow naming**: `symbol-[name].ts` with export `symbol[Name]`
2. **Include full documentation**: JSDoc with visual representation
3. **Update SYMBOLS**: Add to the constant in `../types.ts`
4. **Update SymbolName type**: Add to the union type if new symbol
5. **Test thoroughly**: Verify appearance in text samples
6. **Check spacing**: Ensure symbol doesn't crowd adjacent characters

## Testing

Symbol glyphs are validated in the test suite:

```bash
bun test
```

Tests verify:

- All 6 symbols are present in SYMBOLS
- Each symbol has 7 rows
- Each row has valid column count
- Cells contain only 0 or 1 values
- Symbols are properly exported

## Visual Examples

See rendered examples with symbols in:

- `/docs/samples/quick-fix-.svg` - "QUICK FIX!" with symbols
- `/docs/samples/a-z-test-.svg` - Alphabet with hyphen
- Custom text samples with symbols

## Future Symbols

Potential symbols for future implementation:

- `.` (Period/dot)
- `,` (Comma)
- `:` (Colon)
- `;` (Semicolon)
- `(` `)` (Parentheses)
- `[` `]` (Brackets)
- `/` (Forward slash)
- `\` (Backslash)
- `*` (Asterisk)
- `+` (Plus)
- `=` (Equals)
- `#` (Hash/number)
- `@` (At symbol)

Each new symbol should follow the established patterns and maintain visual consistency with the existing glyph set.
