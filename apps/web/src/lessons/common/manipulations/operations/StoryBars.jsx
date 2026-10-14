import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ChevronsUpDown, ArrowLeft, Check } from 'lucide-react';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import useDragInteraction from '../useDragInteraction';
import DropZone from '../primitives/DropZone';
import DragGhost from '../primitives/DragGhost';
import LabFold from '../primitives/LabFold';
import ArcTape from '../../components/ArcTape';
import * as L from '../logic/storyBars';

/**
 * story-bars — LE MODÈLE EN BARRES D'UNE HISTOIRE (1AM, unité 2 « الجمع والطرح », درس « معنى الجمع والطرح »,
 * manuel pp. 25, 26, 29). La logique, exacte, est dans `logic/storyBars.js` ; la bande est `ArcTape`
 * (« مخطط بأقواس », components/arcTape.js), qui dessine elle-même l'écart ou le débordement quand les
 * parties ne font pas le tout.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève TIENT L'INCONNUE. مبتدئ (`checkup`) et la méthode p. 29 (`method29`) : il TIRE la tête d'un
 *    enfant devant la toise (glisser vertical sur la scène, flèches ±1, Page ±5, boutons −/+, toucher la
 *    toise) jusqu'à ce que la phrase de l'histoire soit vraie ; puis il CHOISIT une des trois cartes de
 *    calcul (toucher, Entrée). متقدم (`act1`, نشاط 1) : il PORTE chaque carte de calcul du manuel sur le
 *    texte qu'elle résout (glisser, toucher-toucher, clavier).
 * B. Idée : ce ne sont pas les mots « يزيد / ينقص / أكثر / أقل » qui décident de l'opération, c'est la
 *    STRUCTURE — si l'inconnue est le TOUT on additionne les parties, si c'est une PARTIE on soustrait
 *    l'autre partie du tout.
 * C. La tête suit le doigt ; une ligne pointillée joint les deux têtes et un arc entre elles porte la
 *    différence vivante (« 6 cm ») ; au relâchement la lampe de la phrase s'allume ou la phrase refuse,
 *    avec les nombres de l'élève. Une carte de calcul dessine sa taille en TÊTE FANTÔME. La bonne carte
 *    ferme la bande (le tout = l'enfant le plus grand). En متقدم, une carte refusée revient et la bande
 *    du texte se dessine avec sa valeur à la place de l'inconnue — ouverte (écart ou débordement).
 * D. La ligne formelle « □ = 130 + 6 = 136 » et la bande fermée ; en متقدم la bande fermée de chaque
 *    texte ; après la découverte, la bande générique « الكلّ = جزء + جزء ».
 * E. À découvrir avant la règle : une addition, une soustraction ET un piège (« تزيد » → on soustrait)
 *    faits à la main (checkup items 1–3 ; act1 les six textes). Les conjectures fausses sont réfutées
 *    par les items de l'élève (نزيم / النص ③ contre « le mot décide » ; أمين / النص ① contre « on
 *    soustrait toujours le petit du grand »). L'item 4 (ياسين, l'autre piège) reste un transfert.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        l'opération vient de la structure tout / parties, pas du mot de l'énoncé
 *   OBJECT         la taille d'un enfant devant la toise (مبتدئ) ; une carte de calcul (متقدم)
 *   VARIABLE       la taille inconnue h (cm entier, 100–150) ; le texte où la carte est posée
 *   INVARIANT      la taille de l'enfant connu (130 cm) et la différence de la phrase ; le tout = la somme
 *                  des parties (la bande ne se ferme qu'à cette condition, jugée EXACTEMENT)
 *   TRANSFORMATION la tête monte / descend, l'arc de différence grandit, la lampe s'allume ; la tête
 *                  fantôme d'une carte ; la bande se ferme ou montre son écart
 *   CONSTRAINT     la toise (100–150) ; une carte n'est choisie qu'une fois la phrase vraie ; une carte
 *                  n'entre que dans le texte qu'elle résout
 *   RESISTANCE     la phrase refuse avec les nombres de l'élève (« بهذا الطول تكون ريم أطول من سارة… ») ;
 *                  « 6 − 130 » n'a pas de taille ; la bande d'un texte reste ouverte (écart / débordement)
 *   EVIDENCE       la lampe, l'arc de différence, la tête fantôme, la bande fermée et « □ = 130 + 6 = 136 »
 *   CONTRAST       un TOUT inconnu (أمين, +), une PARTIE inconnue (ريم, −) et un PIÈGE (نزيم : « تزيد » → −)
 *   PREDICTION     la taille tirée AVANT tout calcul ; en متقدم la carte posée avant de voir la bande
 *   DISCOVERY      « إذا كان المجهول هو الكلّ نجمع الجزأين، وإذا كان جزءًا نطرح الجزء الآخر من الكلّ »
 *   FORMALIZATION  la bande générique + « الكلّ = جزء + جزء » / « جزء = الكلّ − الجزء الآخر »
 *   TRANSFER       ياسين (le second piège) ; la méthode p. 29 (يونس, محمد) ; les مسائل et la banque
 *                  (`statement.figure` de kind `tape`)
 *
 * « جرّب كل الإمكانيات » (§6bis) : NON — chaque taille tirée et chaque carte EST la réponse de l'élève ;
 * la balayer donnerait la réponse. Pas d'auto-complétion (le registre n'en déclare pas).
 *
 * D'UN SEUL REGARD (§8bis) : `[data-sb-glance]` enveloppe la phrase, les cartes, la scène, la poignée,
 * ses −/+, la lecture et la bande ; la hauteur de la scène vient de l'écran de leçon (`useLessonViewport`)
 * moins ce que le bloc mesure autour d'elle (170–420 px) ; la poignée est À CÔTÉ de la tête de l'enfant ;
 * la phrase et les cartes sont AU-DESSUS de la scène ; la liste des essais est dans un `LabFold` sous le
 * bloc. En متقدم : les cartes au-dessus, les six textes en deux colonnes ; sous 520 px de large (QA 320×640 : 1084 px
 * de haut sinon), les cartes en grille de 3 et UN texte à la fois — le sélecteur ①–⑥ (`role=tablist`, flèches,
 * ✓ sur un texte résolu) dont chaque onglet est la zone d'accueil de son texte, plus le panneau du texte choisi.
 *
 * Props (contrat fixé avec la leçon) : `story` ('checkup' | 'act1' | 'method29'), `level`, `levels`
 * (false : l'exemple travaillé de M3), `title`, `lead`, `onTrial({ story, item, kind, value, ok, calc? })`
 * à chaque essai VALIDÉ, `onFinished({ story })` à la règle (ou, sans découverte, quand tout est fait) —
 * tous par `state.report`.
 *
 * CONTRAT DOM : [data-story-bars][data-story][data-mode][data-item][data-solved], [data-sb-glance],
 * [data-sb-item-chip=<i>][aria-current], [data-sb-sentence][data-ok], [data-sb-scene], [data-sb-handle]
 * (role=slider), [data-sb-less], [data-sb-more], [data-sb-person=<id>][data-height], [data-sb-diff],
 * [data-sb-ghost][data-ok], [data-sb-calc=<i>][data-value][data-tried] (i canonique : 0 = a + d,
 * 1 = a − d, 2 = d − a), [data-sb-formal-line], [data-sb-next], [data-sb-card=<id>][data-placed],
 * [data-sb-slot=<n>][data-matched][data-tried] (étroit : l'onglet role=tab ; [data-sb-compact], [data-sb-panel=<n>]
 * pour le panneau du texte choisi), [data-sb-verdict], [data-sb-refused=<kind>],
 * [data-sb-formal], [data-lab-fold=story-bars.trials], et la bande `[data-arc-tape][data-tape-closed]`.
 */
