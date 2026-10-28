import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ZoomIn } from 'lucide-react';
import * as squareRoots from '@smarter-academy/core/arithmetic/squareRoots.js';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import MathText from '../../components/MathText';
import * as L from '../logic/squareRootSide';

const { squareOfDecimal, reduce } = squareRoots;

/**
 * square-root-side — LE CARRÉ QU'ON ÉTIRE (unité 2 « الحساب على الجذور »).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève TIRE le bout du côté d'un carré le long d'une règle graduée
 *    (réglette `useStretchInteraction` ; clavier, − / + et toucher la règle).
 * B. Idée : √a est le côté du carré d'aire a — le nombre POSITIF dont le carré
 *    est a. Il tombe sur une graduation (36 → 6 ; 16/9 → 4/3) ou n'y tombe
 *    jamais (5, 6, 7) : il existe pourtant (c'est BC, l'hypoténuse du manuel).
 * C. Pendant le geste, le carré grandit sur le quadrillage à côté du carré
 *    visé (en pointillés) ; son aire se lit EXACTEMENT.
 * D. Au relâchement : c = …, c² = … et la comparaison « < a », « = a », « > a ».
 * E. À découvrir : refine — resserrer l'encadrement (1 → 0,1 → 0,01 → 0,001)
 *    ne rencontre jamais 5 ; graduation — une aire tombe sur une graduation
 *    exactement quand elle est le carré d'un rationnel.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        √a : le nombre positif dont le carré est a ; rationnel ou non
 *   OBJECT         un carré posé sur un quadrillage d'unités
 *   VARIABLE       c, la longueur du côté (le doigt tient son extrémité)
 *   INVARIANT      l'aire visée a ; la graduation choisie ; c ≥ 0
 *   TRANSFORMATION le carré, son aire c² et sa position par rapport à a
 *   CONSTRAINT     on ne lit c que sur une graduation (1/scale)
 *   RESISTANCE     pour 5, chaque graduation donne un carré trop petit OU trop
 *                  grand ; la loupe ne s'ouvre qu'après l'encadrement fait main
 *   EVIDENCE       c² lu exactement (2,236² = 4,999696), la couleur < / = / >
 *   CONTRAST       refine : 36 (juste) / 5 (jamais) — graduation : 16/9 / 6
 *   PREDICTION     « entre quels deux nombres est le côté ? » avant la loupe
 *   DISCOVERY      « aucun décimal n'a pour carré 5 : on nomme ce nombre √5 »
 *   FORMALIZATION  √a ≥ 0 et (√a)² = a ; √a ناطق ⇔ a مربّع عدد ناطق
 *   TRANSFER       معارف 1 et 2, les encadrements de تمرين 9 et 35
 *
 * Aucun flottant ne juge une égalité : logic/squareRootSide → core/squareRoots.
 */
/*
 * QUESTIONS PENDANT LE LABO (2026-10-28, `primitives/LabCheckpoint`) : `checkpoints` (défaut true). Deux étapes. refine : 1 « frame » (un encadrement serré, ou le côté
 * exact) — c² lu, puis l'encadrement (ou le nom du côté exact) ; 2 « rule » (la découverte atteinte) — le constat de l'encadrement qui ne rencontre jamais a, puis la
 * règle. graduation : 1 « frame » (une carte tombée juste) — le produit c × c, puis « ناطق » ; 2 « rule » (une carte qui résiste aussi) — le constat, puis la règle.
 */
