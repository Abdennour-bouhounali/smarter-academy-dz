import React, { useState } from 'react';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX } from '../content/exercises';

/**
 * Module 4 — أوظّف تعلّماتي (p. 110–111) et أتعمّق (p. 113). AUTOMATIZE : ex-7 (« يبدو » n'est pas un argument),
 * ex-10, 11, 12 (prouver le parallélisme), ex-13, 15 (les deux sens). TRANSFER : ex-14 (Pythagore d'abord), ex-16
 * (يونس et إيناس : la justification), ex-23 (Thalès puis la contraposée), ex-24 (centres de gravité), ex-25 (Thalès
 * deux fois). Chaque figure « لاحظ الشكل » est REDESSINÉE (GeoFigure) au-dessus de son exercice. Une étape par groupe,
 * faite quand chaque exercice du groupe a reçu une réponse (juste ou fausse).
 */
function Exercise({ id, requires, onDone }) {
  const ex = EX[id];
  return (
    <div className="space-y-2">
      {ex.figure && <GeoFigure {...ex.figure} />}
      <TextbookExercise exercise={ex} requires={requires} onAnswered={onDone} />
    </div>
  );
}

export default function Module04Awazzif() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (...ids) => ids.every((id) => done[id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="أوظّف تعلّماتي"
      moduleSubtitle="تمارين الكتاب 7 و 10 إلى 16 و 23 إلى 25"
      objectives={['أطبّق ما تعلّمته على تمارين الكتاب', 'كيف أقرّر: توازٍ أم عدم توازٍ؟', 'أتعمّق: أيّ خاصية أستعمل قبل الأخرى؟']}
      estimatedTime="13 دقيقة"
      brief={{ tag: 'أوظّف تعلّماتي — الكتاب ص 110، 111 و 113', title: 'تمارين الكتاب، بعباراته', tone: 'amber',
        body: <p>في كل تمرين: الترتيب، ثم النسبتان، ثم الخلاصة. الخطأ هنا يُصحَّح ولا يُحتسب.</p> }}
      steps={[
        { num: 1, title: 'تمرين 7 — «يبدو» متوازيين', done: all('ex-7'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="nisbatan-mukhtalifatan" variant="rappel" compact />
              <Exercise id="ex-7" requires={['nisbatan-mukhtalifatan']} onDone={mark('ex-7')} />
            </div>
          ) },
        { num: 2, title: 'تمارين 10 و 11 و 12 — إثبات التوازي', done: all('ex-10', 'ex-11', 'ex-12'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tariqa-tawazi" variant="rappel" compact />
              <Exercise id="ex-10" requires={['tariqa-tawazi']} onDone={mark('ex-10')} />
              <Exercise id="ex-11" requires={['tariqa-tawazi']} onDone={mark('ex-11')} />
              <Exercise id="ex-12" requires={['tariqa-tawazi']} onDone={mark('ex-12')} />
            </div>
          ) },
        { num: 3, title: 'تمرينا 13 و 15 — في الاتجاهين', done: all('ex-13', 'ex-15'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tariqa-adam-tawazi" variant="rappel" compact />
              <Exercise id="ex-13" requires={['tariqa-adam-tawazi']} onDone={mark('ex-13')} />
              <Exercise id="ex-15" requires={['tariqa-tawazi']} onDone={mark('ex-15')} />
            </div>
          ) },
        { num: 4, title: 'تمرين 14 — فيثاغورس أولا', done: all('ex-14'),
          content: <div className="space-y-3"><Exercise id="ex-14" requires={['fithaghuras', 'tariqa-tawazi']} onDone={mark('ex-14')} /></div> },
        { num: 5, title: 'تمرين 16 — يونس وإيناس', done: all('ex-16'),
          content: <div className="space-y-3"><Exercise id="ex-16" requires={['tariqa-tawazi', 'tasawi-kasrayn']} onDone={mark('ex-16')} /></div> },
        { num: 6, title: 'تمرين 23 — طالس ثم عكسها', done: all('ex-23'),
          content: <div className="space-y-3"><Exercise id="ex-23" requires={['talis-mubashira', 'tariqa-adam-tawazi']} onDone={mark('ex-23')} /></div> },
        { num: 7, title: 'تمرينا 24 و 25 — أتعمّق', done: all('ex-24', 'ex-25'),
          content: (
            <div className="space-y-3">
              <Exercise id="ex-24" requires={['tariqa-tawazi', 'shart-tartib']} onDone={mark('ex-24')} />
              <Exercise id="ex-25" requires={['talis-mubashira']} onDone={mark('ex-25')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
