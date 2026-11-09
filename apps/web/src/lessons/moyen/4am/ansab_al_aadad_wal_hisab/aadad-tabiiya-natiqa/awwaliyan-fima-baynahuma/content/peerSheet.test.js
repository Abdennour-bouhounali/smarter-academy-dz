import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

describe('« ورقة أنس » — two non-prime numbers can be coprime', () => {
  it('the error is real: 8 and 15 are not prime, yet PGCD(8 ; 15) = 1; the parity fix is wrong too', () => {
    expect([2, 4].some((d) => 8 % d === 0)).toBe(true);
    expect([3, 5].some((d) => 15 % d === 0)).toBe(true);
    expect(gcd(8, 15)).toBe(1);
    expect(gcd(9, 15)).toBe(3);
    expect(PEER_SHEET.fixes.find((f) => f.ok).text).toContain('= 1$');
  });
  it('the sheet is well formed: 3 to 5 lines, the error is the conclusion, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(2);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
  it('never uses the climax numbers', () => {
    const text = JSON.stringify(PEER_SHEET);
    [26, 45, 39, 65].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
  });
});
