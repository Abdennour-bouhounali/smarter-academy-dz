import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 6 à 11 du manuel (p. 43 : tester une متباينة pour une
 * valeur, opérer sur une متباينة), puis quatre affirmations de la plateforme dans la même
 * forme pour les autres acquis supposés : le repérage sur un مستقيم مدرّج (années
 * précédentes) et la résolution d'une معادلة (leçon 1 de l'unité).
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
        tag: 'أستعدّ — الكتاب ص 43', title: 'عشر عبارات قبل الانطلاق', tone: 'teal',
        body: <p>ست عبارات من الكتاب عن المتباينات والعمليات عليها، وأربع عبارات من المنصّة عن المستقيم المدرّج وحل معادلة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        ikhtibar: { label: 'اختبار متباينة من أجل قيمة', emoji: '🔎' },
        amaliyat: { label: 'العمليات على طرفي متباينة', emoji: '⚖️' },
        mustaqim: { label: 'المستقيم المدرّج', emoji: '📏' },
        muadala: { label: 'حل معادلة من الدرجة الأولى', emoji: '🧮' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بتجارب على مستقيم مدرّج، قيمة بعد قيمة.', advice: 'راجع ترتيب الأعداد النسبية على مستقيم مدرّج، ودرس حل معادلة من الدرجة الأولى.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى الضرب أو القسمة على عدد سالب: ماذا يحدث لاتجاه المتباينة؟', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'المتباينات والعمليات عليها متحكَّم فيها.', advice: 'في المستوى المتقدّم حوّل المتراجحة بنفسك واختر اتجاه كل سطر.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['muqarana-adad'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['muqarana-adad'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['amaliyat-mutabayinat'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['amaliyat-mutabayinat'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['amaliyat-mutabayinat'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['amaliyat-mutabayinat'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['mustaqim-mudarraj'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['mustaqim-mudarraj'] },
        { ...prepQuestion(PREP_ITEMS[8]), id: 'prep-9', requires: ['hal-muadala'] },
        { ...prepQuestion(PREP_ITEMS[9]), id: 'prep-10', requires: ['hal-muadala'] },
      ]}
    />
  );
}
