import React, { useState } from 'react';
import { ContentModule, TapQuestion, BatchChoiceQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import { Feedback } from '../../../../../../common/components/LessonUI';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 10) : les deux définitions, les quatre formulations,
 * les remarques. L'exemple 143/11 est MANIPULÉ (divisor-explorer en mode
 * classe : quotient → reste → verdict) avant que la définition soit lue.
 * LP : P2, P3, P4.
 */
const [defBaqi, defJidaa] = KNOWLEDGE.definitions;
const [remSiyagh, remWahid, remNafsuh] = KNOWLEDGE.remarks;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — قواسم عدد طبيعي"
      moduleSubtitle="تعريفان لنفس الفكرة"
      estimatedTime="12 دقيقة"
      brief={{
        tag: 'معارف — الكتاب ص 10', title: 'قاسم عدد طبيعي', tone: 'violet',
        body: <p>في النشاط رأينا أن 28 قاسم للعدد 420 لأن الباقي معدوم. الكتاب يعطي لهذه الفكرة تعريفين، ثم أربع جمل تقول الشيء نفسه.</p>,
      }}
      intro={
        <Manipulation type="divisor-explorer" a={143} b={11} candidates={[11, 13, 12]}
          title="مثال الكتاب: 143 و 11" lead="الكتاب يكتب: «11 قاسم للعدد 143. 143 يقبل القسمة على 11». اكشف الحاصل ثم الباقي." />
      }
      steps={[
        {
          num: 1, title: 'التعريف الأول: بالباقي', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={defBaqi.text} source={KNOWLEDGE.source} />
              <TextbookBox kind="example" text={defBaqi.example.text} compact />
              <TapQuestion
                prompt={<span>في المثال، ما الذي يجعل 11 قاسمًا للعدد 143؟</span>}
                options={['حاصل القسمة 13 عدد فردي', 'باقي القسمة الإقليدية لـ 143 على 11 معدوم', '143 أكبر من 11', '11 عدد أولي']}
                correct={1} cols={1} requires={['qasim-baqi']}
                explain={<span>التعريف كله في الباقي: <MathText>{'$143 = 11 \\times 13 + 0$'}</MathText>.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'التعريف الثاني: بالجداء', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qasim-jidaa" lead="نفس الفكرة بكتابة أخرى: باقٍ معدوم يعني أن a هو جداء b في عدد طبيعي." />
              <TextbookBox kind="example" text={defJidaa.example.text} compact />
              <TapQuestion
                prompt={<span>من المساواة <MathText>{'$120 = 6 \\times 20$'}</MathText> نستنتج أن:</span>}
                options={['6 قاسم للعدد 120 فقط', '20 قاسم للعدد 120 فقط', '6 و 20 قاسمان للعدد 120', 'لا 6 ولا 20 قاسم للعدد 120']}
                correct={2} cols={2} requires={['qasim-jidaa']}
                explain={<span>المساواة تُقرأ في الاتجاهين: <MathText>{'$120 = 6 \\times 20 = 20 \\times 6$'}</MathText>، فكل عامل قاسم للعدد 120.</span>}
                onAnswered={() => setQ2(true)}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'أربع جمل، معنى واحد — وملاحظتان', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="siyagh-mutakafia" />
              <KnowledgeBrick id="wahid-wa-nafsuh" compact />
              <BatchChoiceQuestion
                intro={<p className="text-sm font-semibold text-slate-700">بالنسبة إلى «6 قاسم للعدد 120»، هل لكل جملة نفس المعنى؟</p>}
                rows={[
                  { id: 'a', label: '6 يقسم 120', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                  { id: 'b', label: '120 يقبل القسمة على 6', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                  { id: 'c', label: '6 مضاعف للعدد 120', options: ['نفس المعنى', 'معنى مختلف'], correct: 1, correction: 'العكس: 120 مضاعف للعدد 6.' },
                  { id: 'd', label: '120 مضاعف للعدد 6', options: ['نفس المعنى', 'معنى مختلف'], correct: 0 },
                ]}
                requires={['siyagh-mutakafia']}
                feedback={({ allRight }) => (
                  <Feedback tone={allRight ? 'ok' : 'ko'}>
                    {allRight ? 'تمامًا: ' : 'انتبه إلى الاتجاه: '}<MathText>{remSiyagh.text}</MathText>{' '}<MathText>{remWahid.text}</MathText>{' '}<MathText>{remNafsuh.text}</MathText>
                  </Feedback>
                )}
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
