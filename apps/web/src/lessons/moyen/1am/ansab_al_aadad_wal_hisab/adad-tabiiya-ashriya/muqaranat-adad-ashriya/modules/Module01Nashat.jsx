import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : la piste de saut en longueur. UNE SEULE
 * PISTE (§4quater) : le labo `ruler-compare` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient la
 * GRADUATION de la règle.
 *   مبتدئ — quatre comparaisons de sauts : 4,6 / 4,35 (le piège « 35 > 6 »), 8,05 / 8,5, 12,70 / 12,7, 9,87 / 10,2 ;
 *   متقدم — ranger deux suites sur le podium.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES nombres : pourquoi « 35 > 6 » ne tient pas (P1/P2), ce qui a décidé entre 8,05
 * et 8,5 (P1), 12,70 et 12,7 (P2), quelle règle a suffi pour 9,87 et 10,2 (P1), le premier de la suite (P3). Les noms (briques) viennent
 * APRÈS la réponse. Le نشاط 5 du manuel est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;
const GRAD = ['المتر', 'الديسيمتر', 'السنتيمتر', 'الميليمتر'];

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  // La demande libre (« جرّب أعدادك ») n'est jamais une preuve.
  const record = (e) => { if (!e.free) setTrials((list) => [...list, e]); };
  const verdictFor = (a, b) => trials.find((e) => e.event === 'verdict' && e.ok && ((e.a === a && e.b === b) || (e.a === b && e.b === a)));
  const orderDone = trials.some((e) => e.kind === 'order' && e.ok && e.event === 'check');
  const where = (v) => (v && Number.isInteger(v.g) ? <span>على مسطرة {GRAD[v.g]}</span> : null);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  const v1 = verdictFor('4,6', '4,35');
  const v2 = verdictFor('8,05', '8,5');
  const v3 = verdictFor('12,70', '12,7');
  const v4 = verdictFor('9,87', '10,2');

  return (
    <ContentModule
      objectives={['لماذا لا يكون 4,35 أبعد من 4,6؟', 'كيف نقارن 8,05 و 8,5؟', 'متى يكفي الجزء الصحيح للحكم؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — القفز الطويل"
      moduleSubtitle="قفزتان تفصل بينهما المسطرة"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="ruler-compare" level="beginner" world="jump" tasks={LAB.beginner} onTrial={record} />,
            advanced: () => <Manipulation type="ruler-compare" level="advanced" world="jump" tasks={LAB.advanced} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا لم يكن 4,35 أبعد؟', subtitle: 'قفزتان: 4,6 م و 4,35 م', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="first-jump" ok={!!v1}
                done={<span>حكمتَ بين <Ltr>4,6</Ltr> و <Ltr>4,35</Ltr> {where(v1)}.</span>}
                todo="احكم بين القفزتين الأوليين في المستوى المبتدئ (4,6 و 4,35) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>قبل أن تضبط المسطرة، قد يظنّ المرء أنّ <Ltr>4,35</Ltr> هو الأبعد لأنّ 35 أكبر من 6. لماذا يخطئ هذا الظنّ؟</span>}
                options={[M('لأنّ أعشار 4,6 ستة وأعشار 4,35 ثلاثة فقط، وما بعدها لا يعوّض الفرق'), M('لأنّ العدد الأقصر كتابةً هو الأكبر دائمًا'), M('لأنّ الفاصلة تُهمل عند المقارنة')]}
                correct={0} cols={1} requires={['maratib-ibtidai']}
                explain={<MathText>{'$4{,}6$ هو 4 أمتار و6 ديسيمترات، و $4{,}35$ هو 4 أمتار و3 ديسيمترات و5 سنتيمترات فقط: الأعشار تعدّ قطعًا أكبر من الأجزاء من مائة.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="taqarun-rutab" lead="في 4,6 و 4,35: بأيّ رتبة بدأتَ المقارنة، وما الذي حسم؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ما الذي حسم بين 8,05 و 8,5؟', subtitle: 'رقم أكثر ومع ذلك أصغر', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="second-jump" ok={!!v2}
                done={<span>حكمتَ بين <Ltr>8,05</Ltr> و <Ltr>8,5</Ltr> {where(v2)}.</span>}
                todo="احكم بين القفزتين الثانيتين في المستوى المبتدئ (8,05 و 8,5) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span><Ltr>8,05</Ltr> فيه رقمان بعد الفاصلة و <Ltr>8,5</Ltr> فيه رقم واحد، ومع ذلك فالأول هو الأقصر. ما الذي حسم؟</span>}
                options={[M('رقم الأعشار: 0 في الأول و 5 في الثاني'), M('عدد الأرقام بعد الفاصلة: الأطول أصغر'), M('الجزء الصحيح، فهو مختلف')]}
                correct={0} cols={1} requires={['taqarun-rutab']}
                explain={<MathText>{'الجزآن الصحيحان متساويان (8)، فنقارن الأعشار: $0<5$ ، إذن $8{,}05<8{,}5$ . عدد الأرقام لا يحسم شيئًا.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'هل فصلت المسطرة بين 12,70 و 12,7؟', subtitle: 'كتابتان لقفزة واحدة', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="third-jump" ok={!!v3}
                done={<span>حكمتَ بين <Ltr>12,70</Ltr> و <Ltr>12,7</Ltr> {where(v3)}.</span>}
                todo="احكم بين القفزتين الثالثتين في المستوى المبتدئ (12,70 و 12,7) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>هل استطاعت أيّ مسطرة، مهما دقّ تدريجها، أن تفصل بين <Ltr>12,70</Ltr> و <Ltr>12,7</Ltr> ؟</span>}
                options={[M('لا: قُرئتا على كل تدريج بالعدد نفسه، فهما متساويتان'), M('نعم: على الميليمتر'), M('نعم: على السنتيمتر')]}
                correct={0} cols={1} requires={['taqarun-rutab']}
                explain={<MathText>{'$12{,}70$ هو $12{,}7$ مكتوبًا بصفر زائد في آخره: القطع نفسها، لذلك لم يظهر أيّ فرق على أيّ تدريج.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="itmam-asfar" lead="12,70 و 12,7 يُقرآن بالعدد نفسه: كيف نستعمل ذلك لنقارن 4,6 و 4,35؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'أيّ مسطرة تكفي بين 9,87 و 10,2؟', subtitle: 'الجزء الصحيح', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="fourth-jump" ok={!!v4}
                done={<span>حكمتَ بين <Ltr>9,87</Ltr> و <Ltr>10,2</Ltr> {where(v4)}.</span>}
                todo="احكم بين القفزتين الرابعتين في المستوى المبتدئ (9,87 و 10,2) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>أيّ تدريج كفى للحكم بين <Ltr>9,87</Ltr> و <Ltr>10,2</Ltr> حتى وهو الأخشن؟</span>}
                options={[M('المتر وحده: جزآهما الصحيحان 9 و 10 مختلفان'), M('الديسيمتر: لا بدّ من رقم الأعشار'), M('السنتيمتر: لا بدّ من رقم الأجزاء من مائة')]}
                correct={0} cols={1} requires={['taqarun-rutab']}
                explain={<MathText>{'$9<10$ ، فالقفزة الأولى أقل من 10 أمتار ومهما كان ما بعد الفاصلة فهو أقل من متر واحد: $9{,}87<10{,}2$ .'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'من يتصدّر المنصّة؟', subtitle: 'ترتيب خمس قفزات', done: q5,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="podium" ok={orderDone}
                done={<span>رتّبتَ قفزات المنصّة ترتيبًا صحيحًا.</span>}
                todo="جرّب المستوى المتقدّم: ضع القفزات الخمس على المنصّة ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في السلسلة <Ltr>7,4</Ltr> ؛ <Ltr>7,04</Ltr> ؛ <Ltr>7,45</Ltr> ؛ <Ltr>6,98</Ltr> ؛ <Ltr>7,405</Ltr> : أيّ قفزة تأتي أولًا في الترتيب من الأقصر إلى الأبعد؟</span>}
                options={[M('6,98 لأنّ جزأها الصحيح أصغر'), M('7,04 لأنّ رقم أعشارها 0'), M('7,4 لأنّها أقصر كتابةً')]}
                correct={0} cols={1} requires={['itmam-asfar']}
                explain={<MathText>{'$6<7$ ، فالقفزة $6{,}98$ أقصر من كل قفزة جزؤها الصحيح 7؛ وبين الأربع الباقية نفصل بالأعشار ثم بالأجزاء من مائة.'}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && <KnowledgeBrick id="tartib-silsila" lead="خمس قفزات على المنصّة: كيف تقرّر أيّ قفزتين تتجاوران؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
