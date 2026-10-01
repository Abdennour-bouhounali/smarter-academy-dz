import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { PitchScene } from '../../../../../../common/manipulations/primitives/PitchBackdrop';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, ACTIVITY_A, ELIAS_AMINE, HOOK } from '../content/textbook';

/**
 * Module 1 — نشاط 2 (p. 44) : « خاصية الجداء المعدوم » puis « تطبيق أ », ouvert sur
 * le monde de l'unité 3 : le terrain de football dont les deux CÔTÉS sont les deux
 * FACTEURS (vanishing-pitch).
 *
 * LABORATOIRE À DEUX NIVEAUX, UN INSTRUMENT — même objectif : A × B = 0 ⇔ A = 0 أو B = 0.
 *   مبتدئ : 3(x − 5) (تطبيق أ، س 1) — le côté 3 ne s'écrase JAMAIS, une solution ;
 *   متقدم (ouvert par défaut — c'est l'équation de س 3) : (x − 2)(x + 5), deux côtés
 *          qui bougent, deux solutions, un côté qui se retourne entre −5 et 2.
 * AUCUNE étape n'attend `onFinished` : `onTrial` sert seulement à lister, au-dessus
 * des questions, les épingles et les refus de l'élève (`[data-activity-evidence]`).
 *
 * Étapes : (1) « انقل وأكمل » (س 1 et 2 de la partie الجداء المعدوم) ; (2) quand le
 * terrain disparaît-il ? — س 3 « عبّر لغويا », puis la brique khassiya-jidaa-maadum ;
 * (3) إلياس et أمين (تطبيق أ، س 1) ; (4) −1,2(3x + 2,7) = 0 des deux façons (س 2) ;
 * (5) (x − 2)(x + 5) = 0 (س 3) : le نشر d'إلياس échoue, la propriété réussit.
 * LP : P1, P2.
 */
