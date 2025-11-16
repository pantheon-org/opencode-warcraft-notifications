import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter X representation
 * @type {Glyph}
 *
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 * | 1 | 1 | 0 | 1 | 1 |
 * +---+---+---+---+---+
 * | 0 | 1 | 1 | 1 | 0 |
 * +---+---+---+---+---+
 * | 0 | 0 | 1 | 0 | 0 |
 * +---+---+---+---+---+
 * | 0 | 1 | 1 | 1 | 0 |
 * +---+---+---+---+---+
 * | 1 | 1 | 0 | 1 | 1 |
 * +---+---+---+---+---+
 * | 0 | 0 | 0 | 0 | 0 |
 * +---+---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('X');
 */
export const letterX: Glyph = {
  rows: {
    0: [0, 0, 0, 0, 0],
    1: [1, 1, 0, 1, 1],
    2: [0, 1, 1, 1, 0],
    3: [0, 0, 1, 0, 0],
    4: [0, 1, 1, 1, 0],
    5: [1, 1, 0, 1, 1],
    6: [0, 0, 0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
