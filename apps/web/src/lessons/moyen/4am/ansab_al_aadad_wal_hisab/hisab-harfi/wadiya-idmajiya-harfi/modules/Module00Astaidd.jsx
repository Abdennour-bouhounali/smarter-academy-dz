import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 1 et 2 du « أستعدّ » du manuel (p. 31 : la valeur
 * d'une expression pour un x donné), puis cinq affirmations de la plateforme
 * (« عبارة إضافية من المنصّة ») sur ce que la situation mobilise : un
 * développement (درس 1), une identité (درس 2), une factorisation (درس 3), une
 * aire, Pythagore. Aucune n'emploie les nombres du bassin. Diagnostic JAMAIS
 * bloquant ; `id` et `requires` littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 31', title: 'سبع عبارات قبل الوضعية الإدماجية', tone: 'teal',
        body: <p>الوضعيات التي تنتظرك (ست وضعيات تدريبية، ثم وضعية الكتاب) تعبّئ ما تعلّمته في الدروس الثلاثة: النشر، المتطابقات الشهيرة والتحليل، مع المساحات وخاصية فيثاغورس. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        qima: { label: 'قيمة عبارة من أجل قيمة لـ x', emoji: '🔢' },
        nashr: { label: 'نشر جداء', emoji: '📐' },
        mutatabiqa: { label: 'المتطابقات الشهيرة', emoji: '²' },
        tahlil: { label: 'تحليل عبارة', emoji: '🧩' },
        masaha: { label: 'مساحات الأشكال', emoji: '⬛' },
        fithaghuras: { label: 'خاصية فيثاغورس', emoji: '📏' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 1 (النشر والتبسيط) والدرس 2 (المتطابقات الشهيرة).', cta: 'أبدأ الوضعيات على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: مربع مجموع فيه حدّ مضاعف، والتحليل كتابة على شكل جداء.', cta: 'أبدأ الوضعيات', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول نمذجة الوضعية دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qimat-ibara'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qimat-ibara'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['nashr-jadaa'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['mutatabiqat'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['tahlil-ibara'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['masahat-ashkal'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['khassiyat-fithaghuras'] },
      ]}
    />
  );
}
