/**
 * fair-share — la logique PURE du partage équitable (1AM, unité 4 « الكتابات الكسرية », درس « حاصل القسمة والكسر »,
 * manuel نشاط 1 p. 53 et معارف 1 p. 55). Aucun React ici. Toute la vérité est EXACTE, par fractions
 * (`@smarter-academy/core/arithmetic/linear.js`, importé par chemin — jamais le barrel du core).
 *
 * L'idée. a pains sont posés sur la table pour b enfants. La main tient la PART x d'un enfant (une longueur de pain) ;
 * le labo met b parts bout à bout contre les a pains et juge le TOTAL b × x :
 *
 *   exact  b × x = a   rien ne reste, rien ne manque ;
 *   short  b × x < a   il reste (a − b × x) de pain sur la table ;
 *   over   b × x > a   il manque (b × x − a) : du pain qui n'existe pas.
 *
 * Deux RÈGLES pour poser x (la main choisit la règle, puis la part) :
 *
 *   d1 · d2 · d3   la règle décimale : x = m / 10, m / 100, m / 1000 (le pas du curseur est un dixième, un centième, un millième) ;
 *   cut            la règle des morceaux : chaque pain est coupé en b morceaux égaux, x = m morceaux = m / b de pain.
 *
 * Le contraste, c'est LA découverte : 3 pains pour 4 enfants tombent juste en décimal (0,75 = 3 morceaux d'un quart), 2 pains
 * pour 3 enfants — ou 5 pour 6, ou 7 pour 3 — ne tombent JAMAIS juste (0,66 → 1,98 ; 0,666 → 1,998 : il manque toujours un
 * peu), alors que la règle des morceaux tombe juste pour tout a et tout b ≠ 0 : m = a. Le nombre qui, multiplié par b, donne a
 * existe toujours ; son écriture est a/b ; il n'est décimal que parfois.
 *
 *     let s = init({ orders: [[3, 4], [2, 3]] });
 *     s = commitM(setRuler(s, 'd2'), 75);   // exact : 4 × 0,75 = 3 — le total vaut les pains
 *     s = next(s);                          // le contraste : 2 pains pour 3 enfants
 *     s = commitM(s, 6);  s = commitM(s, 7);// short / over : aucune graduation décimale ne tombe juste
 *     s = commitM(setRuler(s, 'cut'), 2);   // exact : 3 enfants × 2 morceaux d'un tiers = 6 morceaux = 2 pains
 *
 * Un défaut n'est pas un essai (MANIPULATION_CONTRACT §6bis.2) : le curseur s'ouvre à 0 sans verdict, et rien n'est inscrit
 * dans `trials` avant un relâchement.
 */
import { frac, mul, sub, neg, cmp, fracText, fracDecimal } from '@smarter-academy/core/arithmetic/linear.js';

export const SCENES = Object.freeze(['canteen', 'family']);
export const RULERS = Object.freeze(['d1', 'd2', 'd3', 'cut']);

/** Le nombre de chiffres après la virgule d'une règle décimale (1, 2, 3) ; null pour la règle des morceaux. */
export const digitsOf = (ruler) => (ruler === 'cut' ? null : Number(ruler.slice(1)));

/** Le pas d'une règle : 1/10, 1/100, 1/1000 de pain, ou 1/b de pain (un morceau). */
export const unitOf = (ruler, b) => (ruler === 'cut' ? frac(1, b) : frac(1, 10 ** digitsOf(ruler)));

/** La plus grande part que le curseur peut poser (en pains) : ⌈a / b⌉, plus un pain quand b divise a (la part juste ne doit pas être au bout). */
export const railMax = (a, b) => Math.floor((a + b - 1) / b) + (a % b === 0 ? 1 : 0);

/** Le nombre maximal de pas d'une règle : railMax pains en pas de la règle. */
export const mMaxOf = (a, b, ruler) => railMax(a, b) * (ruler === 'cut' ? b : 10 ** digitsOf(ruler));

