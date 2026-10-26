import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps, TextbookBox } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { KNOWLEDGE, METHOD_VALUES } from '../content/textbook';

/**
 * Module 3 — طريقة « مثال مضاد أم نشر ؟ » (P3, P1). UNE SEULE PISTE (guide §4quater) : le MÊME labo que le module 1, posé SEUL en haut (`levels={false}`, monde
 * `twins`) — deux murs sous UN réservoir ; la main lâche des billes, compare les deux corbeilles et déclare « contre-exemple » ou « égales » (le juge refuse un accord
 * de valeurs, et « انشر » montre la forme réduite de chaque mur). Puis l'élève répond sur ce qu'il a fait (paires `tw1`, `tw2`, `tw3` de `logic/marbleRun.js › TWIN_TASKS`),
 * lit la méthode ligne à ligne (la brique est gardée par « أتوقّع القاعدة »), puis un transfert.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;

export default function Module03Tariqa() {
  const [trials, setTrials] = useState([]);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const solved = (task) => trials.find((e) => e.kind === 'solved' && e.task === task);

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['متى تكفي قيمة واحدة؟', 'ماذا يثبت تساوي القيم؟', 'كيف أثبت التساوي؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — مثال مضاد أم نشر؟"
      moduleSubtitle="مساران متوأمان"
      estimatedTime="14 دقيقة"
      intro={<Manipulation type="marble-run" levels={false} world="twins" onTrial={record} />}
      steps={[
        {
          num: 1, title: 'هل تكفي كرية واحدة؟', subtitle: 'الزوج الأول', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="tw1" ok={!!solved('tw1')}
                done="حكمتَ على الزوج الأول بمثال مضاد."
                todo="احكم على الزوج الأول (أسقِط كريات وقارن السلّتين)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الزوج الأول أعطت الكرية $0$ القيمة $6$ في المسارين. هل يكفي ذلك لنقول إنّ $(x+2)(x+3)=x^2+6$ ؟`}</MathText>}
                options={[
                  M('لا: عند $x=1$ تعطي الأولى $12$ والثانية $7$'),
                  M('نعم: قيمة واحدة متساوية تكفي'),
                  M('نعم لأنّ $0$ أصغر عدد'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'قيمة تختلف عندها العبارتان تكفي لإبطال المساواة: عند $x=1$ نجد $(1+2)(1+3)=12$ و $1+6=7$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: 'تساوتا مرّتين، فماذا نستنتج؟', subtitle: 'الزوج الثاني', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="tw2" ok={!!solved('tw2')}
                done="حكمتَ على الزوج الثاني بمثال مضاد."
                todo="احكم على الزوج الثاني، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الزوج الثاني ($2x^2+2$ و $x^2+x+2$) تساوت القيم عند $x=0$ وعند $x=1$ . ماذا تستنتج؟`}</MathText>}
                options={[
                  M('لا شيء بعد: عند $x=2$ نجد $10$ و $8$ فهما غير متساويتين'),
                  M('أنّهما متساويتان لأنّ القيمتين تساوتا مرّتين'),
                  M('أنّ العدد $2$ لا يصلح للتجربة'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'اتفاق القيمتين مرّتين لا يثبت التساوي: $2\\times2^2+2=10$ أمّا $2^2+2+2=8$.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="mithal-mudad" lead="قيم متساوية ثم قيمة تفرّق: ماذا تقول عن العبارتين؟" />}
              {q2 && <TextbookBox kind="property" compact text={KNOWLEDGE.counter.text} source={KNOWLEDGE.counter.source} />}
              {q2 && <TextbookBox kind="remark" compact text={KNOWLEDGE.noProof.text} source={KNOWLEDGE.noProof.source} />}
            </div>
          ),
        },
        {
          num: 3, title: 'لماذا لم نجد مثالًا مضادًا؟', subtitle: 'الزوج الثالث', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="tw3" ok={!!solved('tw3')}
                done="أثبتَّ تساوي الزوج الثالث بعد النشر."
                todo="احكم على الزوج الثالث (انشر ثم قرّر)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`في الزوج الثالث تساوت السلّتان عند كل الكريات. لماذا لم تجد مثالًا مضادًا؟`}</MathText>}
                options={[
                  M('لأنّ النشر يعطي العبارة نفسها $3x^2-3x-6$ : هما متساويتان'),
                  M('لأنّ الكريات قليلة فلم نجد'),
                  M('لأنّ العبارتين مختلفتان في الشكل'),
                ]}
                correct={0} cols={1} requires={['mithal-mudad']}
                explain={<MathText>{'$(x-2)(3x+3)=3x^2+3x-6x-6=3x^2-3x-6$ و $3(x^2-1)-3(x+1)=3x^2-3-3x-3=3x^2-3x-6$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'الطريقة سطرًا سطرًا', subtitle: 'ثم مثال جديد', done: q4,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD_VALUES} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="nashr-yuthbit" lead="القيم أبطلت المساواة الأولى والنشر أثبت الثانية: ما الخطوتان؟" />}
              <TapQuestion
                prompt={<MathText>{String.raw`عند $x=2$ تساوت قيمتا $(x+3)(x-1)$ و $x^2+2x-3$ (القيمة $5$ في كليهما). ماذا نفعل لنحكم؟`}</MathText>}
                options={[
                  M('ننشر الجداء: $x^2-x+3x-3=x^2+2x-3$ فالعبارتان متساويتان'),
                  M('نكتفي بالقيمة $2$ فهي كافية'),
                  M('نقول إنّهما مختلفتان لأنّ الشكلين مختلفان'),
                ]}
                correct={0} cols={1} requires={['nashr-yuthbit']}
                explain={<MathText>{'اتفاق القيمتين من أجل قيمة واحدة لا يكفي؛ بعد النشر تظهر صورة واحدة للعبارتين: $x^2+2x-3$.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
