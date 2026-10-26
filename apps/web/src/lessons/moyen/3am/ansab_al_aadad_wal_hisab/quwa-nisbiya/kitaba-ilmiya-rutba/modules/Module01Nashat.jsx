import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { GUIDE, RECALL_RUTBA } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le « سلّم الأحجام ». UNE SEULE PISTE (§4quater) : le labo `size-ladder` en haut, sans
 * carte au-dessus — il porte son contexte et SA question ; la main tient la POSITION d'une carte de longueur : son barreau, sa case, l'aimant.
 *   مبتدئ — c1 la منارة 265 م · c2 1 950 000 م · c3 0,0001 م (sur le bord gauche du barreau −4) · c4 comparer 0,0006 et 0,0001 ;
 *   متقدم — c5 1 200 km · c6 0,048 × 10⁻³ م · c7 12 742 km (a et n écrits avant) · c8 comparer 9,8 × 10⁻⁵ et 1,2 × 10⁻⁴.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SES cartes : pourquoi 2,65 × 10² et non 26,5 × 10¹ (P1), le barreau de la feuille (P2), l'aimant sur la منارة (P3), les deux cartes
 * de c8 (P3). Les noms (briques) viennent APRÈS la réponse. L'activité 5 du manuel (la calculatrice) n'est pas l'entrée. Le rappel de la 1AM (رتبة المقدار) est un encadré « تذكّر » lié.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children).replace(/-/g, '−')}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const answered = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const record = (e) => setTrials((list) => [...list, e]);
  const last = (pred) => trials.findLast((e) => !e.free && pred(e));
  const dock1 = last((e) => e.kind === 'dock' && e.task === 'c1');
  const dock3 = last((e) => e.kind === 'dock' && e.task === 'c3');
  const mag1 = last((e) => e.kind === 'magnet' && e.task === 'c1');
  const cmp8 = last((e) => e.kind === 'compare' && e.task === 'c8' && e.ok);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );

  return (
    <ContentModule
      objectives={['على أيّ درجة تُعلَّق البطاقة؟', 'لماذا $2{,}65 \\times 10^{2}$ وليس $26{,}5 \\times 10^{1}$ ؟', 'ماذا يفعل المغناطيس؟', 'أيّ البطاقتين أكبر؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — سلّم الأحجام"
      moduleSubtitle="نعلّق بطاقات أطوال على سلّم المعرض"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="size-ladder" level="beginner" onTrial={record} />,
            advanced: () => <Manipulation type="size-ladder" level="advanced" onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا $2{,}65 \\times 10^{2}$ وليس $26{,}5 \\times 10^{1}$ ؟', subtitle: 'الدرجة والخانة', done: q.a,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="rung" ok={!!dock1}
                done={<span>علّقتَ بطاقة المنارة على الدرجة <MathText>{'$10^{2}$'}</MathText> وفي خانتها فكُتبت عليها <MathText>{'$2{,}65 \\times 10^{2}$'}</MathText> متر.</span>}
                todo="في المستوى المبتدئ، البطاقة الأولى (المنارة): علّقها على درجتها وفي خانتها، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>على الدرجة <MathText>{'$10^{2}$'}</MathText> كُتبت البطاقة <MathText>{'$2{,}65 \\times 10^{2}$'}</MathText> . لماذا لا نكتبها <MathText>{'$26{,}5 \\times 10^{1}$'}</MathText> ؟</span>}
                options={[M('لأنّ $26{,}5 \\times 10^{1}$ لا يساوي $265$'), M('لأنّ $26{,}5$ ليس من 1 إلى أقل من 10 : على كل درجة يكون العدد الأوّل كذلك'), M('لأنّ الأسّ هو عدد أرقام العدد')]}
                correct={1} cols={1} requires={['kitaba-quwa']}
                explain={<MathText>{`${GUIDE.rung} ${GUIDE.digits.why}`}</MathText>}
                onAnswered={answered('a')}
              />
              {q.a && <KnowledgeBrick id="kitaba-ilmiya" lead="الدرجة تحدّد الأسّ، والخانة تحدّد العدد الأوّل. متى تكون الكتابة $a \\times 10^n$ هي الكتابة العلمية؟" />}
            </div>
          ),
        },
        {
          num: 2, title: 'بين أيّ قوتين تقع ورقة الكرّاس؟', subtitle: 'الدرجة هي الحصر', done: q.b,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="sheet" ok={!!dock3}
                done={<span>ورقة الكرّاس (<Ltr>0,0001</Ltr> م) وقفت على الدرجة التي تبدأ عند <MathText>{'$10^{-4}$'}</MathText> : كُتبت عليها <MathText>{'$1 \\times 10^{-4}$'}</MathText> متر.</span>}
                todo="في المستوى المبتدئ، البطاقة الثالثة (ورقة الكرّاس): علّقها ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>سُمك الورقة <MathText>{'$1 \\times 10^{-4}$'}</MathText> متر. بين أيّ قوتين متتاليتين للعدد 10 يقع هذا السُّمك؟</span>}
                options={[M('$10^{-5} \\le 0{,}0001 < 10^{-4}$'), M('$10^{-4} \\le 0{,}0001 < 10^{-3}$'), M('$10^{-3} \\le 0{,}0001 < 10^{-2}$')]}
                correct={1} cols={1} requires={['kitaba-ilmiya']}
                explain={<MathText>{'البطاقة على الدرجة التي تبدأ عند $10^{-4}$ بالضبط، وعلى طرفها الأيسر، فهي أكبر من $10^{-4}$ أو تساويه وأصغر من $10^{-3}$ : $10^{-4} \\le 0{,}0001 < 10^{-3}$ . (الدرجة التي قبلها تنتهي عند $10^{-4}$ ولا تحمل البطاقة، والتي بعدها تبدأ عند $10^{-3}$ .)'}</MathText>}
                onAnswered={answered('b')}
              />
              {q.b && <KnowledgeBrick id="hasr-quwatayn" lead="الدرجة تبدأ عند قوة للعدد 10 وتنتهي عند القوة الموالية. كيف نكتب حصر عدد بين هاتين القوتين؟" />}
            </div>
          ),
        },
        {
          num: 3, title: 'ماذا يفعل المغناطيس؟', subtitle: 'رتبة القدر', done: q.c,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="magnet" ok={!!mag1}
                done={<span>جذب المغناطيس بطاقة المنارة (<MathText>{'$2{,}65 \\times 10^{2}$'}</MathText>) إلى التدريجة <MathText>{'$3 \\times 10^{2}$'}</MathText> .</span>}
                todo="في المستوى المبتدئ، شغّل المغناطيس على بطاقة المنارة، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>رتبة قدر ارتفاع المنارة <MathText>{'$265\\ \\mathrm{m}$'}</MathText> هي:</span>}
                options={[M('$3 \\times 10^{2}\\ \\mathrm{m}$'), M('$2 \\times 10^{2}\\ \\mathrm{m}$'), M('$10^{3}\\ \\mathrm{m}$')]}
                correct={0} cols={3} requires={['hasr-quwatayn']}
                explain={<MathText>{`${GUIDE.trunc.why} ${GUIDE.trunc.right}`}</MathText>}
                onAnswered={answered('c')}
              />
              {q.c && (
                <TextbookBox kind="remark" compact title={RECALL_RUTBA.title} text={RECALL_RUTBA.text} source={RECALL_RUTBA.source} />
              )}
              {q.c && <KnowledgeBrick id="rutbat-qadr" lead="المغناطيس يجذب البطاقة إلى أقرب تدريجة كاملة. كيف نعيّن رتبة القدر من الكتابة العلمية؟" />}
            </div>
          ),
        },
        {
          num: 4, title: 'أيّ البطاقتين أكبر؟', subtitle: 'الأعلى درجة', done: q.d,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="compare" ok={!!cmp8}
                done={<span>علّقتَ <MathText>{'$9{,}8 \\times 10^{-5}$'}</MathText> و <MathText>{'$1{,}2 \\times 10^{-4}$'}</MathText> واخترتَ الأطول: الثانية، لأنّها على درجة أعلى.</span>}
                todo="في المستوى المتقدّم، المهمة الأخيرة (بطاقتان للمقارنة): علّقهما ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<span>أيّهما أكبر: <MathText>{'$9{,}8 \\times 10^{-5}$'}</MathText> أم <MathText>{'$1{,}2 \\times 10^{-4}$'}</MathText> ؟</span>}
                options={[M('$9{,}8 \\times 10^{-5}$ لأنّ $9{,}8 > 1{,}2$'), M('$1{,}2 \\times 10^{-4}$ لأنّ درجتها أعلى'), M('متساويان')]}
                correct={1} cols={1} requires={['rutbat-qadr']}
                explain={<MathText>{`${GUIDE.compare.why} ${GUIDE.compare.right}`}</MathText>}
                onAnswered={answered('d')}
              />
              {q.d && <KnowledgeBrick id="muqarana-ilmiya" lead="الدرجة العليا أكبر مهما كان العدد الأوّل. كيف نقارن عددين مكتوبين كتابة علمية؟" />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