export default function SquareRootSide({
  mode = 'refine', num: num0 = 36, den: den0 = 1, scale: maxScale0, areas: areas0,
  calculator, figure, title, lead, mission, level, levels: withLevels = true, checkpoints: cpOn = true, initialMode = 'student', allowModeSwitch = false, onFinished, onTrial,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.squareRoot.${key}`, o), [t]);
  const refineMode = mode === 'refine';
  const state = useManipulation({
    type: 'square-root-side',
    initialNumbers: { num: num0, den: den0, scale: maxScale0 ?? (refineMode ? 1000 : 12) },
    initialMode, initialLevel: level,
    // Les paires de levels.js sont des aires du mode refine : posé SEUL en mode
    // graduation, le laboratoire n'a pas de second niveau (dans un workspace,
    // c'est la leçon qui déclare ses deux niveaux).
    withLevels: withLevels && refineMode,
    hintCount: 3,
  });
  const { num, den, scale: maxScale } = state.numbers;
  const areas = refineMode ? [{ num, den }] : (areas0 ?? [{ num, den }]);
  const areasKey = areas.map((a) => `${a.num}/${a.den}`).join(',');

  const makeLab = () => L.init({ mode, areas, maxScale });
  const [lab, setLab] = useState(makeLab);
  const sceneKey = `${areasKey}:${maxScale}:${state.epoch}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [done, setDone] = useState([false, false]);
  const snap = useRef(null);
  if (scene.key !== sceneKey) {
    // « إعادة », un autre niveau ou d'autres aires : TOUT recommence — les essais, les étapes et les questions du labo
    setScene({ key: sceneKey, inits: scene.inits + 1 });
    setLab(makeLab()); setDone([false, false]); snap.current = null;
  }

  const [live, setLive] = useState(null); // la valeur sous le doigt
  const area = L.currentArea(lab);
  const range = L.range(lab);

  // La mémoire courante, lue au relâchement : le rappel de la leçon part
  // HORS du `setState` (un updater doit rester pur — StrictMode le rejoue).
  const labRef = useRef(lab);
  labRef.current = lab;
  // Les valeurs déjà ESSAYÉES (relâchement ou balayage) par carte et graduation : jamais la valeur par défaut.
  const testedRef = useRef({ scene: sceneKey, sets: {} });
  if (testedRef.current.scene !== sceneKey) testedRef.current = { scene: sceneKey, sets: {} };
  const setKey = (st) => `${st.card}:${st.scale}`;
  const commit = useCallback((v) => {
    setLive(v);
    const next = L.test(labRef.current, v);
    if (next === labRef.current) return;
    const sk = setKey(labRef.current);
    testedRef.current.sets[sk] = new Set([...(testedRef.current.sets[sk] ?? []), v]);
    labRef.current = next;
    playSfx(next.last.cmp === 0 ? 'bell' : 'over');
    setLab(next);
    state.report(onTrial, { area: L.currentArea(next), side: v, scale: next.scale, cmp: next.last.cmp });
  }, [state, onTrial]);
  const untested = () => {
    const r = L.range(labRef.current);
    const done = testedRef.current.sets[setKey(labRef.current)] ?? new Set();
    return Array.from({ length: r.max - r.min + 1 }, (_, i) => r.min + i).filter((v) => !done.has(v));
  };
  useEffect(() => { setLive(null); }, [lab.scale, lab.card, state.epoch]);

  const cpSettings = useLabCheckpointSettings('square-root-side');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const cpActive = cpOn && cpSettings.enabled;
  const stepIdx = done[0] ? 1 : 0;
  const stepId = stepIdx === 0 ? 'frame' : 'rule';
  const reachedNow = stepIdx === 0 ? frameReached(lab) : L.discoveryReady(lab);
  const chain = cpActive && !done[1] && reachedNow ? chainOf(stepIdx, lab) : null;
  const party = useStepCelebration();
  const cp = useLabCheckpoint({
    id: chain ? stepId : null,
    questions: chain ? chain.map((q) => QUESTIONS[q](lab, k, { calculator, figure })) : null,
    reached: reachedNow,
    resetKey: scene.inits,
    onRetry: () => { setLive(null); labRef.current = stepIdx === 0 ? makeLab() : (snap.current ?? makeLab()); setLab(labRef.current); },
    onEvent: (ev) => state.report(onTrial, ev),
    onDone: (id) => {
      if (id === 'frame') { snap.current = labRef.current; setDone([true, false]); party.celebrate({ n: 1, total: 2 }); return; }
      setDone([true, true]); party.celebrate({ n: 2, total: 2 });
      state.discover(); state.formalize();
    },
  });

  const ready = L.discoveryReady(lab) && !cpActive;
  const sfx = useRef(0);
  const wasReady = useRef(false);
  useEffect(() => { if (L.discoveryReady(lab) && !wasReady.current) playSfx('flag'); wasReady.current = L.discoveryReady(lab); }, [lab]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { outcome: L.refineOutcome(lab) }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Géométrie : la règle prend la largeur ; le carré est dessiné à une
  // échelle FIXE (celle de la graduation entière), donc il grandit pendant le
  // geste à la graduation 1 et ne change presque plus sous la loupe — ce que
  // l'œil ne distingue plus, les nombres le distinguent.
  const boxRef = useRef(null);
  const [width, setWidth] = useState(300);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(240, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const EDGE = 22;
  const span = range.max - range.min;
  const mu = (width - 2 * EDGE) / Math.max(1, span);
  const xOf = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: live ?? lab.side ?? range.min, range, toValue,
    onChange: (v) => { setLive(v); const now = performance.now(); if (now - sfx.current > 35) { playSfx('tooth'); sfx.current = now; } },
    onCommit: commit, direction: 'ltr',
  });

  // Une valeur PAR DÉFAUT (le début de la règle : un carré trop petit, jamais la réponse) : jamais vide à l'ouverture.
  // Ce n'est pas un essai : `L.test` n'est appelé ici que pour LIRE la comparaison, son résultat est jeté.
  const shown = live ?? lab.side ?? range.min;
  const isDefault = lab.last == null && live == null;
  const readout = isDefault ? L.test(lab, range.min).last : lab.last;
  const settled = readout != null && !stretch.dragging && shown === readout.v;
  const cmp = settled ? readout.cmp : null;
  const frameUnits = Math.max(2, Math.ceil(L.drawRoot(area)) + 1);
  const box = Math.min(260, Math.max(180, width * 0.55));
  const px = box / frameUnits;
  const sidePx = shown == null ? 0 : Math.min(box, L.drawSide(shown, lab.scale) * px);
  const targetPx = L.drawRoot(area) * px;
  const tone = cmp === 0 ? '#059669' : cmp < 0 ? '#F59E0B' : cmp > 0 ? '#E11D48' : '#6366F1';
  const labelEvery = [1, 2, 5, 10, 20, 50].find((s) => s * mu >= 30) ?? 100;
  const aTex = L.areaTex(area);
  const cmpWord = cmp === 0 ? k('equal', { area: L.areaText(area) }) : cmp < 0 ? k('smaller', { area: L.areaText(area) }) : k('larger', { area: L.areaText(area) });

  const brackets = L.brackets(lab);
  const disc = discoveryParts(lab, k, { calculator, figure });

  return (
    <ManipulationShell
      type="square-root-side"
      title={title ?? k(refineMode ? 'titleRefine' : 'titleGraduation', { area: L.areaText(area) })}
      mission={mission ?? k(refineMode ? 'missionRefine' : 'missionGraduation', { area: L.areaText(area) })}
      lead={lead}
      state={state}
      numberFields={refineMode ? [{ key: 'num', label: 'a' }] : []}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={refineMode}
      headerAction={cpOn ? cpSettings.control : null}
      guided={cpActive}
      hints={(refineMode ? [k('hint1'), k('hint2', { area: L.areaText(area) }), k('hint3')] : [k('gHint1'), k('gHint2'), k('gHint3')]).map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        // Balayer la règle, graduation après graduation : chaque position est un essai (c² vs a lu exactement).
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: untested().length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const next = untested()[0]; if (next !== undefined) commit(next); },
          finish: () => { untested().forEach((v) => commit(v)); },
        },
      }}
      representation={settled && (
        <EquationDisplay
          tex={`c = ${L.sideTex(readout.v, lab.scale)} \\quad c^2 = ${L.squareTex(readout.v, lab.scale)} ${cmp === 0 ? '=' : cmp < 0 ? '<' : '>'} ${aTex}`}
          tone={cmp === 0 ? 'ok' : 'neutral'}
          note={<MathText>{cmpWord}</MathText>}
        />
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={disc.prompt}
          options={disc.options}
          formal={disc.formal}
        />
      )}
      explanation={<MathText>{refineMode ? k('explanation') : k('gExplanation')}</MathText>}
    >
      <div className="relative" data-rs-glance>
        {party.node}
        {cp.node}
      <ManipulationStage className="bg-gradient-to-b from-sky-50/60 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-root-side data-mode={mode}>
          {cpActive && <LabStepper count={2} current={stepIdx} done={done.map((d, i) => d && (i !== stepIdx || !cp.blocking))} stepAttr="data-rs-step" />}
          {/* ── Les cartes (graduation) ou l'aire visée (refine) ── */}
          {refineMode ? (
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">{k('target')}{' '}<bdi dir="ltr" className="font-mono">{L.areaText(area)}</bdi></span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200" data-root-scale={lab.scale}>{k('graduation')}{' '}<bdi dir="ltr" className="font-mono">{lab.scale === 1 ? '1' : L.sideText(1, lab.scale)}</bdi></span>
              <button type="button" onClick={() => setLab((s) => L.refine(s))} disabled={!L.canRefine(lab)} data-root-refine
                className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-sky-400 bg-white px-3 py-1 text-sky-800 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                <ZoomIn className="h-4 w-4" aria-hidden="true" /> {k('refine')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2" role="group" aria-label={k('cards')} data-root-cards>
                {lab.cards.map((c, i) => {
                  const st = L.cardStatus(lab, i);
                  return (
                    <button key={`${c.num}/${c.den}`} type="button" onClick={() => setLab((s) => L.setCard(s, i))} aria-pressed={lab.card === i} data-root-card={i} data-status={st}
                      className={`min-h-[44px] rounded-xl border-2 px-3 py-1 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${lab.card === i ? 'border-sky-600 bg-sky-50' : 'border-slate-300 bg-white'} ${st === 'exact' ? 'text-emerald-800' : st === 'resisting' ? 'text-rose-800' : 'text-slate-800'}`}>
                      <span dir="ltr"><MathText>{`$\\sqrt{${L.areaTex(c)}}$`}</MathText></span>{st === 'exact' ? ' ✓' : st === 'resisting' ? ' ✗' : ''}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={k('graduations')} data-root-graduations>
                <span className="text-xs font-bold text-slate-600">{k('graduations')}</span>
                {Array.from({ length: maxScale }, (_, i) => i + 1).map((g) => (
                  <button key={g} type="button" onClick={() => setLab((s) => L.setScale(s, g))} aria-pressed={lab.scale === g} aria-label={k('graduationAria', { g })} data-root-grad={g}
                    className={`h-11 min-w-[2.75rem] rounded-lg border-2 font-mono text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${lab.scale === g ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300 bg-white text-slate-800'}`}>
                    <span dir="ltr">1/{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── LA RÈGLE : la longueur du côté, tenue au doigt ── */}
          <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 64 }} data-root-ruler>
            <svg width={width} height={64} className="absolute inset-0" aria-hidden="true" focusable="false">
              <rect x={EDGE - 4} y={28} width={span * mu + 8} height={5} rx={2} fill="#0369A1" />
              {shown != null && <rect x={EDGE} y={14} width={Math.max(0, (shown - range.min) * mu)} height={12} rx={3} fill={tone} opacity={0.85} />}
              {Array.from({ length: span + 1 }, (_, i) => range.min + i).map((v) => (
                <g key={v}>
                  <line x1={xOf(v)} x2={xOf(v)} y1={35} y2={v % 10 === 0 || lab.scale === 1 ? 45 : 40} stroke="#64748B" />
                  {(v - range.min) % labelEvery === 0 && <text x={xOf(v)} y={58} textAnchor="middle" fontSize={11} fill="#334155" fontFamily="ui-monospace, monospace">{L.sideText(v, lab.scale)}</text>}
                </g>
              ))}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: shown == null ? k('notSet') : k('valueText', { c: L.sideText(shown, lab.scale) }) })}
              className={`absolute top-1 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
              style={{ left: xOf(shown ?? range.min), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span className="-mt-3 whitespace-nowrap rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-root-value>{shown == null ? '?' : L.sideText(shown, lab.scale)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('shorter')} disabled={shown != null && shown <= range.min}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[8rem] text-center text-sm font-bold text-slate-700">{shown == null ? k('notSet') : k('valueText', { c: L.sideText(shown, lab.scale) })}</p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('longer')} disabled={shown != null && shown >= range.max}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>

          <div className="grid gap-3 grid-cols-[auto_1fr]">
            {/* ── LE CARRÉ sur son quadrillage, et le carré visé en pointillés ── */}
            <div className="flex justify-center rounded-2xl border-2 border-slate-200 bg-white p-2" dir="ltr">
              <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} role="img" data-root-square data-cmp={cmp ?? ''}
                aria-label={shown == null ? k('notSet') : `c = ${L.sideText(shown, lab.scale)} ; c² = ${settled ? L.squareTex(shown, lab.scale).replace('{,}', ',') : '…'}`}>
                {Array.from({ length: frameUnits + 1 }, (_, i) => (
                  <g key={i}>
                    <line x1={i * px} x2={i * px} y1={0} y2={box} stroke="#E2E8F0" />
                    <line x1={0} x2={box} y1={box - i * px} y2={box - i * px} stroke="#E2E8F0" />
                  </g>
                ))}
                <rect x={0} y={box - targetPx} width={targetPx} height={targetPx} fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="6 4" data-root-target />
                {sidePx > 0 && <rect x={0} y={box - sidePx} width={sidePx} height={sidePx} fill={tone} fillOpacity={0.28} stroke={tone} strokeWidth={2.5} />}
              </svg>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-800">{k('legend')}</p>
              <p className="text-slate-600">{k('legendTarget', { area: L.areaText(area) })}</p>
              {refineMode && brackets.length > 0 && (
                <table className="w-full text-center text-sm" dir="ltr" data-root-memory>
                  <thead><tr className="text-xs text-slate-500"><th className="font-bold">{k('colGraduation')}</th><th className="font-bold">{k('colBelow')}</th><th className="font-bold">{k('colAbove')}</th></tr></thead>
                  <tbody>
                    {brackets.map((b) => (
                      <tr key={b.scale} className={b.exact != null ? 'text-emerald-800' : 'text-slate-800'}>
                        <td className="font-mono">{L.sideText(1, b.scale)}</td>
                        <td className="font-mono">{b.exact != null ? `${L.sideText(b.exact, b.scale)} ✓` : b.below != null ? `${L.sideText(b.below, b.scale)}² = ${L.squareTex(b.below, b.scale).replace('{,}', ',')}` : '—'}</td>
                        <td className="font-mono">{b.exact != null ? '' : b.above != null ? `${L.sideText(b.above, b.scale)}² = ${L.squareTex(b.above, b.scale).replace('{,}', ',')}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {refineMode && lab.last && lab.last.cmp !== 0 && !L.canRefine(lab) && !L.tight(brackets.find((b) => b.scale === lab.scale) ?? {}) && (
                <p className="text-xs text-slate-500">{k('needBracket', { area: L.areaText(area) })}</p>
              )}
              {refineMode && L.canRefine(lab) && <p className="text-xs font-bold text-sky-800" data-root-can-refine>{k('canRefine')}</p>}
            </div>
          </div>
        </div>
      </ManipulationStage>
      </div>
    </ManipulationShell>
  );
}

/** La découverte (prompt, options, formalisation) : posée sous le labo quand les questions sont coupées, sinon c'est la dernière question du labo. */
export function discoveryParts(lab, k, { calculator, figure } = {}) {
  const refineMode = lab.mode === 'refine';
  const area = L.currentArea(lab);
  const aTex = L.areaTex(area);
  const outcome = L.refineOutcome(lab);
  const brackets = L.brackets(lab);
  const prompt = refineMode ? k(outcome === 'exact' ? 'dExactPrompt' : 'dNeverPrompt', { area: L.areaText(area) }) : k('gPrompt');
  const options = refineMode
    ? (outcome === 'exact'
      ? [
        { text: k('dExactOpt2', { area: L.areaText(area), half: L.areaText(reduce({ num: area.num, den: area.den * 2 })) }), why: <MathText>{k('dExactWhy2')}</MathText> },
        { text: <MathText>{k('dExactOpt1', { area: L.areaText(area), side: foundText(lab) })}</MathText>, correct: true },
        { text: <MathText>{k('dExactOpt3', { side: foundText(lab) })}</MathText>, why: <MathText>{k('dExactWhy3', { side: foundText(lab), area: L.areaText(area) })}</MathText> },
      ]
      : [
        { text: <MathText>{k('dNeverOpt2', { area: L.areaText(area) })}</MathText>, why: <MathText>{k('dNeverWhy2')}</MathText> },
        { text: <MathText>{k('dNeverOpt3', { area: L.areaText(area) })}</MathText>, why: <MathText>{k('dNeverWhy3', { area: L.areaText(area) })}</MathText> },
        { text: <MathText>{k('dNeverOpt1', { area: L.areaText(area) })}</MathText>, correct: true },
      ])
    : [
      { text: <MathText>{k('gOpt2')}</MathText>, why: <MathText>{k('gWhy2')}</MathText> },
      { text: <MathText>{k('gOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('gOpt3')}</MathText>, why: <MathText>{k('gWhy3')}</MathText> },
    ];
  const formal = refineMode ? (
    outcome === 'exact' ? (
      <div className="space-y-2">
        <EquationDisplay tex={`\\sqrt{${aTex}} = ${foundTex(lab)} \\qquad (${foundTex(lab)})^2 = ${aTex}`} tone="result" note={<MathText>{k('fExact', { area: L.areaText(area), side: foundText(lab) })}</MathText>} />
        <p className="text-sm text-slate-700">{k('fPositive', { side: foundText(lab), area: L.areaText(area) })}</p>
      </div>
    ) : (
      <div className="space-y-2">
        <ul className="space-y-1" dir="ltr" data-root-brackets>
          {brackets.filter(L.tight).map((b) => (
            <li key={b.scale}><MathText>{`$${L.sideTex(b.below, b.scale)} < \\sqrt{${aTex}} < ${L.sideTex(b.above, b.scale)}$`}</MathText></li>
          ))}
        </ul>
        <EquationDisplay tex={`(\\sqrt{${aTex}})^2 = ${aTex}`} tone="result" note={<MathText>{k('fNever', { area: L.areaText(area) })}</MathText>} />
        {calculator && (
          <EquationDisplay tex={`${calculator.replace(',', '{,}')}^2 = ${squareOfDecimal(calculator).replace(',', '{,}')} \\neq ${aTex}`} tone="muted" note={<MathText>{k('fCalculator', { reading: calculator })}</MathText>} />
        )}
        {figure === 'bc-square' && <BcSquare k={k} />}
      </div>
    )
  ) : (
    <div className="space-y-2">
      <ul className="space-y-1" data-root-classes>
        {lab.cards.map((c, i) => {
          const st = L.cardStatus(lab, i);
          const f = L.foundSide(lab, i);
          return (
            <li key={`${c.num}/${c.den}`} className="flex flex-wrap items-center gap-2 text-sm" data-root-class={st}>
              <span dir="ltr"><MathText>{`$\\sqrt{${L.areaTex(c)}}${f ? ` = ${L.sideTex(f.v, f.scale)}` : ''}$`}</MathText></span>
              <span className="text-slate-700">{st === 'exact' ? k('classRational') : st === 'resisting' ? k('classResisting') : k('classOpen')}</span>
            </li>
          );
        })}
      </ul>
      <p className="rounded-xl border-2 border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900"><MathText>{k('gFormal')}</MathText></p>
    </div>
  );
  return { prompt, options, formal };
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

const exactCard = (lab) => lab.cards.findIndex((_, i) => L.cardStatus(lab, i) === 'exact');
const resistingCard = (lab) => lab.cards.findIndex((_, i) => L.cardStatus(lab, i) === 'resisting');
const firstTight = (lab) => L.brackets(lab, 0).find((b) => b.exact == null && L.tight(b));

/** L'étape 1 est atteinte : refine — un encadrement serré ou le côté exact ; graduation — une carte tombée juste. */
export const frameReached = (lab) => (lab.mode === 'refine'
  ? L.brackets(lab, 0).some((b) => b.exact != null || L.tight(b))
  : exactCard(lab) >= 0);

/** Les suites : [étape 1, étape 2] selon le mode et l'issue ; chaque question est construite sur les nombres de l'élève. */
export const CHAINS = Object.freeze({
  exact: [['exSq', 'exName'], ['rule']],
  never: [['bSq', 'bRead'], ['zoom', 'rule']],
  grad: [['gSq', 'gRational'], ['gResist', 'rule']],
});
export const chainOf = (stepIdx, lab) => CHAINS[lab.mode === 'graduation' ? 'grad' : (L.foundSide(lab, 0) ? 'exact' : 'never')][stepIdx];

const Mx = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;
const plain = (tex) => String(tex).replace('{,}', ',');
const ratText = (a) => `${a.num}/${a.den}`;

export const QUESTIONS = {
  exSq: (lab, k) => {
    const f = L.foundSide(lab, 0); const area = L.currentArea(lab);
    const nums = { c: L.sideText(f.v, f.scale), area: L.areaText(area), csq: L.squareTex(f.v, f.scale) };
    return {
      id: 'exSq', kind: 'number', expected: ratText(area), answer: <MathText>{`$${L.areaTex(area)}$`}</MathText>,
      prompt: Mx(k, 'exSq.prompt', nums), hints: [Mx(k, 'exSq.hint1', nums), Mx(k, 'exSq.hint2', nums)], explain: Mx(k, 'exSq.explain', nums),
    };
  },
  exName: (lab, k) => {
    const f = L.foundSide(lab, 0); const area = L.currentArea(lab);
    const nums = { c: L.sideText(f.v, f.scale), area: L.areaText(area), half: L.areaText(reduce({ num: area.num, den: area.den * 2 })), twice: L.areaText(reduce({ num: area.num * 2, den: area.den })) };
    return {
      id: 'exName', kind: 'choice',
      prompt: Mx(k, 'exName.prompt', nums),
      options: [
        { text: Mx(k, 'exName.wrongHalf', nums), why: Mx(k, 'exName.whyHalf', nums) },
        { text: Mx(k, 'exName.right', nums), correct: true },
        { text: Mx(k, 'exName.wrongDouble', nums), why: Mx(k, 'exName.whyDouble', nums) },
      ],
      hints: [Mx(k, 'exName.hint1', nums), Mx(k, 'exName.hint2', nums)], explain: Mx(k, 'exName.explain', nums),
    };
  },
  bSq: (lab, k) => {
    const b = firstTight(lab); const area = L.currentArea(lab);
    const sq = L.squareTex(b.below, b.scale);
    const nums = { below: L.sideText(b.below, b.scale), grad: b.scale === 1 ? '1' : L.sideText(1, b.scale), area: L.areaText(area), sq: plain(sq) };
    return {
      id: 'bSq', kind: 'number', expected: sq.replace('{,}', '.'), answer: <MathText>{`$${sq}$`}</MathText>,
      prompt: Mx(k, 'bSq.prompt', nums), hints: [Mx(k, 'bSq.hint1', nums), Mx(k, 'bSq.hint2', nums)], explain: Mx(k, 'bSq.explain', nums),
    };
  },
  bRead: (lab, k) => {
    const b = firstTight(lab); const area = L.currentArea(lab);
    const nums = {
      below: L.sideText(b.below, b.scale), above: L.sideText(b.above, b.scale), area: L.areaText(area),
      sq: plain(L.squareTex(b.below, b.scale)), asq: plain(L.squareTex(b.above, b.scale)),
    };
    return {
      id: 'bRead', kind: 'choice', cols: 3,
      prompt: Mx(k, 'bRead.prompt', nums),
      options: [
        { text: Mx(k, 'bRead.wrongAbove', nums), why: Mx(k, 'bRead.whyAbove', nums) },
        { text: Mx(k, 'bRead.right', nums), correct: true },
        { text: Mx(k, 'bRead.wrongBelow', nums), why: Mx(k, 'bRead.whyBelow', nums) },
      ],
      hints: [Mx(k, 'bRead.hint1', nums), Mx(k, 'bRead.hint2', nums)], explain: Mx(k, 'bRead.explain', nums),
    };
  },
  zoom: (lab, k) => {
    const bs = L.brackets(lab, 0).filter((b) => b.exact == null && L.tight(b)); const b = bs.at(-1); const area = L.currentArea(lab);
    const nums = { grad: L.sideText(1, b.scale), below: L.sideText(b.below, b.scale), sq: plain(L.squareTex(b.below, b.scale)), area: L.areaText(area) };
    return {
      id: 'zoom', kind: 'choice',
      prompt: Mx(k, 'zoom.prompt', nums),
      options: [
        { text: Mx(k, 'zoom.wrongHit', nums), why: Mx(k, 'zoom.whyHit', nums) },
        { text: Mx(k, 'zoom.right', nums), correct: true },
        { text: Mx(k, 'zoom.wrongMore', nums), why: Mx(k, 'zoom.whyMore', nums) },
      ],
      hints: [Mx(k, 'zoom.hint1', nums), Mx(k, 'zoom.hint2', nums)], explain: Mx(k, 'zoom.explain', nums),
    };
  },
  gSq: (lab, k) => {
    const i = exactCard(lab); const f = L.foundSide(lab, i); const c = lab.cards[i];
    const nums = { area: L.areaText(c), c: L.sideText(f.v, f.scale), grad: f.scale };
    return {
      id: 'gSq', kind: 'number', expected: ratText(c), answer: <MathText>{`$${L.areaTex(c)}$`}</MathText>,
      prompt: Mx(k, 'gSq.prompt', nums), hints: [Mx(k, 'gSq.hint1', nums), Mx(k, 'gSq.hint2', nums)], explain: Mx(k, 'gSq.explain', nums),
    };
  },
  gRational: (lab, k) => {
    const i = exactCard(lab); const f = L.foundSide(lab, i);
    const nums = { c: L.sideText(f.v, f.scale) };
    return {
      id: 'gRational', kind: 'choice', cols: 3,
      prompt: Mx(k, 'gRational.prompt', nums),
      options: [
        { text: Mx(k, 'gRational.wrongIrr', nums), why: Mx(k, 'gRational.whyIrr', nums) },
        { text: Mx(k, 'gRational.wrongCalc', nums), why: Mx(k, 'gRational.whyCalc', nums) },
        { text: Mx(k, 'gRational.right', nums), correct: true },
      ],
      hints: [Mx(k, 'gRational.hint1', nums), Mx(k, 'gRational.hint2', nums)], explain: Mx(k, 'gRational.explain', nums),
    };
  },
  gResist: (lab, k) => {
    const i = resistingCard(lab); const c = lab.cards[i];
    const memo = L.brackets(lab, i).filter(L.tight);
    const nums = { area: L.areaText(c), cnt: memo.length };
    return {
      id: 'gResist', kind: 'choice',
      prompt: Mx(k, 'gResist.prompt', nums),
      options: [
        { text: Mx(k, 'gResist.wrongFiner', nums), why: Mx(k, 'gResist.whyFiner', nums) },
        { text: Mx(k, 'gResist.right', nums), correct: true },
        { text: Mx(k, 'gResist.wrongNone', nums), why: Mx(k, 'gResist.whyNone', nums) },
      ],
      hints: [Mx(k, 'gResist.hint1', nums), Mx(k, 'gResist.hint2', nums)], explain: Mx(k, 'gResist.explain', nums),
    };
  },
  rule: (lab, k, extra) => {
    const d = discoveryParts(lab, k, extra);
    const f = L.foundSide(lab, 0); const area = L.currentArea(lab);
    const grad = lab.mode === 'graduation';
    const nums = { c: f ? L.sideText(f.v, f.scale) : '', area: L.areaText(area) };
    const key = grad ? 'grad' : f ? 'exact' : 'never';
    return {
      id: 'rule', kind: 'choice',
      prompt: <MathText>{d.prompt}</MathText>,
      options: d.options.map((o) => ({ ...o, text: typeof o.text === 'string' ? <MathText>{o.text}</MathText> : o.text })),
      hints: [Mx(k, `rule.hint1${key}`, nums), Mx(k, `rule.hint2${key}`, nums)],
      explain: d.formal,
    };
  },
};

function foundTex(lab) { const f = L.foundSide(lab, 0); return f ? L.sideTex(f.v, f.scale) : ''; }
function foundText(lab) { const f = L.foundSide(lab, 0); return f ? L.sideText(f.v, f.scale) : ''; }

/**
 * Le carré construit sur BC (نشاط 1 : AB = 1, AC = 2) : dans un carré 3 × 3,
 * le carré incliné vaut 9 − 4 triangles d'aire 1 = 5. L'aire 5 EXISTE — son
 * côté est BC — même si aucune graduation ne tombe dessus.
 */
function BcSquare({ k }) {
  const u = 40;
  const P = (x, y) => `${x * u + 10},${(3 - y) * u + 10}`;
  const tri = [[[0, 0], [1, 0], [0, 2]], [[1, 0], [3, 0], [3, 1]], [[3, 1], [3, 3], [2, 3]], [[2, 3], [0, 3], [0, 2]]];
  return (
    <figure className="rounded-xl border-2 border-slate-200 bg-white p-2" data-bc-square>
      <div className="flex justify-center" dir="ltr">
        <svg width={3 * u + 20} height={3 * u + 20} role="img" aria-label={k('bcAria')}>
          {Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <line x1={10 + i * u} x2={10 + i * u} y1={10} y2={10 + 3 * u} stroke="#E2E8F0" />
              <line x1={10} x2={10 + 3 * u} y1={10 + i * u} y2={10 + i * u} stroke="#E2E8F0" />
            </g>
          ))}
          {tri.map((t, i) => <polygon key={i} points={t.map(([x, y]) => P(x, y)).join(' ')} fill="#FDE68A" stroke="#D97706" />)}
          <polygon points={[[1, 0], [3, 1], [2, 3], [0, 2]].map(([x, y]) => P(x, y)).join(' ')} fill="#A7F3D0" fillOpacity={0.6} stroke="#047857" strokeWidth={2.5} />
          <text x={10 + 2 * u} y={10 + 3 * u - 22} fontSize={12} fill="#047857" fontWeight="bold">BC</text>
        </svg>
      </div>
      <figcaption className="text-center text-xs text-slate-700">{k('bcCaption')}</figcaption>
    </figure>
  );
}
