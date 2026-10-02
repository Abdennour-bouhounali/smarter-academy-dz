import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, ROW_OPTIONS } from '../content/textbook';
import PayrollVignette from '../components/PayrollVignette';

/**
 * Module 1 — نشاط 1 (p. 78) : « تعيين دالة تآلفية », la paie (35000DA + 185DA par heure supplémentaire),
 * CORRIGÉE (« أضيف » → « أضف », une ligne discrète), ouverte sur LE COMPTEUR À PARTIE FIXE (affine-meter).
 *
 * REAL        la fiche de paie d'un ouvrier (le texte du manuel), la vignette de l'atelier ;
 * DISCOVER /  le lab à deux niveaux, UN instrument, même objectif :
 * MANIPULATE    متقدم (ouvert par défaut : c'est le نشاط 1) : la paie — les cinq colonnes du tableau du
 *               manuel (marques sur la règle), la cible 37775 à atteindre, puis les boutons a et b ;
 *               مبتدئ : une course en taxi-application (100DA + 40DA le km), une image à la fois.
 * UNDERSTAND  س 1–4 se décident sur le compteur : les essais de l'élève (`onTrial`) sont listés au-dessus
 *             des questions (`[data-activity-evidence]`) ; س 5 (plateforme) demande l'antécédent d'une
 *             autre paie, 38330DA, avec les cibles que l'élève a atteintes.
 * FORMALIZE   la brique dala-ujra (« كل دالة من الشكل … تسمى دالة تآلفية ») nomme ce que le compteur a montré.
 * AUCUNE étape n'attend `onFinished`. LP : P1 (س 3, س 4, la brique), P2 (س 1, س 2), P3 (س 5).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [hits, setHits] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const onTrial = (tr) => {
    if (tr.kind === 'image') setTrials((t) => [...t.filter((u) => u.x !== tr.x), tr].sort((p, q) => p.x - q.x));
    if (tr.kind === 'hit') setHits((t) => (t.some((u) => u.x === tr.x) ? t : [...t, tr]));
  };

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500">لم تدفع بعد بطاقة الدوام على مسطرة الساعات (المستوى المتقدّم).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">أجورك على العدّاد (الساعات الإضافية ← الأجرة):</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {trials.slice(-8).map((tr) => (
              <li key={tr.x} data-evidence-trial={tr.x} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                <bdi dir="ltr" className="font-mono">{tr.x} → {tr.fx}</bdi>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const hitEvidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="reverse" data-tried={hits.length ? 'true' : 'false'}>
      {hits.length === 0
        ? <p className="text-slate-500">لم تبلغ بعد الأجرة المطلوبة في المرحلة 2 من العدّاد («عدد صورته معلومة»).</p>
        : (
          <ul className="flex flex-wrap gap-1.5" data-evidence="reverse">
            {hits.map((h) => (
              <li key={h.x} className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-900">
                <bdi dir="ltr" className="font-mono">{h.x} → {h.fx}</bdi>
              </li>
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
      moduleTitle="نشاط 1 — أجرة العامل"
      moduleSubtitle="عدّاد بجزء ثابت وجزء يتغيّر مع الساعات"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 78',
        headline: 'كم يتقاضى العامل في آخر الشهر؟',
        emoji: '🧾',
        title: ACTIVITY.title,
        tone: 'amber',
        visual: <PayrollVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800"><MathText>{ACTIVITY.text}</MathText></p>
            <p className="text-sm text-slate-600">قبل أسئلة النشاط: ادفع بطاقة الدوام على مسطرة الساعات وراقب العدّاد — ما الذي يبقى ثابتًا، وما الذي يُضاف عن كل ساعة؟</p>
            <p className="text-xs text-slate-500" data-correction-note><MathText>{ACTIVITY.correctionNote}</MathText></p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="في المستويين عدّاد بجزء ثابت: قطعة واحدة تُدفع مرة واحدة، وقطعة تُضاف عن كل وحدة. أنت تحرّك x والعدّاد يُبنى أمامك."
          levels={{
            beginner: () => (
              <Manipulation
                type="affine-meter"
                level="beginner"
                rule="40x+100"
                mode="image"
                theme="ride"
                title="عدّاد سيارة الأجرة: 100DA عند الركوب و 40DA للكيلومتر"
                lead="رحلة في شوارع العاصمة بتطبيق سيارات الأجرة: جرّب عدة مسافات، وجرّب 0 كيلومتر."
              />
            ),
            advanced: () => (
              <Manipulation
                type="affine-meter"
                level="advanced"
                rule={ACTIVITY.lab.rule}
                mode={ACTIVITY.lab.mode}
                target={ACTIVITY.lab.target}
                marks={ACTIVITY.lab.marks}
                theme="payroll"
                title="نشاط 1: أجرة قاعدية 35000DA يضاف إليها 185DA لكل ساعة إضافية"
                lead="المثلثات الحمراء هي أعمدة جدول الكتاب (5، 8، 10، 12، 15): أتمّها على العدّاد، ثم افتح المرحلتين التاليتين."
                onTrial={onTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: '10 ساعات إضافية', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              {evidence}
              <NumericQuestion
                prompt="أجرة عامل أنجز 10 ساعات إضافية (بالدينار):"
                expected={ACTIVITY.answer.q1}
                parse={parseDec}
                display="36850"
                requires={['taawid-qima']}
                explain={<MathText>{ACTIVITY_LINES.q1}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'جدول الأجور', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[1]}</MathText></p>
              <table className="w-full border-collapse text-center text-sm" data-act1-table>
                <tbody>
                  <tr>
                    <th scope="row" className="border border-slate-300 bg-amber-50 px-2 py-1 text-xs font-bold">{ACTIVITY.rows[0]}</th>
                    {ACTIVITY.table.x.map((c) => <td key={c} className="border border-slate-300 px-1.5 py-1 font-mono">{c}</td>)}
                  </tr>
                  <tr>
                    <th scope="row" className="border border-slate-300 bg-amber-50 px-2 py-1 text-xs font-bold">{ACTIVITY.rows[1]}</th>
                    {ACTIVITY.table.y.map((c, i) => <td key={`${c}-${i}`} className="border border-slate-300 px-1.5 py-1 font-mono">{c}</td>)}
                  </tr>
                </tbody>
              </table>
              {evidence}
              <TapQuestion
                prompt="أ) الأجور الناقصة (للأعمدة 5، 8، 12، 15 بالترتيب) هي:"
                options={ROW_OPTIONS.map(M)}
                correct={0}
                cols={1}
                requires={['taawid-qima']}
                explain={<MathText>{`${ACTIVITY_LINES.row} أما $925$ ، $1480$ … فهي $185x$ وحدها دون الأجرة القاعدية، و $18425$ ، $29480$ … تفترض أنّ الأجرة تتناسب مع الساعات، و $175925$ … تضيف 35000 عن كل ساعة.`}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && (
                <TapQuestion
                  prompt="ب) هل هذا الجدول جدول تناسبية؟"
                  options={[
                    M('لا: $\\dfrac{35925}{5} = 7185$ و $\\dfrac{36480}{8} = 4560$'),
                    M('نعم: معامل التناسبية $185$'),
                    M('نعم: معامل التناسبية $3685$'),
                    M('لا: لأنّ الأجور لا تتزايد'),
                  ]}
                  correct={0}
                  cols={1}
                  requires={['mafhum-khattiya']}
                  explain={<MathText>{`${ACTIVITY_LINES.prop} و $185$ هو ما يُضاف عن كل ساعة لا حاصل القسمة، و $3685 = 36850 \\div 10$ لا يصلح إلا للعمود 10.`}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 3, title: 'عبارة S(x)', subtitle: 'السؤال 3', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'عبارة $S(x)$ بدلالة $x$ هي:'}</MathText>}
                options={['$S(x) = 185x + 35000$', '$S(x) = 35185x$', '$S(x) = 35000x + 185$', '$S(x) = 185x$'].map(M)}
                correct={0}
                cols={2}
                requires={['taawid-qima']}
                explain={<MathText>{`${ACTIVITY_LINES.formula} أما $35185x$ فتضيف 35000 عن كل ساعة ($S(10)$ تصبح $351850$)، و $35000x + 185$ تقلب الجزأين، و $185x$ تنسى الأجرة القاعدية ($S(10) = 1850$).`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'دالة تآلفية', subtitle: 'السؤال 4', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[3]}</MathText></p>
              <TapQuestion
                prompt="أ) هل الوضعية المقترحة تعرّف دالة تآلفية؟"
                options={[
                  M('نعم: $a = 185$ و $b = 35000$'),
                  M('نعم: $a = 35000$ و $b = 185$'),
                  M('لا: لأنّ الجدول ليس جدول تناسبية'),
                ]}
                correct={0}
                cols={1}
                requires={['taawid-qima']}
                explain={<MathText>{`${ACTIVITY_LINES.affine} وكون الجدول غير تناسبي لا يمنع ذلك: الدالة التآلفية ليست خطية في الغالب.`}</MathText>}
                onAnswered={() => setQ4a(true)}
              />
              {q4a && (
                <TapQuestion
                  prompt="ب) برنامج الحساب الذي يصف الدالة S هو:"
                  options={[
                    M('«اضرب $x$ في 185، أضف 35000»'),
                    M('«أضف 35000 إلى $x$ ، ثم اضرب في 185»'),
                    M('«اضرب $x$ في 35000، أضف 185»'),
                  ]}
                  correct={0}
                  cols={1}
                  requires={['taawid-qima']}
                  explain={<MathText>{`${ACTIVITY_LINES.program} أما «أضف ثم اضرب» فيعطي $(x + 35000) \\times 185$ ، أي $S(10) = 6476850$.`}</MathText>}
                  onAnswered={() => setQ4(true)}
                />
              )}
              {q4 && <KnowledgeBrick id="dala-ujra" lead="ما فعله العدّاد بكل عدد من الساعات، بكلمات الكتاب:" />}
            </div>
          ),
        },
        {
          num: 5, title: 'من الأجرة إلى الساعات', subtitle: 'العدد الذي صورته معلومة', done: q5,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800">في المرحلة 2 من العدّاد بلغت أجرة معلومة بتحريك عدد الساعات. الآن دون عدّاد:</p>
              {hitEvidence}
              <NumericQuestion
                prompt={<MathText>{'تقاضى عامل في شهر أجرة $38330$DA. عدد الساعات الإضافية التي أنجزها هو:'}</MathText>}
                expected={18}
                parse={parseDec}
                display="18"
                requires={['dala-ujra', 'hal-muadala-ula']}
                explain={<MathText>{ACTIVITY_LINES.antecedent}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'جرّب المرحلة 3 من العدّاد: اضبط $a$ و $b$ . المحور التالي يميّز الدوال التآلفية من غيرها، ويقرأ معاملَيها $a$ و $b$ .'}</MathText>
                </p>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
