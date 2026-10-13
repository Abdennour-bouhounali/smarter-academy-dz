import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 3 (p. 22) : « المعادلات من الشكل x² = a ».
 *
 * L'instrument du module 1 revient, sur les TROIS EXEMPLES de la خاصية 2
 * (x² = 9, x² = 5, x² = −1) : un exemple travaillé, un seul niveau
 * (`levels={false}`). √5 ne tombe sur aucune graduation — l'élève s'en
 * approche et c'est √5 exact qui est épinglé.
 *
 *   étape 1  la خاصية 1 (posée au module 1) avec ses remarques et ses exemples ;
 *   étape 2  brique `hulul-x2-a` (خاصية 2) PUIS la question ;
 *   étape 3  pourquoi a < 0 ne donne aucune solution.
 * LP : P1.
 */
const { prop1, prop2 } = KNOWLEDGE;
const M = (s) => <MathText key={s}>{s}</MathText>;
const COUNT = ['تقبل حلين متعاكسين', 'تقبل حلا واحدا', 'لا تقبل أي حل'];

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — المعادلات من الشكل x² = a"
      moduleSubtitle="خاصيتان"
      estimatedTime="12 دقيقة"
      objectives={['كيف نكتب حلول المعادلة $x^2 = a$ حسب إشارة $a$؟', 'ماذا يحدث للمعادلة $x^2 = -1$؟']}
      brief={{
        tag: 'معارف — الكتاب ص 22', title: <MathText>{KNOWLEDGE.title}</MathText>, tone: 'violet',
        body: <p>في النشاط رأيت أن لعددين متعاكسين نفس المربع، وأن لا سهم يصل إلى الأعداد السالبة. الكتاب يكتب ذلك في خاصيتين.</p>,
      }}
      intro={
        <Manipulation
          type="square-fold"
          targets={prop2.targets}
          scale={10}
          levels={false}
          title="أمثلة الكتاب: ثلاث معادلات"
          lead="هذه معادلات أمثلة الكتاب. حلّ كل واحدة على المستقيم قبل أن تقرأ الخاصية 2."
        />
      }
      steps={[
        {
          num: 1, title: 'خاصية 1: عددان متعاكسان', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="murabba-mutaakisayn" variant="rappel" compact />
              <TextbookBox kind="remark" lines={prop1.aside} source={KNOWLEDGE.source} compact />
              <TextbookBox kind="example" lines={prop1.examples} compact />
              <TapQuestion
                prompt={<span>ليكن <MathText>{'$a$'}</MathText> عددا موجبا. ماذا نقول عن العدد <MathText>{'$-\\sqrt{a}$'}</MathText>؟</span>}
                options={[
                  'هو معاكس العدد الموجب $\\sqrt{a}$، ومربعه يساوي $a$',
                  'مربعه يساوي $-a$',
                  'هو الجذر التربيعي للعدد $-a$',
                  'مربعه سالب لأنه عدد سالب',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['murabba-mutaakisayn']}
                explain={<MathText>{`${prop1.aside[1]}. ${prop1.note}`}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'خاصية 2: ثلاث حالات', subtitle: 'حسب إشارة العدد a', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="hulul-x2-a" lead="الكتاب يجمع ما حدث على المستقيم في ثلاث حالات، حسب إشارة a:" />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">طبّق الخاصية 2 على معادلات الأمثلة:</p>}
                rows={[
                  { id: 'e9', label: M('$x^2 = 9$'), options: COUNT, correct: 0, correction: M(prop2.examples[0]) },
                  { id: 'e5', label: M('$x^2 = 5$'), options: COUNT, correct: 0, correction: M(prop2.examples[1]) },
                  { id: 'em1', label: M('$x^2 = -1$'), options: COUNT, correct: 2, correction: M(prop2.examples[2]) },
                ]}
                requires={['hulul-x2-a']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا. ' : 'انظر إلى التصحيحات. '}<MathText>{prop2.examples[1]}</MathText>
                  </Feedback>
                )}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا يحدث عندما يكون a سالبا؟', done: q3,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="example" lines={prop2.examples} compact />
              <TapQuestion
                prompt={<span>لماذا لا تقبل المعادلة <MathText>{'$x^2 = -1$'}</MathText> أي حل؟</span>}
                options={[
                  'لأن مربع أي عدد هو دائما عدد موجب، و $-1$ سالب',
                  'لأن $(-1)^2 = -1$',
                  'لأن $\\sqrt{1} = -1$',
                  'لأن $1^2 = -1$',
                ].map(M)}
                correct={0}
                cols={1}
                requires={['murabba-mutaakisayn', 'hulul-x2-a']}
                explain={<span><MathText>{'$(-1)^2 = 1$'}</MathText> و <MathText>{'$1^2 = 1$'}</MathText>: <MathText>{prop1.note}</MathText></span>}
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
