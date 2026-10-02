import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le manuel n'a aucun item « أستعدّ » pour ce sujet (ses items 1–10 p. 55 vont
 * aux leçons 1 et 2) : neuf affirmations de la PLATEFORME, dans la forme du manuel — traduire une
 * phrase (unité 4, ترييض مشكلة), périmètres et aires, pourcentages, vérifier une ثنائية et résoudre
 * une jumla (leçons 1 et 2). Diagnostic JAMAIS bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — عبارات من المنصّة', title: 'تسع عبارات قبل الانطلاق', tone: 'teal',
        body: <p>لنحلّ مشكلة بجملة معادلتين نحتاج إلى ترجمة جملة من النص، وإلى قوانين المحيطات والمساحات والنسب المئوية، وإلى التحقق من ثنائية وحل جملة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        tarjama: { label: 'ترجمة جملة من النص', emoji: '✍️' },
        hisab: { label: 'المحيطات والمساحات', emoji: '📐' },
        nisba: { label: 'النسب المئوية', emoji: '🏷️' },
        jumla: { label: 'التحقق من ثنائية وحل جملة', emoji: '🔀' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بقصة تترجمها بيدك خطوة خطوة.', advice: 'راجع درسي «مفهوم جملة معادلتين» و«حل جملة جبريا» من هذه الوحدة.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى ترتيب عددي الثنائية، وإلى أنّ المحيط ضعف مجموع البعدين.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'تعرف كيف تحلّ جملة: بقي أن تتعلّم كيف تترجم قصة إلى جملة.', advice: 'في المستوى المتقدّم اختر المجهولين وترجم المتحف دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['tarjama-ibara'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tarjama-ibara'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['muhit-misaha'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['muhit-misaha'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['nisba-mia'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['nisba-mia'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['tahaqquq-thunaiya'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['tahaqquq-thunaiya'] },
        { ...prepQuestion(PREP_ITEMS[8]), id: 'prep-9', requires: ['hall-jumla'] },
      ]}
    />
  );
}
