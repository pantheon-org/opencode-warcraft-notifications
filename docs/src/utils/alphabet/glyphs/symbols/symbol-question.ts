import { type Glyph } from '../../types';

/**
 * Glyph definition for the question mark symbol '?'.
 *
 * This glyph represents the question mark character in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The symbol features a curved top, descending
 * line, and a dot at the bottom characteristic of a question mark.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 0: Top curve (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 1: Sides of curve (PRIMARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 2: Right descending (PRIMARY color)
 * +---+---+---+---+
 * |   |   | █ |   |  Row 3: Middle descending (SECONDARY color)
 * +---+---+---+---+
 * |   |   | █ |   |  Row 4: Stem (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   |   |  Row 5: Gap before dot (SECONDARY zone)
 * +---+---+---+---+
 * |   |   | █ |   |  Row 6: Bottom dot (PRIMARY color typically padding)
 * +---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 4 columns (regular width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-2: PRIMARY color (top curve and descending line)
 *   - Rows 3-5: SECONDARY color (middle stem and gap)
 *   - Row 6: PRIMARY color (bottom dot)
 *
 * ## Character Design
 *
 * The question mark is designed with clear components:
 * - Top curve formed by rows 0-1 (full bar and sides)
 * - Descending line from right to center (rows 2-4)
 * - Empty row 5 for visual separation
 * - Final dot at row 6 for the question mark punctuation
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolQuestion } from './symbol-question';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolQuestion;
 * console.log(glyph.rows[0]); // [1, 1, 1, 1] - top curve
 *
 * // Or render as part of text
 * const blocks = textToBlocks('WHY?');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see symbolExclamation for the related exclamation mark
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolQuestion: Glyph = {
  rows: {
    0: [1, 1, 1, 1], // Top curve (primary)
    1: [1, 0, 0, 1], // Sides of curve (primary)
    2: [0, 0, 0, 1], // Right descending (primary)
    3: [0, 0, 1, 0], // Middle descending (secondary)
    4: [0, 0, 1, 0], // Stem (secondary)
    5: [0, 0, 0, 0], // Gap before dot (secondary zone)
    6: [0, 0, 1, 0], // Bottom dot (primary)
  },
};
