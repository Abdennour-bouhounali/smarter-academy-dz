import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ : « أستعدّ » (p. 23), items 5 et 9 du manuel (la fraction, quotient de deux entiers), plus quatre
 * affirmations de la plateforme sur les items du réseau que la leçon suppose (LEARNING_NET.md §4.4) : `1am.m3.r01` (la
 * division euclidienne de 1AM — leçon publiée, le panneau « راجع قبل أن تنطلق » y renvoie) et `2am.m1.r05` (renvoi en
 * avant : on mesure sa base 1AM, la valeur approchée à l'unité). Diagnostic JAMAIS bloquant ; `id` et `requires` littéraux.
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="7 دقائق"
      brief={{
        tag: 'أستعدّ — الكتاب ص 23', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب وأربع من المنصّة. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه من السنة الأولى قبل أن تبدأ.</p>,
      }}
      skills={{
        qisma: { label: 'القسمة الإقليدية (السنة الأولى)', emoji: '➗' },
        kasr: { label: 'الكسر حاصل قسمة', emoji: '🍰' },
        taqrib: { label: 'القيمة المقرّبة إلى الوحدة', emoji: '🎯' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ بسلّة من 50 بيضة تراها وتعدّها.', advice: 'راجع درس القسمة الإقليدية للسنة الأولى أسفله.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'تحقّق دائمًا أنّ الباقي أصغر من المقسوم عليه.', cta: 'أبدأ النشاط', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'القسمة الإقليدية والقيمة المقرّبة متحكَّم فيهما.', advice: 'جرّب مباشرة بيض المزرعة: 2145 بيضة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-1', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1]), id: 'prep-2', requires: ['qisma-iqlidiya'] },
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-3', requires: ['kasr-hasil-qisma'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-4', requires: ['kasr-hasil-qisma'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[2]), id: 'prep-5', requires: ['qima-muqarraba-wahda'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[3]), id: 'prep-6', requires: ['qima-muqarraba-wahda'] },
      ]}
    />
  );
}
