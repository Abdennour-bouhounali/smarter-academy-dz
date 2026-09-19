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
import Group from '../primitives/Group';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/commonDivisors';

/**
 * common-divisors — DEUX LABORATOIRES ENCHAÎNÉS.
 *
 * 1) LES BOUQUETS (activité 4). L'élève porte un NOMBRE DE BOUQUETS sur la
 *    table ; les fleurs se répartissent réellement, les restes se voient. Le
 *    rail garde la trace : vert = tombe juste des deux côtés.
 * 2) LES LISTES (activité 5, معارف 3–4). Les diviseurs de a et de b sont des
 *    jetons ; l'élève porte les COMMUNS au milieu — un jeton qui ne divise
 *    qu'un seul côté est refusé AVEC LA RAISON. Puis il porte le plus grand
 *    dans la case PGCD : le 6 de « PGCD(42 ; 60) = 6 » vient de son geste.
 *
 * `context` habille les bouquets avec les mots du manuel (باقة، زهرة حمراء…).
 */
export default function CommonDivisors({
  a: a0, b: b0, title, lead, mission, context, startWith = 'bouquets', initialMode = 'student', allowModeSwitch = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'common-divisors', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { a, b } = state.numbers;
  const [stage, setStage] = useState(startWith);
  const [bouquets, setBouquets] = useState(() => L.initBouquets({ a: a0, b: b0 }));
  const [lists, setLists] = useState(() => L.initLists({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => {
    setBouquets(L.initBouquets({ a, b })); setLists(L.initLists({ a, b })); setStage(startWith); setReject(null);
  }, [a, b, state.epoch, startWith]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId.startsWith('k:')) {
        const k = Number(sourceId.replace('k:', ''));
        setBouquets((s) => {
          const next = L.choose(s, k);
          if (L.bouquetsDiscoveryReady(next)) setStage('lists');
          return next;
        });
        return;
      }
      const d = Number(sourceId.split(':')[1]);
      if (zoneId === 'middle') {
        setLists((s) => L.placeCommon(s, d));
      } else if (zoneId === 'pgcd') {
        setLists((s) => { const next = L.placePgcd(s, d); if (L.listsDiscoveryReady(next)) state.discover(); return next; });
      }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId.startsWith('k:')) return zoneId === 'table' ? L.canChoose(bouquets, Number(sourceId.replace('k:', ''))) : 'invalid';
      const d = Number(sourceId.split(':')[1]);
      if (zoneId === 'middle') return L.canPlaceCommon(lists, d);
      if (zoneId === 'pgcd') return L.canPlacePgcd(lists, d);
      return 'invalid';
    },
    onReject: (sourceId, _z, reason) => setReject({ reason, d: Number(sourceId.split(':')[1]) }),
  });

  useEffect(() => { if (state.isFormal) onFinished?.(lists.g); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const heldValue = drag.held ? Number(drag.held.split(':')[1]) : null;
  const rail = Array.from({ length: Math.min(24, Math.min(a, b)) }, (_, i) => i + 1);
  const gLabel = context ? t('manipulation.common.perBouquet', { qa: bouquets.qa, qb: bouquets.qb }) : null;

  return (
    <ManipulationShell
      type="common-divisors"
      title={title ?? t('manipulation.common.title', { a, b })}
      mission={mission ?? (stage === 'bouquets' ? t('manipulation.common.mission', { a, b }) : t('manipulation.common.listsMission', { a, b }))}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.common.hint1'), t('manipulation.common.hint2'), t('manipulation.common.hint3')]}
      controller={{
        autoStep: () => {
          if (stage === 'bouquets') {
            const next = rail.find((k) => bouquets.tried[k] === undefined);
            if (next === undefined) { setStage('lists'); return true; }
            setBouquets((s) => { const x = L.choose(s, next); if (L.bouquetsDiscoveryReady(x)) setStage('lists'); return x; });
            return true;
          }
          if (!L.allCommonPlaced(lists)) {
            const d = lists.common.find((x) => !lists.placed.includes(x));
            setLists((s) => L.placeCommon(s, d));
            return true;
          }
          if (lists.pgcd === null) { setLists((s) => { const x = L.placePgcd(s, s.g); state.discover(); return x; }); return true; }
          return false;
        },
        canAutoStep: () => stage === 'bouquets' || lists.pgcd === null,
        showSolution: () => {
          setStage('lists');
          setLists((s) => { let x = s; for (const d of s.common) x = L.placeCommon(x, d); x = L.placePgcd(x, x.g); return x; });
          state.discover(); state.formalize();
        },
      }}
      representation={(
        <div className="space-y-2">
          {stage === 'bouquets' && bouquets.k !== null && (
            <EquationDisplay tex={`${a} = ${bouquets.k} \\times ${bouquets.qa} + ${bouquets.ra} \\quad ${b} = ${bouquets.k} \\times ${bouquets.qb} + ${bouquets.rb}`} size="sm"
              tone={bouquets.works ? 'ok' : 'neutral'}
              note={bouquets.works ? t('manipulation.common.worksAll', { k: bouquets.k, a, b }) : t('manipulation.common.leftOver', { ra: bouquets.ra, rb: bouquets.rb })} />
          )}
          {stage === 'lists' && lists.placed.length > 0 && (
            <EquationDisplay tex={`\\text{diviseurs communs} = \\{${lists.placed.join(' ; ')}\\}`} tone={L.allCommonPlaced(lists) ? 'ok' : 'neutral'} size="sm" />
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.common.discoverPrompt')}
          options={[
            { text: t('manipulation.common.opt1'), correct: true },
            { text: t('manipulation.common.opt2', { a }), why: t('manipulation.common.why2', { b }) },
            { text: t('manipulation.common.opt3'), why: t('manipulation.common.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={`\\mathrm{PGCD}(${a}\\ ;\\ ${b}) = ${lists.g}`} tone="result" size="lg" />
              <p className="text-sm text-slate-700">{t('manipulation.common.conclusion')}</p>
            </div>
          )}
        />
      )}
      explanation={t('manipulation.common.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        {stage === 'bouquets' ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-slate-800">{t('manipulation.common.bouquetsZone')}</span>
                <span className="text-[11px] text-slate-500">{t('manipulation.dragHint')}</span>
              </div>
              <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.common.bouquetsZone')}>
                {rail.map((k) => (
                  <DivisorChip key={k} value={k} drag={drag} id={`k:${k}`} label={`${k}`}
                    state={bouquets.tried[k] === 'common' ? 'common' : bouquets.tried[k] === 'single' ? 'single' : bouquets.tried[k] === 'no' ? 'no' : 'idle'}
                    badge={bouquets.tried[k] === 'common' ? '✓' : undefined} />
                ))}
              </div>
            </div>
            <DropZone drag={drag} id="table" label={t('manipulation.common.bouquetsZone')} hint={bouquets.k === null ? t('manipulation.common.dropCount') : undefined} minHeight="min-h-[130px]" className="p-3">
              {bouquets.k !== null && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                    <span className={bouquets.works ? 'text-emerald-700' : 'text-amber-800'}>{gLabel ?? t('manipulation.common.perBouquet', { qa: bouquets.qa, qb: bouquets.qb })}</span>
                    {!bouquets.works && <span className="text-amber-800">{t('manipulation.common.leftOver', { ra: bouquets.ra, rb: bouquets.rb })}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {Array.from({ length: Math.min(bouquets.k, 18) }, (_, i) => (
                      <Group key={i} tone={bouquets.works ? 'emerald' : 'slate'} identical={bouquets.works} className="min-w-[46px]">
                        <div className="flex flex-col items-center gap-0.5 font-mono text-[11px]">
                          <span className="text-rose-600">●{bouquets.qa}</span>
                          <span className="text-slate-500">○{bouquets.qb}</span>
                        </div>
                      </Group>
                    ))}
                    {bouquets.k > 18 && <span className="self-center text-xs text-slate-500">+{bouquets.k - 18}</span>}
                  </div>
                  {(bouquets.ra > 0 || bouquets.rb > 0) && (
                    <Group tone="amber" title={t('manipulation.common.leftOver', { ra: bouquets.ra, rb: bouquets.rb })} identical={false}>
                      <div className="font-mono text-[11px] text-amber-900" dir="ltr">●{bouquets.ra} ○{bouquets.rb}</div>
                    </Group>
                  )}
                </div>
              )}
            </DropZone>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {[{ side: 'a', n: a, list: lists.da }, { side: 'b', n: b, list: lists.db }].map(({ side, n, list }) => (
                <div key={side} className="rounded-2xl border-2 border-slate-200 bg-white p-2">
                  <div className="mb-1 text-xs font-bold text-slate-700">{t('manipulation.divisorsOf', { n })}</div>
                  <div dir="ltr" className="flex flex-wrap gap-1.5">
                    {list.map((d) => (
                      <DivisorChip key={`${side}${d}`} value={d} drag={drag} id={`${side}:${d}`} label={`${d}`}
                        state={lists.placed.includes(d) ? 'common' : 'idle'} disabled={lists.placed.includes(d)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <DropZone drag={drag} id="middle" label={t('manipulation.common.middleZone')} tone="emerald" hint={lists.placed.length === 0 ? t('manipulation.common.dropCommon') : undefined} minHeight="min-h-[72px]" className="p-2">
                <div className="mb-1 text-[11px] font-bold text-emerald-800">{t('manipulation.common.middleZone')}</div>
                <div dir="ltr" className="flex flex-wrap gap-1.5">
                  {lists.placed.map((d) => (
                    <DivisorChip key={`m${d}`} value={d} drag={lists.pgcd === null ? drag : undefined} id={`m:${d}`} label={`${d}`} state={lists.pgcd === d ? 'pgcd' : 'common'} />
                  ))}
                </div>
              </DropZone>
              <DropZone drag={drag} id="pgcd" label={t('manipulation.common.pgcdZone')} tone="amber" hint={lists.pgcd === null ? t('manipulation.common.dropGreatest') : undefined} minHeight="min-h-[72px]" className="flex flex-col items-center justify-center px-4">
                <div className="text-[11px] font-mono font-bold text-amber-800">PGCD</div>
                {lists.pgcd !== null && <NumberTile value={lists.pgcd} tone="pgcd" size="lg" />}
              </DropZone>
            </div>
          </div>
        )}

        {reject && (
          <p role="status" className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {t(`manipulation.common.listReject.${reject.reason}`, { d: reject.d, a, b, defaultValue: t('manipulation.common.reject.tooMany') })}
          </p>
        )}
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
