/**
 * « مذكّرة الدرس » WRITTEN for this lesson (CLASS_SESSION.md §2quater) — the model and its parts:
 * `features/classSession/lessonMemos.js`. Every number is checked by a test (`board.test.js`). Own wording: nothing is
 * quoted from the textbook, no line of the exercise bank. Reached only through the lesson's pack (`lesson.pack.js ›
 * board.memo`). The board's figures are read from `script.js › BOARD` (one place). Fields drawn as plain text by
 * `BoardMemo.jsx` (goal, idea, trap, can, stands, the openings, the phases, the sequence, next) hold no formula; the
 * others may. ONE NUMBER A LINE where a line is data; a sentence is built from them.
 *
 * KNOWN, REPORTED: `MemoFigures.jsx` draws no geometry figure (its kinds are bridge, teams, shelves, tiles, court), so the
 * openings of kind `thales` are described in words only, until a figure kind exists.
 */
import { minus, over, plus, read, tex, times, write } from '../../../../../../common/gameworld/kit/exact';
import { counted } from '../../../../../../common/gameworld/kit/authoring/numbers';
import { BOARD } from './script';

const { park: P, roof: R, streets: S, yard: Y } = BOARD;
const F = (p, q) => `\\dfrac{${p}}{${q}}`;
const frac = (x) => {
  const r = read(x);
  return r.d === 1n ? `${r.n}` : F(r.n, r.d);
};
const w = (x) => write(x);
/** Metres agreed with their number (« 10 أمتار », « 15 مترًا ») — never glued by hand (defects.md B11). */
const METRES = ['متر واحد', 'متران', 'أمتار', 'مترًا', 'متر'];
const m = (x) => counted(Number(x), METRES);

/** The park of the board, computed: the walkway MN, the piece MB, the wrong length the piece gives. */
const pk = { MB: w(minus(P.AB, P.AM)), MN: w(over(times(P.BC, P.AM), P.AB)) };
pk.piece = w(over(times(P.BC, P.AM), pk.MB));
/** The roof: AE and the beam. */
const rf = { AE: w(minus(R.AB, R.BE)) };
rf.EF = w(over(times(R.BC, rf.AE), R.AB));
/** The streets: OD, and the crossed partner's wrong value. */
const st = { OD: w(over(times(S.OB, S.OC), S.OA)) };
/** The yard: k and the perimeters. */
const yk = over(Y.AM, Y.AB);
const yd = { P1: w(plus(plus(Y.AB, Y.AC), Y.BC)) };
yd.P2 = w(times(yd.P1, yk));

/** The two openings the board does not play: a tent's guy rope over a stick, two streets crossing at a square. */
const TENT = {
  AB: '65',
  AM: '15',
  MN: '6',
};
const CROSS = {
  OA: '10',
  OC: '26',
  OB: '15',
};

