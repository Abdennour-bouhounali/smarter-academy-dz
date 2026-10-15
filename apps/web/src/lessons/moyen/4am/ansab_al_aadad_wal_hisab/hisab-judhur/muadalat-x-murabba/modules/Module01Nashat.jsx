import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 3 (p. 20) : « المعادلات من الشكل x² = a » (rétrofit 2026-10-15 : le labo en tête SANS carte, SANS titre ni
 * lead d'atelier ; les étapes interrogent ce que l'élève a FAIT ; la brique APRÈS la réponse).
 *
 * L'ENTRÉE est le débat du manuel lui-même, mais posé À LA MAIN : مراد dit que x² = 9 a pour solution 3 ; عمر dit qu'il en a oublié
 * une. Personne ne tranche à l'écran : la flèche de x et celle de −x arrivent au même point, l'élève le VOIT avant qu'on le lui
 * demande. Le tableau des carrés (question 1 أ) n'ouvre plus le module : il TESTE ensuite l'idée sur des fractions.
 *
 * LABORATOIRE À DEUX NIVEAUX — la droite qui se plie (`square-fold`) :
 *   مبتدئ  x² = 9 (l'équation de مراد), x² = 0, x² = −9 ; graduation 1/2 ; le TABLEAU de la question 1 (−3/2, −1, 0, 1, 3/2, 2) se
 *          remplit avec les positions que l'élève essaie — il ne le lit pas, il le produit.
 *   متقدم  les cinq équations de la question 2 ب — 25, 3, 0, 0,04, −9 — graduation 1/10, sans tableau ; √3 ne tombe sur aucune
 *          graduation.
 * Les deux niveaux portent les nombres du manuel : rien n'est adapté.
 *
 * ORDRE DES IDÉES (étapes) : 1. pourquoi DEUX flèches arrivent à 9 (la preuve : l'élève a fini le labo — `onFinished`, le labo n'a pas
 * d'`onTrial`) → 2. le tableau, pour tester l'idée sur −3/2, −1… → 3. la conjecture (carrés de deux opposés) → 4. sa preuve par la
 * lettre b → 5. pourquoi aucune flèche n'atteint −9 → 6. de deux solutions à l'équation (7 et −7…) → 7. la relation entre les
 * solutions et a, PUIS la brique `murabba-mutaakisayn`. Le « حل، إن أمكن » de la question 2 ب (cinq équations) est joué par le niveau
 * متقدم du labo (chaque épingle est jugée) : l'étape qui le re-posait est retirée. La خاصية 2 reste au module 2.
 * LP enseigné : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const NONE = 'لا تقبل أي حل';
const pm = (r) => `$x = ${r}$ أو $x = -${r}$`;

export default function Module01Nashat() {
  const [q, setQ] = useState({});
  const done = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  // Le labo n'a pas d'`onTrial` : la seule trace est sa fin (le verdict de la découverte).
  const [finished, setFinished] = useState(false);
  const onFinished = () => setFinished(true);
  const { table, equations } = ACTIVITY.numbers;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — مراد وعمر"
      moduleSubtitle="كم حلا للمعادلة؟"
      estimatedTime="14 دقيقة"
      objectives={['هل للمعادلة $x^2 = 9$ حلّ واحد أم أكثر؟', 'ماذا نلاحظ على مربّعي عددين متعاكسين؟', 'كم حلّا للمعادلة $x^2 = a$ حين تتغيّر إشارة $a$؟']}
      intro={
        <ManipulationWorkspace
          defaultLevel="beginner"
          levels={{
            beginner: () => (
              <Manipulation
                type="square-fold"
                level="beginner"
                targets={[9, 0, -9]}
                scale={2}
                table={table}
                lead={<MathText>{'قال مراد إنّ حلّ المعادلة $x^2 = 9$ هو 3 لأنّ $3^2 = 9$، وقال عمر إنّه نسي حلًّا آخر. ابدأ بمعادلة مراد، ثم مرّ على قيم الجدول الستّ: مربّع كل قيمة تزورها يُكتب تحت المستقيم.'}</MathText>}
                onFinished={onFinished}
              />
            ),
            advanced: () => (
              <Manipulation
                type="square-fold"
                level="advanced"
                targets={equations}
                scale={10}
                lead="خمس معادلات بلا جدول: ثبّت كل حل تجده، أو صرّح بأن المعادلة لا تقبل أي حل."
                onFinished={onFinished}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: <MathText>{'لماذا يصل سهم $x = -3$ إلى الدائرة 9 كما يصل إليها سهم $x = 3$؟'}</MathText>, subtitle: 'من تجربتك في المختبر', done: !!q.m,
          content: (
            <div className="space-y-3">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                <li className={finished ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence="finished" data-tried={finished ? 'true' : 'false'}>
                  {finished
                    ? 'أنهيتَ المختبر: ثبّتَّ الحلول وأجبتَ عن سؤال الاستنتاج.'
                    : 'لم تُنهِ المختبر بعد: ارجع إلى الأعلى وثبّت حلول البطاقات ليظهر سؤال الاستنتاج.'}
                </li>
              </ul>
              <TapQuestion
                prompt={<span>في المختبر يصل سهم <MathText>{'$x = 3$'}</MathText> وسهم <MathText>{'$x = -3$'}</MathText> إلى الدائرة 9 نفسها. لماذا يصل سهمان مختلفان إلى النقطة نفسها؟</span>}
                options={[
                  'لأنّ $(-3) \\times (-3) = 3 \\times 3 = 9$: جداء عددين سالبين موجب',
                  'لأنّ $(-3)^2 = -9$، لكنّ السهم ينحرف إلى الجهة الموجبة',
                  'لأنّ 3 و $-3$ يبعدان عن الدائرة 9 المسافة نفسها',
                  'لأنّ الحلّ الثاني دائمًا هو نصف الحلّ الأول',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['murabba-adad']}
                explain={<span><MathText>{'$3^2 = 9$'}</MathText> و <MathText>{'$(-3)^2 = 9$'}</MathText>: العددان المتعاكسان 3 و <MathText>{'$-3$'}</MathText> حلّان للمعادلة، فعمر على حق ومراد نسي <MathText>{'$-3$'}</MathText>.</span>}
                onAnswered={done('m')}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'هل يصحّ ذلك على أعداد الجدول؟ أتمم الجدول', subtitle: 'في المستوى المبتدئ، زُر كل قيمة من الجدول بالعدد x', done: !!q.t,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">اختبر فكرتك على أعداد الجدول: ما مربّع كل عدد؟ الجدول تحت المستقيم يمتلئ بما جرّبته.</p>}
                rows={[
                  { id: 'a', label: M('$x = -\\dfrac{3}{2}$'), options: ['$\\dfrac{9}{4}$', '$-\\dfrac{9}{4}$', '$-3$'].map(M), correct: 0, correction: M('$\\left(-\\dfrac{3}{2}\\right)^2 = \\left(-\\dfrac{3}{2}\\right) \\times \\left(-\\dfrac{3}{2}\\right) = \\dfrac{9}{4}$') },
                  { id: 'b', label: M('$x = -1$'), options: ['$-1$', '$1$', '$-2$'].map(M), correct: 1, correction: M('$(-1)^2 = (-1) \\times (-1) = 1$') },
                  { id: 'c', label: M('$x = 0$'), options: ['$2$', '$0$', '$1$'].map(M), correct: 1, correction: M('$0^2 = 0 \\times 0 = 0$') },
                  { id: 'd', label: M('$x = 1$'), options: ['$2$', '$1$', '$-1$'].map(M), correct: 1, correction: M('$1^2 = 1 \\times 1 = 1$') },
                  { id: 'e', label: M('$x = \\dfrac{3}{2}$'), options: ['$3$', '$\\dfrac{9}{4}$', '$\\dfrac{3}{4}$'].map(M), correct: 1, correction: M('$\\left(\\dfrac{3}{2}\\right)^2 = \\dfrac{3}{2} \\times \\dfrac{3}{2} = \\dfrac{9}{4}$') },
                  { id: 'f', label: M('$x = 2$'), options: ['$4$', '$2$', '$-4$'].map(M), correct: 0, correction: M('$2^2 = 2 \\times 2 = 4$') },
                ]}
                requires={['murabba-adad']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'الجدول كامل. ' : 'انظر إلى التصحيحات. '}قارن عمودي <MathText>{'$-\\dfrac{3}{2}$'}</MathText> و <MathText>{'$\\dfrac{3}{2}$'}</MathText>، ثم عمودي <MathText>{'$-1$'}</MathText> و <MathText>{'$1$'}</MathText>.
                  </Feedback>
                )}
                onAnswered={done('t')}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'ب) ضع تخمينا', subtitle: ACTIVITY.questions[1], done: !!q.k,
          content: (
            <TapQuestion
              prompt={<span>ماذا تلاحظ على مربعي عددين متعاكسين، مثل <MathText>{'$-\\dfrac{3}{2}$'}</MathText> و <MathText>{'$\\dfrac{3}{2}$'}</MathText>؟</span>}
              options={['مربعاهما متساويان', 'مربعاهما متعاكسان', 'مربع العدد السالب سالب', 'مربع العدد السالب أكبر دائمًا']}
              correct={0}
              cols={2}
              requires={['murabba-adad']}
              explain={<span>في الجدول: <MathText>{'$\\left(-\\dfrac{3}{2}\\right)^2 = \\left(\\dfrac{3}{2}\\right)^2 = \\dfrac{9}{4}$'}</MathText> و <MathText>{'$(-1)^2 = 1^2 = 1$'}</MathText>. وعلى المستقيم: سهم x وسهم معاكسه يصلان إلى النقطة نفسها.</span>}
              onAnswered={done('k')}
            />
          ),
        },
        {
          num: 4, title: 'جـ) أثبت التخمين', subtitle: 'بالحرف b، لا بمثال', done: !!q.b,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{ACTIVITY.questions[2]}</MathText></p>
              <TapQuestion
                prompt={<span>أي كتابة تثبت التخمين من أجل <strong>كل</strong> عدد <MathText>{'$b$'}</MathText>؟</span>}
                options={[
                  '$(-b)^2 = (-b) \\times (-b) = b \\times b = b^2$',
                  '$(-b)^2 = -(b \\times b) = -b^2$',
                  '$(-b)^2 = -2b$',
                  '$\\left(-\\dfrac{3}{2}\\right)^2 = \\left(\\dfrac{3}{2}\\right)^2$، إذن يكفي هذا المثال',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['murabba-adad']}
                explain={<span>جداء عددين سالبين موجب: <MathText>{'$(-b) \\times (-b) = b \\times b$'}</MathText>. مثال واحد لا يثبت خاصية لكل الأعداد؛ الحساب بالحرف <MathText>{'$b$'}</MathText> يثبتها.</span>}
                onAnswered={done('b')}
              />
            </div>
          ),
        },
        {
          num: 5, title: <MathText>{'لماذا لا يصل أي سهم إلى $-9$؟'}</MathText>, subtitle: 'من تجربتك مع البطاقة x² = −9', done: !!q.h,
          content: (
            <TapQuestion
              prompt={<span>في المختبر حرّكتَ <MathText>{'$x$'}</MathText> في كل اتجاه ولم يدخل أي سهم الجزء المخطّط حيث يقع <MathText>{'$-9$'}</MathText> على مستقيم المربّعات. لماذا؟</span>}
              options={[
                'لأنّ مربّع أي عدد، موجبًا كان أو سالبًا، لا يكون سالبًا',
                'لأنّ المستقيم السفلي ينتهي عند $-9$',
                'لأنّ $x = -9$ هو الوحيد الذي لم نجرّبه',
                'لأنّ $-9$ أصغر من $-3$',
              ].map(M)}
              correct={0}
              cols={1}
              requires={['murabba-adad']}
              explain={<span>المربّعات <MathText>{'$3^2 = 9$'}</MathText> و <MathText>{'$(-3)^2 = 9$'}</MathText> و <MathText>{'$0^2 = 0$'}</MathText> كلها موجبة أو معدومة؛ و <MathText>{'$(-9)^2 = 81$'}</MathText> وليس <MathText>{'$-9$'}</MathText>. لذلك لا تقبل <MathText>{'$x^2 = -9$'}</MathText> أي حل.</span>}
              onAnswered={done('h')}
            />
          ),
        },
        {
          num: 6, title: '3) أكتب معادلة من حلّيها', subtitle: 'من الحلّين إلى العدد a', done: !!q.w,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{ACTIVITY.questions[5]}</MathText></p>
              <BatchChoiceQuestion
                rows={[
                  { id: 'w1', label: M('أ) $7$ و $-7$'), options: ['$x^2 = 14$', '$x^2 = 49$', '$x^2 = -49$'].map(M), correct: 1, correction: M('$7^2 = (-7)^2 = 49$.') },
                  { id: 'w2', label: M('ب) $\\dfrac{2}{3}$ و $-\\dfrac{2}{3}$'), options: ['$x^2 = \\dfrac{4}{9}$', '$x^2 = \\dfrac{4}{6}$', '$x^2 = -\\dfrac{4}{9}$'].map(M), correct: 0, correction: M('$\\left(\\dfrac{2}{3}\\right)^2 = \\left(-\\dfrac{2}{3}\\right)^2 = \\dfrac{4}{9}$.') },
                  { id: 'w3', label: M('جـ) $0{,}5$ و $-0{,}5$'), options: ['$x^2 = 1$', '$x^2 = 2{,}5$', '$x^2 = 0{,}25$'].map(M), correct: 2, correction: M('$0{,}5^2 = (-0{,}5)^2 = 0{,}25$.') },
                ]}
                requires={['murabba-adad']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: ' : 'انظر إلى التصحيحات: '}قارن كل حلّين بالعدد الذي يظهر في الطرف الثاني من المعادلة.
                  </Feedback>
                )}
                onAnswered={done('w')}
              />
            </div>
          ),
        },
        {
          num: 7, title: 'ماذا تستنتج؟', done: !!q.c,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>في الحالات الثلاث، ما العلاقة بين الحلّين والعدد <MathText>{'$a$'}</MathText>؟</span>}
                options={[
                  'الحلّان عددان متعاكسان، و $a$ هو مربع كل منهما',
                  'الحلّان هما $a$ و $-a$',
                  'مجموع الحلّين يساوي $a$',
                  'جداء الحلّين يساوي $a$',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['murabba-adad', 'jidhr-taarif']}
                explain={<span>مثلا <MathText>{'$7$'}</MathText> و <MathText>{'$-7$'}</MathText> متعاكسان ومربع كل منهما 49؛ مجموعهما 0 وجداؤهما <MathText>{'$-49$'}</MathText>.</span>}
                onAnswered={done('c')}
              />
              {q.c && (
                <KnowledgeBrick
                  id="murabba-mutaakisayn"
                  lead="ما رأيته بالسهمين وأثبتّه بالحرف b، يكتبه الكتاب هكذا:"
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
