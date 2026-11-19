/**
 * « مختبري » — THE INSTRUMENTS, each tagged with the lesson that introduces it (2026-11-16).
 * One lab for every lesson: `toolsFor(lesson)` gives the instruments of that lesson (« أدوات هذا الدرس ») and the cabinet
 * « خزانتي » — the instruments of ALL the lessons before it, of every grade, grouped by grade and lesson. An instrument of a
 * later lesson is not listed at all (not even locked).
 *
 * To add an instrument: write `tools/<Name>.jsx` (props: { a, b, setA, setB, play, note }), add its entry here with the code
 * of the lesson that introduces it and that lesson's exact catalogue title (`registry.test.js` checks both), its number
 * ranges, and 2–3 « جرّب » quests in `logic.js › QUESTS`.
 */
import { GRADES, GRADE_NAMES, compareLessons, isReached, placeOf } from './order';

export const TOOLS = [
  {
    id: 'rows',
    lesson: 'qasim-adad-tabii',
    lessonTitle: 'التعرّف على قاسم لعدد طبيعي',
    icon: '🟡',
    name: 'صفوف القسمة',
    hint: 'رتّب الحبّات في صفوف متساوية: هل يبقى شيء؟',
    needs: 'ab',
    labels: { a: 'عدد الحبّات', b: 'في كلّ صفّ' },
    range: { a: [1, 144], b: [1, 24] },
    load: () => import('./tools/Rows'),
  },
  {
    id: 'jumps',
    lesson: 'qasim-adad-tabii',
    lessonTitle: 'التعرّف على قاسم لعدد طبيعي',
    icon: '🦘',
    name: 'قفزات المضاعفات',
    hint: 'اقفز بخطوات متساوية من 0: هل تصل إلى الراية تمامًا؟',
    needs: 'ab',
    labels: { a: 'الراية', b: 'طول القفزة' },
    range: { a: [1, 120], b: [1, 30] },
    load: () => import('./tools/Jumps'),
  },
  {
    id: 'sentences',
    lesson: 'qasim-adad-tabii',
    lessonTitle: 'التعرّف على قاسم لعدد طبيعي',
    icon: '🗣️',
    name: 'آلة الجمل الأربع',
    hint: 'أربع جمل، معنى واحد: صحيحة معًا أو خاطئة معًا.',
    needs: 'ab',
    labels: { a: 'العدد الأوّل', b: 'العدد الثاني' },
    range: { a: [1, 999], b: [1, 999] },
    load: () => import('./tools/Sentences'),
  },
  {
    id: 'divisors',
    lesson: 'qawasim-adad-tabii',
    lessonTitle: 'قواسم عدد طبيعي',
    icon: '🌈',
    name: 'قوس القواسم',
    hint: 'اكشف كلّ قواسم عدد: كلّ قاسم له رفيق.',
    needs: 'a',
    labels: { a: 'العدد' },
    range: { a: [1, 100], b: [1, 100] },
    load: () => import('./tools/Divisors'),
  },
  {
    id: 'planks',
    lesson: 'khawass-qawasim',
    lessonTitle: 'خواص قواسم عدد طبيعي',
    icon: '🪵',
    name: 'اللوح المشترك',
    hint: 'غيّر طول اللوح: أيّ الأطوال يملؤها تمامًا؟',
    needs: 'ab',
    labels: { a: 'الطول الأوّل', b: 'الطول الثاني' },
    range: { a: [1, 60], b: [1, 60] },
    load: () => import('./tools/Planks'),
  },
  {
    id: 'common',
    lesson: 'qasim-mushtarak-akbar',
    lessonTitle: 'القاسم المشترك الأكبر لعددين طبيعيين',
    icon: '🤝',
    name: 'القواسم المشتركة',
    hint: 'قواسم عددين جنبًا إلى جنب: أيّها مشترك، وأيّها الأكبر؟',
    needs: 'ab',
    labels: { a: 'العدد الأوّل', b: 'العدد الثاني' },
    range: { a: [1, 100], b: [1, 100] },
    load: () => import('./tools/Common'),
  },
  {
    id: 'euclid',
    lesson: 'bahth-pgcd',
    lessonTitle: 'البحث عن القاسم المشترك الأكبر لعددين طبيعيين',
    icon: '🟩',
    name: 'مربّعات إقليدس',
    hint: 'اقطع من المستطيل أكبر مربّع ممكن، ثمّ أعد: آخر مربّع يكشف السرّ.',
    needs: 'ab',
    labels: { a: 'الطول', b: 'العرض' },
    range: { a: [1, 60], b: [1, 60] },
    load: () => import('./tools/Euclid'),
  },
  {
    id: 'paper',
    lesson: 'qisma-iqlidiya-baqi',
    lessonTitle: 'القسمة الإقليدية',
    icon: '📝',
    name: 'القسمة على الورقة',
    hint: 'القسمة كما تُكتب على الورقة، خطوة خطوة، بأعدادك أنت.',
    needs: 'ab',
    labels: { a: 'المقسوم', b: 'المقسوم عليه' },
    range: { a: [1, 9999], b: [2, 99] },
    load: () => import('./tools/PaperDivision'),
  },
  {
    id: 'bracket',
    lesson: 'qisma-iqlidiya-hasr',
    lessonTitle: 'القسمة الإقليدية وحصر حاصل القسمة',
    icon: '📏',
    name: 'مسطرة الحصر',
    hint: 'ضع الألواح واحدًا بعد الآخر: كم لوحًا كاملًا يدخل؟ وكم لوحًا يلزم؟',
    needs: 'ab',
    labels: { a: 'الطول', b: 'طول اللوح' },
    range: { a: [1, 9999], b: [2, 999] },
    load: () => import('./tools/Bracket'),
  },
  {
    id: 'rules',
    lesson: 'qawaid-qabiliyat-qisma',
    lessonTitle: 'قواعد قابلية القسمة',
    icon: '💡',
    name: 'كاشف قابلية القسمة',
    hint: 'أدِر الأرقام كقفل: أيّ المصابيح يضيء؟',
    needs: 'a',
    labels: { a: 'العدد' },
    range: { a: [0, 9999], b: [1, 999] },
    load: () => import('./tools/Rules'),
  },
];

