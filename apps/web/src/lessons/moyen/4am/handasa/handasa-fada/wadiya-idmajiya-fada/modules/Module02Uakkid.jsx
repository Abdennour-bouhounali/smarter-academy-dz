import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';

/**
 * Module 2 — « أؤكّد تعلّماتي ». Le scan n'a PAS de QCM (extraction › scope.missing_pages) : cinq questions de la PLATEFORME
 * (`synthesis_generation`, content/textbook.js › QCM), une par idée des dourous de l'unité — la كرة et la جلّة (درس 1), le volume
 * de la boule (درس 2), la section d'une sphère et celle d'un cône (درس 3), l'effet de k sur un volume (درس 4) —, chacune avec
 * son renvoi vers le درس qui l'enseigne. Une étape par question pour que l'audit lise chaque `requires`. Pas de preuve
 * d'apprentissage ; on consolide. LP : P1.
 */
const Prompt = ({ it }) => <span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>;
const BackLink = ({ it }) => (
  <p className="text-xs text-slate-500" data-back-link={it.lessons.join(' ')}>
    عند الحاجة أعود إلى{' '}
    {it.lessons.map((l, i) => (
      <React.Fragment key={l}>{i > 0 && ' ، '}<Link to={it.lessonPaths[i]} className="text-blue-700 underline">{LESSON_TITLES[l]}</Link></React.Fragment>
    ))}
  </p>
);
const opts = (list) => list.map((o) => <MathText key={o}>{o}</MathText>);

export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  const mark = (n) => () => setDone((d) => ({ ...d, [n]: true }));
  const [i1, i2, i3, i4, i5] = QCM;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة مما يلي اختر الإجابة الصحيحة، وبرّر اختيارك" estimatedTime="9 دقائق"
      brief={{ tag: 'أؤكّد تعلّماتي — أسئلة من المنصّة', title: 'خمسة أسئلة من دروس الوحدة', tone: 'sky', body: <p>اختر الإجابة الصحيحة وبرّر اختيارك. عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={[
        { num: 1, title: 'السؤال 1 — الكرة والجلة', done: !!done[1],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i1} />} options={opts(i1.options)} correct={i1.correct} cols={1}
                requires={['kura-julla']} explain={<MathText>{i1.explain}</MathText>} onAnswered={mark(1)} />
              <BackLink it={i1} />
            </div>
          ) },
        { num: 2, title: 'السؤال 2 — حجم الجلة', done: !!done[2],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i2} />} options={opts(i2.options)} correct={i2.correct} cols={2}
                requires={['hajm-julla']} explain={<MathText>{i2.explain}</MathText>} onAnswered={mark(2)} />
              <BackLink it={i2} />
            </div>
          ) },
        { num: 3, title: 'السؤال 3 — مقطع كرة', done: !!done[3],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i3} />} options={opts(i3.options)} correct={i3.correct} cols={2}
                requires={['maqta-kura']} explain={<MathText>{i3.explain}</MathText>} onAnswered={mark(3)} />
              <BackLink it={i3} />
            </div>
          ) },
        { num: 4, title: 'السؤال 4 — مقطع مخروط', done: !!done[4],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i4} />} options={opts(i4.options)} correct={i4.correct} cols={1}
                requires={['maqta-mukhrut', 'takbir-k3']} explain={<MathText>{i4.explain}</MathText>} onAnswered={mark(4)} />
              <BackLink it={i4} />
            </div>
          ) },
        { num: 5, title: 'السؤال 5 — نموذج مصغّر', done: !!done[5],
          content: (
            <div className="space-y-2">
              <TapQuestion prompt={<Prompt it={i5} />} options={opts(i5.options)} correct={i5.correct} cols={4}
                requires={['takbir-k3']} explain={<MathText>{i5.explain}</MathText>} onAnswered={mark(5)} />
              <BackLink it={i5} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
