import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseDec, getLessonPath } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, BASKET, RECALL, GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE : le panier de سلمى (50 œufs, boîtes de 12 — plateforme) puis le نشاط 1 du manuel (p. 24 : 2145 œufs,
 * plateaux de 30) au niveau متقدم. Rétrofit 2026-10-15 : le labo en TÊTE, sans carte ; le RAPPEL de 1AM (« تذكّر », leçon publiée
 * qisma-iqlidiya-baqi — le réseau dit que 2am.m1.r04 prolonge 1am.m3.r01) vient APRÈS la première réponse, pas avant le geste ;
 * ce qui est ajouté n'est que « tout diviseur » et l'encadrement du quotient (2am.m1.r06).
 *
 * LABORATOIRE À DEUX NIVEAUX, un seul type `egg-trays` (la main tient a, le nombre d'œufs ; le quotient a ÷ b se lit sur la
 * règle des plateaux) — MANIPULATION_CONTRACT §2unvicies :
 *   مبتدئ  — le panier de سلمى : 50 œufs dessinés, des boîtes de 12 ; puis 60 (plateforme, thème `farm`).
 *   متقدم  — les 2145 œufs du manuel en plateaux de 30, la division du fils (70, reste 45) à juger ; puis 2160.
 *
 * Les ÉTAPES sont les quatre questions du manuel, répondues depuis les essais de l'élève (ses cadres, listés au-dessus,
 * `[data-activity-evidence]`) ; la règle (brique gardée par « أتوقّع القاعدة ») vient après la question 3. LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const MODEL = {
  right: 'الحاصل داخل إطارك',
  below: 'الحاصل بعد إطارك',
  above: 'الحاصل قبل إطارك',
  remainder: 'وضعت الإطار عند الباقي',
  onMark: 'الحاصل على عدد طبيعي: لا إطار يحصره',
};

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2a, setQ2a] = useState(false);
  const [q2b, setQ2b] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q3b, setQ3b] = useState(false);
  const [q4, setQ4] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const { a, b } = ACTIVITY.numbers;
  const frames = trials.filter((e) => e.kind === 'frame' && e.a === a && e.b === b).slice(-3);
  const base = getLessonPath(RECALL.lesson);
  const EvidenceFrames = () => (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {frames.length === 0 && <li className="text-slate-500">لم تضع إطارك بعد على مسطرة الصفائح (المستوى المتقدّم).</li>}
      {frames.map((e, i) => (
        <li key={i} data-evidence={e.n} className="font-bold text-slate-800">
          <MathText>{`إطارك: $${e.n}$ و $${e.n + 1}$ — ${MODEL[e.model] ?? ''}.`}</MathText>
        </li>
      ))}
    </ul>
  );

  return (
    <ContentModule
      objectives={['بين أيّ عددين طبيعيين يقع حاصل القسمة؟', 'ماذا يمثّل طرفا الحصر في وضعية؟', 'متى نوافق على قسمة إقليدية؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — بيض المزرعة"
      moduleSubtitle="كم صفيحة مملوءة؟ وكم صفيحة تلزم؟"
      estimatedTime="15 دقيقة"
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation type="egg-trays" level="beginner" world="carton" a={BASKET.numbers.a} b={BASKET.numbers.b} then={BASKET.numbers.then}
                  title="سلمى تعبّئ البيض في علب" onTrial={record} />
                <SourceTag source={BASKET.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <Manipulation type="egg-trays" level="advanced" world="tray" a={a} b={b} then={ACTIVITY.numbers.then}
                  claim={{ q: ACTIVITY.son.q, r: ACTIVITY.son.r }}
                  title="نشاط 1: تعبئة البيض في صفائح" onTrial={record} />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أحصر 2145 بين مضاعفين متتاليين للعدد 30', subtitle: 'السؤال 1) من الكتاب', done: q1,
          content: (
            <div className="space-y-3">
              <EvidenceFrames />
              <TapQuestion
              prompt={<MathText>{ACTIVITY.questions[0]}</MathText>}
              options={[M('$30 \\times 70 \\le 2145 < 30 \\times 71$'), M('$30 \\times 71 \\le 2145 < 30 \\times 72$'), M('$30 \\times 72 \\le 2145 < 30 \\times 73$')]}
              correct={1}
              cols={1}
              requires={['qisma-iqlidiya']}
              explain={<MathText>{'$30 \\times 71 = 2130$ و $30 \\times 72 = 2160$ : $2130 \\le 2145 < 2160$.'}</MathText>}
              onAnswered={() => setQ1(true)}
              />
              {q1 && (
                <TextbookBox kind="remark" title={RECALL.title} text={RECALL.text} source={RECALL.source} compact>
                  {base && <Link to={base} className="inline-flex min-h-[44px] items-center text-sm font-bold text-teal-700 underline underline-offset-4" data-recall-link>درس « القسمة الإقليدية » — السنة الأولى متوسط</Link>}
                </TextbookBox>
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'الصفائح المملوءة، والصفيحة غير المملوءة', subtitle: 'السؤال 2) من الكتاب', done: q2a && q2b,
          content: (
            <div className="space-y-3">
              <EvidenceFrames />
              <NumericQuestion prompt={<span>عدد الصفائح التي يمكن ملؤها:</span>} expected={71} parse={parseDec}
                requires={['qisma-iqlidiya']} explain={<MathText>{'$30 \\times 71 = 2130$ و 72 صفيحة تحتاج 2160 بيضة.'}</MathText>}
                onAnswered={() => setQ2a(true)} />
              <NumericQuestion prompt={<span>تبقى صفيحة واحدة غير مملوءة. عدد البيض فيها:</span>} expected={15} parse={parseDec}
                requires={['qisma-iqlidiya']} explain={<MathText>{'$2145 - 2130 = 15$ ، و $15 < 30$.'}</MathText>}
                onAnswered={() => setQ2b(true)} />
            </div>
          ),
        },
        {
          num: 3, title: 'المساواة، ثم أين يقع حاصل القسمة؟', subtitle: 'السؤال 3) من الكتاب', done: q3 && q3b,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'أكمل المساواة $2145 = 30 \\times \\ldots + \\ldots$'}</MathText></p>}
                rows={[
                  { id: 'q', label: 'العدد بعد 30 ×', options: ['71', '72', '15'], correct: 0, correction: 'عدد الصفائح المملوءة: الحاصل 71.' },
                  { id: 'r', label: 'العدد بعد +', options: ['45', '0', '15'], correct: 2, correction: <MathText>{'البيض في الصفيحة غير المملوءة: الباقي 15 ، و $15 < 30$.'}</MathText> },
                ]}
                requires={['qisma-iqlidiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}><MathText>{allRight ? '$2145 = 30 \\times 71 + 15$ مع $15 < 30$.' : GUIDE.son.right}</MathText></Feedback>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="hasr-hasil" lead="71 صفيحة مملوءة، و 72 صفيحة لكل البيض: والحاصل 2145 ÷ 30؟" />}
              {q3 && <TapQuestion
                prompt={<MathText>{'أيّ حصر صحيح لحاصل القسمة $\\frac{2145}{30}$ ؟'}</MathText>}
                options={[M('$15 < \\frac{2145}{30} < 16$'), M('$70 < \\frac{2145}{30} < 71$'), M('$71 < \\frac{2145}{30} < 72$')]}
                correct={2}
                cols={1}
                requires={['hasr-hasil']}
                explain={<MathText>{`${GUIDE.frame.why} ${GUIDE.frame.right}`}</MathText>}
                onAnswered={() => setQ3b(true)}
              />}
            </div>
          ),
        },
        {
          num: 4, title: 'لماذا لا نقبل قسمة ابن صاحب المزرعة؟', subtitle: 'السؤال 4) من الكتاب', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.questions[3]} source={ACTIVITY.source} compact>
                <div dir="ltr" className="mx-auto w-fit rounded-xl bg-sky-50 px-4 py-2 font-mono text-lg leading-relaxed text-sky-900" data-son-division>
                  {ACTIVITY.son.lines.map((l) => <div key={l}>{l}</div>)}
                </div>
              </TextbookBox>
              <TapQuestion
                prompt={<span>المساواة <bdi dir="ltr">2145 = 30 × 70 + 45</bdi> صحيحة، ومع ذلك رفضها إطارك. لماذا؟</span>}
                options={[M('لأنّ 45 أكبر من 30: تملأ صفيحة أخرى، فالحاصل 71 والباقي 15'), M('لأنّ 45 عدد فردي'), M('لأنّ 70 صفيحة تكفي لكل البيض')]}
                correct={0}
                cols={1}
                requires={['qisma-iqlidiya']}
                explain={<MathText>{`${GUIDE.son.why} ${GUIDE.son.right}`}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
