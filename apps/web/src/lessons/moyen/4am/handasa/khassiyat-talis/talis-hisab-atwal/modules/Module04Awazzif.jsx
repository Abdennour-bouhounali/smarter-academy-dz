import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { PREP_REVISITED } from '../content/textbook';
import { FIG_EX1, FIG_EX2, FIG_EX3, FIG_EX4, FIG_EX5, FIG_EX8, FIG_EX9, FIG_PREP4, FIG_PREP5 } from '../content/figures';

/**
 * Module 4 — أوظّف تعلّماتي (p. 110, « خاصية طالس », et ex-26 p. 113 « أتعمّق »).
 * AUTOMATIZE : ex-1 (triangles et rapports), ex-2, ex-3 (quatre figures : justifier le parallélisme puis écrire
 * les rapports), ex-4 (valeurs exactes puis arrondies), ex-5 (k = 3), ex-6, ex-8. TRANSFER : ex-9 (Pythagore
 * réciproque d'abord, puis Thalès), ex-26 (la bissectrice, raisonnement), et les items 4–5 de « أستعدّ » que
 * l'élève peut maintenant trancher (item 5 corrigé : ADE → ADF). Une étape par exercice, faite quand chaque
 * partie a reçu une réponse (juste ou fausse). Les figures sont des données GeoFigure (content/figures.js).
 */
const FIGURES = {
  ex1: <GeoFigure {...FIG_EX1} />,
  ex2: <GeoFigure {...FIG_EX2} />,
  ex3: <div className="grid grid-cols-2 gap-2">{FIG_EX3.map((f) => <GeoFigure key={f.caption} {...f} />)}</div>,
  ex4: <GeoFigure {...FIG_EX4} />,
  ex5: <GeoFigure {...FIG_EX5} />,
  ex8: <GeoFigure {...FIG_EX8} />,
  ex9: <GeoFigure {...FIG_EX9} />,
};

const PREP_EX = PREP_REVISITED.map((p) => ({
  id: `prep-${p.n}`, source: p.source, interaction: 'trueFalse',
  statement: 'الآن يمكنك أن تقرّر: أصحيح أم خاطئ؟ برّر إجابتك.',
  question: { rows: [{ text: p.text, answer: p.answer, why: p.why }] },
}));

function Exercise({ ex, requires, onDone }) {
  return (
    <div className="space-y-2">
      {ex.figure && FIGURES[ex.figure]}
      <TextbookExercise exercise={ex} requires={requires} onAnswered={onDone} />
    </div>
  );
}

export default function Module04Awazzif() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (n) => partsOf(n).every((ex) => done[ex.id]);
  const block = (n, requires) => partsOf(n).map((ex) => <Exercise key={ex.id} ex={ex} requires={requires} onDone={mark(ex.id)} />);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="تمارين الكتاب 1 إلى 6 و 8 و 9 و 26"
      objectives={['أحسب أطوالًا بخاصية طالس في أشكال الكتاب', 'متى أحتاج خاصية فيثاغورس قبل خاصية طالس؟', 'أتعمّق: كيف أتصرّف في وضعية لا أرى فيها طالس مباشرة؟']}
      estimatedTime="10 دقائق"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 110 و 113', title: 'تمارين الكتاب، بعباراته', tone: 'amber',
        body: <p>اكتب الأعداد العشرية بالفاصلة (مثل 2,5) والكسور على الشكل a/b. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 1 — النسب المتساوية', done: all('1'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khassiyat-talis" variant="rappel" compact />
              {block('1', ['khassiyat-talis'])}
            </div>
          ) },
        { num: 2, title: 'تمرين 2 — احسب BC', done: all('2'),
          content: <div className="space-y-3">{block('2', ['hisab-atwal'])}</div> },
        { num: 3, title: 'تمرين 3 — أربعة أشكال', done: all('3'),
          content: <div className="space-y-3">{block('3', ['khassiyat-talis'])}</div> },
        { num: 4, title: 'تمرين 4 — القيم المضبوطة والمدوّرة', done: all('4'),
          content: <div className="space-y-3">{block('4', ['hisab-atwal'])}</div> },
        { num: 5, title: 'تمرين 5 — تكبير', done: all('5'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="muamil-tanasub" variant="rappel" compact />
              {block('5', ['hisab-atwal', 'muamil-tanasub'])}
            </div>
          ) },
        { num: 6, title: 'تمرين 6 — محيط المثلث BKL', done: all('6'),
          content: <div className="space-y-3">{block('6', ['hisab-atwal', 'muamil-tanasub'])}</div> },
        { num: 7, title: 'تمرين 8 — AP و LP', done: all('8'),
          content: <div className="space-y-3">{block('8', ['hisab-atwal'])}</div> },
        { num: 8, title: 'تمرين 9 — فيثاغورس ثم طالس', done: all('9'),
          content: <div className="space-y-3">{block('9', ['hisab-atwal'])}</div> },
        { num: 9, title: 'أستعدّ 4 و 5 — الآن تقرّر', done: PREP_EX.every((ex) => done[ex.id]),
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_PREP4} />
              <TextbookExercise exercise={PREP_EX[0]} requires={['hisab-atwal']} onAnswered={mark(PREP_EX[0].id)} />
              <GeoFigure {...FIG_PREP5} />
              <TextbookExercise exercise={PREP_EX[1]} requires={['khassiyat-talis']} onAnswered={mark(PREP_EX[1].id)} />
              <p className="text-xs text-slate-500" data-correction><MathText>{PREP_REVISITED[1].correction}</MathText></p>
            </div>
          ) },
        { num: 10, title: 'تمرين 26 — منصف الزاوية (أتعمّق)', done: all('26'),
          content: <div className="space-y-3">{block('26', ['khassiyat-talis'])}</div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
