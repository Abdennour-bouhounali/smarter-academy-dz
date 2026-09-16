import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../common/kit';
import { Feedback } from '../../../../../common/components/LessonUI';
import { KnowledgeSnapshot } from '../../../../../common/knowledge';
import MathText from '../../../../../common/components/MathText';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 5 — أتحقّق وأختار (stage: practice_lab).
 *
 * LE POINT QUE LE PROGRAMME NOMME À PART : « التحقق من صحة حساب القاسم
 * المشترك الأكبر ». Vérifier n'est pas refaire le calcul — c'est contrôler
 * les DEUX conditions de la définition :
 *
 *   1. le nombre trouvé divise les deux nombres ;
 *   2. aucun diviseur commun n'est plus grand.
 *
 * L'erreur classique — se contenter de la première — est ici confrontée
 * directement : 2 divise 12 et 18 sans être leur PGCD.
 *
 * Un laboratoire : les erreurs n'y comptent jamais comme preuve de maîtrise
 * (LESSON_CONTRACT.md — seul le module d'évaluation en produit).
 *
 * LP enseigné : 4am_pgcd_P6.
 */
export default function Module05Tahaqquq() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(5)}
      moduleNumber={5}
      moduleTitle="أتحقّق وأختار"
      moduleSubtitle="نتيجة صحيحة تستوفي شرطين، لا شرطًا واحدًا"
      estimatedTime="14 دقيقة"
      brief={{
        tag: 'تدريب',
        title: 'كيف أتأكّد أنّني لم أخطئ؟',
        tone: 'amber',
        body: (
          <p>
            أنجزت الحساب ووجدت عددًا. لكن كيف تتأكّد أنّه{' '}
            <strong>فعلًا</strong> القاسم المشترك الأكبر، وليس مجرّد قاسم مشترك؟
          </p>
        ),
      }}
      steps={[
        {
          num: 1,
          title: 'الشرطان معًا',
          done: q1,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="tahaqquq" />
              <TapQuestion
                prompt={
                  <span>
                    تلميذ يقول:{' '}
                    <MathText>{'$\\mathrm{PGCD}(12\\ ;\\ 18) = 2$'}</MathText>،
                    لأنّ <MathText>{'$2$'}</MathText> يقسم{' '}
                    <MathText>{'$12$'}</MathText> ويقسم{' '}
                    <MathText>{'$18$'}</MathText>. ما رأيك؟
                  </span>
                }
                options={[
                  'صحيح: 2 يقسم العددين فعلًا',
                  'خطأ: 2 لا يقسم 18',
                  'خطأ: 2 قاسم مشترك لكنه ليس الأكبر (6 أكبر منه)',
                  'خطأ: القاسم المشترك الأكبر هو 12',
                ]}
                correct={2}
                cols={1}
                requires={['tahaqquq']}
                explain={
                  <span>
                    استدلاله صحيح في نصفه فقط:{' '}
                    <MathText>{'$2$'}</MathText> قاسم مشترك بالفعل، لكن{' '}
                    <MathText>{'$6$'}</MathText> قاسم مشترك أيضًا وهو أكبر. إذن{' '}
                    <MathText>{'$\\mathrm{PGCD}(12\\ ;\\ 18) = 6$'}</MathText>.
                    الشرط الأول وحده لا يكفي أبدًا.
                  </span>
                }
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2,
          title: 'راقب هذه النتائج',
          subtitle: 'أيّها ممكن وأيّها مستحيل؟',
          done: q2,
          content: (
            <div className="space-y-4">
              <BatchChoiceQuestion
                requires={['tahaqquq', 'pgcd']}
                intro={
                  <p className="text-sm text-slate-700">
                    دون إنجاز الحساب كاملًا، قرّر إن كانت كل نتيجة{' '}
                    <strong>ممكنة</strong> أم <strong>مستحيلة</strong>.
                  </p>
                }
                rows={[
                  {
                    id: 'r1',
                    label: 'PGCD(20 ؛ 30) = 7',
                    options: ['ممكنة', 'مستحيلة'],
                    correct: 1,
                    correction: '7 لا يقسم 20 أصلًا.',
                  },
                  {
                    id: 'r2',
                    label: 'PGCD(20 ؛ 30) = 10',
                    options: ['ممكنة', 'مستحيلة'],
                    correct: 0,
                    correction: '10 يقسم 20 و30، وهو فعلًا الأكبر.',
                  },
                  {
                    id: 'r3',
                    label: 'PGCD(20 ؛ 30) = 60',
                    options: ['ممكنة', 'مستحيلة'],
                    correct: 1,
                    correction: 'القاسم لا يمكن أن يكون أكبر من العدد نفسه.',
                  },
                  {
                    id: 'r4',
                    label: 'PGCD(9 ؛ 28) = 1',
                    options: ['ممكنة', 'مستحيلة'],
                    correct: 0,
                    correction: 'العددان أوّليان فيما بينهما.',
                  },
                ]}
                feedback={({ allRight, nCorrect, total }) => (
                  <span>
                    {allRight ? (
                      <>
                        ممتاز. لاحظ القاعدتين السريعتين: القاسم المشترك الأكبر{' '}
                        <strong>لا يتجاوز أصغر العددين</strong>، ويجب أن{' '}
                        <strong>يقسمهما معًا</strong>.
                      </>
                    ) : (
                      <>
                        {nCorrect} / {total}. تذكّر: القاسم المشترك الأكبر لا
                        يتجاوز أبدًا أصغر العددين، ويجب أن يقسمهما معًا.
                      </>
                    )}
                  </span>
                )}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3,
          title: 'حالة خاصة',
          done: q3,
          content: (
            <div className="space-y-4">
              <KnowledgeBrick id="awwaliyan-fima-baynahuma" />
              <TapQuestion
                prompt={
                  <span>
                    احسب{' '}
                    <MathText>{'$\\mathrm{PGCD}(8\\ ;\\ 15)$'}</MathText> (يمكنك
                    استعمال أيّ من الطريقتين).
                  </span>
                }
                options={['1', '2', '8', '120']}
                correct={0}
                cols={4}
                requires={['awwaliyan-fima-baynahuma']}
                explain={
                  <span>
                    قواسم <MathText>{'$8$'}</MathText>:{' '}
                    <MathText>{'$1, 2, 4, 8$'}</MathText>؛ قواسم{' '}
                    <MathText>{'$15$'}</MathText>:{' '}
                    <MathText>{'$1, 3, 5, 15$'}</MathText>. القاسم المشترك
                    الوحيد هو <MathText>{'$1$'}</MathText>: العددان أوّليان فيما
                    بينهما. النتيجة <MathText>{'$1$'}</MathText> ليست خطأ في
                    الحساب.
                  </span>
                }
                onAnswered={() => setQ3(true)}
              />
              {q3 && (
                <Feedback tone="info">
                  متى نختار أيّ طريقة؟ عندما يكون العددان{' '}
                  <strong>متقاربين</strong> (مثل 91 و84) تكون الفروق المتتالية
                  سريعة. وعندما يكون بينهما <strong>فارق كبير</strong> (مثل 1000
                  و7) تكون خوارزمية أقليدس أسرع بكثير. النتيجة واحدة في
                  الحالتين.
                </Feedback>
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={5} />}
    />
  );
}