/** Le nombre de chiffres décimaux de a/b quand son écriture décimale s'arrête en ≤ 3 chiffres ; null sinon (jamais de décimale exacte). */
export function decimalDigits(a, b) {
  const t = fracDecimal(frac(a, b), 3);
  if (t === null) return null;
  return (t.split(',')[1] ?? '').length;
}

/** Une part x en texte : « 0,75 » (règle décimale) — les morceaux se disent en nombre de morceaux, jamais ici. */
export const decimalText = (x) => fracDecimal(x, 3) ?? fracText(x);

/**
 * Le verdict EXACT d'une part x = m × pas pour a pains et b enfants.
 *   { a, b, ruler, m, x, total: b·x, gap: a − b·x, kind, ok, left: pains restants (short) ou null, missing: pains manquants (over) ou null }
 */
export function judge(a, b, ruler, m) {
  const x = mul(unitOf(ruler, b), frac(m));
  const total = mul(x, frac(b));
  const gap = sub(frac(a), total);
  const c = cmp(total, frac(a));
  const kind = c === 0 ? 'exact' : c < 0 ? 'short' : 'over';
  return Object.freeze({
    a, b, ruler, m, x, total, gap, kind, ok: c === 0,
    left: c < 0 ? gap : null, missing: c > 0 ? neg(gap) : null,
  });
}

/* ── État ─────────────────────────────────────────────────────────────────────────── */

const put = (s, patch) => Object.freeze({ ...s, ...patch });

/**
 * `orders` : la liste des demandes [a, b] (pains, enfants) — la première, puis le contraste (la carte « طلب جديد »).
 */
export function init({ orders }) {
  const [a, b] = orders[0];
  return Object.freeze({
    orders: Object.freeze(orders.map((o) => Object.freeze([...o]))),
    i: 0, a, b,
    ruler: 'd1', m: 0,
    trials: Object.freeze([]),
    last: null,
  });
}
/** « إعادة » : tout recommencer, mémoire des essais comprise. */
export const reset = (s) => init({ orders: s.orders });

const clampM = (s, m, ruler = s.ruler) => Math.max(0, Math.min(mMaxOf(s.a, s.b, ruler), Math.round(m)));

/** Pendant le geste : le curseur suit le doigt (pas un essai). */
export function setM(s, m) {
  const mm = clampM(s, m);
  return mm === s.m ? s : put(s, { m: mm });
}

/** Le relâchement (ou la pause du clavier / des boutons) : un ESSAI jugé. Deux relâchements identiques de suite ne comptent qu'une fois. */
export function commitM(s, m) {
  const mm = clampM(s, m);
  const v = judge(s.a, s.b, s.ruler, mm);
  const prev = s.trials.at(-1);
  const again = prev && prev.i === s.i && prev.ruler === s.ruler && prev.m === mm;
  const trial = Object.freeze({
    i: s.i, a: s.a, b: s.b, ruler: s.ruler, m: mm, kind: v.kind, ok: v.ok,
    x: s.ruler === 'cut' ? `${mm}/${s.b}` : decimalText(v.x), total: fracText(v.total), gap: fracText(v.gap),
  });
  return put(s, {
    m: mm,
    trials: again ? s.trials : Object.freeze([...s.trials, trial]),
    last: Object.freeze({ i: s.i, ruler: s.ruler, m: mm, verdict: v }),
  });
}

/** Le verdict à montrer : celui du dernier relâchement, seulement s'il porte sur la règle et le pas affichés. */
export const shownVerdict = (s) => (s.last && s.last.i === s.i && s.last.ruler === s.ruler && s.last.m === s.m ? s.last.verdict : null);

/* ── Les essais d'une demande ─────────────────────────────────────────────────────── */