const { beginner: BEGINNER, advanced: ADVANCED } = ACTIVITY.numbers;
const LABEL = { [BEGINNER]: '3(x - 5)', [ADVANCED]: '(x - 2)(x + 5)' };
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState({ [BEGINNER]: [], [ADVANCED]: [] });
  const [q1a, setQ1a] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5a, setQ5a] = useState(false);
  const [q5, setQ5] = useState(false);

  const onTrial = (expr) => (tr) => setTrials((all) => ({ ...all, [expr]: [...all[expr].filter((u) => u.x !== tr.x), tr] }));

  const evidence = (exprs) => (
    <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
      {exprs.map((expr) => (
        <li key={expr} data-evidence={expr} data-tried={trials[expr].length ? 'true' : 'false'} className={trials[expr].length ? 'text-slate-800' : 'text-slate-500'}>
          <MathText>{`الملعب $${LABEL[expr]}$ :`}</MathText>{' '}
          {trials[expr].length === 0
            ? `لم تثبّت أي قيمة بعد (${expr === BEGINNER ? 'المستوى المبتدئ' : 'المستوى المتقدّم'}).`
            : (
              <span className="inline-flex flex-wrap gap-1.5" dir="ltr">
                {trials[expr].map((tr) => (
                  <span key={tr.x} data-trial-ok={tr.ok ? 'true' : 'false'} className={`rounded-lg px-2 py-0.5 text-xs font-bold ${tr.ok ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                    <MathText>{`$x = ${tr.xTex}$ : $${tr.areaTex}$ ${tr.ok ? '✓' : '✗'}`}</MathText>
                  </span>
                ))}
              </span>
            )}
        </li>
      ))}
    </ul>
  );

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 2 — خاصية الجداء المعدوم"
      moduleSubtitle="متى ينعدم جداء عاملين؟"
      estimatedTime="13 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 44',
        headline: HOOK.headline,
        emoji: '⚽',
        title: ACTIVITY_A.title,
        tone: 'indigo',
        visual: <PitchScene />,
        body: (
          <div className="space-y-2">
            <p><MathText>{HOOK.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'في المستوى المبتدئ ملعب ضلعاه $3$ و $x - 5$ : مساحته $3(x - 5)$.'}</MathText></p>
          </div>
        ),
        footer: <div className="flex flex-wrap gap-2"><SourceTag source={ACTIVITY.source} /><SourceTag source={HOOK.source} /></div>,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          defaultLevel="advanced"
          lead="نفس الفكرة في المستويين: ضلعا الملعب هما عاملا الجداء، ومساحته هي الجداء. متى تنعدم؟"
          levels={{
            beginner: () => (
              <Manipulation
                type="vanishing-pitch"
                level="beginner"
                expr={BEGINNER}
                title="ملعب ضلعاه 3 و x − 5: متى يختفي؟"
                lead="الضلع A طوله 3 دائمًا، والضلع B طوله x − 5. حرّك x وراقب: أيّ الضلعين يمكن أن ينعدم؟"
                onTrial={onTrial(BEGINNER)}
              />
            ),
            advanced: () => (
              <Manipulation
                type="vanishing-pitch"
                level="advanced"
                expr={ADVANCED}
                title="نشاط 2: ملعب ضلعاه x − 2 و x + 5"
                lead="الضلعان يتغيّران معًا. جد كل قيم x التي يختفي عندها الملعب، ثم احكم: هل بقيت قيم أخرى؟"
                onTrial={onTrial(ADVANCED)}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'الجداء المعدوم', subtitle: 'انقل وأكمل — السؤالان 1 و 2', done: q1,
          content: (
            <div className="space-y-3">
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY_A.questions[0]}</MathText> <SourceTag source={ACTIVITY_A.source} /></p>}
                rows={ACTIVITY_A.products.map(({ known, missing }, i) => {
                  const label = missing === 'right' ? `$${known} \\times \\ldots = 0$` : `$\\ldots \\times ${known} = 0$`;
                  const wrong1 = known.startsWith('-') ? known.slice(1) : `-${known}`;
                  return {
                    id: `p${i}`, label: M(label),
                    options: [M('$1$'), M('$0$'), M(`$${wrong1}$`)],
                    correct: 1,
                    correction: M(missing === 'right' ? `$${known} \\times 0 = 0$ : العدد $${known}$ ليس معدومًا، فالعامل الآخر هو الذي ينعدم.` : `$0 \\times ${known} = 0$ : العدد $${known}$ ليس معدومًا، فالعامل الآخر هو الذي ينعدم.`),
                  };
                })}
                requires={['darb-nisbiya']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'في كل مرّة أحد العاملين معلوم وغير معدوم: الجداء لا ينعدم إلا إذا كان العامل الآخر $0$.'
                      : 'جداء عدد غير معدوم في $1$ أو في عدده المعاكس ليس $0$ : جرّب كل اقتراح بالحساب.'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ1a(true)}
              />
              {q1a && (
                <TapQuestion
                  prompt={<MathText>{ACTIVITY_A.questions[1]}</MathText>}
                  options={[M('$a = 0$ و $b = 0$ معًا'), M('$a = 0$ أو $b = 0$'), M('$a = 1$ أو $b = 1$')]}
                  correct={1}
                  cols={1}
                  requires={['darb-nisbiya']}
                  explain={<MathText>{'يكفي أن يكون أحد العددين معدومًا: $0 \\times 5 = 0$ و $5 \\neq 0$. إذن $a = 0$ أو $b = 0$ ، وقد يكونان معدومين معًا.'}</MathText>}
                  onAnswered={() => setQ1(true)}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'متى يختفي الملعب؟', subtitle: 'ثبّت الحلول في المختبر، ثم السؤال 3', done: q2,
          content: (
            <div className="space-y-3">
              {/* LES ESSAIS DE L'ÉLÈVE, et rien d'autre. */}
              {evidence([BEGINNER, ADVANCED])}
              <TapQuestion
                prompt={<MathText>{ACTIVITY_A.questions[2]}</MathText>}
                options={[
                  M('إذا كان جداء عاملين معدوما فإن العاملين معدومان معًا.'),
                  M('إذا كان أحد العاملين سالبًا فإن الجداء معدوم.'),
                  M(ACTIVITY_A.statement),
                ]}
                correct={2}
                cols={1}
                requires={['darb-nisbiya']}
                explain={<MathText>{'في المختبر اختفى الملعب كلّما صار أحد ضلعيه $0$ ، ولو بقي الضلع الآخر غير معدوم: في $3(x - 5)$ الضلع $3$ لا ينعدم أبدًا والملعب يختفي عند $x = 5$. وضلع سالب يعطي مساحة سالبة، لا معدومة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="khassiya-jidaa-maadum" lead="ما رأيته في الملعب يسمّيه الكتاب:" />}
            </div>
          ),
        },
        {
          num: 3, title: 'كرّاسا إلياس وأمين', subtitle: 'تطبيق أ — السؤال 1', done: q3,
          content: (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <TextbookBox kind="example" title="كرّاس إلياس" lines={ACTIVITY.elias} source={ACTIVITY.source} compact />
                <TextbookBox kind="example" title="كرّاس أمين" lines={ACTIVITY.amine} source={ACTIVITY.source} compact />
              </div>
              <TapQuestion
                prompt={<MathText>{ACTIVITY.questions[0]}</MathText>}
                options={['إلياس', 'أمين', 'كلاهما']}
                correct={1}
                cols={3}
                requires={['khassiya-jidaa-maadum']}
                explain={<MathText>{`${ELIAS_AMINE.amineMethod} ${ELIAS_AMINE.eliasMethod}`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'بالطريقتين', subtitle: 'تطبيق أ — السؤال 2', done: q4,
          content: (
            <BatchChoiceQuestion
              intro={<p className="text-sm font-semibold text-slate-700"><MathText>{ACTIVITY.questions[1]}</MathText></p>}
              rows={[
                { id: 'e', label: 'بطريقة إلياس، ننشر:', options: [M('$-3{,}6x + 2{,}7 = 0$'), M('$-3{,}6x - 3{,}24 = 0$'), M('$3{,}6x - 3{,}24 = 0$')], correct: 1,
                  correction: M('$-1{,}2 \\times 3x = -3{,}6x$ و $-1{,}2 \\times 2{,}7 = -3{,}24$ ، ثم $-3{,}6x = 3{,}24$ أي $x = \\dfrac{3{,}24}{-3{,}6} = -0{,}9$ .') },
                { id: 'a', label: 'بطريقة أمين:', options: [M('$3x + 2{,}7 = 0$ لأنّ $-1{,}2 \\neq 0$'), M('$3x = 2{,}7$'), M('$x = -1{,}2$')], correct: 0,
                  correction: M('بما أنّ $-1{,}2 \\neq 0$ فإنّ $3x + 2{,}7 = 0$ ، أي $3x = -2{,}7$ و $x = -0{,}9$ .') },
                { id: 's', label: 'الحل في الطريقتين:', options: [M('$0{,}9$'), M('$-1{,}2$'), M('$-0{,}9$')], correct: 2,
                  correction: M('التحقّق: $3 \\times (-0{,}9) + 2{,}7 = 0$ ، إذن $-1{,}2 \\times 0 = 0$ .') },
              ]}
              requires={['khassiya-jidaa-maadum', 'hal-muadala-ula']}
              feedback={({ allRight }) => (
                <Feedback tone={allRight ? 'ok' : 'ko'}>
                  <MathText>{allRight
                    ? 'الطريقتان تعطيان $-0{,}9$ ، وطريقة أمين أقصر: العامل $-1{,}2$ لا ينعدم.'
                    : 'العامل $-1{,}2$ ثابت غير معدوم: العامل الآخر $3x + 2{,}7$ هو الذي ينعدم.'}</MathText>
                </Feedback>
              )}
              onAnswered={() => setQ4(true)}
            />
          ),
        },
        {
          num: 5, title: 'معادلة بعاملين يتغيّران', subtitle: 'تطبيق أ — السؤال 3 (المستوى المتقدّم)', done: q5,
          content: (
            <div className="space-y-3">
              {evidence([ADVANCED])}
              <TapQuestion
                prompt={<MathText>{'بطريقة إلياس ننشر: $(x - 2)(x + 5) = x^2 + 3x - 10$. هل نصل إلى معادلة من الدرجة الأولى؟'}</MathText>}
                options={[
                  M('نعم: ننقل $-10$ إلى الطرف الآخر ثم نقسم على 3'),
                  M('لا: في المعادلة $x^2 + 3x - 10 = 0$ حدّ $x^2$ ، فليست من الدرجة الأولى'),
                  M('نعم، لأنّ $x^2 + 3x = 10$ معادلة من الدرجة الأولى'),
                ]}
                correct={1}
                cols={1}
                requires={['khassiya-jidaa-maadum', 'nashr-jidaa']}
                explain={<MathText>{ACTIVITY.q3note}</MathText>}
                onAnswered={() => setQ5a(true)}
              />
              {q5a && (
                <TapQuestion
                  prompt={<MathText>{ACTIVITY.questions[2]}</MathText>}
                  options={[M('$-2$ و $5$'), M('$2$ فقط'), M('$2$ و $-5$'), M('$-10$')]}
                  correct={2}
                  cols={2}
                  requires={['khassiya-jidaa-maadum']}
                  explain={<MathText>{ELIAS_AMINE.expandFails}</MathText>}
                  onAnswered={() => setQ5(true)}
                />
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
