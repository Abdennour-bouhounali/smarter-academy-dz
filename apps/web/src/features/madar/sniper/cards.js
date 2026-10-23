/**
 * « قنّاص القيم » — le paquet de cartes (pur : aucun DOM, aucune horloge).
 *
 * Une manche = UNE cible (une valeur) et huit cartes : des écritures ÉGALES à
 * la cible, et des PIÈGES — les erreurs que fait vraiment un élève de 11–13 ans
 * (priorité des opérations, exposants multipliés, numérateurs additionnés, √
 * d'une somme, distributivité oubliée, (a + b)² = a² + b²…). Voir une écriture
 * et reconnaître sa valeur : c'est l'observation que le jeu entraîne.
 *
 * La vérité vient de la VALEUR exacte de chaque carte (rationnel, a√r,
 * polynôme), jamais de l'intention du modèle : une carte n'est « égale » que si
 * sa clé est celle de la cible, et un piège qui tomberait juste par hasard est
 * jeté. `cards.test.js` relit chaque écriture avec un évaluateur indépendant.
 *
 * Écriture (tokens) : une liste de
 *   'texte'            chiffres, x, opérateurs, parenthèses (× ÷ − +)
 *   { frac: [n, d] }   une fraction (n, d : texte)
 *   { sqrt: 'r' }      une racine carrée
 *   { sup: 'k' }       un exposant (porté par ce qui précède)
 */
import { createRng } from '../engine/rng';

// ── Valeurs exactes ─────────────────────────────────────────────────────────

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
};

/** Un rationnel n/d réduit. */
export function rat(n, d = 1) {
  const s = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { kind: 'q', n: (s * n) / g, d: (s * d) / g };
}

/** c·√N simplifié en a·√r (r sans facteur carré) ; r = 1 → un entier. */
export function surd(c, N) {
  let out = c;
  let r = N;
  for (let k = 2; k * k <= r; k += 1) {
    while (r % (k * k) === 0) {
      r /= k * k;
      out *= k;
    }
  }
  return r === 1 ? rat(out) : { kind: 's', c: out, r };
}

/** Un polynôme c0 + c1·x + c2·x². */
export const poly = (c0, c1 = 0, c2 = 0) => ({ kind: 'p', c: [c0, c1, c2] });

export function keyOf(v) {
  if (v.kind === 'q') return `q:${v.n}/${v.d}`;
  if (v.kind === 's') return `s:${v.c}:${v.r}`;
  return `p:${v.c.join(',')}`;
}

// ── Écritures ───────────────────────────────────────────────────────────────

const minus = (n) => (n < 0 ? `−${-n}` : String(n));
/** Le coefficient devant x : 1 → rien. */
const cx = (k) => (k === 1 ? 'x' : `${k}x`);

/** L'écriture décimale d'un rationnel (virgule), si elle est finie et courte. */
export function decimalOf(v) {
  if (v.kind !== 'q') return null;
  for (let k = 0; k <= 4; k += 1) {
    const scaled = v.n * 10 ** k;
    if (scaled % v.d === 0) {
      const s = (v.n / v.d).toFixed(k);
      return s.replace('.', ',').replace('-', '−');
    }
  }
  return null;
}

function polyTokens([c0, c1, c2]) {
  const out = [];
  const term = (coef, pow) => {
    if (coef === 0) return;
    const first = out.length === 0;
    const sign = coef < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ');
    const a = Math.abs(coef);
    out.push(sign + (pow === 0 ? String(a) : a === 1 ? 'x' : `${a}x`));
    if (pow === 2) out.push({ sup: '2' });
  };
  term(c2, 2);
  term(c1, 1);
  term(c0, 0);
  return out.length ? out : ['0'];
}

/** L'écriture la plus simple d'une valeur : ce qu'une carte « vaut vraiment ». */
export function valueTokens(v) {
  if (v.kind === 'q') return v.d === 1 ? [minus(v.n)] : [{ frac: [minus(v.n), String(v.d)] }];
  if (v.kind === 's') return v.c === 1 ? [{ sqrt: String(v.r) }] : [minus(v.c), { sqrt: String(v.r) }];
  return polyTokens(v.c);
}

/** Une écriture en texte plat (clé de déduplication, lecteurs d'écran). */
export function plain(tokens) {
  return tokens.map((t) => {
    if (typeof t === 'string') return t;
    if (t.frac) return `${t.frac[0]}/${t.frac[1]}`;
    if (t.sqrt) return `√${t.sqrt}`;
    return `^${t.sup}`;
  }).join('');
}

