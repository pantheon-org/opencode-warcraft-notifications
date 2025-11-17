import { describe, it, expect } from 'bun:test';
import { getColorFromLetter, themeType } from './theme';
import { cellType } from './types';

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
    // Mock Glyph
    const mockGlyph = {
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

    // Test LIGHT theme (OpenCode.ai colors)
    expect(getColorFromLetter(mockGlyph, themeType.LIGHT, cellType.PRIMARY)).toBe('#F1ECEC');
    expect(getColorFromLetter(mockGlyph, themeType.LIGHT, cellType.SECONDARY)).toBe('#B7B1B1');
    expect(getColorFromLetter(mockGlyph, themeType.LIGHT, cellType.TERTIARY)).toBe('#4B4646');
    expect(getColorFromLetter(mockGlyph, themeType.LIGHT, cellType.BLANK)).toBe('#FFFFFF');

    // Test DARK theme (uses OpenCode.ai colors)
    expect(getColorFromLetter(mockGlyph, themeType.DARK, cellType.PRIMARY)).toBe('#F1ECEC');
    expect(getColorFromLetter(mockGlyph, themeType.DARK, cellType.SECONDARY)).toBe('#B7B1B1');
    expect(getColorFromLetter(mockGlyph, themeType.DARK, cellType.TERTIARY)).toBe('#4B4646');
    expect(getColorFromLetter(mockGlyph, themeType.DARK, cellType.BLANK)).toBe('#000000');
  });
});
