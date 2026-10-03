import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Six affirmations de la PLATEFORME (les items 1–5 du manuel p. 103 sont ceux de la leçon 1),
 * dans la forme « أصحيح أم خاطئ؟ برّر إجابتك » : l'égalité de deux fractions par le produit en croix (1 vrai, 2 faux),
 * l'ordre de trois points alignés (3), la propriété de Thalès de la leçon 1 (4), la droite des milieux (5), Pythagore
 * (6, pour l'exercice 14). Aucun nombre de نشاط 2. Diagnostic JAMAIS bloquant ; `id` et `requires` littéraux (audit).
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
        tag: 'أستعدّ — عبارات من المنصّة', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارات عن تساوي كسرين، وترتيب نقط على مستقيم، وخاصية طالس التي تعلّمتها في الدرس السابق، ومستقيم المنتصفين، وخاصية فيثاغورس. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        kasr: { label: 'تساوي كسرين (الجداء المتصالب)', emoji: '✖️' },
        tartib: { label: 'ترتيب نقط على مستقيم', emoji: '↔️' },
        talis: { label: 'خاصية طالس', emoji: '📐' },
        muntasaf: { label: 'مستقيم المنتصفين', emoji: '⚖️' },
        fithaghuras: { label: 'خاصية فيثاغورس', emoji: '📏' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بلوح وميزان ماء تحرّكهما بيدك.', advice: 'راجع مقارنة كسرين بالجداء المتصالب، وخاصية طالس من الدرس السابق.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: نقطة بين نقطتين تعني أنهما في جهتين مختلفتين منها.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الكسور والترتيب وخاصية طالس متحكَّم فيها.', advice: 'في المستوى المتقدم ضع النقطتين من جهتي A بنفسك.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['tasawi-kasrayn'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tasawi-kasrayn'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['tartib-nuqat'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['talis-mubashira'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['mustaqim-muntasafayn'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['fithaghuras'] },
      ]}
    />
  );
}
