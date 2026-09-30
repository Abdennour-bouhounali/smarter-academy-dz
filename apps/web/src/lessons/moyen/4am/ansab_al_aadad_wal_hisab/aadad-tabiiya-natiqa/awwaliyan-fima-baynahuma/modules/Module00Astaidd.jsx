import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») : PGCD et Euclide
 * (درس 4–6), et les règles de divisibilité qui montrent vite un diviseur commun.
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
        tag: 'أستعدّ — قبل النشاط 7', title: 'خمس عبارات قبل «أوليان فيما بينهما»', tone: 'teal',
        body: <p>لتعرف إن كان عددان أوليين فيما بينهما، ستحسب PGCD أو تبحث عن قاسم مشترك بقواعد قابلية القسمة. تحقّق من الأداتين.</p>,
      }}
      skills={{
        pgcd: { label: 'PGCD وخوارزمية إقليدس', emoji: '🔁' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 7 يبدأ بعددين صغيرين متتاليين.', advice: 'راجع الدرس 6: في خوارزمية إقليدس، PGCD هو آخر باقٍ غير معدوم.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى مجموع الأرقام: يكشف بسرعة القاسم المشترك 3 أو 9.', cta: 'أبدأ النشاط 7', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'PGCD وقواعد قابلية القسمة متحكَّم فيها.', advice: 'حاول حلّ النشاط 7 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['khwarizmiyat-iqlidus'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['qawaid-qisma'] },
      ]}
    />
  );
}
