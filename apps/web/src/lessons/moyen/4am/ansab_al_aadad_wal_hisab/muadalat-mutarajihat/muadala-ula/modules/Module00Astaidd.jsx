import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Les items 1 et 2 du manuel (p. 43 : tester une égalité en
 * remplaçant l'inconnue), puis quatre affirmations de la plateforme dans la même forme
 * pour les autres acquis supposés : les opérations sur les deux membres d'une égalité et
 * le نشر / التبسيط (leçon nashr-tabsit). Diagnostic JAMAIS bloquant ; `id` et `requires`
 * restent littéraux (audit).
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
        tag: 'أستعدّ — الكتاب ص 43', title: 'ست عبارات قبل الانطلاق', tone: 'teal',
        body: <p>عبارتان من الكتاب، وأربع عبارات من المنصّة عن العمليات على طرفي مساواة وعن النشر والتبسيط. ليست اختبارًا: الغاية أن تعرف ما ينبغي أن تراجعه.</p>,
      }}
      skills={{
        taawid: { label: 'اختبار مساواة بتعويض المجهول', emoji: '🔍' },
        musawat: { label: 'العمليات على طرفي مساواة', emoji: '⚖️' },
        tabsit: { label: 'النشر والتبسيط', emoji: '🧮' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ بميزان توازنه بيدك.', advice: 'راجع اختبار مساواة بتعويض المجهول بعدد، ودرس نشر وتبسيط عبارة جبرية.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات الصغيرة ستُصحَّح أثناء الدرس.', advice: 'انتبه: ما يُفعل بطرف من المساواة يُفعل بالطرف الآخر.', cta: 'أبدأ الدرس', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'التعويض والعمليات على الطرفين والتبسيط متحكَّم فيها.', advice: 'في المستوى المتقدّم حلّ ميزان فاطمة دون أي مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['taawid-musawat'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['taawid-musawat'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['amaliyat-tarafayn'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['amaliyat-tarafayn'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['nashr-tabsit'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['nashr-tabsit'] },
      ]}
    />
  );
}
