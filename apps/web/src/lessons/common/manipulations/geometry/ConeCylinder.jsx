import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import LabFold from '../primitives/LabFold';
import MathText from '../../components/MathText';
import { linear as LIN } from '@smarter-academy/core';
import * as L from '../logic/coneCylinder';

/**
 * cone-cylinder — LE CYLINDRE DANS LE CÔNE (unité 9 « خاصية طالس », « أدمج تعلّماتي » p. 112).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève tient les DEUX dimensions d'un cylindre posé sur la base d'un cône couché : sa longueur h (poignée
 *    sur l'axe, glisser / toucher la piste / −/+ / flèches ← →) et son rayon r (poignée sur le bord de sa face
 *    libre, glisser vers le haut / le bas, −/+, flèches ↑ ↓). Il « gonfle » le cylindre jusqu'à ce qu'il touche.
 * B. Idée : dans la coupe axiale, le bord du cylindre inscrit est SUR la génératrice ; les triangles de sommet O
 *    (le sommet du cône) sont en situation de Thalès, donc r ÷ R = (H − h) ÷ H — une équation, et avec h = r une
 *    équation du premier degré qui donne le cylindre de la وضعية ; son volume est πr²h.
 * C. Le cylindre grandit / s'allonge sous la main ; au-delà de la génératrice il PERCE le cône (rouge pendant le
 *    geste) et la poignée revient ; en deçà un jeu reste visible ; au contact, la génératrice s'allume.
 * D. La lecture : h, r, l'état (perce / jeu de … cm / touche), V = π × r² × h exact (…π) et approché ; quand
 *    h = r au contact, la demi-coupe du cylindre est un CARRÉ (le cylindre cherché).
 * E. Avant la règle : au moins deux cylindres inscrits de longueurs différentes (h et r varient ENSEMBLE) et un
 *    contraste (un refus ou un jeu) ; les relations « r + h constant », « r × h constant » sont réfutées par les
 *    propres cylindres de l'élève.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        une coupe plane d'un solide de révolution porte une situation de Thalès ; r ÷ R = (H − h) ÷ H
 *   OBJECT         un cornet (cône couché) et le pot cylindrique qu'on y glisse
 *   VARIABLE       h (pas H ÷ n) et r (pas R ÷ n), deux poignées
 *   INVARIANT      le cône (H, R) ; la génératrice ; pour un cylindre inscrit, r ÷ R = (H − h) ÷ H
 *   TRANSFORMATION le cylindre s'allonge, s'épaissit ; le jeu se ferme ; le volume change
 *   CONSTRAINT     r ≤ R (H − h) ÷ H : le cylindre reste dans le cône
 *   RESISTANCE     un geste qui ferait percer le cône est REFUSÉ (la poignée revient), avec le rayon permis écrit
 *   EVIDENCE       la génératrice allumée au contact, le jeu chiffré, le carré de la demi-coupe quand h = r
 *   CONTRAST       inscrit / non inscrit / refusé ; deux inscrits de formes opposées (long et maigre, court et gros)
 *   PREDICTION     « jusqu'où gonfler ? » se décide avant de toucher la paroi
 *   DISCOVERY      « pour tout cylindre محاطة : r ÷ R = (H − h) ÷ H »
 *   FORMALIZATION  r ÷ 6 = (18 − h) ÷ 18 ; avec h = r : 24r = 108 ; V = πr²h
 *   TRANSFER       l'ombre de la minaret (même sommet commun O), ex. 22, la pratique (cônes et cylindres)
 *
 * Monde (`theme`) : `cornet` — le cornet de glace de l'été et le pot cylindrique (décor : la boule de glace qui
 * change de parfum au toucher, les vermicelles). Manuel (§6bis) : chaque dimension est un essai ; aucune
 * auto-complétion.
 *
 * DÉCOR : `aria-hidden`, hors clavier, `[data-deco]`, jamais une information, immobile sous reduced motion.
 *
 * D'UN SEUL REGARD (§8bis) : la coupe est budgétée sur l'écran de leçon moins ce que le bloc `[data-cc-glance]`
 * prend en plus du dessin ; les deux poignées sont SUR le dessin (h sous l'axe, r au coin du cylindre), les −/+
 * et la lecture juste dessous ; le tableau des cylindres essayés est dans un `LabFold` sous le bloc.
 *
 * Props : `H`, `R` (cm), `theme`, `title`, `lead`, `mission`, `level`, `levels`, `onTrial(evidence)` à chaque
 * cylindre posé ou refusé, `onFinished({ H, R })` à la règle — par `state.report`.
 *
 * CONTRAT DOM : [data-cone-cylinder][data-state=gap|inscribed|square][data-solved][data-goal], [data-cc-glance],
 * [data-cc-h-handle] / [data-cc-r-handle] (role=slider), [data-cc-h-less|more], [data-cc-r-less|more],
 * [data-cc-verdict=<kind>], [data-cc-volume], [data-cc-pierce], [data-lab-fold=cone-cylinder.trials], [data-deco].
 */
