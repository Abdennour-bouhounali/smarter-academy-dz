import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hand, CheckCircle2, Sparkles, ChevronLeft, FlaskConical, Undo2, Check, Ban, ArrowUpToLine, ArrowDownToLine, Lock } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import * as R from '@smarter-academy/core/arithmetic/relative.js';
import MathText from '../../components/MathText';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import { LabCard, StageFrame, PromptCard, VerdictBanner, StepperCard } from '../primitives/LabKit';
import { SvgPill } from '../primitives/SvgPill';
import { useLabCoach } from '../primitives/LabCoach';
import { SeaDefs, Backdrop, Scale, Boat, Diver, SensorA, SensorB, Bound, Band } from './zeroProbe/SeaArt';
import { layout, minus, PILL, RING } from './zeroProbe/geometry';
import { LEVELS } from '../levels';
import * as L from '../logic/zeroProbe';

/**
 * zero-probe — LA DISTANCE À ZÉRO SOUS LA MAIN (2AM, unité 3 « الأعداد النسبية », درس « مقارنة وترتيب أعداد نسبية », 2026-10-21).
 * La logique, exacte, est dans `logic/zeroProbe.js` (sur `packages/core/arithmetic/relative.js`, importé par chemin).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. La main tient `d` ≥ 0, la LONGUEUR d'un câble qui part du zéro (la surface de la mer) : le nœud glisse sur l'échelle −10 … 10, −/+ et
 *    les flèches l'allongent d'un pas, un toucher sur l'échelle y pose le nœud. Le CÔTÉ (فوق / تحت الصفر) est un autre geste (deux boutons).
 * B. Le nombre relatif de B est une SORTIE : côté + longueur. Le câble ne traverse jamais le zéro (il s'arrête à 0).
 * C. La résistance : sous le zéro, PLUS de câble rend B plus BAS (l'inverse de l'intuition des naturels) ; un côté imposé peut interdire une
 *    tâche (A au-dessus du zéro, B sous le zéro : aucune longueur ne rend B plus haut → le bouton « لا يوجد طول ») ; une zone étroite qu'une
 *    seule dixième atteint.
 * D. La phase formelle écrit ce que l'élève a trouvé avec SES nombres (−5 < −3 car |−5| = 5 > 3 = |−3|), la règle une fois.
 * E. Les fausses conjectures sont réfutées avec SES essais (« le plus loin est toujours le plus bas » ; « le plus près du zéro »).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        comparer deux relatifs : le signe d'abord, puis la distance à zéro pour deux négatifs
 *   OBJECT         un capteur A fixe (fanion rouge), un capteur B au bout d'un câble, une échelle d'altitudes, la ligne du zéro
 *   VARIABLE       d, la distance à zéro (et, séparé, le côté)
 *   INVARIANT      A ; le point de départ du câble (le zéro) ; l'échelle
 *   TRANSFORMATION allonger / raccourcir le câble : B se déplace, son nombre devient plus petit (sous le zéro) ou plus grand (au-dessus)
 *   CONSTRAINT     0 ≤ d ≤ 10 (pas 1 ou 0,1 selon le niveau) ; le câble ne traverse pas le zéro
 *   RESISTANCE     plus de câble = plus BAS sous le zéro ; un côté interdit ; une zone d'une seule dixième
 *   EVIDENCE       les DEUX nombres écrits et le verdict en mots après chaque essai, les guides pointillés vers l'échelle
 *   CONTRAST       −5 contre −3 (le plus long câble, le plus bas) ; 4 contre 2 (le plus long câble, le plus haut) ; −0,3 contre 1,2
 *   PREDICTION     aucune carte : chaque relâchement est un essai jugé
 *   DISCOVERY      « متى يكون المسبار الأبعد عن الصفر هو الأخفض؟ » ; « أيّ العددين أخفض… »
 *   FORMALIZATION  −5 < −3 car |−5| > |−3| ; un négatif est plus petit que le zéro et que tout positif
 *   TRANSFER       « جرّب أعدادك » (son A, toujours ouvert), les exercices et la banque
 *
 * « جرّب كل الإمكانيات » : NON (chaque relâchement EST l'essai). « جرّب أعدادك » est TOUJOURS ouvert sous le labo.
 *
 * D'UN SEUL REGARD (§8bis) : `[data-zp-glance]` enveloppe la consigne (contexte puis UNE question), la scène, la lecture, −/+, les côtés et le
 * verdict. Large (≥ 700 px) : une colonne à côté porte la lecture, les côtés, le bouton « لا يوجد طول » et le verdict ; étroit : ils passent
 * sous la scène sur deux colonnes.
 *
 * ONBOARDING : `coach` (défaut true) → `LabCoach` ; `logic/zeroProbe.js › coachOf` (grab · side · decide · try · next).
 *
 * Props (contrat fixé avec la leçon) : `world` ('sea'), `tasks`, `level`, `levels`, `coach`, `title`, `lead`, `onTrial(event)`,
 * `onFinished({})` — par `state.report`.
 *
 * CONTRAT DOM : [data-zero-probe][data-world][data-task][data-solved][data-layout], [data-zp-glance], [data-zp-stage], [data-zp-svg],
 * [data-zp-a][data-value], [data-zp-b][data-value], [data-zp-cable][data-d], [data-zp-knob] (role slider, aria-valuenow = d),
 * [data-zp-side=above|below][aria-pressed], [data-zp-sides], [data-zp-less], [data-zp-more], [data-zp-stepper], [data-zp-d],
 * [data-zp-readout], [data-zp-none], [data-zp-verdict=right|wrong|none|free|''], [data-zp-prompt][data-lit], [data-zp-next],
 * [data-zp-step=<i>][data-done], [data-zp-free][data-active], [data-zp-free-a], [data-zp-free-back], [data-zp-formal], [data-zp-kid][data-mood].
 */
