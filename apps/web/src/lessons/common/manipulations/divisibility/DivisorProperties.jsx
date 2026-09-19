import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import MathText from '../../components/MathText';
import * as L from '../logic/divisorProperties';

/**
 * divisor-properties — LE LABORATOIRE DES BLOCS DE n, puis LE CONSTRUCTEUR DE PREUVE.
 *
 * A. L'élève porte l'étiquette d'un mesurande (a + b, a − b, le reste) dans
 *    la zone de construction ; puis il ordonne les lignes d'une preuve.
 * B. Idée : n | a et n | b ⇒ n | a + b, a − b, r — parce que tout se mesure
 *    en blocs de n.
 * C. Les barres de a et de b, à la même échelle, se composent : la barre du
 *    résultat est faite de blocs ENTIERS de n, sans morceau ni trou.
 * D. Émerge : a + b = n × (q + q'), littéralement la factorisation du manuel.
 * E. À découvrir : ce n'est pas un hasard des nombres choisis — c'est n en
 *    facteur commun ; la preuve, construite à la main, le dit avec des lettres.
 */
export default function DivisorProperties({
  n: n0, a: a0, b: b0, title, lead, mission, withProof = false, initialMode = 'student', allowModeSwitch = false, onFinished, onProofDone,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'divisor-properties', initialNumbers: { n: n0, a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { n, a, b } = state.numbers;
  const [lab, setLab] = useState(() => L.init({ n: n0, a: a0, b: b0 }));
  const [proof, setProof] = useState(() => L.proofInit());
  const [reject, setReject] = useState(null);

  useEffect(() => { setLab(L.init({ n, a, b })); setProof(L.proofInit()); setReject(null); }, [n, a, b, state.epoch]);

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId.startsWith('target:')) {
        const target = sourceId.replace('target:', '');
        setLab((s) => { const next = L.build(s, target); if (L.discoveryReady(next)) state.discover(); return next; });
        return;
      }
      if (sourceId.startsWith('line:')) {
        const id = sourceId.replace('line:', '');
        const slot = Number(zoneId.replace('slot:', ''));
        setProof((p) => { const next = L.proofPlace(p, id, slot); if (L.proofDone(next)) onProofDone?.(); return next; });
      }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId.startsWith('target:') && zoneId === 'build') return L.canBuild(lab, sourceId.replace('target:', ''));
      if (sourceId.startsWith('line:') && zoneId.startsWith('slot:')) return L.proofCanPlace(proof, sourceId.replace('line:', ''), Number(zoneId.replace('slot:', '')));
      return 'invalid';
    },
    onReject: (_s, _z, reason) => setReject(reason),
  });

  useEffect(() => { if (state.isFormal) onFinished?.(); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const scale = Math.max(a + b, 1);
  const heldLine = drag.held?.startsWith('line:') ? L.PROOF_LINES.find((l) => `line:${l.id}` === drag.held) : null;
  const heldTarget = drag.held?.startsWith('target:') ? drag.held.replace('target:', '') : null;
  const targetLabel = (x) => t(`manipulation.props.target${x[0].toUpperCase()}${x.slice(1)}`);

  return (
    <ManipulationShell
      type="divisor-properties"
      title={title ?? t('manipulation.props.title')}
      mission={mission ?? t('manipulation.props.mission', { n, a, b })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'n', label: 'n' }, { key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      validate={(x) => (x.a % x.n !== 0 || x.b % x.n !== 0 ? t('manipulation.props.mustDivideBoth') : x.a < x.b ? t('manipulation.props.aBeforeB') : '')}
      allowModeSwitch={allowModeSwitch}
      hints={[t('manipulation.props.hint1', { a, b }), t('manipulation.props.hint2'), t('manipulation.props.hint3', { n })]}
      controller={{
        autoStep: () => {
          const next = L.TARGETS.find((x) => !lab.built.includes(x));
          if (!next) return false;
          setLab((s) => { const x = L.build(s, next); if (L.discoveryReady(x)) state.discover(); return x; });
          return true;
        },
        canAutoStep: () => lab.built.length < L.TARGETS.length,
        showSolution: () => { setLab((s) => L.TARGETS.reduce((acc, x) => L.build(acc, x), s)); state.discover(); state.formalize(); },
      }}
      representation={lab.built.length > 0 && (
        <div className="space-y-2">
          {lab.built.map((target) => {
            const r = L.blocks(lab, target);
            return (
              <div key={target} className="space-y-1">
                <QuantityBar value={r.value} scale={scale} tone={target === 'sum' ? 'a' : target === 'diff' ? 'diff' : 'rem'}
                  segments={Array.from({ length: Math.min(r.count, 40) }, () => ({ value: n, tone: target === 'sum' ? 'a' : target === 'diff' ? 'diff' : 'rem' }))} />
                <EquationDisplay tex={r.tex} tone="ok" size="sm" note={t('manipulation.props.built', { value: r.value, n, count: r.count })} />
              </div>
            );
          })}
        </div>
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={t('manipulation.props.discoverPrompt')}
          options={[
            { text: t('manipulation.props.opt1', { n }), correct: true },
            { text: t('manipulation.props.opt2', { n }), why: t('manipulation.props.why2') },
            { text: t('manipulation.props.opt3', { n }), why: t('manipulation.props.why3') },
          ]}
          formal={(
            <div className="space-y-3">
              <EquationDisplay tex={`n \\mid a,\\ n \\mid b \\Rightarrow n \\mid a+b,\\ n \\mid a-b,\\ n \\mid r`} tone="result" note={t('manipulation.props.conclusion', { n })} />
              {withProof && (
                <div className="space-y-2 rounded-2xl border-2 border-indigo-200 bg-white p-3" data-proof-builder>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h5 className="text-sm font-extrabold text-indigo-900">{t('manipulation.props.proofTitle')}</h5>
                    <span className="text-xs text-slate-500">{t('manipulation.props.proofMission')}</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-[11px] font-bold text-slate-600">{t('manipulation.props.proofPool')}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {proof.pool.map((id) => {
                          const line = proof.lines.find((l) => l.id === id);
                          return (
                            <button key={id} type="button" {...drag.sourceProps(`line:${id}`)} aria-label={line.tex}
                              className={`min-h-[44px] rounded-xl border-2 px-2.5 py-1.5 font-mono text-sm ${drag.held === `line:${id}` ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-slate-300 bg-white hover:border-indigo-400'}`}>
                              <span dir="ltr"><MathText>{`$${line.tex}$`}</MathText></span>
                            </button>
                          );
                        })}
                        {proof.pool.length === 0 && <span className="text-xs text-emerald-700">{t('manipulation.props.proofDone')}</span>}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-bold text-slate-600">{t('manipulation.props.proofSlots')}</div>
                      <ol className="space-y-1.5">
                        {proof.lines.map((_, i) => {
                          const placedId = proof.placed[i];
                          const line = placedId ? proof.lines.find((l) => l.id === placedId) : null;
                          return (
                            <li key={i}>
                              <DropZone drag={drag} id={`slot:${i}`} label={`${i + 1}`} minHeight="min-h-[44px]" tone="emerald" className="flex items-center gap-2 px-2.5 py-1.5" disabled={!!line}>
                                <span className="font-mono text-[11px] text-slate-400" dir="ltr">{i + 1}</span>
                                {line ? <span dir="ltr" className="font-mono text-sm"><MathText>{`$${line.tex}$`}</MathText></span> : <span className="text-xs text-slate-400">—</span>}
                              </DropZone>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                  {proof.wrong && <p role="status" className="text-sm text-rose-800">{t('manipulation.props.proofWrong')}</p>}
                  {L.proofDone(proof) && <p role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900">{t('manipulation.props.proofDone')}</p>}
                </div>
              )}
            </div>
          )}
        />
      )}
      explanation={t('manipulation.props.explanation')}
    >
      <ManipulationStage dragging={drag.dragging}>
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><NumberTile value={a} tone="dividend" size="sm" /> = {n} × {lab.q}</div>
              <QuantityBar value={a} scale={scale} tone="a" segments={Array.from({ length: Math.min(lab.q, 40) }, () => ({ value: n, tone: 'a' }))} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><NumberTile value={b} tone="divisor" size="sm" /> = {n} × {lab.qp}</div>
              <QuantityBar value={b} scale={scale} tone="b" segments={Array.from({ length: Math.min(lab.qp, 40) }, () => ({ value: n, tone: 'b' }))} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('manipulation.props.buildZone')}>
            {L.TARGETS.map((x) => (
              <button key={x} type="button" {...drag.sourceProps(`target:${x}`, { disabled: lab.built.includes(x) })} aria-label={targetLabel(x)}
                className={`min-h-[44px] rounded-xl border-2 px-3 py-2 text-sm font-bold ${lab.built.includes(x) ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : drag.held === `target:${x}` ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'}`}>
                {targetLabel(x)}
              </button>
            ))}
          </div>

          <DropZone drag={drag} id="build" label={t('manipulation.props.buildZone')} hint={lab.built.length === 0 ? t('manipulation.props.dropHere') : undefined} minHeight="min-h-[72px]" className="p-3">
            {lab.built.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {lab.built.map((x) => {
                  const r = L.blocks(lab, x);
                  return <li key={x} className="rounded-xl border-2 border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-900">{targetLabel(x)} = <span dir="ltr" className="font-mono">{n} × {r.count}</span></li>;
                })}
              </ul>
            )}
          </DropZone>

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.props.reject.${reject}`, { defaultValue: t('manipulation.props.proofWrong') })}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>
        {heldTarget && <span className="rounded-xl border-2 border-blue-500 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">{targetLabel(heldTarget)}</span>}
        {heldLine && <span className="rounded-xl border-2 border-blue-500 bg-blue-50 px-2.5 py-1.5 font-mono text-sm" dir="ltr"><MathText>{`$${heldLine.tex}$`}</MathText></span>}
      </DragGhost>
    </ManipulationShell>
  );
}
