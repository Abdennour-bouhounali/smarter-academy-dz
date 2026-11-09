import { describe, it, expect } from 'vitest';
import { PEER_SHEET } from './peerSheet';

describe('« ورقة إلياس » — the square of a decimal', () => {
  it('the error is real: 0,06² = 0,0036, not 0,36; 0,6² = 0,36; half and the negative fix are wrong', () => {
    expect(6 * 6).toBe(36);          // 0,06 × 0,06 = 36 ten-thousandths = 0,0036
    expect(PEER_SHEET.lines[1]).toContain('0{,}06 \\times 0{,}06 = 0{,}36');
    const ok = PEER_SHEET.fixes.find((f) => f.ok).text;
    expect(ok).toContain('0{,}0036');
    expect(ok).toContain('\\sqrt{0{,}36} = 0{,}6');
    expect(18 * 18).not.toBe(3600);  // 0,18² = 0,0324 ≠ 0,36
    expect(PEER_SHEET.fixes[1].why).toContain('0{,}0324');
  });
  it('the sheet is well formed: 3 to 5 lines, the error is line 2, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines.length).toBeGreaterThanOrEqual(3);
    expect(PEER_SHEET.lines.length).toBeLessThanOrEqual(5);
    expect(PEER_SHEET.errorLine).toBe(1);
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
  });
  it('never uses the climax numbers', () => {
    const text = JSON.stringify(PEER_SHEET);
    expect(/(^|[^0-9])34([^0-9]|$)/.test(text)).toBe(false);
    expect(text.includes('5{,}83')).toBe(false);
  });
});
