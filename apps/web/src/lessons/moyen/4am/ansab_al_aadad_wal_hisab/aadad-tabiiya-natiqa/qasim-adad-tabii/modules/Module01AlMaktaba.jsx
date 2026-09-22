import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { PitchScene } from '../../../../../../common/manipulations/primitives/PitchBackdrop';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, EXTRA_CANDIDATES, TEAM_EXPERIENCE } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 8) : 420 كتابًا، 26 أو 28 في كل رفّ ؟
 *
 * LABORATOIRE D'OUVERTURE À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels).
 * Un SEUL atelier, un sélecteur « مبتدئ / متقدم », et la page ne change pas :
 *
 *   مبتدئ  — LE TERRAIN. 15 joueurs, 3 équipes égales ; puis 16, et un joueur
 *            reste dehors. Petits nombres, geste évident, conséquence
 *            immédiate : on voit le reste debout sur le banc.
 *   متقدم  — LA BIBLIOTHÈQUE DU MANUEL. Les 420 livres, dix-sept tailles de
 *            rayon, aucune suggestion : l'élève choisit, compare ses essais et
 *            décide lui-même lesquels « tombent juste ».
 *
 * POURQUOI CET ORDRE. La mathématique est identique (a = b × q + r, reste nul
 * ⇔ قاسم) ; ce qui change est la charge. L'élève rencontre l'idée sur quinze
 * objets qu'il peut compter d'un regard, puis la retrouve sur les 420 livres
 * que le manuel lui demande de ranger. Le contexte « équipes » est un AJOUT
 * de la plateforme, tracé dans `lesson.config.js` (`experience`) et affiché
 * comme tel par `TEAM_EXPERIENCE` ; la situation du manuel n'est pas
 * remplacée, elle est le second niveau.
 *
 * Les ÉTAPES restent celles du manuel, dans l'ordre de ses questions : quelle
 * disposition convient, et que représente 28 pour 420. Elles se répondent
 * depuis le niveau متقدم, et le niveau مبتدئ prépare le mot « قاسم » sans le
 * dire. LP enseigné : P1.
 */
export default function Module01AlMaktaba() {
  const [tried, setTried] = useState({});
  const [teamsSeen, setTeamsSeen] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { total, candidates } = ACTIVITY.numbers;
  const bothTried = candidates.every((c) => tried[c] !== undefined);
  // Le contraste du niveau débutant : une répartition juste ET une avec reste.
  const contrastSeen = Object.values(teamsSeen).includes(true) && Object.values(teamsSeen).includes(false);

  return (
    <ContentModule
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — 420 كتابًا في رفوف"
      moduleSubtitle="نفس العدد من الكتب في كل رفّ"
      estimatedTime="10 دقائق"
      brief={{
        tag: 'أنشطة — الكتاب ص 8',
        // L'ACCROCHE annonce l'expérience ; le TITRE garde l'objectif du
        // manuel. Les deux cohabitent : l'élève voit ce qu'il va faire, puis
        // ce qu'il va apprendre.
        headline: 'هيا نلعب كرة القدم!',
        emoji: '⚽',
        title: ACTIVITY.title,
        tone: 'indigo',
        // Le VISUEL de contexte est dessiné, jamais une image générée (root
        // CLAUDE.md) : c'est le même terrain que la manipulation, donc la
        // carte et le laboratoire racontent la même scène.
        visual: <PitchScene />,
        body: (
          <div className="space-y-1">
            <p>{ACTIVITY.situation}</p>
            <ul className="list-none space-y-0.5">{ACTIVITY.options.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        ),
        footer: <SourceTag source={ACTIVITY.source} />,
      }}
      intro={
        <ManipulationWorkspace
          title="الأنشطة التفاعلية"
          lead="ابدأ بالمستوى المبتدئ، ثم انتقل إلى المتقدّم: نفس الفكرة، أعداد أكبر وحرية أكثر."
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation
                  type="team-builder"
                  level="beginner"
                  total={15}
                  groups={3}
                  title="جرّب: 15 لاعبًا في 3 فرق متساوية"
                  lead="اسحب كل لاعب إلى فريق. ثم جرّب 16 لاعبًا: ماذا يحدث؟"
                  onVerdict={({ total: n, groups: k, exact }) => setTeamsSeen((s) => ({ ...s, [`${n}:${k}`]: exact }))}
                />
                <SourceTag source={TEAM_EXPERIENCE.source} />
              </div>
            ),
            advanced: () => (
              <Manipulation
                type="divisor-explorer-books"
                total={total}
                candidates={EXTRA_CANDIDATES.values}
                // Les deux tailles que le manuel fait comparer (نشاط 1).
                pair={candidates}
                title="جرّب: كم كتابًا في كل رفّ؟"
                lead="اختر عددًا من الكتب في الرفّ، وانظر مباشرة: هل يبقى شيء؟ ابدأ بـ 26 ثم 28."
                onVerdict={({ b, divides }) => setTried((t) => ({ ...t, [b]: divides }))}
              />
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: ACTIVITY.questions[0], subtitle: 'جرّب 26 ثم 28 في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {!bothTried && <p className="text-sm text-slate-600">في المستوى المتقدّم من المناولة أعلاه، جرّب الحجمين 26 و 28 أولًا.</p>}
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
              {contrastSeen && (
                <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  نفس الفكرة رأيتها مع الفرق: عندما لا يبقى أحد خارج الفرق، يكون عدد الفرق قاسمًا لعدد اللاعبين.
                </p>
              )}
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
