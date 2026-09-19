import React, { useEffect, useState } from 'react';
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
import QuantityBar from '../primitives/QuantityBar';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/algorithms';

const { differenceStepTex, pgcdEqualityTex } = divisibility;

/**
 * pgcd-differences — LA MACHINE À SOUSTRAIRE.
 *
 * A. L'élève PORTE le petit nombre sur le grand. (Le contraire est refusé,
 *    avec la raison : « نطرح دائمًا الأصغر من الأكبر ».)
 * B. Idée : PGCD(a ; b) = PGCD(b ; a − b).
 * C. Les deux barres sont à la même échelle : la part commune s'annule sous
 *    les yeux, la différence reste.
 * D. Émerge : la ligne « 252 − 140 = 112 » et, à côté, l'invariant qui ne
 *    change pas d'un maillon à l'autre.
 * E. À découvrir : la chaîne s'arrête au fruit nul, et le PGCD est le
 *    DERNIER FRUIT NON NUL — l'élève le porte lui-même dans la case PGCD.
 */
export default function DifferenceAlgorithm({
  a: a0, b: b0, title, lead, mission, initialMode = 'student', allowModeSwitch = false, answerHiddenByDefault = false, showStepCount = true, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'pgcd-differences', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3, answerHiddenByDefault });
  const { a, b } = state.numbers;
  const [lab, setLab] = useState(() => L.initDifferences({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.initDifferences({ a, b })); setReject(null); }, [a, b, state.epoch]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (zoneId === 'big' && sourceId === 'num:small') { setLab(L.subtract); return; }
      if (zoneId === 'pgcd') {
        const v = Number(sourceId.replace('diff:', ''));
        setLab((s) => ({ ...s, pgcdPlaced: v === s.gcd }));
        state.discover();
      }
    },
    accepts: (sourceId, zoneId) => {
      if (zoneId === 'big') return L.canSubtract(lab, sourceId.replace('num:', ''), 'big');
      if (zoneId === 'pgcd') return L.canPlaceDifferencePgcd(lab, Number(sourceId.replace('diff:', '')));
      return 'invalid';
    },
    onReject: (_s, _z, reason) => setReject(reason),
  });

  useEffect(() => { if (state.isFormal) onFinished?.(lab.gcd); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const pair = L.currentPair(lab);
  const finished = L.isDifferencesFinished(lab);
  const shown = lab.steps.slice(0, lab.done);
  const scale = Math.max(a, b);
  const nonZero = [...new Set(shown.filter((s) => s.diff !== 0).map((s) => s.diff))];
  const heldLabel = drag.held === 'num:small' ? pair.small : drag.held?.startsWith('diff:') ? Number(drag.held.replace('diff:', '')) : null;

  return (
    <ManipulationShell
      type="pgcd-differences"
      title={title ?? t('manipulation.diff.title', { a, b })}
      mission={mission ?? t('manipulation.diff.mission')}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      validate={(x) => (divisibility.differenceSteps(x.a, x.b).steps.length > 30 ? t('manipulation.diff.tooManySteps') : '')}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.diff.hint1'), t('manipulation.diff.hint2'), t('manipulation.diff.hint3')]}
      controller={{
        autoStep: () => { if (L.isDifferencesFinished(lab)) return false; setLab(L.subtract); return true; },
        canAutoStep: () => !L.isDifferencesFinished(lab),
        prevStep: () => setLab(L.undoSubtract),
        canPrev: () => lab.done > 0,
        showSolution: () => { setLab((s) => ({ ...s, done: s.steps.length, pgcdPlaced: true })); state.discover(); state.formalize(); },
      }}
      controlsOverride={{ prevStep: true }}
      representation={shown.length > 0 && (
        <ol className="space-y-1.5" data-difference-chain>
          {shown.map((s, i) => {
            const isLast = i === lab.steps.length - 1;
            const nextBig = Math.max(s.small, s.diff); const nextSmall = Math.min(s.small, s.diff);
            return (
              <li key={i} className="grid gap-2 md:grid-cols-2">
                <EquationDisplay tex={differenceStepTex(s)} tone={s.diff === 0 ? 'result' : i === shown.length - 1 ? 'active' : 'neutral'} size="sm" />
                <EquationDisplay tex={isLast ? `\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.gcd}` : pgcdEqualityTex(s.big, s.small, nextBig, nextSmall)} tone="muted" size="sm" />
              </li>
            );
          })}
        </ol>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.diff.discoverPrompt')}
          options={[
            { text: t('manipulation.diff.opt1'), correct: true },
            { text: t('manipulation.diff.opt2'), why: t('manipulation.diff.why2', { first: lab.steps[0]?.diff }) },
            { text: t('manipulation.diff.opt3'), why: t('manipulation.diff.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={`\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.gcd}`} tone="result" size="lg" note={t('manipulation.lastNonZeroDiff')} />
              {showStepCount && <p className="font-mono text-xs text-slate-600" dir="auto">{t('manipulation.diff.steps', { count: lab.steps.length })}</p>}
            </div>
          )}
        />
      )}
      explanation={t('manipulation.diff.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          <p className="text-xs text-slate-500">{t('manipulation.dragHint')}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs font-bold text-slate-600">{t('manipulation.diff.small')}</span>
              {!finished ? (
                <NumberTile value={pair.small} drag={drag} id="num:small" label={`${t('manipulation.diff.small')} ${pair.small}`} tone="divisor" />
              ) : <NumberTile value={pair.small} tone="dim" />}
              <QuantityBar value={pair.small} scale={scale} tone="b" className="flex-1" label={String(pair.small)} />
            </div>

            <DropZone drag={drag} id="big" label={t('manipulation.diff.big')} disabled={finished} minHeight="min-h-[64px]" className="flex items-center gap-2 p-2">
              <span className="w-16 shrink-0 text-xs font-bold text-slate-600">{t('manipulation.diff.big')}</span>
              <NumberTile value={pair.big} tone="dividend" />
              <QuantityBar value={pair.big} scale={scale} tone="a" className="flex-1"
                segments={pair.small <= pair.big && pair.big > 0 ? [
                  { value: pair.small, tone: 'b', label: String(pair.small) },
                  ...(pair.big - pair.small > 0 ? [{ value: pair.big - pair.small, tone: 'diff', label: String(pair.big - pair.small) }] : []),
                ] : undefined} />
              {!finished && !drag.held && <span className="text-[11px] text-slate-400">{t('manipulation.diff.dropOnBig')}</span>}
            </DropZone>
          </div>

          {finished && (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-bold text-slate-700">{t('manipulation.diff.chain')}</div>
                <div dir="ltr" className="flex flex-wrap gap-1.5">
                  {nonZero.map((v) => <NumberTile key={v} value={v} drag={drag} id={`diff:${v}`} label={`${v}`} tone="quotient" size="sm" />)}
                  <NumberTile value={0} tone="dim" size="sm" />
                </div>
              </div>
              <DropZone drag={drag} id="pgcd" label={t('manipulation.diff.pgcdZone')} tone="amber" hint={!lab.pgcdPlaced ? t('manipulation.diff.dropPgcd') : undefined} minHeight="min-h-[72px]" className="flex flex-col items-center justify-center px-4">
                <div className="text-[11px] font-mono font-bold text-amber-800">PGCD</div>
                {lab.pgcdPlaced && <NumberTile value={lab.gcd} tone="pgcd" size="lg" />}
              </DropZone>
            </div>
          )}

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.diff.reject.${reject}`)}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldLabel !== null && <NumberTile value={heldLabel} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
