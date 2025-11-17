import { type Glyph } from '../../types';

/**
 * Glyph definition for the hyphen symbol '-'.
 *
 * This glyph represents the hyphen/minus character in a blocky, pixel-art style
 * using a 7-row by 3-column grid. The symbol is a simple horizontal line
 * centered vertically in the middle of the grid.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+
 * |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+
 * |   |   |   |  Row 1: Empty
 * +---+---+---+
 * |   |   |   |  Row 2: Empty (PRIMARY zone)
 * +---+---+---+
 * | █ | █ | █ |  Row 3: Horizontal line (SECONDARY color)
 * +---+---+---+
 * |   |   |   |  Row 4: Empty (SECONDARY zone)
 * +---+---+---+
 * |   |   |   |  Row 5: Empty (SECONDARY zone)
 * +---+---+---+
 * |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 3 columns (narrow width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Row 3: SECONDARY color (horizontal line)
 *   - All other rows: Empty
 *
 * ## Character Design
 *
 * The hyphen is designed to be simple and functional:
 * - A single horizontal line at row 3 (the vertical center)
 * - Uses SECONDARY color as row 3 falls in the secondary zone
 * - Minimal design makes it ideal for compound words and ranges
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolHyphen } from './symbol-hyphen';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolHyphen;
 * console.log(glyph.rows[3]); // [1, 1, 1] - horizontal line
 *
 * // Or render as part of text
 * const blocks = textToBlocks('WARCRAFT-2');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolHyphen: Glyph = {
  rows: {
    0: [0, 0, 0], // Top padding
    1: [0, 0, 0], // Empty
    2: [0, 0, 0], // Empty (primary zone)
    3: [1, 1, 1], // Horizontal line (secondary)
    4: [0, 0, 0], // Empty (secondary zone)
    5: [0, 0, 0], // Empty (secondary zone)
    6: [0, 0, 0], // Bottom padding
  },
};
