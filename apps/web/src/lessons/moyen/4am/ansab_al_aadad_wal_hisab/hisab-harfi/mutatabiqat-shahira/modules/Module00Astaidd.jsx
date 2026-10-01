import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 31, items 5 et 6, + six affirmations de la
 * plateforme dans la même forme). Mesure les quatre acquis de la leçon :
 * le développement de (a + b)(c + d) et la réduction des termes semblables
 * (leçon 1), le carré d'un relatif / d'un décimal / d'un produit, les
 * puissances de 10 (années antérieures). Diagnostic JAMAIS bloquant, aucune
 * `assessment`. `id` et `requires` restent littéraux (audit).
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="5 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 31', title: 'ثماني عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب المدرسي وست عبارات من المنصّة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        nashr: { label: 'نشر جداء قوسين', emoji: '🧮' },
        tabsit: { label: 'الحدود المتشابهة', emoji: '🧩' },
        murabba: { label: 'مربع عدد ومربع جداء', emoji: '🟩' },
        quwa: { label: 'مربع عدد عشري وقوى العدد 10', emoji: '🔟' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ بملعب تُحسب كل منطقة فيه أمامك.', advice: 'راجع نشر جداء قوسين: كل حد من القوس الأول يُضرب في كل حد من القوس الثاني.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: مربع جداء يُربّع فيه المعامل أيضًا، ومربع عدد سالب موجب.', cta: 'أبدأ النشاط 2', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'تنشر جداء قوسين وتجمع الحدود المتشابهة وتحسب المربعات.', advice: 'حاول أن تجد المتطابقة بنفسك على الملعب قبل أن تقرأها.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0], 2), id: 'prep-1', requires: ['nashr-qawsayn'] },
        { ...prepQuestion(PREP_ITEMS[1], 2), id: 'prep-2', requires: ['nashr-qawsayn'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['tabsit-hudud'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['tabsit-hudud'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['quwa-ashara'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['quwa-ashara'] },
      ]}
    />
  );
}
