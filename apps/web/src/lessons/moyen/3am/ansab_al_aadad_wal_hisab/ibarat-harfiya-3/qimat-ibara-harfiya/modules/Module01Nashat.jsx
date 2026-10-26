import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { parseNum } from '../content/exercises';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le mur de billes du نادي العلوم. UNE SEULE PISTE (§4quater) :
 * le labo `marble-run` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main lâche la bille dans le réservoir de la lettre puis ÉCRIT
 * sous le mur la ligne de la substitution (× et parenthèses) et lance. La valeur n'est jamais dite : elle sort du mur.
 *   مبتدئ — 4x + 7 en 3 puis −2, x² − 3x en −2 ;  متقدم — 5 − 2x² en −3, 6x − 1 en −1/2, 3x − 2y (deux réservoirs), valeur prédite.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES lignes : pourquoi le × (P2), pourquoi les parenthèses du négatif sous la copieuse (P2), ce que porte chaque
 * bille (P1), les deux lettres (P1). Les noms (briques) viennent APRÈS la réponse. Le نشاط 4 du manuel est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const solved = (task) => trials.find((e) => e.kind === 'solved' && e.task === task);
  const fused = trials.find((e) => e.kind === 'run' && e.task === 'r1' && e.reason === 'fused');
  const copier = trials.find((e) => e.kind === 'run' && e.task === 'r3' && e.reason === 'unbracketed');
  const twoLetters = trials.find((e) => e.kind === 'drop' && e.letter === 'y' && !e.free);

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['أعوّض الحرف بعدد في كل مكان منه', 'أُظهر علامة الضرب', 'أضع العدد السالب بين قوسين']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — مسار الكريات"
      moduleSubtitle="أُسقط كريةً وأكتب السطر"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="marble-run" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="marble-run" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا لا يكفي أن نكتب العددين متجاورين؟', subtitle: 'علامة الضرب', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="solved1" ok={!!solved('r1')}
                done={fused ? 'قرأ القارئ سطرك دون علامة الضرب عددًا واحدًا هو 43، ثم أصلحتَه فقبله المسار.' : 'كتبتَ في المهمة الأولى سطرًا قبله المسار.'}
                todo="أنهِ المهمة الأولى (4x + 7 من أجل 3) واكتب السطر الذي يتّفق مع سلّة النتيجة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في المهمة الأولى لو حُذفت علامة الضرب من سطرك لقرأ القارئ $43+7$ . لماذا؟`}</MathText>}
                options={[
                  M('لأنّ $4x$ جداء: دون علامة الضرب يُقرأ $4$ و $3$ عددًا واحدًا هو $43$'),
                  M('لأنّ القارئ يجمع قبل أن يضرب'),
                  M('لأنّ $3$ عدد فردي'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'الجداء $4\\times3=12$ يحتاج علامته، وإلّا التصق الرقمان فصارا $43$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="ithar-darb" lead="سطرك كتب 4 ثم 3 متجاورين: ماذا فعلتَ لتصلحه؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا حدث للمربّع؟', subtitle: 'القوسان تحت الناسخة', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="solved3" ok={!!solved('r3')}
                done={copier ? 'سطرك الأول دون قوسين أعطى 2 فتوقّف المسار عند الناسخة، ثم أضفتَ القوسين فقبله.' : 'سطرك في المهمة الثالثة قبله المسار.'}
                todo="أنهِ المهمة الثالثة (x² − 3x من أجل −2) بسطر يتّفق مع سلّة النتيجة، ثم عُد إلى هذا السؤال." />
              <NumericQuestion
                prompt={<MathText>{String.raw`في المهمة الثالثة: ما قيمة $x^2-3x$ من أجل $x=-2$ ؟`}</MathText>}
                expected={10} display="10" parse={parseNum}
                explain={<MathText>{'$(-2)^2-3\\times(-2)=4+6=10$ ؛ دون قوسين يُربَّع $2$ وحده فنجد $-4+6=2$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="aqwas-salib" lead="المسار توقّف عند الناسخة: كيف تكتب العدد السالب؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا حملت الكرتان؟', subtitle: 'العدد نفسه في كل مكان', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="drop3" ok={!!solved('r3')}
                done="أسقطتَ كرية واحدة في خزّان x فنزلت كرية في كل مدخل لـ x."
                todo="أنهِ المهمة الثالثة ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في المهمة الثالثة كتبتَ $x^2-3x$ ، فيه مكانان للحرف $x$ . كم كرية خرجت من خزّان $x$ وما العدد على كل واحدة؟`}</MathText>}
                options={[
                  M('كريتان تحملان العدد نفسه $-2$ : كل مكان لـ $x$ يأخذ العدد نفسه'),
                  M('كرية $-2$ وكرية $2$'),
                  M('كرية واحدة فقط'),
                ]}
                correct={0} cols={1} requires={['aqwas-salib']}
                explain={<MathText>{'الخزّان يرسل كريةً مطابقة إلى كل مدخل للحرف، فنكتب $-2$ في المكانين: $(-2)^2-3\\times(-2)$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="nafs-al-adad" lead="الحرف نفسه في مكانين: ماذا وضعتَ في كل مكان؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'وإذا كان في العبارة حرفان؟', subtitle: 'خزّانان', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="twoLetters" ok={!!twoLetters}
                done="أسقطتَ كريةً في خزّان y أيضًا."
                todo="في المستوى المتقدّم أنهِ المهمة السادسة (3x − 2y، خزّانان) ثم عُد إلى هذا السؤال." />
              <NumericQuestion
                prompt={<MathText>{String.raw`بالطريقة نفسها: ما قيمة $3x-2y$ من أجل $x=2$ و $y=-1$ ؟`}</MathText>}
                expected={8} display="8" parse={parseNum} requires={['nafs-al-adad']}
                explain={<MathText>{'$3\\times2-2\\times(-1)=6+2=8$.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="harfan" lead="خزّانان لحرفين: هل حملت الكريتان العدد نفسه؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
