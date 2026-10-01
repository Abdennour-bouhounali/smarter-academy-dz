import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 3, 4 et 5 du manuel (p. 43 : نشر et تحليل, tous
 * VRAIS), puis six affirmations de la plateforme dans la même forme : une fausse par
 * compétence d'analyse, la résolution de ax + b = 0 (leçon 1 de l'unité) et le
 * produit de relatifs (a × 0 = 0, règle des signes). Diagnostic JAMAIS bloquant ;
 * `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 43', title: 'تسع عبارات قبل الانطلاق', tone: 'teal',
        body: <p>ثلاث عبارات من الكتاب عن النشر والتحليل، وست عبارات من المنصّة عن التحليل وحل معادلة من الدرجة الأولى وضرب الأعداد النسبية. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        nashr: { label: 'النشر بالخاصية التوزيعية', emoji: '🧮' },
        tahlil: { label: 'التحليل باستخراج عامل مشترك', emoji: '🧩' },
        huwiya: { label: 'التحليل بالمتطابقات الشهيرة', emoji: '²' },
        muadala: { label: 'حل معادلة من الدرجة الأولى', emoji: '⚖️' },
        darb: { label: 'ضرب الأعداد النسبية', emoji: '✖️' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بملعب تحرّك ضلعيه بيدك.', advice: 'راجع درس تحليل عبارة جبرية ودرس المعادلات من الدرجة الأولى.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى إشارة الحل عند حل معادلة من الدرجة الأولى، وإلى إشارة العامل السالب عند النشر.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'النشر والتحليل وحل معادلة من الدرجة الأولى متحكَّم فيها.', advice: 'في المستوى المتقدّم ابحث وحدك عن كل القيم التي يختفي عندها الملعب.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['nashr-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tahlil-amil'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['tahlil-huwiya'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['nashr-jidaa'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['tahlil-huwiya'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['hal-muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['hal-muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['darb-nisbiya'] },
        { ...prepQuestion(PREP_ITEMS[8]), id: 'prep-9', requires: ['darb-nisbiya'] },
      ]}
    />
  );
}
