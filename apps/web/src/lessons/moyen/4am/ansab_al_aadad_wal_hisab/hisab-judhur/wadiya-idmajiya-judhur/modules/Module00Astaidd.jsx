import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Six affirmations de la plateforme (« عبارة إضافية من المنصّة »)
 * sur ce que la situation mobilise : la racine carrée (leçon 1), les solutions
 * de x² = a (leçon 3), l'écriture a√b (leçon 5). Aucune n'emploie les nombres
 * de la زربية. Diagnostic JAMAIS bloquant ; `id` et `requires` littéraux (audit).
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
        tag: 'أستعدّ — قبل الوضعية', title: 'ست عبارات قبل الوضعية الإدماجية', tone: 'teal',
        body: <p>الوضعية تعبّئ الجذر التربيعي، وحل معادلة من الشكل «مربع يساوي عددًا»، والكتابة على أبسط شكل. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        jidhr: { label: 'الجذر التربيعي لعدد موجب', emoji: '√' },
        muadala: { label: 'حلول معادلة: مربّع يساوي عددًا', emoji: '±' },
        kitaba: { label: 'أبسط كتابة لجذر تربيعي', emoji: '🧩' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 1 (الجذر التربيعي) والدرس 3 (المعادلة من الشكل مربع يساوي عددًا).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: الجذر التربيعي عدد موجب دائمًا، والمعادلة قد تقبل حلين.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول حلّ الوضعية دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['jidhr-taarif'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['hulul-x2-a'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['hulul-x2-a'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['kitaba-a-jidhr-b'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['kitaba-a-jidhr-b'] },
      ]}
    />
  );
}
