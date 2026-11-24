/**
 * « الدرس على السبّورة » of this lesson — the STEPS the class goes through together (CLASS_SESSION.md §5ter).
 * The kinds of step and what the board does with each: `features/classSession/lessonScripts.js`.
 * Reached only through the lesson's pack (`lesson.pack.js › board.script`).
 *
 * The hour is on figures of the class's own, never the student's Nile (PYRAMIDS_WORLD_PLAN.md §3.9): a park and its
 * walkway, a roof truss, a painter's easel, two streets crossing at a roundabout, a school yard and its painted corner.
 * Each key is PROVED on its figure before its tablet names it (the student's own wording, `world/tablets.js`):
 *   🔑  a walkway parallel to a side: the length from the vertex goes over the WHOLE side (the piece gives a wrong
 *       length); where must its end stand so that it stays parallel — not where the end is as far as the start;
 *   📐  a beam of a roof marked from the bottom corner (the side less the piece), then an easel's feet from a bar marked
 *       from the top (the piece added back): two ratios, then the cross product;
 *   🦋  two streets crossing at a roundabout, cut by two parallel streets: the partner of a length from the meeting
 *       point is on the SAME line through it, on the other side;
 *   🔍  every length of the yard × one number gives the painted corner — its perimeter too; and from the corner back
 *       to the yard the number is turned upside down.
 *
 * KNOWN, REPORTED (no figure station exists): the board kit has no station that draws a geometry figure. Each question
 * is an `ask` whose figure is described in words and in formulas; its choices are lengths (`words`), and `a` is the
 * right length, so that the card the board draws as « filling » is exactly the answer (`lessonScripts.js › fills`) —
 * but the board still draws a plank bridge and « a = b × q + r » under each card. A `figure` station is to be built
 * before this board is shown to a class.
 *
 * The numbers are the board's own — none of the student's world (§3.8), none of the exercise bank, none of another
 * lesson's story (scripts/lesson-bank-numbers.mjs) — and `board.test.js` computes all of them. ONE NUMBER A LINE: a line
 * of this file never holds two of the hour's numbers; every length, option and proof is computed (`kit/exact.js`).
 * Nothing before a naming says its key's name (tested). A `cue` is at most 70 characters.
 */
import { minus, over, plus, read, tex, times, write } from '../../../../../../common/gameworld/kit/exact';

/**
 * The keys of the lesson, in the order of the story — 🔑 📐 🦋 🔍 (PYRAMIDS_WORLD_PLAN.md §3.3–§3.6). The world's
 * `world/journey.js › KEYS` must be this list (tested in `board.test.js` once the world is written).
 */
export const KEYS = ['wadiyat-talis', 'hisab-tul', 'wadiyat-al-farasha', 'muamil-k'];
const [K1, K2, K3, K4] = KEYS;

/** The board's numbers, ONE a line; every other length of a station is computed from them below. */
export const BOARD = {
  /** 🔑 a triangular park ABC and a walkway [MN] parallel to (BC) */
  park: {
    AB: '98',
    AC: '133',
    BC: '49',
    AM: '84',
  },
  /** 🔑 a second walkway from P on [AB], to be laid parallel to (BC) */
  path: {
    AP: '42',
  },
  /** 📐 a roof truss: two equal rafters AB = AC, a beam [EF] parallel to the floor beam [BC], marked from the corner B */
  roof: {
    AB: '65',
    BE: '20',
    BC: '117',
  },
  /** 📐 a painter's easel: legs from the top A, a bar [EF] parallel to the floor, marked from the top */
  easel: {
    AE: '17',
    EB: '85',
    EF: '14',
  },
  /** 🦋 two streets crossing at the roundabout O, cut by two parallel streets (AB) and (CD) */
  streets: {
    OA: '12',
    OC: '33',
    OB: '44',
  },
  /** 🔍 a school yard ABC and its painted corner AMN, (MN) parallel to (BC) */
  yard: {
    AB: '78',
    AC: '52',
    BC: '91',
    AM: '12',
  },
  /** 🔍 another yard: every length of the yard × k gives its painted corner; the corner's side MN is measured */
  corner: {
    k: '2/15',
    MN: '30',
  },
};
const { park: P, path: W, roof: R, easel: E, streets: S, yard: Y, corner: C } = BOARD;

