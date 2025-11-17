import type { Theme, ThemeType } from './theme';
import {
  letterA,
  letterB,
  letterC,
  letterD,
  letterE,
  letterF,
  letterG,
  letterH,
  letterI,
  letterJ,
  letterK,
  letterL,
  letterM,
  letterN,
  letterO,
  letterP,
  letterQ,
  letterR,
  letterS,
  letterT,
  letterU,
  letterV,
  letterW,
  letterX,
  letterY,
  letterZ,
  symbolHyphen,
  symbolPipe,
  symbolApostrophe,
  symbolQuote,
  symbolQuestion,
  symbolExclamation,
} from './glyphs';

/**
 * Cell type constants for defining the visual appearance of glyph cells.
 *
 * Each cell in a glyph grid can be one of three types:
 * - BLANK: Empty/transparent cell (no visual representation)
 * - PRIMARY: Main color cell (foreground color in light theme, bright in dark theme)
 * - SECONDARY: Accent color cell (for shading, depth, and visual interest)
 *
 * @example
 * ```typescript
 * import { cellType } from './types';
 *
 * const cell = cellType.PRIMARY; // "primary"
 * const isBlank = cell === cellType.BLANK; // false
 * ```
 */
export const cellType = {
  BLANK: 'blank',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

/**
 * Type representing a cell type value.
 *
 * Valid values: "blank" | "primary" | "secondary"
 */
export type CellType = (typeof cellType)[keyof typeof cellType];

/**
 * Represents a single character glyph in the blocky text system.
 *
 * A Glyph is a visual representation of a character using a grid-based system where:
 * - Each glyph occupies a 7-row grid (rows indexed 0-6)
 * - Each row can have 1-5 columns (typically 3-5 for most letters)
 * - Each cell is represented by a number: 0 (blank/empty) or 1 (filled)
 * - Filled cells (1) are automatically converted to PRIMARY or SECONDARY based on row position
 *   - Rows 0-2 and 6: Convert to PRIMARY color
 *   - Rows 3-5: Convert to SECONDARY color
 *
 * ## Grid System
 *
 * The 7-row grid system is designed to create consistent character heights:
 * - Row 0: Top padding/ascender space (often empty)
 * - Rows 1-2: Upper portion of character
 * - Rows 3-5: Middle to lower portion (uses secondary color for depth)
 * - Row 6: Bottom padding/descender space (often empty)
 *
 * ## Width Variations
 *
 * Different characters have different widths:
 * - Narrow letters (I, J): 1-2 columns
 * - Regular letters (A, B, C, etc.): 3-4 columns
 * - Wide letters (M, W): 5 columns
 *
 * @example
 * ```typescript
 * // Simple letter "I" - narrow, 1 column
 * const letterI: Glyph = {
 *   rows: {
 *     0: [1],      // Top
 *     1: [0],      // Gap
 *     2: [1],      // Upper stem
 *     3: [1],      // Middle stem (secondary color)
 *     4: [1],      // Lower stem (secondary color)
 *     5: [1],      // Bottom stem (secondary color)
 *     6: [0],      // Bottom padding
 *   },
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Letter "A" - regular width, 4 columns
 * const letterA: Glyph = {
 *   rows: {
 *     0: [0, 0, 0, 0],     // Top padding
 *     1: [1, 1, 1, 1],     // Top bar (primary)
 *     2: [0, 0, 0, 1],     // Right side (primary)
 *     3: [1, 1, 1, 1],     // Middle bar (secondary)
 *     4: [1, 0, 0, 1],     // Sides (secondary)
 *     5: [1, 1, 1, 1],     // Bottom bar (secondary)
 *     6: [0, 0, 0, 0],     // Bottom padding
 *   },
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Letter "M" - wide, 5 columns
 * const letterM: Glyph = {
 *   rows: {
 *     0: [0, 0, 0, 0, 0],  // Top padding
 *     1: [1, 1, 1, 1, 1],  // Top bar (primary)
 *     2: [1, 0, 1, 0, 1],  // M shape upper (primary)
 *     3: [1, 0, 1, 0, 1],  // M shape middle (secondary)
 *     4: [1, 0, 0, 0, 1],  // Sides (secondary)
 *     5: [1, 0, 0, 0, 1],  // Sides bottom (secondary)
 *     6: [0, 0, 0, 0, 0],  // Bottom padding
 *   },
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Using a glyph with textToBlocks
 * import { textToBlocks } from './block';
 * import { ALPHABET } from './types';
 *
 * const blocks = textToBlocks('A'); // Uses letterA glyph internally
 * // Returns array of Block objects with x, y, color properties
 * ```
 *
 * @see {@link CellType} for cell type values
 * @see {@link cellType} for cell type constants
 * @see textToBlocks in block.ts for usage in rendering
 */
export type Glyph = {
  /**
   * Mapping of row indices (0-6) to arrays of cell values.
   *
   * Each array contains numbers representing cell states:
   * - 0: Empty/blank cell (transparent)
   * - 1: Filled cell (converted to PRIMARY or SECONDARY based on row)
   *
   * Array length determines the width of the character (1-5 cells).
   *
   * @example
   * ```typescript
   * rows: {
   *   0: [0, 0, 0],    // Row 0: 3 empty cells
   *   1: [1, 1, 1],    // Row 1: 3 filled cells
   *   2: [0, 1, 0],    // Row 2: filled center
   *   3: [1, 1, 1],    // Row 3: 3 filled cells
   *   4: [1, 0, 1],    // Row 4: filled sides
   *   5: [1, 0, 1],    // Row 5: filled sides
   *   6: [0, 0, 0],    // Row 6: 3 empty cells
   * }
   * ```
   */
  rows: Record<number, number[]>;
};

/**
 * Union type of all available letter names (A-Z).
 *
 * This type represents the complete set of uppercase letters available
 * in the blocky text alphabet system. Each letter corresponds to a glyph
 * definition that can be used to render text in the blocky style.
 *
 * @example
 * ```typescript
 * import { ALPHABET } from './types';
 * import type { LetterName } from './types';
 *
 * const letter: LetterName = 'A';
 * const glyph = ALPHABET[letter]; // Returns the Glyph for 'A'
 * ```
 *
 * @example
 * ```typescript
 * // Type-safe letter validation
 * function isValidLetter(char: string): char is LetterName {
 *   return /^[A-Z]$/.test(char);
 * }
 *
 * const input = 'A';
 * if (isValidLetter(input)) {
 *   // input is now typed as LetterName
 *   const glyph = ALPHABET[input];
 * }
 * ```
 *
 * @see {@link Glyph} for the structure of each letter definition
 * @see ALPHABET constant for the complete letter-to-glyph mapping
 */
export type LetterName =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

/**
 * Union type of all available symbol names.
 *
 * This type represents the complete set of symbols available in the blocky text
 * system. Symbols include punctuation marks and special characters that can be
 * used alongside letters for complete text rendering.
 *
 * @example
 * ```typescript
 * import { SYMBOLS } from './types';
 * import type { SymbolName } from './types';
 *
 * const symbol: SymbolName = '-';
 * const glyph = SYMBOLS[symbol]; // Returns the Glyph for hyphen
 * ```
 *
 * @see {@link Glyph} for the structure of each symbol definition
 * @see SYMBOLS constant for the complete symbol-to-glyph mapping
 */
export type SymbolName = '-' | '|' | "'" | '"' | '?' | '!';

export type Alphabet = {
  [key in LetterName]: Glyph;
};

/**
 * Type for the symbols collection mapping symbol characters to their glyphs.
 */
export type Symbols = {
  [key in SymbolName]: Glyph;
};

export const ALPHABET: Alphabet = {
  A: letterA,
  B: letterB,
  C: letterC,
  D: letterD,
  E: letterE,
  F: letterF,
  G: letterG,
  H: letterH,
  I: letterI,
  J: letterJ,
  K: letterK,
  L: letterL,
  M: letterM,
  N: letterN,
  O: letterO,
  P: letterP,
  Q: letterQ,
  R: letterR,
  S: letterS,
  T: letterT,
  U: letterU,
  V: letterV,
  W: letterW,
  X: letterX,
  Y: letterY,
  Z: letterZ,
};

/**
 * Collection of symbol glyphs for punctuation and special characters.
 *
 * This object maps symbol characters to their glyph definitions, allowing
 * symbols to be rendered alongside letters in the blocky text system.
 *
 * Available symbols:
 * - `-` (hyphen): Horizontal line for compound words
 * - `|` (pipe): Vertical line for separators
 * - `'` (apostrophe): Single quote mark for contractions
 * - `"` (quote): Double quote marks for quoted text
 * - `?` (question): Question mark for interrogatives
 * - `!` (exclamation): Exclamation point for emphasis
 *
 * @example
 * ```typescript
 * import { SYMBOLS } from './types';
 *
 * const hyphen = SYMBOLS['-'];
 * const question = SYMBOLS['?'];
 * ```
 *
 * @see {@link Glyph} for the structure of symbol definitions
 * @see {@link SymbolName} for the type of available symbols
 */
export const SYMBOLS: Symbols = {
  '-': symbolHyphen,
  '|': symbolPipe,
  "'": symbolApostrophe,
  '"': symbolQuote,
  '?': symbolQuestion,
  '!': symbolExclamation,
};

/**
 * Get available characters in the font (letters only)
 */
export const getAvailableCharacters = (): string[] => {
  return Object.keys(ALPHABET);
};

/**
 * Get available symbols in the font
 */
export const getAvailableSymbols = (): string[] => {
  return Object.keys(SYMBOLS);
};

/**
 * Get all available characters (letters and symbols combined)
 */
export const getAllAvailableCharacters = (): string[] => {
  return [...Object.keys(ALPHABET), ...Object.keys(SYMBOLS)];
};
