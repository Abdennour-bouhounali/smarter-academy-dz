import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MethodSteps, SourceTag } from '../../../../../../common/textbook';
import { WorkshopScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_B, METHOD_EUCLID } from '../content/textbook';

/**
 * Module 3 — نشاط 6 ب (p. 9) + طريقة إقليدس (p. 13).
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels),
 * dans le MÊME atelier de couture que le module 1 (thème `workshop`) : on ne
 * coupe plus, on REPORTE le petit ruban le long du grand autant de fois qu'il
 * tient ; le bout qui dépasse est le reste — une division en un geste.
 *   مبتدئ  — 45 cm et 18 cm : deux divisions, l'algorithme entier tient dans
 *            un écran, et la règle d'arrêt (le reste nul) se voit arriver.
 *   متقدم  — 765 et 135, les nombres du manuel, AVEC la comparaison aux
 *            différences : trois divisions contre huit soustractions. C'est
 *            la question même de l'activité.
 *
 * Puis 3356 et 1528 à l'étape 3. LP : P3, P4, P5.
 */
export default function Module03KhwarizmiyatIqlidus() {
  const [e1, setE1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [e2, setE2] = useState(false);
  const { a, b, second } = ACTIVITY_B.numbers;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="نشاط 6 ب — خوارزمية إقليدس" moduleSubtitle={ACTIVITY_B.subtitle} estimatedTime="15 دقيقة"
      brief={{ tag: 'أنشطة ص 9 — طرائق ص 13', title: 'قسمة واحدة تختصر طرحات كثيرة', tone: 'emerald',
        headline: 'هيا نقيس الأشرطة!', emoji: '📏', visual: <WorkshopScene />,
        body: <div className="space-y-1"><p><MathText>{ACTIVITY_B.questions[0]}</MathText></p><p>{ACTIVITY_B.questions[1]}</p><SourceTag source={ACTIVITY_B.source} /></div> }}
      intro={(
        // Le niveau par défaut sert LA TÂCHE DU MODULE : ce module porte
        // l'activité du manuel dans son titre, et sa première étape attend
        // que CETTE manipulation soit finie (`onFinished`). Ouvrir sur le
        // petit nombre cachait l'activité derrière un onglet et laissait
        // l'élève devant une étape qu'il ne pouvait pas satisfaire.
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="نشاط الكتاب: 765 و 135، مع المقارنة بعدد خطوات الفروق. وللتمرّن أولًا، جرّب المستوى المبتدئ."
          levels={{
            beginner: () => (
              <Manipulation type="euclidean-algorithm" a={45} b={18}
                title="تمرّن أولًا: 45 و 18"
                lead="ضع نسخًا من الشريط الأصغر على الأكبر، واقرأ ما يبقى. ثم أعد مع القطعة الباقية: متى تتوقّف؟" />
            ),
            advanced: () => (
              <Manipulation type="euclidean-algorithm" a={a} b={b} compareWith="differences"
                title="765 و 135 بطريقة القسمة"
                lead="ضع نسخ الشريط الأصغر على الأكبر، وانقل ما يبقى إلى السطر التالي. في النهاية قارن عدد القسمات بعدد القصّات."
                onFinished={() => setE1(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: '2) اشرح لماذا PGCD(765 ; 135) = PGCD(135 ; 90)', subtitle: 'أنهِ القسمات في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khwarizmiyat-iqlidus" />
              <TapQuestion prompt={<span>باقي القسمة الإقليدية للعدد 765 على 135 هو 90. لماذا <MathText>{'$\\mathrm{PGCD}(765\\ ;\\ 135) = \\mathrm{PGCD}(135\\ ;\\ 90)$'}</MathText>؟</span>}
                options={['لأن كل قاسم مشترك لـ 765 و 135 يقسم الباقي 90 (خاصية 2)، والعكس', 'لأن 90 < 135', 'لأن 765 = 135 × 5', 'لأن 90 قاسم للعدد 135']} correct={0} cols={1} requires={['pgcd-baqi', 'khwarizmiyat-iqlidus']}
                explain={<span><MathText>{'$765 = 135 \\times 5 + 90$'}</MathText>؛ قاسم مشترك لـ 765 و 135 يقسم 90 = 765 − 135 × 5، وقاسم مشترك لـ 135 و 90 يقسم 765.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'طريقة الكتاب: 836 و 1938', done: read,
          content: <MethodSteps method={METHOD_EUCLID} onAllRevealed={() => setRead(true)} /> },
        { num: 3, title: '5) عيّن بطريقة مماثلة PGCD(3356 ; 1528)', done: e2,
          content: <div className="space-y-3"><KnowledgeBrick id="ikhtiyar-al-tariqa" compact /><Manipulation type="euclidean-algorithm" a={second.a} b={second.b} compareWith="differences" title="3356 و 1528" onFinished={() => setE2(true)} /></div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