const ofOrder = (s, i) => s.trials.filter((t) => t.i === i);
/** Les essais DÉCIMAUX de la demande i (règles d1–d3), un seul par valeur distincte. */
export function decimalTrials(s, i = s.i) {
  const seen = new Set();
  return ofOrder(s, i).filter((t) => t.ruler !== 'cut').filter((t) => { const k = `${t.ruler}:${t.m}`; if (seen.has(k)) return false; seen.add(k); return true; });
}
export const orderSolved = (s, i = s.i) => ofOrder(s, i).some((t) => t.ok);
export const solvedByCut = (s, i = s.i) => ofOrder(s, i).some((t) => t.ok && t.ruler === 'cut');
export const solvedByDecimal = (s, i = s.i) => ofOrder(s, i).some((t) => t.ok && t.ruler !== 'cut');
/** Cette demande a-t-elle une part DÉCIMALE exacte ? (3 ÷ 4 oui ; 2 ÷ 3, 5 ÷ 6, 7 ÷ 3 non.) */
export const decimalLands = (a, b) => decimalDigits(a, b) !== null;

/**
 * La règle des morceaux est un OUTIL qui se mérite : il s'ouvre après deux essais décimaux (l'élève a VU que la part décimale
 * ne tombe pas juste de proche en proche) ou dès que la demande est résolue.
 */
export const canCut = (s) => decimalTrials(s).length >= 2 || orderSolved(s);

/** Changer de règle : la part posée est CONSERVÉE (arrondie au pas le plus proche) ; ce n'est pas un essai. */
export function setRuler(s, ruler) {
  if (!RULERS.includes(ruler) || ruler === s.ruler) return s;
  if (ruler === 'cut' && !canCut(s)) return s;
  const x = mul(unitOf(s.ruler, s.b), frac(s.m));
  const u = unitOf(ruler, s.b);
  const m = clampM(s, (x.n * u.d) / (x.d * u.n), ruler);
  return put(s, { ruler, m, last: null });
}

/* ── Le contraste : la demande suivante ───────────────────────────────────────────── */

export const canNext = (s) => s.i < s.orders.length - 1 && orderSolved(s);
export function next(s) {
  if (!canNext(s)) return s;
  const [a, b] = s.orders[s.i + 1];
  return put(s, { i: s.i + 1, a, b, ruler: 'd1', m: 0, last: null });
}
/** Revenir à une demande précédente (la mémoire des essais est gardée). */
export function back(s, i = s.i - 1) {
  if (i < 0 || i >= s.i) return s;
  const [a, b] = s.orders[i];
  return put(s, { i, a, b, ruler: 'd1', m: 0, last: null });
}

/**
 * La découverte s'ouvre quand TOUTES les demandes sont résolues et que, pour chaque demande dont la part n'est pas décimale,
 * la règle des morceaux l'a résolue (après deux essais décimaux, qui n'ont jamais tombé juste).
 */
export function discoveryReady(s) {
  return s.orders.every(([a, b], i) => orderSolved(s, i) && (decimalLands(a, b) || solvedByCut(s, i)));
}

/* ── Ce que la leçon reçoit ───────────────────────────────────────────────────────── */

/** Un essai pour `onTrial` (la leçon l'écoute via `state.report`). */
export const trialEvidence = (tr) => ({ order: `${tr.a}/${tr.b}`, ruler: tr.ruler, m: tr.m, x: tr.x, kind: tr.kind, ok: tr.ok });
export const finishedEvidence = (s) => ({ orders: s.orders.map(([a, b]) => `${a}/${b}`) });

/* ── Les écritures de la phase formelle (tout sort des essais de l'élève) ──────────── */

/**
 * Pour chaque demande : la fraction a/b, sa valeur décimale quand elle existe (3/4 = 0,75), et sinon les DEUX valeurs
 * décimales encadrantes — celles de l'élève (la plus grande part `short`, la plus petite part `over` de ses essais) sinon
 * celles au centième — avec la vérification b × a/b = a.
 */
