import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'P'.
 *
 * This glyph represents the uppercase letter 'P' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a vertical stem with
 * an enclosed upper loop and extending descender, characteristic of the letter 'P'.
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
 * | █ |   |   | █ |  Row 3: Upper loop (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 4: Upper loop (SECONDARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 5: Loop closure (SECONDARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 6: Descender (SECONDARY color)
 * +---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 4 columns (regular width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (top bar and upper loop)
 *   - Rows 3-6: SECONDARY color (lower loop, closure, descender)
 *
 * ## Character Design
 *
 * The letter 'P' is designed with an upper enclosed loop:
 * - Top bar (row 1)
 * - Hollow upper loop from rows 2-4
 * - Loop closure bar at row 5
 * - Extended descender at row 6
 *
 * The enclosed upper portion and extended stem distinguish 'P' from 'B',
 * with the descender extending below the typical letter baseline.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterP } from './letter-p';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterP;
 * console.log(glyph.rows[6]); // [1, 0, 0, 0] - descender
 *
 * // Or render as part of text
 * const blocks = textToBlocks('P');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterB for similar but different loop structure
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterP: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Upper loop (primary)
    3: [1, 0, 0, 1], // Upper loop (secondary)
    4: [1, 0, 0, 1], // Upper loop (secondary)
    5: [1, 1, 1, 1], // Loop closure (secondary)
    6: [1, 0, 0, 0], // Descender (secondary)
  },
};
