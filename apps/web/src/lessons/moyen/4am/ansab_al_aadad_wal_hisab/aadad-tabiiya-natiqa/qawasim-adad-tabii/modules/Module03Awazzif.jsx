import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';

/** Module 3 — أوظّف تعلّماتي (p. 14) : exercices 3, 4, 6, 7, 8, 9, 11 dans l'ordre du manuel. LP : P2, P4. */
const ORDER = ['ex-3', 'ex-4a', 'ex-4b', 'ex-4c', 'ex-6', 'ex-7', 'ex-8', 'ex-9', 'ex-11'];
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  const list = ORDER.map((id) => EXERCISES.find((e) => e.id === id));
  return (
    <ContentModule objectives={["أبحث عن قواسم عدد بالطريقة المنظّمة", "أحلّ تمارين الكتاب 3 ← 11"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي" moduleSubtitle="تمارين الكتاب 3 ← 11" estimatedTime="15 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 14', title: 'تمارين قواسم عدد طبيعي', tone: 'amber', body: <p>من السهل إلى الصعب، بترتيب الكتاب. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={list.map((ex, i) => ({
        num: i + 1, title: `تمرين ${ex.source.number}${ex.source.part ? ' ' + ex.source.part : ''}`, done: !!done[ex.id],
        content: (
          <div className="space-y-3">
            {i === 0 && <KnowledgeBrick id="tariqa-qawasim" variant="rappel" compact />}
            <TextbookExercise exercise={ex} requires={['tariqa-qawasim']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} />
          </div>
        ),
      }))}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
