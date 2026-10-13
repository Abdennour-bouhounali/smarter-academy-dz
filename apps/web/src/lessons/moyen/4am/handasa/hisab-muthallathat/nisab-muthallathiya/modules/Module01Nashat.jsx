import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, ACTIVITY_2, ACTIVITY_2_LINES, LAB } from '../content/textbook';
import { FIG_ACT1, FIG_ACT2 } from '../content/figures';
import SkateparkVignette from '../components/SkateparkVignette';

/**
 * Module 1 — نشاط 1 et نشاط 2 (p. 116), ouverts sur LES RAMPES DU SKATEPARK (ramp-ratios).
 *
 * REAL / DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : le نشاط 2) : B̂ = 40° imposé, l'élève construit des rampes (4, 6, 8 en repères), juge
 *          avant de lire, puis tourne l'angle ;
 *   مبتدئ : la rampe à nommer (30°, planche 4 m) — nommer, composer cos / sin / tan, lever la rampe ; c'est là que
 *          l'élève lit cos 25° (Ĉ = 25°, B̂ = 65°) et cos 75° (Ĉ = 75°).
 * UNDERSTAND  les questions du نشاط 1 puis du نشاط 2 sous les lectures de l'élève (`onTrial`, `[data-activity-evidence]`) ;
 *           la preuve par Thalès sur la figure du manuel (FIG_ACT2).
 * FORMALIZE  les briques cos-nashat (نشاط 1, rappel du cosinus de 3AM) et nisab-zawiya (نشاط 2 : sin et tan nommés) ;
 *           puis la « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire, module 5 : trois rampes, mêmes gestes, autres nombres).
 * AUCUNE étape n'attend `onFinished`. LP : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const near = (target, tol = 0.0001) => (x) => Number.isFinite(x) && Math.abs(x - target) <= tol;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [ramps, setRamps] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const onTrialName = (ev) => setTrials((s) => [...s, ev].slice(-8));
  const onTrialScale = (ev) => setRamps((s) => [...s, ev].slice(-8));

  const evidenceName = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500"><MathText>{'لم تسجّل بعد أي قراءة (المستوى «مبتدئ»: اختر $\\widehat{C}$ ، سمِّ الأضلاع وركّب النسب، ثم ارفع المنحدر).'}</MathText></p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">قراءاتك على المنحدر:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {trials.map((t) => (
              <li key={`${t.at}-${t.b}-${t.n}`} className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 text-xs font-bold text-fuchsia-900" data-evidence-trial={t.n}>
                <MathText>{`$\\widehat{${t.at}} = ${t.angle}^{\\circ}$ : $\\cos \\approx ${t.cos.replace(',', '{,}')}$`}</MathText>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  const evidenceScale = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={ramps.length ? 'true' : 'false'}>
      {ramps.length === 0 ? (
        <p className="text-slate-500"><MathText>{'لم تسجّل بعد أي منحدر (المستوى «متقدم»: $\\widehat{B} = 40^{\\circ}$).'}</MathText></p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">منحدراتك المسجّلة:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="ramps">
            {ramps.map((r) => (
              <li key={r.n} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${r.b === 40 ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-slate-50 text-slate-700'}`} data-evidence-ramp={r.n}>
                <MathText>{`$\\widehat{B} = ${r.b}^{\\circ}$ ، $BC = ${r.len.replace(',', '{,}')}$ : $\\dfrac{AC}{BC} \\approx ${r.sin.replace(',', '{,}')}$ ، $\\dfrac{AC}{AB} \\approx ${r.tan.replace(',', '{,}')}$`}</MathText>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <ContentModule
      objectives={['كيف نسمّي أضلاع المنحدر القائم؟', 'ماذا يتغيّر في النسب ومتى تبقى ثابتة؟', 'هل يصحّ ما نلاحظه مهما كان المنحدر كبيرًا؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 و 2 — منحدرات حديقة التزلج"
      moduleSubtitle="منحدرات بأطوال مختلفة وبالزاوية نفسها: ماذا يبقى ثابتا؟"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 116',
        headline: 'جلسة تصوير في حديقة التزلج!',
        emoji: '🛹',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <SkateparkVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY_LINES.source} /></p>
            <p className="text-sm text-slate-600">في المستوى «مبتدئ»: اختر زاوية حادة، سمِّ الأضلاع، ركّب النسب الثلاث ثم ارفع المنحدر. في المستوى «متقدم» (نشاط 2): ابنِ منحدرات بالزاوية 40° واحكم قبل أن تقرأ.</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="في المستويين: المنحدر مثلث ABC قائم في A — اللوح [BC]، الارتفاع [AC]، والأرض [AB]."
          levels={{
            beginner: () => (
              <Manipulation
                type="ramp-ratios"
                level="beginner"
                {...LAB.beginner.numbers}
                theme="skatepark"
                title="منحدر حديقة التزلج: سمِّ الأضلاع وركّب النسب"
                lead="المنحدر يبدأ بزاوية 30° ولوح طوله 4 م؛ الأرض AB ثابتة، والمقبض C يرفع المنحدر درجة درجة."
                onTrial={onTrialName}
              />
            ),
            advanced: () => (
              <Manipulation
                type="ramp-ratios"
                level="advanced"
                {...LAB.advanced.numbers}
                theme="skatepark"
                title="نشاط 2: ثلاثة منحدرات بزاوية 40°"
                lead={<MathText>{'الزاوية $\\widehat{B} = 40^{\\circ}$ . العلامات 4 و 6 و 8 على اللوح هي أطوال يمكنك أن تبدأ بها.'}</MathText>}
                onTrial={onTrialScale}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'نشاط 1: الوتر والزوايا', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.text} source={ACTIVITY.source} compact />
              <GeoFigure {...FIG_ACT1} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في المثلث ABC القائم في A:</p>}
                rows={[
                  { id: 'watar', label: 'الوتر هو', options: ['[BC]', '[AB]', '[AC]'], correct: 0, correction: 'الوتر [BC] يقابل الزاوية القائمة A.' },
                  // 25° : l'angle C lui-même ; 75° : 90 − 25 + 10, aucune règle
                  { id: 'B', label: <MathText>{'قيس $\\widehat{B}$'}</MathText>, options: ['$65^{\\circ}$', '$25^{\\circ}$', '$75^{\\circ}$'].map(M), correct: 0, correction: <MathText>{ACTIVITY_LINES.angles}</MathText> },
                  { id: 'adj', label: <MathText>{'المجاور للزاوية $\\widehat{C}$'}</MathText>, options: ['[AC]', '[AB]', '[BC]'], correct: 0, correction: '[AC] ضلع للزاوية القائمة يمرّ بالرأس C.' },
                  { id: 'opp', label: <MathText>{'المقابل للزاوية $\\widehat{C}$'}</MathText>, options: ['[AB]', '[AC]', '[BC]'], correct: 0, correction: '[AB] لا يمرّ بالرأس C؛ [BC] هو الوتر.' },
                ]}
                requires={['watar', 'muqabil-mujawir', 'majmu-zawaya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: كما على المنحدر، الوتر هو اللوح.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'نشاط 1: جيب التمام', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.part2} source={ACTIVITY.source} compact />
              <GeoFigure {...FIG_ACT1} />
              <TapQuestion
                prompt={<MathText>{'أتمم: $\\cos 25^{\\circ} = \\dfrac{\\ldots}{\\ldots}$'}</MathText>}
                options={['$\\dfrac{AC}{BC}$', '$\\dfrac{AB}{BC}$', '$\\dfrac{BC}{AC}$'].map(M)}
                correct={0}
                cols={3}
                requires={['jayb-tamam-3am']}
                explain={<MathText>{`${ACTIVITY_LINES.cos25} ($\\dfrac{AB}{BC}$ يستعمل المقابل للزاوية C، و $\\dfrac{BC}{AC}$ مقلوبة وأكبر من 1.)`}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <TapQuestion
                  prompt={<MathText>{'القيمة المضبوطة للعدد $\\cos\\widehat{B}$ هي:'}</MathText>}
                  options={['$\\dfrac{AB}{BC}$', '$\\dfrac{AC}{BC}$', '$\\dfrac{AB}{AC}$'].map(M)}
                  correct={0}
                  cols={3}
                  requires={['jayb-tamam-3am', 'muqabil-mujawir']}
                  explain={<MathText>{`${ACTIVITY_LINES.cosB} ($\\dfrac{AC}{BC}$ هو جيب تمام C، و $\\dfrac{AB}{AC}$ لا يستعمل الوتر.)`}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'نشاط 1: القيم المدوّرة', subtitle: 'على منحدرك أو بالحاسبة', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{'في المستوى «مبتدئ» اختر $\\widehat{C}$ ثم ارفع المنحدر حتى $\\widehat{C} = 25^{\\circ}$ ، ثم اخفضه حتى $\\widehat{C} = 75^{\\circ}$ : جيب التمام المقروء هو ما تعطيه الحاسبة.'}</MathText></p>
              {evidenceName}
              <NumericQuestion
                prompt={<MathText>{'المدوّر إلى الجزء من 100 للعدد $\\cos 75^{\\circ}$ :'}</MathText>}
                expected={near(0.26)}
                parse={parseDec}
                display="0,26"
                requires={['jayb-tamam-3am']}
                explain={<MathText>{ACTIVITY_LINES.values}</MathText>}
                explainFor={(n) => <MathText>{near(0.25)(n) ? `هذا بتر لا تدوير: الرقم الموالي 8. ${ACTIVITY_LINES.values}` : ACTIVITY_LINES.values}</MathText>}
                onAnswered={() => setQ3a(true)}
              />
              {q3a && (
                <NumericQuestion
                  prompt={<MathText>{'المدوّر إلى الجزء من 100 للعدد $\\cos 25^{\\circ}$ :'}</MathText>}
                  expected={near(0.91)}
                  parse={parseDec}
                  display="0,91"
                  requires={['jayb-tamam-3am']}
                  explain={<MathText>{ACTIVITY_LINES.values}</MathText>}
                  explainFor={(n) => <MathText>{near(0.42)(n) ? `هذا $\\cos 65^{\\circ}$ ، أي جيب تمام الزاوية B. ${ACTIVITY_LINES.values}` : ACTIVITY_LINES.values}</MathText>}
                  onAnswered={() => setQ3(true)}
                />
              )}
              {/* Le cosinus est un acquis de 3AM (priorKnowledge jayb-tamam-3am, déjà utilisé à l'étape 2) : un rappel, pas une prédiction. */}
              {q3 && <KnowledgeBrick id="cos-nashat" variant="rappel" lead="ما قرأته على المنحدر، بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'نشاط 2: التخمين', subtitle: 'ثلاثة منحدرات بزاوية 40°', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY_2.part1} source={ACTIVITY_2.source} compact />
              {evidenceScale}
              <TapQuestion
                prompt="ماذا تلاحظ؟ التخمين:"
                options={[
                  'في كل مثلث ABC قائم في A حيث $\\widehat{ABC} = 40^{\\circ}$ ، النسبتان $\\dfrac{AC}{BC}$ و $\\dfrac{AC}{AB}$ هما نفسهما مهما كان طول الأضلاع',
                  'النسبتان تكبران كلما كبر المثلث',
                  'النسبتان تختلفان من تلميذ لآخر لأن كل واحد رسم مثلثا بأطوال مختلفة',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['watar']}
                explain={<MathText>{`${ACTIVITY_2.conjecture} (الاختلافات الصغيرة بين التلاميذ تأتي من دقة القياس، لا من الطول.)`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'نشاط 2: من التخمين إلى البرهان', subtitle: 'لماذا يصحّ في كل حالة؟', done: q5,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY_2.part2} source={ACTIVITY_2.source} compact />
              <GeoFigure {...FIG_ACT2} />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اختر لكل سطر:</p>}
                rows={[
                  {
                    id: 'why', label: <MathText>{'لماذا $\\dfrac{BC}{BC\'} = \\dfrac{AC}{A\'C\'}$ ؟'}</MathText>,
                    options: [
                      '(AC) و (A′C′) عموديان على [Bx) فهما متوازيان: المثلثان BAC و BA′C′ في وضعية طالس',
                      'لأن المثلثين قائمان', // être rectangles ne suffit pas sans l'angle commun / le parallélisme
                      'لأن $AC = A\'C\'$', // faux sur la figure
                    ].map(M),
                    correct: 0, correction: <MathText>{ACTIVITY_2_LINES.parallel}</MathText>,
                  },
                  {
                    id: 'cross', label: 'الجداء المتصالب يعطي',
                    options: ["$BC' \\times AC = BC \\times A'C'$", "$BC \\times AC = BC' \\times A'C'$", "$BC + AC = BC' + A'C'$"].map(M),
                    correct: 0, correction: <MathText>{ACTIVITY_2_LINES.cross}</MathText>,
                  },
                  {
                    id: 'depends', label: <MathText>{'هل النسبتان $\\dfrac{AC}{BC}$ و $\\dfrac{AC}{AB}$ تتعلقان بموقع A على [Bx)؟'}</MathText>,
                    options: ['لا', 'نعم، تكبران حين تبتعد A', 'نعم، تصغران حين تبتعد A'],
                    correct: 0, correction: <MathText>{'$\\dfrac{AC}{BC} = \\dfrac{A\'C\'}{BC\'}$ و $\\dfrac{AC}{AB} = \\dfrac{A\'C\'}{A\'B}$ أينما كانت A: كما في منحدراتك عند $40^{\\circ}$ .'}</MathText>,
                  },
                ]}
                requires={['talis-wahda-9']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'أحسنت: البرهان يؤكّد ما رأيته على المنحدرات.' : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && <KnowledgeBrick id="nisab-zawiya" lead="التخمين أصبح خاصية، وللنسبتين اسمان:" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
