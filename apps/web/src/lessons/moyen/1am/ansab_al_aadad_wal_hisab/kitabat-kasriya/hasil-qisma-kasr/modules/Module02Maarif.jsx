import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, OPENER } from '../content/textbook';

/**
 * Module 2 — معارف 1 (p. 55) « حاصل القسمة والكسر » : chaque boîte du manuel NOMME ce que l'élève vient de trouver (question → boîte →
 * brique) : a ÷ b = a/b et le vocabulaire (7 ÷ 3), la نتيجة a/b × b = a, le contraste décimal / non décimal (7/3, 2,33) puis « تمهيد »
 * (الكاشي) en clôture. Le dernier exemple de معارف 1 (0,7 = 7/10) est à `ikhtizal-kitaba-kasriya`. LP : P1, P2, P3.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule
      objectives={['كيف نكتب حاصل قسمة 7 على 3؟', 'ماذا يعطي ضرب الكسر في مقامه؟', 'هل الكسر عدد عشري دائمًا؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(2)}
      moduleNumber={2}
      moduleTitle="معارف — حاصل القسمة والكسر"
      moduleSubtitle="a ÷ b = a/b · a/b × b = a · عشري أو لا"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'معارف — الكتاب ص 55', title: 'نسمّي ما وجدته في الأرغفة', tone: 'violet',
        body: <p>الكتاب يكتب بالرموز ما فعلته بالأرغفة. أجب أوّلًا ثم اقرأ ما يقوله الكتاب.</p>,
      }}
      steps={[
        {
          num: 1, title: 'حاصل قسمة 7 على 3', subtitle: 'البسط والمقام', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt="حاصل قسمة 7 على 3 يُكتب:"
                options={[M('$\\frac{7}{3}$'), M('$\\frac{3}{7}$'), M('$2{,}33$ بالضبط')]}
                correct={0} cols={3} requires={['kasr-hasil-qisma']}
                explain={<MathText>{'$7\\div 3=\\frac{7}{3}$ : المقسوم 7 هو البسط والمقسوم عليه 3 هو المقام.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <TextbookBox kind="definition" lines={[KNOWLEDGE.definition, KNOWLEDGE.vocabulary]} source={KNOWLEDGE.source} compact />}
              {q1 && <TextbookBox kind="remark" lines={KNOWLEDGE.remarks} source={KNOWLEDGE.source} compact />}
            </div>
          ),
        },
        {
          num: 2, title: 'ضرب الكسر في مقامه', subtitle: '7/3 × 3', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'$\\frac{7}{3}\\times 3=\\ldots$'}</MathText>}
                options={[M('7'), M('3'), M('$\\frac{7}{9}$')]}
                correct={0} cols={3} requires={['kasr-hasil-qisma']}
                explain={<MathText>{'ثلاث حصص من $\\frac{7}{3}$ رغيف تملأ 7 أرغفة: $\\frac{7}{3}\\times 3=7$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="natija-darb" lead="في الأرغفة: حصص الأطفال معًا تملأ الأرغفة بالضبط." />}
              {q2 && <TextbookBox kind="property" text={KNOWLEDGE.result} source={KNOWLEDGE.source} compact />}
              {q2 && <TextbookBox kind="example" text={KNOWLEDGE.example1} source={KNOWLEDGE.source} compact />}
            </div>
          ),
        },
        {
          num: 3, title: 'هل 7/3 عدد عشري؟', subtitle: 'القيمة المضبوطة والمقرّبة', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<MathText>{'القسمة العشرية لـ 7 على 3 تعطي $2{,}333\\ldots$ فالكسر $\\frac{7}{3}$:'}</MathText>}
                options={[M('ليس عددًا عشريًا لأنّ القسمة لا تنتهي'), M('عدد عشري هو $2{,}33$'), M('عدد عشري هو $2{,}3$')]}
                correct={0} cols={1} requires={['qisma-ashriya-ibtidai']}
                explain={<MathText>{'$3\\times 2{,}33=6{,}99$ وليس 7: $2{,}33$ قيمة مقرّبة فقط.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="ashri-ghayr-ashri" lead="في الأرغفة: 0,66 ثم 0,666 ثم … ولا تنتهي الأرغفة." />}
              {q3 && <TextbookBox kind="example" text={KNOWLEDGE.example2} source={KNOWLEDGE.source} compact />}
              {q3 && <TextbookBox kind="remark" title="من تاريخ الكسور" text={OPENER.text} source={OPENER.source} compact />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
