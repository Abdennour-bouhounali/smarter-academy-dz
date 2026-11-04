import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, NumericQuestion, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';
import { ICT } from '../content/textbook';

/**
 * Module 4 — les « مسائل » du manuel (ex. 20 : les œufs du dernier plateau ; ex. 21 : le jour de l'anniversaire) et la
 * calculatrice (p. 50) : l'écran montre 19,58333333 — le quotient est la partie entière, le reste se RECALCULE
 * (235 − 19 × 12). Interpréter q et r dans une situation. LP : P1, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module04MasailKitab() {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [d1, setD1] = useState(false);
  const [d2, setD2] = useState(false);
  return (
    <ContentModule
      objectives={['ماذا يعني الباقي في مشكلة؟', 'كيف نجد الحاصل والباقي بالآلة الحاسبة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="مسائل الكتاب والآلة الحاسبة"
      moduleSubtitle="الحاصل والباقي في وضعيات"
      estimatedTime="8 دقائق"
      brief={{ tag: 'أتمرّن ص 46 — تكنولوجيا ص 50', title: 'الحاصل والباقي في الحياة', tone: 'amber',
        body: <p>مسألتان من الكتاب، ثم الآلة الحاسبة: هي لا تُظهر الباقي، فكيف نجده؟</p> }}
      steps={[
        { num: 1, title: 'تمرين 20 — البيض في آخر طبق', done: d1,
          content: <TextbookExercise exercise={EX['ex-20']} requires={['qisma-iqlidiya']} onAnswered={() => setD1(true)} /> },
        { num: 2, title: 'تمرين 21 — يوم الميلاد', done: d2,
          content: <TextbookExercise exercise={EX['ex-21']} requires={['qisma-iqlidiya']} onAnswered={() => setD2(true)} /> },
        { num: 3, title: 'الآلة الحاسبة: أين الباقي؟', subtitle: '$235 \\div 12$', done: c1 && c2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ICT.text} source={ICT.source} compact />
              <p className="text-center font-mono text-lg" dir="ltr" data-calc-screen>{ICT.screen}</p>
              <TapQuestion
                prompt={<span>ماذا يُمثّل العدد 19 بالنسبة إلى العددين 235 و 12؟</span>}
                options={[M('حاصل القسمة الإقليدية لـ 235 على 12'), M('باقي القسمة الإقليدية لـ 235 على 12'), M('لا علاقة له بالقسمة الإقليدية')]}
                correct={0}
                cols={1}
                requires={['qisma-mufradat']}
                explain={<MathText>{'العدد الصحيح الظاهر قبل الفاصلة هو الحاصل: $12 \\times 19 = 228 \\le 235 < 240 = 12 \\times 20$.'}</MathText>}
                onAnswered={() => setC1(true)}
              />
              <NumericQuestion prompt={<MathText>{'الباقي $235 - 19 \\times 12$ يساوي:'}</MathText>} expected={7} parse={parseDec}
                requires={['qisma-mufradat']} explain={<MathText>{'$235 - 228 = 7$ : $235 = 12 \\times 19 + 7$ مع $7 < 12$. الآلة لا تُظهر الباقي 7، بل الجزء العشري ,58333333.'}</MathText>}
                onAnswered={() => setC2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} variant="memo" />}
    />
  );
}