const card = (tokens, value) => ({ tokens, value });
const fr = (v) => (v.d === 1 ? minus(v.n) : { frac: [minus(v.n), String(v.d)] });

// ── Les six niveaux ─────────────────────────────────────────────────────────
//
// Chaque niveau : `target(rng)` → { value, tokens } ; `equal(rng, t)` et
// `traps(rng, t)` → des fabriques (chacune peut répondre null si elle ne
// s'applique pas à cette cible).

const divisorsOf = (n, min = 2) => {
  const out = [];
  for (let d = min; d <= n / min; d += 1) if (n % d === 0) out.push(d);
  return out;
};

const ops = {
  id: 'ops',
  target(rng) {
    const n = rng.int(12, 40);
    return { value: rat(n), tokens: [String(n)], n };
  },
  equal: [
    (rng, { n }) => { const a = rng.int(2, n - 2); return card([`${a} + ${n - a}`], rat(n)); },
    (rng, { n }) => { const ds = divisorsOf(n); if (!ds.length) return null; const d = rng.pick(ds); return card([`${d} × ${n / d}`], rat(n)); },
    (rng, { n }) => {
      const b = rng.int(2, 5); const c = rng.int(2, Math.max(2, Math.floor((n - 1) / b))); const a = n - b * c;
      return a >= 1 ? card([`${a} + ${b} × ${c}`], rat(a + b * c)) : null;
    },
    (rng, { n }) => {
      const ds = divisorsOf(n).filter((c) => n / c >= 2 && c <= 9); if (!ds.length) return null;
      const c = rng.pick(ds); const s = n / c; const a = rng.int(1, s - 1);
      return card([`(${a} + ${s - a}) × ${c}`], rat((a + (s - a)) * c));
    },
    (rng, { n }) => {
      const a = rng.int(2, 6); const b = Math.ceil((n + 1) / a) + rng.int(0, 2); const c = a * b - n;
      return c >= 1 && c <= 30 ? card([`${a} × ${b} − ${c}`], rat(a * b - c)) : null;
    },
    (rng, { n }) => { const b = rng.int(2, 5); return card([`${n * b} ÷ ${b}`], rat(n)); },
  ],
  traps: [
    // a + b × c lu de gauche à droite : (a + b) × c = n, mais a + b × c ≠ n.
    (rng, { n }) => {
      const ds = divisorsOf(n).filter((c) => n / c >= 2 && c <= 9); if (!ds.length) return null;
      const c = rng.pick(ds); const s = n / c; const a = rng.int(1, s - 1); const b = s - a;
      return card([`${a} + ${b} × ${c}`], rat(a + b * c));
    },
    // Les parenthèses ignorées : a + b × c = n, mais (a + b) × c ≠ n.
    (rng, { n }) => {
      const b = rng.int(2, 5); const c = rng.int(2, Math.max(2, Math.floor((n - 1) / b))); const a = n - b * c;
      return a >= 1 ? card([`(${a} + ${b}) × ${c}`], rat((a + b) * c)) : null;
    },
    // a × b − c lu a × (b − c).
    (rng, { n }) => {
      const ds = divisorsOf(n); if (!ds.length) return null;
      const a = rng.pick(ds); const c = rng.int(1, 4); const b = n / a + c;
      return card([`${a} × ${b} − ${c}`], rat(a * b - c));
    },
    // Tout près : n ± 1.
    (rng, { n }) => { const m = n + rng.pick([-1, 1]); const a = rng.int(2, m - 2); return card([`${a} + ${m - a}`], rat(m)); },
    (rng, { n }) => { const m = n + rng.pick([-2, 2]); const ds = divisorsOf(m); if (!ds.length) return null; const d = rng.pick(ds); return card([`${d} × ${m / d}`], rat(m)); },
  ],
};

const POWER_BASES = [
  { b: 2, ks: [3, 4, 5, 6, 7, 8] },
  { b: 3, ks: [2, 3, 4] },
  { b: 5, ks: [2, 3] },
  { b: 10, ks: [-3, -2, -1, 2, 3, 4] },
];
const powValue = (b, k) => (k >= 0 ? rat(b ** k) : rat(1, b ** -k));
const pw = (b, k) => [String(b), { sup: minus(k) }];

