import React from 'react';
import { PrerequisiteDiagnostic } from '../../../../../../common/kit';
import { prepQuestion } from '../../_unit/prepDiagnostic';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PREP_LADDER } from '../content/prep';

/**
 * Module 0 — أستعدّ : DIX affirmations de la plateforme (content/prep.js › PREP_LADDER), de très facile à plus difficile, les deux كفاءات
 * en alternance (règle des pilotes, propriétaire 2026-11-07) ; les six énoncés d'avant restent dans textbook.js comme source.
 * Avant le rollout :. Affirmations de la plateforme (« عبارة إضافية من المنصّة ») : les deux propriétés
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
        // `lesson` : la leçon à réviser quand cette كفاءة est fragile (carte « راجع » prioritaire de la revue)
        khawass: { label: 'خاصيتا القواسم', emoji: '🧩', lesson: 'khawass-qawasim' },
        pgcd: { label: 'PGCD ونتائجه المباشرة', emoji: '🤝', lesson: 'tayin-pgcd' },
      }}
      levels={{
        fragile: { emoji: '🌱', title: 'مكتسباتك لا تزال هشّة.', body: 'لا بأس: النشاط 6 يطرح خطوة خطوة، وتتابع أنت الأعداد.', advice: 'راجع الدرس 3 (قاسم مشترك لعددين يقسم فرقهما وباقي قسمتهما) والدرس 5 (النتائج المباشرة).', cta: 'أبدأ الدرس على كل حال', tone: 'from-emerald-500 to-teal-500' },
        progres: { emoji: '👍', title: 'مكتسباتك في الطريق الصحيح.', body: 'بعض التردّدات ستُصحَّح أثناء الدرس.', advice: 'انتبه: PGCD(a ; 0) = a، وهو ما يوقف الخوارزمية.', cta: 'أبدأ النشاط 6', tone: 'from-teal-500 to-cyan-500' },
        pret: { emoji: '🚀', title: 'أنت جاهز!', body: 'خاصيتا القواسم وPGCD متحكَّم فيها.', advice: 'حاول حلّ النشاط 6 دون مساعدة.', cta: 'أنا جاهز!', tone: 'from-cyan-500 to-blue-500' },
      }}
      questions={[
        { ...prepQuestion(PREP_LADDER[0]), id: 'prep-1', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_LADDER[1]), id: 'prep-2', requires: ['nataij-mubashira'] },
        { ...prepQuestion(PREP_LADDER[2]), id: 'prep-3', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_LADDER[3]), id: 'prep-4', requires: ['nataij-mubashira'] },
        { ...prepQuestion(PREP_LADDER[4]), id: 'prep-5', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_LADDER[5]), id: 'prep-6', requires: ['nataij-mubashira'] },
        { ...prepQuestion(PREP_LADDER[6]), id: 'prep-7', requires: ['khassiya-2'] },
        { ...prepQuestion(PREP_LADDER[7]), id: 'prep-8', requires: ['pgcd-taarif'] },
        { ...prepQuestion(PREP_LADDER[8]), id: 'prep-9', requires: ['khassiya-1'] },
        { ...prepQuestion(PREP_LADDER[9]), id: 'prep-10', requires: ['pgcd-taarif'] },
      ]}
    />
  );
}
