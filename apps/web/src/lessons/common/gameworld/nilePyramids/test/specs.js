/** EXAMPLES of the spec shapes a lesson's `inquiries.js` writes for this world's three kinds (plan §3.4–§3.6, final). */
export const NESTED = { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' };
export const PLAN_SPEC = {
  kind: 'plan',
  rounds: [
    {
      fig: {
        kind: 'nested',
        names: { V: 'S', M: 'M', B: 'B', N: 'N', C: 'C' },
        len: { VM: '80', VB: '90', VN: '80', VC: '90', MN: '88', BC: '99' },
      },
      given: ['MB', 'VB', 'BC'],
      unknown: 'MN',
    },
    {
      fig: { kind: 'nested', names: NESTED, len: { VM: '42', VB: '54', VN: '56', VC: '72', MN: '63', BC: '81' } },
      given: ['VM', 'MB', 'BC'],
      unknown: 'MN',
    },
    {
      fig: { kind: 'nested', names: NESTED, len: { VM: '42', VB: '54', VN: '56', VC: '72', MN: '63', BC: '81' } },
      given: ['VN', 'NC', 'MN'],
      unknown: 'BC',
    },
  ],
};
export const HALFTURN_SPEC = {
  kind: 'halfturn',
  rounds: [
    {
      fig: {
        kind: 'butterfly',
        names: { V: 'I', M: 'K', B: 'P', N: 'L', C: 'Q' },
        len: { VM: '35', VB: '50', VN: '49', VC: '70', MN: '63', BC: '90' },
      },
    },
    {
      fig: {
        kind: 'butterfly',
        names: { V: 'I', M: 'K', B: 'P', N: 'L', C: 'Q' },
        len: { VM: '35', VB: '60', VN: '49', VC: '64', MN: '63', BC: '92' },
      },
    },
  ],
};
export const SCALE_SPEC = {
  kind: 'scale',
  tri: {
    small: { V: 'A', P: 'M', Q: 'N', sides: ['20', '40', '55'] },
    big: { V: 'A', P: 'B', Q: 'C', sides: ['24', '48', '66'] },
  },
  rounds: [
    { fact: { k: '1/36', lines: ['$k = \\dfrac{1}{36}$'] } },
    { k: '6/5', feed: 'small' },
    { k: '6/5', feed: 'big' },
    { k: null, feed: 'big' },
    { k: '6/5', feed: 'small', perimeter: true },
  ],
};
