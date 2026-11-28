/**
 * « فضاء التدريب » of lesson `talis-hisab-atwal` — the CONTENT of its practice ladder (PURE). The ladder is the kit's
 * (`gameworld/kit/ladder.js`); a level is a run of the kit's rail, on the river (plan §1.3: « the same rail is the
 * practice ladder … the trip is the first level of the node of the key just sealed »). Its waves are the felucca's
 * (`run.js › GENERATORS`, `isRight`): one definition of a buoy, here and between the docks.
 * Each key practises ITS calculations only, bare (owner, 2026-11-27: the river asks speed calculations, no figure):
 * 🔑 an equality of two fractions to complete and the cross product « \dfrac{b \times c}{a} »; 📐 a side from the
 * vertex as the sum of its two pieces, an equality whose box is a short decimal; 🦋 the same with a half length; 🔍 a side
 * times k, a coefficient from two sides, the number that brings k back to 1.
 */
import { createLadder, SUMMARY } from '../../../../../../common/gameworld/kit/ladder';
import { GENERATORS, isRight, LEG_MIX } from './run';
import { K1, K2, K3, K4 } from './math';

/**
 * The map: one node per key in the order of the lesson, then the summary node; levels from the easiest — the second of
 * each node faster, with bigger numbers (`{ big: true }`, `run.js › M`).
 */
const BIG = { big: true };
export const PRACTICE_NODES = [
  {
    id: K1,
    levels: [
      { speed: 6.0, mix: LEG_MIX[0] },
      {
        speed: 6.6,
        mix: [
          ['equality', BIG],
          ['cross', BIG],
          ['equality', BIG],
        ],
      },
    ],
  },
  {
    id: K2,
    levels: [
      { speed: 6.0, mix: LEG_MIX[1] },
      {
        speed: 6.6,
        mix: [
          ['sum', BIG],
          ['decimal', BIG],
          ['sum', BIG],
        ],
      },
    ],
  },
  {
    id: K3,
    levels: [
      { speed: 6.0, mix: LEG_MIX[2] },
      {
        speed: 6.6,
        mix: [
          ['halfEquality', BIG],
          ['halfCross', BIG],
          ['halfEquality', BIG],
        ],
      },
    ],
  },
  {
    id: K4,
    levels: [
      { speed: 6.0, mix: LEG_MIX[3] },
      {
        speed: 6.6,
        mix: [
          ['image', BIG],
          ['back', BIG],
          ['coefficient', BIG],
        ],
      },
    ],
  },
  // the summary node: two mixed runs, the second faster with bigger numbers
  {
    id: SUMMARY,
    levels: [
      {
        speed: 6.2,
        mix: [
          ['equality', {}],
          ['sum', {}],
          ['halfCross', {}],
          ['image', {}],
        ],
      },
      {
        speed: 6.8,
        mix: [
          ['cross', BIG],
          ['decimal', BIG],
          ['halfEquality', BIG],
          ['back', BIG],
        ],
      },
    ],
  },
];
/** The ladder of this lesson: its levels, bound to its nodes and to the felucca's generators. */
export const ladder = createLadder({ nodes: PRACTICE_NODES, generators: GENERATORS, isRight });
export const { waveOf } = ladder;

/**
 * The practice hub draws the ladder as the lesson's mind map (percent of the map box; the map of 1366×768 is about
 * 590 × 408 px; a node is its disc over its name — `practice.test.js` measures it). The root and the links say places
 * of the river, never a key's name (the hub shows before the first key).
 */
export const PRACTICE_MAP = {
  root: 'رحلات النيل',
  positions: {
    root: [50, 9],
    [K1]: [78, 30],
    [K2]: [26, 44],
    [K3]: [76, 58],
    [K4]: [28, 78],
    [SUMMARY]: [74, 86],
  },
  edges: [
    ['root', K1, 'الحقل'],
    [K1, K2, 'الورشة'],
    [K1, K3, null],
    [K3, K4, 'القمّة'],
    [K2, K4, null],
    [K4, SUMMARY, 'مراجعة'],
  ],
};
