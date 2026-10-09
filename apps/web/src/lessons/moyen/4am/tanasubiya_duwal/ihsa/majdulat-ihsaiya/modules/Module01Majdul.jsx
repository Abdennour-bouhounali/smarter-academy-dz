import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag, TextbookExercise } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { EX7, EX7_OUTLIER, EX7_RANGE_TRAP, LAB } from '../content/textbook';
import { byId } from '../content/exercises';
import { Dustur, SeriesRow } from '../components/Figures';

/**
 * Module 1 — تمرين 7 (p. 99, corrigé) « استعمال مجدول لحساب مؤشرات سلسلة », ouvert sur LE MAJDOUL (sheet-lab).
 *
 * REAL → une série d'un exercice et une feuille sur l'écran de la salle d'informatique. MANIPULATE → le
 * laboratoire à deux niveaux, même objectif (un دستور calcule sur une plage et se recalcule) :
 *   مبتدئ : cinq notes d'une mini-مسابقة, déjà saisies, deux دساتير (MAX-MIN, MOYENNE) ;
 *   متقدم (ouvert par défaut : c'est le تمرين 7) : saisir la série dans A1:G1, enregistrer, quatre دساتير
 *          après le calcul à la main, la valeur aberrante, puis l'étape « graphique » (ex-15, ex-16).
 * UNDERSTAND → أ) ب) à la main (le منوال défini par le livre), la plage A1:G1 (P1), le bon دستور avec les
 * PROPRES دساتير de l'élève au-dessus (`[data-activity-evidence]`), le recalcul avec ses propres
 * modifications. AUCUNE étape n'attend `onFinished`. LP : P1, P2.
 *
 * « أتوقّع القاعدة » : l'explication de la question de l'étape 4 ÉNONCE la règle `iadat-hisab` (la moyenne
 * bouge, la médiane reste, le nombre écrit à la main ne bouge pas) ; la question est donc enveloppée dans
 * <PredictRule id="iadat-hisab"> — l'élève écrit la règle d'après SA modification du lab avant de répondre.
 * La « مسألة الدرس » (ANCIENNE carte, retirée du module le 2026-10-09 — elle ne vit plus qu'au sommaire) ferme la dernière étape (les labs vivent dans `intro`) : une autre
 * série dans la ligne 1, les quatre دساتير en B2 ← B5, résolue au module 5.
 */
const D = (f) => <Dustur key={f}>{f}</Dustur>;

