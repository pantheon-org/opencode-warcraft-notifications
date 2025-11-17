import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'B'.
 *
 * This glyph represents the uppercase letter 'B' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem on the
 * left with horizontal bars at the top and bottom, and a hollow right section
 * creating the characteristic 'B' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * | █ |   |   |   |  Row 0: Top stem (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Stem and right side (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Stem and right side (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Stem and right side (SECONDARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 5: Bottom bar (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 4 columns (regular width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-2: PRIMARY color (top stem, top bar, and upper bulge)
 *   - Rows 3-5: SECONDARY color (lower stem, lower bulge, and bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'B' is designed with a vertical stem and enclosed spaces:
 * - A left vertical stem extending from row 0 to row 5
 * - Horizontal bars at rows 1 and 5
 * - Hollow spaces at columns 1-2 creating the 'B' bulges
 * - Right side at column 3 for rows 2-4
 *
 * This design creates two hollow sections typical of the letter 'B', with
 * the SECONDARY color transition at row 3 adding visual depth.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterB } from './letter-b';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterB;
 * console.log(glyph.rows[0]); // [1, 0, 0, 0] - left stem
 *
 * // Or render as part of text
 * const blocks = textToBlocks('B');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphB = ALPHABET.B; // Same as letterB
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterB: Glyph = {
  rows: {
    0: [1, 0, 0, 0], // Top stem (primary)
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Stem and right side (primary)
    3: [1, 0, 0, 1], // Stem and right side (secondary)
    4: [1, 0, 0, 1], // Stem and right side (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