export function formalOf(s) {
  return s.orders.map(([a, b], i) => {
    const q = frac(a, b);
    const dec = fracDecimal(q, 3);
    let approx = null;
    if (dec === null) {
      const dt = decimalTrials(s, i);
      const toX = (t) => mul(unitOf(t.ruler, t.b), frac(t.m));
      const shorts = dt.filter((t) => t.kind === 'short').map(toX).sort((p, r) => cmp(r, p));
      const overs = dt.filter((t) => t.kind === 'over').map(toX).sort((p, r) => cmp(p, r));
      // les deux bornes de l'ÉLÈVE seulement s'il en a trouvé une par défaut ET une par excès ; sinon les centièmes du vrai quotient
      const fromTrials = Boolean(shorts[0] && overs[0]);
      const below = fromTrials ? shorts[0] : frac(Math.floor((a * 100) / b), 100);
      const above = fromTrials ? overs[0] : frac(Math.floor((a * 100) / b) + 1, 100);
      approx = { below: decimalText(below), above: decimalText(above), fromTrials };
    }
    return { a, b, i, solved: orderSolved(s, i), fraction: `${a}/${b}`, decimal: dec, approx };
  });
}

/** Les réfutations des fausses conjectures, avec les chiffres de l'élève (demande i) : la part décimale « presque juste » et la fraction renversée. */
export function refutations(s, i = s.i) {
  const [a, b] = s.orders[i];
  const dt = decimalTrials(s, i).filter((t) => !t.ok);
  const x = (t) => mul(unitOf(t.ruler, b), frac(t.m));
  const gapOf = (t) => { const g = sub(frac(a), mul(x(t), frac(b))); return g.n < 0 ? neg(g) : g; };
  // la plus proche du but : celle que l'élève croyait « presque juste »
  const best = dt.length ? dt.reduce((p, t) => (cmp(gapOf(t), gapOf(p)) < 0 ? t : p)) : null;
  const decimal = best
    ? { x: decimalText(x(best)), total: decimalText(mul(x(best), frac(b))), gap: decimalText(gapOf(best)), kind: best.kind }
    : null;
  const inv = frac(b, a);
  const invTotal = mul(inv, frac(b));
  return {
    a, b,
    decimal,
    inverse: { x: fracText(inv), total: fracText(invTotal), kind: cmp(invTotal, frac(a)) > 0 ? 'over' : cmp(invTotal, frac(a)) < 0 ? 'short' : 'exact' },
  };
}

/* ── Onboarding (LabCoach, MANIPULATION_CONTRACT §8quater) ────────────────────────── */

/**
 * La prochaine commande à montrer à l'élève — jamais la réponse (ni une part, ni la règle juste) : seulement le CONTRÔLE.
 *   handle  avant tout essai de la demande, puis tant que la demande n'est pas résolue : le curseur de la part ;
 *   rulers  quand deux essais d'une même règle n'ont pas tombé juste et qu'une autre règle existe : le groupe des règles ;
 *   next    la carte « طلب جديد » une fois la demande résolue ;
 * `null` quand la découverte est gagnée. Un pas n'est montré qu'une fois (LabCoach retient les ids).
 * @returns {{ id: string, target: string, gesture: 'tap' | 'drag' } | null}
 */
export function coachOf(s) {
  if (discoveryReady(s) && !canNext(s)) return null;
  const mine = ofOrder(s, s.i);
  if (mine.length === 0) return { id: 'handle', target: '[data-fs-handle]', gesture: 'drag' };
  if (!orderSolved(s)) {
    const here = [...new Set(mine.filter((t) => t.ruler === s.ruler).map((t) => t.m))];
    const hasOther = RULERS.some((r) => r !== s.ruler && (r !== 'cut' || canCut(s)) && !mine.some((t) => t.ruler === r));
    if (here.length >= 2 && hasOther) return { id: 'rulers', target: '[data-fs-rulers]', gesture: 'tap' };
    return { id: 'again', target: '[data-fs-handle]', gesture: 'drag' };
  }
  if (canNext(s)) return { id: 'next', target: '[data-fs-next-button]', gesture: 'tap' };
  if (!discoveryReady(s)) return { id: 'rulers', target: '[data-fs-rulers]', gesture: 'tap' };
  return null;
}

