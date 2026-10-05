/**
 * La logique PURE du lab « polygon-forge » (unité 13, درس « المضلعات المنتظمة وتطبيقاتها ») — aucune React, aucune
 * géométrie de dessin : ce qui est accepté, refusé, enregistré comme essai, et quand la découverte s'ouvre.
 *
 * Toute VÉRITÉ mathématique vient de packages/core/arithmetic/rotation.js (`rotation`) :
 *   • la figure se REFERME en polygone régulier à n côtés ⇔ `sidesFromCentral(α) === n` (360°/α entier ≥ 3) ;
 *   • la k-ième image retombe sur A ⇔ `normalize(k·α) === 0` (après un tour : polygone ; après deux : étoile) ;
 *   • les lectures : `centralAngle(n)`, `interiorAngle(n)`, `sideFromRadius(n, r)` (exact pour n = 3, 4, 6) ;
 *   • l'étoile du drapeau : `radiusForChord(n, d)`, `chord(n, R, j)`, `star(n, R, j)` (pointes, branches, 36°).
 * Les angles sont des DEGRÉS ENTIERS (le cadran avance de 1°) ; le rayon de l'étape « نصف القطر » est en CENTIÈMES de cm.
 *
 *   init({ n: 6, r: 3 })                      → la cellule de ruche (مبتدئ) : trouver α qui ferme un hexagone
 *   init({ n: 5, tip: 10, star: 2 })          → l'étoile du drapeau (متقدم, le تحدّ) : α, puis R, puis les branches
 *   turn(lab)                                 → « دوّر » : la prochaine image ; l'issue du tour (closed | other | flat | open | star | spiral)
 *   commitRadius(lab, 851)                    → la distance entre deux pointes consécutives, jugée à 0,01 près
 *   tapTip(lab, j)                            → une branche de l'étoile (un sommet sur deux), ou le refus d'un côté
 */
import { rotation as Rot, trigonometry as T } from '@smarter-academy/core';

/** Le cadran : α de 20° à 180° (180° : deux images seulement — un segment, pas un polygone). */
export const ALPHA = Object.freeze({ min: 20, max: 180 });
/** Le compas de l'étape « نصف القطر » : R de 5,00 cm à 12,00 cm, en centièmes. */
export const RADIUS = Object.freeze({ min: 500, max: 1200 });
/** Le premier sommet A est en haut du cercle (90°), les images tournent dans le sens direct. */
export const START_DEG = 90;
/** Au-delà de deux tours sans retomber sur A, le tour s'arrête (« ne se ferme jamais »). */
export const MAX_TURNS = 2;

const ENDED = new Set(['closed', 'other', 'flat', 'star', 'spiral']);

export function init(numbers = {}) {
  const tip = numbers.tip != null ? Number(numbers.tip) : null;
  const mode = tip ? 'star' : 'cell';
  return {
    mode,
    target: Number(numbers.n ?? (mode === 'star' ? 5 : 6)),
    r: numbers.r != null ? Number(numbers.r) : null,
    tip,
    starStep: Number(numbers.star ?? 2),
    // départ : ni 60° ni 72° — مبتدئ commence sur 50° (la résistance), متقدم sur 60° (une ruche, pas une étoile)
    alpha: clampAlpha(numbers.alpha ?? (mode === 'star' ? 60 : 50)),
    images: 0,
    run: null,
    trials: [],
    stage: 'forge',
    found: null,
    radius: 600,
    radiusTrials: [],
    radiusOk: false,
    pen: 0,
    strokes: [],
    last: null,
  };
}

export const clampAlpha = (a) => Math.min(ALPHA.max, Math.max(ALPHA.min, Math.round(Number(a))));
export const clampRadius = (h) => Math.min(RADIUS.max, Math.max(RADIUS.min, Math.round(Number(h))));

/**
 * Le cadran ne tourne pas PENDANT un tour : la MÊME rotation s'applique à chaque image. Un tour terminé (fermé,
 * abandonné) se libère tout seul : tourner le cadran commence un nouveau tour (les essais restent).
 */
export const canSetAlpha = (lab) => (lab.stage !== 'forge' ? 'stage' : lab.images > 0 && !ENDED.has(lab.run) ? 'locked' : true);
export function setAlpha(lab, a) {
  if (canSetAlpha(lab) !== true) return lab;
  const alpha = clampAlpha(a);
  if (alpha === lab.alpha && lab.images === 0) return lab;
  return { ...lab, alpha, images: 0, run: null, last: { kind: 'alpha', alpha } };
}
/** « زاوية أخرى » : efface le tour en cours (les essais restent). */
export const release = (lab) => ({ ...lab, images: 0, run: null, last: { kind: 'release', alpha: lab.alpha } });

