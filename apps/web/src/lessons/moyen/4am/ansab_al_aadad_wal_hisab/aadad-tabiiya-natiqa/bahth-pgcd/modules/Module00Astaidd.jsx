import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_ITEMS } from '../content/textbook';

/**
 * Module 0 — أستعدّ. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») : les deux propriétés
 * du درس 3 et le PGCD du درس 4–5, sur lesquels reposent les deux algorithmes.
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
        tag: 'أستعدّ — قبل النشاط 6', title: 'ست عبارات قبل الخوارزميتين', tone: 'teal',
        body: <p>خوارزمية الفروق وخوارزمية إقليدس مبنيّتان على خاصيتي القواسم وعلى معنى PGCD. تحقّق منها أولًا.</p>,
      }}
      skills={{
        khawass: { label: 'خاصيتا القواسم', emoji: '🧩' },
        pgcd: { label: 'PGCD ونتائجه المباشرة', emoji: '🤝' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 6 يطرح خطوة خطوة، وتتابع أنت الأعداد.', advice: 'راجع الدرس 3 (قاسم مشترك لعددين يقسم فرقهما وباقي قسمتهما) والدرس 5 (النتائج المباشرة).', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه: PGCD(a ; 0) = a، وهو ما يوقف الخوارزمية.', cta: 'أبدأ النشاط 6', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'خاصيتا القواسم وPGCD متحكَّم فيها.', advice: 'حاول حلّ النشاط 6 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_ITEMS[0]), id: 'prep-1', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_ITEMS[1]), id: 'prep-2', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_ITEMS[2]), id: 'prep-3', requires: ['khassiya-2'] },
        { ...prepQuestion(PREP_ITEMS[3]), id: 'prep-4', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_ITEMS[4]), id: 'prep-5', requires: ['nataij-mubashira'] },
        { ...prepQuestion(PREP_ITEMS[5]), id: 'prep-6', requires: ['nataij-mubashira'] },
      ]}
    />
  );
}
