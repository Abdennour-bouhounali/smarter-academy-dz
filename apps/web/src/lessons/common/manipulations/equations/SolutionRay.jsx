import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { Minus, Plus, Check } from 'lucide-react';
import * as Lin from '@smarter-academy/core/arithmetic/linear.js';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { bidi } from '../../../../utils/bidi';
import * as L from '../logic/solutionRay';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';

const { toNumber } = Lin;

/**
 * solution-ray — LE RAYON DES SOLUTIONS (unité 4 « معادلات ومتراجحات », leçon 3 « المتراجحات »).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève ÉTIRE x : un mobile sur une droite graduée (useStretchInteraction) ; puis il
 *    porte le CROCHET sur la borne (second étirement), choisit le côté coloré et
 *    l'orientation ; à متقدم il choisit une opération sur les deux membres puis le SENS
 *    de la ligne obtenue. Clavier (curseurs), −/+ et toucher de la piste font les mêmes gestes.
 * B. Idée : une inéquation est une متباينة vraie pour CERTAINS x ; ses solutions forment
 *    un rayon borné par un nombre ; multiplier / diviser par un négatif inverse le sens.
 * C. Pendant le geste, les deux membres (barres et valeurs) suivent x et le verdict
 *    صحيحة / خاطئة change ; chaque position validée laisse une trace rouge ou grise ;
 *    le crochet et la partie rouge se posent sur la droite ; chaque ligne acceptée trace
 *    son rayon au-dessus des MÊMES traces.
 * D. La comparaison calculée (−3 × (−4) + 5 = 17 et 17 ≤ 20), puis la chaîne
 *    −3x + 5 ≤ 20 → −3x ≤ 15 → x ≥ −5, et le dessin du manuel (rouge, crochet).
 * E. À découvrir avant la règle : les solutions sont d'un seul côté d'un nombre ; le
 *    crochet est tourné vers le rouge exactement quand la borne est solution ; le sens
 *    change quand on multiplie / divise par un négatif (et seulement alors).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        حلول متراجحة من الدرجة الأولى : un rayon, sa borne, le sens (DNA §6 : « move a boundary »)
 *   OBJECT         une droite graduée du manuel, un mobile, le crochet de la borne
 *   VARIABLE       x (le mobile) ; puis la position et l'orientation du crochet ; puis le sens de chaque ligne
 *   INVARIANT      l'ensemble des solutions : les traces de l'élève ne changent pas de couleur
 *                  d'une ligne équivalente à l'autre (même rayon)
 *   TRANSFORMATION les valeurs des deux membres et le verdict, live ; la trace ; le rayon dessiné
 *   CONSTRAINT     une ligne n'est acceptée que si elle a les mêmes solutions ; un crochet que si
 *                  aucun nombre ne le contredit
 *   RESISTANCE     refus chiffré : « من أجل x = −5 : −3 × (−5) + 5 = 20 و 20 ≤ 20 صحيحة: الحدّ
 *                  حلّ — وجّه الرمز نحو الجزء الملوّن » ; ÷(−3) en gardant ≤ : « نقاطك الحمراء على
 *                  يمين −5، والمتراجحة x ≤ −5 تقول اليسار »
 *   EVIDENCE       les traces rouges / grises que l'élève a lui-même produites
 *   CONTRAST       une trace rouge ET une grise avant le crochet ; une étape qui garde le sens
 *                  (−5) ET une division par un négatif qui l'inverse
 *   PREDICTION     où commence le rouge ? le crochet vers le rouge ou non ? le sens de la ligne suivante ?
 *   DISCOVERY      region / bracket / flip (selon le niveau) — conjectures à distracteurs réfutables
 *   FORMALIZATION  معارف 3 et 4 (p. 48), طريقة p. 49
 *   TRANSFER       تمارين 21–32 ; QCM 5–9 ; ترييض مشكلة (leçon 4)
 *
 * QUESTIONS PENDANT LE LABO (prototype `primitives/LabCheckpoint`, déploiement lot 3, 2026-10-28) : une scène libre par niveau ; quand la
 * découverte du niveau est atteinte, une suite unique se pose PAR-DESSUS le labo (`CHAINS[mode]`) — sans crochet : le calcul à sa dernière trace
 * rouge · la valeur extrême qui reste solution (les mauvaises options sont réfutées par SES nombres : le voisin extérieur est faux, le voisin
 * intérieur n'est pas le dernier) · LA RÈGLE ; avec crochet : l'extrême · la borne est-elle solution et comment tourner le crochet · LA RÈGLE ;
 * متقدم : l'extrême · la ligne finale qui épouse ses points rouges (sens renversé, borne stricte) · LA RÈGLE (l'ancienne découverte, qui
 * formalise). Obligatoires pour tout élève ; l'enseignant seul les coupe pour SON compte (`checkpoints` = false les coupe aussi).
 * `onCheckpoint(ev)` : la trace pour les étapes du module. ÉTAPES `LabStepper` (`[data-sr-step=<i>]`) + fête ; « إعادة » repart de zéro ;
 * « أعِد التجربة » remet le rayon au départ. SON : `tooth` (x bougé), `bell` (ligne acceptée), `flag` (crochet posé, inéquation résolue),
 * `over` (crochet ou ligne refusés).
 *
 * MANUEL (§6bis) : chaque position, chaque crochet, chaque sens est une réponse.
 * DÉCOR (exigence du propriétaire) : le téléphone de يونس qui vibre quand on le touche
 * (contexte `phone`), le drapeau de juge de touche planté au crochet (sinon) — `aria-hidden`,
 * hors clavier (`tabIndex=-1`), sans effet sur l'état, immobile sous prefers-reduced-motion.
 *
 * Props : `ineq` (« -3x+5<=20 »), `context` ('phone' | undefined), `whole` (x entier ≥ 0),
 * `min` / `max` (la droite), `marks` (graduations soulignées, orientation seulement),
 * `bracket` (false : pas d'étape du crochet), `transform` (défaut : le niveau متقدم),
 * `onTrial({ kind: 'trace' | 'bracket' | 'step' | 'refusal', … })`, `onFinished`.
 */
