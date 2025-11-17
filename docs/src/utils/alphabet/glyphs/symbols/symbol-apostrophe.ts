import { type Glyph } from '../../types';

/**
 * Glyph definition for the apostrophe symbol "'".
 *
 * This glyph represents the single quote/apostrophe character in a blocky,
 * pixel-art style using a 7-row by 1-column grid. The symbol appears at the
 * top of the grid, consisting of two filled cells.
 *
 * ## Visual Representation
 *
 * ```
 * +---+
 * |   |  Row 0: Empty
 * +---+
 * | █ |  Row 1: Top of apostrophe (PRIMARY color)
 * +---+
 * | █ |  Row 2: Bottom of apostrophe (PRIMARY color)
 * +---+
 * |   |  Row 3: Empty (SECONDARY zone)
 * +---+
 * |   |  Row 4: Empty (SECONDARY zone)
 * +---+
 * |   |  Row 5: Empty (SECONDARY zone)
 * +---+
 * |   |  Row 6: Bottom padding (empty)
 * +---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 1 column (narrowest possible)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (the apostrophe mark)
 *   - All other rows: Empty
 *
 * ## Character Design
 *
 * The apostrophe is designed as a simple vertical mark at the top:
 * - Two filled cells at rows 1-2 representing the quote mark
 * - Positioned at the top of the character space
 * - Minimal design suitable for contractions and possessives
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolApostrophe } from './symbol-apostrophe';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolApostrophe;
 * console.log(glyph.rows[1]); // [1] - top of mark
 *
 * // Or render as part of text
 * const blocks = textToBlocks("DON'T");
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see symbolQuote for the double quote character
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolApostrophe: Glyph = {
  rows: {
    0: [0], // Empty
    1: [1], // Top of apostrophe (primary)
    2: [1], // Bottom of apostrophe (primary)
    3: [0], // Empty (secondary zone)
    4: [0], // Empty (secondary zone)
    5: [0], // Empty (secondary zone)
    6: [0], // Bottom padding
  },
};
