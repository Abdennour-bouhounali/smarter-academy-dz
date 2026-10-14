/**
 * cone-cylinder — LA LOGIQUE PURE du cylindre dans le cône (unité 9 « خاصية طالس », « أدمج تعلّماتي » p. 112).
 * Aucune arithmétique ici : chaque rayon permis, chaque volume vient de packages/core/arithmetic/thales.js
 * (`cylinderInCone` : `radiusFor`, `volumeOverPi`) sur les fractions de linear.js.
 *
 * LA COUPE AXIALE (le cône couché comme dans le manuel : la base à gauche, le sommet O à droite) :
 *   le cône      hauteur H (18), rayon de base R (6) ; sa génératrice va du bord de la base à O
 *   le cylindre  posé sur la base du cône, même axe ; sa longueur h et son rayon r sont TENUS PAR LA MAIN,
 *                chacun par sa poignée (h sur l'axe, r sur la face libre)
 *   la règle     au point d'abscisse h, le cône a le rayon radiusFor(h) = R (H − h) ÷ H (Thalès au sommet O) :
 *                r > radiusFor(h) → le cylindre PERCE le cône : REFUSÉ, la poignée revient ;
 *                r < radiusFor(h) → le bord ne touche pas : un jeu reste, le cylindre n'est pas « محاطة » ;
 *                r = radiusFor(h) → le bord est SUR la génératrice : le cylindre est inscrit.
 *
 * Les graduations : h par pas H ÷ n, r par pas R ÷ n, avec n choisi pour que (a) les deux pas s'écrivent en
 * décimal court et (b) le cylindre h = r tombe sur une graduation — ainsi chaque cylindre inscrit a ses deux
 * dimensions sur la règle (au cran i de h, le bord permis est au cran n − i de r : la génératrice).
 */
import * as LIN from '@smarter-academy/core/arithmetic/linear.js';
import * as TH from '@smarter-academy/core/arithmetic/thales.js';

const { frac, parseNumber, add, sub, mul, div, cmp, eq, isInteger, fracDecimal, toNumber } = LIN;
const F = (v) => (typeof v === 'object' && v !== null ? v : Number.isInteger(v) ? frac(v) : parseNumber(v));

/** Le nombre n de graduations (24 au plus) : pas décimaux courts, et h = r sur la règle. */
export function divisionsFor(H, R) {
  for (let n = 24; n >= 6; n -= 1) {
    const ok = fracDecimal(div(H, n), 2) != null && fracDecimal(div(R, n), 2) != null && isInteger(div(mul(R, n), add(H, R)));
    if (ok) return n;
  }
  throw new Error('coneCylinder: aucune graduation ne met h = r sur la règle');
}

/** L'état initial : un cylindre court et maigre, à l'intérieur, qui ne touche pas (rien n'est donné). */
export function init({ H = 18, R = 6 } = {}) {
  const HH = F(H); const RR = F(R);
  const cone = TH.cylinderInCone({ H: HH, R: RR });
  const n = divisionsFor(HH, RR);
  const hIdx = Math.round(n / 2);
  const rIdx = Math.max(1, Math.round(n / 6));
  return Object.freeze({
    H: HH, R: RR, cone, n, hStep: div(HH, n), rStep: div(RR, n),
    hIdx, rIdx, trials: Object.freeze([]), refusals: 0, last: null,
  });
}

export const hOf = (s, i = s.hIdx) => mul(s.hStep, i);
export const rOf = (s, j = s.rIdx) => mul(s.rStep, j);
/** Le rayon permis à la longueur h : le cône au point d'abscisse h. */
export const rMaxAt = (s, i = s.hIdx) => s.cone.radiusFor(hOf(s, i));
/** Le cran de r où le bord touche la génératrice, pour le cran i de h. */
export const touchIndex = (s, i = s.hIdx) => toNumber(div(rMaxAt(s, i), s.rStep));

/** Ce qu'on VOIT pour un couple de crans (pendant le geste aussi) : perce, touche, ou laisse un jeu. */
export function probe(s, hIdx = s.hIdx, rIdx = s.rIdx) {
  const h = hOf(s, hIdx); const r = rOf(s, rIdx);
  const rMax = rMaxAt(s, hIdx);
  const c = cmp(r, rMax);
  const vop = s.cone.volumeOverPi(r, h);
  return Object.freeze({
    hIdx, rIdx, h, r, rMax,
    pierce: c > 0, inscribed: c === 0, gap: sub(rMax, r),
    square: c === 0 && eq(h, r),
    vop,
  });
}

