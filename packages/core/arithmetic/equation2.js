/**
 * Les ÉQUATIONS et les EXPRESSIONS littérales de 2AM (unité 4 « مفهوم معادلة », 2026-10-29) — arithmétique EXACTE (rationnels BigInt
 * de `powers.js`), importée PAR CHEMIN (`@smarter-academy/core/arithmetic/equation2.js`), jamais par le barrel du cœur
 * (BUNDLE_BOUNDARIES §4). Construite sur `substitution.js` (arbre, évaluation) : elle n'ajoute que ce que les leçons 2AM demandent.
 *
 * Elle grandit leçon par leçon :
 *   E1 `ibara-harfiya-intaj`        valueTable · firstMismatch · sameCount · simplified · showTimes · polyOf
 *   E2 `hall-mushkil-muadala`       (à venir : solveForm, checkForm, undoChain, formOf)
 *   E3 `ikhtibar-musawat-mutabayina` (à venir : parseRelation, testAt, whichHold, identityVerdict)
 *
 * Les valeurs de cette leçon sont toutes ≥ 0 (ordre de génération, plan README, question 10) ; le code lui-même est exact pour les relatifs.
 */
import { rat, parseRat, add, mul, neg, eq, sign, ratText } from './powers.js';
import {
  parseExpression, evaluate, writeLine, tokensText, slots, decimalText, samePolynomial, witness, LETTERS_2AM,
} from './substitution.js';

/** Un nombre (entier JS, texte « 1,5 », rationnel) → rationnel. */
export const asRat = (v) => (v && typeof v === 'object' && 'n' in v ? rat(v.n, v.d) : typeof v === 'number' ? rat(v) : parseRat(v));

const parse = (text) => parseExpression(text, { letters: LETTERS_2AM });

/** Le format d'une valeur dans la ligne : entier, décimal (« 1,5 ») ou fraction. */
const envOf = (letter, v, extra = {}) => {
  const all = { ...extra, [letter]: v };
  return Object.fromEntries(Object.entries(all).map(([k, val]) => {
    const r = asRat(val);
    return [k, { v: r, fmt: r.d === 1n ? 'int' : decimalText(r) ? 'dec' : 'frac' }];
  }));
};

/**
 * Le TABLEAU DE VALEURS d'une expression en `letter` : une rangée par valeur, `{ v, value, line, text }` — `line` est la ligne du manuel
 * « 5 × 40 + 1 » (chaque × caché écrit), `text` « 5 × 40 + 1 = 201 ». `env` donne la valeur des AUTRES lettres (deux lettres : « 3x + 4y + 1 »).
 */
export function valueTable(text, letter, values, env = {}) {
  const tree = parse(text);
  const sl = slots(tree);
  const choices = sl.map(() => ({ times: true }));
  return values.map((raw) => {
    const e = envOf(letter, raw, env);
    const value = evaluate(tree, Object.fromEntries(Object.entries(e).map(([k, o]) => [k, o.v])));
    const line = tokensText(writeLine(tree, e, choices));
    return { v: asRat(raw), value, line, text: `${line} = ${ratText(value).replace('/', '/')}` };
  });
}

/** Les expressions `a` et `b` (textes), évaluées à chaque valeur : la première valeur où elles DIFFÈRENT, ou null (le contre-exemple). */
export function firstMismatch(textA, textB, letter, values) {
  const a = parse(textA); const b = parse(textB);
  const hit = witness(a, b, values.map(asRat), letter);
  return hit == null ? null : hit;
}

/** Deux écritures donnent-elles le MÊME polynôme en `letter` (le même décompte pour tout n) ? null si l'une n'est pas un polynôme entier. */
export function sameCount(textA, textB, letter = 'n') {
  return samePolynomial(parse(textA), parse(textB), letter);
}

/* ── La forme simplifiée ─────────────────────────────────────────────────────────────────────── */

