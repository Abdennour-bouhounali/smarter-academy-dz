import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import { Minus, Plus, CheckCircle2, ArrowLeft, ArrowRight, X as XIcon } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import useDragInteraction from '../useDragInteraction';
import DraggableObject from '../primitives/DraggableObject';
import DropZone from '../primitives/DropZone';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { bidi } from '../../../../utils/bidi';
import * as L from '../logic/growthRace';

/**
 * growth-race — LA COURSE DE DEUX GRANDEURS (unité 4 « معادلات ومتراجحات من الدرجة الأولى
 * بمجهول واحد », leçon « ترييض مشكلة » ; RÉUTILISÉE par la synthèse « أدمج تعلّماتي »).
 *
 * ── CONTRAT DES PROPS (contraignant : la synthèse code contre lui) ─────────────────────
 *   <Manipulation type="growth-race"
 *     left="36+x" right="4+x+6+x+8+x"   les deux grandeurs COMME LE MODÈLE LES ÉCRIT ; sommes de
 *                                      termes du premier degré : « c+x » (une personne qui
 *                                      vieillit), « kx » (un tarif par séance), « c » (un
 *                                      montant fixe), « k(…) » (un multiple d'un groupe :
 *                                      « ضعف عمر الابن » = « 2(6+x) »). Pas de « − ».
 *     theme="ages" | "pool"            le monde dessiné. L'opération du jeton vient des
 *                                      expressions (« c+x » → « + x », « kx » → « × x ») ;
 *                                      un thème qui la contredit est remplacé par le bon.
 *     domain="natural"                 x entier ≥ 0 (années, séances) — seul domaine implémenté
 *     goal="equal" | "less" | "greater"  la question : left = right ? left < right ? left > right ?
 *     maxX={20}                        bout de la règle (optionnel ; défaut tiré de la solution,
 *                                      jamais assez court pour cacher la rencontre)
 *     context={{ leftTitle, rightTitle, names: { L0: 'الأب', R1: '…' }, question }}  (optionnel :
 *                                      les mots de l'énoncé de la leçon à la place des mots du thème)
 *     startWith="build" | "race"       (optionnel) « race » épingle la course, le modèle de
 *                                      l'histoire déjà posé — pour une leçon qui a DÉJÀ modélisé
 *     title, lead, mission, level, levels={false}, onFinished, onTrial, onModel />
 *   onTrial({ x, left, right, rel, leftText, rightText })  — chaque x VALIDÉ de la course
 *   onModel({ tex })                                        — le modèle vérifié (« تحقّق » juste)
 *   onFinished({ kind, x })                                 — la règle formelle atteinte
 *   Toutes passent par `state.report` : elles ne partent que du niveau de la leçon.
 *   La synthèse : left="75x" right="560+5x" theme="pool" goal="greater" (formule 2 moins chère à
 *   partir de 9 séances ; à 8 elles sont égales : 600 دج).
 *
 * ── LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1) ─────────────────────────────────────
 * A. L'élève PORTE une carte « + x » (« × x ») sur chaque personne (chaque tarif) qui change
 *    avec x, puis — quand le modèle est vérifié et qu'IL ouvre la course — ÉTIRE x sur une règle.
 * B. Idée : traduire un texte en équation (ترييض) — chaque élément qui change porte x ;
 *    l'équation est le moment où les deux grandeurs sont égales, l'inéquation celui où l'une
 *    dépasse l'autre ; la solution n'est une réponse que si elle convient à l'histoire.
 * C. Construire : l'expression de chaque membre s'écrit SOUS lui à chaque carte posée
 *    (36 + x ; (4 + x) + (6 + x) + (8 + x)). Courir : les enfants grandissent, les colonnes
 *    montent, la lecture « 13 + 15 + 17 = 45 » suit x, le signe <, =, > entre les colonnes.
 * D. L'équation 36 + x = (4 + x) + (6 + x) + (8 + x), réduite 36 + x = 3x + 18, résolue
 *    2x = 18, x = 9, et l'التحقق 45 = 13 + 15 + 17 — puis l'inéquation au-delà.
 * E. À découvrir avant la règle : les grandeurs ne s'égalent qu'en UNE valeur de x, l'ordre
 *    s'inverse autour d'elle — et une solution non entière ou négative ne répond pas à
 *    l'histoire (P2 « التأكد من ملاءمتها للواقع »).
 *
 * ── FICHE (MANIPULATION_DNA §7) ───────────────────────────────────────────────────────
 *   CONCEPT        ترييض مشكلة : nommer l'inconnue, traduire, résoudre, vérifier, interpréter
 *   OBJECT         les personnes de l'histoire (le père, les enfants) / les tarifs (ticket, carte)
 *   VARIABLE       quels éléments portent x (construire) ; x lui-même (courir, étiré)
 *   INVARIANT      l'écart d'âge entre deux personnes ; le prix d'UNE séance ; l'abonnement
 *   TRANSFORMATION les deux membres changent avec x, chacun à sa vitesse (ses cartes)
 *   CONSTRAINT     x entier ≥ 0 ; une carte par élément ; la course n'existe qu'avec un modèle juste
 *   RESISTANCE     « تحقّق » refuse un modèle qui contredit l'histoire, élément allumé et raison
 *                  dans les mots de l'histoire (« الابن الثاني لم يكبر… », « الاشتراك يُدفع مرّة
 *                  واحدة ») ; sur la règle, une solution non entière n'a AUCUNE graduation où les
 *                  colonnes s'égalent, une solution négative n'est jamais atteinte
 *   EVIDENCE       les colonnes égales et « 45 = 13 + 15 + 17 » ; le signe qui s'inverse
 *   CONTRAST       un essai avant la rencontre, la rencontre, un essai après (logic.discoveryReady)
 *   PREDICTION     « qui sera devant dans 20 ans ? » — le nombre de cartes de chaque côté le dit
 *                  avant la course (3 cartes contre 1)
 *   DISCOVERY      une seule valeur de x égalise les deux membres ; avant/après, l'un mène
 *   FORMALIZATION  les étapes أ) نسمي x ب) نعبّر … بالمعادلة جـ) نحل … التحقق (طرائق p. 49)
 *   TRANSFER       دوري الآن p. 49 (4x ≥ 3(28 − x)), exercices 10–13, 30, 33, 37–40 ; la piscine
 *                  de la synthèse
 *
 * AUTO-COMPLÉTION : MANUELLE (§6bis) — chaque carte posée est une décision de modélisation,
 * chaque x validé une expérience ; « compléter » serait donner la réponse.
 *
 * DEUX LABORATOIRES, une seule manipulation (§7quater) : le passage CONSTRUIRE → COURIR est le
 * geste de l'élève (une carte qui dit ce qui a été trouvé, un bouton, un chemin de retour), jamais
 * un seuil caché. Le retour garde les cartes et les essais.
 *
 * DÉCOR (exigence du propriétaire) : âges — un gâteau d'anniversaire dont la bougie vacille quand
 * on le touche ; piscine — l'eau ride sous le doigt. Confiné au dessin, `aria-hidden`,
 * `tabIndex={-1}`, sans effet sur l'état du laboratoire, immobile sous `prefers-reduced-motion`.
 *
 * CONTRAT DOM (e2e) :
 *   [data-growth-race][data-stage=build|race][data-op=add|mul]
 *   [data-gr-token]  [data-gr-element=<id>][data-carried][data-issue]  [data-gr-check]
 *   [data-gr-verdict=ok|ko]  [data-gr-open-race]  [data-gr-back]
 *   [data-gr-ruler] [data-gr-x]  [data-gr-columns][data-rel]  [data-gr-trials] [data-trial-x][data-rel]
 *   [data-gr-formal]  [data-decor]
 */

