import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hand, CheckCircle2, Sparkles, ChevronLeft, FlaskConical, Undo2, RotateCcw } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import * as G from '@smarter-academy/core/arithmetic/graphs3.js';
import * as Lin from '@smarter-academy/core/arithmetic/linear.js';
import MathText from '../../components/MathText';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import { LabCard, StageFrame, PromptCard, VerdictBanner } from '../primitives/LabKit';
import KidFigure from '../primitives/KidFigure';
import { useLabCoach } from '../primitives/LabCoach';
import { LEVELS } from '../levels';
import * as L from '../logic/pinRails';

/**
 * pin-rails — LA PUNAISE SUR SA RAINURE ET LA RÈGLE SUR DEUX NŒUDS : « سكك الدبابيس » (3AM, unité 6 « التناسبية », درس « التناسبية والتمثيل البياني »,
 * 2026-10-21). La logique, exacte, est dans `logic/pinRails.js` (sur `packages/core/arithmetic/graphs3.js`, importé par chemin). Distinct de `origin-line`
 * (4AM : une droite ÉPINGLÉE à O dont on fait varier la pente, des points imposés sur y = ax) : ici les points viennent d'un TABLEAU de prix (ou d'une photo),
 * la main LÈVE chaque punaise à son prix puis POSE une règle sur deux nœuds de son choix — et c'est ce que la règle touche qui juge la situation.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. La main GLISSE une punaise le long de la rainure de sa colonne (glisser, flèches, Page ↑↓, Entrée), pose les deux extrémités d'une règle sur des
 *    nœuds (O ou une punaise : glisser l'extrémité vers le nœud, ou flèches puis Entrée), et — en متقدم — LÂCHE une punaise de lecture sur la droite.
 * B. Un tableau de prix est un nuage de points du repère ; il est PROPORTIONNEL ⇔ tous ses points sont sur UNE droite qui passe par O.
 * C. La règle touche (vert) les nœuds de sa droite ; les autres s'écartent (orange) de l'écart en ordonnée ; O reste dehors si la droite coupe l'axe
 *    ailleurs qu'en 0 (« تقطع المحور عند 10 »). La punaise lâchée au mauvais prix retombe avec le prix du tableau.
 * D. Chaque lâcher est un essai : la punaise (colonne, ordonnée, sens de l'erreur), la règle (extrémités, nœuds touchés, O touché, ordonnée à l'origine),
 *    la lecture (point, sens de l'erreur, coefficient).
 * E. À découvrir : « une règle touche tout » est réfutée par SA règle qui manque une punaise ; « tout toucher suffit » par SA règle qui touche les quatre
 *    punaises mais laisse O dehors.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        une situation de proportionnalité a pour représentation des points alignés AVEC O ; y = a·x (a lu à l'abscisse 1)
 *   OBJECT         un tableau de prix de boîtes de punaises → un repère sur une planche de liège, des punaises, une règle de laiton, une vendeuse (KidFigure, hijab)
 *   VARIABLE       l'ordonnée de chaque punaise (la main sur sa rainure) ; les deux nœuds qui tiennent la règle ; en lecture, la position du dernier point
 *   INVARIANT      O (il reste un nœud de la règle, jamais déplacé) ; le tableau (la punaise retombe) ; le cadre
 *   TRANSFORMATION la règle se déplace d'un couple de nœuds à l'autre ; chaque punaise passe de l'axe à son prix
 *   CONSTRAINT     une règle a deux extrémités DIFFÉRENTES ; la règle ne s'ouvre que lorsque les points sont posés ; une lecture se lâche sur la droite
 *   RESISTANCE     une punaise au mauvais prix retombe (le tableau fait foi) ; une règle manque ce qu'elle manque, l'écart écrit ; la lecture hors de la droite refusée
 *   EVIDENCE       les nœuds verts / orange, l'écart, « تقطع المحور عند … », le point lu et le coefficient
 *   CONTRAST       une règle par O qui touche tout / alignée sans O / brisée ; la lecture à 1, à 7 et à une masse donnée
 *   PREDICTION     le choix des deux nœuds avant de lâcher (chaque pose est un essai jugé)
 *   DISCOVERY      « ماذا لاحظتَ على مسطرتك في المحلات الثلاثة؟ »
 *   FORMALIZATION  points alignés avec O ⇔ situation proportionnelle ; y = a·x
 *   TRANSFER       « جرّب أعدادك » (son prix a et ses frais b, toujours ouvert), les exercices et la banque
 *
 * « جرّب كل الإمكانيات » : NON (chaque lâcher EST l'essai). « جرّب أعدادك » est TOUJOURS ouvert sous le labo.
 * D'UN SEUL REGARD (§8bis) : `[data-pr-glance]` enveloppe la consigne, le repère, la lecture et le verdict ; la hauteur du repère vient de l'écran de leçon.
 * ONBOARDING : `coach` (défaut true) → `LabCoach` ; `logic/pinRails.js › coachOf` (pin · rod · again · read · next), la bulle SOUS le repère de travail.
 * Props : `tasks` ([{ mode, shop, xs, rule, frame, ask }]), `level`, `levels`, `coach`, `title`, `lead`, `onTrial(event)`, `onFinished()` — par `state.report`.
 * CONTRAT DOM : [data-pin-rails][data-task][data-mode][data-kind][data-solved][data-layout], [data-pr-glance], [data-pr-stage], [data-pr-plane], [data-pr-pin=<col>]
 * [data-y][data-placed], [data-pr-node=<id>][data-hit], [data-pr-rod][data-full], [data-pr-end=<0|1>][data-node], [data-pr-read], [data-pr-table], [data-pr-readout],
 * [data-pr-verdict], [data-pr-next], [data-pr-reset], [data-pr-step=<i>], [data-pr-free][data-active], [data-pr-free-a], [data-pr-free-b], [data-pr-free-back],
 * [data-pr-formal].
 */
