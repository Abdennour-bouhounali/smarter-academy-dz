import React, { useState } from 'react';
import { squareRoots } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, CHALLENGE, ICT_CONSTRUCT } from '../content/textbook';
import { TriangleABC, RootSpiral } from '../components/RootFigures';

const { squareOf, squareOfDecimal, exactDecimal } = squareRoots;

/**
 * Module 1 — نشاط 1 (p. 20) : « الجذر التربيعي لعدد موجب », ouvert par le تحدّ
 * de la page 19 (le côté d'une base carrée d'aire 20).
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT (square-root-side, mode refine) :
 *   متقدم (ouvert par défaut — c'est l'activité du livre) : le carré d'aire 5
 *          construit sur BC. L'élève étire le côté ; aucune graduation ne tombe
 *          juste ; il ENCADRE lui-même le côté avant chaque loupe (1 → 0,1 →
 *          0,01 → 0,001) — c'est sa preuve pour répondre à إيمان.
 *   مبتدئ  : le carré d'aire 36 (question 3 du livre) : le côté tombe sur 6.
 *
 * LES ÉTAPES sont les questions du livre, dans son ordre : BC² (Pythagore),
 * « BC هو العدد الموجب الذي مربعه … », la calculatrice et إيمان — répondue
 * depuis les ESSAIS DE L'ÉLÈVE listés au-dessus (`[data-activity-evidence]`),
 * jamais depuis les options —, l'encadré « نرمز بـ √5 … » (brique
 * `qima-mudbuta`), la définition (brique `jidhr-taarif`) puis les questions 3
 * et 4, la spirale de la p. 30 et le retour au تحدّ. LP : P1, P2.
 */
const AREA_5 = '5/1';
const LADDER = [1, 10, 100, 1000];
const digitsOf = (scale) => Math.round(Math.log10(scale));
const side = (v, scale) => exactDecimal(v, digitsOf(scale)).replace(',', '{,}');
const sq = (v, scale) => squareOf(v, scale).decimal.replace(',', '{,}');
const texNum = (s) => s.replace(',', '{,}');

