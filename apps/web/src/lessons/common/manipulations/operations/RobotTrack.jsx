import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hand, CheckCircle2, Sparkles, ChevronLeft, FlaskConical, Undo2, Check, Play, Eraser, Plus as PlusIcon, Ban } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import MathText from '../../components/MathText';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import { LabCard, PromptCard, VerdictBanner, StepperCard, ChoiceTray, ChoiceCard } from '../primitives/LabKit';
import DraggableObject from '../primitives/DraggableObject';
import DropZone from '../primitives/DropZone';
import DragGhost from '../primitives/DragGhost';
import { useLabCoach } from '../primitives/LabCoach';
import MatArt, { minus } from './robotTrack/MatArt';
import { LEVELS } from '../levels';
import * as L from '../logic/robotTrack';

/**
 * robot-track — LES SIGNES ET L'ORDRE SOUS LA MAIN (3AM, unité 1 « الأعداد النسبية », درس « جداء عدة أعداد نسبية », 2026-10-26).
 * La logique, exacte, est dans `logic/robotTrack.js` (sur `packages/core/arithmetic/relativeOps.js`, importé par chemin).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. La main tient le SIGNE de chaque carte du programme (le badge + / −) et l'ORDRE / la PRÉSENCE des cartes (porter du plateau vers une case,
 *    d'une case vers une autre — échange —, d'une case vers le plateau ; clavier : Entrée prend, Entrée sur la case pose). Monde `square` : un nombre a.
 * B. Le monde : un robot part de 1 sur un tapis gradué ; chaque carte multiplie sa position. Une carte négative le fait SAUTER par-dessus le poteau 0 ;
 *    une carte positive l'éloigne du même côté. Le robot rejoue le programme après CHAQUE changement ; les sauts restent tracés en arcs numérotés.
 * C. La résistance : la raie n'est atteinte que par certains programmes ; l'arrêt faux est refusé AVEC son calcul ; en m4 deux cartes négatives donnent
 *    +24 (« une seule négative ⇒ négatif » et « la majorité » sont réfutés) ; le monde `square` ne mène jamais du côté négatif.
 * D. La phase formelle est écrite par le MODULE (après la réponse de l'élève sur son سجلّ) : le labo n'énonce jamais « pair » ni « impair ».
 * E. Les fausses conjectures sont réfutées avec l'arrêt de l'élève lui-même (ligne du produit courant + le سجلّ).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        le produit de plusieurs relatifs : son côté ne dépend que du nombre de facteurs négatifs, pas de leur ordre ; × (−1) = le symétrique ; a × a ≥ 0
 *   OBJECT         un tapis gradué, le poteau 0, un robot à roues, un programme de cartes et un plateau de cartes
 *   VARIABLE       le signe et la place de chaque carte (et, au monde `square`, le nombre a ; en répétition, n)
 *   INVARIANT      le départ en 1 ; la valeur absolue de chaque carte (seul son signe se retourne)
 *   TRANSFORMATION retourner un signe : un saut de plus ou de moins ; échanger deux cartes : la trace des arrêts change, l'arrêt final non
 *   CONSTRAINT     ≤ 6 cartes ; |arrêt| ≤ 40 (au-delà le robot s'arrête au bord avec le nombre écrit)
 *   RESISTANCE     la raie visée n'a que certains programmes ; un arrêt faux est refusé avec son calcul ; m4 : deux négatives donnent +24
 *   EVIDENCE       la ligne du produit courant, les arcs numérotés, le سجلّ des arrêts validés avec leur nombre de cartes négatives
 *   CONTRAST       un saut / pas de saut ; 1 ou 3 négatives (−24) contre 0 ou 2 (24) ; 4 puis −0,5 contre les autres ordres (arrêt final 20 toujours)
 *   PREDICTION     متقدم a1 et a3 : le côté (يسار / يمين) et la distance, AVANT « شغّل »
 *   DISCOVERY      portée par le module (q3 : ce que partagent les programmes du côté négatif), pas par le labo
 *   FORMALIZATION  dans le module : la règle de la parité
 *   TRANSFER       « جرّب أعدادك » (toujours ouvert : un facteur 0 arrête le robot sur le poteau), les exercices et la banque
 *
 * D'UN SEUL REGARD (§8bis) : `[data-rt-glance]` = la consigne (contexte puis UNE question), le tapis, le programme + le plateau, les commandes de la
 * mission, le verdict et le سجلّ. Écrans : 768×1024 et 1024×768 (barre latérale ouverte) — le programme tient sur UNE rangée de six cases.
 *
 * ONBOARDING : `coachOf` (tray · sign · swap · side · run · repeat · square · impossible · next) montre le contrôle, jamais le nombre.
 *
 * Props : `tasks`, `world` ('track' | 'square'), `level`, `levels`, `coach`, `title`, `lead`, `onTrial(event)`, `onFinished({ world })`.
 *
 * CONTRAT DOM : [data-robot-track][data-task][data-solved][data-layout][data-world], [data-rt-glance], [data-rt-stage], [data-rt-svg], [data-rt-robot][data-pos],
 * [data-rt-flag], [data-rt-arc=<n>], [data-rt-post], [data-rt-line], [data-rt-program], [data-rt-slot=<i>], [data-rt-card=<id>][data-v], [data-rt-sign=<id>],
 * [data-rt-tray], [data-rt-sides], [data-rt-left], [data-rt-right], [data-rt-dist], [data-rt-run], [data-rt-retry], [data-rt-repeat], [data-rt-a], [data-rt-impossible],
 * [data-rt-record], [data-rt-row], [data-rt-verdict=right|wrong|free|''], [data-rt-prompt][data-lit], [data-rt-context], [data-rt-chip], [data-rt-next],
 * [data-rt-step=<i>][data-done], [data-rt-free][data-active], [data-rt-free-input], [data-rt-free-add], [data-rt-free-clear], [data-rt-free-back].
 */
