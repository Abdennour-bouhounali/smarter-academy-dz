/**
 * THE FOUR INVESTIGATIONS of lesson « القاسم المشترك الأكبر لعددين طبيعيين » — their numbers and their words (the screens
 * and their logic are the world's: `divisorIsles/InquiryGcd.jsx` — common, nest —, `InquirySummit.jsx`, `InquiryDeal.jsx`;
 * the contract: GAME_WORLD.md « استكشف », « spec shapes »). Each key is FOUND by an experiment of its own nature:
 *
 *   COMMON  (🤝, island C) the twins he has just crossed, 198 and 234: a pile of planks — 11 and 13 that he used, planks
 *           of both, one of neither (4, which fills the gap 432 the twins make glued) and the plank 1. He says BEFORE,
 *           twice, whether each plank fills each gap; the world shelves it. `crown: false`: the round ends on the shelves
 *           and the count of the shelf « both » — the longest is NOT asked here: it is key 2.
 *   SUMMIT  (👑, island E) 266 and 322 from the plank 14 he has just used: free tries, the one prediction « outside the
 *           shorter gap? », then the descent through the planks of 266 (266, 133, 38, 19, 14); then the twins from the
 *           top (198, 99, 66, 33, 22, 18), no free try.
 *   DEAL    (💐, island G) the florist's 40 roses and 56 lilies dealt into vases: numbers of vases that leave roses
 *           only (7), lilies only (5, 10), both (3, 6, 12), and the ones that share everything (2, 4, 8).
 *   NEST    (🧩, island H, after the stone's baskets) 228 and 276, whose longest common plank 12 is GIVEN: for each probe
 *           he says, looking at 12 only, whether it fills both gaps — planks of 12, a plank of one gap only (19, 23),
 *           a plank longer than 12, a length under 12 that is not a plank of it (8).
 * None writes the rule (`writes` is not set): the tiles of the forge come after each one (forges.js says why for NEST).
 * No sentence here states a rule: each one says what the strips, the shelves, the vases or the chips have just done;
 * `inquiries.test.js` forbids the words of each key's rule in them. Arabic counts are agreed (`planks`, `counted`).
 */
import { planks } from '../../../../../../common/gameworld/divisorIsles/strings';
import { DATES, FIGS, LILIES, ROSES, counted, listAr } from './math';
import { NUMBERS } from './story';

const { twin: W, second: S, bouquets: F, baskets: K } = NUMBERS;
const [W1, W2] = W.gaps;
const [S1, S2] = S.gaps;

const math = (s) => `$${s.replaceAll('×', '\\times')}$`;
const fill = (yes) => (yes ? 'يملأ' : 'لا يملأ');
/** What he had said, against what the world did. */
const after = (right) => (right == null ? '' : right ? ' كما توقّعت!' : ' لم يكن هذا توقّعك.');
/** « n = d × q + r » of a gap and a plank (a formula). */
const division = (n, d) => math(`${n} = ${d} × ${Math.floor(n / d)} + ${n % d}`);
/** Planks he tried, as the OBJECT of « جرّبتَ »: « لوحًا واحدًا », « لوحين », « 5 ألواح », « 12 لوحًا ». */
const tried = (n) => (n === 1 ? 'لوحًا واحدًا' : n === 2 ? 'لوحين' : n <= 10 ? `${n} ألواح` : `${n} لوحًا`);
/** Planks left, as the SUBJECT of « بقي »: « بقي لوح واحد », « بقي لوحان », « بقيت 6 ألواح ». */
const leftPlanks = (n) => (n === 1 ? 'بقي لوح واحد' : n === 2 ? 'بقي لوحان' : `بقيت ${planks(n)}`);
/** Tries left: « بقيت محاولة واحدة », « بقيت محاولتان », « بقيت 3 محاولات ». */
const triesLeft = (n) => (n === 1 ? 'بقيت محاولة واحدة' : n === 2 ? 'بقيت محاولتان' : `بقيت ${n} محاولات`);
/** « و » before a count: a word takes it glued (« ومزهريتان »), a number apart (« و 23 لوحًا »), as everywhere in the lesson. */
const and = (x) => (/^\d/.test(x) ? `و ${x}` : `و${x}`);
/** Vases: « مزهرية واحدة », « مزهريتان », « 5 مزهريات », « 12 مزهرية ». */
export const VASES = ['مزهرية واحدة', 'مزهريتان', 'مزهريات', 'مزهرية'];
/** Vases after « في »: « في مزهريتين », never « في مزهريتان ». */
export const inVases = (k) => (k === 2 ? 'مزهريتين' : counted(k, VASES));

