import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';
import { EX } from '../content/exercises';

/**
 * Module 3 — أوظّف تعلّماتي : la طريقة « استعمال تعريف الجذر التربيعي لإنجاز
 * حساب » (p. 23) lue ligne par ligne, son دوري الآن, puis les exercices 1 à 8
 * de la p. 26 dans l'ordre du livre. Laboratoire : les erreurs sont corrigées,
 * jamais comptées comme preuve de maîtrise. LP : P1, P2, P3.
 */
const METHOD_WITH_ASIDES = { ...METHOD, remark: METHOD.asides.join(' — ') };

export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  const mark = (k) => () => setDone((d) => ({ ...d, [k]: true }));
  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="الطريقة ودوري الآن، ثم تمارين الكتاب 1 إلى 8"
      estimatedTime="14 دقيقة"
      brief={{ tag: 'طرائق ص 23 — أوظّف تعلّماتي ص 26', title: 'استعمال تعريف الجذر التربيعي لإنجاز حساب', tone: 'amber',
        body: <p>نفس التمارين، بنفس الأعداد. أجب، ثم اقرأ التصحيح: الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'طريقة — احسب ما يلي', subtitle: 'اقرأ الحل سطرًا سطرًا: حاول السطر التالي قبل أن تكشفه', done: !!done.m,
          content: <div className="space-y-3"><KnowledgeBrick id="jidhr-murabba" variant="rappel" compact /><MethodSteps method={METHOD_WITH_ASIDES} onAllRevealed={mark('m')} /></div> },
        { num: 2, title: 'دوري الآن', done: !!done.now,
          content: <TextbookExercise exercise={EX['now-23-1']} requires={['jidhr-murabba']} onAnswered={mark('now')} /> },
        { num: 3, title: 'تمرين 1 — مربع العدد أم الجذر التربيعي؟', done: !!done.e1,
          content: <TextbookExercise exercise={EX['ex-1']} requires={['jidhr-taarif']} onAnswered={mark('e1')} /> },
        { num: 4, title: 'تمرين 2 — العبارة المناسبة', done: !!done.e2,
          content: <TextbookExercise exercise={EX['ex-2']} requires={['jidhr-taarif']} onAnswered={mark('e2')} /> },
        { num: 5, title: 'تمرين 3 — كتابة عشرية', done: !!done.e3,
          content: <TextbookExercise exercise={EX['ex-3']} requires={['jidhr-taarif']} onAnswered={mark('e3')} /> },
        { num: 6, title: 'تمرين 4 — عدد طبيعي', done: !!done.e4,
          content: <TextbookExercise exercise={EX['ex-4']} requires={['jidhr-taarif', 'murabba-adad']} onAnswered={mark('e4')} /> },
        { num: 7, title: 'تمرين 5 — قوة للعدد 10', done: !!done.e5,
          content: <TextbookExercise exercise={EX['ex-5']} requires={['jidhr-murabba']} onAnswered={mark('e5')} /> },
        { num: 8, title: 'تمرين 6 — مربع الجذر', done: !!done.e6,
          content: <TextbookExercise exercise={EX['ex-6']} requires={['murabba-jidhr']} onAnswered={mark('e6')} /> },
        { num: 9, title: 'تمرين 7 — مربع الجذر (كسور)', done: !!done.e7,
          content: <TextbookExercise exercise={EX['ex-7']} requires={['murabba-jidhr', 'murabba-adad']} onAnswered={mark('e7')} /> },
        { num: 10, title: 'تمرين 8 — دون استعمال الرمز', done: !!done.e8,
          content: <TextbookExercise exercise={EX['ex-8']} requires={['jidhr-murabba']} onAnswered={mark('e8')} /> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
