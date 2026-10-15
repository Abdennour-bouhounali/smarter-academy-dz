import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';

/**
 * Module 1 — l'ENTRÉE : le partage équitable (le labo en tête SANS carte ni titre). LABORATOIRE À DEUX NIVEAUX, un seul type
 * `fair-share` (la main tient la PART d'un enfant ; le labo juge b × x contre les a pains) :
 *   مبتدئ  — la cantine de l'école (plateforme, monde `bakery`) : 3 pains pour 4 enfants (la règle décimale tombe juste), puis 2 pour 3.
 *   متقدم  — نشاط 1 du manuel : 5 pains pour 6 personnes, puis 7 pains pour 3.
 * Les ÉTAPES interrogent ce que l'élève a FAIT : pourquoi la règle décimale n'a jamais fini (P3), comment s'écrit sa part trouvée avec la
 * règle des morceaux (P1), pourquoi b × a/b = a (P2). Le نشاط 1 du manuel est posé en application dans أتمرّن (module 4).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const frac = (a, b) => `$\\frac{${a}}{${b}}$`;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const refused = trials.filter((e) => !e.ok && e.ruler !== 'cut').at(-1);
  const solvedCut = trials.filter((e) => e.ok && e.ruler === 'cut').at(-1);
  const [a, b] = (solvedCut?.order ?? '5/6').split('/').map(Number);

  return (
    <ContentModule
      objectives={['لماذا لا تنتهي الأرغفة بالخطوة العشرية؟', 'كيف نكتب حصّة الواحد؟', 'ماذا يعطي ضرب الحصّة في عدد الأطفال؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — نقتسم الأرغفة"
      moduleSubtitle="الحصّة التي تُنهي الخبز تمامًا"
      estimatedTime="16 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="fair-share" level="beginner" scene="canteen" orders={[[3, 4], [2, 3]]} onTrial={record} />,
            advanced: () => <Manipulation type="fair-share" level="advanced" scene="family" orders={[[5, 6], [7, 3]]} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا بقي شيء دائمًا؟', subtitle: 'الخطوات العشرية', done: q1,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={refused ? 'true' : 'false'}>
                {refused
                  ? <span className="font-bold text-slate-800">جرّبتَ في طلب <bdi dir="ltr">{refused.order.replace('/', ' ÷ ')}</bdi> الحصّة <bdi dir="ltr">{refused.x}</bdi> فلم تنته الأرغفة تمامًا.</span>
                  : <span className="text-slate-500">لم تجرّب بعد خطوة عشرية في لوحتك: ابدأ بالمقبض في الأعلى.</span>}
              </p>
              <TapQuestion
                prompt="في الطلب الذي لم تقع حصّته على أيّ خطوة عشرية، كلّما غيّرتَ الخطوة إلى مئة ثم إلى ألف ماذا لاحظتَ؟"
                options={[M('اقتربتُ من الأرغفة لكن بقي دائمًا شيء ولم تقع الحصّة عليها بالضبط'), M('وقعت الحصّة على الأرغفة بالضبط عند الألف'), M('ازداد الخبز الموجود على الطاولة')]}
                correct={0} cols={1} requires={['qisma-ashriya-ibtidai']}
                explain={<span>كل رقم إضافي بعد الفاصلة يقرّب الحصّة من الأرغفة ولا يصل إليها: يبقى أو ينقص دائمًا جزء صغير.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'كيف نكتب حصّة الواحد؟', subtitle: 'مسطرة القطع', done: q2,
          content: (
            <div className="space-y-3">
              <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence data-tried={solvedCut ? 'true' : 'false'}>
                {solvedCut
                  ? <span className="font-bold text-slate-800">مع مسطرة القطع انتهت الأرغفة تمامًا في طلب <bdi dir="ltr">{a} ÷ {b}</bdi>.</span>
                  : <span className="text-slate-500">لم تستعمل مسطرة القطع بعد: تُفتح في الأعلى بعد تجربتين عشريتين. السؤال هنا عن الطلب <bdi dir="ltr">{a} ÷ {b}</bdi>.</span>}
              </p>
              <TapQuestion
                prompt={<span>قطعتَ كل رغيف إلى {b} قطع متساوية وأخذ كل واحد {a} قطع من {b} في الرغيف. نكتب حصّته بالكسر:</span>}
                options={[M(frac(a, b)), M(frac(b, a)), M(`$${a}{,}${b}$`)]}
                correct={0} cols={3} requires={['kasr-juz-ibtidai']}
                explain={<MathText>{`${a} قطع، كل قطعة جزء من ${b} من الرغيف: $\\frac{${a}}{${b}}$ رغيف.`}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="kasr-hasil-qisma" lead="حصّة الواحد هي حاصل قسمة عدد الأرغفة على عدد الأطفال." />}
            </div>
          ),
        },
        {
          num: 3, title: 'لماذا تنتهي الأرغفة تمامًا؟', subtitle: 'الحصّة × عدد الأطفال', done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>حصّة الواحد <MathText>{frac(a, b)}</MathText> رغيف، و{b} أطفال يأخذون حصصًا متساوية. لماذا تنتهي الأرغفة تمامًا؟</span>}
                options={[M('لأنّ حصص الأطفال معًا تملأ الأرغفة بالضبط: العدد مضروبًا في عدد الأطفال يعطي عدد الأرغفة'), M('لأنّ البسط يُحذف مع المقام دائمًا'), M('لأنّ كل طفل يأخذ رغيفًا كاملًا')]}
                correct={0} cols={1} requires={['kasr-juz-ibtidai']}
                explain={<MathText>{`$${b}\\times\\frac{${a}}{${b}}=${a}$ : الأطفال الـ ${b} يأخذون معًا ${a} أرغفة.`}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
