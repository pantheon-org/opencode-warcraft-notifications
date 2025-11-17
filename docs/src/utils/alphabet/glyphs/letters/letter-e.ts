import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'E'.
 *
 * This glyph represents the uppercase letter 'E' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem on the
 * left with three horizontal bars (top, middle, bottom), creating the
 * characteristic 'E' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Stem with right accent (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 3: Middle bar (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 4: Left stem only (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top bar and upper stem)
 *   - Rows 3-5: SECONDARY color (middle bar, lower stem, bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'E' is designed with three horizontal bars:
 * - A solid top bar (row 1)
 * - A left vertical stem extending from rows 1-5
 * - A right accent at row 2 for balance
 * - A middle crossbar (row 3)
 * - A solid bottom bar (row 5)
 *
 * The three horizontal bars are characteristic of 'E', with the color
 * transition at row 3 adding visual depth.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterE } from './letter-e';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterE;
 * console.log(glyph.rows[3]); // [1, 1, 1, 1] - middle bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('E');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphE = ALPHABET.E; // Same as letterE
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterF for a similar but different design
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterE: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Stem with right accent (primary)
    3: [1, 1, 1, 1], // Middle bar (secondary)
    4: [1, 0, 0, 0], // Left stem (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
