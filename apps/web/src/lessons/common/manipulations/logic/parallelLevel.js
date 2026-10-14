/**
 * parallel-level — la logique PURE du niveau à bulle (unité 9 « خاصية طالس », درس « الخاصية العكسية لخاصية
 * طالس وإثبات التوازي »). Aucun React ici, aucune arithmétique propre : le verdict « parallèle ou non » et ses
 * raisons viennent de `thales.converse` (packages/core/arithmetic/thales.js), les rapports de `thales.ratio`.
 *
 * LE MODÈLE. Deux barres sécantes en A, graduées d'une encoche par unité : la barre (d) porte B à l'abscisse
 * SIGNÉE b (vers le bas, B est au sol), la barre (d′) porte C à c. L'élève pose B′ sur une encoche de (d) et C′
 * sur une encoche de (d′) ; une planche (B′C′) les joint, un niveau à bulle est posé dessus. Le sol est (BC) :
 * « de niveau » ⇔ (B′C′) // (BC).
 *   • mode `ladder` (مبتدئ) : l'échelle double — les montants s'arrêtent en A, encoches 1 … b − 1 et 1 … c − 1 ;
 *   • mode `crossing` (متقدم, نشاط 2) : le tréteau en X — les barres continuent au-delà de A (abscisses
 *     négatives, jusqu'à ⌈2b/3⌉), le rapport `ratio` (1/3) est IMPOSÉ par le professeur.
 *
 * LES ENCOCHES (« slots »). Pour le clavier et le glisser, une barre est une suite CONTIGUË d'entiers s qui
 * MONTE le long de la barre (vers A, puis au-delà) : s < 0 ⇔ abscisse a = −s (entre A et le pied) ; s ≥ 0 ⇔
 * a = −(s + 1) (de l'autre côté de A). A lui-même (a = 0) n'est jamais une encoche.
 *
 *   const s = init({ AB: 6, AC: 9, mode: 'ladder' });
 *   commit(s, 'B', slotOf(2)) puis commit(…, 'C', slotOf(3))  → la planche est de niveau (2/6 = 3/9)
 *   init({ AB: 9, AC: 12, ratio: '1/3', mode: 'crossing' }) : (3 ; −4) respecte le rapport 1/3 mais pas l'ordre —
 *   la figure 3 des élèves, refusée par la bulle (`reason: 'order'`).
 *
 * UN ESSAI est une position VALIDÉE (relâchement, pause du clavier, toucher d'une encoche) — pas une valeur que
 * le doigt a traversée. La découverte demande un CONTRASTE : مبتدئ, deux planches de niveau de rapports
 * différents (1/3 et 2/3 — « les milieux » est ainsi réfuté) et une planche penchée ; متقدم, les trois figures
 * des élèves (1 : de l'autre côté de A, 2 : entre A et les pieds, 3 : une de chaque côté).
 */
import * as TH from '@smarter-academy/core/arithmetic/thales.js';
import * as LIN from '@smarter-academy/core/arithmetic/linear.js';

export const MODES = Object.freeze(['ladder', 'crossing']);
/** Les figures de نشاط 2 : 1 (B′, C′ de l'autre côté de A), 2 (entre A et les pieds), 3 et son miroir. */
export const FIGURES = Object.freeze(['1', '2', '3', '3m']);

const posInt = (v, name) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 3 || n > 30) throw new Error(`parallel-level: ${name} entier entre 3 et 30 (« ${v} »)`);
  return n;
};

/** L'abscisse signée d'une encoche (jamais 0) et l'encoche d'une abscisse. */
export const abscissaOf = (slot) => (slot < 0 ? -slot : -(slot + 1));
export const slotOf = (a) => {
  if (!Number.isInteger(a) || a === 0) throw new Error(`parallel-level: abscisse « ${a} »`);
  return a > 0 ? -a : -a - 1;
};
/** Le nombre d'encoches au-delà de A (mode crossing) : ⌈2n/3⌉ — assez pour le tiers et la figure 1. */
export const upCount = (n, mode) => (mode === 'crossing' ? Math.ceil((2 * n) / 3) : 0);