const NS = 'manipulation.storyBars';
const SHIRTS = ['#0EA5E9', '#F97316', '#10B981', '#8B5CF6', '#EC4899'];
const KNOWN_SHIRT = '#E11D48';
const btn = 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 px-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40';

export default function StoryBars({
  story: story0 = 'checkup', title, lead, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const state = useManipulation({ type: 'story-bars', initialNumbers: { story: story0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const story = state.numbers.story;
  const def = L.storyOf(story);
  const sceneKey = `${story}|${state.epoch}`;
  const [lab, setLab] = useState(() => L.init(story));
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init(story)); }

  const ready = L.discoveryReady(lab);
  const done = L.allDone(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { story }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  // une histoire sans découverte (la méthode p. 29) finit quand tous ses items sont faits
  useEffect(() => { if (!def.discovery && done) state.report(onFinished, { story }); }, [done, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  const nTrials = lab.trials.length;
  useEffect(() => { if (nTrials > 0) state.report(onTrial, L.trialEvidence(lab, lab.trials.at(-1))); }, [nTrials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── les mots de l'histoire ── */
  const knownName = def.mode === 'stretch' ? k(`stories.${story}.known`) : '';
  const itemWords = (i) => {
    const id = def.items[i].id;
    const o = { d: def.items[i].d };
    return {
      name: k(`stories.${story}.items.${id}.name`),
      sentence: k(`stories.${story}.items.${id}.sentence`, o),
      taller: k(`stories.${story}.items.${id}.taller`),
      shorter: k(`stories.${story}.items.${id}.shorter`),
    };
  };
  const textWords = (i) => ({
    text: k(`stories.act1.texts.${i}.text`),
    p0: k(`stories.act1.texts.${i}.words.p0`),
    p1: k(`stories.act1.texts.${i}.words.p1`),
    whole: k(`stories.act1.texts.${i}.words.whole`),
  });

  /* ── mesure : largeur, écran de leçon, ce qui entoure la scène ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const sceneHRef = useRef(260);
  const [width, setWidth] = useState(320);
  const [overhead, setOverhead] = useState(320);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(240, Math.floor(el.clientWidth)));
      if (glanceRef.current) setOverhead(Math.max(160, Math.ceil(glanceRef.current.getBoundingClientRect().height) - sceneHRef.current));
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
  const sceneH = Math.round(Math.max(170, Math.min(420, screenH - overhead - 16)));
  sceneHRef.current = def.mode === 'stretch' ? sceneH : 0;
  const narrow = width < 380;

  /* ── le verdict (une seule ligne, sous la phrase et les cartes) ── */
  const verdict = useMemo(() => {
    const last = lab.last;
    if (!last) return null;
    if (def.mode === 'cards') {
      if (last.kind !== 'card') return null;
      const card = L.cardsOf(story)[last.card];
      const o = { calc: L.calcText(card), value: L.dec(L.calcValue(card)), n: def.items[last.item].n };
      if (last.ok) return { kind: 'ok', ok: true, text: k('v.cardOk', o) };
      return { kind: last.verdict, ok: false, text: k(`stories.act1.texts.${last.item}.wrongWhy`, o) };
    }
    const w = itemWords(last.item);
    switch (last.kind) {
      case 'stretch': {
        const v = last.verdict;
        const o = { name: w.name, known: knownName, h: v.h, d: v.d, diff: v.diff, says: w.sentence, got: v.taller ? w.taller : w.shorter };
        return v.ok ? { kind: 'ok', ok: true, text: k('v.ok', o) } : { kind: v.kind, ok: false, text: k(`v.${v.kind}`, o) };
      }
      case 'locked': return { kind: 'locked', ok: null, text: k('v.locked', { name: w.name }) };
      case 'calcFirst': return { kind: 'calcFirst', ok: null, text: k('v.calcFirst', { name: w.name }) };
      case 'calcDone': return { kind: 'calcDone', ok: null, text: k('v.calcDone') };
      case 'calc': {
        const v = last.verdict;
        const o = { calc: L.calcText(v.calc), value: L.dec(v.value), name: w.name, a: v.calc.a, b: v.calc.b, says: w.sentence, got: v.taller ? w.taller : w.shorter };
        if (v.ok) return { kind: 'ok', ok: true, text: k('v.calcOk', o) };
        return { kind: v.kind, ok: false, text: k(v.kind === 'impossible' ? 'v.calcImpossible' : 'v.calcWrong', o) };
      }
      default: return null;
    }
  }, [lab, story, k]); // eslint-disable-line react-hooks/exhaustive-deps
  const verdictLine = (
    <p role="status" aria-live="polite" className={`min-h-[2.5rem] rounded-xl px-2 py-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug ${verdict?.ok === true ? 'bg-emerald-50 text-emerald-900' : verdict?.ok === false ? 'bg-rose-50 text-rose-900' : 'text-slate-700'}`}
      data-sb-verdict={verdict?.kind ?? ''} data-sb-refused={verdict?.ok === false ? verdict.kind : undefined}>
      {verdict?.text}
    </p>
  );

  /* ── la découverte : les conjectures fausses réfutées par les items de l'élève ── */
  const discoveryOptions = useMemo(() => {
    if (!def.discovery) return null;
    const word = L.rightCalcOf(story, def.refute.word);
    const big = L.rightCalcOf(story, def.refute.big);
    return [
      { text: k(`stories.${story}.optWord`), why: k(`stories.${story}.whyWord`, word) },
      { text: k('discovery.optRight'), correct: true },
      { text: k('discovery.optBig'), why: k(`stories.${story}.whyBig`, big) },
    ];
  }, [story, k]); // eslint-disable-line react-hooks/exhaustive-deps

  const formal = def.discovery ? (
    <div className="space-y-2" data-sb-formal>
      <ArcTape kind="tape" parts={[{ label: k('formal.part') }, { label: k('formal.part') }]} whole={{ label: k('formal.whole') }}
        ariaLabel={k('tapeAria', { whole: k('formal.whole'), p0: k('formal.part'), p1: k('formal.part') })} maxWidth={320} />
      <p className="text-center text-sm font-extrabold text-indigo-950">{k('formal.lineWhole')}</p>
      <p className="text-center text-sm font-extrabold text-indigo-950">{k('formal.linePart')}</p>
      <p className="text-sm text-emerald-900">{k('formal.rule')}</p>
      <p className="text-xs text-slate-700">
        {k('formal.examples')}{' '}
        {[def.refute.big, def.refute.word].map((i) => (
          <bdi key={i} dir="ltr" className="mx-1 inline-block font-mono font-bold">{L.formalLine(story, i)}</bdi>
        ))}
      </p>
    </div>
  ) : null;

  const hintKeys = def.mode === 'stretch' ? 'stretch' : 'cards';
  const currentItem = def.mode === 'stretch' ? def.items[lab.cur].id : (def.items[Math.min(L.firstUndone(lab), def.items.length - 1)].id);

  return (
    <ManipulationShell
      type="story-bars"
      title={title ?? k(`title.${story}`)}
      mission={k(`mission.${story}`, { known: def.known?.h })}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={[0, 1, 2].map((i) => k(`hints.${hintKeys}.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={def.discovery ? (
        <ManipulationDiscovery state={state} prompt={k('discovery.prompt')} options={discoveryOptions} formal={formal} />
      ) : null}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-sky-50/60 to-white">
        <div ref={boxRef} className="space-y-2" data-story-bars data-story={story} data-mode={def.mode} data-item={currentItem}
          data-solved={(def.discovery ? ready : done) ? 'true' : 'false'} data-layout={narrow ? 'narrow' : 'wide'} data-scene-h={def.mode === 'stretch' ? sceneH : undefined}>
          {def.mode === 'stretch' ? (
            <StretchLab lab={lab} setLab={setLab} story={story} def={def} k={k} knownName={knownName} itemWords={itemWords}
              width={width} sceneH={sceneH} narrow={narrow} glanceRef={glanceRef} verdictLine={verdictLine} />
          ) : (
            <CardsLab lab={lab} setLab={setLab} story={story} def={def} k={k} textWords={textWords}
              narrow={narrow} compact={width < 520} glanceRef={glanceRef} verdictLine={verdictLine} />
          )}

          {lab.trials.length > 0 && (
            <LabFold id="story-bars.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-sb-trials={lab.trials.length}>
                {lab.trials.map((tr, i) => (
                  <li key={i} className={tr.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(tr.ok)}>
                    {tr.kind === 'stretch' && k('trialStretch', { name: itemWords(tr.item).name, h: tr.value })}
                    {tr.kind === 'calc' && k('trialCalc', { name: itemWords(tr.item).name, calc: tr.calc, value: tr.value })}
                    {tr.kind === 'card' && k('trialCard', { n: def.items[tr.item].n, calc: tr.calc, value: tr.value })}
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

/* ══════════════ مبتدئ / méthode p. 29 : la toise ══════════════ */

/** Les étiquettes de la bande d'un item stretch : « سارة 130 », « الفرق 6 », « أمين 136 » (ou □). */
export function stretchTape(story, i, value, k, knownName, name) {
  const tp = L.tapeOf(story, i, value);
  // fermée, l'inconnue garde son « □ » (comme le manuel p. 29 ; la valeur est écrite dans la ligne « □ = … ») ;
  // ouverte, elle porte la valeur essayée — c'est elle qui ne ferme pas la bande
  const label = (p) => `${p.role === 'known' ? knownName : p.role === 'diff' ? k('diffWord') : name} ${p.unknown && (tp.closed || p.value == null) ? k('unknownBox') : p.value}`;
  return {
    closed: tp.closed,
    fig: {
      kind: 'tape',
      parts: tp.parts.map((p) => ({ label: label(p), value: p.value ?? undefined, unknown: p.unknown })),
      whole: { label: label(tp.whole), value: tp.whole.value ?? undefined, unknown: tp.whole.unknown },
      ariaLabel: k(tp.closed ? 'tapeAria' : 'tapeAriaOpen', { whole: label(tp.whole), p0: label(tp.parts[0]), p1: label(tp.parts[1]) }),
    },
  };
}

function StretchLab({ lab, setLab, story, def, k, knownName, itemWords, width, sceneH, narrow, glanceRef, verdictLine }) {
  const i = lab.cur;
  const it = lab.items[i];
  const item = def.items[i];
  const w = itemWords(i);
  const firstOpen = L.firstUndone(lab);
  const isDone = L.itemDone(lab, i);
  const triedCalc = new Set(lab.trials.filter((tr) => tr.item === i && tr.kind === 'calc').map((tr) => tr.card));

  /* la géométrie de la scène (px) : toise à gauche (SVG LTR), l'enfant connu, l'inconnu, la voie de la poignée */
  const W = Math.min(width, 380);
  const H = sceneH;
  const g = L.gaugeScale(H);
  const rulerW = 38;
  const lane = 50;
  const free = W - rulerW - lane;
  const knownCx = rulerW + free * 0.3;
  const unkCx = rulerW + free * 0.76;
  const r = Math.max(10, Math.min(9 * g.k, 26, free * 0.15));
  const yKnown = g.yOf(def.known.h);
  const yH = g.yOf(it.h);
  const diff = Math.abs(it.h - def.known.h);
  const handleX = Math.min(W - 46, unkCx + r + 6);

  const toValue = useCallback((_cx, cy, rect) => L.gaugeScale(rect.height).cmAt(cy - rect.top), []);
  const st = useStretchInteraction({
    value: it.h, range: { min: L.GAUGE.min, max: L.GAUGE.max }, toValue, direction: 'ltr', pageStep: 5,
    onChange: (v) => setLab((s) => L.setHeight(s, v)),
    onCommit: (v) => setLab((s) => L.commitHeight(s, v)),
  });
  const ticks = L.gaugeTicks();
  const ghost = it.ghost && it.ghost.h != null && it.ghost.h >= L.VIEW.lo && it.ghost.h <= L.VIEW.hi ? it.ghost : null;
  const tape = isDone ? stretchTape(story, i, L.answerOf(story, i), k, knownName, w.name) : null;
  const order = L.calcOrder(story, i);
  const cards = L.calcCards(story, i);

  return (
    <div ref={glanceRef} className="space-y-2" data-sb-glance>
      {/* les items (dans l'ordre) */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={k('items')}>
        {def.items.map((d, j) => {
          const jDone = L.itemDone(lab, j);
          return (
            <button key={d.id} type="button" onClick={() => setLab((s) => L.goTo(s, j))} disabled={j > firstOpen}
              aria-current={j === i ? 'step' : undefined} data-sb-item-chip={j} data-done={jDone ? 'true' : 'false'}
              className={`${btn} gap-1 text-xs ${j === i ? 'border-indigo-600 bg-indigo-600 text-white' : jDone ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-white text-slate-700'}`}>
              {jDone && <Check className="h-3.5 w-3.5" aria-hidden="true" />}{itemWords(j).name}
            </button>
          );
        })}
      </div>

      {/* la phrase et sa lampe */}
      <p className={`flex items-start gap-2 rounded-xl border-2 px-3 py-2 ${narrow ? 'text-sm' : 'text-base'} font-extrabold leading-snug ${it.stretchOk ? 'border-emerald-400 bg-emerald-50 text-emerald-950' : 'border-amber-300 bg-amber-50/70 text-slate-900'}`}
        data-sb-sentence data-ok={it.stretchOk ? 'true' : 'false'}>
        <span aria-hidden="true" className={`mt-1 inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors motion-reduce:transition-none ${it.stretchOk ? 'border-emerald-600 bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'border-slate-400 bg-slate-200'}`} />
        <span>« {w.sentence} »</span>
      </p>

      {/* les trois cartes de calcul (au-dessus de la scène) */}
      <div className="space-y-1" data-sb-calcs>
        <p className="text-xs font-bold text-slate-600">{it.stretchOk ? k('calcTitle', { name: w.name }) : k('calcWait')}</p>
        <div className="flex flex-wrap gap-1.5" dir="ltr">
          {order.map((ci) => {
            const c = cards[ci];
            const tried = triedCalc.has(ci);
            const right = isDone && ci === L.rightCalc(story, i);
            return (
              <button key={ci} type="button" onClick={() => setLab((s) => L.chooseCalc(s, ci))} disabled={!it.stretchOk || it.calcOk}
                aria-label={k('calcAria', { calc: L.calcText(c) })} data-sb-calc={ci} data-value={L.dec(L.calcValue(c))} data-tried={tried ? 'true' : 'false'}
                className={`${btn} font-mono ${right ? 'border-emerald-600 bg-emerald-600 text-white disabled:opacity-100' : tried ? 'border-rose-300 bg-rose-50 text-rose-800 line-through' : 'border-indigo-300 bg-white text-indigo-950'}`}>
                {L.calcText(c)}
              </button>
            );
          })}
        </div>
      </div>

      {verdictLine}

      <div className="flex flex-wrap items-start gap-3">
        {/* la scène : la toise, les deux enfants, la poignée */}
        <div className="space-y-1" style={{ width: W }}>
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-sky-50 to-amber-50/40" style={{ width: W, height: H }} data-sb-scene>
            <svg width={W} height={H} className="absolute inset-0" style={{ direction: 'ltr' }} role="img"
              aria-label={k('gaugeAria', { known: knownName, k: def.known.h, name: w.name, h: it.h })}>
              {/* la toise : bois, un trait par cm, un nombre tous les 10 cm */}
              <rect x={4} y={0} width={rulerW - 8} height={H} fill="#FEF3C7" stroke="#B45309" strokeWidth={1.5} />
              {ticks.map((tk) => (
                <g key={tk.cm}>
                  <line x1={rulerW - 4 - (tk.major ? 14 : tk.mid ? 9 : 5)} x2={rulerW - 4} y1={g.yOf(tk.cm)} y2={g.yOf(tk.cm)} stroke="#78350F" strokeWidth={tk.major ? 1.4 : 0.8} />
                  {tk.major && <text x={7} y={g.yOf(tk.cm) + 3.5} fontSize={10} fontWeight={700} fill="#78350F" fontFamily="ui-monospace, monospace">{tk.cm}</text>}
                </g>
              ))}
              {/* les hauteurs lues sur la toise : pointillés d'une tête à l'autre */}
              <line x1={rulerW - 4} x2={unkCx + r} y1={yKnown} y2={yKnown} stroke={KNOWN_SHIRT} strokeWidth={1.5} strokeDasharray="5 4" />
              <line x1={rulerW - 4} x2={unkCx} y1={yH} y2={yH} stroke="#4F46E5" strokeWidth={1.5} strokeDasharray="5 4" />
              <Child cx={knownCx} top={yKnown} r={r} H={H} shirt={KNOWN_SHIRT} person={def.known.id} height={def.known.h} />
              <Child cx={unkCx} top={yH} r={r} H={H} shirt={SHIRTS[i % SHIRTS.length]} person={item.id} height={it.h} unknown={!it.stretchOk} mark={k('unknownMark')} />
              {/* la barre de la toise posée sur la tête de l'inconnu */}
              <rect x={unkCx - r - 4} y={yH - 4} width={2 * r + 8} height={4} rx={1.5} fill="#4F46E5" />
              {/* l'arc de différence, vivant */}
              {diff > 0 && (
                <g data-sb-diff={diff}>
                  <path d={`M${(knownCx + unkCx) / 2} ${yKnown} Q${(knownCx + unkCx) / 2 + 14} ${(yKnown + yH) / 2} ${(knownCx + unkCx) / 2} ${yH}`} fill="none" stroke="#D97706" strokeWidth={2.5} />
                  <text x={(knownCx + unkCx) / 2 + 12} y={(yKnown + yH) / 2 + 4} fontSize={12} fontWeight={800} fill="#92400E" fontFamily="ui-monospace, monospace"
                    stroke="#FFFBEB" strokeWidth={3} paintOrder="stroke">{`${diff} cm`}</text>
                </g>
              )}
              {/* la tête fantôme d'une carte de calcul */}
              {ghost && (
                <g data-sb-ghost={ghost.h} data-ok={ghost.ok ? 'true' : 'false'}>
                  <circle cx={unkCx} cy={g.yOf(ghost.h) + r} r={r} fill="none" stroke={ghost.ok ? '#059669' : '#E11D48'} strokeWidth={2} strokeDasharray="4 3" />
                  <line x1={unkCx - r - 6} x2={unkCx + r + 6} y1={g.yOf(ghost.h)} y2={g.yOf(ghost.h)} stroke={ghost.ok ? '#059669' : '#E11D48'} strokeWidth={1.5} strokeDasharray="3 3" />
                  <text x={unkCx - r - 8} y={g.yOf(ghost.h) - 3} textAnchor="end" fontSize={11} fontWeight={800} fill={ghost.ok ? '#065F46' : '#9F1239'} fontFamily="ui-monospace, monospace"
                    stroke="#FFFFFF" strokeWidth={3} paintOrder="stroke">{ghost.h}</text>
                </g>
              )}
            </svg>
            {/* la scène est la PISTE : toucher y pose la tête ; la poignée est à côté de la tête */}
            <div {...st.trackProps} className="absolute inset-0" style={{ ...st.trackProps.style, cursor: it.stretchOk ? 'default' : st.trackProps.style.cursor }}>
              <div {...st.handleProps({ label: k('handle', { name: w.name }), valueText: k('handleValue', { h: it.h }) })}
                aria-orientation="vertical" aria-disabled={it.stretchOk || undefined} data-sb-handle
                className={`absolute flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white/95 shadow outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${it.stretchOk ? 'border-emerald-500' : 'border-indigo-600'}`}
                style={{ left: handleX, top: yH, cursor: it.stretchOk ? 'default' : st.dragging ? 'grabbing' : 'grab' }}>
                <ChevronsUpDown className={`h-5 w-5 ${it.stretchOk ? 'text-emerald-600' : 'text-indigo-700'}`} aria-hidden="true" />
              </div>
            </div>
          </div>
          {/* les noms sous les enfants, la lecture et −/+ (à portée de la scène) */}
          <div className="relative h-5 text-[11px] font-bold text-slate-700" aria-hidden="true">
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: knownCx }}>{knownName} <bdi dir="ltr">{def.known.h} cm</bdi></span>
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: unkCx }}>{w.name}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-800" data-sb-reading={it.h}>{k('reading', { name: w.name })} <bdi dir="ltr" className="font-mono">{it.h} cm</bdi></span>
            <div className="flex items-center gap-1.5" dir="ltr">
              <button type="button" onClick={() => st.nudge(-1)} disabled={it.stretchOk || it.h <= L.GAUGE.min} aria-label={k('less')} data-sb-less
                className={`${btn} border-slate-300 bg-white`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => st.nudge(1)} disabled={it.stretchOk || it.h >= L.GAUGE.max} aria-label={k('more')} data-sb-more
                className={`${btn} border-slate-300 bg-white`}><Plus className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
        </div>

        {/* la bande fermée et la ligne écrite (après la bonne carte) */}
        {tape && (
          <div className="min-w-[220px] flex-1 space-y-1.5" data-sb-result>
            <p className="text-xs font-bold text-slate-600">{k('tapeTitle')}</p>
            <ArcTape {...tape.fig} maxWidth={narrow ? 300 : 340} />
            <p className="text-center font-mono text-base font-extrabold text-indigo-950"><bdi dir="ltr" data-sb-formal-line>{L.formalLine(story, i)}</bdi></p>
            {firstOpen < def.items.length ? (
              <button type="button" onClick={() => setLab(L.next)} data-sb-next className={`${btn} gap-1 border-indigo-600 bg-indigo-600 text-white`}>
                {k('next')} <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <p className="text-sm font-bold text-emerald-800" data-sb-all-done>{k('allDone')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Un enfant dessiné devant la toise : le HAUT de sa tête est exactement à sa taille (même échelle que la
 * toise) ; le corps continue sous le cadre. L'inconnu porte « ؟ » tant que sa phrase n'est pas vraie.
 */
function Child({ cx, top, r, H, shirt, person, height, unknown = false, mark }) {
  const cy = top + r;
  const neckY = top + 2 * r - 1;
  const bodyY = neckY + r * 0.35;
  const bw = 2.7 * r;
  return (
    <g data-sb-person={person} data-height={height}>
      <rect x={cx - bw / 2} y={bodyY} width={bw} height={Math.max(0, H - bodyY + 20)} rx={r * 0.6} fill={shirt} opacity={unknown ? 0.75 : 1} />
      <rect x={cx - r * 0.3} y={neckY - 2} width={r * 0.6} height={r * 0.45} fill="#F1C27D" />
      <circle cx={cx} cy={cy} r={r} fill="#F8D3A8" stroke="#92400E" strokeWidth={1} />
      <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Q${cx} ${cy - r * 0.45} ${cx - r} ${cy}`} fill="#3F2A1D" />
      <circle cx={cx - r * 0.35} cy={cy + r * 0.12} r={Math.max(1.2, r * 0.09)} fill="#1F2937" />
      <circle cx={cx + r * 0.35} cy={cy + r * 0.12} r={Math.max(1.2, r * 0.09)} fill="#1F2937" />
      <path d={`M${cx - r * 0.3} ${cy + r * 0.45} Q${cx} ${cy + r * 0.65} ${cx + r * 0.3} ${cy + r * 0.45}`} fill="none" stroke="#7C2D12" strokeWidth={1.2} strokeLinecap="round" />
      {unknown && mark && (
        <text x={cx} y={bodyY + r * 1.3} textAnchor="middle" fontSize={Math.max(14, r)} fontWeight={900} fill="#FFFFFF" style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{mark}</text>
      )}
    </g>
  );
}

/* ══════════════ متقدم : نشاط 1 — six cartes, six textes ══════════════ */

/** La bande d'un texte de نشاط 1 pour la carte c (posée ou essayée) : sa valeur à la place de l'inconnue. */
export function cardTape(story, tIdx, c, k, words) {
  const tp = L.tapeOf(story, tIdx, L.calcValue(L.cardsOf(story)[c]));
  const label = (p) => `${words[p.role]} ${p.unknown && tp.closed ? k('unknownBox') : p.value}`;
  return {
    kind: 'tape',
    parts: tp.parts.map((p) => ({ label: label(p), value: p.value, unknown: p.unknown })),
    whole: { label: label(tp.whole), value: tp.whole.value, unknown: tp.whole.unknown },
    ariaLabel: k(tp.closed ? 'tapeAria' : 'tapeAriaOpen', { whole: label(tp.whole), p0: label(tp.parts[0]), p1: label(tp.parts[1]) }),
  };
}

function CardsLab({ lab, setLab, story, def, k, textWords, narrow, compact, glanceRef, verdictLine }) {
  const cards = L.cardsOf(story);
  // ÉTROIT (< 520 px, téléphone) : un texte à la fois — le sélecteur ①–⑥ (tablist) ; chaque onglet est AUSSI la zone
  // d'accueil de son texte, et le panneau du texte choisi en est une seconde (même zone) pour le glisser.
  const [sel, setSel] = useState(0);
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      if (!src.startsWith('card:') || !zone.startsWith('text:')) return '';
      return L.canPlace(lab, Number(src.slice(5)), Number(zone.slice(5)));
    },
    onDrop: (src, zone) => { setSel(Number(zone.slice(5))); setLab((s) => L.placeCard(s, Number(src.slice(5)), Number(zone.slice(5)))); },
    onReject: (src, zone, reason) => {
      if (reason && src.startsWith('card:') && zone.startsWith('text:')) {
        setSel(Number(zone.slice(5)));
        setLab((s) => L.placeCard(s, Number(src.slice(5)), Number(zone.slice(5))));
      }
    },
  });
  const tabsRef = useRef(null);
  const onTabKey = (e, tIdx) => {
    const n = def.items.length;
    // RTL : ← va vers l'onglet suivant (dessiné à gauche)
    const to = { ArrowLeft: tIdx + 1, ArrowRight: tIdx - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) { drag.zoneProps(`text:${tIdx}`).onKeyDown(e); return; }
    e.preventDefault();
    const j = (to + n) % n;
    setSel(j);
    tabsRef.current?.querySelector(`[data-sb-slot="${def.items[j].n}"]`)?.focus();
  };
  const heldCard = String(drag.held ?? '').startsWith('card:') ? Number(String(drag.held).slice(5)) : null;
  const slotOf = (c) => lab.slots.findIndex((sl) => sl.matched === c);

  const tapeFor = (tIdx, c) => cardTape(story, tIdx, c, k, textWords(tIdx));

  return (
    <div ref={glanceRef} className="space-y-2" data-sb-glance>
      {/* les six cartes (au-dessus des textes) */}
      <div className="space-y-1" data-sb-cards>
        <p className="text-xs font-bold text-slate-600">{k('cardsTitle')}</p>
        <div className={compact ? 'grid grid-cols-3 gap-1' : 'flex flex-wrap gap-1.5'} dir="ltr">
          {cards.map((c, ci) => {
            const placed = L.isPlaced(lab, ci);
            const sp = drag.sourceProps(`card:${ci}`, { disabled: placed });
            const calc = L.calcText(c);
            return (
              <button key={ci} type="button" {...sp} disabled={placed}
                aria-label={placed ? k('cardPlacedAria', { calc, n: def.items[slotOf(ci)].n }) : k('cardAria', { calc })}
                data-sb-card={ci} data-placed={placed ? 'true' : 'false'}
                className={`sa-manip-object ${btn} ${compact ? 'w-full px-1 text-xs' : ''} select-none whitespace-nowrap font-mono transition-transform duration-150 motion-reduce:transition-none ${placed ? 'border-emerald-300 bg-emerald-50 text-emerald-700 opacity-50' : 'border-indigo-400 bg-white text-indigo-950 shadow-sm'} ${drag.held === `card:${ci}` ? 'scale-105 ring-2 ring-indigo-500' : ''} ${drag.rejected === `card:${ci}` ? 'sa-manip-reject ring-2 ring-rose-400' : ''}`}
                style={sp.style}>
                {calc}
              </button>
            );
          })}
        </div>
      </div>

      {verdictLine}

      {compact ? (
        <div className="space-y-1.5" data-sb-texts data-sb-compact>
          <div ref={tabsRef} role="tablist" aria-label={k('textsTitle')} className="grid grid-cols-6 gap-1">
            {def.items.map((it, tIdx) => {
              const sl = lab.slots[tIdx];
              const zp = drag.zoneProps(`text:${tIdx}`, { disabled: sl.matched != null });
              const active = zp['data-drop-active'] === 'true';
              const invalid = zp['data-drop-invalid'] === 'true';
              const readyZone = zp['data-drop-ready'] === 'true';
              const matched = sl.matched != null;
              return (
                <button key={it.id} type="button" role="tab" {...zp} id={`sb-tab-${tIdx}`}
                  aria-selected={sel === tIdx} tabIndex={sel === tIdx ? 0 : -1}
                  aria-label={matched ? k('slotDoneAria', { n: it.n, calc: L.calcText(cards[sl.matched]) }) : k('slotAria', { n: it.n, text: textWords(tIdx).text })}
                  onClick={(e) => { zp.onClick(e); setSel(tIdx); }} onKeyDown={(e) => onTabKey(e, tIdx)}
                  data-sb-slot={it.n} data-matched={matched ? 'true' : 'false'} data-tried={sl.tried != null ? String(sl.tried) : undefined}
                  className={`relative inline-flex min-h-[44px] items-center justify-center gap-0.5 rounded-xl border-2 text-sm font-extrabold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-300' : invalid ? 'border-rose-400 bg-rose-50' : sel === tIdx ? 'border-indigo-600 bg-indigo-600 text-white' : matched ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : readyZone ? 'border-indigo-400 bg-indigo-50 text-indigo-900' : sl.tried != null ? 'border-rose-300 bg-white text-rose-800' : 'border-slate-300 bg-white text-slate-700'}`}>
                  {it.n}{matched && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          {(() => {
            const tIdx = sel;
            const it = def.items[tIdx];
            const sl = lab.slots[tIdx];
            const shown = sl.matched ?? sl.tried;
            return (
              <DropZone drag={drag} id={`text:${tIdx}`} tone={sl.matched != null ? 'emerald' : 'indigo'} minHeight="min-h-[64px]"
                disabled={sl.matched != null} label={k('slotAria', { n: it.n, text: textWords(tIdx).text })}
                className={`p-2 ${sl.matched != null ? 'border-emerald-400 bg-emerald-50/60' : ''}`}
                role="tabpanel" aria-labelledby={`sb-tab-${tIdx}`} data-sb-panel={it.n} data-panel-matched={sl.matched != null ? 'true' : 'false'}>
                <p className="text-sm leading-snug text-slate-800">
                  <span className="me-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-extrabold text-white">{it.n}</span>
                  {textWords(tIdx).text}
                </p>
                {shown != null && (
                  <div className="mt-1 space-y-0.5">
                    <p className={`text-xs font-bold ${sl.matched != null ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {sl.matched == null && <span>{k('slotTried')} </span>}
                      <bdi dir="ltr" className="font-mono">{`${L.calcText(cards[shown])} = ${L.dec(L.calcValue(cards[shown]))}`}</bdi>
                    </p>
                    <ArcTape {...tapeFor(tIdx, shown)} maxWidth={300} />
                  </div>
                )}
              </DropZone>
            );
          })()}
        </div>
      ) : (
      /* les six textes du manuel : chacun est une zone d'accueil */
      <div className="grid grid-cols-2 gap-1.5" data-sb-texts>
        {def.items.map((it, tIdx) => {
          const sl = lab.slots[tIdx];
          const words = textWords(tIdx);
          const shown = sl.matched ?? sl.tried;
          const fig = shown != null ? tapeFor(tIdx, shown) : null;
          return (
            <DropZone key={it.id} drag={drag} id={`text:${tIdx}`} tone={sl.matched != null ? 'emerald' : 'indigo'} minHeight="min-h-[64px]"
              disabled={sl.matched != null}
              label={sl.matched != null ? k('slotDoneAria', { n: it.n, calc: L.calcText(cards[sl.matched]) }) : k('slotAria', { n: it.n, text: words.text })}
              className={`p-1.5 ${sl.matched != null ? 'border-emerald-400 bg-emerald-50/60' : ''}`}
              data-sb-slot={it.n} data-matched={sl.matched != null ? 'true' : 'false'} data-tried={sl.tried != null ? String(sl.tried) : undefined}>
              <p className={`${narrow ? 'text-[11px]' : 'text-xs sm:text-sm'} leading-snug text-slate-800`}>
                <span className="me-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-extrabold text-white">{it.n}</span>
                {words.text}
              </p>
              {shown != null && (
                <div className="mt-1 space-y-0.5">
                  <p className={`text-[11px] font-bold ${sl.matched != null ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {sl.matched == null && <span>{k('slotTried')} </span>}
                    <bdi dir="ltr" className="font-mono">{`${L.calcText(cards[shown])} = ${L.dec(L.calcValue(cards[shown]))}`}</bdi>
                  </p>
                  <ArcTape {...fig} maxWidth={narrow ? 170 : 260} />
                </div>
              )}
            </DropZone>
          );
        })}
      </div>
      )}

      <DragGhost ghost={drag.ghost}>
        {heldCard != null && (
          <span className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-indigo-500 bg-white px-3 font-mono text-sm font-bold text-indigo-950" dir="ltr">{L.calcText(cards[heldCard])}</span>
        )}
      </DragGhost>
    </div>
  );
}
