import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/** Module 1 — نشاط 4 (p. 8) : 90 و 54، 9 باقات؟ أكبر عدد من الباقات؟ Lab-first (common-divisors, vue « باقات »). LP : P1, P3. */
export default function Module01Baqat() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { red, white } = ACTIVITY.numbers;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 4 — باقات متماثلة" moduleSubtitle="90 زهرة حمراء و 54 زهرة بيضاء" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo', body: <div className="space-y-1"><p>{ACTIVITY.situation}</p>{ACTIVITY.questions.slice(0, 3).map((q) => <p key={q}>{q}</p>)}<SourceTag source={ACTIVITY.source} /></div> }}
      intro={<Manipulation type="common-divisors" a={red} b={white} context={ACTIVITY.context} title="قواسم 90، قواسم 54، وما بينهما" lead="اختر في القائمتين الأعداد التي تقسم 90 و 54 معًا: كل واحد منها عدد باقات ممكن." onFinished={() => setLabDone(true)} />}
      steps={[
        { num: 1, title: 'هل يمكنه تشكيل 9 باقات؟ ماذا يمثل العدد 9؟', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qawasim-mushtaraka" lead="9 يقسم 90 و 54 معًا: هذا ما يسمّيه الكتاب قاسمًا مشتركًا." />
              <TapQuestion prompt={<span>9 باقات: في كل باقة <MathText>{'$90 \\div 9 = 10$'}</MathText> زهرات حمراء و <MathText>{'$54 \\div 9 = 6$'}</MathText> بيضاء. ماذا يمثّل 9 بالنسبة إلى 90 و 54؟</span>}
                options={['9 قاسم مشترك للعددين 90 و 54', '9 مضاعف مشترك للعددين', '9 هو الفرق بين 90 و 54', '9 قاسم لـ 90 فقط']} correct={0} cols={2} requires={['qawasim-mushtaraka']}
                explain={<span>9 يقسم 90 ويقسم 54 في آن واحد؛ لذلك لا تبقى أية زهرة.</span>} onAnswered={() => setQ1(true)} />
            </div>
          ) },
        { num: 2, title: 'ب) أكبر عدد ممكن من الباقات المتماثلة', subtitle: 'أكمل المناولة أولًا', done: q2,
          content: (
            <div className="space-y-3">
              {!labDone && <p className="text-sm text-slate-600">في المناولة، بعد تعيين القواسم المشتركة، اختر أكبرها.</p>}
              <TapQuestion prompt={<span>ما هو أكبر عدد ممكن من الباقات المتماثلة؟ وكم زهرة من كل لون في الباقة؟</span>}
                options={['18 باقة: 5 حمراء و 3 بيضاء', '9 باقات: 10 حمراء و 6 بيضاء', '6 باقات: 15 حمراء و 9 بيضاء', '54 باقة']} correct={0} cols={1} requires={['qawasim-mushtaraka']}
                explain={<span>القواسم المشتركة لـ 90 و 54 هي 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ أكبرها 18.</span>} onAnswered={() => setQ2(true)} />
              {q2 && <TextbookBox kind="remark" text={ACTIVITY.closing} compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
