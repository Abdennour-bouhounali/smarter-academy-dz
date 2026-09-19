import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';
/** Module 3 — exercices 23–27 et 39 (p. 15). LP : P2, P3. */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="أوظّف تعلّماتي" moduleSubtitle="تمارين 23 ← 27 و 39" estimatedTime="13 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 15', title: 'أثبت أو أنفي', tone: 'amber', body: <p>الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={EXERCISES.map((ex, i) => ({ num: i + 1, title: `تمرين ${ex.source.number}`, done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="ithbat-awwaliyan" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['ithbat-awwaliyan', 'nafy-awwaliyan']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div> }))}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
