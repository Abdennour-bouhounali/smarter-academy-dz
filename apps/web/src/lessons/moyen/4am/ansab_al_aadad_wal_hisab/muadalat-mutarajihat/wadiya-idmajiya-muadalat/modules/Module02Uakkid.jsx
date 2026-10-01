import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import { NumberLine } from '../components/MuadalatFigures';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 52) : les neuf QCM du manuel, au mot près,
 * chacun avec son renvoi « عند الحاجة أعود إلى الصفحة … » vers le درس qui
 * l'enseigne (1–2 → درس 1, 3–4 → درس 2, 5–9 → درس 3). Les items 5 et 7 ont
 * DEUX bonnes réponses dans le manuel : posés en lignes « يحقّق / لا يحقّق »,
 * chaque ligne ayant une seule réponse juste. Les items 6 et 9 sont des
 * DESSINS de demi-droites (convention du manuel : rouge = solutions, crochet
 * tourné vers le rouge quand la borne est une solution), redessinés en SVG.
 * Les étapes sont écrites une à une pour que l'audit lise chaque `requires`.
 * Laboratoire : pas de preuve d'apprentissage ; on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const lines = (it) => it.lines.map((l, k) => (
  <NumberLine key={k} {...l} compact label={`تمثيل على مستقيم مدرّج: الجزء الملوّن ${l.side === 'right' ? 'على يمين' : 'على يسار'} العدد ${l.bound}، والعدد ${l.bound} ${l.included ? 'منه' : 'ليس منه'}`} />
));
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500">عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);
const Q5 = QCM[4];
const Q7 = QCM[6];
const YES = ['يحقّق', 'لا يحقّق'];
const IMPLIED = ['صحيحة', 'ليست بالضرورة صحيحة'];

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="10 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 52', title: 'تسعة أسئلة من الدروس 1 و 2 و 3', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={3} requires={['hall-muadala']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={() => mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[1]} />} options={opts(QCM[1])} correct={QCM[1].correct} cols={3} requires={['hall-muadala']}
                explain={<MathText>{QCM[1].explain}</MathText>} onAnswered={() => mark(2)} />
              <BackLink it={QCM[1]} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={1} requires={['jidaa-maadum-khassiya']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={() => mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} options={opts(QCM[3])} correct={QCM[3].correct} cols={1} requires={['jidaa-maadum-khassiya', 'nashr-tahlil']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={() => mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q5.text}</MathText> <SourceTag source={Q5.source} /> <span className="block text-xs font-normal text-slate-500">في الكتاب إجابتان صحيحتان: احكم على كل متباينة.</span></p>}
                rows={Q5.options.map((o, k) => ({ id: `q5-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: IMPLIED, correct: Q5.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q5.rowCorrections[k]}</MathText> }))}
                requires={['hall-mutarajiha']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: (1) و (3) صحيحتان، لأنّ الضرب في 2 والإضافة يحافظان على الاتجاه.' : 'الإجابتان (1) و (3) صحيحتان: $x \\geq -1$ يعطي $2x \\geq -2$ ، ثم $2x + 2 \\geq 0$.'}</MathText>}
                onAnswered={() => mark(5)} />
              <BackLink it={Q5} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[5]} />} options={lines(QCM[5])} correct={QCM[5].correct} cols={1} requires={['tamthil-hulul']}
                explain={<span><MathText>{QCM[5].explain}</MathText> <MathText>{`الرسوم الثلاثة تمثّل: ${QCM[5].optionsMean.join(' ، ')}`}</MathText></span>}
                onAnswered={() => mark(6)} />
              <BackLink it={QCM[5]} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q7.text}</MathText> <SourceTag source={Q7.source} /> <span className="block text-xs font-normal text-slate-500"><MathText>{'في الكتاب إجابتان صحيحتان: هل يحقّق $-1$ كل متراجحة؟'}</MathText></span></p>}
                rows={Q7.options.map((o, k) => ({ id: `q7-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: YES, correct: Q7.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q7.rowCorrections[k]}</MathText> }))}
                requires={['hall-mutarajiha']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: نعوّض $x$ بـ $-1$ ونحكم على المتباينة العددية.' : 'العدد $-1$ حلّ للمتراجحتين (2) و (3): نعوّض ونتحقّق.'}</MathText>}
                onAnswered={() => mark(7)} />
              <BackLink it={Q7} />
            </div>
          ) },
        { num: 8, title: 'السؤال 8', done: !!done[8],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[7]} />} options={opts(QCM[7])} correct={QCM[7].correct} cols={3} requires={['hall-mutarajiha']}
                explain={<MathText>{QCM[7].explain}</MathText>} onAnswered={() => mark(8)} />
              <BackLink it={QCM[7]} />
            </div>
          ) },
        { num: 9, title: 'السؤال 9', done: !!done[9],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[8]} />} options={lines(QCM[8])} correct={QCM[8].correct} cols={1} requires={['hall-mutarajiha', 'tamthil-hulul']}
                explain={<span><MathText>{QCM[8].explain}</MathText> <MathText>{`الرسوم الثلاثة تمثّل: ${QCM[8].optionsMean.join(' ، ')}`}</MathText></span>}
                onAnswered={() => mark(9)} />
              <BackLink it={QCM[8]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