/** La plage d'encoches d'une barre de longueur n : du pied (exclu) jusqu'au bout au-delà de A. */
export function slotRange(n, mode) {
  return Object.freeze({ min: -(n - 1), max: upCount(n, mode) - 1 });
}

/**
 * L'encoche la plus proche d'une abscisse CONTINUE (lue sous le doigt) : A n'est jamais choisi, un doigt
 * juste au-dessus de A donne −1, juste en dessous 1 ; le résultat est borné à la plage.
 */
export function slotFromAbscissa(t, range) {
  const idx = t >= 0 ? -(Math.max(t, 1)) : -(Math.min(t, -1)) - 1;
  return Math.min(range.max, Math.max(range.min, Math.round(idx)));
}

export function init({ AB, AC, ratio, mode = 'ladder' } = {}) {
  if (!MODES.includes(mode)) throw new Error(`parallel-level: mode « ${mode} »`);
  const b = posInt(AB, 'AB');
  const c = posInt(AC, 'AC');
  const target = mode === 'crossing' && ratio != null ? LIN.parseNumber(ratio) : null;
  if (target && (LIN.cmp(target, LIN.frac(0)) <= 0 || LIN.cmp(target, LIN.frac(1)) >= 0)) throw new Error(`parallel-level: rapport « ${ratio} »`);
  return Object.freeze({
    mode, b, c, target,
    rangeB: slotRange(b, mode), rangeC: slotRange(c, mode),
    // départ : la dernière encoche avant chaque pied (« même distance aux pieds » : la planche penche,
    // (b − 1)/b ≠ (c − 1)/c) ; les deux poignées sont loin l'une de l'autre — ce n'est pas un essai
    sB: slotOf(b - 1), sC: slotOf(c - 1),
    trials: [], last: null,
  });
}

const clampSlot = (s, r) => Math.min(r.max, Math.max(r.min, Math.round(s)));

/** Les abscisses courantes de B′ et C′. */
export const positions = (lab) => ({ bp: abscissaOf(lab.sB), cp: abscissaOf(lab.sC) });

/**
 * L'état mathématique de la planche — tout vient de `thales.converse` : les deux rapports de longueurs,
 * leur égalité, l'ordre (même signe), le parallélisme et la raison qui manque ('ratios' | 'order' | null).
 */
export function reading(lab, at = positions(lab)) {
  const { bp, cp } = at;
  const v = TH.converse({ b: lab.b, bp, c: lab.c, cp });
  const condition = lab.target ? LIN.eq(v.ratioB, lab.target) && LIN.eq(v.ratioC, lab.target) : null;
  return Object.freeze({ bp, cp, ...v, condition, figure: figureOf(bp, cp) });
}

/** La figure de نشاط 2 d'une position (signes des abscisses). */
export function figureOf(bp, cp) {
  if (bp > 0 && cp > 0) return '2';
  if (bp < 0 && cp < 0) return '1';
  return bp > 0 ? '3' : '3m';
}

/** Déplacer une extrémité PENDANT le geste : la planche et la bulle suivent, rien n'est enregistré. */
export function move(lab, end, slot) {
  const key = end === 'B' ? 'sB' : 'sC';
  const s = clampSlot(slot, end === 'B' ? lab.rangeB : lab.rangeC);
  if (lab[key] === s) return lab;
  return Object.freeze({ ...lab, [key]: s, last: { kind: 'move', end } });
}

/** Le type d'un essai validé — ce que l'écran dit, et ce que la découverte compte. */
function kindOf(lab, r) {
  if (lab.mode === 'ladder') return r.parallel ? 'level' : 'tilted';
  if (!r.condition) return 'condition';
  return r.parallel ? 'figure' : 'order';
}

/** Valider une position (relâchement, pause du clavier, toucher) : un ESSAI, enregistré une fois. */
export function commit(lab, end, slot) {
  const moved = slot == null ? lab : move(lab, end, slot);
  const r = reading(moved);
  const kind = kindOf(moved, r);
  const trial = Object.freeze({
    bp: r.bp, cp: r.cp, ratioB: r.ratioB, ratioC: r.ratioC, ratiosEqual: r.ratiosEqual, sameOrder: r.sameOrder,
    parallel: r.parallel, reason: r.reason, condition: r.condition, figure: kind === 'figure' || kind === 'order' ? r.figure : null, kind,
  });
  const prev = moved.trials.at(-1);
  const same = prev && prev.bp === trial.bp && prev.cp === trial.cp;
  return Object.freeze({ ...moved, trials: same ? moved.trials : [...moved.trials, trial], last: { kind: 'commit', trial } });
}

