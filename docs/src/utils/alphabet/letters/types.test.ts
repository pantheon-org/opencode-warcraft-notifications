import { describe, it, expect } from 'bun:test';
import { ALPHABET } from '../types';

describe('Letter row widths', () => {
  it('each letter has 7 rows and each row length is between 1 and 5', () => {
    Object.entries(ALPHABET).forEach(([name, data]) => {
      for (let r = 0; r < 7; r++) {
        const row = data.rows[r];
        expect(Array.isArray(row)).toBe(true);
        const len = row.length;
        expect(len).toBeGreaterThanOrEqual(1);
        expect(len).toBeLessThanOrEqual(5);
      }
    });
  });
});
