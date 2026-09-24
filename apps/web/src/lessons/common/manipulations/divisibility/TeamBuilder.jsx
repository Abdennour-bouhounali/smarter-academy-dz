import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import DraggableObject from '../primitives/DraggableObject';
import DragGhost from '../primitives/DragGhost';
import NumberTile from '../primitives/NumberTile';
import EquationDisplay from '../primitives/EquationDisplay';
import PlayerFigure, { FootballIcon } from '../primitives/PlayerFigure';
import PitchBackdrop from '../primitives/PitchBackdrop';
import * as L from '../logic/teamBuilder';
import { formationPositions, playerScale } from './teamFormation';

/**
 * team-builder — LE PARTAGE ÉQUITABLE, DEBOUT SUR LE TERRAIN.
 *
 * A. Ce que l'élève MANIPULE : des joueurs, un par un, qu'il porte du banc
 *    vers une équipe.
 * B. Idée : partager n en k parts égales, c'est n = k × q + r.
 * C. Ce qui change : l'équipe s'agrandit, le compteur monte, le banc se
 *    vide. Quand les équipes sont pleines, le joueur en trop ne peut entrer
 *    NULLE PART — il reste sur le banc, visible, tête basse.
 * D. Représentation qui ÉMERGE : n = k × q + r, écrite après le geste, avec
 *    le reste en ambre quand il y en a un.
 * E. À découvrir AVANT la règle : « ça tombe juste » n'est pas une chance —
 *    les effectifs qui marchent sont exactement les قواسم de n.
 *
 * FIDÉLITÉ. La mathématique est celle de l'activité 1 du manuel (p. 8) :
 * répartition en parts égales, reste nul ⇔ قاسم. Le CONTEXTE est de la
 * plateforme — des équipes plutôt que des rayons de bibliothèque — parce
 * qu'un élève de 4AM se projette dans une équipe et pas dans une réserve de
 * librairie. La structure est intacte : même opération, même égalité, même
 * découverte. La traçabilité est déclarée dans `lesson.config.js`
 * (`experience: { type: 'platform_context', reason: … }`).
 *
 * « أنشئ الفرق » (MANIPULATION_CONTRACT §6bis). Le premier partage se fait
 * à la main : c'est lui qui montre ce que « à parts égales » veut dire. Pour
 * les suivants (20 en 4, 18 en 5…), porter vingt joueurs ne serait plus que
 * de la répétition : le bouton les répartit, joueur par joueur, avec la même
 * règle `canPlace` que le geste — les joueurs déjà placés restent où l'élève
 * les a mis, et le seizième reste sur le banc comme à la main.
 *
 * POURQUOI LE REFUS EST LA LEÇON. `canPlace` n'accepte un joueur que si les
 * équipes restent ÉGALES. L'élève qui essaie d'entasser six joueurs dans une
 * équipe reçoit une raison en arabe — et comprend, par le geste, que
 * « partager » veut dire « à parts égales ». C'est la même exigence qui rend
 * le seizième joueur physiquement impossible à placer.
 */
