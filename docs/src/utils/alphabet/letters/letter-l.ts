import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'L'.
 *
 * This glyph represents the uppercase letter 'L' in a blocky, pixel-art style
 * using a 7-row by 3-column grid. The letter features a simple vertical stem
 * with a horizontal bar at the bottom, creating the characteristic 'L' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+
 * | █ |   |   |  Row 0: Stem top (PRIMARY color)
 * +---+---+---+
 * | █ |   |   |  Row 1: Stem (PRIMARY color)
 * +---+---+---+
 * | █ |   |   |  Row 2: Stem (PRIMARY color)
 * +---+---+---+
 * | █ |   |   |  Row 3: Stem (SECONDARY color)
 * +---+---+---+
 * | █ |   |   |  Row 4: Stem (SECONDARY color)
 * +---+---+---+
 * | █ | █ | █ |  Row 5: Bottom bar (SECONDARY color)
 * +---+---+---+
 * |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 3 columns (narrow width)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-2: PRIMARY color (upper stem)
 *   - Rows 3-5: SECONDARY color (lower stem and bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'L' is designed with simple perpendicular lines:
 * - Vertical stem on the left from rows 0-5
 * - Horizontal bar at the bottom (row 5)
 * - Right side open (columns 1-2 empty except row 5)
 *
 * The simplicity of 'L' with just a vertical stem and bottom bar makes it
 * one of the most straightforward letters. The color transition adds visual
 * interest to the otherwise minimal design.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterL } from './letter-l';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterL;
 * console.log(glyph.rows[5]); // [1, 1, 1] - bottom bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('L');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphL = ALPHABET.L; // Same as letterL
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterI for another simple vertical letter
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterL: Glyph = {
  rows: {
    0: [1, 0, 0], // Stem top (primary)
    1: [1, 0, 0], // Stem (primary)
    2: [1, 0, 0], // Stem (primary)
    3: [1, 0, 0], // Stem (secondary)
    4: [1, 0, 0], // Stem (secondary)
    5: [1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0], // Bottom padding
  },
};
