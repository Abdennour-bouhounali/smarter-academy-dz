import * as polynomials from '@smarter-academy/core/arithmetic/polynomials.js';

const { partialProducts, reduce, evaluate, termsTex, factorTex, termTex, samePolynomial } = polynomials;

/**
 * pitch-expansion — LE TERRAIN DÉCOUPÉ (unité 3 « الحساب الحرفي », leçons 1 et 2).
 *
 * Un terrain rectangulaire dont la LONGUEUR est le premier facteur et la
 * LARGEUR le second : (3x − 1)(3 + x). Chaque terme d'un facteur est un
 * segment du côté ; le terrain se découpe donc en zones, une par couple de
 * termes, et l'aire de chaque zone est un produit partiel. C'est la lecture
 * par aires du manuel (le carré MNPQ, p. 32 ; le tableau de Descartes, p. 31).
 *
 * Trois gestes, une seule mathématique :
 *   ÉTIRER x      la lettre est une longueur : le terrain grandit, les zones
 *                 suivent ; l'égalité doit tenir POUR TOUTE valeur de x.
 *   PORTER        chaque zone dans « المجموع » : le développement s'écrit
 *                 terme à terme, sous les yeux, à partir des zones portées.
 *   FUSIONNER     deux termes SEMBLABLES (même puissance) se réunissent ;
 *                 deux termes non semblables REFUSENT (x² est un carré, 3x
 *                 une bande) — c'est la réduction (تبسيط).
 *
 * RÉSISTANCE : « تحقّق » compare l'aire du terrain (le produit) à la somme
 * portée, pour la valeur de x à l'écran. Tant qu'une zone manque, la somme
 * est TROP PETITE (ou trop grande, pour une zone retranchée) et la zone
 * oubliée s'allume avec son aire — c'est l'erreur (a + b)² = a² + b² rendue
 * visible : les deux bandes ab manquent.
 *
 * Termes négatifs (a − b) : le segment −b est RETRANCHÉ de a, dessiné hachuré
 * à l'intérieur ; la zone (−b)(−d) retranchée deux fois est RAJOUTÉE
 * (hachures croisées) — la figure de (a − b)² du manuel.
 */

const TERM_RE = /^([+-]?)(\d*)(x?)$/;

/** « 3x-1 » → [{c:3,p:1},{c:-1,p:0}] ; « x+10+x » garde les deux x (un côté fait de trois segments). */
export function parseFactor(src) {
  const parts = String(src).replace(/\s+/g, '').match(/[+-]?[^+-]+/g) ?? [];
  return parts.map((part) => {
    const m = part.match(TERM_RE);
    if (!m || (m[2] === '' && m[3] === '')) throw new Error(`pitch-expansion: terme illisible « ${part} »`);
    const sign = m[1] === '-' ? -1 : 1;
    const c = m[2] === '' ? 1 : Number(m[2]);
    return { c: sign * c, p: m[3] ? 1 : 0 };
  });
}

/** « 3x-1|3+x » → [f1, f2]. Un seul facteur ⇒ son carré (« x+3 » ⇔ « x+3|x+3 »). */
export function parseExpr(expr) {
  const [a, b] = String(expr).split('|');
  const f1 = parseFactor(a);
  return [f1, b == null ? f1 : parseFactor(b)];
}

const sameFactor = (f, g) => f.length === g.length && f.every((t, k) => t.c === g[k].c && t.p === g[k].p);

/** La nature du produit, qui choisit la découverte (le vocabulaire du manuel). */
export function kindOf([f1, f2]) {
  if (f1.length === 1 || f2.length === 1) return 'distributive';
  if (f1.length === 2 && f2.length === 2) {
    if (sameFactor(f1, f2)) return f1[1].c < 0 ? 'square-diff' : 'square-sum';
    const flip = (f) => [f[0], { ...f[1], c: -f[1].c }];
    if (sameFactor(f1, flip(f2)) && f1[0].c > 0) return 'sum-diff';
  }
  return 'double';
}

/** La valeur (entière) d'un terme pour x. */
const tv = (t, x) => t.c * x ** t.p;

