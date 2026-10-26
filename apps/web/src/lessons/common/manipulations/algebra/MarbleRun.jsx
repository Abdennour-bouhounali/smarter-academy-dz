import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hand } from 'lucide-react';
import * as S from '@smarter-academy/core/arithmetic/substitution.js';
import { sign } from '@smarter-academy/core/arithmetic/powers.js';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import { PromptCard, VerdictBanner } from '../primitives/LabKit';
import { useLabCoach } from '../primitives/LabCoach';
import KidFigure from '../primitives/KidFigure';
import MathText from '../../components/MathText';
import { LEVELS } from '../levels';
import * as L from '../logic/marbleRun';
import { Rack, Reservoir, StationCard, Basket, Pegboard, useMarbleDrag, iso } from './marbleRun/Parts';
import LineRow from './marbleRun/LineRow';
import { PredictPanel, FreePanel, TwinsFree, TwinWall, chipOf } from './marbleRun/Panels';

/**
 * marble-run — « مسار الكريات » : LA VALEUR SOUS LA MAIN (3AM, unité 4 « الحساب الحرفي », درس « حساب قيمة عبارة حرفية », 2026-10-26).
 * Logique : `logic/marbleRun.js` (sur `core/arithmetic/substitution.js`, importé par chemin). Dessin : `marbleRun/`.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. Un MUR de billes du نادي العلوم (thème `marblerun`) calcule une expression : un réservoir par lettre, des stations (les opérations de
 *    l'arbre), une corbeille. La main (1) choisit la VALEUR de la lettre : une bille du râtelier lâchée dans le réservoir (glisser, toucher-
 *    toucher, clavier) ; (2) ÉCRIT sous le mur la ligne de la substitution : toucher une case = ses parenthèses, toucher le vide avant une
 *    case = le signe × ; (3) lance la glissière. Monde `twins` : deux murs sous UN réservoir, la main compare les corbeilles et juge.
 * B. Remplacer une lettre, c'est mettre le MÊME nombre à chaque endroit de la lettre, sans changer son rôle : « 4 fois x » reste « 4 fois le
 *    nombre » (le × doit se voir, sinon 4 et 3 deviennent 43) et « x au carré » reste « le nombre au carré » (avec un nombre négatif,
 *    les parenthèses gardent le signe dans le carré). Deux lettres peuvent prendre deux nombres. Une valeur où deux expressions se
 *    séparent prouve qu'elles sont différentes ; des valeurs égales ne prouvent rien.
 * C. Le mur calcule le sens de l'expression, le lecteur strict calcule ce que la LIGNE dit ; la première station où ils diffèrent s'allume
 *    et la bannière donne les deux calculs avec LES nombres de l'élève. La valeur n'est jamais dite : elle sort du mur.
 * D. La règle formelle (ses lignes acceptées) s'écrit après la découverte.
 * E. « لماذا احتاج سطرك إلى قوسين ؟ » — les fausses conjectures réfutées par SA course refusée.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        substituer un nombre à une lettre ; × visible ; parenthèses d'un négatif ; priorité ; un contre-exemple réfute
 *   OBJECT         un mur à chevilles, des billes, un réservoir par lettre, des stations (copieuse, presse, basculeur, jonction), une corbeille
 *   VARIABLE       la valeur de la lettre (bille) ; l'écriture de chaque case (parenthèses, ×) ; la bille du monde twins
 *   INVARIANT      la même bille à chaque entrée de la lettre ; le mur calcule le sens de l'expression
 *   TRANSFORMATION la ligne se lit autrement (43 pour 4 × 3, −4 pour (−2)²) ; la station fautive s'allume
 *   CONSTRAINT     un × caché fond les chiffres ; un négatif nu est illisible après un opérateur ; sous une puissance il est avalé
 *   RESISTANCE     fused · syntax · unbracketed (la copieuse) · swallowed
 *   EVIDENCE       les puces des stations, la corbeille, le ticker du lecteur, la bannière aux deux calculs
 *   CONTRAST       une ligne refusée à côté de la ligne acceptée ; deux corbeilles qui s'accordent puis se séparent
 *   PREDICTION     متقدم : la valeur est écrite au clavier AVANT le lancement, sans puces pendant la course
 *   DISCOVERY      pourquoi des parenthèses (options réfutables par SES nombres)
 *   FORMALIZATION  mêmes nombres partout · × explicite · parenthèses d'un négatif · priorité
 *   TRANSFER       le monde twins (module طريقة), les exercices, la banque, 4AM (images d'une fonction affine)
 *
 * « جرّب كل الإمكانيات » : NON (chaque course est une réponse). « جرّب أعدادك » : TOUJOURS OUVERT (`[data-mr-free]`).
 *
 * D'UN SEUL REGARD (§8bis) : `[data-mr-glance]` enveloppe la consigne, le mur, la ligne, la bannière, le râtelier et la glissière.
 *
 * CONTRAT DOM : [data-marble-run][data-world][data-task][data-solved], [data-mr-glance], [data-mr-rack] / [data-mr-marble=<v>],
 * [data-mr-reservoir=x|y], [data-mr-station=<id>][data-op][data-lit], [data-mr-basket], [data-mr-line], [data-mr-slot=<i>][data-brackets],
 * [data-mr-times=<i>], [data-mr-run], [data-mr-reader], [data-mr-refused=<reason>], [data-mr-banner], [data-mr-predict], [data-mr-claims],
 * [data-mr-claim=counter|equal], [data-mr-expand], [data-mr-next], [data-mr-free], [data-mr-formal].
 */
