import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Lock, Unlock } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import useDragInteraction from '../useDragInteraction';
import DraggableObject from '../primitives/DraggableObject';
import DropZone from '../primitives/DropZone';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { bidi } from '../../../../utils/bidi';
import * as L from '../logic/turfFactoring';

/**
 * turf-factoring — LE TERRAIN EN GAZON (unité 3 « الحساب الحرفي », leçon 3 et synthèse).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. rows : l'élève ÉTIRE r, le nombre de rangées identiques du terrain.
 *    square : il PORTE chaque bande de gazon à droite ou en bas du carré x²,
 *    puis ferme le terrain. Clavier / toucher-toucher / −,+ font les mêmes gestes.
 * B. Idée : analyser, c'est écrire une somme comme l'aire d'UN rectangle —
 *    ka + kb = k(a + b) (les rangées) ; a² + 2ab + b² = (a + b)² (le carré).
 * C. rows : les plaques se redistribuent en r rangées pendant le geste ; les
 *    restes tombent hors du terrain. square : le coin réclame p × q carreaux.
 * D. L'égalité lue sur les côtés du terrain : 6x² + 4x = 2x(3x + 2) ;
 *    x² + 6x + 9 = (x + 3)² — ou le refus, nombres à l'appui.
 * E. À découvrir : le facteur commun est le plus grand nombre de rangées
 *    identiques (le PGCD des coefficients, comme au chapitre 1) ; une somme
 *    a² + 2ab + b² ferme un CARRÉ — et x² + 25 ne ferme rien.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        تحليل : une somme devient l'aire d'un rectangle, ses côtés sont les facteurs
 *   OBJECT         des plaques de gazon (x², x, 1) à assembler en terrain
 *   VARIABLE       rows : r ; square : la répartition des bandes (p à droite, q en bas)
 *   INVARIANT      les plaques (donc la somme) ne changent jamais
 *   TRANSFORMATION la forme du terrain, et les deux côtés qu'on lit
 *   CONSTRAINT     rangées identiques ; coin exactement rempli
 *   RESISTANCE     « 4 شرائط لا تتوزّع على 3 صفوف » ; « الركن يحتاج 8 مربّعات صغيرة ولديك 9 »
 *   EVIDENCE       le terrain fermé, ses côtés écrits
 *   CONTRAST       un r juste et un r refusé ; une répartition refusée et le carré fermé
 *   PREDICTION     combien de rangées au plus ? où poser les bandes ?
 *   DISCOVERY      ka + kb = k(a + b) ; a² + 2ab + b² = (a + b)²
 *   FORMALIZATION  معارف 3 (p. 34) ; طرائق (p. 35–36)
 *   TRANSFER       تمارين 20–33 ; QCM 4–6, 9–12
 *
 * DÉCOR : bandes de tonte sur les plaques, lignes blanches du terrain fermé,
 * `aria-hidden`, immobile sous prefers-reduced-motion.
 */
const XU = 3.6; // la longueur « x » dessinée : non entière, pour qu'une bande ne passe jamais pour 4 carreaux

