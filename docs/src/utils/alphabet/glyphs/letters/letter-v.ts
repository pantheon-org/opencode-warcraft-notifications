import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'V'.
 *
 * This glyph represents the uppercase letter 'V' in a blocky, pixel-art style
 * using a 7-row by 5-column grid. The letter features diagonal lines converging
 * to a point at the bottom, creating the characteristic 'V' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 1: Top corners (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 2: Upper diagonals (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 3: Diagonals converging (SECONDARY color)
 * +---+---+---+---+---+
 * |   | █ |   | █ |   |  Row 4: Inner diagonals (SECONDARY color)
 * +---+---+---+---+---+
 * |   |   | █ |   |   |  Row 5: Bottom point (SECONDARY color)
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 5 columns (wide)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (top corners and upper diagonals)
 *   - Rows 3-5: SECONDARY color (converging diagonals to point)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'V' is designed with converging diagonal lines:
 * - Top corners at columns 0 and 4 (rows 1-3)
 * - Diagonals converging inward (row 4 at columns 1 and 3)
 * - Bottom point at center column 2 (row 5)
 *
 * The converging diagonals from wide top to narrow bottom create the
 * characteristic V-shape, with the 5-column width providing proper
 * proportions for the diagonal convergence.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterV } from './letter-v';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterV;
 * console.log(glyph.rows[5]); // [0, 0, 1, 0, 0] - bottom point
 *
 * // Or render as part of text
 * const blocks = textToBlocks('V');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphV = ALPHABET.V; // Same as letterV
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterW for inverted V shapes (double peak)
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterV: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0], // Top padding
    1: [1, 0, 0, 0, 1], // Top corners (primary)
    2: [1, 0, 0, 0, 1], // Upper diagonals (primary)
    3: [1, 0, 0, 0, 1], // Diagonals converging (secondary)
    4: [0, 1, 0, 1, 0], // Inner diagonals (secondary)
    5: [0, 0, 1, 0, 0], // Bottom point (secondary)
    6: [0, 0, 0, 0, 0], // Bottom padding
  },
};
