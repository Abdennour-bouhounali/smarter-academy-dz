import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_C, KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 2 (p. 46) : « معادلات جداء معدوم », puis « تطبيق ب » du نشاط 2.
 *   1. la définition (brique taarif-muadala-jidaa) et مثال 1 : reconnaître une
 *      معادلة جداء معدوم (une somme, un produit égal à 5 n'en sont pas) ;
 *   2. la propriété (rappel de la brique du module 1, forme formelle du livre) et les
 *      solutions = celles des deux équations (brique hulul-muadala-jidaa), مثال 2 ;
 *   3. مثال 3 sur le TERRAIN : (3x − 4)(−2x + 1), règle graduée en SIXIÈMES (zéros 1/2 et
 *      4/3 — vanishing-pitch, `levels={false}` : exemple du livre), puis la solution du
 *      livre ligne à ligne (MethodSteps) ;
 *   4. تطبيق ب : l'équation (E) — factoriser fait apparaître un produit nul.
 * LP : P1, P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const EXAMPLE3 = { source: KNOWLEDGE.source, exercise: KNOWLEDGE.examples[2], solution: KNOWLEDGE.example3 };

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [read3, setRead3] = useState(false);
  const [q4a, setQ4a] = useState(false);
  const [q4, setQ4] = useState(false);

  return (
    <ContentModule
      objectives={["ماذا نسمّي معادلة طرفها الأول جداء عاملين وطرفها الثاني 0؟", "ما علاقة حلول هذه المعادلة بحلول معادلتين من الدرجة الأولى؟", "ماذا نفعل إذا لم يظهر الجداء في الطرف الأول؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — معادلات جداء معدوم"
      moduleSubtitle="تعريف، خاصية، وثلاثة أمثلة"
      estimatedTime="9 دقائق"
      brief={{
        tag: 'معارف — الكتاب ص 46', title: KNOWLEDGE.title, tone: 'violet',
        body: <p>ما رأيته في الملعب الذي يختفي يقوله الكتاب في تعريف وخاصية، مع ثلاثة أمثلة.</p>,
      }}
      steps={[
        {
          num: 1, title: 'التعريف', subtitle: 'مثال 1', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="taarif-muadala-jidaa" lead="المعادلة التي حللتها بالملعب لها اسم:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">هل هي معادلة جداء معدوم؟</p>}
                rows={[
                  { id: 'a', label: M('$(x + 1)(2x - 3) = 0$'), options: ['نعم', 'لا'], correct: 0, correction: M('جداء عاملين من الدرجة الأولى يساوي 0 : $a = 1$ ، $b = 1$ ، $c = 2$ ، $d = -3$ .') },
                  { id: 'b', label: M('$(x + 1)(2x - 3) = 5$'), options: ['نعم', 'لا'], correct: 1, correction: M('الطرف الثاني 5 وليس 0 : خاصية الجداء المعدوم لا تُطبَّق.') },
                  { id: 'c', label: M('$(x + 1) + (2x - 3) = 0$'), options: ['نعم', 'لا'], correct: 1, correction: M('الطرف الأول مجموع لا جداء: هي معادلة من الدرجة الأولى $3x - 2 = 0$ .') },
                  { id: 'd', label: M('$3x(x - 7) = 0$'), options: ['نعم', 'لا'], correct: 0, correction: M('جداء العاملين $3x$ و $(x - 7)$ يساوي 0 : هنا $b = 0$ في العامل $3x + 0$ .') },
                ]}
                requires={['taarif-muadala-jidaa']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    <MathText>{allRight
                      ? 'شرطان: الطرف الأول جداء عاملين من الدرجة الأولى، والطرف الثاني $0$.'
                      : 'انظر إلى الطرفين: هل الأول جداء (لا مجموع)؟ وهل الثاني $0$ ؟'}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'الخاصية وحلول المعادلة', subtitle: 'مثال 2', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khassiya-jidaa-maadum" variant="rappel" compact />
              <TextbookBox kind="property" title={KNOWLEDGE.propertyTitle} lines={[...KNOWLEDGE.property, KNOWLEDGE.note]} source={KNOWLEDGE.source} compact />
              <KnowledgeBrick id="hulul-muadala-jidaa" lead="الخاصية تحوّل معادلة جداء معدوم إلى معادلتين من الدرجة الأولى:" />
              <TapQuestion
                prompt={<MathText>{'مثال 2 من الكتاب: لماذا $2x = 0$ يعني $x = 0$ ؟'}</MathText>}
                options={[
                  M('لأنّ $2x$ جداء العاملين 2 و $x$ ، و $2 \\neq 0$ ، فالعامل $x$ هو المعدوم'),
                  M('لأنّ $x = 2$ يحقّق المساواة'),
                  M('لأنّ العاملين 2 و $x$ معدومان معًا'),
                ]}
                correct={0}
                cols={1}
                requires={['hulul-muadala-jidaa']}
                explain={<MathText>{`${KNOWLEDGE.examples[1]} — كما كتب أمين: $x - 5 = 0$ بما أنّ $3 \\neq 0$.`}</MathText>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'مثال 3 على الملعب', subtitle: 'مسطرة مدرّجة بالأسداس', done: read3,
          content: (
            <div className="space-y-3">
              <Manipulation
                type="vanishing-pitch"
                expr={KNOWLEDGE.example3Expr}
                levels={false}
                title="مثال الكتاب: ملعب ضلعاه 3x − 4 و −2x + 1"
                lead="المسطرة مدرّجة بالأسداس. جد القيمتين اللتين يختفي عندهما الملعب، ثم قارن بحلّ الكتاب."
              />
              <MethodSteps method={EXAMPLE3} onAllRevealed={() => setRead3(true)} />
            </div>
          ),
        },
        {
          num: 4, title: 'المعادلة (E)', subtitle: 'تطبيق ب', done: q4,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="exercise" text={ACTIVITY_C.text} source={ACTIVITY_C.source} compact />
              <TapQuestion
                prompt={<MathText>{`${ACTIVITY_C.questions[0]} ما العامل المشترك بين الحدّين؟`}</MathText>}
                options={[M('$(1 - 4x)$'), M('$(x + 3)$'), M('$7$')]}
                correct={1}
                cols={3}
                requires={['tahlil-amil']}
                explain={<MathText>{'العامل المشترك $(x + 3)$ : $(x + 3)[(1 - 4x) + 7] = (x + 3)(8 - 4x)$ ، وهو الطرف الثاني المعطى.'}</MathText>}
                onAnswered={() => setQ4a(true)}
              />
              {q4a && (
                <TapQuestion
                  prompt={<MathText>{ACTIVITY_C.questions[1]}</MathText>}
                  options={[M('$-3$ فقط'), M('$3$ و $-2$'), M('$-3$ و $2$'), M('$-3$ و $8$')]}
                  correct={2}
                  cols={2}
                  requires={['hulul-muadala-jidaa']}
                  explain={<MathText>{'(E) تؤول إلى $(x + 3)(8 - 4x) = 0$ ، أي $x + 3 = 0$ أو $8 - 4x = 0$ : $x = -3$ أو $x = 2$ .'}</MathText>}
                  onAnswered={() => setQ4(true)}
                />
              )}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
