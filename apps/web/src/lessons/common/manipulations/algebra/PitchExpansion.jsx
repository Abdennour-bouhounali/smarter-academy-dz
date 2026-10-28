import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, CheckCircle2 } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import useDragInteraction from '../useDragInteraction';
import DraggableObject from '../primitives/DraggableObject';
import DropZone from '../primitives/DropZone';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import { evaluate, reduce as reducePoly, mulTerms, samePolynomial, termsTex } from '@smarter-academy/core/arithmetic/polynomials.js';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { bidi } from '../../../../utils/bidi';
import * as L from '../logic/pitchExpansion';

/**
 * pitch-expansion — LE TERRAIN DÉCOUPÉ (unité 3 « الحساب الحرفي », leçons 1 et 2).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève ÉTIRE x (la règle : le terrain grandit), PORTE chaque zone du
 *    terrain dans « المجموع », puis POSE un terme sur un terme semblable pour
 *    les réunir. Clavier et toucher-toucher font les mêmes gestes.
 * B. Idée : l'aire d'un rectangle de côtés (a + b) et (c + d) est la somme des
 *    aires de ses zones — k(a + b) = ka + kb, (a + b)(c + d) = ac + ad + bc + bd,
 *    et les trois identités remarquables quand les côtés sont (a ± b).
 * C. Pendant l'étirement, chaque zone change de taille et d'aire ; une zone
 *    portée se grise sur le terrain et son terme s'écrit dans la somme.
 * D. « تحقّق » écrit l'égalité aire du terrain = somme portée, POUR LE x À
 *    L'ÉCRAN, ou la refuse en allumant les zones oubliées avec leur aire.
 * E. À découvrir : l'égalité tient pour TOUTES les valeurs de x (deux x
 *    vérifiés au moins) — c'est ce qui fait d'elle une identité (متطابقة).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        développer = écrire l'aire d'un rectangle comme somme d'aires
 *   OBJECT         un terrain de football découpé par les termes de ses côtés
 *   VARIABLE       x (étiré) ; quelles zones sont portées ; quels termes réunis
 *   INVARIANT      l'aire du terrain = le produit, quel que soit x
 *   TRANSFORMATION la somme portée, terme à terme, puis réduite
 *   CONSTRAINT     on ne réunit que des termes semblables (même puissance)
 *   RESISTANCE     « x² و 3x ليسا حدّين متشابهين » ; une somme incomplète est
 *                  trop petite, et les zones oubliées s'allument (les deux
 *                  bandes ab de l'erreur (a + b)² = a² + b²)
 *   EVIDENCE       aire = somme, nombres à l'appui, pour le x à l'écran
 *   CONTRAST       deux valeurs de x vérifiées ; une somme fausse refusée
 *   PREDICTION     « combien de zones ? » : le terrain les montre avant le calcul
 *   DISCOVERY      k(a + b) = ka + kb ; (a + b)(c + d) = ac + ad + bc + bd ;
 *                  (a ± b)² = a² ± 2ab + b² ; (a + b)(a − b) = a² − b²
 *   FORMALIZATION  معارف 1 et 2 (p. 34)
 *   TRANSFER       تمارين 1–19 (p. 37–38), الحساب المتمعن فيه (21², 105 × 95)
 *
 * QUESTIONS PENDANT LE LABO (prototype `primitives/LabCheckpoint`, déploiement lot 2, 2026-10-28) : le labo n'a qu'UNE scène libre (pas de tâches
 * successives) ; quand la découverte est atteinte (zones toutes portées, somme réduite, égalité vérifiée pour deux x), une suite unique se pose
 * PAR-DESSUS le labo et retient la règle : combien de zones · l'aire du terrain pour SON x · la forme développée (les mauvaises options sont
 * les erreurs réelles : oublier des zones, ignorer le signe −, tout multiplier par un seul terme…, chacune réfutée par SES nombres) · LA RÈGLE
 * (l'ancienne découverte, qui formalise). Obligatoires pour tout élève ; l'enseignant seul les coupe pour SON compte (`checkpoints` = false
 * les coupe aussi). `onCheckpoint(ev)` : `{ tk: 'checkpoint' | 'checkpoint-done', id: expr, … }` pour la trace des étapes du module. ÉTAPES `LabStepper` (`[data-pe-step=<i>]` : porter · vérifier une fois · un autre x + questions) + fête ; « إعادة » repart de
 * zéro ; « أعِد التجربة » remet le terrain au départ. SON : `tooth` (zone portée, x bougé), `bell` (deux termes réunis), `flag` (égalité
 * vérifiée), `over` (refus, somme trop petite).
 *
 * DÉCOR (demande du propriétaire, 2026-10-01) : la pelouse, les buts et un
 * ballon qu'on peut taper. Le décor ne porte AUCUNE information : il est
 * `aria-hidden`, hors du parcours clavier, et `prefers-reduced-motion`
 * l'immobilise. Le ballon roule vers la dernière zone portée et entre dans le
 * but quand l'égalité est vérifiée — la joie du geste, jamais un verdict.
 */
