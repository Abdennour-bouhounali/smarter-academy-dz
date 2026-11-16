/**
 * « حصّة القسم » — what the class does DURING the lesson (owner, 2026-11-18: « rebuild entirely the during-the-lesson
 * classroom mode »). PURE data and logic; the board is LessonBoard.jsx; contract CLASS_SESSION.md §5bis–§5ter.
 *
 * The hour, as a script:
 *   revise   after the start test, the rules the lesson will USE, one per screen (`reviewCards`) — a student reads, or the teacher;
 *   lesson   the lesson itself, as a sequence of STEPS the class goes through together on the board (`SCRIPTS`):
 *            a situation → the class EXPERIMENTS (bridges it predicts and builds) → it writes ITS rule and the board tests
 *            it on the class's own bridges → the rule gets its name → the next rule … → what goes in the copybook.
 * The method is the platform's, moved to the board: the class acts first, concludes itself, and only then the name.
 * Nothing here is saved as a student's progress.
 */
import { outcome, sameCase, ruleSays, QUANTITIES, CONDITIONS } from '../../lessons/common/gameworld/divisorIsles/ruleForge';

/**
 * The cards of the revision: the rules of the earlier الكفاءات the lesson stands on (`family.rules`), core tools first; when
 * the start test was taken, the الكفاءة the class missed most comes FIRST, with its count.
 * `tools` = toolsForLesson(lesson), `families` = launch-kit families, `startItems` = the start test's result per الكفاءة.
 */
export function reviewCards(tools, families, startItems = null) {
  const rate = (item) => { const s = (startItems ?? []).find((x) => x.item === item); return s && s.total ? s.right / s.total : null; };
  const order = tools.filter((t) => families[t.id]?.rules?.length).map((t, i) => ({ t, i, r: rate(t.id) }))
    .sort((a, b) => (a.r ?? 2) - (b.r ?? 2) || (a.t.weight === 'support' ? 1 : 0) - (b.t.weight === 'support' ? 1 : 0) || a.i - b.i);
  return order.flatMap(({ t }) => { const f = families[t.id]; const s = (startItems ?? []).find((x) => x.item === t.id) ?? null; return f.rules.map((rule) => ({ ...rule, item: t.id, family: f.name, icon: f.icon, weight: t.weight ?? null, lesson: t.lesson?.titleAr ?? f.name, grade: t.grade, score: s && s.total ? { right: s.right, total: s.total } : null })); });
}

/** The class's bridges as evidence: one line per different bridge, in the order the class built them — the last eight, what the board shows without scrolling. */
export const LOG_MAX = 8;
export function classLog(log, c) { return [...log.filter((x) => !sameCase(x, c)), outcome(c.a, c.b)].slice(-LOG_MAX); }
/** Enough to conclude: at least four bridges, one that held and one that crumbled. */
export const readyToConclude = (log) => log.length >= 4 && log.some((x) => x.held) && log.some((x) => !x.held);
/** What is still missing before the class may conclude — said in the board's words (null when ready). */
export function missingEvidence(log) {
  if (!log.some((x) => x.held)) return 'held'; if (!log.some((x) => !x.held)) return 'fell'; return log.length < 4 ? 'more' : null;
}

/**
 * The script of a lesson: its STEPS. Kinds:
 *   situation   the problem that opens the lesson, with a bridge the class looks at;
 *   bridges     the class experiments: it chooses a gap and a plank, predicts, the board builds — `suggest` proposes bridges
 *               that lead somewhere, the class is free to try others;
 *   forge       the class writes its rule with two tiles; the board runs it on the class's bridges, then attacks it;
 *   ask         one question with choices, PROVED by bridges the board builds (`single` or several right answers);
 *   statements  sentences the class judges true or false, each proved by an equality;
 *   name        the rule gets its name: the tablet of the lesson (`tablet` key of the game's strings — one wording for the
 *               student's world and for the board), read aloud by a student or by the teacher;
 *   trace       what goes in the copybook.
 */
