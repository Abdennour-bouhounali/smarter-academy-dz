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
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import { reduce as reducePoly, mulTerms, termsTex, termTex } from '@smarter-academy/core/arithmetic/polynomials.js';
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
 * QUESTIONS PENDANT LE LABO (prototype `primitives/LabCheckpoint`, déploiement lot 2, 2026-10-28) : le labo n'a pas de tâches successives (une seule
 * scène libre par instance) ; quand la découverte est atteinte, une suite unique se pose PAR-DESSUS le labo et retient la règle (`chainOf`) :
 * rows — le plus grand r juste · ce qui est resté dehors pour SON r refusé · la bonne écriture du facteur commun (mauvaises options = les erreurs
 * réelles : le terme qui « disparaît », le diviseur oublié, le facteur incomplet) · LA RÈGLE ; square fermable — le coin de SA tentative refusée ·
 * les bandes par côté · les côtés du carré · LA RÈGLE ; square non fermable (x² + 25) — les carreaux restés dehors · pourquoi · LA RÈGLE.
 * La suite qui finit par la règle remplace la découverte automatique (`onDone` : discover + formalize). Obligatoires pour tout élève ;
 * l'enseignant seul les coupe pour SON compte (`checkpoints` = false les coupe aussi). `onCheckpoint(ev)` : `{ tk: 'checkpoint' | 'checkpoint-done',
 * id: cpId(mode, nums), … }`. ÉTAPES `LabStepper` (`[data-tf-step=<i>]`) + fête ; « إعادة » repart de zéro ; « أعِد التجربة » remet le terrain au départ.
 * SON : `tooth` (r bougé, bande posée), `bell` (un r juste), `flag` (le plus grand r juste, le terrain fermé), `over` (reste dehors, refus).
 *
 * DÉCOR : bandes de tonte sur les plaques, lignes blanches du terrain fermé,
 * `aria-hidden`, immobile sous prefers-reduced-motion.
 */
/** L'identifiant de la suite de questions d'un terrain : ce que `onCheckpoint` rapporte (`id`) et que les étapes du module relisent. */
export const cpId = (mode, nums) => (mode === 'rows' ? `rows:${nums.expr}` : `square:${nums.b}:${nums.c}`);

const XU = 3.6; // la longueur « x » dessinée : non entière, pour qu'une bande ne passe jamais pour 4 carreaux

export default function TurfFactoring({
  mode = 'rows', expr: expr0 = '6x^2+4x', b: b0 = 6, c: c0 = 9, showNeed = true, title, lead, mission, level, levels: withLevels = true, checkpoints: cpOn = true,
  initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, onCheckpoint,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.turfFactoring.${key}`, o), [t]);
  const initialNumbers = mode === 'rows' ? { expr: expr0 } : { b: b0, c: c0 };
  const state = useManipulation({ type: 'turf-factoring', initialNumbers, initialMode, initialLevel: level, withLevels: withLevels && mode === 'rows', hintCount: 3 });
  const nums = state.numbers;
  const make = () => (mode === 'rows' ? L.initRows({ expr: nums.expr }) : L.initSquare({ b: nums.b, c: nums.c }));

  const [lab, setLab] = useState(make);
  const sceneKey = `${mode}:${JSON.stringify(nums)}:${state.epoch}:${state.resetCount}`;
  const [scene, setScene] = useState({ key: sceneKey, inits: 0 });
  const [live, setLive] = useState(null);
  const [notice, setNotice] = useState(null);
  // « إعادة » (resetCount), un autre niveau ou d'autres nombres : TOUT recommence — le terrain, les essais et les questions du labo
  if (scene.key !== sceneKey) { setScene({ key: sceneKey, inits: scene.inits + 1 }); setLab(make()); setLive(null); setNotice(null); }

  const ready = mode === 'rows' ? L.rowsDiscoveryReady(lab) : L.squareDiscoveryReady(lab);
  const noSquare = mode === 'square' && !L.closable(lab);
  // les questions pendant le labo : une suite unique quand la découverte est atteinte ; celle qui finit par la règle remplace la découverte automatique
  const cpSettings = useLabCheckpointSettings('turf-factoring');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const cpLive = cpOn && cpSettings.enabled;
  const chain = cpLive ? chainOf(mode, noSquare) : null;
  const cp = useLabCheckpoint({
    id: chain ? cpId(mode, nums) : null,
    questions: chain && ready ? chain.map((q) => QUESTIONS[q](lab, k)) : null,
    reached: ready,
    resetKey: scene.inits,
    onRetry: () => { setLab(make()); setLive(null); setNotice(null); },
    onEvent: (ev) => state.report(onCheckpoint, ev),
    onDone: () => { state.discover(); state.formalize(); },
  });
  useEffect(() => { if (ready && !cpLive) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  // une étape est FAITE quand son objectif est atteint ET (la dernière) ses questions répondues : la pastille passe au vert et on fête
  const stepDone = mode === 'rows'
    ? [lab.tried.some((t) => t.valid), lab.tried.some((t) => t.valid) && lab.tried.some((t) => !t.valid), ready && !cp.blocking]
    : [lab.trials.length > 0, noSquare ? lab.trials.length > 0 : lab.trials.some((t) => t.ok), ready && !cp.blocking];
  const nDone = stepDone.findIndex((d) => !d) < 0 ? stepDone.length : stepDone.findIndex((d) => !d);
  const party = useStepCelebration();
  const celebrated = useRef({ n: 0, inits: scene.inits });
  if (celebrated.current.inits !== scene.inits) celebrated.current = { n: 0, inits: scene.inits };   // « إعادة » : on refête
  useEffect(() => {
    if (nDone <= celebrated.current.n) return;
    celebrated.current.n = nDone;
    party.celebrate({ n: nDone, total: stepDone.length });
  }, [nDone]); // eslint-disable-line react-hooks/exhaustive-deps
  // le son du geste (muet sans « الصوت ») : r bougé / bande posée (au plus un toutes les 35 ms) ; un r juste, le plus grand, un refus
  const heard = useRef({ at: 0, r: null });
  const tick = () => { const now = Date.now(); if (now - heard.current.at > 35) { playSfx('tooth'); heard.current.at = now; } };
  const rowSound = (prev, r) => { const l = L.rowsLayout(prev, r); playSfx(!l.valid ? 'over' : r === L.rowsGcd(prev) ? 'flag' : 'bell'); };
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
  // Un r PAR DÉFAUT, jamais une réponse ni un essai (2026-10-09) : il n'entre pas dans `tried`.
  const defaultR = mode === 'rows' ? L.defaultRows(lab) : null;
  // Miroir synchrone de `lab` pour « جرّب كل الإمكانيات ».
  const labRef = useRef(lab);
  labRef.current = lab;
  const sweepRows = (v) => {
    const prev = labRef.current;
    if (L.canRow(prev, v) !== true) return;
    labRef.current = L.setRows(prev, v);
    rowSound(prev, v);
    setLab((s) => L.setRows(s, v));
    setLive(null);
    state.report(onTrial, L.rowsLayout(prev, v));
  };
  const untriedR = L.untriedRows(lab);
  const stretch = useStretchInteraction({
    value: live ?? lab.r ?? defaultR, range, toValue, onChange: setLive,
    onCommit: (v) => {
      setLive(null);
      if (mode !== 'rows' || L.canRow(lab, v) !== true) return;
      setLab((s) => L.setRows(s, v));
      rowSound(lab, v);
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
    onDrop: (src, zone) => { setLab((s) => L.place(s, src.slice(6), zone)); setNotice(null); tick(); },
    onReject: (_s, _z, reason) => { setNotice(reason ? { tone: 'ko', key: reason } : null); if (reason) playSfx('over'); },
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
    if (verdict === 'stripsLeft') { setNotice({ tone: 'ko', key: 'stripsLeft' }); playSfx('over'); return; }
    playSfx(verdict === true ? 'flag' : 'over');
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

  const rr = live ?? lab.r ?? defaultR;
  useEffect(() => { if (heard.current.r !== null && heard.current.r !== rr) tick(); heard.current.r = rr; }, [rr]); // eslint-disable-line react-hooks/exhaustive-deps
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

  return (
    <ManipulationShell
      type="turf-factoring"
      title={bidi(title ?? k(mode === 'rows' ? 'titleRows' : 'titleSquare', { expr: exprTex }))}
      mission={mission ?? k(mode === 'rows' ? 'missionRows' : 'missionSquare')}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      headerAction={cpSettings.control}
      guided={!!chain}
      hints={(mode === 'rows' ? [k('rHint1'), k('rHint2'), k('rHint3')] : [k('sHint1'), k('sHint2'), k('sHint3')]).map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        autoComplete: mode === 'rows' ? {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: untriedR.length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const v = L.untriedRows(labRef.current)[0]; if (v !== undefined) sweepRows(v); },
          finish: () => { L.untriedRows(labRef.current).forEach(sweepRows); },
        } : undefined,
      }}
      representation={representation}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k(mode === 'rows' ? 'rPrompt' : noSquare ? 'nPrompt' : 'sPrompt')}
          options={discoveryOptions(lab, k, mode, noSquare)}
          formal={<Formal lab={lab} k={k} mode={mode} noSquare={noSquare} />}
        />
      )}
      explanation={<MathText>{k(mode === 'rows' ? 'explanationRows' : 'explanationSquare')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/70 to-white" data-dragging={stretch.dragging || drag.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="relative space-y-3" data-turf-factoring data-mode={mode}>
          {party.node}
          {cp.node}
          <LabStepper count={stepDone.length} current={Math.min(nDone, stepDone.length - 1)} done={stepDone} stepAttr="data-tf-step" />
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

/* ══════════════ La découverte et la règle ══════════════ */

/** Les trois options de la règle (la bonne, l'erreur du mode, et la réfutation par SES nombres). */
export function discoveryOptions(lab, k, mode, noSquare = false) {
  if (mode === 'rows') {
    return [
      { text: <MathText>{k('rOpt2')}</MathText>, why: <MathText>{k('rWhy2')}</MathText> },
      { text: <MathText>{k('rOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('rOpt3')}</MathText>, why: <MathText>{k('rWhy3', { g: L.rowsGcd(lab) })}</MathText> },
    ];
  }
  if (noSquare) {
    return [
      { text: <MathText>{k('nOpt1')}</MathText>, correct: true },
      { text: <MathText>{k('nOpt2')}</MathText>, why: <MathText>{k('nWhy2')}</MathText> },
      { text: <MathText>{k('nOpt3')}</MathText>, why: <MathText>{k('nWhy3')}</MathText> },
    ];
  }
  return [
    { text: <MathText>{k('sOpt2')}</MathText>, why: <MathText>{k('sWhy2')}</MathText> },
    { text: <MathText>{k('sOpt1')}</MathText>, correct: true },
    { text: <MathText>{k('sOpt3')}</MathText>, why: <MathText>{k('sWhy3')}</MathText> },
  ];
}

export function Formal({ lab, k, mode, noSquare = false }) {
  return (
    <div className="space-y-2" data-turf-formal>
      <EquationDisplay tone="result" tex={k(mode === 'rows' ? 'rRule' : noSquare ? 'nRule' : 'sRule')} note={<MathText>{k(mode === 'rows' ? 'rFormal' : noSquare ? 'nFormal' : 'sFormal')}</MathText>} />
      {mode === 'rows' && <EquationDisplay tone="neutral" tex={L.rowsEquationTex(lab, L.rowsGcd(lab))} note={<MathText>{k('yourCase')}</MathText>} />}
      {mode === 'square' && lab.closed && <EquationDisplay tone="neutral" tex={L.squareEquationTex(lab)} note={<MathText>{k('yourCase')}</MathText>} />}
    </div>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite unique de chaque scène : elle interroge ce que l'élève vient de FAIRE et finit par LA RÈGLE. */
export function chainOf(mode, noSquare = false) {
  if (mode === 'rows') return ['best', 'left', 'common', 'rule'];
  return noSquare ? ['outside', 'why', 'rule'] : ['corner', 'half', 'sides', 'rule'];
}

const $ = (x) => `$${x}$`;
const Cq = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;
const innerTex = (terms, m) => termsTex(terms.map((t) => ({ c: t.c, p: t.p - m })));
const eqTex = (lab, common, inner) => `${L.rowsExprTex(lab)} = ${common === '1' ? '' : common}(${inner})`;
const expandTex = (common, terms) => termsTex(reducePoly(terms.map((t) => mulTerms(common, t))));

/**
 * Les écritures FAUSSES du facteur commun, chacune une erreur réelle : `lost` (le terme égal au facteur « disparaît » : 3 ÷ 3 = 0), `forgot` (un seul
 * terme divisé), `sign` (le signe du dernier terme perdu), `partial` (juste mais incomplète : la lettre n'est pas sortie). Les écartées égalent la bonne.
 */
export function wrongFactors(lab) {
  const g = L.rowsGcd(lab); const m = lab.m;
  const quot = lab.terms.map((t) => ({ c: t.c / g, p: t.p }));          // les quotients par g, la lettre encore dedans
  const common = { c: g, p: m };
  const commonTex = termTex(common, { lead: true });
  const right = eqTex(lab, commonTex, innerTex(quot, m));
  const out = [];
  const add = (id, terms, comm = common, withExpand = true) => {
    const tex = eqTex(lab, termTex(comm, { lead: true }), innerTex(terms, comm.p));
    if (tex === right || out.some((o) => o.tex === tex)) return;
    out.push({ id, tex, expanded: withExpand ? expandTex(comm, terms.map((t) => ({ c: t.c, p: t.p - comm.p }))) : null });
  };
  const one = quot.findIndex((q) => Math.abs(q.c) === 1 && q.p === m);
  if (one >= 0 && quot.length > 1) add('lost', quot.filter((_, i) => i !== one));
  if (quot.length > 1) add('forgot', [quot[0], ...lab.terms.slice(1)]);
  if (lab.terms.some((t) => t.c < 0)) add('sign', quot.map((q, i) => (i === quot.length - 1 ? { ...q, c: -q.c } : q)));
  if (m >= 1) add('partial', lab.terms.map((t) => ({ c: t.c / g, p: t.p })), { c: g, p: 0 }, false);
  return out;
}

export const QUESTIONS = {
  best: (lab, k) => {
    const g = L.rowsGcd(lab);
    const first = lab.tried.find((t) => !t.valid);
    const o = { g: $(String(g)), r: first ? $(String(first.r)) : '' };
    return {
      id: 'best', kind: 'number', expected: String(g), answer: <MathText>{$(String(g))}</MathText>,
      prompt: Cq(k, 'best.prompt'), hints: [Cq(k, 'best.hint1'), Cq(k, 'best.hint2', o)], explain: Cq(k, 'best.explain', { ...o, expr: $(L.rowsExprTex(lab)) }),
    };
  },
  left: (lab, k) => {
    const bad = lab.tried.find((t) => !t.valid);
    const lay = L.rowsLayout(lab, bad.r);
    const n = lay.leftover.reduce((sum, t) => sum + Math.abs(t.c), 0);
    const o = { r: $(String(bad.r)), n: $(String(n)), calc: $(lay.leftover.map((t) => Math.abs(t.c)).join('+') + `=${n}`) };
    return {
      id: 'left', kind: 'number', expected: String(n), answer: <MathText>{$(String(n))}</MathText>,
      prompt: Cq(k, 'left.prompt', o), hints: [Cq(k, 'left.hint1'), Cq(k, 'left.hint2', o)], explain: Cq(k, 'left.explain', o),
    };
  },
  common: (lab, k) => {
    const g = L.rowsGcd(lab);
    const right = L.rowsEquationTex(lab, g);
    const wrong = wrongFactors(lab).slice(0, 2);
    const why = (w) => Cq(k, `common.why.${w.id}`, { expr: $(L.rowsExprTex(lab)), expanded: w.expanded ? $(w.expanded) : '' });
    return {
      id: 'common', kind: 'choice', cols: 3, prompt: Cq(k, 'common.prompt', { expr: $(L.rowsExprTex(lab)) }),
      options: [
        { text: <MathText>{$(wrong[0].tex)}</MathText>, why: why(wrong[0]) },
        { text: <MathText>{$(right)}</MathText>, correct: true },
        { text: <MathText>{$(wrong[1].tex)}</MathText>, why: why(wrong[1]) },
      ],
      hints: [Cq(k, 'common.hint1'), Cq(k, 'common.hint2')],
      explain: Cq(k, 'common.explain', { eq: $(right) }),
    };
  },
  corner: (lab, k) => {
    const bad = lab.trials.find((t) => !t.ok);
    const o = { right: $(String(bad.right)), bottom: $(String(bad.bottom)), n: $(String(bad.need)), calc: $(`${bad.right}\\times${bad.bottom}=${bad.need}`) };
    return {
      id: 'corner', kind: 'number', expected: String(bad.need), answer: <MathText>{$(String(bad.need))}</MathText>,
      prompt: Cq(k, 'corner.prompt', o), hints: [Cq(k, 'corner.hint1'), Cq(k, 'corner.hint2', o)], explain: Cq(k, 'corner.explain', { ...o, have: $(String(lab.c)) }),
    };
  },
  half: (lab, k) => {
    const ok = lab.trials.find((t) => t.ok && t.right === t.bottom);
    const o = { b: $(String(lab.b)), p: $(String(ok.right)), calc: $(`${ok.right}+${ok.bottom}=${lab.b}`) };
    return {
      id: 'half', kind: 'number', expected: String(ok.right), answer: <MathText>{$(String(ok.right))}</MathText>,
      prompt: Cq(k, 'half.prompt', o), hints: [Cq(k, 'half.hint1'), Cq(k, 'half.hint2', o)], explain: Cq(k, 'half.explain', o),
    };
  },
  sides: (lab, k) => {
    const ok = lab.trials.find((t) => t.ok && t.right === t.bottom);
    const p = ok.right;
    const expr = L.squareExprTex(lab);
    const sq = (n) => `(x+${n})^2`;
    const exp = (n) => `x^2+${2 * n}x+${n * n}`;
    const o = { expr: $(expr), right: $(sq(p)) };
    return {
      id: 'sides', kind: 'choice', cols: 3, prompt: Cq(k, 'sides.prompt', { expr: $(expr) }),
      options: [
        { text: <MathText>{$(sq(lab.b))}</MathText>, why: Cq(k, 'sides.whyStrips', { wrong: $(sq(lab.b)), exp: $(exp(lab.b)), b: $(String(lab.b)) }) },
        { text: <MathText>{$(sq(p))}</MathText>, correct: true },
        { text: <MathText>{$(sq(lab.c))}</MathText>, why: Cq(k, 'sides.whyCorner', { wrong: $(sq(lab.c)), exp: $(exp(lab.c)), c: $(String(lab.c)) }) },
      ],
      hints: [Cq(k, 'sides.hint1', { p: $(String(p)) }), Cq(k, 'sides.hint2', { p: $(String(p)) })],
      explain: Cq(k, 'sides.explain', { ...o, eq: $(`${expr}=${sq(p)}`) }),
    };
  },
  outside: (lab, k) => {
    const tr = lab.trials[0];
    const n = lab.c - (tr?.need ?? 0);
    const o = { c: $(String(lab.c)), n: $(String(n)) };
    return {
      id: 'outside', kind: 'number', expected: String(n), answer: <MathText>{$(String(n))}</MathText>,
      prompt: Cq(k, 'outside.prompt', o), hints: [Cq(k, 'outside.hint1'), Cq(k, 'outside.hint2', o)], explain: Cq(k, 'outside.explain', o),
    };
  },
  why: (lab, k) => {
    const o = { c: $(String(lab.c)), root: $(String(Math.round(Math.sqrt(lab.c)))), sq: $(`${Math.round(Math.sqrt(lab.c))}^2=${lab.c}`) };
    return {
      id: 'why', kind: 'choice', prompt: Cq(k, 'why.prompt', o),
      options: [
        { text: Cq(k, 'why.notSquare', o), why: Cq(k, 'why.whyNotSquare', o) },
        { text: Cq(k, 'why.right', o), correct: true },
        { text: Cq(k, 'why.tooBig', o), why: Cq(k, 'why.whyTooBig', o) },
      ],
      hints: [Cq(k, 'why.hint1'), Cq(k, 'why.hint2', o)], explain: Cq(k, 'why.explain', o),
    };
  },
  rule: (lab, k) => {
    const noSquare = lab.mode === 'square' && !L.closable(lab);
    return {
      id: 'rule', kind: 'choice', prompt: <MathText>{k(lab.mode === 'rows' ? 'rPrompt' : noSquare ? 'nPrompt' : 'sPrompt')}</MathText>,
      options: discoveryOptions(lab, k, lab.mode, noSquare),
      hints: [Cq(k, `rule.${lab.mode === 'rows' ? 'rows' : noSquare ? 'none' : 'square'}.hint1`), Cq(k, `rule.${lab.mode === 'rows' ? 'rows' : noSquare ? 'none' : 'square'}.hint2`)],
      explain: <Formal lab={lab} k={k} mode={lab.mode} noSquare={noSquare} />,
    };
  },
};
