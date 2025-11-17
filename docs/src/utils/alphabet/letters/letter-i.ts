import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'I'.
 *
 * This glyph represents the uppercase letter 'I' in a blocky, pixel-art style
 * using a 7-row by 1-column grid. As the narrowest letter in the alphabet,
 * 'I' consists of a single vertical column with a gap at row 1 for visual
 * distinction from a solid line.
 *
 * ## Visual Representation
 *
 * ```
 * +---+
 * | █ |  Row 0: Top serif (PRIMARY color)
 * +---+
 * |   |  Row 1: Gap for spacing
 * +---+
 * | █ |  Row 2: Upper stem (PRIMARY color)
 * +---+
 * | █ |  Row 3: Middle stem (SECONDARY color)
 * +---+
 * | █ |  Row 4: Lower stem (SECONDARY color)
 * +---+
 * | █ |  Row 5: Bottom stem (SECONDARY color)
 * +---+
 * |   |  Row 6: Bottom padding (empty)
 * +---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 1 column (narrowest letter in the alphabet)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Row 0: PRIMARY color (top serif)
 *   - Row 1: Empty (gap for visual separation)
 *   - Row 2: PRIMARY color (upper stem)
 *   - Rows 3-5: SECONDARY color (middle to bottom stem)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'I' is designed to be minimal yet recognizable:
 * - A single pixel at the top (row 0) acts as a serif
 * - A gap at row 1 prevents the letter from looking like a solid line
 * - The main stem runs from rows 2-5
 * - The transition to SECONDARY color at row 3 adds visual interest
 *
 * This narrow design makes 'I' space-efficient in text rendering while
 * maintaining readability.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterI } from './letter-i';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterI;
 * console.log(glyph.rows[0]); // [1] - top serif
 *
 * // Or render as part of text
 * const blocks = textToBlocks('I');
 * ```
 *
 * @example
 * ```typescript
 * // Narrow letters save space
 * const text1 = textToBlocks('III');   // Very compact
 * const text2 = textToBlocks('MMM');   // Much wider
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterM for an example of the widest letter (5 columns)
 * @see textToBlocks in block.ts for rendering usage
 */
export const letterI: Glyph = {
  rows: {
    0: [1], // Top serif (primary)
    1: [0], // Gap for spacing
    2: [1], // Upper stem (primary)
    3: [1], // Middle stem (secondary)
    4: [1], // Lower stem (secondary)
    5: [1], // Bottom stem (secondary)
    6: [0], // Bottom padding
  },
};
