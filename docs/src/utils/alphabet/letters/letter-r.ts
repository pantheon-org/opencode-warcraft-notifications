import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'R'.
 *
 * This glyph represents the uppercase letter 'R' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features an upper enclosed loop
 * with a vertical stem extending down, characteristic of the letter 'R'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Upper loop (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 3: Left stem only (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 4: Left stem only (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 5: Left stem only (SECONDARY color)
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
 *   - Rows 1-2: PRIMARY color (top bar and upper loop)
 *   - Rows 3-5: SECONDARY color (left stem)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'R' is designed with an upper loop and straight stem:
 * - Top bar (row 1)
 * - Upper loop with right side (rows 2)
 * - Left stem continuing down (rows 3-5)
 * - No enclosed loop or diagonal leg
 *
 * The open right side from row 3 onward and straight vertical stem
 * distinguish 'R' from 'P' and 'B'.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterR } from './letter-r';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterR;
 * console.log(glyph.rows[3]); // [1, 0, 0, 0] - stem only
 *
 * // Or render as part of text
 * const blocks = textToBlocks('R');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphR = ALPHABET.R; // Same as letterR
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterP for similar shape with closed loop
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterR: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Upper loop (primary)
    3: [1, 0, 0, 0], // Left stem only (secondary)
    4: [1, 0, 0, 0], // Left stem only (secondary)
    5: [1, 0, 0, 0], // Left stem only (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