export default function Module01Nashat() {
  // Les essais VALIDÉS au carré d'aire 5 : { [scale]: { below, above, exact } } en unités de 1/scale.
  const [trials, setTrials] = useState({});
  const [squared, setSquared] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5a, setQ5a] = useState(false);
  const [q5, setQ5] = useState(false);
  const [q6, setQ6] = useState(false);
  const [q7a, setQ7a] = useState(false);
  const [q7, setQ7] = useState(false);
  const { ab, ac, calculator, q3: roots3, q4: roots4 } = ACTIVITY.numbers;

  const onTrial = ({ area, side: v, scale, cmp }) => {
    if (`${area.num}/${area.den}` !== AREA_5) return;
    setTrials((t) => {
      const c = t[scale] ?? { below: null, above: null, exact: null };
      return {
        ...t,
        [scale]: {
          below: cmp < 0 ? Math.max(c.below ?? -Infinity, v) : c.below,
          above: cmp > 0 ? Math.min(c.above ?? Infinity, v) : c.above,
          exact: cmp === 0 ? v : c.exact,
        },
      };
    });
  };
  const tight = (c) => c && c.below != null && c.above != null && c.above - c.below === 1;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — الوتر BC ومربّعه 5"
      moduleSubtitle="العدد الموجب الذي مربّعه 5"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'تحدّ ص 19 — أنشطة ص 20',
        headline: 'خزان ماء قاعدته مربعة',
        emoji: '🚜',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-2">
            <p className="rounded-lg bg-amber-50 px-2 py-1"><MathText>{CHALLENGE.text}</MathText> <SourceTag source={CHALLENGE.source} /></p>
            <p>قبل الخزان، مثلث صغير من الكتاب: {ACTIVITY.text}</p>
            <TriangleABC ab={ab} ac={ac} caption={ACTIVITY.figure} />
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="المستوى المتقدّم هو النشاط: مربّع مساحته 5. في المستوى المبتدئ مربّع مساحته 36."
          levels={{
            beginner: () => (
              <Manipulation
                type="square-root-side"
                level="beginner"
                mode="refine"
                num={36}
                den={1}
                scale={10}
                lead="اسحب طرف الضلع حتى تساوي مساحة المربّع 36 بالضبط."
              />
            ),
            advanced: () => (
              <Manipulation
                type="square-root-side"
                level="advanced"
                mode="refine"
                num={5}
                den={1}
                scale={1000}
                calculator={calculator}
                figure="bc-square"
                lead="اسحب طرف الضلع: هل تجد طولًا مساحة مربّعه 5 بالضبط؟ إن لم تجده، احصره بين تدريجتين متجاورتين ثم دقّق."
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'خاصية فيثاغورس في المثلث ABC', subtitle: 'السؤال 1 أ', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <NumericQuestion
                prompt={<MathText>{'$BC^2 = \\ldots$'}</MathText>}
                expected={ab * ab + ac * ac}
                requires={['khassiyat-fithaghuras']}
                explain={<MathText>{`المثلث قائم في A: $BC^2 = AB^2 + AC^2 = ${ab}^2 + ${ac}^2 = ${ab * ab} + ${ac * ac} = ${ab * ab + ac * ac}$.`}</MathText>}
                explainFor={(n) => (n === ab + ac
                  ? <MathText>{`جمعتَ الطولين ${ab} و ${ac}: خاصية فيثاغورس تجمع مربّعيهما: $${ab}^2 + ${ac}^2 = ${ab * ab + ac * ac}$.`}</MathText>
                  : <MathText>{`$BC^2 = AB^2 + AC^2 = ${ab}^2 + ${ac}^2 = ${ab * ab + ac * ac}$.`}</MathText>)}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'الطول BC هو العدد الموجب الذي مربعه ...', subtitle: 'السؤال 1 ب', done: q2,
          content: (
            <TapQuestion
              prompt={<MathText>{ACTIVITY.questions[1]}</MathText>}
              options={['10', '25', '2,5', '5']}
              correct={3}
              cols={2}
              requires={['khassiyat-fithaghuras', 'murabba-adad']}
              explain={<MathText>{`$BC^2 = ${ab * ab + ac * ac}$، والطول عدد موجب: BC هو العدد الموجب الذي مربعه 5 — ضلع المربّع الذي مساحته 5 في المستوى المتقدّم.`}</MathText>}
              onAnswered={() => setQ2(true)}
            />
          ),
        },
        {
          num: 3, title: 'الحاسبة، وقول إيمان', subtitle: 'السؤال 2 — احصر الضلع في المستوى المتقدّم، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              {/* LES PREUVES DE L'ÉLÈVE : ses encadrements du côté, graduation par
                  graduation — rien de ce qu'il n'a pas essayé. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {LADDER.map((scale) => {
                  const c = trials[scale];
                  const label = scale === 1 ? '1' : exactDecimal(1, digitsOf(scale));
                  if (c?.exact != null) {
                    return <li key={scale} data-evidence={scale} data-tried="true" className="font-bold text-slate-800"><MathText>{`$${side(c.exact, scale)}^2 = ${sq(c.exact, scale)}$`}</MathText></li>;
                  }
                  return tight(c) ? (
                    <li key={scale} data-evidence={scale} data-tried="true" className="font-bold text-slate-800">
                      <span dir="ltr"><MathText>{`$${side(c.below, scale)}^2 = ${sq(c.below, scale)} < 5 < ${sq(c.above, scale)} = ${side(c.above, scale)}^2$`}</MathText></span>
                    </li>
                  ) : (
                    <li key={scale} data-evidence={scale} data-tried="false" className="text-slate-500">
                      التدريجة <bdi dir="ltr">{label}</bdi>: لم تحصر الضلع بعد في المستوى المتقدّم.
                    </li>
                  );
                })}
              </ul>
              {!squared ? (
                <button type="button" onClick={() => setSquared(true)} data-square-calculator
                  className="min-h-[44px] rounded-xl border-2 border-sky-500 bg-white px-4 py-2 text-sm font-bold text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  🧮 ربّع القيمة التي تعرضها الحاسبة <bdi dir="ltr">{calculator}</bdi>
                </button>
              ) : (
                <p className="rounded-xl border-2 border-sky-200 bg-sky-50 px-3 py-2 text-sm" data-calculator-square>
                  <MathText>{`$${texNum(calculator)}^2 = ${texNum(squareOfDecimal(calculator))}$`}</MathText>
                </p>
              )}
              <TapQuestion
                prompt={<MathText>{ACTIVITY.questions[4]}</MathText>}
                options={[
                  'لا: القيمة التي تعرضها الحاسبة هي دائمًا القيمة المضبوطة',
                  'نعم: مربّع 2,236067978 لا يساوي 5 بالضبط',
                  'لا: مربّع 2,236067978 يساوي 5 بالضبط',
                  'نعم: لا يوجد أي طول مربّعه 5',
                ]}
                correct={1}
                cols={1}
                requires={['alat-hasiba-jidhr', 'murabba-adad']}
                explain={<MathText>{`$${texNum(calculator)}^2 = ${texNum(squareOfDecimal(calculator))}$ وهو ليس 5. والطول BC موجود (مربّعه 5 بخاصية فيثاغورس)، لكن الحاسبة لا تعرض إلا قيمة مقربة له.`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'القيمة المضبوطة والرمز، ثم الجذر التربيعي لكل عدد موجب', subtitle: 'السؤال 3: أعط الناتج ذهنيا', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qima-mudbuta" lead="ما وجدته له اسم ورمز في الكتاب:" />
              <KnowledgeBrick id="jidhr-taarif" lead="ونفس الفكرة لكل عدد موجب، لا للعدد 5 وحده:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[5]}</MathText></p>}
                rows={[
                  { id: 'r36', label: <MathText>{'$\\sqrt{36} = \\ldots$'}</MathText>, options: ['18', '6', '1296'], correct: 1, correction: <MathText>{'6 موجب و $6^2 = 36$'}</MathText> },
                  { id: 'r81', label: <MathText>{'$\\sqrt{81} = \\ldots$'}</MathText>, options: ['9', '40,5', '6561'], correct: 0, correction: <MathText>{'9 موجب و $9^2 = 81$'}</MathText> },
                  { id: 'r049', label: <MathText>{'$\\sqrt{0{,}49} = \\ldots$'}</MathText>, options: ['0,07', '0,245', '0,7'], correct: 2, correction: <MathText>{'0,7 موجب و $0{,}7^2 = 0{,}49$'}</MathText> },
                ]}
                requires={['jidhr-taarif']}
                feedback={({ allRight }) => (
                  <p className={`rounded-xl px-3 py-2 text-sm ${allRight ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                    <MathText>{`$\\sqrt{${roots3[0].num}} = 6$ ، $\\sqrt{${roots3[1].num}} = 9$ ، $\\sqrt{0{,}49} = 0{,}7$: في كل مرّة العدد الموجب الذي مربّعه العدد المعطى.`}</MathText>
                  </p>
                )}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'انقل وأتمم', subtitle: 'السؤال 4', done: q5,
          content: (
            <div className="space-y-4">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[6]}</MathText></p>}
                rows={[
                  { id: 'a2', label: <MathText>{`$\\sqrt{${roots4[0]}^2} = \\ldots$`}</MathText>, options: ['4', '2', <MathText key="s2">{'$\\sqrt{2}$'}</MathText>], correct: 1, correction: <MathText>{'$2^2 = 4$ و $\\sqrt{4} = 2$'}</MathText> },
                  { id: 'a3', label: <MathText>{`$\\sqrt{${roots4[1]}^2} = \\ldots$`}</MathText>, options: ['3', '9', '6'], correct: 0, correction: <MathText>{'$3^2 = 9$ و $\\sqrt{9} = 3$'}</MathText> },
                  { id: 'a5', label: <MathText>{`$\\sqrt{${roots4[2]}^2} = \\ldots$`}</MathText>, options: ['25', '10', '5'], correct: 2, correction: <MathText>{'$5^2 = 25$ و $\\sqrt{25} = 5$'}</MathText> },
                  { id: 'b5', label: <MathText>{'$(\\sqrt{5})^2 = \\ldots$'}</MathText>, options: ['5', '25', <bdi key="c" dir="ltr">{calculator}</bdi>], correct: 0, correction: <MathText>{'$\\sqrt{5}$ هو العدد الموجب الذي مربّعه 5'}</MathText> },
                ]}
                requires={['jidhr-taarif', 'qima-mudbuta']}
                feedback={({ allRight }) => (
                  <p className={`rounded-xl px-3 py-2 text-sm ${allRight ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                    <MathText>{'$\\sqrt{2^2} = 2$ ، $\\sqrt{3^2} = 3$ ، $\\sqrt{5^2} = 5$ ، $(\\sqrt{5})^2 = 5$.'}</MathText>
                  </p>
                )}
                onAnswered={() => setQ5a(true)}
              />
              {q5a && (
                <TapQuestion
                  prompt={<MathText>{ACTIVITY.questions[7]}</MathText>}
                  options={[
                    <MathText key="o1">{'$\\sqrt{a^2} = a^2$ و $(\\sqrt{a})^2 = \\sqrt{a}$'}</MathText>,
                    <MathText key="o2">{'$\\sqrt{a^2} = 2a$ و $(\\sqrt{a})^2 = 2a$'}</MathText>,
                    <MathText key="o3">{'$\\sqrt{a^2} = a$ و $(\\sqrt{a})^2 = a$'}</MathText>,
                    <MathText key="o4">{'$\\sqrt{a^2} = a$ و $(\\sqrt{a})^2 = a^2$'}</MathText>,
                  ]}
                  correct={2}
                  cols={1}
                  requires={['jidhr-taarif']}
                  explain={<MathText>{'$a$ موجب ومربّعه $a^2$: إذن $\\sqrt{a^2} = a$. و $\\sqrt{a}$ هو العدد الموجب الذي مربّعه $a$: إذن $(\\sqrt{a})^2 = a$ — كما في الأسطر الأربعة أعلاه.'}</MathText>}
                  onAnswered={() => setQ5(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 6, title: 'أوظّف تكنولوجيات الإعلام والاتصال (ص 30)', subtitle: 'قطعة مستقيم طولها جذر تربيعي', done: q6,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" title="إنشاء" lines={[ICT_CONSTRUCT.title, ...ICT_CONSTRUCT.steps]} source={ICT_CONSTRUCT.source} compact />
              <RootSpiral names={ICT_CONSTRUCT.points} caption="كل قطعة جديدة طولها 1 وعمودية على القطعة السابقة المرسومة من B." />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">لا نحتاج إلى البرمجية: خاصية فيثاغورس تكفي.</p>}
                rows={[
                  { id: 'bc', label: ICT_CONSTRUCT.questions[0], options: [<MathText key="s">{'$\\sqrt{2}$'}</MathText>, '2', <bdi key="d" dir="ltr">1,414213562</bdi>], correct: 0, correction: <MathText>{'$BC^2 = AB^2 + AC^2 = 1 + 1 = 2$ إذن $BC = \\sqrt{2}$'}</MathText> },
                  { id: 'bh', label: ICT_CONSTRUCT.questions[1], options: ['7', <MathText key="s6">{'$\\sqrt{6}$'}</MathText>, <MathText key="s7">{'$\\sqrt{7}$'}</MathText>], correct: 2, correction: <MathText>{'$BD^2 = 2 + 1 = 3$ ، $BE^2 = 4$ ، … ، $BH^2 = 6 + 1 = 7$ إذن $BH = \\sqrt{7}$'}</MathText> },
                ]}
                requires={['khassiyat-fithaghuras', 'jidhr-taarif', 'qima-mudbuta']}
                feedback={({ allRight }) => (
                  <p className={`rounded-xl px-3 py-2 text-sm ${allRight ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                    <MathText>{'في كل مثلث قائم يزيد مربّع الوتر بـ 1: $BC^2 = 2$ ، $BD^2 = 3$ ، … ، $BH^2 = 7$. القيم المضبوطة: $BC = \\sqrt{2}$ و $BH = \\sqrt{7}$؛ أما 1,414213562 فقيمة مقربة فقط.'}</MathText>
                  </p>
                )}
                onAnswered={() => setQ6(true)}
              />
            </div>
          ),
        },
        {
          num: 7, title: 'عودة إلى التحدّي: خزان الفلاح', subtitle: 'تحدّ — الكتاب ص 19', done: q7,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{CHALLENGE.text}</MathText></p>
              <NumericQuestion
                prompt={<span>حجم متوازي المستطيلات = مساحة القاعدة × الارتفاع. ما مساحة قاعدة الخزان (بالمتر المربع)؟</span>}
                expected={(CHALLENGE.numbers.volume * 10) / CHALLENGE.numbers.heightTenths}
                // La relation du volume est donnée dans l'énoncé même (juste à temps) : rien d'autre n'est supposé.
                requires={[]}
                explain={<MathText>{'$36 \\div 1{,}8 = 20$: مساحة القاعدة المربعة $20\\,m^2$.'}</MathText>}
                onAnswered={() => setQ7a(true)}
              />
              {q7a && (
              <TapQuestion
                prompt={<span>القاعدة مربّع مساحته <MathText>{'$20\\,m^2$'}</MathText>. ما هي القيمة المضبوطة لطول ضلعها؟</span>}
                options={[
                  <MathText key="a">{'$10\\,m$'}</MathText>,
                  <MathText key="b">{'$\\sqrt{20}\\,m$'}</MathText>,
                  <MathText key="c">{'$6\\,m$'}</MathText>,
                  <MathText key="d">{'$400\\,m$'}</MathText>,
                ]}
                correct={1}
                cols={2}
                requires={['jidhr-taarif', 'qima-mudbuta']}
                explain={<MathText>{'الضلع هو العدد الموجب الذي مربّعه 20: $\\sqrt{20}\\,m$. بالحاسبة يظهر 4,472135955، أي $447\\,cm$ مدوّرًا إلى 1cm كما يطلب التحدّي. أمّا 10 فنصف 20، و $6 = \\sqrt{36}$ ينسى الارتفاع.'}</MathText>}
                onAnswered={() => setQ7(true)}
              />
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
