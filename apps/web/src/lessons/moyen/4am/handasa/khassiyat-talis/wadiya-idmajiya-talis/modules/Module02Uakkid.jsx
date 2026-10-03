import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, QCM_CELLS, LESSON_TITLES } from '../content/textbook';
import { QCM1, QCM2, QCM3, QCM4 } from '../content/figures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 112) : les quatre QCM du manuel, au mot près, chacun avec son renvoi
 * « عند الحاجة أعود إلى الصفحة … » vers le درس qui l'enseigne (1, 2 → درس 1 ; 3 → درس 2 ; 4 → دروس 1 و 3 —
 * extraction › qcm › duplicatedIn) et sa figure redessinée (GeoFigure, content/figures.js). Les cellules x et y
 * des items 1 et 2 se jugent SÉPARÉMENT (item 1 : 9/2 et 4,5 sont deux bonnes cellules, d'où une ligne
 * صحيح / خاطئ par cellule) ; l'item 4 a TROIS bonnes réponses (une ligne par affirmation). Une étape par item pour
 * que l'audit lise chaque `requires`. Pas de preuve d'apprentissage ; on consolide. LP : P1.
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
const fb = (explain) => ({ allRight }) => <MathText>{`${allRight ? 'أحسنت. ' : ''}${explain}`}</MathText>;

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  const [i1, i2, i3, i4] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 112', title: 'أربعة أسئلة من دروس الوحدة', tone: 'sky', body: <p>قد تكون في السؤال أكثر من إجابة صحيحة: احكم على كل خانة وحدها. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i1} /></p>
              <GeoFigure {...QCM1} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل خانة من خانات x و y.</p>}
                rows={QCM_CELLS[1].rows.map((r) => ({ id: r.id, label: <MathText>{r.label}</MathText>, options: TRUE_FALSE, correct: r.correct }))}
                requires={['talis-mubashira']}
                feedback={fb(QCM_CELLS[1].explain)}
                onAnswered={mark(1)} />
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i2} /></p>
              <GeoFigure {...QCM2} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">اختر قيمة x ثم قيمة y.</p>}
                rows={[
                  { id: 'x', label: <MathText>{'$x = AB$'}</MathText>, options: QCM_CELLS[2].x.options.map((o) => <MathText key={o}>{o}</MathText>), correct: QCM_CELLS[2].x.correct },
                  { id: 'y', label: <MathText>{'$y = AC$'}</MathText>, options: QCM_CELLS[2].y.options.map((o) => <MathText key={o}>{o}</MathText>), correct: QCM_CELLS[2].y.correct },
                ]}
                requires={['talis-mubashira']}
                feedback={fb(QCM_CELLS[2].explain)}
                onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i3} />} above={<GeoFigure {...QCM3} />} options={i3.options.map((o) => <MathText key={o}>{o}</MathText>)} correct={i3.correct} cols={3}
                requires={['talis-aksiya']}
                explain={<MathText>{i3.explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i4} /></p>
              <GeoFigure {...QCM4} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث.</p>}
                rows={i4.rows.map((r, k) => ({ id: `a${k}`, label: <MathText>{r}</MathText>, options: TRUE_FALSE, correct: 0 }))}
                requires={['talis-mubashira']}
                feedback={fb(i4.explain)}
                onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
