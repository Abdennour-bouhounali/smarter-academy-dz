import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/** Module 1 — نشاط 5 (p. 8) : 42 et 60, la méthode par حصر (lab-first). LP : P1. */
export default function Module01IthnanWaArbaunWaSittun() {
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const { a, b } = ACTIVITY.numbers;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 5 — 42 و 60" moduleSubtitle="قواسم، ثم قواسم مشتركة، ثم أكبرها" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo', body: <div className="space-y-1">{ACTIVITY.questions.map((q) => <p key={q}>{q}</p>)}<SourceTag source={ACTIVITY.source} /></div> }}
      intro={<Manipulation type="common-divisors" a={a} b={b} title="1) قواسم 42 و 60 — 2) القواسم المشتركة — 3) أكبرها" lead="عيّن في القائمتين القواسم المشتركة، تحقّق، ثم اختر أكبرها." onFinished={() => setLabDone(true)} />}
      steps={[
        { num: 1, title: ACTIVITY.fill, subtitle: 'أكمل المناولة أولًا', done: q1,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="tayin-bil-hasr" lead="هذا ما فعلته للتوّ، بثلاث خطوات." />
              {!labDone && <p className="text-sm text-slate-600">أنهِ الخطوات الثلاث في المناولة.</p>}
              <TapQuestion prompt={<span>انقل وأكمل: «العدد ... يسمى القاسم ... ... ... للعددين 42 و 60». ونكتب ...</span>}
                options={['العدد 6 يسمى القاسم المشترك الأكبر للعددين 42 و 60، ونكتب PGCD(42 ; 60) = 6', 'العدد 3 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 3', 'العدد 12 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 12', 'العدد 1 يسمى القاسم المشترك الأكبر، PGCD(42 ; 60) = 1']} correct={0} cols={1} requires={['tayin-bil-hasr']}
                explain={<span>القواسم المشتركة لـ 42 و 60 هي 1 ، 2 ، 3 ، 6؛ أكبرها 6: <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 60) = 6$'}</MathText>.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="method" text="لتعيين القاسم المشترك الأكبر لعددين: نحصر قواسم كل عدد، ثم القواسم المشتركة، ثم نأخذ أكبرها." compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
