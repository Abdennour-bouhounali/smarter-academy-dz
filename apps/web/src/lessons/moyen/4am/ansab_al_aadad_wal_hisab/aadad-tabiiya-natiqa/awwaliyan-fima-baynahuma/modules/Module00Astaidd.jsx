import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les deux كفاءات
 * en alternance — « PGCD وخوارزمية إقليدس » et « قواعد قابلية القسمة » (règle des pilotes, propriétaire 2026-11-07, rollout 2026-11-09). Les cinq
 * énoncés d'avant restent dans textbook.js comme source.
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
        tag: 'أستعدّ — قبل النشاط 7', title: 'عشر عبارات قبل «أوليان فيما بينهما»', tone: 'teal',
        body: <p>لتعرف إن كان عددان أوليين فيما بينهما، ستحسب PGCD أو تبحث عن قاسم مشترك بقواعد قابلية القسمة. تحقّق من الأداتين.</p>,
      }}
      skills={{
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        pgcd: { label: 'PGCD وخوارزمية إقليدس', emoji: '🔁', lesson: 'bahth-pgcd' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎', lesson: 'qawaid-qabiliyat-qisma' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 7 يبدأ بعددين صغيرين متتاليين.', advice: 'راجع الدرس 6: في خوارزمية إقليدس، PGCD هو آخر باقٍ غير معدوم.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى مجموع الأرقام: يكشف بسرعة القاسم المشترك 3 أو 9.', cta: 'أبدأ النشاط 7', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'PGCD وقواعد قابلية القسمة متحكَّم فيها.', advice: 'حاول حلّ النشاط 7 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['qawaid-qisma'] },
      ]}
    />
  );
}
