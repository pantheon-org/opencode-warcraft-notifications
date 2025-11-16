import { darkTheme, lightTheme, themeType } from '../theme';
import { type Glyph } from './types';

/**
 * Letter O representation
 * @type {Glyph}
 *
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('O');
 */
export const letterO: Glyph = {
  rows: {
    0: [0, 0, 0, 0],
    1: [1, 1, 1, 1],
    2: [1, 0, 0, 1],
    3: [1, 0, 0, 1],
    4: [1, 0, 0, 1],
    5: [1, 1, 1, 1],
    6: [0, 0, 0, 0],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
