import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : la صينية المئة. UNE SEULE PISTE (§4quater) : le labo
 * `hundred-grid` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main PEINT t cases d'un plateau de 100. Les ÉTAPES interrogent ce que
 * l'élève a FAIT, avec SES essais : ce que vaut une case (P1), comment le panier se calcule (P1), le taux qui remplit un panier (P2), combien de cases après +t %
 * (P3), pourquoi +20 % puis −20 % ne ramène pas au départ (P3). Les noms (briques) viennent APRÈS la réponse. Le نشاط 2 du manuel est posé en application
 * au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children)}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const mine = trials.filter((e) => !e.free && e.ok);
  const cell = mine.findLast((e) => e.tk === 'of') ?? mine.findLast((e) => e.tk === 'rate');
  const rate = mine.findLast((e) => e.tk === 'rate');
  const up = mine.findLast((e) => e.tk === 'change' && e.dir === 'up');
  const chain = mine.findLast((e) => e.tk === 'change' && e.dir === 'down' && e.x === '240');

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['ماذا تساوي الخانة الواحدة؟', 'كيف تُحسب حصّة من المخزون؟', 'كيف نجد النسبة من جزء وكلّ؟', 'ماذا تفعل الزيادة بالمئة خانة؟', 'لماذا لا تعيدنا زيادة ثم نقصان إلى البداية؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — الصينية المئة"
      moduleSubtitle="مخزن مقسوم إلى مئة خانة"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="hundred-grid" level="beginner" {...LAB.beginner} onTrial={record} />,
            advanced: () => <Manipulation type="hundred-grid" level="advanced" {...LAB.advanced} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ماذا تساوي الخانة الواحدة؟', subtitle: 'قيمة الخانة', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="cell" ok={!!cell}
                done={<span>في لوحتك: <Ltr>{cell?.painted}</Ltr> خانة من مخزون <Ltr>{cell?.x}</Ltr> حملت السلّة <Ltr>{cell?.expected}</Ltr> كيسًا، فالخانة <Ltr>{cell?.packet}</Ltr> .</span>}
                todo="أنجز مهمة في الصينية تنقل فيها خانات إلى السلّة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="قُسِّم المخزون إلى مئة خانة متساوية. ماذا تساوي الخانة الواحدة منه؟"
                options={[M('المخزون $\\div\\ 100$'), M('المخزون $\\times\\ 100$'), M('المخزون $-\\ 100$')]}
                correct={0} cols={1} requires={['nisba-miawiya-2am']}
                explain={<MathText>{GUIDE.oneCell}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="khana-qima" lead="مخزون مقسوم إلى مئة جزء متساوٍ: ماذا يساوي الجزء الواحد؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'كيف نحسب ما تحمله السلّة؟', subtitle: 't خانة', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="cell2" ok={!!cell}
                done={<span>رسمتَ <Ltr>{cell?.painted}</Ltr> خانة فصار في السلّة <Ltr>{cell?.expected}</Ltr> كيسًا، وكلّ خانة <Ltr>{cell?.packet}</Ltr> .</span>}
                todo="أنجز مهمة في الصينية تنقل فيها خانات إلى السلّة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="رسمتَ $t$ خانة من مخزون $x$ . كيف تعرف ما تحمله السلّة؟"
                options={[M('عدد الخانات $\\times$ قيمة الخانة الواحدة'), M('عدد الخانات $+$ قيمة الخانة الواحدة'), M('المخزون $-$ عدد الخانات')]}
                correct={0} cols={1} requires={['khana-qima']}
                explain={<MathText>{'السلّة تحمل $t$ خانة، كلّ خانة $\\frac{x}{100}$ : $t \\times \\frac{x}{100} = x \\times \\frac{t}{100}$ .'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="hissa-t" lead="t خانة من مئة: كم تحمل السلّة من المخزون؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'كيف نجد النسبة من جزء وكلّ؟', subtitle: 'جزء من كلّ', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="rate" ok={!!rate}
                done={<span>ملأتَ سلّة بـ <Ltr>{rate?.expected}</Ltr> كيسًا من مخزون <Ltr>{rate?.x}</Ltr> برسم <Ltr>{rate?.painted}</Ltr> خانة.</span>}
                todo="أنجز مهمة «املأ السلّة بالضبط» في الصينية، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="السلّة تحمل جزءًا $a$ من مخزون كلّي $b$ ، وهو يقابل $t$ خانة من المئة. ما العلاقة؟"
                options={[M('$\\dfrac{a}{b} = \\dfrac{t}{100}$'), M('$a \\times b = t$'), M('$b - a = t$')]}
                correct={0} cols={3} requires={['hissa-t']}
                explain={<MathText>{'الجزء من الكلّ هو $\\frac{a}{b}$ ، وهو يساوي حصّة $t$ خانة من المئة: $\\frac{t}{100}$ .'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'ماذا تفعل الزيادة بالمئة خانة؟', subtitle: 'زيادة بنسبة مئوية', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="up" ok={!!up}
                done={<span>زاد مخزون <Ltr>{up?.x}</Ltr> بـ <Ltr>{up?.t}%</Ltr> فصار <Ltr>{up?.expected}</Ltr> كيسًا.</span>}
                todo="أنجز مهمة الزيادة بنسبة مئوية في الصينية، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="زاد المخزون بـ $t\\%$ . كم خانة (من الخانات المتساوية) يحتوي الآن؟"
                options={[M('$100 + t$'), M('$t$'), M('$100 - t$')]}
                correct={0} cols={3} requires={['hissa-t']}
                explain={<MathText>{GUIDE.moved}</MathText>}
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="ziyada-nuqsan" lead="مخزون يزيد أو ينقص بنسبة مئوية: بأيّ عدد نضربه؟" />}
            </div>
          ),
        },
        {
          num: 5, title: 'لماذا لا نعود إلى البداية؟', subtitle: 'زيادة ثم نقصان', done: q5,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="chain" ok={!!chain}
                done={<span>بعد زيادة بـ 20% صار المخزون <Ltr>{chain?.x}</Ltr> ثم نقص بـ <Ltr>{chain?.t}%</Ltr> فصار <Ltr>{chain?.expected}</Ltr> لا 200 .</span>}
                todo="جرّب المستوى المتقدّم لترى زيادة بـ 20% ثم تخفيضها بـ 20% ، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="زاد مخزون بـ $20\\%$ ثم نقص بـ $20\\%$ ، فلم يعد إلى قيمته الأولى. لماذا؟"
                options={[
                  '$20\\%$ الثانية حُسبت من مخزون أكبر، فالخانة الواحدة صارت أكبر',
                  '$20\\%$ الثانية أصغر من $20\\%$ الأولى',
                  'وقع خطأ في الصينية',
                ].map(M)}
                correct={0} cols={1} requires={['ziyada-nuqsan']}
                explain={<MathText>{GUIDE.undo.right}</MathText>}
                onAnswered={() => setQ5(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
