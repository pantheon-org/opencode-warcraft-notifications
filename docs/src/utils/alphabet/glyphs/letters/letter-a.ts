import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'A'.
 *
 * This glyph represents the uppercase letter 'A' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a horizontal bar at the
 * top (row 1), a vertical stroke on the right (row 2), and a crossbar with
 * sides extending down to the bottom.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 2: Right side (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 3: Middle bar (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Left and right sides (SECONDARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 5: Bottom connection (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (#FFFFFF in dark theme, #000000 in light theme)
 *   - Rows 3-5: SECONDARY color (#626262ff in dark theme, #9d9d9dff in light theme)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'A' is designed to be easily recognizable with:
 * - A solid horizontal top bar (row 1)
 * - A right vertical stroke connecting at row 2
 * - A crossbar at row 3 for the characteristic 'A' shape
 * - Vertical sides extending to row 5
 *
 * The use of SECONDARY color in rows 3-5 provides visual depth and separates
 * the lower portion of the letter from the top bar.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterA } from './letter-a';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterA;
 * console.log(glyph.rows[1]); // [1, 1, 1, 1] - top bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('A');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphA = ALPHABET.A; // Same as letterA
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterA: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [0, 0, 0, 1], // Right side (primary)
    3: [1, 1, 1, 1], // Middle bar (secondary)
    4: [1, 0, 0, 1], // Sides (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
