import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { RightTriangle, SquareABCD } from '../components/HarfiFigures';

/**
 * Module 3 — أتعمّق : l'exercice 34 (p. 39) et les exercices 37 à 40 (p. 41),
 * au mot près, découpés question par question. Ce sont exactement les points
 * P2 (exprimer longueurs et aires en fonction de x : triangles, carré ABCD)
 * et P3 (choisir la forme : ex. 39 et 40) — la brique `ikhtiyar-shakl` est
 * posée au moment où le manuel dit « استعمل العبارة المناسبة ». LP : P2, P3, P1.
 */
export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n) => partsOf(n).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.split('-')[1]).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="أطوال ومساحات بدلالة x، ثم الشكل المناسب للحساب"
      estimatedTime="12 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي وأتعمّق — الكتاب ص 39 و 41', title: 'نمذجة ثم اختيار الشكل', tone: 'rose',
        body: <p>نعبّر عن مساحات ومربعات أطوال بدلالة x في مثلثات قائمة وفي مربع، ثم نختار الشكل المنشور أو المحلّل الذي يسهّل الحساب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 34 — مساحة مثلث قائم و AC²', done: all('34'),
          content: (
            <div className="space-y-3">
              <RightTriangle right="B" top="A" side="C" legTop="x + 4" legSide="4x" caption="الشكل في الكتاب: ABC قائم في B" label="مثلث ABC قائم في B حيث AB = x + 4 و BC = 4x" />
              <TextbookExercise exercise={part('ex-34-1a')} requires={['namdhaja', 'masahat-ashkal']} onAnswered={mark('ex-34-1a')} />
              <TextbookExercise exercise={part('ex-34-1b')} requires={['qimat-ibara']} onAnswered={mark('ex-34-1b')} />
              <TextbookExercise exercise={part('ex-34-2')} requires={['khassiyat-fithaghuras', 'mutatabiqat']} onAnswered={mark('ex-34-2')} />
              <TextbookExercise exercise={part('ex-34-3')} requires={['qimat-ibara', 'khassiyat-fithaghuras']} onAnswered={mark('ex-34-3')} />
            </div>
          ) },
        { num: 2, title: 'تمرين 37 — المربع ABCD', done: all('37'),
          content: (
            <div className="space-y-3">
              <SquareABCD caption="الشكل في الكتاب: $AE = x$ ، $FB = 4$ ، $DH = 4$ (الشكل ليس بالأبعاد الحقيقية)" />
              <TextbookExercise exercise={part('ex-37-1')} requires={['namdhaja']} onAnswered={mark('ex-37-1')} />
              <TextbookExercise exercise={part('ex-37-2')} requires={['namdhaja']} onAnswered={mark('ex-37-2')} />
              <TextbookExercise exercise={part('ex-37-3')} requires={['masaha-tariqatan', 'nashr-jadaa']} onAnswered={mark('ex-37-3')} />
              <TextbookExercise exercise={part('ex-37-4')} requires={['qimat-ibara']} onAnswered={mark('ex-37-4')} />
            </div>
          ) },
        { num: 3, title: 'تمرين 38 — AB² جداءً ونشرًا', done: all('38'),
          content: (
            <div className="space-y-3">
              <RightTriangle right="B" top="A" side="C" legSide="x + 2" hyp="2x + 5" caption="الشكل المرفق في الكتاب: ABC قائم في B" label="مثلث ABC قائم في B حيث BC = x + 2 و AC = 2x + 5" />
              <TextbookExercise exercise={part('ex-38-1')} requires={['khassiyat-fithaghuras', 'namdhaja']} onAnswered={mark('ex-38-1')} />
              <TextbookExercise exercise={part('ex-38-2a')} requires={['tahlil-ibara', 'mutatabiqat']} onAnswered={mark('ex-38-2a')} />
              <TextbookExercise exercise={part('ex-38-2b')} requires={['mutatabiqat', 'nashr-jadaa']} onAnswered={mark('ex-38-2b')} />
              <TextbookExercise exercise={part('ex-38-3')} requires={['qimat-ibara']} onAnswered={mark('ex-38-3')} />
            </div>
          ) },
        { num: 4, title: 'تمرين 39 — العبارة المناسبة لحساب D', done: all('39'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-39-1')} requires={['nashr-jadaa']} onAnswered={mark('ex-39-1')} />
              <TextbookExercise exercise={part('ex-39-2a')} requires={['tahlil-ibara', 'mutatabiqat']} onAnswered={mark('ex-39-2a')} />
              <TextbookExercise exercise={part('ex-39-2b')} requires={['tahlil-ibara']} onAnswered={mark('ex-39-2b')} />
              <KnowledgeBrick id="ikhtiyar-shakl" lead="السؤال 3 يطلب «العبارة المناسبة»: لدينا الآن شكلان للعبارة D." />
              <TextbookExercise exercise={part('ex-39-3a')} requires={['ikhtiyar-shakl', 'musaada-jadaa']} onAnswered={mark('ex-39-3a')} />
              <TextbookExercise exercise={part('ex-39-3b')} requires={['ikhtiyar-shakl']} onAnswered={mark('ex-39-3b')} />
              <TextbookExercise exercise={part('ex-39-3c')} requires={['ikhtiyar-shakl', 'musaada-jadaa']} onAnswered={mark('ex-39-3c')} />
            </div>
          ) },
        { num: 5, title: 'تمرين 40 — E و F', done: all('40'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-40-1')} requires={['qimat-ibara']} onAnswered={mark('ex-40-1')} />
              <TextbookExercise exercise={part('ex-40-2a')} requires={['mutatabiqat']} onAnswered={mark('ex-40-2a')} />
              <TextbookExercise exercise={part('ex-40-2b')} requires={['tahlil-ibara', 'mutatabiqat']} onAnswered={mark('ex-40-2b')} />
              <TextbookExercise exercise={part('ex-40-2c')} requires={['ikhtiyar-shakl']} onAnswered={mark('ex-40-2c')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
