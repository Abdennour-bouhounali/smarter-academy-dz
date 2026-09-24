import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import DraggableObject from '../primitives/DraggableObject';
import NumberTile from '../primitives/NumberTile';
import DragGhost from '../primitives/DragGhost';
import BrickWall from '../primitives/BrickWall';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { measureLayout } from '../primitives/brickLayout';
import * as L from '../logic/divisorProperties';

/**
 * divisor-properties — LE CHANTIER DES MURS EN BRIQUES DE n, puis LE
 * CONSTRUCTEUR DE PREUVE.
 *
 * A. L'élève porte LE MUR DE b (un vrai mur, en briques de longueur n) vers
 *    l'une des trois zones du chantier : l'ACCOLER au mur de a (a + b),
 *    l'ENLEVER du mur de a (a − b), ou MESURER le mur de a avec des panneaux
 *    de b (le reste). Puis il ordonne les lignes d'une preuve.
 * B. Idée : n | a et n | b ⇒ n | a + b, a − b, r — parce que tout est bâti
 *    en briques entières de n.
 * C. Les murs sont à la même échelle (BrickWall) : accolés, le résultat est
 *    encore un mur de briques entières ; enlevé, ce qui reste aussi ; mesuré
 *    par des panneaux de b, le bout qui dépasse aussi — aucun demi-brique
 *    n'apparaît jamais.
 * D. Émerge : a + b = n × (q + q'), littéralement la factorisation du manuel.
 * E. À découvrir : ce n'est pas un hasard des nombres choisis — c'est n en
 *    facteur commun ; la preuve, construite à la main, le dit avec des lettres.
 *
 * Thème `construction` (packages/core VISUAL_THEMES). Le geste est le même
 * à tous les niveaux ; au niveau avancé (900, 90, 9) les briques sont trop
 * petites pour être comptées : l'élève doit prédire AVEC la propriété.
 */

