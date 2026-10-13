import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, LAB, MISTAKES } from '../content/textbook';
import LabEvidence from '../components/LabEvidence';
import ZelligeVignette from '../components/ZelligeVignette';

/**
 * Module 1 — l'ENTRÉE de la leçon (pas d'activité du manuel, DÉCLARÉ) : le laboratoire `shape-turn`, la feuille calque
 * d'un artisan du zellige de Tlemcen.
 *
 * LE WORKSPACE (un objectif, props = content/textbook.js › LAB = levels.js) :
 *   مبتدئ  (défaut) la rosace : un pétale ABC, la feuille tournée de 60° en 60° dans le sens direct, cinq copies
 *          imprimées de proche en proche ; le faux mors ↔ étire la feuille (refusé : « ليس دورانا: تغيّر الطول ») ;
 *   متقدم  la طريقة p. 155 : [AC] tourné sur [BD], AC = BD et (AC) ⊥ (BD) prouvés par cartes ; puis l'exercice 18.
 * Le module n'ouvre PAS sur la طريقة (sa place est le module 3, où le même workspace s'ouvre sur متقدم). Aucune étape
 * n'attend le laboratoire (`onFinished`) : les questions portent sur des gestes que l'élève a faits, listés au-dessus
 * d'elles ([data-activity-evidence]).
 *   1. ce qui reste, ce qui change (le tableau de bord)     → brique thabat-dawaran (P1)
 *   2. la feuille étirée n'est pas un دوران                (P1)
 *   3. 90° : la droite et son image sont perpendiculaires   (P1, préparé pour معارف)
 * Les deux niveaux vivent dans l'`intro` : le rappel de la « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire) clôt la DERNIÈRE étape.
 * « أتوقّع القاعدة » : le feedback du tableau de bord ne dit PAS la règle (la brique thabat-dawaran la fait écrire), et
 * l'explain de l'étape 3 rapporte la lecture (90° ⇒ متعامدان) sans énoncer la règle zawiya-sura (prédite au module 2).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Waraqa() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const mark = (n) => () => setQ((s) => ({ ...s, [n]: true }));
  const keep = (e) => { if (e) setTrials((list) => [...list, e].slice(-40)); };

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="الورقة الشفافة — وردة زليج تلمسان"
      moduleSubtitle="ورقة تدور حول دبوس: ماذا يتغيّر في البتلة، وماذا لا يتغيّر؟"
      estimatedTime="12 دقيقة"
      objectives={["ماذا يتغيّر في البتلة حين تدور الورقة، وماذا يبقى؟", "هل تبقى الورقة الممطّطة صورة بدوران؟", "كيف يقف مستقيم من صورته حين أدير الورقة 90 درجة؟"]}
      brief={{
        tag: 'مدخل الدرس — مختبر من المنصّة',
        headline: 'وردة زليج في دقائق!',
        emoji: '🌸',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <ZelligeVignette />,
        body: (
          <div className="space-y-2" data-situation="zellige">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation}</p>
            <p className="text-sm text-slate-600">المستوى «مبتدئ»: وردة من ست بتلات. المستوى «متقدم»: طريقة الكتاب (ص 155) ثم مركز دوران مجهول (تمرين 18).</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الورقة الشفافة"
          lead="في المستويين: الورقة مثبّتة بدبوس في O، تدور ولا تنزلق؛ اللوحة تقرأ ما يبقى وما يتغيّر."
          levels={{
            beginner: () => (
              <Manipulation type="shape-turn" level="beginner" numbers={LAB.beginner.numbers} theme="zellige"
                title="وردة الزليج: ورقة شفافة تدور حول دبوس" onTrial={keep} />
            ),
            advanced: () => (
              <Manipulation type="shape-turn" level="advanced" numbers={LAB.advanced.numbers} theme="zellige"
                title="طريقة الكتاب (ص 155): [AC] و [BD]" onTrial={keep} />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ما الذي بقي على حاله؟', subtitle: 'اللوحة: الطول، الزاوية، المساحة، الاستقامية', done: !!q[1],
          content: (
            <div className="space-y-3">
              <LabEvidence id="turns" trials={trials} filter={(e) => e.mode === 'rosette' && (e.kind === 'stamp' || e.kind === 'turn')}
                title="ما فعلته بالورقة:" empty="في المستوى «مبتدئ»: أدر الورقة واطبع نسخة أو اثنتين، وراقب اللوحة." />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في كل نسخة طبعتها، قارن بالبتلة ABC:</p>}
                rows={[
                  { id: 'tul', label: <MathText>{"طول النسخة $A'B'$"}</MathText>, options: ['يساوي AB في كل نسخة', 'يكبر كلما دارت الورقة أكثر'], correct: 0, correction: 'اللوحة تقرأ $A\'B\' = 3 = AB$ في كل موضع.' },
                  { id: 'zawiya', label: <MathText>{"قيس الزاوية $\\widehat{A'B'C'}$"}</MathText>, options: ['يساوي قيس $\\widehat{ABC}$', 'يزيد بزاوية الدوران'].map(M), correct: 0, correction: 'الزاوية في B بقيت $45^\\circ$ في كل نسخة.' },
                  { id: 'masaha', label: 'مساحة النسخة', options: ['تساوي مساحة البتلة', 'تتغيّر مع موضع النسخة'], correct: 0, correction: 'المساحة 3 في كل نسخة.' },
                  { id: 'istiqama', label: 'النقط A′ و I′ و B′', options: ['على استقامية واحدة', 'لم تعد على استقامية'], correct: 0, correction: 'I منتصف [AB] يبقى على [A′B′] في كل نسخة.' },
                  // MISC-DAWARAN-TAWAZI
                  { id: 'manha', label: 'منحى المستقيم (A′B′)', options: ['يتغيّر: يصنع مع (AB) زاوية', 'لا يتغيّر: يوازي (AB) دائما'], correct: 0, correction: 'اللوحة تقرأ الزاوية بين (AB) و (A′B′): $60^\\circ$ للنسخة الأولى.' },
                ]}
                requires={['surat-qita-dawaran']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: قارنت كل سطر من اللوحة بالبتلة الأصلية.' : 'راجع التصحيح تحت كل سطر، ثم أدر الورقة من جديد وانظر إلى اللوحة.'}</Feedback>}
                onAnswered={mark(1)}
              />
              {q[1] && <KnowledgeBrick id="thabat-dawaran" lead="ما رأيته على اللوحة:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'الورقة الممطّطة', subtitle: 'هل هي دوران؟', done: !!q[2],
          content: (
            <div className="space-y-3">
              <LabEvidence id="stretch" trials={trials} filter={(e) => e.kind === 'stretch' || (e.kind === 'refuse' && e.reason === 'stretch')}
                title="ما حدث حين مطّطت الورقة:" empty="اسحب المقبض ↔ على حافة الورقة، ثم حاول أن تطبع." />
              <TapQuestion
                prompt={<MathText>{"لما مطّطت الورقة بقيت مثبّتة في O، لكن تغيّر طول $A'B'$ . هل النسخة الممطّطة صورة البتلة بدوران؟"}</MathText>}
                options={[
                  'لا: الدوران يحافظ على الأطوال، والطول تغيّر',
                  `نعم: ${MISTAKES.tamtit.wrong}`, // MISC-DAWARAN-KHAWAS
                  'نعم: لأن A′ و I′ و B′ بقيت على استقامية', // la استقامية ne suffit pas
                ].map(M)}
                correct={0}
                cols={1}
                requires={['thabat-dawaran']}
                explain={<MathText>{`${MISTAKES.tamtit.why} والاستقامية وحدها لا تكفي: التمطيط يحافظ عليها أيضا.`}</MathText>}
                onAnswered={mark(2)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'المستقيم وصورته', subtitle: 'أدر الورقة 90°', done: !!q[3],
          content: (
            <div className="space-y-3">
              <LabEvidence id="quarter" trials={trials} filter={(e) => e.kind === 'turn'}
                title="الزوايا التي قرأتها:" empty="أدر الورقة إلى 90° ثم إلى 180°، واقرأ «الزاوية بين المستقيمين» في اللوحة." />
              <TapQuestion
                prompt={<MathText>{"أدر الورقة $90^\\circ$ في الاتجاه المباشر واقرأ اللوحة: ما وضع المستقيم (A′B′) بالنسبة إلى (AB)؟"}</MathText>}
                options={['متعامدان', 'متوازيان', 'منطبقان']}
                correct={0}
                cols={3}
                requires={['thabat-dawaran']}
                explain={<MathText>{'اللوحة تقرأ $90^\\circ$ بين $(AB)$ و $(A\'B\')$ : المستقيمان متعامدان. أدر الورقة الآن إلى $180^\\circ$ واقرأ اللوحة من جديد.'}</MathText>}
                onAnswered={mark(3)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
