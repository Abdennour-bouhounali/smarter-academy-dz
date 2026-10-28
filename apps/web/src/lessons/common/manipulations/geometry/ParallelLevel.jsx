import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import * as LIN from '@smarter-academy/core/arithmetic/linear.js';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import LabFold from '../primitives/LabFold';
import MathText from '../../components/MathText';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import { $, Mx, distinct, useTick, spreadAll } from './thalesCp';
import * as L from '../logic/parallelLevel';

/**
 * parallel-level — LE NIVEAU À BULLE (unité 9 « خاصية طالس », درس « الخاصية العكسية لخاصية طالس وإثبات
 * التوازي », نشاط 2 p. 105).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève POSE les deux extrémités d'une planche, B′ sur la barre (d) et C′ sur la barre (d′), encoche par
 *    encoche (glisser le long de la barre, toucher la barre, ▲ ▼, flèches du clavier) ; en متقدم il les fait
 *    passer de l'autre côté de A.
 * B. Idée : (B′C′) // (BC) ⇔ AB′/AB = AC′/AC ET A, B, B′ dans le même ordre que A, C, C′ (la réciproque de
 *    Thalès) ; deux rapports différents ⇒ pas parallèles.
 * C. La planche tourne avec ses extrémités ; le niveau à bulle posé dessus montre l'écart à (BC) — le sol ;
 *    les deux rapports s'écrivent sous la scène.
 * D. La ligne `AB′/AB = … ، AC′/AC = …` (les nombres de l'élève, réduits) ; en متقدم le côté de A de chaque
 *    point et les figures des trois élèves (1, 2, 3) cochées par SES placements.
 * E. À découvrir avant la règle : « même numéro de barreau » ne met pas de niveau ; deux planches de niveau de
 *    rapports différents ont chacune deux rapports ÉGAUX ; des rapports égaux de part et d'autre de A ne
 *    suffisent pas (la figure 3).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        la réciproque de la propriété de Thalès : rapports égaux + même ordre ⇒ parallèles
 *   OBJECT         une planche posée entre les deux barres d'une échelle double (مبتدئ) / d'un tréteau en X
 *                  (متقدم) ; un niveau à bulle posé sur la planche
 *   VARIABLE       la POSITION de B′ et de C′ (abscisses signées, une encoche par unité)
 *   INVARIANT      AB, AC, le sol (BC) ; le rapport d'une position ne dépend que de la longueur posée sur le tout
 *   TRANSFORMATION la planche tourne, la bulle glisse ; les deux rapports et le côté de A changent
 *   CONSTRAINT     B′ ∈ (d), C′ ∈ (d′), jamais en A ; en متقدم le rapport 1/3 du professeur
 *   RESISTANCE     la bulle FUIT vers l'extrémité haute tant que (B′C′) n'est pas parallèle à (BC) — jamais au
 *                  centre « presque » (écart minimal visible) ; en متقدم le professeur refuse une figure dont un
 *                  rapport n'est pas 1/3, et la figure 3, qui respecte 1/3 et 1/3, est refusée par la bulle (l'ORDRE)
 *   EVIDENCE       la bulle au centre ou non ; la ligne des deux rapports ; la liste des essais
 *   CONTRAST       مبتدئ : deux planches de niveau (1/3 et 2/3) contre une planche penchée (« même barreau »,
 *                  « même distance aux pieds ») ; متقدم : figures 1 et 2 de niveau contre la figure 3
 *   PREDICTION     le rapport imposé 1/3 : l'élève CALCULE où poser B′ et C′ (3 et 4) avant de voir la bulle
 *   DISCOVERY      « أفقي ⇔ AB′/AB = AC′/AC » ; « + نفس الترتيب »
 *   FORMALIZATION  الخاصية العكسية لخاصية طالس (معارف 3), et sa forme contraposée (ملاحظة 1 de معارف 1)
 *   TRANSFER       les modules 2–4 (معارف 3, طرائق ص 109, ex-7, 10–16, 23–25) et la banque d'exercices
 *
 * Toutes les vérités viennent de `thales.converse` (logic/parallelLevel.js) ; le dessin est en flottants mais la
 * bulle n'est au centre QUE si converse dit parallèle. Manuel (§6bis) : chaque position est un essai — aucune
 * auto-complétion.
 *
 * DÉCOR (exigence du propriétaire) : le mur de graffiti du quartier derrière l'échelle (rangs de briques, tags
 * de couleur) et la bombe de peinture du graffeur qui, touchée, lâche un nuage et change la couleur des tags.
 * `aria-hidden`, hors clavier (`tabIndex=-1`), `[data-deco]`, jamais une information ; immobile sous
 * `prefers-reduced-motion`.
 *
 * D'UN SEUL REGARD (§8bis) : la hauteur de la scène est la hauteur naturelle du dessin, bornée par l'écran de
 * leçon (`useLessonViewport`) moins ce que le bloc `[data-pl-glance]` mesure EN PLUS de la scène (commandes,
 * lecture, verdict) ; les poignées sont SUR les barres, les ▲ ▼ juste dessous, la lecture et le verdict ensuite ;
 * la liste des essais est dans un `LabFold` sous le bloc mesuré.
 *
 * Props : `AB`, `AC` (entiers), `ratio` (« 1/3 », mode crossing), `mode` (`ladder` | `crossing`), `theme`
 * (`mural`), `title`, `lead`, `mission`, `level`, `levels`, `onTrial(evidence)` à chaque position validée,
 * `onFinished({ mode, levels, figures })` à la règle — tous par `state.report`.
 *
 * CONTRAT DOM : [data-parallel-level][data-mode][data-solved][data-bp][data-cp], [data-pl-glance], [data-pl-scene],
 * [data-pl-track=B|C], [data-pl-handle=B|C] (role=slider), [data-pl-up|down=B|C], [data-pl-plank][data-parallel],
 * [data-pl-bubble][data-offset], [data-pl-ratios], [data-pl-side], [data-pl-verdict=<kind>], [data-pl-figures],
 * [data-pl-figure=<1|2|3>][data-made][data-ok], [data-lab-fold=parallel-level.trials], [data-deco].
 */
