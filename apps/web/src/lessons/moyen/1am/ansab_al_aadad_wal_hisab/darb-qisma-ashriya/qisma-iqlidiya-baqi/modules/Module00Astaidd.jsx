import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ : « استحضر مكتسباتي » (p. 36), item 8 du manuel (le plus grand nombre de bouquets, vu au primaire),
 * plus trois affirmations de la plateforme sur l'item du réseau `1am.m1.r01` (ضرب وطرح أعداد طبيعية), que la leçon
 * suppose (LEARNING_NET.md §4.4). Diagnostic JAMAIS bloquant ; `id` et `requires` littéraux (audit).
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
        body: <p>عبارة من الكتاب وثلاث من المنصّة. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        qisma: { label: 'القسمة في التعليم الابتدائي', emoji: '💐' },
        darb: { label: 'ضرب الأعداد الطبيعية', emoji: '✖️' },
        tarh: { label: 'طرح الأعداد الطبيعية', emoji: '➖' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ من 47 زهرة تراها وتعدّها.', advice: 'راجع جدول الضرب، والطرح دون أخطاء في الاحتفاظ.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'تحقّق من كل جداء قبل أن تطرحه.', cta: 'أبدأ النشاط', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الضرب والطرح متحكَّم فيهما.', advice: 'جرّب المستوى المتقدّم في النشاط مباشرة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qisma-ibtidai'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-2', requires: ['darb-tabii'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1]), id: 'prep-3', requires: ['darb-tabii'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[2]), id: 'prep-4', requires: ['tarh-tabii'] },
      ]}
    />
  );
}
