import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 9 et 10 du manuel (p. 55 : exprimer y à partir de y + 2x = 1,
 * puis le calculer pour x = 3), puis six affirmations de la plateforme dans la même forme pour
 * les autres acquis supposés : transposer un terme, remplacer une inconnue par une valeur,
 * multiplier les DEUX membres d'une égalité (la طريقة الجمع en dépend), résoudre une équation du
 * premier degré à une inconnue (leçon muadala-ula). Diagnostic JAMAIS bloquant ; `id` et
 * `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 55', title: 'ثماني عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب، وست عبارات من المنصّة عن نقل حدّ، وتعويض مجهول بقيمة، وضرب طرفي مساواة، وحل معادلة بمجهول واحد. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        naql: { label: 'نقل حدّ والتعبير عن مجهول بدلالة الآخر', emoji: '↔️' },
        taawid: { label: 'تعويض مجهول بقيمة', emoji: '🔍' },
        darb: { label: 'ضرب طرفي مساواة في العدد نفسه', emoji: '✖️' },
        hal: { label: 'حل معادلة من الدرجة الأولى بمجهول واحد', emoji: '⚖️' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ ببطاقتين تحرّكهما بيدك.', advice: 'راجع نقل حدّ من طرف إلى آخر بتغيير إشارته، ودرس حل معادلة من الدرجة الأولى بمجهول واحد.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: عندما نضرب مساواة في عدد، نضرب طرفيها معًا.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'النقل والتعويض والضرب في الطرفين وحل معادلة بمجهول واحد متحكَّم فيها.', advice: 'في المستوى المتقدّم حلّ جملة النشاط 2 بالطريقتين دون أي مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['naql-hudud'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['taawid-qima'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['naql-hudud'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['taawid-qima'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['darb-tarafayn'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['darb-tarafayn'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['hal-muadala-ula'] },
        { ...prepQuestion(PREP_ITEMS[7]), id: 'prep-8', requires: ['hal-muadala-ula'] },
      ]}
    />
  );
}
