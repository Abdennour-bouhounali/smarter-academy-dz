import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, FLOWERS, GUIDE } from '../content/textbook';

/**
 * Module 1 — نشاط 3 (p. 37) « القسمة الإقليدية » : 279 fleurs, des bouquets de 14.
 *
 * LABORATOIRE À DEUX NIVEAUX, un seul type `division-jumps` (b est DONNÉ, la main tient q) :
 *   مبتدئ  — 47 fleurs DESSINÉES (plateforme, thème `garden`) : l'élève tire le ruban le long de la rangée ; un bouquet de
 *            trop manque de fleurs, un de moins en laisse assez pour un autre ; puis 48 fleurs ferment un bouquet de plus.
 *   متقدم  — les 279 fleurs du manuel sur la droite graduée par sauts de 14, sans multiples écrits : « 10 باقات؟ 20 باقة؟ ».
 *
 * Les ÉTAPES sont les questions du manuel (أ, ب, ج, هـ), répondues DEPUIS LES ESSAIS de l'élève (listés au-dessus,
 * `[data-activity-evidence]`) ; la règle (brique gardée par « أتوقّع القاعدة ») vient après ج. La question د (يونس et la
 * division posée) est le module 2. LP : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const BOUQUETS = { 10: '10 باقات', 20: '20 باقة' };
const KIND = { over: 'نقصت الأزهار', short: 'تكفي الأزهار الباقية لباقة أخرى', exact: 'لا تكفي الأزهار الباقية لباقة أخرى' };

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3a, setQ3a] = useState(false);
  const [q3b, setQ3b] = useState(false);
  const [q4, setQ4] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const { a, b } = ACTIVITY.numbers;
  const ofTextbook = trials.filter((e) => e.a === a && e.b === b);
  const tried = (q) => ofTextbook.find((e) => e.q === q);

  return (
    <ContentModule
      objectives={['كم باقة كاملة نستطيع أن نشكّل؟', 'متى نتوقّف عن تشكيل الباقات؟', 'كيف نكتب ما وجدناه بمساواة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — باقات الزهور"
      moduleSubtitle="كم باقة كاملة؟ وماذا يبقى؟"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'نشاط 3 — باقات العرفان',
        headline: 'باقات لعيد المعلّم!',
        emoji: '💐',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p>{FLOWERS.situation}</p>
            <p className="font-semibold">{FLOWERS.question}</p>
          </div>
        ),
        footer: <SourceTag source={FLOWERS.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بالمستوى المبتدئ (47 زهرة)، ثم انتقل إلى المتقدّم: أزهار الكتاب الـ 279 على مستقيم مدرّج."
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation type="division-jumps" level="beginner" world="flowers" a={FLOWERS.numbers.a} b={FLOWERS.numbers.b}
                  lead="اسحب الشريط على صفّ الزهور: كل باقة 6 زهرات. متى تتوقّف؟" onTrial={record} />
                <SourceTag source={FLOWERS.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <TextbookBox kind="situation" text={ACTIVITY.situation} source={ACTIVITY.source} compact />
                <Manipulation type="division-jumps" level="advanced" world="line" a={a} b={b}
                  lead="كل قفزة باقة من 14 زهرة. قدّر أوّلًا: هل تصل 10 قفزات؟ 20 قفزة؟" onTrial={record} />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'هل يمكن تشكيل 10 باقات؟ 20 باقة؟', subtitle: 'جرّب 10 ثم 20 في المستوى المتقدّم', done: q1,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {[10, 20].map((q) => {
                  const e = tried(q);
                  return (
                    <li key={q} data-evidence={q} data-tried={e ? 'true' : 'false'} className={e ? 'font-bold text-slate-800' : 'text-slate-500'}>
                      {e ? <span>{BOUQUETS[q]}: {KIND[e.kind] ?? ''}.</span> : `${BOUQUETS[q]}: لم تجرّبها بعد في المستوى المتقدّم.`}
                    </li>
                  );
                })}
              </ul>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">بـ 279 زهرة وباقات من 14 زهرة:</p>}
                rows={[
                  { id: 'b10', label: '10 باقات', options: ['ممكن', 'غير ممكن'], correct: 0, correction: <MathText>{'$14 \\times 10 = 140$ و $140 < 279$ : تكفي الأزهار.'}</MathText> },
                  { id: 'b20', label: '20 باقة', options: ['ممكن', 'غير ممكن'], correct: 1, correction: <MathText>{'$14 \\times 20 = 280$ و $280 > 279$ : تنقص زهرة واحدة.'}</MathText> },
                ]}
                requires={['darb-tabii']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا.' : 'قارن الجداء بعدد الأزهار.'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'بين أيّ عددين متتاليين نحصر الحاصل؟', subtitle: 'السؤال ب) من الكتاب', done: q2,
          content: (
            <TapQuestion
              prompt={<MathText>{'أتمم الحصر: $14 \\times \\ldots < 279 < 14 \\times \\ldots$'}</MathText>}
              options={[M('$14 \\times 19 < 279 < 14 \\times 20$'), M('$14 \\times 18 < 279 < 14 \\times 19$'), M('$14 \\times 20 < 279 < 14 \\times 21$')]}
              correct={0}
              cols={1}
              requires={['darb-tabii']}
              explain={<MathText>{'$14 \\times 19 = 266$ و $14 \\times 20 = 280$ : $266 < 279 < 280$.'}</MathText>}
              onAnswered={() => setQ2(true)}
            />
          ),
        },
        {
          num: 3, title: 'كم باقة على الأكثر؟ وهل تبقى أزهار؟', subtitle: 'السؤال ج) من الكتاب', done: q3a && q3b,
          content: (
            <div className="space-y-3">
              <NumericQuestion prompt={<span>أكبر عدد ممكن من الباقات:</span>} expected={19} parse={parseDec}
                requires={['darb-tabii']} explain={<MathText>{'19 باقة تستعمل $14 \\times 19 = 266$ زهرة، و 20 باقة تحتاج 280.'}</MathText>}
                onAnswered={() => setQ3a(true)} />
              <NumericQuestion prompt={<span>عدد الأزهار التي تبقى:</span>} expected={13} parse={parseDec}
                requires={['tarh-tabii']} explain={<MathText>{'$279 - 266 = 13$ ، و 13 لا تكفي لباقة أخرى من 14.'}</MathText>}
                onAnswered={() => setQ3b(true)} />
            </div>
          ),
        },
        {
          num: 4, title: 'متى نتوقّف؟ وكيف نكتب ما وجدناه؟', subtitle: 'اكتب قاعدتك، ثم أتمم المساواة هـ)', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qisma-iqlidiya" lead="ما الذي جعلك تتوقّف عند 19 باقة، ولم يجعلك تنتظر أن لا يبقى شيء؟" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'أتمم المساواة $279 = 14 \\times \\ldots + \\ldots$'}</MathText></p>}
                rows={[
                  { id: 'q', label: 'العدد بعد 14 ×', options: ['19', '20', '13'], correct: 0, correction: 'عدد الباقات الكاملة: 19.' },
                  { id: 'r', label: 'العدد بعد +', options: ['13', '27', '0'], correct: 0, correction: <MathText>{'ما يبقى: 13 ، و $13 < 14$. (27 أكبر من 14: تكفي لباقة أخرى.)'}</MathText> },
                ]}
                requires={['qisma-iqlidiya']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight ? '$279 = 14 \\times 19 + 13$ مع $13 < 14$.' : GUIDE.stop.right}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ4(true)}
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
