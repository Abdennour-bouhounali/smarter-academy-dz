import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ChevronsLeftRight, Flower2, Undo2 } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { divmod } from '@smarter-academy/core/arithmetic/divisibility.js';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import LabFold from '../primitives/LabFold';
import ItemFigure from '../primitives/ItemFigure';
import DivisionRoles from '../primitives/DivisionRoles';
import { ITEM_THEMES } from '../primitives/itemThemes';
import { LEVELS } from '../levels';
import * as L from '../logic/divisionJumps';

/**
 * division-jumps — LA DIVISION EUCLIDIENNE TIRÉE À LA MAIN (1AM, unité 3 « الضرب والقسمة », درس « القسمة
 * الإقليدية », manuel نشاط 3 p. 37 et معارف 2 p. 41). La logique, entière et exacte, est dans
 * `logic/divisionJumps.js` (divmod du core, importé par chemin).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. b est DONNÉ (6 fleurs par bouquet, des sauts de 14) ; l'élève TIENT q, le nombre de groupes. مبتدئ
 *    (`world: 'flowers'`, thème `garden`) : il TIRE le bout d'un RUBAN le long du rang de fleurs dessinées
 *    (glisser sur le rang, flèches ±1 — en RTL ← agrandit —, boutons −/+, toucher le rang) ; chaque pas noue
 *    les 6 fleurs suivantes en un bouquet. متقدم (`world: 'line'`, 279 ÷ 14) : il TIRE la suite de sauts sur
 *    une droite graduée (le point d'arrivée 14 × q avance ; flèches, −/+, toucher la droite).
 * B. Le quotient est le PLUS GRAND nombre de groupes de b dans a : on s'arrête quand ce qui reste est plus
 *    PETIT que b — pas quand il ne reste rien. a = b × q + r avec r < b ; b × q ≤ a < b × (q + 1).
 * C. Pendant le geste les bouquets se nouent (enveloppe + ruban au-dessus de chaque groupe de 6) ou les sauts
 *    s'allongent ; au relâchement : `over` — les fleurs qui manquent au dernier bouquet en fantômes roses
 *    pointillés ; `short` — un bouquet fantôme pointillé sur 6 des fleurs restantes ; `exact` — le reste
 *    entouré, « لا تكفي الأزهار الباقية (5) لباقة أخرى من 6 ». Sur la droite : le saut de trop qui passe
 *    après 279, le saut fantôme qui tient encore, ou l'écart 279 − 266 = 13 en segment rose + le حصر.
 * D. `47 = 6 × 7 + 5` et `5 < 6`, les quatre noms (المقسوم a, المقسوم عليه b, الحاصل q, الباقي r) ; en
 *    متقدم le حصر `14 × 19 ≤ 279 < 14 × 20`.
 * E. Avant la règle : un groupe de TROP (over), un groupe de MOINS (short) ET l'arrêt exact, relâchés par
 *    l'élève sur le nombre de la leçon. Les conjectures fausses (« quand il ne reste rien », « quand on a
 *    10 bouquets ») sont réfutées avec SES nombres (47 : 5 restent et aucun bouquet n'est possible).
 *    Le second nombre (47 → 48, la carte « زهرة جديدة! ») vient après, en transfert : il ne compte PAS dans
 *    `discoveryReady` (choix de l'auteur du lab, brief unité 3).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        le quotient euclidien = le plus grand nombre de groupes complets ; r < b
 *   OBJECT         un ruban le long d'un rang de fleurs (مبتدئ) ; une suite de sauts sur une droite (متقدم)
 *   VARIABLE       q, le nombre de groupes (0 … qMax : le quotient + un groupe entamé + deux de trop)
 *   INVARIANT      a et b ; tous les groupes ont b objets ; le tout = b × q + ce qui reste
 *   TRANSFORMATION les bouquets se nouent / les sauts avancent ; le reste rétrécit de b à chaque pas
 *   CONSTRAINT     un bouquet a b fleurs ou n'existe pas ; un saut a la longueur b
 *   RESISTANCE     over : des fleurs fantômes (elles n'existent pas) / un saut qui passe après a ;
 *                  short : un bouquet fantôme qui tient encore dans le reste / un saut fantôme
 *   EVIDENCE       le reste visible (entouré / segment rose), comparé à un bouquet ou à un saut
 *   CONTRAST       un de trop ET un de moins autour de l'arrêt ; puis 48 : une fleur de plus ferme un bouquet
 *   PREDICTION     sur la droite, les multiples ne sont PAS écrits avant qu'un saut y arrive : l'élève estime
 *                  14 × 10 = 140, 14 × 20 = 280 ; les marques du manuel « 10؟ 20؟ » sont à visiter
 *   DISCOVERY      « نتوقّف عندما يصبح الباقي أصغر من عدد الأزهار في الباقة »
 *   FORMALIZATION  a = b × q + r avec r < b ; les quatre noms ; le حصر
 *   TRANSFER       253 ÷ 17 (معارف 2, `levels={false}`), 48 ÷ 6, les مسائل et la banque
 *
 * « جرّب كل الإمكانيات » (§6bis) : NON — chaque q relâché EST la réponse de l'élève ; balayer donnerait le
 * quotient. Pas d'auto-complétion (le registre n'en déclare pas). Ce n'est ni le team-builder (b n'est pas
 * choisi, on ne porte aucun objet) ni l'étagère (la main tient q, pas b) : DNA §12.
 *
 * D'UN SEUL REGARD (§8bis) : `[data-dj-glance]` enveloppe le verdict, la lecture et ses −/+, la scène et sa
 * poignée, la carte 48 et le حصر ; la hauteur du bloc de fleurs vient de l'écran de leçon (`useLessonViewport`)
 * moins ce que le bloc mesure autour d'elle (120–420 px), et les fleurs RÉTRÉCISSENT avec lui (rangées
 * d'un nombre entier de bouquets, `flowerLayout`, testé à cinq largeurs). La droite a une hauteur fixe
 * (150 px). La liste des essais est dans un `LabFold` sous le bloc.
 *
 * Props (contrat fixé avec la leçon) : `a`, `b`, `world` ('flowers' | 'line'), `then` (facultatif ; par
 * défaut, en `flowers`, le multiple suivant de b — 48 pour 47 ÷ 6), `level`, `levels` (false : l'exemple
 * travaillé de معارف), `title`, `lead`, `onTrial({ a, b, q, r, kind: 'over' | 'short' | 'exact', ok })` à
 * chaque essai VALIDÉ (r = null pour `over`), `onFinished({ a, b })` à la règle — tous par `state.report`.
 *
 * CONTRAT DOM : [data-division-jumps][data-world][data-a][data-b][data-solved], [data-dj-glance],
 * [data-dj-scene], [data-dj-handle] (role=slider), [data-dj-less], [data-dj-more], [data-dj-reading],
 * [data-dj-group=<1..q>][data-dj-missing], [data-dj-flower=<i>], [data-dj-left=<r>], [data-dj-ghost],
 * [data-dj-verdict=<kind>], [data-dj-refused=<kind>], [data-dj-need], [data-dj-mark=<q>], [data-dj-landing],
 * [data-dj-target], [data-dj-bracket], [data-dj-next] (47 → 48), [data-dj-back], [data-dj-formal],
 * [data-lab-fold=division-jumps.trials].
 */
