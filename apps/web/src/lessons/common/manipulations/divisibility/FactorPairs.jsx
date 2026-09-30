import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { divisibility } from '@smarter-academy/core';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import DivisorSet from '../primitives/DivisorSet';
import { BOOK_PALETTE } from '../primitives/BookFigure';
import * as L from '../logic/factorPairs';

const { divisionTestBound } = divisibility;

/**
 * factor-pairs — LE RECTANGLE QUI SE COUCHE.
 *
 * A. L'élève TIRE le bord de la rangée : d, le nombre de livres par rangée,
 *    suit le doigt (réglette `useStretchInteraction` ; clavier, − / + et
 *    toucher la réglette font la même chose).
 * B. Idée : n = d × e ⇔ les n livres forment un rectangle PARFAIT ; les
 *    diviseurs viennent par PAIRES.
 * C. Pendant le geste, les n livres se rangent en rangées de d, dessinés dans
 *    un cadre carré : le rectangle est haut et mince, devient CARRÉ, puis
 *    large et plat. Une rangée incomplète est dessinée en pointillés ambre.
 * D. Émerge, au relâchement : n = d × e (+ r), et la paire (petit × grand)
 *    rejoint le tableau — deux diviseurs d'un coup.
 * E. À découvrir : passé le carré, chaque rectangle parfait est un rectangle
 *    déjà possible, COUCHÉ (« مقلوب ») — on peut s'arrêter au carré, √n.
 *
 * FICHE (MANIPULATION_DNA §7) — variable : d ; invariant : les n livres ;
 * résistance : la rangée incomplète ; contraste : parfait / incomplet ;
 * découverte : tous les d jusqu'au carré testés ET un rectangle couché vu
 * (`discoveryReady`, indépendant de l'ordre depuis 2026-09-30).
 *
 * Jusqu'au 2026-09-30 l'élève portait un NOMBRE d'un rail où les tuiles
 * au-delà de √n étaient grisées d'avance — la règle d'arrêt était affichée
 * avant d'être découverte. Rien ici ne marque √n : c'est le carré qui le dit.
 */
