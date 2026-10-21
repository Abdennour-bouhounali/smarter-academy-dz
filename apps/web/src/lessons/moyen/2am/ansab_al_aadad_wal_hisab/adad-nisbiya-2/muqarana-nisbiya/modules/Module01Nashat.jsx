import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le « المسبار ». UNE SEULE PISTE
 * (§4quater) : le labo `zero-probe` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient la DISTANCE
 * à zéro d'un capteur au bout d'un câble.
 *   مبتدئ — A = −3 : plus bas (câble plus long), plus haut (plus court) ; A = 4 : plus bas ; A = 2 : aucune longueur ne rend B plus haut ;
 *   متقدم — des décimaux, un côté libre, la zone d'une dixième.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES essais : pourquoi plus de câble rend B plus bas sous le zéro (P1), ce que fait le
 * câble au-dessus du zéro (P2), pourquoi aucune longueur ne suffit quand A est au-dessus (P2). Les noms (briques) viennent APRÈS la réponse.
 * Le نشاط 2 du manuel (six thermomètres) est posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children).replace(/-/g, '−')}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const mine = trials.filter((e) => e.kind === 'release' && !e.free && e.tk === 'beat');
  // sous le zéro, plus bas que A = −3 (tâche 0) ; au-dessus, plus bas que A = 4 (tâche 2) ; la décision « impossible » (tâche 3)
  const lowerBelow = mine.findLast((e) => e.task === 0 && e.ok);
  const upperAbove = mine.findLast((e) => e.task === 2 && e.ok);
  const refused = trials.find((e) => e.kind === 'none' && e.ok && e.task === 3);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا يهبط المسبار حين يطول السلك تحت الصفر؟', 'ماذا يفعل طول السلك فوق الصفر؟', 'لماذا لا يعلو مسبار تحت الصفر مسبارًا فوقه؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — المسبار"
      moduleSubtitle="سلك يطول فوق الصفر وتحته"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="zero-probe" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="zero-probe" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا يهبط المسبار حين يطول السلك تحت الصفر؟', subtitle: 'عددان سالبان', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="below" ok={!!lowerBelow}
                done={<span>بسلك طوله <Ltr>{lowerBelow?.d}</Ltr> تحت الصفر صار المسبار B عند <Ltr>{lowerBelow?.value}</Ltr> ، وهو أخفض من A عند <Ltr>{lowerBelow?.a}</Ltr> .</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الأولى (أخفض من A تحت الصفر)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>سجّلتَ B عند <Ltr>{lowerBelow?.value ?? '-5'}</Ltr> وهو أخفض من A عند <Ltr>-3</Ltr> . ما الذي يميّز الأخفض بين هذين العددين السالبين؟</span>}
                options={[
                  M('هو الأبعد عن الصفر: مسافته إلى الصفر أكبر'),
                  M('هو الأقرب إلى الصفر: مسافته إلى الصفر أصغر'),
                  M('لا علاقة للمسافة إلى الصفر بالأمر'),
                ]}
                correct={0} cols={1} requires={['masafa-ila-sifr']}
                explain={<MathText>{GUIDE.farIsBig.right}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="salibayn" lead="عددان سالبان: أيّهما الأصغر؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا يفعل السلك فوق الصفر؟', subtitle: 'عددان موجبان', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="above" ok={!!upperAbove}
                done={<span>فوق الصفر، بسلك طوله <Ltr>{upperAbove?.d}</Ltr> صار B عند <Ltr>{upperAbove?.value}</Ltr> ، وهو أخفض من A عند <Ltr>{upperAbove?.a}</Ltr> .</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الثالثة (أخفض من A فوق الصفر)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>فوق الصفر، A عند <Ltr>4</Ltr> . لتكون B أخفض منه، ماذا فعلتَ بالسلك مقارنةً بما فعلتَ تحت الصفر؟</span>}
                options={[
                  M('قصّرتُه: العدد الموجب الأصغر هو الأقرب إلى الصفر'),
                  M('أطلتُه كما فعلتُ تحت الصفر'),
                  M('لم يغيّر طول السلك شيئًا'),
                ]}
                correct={0} cols={1} requires={['salibayn']}
                explain={<MathText>{'فوق الصفر كلما طال السلك ارتفع المسبار: $2{,}5 < 4$ ، الأصغر هو الأقرب إلى الصفر.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="mujabayn" lead="عددان موجبان: أيّهما الأصغر؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'لماذا لا يعلو المسبار؟', subtitle: 'إشارتان مختلفتان', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="none" ok={!!refused}
                done={<span>قرّرتَ أنّ B تحت الصفر لا يمكن أن يكون أعلى من A عند <Ltr>2</Ltr> مهما كان طول السلك.</span>}
                todo="أنجز في المستوى المبتدئ المهمّة الرابعة (A عند 2)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>A عند <Ltr>2</Ltr> فوق الصفر وB تحت الصفر. ماذا نقول عن أيّ عدد سالب مقارنةً بأيّ عدد موجب؟</span>}
                options={[
                  M('العدد السالب أصغر منه مهما كانت المسافة إلى الصفر'),
                  M('العدد السالب يكون أكبر منه إذا طال السلك'),
                  M('نقارن المسافتين إلى الصفر دون النظر إلى الإشارتين'),
                ]}
                correct={0} cols={1} requires={['mujabayn']}
                explain={<MathText>{GUIDE.different}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="mukhtalifayn" lead="سالب وموجب، وماذا عن الصفر؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
