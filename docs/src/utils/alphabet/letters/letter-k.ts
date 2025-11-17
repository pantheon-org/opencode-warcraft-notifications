import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'K'.
 *
 * This glyph represents the uppercase letter 'K' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem on the
 * left with diagonal strokes extending to the upper right and lower right,
 * creating the characteristic 'K' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * | █ |   |   |   |  Row 0: Stem top (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 1: Stem and upper diagonal (PRIMARY color)
 * +---+---+---+---+
 * | █ |   | █ |   |  Row 2: Stem and diagonal meeting (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ |   |   |  Row 3: Stem and junction (SECONDARY color)
 * +---+---+---+---+
 * | █ |   | █ |   |  Row 4: Stem and diagonal (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 5: Stem and lower diagonal (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (upper stem and upper diagonal)
 *   - Rows 3-5: SECONDARY color (lower stem and lower diagonal)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'K' is designed with angular diagonal strokes:
 * - Left vertical stem from rows 0-5
 * - Upper diagonal from top-right (row 1) meeting at row 2
 * - Junction point at row 3
 * - Lower diagonal extending to bottom-right (rows 4-5)
 *
 * The angular diagonals meeting at a junction point distinguish 'K' from other
 * letters, creating a distinctive asymmetric shape. The color transition adds
 * depth to the lower portion.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterK } from './letter-k';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterK;
 * console.log(glyph.rows[3]); // [1, 1, 0, 0] - junction point
 *
 * // Or render as part of text
 * const blocks = textToBlocks('K');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphK = ALPHABET.K; // Same as letterK
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterK: Glyph = {
  rows: {
    0: [1, 0, 0, 0], // Stem top (primary)
    1: [1, 0, 0, 1], // Stem and upper diagonal (primary)
    2: [1, 0, 1, 0], // Stem and diagonal meeting (primary)
    3: [1, 1, 0, 0], // Stem and junction (secondary)
    4: [1, 0, 1, 0], // Stem and diagonal (secondary)
    5: [1, 0, 0, 1], // Stem and lower diagonal (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