const NS = 'manipulation.zeroProbe';
const LRI = '⁦';
const PDI = '⁩';
const iso = (s) => `${LRI}${s}${PDI}`;
/** Un relatif écrit pour l'écran : virgule, vrai moins, îlot LTR. */
const show = (t) => iso(minus(t));
const WIDE_MIN = 700;
const SIDE_W = 236;
const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-300';

const CSS = `
@keyframes zp-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(1.6px); } }
.zp-bob { animation: zp-bob 3.2s ease-in-out infinite; }
@keyframes zp-spin { from { transform: scaleX(1); } 50% { transform: scaleX(0.55); } to { transform: scaleX(1); } }
.zp-prop { animation: zp-spin 0.22s linear infinite; transform-box: fill-box; transform-origin: center; }
@keyframes zp-pop { 0% { transform: scale(0.8); } 70% { transform: scale(1.06); } 100% { transform: scale(1); } }
.zp-pop { animation: zp-pop 260ms ease-out both; display: inline-block; }
@media (prefers-reduced-motion: reduce) { .zp-bob, .zp-prop, .zp-pop { animation: none !important; } }
`;

/** Les nombres de départ : ceux de la leçon, sinon ceux du niveau. */
export function numbersFor({ world, tasks, level }) {
  const lv = resolveLevelId(level ?? 'beginner');
  const asked = LEVELS['zero-probe'][lv].numbers;
  return { world: world ?? asked.world, step: asked.step, tasks: tasks ?? asked.tasks };
}

