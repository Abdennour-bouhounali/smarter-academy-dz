import { describe, it, expect } from 'vitest';
import { PEER_SHEET, AREA, CALC, AREA_IS_SQUARE } from './peerSheet';

describe('« ورقة يونس » — judging the numerator alone', () => {
  it('the error is real: 49 = 7², yet 49/20 is not the square of a rational', () => {
    expect(7 * 7).toBe(AREA.num);
    expect(AREA_IS_SQUARE).toBe(false);
    expect(PEER_SHEET.lines[1]).toContain('عدد ناطق');
  });
  it('the wrong fixes are wrong: (7/10)² = 49/100, and the calculator reading squared is not 49/20', () => {
    expect(PEER_SHEET.fixes[1].why).toContain('\\dfrac{49}{100}');
    // 1,565247584² en entiers : le carré de 1565247584 (9 décimales) comparé à 49/20 · 10^18
    const n = BigInt(CALC.replace(',', ''));
    expect(n * n * 20n === 49n * 10n ** 18n).toBe(false);
    expect(CALC).toBe('1,565247584');
  });
  it('the sheet is well formed: 3 lines, the error is line 2, exactly one right fix, wrong fixes explain', () => {
    expect(PEER_SHEET.lines).toHaveLength(3);
    expect(PEER_SHEET.errorLine).toBe(1);
    // the conclusion follows from the error: it is corrected too
    expect(PEER_SHEET.fixedLines[2]).toContain('لا تقع');
    expect(PEER_SHEET.fixedLines[0]).toBeNull();
    expect(PEER_SHEET.fixes.filter((f) => f.ok)).toHaveLength(1);
    PEER_SHEET.fixes.filter((f) => !f.ok).forEach((f) => expect(f.why).toBeTruthy());
    // no inequality chain inside Arabic prose (RTL mirrors it): the two neighbouring squares, one by one
    expect(PEER_SHEET.fixes[0].text).toContain('$4^2 = 16$ و $5^2 = 25$');
    expect(PEER_SHEET.fixes[0].text).not.toContain('<');
    // nor a formula inside parentheses in Arabic prose (the brackets mirror around it)
    expect(PEER_SHEET.fixes[0].text).not.toMatch(/\(\$|\$\)/);
  });
  it('never uses the climax numbers', () => {
    const text = JSON.stringify(PEER_SHEET);
    ['2{,}89', '2,89', '1{,}7', '\\\\sqrt{3}', '500'].forEach((x) => expect(text.includes(x), x).toBe(false));
  });
});
