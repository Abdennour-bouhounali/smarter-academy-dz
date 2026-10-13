import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») sur ce que les situations
 * mobilisent : diviseurs communs, PGCD, algorithme d'Euclide. Aucune ne donne les nombres du test final.
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
        tag: 'أستعدّ — قبل الوضعية', title: 'ست عبارات قبل الوضعيات', tone: 'teal',
        body: <p>الوضعيات تعبّئ القواسم المشتركة، والقاسم المشترك الأكبر، وخوارزمية إقليدس. تحقّق منها قبل أن تبدأ؛ النتيجة لا تمنعك من المتابعة.</p>,
      }}
      skills={{
        qawasim: { label: 'القواسم المشتركة', emoji: '🤝' },
        pgcd: { label: 'القاسم المشترك الأكبر', emoji: '🎯' },
        iqlidus: { label: 'خوارزمية إقليدس', emoji: '🔁' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: ستحلّ ست وضعيات تدريبية خطوة بخطوة.', advice: 'راجع الدرس 4 (القاسم المشترك الأكبر) والدرس 6 (البحث عن PGCD).', cta: 'أبدأ الوضعية على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الوضعيات.', advice: 'انتبه: PGCD هو أكبر قاسم مشترك، وهو آخر باقٍ غير معدوم في خوارزمية إقليدس.', cta: 'أقرأ الوضعية', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'الأدوات التي تحتاجها الوضعيات متحكَّم فيها.', advice: 'حاول حلّ الوضعيات دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['qawasim-mushtaraka'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['qawasim-mushtaraka'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['pgcd-baqi'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['khwarizmiyat-iqlidus'] },
      ]}
    />
  );
}
