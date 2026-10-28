import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { Minus, Plus, ChevronDown, ChevronUp, PencilLine, RotateCcw } from 'lucide-react';
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
import { $, Mx, distinct, spreadAll } from './thalesCp';
import * as L from '../logic/segmentDivider';

/**
 * segment-divider — L'ÉVENTAIL DES PARALLÈLES (unité 9 « خاصية طالس », درس « إنشاءات هندسية وتطبيقات
 * خاصية طالس (تقسيم قطعة مستقيم) », طرائق pp. 107 et 109). Règle NON graduée, compas, équerre — pour de vrai.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève tourne le rayon [Ax) (poignée au bout du rayon, ou toucher la scène), OUVRE le compas (la
 *    jambe-crayon du compas sous la scène : glisser, −/+, flèches), PIQUE chaque report (toucher la marque
 *    pointillée — un geste par report), relie une marque à B, puis FAIT GLISSER l'équerre le long de la règle
 *    (glisser n'importe où sur la scène, ‹ ›, flèches) et TRACE la parallèle (✏️, Entrée). En متقدم : il
 *    gradue au compas les deux parallèles (d₁) et (d₂) des deux côtés, puis pose les deux bouts de la règle.
 * B. Idée : des marques ÉGALES sur un rayon + des parallèles = des parts égales sur [AB] (Thalès dans le
 *    triangle A P_n B) ; MA/MB = AF/BE sur deux parallèles graduées à la même unité ; deux points.
 * C. Les marques se posent, la droite (P_n B) se trace, le bord de l'équerre balaie la scène et son point
 *    sur (AB) suit le doigt ; chaque parallèle tracée coupe [AB] ; la banderole du tifo se colore en bandes.
 * D. La mesure de la plateforme (« قياس ») écrit les parts exactes (10/3 ≈ 3,33 cm) ; en متقدم le rapport
 *    MA/MB du point trouvé ; la liste des essais (repliable).
 * E. À découvrir avant la règle : les parts ne dépendent ni de l'ouverture ni de l'angle — seulement de
 *    l'égalité des reports et de la marque reliée ; en متقدم, deux points (dedans / dehors).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        partager [AB] en n parts égales (ou dans le rapport p/q) SANS mesurer : Thalès
 *   OBJECT         un rayon, un compas, une règle non graduée, une équerre ; en متقدم deux parallèles
 *   VARIABLE       l'angle du rayon, l'OUVERTURE du compas (tenue : la changer en route est possible),
 *                  la marque reliée à B, la position de l'équerre ; en متقدم les côtés et les rangs des marques
 *   INVARIANT      les points de partage ne bougent pas quand l'ouverture ou l'angle change (essais
 *                  comparés) ; le bord de l'équerre reste parallèle à (P_n B) pendant qu'elle glisse
 *   TRANSFORMATION des marques, une droite reliée, des parallèles, des points sur [AB]
 *   CONSTRAINT     l'angle se fige à la première marque ; un report par geste ; une parallèle passe par une
 *                  marque ou n'est pas tracée
 *   RESISTANCE     « حافة الكوس لا تمر بعلامة » (tracé refusé hors marque) ; une ouverture changée donne des
 *                  bandes inégales MESURÉES ; relier la (n−1)-ième marque donne n − 1 bandes
 *                  (MISC-TALIS-ADAD-AL-ALAMAT) ; en متقدم 2 côté A / 3 côté B donne 2/3 (MISC-TALIS-NISBA-MAQLUBA),
 *                  deux unités différentes sont dénoncées, des rangs égaux du même côté donnent une règle
 *                  parallèle à (AB)
 *   EVIDENCE       les bandes égales ou non, la mesure exacte, le rapport MA/MB écrit
 *   CONTRAST       un essai juste ET un essai raté, ou deux essais justes de réglages différents ; en متقدم
 *                  le point de [AB] ET le point hors de [AB]
 *   PREDICTION     quelle marque relier à B ; de quel côté poser les marques pour rester dans [AB]
 *   DISCOVERY      « n marques égales, la n-ième reliée à B, des parallèles : n parts égales, quelle que soit
 *                  l'ouverture » ; « deux points : AM/AB = p/(p + q), AN/AB = p/(p − q) »
 *   FORMALIZATION  AM_k/AB = AP_k/AP_n = k/n (Thalès) ; MA/MB = AF/BE
 *   TRANSFER       طرائق ص 107 (méthode du manuel), ص 109 (دوري الآن 2/5), تمارين 17, 18, 19, 21
 *
 * Manuel (§6bis) : chaque report, chaque marque reliée, chaque parallèle est un geste qui peut être faux —
 * aucune auto-complétion.
 *
 * DÉCOR (exigence du propriétaire, monde `tifo` — la banderole géante que les ultras du quartier peignent
 * pour le derby) : un tambour (طبل) qui bat au toucher, des confettis quand une construction réussit.
 * `aria-hidden`, hors clavier, `[data-deco]`, jamais une information, immobiles sous `prefers-reduced-motion`.
 * Les BANDES colorées sous [AB] ne sont pas un décor : ce sont les parts que la construction a découpées.
 *
 * D'UN SEUL REGARD (§8bis) : la scène est une boîte FIXE (indépendante de l'angle — la poignée ne change pas
 * d'échelle sous le doigt) mise à l'échelle par la largeur ET par la hauteur de l'écran de leçon
 * (`useLessonViewport` moins ce que le bloc mesure en plus de la scène). Les commandes (compas, marques,
 * équerre, règle) sont juste sous la scène, la lecture dessous ; la liste des essais est un `LabFold` sous le
 * bloc mesuré `[data-sd-glance]`.
 *
 * Props : `mode` ('equal' | 'ratio'), `parts` (equal), `p`, `q`, `marks` (ratio : marques par rail),
 * `length` (AB en cm, 10), `theme` ('tifo'), `title`, `lead`, `mission`, `level`, `levels` (false : un seul
 * niveau, sans sélecteur), `onTrial(evidence)` à chaque construction finie / règle posée,
 * `onFinished({ mode, … })` à la règle formelle — tous par `state.report`.
 *
 * CONTRAT DOM : [data-segment-divider][data-mode][data-step][data-solved], [data-sd-glance], [data-sd-scene],
 * [data-sd-angle] (role=slider), [data-sd-ghost=<rail>], [data-sd-mark=<rail>:<i>], [data-sd-open] (slider),
 * [data-sd-open-less|more], [data-sd-join=<i>], [data-sd-square] (slider), [data-sd-square-prev|next],
 * [data-sd-draw], [data-sd-fresh], [data-sd-end=a|b] (slider), [data-sd-end-less|more=a|b],
 * [data-sd-cut=<i>], [data-sd-point=inside|outside], [data-sd-verdict=<kind>], [data-sd-reading],
 * [data-lab-fold=segment-divider.trials], [data-deco].
 */
const COLORS = ['#059669', '#ffffff', '#e11d48'];
const KNOB = 'absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-4';
const BTN = 'inline-flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-xl border-2 px-2 text-sm font-bold focus:outline-none focus-visible:ring-2 disabled:opacity-40';