const NS = 'manipulation.pinRails';
const LRI = '⁦';
const PDI = '⁩';
const iso = (s) => `${LRI}${s}${PDI}`;
const WIDE_MIN = 700;
const SIDE_W = 236;
const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-300';
const COL = { ok: '#059669', gap: '#D97706', pin: '#2563EB', end0: '#0284C7', end1: '#E11D48', rod: '#B45309', read: '#7C3AED', axis: '#78350F', grid: '#E9DDBA' };

const CSS = `
@keyframes pr-pop { 0% { transform: scale(0.8); } 70% { transform: scale(1.06); } 100% { transform: scale(1); } }
.pr-pop { animation: pr-pop 280ms ease-out both; display: inline-block; }
@keyframes pr-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
.pr-shake { animation: pr-shake 260ms ease-in-out; }
@keyframes pr-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
.pr-pulse { animation: pr-pulse 1.2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .pr-pop, .pr-shake, .pr-pulse { animation: none !important; } }
`;

export function numbersFor({ tasks, level }) {
  const lv = resolveLevelId(level ?? 'beginner');
  const asked = LEVELS['pin-rails'][lv].numbers;
  return { tasks: tasks ?? asked.tasks };
}

const n = (v) => Lin.toNumber(v);
const tx = (v) => G.text(v);
/** Un nombre du dessin (flottant) écrit à la virgule, sans bruit d'arrondi. */
const tn = (v) => G.text(Lin.parseNumber(String(Math.round(v * 1000) / 1000)));