const powers = {
  id: 'powers',
  target(rng) {
    const { b, ks } = rng.pick(POWER_BASES);
    const k = rng.pick(ks);
    const value = powValue(b, k);
    return { value, tokens: [decimalOf(value) ?? fr(value)], b, k };
  },
  equal: [
    (rng, { b, k }) => card(pw(b, k), powValue(b, k)),
    (rng, { b, k }) => {
      const m = k > 1 ? rng.int(1, k - 1) : rng.int(1, 3); const n = k - m;
      return n === 0 ? null : card([...pw(b, m), ' × ', ...pw(b, n)], powValue(b, m + n));
    },
    (rng, { b, k }) => { const n = rng.int(1, 3); return card([...pw(b, k + n), ' ÷ ', ...pw(b, n)], powValue(b, k)); },
    (rng, { b, k }) => {
      const ds = divisorsOf(Math.abs(k)); if (!ds.length) return null;
      const m = rng.pick(ds); const n = k / m;
      return card(['(', ...pw(b, m), ')', { sup: minus(n) }], powValue(b, m * n));
    },
    (rng, { b, k }) => {
      // Une autre base : 2⁶ = 4³ = 8², 3⁴ = 9², 10⁻² = 100⁻¹ (base y = bᵖ, exposant k/p).
      const alts = [[2, 4, 2], [2, 8, 3], [3, 9, 2], [10, 100, 2]].filter(([x, , p]) => x === b && k % p === 0);
      if (!alts.length) return null;
      const [, y, p] = rng.pick(alts);
      return card(pw(y, k / p), powValue(y, k / p));
    },
    (rng, { b, k }) => (k >= 2 && k <= 4 ? card([Array(k).fill(String(b)).join(' × ')], powValue(b, k)) : null),
    (rng, { b, k }) => (k < 0 ? card([{ frac: ['1', String(b ** -k)] }], powValue(b, k)) : null),
  ],
  traps: [
    // Les exposants multipliés : bᵐ × bⁿ « = » b^(m·n).
    (rng, { b, k }) => {
      const ds = divisorsOf(Math.abs(k)); if (!ds.length || k < 0) return null;
      const m = rng.pick(ds); const n = k / m;
      return card([...pw(b, m), ' × ', ...pw(b, n)], powValue(b, m + n));
    },
    // L'exposant et la base échangés : kᵇ au lieu de bᵏ.
    (rng, { b, k }) => (k > 1 && k !== b ? card(pw(k, b), powValue(k, b)) : null),
    // b × k au lieu de bᵏ.
    (rng, { b, k }) => (k > 1 ? card([`${b} × ${k}`], rat(b * k)) : null),
    // Le signe de l'exposant oublié.
    (rng, { b, k }) => (k < 0 ? card(pw(b, -k), powValue(b, -k)) : null),
    // Tout près : b^(k ± 1).
    (rng, { b, k }) => { const e = k + rng.pick([-1, 1]); return e === 0 ? null : card(pw(b, e), powValue(b, e)); },
  ],
};

const FRACTION_DENOMINATORS = [2, 3, 4, 5, 6, 8, 10];
const finiteDecimal = (d) => { let x = d; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; };

