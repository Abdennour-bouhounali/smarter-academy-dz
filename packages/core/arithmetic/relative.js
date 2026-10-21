/**
 * Les NOMBRES RELATIFS DÉCIMAUX sous le « المسبار » (2AM, unité 3 « الأعداد النسبية », درس « مقارنة وترتيب أعداد نسبية »,
 * 2026-10-21) — arithmétique EXACTE en BigInt, sans aucune virgule flottante.
 *
 * Un nombre est un BigInt : le nombre de CENTIÈMES (−4,5 → −450n). Le labo `zero-probe` tient la DISTANCE à zéro `d` ≥ 0 d'un
 * capteur ; le côté (« فوق » / « تحت » le zéro) est un autre geste ; le nombre relatif est leur SORTIE :
 * `fromSideDistance('below', 5)` = −5. Deux nombres négatifs : le plus petit est celui dont la distance à zéro est la plus grande ;
 * un négatif est plus petit que le zéro et que tout positif — `cmp` ne fait que comparer des entiers, la règle se VOIT dans le labo.
 *
 * Écriture : la virgule décimale à l'écran (`text`, `tex`), le signe moins ASCII `-` dans les données ; `parse` accepte aussi
 * « − » (U+2212), le point, et les chiffres arabes-indiens ; de 0 à 2 décimales.
 *
 * Importé PAR CHEMIN (`@smarter-academy/core/arithmetic/relative.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §4).
 */

/** Distance maximale à zéro du câble (en unités). */
export const MAX_D = 10;
/** Le pas d'un niveau, en centièmes : 100n = 1 (مبتدئ), 10n = 0,1 (متقدم). */
export const STEP_UNIT = 100n;
export const STEP_TENTH = 10n;
export const SIDES = Object.freeze(['below', 'above']);

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const abs = (x) => (x < 0n ? -x : x);

/** « -4,5 », « −4.5 », « ٣,٥ », 4.5 (nombre), 450n (centièmes) → centièmes (BigInt). Lève si illisible ou plus de 2 décimales. */
export function parse(x) {
  if (typeof x === 'bigint') return x;
  if (typeof x === 'number') {
    if (!Number.isFinite(x)) throw new Error(`nombre illisible : ${x}`);
    return BigInt(Math.round(x * 100));
  }
  const s = String(x).trim().replace(/−/g, '-').replace(/[٠-٩]/g, (c) => String(ARABIC_DIGITS.indexOf(c))).replace(/[,٫،]/g, '.').replace(/\s+/g, '');
  const m = /^([+-]?)(\d+)(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) throw new Error(`nombre illisible : ${x}`);
  const h = BigInt(m[2]) * 100n + BigInt((m[3] ?? '').padEnd(2, '0') || '0');
  return m[1] === '-' ? -h : h;
}

/** Le nombre relatif d'un capteur à `d` du zéro, `side` 'above' (+) ou 'below' (−). `d` ≥ 0 (texte, nombre ou centièmes). */
export function fromSideDistance(side, d) {
  if (!SIDES.includes(side)) throw new Error(`côté inconnu : ${side}`);
  const h = parse(d);
  if (h < 0n) throw new Error('distance négative');
  return side === 'below' ? -h : h;
}

/** −1 | 0 | 1. */
export const cmp = (a, b) => { const p = parse(a); const q = parse(b); return p < q ? -1 : p > q ? 1 : 0; };
/** La distance à zéro (centièmes). */
export const distance = (a) => abs(parse(a));
/** Le côté d'un nombre : 'below' | 'above' | 'zero'. */
export const sideOf = (a) => { const p = parse(a); return p < 0n ? 'below' : p > 0n ? 'above' : 'zero'; };

/** « -4,5 » : virgule décimale, zéros inutiles retirés, signe moins ASCII (l'écran le met en « − » dans un îlot LTR). */
export function text(a) {
  const p = parse(a);
  const h = abs(p);
  const whole = h / 100n;
  const frac = String(h % 100n).padStart(2, '0').replace(/0+$/, '');
  return `${p < 0n ? '-' : ''}${whole}${frac ? `,${frac}` : ''}`;
}
/** LaTeX : « -4{,}5 » (virgule sans espace). */
export const tex = (a) => text(a).replace(',', '{,}');

