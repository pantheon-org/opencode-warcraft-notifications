import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'H'.
 *
 * This glyph represents the uppercase letter 'H' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features two vertical stems
 * connected by a horizontal crossbar in the middle, creating the characteristic
 * 'H' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * | █ |   |   |   |  Row 0: Left stem top (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 1: Left stem (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 2: Crossbar (PRIMARY color)
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
 *   - Rows 0-2: PRIMARY color (upper left stem and crossbar)
 *   - Rows 3-5: SECONDARY color (lower stems both sides)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'H' is designed with parallel vertical stems and crossbar:
 * - Left vertical stem starting at row 0
 * - Horizontal crossbar at row 2 connecting the stems
 * - Right vertical stem starting at row 2
 * - Both stems continue through row 5
 *
 * The crossbar at row 2 is the defining feature of 'H', connecting the two
 * vertical stems. The color transition adds visual depth to the lower portion.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterH } from './letter-h';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterH;
 * console.log(glyph.rows[2]); // [1, 1, 1, 1] - crossbar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('H');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphH = ALPHABET.H; // Same as letterH
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterH: Glyph = {
  rows: {
    0: [1, 0, 0, 0], // Left stem top (primary)
    1: [1, 0, 0, 0], // Left stem (primary)
    2: [1, 1, 1, 1], // Crossbar (primary)
    3: [1, 0, 0, 1], // Both stems (secondary)
    4: [1, 0, 0, 1], // Both stems (secondary)
    5: [1, 0, 0, 1], // Both stems (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