export const SCRIPTS = {
  'qasim-adad-tabii': {
    title: 'التعرّف على قاسم لعدد طبيعي',
    steps: [
      { id: 'situation', kind: 'situation', chapter: 'نكتشف', title: 'جسر بين جزيرتين', text: 'بين جزيرتين هوّة من 15 خانة. نريد أن نعبرها بجسر من ألواح لها الطول نفسه، دون أن تبقى خانة فارغة.', question: 'بأيّ ألواح يثبت الجسر؟ وبأيّها ينهار؟', bridge: { a: 15, b: 4 }, cue: 'قبل أيّ بناء: من يتوقّع ما سيحدث باللوح 4؟ ولماذا؟' },
      { id: 'bridges', kind: 'bridges', chapter: 'نكتشف', title: 'نجرّب', lead: 'القسم يختار هوّة ولوحًا، يتوقّع، ثمّ نبني.', suggest: [{ a: 15, b: 3 }, { a: 15, b: 4 }, { a: 16, b: 4 }, { a: 16, b: 3 }, { a: 42, b: 4 }, { a: 42, b: 6 }, { a: 42, b: 7 }], cue: 'بعد كلّ جسر: كم لوحًا وضعنا؟ كم خانة بقيت؟' },
      { id: 'forge', kind: 'forge', chapter: 'نستنتج', title: 'قاعدة القسم', lead: 'متى يثبت الجسر؟ القسم يكتب قاعدته، والسبّورة تختبرها على جسوره.', cue: 'انظروا إلى الجسور التي ثبتت: ما الذي يجمعها؟' },
      { id: 'name-1', kind: 'name', chapter: 'نسمّي', tablet: 'qasim-baqi', forged: true, recall: ['باقي', 'قاسم'], cue: 'من يعطي مثالًا آخر: عدد وقاسم له؟' },
      { id: 'product', kind: 'ask', chapter: 'نكتشف', title: 'دون أيّ قسمة', text: 'ثبت الجسر باللوح 6 فوق هوّة من 48 خانة: $48 = 6 \\times 8$.', question: 'دون أيّ قسمة: أيّ لوح آخر يثبت بالتأكيد؟', a: 48, options: [5, 7, 8, 9], answer: [8], after: 'في $48 = 6 \\times 8$ العددان 6 و 8 يملآن الهوّة: 8 ألواح طولها 6، أو 6 ألواح طولها 8.', cue: 'كيف عرفتم دون أن تقسموا؟' },
      { id: 'name-2', kind: 'name', chapter: 'نسمّي', tablet: 'qasim-jidaa', recall: ['جداء', 'قاسم'], cue: 'اكتبوا 36 على شكل جداء: أيّ قاسمين نقرأ؟' },
      { id: 'sentences', kind: 'statements', chapter: 'نكتشف', title: 'أربع جمل', text: 'نعلم أنّ $120 = 6 \\times 20$.', question: 'صحيح أم خطأ؟', a: 120, b: 6, items: [{ form: 'b_divides_a', text: '6 قاسم للعدد 120' }, { form: 'a_divides_b', text: '120 قاسم للعدد 6' }, { form: 'a_multiple_of_b', text: '120 مضاعف للعدد 6' }, { form: 'b_multiple_of_a', text: '6 مضاعف للعدد 120' }, { form: 'a_divisible_by_b', text: '120 يقبل القسمة على 6' }], cue: 'أيّ جمل تقول الشيء نفسه؟' },
      { id: 'name-3', kind: 'name', chapter: 'نسمّي', tablet: 'siyagh-mutakafia', recall: ['قاسم', 'يقسم', 'يقبل القسمة', 'مضاعف'], cue: 'قولوا الجمل الأربع للعددين 7 و 35.' },
      { id: 'always', kind: 'ask', chapter: 'نكتشف', title: 'الهوّة العنيدة', text: 'هوّة من 143 خانة. لا نريد أن نقسم.', question: 'أيّ لوحين يثبتان دائمًا، مهما كان طول الهوّة؟', a: 143, options: [1, 2, 10, 143], answer: [1, 143], after: 'لوح من خانة واحدة يملأ كلّ هوّة، ولوح بطول الهوّة كلّها يملؤها وحده: $143 = 1 \\times 143$.', cue: 'وهل يصحّ ذلك لهوّة من 2026 خانة؟' },
      { id: 'name-4', kind: 'name', chapter: 'نسمّي', tablet: 'wahid-wa-nafsuh', recall: ['لكلّ عدد طبيعي', 'لنفسه'], cue: 'هل للعدد 13 قواسم أخرى غير 1 و 13؟' },
      { id: 'trace', kind: 'trace', chapter: 'نكتب', title: 'على الكرّاس', tablets: ['qasim-baqi', 'qasim-jidaa', 'siyagh-mutakafia', 'wahid-wa-nafsuh'], cue: 'بعد النقل: من يذكّرنا بالمفاتيح الأربعة دون أن ينظر إلى السبّورة؟' },
    ],
  },
};
export const hasScript = (lessonId) => Boolean(SCRIPTS[lessonId]);

/** The truth of a sentence about a (the bigger) and b: the same forms as the default tests. */
export const FORMS = {
  b_divides_a: (a, b) => a % b === 0, a_divides_b: (a, b) => b % a === 0, a_multiple_of_b: (a, b) => a % b === 0, b_multiple_of_a: (a, b) => b % a === 0, a_divisible_by_b: (a, b) => a % b === 0,
};
/** A choice of an `ask` step: does that plank fill the gap? And is the class's selection exactly the right one? */
export const fills = (step, option) => step.a % option === 0;
export const askRight = (step, picked) => picked.length === step.answer.length && step.answer.every((v) => picked.includes(v));
/** The rail of the board: one dot per step, with the chapter it belongs to (« نكتشف », « نستنتج », « نسمّي », « نكتب »). */
export const railOf = (script) => script.steps.map((s, i) => ({ i, id: s.id, chapter: s.chapter, kind: s.kind, first: i === 0 || script.steps[i - 1].chapter !== s.chapter }));

