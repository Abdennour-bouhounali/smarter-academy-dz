import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, METHOD_RATIO, METHOD_LENGTH, NOW, ROOT13, LINES } from '../content/textbook';
import TrialsEvidence from '../components/TrialsEvidence';

/**
 * Module 2 — طرائق (pp. 107 et 109), stage `discovery` (les طرائق : TOUCH → FORMALIZE). Chaque méthode est révélée ligne à ligne
 * (MethodSteps) APRÈS que l'élève l'a approchée, puis nommée par une brique :
 *   1. la طريقة ص 109 : M de [AB] avec MA/MB = 3/2 → brique nuqta-nisba ; le distracteur 3/2 pour AM/AB
 *      (MISC-TALIS-NISBA-JUZ-KULL) ;
 *   2. le point K de la même figure : (EK) coupe (AB) en N HORS de [AB] → brique nuqtatan (déclarée) ;
 *   3. دوري الآن (CA/CB = 2/5) FAIT au laboratoire, posé seul sur ces nombres (`levels={false}`) — les deux points ;
 *   4. la طريقة ص 107 : AB = 14/3 comme quatrième proportionnel → brique insha-tul, puis 10/3 ;
 *   5. LP2 « نسبة غير ناطقة » : √13 hypoténuse d'un 2 × 3, puis ses deux tiers (exemple DÉCLARÉ de la plateforme)
 *      → brique tul-ghayr-natiq.
 * LP : P1 (1–3), P2 (4–5).
 * « أتوقّع القاعدة » (2026-10-06) : les deux طرائق du manuel (figure + solution révélée) et l'exemple √13 énoncent la méthode
 * AVANT sa brique — ils sont enveloppés dans <PredictRule id="nuqta-nisba">, <PredictRule id="insha-tul">,
 * <PredictRule id="tul-ghayr-natiq"> : l'élève écrit sa construction, puis lit celle du livre.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module02Taraiq() {
  const [nowTrials, setNowTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="طرائق — نسبة معلومة وطول معلوم"
      moduleSubtitle="موازيان مدرّجان، وتناسب يصير إنشاءً"
      objectives={['كيف أنشئ نقطة M من [AB] حيث MA/MB = 3/2 ؟', 'أين تقع النقطة الثانية التي لها النسبة نفسها؟', 'كيف أنشئ قطعة طولها معلوم، ولو كان غير ناطق؟']}
      estimatedTime="12 دقيقة"
      // LE LABO OUVRE LE MODULE (§4quater, rétrofit 2026-10-15) : « دوري الآن » (CA/CB = 2/5, les deux points) est cherché AVANT que les
      // طرائق ne nomment la construction ; l'énoncé du manuel est le `lead` du labo, l'étape 3 interroge ses deux points.
      intro={(
        <Manipulation type="segment-divider" levels={false} mode={LAB.m2.mode} p={LAB.m2.p} q={LAB.m2.q} marks={LAB.m2.marks}
          theme={LAB.m2.theme} lead="(xy) مستقيم، A و B نقطتان منه. لا تتوفّر إلا مسطرة غير مدرّجة ومدور." onTrial={(t) => setNowTrials((x) => [...x, t].slice(-8))} />
      )}
      steps={[
        {
          num: 1, title: 'نقطة تقسم [AB] بنسبة 3 إلى 2', subtitle: 'طرائق ص 109', done: q1,
          content: (
            <div className="space-y-3">
              <PredictRule id="nuqta-nisba">
                <GeoFigure {...METHOD_RATIO.figure} />
                <MethodSteps method={{ source: METHOD_RATIO.source, exercise: METHOD_RATIO.exercise, solution: METHOD_RATIO.solution }} />
              </PredictRule>
              <TapQuestion
                prompt={<MathText>{'M من [AB] و $\\dfrac{MA}{MB} = \\dfrac{3}{2}$ . إذن $\\dfrac{AM}{AB} =$'}</MathText>}
                options={['$\\dfrac{3}{5}$', '$\\dfrac{3}{2}$', '$\\dfrac{2}{5}$'].map(M)}
                correct={0}
                cols={3}
                requires={['kitabat-tanasub']}
                explain={<MathText>{`${LINES.partWhole} ($\\dfrac{2}{5}$ هي $\\dfrac{MB}{AB}$ .)`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="nuqta-nisba" lead="الطريقة كما يكتبها الكتاب:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'والنقطة K؟', subtitle: 'نقطة ثانية خارج [AB]', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{'في شكل الكتاب، K على (d₁) من جهة E و $AK = 3$ . المستقيم (EK) يقطع المستقيم (AB) في نقطة N خارج [AB].'}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'المثلثان NAK و NBE في وضعية طالس، إذن $\\dfrac{NA}{NB} =$'}</MathText>}
                options={['$\\dfrac{3}{2}$', '$\\dfrac{2}{3}$', '$\\dfrac{3}{5}$'].map(M)}
                correct={0}
                cols={3}
                requires={['nuqta-nisba', 'talis-nisab']}
                explain={<MathText>{'$(AK) // (BE)$ : $\\dfrac{NA}{NB} = \\dfrac{AK}{BE} = \\dfrac{3}{2}$ ، النسبة نفسها، لكن N خارج [AB] (بعد B لأن NA أكبر من NB). ($\\dfrac{2}{3}$ مقلوبة، و $\\dfrac{3}{5}$ هي $\\dfrac{AM}{AB}$ للنقطة الداخلية.)'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="nuqtatan" lead="النسبة نفسها في نقطتين:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'عن نقطتيك في المختبر', subtitle: 'دوري الآن', done: q3,
          content: (
            <div className="space-y-3">
              <TrialsEvidence trials={nowTrials} empty="أنشئ النقطتين في المختبر أعلاه: درّج (d₁) و (d₂) ثم ضع طرفي المسطرة. (دوري الآن، الكتاب ص 109)" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'النقطتان C حيث $\\dfrac{CA}{CB} = \\dfrac{2}{5}$ :'}</MathText></p>}
                rows={[
                  { id: 'in', label: <MathText>{'C بين A و B : $\\dfrac{AC}{AB} =$'}</MathText>, options: ['$\\dfrac{2}{7}$', '$\\dfrac{2}{5}$', '$\\dfrac{5}{7}$'].map(M), correct: 0, correction: <MathText>{'$AB = AC + CB$ : سبعة أجزاء، و AC جزءان منها. ($\\dfrac{2}{5}$ هي $\\dfrac{CA}{CB}$ نفسها، و $\\dfrac{5}{7}$ هي $\\dfrac{CB}{AB}$ .)'}</MathText> },
                  { id: 'out', label: <MathText>{'C خارج [AB] : $\\dfrac{AC}{AB} =$'}</MathText>, options: ['$\\dfrac{2}{3}$', '$\\dfrac{2}{7}$', '$\\dfrac{5}{3}$'].map(M), correct: 0, correction: <MathText>{'$CB - CA = AB$ : AB ثلاثة أجزاء و AC جزءان، $\\dfrac{AC}{AB} = \\dfrac{2}{3}$ . ($\\dfrac{5}{3}$ هي $\\dfrac{CB}{AB}$ .)'}</MathText> },
                  { id: 'side', label: 'النقطة C الخارجية تقع', options: ['قبل A (من جهة A)', 'بعد B (من جهة B)'], correct: 0, correction: <MathText>{'$CA < CB$ : C أقرب إلى A ، فهي من جهة A.'}</MathText> },
                ]}
                requires={['nuqtatan']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? <MathText>{`أحسنت: ${NOW.inside} و ${NOW.outside} .`}</MathText> : 'راجع التصحيح تحت كل سطر.'}</Feedback>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'قطعة طولها معلوم', subtitle: 'طرائق ص 107', done: q4,
          content: (
            <div className="space-y-3">
              <PredictRule id="insha-tul">
                <GeoFigure {...METHOD_LENGTH.figure} />
                <MethodSteps method={{ source: METHOD_LENGTH.source, exercise: METHOD_LENGTH.exercise, solution: METHOD_LENGTH.solution }} />
              </PredictRule>
              <TapQuestion
                prompt={<MathText>{'لماذا $AB = \\dfrac{14}{3}$ ؟ لأن (CE) // (DB) ، فحسب خاصية طالس:'}</MathText>}
                options={[
                  '$\\dfrac{AC}{AD} = \\dfrac{AE}{AB}$ أي $\\dfrac{3}{7} = \\dfrac{2}{AB}$',
                  '$\\dfrac{AC}{AD} = \\dfrac{AB}{AE}$ أي $\\dfrac{3}{7} = \\dfrac{AB}{2}$',
                  '$\\dfrac{AE}{AC} = \\dfrac{AD}{AB}$ أي $\\dfrac{2}{3} = \\dfrac{7}{AB}$',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['talis-nisab', 'kitabat-tanasub']}
                explain={<MathText>{`${METHOD_LENGTH.why} (الثانية تعطي $AB = \\dfrac{6}{7}$ والثالثة $AB = \\dfrac{21}{2}$ : النسب فيهما ليست نسب المثلثين ACE و ADB.)`}</MathText>}
                onAnswered={() => setQ4a(true)}
              />
              {q4a && <KnowledgeBrick id="insha-tul" lead="الطول المطلوب هو الرابع المتناسب:" />}
              {q4a && (
                <NumericQuestion
                  prompt={<MathText>{'بالطريقة نفسها نريد $AB = \\dfrac{10}{3}$ ، فنأخذ $AC = 3$ و $AE = 2$ . كم يجب أن يكون AD ؟'}</MathText>}
                  expected={5}
                  display="5"
                  requires={['insha-tul']}
                  explain={<MathText>{'$\\dfrac{AC}{AD} = \\dfrac{AE}{AB}$ أي $\\dfrac{3}{AD} = \\dfrac{2}{\\frac{10}{3}}$ ، فـ $2 \\times AD = 3 \\times \\dfrac{10}{3} = 10$ و $AD = 5$ .'}</MathText>}
                  onAnswered={() => setQ4(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 5, title: 'طول غير ناطق', subtitle: 'مثال من المنصّة', done: q5,
          content: (
            <div className="space-y-3">
              <PredictRule id="tul-ghayr-natiq">
                <TextbookBox kind="example" lines={ROOT13.lines} source={ROOT13.source} compact />
                <GeoFigure {...ROOT13.figure} />
              </PredictRule>
              <TapQuestion
                prompt={<MathText>{'قسّمنا الوتر الذي طوله $\\sqrt{13}$ إلى 3 قطع متقايسة وأخذنا قطعتين. طول القطعة الناتجة:'}</MathText>}
                options={['$\\dfrac{2\\sqrt{13}}{3}$', '$\\dfrac{2 \\times 13}{3}$', '$\\dfrac{3\\sqrt{13}}{2}$'].map(M)}
                correct={0}
                cols={3}
                requires={['fithaghuris', 'tabrir-taqsim']}
                explain={<MathText>{'$\\dfrac{AM}{AB} = \\dfrac{2}{3}$ و $AB = \\sqrt{13}$ ، فـ $AM = \\dfrac{2}{3}\\sqrt{13} = \\dfrac{2\\sqrt{13}}{3}$ . ($\\dfrac{2 \\times 13}{3}$ نسيت الجذر، و $\\dfrac{3\\sqrt{13}}{2}$ أكبر من الوتر نفسه.)'}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && <KnowledgeBrick id="tul-ghayr-natiq" lead="ما لا تقيسه المسطرة تنشئه الأدوات:" />}
              {q5 && <p className="text-xs text-slate-500"><SourceTag source={ROOT13.source} /></p>}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
