import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Le « أستعدّ » du manuel (p. 43) appartient aux leçons
 * 1 à 3 ; la synthèse pose donc sept affirmations de la plateforme
 * (« عبارة إضافية من المنصّة ») sur ce que la situation
 * mobilisent : une équation (درس 1), le produit nul (درس 2), une inéquation
 * et sa représentation (درس 3), une traduction (درس 4), une factorisation
 * (الوحدة 3). Aucune n'emploie les nombres du مسبح. Diagnostic JAMAIS
 * bloquant ; `id` et `requires` littéraux (audit).
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
        tag: 'أستعدّ — عبارات من المنصّة', title: 'سبع عبارات قبل الوضعية الإدماجية', tone: 'teal',
        body: <p>الوضعية تعبّئ ما تعلّمته في دروس الوحدة الأربعة: حل معادلة، الجداء المعدوم، حل متراجحة وتمثيل حلولها، وترييض مشكلة، مع النشر والتحليل. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        muadala: { label: 'حل معادلة من الدرجة الأولى', emoji: '⚖️' },
        jidaa: { label: 'خاصية الجداء المعدوم', emoji: '0️⃣' },
        mutarajiha: { label: 'حل متراجحة واتجاهها', emoji: '↔️' },
        tamthil: { label: 'تمثيل الحلول على مستقيم مدرّج', emoji: '📏' },
        tarrid: { label: 'ترجمة نص بعبارة حرفية', emoji: '📝' },
        tahlil: { label: 'النشر والتحليل', emoji: '🧩' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: تحليل الوضعية يمرّ بثلاث مراحل كما في الكتاب.', advice: 'راجع الدرس 3 (المتراجحات وتمثيل حلولها) والدرس 4 (ترييض مشكلة).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعية.', advice: 'انتبه: القسمة على عدد سالب تغيّر اتجاه المتراجحة، والمبلغ الثابت لا يُضرب في المجهول.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعية متحكَّم فيها.', advice: 'حاول ترجمة الصيغتين دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['hall-muadala'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['hall-muadala'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['jidaa-maadum-khassiya'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['hall-mutarajiha'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['tamthil-hulul'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['tarrid-tarjama'] },
        { ...prepQuestion(PREP_ITEMS[6]), id: 'prep-7', requires: ['nashr-tahlil'] },
      ]}
    />
  );
}