export default function ZeroProbe({
  world, tasks, title, lead, level, levels: withLevels = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ world, tasks, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'zero-probe', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const numsKey = JSON.stringify(nums);
  const [lab, setLab] = useState(() => L.init(nums));
  const [scene, setScene] = useState({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
  if (scene.key !== numsKey || scene.epoch !== state.epoch) {
    const restart = scene.key === numsKey && scene.rc !== state.resetCount;
    setScene({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
    setLab(restart ? L.restartTask(lab) : L.init(nums));
  }
  const advanced = resolveLevelId(state.level) === 'advanced';
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

  /* ── onboarding ── */
  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'zero-probe', step: coachStep,
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

  const discovery = (
    <ManipulationDiscovery state={state} prompt={<MathText>{k(`discovery.${discoveryKey(advanced)}.prompt`)}</MathText>}
      options={discoveryOptions(lab, advanced, k)} formal={<Formal lab={lab} advanced={advanced} k={k} />} />
  );

  return (
    <ManipulationShell
      type="zero-probe"
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
      <ManipulationStage className="bg-gradient-to-b from-sky-50/50 to-white">
        <div ref={boxRef} className="space-y-2" data-zero-probe data-world={lab.world} data-task={lab.ti}
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
  const uid = `zp${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const free = L.isFree(lab);
  const task = L.taskOf(lab);
  const wide = width >= WIDE_MIN;
  const veryNarrow = width < 460;
  const stageW = wide ? width - SIDE_W - 12 : width;
  const done = L.taskDone(lab);
  const last = lab.last;
  const j = L.judgeNow(lab);
  const marks = L.marksOf(lab);
  const locked = L.sideLocked(lab);

  /* ── la consigne : le contexte (tous les nombres), puis UNE question ── */
  const ctx = (() => {
    if (free) return k('context.free', { a: show(lab.free.a) });
    if (task.kind === 'between') return k('context.between', { lo: show(task.lo), hi: show(task.hi) });
    const key = task.side === 'below' ? 'beatBelow' : task.side === 'above' ? 'beatAbove' : 'beatFree';
    return k(`context.${key}`, { a: show(task.a) });
  })();
  const question = free ? k('question.free')
    : task.kind === 'between' ? k('question.between')
      : k(`question.${task.want}${task.both ? 'Both' : ''}`);
  const steps = lab.tasks.length > 1 && !free && (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      <span className="text-xs font-black text-indigo-900/60" aria-hidden="true">{k('stepsLabel')}</span>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti;
        return (
          <span key={tk.id} role="listitem" data-zp-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-indigo-600 bg-indigo-600 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-indigo-100 bg-white text-indigo-400'}`}>
            {d && !cur ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : <bdi dir="ltr">{i + 1}</bdi>}
          </span>
        );
      })}
    </div>
  );
  const lit = !free && done;
  const prompt = (
    <PromptCard size={wide ? 'lg' : 'md'} aside={veryNarrow ? null : (steps || null)} context={free ? ctx : (lead || ctx)} contextProps={{ 'data-zp-context': free ? 'free' : task.kind }}
      title={question} titleClassName={wide ? 'text-xl' : 'text-lg'} lamp={free ? null : lit ? 'on' : 'off'}
      titleProps={{ 'data-zp-prompt': free ? 'free' : task.kind, 'data-lit': lit ? 'true' : 'false' }} />
  );

  /* ── la lecture : les deux nombres (une rangée) ── */
  const bText = L.valueText(lab);
  const readout = (
    <LabCard className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 px-3 py-2 ${veryNarrow ? 'sr-only' : ''}`} data-zp-readout data-b={bText} data-d={L.dText(lab)}>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-sm font-black text-white">{k('readout.b')}</span>
        <bdi dir="ltr" key={`${bText}`} className={`zp-pop font-black tabular-nums text-indigo-950 ${veryNarrow ? 'text-xl' : 'text-2xl'}`} data-zp-b-value>{minus(bText)}</bdi>
      </div>
      {marks.slice(0, task.kind === 'between' && !free ? 2 : 1).map((m) => (
        <div key={m.id} className="flex items-center gap-2" data-zp-mark={m.id}>
          <span className={`rounded-full px-2.5 py-0.5 text-sm font-black text-white ${m.id === 'a' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
            {k(`readout.${m.id}`)}
          </span>
          <bdi dir="ltr" className={`font-black tabular-nums text-slate-700 ${veryNarrow ? 'text-lg' : 'text-xl'}`}>{minus(m.text)}</bdi>
        </div>
      ))}
    </LabCard>
  );

  /* ── −/+ ── */
  const stepper = (
    <div data-zp-stepper>
      <StepperCard layout="row" value={minus(L.dText(lab))} unit={null}
        onLess={() => setLab((s) => L.stepBy(s, -1))} onMore={() => setLab((s) => L.stepBy(s, 1))}
        lessDisabled={lab.dh <= 0} moreDisabled={lab.dh >= L.RANGE_H[1]}
        lessLabel={k('less')} moreLabel={k('more')}
        lessProps={{ 'data-zp-less': '' }} moreProps={{ 'data-zp-more': '' }} readoutProps={{ 'data-zp-d': L.dText(lab) }} />
      {!veryNarrow && <p className="mt-1 text-center text-[11px] font-extrabold text-indigo-900/60">{k('stepper')}</p>}
    </div>
  );

  /* ── les côtés + « لا يوجد طول » ── */
  const sides = (
    <div role="group" aria-label={k('sides.aria')} className="grid grid-cols-2 gap-2" data-zp-sides>
      {['above', 'below'].map((sd) => {
        const on = lab.side === sd;
        const Icon = sd === 'above' ? ArrowUpToLine : ArrowDownToLine;
        return (
          <button key={sd} type="button" data-zp-side={sd} aria-pressed={on} aria-disabled={locked && !on ? true : undefined}
            onClick={() => setLab((s) => L.setSide(s, sd))}
            className={`flex min-h-[48px] items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border-2 px-2 text-[15px] font-black transition-all duration-150 motion-reduce:transition-none ${on ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_3px_0_0_#3730A3]' : 'border-indigo-100 bg-white text-indigo-900 shadow-[0_3px_0_0_#E0E3FF]'} ${locked && !on ? 'opacity-45' : ''} ${ring}`}>
            {on && locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />} {k(`sides.${sd}`)}
          </button>
        );
      })}
    </div>
  );
  const noneButton = !free && (
    <button type="button" onClick={() => setLab(L.pressNone)} data-zp-none
      className={`flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-2 text-sm font-black text-slate-700 hover:border-indigo-300 ${ring}`}>
      <Ban className="h-4 w-4" aria-hidden="true" /> {k('none')}
    </button>
  );

  /* ── le verdict + « التالي » ── */
  const verdictLine = (() => {
    if (!last) return k('idle');
    if (last.kind === 'none') return last.ok ? k('v.noneOk') : k('v.noneNo', { side: k(`sideWord.${last.show.side}`), d: show(last.show.d), b: show(last.show.value) });
    const b = show(last.value);
    const a = last.a != null ? show(last.a) : null;
    let line;
    if (last.tk === 'between') line = k(last.order < 0 ? 'v.betweenBelow' : last.order > 0 ? 'v.betweenAbove' : 'v.betweenIn', { b });
    else line = k(last.order < 0 ? 'v.lower' : last.order > 0 ? 'v.higher' : 'v.same', { a, b });
    if (last.free || !last.ok) return line;
    const left = task.both && !done ? ` ${k('v.bothLeft')}` : '';
    return `${k('v.ok')} ${line}${left}`;
  })();
  const vkey = !last ? '' : last.kind === 'none' ? 'none' : last.free ? 'free' : last.ok ? 'right' : 'wrong';
  const good = !!last && last.ok && !last.free;
  const tone = !last ? 'indigo' : good ? 'emerald' : 'amber';
  const Icon = !last ? Hand : good ? CheckCircle2 : Sparkles;
  const canNext = L.canNext(lab);
  const nextButton = canNext && (
    <button type="button" onClick={() => setLab(L.nextTask)} data-zp-next
      className={`inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-3.5 text-sm font-black text-white shadow-[0_3px_0_0_#047857] transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`}>
      {k('next')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
  const banner = (
    <VerdictBanner tone={tone} icon={Icon} size="sm" className={wide ? 'min-h-[3.5rem]' : 'min-h-[4.6rem]'} data-zp-verdict={vkey}>
      <div className="space-y-1.5">
        <p className={last ? '' : 'font-bold text-indigo-900'}>{verdictLine}</p>
        {wide && nextButton}
      </div>
    </VerdictBanner>
  );
  const cell = canNext ? nextButton : noneButton;
  const mood = !last ? 'neutral' : good ? 'proud' : last.free ? 'happy' : 'wonder';

  const stageFrame = (
    <StageFrame className="min-w-0 overflow-hidden p-2" data-zp-stage>
      {veryNarrow && steps && <div className="absolute end-3 top-3 z-10 rounded-full bg-white/80 px-1.5 py-1 backdrop-blur-sm">{steps}</div>}
      <SeaStage lab={lab} setLab={setLab} k={k} uid={uid} width={stageW - 16} screenH={screenH} wide={wide} mood={mood} lit={good && last.ok && (task.kind === 'between' || done)} />
    </StageFrame>
  );

  return (
    <>
      <div className="relative space-y-2.5" data-zp-glance>
        {prompt}
        {wide ? (
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-2.5">{stageFrame}{stepper}</div>
            <div className="flex shrink-0 flex-col gap-2.5" style={{ width: SIDE_W }}>
              {sides}
              {readout}
              {banner}
              {noneButton}
            </div>
          </div>
        ) : (
          <>
            {stageFrame}
            <div className="space-y-2">
              {banner}
              {sides}
              {veryNarrow ? stepper : <div className="grid grid-cols-2 items-start gap-2">{stepper}{readout}</div>}
              {cell}
            </div>
          </>
        )}
      </div>
      <FreeCard lab={lab} setLab={setLab} k={k} />
    </>
  );
}

/** Le rapport viewBox / pixels réels (le SVG se réduit sur un écran étroit) : la main tombe sur la bonne place. */
function useBox(ref, W, H) {
  const [box, setBox] = useState({ sx: 1, sy: 1 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) setBox({ sx: W / r.width, sy: H / r.height }); };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H]); // eslint-disable-line react-hooks/exhaustive-deps
  return box;
}