// ───────────────────────── COMMON — 🤝 the planks of both twins ─────────────────────────
/** Three ends of the shelf of both gaps, written once: its label on screen and in the sentences. */
const bothShelf = (a, b) => `يملأ ${a} و ${b}`;

export const COMMON_INQUIRY = {
  kind: 'common',
  crown: false,
  rounds: [
    {
      a: W1,
      b: W2,
      // the two planks he used first (one gap each), then planks of both, one of neither (it fills 432, the twins
      // glued), and the plank 1 last; 18 — the longest of both — is in the pile, never named
      candidates: [W.first, W.plank, 2, 3, 4, 9, 6, 18, 1],
    },
  ],
  text: {
    lead: (a, b) =>
      `الهوّتان التوأمان: ${a} خانة و ${b} خانة. اللوح ${W.first} ملأ الأولى وحدها، واللوح ${W.plank} ملأ الثانية وحدها. في الكومة ألواح أخرى: أين يذهب كلّ لوح؟`,
    goal: () => 'الهدف: أن تضع كلّ ألواح الكومة على رفوفها، ثمّ تعدّ ألواح رفّ الهوّتين.',
    take: () => 'خذ لوحًا من الكومة.',
    ask: ({ a, b, d }) => `اللوح ${d}: هل يملأ الهوّة ${a}؟ وهل يملأ الهوّة ${b}؟ قل قبل أن يوضع.`,
    onA: (a) => `الهوّة ${a}:`,
    onB: (b) => `الهوّة ${b}:`,
    yes: 'يملؤها',
    no: 'لا يملؤها',
    lay: 'ضع اللوح',
    seen: (f, guess) =>
      `اللوح ${f.d} ${fill(f.holdsA)} ${f.a}، و${fill(f.holdsB)} ${f.b}.${after(guess.a === f.holdsA && guess.b === f.holdsB)}`,
    shelf: {
      a: (a) => `يملأ ${a} وحدها`,
      b: (a, b) => `يملأ ${b} وحدها`,
      both: bothShelf,
      none: () => 'لا يملأ أيّ هوّة',
    },
    sayLead: ({ a, b }) => `الكومة فارغة. كم لوحًا على رفّ « ${bothShelf(a, b)} »؟`,
    sayCount: 'عدد الألواح',
    check: 'تحقّق',
    sayFirst: () => 'خانة عدد الألواح فارغة: عُدّ ألواح رفّ الهوّتين، ثمّ اكتب العدد.',
    sayMiss: (f) =>
      `كتبتَ ${f.said.count}، وعلى رفّ « ${bothShelf(f.a, f.b)} » عدد آخر من الألواح. عُدّها واحدًا واحدًا.`,
    sayOk: (f) => `${planks(f.common.length)} على رفّ « ${bothShelf(f.a, f.b)} »: ${listAr(f.common)}.`,
    foundLine: (f) => `${f.a} و ${f.b}: ${planks(f.common.length)} تملأ الهوّتين — ${listAr(f.common)}`,
    next: 'هوّتان أخريان',
    done: 'أكتب قاعدتي',
  },
};