const fractions = {
  id: 'fractions',
  target(rng) {
    const q = rng.pick(FRACTION_DENOMINATORS);
    let p = rng.int(1, 2 * q - 1);
    while (p === q || gcd(p, q) !== 1) p = rng.int(1, 2 * q - 1);
    return { value: rat(p, q), tokens: [{ frac: [String(p), String(q)] }], p, q };
  },
  equal: [
    (rng, { p, q }) => { const k = rng.int(2, 5); return card([{ frac: [String(k * p), String(k * q)] }], rat(k * p, k * q)); },
    (rng, { p, q }) => (finiteDecimal(q) ? card([decimalOf(rat(p, q))], rat(p, q)) : null),
    (rng, { p, q }) => card([`${p} ÷ ${q}`], rat(p, q)),
    (rng, { p, q }) => ((100 * p) % q === 0 ? card([`${(100 * p) / q} %`], rat(p, q)) : null),
    (rng, { p, q }) => {
      const n1 = rng.int(1, 2 * p - 1); const a = rat(n1, 2 * q); const b = rat(2 * p - n1, 2 * q);
      return card([fr(a), ' + ', fr(b)], rat(a.n * b.d + b.n * a.d, a.d * b.d));
    },
    (rng, { p, q }) => (p < q ? card(['1 − ', { frac: [String(q - p), String(q)] }], rat(q - (q - p), q)) : null),
    (rng, { p, q }) => { const h = rat(p, 2 * q); return card(['2 × ', fr(h)], rat(2 * h.n, h.d)); },
  ],
  traps: [
    // La fraction renversée.
    (rng, { p, q }) => card([{ frac: [String(q), String(p)] }], rat(q, p)),
    // Numérateurs et dénominateurs additionnés : a/b + c/d « = » (a + c)/(b + d).
    (rng, { p, q }) => {
      const k = rng.int(2, 3); const a = rng.int(1, k * p - 1); const b = rng.int(2, k * q - 2);
      const c = k * p - a; const d = k * q - b;
      return d >= 2 ? card([{ frac: [String(a), String(b)] }, ' + ', { frac: [String(c), String(d)] }], rat(a * d + c * b, b * d)) : null;
    },
    // Le même nombre ajouté en haut et en bas.
    (rng, { p, q }) => { const k = rng.int(1, 3); return card([{ frac: [String(p + k), String(q + k)] }], rat(p + k, q + k)); },
    // « 3/4 = 0,34 ».
    (rng, { p, q }) => (p < 10 && q < 10 ? card([`0,${p}${q}`], rat(10 * p + q, 100)) : null),
    // Tout près : (p ± 1)/q.
    (rng, { p, q }) => { const m = p + rng.pick([-1, 1]); return m > 0 ? card([{ frac: [String(m), String(q)] }], rat(m, q)) : null; },
  ],
};

const RADICANDS = [2, 3, 5, 6, 7];

const roots = {
  id: 'roots',
  target(rng) {
    const r = rng.pick(RADICANDS);
    const a = rng.int(2, r <= 3 ? 6 : 4);
    return { value: surd(a, r), tokens: [String(a), { sqrt: String(r) }], a, r };
  },
  equal: [
    (rng, { a, r }) => card([{ sqrt: String(a * a * r) }], surd(1, a * a * r)),
    (rng, { a, r }) => {
      const ds = divisorsOf(a * a, 1).filter((d) => d < a * a);
      const d = rng.pick(ds.length ? ds : [1]);
      return card([{ sqrt: String(r * d) }, ' × ', { sqrt: String((a * a) / d) }], surd(1, r * a * a));
    },
    (rng, { a, r }) => {
      const b = rng.int(1, a - 1); const c = a - b;
      const part = (k) => (k === 1 ? [{ sqrt: String(r) }] : [String(k), { sqrt: String(r) }]);
      return card([...part(b), ' + ', ...part(c)], surd(a, r));
    },
    (rng, { a, r }) => {
      if (a < 2) return null;
      const b = rng.int(1, a - 1); const c = a - b;
      return card([{ sqrt: String(b * b * r) }, ' + ', { sqrt: String(c * c * r) }], surd(b + c, r));
    },
    (rng, { a, r }) => card([`${a} × `, { sqrt: String(r) }], surd(a, r)),
  ],
  traps: [
    // Le carré oublié : √(a·r) pour a√r.
    (rng, { a, r }) => card([{ sqrt: String(a * r) }], surd(1, a * r)),
    // Échangés : r√a.
    (rng, { a, r }) => (r !== a ? card([String(r), { sqrt: String(a) }], surd(r, a)) : null),
    // « √x + √y = √(x + y) » : √(b²r + c²r) n'est pas √(b²r) + √(c²r)…
    (rng, { a, r }) => {
      const b = rng.int(1, a - 1); const c = a - b;
      const x = b * b * r; const y = c * c * r;
      return card([{ sqrt: `${x} + ${y}` }], surd(1, x + y));
    },
    // Tout près : (a ± 1)√r et a√(r + 1).
    (rng, { a, r }) => card([String(a + 1), { sqrt: String(r) }], surd(a + 1, r)),
    (rng, { a, r }) => { const N = a * a * r + rng.pick([-2, -1, 1, 2]); return card([{ sqrt: String(N) }], surd(1, N)); },
  ],
};