export default function PitchExpansion({
  expr: expr0 = '3x-1|3+x', simplify = true, letter = 'x', span = 5, title, lead, mission, level, levels: withLevels = true, checkpoints: cpOn = true,
  initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, onCheckpoint,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.pitchExpansion.${key}`, o), [t]);
  const state = useManipulation({ type: 'pitch-expansion', initialNumbers: { expr: expr0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { expr } = state.numbers;

  const [lab, setLab] = useState(() => L.init({ expr: expr0, simplify }));
  const sceneKey = `${expr}:${simplify}:${state.epoch}:${state.resetCount}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const range = useMemo(() => L.xRange(L.parseExpr(expr), span), [expr, span]);
  const [x, setX] = useState(Math.min(range.min + 2, range.max));
  const [live, setLive] = useState(null);
  const [notice, setNotice] = useState(null);
  const [kick, setKick] = useState(0);
  // « إعادة » (resetCount), un autre niveau ou d'autres nombres : TOUT recommence — le terrain, les essais et les questions du labo
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); setLab(L.init({ expr, simplify })); setX(Math.min(range.min + 2, range.max)); setLive(null); setNotice(null); }

  const ready = L.discoveryReady(lab);
  // les questions pendant le labo : une suite unique quand la découverte est atteinte ; celle qui finit par la règle remplace la découverte automatique
  const cpSettings = useLabCheckpointSettings('pitch-expansion');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const cpLive = cpOn && cpSettings.enabled;
  const chain = cpLive ? CHAIN : null;
  const cp = useLabCheckpoint({
    id: chain ? expr : null,
    questions: chain && ready ? chain.map((q) => QUESTIONS[q](lab, k, letter)) : null,
    reached: ready,
    resetKey: scene.inits,
    onRetry: () => { setLab(L.init({ expr, simplify })); setX(Math.min(range.min + 2, range.max)); setLive(null); setNotice(null); },
    onEvent: (ev) => state.report(onCheckpoint, ev),   // {tk:'checkpoint'|'checkpoint-done', id: expr, …} — la TRACE que les étapes du module relisent
    onDone: () => { state.discover(); state.formalize(); },
  });
  useEffect(() => { if (ready && !cpLive) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, expr); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // une étape est FAITE quand son objectif est atteint ET (la dernière) ses questions répondues : la pastille passe au vert et on fête
  const nVerified = L.verifiedXs(lab).length;
  const stepDone = [L.sumReady(lab), L.sumReady(lab) && nVerified >= 1, ready && !cp.blocking];
  const nDone = stepDone.findIndex((d) => !d) < 0 ? stepDone.length : stepDone.findIndex((d) => !d);
  const party = useStepCelebration();
  const celebrated = useRef({ n: 0, inits: scene.inits });
  if (celebrated.current.inits !== scene.inits) celebrated.current = { n: 0, inits: scene.inits };   // « إعادة » : on refête
  useEffect(() => {
    if (nDone <= celebrated.current.n) return;
    celebrated.current.n = nDone;
    party.celebrate({ n: nDone, total: stepDone.length });
  }, [nDone]); // eslint-disable-line react-hooks/exhaustive-deps
  // le son du geste (muet sans « الصوت ») : zone portée, x bougé (au plus un toutes les 35 ms) ; deux termes réunis ; l'égalité vérifiée ; un refus
  const heard = useRef({ at: 0, x: null });
  const tick = () => { const now = Date.now(); if (now - heard.current.at > 35) { playSfx('tooth'); heard.current.at = now; } };

  /* ── mesure ── */
  const boxRef = useRef(null);
  const [width, setWidth] = useState(320);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(260, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── la règle de x ── */
  const EDGE = 22;
  const steps = Math.max(1, range.max - range.min);
  const mu = (width - 2 * EDGE) / steps;
  const xOf = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: live ?? x, range, toValue, onChange: setLive,
    onCommit: (v) => { setLive(null); setX(v); setNotice(null); },
    direction: 'ltr',
  });
  const xx = live ?? x;
  useEffect(() => { if (heard.current.x !== null && heard.current.x !== xx) tick(); heard.current.x = xx; }, [xx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── le terrain ── */
  const geo = L.zones(lab, xx);
  const geoMax = L.zones(lab, range.max);  // le terrain est dessiné dans la boîte du plus grand x de la règle
  const unit = Math.min(34, (width - 56) / Math.max(1, geoMax.width), 300 / Math.max(1, geoMax.height));
  const PAD = 26;
  const W = geo.width * unit; const H = geo.height * unit;
  const svgW = geoMax.width * unit + 2 * PAD; const svgH = geoMax.height * unit + 2 * PAD;
  const lastTrial = lab.trials.find((tr) => tr.x === x);
  const glow = lastTrial && !lastTrial.ok && !live ? new Set(lastTrial.missing) : new Set();

  /* ── les gestes : porter une zone, réunir deux termes ── */
  const onReject = (_s, _z, reason) => { setNotice(reason ? { tone: 'ko', key: reason } : null); if (reason) playSfx('over'); };
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      if (src.startsWith('z:') && zone === 'sum') { const v = L.canCollect(lab, src.slice(2)); return v === true ? true : v; }
      if (src.startsWith('c:') && zone.startsWith('chip:')) { const v = L.canMerge(lab, src.slice(2), zone.slice(5)); return v === true ? true : v; }
      return '';
    },
    onDrop: (src, zone) => {
      if (src.startsWith('z:')) { setLab((s) => L.collect(s, src.slice(2))); setKick((n) => n + 1); tick(); }
      else if (src.startsWith('c:')) { setLab((s) => L.merge(s, src.slice(2), zone.slice(5))); playSfx('bell'); }
      setNotice(null);
    },
    onReject,
  });

  /**
   * Toucher (ou Entrée sur) un terme de la somme PENDANT qu'on tient autre chose,
   * c'est poser ce qu'on tient : sur ce terme s'il s'agit d'un terme (réunir), dans
   * la somme s'il s'agit d'une zone. Sans cela, la cible — un bouton porté lui
   * aussi — devenait le nouvel objet tenu, et la fusion n'était possible qu'au
   * glisser (ni au toucher, ni au clavier).
   */
  const chipTarget = (chipId) => {
    const held = drag.held;
    if (!held || drag.dragging || held === `c:${chipId}`) return null;
    if (held.startsWith('c:')) return `chip:${chipId}`;
    if (held.startsWith('z:')) return 'sum';
    return null;
  };
  const interceptChip = (chipId) => {
    const stop = (e) => { if (chipTarget(chipId)) { e.stopPropagation(); e.preventDefault(); } };
    return {
      onPointerDownCapture: stop,
      onPointerUpCapture: stop,
      onClickCapture: (e) => { const z = chipTarget(chipId); if (z) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); } },
      onKeyDownCapture: (e) => {
        const z = chipTarget(chipId);
        if (z && (e.key === 'Enter' || e.key === ' ')) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); }
      },
    };
  };

  // Miroir synchrone de `lab` pour « جرّب كل الإمكانيات » : chaque x de la règle est vérifié comme par « تحقّق ».
  const labRef = useRef(lab);
  labRef.current = lab;
  const sweepX = (v) => {
    const next = L.verify(labRef.current, v);
    labRef.current = next;
    setLab((s) => L.verify(s, v));
    setX(v); setLive(null);
    const trial = next.trials.find((tr) => tr.x === v);
    state.report(onTrial, trial);
    playSfx(trial.ok ? 'flag' : 'over');
    setNotice({ tone: trial.ok ? 'ok' : 'ko', key: trial.ok ? 'verified' : 'incomplete', trial });
  };
  const untriedX = L.untriedXs(lab, range);

  const check = () => {
    const next = L.verify(lab, x);
    setLab(next);
    const trial = next.trials.find((tr) => tr.x === x);
    state.report(onTrial, trial);
    playSfx(trial.ok ? 'flag' : 'over');
    setNotice({ tone: trial.ok ? 'ok' : 'ko', key: trial.ok ? 'verified' : 'incomplete', trial });
  };

  const tex = (term) => `$${L.cellTex({ term }, letter)}$`;
  const valueOf = (term) => term.c * xx ** term.p;
  const productTex = L.productTex(lab, letter);
  const sumTex = L.trayTex(lab, letter);
  const reasonText = (key) => (key === 'notLike' ? k('notLike') : key === 'already' ? k('already') : key === 'notYet' ? k('notYet') : null);

  const discoveryKind = lab.kind;
  const kindKey = { distributive: 'dist', double: 'double', 'square-sum': 'sqSum', 'square-diff': 'sqDiff', 'sum-diff': 'sumDiff' }[discoveryKind];

  const ballZone = lab.collected.length ? geo.zones.find((z) => z.id === lab.collected.at(-1)) : null;
  const scored = lastTrial?.ok && !live;
  const ball = scored
    ? { cx: PAD + W + 10, cy: PAD + H / 2 }
    : ballZone ? { cx: PAD + (ballZone.x0 + ballZone.w / 2) * unit, cy: PAD + (ballZone.y0 + ballZone.h / 2) * unit + 12 }
      : { cx: PAD + W / 2 + ((kick % 3) - 1) * 14, cy: PAD + H / 2 };

  return (
    <ManipulationShell
      type="pitch-expansion"
      title={bidi(title ?? k('title'))}
      mission={mission ?? k(`mission_${kindKey}`)}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpSettings.control}
      guided={!!chain}
      hints={[k('hint1'), k(simplify ? 'hint2' : 'hint2NoMerge'), k('hint3')].map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        autoComplete: L.sumReady(lab) ? {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: untriedX.length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const v = L.untriedXs(labRef.current, range)[0]; if (v !== undefined) sweepX(v); },
          finish: () => { L.untriedXs(labRef.current, range).forEach(sweepX); },
        } : undefined,
      }}
      representation={notice?.trial && (notice.trial.ok
        ? <EquationDisplay tone="ok" tex={`${productTex} = ${sumTex}`} note={<MathText>{k('verifiedNote', { x: notice.trial.x, product: L.valueText(notice.trial.product), sum: L.valueText(notice.trial.sum) })}</MathText>} />
        : <EquationDisplay tone="ko" tex={`${L.valueText(notice.trial.sum)} \\neq ${L.valueText(notice.trial.product)}`} note={<MathText>{k(notice.trial.missing.length ? 'incompleteNote' : 'wrongNote', { x: notice.trial.x, n: notice.trial.missing.length })}</MathText>} />)}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k(`${kindKey}Prompt`)}
          options={discoveryOptions(lab, k)}
          formal={<Formal lab={lab} k={k} letter={letter} />}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/70 to-white" data-dragging={stretch.dragging || drag.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="relative space-y-3" data-pitch-expansion data-kind={lab.kind}>
          {party.node}
          {cp.node}
          <LabStepper count={stepDone.length} current={Math.min(nDone, stepDone.length - 1)} done={stepDone} stepAttr="data-pe-step" />
          {/* ── la règle de x ── */}
          <p className="text-sm font-bold text-slate-700"><MathText>{k('ruler', { letter })}</MathText></p>
          <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 60 }} data-pitch-ruler>
            <svg width={width} height={60} className="absolute inset-0" aria-hidden="true" focusable="false">
              <rect x={EDGE - 4} y={26} width={steps * mu + 8} height={5} rx={2} fill="#047857" />
              {Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).map((v) => {
                const tr = lab.trials.find((u) => u.x === v);
                return (
                  <g key={v}>
                    <line x1={xOf(v)} x2={xOf(v)} y1={33} y2={41} stroke="#64748B" />
                    <text x={xOf(v)} y={55} textAnchor="middle" fontSize={11} fill={tr ? (tr.ok ? '#047857' : '#BE123C') : '#334155'} fontWeight={tr ? 'bold' : 'normal'} fontFamily="ui-monospace, monospace">{v}</text>
                  </g>
                );
              })}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle', { letter }), valueText: k('valueText', { letter, x: xx }) })}
              className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
              style={{ left: xOf(xx), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span className="-mt-2 rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-pitch-x>{xx}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('smaller', { letter })} disabled={xx <= range.min} data-pitch-less
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[8rem] text-center text-sm font-bold text-slate-700" dir="ltr">{letter} = {xx}</p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('bigger', { letter })} disabled={xx >= range.max} data-pitch-more
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>

          {/* ── le terrain ── */}
          <div className="overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-1" dir="ltr">
            <div className="relative mx-auto" style={{ width: svgW, height: svgH, maxWidth: '100%' }} data-pitch-field data-x={xx}>
              <svg width={svgW} height={svgH} className="absolute inset-0" role="img" aria-label={k('ariaPitch', { product: productTex.replace(/\\/g, ''), x: xx, area: L.valueText(L.product(lab, xx)) })}>
                <defs>
                  <pattern id="pe-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="#FFE4E6" fillOpacity="0.55" /><line x1="0" y1="0" x2="0" y2="8" stroke="#E11D48" strokeWidth="2.5" />
                  </pattern>
                  <pattern id="pe-cross" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="8" height="8" fill="#DCFCE7" fillOpacity="0.6" /><path d="M0 0L8 8M8 0L0 8" stroke="#15803D" strokeWidth="1.6" />
                  </pattern>
                </defs>
                {/* décor : bandes de tonte, lignes, buts — aria-hidden via le role=img parent */}
                <g data-decor>
                  {Array.from({ length: Math.max(2, Math.ceil(W / 26)) }, (_, i) => (
                    <rect key={i} x={PAD + i * 26} y={PAD} width={Math.min(26, W - i * 26)} height={H} fill={i % 2 ? '#16A34A' : '#22C55E'} />
                  ))}
                  <rect x={PAD} y={PAD} width={W} height={H} fill="none" stroke="#fff" strokeWidth={2.5} />
                  <line x1={PAD + W / 2} x2={PAD + W / 2} y1={PAD} y2={PAD + H} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
                  <circle cx={PAD + W / 2} cy={PAD + H / 2} r={Math.min(H, W) / 6} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
                  <rect x={PAD - 10} y={PAD + H / 2 - Math.min(24, H / 4)} width={10} height={Math.min(48, H / 2)} fill="#F8FAFC" stroke="#94A3B8" />
                  <rect x={PAD + W} y={PAD + H / 2 - Math.min(24, H / 4)} width={10} height={Math.min(48, H / 2)} fill={scored ? '#FEF3C7' : '#F8FAFC'} stroke={scored ? '#F59E0B' : '#94A3B8'} />
                </g>
                {/* les zones : leurs aires SONT la mathématique */}
                {geo.zones.map((z) => {
                  const taken = lab.collected.includes(z.id);
                  const on = glow.has(z.id);
                  return (
                    <g key={z.id} data-pitch-zone={z.id} data-taken={String(taken)} data-missing={on ? 'true' : undefined}>
                      <rect x={PAD + z.x0 * unit} y={PAD + z.y0 * unit} width={z.w * unit} height={z.h * unit}
                        fill={z.restored ? 'url(#pe-cross)' : z.removed ? 'url(#pe-hatch)' : taken ? '#FFFFFF' : 'transparent'}
                        fillOpacity={taken && !z.removed && !z.restored ? 0.35 : 1}
                        stroke={on ? '#F59E0B' : '#FFFFFF'} strokeWidth={on ? 4 : 1.5} strokeDasharray={on ? undefined : '5 4'} />
                    </g>
                  );
                })}
                {/* les côtés : un segment par terme, étiqueté */}
                {geo.zones.filter((z) => z.j === 0).map((z) => (
                  <text key={`c${z.i}`} x={PAD + (z.x0 + z.w / 2) * unit} y={PAD - 8} textAnchor="middle" fontSize={12} fontWeight="bold" fill={lab.factors[0][z.i].c < 0 ? '#BE123C' : '#065F46'} fontFamily="ui-monospace, monospace">
                    {L.cellTex({ term: lab.factors[0][z.i] }, letter)}
                  </text>
                ))}
                {geo.zones.filter((z) => z.i === 0).map((z) => (
                  <text key={`r${z.j}`} x={PAD - 14} y={PAD + (z.y0 + z.h / 2) * unit + 4} textAnchor="end" fontSize={12} fontWeight="bold" fill={lab.factors[1][z.j].c < 0 ? '#BE123C' : '#065F46'} fontFamily="ui-monospace, monospace">
                    {L.cellTex({ term: lab.factors[1][z.j] }, letter)}
                  </text>
                ))}
                {/* décor : le ballon */}
                <g data-decor style={{ transition: 'transform 450ms cubic-bezier(.2,.8,.3,1)', transform: `translate(${ball.cx}px, ${ball.cy}px)` }} className="motion-reduce:transition-none">
                  <circle r={7} fill="#fff" stroke="#0F172A" strokeWidth={1.4} />
                  <path d="M0 -3 L3 -1 L2 3 L-2 3 L-3 -1 Z" fill="#0F172A" />
                </g>
              </svg>
              {/* sources HTML au-dessus des zones (clavier, lecteur d'écran) */}
              {geo.zones.map((z) => {
                const taken = lab.collected.includes(z.id);
                const big = z.w * unit >= 40 && z.h * unit >= 28;
                return (
                  <DraggableObject key={z.id} drag={drag} id={`z:${z.id}`} disabled={taken}
                    label={k('zoneLabel', { term: L.cellTex(z, letter), area: L.valueText(z.area) })}
                    className="absolute flex items-center justify-center rounded-md"
                    style={{ left: PAD + z.x0 * unit, top: PAD + z.y0 * unit, width: Math.max(z.w * unit, 12), height: Math.max(z.h * unit, 12), background: 'transparent' }}>
                    {big && (
                      <span className={`pointer-events-none rounded-md px-1.5 py-0.5 text-xs font-bold shadow-sm ${taken ? 'bg-white/60 text-slate-400' : z.removed ? 'bg-rose-50 text-rose-800' : 'bg-white/90 text-emerald-900'}`}>
                        <MathText>{tex(z.term)}</MathText>
                      </span>
                    )}
                  </DraggableObject>
                );
              })}
              {/* décor interactif : taper le ballon (hors clavier, sans effet mathématique) */}
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setKick((n) => n + 1)}
                className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: ball.cx, top: ball.cy }} data-decor-ball />
            </div>
          </div>

          {/* ── le tableau de Descartes : les mêmes zones, lisibles et portables ── */}
          <div className="overflow-x-auto" dir="ltr">
            <table className="mx-auto border-separate border-spacing-1 text-sm" data-pitch-grid>
              <thead>
                <tr>
                  <th className="px-2 font-mono text-xs text-slate-500" aria-label={k('gridCorner')}>×</th>
                  {lab.factors[0].map((term, i) => <th key={i} className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-900"><MathText>{tex(term)}</MathText></th>)}
                </tr>
              </thead>
              <tbody>
                {lab.factors[1].map((row, j) => (
                  <tr key={j}>
                    <th className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-900"><MathText>{tex(row)}</MathText></th>
                    {lab.factors[0].map((_, i) => {
                      const cell = lab.cells.find((c) => c.i === i && c.j === j);
                      const taken = lab.collected.includes(cell.id);
                      const zone = geo.zones.find((z) => z.id === cell.id);
                      return (
                        <td key={i}>
                          <DraggableObject drag={drag} id={`z:${cell.id}`} disabled={taken}
                            label={k('zoneLabel', { term: L.cellTex(cell, letter), area: L.valueText(zone.area) })}
                            className={`min-h-[44px] min-w-[64px] rounded-lg border-2 px-2 py-1 ${glow.has(cell.id) ? 'border-amber-400 bg-amber-50' : zone.removed ? 'border-rose-300 bg-rose-50' : zone.restored ? 'border-emerald-400 bg-emerald-50' : 'border-emerald-300 bg-white'} ${taken ? 'opacity-40' : ''}`}>
                            <span className="block font-bold"><MathText>{tex(cell.term)}</MathText></span>
                            <span className="block text-[11px] text-slate-500">= {L.valueText(zone.area)}</span>
                          </DraggableObject>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── la somme ── */}
          <DropZone drag={drag} id="sum" tone="emerald" label={k('sumLabel')} hint={k('sumHint')} minHeight="min-h-[72px]" className="p-2" data-pitch-sum>
            {lab.tray.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5" dir="ltr">
                <span className="font-mono text-sm text-slate-600"><MathText>{`$${productTex} =$`}</MathText></span>
                {lab.tray.map((chip, n) => (
                  <React.Fragment key={chip.id}>
                    {n > 0 && chip.term.c > 0 && <span className="font-mono text-slate-500">+</span>}
                    <DropZone drag={drag} id={`chip:${chip.id}`} tone="amber" label={k('chipZone', { term: L.cellTex(chip, letter) })} minHeight="min-h-[44px]" className="inline-flex items-center" {...interceptChip(chip.id)}>
                      <DraggableObject drag={drag} id={`c:${chip.id}`} label={k('chipLabel', { term: L.cellTex(chip, letter) })}
                        className="min-h-[44px] rounded-lg bg-white px-2 font-bold text-slate-800" >
                        <span data-tray-chip={chip.id}><MathText>{tex(chip.term)}</MathText></span>
                        <span className="block text-[11px] font-normal text-slate-500">= {L.valueText(valueOf(chip.term))}</span>
                      </DraggableObject>
                    </DropZone>
                  </React.Fragment>
                ))}
              </div>
            )}
          </DropZone>
          {simplify && lab.tray.length > 1 && !L.isSimplified(lab) && L.allCollected(lab) && (
            <p className="text-xs text-slate-600"><MathText>{k('mergeHint')}</MathText></p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={check} disabled={!lab.tray.length || live != null} data-pitch-check
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> <span><MathText>{k('check', { letter, x })}</MathText></span>
            </button>
            {lab.trials.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" dir="ltr" data-pitch-trials>
                {lab.trials.map((tr) => (
                  <li key={tr.x} data-trial-x={tr.x} data-ok={String(tr.ok)} className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${tr.ok ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                    {letter} = {tr.x} {tr.ok ? '✓' : '✗'}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="min-h-[1.25rem] text-sm" aria-live="polite" data-pitch-notice>
            {notice && !notice.trial && reasonText(notice.key) && <span className="text-rose-800"><MathText>{reasonText(notice.key)}</MathText></span>}
          </p>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

const KIND_KEY = { distributive: 'dist', double: 'double', 'square-sum': 'sqSum', 'square-diff': 'sqDiff', 'sum-diff': 'sumDiff' };

/** Les trois options de la règle : la bonne, l'erreur de la nature du produit, et « une seule valeur de x » (réfutée par SES valeurs). */
export function discoveryOptions(lab, k) {
  const kindKey = KIND_KEY[lab.kind];
  return [
    { text: <MathText>{k(`${kindKey}Opt2`)}</MathText>, why: <MathText>{k(`${kindKey}Why2`)}</MathText> },
    { text: <MathText>{k(`${kindKey}Opt1`)}</MathText>, correct: true },
    { text: <MathText>{k('onlyOneX')}</MathText>, why: <MathText>{k('onlyOneXWhy', { xs: L.verifiedXs(lab).join(' ، ') })}</MathText> },
  ];
}

export function Formal({ lab, k, letter = 'x' }) {
  const kindKey = KIND_KEY[lab.kind];
  return (
    <div className="space-y-2" data-pitch-formal>
      <EquationDisplay tone="result" tex={k(`${kindKey}Rule`)} note={<MathText>{k(`${kindKey}Formal`)}</MathText>} />
      <EquationDisplay tone="neutral" tex={`${L.productTex(lab, letter)} = ${L.resultTex(lab, letter)}`} note={<MathText>{k('yourCase')}</MathText>} />
    </div>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite unique : les zones, l'aire pour SON x, la forme développée, puis LA RÈGLE. */
export const CHAIN = Object.freeze(['zones', 'area', 'result', 'rule']);

const $ = (s) => `$${s}$`;
const Cq = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;
const poly = (terms, letter) => termsTex(terms, { letter });
const absTerm = (t) => ({ c: Math.abs(t.c), p: t.p });

/** La valeur de x de l'élève (la plus petite vérifiée juste) et ce qu'il a trouvé : l'aire du terrain. */
const trialOf = (lab) => { const x = L.verifiedXs(lab)[0]; return { x, area: L.product(lab, x) }; };

/**
 * Les formes FAUSSES d'un développement, chacune une erreur réelle : `cross` (seuls les produits « en face » : le (a + b)² = a² + b²), `sign` (le −
 * ignoré), `single` (une zone oubliée), `sqplus` (le carré du second terme ajouté au lieu d'être retranché), `first` / `last` / `sum` (un seul terme
 * multiplié, ou on additionne au lieu de multiplier). Toutes écartées si elles égalent la bonne forme (identiquement ou pour le x de l'élève).
 */
export function wrongForms(lab, letter = 'x') {
  const { cells, factors: [f1, f2] } = lab;
  const right = reducePoly(cells.map((c) => c.term));
  const lastI = f1.length - 1; const lastJ = f2.length - 1;
  const { x, area } = trialOf(lab);
  const pick = (id, terms) => ({ id, terms: reducePoly(terms) });
  let cands;
  if (lab.kind === 'distributive') {
    const [m, other] = f1.length === 1 ? [f1[0], f2] : [f2[0], f1];
    cands = [
      pick('first', [mulTerms(m, other[0]), ...other.slice(1)]),
      pick('last', [...other.slice(0, -1), mulTerms(m, other.at(-1))]),
      pick('sum', [m, ...other]),
    ];
  } else {
    const diag = cells.filter((c) => c.i === c.j).map((c) => c.term);
    cands = [
      ...(lab.kind === 'sum-diff' ? [pick('sqplus', diag.map(absTerm))] : [pick('cross', diag)]),
      pick('sign', cells.map((c) => absTerm(c.term))),
      pick('single', cells.filter((c) => !(c.i === 0 && c.j === lastJ)).map((c) => c.term)),
      pick('single', cells.filter((c) => !(c.i === lastI && c.j === lastJ)).map((c) => c.term)),
    ];
  }
  const out = [];
  for (const c of cands) {
    if (!c.terms.length || samePolynomial(c.terms, right) || evaluate(c.terms, x) === area) continue;
    if (out.some((o) => samePolynomial(o.terms, c.terms))) continue;
    out.push({ ...c, tex: poly(c.terms, letter), got: evaluate(c.terms, x) });
  }
  return out;
}

export const QUESTIONS = {
  zones: (lab, k, letter = 'x') => {
    const [f1, f2] = lab.factors;
    const n = lab.cells.length;
    const o = { prod: $(L.productTex(lab, letter)), a: f1.length, b: f2.length, calc: $(`${f1.length}\\times${f2.length}=${n}`) };
    return {
      id: 'zones', kind: 'number', expected: String(n), answer: <MathText>{$(String(n))}</MathText>,
      prompt: Cq(k, 'zones.prompt', o), hints: [Cq(k, 'zones.hint1'), Cq(k, 'zones.hint2', o)], explain: Cq(k, 'zones.explain', o),
    };
  },
  area: (lab, k, letter = 'x') => {
    const [f1, f2] = lab.factors;
    const { x, area } = trialOf(lab);
    const a = evaluate(f1, x); const b = evaluate(f2, x);
    const o = { eq: $(`${letter}=${x}`), prod: $(L.productTex(lab, letter)), a: $(String(a)), b: $(String(b)), calc: $(`${a}\\times${b}=${area}`), letter: $(letter) };
    return {
      id: 'area', kind: 'number', expected: String(area), answer: <MathText>{$(String(area))}</MathText>,
      prompt: Cq(k, 'area.prompt', o), hints: [Cq(k, 'area.hint1', o), Cq(k, 'area.hint2', o)], explain: Cq(k, 'area.explain', o),
    };
  },
  result: (lab, k, letter = 'x') => {
    const { x, area } = trialOf(lab);
    const right = reducePoly(lab.cells.map((c) => c.term));
    const rightTex = poly(right, letter);
    const base = { eq: $(`${letter}=${x}`), prod: $(L.productTex(lab, letter)), area: $(String(area)), letter: $(letter) };
    const wrong = wrongForms(lab, letter).slice(0, 2);
    return {
      id: 'result', kind: 'choice', cols: 3, prompt: Cq(k, 'result.prompt', base),
      options: [
        { text: <MathText>{$(wrong[0].tex)}</MathText>, why: Cq(k, `result.why.${wrong[0].id}`, { ...base, got: $(String(wrong[0].got)) }) },
        { text: <MathText>{$(rightTex)}</MathText>, correct: true },
        { text: <MathText>{$(wrong[1].tex)}</MathText>, why: Cq(k, `result.why.${wrong[1].id}`, { ...base, got: $(String(wrong[1].got)) }) },
      ],
      hints: [Cq(k, 'result.hint1', base), Cq(k, 'result.hint2')],
      explain: Cq(k, 'result.explain', { ...base, eq2: $(`${L.productTex(lab, letter)}=${rightTex}`) }),
    };
  },
  rule: (lab, k, letter = 'x') => ({
    id: 'rule', kind: 'choice', prompt: <MathText>{k(`${KIND_KEY[lab.kind]}Prompt`)}</MathText>,
    options: discoveryOptions(lab, k),
    hints: [Cq(k, 'rule.hint1', { xs: L.verifiedXs(lab).join(' ، ') }), Cq(k, 'rule.hint2', { sum: $(L.trayTex(lab, letter)) })],
    explain: <Formal lab={lab} k={k} letter={letter} />,
  }),
};
