import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter S representation
 * @type {LetterData}
 *
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 1 | 0 | 0 | 0 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 1 |
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 |
 * +---+---+---+---+
 * | 0 | 0 | 0 | 0 |
 * +---+---+---+---+
 *
 * Example usage:
 * const blocks = textToBlocks('S');
 */
export const letterS: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    3: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    4: [cellType.SECONDARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY],
    5: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
