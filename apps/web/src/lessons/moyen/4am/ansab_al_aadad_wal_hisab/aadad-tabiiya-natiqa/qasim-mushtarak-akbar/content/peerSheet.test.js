import { describe, it, expect } from 'vitest';
import { PEER_SHEET, SALMA_A } from './peerSheet';

describe('« ورقة سلمى » — an incomplete list of divisors gives a false PGCD', () => {
  it('the error is real: 10 and 15 divide 30 and are missing; Salma\'s PGCD is 5, the true one is 15', () => {
    expect(SALMA_A).not.toContain(10);
    expect(SALMA_A).not.toContain(15);
    expect(30 % 10).toBe(0); expect(30 % 15).toBe(0); expect(45 % 15).toBe(0);
    expect(PEER_SHEET.lines[3]).toContain('= 5');
    expect(PEER_SHEET.fixedLines[3]).toContain('= 15');
  });
  it('the sheet is well formed: 3 to 5 lines, the error is the first line, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(0);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
  it('the wrong fixes are really wrong: 2 does not divide 45, and 45 does not divide 30', () => {
    expect(45 % 2).not.toBe(0);
    expect(30 % 45).not.toBe(0);
  });
});
