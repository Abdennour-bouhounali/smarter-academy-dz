import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { QcmLineFigure } from '../components/CableCarFigure';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 74) : les huit QCM du manuel, au mot près, chacun avec son
 * renvoi « عند الحاجة أعود إلى الصفحة … » vers le درس qui l'enseigne (2, 3, 5, 6 → درس 2 ;
 * 1, 4 → درس 3 ; 7, 8 → درس 4 — extraction › qcm › duplicatedIn). L'item 7 a TROIS bonnes
 * réponses dans le manuel (19 300 kg/m³ = 19,3 kg/L = 19,3 g/cm³) : posé en lignes « صحيح /
 * خاطئ ». La figure de l'item 4 et le tableau de l'item 6 sont redessinés. Les étapes sont
 * écrites une à une pour que l'audit lise chaque `requires`. Pas de preuve d'apprentissage ;
 * on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500">عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);

/** Le tableau de l'item 6, lu de gauche à droite comme dans le manuel. */
function Q6Table({ table }) {
  return (
    <table dir="ltr" className="mx-auto border-collapse text-center font-mono text-sm" data-qcm-table="6">
      <tbody>
        <tr><th className="border border-slate-400 px-2 py-1"><MathText>{'$x$'}</MathText></th>{table.x.map((v, i) => <td key={i} className="border border-slate-400 px-3 py-1">{v}</td>)}</tr>
        <tr><th className="border border-slate-400 px-2 py-1"><MathText>{'$f(x)$'}</MathText></th>{table.y.map((v, i) => <td key={i} className="border border-slate-400 px-3 py-1">{v}</td>)}</tr>
      </tbody>
    </table>
  );
}

const TRUE_FALSE = ['صحيح', 'خاطئ'];
const Q7 = QCM[6];

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="10 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 74', title: 'ثمانية أسئلة من الدروس 2 و 3 و 4', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={3} requires={['tayin-muamil', 'qiraa-bayaniya']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[1]} />} options={opts(QCM[1])} correct={QCM[1].correct} cols={3} requires={['sura-adad']}
                explain={<MathText>{QCM[1].explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={QCM[1]} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={3} requires={['sura-adad', 'tayin-muamil']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} above={<QcmLineFigure />} options={opts(QCM[3])} correct={QCM[3].correct} cols={3} requires={['qiraa-bayaniya', 'shakl-khatti']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[4]} />} options={opts(QCM[4])} correct={QCM[4].correct} cols={3} requires={['tayin-muamil']}
                explain={<MathText>{QCM[4].explain}</MathText>} onAnswered={mark(5)} />
              <BackLink it={QCM[4]} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[5]} />} above={<Q6Table table={QCM[5].table} />} options={opts(QCM[5])} correct={QCM[5].correct} cols={3} requires={['tayin-muamil']}
                explain={<MathText>{QCM[5].explain}</MathText>} onAnswered={mark(6)} />
              <BackLink it={QCM[5]} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q7.text}</MathText> <SourceTag source={Q7.source} /> <span className="block text-xs font-normal text-slate-500">في الكتاب أكثر من إجابة صحيحة: احكم على كل كتابة.</span></p>}
                rows={Q7.options.map((o, k) => ({ id: `q7-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: TRUE_FALSE, correct: Q7.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q7.rowCorrections[k]}</MathText> }))}
                requires={['maqadir-murakkaba']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: الكتابات الثلاث صحيحة، إنها القيمة نفسها بثلاث وحدات.' : 'الكتابات الثلاث صحيحة: $\\dfrac{135{,}1}{7} = 19{,}3$ غرام في كل $\\mathrm{cm^3}$ ، ثم نحوّل الوحدات.'}</MathText>}
                onAnswered={mark(7)} />
              <BackLink it={Q7} />
            </div>
          ) },
        { num: 8, title: 'السؤال 8', done: !!done[8],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[7]} />} options={opts(QCM[7])} correct={QCM[7].correct} cols={3} requires={['nisba-takhfid', 'shakl-khatti']}
                explain={<MathText>{QCM[7].explain}</MathText>} onAnswered={mark(8)} />
              <BackLink it={QCM[7]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
