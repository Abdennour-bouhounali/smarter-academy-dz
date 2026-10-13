import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EXERCISES } from '../content/exercises';
/** Module 4 — دوري الآن (285 ; 45), exercices 19–21, et le تحدّ d'ouverture (p. 7). LP : P2, P4, P5. */
const title = (ex) => ex.id === 'now-13-1' ? 'دوري الآن — PGCD(285 ; 45)' : ex.id === 'challenge' ? 'تحدّ — مآزر المدارس (الكتاب ص 7)' : `تمرين ${ex.source.number}${ex.source.part ? ' ' + ex.source.part : ''}`;
export default function Module04Awazzif() {
  const [done, setDone] = useState({});
  return (
    <ContentModule objectives={["أطبّق طريقة إقليدس على أعداد جديدة", "أحلّ تمارين الكتاب 19 ← 21 والتحدّي"]} ctx={MODULE_CTX} navLinks={getNavLinks(4)} moduleNumber={4} moduleTitle="أوظّف تعلّماتي" moduleSubtitle="دوري الآن، تمارين 19 ← 21، والتحدّي" estimatedTime="14 دقيقة"
      brief={{ tag: 'الكتاب ص 7، 13 و 14', title: 'أحسب بالخوارزميتين', tone: 'amber', body: <p>الأعداد كبيرة هنا: اختر الطريقة الأنسب. في الأخير نعود إلى تحدّي بداية الوحدة.</p> }}
      steps={EXERCISES.map((ex, i) => ({ num: i + 1, title: title(ex), done: !!done[ex.id],
        content: <div className="space-y-3">{i === 0 && <KnowledgeBrick id="khwarizmiyat-iqlidus" variant="rappel" compact />}<TextbookExercise exercise={ex} requires={['khwarizmiyat-iqlidus', 'khwarizmiyat-al-furuq']} onAnswered={() => setDone((d) => ({ ...d, [ex.id]: true }))} /></div> }))}
      footer={<KnowledgeSnapshot moduleNumber={4} />} />
  );
}
