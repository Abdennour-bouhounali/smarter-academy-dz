import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';

/**
 * Module 3 — أوظّف تعلّماتي (p. 60) : exercices 1 → 4 (« المعادلات من الدرجة الأولى بمجهولين »
 * puis « جمل معادلتين »). Une étape par exercice ; elle est faite quand chaque partie a reçu une
 * réponse (juste ou fausse). Les ثنائيات demandées se tapent « ( … ; … ) » (PairQuestion, évaluateur
 * `point`). LP : P3 (ex. 1, 2, 3‑1, 4), P2 (ex. 3‑2).
 */
export default function Module03Awazzif() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n) => partsOf(n).every((ex) => done[ex.id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="تمارين الكتاب 1 ← 4"
      objectives={['كيف أتحقّق من أنّ ثنائية حل لمعادلة؟', 'متى تكون ثنائية حلا لجملة؟', 'كيف أكتب معاملات الجملة؟']}
      estimatedTime="10 دقائق"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 60', title: 'تمارين الكتاب، بعباراته', tone: 'amber',
        body: <p>عوّض في كل معادلة، واكتب الثنائية بين قوسين: العدد الأول قيمة x والثاني قيمة y. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 1 — ثلاث ثنائيات لمعادلة', done: all('1'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ikhtibar-thunaiya" variant="rappel" compact />
              {partsOf('1').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['ikhtibar-thunaiya', 'tartib-thunaiya']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 2, title: 'تمرين 2 — أرفق بكل معادلة حلولها', done: all('2'),
          content: (
            <div className="space-y-3">
              {partsOf('2').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['ikhtibar-thunaiya']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 3, title: 'تمرين 3 — حلول كثيرة، ثم ثنائية واحدة', done: all('3'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hall-jumla" variant="rappel" compact />
              {partsOf('3').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['hall-jumla', 'ikhtibar-thunaiya']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
        { num: 4, title: 'تمرين 4 — هل الثنائية حل للجملة؟', done: all('4'),
          content: (
            <div className="space-y-3">
              {partsOf('4').map((ex) => <TextbookExercise key={ex.id} exercise={ex} requires={['hall-jumla', 'ikhtibar-thunaiya']} onAnswered={mark(ex.id)} />)}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