const literal = {
  id: 'literal',
  target(rng) {
    const a = rng.int(2, 6);
    const b = a * rng.int(1, 4) + (rng.chance(0.4) ? rng.int(1, a - 1) : 0);
    return { value: poly(b, a), tokens: polyTokens([b, a, 0]), a, b };
  },
  equal: [
    (rng, { a, b }) => (b % a === 0 ? card([`${a}(x + ${b / a})`], poly(b, a)) : null),
    (rng, { a, b }) => card([`${cx(a - 1)} + x + ${b}`], poly(b, a)),
    (rng, { a, b }) => { const k = rng.int(1, 3); return card([`${cx(a + k)} + ${b} − ${cx(k)}`], poly(b, a)); },
    (rng, { a, b }) => card([`(${cx(2 * a)} + ${2 * b}) ÷ 2`], poly(b, a)),
    (rng, { a, b }) => {
      const m = rng.int(1, a - 1); const n = rng.int(1, Math.max(1, Math.floor((b - 1) / m)));
      const rest = b - m * n;
      return rest >= 1 ? card([`${m === 1 ? '' : m}(x + ${n}) + ${cx(a - m)} + ${rest}`], poly(m * n + rest, m + (a - m))) : null;
    },
  ],
  traps: [
    // La distributivité oubliée : a(x + b) pour ax + b.
    (rng, { a, b }) => card([`${a}(x + ${b})`], poly(a * b, a)),
    // Les termes non semblables « additionnés » : (a + b)x.
    (rng, { a, b }) => card([cx(a + b)], poly(0, a + b)),
    // Échangés : bx + a.
    (rng, { a, b }) => (a !== b ? card([`${cx(b)} + ${a}`], poly(a, b)) : null),
    // Le signe : (a + k)x + b + kx.
    (rng, { a, b }) => { const k = rng.int(1, 3); return card([`${cx(a + k)} + ${b} + ${cx(k)}`], poly(b, a + 2 * k)); },
    // Le terme constant doublé : ax + 2b.
    (rng, { a, b }) => card([`${cx(a)} + ${2 * b}`], poly(2 * b, a)),
  ],
};

const identities = {
  id: 'identities',
  target(rng) {
    const k = rng.int(1, 6);
    const type = rng.pick(['plus', 'minus', 'diff']);
    const value = type === 'plus' ? poly(k * k, 2 * k, 1) : type === 'minus' ? poly(k * k, -2 * k, 1) : poly(-k * k, 0, 1);
    return { value, tokens: polyTokens(value.c), k, type };
  },
  equal: [
    (rng, { k, type }) => (type === 'diff' ? card([`(x − ${k})(x + ${k})`], poly(-k * k, 0, 1))
      : card([`(x ${type === 'plus' ? '+' : '−'} ${k})`, { sup: '2' }], type === 'plus' ? poly(k * k, 2 * k, 1) : poly(k * k, -2 * k, 1))),
    (rng, { k, type }) => (type === 'diff' ? card([`(x + ${k})(x − ${k})`], poly(-k * k, 0, 1))
      : card([`(x ${type === 'plus' ? '+' : '−'} ${k})(x ${type === 'plus' ? '+' : '−'} ${k})`], type === 'plus' ? poly(k * k, 2 * k, 1) : poly(k * k, -2 * k, 1))),
    (rng, { k, type }) => (type === 'minus' ? card([`(${k} − x)`, { sup: '2' }], poly(k * k, -2 * k, 1))
      : type === 'plus' ? card([`(${k} + x)`, { sup: '2' }], poly(k * k, 2 * k, 1)) : null),
    (rng, { k, type }) => {
      if (type === 'diff') return card(['x', { sup: '2' }, ` + ${cx(k)} − ${cx(k)} − ${k * k}`], poly(-k * k, 0, 1));
      const s = type === 'plus' ? '+' : '−';
      return card(['x', { sup: '2' }, ` ${s} ${cx(k)} ${s} ${cx(k)} + ${k * k}`], poly(k * k, type === 'plus' ? 2 * k : -2 * k, 1));
    },
  ],
  traps: [
    // (x + k)² « = » x² + k².
    (rng, { k, type }) => card(['x', { sup: '2' }, ` ${type === 'diff' ? '−' : '+'} ${k * k}`], poly(type === 'diff' ? -k * k : k * k, 0, 1)),
    // Le double produit oublié à moitié : x² + kx + k².
    (rng, { k, type }) => card(['x', { sup: '2' }, ` ${type === 'minus' ? '−' : '+'} ${cx(k)} + ${k * k}`], poly(k * k, type === 'minus' ? -k : k, 1)),
    // Le signe : (x − k)² pour (x + k)², et inversement ; (x − k)² pour x² − k².
    (rng, { k, type }) => card([`(x ${type === 'plus' ? '−' : '+'} ${k})`, { sup: '2' }], type === 'plus' ? poly(k * k, -2 * k, 1) : poly(k * k, 2 * k, 1)),
    // Le carré pris pour un double : (x ± k)² « = » 2x ± 2k ; et (x − k)² pour x² − k².
    (rng, { k, type }) => (type === 'diff' ? card([`(x − ${k})`, { sup: '2' }], poly(k * k, -2 * k, 1))
      : card([`2x ${type === 'plus' ? '+' : '−'} ${2 * k}`], poly(type === 'plus' ? 2 * k : -2 * k, 2))),
    // k² et 2k confondus : x² ± 2kx ± 2k.
    (rng, { k, type }) => (type === 'diff' ? card(['x', { sup: '2' }, ` − ${2 * k}`], poly(-2 * k, 0, 1))
      : card(['x', { sup: '2' }, ` ${type === 'plus' ? '+' : '−'} ${cx(2 * k)} + ${2 * k}`], poly(2 * k, type === 'plus' ? 2 * k : -2 * k, 1))),
  ],
};

