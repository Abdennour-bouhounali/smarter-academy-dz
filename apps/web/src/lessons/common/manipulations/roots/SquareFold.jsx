import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, MapPin, Ban } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import * as L from '../logic/squareFold';

/**
 * square-fold — LA DROITE QUI SE PLIE (unité 2, leçon 3 : x² = a).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève DÉPLACE x le long de la droite graduée (réglette
 *    `useStretchInteraction` en LTR ; clavier, − / +, toucher la droite).
 * B. Idée : x et −x ont le même carré ; un carré n'est jamais négatif ; donc
 *    x² = a a deux solutions opposées, une seule (0) ou aucune.
 * C. Pendant le geste, une flèche porte x vers x² sur la droite des carrés,
 *    au-dessus. Sa moitié négative est HACHURÉE : aucune flèche n'y entre.
 * D. Au relâchement : x² se lit exactement ; « ثبّت » épingle x comme
 *    solution de la carte x² = a — jugé, jamais pré-rempli.
 * E. À découvrir : le nombre de solutions dépend du SIGNE de a.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        les solutions de x² = a selon le signe de a
 *   OBJECT         un point x sur la droite, et sa flèche vers x²
 *   VARIABLE       x (le doigt tient le point)
 *   INVARIANT      a (la carte) ; x² ≥ 0 ; x et −x donnent le même carré
 *   TRANSFORMATION la flèche et la valeur x²
 *   CONSTRAINT     une solution épinglée doit vérifier x² = a
 *   RESISTANCE     la moitié négative hachurée : épingler pour a < 0 est
 *                  refusé (« x² لا يكون سالبًا ») ; une mauvaise valeur est
 *                  refusée avec son carré exact
 *   EVIDENCE       les épingles ; deux flèches qui arrivent au même point
 *   CONTRAST       a > 0 (deux), a = 0 (une), a < 0 (aucune) — les trois exigés
 *   PREDICTION     « مراد : الحل هو 3 » — la carte reste ouverte avec une épingle
 *   DISCOVERY      خاصية 2 : le nombre de solutions dépend du signe de a
 *   FORMALIZATION  x² = a ⇔ x = √a ou x = −√a (a > 0)
 *   TRANSFER       طرائق p. 23, تمارين 11–14, la وضعية du tapis (ℓ² = 12)
 */
/** Un nombre écrit pour KaTeX : signe « - », virgule décimale protégée. */
const tex = (s) => s.replace('−', '-').replace(',', '{,}');