// ───────────────────────── SUMMIT — 👑 the longest plank of two gaps ─────────────────────────
export const SUMMIT_INQUIRY = {
  kind: 'summit',
  rounds: [
    // the pair of island D, from the plank 14 that has just filled both: is there a longer one?
    { a: S1, b: S2, start: S.plank, free: 2 },
    // the twins of the harbour, from the top: no free try, no second « outside » question
    { a: W1, b: W2, free: 0, outside: false },
  ],
  text: {
    lead: (a, b) =>
      a === S1
        ? `اللوح ${S.plank} يملأ الهوّتين ${a} و ${b}. هل يوجد لوح أطول منه يملؤهما؟`
        : `الهوّتان التوأمان ${a} و ${b}: ما أطول لوح يملؤهما؟`,
    goal: (a, b) => `الهدف: أن تجد أطول لوح يملأ ${a} و ${b}، وأن تعرف أنّه لا يوجد أطول منه.`,
    start: (f) =>
      f.both
        ? `اللوح ${f.d} على الهوّتين: ${planks(f.qa)} في ${f.a}، ${and(planks(f.qb))} في ${f.b}، ولا خانة باقية.`
        : `اللوح ${f.d} ${fill(f.fillsA)} ${f.a}، و${fill(f.fillsB)} ${f.b}.`,
    freeAsk: ({ best, left }) =>
      `اكتب طول لوح تريد أن تجرّبه على الهوّتين${best ? ` (أطول لوح ملأهما حتى الآن: ${best})` : ''}. ${triesLeft(left)}.`,
    unit: 'خانة',
    lay: 'ضع اللوح',
    freeBound: ({ max }) => `اكتب طولًا من 1 إلى ${max}.`,
    tried: (f) =>
      `اللوح ${f.d} ${fill(f.fillsA)} ${f.a}، و${fill(f.fillsB)} ${f.b}.${f.isBest ? ` أطول لوح ملأ الهوّتين حتى الآن: ${f.d}.` : ''}`,
    line: 'الأطوال التي وُضعت',
    outsideAsk: ({ short, long }) =>
      `لوح لا يملأ الهوّة ${short}: هل يمكن أن يملأ الهوّتين ${short} و ${long} كلتيهما؟`,
    outsideSeen: (f) =>
      `${f.mine ? 'لوح جرّبتَه' : 'العالم يضع لوحًا'}: اللوح ${f.d} ${fill(f.fillsA)} ${f.a}، و${fill(f.fillsB)} ${f.b}.${after(f.guess === f.both)}`,
    go: 'إلى ألواح الهوّة الأقصر',
    countAsk: ({ long }) => `كم لوحًا ستجرّب حتى يملأ أحدها ${long}؟`,
    countUnit: 'عدد الألواح',
    countGo: 'ابدأ',
    chipsLabel: (short) => `ألواح الهوّة ${short}، من الأطول إلى الأقصر`,
    descentAsk: ({ short, long, d }) => `اللوح ${d} يملأ ${short}. هل يملأ ${long}؟`,
    descentSeen: (f) =>
      `${f.both ? `اللوح ${f.d} يملأ ${f.long} أيضًا.` : `${division(f.long, f.d)}: اللوح ${f.d} لا يملأ ${f.long}.`}${after(
        f.guess == null ? null : f.guess === f.both,
      )}`,
    crowned: (f) =>
      `جرّبتَ ${tried(f.tries)} من ألواح ${f.short}، من الأطول: اللوح ${f.crown} أوّل لوح منها يملأ ${f.long}.`,
    restAsk: ({ short, crown, rest }) =>
      `${leftPlanks(rest)} من ألواح ${short}، ${rest === 1 ? 'أقصر' : 'كلّها أقصر'} من ${crown}. هل يجب أن نجرّب${rest === 1 ? 'ه' : 'ها'}؟`,
    restSeen: (f) =>
      f.checked
        ? `العالم وضعها: ${listAr(f.rest)} — كلّها أقصر من ${f.crown}.`
        : `لم توضع: ${listAr(f.rest)} — كلّها أقصر من ${f.crown}.`,
    countSeen: (f) => `جرّبتَ ${tried(f.tries)}، وكتبتَ ${f.said}.`,
    foundLine: (r) =>
      `${r.a} و ${r.b}: ${r.crown} — جُرّب قبله ${listAr(r.descent.slice(0, -1).map((x) => x.d)) || '—'}`,
    yes: 'نعم',
    no: 'لا',
    next: 'الهوّتان التوأمان',
    done: 'أكتب قاعدتي',
  },
};

// ───────────────────────── DEAL — 💐 the florist's vases ─────────────────────────
/** What is left on the table after a deal, as the subject of « بقي »: the roses and/or the lilies. */
const leftOver = (restA, restB) =>
  [restA ? counted(restA, ROSES) : null, restB ? counted(restB, LILIES) : null].filter(Boolean).join(' و ');
/** One deal, in words: what each vase holds and what is left. */
const dealSays = (f) =>
  `${counted(f.k, VASES)}: في كلّ واحدة ${counted(f.qA, ROSES)} و ${counted(f.qB, LILIES)}، ${
    f.restA || f.restB ? `وبقي على الطاولة ${leftOver(f.restA, f.restB)}` : 'ولم تبقَ أيّ زهرة'
  }.`;

