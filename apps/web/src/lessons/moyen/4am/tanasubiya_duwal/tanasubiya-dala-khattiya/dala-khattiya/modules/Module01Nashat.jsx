import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_LINES, ACT_ROW_OPTIONS, ACTIVITY2 } from '../content/textbook';
import ValueTable from '../components/ValueTable';
import SoukVignette from '../components/SoukVignette';

/**
 * Module 1 — نشاط 1 (p. 66) : « تعيين دالة خطية », la remise de l'Aïd CORRIGÉE (2 % → 20 %, une ligne
 * discrète), ouvert sur LA MACHINE À RÈGLE CACHÉE (linear-machine).
 *
 * DISCOVER / MANIPULATE   le lab à deux niveaux, UN instrument, même objectif :
 *   مبتدئ (ouvert par défaut : ce sont les nombres du نشاط 1) : la machine de la remise, des étiquettes de
 *          prix (50 … 200 du manuel, 0, 1…), une carte vierge, les étiquettes-cibles 6 et 1,4 ;
 *   متقدم : les trois machines du نشاط 2 (x², 2x, 2x − 1) — la montée vers معارف.
 * UNDERSTAND  س 1, 2, 3 se décident sur la machine : les essais de l'élève (`onTrial`) et les étiquettes
 *           qu'il a atteintes (`onReverse`) sont listés au-dessus des questions (`[data-activity-evidence]`).
 * FORMALIZE  la brique dala-nashat (« نقول أنّنا عرّفنا دالة … دالة خطية معاملها a ») nomme ce que la
 *           machine a montré.
 * AUCUNE étape n'attend `onFinished`. LP : P1 (س 3, la brique), P2 (f(120)), P3 (س 1 : le coefficient,
 * f(x) = 6 et 1,4).
 */
