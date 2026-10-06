import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import { parseDec } from '@smarter-academy/core';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, HOOK, RAMP2 } from '../content/textbook';
import SkateVignette from '../components/SkateVignette';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';

/**
 * Module 1 — نشاط 3 (p. 78) « تمثيل دالة تآلفية », ouvert sur LA DROITE QUI A QUITTÉ L'ORIGINE (affine-line).
 *
 * REAL      la carte : deux rampes de skatepark, l'une part du sol, l'autre d'une base — puis le نشاط 3 au mot près.
 * DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : c'est le نشاط 3) : (d) de g(x) = 3/2 x par O ; l'élève tire (0 ; b′) jusqu'à
 *          (d′) de f(x) = 3/2 x + 1 (b′ ≠ 1 refusé avec f(0) = 1), lit à la sonde la même abscisse sur les deux ;
 *          puis il OUVRE le second laboratoire : une rampe dont la formule est cachée (−1/2 x + 3) ;
 *   مبتدئ : x ⟼ ½x montée de 2 (plateforme), un seul laboratoire.
 * UNDERSTAND  س 1 أ) se décide sur les propres lectures de l'élève (`onTrial` → `[data-activity-evidence]`),
 *           س 1 ب) généralise (+1), س 2 أ) — CORRIGÉE (0 ; 1) — et س 2 ب) prouvent f(0) = b.
 * TOUCH / FORMALIZE  les briques irtifa-b et tartib-mabda (« نسمّي العدد b … الترتيب عند المبدأ »).
 * TRANSFER  le second laboratoire : où (D) coupe l'axe des ordonnées, et ce que fait sa marche.
 * AUCUNE étape n'attend `onFinished`. LP : P1 (étapes 1–4), P2 (étape 5).
 * Les labs vivent dans l'`intro` (deux niveaux) : le rappel de « مسألة الدرس » (LessonProblemCard)
 * clôt donc la DERNIÈRE étape.
 */
