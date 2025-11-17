import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'Y'.
 *
 * This glyph represents the uppercase letter 'Y' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features two upper stems
 * converging to a single lower stem with a descender, characteristic of 'Y'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 1: Upper stems (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Upper stems (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Converging stems (SECONDARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 4: Junction bar (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 5: Descender stem (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 6: Descender extends (SECONDARY color)
 * +---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 4 columns (regular width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (upper stems)
 *   - Rows 3-6: SECONDARY color (converging stems, junction, descender)
 *
 * ## Character Design
 *
 * The letter 'Y' is designed with converging stems and descender:
 * - Two upper vertical stems at columns 0 and 3 (rows 1-3)
 * - Junction bar at row 4 connecting the stems
 * - Right descender stem at column 3 (rows 5-6)
 *
 * The converging upper stems with descending single stem create the
 * characteristic Y-shape, with the descender extending below the typical
 * baseline similar to letters like J and Q.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterY } from './letter-y';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterY;
 * console.log(glyph.rows[4]); // [1, 1, 1, 1] - junction bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('Y');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphY = ALPHABET.Y; // Same as letterY
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterV for similar stem convergence without descender
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterY: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 0, 0, 1], // Upper stems (primary)
    2: [1, 0, 0, 1], // Upper stems (primary)
    3: [1, 0, 0, 1], // Converging stems (secondary)
    4: [1, 1, 1, 1], // Junction bar (secondary)
    5: [0, 0, 0, 1], // Descender stem (secondary)
    6: [0, 0, 0, 1], // Descender extends (secondary)
  },
};
