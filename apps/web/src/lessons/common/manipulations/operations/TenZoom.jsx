import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Sparkles, Hand, FlaskConical, Undo2, RotateCcw, ChevronLeft, ShieldAlert, Plus } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import * as T from '@smarter-academy/core/arithmetic/tenPowers.js';
import MathText from '../../components/MathText';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import { LabCard, StageFrame, PromptCard, VerdictBanner } from '../primitives/LabKit';
import KidFigure from '../primitives/KidFigure';
import { useLabCoach } from '../primitives/LabCoach';
import { LEVELS } from '../levels';
import * as L from '../logic/tenZoom';
import { CSS, VB_W, VB_H, CX, CY, R_IN, R_OUT, FRAME, NOTCH_DEG, Bench, Ring, Frame, Vignette, SCENE_IDS } from './tenZoom/art';

/**
 * ten-zoom — LA BAGUE QUI ZOOME PAR DIX : « عدسة القوى » (3AM, unité 3 « القوى ذات أسس نسبية صحيحة », درس « قوى العدد 10 », 2026-10-26).
 * La logique, exacte, est dans `logic/tenZoom.js` (sur `packages/core/arithmetic/tenPowers.js`, importé PAR CHEMIN) ; le dessin dans `tenZoom/art.jsx`.
 * Distinct de `power-train` (la main bâtit un PRODUIT facteur par facteur, la charge est la sortie), `decimal-comma` (1AM : la main déplace la VIRGULE d'un
 * décimal arbitraire) et `ruler-compare` (1AM : la main choisit une graduation) : ici la main change une ÉCHELLE ; rien n'est multiplié par elle ; la preuve est
 * l'écriture décimale du côté et une grandeur physique. Geste : TOURNER la bague / PINCER la lentille / molette — aucun des trois n'en use.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. La main tourne la bague (glisser autour, boutons ×10 / ÷10, pincement, molette, clavier + −) : n, le nombre de crans à partir du cadre de 1 m ; puis « ثبّت الإطار ».
 * B. Chaque cran ×10 ou ÷10 le côté ; la plaque lit le côté en décimal (le 1 se déplace, un zéro apparaît ou disparaît) ; un cadre faux est REFUSÉ avec les deux côtés côte à côte.
 * C. Le cadre qui s'agrandit rentre dans UNE cellule de la grille 10 × 10 du nouveau cadre ; en zoom avant la cellule centrale remplit la lentille ; l'échelle ne devient jamais négative.
 * D. Chaque cran, prédiction et verdict est un essai jugé exactement (MANUEL §6bis).
 * E. À découvrir : مبتدئ « العلاقة بين nombre de crans et côté » ; متقدم « où est le 1 après trois crans de réduction ». La notation 10ⁿ n'est NOMMÉE qu'à la phase formelle.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        10ⁿ = 1 suivi de n zéros ; 10⁰ = 1 ; 10⁻ⁿ a son 1 au rang n après la virgule ; les préfixes sont des puissances de 10
 *   OBJECT         la table du club de sciences : lentille de laiton, bague crantée, cadre carré, plaque « ضلع الإطار » ; Maryam (KidFigure, hijab) tient la carte
 *   VARIABLE       n, le nombre de crans (entier relatif) à partir du cadre de 1 m
 *   INVARIANT      un cran change le côté d'un facteur exactement 10 ; sans cran le côté reste 1 m
 *   TRANSFORMATION cran → côté × ou ÷ 10 → un zéro de plus ou de moins sur la plaque
 *   CONSTRAINT     un seul cadre à la fois ; la bague s'arrête à ±12 ; la prédiction se fait AVANT le premier cran
 *   RESISTANCE     10ⁿ = 10 × n (la plaque ne montre jamais 30 pour 3 crans) ; n = nombre de chiffres (7 pour 1 000 000) ; 10⁻ⁿ négatif (le cadre rapetisse, la plaque reste positive) ; n zéros après la virgule
 *   EVIDENCE       la plaque en décimal, l'unité nommée, le décor à l'échelle, le refus « 10 000 = 1 000 × 10 »
 *   CONTRAST       z3 (réduction), z4 (retour : 0 cran), z7 (0,0000001 m avec prédiction 6 / 7 / 8)
 *   PREDICTION     « كم نقرة ؟ » avant le premier cran (z2, z7)
 *   DISCOVERY      voir E
 *   FORMALIZATION  10³ = 10 × 10 × 10 = 1 000 ; 10⁰ = 1 ; 10⁻³ = 1/10³ = 0,001
 *   TRANSFER       « جرّب أعدادك » (toujours ouvert), les exercices et la banque
 *
 * D'UN SEUL REGARD (§8bis) : `[data-tz-glance]` enveloppe la consigne, la carte, la lentille, la plaque, les boutons et le verdict.
 * ONBOARDING : `coach` (défaut true) → `LabCoach` ; `logic/tenZoom.js › coachOf` (predict · ring · plate · dock · next · free).
 * Props : `tasks`, `world` ('zoom' | 'prefixes'), `level`, `levels`, `coach`, `title`, `lead`, `onTrial(event)`, `onFinished({ world })`.
 * CONTRAT DOM : [data-ten-zoom][data-world][data-n][data-task][data-solved], [data-tz-glance], [data-tz-scene], [data-tz-lens], [data-tz-ring][role=slider], [data-tz-plate], [data-tz-side],
 * [data-tz-unit], [data-tz-tally], [data-tz-card], [data-tz-predict=<i>], [data-tz-predict-card], [data-tz-less], [data-tz-more], [data-tz-dock], [data-tz-next], [data-tz-banner],
 * [data-tz-free], [data-tz-free-input], [data-tz-formal], [data-tz-kid].
 */
