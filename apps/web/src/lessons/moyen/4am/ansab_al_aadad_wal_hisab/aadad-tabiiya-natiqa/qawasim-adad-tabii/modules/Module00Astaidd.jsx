import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les
 * deux كفاءات en alternance (règle des pilotes, propriétaire 2026-11-07). Les six énoncés de la plateforme d'avant restent dans
 * textbook.js comme source. Diagnostic des acquis antérieurs, JAMAIS bloquant : aucune `assessment`, la suite est toujours
 * ouverte. `id` et `requires` restent littéraux (audit).
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
        tag: 'أستعدّ — قبل النشاط 2', title: 'عشر عبارات قبل البحث عن القواسم', tone: 'teal',
        body: <p>ليست اختبارًا: الغاية أن تعرف أنت ما ينبغي أن تراجعه قبل أن تبدأ.</p>,
      }}
      skills={{
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        jidaa: { label: 'قاسم عدد طبيعي', emoji: '✖️', lesson: 'qasim-adad-tabii' },
        qawaid: { label: 'قواعد قابلية القسمة', emoji: '🔎', lesson: 'qawaid-qabiliyat-qisma' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 2 يبدأ بكتابة 60 على شكل جداء، خطوة بخطوة.', advice: 'راجع الدرس 1: b قاسم لـ a معناه a = b × q مع q عدد طبيعي.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه إلى قاعدة 4: تُقرأ من رقمي العشرات والآحاد معًا.', cta: 'أبدأ النشاط 2', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'معنى القاسم وقواعد قابلية القسمة متحكَّم فيهما.', advice: 'حاول حلّ النشاط 2 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['qawaid-qabiliyat-al-qisma'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['qasim-jidaa'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['qawaid-qabiliyat-al-qisma'] },
      ]}
    />
  );
}
