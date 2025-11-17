import { type Glyph } from '../types';

/**
 * Glyph definition for the exclamation mark symbol '!'.
 *
 * This glyph represents the exclamation point character in a blocky, pixel-art
 * style using a 7-row by 1-column grid. The symbol is a vertical line with a
 * gap before the final dot, characteristic of an exclamation mark.
 *
 * ## Visual Representation
 *
 * ```
 * +---+
 * | █ |  Row 0: Top of stem (PRIMARY color)
 * +---+
 * | █ |  Row 1: Upper stem (PRIMARY color)
 * +---+
 * | █ |  Row 2: Middle-upper stem (PRIMARY color)
 * +---+
 * | █ |  Row 3: Middle stem (SECONDARY color)
 * +---+
 * | █ |  Row 4: Lower stem (SECONDARY color)
 * +---+
 * |   |  Row 5: Gap before dot (SECONDARY zone)
 * +---+
 * | █ |  Row 6: Bottom dot (PRIMARY color typically padding)
 * +---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 1 column (narrowest possible)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-2: PRIMARY color (upper stem)
 *   - Rows 3-4: SECONDARY color (lower stem)
 *   - Row 5: Empty (gap)
 *   - Row 6: PRIMARY color (dot)
 *
 * ## Character Design
 *
 * The exclamation mark is designed as a simple vertical mark:
 * - Vertical line from rows 0-4 (the stem)
 * - Gap at row 5 for visual separation
 * - Final dot at row 6 for the exclamation punctuation
 * - Narrowest symbol at 1 column wide
 * - Clear emphasis with strong vertical presence
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolExclamation } from './symbol-exclamation';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolExclamation;
 * console.log(glyph.rows[6]); // [1] - bottom dot
 *
 * // Or render as part of text
 * const blocks = textToBlocks('WATCH OUT!');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see symbolQuestion for the related question mark
 * @see symbolPipe for comparison with solid pipe (no gap)
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolExclamation: Glyph = {
  rows: {
    0: [1], // Top of stem (primary)
    1: [1], // Upper stem (primary)
    2: [1], // Middle-upper stem (primary)
    3: [1], // Middle stem (secondary)
    4: [1], // Lower stem (secondary)
    5: [0], // Gap before dot (secondary zone)
    6: [1], // Bottom dot (primary)
  },
};