export default function SquareFold({
  a: a0 = 9, scale: scale0 = 2, targets: targets0, table, title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.squareFold.${key}`, o), [t]);
  const state = useManipulation({ type: 'square-fold', initialNumbers: { a: a0, scale: scale0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { scale } = state.numbers;
  // Les cartes : celles de la leçon sur son niveau ; celles de levels.js sur
  // l'autre niveau d'une manipulation posée seule (sinon 9 / 0 / −9 autour de a).
  const targets = (state.isAuthoredLevel ? targets0 : state.levelPreset?.targets) ?? [state.numbers.a, 0, -state.numbers.a];
  const tKey = targets.join(',');

  const make = () => L.init({ targets, scale });
  const [lab, setLab] = useState(make);
  const sceneKey = `${tKey}:${scale}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [live, setLive] = useState(null);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(make()); setLive(null); }
  // Miroir synchrone de `lab` : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const labRef = useRef(lab);
  labRef.current = lab;
  const range = L.range(lab);
  const target = L.current(lab);

  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const hatchId = `sa-fold-hatch-${useId().replace(/:/g, '')}`;
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

  // Deux droites LTR : x en bas (−R … R), les carrés en haut (−R² … R²),
  // de même centre : la flèche de x vers x² part toujours vers la DROITE du
  // centre, que x soit positif ou négatif — le pli se voit.
  const EDGE = 24;
  const mid = width / 2;
  const ux = (width / 2 - EDGE) / lab.R;
  const A = lab.R * lab.R;
  const uy = (width / 2 - EDGE) / A;
  const xPx = (v) => mid + (v / lab.scale) * ux;
  const yPx = (y) => mid + y * uy;
  const toValue = useCallback((clientX, _y, rect) => ((clientX - rect.left - mid) / ux) * lab.scale, [mid, ux, lab.scale]);
  const stretch = useStretchInteraction({ value: live ?? lab.x ?? L.defaultX(lab), range, toValue, onChange: setLive, onCommit: (v) => { setLive(v); setLab((s) => L.move(s, v)); }, direction: 'ltr', pageStep: lab.scale });

  // Un x PAR DÉFAUT (L.defaultX : solution d'aucune carte) : jamais vide à l'ouverture. Ce n'est pas une visite : `lab.visited` ne le contient pas.
  const isDefault = lab.x == null && live == null;
  const x = live ?? lab.x ?? L.defaultX(lab);
  const x2 = x == null ? null : (x / lab.scale) ** 2; // pour DESSINER
  const settled = !stretch.dragging && (isDefault || (lab.x != null && x === lab.x));
  const unvisited = () => { const r = L.range(labRef.current); return Array.from({ length: r.max - r.min + 1 }, (_, i) => r.min + i).filter((v) => !labRef.current.visited.includes(v)); };
  const H = 150;
  const TOP = 38;
  const BOT = 118;
  const pins = lab.pins[lab.card] ?? [];
  const solvedAll = lab.targets.map((_, i) => L.cardSolved(lab, i));
  const xTick = [0.5, 1, 2, 5].find((s) => s * ux >= 26) ?? 5;
  const yTick = [1, 2, 5, 10, 25, 50].find((s) => s * uy >= 26) ?? 50;

  const last = lab.last;
  // Chaque message est construit SEULEMENT pour le verdict rendu : celui de
  // « notSolution » lit last.v, qui n'existe pas pour les autres verdicts.
  const verdict = last && ({
    pinned: () => <span className="text-emerald-800"><MathText>{k('vPinned', { x: L.solutionTex(target, last.sign) })}</MathText></span>,
    notSolution: () => <span className="text-rose-800"><MathText>{k('vNot', { x: tex(L.xText(last.v, lab.scale)), x2: tex(L.squareText(last.v, lab.scale)), a: L.targetText(target.a) })}</MathText></span>,
    negativeTarget: () => <span className="text-rose-800">{k('vNegative', { a: L.targetText(target.a) })}</span>,
    hasSolution: () => <span className="text-rose-800">{k('vHasSolution', { a: L.targetText(target.a) })}</span>,
    declaredNone: () => <span className="text-emerald-800">{k('vNone', { a: L.targetText(target.a) })}</span>,
    alreadyPinned: () => <span className="text-slate-700">{k('vAlready')}</span>,
    noX: () => <span className="text-slate-700">{k('vNoX')}</span>,
  }[last.kind]?.());

  return (
    <ManipulationShell
      type="square-fold"
      title={title ?? k('title')}
      mission={mission ?? k('mission')}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={([k('hint1'), k('hint2'), k('hint3')]).map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        // Balayer la droite, graduation après graduation : chaque position est une visite (le tableau se remplit) ; épingler reste la réponse de l'élève.
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
            labRef.current = todo.reduce((acc, v) => L.move(acc, v), labRef.current);
            setLive(todo[todo.length - 1]);
            setLab((s) => todo.reduce((acc, v) => L.move(acc, v), s));
          },
        },
      }}
      representation={settled && (
        <EquationDisplay tex={`x = ${L.xText(x, lab.scale).replace('−', '-').replace(',', '{,}')} \\qquad x^2 = ${L.squareText(x, lab.scale).replace(',', '{,}')}`} tone="neutral" />
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k('dPrompt')}
          options={[
            { text: <MathText>{k('dOpt2')}</MathText>, why: <MathText>{k('dWhy2')}</MathText> },
            { text: <MathText>{k('dOpt3')}</MathText>, why: <MathText>{k('dWhy3')}</MathText> },
            { text: <MathText>{k('dOpt1')}</MathText>, correct: true },
          ]}
          formal={(
            <div className="space-y-2" data-fold-formal>
              <EquationDisplay tex="a > 0" tone="result" note={<MathText>{k('fPositive')}</MathText>} />
              <EquationDisplay tex="a = 0" tone="result" note={<MathText>{k('fZero')}</MathText>} />
              <EquationDisplay tex="a < 0" tone="result" note={<MathText>{k('fNegative')}</MathText>} />
            </div>
          )}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-violet-50/60 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-square-fold>
          {/* ── Les cartes : une équation chacune ── */}
          <div className="flex flex-wrap gap-2" role="group" aria-label={k('cards')} data-fold-cards>
            {lab.targets.map((tg, i) => (
              <button key={tg.a} type="button" onClick={() => setLab((s) => L.setCard(s, i))} aria-pressed={lab.card === i} data-fold-card={i} data-solved={solvedAll[i] ? 'true' : 'false'}
                className={`min-h-[44px] rounded-xl border-2 px-3 py-1 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${lab.card === i ? 'border-violet-600 bg-violet-50' : 'border-slate-300 bg-white'} ${solvedAll[i] ? 'text-emerald-800' : 'text-slate-800'}`}>
                <span dir="ltr"><MathText>{`$x^2 = ${L.targetText(tg.a).replace('−', '-').replace(',', '{,}')}$`}</MathText></span>{solvedAll[i] ? ' ✓' : ''}
              </button>
            ))}
          </div>

          {/* ── Les deux droites ── */}
          <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: H }} data-fold-lines>
            <svg width={width} height={H} className="absolute inset-0" role="img" aria-label={x == null ? k('notSet') : `x = ${L.xText(x, lab.scale)} ; x² = ${L.squareText(x, lab.scale)}`}>
              <defs>
                <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#94A3B8" strokeWidth="2" />
                </pattern>
              </defs>
              {/* droite des carrés */}
              <rect x={EDGE} y={TOP - 10} width={mid - EDGE} height={20} fill={`url(#${hatchId})`} opacity={0.6} data-fold-forbidden />
              <line x1={EDGE} x2={width - EDGE} y1={TOP} y2={TOP} stroke="#7C3AED" strokeWidth={2} />
              <text x={EDGE} y={14} fontSize={11} fill="#6D28D9" fontWeight="bold">x²</text>
              {Array.from({ length: Math.floor(A / yTick) * 2 + 1 }, (_, i) => (i - Math.floor(A / yTick)) * yTick).map((y) => (
                <g key={`y${y}`}>
                  <line x1={yPx(y)} x2={yPx(y)} y1={TOP - 4} y2={TOP + 4} stroke="#7C3AED" />
                  {y >= 0 && <text x={yPx(y)} y={TOP + 16} textAnchor="middle" fontSize={10} fill="#5B21B6" fontFamily="ui-monospace, monospace">{y}</text>}
                </g>
              ))}
              {/* la cible a */}
              <g data-fold-target={target.a}>
                <circle cx={yPx(target.a)} cy={TOP} r={7} fill="none" stroke="#DB2777" strokeWidth={2.5} />
                <text x={yPx(target.a)} y={TOP - 13} textAnchor="middle" fontSize={11} fill="#BE185D" fontWeight="bold">a</text>
              </g>
              {/* droite des x */}
              <line x1={EDGE} x2={width - EDGE} y1={BOT} y2={BOT} stroke="#334155" strokeWidth={2} />
              <text x={width - EDGE} y={BOT + 30} fontSize={11} fill="#334155" fontWeight="bold" textAnchor="end">x</text>
              {Array.from({ length: Math.floor(lab.R / xTick) * 2 + 1 }, (_, i) => (i - Math.floor(lab.R / xTick)) * xTick).map((v) => (
                <g key={`x${v}`}>
                  <line x1={mid + v * ux} x2={mid + v * ux} y1={BOT - 4} y2={BOT + 4} stroke="#334155" />
                  <text x={mid + v * ux} y={BOT + 18} textAnchor="middle" fontSize={10} fill="#334155" fontFamily="ui-monospace, monospace">{String(v).replace('-', '−').replace('.', ',')}</text>
                </g>
              ))}
              {/* les solutions épinglées de la carte */}
              {pins.map((sign) => {
                const px = mid + sign * Math.sqrt(target.r.num / target.r.den) * ux;
                return (
                  <g key={sign} data-fold-pin={sign}>
                    <path d={`M ${px} ${BOT} C ${px} ${(BOT + TOP) / 2}, ${yPx(target.a)} ${(BOT + TOP) / 2}, ${yPx(target.a)} ${TOP + 8}`} fill="none" stroke="#059669" strokeWidth={2} strokeDasharray="4 3" />
                    <circle cx={px} cy={BOT} r={6} fill="#059669" />
                  </g>
                );
              })}
              {/* la flèche de x vers x² */}
              {x != null && (
                <path d={`M ${xPx(x)} ${BOT - 8} C ${xPx(x)} ${(BOT + TOP) / 2}, ${yPx(x2)} ${(BOT + TOP) / 2}, ${yPx(x2)} ${TOP + 8}`} fill="none" stroke="#0EA5E9" strokeWidth={2.5} markerEnd="" data-fold-arrow />
              )}
              {x2 != null && <circle cx={yPx(x2)} cy={TOP} r={5} fill="#0EA5E9" />}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: x == null ? k('notSet') : k('valueText', { x: L.xText(x, lab.scale) }) })}
              className={`absolute flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-500 bg-white/70'}`}
              style={{ left: xPx(x ?? 0), top: BOT - 22, cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span className="font-mono text-xs font-extrabold text-slate-900" data-fold-x>{x == null ? '?' : L.xText(x, lab.scale)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">{k('forbiddenNote')}</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('left')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('right')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" onClick={() => { stretch.flush(); setLab((s) => L.pin(s)); }} data-fold-pin-button
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-emerald-500 bg-white px-3 font-bold text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {k('pin')}
            </button>
            <button type="button" onClick={() => setLab((s) => L.declareNone(s))} data-fold-none
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-slate-400 bg-white px-3 font-bold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
              <Ban className="h-4 w-4" aria-hidden="true" /> {k('none')}
            </button>
          </div>
          {verdict && <p role="status" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold" data-fold-verdict={last.kind}>{verdict}</p>}
          {pins.length > 0 && (
            <p className="text-sm text-slate-800" data-fold-solutions>
              {k('solutionsOf')}{' '}
              <bdi dir="ltr"><MathText>{`$x^2 = ${L.targetText(target.a).replace('−', '-').replace(',', '{,}')}$`}</MathText></bdi>{' : '}
              {pins.map((sign, i) => (
                <React.Fragment key={sign}>{i > 0 ? ` ${t('manipulation.and')} ` : ''}<bdi dir="ltr"><MathText>{`$${L.solutionTex(target, sign)}$`}</MathText></bdi></React.Fragment>
              ))}
            </p>
          )}

          {/* ── Le tableau de l'activité 3 (x ↦ x²), rempli par les positions essayées ── */}
          {table && (
            <table className="w-full table-fixed text-center text-sm" dir="ltr" data-fold-table>
              <tbody>
                <tr><th className="w-12 bg-slate-50 font-mono">x</th>{table.map((v) => <td key={v} className="border border-slate-200 font-mono">{L.xText(v * lab.scale, lab.scale)}</td>)}</tr>
                <tr>
                  <th className="bg-slate-50 font-mono">x²</th>
                  {table.map((v) => {
                    const seen = lab.visited.includes(Math.round(v * lab.scale));
                    return <td key={v} className="border border-slate-200 font-mono" data-fold-cell={v} data-seen={seen ? 'true' : 'false'}>{seen ? L.squareText(Math.round(v * lab.scale), lab.scale) : '…'}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