/** Les six niveaux, dans l'ordre où le jeu les ouvre. */
export const LEVELS = [ops, powers, fractions, roots, literal, identities];
export const LEVEL_IDS = LEVELS.map((l) => l.id);

/** Le niveau mathématique d'une manche : les premières suivent l'ordre, ensuite un mélange. */
export function levelForRound(k, rng, roundsPerLevel, maxLevel) {
  if (k < roundsPerLevel * maxLevel) return Math.floor(k / roundsPerLevel);
  return rng.int(2, maxLevel - 1);
}

// ── Une manche ──────────────────────────────────────────────────────────────

function shuffle(rng, list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function draw(rng, makers, target, wantKeyEqual, n, seen) {
  const out = [];
  const tKey = keyOf(target.value);
  for (let attempt = 0; attempt < 40 && out.length < n; attempt += 1) {
    const make = makers[rng.int(0, makers.length - 1)];
    const c = make(rng, target);
    if (!c) continue;
    const isEqual = keyOf(c.value) === tKey;
    const text = plain(c.tokens);
    if (isEqual !== wantKeyEqual || seen.has(text)) continue;
    seen.add(text);
    // « 12 + 7 » et « 7 + 12 » dans la même manche : un doublon, pas une observation.
    const sum = /^(\S+) ([+×]) (\S+)$/.exec(text);
    if (sum) seen.add(`${sum[3]} ${sum[2]} ${sum[1]}`);
    out.push({ ...c, equal: isEqual, text });
  }
  return out;
}

/**
 * La manche k d'une graine : la cible et ses huit cartes (dans l'ordre de
 * chute), dont `equalCount` égales. Toujours la même pour la même graine.
 */
export function makeRound(seed, k, { cardsPerRound = 8, roundsPerLevel = 3, maxLevel = 6 } = {}) {
  const rng = createRng((seed ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0);
  const levelIndex = levelForRound(k, rng, roundsPerLevel, maxLevel);
  const level = LEVELS[levelIndex];
  const target = level.target(rng);
  const seen = new Set([plain(target.tokens)]);
  const wantEqual = rng.int(3, 4);
  const equal = draw(rng, level.equal, target, true, wantEqual, seen);
  let traps = draw(rng, level.traps, target, false, cardsPerRound - equal.length, seen);
  // Pas assez de pièges propres à ce niveau : des valeurs voisines, toujours fausses.
  for (let d = 1; traps.length + equal.length < cardsPerRound && d < 20; d += 1) {
    const v = target.value;
    const near = v.kind === 'q' ? rat(v.n + d * v.d, v.d) : v.kind === 's' ? surd(v.c + d, v.r) : poly(v.c[0] + d, v.c[1], v.c[2]);
    const tokens = valueTokens(near);
    const text = plain(tokens);
    if (!seen.has(text)) {
      seen.add(text);
      traps = [...traps, { tokens, value: near, equal: false, text }];
    }
  }
  const cards = shuffle(rng, [...equal, ...traps]).slice(0, cardsPerRound);
  return {
    k,
    level: levelIndex + 1,
    levelId: level.id,
    target: { tokens: target.tokens, value: target.value, key: keyOf(target.value) },
    cards: cards.map((c, j) => ({ id: `${k}:${j}`, tokens: c.tokens, value: c.value, equal: c.equal, text: c.text })),
  };
}