/** La hauteur de la scène : une fraction de l'écran (petite à 768, plus haute sur un grand écran). */
const stageHeight = (screenH, wide, tight) => Math.round(Math.max(tight ? 262 : 290, Math.min(wide ? 440 : 400, screenH * (wide ? 0.46 : tight ? 0.36 : 0.4))));

/* ══════════════ La scène : la mer, le bateau, les deux capteurs ══════════════ */

function SeaStage({ lab, setLab, k, uid, width, screenH, wide, mood, lit }) {
  const svgRef = useRef(null);
  const W = Math.max(300, width);
  const H = stageHeight(screenH, wide, W < 420);
  const geo = useMemo(() => layout(W, H), [W, H]);
  const { sx, sy } = useBox(svgRef, W, H);
  const [drag, setDrag] = useState(false);
  const task = L.taskOf(lab);
  const marks = L.marksOf(lab);
  const sgn = lab.side === 'below' ? -1 : 1;
  const d = lab.dh / 100;
  const yB = geo.yOf(sgn * d);
  const bText = L.valueText(lab);
  const dTxt = L.dText(lab);

  const toDh = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return lab.dh;
    const y = (e.clientY - rect.top) * sy;
    const v = sgn > 0 ? (geo.y0 - y) / geo.u : (y - geo.y0) / geo.u;
    return Math.max(0, Math.min(L.RANGE_H[1], Math.round(v * 100)));
  };
  const down = (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); setDrag(true); setLab((s) => L.preview(s, toDh(e))); };
  const move = (e) => { if (drag) setLab((s) => L.preview(s, toDh(e))); };
  const up = (e) => { if (!drag) return; setDrag(false); setLab((s) => L.release(s, toDh(e))); };
  const key = (e) => {
    const step = lab.step;
    const map = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 100, PageDown: -100 };
    if (e.key in map) { e.preventDefault(); setLab((s) => L.release(s, s.dh + map[e.key])); }
    if (e.key === 'Home') { e.preventDefault(); setLab((s) => L.release(s, 0)); }
    if (e.key === 'End') { e.preventDefault(); setLab((s) => L.release(s, L.RANGE_H[1])); }
  };

  const between = task.kind === 'between' && !lab.free;
  const dPill = { x: geo.xB - RING - 4, y: (geo.y0 + yB) / 2 };
  const guides = [
    ...(between ? [] : marks.map((m) => ({ id: m.id, y: geo.yOf(Number(m.text.replace(',', '.'))), color: '#E11D48' }))),
    { id: 'b', y: yB, color: '#4F46E5' },
  ];
  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, display: 'block', margin: '0 auto', touchAction: 'pan-y' }}
      role="img" aria-label={k('stageAria', { b: minus(bText), d: dTxt, side: k(`sideWord.${lab.side}`) })} data-zp-svg dir="ltr">
      <SeaDefs uid={uid} />
      <Backdrop uid={uid} geo={geo} />
      {between && <Band geo={geo} lo={task.lo} hi={task.hi} lit={lit} />}
      <Boat geo={geo} mood={mood} />
      <Diver geo={geo} />
      <Scale geo={geo} />
      {/* les guides pointillés de A et de B vers l'échelle : lequel est le plus bas se lit à leur hauteur */}
      <g aria-hidden="true">
        {guides.map((g) => (
          <g key={g.id}>
            <line x1={g.id === 'b' ? geo.xB + RING + 4 : geo.xA + 4} x2={geo.axisX - 2} y1={g.y} y2={g.y} stroke={g.color} strokeWidth={2} strokeDasharray="5 5" opacity={0.85} />
            <path d={`M${geo.axisX - 11} ${g.y - 6} L${geo.axisX - 1} ${g.y} L${geo.axisX - 11} ${g.y + 6} Z`} fill={g.color} />
          </g>
        ))}
      </g>
      {between
        ? [{ id: 'hi', text: task.hi }, { id: 'lo', text: task.lo }].map((m) => <Bound key={m.id} geo={geo} id={m.id} text={m.text} data-zp-bound={m.id} />)
        : marks.map((m) => <SensorA key={m.id} geo={geo} text={m.text} data-zp-a data-value={m.text} />)}
      {/* la bande sensible : toute l'échelle (toucher = poser le nœud ici) */}
      <rect x={geo.axisX - 30} y={0} width={W - geo.axisX + 30} height={H} fill="transparent" style={{ cursor: drag ? 'grabbing' : 'pointer', touchAction: 'none' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-zp-ruler />
      <SensorB uid={uid} geo={geo} yB={yB} lit={lit} active={drag} d={dTxt} valueText={lab.side === 'below' && lab.dh > 0 ? `-${dTxt}` : dTxt}
        knobProps={{
          role: 'slider', tabIndex: 0, 'aria-label': k('knobAria'), 'aria-valuemin': 0, 'aria-valuemax': 10, 'aria-valuenow': d,
          'aria-valuetext': `${dTxt} ${k(`sideWord.${lab.side}`)}`, 'aria-orientation': 'vertical',
          onKeyDown: key, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up,
          style: { cursor: drag ? 'grabbing' : 'grab', touchAction: 'none', outline: 'none' }, className: 'zp-knob',
        }} />
      <SvgPill x={geo.xB + RING + 4} y={yB} anchor="start" text={`B = ${minus(bText)}`} fill="#4F46E5" size={PILL} />
      <SvgPill x={dPill.x} y={dPill.y} anchor="end" text={`d = ${dTxt}`} fill="#B45309" size={PILL} data-zp-d-pill />
    </svg>
  );
}

