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
import DivisorChip from '../primitives/DivisorChip';
import DragGhost from '../primitives/DragGhost';
import GroupingScene from '../primitives/GroupingScene';
import { themeWords } from '../themeWords';
import MathTransformation from '../primitives/MathTransformation';
import EquationDisplay from '../primitives/EquationDisplay';
import * as L from '../logic/fraction';

const { reductionStepTex, euclidStepTex } = divisibility;

/**
 * fraction-reduction — LE LABORATOIRE DES DEUX CHEMINS.
 *
 * A. L'élève porte un DIVISEUR COMMUN sur la RECETTE : 84 cuillères de sucre
 *    pour 48 tasses de farine. Diviser les deux termes par k, c'est répartir
 *    les deux ingrédients en k parts identiques — et la fraction réduite est
 *    ce que contient UNE part (GroupingScene, thème `kitchen`).
 * B. Idée : diviser les deux termes par un diviseur commun ne change pas le
 *    kasr (une part garde les mêmes proportions que la recette entière) ; on
 *    s'arrête quand il n'y a plus de diviseur commun > 1.
 * C. Un jeton qui ne divise qu'un seul terme est refusé AVEC la raison —
 *    l'erreur classique, expliquée au moment où elle se produit.
 * D. Émerge : la chaîne 84/48 → 21/12 → 7/4, puis, à côté, la même chose en
 *    UNE division par le PGCD.
 * E. À découvrir : « أي الطريقين أوفر؟ » — l'utilité du PGCD, comptée en
 *    étapes, pas affirmée.
 */
