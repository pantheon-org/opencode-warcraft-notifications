import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'O'.
 *
 * This glyph represents the uppercase letter 'O' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a hollow rectangular
 * shape with solid bars at the top and bottom, and vertical sides connecting
 * them, creating the characteristic 'O' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Sides, hollow center (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 3: Sides, hollow center (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Sides, hollow center (SECONDARY color)
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
 *   - Row 0: Empty padding
 *   - Rows 1-2: PRIMARY color (top bar and upper sides)
 *   - Rows 3-5: SECONDARY color (lower sides and bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'O' is designed as a hollow rectangle:
 * - A solid horizontal bar at the top (row 1)
 * - Vertical sides at columns 0 and 4 (rows 2-4)
 * - Empty center (columns 1-2 in rows 2-4) creating the hollow effect
 * - A solid horizontal bar at the bottom (row 5)
 *
 * This hollow design is characteristic of letters like O, D, P, Q, and R,
 * creating enclosed or semi-enclosed spaces within the character. The
 * transition to SECONDARY color at row 3 provides visual depth.
 *
 * ## Design Pattern: Hollow Characters
 *
 * The 'O' demonstrates the hollow character pattern used in several letters:
 * - Filled top bar (PRIMARY)
 * - Hollow sides (PRIMARY then SECONDARY)
 * - Filled bottom bar (SECONDARY)
 * - Empty center creates negative space
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterO } from './letter-o';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterO;
 * console.log(glyph.rows[2]); // [1, 0, 0, 1] - sides with hollow center
 *
 * // Or render as part of text
 * const blocks = textToBlocks('O');
 * ```
 *
 * @example
 * ```typescript
 * // Compare hollow vs solid letters
 * import { letterO, letterI } from './letters';
 *
 * // O has hollow center
 * console.log(letterO.rows[3]); // [1, 0, 0, 1] - sides only
 *
 * // I is solid (where it has pixels)
 * console.log(letterI.rows[3]); // [1] - solid column
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterD, letterP, letterQ, letterR for other hollow letters
 * @see textToBlocks in block.ts for rendering usage
 */
export const letterO: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Sides with hollow center (primary)
    3: [1, 0, 0, 1], // Sides with hollow center (secondary)
    4: [1, 0, 0, 1], // Sides with hollow center (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
