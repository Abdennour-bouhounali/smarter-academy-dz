import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, MapPin, ListChecks } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import * as L from '../logic/vanishingPitch';
import * as Lin from '@smarter-academy/core/arithmetic/linear.js';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';

/**
 * vanishing-pitch — LE TERRAIN QUI S'ANNULE (unité 4 « معادلات ومتراجحات », leçon 2
 * « معادلات جداء معدوم »).
 *
 * Le monde est le terrain de football de l'unité 3, EXPRÈS : l'élève y a appris
 * qu'un produit de deux sommes est l'aire d'un rectangle dont ces sommes sont les
 * côtés. Ici les deux CÔTÉS sont les deux FACTEURS A = ax + b et B = cx + d, et
 * l'AIRE est leur produit. Rien n'est porté (ce n'est pas pitch-expansion) : les
 * côtés sont SIGNÉS, tracés depuis un coin ; un côté négatif part de l'autre côté du
 * coin, en pointillés rouges (« ضلع سالب »), et l'aire porte son signe.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève ÉTIRE x sur une règle graduée (useStretchInteraction, LTR ; clavier,
 *    − / +, toucher la règle). Puis il ÉPINGLE le x courant (« ثبّت هذا الحل »), et
 *    il JUGE « لا حلول أخرى ».
 * B. Idée : un produit est nul si et seulement si l'un de ses facteurs l'est —
 *    A × B = 0 ⇔ A = 0 أو B = 0.
 * C. Pendant le geste les deux côtés suivent x EN DIRECT ; quand un côté atteint 0
 *    le terrain S'ÉCRASE en une ligne (aire 0) — le phénomène ; un côté qui passe
 *    sous 0 se retourne.
 * D. L'épingle est jugée : refusée quand l'aire n'est pas nulle, avec l'aire lue
 *    exactement (« (−1) × 6 = −6 ≠ 0 ») ; posée sinon, avec le côté qui s'annule.
 * E. À découvrir : le terrain ne disparaît QUE quand un côté disparaît — d'où les
 *    deux équations du premier degré A = 0 et B = 0.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        خاصية الجداء المعدوم : A × B = 0 ⇔ A = 0 أو B = 0
 *   OBJECT         un terrain dont les côtés signés sont les deux facteurs
 *   VARIABLE       x (le doigt tient la poignée de la règle)
 *   INVARIANT      aire = A × B pour tout x ; un facteur constant non nul ne change
 *                  jamais (3 dans 3(x − 5))
 *   TRANSFORMATION les deux côtés, l'aire et son signe, en direct
 *   CONSTRAINT     une solution épinglée doit annuler l'aire
 *   RESISTANCE     l'épingle refusée avec l'aire exacte ; « لا حلول أخرى » refusé tant
 *                  qu'un zéro manque ou que la règle n'a pas été balayée des deux côtés
 *   EVIDENCE       le terrain réduit à une ligne ; les épingles sur la piste des solutions
 *   CONTRAST       un x refusé ET tous les zéros épinglés ; مبتدئ 3(x − 5) : le côté 3
 *                  ne s'écrase jamais (une solution) ; متقدم (x − 2)(x + 5) : deux
 *   PREDICTION     « où le terrain va-t-il disparaître ? » — la règle est là, rien n'est marqué
 *   DISCOVERY      « الجداء ينعدم إذا وفقط إذا انعدم أحد عامليه » (distracteurs réfutés
 *                  par les propres essais : « les deux à la fois », « x = 0 », « un côté
 *                  négatif »)
 *   FORMALIZATION  A × B = 0 ⇔ A = 0 أو B = 0, puis les deux équations du premier degré
 *   TRANSFER       معارف 2 (3x − 4)(−2x + 1) en sixièmes ; دوري الآن (2x + 1)² : un carré,
 *                  un zéro ; طرائق : factoriser pour revenir à ce terrain
 *
 * Toute expression « f1|f2 » de deux facteurs du premier degré (ou constants) est
 * acceptée par `expr` ; un seul facteur veut dire son carré. La graduation vient des
 * dénominateurs des zéros (logic/vanishingPitch.js) : chaque zéro est une graduation.
 * Manuel (§6bis) : chaque épingle est une réponse — pas d'auto-complétion.
 *
 * QUESTIONS PENDANT LE LABO (prototype `primitives/LabCheckpoint`, déploiement lot 3, 2026-10-28) : le labo n'a qu'UNE scène libre ; quand la
 * découverte est atteinte (un x refusé, tous les zéros épinglés, « لا حلول أخرى »), une suite unique se pose PAR-DESSUS le labo : l'aire lue pour
 * le x REFUSÉ (les mauvaises options sont les erreurs réelles : additionner les côtés, oublier le signe) · quel côté s'est annulé pour SON
 * épingle · combien de valeurs il a épinglées · LA RÈGLE (l'ancienne découverte, qui formalise). Obligatoires pour tout élève ; l'enseignant seul
 * les coupe pour SON compte (`checkpoints` = false les coupe aussi). `onCheckpoint(ev)` : la trace pour les étapes du module. ÉTAPES
 * `LabStepper` (`[data-vp-step=<i>]` : épingler les zéros · un x refusé · « لا حلول أخرى » + questions) + fête ; « إعادة » repart de zéro ;
 * « أعِد التجربة » remet le terrain au départ. SON : `tooth` (x bougé), `bell` (un côté s'annule), `flag` (épingle posée), `over` (refus).
 *
 * DÉCOR (exigence du propriétaire) : bandes de tonte, buts et un ballon que l'élève
 * peut taper (il roule dans le terrain ; quand le terrain s'écrase, il tombe sur la
 * ligne). Le décor ne porte AUCUNE information : `aria-hidden`, `tabIndex={-1}`, il ne
 * change jamais l'état du lab, et `prefers-reduced-motion` l'immobilise.
 */
