import { describe, it, expect } from 'vitest';
import { PEER_SHEET, chainFrom } from './peerSheet';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

describe('« ورقة مريم » — losing the pair in successive differences', () => {
  it('the wrong line really loops back (84 − 24 = 60) and the right chain ends at PGCD(84 ; 60) = 12', () => {
    expect(84 - 24).toBe(60);
    const right = chainFrom(60, 24);
    expect(right[right.length - 1][2]).toBe(0);
    expect(right[right.length - 1][0]).toBe(gcd(84, 60));
    expect(PEER_SHEET.fixedLines[2]).toContain(`= ${gcd(84, 60)}$`);
  });
  it('the wrong fix « the first difference » is really wrong: 24 does not divide 60', () => {
    expect(60 % 24).not.toBe(0);
  });
  it('the sheet is well formed: 3 to 5 lines, the error is line 1, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(1);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
});
