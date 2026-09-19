import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';
/** Module 0 — أستعدّ 7–10 (p. 7) : الأعداد الناطقة. Jamais bloquant. */
export default function Module00Astaidd() {
  return (
    <PrerequisiteDiagnostic ctx={MODULE_CTX} navLinks={getNavLinks(0)} moduleTitle="🎯 أستعدّ" moduleSubtitle="أصحيح أم خاطئ؟ برّر إجابتك. تشخيص قصير لا يمنعك من متابعة الدرس." estimatedTime="6 دقائق"
      brief={{ tag: 'أستعدّ — الكتاب ص 7', title: 'أربع عبارات عن الأعداد الناطقة', tone: 'teal', body: <p>من الكتاب المدرسي. ليست اختبارًا: الغاية أن يعرف الدرس أين يبطئ من أجلك.</p> }}
      skills={{ kusur: { label: 'الكسور المتساوية والجمع', emoji: '🔢' }, natiq: { label: 'الأعداد الناطقة: المقلوب والقسمة', emoji: '➗' } }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك عن الكسور لا تزال هشّة.', body: 'لا بأس: الدرس يبدأ باختزال ملموس، خطوة بخطوة.', advice: 'راجع الكسور المتساوية: نضرب أو نقسم البسط والمقام على نفس العدد.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى القسمة على كسر: نضرب في المقلوب.', cta: 'أبدأ النشاط 8', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الحساب على الكسور متحكَّم فيه.', advice: 'حاول حلّ النشاط 8 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={PREP_ITEMS.map((it) => ({ id: `prep-${it.n}`, skill: it.skill, points: 2, requires: ['al-aadad-al-natiqa'],
        prompt: <span className="space-y-1 block"><MathText>{it.text}</MathText><SourceTag source={it.source} className="ms-2" /></span>, options: ['صحيح', 'خطأ'], correct: it.answer ? 0 : 1, cols: 2, explain: <MathText>{it.why}</MathText> }))} />
  );
}
