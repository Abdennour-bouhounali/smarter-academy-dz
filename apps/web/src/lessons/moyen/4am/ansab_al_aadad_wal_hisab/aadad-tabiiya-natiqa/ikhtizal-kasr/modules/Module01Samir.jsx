import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';
/** Module 1 — نشاط 8 (p. 9) : la réduction de سمير, manipulée (fraction-reduction). LP : P1, P2. */
export default function Module01Samir() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { n, d, path } = ACTIVITY.numbers;
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 8 — كيف اختزل سمير 84/48؟" moduleSubtitle="÷4 ثم ÷3 … ثم لا شيء" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY.title, tone: 'indigo', body: <div className="space-y-1"><p><MathText>{ACTIVITY.questions[0]}</MathText></p><p className="text-center text-lg"><MathText>{ACTIVITY.samirPath}</MathText></p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={<Manipulation type="fraction-reduction" n={n} d={d} path={path} title="اختزل 84/48 بنفسك" lead="اختر قاسمًا مشتركًا للبسط والمقام، اقسم، وأعد. متى تتوقف؟" onFinished={() => setLabDone(true)} />}
      steps={[
        { num: 1, title: 'أ) اشرح طريقة سمير', subtitle: 'أنهِ الاختزال في المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="ikhtizal" />
              {!labDone && <p className="text-sm text-slate-600">في المناولة: اقسم على قاسم مشترك، ثم على آخر، حتى لا يبقى إلا 1.</p>}
              <TapQuestion prompt={<span>ما الذي فعله سمير في كل خطوة؟</span>}
                options={['قسم البسط والمقام على قاسم مشترك لهما (4 ثم 3)', 'طرح 4 ثم 3 من البسط والمقام', 'قسم البسط فقط', 'ضرب البسط والمقام في 4 ثم 3']} correct={0} cols={1} requires={['ikhtizal']}
                explain={<span>القسمة على قاسم مشترك لا تغيّر قيمة الكسر: <MathText>{'$\\dfrac{84}{48} = \\dfrac{21}{12} = \\dfrac{7}{4}$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'هل يمكن مواصلة اختزال 7/4؟ لماذا؟', done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="kasr-ghayr-qabil" lead="7 و 4 لا يقسمهما معًا إلا 1: أوليان فيما بينهما." />
              <TapQuestion prompt={<span>لماذا لا يمكن مواصلة اختزال <MathText>{'$\\dfrac{7}{4}$'}</MathText>؟</span>}
                options={['لأن 7 و 4 أوليان فيما بينهما: PGCD(7 ; 4) = 1', 'لأن 7 عدد أولي', 'لأن 4 أصغر من 7', 'لأن 7 − 4 = 3 عدد فردي']} correct={0} cols={1} requires={['kasr-ghayr-qabil']}
                explain={<span>{ACTIVITY.questions[2].replace(/\$/g, '')}</span>} onAnswered={() => setQ2(true)} />
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.questions[2]} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
