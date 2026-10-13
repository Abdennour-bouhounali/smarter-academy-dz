import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 1–3 du manuel (p. 103) et trois affirmations de la plateforme, dans la forme
 * « أصحيح أم خاطئ؟ برّر إجابتك » : le quatrième proportionnel (1, 4), la droite des milieux (2, 3, 5), le tableau
 * de proportionnalité (6). Les items 4 et 5 du manuel (déjà Thalès) sont revisités au module 4.
 * Diagnostic JAMAIS bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 103', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>ثلاث عبارات من الكتاب وثلاث من المنصّة عن الرابع المتناسب، ومستقيم المنتصفين، وجدول التناسبية. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        rabi: { label: 'الرابع المتناسب والجداء المتصالب', emoji: '✖️' },
        muntasaf: { label: 'مستقيم المنتصفين في مثلث', emoji: '📐' },
        jadwal: { label: 'جدول التناسبية', emoji: '📊' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بساحة تحرّك فيها الشمس بيدك.', advice: 'راجع حساب رابع متناسب بالجداء المتصالب، وخاصيتي مستقيم المنتصفين في مثلث.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: في جدول تناسبية نضرب في العدد نفسه، ولا نضيف العدد نفسه.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الرابع المتناسب ومستقيم المنتصفين متحكَّم فيهما.', advice: 'في الساحة اكتب قاعدتك بنفسك، ثم أصلحها حين تتحرّك الشمس.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['rabi-mutanasib'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['mustaqim-muntasafayn'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['mustaqim-muntasafayn'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['rabi-mutanasib'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['mustaqim-muntasafayn'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['jadwal-tanasub'] },
      ]}
    />
  );
}