export const toolById = (id) => TOOLS.find((t) => t.id === id) ?? null;

/**
 * What a student of `lesson` finds in the lab:
 *   mine     the instruments introduced by this very lesson;
 *   cabinet  [{ grade, name, lessons: [{ code, title, tools }] }] — every earlier lesson that has instruments, oldest grade first;
 *   all      mine + every instrument of the cabinet (what may ever be put on the bench).
 */
export function toolsFor(lesson) {
  if (!placeOf(lesson)) return { mine: [], cabinet: [], all: [] };
  const reached = TOOLS.filter((t) => isReached(t.lesson, lesson));
  const mine = reached.filter((t) => t.lesson === lesson);
  const earlier = reached.filter((t) => t.lesson !== lesson);
  const cabinet = GRADES.map((grade) => {
    const codes = [...new Set(earlier.filter((t) => placeOf(t.lesson).grade === grade).map((t) => t.lesson))].sort(
      compareLessons,
    );
    return {
      grade,
      name: GRADE_NAMES[grade],
      lessons: codes.map((code) => ({
        code,
        title: earlier.find((t) => t.lesson === code).lessonTitle,
        tools: earlier.filter((t) => t.lesson === code),
      })),
    };
  }).filter((g) => g.lessons.length);
  return { mine, cabinet, all: [...mine, ...earlier] };
}
/** Does this lesson have a lab at all (at least one instrument reached)? */
export const hasLab = (lesson) => toolsFor(lesson).all.length > 0;

/** The pair of numbers a tool can show: the shared numbers, brought inside the tool's ranges. */
export function clampFor(tool, a, b) {
  const c = (v, [lo, hi]) => Math.max(lo, Math.min(hi, Math.round(Number(v) || lo)));
  return { a: c(a, tool.range.a), b: c(b, tool.range.b) };
}
