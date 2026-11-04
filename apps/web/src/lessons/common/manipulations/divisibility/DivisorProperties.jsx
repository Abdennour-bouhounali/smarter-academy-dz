import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { measureLayout } from '../primitives/brickLayout';
import { useLabCoach } from '../primitives/LabCoach';
import MathText from '../../components/MathText';
import { useLabCheckpoint } from '../primitives/LabCheckpoint';
import { useLabCheckpointSettings } from '../primitives/labCheckpointSettings';
import { LabStepper, useStepCelebration } from '../primitives/LabSteps';
import { playSfx } from '../../utils/playEffect';
import { ordered } from './cpOrder';
import * as L from '../logic/divisorProperties';

const NS = 'manipulation.props';

/**
 * divisor-properties — LE CHANTIER DES MURS EN BRIQUES DE n.
 *
 * A. L'élève porte LE MUR DE b (un vrai mur, en briques de longueur n) vers
 *    l'une des trois zones du chantier : l'ACCOLER au mur de a (a + b),
 *    l'ENLEVER du mur de a (a − b), ou MESURER le mur de a avec des panneaux
 *    de b (le reste). (La preuve écrite est au module « أتعلّم البرهنة » ; le
 *    constructeur de preuve qui vivait ici n'était posé par aucune leçon, il
 *    a été retiré le 2026-09-30.)
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
 * ONBOARDING (prop `coach`, défaut true — `LabCoach`, §8quater) : `logic/divisorProperties.js › coachOf` montre le mur de b à porter
 * (et, au niveau avancé, la prédiction à choisir d'abord) ; la zone est désignée par son rang, jamais par ses mots.
 *
 * QUESTIONS PENDANT LE LABO (2026-10-28, `primitives/LabCheckpoint`) : TROIS ÉTAPES (`LabStepper`, `[data-dp-step=<i>]`), une par mur bâti (a + b, a − b, le reste) ; chaque mur
 * pose sa suite de questions (`CHAINS`, textes dans `props.cp.*`) par-dessus le chantier, dans l'ordre où l'élève les bâtit ; la suite du dernier mur (le reste) finit par
 * la RÈGLE, qui remplace la découverte automatique et formalise dans `onDone`. Obligatoires pour tout élève ; l'enseignant seul les coupe (`useLabCheckpointSettings`).
 * Le guide `LabCoach` se tait pendant une question. SON : `tooth` par mur posé, `flag` quand les trois sont bâtis, `over` pour un geste refusé.
 *
 * Thème `construction` (packages/core VISUAL_THEMES). Le geste est le même
 * à tous les niveaux ; au niveau avancé (900, 90, 9) les briques sont trop
 * petites pour être comptées : l'élève PRÉDIT avec la propriété — « طوب كامل »
 * ou « يبقى جزء من طوبة » — avant de bâtir chaque mur, et le mur bâti
 * confirme ou réfute (`predict` / `outcome`, 2026-09-30 : la prédiction était
 * promise sans exister).
 */

/** Les trois zones du chantier et le mesurande que chacune construit. */
const ZONES = Object.freeze([
  { id: 'join', target: 'sum', tone: 'emerald' },
  { id: 'remove', target: 'diff', tone: 'amber' },
  { id: 'measure', target: 'rem', tone: 'indigo' },
]);
const targetOfZone = (zoneId) => ZONES.find((z) => `zone:${z.id}` === zoneId)?.target ?? null;