export default function Module01Majdul() {
  const [log, setLog] = useState({ commits: [], edits: [], typed: 0 });
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  const onTrial = (tr) => setLog((l) => {
    if (tr.kind === 'commit') return { ...l, commits: [...l.commits, tr] };
    if (tr.kind === 'edit') return { ...l, edits: [...l.edits, tr] };
    if (tr.kind === 'typed') return { ...l, typed: l.typed + 1 };
    return l;
  });

  const evidenceFormulas = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="formulas" data-tried={log.commits.length > 0 ? 'true' : 'false'}>
      {log.commits.length === 0 ? (
        <p className="text-slate-500">لم تحجز أيّ دستور بعد (المجدول في الأعلى، المستوى المتقدّم).</p>
      ) : (
        <ul className="space-y-1">
          <li className="text-xs text-slate-500">دساتيرك في المجدول:</li>
          {log.commits.slice(-5).map((c, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <span className={c.status === 'ok' ? 'text-emerald-700' : 'text-rose-700'}>{c.status === 'ok' ? '✓' : '✗'}</span>
              {D(c.formula)} <span>→ <bdi dir="ltr" className="font-mono">{c.value}</bdi></span>
              <span className="text-slate-500">باليد: <bdi dir="ltr" className="font-mono">{c.hand}</bdi></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  const lastEdit = log.edits[log.edits.length - 1];
  const evidenceEdit = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="edit" data-tried={lastEdit ? 'true' : 'false'}>
      {!lastEdit ? (
        <p className="text-slate-500">بعد التحقق من الدساتير الأربعة، غيّر قيمة في السطر 1 من المجدول وراقب العمود B.</p>
      ) : (
        <ul className="space-y-1">
          <li className="text-xs text-slate-500">آخر تعديل لك: <bdi dir="ltr" className="font-mono">{`${lastEdit.cell} = ${lastEdit.value}`}</bdi></li>
          {lastEdit.moved.map((m) => (
            <li key={m.kind}>{{ range: 'المدى', median: 'الوسيط', mean: 'المتوسط', mode: 'المنوال' }[m.kind]}: <bdi dir="ltr" className="font-mono">{m.was} → {m.value}</bdi> {m.moved ? '' : '(لم يتغيّر)'}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="تمرين 7 — المجدول"
      moduleSubtitle="نحسب باليد ثم نتأكّد بالمجدول"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'أوظّف تعلّماتي — الكتاب ص 99',
        headline: 'إلى قاعة الإعلام الآلي!',
        emoji: '💻',
        title: EX7.group,
        tone: 'emerald',
        body: (
          <div className="space-y-2">
            <p><MathText>{EX7.intro}</MathText></p>
            <SeriesRow values={EX7.series} />
            <ul className="space-y-1 text-sm">
              {EX7.questions.map((q) => <li key={q}><MathText>{q}</MathText></li>)}
              {EX7.steps.map((s) => <li key={s} className="ps-3"><MathText>{`• ${s}`}</MathText></li>)}
            </ul>
            <p className="text-xs text-slate-500" data-correction><MathText>{EX7.correctionNote}</MathText></p>
          </div>
        ),
        footer: <SourceTag source={EX7.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="الفكرة نفسها في المستويين: الدستور يحسب على مجال من الخلايا، ويُعاد حسابه عندما تتغيّر خلية."
          levels={{
            beginner: () => (
              <Manipulation
                type="sheet-lab"
                level="beginner"
                {...LAB.beginner}
                title="مجدول: نقاط خمسة أصدقاء في مسابقة القسم"
                lead="النقاط محجوزة في A1:E1. احسب المدى والمتوسط باليد في العمود C ، ثم اكتب الدستورين في B."
              />
            ),
            advanced: () => (
              <Manipulation
                type="sheet-lab"
                level="advanced"
                {...LAB.advanced}
                title="تمرين 7: السلسلة 4، 10، 8، 4، 3، 2، 4 في مجدول"
                lead="احجز السلسلة في A1:G1 واحفظ الملف، ثم احسب باليد في C واكتب الدساتير الأربعة في B2 ← B5."
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أ) ب) الحساب باليد', subtitle: 'المدى، الوسيط، المتوسط، المنوال', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="manwal" lead="ب) يعرّف التمرين نفسه المنوال:" />
              <TextbookExercise exercise={byId['ex-7-ab']} requires={['mada-silsila', 'wasit-silsila', 'mutawassit-silsila', 'manwal']} onAnswered={() => setQ1(true)} />
            </div>
          ),
        },
        {
          num: 2, title: 'جـ) نحجز السلسلة في المجدول', subtitle: 'السطر الأول: من A1 إلى G1', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hajz-hifz" lead="ما فعلته في المجدول قبل أيّ دستور:" />
              <KnowledgeBrick id="khaliya-majal" lead="كل خلية لها اسم، ومجموعة خلايا متتالية مجال:" />
              <TapQuestion
                prompt="نحجز السلسلة ذات القيم السبع في السطر الأول بدءًا من A1. المجال الذي تشغله:"
                options={[D('A1:G1'), D('A1:F1'), D('A1:A7'), D('A1:H1')]}
                correct={0}
                cols={2}
                requires={['khaliya-majal']}
                explain={<MathText>{'سبع خلايا في السطر 1: A1 ، B1 ، C1 ، D1 ، E1 ، F1 ، G1 . المجال A1:F1 ستّ خلايا فقط، و A1:A7 في العمود A لا في السطر الأول، و A1:H1 ثماني خلايا.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'جـ) نتأكّد بالدساتير', subtitle: 'اكتب الدساتير في المستوى المتقدّم، ثم أجب', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="dustur" lead="في الشريط كتبت ما يبدأ بـ « ⁦=⁩ »، ثم ENTER:" />
              {evidenceFormulas}
              <KnowledgeBrick id="dasatir-arbaa" lead="الدساتير الأربعة التي يطلبها التمرين، كلٌّ في سطره:" />
              <TapQuestion
                prompt={<span>كتب زميلك في الخلية B4 الدستور <Dustur>=MOYENNE(A1:F1)</Dustur> فأظهر المجدول 5,17 ، وحسابه باليد 5 . لماذا؟</span>}
                options={[
                  <MathText key="a">{'المجال لا يشمل الخلية G1 : حسب المجدول متوسط ستّ قيم فقط'}</MathText>,
                  <MathText key="b">{'المجدول أخطأ في الحساب'}</MathText>,
                  <MathText key="c">{'الحساب باليد خاطئ: المتوسط 5,17'}</MathText>,
                ]}
                correct={0}
                cols={1}
                requires={['dustur', 'khaliya-majal', 'dasatir-arbaa']}
                explain={<MathText>{`${EX7_RANGE_TRAP.wrong} ${EX7_RANGE_TRAP.why} ${EX7_RANGE_TRAP.right} المجدول يحسب على المجال المكتوب بالضبط، ولا يخطئ في الحساب.`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'قيمة كبيرة جدًّا', subtitle: 'غيّر قيمة في المجدول، ثم أجب', done: q4,
          content: (
            <div className="space-y-3">
              {evidenceEdit}
              <PredictRule id="iadat-hisab">
                <TapQuestion
                  prompt={<MathText>{`${EX7_OUTLIER.text} ماذا تُظهر الخليتان B3 (الوسيط) و B4 (المتوسط)؟`}</MathText>}
                  options={[
                    <MathText key="a">{'الوسيط 4 والمتوسط $\\dfrac{65}{7} \\approx 9{,}29$'}</MathText>,
                    <MathText key="b">{'الوسيط 4 والمتوسط 5 : لم نعد كتابة الدساتير'}</MathText>,
                    <MathText key="c">{'الوسيط 8 والمتوسط $\\dfrac{65}{7} \\approx 9{,}29$'}</MathText>,
                  ]}
                  correct={0}
                  cols={1}
                  requires={['dustur', 'dasatir-arbaa']}
                  explain={<MathText>{`${EX7_OUTLIER.mean} ${EX7_OUTLIER.median} ${EX7_OUTLIER.hand}`}</MathText>}
                  onAnswered={() => setQ4(true)}
                />
              </PredictRule>
              {q4 && <KnowledgeBrick id="iadat-hisab" lead="ما رأيته في المجدول:" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
