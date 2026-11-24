/**
 * « الأهرامات » — the rule forge IN THIS WORLD (PURE; the frame is kit/forge.js, the screen kit/RuleForge.jsx, the drawing
 * of a case forgeParts.jsx). It names no lesson: a lesson's `world/forges.js` builds its forges on these cases.
 *
 * A CASE is a Thalès figure (`figure.js`) and what is true of it:
 *   { kind: 'nested' | 'butterfly', names: { V, M, B, N, C }, len: { VM, VB, VN, VC, MN, BC }, held, …extras }
 *   held    what the case is TRUE of — given by the lesson's question (default: « the three ratios are equal »,
 *           `chain`, exact)
 *   extras  `id` (an identity of its own), `head` (the case's name in a line of evidence: « القناة الجديدة »),
 *           `tag` (a short word under it), `show` (the lengths the mirror writes; default all), `parallel` (draw
 *           the chevrons — default: when the chain holds)
 *   tested  the three values the case was TESTED through, when they are not the ratios from the vertex
 *           (`figure.js › gauge`): `{ values, to?, names? }` — the gauge draws them, so it agrees with `held`
 * Every length is exact text: 50,1 is never taken for 351/7; a root is written « 8√2785 » (`surd.js`).
 */
import { chain, gauge, ratios, withPieces } from './figure';
import { lenWrite as write } from './surd';

/** A case of this world. Lengths are written once (« 14.0 » becomes « 14 »). */
export function thalesCase({ kind = 'nested', names, len, ...extra }) {
  const L = {};
  for (const [k, v] of Object.entries(len)) L[k] = v == null ? null : write(v);
  const fig = withPieces({ kind, names: { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C', ...names }, len: L });
  return { ...extra, ...fig, held: 'held' in extra ? extra.held : chain(fig) };
}

/** The identity of a case: its kind, its letters and its lengths. */
export const caseId = (c) =>
  c.id ??
  `${c.kind}|${Object.values(c.names).join('')}|${['VM', 'VB', 'VN', 'VC', 'MN', 'BC'].map((k) => c.len[k] ?? '?').join(':')}`;

/** What the world shows of a case: the three ratios (exact text) and whether the gauge's marks stand on one line. */
export const runCase = (c) => ({ ratios: ratios(c), aligned: gauge(c).aligned });

/** The segment of `len` named with the case's letters: « VM » → « AM » (for a sentence or a card). */
export const segName = (c, key) =>
  key
    .split('')
    .map((ch) => c.names[ch] ?? ch)
    .join('');

/** The wording the world gives the forges by default — a lesson's forge overrides what its rule changes. */
export const THALES_TEXT = {
  title: 'لوح البنّائين',
  sub: 'اصنع مفتاحك: قاعدة تصمد أمام المرآة.',
  log: 'ما قِسته وما بُني',
  next: 'حالة أخرى',
  testing: 'المرآة تمرّ على حالاتك واحدةً واحدة…',
  agreed: 'قاعدتك توافق كلّ الحالات التي رأيتَها. الآن المرآة تتحدّاها بحالة جديدة.',
  fire: 'ابنِ الحالة',
  survived: 'صمدت قاعدتك أمام هذه الحالة.',
  wordsHint: 'قل قاعدتك بكلماتك…',
  aligned: 'العلامات الثلاث على خطّ واحد.',
  apart: 'العلامات الثلاث ليست على خطّ واحد.',
  mirrored: 'بنته المرآة',
};
