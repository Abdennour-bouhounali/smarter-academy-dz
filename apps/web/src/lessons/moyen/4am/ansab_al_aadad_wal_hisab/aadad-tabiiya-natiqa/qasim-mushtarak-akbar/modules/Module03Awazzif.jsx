import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';

/** Module 3 — دوري الآن p. 11 (1) et exercice 10 (p. 14). LP : P1, P2. */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  return (
    <ContentModule objectives={["أحدّد القاسم المشترك الأكبر بنفسي", "أحلّ تمرين الكتاب 10"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي" moduleSubtitle="دوري الآن وتمرين 10" estimatedTime="10 دقائق"
      brief={{ tag: 'الكتاب ص 11 و 14', title: 'أعيّن القواسم المشتركة', tone: 'amber', body: <p>الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={EXERCISES.map((ex, i) => ({
        num: i + 1, title: ex.id === 'now-11-1' ? 'دوري الآن — 65 و 78' : `تمرين ${ex.source.number}`, done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="qawasim-mushtaraka" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['qawasim-mushtaraka']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div>,
      }))}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
