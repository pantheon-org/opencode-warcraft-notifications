import { darkTheme, lightTheme, themeType } from '../theme';
import { cellType, type LetterData } from './types';

/**
 * Letter H representation
 * @type {LetterData}
 */
export const letterH: LetterData = {
  rows: {
    0: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.BLANK],
    1: [cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY, cellType.PRIMARY],
    2: [cellType.PRIMARY, cellType.BLANK, cellType.BLANK, cellType.PRIMARY],
    3: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY],
    4: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY],
    5: [cellType.PRIMARY, cellType.SECONDARY, cellType.SECONDARY, cellType.PRIMARY],
    6: [cellType.BLANK, cellType.BLANK, cellType.BLANK, cellType.BLANK],
  },
  theme: {
    [themeType.LIGHT]: lightTheme,
    [themeType.DARK]: darkTheme,
  },
};
