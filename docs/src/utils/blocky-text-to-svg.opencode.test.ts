import { describe, it, expect } from 'bun:test';
import { blockyTextToSVG, getAllAvailableCharacters } from './alphabet';
import { readFileSync } from 'fs';
import { join } from 'path';

// The actual OpenCode logo SVG from https://opencode.ai/docs/
const OPENCODE_REFERENCE_SVG = `<svg width="234" height="42" viewBox="0 0 234 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 30H6V18H18V30Z" fill="#4B4646"/>
<path d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" fill="#B7B1B1"/>
<path d="M48 30H36V18H48V30Z" fill="#4B4646"/>
<path d="M36 30H48V12H36V30ZM54 36H36V42H30V6H54V36Z" fill="#B7B1B1"/>
<path d="M84 24V30H66V24H84Z" fill="#4B4646"/>
<path d="M84 24H66V30H84V36H60V6H84V24ZM66 18H78V12H66V18Z" fill="#B7B1B1"/>
<path d="M108 36H96V18H108V36Z" fill="#4B4646"/>
<path d="M108 12H96V36H90V6H108V12ZM114 36H108V12H114V36Z" fill="#B7B1B1"/>
<path d="M144 30H126V18H144V30Z" fill="#4B4646"/>
<path d="M144 12H126V30H144V36H120V6H144V12Z" fill="#F1ECEC"/>
<path d="M168 30H156V18H168V30Z" fill="#4B4646"/>
<path d="M168 12H156V30H168V12ZM174 36H150V6H174V36Z" fill="#F1ECEC"/>
<path d="M198 30H186V18H198V30Z" fill="#4B4646"/>
<path d="M198 12H186V30H198V12ZM204 36H180V6H198V0H204V36Z" fill="#F1ECEC"/>
<path d="M234 24V30H216V24H234Z" fill="#4B4646"/>
<path d="M216 12V18H228V12H216ZM234 24H216V30H234V36H210V6H234V24Z" fill="#F1ECEC"/>
</svg>`;

