import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';
/** Module 3 — exercices 17 (أ ب جـ), 18, 22. LP : P1, P3. */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="أوظّف تعلّماتي" moduleSubtitle="تمارين 17، 18 و 22" estimatedTime="12 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 14 و 15', title: 'أعيّن القاسم المشترك الأكبر بالحصر', tone: 'amber', body: <p>الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={EXERCISES.map((ex, i) => ({ num: i + 1, title: `تمرين ${ex.source.number}${ex.source.part ? ' ' + ex.source.part : ''}`, done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="tayin-bil-hasr" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['tayin-bil-hasr']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div> }))}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
