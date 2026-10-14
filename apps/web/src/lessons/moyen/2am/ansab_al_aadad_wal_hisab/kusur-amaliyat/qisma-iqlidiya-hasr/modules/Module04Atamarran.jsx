import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 4 — أتمرّن : l'exercice 33 du manuel (p. 32, la seule division euclidienne des exercices de l'unité : un kasr
 * plus grand que 1 = un entier + un kasr plus petit que 1), puis quatre exercices AJOUTÉS « على منوال » les examens du 1er
 * trimestre de 2AM (encadrer après la division, juger une égalité vraie qui n'est pas une division euclidienne, les
 * camions par excès, le reste nul). Les erreurs sont corrigées, jamais comptées. LP : P1, P2, P3.
 */
export default function Module04Atamarran() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  return (
    <ContentModule
      objectives={['أفكّك كسرًا إلى عدد طبيعي وكسر أصغر من 1', 'أحصر حاصل قسمة وأختار القيمة المناسبة في وضعية', 'أميّز القسمة الإقليدية من مساواة صحيحة فقط']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="أتمرّن"
      moduleSubtitle="تمرين الكتاب 33 وتمارين على منوال اختبارات الفصل الأول"
      estimatedTime="12 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 32', title: 'خمسة تمارين', tone: 'amber',
        body: <p>تمرين من الكتاب وأربعة على منوال اختبارات الفصل الأول. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 33 — الطريقة الأنجلو-سكسونية', done: !!done['ex-33'],
          content: <div className="space-y-3"><KnowledgeBrick id="hasr-hasil" variant="rappel" compact /><TextbookExercise exercise={EX['ex-33']} requires={['hasr-hasil']} onAnswered={mark('ex-33')} /></div> },
        { num: 2, title: 'القسمة ثم الحصر', done: !!done['ex-p1'],
          content: <TextbookExercise exercise={EX['ex-p1']} requires={['hasr-hasil']} onAnswered={mark('ex-p1')} /> },
        { num: 3, title: 'ثلاث مساويات صحيحة', done: !!done['ex-p2'],
          content: <TextbookExercise exercise={EX['ex-p2']} requires={['qisma-taarif']} onAnswered={mark('ex-p2')} /> },
        { num: 4, title: 'شاحنات الرمل', done: !!done['ex-p3'],
          content: <TextbookExercise exercise={EX['ex-p3']} requires={['qiyam-muqarraba']} onAnswered={mark('ex-p3')} /> },
        { num: 5, title: 'الباقي المعدوم', done: !!done['ex-p4'],
          content: <TextbookExercise exercise={EX['ex-p4']} requires={['qabiliya']} onAnswered={mark('ex-p4')} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