const clamp = (s, i) => Math.min(s.n - 1, Math.max(1, Math.round(i)));

function record(s, st, kind) {
  const trial = Object.freeze({ h: st.h, r: st.r, inscribed: st.inscribed, square: st.square, vop: st.vop });
  const prev = s.trials.at(-1);
  const same = prev && eq(prev.h, trial.h) && eq(prev.r, trial.r);
  return Object.freeze({
    ...s, hIdx: st.hIdx, rIdx: st.rIdx,
    trials: same ? s.trials : Object.freeze([...s.trials, trial]),
    last: Object.freeze({ kind, state: st }),
  });
}

/** Allonger / raccourcir le cylindre (poignée sur l'axe) : refusé si, à cette longueur, son bord perce le cône. */
export function setH(s, i0) {
  const st = probe(s, clamp(s, i0), s.rIdx);
  if (st.pierce) {
    return Object.freeze({ ...s, refusals: s.refusals + 1, last: Object.freeze({ kind: 'pierceH', state: st }) });
  }
  return record(s, st, 'h');
}

/** Gonfler / dégonfler le cylindre (poignée sur la face) : refusé au-delà de la génératrice. */
export function setR(s, j0) {
  const st = probe(s, s.hIdx, clamp(s, j0));
  if (st.pierce) {
    return Object.freeze({ ...s, refusals: s.refusals + 1, last: Object.freeze({ kind: 'pierceR', state: st }) });
  }
  return record(s, st, 'r');
}

export const status = (s) => probe(s);
export const inscribedTrials = (s) => s.trials.filter((t) => t.inscribed);

/**
 * La découverte : au moins DEUX cylindres inscrits de longueurs différentes (une relation se voit entre deux
 * cas au moins), et un CONTRASTE — un cylindre refusé (il perçait) ou un cylindre qui laissait un jeu.
 */
export function discoveryReady(s) {
  const hs = new Set(inscribedTrials(s).map((t) => LIN.fracText(t.h)));
  return hs.size >= 2 && (s.refusals > 0 || s.trials.some((t) => !t.inscribed));
}

/** Le cylindre cherché par la وضعية : inscrit ET h = r (sa demi-coupe est un carré). */
export const goalFound = (s) => s.trials.some((t) => t.square);

/** π r² h ≈ … (au centième, virgule) — seule approximation, celle que le manuel demande. */
export function volumeApprox(vop, digits = 2) {
  const x = toNumber(vop) * Math.PI;
  return (Math.round(x * 10 ** digits) / 10 ** digits).toFixed(digits).replace('.', ',');
}

/** La relation (pour un cylindre inscrit) : r ÷ R et (H − h) ÷ H, égaux. */
export const ratios = (s, h, r) => ({ left: div(r, s.R), right: div(sub(s.H, h), s.H) });

/** Les écritures : « 4,5 », « 91,125 » ; LaTeX « 4{,}5 », « \dfrac{10}{3} ». */
export const dec = (p) => TH.thalesText(p, 3);
export const tex = (p) => TH.thalesLatex(p, 3);

/** La preuve envoyée à la leçon (`onTrial`) : le cylindre posé, ou le refus. */
export function evidenceOf(s) {
  const l = s.last;
  if (!l) return null;
  const st = l.state;
  return {
    kind: l.kind, h: dec(st.h), r: dec(st.r), inscribed: st.inscribed, pierce: st.pierce, square: st.square,
    vop: dec(st.vop), approx: volumeApprox(st.vop),
  };
}

/**
 * La géométrie de la coupe, en pixels (pure, testée) : base du cône à gauche (abscisse 0), sommet O à droite
 * (abscisse H), axe horizontal au milieu ; l'échelle tient la largeur et la hauteur données.
 */
export function layout(s, { width, height, padX = 28, padY = 22 }) {
  const Hn = toNumber(s.H); const Rn = toNumber(s.R);
  const k = Math.max(3, Math.min((width - 2 * padX) / (Hn + 0.2 * Rn), (height - 2 * padY) / (2 * Rn)));
  const x0 = padX + 0.2 * Rn * k; // la place de l'ellipse de la base
  const yAxis = padY + Rn * k;
  return {
    k, x0, yAxis,
    X: (m) => x0 + toNumber(F(m)) * k,
    Y: (m) => yAxis - toNumber(F(m)) * k,
    width: x0 + Hn * k + padX,
    height: yAxis + Rn * k + padY,
  };
}
