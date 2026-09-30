import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS, PREP_PLATFORM_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ (p. 19). Les items 1, 2, 4 et 10 du manuel (les autres
 * items vont aux leçons 3, 4 et 5 : extraction → destinations.prep.items),
 * plus deux affirmations de la plateforme, déclarées comme telles.
 * Il mesure les TROIS acquis que la leçon suppose — le carré d'un nombre
 * (positif ou négatif), la propriété de Pythagore et sa réciproque, la touche
 * √ de la calculatrice — et n'enseigne jamais le جذر lui-même. Jamais
 * bloquant ; `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 19', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>أربع عبارات من الكتاب المدرسي واثنتان من المنصّة. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        murabba: { label: 'مربع عدد', emoji: '🔢' },
        fithaghuras: { label: 'خاصية فيثاغورس', emoji: '📐' },
        hasiba: { label: 'اللمسة √ في الحاسبة', emoji: '🧮' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط الأول يبدأ من مربّع ترسمه أنت على مسطرة.', advice: 'راجع أن مربع العدد هو جداؤه في نفسه، ومربع عدد سالب موجب.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: خاصية فيثاغورس تعطي مربع الوتر، لا الوتر نفسه.', cta: 'أبدأ النشاط 1', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'المربعات وخاصية فيثاغورس متحكَّم فيها.', advice: 'حاول حلّ النشاط 1 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[0]), id: 'prep-3', requires: ['murabba-adad'] },
        { ...prepQuestion(PREP_ITEMS[3], 2), id: 'prep-4', requires: ['khassiyat-fithaghuras'] },
        { ...prepQuestion(PREP_PLATFORM_ITEMS[1], 2), id: 'prep-5', requires: ['khassiyat-fithaghuras'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-6', requires: ['alat-hasiba-jidhr'] },
      ]}
    />
  );
}
