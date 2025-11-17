import { type Glyph } from '../../types';

/**
 * Glyph definition for the letter 'J'.
 *
 * This glyph represents the uppercase letter 'J' in a blocky, pixel-art style
 * using a 7-row by 3-column grid. The letter features a vertical stem on the
 * right with a curved bottom hook to the left, characteristic of the letter 'J'.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+
 * |   |   | █ |  Row 0: Top of stem (PRIMARY color)
 * +---+---+---+
 * |   |   |   |  Row 1: Gap (empty)
 * +---+---+---+
 * |   |   | █ |  Row 2: Stem (PRIMARY color)
 * +---+---+---+
 * |   |   | █ |  Row 3: Stem (SECONDARY color)
 * +---+---+---+
 * | █ |   | █ |  Row 4: Hook begins (SECONDARY color)
 * +---+---+---+
 * | █ | █ | █ |  Row 5: Bottom hook (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top stem)
 *   - Rows 3-5: SECONDARY color (lower stem and hook)
 *   - Rows 1, 6: Empty (gap and padding)
 *
 * ## Character Design
 *
 * The letter 'J' is designed with a descending hook:
 * - Top dot at row 0
 * - Gap at row 1 for visual separation
 * - Right vertical stem from rows 2-4
 * - Left hook starting at row 4
 * - Bottom curved section at row 5
 *
 * The descending hook distinguishes 'J' from 'I', with the gap at row 1
 * preventing it from looking like a continuous vertical line.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterJ } from './letter-j';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterJ;
 * console.log(glyph.rows[5]); // [1, 1, 1] - bottom hook
 *
 * // Or render as part of text
 * const blocks = textToBlocks('J');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterI (no hook)
 * import { letterJ, letterI } from './letters';
 *
 * console.log(letterJ.rows[5]); // [1, 1, 1] - has hook
 * console.log(letterI.rows[5]); // [1] - straight stem
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterI for similar but straight stem
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterJ: Glyph = {
  rows: {
    0: [0, 0, 1], // Top of stem (primary)
    1: [0, 0, 0], // Gap
    2: [0, 0, 1], // Stem (primary)
    3: [0, 0, 1], // Stem (secondary)
    4: [1, 0, 1], // Hook begins (secondary)
    5: [1, 1, 1], // Bottom hook (secondary)
    6: [0, 0, 0], // Bottom padding
  },
};