/** Polynôme multivarié : { 'a2b1': { c: rat, e: { a: 2, b: 1 } } } ; la clé est vide pour le terme constant. */
export function polyOf(tree) {
  const key = (e) => Object.keys(e).sort().filter((k) => e[k] > 0).map((k) => `${k}${e[k]}`).join('');
  const addP = (a, b, k = 1) => {
    const r = { ...a };
    for (const [m, t] of Object.entries(b)) {
      const c = k === 1 ? t.c : neg(t.c);
      r[m] = { c: add(r[m]?.c ?? rat(0), c), e: t.e };
    }
    return r;
  };
  const mulP = (a, b) => {
    const r = {};
    for (const x of Object.values(a)) for (const y of Object.values(b)) {
      const e = { ...x.e };
      for (const [l, n] of Object.entries(y.e)) e[l] = (e[l] ?? 0) + n;
      const m = key(e);
      r[m] = { c: add(r[m]?.c ?? rat(0), mul(x.c, y.c)), e };
    }
    return r;
  };
  const go = (n) => {
    switch (n.t) {
      case 'num': return { '': { c: n.v, e: {} } };
      case 'var': return { [`${n.name}1`]: { c: rat(1), e: { [n.name]: 1 } } };
      case 'neg': return addP({}, go(n.a), -1);
      case 'add': return addP(go(n.a), go(n.b));
      case 'sub': return addP(go(n.a), go(n.b), -1);
      case 'mul': return mulP(go(n.a), go(n.b));
      case 'pow': { let r = { '': { c: rat(1), e: {} } }; const b = go(n.a); for (let i = 0; i < n.n; i += 1) r = mulP(r, b); return r; }
      default: throw new Error('nœud inconnu');
    }
  };
  const poly = go(tree);
  for (const m of Object.keys(poly)) if (poly[m].c.n === 0n) delete poly[m];
  return poly;
}

const SUP = { 2: '²', 3: '³' };
const monoText = (e) => Object.keys(e).sort().filter((l) => e[l] > 0).map((l) => (e[l] === 1 ? l : e[l] <= 3 ? `${l}${SUP[e[l]]}` : `${l}^${e[l]}`)).join('');
const coefText = (c) => { const a = c.n < 0n ? -c.n : c.n; return c.d === 1n ? String(a) : (decimalText({ n: a, d: c.d }) ?? `${a}/${c.d}`).replace('.', ','); };

/**
 * L'écriture SIMPLIFIÉE (× omis, 1·a = a, 0·a = 0, a², a³, k·a + m·a = (k + m)·a) : « 3 × a × b » → « 3ab », « 2a + 5a − 3a » → « 4a »,
 * « c + c × c + c » → « c² + 2c ». Termes par degré décroissant puis par lettres, le terme constant en dernier. Le polynôme nul s'écrit « 0 ».
 */
export function simplified(text) {
  const poly = polyOf(parse(text));
  const terms = Object.values(poly).sort((x, y) => {
    const dx = Object.values(x.e).reduce((s, n) => s + n, 0); const dy = Object.values(y.e).reduce((s, n) => s + n, 0);
    return dy - dx || monoText(x.e).localeCompare(monoText(y.e));
  });
  if (!terms.length) return '0';
  return terms.map((t, i) => {
    const m = monoText(t.e);
    const one = t.c.n === 1n && t.c.d === 1n;
    const body = m ? `${one ? '' : coefText(t.c)}${m}` : coefText(t.c);
    const neg1 = sign(t.c) < 0;
    return i === 0 ? `${neg1 ? '−' : ''}${body}` : ` ${neg1 ? '−' : '+'} ${body}`;
  }).join('');
}

/** Le × CACHÉ réécrit (exercice « أعد كتابة كلّ من العبارات بإضافة إشارات العمليات غير الظاهرة ») : « 2x² + 12 » → « 2 × x × x + 12 ». */
export function showTimes(text) {
  const tree = parse(text);
  const num = (v) => coefText(v);
  const wrap = (n, cond) => (cond ? `(${go(n)})` : go(n));
  const go = (n) => {
    switch (n.t) {
      case 'num': return `${sign(n.v) < 0 ? '−' : ''}${num(n.v)}`;
      case 'var': return n.name;
      case 'neg': return `−${wrap(n.a, n.a.t === 'add' || n.a.t === 'sub')}`;
      case 'add': return `${go(n.a)} + ${go(n.b)}`;
      case 'sub': return `${go(n.a)} − ${wrap(n.b, n.b.t === 'add' || n.b.t === 'sub')}`;
      case 'mul': return `${wrap(n.a, n.a.t === 'add' || n.a.t === 'sub')} × ${wrap(n.b, n.b.t === 'add' || n.b.t === 'sub')}`;
      case 'pow': return n.a.t === 'var' || n.a.t === 'num' ? Array.from({ length: n.n }, () => go(n.a)).join(' × ') : `(${go(n.a)})${SUP[n.n]}`;
      default: return '';
    }
  };
  return go(tree);
}

export { eq as sameValue };