const fmt = (s) => String(s).replace('.', ',');

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [hits, setHits] = useState([]);
  const [q1a, setQ1a] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  const onTrial = (tr) => setTrials((t) => [...t.filter((u) => u.x !== tr.x), tr]);
  const onReverse = (h) => setHits((t) => [...t.filter((u) => u.target !== h.target), h]);

  const evidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={trials.length ? 'true' : 'false'}>
      {trials.length === 0 ? (
        <p className="text-slate-500">لم تُدخل أي سعر بعد في آلة التخفيض (المستوى المبتدئ).</p>
      ) : (
        <>
          <p className="mb-1 font-bold text-slate-700">أسعارك في آلة التخفيض (قبل ← بعد):</p>
          <ul className="flex flex-wrap gap-1.5" data-evidence="trials">
            {trials.slice(-10).map((tr) => (
              <li key={tr.x} data-evidence-trial={tr.x} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                <bdi dir="ltr" className="font-mono">{tr.x} → {tr.fx}</bdi>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const reverseEvidence = (
    <div className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence="reverse" data-tried={hits.length ? 'true' : 'false'}>
      {hits.length === 0
        ? <p className="text-slate-500">لم تُخرج الآلة بعد أيّ سعر مطلوب (6DA أو 1,4DA): اضبط البطاقة الفارغة وأدخلها.</p>
        : (
          <ul className="flex flex-wrap gap-1.5" data-evidence="reverse">
            {hits.map((h) => (
              <li key={h.target} className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-900">
                <bdi dir="ltr" className="font-mono">{h.x} → {h.target}</bdi>
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
      moduleTitle="نشاط 1 — تخفيضات العيد"
      moduleSubtitle="آلة تخفيض بقاعدة مخفية"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 66',
        headline: 'تخفيضات عيد الفطر في السوق!',
        emoji: '🏮',
        title: ACTIVITY.title,
        tone: 'indigo',
        visual: <SoukVignette />,
        body: (
          <div className="space-y-2">
            <p className="font-semibold text-slate-800"><MathText>{ACTIVITY.text}</MathText></p>
            <p className="text-sm text-slate-600">قبل أسئلة النشاط: آلة التخفيض تُخفي قاعدتها. أدخل فيها الأسعار التي تختارها، واضبط آلتك الشاهدة حتى تطابقها.</p>
            <p className="text-xs text-slate-500" data-correction-note><MathText>{ACTIVITY.correctionNote}</MathText></p>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="beginner"
          lead="في المستويين آلة بقاعدة مخفية: تُدخل فيها أعدادًا تختارها، وتقرأ ما يخرج، وتبحث عن العدد a الذي تضرب فيه آلتُك الشاهدة كل عدد لتطابق الآلة — أو تُثبت أنه لا يوجد."
          levels={{
            beginner: () => (
              <Manipulation
                type="linear-machine"
                level="beginner"
                rules={ACTIVITY.rules}
                targets={ACTIVITY.targets}
                theme="souk"
                title="نشاط 1: آلة تخفيضات العيد (20%)"
                lead="أدخل أسعار الكتاب (50، 100، 150، 200) وأسعارًا أخرى، ثم ابحث عن السعر الذي يصبح 6DA وعن الذي يصبح 1,4DA."
                onTrial={onTrial}
                onReverse={onReverse}
              />
            ),
            advanced: () => (
              <Manipulation
                type="linear-machine"
                level="advanced"
                rules={ACTIVITY2.rules}
                theme="souk"
                title="نشاط 2: ثلاث آلات بقواعد مخفية"
                lead="لكل آلة: هل يوجد عدد a تطابق به آلتك الشاهدة الآلةَ؟ أثبت ذلك بجدولك."
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'جدول الأسعار', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <ValueTable rows={[{ label: ACTIVITY.rows[0], cells: ACTIVITY.table.before }, { label: ACTIVITY.rows[1], cells: ['…', '…', '…', '…'] }]} />
              {evidence}
              <TapQuestion
                prompt="السطر الثاني من الجدول (الأسعار بعد التخفيض) هو:"
                options={ACT_ROW_OPTIONS.map((o) => <MathText key={o}>{o}</MathText>)}
                correct={0}
                cols={2}
                requires={['muamil-tanasub']}
                explain={<MathText>{`${ACTIVITY_LINES.reduce} أما $48$ ، $98$ … فتطرح 2DA من كل سعر، و $30$ ، $80$ … تطرح 20DA، و $10$ ، $20$ … هي مبالغ التخفيض لا الأسعار بعده.`}</MathText>}
                onAnswered={() => setQ1a(true)}
              />
              {q1a && (
                <TapQuestion
                  prompt="هذا الجدول جدول تناسبية. معامل التناسبية هو:"
                  options={['$0{,}8$', '$0{,}2$', '$1{,}25$', '$10$'].map((o) => <MathText key={o}>{o}</MathText>)}
                  correct={0}
                  cols={4}
                  requires={['muamil-tanasub']}
                  explain={<MathText>{`${ACTIVITY_LINES.ratios} أما $0{,}2$ فنسبة التخفيض، و $1{,}25 = \\dfrac{50}{40}$ معامل مقلوب، و $10$ فرق في العمود الأول وحده.`}</MathText>}
                  onAnswered={() => setQ1(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'السعر بعد التخفيض وقبله', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[1]}</MathText></p>
              <p className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900" data-notation>
                <MathText>{'الترميز: السعر قبل التخفيض $x$ ، والسعر بعده $f(x)$ (نقرأ «f لـ x»). مثلا $f(50)$ هو سعر سلعة ثمنها 50DA بعد التخفيض — هو ما يخرج من الآلة حين تُدخل 50.'}</MathText>
              </p>
              <NumericQuestion
                prompt={<MathText>{'$f(120) =$'}</MathText>}
                expected={ACTIVITY.answer.f120}
                parse={parseDec}
                display={fmt(ACTIVITY.answer.f120)}
                requires={['muamil-tanasub']}
                explain={<MathText>{ACTIVITY_LINES.f120}</MathText>}
                onAnswered={() => setQ2a(true)}
              />
              {q2a && reverseEvidence}
              {q2a && (
                <NumericQuestion
                  prompt={<MathText>{'العدد $x$ حيث $f(x) = 6$ :'}</MathText>}
                  expected={(n) => Math.abs(n - ACTIVITY.answer.x6) < 1e-9}
                  parse={parseDec}
                  display={fmt(ACTIVITY.answer.x6)}
                  requires={['hal-muadala-ula']}
                  explain={<MathText>{ACTIVITY_LINES.x6}</MathText>}
                  onAnswered={() => setQ2b(true)}
                />
              )}
              {q2b && (
                <NumericQuestion
                  prompt={<MathText>{'العدد $x$ حيث $f(x) = 1{,}4$ :'}</MathText>}
                  expected={(n) => Math.abs(n - ACTIVITY.answer.x14) < 1e-9}
                  parse={parseDec}
                  display={fmt(ACTIVITY.answer.x14)}
                  requires={['hal-muadala-ula']}
                  explain={<MathText>{ACTIVITY_LINES.x14}</MathText>}
                  onAnswered={() => setQ2(true)}
                />
              )}
              {q2 && <p className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900"><MathText>{ACTIVITY.naming}</MathText></p>}
            </div>
          ),
        },
        {
          num: 3, title: 'عبارة f(x) بدلالة x', subtitle: 'السؤال 3', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <TapQuestion
                prompt={<MathText>{'عبارة $f(x)$ بدلالة $x$ هي:'}</MathText>}
                options={['$f(x) = 0{,}8x$', '$f(x) = x - 0{,}2$', '$f(x) = x - 20$', '$f(x) = 1{,}25x$'].map((o) => <MathText key={o}>{o}</MathText>)}
                correct={0}
                cols={2}
                requires={['muamil-tanasub']}
                explain={<MathText>{`${ACTIVITY_LINES.formula} أما $x - 20$ فتعطي $f(50) = 30$ لا $40$ ، و $x - 0{,}2$ تعطي $49{,}8$ ، و $1{,}25x$ تعطي $62{,}5$.`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="dala-nashat" lead="ما فعلته الآلة بكل سعر، بكلمات الكتاب:" />}
              {q3 && (
                <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-900" data-next-module>
                  <MathText>{'جرّب الآن المستوى المتقدّم: ثلاث آلات، واحدة منها فقط تطابقها آلة الضرب $x \\longmapsto ax$. المحور التالي يميّز الدوال الخطية من غيرها، ويعطي طريقة تعيينها.'}</MathText>
                </p>
              )}
              {/* La « مسألة الدرس » prolonge les trois machines du niveau متقدم (laboratoire dans l'intro) :
                  d'autres règles cachées, d'autres nombres — résolue au module 4. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