const NS = 'manipulation.divisionJumps';
const LINE_H = 150;
const LINE_Y = 88;
const LRI = '⁦';
const PDI = '⁩';
const iso = (s) => `${LRI}${s}${PDI}`;
const FLOWER = ITEM_THEMES.garden.itemA;
const btn = 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 px-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40';

/**
 * Une formule : UN îlot LTR (`<bdi dir="ltr">` en flex LTR) dont les morceaux sont insécables ; à l'étroit elle
 * passe à la ligne entre deux morceaux, de gauche à droite, sans jamais se réordonner (QA 320 px : une formule
 * coupée au hasard dans un paragraphe RTL se lisait « 279 > 19 »).
 */
function Formula({ pieces, className = '', ...rest }) {
  return (
    <bdi dir="ltr" className={`inline-flex flex-wrap justify-center gap-x-1.5 font-mono ${className}`} {...rest}>
      {pieces.map((p, i) => <span key={i} className="whitespace-nowrap">{p}</span>)}
    </bdi>
  );
}

/** Le second nombre du contraste : celui de la leçon, sinon (fleurs) le multiple suivant de b. */
export function thenOf(world, a, b, then) {
  if (world !== 'flowers') return null;
  if (then != null) return then;
  const { q, r } = divmod(a, b);
  return r === 0 ? null : b * (q + 1);
}

