import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 3 — أتمرّن (pp. 45–46) : exercices 15 (le حصر), 16 (une égalité vraie qui n'est pas une division
 * euclidienne), 17 (compléter), 18 (deux divisions posées), 19 (les zéros oubliés du quotient). Les erreurs sont
 * corrigées, jamais comptées. LP : P1, P2.
 */
export default function Module03Atamarran() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  return (
    <ContentModule
      objectives={['أحصر عددًا بين مضاعفين متتاليين', 'أميّز القسمة الإقليدية من مساواة صحيحة فقط', 'أنجز القسمة وأصحّح الأخطاء']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتمرّن"
      moduleSubtitle="تمارين الكتاب 15 إلى 19"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتمرّن — الكتاب ص 45 و 46', title: 'خمسة تمارين من الكتاب', tone: 'amber',
        body: <p>نفس التمارين، بنفس الأعداد. أجب، ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 15 — الحصر', done: !!done['ex-15'],
          content: <div className="space-y-3"><KnowledgeBrick id="qisma-iqlidiya" variant="rappel" compact /><TextbookExercise exercise={EX['ex-15']} requires={['qisma-iqlidiya']} onAnswered={mark('ex-15')} /></div> },
        { num: 2, title: 'تمرين 16 — مساواة صحيحة، لكن…', done: !!done['ex-16'],
          content: <TextbookExercise exercise={EX['ex-16']} requires={['qisma-mufradat']} onAnswered={mark('ex-16')} /> },
        { num: 3, title: 'تمرين 17 — أتمم القسمات', done: !!done['ex-17'],
          content: <TextbookExercise exercise={EX['ex-17']} requires={['qisma-amudiya']} onAnswered={mark('ex-17')} /> },
        { num: 4, title: 'تمرين 18 — قسمتان', done: !!done['ex-18-a'] && !!done['ex-18-b'],
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={EX['ex-18-a']} requires={['qisma-amudiya']} onAnswered={mark('ex-18-a')} />
              <TextbookExercise exercise={EX['ex-18-b']} requires={['qisma-amudiya']} onAnswered={mark('ex-18-b')} />
            </div>
          ) },
        { num: 5, title: 'تمرين 19 — أين الخطأ؟', done: !!done['ex-19'],
          content: <TextbookExercise exercise={EX['ex-19']} requires={['qisma-amudiya']} onAnswered={mark('ex-19')} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