/** Peut-on encore appliquer la rotation ? Un tour fermé (ou abandonné après deux tours) est terminé. */
export const canTurn = (lab) => (lab.stage !== 'forge' ? 'stage' : ENDED.has(lab.run) ? 'ended' : true);

/** L'issue de la k-ième image pour l'angle α (rotation.js décide). */
export function outcomeAt(alpha, k, target) {
  const total = k * alpha;
  const n = Rot.sidesFromCentral(alpha);
  if (n != null && k === n) return n === target ? 'closed' : 'other';
  if (total === 360) return 'flat';
  if (total > 360 && (k - 1) * alpha < 360) return 'open';
  if (total === 360 * MAX_TURNS && Rot.normalize(total) === 0) return 'star';
  if (total > 360 * MAX_TURNS) return 'spiral';
  return null;
}

/** « دوّر » : place l'image suivante du dernier sommet par la rotation (O, α, sens direct). */
export function turn(lab) {
  if (canTurn(lab) !== true) return lab;
  const k = lab.images + 1;
  const outcome = outcomeAt(lab.alpha, k, lab.target);
  const next = { ...lab, images: k, last: { kind: 'turn', k, total: k * lab.alpha, alpha: lab.alpha } };
  if (!outcome) return next;
  const n = outcome === 'closed' || outcome === 'other' ? k : outcome === 'flat' ? 2 : null;
  let trials = lab.trials;
  if (outcome === 'star' || outcome === 'spiral') {
    // le tour avait déjà été enregistré « ouvert » au premier dépassement : on précise son issue
    trials = trials.map((t, i) => (i === trials.length - 1 && t.alpha === lab.alpha && t.outcome === 'open' ? { ...t, outcome, k } : t));
  } else {
    trials = [...trials, { alpha: lab.alpha, outcome, k, n, i: trials.length }];
  }
  const found = outcome === 'closed' && lab.mode === 'star' ? lab.alpha : lab.found;
  return { ...next, run: outcome, trials, found, last: { ...next.last, kind: outcome, n } };
}

/** Les angles (degrés, depuis l'axe des abscisses) des sommets posés : A puis ses images. */
export const vertexDegrees = (lab, start = START_DEG) => Array.from({ length: lab.images + 1 }, (_, j) => start + j * lab.alpha);
/** La prochaine image (le fantôme que l'élève fait tourner au cadran). */
export const ghostDegree = (lab, start = START_DEG) => start + (lab.images + 1) * lab.alpha;
/** Le nombre de sommets distincts dessinés (un tour fermé ne redessine pas A). */
export const closedN = (lab) => (lab.run === 'closed' || lab.run === 'other' ? lab.images : null);

/**
 * Les lectures d'un polygone régulier fermé : زاوية مركزية 360°/n, زاوية المضلع (n − 2)·180°/n (= 180° − α), le côté
 * (exact pour n = 3, 4, 6 : r√3, r√2, r — sinon 2r·sin(180°/n), arrondi au centième).
 */
export function readings(n, r = null) {
  const central = Rot.centralAngle(n);
  const interior = Rot.interiorAngle(n);
  const out = {
    n,
    central: Rot.degLatex(central),
    interior: Rot.degLatex(interior),
    half: Rot.degLatex(Rot.inscribedFromCentral(central)),
    sideExact: null, sideText: null, sideIsRadius: n === 6,
  };
  if (r != null) {
    const s = Rot.sideFromRadius(n, r);
    out.sideExact = s.exact ? T.surdLatex(s.exact) : null;
    out.sideText = T.roundTo(s.number, 2);
  }
  return Object.freeze(out);
}

/** 360 ÷ α écrit avec la virgule (« 7,2 ») — pour DIRE pourquoi 50° ne ferme jamais. */
export const quotientText = (alpha) => String(Number((360 / alpha).toFixed(2))).replace('.', ',');

/* ── متقدم : l'étoile du drapeau ─────────────────────────────────────────── */

/** Les nombres exacts de l'étoile (rotation.js) : R = d / (2 sin(180°/n)), branche, angle d'une pointe. */
export function starNumbers(lab) {
  const R = Rot.radiusForChord(lab.target, lab.tip);
  const s = Rot.star(lab.target, R, lab.starStep);
  return Object.freeze({
    R, RText: T.roundTo(R, 2),
    branch: s.stroke, branchText: T.roundTo(s.stroke, 2),
    tipAngle: s.tipAngle,
    half: Rot.degLatex(Rot.inscribedFromCentral(Rot.centralAngle(lab.target))),
    halfTip: T.roundTo(lab.tip / 2, 2),
  });
}

