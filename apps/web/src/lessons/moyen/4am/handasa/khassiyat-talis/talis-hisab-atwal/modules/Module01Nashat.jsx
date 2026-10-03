import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import GeoFigure from '../../../../../../common/components/GeoFigure';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, CINEMA } from '../content/textbook';
import { FIG_ACT1_CASE1, FIG_ACT1_CASE2 } from '../content/figures';
import CinemaVignette from '../components/CinemaVignette';

/**
 * Module 1 — نشاط 1 (p. 104) « خاصية طالس », ouvert sur LE FAISCEAU (thales-beam).
 *
 * REAL / DISCOVER / MANIPULATE  le lab à deux niveaux, même objectif :
 *   متقدم (ouvert par défaut : le نشاط 1) : AB = 6, AC = 7, BC = 6,1, l'écran à placer à AB′ = 3,2, puis poussé à
 *          travers A (la chambre noire, la حالة الثانية) ;
 *   مبتدئ : la projection du quartier, AB = 4, AC = 5, BC = 3, graduations entières.
 * UNDERSTAND  les questions de la حالة الأولى et de la حالة الثانية, sous les arrêts jugés de l'élève (`onTrial`,
 *           `[data-activity-evidence]`) ; la حالة الثانية garde les nombres du manuel (AB = 3,2 …, k = 1/2).
 * FORMALIZE  le texte du نشاط complété (س 3) puis la brique talis-nashat : « يسمى هذا النص خاصية طالس ».
 * AUCUNE étape n'attend `onFinished`. LP : P1 (س 1, 3), P2 (les longueurs).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const near = (target, tol = 0.01) => (x) => Number.isFinite(x) && Math.abs(x - target) <= tol;

export default function Module01Nashat() {
  const [stops, setStops] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3b, setQ3b] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  const onTrial = (ev) => setStops((s) => [...s, ev].slice(-10));
  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={stops.length ? 'true' : 'false'}>
      {stops.length === 0 ? (
        <p className="text-slate-500">لم تسجّل بعد أي موضع للشاشة (المستوى المتقدم: AB = 6 ، AC = 7).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">مواضع الشاشة التي سجّلتها:</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="stops">
            {stops.map((s) => (
              <li key={s.n} className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${s.equal ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-800'}`} data-evidence-stop={s.n}>
                <MathText>{`$AB' = ${s.ABp}$ ، $AC' ${s.ACexact ? '\\approx' : '='} ${s.ACp}$`}</MathText>
                {' — '}
                {s.equal ? <MathText>{`النسب متساوية: $k = ${s.kTex}$`}</MathText> : 'الشاشة مائلة: النسب مختلفة'}
                {s.butterfly ? ' (الجهة الأخرى)' : ''}
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
      moduleTitle="نشاط 1 — الشاشة في الحزمة"
      moduleSubtitle="شاشة موازية للشاشة الكبيرة: ماذا يحدث للأطوال؟"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 104',
        headline: 'عرض سينمائي في الحي الليلة!',
        emoji: '🎬',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <CinemaVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">{ACTIVITY.situation} <SourceTag source={ACTIVITY_LINES.source} /></p>
            <p className="text-sm text-slate-600">قبل أسئلة النشاط: اسحب الشاشة على الحزمة، سجّل مواضعها واحكم في كل مرة: هل النسب الثلاث متساوية؟ ثم أمِل الشاشة، وفي المستوى المتقدم ادفعها عبر A.</p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="في المستويين: جهاز الإسقاط في A، والشاشة الكبيرة (BC)، وشاشة متنقلة (B′C′) تمسكها بمقبضين: B′ يحرّكها على الحزمة، و C′ يميلها."
          levels={{
            beginner: () => (
              <Manipulation
                type="thales-beam"
                level="beginner"
                {...CINEMA.numbers}
                theme="cinema"
                title="عرض في الحي: شاشة في الحزمة"
                lead="AB = 4 و AC = 5 و BC = 3 بالمتر. الشاشة تتوقف عند كل متر."
              />
            ),
            advanced: () => (
              <Manipulation
                type="thales-beam"
                level="advanced"
                {...ACTIVITY.numbers}
                mode="projector|butterfly"
                theme="cinema"
                title="نشاط 1: AB = 6 ، AC = 7 ، AB′ = 3,2"
                lead="أطوال الكتاب بالسنتيمتر. ضع الشاشة عند العلامة 3,2، ثم جرّب مواضع أخرى، أمِلها، وادفعها عبر A."
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'الحالة الأولى: النسب', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.case1} source={ACTIVITY.source} compact />
              <GeoFigure {...FIG_ACT1_CASE1} />
              {evidence}
              <TapQuestion
                prompt={<MathText>{'أتمم: $\\dfrac{AB\'}{AB} = \\dfrac{\\ldots}{\\ldots} = \\dfrac{\\ldots}{\\ldots}$'}</MathText>}
                options={[
                  "$\\dfrac{AB'}{AB} = \\dfrac{AC'}{AC} = \\dfrac{B'C'}{BC}$",
                  "$\\dfrac{AB'}{AB} = \\dfrac{AC'}{C'C} = \\dfrac{B'C'}{BC}$",
                  "$\\dfrac{AB'}{AB} = \\dfrac{AC}{AC'} = \\dfrac{BC}{B'C'}$",
                ].map(M)}
                correct={0}
                cols={1}
                requires={['jadwal-tanasub']}
                explain={<MathText>{'في كل نسبة: طول من المثلث الصغير $AB\'C\'$ على الطول الموافق له في المثلث الكبير $ABC$ . ($C\'C$ قطعة وليست ضلعا للمثلث، والنسبتان المقلوبتان لا تساويان $\\dfrac{AB\'}{AB}$ .)'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'الحالة الأولى: الحساب', subtitle: 'AC′ و B′C′', done: q2,
          content: (
            <div className="space-y-3">
              {ACTIVITY.case1Numeric.map((l) => <p key={l} className="text-sm text-slate-800"><MathText>{l}</MathText></p>)}
              {evidence}
              <NumericQuestion
                prompt={<MathText>{'$AC\'$ بالسنتيمتر (القيمة المدوّرة إلى الجزء من 100):'}</MathText>}
                expected={near(56 / 15)}
                parse={parseDec}
                display="56/15 ≈ 3,73"
                requires={['rabi-mutanasib']}
                explain={<MathText>{ACTIVITY_LINES.case1AC}</MathText>}
                explainFor={(n) => <MathText>{near(6 * 3.2 / 7, 0.02)(n) ? `هذا $\\dfrac{6 \\times 3{,}2}{7}$ : النسبة مقلوبة. ${ACTIVITY_LINES.case1AC}` : ACTIVITY_LINES.case1AC}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <NumericQuestion
                  prompt={<MathText>{'$B\'C\'$ بالسنتيمتر (القيمة المدوّرة إلى الجزء من 100):'}</MathText>}
                  expected={near(244 / 75)}
                  parse={parseDec}
                  display="244/75 ≈ 3,25"
                  requires={['rabi-mutanasib']}
                  explain={<MathText>{ACTIVITY_LINES.case1BC}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'الحالة الثانية', subtitle: 'وضعية الفراشة', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.case2} source={ACTIVITY.source} compact />
              <GeoFigure {...FIG_ACT1_CASE2} />
              {evidence}
              <TapQuestion
                prompt={<MathText>{'ب) لماذا المستقيمان $(BC)$ و $(B\'\'C\'\')$ متوازيان؟'}</MathText>}
                options={[
                  "التناظر المركزي بالنسبة إلى A يحوّل $(B'C')$ إلى مستقيم يوازيه هو $(B''C'')$ ، و $(B'C') \\parallel (BC)$",
                  "لأن $AB'' = AC''$",
                  "لأن B″ و C″ تقعان على الشاشة الكبيرة $(BC)$",
                ].map(M)}
                correct={0}
                cols={1}
                requires={['mustaqim-muntasafayn']}
                explain={<MathText>{ACTIVITY_LINES.case2Sym}</MathText>}
                onAnswered={() => setQ3a(true)}
              />
              {q3a && (
                <>
                  {ACTIVITY.case2Numeric.map((l) => <p key={l} className="text-sm text-slate-800"><MathText>{l}</MathText></p>)}
                  <NumericQuestion
                    prompt={<MathText>{'$AC\'$ بالسنتيمتر:'}</MathText>}
                    expected={near(2.25, 0.001)}
                    parse={parseDec}
                    display="2,25"
                    requires={['rabi-mutanasib']}
                    explain={<MathText>{ACTIVITY_LINES.case2AC}</MathText>}
                    onAnswered={() => setQ3b(true)}
                  />
                </>
              )}
              {q3b && (
                <NumericQuestion
                  prompt={<MathText>{'استنتج $B\'C\'$ بالسنتيمتر:'}</MathText>}
                  expected={near(1.5, 0.001)}
                  parse={parseDec}
                  display="1,5"
                  requires={['rabi-mutanasib']}
                  explain={<MathText>{ACTIVITY_LINES.case2BC}</MathText>}
                  onAnswered={() => setQ3(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 4, title: 'نص خاصية طالس', subtitle: 'السؤال 3', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.part3} source={ACTIVITY.source} compact />
              <TapQuestion
                prompt="النص المكتمل هو:"
                options={[
                  "إذا كان $(BC)$ و $(B'C')$ متوازيين فإن $\\dfrac{AB'}{AB} = \\dfrac{AC'}{AC} = \\dfrac{B'C'}{BC}$",
                  "إذا كان $(BC)$ و $(B'C')$ متوازيين فإن $\\dfrac{AB'}{B'B} = \\dfrac{AC'}{C'C} = \\dfrac{B'C'}{BC}$",
                  "إذا كان $(BC)$ و $(B'C')$ متوازيين فإن $AB - AB' = AC - AC'$",
                ].map(M)}
                correct={0}
                cols={1}
                requires={['jadwal-tanasub']}
                explain={<MathText>{'في الحالة الأولى $\\dfrac{3{,}2}{6} = \\dfrac{8}{15}$ لكن $\\dfrac{3{,}2}{2{,}8} = \\dfrac{8}{7}$ ، و $6 - 3{,}2 = 2{,}8$ بينما $7 - \\dfrac{56}{15} = \\dfrac{49}{15}$ : الأطوال تُضرب في العدد نفسه ولا يُطرح منها العدد نفسه.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="talis-nashat" lead="ما وجدته بالشاشة وبالحساب، في الحالتين:" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
