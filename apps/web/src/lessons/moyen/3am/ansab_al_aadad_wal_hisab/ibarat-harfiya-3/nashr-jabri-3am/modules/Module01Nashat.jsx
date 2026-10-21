import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le jardin de l'école vu d'en haut. UNE SEULE
 * PISTE (§4quater) : le labo `area-split` (monde `plot`) en haut, sans carte au-dessus — il porte son contexte et SA question ; la main fait
 * glisser la COUPURE d'un côté du terrain puis décide ce que chaque parcelle compte (une aire qui s'ajoute, une allée qui s'ôte, le coin
 * que deux allées ôtent deux fois et qui se rend).
 *   مبتدئ — 3(x + 4) puis 2(x − 3) ;  متقدم — (x + 3)(x + 2) puis (x − 2)(x − 3).
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES parcelles : pourquoi les deux compteurs d'aire restent égaux (P3), pourquoi l'allée
 * se soustrait (P1), pourquoi le coin se rend (P2). Les noms (briques) viennent APRÈS la réponse. Le نشاط 3 du manuel est posé en
 * application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const decided = trials.find((e) => e.kind === 'patch' && e.ok);
  const taken = trials.find((e) => e.kind === 'patch' && e.ok && e.sign < 0 && !e.corner);
  const corner = trials.find((e) => e.kind === 'patch' && e.ok && e.corner);

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا يتساوى العدّادان؟', 'لماذا يُطرح الممرّ؟', 'لماذا يُردّ ركن الممرّين؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — أرض الحديقة"
      moduleSubtitle="قطع وممرّات"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="area-split" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="area-split" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا تساوى العدّادان؟', subtitle: 'مساحة بطريقتين', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="decided" ok={!!decided}
                done="قطعتَ الأرض وقرّرتَ ما تحسبه قطعة فتساوى عدّادا المساحة."
                todo="اقطع الأرض ثم قرّر ما تحسبه كل قطعة، وغيّر قيمة x بالزرّين (+ و −) وانظر إلى العدّادين، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`غيّرتَ $x$ والعدّادان بقيا متساويين. ماذا يعني ذلك؟`}</MathText>}
                options={[
                  M('أنّ مساحة الأرض نفسها سواء حسبناها بجداء البعدين أو بمجموع مساحات الأجزاء'),
                  M('أنّ الأجزاء لم تتغيّر حين غيّرتُ $x$'),
                  M('أنّ العدّادين يتساويان عند قيمة واحدة لـ $x$'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'المساحة هي نفسها مهما كانت طريقة الإحصاء ومهما كانت قيمة $x$: $3(x+4)=3x+12$ من أجل كل $x$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="masaha-tariqatayn" lead="مرّةً بجداء البعدين ومرّةً بمجموع الأجزاء: ماذا لاحظتَ؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا قرّرتَ أن يُطرح الممرّ؟', subtitle: 'ما بقي بعد الممرّ', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="taken" ok={!!taken}
                done={<span>قرّرتَ أن تُطرح مساحة قطعة (الممرّ المبلّط) فقبلت اللوحة ذلك وتساوى العدّادان.</span>}
                todo="في المستوى المبتدئ أنهِ الأرض الثانية (فيها ممرّ مبلّط) وقرّر أن تُطرح مساحة الممرّ، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`اقتُطع من الأرض ممرّ مبلّط وبقي مستطيل أقصر. كيف حسبتَ مساحة ما بقي؟`}</MathText>}
                options={[
                  M('مساحة الأرض كلها ناقص مساحة الممرّ، وإلّا لما تساوى العدّادان'),
                  M('مساحة الأرض كلها زائد مساحة الممرّ'),
                  M('مساحة الممرّ وحدها'),
                ]}
                correct={0} cols={1} requires={['masaha-tariqatayn']}
                explain={<MathText>{'ما بقي هو الأرض كلها بعد إخراج الممرّ: $2(x-3)=2x-6$ ، فالطرح ظهر في العبارة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="hadd-matruh" lead="الممرّ المبلّط: ماذا فعلتَ بمساحته؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'لماذا عاد الركن؟', subtitle: 'ممرّان متقاطعان', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="corner" ok={!!corner}
                done={<span>قرّرتَ أن تُضاف قطعة الركن (جداء <Ltr>(−2) × (−3)</Ltr> موجب) فقبلت اللوحة ذلك.</span>}
                todo="في المستوى المتقدّم أنهِ الأرض الثانية (فيها ممرّان متقاطعان) وقرّر إشارة قطعة الركن، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الأرض ذات الممرّين المتقاطعين قبلت اللوحة قطعة الركن بإشارة $+$ . لماذا؟`}</MathText>}
                options={[
                  M('لأنّ الركن طُرح مرّتين، مرّةً مع كل ممرّ، فنردّه مرّة واحدة'),
                  M('لأنّ الركن أكبر القطع'),
                  M('لأنّ $-2$ و $-3$ يجمعان معًا فيعطيان عددًا موجبًا'),
                ]}
                correct={0} cols={1} requires={['hadd-matruh']}
                explain={<MathText>{'الممرّان يشتركان في الركن $2\\times3=6$ م² ، فطُرح في كل منهما: $x^2-2x-3x+6$ ، وهذا هو جداء العددين السالبين $(-2)(-3)=+6$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="rukn-yuad" lead="الركن الذي طُرح مرّتين: كيف عاد إلى المساحة؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
