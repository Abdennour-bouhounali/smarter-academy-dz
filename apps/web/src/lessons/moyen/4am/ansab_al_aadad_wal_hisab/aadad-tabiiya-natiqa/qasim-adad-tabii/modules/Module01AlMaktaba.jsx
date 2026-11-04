import React, { useState } from 'react';
import { ContentModule, TapQuestion, KnowledgeBrick } from '../../../../../../common/kit';
import { KnowledgeSnapshot } from '../../../../../../common/knowledge';
import MathText from '../../../../../../common/components/MathText';
import { Manipulation, ManipulationWorkspace } from '../../../../../../common/manipulations';
import { TextbookBox, SourceTag } from '../../../../../../common/textbook';
import { MoreToggle } from '../../../../../../common/components/StudentFocus';
import { MODULE_CTX, getNavLinks } from '../moduleContext';
import { TEAM_EXPERIENCE } from '../content/textbook';
import { TEAMS_ACTIVITY, M1_ROUNDS, TEAM_ROLES, eqTex } from '../content/teams';
import IdeasOrganizer from '../../../../../../common/mission/IdeasOrganizer';
import LabRounds from '../../../../../../common/manipulations/rounds/LabRounds';
import PlayerSwitch from '../../../../../../common/mission/PlayerSwitch';

/**
 * Module 1 — l'ENTRÉE : les équipes, petits puis grands nombres (rétrofit 2026-10-15 : le labo en tête SANS carte, SANS titre ni
 * lead d'atelier ; la brique APRÈS la réponse ; les étapes interrogent ce que l'élève a FAIT).
 *
 * LABORATOIRE D'OUVERTURE À DEUX NIVEAUX (MANIPULATION_CONTRACT §7bis-levels). Un SEUL atelier, un sélecteur « مبتدئ / متقدم » :
 *
 *   مبتدئ  — LE TERRAIN. 15 joueurs, 3 équipes égales ; puis 16, et un joueur reste dehors. L'élève FIXE le nombre de groupes
 *            (partition) : le reste se voit debout sur le banc, avant le mot « قاسم ».
 *   متقدم  — LE MÊME TERRAIN, 42 joueurs : l'entraîneur hésite entre 5 et 6 équipes (content/teams.js). C'est le contraste du
 *            نشاط 1 du manuel (420 livres, 26 ou 28 par rayon) — le labo de la bibliothèque a été RETIRÉ de la leçon le 2026-11-04
 *            (propriétaire : « le labo du football pour toute la leçon »).
 *
 * ORDRE DES IDÉES (étapes) : 1. pourquoi le 16e joueur n'a pas d'équipe (le reste, sur SES essais) → les deux lectures d'une même
 * division ; 2. pourquoi 6 équipes vident le banc et pas 5 (ses essais à 42) → brique « قاسم بالباقي » APRÈS la réponse ; 3. ce
 * que représente 6 pour 42 (le nom), puis la remarque sur 5. LP enseigné : P1.
 */
