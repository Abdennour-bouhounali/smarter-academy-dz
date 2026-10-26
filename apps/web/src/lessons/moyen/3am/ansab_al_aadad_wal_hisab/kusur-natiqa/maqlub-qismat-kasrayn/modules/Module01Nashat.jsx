import React, { useState } from 'react';
import { parseDec } from '@smarter-academy/core';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { FractionQuestion } from '../../../../../../common/textbook';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : la دوّاسة. UNE SEULE PISTE (§4quater) : le labo `gear-crank` en haut, sans
 * carte au-dessus — il porte son contexte et SA question ; la main TOURNE la manivelle, le nombre de tours de pédale est la variable. Les ÉTAPES interrogent ce que
 * l'élève a FAIT, avec SES essais : combien de tours de pédale pour 6 tours de roue (la surprise : plus que 6), pour UN tour de roue (le مقلوب, 3/4 × 4/3 = 1), pourquoi
 * « fois le مقلوب », puis une cible fractionnaire. Les noms (briques) viennent APRÈS la réponse. Le نشاط 1 du manuel est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children)}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const answered = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const record = (e) => setTrials((list) => [...list, e]);
  const mine = trials.filter((e) => !e.free && e.tk === 'release' && e.ok);
  const m2 = mine.findLast((e) => e.id === 'm2');
  const m3 = mine.findLast((e) => e.id === 'm3');
  const a1 = mine.findLast((e) => e.id === 'a1');

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['كم دورة للدوّاسة لعدد من دورات العجلة؟', 'لماذا تلزم دورات أكثر من دورات العجلة؟', 'ما مقلوب عدد؟', 'كيف نقسم كسرًا على كسر؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — دوّاسة الدرّاجة"
      moduleSubtitle="تدوير الدوّاسة حتى تصل العجلة إلى العلم"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="gear-crank" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="gear-crank" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'كم دورة للدوّاسة تلزم؟', subtitle: 'أكثر من دورات العجلة', done: !!q.a && !!q.a2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="m2" ok={!!m2}
                done={<span>في المهمة 2 دارت العجلة <Ltr>{m2?.wheel}</Ltr> دورات حتى بلغت العلم.</span>}
                todo="أنجز المهمة 2 في الدوّاسة حتى تقف العجلة عند العلم، ثم عُد إلى هذا السؤال." />
              <NumericQuestion
                prompt="كم دورةً دارت الدوّاسة حتى بلغت العجلة العلم؟"
                expected={8} display="8" parse={parseDec} requires={['qisma-darb-3am']}
                explain={<MathText>{'كلّ دورة للدوّاسة تُدير العجلة $\\frac{3}{4}$ دورة فقط، فلبلوغ $6$ دورات للعجلة تلزم $8$ دورات للدوّاسة.'}</MathText>}
                onAnswered={answered('a')}
              />
              {q.a && (
                <TapQuestion
                  prompt="لماذا دارت الدوّاسة أكثر من 6 دورات؟"
                  options={[
                    'لأنّ دورة دوّاسة واحدة تُدير العجلة $\\frac{3}{4}$ دورة فقط',
                    'لأنّ الصحن الأمامي أكبر من الترس الخلفي',
                    'لأنّ السلسلة تنزلق',
                  ].map(M)}
                  correct={0} cols={1} requires={['qisma-darb-3am']}
                  explain={<MathText>{'الصحن الأمامي أصغر من الترس الخلفي ($24 < 32$ سنًّا)، فيقدّم السلسلة بسنّ أقلّ من العجلة في كلّ دورة. السلسلة لا تنزلق.'}</MathText>}
                  onAnswered={answered('a2')}
                />
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'وللعجلة دورة واحدة؟', subtitle: 'المقلوب', done: !!q.b && !!q.b2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="m3" ok={!!m3}
                done={<span>في المهمة 3 احتاجت دورة واحدة للعجلة إلى <Ltr>{m3?.pedal}</Ltr> دورة للدوّاسة.</span>}
                todo="أنجز المهمة 3 في الدوّاسة (دورة واحدة للعجلة)، ثم عُد إلى هذا السؤال." />
              <FractionQuestion
                prompt="كم دورةً للدوّاسة تلزم لدورة واحدة للعجلة؟ (كسر)"
                expected="4/3" requires={['qisma-darb-3am']}
                explain={<MathText>{'$32 \\div 24 = \\frac{32}{24} = \\frac{4}{3}$ دورة للدوّاسة.'}</MathText>}
                onAnswered={answered('b')}
              />
              {q.b && (
                <NumericQuestion
                  prompt={<MathText>{'احسب $\\frac{3}{4} \\times \\frac{4}{3}$ :'}</MathText>}
                  expected={1} display="1" parse={parseDec} requires={['jida-kasrayn-2am']}
                  explain={<MathText>{GUIDE.one}</MathText>}
                  onAnswered={answered('b2')}
                />
              )}
              {q.b2 && (
                <TapQuestion
                  prompt={<MathText>{'اكتب القاعدة: العددان $\\frac{3}{4}$ و $\\frac{4}{3}$ جداؤهما $1$ . أيّ عبارة تصف العلاقة بينهما؟'}</MathText>}
                  options={[
                    'كلّ منهما مقلوب الآخر: جداؤهما $1$',
                    'كلّ منهما معاكس الآخر: مجموعهما $0$',
                    'هما عددان متساويان',
                  ].map(M)}
                  correct={0} cols={1} requires={['jida-kasrayn-2am']}
                  explain={<MathText>{'المعاكس يعطي مجموعًا $0$ مع العدد ($\\frac{3}{4} + (-\\frac{3}{4}) = 0$) ؛ أمّا المقلوب فيعطي جداءً $1$ .'}</MathText>}
                  onAnswered={answered('b3')}
                />
              )}
              {q.b3 && <KnowledgeBrick id="maqlub" lead="عددان جداؤهما 1: كيف نسمّي كلًّا منهما بالنسبة إلى الآخر؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'من دورة إلى ست دورات', subtitle: 'القسمة ضرب', done: !!q.c,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="chain" ok={!!m2 && !!m3}
                done={<span>دورة واحدة للعجلة تحتاج <Ltr>{m3?.pedal}</Ltr> دورة للدوّاسة، و <Ltr>{m2?.wheel}</Ltr> دورات للعجلة احتاجت <Ltr>{m2?.pedal}</Ltr> دورات.</span>}
                todo="أنجز المهمتين 2 و 3 في الدوّاسة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="6 دورات للعجلة هي 6 مرّات دورة واحدة. أيّ حساب يعطي عدد دورات الدوّاسة؟"
                options={[M('$6 \\times \\frac{4}{3}$'), M('$6 \\times \\frac{3}{4}$'), M('$6 + \\frac{4}{3}$')]}
                correct={0} cols={3} requires={['maqlub']}
                explain={<MathText>{'$6 \\times \\frac{4}{3} = 8$ . ($6 \\times \\frac{3}{4} = \\frac{9}{2}$ هو عدد دورات العجلة لو دارت الدوّاسة 6 دورات؛ و $6 + \\frac{4}{3}$ لا معنى له هنا.)'}</MathText>}
                onAnswered={answered('c')}
              />
              {q.c && <KnowledgeBrick id="qisma-darb" lead="6 ÷ 3/4 = 6 × 4/3 : ما الذي فعلناه بالقسمة على عدد؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'وإذا كان الهدف كسرًا؟', subtitle: 'كسر على كسر', done: !!q.d,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="a1" ok={!!a1}
                done={<span>في المستوى المتقدّم كان الهدف <Ltr>{a1?.target}</Ltr> دورة للعجلة، فاحتاجت الدوّاسة <Ltr>{a1?.pedal}</Ltr> دورات.</span>}
                todo="هدف كسري مثل 9/2 دورة للعجلة والدوّاسة تُدير العجلة 3/4 دورة في الدورة: جرّب المستوى المتقدّم، ثم عُد إلى هذا السؤال." />
              <NumericQuestion
                prompt={<MathText>{'احسب $\\frac{9}{2} \\div \\frac{3}{4}$ :'}</MathText>}
                expected={6} display="6" parse={parseDec} requires={['qisma-darb']}
                explain={<MathText>{'$\\frac{9}{2} \\times \\frac{4}{3} = \\frac{36}{6} = 6$ .'}</MathText>}
                onAnswered={answered('d')}
              />
              {q.d && <KnowledgeBrick id="qismat-kasrayn" lead="قسمة كسر على كسر: ماذا نفعل بالكسر الثاني؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
