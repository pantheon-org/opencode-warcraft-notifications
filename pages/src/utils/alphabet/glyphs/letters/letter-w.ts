import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'W'.
 *
 * This glyph represents the uppercase letter 'W' in a blocky, pixel-art style
 * using a 7-row by 5-column grid. The letter features two vertical stems with
 * an internal peak pattern at the bottom, creating the characteristic 'W' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 1: Outer stems (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 2: Outer stems (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   | █ |   | █ |  Row 3: W pattern begins (SECONDARY color)
 * +---+---+---+---+---+
 * | █ |   | █ |   | █ |  Row 4: W pattern continues (SECONDARY color)
 * +---+---+---+---+---+
 * | █ | █ | █ | █ | █ |  Row 5: Bottom connection (SECONDARY color)
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 5 columns (widest letter, along with M)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (outer stems)
 *   - Rows 3-5: SECONDARY color (W pattern with middle peak and bottom bar)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'W' is designed with a distinctive double-valley pattern:
 * - Outer vertical stems at columns 0 and 4 (rows 1-5)
 * - Middle peak at column 2 starting at row 3
 * - Bottom connecting bar (row 5) joining all elements
 *
 * The W-shape with its internal peak distinguishes it from M (which has
 * peaks at the top). As one of the widest letters at 5 columns, it provides
 * balanced proportions.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterW } from './letter-w';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterW;
 * console.log(glyph.rows[3]); // [1, 0, 1, 0, 1] - W pattern
 *
 * // Or render as part of text
 * const blocks = textToBlocks('W');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterM (peaks at top vs bottom)
 * import { letterW, letterM } from './letters';
 *
 * console.log(letterW.rows[3]); // [1, 0, 1, 0, 1] - W pattern
 * console.log(letterM.rows[2]); // [1, 0, 1, 0, 1] - M pattern at top
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterM for similar 5-column width with inverted pattern
 * @see letterV for single-valley convergence
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterW: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0], // Top padding
    1: [1, 0, 0, 0, 1], // Outer stems (primary)
    2: [1, 0, 0, 0, 1], // Outer stems (primary)
    3: [1, 0, 1, 0, 1], // W pattern begins (secondary)
    4: [1, 0, 1, 0, 1], // W pattern continues (secondary)
    5: [1, 1, 1, 1, 1], // Bottom connection (secondary)
    6: [0, 0, 0, 0, 0], // Bottom padding
  },
};
