import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'S'.
 *
 * This glyph represents the uppercase letter 'S' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a distinctive curved
 * S-shape with horizontal bars alternating sides, characteristic of 'S'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   |   |  Row 2: Left side (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 3: Middle bar (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 4: Right side (SECONDARY color)
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
 *   - Rows 1-2: PRIMARY color (top bar and left side)
 *   - Rows 3-5: SECONDARY color (middle bar, right side, bottom bar)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'S' is designed with an alternating curved shape:
 * - Top bar (row 1)
 * - Left side only (row 2)
 * - Middle connecting bar (row 3)
 * - Right side only (row 4)
 * - Bottom bar (row 5)
 *
 * The alternating sides create the characteristic S-curve, with the middle
 * bar providing the transition point between upper and lower curves.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterS } from './letter-s';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterS;
 * console.log(glyph.rows[3]); // [1, 1, 1, 1] - middle transition bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('S');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../../types';
 *
 * const glyphS = ALPHABET.S; // Same as letterS
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterS: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 0], // Left side (primary)
    3: [1, 1, 1, 1], // Middle bar (secondary)
    4: [0, 0, 0, 1], // Right side (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