export default function Module01AlMaktaba() {
  // Les essais VALIDÉS au niveau متقدم (42 joueurs, onVerdict), par nombre d'équipes.
  const [tried, setTried] = useState({});
  const [teamsSeen, setTeamsSeen] = useState({});
  // les questions posées PAR-DESSUS les labos (LabCheckpoint) : une étape est faite quand la suite de questions du labo l'est
  const [teamEv, setTeamEv] = useState([]);
  const [advEv, setAdvEv] = useState([]);
  const [q3, setQ3] = useState(false);
  // Dans le lecteur de mission, le labo se joue en MANCHES (LabRounds) : la manche 2 (16 joueurs) ouvre l'étape 1, la manche 3
  // (42 joueurs) l'étape 2. Hors lecteur (enseignant), les deux niveaux et leurs questions comme avant.
  const [won, setWon] = useState({});
  // « رتّب أفكارك » (lecteur) : l'étape est faite quand la manche est gagnée ET l'idée formulée à partir du tableau
  const [org, setOrg] = useState({});
  const q1 = (Boolean(won.r2) && Boolean(org.s1)) || teamEv.some((e) => e.tk === 'checkpoint-done' && e.id === 'contrast');
  const q2 = (Boolean(won.r3) && Boolean(org.s2)) || advEv.some((e) => e.tk === 'checkpoint-done' && e.id === 'contrast');
  const { total, candidates, choices } = TEAMS_ACTIVITY;
  const [notDivisor, divisor] = candidates;
  // Le contraste du niveau débutant : une répartition juste ET une avec reste.
  const contrastSeen = Object.values(teamsSeen).includes(true) && Object.values(teamsSeen).includes(false);
  const teamKeys = Object.keys(teamsSeen);

  return (
    <ContentModule objectives={["ماذا يحدث إذا تقاسمنا 16 لاعبًا في فرق متماثلة؟", "كيف نوزّع 42 لاعبًا في فرق متساوية؟", "متى نقول إن عددًا يقسم عددًا آخر؟"]}
      ctx={MODULE_CTX}
      navLinks={getNavLinks(1)}
      moduleNumber={1}
      moduleTitle="نشاط 1 — فرق متساوية"
      moduleSubtitle="نفس العدد من اللاعبين في كل فريق"
      estimatedTime="10 دقائق"
      intro={
        <PlayerSwitch
          player={(
            <LabRounds
              lessonId={MODULE_CTX.lessonId}
              labId="m1-teams"
              rounds={M1_ROUNDS}
              onRoundWon={(id) => setWon((w) => ({ ...w, [id]: true }))}
              onVerdict={({ total: n, groups: k, perGroup, leftOver, exact }) => {
                if (n === total) setTried((t) => ({ ...t, [k]: { exact, quotient: perGroup, remainder: leftOver } }));
                else setTeamsSeen((s) => ({ ...s, [`${n}:${k}`]: exact }));
              }}
            />
          )}
          page={(
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
                {/* LE MÊME TERRAIN, de plus grands nombres (propriétaire, 2026-11-04 : le labo du football pour toute la leçon) :
                    le contraste du نشاط 1 du manuel (26 ou 28 livres par rayon) devient 5 ou 6 équipes pour 42 joueurs. */}
                <Manipulation
                  type="team-builder"
                  level="advanced"
                  total={total}
                  groups={notDivisor}
                  teamChoices={choices}
                  squadChoices={[total]}
                  lead={`جمع مدرّب النادي ${total} لاعبًا، وتردّد بين ${notDivisor} فرق و ${divisor} فرق متساوية. جرّب بنفسك: متى لا يبقى أيّ لاعب خارج الفرق؟`}
                  onVerdict={({ total: n, groups: k, perGroup, leftOver, exact }) => { if (n === total) setTried((t) => ({ ...t, [k]: { exact, quotient: perGroup, remainder: leftOver } })); }}
                  onTrial={(e) => setAdvEv((l) => [...l, e])}
                />
                <SourceTag source={TEAM_EXPERIENCE.source} />
              </div>
            ),
          }}
        />
          )}
        />
      }
      steps={[
        {
          num: 1, title: 'لماذا بقي لاعب بلا فريق عند 16 لاعبًا؟', subtitle: 'من تجربتك في الملعب', done: q1,
          content: (
            <div className="space-y-3">
              {/* LES ESSAIS DE L'ÉLÈVE aux équipes (jamais ceux qu'il n'a pas faits). `data-team-tried`, pas `data-tried` :
                  l'e2e compte les essais du RAYON. */}
              {/* Regard « focus » : tant que rien n'est essayé, la liste vide se replie sous « تجاربي » (MoreToggle : en ligne hors focus). */}
              <PlayerSwitch
                player={won.r2 ? (<IdeasOrganizer title="رتّب أفكارك: ماذا رأيت في الملعب؟" labels={TEAM_ROLES} rows={teamKeys.map((key) => { const [n, k] = key.split(':').map(Number); return { n, g: k, q: Math.floor(n / k), r: n % k }; })} question={{ prompt: 'متى يدخل كل اللاعبين الفرق، دون أن يبقى أحد خارجها؟', options: ['عندما يكون الباقي 0', 'عندما يكون عدد اللاعبين زوجيًا', 'عندما يكون عدد الفرق أكبر من 3'], correct: 0, explain: 'الباقي هو عدد من بقي خارج الفرق: عندما يكون 0 يدخل الجميع.' }} onAnswered={() => setOrg((o) => ({ ...o, s1: true }))} />) : (<p className="rounded-xl border-2 border-indigo-100 bg-indigo-50 px-4 py-3 text-lg font-bold text-indigo-900">العب الجولة 1 ثم الجولة 2 في المختبر.</p>)}
                page={(
                  <>
              <MoreToggle force={teamKeys.length === 0 ? undefined : false} label="تجاربي">
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
              </MoreToggle>
              {!q1 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="teams-todo">جرّب 15 لاعبًا ثم 16 في المختبر، وأجب عن الأسئلة التي تظهر فوقه.</p>}
                  </>
                )}
              />
              {/* DEUX LECTURES, UNE DIVISION — dit APRÈS la réponse, sans rien donner de 42. */}
              {q1 && (
                <div className="space-y-1.5 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-950" data-division-bridge>
                  <p className="font-extrabold">قسمة واحدة، وقراءتان:</p>
                  <p>
                    اخترتَ <strong>عدد الفرق</strong> (3 فرق)، فظهر عدد اللاعبين في كل فريق:{' '}
                    <MathText>{'$15 = 3 \\times 5 + 0$'}</MathText>{contrastSeen ? '' : ' — جرّبه في المستوى المبتدئ.'}
                  </p>
                  <p>
                    ولو اخترتَ <strong>عدد اللاعبين في كل فريق</strong> (5 لاعبين)، لظهر عدد الفرق: 3 فرق.
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
          num: 2, title: `لماذا لا يبقى لاعب خارج الفرق مع ${divisor} فرق ويبقى مع ${notDivisor}؟`, subtitle: `من تجربتك: ${total} لاعبًا في ${notDivisor} فرق ثم في ${divisor}`, done: q2,
          content: (
            <div className="space-y-3">
              {/* LES PREUVES DE L'ÉLÈVE, pas celles de l'écran : ce qu'il a vu sur le terrain, et rien de ce qu'il n'a pas essayé. */}
              <PlayerSwitch
                player={won.r3 ? (<IdeasOrganizer title="رتّب أفكارك: ماذا رأيت في الملعب؟" labels={TEAM_ROLES} rows={Object.keys(tried).map(Number).sort((x, y) => x - y).map((k) => ({ n: total, g: k, q: tried[k].quotient, r: tried[k].remainder }))} question={{ prompt: `لماذا يصلح ${divisor} فرق لـ ${total} لاعبًا ولا يصلح ${notDivisor}؟`, options: [`لأنّ باقي قسمة ${total} على ${divisor} هو 0`, `لأنّ ${divisor} أكبر من ${notDivisor}`, `لأنّ ${divisor} عدد زوجي`], correct: 0, explain: `مع ${divisor} فرق: ${total} = ${divisor} × ${total / divisor} + 0، فلا يبقى أحد. ومع ${notDivisor} فرق يبقى ${total % notDivisor} خارج الفرق.` }} onAnswered={() => setOrg((o) => ({ ...o, s2: true }))} />) : (<p className="rounded-xl border-2 border-indigo-100 bg-indigo-50 px-4 py-3 text-lg font-bold text-indigo-900">العب الجولة 3 في المختبر.</p>)}
                page={(
                  <>
              <MoreToggle force={candidates.some((c) => tried[c]) ? false : undefined} label="تجاربي">
              <ul className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm" data-activity-evidence>
                {candidates.map((c) => (
                  <li key={c} className={tried[c] ? 'font-bold text-slate-800' : 'text-slate-500'} data-evidence={c} data-tried={tried[c] ? 'true' : 'false'}>
                    {tried[c]
                      ? <MathText>{`${total} لاعبًا في ${c} فرق: $${total} = ${c} \\times ${tried[c].quotient} + ${tried[c].remainder}$`}</MathText>
                      : `${total} لاعبًا في ${c} فرق: لم تجرّبه بعد في المستوى المتقدّم.`}
                  </li>
                ))}
              </ul>
              </MoreToggle>
              {!q2 && <p className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-500" data-evidence="adv-todo">جرّب عدّة أعداد من الفرق في المستوى المتقدّم (عدد يُدخل كل اللاعبين وعدد يترك لاعبين خارج الفرق)، وأجب عن الأسئلة التي تظهر فوق المختبر.</p>}
                  </>
                )}
              />
              {q2 && <KnowledgeBrick id="qasim-baqi" lead={`طبّق التعريف على ما رأيته في الملعب: ماذا كان الباقي مع ${divisor} فرق؟`} />}
            </div>
          ),
        },
        {
          num: 3, title: `${divisor} و ${total}`, done: q3,
          content: (
            <div className="space-y-3">
              <TapQuestion
                prompt={<span>ماذا يمثّل العدد <MathText>{`$${divisor}$`}</MathText> بالنسبة إلى العدد <MathText>{`$${total}$`}</MathText>؟</span>}
                options={[`${divisor} قاسم للعدد ${total}`, `${divisor} مضاعف للعدد ${total}`, `${divisor} باقي قسمة ${total}`, `${divisor} لا علاقة له بـ ${total}`]}
                correct={0}
                cols={2}
                requires={['qasim-baqi']}
                explain={<span>باقي القسمة الإقليدية لـ {total} على {divisor} هو 0 (<MathText>{`$${eqTex(total, divisor)}$`}</MathText>)، إذن {divisor} قاسم للعدد {total} (و {total} مضاعف للعدد {divisor} — العكس، لا {divisor} مضاعف لـ {total}).</span>}
                onAnswered={() => setQ3(true)}
              />
              {q3 && <TextbookBox kind="remark" text={`أما ${notDivisor} فليس قاسمًا للعدد ${total}: $${eqTex(total, notDivisor)}$، والباقي ${total % notDivisor} ليس معدومًا.`} compact />}
            </div>
          ),
        },
      ]}
      footer={<KnowledgeSnapshot moduleNumber={1} variant="memo" />}
    />
  );
}
