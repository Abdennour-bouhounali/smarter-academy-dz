import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import DragGhost from '../primitives/DragGhost';
import { PromptCard } from '../primitives/LabKit';
import { useLabCoach } from '../primitives/LabCoach';
import MathText from '../../components/MathText';
import { LEVELS } from '../levels';
import * as L from '../logic/likeTerms';
import PieceArt from './likeTerms/PieceArt';
import { fitUnit } from './likeTerms/pieceLayout';
import Workbench from './likeTerms/Workbench';
import SidePanel from './likeTerms/SidePanel';
import { num } from './likeTerms/format';

export { bannerOf, iso, num, tex, plain } from './likeTerms/format';

/**
 * like-terms — « طاولة الحدود » : LE TERME SOUS LA MAIN (3AM, unité 4 « الحساب الحرفي », درس « تبسيط عبارة جبرية وحذف الأقواس »,
 * 2026-10-20). Logique : `logic/likeTerms.js` (sur `core/arithmetic/brackets.js`, importé par chemin). Dessin : `likeTerms/`.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. Une PILE de pièces de bois identiques (« حزمة ») — un terme de l'expression écrite : réglettes x, plaques x² (côté = la réglette),
 *    cubes 1 ; un coefficient négatif = la même pile en finition « opposée » (rouge hachuré, « − »). La main la PORTE (glisser,
 *    toucher-toucher, clavier) : dans la صينية de sa forme (collect), ou hors d'une caisse « +( ) » / « −( ) » vers une sortie
 *    « كما هي » / « بعكس إشارتها » (brackets). La main règle aussi x (la longueur de la réglette) : toutes les pièces se redessinent.
 * B. Réduire une somme = regrouper les termes SEMBLABLES (même partie littérale) en ajoutant leurs coefficients ; un terme et son
 *    opposé s'annulent ; supprimer des parenthèses précédées de − change le signe de CHAQUE terme ; la valeur ne change jamais.
 * C. Une pile d'une autre forme est refusée et revient en tremblant, la bannière donne les valeurs des deux pièces à x (ou à un
 *    témoin quand x = 1 les confond) ; dans une صينية les paires pièce/opposée disparaissent (bouffée) ; une mauvaise sortie de caisse
 *    est refusée avec la valeur de l'expression et celle qu'aurait la table ; deux compteurs de valeur (l'expression écrite, la
 *    table) bougent ensemble quand la main change x ; la ligne écrite grandit, la forme réduite s'écrit.
 * D. La forme réduite (`simplifiedTex`), la ligne sans parenthèses (`openedTex`), la règle formelle avec SES lignes.
 * E. « متى تجتمع حزمتان في حدّ واحد؟ » (collect) · « ماذا حدث لإشارة كل حدّ أخرجتَه من قوسين مسبوقين بـ − ؟ » (brackets) — les
 *    fausses conjectures réfutées par SES nombres (ses compteurs à x, son propre refus).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        termes semblables ; somme des coefficients ; opposés qui s'annulent ; suppression des parenthèses ; valeur invariante
 *   OBJECT         des piles de pièces de bois (réglettes, plaques, cubes) sur la table du club ; trois صواني ; des caisses à signe
 *   VARIABLE       la destination de la pile (la صينية, la sortie) ; x, la longueur de la réglette (1…6) ; le coefficient écrit (متقدم)
 *   INVARIANT      la valeur de la table = la valeur de l'expression écrite, à tout x
 *   TRANSFORMATION la pile rejoint sa صينية (paires annulées) ; la pile sort de sa caisse telle quelle ou retournée
 *   CONSTRAINT     une صينية n'accepte que sa forme ; une sortie qui changerait la valeur est refusée
 *   RESISTANCE     kind (la pièce et la صينية ne valent pas la même chose à x) · sign (la valeur de l'expression changerait)
 *   EVIDENCE       les deux compteurs de valeur, la bouffée des paires, la ligne écrite qui grandit, la forme réduite
 *   CONTRAST       x avec x (s'empilent) / x avec x² ou 1 (refusés) ; +( ) (rien ne change) / −( ) (tout change)
 *   PREDICTION     متقدم : le coefficient de chaque صينية est ÉCRIT avant que « تحقّق » n'annule les paires
 *   DISCOVERY      les deux questions de E, options réfutables
 *   FORMALIZATION  الحدود المتشابهة · نجمع المعاملات · الحدّ ومعاكسه · حذف الأقواس (+ / −) · القيمة لا تتغيّر
 *   TRANSFER       le module de la طريقة (monde brackets), les exercices, la leçon suivante (النشر)
 *
 * « جرّب كل الإمكانيات » : NON (§6bis — chaque geste EST une réponse : une destination, une sortie, un coefficient).
 * « جرّب أعدادك » : TOUJOURS OUVERT (`[data-lt-free]`) : + / − par forme, une caisse de chaque signe (brackets), « امسح ».
 *
 * D'UN SEUL REGARD (§8bis) : `[data-lt-glance]` enveloppe la consigne, la table (ligne écrite, rangée, sorties / صواني) et le panneau
 * (x, les deux valeurs, la bannière, le panneau libre). L'unité `u` des pièces est budgétée sur `useLessonViewport` (`fitUnit`, 7…18 px,
 * calculée à x = 6 pour que la table ne saute pas quand la main change x). ≥ 660 px de large : le panneau est À CÔTÉ de la table ;
 * en dessous (768 × 1024 portrait), il passe DESSOUS sur deux colonnes. Tablette et ordinateur seulement.
 *
 * ONBOARDING : `logic/likeTerms.js › coachOf` (exit · exitMore · sort · x · sortMore · coef · check · next).
 *
 * Props (contrat fixé avec la leçon) : `world` ('collect' | 'brackets'), `tasks` ([{ id, expr }], format brackets.js), `level`, `levels`
 * (forcé à false pour brackets), `coach`, `lead` (REMPLACE la phrase de contexte du niveau écrit), `onTrial(événement)` (par
 * `state.report`), `onFinished({ world })`.
 *
 * CONTRAT DOM : [data-like-terms][data-world][data-task][data-solved], [data-lt-glance], [data-lt-bundle=<id>][data-c][data-p],
 * [data-lt-tray=2|1|0][data-coef], [data-lt-crate=<i>][data-sign], [data-lt-exit=keep|flip], [data-lt-x], [data-lt-x-less],
 * [data-lt-x-more], [data-lt-xbox], [data-lt-value=written|table], [data-lt-line], [data-lt-result], [data-lt-refused=<reason>],
 * [data-lt-banner], [data-lt-next], [data-lt-free], [data-lt-add=<p><+|->], [data-lt-clear], [data-lt-target=row|plus|minus],
 * [data-lt-coef=<p>], [data-lt-check], [data-lt-formal].
 */
