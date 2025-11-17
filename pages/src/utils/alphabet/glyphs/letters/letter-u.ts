import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'U'.
 *
 * This glyph represents the uppercase letter 'U' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features two vertical stems
 * connected by a bottom bar, creating the characteristic 'U' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 1: Both stems (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Both stems (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Both stems (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Both stems (SECONDARY color)
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
 *   - Rows 1-2: PRIMARY color (upper stems)
 *   - Rows 3-5: SECONDARY color (lower stems and bottom bar)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'U' is designed with parallel vertical stems and bottom connection:
 * - Left and right vertical stems from rows 1-4
 * - Hollow center space (columns 1-2)
 * - Bottom horizontal bar connecting the stems (row 5)
 *
 * The parallel stems with bottom connection create the classic U-shape,
 * with the hollow center providing visual clarity and readability.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterU } from './letter-u';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterU;
 * console.log(glyph.rows[5]); // [1, 1, 1, 1] - bottom connecting bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('U');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphU = ALPHABET.U; // Same as letterU
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterN for similar parallel stems with top bar
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterU: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 0, 0, 1], // Both stems (primary)
    2: [1, 0, 0, 1], // Both stems (primary)
    3: [1, 0, 0, 1], // Both stems (secondary)
    4: [1, 0, 0, 1], // Both stems (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