export default function TurfFactoring({
  mode = 'rows', expr: expr0 = '6x^2+4x', b: b0 = 6, c: c0 = 9, showNeed = true, title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onFinished, onTrial,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.turfFactoring.${key}`, o), [t]);
  const initialNumbers = mode === 'rows' ? { expr: expr0 } : { b: b0, c: c0 };
  const state = useManipulation({ type: 'turf-factoring', initialNumbers, initialMode, initialLevel: level, withLevels: withLevels && mode === 'rows', hintCount: 3 });
  const nums = state.numbers;
  const make = () => (mode === 'rows' ? L.initRows({ expr: nums.expr }) : L.initSquare({ b: nums.b, c: nums.c }));

  const [lab, setLab] = useState(make);
  const sceneKey = `${mode}:${JSON.stringify(nums)}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [live, setLive] = useState(null);
  const [notice, setNotice] = useState(null);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(make()); setLive(null); setNotice(null); }

  const ready = mode === 'rows' ? L.rowsDiscoveryReady(lab) : L.squareDiscoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, nums); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

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

  /* ── rows : la règle de r ── */
  const range = mode === 'rows' ? L.rowsRange(lab) : { min: 0, max: 1 };
  const EDGE = 22;
  const span = Math.max(1, range.max - range.min);
  const mu = (width - 2 * EDGE) / span;
  const xOf = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: live ?? lab.r ?? range.min, range, toValue, onChange: setLive,
    onCommit: (v) => {
      setLive(null);
      if (mode !== 'rows' || L.canRow(lab, v) !== true) return;
      setLab((s) => L.setRows(s, v));
      state.report(onTrial, L.rowsLayout(lab, v));
    },
    direction: 'ltr',
  });

  /* ── square : porter les bandes ── */
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      if (mode !== 'square' || !src.startsWith('strip:')) return '';
      const v = L.canPlace(lab, src.slice(6), zone);
      return v === true ? true : v;
    },
    onDrop: (src, zone) => { setLab((s) => L.place(s, src.slice(6), zone)); setNotice(null); },
    onReject: (_s, _z, reason) => setNotice(reason ? { tone: 'ko', key: reason } : null),
  });
  /**
   * Toucher (ou Entrée sur) une bande d'une zone PENDANT qu'on tient une bande venue
   * d'ailleurs, c'est la poser dans cette zone : les zones « يمين » et « تحت » sont
   * couvertes par leurs propres bandes, qui sinon deviendraient le nouvel objet tenu.
   */
  const intoZone = (zone) => {
    const stop = (e) => { if (drag.held && !drag.dragging && drag.held !== `strip:${zone}`) { e.stopPropagation(); e.preventDefault(); } };
    const drop = (e) => {
      if (!drag.held || drag.dragging || drag.held === `strip:${zone}`) return;
      e.stopPropagation(); e.preventDefault(); drag.dropHere(zone);
    };
    return {
      onPointerDownCapture: stop,
      onPointerUpCapture: stop,
      onClickCapture: drop,
      onKeyDownCapture: (e) => { if (e.key === 'Enter' || e.key === ' ') drop(e); },
    };
  };

  const closeField = () => {
    const verdict = L.canClose(lab);
    if (verdict === 'stripsLeft') { setNotice({ tone: 'ko', key: 'stripsLeft' }); return; }
    const next = L.close(lab);
    setLab(next);
    state.report(onTrial, next.trials.at(-1));
    setNotice(verdict === true ? { tone: 'ok', key: 'closed' } : { tone: 'ko', key: verdict, need: L.cornerNeed(lab), have: lab.c });
  };

  const unitPx = Math.max(10, Math.min(22, (width - 40) / (mode === 'rows' ? 12 : (XU + Math.max(2, lab.b ?? 0) + 1))));

  /* ── dessin d'une plaque ── */
  const Tile = ({ w, h, neg = false, dashed = false, kind }) => (
    <div
      data-tile={kind}
      className={`relative shrink-0 overflow-hidden rounded-[3px] border ${dashed ? 'border-dashed border-slate-400 bg-transparent' : neg ? 'border-rose-500' : 'border-emerald-800/50'}`}
      style={{ width: w * unitPx, height: h * unitPx, background: dashed ? undefined : neg ? 'repeating-linear-gradient(45deg,#FFE4E6 0 5px,#FDA4AF 5px 7px)' : 'repeating-linear-gradient(90deg,#22C55E 0 8px,#16A34A 8px 16px)' }}
      aria-hidden="true"
    />
  );

  const rr = live ?? lab.r;
  const layout = mode === 'rows' && rr != null ? L.rowsLayout(lab, rr) : null;

  const renderRows = () => {
    const tall = lab.m === 1 ? XU : 1;
    const tileOf = (p) => (lab.m === 1 ? (p === 2 ? { w: XU, h: XU, kind: 'x2' } : { w: 1, h: XU, kind: 'x' }) : (p === 1 ? { w: XU, h: 1, kind: 'x' } : { w: 1, h: 1, kind: '1' }));
    if (!layout) {
      return (
        <div className="flex flex-wrap gap-1" data-turf-loose>
          {lab.terms.flatMap((term) => Array.from({ length: Math.abs(term.c) }, (_, n) => <Tile key={`${term.p}-${n}`} {...tileOf(term.p)} neg={term.c < 0} />))}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <div className="flex items-stretch gap-2" dir="ltr">
          <div className="flex w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-900" data-turf-height>
            {layout.valid ? <MathText>{`$${L.rowsCommonTex(lab, rr)}$`}</MathText> : '?'}
          </div>
          <div className={`rounded-xl border-4 p-1 ${layout.valid ? 'border-white bg-emerald-700/10 ring-2 ring-emerald-500' : 'border-dashed border-rose-300'}`} data-turf-field data-rows={rr} data-valid={String(layout.valid)}>
            {Array.from({ length: rr }, (_, row) => (
              <div key={row} className="flex gap-0.5" style={{ height: tall * unitPx + 2 }} data-turf-row={row}>
                {layout.perRow.flatMap((term) => Array.from({ length: Math.abs(term.c) }, (_, n) => <Tile key={`${term.p}-${n}`} {...tileOf(term.p)} neg={term.c < 0} />))}
              </div>
            ))}
          </div>
        </div>
        {!layout.valid && (
          <div className="rounded-lg border-2 border-dashed border-rose-300 bg-rose-50/60 p-2" data-turf-leftover>
            <p className="mb-1 text-xs font-bold text-rose-800">{k('leftoverTitle')}</p>
            <div className="flex flex-wrap gap-1">
              {layout.leftover.flatMap((term) => Array.from({ length: Math.abs(term.c) }, (_, n) => <Tile key={`${term.p}-${n}`} {...tileOf(term.p)} neg={term.c < 0} />))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSquare = () => {
    const need = L.cornerNeed(lab);
    const shown = Math.min(lab.c, need);
    const extra = Math.max(0, lab.c - need);
    const closed = !!lab.closed;
    return (
      <div className="space-y-3">
        <div className={`inline-grid gap-1 rounded-xl p-1 ${closed ? 'ring-4 ring-white outline outline-2 outline-emerald-600 bg-emerald-700/10' : ''}`} dir="ltr"
          style={{ gridTemplateColumns: `auto auto` }} data-turf-square data-closed={String(closed)}>
          <Tile w={XU} h={XU} kind="x2" />
          <DropZone drag={drag} id="right" {...intoZone('right')} tone="emerald" label={k('rightZone', { n: lab.right })} minHeight="" className="flex min-w-[44px] gap-0.5 p-0.5" style={{ minHeight: XU * unitPx }}>
            {Array.from({ length: lab.right }, (_, n) => (
              n === 0
                ? <DraggableObject key={n} drag={drag} id="strip:right" label={k('stripFromRight')} className="p-0"><Tile w={1} h={XU} kind="x" /></DraggableObject>
                : <Tile key={n} w={1} h={XU} kind="x" />
            ))}
          </DropZone>
          <DropZone drag={drag} id="bottom" {...intoZone('bottom')} tone="emerald" label={k('bottomZone', { n: lab.bottom })} minHeight="min-h-[44px]" className="flex flex-col gap-0.5 p-0.5" style={{ minWidth: XU * unitPx }}>
            {Array.from({ length: lab.bottom }, (_, n) => (
              n === 0
                ? <DraggableObject key={n} drag={drag} id="strip:bottom" label={k('stripFromBottom')} className="p-0"><Tile w={XU} h={1} kind="x" /></DraggableObject>
                : <Tile key={n} w={XU} h={1} kind="x" />
            ))}
          </DropZone>
          <div className="grid gap-0.5 p-0.5" style={{ gridTemplateColumns: `repeat(${Math.max(1, lab.right)}, ${unitPx}px)` }} data-turf-corner data-need={need}>
            {Array.from({ length: need }, (_, n) => <Tile key={n} w={1} h={1} kind="1" dashed={n >= shown} />)}
          </div>
        </div>
        {(showNeed || closed) && (
          <p className="text-sm text-slate-700" data-turf-need><MathText>{k('cornerReading', { right: lab.right, bottom: lab.bottom, need, have: lab.c })}</MathText></p>
        )}
        {extra > 0 && (
          <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-2" data-turf-extra>
            <p className="mb-1 text-xs font-bold text-amber-900">{k('extraTitle', { n: extra })}</p>
            <div className="flex flex-wrap gap-0.5">{Array.from({ length: extra }, (_, n) => <Tile key={n} w={1} h={1} kind="1" />)}</div>
          </div>
        )}
        <DropZone drag={drag} id="stock" {...intoZone('stock')} tone="slate" label={k('stockZone', { n: L.stock(lab) })} hint={k('stockEmpty')} minHeight="min-h-[56px]" className="flex flex-wrap items-center gap-1 p-2" data-turf-stock>
          {L.stock(lab) > 0 && Array.from({ length: L.stock(lab) }, (_, n) => (
            n === 0
              ? <DraggableObject key={n} drag={drag} id="strip:stock" label={k('stripFromStock', { n: L.stock(lab) })} className="p-0"><Tile w={XU} h={1} kind="x" /></DraggableObject>
              : <Tile key={n} w={XU} h={1} kind="x" />
          ))}
        </DropZone>
        <div className="flex flex-wrap gap-2">
          {!closed ? (
            <button type="button" onClick={closeField} data-turf-close
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">
              <Lock className="h-5 w-5" aria-hidden="true" /> {k('close')}
            </button>
          ) : (
            <button type="button" onClick={() => { setLab((s) => L.reopen(s)); setNotice(null); }} data-turf-reopen
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 font-bold text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
              <Unlock className="h-5 w-5" aria-hidden="true" /> {k('reopen')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const exprTex = mode === 'rows' ? L.rowsExprTex(lab) : L.squareExprTex(lab);
  const rowsEq = layout?.valid ? L.rowsEquationTex(lab, rr) : null;
  const representation = mode === 'rows'
    ? (layout && !live && (layout.valid
      ? <EquationDisplay tone="ok" tex={rowsEq} note={<MathText>{k('rowsValid', { r: rr })}</MathText>} />
      : <EquationDisplay tone="ko" tex={`${exprTex} \\neq ${rr} \\times (\\ldots)`} note={<MathText>{k('rowsRefused', { r: rr })}</MathText>} />))
    : (lab.closed
      ? <EquationDisplay tone="ok" tex={L.squareEquationTex(lab)} note={<MathText>{k(lab.closed.p === lab.closed.q ? 'closedSquare' : 'closedRect')}</MathText>} />
      : notice?.need != null ? <EquationDisplay tone="ko" tex={`${notice.need} \\neq ${notice.have}`} note={<MathText>{k(notice.key, { need: notice.need, have: notice.have })}</MathText>} /> : null);

  const noSquare = mode === 'square' && !L.closable(lab);

  return (
    <ManipulationShell
      type="turf-factoring"
      title={bidi(title ?? k(mode === 'rows' ? 'titleRows' : 'titleSquare', { expr: exprTex }))}
      mission={mission ?? k(mode === 'rows' ? 'missionRows' : 'missionSquare')}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={(mode === 'rows' ? [k('rHint1'), k('rHint2'), k('rHint3')] : [k('sHint1'), k('sHint2'), k('sHint3')]).map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      representation={representation}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k(mode === 'rows' ? 'rPrompt' : noSquare ? 'nPrompt' : 'sPrompt')}
          options={mode === 'rows'
            ? [
              { text: <MathText>{k('rOpt2')}</MathText>, why: <MathText>{k('rWhy2')}</MathText> },
              { text: <MathText>{k('rOpt1')}</MathText>, correct: true },
              { text: <MathText>{k('rOpt3')}</MathText>, why: <MathText>{k('rWhy3', { g: L.rowsGcd(lab) })}</MathText> },
            ]
            : noSquare
              ? [
                { text: <MathText>{k('nOpt1')}</MathText>, correct: true },
                { text: <MathText>{k('nOpt2')}</MathText>, why: <MathText>{k('nWhy2')}</MathText> },
                { text: <MathText>{k('nOpt3')}</MathText>, why: <MathText>{k('nWhy3')}</MathText> },
              ]
              : [
                { text: <MathText>{k('sOpt2')}</MathText>, why: <MathText>{k('sWhy2')}</MathText> },
                { text: <MathText>{k('sOpt1')}</MathText>, correct: true },
                { text: <MathText>{k('sOpt3')}</MathText>, why: <MathText>{k('sWhy3')}</MathText> },
              ]}
          formal={(
            <div className="space-y-2" data-turf-formal>
              <EquationDisplay tone="result" tex={k(mode === 'rows' ? 'rRule' : noSquare ? 'nRule' : 'sRule')} note={<MathText>{k(mode === 'rows' ? 'rFormal' : noSquare ? 'nFormal' : 'sFormal')}</MathText>} />
              {mode === 'rows' && <EquationDisplay tone="neutral" tex={L.rowsEquationTex(lab, L.rowsGcd(lab))} note={<MathText>{k('yourCase')}</MathText>} />}
              {mode === 'square' && lab.closed && <EquationDisplay tone="neutral" tex={L.squareEquationTex(lab)} note={<MathText>{k('yourCase')}</MathText>} />}
            </div>
          )}
        />
      )}
      explanation={<MathText>{k(mode === 'rows' ? 'explanationRows' : 'explanationSquare')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/70 to-white" data-dragging={stretch.dragging || drag.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-turf-factoring data-mode={mode}>
          <p className="text-sm text-slate-700"><MathText>{k(mode === 'rows' ? 'legendRows' : 'legendSquare', { expr: exprTex })}</MathText></p>
          {mode === 'rows' && (
            <>
              <p className="text-sm font-bold text-slate-700">{k('rowsRuler')}</p>
              <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 60 }} data-turf-ruler>
                <svg width={width} height={60} className="absolute inset-0" aria-hidden="true" focusable="false">
                  <rect x={EDGE - 4} y={26} width={span * mu + 8} height={5} rx={2} fill="#047857" />
                  {Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).map((v) => {
                    const tr = lab.tried?.find((u) => u.r === v);
                    return (
                      <g key={v}>
                        <line x1={xOf(v)} x2={xOf(v)} y1={33} y2={41} stroke="#64748B" />
                        <text x={xOf(v)} y={55} textAnchor="middle" fontSize={11} fill={tr ? (tr.valid ? '#047857' : '#BE123C') : '#334155'} fontWeight={tr ? 'bold' : 'normal'} fontFamily="ui-monospace, monospace">{v}</text>
                      </g>
                    );
                  })}
                </svg>
                <div
                  {...stretch.handleProps({ label: k('rowsHandle'), valueText: rr == null ? k('notSet') : k('rowsValue', { r: rr }) })}
                  className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
                  style={{ left: xOf(rr ?? range.min), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
                >
                  <span className="-mt-2 rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-turf-r>{rr ?? '?'}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('fewerRows')} disabled={rr != null && rr <= range.min}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
                <p className="min-w-[8rem] text-center text-sm font-bold text-slate-700">{rr == null ? k('notSet') : k('rowsValue', { r: rr })}</p>
                <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('moreRows')} disabled={rr != null && rr >= range.max}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
              </div>
              <div className="overflow-x-auto">{renderRows()}</div>
              {lab.tried.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" dir="ltr" data-turf-tried>
                  {lab.tried.map((tr) => (
                    <li key={tr.r} data-tried-r={tr.r} data-valid={String(tr.valid)} className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${tr.valid ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                      r = {tr.r} {tr.valid ? '✓' : '✗'}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {mode === 'square' && <div className="overflow-x-auto">{renderSquare()}</div>}
          <p className="min-h-[1.25rem] text-sm" aria-live="polite" data-turf-notice>
            {notice && notice.need == null && notice.key !== 'closed' && <span className="text-rose-800"><MathText>{k(notice.key)}</MathText></span>}
          </p>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
