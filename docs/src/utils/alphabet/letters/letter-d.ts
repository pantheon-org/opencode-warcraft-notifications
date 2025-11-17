import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'D'.
 *
 * This glyph represents the uppercase letter 'D' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem on the
 * left with a curved right side creating an enclosed space, characteristic
 * of the letter 'D'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   | █ |  Row 0: Right top accent (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Stem and right side (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Stem and right side (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Stem and right side (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top accent, top bar, upper sides)
 *   - Rows 3-5: SECONDARY color (lower sides and bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'D' is designed with an enclosed curved shape:
 * - A right accent at row 0 column 3 for visual balance
 * - A solid horizontal bar at the top (row 1)
 * - Left vertical stem from rows 1-5
 * - Right vertical side from rows 2-4 creating the curve
 * - Hollow center (columns 1-2 for rows 2-4)
 * - A solid horizontal bar at the bottom (row 5)
 *
 * The enclosed space and curved right side distinguish 'D' from other letters,
 * with the SECONDARY color transition adding depth.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterD } from './letter-d';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterD;
 * console.log(glyph.rows[0]); // [0, 0, 0, 1] - top right accent
 *
 * // Or render as part of text
 * const blocks = textToBlocks('D');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphD = ALPHABET.D; // Same as letterD
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterO for a similar hollow letter
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterD: Glyph = {
  rows: {
    0: [0, 0, 0, 1], // Right top accent (primary)
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Stem and right side (primary)
    3: [1, 0, 0, 1], // Stem and right side (secondary)
    4: [1, 0, 0, 1], // Stem and right side (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
