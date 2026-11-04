import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import DraggableObject from '../primitives/DraggableObject';
import NumberTile from '../primitives/NumberTile';
import DivisorChip from '../primitives/DivisorChip';
import DragGhost from '../primitives/DragGhost';
import EquationDisplay from '../primitives/EquationDisplay';
import GroupingScene from '../primitives/GroupingScene';
import GroupStock, { GroupWrapper } from '../primitives/GroupStock';
import { themeWords } from '../themeWords';
import MathText from '../../components/MathText';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import { ordered } from './cpOrder';
import * as L from '../logic/coprime';

const NS = 'manipulation.coprime';

/**
 * coprime-explorer — « أوليان فيما بينهما », PROUVÉ et pas deviné.
 *
 * DEUX LABORATOIRES, UN PAR NIVEAU, jamais enchaînés en silence (§7quater) :
 *
 *   startWith="groups"  LES TROUSSES. 17 stylos et 18 cahiers ; l'élève
 *       AJOUTE une trousse à la fois (la réserve de la leçon 4, `GroupStock`)
 *       et tout se redistribue. « Seul 1 marche » n'est affirmé qu'après avoir
 *       essayé 2 … 17 (`groupsInsightReady`) — jusqu'au 2026-09-30, deux échecs
 *       suffisaient et le rail s'arrêtait à 12 : 13 … 17 étaient intestables.
 *       Un nombre > 1 qui marche réfute au contraire tout de suite.
 *   (par défaut)       LES LISTES. L'élève confronte les diviseurs au milieu ;
 *       chaque jeton refusé est un DIVISEUR TESTÉ. « تحقّق » ne conclut que
 *       quand la preuve est complète (`listsConclusive`) : premiers entre eux
 *       ⇔ tous les diviseurs du plus petit ont été confrontés à l'autre ; pas
 *       premiers ⇔ UN commun > 1 posé — la réfutation du manuel contre مريم.
 *       Sinon « تحقّق » dit ce qui manque, au lieu de se taire. Avant, poser 1
 *       puis « تحقّق » concluait (1 est le seul commun).
 *
 * QUESTIONS PENDANT LE LABO (2026-10-28, `primitives/LabCheckpoint`) : UNE étape (`LabStepper`, `[data-cp-step]`), car la scène est libre — la suite s'ouvre quand
 * la preuve est complète (trousses : `groupsInsightReady` ; listes : « تحقّق » concluant) et finit par la RÈGLE, qui remplace la découverte automatique et formalise
 * dans `onDone`. Trousses : `gWork` · `gBecause` · `rule` ; listes : `lTested` · `lCommon` · `rule` (`CHAINS`, textes dans `coprime.cp.*`). Obligatoires pour tout élève ;
 * l'enseignant seul les coupe (`useLabCheckpointSettings`). SON : `tooth` par trousse / jeton posé, `bell` quand une répartition marche, `flag` à la preuve, `over` au refus.
 *
 * FICHE (MANIPULATION_DNA §7) — variable : k (trousses) / le diviseur
 * confronté ; résistance : les objets dehors, le jeton refusé avec sa raison ;
 * contraste : 1 marche, 2 … 17 non (ou 3 marche pour 27 et 36) ; découverte :
 * une propriété du COUPLE, pas de chaque nombre.
 */
