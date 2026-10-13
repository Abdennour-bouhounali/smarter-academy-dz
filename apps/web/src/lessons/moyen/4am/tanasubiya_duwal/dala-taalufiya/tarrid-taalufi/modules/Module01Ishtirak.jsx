import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACT_4, LAB, MISTAKE_FIXED } from '../content/textbook';

/**
 * Module 1 — نشاط 4 (p. 79), question 1 SEULEMENT (doublon déclaré) : l'abonnement du supporter.
 *
 * Le laboratoire `plan-compare` (écrit par cette leçon) en mode `model` : l'élève PORTE le montant de
 * l'abonnement et celui d'une entrée dans la facture (« يُدفع مرّة واحدة » / « عند كل مقابلة »), « تحقّق »
 * refuse l'abonnement payé à chaque match (MISC-TARRID-JUZ-THABIT) ; accepté, le lab écrit
 * f(x) = 200x + 2000, puis x glisse : les cibles du manuel (7 matchs, 4800DA) se rencontrent.
 *   متقدم (défaut) — نشاط 4, les nombres et les deux questions du manuel ;
 *   مبتدئ — la salle de jeux, 500DA + 150DA l'heure (plateforme, plus petits nombres).
 *
 * AUCUNE étape n'attend `onFinished` : `onModel` et `onTrial` listent, au-dessus des questions, ce que
 * l'élève a fait lui-même au niveau متقدم (`[data-activity-evidence]`, MANIPULATION_DNA §9).
 *
 * Étapes : (1) la brique « namdhaja-taalufiya », puis quelle écriture ; (2) 7 matchs ; (3) 4800DA ;
 * (4) la brique « sura-fi-wadiya » et un autre budget, puis le rappel de « مسألة الدرس » (module 5 ; les
 * deux niveaux vivent dans `intro`, la carte clôt donc la DERNIÈRE étape). LP : P1.
 *
 * « أتوقّع القاعدة » : la consigne de l'atelier ne dit plus la règle (« ما يُدفع مرّة واحدة هو الجزء الثابت… »
 * l'aurait donnée avant la brique « namdhaja-taalufiya ») ; elle pose la question.
 */