export default function VanishingPitch({
  expr: expr0 = 'x-2|x+5', title, lead, mission, level, levels: withLevels = true, checkpoints: cpOn = true,
  initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, onCheckpoint,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.vanishingPitch.${key}`, o), [t]);
  const state = useManipulation({ type: 'vanishing-pitch', initialNumbers: { expr: expr0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { expr } = state.numbers;

  const make = () => L.init({ expr });
  const [lab, setLab] = useState(make);
  const sceneKey = `${expr}:${state.epoch}:${state.resetCount}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [live, setLive] = useState(null);
  const [kick, setKick] = useState(0);
  // Miroir synchrone de `lab` : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const labRef = useRef(lab);
  labRef.current = lab;
  // « إعادة » (resetCount), un autre niveau ou d'autres nombres : TOUT recommence — le terrain, les essais et les questions du labo
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); setLab(make()); setLive(null); }

  const ready = L.discoveryReady(lab);
  // les questions pendant le labo : une suite unique quand la découverte est atteinte ; celle qui finit par la règle remplace la découverte automatique
  const cpSettings = useLabCheckpointSettings('vanishing-pitch');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const cpLive = cpOn && cpSettings.enabled;
  const chain = cpLive ? CHAIN : null;
  const cp = useLabCheckpoint({
    id: chain ? expr : null,
    questions: chain && ready ? chain.map((q) => QUESTIONS[q](lab, k)) : null,
    reached: ready,
    resetKey: scene.inits,
    onRetry: () => { setLab(make()); setLive(null); },
    onEvent: (ev) => state.report(onCheckpoint, ev),   // {tk:'checkpoint'|'checkpoint-done', id: expr, …} — la TRACE que les étapes du module relisent
    onDone: () => { state.discover(); state.formalize(); },
  });
  useEffect(() => { if (ready && !cpLive) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, expr); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const { range, g } = lab;
  const EDGE = 22;
  const steps = Math.max(1, range.max - range.min);
  const mu = (width - 2 * EDGE) / steps;
  const xPx = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: live ?? lab.x ?? L.defaultV(lab), range, toValue, onChange: setLive,
    onCommit: (v) => { setLive(v); setLab((s) => L.move(s, v)); },
    direction: 'ltr', pageStep: g,
  });
  // Un x PAR DÉFAUT (L.defaultV : un terrain qui ne s'écrase pas, jamais une réponse). Ce n'est pas une visite : `lab.visited` ne le contient pas.
  const isDefault = lab.x == null && live == null;
  const v = live ?? lab.x ?? L.defaultV(lab);
  const settled = !stretch.dragging && (isDefault || (lab.x != null && (live == null || live === lab.x)));
  const unvisited = () => Array.from({ length: labRef.current.range.max - labRef.current.range.min + 1 }, (_, i) => labRef.current.range.min + i).filter((u) => !labRef.current.visited.includes(u));
  const cur = L.sides(lab, v);
  const geo = L.geometry(lab, v, { width: Math.min(width, 640) });
  const productTex = L.productTex(lab);
  const xText = L.labText(lab, cur.x);

  // une étape est FAITE quand son objectif est atteint ET (la dernière) ses questions répondues : la pastille passe au vert et on fête
  const stepDone = [L.allPinned(lab), L.allPinned(lab) && lab.refused.length > 0, ready && !cp.blocking];
  const nDone = stepDone.findIndex((d) => !d) < 0 ? stepDone.length : stepDone.findIndex((d) => !d);
  const party = useStepCelebration();
  const celebrated = useRef({ n: 0, inits: scene.inits });
  if (celebrated.current.inits !== scene.inits) celebrated.current = { n: 0, inits: scene.inits };   // « إعادة » : on refête
  useEffect(() => {
    if (nDone <= celebrated.current.n) return;
    celebrated.current.n = nDone;
    party.celebrate({ n: nDone, total: stepDone.length });
  }, [nDone]); // eslint-disable-line react-hooks/exhaustive-deps
  // le son du geste (muet sans « الصوت ») : x bougé (au plus un toutes les 35 ms), un côté qui s'annule
  const heard = useRef({ at: 0, v: null, zero: false });
  const zeroNow = Lin.isZero(cur.A) || Lin.isZero(cur.B);
  useEffect(() => {
    const h = heard.current;
    if (h.v == null) { h.v = v; h.zero = zeroNow; return; }
    if (h.v === v) return;
    h.v = v;
    const now = Date.now();
    if (now - h.at > 35) { playSfx('tooth'); h.at = now; }
    if (zeroNow && !h.zero) playSfx('bell');
    h.zero = zeroNow;
  }, [v]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── épingler, conclure ── */
  const pin = () => {
    stretch.flush();
    // La valeur en attente (clavier, −/+) est validée d'abord : on épingle ce qui est à l'écran.
    const base = live != null && live !== lab.x ? L.move(lab, live) : lab;
    const next = L.pin(base);
    setLab(next);
    const last = next.last;
    if (last && (last.kind === 'pinned' || last.kind === 'notZero')) {
      playSfx(last.kind === 'pinned' ? 'flag' : 'over');
      const sd = L.sides(next, last.v);
      state.report(onTrial, { x: L.labText(next, sd.x), xTex: L.labTex(next, sd.x), A: L.labText(next, sd.A), B: L.labText(next, sd.B), area: L.labText(next, sd.area), areaTex: L.areaTex(next, last.v), ok: last.kind === 'pinned', expr });
    }
    setKick((n) => n + 1);
  };
  const claim = () => { stretch.flush(); setLab((s) => L.claimNoOther(live != null && live !== s.x ? L.move(s, live) : s)); };

  const last = lab.last;
  const sideName = (i) => k(i === 0 ? 'sideA' : 'sideB');
  const zeroText = (zero) => (zero.length === 2 ? k('bothZero') : k('oneZero', { side: sideName(zero[0]) }));
  const verdict = last && ({
    pinned: () => <span className="text-emerald-800"><MathText>{k('vPinned', { x: L.labTex(lab, L.xOf(lab, last.v)), which: zeroText(last.zero) })}</MathText></span>,
    notZero: () => <span className="text-rose-800"><MathText>{k('vNot', { x: L.labTex(lab, L.xOf(lab, last.v)), area: L.areaTex(lab, last.v) })}</MathText></span>,
    already: () => <span className="text-slate-700">{k('vAlready')}</span>,
    noX: () => <span className="text-slate-700">{k('vNoX')}</span>,
    missing: () => <span className="text-rose-800">{k('vMissing')}</span>,
    notSwept: () => <span className="text-rose-800">{k('vNotSwept')}</span>,
    claimed: () => <span className="text-emerald-800">{k('vClaimed')}</span>,
  }[last.kind]?.());

  /* ── la découverte : distracteurs réfutés par les nombres du lab ── */
  const discoveryOptions = useMemo(() => discoveryOptionsOf(lab, k), [lab, k]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── le terrain ── */
  const uid = useId().replace(/:/g, '');
  const hatchId = `vp-hatch-${uid}`;
  const clipId = `vp-clip-${uid}`;
  const { rect } = geo;
  const stripe = Math.max(10, geo.unit);
  // Le ballon (décor) : dans le terrain, déplacé par chaque « tape » ; sur la ligne quand il s'écrase.
  const jig = [[0, 0], [0.25, -0.2], [-0.22, 0.18], [0.18, 0.22], [-0.25, -0.18]][kick % 5];
  const ball = geo.collapsed
    ? { cx: rect.w < 1e-9 ? rect.x : rect.x + rect.w / 2 + jig[0] * rect.w, cy: rect.h < 1e-9 ? rect.y : rect.y + rect.h / 2 + jig[1] * rect.h }
    : { cx: rect.x + rect.w / 2 + jig[0] * rect.w, cy: rect.y + rect.h / 2 + jig[1] * rect.h };
  const ballY = geo.collapsed ? ball.cy - 7 : ball.cy;

  const pinsHere = lab.pins;
  const grads = Array.from({ length: steps + 1 }, (_, i) => range.min + i);

  return (
    <ManipulationShell
      type="vanishing-pitch"
      title={title ?? k('title')}
      mission={mission ?? k('mission')}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpSettings.control}
      guided={!!chain}
      hints={[k('hint1'), k('hint2'), k('hint3')].map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        // Balayer la règle, graduation après graduation : chaque position est une visite (le balayage qui justifie « لا حلول أخرى »). Épingler reste la réponse de l'élève.
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: unvisited().length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => {
            const next = unvisited()[0];
            if (next === undefined) return;
            labRef.current = L.move(labRef.current, next);
            setLive(next);
            setLab((s) => L.move(s, next));
          },
          finish: () => {
            const todo = unvisited();
            if (todo.length === 0) return;
            labRef.current = todo.reduce((acc, u) => L.move(acc, u), labRef.current);
            setLive(todo[todo.length - 1]);
            setLab((s) => todo.reduce((acc, u) => L.move(acc, u), s));
          },
        },
      }}
      representation={settled && (
        <EquationDisplay
          tone={Lin0(cur.area) ? 'ok' : 'neutral'}
          tex={`x = ${L.labTex(lab, cur.x)} \\qquad A \\times B = ${L.areaTex(lab, v)}`}
          note={<MathText>{Lin0(cur.area) ? k('readZero') : k('readNot')}</MathText>}
        />
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k('dPrompt')}
          options={discoveryOptions}
          formal={<RuleFormal lab={lab} k={k} />}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/70 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="relative space-y-3" data-vanishing-pitch data-expr={expr} data-graduation={g}>
          {party.node}
          {cp.node}
          <LabStepper count={stepDone.length} current={Math.min(nDone, stepDone.length - 1)} done={stepDone} stepAttr="data-vp-step" />
          {/* ── la règle de x, et la piste des solutions ── */}
          <p className="text-sm font-bold text-slate-700"><MathText>{k('ruler')}</MathText></p>
          <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 92 }} data-vanishing-ruler>
            <svg width={width} height={92} className="absolute inset-0" aria-hidden="true" focusable="false">
              <rect x={EDGE - 4} y={26} width={steps * mu + 8} height={5} rx={2} fill="#047857" />
              {grads.map((u) => {
                const whole = u % g === 0;
                const tried = lab.visited.includes(u);
                return (
                  <g key={u}>
                    <line x1={xPx(u)} x2={xPx(u)} y1={33} y2={whole ? 42 : 37} stroke={tried ? '#0F766E' : '#64748B'} strokeWidth={whole ? 1.4 : 1} />
                    {whole && <text x={xPx(u)} y={55} textAnchor="middle" fontSize={11} fill="#334155" fontFamily="ui-monospace, monospace">{String(u / g).replace('-', '−')}</text>}
                  </g>
                );
              })}
              {/* la piste des solutions : épingles (vert) et refus (✗ rouge) */}
              <line x1={EDGE} x2={width - EDGE} y1={76} y2={76} stroke="#CBD5E1" strokeWidth={2} strokeDasharray="3 4" />
              {lab.refused.map((u) => (
                <g key={`r${u}`} data-vanishing-refused={u}>
                  <path d={`M ${xPx(u) - 5} 71 L ${xPx(u) + 5} 81 M ${xPx(u) + 5} 71 L ${xPx(u) - 5} 81`} stroke="#E11D48" strokeWidth={2.2} />
                </g>
              ))}
              {pinsHere.map((u) => (
                <g key={`p${u}`} data-vanishing-pin={u}>
                  <line x1={xPx(u)} x2={xPx(u)} y1={34} y2={70} stroke="#059669" strokeWidth={1.5} strokeDasharray="2 3" />
                  <circle cx={xPx(u)} cy={76} r={7} fill="#059669" />
                </g>
              ))}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: k('valueText', { x: xText }) })}
              className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
              style={{ left: xPx(v), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span className="-mt-2 whitespace-nowrap rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-vanishing-x>{xText}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">{k('trackNote')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('less')} disabled={v <= range.min} data-vanishing-less
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[6rem] text-center text-sm font-bold text-slate-700" dir="ltr">x = {xText}</p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('more')} disabled={v >= range.max} data-vanishing-more
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>

          {/* ── le terrain : côtés signés depuis le coin O ── */}
          <div className="overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-1" dir="ltr">
            <div className="relative mx-auto" style={{ width: geo.svgW, height: geo.svgH, maxWidth: '100%' }} data-vanishing-field data-collapsed={geo.collapsed ? 'true' : 'false'} data-sign={geo.sign}>
              <svg width={geo.svgW} height={geo.svgH} viewBox={`0 0 ${geo.svgW} ${geo.svgH}`} className="absolute inset-0 h-full w-full" role="img"
                aria-label={k('ariaPitch', { a: L.labText(lab, cur.A), b: L.labText(lab, cur.B), area: L.labText(lab, cur.area) })}>
                <defs>
                  <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#E11D48" strokeWidth="2.2" strokeOpacity="0.7" />
                  </pattern>
                  <clipPath id={clipId}><rect x={rect.x} y={rect.y} width={Math.max(rect.w, 0.01)} height={Math.max(rect.h, 0.01)} /></clipPath>
                </defs>
                {/* les axes du coin O */}
                <line x1={0} x2={geo.svgW} y1={geo.oy} y2={geo.oy} stroke="#CBD5E1" strokeWidth={1} />
                <line x1={geo.ox} x2={geo.ox} y1={0} y2={geo.svgH} stroke="#CBD5E1" strokeWidth={1} />
                {/* décor : la pelouse tondue en bandes, les buts */}
                {!geo.collapsed && (
                  <g data-decor clipPath={`url(#${clipId})`}>
                    {Array.from({ length: Math.ceil(rect.w / stripe) + 1 }, (_, i) => (
                      <rect key={i} x={rect.x + i * stripe} y={rect.y} width={stripe} height={rect.h} fill={i % 2 ? '#16A34A' : '#22C55E'} />
                    ))}
                    <line x1={rect.x + rect.w / 2} x2={rect.x + rect.w / 2} y1={rect.y} y2={rect.y + rect.h} stroke="#fff" strokeOpacity={0.45} strokeWidth={1.5} />
                    {geo.sign < 0 && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={`url(#${hatchId})`} data-vanishing-negative-area />}
                  </g>
                )}
                {!geo.collapsed && rect.h >= 18 && (
                  <g data-decor>
                    <rect x={rect.x - 6} y={rect.y + rect.h / 2 - Math.min(14, rect.h / 4)} width={6} height={Math.min(28, rect.h / 2)} fill="#F8FAFC" stroke="#94A3B8" />
                    <rect x={rect.x + rect.w} y={rect.y + rect.h / 2 - Math.min(14, rect.h / 4)} width={6} height={Math.min(28, rect.h / 2)} fill="#F8FAFC" stroke="#94A3B8" />
                  </g>
                )}
                {!geo.collapsed && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill="none" stroke="#fff" strokeWidth={2.5} />}
                {/* le terrain ÉCRASÉ : une ligne, aire 0 */}
                {geo.collapsed && (
                  <line x1={rect.x} y1={rect.y} x2={rect.x + rect.w} y2={rect.y + rect.h} stroke="#B45309" strokeWidth={5} strokeLinecap="round" data-vanishing-line />
                )}
                {/* les deux côtés signés, depuis O */}
                <line x1={geo.ox} y1={geo.oy} x2={geo.ox + L.toNum(cur.A) * geo.unit} y2={geo.oy} stroke={geo.negA ? '#E11D48' : '#1D4ED8'} strokeWidth={4} strokeDasharray={geo.negA ? '6 4' : undefined} strokeLinecap="round" data-vanishing-side="A" data-negative={geo.negA ? 'true' : 'false'} />
                <line x1={geo.ox} y1={geo.oy} x2={geo.ox} y2={geo.oy - L.toNum(cur.B) * geo.unit} stroke={geo.negB ? '#E11D48' : '#7C3AED'} strokeWidth={4} strokeDasharray={geo.negB ? '6 4' : undefined} strokeLinecap="round" data-vanishing-side="B" data-negative={geo.negB ? 'true' : 'false'} />
                <circle cx={geo.ox} cy={geo.oy} r={4} fill="#0F172A" />
                {/* décor : le ballon */}
                <g data-decor style={{ transition: 'transform 450ms cubic-bezier(.3,1.6,.5,1)', transform: `translate(${ball.cx}px, ${ballY}px)` }} className="motion-reduce:transition-none">
                  <circle r={7} fill="#fff" stroke="#0F172A" strokeWidth={1.4} />
                  <path d="M0 -3 L3 -1 L2 3 L-2 3 L-3 -1 Z" fill="#0F172A" />
                </g>
              </svg>
              {/* décor interactif : taper le ballon (hors clavier, sans effet mathématique) */}
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setKick((n) => n + 1)}
                className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${(ball.cx / geo.svgW) * 100}%`, top: `${(ballY / geo.svgH) * 100}%` }} data-decor-ball />
            </div>
          </div>

          {/* ── les côtés et l'aire, lus en direct (DOM) ── */}
          <ul className="flex flex-wrap gap-2 text-sm" data-vanishing-readout>
            {[0, 1].map((i) => {
              const val = i === 0 ? cur.A : cur.B;
              const zero = val.n === 0;
              const neg = val.n < 0;
              return (
                <li key={i} data-vanishing-reading={i === 0 ? 'A' : 'B'} className={`rounded-lg border-2 px-2 py-1 font-bold ${zero ? 'border-amber-400 bg-amber-50 text-amber-900' : neg ? 'border-rose-300 bg-rose-50 text-rose-900' : i === 0 ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-violet-200 bg-violet-50 text-violet-900'}`}>
                  {sideName(i)}{' '}<bdi dir="ltr"><MathText>{`$${L.factorTex(lab, i)} = ${L.labTex(lab, val)}$`}</MathText></bdi>
                  {neg && <span className="ms-1 text-xs font-semibold">({k('negSide')})</span>}
                  {zero && <span className="ms-1 text-xs font-semibold">({k('zeroSide')})</span>}
                  {!lab.square && L.isConstant(lab, i) && <span className="ms-1 text-xs font-normal">({k('constSide')})</span>}
                </li>
              );
            })}
            <li className={`rounded-lg border-2 px-2 py-1 font-bold ${geo.collapsed ? 'border-amber-400 bg-amber-100 text-amber-950' : 'border-slate-200 bg-white text-slate-800'}`} data-vanishing-area={L.labText(lab, cur.area)}>
              {k('area')}{' '}<bdi dir="ltr"><MathText>{`$${L.labTex(lab, cur.area)}$`}</MathText></bdi>
              {geo.collapsed && <span className="ms-1 text-xs font-semibold">— {k('collapsed')}</span>}
            </li>
          </ul>

          {/* ── les deux gestes de réponse ── */}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={pin} data-vanishing-pin-button
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-emerald-500 bg-white px-3 font-bold text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {k('pin')}
            </button>
            <button type="button" onClick={claim} data-vanishing-claim
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-slate-400 bg-white px-3 font-bold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
              <ListChecks className="h-4 w-4" aria-hidden="true" /> {k('noOther')}
            </button>
          </div>
          <p role="status" className="min-h-[1.5rem] text-sm font-bold" data-vanishing-verdict={last?.kind}>{verdict}</p>
          {pinsHere.length > 0 && (
            <p className="text-sm text-slate-800" data-vanishing-solutions>
              {k('solutionsOf')}{' '}<bdi dir="ltr"><MathText>{`$${productTex} = 0$`}</MathText></bdi>{' : '}
              {pinsHere.map((u, i) => (
                <React.Fragment key={u}>{i > 0 ? ` ${k('and')} ` : ''}<bdi dir="ltr"><MathText>{`$${L.labTex(lab, L.xOf(lab, u))}$`}</MathText></bdi></React.Fragment>
              ))}
              {lab.claimed && <> — {k('noOtherShort')}</>}
            </p>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

const Lin0 = (p) => p.n === 0;

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite unique : l'aire du x refusé, le côté qui s'annule, le nombre de valeurs épinglées, puis LA RÈGLE. */
export const CHAIN = Object.freeze(['area', 'which', 'count', 'rule']);

const $ = (x) => `$${x}$`;
const Cq = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;

/** Le x refusé de l'élève (le premier) et le premier zéro qu'il a épinglé. */
const refusedOf = (lab) => lab.refused[0];
const pinnedOf = (lab) => lab.pins[0];

/**
 * Les mauvaises aires d'un x refusé, chacune une erreur réelle : `sum` (A + B au lieu de A × B), `abs` (le signe oublié), `diff` (A − B), `first`
 * (on lit seulement le côté A). Écartées si elles égalent la bonne aire ou une autre déjà prise.
 */
export function wrongAreas(lab) {
  const sd = L.sides(lab, refusedOf(lab));
  const cands = [
    { id: 'sum', val: Lin.add(sd.A, sd.B) },
    { id: 'abs', val: sd.area.n < 0 ? Lin.neg(sd.area) : null },
    { id: 'diff', val: Lin.sub(sd.A, sd.B) },
    { id: 'first', val: sd.A },
  ];
  const out = [];
  for (const c of cands) {
    if (!c.val || Lin.eq(c.val, sd.area) || out.some((o) => Lin.eq(o.val, c.val))) continue;
    out.push(c);
  }
  return out;
}

export const QUESTIONS = {
  area: (lab, k) => {
    const u = refusedOf(lab);
    const sd = L.sides(lab, u);
    const o = { x: L.labTex(lab, sd.x), a: $(L.labTex(lab, sd.A, true)), b: $(L.labTex(lab, sd.B, true)), calc: $(L.areaTex(lab, u)) };
    const wrong = wrongAreas(lab).slice(0, 2);
    const wrongTex = (w) => ({ ...o, got: $(L.labTex(lab, w.val)) });
    return {
      id: 'area', kind: 'choice', cols: 3,
      prompt: Cq(k, 'area.prompt', o),
      options: [
        { text: <MathText>{$(L.labTex(lab, wrong[0].val))}</MathText>, why: Cq(k, `area.why.${wrong[0].id}`, wrongTex(wrong[0])) },
        { text: <MathText>{$(L.labTex(lab, sd.area))}</MathText>, correct: true },
        { text: <MathText>{$(L.labTex(lab, wrong[1].val))}</MathText>, why: Cq(k, `area.why.${wrong[1].id}`, wrongTex(wrong[1])) },
      ],
      hints: [Cq(k, 'area.hint1', o), Cq(k, 'area.hint2', o)],
      explain: Cq(k, 'area.explain', o),
    };
  },
  which: (lab, k) => {
    const p = pinnedOf(lab);
    const sd = L.sides(lab, p);
    const zs = L.zeroSides(lab, p);
    const o = { x: L.labTex(lab, sd.x), a: $(L.labTex(lab, sd.A)), b: $(L.labTex(lab, sd.B)) };
    const sideName = (i) => k(i === 0 ? 'sideA' : 'sideB').replace(/[:：]\s*$/, '');
    if (zs.length === 2) {
      return {
        id: 'which', kind: 'choice', cols: 3,
        prompt: Cq(k, 'which.prompt', o),
        options: [
          { text: Cq(k, 'which.onlyA'), why: Cq(k, 'which.whySquare', o) },
          { text: Cq(k, 'which.both'), correct: true },
          { text: Cq(k, 'which.onlyB'), why: Cq(k, 'which.whySquare', o) },
        ],
        hints: [Cq(k, 'which.hint1', o), Cq(k, 'which.hint2', o)],
        explain: Cq(k, 'which.explainSquare', o),
      };
    }
    const z = zs[0];
    const other = L.labTex(lab, z === 0 ? sd.B : sd.A);
    const w = { ...o, side: sideName(z), other: sideName(1 - z), v: $(other) };
    return {
      id: 'which', kind: 'choice', cols: 3,
      prompt: Cq(k, 'which.prompt', o),
      options: [
        { text: <MathText>{sideName(1 - z)}</MathText>, why: Cq(k, 'which.whyOther', w) },
        { text: <MathText>{sideName(z)}</MathText>, correct: true },
        { text: Cq(k, 'which.both'), why: Cq(k, 'which.whyBoth', w) },
      ],
      hints: [Cq(k, 'which.hint1', o), Cq(k, 'which.hint2', o)],
      explain: Cq(k, 'which.explain', w),
    };
  },
  count: (lab, k) => {
    const n = lab.pins.length;
    const o = { prod: $(L.productTex(lab)), n: $(String(n)) };
    return {
      id: 'count', kind: 'number', expected: String(n), answer: <MathText>{$(String(n))}</MathText>,
      prompt: Cq(k, 'count.prompt', o), hints: [Cq(k, 'count.hint1'), Cq(k, 'count.hint2', o)],
      explain: Cq(k, lab.square ? 'count.explainSquare' : 'count.explain', o),
    };
  },
  rule: (lab, k) => ({
    id: 'rule', kind: 'choice', prompt: <MathText>{k('dPrompt')}</MathText>,
    options: discoveryOptionsOf(lab, k),
    hints: [Cq(k, 'rule.hint1'), Cq(k, 'rule.hint2', { prod: $(L.productTex(lab)) })],
    explain: <RuleFormal lab={lab} k={k} />,
  }),
};

/** Les options de la règle : la bonne, et des distracteurs réfutés par les propres essais de l'élève. */
function discoveryOptionsOf(lab, k) {
  const sideName = (i) => k(i === 0 ? 'sideA' : 'sideB');
    const opts = [{ text: <MathText>{k('dOptRight')}</MathText>, correct: true }];
    // « les deux à la fois » : une épingle où UN SEUL côté s'annule le réfute.
    const single = lab.pins.find((p) => L.zeroSides(lab, p).length === 1);
    if (single != null) {
      const sd = L.sides(lab, single);
      const z = L.zeroSides(lab, single)[0];
      opts.push({ text: <MathText>{k('dOptBoth')}</MathText>, why: <MathText>{k('dWhyBoth', { x: L.labTex(lab, sd.x), side: sideName(z), other: sideName(1 - z), v: L.labTex(lab, z === 0 ? sd.B : sd.A) })}</MathText> });
    }
    // « x = 0 » : l'aire en 0, lue.
    if (L.sides(lab, 0).area.n !== 0) {
      opts.push({ text: <MathText>{k('dOptZero')}</MathText>, why: <MathText>{k('dWhyZero', { area: L.areaTex(lab, 0) })}</MathText> });
    }
    // « un côté négatif » : un x de la règle où un seul côté est négatif.
    for (let u = lab.range.min; u <= lab.range.max; u += 1) {
      const sd = L.sides(lab, u);
      if ((sd.A.n < 0) !== (sd.B.n < 0) && sd.area.n !== 0) {
        opts.push({ text: <MathText>{k('dOptNeg')}</MathText>, why: <MathText>{k('dWhyNeg', { x: L.labTex(lab, sd.x), area: L.areaTex(lab, u) })}</MathText> });
        break;
      }
    }
    // ordre stable, la bonne réponse jamais en premier
    return [...opts.slice(1, 2), opts[0], ...opts.slice(2)].filter(Boolean);
}

/** La forme et les solutions : A × B = 0 ⇔ A = 0 أو B = 0, puis les équations du premier degré de CE produit. */
function RuleFormal({ lab, k }) {
  const equations = L.equationsOf(lab);
  const constIdx = [0, 1].find((i) => !lab.square && L.isConstant(lab, i));
  const yourCase = `${L.productTex(lab)} = 0`;
  const caseNote = (
    <span>
      {k('means')}{' '}
      {equations.map((e, i) => (
        <React.Fragment key={e.i}>{i > 0 ? ` ${k('or')} ` : ''}<bdi dir="ltr"><MathText>{`$${e.tex}$`}</MathText></bdi></React.Fragment>
      ))}
      {constIdx != null && <> <MathText>{k('becauseConst', { c: L.labTex(lab, lab.factors[constIdx].b) })}</MathText></>}
    </span>
  );
  return (
    <div className="space-y-2" data-vanishing-formal>
      <EquationDisplay tone="result" tex="A \times B = 0" note={<MathText>{k('fRule')}</MathText>} />
      <p className="text-sm text-emerald-900"><MathText>{k('fProperty')}</MathText></p>
      <EquationDisplay tone="neutral" tex={yourCase} note={caseNote} />
      <p className="text-sm text-slate-800" data-vanishing-solutions-formal>
        {k('fSolutions', { n: k('nSolutions', { count: lab.roots.length }) })}{' '}
        {lab.roots.map((r, i) => (
          <React.Fragment key={i}>{i > 0 ? ` ${k('and')} ` : ''}<bdi dir="ltr"><MathText>{`$${L.rootTex(r, lab.decimal)}$`}</MathText></bdi></React.Fragment>
        ))}
      </p>
    </div>
  );
}
