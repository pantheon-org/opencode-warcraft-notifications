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
  tertiaryColor: string;
};

export const lightTheme: Theme = {
  backgroundColor: '#FFFFFF',
  primaryColor: '#F1ECEC', // Light (OpenCode.ai)
  secondaryColor: '#B7B1B1', // Medium (OpenCode.ai)
  tertiaryColor: '#4B4646', // Dark (OpenCode.ai)
};

export const darkTheme: Theme = {
  backgroundColor: '#000000',
  primaryColor: '#F1ECEC', // Light (OpenCode.ai dark mode logo)
  secondaryColor: '#B7B1B1', // Medium (OpenCode.ai dark mode logo)
  tertiaryColor: '#4B4646', // Dark (OpenCode.ai dark mode logo)
};

export const getColorFromLetter = (_glyph: Glyph, theme: ThemeType, cell: CellType): string => {
  const themeData = theme === themeType.DARK ? darkTheme : lightTheme;
  switch (cell) {
    case cellType.PRIMARY:
      return themeData.primaryColor;
    case cellType.SECONDARY:
      return themeData.secondaryColor;
    case cellType.TERTIARY:
      return themeData.tertiaryColor;
    case cellType.BLANK:
    default:
      return themeData.backgroundColor;
  }
};
