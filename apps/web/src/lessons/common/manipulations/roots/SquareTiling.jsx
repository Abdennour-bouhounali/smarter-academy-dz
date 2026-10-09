import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import * as L from '../logic/squareTiling';

/**
 * square-tiling — LE CARRÉ DALLÉ (unité 2, leçons 4 et 5).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève ÉTIRE k, le nombre de dalles le long d'un côté (réglette
 *    `useStretchInteraction` ; clavier, − / +, toucher la règle).
 * B. Idée : un carré d'aire n = k² × b se pave en k × k dalles d'aire b, et
 *    son côté est k fois le côté d'une dalle : √(k² × b) = k√b = √(k²) × √b.
 * C. Pendant le geste, le grand carré se redécoupe en k × k dalles.
 * D. Au relâchement : l'égalité complète — ou le refus, avec n ÷ k² lu
 *    exactement quand la dalle n'aurait pas une aire entière.
 * E. À découvrir : product — la racine d'un produit est le produit des
 *    racines ; simplest — le plus grand k donne la plus petite dalle, qu'on
 *    ne peut plus paver (b أصغر ما يمكن).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        √(a² × b) = a√b ; a² le plus grand carré qui divise n
 *   OBJECT         un carré d'aire n, découpé en dalles carrées
 *   VARIABLE       k, le nombre de dalles par côté
 *   INVARIANT      l'aire n du grand carré, donc son côté √n
 *   TRANSFORMATION le découpage k × k, l'aire b et le côté √b d'une dalle
 *   CONSTRAINT     une dalle a une aire entière (k² divise n)
 *   RESISTANCE     k = 5 pour 72 : « 72 ÷ 25 = 2,88 » — pavage en pointillés, refusé
 *   EVIDENCE       le côté lu comme k côtés de dalle
 *   CONTRAST       un pavage juste / un pavage refusé ; (simplest) le plus
 *                  grand k / un k plus petit dont la dalle se pave encore
 *   PREDICTION     « quel k donnera la plus petite dalle ? »
 *   DISCOVERY      √(k² × b) = k × √b ; b minimal ⇔ k² le plus grand carré
 *   FORMALIZATION  خاصية 1 (معارف 4) ; طريقة p. 25
 *   TRANSFER       تمارين 18, 19, 26, 27 ; تبسيط A = √8 − 3√18 + 2√50 − 7√2
 */
