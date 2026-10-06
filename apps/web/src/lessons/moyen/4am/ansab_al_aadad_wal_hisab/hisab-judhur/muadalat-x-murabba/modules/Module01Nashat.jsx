import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { SourceTag } from '../../../../../../common/textbook';
import LessonProblemCard from '../../../../../../common/problems/LessonProblemCard';
import { LESSON_CONFIG } from '../lesson.config';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 3 (p. 20) : « المعادلات من الشكل x² = a ».
 *
 * L'ACCROCHE est le débat du manuel lui-même : مراد dit que x² = 9 a pour
 * solution 3 ; عمر dit qu'il en a oublié une. Personne ne tranche à l'écran :
 * c'est la main qui tranchera.
 *
 * LABORATOIRE À DEUX NIVEAUX — la droite qui se plie (`square-fold`) :
 *   مبتدئ  x² = 9 (l'équation de مراد), x² = 0, x² = −9 ; graduation 1/2 ; le
 *          TABLEAU de la question 1 (−3/2, −1, 0, 1, 3/2, 2) se remplit avec
 *          les positions que l'élève essaie — il ne le lit pas, il le produit.
 *   متقدم  (défaut : c'est l'activité du manuel) les cinq équations de la
 *          question 2 ب — 25, 3, 0, 0,04, −9 — graduation 1/10, sans tableau ;
 *          √3 ne tombe sur aucune graduation.
 * Les deux niveaux portent les nombres du manuel : rien n'est adapté.
 *
 * Les ÉTAPES sont les questions du manuel, dans son ordre. Elles se
 * répondent depuis le laboratoire (la flèche de x et celle de −x arrivent au
 * même point ; aucune n'entre dans la moitié hachurée). La خاصية 1 est
 * NOMMÉE à la fin (brique `murabba-mutaakisayn`), après le geste et la
 * conclusion de l'élève — jamais avant. La خاصية 2 reste au module 2.
 * LP enseigné : P1.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const NONE = 'لا تقبل أي حل';
const pm = (r) => `$x = ${r}$ أو $x = -${r}$`;

export default function Module01Nashat() {
  const [q, setQ] = useState({});
  const done = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const { table, equations } = ACTIVITY.numbers;

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 3 — مراد وعمر"
      moduleSubtitle="كم حلا للمعادلة؟"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'أنشطة — الكتاب ص 20',
        headline: 'مراد أم عمر؟',
        emoji: '⚖️',
        title: <MathText>{ACTIVITY.title}</MathText>,
        tone: 'indigo',
        body: <p><MathText>{ACTIVITY.situation}</MathText></p>,
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="حرّك العدد x على المستقيم السفلي: السهم يحمله إلى مربّعه على المستقيم العلوي. ثبّت كل قيمة يصل فيها السهم إلى الدائرة a."
          defaultLevel="advanced"
          levels={{
            beginner: () => (
              <Manipulation
                type="square-fold"
                level="beginner"
                targets={[9, 0, -9]}
                scale={2}
                table={table}
                title="معادلة مراد، ثم a معدوم و a سالب"
                lead={<MathText>{'ابدأ بمعادلة مراد $x^2 = 9$. مرّ أيضًا على قيم الجدول الستّ: مربّع كل قيمة تزورها يُكتب تحت المستقيم.'}</MathText>}
              />
            ),
            advanced: () => (
              <Manipulation
                type="square-fold"
                level="advanced"
                targets={equations}
                scale={10}
                title="معادلات الكتاب الخمس (السؤال 2 ب)"
                lead="حل، إن أمكن، كل معادلة: ثبّت كل حل تجده، أو صرّح بأن المعادلة لا تقبل أي حل."
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'أ) أتمم الجدول', subtitle: 'في المستوى المبتدئ، زُر كل قيمة من الجدول بالعدد x', done: !!q.t,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{ACTIVITY.questions[0]}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">ما مربّع كل عدد؟ الجدول تحت المستقيم يمتلئ بما جرّبته.</p>}
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
          num: 2, title: 'ب) ضع تخمينا', subtitle: ACTIVITY.questions[1], done: !!q.k,
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
          num: 3, title: 'جـ) أثبت التخمين', subtitle: 'بالحرف b، لا بمثال', done: !!q.b,
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
          num: 4, title: '2) أ) مراد وعمر', subtitle: 'في المستوى المبتدئ، ابحث عن كل الأعداد التي مربعها 9', done: !!q.m,
          content: (
            <TapQuestion
              prompt={<span>قال مراد إنّ حل المعادلة <MathText>{'$x^2 = 9$'}</MathText> هو 3، وقال عمر إنّ مراد نسي حلا آخر. هل توافق عمر؟</span>}
              options={['نعم، مراد نسي الحل $-3$', 'لا، 3 هو الحل الوحيد', 'نعم، مراد نسي الحل $\\dfrac{9}{2}$', 'لا، المعادلة لا تقبل أي حل'].map(M)}
              correct={0}
              cols={1}
              requires={['murabba-adad', 'jidhr-taarif']}
              explain={<span><MathText>{'$3^2 = 9$'}</MathText> و <MathText>{'$(-3)^2 = 9$'}</MathText>: العددان المتعاكسان 3 و <MathText>{'$-3$'}</MathText> حلّان للمعادلة. هذا ما أثبتّه في السؤال 1.</span>}
              onAnswered={done('m')}
            />
          ),
        },
        {
          num: 5, title: '2) ب) حل، إن أمكن', subtitle: 'في المستوى المتقدّم: خمس معادلات، ثبّت كل حل أو صرّح بأنه لا يوجد', done: !!q.h,
          content: (
            <div className="space-y-3">
              <p className="text-sm text-slate-700"><MathText>{ACTIVITY.questions[4]}</MathText></p>
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">حلول كل بطاقة تثبّتها تُكتب تحت المستقيم. اختر حلول كل معادلة:</p>}
                rows={[
                  { id: 'a25', label: M('$x^2 = 25$'), options: [pm('5'), '$x = 5$', NONE].map(M), correct: 0, correction: M('$5^2 = 25$ و $(-5)^2 = 25$.') },
                  { id: 'a3', label: M('$x^2 = 3$'), options: ['$x = \\sqrt{3}$', pm('\\sqrt{3}'), pm('1{,}5')].map(M), correct: 1, correction: M('$(\\sqrt{3})^2 = 3$ و $(-\\sqrt{3})^2 = 3$؛ أما $1{,}5^2 = 2{,}25$.') },
                  { id: 'a0', label: M('$x^2 = 0$'), options: [NONE, '$x = 0$'].map(M), correct: 1, correction: M('العدد الوحيد الذي مربعه 0 هو 0.') },
                  { id: 'a004', label: M('$x^2 = 0{,}04$'), options: [pm('0{,}02'), pm('0{,}2'), pm('0{,}16')].map(M), correct: 1, correction: M('$0{,}2^2 = 0{,}04$، أما $0{,}02^2 = 0{,}0004$.') },
                  { id: 'am9', label: M('$x^2 = -9$'), options: [pm('3'), '$x = -3$', NONE].map(M), correct: 2, correction: M('$(-3)^2 = 9$ وليس $-9$: لا يصل أي سهم إلى الجزء المخطّط.') },
                ]}
                requires={['murabba-adad', 'jidhr-taarif']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا. ' : 'انظر إلى التصحيحات. '}بعض المعادلات لها حلّان، واحدة لها حل واحد، وواحدة ليس لها حل.
                  </Feedback>
                )}
                onAnswered={done('h')}
              />
            </div>
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
                    {allRight ? 'تمامًا: ' : 'انظر إلى التصحيحات: '}العدد <MathText>{'$a$'}</MathText> هو مربّع كل واحد من الحلّين.
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
              {/* La « مسألة الدرس » prolonge la droite qui se plie des deux niveaux
                  (laboratoire dans l'intro) : mêmes cartes x² = a, d'autres
                  nombres — résolue au module 4. */}
              <LessonProblemCard problem={LESSON_CONFIG.lessonProblem} compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
