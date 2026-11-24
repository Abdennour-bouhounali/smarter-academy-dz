/**
 * THE EXPERIMENTS « استكشف » of lesson `talis-hisab-atwal` — the first phase of three of its forges (`forges.js ›
 * inquiry`; the screens are the world's: `nilePyramids/Inquiry.jsx` → `InquiryPlan.jsx`, `InquiryHalfturn.jsx`,
 * `InquiryScale.jsx`; their logic `plan.js`, `halfturn.js`, `scale.js`; their words `strings.js › KIND_TEXT`, with
 * the lesson's `text` over them). Key 🔑 has none: it is met IN THE WORLD, on the field's two canals (its forge reads
 * the world's log). No two keys share a (kind, mode) — `inquiries.test.js`.
 *
 *   📐 `plan`      (writes the rule) round 1 is HIS first course of the workshop (SB = 90, BM = 10, BC = 99 → 88);
 *                  then ONE figure, k = 7/9, with another unknown each round: MN from AM and MB, BC from AN and NC,
 *                  MB from AM, AN and NC. The world lays his number: fits · a gap · an overhang, its size written.
 *   🦋 `halfturn`  round 1 is HIS river, whole (SE 9, SA 72, ER 52, AF 416; SR = √2785 and SF = 8√2785, both lines
 *                  square to the bank — `logic.js › riverFigure`, k = 1/8); then a parallel pair on both sides of the
 *                  vertex (k = 7/10), then a crooked one (PQ = 92, exact): before
 *                  each turn he says on which line the point will land; the turned side lands straight, or crooked.
 *   🔍 `scale`     the capstone as the world's fact (k = 1/36); the frame at 6/5 fed AMN, then fed ABC; the k he sets
 *                  himself to bring ABC back to AMN; the perimeter of a copy.
 * Every sentence is a FACT about what he did — never a rule, never a key's name (`inquiries.test.js` lists the
 * forbidden words of each key). The river's drawing writes only what he measured (and the width): SR and SF are exact
 * roots the world knows, never shown as numbers.
 */
import { riverFigure } from '../../../../../../common/gameworld/nilePyramids/logic';
import { NUMBERS, RIVER } from './math';

/** A figure's letters: the vertex V, M on line (VB), N on line (VC). */
const NAMES = {
  field: { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
  face: { V: 'S', M: 'M', B: 'B', N: 'N', C: 'C' },
  turn: { V: 'I', M: 'K', B: 'P', N: 'L', C: 'Q' },
};

/** 📐 HIS first course (the workshop's face: SB = SC = 90, BC = 99, the mark BM = 10), then the plan's figure. */
export const COURSE_ONE = {
  kind: 'nested',
  names: NAMES.face,
  len: { VM: '80', VB: '90', VN: '80', VC: '90', MN: '88', BC: '99' },
};
export const PLAN_FIG = { kind: 'nested', names: NAMES.field, len: { ...NUMBERS.hisab.plan } };

export const PLAN_INQUIRY = {
  kind: 'plan',
  /** What he builds and the world accepts IS his rule: no tile is offered (GAME_WORLD.md §2sexies). */
  writes: true,
  rounds: [
    { fig: COURSE_ONE, given: ['MB', 'VB', 'BC'], unknown: 'MN' },
    { fig: PLAN_FIG, given: ['VM', 'MB', 'BC'], unknown: 'MN' },
    { fig: PLAN_FIG, given: ['VN', 'NC', 'MN'], unknown: 'BC' },
    { fig: PLAN_FIG, given: ['VM', 'VN', 'NC'], unknown: 'MB' },
  ],
  text: {
    lead: 'مدماك لم يُبنَ بعد لا يقيسه حبل. في الشكل طول واحد مجهول: اختر بطاقتين، وصِل الحبلين أو اقطع قطعة إن احتجت، ثمّ اكتب الطول.',
  },
};

/** 🦋 a parallel pair round the vertex I (k = 7/10), then a crooked one: PQ² = 60² + 64² + 2 × 60 × 64 / 10 = 92². */
/** 🦋 HIS river round the stake S: E and R on this bank, A and F across (k = 1/8). */
export const TURN_RIVER = { ...riverFigure(RIVER), head: 'النهر' };
export const TURN_PARALLEL = { kind: 'butterfly', names: NAMES.turn, len: { ...NUMBERS.farasha.parallel } };
export const TURN_CROOKED = { kind: 'butterfly', names: NAMES.turn, len: { ...NUMBERS.farasha.crooked } };

export const HALFTURN_INQUIRY = {
  kind: 'halfturn',
  rounds: [{ fig: TURN_RIVER }, { fig: TURN_PARALLEL }, { fig: TURN_CROOKED }],
  text: {
    lead: 'مثلّثان على جهتي الرأس، كضفّتي النهر. أدِر المثلّث الصغير نصف دورة حول الرأس، وانظر أين يقع.',
  },
};

/** 🔍 the copying frame at the vertex A: AMN (20, 40, 55) and ABC (24, 48, 66); the capstone first, as a fact. */
export const SCALE_TRI = {
  small: { V: 'A', P: 'M', Q: 'N', sides: [...NUMBERS.muamil.small] },
  big: { V: 'A', P: 'B', Q: 'C', sides: [...NUMBERS.muamil.big] },
};
export const SCALE_INQUIRY = {
  kind: 'scale',
  tri: SCALE_TRI,
  rounds: [
    {
      fact: {
        k: '1/36',
        lines: ['$k = \\dfrac{1}{36}$', '$99 \\times \\dfrac{1}{36} = 2{,}75$', '$90 \\times \\dfrac{1}{36} = 2{,}5$'],
      },
    },
    { k: '6/5', feed: 'small' },
    { k: '6/5', feed: 'big' },
    { k: null, feed: 'big' },
    { k: '6/5', feed: 'small', perimeter: true },
  ],
  text: {
    fact: 'حجر القمّة: كلّ طول من أطوال الهرم ضُرب في العدد نفسه.',
  },
};
