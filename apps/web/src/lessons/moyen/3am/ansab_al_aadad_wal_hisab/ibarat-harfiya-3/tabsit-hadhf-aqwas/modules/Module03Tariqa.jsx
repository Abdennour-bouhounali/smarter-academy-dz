import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { MethodSteps } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { METHOD_BRACKETS } from '../content/textbook';

/**
 * Module 3 — طريقة « أحذف الأقواس » (P2, P3). UNE SEULE PISTE (guide §4quater) : le MÊME labo que le module 1, posé SEUL en haut
 * (`levels={false}`, monde `brackets`) — des caisses « +( ) » puis « −( ) » : la main sort chaque pile « telle quelle » ou « signe
 * changé », la valeur de l'expression refuse la mauvaise sortie. Puis l'élève répond sur ce qu'il a fait, lit la méthode ligne à ligne,
 * puis la brique (gardée par « أتوقّع القاعدة »), puis un transfert. Les tâches du labo sont celles de `logic/likeTerms.js › BRACKET_TASKS`
 * (7 + (2x − 3), 9 − (4x − 5), 3x + (x − 2) − (5 − 2x)) ; la méthode revue est l'expression 4x² − 5 + (7x − 2x²) − (3 − 4x).
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{children}</bdi>;

export default function Module03Tariqa() {
  const [trials, setTrials] = useState([]);
  const [read, setRead] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const record = (e) => setTrials((list) => [...list, e]);
  const plusExit = trials.find((e) => e.kind === 'exit' && e.crateSign > 0);
  const minusRefusal = trials.find((e) => e.kind === 'refused' && e.reason === 'sign' && e.crateSign < 0);

  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['لماذا تبقى الإشارات بعد +؟', 'لماذا تتغيّر الإشارات بعد −؟', 'ما خطوات الطريقة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(3)}
      moduleNumber={3}
      moduleTitle="طريقة — أحذف الأقواس"
      moduleSubtitle="صناديق + وصناديق −"
      estimatedTime="14 دقيقة"
      intro={<Manipulation type="like-terms" levels={false} world="brackets" onTrial={record} />}
      steps={[
        {
          num: 1, title: 'لماذا خرجت الحزم كما هي؟', subtitle: 'الصندوق المسبوق بـ +', done: q1,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="plus" ok={!!plusExit}
                done={<span>أخرجتَ حزمة من صندوق مسبوق بـ <Ltr>+</Ltr> كما هي وقبلتها الطاولة.</span>}
                todo="أخرج حزمة من الصندوق المسبوق بالإشارة + إلى المخرج « كما هي »، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`قبلت الطاولة خروج الحزم كما هي من الصندوق المسبوق بالإشارة $+$ . لماذا لا تتغيّر قيمة العبارة؟`}</MathText>}
                options={[
                  M('لأنّ $+$ قبل القوسين تضيف كل ما بينهما كما هو'),
                  M('لأنّ الحزم داخل الصندوق لا قيمة لها'),
                  M('لأنّ الإشارة $+$ تقلب إشارة كل حزمة'),
                ]}
                correct={0} cols={1}
                explain={<MathText>{'جمع مقدار بين قوسين هو جمع كل حدوده كما هي: $7+(2x-3)=7+2x-3$.'}</MathText>}
                onAnswered={() => setQ1(true)}
              />
              {q1 && <KnowledgeBrick id="aqwas-jam" lead="الصندوق المسبوق بـ +: ماذا فعلتَ بإشارة كل حزمة؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا رفضت الطاولة الخروج كما هي؟', subtitle: 'الصندوق المسبوق بـ −', done: q2,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="minus" ok={!!minusRefusal}
                done={<span>حاولتَ إخراج حزمة كما هي من صندوق مسبوق بـ <Ltr>−</Ltr> فرفضت الطاولة: قيمة العبارة <Ltr>{minusRefusal?.before}</Ltr> وكانت ستصير <Ltr>{minusRefusal?.after}</Ltr> عند <Ltr>x = {minusRefusal?.x}</Ltr>.</span>}
                todo="جرّب إخراج حزمة « كما هي » من الصندوق المسبوق بالإشارة − فتُرفض، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{String.raw`رفضت الطاولة خروج الحزمة كما هي من صندوق مسبوق بـ $-$ وقبلتها بعكس إشارتها. لماذا؟`}</MathText>}
                options={[
                  M('لأنّ $-$ قبل القوسين تطرح كل ما بينهما، فكل حدّ يخرج بعكس إشارته ليبقى المقدار نفسه'),
                  M('لأنّ حزمة واحدة فقط تتغيّر إشارتها'),
                  M('لأنّ الطاولة ترفض كل حزمة موجبة'),
                ]}
                correct={0} cols={1} requires={['aqwas-jam']}
                explain={<MathText>{'طرح $(4x-5)$ هو طرح $4x$ وإضافة $5$ : $9-(4x-5)=9-4x+5$. لو أخرجنا $4x$ كما هي لتغيّرت قيمة العبارة.'}</MathText>}
                onAnswered={() => setQ2(true)}
              />
              {q2 && <KnowledgeBrick id="aqwas-tarh" lead="الصندوق المسبوق بـ −: ماذا فعلتَ بإشارة كل حزمة؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'الطريقة سطرًا سطرًا', subtitle: 'ثم مثال جديد', done: q3,
          content: (
            <div className="space-y-3">
              <MethodSteps method={METHOD_BRACKETS} onAllRevealed={() => setRead(true)} />
              {read && <KnowledgeBrick id="tariqat-hadhf" lead="الأقواس ثم الحدود المتشابهة: ما الترتيب الذي اتّبعتَه؟" />}
              <TapQuestion
                prompt={<MathText>{String.raw`بسّط العبارة $B=3x-(x-4)+(2x-1)$.`}</MathText>}
                options={[M('$4x+3$'), M('$4x-5$'), M('$4x+5$')]}
                correct={0} cols={3} requires={['tariqat-hadhf']}
                explain={<MathText>{'نحذف الأقواس: $3x-x+4+2x-1$ ثم نجمع: $(3-1+2)x+(4-1)=4x+3$. وإن نسينا تغيير إشارة $-4$ نجد $4x-5$.'}</MathText>}
                onAnswered={() => setQ3(true)}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={3} />}
    />
  );
}