const RED = '#DC2626';
const GREY = '#94A3B8';
const EDGE = 22;

export default function SolutionRay({
  ineq: ineq0 = '-3x+5<=20', context, whole, min, max, marks = [], bracket: withBracket = true, transform,
  title, lead, mission, level, levels: withLevels = true, checkpoints: cpOn = true, initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, onCheckpoint,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.solutionRay.${key}`, o), [t]);
  const reduce = useReducedMotion();
  const phone = context === 'phone';
  const isWhole = whole ?? phone;
  const state = useManipulation({ type: 'solution-ray', initialNumbers: { ineq: ineq0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const ineqSrc = state.numbers.ineq;
  const doTransform = withBracket && (transform ?? state.level === 'advanced');
  const mode = doTransform ? 'flip' : withBracket ? 'bracket' : 'region';

  const make = () => L.initLab({ ineq: ineqSrc, whole: isWhole, min, max });
  const [lab, setLab] = useState(make);
  const sceneKey = `${ineqSrc}:${state.epoch}:${state.resetCount}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [live, setLive] = useState(null);
  const [last, setLast] = useState(null);           // dernière trace validée (pour aria-live)
  const [draft, setDraft] = useState({ k: null, side: null, toward: null });
  const [bLive, setBLive] = useState(null);
  const [verdict, setVerdict] = useState(null);     // refus / acceptation du crochet
  const [card, setCard] = useState(null);           // carte d'opération choisie
  const [stepMsg, setStepMsg] = useState(null);     // refus / acceptation d'une ligne
  const [shake, setShake] = useState(0);            // décor
  // Miroir synchrone de `lab` : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const labRef = useRef(lab);
  labRef.current = lab;
  const resetScene = () => {
    setLab(make()); setLive(null); setLast(null);
    setDraft({ k: null, side: null, toward: null }); setBLive(null); setVerdict(null); setCard(null); setStepMsg(null);
  };
  // « إعادة » (resetCount), un autre niveau ou d'autres nombres : TOUT recommence — le rayon, les traces et les questions du labo
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); resetScene(); }

  const ready = mode === 'region' ? L.regionDiscoveryReady(lab) : mode === 'bracket' ? L.bracketDiscoveryReady(lab) : L.flipDiscoveryReady(lab);
  // les questions pendant le labo : une suite unique quand la découverte est atteinte ; celle qui finit par la règle remplace la découverte automatique
  const cpSettings = useLabCheckpointSettings('solution-ray');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const cpLive = cpOn && cpSettings.enabled;
  const chain = cpLive ? CHAINS[mode] : null;
  const cp = useLabCheckpoint({
    id: chain ? ineqSrc : null,
    questions: chain && ready ? chain.map((q) => QUESTIONS[q](lab, k, { mode, phone })) : null,
    reached: ready,
    resetKey: scene.inits,
    onRetry: resetScene,
    onEvent: (ev) => state.report(onCheckpoint, ev),   // {tk:'checkpoint'|'checkpoint-done', id: ineq, …} — la TRACE que les étapes du module relisent
    onDone: () => { state.discover(); state.formalize(); },
  });
  useEffect(() => { if (ready && !cpLive) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  // une étape est FAITE quand son objectif est atteint ET (la dernière) ses questions répondues : la pastille passe au vert et on fête
  const stepDone = (mode === 'region'
    ? [lab.traces.length >= 2, L.hasContrast(lab), ready]
    : [L.hasContrast(lab), !!lab.bracket, ready]).map((d, i, a) => (i === a.length - 1 ? d && !cp.blocking : d));
  const nDone = stepDone.findIndex((d) => !d) < 0 ? stepDone.length : stepDone.findIndex((d) => !d);
  const party = useStepCelebration();
  const celebrated = useRef({ n: 0, inits: scene.inits });
  if (celebrated.current.inits !== scene.inits) celebrated.current = { n: 0, inits: scene.inits };   // « إعادة » : on refête
  useEffect(() => {
    if (nDone <= celebrated.current.n) return;
    celebrated.current.n = nDone;
    party.celebrate({ n: nDone, total: stepDone.length });
  }, [nDone]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, state.numbers); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la géométrie de la droite ── */
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
  const span = Math.max(1, lab.kmax - lab.kmin);
  const mu = (width - 2 * EDGE) / span;
  const xOf = (kk) => EDGE + (kk - lab.kmin) * mu;
  const toValue = useCallback((clientX, _y, rect) => lab.kmin + (clientX - rect.left - EDGE) / mu, [lab.kmin, mu]);
  const range = { min: lab.kmin, max: lab.kmax };
  const xs = (kk) => L.numText(L.xOfK(lab, kk));
  const xt = (kk) => L.numTex(L.xOfK(lab, kk));

  /* ── geste 1 : le mobile ── */
  const defK = L.defaultK(lab);
  const heard = useRef(0);
  const tick = () => { const now = Date.now(); if (now - heard.current > 35) { playSfx('tooth'); heard.current = now; } };
  const trace = (v) => {
    if (!L.inRange(labRef.current, v)) return;
    tick();
    const e = L.evaluate(labRef.current, v);
    labRef.current = L.addTrace(labRef.current, v);
    setLab((s) => L.addTrace(s, v));
    setLast(e);
    state.report(onTrial, { kind: 'trace', k: v, x: xs(v), ok: e.ok });
  };
  const untraced = () => Array.from({ length: labRef.current.kmax - labRef.current.kmin + 1 }, (_, i) => labRef.current.kmin + i).filter((v) => !labRef.current.traces.some((tr) => tr.k === v));
  const probe = useStretchInteraction({
    value: live ?? last?.k ?? defK, range, toValue, onChange: setLive, direction: 'ltr',
    onCommit: (v) => { setLive(null); trace(v); },
  });
  // Une graduation PAR DÉFAUT (L.defaultK : hors solution, jamais la borne) : le mobile n'est pas posé « nulle part ».
  // Ce n'est pas une trace : `lab.traces` ne la contient pas, `last` reste vide.
  const pk = live ?? last?.k ?? defK;
  const pe = L.evaluate(lab, pk);

  /* ── geste 2 : le crochet ── */
  const bracketOpen = withBracket && L.hasContrast(lab) && !lab.bracket;
  const bk = bLive ?? draft.k;
  const bStretch = useStretchInteraction({
    value: bk, range, toValue, onChange: setBLive, direction: 'ltr',
    onCommit: (v) => { setBLive(null); setDraft((d) => ({ ...d, k: v })); setVerdict(null); },
  });
  const fix = () => {
    if (draft.k == null || draft.side == null || draft.toward == null) { setVerdict({ tone: 'ko', key: 'bracketIncomplete' }); return; }
    const v = L.checkBracket(lab, draft);
    if (v === true) {
      setLab((s) => L.placeBracket(s, draft));
      playSfx('flag');
      setVerdict({ tone: 'ok', key: 'bracketOk' });
      state.report(onTrial, { kind: 'bracket', k: draft.k, x: xs(draft.k), side: draft.side, toward: draft.toward, glyph: L.glyphOf(draft.side, draft.toward) });
    } else {
      setVerdict({ tone: 'ko', key: v.reason, witness: v.witness });
      playSfx('over');
      state.report(onTrial, { kind: 'refusal', what: 'bracket', reason: v.reason });
    }
  };

  /* ── geste 3 : transformer (متقدم) ── */
  const cur = L.current(lab);
  const cards = doTransform && lab.bracket ? L.cardsFor(cur) : [];
  const cands = card ? L.candidates(lab, card) : null;
  const choose = (rel) => {
    const r = L.chooseStep(lab, card, rel);
    setLab(r.lab);
    if (r.accepted) {
      playSfx(L.transformDone(r.lab) ? 'flag' : 'bell');
      setStepMsg({ tone: 'ok' });
      state.report(onTrial, { kind: 'step', op: card.op, opTex: L.cardTex(card), ineq: L.ineqTex(L.current(r.lab)), flipped: L.isNegativeScaling(card) });
      setCard(null);
    } else {
      playSfx('over');
      setStepMsg({ tone: 'ko', reason: r.reason, proposed: r.proposed, witness: r.witness });
      state.report(onTrial, { kind: 'refusal', what: 'step', reason: r.reason, opTex: L.cardTex(card) });
    }
  };

  /* ── textes calculés ── */
  const calcTex = (e) => [L.sideTex(lab.ineq.L, e.x), L.sideTex(lab.ineq.R, e.x)].filter(Boolean).join(' \\quad ');
  const cmpTex = (e) => `${L.numTex(e.left)} ${L.relTex(lab.ineq.rel)} ${L.numTex(e.right)}`;
  const witnessLine = (e) => k('witnessLine', { x: L.numTex(e.x), calc: calcTex(e) ? `$${calcTex(e)}$ ،` : '', cmp: cmpTex(e), verdict: k(e.ok ? 'isTrue' : 'isFalse') });
  const sideWord = (s) => k(s === 'left' ? 'sideLeftWord' : 'sideRightWord');
  const boundTex = L.numTex(lab.sol.bound);

  /* ── barres des deux membres ── */
  const ends = [lab.kmin, lab.kmax].map((kk) => L.evaluate(lab, kk));
  const vals = ends.flatMap((e) => [toNumber(e.left), toNumber(e.right)]);
  const vLo = Math.min(0, ...vals);
  const vHi = Math.max(0, ...vals);
  const pct = (v) => ((v - vLo) / Math.max(1e-9, vHi - vLo)) * 100;
  const Bar = ({ v, color, label, data }) => {
    const a = pct(0); const b = pct(toNumber(v));
    return (
      <div className="flex items-center gap-2" data-member={data}>
        <span className="w-20 shrink-0 text-xs font-bold text-slate-600">{label}</span>
        <div className="relative h-4 flex-1 rounded bg-slate-100" dir="ltr" aria-hidden="true">
          <div className="absolute inset-y-0 w-px bg-slate-400" style={{ left: `${a}%` }} />
          <div className="absolute inset-y-0.5 rounded" style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%`, background: color, transition: reduce ? 'none' : 'width 120ms, left 120ms' }} />
        </div>
        <span className="w-16 shrink-0 text-end font-mono text-sm font-bold text-slate-800" dir="ltr">{L.numText(v)}</span>
      </div>
    );
  };

  /* ── la droite graduée (SVG, LTR) ── */
  const H = 112; const Y = 74;
  const nUnits = (lab.kmax - lab.kmin) / lab.den;
  const labelEvery = nUnits > 16 ? 5 : 1;
  const shownBracket = lab.bracket ?? (bracketOpen && bk != null ? { k: bk, side: draft.side, toward: draft.toward } : null);
  const solid = !!lab.bracket;
  const curRay = doTransform && lab.chain.length > 1 ? L.rayOf(cur) : null;
  const badRay = stepMsg?.tone === 'ko' && stepMsg.proposed ? L.rayOf(stepMsg.proposed) : null;
  const rayK = (ray) => (ray.bound.n * lab.den) / ray.bound.d;
  const band = (ray, y, fill, dash) => {
    const b = xOf(rayK(ray));
    const [x0, x1] = L.sideOf(ray) === 'left' ? [EDGE - 6, b] : [b, width - EDGE + 6];
    return <rect x={x0} y={y} width={Math.max(0, x1 - x0)} height={8} rx={3} fill={fill} stroke={dash ? '#BE123C' : 'none'} strokeDasharray={dash ? '4 3' : undefined} opacity={0.75} />;
  };
  const glyphPath = (bx, side, toward) => {
    const g = L.glyphOf(side ?? 'left', toward ?? true);
    const dir = g === ']' ? -1 : 1;
    return `M ${bx + dir * 9} ${Y - 16} L ${bx} ${Y - 16} L ${bx} ${Y + 16} L ${bx + dir * 9} ${Y + 16}`;
  };

  const line = (
    <div className="relative" dir="ltr" style={{ height: H }}>
      <svg width={width} height={H} className="absolute inset-0" aria-hidden="true" focusable="false" data-ray-line>
        {curRay && band(curRay, 22, '#C7D2FE')}
        {badRay && band(badRay, 10, '#FFE4E6', true)}
        {/* la partie rouge (convention du manuel) */}
        {shownBracket && shownBracket.side && (() => {
          const b = xOf(shownBracket.k);
          const [x0, x1] = shownBracket.side === 'left' ? [EDGE - 10, b] : [b, width - 8];
          return <line x1={x0} x2={x1} y1={Y} y2={Y} stroke={RED} strokeWidth={solid ? 5 : 3} strokeDasharray={solid ? undefined : '6 4'} data-ray-red={solid ? 'solid' : 'draft'} />;
        })()}
        <line x1={EDGE - 12} x2={width - 6} y1={Y} y2={Y} stroke="#334155" strokeWidth={1.6} />
        <path d={`M ${width - 6} ${Y} l -8 -5 l 0 10 z`} fill="#334155" />
        {Array.from({ length: lab.kmax - lab.kmin + 1 }, (_, i) => lab.kmin + i).map((kk) => {
          const integer = kk % lab.den === 0;
          const n = kk / lab.den;
          const labelled = integer && n % labelEvery === 0;
          const marked = integer && marks.includes(n);
          return (
            <g key={kk}>
              <line x1={xOf(kk)} x2={xOf(kk)} y1={Y - (integer ? 6 : 3)} y2={Y + (integer ? 6 : 3)} stroke="#475569" strokeWidth={integer ? 1.3 : 0.8} />
              {(labelled || marked) && <text x={xOf(kk)} y={Y + 22} textAnchor="middle" fontSize={11} fontWeight={marked ? 'bold' : 'normal'} fill={marked ? '#1D4ED8' : '#334155'} fontFamily="ui-monospace, monospace">{n}</text>}
            </g>
          );
        })}
        {shownBracket && (
          <path d={glyphPath(xOf(shownBracket.k), shownBracket.side, shownBracket.toward)} fill="none" stroke={solid ? RED : '#7F1D1D'} strokeWidth={2.6} strokeDasharray={shownBracket.side && shownBracket.toward != null ? undefined : '3 3'} data-ray-glyph={L.glyphOf(shownBracket.side ?? 'left', shownBracket.toward ?? true)} />
        )}
        {/* les traces de l'élève */}
        {lab.traces.map((tr) => (
          <circle key={tr.k} cx={xOf(tr.k)} cy={Y - 24} r={6} fill={tr.ok ? RED : GREY} stroke="#fff" strokeWidth={1.5} data-trace={tr.k} data-ok={String(tr.ok)} />
        ))}
      </svg>
      {/* étiquette de la borne fractionnaire : îlot LTR, sous la droite */}
      {lab.bracket && lab.den > 1 && (
        <span className="absolute -translate-x-1/2 text-xs font-bold text-red-700" style={{ left: xOf(lab.bracket.k), top: Y + 26 }} data-ray-bound><MathText>{`$${boundTex}$`}</MathText></span>
      )}
      {lab.bracket && (
        <span className="absolute text-[11px] font-bold text-red-700" dir="rtl" style={{ top: Y - 50, ...(lab.bracket.side === 'left' ? { left: EDGE, maxWidth: Math.max(60, xOf(lab.bracket.k) - EDGE - 18) } : { left: xOf(lab.bracket.k) + 16 }) }} data-ray-solutions-label>{k('solutionsLabel')}</span>
      )}
      {/* décor : le drapeau du juge de touche, planté au crochet (hors contexte téléphone) */}
      {lab.bracket && !phone && (
        <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setShake((n) => n + 1)} data-decor-flag
          className="absolute h-11 w-8" style={{ left: xOf(lab.bracket.k) - 4, top: Y - 66 }}>
          <svg width="28" height="40" viewBox="0 0 28 40" style={{ transformOrigin: '2px 38px', transform: reduce ? 'none' : `rotate(${shake % 2 ? -10 : 0}deg)`, transition: reduce ? 'none' : 'transform 160ms' }}>
            <line x1="2" y1="4" x2="2" y2="38" stroke="#334155" strokeWidth="2" />
            <path d="M3 4 h10 v5 h-10 z" fill="#FACC15" /><path d="M13 4 h10 v5 h-10 z" fill="#DC2626" />
            <path d="M3 9 h10 v5 h-10 z" fill="#DC2626" /><path d="M13 9 h10 v5 h-10 z" fill="#FACC15" />
          </svg>
        </button>
      )}
      {/* la piste du mobile : toute la droite */}
      <div {...probe.trackProps} className="absolute inset-x-0 top-[40px] h-[56px]" style={{ ...probe.trackProps.style }} data-ray-track>
        <div
          {...probe.handleProps({ label: k('probeLabel'), valueText: k('probeValue', { x: xs(pk) }) })}
          className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${probe.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/40'}`}
          style={{ left: xOf(pk), cursor: probe.dragging ? 'grabbing' : 'grab' }}
          data-ray-probe
        >
          <span className={`-mt-3 rounded-full px-2 font-mono text-xs font-extrabold text-white ${pe ? (pe.ok ? 'bg-red-600' : 'bg-slate-500') : 'bg-slate-700'}`}>{xs(pk)}</span>
        </div>
      </div>
    </div>
  );

  /* ── représentation (aria-live) : la dernière trace validée ── */
  // Au repos, sans trace encore : la conséquence de la graduation par défaut (la ligne ne prétend pas que l'élève l'a posée).
  const lastE = last ? L.evaluate(lab, last.k) : L.evaluate(lab, defK);
  const solWord = mode !== 'region';
  const representation = lastE && !live ? (
    <EquationDisplay tone={lastE.ok ? 'ok' : 'ko'} tex={`x = ${L.numTex(lastE.x)} : \\; ${calcTex(lastE) ? `${calcTex(lastE)} \\quad ` : ''}${cmpTex(lastE)}`}
      note={k(lastE.ok ? (solWord ? 'noteTrueSol' : 'noteTrue') : (solWord ? 'noteFalseSol' : 'noteFalse'))} />
  ) : null;

  /* ── découvertes ── */
  const discoveryOptions = discoveryOptionsOf(lab, k, mode);
  const formal = <RayFormal lab={lab} k={k} mode={mode} />;

  const shownTitle = title ?? k(phone ? 'titlePhone' : 'title', { ineq: `\u2066${L.ineqPlain(lab.ineq)}\u2069` });
  const shownMission = mission ?? k(phone ? 'missionPhone' : mode === 'region' ? 'missionRegion' : mode === 'bracket' ? 'missionBracket' : 'missionFlip');
  const hintKeys = { region: ['gHint1', 'gHint2', 'gHint3'], bracket: ['gHint1', 'bHint2', 'bHint3'], flip: ['gHint1', 'fHint2', 'fHint3'] }[mode];

  const btn = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 px-3 text-sm font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300';
  const pick = (on) => (on ? 'border-red-600 bg-red-50 text-red-900' : 'border-slate-300 bg-white text-slate-700');

  return (
    <ManipulationShell
      type="solution-ray"
      title={title ? bidi(title) : shownTitle}
      mission={<MathText>{shownMission}</MathText>}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpSettings.control}
      guided={!!chain}
      hints={hintKeys.map((h) => <MathText key={h}>{k(h)}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        // Balayer la droite, graduation après graduation : chaque position est une trace (rouge / grise). Le crochet reste la réponse de l'élève.
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: untraced().length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const next = untraced()[0]; if (next !== undefined) { setLive(null); trace(next); } },
          finish: () => { untraced().forEach((v) => trace(v)); },
        },
      }}
      representation={representation}
      discovery={(
        <ManipulationDiscovery state={state} prompt={k(mode === 'region' ? 'rPrompt' : mode === 'bracket' ? 'bPrompt' : 'fPrompt')} options={discoveryOptions} formal={formal} />
      )}
      explanation={<MathText>{k(mode === 'flip' ? 'explanationFlip' : 'explanationGraph')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-rose-50/50 to-white" data-dragging={probe.dragging || bStretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="relative space-y-3" data-solution-ray data-mode={mode} data-context={phone ? 'phone' : 'line'}>
          {party.node}
          {cp.node}
          <LabStepper count={stepDone.length} current={Math.min(nDone, stepDone.length - 1)} done={stepDone} stepAttr="data-sr-step" />
          <p className="text-sm text-slate-700"><MathText>{k(phone ? 'legendPhone' : 'legend', { ineq: L.ineqTex(lab.ineq) })}</MathText></p>

          {/* les deux membres pour le x du mobile */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-2" data-ray-members>
            {phone && (
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setShake((n) => n + 1)} data-decor-phone
                className="shrink-0" style={{ transform: reduce ? 'none' : `rotate(${shake % 2 ? 8 : 0}deg)`, transition: reduce ? 'none' : 'transform 120ms' }}>
                <svg width="34" height="56" viewBox="0 0 34 56">
                  <rect x="2" y="2" width="30" height="52" rx="6" fill="#1E293B" />
                  <rect x="5" y="8" width="24" height="36" rx="2" fill="#E0F2FE" />
                  <rect x="8" y="12" width="14" height="6" rx="3" fill="#38BDF8" /><rect x="12" y="22" width="14" height="6" rx="3" fill="#FFFFFF" />
                  <circle cx="17" cy="49" r="2.4" fill="#64748B" />
                </svg>
              </button>
            )}
            <div className="min-w-0 flex-1 space-y-1.5">
              <Bar v={pe ? pe.left : L.evaluate(lab, lab.kmin).left} color={pe ? (pe.ok ? '#F87171' : '#CBD5E1') : '#E2E8F0'} label={k(phone ? 'costLabel' : 'leftLabel')} data="left" />
              <Bar v={pe ? pe.right : L.evaluate(lab, lab.kmin).right} color="#93C5FD" label={k(phone ? 'creditLabel' : 'rightLabel')} data="right" />
              <p className="min-h-[1.5rem] text-sm" data-ray-live>
                {pe
                  ? <MathText>{k('liveLine', { x: L.numTex(pe.x), calc: calcTex(pe) ? `$${calcTex(pe)}$ ،` : '', cmp: cmpTex(pe), verdict: k(pe.ok ? 'isTrue' : 'isFalse') })}</MathText>
                  : <span className="text-slate-500">{k('notSet')}</span>}
              </p>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-700">{k(phone ? 'lineTitlePhone' : 'lineTitle')}</p>
          {line}
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => probe.nudge(-1)} aria-label={k('less')} disabled={pk != null && pk <= lab.kmin}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[7rem] text-center text-sm font-bold text-slate-700" dir="ltr">{pk == null ? 'x = ?' : `x = ${xs(pk)}`}</p>
            <button type="button" onClick={() => probe.nudge(1)} aria-label={k('more')} disabled={pk != null && pk >= lab.kmax}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          {lab.traces.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" dir="ltr" data-ray-tried>
              {lab.traces.map((tr) => (
                <li key={tr.k} data-tried-x={xs(tr.k)} data-ok={String(tr.ok)} className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${tr.ok ? 'bg-red-100 text-red-900' : 'bg-slate-200 text-slate-700'}`}>
                  x = {xs(tr.k)} {tr.ok ? '●' : '○'}
                </li>
              ))}
            </ul>
          )}
          {phone && <p className="text-xs text-slate-500">{k('phoneWhole')}</p>}

          {/* ── étape 2 : le crochet ── */}
          {withBracket && (
            <section className="space-y-2 rounded-xl border-2 border-dashed border-red-200 bg-white/70 p-2" data-ray-bracket data-placed={String(!!lab.bracket)}>
              <h4 className="text-sm font-extrabold text-red-900">{k('bracketTitle')}</h4>
              {!L.hasContrast(lab) && <p className="text-sm text-slate-600">{k('needContrast')}</p>}
              {bracketOpen && (
                <>
                  <p className="text-sm text-slate-700">{k('bracketLead')}</p>
                  <div {...bStretch.trackProps} className="relative h-12 rounded-lg bg-red-50/70" dir="ltr" style={{ ...bStretch.trackProps.style }} data-ray-bracket-track>
                    <div
                      {...bStretch.handleProps({ label: k('bracketHandle'), valueText: bk == null ? k('bracketNotSet') : k('bracketValue', { x: xs(bk) }) })}
                      className={`absolute top-0.5 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-xl border-2 font-mono text-xl font-black text-red-700 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${bStretch.dragging ? 'border-blue-500 bg-blue-50' : 'border-red-300 bg-white'}`}
                      style={{ left: xOf(bk ?? lab.kmin), opacity: bk == null ? 0.6 : 1 }}
                      data-ray-bracket-handle
                    >
                      {L.glyphOf(draft.side ?? 'left', draft.toward ?? true)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={`${btn} ${pick(draft.side === 'left')}`} aria-pressed={draft.side === 'left'} onClick={() => { setDraft((d) => ({ ...d, side: 'left' })); setVerdict(null); }} data-ray-side="left">{k('sideLeft')}</button>
                    <button type="button" className={`${btn} ${pick(draft.side === 'right')}`} aria-pressed={draft.side === 'right'} onClick={() => { setDraft((d) => ({ ...d, side: 'right' })); setVerdict(null); }} data-ray-side="right">{k('sideRight')}</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={`${btn} ${pick(draft.toward === true)}`} aria-pressed={draft.toward === true} onClick={() => { setDraft((d) => ({ ...d, toward: true })); setVerdict(null); }} data-ray-toward="true">{k('toward')}</button>
                    <button type="button" className={`${btn} ${pick(draft.toward === false)}`} aria-pressed={draft.toward === false} onClick={() => { setDraft((d) => ({ ...d, toward: false })); setVerdict(null); }} data-ray-toward="false">{k('away')}</button>
                  </div>
                  <button type="button" onClick={fix} className={`${btn} border-red-600 bg-red-600 text-white`} data-ray-fix>
                    <Check className="h-5 w-5" aria-hidden="true" /> {k('fix')}
                  </button>
                </>
              )}
              {lab.bracket && (
                <p className="text-sm font-bold text-red-900" data-ray-bracket-done>
                  <MathText>{k('bracketDone', { x: boundTex, glyph: `\u2066${L.glyphOf(lab.bracket.side, lab.bracket.toward)}\u2069`, side: sideWord(lab.bracket.side) })}</MathText>
                </p>
              )}
              <p className="min-h-[1.25rem] text-sm" aria-live="polite" data-ray-verdict={verdict?.key ?? ''}>
                {verdict && verdict.tone === 'ko' && (
                  <span className="text-rose-800">
                    <MathText>{verdict.witness
                      ? (verdict.key === 'glyph'
                        ? k(verdict.witness.ok ? 'refuseGlyphToward' : 'refuseGlyphAway', { line: witnessLine(verdict.witness) })
                        : k(verdict.witness.ok ? 'refuseOut' : 'refuseIn', { line: witnessLine(verdict.witness) }))
                      : k(verdict.key)}</MathText>
                  </span>
                )}
              </p>
            </section>
          )}

          {/* ── étape 3 : transformer l'inéquation (متقدم) ── */}
          {doTransform && lab.bracket && (
            <section className="space-y-2 rounded-xl border-2 border-indigo-200 bg-white/80 p-2" data-ray-transform data-done={String(L.transformDone(lab))}>
              <h4 className="text-sm font-extrabold text-indigo-900">{k('transformTitle')}</h4>
              <ol className="space-y-1" dir="ltr" data-ray-chain>
                {lab.chain.map((I, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2 font-mono text-sm">
                    {i > 0 && <span className="rounded-full bg-indigo-100 px-2 text-xs text-indigo-800"><MathText>{`$${L.cardTex(lab.steps[i - 1])}$`}</MathText></span>}
                    <MathText>{`$${L.ineqTex(I)}$`}</MathText>
                  </li>
                ))}
              </ol>
              {!L.transformDone(lab) && (
                <>
                  <p className="text-sm text-slate-700">{k('transformLead')}</p>
                  <div className="flex flex-wrap gap-2" data-ray-cards>
                    {cards.map((c) => {
                      const on = card && card.op === c.op && Lin.eq(card.k, c.k);
                      return (
                        <button key={`${c.op}:${L.numText(c.k)}`} type="button" className={`${btn} ${on ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-300 bg-white text-slate-800'}`}
                          aria-pressed={!!on} aria-label={k('cardAria', { op: L.cardTex(c).replace('\\div', '÷').replace('\\times', '×').replace(/\{,\}/g, ',') })} onClick={() => { setCard(c); setStepMsg(null); }} data-ray-card={L.cardTex(c)}>
                          <span dir="ltr"><MathText>{`$${L.cardTex(c)}$`}</MathText></span>
                        </button>
                      );
                    })}
                  </div>
                  {cands && !cands.refused && (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">{k('chooseLine')}</p>
                      <div className="flex flex-wrap gap-2" dir="ltr">
                        {[cands.kept, cands.flipped].map((I) => (
                          <button key={I.rel} type="button" className={`${btn} border-slate-300 bg-white text-slate-800`} onClick={() => choose(I.rel)} data-ray-choice={I.rel}>
                            <MathText>{`$${L.ineqTex(I)}$`}</MathText>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <p className="min-h-[1.25rem] text-sm" aria-live="polite" data-ray-step={stepMsg?.tone ?? ''}>
                {stepMsg?.tone === 'ok' && !L.transformDone(lab) && <span className="text-emerald-800">{k('stepOk')}</span>}
                {L.transformDone(lab) && <span className="font-bold text-emerald-800"><MathText>{k('solvedNote', { ineq: L.ineqTex(cur), first: L.ineqTex(lab.ineq) })}</MathText></span>}
                {stepMsg?.tone === 'ko' && stepMsg.witness && (
                  <span className="text-rose-800">
                    <MathText>{k('refuseStep', {
                      red: sideWord(L.sideOf(lab.sol)), bound: boundTex, p: L.ineqTex(stepMsg.proposed), pside: sideWord(L.sideOf(L.rayOf(stepMsg.proposed))),
                      line: witnessLine(stepMsg.witness),
                    })}</MathText>
                  </span>
                )}
              </p>
            </section>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}


/* ── Écritures partagées par la découverte et les questions (hors composant : les questions les rejouent) ── */
const calcOf = (lab, e) => [L.sideTex(lab.ineq.L, e.x), L.sideTex(lab.ineq.R, e.x)].filter(Boolean).join(' \\quad ');
const cmpOf = (lab, e) => `${L.numTex(e.left)} ${L.relTex(lab.ineq.rel)} ${L.numTex(e.right)}`;
const lineOf = (lab, e, k) => k('witnessLine', { x: L.numTex(e.x), calc: calcOf(lab, e) ? `$${calcOf(lab, e)}$ ،` : '', cmp: cmpOf(lab, e), verdict: k(e.ok ? 'isTrue' : 'isFalse') });

/** Les options de la règle du niveau : la bonne, et des conjectures réfutées par les propres traces de l'élève. */
function discoveryOptionsOf(lab, k, mode) {
  const strictRed = L.strictRedTrace(lab);
  const grey = L.greyTrace(lab);
  const boundE = L.evaluate(lab, L.boundK(lab));
  const boundTex = L.numTex(lab.sol.bound);
  const cmpTex = (e) => cmpOf(lab, e);
  const keptStep = lab.steps.find((s) => !((s.op === 'mul' || s.op === 'div') && s.k.n < 0));
  return {
    region: [
      { text: <MathText>{k('rOpt2')}</MathText>, why: strictRed && <MathText>{k('rWhy2', { x: L.numTex(strictRed.x), cmp: cmpTex(strictRed) })}</MathText> },
      { text: <MathText>{k('rOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('rOpt3')}</MathText>, why: grey && <MathText>{k('rWhy3', { x: L.numTex(grey.x), cmp: cmpTex(grey) })}</MathText> },
    ],
    bracket: [
      boundE.ok
        ? { text: <MathText>{k('bOpt2b')}</MathText>, why: <MathText>{k('bWhy2b', { x: boundTex, cmp: cmpTex(boundE) })}</MathText> }
        : { text: <MathText>{k('bOpt2')}</MathText>, why: <MathText>{k('bWhy2', { x: boundTex, cmp: cmpTex(boundE) })}</MathText> },
      { text: <MathText>{k('bOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('bOpt3')}</MathText>, why: <MathText>{k('bWhy3')}</MathText> },
    ],
    flip: [
      { text: <MathText>{k('fOpt2')}</MathText>, why: <MathText>{k('fWhy2', { op: keptStep ? L.cardTex(keptStep) : '' })}</MathText> },
      { text: <MathText>{k('fOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('fOpt3')}</MathText>, why: <MathText>{k('fWhy3', { op: keptStep ? L.cardTex(keptStep) : '' })}</MathText> },
    ],
  }[mode];
}

/** La règle du niveau, écrite (la carte finale de la suite, et la découverte quand les questions sont coupées). */
function RayFormal({ lab, k, mode }) {
  const boundE = L.evaluate(lab, L.boundK(lab));
  const boundTex = L.numTex(lab.sol.bound);
  const chainTex = lab.chain.map(L.ineqTex);
  return (
    <div className="space-y-2" data-ray-formal>
      {mode === 'region' && <EquationDisplay tone="result" tex={L.ineqTex(lab.ineq)} note={<MathText>{k('rFormal')}</MathText>} />}
      {mode === 'bracket' && (
        <>
          <EquationDisplay tone="result" tex={`${L.ineqTex(lab.ineq)} \\quad (${boundE.ok ? '\\leq,\\ \\geq' : '<,\\ >'})`} note={<MathText>{k('bFormal')}</MathText>} />
          <p className="text-sm text-slate-700"><MathText>{k(boundE.ok ? 'bYourCaseIn' : 'bYourCaseOut', { x: boundTex, cmp: cmpOf(lab, boundE) })}</MathText></p>
        </>
      )}
      {mode === 'flip' && (
        <>
          <EquationDisplay tone="result" tex={'a < 0 : \\quad ax \\leq b \;\\Longrightarrow\; x \\geq \\dfrac{b}{a}'} note={<MathText>{k('fFormal')}</MathText>} />
          <EquationDisplay tone="neutral" tex={chainTex.join(' \;\\Longrightarrow\; ')} note={<MathText>{k('yourCase')}</MathText>} />
        </>
      )}
    </div>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite unique de chaque niveau : le calcul / l'extrême / la borne / la ligne finale, puis LA RÈGLE. */
export const CHAINS = Object.freeze({
  region: ['calc', 'edge', 'rule'],
  bracket: ['edge', 'bound', 'rule'],
  flip: ['edge', 'red', 'rule'],
});

const $ = (x) => `$${x}$`;
const Cq = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;
const gradeTex = (lab, kk) => L.numTex(L.xOfK(lab, kk));

/**
 * La valeur extrême qui reste solution sur la droite graduée (la plus grande pour un rayon vers la gauche, la plus petite vers la droite),
 * son voisin EXTÉRIEUR (faux) et son voisin INTÉRIEUR (vrai, mais pas le dernier) — `null` si la droite ne les contient pas.
 */
export function edgeOf(lab) {
  const left = L.sideOf(lab.sol) === 'left';
  let edge = null;
  for (let kk = lab.kmin; kk <= lab.kmax; kk += 1) {
    if (!L.evaluate(lab, kk).ok) continue;
    if (left) edge = kk; else if (edge == null) edge = kk;
  }
  if (edge == null) return null;
  const out = edge + (left ? 1 : -1);
  const inn = edge + (left ? -1 : 1);
  return { left, edge, out: L.inRange(lab, out) ? out : null, inn: L.inRange(lab, inn) && L.evaluate(lab, inn).ok ? inn : null };
}

const STRICT = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };

export const QUESTIONS = {
  calc: (lab, k, { phone } = {}) => {
    const reds = lab.traces.filter((t) => t.ok).map((t) => t.k);
    const kk = L.sideOf(lab.sol) === 'left' ? Math.max(...reds) : Math.min(...reds);
    const e = L.evaluate(lab, kk);
    const o = { x: gradeTex(lab, kk), calc: $(calcOf(lab, e)), cmp: $(cmpOf(lab, e)), v: $(L.numTex(e.left)) };
    const base = {
      id: 'calc', prompt: Cq(k, phone ? 'calc.promptPhone' : 'calc.prompt', o), hints: [Cq(k, 'calc.hint1', o), Cq(k, 'calc.hint2')],
      explain: Cq(k, 'calc.explain', o),
    };
    if (e.left.n >= 0) return { ...base, kind: 'number', expected: Lin.fracText(e.left), answer: <MathText>{o.v}</MathText> };
    const wrong = [Lin.neg(e.left), Lin.add(e.left, 1)];
    return {
      ...base, kind: 'choice', cols: 3,
      options: [
        { text: <MathText>{$(L.numTex(wrong[0]))}</MathText>, why: Cq(k, 'calc.whySign', o) },
        { text: <MathText>{o.v}</MathText>, correct: true },
        { text: <MathText>{$(L.numTex(wrong[1]))}</MathText>, why: Cq(k, 'calc.whyOff', o) },
      ],
    };
  },
  edge: (lab, k) => {
    const g = edgeOf(lab);
    const o = { edge: $(`x = ${gradeTex(lab, g.edge)}`) };
    const pick = (kk) => ({ n: $(gradeTex(lab, kk)), line: lineOf(lab, L.evaluate(lab, kk), k) });
    const out = g.out != null ? pick(g.out) : null;
    const inn = g.inn != null ? pick(g.inn) : null;
    const opts = [
      out && { text: <MathText>{$(`x = ${gradeTex(lab, g.out)}`)}</MathText>, why: Cq(k, 'edge.whyOut', out) },
      { text: <MathText>{o.edge}</MathText>, correct: true },
      inn && { text: <MathText>{$(`x = ${gradeTex(lab, g.inn)}`)}</MathText>, why: Cq(k, 'edge.whyIn', { ...inn, edge: $(gradeTex(lab, g.edge)) }) },
    ].filter(Boolean);
    return {
      id: 'edge', kind: 'choice', cols: 3,
      prompt: Cq(k, g.left ? 'edge.promptMax' : 'edge.promptMin'),
      options: opts,
      hints: [Cq(k, 'edge.hint1'), Cq(k, 'edge.hint2')],
      explain: Cq(k, 'edge.explain', { ...o, line: lineOf(lab, L.evaluate(lab, g.edge), k), lineOut: out ? out.line : '', n: out ? out.n : '' }),
    };
  },
  bound: (lab, k) => {
    const e = L.evaluate(lab, L.boundK(lab));
    const o = { x: L.numTex(e.x), line: lineOf(lab, e, k) };
    const right = e.ok ? 'in' : 'out';
    const mk = (id) => ({ text: Cq(k, `bound.${id}`), ...(id === right ? { correct: true } : { why: Cq(k, `bound.why.${id}`, o) }) });
    return {
      id: 'bound', kind: 'choice', cols: 1,
      prompt: Cq(k, 'bound.prompt', o),
      options: [mk(e.ok ? 'out' : 'in'), mk(right), mk('any')],
      hints: [Cq(k, 'bound.hint1', o), Cq(k, 'bound.hint2')],
      explain: Cq(k, e.ok ? 'bound.explainIn' : 'bound.explainOut', o),
    };
  },
  red: (lab, k) => {
    const { rel, bound } = lab.sol;
    const side = L.sideOf(lab.sol);
    const tex = (r) => $(`x ${L.relTex(r)} ${L.numTex(bound)}`);
    const flipped = Lin.flipRelation(rel);
    const strict = STRICT[rel];
    const redK = lab.traces.find((t) => t.ok && t.k !== L.boundK(lab))?.k ?? lab.traces.find((t) => t.ok)?.k;
    const redE = L.evaluate(lab, redK);
    const boundE = L.evaluate(lab, L.boundK(lab));
    const o = { bound: $(L.numTex(bound)), side: k(side === 'left' ? 'sideLeftWord' : 'sideRightWord'), final: tex(rel) };
    return {
      id: 'red', kind: 'choice', cols: 3,
      prompt: Cq(k, 'red.prompt', o),
      options: [
        { text: <MathText>{tex(flipped)}</MathText>, why: Cq(k, 'red.whyFlip', { ...o, wrong: tex(flipped), line: lineOf(lab, redE, k) }) },
        { text: <MathText>{tex(rel)}</MathText>, correct: true },
        { text: <MathText>{tex(strict)}</MathText>, why: Cq(k, 'red.whyStrict', { ...o, wrong: tex(strict), line: lineOf(lab, boundE, k) }) },
      ],
      hints: [Cq(k, 'red.hint1', o), Cq(k, 'red.hint2', o)],
      explain: Cq(k, 'red.explain', o),
    };
  },
  rule: (lab, k, { mode } = {}) => ({
    id: 'rule', kind: 'choice',
    prompt: <MathText>{k(mode === 'region' ? 'rPrompt' : mode === 'bracket' ? 'bPrompt' : 'fPrompt')}</MathText>,
    options: discoveryOptionsOf(lab, k, mode),
    hints: [Cq(k, `rule.hint1.${mode}`), Cq(k, `rule.hint2.${mode}`)],
    explain: <RayFormal lab={lab} k={k} mode={mode} />,
  }),
};
