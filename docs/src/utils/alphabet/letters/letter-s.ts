import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter S representation
 * @type {LetterData}
 * 
 * +---+---+---+---+
 * |   |   |   |   | 0
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 | 1
 * +---+---+---+---+
 * | 1 |   |   |   | 2
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 | 3
 * +---+---+---+---+
 * |   |   |   | 1 | 4
 * +---+---+---+---+
 * | 1 | 1 | 1 | 1 | 5
 * +---+---+---+---+
 * |   |   |   |   | 6
 * +---+---+---+---+
 */
export const letterS: LetterData = {
  rows: {
    0: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.BLANK, cellType.PRIMARY, cellType.PRIMARY, cellType.BLANK],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    3: [cellType.BLANK, cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    4: [cellType.BLANK, cellType.BLANK, cellType.PRIMARY, cellType.BLANK],
    5: [cellType.PRIMARY, cellType.PRIMARY, cellType.BLANK, cellType.BLANK],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
