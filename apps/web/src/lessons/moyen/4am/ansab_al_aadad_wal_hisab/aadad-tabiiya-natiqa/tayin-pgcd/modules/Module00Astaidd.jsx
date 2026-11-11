import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les deux
 * كفاءات en alternance — « كل قواسم عدد » et « PGCD » (règle des pilotes, propriétaire 2026-11-07). Les quatre énoncés d'avant restent
 * dans textbook.js comme source.
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
        tag: 'أستعدّ — قبل النشاط 5', title: 'عشر عبارات قبل تعيين PGCD', tone: 'teal',
        body: <p>ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        qawasim: { label: 'قواسم عدد', emoji: '🔢', lesson: 'qawasim-adad-tabii' },
        pgcd: { label: 'القاسم المشترك الأكبر', emoji: '🤝', lesson: 'qasim-mushtarak-akbar' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 5 يمرّ بالمراحل الثلاث واحدة واحدة.', advice: 'راجع الدرس 2 (طريقة البحث عن القواسم) والدرس 4 (تعريف PGCD).', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه: PGCD هو الأكبر بين القواسم المشتركة، لا أيّ قاسم مشترك.', cta: 'أبدأ النشاط 5', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'القواسم والقاسم المشترك الأكبر متحكَّم فيهما.', advice: 'حاول حلّ النشاط 5 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['pgcd-taarif'] },
      ]}
    />
  );
}
