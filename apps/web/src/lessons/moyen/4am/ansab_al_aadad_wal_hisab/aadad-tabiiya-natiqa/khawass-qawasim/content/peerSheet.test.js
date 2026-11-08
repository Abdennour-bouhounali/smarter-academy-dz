import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';

describe('« ورقة هند » — the converse of a property, with computed numbers', () => {
  it('6 divides 48 = 40 + 8 but divides neither 40 nor 8 (the counter-example is real)', () => {
    expect(48 % 6).toBe(0); expect(40 % 6).not.toBe(0); expect(8 % 6).not.toBe(0);
    expect(6 * 8).toBe(48); expect(6 * 6 + 4).toBe(40); expect(6 * 1 + 2).toBe(8);
  });
  it('the sheet is well formed: 3 to 5 lines, the error is line 1, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(1);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
  it('the lines after the error are rewritten (they follow from it)', () => {
    expect(PEER_SHEET.fixedLines[2]).toBeTruthy();
    expect(PEER_SHEET.fixedLines[3]).toBeTruthy();
    expect(PEER_SHEET.lines[0]).toContain('48');
  });
});
