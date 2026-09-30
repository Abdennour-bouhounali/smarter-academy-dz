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
import DraggableObject from '../primitives/DraggableObject';
import GroupStock, { GroupWrapper } from '../primitives/GroupStock';
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
 * 1) LES BOUQUETS (activité 4). L'élève AJOUTE UN GROUPE à la fois : il tire
 *    un emballage vide de la réserve (« أغلفة الباقات ») jusqu'à la table, et
 *    toutes les fleurs se redistribuent dans les k groupes ; il en rend un à
 *    la réserve pour revenir en arrière. Les restes se voient, dans leurs
 *    couleurs. (Depuis le 2026-09-30 — avant, il portait un NOMBRE d'un rail
 *    1…24 : une calculatrice déguisée, où l'on sautait sur 18 d'un coup.)
 *
 *    FICHE (MANIPULATION_DNA §7) — variable : k, le nombre de groupes, tenu
 *    comme des emballages posés ; invariant : a et b objets, tous les
 *    groupes identiques ; résistance : ce qui ne rentre pas reste dehors, en
 *    couleur ; contraste : en montant de 1 en 1, ✓ et ✗ alternent ; la
 *    découverte « le plus grand » exige d'avoir vu le suivant échouer
 *    (`greatestGroupFound`), jamais un saut chanceux.
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
  // La scène porte l'`epoch` pour lequel elle a été construite : voir l'effet
  // de découverte plus bas.
  const [bouquets, setBouquets] = useState(() => ({ ...L.initBouquets({ a: a0, b: b0 }), epoch: 0 }));
  const [lists, setLists] = useState(() => L.initLists({ a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => {
    setBouquets({ ...L.initBouquets({ a, b }), epoch: state.epoch }); setLists(L.initLists({ a, b })); setStage(startWith); setReject(null);
  }, [a, b, state.epoch, startWith]);

  // مبتدئ : les groupes SEULEMENT (voir l'en-tête).
  const groupsOnly = startWith !== 'lists' && state.level !== 'advanced';
  const groupsDone = L.greatestGroupFound(bouquets);
  // `state.epoch` dans les dépendances : `setNumbers` remet la phase à 'act',
  // la découverte doit être ré-affirmée sur la scène qui l'a méritée.
  // Sur « إعادة », les deux effets tournent dans le MÊME commit : celui-ci
  // voyait encore l'ancienne scène (le plus grand groupe posé) et rouvrait la
  // découverte sur une scène vide. Une scène d'un autre epoch ne compte pas.
  useEffect(() => {
    if (groupsOnly && stage === 'bouquets' && groupsDone && bouquets.epoch === state.epoch) state.discover();
  }, [groupsOnly, stage, groupsDone, state.epoch, bouquets.epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId === 'group:add') { setBouquets((s) => L.addGroup(s)); return; }
      if (sourceId === 'group:remove') { setBouquets((s) => L.removeGroup(s)); return; }
      const d = Number(sourceId.split(':')[1]);
      if (zoneId === 'middle') {
        setLists((s) => L.placeCommon(s, d));
      } else if (zoneId === 'pgcd') {
        setLists((s) => L.placePgcd(s, d));
      }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId === 'group:add') return zoneId === 'table' ? L.canChoose(bouquets, (bouquets.k ?? 0) + 1) : '';
      if (sourceId === 'group:remove') return zoneId === 'stock' ? (bouquets.k === null ? 'empty' : true) : '';
      const d = Number(sourceId.split(':')[1]);
      if (zoneId === 'middle') return L.canPlaceCommon(lists, d);
      if (zoneId === 'pgcd') return L.canPlacePgcd(lists, d);
      return 'invalid';
    },
    onReject: (sourceId, _z, reason) => setReject(sourceId.startsWith('group:') ? { reason, groups: true } : { reason, d: Number(sourceId.split(':')[1]) }),
  });

  // Les listes : la découverte suit la case PGCD remplie — dans un effet,
  // jamais dans un updater d'état (playbook §10.10).
  const listsReady = stage === 'lists' && L.listsDiscoveryReady(lists);
  useEffect(() => { if (listsReady) state.discover(); }, [listsReady, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, lists.g); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const heldValue = drag.held ? Number(drag.held.split(':')[1]) : null;
  // Les mots de la scène : ceux du thème (lesson.json), remplacés par ceux
  // de la situation du manuel quand la leçon les fournit (`context`).
  const words = themeWords(t, theme, context);
  const gLabel = t('manipulation.common.perGroup', { group: words.group, qa: bouquets.qa, qb: bouquets.qb, itemA: words.itemA, itemB: words.itemB });
  const g = lists.g;
  // Le plus grand qui marche a été posé, mais rien au-delà n'a été vu :
  // l'élève est invité à ajouter un groupe de plus (pas de saut chanceux).
  const needBeyond = bouquets.tried[g] === 'common' && !groupsDone;
  const addGroup = () => { setReject(null); setBouquets((s) => L.addGroup(s)); };
  const removeGroup = () => { setReject(null); setBouquets((s) => L.removeGroup(s)); };
  const wrapper = <GroupWrapper theme={theme} />;

  return (
    <ManipulationShell
      type="common-divisors"
      title={title ?? t('manipulation.common.title', { a, b })}
      mission={mission ?? (stage === 'bouquets'
        ? t('manipulation.common.missionGreatestGroups', { groups: words.groups })
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
            setBouquets((s) => L.addGroup(s));
            return true;
          }
          if (!L.allCommonPlaced(lists)) {
            const d = lists.common.find((x) => !lists.placed.includes(x));
            setLists((s) => L.placeCommon(s, d));
            return true;
          }
          if (lists.pgcd === null) { setLists((s) => L.placePgcd(s, s.g)); return true; }
          return false;
        },
        canAutoStep: () => (stage === 'bouquets' ? !(groupsOnly && groupsDone) : lists.pgcd === null),
        showSolution: () => {
          if (groupsOnly) {
            setBouquets((s) => L.choose(L.choose(s, lists.g + 1 <= Math.min(a, b) ? lists.g + 1 : lists.g), lists.g));
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
            <EquationDisplay tex={`\\{${lists.placed.join(' ; ')}\\}`} note={t('manipulation.commonDivisorsLabel')} tone={L.allCommonPlaced(lists) ? 'ok' : 'neutral'} size="sm" />
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
            {/* LA RÉSERVE : on TIRE un emballage vide vers la table (ou on en
                rend un) ; − / + font le même geste sans glisser. */}
            <GroupStock drag={drag} theme={theme} words={words} k={bouquets.k} tried={bouquets.tried}
              canAdd={L.canChoose(bouquets, (bouquets.k ?? 0) + 1) === true} onAdd={addGroup} onRemove={removeGroup} />
            <DropZone drag={drag} id="table" label={t('manipulation.common.groupsZone', { group: words.group })} minHeight="min-h-[150px]" className="p-3" data-groups-table>
              {/* LA TABLE : avant tout choix, les deux piles entières ; après,
                  k cadres identiques et, à part, ce qui n'est entré nulle
                  part. Tout est dessiné — le reste se compte des yeux. */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700">{words.scene}</span>
                {bouquets.k === null
                  ? <span className="text-slate-500">{t('manipulation.common.pileHint', { stock: words.stock })}</span>
                  : <span className={bouquets.works ? 'text-emerald-700' : 'text-amber-800'}>{gLabel}</span>}
              </div>
              {bouquets.k !== null && (
                <div className="mb-2 flex justify-end">
                  <DraggableObject drag={drag} id="group:remove" label={words.remove} className="flex items-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-500">
                    {wrapper}<span>→ {words.stock}</span>
                  </DraggableObject>
                </div>
              )}
              <GroupingScene
                a={a} b={b} k={bouquets.k} theme={theme} words={words}
                ariaLabel={bouquets.k === null ? `${a} ${words.itemsA} · ${b} ${words.itemsB}` : `${a} = ${bouquets.k} × ${bouquets.qa} + ${bouquets.ra} · ${b} = ${bouquets.k} × ${bouquets.qb} + ${bouquets.rb}`}
              />
            </DropZone>
            {needBeyond && (
              <p className="rounded-xl border-2 border-sky-200 bg-sky-50 px-3 py-2 text-sm font-bold text-sky-900" data-groups-beyond>
                {t('manipulation.common.groupsNeedBeyond', { g })}
              </p>
            )}
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
            {reject.groups
              ? t(`manipulation.common.reject.${reject.reason}`)
              : t(`manipulation.common.listReject.${reject.reason}`, { d: reject.d, a, b, defaultValue: t('manipulation.common.reject.tooMany') })}
          </p>
        )}
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{drag.held?.startsWith('group:') ? wrapper : heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
