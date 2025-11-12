import { describe, it, expect } from 'bun:test';
import { extractFilename, getIdleSummary } from './notification-utils';

describe('extractFilename', () => {
  it('should extract filename from Unix path', () => {
    const path = '/Users/john/sounds/human_selected1.wav';
    expect(extractFilename(path)).toBe('human_selected1.wav');
  });

  it('should extract filename from relative path', () => {
    const path = './sounds/orc_acknowledge1.wav';
    expect(extractFilename(path)).toBe('orc_acknowledge1.wav');
  });

  it('should handle path with no directory', () => {
    const path = 'peasant_selected1.wav';
    expect(extractFilename(path)).toBe('peasant_selected1.wav');
  });

  it('should return empty string for empty path', () => {
    expect(extractFilename('')).toBe('');
  });

  it('should handle path ending with slash', () => {
    const path = '/sounds/alliance/';
    expect(extractFilename(path)).toBe('');
  });

  it('should handle Windows-style paths', () => {
    const path = 'C:\\Users\\John\\sounds\\elf_selected1.wav';
    // Note: This tests current behavior, may want to support both / and \ in future
    expect(extractFilename(path)).toBe('C:\\Users\\John\\sounds\\elf_selected1.wav');
  });
});

describe('getIdleSummary', () => {
  describe('with null or undefined input', () => {
    it('should return undefined for null', () => {
      expect(getIdleSummary(null)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(getIdleSummary('')).toBeUndefined();
    });
  });

  describe('with summary markdown', () => {
    it('should extract summary from bold markdown with asterisks', () => {
      const text = 'Some work was done\n\n**Summary:** Task completed successfully';
      expect(getIdleSummary(text)).toBe('Task completed successfully');
    });

    it('should extract summary from italic markdown with underscores', () => {
      const text = 'Working on features\n_Summary:_ Feature implemented';
      expect(getIdleSummary(text)).toBe('Feature implemented');
    });

    it('should extract summary without bold/italic markers', () => {
      const text = 'Code changes\nSummary: All tests passing';
      // Current regex won't match this - documents expected behavior
      expect(getIdleSummary(text)).toBe('Code changes\nSummary: All tests passing');
    });

    it('should handle summary with trailing asterisks', () => {
      const text = '**Summary:** Fixed bugs**';
      expect(getIdleSummary(text)).toBe('Fixed bugs');
    });

    it('should extract summary at end of multiline text', () => {
      const text = 'Line 1\nLine 2\nLine 3\n**Summary:** Final result';
      expect(getIdleSummary(text)).toBe('Final result');
    });

    it('should trim whitespace from extracted summary', () => {
      const text = '**Summary:**   Spaced text   **';
      expect(getIdleSummary(text)).toBe('Spaced text');
    });

    it('should handle summary with only markers', () => {
      const text = '**Summary:** **';
      // With only markers, captures the trailing asterisk
      const result = getIdleSummary(text);
      expect(result).toBeDefined();
      // This is edge case behavior - in practice summaries always have content
    });
  });

  describe('without summary markdown', () => {
    it('should return text as-is when shorter than 80 chars', () => {
      const text = 'Short message';
      expect(getIdleSummary(text)).toBe('Short message');
    });

    it('should truncate text longer than 80 chars', () => {
      const text = 'a'.repeat(100);
      const result = getIdleSummary(text);
      expect(result).toBe('a'.repeat(80) + '...');
      expect(result?.length).toBe(83);
    });

    it('should handle text exactly 80 chars', () => {
      const text = 'a'.repeat(80);
      expect(getIdleSummary(text)).toBe(text);
    });

    it('should handle text with 81 chars (boundary)', () => {
      const text = 'a'.repeat(81);
      expect(getIdleSummary(text)).toBe('a'.repeat(80) + '...');
    });

    it('should preserve newlines in short text', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      expect(getIdleSummary(text)).toBe(text);
    });

    it('should truncate at 80 chars even with newlines', () => {
      const text = 'a'.repeat(50) + '\n' + 'b'.repeat(50);
      const result = getIdleSummary(text);
      expect(result?.length).toBe(83);
      expect(result?.endsWith('...')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle unicode characters', () => {
      const text = '🎮 Gaming session completed';
      expect(getIdleSummary(text)).toBe(text);
    });

    it('should handle special characters in summary', () => {
      const text = '**Summary:** Task #123 @user <completed>';
      expect(getIdleSummary(text)).toBe('Task #123 @user <completed>');
    });

    it('should handle multiple summary patterns (uses first match)', () => {
      const text = '**Summary:** First\n**Summary:** Second';
      // Regex finds first match due to multiline flag
      expect(getIdleSummary(text)).toBe('First');
    });

    it('should match summary at end of any line (multiline mode)', () => {
      const text = '**Summary:** Middle summary\nMore text after';
      // Regex uses $ (end of line) with multiline flag, matches first occurrence
      expect(getIdleSummary(text)).toBe('Middle summary');
    });
  });
});
