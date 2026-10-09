import { polynomials } from '@smarter-academy/core';

const { termsTex, termTex, gcd, commonMonomial } = polynomials;

/**
 * turf-factoring — LE TERRAIN EN GAZON (unité 3 « الحساب الحرفي », leçon 3 et synthèse).
 *
 * Le geste INVERSE du terrain découpé : on ne coupe plus un terrain en zones,
 * on ASSEMBLE des plaques de gazon en un terrain rectangulaire. Les plaques
 * sont les termes de la somme : un carré x × x (x²), une bande x × 1 (x), un
 * carreau 1 × 1 (1). Si les plaques forment un rectangle, ses deux côtés SONT
 * les deux facteurs — c'est l'analyse (تحليل) : écrire une somme en produit.
 *
 * Deux modes, deux lectures du manuel (معارف 3, p. 34) :
 *
 *   rows    la distributivité à l'envers, ka + kb = k(a + b). L'élève ÉTIRE r,
 *           le nombre de RANGÉES identiques. Les plaques se répartissent : si r
 *           ne divise pas chaque nombre de plaques, les restes tombent hors du
 *           terrain (refus). La hauteur du terrain (r rangées de hauteur 1 ou x)
 *           est le facteur commun ; une rangée est l'autre facteur. Le plus
 *           grand r est le PGCD des coefficients — le facteur commun complet.
 *
 *   square  a² + 2ab + b² = (a + b)². Un carré x², b bandes, c carreaux.
 *           L'élève PORTE chaque bande à droite ou en bas du carré ; le coin
 *           exige alors p × q carreaux. Le terrain ne se ferme que si c = p × q :
 *           pour x² + 6x + 9, 2 | 4 exige 8 carreaux et refuse ; 3 | 3 ferme un
 *           CARRÉ (x + 3)². x² + 25 ne se ferme jamais : « لا تقبل تحليلا ».
 */

/** « 6x^2+4x », « 9x+3 », « 7x-21 » → [{c, p}] (puissances ≤ 2). */
export function parseTerms(src) {
  const parts = String(src).replace(/\s+/g, '').match(/[+-]?[^+-]+/g) ?? [];
  return parts.map((part) => {
    const m = part.match(/^([+-]?)(\d*)(x(?:\^(\d))?)?$/);
    if (!m || (m[2] === '' && !m[3])) throw new Error(`turf-factoring: terme illisible « ${part} »`);
    const sign = m[1] === '-' ? -1 : 1;
    const c = m[2] === '' ? 1 : Number(m[2]);
    const p = m[3] ? Number(m[4] ?? 1) : 0;
    return { c: sign * c, p };
  });
}

/* ── Mode rows : le facteur commun ─────────────────────────────────────── */

export function initRows({ expr }) {
  const terms = parseTerms(expr);
  const m = Math.min(...terms.map((t) => t.p));
  if (Math.max(...terms.map((t) => t.p)) - m > 1) throw new Error('turf-factoring rows: une rangée ne porte que deux sortes de plaques');
  return { mode: 'rows', expr, terms, m, r: null, tried: [] };
}

/** La règle de r : de 1 au plus grand nombre de plaques d'une sorte (borné à 12). */
export const rowsRange = (s) => ({ min: 1, max: Math.min(12, Math.max(2, ...s.terms.map((t) => Math.abs(t.c)))) });

/** Le découpage en r rangées : { r, valid, perRow: [{c,p}], leftover: [{c,p}] }. */
export function rowsLayout(s, r) {
  const perRow = s.terms.map((t) => ({ c: Math.trunc(t.c / r), p: t.p }));
  const leftover = s.terms.map((t) => ({ c: t.c - r * Math.trunc(t.c / r), p: t.p })).filter((t) => t.c !== 0);
  return { r, valid: leftover.length === 0, perRow, leftover };
}

export function canRow(s, r) {
  const { min, max } = rowsRange(s);
  if (!Number.isInteger(r) || r < min || r > max) return 'outOfRange';
  return true;
}

export function setRows(s, r) {
  if (canRow(s, r) !== true) return s;
  const l = rowsLayout(s, r);
  return { ...s, r, tried: [...s.tried.filter((t) => t.r !== r), { r, valid: l.valid }].sort((a, b) => a.r - b.r) };
}

/**
 * Le r affiché à l'ouverture (jamais un essai, jamais une réponse) : le premier nombre de rangées qui ne
 * partage PAS les plaques (un reste tombe hors du terrain) ; sinon (tout r convient) le minimum de la règle.
 */
export function defaultRows(s) {
  const { min, max } = rowsRange(s);
  for (let r = min; r <= max; r += 1) if (!rowsLayout(s, r).valid) return r;
  return min;
}

/** « جرّب كل الإمكانيات » : les r de la règle pas encore validés. */
export function untriedRows(s) {
  if (s.mode !== 'rows') return [];
  const { min, max } = rowsRange(s);
  const out = [];
  for (let r = min; r <= max; r += 1) if (!s.tried.some((t) => t.r === r)) out.push(r);
  return out;
}

/** Le plus grand nombre de rangées possible : le PGCD des coefficients. */
export const rowsGcd = (s) => s.terms.reduce((g, t) => gcd(g, t.c), 0);

