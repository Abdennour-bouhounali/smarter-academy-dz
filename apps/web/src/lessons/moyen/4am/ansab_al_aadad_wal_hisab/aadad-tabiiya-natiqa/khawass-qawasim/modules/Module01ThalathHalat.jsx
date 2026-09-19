import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/** Module 1 — نشاط 3 (p. 8) : les trois cas, manipulés avant d'être nommés. LP : P1, P3. */
export default function Module01ThalathHalat() {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [conj, setConj] = useState(false);
  const [{ a, b, n }, c2v, c3v] = ACTIVITY.cases;
  return (
    <ContentModule
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 3 — ثلاث حالات" moduleSubtitle="n يقسم a و b. ماذا يقسم أيضًا؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        body: <div className="space-y-1"><p>{ACTIVITY.questions[0]}</p><p dir="ltr" className="font-mono text-sm">1) a = 18, b = 12, n = 3 &nbsp; 2) a = 35, b = 15, n = 5 &nbsp; 3) a = 56, b = 21, n = 7</p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={<Manipulation type="divisor-properties" n={n} a={a} b={b} title="الحالة 1: n = 3، a = 18، b = 12" lead="تحقّق أن 3 يقسم 18 و 12، ثم توقّع قبل كل كشف: هل يقسم المجموع؟ الفرق؟ الباقي؟" onFinished={() => setC1(true)} />}
      steps={[
        { num: 1, title: 'الحالتان 2 و 3', subtitle: 'أكمل الحالة 1 في المناولة أولًا', done: c1 && c2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qasim-mushtarak-rappel" variant="rappel" compact />
              <Manipulation type="divisor-properties" n={c2v.n} a={c2v.a} b={c2v.b} title="الحالة 2: n = 5، a = 35، b = 15" onFinished={() => setC2(true)} />
              <Manipulation type="divisor-properties" n={c3v.n} a={c3v.a} b={c3v.b} title="الحالة 3: n = 7، a = 56، b = 21" />
            </div>
          ) },
        { num: 2, title: 'انقل وأكمل التخمين', done: conj,
          content: (
            <div className="space-y-3">
              <TextbookBox kind="conjecture" text={ACTIVITY.conjectures[0].blank} compact />
              <TapQuestion prompt={<span>أكمل التخمين الأول:</span>}
                options={['إذا كان n يقسم كلا من a و b فإن n يقسم a + b و n يقسم a − b', 'إذا كان n يقسم a فإن n يقسم b', 'إذا كان n يقسم a + b فإن n يقسم a و b', 'إذا كان n أصغر من a و b فإن n يقسم a + b']}
                correct={0} cols={1} requires={['qasim-mushtarak-rappel']}
                explain={<span>في الحالات الثلاث، قَسَم <MathText>{'$n$'}</MathText> المجموع والفرق. التخمين الثاني: <MathText>{ACTIVITY.conjectures[1].blank}</MathText> — يصبح خاصية في المحور الموالي.</span>}
                onAnswered={() => setConj(true)} />
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