const NS = 'manipulation.marbleRun';
const MAX_W = 1080;
const CSS = '@keyframes mr-pop{from{opacity:.2;transform:scale(.88)}to{opacity:1;transform:scale(1)}}'
  + '@keyframes mr-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}45%{transform:translateX(4px)}70%{transform:translateX(-3px)}}'
  + '@keyframes mr-ring{0%,100%{box-shadow:0 0 0 3px rgba(99,102,241,.9),0 0 0 8px rgba(99,102,241,.15)}50%{box-shadow:0 0 0 3px rgba(99,102,241,.9),0 0 0 12px rgba(99,102,241,.28)}}'
  + '@keyframes mr-run{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}'
  + '.mr-pop{animation:mr-pop .26s ease-out both}.mr-shake{animation:mr-shake .4s ease-in-out}'
  + '[data-mr-coach]{border-radius:14px;animation:mr-ring 1.4s ease-in-out infinite}'
  + '[data-mr-station][data-active="true"]{animation:mr-run .35s ease-in-out infinite}'
  + 'section:has([data-marble-run]) [data-lab-coach-ring]{display:none}'
  + '@media (prefers-reduced-motion:reduce){.mr-pop,.mr-shake,[data-mr-coach],[data-mr-station][data-active="true"]{animation:none}}';

/** Les nombres de la manipulation : ceux de la leçon, ou le préréglage du niveau (même objet : `levelMatching` compare par référence). */
export function numbersFor({ world, tasks, level }) {
  if (world === 'twins') return { world: 'twins', tasks: L.tasksFor('twins', tasks, false) };
  if (Array.isArray(tasks) && tasks.length) return { world: 'run', predict: false, tasks };
  return LEVELS['marble-run'][resolveLevelId(level ?? 'beginner')].numbers;
}

const vt = (v) => iso(L.valueText(v));

function Ines({ mood }) {
  return (
    <svg width="58" height="96" viewBox="0 0 64 104" className="shrink-0" aria-hidden="true" data-mr-ines={mood}>
      <KidFigure cx={32} top={3} foot={102} hairStyle="hijab" scarf="lavender" outfit="teal" skin="wheat" mood={mood} />
    </svg>
  );
}

