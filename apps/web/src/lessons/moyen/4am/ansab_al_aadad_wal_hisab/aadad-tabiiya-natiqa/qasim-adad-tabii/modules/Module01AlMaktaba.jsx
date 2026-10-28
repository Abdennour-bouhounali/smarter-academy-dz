import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { ACTIVITY, SHELF_RANGE, TEAM_EXPERIENCE } from '../content/textbook';

/**
 * Module 1 — l'ENTRÉE : les équipes, puis le rayon du manuel (rétrofit 2026-10-15 : le labo en tête SANS carte, SANS titre ni
 * lead d'atelier ; la brique APRÈS la réponse ; les étapes interrogent ce que l'élève a FAIT).
 *
 * LABORATOIRE D'OUVERTURE À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels). Un SEUL atelier, un sélecteur « مبتدئ / متقدم » :
 *
 *   مبتدئ  — LE TERRAIN. 15 joueurs, 3 équipes égales ; puis 16, et un joueur reste dehors. L'élève FIXE le nombre de groupes
 *            (partition) : le reste se voit debout sur le banc, avant le mot « قاسم ».
 *   متقدم  — LA BIBLIOTHÈQUE DU MANUEL (نشاط 1). Les 420 livres ; l'élève TIRE le serre-livres (10 à 60 livres), les deux
 *            propositions du libraire (26, 28) sont marquées sur la réglette. Ici il fixe la TAILLE d'un groupe (quotition).
 *
 * ORDRE DES IDÉES (étapes) : 1. pourquoi le 16e joueur n'a pas d'équipe (le reste, sur SES essais) → les deux lectures d'une même
 * division ; 2. pourquoi 28 vide le sol et pas 26 (les essais du rayon) → brique « قاسم بالباقي » APRÈS la réponse ; 3. ce que
 * représente 28 pour 420 (le nom), puis la remarque du manuel sur 26. LP enseigné : P1.
 */