/** Une tâche normalisée en centièmes ; lève si mal formée. */
function norm(task) {
  if (task.kind === 'beat') {
    if (task.want !== 'lower' && task.want !== 'higher') throw new Error('want inconnu');
    return { ...task, A: parse(task.a) };
  }
  if (task.kind === 'between') {
    const lo = parse(task.lo); const hi = parse(task.hi);
    if (lo >= hi) throw new Error('lo doit être < hi');
    return { ...task, LO: lo, HI: hi };
  }
  throw new Error(`tâche inconnue : ${task.kind}`);
}

/**
 * Le jugement EXACT d'un essai : le capteur B à `d` du zéro du côté `side`.
 * `beat` : B < A (`want` 'lower') ou B > A ('higher') ; `between` : lo < B < hi (strict). Si la tâche IMPOSE un côté (`side`) ou veut
 * les deux (`both`), B doit réellement être de ce côté : un câble de longueur 0 n'est d'aucun côté et ne réussit pas.
 * Retourne { ok, value (centièmes), order (cmp B à A, ou -1/0/1 B à l'intervalle : -1 sous lo, 0 entre, 1 au-dessus de hi), credit }
 * — `credit` : le côté crédité à l'essai ('below' | 'above') ou null (d = 0).
 */
export function judge(task, side, d) {
  const t = norm(task);
  const dh = parse(d);
  const B = fromSideDistance(side, dh);
  const credit = dh > 0n ? side : null;
  const sideOk = t.side ? (dh > 0n && side === t.side) : (t.both ? dh > 0n : true);
  if (t.kind === 'beat') {
    const order = cmp(B, t.A);
    const hit = t.want === 'lower' ? order < 0 : order > 0;
    return { ok: hit && sideOk, value: B, order, credit };
  }
  const order = B <= t.LO ? -1 : B >= t.HI ? 1 : 0;
  return { ok: order === 0 && sideOk, value: B, order, credit };
}

/** Toutes les (côté, distance) qui réussissent, `d` de 0 à MAX_D par `stepH` centièmes. [{ side, d (centièmes), value }] */
export function solutions(task, stepH = STEP_TENTH) {
  const t = norm(task);
  const out = [];
  const sides = t.side ? [t.side] : ['above', 'below'];
  for (const side of sides) {
    for (let d = 0n; d <= BigInt(MAX_D) * 100n; d += BigInt(stepH)) {
      if (d === 0n && side === 'below') continue; // 0 est le même point des deux côtés
      const j = judge(t, side, d);
      if (j.ok) out.push({ side, d, value: j.value });
    }
  }
  return out;
}
export const solutionsBeat = (task, stepH = STEP_TENTH) => { if (task.kind !== 'beat') throw new Error('pas une tâche beat'); return solutions(task, stepH); };
export const solutionsBetween = (task, stepH = STEP_TENTH) => { if (task.kind !== 'between') throw new Error('pas une tâche between'); return solutions(task, stepH); };

/** Aucune longueur ne convient ? (le bouton « لا يوجد طول يحقّق ذلك » est alors juste). */
export const isImpossible = (task, stepH = STEP_TENTH) => solutions(task, stepH).length === 0;

/** UNE longueur qui convient (la plus courte, du côté « فوق » à égalité) ; null s'il n'y en a pas. */
export function sample(task, stepH = STEP_TENTH) {
  const all = solutions(task, stepH);
  if (!all.length) return null;
  return all.reduce((best, s) => (s.d < best.d || (s.d === best.d && s.side === 'above' && best.side !== 'above') ? s : best));
}

/** Un nombre saisi dans « جرّب أعدادك » : |A| ≤ 9,9, de 0 à 2 décimales ; renvoie le texte normalisé (« -2,5 ») ou null. */
export function parseFree(raw, limit = 990n) {
  try {
    const h = parse(String(raw));
    return abs(h) <= limit ? text(h) : null;
  } catch { return null; }
}
