import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, TapQuestion } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { QCM, LESSON_TITLES } from '../content/textbook';

/**
 * Module 2 — « أؤكّد تعلّماتي » (p. 16) : les neuf QCM du manuel, chacun
 * avec son renvoi « عند الحاجة أعود إلى … » vers le درس (le manuel renvoie à
 * la page). Laboratoire : pas de preuve d'apprentissage ; on consolide.
 */
export default function Module02Uakkid() {
  const [done, setDone] = useState({});
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="أؤكّد تعلّماتي" moduleSubtitle="في كل حالة اختر الإجابة الصحيحة، وبرّر اختيارك" estimatedTime="16 دقيقة"
      brief={{ tag: 'أؤكّد تعلّماتي — الكتاب ص 16', title: 'تسعة أسئلة، من الدرس 1 إلى الدرس 7', tone: 'sky', body: <p>عند الحاجة، الرابط تحت كل سؤال يعيدك إلى الدرس المعنيّ.</p> }}
      steps={QCM.map((it, i) => ({ num: i + 1, title: `السؤال ${it.n}`, done: !!done[it.n],
        content: (
          <div className="space-y-2">
            <TapQuestion prompt={<span><MathText>{it.text}</MathText> <SourceTag source={it.source} /></span>} options={it.options.map((o) => <MathText key={o}>{o}</MathText>)} correct={it.correct} cols={1}
              explain={<MathText>{it.explain}</MathText>} onAnswered={() => setDone((d) => ({ ...d, [it.n]: true }))} />
            <p className="text-xs text-slate-500">عند الحاجة أعود إلى الصفحة {it.pages.join(' و ')} — <Link to={it.lessonPath} className="text-blue-700 underline">{LESSON_TITLES[it.lesson]}</Link></p>
          </div>
        ) }))}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
