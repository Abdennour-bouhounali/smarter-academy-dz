import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { QCM1, QCM3, QCM4_OPTIONS } from '../content/figures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 136) : les sept QCM du manuel, au mot près, chacun avec son renvoi « عند الحاجة
 * أعود إلى الصفحة … » vers le درس qui l'enseigne (1, 3 → p. 130, درس 1 ; 2 → pp. 130–131, دروس 1 et 2 ; 6 → pp. 131–132,
 * درس 2 ; 4, 5, 7 → pp. 132–133, درس 3) et sa figure redessinée (GeoFigure, content/figures.js). Les items 1 et 2 ont DEUX
 * bonnes réponses (une ligne صحيح / خاطئ par réponse) ; l'item 4 propose trois FIGURES. Une étape par item pour que
 * l'audit lise chaque `requires`. Pas de preuve d'apprentissage ; on consolide. LP : P1.
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
  const [i1, i2, i3, i4, i5, i6, i7] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="10 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 136', title: 'سبعة أسئلة من دروس الوحدة', tone: 'sky', body: <p>قد تكون في السؤال أكثر من إجابة صحيحة: احكم على كل إجابة وحدها. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i1} /></p>
              <GeoFigure {...QCM1} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث (قد تصحّ أكثر من واحدة).</p>}
                rows={i1.options.map((o, k) => ({ id: `a${k}`, label: <MathText>{o}</MathText>, options: TRUE_FALSE, correct: i1.correct.includes(k) ? 0 : 1 }))}
                requires={['tasawi-shuaayn']}
                feedback={fb(i1.explain)}
                onAnswered={mark(1)} />
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i2} /></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">احكم على كل إجابة من الإجابات الثلاث (قد تصحّ أكثر من واحدة).</p>}
                rows={i2.options.map((o, k) => ({ id: `a${k}`, label: <MathText>{o}</MathText>, options: TRUE_FALSE, correct: i2.correct.includes(k) ? 0 : 1 }))}
                requires={['sura-insihab']}
                feedback={fb(i2.explain)}
                onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i3} />} above={<GeoFigure {...QCM3} />} options={opts(i3.options)} correct={i3.correct} cols={1}
                requires={['tasawi-shuaayn']} explain={<MathText>{i3.explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i4} />}
                options={i4.options.map((o, k) => (
                  <span key={o} className="flex flex-col items-center gap-1"><GeoFigure {...QCM4_OPTIONS[k]} inline /><MathText>{o}</MathText></span>
                ))}
                correct={i4.correct} cols={3}
                requires={['alaqat-shal', 'mutawazi-tartib']} explain={<MathText>{i4.explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i5} />} options={opts(i5.options)} correct={i5.correct} cols={3}
                requires={['mutawazi-tartib', 'fithaghuris']} explain={<MathText>{i5.explain}</MathText>} onAnswered={mark(5)} />
              <BackLink it={i5} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i6} />} options={opts(i6.options)} correct={i6.correct} cols={1}
                requires={['tasawi-shuaayn']} explain={<MathText>{i6.explain}</MathText>} onAnswered={mark(6)} />
              <BackLink it={i6} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i7} />} options={opts(i7.options)} correct={i7.correct} cols={3}
                requires={['alaqat-shal']} explain={<MathText>{i7.explain}</MathText>} onAnswered={mark(7)} />
              <BackLink it={i7} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
