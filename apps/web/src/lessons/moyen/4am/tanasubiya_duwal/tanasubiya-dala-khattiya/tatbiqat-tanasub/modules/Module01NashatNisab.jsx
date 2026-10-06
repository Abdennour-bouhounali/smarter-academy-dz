import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { parseDec } from '@smarter-academy/core';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACT5_ANSWERS, LAB } from '../content/textbook';
import SoldesVignette from '../components/SoldesVignette';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';

/**
 * Module 1 — نشاط 5 (p. 67) « استعمال النسبة المئوية », ouvert sur L'ÉTIQUETTE QU'ON ÉTIRE
 * (percent-tag).
 *
 * REAL → la vitrine des soldes : le prix d'une paire de baskets est une barre. MANIPULATE → le
 * laboratoire à deux niveaux, UN instrument, même objectif (un changement en % est une
 * multiplication) :
 *   مبتدئ (ouvert par défaut : c'est le نشاط 5 السؤال 3) : +5 % sur 1200 DA — la barre « بعد »
 *          multipliée par 1,05, la barre additive « 1200 + 5 » refusée, deux articles au même
 *          t % (y / x constant) ;
 *   متقدم : le réservoir des طرائق (−30 % puis +15 %), parié puis construit.
 * UNDERSTAND → les questions 1 et 2 du نشاط (le pourcentage de filles, la baisse de consommation)
 * posent « prendre t % » et « diminuer de t % » ; la question 3 se répond avec, au-dessus, les
 * PROPRES essais de l'élève dans la vitrine (`[data-activity-evidence]`) ; TOUCH THE MATH → les
 * briques nisba-akhdh, takhfid-darb, ziyada-darb, dala-murfaqa ; TRANSFER → −20 % puis +20 %.
 * AUCUNE étape n'attend `onFinished`. LP : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01NashatNisab() {
  const [mine, setMine] = useState(null);
  const [tank, setTank] = useState(null);
  const [q1a, setQ1a] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const tried5 = mine?.trials?.filter((tr) => tr.s === 5) ?? [];
  const evidencePrice = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={tried5.length > 0 ? 'true' : 'false'}>
      {!mine || mine.trials.length === 0 ? (
        <p className="text-slate-500">لم تمدّد بطاقة السعر بعد (المستوى المبتدئ، في الأعلى).</p>
      ) : (
        <ul className="space-y-1" data-evidence="trials">
          <li className="text-xs text-slate-500">ما جرّبته في الواجهة:</li>
          {mine.trials.slice(-4).map((tr) => (
            <li key={`${tr.id}:${tr.s}`} dir="ltr" className="text-start"><MathText>{`$${tr.tex}$`}</MathText></li>
          ))}
          {mine.additive.slice(-2).map((tr) => (
            <li key={`a${tr.id}:${tr.s}`} className="text-amber-800">
              بالإضافة: <bdi dir="ltr"><MathText>{`$${tr.tex}$`}</MathText></bdi>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  const evidenceTable = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="table" data-rows={mine?.table?.length ?? 0}>
      {!mine || mine.table.length < 2 ? (
        <p className="text-slate-500">في الواجهة، طبّق زيادة 5% على قطعتين على الأقل، ثم اقرأ جدولك.</p>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-slate-500"><th className="text-start font-semibold">جدولك</th><th><bdi dir="ltr">x</bdi></th><th><bdi dir="ltr">y</bdi></th><th><bdi dir="ltr">y ÷ x</bdi></th></tr></thead>
          <tbody>
            {mine.table.map((r) => (
              <tr key={r.id}><td className="text-xs text-slate-600">{{ sneakers: 'حذاء رياضي', jersey: 'قميص المنتخب', cap: 'قبعة' }[r.id]}</td>
                <td className="text-center"><bdi dir="ltr">{r.x}</bdi></td><td className="text-center"><bdi dir="ltr">{r.y}</bdi></td><td className="text-center font-bold text-indigo-800"><bdi dir="ltr">{r.ratio}</bdi></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  const tankChain = tank?.chains?.find((c) => c.steps.length === 2 && c.steps[0] === -c.steps[1]);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 5 — النسب المئوية"
      moduleSubtitle="نمدّد بطاقة السعر"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 67',
        headline: 'تخفيضات وزيادات في المركز التجاري!',
        emoji: '🏷️',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <SoldesVignette />,
        body: (
          <div className="space-y-2">
            <p>سعر حذائك الرياضي المفضّل على البطاقة. التاجر يرفع السعر أو يخفّضه «بنسبة مئوية»: هل يضيف عددًا إلى السعر، أم يفعل شيئًا آخر؟</p>
            <p className="text-sm text-slate-600"><MathText>{'في الأسفل: مدّد بطاقة السعر بزيادة 5% على 1200DA (السؤال 3 من النشاط)، وجرّب أيضًا «إضافة 5» بدل النسبة، وطبّق النسبة نفسها على قطعة أخرى.'}</MathText></p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="الفكرة نفسها في المستويين: تغيّر مقدار بنسبة مئوية ضرب في عدد، لا إضافة."
          levels={{
            beginner: () => (
              <Manipulation
                type="percent-tag"
                level="beginner"
                {...LAB.beginner}
                title="نشاط 5: زيادة 5% على 1200DA"
                lead="اختر «زيادة» ومدّد الشريط حتى +5%، ثم جرّب «أضف 5» وطبّق النسبة على قطعة أخرى."
                onTrial={setMine}
              />
            ),
            advanced: () => (
              <Manipulation
                type="percent-tag"
                level="advanced"
                {...LAB.advanced}
                title="الخزان: نفرغ 30% ثم نضيف 15%"
                lead="راهن أولًا على التغيّر الكلي للحجم، ثم ابنِ التغيّرين: هل يصدق رهانك؟"
                onTrial={setTank}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'النسبة المئوية للبنات', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.questions[0]} source={ACTIVITY.source} compact>
                <table className="w-full text-center text-sm" data-act5-table>
                  <thead>
                    <tr className="text-xs text-slate-600"><th className="text-start">المستوى</th>{ACTIVITY.table.levels.map((l) => <th key={l} className="font-semibold">{l}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td className="text-start text-xs text-slate-600">عدد التلاميذ</td>{ACTIVITY.table.pupils.map((n, i) => <td key={i}><bdi dir="ltr">{n}</bdi></td>)}</tr>
                    <tr><td className="text-start text-xs text-slate-600">النسبة المئوية للبنات</td>{ACTIVITY.table.girlsPercent.map((p, i) => <td key={i}><bdi dir="ltr">{p}%</bdi></td>)}</tr>
                  </tbody>
                </table>
              </TextbookBox>
              <NumericQuestion
                prompt="عدد البنات في هذه المتوسطة:"
                expected={205}
                parse={parseDec}
                requires={['akhdh-nisba-miawiya']}
                explain={<MathText>{ACT5_ANSWERS.girls}</MathText>}
                onAnswered={() => setQ1a(true)}
              />
              {q1a && (
                <TapQuestion
                  prompt="النسبة المئوية للبنات في المتوسطة:"
                  options={[M('$\\dfrac{205}{375} \\times 100 \\simeq 54{,}67\\%$'), M('$\\dfrac{50 + 40 + 60 + 70}{4} = 55\\%$'), M('$50 + 40 + 60 + 70 = 220\\%$')]}
                  correct={0}
                  cols={1}
                  requires={['akhdh-nisba-miawiya']}
                  explain={<MathText>{ACT5_ANSWERS.girlsPercent}</MathText>}
                  onAnswered={() => setQ1(true)}
                />
              )}
              {q1 && <KnowledgeBrick id="nisba-akhdh" lead="حسبت عدد البنات في كل مستوى بأخذ نسبة من عدد تلاميذه:" />}
            </div>
          ),
        },
        {
          num: 2, title: 'انخفاض الاستهلاك', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.questions[1]} source={ACTIVITY.source} compact />
              <TapQuestion
                prompt="هذا الانخفاض بنسبة مئوية:"
                options={[M('حوالي $8{,}96\\%$ ، لأنّ $\\dfrac{0{,}6}{6{,}7} \\times 100 \\simeq 8{,}96$'), M('$0{,}6\\%$ ، لأنّ $6{,}7 - 6{,}1 = 0{,}6$'), M('حوالي $9{,}84\\%$ ، لأنّ $\\dfrac{0{,}6}{6{,}1} \\times 100 \\simeq 9{,}84$')]}
                correct={0}
                cols={1}
                requires={['nisba-akhdh']}
                explain={<MathText>{'الانخفاض $6{,}7 - 6{,}1 = 0{,}6L$ من أصل $6{,}7L$ : $\\dfrac{0{,}6}{6{,}7} \\times 100 \\simeq 8{,}96$ ، أي انخفاض بحوالي $8{,}96\\%$ . الفرق $0{,}6L$ ليس نسبة مئوية، والنسبة تُحسب من الاستهلاك قبل الانخفاض ( $6{,}7L$ ) لا بعده.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="takhfid-darb" lead="الاستهلاك الجديد هو القديم مضروبًا في عدد أصغر من 1:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'السعر بعد الزيادة', subtitle: 'السؤال 3 أ — مدّد بطاقة السعر في المستوى المبتدئ، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY.questions[2]} source={ACTIVITY.source} compact />
              {evidencePrice}
              <NumericQuestion
                prompt="أ) سعر المنتوج بعد زيادة 5% (بالدينار):"
                expected={1260}
                parse={parseDec}
                requires={['nisba-akhdh']}
                explainFor={(n) => (n === 1205
                  ? <MathText>{'أضفت 5 دنانير: $1200 + 5 = 1205$ . الزيادة 5% من 1200، أي $1200 \\times \\dfrac{5}{100} = 60$ ، والسعر $1260$ .'}</MathText>
                  : <MathText>{ACT5_ANSWERS.price}</MathText>)}
                explain={<MathText>{ACT5_ANSWERS.price}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="ziyada-darb" lead="ما فعله الشريط الملوّن: لم يُضف 5، بل ضرب في 1,05:" />}
            </div>
          ),
        },
        {
          num: 4, title: 'السعر y بدلالة السعر x', subtitle: 'السؤال 3 ب', done: q4,
          content: (
            <div className="space-y-3">
              {evidenceTable}
              <TapQuestion
                prompt={<MathText>{'ب) السعر $y$ للمنتوج بعد الزيادة بدلالة السعر $x$ قبل الزيادة:'}</MathText>}
                options={[M('$y = 1{,}05x$'), M('$y = x + 5$'), M('$y = x + 60$'), M('$y = 0{,}05x$')]}
                correct={0}
                cols={2}
                requires={['ziyada-darb']}
                explain={<MathText>{`السعر بعد الزيادة هو السعر قبلها مضروبًا في $1 + \\dfrac{5}{100} = 1{,}05$ : $y = 1{,}05x$ . أمّا $y = x + 60$ فلا تصحّ إلا لسعر 1200DA (لقميص بـ 3000DA تكون الزيادة 150DA)، و $y = 0{,}05x$ هي مقدار الزيادة وحده.`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="dala-murfaqa" lead="في جدولك حاصل القسمة نفسه لكل القطع:" />}
            </div>
          ),
        },
        {
          num: 5, title: 'تخفيض ثم زيادة بالنسبة نفسها', subtitle: 'نحو الطرائق — جرّب الخزان في المستوى المتقدّم', done: q5,
          content: (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="tank" data-tried={tankChain ? 'true' : 'false'}>
                {tankChain ? (
                  <p>سلسلتك في الخزان: <bdi dir="ltr"><MathText>{`$${tankChain.k}$`}</MathText></bdi> — التغيّر الكلي <bdi dir="ltr"><MathText>{`$${tankChain.net}$`}</MathText></bdi></p>
                ) : <p className="text-slate-500">في المستوى المتقدّم يمكنك أن تبني بنفسك تخفيضًا ثم زيادة بالنسبة نفسها، وترى أين يصل الماء.</p>}
              </div>
              <TapQuestion
                prompt={<MathText>{'حذاء سعره 1000DA خُفّض سعره بـ 20% ، ثم زِيد السعر الجديد بـ 20% . سعره الآن:'}</MathText>}
                options={[M('$960DA$'), M('$1000DA$'), M('$1040DA$')]}
                correct={0}
                cols={3}
                requires={['takhfid-darb', 'ziyada-darb']}
                explain={<MathText>{'$1000 \\times 0{,}8 = 800$ ، ثم $800 \\times 1{,}2 = 960$ : الزيادة 20% تُحسب من 800 لا من 1000، فلا نعود إلى السعر الأول.'}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
