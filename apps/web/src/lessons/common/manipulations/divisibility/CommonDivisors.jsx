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
import GroupingScene from '../primitives/GroupingScene';
import { themeWords } from '../themeWords';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/commonDivisors';

/**
 * common-divisors — les groupes, puis (au niveau متقدم) les listes.
 *
 * LE FLUX SUIT LE NIVEAU (décision du propriétaire, 2026-09-24) :
 *   مبتدئ   les GROUPES seulement. Poser le plus grand nombre de groupes qui
 *           tombe juste (6 pour 12 et 18) ouvre la découverte — PGCD trouvé
 *           par le geste, sans second laboratoire.
 *   متقدم   les groupes, puis les LISTES. Le passage est un GESTE de l'élève :
 *           une carte « وجدت أكبر عدد… » et un bouton ; un lien ramène aux
 *           groupes. Rien ne bascule tout seul — l'ancien seuil « deux ✓ et
 *           un ✗ » remplaçait la scène par une autre après trois essais, sans
 *           un mot.
 *   startWith="lists"  les listes seulement (un exemple du manuel sur les
 *           listes, ex. 28 et 42 dans معارف).
 *
 * 1) LES BOUQUETS (activité 4). L'élève porte un NOMBRE DE BOUQUETS sur la
 *    table ; les fleurs se répartissent réellement, les restes se voient. Le
 *    rail garde la trace : vert = tombe juste des deux côtés.
 * 2) LES LISTES (activité 5, معارف 3–4). Les diviseurs de a et de b sont des
 *    jetons ; l'élève porte les COMMUNS au milieu — un jeton qui ne divise
 *    qu'un seul côté est refusé AVEC LA RAISON. Puis il porte le plus grand
 *    dans la case PGCD : le 6 de « PGCD(42 ; 60) = 6 » vient de son geste.
 *
 * `theme` choisit les OBJETS DESSINÉS de la scène des groupes (fleurs rouges
 * et blanches, ballons et maillots, stylos et cahiers — primitives/itemThemes)
 * et `context` peut en remplacer les mots par ceux de la SITUATION du manuel
 * (باقة، زهرة حمراء، زهرة بيضاء). Ni l'un ni l'autre ne touche à une
 * mathématique : la répartition, les restes et les verdicts viennent de
 * logic/commonDivisors → core. Les groupes sont de vrais cadres contenant de
 * vrais objets (`GroupingScene`) : « متماثلة » se voit, et le reste est un
 * nombre d'objets dessinés en dehors, jamais une décimale.
 */
