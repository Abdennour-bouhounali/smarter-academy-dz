import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import DivisionDisplay from '../../../../../../common/manipulations/primitives/DivisionDisplay';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/** Module 2 — معارف 2 (p. 10) : خاصية 1 و خاصية 2 avec leurs exemples du manuel. LP : P1, P2, P3. */
const [p1, p2] = KNOWLEDGE.properties;
export default function Module02Khassiyatan() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="معارف — خاصيتان" moduleSubtitle="من التخمين إلى الخاصية" estimatedTime="12 دقيقة"
      brief={{ tag: 'معارف — الكتاب ص 10', title: 'خواص قواسم عدد طبيعي', tone: 'violet', body: <p>ما لاحظته في الحالات الثلاث يصوغه الكتاب في خاصيتين، مع مثال لكل واحدة.</p> }}
      steps={[
        { num: 1, title: 'خاصية 1 — المجموع والفرق', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khassiya-1" />
              <TextbookBox kind="example" text={p1.example} source={KNOWLEDGE.source} compact />
              <NumericQuestion prompt={<span>9 يقسم 90 و 900. أي عدد يقسمه 9 أيضًا حسب المثال: <MathText>{'$900 - 90 = ?$'}</MathText></span>} expected={810} display="810"
                requires={['khassiya-1']} explain={<span>9 يقسم الفرق 810 والمجموع 990، دون إجراء القسمة.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'خاصية 1 — المضاعفات', done: q2,
          content: (
            <TapQuestion prompt={<span>9 يقسم 90. أي الأعداد التالية يقسمها 9 حتمًا؟</span>}
              options={['كل مضاعف للعدد 90، مثل 90 × 7', '90 + 1', 'كل قاسم للعدد 90', '9 + 90']} correct={0} cols={1} requires={['khassiya-1']}
              explain={<span>إذا كان <MathText>{'$n$'}</MathText> يقسم <MathText>{'$a$'}</MathText> فإنه يقسم <MathText>{'$k \\times a$'}</MathText> لكل عدد طبيعي <MathText>{'$k$'}</MathText>.</span>}
              onAnswered={() => setQ2(true)} />
          ) },
        { num: 3, title: 'خاصية 2 — باقي القسمة', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="khassiya-2" />
              <div className="flex flex-wrap items-center gap-4">
                <DivisionDisplay dividend={90} divisor={25} quotient={3} remainder={15} />
                <TextbookBox kind="example" text={p2.example} compact />
              </div>
              <TapQuestion prompt={<span>5 يقسم 90 و 25. لماذا يقسم 5 العدد 15؟</span>}
                options={['لأن 15 هو باقي القسمة الإقليدية لـ 90 على 25: 90 = 25 × 3 + 15', 'لأن 15 أصغر من 25', 'لأن 15 = 5 + 10', 'لأن 90 = 6 × 15']} correct={0} cols={1} requires={['khassiya-2']}
                explain={<span><MathText>{'$15 = 90 - 25 \\times 3$'}</MathText>: فرق عددين يقسمهما 5، فهو يقبل القسمة على 5.</span>}
                onAnswered={() => setQ3(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
