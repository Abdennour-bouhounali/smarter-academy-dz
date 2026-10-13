import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE } from '../content/textbook';
/** Module 2 — معارف 5 (p. 12) : définition et exemple 22/15. LP : P1, P2. */
export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["متى نقول إن عددين أوّليان فيما بينهما؟", "كيف أطبّق ذلك على 22 و 15؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="معارف — العددان الأوّليّان فيما بينهما" moduleSubtitle="التعريف ومثال الكتاب" estimatedTime="8 دقائق"
      brief={{ tag: 'معارف — الكتاب ص 12', title: 'التعريف', tone: 'violet', body: <p>ما لاحظته مع 17 و 18 يصير تعريفًا.</p> }}
      intro={<Manipulation type="coprime-explorer" a={22} b={15} title="مثال الكتاب: 22 و 15" lead="جرّب في الوسط قواسم 15 واحدًا واحدًا: أيّها يقسم 22 أيضًا؟ ثم تحقّق." />}
      steps={[
        { num: 1, title: 'التعريف', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />
              <TextbookBox kind="example" text={KNOWLEDGE.example} compact />
              <KnowledgeBrick id="laysa-awwali" compact />
              <TapQuestion prompt={<span>15 و 22 أوليان فيما بينهما. هل هذا يعني أن 15 عدد أولي؟</span>}
                options={['لا: «أوليان فيما بينهما» صفة للزوج؛ 15 = 3 × 5', 'نعم: كل عدد أولي فيما بينه وبين غيره عدد أولي', 'نعم لأن 15 فردي', 'لا يمكن الجواب']} correct={0} cols={1} requires={['laysa-awwali']}
                explain={<span>الشرط الوحيد: <MathText>{'$\\mathrm{PGCD}(15\\ ;\\ 22) = 1$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'كيف نثبت أن عددين أوليان فيما بينهما؟', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ithbat-awwaliyan" />
              <TapQuestion prompt={<span>لإثبات أن 143 و 153 أوليان فيما بينهما، أنسب طريقة هي:</span>}
                options={['خوارزمية إقليدس: آخر باقٍ غير معدوم يجب أن يكون 1', 'التحقّق من أن كل واحد منهما عدد أولي', 'التحقّق من أن فرقهما 10', 'قواعد قابلية القسمة على 2 و 3 و 5 و 9 فقط']} correct={0} cols={1} requires={['ithbat-awwaliyan']}
                explain={<span>153 = 143 + 10 ، 143 = 10 × 14 + 3 ، 10 = 3 × 3 + 1: القاسم المشترك الأكبر 1.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
