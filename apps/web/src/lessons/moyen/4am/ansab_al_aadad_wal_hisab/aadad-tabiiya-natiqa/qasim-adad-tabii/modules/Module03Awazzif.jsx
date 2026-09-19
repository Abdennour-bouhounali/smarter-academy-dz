import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 3 — أوظّف تعلّماتي (p. 14) : exercices 1, 2, 5, dans l'ordre du
 * manuel. Laboratoire : les erreurs sont corrigées, jamais comptées comme
 * preuve de maîtrise. LP : P1, P2.
 */
export default function Module03Awazzif() {
  const [d1, setD1] = useState(false);
  const [d2, setD2] = useState(false);
  const [d3, setD3] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="تمارين الكتاب 1 ، 2 و 5"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 14', title: 'ثلاثة تمارين من الكتاب', tone: 'amber',
        body: <p>نفس التمارين، بنفس الأعداد. أجب، ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 1 — القسمة الإقليدية للعدد 1512 على 21', done: d1,
          content: <div className="space-y-3"><KnowledgeBrick id="qasim-jidaa" variant="rappel" compact /><TextbookExercise exercise={EX['ex-1']} requires={['qasim-jidaa']} onAnswered={() => setD1(true)} /></div> },
        { num: 2, title: 'تمرين 2 — أعداد تقبل القسمة على 6', done: d2,
          content: <TextbookExercise exercise={EX['ex-2']} requires={['qasim-baqi']} onAnswered={() => setD2(true)} /> },
        { num: 3, title: 'تمرين 5 — صحيح أو خطأ', done: d3,
          content: <TextbookExercise exercise={EX['ex-5']} requires={['siyagh-mutakafia']} onAnswered={() => setD3(true)} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
