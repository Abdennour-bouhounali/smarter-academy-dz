import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';
import { divisorsOf, pairsOf, boundOf } from './books';

describe('« ورقة زميل » — the error is the only wrong line, the numbers are computed', () => {
  it('84 has 12 divisors and 6 pairs; the test stops at 9', () => {
    expect(divisorsOf(84)).toEqual([1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84]);
    expect(pairsOf(84)).toHaveLength(6);
    expect(boundOf(84)).toBe(9);
  });
  it('the sheet is well formed: one error line, exactly one right fix, a fixed line for the line that follows', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(2);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
    expect(PEER_SHEET.fixedLines[3]).toContain('12');
  });
  it('the wrong line lists only the tested numbers, the right fix lists all twelve', () => {
    expect(PEER_SHEET.lines[2]).toContain('1 ، 2 ، 3 ، 4 ، 6 ، 7');
    expect(PEER_SHEET.lines[2]).not.toContain('12');
    expect(PEER_SHEET.fixes.find((f) => f.ok).text).toContain('1 ، 2 ، 3 ، 4 ، 6 ، 7 ، 12 ، 14 ، 21 ، 28 ، 42 ، 84');
  });
});
