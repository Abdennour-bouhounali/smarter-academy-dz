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
import GroupingScene from '../primitives/GroupingScene';
import { Btn } from '../ManipulationTeacherMode';
import { themeWords } from '../themeWords';
import * as L from '../logic/coprime';

/**
 * coprime-explorer — LES TROUSSES, PUIS L'INTERSECTION VIDE (sauf 1).
 *
 * A. Au niveau débutant (`startWith="groups"`), l'élève porte un NOMBRE DE
 *    TROUSSES sur la table : 17 stylos et 18 cahiers se répartissent, et ce
 *    qui n'entre nulle part reste dessiné à part. Puis, dans les listes, il
 *    porte au MILIEU les diviseurs qui divisent les DEUX nombres.
 * B. Idée : « أوليان فيما بينهما » ⇔ aucune répartition identique en plus
 *    d'un groupe ⇔ le seul habitant du milieu est 1.
 * C. Chaque nombre de trousses essayé laisse (ou non) des objets dehors ; un
 *    jeton qui ne divise qu'un côté est refusé AVEC sa raison.
 * D. Émerge : « seul 1 a marché », puis la liste du milieu, puis
 *    PGCD(a ; b) = 1 (ou le diviseur ≠ 1 qui réfute, comme le 9 que مريم
 *    n'avait pas vu pour 27 et 36).
 * E. À découvrir : ce n'est pas « chacun est premier », c'est une propriété
 *    du COUPLE.
 *
 * `theme` choisit les objets dessinés (primitives/itemThemes) ; par défaut
 * l'étape des trousses n'est pas montrée (`startWith="lists"`), ce qui garde
 * le comportement des modules qui n'en veulent pas.
 */
