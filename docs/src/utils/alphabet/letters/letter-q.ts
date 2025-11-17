import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'Q'.
 *
 * This glyph represents the uppercase letter 'Q' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a hollow circular shape
 * with a distinctive tail extending to the bottom right, characteristic of 'Q'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Upper sides (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Middle sides (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Lower sides (SECONDARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 5: Bottom bar (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 6: Tail (SECONDARY color)
 * +---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 4 columns (regular width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (top bar and upper sides)
 *   - Rows 3-6: SECONDARY color (lower sides, bottom bar, tail)
 *
 * ## Character Design
 *
 * The letter 'Q' is designed like 'O' with an added tail:
 * - Top bar (row 1)
 * - Hollow circular shape (rows 2-4 with sides only)
 * - Bottom bar (row 5)
 * - Distinctive tail extending to bottom right (row 6)
 *
 * The tail at row 6 is the key distinguishing feature that separates 'Q'
 * from 'O', extending below the typical letter baseline.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterQ } from './letter-q';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterQ;
 * console.log(glyph.rows[6]); // [0, 0, 0, 1] - distinctive tail
 *
 * // Or render as part of text
 * const blocks = textToBlocks('Q');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterO (no tail)
 * import { letterQ, letterO } from './letters';
 *
 * console.log(letterQ.rows[6]); // [0, 0, 0, 1] - has tail
 * console.log(letterO.rows[6]); // [0, 0, 0, 0] - no tail
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterO for similar shape without tail
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterQ: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Upper sides (primary)
    3: [1, 0, 0, 1], // Middle sides (secondary)
    4: [1, 0, 0, 1], // Lower sides (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 1], // Tail (secondary)
  },
};
