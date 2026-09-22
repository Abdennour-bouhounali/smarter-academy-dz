import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { WorkshopScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_A } from '../content/textbook';

/**
 * Module 1 — نشاط 6 أ (p. 9) : les différences successives.
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels),
 * dans l'ATELIER DE COUTURE (thème `workshop`) : deux rubans, et le petit
 * qu'on coupe dans le grand, encore et encore. La plus grande longueur qui
 * mesure les deux rubans mesure aussi ce qui reste après chaque coupe.
 *   مبتدئ  — 21 cm et 14 cm : trois coupes, la chaîne tient dans un écran,
 *            l'invariant se voit d'un maillon à l'autre.
 *   متقدم  — 252 cm et 140 cm, les nombres du manuel : la chaîne est longue,
 *            et cette longueur est ce qui rendra la division désirable (M3).
 *
 * Puis 378 et 315 à l'étape 2, comme le manuel le demande. LP : P1, P2.
 */
export default function Module01AlFuruq() {
  const [d1, setD1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [d2, setD2] = useState(false);
  const { a, b, second } = ACTIVITY_A.numbers;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 6 أ — الفروق المتتابعة" moduleSubtitle={ACTIVITY_A.subtitle} estimatedTime="14 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY_A.title, tone: 'indigo',
        headline: 'هيا نقصّ الأشرطة!', emoji: '✂️', visual: <WorkshopScene />,
        body: <div className="space-y-1"><p>{ACTIVITY_A.intro}</p>{ACTIVITY_A.questions.slice(0, 3).map((q) => <p key={q}><MathText>{q}</MathText></p>)}<SourceTag source={ACTIVITY_A.source} /></div> }}
      intro={(
        // Le niveau par défaut sert LA TÂCHE DU MODULE : ce module porte
        // l'activité du manuel dans son titre, et sa première étape attend
        // que CETTE manipulation soit finie (`onFinished`). Ouvrir sur le
        // petit nombre cachait l'activité derrière un onglet et laissait
        // l'élève devant une étape qu'il ne pouvait pas satisfaire.
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="شريطان في ورشة الخياطة: 252 سم و 140 سم. نقصّ الأصغر من الأكبر، مرّة بعد مرّة. وللتمرّن أولًا، جرّب المستوى المبتدئ بشريطين أقصر."
          levels={{
            beginner: () => (
              <Manipulation type="pgcd-differences" a={21} b={14}
                title="تمرّن أولًا: 21 و 14"
                lead="اسحب الشريط الأصغر على الأكبر لتقصّ منه طوله، وأعد. لاحظ: القاسم المشترك الأكبر لا يتغيّر من قصّة إلى أخرى." />
            ),
            advanced: () => (
              <Manipulation type="pgcd-differences" a={a} b={b}
                title="جدول الكتاب: 252 و 140 وفرقهما"
                lead="قصّ الشريط الأصغر من الأكبر إلى أن لا يبقى شيء. لاحظ العمود الأيمن: القاسم المشترك الأكبر لا يتغيّر."
                onFinished={() => setD1(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: '1) لماذا PGCD(252 ; 140) = PGCD(140 ; 112)؟', subtitle: 'أنهِ الطرحات في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="pgcd-farq" lead="252 − 140 = 112. كل قاسم مشترك لـ 252 و 140 يقسم فرقهما 112." />
              <TapQuestion prompt={<span>لماذا <MathText>{'$\\mathrm{PGCD}(252\\ ;\\ 140) = \\mathrm{PGCD}(140\\ ;\\ 112)$'}</MathText>؟</span>}
                options={['كل قاسم مشترك لـ 252 و 140 يقسم أيضًا 252 − 140 = 112، فللزوجين نفس القواسم المشتركة', 'لأن 112 أصغر من 140', 'لأن 252 = 2 × 140 − 28', 'لأن 140 قاسم للعدد 252']} correct={0} cols={1} requires={['pgcd-farq']}
                explain={<span>خاصية 1 (الدرس 3): القاسم المشترك يقسم الفرق. والعكس صحيح: قاسم مشترك لـ 140 و 112 يقسم مجموعهما 252.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text={ACTIVITY_A.misprint} compact />
            </div>
          ) },
        { num: 2, title: '4) عيّن بطريقة مماثلة PGCD(378 ; 315)', done: d2,
          content: <div className="space-y-3"><KnowledgeBrick id="khwarizmiyat-al-furuq" /><Manipulation type="pgcd-differences" a={second.a} b={second.b} title="378 و 315" onFinished={() => setD2(true)} /></div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
