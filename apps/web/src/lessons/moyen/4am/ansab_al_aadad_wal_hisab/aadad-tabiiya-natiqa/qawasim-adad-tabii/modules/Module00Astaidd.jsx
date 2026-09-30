import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le manuel n'en a pas pour cette leçon : six affirmations de la
 * plateforme (déclarées « عبارة إضافية من المنصّة ») sur les deux acquis dont l'activité 2 a besoin.
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
        tag: 'أستعدّ — قبل النشاط 2', title: 'ست عبارات قبل البحث عن القواسم', tone: 'teal',
        body: <p>قبل أن تبحث عن كل قواسم عدد، تحقّق من أمرين: معنى «قاسم» وقواعد قابلية القسمة. ليست اختبارًا ولا تمنعك من المتابعة.</p>,
      }}
      skills={{
        jidaa: { label: 'قاسم عدد طبيعي', emoji: '✖️' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 2 يبدأ بكتابة 60 على شكل جداء، خطوة بخطوة.', advice: 'راجع الدرس 1: b قاسم لـ a معناه a = b × q مع q عدد طبيعي.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى قاعدة 4: تُقرأ من رقمي العشرات والآحاد معًا.', cta: 'أبدأ النشاط 2', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'معنى القاسم وقواعد قابلية القسمة متحكَّم فيهما.', advice: 'حاول حلّ النشاط 2 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['qawaid-qabiliyat-al-qisma'] },
      ]}
    />
  );
}
