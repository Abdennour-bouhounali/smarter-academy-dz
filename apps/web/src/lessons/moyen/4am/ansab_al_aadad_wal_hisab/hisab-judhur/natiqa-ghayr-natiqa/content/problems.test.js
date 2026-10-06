import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

// ── Rationnels EXACTS en BigInt : aucune virgule flottante (0,6666666667 × 3 compris). ──
const babs = (x) => (x < 0n ? -x : x);
const bgcd = (a, b) => (b === 0n ? babs(a) : bgcd(b, a % b));
const R = (n, d = 1n) => {
  n = BigInt(n); d = BigInt(d);
  if (d < 0n) { n = -n; d = -d; }
  const g = bgcd(n, d) || 1n;
  return [n / g, d / g];
};
const add = (x, y) => R(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => R(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => R(x[0] * y[0], x[1] * y[1]);
const dvd = (x, y) => R(x[0] * y[1], x[1] * y[0]);
const eq = (x, y) => x[0] === y[0] && x[1] === y[1];
const lt = (x, y) => x[0] * y[1] < y[0] * x[1];
/** « 2,0000000001 » → [20000000001, 10000000000]. */
const dec = (s) => { const [i, f = ''] = String(s).replace('.', ',').split(','); return R(BigInt(i + f), 10n ** BigInt(f.length)); };
const isqrt = (n) => { if (n < 2n) return n; let x = n, y = (x + 1n) / 2n; while (y < x) { x = y; y = (x + n / x) / 2n; } return x; };
/** Racine EXACTE d'un rationnel positif, ou null s'il n'est pas le carré d'un rationnel. */
const rsqrt = ([n, d]) => { const a = isqrt(n), b = isqrt(d); return a * a === n && b * b === d ? R(a, b) : null; };
const isSquareOfRational = (x) => rsqrt(x) != null;

// Une valeur : { r: rationnel } ou { sq: rationnel } (= √sq, sq non carré, toujours positive).
function evalExpr(src) {
  const s = src
    .replace(/\\left|\\right/g, '')
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
    .replace(/\{,\}/g, ',')
    .replace(/\\times/g, '*').replace(/\\div/g, '/')
    .replace(/\\sqrt\{/g, 'S{')
    .replace(/\s+/g, '');
  if (!/^[\d,+\-*/()^S{}]+$/.test(s)) return null; // une lettre, \ldots, une unité : non vérifiable ici
  let i = 0;
  const atom = () => {
    let v;
    if (s[i] === '(') { i++; v = sum(); if (s[i++] !== ')') throw new Error(src); }
    else if (s[i] === 'S') {
      i += 2; const inner = sum(); if (s[i++] !== '}') throw new Error(src);
      if (!inner.r) return { bad: true };
      const root = rsqrt(inner.r);
      v = root ? { r: root } : { sq: inner.r };
    } else {
      const j = i; while (/[\d,]/.test(s[i] ?? '')) i++;
      v = { r: dec(s.slice(j, i)) };
    }
    if (s[i] === '^') { i++; const j = i; while (/\d/.test(s[i] ?? '')) i++; const k = Number(s.slice(j, i));
      if (v.sq && k === 2) v = { r: v.sq }; else if (v.r) { let p = R(1); for (let t = 0; t < k; t++) p = mul(p, v.r); v = { r: p }; } else v = { bad: true }; }
    return v;
  };
  const bin = (a, b, f) => (a.r && b.r ? { r: f(a.r, b.r) } : { bad: true });
  const prod = () => { let v = atom(); while (s[i] === '*' || s[i] === '/') { const op = s[i++]; const w = atom(); v = bin(v, w, op === '*' ? mul : dvd); } return v; };
  const sum = () => { let v = prod(); while (s[i] === '+' || s[i] === '-') { const op = s[i++]; const w = prod(); v = bin(v, w, op === '+' ? add : sub); } return v; };
  const v = sum();
  if (i !== s.length || v.bad) return null;
  return v;
}
/** Comparaison de deux valeurs positives : par leurs carrés si l'une est une racine. */
const sqOf = (v) => (v.sq ? v.sq : mul(v.r, v.r));
const rel = (a, op, b) => {
  if (op === '=') return a.r && b.r ? eq(a.r, b.r) : !!(a.sq && b.sq && eq(a.sq, b.sq));
  const [x, y] = op === '<' ? [a, b] : [b, a];
  if (x.r && y.r) return lt(x.r, y.r);
  return lt(sqOf(x), sqOf(y)); // toutes les grandeurs ici sont positives
};
/** Chaque formule $…$ : chaque relation = / < / > entre deux membres évaluables est vraie. */
function checkText(text, where) {
  let checked = 0;
  for (const [, f] of String(text).matchAll(/\$([^$]+)\$/g)) {
    const parts = f.split(/(=|<|>)/);
    for (let k = 1; k < parts.length; k += 2) {
      const a = evalExpr(parts[k - 1]), b = evalExpr(parts[k + 1]);
      if (!a || !b) continue;
      expect(rel(a, parts[k], b), `${where}: ${f}`).toBe(true);
      checked++;
    }
  }
  return checked;
}

const stepsOf = (id, part) => PROBLEM[id].parts[part].steps;
const expectedOf = (id, part) => stepsOf(id, part).filter((s) => s.kind === 'numeric').map((s) => s.expected);
const correctOf = (id, part, k) => { const s = stepsOf(id, part).filter((st) => st.kind === 'choice')[k]; return s.options[s.correct]; };
/** Un `expected` (flottant littéral) égal EXACTEMENT au rationnel calculé. */
const same = (expected, r) => expect(eq(dec(String(expected)), r), `${expected}`).toBe(true);
/** Approchées par défaut / par excès au pas 10^-k d'un √a (a rationnel non carré) : comparaison des carrés. */
function bracket(a, k) {
  const step = R(1n, 10n ** BigInt(k));
  let lo = R(0);
  while (!lt(a, mul(add(lo, step), add(lo, step)))) lo = add(lo, step);
  return [lo, add(lo, step)];
}
/** L'affichage d'une calculatrice à 10 chiffres significatifs (arrondi) de √a, a entier. */
function display10(a) {
  const digits = isqrt(a).toString().length; // chiffres de la partie entière
  const k = 10 - digits;
  const scaled = isqrt(a * 10n ** BigInt(2 * (k + 1))); // tronqué à k + 1 décimales
  const rounded = (scaled + 5n) / 10n;
  const str = rounded.toString();
  return `${str.slice(0, str.length - k)},${str.slice(-k)}`;
}

describe('les مسائل du درس 2 de l’unité 2 « الأعداد الناطقة والأعداد غير الناطقة »', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test 7)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [4, '04', 'masala-1', 'practice_lab', 8], [5, '05', 'masala-2', 'practice_lab', 8], [6, '06', 'masala-3', 'practice_lab', 8],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '07', number: 7, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBe(69);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation');
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 4], ['masala-2', 5], ['masala-3', 6]]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('data: 4–5 useful items, and at least one useless item that is a number', () => {
    for (const p of PROBLEMS) {
      const useful = p.data.filter((d) => d.useful).length;
      expect(useful >= 4 && useful <= 5, p.id).toBe(true);
      expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) expect(d.text.includes('$'), `${p.id} ${d.id}`).toBe(false);
    }
  });

  const texts = (p) => [p.statement, ...p.parts.flatMap((part) => [part.question, ...part.asks, ...part.steps.flatMap((s) => [s.prompt, s.explain, ...(s.options ?? []), ...(s.lines ?? [])])])].filter(Boolean);

  it('RTL: no bare √, a/b, x² or « $…$ unit » in the Arabic text', () => {
    for (const p of PROBLEMS) for (const t of texts(p)) {
      const prose = t.replace(/\$[^$]*\$/g, '');
      expect(prose, `${p.id}: ${t}`).not.toMatch(/√|\d\s*\/\s*\d|\^/);
      expect(t, `${p.id}: ${t}`).not.toMatch(/\$\s*(m|cm|m²|cm²|DA)\b/); // une unité APRÈS un îlot s'inverse
    }
  });

  it('every written equality / inequality (explain, prompts, solution lines, correct options) is exact', () => {
    let checked = 0;
    for (const p of PROBLEMS) p.parts.forEach((part, pi) => part.steps.forEach((s, si) => {
      const where = `${p.id} ${part.label} step ${si + 1}`;
      for (const t of [s.explain, s.prompt, ...(s.lines ?? [])].filter(Boolean)) checked += checkText(t, where);
      if (s.kind === 'choice') checked += checkText(s.options[s.correct], `${where} (correct option)`);
    }));
    expect(checked).toBeGreaterThan(60);
  });

  it('the evaluator catches a wrong number (mutation guard)', () => {
    expect(() => checkText('$1{,}74^2 = 3{,}0267$', 'mutation')).toThrow();
    expect(() => checkText('$120 < \\sqrt{14450} < 120{,}2$', 'mutation')).toThrow();
    expect(() => checkText('$\\sqrt{\\frac{4}{9}} = \\frac{2}{9}$', 'mutation')).toThrow();
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const A = dec('2,89'), B = R(4), C = R(3);
    // 1) √2,89 = 1,7 : décimal, donc ناطق.
    const sideA = rsqrt(A);
    expect(sideA).toEqual(dec('1,7'));
    same(expectedOf('masala-1', 0)[0], sideA);
    // 2) 4 m² en 9 pièces : √(4/9) = 2/3 ; la calculatrice ; 200 = 3 × 66 + 2.
    const piece = dvd(B, R(9));
    const sidePiece = rsqrt(piece);
    expect(sidePiece).toEqual(R(2, 3));
    expect(correctOf('masala-1', 1, 0)).toBe('$\\frac{4}{9}$');
    expect(correctOf('masala-1', 1, 1)).toBe('$\\sqrt{\\frac{4}{9}} = \\frac{2}{3}$');
    const [rB, triple] = expectedOf('masala-1', 1);
    same(rB, rsqrt(B));
    expect(eq(dvd(rsqrt(B), R(3)), sidePiece)).toBe(true); // ضلع الزربية ÷ 3
    const shown = dec('0,6666666667');
    // l'affichage à 10 chiffres de 2/3 : 2 × 10^10 / 3 arrondi = 6666666667
    expect(eq(R((2n * 10n ** 10n * 2n + 3n) / 6n, 10n ** 10n), shown)).toBe(true);
    same(triple, mul(R(3), shown));
    expect(eq(mul(R(3), shown), R(2))).toBe(false); // ce n'est PAS la valeur exacte
    expect(lt(shown, sidePiece)).toBe(false); // l'affichage arrondit vers le haut
    expect([200 % 3, Math.floor(200 / 3)]).toEqual([2, 66]); // 2/3 m = 200/3 cm : pas un nombre entier de cm
    // 3) √3 : غير ناطق ; 1,73 < √3 < 1,74 ; 4 × 1,74 = 6,96 ; × 500.
    expect(isSquareOfRational(C)).toBe(false);
    expect(display10(3n)).toBe('1,732050808');
    expect(PROBLEM['masala-1'].parts[2].question).toContain('1,732050808');
    const [lo, hi] = bracket(C, 2);
    expect([lo, hi]).toEqual([dec('1,73'), dec('1,74')]);
    const [sq174, ex, total, price] = expectedOf('masala-1', 2);
    same(sq174, mul(hi, hi));
    same(ex, hi);
    same(total, mul(R(4), hi));
    same(price, mul(mul(R(4), hi), R(500)));
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const [L, W, S, nRect, nSquare, bar, barPrice] = [120n, 50n, 85n, 12, 15, 600, 1450];
    // 1) d² = 120² + 50² = 16900 = 130².
    const d2 = L * L + W * W;
    const dRect = rsqrt(R(d2));
    expect(expectedOf('masala-2', 0)).toEqual([Number(d2), Number(dRect[0])]);
    expect(dRect[1]).toBe(1n);
    // 2) d² = 85² + 85² = 14450, pas un carré ; 120 < √14450 < 121 ; affichage 120,2081528.
    const s2 = 2n * S * S;
    expect(isSquareOfRational(R(s2))).toBe(false);
    expect(display10(s2)).toBe('120,2081528');
    expect(PROBLEM['masala-2'].parts[1].question).toContain(display10(s2));
    const [lo, hi] = bracket(R(s2), 0);
    expect([lo, hi]).toEqual([R(120), R(121)]);
    expect(expectedOf('masala-2', 1)).toEqual([Number(s2), Number(hi[0] * hi[0]), Number(hi[0])]);
    // 3) 4 renforts par barre de 600 cm quel que soit le type ; 27 renforts ; 7 barres ; prix.
    const dSq = Number(hi[0]), dR = Number(dRect[0]);
    const perBarSq = Math.floor(bar / dSq), perBarRect = Math.floor(bar / dR);
    expect([perBarSq, perBarRect]).toEqual([4, 4]);
    expect(4 * Math.max(dSq, dR)).toBeLessThanOrEqual(bar); // 4 renforts quelconques tiennent
    expect(5 * Math.min(dSq, dR)).toBeGreaterThan(bar); // 5 jamais
    const braces = nRect + nSquare, bars = Math.ceil(braces / 4);
    expect(expectedOf('masala-2', 2)).toEqual([perBarSq, perBarRect, braces, bars, bars * barPrice]);
    // le piège : avec 120 cm (valeur par défaut) on croirait en tirer 5 par barre, et un renfort trop court.
    expect(Math.floor(bar / Number(lo[0]))).toBe(5);
    expect(lt(mul(lo, lo), R(s2))).toBe(true);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const first = R(441), second = mul(R(2), first), a4 = [R(21), dec('29,7')], a3 = [dec('29,7'), R(42)];
    // 1) √441 = 21 = largeur A4.
    const s1 = rsqrt(first);
    expect(expectedOf('masala-3', 0)).toEqual([441, Number(s1[0])]);
    expect(eq(s1, a4[0])).toBe(true);
    // 2) 882 ; 29,7² = 882,09 ≠ 882 ; 882 n'est pas un carré de rationnel.
    const [area2, sq297] = expectedOf('masala-3', 1);
    same(area2, second);
    same(sq297, mul(a4[1], a4[1]));
    expect(eq(mul(a4[1], a4[1]), second)).toBe(false);
    expect(isSquareOfRational(second)).toBe(false);
    expect(display10(882n)).toBe('29,69848481'); // la calculatrice « presque 29,7 »
    // 3) 21 < √882 < 29,7 : pas sur A4 (largeur 21), oui sur A3 (29,7 × 42) ; 40 × 60.
    expect(lt(mul(a4[0], a4[0]), second)).toBe(true);
    expect(lt(second, mul(a3[0], a3[0]))).toBe(true);
    expect(expectedOf('masala-3', 2)).toEqual([40 * 60]);
  });
});
