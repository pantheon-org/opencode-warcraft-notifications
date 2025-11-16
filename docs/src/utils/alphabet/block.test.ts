import { describe, it, expect } from 'bun:test';
import { textToBlocks } from './block';

describe('textToBlocks', () => {
    it('should convert text to blocks with default options', () => {
        const blocks = textToBlocks('A');
        expect(blocks.length).toBeGreaterThan(0);
        blocks.forEach(block => {
            expect(block).toHaveProperty('x');
            expect(block).toHaveProperty('y');
            expect(block).toHaveProperty('color');
        });
    });

    it('should handle unsupported characters by skipping them', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const blocks = textToBlocks('A$B');
        expect(blocks.length).toBeGreaterThan(0);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Character "$" not found in alphabet data. Skipping.');
        consoleWarnSpy.mockRestore();
    });

    it('should apply custom block size and character spacing', () => {
        const options = {
            blockSize: 10,
            charSpacing: 2,
            theme: 'dark' as const,
        };
        const blocks = textToBlocks('AB', options);
        expect(blocks.length).toBeGreaterThan(0);
        blocks.forEach(block => {
            expect(block.x % 10).toBe(0); // x should be multiple of blockSize
            expect(block.y % 10).toBe(0); // y should be multiple of blockSize
        });
    });
});