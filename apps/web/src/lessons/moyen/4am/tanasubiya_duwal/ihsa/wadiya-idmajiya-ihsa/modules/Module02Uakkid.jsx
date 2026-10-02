import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';
import StatTable from '../components/StatTable';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 100) : les six QCM du manuel, au mot près, chacun avec son renvoi
 * « عند الحاجة أعود إلى الصفحة … » vers le درس qui l'enseigne (1, 2 → درس 1 « التكرار المجمع » ; 3–6 →
 * درس 2 « مدى ووسيط ومتوسط » — extraction › qcm › duplicatedIn). Les tableaux des items 1 et 2 sont
 * redessinés. Les étapes sont écrites une à une pour que l'audit lise chaque `requires`. Pas de preuve
 * d'apprentissage ; on consolide. LP : P1.
 */
const opts = (it) => it.options.map((o) => <MathText key={o}>{o}</MathText>);
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const Table = ({ it }) => <StatTable id={`qcm-${it.n}`} values={it.table.values} counts={it.table.counts} />;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500" data-back-link={it.lesson}>عند الحاجة أعود إلى الصفحة <bdi dir="ltr">{it.pages.join(' و ')}</bdi> — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
);

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 100', title: 'ستة أسئلة من الدرسين 1 و 2', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[0]} />} above={<Table it={QCM[0]} />} options={opts(QCM[0])} correct={QCM[0].correct} cols={3} requires={['takrar-mujamma']}
                explain={<MathText>{QCM[0].explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={QCM[0]} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[1]} />} above={<Table it={QCM[1]} />} options={opts(QCM[1])} correct={QCM[1].correct} cols={3} requires={['takrar-mujamma']}
                explain={<MathText>{QCM[1].explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={QCM[1]} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[2]} />} options={opts(QCM[2])} correct={QCM[2].correct} cols={3} requires={['wasit-rutba']}
                explain={<MathText>{QCM[2].explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={QCM[2]} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[3]} />} options={opts(QCM[3])} correct={QCM[3].correct} cols={3} requires={['mada']}
                explain={<MathText>{QCM[3].explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={QCM[3]} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[4]} />} options={opts(QCM[4])} correct={QCM[4].correct} cols={3} requires={['wasit-rutba']}
                explain={<MathText>{QCM[4].explain}</MathText>} onAnswered={mark(5)} />
              <BackLink it={QCM[4]} />
            </div>
          ) },
        { num: 6, title: 'السؤال 6', done: !!done[6],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={QCM[5]} />} options={opts(QCM[5])} correct={QCM[5].correct} cols={3} requires={['mutawassit-murajjah', 'wasit-rutba']}
                explain={<MathText>{QCM[5].explain}</MathText>} onAnswered={mark(6)} />
              <BackLink it={QCM[5]} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