export default function Module01Ishtirak() {
  const [model, setModel] = useState(null);
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const onTrial = (tr) => {
    if (tr.kind !== 'x') return;
    setTrials((ts) => [...ts.filter((u) => u.x !== tr.x), { x: tr.x, cost: tr.costs[0] }].slice(-8));
  };

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      <li className={model ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="model" data-tried={model ? 'true' : 'false'}>
        {model ? <MathText>{`نموذجك (المستوى المتقدّم): $${model}$`}</MathText> : 'لم تتحقّق بعد من فاتورة المناصر (المستوى المتقدّم).'}
      </li>
      <li className={trials.length ? 'text-slate-800' : 'text-slate-500'} data-evidence="trials" data-tried={trials.length ? 'true' : 'false'}>
        {trials.length
          ? <span>محاولاتك: <span dir="ltr" className="font-mono">{trials.map((tr) => `x = ${tr.x} → ${tr.cost} DA`).join(' ؛ ')}</span></span>
          : 'لم تحرّك بعد عدد المقابلات x.'}
      </li>
    </ul>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 4 — اشتراك المناصر"
      moduleSubtitle="جزء يُدفع مرّة واحدة، وجزء يُدفع عند كل مقابلة"
      estimatedTime="12 دقيقة"
      objectives={[
        'كيف نبني فاتورة المناصر من جزء يُدفع مرّة واحدة وجزء يُدفع عند كل مقابلة؟',
        'كم يدفع من تابع 7 مقابلات؟',
        'كم مقابلة تابع من دفع 4800DA؟',
      ]}
      brief={{
        tag: 'نشاط 4 (السؤال 1) — الكتاب ص 79',
        headline: 'كم يدفع المناصر في الموسم؟',
        emoji: '🏟️',
        title: 'نمذجة تكلفة بجزء ثابت وجزء متغير',
        tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p><MathText>{ACT_4.text}</MathText></p>
            <ul className="list-disc space-y-0.5 ps-5 text-sm">
              {ACT_4.questions.map((q) => <li key={q}><MathText>{q}</MathText></li>)}
            </ul>
            <p className="text-sm text-slate-600">في المختبر: ضع كل مبلغ في خانته من الفاتورة، تحقّق، ثم حرّك عدد المقابلات x وراقب العمود والمستقيم.</p>
          </div>
        ),
        footer: <SourceTag source={ACT_4.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="نفس السؤال في المستويين: مبلغ يُدفع مرّة واحدة ومبلغ يُدفع عن كل وحدة، أين تضع كلًّا منهما في الفاتورة؟"
          defaultLevel="beginner"
          levels={{
            beginner: () => <Manipulation type="plan-compare" level="beginner" {...LAB.m1.beginner} />,
            advanced: () => (
              <Manipulation type="plan-compare" {...LAB.m1.advanced}
                onModel={({ tex }) => setModel(tex)} onTrial={onTrial} />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'المبلغ بدلالة عدد المقابلات', subtitle: 'ابنِ الفاتورة في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <KnowledgeBrick id="namdhaja-taalufiya" lead="ما فعلته في المختبر بالفاتورة، بكلمات الدرس:" />
              <TapQuestion
                prompt={<span>نسمّي <MathText>{'$x$'}</MathText> عدد المقابلات. أيّ دالة تعطي المبلغ الإجمالي الذي يدفعه المناصر؟</span>}
                options={[
                  <MathText key="a">{'$f(x) = 200x + 2000$'}</MathText>,
                  <MathText key="b">{'$f(x) = 2000x + 200$'}</MathText>,
                  <MathText key="c">{'$f(x) = 2200x$'}</MathText>,
                  <MathText key="d">{'$f(x) = 200x$'}</MathText>,
                ]}
                correct={0}
                cols={2}
                requires={['namdhaja-taalufiya']}
                explain={<MathText>{MISTAKE_FIXED.right}</MathText>}
                explainWrong={<MathText>{MISTAKE_FIXED.why}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'تابع المناصر 7 مقابلات', subtitle: 'السؤال الأول من الكتاب', done: q2,
          content: (
            <NumericQuestion
              prompt={<MathText>{`${ACT_4.questions[0]} (بالدينار)`}</MathText>}
              expected={ACT_4.numbers.seven}
              requires={['namdhaja-taalufiya', 'sura-taalufiya']}
              explain={<MathText>{'$f(7) = 200 \\times 7 + 2000 = 1400 + 2000 = 3400$ : يدفع المناصر 3400DA.'}</MathText>}
              onAnswered={() => setQ2(true)}
            />
          ),
        },
        {
          num: 3, title: 'دفع المناصر 4800DA', subtitle: 'السؤال الثاني من الكتاب', done: q3,
          content: (
            <NumericQuestion
              prompt={<MathText>{ACT_4.questions[1]}</MathText>}
              expected={ACT_4.numbers.matches4800}
              requires={['namdhaja-taalufiya', 'sura-taalufiya', 'hall-muadala']}
              explain={<MathText>{'$200x + 2000 = 4800$ أي $200x = 2800$ ومنه $x = 14$ : تابع 14 مقابلة. تحقّق: $200 \\times 14 + 2000 = 4800$ .'}</MathText>}
              onAnswered={() => setQ3(true)}
            />
          ),
        },
        {
          num: 4, title: 'ما السؤال الذي نطرحه على الدالة؟', subtitle: 'في لغة الوضعية', done: q4,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="sura-fi-wadiya" lead="ماذا يقابل سؤالَي الوضعية عند الدالة؟" />
              <NumericQuestion
                prompt={<span>بالدالة نفسها <MathText>{'$f(x) = 200x + 2000$'}</MathText> : كم مقابلة تابع مناصر دفع 3000DA ؟</span>}
                expected={5}
                requires={['sura-fi-wadiya']}
                explain={<MathText>{'$200x + 2000 = 3000$ أي $200x = 1000$ ومنه $x = 5$ مقابلات.'}</MathText>}
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
