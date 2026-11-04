import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, METHOD, ACTIVITY } from '../content/textbook';
/** Module 2 (rétrofit 2026-10-15 : labo en tête sans carte ni titre ; définition et brique APRÈS leur question ; 1re étape = POURQUOI une seule division suffit) — معارف 6 (p. 12) + طريقة 595/560 (p. 13). Activité 8 ب/جـ : PGCD(84 ; 48) = 12 en une fois. LP : P2, P3. */
export default function Module02Maarif() {
  const [q0, setQ0] = useState(false);
  const [labDone, setLabDone] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [read, setRead] = useState(false);
  return (
    <ContentModule objectives={["متى يكون الكسر غير قابل للاختزال؟", "هل توجد قسمة واحدة تكفي لاختزال 84/48؟", "ما علاقة PGCD بالشكل غير القابل للاختزال؟"]} ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2} moduleTitle="معارف — الكسور غير القابلة للاختزال" moduleSubtitle="التعريف، وطريقة PGCD" estimatedTime="14 دقيقة"
      intro={<Manipulation type="fraction-reduction" n={ACTIVITY.numbers.n} d={ACTIVITY.numbers.d} path={[12]} onFinished={() => setLabDone(true)} />}
      steps={[
        { num: 1, title: 'لماذا تكفي قسمة واحدة؟', subtitle: 'ب) من تجربتك في الوصفة', done: q0,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={labDone ? 'true' : 'false'}>
                {labDone
                  ? <span className="font-bold text-slate-800">أنهيتَ اختزال <bdi dir="ltr">84/48</bdi> في المناولة.</span>
                  : <span className="text-slate-500">لم تختزل 84/48 بعد في المناولة: جرّب القسمة على 12 مباشرة، ثم أجب عن الأسئلة التي تظهر فوق المختبر.</span>}
              </p>
              <TapQuestion prompt={<span>سمير احتاج إلى القسمة على 4 ثم على 3، أمّا القسمة على 12 فاختزلت <MathText>{'$\\dfrac{84}{48}$'}</MathText> دفعة واحدة. لماذا لا يبقى بعدها قاسم مشترك؟</span>}
                options={['لأن 12 هو أكبر قاسم مشترك للعددين 84 و 48، و 12 = 4 × 3', 'لأن 12 أكبر من 4 ومن 3', 'لأن 12 عدد زوجي', 'لأن 84 − 48 = 36']} correct={0} cols={1}
                explain={<span>القسمتان المتتاليتان على 4 ثم 3 تساويان قسمة واحدة على <MathText>{'$4 \\times 3 = 12$'}</MathText>، وهو PGCD(84 ; 48).</span>} onAnswered={() => setQ0(true)} />
            </div>
          ) },
        { num: 2, title: 'التعريف والأمثلة', done: q1,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>لماذا الكسر <MathText>{'$\\dfrac{15}{22}$'}</MathText> غير قابل للاختزال؟</span>}
                options={['لأن PGCD(22 ; 15) = 1: البسط والمقام أوليان فيما بينهما', 'لأن 15 و 22 عددان أوليان', 'لأن 15 أصغر من 22', 'لأن 22 − 15 = 7']} correct={0} cols={1}
                explain={<span>هذا هو التعريف نفسه.</span>} onAnswered={() => setQ1(true)} />
              {q1 && <TextbookBox kind="definition" text={KNOWLEDGE.definition} source={KNOWLEDGE.source} />}
              {q1 && <TextbookBox kind="example" lines={KNOWLEDGE.examples} compact />}
            </div>
          ) },
        { num: 3, title: 'جـ) الطريقة: القسمة على PGCD', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>PGCD(28 ; 42) = 14. الشكل غير القابل للاختزال للكسر <MathText>{'$\\dfrac{28}{42}$'}</MathText> هو ...</span>}
                options={['2/3', '14/21', '4/6', '1/2']} correct={0} cols={2}
                explain={<span><MathText>{'$\\dfrac{28}{42} = \\dfrac{14 \\times 2}{14 \\times 3} = \\dfrac{2}{3}$'}</MathText>؛ أما 14/21 و 4/6 فما زالا قابلين للاختزال.</span>} onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="ikhtizal-bil-pgcd" lead="بدل عدة قسمات، قسمة واحدة على القاسم المشترك الأكبر." />}
            </div>
          ) },
        { num: 4, title: 'طريقة الكتاب: 595/560', done: read,
          content: <div className="space-y-3"><MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} />{read && <KnowledgeBrick id="tahaqquq-al-ikhtizal" compact />}</div> },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} variant="memo" />} />
  );
}
