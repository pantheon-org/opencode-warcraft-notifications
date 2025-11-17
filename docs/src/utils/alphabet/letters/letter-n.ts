import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'N'.
 *
 * This glyph represents the uppercase letter 'N' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features two vertical stems
 * connected by a top bar, creating the characteristic 'N' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top connecting bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Both stems (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Both stems (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Both stems (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 5: Both stems (SECONDARY color)
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
 *   - Rows 1-2: PRIMARY color (top bar and upper stems)
 *   - Rows 3-5: SECONDARY color (lower stems)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'N' is designed with parallel vertical stems and top connection:
 * - Top horizontal bar connecting both stems (row 1)
 * - Left vertical stem from rows 1-5
 * - Right vertical stem from rows 1-5
 * - Hollow center space (columns 1-2)
 *
 * The top connecting bar and parallel stems create the 'N' shape, with
 * the hollow center providing visual breathing room.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterN } from './letter-n';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterN;
 * console.log(glyph.rows[1]); // [1, 1, 1, 1] - top bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('N');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterH for similar parallel stems design
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterN: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top connecting bar (primary)
    2: [1, 0, 0, 1], // Both stems (primary)
    3: [1, 0, 0, 1], // Both stems (secondary)
    4: [1, 0, 0, 1], // Both stems (secondary)
    5: [1, 0, 0, 1], // Both stems (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