export default function DivisionJumps({
  a: a0, b: b0, world: world0, then: then0, title, lead, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const preset = LEVELS['division-jumps'][resolveLevelId(level ?? 'beginner')].numbers;
  const initialNumbers = useMemo(() => {
    const a = a0 ?? preset.a;
    const b = b0 ?? preset.b;
    const world = world0 ?? preset.world;
    const then = thenOf(world, a, b, then0 ?? (a === preset.a && b === preset.b ? preset.then : undefined));
    return then == null ? { a, b, world } : { a, b, world, then };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'division-jumps', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { a: na, b, world } = state.numbers;
  const nthen = thenOf(world, na, b, state.numbers.then);
  const sceneKey = `${na}|${b}|${world}|${nthen}|${state.epoch}`;
  const [lab, setLab] = useState(() => L.init({ a: na, b, world, then: nthen }));
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init({ a: na, b, world, then: nthen })); }

  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { a: lab.a0, b }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  const nTrials = lab.trials.length;
  useEffect(() => { if (nTrials > 0) state.report(onTrial, L.trialEvidence(lab.trials.at(-1))); }, [nTrials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── les noms comptés (ARABIC_RTL_CONTRACT « Counting nouns ») ── */
  const flowers = (n) => k('flowers', { count: n });
  const groups = (n) => k(world === 'line' ? 'jumps' : 'bouquets', { count: n });

  /* ── mesure : largeur, écran de leçon, ce qui entoure la scène ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const sceneHRef = useRef(240);
  const [width, setWidth] = useState(320);
  const [overhead, setOverhead] = useState(300);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(160, Math.floor(el.clientWidth)));
      if (glanceRef.current) setOverhead(Math.max(120, Math.ceil(glanceRef.current.getBoundingClientRect().height) - sceneHRef.current));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (glanceRef.current) ro.observe(glanceRef.current);
    return () => ro.disconnect();
  }, []);
  const vp = useLessonViewport(true);
  const screenH = vp.ready && vp.height > 0 ? vp.height : 640;
  // − 48 : la barre collante du module (« 0 / 4 ») et une marge
  const budget = Math.round(Math.max(120, Math.min(420, screenH - overhead - 48)));
  const narrow = width < 380;
  const W = Math.min(width, 760);

  /* ── la géométrie de la scène et LE geste (un seul : la piste, la poignée, −/+) ── */
  const slots = b * lab.qMax;
  const fLay = useMemo(() => (world === 'flowers' ? L.flowerLayout({ slots, b, width: W, maxHeight: budget }) : null), [world, slots, b, W, budget]);
  const lLay = useMemo(() => (world === 'line' ? L.lineLayout({ a: lab.a, b, qMax: lab.qMax, width: W }) : null), [world, lab.a, b, lab.qMax, W]);
  // la hauteur RÉELLE de la scène : ce que la mesure du bloc retire pour trouver ce qui l'entoure (sinon la boucle oscille)
  sceneHRef.current = fLay ? Math.ceil(fLay.height) + 4 : LINE_H;
  const toValue = useCallback((cx, cy, rect) => (lLay
    ? lLay.valueAt(cx - rect.left) / b
    : fLay.posAt(cx - rect.left, cy - rect.top) / b), [fLay, lLay, b]);
  const st = useStretchInteraction({
    value: lab.q, range: { min: 0, max: lab.qMax }, toValue, direction: world === 'line' ? 'ltr' : 'rtl', pageStep: 5,
    onChange: (q) => setLab((s) => L.setQ(s, q)),
    onCommit: (q) => setLab((s) => L.commitQ(s, q)),
  });

  /* ── le verdict du dernier relâchement (une seule ligne, au-dessus de la scène) ── */
  const v = L.shownVerdict(lab);
  const verdictText = useMemo(() => {
    if (!v) return '';
    const w = world;
    if (w === 'line') {
      const o = { q: v.q, land: v.need, a: v.a, b: v.b, left: v.left, over: v.missing, jumps: groups(v.q) };
      if (v.kind === 'over') return k('v.line.over', o);
      if (v.kind === 'short') return k(v.q === 0 ? 'v.line.shortZero' : 'v.line.short', o);
      return k(v.left === 0 ? 'v.line.exactZero' : 'v.line.exact', o);
    }
    const o = { q: v.q, bouquets: groups(v.q), need: flowers(v.need), have: flowers(v.a), missing: flowers(v.missing), left: flowers(v.left ?? 0), per: flowers(v.b), b: v.b };
    if (v.kind === 'over') return k(v.missing < v.b ? 'v.flowers.overLast' : 'v.flowers.over', o);
    if (v.kind === 'short') return k(v.q === 0 ? 'v.flowers.shortZero' : 'v.flowers.short', o);
    return k(v.left === 0 ? 'v.flowers.exactZero' : 'v.flowers.exact', o);
  }, [v, world, k]); // eslint-disable-line react-hooks/exhaustive-deps
  const need = L.stillToTry(lab);

  /* ── la découverte : les conjectures fausses réfutées par les nombres de l'élève ── */
  const discoveryOptions = useMemo(() => {
    const { q, r } = divmod(lab.a0, b);
    const n = q === 10 ? 20 : 10;
    const ten = L.judge(lab.a0, b, n);
    const o = { a: lab.a0, b, q, n, left: r, land: b * q, flowers: flowers(lab.a0), bouquets: groups(q), leftF: flowers(r), per: flowers(b), jumps: groups(q) };
    const tenO = { n, a: lab.a0, b, land: ten.need, left: ten.left, need: flowers(ten.need), have: flowers(lab.a0), leftF: flowers(ten.left ?? 0), groupsN: groups(n) };
    return [
      { text: k(`discovery.nothing.${world}`), why: k(`discovery.whyNothing.${world}`, o) },
      { text: k(`discovery.right.${world}`), correct: true },
      { text: k(`discovery.ten.${world}`, { n }), why: k(`discovery.whyTen.${world}.${ten.kind === 'over' ? 'over' : 'short'}`, tenO) },
    ];
  }, [lab.a0, b, world, k]); // eslint-disable-line react-hooks/exhaustive-deps

  const formalFor = (a) => (
    <p className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-0.5 font-mono text-sm font-extrabold text-indigo-950 sm:text-base" key={a}>
      <Formula pieces={L.formalPieces(a, b)} data-dj-formal-line={a} />
      <bdi dir="ltr" className="whitespace-nowrap text-rose-800">{L.remainderLine(a, b)}</bdi>
    </p>
  );
  const formal = (
    <div className="space-y-2" data-dj-formal>
      <p className="flex flex-wrap justify-center gap-x-4 font-mono text-sm font-bold text-slate-600"><bdi dir="ltr" className="whitespace-nowrap">a = b × q + r</bdi> <bdi dir="ltr" className="whitespace-nowrap">r &lt; b</bdi></p>
      {formalFor(lab.a0)}
      {L.thenDone(lab) && (
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-600">{k('formal.then', { flowers: flowers(lab.then) })}</p>
          {formalFor(lab.then)}
        </div>
      )}
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 sm:text-sm" data-division-role="a">
          <span dir="ltr" className="font-mono text-sm font-extrabold">a</span>
          <span>{k(`formal.roles.a.${world}`, { a: lab.a0 })}</span>
        </p>
        <DivisionRoles roles={['b', 'q', 'r'].map((key) => ({ key, text: k(`formal.roles.${key}.${world}`, { b, ...divmod(lab.a0, b) }) }))} />
      </div>
      {world === 'line' && (
        <p className="flex flex-wrap items-baseline justify-center gap-x-2 text-sm font-bold text-indigo-950">
          <span>{k('bracketTitle')}</span> <Formula pieces={L.bracketPieces(lab.a0, b)} />
        </p>
      )}
      <p className="text-sm text-emerald-900">{k(`formal.rule.${world}`)}</p>
    </div>
  );

  // la lecture, en étiquettes « الوصف: العدد » qui ne se coupent pas (ARABIC_RTL_CONTRACT « Counting nouns »)
  const reading = world === 'line'
    ? [['q', lab.q], ['land', b * lab.q]]
    : [['q', lab.q], ['need', b * lab.q], ['left', Math.max(0, lab.a - b * lab.q)]];

  return (
    <ManipulationShell
      type="division-jumps"
      title={title ?? k(`title.${world}`)}
      mission={k(`mission.${world}`, { a: lab.a0, b, flowers: flowers(lab.a0), per: flowers(b) })}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={[0, 1, 2].map((i) => k(`hints.${world}.${i}`, { a: lab.a0, b }))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={<ManipulationDiscovery state={state} prompt={k(`discovery.prompt.${world}`)} options={discoveryOptions} formal={formal} />}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-rose-50/50 to-white">
        <div ref={boxRef} className="space-y-2" data-division-jumps data-world={world} data-a={lab.a} data-b={b}
          data-solved={ready ? 'true' : 'false'} data-q={lab.q} data-layout={narrow ? 'narrow' : 'wide'} data-scene-h={world === 'flowers' ? budget : undefined}>
          <div ref={glanceRef} className="space-y-2" data-dj-glance>
            {/* le verdict du dernier relâchement — un seul emplacement, mis à jour en place */}
            <p role="status" aria-live="polite"
              className={`min-h-[2.5rem] rounded-xl px-2 py-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug ${v?.ok ? 'bg-emerald-50 text-emerald-900' : v ? 'bg-rose-50 text-rose-900' : 'text-slate-600'}`}
              data-dj-verdict={v?.kind ?? ''} data-dj-refused={v && !v.ok ? v.kind : undefined}>
              {verdictText}
            </p>
            {need.length > 0 && v?.kind === 'exact' && (
              <p className="text-xs font-bold text-indigo-900" data-dj-need={need.join(' ')}>{k(`need.${world}.${need[0]}`, { a: lab.a0 })}</p>
            )}

            {/* la lecture et −/+ : AU-DESSUS de la scène (ils ne bougent pas sous le doigt) */}
            <div className="flex items-center justify-between gap-2">
              <p className={`flex flex-wrap gap-x-3 gap-y-0.5 ${narrow ? 'text-xs' : 'text-sm'} font-bold text-slate-700`} data-dj-reading={lab.q}>
                {reading.map(([key, n]) => (
                  <span key={key} className="whitespace-nowrap" data-dj-read={key}>{k(`reading.${world}.${key}`)}: <span className="font-mono text-base font-extrabold text-slate-900">{n}</span></span>
                ))}
              </p>
              <div className="flex items-center gap-1.5" dir="ltr">
                <button type="button" onClick={() => st.nudge(-1)} disabled={lab.q <= 0} aria-label={k(`less.${world}`)} data-dj-less
                  className={`${btn} border-slate-300 bg-white`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" onClick={() => st.nudge(1)} disabled={lab.q >= lab.qMax} aria-label={k(`more.${world}`)} data-dj-more
                  className={`${btn} border-slate-300 bg-white`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>

            {world === 'flowers'
              ? <FlowerScene lab={lab} lay={fLay} st={st} k={k} W={W} v={v} groups={groups} />
              : <LineScene lab={lab} lay={lLay} st={st} k={k} W={W} v={v} groups={groups} />}

            {/* le حصر (droite), après un arrêt exact */}
            {/* une formule ne se coupe JAMAIS : coupée dans son îlot LTR, « 14 × 19 ≤ 279 » se lisait « 279 > 19 » (QA 320 px) */}
            {world === 'line' && v?.kind === 'exact' && (
              <p className={`flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-2 py-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold text-indigo-950`} data-dj-bracket>
                <span>{k('bracketTitle')}</span>
                <Formula pieces={[`${b} × ${v.q} ≤ ${v.a}`, `< ${b} × ${v.q + 1}`]} />
                <bdi dir="ltr" className="whitespace-nowrap font-mono text-rose-800">{`${v.a} − ${v.need} = ${v.left}`}</bdi>
              </p>
            )}

            {/* le contraste 47 → 48 : la même scène, une fleur de plus */}
            {L.canAddFlower(lab) && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-2 py-1.5" data-dj-next>
                <p className={`flex-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold text-amber-950`}>
                  <span className="font-extrabold">{k('next.title')}</span> {k('next.text', { flowers: flowers(lab.then) })}
                </p>
                <button type="button" onClick={() => setLab(L.addFlower)} className={`${btn} gap-1 border-amber-500 bg-white text-amber-900`} data-dj-next-button>
                  <Flower2 className="h-4 w-4" aria-hidden="true" /> {k('next.button')}
                </button>
              </div>
            )}
            {lab.then != null && lab.a !== lab.a0 && (
              <button type="button" onClick={() => setLab(L.backToFirst)} className={`${btn} gap-1 border-slate-300 bg-white text-xs text-slate-700`} data-dj-back>
                <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('next.back', { flowers: flowers(lab.a0) })}
              </button>
            )}
          </div>

          {lab.trials.length > 0 && (
            <LabFold id="division-jumps.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-dj-trials={lab.trials.length}>
                {lab.trials.map((tr, i) => (
                  <li key={i} className={tr.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(tr.ok)}>
                    {k('trial', { a: tr.a, groups: groups(tr.q), word: k(`kind.${world}.${tr.kind}`) })}
                  </li>
                ))}
              </ul>
            </LabFold>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ══════════════ مبتدئ : le rang de fleurs et le ruban ══════════════ */

function FlowerScene({ lab, lay, st, k, W, v, groups }) {
  const { a, b, q } = lab;
  const s = lay.size;

  const tied = b * q;
  const showGhost = v && v.q === q;
  const missing = new Set();
  if (showGhost && v.kind === 'over') for (let i = a; i < tied; i += 1) missing.add(i);
  const left = Math.max(0, a - tied);
  // le bout du ruban : avant la première fleur (q = 0) ou après la dernière fleur du bouquet q
  const tipX = q === 0 ? lay.right : lay.x(tied - 1);
  const tipY = q === 0 ? lay.lane * 0.5 : lay.y(tied - 1) - lay.lane * 0.5;
  const bouquetBox = (g) => {
    const first = g * b;
    const last = first + b - 1;
    return { x: lay.x(last) - s * 0.12, y: lay.y(first) - lay.lane * 0.85, w: lay.x(first) - lay.x(last) + s * 1.24, h: s + lay.lane * 0.85 + s * 0.06 };
  };

  return (
    <div className="relative mx-auto overflow-hidden rounded-xl border border-rose-100 bg-gradient-to-b from-white to-emerald-50/40"
      style={{ width: W, height: Math.ceil(lay.height) + 4 }} data-dj-scene data-dj-size={s.toFixed(1)} data-dj-rows={lay.rows} data-dj-per-row={lay.perRow}>
      <svg width={W} height={Math.ceil(lay.height) + 4} className="absolute inset-0" style={{ direction: 'ltr' }} role="img"
        aria-label={k('sceneAria.flowers', { a, b, q })}>
        {/* les bouquets noués : une enveloppe et un ruban au-dessus de chaque groupe de b */}
        {Array.from({ length: q }, (_, g) => {
          const box = bouquetBox(g);
          const incomplete = (g + 1) * b > a;
          const midX = box.x + box.w / 2;
          const ry = box.y + lay.lane * 0.35;
          return (
            <g key={g} data-dj-group={g + 1} data-dj-missing={incomplete ? Math.min(b, (g + 1) * b - a) : undefined}
              className="transition-opacity duration-150 motion-reduce:transition-none">
              <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={s * 0.3}
                fill={incomplete ? '#FFF1F2' : '#ECFDF5'} stroke={incomplete ? '#E11D48' : '#10B981'} strokeWidth={1.5} strokeDasharray={incomplete ? '4 3' : undefined} />
              <path d={`M${box.x + s * 0.2} ${ry + lay.lane * 0.25} Q${midX} ${ry - lay.lane * 0.5} ${box.x + box.w - s * 0.2} ${ry + lay.lane * 0.25}`}
                fill="none" stroke={incomplete ? '#E11D48' : '#DB2777'} strokeWidth={Math.max(2, s * 0.09)} strokeLinecap="round" />
              <circle cx={midX} cy={ry - lay.lane * 0.12} r={Math.max(2.5, s * 0.1)} fill={incomplete ? '#E11D48' : '#DB2777'} />
            </g>
          );
        })}
        {/* le bouquet fantôme d'un `short` : il tient encore dans ce qui reste */}
        {showGhost && v.kind === 'short' && (() => {
          const box = bouquetBox(q);
          return <rect data-dj-ghost="bouquet" x={box.x} y={box.y} width={box.w} height={box.h} rx={s * 0.3} fill="none" stroke="#4F46E5" strokeWidth={2} strokeDasharray="5 4" />;
        })()}
        {/* les fleurs (une seule fois chacune), puis les fantômes des fleurs qui manquent */}
        {Array.from({ length: a }, (_, i) => (
          <g key={i} transform={`translate(${lay.x(i)} ${lay.y(i)})`} data-dj-flower={i}>
            <ItemFigure kind={FLOWER.kind} tone={FLOWER.tone} width={s} />
          </g>
        ))}
        {[...missing].map((i) => (
          <circle key={`g${i}`} data-dj-ghost="flower" cx={lay.x(i) + s / 2} cy={lay.y(i) + s * 0.42} r={s * 0.34} fill="none" stroke="#E11D48" strokeWidth={1.6} strokeDasharray="3 3" />
        ))}
        {/* ce qui reste hors des bouquets : entouré après un arrêt exact */}
        {left > 0 && (
          <g data-dj-left={left}>
            {showGhost && v.kind === 'exact' && Array.from({ length: left }, (_, j) => {
              const i = tied + j;
              return <rect key={i} x={lay.x(i) + 1} y={lay.y(i) - 1} width={s - 2} height={s + 2} rx={s * 0.25} fill="none" stroke="#D97706" strokeWidth={1.6} />;
            })}
          </g>
        )}
      </svg>
      {/* le rang est la PISTE : toucher y pose le bout du ruban ; la poignée est au bout du ruban */}
      <div {...st.trackProps} className="absolute inset-0" style={st.trackProps.style}>
        <div {...st.handleProps({ label: k('handle.flowers'), valueText: k('handleValue.flowers', { bouquets: groups(q) }) })}
          data-dj-handle
          className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none"
          style={{ left: Math.max(22, Math.min(W - 22, tipX)), top: Math.max(22, tipY), cursor: st.dragging ? 'grabbing' : 'grab' }}>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-pink-600 bg-white/95 shadow group-focus-visible:ring-4 group-focus-visible:ring-pink-300">
            <ChevronsLeftRight className="h-4 w-4 text-pink-700" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ متقدم : la droite graduée et les sauts ══════════════ */

function LineScene({ lab, lay, st, k, W, v, groups }) {
  const { a, b, q } = lab;
  const showGhost = v && v.q === q;
  const land = b * q;
  const xa = lay.xOf(a);
  const xl = lay.xOf(land);
  // les multiples déjà atteints par un saut relâché (l'élève les a trouvés) ; jamais les autres
  const visited = [...new Set(lab.trials.filter((tr) => tr.a === a).map((tr) => tr.q * b))].filter((m) => m !== land);
  const labelled = [];
  const visitedShown = visited.sort((x, y) => x - y).filter((m) => {
    const x = lay.xOf(m);
    if (Math.abs(x - xl) < 26 || labelled.some((u) => Math.abs(u - x) < 26)) return false;
    labelled.push(x);
    return true;
  });
  const arc = (x0, x1, h) => `M${x0} ${LINE_Y} Q${(x0 + x1) / 2} ${LINE_Y - 2 * h} ${x1} ${LINE_Y}`;
  const hOf = (w) => Math.max(6, Math.min(26, w * 0.55));
  const marks = L.marksOf(a, b);

  return (
    <div className="relative mx-auto overflow-hidden rounded-xl border border-indigo-100 bg-white" style={{ width: W, height: LINE_H }} data-dj-scene>
      <svg width={W} height={LINE_H} className="absolute inset-0" style={{ direction: 'ltr' }} role="img"
        aria-label={k('sceneAria.line', { a, b, q, land, L: lay.L })}>
        {/* la droite, ses graduations ; des nombres « ronds » seulement */}
        <line x1={lay.x0 - 8} x2={lay.x1 + 10} y1={LINE_Y} y2={LINE_Y} stroke="#334155" strokeWidth={2} />
        <path d={`M${lay.x1 + 10} ${LINE_Y - 4} L${lay.x1 + 17} ${LINE_Y} L${lay.x1 + 10} ${LINE_Y + 4} Z`} fill="#334155" />
        {lay.ticks.map((tk) => (
          <g key={tk.v}>
            <line x1={tk.x} x2={tk.x} y1={LINE_Y - (tk.major ? 6 : 3)} y2={LINE_Y + (tk.major ? 6 : 3)} stroke="#64748B" strokeWidth={tk.major ? 1.4 : 0.8} />
            {tk.label && <text x={tk.x} y={LINE_Y + 19} textAnchor="middle" fontSize={10} fill="#475569" fontFamily="ui-monospace, monospace">{tk.v}</text>}
          </g>
        ))}
        {/* le nombre à atteindre */}
        <g data-dj-target={a}>
          <line x1={xa} x2={xa} y1={LINE_Y - 56} y2={LINE_Y + 8} stroke="#BE123C" strokeWidth={2} />
          <text x={xa} y={LINE_Y - 60} textAnchor="middle" fontSize={13} fontWeight={800} fill="#9F1239" fontFamily="ui-monospace, monospace">{a}</text>
        </g>
        {/* les sauts : de (i − 1)·b à i·b ; ceux qui passent après a sont de trop */}
        {Array.from({ length: q }, (_, i) => {
          const j = lay.jump(i + 1);
          const over = j.to > a;
          return (
            <path key={i} d={arc(j.x0, j.x1, hOf(j.x1 - j.x0))} fill="none" data-dj-group={i + 1} data-dj-missing={over ? j.to - a : undefined}
              stroke={over ? '#E11D48' : '#4F46E5'} strokeWidth={2} strokeDasharray={over ? '4 3' : undefined} />
          );
        })}
        {/* le saut fantôme d'un `short` : il tient encore avant a */}
        {showGhost && v.kind === 'short' && (() => {
          const j = lay.jump(q + 1);
          return <path data-dj-ghost="jump" d={arc(j.x0, j.x1, hOf(j.x1 - j.x0))} fill="none" stroke="#059669" strokeWidth={2} strokeDasharray="5 4" />;
        })()}
        {showGhost && v.kind === 'over' && (
          <line data-dj-ghost="past" x1={xa} x2={xl} y1={LINE_Y} y2={LINE_Y} stroke="#E11D48" strokeWidth={5} strokeDasharray="3 3" strokeLinecap="round" />
        )}
        {/* l'écart a − b·q : ce qui reste, en rose, après un arrêt exact */}
        {land <= a && (
          <g data-dj-left={a - land}>
            {showGhost && v.kind === 'exact' && a > land && <line x1={xl} x2={xa} y1={LINE_Y} y2={LINE_Y} stroke="#E11D48" strokeWidth={5} strokeLinecap="round" />}
          </g>
        )}
        {/* les multiples trouvés, sous la droite ; le point d'arrivée au-dessus */}
        {visitedShown.map((m) => (
          <text key={m} x={lay.xOf(m)} y={LINE_Y + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#4338CA" fontFamily="ui-monospace, monospace" data-dj-visited={m}>{m}</text>
        ))}
        <text x={Math.max(14, Math.min(W - 14, xl))} y={LINE_Y - 34} textAnchor="middle" fontSize={12} fontWeight={800} fill="#312E81"
          fontFamily="ui-monospace, monospace" stroke="#FFFFFF" strokeWidth={3} paintOrder="stroke" data-dj-landing={land}>{land}</text>
        {/* les marques du manuel (« 10؟ 20؟ ») : des nombres de sauts à visiter, jamais des réponses */}
        {marks.map((n) => (
          <g key={n} data-dj-mark={n} data-hit={n === q ? 'true' : 'false'}>
            <line x1={lay.xOf(n * b)} x2={lay.xOf(n * b)} y1={LINE_Y + 40} y2={LINE_Y + 46} stroke="#A16207" strokeWidth={1.5} />
            <text x={lay.xOf(n * b)} y={LINE_Y + 58} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={n === q ? '#4338CA' : '#A16207'}
              style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{k('mark', { jumps: groups(n) })}</text>
          </g>
        ))}
      </svg>
      <div {...st.trackProps} className="absolute inset-0" style={st.trackProps.style}>
        <div {...st.handleProps({ label: k('handle.line'), valueText: k('handleValue.line', { jumps: groups(q), land }) })}
          data-dj-handle
          className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-indigo-600 bg-white/90 shadow outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
          style={{ left: xl, top: LINE_Y, cursor: st.dragging ? 'grabbing' : 'grab' }}>
          <ChevronsLeftRight className="h-5 w-5 text-indigo-700" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