const NS = 'manipulation.tenZoom';
const ring = 'outline-none focus-visible:ring-4 focus-visible:ring-amber-300';
const ltr = (s) => <bdi dir="ltr">{s}</bdi>;
const sp = (n) => T.decText({ m: BigInt(n), e: 0 });
/** Un décimal exact en LaTeX (îlot LTR dans le texte arabe) : 10\,000 · 0{,}001 */
const texs = (v) => { const [w, f] = T.decText(v).split(','); return w.replace(/\u00A0/g, '\\,') + (f ? `{,}${f}` : ''); };
const tex = (v) => `$${texs(v)}$`;
const p10tex = (nn) => tex(T.pow10(nn));

export function numbersFor({ tasks, world, level }) {
  if (world === 'prefixes') return { ...L.PRESETS.prefixes, tasks: tasks ?? L.PRESETS.prefixes.tasks };
  const lv = resolveLevelId(level ?? 'beginner');
  const asked = LEVELS['ten-zoom'][lv].numbers;
  return { ...asked, world: world ?? asked.world, tasks: tasks ?? asked.tasks };
}

export default function TenZoom({
  tasks, world, title, lead, level, levels: withLevels = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ tasks, world, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'ten-zoom', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const numsKey = JSON.stringify(nums);
  const [lab, setLab] = useState(() => L.init(nums));
  const [scene, setScene] = useState({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
  if (scene.key !== numsKey || scene.epoch !== state.epoch) {
    const restart = scene.key === numsKey && scene.rc !== state.resetCount;
    setScene({ key: numsKey, epoch: state.epoch, rc: state.resetCount });
    setLab(restart ? L.restartTask(lab) : L.init(nums));
  }
  const kind = L.discoveryKind(lab);
  useEffect(() => { if (kind) state.discover(); }, [kind, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
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
    lab: 'ten-zoom', step: coachStep,
    text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });

  const discovery = kind ? (
    <ManipulationDiscovery state={state} prompt={<MathText>{k(`discovery.${kind}.prompt`)}</MathText>} options={discoveryOptions(k, kind)} formal={<Formal k={k} />} />
  ) : null;

  return (
    <ManipulationShell
      type="ten-zoom"
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
      <ManipulationStage className="bg-gradient-to-b from-amber-50/70 to-white">
        <div className="space-y-2" data-ten-zoom data-world={lab.world} data-n={lab.n} data-task={lab.ti} data-solved={everyDone ? 'true' : 'false'}>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <Lab lab={lab} setLab={setLab} k={k} lead={state.isAuthoredLevel ? lead : null} />
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ Le laboratoire ══════════════ */

const timesWord = (kk) => (kk === 1 ? '10 مرّات' : `${p10tex(kk)} مرّة`);
const againWord = (kk) => (kk === 1 ? '' : kk === 2 ? 'مرّتين' : `${kk} مرّات`);

function cardText(card, k) {
  if ('dec' in card) return k('card.dec', { v: T.pow10Text(card.dec) });
  if ('name' in card) return k('card.name', { v: T.pow10Name(card.name) });
  if ('km' in card) return k('card.km', { v: T.decText({ m: BigInt(card.km), e: 0 }) });
  const p = T.prefixOf(card.unit);
  if (card.def) return card.unit < 0 ? k('card.unitFrac', { p: p.name, name: T.pow10Name(card.unit) }) : k('card.unitMulti', { p: p.name, name: T.pow10Name(card.unit) });
  return k('card.unit', { p: p.name });
}

function Lab({ lab, setLab, k, lead }) {
  const free = L.isFree(lab);
  const task = L.taskOf(lab);
  const done = L.taskDone(lab);
  const pending = L.predictionPending(lab);
  const prefixes = lab.world === 'prefixes';
  const ctxKey = free ? 'free' : prefixes ? 'prefixes' : lab.tasks[lab.ti]?.startAt === 'prev' ? 'carry' : lab.ti === 0 ? 'first' : 'again';
  const prompt = (
    <PromptCard size="md"
      context={<MathText>{`${free ? `${k('context.freePrefix')} ` : ''}${k(`context.${ctxKey}`)}`}</MathText>}
      contextProps={{ 'data-tz-context': ctxKey }}
      title={<MathText>{k(prefixes ? 'question.prefixes' : 'question.zoom')}</MathText>} titleClassName="text-base" lamp={free ? null : done ? 'on' : 'off'}
      titleProps={{ 'data-tz-prompt': prefixes ? 'prefixes' : 'zoom', 'data-lit': done ? 'true' : 'false' }}
      aside={lab.tasks.length > 1 && !free ? <Steps lab={lab} k={k} /> : undefined}
      instruction={lead || undefined} />
  );
  const vv = verdictOf(lab, k);
  const canNext = L.canNext(lab);
  const Icon = vv.tone === 'emerald' ? CheckCircle2 : vv.tone === 'amber' ? ShieldAlert : vv.tone === 'indigo' ? Hand : Sparkles;
  const btn = `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-black transition-all duration-150 active:translate-y-0.5 motion-reduce:transition-none ${ring}`;
  const banner = (
    <VerdictBanner tone={vv.tone} icon={Icon} size="sm" className="min-h-[2.75rem] !py-1.5" data-tz-banner data-tz-refused={vv.refused || undefined} data-code={vv.code}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <p className={vv.tone === 'indigo' ? 'font-bold text-indigo-900' : ''}><MathText>{vv.text}</MathText></p>
        <div className="flex flex-wrap items-center gap-2">
          {lab.n !== 0 && !done && (
            <button type="button" onClick={() => setLab(L.restartTask)} data-tz-retry className={`${btn} border-amber-300 bg-amber-50 text-amber-950`}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {k('retry')}
            </button>
          )}
          {!done && (
            <button type="button" disabled={pending} onClick={() => setLab(L.dock)} data-tz-dock
              className={`${btn} ${pending ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-amber-600 bg-amber-500 text-white shadow-[0_3px_0_0_#B45309]'}`}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {k('dock')}
            </button>
          )}
          {canNext && (
            <button type="button" onClick={() => setLab(L.nextTask)} data-tz-next className={`${btn} border-emerald-600 bg-emerald-600 text-white shadow-[0_3px_0_0_#047857]`}>
              {k('next')} <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </VerdictBanner>
  );

  return (
    <>
      <div className="relative space-y-2" data-tz-glance>
        {prompt}
        <MissionRow lab={lab} setLab={setLab} k={k} task={task} />
        <Scene lab={lab} setLab={setLab} k={k} />
        <Plate lab={lab} setLab={setLab} k={k} />
        {banner}
      </div>
      <FreeCard lab={lab} setLab={setLab} k={k} />
    </>
  );
}

function Steps({ lab, k }) {
  return (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti;
        return (
          <span key={tk.id} role="listitem" data-tz-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-amber-700 bg-amber-500 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-white text-amber-700'}`}>
            <bdi dir="ltr">{i + 1}</bdi>
          </span>
        );
      })}
    </div>
  );
}

/* ══════════════ La carte à atteindre et la prédiction ══════════════ */

function MissionRow({ lab, setLab, k, task }) {
  const done = L.taskDone(lab);
  const pending = L.predictionPending(lab);
  const wobble = lab.wobble && done;
  const shake = lab.flash % 2 ? 'tz-shake-a' : 'tz-shake-b';
  return (
    <div className="flex flex-wrap items-stretch gap-2" data-tz-mission>
      <div data-tz-card data-target={task.target} data-done={done ? 'true' : 'false'}
        className={`flex min-h-[48px] min-w-0 flex-1 items-center gap-2 rounded-2xl border-[3px] px-3 py-1.5 ${wobble ? shake : ''} ${done ? 'border-emerald-500 bg-emerald-50' : 'border-amber-400 bg-amber-50'}`}>
        <span className="text-xs font-black text-amber-900">{k('card.label')}</span>
        <span className="min-w-0 text-lg font-black text-amber-950" dir="rtl"><MathText>{cardText(task.card, k)}</MathText></span>
        {done && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" data-tz-stamp />}
      </div>
      {task.predict && !done && (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5" data-tz-predict-card role="group" aria-label={k(`predict.${task.predict.q}`)}>
          <span className="text-xs font-black text-indigo-950">{k(`predict.${task.predict.q}`)}</span>
          {task.predict.options.map((o, i) => (
            <button key={o} type="button" data-tz-predict={i} aria-pressed={lab.pick === i} disabled={!pending} onClick={() => setLab((s) => L.choosePrediction(s, i))}
              className={`min-h-[40px] min-w-[52px] rounded-xl border-2 px-2.5 text-base font-black tabular-nums ${ring} ${lab.pick === i ? 'border-indigo-700 bg-indigo-600 text-white' : pending ? 'border-indigo-300 bg-white text-indigo-950' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
              <bdi dir="ltr">{sp(o)}</bdi>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════ La scène : table, lentille, bague, cadre, décor ══════════════ */

function Scene({ lab, setLab, k }) {
  const clipId = useId().replace(/:/g, '');
  const svgRef = useRef(null);
  const done = L.taskDone(lab);
  const blocked = done || L.predictionPending(lab);
  const [acc, setAcc] = useState(0);
  const drag = useRef(null);
  const pinch = useRef({ pts: new Map(), d0: null });
  const wheelAt = useRef(0);
  const n = lab.n;
  const hasScene = SCENE_IDS.includes(n);
  const mood = done ? 'proud' : lab.last?.kind === 'refused' ? 'wonder' : lab.last?.kind === 'notch' ? 'wonder' : 'happy';
  const angle = n * NOTCH_DEG + acc;

  const toSvg = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  };
  const angleOf = (e) => { const p = toSvg(e); return (Math.atan2(p.x - CX, -(p.y - CY)) * 180) / Math.PI; };
  const onRingDown = (e) => {
    if (blocked) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { last: angleOf(e), acc: 0 };
  };
  const onRingMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const a = angleOf(e);
    let delta = a - d.last;
    if (delta > 180) delta -= 360; else if (delta < -180) delta += 360;
    d.last = a; d.acc += delta;
    while (d.acc >= NOTCH_DEG) { d.acc -= NOTCH_DEG; setLab((s) => L.notch(s, 1)); }
    while (d.acc <= -NOTCH_DEG) { d.acc += NOTCH_DEG; setLab((s) => L.notch(s, -1)); }
    setAcc(Math.max(-NOTCH_DEG / 2, Math.min(NOTCH_DEG / 2, d.acc)));
  };
  const onRingUp = () => { drag.current = null; setAcc(0); };
  const onRingKey = (e) => {
    if (blocked) return;
    const up = ['ArrowRight', 'ArrowUp', '+', '=', 'PageUp'];
    const down = ['ArrowLeft', 'ArrowDown', '-', '−', 'PageDown'];
    if (up.includes(e.key)) { e.preventDefault(); setLab((s) => L.notch(s, 1)); } else if (down.includes(e.key)) { e.preventDefault(); setLab((s) => L.notch(s, -1)); }
  };
  /* pincement (tablette) : écarter = cadre plus petit ; rapprocher = cadre plus grand */
  const onLensDown = (e) => {
    if (e.pointerType === 'mouse' || blocked) return;
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch { /* pointeur déjà levé */ }
    pinch.current.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.pts.size === 2) pinch.current.d0 = pinchDist(pinch.current.pts);
  };
  const onLensMove = (e) => {
    const p = pinch.current;
    if (!p.pts.has(e.pointerId)) return;
    p.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (p.pts.size !== 2 || !p.d0) return;
    const d = pinchDist(p.pts);
    if (d > p.d0 * 1.45) { p.d0 = d; setLab((s) => L.notch(s, -1)); } else if (d < p.d0 / 1.45) { p.d0 = d; setLab((s) => L.notch(s, 1)); }
  };
  const onLensUp = (e) => { pinch.current.pts.delete(e.pointerId); pinch.current.d0 = null; };
  /* molette (portable) : vers le haut = zoom avant = cadre plus petit */
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelAt.current < 140) return;
      wheelAt.current = now;
      setLab((s) => L.notch(s, e.deltaY < 0 ? -1 : 1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [setLab]);

  const frameX = CX - FRAME / 2;
  const frameY = CY - FRAME / 2;
  const old = lab.epoch > 0 && lab.dir !== 0 ? lab.prevN : null;
  const place = `translate(${frameX} ${frameY}) scale(${FRAME / 200})`;

  return (
    <StageFrame className="min-w-0 overflow-hidden !p-1.5" data-tz-stage>
      <div dir="ltr" data-tz-scene>
        <svg ref={svgRef} viewBox={`0 14 ${VB_W} ${VB_H - 34}`} className="block h-auto w-full max-h-[38vh]" role="group" aria-label={k('scene.aria')} data-tz-lens-svg style={{ touchAction: 'none' }}>
          <defs>
            <clipPath id={`lens${clipId}`}><circle cx={CX} cy={CY} r={R_IN - 2} /></clipPath>
            <clipPath id={`frame${clipId}`}><rect x={frameX} y={frameY} width={FRAME} height={FRAME} /></clipPath>
            <pattern id={`hatch${clipId}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#E2E8F0" /><line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" strokeWidth="3" /></pattern>
          </defs>
          <Bench />
          <g data-tz-kid aria-hidden="true">
            <KidFigure cx={62} top={206} foot={326} hairStyle="hijab" scarf="lavender" outfit="violet" skin="medium" mood={mood} />
          </g>
          <g clipPath={`url(#lens${clipId})`} data-tz-lens data-n={n}>
            <rect x={CX - R_IN} y={CY - R_IN} width={2 * R_IN} height={2 * R_IN} fill={`url(#hatch${clipId})`} />
            <g clipPath={`url(#frame${clipId})`}>
              <rect x={frameX} y={frameY} width={FRAME} height={FRAME} fill="#F8FAFC" />
              <g transform={place}>
                {old !== null && <g key={`o${lab.epoch}`} className="tz-old" style={{ '--tz-f': lab.dir > 0 ? 0.1 : 10 }}><Vignette n={old} /></g>}
                <g key={`n${lab.epoch}`} className={old !== null ? 'tz-new' : undefined}><Vignette n={n} /></g>
              </g>
              {!hasScene && <text x={CX} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569" data-tz-noscene>{k('scene.none')}</text>}
            </g>
            <Frame />
            <path d={`M${CX - R_IN} ${CY - R_IN} h${2 * R_IN} v${2 * R_IN} h${-2 * R_IN} Z M${frameX} ${frameY} v${FRAME} h${FRAME} v${-FRAME} Z`} fill="#0F172A" opacity=".18" fillRule="evenodd" />
            <path d={`M${CX - 96} ${CY - 70} A 110 110 0 0 1 ${CX - 20} ${CY - 112}`} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".55" />
          </g>
          <circle cx={CX} cy={CY} r={R_IN - 2} fill="transparent" data-tz-lens-hit onPointerDown={onLensDown} onPointerMove={onLensMove} onPointerUp={onLensUp} onPointerCancel={onLensUp} />
          <Ring angle={angle} active={!blocked} />
          <g data-tz-ring role="slider" tabIndex={blocked ? -1 : 0} aria-label={k('ring.aria')} aria-valuemin={L.N_MIN} aria-valuemax={L.N_MAX} aria-valuenow={n} aria-valuetext={`${T.pow10Text(n)} ${k('plate.m')}`} aria-disabled={blocked}
            onPointerDown={onRingDown} onPointerMove={onRingMove} onPointerUp={onRingUp} onPointerCancel={onRingUp} onKeyDown={onRingKey}
            className="outline-none focus-visible:[&>circle]:stroke-amber-400" style={{ cursor: blocked ? 'default' : 'grab', touchAction: 'none' }}>
            <circle cx={CX} cy={CY} r={(R_IN + R_OUT) / 2} fill="none" stroke="transparent" strokeWidth={R_OUT - R_IN + 10} pointerEvents="stroke" />
          </g>
        </svg>
      </div>
    </StageFrame>
  );
}

const pinchDist = (pts) => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };

/* ══════════════ La plaque de laiton et les boutons ══════════════ */

function Plate({ lab, setLab, k }) {
  const n = lab.n;
  const done = L.taskDone(lab);
  const blocked = done || L.predictionPending(lab);
  const txt = T.pow10Text(n);
  const pill = L.unitPill(n, lab.world);
  const sceneName = SCENE_IDS.includes(n) ? k(`scene.names.${n}`) : null;
  const ring2 = 'inline-flex h-12 min-w-[52px] shrink-0 items-center justify-center rounded-full border-[3px] border-amber-600 bg-white px-2 text-base font-black text-amber-950 shadow-[0_3px_0_0_rgba(180,83,9,0.45)] disabled:border-slate-200 disabled:text-slate-300 disabled:shadow-none';
  const big = txt.length > 17;
  return (
    <div className="flex items-stretch gap-1.5" data-tz-controls>
      <button type="button" data-tz-less disabled={blocked || n <= L.N_MIN} onClick={() => setLab((s) => L.notch(s, -1))} className={`${ring2} ${ring}`} aria-label={k('less.aria')}>
        <bdi dir="ltr">÷10</bdi>
      </button>
      <div className="min-w-0 flex-1 rounded-2xl border-[3px] border-amber-700 bg-gradient-to-b from-amber-200 to-amber-400 px-3 py-1.5 text-center shadow-inner" data-tz-plate data-n={n}>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="text-xs font-black text-amber-950">{k('plate.label')}</span>
          <output className={`font-black tabular-nums text-amber-950 ${big ? 'text-xl' : 'text-2xl'}`} data-tz-side data-value={T.pow10Text(n, { group: false })}>
            <bdi dir="ltr">{[...txt].map((c, i) => <span key={`${i}-${n < 0 ? 'n' : 'p'}`} className={`inline-block ${c === '1' ? 'rounded bg-amber-50 px-0.5 text-amber-700 ring-2 ring-amber-600' : ''} ${i === txt.length - 1 || c === '1' ? 'tz-new' : ''}`}>{c}</span>)}</bdi>{' '}<span className="text-lg">{k('plate.m')}</span>
          </output>
          {pill && <span className="rounded-full border-2 border-amber-800 bg-amber-100 px-2 py-0.5 text-sm font-black text-amber-950" data-tz-unit>{pill}</span>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs font-bold text-amber-900">
          {lab.tally && n !== 0 && <span data-tz-tally dir="ltr" className="tabular-nums">{L.tallyOf(n)}</span>}
          {sceneName && <span data-tz-scenename>{sceneName}</span>}
        </div>
      </div>
      <button type="button" data-tz-more disabled={blocked || n >= L.N_MAX} onClick={() => setLab((s) => L.notch(s, 1))} className={`${ring2} ${ring}`} aria-label={k('more.aria')}>
        <bdi dir="ltr">×10</bdi>
      </button>
    </div>
  );
}

/* ══════════════ Le verdict (la bannière) ══════════════ */

function verdictOf(lab, k) {
  const free = L.isFree(lab);
  const task = L.taskOf(lab);
  const last = lab.last;
  const note = free ? ` ${k('v.freeNote')}` : '';
  const side = (nn) => `${p10tex(nn)} ${k('plate.m')}`;
  if (last?.kind === 'refused') {
    const x = side(last.n); const tg = side(last.target);
    if (last.reason === 'over') return { text: k('refuse.over', { x, t: tg, r: timesWord(last.k), eq: `$${texs(T.pow10(last.n))} = ${texs(T.pow10(last.target))} \\times ${texs(T.pow10(last.k))}$` }) + note, tone: 'amber', code: 'over', refused: 'over' };
    if (last.reason === 'under') return { text: k(last.k === 1 ? 'refuse.under1' : 'refuse.under', { x, k: againWord(last.k) }) + note, tone: 'amber', code: 'under', refused: 'under' };
    return { text: k('refuse.direction', { x, rel: k(task.target < 0 ? 'refuse.smaller' : 'refuse.bigger'), dir: k(task.target < 0 ? 'refuse.shrink' : 'refuse.grow') }) + note, tone: 'amber', code: 'direction', refused: 'direction' };
  }
  if (L.taskDone(lab)) {
    const base = k('v.solved', { x: side(last?.n ?? lab.n) });
    if (lab.wobble) return { text: `${base} ${k('v.wobble', { c: lab.wobble.count, v: T.decText({ m: BigInt(lab.wobble.choice), e: 0 }) })}`, tone: 'emerald', code: 'solved' };
    return { text: base + note, tone: 'emerald', code: 'solved' };
  }
  if (last?.kind === 'limit') return { text: k('v.limit'), tone: 'amber', code: 'limit' };
  if (last?.kind === 'custom') return { text: k('v.custom') , tone: 'indigo', code: 'custom' };
  if (L.predictionPending(lab)) return { text: k('idle.predict'), tone: 'indigo', code: 'predict' };
  if (lab.n === 0) return { text: k('idle.start'), tone: 'indigo', code: 'start' };
  return { text: k('idle.moved', { x: side(lab.n) }), tone: 'indigo', code: 'moved' };
}

/* ══════════════ « جرّب أعدادك » : toujours ouvert ══════════════ */

function FreeCard({ lab, setLab, k }) {
  const free = L.isFree(lab);
  const [txt, setTxt] = useState('');
  const [bad, setBad] = useState(null);
  const add = () => {
    const v = L.validateFree(txt);
    if (!v.ok) { setBad(v.why === 'empty' ? null : v.why); return; }
    setBad(null); setLab((s) => L.setFree(s, txt));
  };
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } };
  return (
    <LabCard className="space-y-2 border-amber-200 bg-amber-50/50 p-3" data-tz-free data-active={free ? 'true' : 'false'}>
      <p className="flex items-center gap-1.5 text-sm font-black text-amber-950"><FlaskConical className="h-4 w-4" aria-hidden="true" /> {k('free.title')}</p>
      <p className="text-xs font-bold leading-snug text-slate-600">{free ? k('free.on') : k('free.hint')}</p>
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        <label className="flex flex-col gap-1 text-xs font-black text-amber-950">
          <span>{k('free.label')}</span>
          <input type="text" inputMode="text" autoComplete="off" dir="ltr" value={txt} onChange={(e) => setTxt(e.target.value.slice(0, 40))} onKeyDown={onKey} data-tz-free-input aria-label={k('free.aria')} aria-invalid={!!bad}
            placeholder="0,0001" className={`h-11 w-56 max-w-full rounded-xl border-2 ${bad ? 'border-rose-300' : 'border-amber-300'} bg-white px-2 text-start text-lg font-black tabular-nums text-amber-950 ${ring}`} />
        </label>
        <button type="button" onClick={add} data-tz-free-add className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-amber-500 bg-white px-3 text-sm font-black text-amber-950 ${ring}`}>
          <Plus className="h-4 w-4" aria-hidden="true" /> {k('free.add')}
        </button>
        {free && (
          <button type="button" onClick={() => setLab(L.toGuided)} data-tz-free-back className={`inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-amber-200 bg-white px-3 text-xs font-bold text-amber-950 ${ring}`}>
            <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('free.back')}
          </button>
        )}
      </div>
      {bad && <p role="alert" className="text-sm font-bold text-rose-700" data-tz-free-refusal={bad}>{k(`free.refusal.${bad}`)}</p>}
    </LabCard>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

export function discoveryOptions(k, kind = 'count') {
  if (kind === 'rank') {
    return [
      { text: <MathText>{k('discovery.rank.zeros')}</MathText>, why: <MathText>{k('discovery.rank.whyZeros')}</MathText> },
      { text: <MathText>{k('discovery.rank.third')}</MathText>, correct: true },
      { text: <MathText>{k('discovery.rank.neg')}</MathText>, why: <MathText>{k('discovery.rank.whyNeg')}</MathText> },
    ];
  }
  return [
    { text: <MathText>{k('discovery.count.digits')}</MathText>, why: <MathText>{k('discovery.count.whyDigits')}</MathText> },
    { text: <MathText>{k('discovery.count.zeros')}</MathText>, correct: true },
    { text: <MathText>{k('discovery.count.div')}</MathText>, why: <MathText>{k('discovery.count.whyDiv')}</MathText> },
  ];
}

export function Formal({ k }) {
  return (
    <div className="space-y-2 text-sm font-bold text-amber-950" data-tz-formal>
      <p><MathText>{k('formal.pos')}</MathText></p>
      <p><MathText>{k('formal.zero')}</MathText></p>
      <p><MathText>{k('formal.neg')}</MathText></p>
      <p><MathText>{k('formal.read')}</MathText></p>
    </div>
  );
}
