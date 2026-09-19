import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';
import { TRY_NOW_2 } from '../content/textbook';

/** Module 4 — دوري الآن (p. 11, 2) puis أوظّف تعلّماتي 12 ← 16 (p. 14). LP : P1, P2, P4. */
const tryNow = { id: 'now-11-2', source: TRY_NOW_2.source, difficulty: 'moyen', statement: TRY_NOW_2.text, interaction: 'reasoning', question: { solution: TRY_NOW_2.solution } };
export default function Module04Awazzif() {
  const [done, setDone] = useState({});
  const list = [tryNow, ...EXERCISES];
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(4)} moduleNumber={4}
      moduleTitle="أوظّف تعلّماتي" moduleSubtitle="دوري الآن، ثم تمارين 12 ← 16" estimatedTime="12 دقيقة"
      brief={{ tag: 'الكتاب ص 11 و 14', title: 'أطبّق الخاصيتين وأبرهن', tone: 'amber', body: <p>برهان قصير أولًا (دوري الآن)، ثم تمارين الكتاب بترتيبها.</p> }}
      steps={list.map((ex, i) => ({
        num: i + 1, title: ex.id === 'now-11-2' ? 'دوري الآن — برهن أن n يقسم a − b' : `تمرين ${ex.source.number}`, done: !!done[ex.id],
        content: (
          <div className="space-y-3">
            {i === 0 && <KnowledgeBrick id="khassiya-1" variant="rappel" compact />}
            <TextbookExercise exercise={ex} requires={['khassiya-1']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} />
          </div>
        ),
      }))}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
