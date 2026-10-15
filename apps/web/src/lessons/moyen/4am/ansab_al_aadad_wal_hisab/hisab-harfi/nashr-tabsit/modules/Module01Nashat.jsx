import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, NumericQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { bidi } from '../../../../../../../utils/bidi';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, PLATFORM_NOTES } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 32) : « نشر عبارة جبرية », ouvert par une accroche
 * RÉELLE de la plateforme (déclarée) : le terrain de l'école qu'on agrandit.
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT (pitch-expansion, le terrain découpé) :
 *   متقدم (ouvert par défaut — c'est l'activité du livre, question 3) : le
 *          terrain (3x − 1)(3 + x), quatre zones dont deux RETRANCHÉES ;
 *          l'élève les porte dans la somme, réunit les termes semblables (le
 *          laboratoire refuse x² + 8x) et vérifie pour deux x au moins.
 *   مبتدئ  : le terrain de l'école 3(x + 5) — deux zones. Pour x = 9 ce
 *          serait 3 × (9 + 5), le calcul de la question 1 (lecture corrigée).
 *
 * LES ÉTAPES sont les questions du livre, dans son ordre : 1) « بطريقتين »
 * (la lecture CORRIGÉE 3 × (9 + 5), une ligne discrète), 2) جداء أم مجموع,
 * 3) انشر وبسّط — x(3x + 1) et 5x(1 − x) par des questions (1 − x n'est
 * positif pour aucun x ≥ 1 : ce n'est pas un terrain), puis (3x − 1)(3 + x)
 * répondu depuis les ESSAIS DE L'ÉLÈVE listés au-dessus
 * (`[data-activity-evidence]`), en nommant la propriété chaque fois. Les
 * briques `nashr-taarif` (avant « انشر ») et `nashr-qawsayn` (après le
 * terrain vérifié) nomment ce que l'élève vient de faire. LP : P1–P4.
 *
 * Rétrofit 2026-10-15 (§4quater) : le labo OUVRE le module — plus de carte `brief` (l'accroche du terrain de la متوسطة est le
 * contexte du `lead` du niveau مبتدئ), plus de `title` / `lead` de workspace. Les briques viennent APRÈS la réponse :
 * `nashr-taarif` après le classement (étape 2), `nashr-qawsayn` après le نشر du terrain (étape 4, son `requires` retiré sur la
 * question).
 */
const { q1a, q1b } = ACTIVITY.numbers;
const fb = (right, wrong) => ({ allRight }) => (
  <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? right : wrong}</MathText></Feedback>
);
const M = (tex) => <MathText key={tex}>{tex}</MathText>;
const SUM = 'مجموع';
const PRODUCT = 'جداء';
const PROPS = ['$k(a + b) = ka + kb$', '$k(a - b) = ka - kb$', '$(a + b)(c + d) = ac + ad + bc + bd$'];

/** Les vérifications de l'élève sur un terrain, une ligne par valeur de x (la dernière fait foi). */
function Evidence({ trials, level, empty }) {
  const list = Object.values(trials).sort((u, v) => u.x - v.x);
  return (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence={level}>
      {list.length === 0 && <li className="text-slate-500" data-tried="false">{empty}</li>}
      {list.map((tr) => (
        <li key={tr.x} data-tried="true" data-ok={tr.ok ? 'true' : 'false'} className={tr.ok ? 'font-bold text-emerald-900' : 'text-rose-900'}>
          {tr.ok
            ? <MathText>{`$x = ${tr.x}$ : مساحة الملعب $${tr.product}$ ومجموع المناطق $${tr.sum}$ ✓`}</MathText>
            : <MathText>{`$x = ${tr.x}$ : المجموع $${tr.sum}$ لا يساوي مساحة الملعب $${tr.product}$ (مناطق لم تُحسب: ${tr.missing.length})`}</MathText>}
        </li>
      ))}
    </ul>
  );
}

