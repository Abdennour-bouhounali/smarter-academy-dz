import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, GUIDE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le قطار القوى. UNE SEULE PISTE
 * (§4quater) : le labo `power-train` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient l'EXPOSANT.
 *   مبتدئ — base −2 : 16, −32, puis 1 (aucun wagon) ;
 *   متقدم — base −3 : −27, 81, 1/9, −1/27 (des wagons « ÷ » sous zéro).
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES trains : pourquoi la charge change de signe à chaque wagon (P1), ce que porte
 * le train sans wagon (P2), ce que font deux wagons « ÷ » (P2). Les noms (briques) viennent APRÈS la réponse. Le نشاط 6 du manuel est
 * posé en application au module 4.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children).replace(/-/g, '−')}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const guided = trials.filter((e) => e.kind === 'release' && !e.free && e.world === 'build');
  const negBase = guided.filter((e) => e.base.startsWith('-') && e.n > 0);
  const even = negBase.findLast((e) => e.n % 2 === 0);
  const odd = negBase.findLast((e) => e.n % 2 === 1 && e.n > 1) ?? negBase.findLast((e) => e.n % 2 === 1);
  const empty = guided.find((e) => e.n === 0);
  const divided = guided.find((e) => e.n < 0);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا تتغيّر إشارة الحمولة مع كل عربة؟', 'ماذا يحمل القطار بلا عربة؟', 'ماذا تفعل عربات القسمة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — قطار القوى"
      moduleSubtitle="عربات تضرب وعربات تقسم"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="power-train" level="beginner" world={LAB.beginner.world} base={LAB.beginner.base} targets={LAB.beginner.targets} onTrial={record} />,
            advanced: () => <Manipulation type="power-train" level="advanced" world={LAB.advanced.world} base={LAB.advanced.base} targets={LAB.advanced.targets} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا تتغيّر إشارة الحمولة مع كل عربة؟', subtitle: 'عربات تضرب في عدد سالب', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="sign" ok={!!(even && odd)}
                done={<span>بـ <Ltr>{even?.n}</Ltr> عربات حمل قطارك <Ltr>{even?.load}</Ltr> ، وبـ <Ltr>{odd?.n}</Ltr> عربات حمل <Ltr>{odd?.load}</Ltr> .</span>}
                todo="اربط في المستوى المبتدئ عددًا زوجيًا من العربات ثم عددًا فرديًا (مثل المهمّتين الأوليين)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>كل عربة في قطارك تضرب الحمولة في <Ltr>-2</Ltr> . لماذا تنقلب إشارة الحمولة مع كل عربة جديدة؟</span>}
                options={[
                  M('لأنّ الضرب في عدد سالب يقلب الإشارة: كل عربتين متتاليتين تعطيان جداءً موجبًا'),
                  M('لأنّ كل عربة تطرح 2 من الحمولة'),
                  M('لأنّ الحمولة تتضاعف فقط، والإشارة تتغيّر صدفة'),
                ]}
                correct={0} cols={1} requires={['jidaa-nisbi']}
                explain={<MathText>{GUIDE.parity}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="quwa-taarif" lead="أربع عربات تضرب في −2: كيف نكتب هذا الجداء باختصار؟" />}
              {q1 && <KnowledgeBrick id="ishara-quwa" lead="متى تكون القوة سالبة؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'ماذا يحمل القطار بلا أيّ عربة؟', subtitle: 'القاطرة وحدها', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="empty" ok={!!empty}
                done={<span>بلا عربة حمل قطارك <Ltr>{empty?.load}</Ltr> ، والأساس <Ltr>{empty?.base}</Ltr> .</span>}
                todo="انزع كل العربات (المهمة الثالثة في المستوى المبتدئ)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>انطلق القطار حاملًا <Ltr>1</Ltr> ولم تُربط به أيّ عربة. لماذا يحمل <Ltr>1</Ltr> مهما كان الأساس؟</span>}
                options={[
                  M('لأنّه لم يُضرب في أيّ عامل: يبقى ما انطلق به'),
                  M('لأنّه بلا عربة يحمل الأساس نفسه'),
                  M('لأنّه بلا عربة يحمل 0'),
                ]}
                correct={0} cols={1} requires={['quwa-taarif']}
                explain={<MathText>{GUIDE.zero}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="quwa-sifr" lead="لا عامل واحد: ماذا يساوي $a^0$ ؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا تفعل عربات القسمة؟', subtitle: 'أس سالب', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="divide" ok={!!divided}
                done={<span>بـ <Ltr>{divided ? -divided.n : ''}</Ltr> عربة قسمة على <Ltr>{divided?.base}</Ltr> حمل قطارك <Ltr>{divided?.load}</Ltr> .</span>}
                todo="جرّب المستوى المتقدّم: اربط عربات قسمة على يسار القاطرة حتى يحمل القطار 1/9 ، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>بعربتي قسمة على <Ltr>-3</Ltr> يحمل القطار <MathText>{'$\\frac{1}{9}$'}</MathText> ، وبعربتي ضرب يحمل <Ltr>9</Ltr> . ما العلاقة بين الحمولتين؟</span>}
                options={[
                  M('$\\frac{1}{9}$ مقلوب $9 = (-3)^2$ : $(-3)^{-2} = \\frac{1}{(-3)^2}$'),
                  M('$\\frac{1}{9}$ معاكس $9$ : $(-3)^{-2} = -9$'),
                  M('$\\frac{1}{9}$ يساوي $(-3) \\div 2$'),
                ]}
                correct={0} cols={1} requires={['quwa-sifr']}
                explain={<MathText>{GUIDE.negExp.right}</MathText>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <KnowledgeBrick id="quwa-salib" lead="عربتا قسمة أو عربتا ضرب: ما العلاقة بين $a^{-n}$ و $a^n$ ؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
