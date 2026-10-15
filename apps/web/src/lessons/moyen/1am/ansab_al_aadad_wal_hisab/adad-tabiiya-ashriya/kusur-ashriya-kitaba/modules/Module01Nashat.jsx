import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : l'atelier de zellige. UNE SEULE PISTE
 * (§4quater) : le labo `decimal-comma` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient la VIRGULE.
 *   مبتدئ — les chiffres 2 3 5, puis 3 7, puis 0 5 : la table du client dit où la virgule doit tomber ;
 *   متقدم — le bon est un كسر عشري (3125/1000, 605/100), puis le zéro final de 2,50 = 2,5.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES chiffres : pourquoi les mêmes chiffres font d'autres quantités (P1/P2), combien
 * de carreaux dans 3 colonnes puis dans 2,35 (P1/P2), à quoi sert le 0 de 0,05 (P2), combien de chiffres après la virgule pour 3125/1000
 * (P2). Les noms (briques) viennent APRÈS la réponse. Les activités du manuel (نشاط 2 et 3) sont posées en application au module 5.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  // La demande libre (« جرّب أعدادك ») n'est jamais une preuve.
  const record = (e) => { if (!e.free) setTrials((list) => [...list, e]); };
  const solved = (digits) => trials.some((e) => e.digits === digits && e.ok);
  const shownFor = (digits) => [...new Set(trials.filter((e) => e.digits === digits).map((e) => e.shown))];
  const tried235 = shownFor('235');

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا تغيّر الطلبية والأرقام نفسها؟', 'كم بلاطة في كسر عشري؟', 'ما علاقة عدد الأرقام بعد الفاصلة بمقام الكسر؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — ورشة الزليج"
      moduleSubtitle="الأرقام نفسها وفاصلة تتحرّك"
      estimatedTime="13 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="decimal-comma" level="beginner" world="mosaic" tasks={LAB.mosaic.beginner} onTrial={record} />,
            advanced: () => <Manipulation type="decimal-comma" level="advanced" world="mosaic" tasks={LAB.mosaic.advanced} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا تغيّرت الطلبية؟', subtitle: 'الأرقام 2 و 3 و 5 في لوحتك', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="places" ok={tried235.length >= 2}
                done={<span>وضعتَ الفاصلة في أمكنة مختلفة من الأرقام 2 3 5، فظهرت: {tried235.map((s, i) => <span key={s}>{i > 0 && ' ، '}<Ltr>{s}</Ltr></span>)}.</span>}
                todo="حرّك الفاصلة في الطلبية الأولى (المستوى المبتدئ) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="الأرقام 2 و 3 و 5 هي نفسها دائمًا، لكنّ الحرفيّ كان يصنع في كل مرّة كمية مختلفة. لماذا؟"
                options={[M('لأنّ موضع الفاصلة يحدّد حجم القطعة التي يعدّها كل رقم'), M('لأنّ الفاصلة تغيّر الأرقام نفسها'), M('لأنّ الحرفيّ يضيف قطعًا من عنده')]}
                correct={0} cols={1} requires={['maratib-ibtidai']}
                explain={<MathText>{'الأرقام لم تتغيّر: الذي تغيّر هو القطعة التي يعدّها كل رقم. كل خطوة للفاصلة نحو اليمين تجعلها أصغر بعشر مرّات: $235$ ثم $23{,}5$ ثم $2{,}35$ ثم $0{,}235$ .'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="fasila-hajm" lead="عند كل خطوة للفاصلة نحو اليمين: ماذا حدث للقطعة التي يعدّها الرقم؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'كم بلاطة في ثلاثة أعمدة؟', subtitle: 'الأعمدة والبلاطات', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="first-order" ok={solved('235')}
                done={<span>صنع الحرفيّ طلبية الزبون الأولى: لوحتان وثلاثة أعمدة وخمس بلاطات، وكتبتَ <Ltr>2,35</Ltr>.</span>}
                todo="اجعل الحرفيّ يصنع الطلبية الأولى (الأرقام 2 3 5)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="العمود الواحد من اللوحة يساوي عشر بلاطات. إذا فككنا الأعمدة الثلاثة إلى بلاطات، فكم بلاطة صغيرة نحصل عليها؟"
                options={[M('30 بلاطة'), M('3 بلاطات'), M('300 بلاطة')]}
                correct={0} cols={3} requires={['fasila-hajm']}
                explain={<MathText>{'3 أعمدة × 10 بلاطات = 30 بلاطة، أي $\\frac{3}{10}=\\frac{30}{100}$ من اللوحة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="kasr-ashri" lead="العمود جزء من عشرة أجزاء متقايسة من اللوحة، والبلاطة جزء من مائة: كيف نكتب كلًّا منهما؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'كم بلاطة في الطلبية كلها؟', subtitle: 'اللوحتان أيضًا تتفكّكان', done: q3,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="first-order-again" ok={solved('235')}
                done={<span>الطلبية الأولى: لوحتان وثلاثة أعمدة وخمس بلاطات.</span>}
                todo="اجعل الحرفيّ يصنع الطلبية الأولى (الأرقام 2 3 5)، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="لوحة الزليج مئة بلاطة. إذا فككنا اللوحتين والأعمدة الثلاثة إلى بلاطات صغيرة، فكم جزءًا من مائة في الطلبية 2,35 كلها؟"
                options={[M('235 جزءًا من مائة'), M('35 جزءًا من مائة'), M('2350 جزءًا من مائة')]}
                correct={0} cols={1} requires={['kasr-ashri']}
                explain={<MathText>{'$2\\times100+3\\times10+5=235$ ، إذن $2{,}35=\\frac{235}{100}$ .'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
        {
          num: 4, title: 'ما عمل الصفر في 0,05؟', subtitle: 'الطلبية الثالثة', done: q4,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="third-order" ok={solved('05')}
                done={<span>صنع الحرفيّ الطلبية الثالثة: خمس بلاطات فقط ولا عمود، وكتبتَ <Ltr>0,05</Ltr>.</span>}
                todo="أنجز الطلبية الثالثة (الأرقام 0 5) ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>لو حذف الكاتب الصفر من الوصل وترك الرقم 5 وحده بعد الفاصلة (<Ltr>0,5</Ltr>)، ماذا يصنع الحرفيّ؟</span>}
                options={[M('خمسة أعمدة بدل خمس بلاطات'), M('خمس بلاطات كما كان'), M('لا يصنع شيئًا')]}
                correct={0} cols={1} requires={['fasila-hajm']}
                explain={<MathText>{'الصفر في $0{,}05$ يحفظ مكان الأعمدة الفارغ: بدونه يصير الرقم 5 رقم الأعشار، و $0{,}5$ خمسة أعمدة، أي خمسون بلاطة.'}</MathText>}
                onAnswered={() => setQ4(true)}
              />
            </div>
          ),
        },
        {
          num: 5, title: 'كم رقمًا بعد الفاصلة؟', subtitle: 'الطلب 3125/1000', done: q5,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="fraction-order" ok={solved('3125')}
                done={<span>طابقتَ كسرًا عشريًا مقامه <Ltr>1000</Ltr> بالوصل ذي الأرقام 3 1 2 5، وكتبتَ <Ltr>3,125</Ltr>.</span>}
                todo="جرّب المستوى المتقدّم: طابق الوصل الطلب 3125/1000، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>في الطلب الأول المقام <Ltr>1000</Ltr> (ثلاثة أصفار). كم رقمًا وضعتَ بعد الفاصلة حتى طابق الوصل الطلب؟</span>}
                options={[M('ثلاثة أرقام'), M('رقمين'), M('أربعة أرقام')]}
                correct={0} cols={3} requires={['kasr-ashri']}
                explain={<MathText>{'ثلاثة أرقام بعد الفاصلة (125) وثلاثة أصفار في المقام: $3{,}125=\\frac{3125}{1000}$ .'}</MathText>}
                onAnswered={() => setQ5(true)}
              />
              {q5 && <KnowledgeBrick id="kitaba-bifasila" lead="3,125 و 3125/1000 و 605/100: قارن عدد الأرقام بعد الفاصلة بعدد أصفار المقام." />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