/** The opening situations a teacher may choose from. A `thales` opening is not drawn yet (no memo figure kind). */
const OPENINGS = [
  {
    id: 'park',
    kind: 'thales',
    board: true,
    title: 'ممرّ في الحديقة',
    story: `حديقة عمومية على شكل مثلّث أضلاعه ${m(P.AB)} و ${m(P.AC)} و ${m(P.BC)}، يُشقّ فيها ممرّ مستقيم يوازي الضلع الذي طوله ${m(P.BC)}، ويبدأ على بعد ${m(P.AM)} من الرأس.`,
    ask: 'كم طول الممرّ؟ وكيف نعرفه دون أن نقيسه؟',
    why: 'هي وضعية «الدرس على السبّورة»: الأداة التي يعرفها التلميذ من السنة الثالثة، والفخّ الأكبر في التمارين، القسمة على القطعة.',
    expect: `يحسب بعضهم بالنسبة الصحيحة فيجد ${pk.MN}، ويقسم آخرون على القطعة الباقية ${pk.MB} فيجدون ${pk.piece}، أطول من الضلع نفسه.`,
  },
  {
    id: 'tent',
    kind: 'thales',
    board: false,
    title: 'حبل الخيمة',
    story: `حبل مشدود من رأس عمود خيمة إلى وتد في الأرض يبعد ${TENT.AB} دسم عن أسفل العمود. على بعد ${TENT.AM} دسم من الوتد، عصا شاقولية طولها ${TENT.MN} دسم تلمس الحبل.`,
    ask: 'كم ارتفاع عمود الخيمة؟',
    why: 'تبيّن أنّ العصا والعمود متوازيان لأنّهما شاقوليان: الشرط في الوضعية قبل الحساب.',
    expect: 'يطرح بعضهم الأطوال أو يجمعها؛ ويسأل أحدهم لماذا تتناسب، فيُذكر التوازي.',
  },
  {
    id: 'cross',
    kind: 'thales',
    board: false,
    title: 'شارعان يتقاطعان',
    story: `شارعان مستقيمان يتقاطعان في ساحة، ويقطعهما نهجان متوازيان، أحدهما من كلّ جهة. من الساحة إلى النهج الأوّل ${m(CROSS.OA)} و ${m(CROSS.OB)} على الشارعين، وإلى النهج الثاني ${m(CROSS.OC)} على الشارع الأوّل.`,
    ask: 'كم مترًا من الساحة إلى النهج الثاني على الشارع الآخر؟',
    why: 'تفتح وضعية الفراشة: الشريك على المستقيم نفسه في الجهة الأخرى.',
    expect: 'يقرن بعضهم الطول بطول على الشارع الآخر؛ ويجد آخرون العدد الذي يحوّل كلّ طول إلى مقابله.',
  },
];