export default function Module01AlMaktaba() {
  // Les essais VALIDÉS au rayon (onVerdict), avec ce qu'ils ont montré.
  const [tried, setTried] = useState({});
  const [teamsSeen, setTeamsSeen] = useState({});
  // les questions posées PAR-DESSUS les labos (LabCheckpoint) : une étape est faite quand la suite de questions du labo l'est
  const [teamEv, setTeamEv] = useState([]);
  const [shelfEv, setShelfEv] = useState([]);
  const [q3, setQ3] = useState(false);
  const q1 = teamEv.some((e) => e.tk === 'checkpoint-done' && e.id === 'contrast');
  const q2 = shelfEv.some((e) => e.tk === 'checkpoint-done' && e.id === 'contrast');
  const { total, candidates } = ACTIVITY.numbers;
  // Le contraste du niveau débutant : une répartition juste ET une avec reste.
  const contrastSeen = Object.values(teamsSeen).includes(true) && Object.values(teamsSeen).includes(false);
  const teamKeys = Object.keys(teamsSeen);

  return (
    <ContentModule objectives={["كيف نضع 420 كتابًا في رفوف بعدد متساوٍ؟", "ماذا يحدث إذا تقاسمنا 16 لاعبًا في فرق متماثلة؟", "متى نقول إن عددًا يقسم عددًا آخر؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — 420 كتابًا في رفوف"
      moduleSubtitle="نفس العدد من الكتب في كل رفّ"
      estimatedTime="10 دقائق"
      intro={
        <ManipulationWorkspace
          levels={{
            beginner: () => (
              <div className="space-y-2">
                <Manipulation
                  type="team-builder"
                  level="beginner"
                  total={15}
                  groups={3}
                  lead="جمع مدرّب الحيّ 15 لاعبًا ويريدهم في 3 فرق متساوية. وزّعهم، ثم جرّب 16 لاعبًا: أين يلعب اللاعب الأخير؟"
                  onVerdict={({ total: n, groups: k, exact }) => setTeamsSeen((s) => ({ ...s, [`${n}:${k}`]: exact }))}
                  onTrial={(e) => setTeamEv((l) => [...l, e])}
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
                  onTrial={(e) => setShelfEv((l) => [...l, e])}
                />
              </div>
            ),
          }}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا بقي لاعب بلا فريق عند 16 لاعبًا؟', subtitle: 'من تجربتك في المستوى المبتدئ', done: q1,
          content: (
            <div className="space-y-3">
              {/* LES ESSAIS DE L'ÉLÈVE aux équipes (jamais ceux qu'il n'a pas faits). `data-team-tried`, pas `data-tried` :
                  l'e2e compte les essais du RAYON. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {teamKeys.length === 0 && <li className="text-slate-500" data-evidence="teams" data-team-tried="false">لم تجرّب الفرق بعد في المستوى المبتدئ.</li>}
                {teamKeys.map((key) => {
                  const [n, k] = key.split(':').map(Number);
                  return (
                    <li key={key} className="font-bold text-slate-800" data-evidence={`teams:${key}`} data-team-tried="true">
                      <MathText>{`${n} لاعبًا في ${k} فرق: $${n} = ${k} \\times ${Math.floor(n / k)} + ${n % k}$`}</MathText>
                    </li>
                  );
                })}
              </ul>
              {!q1 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="teams-todo">جرّب 15 لاعبًا ثم 16 في المختبر، وأجب عن الأسئلة التي تظهر فوقه.</p>}
              {/* DEUX LECTURES, UNE DIVISION — dit APRÈS la réponse, sans rien donner de 420. */}
              {q1 && (
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
              )}
            </div>
          ),
        },
        {
          num: 2, title: 'لماذا لا يبقى كتاب على الأرض مع 28 ويبقى مع 26؟', subtitle: 'ضع الرفّ على 26 ثم على 28 في المستوى المتقدّم، ثم أجب', done: q2,
          content: (
            <div className="space-y-3">
              {/* LES PREUVES DE L'ÉLÈVE, pas celles de l'écran : ce qu'il a vu sur le rayon, et rien de ce qu'il n'a pas essayé. */}
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {candidates.map((c) => (
                  <li key={c} className={tried[c] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={c} data-tried={tried[c] ? 'true' : 'false'}>
                    {tried[c]
                      ? <MathText>{`${c} كتابًا في كل رفّ: $420 = ${c} \\times ${tried[c].quotient} + ${tried[c].remainder}$`}</MathText>
                      : `${c} كتابًا في كل رفّ: لم تجرّبه بعد في المستوى المتقدّم.`}
                  </li>
                ))}
              </ul>
              {!q2 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="shelf-todo">جرّب ثلاثة أطوال للرفّ في المستوى المتقدّم (طول يفرغ الأرض وطول يترك كتبًا)، وأجب عن الأسئلة التي تظهر فوق المختبر.</p>}
              {q2 && <KnowledgeBrick id="qasim-baqi" lead="طبّق التعريف على ما رأيته على الرفوف: ماذا كان الباقي مع 28؟" />}
            </div>
          ),
        },
        {
          num: 3, title: ACTIVITY.questions[1], done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>ماذا يمثّل العدد <MathText>{'$28$'}</MathText> بالنسبة إلى العدد <MathText>{'$420$'}</MathText>؟</span>}
                options={['28 قاسم للعدد 420', '28 مضاعف للعدد 420', '28 باقي قسمة 420', '28 لا علاقة له بـ 420']}
                correct={0}
                cols={2}
                requires={['qasim-baqi']}
                explain={<span>باقي القسمة الإقليدية لـ 420 على 28 هو 0، إذن 28 قاسم للعدد 420 (و 420 مضاعف للعدد 28 — العكس، لا 28 مضاعف لـ 420).</span>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <TextbookBox kind="remark" text="أما 26 فليس قاسمًا للعدد 420: الباقي 4 ليس معدومًا." compact />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