export default function SegmentDivider({
  mode: mode0 = 'equal', parts: parts0 = 3, p: p0 = 3, q: q0 = 2, marks: marks0 = 5, length = 10, theme = 'tifo',
  title, lead, mission, level, levels: withLevels = true, initialMode = 'student', allowModeSwitch = false, checkpoints: cpOn = true, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.segmentDivider.${key}`, o), [t]);
  const initialNumbers = mode0 === 'ratio' ? { p: p0, q: q0, marks: marks0, mode: 'ratio' } : { parts: parts0, mode: 'equal' };
  const state = useManipulation({ type: 'segment-divider', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const ratio = nums.mode === 'ratio';
  const make = () => L.init({ mode: nums.mode, parts: nums.parts, p: nums.p, q: nums.q, marks: nums.marks, length });
  const [lab, setLab] = useState(make);
  const sceneKey = `${JSON.stringify(nums)}|${state.epoch}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [doneIds, setDoneIds] = useState([]);   // les étapes dont la suite de questions est finie
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); setLab(make()); setDoneIds([]); }   // « إعادة » : tout repart
  const reduce = useReducedMotion();

  /* ── les questions PENDANT le labo (primitives/LabCheckpoint) : une suite après chaque étape faite (equal : les marques posées, la 1re construction
     juste, le contraste ; ratio : un 1er point juste, les deux points) ; la dernière finit par la règle et remplace la découverte automatique. ── */
  const cpSettings = useLabCheckpointSettings('segment-divider');
  const cpEnabled = cpOn && cpSettings.enabled;
  const steps = L.stepsOf(lab.mode);
  const stepOk = Object.fromEntries(steps.map((g) => [g, L.stepReached(lab, g)]));
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
  const solvedAll = L.discoveryReady(lab);
  const ready = solvedAll && !cpEnabled;
  const stepDone = steps.map((g) => !!stepOk[g] && (!cpEnabled || doneIds.includes(g)));
  const stepNow = stepDone.includes(false) ? stepDone.indexOf(false) : steps.length - 1;
  const party = useStepCelebration();
  const celebrated = useRef(new Set());
  if (L.markCount(lab) === 0 && lab.trials.length === 0 && lab.joins.length === 0 && celebrated.current.size) celebrated.current = new Set();   // « إعادة » : on refête
  useEffect(() => {
    stepDone.forEach((d, i) => {
      if (!d || celebrated.current.has(steps[i])) return;
      celebrated.current.add(steps[i]);
      party.celebrate({ n: stepDone.filter(Boolean).length, total: steps.length });
    });
  }, [stepDone.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  // le son : un déclic par report / trait, le drapeau quand la construction est juste, « over » quand elle ou le geste est refusé
  useEffect(() => {
    const l = lab.last;
    if (!l) return;
    if (l.kind === 'carried' || l.kind === 'drawn' || l.kind === 'joined' || l.kind === 'fresh') playSfx('tooth');
    else if (l.kind === 'complete') playSfx(l.trial.ok ? 'flag' : 'over');
    else if (l.kind === 'join') playSfx(l.join.ok ? 'flag' : 'over');
    else if (['full', 'afterJoin', 'angleLocked', 'noMarks', 'joinLocked', 'joinFirst', 'offMark', 'joinedLine', 'already', 'rulerHalf'].includes(l.kind)) playSfx('over');
  }, [lab.last]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la découverte, les rapports à la leçon ── */
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { mode: lab.mode, trials: lab.trials.length, joins: lab.joins.length }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  const nEvents = ratio ? lab.joins.length : lab.trials.length;
  useEffect(() => { if (nEvents > 0) state.report(onTrial, L.evidenceOf(lab)); }, [nEvents]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure : largeur de la scène, hauteur de l'écran de leçon, ce que le bloc mesure en plus ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const sceneRef = useRef(null);
  const sceneHRef = useRef(260);
  const [cw, setCw] = useState(300);
  const [overhead, setOverhead] = useState(190);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setCw(Math.max(200, Math.floor(el.clientWidth)));
      if (glanceRef.current) setOverhead(Math.max(110, Math.ceil(glanceRef.current.getBoundingClientRect().height - sceneHRef.current)));
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
  const box = L.sceneBox(lab);
  const budget = Math.max(170, Math.min(560, screenH - overhead - 24));
  const scale = Math.max(0.6, Math.min(cw / box.w, budget / box.h));
  const W = Math.round(box.w * scale);
  const H = Math.round(box.h * scale);
  sceneHRef.current = H;
  const P = ([x, y]) => [(x - box.x0) * scale, (box.y1 - y) * scale];
  const fromClient = (cx, cy) => {
    const r = sceneRef.current?.getBoundingClientRect();
    if (!r) return [0, 0];
    return [(cx - r.left) / scale + box.x0, box.y1 - (cy - r.top) / scale];
  };
  const narrow = cw < 360;

  /* ── l'étape ── */
  const nMarks = L.markCount(lab);
  const done = !ratio && L.complete(lab);
  const step = ratio
    ? (nMarks === 0 ? 'ray' : L.lineMarks(lab, 'a').length && L.lineMarks(lab, 'b').length ? 'ruler' : 'compass')
    : (nMarks === 0 ? 'ray' : lab.joined == null ? 'compass' : done ? 'done' : 'slide');

  /* ── les gestes (moteur commun d'étirement) ── */
  const angleRange = L.ANGLE[lab.mode];
  const angleSt = useStretchInteraction({
    value: lab.angle, range: angleRange, direction: 'ltr', pageStep: 5,
    toValue: (cx, cy) => L.angleTo(lab, fromClient(cx, cy)),
    onChange: (v) => setLab((s) => L.setAngle(s, v)),
    onCommit: (v) => setLab((s) => L.setAngle(s, v)),
  });
  const openRange = L.OPEN[lab.mode];
  const openSt = useStretchInteraction({
    value: lab.opening, range: openRange, direction: 'ltr', pageStep: 5,
    toValue: (cx, _cy, rect) => openRange.min + ((cx - rect.left - 22) / Math.max(1, rect.width - 44)) * (openRange.max - openRange.min),
    onChange: (v) => setLab((s) => L.setOpening(s, v)),
    onCommit: (v) => setLab((s) => L.setOpening(s, v)),
  });
  const slideSt = useStretchInteraction({
    value: lab.slide, range: { min: 0, max: Math.max(1, L.slideMax(lab)) }, direction: 'ltr', pageStep: 5,
    toValue: (cx, cy) => L.snapSlide(lab, L.projectOn(lab, 'ray', fromClient(cx, cy))),
    onChange: (v) => setLab((s) => L.setSlide(s, v)),
    onCommit: (v) => setLab((s) => L.setSlide(s, v)),
  });
  const endHook = (line) => {
    const list = L.lineMarks(lab, line);
    const idx = lab.ends[line] == null ? null : list.indexOf(lab.ends[line]);
    const pick = (v) => list[Math.min(list.length - 1, Math.max(0, Math.round(v)))];
    return {
      value: idx, range: { min: 0, max: Math.max(0, list.length - 1) }, direction: 'ltr', pageStep: 2,
      toValue: (cx, cy) => {
        const sgn = L.projectOn(lab, `${line}+`, fromClient(cx, cy));
        let best = 0;
        list.forEach((v, i) => { if (Math.abs(v - sgn) < Math.abs(list[best] - sgn)) best = i; });
        return best;
      },
      onChange: (v) => { const m = pick(v); if (m != null) setLab((s) => L.setEnd(s, line, m)); },
      onCommit: (v) => { const m = pick(v); if (m != null) setLab((s) => L.commitRuler(L.setEnd(s, line, m))); },
    };
  };
  const endA = useStretchInteraction(endHook('a'));
  const endB = useStretchInteraction(endHook('b'));

  const carry = (rail) => setLab((s) => L.carry(s, rail));
  const drawNow = () => { slideSt.flush(); setLab((s) => L.draw(s)); };
  const keyDraw = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drawNow(); } };

  /* ── le verdict (les mots de la mathématique, jamais « bravo / faux ») ── */
  const fracTex = (f) => LIN.fracLatex(f);
  const target = ratio ? `\\dfrac{${lab.p}}{${lab.q}}` : '';
  const last = lab.last;
  const verdictKind = last?.kind === 'complete' ? last.trial.kind : last?.kind === 'join' ? last.join.kind : (last?.kind ?? '');
  const verdict = (() => {
    if (!last) return <span className="text-slate-600">{k(ratio ? 'startRatio' : 'startEqual')}</span>;
    switch (last.kind) {
      case 'angleLocked': return <span className="text-amber-800">{k('vAngleLocked')}</span>;
      case 'full': return <span className="text-amber-800">{k('vFull')}</span>;
      case 'afterJoin': return <span className="text-amber-800">{k('vAfterJoin')}</span>;
      case 'carried': return <span className="text-slate-800">{k(last.changed ? 'vCarriedChanged' : 'vCarried', { n: last.count })}</span>;
      case 'noMarks': return <span className="text-amber-800">{k('vNoMarks')}</span>;
      case 'joinLocked': return <span className="text-amber-800">{k('vJoinLocked')}</span>;
      case 'joined': return <span className="text-slate-800">{k('vJoined', { n: last.idx + 1 })}</span>;
      case 'joinFirst': return <span className="text-amber-800">{k('vJoinFirst')}</span>;
      case 'offMark': return <span className="text-rose-800" data-sd-refused="offMark">{k('vOffMark', { n: (last.near ?? 0) + 1 })}</span>;
      case 'joinedLine': return <span className="text-amber-800">{k('vJoinedLine')}</span>;
      case 'already': return <span className="text-slate-700">{k('vAlready', { n: last.idx + 1 })}</span>;
      case 'drawn': return <span className="text-slate-800">{k(LIN.cmp(last.t, LIN.frac(1)) > 0 ? 'vDrawnOutside' : 'vDrawn', { n: last.idx + 1 })}</span>;
      case 'fresh': return <span className="text-slate-700">{k('vFresh')}</span>;
      case 'rulerHalf': return <span className="text-amber-800">{k('vRulerHalf')}</span>;
      case 'complete': {
        const tr = last.trial;
        const partsTex = tr.parts.map((f) => L.lengthTex(lab, f)).join(' \\;;\\; ');
        if (tr.kind === 'ok') return <span className="text-emerald-800"><MathText>{k('vOk', { n: tr.n, part: L.lengthTex(lab, tr.parts[0]) })}</MathText></span>;
        if (tr.kind === 'count') return <span className="text-rose-800" data-sd-refused="count"><MathText>{k('vCount', { got: tr.n, want: lab.parts, parts: partsTex })}</MathText></span>;
        return <span className="text-rose-800" data-sd-refused="unequal"><MathText>{k('vUnequal', { parts: partsTex, openings: tr.openings.map(L.cmText).join(' ، ') })}</MathText></span>;
      }
      case 'join': {
        const j = last.join;
        if (j.parallel) return <span className="text-rose-800" data-sd-refused="parallel">{k('vParallel')}</span>;
        const o = { r: fracTex(j.ratio), target, t: fracTex(LIN.cmp(j.t, LIN.frac(0)) < 0 ? LIN.neg(j.t) : j.t) };
        if (j.kind === 'inside') return <span className="text-emerald-800"><MathText>{k('vInside', o)}</MathText></span>;
        if (j.kind === 'outside') return <span className="text-emerald-800"><MathText>{k(LIN.cmp(j.t, LIN.frac(0)) < 0 ? 'vOutsideA' : 'vOutsideB', o)}</MathText></span>;
        if (j.kind === 'inverted') return <span className="text-rose-800" data-sd-refused="inverted"><MathText>{k('vInverted', o)}</MathText></span>;
        if (j.kind === 'units') return <span className="text-rose-800" data-sd-refused="units"><MathText>{k('vUnits', o)}</MathText></span>;
        return <span className="text-rose-800" data-sd-refused="other"><MathText>{k('vOther', { ...o, ra: j.rankA ?? '?', rb: j.rankB ?? '?' })}</MathText></span>;
      }
      default: return null;
    }
  })();

  /* ── la lecture (ce que la scène dit, sans réponse) ── */
  const fnd = L.found(lab);
  const reading = ratio
    ? k('readRatio', { a: L.lineMarks(lab, 'a').length, b: L.lineMarks(lab, 'b').length, found: (fnd.inside ? 1 : 0) + (fnd.outside ? 1 : 0) })
    : k('readEqual', { marks: L.rayMarks(lab).length, joined: lab.joined == null ? '—' : lab.joined + 1, drawn: lab.parallels.length });

  /* ── découverte ── */
  const discoveryOptions = useMemo(() => discoveryOptionsOf(lab, k), [lab, k]);
  const formal = formalOf(lab, k);

  const missionText = mission ?? (ratio
    ? <MathText>{k('missionRatio', { target })}</MathText>
    : <MathText>{k('missionEqual', { n: lab.parts, len: length })}</MathText>);

  /* ── la scène ── */
  const sceneSvg = ratio ? <RatioScene lab={lab} P={P} W={W} H={H} box={box} /> : <EqualScene lab={lab} P={P} W={W} H={H} step={step} reduce={reduce} />;
  const ghostRails = ratio ? L.RAILS.ratio : (step === 'ray' || step === 'compass' ? ['ray'] : []);
  const railName = (rail) => k(`rail.${rail.replace('+', 'Up').replace('-', 'Down')}`);
  const angleEnd = P(L.railPoint(lab, ratio ? 'a+' : 'ray', L.railLength(lab)));
  const sq = !ratio && lab.joined != null && !done && lab.slide != null ? L.setSquareAt(lab, lab.slide) : null;
  const success = ratio ? lab.last?.kind === 'join' && lab.last.join.ok : lab.last?.kind === 'complete' && lab.last.trial.ok;

  const overlayTrack = step === 'ray' ? angleSt.trackProps : step === 'slide' ? slideSt.trackProps : null;

  return (
    <ManipulationShell
      type="segment-divider"
      title={title ?? k(ratio ? 'titleRatio' : 'title')}
      mission={missionText}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpOn ? cpSettings.control : null}
      guided={cpEnabled}
      hints={(ratio ? ['hint1Ratio', 'hint2Ratio', 'hint3Ratio'] : ['hint1Equal', 'hint2Equal', 'hint3Equal']).map((h) => <MathText key={h}>{k(h, { n: lab.parts, target })}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={<MathText>{k(ratio ? 'dPromptRatio' : 'dPromptEqual', { target })}</MathText>}
          options={discoveryOptions}
          formal={formal}
        />
      )}
      explanation={<MathText>{k(ratio ? 'explanationRatio' : 'explanationEqual')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/60 to-white">
        <div ref={boxRef} className="space-y-2" data-segment-divider data-mode={lab.mode} data-step={step} data-solved={solvedAll ? 'true' : 'false'}
          data-world={theme} data-scale={scale.toFixed(2)}>
          <div className="relative space-y-2">
          {party.node}
          {cp.node}
          <div ref={glanceRef} className="space-y-2" data-sd-glance>
            <LabStepper count={steps.length} current={stepNow} done={stepDone} stepAttr="data-sd-step" />
            {/* LA SCÈNE : le dessin, et par-dessus les poignées (HTML, ≥ 44 px) */}
            <div ref={sceneRef} className="relative mx-auto" style={{ width: W, height: H }} data-sd-scene>
              {sceneSvg}
              {success && !reduce && <Confetti key={`${lab.trials.length}-${lab.joins.length}`} w={W} />}
              <Drum />
              {overlayTrack && (
                <div {...overlayTrack} className="absolute inset-0" style={{ ...overlayTrack.style, cursor: step === 'ray' ? 'crosshair' : overlayTrack.style.cursor }} data-sd-track={step}>
                  {step === 'ray' && (
                    <div {...angleSt.handleProps({ label: k('angleHandle'), valueText: k('angleValue', { deg: lab.angle }) })}
                      data-sd-angle={lab.angle}
                      className={`${KNOB} border-indigo-600 bg-white/90 text-indigo-700 focus-visible:ring-indigo-300`}
                      style={{ left: angleEnd[0], top: angleEnd[1], cursor: angleSt.dragging ? 'grabbing' : 'grab' }}>
                      <span aria-hidden="true" className="text-lg">↻</span>
                    </div>
                  )}
                  {step === 'slide' && sq && (() => {
                    const r = P(sq.R);
                    return (
                      <div {...slideSt.handleProps({ label: k('squareHandle'), valueText: L.markUnderSquare(lab) >= 0 ? k('squareOnMark', { n: L.markUnderSquare(lab) + 1 }) : k('squareOffMark') })}
                        onKeyDown={(e) => { keyDraw(e); if (!e.defaultPrevented) slideSt.handleProps().onKeyDown(e); }}
                        data-sd-square={lab.slide}
                        className={`${KNOB} ${L.markUnderSquare(lab) >= 0 ? 'border-emerald-600 bg-emerald-50/90' : 'border-amber-500 bg-amber-50/90'} focus-visible:ring-amber-300`}
                        style={{ left: r[0], top: r[1], cursor: slideSt.dragging ? 'grabbing' : 'grab' }}>
                        <span aria-hidden="true" className="text-base">📐</span>
                      </div>
                    );
                  })()}
                </div>
              )}
              {/* les marques pointillées : toucher = piquer le compas sur ce rail */}
              {ghostRails.map((rail) => {
                if (L.canCarry(lab, rail) !== true) return null;
                // la vraie position est dessinée dans le SVG ; le bouton (44 px) est décalé de 18 px VERS L'EXTÉRIEUR
                // du rail, pour que les marques pointillées de part et d'autre de A (ou de B) ne se recouvrent pas
                const g0 = P(L.railPoint(lab, rail, L.ghostPos(lab, rail)));
                const g1 = P(L.railPoint(lab, rail, L.ghostPos(lab, rail) + 1));
                const len = Math.hypot(g1[0] - g0[0], g1[1] - g0[1]) || 1;
                const g = [g0[0] + ((g1[0] - g0[0]) / len) * 18, g0[1] + ((g1[1] - g0[1]) / len) * 18];
                return (
                  <button key={rail} type="button" onClick={() => carry(rail)} data-sd-ghost={rail}
                    aria-label={k('ghostLabel', { rail: railName(rail), n: lab.rails[rail].length + 1 })}
                    className={`${KNOB} border-dashed border-fuchsia-500 bg-fuchsia-50/40 text-fuchsia-700 focus-visible:ring-fuchsia-300`}
                    style={{ left: g[0], top: g[1] }}>
                    <span aria-hidden="true" className="text-sm">✎</span>
                  </button>
                );
              })}
              {/* en متقدم : les deux bouts de la règle, chacun sur sa parallèle */}
              {ratio && step === 'ruler' && [['a', endA], ['b', endB]].map(([line, st]) => {
                const v = lab.ends[line];
                const pt = P(v == null ? (line === 'a' ? [0, 0] : [L.AB, 0]) : L.railPoint(lab, `${line}${v > 0 ? '+' : '-'}`, Math.abs(v)));
                return (
                  <div key={line} {...st.trackProps} {...st.handleProps({ label: k(`endHandle.${line}`), valueText: v == null ? k('endNotSet') : k('endValue', { side: k(v > 0 ? 'up' : 'down'), n: L.markInfo(lab, line, v)?.rank ?? '?' }) })}
                    data-sd-end={line}
                    className={`${KNOB} ${v == null ? 'border-dashed border-slate-400 bg-white/70' : 'border-sky-700 bg-sky-50/90'} text-sky-800 focus-visible:ring-sky-300`}
                    style={{ ...st.trackProps.style, left: pt[0], top: pt[1] }}>
                    <span aria-hidden="true" className="text-xs font-extrabold" dir="ltr">{line === 'a' ? 'd₁' : 'd₂'}</span>
                  </div>
                );
              })}
            </div>

            {/* LES COMMANDES — juste sous la scène */}
            {(step === 'ray' || step === 'compass' || ratio) && (
              <div className="flex items-center gap-1.5" dir="ltr" data-sd-compass-row>
                <button type="button" onClick={() => openSt.nudge(-1)} aria-label={k('openLess')} data-sd-open-less className={`${BTN} border-slate-300 bg-white focus-visible:ring-indigo-400`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
                <CompassTrack st={openSt} value={lab.opening} range={openRange} label={k('openHandle')} valueText={k('openValue', { cm: L.cmText(lab.opening) })} />
                <button type="button" onClick={() => openSt.nudge(1)} aria-label={k('openMore')} data-sd-open-more className={`${BTN} border-slate-300 bg-white focus-visible:ring-indigo-400`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            )}
            {!ratio && step === 'compass' && (
              <div className="flex flex-wrap items-center gap-1.5" data-sd-join-row>
                <span className="text-xs font-bold text-slate-700">{k('joinTitle')}</span>
                <div className="flex flex-wrap gap-1.5" dir="ltr">
                  {L.rayMarks(lab).map((m, i) => (
                    <button key={i} type="button" onClick={() => setLab((s) => L.join(s, i))} data-sd-join={i}
                      aria-label={k('joinLabel', { n: i + 1 })}
                      className={`${BTN} border-indigo-300 bg-white text-indigo-800 focus-visible:ring-indigo-400`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!ratio && (step === 'slide' || step === 'done') && (
              <div className="flex flex-wrap items-center justify-center gap-1.5" data-sd-square-row>
                {step === 'slide' && (
                  <>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <button type="button" onClick={() => slideSt.set(L.neighbourMark(lab, -1))} aria-label={k('squarePrev')} data-sd-square-prev className={`${BTN} border-amber-300 bg-white focus-visible:ring-amber-400`}><ChevronDown className="h-4 w-4" aria-hidden="true" /></button>
                      <button type="button" onClick={drawNow} data-sd-draw className={`${BTN} border-emerald-700 bg-emerald-700 text-white focus-visible:ring-emerald-400`}>
                        <PencilLine className="h-4 w-4" aria-hidden="true" />{k('draw')}
                      </button>
                      <button type="button" onClick={() => slideSt.set(L.neighbourMark(lab, 1))} aria-label={k('squareNext')} data-sd-square-next className={`${BTN} border-amber-300 bg-white focus-visible:ring-amber-400`}><ChevronUp className="h-4 w-4" aria-hidden="true" /></button>
                    </div>
                  </>
                )}
                <button type="button" onClick={() => setLab((s) => L.fresh(s))} data-sd-fresh className={`${BTN} border-slate-300 bg-white text-slate-700 focus-visible:ring-indigo-400`}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />{k('fresh')}
                </button>
              </div>
            )}
            {ratio && step === 'ruler' && (
              <div className={`flex flex-wrap items-center justify-center ${narrow ? 'gap-x-1.5' : 'gap-x-3'} gap-y-1.5`} data-sd-ruler-row>
                {[['a', endA], ['b', endB]].map(([line, st]) => (
                  <div key={line} className="flex items-center gap-0.5" dir="ltr">
                    <button type="button" onClick={() => st.nudge(-1)} aria-label={k(`endLess.${line}`)} data-sd-end-less={line} className={`${BTN} border-sky-300 bg-white focus-visible:ring-sky-400`}><ChevronDown className="h-4 w-4" aria-hidden="true" /></button>
                    <span className={`${narrow ? 'min-w-[1.75rem] px-0.5 text-xs' : 'min-w-[2.75rem] px-2 text-sm'} rounded-full bg-sky-100 text-center font-extrabold text-sky-900`}>{line === 'a' ? (narrow ? 'd₁' : '(d₁)') : (narrow ? 'd₂' : '(d₂)')}</span>
                    <button type="button" onClick={() => st.nudge(1)} aria-label={k(`endMore.${line}`)} data-sd-end-more={line} className={`${BTN} border-sky-300 bg-white focus-visible:ring-sky-400`}><ChevronUp className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setLab((s) => L.fresh(s))} data-sd-fresh className={`${BTN} border-slate-300 bg-white text-slate-700 focus-visible:ring-indigo-400`}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />{narrow ? <span className="sr-only">{k('fresh')}</span> : k('fresh')}
                </button>
              </div>
            )}

            {/* LA LECTURE, puis le verdict */}
            <p className="text-center text-xs font-bold text-slate-600" data-sd-reading>{reading}</p>
            <p role="status" className={`min-h-[2.5rem] ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug`} data-sd-verdict={verdictKind}>{verdict}</p>
          </div>
          </div>

          {(lab.trials.length > 0 || lab.joins.length > 0) && (
            <LabFold id="segment-divider.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-sd-trials={ratio ? lab.joins.length : lab.trials.length}>
                {ratio
                  ? lab.joins.map((j, i) => (
                    <li key={i} className={j.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(j.ok)}>
                      <MathText>{j.parallel ? k('rowParallel') : k(`row.${j.kind}`, { r: fracTex(j.ratio) })}</MathText>
                    </li>
                  ))
                  : lab.trials.map((tr, i) => (
                    <li key={i} className={tr.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(tr.ok)}>
                      <MathText>{k(`row.${tr.kind}`, { n: tr.n, r: tr.openings.map(L.cmText).join(' ، '), deg: tr.angle })}</MathText>
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

/* ── la jambe-crayon du compas : l'ouverture, tenue ── */
function CompassTrack({ st, value, range, label, valueText }) {
  const f = (value - range.min) / (range.max - range.min);
  const wrap = useRef(null);
  const [tw, setTw] = useState(200);
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const m = () => setTw(Math.max(60, el.clientWidth));
    m();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const x0 = 22; const xp = 22 + f * (tw - 44); const xh = (x0 + xp) / 2;
  return (
    <div {...st.trackProps} ref={(el) => { st.trackProps.ref.current = el; wrap.current = el; }} className="relative h-12 min-w-[120px] flex-1 rounded-xl border-2 border-fuchsia-200 bg-fuchsia-50/50" style={st.trackProps.style} data-sd-open-track>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        {/* le compas : la pointe (fixe) à gauche, le crayon suit l'ouverture */}
        <line x1={x0} y1="40" x2={xh} y2="7" stroke="#475569" strokeWidth="2.5" />
        <line x1={xh} y1="7" x2={xp} y2="40" stroke="#a21caf" strokeWidth="2.5" />
        <circle cx={xh} cy="7" r="3.5" fill="#334155" />
        <circle cx={x0} cy="40" r="2.5" fill="#334155" />
      </svg>
      <div {...st.handleProps({ label, valueText })} data-sd-open={value}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-fuchsia-600 bg-white/90 outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300"
        style={{ left: `calc(22px + ${f} * (100% - 44px))`, cursor: st.dragging ? 'grabbing' : 'grab' }}>
        <span aria-hidden="true" className="text-base">✎</span>
      </div>
    </div>
  );
}

/* ── mode 'equal' : le rayon, les marques, la droite reliée, l'équerre, les parallèles, la banderole ── */
function EqualScene({ lab, P, W, H, step, reduce }) {
  const A = P([0, 0]); const B = P([L.AB, 0]);
  const marks = L.rayMarks(lab);
  const end = P(L.railPoint(lab, 'ray', L.railLength(lab)));
  const pj = lab.joined != null ? P(L.railPoint(lab, 'ray', marks[lab.joined].pos)) : null;
  const cuts = L.cutsOf(lab);
  const inside = [0, ...cuts.filter((c) => LIN.cmp(c.t, LIN.frac(1)) < 0).map((c) => LIN.toNumber(c.t)), 1].sort((a, b) => a - b);
  const sq = lab.joined != null && !L.complete(lab) && lab.slide != null ? L.setSquareAt(lab, lab.slide) : null;
  const frame = lab.joined != null ? L.setSquareFrame(lab) : null;
  const banner = 9;
  const ghost = step === 'ray' || step === 'compass' ? L.ghostPos(lab, 'ray') : null;
  const compassFrom = P(L.railPoint(lab, 'ray', L.lastPos(lab, 'ray')));
  const compassTo = ghost != null ? P(L.railPoint(lab, 'ray', ghost)) : null;
  const rpx = Math.hypot(B[0] - A[0], B[1] - A[1]) / L.AB; // px par mm
  return (
    <svg width={W} height={H} className="absolute inset-0" aria-hidden="true" focusable="false" style={{ direction: 'ltr' }}>
      {/* la banderole : des bandes entre les points de partage (les parts découpées par l'élève) */}
      {inside.slice(1).map((t, i) => {
        const x0 = A[0] + inside[i] * (B[0] - A[0]); const x1 = A[0] + t * (B[0] - A[0]);
        return <rect key={i} x={x0} y={A[1] + 2} width={Math.max(0, x1 - x0)} height={banner} fill={inside.length > 2 ? COLORS[i % 3] : '#e2e8f0'} stroke="#334155" strokeWidth="0.8" data-sd-band={i} />;
      })}
      {/* la règle et l'équerre */}
      {frame && sq && (
        <g data-sd-setsquare>
          <line x1={P(frame.ruler[0])[0]} y1={P(frame.ruler[0])[1]} x2={P(frame.ruler[1])[0]} y2={P(frame.ruler[1])[1]} stroke="#94a3b8" strokeWidth={Math.max(6, 7 * rpx)} strokeLinecap="round" opacity="0.7" />
          <polygon points={sq.tri.map((p) => P(p).join(',')).join(' ')} fill="rgba(245,158,11,0.25)" stroke="#b45309" strokeWidth="1.5" />
          <line x1={P(sq.V)[0]} y1={P(sq.V)[1]} x2={P(sq.C)[0]} y2={P(sq.C)[1]} stroke="#b45309" strokeWidth="1.5" strokeDasharray="5 4" />
          <circle cx={P(sq.C)[0]} cy={P(sq.C)[1]} r="3.5" fill="none" stroke="#b45309" strokeWidth="1.5" />
        </g>
      )}
      {/* [AB] */}
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      {/* le rayon [Ax) */}
      <line x1={A[0]} y1={A[1]} x2={end[0]} y2={end[1]} stroke="#4f46e5" strokeWidth="1.8" />
      <text x={end[0] + 6} y={end[1] + 4} fontSize="13" fill="#4f46e5" fontWeight="700">x</text>
      {/* la droite reliée (P_n B) et les parallèles tracées */}
      {pj && <line x1={pj[0]} y1={pj[1]} x2={B[0]} y2={B[1]} stroke="#4f46e5" strokeWidth="2" data-sd-joined={lab.joined} />}
      {cuts.map((c) => {
        const r = P(L.railPoint(lab, 'ray', marks[c.idx].pos));
        const x = P([LIN.toNumber(c.t) * L.AB, 0]);
        const out = LIN.cmp(c.t, LIN.frac(1)) > 0;
        return (
          <g key={c.idx} data-sd-cut={c.idx} data-t={LIN.fracText(c.t)}>
            <line x1={r[0]} y1={r[1]} x2={x[0]} y2={x[1]} stroke={out ? '#e11d48' : '#059669'} strokeWidth="1.8" />
            <circle cx={x[0]} cy={x[1]} r="3.5" fill={out ? '#e11d48' : '#059669'} />
          </g>
        );
      })}
      {/* le compas : la pointe sur la dernière marque, le crayon sur la marque pointillée */}
      {compassTo && (
        <g>
          <path d={arcPath(compassFrom, compassTo, 16)} fill="none" stroke="#a21caf" strokeWidth="1.4" />
          <line x1={compassFrom[0]} y1={compassFrom[1]} x2={(compassFrom[0] + compassTo[0]) / 2 - 6} y2={Math.min(compassFrom[1], compassTo[1]) - 16} stroke="#475569" strokeWidth="1.4" opacity="0.8" />
          <line x1={(compassFrom[0] + compassTo[0]) / 2 - 6} y1={Math.min(compassFrom[1], compassTo[1]) - 16} x2={compassTo[0]} y2={compassTo[1]} stroke="#a21caf" strokeWidth="1.4" opacity="0.8" />
        </g>
      )}
      {/* la marque pointillée : où tombera le prochain report */}
      {ghost != null && L.canCarry(lab, 'ray') === true && (() => { const gp = P(L.railPoint(lab, 'ray', ghost)); return <circle cx={gp[0]} cy={gp[1]} r="5" fill="none" stroke="#a21caf" strokeWidth="1.5" strokeDasharray="2 2" data-sd-ghost-mark="ray" />; })()}
      {/* les marques */}
      {marks.map((m, i) => {
        const p = P(L.railPoint(lab, 'ray', m.pos));
        const [dx, dy] = L.dirOf(lab.angle);
        const nx = -dy * 7; const ny = -dx * 7; // perpendiculaire (y écran vers le bas)
        const changed = i > 0 && m.r !== marks[i - 1].r;
        return (
          <g key={i} data-sd-mark={`ray:${i}`} data-pos={m.pos}>
            <line x1={p[0] - nx} y1={p[1] - ny} x2={p[0] + nx} y2={p[1] + ny} stroke={lab.joined === i ? '#4f46e5' : '#0f172a'} strokeWidth="2.2" />
            <text x={p[0] - 14 * Math.sin((lab.angle * Math.PI) / 180) - 4} y={p[1] - 2} fontSize="11" fontWeight="700" fill={changed ? '#e11d48' : '#334155'}>{i + 1}</text>
          </g>
        );
      })}
      <PointLabel at={A} name="A" dy={18} />
      <PointLabel at={B} name="B" dy={18} />
      {step === 'ray' && !reduce && <circle cx={end[0]} cy={end[1]} r="26" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />}
    </svg>
  );
}

/* ── mode 'ratio' : (d₁) // (d₂), leurs graduations, la règle, les points ── */
function RatioScene({ lab, P, W, H, box }) {
  const A = P([0, 0]); const B = P([L.AB, 0]);
  const len = L.railLength(lab);
  const ends = (o) => [P(L.railPoint(lab, `${o}-`, len)), P(L.railPoint(lab, `${o}+`, len))];
  const [a0, a1] = ends('a'); const [b0, b1] = ends('b');
  const left = P([box.x0, 0]); const right = P([box.x1, 0]);
  const { a, b } = lab.ends;
  const pa = a != null ? L.railPoint(lab, `a${a > 0 ? '+' : '-'}`, Math.abs(a)) : null;
  const pb = b != null ? L.railPoint(lab, `b${b > 0 ? '+' : '-'}`, Math.abs(b)) : null;
  let ruler = null; let live = null;
  if (pa && pb) {
    const d = [pb[0] - pa[0], pb[1] - pa[1]];
    const far = 20;
    ruler = [P([pa[0] - far * d[0], pa[1] - far * d[1]]), P([pb[0] + far * d[0], pb[1] + far * d[1]])];
    if (a !== b) live = P([(a / (a - b)) * L.AB, 0]);
  }
  const fnd = lab.joins.filter((j) => j.ok);
  const lastBad = [...lab.joins].reverse().find((j) => !j.ok && !j.parallel);
  const mIn = fnd.find((j) => j.inside);
  const tIn = mIn ? LIN.toNumber(mIn.t) : null;
  return (
    <svg width={W} height={H} className="absolute inset-0" aria-hidden="true" focusable="false" style={{ direction: 'ltr' }}>
      {/* la banderole [AB] : verte de A à M, blanche de M à B, une fois M trouvé */}
      {tIn != null ? (
        <>
          <rect x={A[0]} y={A[1] + 2} width={(B[0] - A[0]) * tIn} height="9" fill={COLORS[0]} stroke="#334155" strokeWidth="0.8" data-sd-band="0" />
          <rect x={A[0] + (B[0] - A[0]) * tIn} y={A[1] + 2} width={(B[0] - A[0]) * (1 - tIn)} height="9" fill={COLORS[1]} stroke="#334155" strokeWidth="0.8" data-sd-band="1" />
        </>
      ) : <rect x={A[0]} y={A[1] + 2} width={B[0] - A[0]} height="9" fill="#e2e8f0" stroke="#334155" strokeWidth="0.8" />}
      {/* la droite (AB) et le segment [AB] */}
      <line x1={left[0]} y1={left[1]} x2={right[0]} y2={right[1]} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 4" />
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      {/* (d₁) et (d₂) */}
      <line x1={a0[0]} y1={a0[1]} x2={a1[0]} y2={a1[1]} stroke="#4f46e5" strokeWidth="1.8" />
      <line x1={b0[0]} y1={b0[1]} x2={b1[0]} y2={b1[1]} stroke="#4f46e5" strokeWidth="1.8" />
      <text x={a1[0] + 5} y={a1[1] + 12} fontSize="12" fill="#4f46e5" fontWeight="700">(d₁)</text>
      <text x={b1[0] + 5} y={b1[1] + 12} fontSize="12" fill="#4f46e5" fontWeight="700">(d₂)</text>
      {/* les graduations */}
      {L.RAILS.ratio.map((rail) => lab.rails[rail].map((m, i) => {
        const p = P(L.railPoint(lab, rail, m.pos));
        const [dx, dy] = L.dirOf(lab.angle);
        const nx = -dy * 6; const ny = -dx * 6;
        const changed = i > 0 && m.r !== lab.rails[rail][i - 1].r;
        return (
          <g key={`${rail}${i}`} data-sd-mark={`${rail}:${i}`} data-pos={m.pos}>
            <line x1={p[0] - nx} y1={p[1] - ny} x2={p[0] + nx} y2={p[1] + ny} stroke={changed ? '#e11d48' : '#0f172a'} strokeWidth="2" />
          </g>
        );
      }))}
      {/* les marques pointillées : où tombera le prochain report sur chaque rail */}
      {L.RAILS.ratio.filter((rail) => L.canCarry(lab, rail) === true).map((rail) => {
        const gp = P(L.railPoint(lab, rail, L.ghostPos(lab, rail)));
        return <circle key={rail} cx={gp[0]} cy={gp[1]} r="4.5" fill="none" stroke="#a21caf" strokeWidth="1.4" strokeDasharray="2 2" data-sd-ghost-mark={rail} />;
      })}
      {/* la règle, et le point où elle coupe (AB) — sous le doigt */}
      {ruler && <line x1={ruler[0][0]} y1={ruler[0][1]} x2={ruler[1][0]} y2={ruler[1][1]} stroke="#0369a1" strokeWidth="1.8" data-sd-ruler />}
      {live && <circle cx={live[0]} cy={live[1]} r="4" fill="none" stroke="#0369a1" strokeWidth="2" data-sd-live />}
      {lastBad && (() => { const x = P([LIN.toNumber(lastBad.t) * L.AB, 0]); return <text x={x[0]} y={x[1] - 6} fontSize="12" fill="#e11d48" textAnchor="middle" fontWeight="700">✗</text>; })()}
      {fnd.map((j, i) => {
        const x = P([LIN.toNumber(j.t) * L.AB, 0]);
        return (
          <g key={i} data-sd-point={j.inside ? 'inside' : 'outside'}>
            <circle cx={x[0]} cy={x[1]} r="4.5" fill="#059669" />
            <text x={x[0]} y={x[1] - 9} fontSize="13" fontWeight="800" fill="#065f46" textAnchor="middle">{j.inside ? 'M' : 'N'}</text>
          </g>
        );
      })}
      <PointLabel at={A} name="A" dy={20} dx={-8} />
      <PointLabel at={B} name="B" dy={20} dx={8} />
    </svg>
  );
}

function PointLabel({ at, name, dx = 0, dy = 16 }) {
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r="3" fill="#0f172a" />
      <text x={at[0] + dx} y={at[1] + dy} fontSize="14" fontWeight="800" fill="#0f172a" textAnchor="middle">{name}</text>
    </g>
  );
}

/** Un petit arc de cercle centré en `c` passant par `p` (le trait du compas), ±`deg` degrés. */
function arcPath(c, p, deg) {
  const r = Math.hypot(p[0] - c[0], p[1] - c[1]);
  if (r < 1) return '';
  const a0 = Math.atan2(p[1] - c[1], p[0] - c[0]);
  const d = (deg * Math.PI) / 180;
  const q1 = [c[0] + r * Math.cos(a0 - d), c[1] + r * Math.sin(a0 - d)];
  const q2 = [c[0] + r * Math.cos(a0 + d), c[1] + r * Math.sin(a0 + d)];
  return `M${q1[0]} ${q1[1]} A${r} ${r} 0 0 1 ${q2[0]} ${q2[1]}`;
}

/** Le tambour des ultras : il bat au toucher. Décor seulement. */
function Drum() {
  const reduce = useReducedMotion();
  const [taps, setTaps] = useState(0);
  return (
    <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setTaps((n) => n + 1)} data-deco="tifo"
      className="absolute end-1 top-1 z-10 h-9 w-9 rounded-xl focus:outline-none">
      <svg viewBox="0 0 60 50" width="100%" height="100%">
        <style>{'.sd-d{transform-origin:30px 28px;animation:sd-d .35s ease-out 2}@keyframes sd-d{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}@media (prefers-reduced-motion: reduce){.sd-d{animation:none}}'}</style>
        <g key={taps} className={taps > 0 && !reduce ? 'sd-d' : undefined}>
          <ellipse cx="30" cy="18" rx="20" ry="7" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
          <path d="M10 18 L10 36 Q30 46 50 36 L50 18" fill="#059669" stroke="#334155" strokeWidth="2" />
          <path d="M10 26 Q30 36 50 26" fill="none" stroke="#e11d48" strokeWidth="3" />
        </g>
        <line x1="44" y1="4" x2="34" y2="14" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Des confettis vert-blanc-rouge quand une construction réussit. Décor seulement. */
function Confetti({ w }) {
  const xs = [0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88];
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" data-deco="confetti">
      <style>{'.sd-c{animation:sd-c 1.4s ease-in 1 forwards;opacity:0}@keyframes sd-c{0%{transform:translateY(0);opacity:1}100%{transform:translateY(90px);opacity:0}}@media (prefers-reduced-motion: reduce){.sd-c{animation:none}}'}</style>
      {xs.map((f, i) => (
        <rect key={i} className="sd-c" x={f * w} y={4 + (i % 3) * 6} width="6" height="9" rx="1" fill={COLORS[i % 3] === '#ffffff' ? '#cbd5e1' : COLORS[i % 3]} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </svg>
  );
}

/* ── la découverte et la règle : les mêmes pour la fin du labo et pour la dernière question ── */
export function discoveryOptionsOf(lab, k) {
  const ratio = lab.mode === 'ratio';
  const target = ratio ? `\\dfrac{${lab.p}}{${lab.q}}` : '';
  const fracTex = (f) => LIN.fracLatex(f);
    if (ratio) {
      const miss = lab.joins.find((j) => !j.ok && !j.parallel);
      return [
        { text: <MathText>{k('dOptOne')}</MathText>, why: <MathText>{k('dWhyOne')}</MathText> },
        { text: <MathText>{k('dOptTwo')}</MathText>, correct: true },
        { text: <MathText>{k('dOptMany')}</MathText>, why: <MathText>{miss ? k('dWhyManyWitness', { r: fracTex(miss.ratio), target }) : k('dWhyMany', { target })}</MathText> },
      ];
    }
    const ok = lab.trials.find((tr) => tr.ok) ?? lab.trials[0];
    const r = ok ? L.cmText(ok.openings[0]) : '';
    const share = L.lengthTex(lab, LIN.frac(1, lab.parts));
    return [
      { text: <MathText>{k('dOptOpening')}</MathText>, why: <MathText>{k('dWhyOpening', { r, share, n: lab.parts })}</MathText> },
      { text: <MathText>{k('dOptRight', { n: lab.parts })}</MathText>, correct: true },
      { text: <MathText>{k('dOptFewer')}</MathText>, why: <MathText>{k('dWhyFewer', { n: lab.parts })}</MathText> },
    ];
}

export function formalOf(lab, k) {
  const ratio = lab.mode === 'ratio';
  const target = ratio ? `\\dfrac{${lab.p}}{${lab.q}}` : '';
  const fracTex = (f) => LIN.fracLatex(f);
  return ratio ? (
    <div className="space-y-2" data-sd-formal>
      <EquationDisplay tone="result" tex={`\\dfrac{MA}{MB} = \\dfrac{AF}{BE} = ${target}`} />
      <EquationDisplay tone="result" tex={`\\dfrac{AM}{AB} = \\dfrac{${lab.p}}{${lab.p} + ${lab.q}} = ${fracTex(LIN.frac(lab.p, lab.p + lab.q))}`} note={k('fInside')} />
      {lab.p !== lab.q && <EquationDisplay tone="result" tex={`\\dfrac{AN}{AB} = \\dfrac{${lab.p}}{|${lab.p} - ${lab.q}|} = ${fracTex(LIN.frac(lab.p, Math.abs(lab.p - lab.q)))}`} note={k('fOutside')} />}
      <p className="text-sm text-emerald-900"><MathText>{k('fRuleRatio')}</MathText></p>
    </div>
  ) : (
    <div className="space-y-2" data-sd-formal>
      <EquationDisplay tone="result" tex={`\\dfrac{AM_1}{AB} = \\dfrac{AP_1}{AP_{${lab.parts}}} = \\dfrac{1}{${lab.parts}}`} />
      <p className="text-sm text-emerald-900"><MathText>{k('fRuleEqual', { n: lab.parts })}</MathText></p>
    </div>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite de chaque étape. equal : les marques → quelle marque relier, pourquoi la même ouverture ; la 1re construction juste → la longueur d'une part,
 *  pourquoi elles sont égales ; le contraste → la cause de l'écart (ou l'invariance), puis la règle. ratio : un 1er point → la nature de M, où il tombe ;
 *  les deux points → AM/AB, puis la règle. */
export const chainOf = (step, mode) => {
  if (mode === 'ratio') return step === 'one' ? ['ratioRead', 'whereM'] : ['tIn', 'rule'];
  if (step === 'marks') return ['joinWhich', 'whyEven'];
  return step === 'built' ? ['partLen', 'whyEqual'] : ['contrast', 'rule'];
};

const cm = (mm) => L.cmText(mm).replace(',', '{,}');
const fracEq = (a, b) => LIN.eq(a, b);
const fracOpt = (right, cands, k, key, o) => [
  { text: <MathText>{$(LIN.fracLatex(right))}</MathText>, correct: true },
  ...distinct(right, cands, 2, fracEq).map((c) => ({ text: <MathText>{$(LIN.fracLatex(c.v))}</MathText>, why: Mx(k, `${key}.${c.why}`, { ...o, shown: $(LIN.fracLatex(c.v)) }) })),
];

const RAW_QUESTIONS = {
  /* equal — étape « marques » : quelle marque relier à B, et pourquoi l'ouverture reste la même */
  joinWhich: (lab, step, k) => {
    const n = lab.parts;
    const o = { n, n1: n + 1, nm: n - 1, r: cm(lab.opening) };
    return {
      id: 'joinWhich', kind: 'choice',
      prompt: Mx(k, 'joinWhich.prompt', o),
      options: [
        { text: Mx(k, 'joinWhich.opt', { x: n }), correct: true },
        { text: Mx(k, 'joinWhich.opt', { x: n + 1 }), why: Mx(k, 'joinWhich.whyMore', o) },
        { text: Mx(k, 'joinWhich.opt', { x: Math.max(1, n - 1) }), why: Mx(k, 'joinWhich.whyLess', o) },
      ],
      hints: [Mx(k, 'joinWhich.hint1', o), Mx(k, 'joinWhich.hint2', o)],
      explain: Mx(k, 'joinWhich.explain', o),
    };
  },
  whyEven: (lab, step, k) => {
    const o = { n: lab.parts, r: cm(lab.opening) };
    return {
      id: 'whyEven', kind: 'choice',
      prompt: Mx(k, 'whyEven.prompt', o),
      options: [
        { text: Mx(k, 'whyEven.right', o), correct: true },
        { text: Mx(k, 'whyEven.square', o), why: Mx(k, 'whyEven.whySquare', o) },
        { text: Mx(k, 'whyEven.reachB', o), why: Mx(k, 'whyEven.whyReachB', o) },
      ],
      hints: [Mx(k, 'whyEven.hint1', o), Mx(k, 'whyEven.hint2', o)],
      explain: Mx(k, 'whyEven.explain', o),
    };
  },
  /* equal — étape « construction juste » : la longueur d'une part, puis la raison de l'égalité */
  partLen: (lab, step, k) => {
    const n = lab.parts; const tr = lab.trials.find((x) => x.ok);
    const r = cm(tr.openings[0]);
    const tx = (f) => L.lengthTex(lab, f);
    const o = { n, len: lab.length, r, part: $(tx(LIN.frac(1, n))) };
    const cands = [
      { key: 'whyOpening', tex: r }, { key: 'whyFewer', tex: tx(LIN.frac(1, Math.max(1, n - 1))) }, { key: 'whyMore', tex: tx(LIN.frac(1, n + 1)) },
    ];
    const right = tx(LIN.frac(1, n));
    const ds = cands.filter((c, i) => c.tex !== right && cands.findIndex((d) => d.tex === c.tex) === i).slice(0, 2);
    return {
      id: 'partLen', kind: 'choice', cols: 3,
      prompt: Mx(k, 'partLen.prompt', o),
      options: [
        { text: <MathText>{`$${right}$ ${k('cp.unit')}`}</MathText>, correct: true },
        ...ds.map((d) => ({ text: <MathText>{`$${d.tex}$ ${k('cp.unit')}`}</MathText>, why: Mx(k, `partLen.${d.key}`, { ...o, shown: $(d.tex) }) })),
      ],
      hints: [Mx(k, 'partLen.hint1', o), Mx(k, 'partLen.hint2', o)],
      explain: Mx(k, 'partLen.explain', o),
    };
  },
  whyEqual: (lab, step, k) => {
    const tr = lab.trials.find((x) => x.ok);
    const o = { n: lab.parts, deg: tr.angle, r: cm(tr.openings[0]) };
    return {
      id: 'whyEqual', kind: 'choice',
      prompt: Mx(k, 'whyEqual.prompt', o),
      options: [
        { text: Mx(k, 'whyEqual.right', o), correct: true },
        { text: Mx(k, 'whyEqual.lengths', o), why: Mx(k, 'whyEqual.whyLengths', o) },
        { text: Mx(k, 'whyEqual.angle', o), why: Mx(k, 'whyEqual.whyAngle', o) },
      ],
      hints: [Mx(k, 'whyEqual.hint1', o), Mx(k, 'whyEqual.hint2', o)],
      explain: Mx(k, 'whyEqual.explain', o),
    };
  },
  /* equal — étape « contraste » : l'écart d'un essai raté, ou ce qui ne bouge pas entre deux essais justes */
  contrast: (lab, step, k) => {
    const bad = lab.trials.find((x) => !x.ok);
    const good = lab.trials.find((x) => x.ok);
    const n = lab.parts;
    const o = { n, got: bad?.n, r: cm(good.openings[0]) };
    const kind = !bad ? 'same' : bad.kind;   // 'count' | 'unequal' | 'same'
    return {
      id: 'contrast', kind: 'choice',
      prompt: Mx(k, `contrast.${kind}.prompt`, o),
      options: [
        { text: Mx(k, `contrast.${kind}.right`, o), correct: true },
        { text: Mx(k, `contrast.${kind}.a`, o), why: Mx(k, `contrast.${kind}.whyA`, o) },
        { text: Mx(k, `contrast.${kind}.b`, o), why: Mx(k, `contrast.${kind}.whyB`, o) },
      ],
      hints: [Mx(k, `contrast.${kind}.hint1`, o), Mx(k, `contrast.${kind}.hint2`, o)],
      explain: Mx(k, `contrast.${kind}.explain`, o),
    };
  },
  /* ratio — étape « un 1er point juste » : MA/MB lu sur les rangs, puis la place du point */
  ratioRead: (lab, step, k) => {
    const j = lab.joins.find((x) => x.ok);
    const ra = j.rankA; const rb = j.rankB;
    const o = { ra, rb, p: lab.p, q: lab.q, target: $(`\\dfrac{${lab.p}}{${lab.q}}`) };
    return {
      id: 'ratioRead', kind: 'choice', cols: 3,
      prompt: Mx(k, 'ratioRead.prompt', o),
      options: fracOpt(j.ratio, [
        { v: LIN.frac(rb, ra), why: 'whyInverse' }, { v: LIN.frac(ra, ra + rb), why: 'whyWhole' }, { v: LIN.frac(ra - rb === 0 ? 1 : Math.abs(ra - rb), 1), why: 'whyDiff' },
      ], k, 'ratioRead', o),
      hints: [Mx(k, 'ratioRead.hint1', o), Mx(k, 'ratioRead.hint2', o)],
      explain: Mx(k, 'ratioRead.explain', o),
    };
  },
  whereM: (lab, step, k) => {
    const j = lab.joins.find((x) => x.ok);
    const o = { ra: j.rankA, rb: j.rankB };
    const kind = j.inside ? 'inside' : 'outside';
    const other = j.inside ? 'outside' : 'inside';
    return {
      id: 'whereM', kind: 'choice',
      prompt: Mx(k, 'whereM.prompt', o),
      options: [
        { text: Mx(k, `whereM.${kind}`, o), correct: true },
        { text: Mx(k, `whereM.${other}`, o), why: Mx(k, `whereM.why_${other}`, o) },
        { text: Mx(k, 'whereM.unknown', o), why: Mx(k, 'whereM.whyUnknown', o) },
      ],
      hints: [Mx(k, 'whereM.hint1', o), Mx(k, 'whereM.hint2', o)],
      explain: Mx(k, `whereM.explain_${kind}`, o),
    };
  },
  /* ratio — étape « les deux points » : AM/AB du point intérieur */
  tIn: (lab, step, k) => {
    const j = lab.joins.find((x) => x.kind === 'inside');
    const { p, q } = lab;
    const o = { p, q, target: $(`\\dfrac{${p}}{${q}}`), sum: p + q };
    return {
      id: 'tIn', kind: 'choice', cols: 3,
      prompt: Mx(k, 'tIn.prompt', o),
      options: fracOpt(j.t, [
        { v: LIN.frac(p, q), why: 'whyRatio' }, { v: LIN.frac(q, p + q), why: 'whyOther' }, ...(p !== q ? [{ v: LIN.frac(p, Math.abs(p - q)), why: 'whyOutside' }] : []),
      ], k, 'tIn', o),
      hints: [Mx(k, 'tIn.hint1', o), Mx(k, 'tIn.hint2', o)],
      explain: Mx(k, 'tIn.explain', { ...o, calc: $(`\\dfrac{AM}{AB} = \\dfrac{${p}}{${p} + ${q}} = ${LIN.fracLatex(j.t)}`) }),
    };
  },
  rule: (lab, step, k) => ({
    id: 'rule', kind: 'choice',
    prompt: <MathText>{k(lab.mode === 'ratio' ? 'dPromptRatio' : 'dPromptEqual', { target: lab.mode === 'ratio' ? `\\dfrac{${lab.p}}{${lab.q}}` : '' })}</MathText>,
    options: discoveryOptionsOf(lab, k),
    hints: [Mx(k, 'rule.hint1'), Mx(k, 'rule.hint2')],
    explain: formalOf(lab, k),
  }),
};

export const QUESTIONS = spreadAll(RAW_QUESTIONS, (lab) => (lab.parts ?? 0) + (lab.p ?? 0) * 7 + (lab.q ?? 0));
