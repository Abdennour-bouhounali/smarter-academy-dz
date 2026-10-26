import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hand, CheckCircle2, Sparkles, ChevronLeft, FlaskConical, Undo2, Sprout, Star, Minus, Plus } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { sumWith } from '@smarter-academy/core/arithmetic/fractions3.js';
import MathText from '../../components/MathText';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import { LabCard, StageFrame, PromptCard, VerdictBanner } from '../primitives/LabKit';
import { useLabCoach } from '../primitives/LabCoach';
import { LEVELS } from '../levels';
import * as L from '../logic/seedRake';
import SeedScene, { CSS as SCENE_CSS } from './seedRake/SeedScene';
import { W, H, ZONE_COLORS, HARVEST, borderOf, nFromX } from './seedRake/seedArt';

/**
 * seed-rake — L'ESPACEMENT SOUS LA MAIN : « مشط الشتلات » (3AM, unité 2 « العمليات على الكسور والأعداد الناطقة », درس « جمع وطرح كسرين », 2026-10-26).
 * La logique, exacte, est dans `logic/seedRake.js` (sur `packages/core/arithmetic/fractions3.js` et `powers.js`, importés PAR CHEMIN) ; le dessin dans
 * `seedRake/SeedScene.jsx` et `seedRake/seedArt.js`. Distinct de `fraction-knife` (1AM : UNE part est fixe, la main tient le nombre de parts d'UN tout ; il n'additionne jamais),
 * de `tile-yard` (1AM : la main porte UNE tuile pour mesurer une aire), de `ruler-compare` (1AM : une graduation décimale sépare deux longueurs) et de `unit-ladder` (unité 3 : une
 * bande étirée sur des colonnes d'unités) : ici la main ÉTIRE un râteau (un espacement 1/N qui s'accroche aux fractions unitaires) pour que DEUX OU TROIS zones voisines contiennent
 * chacune un nombre ENTIER de plants ; la somme se lit en plants, le même pour tout espacement qui convient, et le besoin du jardinier (de la place pour les plants) fait choisir
 * le PLUS LARGE : le plus petit multiple commun.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. La main tire la poignée du râteau (ou − / + , ← → , Début) : la variable est N, l'espacement 1/N m ; « ازرع » sème un plant par case.
 * B. Les dents s'écartent ou se resserrent ; chaque zone reçoit ses plants ; la longueur plantée est une accolade sur la règle.
 * C. En مبتدئ les décomptes sont visibles ; en متقدم le râteau est BLOQUÉ : on écrit N et la longueur, puis « ازرع » vérifie (aucun décompte avant).
 * D. Chaque semis est un essai (le N, le verdict, les décomptes) ; chaque engagement aussi.
 * E. À découvrir (مبتدئ, après g1–g3) : « لماذا نجحت المسافتان ولم تنجح … ؟ » — « le plus grand nombre réussit » et « la somme des dénominateurs » réfutés avec SES nombres.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        a/b ± c/d : on ne compte que des parts de la même taille ; un dénominateur commun est un multiple commun ; le plus petit est le plus large espacement
 *   OBJECT         un حوض de 1 m, sa règle, des zones de cultures et leurs pancartes, un râteau de jardin, des plants dans des cases de terre, un second حوض ; Sara (KidFigure)
 *   VARIABLE       l'espacement 1/N m (N = 2 … 60) ; en متقدم l'engagement écrit (N et la longueur)
 *   INVARIANT      la longueur plantée est la même pour tout espacement qui convient (5/12 m pour 1/12 comme pour 1/24)
 *   TRANSFORMATION chaque changement de N écarte les dents ; chaque semis place un plant par case
 *   CONSTRAINT     chaque zone doit contenir un nombre ENTIER de cases ; N entier ; 2 ≤ N ≤ 60 ; résultats positifs (hors de cette leçon : le négatif)
 *   RESISTANCE     la case à cheval sur la frontière (plant flétri, contour rouge, rien n'est compté), un total faux réfuté par les plants, le râteau bloqué en متقدم
 *   EVIDENCE       les décomptes par zone, l'accolade sur la règle, les pastilles « 1/12 ← 5 », la phrase écrite avec SES nombres
 *   CONTRAST       1/4 + 1/6 : 1/10 refusé (2,5 cases), 1/12 et 1/24 acceptés, même accolade ; 2/10 (le faux « on additionne les haut et bas ») plus court qu'UN seul des deux
 *   PREDICTION     N et le total écrits avant de semer (متقدم)
 *   DISCOVERY      « لماذا نجحت المسافتان … ولم تنجح … ؟ »
 *   FORMALIZATION  1/4 + 1/6 = 3/12 + 2/12 = 5/12 ; un multiple commun ; le plus petit multiple commun
 *   TRANSFER       « جرّب أعدادك » (toujours ouvert), les exercices et la banque
 *
 * « جرّب كل الإمكانيات » : NON (chaque semis EST l'essai). « جرّب أعدادك » est TOUJOURS ouvert sous le labo (jusqu'à 3 zones, la dernière peut être une récolte ; une prédiction
 * quelconque est dessinée en pointillés sans être jugée).
 * D'UN SEUL REGARD (§8bis) : `[data-sr-glance]` enveloppe la consigne, la scène, les décomptes, les commandes et le verdict.
 * ONBOARDING : `coach` (défaut true) → `LabCoach` ; `logic/seedRake.js › coachOf` (rake · plant · border · predict · free).
 * Props : `tasks` ([{ id, kind, terms, need, needRefusal, widest }]), `world` ('bed' | 'fewest'), `level`, `levels`, `coach`, `title`, `lead`, `onTrial(event)`, `onFinished({ world })`.
 * CONTRAT DOM : [data-seed-rake][data-task][data-solved][data-world], [data-sr-glance], [data-sr-stage], [data-sr-svg][data-n], [data-sr-rake][data-n][data-locked], [data-sr-tooth],
 * [data-sr-bed], [data-sr-zone], [data-sr-sign], [data-sr-plant], [data-sr-wilt], [data-sr-borderline], [data-sr-bracket], [data-sr-second], [data-sr-readout][data-n], [data-sr-less],
 * [data-sr-more], [data-sr-plant-btn], [data-sr-star], [data-sr-count][data-zone][data-value], [data-sr-log][data-sr-log-item], [data-sr-predict], [data-sr-pred-n], [data-sr-pred-num],
 * [data-sr-pred-den], [data-sr-verdict], [data-sr-step], [data-sr-free][data-active], [data-sr-free-a|b=<i>], [data-sr-free-harvest], [data-sr-free-pred-n|d], [data-sr-formal], [data-sr-next].
 */
