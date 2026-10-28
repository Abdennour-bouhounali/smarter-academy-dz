import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseDec, getLessonPath } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, BASKET, RECALL } from '../content/textbook';

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
 * Déploiement du prototype (2026-10-28) : le reste, l'égalité, le حصر et la division du fils sont posés PAR-DESSUS le labo
 * (`EggTrays › CHAINS`, étapes order / then / claim) ; les étapes 2 à 4 en gardent la TRACE (`checkpoint-done` au niveau متقدم).
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
  const record = (e) => setTrials((list) => [...list, e]);
  const { a, b } = ACTIVITY.numbers;
  // les questions posées PAR-DESSUS le labo (LabCheckpoint), au niveau متقدم (la commande 2145 encadrée juste)
  const answered = (id) => trials.some((e) => e.tk === 'checkpoint-done' && e.id === id);
  const advOrder = answered('order') && trials.some((e) => e.kind === 'frame' && e.a === a && e.b === b && e.ok);
  const q4 = answered('claim');
  const Trace = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );
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
          num: 1, title: 'أحصر 2145 بين مضاعفين متتاليين للعدد 30', subtitle: 'بين مضاعفين متتاليين', done: q1,
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
          num: 2, title: 'الصفائح المملوءة، والصفيحة غير المملوءة', subtitle: 'الصفائح والباقي', done: q2a && advOrder,
          content: (
            <div className="space-y-3">
              <EvidenceFrames />
              <NumericQuestion prompt={<span>عدد الصفائح التي يمكن ملؤها:</span>} expected={71} parse={parseDec}
                requires={['qisma-iqlidiya']} explain={<MathText>{'$30 \\times 71 = 2130$ و 72 صفيحة تحتاج 2160 بيضة.'}</MathText>}
                onAnswered={() => setQ2a(true)} />
              <Trace id="rest" ok={advOrder}
                done={<MathText>{'أجبتَ في المختبر: بقيت $15$ بيضة في الصفيحة غير المملوءة، و $15 < 30$.'}</MathText>}
                todo="املأ الطلبية في المستوى المتقدّم، وأجب عن الأسئلة التي تظهر فوق المختبر." />
            </div>
          ),
        },
        {
          num: 3, title: 'المساواة، ثم أين يقع حاصل القسمة؟', subtitle: 'المساواة والحصر', done: advOrder,
          content: (
            <div className="space-y-3">
              <Trace id="write" ok={advOrder}
                done={<MathText>{'أجبتَ في المختبر: $2145 = 30 \\times 71 + 15$ مع $15 < 30$ ، و $71 < \\frac{2145}{30} < 72$ .'}</MathText>}
                todo="املأ الطلبية في المستوى المتقدّم، وأجب عن الأسئلة التي تظهر فوق المختبر." />
              {advOrder && <KnowledgeBrick id="hasr-hasil" lead="71 صفيحة مملوءة، و 72 صفيحة لكل البيض: والحاصل 2145 ÷ 30؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'لماذا لا نقبل قسمة ابن صاحب المزرعة؟', subtitle: 'قسمة الابن', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.questions[3]} source={ACTIVITY.source} compact>
                <div dir="ltr" className="mx-auto w-fit rounded-xl bg-sky-50 px-4 py-2 font-mono text-lg leading-relaxed text-sky-900" data-son-division>
                  {ACTIVITY.son.lines.map((l) => <div key={l}>{l}</div>)}
                </div>
              </TextbookBox>
              <Trace id="claim" ok={q4}
                done={<span>أجبتَ في المختبر: المساواة <bdi dir="ltr">2145 = 30 × 70 + 45</bdi> صحيحة، لكنّ 45 أكبر من 30 فتملأ صفيحة أخرى: الحاصل 71 والباقي 15.</span>}
                todo="بعد البيض الإضافي في المستوى المتقدّم، احكم على قسمة الابن وأجب عن الأسئلة فوق المختبر." />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
