import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 7, items 1–6). Les six affirmations sont celles du manuel ;
 * l'élève dit vrai/faux et lit la justification (le manuel demande « برّر إجابتك »).
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
        tag: 'أستعدّ — الكتاب ص 7', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>هذه العبارات من الكتاب المدرسي. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        qisma: { label: 'القسمة الإقليدية', emoji: '➗' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط الأول يبدأ من وضعية ملموسة ولا يفترض شيئًا.', advice: 'راجع كتابة القسمة الإقليدية a = b × q + r مع r < b.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى شرط الباقي: أصغر من المقسوم عليه.', cta: 'أبدأ النشاط 1', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'القسمة الإقليدية وقواعد قابلية القسمة متحكَّم فيها.', advice: 'حاول حلّ النشاط 1 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0], 2), id: 'prep-1', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[1], 2), id: 'prep-2', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[2], 2), id: 'prep-3', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['qawaid-qabiliyat-al-qisma'] },
      ]}
    />
  );
}
