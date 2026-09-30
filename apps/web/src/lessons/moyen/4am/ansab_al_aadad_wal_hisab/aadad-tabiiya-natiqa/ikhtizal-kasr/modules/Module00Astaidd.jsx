import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ : les items 7–10 du manuel (p. 7, les nombres rationnels) et deux
 * ajouts de la plateforme (« عبارة إضافية من المنصّة ») sur « أوليان فيما بينهما » et Euclide.
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
      estimatedTime="6 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 7', title: 'ست عبارات قبل الاختزال', tone: 'teal',
        body: <p>أربع عبارات من الكتاب المدرسي عن الأعداد الناطقة، واثنتان من المنصّة عن PGCD. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        kusur: { label: 'الكسور المتساوية والجمع', emoji: '🔢' },
        natiq: { label: 'الأعداد الناطقة: المقلوب والقسمة', emoji: '➗' },
        pgcd: { label: 'PGCD والأوليان فيما بينهما', emoji: '🤝' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك عن الكسور لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ باختزال ملموس، خطوة بخطوة.', advice: 'راجع الكسور المتساوية: نضرب أو نقسم البسط والمقام على نفس العدد.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى القسمة على كسر: نضرب في المقلوب.', cta: 'أبدأ النشاط 8', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الحساب على الكسور وPGCD متحكَّم فيهما.', advice: 'حاول حلّ النشاط 8 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0], 2), id: 'prep-7', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_ITEMS[1], 2), id: 'prep-8', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_ITEMS[2], 2), id: 'prep-9', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_ITEMS[3], 2), id: 'prep-10', requires: ['al-aadad-al-natiqa'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-a', requires: ['awwaliyan-taarif'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1]), id: 'prep-b', requires: ['khwarizmiyat-iqlidus'] },
      ]}
    />
  );
}
