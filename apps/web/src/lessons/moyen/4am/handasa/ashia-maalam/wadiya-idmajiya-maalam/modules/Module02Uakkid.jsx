import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { QCM1, QCM4 } from '../content/figures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 148) : les cinq QCM du manuel, au mot près, chacun avec son renvoi « عند الحاجة أعود
 * إلى الصفحة … » vers le درس qui l'enseigne (1 → p. 142, دروس 1 et 2 ; 2 → p. 144, 3–5 → pp. 144–145, درس 3) et sa figure
 * reproduite (GeoFigure, content/figures.js). Les items 4 et 5 ont DEUX bonnes réponses (une ligne صحيح / خاطئ par réponse).
 * Une étape par item pour que l'audit lise chaque `requires`. Pas de preuve d'apprentissage ; on consolide. LP : P2, P3.
 */
const TRUE_FALSE = ['صحيح', 'خاطئ'];
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500" data-back-link={it.lessons.join(' ')}>
    عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> —{' '}
    {it.lessons.map((l, i) => (
      <React.Fragment key={l}>{i > 0 && ' ، '}<Link to={it.lessonPaths[i]} className="text-blue-700 underline">{LESSON_TITLES[l]}</Link></React.Fragment>
    ))}
  </p>
);
const opts = (list) => list.map((o) => <MathText key={o}>{o}</MathText>);
const fb = (explain) => ({ allRight }) => <MathText>{`${allRight ? 'أحسنت. ' : ''}${explain}`}</MathText>;

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  const [i1, i2, i3, i4, i5] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 148', title: 'خمسة أسئلة من دروس الوحدة', tone: 'sky', body: <p>قد تكون في السؤال أكثر من إجابة صحيحة: احكم على كل إجابة وحدها. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i1} />} above={<GeoFigure {...QCM1} />} options={opts(i1.options)} correct={i1.correct} cols={3}
                requires={['hisab-murakkibat']} explain={<MathText>{i1.explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i2} />} options={opts(i2.options)} correct={i2.correct} cols={3}
                requires={['muntasaf-qita']} explain={<MathText>{i2.explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i3} />} options={opts(i3.options)} correct={i3.correct} cols={3}
                requires={['masafa-nuqtatayn']} explain={<MathText>{i3.explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i4} /></p>
              <GeoFigure {...QCM4} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث (قد تصحّ أكثر من واحدة).</p>}
                rows={i4.options.map((o, k) => ({ id: `a${k}`, label: <MathText>{o}</MathText>, options: TRUE_FALSE, correct: i4.correct.includes(k) ? 0 : 1 }))}
                requires={['masafa-nuqtatayn']}
                feedback={fb(i4.explain)}
                onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i5} /></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث (قد تصحّ أكثر من واحدة).</p>}
                rows={i5.options.map((o, k) => ({ id: `a${k}`, label: <MathText>{o}</MathText>, options: TRUE_FALSE, correct: i5.correct.includes(k) ? 0 : 1 }))}
                requires={['masafa-nuqtatayn']}
                feedback={fb(i5.explain)}
                onAnswered={mark(5)} />
              <BackLink it={i5} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
