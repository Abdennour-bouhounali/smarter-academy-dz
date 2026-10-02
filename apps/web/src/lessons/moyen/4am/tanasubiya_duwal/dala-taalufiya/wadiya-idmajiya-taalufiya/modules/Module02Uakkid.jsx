import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';

/**
 * Module 2 — « أؤكّد تعلّماتي » : huit QCM de la PLATEFORME (le manuel fourni n'en a pas pour cette
 * unité), un ou deux par درس, chacun avec son renvoi « عند الحاجة أعود إلى الدرس … » (comme la colonne
 * « عند الحاجة أعود إلى الصفحة » du manuel) : Q1–Q2 → درس 1 ; Q3–Q4 → درس 2 ; Q5 → درس 3 ;
 * Q6–Q7 → درس 4 ; Q8 → درس 5. Chaque distracteur est FAUX et porte une erreur nommée dans
 * l'explication. Les étapes sont écrites une à une pour que l'audit lise chaque `requires`.
 * Pas de preuve d'apprentissage ; on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500" data-back-to={it.lesson}>عند الحاجة أعود إلى <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — أسئلة من المنصّة', title: 'ثمانية أسئلة على الدروس الخمسة', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={3} requires={['naw-dala']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[1]} />} options={opts(QCM[1])} correct={QCM[1].correct} cols={3} requires={['adad-sura']}
                explain={<MathText>{QCM[1].explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={QCM[1]} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={3} requires={['tartib-mabda']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} options={opts(QCM[3])} correct={QCM[3].correct} cols={3} requires={['tartib-mabda', 'muamil-tawjih']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[4]} />} options={opts(QCM[4])} correct={QCM[4].correct} cols={3} requires={['tanasub-taghayyurat']}
                explain={<MathText>{QCM[4].explain}</MathText>} onAnswered={mark(5)} />
              <BackLink it={QCM[4]} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[5]} />} options={opts(QCM[5])} correct={QCM[5].correct} cols={3} requires={['taqatu-jumla']}
                explain={<MathText>{QCM[5].explain}</MathText>} onAnswered={mark(6)} />
              <BackLink it={QCM[5]} />
            </div>
          ) },
        { num: 7, title: 'السؤال 7', done: !!done[7],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[6]} />} options={opts(QCM[6])} correct={QCM[6].correct} cols={1} requires={['taqatu-jumla', 'muamil-tawjih']}
                explain={<MathText>{QCM[6].explain}</MathText>} onAnswered={mark(7)} />
              <BackLink it={QCM[6]} />
            </div>
          ) },
        { num: 8, title: 'السؤال 8', done: !!done[8],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[7]} />} options={opts(QCM[7])} correct={QCM[7].correct} cols={1} requires={['mufadala', 'ikhtiyar-sigha']}
                explain={<MathText>{QCM[7].explain}</MathText>} onAnswered={mark(8)} />
              <BackLink it={QCM[7]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
