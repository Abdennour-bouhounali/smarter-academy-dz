import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { LESSON_TITLES, REMARKS } from '../content/textbook';
import { EX22, EX23, EX25 } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق (p. 149) : l'exercice 22 (rectangle en B, les quatre points sur le cercle de centre I(3 ; 2) et de rayon
 * √5, les angles par la tangente — l'unité 10 revient), l'exercice 23 (rectangle par la règle du parallélogramme, aire 26 cm²,
 * images par la translation de vecteur u(2 ; 0)) et l'exercice 25 (شهادة التعليم المتوسط : AB = 2√13, rectangle en B, E image
 * de A, ABCE مستطيل). Les figures ne montrent que les points DONNÉS. La brique `burhan-tahlili` est posée APRÈS l'exercice 25
 * (elle nomme la démarche commune aux trois). LP : P1 (les natures), P3 (centres, images, longueurs, aire).
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
      moduleSubtitle="إثبات طبيعة الأشكال بالحساب في معلم"
      estimatedTime="11 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 149', title: 'من الإحداثيات إلى طبيعة الشكل: المسافات، المنتصفات والأشعة', tone: 'rose',
        body: <p>في كل تمرين: أحسب مربعات المسافات (عكس خاصية فيثاغورس)، أو مركبات الأشعة (متوازي أضلاع، صورة نقطة بانسحاب)، أو بعد كل نقطة عن مركز (دائرة)، ثم أستنتج.</p> }}
      steps={[
        { num: 1, title: 'تمرين 22 — أربع نقط على دائرة', done: all('ex-22'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX22} />
              <TextbookExercise exercise={part('ex-22-1')} requires={['aks-fithaghuris', 'masafa-nuqtatayn']} onAnswered={mark('ex-22-1')} />
              <TextbookExercise exercise={part('ex-22-2')} requires={['muntasaf-qita']} onAnswered={mark('ex-22-2')} />
              <TextbookExercise exercise={part('ex-22-3')} requires={['masafa-nuqtatayn']} onAnswered={mark('ex-22-3')} />
              <TextbookExercise exercise={part('ex-22-4')} requires={['aks-fithaghuris']} onAnswered={mark('ex-22-4')} />
              <p className="text-xs text-slate-500">حساب الزاويتين بالظل يعود إلى الوحدة 10 «حساب المثلثات».</p>
              <BackLink lesson="ithbat-khawas-maalam" what="إثبات أنّ نقطة تنتمي إلى دائرة" />
            </div>
          ) },
        { num: 2, title: 'تمرين 23 — مستطيل وانسحاب', done: all('ex-23'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX23} />
              <TextbookExercise exercise={part('ex-23-1')} requires={['aks-fithaghuris', 'masafa-nuqtatayn']} onAnswered={mark('ex-23-1')} />
              <TextbookExercise exercise={part('ex-23-2')} requires={['hisab-murakkibat']} onAnswered={mark('ex-23-2')} />
              <TextbookExercise exercise={part('ex-23-3')} requires={['mutawazi-tartib']} onAnswered={mark('ex-23-3')} />
              <TextbookExercise exercise={part('ex-23-4')} requires={['masafa-nuqtatayn']} onAnswered={mark('ex-23-4')} />
              <TextbookExercise exercise={part('ex-23-5')} requires={['hisab-murakkibat']} onAnswered={mark('ex-23-5')} />
              {done['ex-23-1'] && <p className="text-xs text-slate-600" data-misconception-note="watar"><MathText>{`خطأ شائع: ${REMARKS.watarWrong} ${REMARKS.watarWhy}`}</MathText></p>}
              <BackLink lesson="hisab-murakkibatay" what="حساب مركبتي شعاع وصورة نقطة بانسحاب" />
            </div>
          ) },
        { num: 3, title: 'تمرين 25 — شهادة التعليم المتوسط', done: all('ex-25'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX25} />
              <TextbookExercise exercise={part('ex-25-1')} requires={['masafa-nuqtatayn']} onAnswered={mark('ex-25-1')} />
              <TextbookExercise exercise={part('ex-25-2')} requires={['aks-fithaghuris']} onAnswered={mark('ex-25-2')} />
              <TextbookExercise exercise={part('ex-25-3')} requires={['hisab-murakkibat']} onAnswered={mark('ex-25-3')} />
              <TextbookExercise exercise={part('ex-25-4')} requires={['mutawazi-tartib']} onAnswered={mark('ex-25-4')} />
              {done['ex-25-4'] && <KnowledgeBrick id="burhan-tahlili" lead="التمارين 22 و 23 و 25 بنفس الطريقة: ما هي؟" />}
              <BackLink lesson="ithbat-khawas-maalam" what="توظيف الحساب الشعاعي والإحداثيات لإثبات الخواص" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