/* ══════════════ « جرّب أعدادك أنت » : toujours ouvert ══════════════ */

function FreeCard({ lab, setLab, k }) {
  const free = L.isFree(lab);
  const [text, setText] = useState('');
  useEffect(() => { if (!lab.free) setText(''); }, [lab.free]);
  const bad = text !== '' && !L.parseFreeA(text);
  const onText = (e) => {
    const raw = e.target.value.replace(/[^0-9٠-٩\-−,.٫]/g, '').slice(0, 5);
    setText(raw);
    if (L.parseFreeA(raw)) setLab((s) => L.setFree(s, raw));
  };
  return (
    <LabCard className="space-y-2 border-emerald-200 bg-emerald-50/50 p-3" data-zp-free data-active={free ? 'true' : 'false'}>
      <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {k('free.title')}</p>
      <p className="text-xs font-bold leading-snug text-slate-600">{free ? k('free.on') : k('free.hint')}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-black text-indigo-950">
          {k('free.a')}
          <input type="text" inputMode="decimal" autoComplete="off" dir="ltr" value={text} onChange={onText} maxLength={5}
            aria-label={k('free.aAria')} aria-invalid={bad} data-zp-free-a
            className={`h-11 w-28 rounded-xl border-2 ${bad ? 'border-rose-300' : 'border-emerald-300'} bg-white px-3 text-center text-xl font-black tabular-nums text-indigo-950 ${ring}`} />
        </label>
        {bad && <span className="text-xs font-bold text-rose-700">{k('free.bad')}</span>}
        {free && (
          <button type="button" onClick={() => setLab(L.toGuided)} data-zp-free-back
            className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-900 ${ring}`}>
            <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('free.back')}
          </button>
        )}
      </div>
    </LabCard>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

/** Quelle question de découverte : « le plus loin du zéro » (مبتدئ) ou « un négatif contre un positif » (متقدم). */
export const discoveryKey = (advanced) => (advanced ? 'mix' : 'far');

export function discoveryOptions(lab, advanced, k) {
  if (advanced) {
    const w = L.mixWitness(lab);
    const n = { near: show(w.near), far: show(w.far), pos: show(w.pos) };
    return [
      { text: k('discovery.mix.far'), why: k('discovery.mix.whyFar', n) },
      { text: k('discovery.mix.neg'), correct: true },
      { text: k('discovery.mix.near'), why: k('discovery.mix.whyNear', n) },
    ];
  }
  const ab = L.aboveWitness(lab);
  const be = L.belowWitness(lab);
  return [
    { text: k('discovery.far.always'), why: k('discovery.far.whyAlways', { a: show(ab.a), b: show(ab.b) }) },
    { text: k('discovery.far.below'), correct: true },
    { text: k('discovery.far.above'), why: k('discovery.far.whyAbove', { a: show(be.a), b: show(be.b) }) },
  ];
}

export function Formal({ lab, advanced, k }) {
  if (advanced) {
    const w = L.mixWitness(lab);
    const tx = (t) => R.tex(R.parse(t));
    return (
      <div className="space-y-2 text-sm font-bold text-emerald-950" data-zp-formal="mix">
        <p className="text-center text-base" dir="ltr"><MathText>{`$${tx(w.near)} < ${tx(w.pos)}$`}</MathText></p>
        <p className="text-center text-base" dir="ltr"><MathText>{`$${tx(w.far)} < ${tx(w.pos)}$`}</MathText></p>
        <p>{k('formal.mix')}</p>
      </div>
    );
  }
  const w = L.belowWitness(lab);
  const tx = (t) => R.tex(R.parse(t));
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-zp-formal="far">
      <p className="text-center text-base" dir="ltr"><MathText>{`$${tx(w.b)} < ${tx(w.a)}$`}</MathText></p>
      <p className="text-center text-base" dir="ltr"><MathText>{`$|${tx(w.b)}| = ${w.db} > ${w.da} = |${tx(w.a)}|$`}</MathText></p>
      <p>{k('formal.far')}</p>
    </div>
  );
}
