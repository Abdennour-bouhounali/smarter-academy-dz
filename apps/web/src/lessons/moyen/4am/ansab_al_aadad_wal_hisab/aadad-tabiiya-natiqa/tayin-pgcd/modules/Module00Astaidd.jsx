import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») : les diviseurs d'un
 * nombre (درس 2) et la définition du PGCD (درس 4), dont l'activité 5 a besoin.
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
        tag: 'أستعدّ — قبل النشاط 5', title: 'أربع عبارات قبل تعيين PGCD', tone: 'teal',
        body: <p>تعيين PGCD بحصر القواسم يحتاج أمرين: أن تجد كل قواسم عدد، وأن تعرف ما هو القاسم المشترك الأكبر.</p>,
      }}
      skills={{
        qawasim: { label: 'قواسم عدد', emoji: '🔢' },
        pgcd: { label: 'القاسم المشترك الأكبر', emoji: '🤝' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 5 يمرّ بالمراحل الثلاث واحدة واحدة.', advice: 'راجع الدرس 2 (طريقة البحث عن القواسم) والدرس 4 (تعريف PGCD).', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه: PGCD هو الأكبر بين القواسم المشتركة، لا أيّ قاسم مشترك.', cta: 'أبدأ النشاط 5', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'القواسم والقاسم المشترك الأكبر متحكَّم فيهما.', advice: 'حاول حلّ النشاط 5 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['pgcd-taarif'] },
      ]}
    />
  );
}
