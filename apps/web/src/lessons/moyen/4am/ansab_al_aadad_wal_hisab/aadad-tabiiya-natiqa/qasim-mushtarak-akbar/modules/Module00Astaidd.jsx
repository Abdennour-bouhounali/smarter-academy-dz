import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») sur la méthode du
 * درس 2 : trouver TOUS les diviseurs d'un nombre, sans en oublier.
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
        tag: 'أستعدّ — قبل النشاط 4', title: 'أربع عبارات عن قواسم عدد', tone: 'teal',
        body: <p>لتجد القواسم المشتركة لعددين، يجب أن تعرف أولًا كيف تجد كل قواسم عدد واحد دون أن تنسى أيًّا منها.</p>,
      }}
      skills={{
        qawasim: { label: 'البحث عن قواسم عدد', emoji: '🔢' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: في النشاط 4 تبني الباقات بيدك قبل أي حساب.', advice: 'راجع طريقة الدرس 2: نختبر الأعداد التي مربعها أصغر من العدد أو يساويه، وكل باقٍ معدوم يعطي قاسمين.', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه: كل قاسم يأتي مع شريكه، فلا تنسَ الشريك.', cta: 'أبدأ النشاط 4', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'طريقة البحث عن القواسم متحكَّم فيها.', advice: 'حاول حلّ النشاط 4 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['tariqa-qawasim'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['tariqa-qawasim'] },
      ]}
    />
  );
}