/* ── Géométrie (px), pure et testée ───────────────────────────────────────────────── */

/**
 * La TABLE : l'axe des pains de 0 à A = b × railMax (toute part possible y tient, b parts bout à bout), `a` pains posés
 * dessus (ils s'arrêtent à `tableEnd`), et les b parts de l'élève sous eux. Échelle u = px par pain.
 *   loaf(i) : le i-ème pain ; share(i, x) : le segment du i-ème enfant pour une part x (en pains, nombre) ;
 *   gapSegment / overSegment : ce qui reste / ce qui manque (x en pains).
 */
export function tableLayout({ width, a, b, pad = 10 }) {
  const rail = railMax(a, b);
  const A = b * rail;
  const x0 = pad;
  const x1 = Math.max(x0 + 60, width - pad);
  const u = (x1 - x0) / A;
  const xAt = (v) => x0 + v * u;
  return {
    A, rail, x0, x1, u, xAt, tableEnd: xAt(a),
    loaf: (i) => ({ x: xAt(i), w: u }),
    share: (i, x) => ({ x0: xAt(i * x), x1: xAt((i + 1) * x) }),
    total: (x) => xAt(b * x),
  };
}

/**
 * La RÈGLE de la part : l'axe des parts de 0 à `rail` pains (échelle px par pain), ses graduations (la règle décimale : tous les
 * pas dont l'espacement vaut ≥ 3,2 px sinon un pas sur 5 ou 10 ; la règle des morceaux : tous les 1/b) et le passage pointeur → pas.
 *   ticks : [{ v: valeur en pains, x, major, label }] ; handleX(m) ; valueAt(px) : nombre de pas (non arrondi) sous le pointeur.
 */
export function rulerLayout({ width, rail, ruler, b, pad = 18 }) {
  const x0 = pad;
  const x1 = Math.max(x0 + 60, width - pad);
  const u = (x1 - x0) / rail;
  const xAt = (v) => x0 + v * u;
  const unit = unitOf(ruler, b);
  const unitPx = (unit.n / unit.d) * u;
  const per = ruler === 'cut' ? b : 10 ** digitsOf(ruler);
  const stepPx = unitPx;
  // un pas sur k : l'espacement visible d'au moins 3,2 px (jamais une graduation écrasée)
  const k = [1, 2, 5, 10, 20, 50, 100].find((c) => c * stepPx >= 3.2) ?? 100;
  const total = rail * per;
  // la règle des morceaux numérote les morceaux (1, 2, 3 …) : un numéro sur n, jamais deux numéros à moins de 18 px
  const every = [1, 2, 5, 10].find((c) => c * stepPx >= 18) ?? 10;
  const ticks = [];
  for (let j = 0; j <= total; j += k) {
    const v = j / per;
    const whole = j % per === 0;
    const half = ruler !== 'cut' && j % (per / 2) === 0;
    let label = null;
    if (ruler === 'cut') label = j > 0 && j % every === 0 ? String(j) : null;
    else if (whole) label = String(j / per);
    ticks.push({ j, v, x: xAt(v), major: ruler === 'cut' ? whole : half, whole, label });
  }
  return { x0, x1, u, unit, unitPx, per, k, xAt, ticks, handleX: (m) => xAt(m / per), valueAt: (px) => ((px - x0) / u) * per };
}

/** Les b enfants : l'abscisse centrale de chacun (répartis sur la largeur) et la place d'un enfant. */
export function kidsLayout({ width, b, pad = 10 }) {
  const slot = (width - 2 * pad) / b;
  return { slot, cx: (i) => pad + (i + 0.5) * slot };
}
