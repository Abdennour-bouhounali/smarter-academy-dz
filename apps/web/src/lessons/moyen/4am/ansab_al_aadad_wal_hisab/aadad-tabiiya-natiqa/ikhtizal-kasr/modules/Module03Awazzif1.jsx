import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES_1 } from '../content/exercises';
const title = (ex) => ex.id === 'act-8-d' ? 'نشاط 8 د — 188/252' : ex.id === 'now-13-2' ? 'دوري الآن — 915/372' : `تمرين ${ex.source.number}${ex.source.part ? ' ' + ex.source.part : ''}`;
/** Module 3 — 188/252, 915/372, exercices 28, 34, 35, 36. LP : P3 (et P4 pour 36). */
export default function Module03Awazzif1() {
  const [done, setDone] = useState({});
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="أوظّف تعلّماتي (1)" moduleSubtitle="اكتب على الشكل غير القابل للاختزال" estimatedTime="13 دقيقة"
      brief={{ tag: 'الكتاب ص 9، 13 و 15', title: 'أختزل بـ PGCD', tone: 'amber', body: <p>اكتب كل كسر على الشكل a/b. القيمة الصحيحة غير المختزلة تُعدّ ناقصة، لا خاطئة.</p> }}
      steps={EXERCISES_1.map((ex, i) => ({ num: i + 1, title: title(ex), done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="ikhtizal-bil-pgcd" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['ikhtizal-bil-pgcd']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div> }))}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