export default function PinRails({
  tasks, title, lead, level, levels: withLevels = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ tasks, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'pin-rails', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
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
    if (!finishedOnce.current) { finishedOnce.current = true; state.report(onFinished, {}); }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  const reported = useRef(0);
  const nTrials = lab.trials.length;
  useEffect(() => {
    if (nTrials < reported.current) reported.current = 0;
    for (let i = reported.current; i < nTrials; i += 1) state.report(onTrial, L.trialEvidence(lab.trials[i]));
    reported.current = nTrials;
  }, [nTrials, lab.trials]); // eslint-disable-line react-hooks/exhaustive-deps

  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'pin-rails', step: coachStep,
    text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });

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

  const discovery = (
    <ManipulationDiscovery state={state} prompt={<MathText>{k('discovery.prompt')}</MathText>}
      options={discoveryOptions(lab, k)} formal={<Formal lab={lab} k={k} />} />
  );
  const task = L.taskOf(lab);

  return (
    <ManipulationShell
      type="pin-rails"
      title={title ?? k('title')}
      titleHidden
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      coach={coachOn ? coach : null}
      hints={[0, 1, 2].map((i) => k(`hints.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={discovery}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-amber-50/60 to-white">
        <div ref={boxRef} className="space-y-2" data-pin-rails data-task={lab.ti} data-mode={task.mode} data-kind={task.kind}
          data-solved={ready ? 'true' : 'false'} data-layout={width >= WIDE_MIN ? 'wide' : 'narrow'}>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <Lab lab={lab} setLab={setLab} k={k} width={width} screenH={screenH} lead={state.isAuthoredLevel ? lead : null} />
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ Le laboratoire ══════════════ */

function Lab({ lab, setLab, k, width, screenH, lead }) {
  const wide = width >= WIDE_MIN;
  const free = L.isFree(lab);
  const task = L.taskOf(lab);
  const last = lab.last;
  const done = L.taskDone(lab);
  const lit = !free && done;
  const showTable = task.mode === 'plot';

  const key = free ? 'free' : task.shop;
  const ctx = lead || k(`context.${key}`, free ? { a: iso(lab.free.a.replace('.', ',')), b: iso(lab.free.b) } : {});
  const question = k(`question.${key}`, free ? {} : { x: iso(task.ask ? tx(task.ask.value) : ''), y: iso(task.ask ? tx(task.ask.value) : '') });
  const steps = lab.tasks.length > 1 && !free && (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti;
        return (
          <span key={tk.id} role="listitem" data-pr-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-amber-600 bg-amber-500 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-amber-100 bg-white text-amber-500'}`}>
            <bdi dir="ltr">{i + 1}</bdi>
          </span>
        );
      })}
    </div>
  );
  const prompt = (
    <PromptCard size={wide ? 'lg' : 'md'} context={<MathText>{ctx}</MathText>} contextProps={{ 'data-pr-context': key }}
      title={<MathText>{question}</MathText>} titleClassName={wide ? 'text-xl' : 'text-lg'} lamp={free ? null : lit ? 'on' : 'off'}
      titleProps={{ 'data-pr-prompt': key, 'data-lit': lit ? 'true' : 'false' }} />
  );

  const vv = verdictOf(lab, k);
  const canNext = L.canNext(lab);
  const mood = !last ? 'happy' : last.ok === false || last.kind === 'refused' ? 'wonder' : last.full || last.ok ? 'proud' : 'happy';
  const tone = !last ? 'indigo' : last.ok === true || last.full ? 'emerald' : 'amber';
  const Icon = !last ? Hand : tone === 'emerald' ? CheckCircle2 : Sparkles;
  const banner = (
    <VerdictBanner tone={tone} icon={wide ? Icon : null} size="sm" className="min-h-[3.5rem]" data-pr-verdict={last ? (last.kind === 'refused' ? 'refused' : last.ok === false ? last.why : last.kind === 'rod' ? (last.full ? 'full' : last.pinsHit ? 'offO' : 'miss') : 'ok') : ''}>
      <div className="min-w-0 space-y-1.5">
        <p className={last ? '' : 'font-bold text-indigo-900'}>{vv}</p>
        {canNext && (
          <button type="button" onClick={() => setLab(L.nextTask)} data-pr-next
            className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-emerald-600 bg-emerald-600 px-3.5 text-sm font-black text-white shadow-[0_3px_0_0_#047857] transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`}>
            {k('next')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </VerdictBanner>
  );

  const colW = (wide ? width - SIDE_W - 12 : width) - 28;
  const tableRow = showTable && colW < 560; // colonne étroite : le tableau passe SOUS le repère, en deux lignes
  const stageW = colW - (showTable && !tableRow ? 104 : 0);
  const planeH = Math.max(200, Math.min(380, Math.floor(screenH - 500)));
  const reading = L.rodReading(lab);
  const chip = (
    <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-2.5 py-1" data-pr-readout data-count={reading ? reading.count : ''} aria-live="polite">
      <span className="whitespace-nowrap text-[11px] font-extrabold text-amber-800">{task.mode === 'read' ? k('read.reading') : !reading && task.mode === 'plot' && !L.allPlaced(lab) ? k('read.pins') : k('read.touched')}</span>
      <span key={`${lab.rod.join('-')}-${lab.pins.filter(Boolean).length}-${lab.readPos}`} className="pr-pop whitespace-nowrap text-sm font-black text-indigo-950" dir="ltr">
        {task.mode === 'read' ? <bdi dir="ltr">{lab.readPos != null ? `${tx(task.ask.axis === 'x' ? task.ask.value : lab.readPos)} ; ${tx(task.ask.axis === 'x' ? lab.readPos : task.ask.value)}` : '؟'}</bdi>
          : reading ? <bdi dir="ltr">{`${reading.count} / ${reading.total}`}</bdi>
            : task.mode === 'plot' && !L.allPlaced(lab) ? <bdi dir="ltr">{`${lab.pins.filter(Boolean).length} / ${lab.pins.length}`}</bdi> : <bdi>—</bdi>}
      </span>
    </div>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1" data-pr-legend>
      <div className="flex items-center gap-2">
        <p className="text-xs font-extrabold text-amber-900">{k(`legend.${task.mode === 'read' ? 'read' : 'shop'}`)}</p>
        {steps || null}
      </div>
      <div className="flex items-center gap-2">
        {chip}
        {!free && task.mode !== 'read' && (
          <button type="button" onClick={() => setLab(L.restartTask)} data-pr-reset aria-label={k('reset')}
            className={`inline-flex h-9 min-w-[44px] items-center justify-center gap-1 rounded-full border-2 border-amber-200 bg-white px-2 text-xs font-black text-amber-900 ${ring}`}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
  const board = (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1"><Plane lab={lab} setLab={setLab} k={k} W={Math.max(280, stageW)} H={planeH} /></div>
      {showTable && !tableRow && <PriceTable lab={lab} k={k} layout="col" />}
    </div>
  );
  const board2 = (
    <div className="space-y-1.5">
      {board}
      {tableRow && <PriceTable lab={lab} k={k} layout="row" />}
    </div>
  );
  const side = (
    <>
      <div className="flex items-end gap-2" data-deco aria-hidden="true">
        <svg width="62" height="94" viewBox="0 0 62 94" role="img" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
          <KidFigure cx={31} top={2} foot={92} hairStyle="hijab" scarf="rose" outfit="pink" skin="light" mood={mood} />
        </svg>
      </div>
      {banner}
    </>
  );

  return (
    <>
      <div className="relative space-y-2.5" data-pr-glance>
        {prompt}
        {wide ? (
          <div className="flex items-start gap-3">
            <StageFrame className="min-w-0 flex-1 space-y-1.5 overflow-hidden p-3" data-pr-stage>{header}{board2}</StageFrame>
            <div className="flex shrink-0 flex-col gap-2.5" style={{ width: SIDE_W }}>{side}</div>
          </div>
        ) : (
          <>
            <StageFrame className="min-w-0 space-y-1.5 overflow-hidden p-2" data-pr-stage>{header}{board2}</StageFrame>
            {banner}
          </>
        )}
      </div>
      <FreeCard lab={lab} setLab={setLab} k={k} />
    </>
  );
}

function verdictOf(lab, k) {
  const last = lab.last;
  const task = L.taskOf(lab);
  if (!last) return k(`idle.${task.mode === 'plot' && !L.allPlaced(lab) ? 'plot' : task.mode === 'read' ? 'read' : 'rod'}`);
  if (last.kind === 'refused') return k('v.same');
  if (last.kind === 'pin') {
    return last.ok ? k('v.pinOk', { x: iso(last.x), y: iso(last.y) }) : k(`v.pin_${last.why}`, { x: iso(last.x), y: iso(last.y), want: iso(last.want) });
  }
  if (last.kind === 'read') {
    return last.ok ? k('v.readOk', { x: iso(last.x), y: iso(last.y), a: iso(last.a) }) : k(`v.read_${last.why}`, { x: iso(last.x), y: iso(last.y) });
  }
  const a = { n: iso(last.count), m: iso(last.total), b: iso(last.cuts), gap: iso(last.gap ?? ''), node: iso(last.gapNode ?? '') };
  if (last.full) return k('v.full', a);
  if (last.pinsHit && !last.throughO) return k('v.offO', a);
  return k(last.throughO ? 'v.throughO' : 'v.miss', a);
}

/* ══════════════ Le repère ══════════════ */

/** La droite y = a·x + b découpée dans le cadre [0, xMax] × [0, yMax] : deux extrémités ou null. */
export function clipLine(a, b, xMax, yMax) {
  let x0 = 0;
  let x1 = xMax;
  if (a > 0) { x0 = Math.max(x0, (0 - b) / a); x1 = Math.min(x1, (yMax - b) / a); }
  else if (a < 0) { x0 = Math.max(x0, (yMax - b) / a); x1 = Math.min(x1, (0 - b) / a); }
  else if (b < 0 || b > yMax) return null;
  if (x1 < x0) return null;
  return [[x0, a * x0 + b], [x1, a * x1 + b]];
}

function Plane({ lab, setLab, k, W, H }) {
  const task = L.taskOf(lab);
  const fr = task.frame;
  const xMax = Number(fr.xMax);
  const yMax = Number(fr.yMax);
  const xStep = Number(fr.xStep);
  const yStep = Number(fr.yStep);
  const unit = n(L.unitOf(task));
  const padL = 40; const padR = 16; const padT = 44; const padB = 48;
  const pw = W - padL - padR;
  const ph = H - padT - padB;
  const X = (v) => padL + (v / xMax) * pw;
  const Y = (v) => padT + ph - (v / yMax) * ph;
  const xv = (px) => ((px - padL) / pw) * xMax;
  const yv = (py) => ((padT + ph - py) / ph) * yMax;
  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null); // { kind: 'pin'|'end'|'read', id, px, py, moved }
  const [kb, setKb] = useState(null); // { kind, id, val } — aperçu clavier
  const [focus, setFocus] = useState(null);
  const [shake, setShake] = useState(0);
  const mode = task.mode;
  useEffect(() => { setKb(null); setDrag(null); }, [lab.ti, lab.free]);
  const nodes = L.nodes(lab);
  const reading = L.rodReading(lab);
  const nodeXY = (id) => { const nd = nodes.find((q) => q.id === id); return nd ? [X(n(nd.x)), Y(n(nd.y))] : null; };

  const toPx = (e) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return { px: 0, py: 0 };
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };
  const nearestNode = (px, py, maxD = 30) => {
    let best = null; let bd = maxD;
    for (const nd of nodes) {
      const d = Math.hypot(X(n(nd.x)) - px, Y(n(nd.y)) - py);
      if (d <= bd) { bd = d; best = nd; }
    }
    return best;
  };

  /* ── les gestes au pointeur ── */
  const startPin = (col) => (e) => {
    if (mode !== 'plot' || lab.pins[col] != null || lab.free) return;
    e.preventDefault(); e.stopPropagation();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const { px, py } = toPx(e);
    setDrag({ kind: 'pin', id: col, px, py, moved: false, sx: px, sy: py });
  };
  const startEnd = (end) => (e) => {
    if (mode === 'read' || !L.rodOpen(lab)) return;
    e.preventDefault(); e.stopPropagation();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const { px, py } = toPx(e);
    setDrag({ kind: 'end', id: end, px, py, moved: false, sx: px, sy: py });
  };
  const startRead = (e) => {
    if (mode !== 'read' || L.taskDone(lab)) return;
    e.preventDefault(); e.stopPropagation();
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const { px, py } = toPx(e);
    setDrag({ kind: 'read', id: 0, px, py, moved: false, sx: px, sy: py });
  };
  const bgDown = (e) => {
    // un appui près d'une rainure (loin de toute poignée) saisit la punaise de la colonne la plus proche : des colonnes serrées restent utilisables au doigt
    if (mode !== 'plot' || lab.free) return;
    const { px, py } = toPx(e);
    if (py < Y(yMax) - 6 || py > Y(0) + 8) return;
    let best = null; let bd = 24;
    task.points.forEach((p, col) => { if (lab.pins[col] == null) { const d = Math.abs(X(n(p.x)) - px); if (d <= bd) { bd = d; best = col; } } });
    if (best != null) startPin(best)(e);
  };
  const move = (e) => {
    if (!drag) return;
    const { px, py } = toPx(e);
    setDrag((d) => (d ? { ...d, px, py, moved: d.moved || Math.hypot(px - d.sx, py - d.sy) > 4 } : d));
  };
  const up = (e) => {
    if (!drag) return;
    const { px, py } = toPx(e);
    const d = drag;
    setDrag(null);
    if (!d.moved) return;
    if (d.kind === 'pin') setLab((s) => L.placePin(s, d.id, yv(py)));
    else if (d.kind === 'read') setLab((s) => L.placeRead(s, task.ask.axis === 'x' ? yv(py) : xv(px)));
    else {
      const nd = nearestNode(px, py);
      if (nd) setLab((s) => L.setRodEnd(s, d.id, nd.id));
      else setShake((v) => v + 1);
    }
  };

  /* ── les gestes au clavier ── */
  const keyPin = (col) => (e) => {
    if (mode !== 'plot' || lab.pins[col] != null) return;
    const cur = kb?.kind === 'pin' && kb.id === col ? kb.val : 0;
    const m = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (e.key in m) { e.preventDefault(); setKb({ kind: 'pin', id: col, val: Math.max(0, Math.min(yMax, cur + m[e.key] * unit)) }); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cur > 0) { setLab((s) => L.placePin(s, col, cur)); setKb(null); } }
    else if (e.key === 'Home') { e.preventDefault(); setKb({ kind: 'pin', id: col, val: 0 }); }
  };
  const keyRead = (e) => {
    if (mode !== 'read' || L.taskDone(lab)) return;
    const axis = task.ask.axis;
    const cur = kb?.kind === 'read' ? kb.val : 0;
    const top = axis === 'x' ? yMax : xMax;
    const m = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (e.key in m) { e.preventDefault(); setKb({ kind: 'read', id: 0, val: Math.max(0, Math.min(top, cur + m[e.key] * unit)) }); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cur > 0) setLab((s) => L.placeRead(s, cur)); }
  };
  const keyEnd = (end) => (e) => {
    if (mode === 'read' || !L.rodOpen(lab)) return;
    const ids = nodes.map((q) => q.id);
    const cur = kb?.kind === 'end' && kb.id === end ? kb.val : (lab.rod[end] ?? ids[0]);
    const i = Math.max(0, ids.indexOf(cur));
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setKb({ kind: 'end', id: end, val: ids[(i + 1) % ids.length] }); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setKb({ kind: 'end', id: end, val: ids[(i - 1 + ids.length) % ids.length] }); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const val = kb?.kind === 'end' && kb.id === end ? kb.val : null;
      if (val != null) { setLab((s) => L.setRodEnd(s, end, val)); setKb(null); }
    }
  };

  /* ── le dessin ── */
  const grid = [];
  for (let v = xStep; v <= xMax + 1e-9; v += xStep) grid.push(<line key={`gx${v}`} x1={X(v)} x2={X(v)} y1={Y(0)} y2={Y(yMax)} stroke={COL.grid} strokeWidth={1} />);
  for (let v = yStep; v <= yMax + 1e-9; v += yStep) grid.push(<line key={`gy${v}`} x1={X(0)} x2={X(xMax)} y1={Y(v)} y2={Y(v)} stroke={COL.grid} strokeWidth={1} />);
  const tick = (txt, x, y, anchor, id) => (
    <text key={id} x={x} y={y} textAnchor={anchor} fontSize={10.5} fontWeight={700} fill="#78350F" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{txt}</text>
  );
  const xTicks = []; const yTicks = [];
  for (let v = xStep; v <= xMax + 1e-9; v += xStep) xTicks.push(tick(tn(v), X(v), Y(0) + 26, 'middle', `tx${v}`));
  for (let v = yStep; v <= yMax + 1e-9; v += yStep) yTicks.push(tick(tn(v), X(0) - 7, Y(v) + 3.5, 'end', `ty${v}`));

  const clip = (a, b) => clipLine(a, b, xMax, yMax);
  const rodSeg = reading ? clip(n(reading.line.a), n(reading.line.b)) : null;
  const pinHandle = (col) => {
    const p = task.points[col];
    const placed = lab.pins[col] != null;
    const dragging = drag?.kind === 'pin' && drag.id === col && drag.moved;
    const prev = dragging ? Math.max(0, Math.min(yMax, Math.round(yv(drag.py) / unit) * unit)) : (kb?.kind === 'pin' && kb.id === col ? kb.val : 0);
    const yy = placed ? n(lab.pins[col]) : prev;
    return { p, placed, yy, dragging };
  };
  const endPos = (end) => {
    if (drag?.kind === 'end' && drag.id === end && drag.moved) return [drag.px, drag.py, true];
    const id = kb?.kind === 'end' && kb.id === end ? kb.val : lab.rod[end];
    const xy = id != null ? nodeXY(id) : null;
    if (xy) return [xy[0], xy[1], false];
    return [W - 64 + end * 36, padT / 2 + 1, false];
  };
  const cand = drag?.kind === 'end' && drag.moved ? nearestNode(drag.px, drag.py) : null;
  const kbCand = kb?.kind === 'end' ? nodes.find((q) => q.id === kb.val) : null;

  const readHandle = () => {
    if (mode !== 'read') return null;
    const axis = task.ask.axis;
    const fixed = n(task.ask.value);
    const doneNow = L.taskDone(lab);
    const dragging = drag?.kind === 'read' && drag.moved;
    let v = 0;
    if (doneNow) v = n(lab.readPos);
    else if (dragging) v = axis === 'x' ? Math.round(yv(drag.py) / unit) * unit : Math.round(xv(drag.px) / unit) * unit;
    else if (kb?.kind === 'read') v = kb.val;
    v = Math.max(0, Math.min(axis === 'x' ? yMax : xMax, v));
    const cx = axis === 'x' ? X(fixed) : X(v);
    const cy = axis === 'x' ? Y(v) : Y(fixed);
    return { axis, fixed, v, cx, cy, doneNow, dragging };
  };
  const rh = readHandle();

  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, display: 'block', margin: '0 auto', touchAction: 'none' }} dir="ltr" role="img"
      aria-label={k('planeAria')} data-pr-plane onPointerDown={bgDown} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <rect x={4} y={4} width={W - 8} height={H - 8} rx={14} fill="#FFFBEB" stroke="#F5D58A" strokeWidth={2} />
      {/* le plateau de la règle (le bac où elle attend) */}
      <rect x={W - 168} y={8} width={156} height={padT - 14} rx={12} fill="#FEF3C7" stroke="#F5D58A" strokeWidth={1.5} strokeDasharray="4 3" data-deco aria-hidden="true" />
      <text x={W - 162} y={padT / 2 + 4} fontSize={11} fontWeight={800} fill="#92400E" aria-hidden="true">{k('tray')}</text>
      <rect x={X(0)} y={Y(yMax)} width={pw} height={ph} fill="#FFFFFF" opacity={0.7} />
      {grid}
      <line x1={X(0)} x2={X(xMax) + 8} y1={Y(0)} y2={Y(0)} stroke={COL.axis} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={X(0)} x2={X(0)} y1={Y(0)} y2={Y(yMax) - 8} stroke={COL.axis} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M${X(xMax) + 10} ${Y(0)} l-7 -4 v8 z`} fill={COL.axis} />
      <path d={`M${X(0)} ${Y(yMax) - 10} l-4 7 h8 z`} fill={COL.axis} />
      {xTicks}{yTicks}
      <text x={W - 52} y={Y(0) + 42} textAnchor="middle" fontSize={11} fontWeight={900} fill="#92400E">{k(`axis.x.${task.shop === 'free' ? 'one' : shopWorld(task.shop)}`)}</text>
      <text x={padL + 40} y={26} textAnchor="middle" fontSize={11} fontWeight={900} fill="#92400E">{k(`axis.y.${task.shop === 'free' ? 'one' : shopWorld(task.shop)}`)}</text>

      {/* les rainures (mode plot) */}
      {mode === 'plot' && task.points.map((p, col) => (
        <g key={`rail${col}`} data-deco aria-hidden="true">
          <line x1={X(n(p.x))} x2={X(n(p.x))} y1={Y(0)} y2={Y(yMax)} stroke="#D6A15B" strokeWidth={lab.pins[col] != null ? 1 : 3} strokeDasharray={lab.pins[col] != null ? '3 4' : '2 5'} strokeLinecap="round" opacity={lab.pins[col] != null ? 0.5 : 0.9} />
        </g>
      ))}
      {/* la ligne d'une lecture : la règle fixe */}
      {mode === 'read' && rodSeg && (
        <line x1={X(rodSeg[0][0])} y1={Y(rodSeg[0][1])} x2={X(rodSeg[1][0])} y2={Y(rodSeg[1][1])} stroke={COL.rod} strokeWidth={5} strokeLinecap="round" opacity={0.85} data-pr-rod data-full="true" />
      )}
      {/* la règle posée */}
      {mode !== 'read' && rodSeg && (
        <line x1={X(rodSeg[0][0])} y1={Y(rodSeg[0][1])} x2={X(rodSeg[1][0])} y2={Y(rodSeg[1][1])} stroke={COL.rod} strokeWidth={5} strokeLinecap="round" opacity={0.9}
          data-pr-rod data-full={reading?.full ? 'true' : 'false'} data-through-o={reading?.throughO ? 'true' : 'false'} />
      )}
      {/* la droite de lecture : lignes pointillées vers les axes */}
      {rh && (rh.doneNow || rh.dragging || kb?.kind === 'read') && (
        <g aria-hidden="true">
          <line x1={rh.cx} x2={rh.cx} y1={rh.cy} y2={Y(0)} stroke={COL.read} strokeWidth={2} strokeDasharray="4 4" />
          <line x1={rh.cx} x2={X(0)} y1={rh.cy} y2={rh.cy} stroke={COL.read} strokeWidth={2} strokeDasharray="4 4" />
        </g>
      )}
      {rh && rh.axis === 'y' && !rh.doneNow && (
        <line x1={X(0)} x2={X(xMax)} y1={Y(rh.fixed)} y2={Y(rh.fixed)} stroke="#C4B5FD" strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" data-deco aria-hidden="true" />
      )}
      {rh && rh.axis === 'x' && !rh.doneNow && (
        <line x1={X(rh.fixed)} x2={X(rh.fixed)} y1={Y(0)} y2={Y(yMax)} stroke="#C4B5FD" strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" data-deco aria-hidden="true" />
      )}

      {/* O et les écarts des nœuds que la règle manque */}
      {reading && nodes.map((nd, i) => {
        const hit = reading.touched[i];
        const gx = X(n(nd.x));
        const on = n(reading.line.a) * n(nd.x) + n(reading.line.b);
        return !hit ? (
          <g key={`gap${nd.id}`} aria-hidden="true">
            <line x1={gx} x2={gx} y1={Y(n(nd.y))} y2={Y(on)} stroke={COL.gap} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 3" data-pr-gap={nd.id} />
          </g>
        ) : null;
      })}
      <g data-pr-node={0} data-hit={reading ? String(!!reading.touched[0]) : ''}>
        <circle cx={X(0)} cy={Y(0)} r={9} fill="#FFFFFF" stroke={reading ? (reading.touched[0] ? COL.ok : COL.gap) : '#334155'} strokeWidth={reading ? 3.5 : 2.5} />
        <circle cx={X(0)} cy={Y(0)} r={3.5} fill="#334155" />
        <text x={X(0) - 12} y={Y(0) + 17} fontSize={13} fontWeight={900} fill="#1E1B4B" textAnchor="end">O</text>
      </g>

      {/* les punaises */}
      {task.points.map((p, col) => {
        const ph0 = pinHandle(col);
        const nodeId = 1 + col;
        const idx = nodes.findIndex((q) => q.id === nodeId);
        const hit = reading && idx >= 0 ? reading.touched[idx] : null;
        const cx = X(n(p.x));
        const cy = Y(ph0.yy);
        const fill = hit == null ? COL.pin : hit ? COL.ok : COL.gap;
        const active = (ph0.dragging || (kb?.kind === 'pin' && kb.id === col)) && !ph0.placed;
        const interactive = mode === 'plot' && !ph0.placed && !lab.free;
        return (
          <g key={`pin${col}`} data-pr-pin={col} data-y={ph0.placed ? tx(lab.pins[col]) : ''} data-placed={ph0.placed ? 'true' : 'false'} data-pr-node={ph0.placed ? nodeId : undefined} data-hit={hit == null ? '' : String(hit)}
            role={interactive ? 'slider' : 'img'} tabIndex={interactive ? 0 : -1}
            aria-label={k('pinAria', { x: tx(p.x) })} aria-valuemin={interactive ? 0 : undefined} aria-valuemax={interactive ? yMax : undefined} aria-valuenow={interactive ? (kb?.kind === 'pin' && kb.id === col ? kb.val : 0) : undefined}
            aria-orientation={interactive ? 'vertical' : undefined}
            onPointerDown={interactive ? startPin(col) : undefined} onKeyDown={interactive ? keyPin(col) : undefined}
            onFocus={() => setFocus(`p${col}`)} onBlur={() => setFocus(null)} style={{ cursor: interactive ? 'grab' : 'default', outline: 'none' }}>
            {interactive && <circle cx={cx} cy={cy} r={16} fill="transparent" />}
            {focus === `p${col}` && <circle cx={cx} cy={cy} r={17} fill="none" stroke="#6366F1" strokeWidth={3} />}
            {(ph0.placed || active) && <line x1={cx} x2={X(0)} y1={cy} y2={cy} stroke={fill} strokeWidth={1.5} strokeDasharray="2 4" opacity={0.7} aria-hidden="true" />}
            <circle cx={cx} cy={cy} r={interactive ? 11 : 8} fill={fill} stroke="#FFFFFF" strokeWidth={2.5} />
            <circle cx={cx - 2.5} cy={cy - 2.5} r={2.6} fill="#FFFFFF" opacity={0.6} />
            {interactive && !active && <path d={`M${cx} ${cy - 22} l-5 7 h10 z`} fill="#B45309" className="pr-pulse" aria-hidden="true" />}
            {(active || ph0.placed) && (
              <g aria-hidden="true">
                <rect x={cx - 32} y={cy - 33} width={64} height={19} rx={9} fill="#FFFFFF" stroke={fill} strokeWidth={1.5} />
                <text x={cx} y={cy - 19.5} textAnchor="middle" fontSize={11} fontWeight={800} fill="#1E1B4B" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{`(${tx(p.x)} ; ${tn(ph0.yy)})`}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* la punaise de lecture */}
      {rh && (
        <g data-pr-read data-axis={rh.axis} data-done={rh.doneNow ? 'true' : 'false'} role="slider" tabIndex={rh.doneNow ? -1 : 0} aria-label={k(`readAria.${rh.axis}`, { v: tn(rh.fixed) })}
          aria-valuemin={0} aria-valuemax={rh.axis === 'x' ? yMax : xMax} aria-valuenow={rh.v} aria-orientation={rh.axis === 'x' ? 'vertical' : 'horizontal'}
          onPointerDown={startRead} onKeyDown={keyRead} onFocus={() => setFocus('read')} onBlur={() => setFocus(null)} style={{ cursor: rh.doneNow ? 'default' : 'grab', outline: 'none' }}>
          {!rh.doneNow && <circle cx={rh.cx} cy={rh.cy} r={26} fill="transparent" />}
          {focus === 'read' && <circle cx={rh.cx} cy={rh.cy} r={19} fill="none" stroke="#6366F1" strokeWidth={3} />}
          <circle cx={rh.cx} cy={rh.cy} r={12} fill={rh.doneNow ? COL.ok : COL.read} stroke="#FFFFFF" strokeWidth={3} />
          <circle cx={rh.cx - 3} cy={rh.cy - 3} r={3} fill="#FFFFFF" opacity={0.6} />
          {!rh.doneNow && <path d={rh.axis === 'x' ? `M${rh.cx} ${rh.cy - 24} l-5 7 h10 z` : `M${rh.cx + 24} ${rh.cy} l-7 -5 v10 z`} fill="#6D28D9" className="pr-pulse" aria-hidden="true" />}
          {(rh.doneNow || rh.dragging || kb?.kind === 'read') && (
            <g aria-hidden="true">
              <rect x={rh.cx - 34} y={rh.cy - 36} width={68} height={20} rx={10} fill="#FFFFFF" stroke={rh.doneNow ? COL.ok : COL.read} strokeWidth={1.5} />
              <text x={rh.cx} y={rh.cy - 22} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#1E1B4B" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
                {`(${tn(rh.axis === 'x' ? rh.fixed : rh.v)} ; ${tn(rh.axis === 'x' ? rh.v : rh.fixed)})`}
              </text>
            </g>
          )}
        </g>
      )}

      {/* les deux extrémités de la règle */}
      {mode !== 'read' && [0, 1].map((end) => {
        const [ex, ey, floating] = endPos(end);
        const col = end === 0 ? COL.end0 : COL.end1;
        const open = L.rodOpen(lab);
        const assigned = lab.rod[end];
        return (
          <g key={`end${end}`} data-pr-end={end} data-node={assigned ?? ''} role="slider" tabIndex={open ? 0 : -1} aria-disabled={!open}
            aria-label={k('endAria', { i: end + 1 })} aria-valuemin={0} aria-valuemax={Math.max(0, nodes.length - 1)} aria-valuenow={Math.max(0, nodes.findIndex((q) => q.id === (assigned ?? -1)))}
            aria-valuetext={assigned != null ? (nodes.find((q) => q.id === assigned)?.label ?? '') : k('endFree')}
            onPointerDown={startEnd(end)} onKeyDown={keyEnd(end)} onFocus={() => setFocus(`e${end}`)} onBlur={() => setFocus(null)}
            className={shake && !drag ? 'pr-shake' : undefined}
            style={{ cursor: open ? (floating ? 'grabbing' : 'grab') : 'not-allowed', outline: 'none', opacity: open ? 1 : 0.45 }}>
            <circle cx={ex} cy={ey} r={26} fill="transparent" />
            {focus === `e${end}` && <circle cx={ex} cy={ey} r={20} fill="none" stroke="#6366F1" strokeWidth={3} />}
            <circle cx={ex} cy={ey} r={14} fill={col} stroke="#FFFFFF" strokeWidth={3} />
            <text x={ex} y={ey + 4.5} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{end + 1}</text>
          </g>
        );
      })}
      {(cand || kbCand) && (() => {
        const c = cand ?? kbCand;
        return <circle cx={X(n(c.x))} cy={Y(n(c.y))} r={17} fill="none" stroke="#6366F1" strokeWidth={3} strokeDasharray="4 3" aria-hidden="true" data-pr-candidate={c.id} />;
      })()}
    </svg>
  );
}

function shopWorld(shop) {
  return shop === 'one' || shop === 'two' || shop === 'three' ? 'one' : 'bags';
}

/* ══════════════ Le tableau de prix ══════════════ */

function PriceTable({ lab, k, layout = 'col' }) {
  const task = L.taskOf(lab);
  if (layout === 'row') {
    return (
      <LabCard className="overflow-hidden p-1" data-pr-table data-layout="row">
        <table className="w-full table-fixed border-collapse text-center" dir="ltr" aria-label={k('table.aria')}>
          <tbody>
            <tr>{task.points.map((p) => <td key={`x${tx(p.x)}`} className="border border-amber-200 bg-amber-50 py-1 text-sm font-black tabular-nums text-amber-950"><bdi>{tx(p.x)}</bdi></td>)}</tr>
            <tr>{task.points.map((p, col) => <td key={`y${tx(p.x)}`} data-pr-row={col} className={`border border-amber-200 py-1 text-sm font-black tabular-nums ${lab.pins[col] != null ? 'bg-emerald-50 text-emerald-800' : 'bg-white text-indigo-950'}`}><bdi>{tx(p.y)}</bdi></td>)}</tr>
          </tbody>
        </table>
        <p className="mt-0.5 flex justify-between px-1 text-[11px] font-extrabold text-amber-900"><span>{k('table.y')}</span><span>{k('table.x')}</span></p>
      </LabCard>
    );
  }
  return (
    <LabCard className="shrink-0 overflow-hidden p-1" style={{ width: 96 }} data-pr-table data-layout="col">
      <table className="w-full table-fixed border-collapse text-center" dir="ltr" aria-label={k('table.aria')}>
        <thead>
          <tr>
            <th className="border border-amber-200 bg-amber-50 px-1 py-1 text-[11px] font-black text-amber-900">{k('table.x')}</th>
            <th className="border border-amber-200 bg-amber-50 px-1 py-1 text-[11px] font-black text-amber-900">{k('table.y')}</th>
          </tr>
        </thead>
        <tbody>
          {task.points.map((p, col) => (
            <tr key={tx(p.x)} data-pr-row={col}>
              <td className="border border-amber-200 bg-amber-50/60 py-1.5 text-sm font-black tabular-nums text-amber-950"><bdi>{tx(p.x)}</bdi></td>
              <td className={`border border-amber-200 py-1.5 text-sm font-black tabular-nums ${lab.pins[col] != null ? 'bg-emerald-50 text-emerald-800' : 'bg-white text-indigo-950'}`}><bdi>{tx(p.y)}</bdi></td>
            </tr>
          ))}
        </tbody>
      </table>
    </LabCard>
  );
}

/* ══════════════ « جرّب أعدادك أنت » : toujours ouvert ══════════════ */

function FreeCard({ lab, setLab, k }) {
  const free = L.isFree(lab);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  useEffect(() => { if (!lab.free) { setA(''); setB(''); } }, [lab.free]);
  const clean = (v) => v.replace(/[^0-9٠-٩,٫.]/g, '').slice(0, 4);
  const badA = a !== '' && !G.parsePrice(a, { min: 0.5, max: 20 });
  const badB = b !== '' && !G.parsePrice(b, { min: 0, max: 30 });
  const apply = (na, nb) => { if (G.parsePrice(na, { min: 0.5, max: 20 }) && G.parsePrice(nb === '' ? '0' : nb, { min: 0, max: 30 })) setLab((s) => L.setFree(s, na, nb)); };
  return (
    <LabCard className="space-y-2 border-emerald-200 bg-emerald-50/50 p-3" data-pr-free data-active={free ? 'true' : 'false'}>
      <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {k('free.title')}</p>
      <p className="text-xs font-bold leading-snug text-slate-600">{free ? k('free.on') : k('free.hint')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-black text-indigo-950">
          {k('free.a')}
          <input type="text" inputMode="decimal" autoComplete="off" dir="ltr" value={a} maxLength={4}
            onChange={(e) => { const v = clean(e.target.value); setA(v); apply(v, b); }}
            aria-label={k('free.aAria')} aria-invalid={badA} data-pr-free-a
            className={`h-11 w-24 rounded-xl border-2 ${badA ? 'border-rose-300' : 'border-emerald-300'} bg-white px-3 text-center text-xl font-black tabular-nums text-indigo-950 ${ring}`} />
        </label>
        <label className="flex items-center gap-2 text-xs font-black text-indigo-950">
          {k('free.b')}
          <input type="text" inputMode="decimal" autoComplete="off" dir="ltr" value={b} maxLength={4}
            onChange={(e) => { const v = clean(e.target.value); setB(v); apply(a, v); }}
            aria-label={k('free.bAria')} aria-invalid={badB} data-pr-free-b
            className={`h-11 w-24 rounded-xl border-2 ${badB ? 'border-rose-300' : 'border-emerald-300'} bg-white px-3 text-center text-xl font-black tabular-nums text-indigo-950 ${ring}`} />
        </label>
        {(badA || badB) && <span className="text-xs font-bold text-rose-700">{k('free.bad')}</span>}
        {free && (
          <button type="button" onClick={() => setLab(L.toGuided)} data-pr-free-back
            className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-900 ${ring}`}>
            <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('free.back')}
          </button>
        )}
      </div>
    </LabCard>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