const Opt = (s) => <MathText key={s}>{s}</MathText>;
const Evidence = ({ items, empty, title, kind }) => (
  <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={items.length ? 'true' : 'false'}>
    {items.length === 0 ? <p className="text-slate-500"><MathText>{empty}</MathText></p> : (
      <>
        <p className="mb-1 font-bold text-slate-700">{title}</p>
        <ul className="flex flex-wrap gap-1.5" data-evidence={kind}>
          {items.slice(-8).map((tr, i) => (
            <li key={`${tr.tex}${i}`} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${tr.ok === false ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`}>
              <MathText>{`$${tr.tex}$`}</MathText>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default function Module01Nashat() {
  const [probes, setProbes] = useState([]);
  const [tries, setTries] = useState([]);
  const [q1a, setQ1a] = useState(false);
  const [q1b, setQ1b] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5a, setQ5a] = useState(false);
  const [q5b, setQ5b] = useState(false);

  const onTrial = (tr) => {
    if (tr.kind === 'probe' || tr.kind === 'shift') setProbes((p) => [...p, tr]);
    if (tr.kind === 'try') setTries((p) => [...p, tr]);
  };

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — المستقيم الذي غادر المبدأ"
      moduleSubtitle="تمثيل دالة تآلفية"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 78',
        headline: HOOK.headline,
        emoji: '🛹',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <SkateVignette />,
        body: (
          <div className="space-y-2">
            <p className="text-sm text-slate-600"><MathText>{HOOK.text}</MathText></p>
            <p className="font-semibold text-slate-800"><MathText>{ACTIVITY.text}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="في المستويين مستقيم متقطع يشمل المبدأ، ومستقيمك فوقه. ارفع مستقيمك من نقطته على محور التراتيب، وقارن بالمسبار."
          defaultLevel="advanced"
          levels={{
            beginner: () => (
              <Manipulation
                type="affine-line"
                level="beginner"
                a="1/2"
                b="2"
                mode="shift"
                theme="ramp"
                title="منحدر أوّل يبدأ على ارتفاع 2"
                lead={<MathText>{'ارفع المستقيم حتى يصير تمثيل $f(x) = \\dfrac{1}{2}x + 2$ ، ثم حرّك المسبار إلى فاصلتين مختلفتين.'}</MathText>}
              />
            ),
            advanced: () => (
              <Manipulation
                type="affine-line"
                level="advanced"
                a={ACTIVITY.a}
                b={ACTIVITY.b}
                mode="shift|identify"
                find={`${RAMP2.a}:${RAMP2.b}`}
                theme="ramp"
                title="نشاط 3: نرفع المستقيم بـ 1"
                lead={<MathText>{"اسحب نقطة مستقيمك على محور التراتيب حتى يصير $(d')$ ، ثم اقرأ بالمسبار ترتيبَي النقطتين اللتين فاصلتهما 2. بعدها افتح المختبر الثاني."}</MathText>}
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'الفاصلة 2', subtitle: 'السؤال 1 أ', done: q1a && q1b,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <Evidence items={probes} kind="probes" title="ما فعلته على المختبر:" empty="ارفع مستقيمك، ثم حرّك المسبار تحت محور الفواصل إلى $2$ (المستوى المتقدّم)." />
              <NumericQuestion
                prompt={<MathText>{'ترتيب النقطة من $(d)$ التي فاصلتها $2$ هو:'}</MathText>}
                expected={3}
                parse={parseDec}
                display="3"
                requires={['tamthil-khatti']}
                explain={<MathText>{ACTIVITY_LINES.g2}</MathText>}
                onAnswered={() => setQ1a(true)}
              />
              <NumericQuestion
                prompt={<MathText>{'دون حساب جديد: ترتيب النقطة من $(d\')$ التي فاصلتها $2$ هو:'}</MathText>}
                expected={4}
                parse={parseDec}
                display="4"
                requires={['notation-fx']}
                explain={<MathText>{ACTIVITY_LINES.f2}</MathText>}
                onAnswered={() => setQ1b(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'بشكل عام', subtitle: 'السؤال 1 ب', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[1]}</MathText></p>
              <Evidence items={probes.filter((p) => p.kind === 'probe')} kind="reads" title="قراءاتك بالمسبار:" empty="جرّب المسبار عند فاصلتين مختلفتين، إحداهما سالبة." />
              {/* « أتوقّع القاعدة » : les options et l'explication de س 1 ب énoncent irtifa-b — l'élève l'écrit d'abord. */}
              <PredictRule id="irtifa-b">
                <TapQuestion
                  prompt={<MathText>{'نجد ترتيب نقطة من $(d\')$ انطلاقا من نقطة $(d)$ التي لها نفس الفاصلة:'}</MathText>}
                  options={[
                    'نضيف $1$ إلى ترتيب نقطة $(d)$ ، مهما كانت الفاصلة.',
                    'نضيف $1$ إلى فاصلة نقطة $(d)$ .',
                    'نضيف عددًا يكبر كلما كبرت الفاصلة.',
                    'نضرب ترتيب نقطة $(d)$ في $1$ .',
                  ].map(Opt)}
                  correct={0}
                  cols={1}
                  requires={['notation-fx']}
                  explain={<MathText>{`${ACTIVITY_LINES.rule} أمّا ضرب الترتيب في $1$ فلا يغيّره، وإضافة $1$ إلى الفاصلة تعطي نقطة أخرى من $(d)$ لا من $(d')$ .`}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              </PredictRule>
              {q2 && <KnowledgeBrick id="irtifa-b" lead="ما رأيته على المختبر: المستقيم كلّه صعد." />}
            </div>
          ),
        },
        {
          num: 3, title: 'نقطة على محور التراتيب', subtitle: 'السؤال 2 أ', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <p className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-900" data-correction><MathText>{ACTIVITY.correction}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'النقطة $(0 ; 1)$ تنتمي إلى $(d\')$ لأنّ:'}</MathText>}
                options={[
                  '$f(0) = \\dfrac{3}{2} \\times 0 + 1 = 1$ : ترتيب نقطة $(d\')$ ذات الفاصلة $0$ هو $1$ .',
                  '$(d\')$ يشمل المبدأ O مثل $(d)$ ، والنقطة $(0 ; 1)$ قريبة منه.',
                  '$f(1) = 1$ .',
                ].map(Opt)}
                correct={0}
                cols={1}
                requires={['irtifa-b']}
                explain={<MathText>{`${ACTIVITY_LINES.p01} أمّا $(d')$ فلا يشمل O لأنّ $f(0) = 1 \\neq 0$ ، و $f(1) = \\dfrac{5}{2}$ .`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'لكل دالة تآلفية', subtitle: 'السؤال 2 ب', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'إذا كانت $f(x) = ax + b$ فإنّ النقطة $(0 ; b)$ من تمثيلها لأنّ:'}</MathText>}
                options={['$f(0) = a \\times 0 + b = b$', '$f(0) = a + b$', '$f(b) = 0$'].map(Opt)}
                correct={0}
                cols={3}
                requires={['irtifa-b']}
                explain={<MathText>{`${ACTIVITY_LINES.general} أمّا $a \\times 0$ فيساوي $0$ ، فلا نجد $a + b$ ، و $f(b) = ab + b$ لا يساوي $0$ في العموم.`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="tartib-mabda" lead="بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 5, title: 'المنحدر الثاني', subtitle: 'المختبر الثاني — المستوى المتقدّم', done: q5a && q5b,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{RAMP2.text}</MathText> <SourceTag source={RAMP2.source} /></p>
              <Evidence items={tries} kind="tries" title="مستقيماتك على المنحدر الثاني:" empty="أكمل المختبر الأول ثم اضغط «إلى المنحدر الثاني ←»." />
              <NumericQuestion
                prompt={<MathText>{'المستقيم $(D)$ يقطع محور التراتيب في النقطة التي ترتيبها:'}</MathText>}
                expected={3}
                parse={parseDec}
                display="3"
                requires={['tartib-mabda']}
                explain={<MathText>{'$(D)$ يقطع محور التراتيب في $(0 ; 3)$ : الترتيب عند المبدأ لدالته هو $3$ .'}</MathText>}
                onAnswered={() => setQ5a(true)}
              />
              <TapQuestion
                prompt={<MathText>{'من النقطة $(0 ; 3)$ نتقدّم على $(D)$ وحدة واحدة إلى اليمين، فـ:'}</MathText>}
                options={['ينزل المستقيم $\\dfrac{1}{2}$', 'يصعد المستقيم $\\dfrac{1}{2}$', 'ينزل المستقيم $2$', 'يصعد المستقيم $3$'].map(Opt)}
                correct={0}
                cols={2}
                requires={['tartib-mabda']}
                explain={<MathText>{'$(D)$ يشمل $(0 ; 3)$ و $(2 ; 2)$ : لوحدتين نزل $1$ ، أي $\\dfrac{1}{2}$ لكل وحدة. ومنه دالته $x \\longmapsto -\\dfrac{1}{2}x + 3$ ؛ أمّا $3$ فهو الترتيب عند المبدأ لا الدرجة.'}</MathText>}
                onAnswered={() => setQ5b(true)}
              />
              {q5b && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'رفعت مستقيمًا، ورأيت أنّه يقطع محور التراتيب في $(0 ; b)$ ، وقرأت على منحدر ثانٍ أين يقطع هذا المحور وكم ينزل لكل وحدة. المحور التالي يعطي ذلك كلّه أسماءه: معامل التوجيه والترتيب عند المبدأ.'}</MathText>
                </p>
              )}
              {/* La « مسألة الدرس » prolonge le lab متقدم (labs dans l'intro : dernière étape) :
                  une autre rampe du skatepark, sur une base, à lire sur son graphe — résolue au module 5. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
