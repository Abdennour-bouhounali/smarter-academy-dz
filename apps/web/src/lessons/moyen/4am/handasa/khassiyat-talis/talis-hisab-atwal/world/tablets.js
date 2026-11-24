/**
 * THE TABLETS of lesson `talis-hisab-atwal` — where each rule gets its NAME, after the student forged it (`forges.js`;
 * the screen `kit/Tablet.jsx`: `lines` through MathText, `math` as formulas, `notes` as plain text). Only here do the
 * names appear first: « خاصية طالس », « وضعية طالس » (🔑), « الرابع المتناسب », « الجداء المتصالب » (📐), « وضعية
 * الفراشة », « نصف دورة » (🦋), « معامل التناسبية », « تكبير », « تصغير » (🔍) — the board's recall words, word for
 * word, in the words of the lines (never inside a formula: `board/board.test.js` reads them). A tablet is at most two
 * lines and two formulas (four lines in all — defects.md B17); every number is the story's, computed in story.test.js.
 */
import { K1, K2, K3, K4 } from './math';

export const TABLETS = {
  [K1]: {
    icon: '🔑',
    title: 'خاصية طالس',
    lines: [
      'في المثلّث $ABC$: $M$ من $[AB]$ و $N$ من $[AC]$ و $(MN) \\parallel (BC)$ — هذه وضعية طالس. القناة القديمة لم توازِ $(BC)$، ونسبها لم تتساوَ.',
      'خاصية طالس: النسب الثلاث متساوية، كلّ نسبة طول من الرأس على الضلع كلّه، والضلع الموازي على الضلع الموازي.',
    ],
    math: [
      '\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}',
      '\\dfrac{14}{63} = \\dfrac{16}{72} = \\dfrac{18}{81}',
    ],
    notes: [],
  },
  [K2]: {
    icon: '📐',
    title: 'حساب طول مجهول',
    lines: [
      'من النسب الثلاث نسبتان فيهما المجهول وثلاثة أطوال معلومة: المجهول هو الرابع المتناسب، يُحسب بالجداء المتصالب.',
      'إذا أُعطي الضلع قطعتين جُمعتا: $AB = AM + MB$؛ وإذا كانت القطعة هي المجهولة اقتُطعت: $MB = AB - AM$.',
    ],
    math: ['\\dfrac{80}{90} = \\dfrac{MN}{99}', 'MN = \\dfrac{99 \\times 80}{90} = 88'],
    notes: [],
  },
  [K3]: {
    icon: '🦋',
    title: 'وضعية الفراشة',
    lines: [
      'المستقيمان $(AE)$ و $(FR)$ يتقاطعان في $S$، و $(AF) \\parallel (ER)$: هذه وضعية الفراشة، والنسب الثلاث متساوية.',
      'نصف دورة حول نقطة التقاطع تعيدها إلى وضعية طالس.',
    ],
    math: [
      '\\dfrac{SE}{SA} = \\dfrac{SR}{SF} = \\dfrac{ER}{AF}',
      '\\dfrac{9}{72} = \\dfrac{52}{AF} \\Rightarrow AF = 416',
    ],
    notes: [],
  },
  [K4]: {
    icon: '🔍',
    title: 'معامل التناسبية',
    lines: [
      'في وضعية طالس، المثلّث الثاني هو الأوّل وكلّ أطواله ومحيطه × عدد واحد $k$: معامل التناسبية.',
      'إذا كان $k > 1$ فهو تكبير، وإذا كان $k < 1$ فهو تصغير؛ ومن الثاني إلى الأوّل العدد $\\dfrac{1}{k}$.',
    ],
    math: ['k = \\dfrac{24}{20} = \\dfrac{6}{5}', '\\dfrac{2{,}5}{90} = \\dfrac{1}{36}'],
    notes: [],
  },
};
