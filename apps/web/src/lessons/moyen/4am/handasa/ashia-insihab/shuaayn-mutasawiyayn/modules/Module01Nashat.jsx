import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, LAB } from '../content/textbook';
import { FIG_ACT2B } from '../content/figures';
import TifoVignette from '../components/TifoVignette';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';

/**
 * Module 1 — نشاط 2 ب (p. 129), ouvert sur LA BANDEROLE DU TIFO (parallelogram-pin).
 *
 * REAL / DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   مبتدئ (ouvert par défaut : le نشاط 2 ب n'est PAS le niveau avancé du lab) : le foulard [AB] coupé en 8 parts, le
 *          capo I que l'élève déplace ; AI et IB comparés (منحى، اتجاه، طول), la flèche IB retournée en BI ;
 *   متقدم : la banderole de la طريقة p. 131 (D image de C, puis E) — à un onglet, reprise au module 3.
 * UNDERSTAND  la question « متى AI = IB ؟ » sous les essais de l'élève (`onTrial`, `[data-activity-evidence]`) ; puis le
 *           نشاط 2 ب sur sa figure (FIG_ACT2B) : O milieu de [BC] et [AD] ⇒ AB = CD ; AC et DB de sens contraires.
 * FORMALIZE  la brique muntasaf-mushtarak (le « متوازي أضلاع مسطّح »).
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const KIND = { equal: 'متساويان', length: 'الطول مختلف', sense: 'اتجاهان متعاكسان', both: 'المنحى فقط' };

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  const onTrial = (ev) => { if (ev?.mode === 'midpoint') setTrials((s) => [...s, ev].slice(-8)); };

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500">لم تسجّل بعد أي موضع (المستوى «مبتدئ»: حرّك القائد I على الوشاح واتركه، واقلب السهم الثاني).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">مواضعك على الوشاح:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {trials.map((t) => (
              <li key={t.n} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${t.kind === 'equal' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-slate-50 text-slate-700'}`} data-evidence-trial={t.k}>
                I عند القسم {t.k} من {t.N} — <bdi dir="ltr" className="font-mono">AI · {t.second}</bdi>: {KIND[t.kind]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 ب — منتصف مشترك على مستقيم"
      moduleSubtitle="متى يكون شعاعان متساويين؟ القائد على الوشاح، ثم النقط على المستقيم (d)"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 129',
        headline: 'تيفو في ملعب 5 جويلية!',
        emoji: '🏟️',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <TifoVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY_LINES.source} /></p>
            <p className="text-sm text-slate-600">في المستوى «مبتدئ»: حرّك قائد المدرّج I على الوشاح [AB] وقارن الشعاعين. في المستوى «متقدم»: ضع ركن الراية D (ستعود إليه في الطرائق).</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="الوشاح مقسّم إلى 8 أقسام متقايسة، والراية تمسكها أربعة أيادٍ على شبكة المدرّج."
          levels={{
            beginner: () => (
              <Manipulation
                type="parallelogram-pin"
                level="beginner"
                {...LAB.beginner.numbers}
                theme="tifo"
                title="الوشاح: أين يقف قائد المدرّج؟"
                lead={<MathText>{'حامِلا الوشاح في A و B. القائد I يتحرّك على [AB]: قارن $\\overrightarrow{AI}$ و $\\overrightarrow{IB}$ .'}</MathText>}
                onTrial={onTrial}
              />
            ),
            advanced: () => (
              <Manipulation
                type="parallelogram-pin"
                level="advanced"
                {...LAB.advanced.numbers}
                theme="tifo"
                title="طرائق: راية التيفو، D صورة C ثم النقطة E"
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'على الوشاح', subtitle: 'متى يتساوى الشعاعان؟', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <TapQuestion
                prompt={<MathText>{'متى يكون $\\overrightarrow{AI} = \\overrightarrow{IB}$ ؟'}</MathText>}
                options={[
                  'عندما تكون I في منتصف [AB]',
                  'كلما كانت I بين A و B', // même منحى et même اتجاه, mais pas même طول
                  'عندما يكون $\\overrightarrow{AI} = \\overrightarrow{BI}$', // au milieu, AI et BI sont de sens contraires
                ].map(M)}
                correct={0}
                cols={1}
                requires={['tasawi-shuaayn']}
                explain={<MathText>{'بين A و B للشعاعين دائما نفس المنحى ونفس الاتجاه، والطولان لا يتساويان إلا في المنتصف (4 أقسام و 4 أقسام). أما $\\overrightarrow{BI}$ فيتجه من B نحو I: عكس $\\overrightarrow{AI}$ .'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'نشاط 2 ب: منتصف واحد', subtitle: 'السؤال 1', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.text} source={ACTIVITY.source} compact />
              <p className="text-xs text-slate-500" data-scan-note>{ACTIVITY.scanNote}</p>
              <GeoFigure {...FIG_ACT2B} />
              <TapQuestion
                prompt="لماذا O منتصف [BC]؟"
                options={[
                  'OC = OA + AC و OB = OD + DB، و OA = OD و AC = DB (الترميز)، إذن OC = OB',
                  'لأن O تقع بين B و C', // nécessaire, pas suffisant
                  'لأن OA = OD', // c'est le milieu de [AD], pas celui de [BC]
                ]}
                correct={0}
                cols={1}
                requires={['muntasaf-qita']}
                explain={<MathText>{ACTIVITY_LINES.midBC}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'نشاط 2 ب: العلاقة بين الشعاعين', subtitle: 'استنتج', done: q3,
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_ACT2B} />
              <TapQuestion
                prompt={<MathText>{'للقطعتين [BC] و [AD] نفس المنتصف O. العلاقة بين $\\overrightarrow{AB}$ و $\\overrightarrow{CD}$ :'}</MathText>}
                options={[
                  '$\\overrightarrow{AB} = \\overrightarrow{CD}$',
                  '$\\overrightarrow{AB} = \\overrightarrow{DC}$', // DC va vers la gauche
                  'لا علاقة: النقط على استقامة واحدة', // l'égalité vaut aussi pour des points alignés
                ].map(M)}
                correct={0}
                cols={1}
                requires={['tasawi-shuaayn', 'shuaa-mutawazi']}
                explain={<MathText>{`${ACTIVITY_LINES.abcd} ($\\overrightarrow{DC}$ يتجه نحو اليسار.)`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="muntasaf-mushtarak" lead="ما وجدته، بكلمات النشاط:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'نشاط 2 ب: الشعاعان AC و DB', subtitle: 'السؤال 2', done: q4,
          content: (
            <div className="space-y-3">
              <GeoFigure {...FIG_ACT2B} />
              <TapQuestion
                prompt={<MathText>{'قارن بين الشعاعين $\\overrightarrow{AC}$ و $\\overrightarrow{DB}$ :'}</MathText>}
                options={[
                  'لهما نفس المنحى ونفس الطول، لكن اتجاهين متعاكسين: ليسا متساويين',
                  'متساويان لأن AC = DB', // la longueur seule ne suffit pas (MISC-SHUAA-TUL-FAQAT)
                  'ليس لهما نفس المنحى', // tous deux sur (d)
                ].map(M)}
                correct={0}
                cols={1}
                requires={['tasawi-shuaayn']}
                explain={<MathText>{ACTIVITY_LINES.acdb}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <Feedback tone="ok">كما على الوشاح: الطول وحده لا يكفي، والاتجاه يحسم.</Feedback>}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