export default function SquareTiling({
  n: n0 = 28, mode = 'product', title, lead, mission, level, levels: withLevels = true, initialMode = 'student', allowModeSwitch = false, onFinished, onTrial,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.squareTiling.${key}`, o), [t]);
  const state = useManipulation({ type: 'square-tiling', initialNumbers: { n: n0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { n } = state.numbers;

  const [lab, setLab] = useState(() => L.init({ n: n0, mode }));
  const [live, setLive] = useState(null);
  // Miroir synchrone de `lab` : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const labRef = useRef(lab);
  labRef.current = lab;
  const sceneKey = `${n}:${mode}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init({ n, mode })); setLive(null); }
  const range = L.range(lab);

  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, n); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const boxRef = useRef(null);
  const [width, setWidth] = useState(300);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(240, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const EDGE = 22;
  const span = Math.max(1, range.max - range.min);
  const mu = (width - 2 * EDGE) / span;
  const xOf = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: live ?? lab.k ?? L.defaultK(lab), range, toValue, onChange: setLive,
    // L'essai validé part vers la leçon HORS du setState (un updater reste pur).
    onCommit: (v) => {
      setLive(v);
      if (L.canTile(lab, v) !== true) return;
      setLab((s) => L.tile(s, v));
      state.report(onTrial, L.tiling(n, v));
    },
    direction: 'ltr',
  });

  // Un k PAR DÉFAUT (L.defaultK : jamais une réponse) : jamais vide à l'ouverture. Ce n'est pas un essai, seul `lab.tried` en garde la trace.
  const kk = live ?? lab.k ?? L.defaultK(lab);
  const t0 = kk == null ? null : L.tiling(n, kk);
  const settled = lab.k != null && !stretch.dragging && kk === lab.k;
  const current = settled ? lab.tried.find((x) => x.k === lab.k) : null;
  const box = Math.min(280, Math.max(200, width * 0.6));
  const cell = kk ? box / kk : box;
  const valid = t0?.valid;
  // Au repos, sans essai encore, la ligne de résultat montre la conséquence du k par défaut (sans prétendre que l'élève l'a fait).
  const shown = current ?? (lab.k == null && !stretch.dragging && live == null ? t0 : null);
  const eq = shown?.valid ? L.equationTex(n, shown) : null;
  const untried = () => Array.from({ length: L.range(labRef.current).max }, (_, i) => i + 1).filter((v) => !labRef.current.tried.some((x) => x.k === v));
  const runTrial = (v) => {
    labRef.current = L.tile(labRef.current, v);
    setLive(v);
    setLab((s) => L.tile(s, v));
    state.report(onTrial, L.tiling(n, v));
  };

  return (
    <ManipulationShell
      type="square-tiling"
      title={title ?? k('title', { n })}
      mission={mission ?? k(mode === 'simplest' ? 'missionSimplest' : 'missionProduct', { n })}
      lead={lead}
      state={state}
      numberFields={[{ key: 'n', label: 'n' }]}
      allowModeSwitch={allowModeSwitch}
      hints={(mode === 'simplest' ? [k('sHint1'), k('sHint2'), k('sHint3')] : [k('pHint1'), k('pHint2'), k('pHint3')]).map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: untried().length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const next = untried()[0]; if (next !== undefined) runTrial(next); },
          finish: () => { untried().forEach(runTrial); },
        },
      }}
      representation={shown && (shown.valid
        ? <EquationDisplay tex={eq} tone="ok" note={<MathText>{k('valid', { k: shown.k, b: shown.b })}</MathText>} />
        : <EquationDisplay tex={L.refusedTex(n, shown.k)} tone="ko" note={<MathText>{k('refused', { k: shown.k })}</MathText>} />)}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={mode === 'simplest' ? k('sPrompt', { n }) : k('pPrompt')}
          options={mode === 'simplest'
            ? [
              { text: <MathText>{k('sOpt2')}</MathText>, why: <MathText>{k('sWhy2', { n, big: L.kmax(lab) })}</MathText> },
              { text: <MathText>{k('sOpt1')}</MathText>, correct: true },
              { text: <MathText>{k('sOpt3')}</MathText>, why: <MathText>{k('sWhy3', { n, big: L.kmax(lab) })}</MathText> },
            ]
            : [
              { text: <MathText>{k('pOpt2')}</MathText>, why: <MathText>{k('pWhy2')}</MathText> },
              { text: <MathText>{k('pOpt3')}</MathText>, why: <MathText>{k('pWhy3')}</MathText> },
              { text: <MathText>{k('pOpt1')}</MathText>, correct: true },
            ]}
          formal={mode === 'simplest' ? (
            <div className="space-y-2" data-tiling-formal>
              <EquationDisplay tex={L.equationTex(n, L.tiling(n, L.kmax(lab)))} tone="result" note={<MathText>{k('sFormal', { n, simplest: L.simplestText(n) })}</MathText>} />
              <p className="text-sm text-slate-700"><MathText>{k('sRule')}</MathText></p>
            </div>
          ) : (
            <div className="space-y-2" data-tiling-formal>
              <EquationDisplay tex="\sqrt{k^2 \times b} = \sqrt{k^2} \times \sqrt{b} = k\sqrt{b}" tone="result" note={<MathText>{k('pFormal')}</MathText>} />
              <p className="text-sm text-slate-700"><MathText>{k('pRule')}</MathText></p>
            </div>
          )}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-emerald-50/60 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-square-tiling data-mode={mode}>
          <p className="text-sm font-bold text-slate-700">{k('perSide')}</p>
          <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 60 }} data-tiling-ruler>
            <svg width={width} height={60} className="absolute inset-0" aria-hidden="true" focusable="false">
              <rect x={EDGE - 4} y={26} width={span * mu + 8} height={5} rx={2} fill="#047857" />
              {Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).map((v) => {
                const tr = lab.tried.find((x) => x.k === v);
                return (
                  <g key={v}>
                    <line x1={xOf(v)} x2={xOf(v)} y1={33} y2={41} stroke="#64748B" />
                    <text x={xOf(v)} y={55} textAnchor="middle" fontSize={11} fill={tr ? (tr.valid ? '#047857' : '#BE123C') : '#334155'} fontWeight={tr ? 'bold' : 'normal'} fontFamily="ui-monospace, monospace">{v}</text>
                  </g>
                );
              })}
            </svg>
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: kk == null ? k('notSet') : k('valueText', { k: kk }) })}
              className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
              style={{ left: xOf(kk ?? range.min), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span className="-mt-2 rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-tiling-k>{kk ?? '?'}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('fewer')} disabled={kk != null && kk <= range.min}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
            <p className="min-w-[8rem] text-center text-sm font-bold text-slate-700">{kk == null ? k('notSet') : k('valueText', { k: kk })}</p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('more')} disabled={kk != null && kk >= range.max}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
          </div>

          <div className="grid gap-3 md:grid-cols-[auto_1fr]">
            <div className="flex justify-center rounded-2xl border-2 border-slate-200 bg-white p-2" dir="ltr">
              <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} role="img" data-tiling-square data-k={kk ?? ''} data-valid={t0 ? String(valid) : ''}
                aria-label={t0 == null ? k('notSet') : valid ? k('ariaValid', { n, k: kk, b: t0.b }) : k('ariaRefused', { n, k: kk })}>
                <rect x={1} y={1} width={box - 2} height={box - 2} fill={t0 == null ? '#F1F5F9' : valid ? '#D1FAE5' : '#FFE4E6'} stroke="#334155" strokeWidth={2} />
                {t0 && Array.from({ length: kk - 1 }, (_, i) => (
                  <g key={i}>
                    <line x1={(i + 1) * cell} x2={(i + 1) * cell} y1={0} y2={box} stroke={valid ? '#047857' : '#E11D48'} strokeDasharray={valid ? undefined : '5 4'} />
                    <line x1={0} x2={box} y1={(i + 1) * cell} y2={(i + 1) * cell} stroke={valid ? '#047857' : '#E11D48'} strokeDasharray={valid ? undefined : '5 4'} />
                  </g>
                ))}
                {t0 && valid && cell >= 26 && Array.from({ length: kk * kk }, (_, i) => (
                  <text key={i} x={(i % kk + 0.5) * cell} y={(Math.floor(i / kk) + 0.5) * cell + 4} textAnchor="middle" fontSize={Math.min(16, cell / 3)} fill="#065F46" fontFamily="ui-monospace, monospace" fontWeight="bold">{t0.b}</text>
                ))}
                {/* le côté : k côtés de dalle */}
                {t0 && valid && Array.from({ length: kk }, (_, i) => (
                  <line key={`s${i}`} x1={i * cell + 3} x2={(i + 1) * cell - 3} y1={box - 4} y2={box - 4} stroke="#0369A1" strokeWidth={4} strokeLinecap="round" />
                ))}
              </svg>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-bold text-slate-800"><MathText>{k('legend', { n })}</MathText></p>
              {t0 && valid && <p className="text-slate-700" dir="rtl"><MathText>{k('sideReading', { k: kk, b: t0.b })}</MathText></p>}
              {lab.tried.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" dir="ltr" data-tiling-tried>
                  {lab.tried.map((x) => (
                    <li key={x.k} data-tried-k={x.k} data-valid={String(x.valid)} className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${x.valid ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                      {x.valid ? `${x.k}² × ${x.b}` : `${x.k}² ∤ ${n}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