/** Un côté est dessinable pour x si ses termes positifs l'emportent sur ses termes retranchés. */
function drawable(f, x) {
  const pos = f.filter((t) => tv(t, x) > 0).reduce((s, t) => s + tv(t, x), 0);
  const neg = f.filter((t) => tv(t, x) < 0).reduce((s, t) => s - tv(t, x), 0);
  return pos > 0 && neg < pos;
}

/**
 * La règle de x : à partir de la plus petite valeur entière qui dessine les
 * deux côtés, jusqu'à `span` crans plus loin — et jamais au-delà de la
 * dernière valeur dessinable (5 − 2x s'arrête à x = 2). Un facteur qui n'est
 * positif pour aucun x de 1 à 50 (1 − x, −x − 2) n'est pas un terrain : erreur
 * de contenu, levée tout de suite plutôt qu'un terrain vide.
 */
export function xRange([f1, f2], span = 7) {
  const ok = (v) => drawable(f1, v) && drawable(f2, v);
  let min = 1;
  while (min <= 50 && !ok(min)) min += 1;
  if (min > 50) throw new Error('pitch-expansion: un côté n’est positif pour aucune valeur de x');
  let max = min;
  while (max < min + span && ok(max + 1)) max += 1;
  return { min, max };
}

export function init({ expr, simplify = true }) {
  const factors = parseExpr(expr);
  const cells = partialProducts(factors[0], factors[1]);
  return {
    expr, factors, simplify, kind: kindOf(factors), cells,
    collected: [],        // ids de zones portées, dans l'ordre du geste
    tray: [],             // les termes de « المجموع » : { id, term, from: [ids de zones] }
    trials: [],           // { x, ok, product, sum, missing: [ids] } — une vérification par valeur de x
    lastRefusal: null,
  };
}

/** La géométrie d'un côté pour x : segments { k, start, len, negative } en unités de longueur. */
export function sideSegments(f, x) {
  const segs = [];
  let at = 0;
  f.forEach((t, k) => { const v = tv(t, x); if (v > 0) { segs.push({ k, start: at, len: v, negative: false }); at += v; } });
  const total = at;
  let back = total;
  f.forEach((t, k) => { const v = tv(t, x); if (v < 0) { back += v; segs.push({ k, start: back, len: -v, negative: true }); } });
  return { segs: segs.sort((a, b) => a.k - b.k), total };
}

/** Les zones dessinées pour x : rectangles en unités, avec le signe de leur aire. */
export function zones(s, x) {
  const A = sideSegments(s.factors[0], x);
  const B = sideSegments(s.factors[1], x);
  return {
    width: A.total, height: B.total,
    zones: s.cells.map((cell) => {
      const a = A.segs[cell.i]; const b = B.segs[cell.j];
      const removed = a.negative !== b.negative;           // retranchée une fois
      const restored = a.negative && b.negative;           // retranchée deux fois → rajoutée
      return { ...cell, x0: a.start, y0: b.start, w: a.len, h: b.len, removed, restored, area: tv(cell.term, x) };
    }),
  };
}

export const product = (s, x) => evaluate(s.factors[0], x) * evaluate(s.factors[1], x);
export const traySum = (s, x) => s.tray.reduce((sum, chip) => sum + tv(chip.term, x), 0);
export const allCollected = (s) => s.collected.length === s.cells.length;
export const missing = (s) => s.cells.filter((c) => !s.collected.includes(c.id)).map((c) => c.id);

export function canCollect(s, id) {
  if (!s.cells.some((c) => c.id === id)) return '';
  if (s.collected.includes(id)) return 'already';
  return true;
}

export function collect(s, id) {
  if (canCollect(s, id) !== true) return s;
  const cell = s.cells.find((c) => c.id === id);
  return { ...s, collected: [...s.collected, id], tray: [...s.tray, { id: `t${id}`, term: cell.term, from: [id] }], lastRefusal: null };
}

/** Rendre une zone : on la retire de la somme (tant qu'elle n'a pas été fusionnée). */
export function uncollect(s, id) {
  const chip = s.tray.find((c) => c.from.length === 1 && c.from[0] === id);
  if (!chip) return s;
  return { ...s, collected: s.collected.filter((c) => c !== id), tray: s.tray.filter((c) => c !== chip) };
}

