import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 40) : les treize QCM du manuel, au mot près,
 * chacun avec son renvoi « عند الحاجة أعود إلى الصفحة … » (la colonne du
 * tableau) vers le درس qui l'enseigne. L'item 5 a DEUX bonnes réponses dans le
 * manuel (√2(x + √2) et 2(√2/2 x + 1)) : il est posé en lignes « يساويه /
 * لا يساويه », chaque ligne ayant une seule réponse juste. Les étapes sont
 * écrites une à une pour que l'audit lise chaque `requires`. Laboratoire :
 * pas de preuve d'apprentissage ; on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500">عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);
const Q5 = QCM[4];
const EQUAL = ['يساويه', 'لا يساويه'];

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="12 دقيقة"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 40', title: 'ثلاثة عشر سؤالًا من الدروس 1 و 2 و 3', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={1} requires={['nashr-jadaa']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={() => mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[1]} />} options={opts(QCM[1])} correct={QCM[1].correct} cols={1} requires={['nashr-jadaa']}
                explain={<MathText>{QCM[1].explain}</MathText>} onAnswered={() => mark(2)} />
              <BackLink it={QCM[1]} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={1} requires={['nashr-jadaa']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={() => mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} options={opts(QCM[3])} correct={QCM[3].correct} cols={1} requires={['tahlil-ibara']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={() => mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q5.text}</MathText> <SourceTag source={Q5.source} /> <span className="block text-xs font-normal text-slate-500">في الكتاب إجابتان صحيحتان: احكم على كل كتابة.</span></p>}
                rows={Q5.options.map((o, k) => ({ id: `q5-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: EQUAL, correct: Q5.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q5.rowCorrections[k]}</MathText> }))}
                requires={['tahlil-ibara']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: الكتابتان (1) و (3) تحليلان صحيحان للعبارة نفسها.' : 'الكتابتان (1) و (3) صحيحتان: $\\sqrt{2} \\times \\sqrt{2} = 2$ و $2 \\times \\dfrac{\\sqrt{2}}{2} = \\sqrt{2}$.'}</MathText>}
                onAnswered={() => mark(5)} />
              <BackLink it={Q5} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[5]} />} options={opts(QCM[5])} correct={QCM[5].correct} cols={1} requires={['tahlil-ibara']}
                explain={<MathText>{QCM[5].explain}</MathText>} onAnswered={() => mark(6)} />
              <BackLink it={QCM[5]} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[6]} />} options={opts(QCM[6])} correct={QCM[6].correct} cols={1} requires={['mutatabiqat']}
                explain={<MathText>{QCM[6].explain}</MathText>} onAnswered={() => mark(7)} />
              <BackLink it={QCM[6]} />
            </div>
          ) },
        { num: 8, title: 'السؤال 8', done: !!done[8],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[7]} />} options={opts(QCM[7])} correct={QCM[7].correct} cols={1} requires={['mutatabiqat']}
                explain={<MathText>{QCM[7].explain}</MathText>} onAnswered={() => mark(8)} />
              <BackLink it={QCM[7]} />
            </div>
          ) },
        { num: 9, title: 'السؤال 9', done: !!done[9],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[8]} />} options={opts(QCM[8])} correct={QCM[8].correct} cols={1} requires={['tahlil-ibara', 'mutatabiqat']}
                explain={<MathText>{QCM[8].explain}</MathText>} onAnswered={() => mark(9)} />
              <BackLink it={QCM[8]} />
            </div>
          ) },
        { num: 10, title: 'السؤال 10', done: !!done[10],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[9]} />} options={opts(QCM[9])} correct={QCM[9].correct} cols={1} requires={['tahlil-ibara', 'mutatabiqat']}
                explain={<MathText>{QCM[9].explain}</MathText>} onAnswered={() => mark(10)} />
              <BackLink it={QCM[9]} />
            </div>
          ) },
        { num: 11, title: 'السؤال 11', done: !!done[11],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[10]} />} options={opts(QCM[10])} correct={QCM[10].correct} cols={1} requires={['tahlil-ibara', 'mutatabiqat']}
                explain={<MathText>{QCM[10].explain}</MathText>} onAnswered={() => mark(11)} />
              <BackLink it={QCM[10]} />
            </div>
          ) },
        { num: 12, title: 'السؤال 12', done: !!done[12],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[11]} />} options={opts(QCM[11])} correct={QCM[11].correct} cols={1} requires={['tahlil-ibara', 'mutatabiqat']}
                explain={<MathText>{QCM[11].explain}</MathText>} onAnswered={() => mark(12)} />
              <BackLink it={QCM[11]} />
            </div>
          ) },
        { num: 13, title: 'السؤال 13', done: !!done[13],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[12]} />} options={opts(QCM[12])} correct={QCM[12].correct} cols={3} requires={['mutatabiqat']}
                explain={<MathText>{QCM[12].explain}</MathText>} onAnswered={() => mark(13)} />
              <BackLink it={QCM[12]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
