import { describe, it, expect } from 'bun:test';
import { blockyTextToSVG, getAllAvailableCharacters } from './alphabet';

describe('blockyTextToSVG', () => {
  it('should generate SVG with new alphabet style', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Should be valid SVG
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    // New alphabet uses simplified 2-color palette (PRIMARY/SECONDARY)
    // PRIMARY = light (#F1ECEC), SECONDARY = medium (#B7B1B1) in light theme
    expect(svg).toContain('fill="#F1ECEC"'); // PRIMARY
    expect(svg).toContain('fill="#B7B1B1"'); // SECONDARY

    // Should have correct structure
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('fill="none"');
  });

  it('should render letter O with correct structure', () => {
    const svg = blockyTextToSVG('O');

    // New alphabet uses PRIMARY and SECONDARY colors
    expect(svg).toContain('fill="#F1ECEC"'); // PRIMARY
    expect(svg).toContain('fill="#B7B1B1"'); // SECONDARY

    // Should have multiple paths (one per block)
    const pathCount = (svg.match(/<path/g) || []).length;
    expect(pathCount).toBeGreaterThan(10); // 'O' should have multiple blocks
  });

  it('should generate correct dimensions', () => {
    // With blockSize=6, charSpacing=1 (1 block = 6px)
    // Height: 7 rows * 6 pixels = 42
    const svg = blockyTextToSVG('OPENCODE');

    expect(svg).toContain('height="42"'); // 7-row grid = 42px height
    expect(svg).toContain('width="234"'); // Should match expected width
  });

  it('should handle all OpenCode letters', () => {
    const openCodeLetters = ['O', 'P', 'E', 'N', 'C', 'O', 'D', 'E'];
    const availableChars = getAllAvailableCharacters();

    // Check which letters we have
    const supportedLetters = openCodeLetters.filter((letter) => availableChars.includes(letter));

    // Should support all OpenCode letters
    expect(supportedLetters.length).toBe(8);

    // Generate SVG for supported letters
    supportedLetters.forEach((letter) => {
      const svg = blockyTextToSVG(letter);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });
  });

  it('should use 7-row grid system', () => {
    // New alphabet uses a 7-row grid system with 6-pixel blocks by default
    const svg = blockyTextToSVG('A', { blockSize: 6 });

    // Height should be 7 rows * 6 pixels = 42
    expect(svg).toContain('height="42"');

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

  it('should support custom themes', () => {
    // Test with dark theme
    const svgDark = blockyTextToSVG('O', {
      theme: 'dark',
    });

    // Dark theme uses white for primary, gray for secondary
    expect(svgDark).toContain('fill="#FFFFFF"'); // PRIMARY in dark theme
    expect(svgDark).toContain('fill="#626262"'); // SECONDARY in dark theme
  });

  it('should calculate width based on actual character widths', () => {
    const svg1char = blockyTextToSVG('A');
    const svg2char = blockyTextToSVG('AA');

    // Extract widths
    const width1 = svg1char.match(/width="(\d+)"/)?.[1];
    const width2 = svg2char.match(/width="(\d+)"/)?.[1];

    expect(width1).toBeDefined();
    expect(width2).toBeDefined();

    const w1 = parseInt(width1!);
    const w2 = parseInt(width2!);

    // Two characters should be wider than one character
    expect(w2).toBeGreaterThan(w1);
  });
});

describe('New alphabet system', () => {
  it('should generate exact dimensions for OPENCODE', () => {
    // New alphabet should produce 234×42 dimensions
    const svg = blockyTextToSVG('OPENCODE');

    expect(svg).toContain('width="234"');
    expect(svg).toContain('height="42"');
    expect(svg).toContain('viewBox="0 0 234 42"');
  });

  it('should use new alphabet color palette', () => {
    // New alphabet uses simplified color scheme
    const colors = {
      primary: '#F1ECEC', // Light
      secondary: '#B7B1B1', // Medium
    };

    // Test with 'C' which should use both colors
    const svg = blockyTextToSVG('C');

    expect(svg).toContain(`fill="${colors.primary}"`);
    expect(svg).toContain(`fill="${colors.secondary}"`);
  });

  it('should produce path elements with correct format', () => {
    // Path format: M x y H x V y H x V y Z
    const svg = blockyTextToSVG('O');

    // Should use rectangular path format
    expect(svg).toMatch(/<path d="M\d+ \d+H\d+V\d+H\d+V\d+Z"/);

    // Should have fill attributes with 6-digit hex colors
    expect(svg).toMatch(/fill="#[0-9A-F]{6}"/i);
  });

  it('should handle variable-width characters', () => {
    // New alphabet supports 1-5 column widths
    // Test that different letters can have different widths
    const svgI = blockyTextToSVG('I'); // Narrow letter
    const svgW = blockyTextToSVG('W'); // Wide letter

    const widthI = parseInt(svgI.match(/width="(\d+)"/)?.[1] || '0');
    const widthW = parseInt(svgW.match(/width="(\d+)"/)?.[1] || '0');

    // W should be wider than I
    expect(widthW).toBeGreaterThan(widthI);
  });

  it('should support all OPENCODE letters', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Should render without errors
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('width="234"');
  });
});

describe('getAllAvailableCharacters', () => {
  it('should return an array of characters', () => {
    const chars = getAllAvailableCharacters();
    expect(Array.isArray(chars)).toBe(true);
    expect(chars.length).toBeGreaterThan(0);
  });

  it('should include characters needed for WARCRAFT', () => {
    const chars = getAllAvailableCharacters();
    const warcraftLetters = ['W', 'A', 'R', 'C', 'F', 'T'];

    warcraftLetters.forEach((letter) => {
      expect(chars).toContain(letter);
    });
  });

  it('should include symbols', () => {
    const chars = getAllAvailableCharacters();
    // New alphabet module includes symbols
    expect(chars).toContain('-');
    expect(chars).toContain('!');
    expect(chars).toContain('?');
  });
});
