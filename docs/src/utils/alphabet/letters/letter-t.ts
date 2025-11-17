import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'T'.
 *
 * This glyph represents the uppercase letter 'T' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a horizontal top bar
 * with a central vertical stem, characteristic of the letter 'T'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   | █ |   |   |  Row 0: Top stem accent (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 2: Vertical stem (PRIMARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 3: Vertical stem (SECONDARY color)
 * +---+---+---+---+
 * |   | █ |   |   |  Row 4: Vertical stem (SECONDARY color)
 * +---+---+---+---+
 * |   | █ | █ |   |  Row 5: Stem with bottom accent (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top accent, top bar, upper stem)
 * - Rows 3-5: SECONDARY color (lower stem with bottom accent)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'T' is designed with a centered vertical stem:
 * - Top accent at column 1 (row 0)
 * - Horizontal top bar (row 1)
 * - Central vertical stem from rows 2-5 (column 1)
 * - Bottom accent extending right at row 5
 *
 * The centered stem and horizontal top bar create the classic T-shape,
 * with accents adding visual balance and preventing a rigid appearance.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterT } from './letter-t';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterT;
 * console.log(glyph.rows[1]); // [1, 1, 1, 1] - top bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('T');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphT = ALPHABET.T; // Same as letterT
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterT: Glyph = {
  rows: {
    0: [0, 1, 0, 0], // Top stem accent (primary)
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [0, 1, 0, 0], // Vertical stem (primary)
    3: [0, 1, 0, 0], // Vertical stem (secondary)
    4: [0, 1, 0, 0], // Vertical stem (secondary)
    5: [0, 1, 1, 0], // Stem with bottom accent (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
