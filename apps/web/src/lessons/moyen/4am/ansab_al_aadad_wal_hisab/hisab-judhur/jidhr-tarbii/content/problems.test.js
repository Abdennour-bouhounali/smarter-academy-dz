import { describe, it, expect } from 'vitest';
import { validateProblem, demandsOf } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

// ── Arithmétique EXACTE : rationnels en BigInt [num, den], aucun flottant. ──
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
const isqrt = (n) => { if (n < 2n) return n; let x = n, y = (x + 1n) / 2n; while (y < x) { x = y; y = (x + n / x) / 2n; } return x; };
/** √ exacte d'un rationnel positif, ou null s'il n'est pas le carré d'un rationnel. */
const rsqrt = ([n, d]) => { const a = isqrt(n), b = isqrt(d); return a * a === n && b * b === d ? R(a, b) : null; };
/** « 5,83 », « 5.83 », 33.9889 → rationnel exact. */
const dec = (v) => { const [i, f = ''] = String(v).replace(',', '.').split('.'); return R(BigInt(i + f), 10n ** BigInt(f.length)); };
const sq = (x) => mul(x, x);

// ── Vérificateur des ÉGALITÉS écrites (explain, lignes, bonnes options) ─────
// Évalue + − × ÷ ^2 \sqrt{} \frac{}{} et les parenthèses en rationnels exacts ;
// une racine non exacte ou une lettre rend le membre non évaluable (ignoré).
function evalExpr(src) {
  const s = src
    .replace(/\\,(?:m\^2|m|cm)/g, '')
    .replace(/\(\\sqrt\{([^{}]+)\}\)\^2/g, '($1)') // (√a)² = a, a ≥ 0 : le seul usage d'une racine non exacte
    .replace(/\{,\}/g, '.')
    .replace(/\\left|\\right/g, '')
    .replace(/\\times/g, '*').replace(/\\div/g, '/')
    .replace(/\\d?frac/g, 'F').replace(/\\sqrt/g, 'S')
    .replace(/\s+/g, '');
  if (!/^[\d.+\-*/()^{}SF]+$/.test(s)) return null;
  let i = 0; let bad = false;
  const group = () => { i++; const v = sum(); i++; return v; }; // ( … ) ou { … }
  const atom = () => {
    if (s[i] === '(' || s[i] === '{') return group();
    if (s[i] === '-') { i++; const v = factor(); return v && [-v[0], v[1]]; }
    if (s[i] === 'S') { i++; const v = group(); const r = v && rsqrt(v); if (!r) bad = true; return r; }
    if (s[i] === 'F') { i++; const n = group(); const d = group(); return n && d && dvd(n, d); }
    const j = i; while (/[\d.]/.test(s[i])) i++;
    if (j === i) { bad = true; return null; }
    return dec(s.slice(j, i));
  };
  const factor = () => { let v = atom(); while (s[i] === '^') { i++; const e = Number(atom()?.[0]); if (!v) continue; let p = R(1); for (let k = 0; k < e; k++) p = mul(p, v); v = p; } return v; };
  const prod = () => { let v = factor(); while (s[i] === '*' || s[i] === '/') { const op = s[i++]; const w = factor(); v = v && w && (op === '*' ? mul(v, w) : dvd(v, w)); } return v; };
  const sum = () => { let v = prod(); while (s[i] === '+' || s[i] === '-') { const op = s[i++]; const w = prod(); v = v && w && (op === '+' ? add(v, w) : sub(v, w)); } return v; };
  const v = sum();
  return !bad && i === s.length ? v : null;
}
/** Chaque formule $…$ : ses membres NUMÉRIQUES « = » sont égaux, « \neq » sont différents. */
function checkText(text, where) {
  let checked = 0;
  for (const [, f] of text.matchAll(/\$([^$]+)\$/g)) {
    if (f.includes('\\neq')) {
      const [x, y] = f.split('\\neq').map(evalExpr);
      if (x && y) { expect(eq(x, y), `${where}: ${f}`).toBe(false); checked++; }
      continue;
    }
    const sides = f.split('=').map(evalExpr).filter(Boolean);
    if (sides.length < 2) continue;
    for (const v of sides.slice(1)) expect(v, `${where}: ${f}`).toEqual(sides[0]);
    checked++;
  }
  return checked;
}

const numericOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric');
const expectedOf = (id, part) => numericOf(id, part).map((s) => dec(s.expected));
const correctOf = (id, part, k) => { const s = PROBLEM[id].parts[part].steps.filter((st) => st.kind === 'choice')[k]; return s.options[s.correct]; };
const texDec = ([n, d]) => { // rationnel décimal → « 2{,}5 »
  let k = 0n; while ((10n ** k) % d !== 0n) k++;
  const v = (n * (10n ** k / d)).toString().padStart(Number(k) + 1, '0');
  return k === 0n ? v : `${v.slice(0, -Number(k))}{,}${v.slice(-Number(k))}`;
};

describe('les مسائل du درس 1 de l’unité 2 « الجذر التربيعي لعدد موجب »', () => {
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
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBe(74);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation');
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 4], ['masala-2', 5], ['masala-3', 6]]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      expect(part.asks.length, `${p.id} ${part.label}`).toBe(demandsOf(part.question));
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('data: useful items, and at least one useless item that is a number', () => {
    for (const p of PROBLEMS) {
      expect(p.data.filter((d) => d.useful).length).toBeGreaterThanOrEqual(4);
      expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
      for (const d of p.data) expect(d.text.includes('$'), `${p.id} ${d.id}`).toBe(false);
    }
  });

  it('no bare √, power or point name in the Arabic prose — every formula is a $…$ island', () => {
    const texts = (p) => [p.statement, ...p.parts.flatMap((part) => [part.question, ...part.asks, ...part.steps.flatMap((s) => [s.prompt, s.explain, ...(s.options ?? []), ...(s.lines ?? [])])])].filter(Boolean);
    for (const p of PROBLEMS) for (const t of texts(p)) {
      const prose = t.replace(/\$[^$]*\$/g, '');
      expect(prose, `${p.id}: ${t}`).not.toMatch(/√|\^|²|\\|\b[A-E]{2,}\b|\d\s*\/\s*\d/);
    }
  });

  it('every written equality (explain, prompts, solution lines, correct options) is exact', () => {
    let checked = 0;
    for (const p of PROBLEMS) p.parts.forEach((part, pi) => part.steps.forEach((s, si) => {
      const where = `${p.id} ${part.label} step ${si + 1}`;
      for (const t of [s.explain, s.prompt, ...(s.lines ?? [])].filter(Boolean)) checked += checkText(t, where);
      if (s.kind === 'choice') checked += checkText(s.options[s.correct], `${where} (correct option)`);
    }));
    expect(checked).toBeGreaterThan(40);
  });

  it('the checker itself catches a wrong number', () => {
    expect(() => checkText('$5{,}83 \\times 5{,}83 = 33{,}9898$', 'mutation')).toThrow();
    expect(() => checkText('$h = \\sqrt{144} = \\sqrt{12^2} = 13$', 'mutation')).toThrow();
    expect(() => checkText('$0{,}3^2 = 0{,}09$ و $0{,}09 \\neq 0{,}09$', 'mutation')).toThrow();
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const [AB, AC, grass, frame] = [R(3), R(5), R(350), R(450)];
    const shown = '5,830951895'; // l'affichage de la calculatrice, 10 chiffres
    const st = PROBLEM['masala-1'].statement;
    for (const n of ['3\\,m', '5\\,m', shown, '350 دج', '450 دج']) expect(st).toContain(n);
    // 1) BC² = AB² + AC² = 34 : aire du carré ; 34 n'est pas un carré parfait → √34.
    const area = add(sq(AB), sq(AC));
    expect(expectedOf('masala-1', 0)).toEqual([area]);
    expect(rsqrt(area)).toBeNull();
    expect(correctOf('masala-1', 0, 1)).toBe(`$\\sqrt{${area[0]}}\\,m$`);
    // L'affichage est √34 arrondi à 10⁻⁹ : ⌊√(34·10¹⁸)⌋ = 5830951894,8… → 5830951895.
    const scaled = area[0] * 10n ** 18n;
    const fl = isqrt(scaled);
    const rounded = 4n * scaled > (2n * fl + 1n) ** 2n ? fl + 1n : fl; // au plus proche : √s > fl + ½ ⇔ 4s > (2fl + 1)²
    expect(dec(shown)).toEqual(R(rounded, 10n ** 9n));
    // 2) 5,83² = 33,9889 ≠ 34 ; le carré de l'affichage finit par 5 à la 18e décimale.
    const approx = dec('5,83');
    expect(sq(approx)).toEqual(dec('33,9889'));
    expect(eq(sq(approx), area)).toBe(false);
    const big = BigInt(shown.replace(',', ''));
    expect((big * big) % 10n).toBe(5n);
    expect(eq(sq(dec(shown)), area)).toBe(false);
    expect(expectedOf('masala-1', 1)).toEqual([sq(approx), R((big * big) % 10n)]);
    // 3) aire exacte (√34)² = 34 → 34 × 350 ; périmètre 4 × affichage → 23,32 ; 24 m entiers × 450.
    const perim = mul(R(4), dec(shown));
    expect(perim).toEqual(dec('23,32380758'));
    const perim2 = R((perim[0] * 100n + perim[1] / 2n) / perim[1], 100n); // arrondi au centième
    const meters = (perim[0] + perim[1] - 1n) / perim[1]; // mètres entiers : partie entière par excès
    expect(meters).toBe(24n);
    expect(lt(R(meters - 1n), perim)).toBe(true); // 23 m ne suffisent pas
    expect(expectedOf('masala-1', 2)).toEqual([mul(area, grass), perim2, mul(R(meters), frame)]);
    expect(correctOf('masala-1', 2, 0)).toBe(`$(\\sqrt{${area[0]}})^2 = ${area[0]}\\,m^2$`);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const [a1, a2, a3, braid] = [dec('1,96'), dec('1,44'), dec('0,9'), R(180)];
    const st = PROBLEM['masala-2'].statement;
    for (const n of ['1{,}96\\,m^2', '1{,}44\\,m^2', '0{,}9\\,m^2', '180 دج']) expect(st).toContain(n);
    // 1) √1,96 = 1,4 et √1,44 = 1,2 (racines exactes).
    const [c1, c2] = [rsqrt(a1), rsqrt(a2)];
    expect(expectedOf('masala-2', 0)).toEqual([c1, c2]);
    expect([texDec(c1), texDec(c2)]).toEqual(['1{,}4', '1{,}2']);
    // 2) 0,3² = 0,09 ≠ 0,9 ; 0,9 n'est le carré d'aucun décimal → √0,9.
    const wrong = dec('0,3');
    expect(expectedOf('masala-2', 1)).toEqual([sq(wrong)]);
    expect(eq(sq(wrong), a3)).toBe(false);
    expect(eq(mul(sq(wrong), R(10)), a3)).toBe(true); // « عُشر المساحة المطلوبة »
    expect(rsqrt(a3)).toBeNull();
    expect(correctOf('masala-2', 1, 1)).toBe('$\\sqrt{0{,}9}\\,m$');
    // 3) périmètres 4 × 1,4 + 4 × 1,2 = 10,4 m ; × 180 دج.
    const len = add(mul(R(4), c1), mul(R(4), c2));
    expect(expectedOf('masala-2', 2)).toEqual([len, mul(len, braid)]);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const [L1, L2, foot1, foot2, balcony] = [R(13), R(10), R(5), R(4), dec('9,6')];
    const st = PROBLEM['masala-3'].statement;
    for (const n of ['13\\,m', '10\\,m', '5\\,m', '9{,}6\\,m']) expect(st).toContain(n);
    expect(PROBLEM['masala-3'].parts[1].question).toContain('4\\,m');
    // 1) h² = 13² − 5² = 144 → h = 12 (> 9,6 : le long atteindrait la شرفة).
    const h2 = sub(sq(L1), sq(foot1));
    expect(expectedOf('masala-3', 0)).toEqual([h2, rsqrt(h2)]);
    // 2) k² = 10² − 4² = 84, pas un carré → √84 ; 84 < 9,6² = 92,16 → n'atteint pas.
    const k2 = sub(sq(L2), sq(foot2));
    expect(rsqrt(k2)).toBeNull();
    expect(correctOf('masala-3', 1, 0)).toBe(`$\\sqrt{${k2[0]}}\\,m$`);
    expect(expectedOf('masala-3', 1)).toEqual([k2, sq(balcony)]);
    expect(lt(k2, sq(balcony))).toBe(true);
    // Les distracteurs sont de vraies erreurs : 10 − 4, 10² + 4², 84 ÷ 2.
    const opts = PROBLEM['masala-3'].parts[1].steps.find((s) => s.ask === 0).options;
    expect(opts).toEqual(expect.arrayContaining([`$${10 - 4}\\,m$`, `$\\sqrt{${100 + 16}}\\,m$`, `$${84 / 2}\\,m$`]));
    // 3) d² = 10² − 9,6² = 7,84 → d = 2,8 ; 4 − 2,8 = 1,2 m = 120 cm.
    const d2 = sub(sq(L2), sq(balcony));
    const d = rsqrt(d2);
    expect(d).toEqual(dec('2,8'));
    expect(expectedOf('masala-3', 2)).toEqual([d2, d, mul(sub(foot2, d), R(100))]);
  });
});
