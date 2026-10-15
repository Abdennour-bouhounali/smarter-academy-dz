import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_B, METHOD_EUCLID } from '../content/textbook';

/**
 * Module 3 — l'ENTRÉE de la division : le MÊME atelier de couture (thème `workshop`) ; on ne coupe plus, on REPORTE le petit
 * ruban le long du grand autant de fois qu'il tient ; le bout qui dépasse est le reste. UNE PISTE (rétrofit 2026-10-15) : le
 * labo en tête SANS carte ni titre de workspace, la question sur ce que l'élève a fait, les briques APRÈS la réponse.
 *   مبتدئ  — 45 cm et 18 cm : deux divisions, l'algorithme entier tient dans un écran, la règle d'arrêt se voit arriver.
 *   متقدم  — 765 et 135, les nombres du manuel, AVEC la comparaison aux différences : trois divisions contre huit soustractions.
 * Étape 1 : POURQUOI le reste remplace le plus petit couple (manuel, question 2) ; étape 2 : l'exemple résolu du manuel
 * (836 et 1938) ; étape 3 : 3356 et 1528, la brique du choix de méthode APRÈS la comparaison. LP : P3, P4, P5.
 */
export default function Module03KhwarizmiyatIqlidus() {
  const [e1, setE1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [e2, setE2] = useState(false);
  const { a, b, second } = ACTIVITY_B.numbers;
  return (
    <ContentModule objectives={["كم نسخة من الشريط الأصغر تلزم، وماذا يتبقّى؟", "متى نتوقّف عن إعادة القسمة؟", "أين نجد PGCD في آخر الخطوات؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(3)} moduleNumber={3} moduleTitle="نشاط 6 ب — خوارزمية إقليدس" moduleSubtitle={ACTIVITY_B.subtitle} estimatedTime="15 دقيقة"
      intro={(
        // Le niveau par défaut est le PETIT couple : premier contact court ; 765 et 135 (manuel) sont à un clic.
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation type="euclidean-algorithm" a={45} b={18}
                title="شريطان في ورشة الخياطة: 45 سم و 18 سم"
                onFinished={() => setE1(true)} />
            ),
            advanced: () => (
              <Manipulation type="euclidean-algorithm" a={a} b={b} compareWith="differences"
                title="شريطان في ورشة الخياطة: 765 سم و 135 سم"
                onFinished={() => setE1(true)} />
            ),
          }}
        />
      )}
      steps={[
        { num: 1, title: 'لماذا نكمل بالباقي بدل الشريط الأكبر؟', subtitle: 'السؤال 2) من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li data-evidence="divisions" data-tried={e1 ? 'true' : 'false'} className={e1 ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {e1 ? 'أنهيتَ القسمات حتى صار الباقي معدومًا.' : 'لم تنهِ القسمات بعد: عُد إلى المناولة أعلاه وضع النسخ، ثم انقل ما يبقى إلى السطر التالي.'}
                </li>
              </ul>
              <TapQuestion prompt={<span>في كل سطر تنقل الباقي وتترك الشريط الأكبر. باقي القسمة الإقليدية للعدد 765 على 135 هو 90. لماذا <MathText>{'$\\mathrm{PGCD}(765\\ ;\\ 135) = \\mathrm{PGCD}(135\\ ;\\ 90)$'}</MathText>؟</span>}
                options={['لأن كل قاسم مشترك لـ 765 و 135 يقسم الباقي 90 (خاصية 2)، والعكس', 'لأن 90 < 135', 'لأن 765 = 135 × 5', 'لأن 90 قاسم للعدد 135']} correct={0} cols={1}
                explain={<span><MathText>{'$765 = 135 \\times 5 + 90$'}</MathText>؛ قاسم مشترك لـ 765 و 135 يقسم 90 = 765 − 135 × 5، وقاسم مشترك لـ 135 و 90 يقسم 765.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <KnowledgeBrick id="khwarizmiyat-iqlidus" />}
            </div>
          ) },
        { num: 2, title: 'طريقة الكتاب: 836 و 1938', done: read,
          content: <MethodSteps method={METHOD_EUCLID} onAllRevealed={() => setRead(true)} /> },
        { num: 3, title: '5) عيّن بطريقة مماثلة PGCD(3356 ; 1528)', done: e2,
          content: (
            <div className="space-y-3">
              <Manipulation type="euclidean-algorithm" a={second.a} b={second.b} compareWith="differences" title="3356 و 1528" onFinished={() => setE2(true)} />
              {e2 && <KnowledgeBrick id="ikhtiyar-al-tariqa" compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />} />
  );
}
