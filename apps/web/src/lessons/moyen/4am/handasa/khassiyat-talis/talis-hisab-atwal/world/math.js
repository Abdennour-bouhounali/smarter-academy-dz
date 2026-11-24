/**
 * The numbers the WRITTEN world of lesson `talis-hisab-atwal` shares (the felucca's legs, practice, trainer, evidence,
 * knowledge — and, at wave 2, the story, the forges and the mission): the kit's and the world's helpers RE-EXPORTED
 * (defects.md D8 — never a copy), the four key ids, and the lesson's numbers (`docs/reports/PYRAMIDS_WORLD_PLAN.md`
 * §3.3–§3.8, FINAL). A length is TEXT « 77,5 », « 5/6 », read exactly by `kit/exact.js`; a float never decides.
 */
import { tryRead, write } from '../../../../../../common/gameworld/kit/exact';

export {
  compare,
  equal,
  isInteger,
  minus,
  over,
  plus,
  read,
  tex,
  times,
  write,
} from '../../../../../../common/gameworld/kit/exact';
export { ltr } from '../../../../../../common/gameworld/kit/authoring/numbers';
export { FIELD, RIVER, CAMERA_BOX, PLATEAU } from '../../../../../../common/gameworld/nilePyramids/logic';

/**
 * The four keys, in the order the story gives them (plan §3.3–§3.6). `journey.js › KEYS` writes the same ids as
 * single-quoted literals (the status script reads that line): `journey.test.js` checks the two agree.
 *   🔑 K1 « وضعية طالس » (P1) · 📐 K2 « حساب طول مجهول » (P2) · 🦋 K3 « وضعية الفراشة » (P2) · 🔍 K4 « معامل التناسبية » (P3)
 */
export const K1 = 'wadiyat-talis';
export const K2 = 'hisab-tul';
export const K3 = 'wadiyat-al-farasha';
export const K4 = 'muamil-k';

/**
 * THE LESSON'S NUMBERS for the forges, the experiments and the last steps (plan §3.3–§3.7, checked against the bank
 * there, §3.8). The stages' own numbers are the world's (`nilePyramids/logic.js`: FIELD, FACE, RIVER, CAPSTONE,
 * PLATEAU, CAMERA_BOX), re-exported above. A figure is `{ VM, VB, VN, VC, MN, BC }` (V the vertex, M on [VB], N on [VC]).
 */
export const NUMBERS = {
  /** 🔑 attack 1 (an isosceles field, its canal through the midpoints) and attack 2 (other letters, other position). */
  talis: {
    attack1: {
      names: { V: 'K', M: 'E', B: 'L', N: 'F', C: 'P' },
      VM: '19',
      VB: '38',
      VN: '19',
      VC: '38',
      MN: '16',
      BC: '32',
    },
    attack2: {
      names: { V: 'R', M: 'U', B: 'S', N: 'V', C: 'T' },
      VM: '48',
      VB: '66',
      VN: '56',
      VC: '77',
      MN: '64',
      BC: '88',
    },
    /** the last step: DEF on its side, G on [DE], H on [DF], (GH) ∥ (EF) — names only (the ratios are written). */
    use: { names: { V: 'D', M: 'G', B: 'E', N: 'H', C: 'F' } },
  },
  /** 📐 the experiment's figure (k = 7/9) and the last step (k = 9/11). */
  hisab: {
    plan: { VM: '42', VB: '54', VN: '56', VC: '72', MN: '63', BC: '81' },
    use: {
      names: { V: 'A', M: 'E', B: 'B', N: 'F', C: 'C' },
      VM: '45',
      MB: '10',
      VC: '66',
      BC: '77',
      VB: '55',
      VN: '54',
      MN: '63',
    },
  },
  /** 🦋 the rounds (k = 7/10; the crooked one), the attack (k = 4/9), the last step (k = 3/8). */
  farasha: {
    parallel: { VM: '35', VB: '50', VN: '49', VC: '70', MN: '63', BC: '90' },
    crooked: { VM: '35', VB: '60', VN: '49', VC: '64', MN: '63', BC: '92' },
    attack: {
      names: { V: 'O', M: 'U', B: 'W', N: 'V', C: 'T' },
      VM: '24',
      VB: '54',
      VN: '32',
      VC: '72',
      MN: '40',
      BC: '90',
    },
    use: {
      names: { V: 'O', M: 'A', B: 'C', N: 'B', C: 'D' },
      VM: '18',
      VB: '48',
      VN: '21',
      BC: '88',
      VC: '56',
      MN: '33',
    },
  },
  /** 🔍 the copying frame (k = 6/5 and 5/6), the perimeters, the last step (k = 5/8). */
  muamil: {
    small: ['20', '40', '55'],
    big: ['24', '48', '66'],
    perimeters: ['115', '138'],
    use: { AB: '68', BC: '92', AM: '42,5', MN: '57,5', k: '5/8', back: '8/5' },
  },
  /** The final mission (plan §3.7): the stick 2 casts 3; the shadow 104 from the base edge, half the base 115. */
  mission: { stick: '2', stickShadow: '3', shadow: '104', half: '115', AB: '219', h: '146', k: '73' },
};