/** A number of the board as a JS number (the `ask` cards are whole lengths), and as text. */
const n = (x) => Number(write(x));
const w = (x) => write(x);
/** « $\dfrac{p}{q}$ » of a fraction given as « p/q » or computed, its terms as they are. */
const F = (p, q) => `\\dfrac{${p}}{${q}}`;
const frac = (x) => {
  const r = read(x);
  return r.d === 1n ? `${r.n}` : F(r.n, r.d);
};
/** « a × b ÷ c » written as one fraction, and its value. */
const cross = (a, b, c) => `${F(`${tex(a)} \\times ${tex(b)}`, tex(c))} = ${tex(over(times(a, b), c))}`;
/** The words of a card that is a length (never a plank's « لوح / يثبت / ينهار » — defects.md A10). */
const LENGTH = { card: 'الطول', held: 'يوافق', fell: 'لا يوافق' };
/** The choices of an `ask`, in the order written, and the ones that « fill » `a` (the right length only — tested). */
const ask = (a, options) => ({ a: n(a), options: options.map(n), answer: [n(a)] });

// ── 🔑 the park: the right length, the piece in place of the side, the side less the piece ──
const pk = {
  AN: w(times(P.AC, over(P.AM, P.AB))),
  MN: w(times(P.BC, over(P.AM, P.AB))),
  MB: w(minus(P.AB, P.AM)),
};
const pkPiece = w(over(times(P.BC, P.AM), pk.MB));
const pkDiff = w(minus(P.BC, pk.MB));
// ── 🔑 the walkway from P: where Q stands for (PQ) ∥ (BC); « AQ = AP » and « QC = PB » are not parallel ──
const pa = {
  AQ: w(times(P.AC, over(W.AP, P.AB))),
  PB: w(minus(P.AB, W.AP)),
};
const paSame = W.AP;
const paShift = w(minus(P.AC, pa.PB));
// ── 📐 the roof: AE = AB − BE, EF = BC × AE ÷ AB; the piece BE, and the floor beam less the piece ──
const rf = { AE: w(minus(R.AB, R.BE)) };
rf.EF = w(over(times(R.BC, rf.AE), R.AB));
const rfPiece = w(over(times(R.BC, R.BE), R.AB));
const rfDiff = w(minus(R.BC, R.BE));
// ── 📐 the easel: AB = AE + EB, BC = EF × AB ÷ AE; the piece EB over AE, and EF + EB ──
const es = { AB: w(plus(E.AE, E.EB)) };
es.BC = w(over(times(E.EF, es.AB), E.AE));
const esPiece = w(over(times(E.EF, E.EB), E.AE));
const esSum = w(plus(E.EF, E.EB));
// ── 🦋 the streets: OD = OB × OC ÷ OA; the crossed partner, OB plus the difference, OA + OC ──
const st = { OD: w(over(times(S.OB, S.OC), S.OA)) };
const stCrossed = w(over(times(S.OB, S.OA), S.OC));
const stShift = w(plus(S.OB, minus(S.OC, S.OA)));
const stSum = w(plus(S.OA, S.OC));
// ── 🔍 the yard: k = AM ÷ AB, the corner's perimeter = k × the yard's; one side changed only, or the line round the rest ──
const yk = over(Y.AM, Y.AB);
const yd = {
  AN: w(times(Y.AC, yk)),
  MN: w(times(Y.BC, yk)),
  P1: w(plus(plus(Y.AB, Y.AC), Y.BC)),
};
yd.P2 = w(times(yd.P1, yk));
const ydOne = w(plus(plus(Y.AM, Y.AC), Y.BC));
const ydRest = w(plus(plus(minus(Y.AB, Y.AM), minus(Y.AC, yd.AN)), plus(Y.BC, yd.MN)));
// ── 🔍 the other yard: BC = MN ÷ k; MN × k (the number not turned), MN × the numerator alone ──
const ck = read(C.k);
const co = { BC: w(over(C.MN, C.k)) };
const coTimes = w(times(C.MN, C.k));
const coTop = w(times(C.MN, String(ck.n)));