export default function CoprimeExplorer({
  a: a0, b: b0, title, lead, mission, theme = 'school', startWith = 'lists', initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, checkpoints: cpOn = true,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'coprime-explorer', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { a, b } = state.numbers;
  const inGroups = startWith === 'groups';
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const [lab, setLab] = useState(() => L.init({ a: a0, b: b0 }));
  const [groups, setGroups] = useState(() => L.initGroups({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);
  const [checkNote, setCheckNote] = useState(null);
  // Miroirs synchrones : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const labRef = useRef(lab);
  labRef.current = lab;
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  // « إعادة », d'autres nombres ou un autre niveau : TOUT recommence — les essais, les questions du labo, la fête
  const sceneKey = `${a}|${b}|${state.epoch}|${state.resetCount}`;
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init({ a, b })); setGroups(L.initGroups({ a, b })); setReject(null); setCheckNote(null); }

  const words = themeWords(t, theme);
  const top = Math.min(a, b);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      playSfx('tooth');
      if (sourceId === 'group:add') { setGroups(L.addGroupTo); return; }
      if (sourceId === 'group:remove') { setGroups(L.removeGroupFrom); return; }
      if (zoneId === 'shared') { setCheckNote(null); setLab((s) => L.share(s, sourceId)); }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId === 'group:add') return zoneId === 'kits' ? L.canChooseGroups(groups, (groups.k ?? 0) + 1) : '';
      if (sourceId === 'group:remove') return zoneId === 'stock' ? (groups.k === null ? 'empty' : true) : '';
      return zoneId === 'shared' ? L.canShare(lab, sourceId) : '';
    },
    onReject: (sourceId, zoneId, reason) => {
      if (reason) playSfx('over');
      if (sourceId.startsWith('group:')) { setReject({ kind: 'group', reason }); return; }
      // Un jeton REFUSÉ au milieu est un diviseur TESTÉ : il compte dans la preuve.
      if (zoneId === 'shared') setLab((s) => L.share(s, sourceId));
      setReject({ kind: 'list', reason, d: L.parseChip(sourceId).d });
    },
  });

  // LES TROUSSES : la découverte suit la preuve (tout essayé, ou un k > 1 qui marche).
  const insight = inGroups && L.groupsInsightReady(groups);
  const working = L.workingCounts(groups);
  const cpSettings = useLabCheckpointSettings('coprime-explorer');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const ruleByCheckpoint = cpOn && cpSettings.enabled;
  useEffect(() => { if (insight && !ruleByCheckpoint) state.discover(); }, [insight, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  // LES LISTES : « تحقّق » conclut quand la preuve est complète, sinon il dit ce qui manque.
  const conclusive = L.listsConclusive(lab);
  const check = () => {
    setLab(L.check);
    if (conclusive) { setCheckNote(null); if (!ruleByCheckpoint) state.discover(); return; }
    const missing = L.untested(lab);
    setCheckNote(L.isCoprime(lab)
      ? t('manipulation.coprime.checkUntested', { n: Math.min(a, b), list: missing.join(' ، ') })
      : t('manipulation.coprime.checkNoCommon'));
  };

  useEffect(() => { if (state.isFormal) state.report(onFinished, L.isCoprime(lab)); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const coprime = L.isCoprime(lab);
  const heldValue = drag.held && !drag.held.startsWith('group:') ? L.parseChip(drag.held).d : null;
  const extra = lab.common.filter((d) => d > 1);
  const firstWorking = working.find((k) => k > 1);
  const wrapper = <GroupWrapper theme={theme} />;

  // les questions pendant le labo : la suite s'ouvre quand la preuve est complète, et finit par la règle
  const mode = inGroups ? 'groups' : 'lists';
  const reached = inGroups ? insight : lab.checked && conclusive;
  const [answered, setAnswered] = useState({ key: sceneKey, done: false });
  const isAnswered = answered.key === sceneKey && answered.done;
  const chain = ruleByCheckpoint && !isAnswered && reached ? CHAINS[mode] : null;
  const cp = useLabCheckpoint({
    id: chain ? mode : null,
    questions: chain ? chain.map((q) => QUESTIONS[q]({ a, b, lab, groups, words, mode }, k)) : null,
    reached: true,
    resetKey: sceneKey,
    onRetry: () => { setCheckNote(null); setReject(null); if (inGroups) setGroups(L.initGroups({ a, b })); else setLab(L.init({ a, b })); },
    onEvent: (ev) => state.report(onTrial, ev),
    onDone: () => { setAnswered({ key: sceneKey, done: true }); state.discover(); state.formalize(); },
  });
  const stepDone = [reached && (!ruleByCheckpoint || isAnswered)];
  const party = useStepCelebration();
  const celebrated = useRef({ key: sceneKey, done: false });
  if (celebrated.current.key !== sceneKey) celebrated.current = { key: sceneKey, done: false };
  useEffect(() => {
    if (!stepDone[0] || celebrated.current.done) return;
    celebrated.current.done = true;
    party.celebrate({ n: 1, total: 1 });
  }, [stepDone[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  // le son : la cloche quand une répartition en trousses marche, le drapeau quand la preuve est complète
  const heard = useRef({ works: false, proof: false });
  useEffect(() => {
    if (groups.k !== null && groups.works && !heard.current.works) playSfx('bell');
    heard.current.works = groups.k !== null && !!groups.works;
  }, [groups.k, groups.works]);
  useEffect(() => {
    if (reached && !heard.current.proof) playSfx('flag');
    heard.current.proof = !!reached;
  }, [reached]);

  return (
    <ManipulationShell
      type="coprime-explorer"
      title={title ?? t('manipulation.coprime.title', { a, b })}
      mission={mission ?? (inGroups
        ? t('manipulation.coprime.groupsMission', { groups: words.groups })
        : t('manipulation.coprime.mission', { a, b }))}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      allowModeSwitch={allowModeSwitch}
      headerAction={cpOn ? cpSettings.control : null}
      guided={!!chain || ruleByCheckpoint}
      hints={inGroups
        ? [t('manipulation.coprime.groupsHint1'), t('manipulation.coprime.groupsHint2'), t('manipulation.coprime.groupsHint3')]
        : [t('manipulation.coprime.hint1'), t('manipulation.coprime.hint2'), t('manipulation.coprime.hint3')]}
      onCheck={inGroups ? undefined : check}
      checkDisabled={lab.tested.length === 0 || state.isDiscovered}
      controller={{
        autoStep: () => {
          if (inGroups) {
            if (L.groupsInsightReady(groups)) return false;
            setGroups(L.addGroupTo);
            return true;
          }
          const small = a <= b ? lab.da : lab.db;
          const d = small.find((x) => !lab.tested.includes(x));
          if (d === undefined) { if (!state.isDiscovered) { setLab(L.check); if (!ruleByCheckpoint) state.discover(); return true; } return false; }
          setLab((s) => L.share(s, L.chipId(a <= b ? 'a' : 'b', d)));
          return true;
        },
        canAutoStep: () => !state.isDiscovered,
        // Trousses : chaque k de 1 à min(a ; b). Listes : chaque diviseur du plus
        // petit nombre confronté à l'autre (même `L.share` que le dépôt d'un jeton).
        // « تحقّق » et la question restent à l'élève.
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: inGroups ? L.untriedGroups(groups).length : L.untested(lab).length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => {
            if (inGroups) {
              const next = L.untriedGroups(groupsRef.current)[0];
              if (next === undefined) return;
              groupsRef.current = L.chooseGroups(groupsRef.current, next);
              setGroups(groupsRef.current);
              return;
            }
            const d = L.untested(labRef.current)[0];
            if (d === undefined) return;
            setCheckNote(null); setReject(null);
            labRef.current = L.share(labRef.current, L.chipId(a <= b ? 'a' : 'b', d));
            setLab(labRef.current);
          },
          finish: () => {
            if (inGroups) {
              const todo = L.untriedGroups(groupsRef.current);
              if (todo.length === 0) return;
              groupsRef.current = todo.reduce((acc, k) => L.chooseGroups(acc, k), groupsRef.current);
              setGroups(groupsRef.current);
              return;
            }
            const todo = L.untested(labRef.current);
            if (todo.length === 0) return;
            setCheckNote(null); setReject(null);
            labRef.current = todo.reduce((acc, d) => L.share(acc, L.chipId(a <= b ? 'a' : 'b', d)), labRef.current);
            setLab(labRef.current);
          },
        },
        showSolution: () => {
          if (inGroups) setGroups((g) => { let x = g; while (!L.groupsInsightReady(x) && (x.k ?? 0) < top) x = L.addGroupTo(x); return x; });
          else setLab((s) => { let x = s; for (const d of (a <= b ? s.da : s.db)) x = L.share(x, L.chipId(a <= b ? 'a' : 'b', d)); return L.check(x); });
          state.discover(); state.formalize();
        },
      }}
      representation={(
        <div className="space-y-2">
          {inGroups && groups.k !== null && (
            <EquationDisplay
              tex={`${a} = ${groups.k} \\times ${groups.qa} + ${groups.ra} \\quad ${b} = ${groups.k} \\times ${groups.qb} + ${groups.rb}`}
              size="sm" tone={groups.works ? 'ok' : 'neutral'}
              note={groups.works
                ? t('manipulation.common.perGroup', { group: words.group, qa: groups.qa, qb: groups.qb, itemA: words.itemA, itemB: words.itemB })
                : t('manipulation.common.leftOverItems', { ra: groups.ra, rb: groups.rb, itemA: words.itemA, itemB: words.itemB })}
            />
          )}
          {!inGroups && lab.shared.length > 0 && (
            <EquationDisplay
              tex={`\\{${lab.shared.join(' ; ')}\\}`}
              tone={lab.checked && conclusive ? (coprime ? 'ok' : 'result') : 'neutral'}
              size="sm"
              note={lab.checked && conclusive && coprime ? t('manipulation.coprime.onlyOne') : t('manipulation.commonDivisorsLabel')}
            />
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.coprime.discoverPrompt', { a, b })}
          options={coprime ? [
            { text: t('manipulation.coprime.opt2'), why: t('manipulation.coprime.why2') },
            { text: t('manipulation.coprime.opt1'), correct: true },
            { text: t('manipulation.coprime.opt3'), why: inGroups ? t('manipulation.coprime.groupsWhy3') : t('manipulation.coprime.why3') },
          ] : [
            { text: t('manipulation.coprime.notOpt2'), why: t('manipulation.coprime.notWhy2', { list: (inGroups ? working.filter((k) => k > 1) : extra).join(' ، ') }) },
            { text: t('manipulation.coprime.notOpt1'), correct: true },
            { text: t('manipulation.coprime.notOpt3'), why: t('manipulation.coprime.notWhy3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={`\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.g}`} tone="result" size="lg"
                note={coprime ? t('manipulation.coprimeVerdict') : t('manipulation.notCoprime')} />
              {!coprime && <p className="text-sm text-slate-700">{t('manipulation.coprime.commonNotOne', { list: extra.join(' ، ') })}</p>}
            </div>
          )}
        />
      )}
      explanation={t('manipulation.coprime.explanation')}
    >
      <div className="relative min-h-[520px]" data-cp-glance>
      {party.node}
      {cp.node}
      <ManipulationStage dragging={drag.dragging}>
        <LabStepper count={1} current={0} done={stepDone} stepAttr="data-cp-step" />
        {inGroups ? (
          <div className="space-y-3" data-coprime-groups>
            <GroupStock drag={drag} theme={theme} words={words} k={groups.k} tried={groups.tried}
              canAdd={L.canChooseGroups(groups, (groups.k ?? 0) + 1) === true}
              onAdd={() => { setReject(null); setGroups(L.addGroupTo); }}
              onRemove={() => { setReject(null); setGroups(L.removeGroupFrom); }} />

            <DropZone drag={drag} id="kits" label={words.scene} minHeight="min-h-[150px]" className="p-3" data-groups-table>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700">{words.scene}</span>
                {groups.k === null
                  ? <span className="text-slate-500">{t('manipulation.common.pileHint', { stock: words.stock })}</span>
                  : <span className={groups.works ? 'text-emerald-700' : 'text-amber-800'}>{groups.works
                    ? t('manipulation.common.perGroup', { group: words.group, qa: groups.qa, qb: groups.qb, itemA: words.itemA, itemB: words.itemB })
                    : t('manipulation.common.leftOverItems', { ra: groups.ra, rb: groups.rb, itemA: words.itemA, itemB: words.itemB })}</span>}
              </div>
              {groups.k !== null && (
                <div className="mb-2 flex justify-end">
                  <DraggableObject drag={drag} id="group:remove" label={words.remove} className="flex items-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-500">
                    {wrapper}<span>→ {words.stock}</span>
                  </DraggableObject>
                </div>
              )}
              <GroupingScene a={a} b={b} k={groups.k} theme={theme} words={words}
                ariaLabel={groups.k === null ? `${a} · ${b}` : `${a} = ${groups.k} × ${groups.qa} + ${groups.ra} · ${b} = ${groups.k} × ${groups.qb} + ${groups.rb}`} />
            </DropZone>

            {insight ? (
              <p className={`rounded-2xl border-2 px-3 py-2 text-sm font-bold ${firstWorking ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`} role="status" data-coprime-insight>
                {firstWorking
                  ? t('manipulation.coprime.worksMany', { k: firstWorking, a, b })
                  : t('manipulation.coprime.onlyOneWorks', { top })}
              </p>
            ) : Object.keys(groups.tried).length >= 3 && (
              <p className="text-xs font-bold text-slate-600" data-coprime-keep-going>{t('manipulation.coprime.keepGoing', { top })}</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2 grid-cols-2">
              {[{ side: 'a', n: a, list: lab.da }, { side: 'b', n: b, list: lab.db }].map(({ side, n, list }) => (
                <div key={side} className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <NumberTile value={n} tone={side === 'a' ? 'dividend' : 'divisor'} size="sm" /> {t('manipulation.divisorsOf', { n })}
                  </div>
                  <div dir="ltr" className="flex flex-wrap gap-1.5">
                    {list.map((d) => {
                      const shared = lab.shared.includes(d);
                      const tested = lab.tested.includes(d);
                      return (
                        <DivisorChip key={`${side}${d}`} value={d} drag={drag} id={L.chipId(side, d)} label={`${d}`}
                          state={shared ? 'common' : tested ? 'no' : 'idle'} disabled={shared} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <DropZone drag={drag} id="shared" label={t('manipulation.coprime.sharedZone')} tone="emerald" minHeight="min-h-[76px]" className="p-2">
              <div className="mb-1 text-[11px] font-bold text-emerald-800">{t('manipulation.coprime.sharedZone')}</div>
              <div dir="ltr" className="flex flex-wrap gap-1.5">
                {lab.shared.length === 0 && <span className="text-xs text-slate-400">{t('manipulation.coprime.dropShared')}</span>}
                {lab.shared.map((d) => <DivisorChip key={`s${d}`} value={d} state="common" />)}
              </div>
            </DropZone>
            {checkNote && <p role="status" className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-bold text-sky-900" data-coprime-check-note>{checkNote}</p>}
          </div>
        )}

        {reject && (
          <p role="status" className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {reject.kind === 'group'
              ? t(`manipulation.common.reject.${reject.reason}`)
              : t(`manipulation.coprime.reject.${reject.reason}`, { d: reject.d, a, b })}
          </p>
        )}
      </ManipulationStage>
      </div>
      <DragGhost ghost={drag.ghost}>{drag.held?.startsWith('group:') ? wrapper : heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite de questions de chaque niveau : elle interroge ce que l'élève vient de FAIRE ; la dernière finit par la RÈGLE. */
export const CHAINS = Object.freeze({
  groups: ['gWork', 'gBecause', 'rule'],
  lists: ['lTested', 'lCommon', 'rule'],
});

const $ = (x) => `$${x}$`;
const Mx = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;
const listText = (xs) => xs.join(' ، ');

/** Chaque question est construite sur LES nombres de l'élève (rien n'est écrit en dur) ; `k` : les textes de `coprime`. */
const BUILD = {
  gWork: ({ a, b, groups, words }, k) => {
    const works = L.workingCounts(groups).filter((x) => x > 1);
    const top = Math.min(a, b);
    const o = { a, b, top, itemsA: words.itemsA, itemsB: words.itemsB, groups: words.groups };
    return {
      id: 'gWork', kind: 'number', expected: String(works.length), answer: <MathText>{$(works.length)}</MathText>,
      prompt: Mx(k, 'gWork.prompt', o),
      hints: [Mx(k, 'gWork.hint1', o), Mx(k, 'gWork.hint2', o)],
      explain: Mx(k, works.length === 0 ? 'gWork.explainNone' : 'gWork.explainSome', { ...o, n: works.length, list: works.join(' ، ') }),
    };
  },
  gBecause: ({ a, b, groups, words }, k) => {
    const works = L.workingCounts(groups).filter((x) => x > 1);
    const coprime = L.isCoprime(L.init({ a, b }));
    const o = { a, b, top: Math.min(a, b), kk: works[0], itemsA: words.itemsA, itemsB: words.itemsB, groups: words.groups };
    return {
      id: 'gBecause', kind: 'choice',
      prompt: Mx(k, 'gBecause.prompt', o),
      options: [
        { text: Mx(k, 'gBecause.parity'), why: Mx(k, 'gBecause.whyParity', o) },
        { text: Mx(k, coprime ? 'gBecause.noCommon' : 'gBecause.common', o), correct: true },
        { text: Mx(k, 'gBecause.big'), why: Mx(k, 'gBecause.whyBig', o) },
      ],
      hints: [Mx(k, 'gBecause.hint1', o), Mx(k, coprime ? 'gBecause.hint2None' : 'gBecause.hint2Some', o)],
      explain: Mx(k, coprime ? 'gBecause.explainNone' : 'gBecause.explainSome', o),
    };
  },
  lTested: ({ a, b, lab }, k) => {
    const small = Math.min(a, b); const big = Math.max(a, b);
    const o = { small, big, list: listText(lab.tested) };
    return {
      id: 'lTested', kind: 'number', expected: String(lab.tested.length), answer: <MathText>{$(lab.tested.length)}</MathText>,
      prompt: Mx(k, 'lTested.prompt', o),
      hints: [Mx(k, 'lTested.hint1', o), Mx(k, 'lTested.hint2', o)],
      explain: Mx(k, 'lTested.explain', { ...o, n: lab.tested.length }),
    };
  },
  lCommon: ({ a, b, lab }, k) => {
    const small = Math.min(a, b); const big = Math.max(a, b);
    const allList = [...new Set([...lab.da, ...lab.db])].sort((x, y) => x - y);
    const extra = [...lab.da, ...lab.db].find((d) => !lab.common.includes(d));
    const refused = lab.tested.find((d) => !lab.shared.includes(d)) ?? extra;
    const side = (d) => (a % d === 0 ? b : a);
    const o = { a, b, small, big, shared: listText(lab.shared), refused, only: refused !== undefined ? side(refused) : big, all: listText(allList) };
    return {
      id: 'lCommon', kind: 'choice',
      prompt: Mx(k, 'lCommon.prompt', o),
      options: [
        { text: <MathText>{$(`${lab.shared.join(' ; ')}`)}</MathText>, correct: true },
        { text: <MathText>{$(`${[...lab.shared, refused].filter((x) => x !== undefined).sort((x, y) => x - y).join(' ; ')}`)}</MathText>, why: Mx(k, 'lCommon.whyRefused', o) },
        { text: <MathText>{$(`${allList.join(' ; ')}`)}</MathText>, why: Mx(k, 'lCommon.whyAll', o) },
      ],
      cols: 3,
      hints: [Mx(k, 'lCommon.hint1', o), Mx(k, 'lCommon.hint2', o)],
      explain: Mx(k, 'lCommon.explain', o),
    };
  },
  rule: ({ a, b, lab, groups, words, mode }, k) => {
    const inGroups = mode === 'groups';
    const coprime = L.isCoprime(lab);
    const extra = inGroups ? L.workingCounts(groups).filter((x) => x > 1) : lab.common.filter((x) => x > 1);
    const options = coprime ? [
      { text: <MathText>{k('opt2')}</MathText>, why: <MathText>{k('why2')}</MathText> },
      { text: <MathText>{k('opt1')}</MathText>, correct: true },
      { text: <MathText>{k('opt3')}</MathText>, why: <MathText>{k(inGroups ? 'groupsWhy3' : 'why3')}</MathText> },
    ] : [
      { text: <MathText>{k('notOpt2')}</MathText>, why: <MathText>{k('notWhy2', { list: extra.join(' ، ') })}</MathText> },
      { text: <MathText>{k('notOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('notOpt3')}</MathText>, why: <MathText>{k('notWhy3')}</MathText> },
    ];
    return {
      id: 'rule', kind: 'choice',
      prompt: <MathText>{k('discoverPrompt', { a, b })}</MathText>,
      options,
      hints: [Mx(k, 'rule.hint1', { a, b }), Mx(k, coprime ? 'rule.hint2Coprime' : 'rule.hint2Not', { a, b, list: extra.join(' ، ') })],
      explain: Mx(k, coprime ? 'rule.explainCoprime' : 'rule.explainNot', { a, b, g: lab.g, list: extra.join(' ، ') }),
    };
  },
};

export const QUESTIONS = ordered(BUILD);
