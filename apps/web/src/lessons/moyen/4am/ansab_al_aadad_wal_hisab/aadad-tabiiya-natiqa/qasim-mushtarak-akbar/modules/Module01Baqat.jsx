import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { GardenScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, STARTER } from '../content/textbook';

/**
 * Module 1 — نشاط 4 (p. 8) : 90 و 54، 9 باقات؟ أكبر عدد من الباقات؟
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels),
 * sur le MÊME type `common-divisors` — le contexte est une donnée du type,
 * donc un second niveau ne coûte pas un second composant :
 *
 *   مبتدئ  — 12 ballons et 18 maillots, en équipes (thème `football`, les
 *            objets du terrain de la leçon 1) : quatre diviseurs communs
 *            (1, 2, 3, 6), visibles d'un regard. L'élève voit CE QUE veut
 *            dire « commun » ; les équipes SEULEMENT, jusqu'au plus grand
 *            nombre (6) — pas de listes à ce niveau.
 *   متقدم  — 90 fleurs rouges et 54 blanches, les fleurs du manuel DESSINÉES
 *            en bouquets (thème `garden`) : les listes sont longues, la
 *            recherche demande une stratégie, et le PGCD vaut 18. Les
 *            bouquets d'abord, puis les listes — sur un bouton de l'élève.
 *
 * Les groupes sont de vrais cadres contenant de vrais objets
 * (`GroupingScene`) : « متماثلة » se voit, et ce qui reste est dessiné à part.
 *
 * LP : P1, P3.
 */
export default function Module01Baqat() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { red, white } = ACTIVITY.numbers;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 4 — باقات متماثلة" moduleSubtitle="90 زهرة حمراء و 54 زهرة بيضاء" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        headline: 'هيا نشكّل الباقات!', emoji: '💐', visual: <GardenScene />,
        body: <div className="space-y-1"><p>{ACTIVITY.situation}</p>{ACTIVITY.questions.slice(0, 3).map((q) => <p key={q}>{q}</p>)}<SourceTag source={ACTIVITY.source} /></div> }}
      intro={(
        // Le niveau par défaut sert LA TÂCHE DU MODULE : ce module porte
        // l'activité du manuel dans son titre, et sa première étape attend
        // que CETTE manipulation soit finie (`onFinished`). Ouvrir sur le
        // petit nombre cachait l'activité derrière un onglet et laissait
        // l'élève devant une étape qu'il ne pouvait pas satisfaire.
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="نشاط الكتاب: 90 زهرة حمراء و 54 بيضاء. وإن أردت التمرّن أولًا، جرّب المستوى المبتدئ."
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation type="common-divisors" a={STARTER.numbers.a} b={STARTER.numbers.b} context={STARTER.context} theme="football"
                  title="تمرّن أولًا: 12 كرة و 18 قميصًا"
                  lead="ما أكبر عدد من الفرق المتماثلة يمكن تشكيله دون أن يبقى شيء؟ جرّب عدّة أعداد." />
                <SourceTag source={STARTER.source} />
              </div>
            ),
            advanced: () => (
              <Manipulation type="common-divisors" a={red} b={white} context={ACTIVITY.context} theme="garden"
                title="قواسم 90، قواسم 54، وما بينهما"
                lead="شكّل الباقات أولًا: ما أكبر عدد منها؟ ثم انتقل إلى القائمتين واختر الأعداد التي تقسم 90 و 54 معًا: كل واحد منها عدد باقات ممكن."
                onFinished={() => setLabDone(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'هل يمكنه تشكيل 9 باقات؟ ماذا يمثل العدد 9؟', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qawasim-mushtaraka" lead="9 يقسم 90 و 54 معًا: هذا ما يسمّيه الكتاب قاسمًا مشتركًا." />
              <TapQuestion prompt={<span>9 باقات: في كل باقة <MathText>{'$90 \\div 9 = 10$'}</MathText> زهرات حمراء و <MathText>{'$54 \\div 9 = 6$'}</MathText> بيضاء. ماذا يمثّل 9 بالنسبة إلى 90 و 54؟</span>}
                options={['9 قاسم مشترك للعددين 90 و 54', '9 مضاعف مشترك للعددين', '9 هو الفرق بين 90 و 54', '9 قاسم لـ 90 فقط']} correct={0} cols={2} requires={['qawasim-mushtaraka']}
                explain={<span>9 يقسم 90 ويقسم 54 في آن واحد؛ لذلك لا تبقى أية زهرة.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'ب) أكبر عدد ممكن من الباقات المتماثلة', subtitle: 'أكمل المناولة أولًا', done: q2,
          content: (
            <div className="space-y-3">
              {!labDone && <p className="text-sm text-slate-600">في المناولة، بعد تعيين القواسم المشتركة، اختر أكبرها.</p>}
              <TapQuestion prompt={<span>ما هو أكبر عدد ممكن من الباقات المتماثلة؟ وكم زهرة من كل لون في الباقة؟</span>}
                options={['18 باقة: 5 حمراء و 3 بيضاء', '9 باقات: 10 حمراء و 6 بيضاء', '6 باقات: 15 حمراء و 9 بيضاء', '54 باقة']} correct={0} cols={1} requires={['qawasim-mushtaraka']}
                explain={<span>القواسم المشتركة لـ 90 و 54 هي 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ أكبرها 18.</span>} onAnswered={() => setQ2(true)} />
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.closing} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