const NS = 'manipulation.likeTerms';
const MAX_W = 1080;
const MOTION_CSS = '@keyframes lt-wobble{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px) rotate(-2deg)}45%{transform:translateX(6px) rotate(2deg)}70%{transform:translateX(-3px)}}'
  + '@keyframes lt-poof{0%{opacity:.95;transform:scale(1)}60%{opacity:.6;transform:scale(1.18)}100%{opacity:0;transform:scale(.4)}}'
  + '@keyframes lt-pop{from{opacity:.2;transform:scale(.85)}to{opacity:1;transform:scale(1)}}'
  + '@keyframes lt-flip{0%{transform:rotateY(180deg);opacity:.4}100%{transform:rotateY(0);opacity:1}}'
  + '@keyframes lt-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}'
  + '.lt-wobble{animation:lt-wobble .42s ease-in-out}.lt-poof{animation:lt-poof .8s ease-out forwards}.lt-pop{animation:lt-pop .28s ease-out both}'
  + '.lt-flip{animation:lt-flip .45s ease-out both}.lt-hop{animation:lt-hop .5s ease-out}'
  + '@media (prefers-reduced-motion:reduce){.lt-wobble,.lt-poof,.lt-pop,.lt-flip,.lt-hop{animation:none}.lt-poof{display:none}}';

/** Les nombres de la manipulation : la tâche de la leçon, ou le préréglage du niveau (même objet : `levelMatching` compare par référence). */
export function numbersFor({ world, tasks, level }) {
  if (world === 'brackets') return { world: 'brackets', tasks: L.tasksFor('brackets', tasks) };
  if (Array.isArray(tasks) && tasks.length) return { world: 'collect', tasks };
  return LEVELS['like-terms'][resolveLevelId(level ?? 'beginner')].numbers;
}

