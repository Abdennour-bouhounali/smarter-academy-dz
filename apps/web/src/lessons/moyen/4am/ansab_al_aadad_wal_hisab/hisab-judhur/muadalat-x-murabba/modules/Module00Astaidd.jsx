import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. L'item 3 du manuel (p. 19 : « 36 هو مربع العدد الوحيد 6 »)
 * et cinq affirmations de la plateforme dans la même forme, qui mesurent les
 * trois `priorKnowledge` : le carré d'un nombre et l'opposé (murabba-adad), la
 * racine carrée de la leçon 1 (jidhr-taarif), les équations du premier degré
 * (muadala-daraja-ula). Jamais bloquant, jamais une preuve ; `id` et
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
        body: <p>العبارة الأولى من الكتاب المدرسي، والخمس الأخرى من المنصّة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        murabba: { label: 'مربع عدد ومعاكسه', emoji: '²' },
        jidhr: { label: 'الجذر التربيعي', emoji: '√' },
        muadala: { label: 'المعادلات من الدرجة الأولى', emoji: '⚖️' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط الأول يبدأ بتحريك عدد على مستقيم ومتابعة مربّعه.', advice: 'راجع مربع عدد سالب: جداء عددين سالبين عدد موجب.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى إشارة مربع العدد السالب، وإلى معاكس العدد.', cta: 'أبدأ النشاط 3', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'مربع عدد، الجذر التربيعي والمعادلات من الدرجة الأولى متحكَّم فيها.', advice: 'حاول أن تحكم بين مراد وعمر قبل أن تحرّك أي شيء.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0], 2), id: 'prep-1', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['muadala-daraja-ula'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['muadala-daraja-ula'] },
      ]}
    />
  );
}