const NS = 'manipulation.seedRake';
const LRI = '⁦';
const PDI = '⁩';
const iso = (s) => `${LRI}${s}${PDI}`;
const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-300';
const tex = (p) => { const [a, b] = String(p).split('/'); return `\\frac{${a}}{${b}}`; };
const mathOf = (p) => `$${tex(p)}$`;
const frac = (n, d) => `${n}/${d}`;
const zoneColor = (i, z) => (z?.sub ? HARVEST : ZONE_COLORS[i % 3]);

export function numbersFor({ tasks, world, level }) {
  const lv = resolveLevelId(level ?? 'beginner');
  const asked = LEVELS['seed-rake'][lv].numbers;
  return { tasks: tasks ?? asked.tasks, world: world ?? asked.world ?? 'bed' };
}

export default function SeedRake({
  tasks, world, title, lead, level, levels: withLevels = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ tasks, world, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'seed-rake', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
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
  const everyDone = L.allDone(lab);
  useEffect(() => {
    if (!everyDone) { finishedOnce.current = false; return; }
    if (!finishedOnce.current) { finishedOnce.current = true; state.report(onFinished, { world: lab.world }); }
  }, [everyDone]); // eslint-disable-line react-hooks/exhaustive-deps
  const reported = useRef(0);
  const nTrials = lab.trials.length;
  useEffect(() => {
    if (nTrials < reported.current) reported.current = 0;
    for (let i = reported.current; i < nTrials; i += 1) state.report(onTrial, { ...lab.trials[i] });
    reported.current = nTrials;
  }, [nTrials, lab.trials]); // eslint-disable-line react-hooks/exhaustive-deps

  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'seed-rake', step: coachStep,
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
    <ManipulationDiscovery state={state} prompt={<MathText>{discoveryPrompt(lab, k)}</MathText>}
      options={discoveryOptions(lab, k)} formal={<Formal lab={lab} k={k} />} />
  );

  return (
    <ManipulationShell
      type="seed-rake"
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
      <ManipulationStage className="bg-gradient-to-b from-lime-50/70 to-white">
        <div ref={boxRef} className="space-y-2" data-seed-rake data-task={lab.ti} data-world={lab.world} data-solved={everyDone ? 'true' : 'false'}>
          <style dangerouslySetInnerHTML={{ __html: SCENE_CSS }} />
          <Lab lab={lab} setLab={setLab} k={k} width={width} screenH={screenH} lead={state.isAuthoredLevel ? lead : null} />
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ Les mots ══════════════ */

const NAMES = ['crop.tomato', 'crop.pepper', 'crop.onion'];
function plants(k, n) {
  if (n === 1) return k('plant.one');
  if (n === 2) return k('plant.two');
  return k(n >= 3 && n <= 10 ? 'plant.few' : 'plant.many', { n: iso(String(n)) });
}
const spacing = (N) => iso(frac(1, N));
const zoneName = (k, t, i) => (t.terms[i]?.sub ? k('crop.harvest') : k(NAMES[i % 3]));

function contextOf(t, k, free) {
  const f = t.terms.map((x) => mathOf(x.p));
  const m = '$1$ م';
  const base = t.harvest
    ? (t.terms.length === 3
      ? k('context.harvest3', { m, f1: f[0], f2: f[1], f3: f[2] })
      : t.terms.length === 2 ? k('context.harvest', { m, f1: f[0], f2: f[1] }) : k('context.add1', { m, f1: f[0] }))
    : t.terms.length === 3 ? k('context.add3', { m, f1: f[0], f2: f[1], f3: f[2] }) : t.terms.length === 2 ? k('context.add2', { m, f1: f[0], f2: f[1] }) : k('context.add1', { m, f1: f[0] });
  return free ? `${k('context.freePrefix')} ${base}` : base;
}

function borderText(t, pl, k) {
  const info = borderOf(t, pl.borderAt);
  if (info.kind === 'harvest') return k('border.harvest');
  if (info.kind === 'end') return k('border.end', { a: zoneName(k, t, info.left) });
  return k('border.between', { a: zoneName(k, t, info.left), b: zoneName(k, t, info.right) });
}

/* ══════════════ Le laboratoire ══════════════ */

function Lab({ lab, setLab, k, width, screenH, lead }) {
  const uid = `sr${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const free = L.isFree(lab);
  const t = L.taskOf(lab);
  const done = L.taskDone(lab);
  const predictKind = !free && t.kind === 'predict';
  const canRake = L.canRake(lab);
  const pl = lab.planted;
  const svgRef = useRef(null);

  /* ── le geste : la poignée du râteau (glisser), − / + , ← → */
  const dragRef = useRef(false);
  const xOf = (e) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || !r.width) return null;
    return ((e.clientX - r.left) / r.width) * W;
  };
  const pointTo = (e) => { const x = xOf(e); if (x != null) setLab((s) => L.setN(s, nFromX(x))); };
  const down = (e) => { if (!canRake) return; e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); dragRef.current = true; pointTo(e); };
  const move = (e) => { if (dragRef.current && canRake) pointTo(e); };
  const up = () => { dragRef.current = false; };
  const keyDown = (e) => {
    if (!canRake) return;
    const map = { ArrowRight: -1, ArrowUp: -1, ArrowLeft: 1, ArrowDown: 1 };
    if (e.key in map) { e.preventDefault(); setLab((s) => L.stepN(s, map[e.key] * (e.shiftKey ? 5 : 1))); } else if (e.key === 'Home') { e.preventDefault(); setLab((s) => L.setN(s, 2)); } else if (e.key === 'Enter') { e.preventDefault(); setLab((s) => L.plant(s)); }
  };
  const grabProps = {
    tabIndex: canRake ? 0 : -1, role: 'slider', 'aria-valuemin': 2, 'aria-valuemax': 60, 'aria-valuenow': lab.N, 'aria-valuetext': k('rake.valueText', { s: spacing(lab.N) }),
    'aria-label': done ? k('rake.ariaFrozen') : k('rake.aria'), 'aria-disabled': canRake ? undefined : 'true',
    onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, onKeyDown: keyDown, style: { touchAction: 'none' },
  };

  /* ── la consigne : le contexte, puis UNE question */
  const ctx = contextOf(t, k, free);
  const question = free ? k('question.free') : predictKind ? k('question.predict') : lab.world === 'fewest' ? k('question.fewest') : k('question.plant');
  const steps = lab.tasks.length > 1 && !free && (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti;
        return (
          <span key={tk.id} role="listitem" data-sr-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-emerald-700 bg-emerald-600 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-lime-200 bg-white text-emerald-700'}`}>
            <bdi dir="ltr">{i + 1}</bdi>
          </span>
        );
      })}
    </div>
  );
  const prompt = (
    <PromptCard size="md" context={<MathText>{ctx}</MathText>} contextProps={{ 'data-sr-context': free ? 'free' : t.kind }}
      title={<MathText>{question}</MathText>} titleClassName="text-base" lamp={free ? null : done ? 'on' : 'off'}
      titleProps={{ 'data-sr-prompt': t.kind, 'data-lit': done ? 'true' : 'false' }}
      aside={steps || undefined} instruction={lead || (!free && !predictKind && lab.world === 'bed' && lab.ti === 0 ? k('lead') : undefined)} />
  );

  /* ── la scène */
  const innerH = typeof window !== 'undefined' && window.innerHeight ? window.innerHeight : screenH + 40;
  const fixed = 318 + (predictKind ? 66 : 0) + (lab.tasks.length > 1 && lab.ti > 0 ? 30 : 0) + (lead ? 28 : 0);
  const hBudget = Math.max(130, Math.min(300, innerH - 24 - fixed));
  const scale = Math.max(0.6, Math.min(1.2, Math.min(width / W, hBudget / H)));
  const mood = done || (pl && pl.ok) ? 'proud' : pl && !pl.ok ? 'wonder' : 'happy';
  const stage = (
    <StageFrame className="min-w-0 overflow-hidden" data-sr-stage data-scale={scale.toFixed(2)} data-screen-h={Math.round(screenH)}>
      <SeedScene lab={lab} k={k} uid={uid} width={width} scale={scale} mood={mood} grabProps={grabProps} svgRef={svgRef} />
    </StageFrame>
  );

  /* ── les décomptes (visibles seulement après un semis qui convient) */
  const counts = pl && pl.ok ? (
    <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-1.5" data-sr-counts>
      {t.zones.map((z, i) => (
        <span key={i} data-sr-count data-zone={i} data-value={pl.counts[i]} className="inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-2.5 py-1 text-xs font-black text-slate-800" style={{ borderColor: zoneColor(i, z).fill }}>
          <span className="h-3 w-3 rounded-full" style={{ background: zoneColor(i, z).fill }} aria-hidden="true" />
          {zoneName(k, t, i)}: {plants(k, pl.counts[i])}
        </span>
      ))}
      <span data-sr-total className="inline-flex items-center rounded-full border-2 border-indigo-300 bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-950">
        <MathText>{k('count.total', { n: plants(k, pl.signedN), s: spacing(pl.N), len: iso(pl.totalText) })}</MathText>
      </span>
    </div>
  ) : null;

  const rec = free ? { works: [], refused: [] } : lab.record[t.id] ?? { works: [], refused: [] };
  const log = !free && !predictKind && rec.works.length > 0 && (
    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5" data-sr-log>
      <span className="text-xs font-extrabold text-slate-600">{k('log.title')}</span>
      {rec.works.map((N) => {
        const r = sumWith(t.terms, N);
        return (
          <span key={N} data-sr-log-item={N} className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-900">
            <bdi dir="ltr">{`1/${N} → ${r.signed}`}</bdi>
          </span>
        );
      })}
      {rec.works.length >= 2 && <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-900">{k('log.same', { len: iso(t.totalText) })}</span>}
    </div>
  );

  /* ── les commandes */
  const btn = `inline-flex min-h-[44px] items-center justify-center gap-1 rounded-2xl border-2 px-2.5 text-base font-black shadow-[0_3px_0_0_var(--sr-sh)] transition-all duration-150 active:translate-y-0.5 active:shadow-none disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none motion-reduce:transition-none ${ring}`;
  const lime = `${btn} border-emerald-300 bg-white text-emerald-950 [--sr-sh:#6EE7B7]`;
  const green = `${btn} border-emerald-700 bg-emerald-600 text-white [--sr-sh:#047857]`;
  const amber = `${btn} border-amber-400 bg-amber-50 text-amber-950 [--sr-sh:#FCD34D]`;
  const canPlant = L.canPlant(lab);
  const field = `h-10 rounded-xl border-2 border-amber-300 bg-white text-center text-lg font-black tabular-nums ${ring}`;
  const predictRow = predictKind && !done && (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-2xl bg-amber-50 px-3 py-1.5" data-sr-predict>
      <label className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
        {k('predict.nLabel')}
        <bdi dir="ltr" className="inline-flex items-center gap-1">
          <span>1 /</span>
          <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" maxLength={2} value={lab.predN} onChange={(e) => setLab((s) => L.setPredN(s, e.target.value))} aria-label={k('predict.nAria')} data-sr-pred-n className={`${field} w-14`} />
        </bdi>
      </label>
      <label className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
        {k('predict.lenLabel')}
        <bdi dir="ltr" className="inline-flex items-center gap-1">
          <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" maxLength={3} value={lab.predNum} onChange={(e) => setLab((s) => L.setPredNum(s, e.target.value))} aria-label={k('predict.numAria')} data-sr-pred-num className={`${field} w-16`} />
          <span>/</span>
          <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" maxLength={3} value={lab.predDen} onChange={(e) => setLab((s) => L.setPredDen(s, e.target.value))} aria-label={k('predict.denAria')} data-sr-pred-den className={`${field} w-16`} />
        </bdi>
        <span>{k('unit.m')}</span>
      </label>
    </div>
  );
  const controls = (
    <LabCard className="space-y-1.5 p-1.5" data-sr-controls>
      {predictRow}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {!predictKind && (
          <>
            <button type="button" className={lime} onClick={() => setLab((s) => L.stepN(s, 1))} disabled={!canRake || lab.N >= L.MAX_N} aria-label={k('less.aria')} data-sr-less>
              <Minus className="h-5 w-5" aria-hidden="true" /> <span dir="rtl">{k('less.label')}</span>
            </button>
            <span className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-2xl border-2 border-lime-300 bg-lime-50 px-2.5 py-0.5 text-base font-black leading-tight text-emerald-950" data-sr-readout data-n={lab.N} aria-live="polite">
              <span className="text-[10.5px] font-extrabold text-slate-600">{k('readout.label')}</span>
              <span className="inline-flex items-baseline gap-1"><bdi dir="ltr" className="text-xl tabular-nums">{`1/${lab.N}`}</bdi> <span className="text-xs">{k('unit.m')}</span></span>
            </span>
            <button type="button" className={lime} onClick={() => setLab((s) => L.stepN(s, -1))} disabled={!canRake || lab.N <= L.MIN_N} aria-label={k('more.aria')} data-sr-more>
              <Plus className="h-5 w-5" aria-hidden="true" /> <span dir="rtl">{k('more.label')}</span>
            </button>
          </>
        )}
        {(canPlant || predictKind) && (
          <button type="button" className={green} onClick={() => setLab(predictKind ? L.attempt : L.plant)} disabled={predictKind ? !L.predictReady(lab) : !canPlant} aria-label={k('plantBtn.aria')} data-sr-plant-btn>
            <Sprout className="h-5 w-5" aria-hidden="true" /> <span dir="rtl">{k('plantBtn.label')}</span>
          </button>
        )}
        {(L.starVisible(lab) || lab.hunt) && !free && !predictKind && (
          <button type="button" className={amber} onClick={() => setLab(L.star)} disabled={lab.hunt} aria-label={k('star.aria')} data-sr-star data-on={lab.hunt ? 'true' : 'false'}>
            <Star className="h-5 w-5" aria-hidden="true" /> <span dir="rtl">{k('star.label')}</span>
          </button>
        )}
      </div>
    </LabCard>
  );

  /* ── le verdict */
  const vv = verdictOf(lab, k);
  const canNext = L.canNext(lab);
  const Icon = vv.tone === 'emerald' ? CheckCircle2 : vv.tone === 'indigo' ? Hand : Sparkles;
  const banner = (
    <VerdictBanner tone={vv.tone} icon={Icon} size="sm" className="min-h-[2.75rem] !py-1.5" data-sr-verdict={vv.code}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <p className={vv.tone === 'indigo' ? 'font-bold text-indigo-900' : ''}><MathText>{vv.text}</MathText></p>
        {canNext && (
          <button type="button" onClick={() => setLab(L.nextTask)} data-sr-next
            className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-emerald-600 bg-emerald-600 px-3.5 text-sm font-black text-white shadow-[0_3px_0_0_#047857] transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`}>
            {k('next')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </VerdictBanner>
  );

  return (
    <>
      <div className="relative space-y-2" data-sr-glance>
        {prompt}
        {stage}
        {counts}
        {log}
        {done && predictKind ? null : controls}
        {banner}
      </div>
      <FreeCard lab={lab} setLab={setLab} k={k} />
    </>
  );
}

/* ══════════════ Le verdict ══════════════ */

function verdictOf(lab, k) {
  const t = L.taskOf(lab);
  const free = L.isFree(lab);
  const pl = lab.planted;
  if (lab.refusal) return { text: k(`refusal.${lab.refusal}`), tone: 'rose', code: `refusal-${lab.refusal}` };
  if (free) {
    if (!pl) return { text: k('idle.free'), tone: 'indigo', code: '' };
    if (!pl.ok) return { text: `${borderText(t, pl, k)} ${k('v.freeNote')}`, tone: 'rose', code: 'free' };
    return { text: k('v.freeOk', { n: plants(k, pl.signedN), s: spacing(pl.N), len: iso(pl.totalText) }), tone: 'emerald', code: 'free' };
  }
  const last = lab.trials.at(-1);
  if (t.kind === 'predict') {
    if (!pl || !last || last.mission !== t.id || last.kind === 'solved') {
      if (L.taskDone(lab) && pl) return { text: k('v.predictOk', { len: iso(t.totalText) }), tone: 'emerald', code: 'ok' };
      return { text: k('idle.predict'), tone: 'indigo', code: '' };
    }
    if (last.kind === 'predict') {
      if (last.why === 'border') return { text: `${k('v.predictBorder', { s: spacing(last.N) })} ${borderText(t, pl, k)}`, tone: 'rose', code: 'refuted' };
      if (last.why === 'value') return { text: k('v.predictValue', { s: spacing(last.N), n: plants(k, pl.signedN), len: iso(pl.totalText), wrote: iso(last.value) }), tone: 'amber', code: 'refuted' };
      if (last.why === 'wider') return { text: k('v.wider', { s: spacing(last.N), len: iso(pl.totalText) }), tone: 'indigo', code: 'wider' };
      return { text: k('v.predictOk', { len: iso(pl.totalText) }), tone: 'emerald', code: 'ok' };
    }
    return { text: k('idle.predict'), tone: 'indigo', code: '' };
  }
  if (pl && !pl.ok) return { text: `${borderText(t, pl, k)} ${k('v.nothingCounted')}`, tone: 'rose', code: 'refused' };
  if (pl && pl.ok) {
    const rec = lab.record[t.id] ?? { works: [] };
    if (t.widest && pl.N !== t.widestN) return { text: k('v.wider', { s: spacing(pl.N), len: iso(pl.totalText) }), tone: 'indigo', code: 'wider' };
    if (lab.hunt && pl.N === Math.min(...rec.works) && rec.works.length > 1) return { text: k('v.huntBest', { s: spacing(pl.N) }), tone: 'indigo', code: 'hunt' };
    return { text: k('v.ok', { n: plants(k, pl.signedN), s: spacing(pl.N), len: iso(pl.totalText) }), tone: L.taskDone(lab) ? 'emerald' : 'indigo', code: 'ok' };
  }
  if (L.taskDone(lab)) return { text: k('v.done'), tone: 'emerald', code: 'ok' };
  if (lab.hunt) return { text: k('idle.hunt', { s: spacing(L.widestFound(lab)) }), tone: 'indigo', code: 'hunt' };
  return { text: k('idle.plant'), tone: 'indigo', code: '' };
}

/* ══════════════ « جرّب أعدادك » : toujours ouvert ══════════════ */

function FreeCard({ lab, setLab, k }) {
  const free = L.isFree(lab);
  const blank = [{ a: '1', b: '4' }, { a: '1', b: '6' }, { a: '', b: '' }];
  const [rows, setRows] = useState(blank);
  const [harvest, setHarvest] = useState(false);
  const [bad, setBad] = useState(null);
  const apply = (nextRows, nextHarvest) => {
    const v = L.validateFree(nextRows, nextHarvest);
    if (v.ok) { setBad(null); setLab((s) => L.setFree(s, v.cfg)); } else setBad(v.why === 'empty' ? null : v.why);
  };
  const edit = (i, which) => (e) => {
    const raw = L.latin(e.target.value).replace(/[^0-9]/g, '').slice(0, 2);
    const next = rows.map((r, j) => (j === i ? { ...r, [which]: raw } : r));
    setRows(next);
    apply(next, harvest);
  };
  const flip = (e) => { setHarvest(e.target.checked); apply(rows, e.target.checked); };
  const pred = lab.freePred;
  const box = `h-11 w-14 rounded-xl border-2 ${bad ? 'border-rose-300' : 'border-emerald-300'} bg-white px-1 text-center text-xl font-black tabular-nums text-emerald-950 ${ring}`;
  const pbox = 'h-11 w-14 rounded-xl border-2 border-orange-300 bg-white px-1 text-center text-xl font-black tabular-nums text-orange-950 outline-none focus-visible:ring-4 focus-visible:ring-orange-200';
  return (
    <LabCard className="space-y-2 border-emerald-200 bg-emerald-50/50 p-3" data-sr-free data-active={free ? 'true' : 'false'}>
      <p className="flex items-center gap-1.5 text-sm font-black text-emerald-900"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {k('free.title')}</p>
      <p className="text-xs font-bold leading-snug text-slate-600">{free ? k('free.on') : k('free.hint')}</p>
      <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col gap-1 text-xs font-black text-emerald-950">
            <span>{k('free.zone', { i: i + 1 })}</span>
            <bdi dir="ltr" className="inline-flex items-center gap-1">
              <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={r.a} onChange={edit(i, 'a')} aria-label={k('free.aAria', { i: i + 1 })} aria-invalid={!!bad} data-sr-free-a={i} className={box} />
              <span>/</span>
              <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={r.b} onChange={edit(i, 'b')} aria-label={k('free.bAria', { i: i + 1 })} aria-invalid={!!bad} data-sr-free-b={i} className={box} />
            </bdi>
          </div>
        ))}
        <label className="flex min-h-[44px] items-center gap-1.5 text-xs font-black text-emerald-950">
          <input type="checkbox" checked={harvest} onChange={flip} data-sr-free-harvest className="h-5 w-5" /> {k('free.harvest')}
        </label>
        <div className="flex flex-col gap-1 text-xs font-black text-orange-900">
          <span>{k('free.pred')}</span>
          <bdi dir="ltr" className="inline-flex items-center gap-1">
            <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={pred.n} onChange={(e) => setLab((s) => L.setFreePred(s, e.target.value, s.freePred.d))} aria-label={k('free.predNAria')} data-sr-free-pred-n className={pbox} />
            <span>/</span>
            <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={pred.d} onChange={(e) => setLab((s) => L.setFreePred(s, s.freePred.n, e.target.value))} aria-label={k('free.predDAria')} data-sr-free-pred-d className={pbox} />
          </bdi>
        </div>
        {free && (
          <button type="button" onClick={() => setLab(L.toGuided)} data-sr-free-back
            className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-900 ${ring}`}>
            <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('free.back')}
          </button>
        )}
      </div>
      {bad && <p role="alert" className="text-sm font-bold text-rose-700" data-sr-free-refusal={bad}>{k(`free.refusal.${bad}`)}</p>}
    </LabCard>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

export function discoveryPrompt(lab, k) {
  const f = L.formalOf(lab);
  return k('discovery.prompt', { w1: spacing(f.works[0]), w2: spacing(f.works[1]), bad: spacing(f.bad) });
}

export function discoveryOptions(lab, k) {
  const f = L.formalOf(lab);
  const [d1, d2] = f.dens;
  return [
    {
      text: <MathText>{k('discovery.bigger')}</MathText>,
      why: <MathText>{k('discovery.whereBigger', { wit: spacing(f.witnessBigger), w: iso(Math.max(...f.works)) })}</MathText>,
    },
    { text: <MathText>{k('discovery.right', { n1: iso(f.works[0]), n2: iso(f.works[1]), d1: iso(d1), d2: iso(d2), bad: iso(f.bad) })}</MathText>, correct: true },
    {
      text: <MathText>{k('discovery.sum', { d1: iso(d1), d2: iso(d2) })}</MathText>,
      why: <MathText>{k('discovery.whereSum', { s: iso(f.sumDen), ss: spacing(f.sumDen) })}</MathText>,
    },
  ];
}

export function Formal({ lab, k }) {
  const f = L.formalOf(lab);
  const t = f.task;
  const r = sumWith(t.terms, f.widestN);
  const parts = t.terms.map((x, i) => `\\frac{${r.counts[i]}}{${f.widestN}}`);
  const eq = `$${t.terms.map((x) => tex(x.p)).join('+')}=${parts.join('+')}=\\frac{${r.signed}}{${f.widestN}}$`;
  const [d1, d2] = f.dens;
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-sr-formal>
      <p><MathText>{k('formal.sum', { eq })}</MathText></p>
      <p><MathText>{k('formal.lcm', { n: iso(f.widestN), d1: iso(d1), d2: iso(d2) })}</MathText></p>
    </div>
  );
}
