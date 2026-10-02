import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 1 à 8 du manuel (p. 55 ; 9 et 10 sont à la leçon hall-jabri),
 * dans leur forme « أصحيح أم خاطئ؟ برّر إجابتك » : résoudre une équation du premier degré à une
 * inconnue (1, 3, 8), tester un nombre dans une équation (2, 4, 7), remplacer DEUX lettres pour
 * tester une égalité (5, 6) — exactement le geste des jauges du module 1. Diagnostic JAMAIS
 * bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 55', title: 'ثماني عبارات قبل الانطلاق', tone: 'teal',
        body: <p>ثماني عبارات من الكتاب عن حل معادلة بمجهول واحد، واختبار عدد بالتعويض، وتعويض حرفين معًا. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        hal: { label: 'حل معادلة من الدرجة الأولى بمجهول واحد', emoji: '⚖️' },
        taawid: { label: 'اختبار عدد بالتعويض في معادلة', emoji: '🔍' },
        harfan: { label: 'تعويض حرفين معًا في مساواة', emoji: '✌️' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بلوحتين تقرأ عليك كل تعويض.', advice: 'راجع درس حل معادلة من الدرجة الأولى بمجهول واحد، وتدرّب على تعويض حرف بعدد ثم الحساب.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: حين تعوّض حرفين، يأخذ كل حرف عدده هو، ثم نحسب الطرفين.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'حل المعادلة واختبار الأعداد بالتعويض متحكَّم فيهما.', advice: 'في المستوى المتقدّم اعثر على الثنائية دون أي تلميح.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['hal-muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['taawid-qima'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['hal-muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['taawid-qima'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['taawid-majhulayn'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['taawid-majhulayn'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['taawid-qima'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['hal-muadala-ula'] },
      ]}
    />
  );
}
