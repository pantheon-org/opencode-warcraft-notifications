import { type Glyph } from './types';

/**
 * Glyph definition for the letter 'M'.
 *
 * This glyph represents the uppercase letter 'M' in a blocky, pixel-art style
 * using a 7-row by 5-column grid. As one of the widest letters in the alphabet
 * (along with 'W'), 'M' features the characteristic double-peaked shape with
 * vertical sides.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+---+
 * | █ | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   | █ |   | █ |  Row 2: M peaks (PRIMARY color)
 * +---+---+---+---+---+
 * | █ |   | █ |   | █ |  Row 3: M peaks continued (SECONDARY color)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 4: Vertical sides (SECONDARY color)
 * +---+---+---+---+---+
 * | █ |   |   |   | █ |  Row 5: Vertical sides continued (SECONDARY color)
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 5 columns (widest letter in the alphabet, along with W)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Row 0: Empty padding
 *   - Rows 1-2: PRIMARY color (top bar and upper peaks)
 *   - Rows 3-5: SECONDARY color (lower peaks and sides)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'M' is designed to show the characteristic double-peaked shape:
 * - A solid horizontal bar at the top (row 1)
 * - Two internal peaks at column 2 (rows 2-3) creating the M shape
 * - Vertical sides at columns 0 and 4 extending to row 5
 * - Empty spaces between peaks and sides for visual clarity
 *
 * The transition to SECONDARY color at row 3 provides depth and helps
 * distinguish the upper peaks from the lower vertical portions.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterM } from './letter-m';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterM;
 * console.log(glyph.rows[2]); // [1, 0, 1, 0, 1] - M peaks
 *
 * // Or render as part of text
 * const blocks = textToBlocks('M');
 * ```
 *
 * @example
 * ```typescript
 * // Compare widths
 * import { letterI, letterM, letterW } from './letters';
 *
 * console.log(letterI.rows[2].length); // 1 column (narrowest)
 * console.log(letterM.rows[2].length); // 5 columns (widest)
 * console.log(letterW.rows[2].length); // 5 columns (widest)
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterW for another 5-column wide letter
 * @see letterI for the narrowest letter (1 column)
 * @see textToBlocks in block.ts for rendering usage
 */
export const letterM: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 1, 0, 1], // M peaks upper (primary)
    3: [1, 0, 1, 0, 1], // M peaks middle (secondary)
    4: [1, 0, 0, 0, 1], // Vertical sides (secondary)
    5: [1, 0, 0, 0, 1], // Vertical sides bottom (secondary)
    6: [0, 0, 0, 0, 0], // Bottom padding
  },
};