/**
 * The rail as the class understands it: one group per KEY of the lesson — what the class does, then the name it earns —
 * and a last group for the copybook. `steps` are indices in the script.
 */
export function groupsOf(script) {
  const out = []; let cur = [];
  script.steps.forEach((s, i) => { cur.push(i); if (s.kind === 'name' || s.kind === 'trace' || i === script.steps.length - 1) { out.push({ steps: cur, kind: s.kind, tablet: s.tablet ?? null }); cur = []; } });
  return out;
}

/** The CLASS's rule applied to one bridge, in the class's voice: « باقي قسمة 18 على 4 هو 2، و 2 لا يساوي 0: قاعدتنا تقول إنّ الجسر ينهار ». */
export function classExplain(rule, a, b) {
  const Q = QUANTITIES.find((x) => x.id === rule.q); const C = CONDITIONS.find((x) => x.id === rule.c); const v = Q.of(a, b); const yes = ruleSays(rule, a, b);
  return `${Q.short(a, b)} هو ${v}، و ${v} ${yes ? C.yes : C.no}: قاعدتنا تقول إنّ الجسر ${yes ? 'يثبت' : 'ينهار'}.`;
}
/** The rule of the class as one sentence: « يثبت الجسر عندما: باقي قسمة طول الهوّة على طول اللوح يساوي 0. » */
export const classRuleText = (rule) => `يثبت الجسر عندما: ${QUANTITIES.find((x) => x.id === rule.q).label} ${CONDITIONS.find((x) => x.id === rule.c).label}.`;
/** The equality the board writes under a bridge: « 42 = 4 × 10 + 2 », or « 42 = 6 × 7 » when nothing is left. */
export const equalityOf = (c) => (c.r === 0 ? `${c.a} = ${c.b} \\times ${c.q}` : `${c.a} = ${c.b} \\times ${c.q} + ${c.r}`);
/** A number of cells, agreed: « خانة واحدة », « خانتان », « 8 خانات », « 15 خانة ». */
export const cellsOf = (n) => (n === 1 ? 'خانة واحدة' : n === 2 ? 'خانتان' : n <= 10 ? `${n} خانات` : `${n} خانة`);
/** « بقيت خانة واحدة », « بقيت خانتان », « بقيت 3 خانات », « بقيت 11 خانة ». */
export const leftCells = (r) => (r === 1 ? 'بقيت خانة واحدة' : r === 2 ? 'بقيت خانتان' : r <= 10 ? `بقيت ${r} خانات` : `بقيت ${r} خانة`);

/** Why a sentence about a (the bigger) and b is true or false — said with the equality or with the bridge. */
export function proofOf(form, a, b) {
  const q = a / b;
  return {
    b_divides_a: `$${a} = ${b} \\times ${q}$: الباقي 0.`,
    a_divides_b: `لوح طوله ${a} لا يدخل في هوّة من ${cellsOf(b)}.`,
    a_multiple_of_b: `$${a} = ${b} \\times ${q}$: العدد ${a} في جدول ${b}.`,
    b_multiple_of_a: `مضاعفات ${a} هي 0، ${a}، ${2 * a}… والعدد ${b} ليس منها.`,
    a_divisible_by_b: `$${a} \\div ${b} = ${q}$ والباقي 0.`,
  }[form];
}

/**
 * « من يتذكّر؟ »: a line of a rule cut into parts, the `words` to recall hidden — never inside a formula.
 * Parts: { t: 'text' | 'math' | 'blank', v }. The class says the hidden word; a tap shows it.
 */
export function blanks(text, words = []) {
  const out = []; const list = [...words].sort((x, y) => y.length - x.length);
  text.split(/(\$[^$]+\$)/).forEach((seg) => {
    if (!seg) return;
    if (seg.startsWith('$')) { out.push({ t: 'math', v: seg }); return; }
    let rest = seg;
    while (rest) {
      let at = -1; let w = null;
      for (const x of list) { const i = rest.indexOf(x); if (i >= 0 && (at < 0 || i < at)) { at = i; w = x; } }
      if (at < 0) { out.push({ t: 'text', v: rest }); break; }
      if (at > 0) out.push({ t: 'text', v: rest.slice(0, at) });
      out.push({ t: 'blank', v: w }); rest = rest.slice(at + w.length);
    }
  });
  return out;
}
