import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';

/**
 * Module 2 — طريقة p. 11 : « تعيين قواسم عدد طبيعي » avec 105.
 * L'élève constate d'abord dans la manipulation qu'après √105 il ne trouve
 * plus de nouveau diviseur, PUIS lit la méthode ligne à ligne. LP : P3, P4.
 */
export default function Module02Tariqa105() {
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="طريقة — قواسم العدد 105" moduleSubtitle="إلى أي عدد نختبر؟" estimatedTime="14 دقيقة"
      brief={{ tag: 'طرائق — الكتاب ص 11', title: METHOD.title, tone: 'violet', body: <p>مع 60 و 48 لاحظت أن الجداءات تتكرر بعد حدّ ما. الكتاب يحوّل هذه الملاحظة إلى طريقة.</p> }}
      intro={<Manipulation type="factor-pairs" n={105} title="العدد 105: مستطيلات الكتب" lead="أطِل الصفّ كتابًا بعد كتاب: متى تصبح كل القواسم معروفة؟" />}
      steps={[
        { num: 1, title: 'لماذا نتوقف عند 10؟', done: q1,
          content: (
            <TapQuestion prompt={<span>للبحث عن قواسم 105، ما أصغر عدد نتوقّف عنده ونحن متأكّدون، قبل أي حساب، أنّنا لم ننسَ قاسمًا؟</span>}
              options={['إلى 10، لأن 10² ≤ 105 < 11²', 'إلى 52، أي نصف 105', 'إلى 105', 'إلى 7، لأن 7 قاسم']} correct={0} cols={1}
              requires={['jidaa-aamilayn']}
              explain={<span>إذا كان <MathText>{'$105 = d \\times e$'}</MathText> مع <MathText>{'$d \\leq e$'}</MathText> فإن <MathText>{'$d^2 \\leq 105$'}</MathText>: كل قاسم أكبر من 10 هو شريك قاسم أصغر.</span>}
              onAnswered={() => setQ1(true)} />
          ) },
        { num: 2, title: 'الطريقة، سطرًا سطرًا', done: read,
          content: <div className="space-y-3"><KnowledgeBrick id="tariqa-qawasim" /><MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} /></div> },
        { num: 3, title: 'قواعد قابلية القسمة تُسرّع', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qawaid-qisma" compact />
              <TapQuestion prompt={<span>هل يقبل 105 القسمة على 3؟ على 5؟ على 9؟ (بدون قسمة)</span>}
                options={['على 3 و 5 نعم، على 9 لا', 'على 3 و 9 نعم، على 5 لا', 'على 5 فقط', 'على 3 و 5 و 9']} correct={0} cols={1}
                requires={['qawaid-qisma']}
                explain={<span>مجموع الأرقام 6: يقبل القسمة على 3 لا على 9؛ رقم الوحدات 5: يقبل القسمة على 5.</span>}
                onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
