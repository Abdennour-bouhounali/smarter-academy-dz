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
import RibbonStrip from '../primitives/RibbonStrip';
import DraggableObject from '../primitives/DraggableObject';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/algorithms';

const { differenceStepTex, pgcdEqualityTex } = divisibility;

/**
 * pgcd-differences — LA MACHINE À SOUSTRAIRE.
 *
 * A. L'élève PORTE le petit RUBAN sur le grand : les ciseaux y coupent sa
 *    longueur. (Le contraire est refusé, avec la raison : « نطرح دائمًا
 *    الأصغر من الأكبر ».) Atelier de couture, thème `workshop`.
 * B. Idée : PGCD(a ; b) = PGCD(b ; a − b) — la plus grande longueur qui
 *    mesure deux rubans mesure aussi ce qui reste après la coupe.
 * C. Les deux rubans sont à la même échelle (RibbonStrip) : la part commune
 *    se coupe sous les yeux, la différence reste.
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

  useEffect(() => { if (state.isFormal) state.report(onFinished, lab.gcd); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // La contrainte de la configuration — une seule définition, lue par le
  // laboratoire libre / le mode classe ET par « أكمل الفروق ».
  // a = b : la seule différence est 0, le PGCD n'est jamais une tuile.
  const validateNumbers = (x) => (
    x.a === x.b ? t('manipulation.diff.equalNumbers')
      : divisibility.differenceSteps(x.a, x.b).steps.length > 30 ? t('manipulation.diff.tooManySteps') : '');

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
      mission={mission ?? t('manipulation.diff.ribbonMission', { a, b })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      validate={validateNumbers}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.diff.hint1'), t('manipulation.diff.hint2'), t('manipulation.diff.hint3')]}
      controller={{
        autoStep: () => { if (L.isDifferencesFinished(lab)) return false; setLab(L.subtract); return true; },
        canAutoStep: () => !L.isDifferencesFinished(lab),
        prevStep: () => setLab(L.undoSubtract),
        canPrev: () => lab.done > 0,
        showSolution: () => { setLab((s) => ({ ...s, done: s.steps.length, pgcdPlaced: true })); state.discover(); state.formalize(); },
        // « أكمل الفروق » (§6bis) : après UNE coupe faite à la main, les
        // suivantes ne sont plus que le même geste. La case PGCD reste vide :
        // reconnaître le dernier fruit non nul est la découverte.
        autoComplete: {
          label: t('manipulation.diff.autoComplete'),
          ready: lab.a === a && lab.b === b && !validateNumbers({ a, b }),
          manualDone: lab.done > 0,
          remaining: L.remainingDifferences(lab),
          step: () => setLab(L.subtract),
          finish: () => setLab(L.completeDifferences),
        },
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
                {/* La dernière ligne ne dit le PGCD qu'une fois que l'élève l'a posé
                    dans sa case : sinon la chaîne donne la réponse avant le geste
                    (« أكمل الفروق » y mène en un clic). Audit du 2026-09-29. */}
                <EquationDisplay tex={isLast ? `\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.pgcdPlaced ? lab.gcd : '\\,?'}` : pgcdEqualityTex(s.big, s.small, nextBig, nextSmall)} tone="muted" size="sm" />
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

          <div className="space-y-2" data-ribbons>
            {/* LE PETIT RUBAN : c'est LUI qu'on porte sur le grand. */}
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs font-bold text-slate-600">{t('manipulation.diff.ribbonSmall')}</span>
              {!finished ? (
                <DraggableObject drag={drag} id="num:small" label={`${t('manipulation.diff.ribbonSmall')} ${pair.small}`} className="flex min-h-[44px] flex-1 items-center gap-2 rounded-xl border-2 border-violet-300 bg-violet-50 px-2 py-1">
                  <NumberTile value={pair.small} tone="divisor" size="sm" />
                  <RibbonStrip value={pair.small} scale={scale} tone="b" height="h-6" className="flex-1" />
                </DraggableObject>
              ) : (
                <div className="flex min-h-[44px] flex-1 items-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 px-2 py-1">
                  <NumberTile value={pair.small} tone="dim" size="sm" />
                  <RibbonStrip value={pair.small} scale={scale} tone="ghost" height="h-6" className="flex-1" />
                </div>
              )}
            </div>

            {/* LE GRAND RUBAN : la zone qui reçoit le petit. Sa longueur est
                déjà découpée en « ce que le petit va couper » + « ce qui
                restera » : la soustraction se voit avant le geste. */}
            <DropZone drag={drag} id="big" label={t('manipulation.diff.ribbonBig')} disabled={finished} minHeight="min-h-[72px]" className="flex items-center gap-2 p-2">
              <span className="w-16 shrink-0 text-xs font-bold text-slate-600">{t('manipulation.diff.ribbonBig')}</span>
              <NumberTile value={pair.big} tone="dividend" size="sm" />
              <RibbonStrip value={pair.big} scale={scale} tone="a" className="flex-1" cut={!finished && pair.big > pair.small}
                segments={pair.small <= pair.big && pair.big > 0 ? [
                  { value: pair.small, tone: 'b', label: t('manipulation.diff.cm', { n: pair.small }) },
                  ...(pair.big - pair.small > 0 ? [{ value: pair.big - pair.small, tone: 'diff', label: t('manipulation.diff.cm', { n: pair.big - pair.small }) }] : []),
                ] : undefined} />
              {!finished && !drag.held && <span className="hidden text-[11px] text-slate-400 sm:inline">{t('manipulation.diff.dropOnBig')}</span>}
            </DropZone>
            {finished && <p className="text-xs font-bold text-emerald-800">{t('manipulation.diff.nothingLeft')}</p>}
          </div>

          {finished && (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-bold text-slate-700">{t('manipulation.diff.piecesTitle')}</div>
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
