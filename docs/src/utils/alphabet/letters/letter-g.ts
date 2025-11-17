import { type Glyph } from '../types';

/**
 * Glyph definition for the letter 'G'.
 *
 * This glyph represents the uppercase letter 'G' in a blocky, pixel-art style
 * using a 7-row by 4-column grid. The letter features a C-like curved shape
 * with an inner horizontal bar, creating the characteristic 'G' shape.
 *
 * ## Visual Representation
 *
 * ```
 * +---+---+---+---+
 * |   |   |   |   |  Row 0: Top padding (empty)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 1: Top bar (PRIMARY color)
 * +---+---+---+---+
 * | █ |   |   | █ |  Row 2: Sides (PRIMARY color)
 * +---+---+---+---+
 * | █ | █ | █ | █ |  Row 3: Inner bar (SECONDARY color)
 * +---+---+---+---+
 * |   |   |   | █ |  Row 4: Right side only (SECONDARY color)
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
 *   - Rows 0-2: PRIMARY color (top bar and upper sides)
 *   - Rows 3-5: SECONDARY color (inner bar, right side, bottom bar)
 *   - Row 6: Empty padding
 *
 * ## Character Design
 *
 * The letter 'G' is designed as a modified 'C' with an inner bar:
 * - A solid top bar (row 1)
 * - Left stem at row 2 and right accent
 * - An inner horizontal bar at row 3 (key feature)
 * - Right vertical side at row 4
 * - A solid bottom bar (row 5)
 *
 * The inner horizontal bar at row 3 distinguishes 'G' from 'C', creating
 * the characteristic enclosed space typical of the letter 'G'.
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { letterG } from './letter-g';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = letterG;
 * console.log(glyph.rows[3]); // [1, 1, 1, 1] - inner bar
 *
 * // Or render as part of text
 * const blocks = textToBlocks('G');
 * ```
 *
 * @example
 * ```typescript
 * // Compare with letterC (no inner bar)
 * import { letterG, letterC } from './letters';
 *
 * console.log(letterG.rows[3]); // [1, 1, 1, 1] - has inner bar
 * console.log(letterC.rows[3]); // [1, 0, 0, 0] - no inner bar
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterC for similar shape without inner bar
 * @see textToBlocks in block.ts for rendering usage
 * @see ALPHABET in types.ts for accessing this glyph
 */
export const letterG: Glyph = {
  rows: {
    0: [0, 0, 0, 0], // Top padding
    1: [1, 1, 1, 1], // Top bar (primary)
    2: [1, 0, 0, 1], // Sides (primary)
    3: [1, 1, 1, 1], // Inner bar (secondary)
    4: [0, 0, 0, 1], // Right side only (secondary)
    5: [1, 1, 1, 1], // Bottom bar (secondary)
    6: [0, 0, 0, 0], // Bottom padding
  },
};