export default function FractionReduction({
  n: n0, d: d0, title, lead, mission, path, theme = 'kitchen', initialMode = 'student', allowModeSwitch = false, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'fraction-reduction', initialNumbers: { n: n0, d: d0 }, initialMode, hintCount: 3 });
  const { n, d } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ n: n0, d: d0 }));
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.init({ n, d })); setReject(null); }, [n, d, state.epoch]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      const k = Number(sourceId.replace(/^[kp]:/, ''));
      if (zoneId === 'fraction') { setLab((s) => L.reduceA(s, k)); return; }
      if (zoneId === 'pgcd') setLab((s) => { const next = L.reduceB(s, k); if (L.discoveryReady(next)) state.discover(); return next; });
    },
    accepts: (sourceId, zoneId) => {
      const k = Number(sourceId.replace(/^[kp]:/, ''));
      if (zoneId === 'fraction') return L.canReduceA(lab, k);
      if (zoneId === 'pgcd') return L.canReduceB(lab, k);
      return 'invalid';
    },
    onReject: (sourceId, _z, reason) => setReject({ reason, k: Number(sourceId.replace(/^[kp]:/, '')) }),
  });

  useEffect(() => { if (state.isFormal) onFinished?.(lab.final); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const cur = L.currentA(lab);
  const candidates = L.candidatesA(lab);
  const chain = L.chainA(lab);
  const finishedA = L.pathAFinished(lab);
  // La SCÈNE montre la dernière répartition : la recette d'avant, en k parts,
  // dont une est mise en évidence — c'est la fraction courante.
  const last = chain[chain.length - 1];
  const prev = chain.length > 1 ? chain[chain.length - 2] : null;
  const words = themeWords(t, theme);
  const heldValue = drag.held ? Number(drag.held.replace(/^[kp]:/, '')) : null;
  // Le chemin du manuel (سمير : ÷4 puis ÷3) sert de guide au mode classe.
  const classPath = path ?? candidates;

  return (
    <ManipulationShell
      type="fraction-reduction"
      title={title ?? t('manipulation.reduce.title', { n, d })}
      mission={mission ?? t('manipulation.reduce.recipeMission')}
      lead={lead}
      state={state}
      numberFields={[{ key: 'n', label: t('manipulation.reduce.numerator') }, { key: 'd', label: t('manipulation.reduce.denominator') }]}
      validate={(x) => (x.d === 0 ? t('manipulation.reduce.denominatorZero') : '')}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.reduce.hint1'), t('manipulation.reduce.hint2'), t('manipulation.reduce.hint3')]}
      controller={{
        autoStep: () => {
          if (!L.pathAFinished(lab)) {
            const k = (path ?? []).find((x, i) => i === lab.pathA.length) ?? L.candidatesA(lab)[0];
            if (k === undefined) return false;
            setLab((s) => L.reduceA(s, k));
            return true;
          }
          if (lab.pathB === null) { setLab((s) => { const x = L.reduceB(s, s.gcd); state.discover(); return x; }); return true; }
          return false;
        },
        canAutoStep: () => !L.pathAFinished(lab) || lab.pathB === null,
        showSolution: () => {
          setLab((s) => {
            let x = s; let guard = 0;
            while (!L.pathAFinished(x) && guard++ < 20) x = L.reduceA(x, L.candidatesA(x)[0]);
            return L.reduceB(x, x.gcd);
          });
          state.discover(); state.formalize();
        },
      }}
      representation={(
        <div className="space-y-2">
          {chain.slice(1).map((c, i) => (
            <MathTransformation key={i} fromTex={`\\dfrac{${chain[i].n}}{${chain[i].d}}`} opLabel={`÷ ${c.k}`} toTex={`\\dfrac{${c.n}}{${c.d}}`}
              tone={i === chain.length - 2 ? 'active' : 'ok'} note={t('manipulation.reduce.divideBy', { k: c.k })} />
          ))}
          {finishedA && (
            <EquationDisplay tex={`\\dfrac{${cur.n}}{${cur.d}}`} tone="ok" size="lg"
              note={`${t('manipulation.irreducible')} — ${t('manipulation.reduce.whyIrreducible', { n: cur.n, d: cur.d })}`} />
          )}
          {lab.pathB !== null && (
            <div className="space-y-1.5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-3">
              <div className="text-sm font-bold text-amber-900">{t('manipulation.reduce.pathB')}</div>
              {lab.euclid.map((s, i) => <EquationDisplay key={i} tex={euclidStepTex(s)} tone="muted" size="sm" />)}
              <MathTransformation fromTex={`\\dfrac{${n}}{${d}}`} opLabel={`÷ ${lab.gcd}`} toTex={`\\dfrac{${lab.final.n}}{${lab.final.d}}`} tone="result"
                note={reductionStepTex(n, d, lab.gcd) ? t('manipulation.reduce.pgcdInOneStep') : undefined} />
              <GroupingScene a={n} b={d} k={lab.gcd} theme={theme} words={{ ...words, allUsed: undefined }} highlight={0} compact
                ariaLabel={`${n}/${d} ÷ ${lab.gcd} = ${lab.final.n}/${lab.final.d}`} />
            </div>
          )}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.reduce.discoverPrompt')}
          options={[
            { text: t('manipulation.reduce.opt1'), correct: true },
            { text: t('manipulation.reduce.opt2'), why: t('manipulation.reduce.why2', { stepsA: lab.pathA.length }) },
            { text: t('manipulation.reduce.opt3'), why: t('manipulation.reduce.why3') },
          ]}
          formal={(
            <div className="space-y-2">
              <EquationDisplay tex={reductionStepTex(n, d, lab.gcd)} tone="result" />
              <p className="font-mono text-xs text-slate-600" dir="auto">
                {t('manipulation.reduce.pathA')}: {t('manipulation.reduce.stepsUsed', { count: lab.pathA.length })} · {t('manipulation.reduce.pathB')}: {t('manipulation.reduce.stepsUsed', { count: 1 })}
              </p>
            </div>
          )}
        />
      )}
      explanation={t('manipulation.reduce.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-800">{t('manipulation.reduce.chooseCommonDivisor', { n: cur.n, d: cur.d })}</span>
              <span className="text-[11px] text-slate-500">{t('manipulation.dragHint')}</span>
            </div>
            <div dir="ltr" className="flex flex-wrap gap-1.5" role="group">
              {(finishedA ? [lab.gcd, ...classPath.filter((k) => k !== lab.gcd).slice(0, 3)] : candidates).map((k) => (
                <DivisorChip key={k} value={k} drag={drag} id={finishedA ? `p:${k}` : `k:${k}`} label={`${k}`} state={finishedA && k === lab.gcd ? 'pgcd' : 'idle'} />
              ))}
              {!finishedA && candidates.length === 0 && <span className="text-xs text-emerald-700">{t('manipulation.irreducible')}</span>}
            </div>
          </div>

          <DropZone drag={drag} id="fraction" label={t('manipulation.reduce.fractionZone')} hint={lab.pathA.length === 0 ? t('manipulation.reduce.dropDivisor') : undefined} minHeight="min-h-[150px]" className="p-3" disabled={finishedA} data-recipe>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800">
                  <span dir="ltr" className="inline-flex flex-col items-center gap-0.5">
                    <NumberTile value={cur.n} tone="dividend" size="sm" />
                    <span className="h-0.5 w-full rounded bg-slate-800" aria-hidden="true" />
                    <NumberTile value={cur.d} tone="divisor" size="sm" />
                  </span>
                  <span>{t('manipulation.reduce.recipe', { n: cur.n, d: cur.d, itemsA: words.itemsA, itemsB: words.itemsB })}</span>
                </span>
                {prev && <span className="text-amber-800">{t('manipulation.reduce.portionsHint', { k: last.k })}</span>}
              </div>
              {prev ? (
                <GroupingScene a={prev.n} b={prev.d} k={last.k} theme={theme} words={{ ...words, allUsed: undefined }} highlight={0}
                  ariaLabel={`${prev.n}/${prev.d} ÷ ${last.k} = ${cur.n}/${cur.d}`} />
              ) : (
                <GroupingScene a={cur.n} b={cur.d} k={null} theme={theme} words={words}
                  ariaLabel={t('manipulation.reduce.wholeRecipe', { n: cur.n, d: cur.d, itemsA: words.itemsA, itemsB: words.itemsB })} />
              )}
              {prev && (
                <p className="text-xs font-bold text-emerald-800" data-recipe-portion>
                  {t('manipulation.reduce.onePortion', { n: cur.n, d: cur.d, itemsA: words.itemsA, itemsB: words.itemsB })}
                </p>
              )}
            </div>
          </DropZone>

          {finishedA && (
            <DropZone drag={drag} id="pgcd" label={t('manipulation.reduce.pathB')} tone="amber" hint={lab.pathB === null ? t('manipulation.reduce.dropPgcd', { n, d }) : undefined} minHeight="min-h-[64px]" className="flex items-center justify-center gap-2 px-3">
              <span className="text-xs font-bold text-amber-900">{t('manipulation.reduce.pathB')}</span>
              {lab.pathB !== null && <NumberTile value={lab.pathB} tone="pgcd" />}
            </DropZone>
          )}

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.reduce.reject.${reject.reason}`, { k: reject.k })}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>{heldValue !== null && <NumberTile value={heldValue} tone="divisor" />}</DragGhost>
    </ManipulationShell>
  );
}