export default function Module01Nashat() {
  const [small, setSmall] = useState({});
  const [big, setBig] = useState({});
  const [q1a1, setQ1a1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);

  const keep = (set) => (trial) => { if (trial) set((t) => ({ ...t, [trial.x]: trial })); };
  const bigVerified = Object.values(big).filter((t) => t.ok).length;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      objectives={["كيف نحسب مساحة ملعب مقسّم إلى مناطق؟", "هل العبارة جداء أم مجموع؟ وكيف نعرف؟", "ماذا نفعل بحدود لا تتشابه؟"]}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — نشر عبارة جبرية"
      moduleSubtitle="ملعب مقسّم إلى مناطق"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="pitch-expansion"
                level="beginner"
                expr={ACTIVITY.pitch.beginner}
                span={9}
                title={bidi('ملعب المتوسطة: عرضه 3 وطوله x + 5')}
                lead={<MathText>{'قرّرت إدارة المتوسطة إطالة ملعب كرة القدم: عرضه $3$ وطوله $x + 5$. جرّب $x = 9$ بين قيمك.'}</MathText>}
                onTrial={keep(setSmall)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="pitch-expansion"
                level="advanced"
                expr={ACTIVITY.pitch.advanced}
                title={bidi('نشاط 1 — ملعب بعداه 3x − 1 و 3 + x')}
                lead={<MathText>{'أربع مناطق، منها اثنتان مقتطعتان (مخطّطتان).'}</MathText>}
                onTrial={keep(setBig)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'احسب بطريقتين مختلفتين', subtitle: 'السؤال 1', done: q1,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <p className="text-xs text-slate-500"><MathText>{ACTIVITY.correctionNote}</MathText></p>
              <p className="text-sm font-semibold text-slate-700">تحقّقاتك على ملعب المتوسطة (المستوى المبتدئ):</p>
              <Evidence trials={small} level="beginner" empty="لم تتحقّق بعد من ملعب المستوى المبتدئ: افتحه وجرّب." />
              <NumericQuestion
                prompt={<MathText>{`$${q1a.k} \\times (${q1a.a} + ${q1a.b}) = \\ldots$`}</MathText>}
                expected={q1a.k * (q1a.a + q1a.b)}
                requires={['awlawiyat-hisab', 'khassiya-tawziiya']}
                explain={<MathText>{`الطريقة الأولى: $${q1a.k} \\times ${q1a.a + q1a.b} = ${q1a.k * (q1a.a + q1a.b)}$. الطريقة الثانية، منطقةً منطقة كما في الملعب: $${q1a.k} \\times ${q1a.a} + ${q1a.k} \\times ${q1a.b} = ${q1a.k * q1a.a} + ${q1a.k * q1a.b} = ${q1a.k * (q1a.a + q1a.b)}$.`}</MathText>}
                explainFor={(n) => (n === q1a.k * q1a.a + q1a.b
                  ? <MathText>{`ضربت ${q1a.k} في ${q1a.a} وحده: المنطقة الثانية مساحتها $${q1a.k} \\times ${q1a.b} = ${q1a.k * q1a.b}$ أيضًا.`}</MathText>
                  : undefined)}
                onAnswered={() => setQ1a1(true)}
              />
              {q1a1 && (
                <NumericQuestion
                  prompt={<MathText>{'$(4 - 2{,}5)(3 + 1{,}2) = \\ldots$'}</MathText>}
                  expected={(n) => Math.abs(n - ((q1b.a - q1b.b) * (q1b.c + q1b.d)) / (q1b.scale * q1b.scale)) < 1e-9}
                  parse={parseDec}
                  display="6,3"
                  requires={['awlawiyat-hisab', 'khassiya-tawziiya']}
                  explain={<MathText>{'الطريقة الأولى: $1{,}5 \\times 4{,}2 = 6{,}3$. الطريقة الثانية، كل حد في كل حد: $12 + 4{,}8 - 7{,}5 - 3 = 6{,}3$.'}</MathText>}
                  onAnswered={() => setQ1(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'جداء أم مجموع؟', subtitle: 'السؤال 2', done: q2,
          content: (
            <div className="space-y-3">
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[1]}</MathText></p>}
              rows={[
                { id: 'e1', label: M('$x(3x + 1)$'), options: [SUM, PRODUCT], correct: 1, correction: 'آخر عملية: ضرب $x$ في القوس' },
                { id: 'e2', label: M('$x + (3 - 2x)$'), options: [SUM, PRODUCT], correct: 0, correction: 'آخر عملية: جمع $x$ والقوس' },
                { id: 'e3', label: M('$5x(1 - x)$'), options: [SUM, PRODUCT], correct: 1, correction: 'آخر عملية: ضرب $5x$ في القوس' },
                { id: 'e4', label: M('$x(x + 1) - 2 + (x + 1)$'), options: [SUM, PRODUCT], correct: 0, correction: 'ثلاثة حدود يجمعها $-$ و $+$: فيها جداء، لكن آخر عملية جمع' },
                { id: 'e5', label: M('$(3x - 1)(3 + x)$'), options: [SUM, PRODUCT], correct: 1, correction: 'آخر عملية: ضرب القوسين، كمساحة الملعب في المستوى المتقدّم' },
              ].map((r) => ({ ...r, correction: <MathText>{r.correction}</MathText> }))}
              requires={['awlawiyat-hisab']}
              feedback={fb(PLATFORM_NOTES.classify, PLATFORM_NOTES.classify)}
              onAnswered={() => setQ2(true)}
            />
            {q2 && <KnowledgeBrick id="nashr-taarif" lead="ما ميّزته الآن له اسم في الكتاب: نكتب الجداء مجموعًا." />}
            </div>
          ),
        },
        {
          num: 3, title: 'انشر وبسّط، واذكر الخاصية', subtitle: 'السؤال 3: العبارتان الأوليان', done: q3,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-800"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm text-slate-600"><MathText>{'العبارة $5x(1 - x)$ ليست ملعبًا: $1 - x$ سالب لكل $x$ أكبر من 1. نجيب بالحساب.'}</MathText></p>}
                rows={[
                  { id: 'a', label: M('$x(3x + 1) = \\ldots$'), options: ['$3x^2 + x$', '$3x^2 + 1$', '$4x^2$'].map(M), correct: 0, correction: M('$x \\times 3x + x \\times 1 = 3x^2 + x$') },
                  { id: 'ap', label: 'الخاصية المعتمدة', options: PROPS.map(M), correct: 0, correction: M('$k(a + b) = ka + kb$ مع $k = x$') },
                  { id: 'b', label: M('$5x(1 - x) = \\ldots$'), options: ['$5x + 5x^2$', '$5x - 5x^2$', '$4x$'].map(M), correct: 1, correction: M('$5x \\times 1 - 5x \\times x = 5x - 5x^2$') },
                  { id: 'bp', label: 'الخاصية المعتمدة', options: PROPS.map(M), correct: 1, correction: M('$k(a - b) = ka - kb$ مع $k = 5x$') },
                ]}
                requires={['nashr-taarif', 'khassiya-tawziiya', 'jidaa-x-fi-x']}
                feedback={fb('نضرب العامل الذي أمام القوس في كل حد بداخله: $x \\times x = x^2$.', 'العامل الذي أمام القوس يُضرب في كل حد بداخله، و $x \\times x = x^2$ لا $2x$.')}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'جداء قوسين: ملعب النشاط', subtitle: 'السؤال 3: العبارة الثالثة — من تحقّقاتك في المستوى المتقدّم', done: q4,
          content: (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700"><MathText>{'تحقّقاتك على الملعب $(3x - 1)(3 + x)$:'}</MathText></p>
              <Evidence trials={big} level="advanced" empty="لم تتحقّق بعد من ملعب المستوى المتقدّم: احسب كل مناطقه ثم اضغط «تحقّق»." />
              {bigVerified < 2 && <p className="text-xs text-slate-500"><MathText>{'تحقّق من أجل قيمتين لـ $x$ على الأقل: هل بقيت المساواة صحيحة في كل مرّة؟'}</MathText></p>}
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'انشر $(3x - 1)(3 + x)$ وبسّطها، واذكر الخاصية:'}</MathText></p>}
                rows={[
                  { id: 'c1', label: 'الجداءات الأربعة (قبل التبسيط)', options: ['$9x - x$', '$9x + 3x^2 - 3 - x$', '$3x^2 - 3$'].map(M), correct: 1, correction: M('$3x \\times 3 + 3x \\times x - 1 \\times 3 - 1 \\times x$') },
                  { id: 'c2', label: 'بعد التبسيط', options: ['$3x^2 + 10x - 3$', '$11x^2 - 3$', '$3x^2 + 8x - 3$'].map(M), correct: 2, correction: M('$9x - x = 8x$') },
                  { id: 'cp', label: 'الخاصية المعتمدة', options: PROPS.map(M), correct: 2, correction: M('$(a + b)(c + d) = ac + ad + bc + bd$') },
                ]}
                requires={['jidaa-x-fi-x']}
                feedback={fb(PLATFORM_NOTES.unlikeRight, PLATFORM_NOTES.unlike)}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="nashr-qawsayn" lead="ما فعلته في الملعب: كل حد من الضلع الأول في كل حد من الضلع الثاني." />}
            </div>
          ),
        },
        {
          num: 5, title: 'عودة إلى ملعب المتوسطة', subtitle: 'شكلان لعبارة واحدة', done: q5,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'من أجل $x = 4$ ، احسب مساحة الملعب $3x^2 + 8x - 3$ (الشكل المنشور):'}</MathText>}
                expected={3 * 4 * 4 + 8 * 4 - 3}
                requires={['nashr-qawsayn']}
                explain={<MathText>{'$3 \\times 16 + 32 - 3 = 77$ ، وبالشكل الأول: $(3 \\times 4 - 1)(3 + 4) = 11 \\times 7 = 77$. الشكلان متساويان مهما كان $x$.'}</MathText>}
                onAnswered={() => setQ5(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
