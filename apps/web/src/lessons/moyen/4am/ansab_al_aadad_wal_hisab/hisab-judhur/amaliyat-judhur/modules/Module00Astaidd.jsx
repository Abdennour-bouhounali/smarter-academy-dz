import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 19, items 5 et 6, + quatre affirmations de la
 * plateforme dans la même forme). Mesure les trois acquis de la leçon :
 * (ab)² et (a/b)² (années antérieures), la définition de √a et (√a)² = a
 * (leçon 1). Diagnostic JAMAIS bloquant, aucune `assessment`. `id` et
 * `requires` restent littéraux (audit).
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="6 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 19', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب المدرسي وأربع عبارات من المنصّة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        quwa: { label: 'مربع جداء ومربع حاصل قسمة', emoji: '🔢' },
        jidhr: { label: 'تعريف الجذر التربيعي', emoji: '🌱' },
        murabba: { label: 'مربع الجذر التربيعي', emoji: '🔁' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ بتبليط مربّع، وكل عدد فيه يُحسب أمامك.', advice: 'راجع أن الجذر التربيعي لعدد موجب هو العدد الموجب الذي مربعه هذا العدد.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: مربع حاصل قسمة هو حاصل قسمة المربعين، البسط والمقام معًا.', cta: 'أبدأ النشاط 4', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'تعرف مربع جداء ومربع حاصل قسمة، وتعرف الجذر التربيعي.', advice: 'حاول أن تجد التخمين بنفسك قبل أن تقرأه.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0], 2), id: 'prep-1', requires: ['quwa-jidaa-kasr'] },
        { ...prepQuestion(PREP_ITEMS[1], 2), id: 'prep-2', requires: ['quwa-jidaa-kasr'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['murabba-jidhr'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['murabba-jidhr'] },
      ]}
    />
  );
}