/** Les rapports k (en texte exact) des planches de niveau trouvées (مبتدئ). */
export const levelRatios = (lab) => [...new Set(lab.trials.filter((t) => t.kind === 'level').map((t) => LIN.fracText(t.ratioB)))];
/** Les figures de نشاط 2 produites en respectant le rapport imposé (متقدم). */
export const figuresMade = (lab) => [...new Set(lab.trials.filter((t) => t.figure).map((t) => t.figure))];
/** Le premier essai d'une figure (pour la citer dans la découverte et la règle). */
export const figureTrial = (lab, f) => lab.trials.find((t) => t.figure === f) ?? null;

/**
 * La découverte s'ouvre sur un CONTRASTE vu par l'élève :
 *   ladder   — deux planches de niveau de rapports DIFFÉRENTS et au moins une planche penchée ;
 *   crossing — les figures 1 et 2 (parallèles) ET la figure 3 ou son miroir (mêmes rapports, ordre inversé).
 */
export function discoveryReady(lab) {
  if (lab.mode === 'ladder') return levelRatios(lab).length >= 2 && lab.trials.some((t) => t.kind === 'tilted');
  const f = figuresMade(lab);
  return f.includes('1') && f.includes('2') && (f.includes('3') || f.includes('3m'));
}

/** Ce que la leçon reçoit à chaque essai (`onTrial`) : des nombres, jamais un composant. */
export function evidenceOf(lab) {
  const t = lab.trials.at(-1);
  if (!t) return null;
  return Object.freeze({
    mode: lab.mode, AB: lab.b, AC: lab.c, bp: t.bp, cp: t.cp,
    ratioB: LIN.fracText(t.ratioB), ratioC: LIN.fracText(t.ratioC),
    ratiosEqual: t.ratiosEqual, sameOrder: t.sameOrder, parallel: t.parallel, reason: t.reason,
    condition: t.condition, figure: t.figure, kind: t.kind,
  });
}

/* ── écritures ─────────────────────────────────────────────────────────── */

/** « \dfrac{2}{6} = \dfrac{1}{3} » (la longueur sur le tout, puis réduite si elle se réduit). */
export function ratioTex(part, whole) {
  const p = Math.abs(part);
  const r = TH.ratio(p, whole);
  const raw = `\\dfrac{${p}}{${whole}}`;
  return r.n === p && r.d === whole ? raw : `${raw} = ${LIN.fracLatex(r)}`;
}
/** La ligne des deux rapports d'une position : « \dfrac{AB'}{AB} = … ، \dfrac{AC'}{AC} = … » (deux îlots). */
export function ratiosLine(lab, at = positions(lab)) {
  return [`$\\dfrac{AB'}{AB} = ${ratioTex(at.bp, lab.b)}$`, `$\\dfrac{AC'}{AC} = ${ratioTex(at.cp, lab.c)}$`];
}

/* ── géométrie (flottants : le DESSIN seulement ; le verdict reste celui de converse) ─────────── */

/** La hauteur de A au-dessus du sol (unités du modèle) : une échelle lisible, un X presque carré. */
export const apexHeight = (b, c, mode) => (mode === 'crossing' ? 0.8 : 0.9) * Math.min(b, c);

/**
 * Le dessin : A en haut, B et C au sol (y = 0, y vers le HAUT dans le modèle), puis mis à l'échelle dans
 * `width` × `height` (px, y vers le BAS). Rend les points, les encoches de chaque barre, B′, C′, l'angle de la
 * planche (degrés, sens écran) et le décalage de la bulle dans [−1, 1] — 0 SEULEMENT si converse dit
 * parallèle, sinon au moins `MIN_BUBBLE` (une planche presque de niveau ne trompe pas l'œil).
 */
export const MIN_BUBBLE = 0.35;
export const FULL_TILT_DEG = 14;