export default function LikeTerms({
  world, tasks, title, lead, level, levels: withLevelsProp = true, coach: coachOn = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const withLevels = world === 'brackets' ? false : withLevelsProp;
  const initialNumbers = useMemo(() => numbersFor({ world, tasks, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'like-terms', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const scaffold = nums.world === 'brackets' || state.level !== 'advanced';
  const numsKey = `${JSON.stringify(nums)}|${scaffold}`;
  const fresh = () => L.init({ world: nums.world, tasks: nums.tasks, scaffold });
  const [lab, setLab] = useState(fresh);
  const [scene, setScene] = useState({ key: numsKey, epoch: state.epoch });
  if (scene.key !== numsKey || scene.epoch !== state.epoch) {
    setScene({ key: numsKey, epoch: state.epoch });
    setLab(fresh());
  }
  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  const reported = useRef(0);
  const nEv = lab.events.length;
  useEffect(() => {
    if (nEv < reported.current) reported.current = 0;
    for (let i = reported.current; i < nEv; i += 1) state.report(onTrial, lab.events[i]);
    reported.current = nEv;
  }, [nEv, lab.events]); // eslint-disable-line react-hooks/exhaustive-deps

  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'like-terms', step: coachStep,
    text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });

  /* ── mesures : la largeur du labo, la hauteur de l'écran de la leçon ── */
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
  const side = width >= 660;
  const sideW = side ? (width < 820 ? 230 : width < 900 ? 250 : 272) : 0;
  const sceneW = side ? width - sideW - 12 : width;
  const advanced = !lab.scaffold;
  const u = fitUnit({
    cards: lab.bundles.map((b) => ({ n: Math.abs(b.place === 'crate' ? b.c0 : b.c), p: b.p })),
    width: sceneW - 40, height: side ? screenH - 250 : screenH - (screenH < 900 ? 620 : 520), extra: 120 + (advanced ? 52 : 0) + (lab.crates.length ? 70 : 0),
    crates: lab.crates.length,
  });

  /* ── le geste : porter une pile (glisser, toucher-toucher, clavier) ── */
  const [wobble, setWobble] = useState(null);
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      const id = src.slice(2);
      if (zone.startsWith('tray:')) return L.canSort(lab, id, Number(zone.slice(5)));
      // une sortie ne se juge qu'au dépôt : ni l'aimant ni le survol ne trahissent la bonne
      if (zone.startsWith('exit:')) return L.canExit(lab, id) ? true : '';
      return '';
    },
    onDrop: (src, zone) => {
      const id = src.slice(2);
      if (zone.startsWith('tray:')) setLab((s) => L.sort(s, id, Number(zone.slice(5))));
      else if (zone.startsWith('exit:')) setLab((s) => L.exitTo(s, id, zone === 'exit:flip'));
    },
    onReject: (src, zone, reason) => {
      if (reason === 'kind') setLab((s) => L.refuseKind(s, src.slice(2), Number(zone.slice(5))));
    },
  });
  useEffect(() => {
    const last = lab.last;
    if (last?.event === 'refused' && last.reason === 'sign') setWobble({ id: last.id, n: nEv });
  }, [nEv]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la bouffée des paires annulées ── */
  const [poof, setPoof] = useState(null);
  const seenEv = useRef(0);
  useEffect(() => {
    if (nEv < seenEv.current) seenEv.current = 0;
    const fresh2 = lab.events.slice(seenEv.current);
    seenEv.current = nEv;
    const cancels = fresh2.filter((e) => e.kind === 'cancel');
    if (!cancels.length) return undefined;
    const trays = {};
    for (const e of cancels) {
      if (lab.last?.event === 'sort') trays[e.tray] = lab.last.cancelled;
      else { const pc = L.trayPieces(lab, e.tray); trays[e.tray] = Math.min(pc.pos, pc.neg); }
    }
    setPoof({ key: nEv, trays });
    const tm = setTimeout(() => setPoof(null), 900);
    return () => clearTimeout(tm);
  }, [nEv]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── clavier : les flèches passent d'une pile / d'une zone à l'autre, Échap lâche ── */
  const onKeyDown = (e) => {
    if (e.key === 'Escape') { drag.release(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const from = e.target.closest?.('[data-lt-nav]');
    if (!from) return;
    const all = [...e.currentTarget.querySelectorAll('[data-lt-nav]')].filter((n) => !n.hasAttribute('disabled') && n.getAttribute('aria-disabled') !== 'true');
    const i = all.indexOf(from);
    if (i < 0) return;
    e.preventDefault();
    const fwd = e.key === 'ArrowDown' || e.key === 'ArrowLeft'; // RTL : ← avance
    all[(i + (fwd ? 1 : -1) + all.length) % all.length]?.focus();
  };

  const held = drag.held ? L.bundle(lab, drag.held.slice(2)) : null;
  const task = L.taskOf(lab);
  const context = lab.custom ? k('context.custom') : (state.isAuthoredLevel && lead) || k(`context.${lab.world}`);
  const question = k(`question.${lab.custom ? 'custom' : lab.world === 'brackets' ? 'brackets' : advanced ? 'advanced' : 'collect'}`);
  const prompt = (
    <PromptCard size={side && width >= 900 ? 'lg' : 'md'} className={screenH < 820 ? '!space-y-1 !p-3' : undefined}
      aside={<StepsDots lab={lab} k={k} />} context={context} contextProps={{ 'data-lt-context': task }}
      title={question} titleClassName={!side || width < 900 ? (screenH < 820 ? 'text-base' : 'text-lg') : screenH < 820 ? 'text-lg' : 'text-xl'}
      lamp={lab.solvedNow ? 'on' : 'off'} titleProps={{ 'data-lt-question': task, 'data-lit': lab.solvedNow ? 'true' : 'false' }} />
  );
  const mood = lab.solvedNow ? 'proud' : lab.last?.event === 'refused' ? 'wonder' : 'happy';
  const bench = <Workbench lab={lab} setLab={setLab} k={k} u={u} drag={drag} wobble={wobble} poof={poof} mood={mood} narrow={!side} />;
  const panel = <SidePanel lab={lab} setLab={setLab} k={k} side={side} width={sideW} coachVisible={coach.visible} />;

  const discovery = (
    <ManipulationDiscovery state={state}
      prompt={<MathText>{k(lab.world === 'brackets' ? 'discovery.brackets.prompt' : 'discovery.collect.prompt')}</MathText>}
      options={discoveryOptions(lab, k)} formal={<Formal lab={lab} k={k} />}
      onFormalized={() => state.report(onFinished, { world: lab.world })} />
  );

  const hintsKey = lab.world === 'brackets' ? 'brackets' : advanced ? 'advanced' : 'collect';
  return (
    <ManipulationShell type="like-terms" title={title ?? k('title')} titleHidden state={state} allowModeSwitch={allowModeSwitch} allowFreeLab={false}
      coach={coachOn ? coach : null} hints={[0, 1, 2].map((i) => k(`hints.${hintsKey}.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }} discovery={discovery} explanation={<MathText>{k('explanation')}</MathText>}>
      <ManipulationStage className="bg-gradient-to-b from-amber-50/50 to-white">
        <div ref={boxRef} data-like-terms data-world={lab.world} data-task={task} data-solved={lab.solvedNow ? 'true' : 'false'}>
          <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className="relative mx-auto space-y-2.5" style={{ maxWidth: MAX_W }} data-lt-glance onKeyDown={onKeyDown}>
            {prompt}
            {side ? (
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">{bench}</div>
                {panel}
              </div>
            ) : (
              <div className="space-y-1.5">{bench}{panel}</div>
            )}
          </div>
          <DragGhost ghost={drag.ghost}>
            {held && <div className="rounded-xl bg-white/70 p-1"><PieceArt c={held.place === 'crate' ? held.c0 : held.c} p={held.p} x={lab.x} u={u} /></div>}
          </DragGhost>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

function StepsDots({ lab, k }) {
  if (lab.tasks.length < 2) return null;
  return (
    <div className="flex items-center gap-1" role="list" aria-label={k('stepsAria')}>
      <span className="text-xs font-black text-indigo-900/60" aria-hidden="true">{k('stepsLabel')}</span>
      {lab.tasks.map((tk, i) => {
        const d = !!lab.done[i];
        const cur = i === lab.ti && !lab.custom;
        return (
          <span key={tk.id} role="listitem" data-lt-step={i} data-done={d ? 'true' : 'false'} aria-current={cur ? 'step' : undefined} aria-label={k('stepAria', { i: i + 1 })}
            className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border-2 px-1.5 text-xs font-black tabular-nums ${cur ? 'border-indigo-600 bg-indigo-600 text-white' : d ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-indigo-100 bg-white text-indigo-400'}`}>
            {d && !cur ? '✓' : <bdi dir="ltr">{i + 1}</bdi>}
          </span>
        );
      })}
    </div>
  );
}

/* ══════════════ La découverte et la règle ══════════════ */

export function discoveryOptions(lab, k) {
  const M = (s) => <MathText>{s}</MathText>;
  if (lab.world === 'brackets') {
    const v = L.minusVariants(lab);
    const firstWhy = v.own
      ? k('discovery.brackets.whyFirstOwn', { term: v.own.termTex, x: v.own.x, before: num(v.own.before), after: num(v.own.after) })
      : k('discovery.brackets.whyFirst', { wrong: v.first.wrongTex, expr: v.first.exprTex, x: v.first.x, w: num(v.first.wrong), r: num(v.first.right) });
    return [
      { text: M(k('discovery.brackets.first')), why: M(firstWhy) },
      { text: M(k('discovery.brackets.right')), correct: true },
      { text: M(k('discovery.brackets.none')), why: M(k('discovery.brackets.whyNone', { wrong: v.none.wrongTex, expr: v.none.exprTex, x: v.none.x, w: num(v.none.wrong), r: num(v.none.right) })) },
    ];
  }
  const a = L.mergeAllWitness(lab);
  const b = L.sameNumberWitness(lab);
  return [
    { text: M(k('discovery.collect.always')), why: M(k('discovery.collect.whyAlways', { x: a.x, a: num(a.a), b: num(a.b) })) },
    { text: M(k('discovery.collect.right')), correct: true },
    { text: M(k('discovery.collect.sameNumber')), why: M(k('discovery.collect.whySameNumber', { x: b.x, a: num(b.a), b: num(b.b) })) },
  ];
}

/** Une ligne de la règle : la phrase (arabe), puis la ou les égalités de l'élève, chacune dans son îlot LTR (jamais collées au texte). */
function Rule({ label, lines, rule, plain = false }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${plain ? '' : 'rounded-2xl border border-emerald-200 bg-white/80 px-3 py-2'}`} data-lt-rule={rule}>
      <span><MathText>{label}</MathText></span>
      {lines.map((l) => (
        <bdi key={l} dir="ltr" className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[15px] ring-1 ring-emerald-200"><MathText>{`$${l}$`}</MathText></bdi>
      ))}
    </div>
  );
}

export function Formal({ lab, k }) {
  const f = L.formalLines(lab);
  const value = f.value && (
    <div className="text-xs text-slate-700"><Rule plain rule="value" label={k('formal.value', { x: f.value.x })} lines={[`${f.value.expr} = ${f.value.v}`, `${f.value.result} = ${f.value.v}`]} /></div>
  );
  if (lab.world === 'brackets') {
    const plus = f.lines.find((l) => l.plus && !l.minus) ?? f.lines.find((l) => l.plus);
    const minus = f.lines.find((l) => l.minus && !l.plus) ?? f.lines.find((l) => l.minus);
    return (
      <div className="space-y-2 text-sm font-bold text-emerald-950" data-lt-formal="brackets">
        {plus && <Rule rule="plus" label={k('formal.plus')} lines={[`${plus.expr} = ${plus.opened}`]} />}
        {minus && <Rule rule="minus" label={k('formal.minus')} lines={[`${minus.expr} = ${minus.opened}`]} />}
        <Rule plain rule="reduce" label={k('formal.thenReduce')} lines={f.lines.map((l) => `${l.opened} = ${l.result}`)} />
        {value}
      </div>
    );
  }
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-lt-formal="collect">
      <Rule rule="like" label={k('formal.like')} lines={[]} />
      {f.sum && <Rule rule="sum" label={k('formal.sum')} lines={[`${f.sum.lhs} = ${f.sum.rhs}`]} />}
      {f.cancel && <Rule rule="cancel" label={k('formal.cancel')} lines={[f.cancel.tex]} />}
      <Rule plain rule="lines" label={k('formal.lines')} lines={f.lines.map((l) => `${l.expr} = ${l.result}`)} />
      {value}
    </div>
  );
}


