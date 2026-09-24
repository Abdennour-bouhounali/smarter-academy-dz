import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, IntegerSetQuestion } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from '../content/textbook';

/** Module 2 — معارف 3 (p. 10) et معارف 4 تعريف + ملاحظة (p. 12). LP : P1, P2, P4. */
export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="معارف — القواسم المشتركة والقاسم المشترك الأكبر" moduleSubtitle="التعريف، الرمز، وملاحظة الكتاب" estimatedTime="15 دقيقة"
      brief={{ tag: 'معارف — الكتاب ص 10 و 12', title: 'قواسم → قواسم مشتركة → القاسم المشترك الأكبر', tone: 'violet', body: <p>ثلاث كلمات لا يجوز خلطها. الكتاب يعرّفها بمثالين: 12 و 18، ثم 28 و 42.</p> }}
      intro={<Manipulation type="common-divisors" a={28} b={42} startWith="lists" title="مثال الكتاب: 28 و 42" lead="اكشف قواسم 28، ثم قواسم 42، ثم القواسم المشتركة، ثم أكبرها." />}
      steps={[
        { num: 1, title: 'القواسم المشتركة لعددين', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={KNOWLEDGE_3.definition} source={KNOWLEDGE_3.source} />
              <TextbookBox kind="example" text={KNOWLEDGE_3.example} compact />
              <IntegerSetQuestion prompt={<span>اكتب القواسم المشتركة للعددين <MathText>{'$12$'}</MathText> و <MathText>{'$18$'}</MathText>.</span>} expected={[1, 2, 3, 6]} requires={['qawasim-mushtaraka']}
                explain="هي الأعداد الموجودة في القائمتين معًا." onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'القاسم المشترك الأكبر والرمز PGCD', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="pgcd-taarif" />
              <KnowledgeBrick id="pgcd-ramz" compact />
              <TapQuestion prompt={<span>القواسم المشتركة لـ 28 و 42 هي 1 ، 2 ، 7 و 14. كيف نكتب قاسمهما المشترك الأكبر؟</span>}
                options={['PGCD(28 ; 42) = 14', 'PGCD(28 ; 42) = 7', 'PGCD(28 ; 42) = 1', 'PGCD(14) = 28 ; 42']} correct={0} cols={2} requires={['pgcd-taarif', 'pgcd-ramz']}
                explain={<span>أكبر القواسم المشتركة هو 14: <MathText>{'$\\mathrm{PGCD}(28\\ ;\\ 42) = 14$'}</MathText>.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
        { num: 3, title: 'ملاحظة الكتاب', done: q3,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qawasim-al-pgcd" lead="انظر القائمتين: القواسم المشتركة 1 ، 2 ، 7 ، 14 هي بالضبط قواسم 14." />
              <TapQuestion prompt={<span>PGCD(a ; b) = 14. ما هي كل القواسم المشتركة للعددين a و b؟</span>}
                options={['1 ، 2 ، 7 ، 14', '14 فقط', '1 و 14 فقط', 'لا يمكن معرفتها دون a و b']} correct={0} cols={2} requires={['qawasim-al-pgcd']}
                explain={<span>القواسم المشتركة لعددين هي قواسم قاسمهما المشترك الأكبر: قواسم 14.</span>} onAnswered={() => setQ3(true)} />
              <TextbookBox kind="remark" text={KNOWLEDGE_4.remark} source={KNOWLEDGE_4.source} compact />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
