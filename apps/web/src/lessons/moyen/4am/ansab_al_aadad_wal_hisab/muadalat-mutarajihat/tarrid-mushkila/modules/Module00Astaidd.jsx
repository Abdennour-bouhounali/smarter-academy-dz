import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le manuel n'a aucun item « أستعدّ » pour ce sujet : neuf affirmations
 * de la PLATEFORME, dans la forme du manuel, une ou deux par prérequis du propriétaire —
 * résoudre une équation du premier degré et une équation produit nul (leçons 1 et 2), une
 * inéquation (leçon 3), les formules de périmètre et d'aire, les coûts et les pourcentages.
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
        tag: 'أستعدّ — عبارات من المنصّة', title: 'تسع عبارات قبل الانطلاق', tone: 'teal',
        body: <p>لترييض مشكلة نحتاج إلى حل المعادلات والمتراجحات، وإلى قوانين المحيطات والمساحات وحساب التكاليف. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        muadala: { label: 'حل معادلة ومعادلة جداء معدوم', emoji: '⚖️' },
        mutarajiha: { label: 'حل متراجحة', emoji: '📏' },
        hisab: { label: 'المحيطات والمساحات', emoji: '📐' },
        taklifa: { label: 'التكاليف والنسب', emoji: '🧾' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بقصة عائلة تبني معادلتها بيدك.', advice: 'راجع حل المعادلات والمتراجحات في الدروس الثلاثة السابقة من هذه الوحدة.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى تغيير اتجاه المتراجحة عند القسمة على عدد سالب.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'تعرف كيف تحلّ: بقي أن تتعلّم كيف تترجم نصًّا إلى معادلة.', advice: 'في المستوى المتقدّم ابنِ نموذج الأبناء الثلاثة دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['hal-muadala'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['hal-muadala'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['jidaa-maadum'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['hal-mutarajiha'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['hal-mutarajiha'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['muhit-misaha'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['muhit-misaha'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['taklifa-nisba'] },
        { ...prepQuestion(PREP_ITEMS[8]), id: 'prep-9', requires: ['taklifa-nisba'] },
      ]}
    />
  );
}
