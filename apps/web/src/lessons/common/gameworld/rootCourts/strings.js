/**
 * « قصر الساحات » — the WORLD's own sentences (it names no lesson: a lesson's story overrides or adds through
 * `story.text`). Every sentence about what a platform did is a FACT: a band and a jam are never « wrong ».
 */

/** « بلاطة » agreed with its number (given as text: « 30 », « 0,25 », « 49/64 »). A number that is not whole takes the singular. */
export function tiles(text) {
  const t = String(text);
  if (!/^\d+$/.test(t)) return `${t} بلاطة`;
  const n = Number(t);
  if (n === 0) return '0 بلاطة';
  if (n === 1) return 'بلاطة واحدة';
  if (n === 2) return 'بلاطتان';
  const last = n % 100;
  return last >= 3 && last <= 10 ? `${n} بلاطات` : `${n} بلاطة`;
}

export const WORLD_TEXT = {
  title: 'قصر الساحات',
  subtitle: 'في كلّ سطح ساحة مربّعة مساحتها مكتوبة على بابها. اسحب المقياس، ابنِ المنصّة، واركب المصعد.',
  turn: { body: 'أدِر هاتفك لتلعب.' },
  end: {
    title: 'وصلتَ إلى أعلى القصر',
    text: 'كلّ مفتاح هنا صنعتَه أنت.',
    stay: 'أتجوّل في القصر',
  },
  hud: {
    rod: 'المقياس',
    court: 'الساحة',
    step: 'علامات المقياس',
    wall: 'ضلع الساحة',
    crate: 'الصندوق',
    side: 'ضلع المربّع',
    left: (n) => `بقي في الصندوق: ${n}`,
    missing: (n) => `ينقص: ${n}`,
    empty: 'الصندوق فارغ، ولا خانة مفتوحة',
  },
  held: (s) => `المقياس ${s}`,
  prompt: {
    grab: 'أمسك المقياس',
    drop: 'ضع المقياس',
    lower: (s) => `أنزل المنصّة — المقياس ${s}`,
    clamp: 'ثبّت المقياس على الركن',
    fix: (s) => `ثبّت المربّع — ضلعه ${s}`,
    ride: (name) => `اركب المنصّة إلى ${name}`,
  },
  predict: {
    title: (s) => `المنصّة ضلعها ${s}`,
    ask: 'توقّع قبل أن تنزل: كم بلاطة تغطّي؟',
    go: 'أنزل المنصّة',
    cancel: 'ليس الآن',
    unit: 'بلاطة',
  },
  verdict: {
    right: (n) => `توقّعك صحيح: المنصّة تغطّي ${tiles(n)}`,
    wrong: (p, n) => `توقّعك لم يصب هذه المرّة: قلتَ ${p}، والمنصّة تغطّي ${tiles(n)}`,
    star: 'نجمة التوقّع',
    ride: 'المنصّة تلمس الجدران الأربعة: المصعد يحملها.',
    band: (d) => `يبقى شريط مساحته ${tiles(d)}: المصعد لا يتحرّك.`,
    jam: (d) => `المنصّة أكبر من الساحة بـ ${tiles(d)}: تعلق على الحافّة.`,
    wall: 'هذا المقياس أُخذ من الجدار نفسه، من الركن إلى الركن.',
    yardRide: (a, s) => `الصندوق فرغ تمامًا: ${tiles(a)} صارت ساحة مربّعة ضلعها ${s}.`,
    yardBand: (d) => `المربّع تامّ، لكن بقيت ${tiles(d)} في الصندوق.`,
    yardJam: (d) => `الصندوق فرغ قبل أن يتمّ المربّع: تنقص ${tiles(d)}.`,
  },
  say: {
    hello: 'هذه ساحة مربّعة، ومساحتها على بابها. أمسك المقياس عند الركن وامشِ: المنصّة تكبر معك.',
    fall: ['انتبه لحافّة السطح!', 'لا بأس. نعود ونكمل.', 'السطح أعرض ممّا تظنّ: ابقَ عليه.'],
    grab: 'امشِ بمحاذاة الجدار: طول المقياس هو طول مشيك.',
    ride: 'انطلقنا!',
    landed: (name) => `وصلنا: ${name}.`,
    end: 'من هنا يُرى القصر كلّه.',
  },
  objective: {
    grab: (a) => `اذهب إلى ركن الساحة التي مساحتها ${tiles(a)}، وأمسك المقياس.`,
    yard: (a) =>
      `امشِ بمحاذاة المسطرة: البلاطات تُفرش مربّعًا. أفرغ الصندوق كلّه (${tiles(a)}) في مربّع تامّ، ثمّ ثبّته.`,
    walk: (a) => `امشِ بمحاذاة الجدار حتّى تغطّي المنصّة الساحة كلّها (${tiles(a)})، ثمّ أنزلها.`,
    ride: (name) => `اركب المنصّة لتصل إلى ${name}.`,
    end: 'تجوّل في القصر كما تشاء.',
  },
  mission: { check: 'تحقّق', later: 'ليس الآن' },
  // a level of the practice ladder on the rail: the words that differ from the story's course
  practice: {
    leave: 'الرجوع إلى الخريطة',
    quit: 'خروج',
  },
  recall: {
    title: 'من الساحة السابقة',
    rode: (a, s) => `ساحة ${a}: ركبتها بالمقياس ${s}`,
    band: (a, s, d) => `ساحة ${a}، المقياس ${s}: بقي شريط ${d}`,
    jam: (a, s, d) => `ساحة ${a}، المقياس ${s}: زادت بـ ${d}`,
  },
};

/** The world's sentences with the story's own on top, group by group. */
export function withStory(base, over = {}) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over))
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && typeof base[k] === 'object' ? { ...base[k], ...v } : v;
  return out;
}
