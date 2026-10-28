import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { MethodSteps, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PROOF } from '../content/textbook';

/** Module 3 — أتعلّم البرهنة (p. 11) : la preuve du manuel, ligne à ligne, puis sa structure. LP : P4. */
// « أتوقّع القاعدة » : l'encadré « طريقة » du manuel (PROOF.rule) énonce la règle de
// l'étape 3 (burhan-idha-fainna). Affiché par MethodSteps à la fin de l'étape 2, il la
// dévoilerait avant sa brique : il est donc déplacé en tête de l'étape 3, enveloppé
// par PredictRule (une seule prédiction, puis l'encadré et la brique).
const PROOF_WITHOUT_RULE = { ...PROOF, rule: undefined };
export default function Module03AtaallamAlBurhana() {
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["كيف أبرهن أن عددًا يقسم مجموعًا؟", "ما الخطوات التي يتألّف منها البرهان؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3}
      moduleTitle="أتعلّم البرهنة" moduleSubtitle={PROOF.question} estimatedTime="12 دقيقة"
      brief={{ tag: 'طرائق — الكتاب ص 11', title: PROOF.title, tone: 'emerald', body: <p>التخمين صار خاصية. لكن لماذا هو صحيح دائمًا، مهما كانت الأعداد؟ الكتاب يبرهن.</p> }}
      steps={[
        { num: 1, title: 'قبل البرهان: ما المعطيات؟ ما المطلوب؟', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={PROOF.exercise} source={PROOF.source} />
              <TapQuestion prompt={<span>ما هو المطلوب في هذا التمرين؟</span>}
                options={['n يقسم a + b', 'n يقسم كلا من a و b', 'a + b عدد طبيعي', 'n ≠ 0']} correct={0} cols={2}
                requires={['qasim-mushtarak-rappel']}
                explain={<span>«n يقسم كلا من a و b» هو الشرط (المعطيات)؛ «n يقسم a + b» هو النتيجة (المطلوب).</span>}
                onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'البرهان، سطرًا سطرًا', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="ithbat-qasim" lead="هنا لا نتحقّق بأعداد: الحروف تمثّل أعدادًا مجهولة. فكّر في معنى «يقسم» قبل أن تقرأ سطور البرهان." /><MethodSteps method={PROOF_WITHOUT_RULE} onAllRevealed={() => setRead(true)} /></div> },
        { num: 3, title: 'الطريقة', done: q2,
          content: (
            <div className="space-y-3">
              <PredictRule id="burhan-idha-fainna"><TextbookBox kind="method" lines={PROOF.rule} source={PROOF.source} compact /></PredictRule>
              <KnowledgeBrick id="burhan-idha-fainna" />
              <TapQuestion prompt={<span>في البرهان، ما دور العدد <MathText>{'$k = q + q\'$'}</MathText>؟</span>}
                options={['هو العدد الطبيعي الذي يحقّق a + b = n × k، فيثبت أن n يقسم a + b', 'هو باقي قسمة a + b على n', 'هو حاصل قسمة a على n', 'لا دور له']} correct={0} cols={1}
                requires={['ithbat-qasim', 'burhan-idha-fainna']}
                explain={<span>لإثبات أن d يقسم m يكفي إيجاد عدد طبيعي k حيث m = d × k — وهذا ما وجدناه.</span>}
                onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} variant="memo" />}
    />
  );
}
