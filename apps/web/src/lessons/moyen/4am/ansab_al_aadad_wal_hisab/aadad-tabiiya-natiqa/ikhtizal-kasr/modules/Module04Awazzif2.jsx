import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES_2 } from '../content/exercises';
/** Module 4 — exercices 29–33, 37, 38, 40 (p. 15) : كسور بحرف n، وحساب على الأعداد الناطقة. LP : P2, P4. */
export default function Module04Awazzif2() {
  const [done, setDone] = useState({});
  return (
    <ContentModule objectives={["أختزل كسرًا فيه حرف", "أحسب على الأعداد الناطقة وأعطي النتيجة مختزلة"]} ctx={MODULE_CTX} navLinks={getNavLinks(4)} moduleNumber={4} moduleTitle="أوظّف تعلّماتي (2)" moduleSubtitle="كسور بحرف، وحساب على الأعداد الناطقة" estimatedTime="14 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 15', title: 'أحسب وأعطي النتيجة على شكل كسر غير قابل للاختزال', tone: 'rose', body: <p>الأصعب في الأخير: كسور تعتمد على n، وعبارات تجمع العمليات الأربع.</p> }}
      steps={EXERCISES_2.map((ex, i) => ({ num: i + 1, title: `تمرين ${ex.source.number}${ex.source.part ? ' ' + ex.source.part : ''}`, done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="kasr-ghayr-qabil" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['kasr-ghayr-qabil', 'ikhtizal-bil-pgcd']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div> }))}
      footer={<KnowledgeSnapshot moduleNumber={4} variant="memo" />} />
  );
}
