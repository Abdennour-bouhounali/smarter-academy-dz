import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACT, CHECKUP, GUIDE } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 25) « أيّ حساب أقوم به؟ ».
 *
 * LABORATOIRE À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels), un seul type `story-bars` :
 *
 *   مبتدئ  — LA TOISE de la visite médicale (plateforme, déclarée) : l'élève TIRE la taille inconnue jusqu'à ce que la
 *            phrase soit vraie, puis choisit le calcul qui la donne. Deux pièges : نزيم (« تزيد » mais 130 − 9) et
 *            ياسين (« تنقص » mais 130 + 5).
 *   متقدم  — LES SIX TEXTES ET LES SIX BULLES du manuel : sans toise ni lecture, l'élève pose chaque bulle sur son texte ;
 *            la bande ne se ferme que pour la bonne opération (① « ينقصه » ⇒ +, ③ « زادت » ⇒ −).
 *
 * Les ÉTAPES sont les deux textes-pièges du manuel, répondus DEPUIS LES ESSAIS de l'élève (listés au-dessus de la
 * question, `[data-activity-evidence]`), puis la règle (brique gardée par « أتوقّع القاعدة ») et un tri des autres
 * situations. Rien n'est dit avant la manipulation : les options ne portent pas la vérification (DNA §9). LP : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const VERDICT = { true: '✓', false: '✗' };
// « 24,5 − 11,5 » (le calcul tel que le labo l'écrit) → un îlot KaTeX.
const tex = (calc) => `$${String(calc ?? '').replace(/−/g, '-').replace(/,/g, '{,}')}$`;

