import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import RayFigure from '../components/RayFigure';
import GraphChoice from '../components/GraphChoice';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_B } from '../content/textbook';

/**
 * Module 2 — نشاط 3, seconde partie (p. 45) : « حل متراجحة » et le tableau.
 *
 * ATELIER À DEUX NIVEAUX, UN INSTRUMENT (solution-ray) — même objectif : les solutions
 * forment un rayon borné par un nombre, dessiné en rouge avec le crochet du manuel.
 *   مبتدئ : x < 3 (première ligne du tableau) — la borne se lit ; l'élève essaie, pose le
 *           crochet et découvre quand il est tourné vers le rouge (3 n'est pas solution).
 *   متقدم (ouvert par défaut — c'est l'inéquation du نشاط) : −3x + 5 ≤ 20 — la borne se
 *           TROUVE par les essais ; puis l'élève transforme l'inéquation carte par carte et
 *           choisit le sens de chaque ligne ; ÷(−3) en gardant ≤ est refusé par ses propres
 *           points rouges. Découverte : le sens change avec un négatif, et seulement alors.
 *
 * AUCUNE étape n'attend `onFinished` : `onTrial` liste les essais, le crochet et la chaîne
 * de l'élève au-dessus des questions (`[data-activity-evidence]`).
 *
 * Étapes : (1) WHY le sens change après ÷(−3) (depuis les points rouges de l'élève) ; (2) س 2 : la dernière ligne du tableau,
 * en mots et en dessin, puis la brique tamthil-jadwal ; (3) le contraste du tableau
 * (x < 3 et x ≥ 2) depuis le niveau مبتدئ. LP : P2, P3.
 */
const ADV = ACTIVITY_B.ineq;
const BEG = 'x<3';

