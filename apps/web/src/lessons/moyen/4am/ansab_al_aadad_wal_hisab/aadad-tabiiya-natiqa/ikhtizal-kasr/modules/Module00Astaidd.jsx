import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les deux كفاءات
 * en alternance — « الكسور المتساوية » et « PGCD » (règle des pilotes, propriétaire 2026-11-07). Les six énoncés d'avant (PREP_ITEMS,
 * PREP_PLATFORM_ITEMS) restent dans textbook.js comme source.
 * Diagnostic des acquis antérieurs, JAMAIS bloquant : aucune `assessment`, la
 * suite est toujours ouverte. `id` et `requires` restent littéraux (audit).
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="8 دقائق"
      brief={{
        tag: 'أستعدّ — قبل النشاط 8', title: 'عشر عبارات قبل الاختزال', tone: 'teal',
        body: <p>ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        kusur: { label: 'الكسور المتساوية', emoji: '🔢' },
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        pgcd: { label: 'PGCD', emoji: '🤝', lesson: 'bahth-pgcd' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك عن الكسور لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ باختزال ملموس، خطوة بخطوة.', advice: 'راجع الكسور المتساوية: نضرب أو نقسم البسط والمقام على نفس العدد.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى القسمة على كسر: نضرب في المقلوب.', cta: 'أبدأ النشاط 8', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الحساب على الكسور وPGCD متحكَّم فيهما.', advice: 'حاول حلّ النشاط 8 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['khwarizmiyat-iqlidus'] },
      ]}
    />
  );
}
