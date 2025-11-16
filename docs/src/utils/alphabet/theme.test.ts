import { describe, it, expect } from 'bun:test';
import { getColorFromLetter, themeType } from './theme';
import { cellType } from './letters/types';

describe('themeType', () => {
  it('should have LIGHT and DARK properties', () => {
    expect(themeType).toHaveProperty('LIGHT');
    expect(themeType).toHaveProperty('DARK');
  });
});

describe('themeType values', () => {
  it('should have correct values for LIGHT and DARK', () => {
    expect(themeType.LIGHT).toBe('light');
    expect(themeType.DARK).toBe('dark');
  });
});

describe('getColorFromLetter function', () => {
  it('should return correct colors based on cell type and theme', () => {
    // Mock LetterData
    const mockLetterData = {
      rows: [],
      theme: {
        [themeType.LIGHT]: {
          backgroundColor: '#FFFFFF',
          primaryColor: '#000000',
          secondaryColor: '#9d9d9dff',
        },
        [themeType.DARK]: {
          backgroundColor: '#000000',
          primaryColor: '#FFFFFF',
          secondaryColor: '#626262ff',
        },
      },
    };

    // Test LIGHT theme
    expect(getColorFromLetter(mockLetterData, themeType.LIGHT, cellType.PRIMARY)).toBe('#000000');
    expect(getColorFromLetter(mockLetterData, themeType.LIGHT, cellType.SECONDARY)).toBe('#9d9d9dff');
    expect(getColorFromLetter(mockLetterData, themeType.LIGHT, cellType.BLANK)).toBe('#FFFFFF');

    // Test DARK theme
    expect(getColorFromLetter(mockLetterData, themeType.DARK, cellType.PRIMARY)).toBe('#FFFFFF');
    expect(getColorFromLetter(mockLetterData, themeType.DARK, cellType.SECONDARY)).toBe('#626262ff');
    expect(getColorFromLetter(mockLetterData, themeType.DARK, cellType.BLANK)).toBe('#000000');
  });
});