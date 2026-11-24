/**
 * What « خريطة المعارف » shows for lesson `talis-hisab-atwal` (v2): the lesson's mind map (its cards and their labelled
 * links), the memo sheet of each of its four keys, and where each card sits on the full map.
 *
 * Written FROM SCRATCH with the platform's own figures (`math.js › FIGURES`, never the story's nor the bank's). The map
 * comes AFTER the forges: it may say « وضعية طالس », « الفراشة », « معامل التناسبية ». A card opens when its key is held
 * (`requires` is always a key); a card with `notebook` shows the memo sheet of its key. Only the kinds of
 * `kit/text.js`. The memo's `hook`, `trap` and `exam` are PLAIN text (no `$`): a segment or an equality in them is
 * isolated left to right (`ltr`); `rule`, `example`, `chip` are formulas with no Arabic. Every number a card states is
 * computed here from its figure, and checked again in `knowledge.test.js`.
 */
import { FIGURES, K1, K2, K3, K4, ltr, minus, over, tex, times, write } from './math';

/** What CHANGES in a rule of the memo sheet (red). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;
/** A ratio a / b as a formula over a real bar, reduced: « \\dfrac{5}{6} ». */
const k = (a, b) => tex(over(a, b));
const fr = (a, b) => `\\dfrac{${a}}{${b}}`;

/** The nested figure of the map: AM = 35, AB = 42, AN = 55, AC = 66, MN = 65, BC = 78 (k = 5/6). */
const N = FIGURES.nested[0];
const MB = write(minus(N.VB, N.VM));
/** The butterfly of the map: OA = 20, OC = 32, OB = 35, OD = 56, AB = 45, CD = 72 (k = 5/8). */
const B = FIGURES.butterfly[0];
/** The copy of the map: ABC with AB = 32 and BC = 44, AMN with AM = 20 and MN = 27,5 (k = 5/8). */
const S = FIGURES.scale[0];
/** The inverted ratio's length: AB × BC / AM, longer than BC. */
const INVERTED = write(over(times(N.VB, N.BC), N.VM));