export default function Module02HalMutarajiha() {
  const [log, setLog] = useState({ [BEG]: { traces: [], bracket: null, chain: [] }, [ADV]: { traces: [], bracket: null, chain: [] } });
  // les questions posées PAR-DESSUS le labo (LabCheckpoint) : une étape est faite quand la suite de questions du niveau terminée l'est
  const [cps, setCps] = useState([]);
  const onCheckpoint = (src) => (e) => setCps((l) => [...l, { ...e, src }]);
  const answeredAdv = cps.some((e) => e.tk === 'checkpoint-done' && e.src === ADV);
  const answeredBeg = cps.some((e) => e.tk === 'checkpoint-done' && e.src === BEG);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);

  const onTrial = (src) => (e) => setLog((l) => {
    const cur = l[src];
    if (e.kind === 'trace') return { ...l, [src]: { ...cur, traces: [...cur.traces.filter((u) => u.k !== e.k), e].sort((a, b) => a.k - b.k) } };
    if (e.kind === 'bracket') return { ...l, [src]: { ...cur, bracket: e } };
    if (e.kind === 'step') return { ...l, [src]: { ...cur, chain: [...cur.chain, e] } };
    return l;
  });

  const Evidence = ({ src, label }) => {
    const e = log[src];
    const empty = e.traces.length === 0;
    return (
      <li data-evidence={src} data-tried={empty ? 'false' : 'true'} className="space-y-1">
        <MathText>{label}</MathText>{' '}
        {empty ? <span className="text-slate-500">لم تجرّب بعد.</span> : (
          <span className="inline-flex flex-wrap gap-1" dir="ltr">
            {e.traces.map((t) => (
              <span key={t.k} className={`rounded px-1.5 font-mono text-xs font-bold ${t.ok ? 'bg-red-100 text-red-900' : 'bg-slate-200 text-slate-700'}`}>{t.x} {t.ok ? '●' : '○'}</span>
            ))}
          </span>
        )}
        {e.bracket && <span className="block text-xs text-red-900"><MathText>{`الرمز عند $${e.bracket.x}$ : الجزء الملوّن على ${e.bracket.side === 'left' ? 'اليسار' : 'اليمين'}، والرمز ${e.bracket.toward ? 'موجّه نحوه' : 'غير موجّه نحوه'}.`}</MathText></span>}
        {e.chain.length > 0 && (
          <span className="block text-xs text-indigo-900" dir="ltr">
            <MathText>{`$-3x + 5 \\leq 20 ${e.chain.map((s) => `\\xrightarrow{${s.opTex}} ${s.ineq}`).join(' ')}$`}</MathText>
          </span>
        )}
      </li>
    );
  };
  const evidence = (srcs) => (
    <ul className="space-y-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {srcs.map((s) => <Evidence key={s} src={s} label={s === ADV ? 'المتراجحة $-3x + 5 \\leq 20$ (المستوى المتقدّم):' : 'المتراجحة $x < 3$ (المستوى المبتدئ):'} />)}
    </ul>
  );

  return (
    <ContentModule
      objectives={["أين تبدأ حلول المتراجحة وأين تنتهي؟", "متى يتغيّر اتجاه المتراجحة؟ ومتى يبقى؟", "متى يكون الحدّ نفسه حلًّا؟ وكيف نبيّن ذلك على المستقيم؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="نشاط 3 — حل متراجحة وتمثيل حلولها"
      moduleSubtitle="من المتراجحة إلى نصف مستقيم ملوّن"
      estimatedTime="11 دقيقة"
      intro={(
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="solution-ray"
                level="beginner"
                ineq={BEG}
                lead="السطر الأول من جدول الكتاب: جرّب قيمًا، منها 3 نفسه، ثم ضع الرمز ووجّهه."
                onTrial={onTrial(BEG)}
                onCheckpoint={onCheckpoint(BEG)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="solution-ray"
                level="advanced"
                ineq={ADV}
                lead="متراجحة الكتاب: ابحث بتجاربك عن الحدّ، ثبّت التمثيل، ثم حوّل المتراجحة خطوة خطوة."
                onTrial={onTrial(ADV)}
                onCheckpoint={onCheckpoint(ADV)}
              />
            ),
          }}
        />
      )}
      steps={[
        {
          num: 1, title: 'لماذا رفضت نقاطك الحمراء الاتجاه بعد القسمة على −3؟', subtitle: 'حوّل المتراجحة في المستوى المتقدّم، ثم أجب', done: answeredAdv,
          content: (
            <div className="space-y-3">
              {evidence([ADV])}
              <p data-evidence="checkpoint" data-tried={answeredAdv ? 'true' : 'false'}
                className={`rounded-xl border-2 px-3 py-2 text-sm ${answeredAdv ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
                {answeredAdv
                  ? 'أجبتَ في المختبر: نقاطك الحمراء تبقى حلولًا بعد كل خطوة، ولذلك انعكس الاتجاه عند القسمة على عدد سالب وبقي كما هو في الباقي.'
                  : 'حوّل المتراجحة في المستوى المتقدّم حتى يبقى x وحده، ثم أجب عن الأسئلة التي تظهر فوق المختبر.'}
              </p>
            </div>
          ),
        },
        {
          num: 2, title: 'أتمم السطر الأخير من الجدول', subtitle: 'السؤال 2', done: q2a && q2b,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_B.questions[1]}</MathText></p>
              <div className="grid gap-2 grid-cols-2" data-textbook-table>
                {ACTIVITY_B.table.map((row) => (
                  <div key={row.inequality} className="space-y-1 rounded-xl border-2 border-slate-200 bg-white p-2">
                    <p className="text-sm font-bold"><MathText>{row.inequality}</MathText></p>
                    <p className="text-sm"><MathText>{row.words}</MathText></p>
                    <RayFigure {...row.figure} label={row.graph.replace(/\$/g, '')} />
                  </div>
                ))}
              </div>
              {evidence([ADV])}
              <TapQuestion
                prompt={<MathText>{`${ACTIVITY_B.lastRow} : حلول المتراجحة معبَّر عنها بجملة لغوية`}</MathText>}
                options={[
                  <MathText key="a">{'كل قيم $x$ الأصغر من أو تساوي $-5$'}</MathText>,
                  <MathText key="b">{ACTIVITY_B.words}</MathText>,
                  <MathText key="c">{'كل قيم $x$ الأكبر من $-5$'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['hal-mutarajiha']}
                explain={<MathText>{'حلولها هي حلول $x \\geq -5$ ، والعدد $-5$ منها: $-3 \\times (-5) + 5 = 20$ و $20 \\leq 20$ صحيحة.'}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <GraphChoice
                  prompt={<MathText>{`${ACTIVITY_B.lastRow} : التمثيل البياني لحلولها`}</MathText>}
                  graph={{
                    options: [
                      { from: -9, to: 1, at: -5, side: 'right', closed: true },
                      { from: -9, to: 1, at: -5, side: 'right', closed: false },
                      { from: -9, to: 1, at: -5, side: 'left', closed: true },
                    ],
                    correct: 0,
                    explain: 'الجزء الملوّن على يمين $-5$ ، و $-5$ حلّ فالرمز $[$ موجّه نحو الجزء الملوّن — كما في السطر $x \\geq 2$.',
                  }}
                  requires={['hal-mutarajiha']}
                  onAnswered={() => setQ2b(true)}
                />
              )}
              {q2b && <KnowledgeBrick id="tamthil-jadwal" lead="ما رسمته على المستقيم، في جدول الكتاب:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'الرمز عند 3 وعند 2', subtitle: 'جرّب المستوى المبتدئ، ثم أجب', done: answeredBeg,
          content: (
            <div className="space-y-3">
              {evidence([BEG])}
              <p data-evidence="checkpoint" data-tried={answeredBeg ? 'true' : 'false'}
                className={`rounded-xl border-2 px-3 py-2 text-sm ${answeredBeg ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
                {answeredBeg
                  ? 'أجبتَ في المختبر: الرمز يُوجَّه نحو الجزء الملوّن حين يكون الحدّ حلًّا، وبعيدًا عنه حين لا يكون.'
                  : 'ثبّت الرمز في المستوى المبتدئ، ثم أجب عن الأسئلة التي تظهر فوق المختبر.'}
              </p>
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />}
    />
  );
}
