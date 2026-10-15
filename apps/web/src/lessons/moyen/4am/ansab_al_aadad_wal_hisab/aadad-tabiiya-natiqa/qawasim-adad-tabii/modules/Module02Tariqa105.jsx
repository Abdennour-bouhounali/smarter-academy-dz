import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick, PredictRule } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD } from '../content/textbook';

/**
 * Module 2 — طريقة p. 11 : « تعيين قواسم عدد طبيعي » avec 105 (rétrofit 2026-10-15 : le labo ouvre le module, SANS carte ni titre).
 * Ordre : un diviseur reçu « gratuitement » comme partenaire (15 = 105 ÷ 7, sans l'avoir testé) → jusqu'où tester AVANT tout calcul
 * (« أتوقّع القاعدة ») → la méthode du manuel lue ligne à ligne (la brique et la boîte APRÈS la réponse) → les règles qui accélèrent
 * (brique après la réponse). LP : P3, P4.
 */
export default function Module02Tariqa105() {
  const [q0, setQ0] = useState(false);
  const [q1, setQ1] = useState(false);
  const [read, setRead] = useState(false);
  const [q2, setQ2] = useState(false);
  return (
    <ContentModule objectives={["هل أحتاج إلى اختبار كل قاسم؟", "إلى أي عدد نختبر القسمة؟", "كيف نرتّب القواسم المكتشفة؟"]}
      ctx={MODULE_CTX} navLinks={getNavLinks(2)} moduleNumber={2}
      moduleTitle="طريقة — قواسم العدد 105" moduleSubtitle="إلى أي عدد نختبر؟" estimatedTime="14 دقيقة"
      intro={<Manipulation type="factor-pairs" n={105} lead="هذه المرّة 105 كتب، وعدد الصفوف الممكنة كبير." />}
      steps={[
        { num: 1, title: 'هل تختبر كل قاسم بنفسك؟', done: q0,
          content: (
            <TapQuestion prompt={<span>عند اختبار 7 يظهر المستطيل التامّ <MathText>{'$105 = 7 \\times 15$'}</MathText>. هل تحتاج إلى اختبار صفّ من 15 كتابًا لتعرف أنّ 15 قاسم للعدد 105؟</span>}
              options={['لا: 15 هو الشريك الذي جاء مع 7 في المستطيل نفسه', 'نعم: لا نعرف ذلك قبل إجراء القسمة', 'لا: لأنّ 15 أصغر من 105']} correct={0} cols={1}
              explain={<span>7 يقسم 105 والمستطيل <MathText>{'$7 \\times 15$'}</MathText> تامّ، فالعدد 15 قاسم أيضًا دون أيّ اختبار.</span>}
              onAnswered={() => setQ0(true)} />
          ) },
        { num: 2, title: 'إلى أيّ عدد نختبر؟', done: q1,
          content: (
            <PredictRule id="tariqa-qawasim">
            <TapQuestion prompt={<span>للبحث عن قواسم 105، ما أصغر عدد نتوقّف عنده ونحن متأكّدون، قبل أي حساب، أنّنا لم ننسَ قاسمًا؟</span>}
              options={['إلى 10، لأن 10² ≤ 105 < 11²', 'إلى 52، أي نصف 105', 'إلى 105', 'إلى 7، لأن 7 قاسم']} correct={0} cols={1}
              requires={['jidaa-aamilayn']}
              explain={<span>إذا كان <MathText>{'$105 = d \\times e$'}</MathText> مع <MathText>{'$d \\leq e$'}</MathText> فإن <MathText>{'$d^2 \\leq 105$'}</MathText>: كل قاسم أكبر من 10 هو شريك قاسم أصغر.</span>}
              onAnswered={() => setQ1(true)} />
            </PredictRule>
          ) },
        { num: 3, title: 'الطريقة، سطرًا سطرًا', done: read,
          content: q1 ? <div className="space-y-3"><KnowledgeBrick id="tariqa-qawasim" /><MethodSteps method={METHOD} onAllRevealed={() => setRead(true)} /></div> : <p className="text-sm text-slate-500">تظهر الطريقة بعد أن تجيب عن السؤال السابق.</p> },
        { num: 4, title: 'هل تُسرّع قواعد قابلية القسمة الاختبار؟', done: q2,
          content: (
            <div className="space-y-3">
              <TapQuestion prompt={<span>هل يقبل 105 القسمة على 3؟ على 5؟ على 9؟ (بدون قسمة)</span>}
                options={['على 3 و 5 نعم، على 9 لا', 'على 3 و 9 نعم، على 5 لا', 'على 5 فقط', 'على 3 و 5 و 9']} correct={0} cols={1}
                explain={<span>مجموع الأرقام 6: يقبل القسمة على 3 لا على 9؛ رقم الوحدات 5: يقبل القسمة على 5.</span>}
                onAnswered={() => setQ2(true)} />
              {q2 && <KnowledgeBrick id="qawaid-qisma" compact />}
            </div>
          ) },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={2} />}
    />
  );
}