export default function DivisorProperties({
  n: n0, a: a0, b: b0, title, lead, mission, initialMode = 'student', allowModeSwitch = false, onFinished, onTrial, coach: coachOn = true, checkpoints: cpOn = true,
}) {
  const { t } = useTranslation('lesson');
  const state = useManipulation({ type: 'divisor-properties', initialNumbers: { n: n0, a: a0, b: b0 }, initialMode, hintCount: 3 });
  const { n, a, b } = state.numbers;
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const [lab, setLab] = useState(() => L.init({ n: n0, a: a0, b: b0 }));
  const [reject, setReject] = useState(null);

  // « إعادة », d'autres nombres ou un autre niveau : TOUT recommence — les murs, les questions du labo, la fête
  const sceneKey = `${n}|${a}|${b}|${state.epoch}|${state.resetCount}`;
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init({ n, a, b })); setReject(null); }
  const [answered, setAnswered] = useState({ key: sceneKey, ids: [] });
  const answeredIds = answered.key === sceneKey ? answered.ids : [];

  // les questions pendant le labo : la suite du premier mur bâti dont les questions ne sont pas finies
  const cpSettings = useLabCheckpointSettings('divisor-properties');   // obligatoires pour tout élève ; l'enseignant seul peut les couper, pour SON compte
  const ruleByCheckpoint = cpOn && cpSettings.enabled;
  const pending = ruleByCheckpoint ? lab.built.find((x) => !answeredIds.includes(x)) : null;
  const chain = pending ? CHAINS[pending] : null;
  const cp = useLabCheckpoint({
    id: chain ? pending : null,
    questions: chain ? chain.map((q) => QUESTIONS[q]({ n, a, b, lab }, k)) : null,
    reached: true,
    resetKey: sceneKey,
    onRetry: () => setLab((s) => ({ ...s, built: s.built.filter((x) => x !== pending) })),
    onEvent: (ev) => state.report(onTrial, ev),
    onDone: (id) => {
      setAnswered((x) => ({ key: sceneKey, ids: [...(x.key === sceneKey ? x.ids : []), id] }));
      if (CHAINS[id].includes('rule')) { state.discover(); state.formalize(); }
    },
  });
  const stepDone = L.TARGETS.map((x) => lab.built.includes(x) && (!ruleByCheckpoint || answeredIds.includes(x)));
  const party = useStepCelebration();
  const celebrated = useRef({ key: sceneKey, set: new Set() });
  if (celebrated.current.key !== sceneKey) celebrated.current = { key: sceneKey, set: new Set() };
  useEffect(() => {
    stepDone.forEach((d, i) => {
      if (!d || celebrated.current.set.has(i)) return;
      celebrated.current.set.add(i);
      party.celebrate({ n: stepDone.filter(Boolean).length, total: L.TARGETS.length });
    });
  }, [stepDone.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  // le son : un pas par mur posé, le drapeau quand les trois sont bâtis
  const heard = useRef({ built: 0, at: 0 });
  useEffect(() => {
    const h = heard.current;
    if (lab.built.length !== h.built) {
      const now = Date.now();
      if (lab.built.length < h.built || now - h.at > 35) { playSfx('tooth', { pitch: lab.built.length > h.built ? 1 : 0.75 }); h.at = now; }
      if (lab.built.length === L.TARGETS.length && h.built < L.TARGETS.length) playSfx('flag');
      h.built = lab.built.length;
    }
  }, [lab.built.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAdvanced = state.level === 'advanced';
  const coachStep = coachOn && !cp.open ? L.coachOf(lab, { advanced: isAdvanced }) : null;
  const coachK = (key, o) => t(`manipulation.props.coach.${key}`, o);
  const coach = useLabCoach({
    lab: 'divisor-properties', step: coachStep, text: coachStep ? coachK(coachStep.id === 'carry-next' ? 'carryNext' : coachStep.id, { zone: coachK(`zone${coachStep.rank}`) }) : '',
    labels: { hide: coachK('hide'), show: coachK('show'), ok: coachK('ok'), stop: coachK('stop') },
  });

  const drag = useDragInteraction({
    onDrop: (sourceId, zoneId) => {
      setReject(null);
      if (sourceId === 'wall:b') {
        const target = targetOfZone(zoneId);
        if (!target) return;
        setLab((s) => L.build(s, target));
      }
    },
    accepts: (sourceId, zoneId) => {
      if (sourceId === 'wall:b') {
        const target = targetOfZone(zoneId);
        // Un mur déjà bâti : geste sans effet (refus muet, pas une erreur).
        if (target && lab.built.includes(target)) return '';
        return target ? L.canBuild(lab, target, { requirePrediction: isAdvanced }) : 'wrongZone';
      }
      return 'wrongZone';
    },
    onReject: (_s, _z, reason) => { if (reason) playSfx('over'); setReject(reason); },
  });

  // La découverte suit les trois murs bâtis — dans un effet, pas un updater.
  const ready = L.discoveryReady(lab) && !ruleByCheckpoint;
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tous les murs à la MÊME échelle : la plus grande longueur du chantier.
  const scale = Math.max(a + b, 1);
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
  // Une égalité dans une phrase arabe est ISOLÉE en LTR : sans cela,
  // « 18 = 3 × 6 » se relisait « 6 × 3 = 18 » (audit, défaut m).
  const eq = (text) => <bdi dir="ltr" className="font-mono">{text}</bdi>;
  const resultNote = (target) => {
    const r = L.blocks(lab, target);
    const lead = target === 'sum' ? t('manipulation.props.wallSum')
      : target === 'diff' ? t('manipulation.props.wallDiff')
        : t('manipulation.props.wallRem', { panels: t('manipulation.props.panels', { count: meas.q }), b });
    const guess = lab.predictions[target];
    const verdict = guess && (guess === L.outcome(lab, target) ? t('manipulation.props.predictRight') : t('manipulation.props.predictWrong'));
    return (
      <>
        {verdict && <span className={`me-1 ${guess === 'whole' ? 'text-emerald-800' : 'text-amber-800'}`} data-prediction-verdict={guess === L.outcome(lab, target) ? 'right' : 'wrong'}>{verdict}</span>}
        {!verdict && <span className="me-1">{lead}</span>}
        {eq(`${r.value} = ${n} × ${r.count}`)}
      </>
    );
  };

  return (
    <ManipulationShell
      type="divisor-properties"
      title={title ?? t('manipulation.props.title')}
      mission={mission ?? t('manipulation.props.wallMission', { n, a, b })}
      lead={lead}
      state={state}
      coach={coachOn ? coach : null}
      numberFields={[{ key: 'n', label: 'n' }, { key: 'a', label: 'a' }, { key: 'b', label: 'b' }]}
      validate={(x) => (x.a % x.n !== 0 || x.b % x.n !== 0 ? t('manipulation.props.mustDivideBoth') : x.a < x.b ? t('manipulation.props.aBeforeB') : '')}
      allowModeSwitch={allowModeSwitch}
      headerAction={cpOn ? cpSettings.control : null}
      guided={!!chain || ruleByCheckpoint}
      hints={[t('manipulation.props.hint1', { a, b }), t('manipulation.props.hint2'), t('manipulation.props.hint3', { n })]}
      // (réf. §6bis : MANUEL — trois opérations distinctes, rien ne se répète.)
      controller={{
        autoStep: () => {
          const next = L.TARGETS.find((x) => !lab.built.includes(x));
          if (!next) return false;
          setLab((s) => L.build(s, next));
          return true;
        },
        canAutoStep: () => lab.built.length < L.TARGETS.length,
        showSolution: () => { setLab((s) => L.TARGETS.reduce((acc, x) => L.build(acc, x), s)); state.discover(); state.formalize(); },
      }}
      representation={lab.built.length > 0 && (
        <div className="space-y-2">
          {lab.built.map((target) => {
            const r = L.blocks(lab, target);
            return <EquationDisplay key={target} tex={r.tex} tone="ok" size="sm" note={eq(`${r.value} = ${n} × ${r.count}`)} />;
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
            </div>
          )}
        />
      )}
      explanation={t('manipulation.props.explanation')}
    >
      <div className="relative min-h-[600px]" data-dp-glance>
      {party.node}
      {cp.node}
      <ManipulationStage dragging={drag.dragging} className="bg-gradient-to-b from-orange-50/60 to-white">
        <div className="space-y-3" data-brick-site>
          <LabStepper count={L.TARGETS.length} current={Math.max(0, stepDone.indexOf(false))} done={stepDone} stepAttr="data-dp-step" />
          {/* ── LES DEUX MURS, bâtis en briques de n, à la même échelle ──── */}
          <div className="space-y-2 rounded-2xl border-2 border-slate-200 bg-white p-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
              <NumberTile value={n} tone="quotient" size="sm" />
              <span>{t('manipulation.props.brickOf', { n })}</span>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600">{t('manipulation.props.wallA')}: {eq(`${a} = ${n} × ${lab.q}`)}</div>
              <BrickWall value={a} unit={n} scale={scale} tone="a" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600">{t('manipulation.props.wallB')}: {eq(`${b} = ${n} × ${lab.qp}`)}</div>
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
                      <p className="text-xs font-bold text-emerald-800">{resultNote(z.target)}</p>
                    </div>
                  ) : isAdvanced ? (
                    // LA PRÉDICTION : on s'engage AVANT de voir le mur.
                    <div className="flex flex-wrap items-center gap-1.5" data-prediction={lab.predictions[z.target] ?? ''}>
                      <span className="text-[11px] font-bold text-slate-600">{t('manipulation.props.predictPrompt')}</span>
                      {L.PREDICTIONS.map((g) => (
                        <button key={g} type="button" aria-pressed={lab.predictions[z.target] === g}
                          onClick={(e) => { e.stopPropagation(); setReject(null); setLab((s) => L.predict(s, z.target, g)); }}
                          className={`min-h-[44px] rounded-lg border-2 px-2.5 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${lab.predictions[z.target] === g ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                          {t(g === 'whole' ? 'manipulation.props.predictWhole' : 'manipulation.props.predictPartial')}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-6" aria-hidden="true" />
                  )}
                </DropZone>
              );
            })}
          </div>

          {reject && <p role="status" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{t(`manipulation.props.reject.${reject}`)}</p>}
        </div>
      </ManipulationStage>
      </div>
      <DragGhost ghost={drag.ghost}>
        {heldWall && (
          <span className="flex w-40 items-center gap-2 rounded-xl border-2 border-blue-500 bg-blue-50 px-2 py-1">
            <NumberTile value={b} tone="divisor" size="sm" />
            <BrickWall value={b} unit={n} scale={b} tone="b" className="flex-1" height="h-6" />
          </span>
        )}
      </DragGhost>
    </ManipulationShell>
  );
}

/* ══════════════ Les questions pendant le labo (primitives/LabCheckpoint) ══════════════ */

/** La suite de questions de chaque mur bâti : elle interroge ce que l'élève vient de FAIRE ; celle du reste finit par la RÈGLE. */
export const CHAINS = Object.freeze({
  sum: ['sumCount', 'sumWhole'],
  diff: ['diffCount', 'diffWhole'],
  rem: ['remPanels', 'remBricks', 'rule'],
});

const $ = (x) => `$${x}$`;
const Mx = (k, key, o) => <MathText>{k(`cp.${key}`, o)}</MathText>;

/** Chaque question est construite sur LES nombres de l'élève (rien n'est écrit en dur) ; `k` : les textes de `props`. */
const BUILD = {
  sumCount: ({ n, a, b, lab }, k) => {
    const c = lab.q + lab.qp;
    return {
      id: 'sumCount', kind: 'number', expected: String(c), answer: <MathText>{$(c)}</MathText>,
      prompt: Mx(k, 'sumCount.prompt', { n, a, b }),
      hints: [Mx(k, 'sumCount.hint1', { n, a, b, q: lab.q, qp: lab.qp }), Mx(k, 'sumCount.hint2', { q: lab.q, qp: lab.qp })],
      explain: Mx(k, 'sumCount.explain', { calc: $(`${a}+${b}=${n}\\times(${lab.q}+${lab.qp})=${n}\\times${c}`) }),
    };
  },
  sumWhole: ({ n, a, b, lab }, k) => {
    const o = { n, a, b, sum: a + b, c: lab.q + lab.qp };
    return {
      id: 'sumWhole', kind: 'choice',
      prompt: Mx(k, 'sumWhole.prompt', o),
      options: [
        { text: Mx(k, 'sumWhole.yes'), why: Mx(k, 'sumWhole.whyYes', o) },
        { text: Mx(k, 'sumWhole.wholeBecause', o), correct: true },
        { text: Mx(k, 'sumWhole.bigger'), why: Mx(k, 'sumWhole.whyBigger', o) },
      ],
      hints: [Mx(k, 'sumWhole.hint1', o), Mx(k, 'sumWhole.hint2', o)],
      explain: Mx(k, 'sumWhole.explain', o),
    };
  },
  diffCount: ({ n, a, b, lab }, k) => {
    const c = lab.q - lab.qp;
    return {
      id: 'diffCount', kind: 'number', expected: String(c), answer: <MathText>{$(c)}</MathText>,
      prompt: Mx(k, 'diffCount.prompt', { n, a, b }),
      hints: [Mx(k, 'diffCount.hint1', { a, q: lab.q, qp: lab.qp }), Mx(k, 'diffCount.hint2', { q: lab.q, qp: lab.qp })],
      explain: Mx(k, 'diffCount.explain', { calc: $(`${a}-${b}=${n}\\times(${lab.q}-${lab.qp})=${n}\\times${c}`) }),
    };
  },
  diffWhole: ({ n, a, b, lab }, k) => {
    const o = { n, a, b, diff: a - b, c: lab.q - lab.qp };
    return {
      id: 'diffWhole', kind: 'choice',
      prompt: Mx(k, 'diffWhole.prompt', o),
      options: [
        { text: Mx(k, 'diffWhole.smaller', o), why: Mx(k, 'diffWhole.whySmaller', o) },
        { text: Mx(k, 'diffWhole.wholeBoth', o), correct: true },
        { text: Mx(k, 'diffWhole.even'), why: Mx(k, 'diffWhole.whyEven', o) },
      ],
      hints: [Mx(k, 'diffWhole.hint1', o), Mx(k, 'diffWhole.hint2', o)],
      explain: Mx(k, 'diffWhole.explain', o),
    };
  },
  remPanels: ({ n, a, b, lab }, k) => ({
    id: 'remPanels', kind: 'number', expected: String(lab.k), answer: <MathText>{$(lab.k)}</MathText>,
    prompt: Mx(k, 'remPanels.prompt', { a, b }),
    hints: [Mx(k, 'remPanels.hint1', { b }), Mx(k, 'remPanels.hint2', { a, b })],
    explain: Mx(k, 'remPanels.explain', { calc: $(`${a}=${b}\\times${lab.k}+${lab.r}`) }),
  }),
  remBricks: ({ n, a, b, lab }, k) => {
    const c = lab.r / n;
    const o = { n, a, b, r: lab.r, c };
    return {
      id: 'remBricks', kind: 'number', expected: String(c), answer: <MathText>{$(c)}</MathText>,
      prompt: Mx(k, 'remBricks.prompt', o),
      hints: [Mx(k, 'remBricks.hint1', o), Mx(k, 'remBricks.hint2', o)],
      explain: Mx(k, 'remBricks.explain', { calc: $(`${lab.r}=${n}\\times${c}`), n }),
    };
  },
  rule: ({ n, lab }, k) => ({
    id: 'rule', kind: 'choice',
    prompt: <MathText>{k('discoverPrompt')}</MathText>,
    options: [
      { text: <MathText>{k('opt1', { n })}</MathText>, correct: true },
      { text: <MathText>{k('opt2', { n })}</MathText>, why: <MathText>{k('why2')}</MathText> },
      { text: <MathText>{k('opt3', { n })}</MathText>, why: <MathText>{k('why3')}</MathText> },
    ],
    hints: [Mx(k, 'rule.hint1', { n }), Mx(k, 'rule.hint2', { n, sum: lab.a + lab.b, diff: lab.a - lab.b, r: lab.r })],
    explain: Mx(k, 'rule.explain', { n }),
  }),
};

export const QUESTIONS = ordered(BUILD);
