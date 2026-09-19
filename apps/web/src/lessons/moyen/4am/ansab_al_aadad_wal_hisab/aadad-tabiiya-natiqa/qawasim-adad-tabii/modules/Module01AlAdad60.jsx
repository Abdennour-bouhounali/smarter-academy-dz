import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { IntegerSetQuestion, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 2 (p. 8) : les jداءات de 60 puis ses diviseurs.
 * Laboratoire d'ouverture : `factor-pairs` dans `intro`, l'élève répond
 * « يقسم / لا يقسم » pour d = 1, 2, … et voit chaque couple livrer DEUX
 * diviseurs. Les étapes : lire ses propres résultats (60), puis 48 et 17.
 * LP : P1, P2.
 */
export default function Module01AlAdad60() {
  const [finished, setFinished] = useState(false);
  const [q48, setQ48] = useState(false);
  const [q17, setQ17] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 2 — قواسم العدد 60" moduleSubtitle="جداء عاملين بكلّ الأشكال الممكنة" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        body: <div className="space-y-1">{ACTIVITY.questions.slice(0, 3).map((q) => <p key={q}>{q}</p>)}<SourceTag source={ACTIVITY.source} /></div> }}
      intro={
        <Manipulation type="factor-pairs" n={60} title="جدول الكتاب: 60 = … × …"
          lead="لكل عدد d من 1 إلى 7، قل إن كان يقسم 60. عند كل «نعم» يظهر سطر من الجدول وقاسمان." onFinished={() => setFinished(true)} />
      }
      steps={[
        { num: 1, title: 'استنتج كل قواسم العدد 60', subtitle: 'أكمل الجدول في المناولة أولًا', done: finished && q48 === 'set60',
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="jidaa-aamilayn" lead="كل سطر في الجدول أعطاك قاسمين: العاملين." />
              <IntegerSetQuestion prompt={<span>اكتب كل قواسم العدد <MathText>{'$60$'}</MathText>.</span>} expected={[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]}
                explain="ستّ كتابات على شكل جداء عاملين، اثنا عشر قاسمًا." requires={['jidaa-aamilayn']} onAnswered={() => setQ48('set60')} />
            </div>
          ) },
        { num: 2, title: 'ب) قواسم العدد 48، كذلك بالنسبة إلى العدد 17', done: q17,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qasim-rappel" variant="rappel" compact />
              <Manipulation type="factor-pairs" n={48} title="العدد 48" lead="نفس الطريقة: من 1 إلى 6 (لأن 6² = 36 ≤ 48 < 49)." />
              <TapQuestion prompt={<span>ما هي قواسم العدد <MathText>{'$17$'}</MathText>؟</span>}
                options={['1 و 17', '1 ، 7 و 17', '17 فقط', '1 ، 2 و 17']} correct={0} cols={2} requires={['qasim-rappel']}
                explain={<span>لا يقسم 17 أيّ عدد من 2 إلى 4 (<MathText>{'$4^2 = 16 \\leq 17 < 25$'}</MathText>)، فقاسماه الوحيدان هما 1 و 17.</span>}
                onAnswered={() => setQ17(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