/**
 * Fusionner deux termes de la somme : seulement s'ils sont SEMBLABLES.
 * Deux termes opposés (+3x et −3x) s'annulent : le terme disparaît.
 */
export function canMerge(s, a, b) {
  if (a === b) return '';
  const ca = s.tray.find((c) => c.id === a); const cb = s.tray.find((c) => c.id === b);
  if (!ca || !cb) return '';
  if (!s.simplify) return 'notYet';
  if (ca.term.p !== cb.term.p) return 'notLike';
  return true;
}

export function merge(s, a, b) {
  if (canMerge(s, a, b) !== true) return s;
  const ca = s.tray.find((c) => c.id === a); const cb = s.tray.find((c) => c.id === b);
  const c = ca.term.c + cb.term.c;
  const rest = s.tray.filter((t) => t.id !== a && t.id !== b);
  const at = s.tray.indexOf(cb);
  const merged = { id: `m${[...cb.from, ...ca.from].sort().join('_')}`, term: { c, p: ca.term.p }, from: [...cb.from, ...ca.from], cancelled: c === 0 };
  const tray = [...rest];
  tray.splice(Math.min(at, tray.length), 0, merged);
  return { ...s, tray: c === 0 ? tray.filter((t) => t !== merged) : tray, lastRefusal: null };
}

/** Plus aucun couple de termes semblables dans la somme. */
export function isSimplified(s) {
  const powers = s.tray.map((c) => c.term.p);
  return new Set(powers).size === powers.length;
}

/** Vérifier pour la valeur de x à l'écran : l'aire du terrain contre la somme portée. */
export function verify(s, x) {
  const p = product(s, x); const sum = traySum(s, x);
  const trial = { x, ok: allCollected(s) && p === sum, product: p, sum, missing: missing(s) };
  return { ...s, trials: [...s.trials.filter((t) => t.x !== x), trial].sort((u, v) => u.x - v.x) };
}

/** Les valeurs de x où l'égalité a été vérifiée juste (somme complète). */
export const verifiedXs = (s) => s.trials.filter((t) => t.ok).map((t) => t.x);

/** La somme est complète (et réduite si demandé) : « تحقّق » a un sens pour chaque x. */
export const sumReady = (s) => allCollected(s) && (!s.simplify || isSimplified(s));

/**
 * « جرّب كل الإمكانيات » : les valeurs de x de la règle dont l'égalité n'a pas encore été vérifiée juste.
 * Seulement quand la somme est construite par l'élève (porter les zones et réunir restent ses gestes).
 */
export function untriedXs(s, range) {
  if (!sumReady(s)) return [];
  const out = [];
  for (let x = range.min; x <= range.max; x += 1) if (!s.trials.some((t) => t.x === x && t.ok)) out.push(x);
  return out;
}

/**
 * LA DÉCOUVERTE : toutes les zones portées, la somme réduite (si demandé),
 * et l'égalité vérifiée pour AU MOINS DEUX valeurs de x — une seule valeur
 * ne dit rien d'une identité (« صحيحة من أجل كل القيم »).
 */
export function discoveryReady(s) {
  return allCollected(s) && (!s.simplify || isSimplified(s)) && verifiedXs(s).length >= 2;
}

/* ── Écritures ─────────────────────────────────────────────────────────── */

export const productTex = (s, letter = 'x') => {
  const [f1, f2] = s.factors;
  if (s.kind === 'square-sum' || s.kind === 'square-diff') return `${factorTex(f1, { letter })}^2`;
  return `${factorTex(f1, { letter })}${factorTex(f2, { letter })}`;
};
export const trayTex = (s, letter = 'x') => termsTex(s.tray.map((c) => c.term), { letter });
export const resultTex = (s, letter = 'x') => termsTex(reduce(s.cells.map((c) => c.term)), { letter });
export const cellTex = (cell, letter = 'x') => termTex(cell.term, { letter, lead: true });

/** La somme portée est-elle le développement réduit ? (garde-fou des tests) */
export const trayIsExpansion = (s) => samePolynomial(s.tray.map((c) => c.term), s.cells.map((c) => c.term));

/** Une valeur entière écrite pour KaTeX et les lecteurs d’écran (le « - » ASCII est rendu « − » par KaTeX). */
export const valueText = (v) => String(v);
