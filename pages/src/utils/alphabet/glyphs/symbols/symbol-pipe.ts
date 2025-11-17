import { type Glyph } from '../../types';

/**
 * Glyph definition for the pipe symbol '|'.
 *
 * This glyph represents the vertical pipe/bar character in a blocky, pixel-art
 * style using a 7-row by 1-column grid. The symbol is a simple vertical line
 * that spans all 7 rows.
 *
 * ## Visual Representation
 *
 * ```
 * +---+
 * | █ |  Row 0: Top (PRIMARY color)
 * +---+
 * | █ |  Row 1: (PRIMARY color)
 * +---+
 * | █ |  Row 2: (PRIMARY color)
 * +---+
 * | █ |  Row 3: (SECONDARY color)
 * +---+
 * | █ |  Row 4: (SECONDARY color)
 * +---+
 * | █ |  Row 5: (SECONDARY color)
 * +---+
 * | █ |  Row 6: Bottom (PRIMARY color - typically padding)
 * +---+
 * ```
 *
 * ## Grid Details
 *
 * - **Width**: 1 column (narrowest possible)
 * - **Height**: 7 rows (standard)
 * - **Color zones**:
 *   - Rows 0-2, 6: PRIMARY color
 *   - Rows 3-5: SECONDARY color
 *
 * ## Character Design
 *
 * The pipe is designed as a continuous vertical line:
 * - Full height vertical line spanning all 7 rows
 * - As the narrowest symbol (1 column wide)
 * - Useful for separators and delimiters
 * - Unlike letter 'I', it has no gaps
 *
 * @type {Glyph}
 *
 * @example
 * ```typescript
 * import { symbolPipe } from './symbol-pipe';
 * import { textToBlocks } from '../block';
 *
 * // Use directly
 * const glyph = symbolPipe;
 * console.log(glyph.rows[3]); // [1] - middle segment
 *
 * // Or render as part of text
 * const blocks = textToBlocks('A|B|C');
 * ```
 *
 * @see {@link Glyph} for the glyph structure documentation
 * @see letterI for comparison with letter 'I' (which has gaps)
 * @see textToBlocks in block.ts for rendering usage
 */
export const symbolPipe: Glyph = {
  rows: {
    0: [1], // Top (primary)
    1: [1], // (primary)
    2: [1], // (primary)
    3: [1], // (secondary)
    4: [1], // (secondary)
    5: [1], // (secondary)
    6: [1], // Bottom (primary)
  },
};