export default function TeamBuilder({
  total: total0 = 15,
  groups: groups0 = 3,
  teamChoices,
  squadChoices,
  title, lead, mission,
  level,
  initialMode = 'student',
  allowModeSwitch = false,
  onVerdict, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({
    type: 'team-builder',
    initialNumbers: { total: total0, groups: groups0 },
    initialMode,
    hintCount: 3,
    initialLevel: level,
  });
  // Le niveau VIVANT : celui du workspace, ou celui que l'élève a choisi
  // dans le sélecteur de la manipulation posée seule.
  const isAdvanced = state.level === 'advanced';
  const { total, groups } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ total: total0, groups: groups0 }));
  const [reject, setReject] = useState(null);
  // La MÉMOIRE des configurations essayées vit HORS de `lab`, parce que `lab`
  // repart à zéro à chaque changement de nombres. Or c'est précisément en
  // changeant les nombres (15 → 16) que l'élève produit le CONTRASTE qui
  // ouvre la découverte : le garder dans `lab` l'effacerait à l'instant même
  // où il devient intéressant.
  const [tried, setTried] = useState({});

  // Nouveaux nombres (palier, mode classe, « إعادة ») : la scène repart.
  //
  // La réinitialisation se fait PENDANT le rendu, pas dans un effet. Un effet
  // s'exécute après le rendu : pendant une frame, `total` vaudrait déjà 16
  // tandis que `lab` décrirait encore les trois équipes pleines de la partie
  // à 15 — une scène « stabilisée » qui n'existe pas, et dont le verdict
  // (faux) était enregistré sous la nouvelle clé. C'est le procédé React
  // d'ajustement d'état sur changement de props : on compare, on corrige,
  // on laisse React re-rendre immédiatement avec un état cohérent.
  const signature = `${total}:${groups}:${state.epoch}`;
  const [labSignature, setLabSignature] = useState(signature);
  if (labSignature !== signature) {
    setLabSignature(signature);
    setLab(L.init({ total, groups }));
    setReject(null);
  }

  // `lab` peut décrire l'instant d'avant tant que l'ajustement ci-dessus
  // n'a pas été appliqué : on ne lit donc RIEN de lui pendant ce rendu-là.
  const stale = labSignature !== signature || lab.total !== total || lab.groups !== groups;
  const v = L.verdict(lab);

  // Dès que la scène se stabilise, on retient SON verdict. Aucun effet de
  // bord dans un updater (playbook §10.10) : on calcule d'abord, on agit
  // ensuite.
  const settled = v.settled && !stale;
  useEffect(() => {
    if (!settled) return;
    const key = `${total}:${groups}`;
    setTried((prev) => (key in prev ? prev : { ...prev, [key]: v.exact }));
    state.report(onVerdict, { total, groups, perGroup: v.perGroup, leftOver: v.leftOver, exact: v.exact });
  }, [settled, v.exact, total, groups]); // eslint-disable-line react-hooks/exhaustive-deps

  // La découverte s'ouvre quand les DEUX cas ont été vus — un partage qui
  // tombe juste et un partage qui laisse quelqu'un dehors. C'est le contraste
  // qui enseigne, pas l'un des deux cas isolé.
  //
  // `state.epoch` est dans les dépendances, et c'est nécessaire : changer les
  // nombres (15 → 16) appelle `setNumbers`, qui appelle `reset()`, qui
  // REMET la phase à « جرّب ». Or c'est justement ce changement de nombres
  // qui produit le contraste. Sans réaffirmer la découverte après la remise
  // à zéro, elle serait annulée à l'instant même où elle est méritée.
  const contrastSeen = Object.values(tried).includes(true) && Object.values(tried).includes(false);
  useEffect(() => { if (contrastSeen) state.discover(); }, [contrastSeen, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (state.isFormal) state.report(onFinished, v); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Le refus explique le geste qui vient d'échouer ; dès que la scène change,
  // il n'explique plus rien et doit disparaître (sinon l'élève lit un
  // reproche pour une action qu'il a corrigée).
  const placedCount = lab.teams.reduce((n, team) => n + team.length, 0);
  useEffect(() => { setReject(null); }, [placedCount, lab.bench.length, signature]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      const playerId = Number(sourceId.replace('player:', ''));
      if (zoneId === 'bench') { setLab((s) => L.unplace(s, playerId)); return; }
      const teamIndex = Number(zoneId.replace('team:', ''));
      setLab((s) => L.place(s, playerId, teamIndex));
    },
    accepts: (sourceId, zoneId) => {
      const playerId = Number(sourceId.replace('player:', ''));
      if (zoneId === 'bench') {
        // Le banc ne REND un joueur que s'il est dans une équipe. Un joueur
        // déjà sur le banc « posé » sur le banc est un geste SANS EFFET —
        // typiquement le clic qui vient de le prendre et qui remonte jusqu'à
        // la zone. On le refuse SILENCIEUSEMENT (`''`, aucun message) : ce
        // n'est pas une erreur de l'élève, et lui afficher « هذا اللاعب خارج
        // الفرق أصلًا » lui reprochait un geste qu'il n'avait pas fait
        // (défaut rapporté par le propriétaire, 2026-09-20).
        return lab.bench.includes(playerId) ? '' : true;
      }
      return L.canPlace(lab, playerId, Number(zoneId.replace('team:', '')));
    },
    onReject: (sourceId, zoneId, reason) => {
      // Un refus sans raison est volontairement muet (geste sans effet).
      if (!reason) { setReject(null); return; }
      // On capture l'ÉTAT DU GESTE REFUSÉ : quelle équipe visée, combien elle
      // contient, combien contient la plus petite. Le message nomme alors des
      // nombres que l'élève voit à l'écran, au lieu d'une règle abstraite.
      const t = Number(String(zoneId).replace('team:', ''));
      const here = Number.isInteger(t) && lab.teams[t] ? lab.teams[t].length : 0;
      const min = Math.min(...lab.teams.map((team) => team.length));
      setReject({ reason, here, min });
    },
  });

  const heldPlayer = drag.held ? Number(drag.held.replace('player:', '')) : null;

  // Les effectifs et les nombres d'équipes PROPOSÉS. Au niveau débutant, on
  // offre quelques nombres d'équipes dont certains tombent juste et d'autres
  // non : le contraste est à portée de doigt. Au niveau avancé, aucun
  // raccourci — l'élève choisit librement dans les bornes du registre.
  const teamOptions = useMemo(() => {
    if (teamChoices) return teamChoices;
    return isAdvanced ? [] : [2, 3, 4, 5, 6];
  }, [teamChoices, isAdvanced]);

  const squadOptions = useMemo(() => {
    if (squadChoices) return squadChoices;
    return isAdvanced ? [] : [12, 15, 16, 18, 20];
  }, [squadChoices, isAdvanced]);

  // La contrainte croisée de la configuration — UNE seule définition, lue par
  // le laboratoire libre / le mode classe ET par « أنشئ الفرق ».
  const validateNumbers = (n) => (n.groups > n.total ? t('manipulation.teamBuilder.reject.moreTeamsThanPlayers') : '');

  const setGroupsTo = (k) => state.setNumbers({ ...state.numbers, groups: k });
  const setTotalTo = (n) => state.setNumbers({ ...state.numbers, total: n });

  const equality = `${total} = ${groups} \\times ${v.perGroup}${v.leftOver > 0 ? ` + ${v.leftOver}` : ''}`;

  // La COMPOSITION : calculée pour l'effectif visé par équipe, donc stable
  // pendant que l'élève remplit — un joueur déjà posé ne bouge pas quand le
  // suivant arrive.
  const positions = useMemo(() => formationPositions(Math.max(1, v.perGroup)), [v.perGroup]);
  const scale = useMemo(() => playerScale(Math.max(1, v.perGroup)), [v.perGroup]);

  return (
    <ManipulationShell
      type="team-builder"
      title={title ?? t('manipulation.teamBuilder.title', { total, groups })}
      mission={mission ?? t('manipulation.teamBuilder.mission', { groups })}
      lead={lead}
      state={state}
      numberFields={[
        { key: 'total', label: t('manipulation.teamBuilder.squadLabel') },
        { key: 'groups', label: t('manipulation.teamBuilder.teamsLabel') },
      ]}
      validate={validateNumbers}
      allowModeSwitch={allowModeSwitch}
      hints={[
        t('manipulation.teamBuilder.hint1'),
        t('manipulation.teamBuilder.hint2'),
        t('manipulation.teamBuilder.hint3'),
      ]}
      controller={{
        autoStep: () => {
          const mv = L.nextMove(lab);
          if (!mv) return false;
          setLab((s) => L.place(s, mv.playerId, mv.team));
          return true;
        },
        canAutoStep: () => L.nextMove(lab) !== null,
        showSolution: () => { setLab((s) => L.fill(s)); state.discover(); state.formalize(); },
        // « أنشئ الفرق » — la complétion automatique de l'élève (§6bis). Elle
        // ne touche QUE la répartition : ni la découverte, ni la
        // formalisation. Le verdict, le banc et l'égalité suivent la scène
        // exactement comme après le dernier geste manuel.
        autoComplete: {
          label: t('manipulation.teamBuilder.autoComplete'),
          ready: !stale && !validateNumbers({ total, groups }),
          remaining: stale ? 0 : L.remainingMoves(lab),
          step: () => setLab(L.autoStep),
          finish: () => setLab(L.fill),
        },
      }}
      representation={settled && (
        <div className="space-y-2">
          <EquationDisplay
            tex={equality}
            tone={v.exact ? 'ok' : 'result'}
            note={v.exact
              ? t('manipulation.teamBuilder.allPlaying', { perGroup: v.perGroup })
              : t('manipulation.teamBuilder.leftOutNote', { count: v.leftOver, perGroup: v.perGroup })}
          />
          {!v.exact && (
            <p className="rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
              {t('manipulation.teamBuilder.fixHint', { add: v.fix.add, remove: v.fix.remove, groups })}
            </p>
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.teamBuilder.discoverPrompt')}
          options={[
            { text: t('manipulation.teamBuilder.opt1'), correct: true },
            { text: t('manipulation.teamBuilder.opt2'), why: t('manipulation.teamBuilder.why2') },
            { text: t('manipulation.teamBuilder.opt3'), why: t('manipulation.teamBuilder.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={'a = b \\times q + r'} tone="result" note={t('manipulation.teamBuilder.formalNote')} />
              <p className="text-sm text-slate-700">{t('manipulation.teamBuilder.conclusion')}</p>
            </div>
          )}
        />
      )}
      explanation={t('manipulation.teamBuilder.explanation')}
    >
      <ManipulationStage dragging={drag.dragging} className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="space-y-3">
          {/* ── Les réglages de la situation : combien d'équipes, combien de joueurs ── */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {teamOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">{t('manipulation.teamBuilder.teamsLabel')}</span>
                <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.teamBuilder.teamsLabel')}>
                  {teamOptions.map((k) => (
                    <NumberTile
                      key={k} value={k} size="sm" onClick={() => setGroupsTo(k)}
                      label={t('manipulation.teamBuilder.makeTeams', { count: k })}
                      tone={k === groups ? 'common' : 'neutral'}
                    />
                  ))}
                </div>
              </div>
            )}
            {squadOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">{t('manipulation.teamBuilder.squadLabel')}</span>
                <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.teamBuilder.squadLabel')}>
                  {squadOptions.map((n) => (
                    <NumberTile
                      key={n} value={n} size="sm" onClick={() => setTotalTo(n)}
                      label={t('manipulation.teamBuilder.makeSquad', { count: n })}
                      tone={n === total ? 'common' : 'neutral'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── LE TERRAIN : une zone par équipe ─────────────────────────────
              Un terrain vertical a besoin de LARGEUR pour rester lisible :
              trois terrains côte à côte sur un téléphone donnent trois
              lamelles où plus rien ne se lit. La grille suit donc la place
              réelle (`auto-fill` sur une largeur minimale) au lieu d'imposer
              une colonne par équipe : une colonne sur un téléphone, deux sur
              une tablette, jusqu'à quatre sur un grand écran. */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
              maxWidth: `${Math.min(groups, 4) * 260}px`,
            }}
            data-team-pitch
          >
            {lab.teams.map((team, i) => {
              const full = team.length >= v.perGroup;
              return (
                <DropZone
                  key={i}
                  drag={drag}
                  id={`team:${i}`}
                  label={t('manipulation.teamBuilder.teamZone', { n: i + 1 })}
                  tone={full ? 'emerald' : 'indigo'}
                  minHeight="min-h-0"
                  className="relative p-2"
                  data-team={i}
                  data-team-size={team.length}
                >
                  <div className="mb-1 flex items-center justify-between gap-1">
                    <span className="text-[11px] font-extrabold text-slate-800">
                      {t('manipulation.teamBuilder.teamName', { n: i + 1 })}
                    </span>
                    <span dir="ltr" className={`rounded-full px-1.5 font-mono text-[11px] font-bold ${full ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                      {team.length}/{v.perGroup}
                    </span>
                  </div>

                  {/* LE TERRAIN, vertical et à ses proportions réelles (2/3).
                      Les joueurs sont POSÉS DESSUS en composition : chaque
                      position vient de `teamFormation`, balayée par ses
                      tests pour qu'aucun effectif atteignable ne superpose
                      deux joueurs. */}
                  <div className="relative mx-auto w-full" style={{ aspectRatio: '2 / 3' }} data-team-pitch-area>
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <PitchBackdrop variant="full" />
                    </div>
                    {team.map((p, idx) => {
                      const pos = positions[idx] ?? { x: 50, y: 50 };
                      return (
                        <DraggableObject
                          key={p} drag={drag} id={`player:${p}`}
                          label={t('manipulation.teamBuilder.playerInTeam', { n: p + 1, team: i + 1 })}
                          className="absolute rounded-lg"
                          style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${scale}%`, transform: 'translate(-50%, -50%)' }}
                        >
                          <PlayerFigure index={p} team={i} size="100%" held={drag.held === `player:${p}`} />
                        </DraggableObject>
                      );
                    })}
                    {team.length === 0 && (
                      <span className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-white/85 px-2 py-1 text-center text-[11px] font-bold text-slate-700">
                        {t('manipulation.teamBuilder.dropHere')}
                      </span>
                    )}
                  </div>
                </DropZone>
              );
            })}
          </div>

          {/* ── LE BANC : ceux qui n'ont pas (encore) d'équipe ──────────────── */}
          <DropZone
            drag={drag}
            id="bench"
            label={t('manipulation.teamBuilder.benchZone')}
            tone={settled && !v.exact ? 'amber' : 'slate'}
            minHeight="min-h-[86px]"
            className="border-dashed bg-[repeating-linear-gradient(45deg,#F8FAFC_0_8px,#F1F5F9_8px_16px)] p-2"
            data-bench-count={lab.bench.length}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700">
                <FootballIcon size={14} />
                {t('manipulation.teamBuilder.benchZone')}
              </span>
              <span dir="ltr" className="font-mono text-[11px] font-bold text-slate-600">{lab.bench.length}</span>
            </div>
            <div className="flex flex-wrap items-end gap-0.5">
              {lab.bench.map((p) => (
                <DraggableObject
                  key={p} drag={drag} id={`player:${p}`}
                  label={t('manipulation.teamBuilder.playerOnBench', { n: p + 1 })}
                  className="rounded-lg"
                >
                  <PlayerFigure
                    index={p} team={null} size={34}
                    held={drag.held === `player:${p}`}
                    benched={settled && !v.exact}
                  />
                </DraggableObject>
              ))}
              {lab.bench.length === 0 && (
                <span className="px-2 py-3 text-xs font-bold text-emerald-700">{t('manipulation.teamBuilder.benchEmpty')}</span>
              )}
            </div>
          </DropZone>

          {reject && (
            <p role="status" className="rounded-lg border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-900">
              {t(`manipulation.teamBuilder.reject.${reject.reason}`, {
                perGroup: v.perGroup, here: reject.here, min: reject.min,
              })}
            </p>
          )}
        </div>
      </ManipulationStage>

      <DragGhost ghost={drag.ghost}>
        {heldPlayer !== null && <PlayerFigure index={heldPlayer} team={null} size={36} held />}
      </DragGhost>
    </ManipulationShell>
  );
}
