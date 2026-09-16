import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import AlgorithmRunner from '../components/AlgorithmRunner';
import { differenceSteps } from '../components/pgcdUtils';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 3 — طريقة الفروق المتتالية (stage: manipulation).
 *
 * PREMIÈRE des deux méthodes nommées par le programme, et volontairement
 * AVANT Euclide : elle n'utilise que la soustraction, et sa justification
 * (« un diviseur commun de a et b divise aussi a − b ») est accessible.
 * Euclide apparaîtra ensuite comme son raccourci, pas comme une recette
 * concurrente.
 *
 * L'élève EXÉCUTE la méthode étape par étape ; il ne regarde pas une
 * animation. La manipulation est rejouable, donc non bloquante.
 *
 * LP enseigné : 4am_pgcd_P4.
 */
const A = 84;
const B = 36;
const { gcd: GCD } = differenceSteps(A, B);

export default function Module03FuruqMutatalia() {
  const [revealed, setRevealed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hint, setHint] = useState('');
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة الفروق المتتالية"
      moduleSubtitle="نطرح الأصغر من الأكبر، ونعيد"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'طريقة 1 من 2',
        title: 'بلا قوائم هذه المرة',
        tone: 'emerald',
        body: (
          <p>
            لحساب{' '}
            <MathText>{`$\\mathrm{PGCD}(${A}\\ ;\\ ${B})$`}</MathText> لن نكتب
            القواسم: سنطرح فقط، مرّة بعد مرّة، إلى أن يتساوى العددان.
          </p>
        ),
      }}
      steps={[
        {
          num: 1,
          title: 'نفّذ الطريقة بنفسك',
          subtitle: 'اختر نتيجة كل طرح',
          done: finished,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="furuq-mutatalia" />
              <AlgorithmRunner
                a={A}
                b={B}
                mode="difference"
                revealed={revealed}
                wrongHint={hint}
                onStepValidated={(next, isDone) => {
                  setRevealed(next);
                  setHint('');
                  if (isDone) setFinished(true);
                }}
                onWrongChoice={() =>
                  setHint('انتبه: نطرح دائمًا العدد الأصغر من العدد الأكبر، ولا نجمعهما.')
                }
              />
            </div>
          ),
        },
        {
          num: 2,
          title: 'لماذا تعطي هذه الطريقة النتيجة الصحيحة؟',
          done: q2,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="limadha-la-yataghayyar" />
              <TapQuestion
                prompt={
                  <span>
                    إذا كان عدد يقسم <MathText>{'$a$'}</MathText> ويقسم{' '}
                    <MathText>{'$b$'}</MathText>، فماذا يمكن أن نقول عن{' '}
                    <MathText>{'$a - b$'}</MathText>؟
                  </span>
                }
                options={[
                  'لا يقسمه بالضرورة',
                  'يقسمه هو أيضًا',
                  'يقسمه فقط إذا كان a مضاعفًا لـ b',
                  'لا يمكن معرفة ذلك',
                ]}
                correct={1}
                cols={1}
                requires={['limadha-la-yataghayyar']}
                explain={
                  <span>
                    يقسمه أيضًا. ولهذا فإنّ الزوجين{' '}
                    <MathText>{'$(a\\ ;\\ b)$'}</MathText> و{' '}
                    <MathText>{'$(b\\ ;\\ a-b)$'}</MathText> لهما نفس القواسم
                    المشتركة، وبالتالي نفس القاسم المشترك الأكبر: الطرح لا يغيّر
                    الجواب.
                  </span>
                }
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3,
          title: 'متى نتوقّف؟',
          done: q3,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={<span>في طريقة الفروق المتتالية، نتوقّف عندما:</span>}
                options={[
                  'يصبح أحد العددين معدومًا',
                  'يتساوى العددان',
                  'يصبح الفرق أصغر من 10',
                  'ننجز عشر خطوات',
                ]}
                correct={1}
                cols={1}
                requires={['furuq-mutatalia']}
                explain={
                  <span>
                    نتوقّف عند تساوي العددين، وتكون هذه القيمة المشتركة هي
                    القاسم المشترك الأكبر. هنا:{' '}
                    <MathText>{`$\\mathrm{PGCD}(${A}\\ ;\\ ${B}) = ${GCD}$`}</MathText>
                    .
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <Feedback tone="info">
                  لاحظ عدد الطرحات التي لزمتك. لو كان العددان{' '}
                  <MathText>{'$1\\,000$'}</MathText> و{' '}
                  <MathText>{'$3$'}</MathText>، لاحتجت إلى مئات الطرحات.
                  الوحدة الموالية تختصر ذلك.
                </Feedback>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