export default function Module01Nashat() {
  // Les essais VALIDÉS des deux niveaux (onTrial, via state.report) : la mémoire des preuves de l'élève.
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const cardsOn = (n) => trials.filter((e) => e.story === 'act1' && e.kind === 'card' && String(e.item) === `t${n}`);
  const calcsOf = (story) => trials.filter((e) => e.story === story && e.kind === 'calc');

  const evidence = (n) => {
    const cards = cardsOn(n);
    return (
      <li data-evidence={`act1-${n}`} data-tried={cards.length ? 'true' : 'false'} className={cards.length ? 'font-bold text-slate-800' : 'text-slate-500'}>
        {cards.length
          ? <span>النصّ {n}: {cards.map((e, i) => <span key={i} className="ms-1"><MathText>{tex(e.calc)}</MathText> {VERDICT[e.ok]}</span>)}</span>
          : `النصّ ${n}: لم تضع عليه بطاقة بعد في المستوى المتقدّم.`}
      </li>
    );
  };
  const checkupCalcs = calcsOf('checkup');

  return (
    <ContentModule
      objectives={['كيف نعرف أيّ حساب نقوم به في وضعية؟', 'هل كلمة «يزيد» تعني دائمًا أن نجمع؟', 'متى نجمع ومتى نطرح؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — أيّ حساب أقوم به؟"
      moduleSubtitle="من الأطول؟ ومن الأقصر؟"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'نشاط 1 — الفحص الطبي المدرسي',
        headline: 'من الأطول؟',
        emoji: '📏',
        title: ACTIVITY.title,
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{CHECKUP.situation}</MathText></p>
            <p className="font-semibold">{CHECKUP.question}</p>
          </div>
        ),
        footer: <SourceTag source={CHECKUP.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بالمستوى المبتدئ (مقياس القامة)، ثم انتقل إلى المتقدّم: نصوص الكتاب الستة وبطاقاته الست."
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation type="story-bars" level="beginner" story="checkup"
                  lead="اسحب رأس التلميذ حتى تصدق الجملة. ثم اختر الحساب الذي يعطي قامته."
                  onTrial={record} />
                <SourceTag source={CHECKUP.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <TextbookBox kind="situation" lines={[ACTIVITY.instruction]} source={ACTIVITY.source} compact />
                <Manipulation type="story-bars" level="advanced" story="act1"
                  lead="ضع كل بطاقة على النصّ الذي يناسبها. لا مقياس هنا: قرّر أنت، والمخطط يحكم."
                  onTrial={record} />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'النصّ ③: أيّ حساب يعطي علامة يونس؟', subtitle: 'ضع بطاقة على النصّ ③ في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACT[3].text} source={ACTIVITY.source} compact />
              {/* LES PREUVES DE L'ÉLÈVE : ce qu'il a posé sur le texte ③, et ses calculs à la toise. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {evidence(3)}
                <li data-evidence="checkup" data-tried={checkupCalcs.length ? 'true' : 'false'} className={checkupCalcs.length ? 'font-bold text-slate-800' : 'text-slate-500'}>
                  {checkupCalcs.length
                    ? <span>حساباتك أمام مقياس القامة: {checkupCalcs.map((e, i) => <span key={i} className="ms-1"><MathText>{tex(e.calc)}</MathText> {VERDICT[e.ok]}</span>)}</span>
                    : 'مقياس القامة: لم تختر أيّ حساب بعد في المستوى المبتدئ.'}
                </li>
              </ul>
              <TapQuestion
                prompt={<span>أيّ حساب يعطي العلامة التي تحصّل عليها يونس؟</span>}
                options={[M('$17{,}5 + 1{,}5$'), M('$17{,}5 - 1{,}5$'), M('$1{,}5 - 17{,}5$')]}
                correct={1}
                cols={3}
                requires={['jam-tarh-tabii']}
                explain={<span><MathText>{GUIDE.keyword.why}</MathText> <MathText>{GUIDE.keyword.right}</MathText></span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'النصّ ①: ما ثمن الكرّاس؟', subtitle: 'كلمة «ينقصه»… هل نطرح؟', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACT[1].text} source={ACTIVITY.source} compact />
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>{evidence(1)}</ul>
              <TapQuestion
                prompt={<span>أيّ حساب يعطي ثمن الكرّاس؟</span>}
                options={[M('$24{,}5 - 11{,}5$'), M('$24{,}5 + 11{,}5$'), M('$11{,}5 - 24{,}5$')]}
                correct={1}
                cols={3}
                requires={['jam-tarh-tabii']}
                explain={<span><MathText>{GUIDE.lacking.why}</MathText> <MathText>{GUIDE.lacking.right}</MathText></span>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'متى نجمع ومتى نطرح؟', subtitle: 'اكتب قاعدتك، ثم صنّف وضعيات أخرى', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ikhtiyar-amaliya" lead="الكلمة وحدها لم تكفِ في النصّين: ما الذي قرّر العملية في كل مرّة؟" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">في كل وضعية: هل المجهول هو الكلّ أم جزء منه؟</p>}
                rows={[
                  { id: 'r6', label: <MathText>{'النصّ ⑥: مقدار الزيادة في سعر اللتر، من $22{,}60$ إلى $31{,}02$'}</MathText>, options: ['المجهول هو الكلّ: نجمع', 'المجهول جزء: نطرح'], correct: 1,
                    correction: <MathText>{'السعر الجديد $31{,}02$ هو الكلّ: الزيادة جزء منه، $31{,}02 - 22{,}60 = 8{,}42$.'}</MathText> },
                  { id: 'r4', label: <MathText>{'النصّ ④: الحساب الذي يُظهر 19 باستعمال $17{,}5$ و $1{,}5$'}</MathText>, options: ['المجهول هو الكلّ: نجمع', 'المجهول جزء: نطرح'], correct: 0,
                    correction: <MathText>{'19 أكبر من العددين: هو الكلّ، $17{,}5 + 1{,}5 = 19$.'}</MathText> },
                  { id: 'ry', label: <MathText>{'تنقص قامة سارة ($130\\,\\mathrm{cm}$) عن قامة ياسين بـ $5\\,\\mathrm{cm}$: قامة ياسين'}</MathText>, options: ['المجهول هو الكلّ: نجمع', 'المجهول جزء: نطرح'], correct: 0,
                    correction: <MathText>{'ياسين هو الأطول، فقامته هي الكلّ: $130 + 5 = 135$ ، رغم كلمة «تنقص».'}</MathText> },
                ]}
                requires={['ikhtiyar-amaliya']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: ابحث عن الكلّ قبل أن تحسب.' : 'ابحث عن العدد الأكبر في الوضعية: هو الكلّ.'}
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
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