/** Dans une ligne de texte (verdict, essais), une fraction reste à hauteur de ligne. */
const tf = (tex) => tex.replace(/\\dfrac/g, '\\tfrac');
const TONE = { level: 'text-emerald-800', figure: 'text-emerald-800', tilted: 'text-rose-800', order: 'text-rose-800', condition: 'text-amber-800' };

export default function ParallelLevel({
  AB = 6, AC = 9, ratio, mode = 'ladder', theme = 'mural', title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, checkpoints: cpOn = true, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.parallelLevel.${key}`, o), [t]);
  const initialNumbers = ratio != null ? { AB, AC, ratio, mode } : { AB, AC, mode };
  const state = useManipulation({ type: 'parallel-level', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const make = () => L.init({ AB: nums.AB, AC: nums.AC, ratio: nums.ratio, mode: nums.mode });
  const [lab, setLab] = useState(make);
  const sceneKey = `${nums.AB}|${nums.AC}|${nums.ratio ?? ''}|${nums.mode}|${state.epoch}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [doneIds, setDoneIds] = useState([]);   // les étapes dont la suite de questions est finie
  const [tag, setTag] = useState(0);
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); setLab(make()); setDoneIds([]); }   // « إعادة » : tout repart
  const crossing = lab.mode === 'crossing';

  const solvedAll = L.discoveryReady(lab);

  /* ── les questions PENDANT le labo (primitives/LabCheckpoint) : après chaque étape (une planche de niveau / les figures 1 et 2, puis le contraste),
     une suite sur les nombres de l'élève ; la seconde finit par la règle et remplace la découverte automatique. L'enseignant seul peut les couper. ── */
  const cpSettings = useLabCheckpointSettings('parallel-level');
  const cpEnabled = cpOn && cpSettings.enabled;
  const steps = ['one', 'two'];
  const stepOk = { one: L.stageOneReached(lab), two: L.stageTwoReached(lab) };
  const pending = cpEnabled ? steps.find((g) => stepOk[g] && !doneIds.includes(g)) ?? null : null;
  const chain = pending ? chainOf(pending, lab.mode) : null;
  const cp = useLabCheckpoint({
    id: chain ? pending : null,
    questions: chain ? chain.map((q) => QUESTIONS[q](lab, pending, k)) : null,
    reached: !!pending,
    resetKey: scene.inits,
    onRetry: () => { celebrated.current.delete(pending); setLab((s) => L.retryStage(s, pending)); },
    onEvent: (ev) => state.report(onTrial, ev),
    onDone: (id) => {
      setDoneIds((d) => (d.includes(id) ? d : [...d, id]));
      if (chainOf(id, lab.mode).includes('rule')) { state.discover(); state.formalize(); }
    },
  });
  const ready = solvedAll && !cpEnabled;
  const stepDone = steps.map((g) => !!stepOk[g] && (!cpEnabled || doneIds.includes(g)));
  const stepNow = stepDone[0] ? 1 : 0;
  const party = useStepCelebration();
  const celebrated = useRef(new Set());
  if (lab.trials.length === 0 && celebrated.current.size) celebrated.current = new Set();   // « إعادة » : on refête
  useEffect(() => {
    stepDone.forEach((d, i) => {
      if (!d || celebrated.current.has(steps[i])) return;
      celebrated.current.add(steps[i]);
      party.celebrate({ n: stepDone.filter(Boolean).length, total: steps.length });
    });
  }, [stepDone.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  // le son : un déclic par encoche franchie, le drapeau quand la planche est bonne, « over » quand elle est refusée
  const tick = useTick();
  const nTrials0 = lab.trials.length;
  useEffect(() => {
    const tr = lab.last?.kind === 'commit' ? lab.last.trial : null;
    if (tr && nTrials0 > 0) playSfx(tr.kind === 'level' || tr.kind === 'figure' ? 'flag' : 'over');
  }, [nTrials0]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (state.isFormal) state.report(onFinished, { mode: lab.mode, levels: L.levelRatios(lab), figures: L.figuresMade(lab) });
  }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  const nTrials = lab.trials.length;
  useEffect(() => { if (nTrials > 0) state.report(onTrial, L.evidenceOf(lab)); }, [nTrials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure : largeur de la scène, écran de leçon, ce que le bloc « glance » mesure en plus ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const sceneRef = useRef(null);
  const sceneHRef = useRef(240);
  const [width, setWidth] = useState(320);
  const [overhead, setOverhead] = useState(190);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(150, Math.floor(el.clientWidth)));
      if (glanceRef.current) setOverhead(Math.max(120, Math.ceil(glanceRef.current.getBoundingClientRect().height) - sceneHRef.current));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (glanceRef.current) ro.observe(glanceRef.current);
    return () => ro.disconnect();
  }, []);
  const vp = useLessonViewport(true);
  const screenH = vp.ready && vp.height > 0 ? vp.height : 640;
  const narrow = width < 380;
  const sceneW = Math.min(width, 760);
  const sceneH = Math.round(Math.max(150, Math.min(L.naturalHeight(lab, sceneW), screenH - overhead - 28, 560)));
  sceneHRef.current = sceneH;
  const geo = L.geometry(lab, { width: sceneW, height: sceneH, pad: narrow ? 22 : 28 });
  const r = L.reading(lab);

  /* ── les deux gestes : une poignée par extrémité, la barre entière est la piste ── */
  const [live, setLive] = useState({ B: null, C: null });
  const toValueFor = (end) => (cx, cy) => {
    const box = sceneRef.current?.getBoundingClientRect();
    if (!box) return lab[end === 'B' ? 'sB' : 'sC'];
    const range = end === 'B' ? lab.rangeB : lab.rangeC;
    return L.slotFromAbscissa(geo.abscissaAt(end, cx - box.left, cy - box.top), range);
  };
  const stB = useStretchInteraction({
    value: lab.sB, range: lab.rangeB, toValue: toValueFor('B'), direction: geo.upward('B') > 0 ? 'ltr' : 'rtl',
    onChange: (v) => { setLive((s) => ({ ...s, B: v })); tick(); setLab((s) => L.move(s, 'B', v)); },
    onCommit: (v) => { setLive((s) => ({ ...s, B: null })); setLab((s) => L.commit(s, 'B', v)); },
  });
  const stC = useStretchInteraction({
    value: lab.sC, range: lab.rangeC, toValue: toValueFor('C'), direction: geo.upward('C') > 0 ? 'ltr' : 'rtl',
    onChange: (v) => { setLive((s) => ({ ...s, C: v })); tick(); setLab((s) => L.move(s, 'C', v)); },
    onCommit: (v) => { setLive((s) => ({ ...s, C: null })); setLab((s) => L.commit(s, 'C', v)); },
  });
  const ST = { B: stB, C: stC };
  const nameOf = { B: "B′", C: "C′" };
  const sideText = (end) => {
    const a = end === 'B' ? r.bp : r.cp;
    return a > 0 ? k(end === 'B' ? 'sideBetweenB' : 'sideBetweenC') : k('sideBeyond');
  };
  const valueText = (end) => {
    const a = end === 'B' ? r.bp : r.cp;
    return k('valueText', { name: nameOf[end], d: Math.abs(a), side: sideText(end) });
  };

  /* ── le verdict de la dernière position validée ── */
  const last = lab.last?.kind === 'commit' ? lab.last.trial : null;
  const verdict = last && (() => {
    const o = { b: tf(L.ratioTex(last.bp, lab.b)), c: tf(L.ratioTex(last.cp, lab.c)), n: last.figure === '3m' ? '3' : last.figure, target: lab.target ? tf(LIN.fracLatex(lab.target)) : '' };
    return <MathText>{k(`v_${last.kind}`, o)}</MathText>;
  })();

  /* ── la découverte : des distracteurs réfutés par les positions de l'élève ── */
  const discoveryOptions = useMemo(() => discoveryOptionsOf(lab, k), [lab, k]);

  const formal = formalOf(lab, k);

  const missionText = mission ?? <MathText>{k(crossing ? 'missionCrossing' : 'missionLadder', { target: lab.target ? LIN.fracLatex(lab.target) : '' })}</MathText>;
  const [rB, rC] = L.ratiosLine(lab);
  const made = L.figuresMade(lab);

  /* ── les poignées : sur la barre, la barre est la piste ── */
  const track = (end) => {
    const foot = end === 'B' ? geo.B : geo.C;
    const top = crossing ? (end === 'B' ? geo.topB : geo.topC) : geo.A;
    const len = Math.hypot(top[0] - foot[0], top[1] - foot[1]);
    const ang = (Math.atan2(top[1] - foot[1], top[0] - foot[0]) * 180) / Math.PI;
    const P = end === 'B' ? geo.Bp : geo.Cp;
    const d = Math.hypot(P[0] - foot[0], P[1] - foot[1]);
    const st = ST[end];
    return (
      <div key={end} {...st.trackProps} data-pl-track={end}
        className="absolute"
        style={{ ...st.trackProps.style, left: foot[0], top: foot[1] - 22, width: len, height: 44, transform: `rotate(${ang}deg)`, transformOrigin: '0 50%' }}>
        <div {...st.handleProps({ label: k('handle', { name: nameOf[end], bar: end === 'B' ? '(d)' : "(d′)" }), valueText: valueText(end) })}
          data-pl-handle={end} data-slot={end === 'B' ? lab.sB : lab.sC}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-full border-[3px] bg-white/95 shadow outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 ${live[end] != null ? 'border-indigo-600' : 'border-indigo-500'}`}
          style={{ left: d - 22, top: 0, cursor: st.dragging ? 'grabbing' : 'grab' }}>
          <span dir="ltr" className="font-mono text-sm font-extrabold text-indigo-900" style={{ transform: `rotate(${-ang}deg)` }}>{nameOf[end]}</span>
        </div>
      </div>
    );
  };

  const arrows = (end) => (
    <div className="flex items-center gap-1" dir="ltr">
      <span className="font-mono text-sm font-extrabold text-indigo-900">{nameOf[end]}</span>
      <button type="button" onClick={() => ST[end].nudge(1)} aria-label={k('up', { name: nameOf[end] })} data-pl-up={end}
        disabled={(end === 'B' ? lab.sB : lab.sC) >= (end === 'B' ? lab.rangeB : lab.rangeC).max}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-indigo-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"><ChevronUp className="h-5 w-5" aria-hidden="true" /></button>
      <button type="button" onClick={() => ST[end].nudge(-1)} aria-label={k('down', { name: nameOf[end] })} data-pl-down={end}
        disabled={(end === 'B' ? lab.sB : lab.sC) <= (end === 'B' ? lab.rangeB : lab.rangeC).min}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-indigo-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"><ChevronDown className="h-5 w-5" aria-hidden="true" /></button>
    </div>
  );

  return (
    <ManipulationShell
      type="parallel-level"
      title={title ?? k('title')}
      mission={missionText}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpOn ? cpSettings.control : null}
      guided={cpEnabled}
      hints={(crossing ? ['hintC1', 'hintC2', 'hintC3'] : ['hintL1', 'hintL2', 'hintL3']).map((h) => <MathText key={h}>{k(h, { target: lab.target ? LIN.fracLatex(lab.target) : '' })}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={(
        <ManipulationDiscovery state={state} prompt={<MathText>{k(crossing ? 'dPromptCross' : 'dPromptLadder')}</MathText>} options={discoveryOptions} formal={formal} />
      )}
      explanation={<MathText>{k(crossing ? 'explanationCross' : 'explanationLadder')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-amber-50/60 to-white" minHeight="min-h-[160px]">
        <div ref={boxRef} className="space-y-2" data-parallel-level data-mode={lab.mode} data-world={theme}
          data-solved={solvedAll ? 'true' : 'false'} data-bp={r.bp} data-cp={r.cp} data-scene-h={sceneH}>
          <div className="relative space-y-2">
          {party.node}
          {cp.node}
          <div ref={glanceRef} className="space-y-2" data-pl-glance>
            <LabStepper count={steps.length} current={stepNow} done={stepDone} stepAttr="data-pl-step" />
            <div ref={sceneRef} className="relative mx-auto" style={{ width: sceneW, height: sceneH }} data-pl-scene>
              <Scene geo={geo} lab={lab} crossing={crossing} tag={tag} />
              {track('B')}
              {track('C')}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5" data-pl-controls>
              {arrows('B')}
              {arrows('C')}
              <Deco onSpray={() => setTag((n) => n + 1)} />
            </div>
            <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold text-slate-800`} data-pl-ratios>
              <MathText>{rB}</MathText><span aria-hidden="true">،</span><MathText>{rC}</MathText>
            </div>
            {crossing && (
              <p className="text-center text-xs font-semibold text-slate-600" data-pl-side={r.sameOrder ? 'same' : 'opposite'}>
                <bdi dir="ltr" className="font-mono">B′</bdi> {sideText('B')} ، <bdi dir="ltr" className="font-mono">C′</bdi> {sideText('C')}
              </p>
            )}
            {crossing && (
              <ul className="flex flex-wrap justify-center gap-1.5" data-pl-figures={made.length}>
                {['1', '2', '3'].map((f) => {
                  const tr = f === '3' ? (L.figureTrial(lab, '3') ?? L.figureTrial(lab, '3m')) : L.figureTrial(lab, f);
                  return (
                    <li key={f} data-pl-figure={f} data-made={tr ? 'true' : 'false'} data-ok={tr ? String(tr.parallel) : undefined}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${!tr ? 'border-slate-200 bg-slate-50 text-slate-500' : tr.parallel ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>
                      {k('figureChip', { n: f })} {tr ? (tr.parallel ? '✓' : '✗') : '…'}
                    </li>
                  );
                })}
              </ul>
            )}
            <p role="status" className={`min-h-[2.5rem] text-center ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug ${last ? TONE[last.kind] : 'text-slate-500'}`}
              data-pl-verdict={last?.kind ?? ''}>
              {verdict ?? k('waiting')}
            </p>
          </div>
          </div>

          {lab.trials.length > 0 && (
            <LabFold id="parallel-level.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-pl-trials={lab.trials.length}>
                {lab.trials.map((x, i) => (
                  <li key={i} className={TONE[x.kind]} data-kind={x.kind}>
                    <MathText>{k('trialRow', { b: tf(L.ratioTex(x.bp, lab.b)), c: tf(L.ratioTex(x.cp, lab.c)), verdict: k(`t_${x.kind}`, { n: x.figure === '3m' ? '3' : x.figure }) })}</MathText>
                  </li>
                ))}
              </ul>
            </LabFold>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ── la scène : le mur, le sol, les barres graduées, la planche et son niveau ── */
const TAG_COLORS = ['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B'];

function Scene({ geo, lab, crossing, tag }) {
  const { A, B, C, topB, topC, Bp, Cp, deg, bubble, parallel, width, height } = geo;
  const reduce = useReducedMotion();
  const textProps = { direction: 'ltr', unicodeBidi: 'isolate' };
  const barTop = { B: crossing ? topB : A, C: crossing ? topC : A };
  const ground = Math.max(B[1], C[1]);
  const mid = [(Bp[0] + Cp[0]) / 2, (Bp[1] + Cp[1]) / 2];
  const vialW = Math.min(70, Math.max(46, Math.hypot(Cp[0] - Bp[0], Cp[1] - Bp[1]) * 0.6));
  const ext = 10;
  const ux = Math.cos((deg * Math.PI) / 180); const uy = Math.sin((deg * Math.PI) / 180);
  const left = Bp[0] <= Cp[0] ? Bp : Cp; const right = Bp[0] <= Cp[0] ? Cp : Bp;
  const color = TAG_COLORS[tag % TAG_COLORS.length];
  // une étiquette (ancrée au début, LTR) reste entière dans la scène : `w` est sa largeur approchée
  const clampX = (x, w) => Math.max(2, Math.min(width - w - 2, x));
  const bar = (end) => {
    const foot = end === 'B' ? B : C; const top = barTop[end];
    const notches = end === 'B' ? geo.notchesB : geo.notchesC;
    const dx = top[0] - foot[0]; const dy = top[1] - foot[1]; const l = Math.hypot(dx, dy) || 1;
    const n = [-dy / l, dx / l];
    return (
      <g key={end}>
        {crossing ? (
          <line x1={foot[0]} y1={foot[1]} x2={top[0]} y2={top[1]} stroke="#92400E" strokeWidth={11} strokeLinecap="round" />
        ) : (
          <>
            <line x1={foot[0] + n[0] * 6} y1={foot[1] + n[1] * 6} x2={top[0] + n[0] * 6} y2={top[1] + n[1] * 6} stroke="#64748B" strokeWidth={3.5} strokeLinecap="round" />
            <line x1={foot[0] - n[0] * 6} y1={foot[1] - n[1] * 6} x2={top[0] - n[0] * 6} y2={top[1] - n[1] * 6} stroke="#64748B" strokeWidth={3.5} strokeLinecap="round" />
          </>
        )}
        {notches.map((p) => (crossing ? (
          <circle key={p.slot} cx={p.xy[0]} cy={p.xy[1]} r={2.6} fill="#FEF3C7" stroke="#78350F" strokeWidth={0.8} data-notch={p.a} data-bar={end} />
        ) : (
          <line key={p.slot} x1={p.xy[0] + n[0] * 6} y1={p.xy[1] + n[1] * 6} x2={p.xy[0] - n[0] * 6} y2={p.xy[1] - n[1] * 6} stroke="#475569" strokeWidth={2.4} data-notch={p.a} data-bar={end} />
        )))}
      </g>
    );
  };
  return (
    <svg width={width} height={height} className="absolute inset-0" aria-hidden="true" focusable="false" style={{ direction: 'ltr' }}>
      {/* le mur du quartier (décor) */}
      <g data-deco="wall">
        <rect x={0} y={0} width={width} height={ground} fill="#FFF7ED" />
        {Array.from({ length: Math.ceil(ground / 18) }, (_, i) => (
          <line key={i} x1={0} x2={width} y1={i * 18} y2={i * 18} stroke="#FED7AA" strokeWidth={1} />
        ))}
        <path d={`M${width * 0.62} ${ground * 0.18} q ${width * 0.08} ${-ground * 0.1} ${width * 0.16} 0 t ${width * 0.14} ${ground * 0.06}`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" opacity={0.35} />
        <circle cx={width * 0.1} cy={ground * 0.2} r={Math.min(22, ground * 0.12)} fill={TAG_COLORS[(tag + 1) % 4]} opacity={0.25} />
        <path d={`M${width * 0.05} ${ground * 0.62} l ${width * 0.06} ${-ground * 0.12} l ${width * 0.05} ${ground * 0.1}`} fill="none" stroke={TAG_COLORS[(tag + 2) % 4]} strokeWidth={6} strokeLinecap="round" opacity={0.3} />
      </g>
      {/* le sol (BC) */}
      <rect x={0} y={ground} width={width} height={height - ground} fill="#E7E5E4" />
      <line x1={0} x2={width} y1={ground} y2={ground} stroke="#57534E" strokeWidth={2.5} />
      {bar('B')}
      {bar('C')}
      {/* la planche (B′C′) et son niveau à bulle */}
      <line x1={left[0] - ux * ext} y1={left[1] - uy * ext} x2={right[0] + ux * ext} y2={right[1] + uy * ext}
        stroke={parallel ? '#B45309' : '#C2410C'} strokeWidth={8} strokeLinecap="round" data-pl-plank data-parallel={parallel ? 'true' : 'false'} />
      <g transform={`translate(${mid[0]} ${mid[1] - 11}) rotate(${deg})`} data-pl-bubble data-offset={bubble.toFixed(2)}>
        <rect x={-vialW / 2 - 4} y={-8} width={vialW + 8} height={16} rx={4} fill="#1E293B" />
        <rect x={-vialW / 2} y={-5} width={vialW} height={10} rx={5} fill={parallel ? '#BBF7D0' : '#FEF08A'} />
        <line x1={-7} x2={-7} y1={-5} y2={5} stroke="#334155" strokeWidth={1.2} />
        <line x1={7} x2={7} y1={-5} y2={5} stroke="#334155" strokeWidth={1.2} />
        <ellipse cx={bubble * (vialW / 2 - 7)} cy={0} rx={6} ry={3.6} fill="#FFFFFF" stroke="#64748B" strokeWidth={0.8}
          style={{ transition: reduce ? 'none' : 'cx 220ms ease-out' }} />
      </g>
      {/* les points nommés (texte LTR) */}
      <circle cx={A[0]} cy={A[1]} r={4} fill="#0F172A" />
      <text x={A[0] + (crossing ? 12 : 0)} y={A[1] - 9} textAnchor="middle" fontSize={15} fontWeight={800} fill="#0F172A" style={textProps}>A</text>
      <circle cx={B[0]} cy={B[1]} r={4} fill="#0F172A" />
      <text x={B[0] - 4} y={B[1] + 17} textAnchor="middle" fontSize={15} fontWeight={800} fill="#0F172A" style={textProps}>B</text>
      <circle cx={C[0]} cy={C[1]} r={4} fill="#0F172A" />
      <text x={C[0] + 4} y={C[1] + 17} textAnchor="middle" fontSize={15} fontWeight={800} fill="#0F172A" style={textProps}>C</text>
      {crossing && <text x={clampX(topB[0] + 10, 26)} y={topB[1] + 4} fontSize={13} fontWeight={700} fill="#78350F" style={textProps}>(d)</text>}
      {crossing && <text x={clampX(topC[0] - 30, 30)} y={topC[1] + 4} fontSize={13} fontWeight={700} fill="#78350F" style={textProps}>(d′)</text>}
      <text x={clampX((A[0] + B[0]) / 2 - 62, 50)} y={(A[1] + B[1]) / 2} fontSize={12} fontWeight={700} fill="#475569" style={textProps}>{`AB = ${lab.b}`}</text>
      <text x={clampX((A[0] + C[0]) / 2 + 16, 52)} y={(A[1] + C[1]) / 2 + (crossing ? 0 : -6)} fontSize={12} fontWeight={700} fill="#475569" style={textProps}>{`AC = ${lab.c}`}</text>
    </svg>
  );
}

/** La bombe de peinture du graffeur : touchée, elle change la couleur du tag du mur. Décor seulement. */
function Deco({ onSpray }) {
  const reduce = useReducedMotion();
  const [puffs, setPuffs] = useState(0);
  return (
    <button type="button" tabIndex={-1} aria-hidden="true" data-deco="spray"
      onClick={() => { setPuffs((n) => n + 1); onSpray(); }}
      className="h-11 w-10 shrink-0 rounded-xl focus:outline-none">
      <svg viewBox="0 0 40 50" width="100%" height="100%">
        <style>{'.pl-p{transform-origin:28px 10px;animation:pl-p .5s ease-out 1}@keyframes pl-p{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(1.4)}}@media (prefers-reduced-motion: reduce){.pl-p{animation:none;opacity:0}}'}</style>
        <rect x="8" y="16" width="16" height="30" rx="4" fill="#7C3AED" />
        <rect x="11" y="10" width="10" height="7" rx="2" fill="#334155" />
        <rect x="8" y="24" width="16" height="5" fill="#FDE68A" />
        {puffs > 0 && !reduce && <circle key={puffs} className="pl-p" cx="30" cy="9" r="7" fill="#EC4899" />}
      </svg>
    </button>
  );
}

/* ── la découverte et la règle : les mêmes pour la fin du labo et pour la dernière question ── */
export function discoveryOptionsOf(lab, k) {
  const crossing = lab.mode === 'crossing';
    if (!crossing) {
      const lv = lab.trials.filter((x) => x.kind === 'level');
      const a = lv[0] ?? { bp: 2, cp: 3 };
      const off = lv.find((x) => !LIN.eq(x.ratioB, LIN.frac(1, 2))) ?? a;
      return [
        { text: <MathText>{k('dLadderEqual')}</MathText>, why: <MathText>{k('dLadderEqualWhy', { bp: a.bp, cp: a.cp })}</MathText> },
        { text: <MathText>{k('dLadderRatio')}</MathText>, correct: true },
        { text: <MathText>{k('dLadderMiddle')}</MathText>, why: <MathText>{k('dLadderMiddleWhy', { bp: off.bp, b: lab.b })}</MathText> },
        { text: <MathText>{k('dLadderFeet')}</MathText>, why: <MathText>{k('dLadderFeetWhy', { db: lab.b - a.bp, dc: lab.c - a.cp })}</MathText> },
      ];
    }
    const f3 = L.figureTrial(lab, '3') ?? L.figureTrial(lab, '3m');
    return [
      { text: <MathText>{k('dCrossRatioOnly')}</MathText>, why: <MathText>{k('dCrossRatioOnlyWhy', { bp: f3?.bp ?? 0, cp: f3?.cp ?? 0 })}</MathText> },
      { text: <MathText>{k('dCrossBetween')}</MathText>, why: <MathText>{k('dCrossBetweenWhy')}</MathText> },
      { text: <MathText>{k('dCrossRight')}</MathText>, correct: true },
    ];
}

export function formalOf(lab, k) {
  const crossing = lab.mode === 'crossing';
  return crossing ? (
    <div className="space-y-2" data-pl-formal>
      <p className="text-sm font-bold text-emerald-900"><MathText>{k('fCross')}</MathText></p>
      <ul className="space-y-1 text-sm">
        {['2', '1', '3', '3m'].map((f) => {
          const tr = L.figureTrial(lab, f);
          return tr ? <li key={f} className={tr.parallel ? 'text-emerald-800' : 'text-rose-800'}><MathText>{k(tr.parallel ? 'fFigureOk' : 'fFigureKo', { n: f === '3m' ? '3' : f, bp: tr.bp, cp: tr.cp })}</MathText></li> : null;
        })}
      </ul>
      <p className="text-sm text-emerald-900"><MathText>{k('fContra')}</MathText></p>
    </div>
  ) : (
    <div className="space-y-2" data-pl-formal>
      <EquationDisplay tone="result" tex={"\\dfrac{AB'}{AB} = \\dfrac{AC'}{AC} \\;\\Rightarrow\\; (B'C') \\parallel (BC)"} />
      <ul className="space-y-1 text-sm text-emerald-900">
        {lab.trials.filter((x) => x.kind === 'level').filter((x, i, arr) => arr.findIndex((y) => y.bp === x.bp) === i).map((x) => (
          <li key={x.bp}><MathText>{`$${L.ratioTex(x.bp, lab.b)}$ ${k('and')} $${L.ratioTex(x.cp, lab.c)}$`}</MathText></li>
        ))}
      </ul>
      <p className="text-sm text-emerald-900"><MathText>{k('fLadder')}</MathText></p>
    </div>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite de chaque étape. ladder : le rapport d'une planche de niveau, le même pour C′ ; puis la planche penchée et la règle.
 *  crossing : où poser B′ et C′ pour 1/3, ce que partagent les figures 1 et 2 ; puis la figure 3 et la règle. */
export const chainOf = (step, mode) => {
  if (mode === 'crossing') return step === 'one' ? ['crB', 'crC', 'crSide'] : ['crOrder', 'rule'];
  return step === 'one' ? ['lvB', 'lvC'] : ['tilt', 'rule'];
};

const fx = (n, d) => `\\dfrac{${n}}{${d}}`;
const fr = (n, d) => LIN.fracLatex(LIN.frac(n, d));
const sameFrac = (a, b) => LIN.eq(a, b);

/** Une fraction → ses options (la bonne + deux distracteurs distincts, chacun avec son `why`). */
const fracOptions = (right, cands, k, key, o) => [
  { text: <MathText>{$(LIN.fracLatex(right))}</MathText>, correct: true },
  ...distinct(right, cands.map((c) => ({ v: LIN.frac(c.n, c.d), why: c.why })), 2, sameFrac)
    .map((c) => ({ text: <MathText>{$(LIN.fracLatex(c.v))}</MathText>, why: Mx(k, `${key}.${c.why}`, { ...o, shown: $(LIN.fracLatex(c.v)) }) })),
];

const levelTrial = (lab) => lab.trials.find((x) => x.kind === 'level');
const firstOf = (lab, f) => L.figureTrial(lab, f);

const RAW_QUESTIONS = {
  /* مبتدئ — étape 1 : le rapport de B′ sur la planche de niveau, puis celui de C′ */
  lvB: (lab, step, k) => {
    const t = levelTrial(lab);
    const o = { bp: t.bp, b: lab.b, cp: t.cp, c: lab.c, r: $(LIN.fracLatex(t.ratioB)), raw: $(fx(t.bp, lab.b)) };
    return {
      id: 'lvB', kind: 'choice', cols: 3,
      prompt: Mx(k, 'lvB.prompt', o),
      options: fracOptions(t.ratioB, [
        { n: t.bp, d: lab.b - t.bp, why: 'whyRest' }, { n: lab.b - t.bp, d: lab.b, why: 'whyComplement' }, { n: lab.b, d: t.bp, why: 'whyInverse' }, { n: t.bp + 1, d: lab.b, why: 'whyNear' },
      ], k, 'lvB', o),
      hints: [Mx(k, 'lvB.hint1', o), Mx(k, 'lvB.hint2', o)],
      explain: Mx(k, 'lvB.explain', o),
    };
  },
  lvC: (lab, step, k) => {
    const t = levelTrial(lab);
    const o = { bp: t.bp, b: lab.b, cp: t.cp, c: lab.c, r: $(LIN.fracLatex(t.ratioB)), rawC: $(fx(t.cp, lab.c)) };
    return {
      id: 'lvC', kind: 'choice', cols: 3,
      prompt: Mx(k, 'lvC.prompt', o),
      options: fracOptions(t.ratioC, [
        { n: t.cp, d: lab.b, why: 'whyOther' }, { n: lab.c - t.cp, d: lab.c, why: 'whyComplement' }, { n: t.cp, d: lab.c - t.cp, why: 'whyRest' }, { n: t.cp + 1, d: lab.c, why: 'whyNear' },
      ], k, 'lvC', o),
      hints: [Mx(k, 'lvC.hint1', o), Mx(k, 'lvC.hint2', o)],
      explain: Mx(k, 'lvC.explain', o),
    };
  },
  /* مبتدئ — étape 2 : la planche penchée (la bulle a fui) */
  tilt: (lab, step, k) => {
    const t = lab.trials.find((x) => x.kind === 'tilted');
    const lv = levelTrial(lab);
    const o = { bp: t.bp, cp: t.cp, b: lab.b, c: lab.c, rb: $(LIN.fracLatex(t.ratioB)), rc: $(LIN.fracLatex(t.ratioC)), lbp: lv.bp, lcp: lv.cp };
    return {
      id: 'tilt', kind: 'choice',
      prompt: Mx(k, 'tilt.prompt', o),
      options: [
        { text: Mx(k, 'tilt.right', o), correct: true },
        { text: Mx(k, 'tilt.equal', o), why: Mx(k, 'tilt.whyEqual', o) },
        { text: Mx(k, 'tilt.lengths', o), why: Mx(k, 'tilt.whyLengths', o) },
      ],
      hints: [Mx(k, 'tilt.hint1', o), Mx(k, 'tilt.hint2', o)],
      explain: Mx(k, 'tilt.explain', o),
    };
  },
  /* متقدم — étape 1 : où poser B′ et C′ pour que le rapport vaille 1/3 (calcul AVANT de voir la bulle) */
  crB: (lab, step, k) => {
    const v = LIN.mul(lab.target, lab.b);
    const o = { b: lab.b, t: $(LIN.fracLatex(lab.target)), v: LIN.fracText(v) };
    return {
      id: 'crB', kind: 'number', expected: String(LIN.fracText(v)), answer: <MathText>{$(LIN.fracLatex(v))}</MathText>,
      prompt: Mx(k, 'crB.prompt', o),
      hints: [Mx(k, 'crB.hint1', o), Mx(k, 'crB.hint2', o)],
      explain: Mx(k, 'crB.explain', { ...o, calc: $(`AB' = ${LIN.fracLatex(lab.target)} \\times ${lab.b} = ${LIN.fracLatex(v)}`) }),
    };
  },
  crC: (lab, step, k) => {
    const v = LIN.mul(lab.target, lab.c);
    const o = { c: lab.c, t: $(LIN.fracLatex(lab.target)), v: LIN.fracText(v) };
    return {
      id: 'crC', kind: 'number', expected: String(LIN.fracText(v)), answer: <MathText>{$(LIN.fracLatex(v))}</MathText>,
      prompt: Mx(k, 'crC.prompt', o),
      hints: [Mx(k, 'crC.hint1', o), Mx(k, 'crC.hint2', o)],
      explain: Mx(k, 'crC.explain', { ...o, calc: $(`AC' = ${LIN.fracLatex(lab.target)} \\times ${lab.c} = ${LIN.fracLatex(v)}`) }),
    };
  },
  crSide: (lab, step, k) => {
    const f1 = firstOf(lab, '1'); const f2 = firstOf(lab, '2');
    const o = { p1: $(`AB' = ${Math.abs(f1.bp)}`), q1: $(`AC' = ${Math.abs(f1.cp)}`), p2: $(`AB' = ${Math.abs(f2.bp)}`), q2: $(`AC' = ${Math.abs(f2.cp)}`) };
    return {
      id: 'crSide', kind: 'choice',
      prompt: Mx(k, 'crSide.prompt', o),
      options: [
        { text: Mx(k, 'crSide.right', o), correct: true },
        { text: Mx(k, 'crSide.between', o), why: Mx(k, 'crSide.whyBetween', o) },
        { text: Mx(k, 'crSide.equalDist', o), why: Mx(k, 'crSide.whyEqualDist', o) },
      ],
      hints: [Mx(k, 'crSide.hint1', o), Mx(k, 'crSide.hint2', o)],
      explain: Mx(k, 'crSide.explain', o),
    };
  },
  /* متقدم — étape 2 : la figure 3 respecte le rapport mais la bulle la refuse */
  crOrder: (lab, step, k) => {
    const f3 = firstOf(lab, '3') ?? firstOf(lab, '3m');
    const o = { ab: $(`AB' = ${Math.abs(f3.bp)}`), ac: $(`AC' = ${Math.abs(f3.cp)}`), t: $(LIN.fracLatex(lab.target)) };
    return {
      id: 'crOrder', kind: 'choice',
      prompt: Mx(k, 'crOrder.prompt', o),
      options: [
        { text: Mx(k, 'crOrder.right', o), correct: true },
        { text: Mx(k, 'crOrder.ratios', o), why: Mx(k, 'crOrder.whyRatios', o) },
        { text: Mx(k, 'crOrder.short', o), why: Mx(k, 'crOrder.whyShort', o) },
      ],
      hints: [Mx(k, 'crOrder.hint1', o), Mx(k, 'crOrder.hint2', o)],
      explain: Mx(k, 'crOrder.explain', o),
    };
  },
  rule: (lab, step, k) => ({
    id: 'rule', kind: 'choice',
    prompt: <MathText>{k(lab.mode === 'crossing' ? 'dPromptCross' : 'dPromptLadder')}</MathText>,
    options: discoveryOptionsOf(lab, k),
    hints: [Mx(k, 'rule.hint1'), Mx(k, 'rule.hint2')],
    explain: formalOf(lab, k),
  }),
};

export const QUESTIONS = spreadAll(RAW_QUESTIONS, (lab) => lab.b + lab.c);
