import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter J representation
 * @type {LetterData}
 * 
 * +---+---+---+---+
 * |   |   |   |   | 0
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 | 1
 * +---+---+---+---+
 * |   |   |   | 1 | 2
 * +---+---+---+---+
 * | 1 |   |   | 1 | 3
 * +---+---+---+---+
 * | 1 |   |   | 1 | 4
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 | 5
 * +---+---+---+---+
 * |   |   |   |   | 6
 * +---+---+---+---+
 */
export const letterJ: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.BLANK, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    2: [cellType.BLANK, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    3: [cellType.BLANK, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    4: [cellType.PRIMARY, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    5: [cellType.BLANK, cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