/** La question : une seule phrase qui nomme le but et l'état final (les billes demandées y sont écrites). */
export function questionOf(lab, k) {
  if (lab.custom) return k(`question.custom.${lab.world}`);
  if (lab.world === 'twins') return k('question.twins');
  const entries = Object.entries(lab.tasks[lab.ti].target);
  const drops = entries.map(([l, t], i) => k(i === 0 ? 'drop.one' : 'drop.and', { v: vt(L.marble(t).v), l })).join('');
  return k(lab.predict ? 'question.predict' : 'question.run', { drops });
}
export function contextOf(lab, k, lead) {
  if (lab.custom) return k(`context.custom.${lab.world}`);
  if (lab.world === 'twins') return k('context.twins');
  return lead ?? k('context.run', { expr: `$${S.treeTex(lab.tree)}$` });
}

/** La bannière : un verdict en une ou deux phrases avec LES nombres de l'élève (vide quand le guide parle). */
export function bannerOf(lab, k, coachShowing) {
  if (lab.world === 'twins') {
    const r = lab.ran;
    if (r) {
      const pair = L.twinValues(lab);
      const n = { x: lab.m ? iso(L.valueText(lab.m.v)) : '', a: pair ? vt(pair.left) : '', b: pair ? vt(pair.right) : '' };
      if (!r.ok) return { tone: 'rose', reason: r.reason, text: k(`twin.refused.${r.reason}`, n) };
      return { tone: 'emerald', reason: null, text: k(`twin.accepted.${r.kind}`, n) };
    }
    if (coachShowing) return { tone: 'indigo', reason: null, text: '' };
    return { tone: 'indigo', reason: null, text: k('idle.twins') };
  }
  const r = lab.ran;
  if (r) {
    if (r.ok) {
      if (r.hit) return { tone: 'emerald', reason: null, text: k('b.ok', { v: vt(r.runValue) }) };
      return { tone: lab.custom ? 'emerald' : 'amber', reason: null, text: k(lab.custom ? 'b.okCustom' : 'b.okWrongValue', { v: vt(r.runValue) }) };
    }
    const st = r.stationInfo;
    const line = st?.lineValue ? vt(st.lineValue) : null;
    if (r.reason === 'fused' && line) return { tone: 'rose', reason: 'fused', text: k('b.fused', { line, a: vt(st.args[0]), b: vt(st.args[1]), run: vt(st.value) }) };
    if (r.reason === 'unbracketed' && line && st.op === 'pow') {
      const base = st.args[0];
      if (sign(base) < 0) return { tone: 'rose', reason: 'unbracketed', text: k('b.squareNeg', { abs: iso(L.valueText({ n: -base.n, d: base.d })), line, base: vt(base), run: vt(st.value) }) };
      return { tone: 'rose', reason: 'unbracketed', text: k('b.squareFrac', { line, run: vt(st.value) }) };
    }
    if (r.reason === 'unbracketed' && line) return { tone: 'rose', reason: 'unbracketed', text: k('b.swallowed', { line, run: vt(st.value) }) };
    return { tone: 'rose', reason: 'syntax', text: k('b.syntax') };
  }
  if (coachShowing) return { tone: 'indigo', reason: null, text: '' };
  if (!L.filled(lab)) return { tone: 'indigo', reason: null, text: k('idle.rack') };
  if (lab.predict && !lab.custom && !lab.predicted) return { tone: 'indigo', reason: null, text: k('idle.predict') };
  return { tone: 'indigo', reason: null, text: k('idle.write') };
}