/** Les trois zones du chantier et le mesurande que chacune construit. */
const ZONES = Object.freeze([
  { id: 'join', target: 'sum', tone: 'emerald' },
  { id: 'remove', target: 'diff', tone: 'amber' },
  { id: 'measure', target: 'rem', tone: 'indigo' },
]);
const targetOfZone = (zoneId) => ZONES.find((z) => `zone:${z.id}` === zoneId)?.target ?? null;

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
      if (sourceId === 'wall:b') {
        const target = targetOfZone(zoneId);
        if (!target) return;
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
      if (sourceId === 'wall:b') {
        const target = targetOfZone(zoneId);
        return target ? L.canBuild(lab, target) : 'wrongZone';
      }
      if (sourceId.startsWith('line:') && zoneId.startsWith('slot:')) return L.proofCanPlace(proof, sourceId.replace('line:', ''), Number(zoneId.replace('slot:', '')));
      return 'wrongZone';
    },
    onReject: (_s, _z, reason) => setReject(reason),
  });

  useEffect(() => { if (state.isFormal) state.report(onFinished); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tous les murs à la MÊME échelle : la plus grande longueur du chantier.
  const scale = Math.max(a + b, 1);
  const heldLine = drag.held?.startsWith('line:') ? L.PROOF_LINES.find((l) => `line:${l.id}` === drag.held) : null;
  const heldWall = drag.held === 'wall:b';
  const zoneLabel = (id) => t(`manipulation.props.zone${id[0].toUpperCase()}${id.slice(1)}`);
  const dropLabel = (id) => t(`manipulation.props.drop${id[0].toUpperCase()}${id.slice(1)}`);
  const meas = measureLayout({ a, b, unit: n });
  const cm = (v) => `${v}`;

  /** Le mur RÉSULTAT d'une zone, en segments de couleur, tous en briques de n. */
  const resultSegments = (target) => {
    if (target === 'sum') return [{ value: a, tone: 'a', label: cm(a) }, { value: b, tone: 'b', label: cm(b) }];
    if (target === 'diff') return [{ value: a - b, tone: 'diff', label: cm(a - b) }, { value: b, tone: 'ghost', label: cm(b) }];
    return [
      ...meas.panels.map(() => ({ value: b, tone: 'panel', label: meas.q <= 12 ? cm(b) : undefined })),
      ...(meas.r > 0 ? [{ value: meas.r, tone: 'rem', label: cm(meas.r) }] : []),
    ];
  };
  const resultNote = (target) => {
    const r = L.blocks(lab, target);
    if (target === 'sum') return t('manipulation.props.wallSum', { value: r.value, n, count: r.count });
    if (target === 'diff') return t('manipulation.props.wallDiff', { value: r.value, n, count: r.count });
    return t('manipulation.props.wallRem', { q: meas.q, b, value: r.value, n, count: r.count });
  };

  return (
    <ManipulationShell
      type="divisor-properties"
      title={title ?? t('manipulation.props.title')}
      mission={mission ?? t('manipulation.props.wallMission', { n, a, b })}
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
            return <EquationDisplay key={target} tex={r.tex} tone="ok" size="sm" note={t('manipulation.props.built', { value: r.value, n, count: r.count })} />;
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
      <ManipulationStage dragging={drag.dragging} className="bg-gradient-to-b from-orange-50/60 to-white">
        <div className="space-y-3" data-brick-site>
          {/* ── LES DEUX MURS, bâtis en briques de n, à la même échelle ──── */}
          <div className="space-y-2 rounded-2xl border-2 border-slate-200 bg-white p-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
              <NumberTile value={n} tone="quotient" size="sm" />
              <span>{t('manipulation.props.brickOf', { n })}</span>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600" dir="auto">{t('manipulation.props.wallA', { a, n, q: lab.q })}</div>
              <BrickWall value={a} unit={n} scale={scale} tone="a" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600" dir="auto">{t('manipulation.props.wallB', { b, n, q: lab.qp })}</div>
              {/* LE MUR DE b : c'est LUI qu'on porte. Il reste à sa place
                  (l'objet de référence ne disparaît pas) et sa copie va
                  dans la zone choisie. */}
              <DraggableObject drag={drag} id="wall:b" label={t('manipulation.props.dragWall')} disabled={lab.built.length === L.TARGETS.length}
                className="block w-full rounded-xl border-2 border-violet-300 bg-violet-50/60 p-1">
                <div className="flex items-center gap-2">
                  <NumberTile value={b} tone="divisor" size="sm" />
                  <BrickWall value={b} unit={n} scale={scale} tone="b" className="flex-1" />
                </div>
              </DraggableObject>
            </div>
          </div>

          {/* ── LE CHANTIER : trois zones, trois questions du manuel ─────── */}
          <div className="grid gap-2">
            {ZONES.map((z) => {
              const built = lab.built.includes(z.target);
              return (
                <DropZone key={z.id} drag={drag} id={`zone:${z.id}`} label={zoneLabel(z.id)} tone={z.tone} disabled={built}
                  hint={!built ? dropLabel(z.id) : undefined} minHeight="min-h-[64px]" className="p-2" data-site-zone={z.id} data-built={built ? 'true' : 'false'}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[11px] font-extrabold text-slate-700">
                    <span>{zoneLabel(z.id)}</span>
                    {built && <span className="rounded-full bg-emerald-600 px-2 text-white">{t('manipulation.props.alreadyBuiltShort')}</span>}
                  </div>
                  {built ? (
                    <div className="space-y-1">
                      <BrickWall unit={n} scale={scale} segments={resultSegments(z.target)} />
                      <p className="text-xs font-bold text-emerald-800" dir="auto">{resultNote(z.target)}</p>
                    </div>
                  ) : (
                    <div className="h-6" aria-hidden="true" />
                  )}
                </DropZone>
              );
            })}
          </div>

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.props.reject.${reject}`, { defaultValue: t('manipulation.props.proofWrong') })}</p>}
        </div>
      </ManipulationStage>
      <DragGhost ghost={drag.ghost}>
        {heldWall && (
          <span className="flex w-40 items-center gap-2 rounded-xl border-2 border-blue-500 bg-blue-50 px-2 py-1">
            <NumberTile value={b} tone="divisor" size="sm" />
            <BrickWall value={b} unit={n} scale={b} tone="b" className="flex-1" height="h-6" />
          </span>
        )}
        {heldLine && <span className="rounded-xl border-2 border-blue-500 bg-blue-50 px-2.5 py-1.5 font-mono text-sm" dir="ltr"><MathText>{`$${heldLine.tex}$`}</MathText></span>}
      </DragGhost>
    </ManipulationShell>
  );
}