export const DEAL_INQUIRY = {
  kind: 'deal',
  a: { n: F.roses, item: 'rose' },
  b: { n: F.lilies, item: 'lily' },
  lot: 'vase',
  // 7 leaves roses only, 5 and 10 lilies only, 3, 6 and 12 both; 2, 4 and 8 share everything — 8 is in the chips
  choices: [2, 3, 4, 5, 6, 7, 8, 10, 12],
  minTries: 4,
  text: {
    lead: (a, b) =>
      `عند بائعة الجزيرة ${counted(a.n, ROSES)} و ${counted(b.n, LILIES)}. تريد أن تضعها كلّها في مزهريات متماثلة: في كلّ مزهرية العدد نفسه من الورود، والعدد نفسه من الزنابق.`,
    goal: () => 'الهدف: أكثر عدد من المزهريات، وما تحمله المزهرية الواحدة — دون أن تبقى زهرة.',
    choose: ({ tried: n }) => (n === 0 ? 'كم مزهرية؟ اختر عددًا.' : 'اختر عددًا آخر من المزهريات.'),
    ask: ({ k }) => `${counted(k, VASES)}: هل توزَّع كلّ الورود وكلّ الزنابق، دون أن تبقى زهرة؟`,
    dealt: (f) => `${dealSays(f)}${after(f.guess == null ? null : f.guess === f.ok)}`,
    again: (f) => `جرّبتَ هذا العدد من قبل. ${dealSays(f)}`,
    cols: { lots: 'المزهريات', a: 'ورود في كلّ مزهرية', b: 'زنابق في كلّ مزهرية', left: 'على الطاولة' },
    toAnswer: 'أعرف الجواب',
    back: 'أجرّب أعدادًا أخرى',
    check: 'تحقّق',
    answerLead: () => 'أكثر عدد من المزهريات، وما تحمله المزهرية الواحدة:',
    lotsUnit: 'مزهريات',
    unitA: 'ورود',
    unitB: 'زنابق',
    miss: (f) => {
      const { said, row } = f;
      if (f.kind === 'open') return 'بين الأعداد التي لم تجرّبها بعدُ عدد آخر يستحقّ التجربة.';
      if (f.kind === 'bigger')
        return `${counted(said.k, VASES)} توزّع كلّ الزهور، ${and(counted(row.k, VASES))} في جدولك توزّعها أيضًا.`;
      if (!row.ok) return `${counted(row.k, VASES)}: بقي على الطاولة ${leftOver(row.restA, row.restB)}.`;
      return `${dealSays(row)} وكتبتَ ${said.x} و ${said.y}.`;
    },
    ok: ({ said }) =>
      `${counted(said.k, VASES)}، في كلّ واحدة ${counted(said.x, ROSES)} و ${counted(said.y, LILIES)}، ولم تبقَ أيّ زهرة.`,
    bound: ({ max }) => `اكتب الأعداد الثلاثة؛ عدد المزهريات من 1 إلى ${max}.`,
    yes: 'نعم',
    no: 'لا',
    done: 'أكتب قاعدتي',
  },
};

// ───────────────────────── NEST — 🧩 the longest plank, given ─────────────────────────
export const NEST_INQUIRY = {
  kind: 'nest',
  rounds: [
    {
      a: K.dates,
      b: K.figs,
      // planks of 12 (6, 4, 12, 1), a plank of one gap only and longer than 12 (19: 228 only; 23: 276 only), longer
      // than 12 and of neither (24), under 12 and not a plank of 12 (8)
      probes: [6, 19, 8, 4, 24, 23, 12, 1],
    },
  ],
  text: {
    lead: (a, b) =>
      `${counted(a, DATES)} و ${counted(b, FIGS)}: الهوّتان ${a} و ${b}، وأطول لوح يملؤهما معروف. لكلّ لوح جديد: انظر إلى أطول لوح وحده، وقل هل يملأ اللوح الهوّتين.`,
    goal: () => `الهدف: أن تعرف هل يملأ لوحٌ الهوّتين، وأنت تنظر إلى الهوّة ${K.plank} وحدها.`,
    given: ({ a, b, g }) => `$\\mathrm{PGCD}(${a} ; ${b}) = ${g}$`,
    divisorsLabel: (g) => `ألواح الهوّة ${g}`,
    ask: ({ a, b, g, p }) => `اللوح ${p}: انظر إلى ${g} فقط. هل يملأ الهوّتين ${a} و ${b}؟`,
    yes: 'نعم، يملؤهما',
    no: 'لا',
    seen: (f, guess) =>
      `اللوح ${f.p} ${fill(f.holdsA)} ${f.a}، و${fill(f.holdsB)} ${f.b}، و${fill(f.inG)} ${f.g}.${after(guess === f.both)}`,
    foundLine: (f) => `اللوح ${f.p}: ${fill(f.holdsA)} ${f.a}، ${fill(f.holdsB)} ${f.b}، ${fill(f.inG)} ${f.g}`,
    compare: (f) =>
      `ألواح الهوّتين ${f.a} و ${f.b}: ${listAr(f.common)}. ألواح الهوّة ${f.g}: ${listAr(f.divisorsOfG)}.`,
    commonLabel: (a, b) => `الألواح التي تملأ ${a} و ${b}`,
    next: 'هوّتان أخريان',
    done: 'أكتب قاعدتي',
  },
};