export default function ConeCylinder({
  H: H0 = 18, R: R0 = 6, theme = 'cornet', title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.coneCylinder.${key}`, o), [t]);
  const state = useManipulation({ type: 'cone-cylinder', initialNumbers: { H: H0, R: R0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { H, R } = state.numbers;
  const make = () => L.init({ H, R });
  const [lab, setLab] = useState(make);
  const sceneKey = `${H}|${R}|${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [liveH, setLiveH] = useState(null);
  const [liveR, setLiveR] = useState(null);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(make()); setLiveH(null); setLiveR(null); }

  const ready = L.discoveryReady(lab);
  const goal = L.goalFound(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { H: L.dec(lab.H), R: L.dec(lab.R) }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  const nEvents = lab.trials.length + lab.refusals;
  useEffect(() => { if (nEvents > 0) state.report(onTrial, L.evidenceOf(lab)); }, [nEvents]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const svgHRef = useRef(220);
  const [width, setWidth] = useState(320);
  const [overhead, setOverhead] = useState(200);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(240, Math.floor(el.clientWidth)));
      if (glanceRef.current) setOverhead(Math.max(130, Math.ceil(glanceRef.current.getBoundingClientRect().height) - svgHRef.current));
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
  const BELOW = 46; // la piste de h sous le cône
  const budget = Math.round(Math.max(130, Math.min(380, screenH - overhead - 24)));
  const G = L.layout(lab, { width, height: budget - BELOW });
  const svgW = Math.min(width, Math.round(G.width));
  const svgH = Math.round(G.height) + BELOW;
  svgHRef.current = svgH;

  /* ── les deux poignées (moteur « étirer ») ── */
  const hI = liveH ?? lab.hIdx;
  const rI = liveR ?? lab.rIdx;
  const view = L.probe(lab, hI, rI);
  const hSt = useStretchInteraction({
    value: hI, range: { min: 1, max: lab.n - 1 }, direction: 'ltr', pageStep: 3,
    toValue: (cx, _cy, rect) => (((cx - rect.left) * (svgW / rect.width)) - G.x0) / G.k / (Number(lab.hStep.n) / Number(lab.hStep.d)),
    onChange: (v) => setLiveH(v),
    onCommit: (v) => { setLiveH(null); setLab((s) => L.setH(s, v)); },
  });
  const rSt = useStretchInteraction({
    value: rI, range: { min: 1, max: lab.n - 1 }, direction: 'ltr', pageStep: 3,
    toValue: (_cx, cy, rect) => (G.yAxis - (cy - rect.top)) / G.k / (Number(lab.rStep.n) / Number(lab.rStep.d)),
    onChange: (v) => setLiveR(v),
    onCommit: (v) => { setLiveR(null); setLab((s) => L.setR(s, v)); },
  });

  /* ── la lecture ── */
  const last = lab.last;
  const live = liveH != null || liveR != null;
  const kind = live ? (view.pierce ? 'livePierce' : 'live')
    : last?.kind === 'pierceH' || last?.kind === 'pierceR' ? last.kind
      : view.square ? 'square' : view.inscribed ? 'inscribed' : last ? 'gap' : 'start';
  const o = { h: L.tex(view.h), r: L.tex(view.r), rMax: L.tex(view.rMax), gap: L.tex(view.gap) };
  const verdict = (() => {
    switch (kind) {
      case 'livePierce': return <span className="text-rose-800" data-cc-pierce="live"><MathText>{k('vLivePierce', o)}</MathText></span>;
      case 'pierceH': case 'pierceR': {
        const st = last.state;
        return <span className="text-rose-800" data-cc-pierce="refused"><MathText>{k(kind === 'pierceH' ? 'vPierceH' : 'vPierceR', { h: L.tex(st.h), r: L.tex(st.r), rMax: L.tex(st.rMax) })}</MathText></span>;
      }
      case 'square': return <span className="text-emerald-800"><MathText>{k('vSquare', o)}</MathText></span>;
      case 'inscribed': return <span className="text-emerald-800"><MathText>{k('vInscribed', o)}</MathText></span>;
      case 'gap': case 'live': return <span className="text-slate-800"><MathText>{k('vGap', o)}</MathText></span>;
      default: return <span className="text-slate-600"><MathText>{k('vStart')}</MathText></span>;
    }
  })();
  const volumeTex = `V = ${narrow ? '' : `\\pi \\times ${L.tex(view.r)}^2 \\times ${L.tex(view.h)} = `}${L.tex(view.vop)}\\pi \\approx ${L.volumeApprox(view.vop).replace(',', '{,}')}\\,\\mathrm{cm}^3`;

  /* ── la découverte : des relations réfutées par les cylindres de l'élève ── */
  const discoveryOptions = useMemo(() => {
    const ins = L.inscribedTrials(lab);
    const a = ins[0]; const b = a ? ins.find((x) => !LIN.eq(x.h, a.h)) : null;
    const pair = (x) => `(${L.tex(x.h)} ; ${L.tex(x.r)})`;
    const base = a && b ? { p: pair(a), q: pair(b) } : null;
    const sum = (x) => L.tex(LIN.add(x.h, x.r));
    const prod = (x) => L.tex(LIN.mul(x.h, x.r));
    return [
      { text: <MathText>{k('dOptSum')}</MathText>, why: <MathText>{base ? k('dWhySum', { ...base, s1: sum(a), s2: sum(b) }) : k('dWhyNone')}</MathText> },
      { text: <MathText>{k('dOptRight', { H: L.tex(lab.H), R: L.tex(lab.R) })}</MathText>, correct: true },
      { text: <MathText>{k('dOptProd')}</MathText>, why: <MathText>{base ? k('dWhyProd', { ...base, p1: prod(a), p2: prod(b) }) : k('dWhyNone')}</MathText> },
      { text: <MathText>{k('dOptR')}</MathText>, why: <MathText>{k('dWhyR', { R: L.tex(lab.R) })}</MathText> },
    ];
  }, [lab, k]);

  const formal = (
    <div className="space-y-2" data-cc-formal>
      <EquationDisplay tone="result" tex={`\\dfrac{r}{${L.tex(lab.R)}} = \\dfrac{${L.tex(lab.H)} - h}{${L.tex(lab.H)}}`} />
      <EquationDisplay tone="result" tex={'V = \\pi \\times r^2 \\times h'} />
      <p className="text-sm text-emerald-900"><MathText>{k(goal ? 'fRuleFound' : 'fRule', { H: L.tex(lab.H), R: L.tex(lab.R) })}</MathText></p>
    </div>
  );

  /* ── le dessin (coupe axiale + perspective légère) ── */
  const X = G.X; const Y = G.Y; const yA = G.yAxis;
  const num = (p) => Number(p.n) / Number(p.d);
  const Hn = num(lab.H); const Rn = num(lab.R);
  const hN = num(view.h); const rN = num(view.r); const rMaxN = num(view.rMax);
  const ex = 0.2; // l'aplatissement des ellipses (perspective)
  const tone = view.pierce ? '#E11D48' : view.inscribed ? '#059669' : '#0EA5E9';
  const textP = { style: { direction: 'ltr', unicodeBidi: 'isolate' }, fontFamily: 'ui-monospace, monospace' };
  const btn = 'inline-flex h-11 min-w-[44px] items-center justify-center rounded-xl border-2 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2';
  const trackY = G.height + 2;

  return (
    <ManipulationShell
      type="cone-cylinder"
      title={title ?? k('title')}
      mission={mission ?? k(ready ? 'missionGoal' : 'mission', { H: L.dec(lab.H), R: L.dec(lab.R) })}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={['hint1', 'hint2', 'hint3'].map((hk) => <MathText key={hk}>{k(hk, { H: L.tex(lab.H) })}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={<ManipulationDiscovery state={state} prompt={k('dPrompt')} options={discoveryOptions} formal={formal} />}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-rose-50/60 to-white" minHeight="min-h-[150px]">
        <div ref={boxRef} className="space-y-2" data-cone-cylinder data-world={theme} data-n={lab.n}
          data-state={view.square ? 'square' : view.inscribed ? 'inscribed' : view.pierce ? 'pierce' : 'gap'}
          data-solved={ready ? 'true' : 'false'} data-goal={goal ? 'true' : 'false'} data-scene-h={svgH}>
          <div ref={glanceRef} className="space-y-1.5" data-cc-glance>
            <div className="relative mx-auto" style={{ width: svgW, height: svgH }}>
              <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="absolute inset-0" style={{ direction: 'ltr' }}
                role="img" aria-label={k('sceneLabel', { H: L.dec(lab.H), R: L.dec(lab.R), h: L.dec(view.h), r: L.dec(view.r) })}>
                <defs>
                  <pattern id="cc-waffle" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="10" height="10" fill="#FDE68A" />
                    <path d="M0 0 L0 10 M0 0 L10 0" stroke="#D97706" strokeWidth="1" opacity="0.45" />
                  </pattern>
                </defs>
                <Deco cx={X(0)} cy={yA} rx={ex * Rn * G.k + 14} ry={Rn * G.k * 1.03} />
                {/* le cône (cornet) : base elliptique à gauche, sommet O à droite */}
                <path d={`M${X(0)} ${Y(Rn)} L${X(Hn)} ${yA} L${X(0)} ${Y(-Rn)} Z`} fill="url(#cc-waffle)" stroke="#B45309" strokeWidth={1.6} />
                <ellipse cx={X(0)} cy={yA} rx={ex * Rn * G.k} ry={Rn * G.k} fill="#FEF3C7" stroke="#B45309" strokeWidth={1.6} />
                {/* le cylindre (pot) : corps, face libre ; la partie qui percerait en rouge */}
                <rect x={X(0)} y={Y(rN)} width={X(hN) - X(0)} height={2 * rN * G.k} fill={tone} opacity={0.32} data-cc-body />
                <line x1={X(0)} y1={Y(rN)} x2={X(hN)} y2={Y(rN)} stroke={tone} strokeWidth={2.4} />
                <line x1={X(0)} y1={Y(-rN)} x2={X(hN)} y2={Y(-rN)} stroke={tone} strokeWidth={2.4} />
                <ellipse cx={X(hN)} cy={yA} rx={ex * rN * G.k} ry={rN * G.k} fill="#FFFFFF" fillOpacity={0.55} stroke={tone} strokeWidth={2.4} />
                {view.pierce && (
                  <line x1={X(hN)} y1={Y(rMaxN)} x2={X(hN)} y2={Y(rN)} stroke="#E11D48" strokeWidth={5} strokeLinecap="round" data-cc-pierce-mark />
                )}
                {/* la demi-coupe axiale : le triangle de sommet O et le rectangle (carré quand h = r au contact) */}
                <line x1={X(0)} y1={yA} x2={X(Hn)} y2={yA} stroke="#334155" strokeDasharray="5 4" />
                <line x1={X(0)} y1={Y(Rn)} x2={X(Hn)} y2={yA} stroke={view.inscribed ? '#059669' : '#92400E'} strokeWidth={view.inscribed ? 3 : 1.6} data-cc-generatrix />
                <line x1={X(hN)} y1={yA} x2={X(hN)} y2={Y(view.pierce ? rMaxN : rN)} stroke="#334155" strokeDasharray="3 3" />
                {view.square && <rect x={X(0)} y={Y(rN)} width={X(hN) - X(0)} height={rN * G.k} fill="none" stroke="#059669" strokeWidth={2.5} data-cc-square />}
                {/* noms et mesures (LTR) */}
                <text x={X(Hn) + 4} y={yA + 4} fontSize={12} fontWeight="bold" fill="#0F172A" {...textP}>O</text>
                <text x={(X(hN) + X(Hn)) / 2} y={yA + 14} textAnchor="middle" fontSize={10} fill="#475569" {...textP}>{narrow ? '' : `${L.dec(lab.H)} − h`}</text>
                <line x1={X(0)} y1={yA} x2={X(0)} y2={Y(Rn)} stroke="#92400E" strokeDasharray="2 2" />
                <text x={X(0) + 4} y={Y(Rn) + 14} fontSize={11} fontWeight="bold" fill="#92400E" {...textP}>{`R = ${L.dec(lab.R)}`}</text>
                <text x={X(hN) + 6} y={(Y(rN) + yA) / 2 + 4} fontSize={11} fontWeight="bold" fill={tone} {...textP}>r</text>
                <text x={(X(0) + X(hN)) / 2} y={Y(rN) - 5} textAnchor="middle" fontSize={11} fontWeight="bold" fill={tone} {...textP}>h</text>
                {/* la piste de h : l'axe gradué sous le cône */}
                <line x1={X(0)} y1={trackY + 22} x2={X(Hn)} y2={trackY + 22} stroke="#94A3B8" strokeWidth={2} />
                {Array.from({ length: lab.n + 1 }, (_, i) => i).filter((i) => i % (narrow ? 4 : 2) === 0).map((i) => (
                  <line key={i} x1={X(num(L.hOf(lab, i)))} x2={X(num(L.hOf(lab, i)))} y1={trackY + 18} y2={trackY + 26} stroke="#94A3B8" />
                ))}
              </svg>
              {/* poignée de h : sous l'axe, alignée sur la face libre */}
              <div {...hSt.trackProps} className="absolute" style={{ ...hSt.trackProps.style, left: 0, width: svgW, top: trackY, height: BELOW - 2 }} data-cc-h-track>
                <div {...hSt.handleProps({ label: k('hHandle'), valueText: k('hValueText', { h: L.dec(view.h) }) })}
                  data-cc-h-handle={hI}
                  className="absolute flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-sky-700 bg-white/90 outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                  style={{ left: X(hN), top: 0, cursor: hSt.dragging ? 'grabbing' : 'grab' }}>
                  <span aria-hidden="true" className="text-sm font-black text-sky-800">⇆</span>
                </div>
              </div>
              {/* poignée de r : une piste verticale le long de la face libre ; la poignée au coin du cylindre */}
              <div {...rSt.trackProps} className="absolute" style={{ ...rSt.trackProps.style, left: X(hN) - 22, width: 44, top: 0, height: G.height }} data-cc-r-track>
                <div {...rSt.handleProps({ label: k('rHandle'), valueText: k('rValueText', { r: L.dec(view.r) }) })}
                  data-cc-r-handle={rI}
                  className="absolute left-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white/90 outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
                  style={{ top: Y(rN), borderColor: tone, cursor: rSt.dragging ? 'grabbing' : 'grab' }}>
                  <span aria-hidden="true" className="text-sm font-black" style={{ color: tone }}>↕</span>
                </div>
              </div>
            </div>
            {/* les commandes sans glisser, sous la scène */}
            <div className={`flex flex-wrap items-center justify-center ${narrow ? 'gap-1' : 'gap-1.5'}`} dir="ltr">
              <button type="button" onClick={() => hSt.nudge(-1)} disabled={hI <= 1} aria-label={k('hLess')} data-cc-h-less className={`${btn} border-sky-300 focus-visible:ring-sky-500`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              <span className={`${narrow ? 'min-w-[3.4rem]' : 'min-w-[4.8rem]'} rounded-full bg-sky-100 px-1.5 text-center font-mono text-sm font-extrabold text-sky-900`} data-cc-h-value={L.dec(view.h)}><MathText>{`$h = ${L.tex(view.h)}$`}</MathText></span>
              <button type="button" onClick={() => hSt.nudge(1)} disabled={hI >= lab.n - 1} aria-label={k('hMore')} data-cc-h-more className={`${btn} border-sky-300 focus-visible:ring-sky-500`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
              {!narrow && <span className="mx-1 h-6 w-px bg-slate-300" aria-hidden="true" />}
              <button type="button" onClick={() => rSt.nudge(-1)} disabled={rI <= 1} aria-label={k('rLess')} data-cc-r-less className={`${btn} border-rose-300 focus-visible:ring-rose-500`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              <span className={`${narrow ? 'min-w-[3.4rem]' : 'min-w-[4.8rem]'} rounded-full bg-rose-100 px-1.5 text-center font-mono text-sm font-extrabold text-rose-900`} data-cc-r-value={L.dec(view.r)}><MathText>{`$r = ${L.tex(view.r)}$`}</MathText></span>
              <button type="button" onClick={() => rSt.nudge(1)} disabled={rI >= lab.n - 1} aria-label={k('rMore')} data-cc-r-more className={`${btn} border-rose-300 focus-visible:ring-rose-500`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <div role="status" className={`min-h-[3rem] space-y-0.5 ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug`} data-cc-verdict={kind}>
              <p>{verdict}</p>
              <p className="text-slate-700" dir="ltr" data-cc-volume={L.dec(view.vop)}><bdi><MathText>{`$${volumeTex}$`}</MathText></bdi></p>
            </div>
          </div>

          {lab.trials.length > 0 && (
            <LabFold id="cone-cylinder.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-cc-trials={lab.trials.length}>
                {lab.trials.map((tr, i) => (
                  <li key={i} className={tr.inscribed ? 'text-emerald-800' : 'text-slate-700'}>
                    <MathText>{k(tr.inscribed ? 'trialIn' : 'trialGap', { h: L.tex(tr.h), r: L.tex(tr.r), v: L.tex(tr.vop) })}</MathText>
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


/** La boule de glace sur la base du cornet (parfum changé au toucher) et des vermicelles : décor pur. */
function Deco({ cx, cy, rx, ry }) {
  const reduce = useReducedMotion();
  const [taste, setTaste] = useState(0);
  const colors = ['#F9A8D4', '#A16207', '#FEF9C3', '#86EFAC'];
  const sprinkles = [[-0.5, -0.4, '#EF4444'], [-0.2, -0.7, '#3B82F6'], [-0.6, 0.2, '#22C55E'], [-0.3, 0.5, '#F59E0B'], [-0.75, -0.05, '#A855F7']];
  return (
    <g aria-hidden="true" data-deco="cornet" onClick={() => setTaste((n) => n + 1)} style={{ cursor: 'pointer' }}>
      <style>{'.cc-pop{transform-box:fill-box;transform-origin:center;animation:cc-pop .35s ease-out}@keyframes cc-pop{50%{transform:scale(1.06)}}@media (prefers-reduced-motion: reduce){.cc-pop{animation:none}}'}</style>
      <ellipse key={taste} className={reduce ? undefined : 'cc-pop'} cx={cx} cy={cy} rx={rx} ry={ry} fill={colors[taste % colors.length]} opacity={0.75} />
      {sprinkles.map(([dx, dy, c], i) => <rect key={i} x={cx + dx * rx} y={cy + dy * ry} width={4} height={2} rx={1} fill={c} transform={`rotate(${i * 37} ${cx + dx * rx} ${cy + dy * ry})`} />)}
    </g>
  );
}
