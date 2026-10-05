import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { QCM1, QCM2, QCM3, QCM4 } from '../content/figures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 160) : les quatre QCM du manuel, au mot près, chacun avec son renvoi « عند الحاجة أعود الى
 * الصفحة … » vers le درس qui l'enseigne (1 → pp. 154–155, درس 1 ; 2–3 → p. 156, درس 3 ; 4 → p. 156, درس 4) et sa figure
 * reproduite (GeoFigure, content/figures.js). L'item 1 a TROIS sous-questions (une ligne par sous-question) ; la première est
 * CORRIGÉE (« صورة A هي » → « صورة B هي », une ligne discrète). L'item 3 compte l'angle plat BOC comme angle au centre (dit en
 * une ligne). Une étape par item pour que l'audit lise chaque `requires`. Pas de preuve d'apprentissage ; on consolide. LP : P1.
 */
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

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  const [i1, i2, i3, i4] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 160', title: 'أربعة أسئلة من دروس الوحدة', tone: 'sky', body: <p>اختر الإجابة الصحيحة وبرّر اختيارك. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700"><Prompt it={i1} /></p>
              <GeoFigure {...QCM1} />
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-700">اختر الصورة في كل سطر.</p>}
                rows={i1.rows.map((r, k) => ({ id: `s${k}`, label: r.text, options: r.options.map((o) => <bdi key={o} dir="ltr">{o}</bdi>), correct: r.correct, correction: <MathText>{r.why}</MathText> }))}
                requires={['sura-dawaran']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: الصورة على نفس البعد من O، والزاوية $60^\\circ$ في الاتجاه المباشر (عكس عقارب الساعة).' : 'صورة نقطة M بهذا الدوران هي M′ حيث $OM\' = OM$ و $\\widehat{MOM\'} = 60^\\circ$ في الاتجاه المباشر.'}</MathText>}
                onAnswered={mark(1)} />
              <p className="text-xs text-slate-500" data-correction="qcm-1"><MathText>{i1.correction}</MathText></p>
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i2} />} above={<GeoFigure {...QCM2} />} options={opts(i2.options)} correct={i2.correct} cols={1}
                requires={['zawiya-muhitiya-markaziya']} explain={<MathText>{i2.explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i3} />} above={<GeoFigure {...QCM3} />} options={opts(i3.options)} correct={i3.correct} cols={3}
                requires={['zawiya-muhitiya-markaziya']} explain={<MathText>{i3.explain}</MathText>} onAnswered={mark(3)} />
              <p className="text-xs text-slate-500" data-reading-note="qcm-3"><MathText>{i3.note}</MathText></p>
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i4} />} above={<GeoFigure {...QCM4} />} options={opts(i4.options)} correct={i4.correct} cols={3}
                requires={['mudalla-muntazam']} explain={<MathText>{i4.explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
