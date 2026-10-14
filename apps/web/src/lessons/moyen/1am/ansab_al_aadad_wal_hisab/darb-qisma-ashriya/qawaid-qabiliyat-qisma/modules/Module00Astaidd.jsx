import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ : « استحضر مكتسباتي » (p. 36), item 10 (les multiples), et trois affirmations de la plateforme sur
 * l'item du réseau `1am.m3.r01` (la division euclidienne de la leçon précédente). JAMAIS bloquant ; littéraux (audit).
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
        tag: 'استحضر مكتسباتي — الكتاب ص 36', title: 'أربع عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارة من الكتاب وثلاث من المنصّة عن القسمة الإقليدية. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        mudaaf: { label: 'المضاعفات', emoji: '✖️' },
        iqlidiya: { label: 'القسمة الإقليدية', emoji: '➗' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ من جدول أعداد صغيرة.', advice: 'راجع درس القسمة الإقليدية: الباقي أصغر من المقسوم عليه.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'تذكّر: «يقبل القسمة» يعني أنّ الباقي 0.', cta: 'أبدأ النشاط', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'المضاعفات والقسمة الإقليدية متحكَّم فيهما.', advice: 'جرّب المستوى المتقدّم (البطاقات) مباشرة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['mudaaf-ibtidai'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-2', requires: ['qisma-iqlidiya-baqi'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1]), id: 'prep-3', requires: ['qisma-iqlidiya-baqi'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[2]), id: 'prep-4', requires: ['qisma-iqlidiya-baqi'] },
      ]}
    />
  );
}
