import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») : l'activité 3 manipule
 * « n يقسم a » et le reste de la division euclidienne.
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
        tag: 'أستعدّ — قبل النشاط 3', title: 'ست عبارات قبل خواص القواسم', tone: 'teal',
        body: <p>النشاط 3 يستعمل أمرين: معنى «n يقسم a» والقسمة الإقليدية وباقيها. تحقّق منهما أولًا؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        jidaa: { label: 'n يقسم a', emoji: '✖️' },
        qisma: { label: 'القسمة الإقليدية', emoji: '➗' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 3 يعمل على أمثلة عددية قبل أي برهان.', advice: 'راجع الدرس 1: القسمة الإقليدية a = b × q + r مع r < b، و b يقسم a إذا كان r = 0.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى شرط الباقي: أصغر من المقسوم عليه.', cta: 'أبدأ النشاط 3', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'معنى القاسم والقسمة الإقليدية متحكَّم فيهما.', advice: 'حاول حلّ النشاط 3 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['qisma-iqlidiya'] },
      ]}
    />
  );
}
