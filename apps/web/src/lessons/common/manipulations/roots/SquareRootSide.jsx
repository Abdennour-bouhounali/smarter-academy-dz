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
export default function SquareRootSide({
  mode = 'refine', num: num0 = 36, den: den0 = 1, scale: maxScale0, areas: areas0,
  calculator, figure, title, lead, mission, level, levels: withLevels = true, initialMode = 'student', allowModeSwitch = false, onFinished, onTrial,
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
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(makeLab()); }

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
    setLab(next);
    state.report(onTrial, { area: L.currentArea(next), side: v, scale: next.scale, cmp: next.last.cmp });
  }, [state, onTrial]);
  const untested = () => {
    const r = L.range(labRef.current);
    const done = testedRef.current.sets[setKey(labRef.current)] ?? new Set();
    return Array.from({ length: r.max - r.min + 1 }, (_, i) => r.min + i).filter((v) => !done.has(v));
  };
  useEffect(() => { setLive(null); }, [lab.scale, lab.card, state.epoch]);

  const ready = L.discoveryReady(lab);
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
  const stretch = useStretchInteraction({ value: live ?? lab.side ?? range.min, range, toValue, onChange: setLive, onCommit: commit, direction: 'ltr' });

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
  const outcome = L.refineOutcome(lab);

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
          prompt={refineMode ? k(outcome === 'exact' ? 'dExactPrompt' : 'dNeverPrompt', { area: L.areaText(area) }) : k('gPrompt')}
          options={refineMode
            ? (outcome === 'exact'
              ? [
                { text: k('dExactOpt2', { area: L.areaText(area), half: L.areaText(reduce({ num: area.num, den: area.den * 2 })) }), why: <MathText>{k('dExactWhy2')}</MathText> },
                { text: <MathText>{k('dExactOpt1', { area: L.areaText(area), side: foundText(lab) })}</MathText>, correct: true },
                { text: <MathText>{k('dExactOpt3', { side: foundText(lab) })}</MathText>, why: <MathText>{k('dExactWhy3', { side: foundText(lab), area: L.areaText(area) })}</MathText> },
              ]
              : [
                { text: <MathText>{k('dNeverOpt2', { area: L.areaText(area) })}</MathText>, why: <MathText>{k('dNeverWhy2')}</MathText> },
                { text: <MathText>{k('dNeverOpt3', { area: L.areaText(area) })}</MathText>, why: <MathText>{k('dNeverWhy3')}</MathText> },
                { text: <MathText>{k('dNeverOpt1', { area: L.areaText(area) })}</MathText>, correct: true },
              ])
            : [
              { text: <MathText>{k('gOpt2')}</MathText>, why: <MathText>{k('gWhy2')}</MathText> },
              { text: <MathText>{k('gOpt1')}</MathText>, correct: true },
              { text: <MathText>{k('gOpt3')}</MathText>, why: <MathText>{k('gWhy3')}</MathText> },
            ]}
          formal={refineMode ? (
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
          )}
        />
      )}
      explanation={<MathText>{refineMode ? k('explanation') : k('gExplanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-sky-50/60 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-root-side data-mode={mode}>
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
    </ManipulationShell>
  );
}

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
