import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';

describe('« ورقة رانية » — numerator and denominator divided by different numbers', () => {
  it('the error is real: 36/48 = 3/4 but 6/12 = 1/2; the subtraction fix is wrong too', () => {
    expect(36 * 4).toBe(48 * 3);
    expect(6 * 2).toBe(12 * 1);
    expect(36 * 12).not.toBe(48 * 6);
    expect(30 * 48).not.toBe(44 * 36);
    expect(PEER_SHEET.fixes.find((f) => f.ok).text).toContain('\\dfrac{3}{4}');
  });
  it('the sheet is well formed: 3 to 5 lines, the error is line 1, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(1);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
});
