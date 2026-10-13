import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { ConstructionScene } from '../../../../../../common/manipulations/primitives/ContextScenes';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY } from '../content/textbook';

/**
 * Module 1 — نشاط 3 (p. 8) : les trois cas, manipulés avant d'être nommés.
 *
 * Laboratoire d'ouverture À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels) :
 *
 *   مبتدئ  — le cas 1 du manuel (3 | 18 et 12), sur un CHANTIER : deux murs
 *            en briques de longueur 3 (thème `construction`). Accoler,
 *            enlever, mesurer — le résultat est toujours un mur de briques
 *            entières, et les briques se comptent des yeux.
 *   متقدم  — 9 | 900 et 90 : même chantier, briques trop petites pour être
 *            comptées ; il faut prédire AVEC la propriété avant de poser.
 *            C'est le passage de « je constate » à « je raisonne », et c'est
 *            ce que la leçon vise.
 *
 * Les cas 2 et 3 du manuel restent à l'étape 1 : c'est là que le manuel les
 * pose, et une manipulation ne se rend jamais deux fois sur une page.
 * LP : P1, P3.
 */
export default function Module01ThalathHalat() {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [conj, setConj] = useState(false);
  const [{ a, b, n }, c2v, c3v] = ACTIVITY.cases;
  return (
    <ContentModule objectives={["إذا كان n يقسم a و b، فماذا يقسم أيضًا؟", "هل تصحّ الملاحظة مع أعداد كبيرة لا نستطيع عدّها؟", "ماذا يحدث في الحالات الثلاث؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(1)} moduleNumber={1}
      moduleTitle="نشاط 3 — ثلاث حالات" moduleSubtitle="n يقسم a و b. ماذا يقسم أيضًا؟" estimatedTime="12 دقيقة"
      brief={{ tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        headline: 'هيا نبني بالطوب!', emoji: '🧱', visual: <ConstructionScene />,
        body: <div className="space-y-1"><p><MathText>{ACTIVITY.questions[0]}</MathText></p><p dir="ltr" className="font-mono text-sm">1) a = 18, b = 12, n = 3 &nbsp; 2) a = 35, b = 15, n = 5 &nbsp; 3) a = 56, b = 21, n = 7</p><SourceTag source={ACTIVITY.source} /></div> }}
      intro={(
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="جداران من طوب طوله n. في المستوى المبتدئ يمكنك عدّ الطوب. في المستوى المتقدّم لا يمكن: عليك أن تتوقّع بما لاحظته في الحالة 1."
          levels={{
            beginner: () => (
              <Manipulation type="divisor-properties" n={n} a={a} b={b}
                title="الحالة 1: n = 3، a = 18، b = 12"
                lead="جدار من 18 وجدار من 12، بطوب طوله 3. اسحب جدار b: ألصقه بجدار a، ثم انزعه منه، ثم قِس به جدار a. هل يظهر نصف طوبة؟"
                onFinished={() => setC1(true)} />
            ),
            advanced: () => (
              <Manipulation type="divisor-properties" n={9} a={900} b={90}
                title="أعداد لا تُعدّ: n = 9، a = 900، b = 90"
                lead="الطوب هنا أصغر من أن يُعدّ. توقّع بما لاحظته في الحالة 1 قبل أن تسحب: هل 9 يقسم المجموع؟ الفرق؟ الباقي؟" />
            ),
          }}
        />
      )}
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
