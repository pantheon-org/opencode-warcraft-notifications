import { describe, it, expect } from 'bun:test';
import { textToBlocks, calculateWidth, blocksToSVGPaths, blockyTextToSVG } from './block';

describe('textToBlocks', () => {
  it('should convert text to blocks with default options', () => {
    const blocks = textToBlocks('A');
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((block) => {
      expect(block).toHaveProperty('x');
      expect(block).toHaveProperty('y');
      expect(block).toHaveProperty('color');
    });
  });

  it('should handle unsupported characters by skipping them', () => {
    const originalWarn = console.warn;
    const calls: any[] = [];
    console.warn = (...args: any[]) => calls.push(args);

    const blocks = textToBlocks('A$B');
    expect(blocks.length).toBeGreaterThan(0);
    const found = calls.some((c) => c[0] === 'Character "$" not found in alphabet data. Skipping.');
    expect(found).toBe(true);

    console.warn = originalWarn;
  });

  it('should apply custom block size and character spacing', () => {
    const options = {
      blockSize: 10,
      charSpacing: 2,
      theme: 'dark' as const,
    };
    const blocks = textToBlocks('AB', options);
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((block) => {
      expect(block.x % 10).toBe(0); // x should be multiple of blockSize
      expect(block.y % 10).toBe(0); // y should be multiple of blockSize
    });
  });
});

describe('calculateWidth', () => {
  it('should calculate width correctly with default options', () => {
    const options = {
      blockSize: 6,
      charSpacing: 1,
      theme: 'light' as const,
    };
    const width = calculateWidth('ABC', options);
    // Calculation: width = n * (4*blockSize + charSpacing) - charSpacing
    // For n=3, blockSize=6, charSpacing=1 => 3*(24+1)-1 = 74
    expect(width).toBe(74);
  });

  it('should calculate width correctly with custom options', () => {
    const options = {
      blockSize: 8,
      charSpacing: 2,
      theme: 'dark' as const,
    };
    const width = calculateWidth('AB', options);
    // Calculation: 2*(4*8 + 2) - 2 = 66
    expect(width).toBe(66);
  });
});

describe('blocksToSVGPaths', () => {
  it('should generate SVG path elements from blocks', () => {
    const blocks = [
      { x: 0, y: 0, color: '#000000' },
      { x: 6, y: 0, color: '#000000' },
      { x: 0, y: 6, color: '#000000' },
    ];
    const svgPaths = blocksToSVGPaths(blocks, 6);
    expect(svgPaths).toContain('<path d="M0 0H6V6H0V0Z" fill="#000000"/>');
    expect(svgPaths).toContain('<path d="M6 0H12V6H6V0Z" fill="#000000"/>');
    expect(svgPaths).toContain('<path d="M0 6H6V12H0V6Z" fill="#000000"/>');
  });
});

describe('blockyTextToSVG', () => {
  it('should generate a complete SVG string from text', () => {
    const svg = blockyTextToSVG('AB', {
      blockSize: 6,
      charSpacing: 1,
      theme: 'light',
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('<path'); // At least one path should be present
  });
});
