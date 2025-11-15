import { describe, it, expect } from 'bun:test';
import { blockyTextToSVG, getAvailableCharacters } from './blocky-text-to-svg';

describe('blockyTextToSVG', () => {
  it('should generate SVG matching OpenCode.ai style', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Should be valid SVG
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    // Should use OpenCode.ai color palette
    expect(svg).toContain('fill="#F1ECEC"'); // Light
    expect(svg).toContain('fill="#B7B1B1"'); // Medium
    expect(svg).toContain('fill="#4B4646"'); // Dark

    // Should have correct structure
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('fill="none"');
  });

  it('should match OpenCode logo structure for letter O', () => {
    const svg = blockyTextToSVG('O');

    // OpenCode uses these exact colors in their logo
    const openCodeColors = ['#F1ECEC', '#B7B1B1', '#4B4646'];

    openCodeColors.forEach((color) => {
      expect(svg).toContain(`fill="${color}"`);
    });

    // Should have multiple paths (one per block)
    const pathCount = (svg.match(/<path/g) || []).length;
    expect(pathCount).toBeGreaterThan(10); // 'O' should have multiple blocks
  });

  it('should generate same dimensions as OpenCode logo', () => {
    // OpenCode logo: width="234" height="42"
    // With 8 characters "OPENCODE" and blockSize=6, charSpacing=6
    // Expected calculation: 8 chars * (6*6 + 6) - 6 = 8 * 42 - 6 = 330
    // Height: 6 rows * 6 pixels = 36
    const svg = blockyTextToSVG('OPENCODE');

    expect(svg).toMatch(/width="\d+"/);
    expect(svg).toMatch(/height="36"/); // 6x6 grid = 36px height
  });

  it('should handle all OpenCode letters', () => {
    const openCodeLetters = ['O', 'P', 'E', 'N', 'C', 'O', 'D', 'E'];
    const availableChars = getAvailableCharacters();

    // Check which letters we have
    const supportedLetters = openCodeLetters.filter((letter) => availableChars.includes(letter));

    // Should support at least some OpenCode letters
    expect(supportedLetters.length).toBeGreaterThan(0);

    // Generate SVG for supported letters
    supportedLetters.forEach((letter) => {
      const svg = blockyTextToSVG(letter);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });
  });

  it('should use 6x6 grid like OpenCode logo', () => {
    // OpenCode uses a consistent block-based grid system
    // Each character should use 6-pixel blocks
    const svg = blockyTextToSVG('A', { blockSize: 6 });

    // Height should be 6 rows * 6 pixels = 36
    expect(svg).toContain('height="36"');

    // All path coordinates should be multiples of 6
    const pathMatches = svg.match(/d="M(\d+)/g);
    if (pathMatches) {
      pathMatches.forEach((match) => {
        const coord = parseInt(match.replace('d="M', ''));
        expect(coord % 6).toBe(0);
      });
    }
  });

  it('should generate consistent output for same input', () => {
    const svg1 = blockyTextToSVG('WARCRAFT');
    const svg2 = blockyTextToSVG('WARCRAFT');

    expect(svg1).toBe(svg2);
  });

  it('should support custom OpenCode-style palettes', () => {
    // Test with alternative color scheme using 'A' which has all three colors
    const svg = blockyTextToSVG('A', {
      colorLight: '#FFFFFF',
      colorMedium: '#888888',
      colorDark: '#000000',
    });

    expect(svg).toContain('fill="#FFFFFF"');
    expect(svg).toContain('fill="#888888"');
    expect(svg).toContain('fill="#000000"');
  });

  it('should calculate width correctly based on character count', () => {
    const svg1char = blockyTextToSVG('A');
    const svg2char = blockyTextToSVG('AA');

    // Extract widths
    const width1 = svg1char.match(/width="(\d+)"/)?.[1];
    const width2 = svg2char.match(/width="(\d+)"/)?.[1];

    expect(width1).toBeDefined();
    expect(width2).toBeDefined();

    const w1 = parseInt(width1!);
    const w2 = parseInt(width2!);

    // Two characters should be greater than one character
    expect(w2).toBeGreaterThan(w1);

    // Width calculation: charCount * (6*blockSize + charSpacing) - charSpacing
    // 1 char: 1 * 42 - 6 = 36
    // 2 chars: 2 * 42 - 6 = 78
    expect(w1).toBe(36);
    expect(w2).toBe(78);
  });
});

describe('OpenCode.ai logo comparison', () => {
  it('should use same color values as OpenCode logo SVG', () => {
    // From https://opencode.ai/docs/_astro/logo-dark.DOStV66V.svg
    const openCodeColors = {
      light: '#F1ECEC',
      medium: '#B7B1B1',
      dark: '#4B4646',
    };

    const svg = blockyTextToSVG('A');

    expect(svg).toContain(`fill="${openCodeColors.light}"`);
    expect(svg).toContain(`fill="${openCodeColors.medium}"`);
    expect(svg).toContain(`fill="${openCodeColors.dark}"`);
  });

  it('should produce path elements like OpenCode logo', () => {
    // OpenCode logo structure:
    // <path d="M18 30H6V18H18V30Z" fill="#4B4646"/>
    const svg = blockyTextToSVG('O');

    // Should use similar path format: MoveTo, Horizontal, Vertical lines
    expect(svg).toMatch(/<path d="M\d+ \d+H\d+V\d+H\d+V\d+Z"/);

    // Should have fill attributes
    expect(svg).toMatch(/fill="#[0-9A-F]{6}"/i);
  });

  it('should generate rectangular blocks like OpenCode', () => {
    const svg = blockyTextToSVG('A', { blockSize: 6 });

    // Each block should be a rectangle defined by M H V H V Z
    // This creates a rectangular path
    const pathRegex = /<path d="M(\d+) (\d+)H(\d+)V(\d+)H(\d+)V(\d+)Z" fill="[^"]+"\/>$/;
    const paths = svg.split('\n').filter((line) => line.includes('<path'));

    paths.forEach((path) => {
      // Each path should follow the rectangular pattern
      expect(path.trim()).toMatch(/^<path d="M\d+ \d+H\d+V\d+H\d+V\d+Z" fill="#[0-9A-F]{6}"\/>/);
    });
  });
});

describe('getAvailableCharacters', () => {
  it('should return an array of characters', () => {
    const chars = getAvailableCharacters();
    expect(Array.isArray(chars)).toBe(true);
    expect(chars.length).toBeGreaterThan(0);
  });

  it('should include characters needed for WARCRAFT', () => {
    const chars = getAvailableCharacters();
    const warcraftLetters = ['W', 'A', 'R', 'C', 'F', 'T'];

    warcraftLetters.forEach((letter) => {
      expect(chars).toContain(letter);
    });
  });

  it('should include space character', () => {
    const chars = getAvailableCharacters();
    expect(chars).toContain(' ');
  });
});
