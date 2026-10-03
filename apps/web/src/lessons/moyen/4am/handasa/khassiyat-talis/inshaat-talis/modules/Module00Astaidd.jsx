import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le manuel n'a aucun item « أستعدّ » pour cette leçon (les items 1–5 vont à la leçon 1) :
 * sept affirmations de la plateforme, dans la forme « أصحيح أم خاطئ؟ برّر إجابتك », une par acquis déclaré
 * (`priorKnowledge`). Diagnostic JAMAIS bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ', title: 'سبع عبارات قبل الإنشاء', tone: 'teal',
        body: <p>عبارات من المنصّة عن أدوات الإنشاء (الكوس، المدور) والتناسب وخاصية طالس. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        muwazi: { label: 'رسم موازٍ بالمسطرة والكوس', emoji: '📐' },
        mudawwar: { label: 'نقل طول بالمدور', emoji: '🧭' },
        tanasub: { label: 'التناسب والرابع المتناسب', emoji: '➗' },
        talis: { label: 'خاصية طالس', emoji: '📏' },
        aksiya: { label: 'الخاصية العكسية لخاصية طالس', emoji: '🔁' },
        muntasaf: { label: 'مستقيم المنتصفين', emoji: '✂️' },
        fithaghuris: { label: 'خاصية فيثاغورس', emoji: '📐' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بأدوات تحرّكها بيدك.', advice: 'راجع رسم موازٍ بالمسطرة والكوس، وخاصية طالس في المثلث (تساوي نسب الأطوال).', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: قطع متقايسة متتالية عددها 3 تعطي طولا ثلاثة أضعاف القطعة الأولى.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'أدوات الإنشاء وخاصية طالس متحكَّم فيها.', advice: 'في المستوى المتقدّم ابحث عن نقطتين تحقّقان النسبة نفسها.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['insha-muwazi'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qitaa-mutaqayisa'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['kitabat-tanasub'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['talis-nisab'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['talis-aksiya'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['mustaqim-muntasafayn'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['fithaghuris'] },
      ]}
    />
  );
}
