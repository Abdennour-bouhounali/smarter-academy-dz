import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentModule, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { partsOf } from '../content/exercises';
import { LESSON_TITLES, REMARKS } from '../content/textbook';
import { EX19, EX22 } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق (p. 137) : l'exercice 19 (« من امتحان شهادة التعليم المتوسط » : deux translations, F milieu de
 * [ED], EGDC متوازي أضلاع puis CARRÉ par ses diagonales, aire 32 cm², U = EF + EC + FG = ED par Chasles puis la règle du
 * متوازي أضلاع) et l'exercice 22 (les milieux d'un quadrilatère quelconque : AD + BC = AC + BD par Chasles, MNPQ
 * متوازي أضلاع par la droite des milieux — la note de l'extraction : « MN = ½ DB » sort du programme vectoriel de 4AM,
 * la preuve passe par la propriété des milieux, en longueurs). La brique `burhan-shuai` est posée APRÈS l'exercice 22 (elle
 * nomme la chaîne commune aux deux ; posée avant, elle aurait donné la réponse de 22-2) ; seule la figure DONNÉE est dessinée (le triangle EFG ; le quadrilatère et
 * ses milieux). LP : P3 (les translations, Chasles), P1 (le carré, l'aire, MNPQ).
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
      moduleSubtitle="براهين بالأشعة: انسحابان ومربع، ومنتصفات أضلاع رباعي"
      estimatedTime="10 دقائق"
      brief={{ tag: 'أتعمّق — الكتاب ص 137', title: 'من الانسحاب إلى تساوي شعاعين، ومن علاقة شال إلى متوازي الأضلاع', tone: 'rose',
        body: <p>في كل تمرين: أترجم كل صورة بانسحاب إلى تساوي شعاعين، وأستعمل علاقة شال لإدخال نقطة، ثم أستنتج متوازي أضلاع أو منتصفا، وأنتبه إلى ترتيب الرؤوس.</p> }}
      steps={[
        { num: 1, title: 'تمرين 19 — شهادة التعليم المتوسط', done: all('ex-19'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX19} />
              <TextbookExercise exercise={part('ex-19-1')} requires={['sura-insihab']} onAnswered={mark('ex-19-1')} />
              <TextbookExercise exercise={part('ex-19-2')} requires={['mutawazi-tartib']} onAnswered={mark('ex-19-2')} />
              <TextbookExercise exercise={part('ex-19-3')} requires={['mutawazi-tartib']} onAnswered={mark('ex-19-3')} />
              <TextbookExercise exercise={part('ex-19-4')} requires={['mutawazi-tartib']} onAnswered={mark('ex-19-4')} />
              <TextbookExercise exercise={part('ex-19-5')} requires={['alaqat-shal', 'mutawazi-tartib']} onAnswered={mark('ex-19-5')} />
              <BackLink lesson="majmu-shuaayn" what="علاقة شال وقاعدة متوازي الأضلاع" />
            </div>
          ) },
        { num: 2, title: 'تمرين 22 — منتصفات أضلاع رباعي', done: all('ex-22'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX22} />
              <TextbookExercise exercise={part('ex-22-1')} requires={['alaqat-shal']} onAnswered={mark('ex-22-1')} />
              <TextbookExercise exercise={part('ex-22-2')} requires={['mustaqim-muntasafayn', 'mutawazi-tartib']} onAnswered={mark('ex-22-2')} />
              {done['ex-22-2'] && (
                <>
                  <p className="text-xs text-slate-600" data-misconception-note="tartib"><MathText>{`خطأ شائع: ${REMARKS.burhanWrong} ${REMARKS.burhanWhy}`}</MathText></p>
                  {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : la chaîne de preuve est khatawat-burhan / istintajat (درس barahin-ashia), avec
                      `alaqat-shal` et `mutawazi-tartib` ; l’ordre des sommets vient d’être redit (REMARKS.burhanWhy). */}
                  <KnowledgeBrick id="burhan-shuai" variant="rappel" lead="التمرينان 19 و 22 بنفس السلسلة: ما هي؟" />
                </>
              )}
              <BackLink lesson="barahin-ashia" what="إنجاز براهين بتوظيف الأشعة" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