/** Découverte : le plus grand r essayé ET juste, et un r refusé (le contraste). */
export function rowsDiscoveryReady(s) {
  const g = rowsGcd(s);
  return s.tried.some((t) => t.r === g && t.valid) && s.tried.some((t) => !t.valid);
}

/** Le facteur commun des r rangées : r·x^m (écrit « 2x », « 3 », « x »). */
export const rowsCommon = (s, r) => ({ c: r, p: s.m });

/** L'égalité lue sur le terrain : 6x^2 + 4x = 2x(3x + 2). */
export function rowsEquationTex(s, r) {
  const l = rowsLayout(s, r);
  if (!l.valid) return null;
  const common = termTex(rowsCommon(s, r), { lead: true });
  const other = termsTex(l.perRow.map((t) => ({ c: t.c, p: t.p - s.m })));
  const lhs = termsTex(s.terms);
  const commonTex = common === '1' ? '' : common;
  return `${lhs} = ${commonTex}(${other})`;
}

/** Le facteur commun le plus grand (monôme) — garde-fou des tests. */
export const fullCommon = (s) => commonMonomial(s.terms);

/* ── Mode square : l'identité remarquable ──────────────────────────────── */

export function initSquare({ b, c }) {
  return { mode: 'square', b, c, right: 0, bottom: 0, trials: [], closed: null };
}

export const stock = (s) => s.b - s.right - s.bottom;

/** Porter une bande : de la réserve vers « right » / « bottom », ou revenir en réserve. */
export function canPlace(s, from, to) {
  if (from === to) return '';
  if (s.closed) return 'closed';
  if (from === 'stock' && stock(s) <= 0) return '';
  if (from === 'right' && s.right <= 0) return '';
  if (from === 'bottom' && s.bottom <= 0) return '';
  return true;
}

export function place(s, from, to) {
  if (canPlace(s, from, to) !== true) return s;
  const n = { ...s };
  if (from === 'right') n.right -= 1;
  if (from === 'bottom') n.bottom -= 1;
  if (to === 'right') n.right += 1;
  if (to === 'bottom') n.bottom += 1;
  return n;
}

/** Le coin exige right × bottom carreaux. */
export const cornerNeed = (s) => s.right * s.bottom;

/**
 * Fermer le terrain : toutes les bandes posées, et exactement right × bottom
 * carreaux pour le coin. Un refus garde sa raison et ses nombres.
 */
export function canClose(s) {
  if (s.closed) return 'closed';
  if (stock(s) > 0) return 'stripsLeft';
  if (cornerNeed(s) !== s.c) return cornerNeed(s) > s.c ? 'cornerShort' : 'cornerExtra';
  return true;
}

export function close(s) {
  const verdict = canClose(s);
  if (verdict === 'closed' || verdict === 'stripsLeft') return s;
  const trial = { right: s.right, bottom: s.bottom, need: cornerNeed(s), ok: verdict === true };
  const trials = [...s.trials.filter((t) => !(t.right === trial.right && t.bottom === trial.bottom)), trial];
  return { ...s, trials, closed: verdict === true ? { p: s.right, q: s.bottom } : null };
}

/** Rouvrir le terrain fermé pour essayer une autre répartition. */
export const reopen = (s) => ({ ...s, closed: null });

/** Existe-t-il une répartition qui ferme ? (p + q = b et p × q = c) */
export function closable(s) {
  for (let p = 0; p <= s.b; p += 1) if (p * (s.b - p) === s.c) return true;
  return false;
}

/**
 * Découverte : un terrain CARRÉ fermé (p = q) et une répartition refusée —
 * ou, pour une somme qui ne se ferme jamais (x² + 25), le refus lui-même :
 * la seule répartition possible a été essayée.
 */
export function squareDiscoveryReady(s) {
  if (!closable(s)) return s.trials.length > 0 && s.b === 0 ? true : s.trials.filter((t) => !t.ok).length >= Math.min(2, s.b + 1);
  return s.trials.some((t) => t.ok && t.right === t.bottom) && s.trials.some((t) => !t.ok);
}

export const squareExprTex = (s) => termsTex([{ c: 1, p: 2 }, ...(s.b ? [{ c: s.b, p: 1 }] : []), ...(s.c ? [{ c: s.c, p: 0 }] : [])]);

/** L'égalité du terrain fermé : x^2 + 6x + 9 = (x + 3)^2, ou (x + 2)(x + 4). */
export function squareEquationTex(s) {
  if (!s.closed) return null;
  const { p, q } = s.closed;
  const side = (k) => (k === 0 ? 'x' : `(x + ${k})`);
  const rhs = p === q ? (p === 0 ? 'x^2' : `(x + ${p})^2`) : `${side(p)}${side(q)}`;
  return `${squareExprTex(s)} = ${rhs}`;
}

/** La somme des plaques en LaTeX : « 6x^2 + 4x ». */
export const rowsExprTex = (s) => termsTex(s.terms);
/** La hauteur du terrain à r rangées : « 2x », « 3 », « x ». */
export const rowsCommonTex = (s, r) => termTex(rowsCommon(s, r), { lead: true });
