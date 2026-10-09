import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
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
 * Étapes : (1) س 1 : compléter les deux étapes ; (2) س 2 : la dernière ligne du tableau,
 * en mots et en dessin, puis la brique tamthil-jadwal ; (3) le contraste du tableau
 * (x < 3 et x ≥ 2) depuis le niveau مبتدئ. LP : P2, P3.
 */
const ADV = ACTIVITY_B.ineq;
const BEG = 'x<3';

export default function Module02HalMutarajiha() {
  const [log, setLog] = useState({ [BEG]: { traces: [], bracket: null, chain: [] }, [ADV]: { traces: [], bracket: null, chain: [] } });
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q3, setQ3] = useState(false);

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
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="نشاط 3 — حل متراجحة وتمثيل حلولها"
      moduleSubtitle="من المتراجحة إلى نصف مستقيم ملوّن"
      estimatedTime="11 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 45',
        headline: 'أين تبدأ الحلول؟',
        emoji: '📏',
        title: ACTIVITY_B.title,
        tone: 'violet',
        body: <p><MathText>{ACTIVITY_B.text}</MathText></p>,
        footer: <SourceTag source={ACTIVITY_B.source} />,
      }}
      intro={(
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="نفس الفكرة في المستويين: نقاطك الحمراء هي الحلول، والرمز عند الحدّ يقول هل الحدّ منها."
          levels={{
            beginner: () => (
              <Manipulation
                type="solution-ray"
                level="beginner"
                ineq={BEG}
                lead="السطر الأول من جدول الكتاب: جرّب قيمًا، منها 3 نفسه، ثم ضع الرمز ووجّهه."
                onTrial={onTrial(BEG)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="solution-ray"
                level="advanced"
                ineq={ADV}
                lead="متراجحة الكتاب: ابحث بتجاربك عن الحدّ، ثبّت التمثيل، ثم حوّل المتراجحة خطوة خطوة."
                onTrial={onTrial(ADV)}
              />
            ),
          }}
        />
      )}
      steps={[
        {
          num: 1, title: 'أتمم الخطوتين', subtitle: 'السؤال 1 — حوّل المتراجحة في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {evidence([ADV])}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_B.questions[0]}</MathText></p>}
                rows={[
                  { id: 's1', label: <MathText>{'الخطوة 1: $(-\\ldots)$'}</MathText>, options: [<MathText key="a">{'$-5$'}</MathText>, <MathText key="b">{'$-20$'}</MathText>, <MathText key="c">{'$-3$'}</MathText>], correct: 0, correction: <MathText>{'نطرح 5 من الطرفين لنُبعد العدد المضاف إلى $-3x$ : $-3x + 5 - 5 \\leq 20 - 5$.'}</MathText> },
                  { id: 'r1', label: <MathText>{'$-3x \\ldots 15$'}</MathText>, options: [<MathText key="a">{'$\\leq$'}</MathText>, <MathText key="b">{'$\\geq$'}</MathText>], correct: 0, correction: <MathText>{'طرح عدد من الطرفين لا يغيّر الاتجاه: $-3x \\leq 15$.'}</MathText> },
                  { id: 's2', label: <MathText>{'الخطوة 2: $(\\div \\ldots)$'}</MathText>, options: [<MathText key="a">{'$15$'}</MathText>, <MathText key="b">{'$-3$'}</MathText>, <MathText key="c">{'$5$'}</MathText>], correct: 1, correction: <MathText>{'نقسم الطرفين على معامل $x$ ، أي $-3$ : $\\dfrac{15}{-3} = -5$.'}</MathText> },
                  { id: 'r2', label: <MathText>{'$x \\ldots -5$'}</MathText>, options: [<MathText key="a">{'$\\leq$'}</MathText>, <MathText key="b">{'$\\geq$'}</MathText>], correct: 1, correction: <MathText>{'القسمة على عدد سالب تغيّر الاتجاه: $x \\geq -5$ — نقاطك الحمراء على يمين $-5$.'}</MathText> },
                ]}
                requires={['amaliyat-mutabayinat']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'الخطوة 1 حافظت على الاتجاه، والخطوة 2 (القسمة على $-3$) غيّرته: $x \\geq -5$.'
                      : 'ارجع إلى المختبر: أيّ سطر رفضته نقاطك الحمراء، ولماذا؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'أتمم السطر الأخير من الجدول', subtitle: 'السؤال 2', done: q2a && q2b,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_B.questions[1]}</MathText></p>
              <div className="grid gap-2 sm:grid-cols-2" data-textbook-table>
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
          num: 3, title: 'الرمز عند 3 وعند 2', subtitle: 'جرّب المستوى المبتدئ، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              {evidence([BEG])}
              <TapQuestion
                prompt={<MathText>{'في الجدول، الرمز عند 3 ($x < 3$) غير موجّه نحو الجزء الملوّن، وعند 2 ($x \\geq 2$) موجّه نحوه. لماذا؟'}</MathText>}
                options={[
                  <MathText key="a">{'لأنّ الجزء الملوّن في الأولى على اليسار وفي الثانية على اليمين'}</MathText>,
                  <MathText key="b">{'لأنّ 3 ليس حلًّا للمتراجحة $x < 3$ ، و 2 حلّ للمتراجحة $x \\geq 2$'}</MathText>,
                  <MathText key="c">{'لأنّ المتراجحة $x < 3$ ليس لها حلول'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['tamthil-jadwal']}
                explain={<MathText>{'$3 < 3$ خاطئة: 3 ليس حلًّا فالرمز غير موجّه نحو الجزء الملوّن؛ $2 \\geq 2$ صحيحة: 2 حلّ فالرمز موجّه نحوه. الجهة وحدها لا تكفي: $x \\leq 3$ ملوّنة على اليسار أيضًا، و 3 حلّ لها.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
