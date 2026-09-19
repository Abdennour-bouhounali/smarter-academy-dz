import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY_A } from '../content/textbook';

/** Module 1 — نشاط 6 أ (p. 9) : 252 et 140 par les différences successives, puis 378 et 315. LP : P1, P2. */
export default function Module01AlFuruq() {
  const [d1, setD1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [d2, setD2] = useState(false);
  const { a, b, second } = ACTIVITY_A.numbers;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 6 أ — الفروق المتتابعة" moduleSubtitle={ACTIVITY_A.subtitle} estimatedTime="14 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY_A.title, tone: 'indigo', body: <div className="space-y-1"><p>{ACTIVITY_A.intro}</p>{ACTIVITY_A.questions.slice(0, 3).map((q) => <p key={q}><MathText>{q}</MathText></p>)}<SourceTag source={ACTIVITY_A.source} /></div> }}
      intro={<Manipulation type="pgcd-differences" a={a} b={b} title="جدول الكتاب: العددان وفرقهما" lead="اختر نتيجة كل طرح. لاحظ العمود الأيمن: القاسم المشترك الأكبر لا يتغيّر." onFinished={() => setD1(true)} />}
      steps={[
        { num: 1, title: '1) لماذا PGCD(252 ; 140) = PGCD(140 ; 112)؟', subtitle: 'أنهِ الطرحات في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="pgcd-farq" lead="252 − 140 = 112. كل قاسم مشترك لـ 252 و 140 يقسم فرقهما 112." />
              <TapQuestion prompt={<span>لماذا <MathText>{'$\\mathrm{PGCD}(252\\ ;\\ 140) = \\mathrm{PGCD}(140\\ ;\\ 112)$'}</MathText>؟</span>}
                options={['كل قاسم مشترك لـ 252 و 140 يقسم أيضًا 252 − 140 = 112، فللزوجين نفس القواسم المشتركة', 'لأن 112 أصغر من 140', 'لأن 252 = 2 × 140 − 28', 'لأن 140 قاسم للعدد 252']} correct={0} cols={1} requires={['pgcd-farq']}
                explain={<span>خاصية 1 (الدرس 3): القاسم المشترك يقسم الفرق. والعكس صحيح: قاسم مشترك لـ 140 و 112 يقسم مجموعهما 252.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text={ACTIVITY_A.misprint} compact />
            </div>
          ) },
        { num: 2, title: '4) عيّن بطريقة مماثلة PGCD(378 ; 315)', done: d2,
          content: <div className="space-y-3"><KnowledgeBrick id="khwarizmiyat-al-furuq" /><Manipulation type="pgcd-differences" a={second.a} b={second.b} title="378 و 315" onFinished={() => setD2(true)} /></div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
