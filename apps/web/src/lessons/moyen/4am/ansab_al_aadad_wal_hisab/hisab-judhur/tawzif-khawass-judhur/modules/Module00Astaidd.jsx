import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 7, 8 et 9 du manuel (p. 19 : المتطابقات
 * الشهيرة), puis six affirmations de la plateforme dans la même forme pour
 * les autres acquis supposés : la خاصية التوزيعية, le جداء et la قسمة de deux
 * racines et √(a²b) = a√b (leçon 4), la définition de √a (leçon 1).
 * Diagnostic JAMAIS bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 19', title: 'تسع عبارات قبل الانطلاق', tone: 'teal',
        body: <p>ثلاث عبارات من الكتاب عن النشر، وست عبارات من المنصّة عن الحساب على الجذور. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        huwiyat: { label: 'النشر والخاصية التوزيعية', emoji: '🧮' },
        jidaa: { label: 'جداء جذرين وحاصل قسمتهما', emoji: '✖️' },
        jidhr: { label: 'الجذر التربيعي', emoji: '√' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بمربّع تبلّطه بيدك.', advice: 'راجع المتطابقات الشهيرة وخاصية الجداء في درس العمليات على الجذور.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى الحدّ 2ab في نشر مربع مجموع.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'النشر والحساب على الجذور متحكَّم فيهما.', advice: 'في المستوى المتقدّم ابحث عن أصغر بلاطة دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['jidaa-jidhrayn'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['jidaa-jidhrayn'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['qismat-jidhrayn'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['jidhr-a2b'] },
        { ...prepQuestion(PREP_ITEMS[8]), id: 'prep-9', requires: ['jidhr-taarif'] },
      ]}
    />
  );
}
