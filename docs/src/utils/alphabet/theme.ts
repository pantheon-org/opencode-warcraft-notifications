import { cellType, type Glyph, type CellType } from './types';

export const themeType = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
export type ThemeType = (typeof themeType)[keyof typeof themeType];

export type Theme = {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
};

export const lightTheme: Theme = {
  backgroundColor: '#FFFFFF',
  primaryColor: '#000000',
  secondaryColor: '#9d9d9dff',
};

export const darkTheme: Theme = {
  backgroundColor: '#000000',
  primaryColor: '#FFFFFF',
  secondaryColor: '#626262ff',
};

export const getColorFromLetter = (_glyph: Glyph, theme: ThemeType, cell: CellType): string => {
  const themeData = theme === themeType.DARK ? darkTheme : lightTheme;
  switch (cell) {
    case cellType.PRIMARY:
      return themeData.primaryColor;
    case cellType.SECONDARY:
      return themeData.secondaryColor;
    case cellType.BLANK:
    default:
      return themeData.backgroundColor;
  }
};