/** Les points du modèle (unités, y vers le haut) et leur boîte. */
function model(lab) {
  const { b, c, mode } = lab;
  const h = apexHeight(b, c, mode);
  const A = [0, h];
  const B = [-Math.sqrt(b * b - h * h), 0];
  const C = [Math.sqrt(c * c - h * h), 0];
  const unitB = [(B[0] - A[0]) / b, (B[1] - A[1]) / b];
  const unitC = [(C[0] - A[0]) / c, (C[1] - A[1]) / c];
  const onB = (a) => [A[0] + a * unitB[0], A[1] + a * unitB[1]];
  const onC = (a) => [A[0] + a * unitC[0], A[1] + a * unitC[1]];
  const topB = onB(-upCount(b, mode));
  const topC = onC(-upCount(c, mode));
  const all = [A, B, C, topB, topC];
  const minX = Math.min(...all.map((p) => p[0])); const maxX = Math.max(...all.map((p) => p[0]));
  const maxY = Math.max(...all.map((p) => p[1]));
  return { A, B, C, onB, onC, topB, topC, minX, maxX, maxY };
}

/** La hauteur (px) qu'il faut au dessin pour remplir `width` — le module la borne ensuite par l'écran. */
export function naturalHeight(lab, width, pad = 26) {
  const m = model(lab);
  return Math.round(((width - 2 * pad) / (m.maxX - m.minX)) * m.maxY + 2 * pad);
}

export function geometry(lab, { width, height, pad = 26, at = positions(lab) } = {}) {
  const { b, c } = lab;
  const { A, B, C, onB, onC, topB, topC, minX, maxX, maxY } = model(lab);
  const s = Math.max(1, Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / maxY));
  const offX = (width - (maxX - minX) * s) / 2;
  const offY = (height - maxY * s) / 2;
  const to = (p) => [offX + (p[0] - minX) * s, offY + (maxY - p[1]) * s];
  const notches = (n, on, range) => {
    const out = [];
    for (let sl = range.min; sl <= range.max; sl += 1) { const a = abscissaOf(sl); out.push({ slot: sl, a, xy: to(on(a)) }); }
    return out;
  };
  const Bp = to(onB(at.bp));
  const Cp = to(onC(at.cp));
  const r = reading(lab, at);
  // l'angle de la planche à l'écran, ramené dans ]−90°, 90°] (la planche n'a pas de sens)
  let deg = (Math.atan2(Cp[1] - Bp[1], Cp[0] - Bp[0]) * 180) / Math.PI;
  if (deg > 90) deg -= 180;
  if (deg <= -90) deg += 180;
  // la bulle monte vers l'extrémité HAUTE : à l'écran, deg > 0 ⇔ l'extrémité droite est plus BASSE ⇒ bulle à gauche
  let bubble = 0;
  if (!r.parallel) {
    const raw = Math.max(-1, Math.min(1, -deg / FULL_TILT_DEG));
    bubble = Math.abs(raw) < MIN_BUBBLE ? (raw < 0 || (raw === 0 && deg > 0) ? -MIN_BUBBLE : MIN_BUBBLE) : raw;
  }
  const px = (p) => p.map((v) => Math.round(v * 10) / 10);
  return {
    width, height, scale: s,
    A: px(to(A)), B: px(to(B)), C: px(to(C)), topB: px(to(topB)), topC: px(to(topC)),
    Bp: px(Bp), Cp: px(Cp), deg, bubble, parallel: r.parallel,
    notchesB: notches(b, onB, lab.rangeB), notchesC: notches(c, onC, lab.rangeC),
    /** L'abscisse CONTINUE (unités) d'un point écran projeté sur une barre — le doigt lu sous la barre. */
    abscissaAt(end, x, y) {
      const P0 = to(A); const P1 = to(end === 'B' ? B : C);
      const n = end === 'B' ? b : c;
      const dx = P1[0] - P0[0]; const dy = P1[1] - P0[1];
      return (((x - P0[0]) * dx + (y - P0[1]) * dy) / (dx * dx + dy * dy)) * n;
    },
    /** Le sens écran de la montée (vers A) sur une barre : +1 si monter va vers la droite. */
    upward(end) { const P1 = to(end === 'B' ? B : C); const P0 = to(A); return P0[0] >= P1[0] ? 1 : -1; },
  };
}