export const SCRIPT = {
  title: 'خاصية طالس وحساب الأطوال',
  steps: [
    {
      id: 'park',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'ممرّ في الحديقة',
      text: `حديقة عمومية على شكل مثلّث $ABC$: $AB = ${P.AB}$ و $AC = ${P.AC}$ و $BC = ${P.BC}$ (بالمتر). يُشقّ فيها ممرّ مستقيم $[MN]$ يوازي $(BC)$، النقطة $M$ من $[AB]$ و $N$ من $[AC]$، و $AM = ${P.AM}$.`,
      question: 'كم طول الممرّ؟ اختاروا قبل أن نتحقّق.',
      ...ask(pk.MN, [pkPiece, pk.MN, pkDiff]),
      words: LENGTH,
      after: `$\\dfrac{AM}{AB} = ${F(P.AM, P.AB)} = ${frac(over(P.AM, P.AB))}$، ونقيس $AN = ${pk.AN}$: $\\dfrac{AN}{AC} = ${F(pk.AN, P.AC)} = ${frac(over(pk.AN, P.AC))}$. إذن $MN = ${cross(P.BC, P.AM, P.AB)}$. أمّا $${cross(P.BC, P.AM, pk.MB)}$ فقسمة على القطعة $MB$ لا على الضلع كلّه.`,
      cue: `لماذا نقسم على ${P.AB} لا على القطعة الباقية؟ أيّ طولين يتقابلان؟`,
    },
    {
      id: 'path',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'ممرّ ثانٍ موازٍ',
      text: `في الحديقة نفسها، ممرّ ثانٍ يبدأ من النقطة $P$ من $[AB]$ حيث $AP = ${W.AP}$، وينتهي في النقطة $Q$ من $[AC]$. نريده موازيًا لـ $(BC)$.`,
      question: 'على أيّ بعد من الرأس توضع نهايته؟',
      ...ask(pa.AQ, [paSame, pa.AQ, paShift]),
      words: LENGTH,
      after: `$\\dfrac{AP}{AB} = ${F(W.AP, P.AB)} = ${frac(over(W.AP, P.AB))}$ و $\\dfrac{AQ}{AC} = ${F(pa.AQ, P.AC)} = ${frac(over(pa.AQ, P.AC))}$: الممرّ يوازي $(BC)$. ولو وضعنا $AQ = ${paSame}$ أو $QC = PB = ${pa.PB}$ لما توازى: $${F(paSame, P.AC)} \\neq ${frac(over(W.AP, P.AB))}$ و $${F(paShift, P.AC)} \\neq ${frac(over(W.AP, P.AB))}$.`,
      cue: 'ممرّ لا يوازي الضلع: هل تتساوى النسب الثلاث؟',
    },
    {
      id: 'name-1',
      kind: 'name',
      chapter: 'نسمّي',
      tablet: K1,
      recall: ['خاصية طالس', 'وضعية طالس'],
      cue: 'ارسموا مثلّثًا آخر بحروف أخرى: من يكتب نسبه الثلاث؟',
    },
    {
      id: 'roof',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'عارضة في هيكل سقف',
      text: `هيكل سقف مثلّث $ABC$ قمّته $A$، عارضتاه المائلتان $AB = AC = ${R.AB}$ وعارضة الأرضية $BC = ${R.BC}$ (بالسنتيمتر). عارضة $[EF]$ توازي $(BC)$، والنجّار علّم $E$ من الركن: $BE = ${R.BE}$.`,
      question: 'كم طول العارضة؟',
      ...ask(rf.EF, [rfDiff, rfPiece, rf.EF]),
      words: LENGTH,
      after: `$AE = ${R.AB} - ${R.BE} = ${rf.AE}$، و $\\dfrac{EF}{BC} = \\dfrac{AE}{AB}$ إذن $EF = ${cross(R.BC, rf.AE, R.AB)}$. أمّا $${cross(R.BC, R.BE, R.AB)}$ فأخذت القطعة $BE$ مكان $AE$.`,
      cue: 'المعلوم قطعة من الضلع: ماذا نحسب قبل أن نكتب النسبتين؟',
    },
    {
      id: 'easel',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'حامل الرسم',
      text: `حامل رسم خشبي: ساقاه تلتقيان في القمّة $A$، وقضيب أفقيّ $[EF]$ يوازي الأرض $(BC)$. على الساق: $AE = ${E.AE}$ و $EB = ${E.EB}$، وطول القضيب $EF = ${E.EF}$ (بالسنتيمتر).`,
      question: 'كم تتباعد القدمان على الأرض؟',
      ...ask(es.BC, [esPiece, esSum, es.BC]),
      words: LENGTH,
      after: `$AB = ${E.AE} + ${E.EB} = ${es.AB}$، و $\\dfrac{BC}{EF} = \\dfrac{AB}{AE}$ إذن $BC = ${cross(E.EF, es.AB, E.AE)}$. أمّا $${cross(E.EF, E.EB, E.AE)}$ فأخذت القطعة $EB$ مكان الساق كلّها.`,
      cue: 'في النسبتين أربعة أطوال، أحدها مجهول: كيف نجده؟',
    },
    {
      id: 'name-2',
      kind: 'name',
      chapter: 'نسمّي',
      tablet: K2,
      recall: ['الرابع المتناسب', 'الجداء المتصالب'],
      cue: 'ومن يحسب طول القطعة الباقية من العارضة المائلة في السقف؟',
    },
    {
      id: 'streets',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'شارعان عند الدوّار',
      text: `شارعان مستقيمان يتقاطعان في الدوّار $O$: النقط $A$ و $O$ و $C$ على استقامة واحدة، والنقط $B$ و $O$ و $D$ على استقامة واحدة، والشارعان $(AB)$ و $(CD)$ متوازيان. $OA = ${S.OA}$ و $OC = ${S.OC}$ و $OB = ${S.OB}$ (بالمتر).`,
      question: 'كم يبعد الركن الرابع عن الدوّار؟',
      ...ask(st.OD, [stCrossed, st.OD, stShift, stSum]),
      words: LENGTH,
      after: `$\\dfrac{OC}{OA} = ${F(S.OC, S.OA)} = ${frac(over(S.OC, S.OA))}$، و $OD = ${cross(S.OB, S.OC, S.OA)}$: $\\dfrac{OD}{OB} = ${F(st.OD, S.OB)} = ${frac(over(st.OD, S.OB))}$. شريك $OB$ هو $OD$ على المستقيم نفسه من الجهة الأخرى، لا $OC$.`,
      cue: 'لو أدرنا المثلّث الصغير نصف دورة حول الدوّار: أين يقع؟',
    },
    {
      id: 'name-3',
      kind: 'name',
      chapter: 'نسمّي',
      tablet: K3,
      recall: ['وضعية الفراشة', 'نصف دورة'],
      cue: 'اكتبوا النسب الثلاث للشارعين: أيّ ضلع يقابل أيّ ضلع؟',
    },
    {
      id: 'yard',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'ركن مدهون في الساحة',
      text: `ساحة مدرسة مثلّثة $ABC$: $AB = ${Y.AB}$ و $AC = ${Y.AC}$ و $BC = ${Y.BC}$ (بالمتر). في ركنها $A$ مثلّث مدهون $AMN$، $M$ من $[AB]$ و $N$ من $[AC]$ و $(MN) \\parallel (BC)$، و $AM = ${Y.AM}$.`,
      question: 'نخطّ حول الركن المدهون خطًّا أبيض: كم طوله؟',
      ...ask(yd.P2, [yd.P2, ydRest, ydOne]),
      words: LENGTH,
      after: `كلّ طول من الساحة مضروب في $${frac(yk)}$ يعطي الطول المقابل له في الركن: $AN = ${yd.AN}$ و $MN = ${yd.MN}$. والمحيط أيضًا: $${tex(yd.P1)} \\times ${frac(yk)} = ${tex(yd.P2)}$. أمّا $${tex(Y.AM)} + ${tex(Y.AC)} + ${tex(Y.BC)} = ${tex(ydOne)}$ فلم يتغيّر فيه إلّا ضلع واحد، و $${tex(ydRest)}$ محيط ما بقي من الساحة خارج الركن.`,
      cue: 'أضلاع الركن والمحيط: هل ضُربت كلّها في العدد نفسه؟',
    },
    {
      id: 'corner',
      kind: 'ask',
      chapter: 'نكتشف',
      title: 'من الركن إلى الساحة',
      text: `في ساحة أخرى، كلّ طول من المثلّث $ABC$ مضروب في $${frac(C.k)}$ يعطي الطول المقابل في الركن المدهون $AMN$ و $(MN) \\parallel (BC)$. نقيس $MN = ${C.MN}$.`,
      question: 'كم طول الضلع المقابل في الساحة؟',
      ...ask(co.BC, [coTimes, coTop, co.BC]),
      words: LENGTH,
      after: `$MN = BC \\times ${frac(C.k)}$، إذن $BC = ${tex(C.MN)} \\times ${F(ck.d, ck.n)} = ${tex(co.BC)}$. من الركن إلى الساحة نضرب في $${F(ck.d, ck.n)}$: العدد مقلوب.`,
      cue: 'من الساحة إلى الركن نضرب في عدد: ومن الركن إلى الساحة؟',
    },
    {
      id: 'name-4',
      kind: 'name',
      chapter: 'نسمّي',
      tablet: K4,
      recall: ['معامل التناسبية', 'تكبير', 'تصغير'],
      cue: 'معامل أكبر من 1: هل يكبّر المثلّث أم يصغّره؟',
    },
    {
      id: 'trace-1',
      kind: 'trace',
      chapter: 'نكتب',
      title: 'على الكرّاس: المفتاحان 1 و 2',
      tablets: [K1, K2],
      cue: 'بعد النقل: من يرسم مثلّثًا بممرّ موازٍ ويكتب نسبه الثلاث؟',
    },
    {
      id: 'trace-2',
      kind: 'trace',
      chapter: 'نكتب',
      title: 'على الكرّاس: المفتاحان 3 و 4',
      tablets: [K3, K4],
      cue: 'بعد النقل: من يذكّرنا بالمفاتيح الأربعة دون أن ينظر إلى السبّورة؟',
    },
  ],
};
