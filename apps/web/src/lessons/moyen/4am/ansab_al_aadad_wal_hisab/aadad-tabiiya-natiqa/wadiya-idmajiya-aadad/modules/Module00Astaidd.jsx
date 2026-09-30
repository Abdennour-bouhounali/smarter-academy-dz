import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») sur ce que la situation
 * mobilise : divisibilité par 4 et 10, diviseurs d'un multiple, diviseurs communs.
 * Aucune ne donne le nombre cherché.
 * Diagnostic des acquis antérieurs, JAMAIS bloquant : aucune `assessment`, la
 * suite est toujours ouverte. `id` et `requires` restent littéraux (audit).
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
        body: <p>الوضعية تعبّئ قواعد قابلية القسمة، وخواص القواسم، والقواسم المشتركة. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎' },
        khawass: { label: 'قاسم عدد ومضاعفاته', emoji: '🧩' },
        mushtaraka: { label: 'القواسم المشتركة', emoji: '🤝' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 2 (قواعد قابلية القسمة) والدرس 4 (القواسم المشتركة).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: عدد يقبل القسمة على 8 يقبل القسمة على 4، والعكس غير صحيح.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول حلّ الوضعية دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qawaid-qisma'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['qawasim-mushtaraka'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['qawasim-mushtaraka'] },
      ]}
    />
  );
}
