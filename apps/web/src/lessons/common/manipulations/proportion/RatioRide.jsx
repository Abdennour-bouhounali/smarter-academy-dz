import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { Minus, Plus, ReceiptText, Eraser, Eye, CheckCheck } from 'lucide-react';
import { linear as Lin } from '@smarter-academy/core';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import LabFold from '../primitives/LabFold';
import MathText from '../../components/MathText';
import * as L from '../logic/ratioRide';

/**
 * ratio-ride — LE COMPTEUR DE TRAJET (unité 6 « الدالة الخطية والتناسبية », leçon 1
 * « التناسبية ومعامل التناسبية »). Monde `scooter` : des trottinettes électriques louées à la minute
 * sur le kornich des Sablettes (Alger).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève FAIT ROULER la trottinette le long de la règle du kornich : la position EST la durée x
 *    (useStretchInteraction ; glisser la trottinette, toucher la règle, −/+, flèches du clavier).
 *    Il ENREGISTRE la course (« سجّل الرحلة ») : la colonne (x ; y) entre dans SON tableau. Il JUGE
 *    chaque tableau (« تناسبي » / « غير تناسبي »), complète la colonne fantôme, écrit y = □ × x.
 * B. Idée : un tableau est de proportionnalité ⇔ y ÷ x est le même dans toutes les colonnes ;
 *    ce nombre est le coefficient a, et y = a × x. Un montant fixe (le déverrouillage) la casse.
 * C. Pendant le geste, la trottinette roule (ses roues tournent), le compteur lit le prix de chaque
 *    tarif ; à l'enregistrement, un ticket sort et la ligne des quotients y ÷ x se remplit (exacte).
 * D. Chaque colonne est un ESSAI (`onTrial`) ; un jugement faux est REFUSÉ en montrant les deux
 *    quotients qui diffèrent (ou la colonne 0 minute qui coûte déjà 50 DA), ou que tous valent a.
 * E. À découvrir : y ÷ x constant = معامل التناسبية ; le رابع المتناسب par × a ; y = a × x ;
 *    « 50 DA + 10 DA la minute » augmente aussi, mais n'est PAS proportionnel.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        جدول تناسبية : y ÷ x constant (a) ⇔ y = a × x ; un montant fixe la casse
 *   OBJECT         une trottinette sur la règle du kornich, son compteur, le tableau de l'élève
 *   VARIABLE       la durée x (minutes entières, 0 → 10 / 0 → 20) — la main tient la trottinette
 *   INVARIANT      le quotient y ÷ x du tarif proportionnel (15) : il ne bouge pas quand x bouge
 *   TRANSFORMATION le prix lu au compteur, la colonne enregistrée, sa ligne de quotient
 *   CONSTRAINT     un tableau n'est « تناسبي » que si TOUS ses quotients sont égaux (≥ 2 colonnes x ≠ 0)
 *   RESISTANCE     le jugement faux est refusé avec deux quotients à l'écran (« 60 ÷ 1 = 60 ≠ 100 ÷ 5 = 20 »),
 *                  la colonne (0 ; 50) ; la colonne fantôme fausse refusée avec son quotient (170 ÷ 12 ≠ 15)
 *   EVIDENCE       la ligne y ÷ x de SON tableau ; le verdict accepté
 *   CONTRAST       مبتدئ : le tableau jugé ET une durée hors de la règle (12) à calculer ;
 *                  متقدم : deux tarifs côte à côte, l'un accepté et l'autre refusé par ses quotients
 *   PREDICTION     le prix de la colonne fantôme (12 min, hors de la règle) avant toute course
 *   DISCOVERY      « y ÷ x هو نفسه في كل الأعمدة: معامل التناسبية » (distracteurs réfutés par les propres
 *                  colonnes : « le FARQ y − x est constant », « il suffit que y augmente avec x »)
 *   FORMALIZATION  \dfrac{30}{2} = \dfrac{75}{5} = … = 15 ; y = 15 × x ; 12 × 15 = 180
 *   TRANSFER       la remise de l'Aïd (نشاط 1 س 1 : 50 → 40, a = 0,8) ; معارف (خواص, الرابع المتناسب) ;
 *                  ex-16 / ex-17 / ex-18 ; la fonction linéaire de la leçon 2
 * Manuel (§6bis) : chaque colonne et chaque jugement est une décision — pas d'auto-complétion.
 * Niveaux : مبتدئ = un tarif (15x), règle 0–10, quotients visibles, colonne fantôme ; متقدم = deux tarifs
 * (15x et 10x + 50), règle 0–20, quotients cachés jusqu'à ce que l'élève les demande, décider seul,
 * écrire y = □ × x.
 *
 * DÉCOR (exigence du propriétaire) : la mer, deux palmiers (qui se balancent au toucher), la trottinette
 * qui s'incline pendant le glisser, ses roues qui tournent avec x, un ticket qui sort du compteur à chaque
 * course — `aria-hidden`, `[data-deco]`, jamais une information du lab, immobile sous
 * `prefers-reduced-motion`.
 *
 * D'UN SEUL REGARD (MANIPULATION_CONTRACT §8bis) : la scène, ses commandes (−/+, سجّل), le compteur, le
 * tableau et les jugements tiennent dans la hauteur de l'écran de leçon (`useLessonViewport`) : large
 * (≥ 620 px) scène et commandes côte à côte ; sinon les commandes juste sous la scène, dont la hauteur
 * vient de ce qui reste (écran − commandes mesurées) ; le tableau est plafonné à 5 colonnes (un bloc
 * compact, jamais une bande). Le secondaire (les formules des tarifs) est dans un `LabFold` sous la
 * manipulation. Mesuré par apps/web/e2e/lesson-kit/4am-tanasub-muamil.mjs aux quatre viewports.
 *
 * Props : `plans` (« 15x » | « 15x|10x+50 », écrits comme le manuel), `theme` ('scooter'), `title`,
 * `lead`, `mission`, `level`, `levels` (false : posé seul sans sélecteur), `onTrial(t)` à chaque colonne
 * enregistrée ({ x, columns, rows: [{ id, y, ratio }] }), `onJudged({ id, says, ok })` à chaque jugement,
 * `onFinished` à la règle formelle — tous par `state.report`.
 *
 * CONTRAT DOM : [data-ratio-ride][data-plans][data-x][data-columns][data-layout][data-judged],
 * [data-ride-glance], [data-ride-scene], [data-stretch-handle][data-ride-handle], [data-ride-less|more],
 * [data-ride-meter=A|B][data-y], [data-ride-record], [data-ride-clear], [data-ride-table],
 * [data-ride-col=<x>], [data-ride-y=<plan>:<x>], [data-ride-ratio=<plan>:<x>], [data-ride-reveal],
 * [data-ride-claim=<plan>:yes|no], [data-ride-judged=<plan>], [data-ride-verdict=<kind>],
 * [data-ride-ghost][data-x], [data-ride-ghost-input], [data-ride-formula], [data-ride-formula-input],
 * [data-ride-formal], [data-deco], [data-lab-fold=ratio-ride.plans].
 */
