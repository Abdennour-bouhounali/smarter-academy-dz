import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { QCM1, QCM2, QCM3, QCM5 } from '../content/figures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 124) : les six QCM du manuel, au mot près, chacun avec son renvoi « عند الحاجة
 * أعود إلى الصفحة … » vers le درس qui l'enseigne (1–5 → pp. 118–119, درس 1 — et درس 4 pour l'inconnue au dénominateur ;
 * 6 → pp. 120–121, درس 3) et sa figure redessinée (GeoFigure, content/figures.js). L'item 3 a DEUX bonnes réponses
 * (une ligne صحيح / خاطئ par réponse) ; l'item 5 a deux lignes IE et EL jugées SÉPARÉMENT. Une étape par item pour
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
const opts = (list) => list.map((o) => <MathText key={o}>{o}</MathText>);
const fb = (explain) => ({ allRight }) => <MathText>{`${allRight ? 'أحسنت. ' : ''}${explain}`}</MathText>;

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  const [i1, i2, i3, i4, i5, i6] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="10 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 124', title: 'ستة أسئلة من دروس الوحدة', tone: 'sky', body: <p>قد تكون في السؤال أكثر من إجابة صحيحة: احكم على كل إجابة وحدها. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i1} />} above={<GeoFigure {...QCM1} />} options={opts(i1.options)} correct={i1.correct} cols={3}
                requires={['nisab-tarif']} explain={<MathText>{i1.explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i2} />} above={<GeoFigure {...QCM2} />} options={opts(i2.options)} correct={i2.correct} cols={3}
                requires={['nisab-tarif']} explain={<MathText>{i2.explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i3} /></p>
              <GeoFigure {...QCM3} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث (قد تصحّ أكثر من واحدة).</p>}
                rows={i3.options.map((o, k) => ({ id: `a${k}`, label: <MathText>{o}</MathText>, options: TRUE_FALSE, correct: i3.correct.includes(k) ? 0 : 1 }))}
                requires={['nisab-tarif', 'majhul-maqam']}
                feedback={fb(i3.explain)}
                onAnswered={mark(3)} />
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i4} />} options={opts(i4.options)} correct={i4.correct} cols={3}
                requires={['majhul-maqam']} explain={<MathText>{i4.explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i5} /></p>
              <GeoFigure {...QCM5} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">اختر العبارة الصحيحة في كل سطر.</p>}
                rows={['IE', 'EL'].map((r) => ({ id: r, label: <MathText>{`$${r}$`}</MathText>, options: opts(i5.rows[r].options), correct: i5.rows[r].correct }))}
                requires={['nisab-tarif', 'majhul-maqam']}
                feedback={fb(i5.explain)}
                onAnswered={mark(5)} />
              <p className="text-xs text-slate-500">{i5.note}</p>
              <BackLink it={i5} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i6} />} options={opts(i6.options)} correct={i6.correct} cols={3}
                requires={['alaqa-asasiya']} explain={<MathText>{i6.explain}</MathText>} onAnswered={mark(6)} />
              <BackLink it={i6} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