export const KNOWLEDGE_GRAPH = {
  root: 'talis',
  nodes: [
    {
      id: 'talis',
      kind: 'concept',
      lane: 'center',
      requires: K1,
      title: 'وضعية طالس',
      subtitle: '$(MN) \\parallel (BC)$',
      context: {
        text: 'مثلث $ABC$، النقطة $M$ من $[AB]$ والنقطة $N$ من $[AC]$، والمستقيم $(MN)$ يوازي $(BC)$: المثلثان $AMN$ و $ABC$ في وضعية طالس.',
      },
      reveals: ['tasaluib', 'nisab', 'qitaa'],
    },
    {
      id: 'tasaluib',
      kind: 'prerequisite',
      lane: 'end',
      requires: K1,
      title: 'الجداء المتصالب',
      subtitle: '$\\dfrac{a}{b} = \\dfrac{c}{d}$',
      context: {
        text: `$\\dfrac{a}{b} = \\dfrac{c}{d}$ يعني $a \\times d = b \\times c$: $${fr(N.VM, N.VB)} = ${fr(N.VN, N.VC)}$ لأنّ $${N.VM} \\times ${N.VC} = ${N.VB} \\times ${N.VN}$.`,
      },
      reveals: [],
    },
    {
      id: 'nisab',
      kind: 'definition',
      lane: 'center',
      requires: K1,
      notebook: true,
      title: 'النسب الثلاث',
      subtitle: `$${fr(N.VM, N.VB)} = ${fr(N.VN, N.VC)} = ${fr(N.MN, N.BC)}$`,
      reveals: ['hisab', 'farasha'],
    },
    {
      id: 'qitaa',
      kind: 'common_mistake',
      lane: 'start',
      requires: K1,
      title: 'القطعة بدل الضلع',
      subtitle: '$\\dfrac{AM}{MB}$',
      context: {
        parts: [
          { role: 'wrong', text: '$\\dfrac{AM}{MB} = \\dfrac{MN}{BC}$' },
          {
            role: 'why',
            text: `$${fr(N.VM, MB)} = ${write(over(N.VM, MB))}$ و $${fr(N.MN, N.BC)} = ${k(N.MN, N.BC)}$: الطول $MB$ قطعة، والضلع من الرأس هو $AB$ ، و $${N.VM} + ${MB} = ${N.VB}$.`,
          },
          { role: 'right', text: `$${fr(N.VM, N.VB)} = ${fr(N.MN, N.BC)} = ${k(N.VM, N.VB)}$` },
        ],
      },
      reveals: [],
    },
    {
      id: 'hisab',
      kind: 'method',
      lane: 'end',
      requires: K2,
      notebook: true,
      title: 'حساب طول مجهول',
      subtitle: '$MN = \\dfrac{AM \\times BC}{AB}$',
      reveals: ['tajmi', 'maqluba'],
    },
    {
      id: 'farasha',
      kind: 'definition',
      lane: 'start',
      requires: K3,
      notebook: true,
      title: 'وضعية الفراشة',
      subtitle: '$\\dfrac{OA}{OC} = \\dfrac{OB}{OD} = \\dfrac{AB}{CD}$',
      reveals: ['farasha-hisab'],
    },
    {
      id: 'tajmi',
      kind: 'method',
      lane: 'end',
      requires: K2,
      title: 'ضلع من قطعتين',
      subtitle: '$AB = AM + MB$',
      context: {
        text: `$AM = ${N.VM}$ و $MB = ${MB}$: الضلع من الرأس $${N.VM} + ${MB} = ${N.VB}$، ثمّ $${fr(N.VM, N.VB)} = ${fr(N.VN, 'AC')}$ يعطي $AC = ${N.VC}$.`,
      },
      reveals: ['muamil'],
    },
    {
      id: 'maqluba',
      kind: 'common_mistake',
      lane: 'center',
      requires: K2,
      title: 'النسبة المقلوبة',
      subtitle: '$\\dfrac{AB}{AM}$',
      context: {
        parts: [
          { role: 'wrong', text: '$MN = \\dfrac{AB \\times BC}{AM}$' },
          {
            role: 'why',
            text: `$\\dfrac{${N.VB} \\times ${N.BC}}{${N.VM}} = ${tex(INVERTED)}$، أطول من $BC = ${N.BC}$، والنقطة $M$ بين $A$ و $B$: الطول $MN$ أقصر من $BC$.`,
          },
          { role: 'right', text: `$\\dfrac{${N.VM} \\times ${N.BC}}{${N.VB}} = ${N.MN}$` },
        ],
      },
      reveals: [],
    },
    {
      id: 'farasha-hisab',
      kind: 'example',
      lane: 'start',
      requires: K3,
      title: 'حساب في الفراشة',
      subtitle: `$OD = ${B.VC}$`,
      context: {
        list: [
          `$OA = ${B.VM}$ و $OC = ${B.VB}$ و $OB = ${B.VN}$`,
          `$${fr(B.VM, B.VB)} = ${fr(B.VN, 'OD')}$`,
          `$\\dfrac{${B.VB} \\times ${B.VN}}{${B.VM}} = ${B.VC}$`,
        ],
        note: `المجموع $${B.VM} + ${B.VB} = ${Number(B.VM) + Number(B.VB)}$ طول $[AC]$، وليس ضلعًا في أحد المثلثين.`,
      },
      reveals: ['takbir'],
    },
    {
      id: 'muamil',
      kind: 'definition',
      lane: 'end',
      requires: K4,
      notebook: true,
      title: 'معامل التناسبية',
      subtitle: '$k = \\dfrac{AM}{AB}$',
      reveals: ['khulasa'],
    },
    {
      id: 'takbir',
      kind: 'example',
      lane: 'start',
      requires: K4,
      title: 'تكبير أم تصغير',
      subtitle: `$k = ${k(S.VM, S.VB)}$`,
      context: {
        list: [
          `من $ABC$ إلى $AMN$: $${fr(S.VM, S.VB)} = ${k(S.VM, S.VB)}$، أصغر من 1: تصغير.`,
          `من $AMN$ إلى $ABC$: $${fr(S.VB, S.VM)} = ${k(S.VB, S.VM)}$، أكبر من 1: تكبير.`,
        ],
        note: `$${S.BC} \\times ${k(S.VM, S.VB)} = ${tex(S.MN)}$: الطول $MN$ صورة $BC$.`,
      },
      reveals: ['khulasa'],
    },
    {
      id: 'khulasa',
      kind: 'takeaway',
      lane: 'center',
      requires: K4,
      title: 'خلاصة الدرس',
      subtitle: 'ثلاث نسب متساوية',
      context: {
        text: 'في وضعية طالس وفي وضعية الفراشة: كلّ طول من الرأس على موافقه من الرأس، والضلع الموازي على الضلع الموازي — ثلاث نسب متساوية، قيمتها المشتركة معامل التناسبية $k$.',
      },
      reveals: [],
    },
  ],
  edges: [
    { from: 'talis', to: 'tasaluib', label: 'تذكّر' },
    { from: 'talis', to: 'nisab', label: 'التوازي' },
    { from: 'talis', to: 'qitaa', label: 'خطأ شائع' },
    { from: 'nisab', to: 'hisab', label: 'طول مجهول' },
    { from: 'nisab', to: 'farasha', label: 'الضفّة الأخرى' },
    { from: 'hisab', to: 'tajmi', label: 'قطعتان' },
    { from: 'hisab', to: 'maqluba', label: 'خطأ شائع' },
    { from: 'farasha', to: 'farasha-hisab', label: 'مثال' },
    { from: 'tajmi', to: 'muamil', label: 'عدد واحد' },
    { from: 'farasha-hisab', to: 'takbir', label: 'النسخة' },
    { from: 'muamil', to: 'khulasa', label: 'نستخلص' },
    { from: 'takbir', to: 'khulasa', label: 'نستخلص' },
  ],
};

