import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/** Module 1 — نشاط 7 (p. 9) : 17/18, 22/35, et مريم (27/36). LP : P1, P3. */
export default function Module01SabaataAsharWaThamaniyataAshar() {
  const [c1, setC1] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1} moduleTitle="نشاط 7 — العددان الأوّليّان فيما بينهما" moduleSubtitle="ماذا لو كان القاسم المشترك الوحيد هو 1؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 9', title: ACTIVITY.title, tone: 'indigo', body: <div className="space-y-1"><p>{ACTIVITY.questions[0]}</p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={<Manipulation type="coprime-explorer" a={17} b={18} title="17 و 18" lead="توقّع أولًا، ثم انظر إلى القائمتين: أين القواسم المشتركة؟" onFinished={() => setC1(true)} />}
      steps={[
        { num: 1, title: 'أ) لماذا PGCD(17 ; 18) = 1؟', subtitle: 'اكشف المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="awwaliyan-taarif" lead="القاسم المشترك الوحيد هو 1: هذا ما يسمّيه الكتاب عددين أوليين فيما بينهما." />
              <TapQuestion prompt={<span>لماذا القاسم المشترك الأكبر للعددين 17 و 18 هو 1؟</span>}
                options={['قواسم 17: 1 ، 17؛ قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18؛ القاسم المشترك الوحيد هو 1', 'لأن 17 عدد أولي', 'لأن 18 − 17 = 1 فقط', 'لأن 17 لا يقسم 18']} correct={0} cols={1} requires={['awwaliyan-taarif']}
                explain={<span>نقول إن 17 و 18 أوليان فيما بينهما ونكتب <MathText>{'$\\mathrm{PGCD}(18\\ ;\\ 17) = 1$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              <TextbookBox kind="remark" text={ACTIVITY.questions[1]} compact />
            </div>
          ) },
        { num: 2, title: 'ب) 22 و 35 — جـ) مريم: «27 و 36 أوليان فيما بينهما»', done: q2,
          content: (
            <div className="space-y-3">
              <Manipulation type="coprime-explorer" a={22} b={35} title="ب) أثبت أنّ 22 و 35 أوليان فيما بينهما" />
              <Manipulation type="coprime-explorer" a={27} b={36} title="جـ) 27 و 36: هل مريم على صواب؟" />
              <KnowledgeBrick id="nafy-awwaliyan" compact />
              <TapQuestion prompt={<span>هل مريم على صواب؟</span>}
                options={['لا: 9 قاسم مشترك لـ 27 و 36، فـ PGCD(27 ; 36) = 9 ≠ 1', 'نعم: 27 و 36 فرديان', 'نعم: 36 − 27 = 9 عدد فردي', 'لا: لأن 27 يقسم 36']} correct={0} cols={1} requires={['nafy-awwaliyan']}
                explain={<span>يكفي قاسم مشترك واحد يختلف عن 1 لنفي أن العددين أوليان فيما بينهما.</span>} onAnswered={() => setQ2(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />} />
  );
}
