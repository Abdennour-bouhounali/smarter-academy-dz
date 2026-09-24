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
import RibbonStrip from '../primitives/RibbonStrip';
import DraggableObject from '../primitives/DraggableObject';
import EquationBuilder from '../primitives/EquationBuilder';
import EquationDisplay from '../primitives/EquationDisplay';
import { Btn } from '../ManipulationTeacherMode';
import * as L from '../logic/algorithms';

const { euclidStepTex, pgcdEqualityTex } = divisibility;

/**
 * euclidean-algorithm — LA MACHINE À DIVISER.
 *
 * A. L'élève REPORTE des copies du petit ruban le long du grand (glisser, ou
 *    les boutons + / −). Quand une copie de plus déborde, il s'arrête.
 *    Même atelier de couture que les différences (thème `workshop`) : la
 *    division est une suite de reports, la soustraction une suite de coupes.
 * B. Idée : a = b × q + r, où q est le NOMBRE DE COPIES qui tiennent et r le
 *    bout qui dépasse.
 * C. Le grand ruban se couvre de copies égales (RibbonStrip) ; le bout non
 *    couvert reste en pointillés, puis le reste apparaît en ambre.
 * D. Émerge : l'égalité se remplit case par case (le q vient du comptage des
 *    copies, le r de ce qui reste), puis l'invariant PGCD(a ; b) = PGCD(b ; r).
 * E. À découvrir : la chaîne des divisions, et le PGCD = DERNIER RESTE NON
 *    NUL. `compareWith="differences"` montre 3 divisions contre 8 différences.
 */
