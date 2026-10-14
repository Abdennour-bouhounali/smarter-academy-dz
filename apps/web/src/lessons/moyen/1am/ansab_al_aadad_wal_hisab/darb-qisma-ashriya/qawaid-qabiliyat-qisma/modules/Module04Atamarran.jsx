import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 4 — أتمرّن (p. 46) : exercices 22 (2, 5, et les deux : le 0), 23 (3 puis 9), 24 (2 puis 4), 26 (les cartes :
 * le plus grand nombre), 32 (les bijoux : 2, 3, 5 et un reste par 7). Corrigés, jamais comptés. LP : P1–P4.
 */
export default function Module04Atamarran() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  return (
    <ContentModule
      objectives={['أطبّق القواعد الخمس', 'أميّز 3 من 9 و 2 من 4', 'أشكّل أكبر عدد يقبل القسمة']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="أتمرّن"
      moduleSubtitle="تمارين الكتاب 22 ، 23 ، 24 ، 26 و 32"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتمرّن — الكتاب ص 46', title: 'خمسة تمارين من الكتاب', tone: 'amber',
        body: <p>نفس التمارين، بنفس الأعداد. أجب، ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 22 — على 2 ، على 5 ، على الاثنين', done: !!done['ex-22'],
          content: <div className="space-y-3"><KnowledgeBrick id="qabiliya-2-5" variant="rappel" compact /><TextbookExercise exercise={EX['ex-22']} requires={['qabiliya-2-5']} onAnswered={mark('ex-22')} /></div> },
        { num: 2, title: 'تمرين 23 — على 3 ثم على 9', done: !!done['ex-23'],
          content: <TextbookExercise exercise={EX['ex-23']} requires={['qabiliya-9']} onAnswered={mark('ex-23')} /> },
        { num: 3, title: 'تمرين 24 — على 2 ثم على 4', done: !!done['ex-24'],
          content: <TextbookExercise exercise={EX['ex-24']} requires={['qabiliya-4']} onAnswered={mark('ex-24')} /> },
        { num: 4, title: 'تمرين 26 — البطاقات', done: !!done['ex-26'],
          content: <TextbookExercise exercise={EX['ex-26']} requires={['qabiliya-2-5', 'qabiliya-3']} onAnswered={mark('ex-26')} /> },
        { num: 5, title: 'تمرين 32 — جواهر إيناس', done: !!done['ex-32'],
          content: <TextbookExercise exercise={EX['ex-32']} requires={['qabiliya-baqi']} onAnswered={mark('ex-32')} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