export default function FactorPairs({ n: n0, title, lead, mission, initialMode = 'student', allowModeSwitch = false, onFinished }) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.factorPairs.${key}`, o), [t]);
  const state = useManipulation({ type: 'factor-pairs', initialNumbers: { n: n0 }, initialMode, hintCount: 3 });
  const { n } = state.numbers;
  const bound = divisionTestBound(n);
  const range = L.widthRange(n);

  const [lab, setLab] = useState(() => L.init({ n: n0 }));
  const [d, setD] = useState(null);
  const sceneKey = `${n}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init({ n })); setD(null); }

  const commit = useCallback((v) => { setD(v); setLab((s) => L.test(s, v)); }, []);
  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, n); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // La place : la réglette prend toute la largeur ; le cadre est carré.
  const boxRef = useRef(null);
  const [width, setWidth] = useState(300);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(200, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const EDGE = 26;
  const mu = Math.max(8, Math.min(40, (width - 2 * EDGE) / range.max));
  const x0 = width - EDGE;
  const xOf = (v) => x0 - v * mu;
  const toValue = useCallback((clientX, _y, rect) => (x0 - (clientX - rect.left)) / mu, [x0, mu]);
  const stretch = useStretchInteraction({ value: d, range, toValue, onChange: setD, onCommit: commit, direction: 'rtl' });

  const box = Math.min(width, 280);
  const R = d == null ? null : L.rectangleLayout({ n, d, box });
  const lastTest = lab.tested.find((x) => x.d === lab.cols);
  const settled = lab.cols !== null && !stretch.dragging && d === lab.cols;
  const color = (i) => BOOK_PALETTE[i % BOOK_PALETTE.length][0];
  const labelStep = [1, 2, 5, 10].find((s) => s * mu >= 22) ?? 10;

  return (
    <ManipulationShell
      type="factor-pairs"
      title={title ?? k('title', { n })}
      mission={mission ?? k('mission', { n })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'n', label: 'a' }]}
      allowModeSwitch={allowModeSwitch}
      hints={[k('hint1'), k('hint2'), k('hint3')]}
      controller={{
        autoStep: () => {
          const next = Array.from({ length: range.max }, (_, i) => i + 1).find((v) => !lab.tested.some((x) => x.d === v));
          if (next === undefined) return false;
          commit(next);
          return true;
        },
        canAutoStep: () => lab.tested.length < range.max,
        showSolution: () => { setLab((s) => Array.from({ length: range.max }, (_, i) => i + 1).reduce((acc, v) => L.test(acc, v), s)); state.discover(); state.formalize(); },
      }}
      representation={settled && (
        <div className="space-y-2">
          {lastTest?.divides
            ? <EquationDisplay tex={`${n} = ${lab.cols} \\times ${lab.rows}`} tone={lastTest.repeat ? 'muted' : 'ok'} note={lastTest.repeat ? k('turned', { d: lab.cols, e: lab.rows }) : k('perfect', { n, d: lab.cols, e: lab.rows })} />
            : <EquationDisplay tex={`${n} = ${lab.cols} \\times ${lab.rows} + ${lab.rest}`} tone="neutral" note={k('imperfect', { d: lab.cols, n, r: lab.rest })} />}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k('discoverPrompt')}
          options={[
            { text: k('opt2', { n }), why: k('why2') },
            { text: k('opt1', { n }), correct: true },
            { text: k('opt3', { n }), why: k('why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <DivisorSet title={t('manipulation.divisorsOf', { n })} values={L.allDivisors(lab)} highlight={new Set(L.allDivisors(lab))} ariaLabel={t('manipulation.divisorsOf', { n })} />
              <EquationDisplay tex={`d \\times d \\leq ${n}`} tone="result" note={k('testUpTo', { n, bound })} />
            </div>
          )}
        />
      )}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-amber-50/50 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-factor-rectangle>
          {/* ── LA RÉGLETTE : le nombre de livres par rangée, tenu au doigt ── */}
          <div {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 66 }} data-width-ruler>
            <svg width={width} height={66} className="absolute inset-0" aria-hidden="true" focusable="false">
              <rect x={xOf(range.max) - 4} y={30} width={range.max * mu + 8} height={5} rx={2} fill="#B45309" />
              <rect x={x0} y={10} width={5} height={26} rx={1} fill="#92400E" />
              {d != null && Array.from({ length: d }, (_, j) => (
                <rect key={j} x={x0 - (j + 1) * mu + 1} y={12} width={Math.max(2, mu - 2)} height={18} rx={2} fill={color(j)} />
              ))}
              {Array.from({ length: range.max }, (_, i) => i + 1).map((v) => (
                <g key={v}>
                  <line x1={xOf(v)} x2={xOf(v)} y1={37} y2={v % 5 === 0 ? 45 : 41} stroke="#94A3B8" />
                  {v % labelStep === 0 && <text x={xOf(v)} y={58} textAnchor="middle" fontSize={11} fill="#475569" fontFamily="ui-monospace, monospace">{v}</text>}
                </g>
              ))}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: d == null ? k('notSet') : k('valueText', { d }) })}
              className={`absolute top-1 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
              style={{ left: xOf(d ?? range.min), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span dir="ltr" className="-mt-3 rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-row-length>{d ?? '?'}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('shorter')} disabled={d != null && d <= range.min}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[8rem] text-center text-sm font-bold text-slate-700">{d == null ? k('notSet') : k('valueText', { d })}</p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('longer')} disabled={d != null && d >= range.max}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            {/* ── LE CADRE CARRÉ : le rectangle de n livres, entier ── */}
            <div className="flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-2" style={{ minHeight: box + 16 }}>
              {R == null ? (
                <p className="max-w-[16rem] text-center text-sm font-bold text-slate-500">{k('dropCols', { n })}</p>
              ) : (
                <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} role="img"
                  aria-label={R.rest ? `${n} = ${d} × ${R.rows} + ${R.rest}` : `${n} = ${d} × ${R.rows}`}
                  data-rectangle data-cols={d} data-rows={R.rows} data-rest={R.rest} data-turned={R.rest === 0 && d > R.rows ? 'true' : 'false'}>
                  {/* le carré de référence : là où le rectangle cesse d'être debout */}
                  <rect x={0.5} y={0.5} width={box - 1} height={box - 1} fill="none" stroke="#E2E8F0" strokeDasharray="3 4" />
                  {Array.from({ length: n }, (_, i) => {
                    const row = Math.floor(i / d);
                    const col = i % d;
                    const partial = row >= R.rows;
                    return (
                      <rect key={i} data-book={partial ? 'rest' : 'full'}
                        x={box - (col + 1) * R.cell + 0.6} y={box - R.height + row * R.cell + 0.6}
                        width={R.cell - 1.2} height={R.cell - 1.2} rx={Math.min(3, R.cell / 5)}
                        fill={partial ? '#FDE68A' : color(i)} stroke={partial ? '#D97706' : 'none'} strokeDasharray={partial ? '2 2' : undefined} />
                    );
                  })}
                </svg>
              )}
            </div>

            {/* ── LES PAIRES : deux diviseurs par rectangle parfait ── */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 md:min-w-[10rem]">
              <div className="mb-1.5 text-xs font-bold text-slate-700">{k('pairsBoard')}</div>
              <ul className="space-y-1" dir="ltr" data-pairs>
                {lab.pairs.length === 0 && <li className="text-xs text-slate-400">—</li>}
                {lab.pairs.map((p) => {
                  const isCurrent = settled && lastTest?.divides && Math.min(lab.cols, lab.rows) === p.small;
                  return (
                    <li key={p.key} data-pair={p.key} className={`rounded-lg px-2 py-0.5 font-mono text-sm font-bold ${isCurrent ? (lastTest.repeat ? 'bg-sky-100 text-sky-900 ring-2 ring-sky-300' : 'bg-emerald-100 text-emerald-900') : 'text-slate-800'}`}>
                      {p.small} × {p.big}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
