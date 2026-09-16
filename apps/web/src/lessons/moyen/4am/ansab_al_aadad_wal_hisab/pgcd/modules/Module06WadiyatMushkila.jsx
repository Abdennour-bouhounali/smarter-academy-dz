import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import { gcdByDefinition } from '../components/pgcdUtils';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 6 — وضعيات مشكلة (stage: practice_lab).
 *
 * LE DERNIER LP, et le plus exigeant : « توظيف القاسم المشترك الأكبر في حل
 * وضعية مشكلة ». La difficulté n'est plus de calculer — elle est de
 * RECONNAÎTRE que la question posée est une question de PGCD alors que le
 * mot n'y figure pas.
 *
 * On travaille donc d'abord le TRI (quelle situation relève du PGCD ?),
 * ensuite seulement le calcul et son interprétation — car « combien de
 * paquets » n'est pas le PGCD lui-même mais un quotient qui s'en déduit,
 * confusion très fréquente.
 *
 * LP enseigné : 4am_pgcd_P7.
 */
const RUBANS_A = 45;
const RUBANS_B = 60;
const RUBANS_GCD = gcdByDefinition(RUBANS_A, RUBANS_B);

export default function Module06WadiyatMushkila() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(6)}
      moduleNumber={6}
      moduleTitle="وضعيات مشكلة"
      moduleSubtitle="السؤال لا يذكر اسم القاسم المشترك الأكبر أبدًا"
      estimatedTime="8 دقائق"
      brief={{
        tag: 'توظيف',
        title: 'التعرّف على الوضعية قبل الحساب',
        tone: 'rose',
        body: (
          <p>
            في الامتحان لن يُطلب منك «احسب القاسم المشترك الأكبر». ستُعطى وضعية،
            وعليك أنت أن تدرك أنّها وضعية قاسم مشترك أكبر.
          </p>
        ),
      }}
      steps={[
        {
          num: 1,
          title: 'أيّ وضعية تستدعي القاسم المشترك الأكبر؟',
          done: q1,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="mata-nastamil-pgcd" />
              <TapQuestion
                prompt={<span>أيّ من هذه الوضعيات تُحلّ بالقاسم المشترك الأكبر؟</span>}
                options={[
                  'حافلتان تنطلقان معًا، الأولى كل 12 دقيقة والثانية كل 18 دقيقة: متى تنطلقان معًا مجدّدًا؟',
                  'عندنا 45 شريطًا أحمر و60 شريطًا أزرق: ما أكبر عدد من الباقات المتماثلة التي يمكن تكوينها دون أن يبقى شريط؟',
                  'اشترى تاجر 45 قطعة بسعر 60 دينارًا للقطعة: كم دفع؟',
                  'عدد التلاميذ 45 والأقسام 5: كم تلميذًا في كل قسم؟',
                ]}
                correct={1}
                cols={1}
                requires={['mata-nastamil-pgcd']}
                explain={
                  <span>
                    الوضعية الثانية: «باقات متماثلة»، «دون أن يبقى شيء»، «أكبر
                    عدد» — هذه العلامات الثلاث معًا تدلّ على القاسم المشترك
                    الأكبر. أمّا الوضعية الأولى فتتعلّق بالمضاعفات وليس
                    بالقواسم، والأخريان عمليتان بسيطتان.
                  </span>
                }
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2,
          title: 'احسب',
          subtitle: 'الوضعية الثانية أعلاه',
          done: q2,
          content: (
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                <strong className="font-mono">{RUBANS_A}</strong> شريطًا أحمر و
                <strong className="font-mono">{RUBANS_B}</strong> شريطًا أزرق.
                ما <strong>أكبر عدد من الباقات المتماثلة</strong> التي يمكن
                تكوينها دون أن يبقى أيّ شريط؟
              </p>
              <NumericQuestion
                prompt={<span>عدد الباقات:</span>}
                expected={RUBANS_GCD}
                requires={['mata-nastamil-pgcd', 'khwarizmiyat-aqlidus']}
                explain={
                  <span>
                    عدد الباقات هو{' '}
                    <MathText>{`$\\mathrm{PGCD}(${RUBANS_A}\\ ;\\ ${RUBANS_B}) = ${RUBANS_GCD}$`}</MathText>
                    . بخوارزمية أقليدس:{' '}
                    <MathText>{'$60 = 45 \\times 1 + 15$'}</MathText> ثم{' '}
                    <MathText>{'$45 = 15 \\times 3 + 0$'}</MathText>.
                  </span>
                }
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3,
          title: 'وماذا داخل كل باقة؟',
          subtitle: 'النتيجة ليست هي الجواب دائمًا',
          done: q3,
          content: (
            <div className="space-y-4">
              <TapQuestion
                prompt={
                  <span>
                    بتكوين <MathText>{`$${RUBANS_GCD}$`}</MathText> باقة، كم
                    شريطًا أحمر وكم شريطًا أزرق في كل باقة؟
                  </span>
                }
                options={[
                  '3 حمراء و4 زرقاء',
                  '15 حمراء و15 زرقاء',
                  '45 حمراء و60 زرقاء',
                  '5 حمراء و5 زرقاء',
                ]}
                correct={0}
                cols={1}
                requires={['mata-nastamil-pgcd']}
                explain={
                  <span>
                    نقسم كل كمية على عدد الباقات:{' '}
                    <MathText>{`$${RUBANS_A} \\div ${RUBANS_GCD} = 3$`}</MathText>{' '}
                    و{' '}
                    <MathText>{`$${RUBANS_B} \\div ${RUBANS_GCD} = 4$`}</MathText>
                    . القاسم المشترك الأكبر يعطي <strong>عدد الباقات</strong>،
                    ومحتوى كل باقة يُحسب بعده بالقسمة.
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <Feedback tone="info">
                  هذا الخلط شائع جدًا في الامتحان: القاسم المشترك الأكبر هو عدد
                  الحصص، وليس محتوى الحصة الواحدة. اقرأ السؤال جيدًا قبل أن
                  تجيب.
                </Feedback>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={6} />}
    />
  );
}
