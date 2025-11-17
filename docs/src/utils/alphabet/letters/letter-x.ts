import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'X'.
 *
 * This glyph represents the uppercase letter 'X' in a blocky, pixel-art style
 * using a 7-row by 5-column grid. The letter features two diagonal lines
 * crossing at the center, creating the characteristic 'X' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+---+
 * | █ | █ |   | █ | █ |  Row 1: Top corners (PRIMARY color)
 * +---+---+---+---+---+
 * |   | █ | █ | █ |   |  Row 2: Upper diagonals converging (PRIMARY color)
 * +---+---+---+---+---+
 * |   |   | █ |   |   |  Row 3: Center crossing point (SECONDARY color)
 * +---+---+---+---+---+
 * |   | █ | █ | █ |   |  Row 4: Lower diagonals diverging (SECONDARY color)
 * +---+---+---+---+---+
 * | █ | █ |   | █ | █ |  Row 5: Bottom corners (SECONDARY color)
 * +---+---+---+---+---+
 * |   |   |   |   |   |  Row 6: Bottom padding (empty)
 * +---+---+---+---+---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 5 columns (wide)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 1-2: PRIMARY color (top corners and upper diagonals)
 *   - Rows 3-5: SECONDARY color (center crossing and lower diagonals)
 *   - Rows 0, 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'X' is designed with crossing diagonals:
 * - Four corner groups at rows 1 and 5
 * - Diagonals converging to center (rows 2-3)
 * - Center crossing point at column 2, row 3
 * - Diagonals diverging from center (rows 3-4)
 *
 * The symmetrical crossing diagonals create the classic X-shape, with
 * the center crossing point being the focal element of the letter.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterX} from './letter-x';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterX;
 * console.log(glyph.rows[3]); // [0, 0, 1, 0, 0] - center crossing
 *
 * // Or render as part of text
 * const blocks = textToBlocks('X');
 * ```
 *
 * @example
 * ```typescript
 * // Access from ALPHABET
 * import { ALPHABET } from '../types';
 *
 * const glyphX = ALPHABET.X; // Same as letterX
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterV for similar diagonal convergence
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterX: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0], // Top padding
    1: [1, 1, 0, 1, 1], // Top corners (primary)
    2: [0, 1, 1, 1, 0], // Upper diagonals converging (primary)
    3: [0, 0, 1, 0, 0], // Center crossing point (secondary)
    4: [0, 1, 1, 1, 0], // Lower diagonals diverging (secondary)
    5: [1, 1, 0, 1, 1], // Bottom corners (secondary)
    6: [0, 0, 0, 0, 0], // Bottom padding
  },
};