export default function MarbleRun({
  world, tasks, title, lead, level, levels: withLevelsProp = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const withLevels = world === 'twins' ? false : withLevelsProp;
  const initialNumbers = useMemo(() => numbersFor({ world, tasks, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'marble-run', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const numsKey = JSON.stringify(nums);
  const fresh = () => L.init({ world: nums.world, tasks: nums.tasks, predict: !!nums.predict });
  const [lab, setLab] = useState(fresh);
  const [scene, setScene] = useState({ key: numsKey, epoch: state.epoch });
  if (scene.key !== numsKey || scene.epoch !== state.epoch) {
    setScene({ key: numsKey, epoch: state.epoch });
    setLab(fresh());
  }
  const twins = lab.world === 'twins';
  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  const reported = useRef(0);
  const nEv = lab.events.length;
  useEffect(() => {
    if (nEv < reported.current) reported.current = 0;
    for (let i = reported.current; i < nEv; i += 1) state.report(onTrial, lab.events[i]);
    reported.current = nEv;
  }, [nEv, lab.events]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la course : les stations s'allument une à une (la bannière et la corbeille attendent la fin) ── */
  const [shown, setShown] = useState(0); // le numéro de la dernière course dont la révélation est finie
  const [reveal, setReveal] = useState(0);
  const total = twins ? 0 : L.stationSkeleton(lab).length;
  const running = !twins && lab.nRuns > Math.min(shown, lab.nRuns);
  useEffect(() => {
    if (twins || !lab.nRuns) { setShown(lab.nRuns ?? 0); return undefined; }
    const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (still) { setShown(lab.nRuns); return undefined; }
    let i = 0;
    setReveal(0);
    const id = setInterval(() => { i += 1; if (i > total) { clearInterval(id); setShown(lab.nRuns); } else setReveal(i); }, 340);
    return () => clearInterval(id);
  }, [lab.nRuns]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── le guide ── */
  const ownStep = coachOn ? L.coachOf(lab) : null;
  const coachStep = ownStep ? { ...ownStep, prefer: 'below' } : null;
  const coach = useLabCoach({
    lab: 'marble-run', step: coachStep,
    text: ownStep ? k(`coach.${ownStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });
  const ringTarget = coach.visible && ownStep ? ownStep.target : null;
  useEffect(() => {
    const root = document.querySelector('[data-marble-run]');
    const el = ringTarget && root ? root.querySelector(ringTarget) : null;
    if (!el) return undefined;
    el.setAttribute('data-mr-coach', '');
    return () => el.removeAttribute('data-mr-coach');
  });

  /* ── mesures ── */
  const boxRef = useRef(null);
  const [width, setWidth] = useState(900);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(320, Math.min(MAX_W, Math.floor(el.clientWidth))));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const vp = useLessonViewport(true);
  const screenH = vp.ready && vp.height > 0 ? vp.height : (typeof window !== 'undefined' ? window.innerHeight : 800);
  const wide = width >= 660;
  const short = screenH < 820;

  /* ── les gestes ── */
  const drag = useMarbleDrag({
    onPick: (m) => setLab((s) => L.hold(s, s.held?.id === m.id ? null : m)),
    onDrop: (letter, m) => setLab((s) => (s.world === 'twins' ? L.dropTwin(s, m) : L.drop(s, letter, m))),
  });
  const dropHeld = (letter) => setLab((s) => (s.held ? (s.world === 'twins' ? L.dropTwin(s, s.held) : L.drop(s, letter, s.held)) : s));
  const act = (fn, ...args) => setLab((s) => fn(s, ...args));
  const rack = twins ? L.RACK.twins : lab.predict ? L.RACK.advanced : L.RACK.beginner;
  const rackAria = (m) => k('marbleAria', { v: L.marbleText(m) });

  /* ── l'affichage ── */
  const task = L.taskOf(lab);
  const banner = running ? { tone: 'indigo', reason: null, text: '' } : bannerOf(lab, k, coach.visible && !!ownStep);
  const ran = lab.ran;
  const done = !running && ran;
  const lit = done && !twins && ran && !ran.ok ? ran.station : null;
  const mood = lab.solvedNow ? 'proud' : ran && !ran.ok ? 'wonder' : 'happy';
  const context = contextOf(lab, k, state.isAuthoredLevel ? lead : undefined);
  const question = questionOf(lab, k);
  const prompt = (
    <PromptCard size={wide && width >= 900 ? 'lg' : 'md'} className={short ? '!space-y-1 !p-3' : undefined}
      context={<MathText>{context}</MathText>} contextProps={{ 'data-mr-context': task }}
      title={question} titleClassName={!wide || width < 900 ? (short ? 'text-[15px]' : 'text-lg') : short ? 'text-lg' : 'text-xl'}
      lamp={lab.solvedNow ? 'on' : 'off'} titleProps={{ 'data-mr-question': task, 'data-lit': lab.solvedNow ? 'true' : 'false' }} />
  );

  const dots = lab.tasks.length > 1 && (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')} data-mr-steps>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i]; const cur = i === lab.ti && !lab.custom;
        return (
          <span key={tk.id} role="listitem" data-mr-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 px-1 text-xs font-black tabular-nums ${cur ? 'border-emerald-600 bg-emerald-600 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-white text-emerald-400'}`}>
            {d && !cur ? '✓' : <bdi dir="ltr">{i + 1}</bdi>}
          </span>
        );
      })}
    </div>
  );

  const verdict = (
    <div className="min-h-[46px]" data-mr-banner-slot>
      {(banner.text || (done && !twins)) && (
        <VerdictBanner tone={banner.tone} size="sm" data-mr-banner data-tone={banner.tone} {...(banner.reason ? { 'data-mr-refused': banner.reason } : {})}>
          {banner.text && <div className="mr-pop" key={`${lab.nRuns}|${lab.events.length}`}><MathText>{banner.text}</MathText></div>}
        </VerdictBanner>
      )}
    </div>
  );

  const nextBtn = L.canNext(lab) && (
    <button type="button" data-mr-next onClick={() => act(L.nextTask)}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-600 px-4 text-sm font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">
      {lab.custom ? k('back') : k('next')}
    </button>
  );
  const backBtn = lab.custom && (
    <button type="button" data-mr-back onClick={() => act(L.backToTasks)}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-4 text-sm font-black text-slate-700 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">{k('back')}</button>
  );

  /* ── monde « run » ── */
  let body;
  if (!twins) {
    const sk = L.stationSkeleton(lab);
    const steps = L.stationsOf(lab);
    const letters = L.lettersOf(lab);
    const names = (st) => (st.op === 'pow' ? k(st.n === 3 ? 'stations.pow3' : 'stations.pow2') : k(`stations.${st.op}`));
    const scaffold = !lab.predict;
    const slotList = L.slotsOf(lab);
    const guiltySlot = lit != null ? ran.slot : null;
    const wall = (
      <Pegboard data-mr-wall>
        <div dir="ltr" className="flex flex-wrap items-stretch justify-center gap-1.5" role="group" aria-label={k('stationsAria')} data-mr-stations>
          {letters.map((l) => (
            <Reservoir key={l} letter={l} marble={lab.env[l] ? { v: lab.env[l].v, fmt: lab.env[l].fmt, id: String(lab.env[l].v.n) } : null} held={!!lab.held}
              onDrop={dropHeld} name={k('reservoir', { l })} aria={k('reservoirAria', { l })} full={k('reservoirFull', { l, v: lab.env[l] ? L.marbleText(lab.env[l]) : '' })} size={0.78} />
          ))}
          {sk.map((st, idx) => {
            const real = steps[idx];
            const reached = L.filled(lab) && !!ran && (running ? idx < reveal : true);
            const showChip = reached && (scaffold || (!running && !!ran));
            return <StationCard key={st.id} st={st} name={names(st)} reached={showChip} chip={showChip ? chipOf(real) : ''} lit={lit === st.id} active={running && idx === reveal} size="sm" />;
          })}
          <Basket value={done ? iso(L.valueText(ran.runValue)) : null} label={k('basket')} ok={!!done && ran.ok} />
        </div>
      </Pegboard>
    );
    const ticker = done && (
      <div data-mr-reader className="flex min-h-[40px] flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-amber-700/40 bg-gradient-to-b from-amber-100 to-amber-200 px-3 py-1 text-sm font-black text-amber-950">
        <span>{k('reader')}</span>
        {ran.lineValue ? <><span className="font-bold">{k('readerReads')}</span><bdi dir="ltr" data-mr-reader-value className="rounded-lg bg-white px-2 py-0.5 text-lg tabular-nums text-slate-900">{L.valueText(ran.lineValue)}</bdi></> : <span className="font-bold text-rose-800">{k('readerLost')}</span>}
      </div>
    );
    const predictResult = done && lab.predict && !lab.custom && lab.predicted && ran.predictedOk != null && (
      <p className="text-center text-xs font-bold text-indigo-900" data-mr-predict-result={ran.predictedOk ? 'right' : 'wrong'}>
        {ran.predictedOk ? k('predict.right', { v: vt(ran.runValue) }) : k('predict.wrong', { p: vt(lab.predicted.v), v: vt(ran.runValue) })}
      </p>
    );
    body = (
      <>
        <div className="relative flex items-end gap-2">
          <div className="min-w-0 flex-1">{wall}</div>
          {wide && <Ines mood={mood} />}
        </div>
        <LineRow lab={lab} k={k} onBrackets={(i) => act(L.toggleBrackets, i)} onTimes={(i) => act(L.toggleTimes, i)} guilty={guiltySlot} />
        <div className="space-y-1">{ticker}{predictResult}{verdict}</div>
        <Rack marbles={rack} held={lab.held} onPick={(m) => act(L.hold, lab.held?.id === m.id ? null : m)} dragStart={drag.start} label={k('rackAria')} itemAria={rackAria} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          {dots || <span />}
          <button type="button" data-mr-run disabled={!L.canRun(lab)} onClick={() => act(L.run)} aria-label={k('runAria')}
            className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border-2 border-amber-700 bg-gradient-to-b from-amber-400 to-amber-600 px-5 text-base font-black text-amber-950 shadow-[0_3px_0_rgba(120,53,15,.6)] outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-40">
            <Hand className="h-5 w-5" aria-hidden="true" />{k('run')}
          </button>
          <div className="flex gap-2">{backBtn}{nextBtn}</div>
        </div>
        {lab.predict && !lab.custom && L.filled(lab) && <PredictPanel lab={lab} k={k} onCommit={(p) => act(L.commitPrediction, p)} onClear={() => act(L.clearPrediction)} />}
        <FreePanel lab={lab} k={k} onExpr={(txt) => act(L.setFreeExpr, txt)} onStep={(f, d) => act(L.stepFreeMarble, f, d)} onDrop={(l, m) => act(L.drop, l, m)} />
      </>
    );
  } else {
    body = (
      <>
        <Pegboard data-mr-wall className="space-y-1.5">
          <div className="flex items-start justify-center gap-3">
            <Reservoir letter="x" marble={lab.m ? { v: lab.m.v, fmt: lab.m.fmt, id: lab.m.id } : null} held={!!lab.held} onDrop={dropHeld} name={k('reservoir', { l: 'x' })} aria={k('reservoirAria', { l: 'x' })} full={k('reservoirFull', { l: 'x', v: lab.m ? L.marbleText(lab.m) : '' })} size={short ? 0.8 : 0.9} />
            {wide && <Ines mood={mood} />}
          </div>
          <div className={`flex gap-2 ${width >= 900 ? 'flex-row' : 'flex-col'}`}>
            <TwinWall lab={lab} tree={lab.a} title={k('twin.wall', { n: 1 })} k={k} side="a" />
            <TwinWall lab={lab} tree={lab.b} title={k('twin.wall', { n: 2 })} k={k} side="b" />
          </div>
        </Pegboard>
        {lab.tried.length > 0 && (
          <p className="text-center text-xs font-bold text-slate-600" data-mr-tried dir="ltr">{k('twin.tried', { list: lab.tried.map((m) => L.marbleText(m)).join(' ، ') })}</p>
        )}
        <div className="space-y-1">{verdict}</div>
        <Rack marbles={rack} held={lab.held} onPick={(m) => act(L.hold, lab.held?.id === m.id ? null : m)} dragStart={drag.start} label={k('rackAria')} itemAria={rackAria} />
        <div className="flex flex-wrap items-center justify-center gap-2" data-mr-claims role="group" aria-label={k('twin.claims')}>
          <button type="button" data-mr-claim="counter" disabled={lab.solvedNow} onClick={() => act(L.claim, 'counter')}
            className="inline-flex min-h-[48px] items-center rounded-xl border-2 border-rose-500 bg-rose-50 px-3 text-sm font-black text-rose-900 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:opacity-50">{k('twin.counter')}</button>
          <button type="button" data-mr-claim="equal" disabled={lab.solvedNow} onClick={() => act(L.claim, 'equal')}
            className="inline-flex min-h-[48px] items-center rounded-xl border-2 border-teal-500 bg-teal-50 px-3 text-sm font-black text-teal-900 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:opacity-50">{k('twin.equal')}</button>
          <button type="button" data-mr-expand disabled={!L.canExpand(lab) || lab.expanded} onClick={() => act(L.expandTwin)}
            className="inline-flex min-h-[48px] items-center rounded-xl border-2 border-indigo-500 bg-indigo-50 px-3 text-sm font-black text-indigo-900 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:opacity-50">{k('twin.expand')}</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">{dots}<div className="flex gap-2">{backBtn}{nextBtn}</div></div>
        <TwinsFree lab={lab} k={k} onSet={(which, txt) => act(L.setFreeTwins, which, txt)} />
      </>
    );
  }

  const hintsKey = twins ? 'twins' : lab.predict ? 'advanced' : 'beginner';
  const discovery = twins ? null : (
    <ManipulationDiscovery state={state}
      prompt={<MathText>{k('discovery.prompt')}</MathText>}
      options={discoveryOptions(lab, k)} formal={<Formal lab={lab} k={k} />}
      onFormalized={() => state.report(onFinished, { world: lab.world })} />
  );
  return (
    <ManipulationShell type="marble-run" title={title ?? k('title')} titleHidden state={state} allowModeSwitch={allowModeSwitch} allowFreeLab={false}
      coach={coachOn ? coach : null} hints={[0, 1, 2].map((i) => k(`hints.${hintsKey}.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }} discovery={discovery} explanation={<MathText>{k('explanation')}</MathText>}>
      <ManipulationStage className="bg-gradient-to-b from-amber-50/60 to-white">
        <div ref={boxRef} data-marble-run data-world={lab.world} data-task={task} data-solved={lab.solvedNow ? 'true' : 'false'} data-running={running ? 'true' : 'false'}>
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative mx-auto space-y-2" style={{ maxWidth: MAX_W }} data-mr-glance data-mr-budget={`${screenH}|${width}`}>
            {prompt}
            {body}
          </div>
          {drag.ghost}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

export function discoveryOptions(lab, k) {
  const M = (s) => <MathText>{s}</MathText>;
  const w = L.discoveryWitness(lab);
  const line = w.line == null ? '؟' : w.line; const run = w.run;
  return [
    { text: M(k('discovery.decor')), why: M(k('discovery.whyDecor', { line: iso(line.replace?.('-', '−') ?? line), run: iso(String(run).replace('-', '−')) })) },
    { text: M(k('discovery.right')), correct: true },
    { text: M(k('discovery.every')), why: M(k('discovery.whyEvery')) },
  ];
}

export function Formal({ lab, k }) {
  const solved = lab.events.filter((e) => e.kind === 'solved' && e.world === 'run');
  const seen = new Set(); const lines = [];
  for (const e of solved) if (!seen.has(e.line)) { seen.add(e.line); lines.push(e); }
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-mr-formal>
      <p>{k('formal.sub')}</p>
      <p><MathText>{k('formal.times')}</MathText></p>
      <p><MathText>{k('formal.brackets')}</MathText></p>
      <p><MathText>{k('formal.priority')}</MathText></p>
      {lines.length > 0 && (
        <div className="space-y-1">
          <p>{k('formal.lines')}</p>
          {lines.map((e) => <bdi key={e.line} dir="ltr" className="block rounded-lg bg-emerald-50 px-2 py-0.5 text-[15px] ring-1 ring-emerald-200">{e.line} = {String(e.value).replace('-', '−')}</bdi>)}
        </div>
      )}
    </div>
  );
}
