import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { ICE, LESSON_TITLES } from '../content/textbook';
import { ICE_FIGURE } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق. Le scan n'a ni exercices ni « أتعمّق » (scope.missing_pages) : la وضعية TRANSPOSÉE de la plateforme
 * (`synthesis_generation`, content/textbook.js › ICE ; questions dans content/exercises.js) — une boule de glace (r = 2 cm) fond
 * dans un cornet (cône pointe en bas, h = 16 cm, ouverture r = 4 cm) : 32π/3 et 256π/3 (درس 2 et volume du cône), rapport 1/8,
 * le liquide est un petit cône réduit de rapport k avec k³ = 1/8 ⇒ k = 1/2 : 8 cm de haut, surface de 2 cm (درس 3 et 4). Le
 * chemin INVERSE de la وضعية du seau : là k donnait k³, ici k³ donne k. La brique `adawat-wahda-fada` vient APRÈS. LP : P1, P3.
 */
const BackLink = ({ lesson, what }) => (
  <p className="text-xs text-slate-500" data-back-link={lesson}>{what} — <Link to={`${BASE}/${lesson}`} className="text-blue-700 underline">{LESSON_TITLES[lesson]}</Link></p>
);

export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const part = (id) => partsOf('ice').find((ex) => ex.id === id);
  const all = (ids) => ids.every((id) => done[id]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="كرة مثلجات تذوب داخل مخروط: جلة، مخروط، وتصغير"
      estimatedTime="11 دقيقة"
      brief={{ tag: 'أتعمّق — وضعية من المنصّة', title: ICE.title, tone: 'rose',
        body: (
          <div className="space-y-2" data-situation="ice">
            <p><MathText>{ICE.text}</MathText></p>
            <GeoFigure {...ICE_FIGURE} />
          </div>
        ),
        footer: <SourceTag source={ICE.source} /> }}
      steps={[
        { num: 1, title: 'الحجمان', subtitle: 'حجم الجلة وحجم المخروط', done: all(['ice-1', 'ice-2']),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ice-1')} requires={['hajm-julla']} onAnswered={mark('ice-1')} />
              <TextbookExercise exercise={part('ice-2')} requires={['hajm-makhrut']} onAnswered={mark('ice-2')} />
              <BackLink lesson="misaha-hajm-kura" what="حجم الجلة" />
            </div>
          ) },
        { num: 2, title: 'إلى أين يصل السائل؟', subtitle: 'من نسبة الحجمين إلى نسبة الأطوال', done: all(['ice-3', 'ice-4', 'ice-5']),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ice-3')} requires={['hajm-makhrut', 'hajm-julla']} onAnswered={mark('ice-3')} />
              <TextbookExercise exercise={part('ice-4')} requires={['takbir-k3', 'maqta-mukhrut']} onAnswered={mark('ice-4')} />
              <TextbookExercise exercise={part('ice-5')} requires={['takbir-k3', 'hajm-mabtur']} onAnswered={mark('ice-5')} />
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : boule, cône et k³ ⇒ k sont misaha-hajm-kura, hajm-makhrut et tariqat-judhur (درس التكبير والتصغير) ; les exercices juste au-dessus viennent de les combiner. */}
              {done['ice-5'] && <KnowledgeBrick id="adawat-wahda-fada" variant="rappel" lead="الدلو والمثلجات يجمعان أدوات من دروس مختلفة: ما هي؟" />}
              <BackLink lesson="takbir-tasghir" what="التكبير والتصغير" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