const NS = 'manipulation.robotTrack';
const LRI = '⁦';
const PDI = '⁩';
// LRM juste après LRI : sans lettre forte, des chiffres (EN) entre neutres s'ordonnent comme du RTL (« −5 » deviendrait « 5− »).
const iso = (s) => `${LRI}\u200E${s}${PDI}`;
const WIDE_MIN = 700;
const SPLIT_MIN = 620;
const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-300';

const CSS = `
@keyframes rt-pop { 0% { transform: scale(0.85); } 70% { transform: scale(1.06); } 100% { transform: scale(1); } }
.rt-pop { animation: rt-pop 260ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .rt-pop { animation: none !important; } [data-rt-robot] { transition: none !important; } }
`;

/** Les nombres de départ : ceux de la leçon, sinon ceux du niveau. */
export function numbersFor({ tasks, world, level }) {
  const lv = resolveLevelId(level ?? 'beginner');
  const asked = LEVELS['robot-track'][lv].numbers;
  const w = world ?? asked.world ?? 'track';
  return { world: w, tasks: tasks ?? (w === 'square' ? L.SQUARE_TASKS : asked.tasks) };
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function RobotTrack({
  tasks, world, title, lead, level, levels: withLevels = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ tasks, world, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'robot-track', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const numsKey = JSON.stringify(nums);
  const [lab, setLab] = useState(() => L.init(nums));
  const [scene, setScene] = useState({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
  if (scene.key !== numsKey || scene.epoch !== state.epoch) {
    const restart = scene.key === numsKey && scene.rc !== state.resetCount;
    setScene({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
    setLab(restart ? L.restartTask(lab) : L.init(nums));
  }
  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  const finishedOnce = useRef(false);
  useEffect(() => {
    if (!ready) { finishedOnce.current = false; return; }
    if (!finishedOnce.current) { finishedOnce.current = true; state.report(onFinished, { world: lab.world }); }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  const reported = useRef(0);
  const nTrials = lab.trials.length;
  useEffect(() => {
    if (nTrials < reported.current) reported.current = 0;
    for (let i = reported.current; i < nTrials; i += 1) state.report(onTrial, L.trialEvidence(lab.trials[i]));
    reported.current = nTrials;
  }, [nTrials, lab.trials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── onboarding ── */
  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'robot-track', step: coachStep,
    text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });

  /* ── mesure ── */
  const boxRef = useRef(null);
  const [width, setWidth] = useState(640);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(300, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const vp = useLessonViewport(true);
  const screenH = vp.ready && vp.height > 0 ? vp.height : 720;
  const advanced = nums.tasks.some((tk) => tk.kind === 'predict');

  return (
    <ManipulationShell
      type="robot-track"
      title={title ?? k('title')}
      titleHidden
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      coach={coachOn ? coach : null}
      hints={[0, 1, 2].map((i) => k(`hints.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-indigo-50/50 to-white">
        <div ref={boxRef} className="space-y-2" data-robot-track data-task={lab.ti} data-world={lab.world} data-solved={ready ? 'true' : 'false'} data-layout={width >= WIDE_MIN ? 'wide' : 'narrow'}>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <Lab lab={lab} setLab={setLab} k={k} width={width} screenH={screenH} advanced={advanced} lead={state.isAuthoredLevel ? lead : null} />
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ Le laboratoire ══════════════ */

/** Une carte de programme : une tuile en carton, son nombre (la zone qu'on saisit) et, dessous, le badge du signe (le bouton qui le retourne). */
function Tile({ v, size, onFlip, flippable, k, id, drag = null, label = '' }) {
  const neg = v.startsWith('−') || v.startsWith('-');
  const body = (
    <span className="flex h-full w-full items-center justify-center">
      <bdi dir="ltr" className="text-xl font-black tabular-nums text-slate-900">{minus(v)}</bdi>
    </span>
  );
  return (
    <div className={`flex flex-col items-center rounded-xl border-2 text-center shadow-[0_3px_0_0_rgba(120,53,15,0.25)] ${neg ? 'border-rose-300 bg-rose-50' : 'border-teal-300 bg-teal-50'}`}
      style={{ width: size, height: size, minWidth: 52 }} data-rt-card={id} data-v={v}>
      {drag ? (
        <DraggableObject drag={drag} id={id} label={label} className="block w-full flex-1 rounded-t-xl" heldClassName="ring-2 ring-indigo-500 shadow-lg">{body}</DraggableObject>
      ) : <div className="w-full flex-1">{body}</div>}
      {flippable ? (
        <button type="button" onClick={onFlip} aria-label={k('signAria', { v: minus(v) })} data-rt-sign={id}
          className={`mb-1 inline-flex h-7 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-black ${neg ? 'border-rose-400 bg-rose-100 text-rose-800' : 'border-teal-400 bg-teal-100 text-teal-800'} ${ring}`}>
          <bdi dir="ltr">{neg ? '−' : '+'}</bdi>
        </button>
      ) : (
        <span aria-hidden="true" className={`mb-1 inline-flex h-6 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${neg ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'}`}><bdi dir="ltr">{neg ? '−' : '+'}</bdi></span>
      )}
    </div>
  );
}

function Lab({ lab, setLab, k, width, screenH, advanced, lead }) {
  const uid = `rt${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const free = L.isFree(lab);
  const task = L.taskOf(lab);
  const wide = width >= WIDE_MIN;
  const last = lab.last;
  const done = L.taskDone(lab);
  const board = L.boardNow(lab);
  const fixed = !free && task.kind !== 'goal';
  const predictStage = L.isPredictStage(lab);
  const squareW = lab.world === 'square';

  /* ── le robot rejoue ── */
  const stops = L.stopsOf(lab);
  const values = L.programmeValues(lab);
  const [anim, setAnim] = useState(null);
  const lenRef = useRef(0);
  lenRef.current = stops.length;
  const lastKey = lab.trials.length;
  useEffect(() => {
    if (!lab.last || lab.last.kind === 'claim' || lenRef.current === 0) return undefined;
    if (reduced()) { setAnim(null); return undefined; }
    let i = 0;
    setAnim({ i: 0 });
    const every = Math.max(110, Math.min(380, Math.floor(2400 / lenRef.current)));
    const id = setInterval(() => {
      i += 1;
      if (i >= lenRef.current) { clearInterval(id); setAnim(null); } else setAnim({ i });
    }, every);
    return () => clearInterval(id);
  }, [lastKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const idx = anim ? anim.i : stops.length;
  const pos = idx === 0 ? 1 : L.num(L.text(stops[idx - 1].value));
  const scale = L.scaleFor(free ? { kind: 'goal', placed: [], tray: ['10', '10', '10'], need: 3, flag: '1' } : task);
  const M = free ? 40 : scale.max;
  const tick = free ? 5 : scale.tick;
  const labelEvery = free ? 10 : scale.label;
  const jumpList = [];
  {
    let from = 1;
    stops.slice(0, idx).forEach((st) => {
      const to = L.num(L.text(st.value));
      if (st.jumped) jumpList.push({ from, to, n: jumpList.length + 1 });
      from = to;
    });
  }
  const arcs = jumpList.slice(0, 4);
  const settled = idx >= stops.length;

  /* ── la consigne ── */
  const flagText = task.flag != null ? minus(L.text(task.flag)) : '';
  const context = (() => {
    if (free) return k('context.free');
    if (squareW) return k('context.square');
    if (task.kind === 'predict') return k('context.predict');
    if (task.kind === 'repeat') return k('context.repeat', { v: minus(L.text(task.card)) });
    return k('context.goal');
  })();
  const question = (() => {
    if (free) return k('question.free');
    if (task.kind === 'sqNeg') return k('question.sqNeg');
    if (task.kind === 'sqVal') return k('question.sqVal', { target: iso(L.text(task.target)) });
    if (task.kind === 'predict') return k('question.predict');
    if (task.kind === 'repeat') return lab.predicted ? k('question.repeatPlay', { target: iso(minus(L.text(task.goals.find((g) => !lab.solved[lab.ti]?.reached?.[g]) ?? task.goals.at(-1)))) }) : k('question.repeatPredict', { v: minus(L.text(task.card)), n: task.predictN });
    if (task.at) return k('question.order', { target: iso(flagText) });
    if (task.flip) return k(task.minNeg ? 'question.flipMin' : 'question.flip', { target: iso(flagText) });
    return k('question.place', { target: iso(flagText) });
  })();
  const steps = lab.tasks.length > 1 && !free && (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      <span className="text-xs font-black text-indigo-900/60" aria-hidden="true">{k('stepsLabel')}</span>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti;
        return (
          <span key={tk.id} role="listitem" data-rt-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-indigo-600 bg-indigo-600 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-indigo-100 bg-white text-indigo-400'}`}>
            {d && !cur ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : <bdi dir="ltr">{i + 1}</bdi>}
          </span>
        );
      })}
      {task.flag != null && (
        <span data-rt-chip className="ms-2 inline-flex items-center gap-1 rounded-full border-2 border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-black text-rose-900">
          {k('flagChip')} <bdi dir="ltr">{flagText}</bdi>
        </span>
      )}
    </div>
  );
  const lit = !free && done;
  const prompt = (
    <PromptCard size={wide ? 'lg' : 'md'} aside={steps || null} context={lead && !free ? lead : context} contextProps={{ 'data-rt-context': free ? 'free' : (task.kind ?? 'goal') }}
      title={question} titleClassName={wide ? 'text-xl' : 'text-lg'} lamp={free ? null : lit ? 'on' : 'off'}
      titleProps={{ 'data-rt-prompt': free ? 'free' : (task.kind ?? 'goal'), 'data-lit': lit ? 'true' : 'false' }} />
  );

  /* ── le tapis ── */
  const matW = Math.max(320, Math.min(width, 760));
  const matH = wide ? 196 : 170;
  const onTarget = !free && last && last.ok;
  const mood = !last ? 'neutral' : onTarget ? 'proud' : (last.negatives > 0 || last.negative) ? 'wonder' : 'neutral';
  const stopNow = L.finalValue(lab);
  const offNow = Math.abs(L.num(L.text(stopNow))) > M * 1.04 && settled && stops.length > 0;
  const mat = (
    <LabCard className="overflow-hidden p-0" data-rt-stage>
      <MatArt uid={uid} width={matW} height={matH} max={M} tick={tick} label={labelEvery}
        flag={free || task.flag == null ? null : L.num(task.flag)} pos={Math.max(-M * 1.04, Math.min(M * 1.04, pos))}
        stopText={minus(L.text(stopNow))} jumps={arcs} showArcs={!(advanced && stops.length === 0)} offLabel={offNow ? minus(L.text(stopNow)) : null}
        words={{ neg: k('negSide'), pos: k('posSide') }} mood={mood} glow={!!onTarget && settled}
        ariaLabel={k('matAria', { stop: minus(L.text(stops.length ? stops[idx > 0 ? idx - 1 : 0].value : 1)) })} />
    </LabCard>
  );

  /* ── la ligne du produit courant ── */
  const showLine = free || !advanced || (task.kind === 'predict' && lab.pred.ran) || (task.kind === 'repeat' && lab.predicted);
  const lineValues = task.kind === 'repeat' && !free ? [L.programmeValues(lab)[0]] : values.slice(0, idx);
  const lineTex = task.kind === 'repeat' && !free
    ? L.lineTex(lineValues, { n: lab.predicted ? lab.n : task.predictN, unit: task.unit })
    : (idx === 0 ? '1' : L.lineTex(lineValues));
  const line = showLine && (stops.length > 0 || !predictStage) && (
    <p className="text-center text-base font-bold text-slate-800" dir="ltr" data-rt-line><MathText>{`$${lineTex}$`}</MathText></p>
  );

  /* ── le glisser ── */
  const [notice, setNotice] = useState(null);
  const cardOf = (id) => [...board.slots, ...board.tray].find((c) => c && c.id === id);
  const accepts = (src, zone) => {
    const c = cardOf(src);
    if (!c || !L.canMove(lab, c)) return '';
    if (zone === 'tray') return true;
    const i = Number(zone.split('-')[1]);
    const occ = board.slots[i];
    if (occ && !L.canMove(lab, occ)) return 'locked';
    const fromTray = board.tray.some((x) => x.id === src);
    if (!free && !occ && fromTray && L.programmeOf(board).length >= task.need) return 'full';
    return true;
  };
  const drag = useDragInteraction({
    accepts,
    onDrop: (src, zone) => { setNotice(null); setLab((s) => L.place(s, src, zone === 'tray' ? 'tray' : Number(zone.split('-')[1]))); },
    onReject: (src, zone, reason) => setNotice(reason ? { key: `refuse.${reason}` } : null),
  });
  const heldCard = drag.held ? cardOf(drag.held) : null;

  const fixedCards = (() => {
    if (!fixed) return null;
    if (task.kind === 'predict') return task.cards.map((v, i) => ({ id: `f${i}`, v: L.text(v) }));
    if (task.kind === 'repeat') return [{ id: 'f0', v: L.text(task.card) }];
    const a = L.text(lab.a);
    return [{ id: 'f0', v: a }, { id: 'f1', v: a }];
  })();

  const slotCount = fixed ? fixedCards.length : free ? L.SLOTS : Math.max(2, task.need);
  const nBoxes = slotCount + (task.kind === 'repeat' && !free ? 1 : 0);
  const split = width >= SPLIT_MIN;
  const colW = split ? Math.floor((width - 10) / 2) : width;
  const cell = Math.max(56, Math.min(84, Math.floor((colW - 44 - (nBoxes - 1) * 6) / nBoxes) - 8));
  const slotBox = (i) => {
    const c = free || !fixed ? board.slots[i] : fixedCards[i];
    const movable = !!c && !fixed && L.canMove(lab, c);
    return (
      <DropZone key={i} drag={drag} id={`slot-${i}`} label={k('slotAria', { i: i + 1 })} disabled={fixed} tone="indigo" minHeight="min-h-0"
        className="flex shrink-0 items-center justify-center p-1" style={{ width: cell + 8, height: cell + 8 }} data-rt-slot={i}>
        {c && (
          <Tile v={c.v} size={cell} id={c.id} k={k} drag={movable ? drag : null} label={k('cardAria', { v: minus(c.v) })}
            flippable={!fixed && L.canFlip(lab)} onFlip={() => setLab((s) => L.flip(s, c.id))} />
        )}
      </DropZone>
    );
  };
  const programBody = (
    <div className="space-y-1" data-rt-program>
      <p className="text-center text-[12px] font-black text-indigo-950">{k('programTitle')}</p>
      <div className="flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
        {Array.from({ length: slotCount }, (_, i) => slotBox(i))}
        {task.kind === 'repeat' && !free && (
          <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-300 bg-rose-50 px-2 text-center" style={{ minWidth: cell + 8, height: cell + 8 }} data-rt-repeat-card>
            <bdi dir="ltr" className="text-lg font-black text-slate-900">{minus(L.text(task.unit))}</bdi>
            <bdi dir="ltr" className="text-sm font-black text-rose-800">× {lab.predicted ? lab.n : task.predictN}</bdi>
          </div>
        )}
      </div>
    </div>
  );
  const hasTray = !fixed && (board.tray.length > 0 || task.tray?.length > 0 || free);
  const tray = hasTray && (
    <div className="space-y-1 border-t border-indigo-100 pt-2" data-rt-tray>
      <p className="text-center text-[12px] font-black text-indigo-950">{k('trayTitle')}</p>
      <DropZone drag={drag} id="tray" label={k('trayAria')} tone="slate" minHeight="min-h-0" className="flex flex-wrap items-center justify-center gap-2 p-1.5" style={{ minHeight: cell + 14 }}>
        {board.tray.map((c) => (
          <Tile key={c.id} v={c.v} size={cell} id={c.id} k={k} drag={L.canMove(lab, c) ? drag : null} label={k('cardAria', { v: minus(c.v) })}
            flippable={L.canFlip(lab)} onFlip={() => setLab((s) => L.flip(s, c.id))} />
        ))}
        {board.tray.length === 0 && <span className="text-xs font-bold text-slate-400">{k('trayEmpty')}</span>}
      </DropZone>
    </div>
  );
  const program = <LabCard className="space-y-2 p-2">{programBody}{tray}</LabCard>;

  /* ── les commandes d'une mission ── */
  const sides = predictStage && !free && (
    <LabCard className="space-y-2 p-2" data-rt-sides>
      <p className="text-center text-[12px] font-black text-indigo-950">{k('sideTitle')}</p>
      <ChoiceTray cols={2}>
        <ChoiceCard size="md" state={lab.pred.side === 'left' ? 'selected' : 'idle'} aria-pressed={lab.pred.side === 'left'} disabled={lab.pred.ran}
          onClick={() => setLab((s) => L.chooseSide(s, 'left'))} data-rt-left>{k('left')}</ChoiceCard>
        <ChoiceCard size="md" state={lab.pred.side === 'right' ? 'selected' : 'idle'} aria-pressed={lab.pred.side === 'right'} disabled={lab.pred.ran}
          onClick={() => setLab((s) => L.chooseSide(s, 'right'))} data-rt-right>{k('right')}</ChoiceCard>
      </ChoiceTray>
      <div data-rt-dist>
        <StepperCard layout="row" value={lab.pred.dist == null ? '؟' : L.text(lab.pred.dist)} unit={null}
          onLess={() => setLab((s) => L.setDist(s, (s.pred.dist ?? 0) - 1))} onMore={() => setLab((s) => L.setDist(s, (s.pred.dist ?? 0) + 1))}
          lessDisabled={lab.pred.ran || (lab.pred.dist ?? 0) <= 0} moreDisabled={lab.pred.ran || (lab.pred.dist ?? 0) >= 40}
          lessLabel={k('distLess')} moreLabel={k('distMore')} lessProps={{ 'data-rt-dist-less': '' }} moreProps={{ 'data-rt-dist-more': '' }}
          readoutProps={{ 'data-rt-dist-value': lab.pred.dist ?? '' }}>
          <div className="flex shrink-0 flex-col gap-1" dir="ltr">
            <button type="button" disabled={lab.pred.ran} onClick={() => setLab((s) => L.setDist(s, (s.pred.dist ?? 0) + 5))} data-rt-dist-more5
              className={`min-h-[22px] rounded-full border-2 border-indigo-200 bg-white px-2 text-xs font-black text-indigo-900 disabled:opacity-40 ${ring}`}>+5</button>
            <button type="button" disabled={lab.pred.ran} onClick={() => setLab((s) => L.setDist(s, (s.pred.dist ?? 0) - 5))} data-rt-dist-less5
              className={`min-h-[22px] rounded-full border-2 border-indigo-200 bg-white px-2 text-xs font-black text-indigo-900 disabled:opacity-40 ${ring}`}>−5</button>
          </div>
        </StepperCard>
        <p className="mt-0.5 text-center text-[11px] font-extrabold text-indigo-900/60">{k('distTitle')}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        {!lab.pred.ran && (
          <button type="button" onClick={() => setLab(L.runPredict)} disabled={!L.canRun(lab)} data-rt-run
            className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-indigo-700 bg-indigo-600 px-6 text-base font-black text-white shadow-[0_3px_0_0_#3730A3] disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none ${ring}`}>
            <Play className="h-5 w-5" aria-hidden="true" /> {k('run')}
          </button>
        )}
        {lab.pred.ran && !done && (
          <button type="button" onClick={() => setLab(L.retryPredict)} data-rt-retry
            className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-amber-500 bg-amber-100 px-6 text-base font-black text-amber-900 ${ring}`}>
            <Undo2 className="h-5 w-5" aria-hidden="true" /> {k('retry')}
          </button>
        )}
      </div>
    </LabCard>
  );
  const repeatCtl = !free && task.kind === 'repeat' && lab.predicted && (
    <div data-rt-repeat>
      <StepperCard layout="row" value={lab.n} unit={null}
        onLess={() => setLab((s) => L.setN(s, s.n - 1))} onMore={() => setLab((s) => L.setN(s, s.n + 1))}
        lessDisabled={lab.n <= L.N_RANGE[0]} moreDisabled={lab.n >= L.N_RANGE[1]} lessLabel={k('nLess')} moreLabel={k('nMore')} />
      <p className="mt-0.5 text-center text-[11px] font-extrabold text-indigo-900/60">{k('nTitle')}</p>
    </div>
  );
  const squareCtl = !free && squareW && (
    <LabCard className="space-y-2 p-2">
      <div data-rt-a>
        <StepperCard layout="row" value={L.text(lab.a)} unit={null}
          onLess={() => setLab((s) => L.stepA(s, -1))} onMore={() => setLab((s) => L.stepA(s, 1))}
          lessDisabled={lab.a <= L.A_RANGE[0]} moreDisabled={lab.a >= L.A_RANGE[1]} lessLabel={k('aLess')} moreLabel={k('aMore')} />
        <p className="mt-0.5 text-center text-[11px] font-extrabold text-indigo-900/60">{k('aTitle')}</p>
      </div>
      {task.kind === 'sqNeg' && (
        <div className="flex justify-center">
          <button type="button" onClick={() => setLab(L.claimImpossible)} data-rt-impossible data-ready={L.canClaim(lab) || done ? 'true' : 'false'}
            className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 px-6 text-base font-black ${done ? 'border-emerald-500 bg-emerald-100 text-emerald-900' : L.canClaim(lab) ? 'border-rose-600 bg-rose-600 text-white shadow-[0_3px_0_0_#9F1239]' : 'border-slate-300 bg-slate-100 text-slate-500'} ${ring}`}>
            <Ban className="h-5 w-5" aria-hidden="true" /> {k('impossible')}
          </button>
        </div>
      )}
    </LabCard>
  );

  /* ── le verdict ── */
  const calc = (() => {
    if (squareW && !free) return iso(L.lineText([L.text(lab.a), L.text(lab.a)]));
    if (task.kind === 'repeat' && !free) {
      const n = lab.predicted ? lab.n : task.predictN;
      const u = `(${minus(L.text(task.unit))})`;
      return iso(n <= 2 ? L.lineText(values) : `1 × ${L.text(task.card)} × ${u} × … × ${u} = ${L.text(L.finalValue(lab))}`);
    }
    return iso(L.lineText(values));
  })();
  const verdictLine = (() => {
    if (!last) {
      if (predictStage) return k('idle.predict');
      if (squareW && !free) return k('idle.square');
      if (!free && task.kind === 'repeat') return k('idle.repeat');
      return k(task.flip ? 'idle.flip' : 'idle.place');
    }
    const stop = iso(minus(last.stop ?? ''));
    if (last.kind === 'claim') return last.ok ? k('v.claimRight') : k('v.claimEarly');
    if (last.kind === 'square') return k('v.square', { a: iso(minus(L.text(last.a))), calc, stop: iso(minus(last.stop)) });
    if (last.kind === 'predict') return last.ok ? k('v.predictRight', { calc }) : k(last.sideOk ? 'v.predictDist' : 'v.predictSide', { calc, stop });
    if (last.free) return k('v.free', { calc, stop });
    if (task.kind === 'repeat') return k('v.repeat', { n: lab.n, calc, stop });
    if (last.ok) return k('v.right', { calc, neg: last.negatives });
    if (last.reason === 'incomplete') return k('v.incomplete', { calc });
    if (last.reason === 'constraint') return k(task.minNeg ? 'v.constraintNeg' : 'v.constraintAt', { calc, stop, neg: last.negatives, flag: iso(flagText) });
    if (task.at) return k('v.at', { calc, probe: iso(minus(last.probe ?? '')), flag: iso(flagText) });
    return k(last.reason === 'side' ? 'v.side' : 'v.distance', { calc, stop, flag: iso(flagText) });
  })();
  const noticeLine = notice ? k(notice.key) : null;
  const vkey = !last ? '' : last.free ? 'free' : last.ok ? 'right' : (last.reason === 'incomplete' ? '' : 'wrong');
  const tone = !last ? 'indigo' : last.ok && !last.free ? 'emerald' : 'amber';
  const Icon = !last ? Hand : last.ok && !last.free ? CheckCircle2 : Sparkles;
  const canNext = L.canNext(lab);
  const banner = (
    <VerdictBanner tone={tone} icon={Icon} size="sm" className="min-h-[3.5rem]" data-rt-verdict={vkey}>
      <div className="min-w-0 space-y-1.5">
        <p className={last ? '' : 'font-bold text-indigo-900'}>{noticeLine ?? verdictLine}</p>
        {canNext && (
          <button type="button" onClick={() => { setNotice(null); setLab(L.nextTask); }} data-rt-next
            className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-emerald-600 bg-emerald-600 px-3.5 text-sm font-black text-white shadow-[0_3px_0_0_#047857] transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`}>
            {k('next')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </VerdictBanner>
  );

  /* ── le سجلّ ── */
  const rows = L.recordRows(lab);
  const record = (
    <LabCard className="overflow-hidden p-0" data-rt-record>
      <p className="bg-indigo-50 px-2 py-1 text-center text-[12px] font-black text-indigo-950">{k('record.title')}</p>
      <table className="w-full table-fixed text-center text-[13px] font-bold text-slate-800">
        <thead>
          <tr className="text-[11px] text-indigo-900/70"><th className="w-[68%] py-0.5">{k('record.program')}</th><th>{k('record.neg')}</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={2} className="py-1 text-slate-400">—</td></tr>}
          {rows.map((x, i) => (
            <tr key={x.sig} data-rt-row={i} className="border-t border-indigo-50">
              <td className="py-0.5"><bdi dir="ltr">{minus(task.kind === 'repeat' && x.n ? `${L.text(task.card)} × (−1) × ${x.n} = ${x.stop}` : L.lineText(x.values))}</bdi></td>
              <td><bdi dir="ltr">{x.negText}</bdi></td>
            </tr>
          ))}
        </tbody>
      </table>
    </LabCard>
  );

  const ctls = !fixed || predictStage || task.kind === 'repeat' || squareW;
  return (
    <>
      <div className="relative space-y-2.5" data-rt-glance>
        {prompt}
        {mat}
        {line}
        <div className={split ? 'grid grid-cols-2 items-start gap-2.5' : 'space-y-2.5'}>
          <div className="min-w-0 space-y-2.5">
            {program}
            {ctls && (sides || repeatCtl || squareCtl) && <div className="mx-auto w-full" style={{ maxWidth: 460 }}>{sides}{repeatCtl}{squareCtl}</div>}
          </div>
          <div className="min-w-0 space-y-2.5">
            {banner}
            {record}
          </div>
        </div>
      </div>
      <FreeCard lab={lab} setLab={setLab} k={k} />
      <DragGhost ghost={drag.ghost}>{heldCard && <Tile v={heldCard.v} size={cell} id="ghost" k={k} flippable={false} />}</DragGhost>
    </>
  );
}

/* ══════════════ « جرّب أعدادك أنت » : toujours ouvert ══════════════ */

function FreeCard({ lab, setLab, k }) {
  const free = L.isFree(lab);
  const [text, setText] = useState('');
  const clean = (v) => v.replace(/[^0-9٠-٩\-−,٫.]/g, '').slice(0, 5);
  const bad = text !== '' && L.parseFactor(text) == null;
  const full = free && lab.free.tray.length + lab.free.slots.filter(Boolean).length >= L.SLOTS;
  const add = () => { if (L.parseFactor(text) != null && !full) { setLab((s) => L.addFree(s, text)); setText(''); } };
  return (
    <LabCard className="space-y-2 border-emerald-200 bg-emerald-50/50 p-3" data-rt-free data-active={free ? 'true' : 'false'}>
      <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {k('free.title')}</p>
      <p className="text-xs font-bold leading-snug text-slate-600">{free ? k('free.on') : k('free.hint')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-black text-indigo-950">
          {k('free.factor')}
          <input type="text" inputMode="decimal" autoComplete="off" dir="ltr" value={text} maxLength={5} aria-label={k('free.aria')} aria-invalid={bad} data-rt-free-input
            onChange={(e) => setText(clean(e.target.value))} onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
            className={`h-11 w-24 rounded-xl border-2 ${bad ? 'border-rose-300' : 'border-emerald-300'} bg-white px-3 text-center text-xl font-black tabular-nums text-indigo-950 ${ring}`} />
        </label>
        <button type="button" onClick={add} disabled={text === '' || bad || full} data-rt-free-add
          className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-600 bg-emerald-600 px-4 text-sm font-black text-white disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400 ${ring}`}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" /> {k('free.add')}
        </button>
        {free && (
          <>
            <button type="button" onClick={() => setLab(L.clearFree)} data-rt-free-clear
              className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-900 ${ring}`}>
              <Eraser className="h-4 w-4" aria-hidden="true" /> {k('free.clear')}
            </button>
            <button type="button" onClick={() => setLab(L.toGuided)} data-rt-free-back
              className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-900 ${ring}`}>
              <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('free.back')}
            </button>
          </>
        )}
        {bad && <span className="text-xs font-bold text-rose-700">{k('free.bad')}</span>}
        {full && <span className="text-xs font-bold text-slate-600">{k('free.full')}</span>}
      </div>
    </LabCard>
  );
}
