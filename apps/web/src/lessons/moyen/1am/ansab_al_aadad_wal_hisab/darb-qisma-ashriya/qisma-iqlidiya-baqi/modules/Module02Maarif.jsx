import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 2 (p. 41) « القسمة الإقليدية » :
 *   1. les quatre noms (المقسوم، المقسوم عليه، الحاصل، الباقي) sur l'égalité du manuel, DEMANDÉS puis donnés ;
 *   2. l'exemple 1 (253 perles, colliers de 17) dans le MÊME instrument qu'au module 1, sur la droite (`levels={false}`) :
 *      la remarque du manuel « on s'approche de 253 par valeurs inférieures » se fait à la main ;
 *   3. la question د de نشاط 3 (يونس : « une division posée suffit ») : la disposition du manuel ligne à ligne, puis la
 *      méthode (brique gardée par « أتوقّع القاعدة ») ;
 *   4. l'exemple 2 (60 = 4 × 15, reste nul) : مضاعف، يقبل القسمة على، قاسم.
 * LP : P1, P2.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const { example1, example2, layout } = KNOWLEDGE;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [read, setRead] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      objectives={['ماذا نسمّي الأعداد الأربعة في القسمة الإقليدية؟', 'كيف ننجز القسمة عموديا؟', 'ماذا نقول عندما يكون الباقي معدومًا؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — القسمة الإقليدية"
      moduleSubtitle="أربعة أسماء، ومساواة، وطريقة"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'معارف — الكتاب ص 41', title: 'ماذا نسمّي كل عدد في القسمة الإقليدية؟', tone: 'violet',
        body: <p>في النشاط كتبنا 279 = 14 × 19 + 13. الكتاب يعطي لكل عدد في هذه المساواة اسمًا، ويعلّمنا كيف نجد الحاصل والباقي بقسمة عمودية.</p>,
      }}
      steps={[
        {
          num: 1, title: 'لكل عدد اسم', subtitle: '$253 = 17 \\times 14 + 15$', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" lines={[example1.text, example1.equality, example1.conclusion]} source={KNOWLEDGE.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{`في المساواة ${example1.equality} ، ماذا يمثّل كل عدد في قصّة العقود؟`}</MathText></p>}
                rows={[
                  { id: 'a', label: '253', options: ['عدد اللآلئ كلّها', 'عدد العقود', 'عدد اللآلئ الباقية'], correct: 0 },
                  { id: 'b', label: '17', options: ['عدد اللآلئ في كل عقد', 'عدد العقود', 'عدد اللآلئ الباقية'], correct: 0 },
                  { id: 'q', label: '14', options: ['عدد العقود', 'عدد اللآلئ في كل عقد', 'عدد اللآلئ الباقية'], correct: 0 },
                  { id: 'r', label: '15', options: ['عدد اللآلئ الباقية', 'عدد العقود', 'عدد اللآلئ كلّها'], correct: 0 },
                ]}
                requires={['qisma-iqlidiya']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا. الكتاب يعطي لهذه الأعداد أسماء:' : 'اقرأ القصّة مرّة أخرى، ثم الأسماء أسفله:'}</Feedback>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="qisma-mufradat" />}
            </div>
          ),
        },
        {
          num: 2, title: 'نقترب من 253 بقفزات من 17', subtitle: 'لماذا 14 وليس 15؟', done: q2,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="remark" text={KNOWLEDGE.remark} source={KNOWLEDGE.source} compact />
              <Manipulation type="division-jumps" world="line" a={example1.numbers.a} b={example1.numbers.b} levels={false}
                title="مثال الكتاب: 253 لؤلؤة في عقود من 17"
                lead="كل قفزة = عقد من 17 لؤلؤة." />
              <TapQuestion
                prompt={<span>لماذا الحاصل 14 وليس 15؟</span>}
                options={[M('لأنّ $17 \\times 15 = 255$ أكبر من 253'), M('لأنّ الباقي يجب أن يكون معدومًا'), M('لأنّ 14 عدد زوجي')]}
                correct={0}
                cols={1}
                requires={['qisma-mufradat']}
                explain={<MathText>{'$17 \\times 14 = 238 < 253 < 255 = 17 \\times 15$ : 15 عقدًا تحتاج لآلئ لا توجد، والباقي $253 - 238 = 15 < 17$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'يونس: «بقسمة عمودية»', subtitle: 'السؤال د) من النشاط', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" text={ACTIVITY.questions[3]} source={ACTIVITY.source} compact />
              <p className="text-sm text-slate-700">هكذا يقسم الكتاب 253 على 17 عموديا. اكشف سطرًا سطرًا:</p>
              <MethodSteps method={{ source: KNOWLEDGE.source, exercise: 'القسمة الإقليدية للعدد 253 على 17، بوضع العملية عموديا.', solution: layout }} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="qisma-amudiya" lead="هذه الخطوات نفسها تعطي الحاصل والباقي لأيّ عددين." />}
              <TapQuestion
                prompt={<span>هل توافق يونس؟</span>}
                options={[M('نعم: القسمة العمودية لـ 279 على 14 تعطي مباشرة الحاصل 19 والباقي 13'), M('لا: القسمة العمودية تعطي عددًا بفاصلة فقط'), M('لا: يجب أن نجرّب كل الأعداد من 1 إلى 20')]}
                correct={0}
                cols={1}
                requires={['qisma-amudiya']}
                explain={<MathText>{'27 : $14 \\times 1$ ، $27 - 14 = 13$ ؛ ننزل 9 : 139 ، $14 \\times 9 = 126$ ، $139 - 126 = 13 < 14$. الحاصل 19 والباقي 13.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'عندما يكون الباقي 0', subtitle: '$60 = 4 \\times 15$', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" text={example2.equality} source={KNOWLEDGE.source} compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700"><MathText>{'باقي قسمة 60 على 4 هو 0. أيّ الجمل صحيحة؟'}</MathText></p>}
                rows={[
                  { id: 'm', label: '60 مضاعف للعدد 4', options: ['صحيحة', 'خاطئة'], correct: 0 },
                  { id: 'y', label: '60 يقبل القسمة على 4', options: ['صحيحة', 'خاطئة'], correct: 0 },
                  { id: 'k', label: '60 قاسم للعدد 4', options: ['صحيحة', 'خاطئة'], correct: 1, correction: 'العكس: 4 قاسم لـ 60.' },
                ]}
                requires={['qisma-mufradat']}
                feedback={({ allRight }) => <Feedback tone={allRight ? 'ok' : 'ko'}>{allRight ? 'تمامًا:' : 'انتبه إلى الاتجاه:'}</Feedback>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="baqi-maadum" />}
              <SourceTag source={KNOWLEDGE.source} />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
