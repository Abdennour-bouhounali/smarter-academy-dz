import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, EXTRA_CANDIDATES } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 8) : 420 كتابًا، 26 أو 28 في كل رفّ ؟
 *
 * LABORATOIRE D'OUVERTURE (INTERACTION_PEDAGOGY §6bis) : la manipulation
 * `divisor-explorer-books` (les 420 livres illustrés, rangés rayon par rayon)
 * est dans le slot `intro`, visible et utilisable dès l'entrée, sans question
 * ni bouton entre l'élève et l'instrument. Elle rend son verdict par
 * `onVerdict({ b, divides, quotient, remainder })` à chaque taille choisie. Les
 * étapes portent l'OBSERVATION guidée de ce qu'il vient de faire, dans
 * l'ordre des questions du manuel : quelle disposition convient ? que
 * représente 28 pour 420 ?
 *
 * Le mot « قاسم » n'est nommé qu'à la brique de l'étape 2, quand l'élève en a
 * besoin pour dire ce qu'il a vu. LP enseigné : P1.
 */
export default function Module01AlMaktaba() {
  const [tried, setTried] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { total, candidates } = ACTIVITY.numbers;
  const bothTried = candidates.every((c) => tried[c] !== undefined);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — 420 كتابًا في رفوف"
      moduleSubtitle="نفس العدد من الكتب في كل رفّ"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'أنشطة — الكتاب ص 8', title: ACTIVITY.title, tone: 'indigo',
        body: (
          <div className="space-y-1">
            <p>{ACTIVITY.situation}</p>
            <ul className="list-none space-y-0.5">{ACTIVITY.options.map((o) => <li key={o}>{o}</li>)}</ul>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      }}
      intro={
        <Manipulation
          type="divisor-explorer-books"
          total={total}
          candidates={EXTRA_CANDIDATES.values}
          title="جرّب: كم كتابًا في كل رفّ؟"
          lead="اختر عددًا من الكتب في الرفّ، وانظر مباشرة: هل يبقى شيء؟ ابدأ بـ 26 ثم 28."
          onVerdict={({ b, divides }) => setTried((t) => ({ ...t, [b]: divides }))}
        />
      }
      steps={[
        {
          num: 1, title: ACTIVITY.questions[0], subtitle: 'جرّب 26 ثم 28 في المناولة، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {!bothTried && <p className="text-sm text-slate-600">جرّب الحجمين 26 و 28 في المناولة أعلاه أولًا.</p>}
              <TapQuestion
                prompt={<span>أي الكيفيتين أنسب لترتيب <MathText>{'$420$'}</MathText> كتابًا؟</span>}
                options={['26 كتابًا في كل رفّ: تبقى 4 كتب خارج الرفوف', '28 كتابًا في كل رفّ: 15 رفًّا ولا يبقى شيء', 'الكيفيتان متكافئتان', 'لا يمكن ترتيب 420 كتابًا بالتساوي']}
                correct={1}
                cols={1}
                explain={<span><MathText>{'$420 = 26 \\times 16 + 4$'}</MathText> يبقى 4 كتب؛ أما <MathText>{'$420 = 28 \\times 15 + 0$'}</MathText> فلا يبقى شيء.</span>}
                onAnswered={() => setQ1(true)}
              />
            </div>
          ),
        },
        {
          num: 2, title: ACTIVITY.questions[1], done: q2,
          content: (
            <div className="space-y-3">
              <KnowledgeBrick id="qasim-baqi" lead="الباقي معدوم: هذا بالضبط ما يجعل 28 قاسمًا للعدد 420." />
              <TapQuestion
                prompt={<span>ماذا يمثّل العدد <MathText>{'$28$'}</MathText> بالنسبة إلى العدد <MathText>{'$420$'}</MathText>؟</span>}
                options={['28 قاسم للعدد 420', '28 مضاعف للعدد 420', '28 باقي قسمة 420', '28 لا علاقة له بـ 420']}
                correct={0}
                cols={2}
                requires={['qasim-baqi']}
                explain={<span>باقي القسمة الإقليدية لـ 420 على 28 هو 0، إذن 28 قاسم للعدد 420 (و 420 مضاعف للعدد 28 — العكس، لا 28 مضاعف لـ 420).</span>}
                onAnswered={() => setQ2(true)}
              />
              <TextbookBox kind="remark" text="أما 26 فليس قاسمًا للعدد 420: الباقي 4 ليس معدومًا." compact />
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} />}
    />
  );
}
