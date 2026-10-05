import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf, EX15_CORRECTION } from '../content/exercises';
import { LESSON_TITLES, REMARKS } from '../content/textbook';
import { EX15, EX20 } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق (p. 161) : l'exercice 15 (cinq دورانات de 72° autour de A ⇒ le pentagone régulier BCDEF de centre A —
 * CORRIGÉ, le manuel écrit ABCDEF ; FB = 8 sin 36° ≈ 4,70 cm ; le cercle circonscrit 16π ≈ 50,27 cm²) et l'exercice 20
 * (شهادة التعليم المتوسط : l'angle inscrit dans un demi-cercle, sin BAC = 3/8, 22° puis BOC ≈ 44° ; la translation de vecteur OB
 * et Thales, DF = 4,5 cm). Les figures sont celles de la plateforme (le manuel n'en a pas ; « يُطلب إنجاز الشكل » pour le 20).
 * La brique `adawat-wahda` est posée APRÈS l'exercice 20 (elle nomme ce que les deux combinent). LP : P1, P3.
 */
const BackLink = ({ lesson, what }) => (
  <p className="text-xs text-slate-500" data-back-link={lesson}>{what} — <Link to={`${BASE}/${lesson}`} className="text-blue-700 underline">{LESSON_TITLES[lesson]}</Link></p>
);

export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (p) => partsOf(p).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.replace(/-\d+$/, '')).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="دورانات متتالية، زاوية محيطية، ومسافات بالنسب المثلثية وبخاصية طالس"
      estimatedTime="11 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 161', title: 'أدوات الوحدة معا: الدوران المتكرر، الزاوية المحيطية والمركزية، والحساب في المثلث القائم', tone: 'rose',
        body: <p>في كل تمرين: أبحث عن الدوران (أو الانسحاب) الذي يعطي أطوالا متساوية، وعن الزاوية المحيطية والمركزية اللتين تحصران نفس القوس، ثم أحسب في مثلث قائم أو بخاصية طالس.</p> }}
      steps={[
        { num: 1, title: 'تمرين 15 — خماسي منتظم بالدوران', done: all('ex-15'),
          content: (
            <div className="space-y-3">
              <p className="text-xs text-slate-500" data-correction="ex-15"><MathText>{EX15_CORRECTION}</MathText></p>
              <TextbookExercise exercise={part('ex-15-1')} requires={['khawas-dawaran-atwal', 'zawiya-markaziya-muntazam']} onAnswered={mark('ex-15-1')} />
              <GeoFigure {...EX15} />
              <TextbookExercise exercise={part('ex-15-2')} requires={['qanun-masafa']} onAnswered={mark('ex-15-2')} />
              <TextbookExercise exercise={part('ex-15-3')} requires={['tawzi-dawaran', 'mudalla-muntazam']} onAnswered={mark('ex-15-3')} />
              <TextbookExercise exercise={part('ex-15-4')} requires={['muhit-daira']} onAnswered={mark('ex-15-4')} />
              {done['ex-15-3'] && <p className="text-xs text-slate-600" data-misconception-note="markaz"><MathText>{`انتبه: ${REMARKS.markazRas}`}</MathText></p>}
              <BackLink lesson="mudalaat-muntazama" what="إنشاء مضلع منتظم بالدوران" />
            </div>
          ) },
        { num: 2, title: 'تمرين 20 — شهادة التعليم المتوسط', done: all('ex-20'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('ex-20-1')} requires={['jaib-zawiya']} onAnswered={mark('ex-20-1')} />
              <TextbookExercise exercise={part('ex-20-2')} requires={['zawiya-muhitiya-markaziya']} onAnswered={mark('ex-20-2')} />
              <GeoFigure {...EX20} />
              <TextbookExercise exercise={part('ex-20-3')} requires={['khawas-dawaran-atwal']} onAnswered={mark('ex-20-3')} />
              <p className="text-xs text-slate-500">حساب الزاوية بالجيب يعود إلى الوحدة 10 «حساب المثلثات»، وحساب DF بخاصية طالس إلى الوحدة 9.</p>
              {done['ex-20-3'] && <KnowledgeBrick id="adawat-wahda" lead="التمرينان 15 و 20 يجمعان أدوات من دروس مختلفة: ما هي؟" />}
              <BackLink lesson="zawiya-muhitiya" what="الزاوية المحيطية والزاوية المركزية" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
