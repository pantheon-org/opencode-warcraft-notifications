import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'Z'.
 *
 * This glyph represents the uppercase letter 'Z' in a blocky, pixel-art style
 * using a 7-row by 3-column grid. The letter features horizontal bars at top
 * and bottom with a diagonal line connecting them, characteristic of 'Z'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+
 * |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+
 * | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+
 * |   |   | █ |  Row 2: Diagonal upper (PRIMARY color)
 * +---+---+---+
 * |   | █ |   |  Row 3: Diagonal middle (SECONDARY color)
 * +---+---+---+
 * | █ |   |   |  Row 4: Diagonal lower (SECONDARY color)
 * +---+---+---+
 * | █ | █ | █ |  Row 5: Bottom bar (SECONDARY color)
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
 *   - Rows 1-2: PRIMARY color (top bar and upper diagonal)
 *   - Rows 3-5: SECONDARY color (middle/lower diagonal and bottom bar)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'Z' is designed with distinctive diagonal pattern:
 * - Top horizontal bar (row 1)
 * - Diagonal line descending from top-right to bottom-left (rows 2-4)
 * - Bottom horizontal bar (row 5)
 *
 * The diagonal connecting the parallel horizontal bars creates the
 * characteristic Z-shape. As a narrow 3-column letter, it maintains
 * good readability despite its compact width.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterZ } from './letter-z';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterZ;
 * console.log(glyph.rows[3]); // [0, 1, 0] - diagonal middle
 *
 * // Or render as part of text
 * const blocks = textToBlocks('Z');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphZ = ALPHABET.Z; // Same as letterZ
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterN for similar diagonal but different orientation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterZ: Glyph = {
  rows: {
    0: [0, 0, 0], // Top padding
    1: [1, 1, 1], // Top bar (primary)
    2: [0, 0, 1], // Diagonal upper (primary)
    3: [0, 1, 0], // Diagonal middle (secondary)
    4: [1, 0, 0], // Diagonal lower (secondary)
    5: [1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0], // Bottom padding
  },
};
