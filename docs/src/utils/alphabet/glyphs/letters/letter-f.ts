import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'F'.
 *
 * This glyph represents the uppercase letter 'F' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem with
 * horizontal bars at the top and middle, characteristic of the letter 'F'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   | █ | █ | █ |  Row 0: Top bar partial (PRIMARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 1: Stem only (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 2: Middle bar full (PRIMARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 3: Stem only (SECONDARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 4: Stem only (SECONDARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 5: Stem only (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top bar, upper stem, middle bar)
 *   - Rows 3-5: SECONDARY color (lower stem)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'F' is designed with two horizontal bars:
 * - A partial top bar at rows 0 (columns 1-3)
 * - A vertical stem at column 1 from rows 0-5
 * - A full middle crossbar at row 2
 * - No bottom bar (distinguishes F from E)
 *
 * The absence of a bottom bar and the shorter top bar are characteristic
 * features that distinguish 'F' from 'E'.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterF } from './letter-f';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterF;
 * console.log(glyph.rows[2]); // [1, 1, 1, 1] - middle bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('F');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterE (has bottom bar)
 * import { letterF, letterE } from './letters';
 *
 * console.log(letterF.rows[5]); // [0, 1, 0, 0] - stem only
 * console.log(letterE.rows[5]); // [1, 1, 1, 1] - bottom bar
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterE for a similar letter with bottom bar
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterF: Glyph = {
  rows: {
    0: [0, 1, 1, 1], // Top bar partial (primary)
    1: [0, 1, 0, 0], // Stem only (primary)
    2: [1, 1, 1, 1], // Middle bar full (primary)
    3: [0, 1, 0, 0], // Stem only (secondary)
    4: [0, 1, 0, 0], // Stem only (secondary)
    5: [0, 1, 0, 0], // Stem only (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
