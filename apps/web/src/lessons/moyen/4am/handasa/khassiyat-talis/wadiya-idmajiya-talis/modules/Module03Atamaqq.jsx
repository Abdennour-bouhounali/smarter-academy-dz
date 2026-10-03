import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { LESSON_TITLES } from '../content/textbook';
import { EX20, EX22 } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق (p. 113) : l'exercice 20 (le trapèze : Thalès deux fois, puis les médianes — la figure que
 * l'élève doit « tracer » est redessinée), l'exercice 22 (la largeur de l'oued : l'inconnue OB est une PARTIE du
 * côté OD = OB + 6) et une situation de la plateforme (TRANSFERT) qui prolonge l'encadré « طالس » de l'ouverture :
 * la grande pyramide mesurée par l'ombre (où mesure-t-on l'ombre ? h = 219 ÷ 1,5 = 146 m). La brique
 * `taqdir-masafa` est posée avant ex. 22 : elle DIT la méthode, jamais la réponse. LP : P1, P3.
 */
const BackLink = ({ lesson, what }) => (
  <p className="text-xs text-slate-500" data-back-link={lesson}>{what} — <Link to={`${BASE}/${lesson}`} className="text-blue-700 underline">{LESSON_TITLES[lesson]}</Link></p>
);

export default function Module03Atamaqq() {
  const [done, setDone] = useState({});
  const mark = (id) => () => setDone((d) => ({ ...d, [id]: true }));
  const all = (p) => partsOf(p).every((ex) => done[ex.id]);
  const part = (id) => partsOf(id.replace(/-\d+$/, '')).find((ex) => ex.id === id);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="أتعمّق"
      moduleSubtitle="شبه منحرف، عرض نهر، وهرم طالس"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتعمّق — الكتاب ص 113 ووضعية من المنصّة', title: 'أين وضعية طالس؟ ثم أكتب النسب وأحلّ', tone: 'rose',
        body: <p>في كل تمرين: أبحث عن مستقيمين متوازيين يقطعان مستقيمين متقاطعين، أسمّي النقطة المشتركة، أكتب النسب المتساوية، ثم أحلّ وأتحقّق أنّ النتيجة ملائمة.</p> }}
      steps={[
        { num: 1, title: 'تمرين 20 — شبه منحرف ووضعيتان', done: all('ex-20'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX20} />
              <TextbookExercise exercise={part('ex-20-1')} requires={['talis-mubashira']} onAnswered={mark('ex-20-1')} />
              <TextbookExercise exercise={part('ex-20-2')} requires={['talis-mubashira']} onAnswered={mark('ex-20-2')} />
              <TextbookExercise exercise={part('ex-20-3')} requires={['mutawassitat']} onAnswered={mark('ex-20-3')} />
              <BackLink lesson="talis-hisab-atwal" what="وضعية «الفراشة» والنسب المتساوية" />
            </div>
          ) },
        { num: 2, title: 'تمرين 22 — عرض نهر', done: all('ex-22'),
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="taqdir-masafa" lead="المجهول هنا جزء من ضلع: كيف نكتب الضلع كاملا؟" />
              <GeoFigure {...EX22} />
              <TextbookExercise exercise={part('ex-22-1')} requires={['taqdir-masafa']} onAnswered={mark('ex-22-1')} />
              <TextbookExercise exercise={part('ex-22-2')} requires={['taqdir-masafa', 'muadala-ula']} onAnswered={mark('ex-22-2')} />
              <BackLink lesson="talis-hisab-atwal" what="حساب طول بخاصية طالس" />
            </div>
          ) },
        { num: 3, title: 'هرم طالس بطريقة الظل', done: all('haram'),
          content: (
            <div className="space-y-3">
              <TextbookExercise exercise={part('haram-1')} requires={['tariqat-zill']} onAnswered={mark('haram-1')} />
              <TextbookExercise exercise={part('haram-2')} requires={['tariqat-zill', 'rabi-mutanasib']} onAnswered={mark('haram-2')} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