export default function EuclidAlgorithm({
  a: a0, b: b0, title, lead, mission, compareWith, initialMode = 'student', allowModeSwitch = false, answerHiddenByDefault = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'euclidean-algorithm', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3, answerHiddenByDefault });
  const { a, b } = state.numbers;
  const [lab, setLab] = useState(() => L.initEuclid({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.initEuclid({ a, b })); setReject(null); }, [a, b, state.epoch]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId === 'copy' && zoneId === 'dividend') { setLab(L.addCopy); return; }
      if (sourceId.startsWith('rem:') && zoneId === 'carry') { setLab(L.carryRemainder); return; }
      if (sourceId.startsWith('rem:') && zoneId === 'pgcd') {
        const v = Number(sourceId.replace('rem:', ''));
        setLab((s) => ({ ...s, pgcdPlaced: v === s.gcd }));
        state.discover();
      }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId === 'copy') return zoneId === 'dividend' ? L.canAddCopy(lab) : 'invalid';
      const v = Number(sourceId.replace('rem:', ''));
      if (zoneId === 'carry') return L.canCarryRemainder(lab, v);
      if (zoneId === 'pgcd') return L.canPlaceEuclidPgcd(lab, v);
      return 'invalid';
    },
    onReject: (_s, _z, reason) => setReject(reason),
  });

  useEffect(() => { if (state.isFormal) state.report(onFinished, lab.gcd); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // La contrainte de la configuration — une seule définition, lue par le
  // laboratoire libre / le mode classe ET par « أكمل القسمات ».
  const validateNumbers = (x) => (divisibility.euclidSteps(x.a, x.b).steps.length > 12 ? t('manipulation.euclid.tooManySteps') : '');

  const div = L.currentDivision(lab);
  const finished = L.isEuclidFinished(lab);
  const done = lab.steps.slice(0, lab.confirmed);
  const rest = div ? L.remainderOf(lab) : null;
  const quotientReached = L.quotientReached(lab);
  const cmp = compareWith === 'differences' ? L.comparison(a, b) : null;
  const nonZeroRemainders = [...new Set(lab.steps.filter((s) => s.r !== 0).map((s) => s.r))];

  return (
    <ManipulationShell
      type="euclidean-algorithm"
      title={title ?? t('manipulation.euclid.title', { a, b })}
      mission={mission ?? t('manipulation.euclid.ribbonMission', { a, b })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      validate={validateNumbers}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.euclid.hint1'), t('manipulation.euclid.hint2'), t('manipulation.euclid.hint3')]}
      controller={{
        autoStep: () => { if (L.isEuclidFinished(lab)) return false; setLab(L.euclidAutoStep); return true; },
        canAutoStep: () => !L.isEuclidFinished(lab),
        prevStep: () => setLab(L.removeCopy),
        canPrev: () => lab.copies > 0,
        showSolution: () => {
          setLab((s) => { let x = s; let g = 0; while (!L.isEuclidFinished(x) && g++ < 30) x = L.euclidAutoStep(x); return { ...x, pgcdPlaced: true }; });
          state.discover(); state.formalize();
        },
        // « أكمل القسمات » (§6bis) : la PREMIÈRE division se fait à la main —
        // poser les copies, voir le bout qui dépasse, porter le reste. Les
        // suivantes répètent ce geste : le bouton pose les copies une à une
        // et porte les restes, jusqu'au reste nul. La case PGCD reste vide.
        autoComplete: {
          label: t('manipulation.euclid.autoComplete'),
          ready: lab.a === a && lab.b === b && !validateNumbers({ a, b }),
          manualDone: lab.confirmed > 0,
          remaining: L.remainingEuclidGestures(lab),
          step: () => setLab(L.euclidGestureStep),
          finish: () => setLab(L.completeEuclid),
        },
      }}
      controlsOverride={{ prevStep: true }}
      representation={(
        <div className="space-y-2" data-euclid-chain>
          {done.map((s, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-2">
              <EquationDisplay tex={euclidStepTex(s)} tone={s.r === 0 ? 'result' : 'ok'} size="sm" />
              <EquationDisplay tex={s.r === 0 ? `\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.gcd}` : pgcdEqualityTex(s.a, s.b, s.b, s.r)} tone="muted" size="sm"
                note={s.r === 0 ? t('manipulation.euclid.remainderZero') : t('manipulation.euclid.invariant')} />
            </div>
          ))}
          {div && (
            <EquationBuilder
              parts={[
                { text: String(div.a) }, { text: '=' }, { text: String(div.b) }, { text: '×' },
                { slot: 'q', value: lab.copies > 0 ? lab.copies : null, tileTone: 'quotient' },
                { text: '+' }, { slot: 'r', value: quotientReached ? rest : null, tileTone: 'remainder' },
              ]}
              drag={drag}
              slotLabel={(s) => (s === 'q' ? t('manipulation.quotient') : t('manipulation.remainder'))}
            />
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.euclid.discoverPrompt')}
          options={[
            { text: t('manipulation.euclid.opt1'), correct: true },
            { text: t('manipulation.euclid.opt2'), why: t('manipulation.euclid.why2') },
            { text: t('manipulation.euclid.opt3'), why: t('manipulation.euclid.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={`\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.gcd}`} tone="result" size="lg" note={t('manipulation.lastNonZeroRem')} />
              <p className="font-mono text-xs text-slate-600" dir="auto">{t('manipulation.euclid.divisionCount', { count: lab.steps.length })}</p>
              {cmp && (
                <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2" data-euclid-compare>
                  <p className="text-sm font-bold text-amber-900" dir="auto">{t('manipulation.euclid.compare', cmp)}</p>
                  <p className="text-xs text-amber-800">{t('manipulation.euclid.compareQuestion')}</p>
                  <div className="mt-1.5 space-y-1">
                    <QuantityBar value={cmp.differences} scale={cmp.differences} tone="diff" height="h-5" label={`${cmp.differences}`} />
                    <QuantityBar value={cmp.divisions} scale={cmp.differences} tone="unit" height="h-5" label={`${cmp.divisions}`} />
                  </div>
                </div>
              )}
            </div>
          )}
        />
      )}
      explanation={t('manipulation.euclid.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          {div ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {/* LA COPIE : un petit ruban qu'on prend et qu'on reporte. */}
                <DraggableObject drag={drag} id="copy" label={t('manipulation.euclid.copyRibbon', { b: div.b })} className="flex min-h-[44px] w-56 max-w-full items-center gap-2 rounded-xl border-2 border-violet-300 bg-violet-50 px-2 py-1">
                  <NumberTile value={div.b} tone="divisor" size="sm" />
                  <RibbonStrip value={div.b} scale={div.b} tone="b" height="h-6" className="min-w-0 flex-1" />
                </DraggableObject>
                <span className="text-xs text-slate-500">{t('manipulation.dragHint')}</span>
                <span className="ms-auto flex items-center gap-1.5">
                  <Btn small onClick={() => setLab(L.removeCopy)} disabled={lab.copies === 0} ariaLabel={t('manipulation.euclid.removeCopy')}>−</Btn>
                  <span className="font-mono text-xs font-bold text-slate-700" dir="auto">{t('manipulation.euclid.copies', { n: lab.copies })}</span>
                  <Btn small onClick={() => setLab(L.addCopy)} disabled={L.canAddCopy(lab) !== true} ariaLabel={t('manipulation.euclid.addCopy')}>+</Btn>
                </span>
              </div>

              <DropZone drag={drag} id="dividend" label={t('manipulation.euclid.dividendRibbon', { a: div.a })} minHeight="min-h-[84px]" className="space-y-1.5 p-2" data-ribbons>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <NumberTile value={div.a} tone="dividend" size="sm" />
                  <span dir="auto">{t('manipulation.euclid.dividendRibbon', { a: div.a })}</span>
                </div>
                <RibbonStrip value={div.a} scale={div.a} tone="a"
                  ghost={Math.max(0, div.a - lab.copies * div.b - (rest !== null && quotientReached ? rest : 0))}
                  segments={[
                    ...Array.from({ length: Math.min(lab.copies, 30) }, () => ({ value: div.b, tone: 'b', label: lab.copies <= 12 ? t('manipulation.euclid.cm', { n: div.b }) : undefined })),
                    ...(rest !== null && rest > 0 && quotientReached ? [{ value: rest, tone: 'rem', label: t('manipulation.euclid.cm', { n: rest }) }] : []),
                  ]} />
                {quotientReached
                  ? <p className="text-[11px] font-bold text-amber-800">{t('manipulation.euclid.overflow', { a: div.a })}</p>
                  : <p className="text-[11px] text-slate-500">{t('manipulation.euclid.notCovered')}: <span dir="ltr" className="font-mono">{div.a - lab.copies * div.b}</span></p>}
              </DropZone>

              {quotientReached && (
                <div className="flex flex-wrap items-center gap-2">
                  <NumberTile value={rest} drag={drag} id={`rem:${rest}`} label={`${t('manipulation.remainder')} ${rest}`} tone="remainder" />
                  <DropZone drag={drag} id="carry" label={t('manipulation.euclid.carry')} tone="emerald" hint={t('manipulation.euclid.dropCarry')} minHeight="min-h-[56px]" className="min-w-[180px] flex-1" />
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                <div className="mb-1 text-[11px] font-bold text-slate-700">{t('manipulation.euclid.chain')}</div>
                <div dir="ltr" className="flex flex-wrap gap-1.5">
                  {nonZeroRemainders.map((v) => <NumberTile key={v} value={v} drag={drag} id={`rem:${v}`} label={`${v}`} tone="remainder" size="sm" />)}
                  <NumberTile value={0} tone="dim" size="sm" />
                </div>
              </div>
              <DropZone drag={drag} id="pgcd" label={t('manipulation.euclid.pgcdZone')} tone="amber" hint={!lab.pgcdPlaced ? t('manipulation.euclid.dropPgcd') : undefined} minHeight="min-h-[72px]" className="flex flex-col items-center justify-center px-4">
                <div className="text-[11px] font-mono font-bold text-amber-800">PGCD</div>
                {lab.pgcdPlaced && <NumberTile value={lab.gcd} tone="pgcd" size="lg" />}
              </DropZone>
            </div>
          )}

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.euclid.reject.${reject}`)}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>
        {drag.held === 'copy' && div && <NumberTile value={div.b} tone="divisor" />}
        {drag.held?.startsWith('rem:') && <NumberTile value={Number(drag.held.replace('rem:', ''))} tone="remainder" />}
      </DragGhost>
    </ManipulationShell>
  );
}
