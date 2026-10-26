import React, { useState } from 'react';
import { ContentModule, TapQuestion, NumericQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { TextbookBox } from '../../../../../../common/textbook';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { LAB, KNOWLEDGE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE de la leçon, choisie par la plateforme (LESSON_DEVELOPMENT_GUIDE §4ter) : le مسار الروبوت. UNE SEULE PISTE (§4quater) :
 * le labo `robot-track` en haut, sans carte au-dessus — il porte son contexte et SA question ; la main tient les SIGNES et l'ORDRE des cartes.
 * Les ÉTAPES interrogent ce que l'élève a FAIT, avec SON سجلّ : ce que fait la carte (−1) (P1), le nombre de cartes négatives de ses arrêts (P2),
 * « أتوقّع القاعدة » (la brique), un programme sans labo. Le nom (brique + encadré) vient APRÈS la réponse. Le manuel n'a aucune activité pour
 * plusieurs facteurs : l'entrée est celle de la plateforme.
 */
const M = (s) => <MathText key={s}>{s}</MathText>;
const Ltr = ({ children }) => <bdi dir="ltr">{String(children).replace(/-/g, '−')}</bdi>;

export default function Module01Nashat() {
  const [trials, setTrials] = useState([]);
  const [q, setQ] = useState({});
  const answered = (k) => () => setQ((s) => ({ ...s, [k]: true }));
  const record = (e) => setTrials((list) => [...list, e]);
  const solvedOf = (id) => trials.findLast((e) => e.kind === 'run' && !e.free && e.taskId === id && e.ok);
  const m1 = solvedOf('m1');
  const m3 = solvedOf('m3');
  const m4 = solvedOf('m4');
  const rows = ['m3', 'm4'].map(solvedOf).filter(Boolean);

  /** Ce que l'élève a fait au labo, rappelé au-dessus de la question qui s'en sert. */
  const Evidence = ({ id, ok, done, todo }) => (
    <p data-evidence={id} data-tried={ok ? 'true' : 'false'}
      className={`rounded-xl border-2 px-3 py-2 text-sm ${ok ? 'border-emerald-200 bg-emerald-50 font-bold text-emerald-900' : 'border-slate-200 bg-white text-slate-500'}`}>
      {ok ? done : todo}
    </p>
  );
  const pairs = (a, b) => {
    const right = `${a} و ${b}`;
    const wrongs = [`${b} و ${a}`, `${a + 1} و ${b}`, `${a} و ${b + 1}`, `${a + 2} و ${b + 2}`].filter((w) => w !== right);
    return [right, ...[...new Set(wrongs)].slice(0, 3)];
  };

  return (
    <ContentModule
      objectives={['أكتشف كيف تحدّد البطاقات السالبة جهة توقّف الروبوت مهما كان ترتيبها.', 'ماذا تفعل بطاقة (−1)؟', 'متى يتوقّف الروبوت في الجهة السالبة؟']}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط — مسار الروبوت"
      moduleSubtitle="برنامج من بطاقات، وإشارات تقلبها بيدك"
      estimatedTime="14 دقيقة"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => <Manipulation type="robot-track" level="beginner" world={LAB.beginner.world} tasks={LAB.beginner.tasks} onTrial={record} />,
            advanced: () => <Manipulation type="robot-track" level="advanced" world={LAB.advanced.world} tasks={LAB.advanced.tasks} onTrial={record} />,
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'ماذا تفعل بطاقة (−1)؟', subtitle: 'من 5 إلى −5', done: !!q.a,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="m1" ok={!!m1}
                done={<span>في سجلّك: بعد البطاقة <Ltr>−1</Ltr> انتقل الروبوت من <Ltr>5</Ltr> إلى <Ltr>{m1?.stop}</Ltr> .</span>}
                todo="أنجز المهمتين الأولى والثانية في المختبر أعلاه، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt={<MathText>{'بطاقة $-1$ نقلت الروبوت من $5$ إلى $-5$ ، ثم أعادته إلى $5$ . ماذا يكون $-5$ بالنسبة إلى $5$ ؟'}</MathText>}
                options={['معاكسه (نظيره)', 'مقلوبه', 'ضعفه', 'العدد الذي يسبقه']}
                correct={0} cols={2} requires={['jidaa-adadayn']}
                explain={<MathText>{'الروبوت قفز من $5$ إلى الموضع المتناظر معه بالنسبة إلى الصفر، وهو $-5$ : معاكس $5$ ومجموعهما $0$ . والضرب في $-1$ يعيده من $-5$ إلى $5$ . (المقلوب جداؤه معه $1$ ، لا $-25$ .)'}</MathText>}
                onAnswered={answered('a')}
              />
              {q.a && <KnowledgeBrick id="maakus" lead="بطاقة (−1) تقلب الروبوت إلى الجهة الأخرى: ما هذا العدد بالنسبة إلى العدد الأصلي؟" />}
              {q.a && <TextbookBox kind="property" compact lines={KNOWLEDGE.opposite.lines} source={KNOWLEDGE.opposite.source} />}
              {q.a && <TextbookBox kind="example" compact text={KNOWLEDGE.opposite.examples} source={KNOWLEDGE.opposite.source} />}
            </div>
          ),
        },
        {
          num: 2, title: 'كم بطاقة سالبة في سجلّك؟', subtitle: 'بلوغ −24 وبلوغ 24', done: !!q.b,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="rows" ok={rows.length === 2}
                done={<span>سجلّك: برنامج انتهى عند <Ltr>{m3?.stop}</Ltr> وفيه <Ltr>{m3?.negatives}</Ltr> من البطاقات السالبة، وبرنامج انتهى عند <Ltr>{m4?.stop}</Ltr> وفيه <Ltr>{m4?.negatives}</Ltr> .</span>}
                todo="أنجز المهمتين الثالثة والرابعة في المختبر أعلاه، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="في برنامجَيْ سجلّك الأخيرين، كم بطاقة سالبة في الأوّل (الذي انتهى عند −24) وفي الثاني (الذي انتهى عند 24)؟"
                options={pairs(m3?.negatives ?? 1, m4?.negatives ?? 2)}
                correct={0} cols={1} requires={['maakus']}
                explain={<MathText>{`برنامج ${'$-24$'} فيه ${m3?.negatives ?? 1} من البطاقات السالبة، وبرنامج ${'$24$'} فيه ${m4?.negatives ?? 2} : اقرأ العددين من سجلّك.`}</MathText>}
                onAnswered={answered('b')}
              />
            </div>
          ),
        },
        {
          num: 3, title: 'متى يتوقّف الروبوت في الجهة السالبة؟', subtitle: 'ما تشترك فيه برامجك', done: !!q.c,
          content: (
            <div className="space-y-3" data-activity-evidence>
              <Evidence id="rule" ok={rows.length === 2}
                done={<span>سطرا سجلّك: <Ltr>{m3?.negatives}</Ltr> بطاقة سالبة وتوقّف الروبوت في الجهة السالبة، و <Ltr>{m4?.negatives}</Ltr> بطاقة سالبة وتوقّف في الجهة الموجبة.</span>}
                todo="أنجز المهام الأربع الأولى في المختبر أعلاه، ثم عُد إلى هذا السؤال." />
              <TapQuestion
                prompt="ماذا تشترك فيه كل البرامج التي أوقفت الروبوت في الجهة السالبة؟"
                options={[
                  'عدد البطاقات السالبة فيها فردي',
                  'فيها بطاقة سالبة واحدة على الأقل',
                  'البطاقات السالبة فيها أكثر من الموجبة',
                  'آخر بطاقة فيها سالبة',
                ]}
                correct={0} cols={1} requires={['maakus']}
                explain={<MathText>{'برنامجا الجهة السالبة في سجلّك فيهما بطاقة أو ثلاث بطاقات سالبة، أي عدد فردي؛ أمّا برنامج الجهة الموجبة ففيه بطاقتان سالبتان وبطاقة موجبة واحدة: بطاقة سالبة على الأقل لا تكفي، ولا الأغلبية تحسم، ولا موضع البطاقة.'}</MathText>}
                onAnswered={answered('c')}
              />
              {q.c && <KnowledgeBrick id="adad-salib" lead="عدد البطاقات السالبة وجهة توقّف الروبوت: ما القاعدة؟ وهل يهمّ الترتيب؟" />}
              {q.c && <TextbookBox kind="property" compact lines={KNOWLEDGE.parity.lines} source={KNOWLEDGE.parity.source} />}
              {q.c && <TextbookBox kind="example" compact text={KNOWLEDGE.parity.examples} source={KNOWLEDGE.parity.source} />}
            </div>
          ),
        },
        {
          num: 4, title: 'تسع بطاقات (−1)', subtitle: 'بلا مختبر', done: !!q.d,
          content: (
            <div className="space-y-3">
              <NumericQuestion
                prompt={<MathText>{'برنامج فيه 9 بطاقات كلّها $-1$ . أين يتوقّف الروبوت إذا انطلق من $1$ ؟ (اكتب العدد)'}</MathText>}
                expected={-1} display="−1" requires={['adad-salib']}
                explain={<MathText>{'تسع بطاقات سالبة (عدد فردي): الروبوت في الجهة السالبة، ومسافته $1 \\times 1 \\times \\ldots \\times 1 = 1$ ، إذن يتوقّف عند $-1$ .'}</MathText>}
                onAnswered={answered('d')}
              />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