const COLORS = { A: '#0F766E', B: '#C2410C' };

export default function RatioRide({
  plans: plans0 = '15x', theme = 'scooter', title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onJudged, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.ratioRide.${key}`, o), [t]);
  const w = useCallback((key, o) => t(`manipulation.ratioRide.worlds.${theme}.${key}`, o), [t, theme]);
  const state = useManipulation({ type: 'ratio-ride', initialNumbers: { plans: plans0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { plans } = state.numbers;

  const make = () => L.init({ plans });
  const [lab, setLab] = useState(make);
  const sceneKey = `${plans}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [liveX, setLiveX] = useState(null);
  const [ghostRaw, setGhostRaw] = useState('');
  const [formulaRaw, setFormulaRaw] = useState('');
  if (scene !== sceneKey) { setScene(sceneKey); setLab(make()); setLiveX(null); setGhostRaw(''); setFormulaRaw(''); }

  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, plans); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chaque NOUVELLE colonne est rapportée à la leçon (sa table `[data-activity-evidence]`).
  useEffect(() => {
    const last = lab.last;
    if (!last || last.kind !== 'recorded') return;
    const x = last.x;
    state.report(onTrial, {
      x, columns: lab.columns, plans,
      rows: lab.plans.map((p) => {
        const y = L.price(lab, p.id, x);
        return { id: p.id, y: L.numText(y), ratio: x === 0 ? null : L.numText(Lin.div(y, x)) };
      }),
    });
  }, [lab.recorded]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const last = lab.last;
    if (!last || !['yesOk', 'yesRefused', 'noOk', 'noRefused'].includes(last.kind)) return;
    state.report(onJudged, { id: last.id, says: last.kind.startsWith('yes') ? 'yes' : 'no', ok: last.kind.endsWith('Ok') });
  }, [lab.last]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure : la largeur de la scène et la HAUTEUR de l'écran de leçon ── */
  const boxRef = useRef(null);
  const ctrlRef = useRef(null);
  const [width, setWidth] = useState(300);
  const [ctrlH, setCtrlH] = useState(260);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(180, Math.floor(el.clientWidth)));
      if (ctrlRef.current) setCtrlH(Math.ceil(ctrlRef.current.getBoundingClientRect().height));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (ctrlRef.current) ro.observe(ctrlRef.current);
    return () => ro.disconnect();
  }, []);
  const vp = useLessonViewport(true);
  const screenH = vp.ready && vp.height > 0 ? vp.height : 576;
  const budget = Math.max(300, screenH - 8);
  const wide = width >= 620;
  const narrow = width < 340;
  const GAP = 12;
  const colW = wide ? Math.floor((width - GAP) * 0.5) : width;
  // la scène prend ce qui reste : à côté des commandes (large) ou au-dessus d'elles (empilé)
  const sceneH = wide
    ? Math.round(Math.min(230, Math.max(130, colW * 0.62), budget - 20))
    : Math.round(Math.max(92, Math.min(narrow ? 120 : 160, width * 0.42, budget - ctrlH - GAP - 16)));

  /* ── la durée : la trottinette sur la règle ── */
  const EDGE = 26;
  const range = lab.range;
  const mu = (colW - 2 * EDGE) / Math.max(1, range.max - range.min);
  const toValue = useCallback((cx, _y, rect) => range.min + (cx - rect.left - EDGE) / mu, [range.min, mu]);
  const stretch = useStretchInteraction({
    value: liveX, range, toValue, onChange: setLiveX, onCommit: setLiveX, direction: 'ltr',
  });
  const X = liveX;

  const doRecord = () => { stretch.flush(); setLab((s) => L.record(s, X)); };
  const doClaim = (id, says) => setLab((s) => L.claim(s, id, says));
  const doGhost = (e) => { e?.preventDefault?.(); setLab((s) => L.ghostTry(s, ghostRaw)); };
  const doFormula = (e) => { e?.preventDefault?.(); setLab((s) => L.formulaTry(s, formulaRaw)); };

  /* ── les mots ── */
  const planLetter = (id) => (lab.two ? k(id === 'A' ? 'planA' : 'planB') : '');
  const planName = (p) => (p.linear
    ? w('planLinear', { a: L.numText(p.rule.a) })
    : w('planAffine', { a: L.numText(p.rule.a), b: L.numText(p.rule.b) }));
  const tableName = (id) => (lab.two ? k('tableOf', { letter: planLetter(id) }) : k('tableMine'));
  const $ = (tex) => `$${tex}$`;

  const last = lab.last;
  const verdict = last && (() => {
    switch (last.kind) {
      case 'recorded': return <span className="text-slate-700"><MathText>{k('vRecorded', { x: $(`x = ${last.x}`) })}</MathText></span>;
      case 'dup': return <span className="text-slate-600"><MathText>{k('vDup', { x: $(`x = ${last.x}`) })}</MathText></span>;
      case 'full': return <span className="text-amber-800">{k('vFull', { n: L.MAX_COLUMNS })}</span>;
      case 'noX': return <span className="text-slate-600">{k('vNoX')}</span>;
      case 'cleared': return <span className="text-slate-600">{k('vCleared')}</span>;
      case 'few': return <span className="text-amber-800">{k('vFew')}</span>;
      case 'yesOk': return <span className="text-emerald-800"><MathText>{k('vYesOk', { table: tableName(last.id), a: $(L.numTex(last.a)) })}</MathText></span>;
      case 'noOk': return <span className="text-emerald-800"><MathText>{witnessText('vNoOk', last.id, last.witness)}</MathText></span>;
      case 'yesRefused': return <span className="text-rose-800" data-ride-refused="yes"><MathText>{witnessText('vYesRefused', last.id, last.witness)}</MathText></span>;
      case 'noRefused': return <span className="text-rose-800" data-ride-refused="no"><MathText>{k('vNoRefused', { table: tableName(last.id), a: $(L.numTex(last.a)) })}</MathText></span>;
      case 'ghostOk': return <span className="text-emerald-800"><MathText>{k('vGhostOk', { line: $(`${last.x} \\times ${L.numTex(last.a)} = ${L.numTex(last.y)}`) })}</MathText></span>;
      case 'ghostWrong': return <span className="text-rose-800" data-ride-refused="ghost"><MathText>{k('vGhostWrong', { q: $(L.quotientTex(last.x, last.y, last.r)), a: $(L.numTex(last.a)) })}</MathText></span>;
      case 'formulaOk': return <span className="text-emerald-800"><MathText>{k('vFormulaOk', { f: $(`y = ${L.numTex(last.a)} \\times x`) })}</MathText></span>;
      case 'formulaWrong': return <span className="text-rose-800" data-ride-refused="formula"><MathText>{k('vFormulaWrong', { line: $(`${L.numTex(last.a)} \\times ${last.x} = ${L.numTex(last.got)}`), want: $(L.numTex(last.want)), x: last.x })}</MathText></span>;
      case 'syntax': return <span className="text-slate-700">{k('vSyntax')}</span>;
      case 'ghostLocked':
      case 'formulaLocked': return <span className="text-slate-700">{k('vLocked')}</span>;
      default: return null;
    }
  })();
  function witnessText(key, id, wt) {
    if (wt.kind === 'zero') return k(`${key}Zero`, { table: tableName(id), y: L.numText(wt.y) });
    return k(key, { table: tableName(id), q1: $(L.quotientTex(wt.c1.x, wt.c1.y, wt.c1.r)), q2: $(L.quotientTex(wt.c2.x, wt.c2.y, wt.c2.r)) });
  }

  /* ── la découverte : distracteurs réfutés par les colonnes de l'élève ── */
  const lp = L.linearPlan(lab);
  const discoveryOptions = useMemo(() => {
    if (!lp) return [];
    const tA = L.table(lab, lp.id);
    const cols = tA.xs.map((x, i) => ({ x, y: tA.ys[i] })).filter((c) => c.x !== 0);
    const opts = [{ text: <MathText>{k('dRight')}</MathText>, correct: true }];
    if (cols.length >= 2) {
      const d = (c) => $(`${L.numTex(c.y)} - ${c.x} = ${L.numTex(Lin.sub(c.y, c.x))}`);
      opts.unshift({ text: <MathText>{k('dDiff')}</MathText>, why: <MathText>{k('dWhyDiff', { d1: d(cols[0]), d2: d(cols[cols.length - 1]) })}</MathText> });
    }
    const other = lab.plans.find((p) => !p.linear);
    const wt = other ? L.witness(lab, other.id) : null;
    const g = wt && wt.kind === 'differ'
      ? { q1: $(L.quotientTex(wt.c1.x, wt.c1.y, wt.c1.r)), q2: $(L.quotientTex(wt.c2.x, wt.c2.y, wt.c2.r)) }
      : { q1: $(L.quotientTex(1, Lin.frac(60), Lin.frac(60))), q2: $(L.quotientTex(5, Lin.frac(100), Lin.frac(20))) };
    opts.push({ text: <MathText>{k('dGrow')}</MathText>, why: <MathText>{k('dWhyGrow', g)}</MathText> });
    return opts;
  }, [lab, k]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la représentation vivante : la course en cours ── */
  const repTex = X == null ? 'x = \\;?' : lab.plans.map((p) => `${lab.two ? `y_{${p.id}}` : 'y'} = ${L.numTex(L.price(lab, p.id, X))}`).join(' \\quad ');
  const representation = (
    <EquationDisplay tone="neutral" tex={X == null ? repTex : `x = ${X} \\quad ${repTex}`} note={<span>{k('repNote', { count: lab.columns.length })}</span>} />
  );

  const judgedAll = L.allJudged(lab);
  const ghostOpen = !lab.two && lp && lab.verdicts[lp.id] === 'yes';
  const formulaOpen = lab.two && lp && lab.verdicts[lp.id] === 'yes';

  const nudgeBtn = (d) => (
    <button type="button" onClick={() => stretch.nudge(d)} aria-label={k(d < 0 ? 'less' : 'more')} disabled={X != null && (d < 0 ? X <= range.min : X >= range.max)}
      {...(d < 0 ? { 'data-ride-less': '' } : { 'data-ride-more': '' })}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white/90 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
      {d < 0 ? <Minus className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
  const tableFull = lab.columns.length >= L.MAX_COLUMNS;
  const clearBtn = (
    <button type="button" onClick={() => setLab((s) => L.clear(s))} data-ride-clear
      className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
      <Eraser className="h-4 w-4" aria-hidden="true" /> {k('clear')}
    </button>
  );

  const controls = (
    <div ref={ctrlRef} className="space-y-2" data-ride-controls>
      {/* compteur + −/+ + سجّل (étroit : −/+ posés SUR la scène, à côté de la trottinette) */}
      <div className="flex flex-wrap items-center gap-2">
        <div dir="ltr" className="flex items-center gap-1">
          {!narrow && nudgeBtn(-1)}
          <span className="min-w-[3.2rem] rounded-xl bg-slate-900 px-2 py-1 text-center font-mono text-base font-extrabold text-lime-300" aria-label={k('durationAria')} data-ride-x={X ?? ''}>{X == null ? '–' : X}<span className="text-[10px] text-lime-200"> {k('minShort')}</span></span>
          {!narrow && nudgeBtn(1)}
        </div>
        {narrow && tableFull ? clearBtn : <button type="button" onClick={doRecord} data-ride-record
          className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-teal-700 bg-teal-700 px-3 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <ReceiptText className="h-4 w-4" aria-hidden="true" /> {narrow ? <><span aria-hidden="true">{k('recordShort')}</span><span className="sr-only">{k('record')}</span></> : k('record')}
        </button>}
      </div>
      <div className={lab.two ? 'grid grid-cols-2 gap-1.5' : ''}>
        {lab.plans.map((p) => (
          <p key={p.id} className="flex items-baseline gap-1 rounded-lg border px-2 py-1 text-xs font-bold" style={{ borderColor: COLORS[p.id] }} data-ride-meter={p.id} data-y={X == null ? '' : L.numText(L.price(lab, p.id, X))}>
            <span style={{ color: COLORS[p.id] }}>{lab.two ? planLetter(p.id) : k('price')}</span>
            <bdi dir="ltr" className="font-mono text-sm text-slate-900">{X == null ? '…' : `${L.numText(L.price(lab, p.id, X))} DA`}</bdi>
          </p>
        ))}
      </div>

      {/* le tableau de l'élève */}
      <RideTable lab={lab} k={k} planLetter={planLetter} narrow={narrow} ghostOpen={ghostOpen} />
      {(!lab.showRatios || (!narrow && lab.columns.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2">
          {!lab.showRatios && (
            <button type="button" onClick={() => setLab((s) => L.revealRatios(s))} data-ride-reveal
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-slate-300 bg-white px-2 text-xs font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              <Eye className="h-4 w-4" aria-hidden="true" /> <MathText>{k('reveal')}</MathText>
            </button>
          )}
          {!narrow && lab.columns.length > 0 && clearBtn}
        </div>
      )}

      {/* les jugements */}
      <div className="space-y-1" data-ride-claims>
        {lab.plans.map((p) => {
          const v = lab.verdicts[p.id];
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-extrabold" style={{ color: COLORS[p.id] }}>{narrow ? (v ? (lab.two ? `${planLetter(p.id)}:` : '') : (lab.two ? k('claimQ', { letter: planLetter(p.id) }) : k('claimQMine'))) : tableName(p.id)}</span>
              {v ? (
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${v === 'yes' ? 'bg-emerald-100 text-emerald-900' : 'bg-orange-100 text-orange-900'}`} data-ride-judged={p.id} data-says={v}>
                  {v === 'yes' ? k('judgedYes') : k('judgedNo')}
                </span>
              ) : (
                ['yes', 'no'].map((says) => (
                  <button key={says} type="button" onClick={() => doClaim(p.id, says)} data-ride-claim={`${p.id}:${says}`}
                    aria-label={k(says === 'yes' ? 'claimYesAria' : 'claimNoAria', { table: tableName(p.id) })}
                    className={`inline-flex min-h-[44px] items-center rounded-xl border-2 bg-white px-2.5 text-xs font-bold focus:outline-none focus-visible:ring-2 ${says === 'yes' ? 'border-emerald-600 text-emerald-800 focus-visible:ring-emerald-400' : 'border-orange-600 text-orange-800 focus-visible:ring-orange-400'}`}>
                    {narrow ? k(says === 'yes' ? 'yesShort' : 'noShort') : k(says === 'yes' ? 'claimYes' : 'claimNo')}
                  </button>
                ))
              )}
            </div>
          );
        })}
      </div>

      {ghostOpen && (
        <form onSubmit={doGhost} className="flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-teal-500 bg-teal-50/60 px-2 py-1" data-ride-ghost data-x={lab.ghost.x} data-done={lab.ghost.done ? 'true' : 'false'}>
          <span className="text-xs font-bold text-teal-900"><MathText>{k('ghostLabel', { x: $(`x = ${lab.ghost.x}`) })}</MathText></span>
          <span dir="ltr" className="inline-flex items-center gap-1 font-mono text-sm">
            y =
            <input value={lab.ghost.done ? L.numText(L.price(lab, lp.id, lab.ghost.x)) : ghostRaw} onChange={(e) => setGhostRaw(e.target.value)} disabled={lab.ghost.done}
              inputMode="decimal" aria-label={k('ghostAria', { x: lab.ghost.x })} placeholder="?" data-ride-ghost-input
              className="h-11 w-20 rounded-lg border-2 border-teal-400 bg-white px-1 text-center text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" />
          </span>
          {!lab.ghost.done && <button type="submit" className="min-h-[44px] rounded-xl border-2 border-teal-700 bg-white px-2 text-xs font-bold text-teal-900">{k('ghostCheck')}</button>}
        </form>
      )}
      {formulaOpen && (
        <form onSubmit={doFormula} className="flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-teal-500 bg-teal-50/60 px-2 py-1" data-ride-formula data-done={lab.formula.done ? 'true' : 'false'}>
          <span className={narrow ? 'sr-only' : 'text-xs font-bold text-teal-900'}>{k('formulaLabel', { table: tableName(lp.id) })}</span>
          <span dir="ltr" className="inline-flex items-center gap-1 font-mono text-sm">
            y =
            <input value={lab.formula.done ? L.numText(lp.rule.a) : formulaRaw} onChange={(e) => setFormulaRaw(e.target.value)} disabled={lab.formula.done}
              inputMode="decimal" aria-label={k('formulaAria')} placeholder="?" data-ride-formula-input
              className="h-11 w-14 rounded-lg border-2 border-teal-400 bg-white px-1 text-center text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" />
            × x
          </span>
          {!lab.formula.done && <button type="submit" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 border-teal-700 bg-white px-2 text-xs font-bold text-teal-900">{narrow ? <><CheckCheck className="h-4 w-4" aria-hidden="true" /><span className="sr-only">{k('formulaCheck')}</span></> : k('formulaCheck')}</button>}
        </form>
      )}
      <p role="status" className={`min-h-[2.5rem] font-bold leading-snug ${narrow ? 'text-xs' : 'text-sm'}`} data-ride-verdict={last?.kind ?? ''}>{verdict}</p>
    </div>
  );

  const sol = state.isFormal || state.isDiscovered;
  const other = lab.plans.find((p) => !p.linear);
  const otherW = other ? L.witness(lab, other.id) : null;

  return (
    <ManipulationShell
      type="ratio-ride"
      title={title ?? k('title')}
      mission={mission ?? k(lab.two ? 'missionTwo' : 'missionOne')}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={[k('hint1'), k(lab.two ? 'hint2Two' : 'hint2'), k('hint3')].map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      representation={representation}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k('dPrompt')}
          options={discoveryOptions}
          formal={sol && lp && (
            <div className="space-y-2" data-ride-formal>
              <EquationDisplay tone="neutral" tex={L.equalRatiosTex(lab, lp.id)} note={<MathText>{k('fRatios')}</MathText>} />
              <EquationDisplay tone="result" tex={L.planTex(lp)} note={<MathText>{k('fCoef', { a: $(L.numTex(lp.rule.a)) })}</MathText>} />
              {!lab.two && lab.ghost.done && (
                <EquationDisplay tone="neutral" tex={`${lab.ghost.x} \\times ${L.numTex(lp.rule.a)} = ${L.numTex(L.price(lab, lp.id, lab.ghost.x))}`} note={<MathText>{k('fGhost')}</MathText>} />
              )}
              {otherW && (
                <EquationDisplay tone="ko" tex={otherW.kind === 'zero' ? `x = 0 \\;\\Rightarrow\\; y = ${L.numTex(otherW.y)} \\neq 0` : `${L.quotientTex(otherW.c1.x, otherW.c1.y, otherW.c1.r)} \\neq ${L.quotientTex(otherW.c2.x, otherW.c2.y, otherW.c2.r)}`}
                  note={<MathText>{k('fNotProp', { b: L.numText(other.rule.b) })}</MathText>} />
              )}
              <p className="text-sm text-emerald-900"><MathText>{k('fRule')}</MathText></p>
            </div>
          )}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-sky-50/70 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-2" data-ratio-ride data-plans={plans} data-x={X ?? ''} data-columns={lab.columns.join(',')}
          data-layout={wide ? 'side' : narrow ? 'narrow' : 'stack'} data-judged={judgedAll ? 'true' : 'false'} data-budget={budget} data-scene-h={sceneH}>
          <div className={wide ? 'grid grid-cols-2 items-start gap-3' : 'space-y-2'} data-ride-glance>
            <Promenade width={colW} height={sceneH} edge={EDGE} range={range} x={X} stretch={stretch} recorded={lab.recorded}
              handleLabel={k('handle')} valueText={X == null ? k('notSet') : k('minutes', { count: X })} place={narrow ? null : w('place')}
              overlay={narrow ? <>{nudgeBtn(-1)}{nudgeBtn(1)}</> : null} />
            {controls}
          </div>
          <LabFold id="ratio-ride.plans" title={k('plansTitle')}>
            <ul className="space-y-0.5 text-xs text-slate-700" data-ride-plans>
              {lab.plans.map((p) => (
                <li key={p.id}><span className="font-bold" style={{ color: COLORS[p.id] }}>{lab.two ? `${planLetter(p.id)} — ` : ''}</span>{planName(p)}</li>
              ))}
            </ul>
          </LabFold>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ── le tableau de l'élève : x, y (par tarif), y ÷ x (exact) ── */
function RideTable({ lab, k, planLetter, narrow, ghostOpen }) {
  const cols = lab.columns;
  const lp = L.linearPlan(lab);
  const cell = narrow ? 'px-0.5 py-0 text-[11px] leading-5' : 'px-1.5 py-1 text-xs';
  const head = `${cell} bg-slate-100 font-extrabold text-slate-700 text-start whitespace-nowrap`;
  const ghost = ghostOpen ? lab.ghost : null;
  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-white" data-ride-table>
      {cols.length === 0 ? (
        <p className="px-2 py-1.5 text-xs text-slate-500">{k('tableEmpty')}</p>
      ) : (
        <table dir="ltr" className="w-full table-fixed border-collapse text-center font-mono">
          <tbody>
            <tr>
              <th scope="row" className={head}>x</th>
              {cols.map((x) => <td key={x} className={`${cell} border-s border-slate-200 font-bold text-slate-900`} data-ride-col={x}>{x}</td>)}
              {ghost && <td className={`${cell} border-s-2 border-dashed border-teal-500 font-bold text-teal-800`} data-ride-col="ghost">{ghost.x}</td>}
            </tr>
            {lab.plans.map((p) => {
              const tb = L.table(lab, p.id);
              return (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-slate-200">
                    <th scope="row" className={head} style={{ color: COLORS[p.id] }}>y{lab.two ? <sub>{planLetter(p.id)}</sub> : null}</th>
                    {cols.map((x, i) => <td key={x} className={`${cell} border-s border-slate-200 text-slate-900`} data-ride-y={`${p.id}:${x}`}>{L.numText(tb.ys[i])}</td>)}
                    {ghost && <td className={`${cell} border-s-2 border-dashed border-teal-500 text-teal-800`}>{p.id === lp?.id && lab.ghost.done ? L.numText(L.price(lab, p.id, ghost.x)) : '?'}</td>}
                  </tr>
                  {lab.showRatios && (
                    <tr className="border-t border-dashed border-slate-200 bg-slate-50/70">
                      <th scope="row" className={`${head} font-bold`} style={{ color: COLORS[p.id] }}>y÷x</th>
                      {cols.map((x, i) => (
                        <td key={x} className={`${cell} border-s border-slate-200 font-bold`} style={{ color: COLORS[p.id] }} data-ride-ratio={`${p.id}:${x}`}>
                          {tb.ratios[i] ? (narrow ? L.numText(tb.ratios[i]) : <MathText>{`$${L.numTex(tb.ratios[i])}$`}</MathText>) : '—'}
                        </td>
                      ))}
                      {ghost && <td className={`${cell} border-s-2 border-dashed border-teal-500`}>{p.id === lp?.id && lab.ghost.done ? <MathText>{`$${L.numTex(lp.rule.a)}$`}</MathText> : ''}</td>}
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── le kornich : mer, palmiers, la règle des minutes et la trottinette (la poignée) ── */
function Promenade({ width, height, edge, range, x, stretch, recorded, handleLabel, valueText, place, overlay }) {
  const reduce = useReducedMotion();
  const [sway, setSway] = useState(0);
  const steps = Math.max(1, range.max - range.min);
  const mu = (width - 2 * edge) / steps;
  const px = (v) => edge + (v - range.min) * mu;
  const shown = x ?? range.min;
  const seaY = Math.round(height * 0.32);
  const roadY = Math.round(height * 0.56);
  const rulerY = Math.round(height * 0.80);
  const every = steps <= 10 ? 1 : width < 300 ? 5 : 2;
  const grads = Array.from({ length: steps + 1 }, (_, i) => range.min + i);
  const scooterH = Math.max(40, Math.min(64, Math.round(height * 0.42)));
  const wheel = (x ?? 0) * 140;
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200" style={{ height }} data-ride-scene>
      <div {...stretch.trackProps} dir="ltr" className="absolute inset-0" style={{ ...stretch.trackProps.style }}>
        <svg width={width} height={height} className="absolute inset-0" aria-hidden="true" focusable="false">
          <style>{'.rr-sway{transform-box:fill-box;transform-origin:50% 100%;animation:rr-s .7s ease-in-out 2}@keyframes rr-s{0%,100%{transform:rotate(0)}50%{transform:rotate(-6deg)}}.rr-ticket{animation:rr-t .6s ease-out 1}@keyframes rr-t{0%{transform:translateY(-14px);opacity:0}100%{transform:translateY(0);opacity:1}}@media (prefers-reduced-motion: reduce){.rr-sway,.rr-ticket{animation:none}}'}</style>
          <defs>
            <linearGradient id="rr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BAE6FD" /><stop offset="1" stopColor="#E0F2FE" /></linearGradient>
            <linearGradient id="rr-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0EA5E9" /><stop offset="1" stopColor="#0369A1" /></linearGradient>
          </defs>
          <rect x="0" y="0" width={width} height={seaY} fill="url(#rr-sky)" />
          <circle cx={width - 30} cy={Math.max(14, seaY * 0.4)} r={Math.max(8, seaY * 0.22)} fill="#FDE047" opacity="0.9" />
          <rect x="0" y={seaY} width={width} height={roadY - seaY} fill="url(#rr-sea)" />
          {[0.3, 0.62].map((f) => (
            <path key={f} d={`M0 ${seaY + (roadY - seaY) * f} ${Array.from({ length: Math.ceil(width / 24) + 1 }, (_, i) => `q 6 -3 12 0 t 12 0`).join(' ')}`}
              fill="none" stroke="#BAE6FD" strokeWidth="1.2" opacity="0.7" />
          ))}
          {/* le kornich : garde-corps et pavés */}
          <rect x="0" y={roadY - 4} width={width} height="4" fill="#F8FAFC" />
          {Array.from({ length: Math.ceil(width / 18) }, (_, i) => <rect key={i} x={i * 18 + 6} y={roadY - 14} width="2" height="10" fill="#F8FAFC" />)}
          <rect x="0" y={roadY} width={width} height={rulerY - roadY} fill="#E7D7BC" />
          <rect x="0" y={rulerY} width={width} height={height - rulerY} fill="#F8FAFC" />
          {/* la règle des minutes (la grandeur que la main tient) */}
          <line x1={edge} x2={width - edge} y1={rulerY + 3} y2={rulerY + 3} stroke="#0F766E" strokeWidth="3" />
          {grads.map((u) => {
            const major = (u - range.min) % every === 0 || u === range.max;
            return (
              <g key={u}>
                <line x1={px(u)} x2={px(u)} y1={rulerY + 3} y2={rulerY + (major ? 10 : 7)} stroke="#475569" strokeWidth={major ? 1.4 : 1} />
                {major && <text x={px(u)} y={Math.min(height - 2, rulerY + 20)} textAnchor="middle" fontSize="10" fill="#334155" fontFamily="ui-monospace, monospace">{u}</text>}
              </g>
            );
          })}
          {x != null && <rect x={edge} y={rulerY + 1} width={Math.max(0, px(x) - edge)} height="5" rx="2" fill="#84CC16" opacity="0.85" />}
        </svg>
        {/* le décor qu'on touche : deux palmiers */}
        <button type="button" tabIndex={-1} aria-hidden="true" data-deco="palms" onPointerDown={(e) => e.stopPropagation()} onClick={() => { if (!reduce) setSway((n) => n + 1); }}
          className="absolute focus:outline-none" style={{ left: 2, top: Math.max(0, roadY - 70), width: 34, height: 64 }}>
          <svg viewBox="0 0 34 64" width="34" height="64" key={sway} className={sway && !reduce ? 'rr-sway' : undefined}>
            <path d="M17 64 Q15 40 18 20" stroke="#92400E" strokeWidth="4" fill="none" />
            <path d="M18 20 Q6 14 1 22 M18 20 Q30 12 33 22 M18 20 Q10 6 4 8 M18 20 Q26 4 32 8 M18 20 Q18 6 16 2" stroke="#15803D" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        {place && <span className="pointer-events-none absolute end-2 top-1 rounded bg-white/70 px-1 text-[10px] font-bold text-sky-900" dir="rtl" aria-hidden="true">{place}</span>}
        {/* la trottinette : la POIGNÉE (role=slider) */}
        <div
          {...stretch.handleProps({ label: handleLabel, valueText })}
          data-ride-handle
          className={`absolute flex -translate-x-1/2 items-end justify-center rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-teal-300 ${stretch.dragging ? 'bg-teal-500/10' : ''}`}
          style={{ left: px(shown), top: rulerY - scooterH - 2, width: Math.max(44, scooterH), height: scooterH + 4, cursor: stretch.dragging ? 'grabbing' : 'grab', transition: stretch.dragging || reduce ? 'none' : 'left 160ms ease-out' }}
        >
          <svg viewBox="0 0 60 60" width={scooterH} height={scooterH} aria-hidden="true" focusable="false"
            style={{ transform: stretch.dragging && !reduce ? 'rotate(-4deg)' : 'none', transition: reduce ? 'none' : 'transform 150ms' }} data-deco="scooter">
            {/* le pilote */}
            <circle cx="30" cy="9" r="6" fill="#F2C9A0" />
            <path d="M24 7 Q30 0 36 7 Q34 4 30 3.6 Q26 4 24 7 Z" fill="#1E293B" />
            <path d="M24 16 Q30 13 36 16 L37 32 L25 32 Z" fill="#7C3AED" />
            <path d="M26 32 L24 46 M34 32 L33 46" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
            <path d="M35 19 L44 14" stroke="#F2C9A0" strokeWidth="3" strokeLinecap="round" />
            {/* la trottinette */}
            <path d="M44 12 L42 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 12 L48 12" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <rect x="12" y="46" width="34" height="4" rx="2" fill="#0F766E" />
            {[14, 44].map((cx) => (
              <g key={cx} style={{ transformOrigin: `${cx}px 53px`, transform: `rotate(${wheel}deg)`, transition: reduce ? 'none' : 'transform 200ms linear' }}>
                <circle cx={cx} cy="53" r="6" fill="#1E293B" />
                <circle cx={cx} cy="53" r="2.4" fill="#CBD5E1" />
                <line x1={cx} y1="48" x2={cx} y2="58" stroke="#94A3B8" strokeWidth="1" />
              </g>
            ))}
          </svg>
        </div>
        {/* le ticket qui sort à chaque course (décor) */}
        {recorded > 0 && (
          <svg key={recorded} viewBox="0 0 20 24" width="18" height="22" aria-hidden="true" focusable="false" data-deco="ticket"
            className={reduce ? 'absolute' : 'rr-ticket absolute'} style={{ left: Math.min(width - 22, px(shown) + 18), top: Math.max(2, rulerY - scooterH - 6) }}>
            <path d="M2 1 H18 V21 L15 19 L12 21 L9 19 L6 21 L2 19 Z" fill="#FFFFFF" stroke="#94A3B8" />
            <line x1="5" y1="6" x2="15" y2="6" stroke="#94A3B8" /><line x1="5" y1="10" x2="13" y2="10" stroke="#94A3B8" /><line x1="5" y1="14" x2="15" y2="14" stroke="#0F766E" strokeWidth="1.6" />
          </svg>
        )}
      </div>
      {overlay && <div dir="ltr" className="pointer-events-none absolute inset-x-1 top-1 z-10 flex justify-between [&>*]:pointer-events-auto" data-ride-overlay>{overlay}</div>}
    </div>
  );
}