export default function CommonDivisors({
  a: a0, b: b0, title, lead, mission, context, theme = 'garden', startWith = 'bouquets', initialMode = 'student', allowModeSwitch = false, onFinished,
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

  // مبتدئ : les groupes SEULEMENT (voir l'en-tête).
  const groupsOnly = startWith !== 'lists' && state.level !== 'advanced';
  const groupsDone = L.greatestGroupFound(bouquets);
  // `state.epoch` dans les dépendances : `setNumbers` remet la phase à 'act',
  // la découverte doit être ré-affirmée sur la scène qui l'a méritée.
  useEffect(() => {
    if (groupsOnly && stage === 'bouquets' && groupsDone) state.discover();
  }, [groupsOnly, stage, groupsDone, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId.startsWith('k:')) {
        const k = Number(sourceId.replace('k:', ''));
        setBouquets((s) => L.choose(s, k));
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

  useEffect(() => { if (state.isFormal) state.report(onFinished, lists.g); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const heldValue = drag.held ? Number(drag.held.split(':')[1]) : null;
  const rail = L.groupRail({ a, b });
  // Les mots de la scène : ceux du thème (lesson.json), remplacés par ceux
  // de la situation du manuel quand la leçon les fournit (`context`).
  const words = themeWords(t, theme, context);
  const gLabel = t('manipulation.common.perGroup', { group: words.group, qa: bouquets.qa, qb: bouquets.qb, itemA: words.itemA, itemB: words.itemB });

  return (
    <ManipulationShell
      type="common-divisors"
      title={title ?? t('manipulation.common.title', { a, b })}
      mission={mission ?? (stage === 'bouquets'
        ? t('manipulation.common.missionGreatestGroups', { a, b, itemA: words.itemsA, itemB: words.itemsB })
        : t('manipulation.common.listsMission', { a, b }))}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      allowModeSwitch={allowModeSwitch}
      hints={stage === 'bouquets'
        ? [t('manipulation.common.groupsHint1'), t('manipulation.common.groupsHint2', { a, b }), t('manipulation.common.groupsHint3')]
        : [t('manipulation.common.hint2'), t('manipulation.common.hint3')]}
      controller={{
        autoStep: () => {
          if (stage === 'bouquets') {
            if (groupsDone) {
              if (groupsOnly) return false;
              setStage('lists');
              return true;
            }
            const next = rail.find((k) => bouquets.tried[k] === undefined) ?? lists.g;
            setBouquets((s) => L.choose(s, next));
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
        canAutoStep: () => (stage === 'bouquets' ? !(groupsOnly && groupsDone) : lists.pgcd === null),
        showSolution: () => {
          if (groupsOnly) {
            setBouquets((s) => L.choose(s, lists.g));
            state.discover(); state.formalize();
            return;
          }
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
              note={bouquets.works
                ? `${words.allUsed} ${t('manipulation.common.worksAll', { k: bouquets.k, a, b }).replace(/^[^:]*: /, '')}`
                : t('manipulation.common.leftOverItems', { ra: bouquets.ra, rb: bouquets.rb, itemA: words.itemsA, itemB: words.itemsB })} />
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
                <span className="text-sm font-bold text-slate-800">{t('manipulation.common.groupsZone', { group: words.group })}</span>
                <span className="text-[11px] text-slate-500">{t('manipulation.dragHint')}</span>
              </div>
              <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.common.groupsZone', { group: words.group })}>
                {rail.map((k) => (
                  <DivisorChip key={k} value={k} drag={drag} id={`k:${k}`} label={`${k}`}
                    state={bouquets.tried[k] === 'common' ? 'common' : bouquets.tried[k] === 'single' ? 'single' : bouquets.tried[k] === 'no' ? 'no' : 'idle'}
                    badge={bouquets.tried[k] === 'common' ? '✓' : undefined} />
                ))}
              </div>
            </div>
            <DropZone drag={drag} id="table" label={t('manipulation.common.groupsZone', { group: words.group })} minHeight="min-h-[150px]" className="p-3" data-groups-table>
              {/* LA TABLE : avant tout choix, les deux piles entières ; après,
                  k cadres identiques et, à part, ce qui n'est entré nulle
                  part. Tout est dessiné — le reste se compte des yeux. */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700">{words.scene}</span>
                {bouquets.k === null
                  ? <span className="text-slate-500">{t('manipulation.common.pileHint')}</span>
                  : <span className={bouquets.works ? 'text-emerald-700' : 'text-amber-800'}>{gLabel}</span>}
              </div>
              <GroupingScene
                a={a} b={b} k={bouquets.k} theme={theme} words={words}
                ariaLabel={bouquets.k === null ? `${a} ${words.itemsA} · ${b} ${words.itemsB}` : `${a} = ${bouquets.k} × ${bouquets.qa} + ${bouquets.ra} · ${b} = ${bouquets.k} × ${bouquets.qb} + ${bouquets.rb}`}
              />
            </DropZone>
            {!groupsOnly && groupsDone && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-3" data-common-next>
                <p className="text-sm font-bold text-emerald-900">{t('manipulation.common.groupsDone', { g: lists.g, a, b })}</p>
                <button type="button" onClick={() => setStage('lists')}
                  className="min-h-[44px] rounded-xl bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  {t('manipulation.common.toLists')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {startWith !== 'lists' && (
              <button type="button" onClick={() => setStage('bouquets')} data-common-back
                className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-400">
                {t('manipulation.common.backToGroups')}
              </button>
            )}
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
