/**
 * « بطاقة المعارف » ON THE BOARD (owner, 2026-11-18: « بطاقتي must be able to be presented in the classroom… used for a quick
 * revision with all the class… provide the direct link for the teacher to the previous lesson connected with the new
 * الكفاءة »; CLASS_SESSION.md §5quinquies). The cards are the lesson's OWN knowledge (`LESSON_KNOWLEDGE` of the lesson,
 * the single source the student's « بطاقتي » reads) — imported, never retyped. Pure helpers.
 */
import { getLessonPath } from '@smarter-academy/core';
import { reviewLinksForLesson } from '@smarter-academy/core/curriculum/dz/net/learningNet.js';

/** Where the knowledge of a lesson lives. A lesson joins when its board is written (same list as its script). */
export const KNOWLEDGE_LOADERS = {
  'qasim-adad-tabii': () =>
    import('../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/knowledge.jsx'),
};
export const hasKnowledgeCards = (lessonCode) => Boolean(KNOWLEDGE_LOADERS[lessonCode]);

const math = (m) => (m ? `$${m}$` : null);

/**
 * One card per knowledge item that has a memo sheet, in the order of the lesson: the rule (a formula), the sentence that
 * makes it stick, an example, the trap, and what to do in the exam.
 */
export function cardsOf(knowledge) {
  return Object.entries(knowledge?.modules ?? {})
    .sort(([a], [b]) => Number(a) - Number(b))
    .flatMap(([module, items]) =>
      items
        .filter((it) => it.memo)
        .map((it) => ({
          id: it.id,
          module: Number(module),
          title: it.title,
          rule: math(it.memo.rule),
          hook: it.memo.hook ?? null,
          example: math(it.memo.example),
          trap: it.memo.trap ?? null,
          exam: it.memo.exam ?? null,
        })),
    );
}

const VIA = { requires: 'يحتاج إلى', extends: 'يوسّع', consolidates: 'يثبّت' };
const GRADE = {
  '1am': 'السنة الأولى متوسط',
  '2am': 'السنة الثانية متوسط',
  '3am': 'السنة الثالثة متوسط',
  '4am': 'السنة الرابعة متوسط',
};
/**
 * The earlier lessons the new الكفاءة is connected with (the learning net), core links first — each with its direct
 * link when the lesson is published. For the teacher: one tap to go and look at what the class learnt before.
 */
export function earlierLessons(lessonCode) {
  return reviewLinksForLesson(lessonCode)
    .map((g) => {
      const item = g.items[0] ?? {};
      return {
        code: g.lesson.code,
        title: g.lesson.titleAr,
        grade: GRADE[g.lesson.grade] ?? g.lesson.grade,
        via: VIA[item.via] ?? VIA.requires,
        core: item.weight !== 'support',
        what: item.textAr ?? null,
        path: g.lesson.status === 'available' ? (getLessonPath(g.lesson.code) ?? null) : null,
      };
    })
    .sort((a, b) => Number(b.core) - Number(a.core));
}