/**
 * THE FIGURES OF « تدرّب » AND OF THE KNOWLEDGE MAP — the platform's own (none is a figure of the story; no two of a
 * figure's lengths stand on one line of the bank: `trainer.test.js` reads it). A figure is `{ VM, VB, VN, VC, MN, BC }`
 * (V the vertex): nested, M on [VB] and N on [VC]; a butterfly, M and B on both sides of V, N and C too.
 * `scale` is a triangle VBC and its image VMN: { VB, BC, VM, MN } (k = VM / VB).
 */
export const FIGURES = {
  nested: [
    { VM: '35', VB: '42', VN: '55', VC: '66', MN: '65', BC: '78' }, // k = 5/6
    { VM: '18', VB: '21', VN: '66', VC: '77', MN: '78', BC: '91' }, // k = 6/7
    { VM: '16', VB: '36', VN: '28', VC: '63', MN: '40', BC: '90' }, // k = 4/9
    { VM: '42', VB: '48', VN: '77', VC: '88', MN: '84', BC: '96' }, // k = 7/8
    { VM: '65', VB: '78', VN: '70', VC: '84', MN: '80', BC: '96' }, // k = 5/6
    { VM: '17,5', VB: '21', VN: '27,5', VC: '33', MN: '32,5', BC: '39' }, // k = 5/6, halves
  ],
  butterfly: [
    { VM: '20', VB: '32', VN: '35', VC: '56', MN: '45', BC: '72' }, // k = 5/8
    { VM: '48', VB: '56', VN: '78', VC: '91', MN: '84', BC: '98' }, // k = 6/7 (48 + 56 is not 91)
    { VM: '65', VB: '78', VN: '75', VC: '90', MN: '15', BC: '18' }, // k = 5/6
  ],
  scale: [
    { VB: '32', BC: '44', VM: '20', MN: '27,5' }, // k = 5/8
    { VB: '48', BC: '64', VM: '42', MN: '56' }, // k = 7/8
    { VB: '63', BC: '77', VM: '54', MN: '66' }, // k = 6/7
    { VB: '78', BC: '96', VM: '65', MN: '80' }, // k = 5/6
    { VB: '36', BC: '90', VM: '16', MN: '40' }, // k = 4/9
  ],
};

/**
 * A number typed in a DECIMAL box (digits and at most one comma, « 22,5 »; a point typed is a comma) — exact text, or
 * null (an empty box, a word, a sign, NaN).
 */
export function typedNumber(x) {
  if (typeof x === 'number') return Number.isFinite(x) && x >= 0 ? typedNumber(String(x)) : null;
  const t = String(x ?? '').trim();
  if (!/^\d+([,.]\d+)?$/.test(t)) return null;
  const v = tryRead(t);
  return v ? write(v) : null;
}
/** A whole number typed in one box, or null. */
export function typedWhole(x) {
  if (typeof x === 'number') return Number.isInteger(x) && x >= 0 ? x : null;
  const t = String(x ?? '').trim();
  return /^\d+$/.test(t) ? Number(t) : null;
}
/** A fraction typed over a bar, as text « p/q » — or null (an empty box, a denominator 0). */
export function typedFrac(n, d) {
  const [p, q] = [typedWhole(n), typedWhole(d)];
  return p == null || !q ? null : `${p}/${q}`;
}
