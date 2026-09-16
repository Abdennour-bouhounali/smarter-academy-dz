import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import AlgorithmRunner from '../components/AlgorithmRunner';
import { euclidSteps, differenceSteps } from '../components/pgcdUtils';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 4 — خوارزمية أقليدس (stage: manipulation).
 *
 * SECONDE méthode nommée par le programme. Elle est présentée comme ce
 * qu'elle est mathématiquement : le RACCOURCI de la précédente. Une division
 * euclidienne fait d'un coup toutes les soustractions d'un même nombre —
 * c'est le quotient qui les compte.
 *
 * Le module s'ouvre sur un couple où les différences seraient pénibles
 * (264 ; 60 → 8 soustractions contre 3 divisions), pour que le gain soit
 * CONSTATÉ et non affirmé.
 *
 * LP enseigné : 4am_pgcd_P5.
 */
const A = 264;
const B = 60;
const { gcd: GCD } = euclidSteps(A, B);
const DIFF_COUNT = differenceSteps(A, B).steps.length;
const EUCLID_COUNT = euclidSteps(A, B).steps.length;

export default function Module04KhwarizmiyatAqlidus() {
  const [revealed, setRevealed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hint, setHint] = useState('');
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(4)}
      moduleNumber={4}
      moduleTitle="خوارزمية أقليدس"
      moduleSubtitle="قسمة واحدة تختصر عدّة طرحات"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'طريقة 2 من 2',
        title: 'نفس الجواب، في خطوات أقل',
        tone: 'blue',
        body: (
          <p>
            بطريقة الفروق، يحتاج حساب{' '}
            <MathText>{`$\\mathrm{PGCD}(${A}\\ ;\\ ${B})$`}</MathText> إلى{' '}
            <strong className="font-mono">{DIFF_COUNT}</strong> طرحة. وبخوارزمية
            أقليدس يكفي <strong className="font-mono">{EUCLID_COUNT}</strong>{' '}
            قسمات. لماذا؟
          </p>
        ),
      }}
      steps={[
        {
          num: 1,
          title: 'نفّذ الخوارزمية',
          subtitle: 'اختر باقي كل قسمة',
          done: finished,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="khwarizmiyat-aqlidus" />
              <AlgorithmRunner
                a={A}
                b={B}
                mode="euclid"
                revealed={revealed}
                wrongHint={hint}
                onStepValidated={(next, isDone) => {
                  setRevealed(next);
                  setHint('');
                  if (isDone) setFinished(true);
                }}
                onWrongChoice={() =>
                  setHint(
                    'انتبه: المطلوب هو الباقي، وليس الحاصل (القسمة). الباقي أصغر دائمًا من القاسم.'
                  )
                }
              />
            </div>
          ),
        },
        {
          num: 2,
          title: 'لماذا هي أسرع؟',
          done: q2,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={
                  <span>
                    في الخطوة{' '}
                    <MathText>{`$${A} = ${B} \\times 4 + 24$`}</MathText>، ماذا
                    يمثّل العدد <MathText>{'$4$'}</MathText> بالنسبة لطريقة
                    الفروق المتتالية؟
                  </span>
                }
                options={[
                  'عدد الطرحات التي كنّا سننجزها من العدد 60',
                  'القاسم المشترك الأكبر',
                  'عدد القواسم المشتركة',
                  'لا يمثّل شيئًا خاصًا',
                ]}
                correct={0}
                cols={1}
                requires={['khwarizmiyat-aqlidus', 'furuq-mutatalia']}
                explain={
                  <span>
                    الحاصل <MathText>{'$4$'}</MathText> يعني أنّنا كنّا سنطرح{' '}
                    <MathText>{'$60$'}</MathText> أربع مرّات متتالية. القسمة
                    الإقليدية تنجز هذه الطرحات الأربع <strong>دفعة واحدة</strong>
                    ، والباقي <MathText>{'$24$'}</MathText> هو ما كان سيتبقّى.
                  </span>
                }
                onAnswered={() => setQ2(true)}
              />
              {q2 && (
                <Feedback tone="ok">
                  الطريقتان ليستا مختلفتين في العمق: الخوارزمية هي طريقة الفروق
                  نفسها، مع اختصار الطرحات المتكرّرة في قسمة واحدة. ولهذا تعطيان
                  دائمًا نفس النتيجة.
                </Feedback>
              )}
            </div>
          ),
        },
        {
          num: 3,
          title: 'أين يوجد القاسم المشترك الأكبر في الجدول؟',
          done: q3,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={
                  <span>
                    بعد أن يصبح الباقي معدومًا، يكون القاسم المشترك الأكبر هو:
                  </span>
                }
                options={[
                  'آخر باقٍ غير معدوم',
                  'الباقي المعدوم نفسه',
                  'أول باقٍ وجدناه',
                  'حاصل القسمة الأخيرة',
                ]}
                correct={0}
                cols={1}
                requires={['khwarizmiyat-aqlidus']}
                explain={
                  <span>
                    هو آخر باقٍ غير معدوم، أي القاسم في السطر الأخير. هنا:{' '}
                    <MathText>{`$\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${GCD}$`}</MathText>
                    . الباقي المعدوم إشارة توقّف، لا جواب.
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={4} />}
    />
  );
}
