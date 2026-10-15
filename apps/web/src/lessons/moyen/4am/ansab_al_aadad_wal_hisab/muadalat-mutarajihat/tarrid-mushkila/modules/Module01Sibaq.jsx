import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_MODELLING, RACE, MISTAKE_ONE_X } from '../content/textbook';

/**
 * Module 1 — l'entrée dans la طريقة « ترييض مشكلة » (p. 49) par la course des âges.
 *
 * Le manuel n'a PAS d'activité pour ce sujet : sa seule matière est l'exercice résolu de
 * la طريقة. Le laboratoire (growth-race) est donc une expérience de la PLATEFORME,
 * déclarée (`platform_adaptation`, lesson.config.js) : sa mathématique est la طريقة.
 *
 *   مبتدئ  — un père de 30 ans et son fils de 6 ans, « ضعف عمر الابن » : deux cartes,
 *            un groupe « 2 × » ; la rencontre à 18 ans.
 *   متقدم  — l'exercice du manuel (défaut) : 36 ans et trois enfants 4, 6, 8 ; trois
 *            cartes « + x » à poser — un enfant oublié est refusé par « تحقّق ».
 *
 * AUCUNE étape n'attend `onFinished` (ce n'est pas une activité du manuel, §7bis) :
 * `onModel` et `onTrial` listent, au-dessus des questions, ce que l'élève a fait lui-même
 * au niveau متقدم (`[data-activity-evidence]`).
 *
 * UNE PISTE (rétrofit 2026-10-15) : labo en tête SANS carte ni titre de workspace (le contexte est le `lead` du labo متقدم).
 * Étapes : (1) POURQUOI chaque enfant porte son « + x » (le labo a déjà fait construire le modèle) ; (2) جـ) la solution — depuis SES
 * essais —, PUIS la brique « tarrid-namdhaja » ; (3) التحقق. LP : P1, P2.
 */
export default function Module01Sibaq() {
  const [model, setModel] = useState(null);
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const addTrial = (tr) => setTrials((ts) => (ts.some((u) => u.x === tr.x) ? ts : [...ts, tr]));

  const evidence = (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      <li className={model ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="model" data-tried={model ? 'true' : 'false'}>
        {model ? <MathText>{`نموذجك (المستوى المتقدّم): $${model}$`}</MathText> : 'لم تتحقّق بعد من نموذج الأبناء الثلاثة (المستوى المتقدّم).'}
      </li>
      <li className={trials.length ? 'text-slate-800' : 'text-slate-500'} data-evidence="trials" data-tried={trials.length ? 'true' : 'false'}>
        {trials.length
          ? <span>محاولاتك في السباق: <span dir="ltr" className="font-mono">{trials.map((tr) => `x = ${tr.x} : ${tr.leftText} ${tr.rel} ${tr.rightText}`).join(' ؛ ')}</span></span>
          : 'لم تسجّل بعد أي محاولة في السباق.'}
      </li>
    </ul>
  );

  return (
    <ContentModule
      objectives={["من يكبر مع الزمن في هذه العائلة؟ وماذا يحمل كل واحد منهم؟", "متى يتساوى عمر الأب مع مجموع أعمار أبنائه؟", "هل يلائم العدد الذي وجدناه نصّ المشكلة؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="سباق الأعمار — من النص إلى المعادلة"
      moduleSubtitle="من يحمل x؟"
      estimatedTime="13 دقيقة"
      intro={
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="growth-race"
                level="beginner"
                theme="ages"
                left={RACE.beginner.left}
                right={RACE.beginner.right}
                goal="equal"
                title="أب عمره 30 سنة وابنه 6 سنوات"
                mission="بعد كم سنة يكون عمر الأب ضعف عمر الابن؟ ضع البطاقة «+ x» على كل من يكبر، ثم تحقّق من النموذج."
              />
            ),
            advanced: () => (
              <Manipulation
                type="growth-race"
                theme="ages"
                left={RACE.advanced.left}
                right={RACE.advanced.right}
                goal="equal"
                title="مثال الكتاب: أب عمره 36 سنة وأبناؤه 4 و 6 و 8"
                lead="عمر الأب 36 سنة وأعمار أبنائه الثلاثة 4 و 6 و 8: ضع البطاقة «+ x» على كل من يكبر، ثم تحقّق من نموذجك."
                onModel={({ tex }) => setModel(tex)}
                onTrial={addTrial}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا يحمل كل ابن «+ x» وحده؟', subtitle: 'ابنِ النموذج في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {evidence}
              <TapQuestion
                prompt={<span>في نموذج الأبناء الثلاثة وضعتَ «+ x» على كل ابن، لا «+ x» واحدة على مجموع أعمارهم. لماذا؟</span>}
                options={[
                  'لأنّ كل ابن يكبر بـ x سنة، فمجموع أعمار الأبناء الثلاثة يزيد ثلاث مرّات x',
                  'لأنّ مجموع أعمار الأبناء يزيد بـ x سنة فقط مهما كان عدد الأبناء',
                  'لأنّ الأب وحده هو الذي يكبر مع الزمن',
                ]}
                correct={0}
                cols={1}
                requires={['hal-muadala']}
                explain={<span className="block space-y-1"><MathText>{MISTAKE_ONE_X.why}</MathText><MathText>{MISTAKE_ONE_X.right}</MathText></span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'جـ) بعد كم سنة؟', subtitle: 'السباق يعطيك الجواب: تحقّق منه بالحساب', done: q2,
          content: (
            <div className="space-y-3">
              {evidence}
              <NumericQuestion
                prompt={<span>المعادلة تُكتب <MathText>{'$36 + x = 3x + 18$'}</MathText>. بعد كم سنة يكون عمر الأب مساويًا مجموع أعمار أبنائه؟</span>}
                expected={9}
                requires={['hal-muadala']}
                explain={<MathText>{'$36 - 18 = 3x - x$ أي $2x = 18$ ومنه $x = 9$ : بعد 9 سنوات.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="tarrid-namdhaja" lead="ما فعلته بالبطاقات هو الخطوة «ب)» من طريقة الكتاب:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'التحقق: هل يلائم الحلّ نصّ المشكلة؟', subtitle: 'نعوّض الحل في نص المشكلة', done: q3,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">بعد 9 سنوات:</p>}
                rows={[
                  { id: 'father', label: 'عمر الأب', options: ['45 سنة', '36 سنة', '54 سنة'], correct: 0, correction: <MathText>{'$36 + 9 = 45$'}</MathText> },
                  { id: 'kids', label: 'أعمار الأبناء', options: ['13 و 15 و 17', '4 و 6 و 17', '13 و 15 و 8'], correct: 0, correction: 'كل ابن يكبر بـ 9 سنوات.' },
                  { id: 'sum', label: 'مجموع أعمار الأبناء', options: [<MathText key="a">{'$13 + 15 + 17 = 45$'}</MathText>, <MathText key="b">{'$4 + 6 + 8 + 9 = 27$'}</MathText>, <MathText key="c">{'$13 + 15 + 17 = 54$'}</MathText>], correct: 0, correction: <MathText>{METHOD_MODELLING.solution[3]}</MathText> },
                ]}
                requires={['tarrid-namdhaja']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'تمامًا: $45 = 13 + 15 + 17$ ، فالعدد 9 يحقّق نص المشكلة نفسه، لا المعادلة فقط.'
                      : 'بعد 9 سنوات يكبر كل واحد بـ 9 سنوات: الأب 45، والأبناء 13 و 15 و 17.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