export const MEMO = {
  title: 'خاصية طالس وحساب الأطوال',
  // ── the one page for the desk ──
  glance: {
    goal: 'في نهاية الحصّة يتعرّف التلميذ على وضعية طالس في أيّ وضع وبأيّ حروف، ويكتب نسبها الثلاث المتساوية، ويحسب طولًا مجهولًا ولو كانت المعطيات قطعًا، ويستعمل وضعية الفراشة، ويحدّد معامل التناسبية واتّجاهه.',
    idea: 'حين يوازي مستقيم ضلعًا، كلّ طول من الرأس يقابل الضلع كلّه، والضلع الموازي يقابل الضلع الموازي. والنقط في الجهة الأخرى من نقطة التقاطع تعطي النسب نفسها. وعدد واحد يحوّل كلّ طول من المثلّث إلى مقابله.',
    trap: 'أن يقسم التلميذ على القطعة بدل الضلع كلّه، أو يقلب إحدى النسب، أو يقرن في الفراشة طولًا بغير شريكه، أو يطرح بدل أن يضرب، أو يستعمل المعامل نفسه في الاتّجاهين.',
    minutes: [
      { moment: 'start', label: 'اختبار البداية', min: 7 },
      { moment: 'revise', label: 'مراجعة القواعد', min: 5 },
      { moment: 'lesson', label: 'الدرس على السبّورة', min: 25 },
      { moment: 'end', label: 'اختبار النهاية', min: 8 },
    ],
    three: [
      `لماذا طول الممرّ $MN = ${F(`${P.BC} \\times ${P.AM}`, P.AB)} = ${pk.MN}$، لا $${F(`${P.BC} \\times ${P.AM}`, pk.MB)} = ${pk.piece}$؟`,
      `لماذا نحسب $AE = ${R.AB} - ${R.BE} = ${rf.AE}$ قبل أن نكتب النسبتين في هيكل السقف؟`,
      `لماذا يكون شريك $OB$ هو $OD$ في الشارعين، فيكون $OD = ${F(`${S.OB} \\times ${S.OC}`, S.OA)} = ${st.OD}$؟`,
    ],
  },
  // ── goal and success criteria: what can be SEEN or HEARD ──
  criteria: [
    {
      can: 'يتعرّف على وضعية طالس بشرطها، المستقيمين المتوازيين، ويكتب النسب الثلاث المتساوية بأيّ حروف.',
      see: 'في المثلث $PQR$ مع $(ST) \\parallel (QR)$ يكتب $\\dfrac{PS}{PQ} = \\dfrac{PT}{PR} = \\dfrac{ST}{QR}$.',
    },
    {
      can: 'يحسب طولًا مجهولًا بالرابع المتناسب، ويعيد بناء الضلع كلّه حين تُعطى قطعة منه.',
      see: `يكتب $AE = ${R.AB} - ${R.BE} = ${rf.AE}$ ثمّ $EF = ${F(`${R.BC} \\times ${rf.AE}`, R.AB)} = ${rf.EF}$.`,
    },
    {
      can: 'يتعرّف على وضعية الفراشة ويقرن كلّ طول من نقطة التقاطع بشريكه على المستقيم نفسه.',
      see: `يكتب $\\dfrac{OD}{OB} = \\dfrac{OC}{OA}$ ثمّ $OD = ${F(`${S.OB} \\times ${S.OC}`, S.OA)} = ${st.OD}$.`,
    },
    {
      can: 'يحدّد معامل التناسبية، ويقرأ أحد المثلّثين تكبيرًا أو تصغيرًا للآخر، ويقلب المعامل في الاتّجاه المعاكس.',
      see: `يكتب $k = ${F(Y.AM, Y.AB)} = ${frac(yk)}$، تصغير، ومحيط الركن $${tex(yd.P1)} \\times ${frac(yk)} = ${tex(yd.P2)}$.`,
    },
  ],
  stands:
    'تناسبية أطوال المثلّثين المعيّنين بمستقيمين متوازيين من السنة الثالثة، والرابع المتناسب والجداء المتصالب، والعمليات على الأعداد الناطقة.',
  // ── several opening situations ──
  openings: OPENINGS,
  // ── the hour, as « حصّة القسم » runs it: launch → explore → summarize ──
  phases: [
    {
      moment: 'start',
      name: 'اختبار البداية',
      min: 7,
      aim: 'أين القسم قبل الدرس؟',
      teacher: 'يُعطي الفأرة للتلميذ الذي حان دوره، ولا يصحّح بعد.',
      class: 'كلّ تلميذ يجيب باسمه؛ الفِرق تجمع نقاطها.',
      watch: 'الرابع المتناسب ونسب السنة الثالثة: إن تعثّر نصف القسم فيهما، أطل المراجعة.',
    },
    {
      moment: 'revise',
      name: 'مراجعة القواعد',
      min: 5,
      aim: 'نستحضر ما سنحتاجه.',
      teacher: 'يختار قارئًا أو يقرأ هو؛ يطلب مثالًا قبل أن يُظهر المثال.',
      class: 'يقرؤون القاعدة ويعطون مثالًا من عندهم.',
      watch: 'الجداء المتصالب: أيّ عددين نضرب، وعلى أيّ عدد نقسم.',
    },
    {
      moment: 'lesson',
      name: 'الدرس على السبّورة',
      min: 25,
      aim: 'القسم يقترح طولًا على كلّ شكل، ثمّ يبرّره بالنسب، وبعد ذلك فقط يأخذ كلّ مفتاح اسمه.',
      teacher: 'يسأل قبل كلّ تحقّق: «من يقترح طولًا؟ ولماذا؟»؛ لا يعطي الخاصية؛ يطلب أن يُقرأ كلّ طول مع شريكه.',
      class: 'يقترحون أطوالًا ويقرنون كلّ طول بشريكه، ثمّ يرون أيّ اقتراح يوافق؛ وبعد ذلك فقط يأخذ المفتاح اسمه.',
      watch: 'من يقسم على القطعة الباقية: اطلب منه أن يقرأ الطول من الرأس إلى آخر الضلع.',
    },
    {
      moment: 'end',
      name: 'اختبار النهاية',
      min: 8,
      aim: 'ماذا غيّرت الحصّة؟',
      teacher: 'يقارن «في بداية الحصّة / الآن»، ويسمّي من استدرك.',
      class: 'يجيبون عن أسئلة الدرس الجديد.',
      watch: 'الكفاءة التي بقيت ضعيفة تصير واجب الغد.',
    },
  ],
  // ── what students will likely say or do, and the question for each ──
  anticipated: [
    {
      kind: 'right',
      says: `«$\\dfrac{AM}{AB} = \\dfrac{MN}{BC}$، إذن $MN = ${F(`${P.BC} \\times ${P.AM}`, P.AB)} = ${pk.MN}$».`,
      assess: 'لماذا يحقّ لك أن تكتب هذه المساواة؟ ماذا يجب أن يكون في الشكل؟',
      advance: 'ولو أعطيناك القطعة الباقية بدل الضلع كلّه: ماذا تحسب أوّلًا؟',
    },
    {
      kind: 'right',
      says: `«$k = ${F(Y.AM, Y.AB)} = ${frac(yk)}$، فمحيط الركن $${tex(yd.P1)} \\times ${frac(yk)} = ${tex(yd.P2)}$».`,
      assess: 'لماذا يُضرب المحيط في العدد نفسه الذي ضُربت فيه الأضلاع؟',
      advance: 'ومن الركن إلى الساحة: في أيّ عدد نضرب؟',
    },
    {
      kind: 'miss',
      says: `«$MN = ${F(`${P.BC} \\times ${P.AM}`, pk.MB)} = ${pk.piece}$».`,
      assess: 'هل يمكن أن يكون الممرّ أطول من الضلع الذي يوازيه؟',
      advance: 'اقرأ الطول من الرأس: إلى أين ينتهي الضلع الذي يقابل الممرّ؟',
    },
    {
      kind: 'miss',
      says: `«$EF = ${R.BC} - ${R.BE}$، طرحنا القطعة من العارضة».`,
      assess: 'لو كانت العارضة قريبة جدًّا من القمّة، هل يبقى طولها كبيرًا هكذا؟',
      advance: 'أيّ نسبتين متساويتين تربطان العارضة بعارضة الأرضية؟',
    },
    {
      kind: 'miss',
      says: '«شريك $OB$ هو $OC$ لأنّهما في الجهة نفسها».',
      assess: 'على أيّ مستقيم تقع $B$ و $D$؟ وأين تقع $C$؟',
      advance: 'أدر المثلّث الصغير نصف دورة حول $O$: على أيّ نقطة تقع $B$؟',
    },
    {
      kind: 'miss',
      says: `«من الركن إلى الساحة نضرب أيضًا في $${frac(yk)}$».`,
      assess: 'هل تكون الساحة إذن أصغر من الركن؟',
      advance: 'بأيّ عدد نضرب لنرجع ما صغّرناه؟',
    },
  ],
  // ── which answers go on the board, in what order, and the link between them ──
  sequence: [
    'أوّلًا ممرّ يوازي ضلع الحديقة: الطول من الرأس يقابل الضلع كلّه، والقسمة على القطعة تعطي ممرًّا أطول من الضلع.',
    'ثمّ ممرّ ثانٍ: نهايته حيث تتساوى النسبتان، لا حيث تتساوى المسافتان.',
    'نسمّي: خاصية طالس ووضعية طالس.',
    'ثمّ السقف والحامل: قطعة نطرحها أو نضيفها لنجد الضلع كلّه، ثمّ الرابع المتناسب.',
    'نسمّي: الرابع المتناسب والجداء المتصالب.',
    'ثمّ الشارعان عند الدوّار: الشريك على المستقيم نفسه من الجهة الأخرى؛ نسمّي وضعية الفراشة.',
    'أخيرًا الساحة وركنها المدهون: عدد واحد لكلّ الأطوال وللمحيط، ومقلوبه في الاتّجاه المعاكس؛ نسمّي معامل التناسبية.',
  ],
  connect: `في المثلث $ABC$، إذا كانت $M$ من $(AB)$ و $N$ من $(AC)$ و $(MN) \\parallel (BC)$، فإنّ $\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}$، سواء كانت النقطتان على الضلعين أو في الجهة الأخرى من الرأس. في الحديقة: $${F(P.AM, P.AB)} = ${frac(over(P.AM, P.AB))}$ هو العدد الذي يحوّل كلّ طول من $ABC$ إلى مقابله في $AMN$.`,
  // ── what is written, the short check, support and extension ──
  written: [
    `$(MN) \\parallel (BC)$ إذن $\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}$، ومنه $MN = ${F(`${P.BC} \\times ${P.AM}`, P.AB)} = ${pk.MN}$.`,
    `$AE = ${R.AB} - ${R.BE} = ${rf.AE}$ و $EF = ${F(`${R.BC} \\times ${rf.AE}`, R.AB)} = ${rf.EF}$.`,
    `$(AB) \\parallel (CD)$ إذن $\\dfrac{OC}{OA} = \\dfrac{OD}{OB} = \\dfrac{CD}{AB}$، ومنه $OD = ${F(`${S.OB} \\times ${S.OC}`, S.OA)} = ${st.OD}$.`,
    `$k = ${F(Y.AM, Y.AB)} = ${frac(yk)} < 1$: تصغير؛ ومن $AMN$ إلى $ABC$ المعامل $${F(read(yk).d, read(yk).n)}$.`,
  ],
  exit: [
    {
      q: 'في المثلث $ABC$، $M$ من $[AB]$ و $N$ من $[AC]$ و $(MN) \\parallel (BC)$، مع $AM = 9$ و $MB = 15$ و $BC = 32$. احسب $MN$.',
      a: '$AB = 9 + 15 = 24$، إذن $MN = \\dfrac{32 \\times 9}{24} = 12$.',
    },
    {
      q: 'النقط $E$ و $O$ و $G$ على استقامة، والنقط $F$ و $O$ و $H$ على استقامة، و $(EF) \\parallel (GH)$، مع $OE = 8$ و $OG = 26$ و $EF = 12$. احسب $GH$.',
      a: '$\\dfrac{GH}{EF} = \\dfrac{OG}{OE}$، إذن $GH = \\dfrac{12 \\times 26}{8} = 39$.',
    },
    {
      q: 'معامل التناسبية الذي يحوّل المثلث $ABC$ إلى المثلث $AMN$ هو $\\dfrac{13}{6}$. هل $AMN$ تكبير أم تصغير؟ وما المعامل من $AMN$ إلى $ABC$؟',
      a: '$\\dfrac{13}{6} > 1$: تكبير؛ والمعامل من $AMN$ إلى $ABC$ هو $\\dfrac{6}{13}$.',
    },
  ],
  support: [
    'لوّن كلّ طول وشريكه باللون نفسه قبل أن تكتب النسب.',
    'اقرأ كلّ طول من الرأس: إن أُعطيت قطعة، اجمعها أو اطرحها لتجد الطول من الرأس.',
    'في الجداء المتصالب: اضرب العددين المتقابلين، ثمّ اقسم على الثالث.',
  ],
  extend: [
    `في الحديقة، أين يبدأ ممرّ موازٍ طوله $${tex(times(P.BC, '0,5'))}$؟`,
    `هل يمكن لممرّ موازٍ لـ $(BC)$ في الحديقة أن يكون أطول من $${P.BC}$ م؟ لماذا؟`,
    'مثلّث أضلاعه $10$ و $22$ و $26$: جد معاملًا يجعل أضلاع صورته أعدادًا طبيعية وأحدها $15$.',
  ],
  extendCheck: { sides: ['10', '22', '26'], one: '15' },
  next: 'الحصّة القادمة: «الخاصية العكسية لخاصية طالس» — متى تقول النسب المتساوية إنّ المستقيمين متوازيان؟',
};
