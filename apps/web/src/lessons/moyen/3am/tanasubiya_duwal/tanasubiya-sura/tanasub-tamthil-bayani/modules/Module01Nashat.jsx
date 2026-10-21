import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : « سكك الدبابيس ». UNE SEULE PISTE (§4quater) : le labo `pin-rails` en haut, sans
 * carte au-dessus — il porte son contexte et SA question ; la main LÈVE des punaises sur leurs rainures et POSE une règle sur deux nœuds. Les ÉTAPES interrogent ce que l'élève
 * a FAIT, avec SES essais : l'écriture d'un point (P1), ce que touche la règle par O dans la boutique à prix unique (P2), pourquoi une règle qui touche les quatre punaises
 * mais laisse O dehors ne dit pas « تناسبية » (P3), pourquoi aucune règle ne touche tout quand le prix change (P3), ce que vaut l'ordonnée de l'abscisse 1 (P4). Les noms (briques)
 * viennent APRÈS la réponse. Le نشاط 1 du manuel est posé en application au module 4.
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
  const mine = trials.filter((e) => !e.free);
  const pin = mine.findLast((e) => e.kind === 'pin' && e.ok);
  const full = mine.findLast((e) => e.kind === 'rod' && e.full && e.shape === 'prop');
  const aligned = mine.findLast((e) => e.kind === 'rod' && e.pinsHit && !e.throughO);
  const bent = mine.findLast((e) => e.kind === 'rod' && e.shape === 'bent' && !e.full);
  const read = mine.findLast((e) => e.kind === 'read' && e.ok);

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['كيف أكتب نقطة عمود من الجدول؟', 'ماذا تمسّ المسطرة في وضعية تناسبية؟', 'ماذا يمنع وضعية من أن تكون تناسبية؟', 'ماذا يقول ترتيب الفاصلة 1؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — سكك الدبابيس"
      moduleSubtitle="أثمان تصير نقطًا في معلم"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="pin-rails" level="beginner" {...LAB.beginner} onTrial={record} />,
            advanced: () => <Manipulation type="pin-rails" level="advanced" {...LAB.advanced} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ما إحداثيا نقطة الدبّوس؟', subtitle: 'كتابة النقطة', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="pin" ok={!!pin}
                done={<span>في لوحتك رفعتَ دبّوس العمود <Ltr>{pin?.x}</Ltr> علب إلى <Ltr>{pin?.y}</Ltr> دج.</span>}
                todo="ارفع دبّوسًا إلى ثمن عموده في المحلّ الأول، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={`عمود الجدول الذي ${pin ? `ربط ${pin.x} علب بـ ${pin.y} دج` : 'رفعتَ دبّوسه'} صار نقطة في المعلم. كيف تُكتب إحداثيا هذه النقطة؟`}
                options={pin ? [M(`$(${pin.x}\\ ;\\ ${pin.y})$`), M(`$(${pin.y}\\ ;\\ ${pin.x})$`), M(`$(${pin.x}\\ ;\\ ${pin.x})$`)] : [M('$(6\\ ;\\ 30)$'), M('$(30\\ ;\\ 6)$'), M('$(6\\ ;\\ 6)$')]}
                correct={0} cols={3}
                explain={<MathText>{GUIDE.onePin}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="nuqta-jadwal" lead="عمود في جدول: كيف يصير نقطة في معلم، وكيف نكتب إحداثيها؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا تمسّ المسطرة في المحلّ الأول؟', subtitle: 'النقط التي تمسّها', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="full" ok={!!full}
                done={<span>في لوحتك لمست المسطرة <Ltr>{full?.count} / {full?.total}</Ltr> نقط، ومنها <Ltr>O</Ltr> .</span>}
                todo="ضع المسطرة على O وعلى دبّوس في المحلّ الأول، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="في المحلّ الأول مسّت مسطرة واحدة النقط كلّها. ماذا تلاحظ على هذه النقط؟"
                options={['كلّها على مستقيم واحد يمرّ بـ $O$', 'كلّها على الارتفاع نفسه', 'كلّها على المحور الأفقي'].map(M)}
                correct={0} cols={1} requires={['nuqta-jadwal']}
                explain={<MathText>{GUIDE.onO}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="khassiya-tanasub" lead="ثمن ثابت للعلبة: أين تقع نقط الأثمان في المعلم؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'هل تكفي الاستقامة؟', subtitle: 'مستقيم لا يمرّ بـ O', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="aligned" ok={!!aligned}
                done={<span>في لوحتك مسّت المسطرة الدبابيس الأربعة لكنّها تقطع المحور العمودي عند <Ltr>{aligned?.cuts}</Ltr> لا عند <Ltr>0</Ltr> .</span>}
                todo="في المحلّ الثاني ضع المسطرة على دبّوسين حتى تمسّ الدبابيس الأربعة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="في المحلّ الثاني مسّت المسطرة الدبابيس الأربعة، لكنّ $O$ بقيت خارجها. هل الوضعية تناسبية؟"
                options={['لا: المستقيم لا يمرّ بـ $O$', 'نعم: كلّ الدبابيس على المسطرة', 'نعم: الثمن يزيد مع عدد العلب'].map(M)}
                correct={0} cols={1} requires={['khassiya-tanasub']}
                explain={<MathText>{GUIDE.lineAny.right}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'لماذا لا توجد مسطرة تمسّ الكلّ؟', subtitle: 'نقط ليست على استقامة', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="bent" ok={!!bent}
                done={<span>في لوحتك لم تمسّ المسطرة إلا <Ltr>{bent?.count} / {bent?.total}</Ltr> نقط.</span>}
                todo="في المحلّ الثالث جرّب أوضاعًا مختلفة للمسطرة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="في المحلّ الثالث لم توجد مسطرة تمسّ النقط كلّها. لماذا؟"
                options={['ثمن العلبة يتغيّر بعد $8$ علب فلا تبقى النقط على استقامة', '$O$ بعيدة عن الدبابيس', 'المسطرة قصيرة'].map(M)}
                correct={0} cols={1} requires={['khassiya-tanasub']}
                explain="بعد العلبة الثامنة صار ثمن العلبة أقلّ، فانكسر الخطّ ولم تبق النقط على استقامة واحدة."
                onAnswered={() => setQ4(true)}
              />
              {q4 && <KnowledgeBrick id="ghayr-tanasubi" lead="نقط على مستقيم لا يمرّ بالمبدأ أو ليست على استقامة: هل هي وضعية تناسبية؟" />}
            </div>
          ),
        },
        {
          num: 5, title: 'ماذا يقول ترتيب الفاصلة 1؟', subtitle: 'معامل التناسبية', done: q5,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="read" ok={!!read}
                done={<span>وقع دبّوس القراءة عند <Ltr>({read?.x} ; {read?.y})</Ltr> وقسمة <Ltr>{read?.y}</Ltr> على <Ltr>{read?.x}</Ltr> تعطي <Ltr>{read?.a}</Ltr> .</span>}
                todo="جرّب المستوى المتقدّم: ضع دبّوس القراءة على المسطرة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="على مستقيم تناسبية يمرّ بـ $O$ : ماذا يمثّل ترتيب النقطة التي فاصلتها $1$ ؟"
                options={['ثمن (أو كتلة) وحدة واحدة، وهو معامل التناسبية', 'عدد النقط على المستقيم', 'فاصلة النقطة $O$'].map(M)}
                correct={0} cols={1} requires={['ghayr-tanasubi']}
                explain={<MathText>{GUIDE.onO}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && <KnowledgeBrick id="muamil-qiraa" lead="ترتيب النقطة التي فاصلتها 1 على مستقيم تناسبية: ماذا يساوي؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
