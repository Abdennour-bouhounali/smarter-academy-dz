import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { divisibility } from '@smarter-academy/core';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import NumberTile from '../primitives/NumberTile';
import DragGhost from '../primitives/DragGhost';
import RectangleArray from '../primitives/RectangleArray';
import EquationDisplay from '../primitives/EquationDisplay';
import DivisorSet from '../primitives/DivisorSet';
import * as L from '../logic/factorPairs';

const { divisionTestBound } = divisibility;

/**
 * factor-pairs — LE LABORATOIRE DU RECTANGLE.
 *
 * A. L'élève porte un nombre de COLONNES sur le tas de n points.
 * B. Idée : n = d × e ⇔ les n points forment un rectangle parfait de d colonnes.
 * C. Le tas se réorganise ; une dernière ligne incomplète (en ambre) se voit.
 * D. Émerge : n = d × e, et le couple s'installe dans le tableau — DEUX
 *    diviseurs d'un coup.
 * E. À découvrir : au-delà de √n, les couples REVIENNENT. La règle d'arrêt
 *    du manuel est vécue avant d'être lue.
 */
export default function FactorPairs({ n: n0, title, lead, mission, initialMode = 'student', allowModeSwitch = false, onFinished }) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'factor-pairs', initialNumbers: { n: n0 }, initialMode, hintCount: 3 });
  const { n } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ n: n0 }));
  const [reject, setReject] = useState(null);
  const bound = divisionTestBound(n);

  useEffect(() => { setLab(L.init({ n })); setReject(null); }, [n, state.epoch]);

  // Le rail va au-delà de √n : c'est en testant 15 pour 105 que la répétition se voit.
  const rail = useMemo(() => {
    const upto = Math.min(n, bound + Math.max(4, Math.ceil(bound / 2)));
    return Array.from({ length: upto }, (_, i) => i + 1);
  }, [n, bound]);

  const drag = useDragInteraction({
    onDrop: (sourceId) => {
      const d = Number(sourceId.replace('cols:', ''));
      setReject(null);
      setLab((s) => { const next = L.test(s, d); if (L.discoveryReady(next)) state.discover(); return next; });
    },
    accepts: (sourceId) => L.canTest(lab, Number(sourceId.replace('cols:', ''))),
    onReject: (_s, _z, reason) => setReject(reason),
  });

  const heldValue = drag.held ? Number(drag.held.replace('cols:', '')) : null;
  const placed = lab.cols !== null;
  const lastTest = lab.tested.find((x) => x.d === lab.cols);

  useEffect(() => { if (state.isFormal) onFinished?.(n); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ManipulationShell
      type="factor-pairs"
      title={title ?? t('manipulation.factorPairs.title', { n })}
      mission={mission ?? t('manipulation.factorPairs.mission', { n })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'n', label: 'a' }]}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.factorPairs.hint1'), t('manipulation.factorPairs.hint2'), t('manipulation.factorPairs.hint3', { bound })]}
      controller={{
        autoStep: () => {
          const next = rail.find((d) => !lab.tested.some((x) => x.d === d));
          if (next === undefined) return false;
          setLab((s) => { const x = L.test(s, next); if (L.discoveryReady(x)) state.discover(); return x; });
          return true;
        },
        canAutoStep: () => rail.some((d) => !lab.tested.some((x) => x.d === d)),
        showSolution: () => { setLab((s) => rail.reduce((acc, d) => L.test(acc, d), s)); state.discover(); state.formalize(); },
      }}
      representation={placed && (
        <div className="space-y-2">
          {lastTest?.divides
            ? <EquationDisplay tex={`${n} = ${lab.cols} \\times ${lab.rows}`} tone={lastTest.repeat ? 'muted' : 'ok'} note={lastTest.repeat ? t('manipulation.factorPairs.repeat', { d: lab.cols, e: lab.rows }) : t('manipulation.factorPairs.perfect', { n, d: lab.cols, e: lab.rows })} />
            : <EquationDisplay tex={`${n} = ${lab.cols} \\times ${lab.rows} + ${lab.rest}`} tone="neutral" note={t('manipulation.factorPairs.imperfect', { d: lab.cols, n, r: lab.rest })} />}
          {lastTest?.beyondBound && lastTest?.repeat && (
            <p className="rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">{t('manipulation.factorPairs.beyondBound', { bound, n })}</p>
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.factorPairs.discoverPrompt')}
          options={[
            { text: t('manipulation.factorPairs.opt1', { n }), correct: true },
            { text: t('manipulation.factorPairs.opt2', { n }), why: t('manipulation.factorPairs.why2', { bound }) },
            { text: t('manipulation.factorPairs.opt3', { n }), why: t('manipulation.factorPairs.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <DivisorSet title={t('manipulation.divisorsOf', { n })} values={L.allDivisors(lab)} highlight={new Set(L.allDivisors(lab))} ariaLabel={t('manipulation.divisorsOf', { n })} />
              <EquationDisplay tex={`d^2 \\leq ${n} \\Rightarrow (d,\\ ${n} \\div d)`} tone="result" note={t('manipulation.factorPairs.testUpTo', { n, bound, next: bound + 1 })} />
            </div>
          )}
        />
      )}
      explanation={t('manipulation.factorPairs.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-800">{t('manipulation.factorPairs.colsZone')}</span>
              <span className="text-[11px] text-slate-500">{t('manipulation.dragHint')}</span>
            </div>
            <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.factorPairs.colsZone')}>
              {rail.map((d) => {
                const tested = lab.tested.find((x) => x.d === d);
                return (
                  <NumberTile key={d} value={d} drag={drag} id={`cols:${d}`} label={`${d}`} size="sm"
                    tone={!tested ? (d > bound ? 'dim' : 'neutral') : tested.repeat ? 'remainder' : tested.divides ? 'common' : 'ko'}
                    badge={tested?.divides && !tested.repeat ? '✓' : tested?.repeat ? '↺' : undefined} />
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <DropZone drag={drag} id="board" label={t('manipulation.factorPairs.colsZone')} hint={!placed ? t('manipulation.factorPairs.dropCols') : undefined} minHeight="min-h-[120px]" className="flex items-center justify-center p-3">
              {placed && <RectangleArray n={n} cols={lab.cols} ariaLabel={`${n} = ${lab.cols} × ${lab.rows} + ${lab.rest}`} />}
            </DropZone>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
              <div className="mb-1.5 text-xs font-bold text-slate-700">{t('manipulation.factorPairs.pairsBoard')}</div>
              <ul className="space-y-1" dir="ltr">
                {lab.pairs.length === 0 && <li className="text-xs text-slate-400">—</li>}
                {lab.pairs.map((p) => (
                  <li key={p.key} className="flex items-center gap-1.5 font-mono text-sm">
                    <NumberTile value={p.small} tone="common" size="sm" />
                    <span className="text-slate-500">×</span>
                    <NumberTile value={p.big} tone="common" size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.factorPairs.reject.${reject}`, { n })}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
