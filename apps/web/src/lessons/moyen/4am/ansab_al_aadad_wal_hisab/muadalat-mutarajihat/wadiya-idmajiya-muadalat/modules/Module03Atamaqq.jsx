import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookExercise, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { NumberLine } from '../components/MuadalatFigures';

/**
 * Module 3 — أتعمّق (p. 53) : les exercices 34, 35, 36, 41 (« من امتحان شهادة
 * التعليم المتوسط », annoncé comme dans le manuel) et 42, au mot près, découpés
 * question par question. Ils enchaînent ce que les quatre leçons et l'unité 3
 * ont appris : développer, factoriser, le produit nul, une inéquation dont les
 * x² s'annulent, deux inéquations à la fois. La brique `shakl-munasib` est
 * posée quand le manuel passe de « حلّل » à « حل المعادلة » (ex. 34) ;
 * `hall-maan` quand il demande les deux inéquations « معًا » (ex. 42). Les
 * « مثّل بيانيا » (ex. 35 et 42) sont posés avec les DESSINS du manuel
 * (crochet tourné vers le rouge quand la borne est une solution). LP : P1.
 */
const EX35 = partsOf('35')[0].source;
const EX42 = partsOf('42')[0].source;

export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n, extra = []) => partsOf(n).every((ex) => done[ex.id]) && extra.every((id) => done[id]);
  const part = (id) => partsOf(id.split('-')[1]).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="نشر وتحليل، جداء معدوم ومتراجحات"
      estimatedTime="14 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 53', title: 'سلاسل من الدروس الأربعة', tone: 'rose',
        body: <p>كل تمرين سلسلة: ننشر ونحلّل (الوحدة 3)، ثم نحلّ معادلة جداء معدوم أو متراجحة ونمثّل حلولها. التمرين 41 من امتحان شهادة التعليم المتوسط.</p> }}
      steps={[
        { num: 1, title: 'تمرين 34 — انشر، حلّل، احسب، حلّ', done: all('34'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-34-1')} requires={['nashr-tahlil']} onAnswered={mark('ex-34-1')} />
              <TextbookExercise exercise={part('ex-34-2')} requires={['nashr-tahlil']} onAnswered={mark('ex-34-2')} />
              <TextbookExercise exercise={part('ex-34-3a')} requires={['jidaa-maadum-khassiya']} onAnswered={mark('ex-34-3a')} />
              <TextbookExercise exercise={part('ex-34-3b')} requires={['nashr-tahlil']} onAnswered={mark('ex-34-3b')} />
              <KnowledgeBrick id="shakl-munasib" lead="السؤال 4 يطلب حل معادلة: لدينا الآن شكلان للعبارة E، منشور ومحلّل." />
              <TextbookExercise exercise={part('ex-34-4')} requires={['shakl-munasib', 'jidaa-maadum-khassiya']} onAnswered={mark('ex-34-4')} />
            </div>
          ) },
        { num: 2, title: 'تمرين 35 — المساواة، التحليل، المعادلة والمتراجحة', done: all('35', ['ex-35-4r']),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-35-1')} requires={['nashr-tahlil']} onAnswered={mark('ex-35-1')} />
              <TextbookExercise exercise={part('ex-35-2')} requires={['nashr-tahlil']} onAnswered={mark('ex-35-2')} />
              <TextbookExercise exercise={part('ex-35-3')} requires={['shakl-munasib', 'jidaa-maadum-khassiya']} onAnswered={mark('ex-35-3')} />
              <TextbookExercise exercise={part('ex-35-4')} requires={['shakl-munasib', 'hall-mutarajiha']} onAnswered={mark('ex-35-4')} />
              <TapQuestion
                prompt={<span>4) مثّل بيانيا حلول المتراجحة على مستقيم مدرّج. <SourceTag source={EX35} /></span>}
                options={[
                  <NumberLine key="a" bound={-1 / 3} side="right" included ticks={[-1 / 3, 0]} labels={{ [-1 / 3]: '−1/3' }} compact label="الجزء الملوّن على يمين العدد سالب ثلث، والعدد سالب ثلث منه" />,
                  <NumberLine key="b" bound={-1 / 3} side="right" included={false} ticks={[-1 / 3, 0]} labels={{ [-1 / 3]: '−1/3' }} compact label="الجزء الملوّن على يمين العدد سالب ثلث، والعدد سالب ثلث ليس منه" />,
                  <NumberLine key="c" bound={-1 / 3} side="left" included ticks={[-1 / 3, 0]} labels={{ [-1 / 3]: '−1/3' }} compact label="الجزء الملوّن على يسار العدد سالب ثلث، والعدد سالب ثلث منه" />,
                ]}
                correct={0} cols={1} requires={['tamthil-hulul']}
                explain={<MathText>{'الحلول $x \\geq -\\dfrac{1}{3}$ : الجزء على يمين $-\\dfrac{1}{3}$ ، و $-\\dfrac{1}{3}$ حلّ ($\\geq$) فالمعقوف يتّجه نحو الجزء الملوّن.'}</MathText>}
                onAnswered={mark('ex-35-4r')} />
            </div>
          ) },
        { num: 3, title: 'تمرين 36 — المتراجحة بين A و B', done: all('36'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-36-1a')} requires={['nashr-tahlil']} onAnswered={mark('ex-36-1a')} />
              <TextbookExercise exercise={part('ex-36-1b')} requires={['nashr-tahlil']} onAnswered={mark('ex-36-1b')} />
              <TextbookExercise exercise={part('ex-36-2')} requires={['shakl-munasib', 'hall-mutarajiha']} onAnswered={mark('ex-36-2')} />
            </div>
          ) },
        { num: 4, title: 'تمرين 41 — من امتحان شهادة التعليم المتوسط', done: all('41'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-41-1')} requires={['nashr-tahlil']} onAnswered={mark('ex-41-1')} />
              <TextbookExercise exercise={part('ex-41-2')} requires={['nashr-tahlil']} onAnswered={mark('ex-41-2')} />
              <TextbookExercise exercise={part('ex-41-3')} requires={['shakl-munasib', 'jidaa-maadum-khassiya']} onAnswered={mark('ex-41-3')} />
              <TextbookExercise exercise={part('ex-41-4')} requires={['shakl-munasib', 'hall-mutarajiha']} onAnswered={mark('ex-41-4')} />
            </div>
          ) },
        { num: 5, title: 'تمرين 42 — متراجحتان معًا', done: all('42', ['ex-42-2']),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-42-1a')} requires={['hall-mutarajiha']} onAnswered={mark('ex-42-1a')} />
              <TextbookExercise exercise={part('ex-42-1b')} requires={['hall-mutarajiha']} onAnswered={mark('ex-42-1b')} />
              <KnowledgeBrick id="hall-maan" lead="«تتحقق المتراجحتان معًا»: نبحث عن الأعداد التي هي حلّ للاثنتين في آن واحد." />
              <TextbookExercise exercise={part('ex-42-1c')} requires={['hall-maan']} onAnswered={mark('ex-42-1c')} />
              <TapQuestion
                prompt={<span>2) مثّل بيانيا هذه الحلول. <SourceTag source={EX42} /></span>}
                options={[
                  <NumberLine key="a" lo={-4} hi={-1} loIncluded hiIncluded={false} compact label="الجزء الملوّن بين سالب 4 وسالب 1، والعدد سالب 4 منه، والعدد سالب 1 ليس منه" />,
                  <NumberLine key="b" lo={-4} hi={-1} loIncluded={false} hiIncluded compact label="الجزء الملوّن بين سالب 4 وسالب 1، والعدد سالب 4 ليس منه، والعدد سالب 1 منه" />,
                  <NumberLine key="c" bound={-4} side="right" included ticks={[-4, -1, 0]} compact label="الجزء الملوّن على يمين سالب 4، والعدد سالب 4 منه" />,
                ]}
                correct={0} cols={1} requires={['hall-maan', 'tamthil-hulul']}
                explain={<MathText>{'$-4 \\leq x < -1$ : الجزء بين $-4$ و $-1$ ؛ المعقوف عند $-4$ نحو الجزء الملوّن ($-4$ حلّ)، وعند $-1$ عكسه ($-1$ ليس حلًا).'}</MathText>}
                onAnswered={mark('ex-42-2')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
