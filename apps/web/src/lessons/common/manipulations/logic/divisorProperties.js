import { divisibility } from '@smarter-academy/core';

const { divmod } = divisibility;

export const TARGETS = Object.freeze(['sum', 'diff', 'rem']);

/**
 * divisor-properties — n divise a et b ; l'élève CONSTRUIT a + b, a − b et le
 * reste de a par b avec des blocs de taille n, et voit que chacun est un
 * nombre entier de blocs.
 *
 *   a = n × q  (q blocs)      b = n × q'  (q' blocs)
 *   a + b → q + q' blocs      a − b → q − q' blocs
 *   a = b × k + r → r = n × (q − k q') blocs
 */
export function init({ n, a, b }) {
  const { q: k, r } = divmod(a, b);
  return { n, a, b, q: a / n, qp: b / n, k, r, built: [], valid: a % n === 0 && b % n === 0 && a >= b };
}

export function canBuild(state, target) {
  if (!TARGETS.includes(target)) return 'unknownTarget';
  if (state.built.includes(target)) return 'alreadyBuilt';
  return true;
}

export function build(state, target) {
  if (canBuild(state, target) !== true) return state;
  return { ...state, built: [...state.built, target] };
}

/** Le résultat d'une construction, en blocs de n. */
export function blocks(state, target) {
  const { n, a, b, q, qp, k, r } = state;
  if (target === 'sum') return { value: a + b, count: q + qp, tex: `${a} + ${b} = ${n} \\times ${q} + ${n} \\times ${qp} = ${n} \\times (${q} + ${qp}) = ${n} \\times ${q + qp}` };
  if (target === 'diff') return { value: a - b, count: q - qp, tex: `${a} - ${b} = ${n} \\times ${q} - ${n} \\times ${qp} = ${n} \\times (${q} - ${qp}) = ${n} \\times ${q - qp}` };
  return { value: r, count: r / n, tex: `${a} = ${b} \\times ${k} + ${r} \\quad\\Rightarrow\\quad ${r} = ${n} \\times ${q} - ${n} \\times ${qp * k} = ${n} \\times ${q - qp * k}` };
}

export function discoveryReady(state) {
  return TARGETS.every((t) => state.built.includes(t));
}

/* ── Le constructeur de preuve (أتعلّم البرهنة, p. 11) ───────────────────── */

/** Les lignes de la preuve « n | a et n | b ⇒ n | a + b », dans l'ordre du manuel. */
export const PROOF_LINES = Object.freeze([
  { id: 'hyp-a', tex: 'a = n \\times q' },
  { id: 'hyp-b', tex: "b = n \\times q'" },
  { id: 'sum', tex: "a + b = n \\times q + n \\times q'" },
  { id: 'factor', tex: "a + b = n \\times (q + q')" },
  { id: 'concl', tex: "a + b = n \\times k,\\ k = q + q'" },
]);

export function proofInit(lines = PROOF_LINES) {
  // Mélange DÉTERMINISTE (l'ordre dépend des ids) : deux élèves voient la même réserve.
  const pool = [...lines].sort((x, y) => (hash(x.id) % 97) - (hash(y.id) % 97));
  return { lines, pool: pool.map((l) => l.id), placed: [], wrong: null };
}

/** Une ligne se pose dans l'emplacement suivant si c'est bien elle qui vient. */
export function proofCanPlace(state, lineId, slot) {
  if (slot !== state.placed.length) return 'notNextSlot';
  if (state.lines[slot]?.id !== lineId) return 'wrongLine';
  return true;
}

export function proofPlace(state, lineId, slot) {
  if (proofCanPlace(state, lineId, slot) !== true) return { ...state, wrong: lineId };
  return { ...state, placed: [...state.placed, lineId], pool: state.pool.filter((id) => id !== lineId), wrong: null };
}

export function proofDone(state) {
  return state.placed.length === state.lines.length;
}

function hash(s) {
  let h = 7;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}
