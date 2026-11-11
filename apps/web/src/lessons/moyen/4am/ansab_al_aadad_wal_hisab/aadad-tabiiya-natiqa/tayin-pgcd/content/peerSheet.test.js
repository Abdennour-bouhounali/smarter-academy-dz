import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

describe('« ورقة ياسين » — the PGCD is not the larger number', () => {
  it('the error is real: 9 divides 36, PGCD(36 ; 9) = 9, not 36; the wrong fixes are really wrong', () => {
    expect(36 % 9).toBe(0);
    expect(gcd(36, 9)).toBe(9);
    expect(9 % 36).not.toBe(0);
    expect(9 % 4).not.toBe(0);
    expect(36 % 3 === 0 && 9 % 3 === 0).toBe(true);
  });
  it('the sheet is well formed: 3 to 5 lines, the error is line 1, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(1);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
    expect(PEER_SHEET.fixedLines[2]).toBeTruthy();
  });
});
