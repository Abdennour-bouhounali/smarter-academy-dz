import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, ICT_SQRT2 } from '../content/textbook';

/**
 * Module 2 — معارف 2 (p. 22) : les deux résultats et leurs deux exemples (portés
 * par les briques : l'exemple 25/9 avec le 1er résultat, √6 avec le 2e),
 * puis « أوظّف تكنولوجيات الإعلام والاتصال » (p. 30) : la valeur de √2 que
 * montre la calculatrice n'est qu'une valeur approchée. Le 1er résultat a été
 * nommé au module 1 (rappel) ; le 2e est posé ici, avant la question qui s'en
 * sert. LP : P1, P2, P3.
 */
const M = (tex) => <MathText key={tex}>{tex}</MathText>;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — ناطق أم غير ناطق؟"
      moduleSubtitle="نتيجتان ومثالان، وما تخفيه الحاسبة"
      estimatedTime="10 دقائق"
      objectives={['كيف أعرف إن كان جذر عدد ناطقًا؟', 'ماذا تعرض الحاسبة حين لا يكون ناطقًا؟']}
      brief={{
        tag: 'معارف — الكتاب ص 22', title: KNOWLEDGE.title, tone: 'violet',
        body: <p>في النشاط وقعت جذور الصنف الأول على تدريجة، ولم تقع جذور الصنف الثاني على أيّ تدريجة. الكتاب يصوغ ذلك في نتيجتين، لكل منهما مثال.</p>,
        footer: <SourceTag source={KNOWLEDGE.source} />,
      }}
      steps={[
        {
          num: 1, title: 'النتيجة الأولى: جذر مربع عدد ناطق', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="murabba-natiq" variant="rappel" />
              <TapQuestion
                prompt={<span>بنفس الطريقة، ما قيمة <MathText>{'$\\sqrt{\\dfrac{16}{9}}$'}</MathText> من الصنف الأول؟</span>}
                options={[M('$\\dfrac{4}{3}$'), M('$\\dfrac{16}{3}$'), M('$\\dfrac{8}{9}$'), M('$\\dfrac{4}{9}$')]}
                correctionLabel={M('$\\dfrac{4}{3}$')}
                correct={0}
                cols={2}
                requires={['murabba-natiq']}
                explain={<span><MathText>{'$\\dfrac{16}{9} = \\left(\\dfrac{4}{3}\\right)^2$'}</MathText> و <MathText>{'$\\dfrac{4}{3}$'}</MathText> عدد موجب، إذن <MathText>{'$\\sqrt{\\dfrac{16}{9}} = \\dfrac{4}{3}$'}</MathText>: كلٌّ من 16 و 9 مربّع عدد طبيعي.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'النتيجة الثانية: جذر عدد ليس مربعًا لعدد ناطق', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ghayr-natiq" lead="وجذور الصنف الثاني؟ الكتاب يعطي نتيجة ثانية:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">لكل عدد: هل هو عدد ناطق؟</p>}
                rows={[
                  { id: 'a', label: M('$\\sqrt{0{,}25}$'), options: ['عدد ناطق', 'ليس عددًا ناطقًا'], correct: 0, correction: 'العدد 0,25 مربع العدد 0,5.' },
                  { id: 'b', label: M('$\\sqrt{13}$'), options: ['عدد ناطق', 'ليس عددًا ناطقًا'], correct: 1, correction: 'لا يوجد عدد ناطق مربعه 13.' },
                  { id: 'c', label: M('$\\sqrt{81}$'), options: ['عدد ناطق', 'ليس عددًا ناطقًا'], correct: 0, correction: 'العدد 81 مربع العدد 9.' },
                  { id: 'd', label: M('$\\sqrt{\\dfrac{25}{13}}$'), options: ['عدد ناطق', 'ليس عددًا ناطقًا'], correct: 1, correction: 'هذا الكسر ليس مربعًا لعدد ناطق (الصنف الثاني).' },
                  { id: 'e', label: M('$\\sqrt{2}$'), options: ['عدد ناطق', 'ليس عددًا ناطقًا'], correct: 1, correction: 'لا يوجد عدد ناطق مربعه 2.' },
                ]}
                requires={['murabba-natiq', 'ghayr-natiq']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: ' : 'السؤال دائمًا: هل العدد تحت الجذر مربع لعدد ناطق؟ '}
                    <MathText>{'$\\sqrt{0{,}25} = 0{,}5$ و $\\sqrt{81} = 9$'}</MathText> عددان ناطقان؛ أما <MathText>{'$\\sqrt{13}$ ، $\\sqrt{\\dfrac{25}{13}}$ ، $\\sqrt{2}$'}</MathText> فليست أعدادًا ناطقة.
                  </Feedback>
                )}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'أوظّف تكنولوجيات الإعلام والاتصال — ما تعرضه الحاسبة', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="situation" title="أوظّف تكنولوجيات الإعلام والاتصال" lines={[ICT_SQRT2.title, ...ICT_SQRT2.steps]} source={ICT_SQRT2.source} compact />
              <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                <p>حاسبة علمية تعرض للفرق عددًا غير معدوم: <MathText>{`$\\sqrt{2} - a \\approx ${ICT_SQRT2.difference}$`}</MathText></p>
                <p>ويمكن أن نتحقق بالحساب اليدوي: <MathText>{`$${ICT_SQRT2.reading.replace(',', '{,}')}^2 = ${ICT_SQRT2.readingSquare.replace(',', '{,}')}$`}</MathText></p>
              </div>
              <TapQuestion
                prompt={<span>كيف تفسّر النتيجة؟</span>}
                options={[
                  'الحاسبة أخطأت في حساب الجذر التربيعي للعدد 2',
                  <MathText key="ok">{ICT_SQRT2.interpretation}</MathText>,
                  <MathText key="eq">{'$\\sqrt{2} = 1{,}414213562$ بالضبط، والفرق خطأ في الطرح'}</MathText>,
                  <MathText key="dec">{'$\\sqrt{2}$ عدد عشري له تسعة أرقام بعد الفاصلة'}</MathText>,
                ]}
                correct={1}
                cols={1}
                requires={['ghayr-natiq', 'qima-mudbuta']}
                explain={<span>2 ليس مربعًا لعدد ناطق، إذن <MathText>{'$\\sqrt{2}$'}</MathText> ليس عددًا ناطقًا: لا يساوي أيّ عدد عشري. ما تعرضه الحاسبة قيمة مقرّبة، ومربعها لا يساوي 2.</span>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