/** L'étape « نصف القطر » ne s'ouvre qu'après la fermeture du pentagone (le geste de l'élève, §7quater). */
export const canOpenRadius = (lab) => lab.mode === 'star' && lab.found != null;
export const openRadius = (lab) => (canOpenRadius(lab) ? { ...lab, stage: 'radius', last: { kind: 'stage', stage: 'radius' } } : lab);
export const canOpenDraw = (lab) => lab.mode === 'star' && lab.radiusOk;
export const openDraw = (lab) => (canOpenDraw(lab) ? { ...lab, stage: 'draw', last: { kind: 'stage', stage: 'draw' } } : lab);
/** Le chemin du retour : l'étape précédente, avec tout ce qui y a été fait. */
export const goStage = (lab, stage) => {
  if (stage === 'forge' || (stage === 'radius' && canOpenRadius(lab)) || (stage === 'draw' && canOpenDraw(lab))) return { ...lab, stage, last: { kind: 'stage', stage } };
  return lab;
};

/** La distance entre deux pointes consécutives pour R (centièmes) : 2R·sin(180°/n). */
export const chordFor = (lab, h) => Rot.chord(lab.target, h / 100, 1);
/** Un rayon proposé (glisser, clavier, −/+, saisie) : la distance mesurée au centième, juste ⇔ = d. */
export function commitRadius(lab, h) {
  if (lab.stage !== 'radius') return lab;
  const radius = clampRadius(h);
  const chord = chordFor(lab, radius);
  const text = T.roundTo(chord, 2);
  const want = T.roundTo(lab.tip, 2);
  const verdict = text === want ? 'ok' : chord < lab.tip ? 'short' : 'long';
  const trial = { radius, chord, text, verdict };
  return {
    ...lab, radius,
    radiusTrials: [...lab.radiusTrials, trial],
    radiusOk: lab.radiusOk || verdict === 'ok',
    last: { kind: 'radius', ...trial },
  };
}
export const radiusText = (h) => T.roundTo(h / 100, 2);
/** La distance entre deux pointes consécutives au centième, écrite avec la virgule. */
export const chordText = (lab, h) => T.roundTo(chordFor(lab, h), 2);

/** La pointe touchée : une branche de l'étoile (un sommet sur `starStep`) — un côté du pentagone est refusé. */
export function canStroke(lab, j) {
  if (lab.stage !== 'draw') return 'stage';
  const n = lab.target;
  if (j === lab.pen) return '';
  const d = (j - lab.pen + n) % n;
  if (d === 1 || d === n - 1) return 'side';
  if (d !== lab.starStep && d !== n - lab.starStep) return 'skip';
  if (lab.strokes.includes(strokeKey(lab.pen, j))) return 'again';
  return true;
}
export const strokeKey = (a, b) => `${Math.min(a, b)}-${Math.max(a, b)}`;
export function tapTip(lab, j) {
  const ok = canStroke(lab, j);
  if (ok === '') return lab;
  if (ok !== true) return { ...lab, last: { kind: 'refuse', reason: ok, from: lab.pen, to: j } };
  const strokes = [...lab.strokes, strokeKey(lab.pen, j)];
  return { ...lab, pen: j, strokes, last: { kind: 'stroke', from: lab.pen, to: j, count: strokes.length } };
}
export const starDone = (lab) => lab.mode === 'star' && lab.strokes.length === lab.target;

/* ── découverte et essais ─────────────────────────────────────────────────── */

/** Un essai de CONTRASTE : un tour qui ne donne pas la figure cherchée (ouvert, autre polygone, segment, étoile). */
export const hasContrast = (lab) => lab.trials.some((t) => t.outcome !== 'closed') || lab.radiusTrials.some((t) => t.verdict !== 'ok');

/**
 * La découverte s'ouvre quand la relation est VISIBLE :
 *   مبتدئ : la cellule fermée (n = 6) ET un tour qui ne l'a pas donnée (contraste) ;
 *   متقدم : l'étoile entièrement tracée (α trouvé, R juste, cinq branches) ET un essai refusé quelque part.
 */
export function discoveryReady(lab) {
  if (!hasContrast(lab)) return false;
  if (lab.mode === 'cell') return lab.trials.some((t) => t.outcome === 'closed');
  return starDone(lab);
}

/** L'essai à rapporter au module (`onTrial`) : le dernier événement jugé. */
export function evidenceOf(lab) {
  const e = lab.last;
  if (!e) return null;
  if (['closed', 'other', 'flat', 'open', 'star', 'spiral'].includes(e.kind)) return { kind: 'turn', outcome: e.kind, alpha: e.alpha, n: e.n ?? null, k: e.k, mode: lab.mode };
  if (e.kind === 'radius') return { kind: 'radius', verdict: e.verdict, radius: radiusText(e.radius), chord: e.text, mode: lab.mode };
  if (e.kind === 'stroke' && e.count === lab.target) return { kind: 'star', strokes: e.count, mode: lab.mode };
  return null;
}
