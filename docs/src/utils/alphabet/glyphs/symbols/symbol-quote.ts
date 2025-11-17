import { type Glyph } from '../../types';

/**
 * Glyph definition for the quotation mark symbol '"'.
 *
 * This glyph represents the double quote character in a blocky, pixel-art style
 * using a 7-row by 2-column grid. The symbol consists of two vertical marks at
 * the top of the grid representing opening or closing quotation marks.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+
 * | █ | █ |  Row 0: Top of quotes (PRIMARY color)
 * +---+---+
 * | █ | █ |  Row 1: Bottom of quotes (PRIMARY color)
 * +---+---+
 * |   |   |  Row 2: Empty (PRIMARY zone)
 * +---+---+
 * |   |   |  Row 3: Empty (SECONDARY zone)
 * +---+---+
 * |   |   |  Row 4: Empty (SECONDARY zone)
 * +---+---+
 * |   |   |  Row 5: Empty (SECONDARY zone)
 * +---+---+
 * |   |   |  Row 6: Bottom padding (empty)
 * +---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 2 columns (narrow width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-1: PRIMARY color (the quotation marks)
 *   - All other rows: Empty
 *
 * ## Character Design
 *
 * The quotation mark is designed as two vertical marks:
 * - Two columns of filled cells at rows 0-1
 * - Positioned at the top of the character space
 * - Represents both opening and closing quotes (ambidextrous)
 * - Minimal design suitable for quoted text
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolQuote } from './symbol-quote';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolQuote;
 * console.log(glyph.rows[0]); // [1, 1] - top of marks
 *
 * // Or render as part of text
 * const blocks = textToBlocks('"HELLO"');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see symbolApostrophe for the single quote character
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolQuote: Glyph = {
  rows: {
    0: [1, 1], // Top of quotes (primary)
    1: [1, 1], // Bottom of quotes (primary)
    2: [0, 0], // Empty (primary zone)
    3: [0, 0], // Empty (secondary zone)
    4: [0, 0], // Empty (secondary zone)
    5: [0, 0], // Empty (secondary zone)
    6: [0, 0], // Bottom padding
  },
};
