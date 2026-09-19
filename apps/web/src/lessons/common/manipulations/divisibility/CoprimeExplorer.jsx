import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import NumberTile from '../primitives/NumberTile';
import DivisorChip from '../primitives/DivisorChip';
import DragGhost from '../primitives/DragGhost';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/coprime';

/**
 * coprime-explorer — LE LABORATOIRE DE L'INTERSECTION VIDE (sauf 1).
 *
 * A. L'élève porte au MILIEU les diviseurs qui divisent les DEUX nombres.
 * B. Idée : « أوليان فيما بينهما » ⇔ le seul habitant du milieu est 1.
 * C. Un jeton qui ne divise qu'un côté est refusé AVEC sa raison ; les jetons
 *    posés quittent leur liste et s'installent au centre.
 * D. Émerge : la liste du milieu, puis PGCD(a ; b) = 1 (ou le diviseur ≠ 1
 *    qui réfute, comme le 9 que مريم n'avait pas vu pour 27 et 36).
 * E. À découvrir : ce n'est pas « chacun est premier », c'est une propriété
 *    du COUPLE.
 */
export default function CoprimeExplorer({
  a: a0, b: b0, title, lead, mission, initialMode = 'student', allowModeSwitch = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'coprime-explorer', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { a, b } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.init({ a, b })); setReject(null); }, [a, b, state.epoch]);

  const drag = useDragInteraction({
    onDrop: (sourceId) => { setReject(null); setLab((s) => L.share(s, sourceId)); },
    accepts: (sourceId, zoneId) => (zoneId === 'shared' ? L.canShare(lab, sourceId) : 'invalid'),
    onReject: (sourceId, _z, reason) => setReject({ reason, d: L.parseChip(sourceId).d }),
  });

  const check = () => {
    setLab((s) => { const next = L.check(s); if (L.allShared(next)) state.discover(); return next; });
  };

  useEffect(() => { if (state.isFormal) onFinished?.(L.isCoprime(lab)); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const coprime = L.isCoprime(lab);
  const heldValue = drag.held ? L.parseChip(drag.held).d : null;
  const extra = lab.common.filter((d) => d > 1);

  return (
    <ManipulationShell
      type="coprime-explorer"
      title={title ?? t('manipulation.coprime.title', { a, b })}
      mission={mission ?? t('manipulation.coprime.mission', { a, b })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.coprime.hint1'), t('manipulation.coprime.hint2'), t('manipulation.coprime.hint3')]}
      onCheck={check}
      checkDisabled={lab.shared.length === 0 || state.isDiscovered}
      controller={{
        autoStep: () => {
          const d = lab.common.find((x) => !lab.shared.includes(x));
          if (d === undefined) { if (!state.isDiscovered) { setLab(L.check); state.discover(); return true; } return false; }
          setLab((s) => L.share(s, L.chipId('a', d)));
          return true;
        },
        canAutoStep: () => !L.allShared(lab) || !state.isDiscovered,
        showSolution: () => { setLab((s) => { let x = s; for (const d of s.common) x = L.share(x, L.chipId('a', d)); return L.check(x); }); state.discover(); state.formalize(); },
      }}
      representation={lab.shared.length > 0 && (
        <EquationDisplay
          tex={`\\text{communs} = \\{${lab.shared.join(' ; ')}\\}`}
          tone={L.allShared(lab) ? (coprime ? 'ok' : 'result') : 'neutral'}
          size="sm"
          note={L.allShared(lab) && coprime ? t('manipulation.coprime.onlyOne') : undefined}
        />
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.coprime.discoverPrompt', { a, b })}
          options={coprime ? [
            { text: t('manipulation.coprime.opt1'), correct: true },
            { text: t('manipulation.coprime.opt2'), why: t('manipulation.coprime.why2') },
            { text: t('manipulation.coprime.opt3'), why: t('manipulation.coprime.why3') },
          ] : [
            { text: t('manipulation.coprime.notOpt1'), correct: true },
            { text: t('manipulation.coprime.notOpt2'), why: t('manipulation.coprime.notWhy2', { list: extra.join(' ، ') }) },
            { text: t('manipulation.coprime.notOpt3'), why: t('manipulation.coprime.notWhy3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={`\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lab.g}`} tone="result" size="lg"
                note={coprime ? t('manipulation.coprime') : t('manipulation.notCoprime')} />
              {!coprime && <p className="text-sm text-slate-700">{t('manipulation.coprime.commonNotOne', { list: extra.join(' ، ') })}</p>}
            </div>
          )}
        />
      )}
      explanation={t('manipulation.coprime.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          <p className="text-xs text-slate-500">{t('manipulation.dragHint')}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ side: 'a', n: a, list: lab.da }, { side: 'b', n: b, list: lab.db }].map(({ side, n, list }) => (
              <div key={side} className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <NumberTile value={n} tone={side === 'a' ? 'dividend' : 'divisor'} size="sm" /> {t('manipulation.divisorsOf', { n })}
                </div>
                <div dir="ltr" className="flex flex-wrap gap-1.5">
                  {list.map((d) => (
                    <DivisorChip key={`${side}${d}`} value={d} drag={drag} id={L.chipId(side, d)} label={`${d}`}
                      state={lab.shared.includes(d) ? 'common' : 'idle'} disabled={lab.shared.includes(d)} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DropZone drag={drag} id="shared" label={t('manipulation.coprime.sharedZone')} tone="emerald"
            hint={lab.shared.length === 0 ? t('manipulation.coprime.dropShared') : undefined} minHeight="min-h-[76px]" className="p-2">
            <div className="mb-1 text-[11px] font-bold text-emerald-800">{t('manipulation.coprime.sharedZone')}</div>
            <div dir="ltr" className="flex flex-wrap gap-1.5">
              {lab.shared.map((d) => <DivisorChip key={`s${d}`} value={d} state={d === lab.g && lab.g > 1 ? 'pgcd' : 'common'} />)}
            </div>
          </DropZone>

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.coprime.reject.${reject.reason}`, { d: reject.d, a, b })}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