describe('OpenCode Logo Comparison', () => {
  it('should generate OPENCODE text', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Should be valid SVG
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should use exact OpenCode color palette', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Extract colors from reference
    const referenceColors = OPENCODE_REFERENCE_SVG.match(/fill="#[0-9A-F]{6}"/gi) || [];
    const uniqueRefColors = [...new Set(referenceColors)].sort();

    // Our colors should match
    expect(svg).toContain('fill="#F1ECEC"'); // Light
    expect(svg).toContain('fill="#B7B1B1"'); // Medium
    expect(svg).toContain('fill="#4B4646"'); // Dark

    // Should only use these three colors
    const ourColors = svg.match(/fill="#[0-9A-F]{6}"/gi) || [];
    const uniqueOurColors = [...new Set(ourColors)].sort();

    expect(uniqueOurColors).toEqual(uniqueRefColors);
  });

  it('should have exact dimensions as OpenCode logo', () => {
    const svg = blockyTextToSVG('OPENCODE');

    // Reference: width="234" height="42"
    // Our calculation: 8 chars * (4*6 + 6) - 6 = 234 width, 7*6 = 42 height
    // Now using 7 rows and 4 columns per character to match OpenCode exactly

    const widthMatch = svg.match(/width="(\d+)"/);
    const heightMatch = svg.match(/height="(\d+)"/);

    expect(widthMatch).toBeDefined();
    expect(heightMatch).toBeDefined();

    const width = parseInt(widthMatch![1]);
    const height = parseInt(heightMatch![1]);

    // Should match exactly
    expect(width).toBe(234); // Exact match
    expect(height).toBe(42); // 7 rows * 6px
  });

  it('should generate rectangular block paths like OpenCode', () => {
    const svg = blockyTextToSVG('O');

    // OpenCode uses paths like: M18 30H6V18H18V30Z
    // Our format: M0 0H6V6H0V0Z

    const pathRegex = /<path d="M\d+ \d+H\d+V\d+H\d+V\d+Z" fill="#[0-9A-F]{6}"\/>/;
    const paths = svg.split('\n\t\t').filter((line) => line.includes('<path'));

    expect(paths.length).toBeGreaterThan(0);

    paths.forEach((path) => {
      expect(path.trim()).toMatch(pathRegex);
    });
  });

  it('should support all letters in OPENCODE', () => {
    const openCodeLetters = ['O', 'P', 'E', 'N', 'C', 'O', 'D', 'E'];
    const availableChars = getAllAvailableCharacters();

    openCodeLetters.forEach((letter) => {
      expect(availableChars).toContain(letter);
    });

    // Generate full text
    const svg = blockyTextToSVG('OPENCODE');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');

    // Should have many paths (one per block)
    const pathCount = (svg.match(/<path/g) || []).length;
    expect(pathCount).toBeGreaterThan(50); // OPENCODE should have many blocks
  });

  it('should use same SVG structure as OpenCode', () => {
    const svg = blockyTextToSVG('O');

    // Check SVG attributes match
    expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
    expect(svg).toContain('fill="none"');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    // Check path structure
    expect(svg).toContain('<path d="M');
    expect(svg).toContain('Z" fill="#');
  });

  it('should have consistent block sizing', () => {
    const svg = blockyTextToSVG('A', { blockSize: 6 });

    // All coordinates should be multiples of blockSize (6)
    const pathMatches = svg.matchAll(/<path d="M(\d+) (\d+)H(\d+)V(\d+)H(\d+)V(\d+)Z"/g);

    for (const match of pathMatches) {
      const coords = [match[1], match[2], match[3], match[4], match[5], match[6]].map(Number);
      coords.forEach((coord) => {
        expect(coord % 6).toBe(0);
      });
    }
  });

  it('should generate valid SVG for each OpenCode letter individually', () => {
    const letters = ['O', 'P', 'E', 'N', 'C', 'D'];

    letters.forEach((letter) => {
      const svg = blockyTextToSVG(letter);

      // Should be valid SVG
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('fill=');

      // Should use at least one of the OpenCode colors
      const hasColor =
        svg.includes('#F1ECEC') || svg.includes('#B7B1B1') || svg.includes('#4B4646');
      expect(hasColor).toBe(true);
    });
  });
});

describe('Reference OpenCode SVG Analysis', () => {
  it('should document OpenCode SVG structure', () => {
    // This test documents what we learned from the reference SVG

    // Reference dimensions
    expect(OPENCODE_REFERENCE_SVG).toContain('width="234" height="42"');

    // Uses 3 colors
    const colors = OPENCODE_REFERENCE_SVG.match(/fill="#[0-9A-F]{6}"/gi) || [];
    const uniqueColors = [...new Set(colors)];
    expect(uniqueColors.length).toBe(3);

    // Colors are exactly these
    expect(uniqueColors).toContain('fill="#F1ECEC"');
    expect(uniqueColors).toContain('fill="#B7B1B1"');
    expect(uniqueColors).toContain('fill="#4B4646"');
  });

  it('should match reference color usage patterns', () => {
    // In the reference, darker colors are used more frequently
    const darkCount = (OPENCODE_REFERENCE_SVG.match(/fill="#4B4646"/g) || []).length;
    const mediumCount = (OPENCODE_REFERENCE_SVG.match(/fill="#B7B1B1"/g) || []).length;
    const lightCount = (OPENCODE_REFERENCE_SVG.match(/fill="#F1ECEC"/g) || []).length;

    expect(darkCount).toBe(8);
    expect(mediumCount).toBe(4);
    expect(lightCount).toBe(4);

    // Dark is used most (for shadows/depth)
    expect(darkCount).toBeGreaterThanOrEqual(mediumCount);
    expect(darkCount).toBeGreaterThanOrEqual(lightCount);
  });
});
