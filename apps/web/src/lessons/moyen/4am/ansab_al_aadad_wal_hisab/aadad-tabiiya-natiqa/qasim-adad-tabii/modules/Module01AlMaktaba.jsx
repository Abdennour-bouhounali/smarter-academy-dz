import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { PitchScene } from '../../../../../../common/manipulations/primitives/PitchBackdrop';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, SHELF_RANGE, TEAM_EXPERIENCE } from '../content/textbook';

/**
 * Module 1 — نشاط 1 (p. 8) : 420 كتابًا، 26 أو 28 في كل رفّ ؟
 *
 * LABORATOIRE D'OUVERTURE À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels).
 * Un SEUL atelier, un sélecteur « مبتدئ / متقدم », et la page ne change pas :
 *
 *   مبتدئ  — LE TERRAIN. 15 joueurs, 3 équipes égales ; puis 16, et un joueur
 *            reste dehors. Petits nombres, geste évident, conséquence
 *            immédiate : on voit le reste debout sur le banc.
 *   متقدم  — LA BIBLIOTHÈQUE DU MANUEL. Les 420 livres ; l'élève TIRE le
 *            serre-livres d'un rayon (10 à 60 livres), tous les rayons
 *            suivent, et ce qui ne remplit pas un rayon reste au sol. Les
 *            deux propositions du libraire (26, 28) sont marquées sur la
 *            réglette, comme dans l'énoncé — aucune autre longueur n'est
 *            suggérée.
 *
 * DEUX LECTURES DE LA MÊME DIVISION (audit 2026-09-29, X-1). Aux équipes,
 * l'élève fixe le NOMBRE de groupes (partition) ; aux rayons, la TAILLE d'un
 * groupe (quotition). Le passage n'est plus silencieux : chaque laboratoire
 * nomme les rôles de a = b × q + r (`DivisionRoles` : b est ce que tu
 * choisis, q ce qui en résulte, r < b), et l'étape 2 met les deux lectures
 * côte à côte avant la question.
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
  // Les essais VALIDÉS au rayon (onVerdict), avec ce qu'ils ont montré.
  const [tried, setTried] = useState({});
  const [teamsSeen, setTeamsSeen] = useState({});
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const { total, candidates } = ACTIVITY.numbers;
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
        tag: 'نشاط 1 — على أرضية الملعب',
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
        // La carte raconte LE TERRAIN (titre, dessin et texte disent la même
        // scène). L'énoncé des 420 livres vit au niveau متقدم, où il sert.
        body: (
          <div className="space-y-1">
            <p>{TEAM_EXPERIENCE.situation}</p>
            <ul className="list-none space-y-0.5">{TEAM_EXPERIENCE.options.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
        ),
        footer: <SourceTag source={TEAM_EXPERIENCE.source} />,
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
                  lead="بعد أن تكتمل الفرق، جرّب 16 لاعبًا: ماذا يحدث للاعب الأخير؟"
                  onVerdict={({ total: n, groups: k, exact }) => setTeamsSeen((s) => ({ ...s, [`${n}:${k}`]: exact }))}
                />
                <SourceTag source={TEAM_EXPERIENCE.source} />
              </div>
            ),
            advanced: () => (
              <div className="space-y-2">
                <TextbookBox kind="situation" lines={[ACTIVITY.situation, ...ACTIVITY.options]} source={ACTIVITY.source} compact />
                <Manipulation
                  type="divisor-explorer-books"
                  total={total}
                  min={SHELF_RANGE.min}
                  max={SHELF_RANGE.max}
                  // Les deux tailles que le manuel fait comparer (نشاط 1) : des
                  // repères sur la réglette, pas des boutons-réponses.
                  marks={candidates}
                  lead="صاحب المكتبة تردّد بين 26 و 28 كتابًا في كل رفّ. اسحب مسند الكتب وجرّب بنفسك: متى لا يبقى أي كتاب على الأرض؟"
                  onVerdict={({ b, divides, quotient, remainder }) => setTried((t) => ({ ...t, [b]: { divides, quotient, remainder } }))}
                />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: ACTIVITY.questions[0], subtitle: 'ضع الرفّ على 26 ثم على 28 في المستوى المتقدّم، ثم أجب', done: q1,
          content: (
            <div className="space-y-3">
              {/* LES PREUVES DE L'ÉLÈVE, pas celles de l'écran : ce qu'il a vu
                  sur le rayon, et rien de ce qu'il n'a pas essayé. Les options
                  de la question ne portent plus la vérification (« تبقى 4
                  كتب… ») — la réponse se lit dans ses propres essais. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {candidates.map((c) => (
                  <li key={c} className={tried[c] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={c} data-tried={tried[c] ? 'true' : 'false'}>
                    {tried[c]
                      ? <MathText>{`${c} كتابًا في كل رفّ: $420 = ${c} \\times ${tried[c].quotient} + ${tried[c].remainder}$`}</MathText>
                      : `${c} كتابًا في كل رفّ: لم تجرّبه بعد في المستوى المتقدّم.`}
                  </li>
                ))}
              </ul>
              <TapQuestion
                prompt={<span>أي الكيفيتين أنسب لترتيب <MathText>{'$420$'}</MathText> كتابًا؟</span>}
                options={['أ) 26 كتابًا في كل رفّ', 'ب) 28 كتابًا في كل رفّ', 'الكيفيتان متكافئتان', 'لا يمكن ترتيب 420 كتابًا بالتساوي']}
                correct={1}
                cols={1}
                requires={['qisma-iqlidiya']}
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
              <KnowledgeBrick id="qasim-baqi" lead="طبّق التعريف على ما رأيته على الرفوف: ماذا كان الباقي مع 28؟" />
              {/* DEUX LECTURES, UNE DIVISION — dit AVANT la question, sans en
                  donner la réponse (aucun 420 = 28 × … ici). */}
              <div className="space-y-1.5 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-950" data-division-bridge>
                <p className="font-extrabold">قسمة واحدة، وقراءتان:</p>
                <p>
                  <strong>في الفرق</strong> اخترتَ <strong>عدد المجموعات</strong> (3 فرق)، فظهر عدد اللاعبين في كل فريق:{' '}
                  <MathText>{'$15 = 3 \\times 5 + 0$'}</MathText>{contrastSeen ? '' : ' — جرّبه في المستوى المبتدئ.'}
                </p>
                <p>
                  <strong>في المكتبة</strong> تختار <strong>حجم المجموعة</strong> (عدد الكتب في كل رفّ)، فيظهر عدد الرفوف.
                </p>
                <p>
                  في الحالتين نكتب <MathText>{'$a = b \\times q + r$'}</MathText>: <MathText>{'$b$'}</MathText> هو العدد الذي تختاره أنت،
                  {' '}<MathText>{'$q$'}</MathText> ما ينتج، و <MathText>{'$r$'}</MathText> أصغر دائمًا من <MathText>{'$b$'}</MathText>.
                </p>
              </div>
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