const PALETTE = ['#2563EB', '#E11D48', '#059669', '#D97706', '#7C3AED', '#0891B2'];
const REL_TEX = { '<': '<', '=': '=', '>': '>' };

export default function GrowthRace({
  left: left0 = '36+x', right: right0 = '4+x+6+x+8+x', theme = 'ages', domain = 'natural', goal = 'equal', maxX,
  context, startWith = 'build', title, lead, mission, level, levels: withLevels = true, initialMode = 'student', allowModeSwitch = false,
  onFinished, onTrial, onModel,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.growthRace.${key}`, o), [t]);
  const state = useManipulation({ type: 'growth-race', initialNumbers: { left: left0, right: right0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { left, right } = state.numbers;

  const [lab, setLab] = useState(() => L.init(left, right, { startWith }));
  const sceneKey = `${left}|${right}|${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [x, setX] = useState(null); // null : pas encore d'essai — la course montre alors le x par défaut
  const labRef = useRef(lab);
  labRef.current = lab;
  const [live, setLive] = useState(null);
  const [notice, setNotice] = useState(null);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init(left, right, { startWith })); setX(null); setLive(null); setNotice(null); }

  const { model } = lab;
  // L'opération vient des expressions ; le thème qui la contredit cède (voir l'en-tête).
  const themeId = model.op === 'mul' ? 'pool' : 'ages';
  void theme; // déclaratif : 'ages' pour des âges, 'pool' pour des tarifs — l'opération décide
  const tw = useCallback((key, o) => t(`manipulation.growthRace.themes.${themeId}.${key}`, o), [t, themeId]);
  const range = useMemo(() => L.xRange(model, maxX), [model, maxX]);
  const ans = useMemo(() => L.answer(model, goal), [model, goal]);
  const kind = L.discoveryKind(model, range);
  const sol = L.solution(model);
  const racing = lab.stage === 'race';
  void domain; // seul le domaine « natural » existe : la règle ne porte que des entiers ≥ 0

  /* ── les mots de l'histoire ── */
  const names = useMemo(() => {
    const out = {};
    const sideEls = (side) => model.elements.filter((e) => e.side === side);
    for (const side of ['left', 'right']) {
      const els = sideEls(side);
      els.forEach((el, i) => {
        let name;
        if (model.op === 'mul') name = el.kind === 'rate' ? tw('ticket') : tw('card');
        else if (el.kind === 'fixed') name = tw('fixed', { v: L.valueText(el.c) });
        else if (side === 'left') name = els.length === 1 ? tw('father') : tw('childN', { n: i + 1 });
        else name = els.length === 1 ? tw('son') : (i < 4 ? tw(`child${i + 1}`) : tw('childN', { n: i + 1 }));
        out[el.id] = context?.names?.[el.id] ?? name;
      });
    }
    return out;
  }, [model, tw, context]);

  const sideTitle = useCallback((side) => {
    const own = side === 'left' ? context?.leftTitle : context?.rightTitle;
    if (own) return own;
    if (model.op === 'mul') return tw(side === 'left' ? 'leftTitle' : 'rightTitle');
    const groups = model.sides[side].groups;
    const count = groups.reduce((n, g) => n + g.elements.length, 0);
    let what;
    if (side === 'left') what = count === 1 ? tw('leftTitle') : tw('rightMany');
    else what = count === 1 ? tw('rightOne') : tw('rightMany');
    if (groups.length === 1 && L.toNumber(groups[0].k) !== 1) {
      const kk = L.toNumber(groups[0].k);
      return kk === 2 ? tw('factorTwo', { what }) : kk === 3 ? tw('factorThree', { what }) : tw('factorK', { k: L.valueText(groups[0].k), what });
    }
    return what;
  }, [context, model, tw]);
  const titleL = sideTitle('left');
  const titleR = sideTitle('right');
  const question = context?.question ?? tw(goal === 'less' ? 'questionLess' : goal === 'greater' ? 'questionGreater' : 'questionEqual', { left: titleL, right: titleR });
  const valueLabel = (p) => (L.toNumber(p) === Math.round(L.toNumber(p)) ? tw('value', { count: L.toNumber(p) }) : L.valueText(p));
  const unitsLabel = (n) => tw('units', { count: n });

  /* ── découverte et règle formelle ── */
  const ready = racing && L.discoveryReady(lab, range);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (state.isFormal) state.report(onFinished, { kind, x: sol.x ? L.valueText(sol.x) : null });
  }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure ── */
  const boxRef = useRef(null);
  const [width, setWidth] = useState(320);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(260, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── CONSTRUIRE : porter la carte ── */
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      if (src !== 'tok' || !zone.startsWith('el:')) return '';
      const v = L.canCarry(lab, zone.slice(3));
      return v === true ? true : v;
    },
    onDrop: (_src, zone) => { setLab((s) => L.carry(s, zone.slice(3))); setNotice(null); },
    onReject: (_s, zone, reason) => setNotice(reason ? { key: reason, id: zone?.slice?.(3) } : null),
  });
  const verify = () => {
    const next = L.check(lab);
    setLab(next);
    if (next.verdict.ok) state.report(onModel, { tex: L.modelTex(model, next.carried) });
  };

  /* ── COURIR : étirer x ── */
  const EDGE = 22;
  const steps = Math.max(1, range.max - range.min);
  const mu = (width - 2 * EDGE) / steps;
  const xOf = (v) => EDGE + (v - range.min) * mu;
  const toValue = useCallback((clientX, _y, rect) => range.min + (clientX - rect.left - EDGE) / mu, [range.min, mu]);
  const trialPayload = (v) => { const trial = L.trialAt(model, v); return { ...trial, leftText: L.valueText(trial.left), rightText: L.valueText(trial.right) }; };
  const commit = (v) => {
    setLive(null); setX(v);
    labRef.current = L.commitTrial(labRef.current, v);
    setLab((s) => L.commitTrial(s, v));
    const payload = trialPayload(v);
    state.report(onTrial, payload);
    setNotice({ trial: payload });
  };
  // Un x PAR DÉFAUT (L.defaultX : ni rencontre ni réponse), jamais un essai : `lab.trials` ne le contient pas.
  const dx = L.defaultX(model, range, goal);
  const stretch = useStretchInteraction({ value: live ?? x ?? dx, range, toValue, onChange: setLive, onCommit: commit, direction: 'ltr' });
  const xx = Math.min(range.max, Math.max(range.min, live ?? x ?? dx));
  // Au repos, sans essai : la conséquence du x par défaut (la ligne ne prétend pas que l'élève l'a posé).
  const shownTrial = notice?.trial ?? (x == null && live == null ? trialPayload(dx) : null);
  const untried = () => Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).filter((v) => !labRef.current.trials.some((tr) => tr.x === v));
  const now = L.trialAt(model, xx);
  const labelStep = mu >= 18 ? 1 : mu >= 9 ? 2 : 5;

  /* ── textes ── */
  const reasonText = (key, id) => {
    if (key === 'already') return k('already', { name: names[id] ?? '' });
    if (key === 'notGrown' || key === 'fixedGrown' || key === 'rateOnce' || key === 'fixedTimes') return tw(key, { name: names[id] ?? '' });
    return null;
  };
  const issueOf = (id) => lab.verdict && !lab.verdict.ok ? lab.verdict.issues.find((i) => i.id === id) : null;
  const token = tw('token');
  const colorOf = (id) => PALETTE[model.elements.findIndex((e) => e.id === id) % PALETTE.length];

  const hints = racing ? [tw('raceHint1'), tw('raceHint2'), tw('raceHint3')] : [tw('hint1'), tw('hint2'), tw('hint3')];
  const shownMission = racing ? tw('missionRace', { question }) : (mission ?? tw('missionBuild'));

  /* ── la découverte : la conjecture se choisit, la règle suit ── */
  const trialAtX = (v) => lab.trials.find((tr) => tr.x === v) ?? L.trialAt(model, v);
  const lead2 = L.leaders(model);
  const whoOf = (rel) => (rel === '>' ? titleL : titleR);
  const fmt = (tr) => ({ x: tr.x, left: L.valueText(tr.left), right: L.valueText(tr.right), rel: REL_TEX[tr.rel] });
  const relWord = goal === 'less' ? tw('lessWord') : tw('greaterWord');
  let options = null;
  const s = sol.x != null ? L.toNumber(sol.x) : null;
  if (kind === 'meet') {
    const notEqual = lab.trials.find((tr) => tr.rel !== '=') ?? trialAtX(s === range.max ? range.min : range.max);
    const after = lab.trials.find((tr) => tr.x > s) ?? trialAtX(Math.min(range.max, s + 1));
    const before = lab.trials.find((tr) => tr.x < s) ?? trialAtX(Math.max(0, s - 1));
    if (goal !== 'equal' && ans.toInfinity && ans.first != null) {
      options = [
        { text: <MathText>{k('goalAtEqual', { x: s })}</MathText>, why: <MathText>{k('goalAtEqualWhy', { ...fmt(trialAtX(s)), relWord })}</MathText> },
        { text: <MathText>{k('goalRight', { x: s, first: ans.first, left: titleL, right: titleR, relWord })}</MathText>, correct: true },
        { text: <MathText>{k('goalBefore', { x: s })}</MathText>, why: <MathText>{k('goalBeforeWhy', { ...fmt(before), y: before.x })}</MathText> },
      ];
    } else {
      options = [
        { text: <MathText>{k('allEqual')}</MathText>, why: <MathText>{k('allEqualWhy', fmt(notEqual))}</MathText> },
        { text: <MathText>{k('meetRight', { x: s, before: whoOf(lead2.before), after: whoOf(lead2.after) })}</MathText>, correct: true },
        { text: <MathText>{k('alwaysAhead', { who: whoOf(lead2.before) })}</MathText>, why: <MathText>{k('alwaysAheadWhy', fmt(after))}</MathText> },
      ];
    }
  } else if (kind === 'between') {
    const lo = Math.floor(s);
    options = [
      { text: <MathText>{k('equalAt', { x: lo })}</MathText>, why: <MathText>{k('equalAtWhy', fmt(trialAtX(lo)))}</MathText> },
      { text: <MathText>{k('betweenRight', { lo, hi: lo + 1 })}</MathText>, correct: true },
      { text: <MathText>{k('equalAt', { x: lo + 1 })}</MathText>, why: <MathText>{k('equalAtWhy', fmt(trialAtX(lo + 1)))}</MathText> },
    ];
  } else if (kind === 'negative' || kind === 'none') {
    const xs = lab.trials.map((tr) => tr.x).sort((p, q) => p - q);
    const a = trialAtX(xs[0] ?? 0); const b = trialAtX(xs.at(-1) ?? range.max);
    const gap = (tr) => { const d = L.add(tr.left, L.mul(tr.right, -1)); return L.valueText(d.n < 0 ? L.mul(d, -1) : d); };
    options = [
      { text: <MathText>{k('waitLonger')}</MathText>, why: <MathText>{k('waitLongerWhy', { a: a.x, b: b.x, da: gap(a), db: gap(b) })}</MathText> },
      { text: <MathText>{k('neverRight', { who: whoOf(lead2.before), gap: kind === 'none' ? k('gapSame') : k('gapGrows') })}</MathText>, correct: true },
    ];
  } else if (kind === 'all') {
    options = [{ text: <MathText>{k('allEqual')}</MathText>, correct: true }];
  }

  const solving = L.solvingLines(model);
  const goalIneq = goal !== 'equal' && ans.toInfinity && ans.first != null && kind === 'meet';
  const ineqLines = goalIneq ? L.inequalityLines(model, ans.rel) : null;
  const relTexOf = (rel) => ({ '<': '<', '<=': '\\leq', '>': '>', '>=': '\\geq' })[rel];
  const formal = (
    <div className="space-y-2" data-gr-formal data-kind={kind}>
      {goalIneq ? (
        <>
          <EquationDisplay tone="result" tex={`${L.sideTex(model, 'left', L.storyCarried(model))} ${relTexOf(ans.rel)} ${L.sideTex(model, 'right', L.storyCarried(model))}`} note={k('formalModelIneq')} />
          <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2">
            <p className="text-xs font-bold text-slate-600">{k('formalSolve')}</p>
            {ineqLines.lines.map((ln) => <p key={ln} dir="ltr" className="font-mono"><MathText>{`$${ln}$`}</MathText></p>)}
          </div>
          <EquationDisplay tone="neutral" tex={`${L.readoutTex(model, 'left', s).tex} \\quad ; \\quad ${L.readoutTex(model, 'right', s).tex}`} note={k('formalCheck')} />
          <p className="text-sm font-bold text-emerald-900"><MathText>{tw('firstFormal', { units: unitsLabel(ans.first), left: titleL, right: titleR, relWord })}</MathText></p>
        </>
      ) : (
        <>
          <EquationDisplay tone="result" tex={L.modelTex(model, L.storyCarried(model))} note={k('formalModel')} />
          <div className="space-y-1 rounded-xl border-2 border-slate-200 bg-white px-3 py-2">
            <p className="text-xs font-bold text-slate-600">{k('formalSolve')}</p>
            {solving.lines.map((ln) => <p key={ln} dir="ltr" className="font-mono"><MathText>{`$${ln}$`}</MathText></p>)}
          </div>
          {kind === 'meet' && (
            <>
              <EquationDisplay tone="neutral" tex={`${L.readoutTex(model, 'left', s).tex} \\quad ; \\quad ${L.readoutTex(model, 'right', s).tex}`} note={k('formalCheck')} />
              <p className="text-sm font-bold text-emerald-900"><MathText>{tw('meetFormal', { units: unitsLabel(s), left: titleL, right: titleR })}</MathText></p>
              <p className="text-sm text-slate-700"><MathText>{k('formalBeyond', { x: s, left: L.reducedTex(model, 'left'), right: L.reducedTex(model, 'right'), rel: REL_TEX[lead2.after] })}</MathText></p>
            </>
          )}
          {kind === 'between' && <p className="text-sm font-bold text-rose-900"><MathText>{k('formalBetween', { x: L.valueText(sol.x), unitWord: tw('unitWord') })}</MathText></p>}
          {kind === 'negative' && <p className="text-sm font-bold text-rose-900"><MathText>{tw('pastFormal', { units: unitsLabel(Math.abs(s)) })}</MathText></p>}
          {kind === 'none' && <p className="text-sm font-bold text-rose-900">{k('formalNone')}</p>}
          {kind === 'all' && <p className="text-sm font-bold text-emerald-900">{k('formalAll')}</p>}
        </>
      )}
    </div>
  );

  /* ── la course : les colonnes ── */
  const tops = [L.trialAt(model, range.min), L.trialAt(model, range.max)].flatMap((tr) => [L.toNumber(tr.left), L.toNumber(tr.right)]);
  const vmax = Math.max(1, ...tops);
  const CW = Math.min(width, 420); const CH = 230; const BASE = CH - 26; const TOP = 22;
  const hOf = (v) => (L.toNumber(v) / vmax) * (BASE - TOP);
  const stack = (side) => {
    const parts = L.partsAt(model, side, xx);
    const segs = [];
    let y = BASE;
    model.sides[side].groups.forEach((g, gi) => {
      const copies = Math.max(1, Math.round(L.toNumber(g.k)));
      for (let c = 0; c < copies; c += 1) {
        parts.filter((p) => model.elements.find((e) => e.id === p.id).group === gi).forEach((p) => {
          const h = hOf(p.value);
          segs.push({ key: `${p.id}-${c}`, id: p.id, y: y - h, h });
          y -= h;
        });
      }
    });
    return segs;
  };
  const colX = { left: CW * 0.28, right: CW * 0.72 };
  const colW = Math.min(70, CW * 0.2);

  /* ── le monde dessiné ── */
  const renderElement = (el) => {
    const carried = lab.carried.includes(el.id);
    const issue = issueOf(el.id);
    const nowValue = L.partsAt(model, el.side, xx).find((p) => p.id === el.id).value;
    const term = L.elementTex(model, el, carried);
    const figure = model.op === 'mul'
      ? (el.kind === 'fixed' ? <CardFigure color={colorOf(el.id)} /> : <TicketFigure color={colorOf(el.id)} />)
      : <PersonFigure age={racing ? L.toNumber(nowValue) : L.toNumber(el.c)} color={colorOf(el.id)} adult={el.side === 'left' && L.toNumber(el.c) >= 18} />;
    const body = (
      <div className="flex flex-col items-center gap-1 px-1 py-1">
        <div style={{ width: 'clamp(46px, 18cqi, 96px)' }} aria-hidden="true">{figure}</div>
        <span className="font-bold text-slate-800 text-sm">{names[el.id]}</span>
        {model.op === 'mul' && <span className="text-[11px] text-slate-600">{tw('price', { v: L.valueText(el.c) })} · {el.kind === 'fixed' ? tw('once') : tw('perSession')}</span>}
        {racing ? (
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-extrabold text-slate-800 shadow-sm" data-gr-now={el.id}>
            {valueLabel(nowValue)}
          </span>
        ) : (
          <span dir="ltr" className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2 font-bold ${carried ? 'bg-amber-100 text-amber-900' : 'bg-white text-slate-700'}`}>
            <MathText>{`$${term}$`}</MathText>
            {carried && !drag.held && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setLab((st) => L.remove(st, el.id)); setNotice(null); }}
                aria-label={k('removeToken', { name: names[el.id] })} data-gr-remove={el.id}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-amber-800 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </span>
        )}
        {racing && model.op === 'mul' && el.kind === 'rate' && <TicketRow n={xx} color={colorOf(el.id)} />}
      </div>
    );
    if (racing) {
      return <div key={el.id} className="rounded-2xl border-2 border-transparent" data-gr-element={el.id} data-carried={String(carried)}>{body}</div>;
    }
    return (
      <DropZone key={el.id} drag={drag} id={`el:${el.id}`} tone="amber" minHeight="min-h-[120px]"
        label={k('zoneLabel', { name: names[el.id], term: term.replace(/\\/g, '') })}
        className={issue ? '!border-solid !border-amber-500 !bg-amber-50 ring-4 ring-amber-300' : ''}
        data-gr-element={el.id} data-carried={String(carried)} data-issue={issue ? issue.reason : undefined}>
        {body}
      </DropZone>
    );
  };

  const renderSide = (side) => {
    const groups = model.sides[side].groups;
    let i = 0;
    return (
      <div className="min-w-0 flex-1 space-y-2 rounded-2xl border-2 border-slate-200 bg-white/80 p-2" style={{ containerType: 'inline-size' }} data-gr-side={side}>
        <p className="text-center text-sm font-extrabold text-slate-800" dir="rtl">{side === 'left' ? titleL : titleR}</p>
        <div className="flex flex-wrap items-end justify-center gap-2">
          {groups.map((g, gi) => {
            const els = g.elements.map(() => { const el = model.elements.find((e) => e.side === side && e.index === i); i += 1; return el; });
            const kk = L.toNumber(g.k);
            return (
              <div key={gi} className={`flex flex-wrap items-end justify-center gap-2 ${kk !== 1 ? 'rounded-2xl border-2 border-dashed border-violet-300 p-1' : ''}`}>
                {kk !== 1 && <span dir="ltr" className="self-center rounded-full bg-violet-100 px-2 py-0.5 font-mono text-sm font-extrabold text-violet-800">{L.valueText(g.k)} ×</span>}
                {els.map(renderElement)}
              </div>
            );
          })}
        </div>
        {!racing && (
          <div className="rounded-xl bg-slate-50 px-2 py-1 text-center" data-gr-expression={side}>
            <p className="text-[11px] font-bold text-slate-500">{k('expression', { title: side === 'left' ? titleL : titleR })}</p>
            <p dir="ltr" className="font-mono text-base"><MathText>{`$${L.sideTex(model, side, lab.carried)}$`}</MathText></p>
          </div>
        )}
      </div>
    );
  };

  return (
    <ManipulationShell
      type="growth-race"
      title={bidi(title ?? k('title'))}
      mission={shownMission}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={hints.map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{
        autoStep: () => false,
        canAutoStep: () => false,
        // Seule la COURSE se balaie (chaque x est un essai) ; construire le modèle reste une suite de décisions.
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: racing,
          remaining: racing ? untried().length : 0,
          intervalMs: 480,
          maxTicks: 80,
          step: () => { const next = untried()[0]; if (next !== undefined) commit(next); },
          finish: () => { untried().forEach((v) => commit(v)); },
        },
      }}
      representation={racing && shownTrial ? (
        <EquationDisplay tone={shownTrial.rel === '=' ? 'ok' : 'neutral'}
          tex={`${L.readoutTex(model, 'left', shownTrial.x).tex} \\;\\; ${REL_TEX[shownTrial.rel]} \\;\\; ${L.readoutTex(model, 'right', shownTrial.x).tex}`}
          note={<MathText>{k('trialNotice', { x: shownTrial.x, left: shownTrial.leftText, right: shownTrial.rightText, rel: REL_TEX[shownTrial.rel] })}</MathText>} />
      ) : null}
      discovery={options && (
        <ManipulationDiscovery state={state} prompt={k('discoveryPrompt')} options={options} formal={formal} />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-sky-50/70 to-white" data-dragging={stretch.dragging || drag.dragging ? 'true' : undefined}>
        <div ref={boxRef} className="space-y-3" data-growth-race data-stage={lab.stage} data-op={model.op} data-theme={themeId}>
          {/* ── les deux étapes, toujours lisibles ── */}
          <ol className="flex flex-wrap gap-2 text-xs font-bold" aria-hidden="true">
            <li className={`rounded-full px-3 py-1 ${!racing ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{k('stageBuild')}</li>
            <li className={`rounded-full px-3 py-1 ${racing ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{k('stageRace')}</li>
          </ol>
          <p className="rounded-xl bg-white/80 px-3 py-2 text-sm font-bold text-slate-800" data-gr-question>{question}</p>

          {/* ── le monde : les deux membres, côte à côte dans le sens de l'équation ── */}
          <div className="relative pt-0">
            <Decor themeId={themeId} />
            <div dir="ltr" className="flex gap-2 flex-row" data-gr-scene>
              {renderSide('left')}
              <div className="flex items-center justify-center px-1 font-mono text-2xl font-black text-slate-500" aria-hidden="true">{racing ? REL_TEX[now.rel] : '?'}</div>
              {renderSide('right')}
            </div>
          </div>

          {!racing ? (
            <>
              {/* ── la réserve : UNE carte, réutilisable ── */}
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-2">
                <span className="text-sm font-bold text-amber-900">{k('reserveTitle')}</span>
                <DraggableObject drag={drag} id="tok" label={k('tokenLabel', { token })}
                  className="min-h-[48px] min-w-[64px] rounded-xl border-2 border-amber-400 bg-white px-3 font-mono text-lg font-extrabold text-amber-900 shadow-sm">
                  <span dir="ltr" data-gr-token>{token}</span>
                </DraggableObject>
                <span className="text-xs text-slate-600">{k('reserveHint')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={verify} data-gr-check
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-4 font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> {k('check')}
                </button>
              </div>
              {lab.verdict && (
                lab.verdict.ok ? (
                  <div className="space-y-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-3" data-gr-verdict="ok">
                    <p className="text-sm font-bold text-emerald-900">{k('modelOk')}</p>
                    <p dir="ltr" className="font-mono text-base"><MathText>{`$${L.modelTex(model, lab.carried)}$`}</MathText></p>
                    <p className="text-sm text-slate-700">{k('nextCard')}</p>
                    <button type="button" onClick={() => { setLab(L.openRace); setNotice(null); }} data-gr-open-race
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">
                      {k('openRace')} <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 rounded-2xl border-2 border-amber-300 bg-amber-50 p-3" data-gr-verdict="ko">
                    <p className="text-sm font-bold text-amber-900">{k('modelKo')}</p>
                    <p dir="ltr" className="font-mono text-sm"><MathText>{`$${L.modelTex(model, lab.carried)}$`}</MathText></p>
                    <ul className="list-disc space-y-1 ps-5 text-sm text-amber-950">
                      {lab.verdict.issues.map((is) => <li key={is.id} data-gr-issue={is.id}><MathText>{reasonText(is.reason, is.id)}</MathText></li>)}
                    </ul>
                  </div>
                )
              )}
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setLab(L.backToBuild); setNotice(null); }} data-gr-back
                className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border-2 border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <ArrowRight className="h-4 w-4" aria-hidden="true" /> {k('backToBuild')}
              </button>
              <p dir="ltr" className="text-center font-mono text-sm text-slate-600"><MathText>{`$${L.modelTex(model, lab.carried)}$`}</MathText></p>

              {/* ── la règle de x ── */}
              <p className="text-sm font-bold text-slate-700"><MathText>{k('ruler', { unit: tw('xUnit') })}</MathText></p>
              <div dir="ltr" {...stretch.trackProps} className="relative" style={{ ...stretch.trackProps.style, height: 60 }} data-gr-ruler>
                <svg width={width} height={60} className="absolute inset-0" aria-hidden="true" focusable="false">
                  <rect x={EDGE - 4} y={26} width={steps * mu + 8} height={5} rx={2} fill="#0369A1" />
                  {Array.from({ length: range.max - range.min + 1 }, (_, n) => range.min + n).map((v) => {
                    const tr = lab.trials.find((u) => u.x === v);
                    const show = tr || v % labelStep === 0 || v === range.max;
                    return (
                      <g key={v}>
                        <line x1={xOf(v)} x2={xOf(v)} y1={33} y2={tr ? 44 : 39} stroke={tr ? (tr.rel === '=' ? '#047857' : '#334155') : '#94A3B8'} strokeWidth={tr ? 2 : 1} />
                        {show && <text x={xOf(v)} y={55} textAnchor="middle" fontSize={11} fill={tr ? (tr.rel === '=' ? '#047857' : '#0F172A') : '#475569'} fontWeight={tr ? 'bold' : 'normal'} fontFamily="ui-monospace, monospace">{v}</text>}
                      </g>
                    );
                  })}
                </svg>
                <div
                  {...stretch.handleProps({ label: k('handle'), valueText: k('valueText', { x: xx }) })}
                  className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 bg-white/60'}`}
                  style={{ left: xOf(xx), cursor: stretch.dragging ? 'grabbing' : 'grab' }}
                >
                  <span className="-mt-2 rounded-full bg-slate-800 px-2 font-mono text-sm font-extrabold text-white" data-gr-x>{xx}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('smaller')} disabled={xx <= range.min} data-gr-less
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
                <p className="min-w-[6rem] text-center text-sm font-bold text-slate-700" dir="ltr">x = {xx}</p>
                <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('bigger')} disabled={xx >= range.max} data-gr-more
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
              </div>

              {/* ── les deux colonnes : chaque segment est une personne / un montant ── */}
              <div className="mx-auto" style={{ width: CW, maxWidth: '100%' }} dir="ltr" data-gr-columns data-rel={now.rel} data-x={xx}>
                <svg width={CW} height={CH} role="img" aria-label={k('columnsAria', { x: xx, leftTitle: titleL, rightTitle: titleR, left: valueLabel(now.left), right: valueLabel(now.right) })}>
                  <line x1={8} x2={CW - 8} y1={BASE} y2={BASE} stroke="#94A3B8" strokeWidth={2} />
                  {['left', 'right'].map((side) => (
                    <g key={side}>
                      {stack(side).map((sg) => (
                        <rect key={sg.key} x={colX[side] - colW / 2} y={sg.y} width={colW} height={Math.max(0, sg.h)} fill={colorOf(sg.id)} fillOpacity={0.85} stroke="#fff" strokeWidth={1.5} rx={3}
                          style={{ transition: 'y 160ms, height 160ms' }} className="motion-reduce:transition-none" />
                      ))}
                      <text x={colX[side]} y={BASE - hOf(side === 'left' ? now.left : now.right) - 6} textAnchor="middle" fontSize={15} fontWeight="bold" fill="#0F172A" fontFamily="ui-monospace, monospace">
                        {L.valueText(side === 'left' ? now.left : now.right)}
                      </text>
                    </g>
                  ))}
                  {now.rel === '=' && (
                    <line x1={colX.left - colW / 2} x2={colX.right + colW / 2} y1={BASE - hOf(now.left)} y2={BASE - hOf(now.left)} stroke="#059669" strokeWidth={2.5} strokeDasharray="6 4" />
                  )}
                  <text x={CW / 2} y={BASE - 40} textAnchor="middle" fontSize={34} fontWeight="900" fill={now.rel === '=' ? '#059669' : '#475569'} fontFamily="ui-monospace, monospace">{REL_TEX[now.rel]}</text>
                </svg>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-700" dir="ltr">
                  <span dir="rtl">{titleL}</span>
                  <span dir="rtl">{titleR}</span>
                </div>
              </div>
              <div className="grid gap-1 rounded-xl bg-white/90 px-3 py-2 text-sm grid-cols-2" data-gr-readout>
                <p><span className="font-bold text-slate-600">{titleL}: </span><MathText>{`$${L.readoutTex(model, 'left', xx).tex}$`}</MathText></p>
                <p><span className="font-bold text-slate-600">{titleR}: </span><MathText>{`$${L.readoutTex(model, 'right', xx).tex}$`}</MathText></p>
              </div>

              {/* ── les essais : la preuve, dans l'ordre où l'élève les a faits ── */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-600">{k('trialsTitle')}</p>
                {lab.trials.length === 0 ? <p className="text-xs text-slate-500">{k('trialsEmpty')}</p> : (
                  <ul className="flex flex-wrap gap-1.5" dir="ltr" data-gr-trials>
                    {lab.trials.map((tr) => (
                      <li key={tr.x} data-trial-x={tr.x} data-rel={tr.rel}
                        className={`rounded-lg px-2 py-0.5 font-mono text-xs font-bold ${tr.rel === '=' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-800'}`}>
                        x = {tr.x} : {L.valueText(tr.left)} {REL_TEX[tr.rel]} {L.valueText(tr.right)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          <p className="min-h-[1.25rem] text-sm" aria-live="polite" data-gr-notice>
            {notice?.key && reasonText(notice.key, notice.id) && <span className="text-rose-800"><MathText>{reasonText(notice.key, notice.id)}</MathText></span>}
          </p>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}

/* ───────────────────────── les objets dessinés ───────────────────────── */

/** Une personne : sa taille suit son âge (un enfant de 4 ans est petit, de 17 ans presque adulte). */
function PersonFigure({ age, color, adult }) {
  const s = adult ? 1 : Math.min(1, 0.5 + Math.max(0, age) / 36);
  return (
    <svg viewBox="0 0 60 100" width="100%" style={{ display: 'block' }} focusable="false">
      <g transform={`translate(30 98) scale(${s}) translate(-30 -98)`} style={{ transition: 'transform 200ms' }} className="motion-reduce:transition-none">
        <rect x="22" y="70" width="6" height="28" rx="3" fill="#334155" />
        <rect x="32" y="70" width="6" height="28" rx="3" fill="#334155" />
        <path d="M17 42 Q30 34 43 42 L44 74 Q30 78 16 74 Z" fill={color} />
        <rect x="9" y="44" width="7" height="24" rx="3.5" fill={color} transform="rotate(8 12 44)" />
        <rect x="44" y="44" width="7" height="24" rx="3.5" fill={color} transform="rotate(-8 48 44)" />
        <circle cx="30" cy="24" r="13" fill="#FCD9B6" stroke="#B45309" strokeWidth="1" />
        <path d="M17 22 Q30 6 43 22 Q38 14 30 14 Q22 14 17 22 Z" fill="#3F2A1D" />
        <circle cx="25.5" cy="25" r="1.6" fill="#0F172A" />
        <circle cx="34.5" cy="25" r="1.6" fill="#0F172A" />
        {adult
          ? <path d="M24 31 Q30 34 36 31" stroke="#3F2A1D" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          : <path d="M25.5 31 Q30 34 34.5 31" stroke="#9A3412" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  );
}

/** Une tranche de ticket de piscine (un tarif PAR SÉANCE). */
function TicketFigure({ color }) {
  return (
    <svg viewBox="0 0 80 60" width="100%" style={{ display: 'block' }} focusable="false">
      <path d="M6 10 H74 V24 A6 6 0 0 0 74 36 V50 H6 V36 A6 6 0 0 0 6 24 Z" fill="#fff" stroke={color} strokeWidth="3" />
      <line x1="26" y1="12" x2="26" y2="48" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M38 34 q4 -5 8 0 t8 0 t8 0" stroke="#0EA5E9" strokeWidth="2.5" fill="none" />
      <path d="M38 42 q4 -5 8 0 t8 0 t8 0" stroke="#0EA5E9" strokeWidth="2.5" fill="none" />
      <circle cx="16" cy="30" r="5" fill={color} fillOpacity="0.35" />
    </svg>
  );
}

/** La carte d'abonnement annuelle (un montant payé UNE FOIS). */
function CardFigure({ color }) {
  return (
    <svg viewBox="0 0 80 60" width="100%" style={{ display: 'block' }} focusable="false">
      <rect x="5" y="8" width="70" height="44" rx="7" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="3" />
      <rect x="5" y="17" width="70" height="8" fill={color} fillOpacity="0.6" />
      <rect x="12" y="32" width="22" height="13" rx="2" fill="#FDE68A" stroke="#B45309" />
      <path d="M44 40 q4 -5 8 0 t8 0" stroke="#0EA5E9" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/** Les x tickets achetés après x séances : le dessin COMPTE. Au-delà de 24, « +n ». */
function TicketRow({ n, color }) {
  const shown = Math.min(n, 24);
  return (
    <span className="flex max-w-[11rem] flex-wrap justify-center gap-0.5" dir="ltr" aria-hidden="true" data-gr-tickets={n}>
      {Array.from({ length: shown }, (_, i) => (
        <svg key={i} viewBox="0 0 10 7" width="12" height="9"><rect x="0.5" y="0.5" width="9" height="6" rx="1" fill="#fff" stroke={color} /></svg>
      ))}
      {n > shown && <span className="font-mono text-[10px] text-slate-500">+{n - shown}</span>}
    </span>
  );
}

/**
 * Le DÉCOR — sans information, sans état du laboratoire. Âges : la bougie d'un gâteau
 * vacille quand on le touche. Piscine : l'eau ride sous le doigt. `aria-hidden`, hors du
 * parcours clavier, rien ne bouge sous `prefers-reduced-motion`.
 */
function Decor({ themeId }) {
  const reduce = useReducedMotion();
  const [puffs, setPuffs] = useState(0);
  const [ripples, setRipples] = useState([]);
  const tap = (e) => {
    if (reduce) return;
    if (themeId === 'pool') {
      const r = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      const cx = ((e.clientX - r.left) / Math.max(1, r.width)) * 120 || 60;
      setRipples((rs) => [...rs.slice(-3), { id, cx }]);
      setTimeout(() => setRipples((rs) => rs.filter((q) => q.id !== id)), 1200);
    } else {
      setPuffs((p) => p + 1);
    }
  };
  return (
    <button type="button" tabIndex={-1} aria-hidden="true" onClick={tap} data-decor
      className="absolute end-1 z-10 h-12 w-20 rounded-xl opacity-90 focus:outline-none -top-12">
      <svg viewBox="0 0 120 70" width="100%" height="100%">
        <style>{'.gr-flame{transform-origin:60px 22px;animation:gr-flick .45s ease-in-out 4}@keyframes gr-flick{0%,100%{transform:scale(1,1)}50%{transform:scale(.8,.55) skewX(10deg)}}.gr-ripple{transform-box:fill-box;transform-origin:center;animation:gr-ripple 1.1s ease-out forwards}@keyframes gr-ripple{from{transform:scale(.2);opacity:.9}to{transform:scale(2.4);opacity:0}}@media (prefers-reduced-motion: reduce){.gr-flame,.gr-ripple{animation:none}}'}</style>
        {themeId === 'pool' ? (
          <g>
            <rect x="4" y="22" width="112" height="44" rx="10" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3" />
            <path d="M12 40 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#fff" strokeWidth="2.5" fill="none" />
            {ripples.map((r) => <ellipse key={r.id} className="gr-ripple" cx={r.cx} cy="46" rx="10" ry="4" fill="none" stroke="#0369A1" strokeWidth="2" />)}
            <rect x="94" y="8" width="4" height="22" fill="#94A3B8" /><rect x="104" y="8" width="4" height="22" fill="#94A3B8" />
          </g>
        ) : (
          <g>
            <rect x="24" y="40" width="72" height="26" rx="6" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" />
            <path d="M24 48 q9 6 18 0 t18 0 t18 0 t18 0" stroke="#fff" strokeWidth="3" fill="none" />
            <rect x="57" y="24" width="6" height="16" rx="2" fill="#60A5FA" />
            <path key={puffs} className={puffs ? 'gr-flame' : undefined} d="M60 8 C66 16 64 22 60 22 C56 22 54 16 60 8 Z" fill="#F59E0B" />
          </g>
        )}
      </svg>
    </button>
  );
}
