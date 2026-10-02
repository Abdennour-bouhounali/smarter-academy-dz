import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion, BatchChoiceQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 62) : les sept QCM du manuel, au mot près,
 * chacun avec son renvoi « عند الحاجة أعود إلى الصفحة … » vers le درس qui
 * l'enseigne (1–4 → درس 1, 5–6 → درس 2, 7 → درس 3). Les items 2 et 6 ont
 * PLUSIEURS bonnes réponses dans le manuel (deux, puis les trois) : posés en
 * lignes « صحيح / خاطئ », chaque ligne ayant une seule réponse juste. Les étapes
 * sont écrites une à une pour que l'audit lise chaque `requires`.
 * Laboratoire : pas de preuve d'apprentissage ; on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500">عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);
const Q2 = QCM[1];
const Q6 = QCM[5];
const TRUE_FALSE = ['صحيح', 'خاطئ'];

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة أو الإجابات الصحيحة، وبرّر اختيارك" estimatedTime="10 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 62', title: 'سبعة أسئلة من الدروس 1 و 2 و 3', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={1} requires={['mafhum-jumla']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={() => mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q2.text}</MathText> <SourceTag source={Q2.source} /> <span className="block text-xs font-normal text-slate-500"><MathText>{'في الكتاب إجابتان صحيحتان: هل الثنائية $(0 ; 0)$ حل لكل معادلة؟'}</MathText></span></p>}
                rows={Q2.options.map((o, k) => ({ id: `q2-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: TRUE_FALSE, correct: Q2.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q2.rowCorrections[k]}</MathText> }))}
                requires={['hall-jumla']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: نعوّض $x$ و $y$ بـ 0 ونحكم على المساواة.' : 'الثنائية $(0 ; 0)$ حل للمعادلتين (1) و (2) فقط: نعوّض ونتحقق.'}</MathText>}
                onAnswered={() => mark(2)} />
              <BackLink it={Q2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={1} requires={['hall-jumla']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={() => mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} options={opts(QCM[3])} correct={QCM[3].correct} cols={1} requires={['mafhum-jumla']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={() => mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[4]} />} options={opts(QCM[4])} correct={QCM[4].correct} cols={3} requires={['jam', 'hall-jumla']}
                explain={<MathText>{QCM[4].explain}</MathText>} onAnswered={() => mark(5)} />
              <BackLink it={QCM[4]} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <BatchChoiceQuestion
                intro={<p className="font-semibold text-slate-800"><MathText>{Q6.text}</MathText> <SourceTag source={Q6.source} /> <span className="block text-xs font-normal text-slate-500">في الكتاب أكثر من إجابة صحيحة: احكم على كل مساواة.</span></p>}
                rows={Q6.options.map((o, k) => ({ id: `q6-${k + 1}`, label: <span>({k + 1}) <MathText>{o}</MathText></span>, options: TRUE_FALSE, correct: Q6.correctSet.includes(k) ? 0 : 1, correction: <MathText>{Q6.rowCorrections[k]}</MathText> }))}
                requires={['tawid']}
                feedback={({ allRight }) => <MathText>{allRight ? 'أحسنت: الإجابات الثلاث صحيحة، كلها كتابات مكافئة لـ $3x - y = 1$.' : 'الإجابات الثلاث صحيحة: ننقل حدا بتغيير إشارته، أو نقسم الطرفين على العدد نفسه.'}</MathText>}
                onAnswered={() => mark(6)} />
              <BackLink it={Q6} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[6]} />} options={opts(QCM[6])} correct={QCM[6].correct} cols={1} requires={['tarjama-jumla']}
                explain={<MathText>{QCM[6].explain}</MathText>} onAnswered={() => mark(7)} />
              <BackLink it={QCM[6]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