export function discoveryOptions(lab, k) {
  const w = L.witnesses(lab);
  const miss = w.miss ?? { count: 3, total: 5 };
  const aligned = w.aligned ?? { cuts: '10' };
  return [
    { text: <MathText>{k('discovery.always')}</MathText>, why: <MathText>{k('discovery.whyAlways', { n: iso(miss.count), m: iso(miss.total) })}</MathText> },
    { text: <MathText>{k('discovery.pinsOnly')}</MathText>, why: <MathText>{k('discovery.whyPinsOnly', { b: iso(aligned.cuts) })}</MathText> },
    { text: <MathText>{k('discovery.right')}</MathText>, correct: true },
  ];
}

export function Formal({ lab, k }) {
  const w = L.witnesses(lab);
  const read = lab.trials.findLast((t) => t.kind === 'read' && t.ok);
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-pr-formal>
      <p><MathText>{k('formal.rule')}</MathText></p>
      <p><MathText>{k('formal.refuse')}</MathText></p>
      <p className="text-center text-base" dir="ltr"><MathText>{'$y = a \\times x$'}</MathText></p>
      <p><MathText>{k('formal.coef')}</MathText></p>
      {read && <p className="text-center" dir="ltr"><MathText>{k('formal.line', { x: iso(read.x), y: iso(read.y), a: iso(read.a) })}</MathText></p>}
      {w.full && <span className="sr-only">{k('formal.seen')}</span>}
    </div>
  );
}