export default function CoprimeExplorer({
  a: a0, b: b0, title, lead, mission, theme = 'school', startWith = 'lists', initialMode = 'student', allowModeSwitch = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'coprime-explorer', initialNumbers: { a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { a, b } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ a: a0, b: b0 }));
  const [groups, setGroups] = useState(() => L.initGroups({ a: a0, b: b0 }));
  const [stage, setStage] = useState(startWith);
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.init({ a, b })); setGroups(L.initGroups({ a, b })); setStage(startWith); setReject(null); }, [a, b, state.epoch, startWith]);

  const words = themeWords(t, theme);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId.startsWith('k:')) { setGroups((g) => L.chooseGroups(g, Number(sourceId.replace('k:', '')))); return; }
      if (zoneId === 'shared') setLab((s) => L.share(s, sourceId));
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId.startsWith('k:')) return zoneId === 'kits' ? L.canChooseGroups(groups, Number(sourceId.replace('k:', ''))) : 'invalid';
      return zoneId === 'shared' ? L.canShare(lab, sourceId) : 'invalid';
    },
    onReject: (sourceId, _z, reason) => setReject(sourceId.startsWith('k:')
      ? { kind: 'group', reason }
      : { kind: 'list', reason, d: L.parseChip(sourceId).d }),
  });

  const check = () => {
    setLab((s) => { const next = L.check(s); if (L.allShared(next)) state.discover(); return next; });
  };

  useEffect(() => { if (state.isFormal) onFinished?.(L.isCoprime(lab)); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const coprime = L.isCoprime(lab);
  const heldValue = drag.held ? (drag.held.startsWith('k:') ? Number(drag.held.replace('k:', '')) : L.parseChip(drag.held).d) : null;
  const extra = lab.common.filter((d) => d > 1);
  const rail = Array.from({ length: Math.min(12, Math.min(a, b)) }, (_, i) => i + 1);
  const insight = L.groupsInsightReady(groups);
  const working = L.workingCounts(groups);
  const inGroups = stage === 'groups';

  return (
    <ManipulationShell
      type="coprime-explorer"
      title={title ?? t('manipulation.coprime.title', { a, b })}
      mission={mission ?? (inGroups
        ? t('manipulation.coprime.groupsMission', { a, b, itemsA: words.itemsA, itemsB: words.itemsB, groups: words.groups })
        : t('manipulation.coprime.mission', { a, b }))}
      lead={lead}
      state={state}
      numberFields={[{ key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.coprime.hint1'), t('manipulation.coprime.hint2'), t('manipulation.coprime.hint3')]}
      onCheck={inGroups ? undefined : check}
      checkDisabled={lab.shared.length === 0 || state.isDiscovered}
      controller={{
        autoStep: () => {
          if (inGroups) {
            const next = rail.find((k) => groups.tried[k] === undefined);
            if (next === undefined || L.groupsInsightReady(groups)) { setStage('lists'); return true; }
            setGroups((g) => L.chooseGroups(g, next));
            return true;
          }
          const d = lab.common.find((x) => !lab.shared.includes(x));
          if (d === undefined) { if (!state.isDiscovered) { setLab(L.check); state.discover(); return true; } return false; }
          setLab((s) => L.share(s, L.chipId('a', d)));
          return true;
        },
        canAutoStep: () => inGroups || !L.allShared(lab) || !state.isDiscovered,
        showSolution: () => { setStage('lists'); setLab((s) => { let x = s; for (const d of s.common) x = L.share(x, L.chipId('a', d)); return L.check(x); }); state.discover(); state.formalize(); },
      }}
      representation={(
        <div className="space-y-2">
          {inGroups && groups.k !== null && (
            <EquationDisplay
              tex={`${a} = ${groups.k} \\times ${groups.qa} + ${groups.ra} \\quad ${b} = ${groups.k} \\times ${groups.qb} + ${groups.rb}`}
              size="sm" tone={groups.works ? 'ok' : 'neutral'}
              note={groups.works
                ? t('manipulation.coprime.groupsWorks', { k: groups.k, qa: groups.qa, qb: groups.qb, groups: words.groups, itemsA: words.itemsA, itemsB: words.itemsB })
                : t('manipulation.coprime.groupsFails', { k: groups.k, ra: groups.ra, rb: groups.rb, groups: words.groups, itemsA: words.itemsA, itemsB: words.itemsB })}
            />
          )}
          {!inGroups && lab.shared.length > 0 && (
            <EquationDisplay
              tex={`\\text{communs} = \\{${lab.shared.join(' ; ')}\\}`}
              tone={L.allShared(lab) ? (coprime ? 'ok' : 'result') : 'neutral'}
              size="sm"
              note={L.allShared(lab) && coprime ? t('manipulation.coprime.onlyOne') : undefined}
            />
          )}
        </div>
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
        {inGroups ? (
          <div className="space-y-3" data-coprime-groups>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-slate-800">{t('manipulation.coprime.groupsZone', { groups: words.groups })}</span>
                <span className="text-[11px] text-slate-500">{t('manipulation.dragHint')}</span>
              </div>
              <div dir="ltr" className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.coprime.groupsZone', { groups: words.groups })}>
                {rail.map((k) => (
                  <DivisorChip key={k} value={k} drag={drag} id={`k:${k}`} label={`${k}`}
                    state={groups.tried[k] === 'common' ? 'common' : groups.tried[k] === undefined ? 'idle' : 'no'}
                    badge={groups.tried[k] === 'common' ? '✓' : groups.tried[k] === undefined ? undefined : '✕'} />
                ))}
              </div>
            </div>

            <DropZone drag={drag} id="kits" label={t('manipulation.coprime.groupsZone', { groups: words.groups })} minHeight="min-h-[150px]" className="p-3" data-groups-table>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700">{words.scene}</span>
                {groups.k === null
                  ? <span className="text-slate-500">{t('manipulation.coprime.dropCount', { groups: words.groups })}</span>
                  : <span className={groups.works ? 'text-emerald-700' : 'text-amber-800'}>{groups.works ? t('manipulation.coprime.groupsWorks', { k: groups.k, qa: groups.qa, qb: groups.qb, groups: words.groups, itemsA: words.itemsA, itemsB: words.itemsB }) : t('manipulation.coprime.groupsFails', { k: groups.k, ra: groups.ra, rb: groups.rb, groups: words.groups, itemsA: words.itemsA, itemsB: words.itemsB })}</span>}
              </div>
              <GroupingScene a={a} b={b} k={groups.k} theme={theme} words={words}
                ariaLabel={groups.k === null ? `${a} ${words.itemsA} · ${b} ${words.itemsB}` : `${a} = ${groups.k} × ${groups.qa} + ${groups.ra} · ${b} = ${groups.k} × ${groups.qb} + ${groups.rb}`} />
            </DropZone>

            {insight && (
              <div className={`space-y-2 rounded-2xl border-2 px-3 py-2 ${working.length === 1 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`} role="status" data-coprime-insight>
                <p className="text-sm font-bold text-slate-900">
                  {working.length === 1
                    ? t('manipulation.coprime.onlyOneWorks', { group: words.group, groups: words.groups })
                    : t('manipulation.coprime.worksMany', { list: working.join(' ، ') })}
                </p>
                <Btn tone="blue" onClick={() => setStage('lists')}>{t('manipulation.coprime.toLists')}</Btn>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {startWith === 'groups' && Object.keys(groups.tried).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <span className="font-bold">{t('manipulation.coprime.groupsTried')}</span>
                <span dir="ltr" className="flex flex-wrap gap-1">
                  {Object.keys(groups.tried).map(Number).sort((x, y) => x - y).map((k) => (
                    <DivisorChip key={k} value={k} state={groups.tried[k] === 'common' ? 'common' : 'no'} />
                  ))}
                </span>
              </div>
            )}
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
          </div>
        )}

        {reject && (
          <p role="status" className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {reject.kind === 'group'
              ? t(`manipulation.coprime.groupReject.${reject.reason}`, { groups: words.groups, defaultValue: t('manipulation.coprime.groupReject.tooMany', { groups: words.groups }) })
              : t(`manipulation.coprime.reject.${reject.reason}`, { d: reject.d, a, b })}
          </p>
        )}
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
