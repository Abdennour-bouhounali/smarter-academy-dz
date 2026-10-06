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
import { EX31, EX32 } from '../content/figures';
import { BASE } from '../../_unit/unitMeta';

/**
 * Module 3 — أتعمّق (p. 125) : l'exercice 31 (le pavé : Pythagore deux fois — la diagonale du sol AC, puis la diagonale
 * du pavé AD dans le triangle ACD rectangle en C —, le sinus EXACT de DAC, puis l'arrondi au degré en fin de calcul)
 * et l'exercice 32 (Khéops : le triangle SOA rectangle en O, OA = demi-diagonale ; h ≈ 147 m), prolongé d'une question
 * de la plateforme (l'angle d'une arête avec la base, cos = OA ÷ SA ≈ 42°). La brique `muthallath-fada` est posée
 * avant l'exercice 31 : elle DIT la méthode (chercher le triangle rectangle dans le solide), jamais la réponse ; la
 * figure de chaque exercice est redessinée (GeoFigure). LP : P1, P2, P3.
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
      moduleSubtitle="مثلثات قائمة داخل المجسّمات: متوازي مستطيلات وهرم خوفو"
      estimatedTime="11 دقيقة"
      brief={{ tag: 'أتعمّق — الكتاب ص 125', title: 'أين المثلث القائم داخل المجسّم؟ ثم أحسب وأدوّر في الأخير', tone: 'rose',
        body: <p>في كل تمرين: أبحث عن مثلث قائم يضمّ الطول أو الزاوية المطلوبة، أحسب الأطوال بخاصية فيثاغورس وأحتفظ بالقيم المضبوطة، ثم أكتب النسبة المثلثية وأدوّر النتيجة النهائية فقط.</p> }}
      steps={[
        { num: 1, title: 'تمرين 31 — قطر متوازي المستطيلات', done: all('ex-31'),
          content: (
            <div className="space-y-3">
              {/* Rappel (2026-10-06, « أتوقّع القاعدة ») : Pythagore dans un solide est un prérequis (`fithaghuris-fada`, répété dans « أستعدّ », prep-5) et
                  garder les valeurs exactes jusqu’au bout est `mulaamat-natija` (module 1). */}
              <KnowledgeBrick id="muthallath-fada" variant="rappel" lead="الطول AD ليس على وجه واحد: في أيّ مثلث قائم يظهر؟" />
              <GeoFigure {...EX31} />
              <TextbookExercise exercise={part('ex-31-1')} requires={['fithaghuris-fada']} onAnswered={mark('ex-31-1')} />
              <TextbookExercise exercise={part('ex-31-2')} requires={['tadwir']} onAnswered={mark('ex-31-2')} />
              <TextbookExercise exercise={part('ex-31-3')} requires={['muthallath-fada']} onAnswered={mark('ex-31-3')} />
              <TextbookExercise exercise={part('ex-31-4')} requires={['tadwir']} onAnswered={mark('ex-31-4')} />
              <TextbookExercise exercise={part('ex-31-5')} requires={['muthallath-fada', 'nisab-tarif']} onAnswered={mark('ex-31-5')} />
              <TextbookExercise exercise={part('ex-31-6')} requires={['hasiba-aks', 'mulaamat-natija']} onAnswered={mark('ex-31-6')} />
              {done['ex-31-6'] && <p className="text-xs text-slate-600" data-misconception-note="fada"><MathText>{`خطأ شائع: ${REMARKS.fadaWrong} ${REMARKS.fadaWhy}`}</MathText></p>}
              <BackLink lesson="hasiba-muthallathiya" what="تعيين قيس زاوية بالحاسبة وتدويره" />
            </div>
          ) },
        { num: 2, title: 'تمرين 32 — هرم خوفو', done: all('ex-32'),
          content: (
            <div className="space-y-3">
              <GeoFigure {...EX32} />
              <TextbookExercise exercise={part('ex-32-1')} requires={['muthallath-fada']} onAnswered={mark('ex-32-1')} />
              <TextbookExercise exercise={part('ex-32-2')} requires={['muthallath-fada', 'tadwir']} onAnswered={mark('ex-32-2')} />
              {done['ex-32-2'] && <p className="text-xs text-slate-600" data-misconception-note="haram"><MathText>{`خطأ شائع: ${REMARKS.haramWrong} ${REMARKS.haramWhy}`}</MathText></p>}
              <TextbookExercise exercise={part('ex-32-3')} requires={['muthallath-fada', 'hasiba-aks']} onAnswered={mark('ex-32-3')} />
              <BackLink lesson="tarrid-muthallathiya" what="حل مثلث قائم بفيثاغورس والنسب المثلثية" />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