/** The memo sheets of the four keys, one module each, in the order of the keys. */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: K1,
        type: 'regles',
        title: 'وضعية طالس',
        summary:
          'إذا قطع مستقيم موازٍ لضلع في مثلث الضلعين الآخرين، فإنّ النسب الثلاث متساوية: كلّ طول من الرأس على الضلع كلّه، والضلع الموازي على الضلع الموازي.',
        memo: {
          rule: `(MN)\\parallel(BC)\\ \\Rightarrow\\ \\dfrac{AM}{${R('AB')}}=\\dfrac{AN}{${R('AC')}}=\\dfrac{MN}{BC}`,
          hook: 'كلّ طول من الرأس على الضلع كلّه، لا على القطعة',
          example: `${fr(N.VM, N.VB)}=${fr(N.VN, N.VC)}=${fr(N.MN, N.BC)}=${R(k(N.VM, N.VB))}`,
          trap: `القطعة ليست الضلع: ${ltr('AB = AM + MB')}، والنسبة على ${ltr('AB')} لا على ${ltr('MB')}.`,
          exam: 'أتحقّق من التوازي، ثمّ أكتب النسب الثلاث: الأطوال من الرأس في البسط، والأضلاع كاملةً في المقام.',
          chip: '\\dfrac{AM}{AB}=\\dfrac{AN}{AC}=\\dfrac{MN}{BC}',
          quiz: [
            {
              q: 'في وضعية طالس مع $(MN) \\parallel (BC)$ ، النسبة التي تساوي $\\dfrac{AM}{AB}$ هي:',
              options: ['$\\dfrac{AN}{AC}$', '$\\dfrac{AN}{NC}$', '$\\dfrac{AC}{AN}$'],
              correct: 0,
            },
            {
              q: `$AM = ${FIGURES.nested[1].VM}$ و $MB = 3$ و $(MN) \\parallel (BC)$ . النسبة $\\dfrac{AM}{AB}$ تساوي:`,
              options: ['$\\dfrac{6}{7}$', '$6$', '$\\dfrac{1}{7}$'],
              correct: 0,
            },
          ],
        },
      },
    ],
    2: [
      {
        id: K2,
        type: 'regles',
        title: 'حساب طول مجهول',
        summary:
          'من النسب الثلاث آخذ النسبتين اللتين فيهما المجهول وثلاثة أطوال معلومة، وأحسب بالجداء المتصالب. إذا أُعطي الضلع قطعتين جمعتهما أوّلًا.',
        memo: {
          rule: `\\dfrac{AM}{AB}=\\dfrac{MN}{BC}\\ \\Rightarrow\\ MN=${R('\\dfrac{AM\\times BC}{AB}')}`,
          hook: 'نسبتان فقط: واحدة فيها المجهول، وأخرى كلّها معلومة',
          example: `MN=\\dfrac{${N.VM}\\times${N.BC}}{${N.VB}}=${R(N.MN)}`,
          trap: `لا تقلب النسبة: ${ltr(`${N.VB} × ${N.BC} ÷ ${N.VM} = ${INVERTED}`)} أطول من ${ltr(`BC = ${N.BC}`)}.`,
          exam: 'أكتب النسب الثلاث، أعوّض بالأطوال المعلومة، ثمّ أحسب الطول المجهول بالجداء المتصالب وأكتب الوحدة.',
          chip: 'x=\\dfrac{b\\times c}{a}',
          quiz: [
            {
              q: '$\\dfrac{16}{36} = \\dfrac{40}{BC}$ ، إذن $BC$ يساوي:',
              options: ['$90$', '$\\dfrac{160}{9}$', '$60$'],
              correct: 0,
            },
            {
              q: '$AM = 16$ و $MB = 20$ و $AN = 28$ و $(MN) \\parallel (BC)$ . الطول $AC$ يساوي:',
              options: ['$63$', '$35$', '$\\dfrac{112}{5}$'],
              correct: 0,
            },
          ],
        },
      },
    ],
    3: [
      {
        id: K3,
        type: 'regles',
        title: 'وضعية الفراشة',
        summary:
          'مستقيمان متقاطعان في نقطة يقطعهما مستقيمان متوازيان على جهتي النقطة: النسب الثلاث متساوية كما في وضعية طالس، ونصف دورة حول نقطة التقاطع تعيدها إليها.',
        memo: {
          rule: `(AB)\\parallel(CD)\\ \\Rightarrow\\ \\dfrac{OA}{${R('OC')}}=\\dfrac{OB}{${R('OD')}}=\\dfrac{AB}{CD}`,
          hook: 'الشريكان على مستقيم واحد يمرّ بنقطة التقاطع',
          example: `${fr(B.VM, B.VB)}=${fr(B.VN, B.VC)}=${fr(B.MN, B.BC)}=${R(k(B.VM, B.VB))}`,
          trap: `${ltr('AC = OA + OC')} ليس ضلعًا في أحد المثلثين: الأطوال تُقاس من نقطة التقاطع.`,
          exam: 'أبيّن أنّ النقط على استقامة وأنّ المستقيمين متوازيان، ثمّ أكتب النسب الثلاث من نقطة التقاطع.',
          chip: '\\dfrac{OA}{OC}=\\dfrac{OB}{OD}',
          quiz: [
            {
              q: '$(AB) \\parallel (CD)$ و $O$ نقطة تقاطع $(AC)$ و $(BD)$ . النسبة التي تساوي $\\dfrac{OA}{OC}$ هي:',
              options: ['$\\dfrac{OB}{OD}$', '$\\dfrac{OD}{OB}$', '$\\dfrac{OB}{BD}$'],
              correct: 0,
            },
            {
              q: '$OA = 42$ و $OC = 49$ و $OB = 78$ و $(AB) \\parallel (CD)$ . الطول $OD$ يساوي:',
              options: ['$91$', '$\\dfrac{468}{7}$', '$127$'],
              correct: 0,
            },
          ],
        },
      },
    ],
    4: [
      {
        id: K4,
        type: 'regles',
        title: 'معامل التناسبية',
        summary:
          'في وضعية طالس يُضرب كلّ طول من المثلث الأوّل في عدد واحد فنحصل على موافقه في الثاني، والمحيط كذلك: أكبر من 1 تكبير، وأصغر من 1 تصغير، ومن الثاني إلى الأوّل نقلبه.',
        memo: {
          rule: `MN=${R('k')}\\times BC\\qquad k'=${R('\\dfrac{1}{k}')}`,
          hook: 'أكبر من 1 تكبير، وأصغر من 1 تصغير',
          example: `k=${fr(S.VM, S.VB)}=${R(k(S.VM, S.VB))}\\qquad MN=${k(S.VM, S.VB)}\\times${S.BC}=${tex(S.MN)}`,
          trap: `المعامل يُضرب في الطول ولا يُضاف إليه، ومن الثاني إلى الأوّل يُقلب: ${ltr("k × k' = 1")}.`,
          exam: 'أحسب المعامل بقسمة طول من المثلث الثاني على موافقه من الأوّل، أقارنه بالعدد 1، ثمّ أضرب فيه الأطوال الأخرى.',
          chip: `k=${k(S.VM, S.VB)}<1`,
          quiz: [
            {
              q: '$k = \\dfrac{7}{6}$ من المثلث (1) إلى المثلث (2). المثلث (2):',
              options: ['تكبير للمثلث (1)', 'تصغير للمثلث (1)', 'يطابق المثلث (1)'],
              correct: 0,
            },
            {
              q: '$k = \\dfrac{6}{7}$ من $ABC$ إلى $AMN$ ، و $BC = 77$ . الطول $MN$ يساوي:',
              options: ['$66$', '$\\dfrac{539}{6}$', '$\\dfrac{545}{7}$'],
              correct: 0,
            },
          ],
        },
      },
    ],
  },
};

/**
 * Where each card sits on the MAP (percent of the map box, drawn left to right; the « start » lane is on the RIGHT) —
 * lesson 1's grid, as `natiqa-ghayr-natiqa`'s: columns at 17 / 50 / 83, rows 17–18 apart, so that every link label (at
 * the middle of its link) stays 8.5–9 % from the rows above and below.
 */
const POSITIONS = {
  talis: [50, 5],
  tasaluib: [17, 23],
  nisab: [50, 23],
  qitaa: [83, 23],
  hisab: [17, 41],
  farasha: [83, 41],
  tajmi: [17, 59],
  maqluba: [50, 59],
  'farasha-hisab': [83, 59],
  muamil: [17, 76],
  takbir: [83, 76],
  khulasa: [50, 93],
};

export const KNOWLEDGE = { graph: KNOWLEDGE_GRAPH, modules: LESSON_KNOWLEDGE.modules, positions: POSITIONS };
