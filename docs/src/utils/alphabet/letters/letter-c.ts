import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'C'.
 *
 * This glyph represents the uppercase letter 'C' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a characteristic open
 * curved shape with horizontal bars at top and bottom and a left vertical stem,
 * with the right side remaining open.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 2: Left stem (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 3: Left stem (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 4: Left stem (SECONDARY color)
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
 *   - Rows 0: Empty padding
 *   - Rows 1-2: PRIMARY color (top bar and upper stem)
 *   - Rows 3-5: SECONDARY color (lower stem and bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'C' is designed as an open curved shape:
 * - A solid horizontal bar at the top (row 1)
 * - A left vertical stem from rows 2-4
 * - Open right side (columns 1-3 empty for rows 2-4)
 * - A solid horizontal bar at the bottom (row 5)
 *
 * The open right side distinguishes 'C' from 'O', creating the characteristic
 * C-shape. The color transition at row 3 provides visual depth.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterC } from './letter-c';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterC;
 * console.log(glyph.rows[2]); // [1, 0, 0, 0] - left stem only
 *
 * // Or render as part of text
 * const blocks = textToBlocks('C');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterO (closed shape)
 * import { letterC, letterO } from './letters';
 *
 * console.log(letterC.rows[3]); // [1, 0, 0, 0] - open on right
 * console.log(letterO.rows[3]); // [1, 0, 0, 1] - closed shape
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterO for a similar but closed shape
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterC: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 0], // Left stem (primary)
    3: [1, 0, 0, 0], // Left stem (secondary)
    4: [1, 0, 0, 0], // Left stem (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
