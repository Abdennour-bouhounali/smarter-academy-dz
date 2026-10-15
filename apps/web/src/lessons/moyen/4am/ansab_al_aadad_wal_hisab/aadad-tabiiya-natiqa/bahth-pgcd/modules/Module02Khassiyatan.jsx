import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { PROPERTIES, METHOD_DIFF } from '../content/textbook';

/** Module 2 — معارف 4 « خاصيتان » (p. 12) + طريقة الفروق 117 و 91 (p. 13). LP : P1, P2, P3. */
const [pd, pr] = PROPERTIES.items;
export default function Module02Khassiyatan() {
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["لماذا تعطي طريقة الفروق النتيجة الصحيحة؟", "ما الذي يبقى ثابتًا حين نطرح؟", "كيف تصير عدّة طرحات قسمة واحدة؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="معارف — خاصيتان، وطريقة الفروق" moduleSubtitle="لماذا تعطي الطريقة النتيجة الصحيحة؟" estimatedTime="14 دقيقة"
      brief={{ tag: 'معارف ص 12 — طرائق ص 13', title: 'خاصيتان', tone: 'violet', body: <p>ما فعلته في النشاط يستند إلى خاصيتين يصوغهما الكتاب. الأولى تبرّر الفروق المتتابعة، والثانية ستبرّر خوارزمية إقليدس.</p> }}
      steps={[
        { num: 1, title: 'لماذا توقّفت سلسلة الورشة عند 7 و 7؟', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>في المستوى المبتدئ: 21 و 14 ثم 14 و 7 ثم 7 و 7. لماذا توقّفنا عند PGCD(7 ; 7) = 7؟</span>}
                options={['لأن 7 − 7 = 0: العددان متساويان، وقاسمهما المشترك الأكبر هو 7 نفسه', 'لأن 7 أصغر من 14', 'لأن 21 = 3 × 7', 'لأن الفرق أصغر من 10']} correct={0} cols={1} requires={['pgcd-farq', 'nataij-mubashira']}
                explain={<span>PGCD(a ; a) = a (نتائج مباشرة). آخر فرق غير معدوم هو 7.</span>} onAnswered={() => setQ1(true)} />
              {q1 && (
                <>
                  <TextbookBox kind="property" title="خاصيتان" lines={[PROPERTIES.intro, pd.text]} source={PROPERTIES.source} />
                  <TextbookBox kind="example" text={pd.example} compact />
                </>
              )}
            </div>
          ) },
        { num: 2, title: 'طريقة الكتاب: 117 و 91، سطرًا سطرًا', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="khwarizmiyat-al-furuq" variant="rappel" compact /><MethodSteps method={METHOD_DIFF} onAllRevealed={() => setRead(true)} /></div> },
        { num: 3, title: 'الخاصية الثانية: طرحات كثيرة في عملية واحدة', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>PGCD(45 ; 18) = PGCD(18 ; 9). لماذا 9؟</span>}
                options={['لأن 9 هو باقي القسمة الإقليدية لـ 45 على 18: 45 = 18 × 2 + 9', 'لأن 9 = 18 ÷ 2', 'لأن 45 − 18 = 27 و 27 − 18 = 9، وهذا لا علاقة له بالقسمة', 'لأن 9 قاسم للعدد 18']} correct={0} cols={1}
                explain={<span>الطرح مرتين (45 − 18 − 18 = 9) هو القسمة الإقليدية 45 = 18 × 2 + 9؛ الخاصية 2 تقول إن القاسم المشترك يقسم الباقي.</span>} onAnswered={() => setQ2(true)} />
              {q2 && (
                <>
                  <TextbookBox kind="example" text={pr.example} compact />
                  <KnowledgeBrick id="pgcd-baqi" lead="عدة طرحات متتابعة للعدد نفسه هي قسمة واحدة: الباقي هو ما يتبقى." />
                </>
              )}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />} />
  );
}
