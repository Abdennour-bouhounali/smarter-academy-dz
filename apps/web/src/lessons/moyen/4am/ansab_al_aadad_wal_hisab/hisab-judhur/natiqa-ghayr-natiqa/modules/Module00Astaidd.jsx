import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les deux كفاءات en
 * alternance — « العدد الناطق » et « الجذر التربيعي » (règle des pilotes, propriétaire 2026-11-07, rollout de l'unité 2 le 2026-11-09). Les cinq
 * énoncés d'avant (ci-dessous) restent dans textbook.js comme source.
 *
 * Avant le rollout — أستعدّ. Le manuel n'attribue aucun item de « أستعدّ » (p. 19) à
 * ce درس : cinq affirmations de la plateforme, même forme (« أصحيح أم خاطئ؟
 * برّر إجابتك »), étiquetées « عبارة إضافية من المنصّة ». Elles mesurent les
 * trois acquis que la leçon suppose — le nombre rationnel (année antérieure),
 * la définition de √a et valeur exacte / valeur approchée (الدرس 1) — et
 * n'enseignent rien de la leçon. Jamais bloquant ; `id` et `requires` littéraux.
 */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic
      ctx={MODULE_CTX}
      navLinks={getNavLinks(0)}
      moduleTitle="🎯 أستعدّ"
      moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس."
      estimatedTime="8 دقائق"
      brief={{
        tag: 'أستعدّ', title: 'عشر عبارات قبل الانطلاق', tone: 'teal',
        body: <p>من السهل جدًّا إلى الأصعب. ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        natiq: { label: 'العدد الناطق', emoji: '➗', lesson: 'adad-natiq' },
        jidhr: { label: 'الجذر التربيعي لعدد موجب', emoji: '√', lesson: 'jidhr-tarbii' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط يبدأ بمسطرة تسحب عليها ضلع مربّع، ولا يفترض حسابًا صعبًا.', advice: 'راجع تعريف الجذر التربيعي في الدرس 1: العدد الموجب الذي مربعه a.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'تذكّر أن كل عدد عشري عدد ناطق: يُكتب على شكل كسر.', cta: 'أبدأ النشاط 2', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'العدد الناطق والجذر التربيعي متحكَّم فيهما.', advice: 'حاول تصنيف الجذور في النشاط 2 قبل أن تقرأ المعيار.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['adad-natiq'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['adad-natiq'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['adad-natiq'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['adad-natiq'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['adad-natiq'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['jidhr-taarif'] },
      ]}
    />
  );
}
