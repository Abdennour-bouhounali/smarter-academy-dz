import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, METHOD, ACTIVITY } from '../content/textbook';
/** Module 2 — معارف 6 (p. 12) + طريقة 595/560 (p. 13). Activité 8 ب/جـ : PGCD(84 ; 48) = 12 en une fois. LP : P2, P3. */
export default function Module02Maarif() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [read, setRead] = useState(false);
  return (
    <ContentModule objectives={["متى يكون الكسر غير قابل للاختزال؟", "هل توجد قسمة واحدة تكفي لاختزال 84/48؟", "ما علاقة PGCD بالشكل غير القابل للاختزال؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="معارف — الكسور غير القابلة للاختزال" moduleSubtitle="التعريف، وطريقة PGCD" estimatedTime="14 دقيقة"
      brief={{ tag: 'معارف ص 12 — طرائق ص 13', title: 'الكسور غير القابلة للاختزال', tone: 'violet', body: <p>ب) احسب القاسم المشترك الأكبر للعددين 84 و 48، ثمّ استعمله لاختزال الكسر السابق. جـ) استنتج طريقة.</p> }}
      intro={<Manipulation type="fraction-reduction" n={ACTIVITY.numbers.n} d={ACTIVITY.numbers.d} path={[12]} title="ب) 84/48 مرّة أخرى — هل توجد طريقة أقصر؟" lead="اختزل 84/48 كما فعل سمير، ثم ابحث عن العدد الذي يختزله في خطوة واحدة، وقارن عدد الخطوات." />}
      steps={[
        { num: 1, title: 'التعريف والأمثلة', done: q1,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />
              <TextbookBox kind="example" lines={KNOWLEDGE.examples} compact />
              <TapQuestion prompt={<span>لماذا الكسر <MathText>{'$\\dfrac{15}{22}$'}</MathText> غير قابل للاختزال؟</span>}
                options={['لأن PGCD(22 ; 15) = 1: البسط والمقام أوليان فيما بينهما', 'لأن 15 و 22 عددان أوليان', 'لأن 15 أصغر من 22', 'لأن 22 − 15 = 7']} correct={0} cols={1} requires={['kasr-ghayr-qabil']}
                explain={<span>هذا هو التعريف نفسه.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'جـ) الطريقة: القسمة على PGCD', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ikhtizal-bil-pgcd" lead="بدل عدة قسمات، قسمة واحدة على القاسم المشترك الأكبر." />
              <TapQuestion prompt={<span>PGCD(28 ; 42) = 14. الشكل غير القابل للاختزال للكسر <MathText>{'$\\dfrac{28}{42}$'}</MathText> هو ...</span>}
                options={['2/3', '14/21', '4/6', '1/2']} correct={0} cols={2} requires={['ikhtizal-bil-pgcd']}
                explain={<span><MathText>{'$\\dfrac{28}{42} = \\dfrac{14 \\times 2}{14 \\times 3} = \\dfrac{2}{3}$'}</MathText>؛ أما 14/21 و 4/6 فما زالا قابلين للاختزال.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
        { num: 3, title: 'طريقة الكتاب: 595/560', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="tahaqquq-al-ikhtizal" compact /><MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} /></div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
