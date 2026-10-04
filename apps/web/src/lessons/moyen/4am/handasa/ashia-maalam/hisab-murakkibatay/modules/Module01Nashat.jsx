import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Feedback } from '../../../../../../common/components/LessonUI';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox, PairQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, LAB } from '../content/textbook';
import { FIG_ACT2, FIG_ACT2_SOLVED } from '../content/figures';
import GameMapVignette from '../components/GameMapVignette';

/**
 * Module 1 — نشاط 2 (p. 140), ouvert sur LES PORTAILS DE LA CARTE DE JEU (component-calc).
 *
 * REAL / DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : c'est le نشاط 2, le niveau avancé du lab) : le code de CD prédit puis sauté, E posé tel
 *          que DE(3 ; 4) (jugé seulement à la validation), le code de CF comparé à DE — les portails jumeaux ;
 *   مبتدئ : les portails A(1 ; 2), B(4 ; 3) puis D tel que AB = DC (voyants en direct) — repris au module 3.
 * UNDERSTAND  les questions du نشاط 2 sous les essais de l'élève (`onTrial`, `[data-activity-evidence]`) : lire C et D,
 *           les composantes de CD, E, puis la règle a = x_B − x_A (partie ب) et DE = CF.
 * FORMALIZE  la brique farq-ihdathiyat (« النهاية ناقص المبدأ »).
 * AUCUNE étape n'attend `onFinished`. LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const KIND = { ok: 'صحيح', reversed: 'طرح مقلوب', swapped: 'مبدّلتان', coords: 'إحداثيتا النهاية', signX: 'إشارة', signY: 'إشارة', xOnly: 'نصف صحيح', yOnly: 'نصف صحيح', none: 'بعيد', zero: 'لا قفزة', order: 'ترتيب الحروف', onPoint: 'بوابة أخرى' };
const tex = (v) => (v < 0 ? `-${Math.abs(v)}` : `${v}`);

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const onTrial = (ev) => { if (ev) setTrials((s) => [...s, ev].slice(-8)); };

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500">لم تجرّب بعد أي رمز (المستوى «متقدم»: اكتب رمز البوابة CD ثم افتحها).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">محاولاتك على الخريطة:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {trials.map((t) => (
              <li key={t.n} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${t.kind === 'ok' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-slate-50 text-slate-700'}`} data-evidence-trial={t.type}>
                {t.type === 'calc'
                  ? <MathText>{`رمز $\\overrightarrow{${t.from}${t.to}}$ : $\\begin{pmatrix} ${tex(t.u[0])} \\\\ ${tex(t.u[1])} \\end{pmatrix}$ — ${KIND[t.kind]}`}</MathText>
                  : <MathText>{`$${t.point}(${tex(t.at[0])}\\,;\\,${tex(t.at[1])})$ — ${KIND[t.kind]}`}</MathText>}
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
      moduleTitle="نشاط 2 — بوابات الخريطة"
      moduleSubtitle="مركبتا شعاع علمت إحداثيات مبدئه ونهايته: هل نحتاج إلى العدّ؟"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 140',
        headline: 'بوابات في لعبة الهاتف!',
        emoji: '🎮',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <GameMapVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY_LINES.source} /></p>
            <p className="text-sm text-slate-600">في المستوى «متقدم» (نشاط 2): اكتب رمز البوابة CD قبل القفزة، ضع البوابة E، ثم افتح CF. في المستوى «مبتدئ»: بوابتان A و B، ثم البوابة D.</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="الخريطة مزوّدة بمعلم: إحداثيتا كل بوابة مكتوبتان بجانبها، والبطل يقفز بالرمز الذي تكتبه."
          levels={{
            beginner: () => (
              <Manipulation
                type="component-calc"
                level="beginner"
                {...LAB.beginner.numbers}
                theme="game-map"
                title="بوابات الخريطة: رمز AB ثم البوابة D"
              />
            ),
            advanced: () => (
              <Manipulation
                type="component-calc"
                level="advanced"
                {...LAB.advanced.numbers}
                theme="game-map"
                title="نشاط 2: بوابات C و D و E و F"
                lead={<MathText>{'$C(3\\,;\\,1)$ و $D(2\\,;\\,-5)$ و $F(6\\,;\\,5)$ ، والبوابة E مجهولة: مركبتا $\\overrightarrow{DE}$ هما 3 و 4.'}</MathText>}
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'نشاط 2 أ: النقطتان C و D', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={`${ACTIVITY.intro} ${ACTIVITY.partA}`} source={ACTIVITY.source} compact />
              <GeoFigure {...FIG_ACT2} />
              <TapQuestion
                prompt="إحداثيتا C و D على الشكل:"
                options={[
                  '$C(3\\,;\\,1)$ و $D(2\\,;\\,-5)$',
                  '$C(1\\,;\\,3)$ و $D(-5\\,;\\,2)$', // l'ordre (x ; y) inversé : MISC-MAALAM-TABDIL-X-Y
                  '$C(3\\,;\\,1)$ و $D(2\\,;\\,5)$', // le signe sous l'axe des abscisses oublié : MISC-MAALAM-ISHARA
                ].map(M)}
                correct={0}
                cols={1}
                requires={['qiraat-murakkibatayn']}
                explain={<MathText>{`${ACTIVITY_LINES.read} الفاصلة أولا ثم الترتيب، و D تحت محور الفواصل فترتيبها سالب.`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'نشاط 2 أ: رمز البوابة CD', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              {evidence}
              <TapQuestion
                prompt={<MathText>{'ما هما مركبتا الشعاع $\\overrightarrow{CD}$ ؟'}</MathText>}
                options={[
                  '$\\overrightarrow{CD}\\begin{pmatrix} -1 \\\\ -6 \\end{pmatrix}$',
                  '$\\overrightarrow{CD}\\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$', // C − D : la soustraction à l'envers (MISC-MAALAM-TARH-MAQLUB)
                  '$\\overrightarrow{CD}\\begin{pmatrix} 2 \\\\ -5 \\end{pmatrix}$', // les coordonnées de D (MISC-MAALAM-IHDATHIYAT-MURAKKIBAT)
                  '$\\overrightarrow{CD}\\begin{pmatrix} 1 \\\\ -6 \\end{pmatrix}$', // un signe oublié (MISC-MAALAM-ISHARA)
                ].map(M)}
                correct={0}
                cols={2}
                requires={['qiraat-murakkibatayn', 'tarh-nisbi']}
                explain={<MathText>{ACTIVITY_LINES.cd}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'نشاط 2 أ: البوابة E', subtitle: 'السؤال 3', done: q3,
          content: (
            <div className="space-y-3">
              <PairQuestion
                prompt={<MathText>{'مركبتا $\\overrightarrow{DE}$ هما 3 و 4. إحداثيتا النقطة E:'}</MathText>}
                expected={{ x: '5', y: '-1' }}
                explain={ACTIVITY_LINES.e}
                requires={['qiraat-murakkibatayn', 'tarh-nisbi']}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'نشاط 2 ب: القاعدة', subtitle: 'السؤال 1', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.partB} source={ACTIVITY.source} compact />
              <TapQuestion
                prompt={<MathText>{'عبّر عن $a$ و $b$ ، مركبتي $\\overrightarrow{AB}$ :'}</MathText>}
                options={[
                  '$a = x_B - x_A$ و $b = y_B - y_A$',
                  '$a = x_A - x_B$ و $b = y_A - y_B$', // la soustraction à l'envers : le héros saute dans le sens contraire
                  '$a = x_B$ و $b = y_B$', // seulement quand A = O
                ].map(M)}
                correct={0}
                cols={1}
                requires={['qiraat-murakkibatayn', 'tarh-nisbi']}
                explain={<MathText>{`${ACTIVITY_LINES.ab} وهذا ما فتح كل بوابة: $x_D - x_C = -1$ و $y_D - y_C = -6$ .`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="farq-ihdathiyat" lead="ما وجدته على الخريطة، بكلمات النشاط:" />}
            </div>
          ),
        },
        {
          num: 5, title: 'نشاط 2 ب: البوابتان التوأمان', subtitle: 'السؤال 2', done: q5,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'$F(6\\,;\\,5)$ . الشعاع $\\overrightarrow{CF}$ والشعاع $\\overrightarrow{DE}$ :'}</MathText>}
                options={[
                  '$\\overrightarrow{CF}\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$ : نفس مركبتي $\\overrightarrow{DE}$ ، إذن $\\overrightarrow{DE} = \\overrightarrow{CF}$',
                  '$\\overrightarrow{CF}\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$ ، لكن الشعاعين غير متساويين لأن مبدأيهما مختلفان', // deux vecteurs égaux peuvent avoir des origines différentes
                  '$\\overrightarrow{CF}\\begin{pmatrix} 6 \\\\ 5 \\end{pmatrix}$ : إحداثيتا F', // MISC-MAALAM-IHDATHIYAT-MURAKKIBAT
                ].map(M)}
                correct={0}
                cols={1}
                requires={['farq-ihdathiyat']}
                explain={<MathText>{`${ACTIVITY_LINES.cf} نقول إن الشعاعين متساويان: $\\overrightarrow{DE} = \\overrightarrow{CF}$ .`}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && (
                <>
                  <GeoFigure {...FIG_ACT2_SOLVED} />
                  <Feedback tone="ok">كما على الخريطة: بوابتان من موضعين مختلفين، ورمز واحد — شعاعان متساويان، والرباعي DEFC متوازي أضلاع.</Feedback>
                </>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
