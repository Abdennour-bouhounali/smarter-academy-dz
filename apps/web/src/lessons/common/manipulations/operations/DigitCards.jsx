import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Wand2 } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { useLessonViewport } from '../../knowledge/useLessonViewport';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import LabFold from '../primitives/LabFold';
import DropZone from '../primitives/DropZone';
import DragGhost from '../primitives/DragGhost';
import { LEVELS } from '../levels';
import * as L from '../logic/digitCards';

/**
 * digit-cards — LES CRITÈRES DE DIVISIBILITÉ DÉCOUVERTS SANS DIVISER (1AM, unité 3 « الضرب والقسمة », درس « قواعد
 * قابلية القسمة », manuel نشاط 4 pp. 37–38, معارف 3 p. 41, طريقة p. 42, تمرين 26 p. 46). La logique, entière et
 * exacte, est dans `logic/digitCards.js` (divmod du core, importé par chemin). Chaque verdict est le RESTE, écrit
 * `n = d × q + r` : le laboratoire n'énonce aucun critère avant la découverte.
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. مبتدئ (`mode: 'grid'`, نشاط 4) : la table 0 → 48 en 7 colonnes (les multiples de 2 et de 5 NE tombent PAS en
 *    colonnes : il faut regarder les chiffres). L'élève ouvre un coloriage (rouge ÷2, bleu ÷5, vert ÷3, dans
 *    l'ordre) et TOUCHE les cases qu'il affirme multiples (toucher, Entrée/Espace ; chaque case est un bouton).
 *    متقدم (`mode: 'cards'`, تمرين 26) : il PORTE les cartes 4, 5, 9, 3 dans quatre cases (glisser, toucher-toucher,
 *    clavier), en ÉCHANGE deux posées, et affirme « يقبل / لا يقبل » sur cinq lampes fermées (2, 3, 5, 4, 9).
 * B. La divisibilité se décide SANS diviser : le chiffre des unités (2, 5), la somme des chiffres — qu'aucun
 *    réarrangement ne change — (3, 9), les deux derniers chiffres (4, car 100 = 4 × 25) ; et « a يقبل القسمة على b »
 *    veut dire « le reste euclidien est 0 ».
 * C. Une case acceptée prend la couleur, la ligne du haut écrit `n = d × q` ; une case refusée tremble et la ligne
 *    écrit `21 = 2 × 10 + 1`. Le registre sous la table recueille les CHIFFRES DES UNITÉS des cases coloriées (et,
 *    pour 3, leurs SOMMES de chiffres : tous les chiffres des unités y apparaissent, les sommes se répètent). Cartes :
 *    après chaque nouveau nombre les lampes ouvertes sont re-jugées et marquées « تغيّر / بقي » — 3 et 9 ne
 *    basculent jamais sous un échange, 2, 5, 4 peuvent basculer.
 * D. `n = d × q + 0` ; les règles de 2, 5, 3 (table) ; de 2, 5, 3, 9, 4 (cartes), avec `9534 = 95 × 100 + 34`.
 * E. Table : les trois coloriages complets. Cartes : les trois cibles du manuel atteintes (le plus grand nombre
 *    divisible par 2, 3, 5 : 9534, 9543, 9435) + UN échange qui a gardé la lampe 3 et basculé la lampe 2. Les
 *    conjectures fausses sont réfutées avec SES cases (« la colonne » : m et m ± 7 ; « le chiffre des unités pour 3 » :
 *    m et m ± 10) ou SES nombres (« pair ⇒ ÷4 » : sa réponse 9534 ; « la somme pour 2 » : son échange).
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        la divisibilité se lit sur des chiffres ; « يقبل القسمة » ⇔ reste nul
 *   OBJECT         la table du manuel (49 cases) ; quatre cartes de chiffres et quatre cases
 *   VARIABLE       la case affirmée multiple (table) ; la POSITION de chaque chiffre (cartes)
 *   INVARIANT      la somme des chiffres sous tout réarrangement ; le reste mod 3 et mod 9
 *   TRANSFORMATION colorier ; poser, déplacer, échanger deux cartes
 *   CONSTRAINT     une case n'est multiple que si r = 0 ; un nombre n'a que quatre chiffres, ceux des cartes
 *   RESISTANCE     la case refusée avec sa division ; l'affirmation fausse ; « الأكبر » refusé avec un plus grand
 *                  valide ; « لا يوجد » refusé avec un contre-exemple
 *   EVIDENCE       le registre (unités / sommes) ; les lampes « تغيّر / بقي » après un échange
 *   CONTRAST       même colonne, verdicts opposés ; même chiffre des unités, verdicts opposés pour 3 ; même somme,
 *                  verdicts opposés pour 2 ; pair mais pas ÷4
 *   PREDICTION     l'élève AFFIRME avant de voir (aucune case n'est pré-coloriée, aucune lampe n'est ouverte)
 *   DISCOVERY      « ما الذي يكفي أن ننظر إليه؟ »
 *   FORMALIZATION  la définition par le reste, puis les cinq critères
 *   TRANSFER       les تمارين 22–26, 32 ; l'année bissextile (أتعمّق 8) ; la banque
 *
 * « جرّب كل الإمكانيات » (§6bis) : NON — chaque case touchée, chaque affirmation EST une réponse. « أكمل » (table) est
 * un raccourci LOCAL, pas l'auto-complétion du registre : il n'apparaît qu'après 5 cases coloriées à la main pour le
 * coloriage ouvert (REVEAL_AFTER), colorie les cases manquantes en pâle pointillé, et n'est jamais un essai
 * (choix de l'auteur du lab : 25 multiples de 2 à toucher un par un sur un téléphone, c'est de la corvée, pas de
 * la découverte ; les 5 premiers suffisent à faire travailler le registre).
 *
 * D'UN SEUL REGARD (§8bis) : `[data-dc-glance]` enveloppe la ligne du verdict, les coloriages et « أكمل », la table
 * et le registre (table) ; le verdict, la cible et ses deux boutons, les cases, le plateau et les lampes (cartes).
 * La case de la table vient de l'écran de leçon (`useLessonViewport`) moins ce qui l'entoure, entre 40 px (le
 * doigt : 7 × 40 = 280 px) et 56 px (`gridLayout`, testé). La liste des essais est dans un `LabFold`.
 *
 * Props (contrat fixé avec la leçon) : `mode` ('grid' | 'cards'), `divisors`, `digits` (cartes), `from`, `to`,
 * `columns` (table), `level`, `levels`, `title`, `lead`, `onTrial` à chaque geste JUGÉ — table
 * `{ mode: 'grid', n, d, r, ok }` ; cartes `{ mode: 'cards', n, d, claim, r, ok }` avec claim 'yes' | 'no' (une
 * lampe), 'largest' (« هذا هو الأكبر » : ok = divisible ET le plus grand) ou 'none' (« لا يوجد » : n = null,
 * r = null) —, `onFinished({ mode })` à la règle ; tous par `state.report`.
 *
 * CONTRAT DOM : [data-digit-cards][data-mode][data-solved], [data-dc-glance], [data-dc-colouring=<d>][data-open]
 * [data-complete], [data-dc-reveal], [data-dc-table], [data-dc-cell=<n>][data-colour][data-revealed],
 * [data-dc-ledger], [data-dc-ledger-row=<d>], [data-dc-card=<digit>][data-placed], [data-dc-slot=<i>][data-digit],
 * [data-dc-tray], [data-dc-number], [data-dc-lamp=<d>][data-state][data-flip], [data-dc-claim=<d>][data-claim],
 * [data-dc-task=<d>][data-done], [data-dc-submit], [data-dc-none], [data-dc-verdict=<kind>],
 * [data-dc-refused=<reason>], [data-dc-need], [data-dc-formal], [data-lab-fold=digit-cards.trials].
 */
const NS = 'manipulation.digitCards';
const LRI = '⁦';
const PDI = '⁩';
const iso = (s) => `${LRI}${s}${PDI}`;
const btn = 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 px-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40';

/** Les couleurs du manuel, en classes littérales (Tailwind). */
const TONE = {
  red: { solid: 'border-red-700 bg-red-500 text-white', soft: 'border-dashed border-red-400 bg-red-100 text-red-900', dot: 'bg-red-500', chip: 'border-red-400 bg-red-50 text-red-900', on: 'border-red-600 bg-red-600 text-white' },
  blue: { solid: 'border-blue-700 bg-blue-500 text-white', soft: 'border-dashed border-blue-400 bg-blue-100 text-blue-900', dot: 'bg-blue-500', chip: 'border-blue-400 bg-blue-50 text-blue-900', on: 'border-blue-600 bg-blue-600 text-white' },
  green: { solid: 'border-green-800 bg-green-600 text-white', soft: 'border-dashed border-green-500 bg-green-100 text-green-900', dot: 'bg-green-600', chip: 'border-green-500 bg-green-50 text-green-900', on: 'border-green-700 bg-green-700 text-white' },
  amber: { solid: 'border-amber-700 bg-amber-500 text-white', soft: 'border-dashed border-amber-400 bg-amber-100 text-amber-900', dot: 'bg-amber-500', chip: 'border-amber-400 bg-amber-50 text-amber-900', on: 'border-amber-600 bg-amber-600 text-white' },
  violet: { solid: 'border-violet-700 bg-violet-500 text-white', soft: 'border-dashed border-violet-400 bg-violet-100 text-violet-900', dot: 'bg-violet-500', chip: 'border-violet-400 bg-violet-50 text-violet-900', on: 'border-violet-600 bg-violet-600 text-white' },
  slate: { solid: 'border-slate-700 bg-slate-500 text-white', soft: 'border-dashed border-slate-400 bg-slate-100 text-slate-900', dot: 'bg-slate-500', chip: 'border-slate-400 bg-slate-50 text-slate-900', on: 'border-slate-600 bg-slate-600 text-white' },
};
const toneOf = (d) => TONE[L.colourOf(d)] ?? TONE.slate;

/** Une formule : UN îlot LTR insécable (QA 320 px des labs précédents : coupée dans un paragraphe RTL, elle se réordonne). */
function Formula({ children, className = '', ...rest }) {
  return <bdi dir="ltr" className={`whitespace-nowrap font-mono ${className}`} {...rest}>{children}</bdi>;
}

const sameArr = (x, y) => Array.isArray(x) && Array.isArray(y) && x.length === y.length && x.every((v, i) => v === y[i]);

/** Les nombres de départ : ceux de la leçon, sinon le niveau dont le MODE correspond (les tableaux du niveau sont réutilisés tels quels). */
export function numbersFor({ mode, divisors, digits, from, to, columns, level }) {
  const pair = LEVELS['digit-cards'];
  const asked = pair[resolveLevelId(level ?? 'beginner')].numbers;
  const m = mode ?? asked.mode;
  const preset = asked.mode === m ? asked : Object.values(pair).map((p) => p.numbers).find((n) => n.mode === m) ?? asked;
  const arr = (v, p) => (v == null || sameArr(v, p) ? p : [...v]);
  if (m === 'cards') return { mode: 'cards', digits: arr(digits, preset.digits), divisors: arr(divisors, preset.divisors) };
  return { mode: 'grid', from: from ?? preset.from, to: to ?? preset.to, columns: columns ?? preset.columns, divisors: arr(divisors, preset.divisors) };
}

export default function DigitCards({
  mode, divisors, digits, from, to, columns, title, lead, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const initialNumbers = useMemo(() => numbersFor({ mode, divisors, digits, from, to, columns, level }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'digit-cards', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const nums = state.numbers;
  const sceneKey = `${JSON.stringify(nums)}|${state.epoch}`;
  const [lab, setLab] = useState(() => L.init(nums));
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(L.init(nums)); }
  const m = lab.mode;

  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { mode: m }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  // chaque essai est rapporté UNE fois, même si deux gestes tombent dans le même rendu ; « إعادة » repart de zéro
  const reported = useRef(0);
  const nTrials = lab.trials.length;
  useEffect(() => {
    if (nTrials < reported.current) reported.current = 0;
    for (let i = reported.current; i < nTrials; i += 1) state.report(onTrial, L.trialEvidence(lab.trials[i]));
    reported.current = nTrials;
  }, [nTrials, lab.trials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── mesure : largeur, écran de leçon, ce qui entoure la table ── */
  const boxRef = useRef(null);
  const glanceRef = useRef(null);
  const tableHRef = useRef(0);
  const [width, setWidth] = useState(320);
  const [overhead, setOverhead] = useState(260);
  const [room, setRoom] = useState(0);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      setWidth(Math.max(160, Math.floor(el.clientWidth)));
      // la place libre de chaque côté jusqu'à la gouttière de l'écran (20 px) : la table peut y déborder sur un téléphone
      const r = el.getBoundingClientRect();
      if (typeof window !== 'undefined') setRoom(Math.max(0, Math.floor(Math.min(r.left, window.innerWidth - r.right) - 20)));
      if (glanceRef.current) setOverhead(Math.max(80, Math.ceil(glanceRef.current.getBoundingClientRect().height) - tableHRef.current));
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
  const narrow = width < 380;

  /* ── la découverte : les conjectures fausses réfutées par les cases / les nombres de l'élève ── */
  const discoveryOptions = useMemo(() => {
    if (m === 'grid') {
      const col = L.columnRefutation(lab);
      const un = L.unitsRefutation(lab);
      return [
        { text: k('discovery.column'), why: col ? k('discovery.whyColumn', { ...col, eq: iso(L.equationText(col.n, col.d)) }) : k('discovery.whyGeneric') },
        { text: k('discovery.right.grid'), correct: true },
        { text: k('discovery.units3'), why: un ? k('discovery.whyUnits3', { ...un, eq: iso(L.equationText(un.n, un.d)) }) : k('discovery.whyGeneric') },
      ];
    }
    const ans2 = lab.tasks[2]?.answer;
    const even = ans2 != null && L.division(ans2, 4).r !== 0 ? ans2 : null;
    const sw = lab.swap;
    const sumWhy = sw
      ? k('discovery.whySum2', {
        a: sw.from, b: sw.to, s: L.digitSum(sw.from),
        even: L.division(sw.from, 2).divides ? sw.from : sw.to, odd: L.division(sw.from, 2).divides ? sw.to : sw.from,
      })
      : k('discovery.whyGeneric');
    return [
      { text: k('discovery.even4'), why: even != null ? k('discovery.whyEven4', { n: even, eq: iso(L.equationText(even, 4)), r: L.division(even, 4).r }) : k('discovery.whyGeneric') },
      { text: k('discovery.right.cards'), correct: true },
      { text: k('discovery.sum2'), why: sumWhy },
    ];
  }, [m, lab, k]);

  const formal = <Formal lab={lab} k={k} />;
  const hintO = m === 'grid' ? {} : { digits: iso(lab.digits.join(' ، ')) };

  return (
    <ManipulationShell
      type="digit-cards"
      title={title ?? k(`title.${m}`)}
      mission={k(`mission.${m}`, m === 'grid' ? { from: lab.from, to: lab.to } : hintO)}
      lead={lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={[0, 1, 2].map((i) => k(`hints.${m}.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={<ManipulationDiscovery state={state} prompt={k(`discovery.prompt.${m}`)} options={discoveryOptions} formal={formal} />}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-amber-50/40 to-white">
        <div ref={boxRef} className="space-y-2" data-digit-cards data-mode={m} data-solved={ready ? 'true' : 'false'}
          data-layout={narrow ? 'narrow' : 'wide'}>
          {m === 'grid'
            ? <GridLab lab={lab} setLab={setLab} k={k} width={width} room={room} tiny={width < 250} screenH={screenH} overhead={overhead} narrow={narrow} glanceRef={glanceRef} tableHRef={tableHRef} />
            : <CardsLab lab={lab} setLab={setLab} k={k} width={width} room={room} glanceRef={glanceRef} />}

          {lab.trials.length > 0 && (
            <LabFold id="digit-cards.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-dc-trials={lab.trials.length}>
                {lab.trials.map((tr, i) => (
                  <li key={i} className={tr.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(tr.ok)}>
                    {trialText(tr, k)}
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

function trialText(tr, k) {
  const word = k(tr.ok ? 'ok' : 'notOk');
  if (tr.mode === 'grid') return k('trial.grid', { eq: iso(L.equationText(tr.n, tr.d)), word });
  if (tr.claim === 'yes' || tr.claim === 'no') return k('trial.claim', { eq: iso(L.equationText(tr.n, tr.d)), word: `${k(tr.claim === 'yes' ? 'claimYes' : 'claimNo')}: ${word}` });
  if (tr.claim === 'largest') return k('trial.largest', { n: tr.n, d: tr.d, word });
  return k('trial.none', { d: tr.d, word });
}

/* ══════════════ مبتدئ : la table du نشاط 4 ══════════════ */

function GridLab({ lab, setLab, k, width, room, tiny, screenH, overhead, narrow, glanceRef, tableHRef }) {
  const cells = L.cellsOf(lab);
  // TÉLÉPHONE : la leçon emboîte la scène dans cinq cadres (≈ 182 px utiles à 320 px) ; le bloc « d'un seul regard »
  // déborde alors symétriquement sur ces cadres (une carte blanche posée dessus), jusqu'à la gouttière de l'écran (20 px),
  // juste assez pour des cases de 40 px (le doigt) : 7 × 40 = 280 px.
  const need = lab.columns * 40;
  const bleed = width < need ? Math.min(room, Math.ceil((need - width) / 2)) : 0;
  // − 48 : la barre collante du module et une marge
  const lay = L.gridLayout({ count: cells.length, columns: lab.columns, width: width + 2 * bleed, maxHeight: Math.max(280, screenH - overhead - 48) });
  const margin = Math.max(0, (lay.width - width) / 2);
  tableHRef.current = lay.height;
  const d = L.activeDivisor(lab);
  const v = lab.last;
  const [shake, setShake] = useState(null);
  useEffect(() => {
    if (!v || v.ok) return undefined;
    setShake(v.n);
    const id = setTimeout(() => setShake(null), 500);
    return () => clearTimeout(id);
  }, [v]);

  let verdict = '';
  let kind = '';
  if (v) {
    kind = v.ok ? (v.again ? 'again' : 'ok') : 'refused';
    verdict = k(`v.grid.${kind}`, { n: v.n, d: v.d, r: v.r });
  } else if (d != null && L.colouringComplete(lab, d)) {
    kind = 'complete';
    verdict = k('v.grid.complete', { d, total: L.multiplesOf(d, lab.from, lab.to).length });
  } else if (d == null) {
    verdict = k('colouring.pick');
  }
  const eq = v ? L.equationText(v.n, v.d) : null;
  const fs = lay.cell >= 48 ? 'text-base' : 'text-sm';

  return (
    <div ref={glanceRef} className={`space-y-2 ${margin > 0 ? 'relative z-[1] rounded-xl bg-white shadow-md ring-1 ring-slate-200' : ''}`}
      style={margin > 0 ? { marginInline: -margin } : undefined} data-dc-glance data-bleed={margin > 0 ? Math.round(margin) : undefined}>
      {/* le verdict du dernier geste — un seul emplacement, mis à jour en place (§6ter) */}
      <p role="status" aria-live="polite"
        className={`flex min-h-[2.5rem] flex-wrap items-baseline gap-x-2 rounded-xl px-2 py-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug ${v?.ok || kind === 'complete' ? 'bg-emerald-50 text-emerald-900' : v ? 'bg-rose-50 text-rose-900' : 'text-slate-600'}`}
        data-dc-verdict={kind} data-dc-refused={v && !v.ok ? 'remainder' : undefined}>
        {eq && <Formula className="text-sm font-extrabold">{eq}</Formula>}
        <span>{verdict}</span>
      </p>

      {/* les trois coloriages, dans l'ordre du manuel, puis « أكمل » */}
      <div className={`flex flex-wrap items-center gap-1.5 ${margin > 0 ? 'px-1' : ''}`}>
        {tiny && <span className="text-xs font-bold text-slate-700">{k('colouring.short')}</span>}
        {lab.divisors.map((dd, i) => {
          const open = lab.active === i;
          const complete = L.colouringComplete(lab, dd);
          const can = L.canOpen(lab, i);
          const tone = toneOf(dd);
          const lg = L.ledger(lab, dd);
          return (
            <button key={dd} type="button" onClick={() => setLab((s) => L.openColouring(s, i))} disabled={!can}
              aria-pressed={open} title={can ? undefined : k('colouring.locked', { d: lab.divisors[i - 1] })}
              aria-label={k('colouring.aria', { d: dd, colour: k(`colourName.${L.colourOf(dd)}`) })}
              data-dc-colouring={dd} data-open={open ? 'true' : 'false'} data-complete={complete ? 'true' : 'false'}
              className={`${btn} gap-1.5 ${open ? tone.on : `${tone.chip}`}`}>
              <span className={`inline-block h-3 w-3 rounded-full border border-white ${tone.dot}`} aria-hidden="true" />
              {tiny ? <span className="font-mono">{dd}</span> : <span>{k('colouring.label', { d: dd })}</span>}
              {complete ? <Check className="h-4 w-4" aria-hidden="true" /> : (lg.count > 0 && !tiny && <Formula className="text-xs">{`${lg.count}/${lg.total}`}</Formula>)}
            </button>
          );
        })}
        {L.canReveal(lab) && (
          <button type="button" onClick={() => setLab(L.reveal)} aria-label={k('revealAria', { d })} data-dc-reveal
            className={`${btn} gap-1 border-slate-300 bg-white text-slate-700`}>
            <Wand2 className="h-4 w-4" aria-hidden="true" /> {k('reveal')}
          </button>
        )}
      </div>

      {/* la table : 7 colonnes, de droite à gauche (le sens de la page), cases jointives comme au manuel */}
      <div role="group" aria-label={k('tableAria', { from: lab.from, to: lab.to, columns: lab.columns })}
        className="mx-auto grid overflow-hidden rounded-lg bg-white ring-1 ring-slate-400"
        style={{ width: lay.width, gridTemplateColumns: `repeat(${lab.columns}, ${lay.cell}px)`, gridAutoRows: `${lay.cell}px` }}
        data-dc-table data-cell={lay.cell}>
        {cells.map((n) => {
          const inSets = lab.divisors.filter((dd) => L.isColoured(lab, dd, n));
          const here = d != null && L.isColoured(lab, d, n);
          const revealed = here && (lab.revealed[d] ?? []).includes(n);
          const tone = d != null ? toneOf(d) : null;
          const others = inSets.filter((dd) => dd !== d);
          const refused = v && !v.ok && v.n === n;
          return (
            <button key={n} type="button" onClick={() => setLab((s) => L.tapCell(s, n))} disabled={d == null}
              aria-label={inSets.length ? k('cellAriaIn', { n, list: inSets.join(' ، ') }) : k('cellAria', { n })}
              aria-pressed={here}
              data-dc-cell={n} data-colour={inSets.map(L.colourOf).join(' ')} data-revealed={revealed ? 'true' : undefined}
              className={`relative flex items-center justify-center border border-slate-300 font-mono ${fs} font-bold transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-default ${
                here ? (revealed ? tone.soft : tone.solid) : refused ? 'bg-rose-50 text-rose-800 ring-2 ring-inset ring-rose-400' : 'bg-white text-slate-800 hover:bg-slate-50'} ${shake === n ? 'sa-manip-reject' : ''}`}>
              <span dir="ltr">{n}</span>
              {others.length > 0 && (
                <span className="pointer-events-none absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5" aria-hidden="true">
                  {others.map((dd) => <span key={dd} className={`h-1.5 w-1.5 rounded-full ring-1 ring-white ${toneOf(dd).dot}`} />)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* le registre : ce qu'on lit sur les cases coloriées — la matière de la conjecture, jamais la règle */}
      <Ledger lab={lab} k={k} narrow={narrow} only={tiny ? d : null} />
    </div>
  );
}

/** `only` (téléphone) : la ligne du coloriage ouvert seulement — rouvrir un coloriage fini remontre la sienne. */
function Ledger({ lab, k, narrow, only = null }) {
  const rows = lab.divisors.filter((d) => only == null || d === only).map((d) => L.ledger(lab, d)).filter((lg) => lg.count > 0);
  return (
    <div className={`space-y-1 rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-1.5 ${narrow ? 'text-[11px]' : 'text-xs'}`} data-dc-ledger>
      <p className="font-bold text-slate-600">{k('ledger.title')}{rows.length === 0 && <span className="font-normal"> — {k('ledger.empty')}</span>}</p>
      {rows.map((lg) => {
        const tone = toneOf(lg.d);
        return (
          <div key={lg.d} className="flex flex-wrap items-center gap-x-2 gap-y-0.5" data-dc-ledger-row={lg.d}>
            <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 font-bold ${tone.chip}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${tone.dot}`} aria-hidden="true" />{k('colouring.label', { d: lg.d })}
            </span>
            <span className="font-bold text-slate-700">{k('ledger.units')}:</span>
            <Chips values={lg.units} data-dc-units={lg.units.join(' ')} />
            {lg.sums && (
              <>
                <span className="font-bold text-slate-700">{k('ledger.sums')}:</span>
                <Chips values={lg.sums} data-dc-sums={lg.sums.join(' ')} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Chips({ values, ...rest }) {
  return (
    <span className="inline-flex flex-wrap gap-0.5" dir="ltr" {...rest}>
      {values.map((x) => <span key={x} className="min-w-[1.25rem] rounded border border-slate-300 bg-white px-1 text-center font-mono font-bold text-slate-900">{x}</span>)}
    </span>
  );
}

/* ══════════════ متقدم : les cartes du تمرين 26 ══════════════ */

function CardsLab({ lab, setLab, k, width, room, glanceRef }) {
  // téléphone : le même débordement que la table (jusqu'à 280 px, carte blanche posée sur les cadres)
  const margin = width < 280 ? Math.max(0, Math.min(room, Math.ceil((280 - width) / 2))) : 0;
  const inner = width + 2 * margin;
  const tiny = inner < 250;
  const narrow = inner < 380;
  const n = L.numberOf(lab);
  const drag = useDragInteraction({
    accepts: (src, zone) => {
      if (src.startsWith('card:')) return zone.startsWith('slot:') ? true : '';
      if (src.startsWith('slot:')) {
        if (zone === 'tray') return true;
        return zone.startsWith('slot:') && zone !== src ? true : '';
      }
      return '';
    },
    onDrop: (src, zone) => {
      const a = Number(src.slice(5));
      if (src.startsWith('card:')) setLab((s) => L.placeCard(s, a, Number(zone.slice(5))));
      else if (zone === 'tray') setLab((s) => L.returnCard(s, a));
      else setLab((s) => L.moveSlot(s, a, Number(zone.slice(5))));
    },
  });

  // Toucher (ou Entrée sur) une carte POSÉE pendant qu'on en tient une autre, c'est viser sa case (un échange) ;
  // toucher une carte du plateau en tenant une carte posée, c'est la rendre au plateau.
  const targetFor = (id) => {
    const held = drag.held;
    if (!held || drag.dragging || held === id) return null;
    if (id.startsWith('slot:')) return id;
    if (id.startsWith('card:') && held.startsWith('slot:')) return 'tray';
    return null;
  };
  const intercept = (id) => ({
    onPointerDownCapture: (e) => { if (targetFor(id)) { e.stopPropagation(); e.preventDefault(); } },
    onPointerUpCapture: (e) => { if (targetFor(id)) { e.stopPropagation(); e.preventDefault(); } },
    onClickCapture: (e) => { const z = targetFor(id); if (z) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); } },
    onKeyDownCapture: (e) => { const z = targetFor(id); if (z && (e.key === 'Enter' || e.key === ' ')) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); } },
  });

  const heldDigit = (() => {
    const h = String(drag.held ?? '');
    if (h.startsWith('card:')) return lab.digits[Number(h.slice(5))];
    if (h.startsWith('slot:')) { const c = lab.slots[Number(h.slice(5))]; return c == null ? null : lab.digits[c]; }
    return null;
  })();

  const d = L.taskDivisor(lab);
  const card = (ci, id, extra = {}) => {
    const sp = drag.sourceProps(id);
    const ic = intercept(id);
    const digit = lab.digits[ci];
    return (
      <button key={id} type="button" {...sp} {...ic} {...extra}
        aria-label={k('cardAria', { digit })} data-dc-card={digit} data-placed={id.startsWith('slot:') ? 'true' : 'false'}
        className={`sa-manip-object inline-flex ${tiny ? 'h-12 w-9 text-xl' : 'h-14 w-11 text-2xl'} select-none items-center justify-center rounded-xl border-2 bg-white font-mono font-extrabold text-indigo-950 shadow-sm transition-transform duration-150 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${drag.held === id ? 'scale-105 border-indigo-600 ring-2 ring-indigo-500' : 'border-indigo-400'} ${drag.rejected === id ? 'sa-manip-reject' : ''}`}
        style={sp.style}>
        {digit}
      </button>
    );
  };

  /* ── le verdict ── */
  const v = lab.last;
  let verdict = '';
  let eq = null;
  let kind = '';
  let refused;
  let tone = 'text-slate-600';
  if (v?.kind === 'claim') {
    kind = 'claim';
    eq = L.equationText(v.n, v.d);
    const key = v.claim === 'yes' ? (v.ok ? 'claimYesOk' : 'claimYesWrong') : (v.ok ? 'claimNoOk' : 'claimNoWrong');
    verdict = k(`v.cards.${key}`, { n: v.n, d: v.d, r: v.r });
    if (!v.ok) refused = 'claim';
  } else if (v?.kind === 'largest') {
    kind = 'largest';
    eq = L.equationText(v.n, v.d);
    verdict = k(`v.cards.${v.ok ? 'largestOk' : v.reason}`, { n: v.n, d: v.d, r: v.r, larger: v.larger });
    if (!v.ok) refused = v.reason;
  } else if (v?.kind === 'none') {
    kind = 'none';
    eq = v.exampleEq;
    verdict = k(`v.cards.${v.ok ? 'noneOk' : 'noneWrong'}`, { d: v.d, count: v.count, rs: iso((v.remainders ?? []).join(' ، ')), example: v.example });
    if (!v.ok) refused = 'none';
  } else if (v?.kind === 'change') {
    kind = 'change';
    verdict = k('v.cards.change', { from: v.from, to: v.to });
  } else if (n == null) {
    verdict = k('v.cards.empty');
  }
  if (kind && kind !== 'change') tone = v.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900';
  if (kind === 'change') tone = 'bg-indigo-50 text-indigo-950';
  const flips = lab.flips ?? {};
  const flipped = lab.divisors.filter((x) => flips[x] === 'flipped');
  const kept = lab.divisors.filter((x) => flips[x] === 'kept');

  const reach = L.reachableTargets(lab);
  const targetsDone = reach.every((x) => L.taskDone(lab, x));
  const need = L.discoveryReady(lab) ? null : targetsDone && !lab.swap ? 'swap' : lab.swap && !targetsDone ? 'targets' : null;
  const taskState = lab.tasks[d];

  return (
    <div ref={glanceRef} className={`space-y-2 ${margin > 0 ? 'relative z-[1] rounded-xl bg-white p-1 shadow-md ring-1 ring-slate-200' : ''}`}
      style={margin > 0 ? { marginInline: -margin } : undefined} data-dc-glance data-bleed={margin > 0 ? margin : undefined}>
      {/* le verdict du dernier geste — un seul emplacement (§6ter) */}
      <div role="status" aria-live="polite"
        className={`min-h-[2.5rem] space-y-0.5 rounded-xl px-2 py-1 ${narrow ? 'text-xs' : 'text-sm'} font-bold leading-snug ${tone}`}
        data-dc-verdict={kind} data-dc-refused={refused}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          {eq && <Formula className="text-sm font-extrabold">{eq}</Formula>}
          <span>{verdict}</span>
        </p>
        {kind === 'change' && (flipped.length > 0 || kept.length > 0) && (
          <p className="flex flex-wrap gap-x-3 text-xs">
            {flipped.length > 0 && <span className="text-amber-800" data-dc-flipped={flipped.join(' ')}>{k('v.cards.flipped', { list: iso(flipped.join(' ، ')) })}</span>}
            {kept.length > 0 && <span className="text-slate-700" data-dc-kept={kept.join(' ')}>{k('v.cards.kept', { list: iso(kept.join(' ، ')) })}</span>}
          </p>
        )}
      </div>
      {need && <p className="text-xs font-bold text-indigo-900" data-dc-need={need}>{k(`need.${need}`)}</p>}

      {/* la cible : « le plus grand nombre divisible par d » — ou « لا يوجد » */}
      <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/60 px-2 py-1.5">
        <div className={`flex flex-wrap items-center ${tiny ? 'gap-0.5' : 'gap-1'}`} role="group" aria-label={k('tasksTitle')}>
          <span className={`text-xs font-bold text-amber-900 ${tiny ? 'w-full' : ''}`}>{k('tasksTitle')}:</span>
          {lab.divisors.map((x, i) => {
            const done = L.taskDone(lab, x);
            const sel = lab.task === i;
            return (
              <button key={x} type="button" onClick={() => setLab((s) => L.selectTask(s, i))} aria-pressed={sel}
                aria-label={k('taskAria', { d: x })} data-dc-task={x} data-done={done ? 'true' : 'false'}
                className={`${btn} ${tiny ? '!min-w-[30px] !px-0.5' : 'min-w-[40px] px-1.5'} gap-0.5 font-mono ${sel ? 'border-amber-600 bg-amber-500 text-white' : done ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-white text-amber-950'}`}>
                {x}{done && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        <div className={tiny ? 'grid grid-cols-2 gap-1' : 'flex flex-wrap items-center gap-1.5'}>
          <p className={`${tiny ? 'col-span-2' : 'flex-1'} ${narrow ? 'text-xs' : 'text-sm'} font-bold text-amber-950`}>
            {k('task', { d })}
            {taskState?.done && <span className="ms-1 text-emerald-800">{taskState.none ? k('answerNone') : k('answer', { n: taskState.answer })}</span>}
          </p>
          <button type="button" onClick={() => setLab((s) => L.submitLargest(s))} disabled={n == null || !!taskState?.done}
            aria-label={n == null ? k('submit') : k('submitAria', { n, d })} data-dc-submit
            className={`${btn} ${tiny ? '!px-1 text-[11px]' : ''} border-amber-500 bg-white text-amber-900`}>{k('submit')}</button>
          <button type="button" onClick={() => setLab((s) => L.sayNone(s))} disabled={!!taskState?.done}
            aria-label={k('noneAria', { d })} data-dc-none
            className={`${btn} ${tiny ? '!px-1 text-[11px]' : ''} border-slate-400 bg-white text-slate-800`}>{k('none')}</button>
        </div>
      </div>

      {/* les quatre cases : le nombre, écrit de gauche à droite (la notation est LTR) */}
      <div className={`flex flex-wrap items-center justify-center ${tiny ? 'gap-1.5' : 'gap-3'}`}>
        <div className={`flex items-end ${tiny ? 'gap-1' : 'gap-1.5'}`} dir="ltr" data-dc-number={n ?? ''} aria-label={k('slotsTitle')} role="group">
          {lab.slots.map((ci, i) => (
            <DropZone key={i} drag={drag} id={`slot:${i}`} tone="indigo" minHeight="min-h-[64px]"
              label={ci == null ? k('slotAria', { i: i + 1, place: k(`places.${placeIndex(i, lab.slots.length)}`) }) : k('slotFullAria', { i: i + 1, place: k(`places.${placeIndex(i, lab.slots.length)}`), digit: lab.digits[ci] })}
              className={`flex ${tiny ? 'w-[42px]' : 'w-[52px]'} items-center justify-center`} data-dc-slot={i} data-digit={ci == null ? '' : lab.digits[ci]}>
              {ci != null && card(ci, `slot:${i}`)}
            </DropZone>
          ))}
        </div>
        {/* le plateau : les cartes pas encore posées ; c'est aussi la zone où l'on rend une carte */}
        <DropZone drag={drag} id="tray" tone="slate" minHeight={L.trayOf(lab).length === 0 ? 'min-h-[44px]' : 'min-h-[64px]'} label={k('trayAria')}
          className={`flex ${tiny ? 'w-full' : 'min-w-[120px]'} flex-wrap items-center justify-center gap-1.5 px-1.5 py-1`} data-dc-tray>
          <span className="sr-only">{k('trayTitle')}</span>
          {L.trayOf(lab).length === 0
            ? <span className="px-1 text-[11px] leading-tight text-slate-400">{k('trayEmpty')}</span>
            : <span className="flex flex-wrap gap-1.5" dir="ltr">{L.trayOf(lab).map((ci) => card(ci, `card:${ci}`))}</span>}
        </DropZone>
      </div>

      {/* les lampes : fermées jusqu'à une affirmation ; ouvertes, elles se re-jugent à chaque nouveau nombre */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-600">{k('lampsTitle')}</p>
        {narrow && (
          <p className="flex gap-3 text-[11px] font-bold text-slate-600" aria-hidden="true">
            <span className="inline-flex items-center gap-0.5"><Check className="h-3.5 w-3.5 text-emerald-700" />{k('claimYes')}</span>
            <span className="inline-flex items-center gap-0.5"><X className="h-3.5 w-3.5 text-slate-600" />{k('claimNo')}</span>
          </p>
        )}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${lab.divisors.length}, minmax(0, 1fr))` }}>
          {lab.divisors.map((x) => <Lamp key={x} lab={lab} d={x} n={n} k={k} setLab={setLab} tiny={narrow} />)}
        </div>
      </div>

      <DragGhost ghost={drag.ghost}>
        {heldDigit != null && (
          <span className="inline-flex h-14 w-11 items-center justify-center rounded-xl border-2 border-indigo-500 bg-white font-mono text-2xl font-extrabold text-indigo-950">{heldDigit}</span>
        )}
      </DragGhost>
    </div>
  );
}

/** L'indice du nom de rang (الآلاف … الآحاد) de la case i sur `len` cases. */
const placeIndex = (i, len) => Math.max(0, 4 - (len - i));

function Lamp({ lab, d, n, k, setLab, tiny }) {
  const st = L.lampState(lab, d);
  const flip = lab.flips?.[d];
  const look = st === 'yes' ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
    : st === 'no' ? 'border-slate-400 bg-slate-100 text-slate-700'
      : 'border-slate-300 bg-white text-slate-500';
  return (
    <div className={`flex flex-col items-stretch gap-1 rounded-xl border-2 p-1 text-center ${look} ${flip === 'flipped' ? 'ring-2 ring-amber-400' : ''}`}
      role="group" aria-label={k(`lampAria.${st}`, { d })} data-dc-lamp={d} data-state={st} data-flip={flip ?? undefined}>
      <span className="font-mono text-lg font-extrabold leading-none">{d}</span>
      {st === 'closed' ? (
        <>
          <button type="button" onClick={() => setLab((s) => L.claim(s, d, true))} disabled={n == null}
            aria-label={n == null ? k('claimNeedNumber') : k('claimYesAria', { n, d })} data-dc-claim={d} data-claim="yes"
            className="inline-flex min-h-[44px] items-center justify-center gap-0.5 rounded-lg border-2 border-emerald-400 bg-white px-0.5 text-[11px] font-bold text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{!tiny && <span dir="rtl">{k('claimYes')}</span>}
          </button>
          <button type="button" onClick={() => setLab((s) => L.claim(s, d, false))} disabled={n == null}
            aria-label={n == null ? k('claimNeedNumber') : k('claimNoAria', { n, d })} data-dc-claim={d} data-claim="no"
            className="inline-flex min-h-[44px] items-center justify-center gap-0.5 rounded-lg border-2 border-slate-300 bg-white px-0.5 text-[11px] font-bold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40">
            <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{!tiny && <span dir="rtl">{k('claimNo')}</span>}
          </button>
        </>
      ) : (
        <>
          <span className={`flex min-h-[44px] flex-col items-center justify-center ${tiny ? 'text-[10px]' : 'text-xs'} font-extrabold leading-tight`} dir="rtl">
            {st === 'yes' && <Check className="h-4 w-4" aria-hidden="true" />}
            {st === 'no' && <X className="h-4 w-4" aria-hidden="true" />}
            {k(`lampState.${st}`)}
          </span>
          <span className={`min-h-[1rem] text-[10px] font-bold ${flip === 'flipped' ? 'text-amber-800' : 'text-slate-500'}`} dir="rtl">{flip ? k(`lampFlip.${flip}`) : ''}</span>
        </>
      )}
    </div>
  );
}

/* ══════════════ La règle (après la découverte) ══════════════ */

function Formal({ lab, k }) {
  const line = (text, key, formula) => (
    <li key={key} className="space-y-0.5" data-dc-rule={key}>
      <p>{text}</p>
      {formula && <p className="flex flex-wrap justify-center gap-x-4 text-indigo-950">{formula}</p>}
    </li>
  );
  if (lab.mode === 'grid') {
    // les exemples viennent des cases de l'élève (sinon de la table)
    const pick = (d, test) => [...(lab.found[d] ?? []), ...(lab.revealed[d] ?? [])].filter(test).at(-1) ?? L.multiplesOf(d, lab.from, lab.to).filter(test).at(-1);
    const e3 = pick(3, (x) => x >= 10);
    return (
      <div className="space-y-2 text-sm font-bold text-emerald-950" data-dc-formal>
        <p>{k('formal.def')}</p>
        <p className="flex justify-center"><Formula className="font-extrabold text-indigo-950">{L.equationWithRemainder(e3, 3)}</Formula></p>
        <ul className="space-y-1.5">
          {lab.divisors.map((d) => line(k(`formal.rule${d}`), d, d === 3 && e3 != null ? <Formula>{`${L.digitsOf(e3).join(' + ')} = ${L.digitSum(e3)}`}</Formula> : null))}
        </ul>
      </div>
    );
  }
  const ex = lab.tasks[2]?.answer ?? L.validArrangements(lab.digits, 2).at(-1) ?? L.arrangements(lab.digits).at(-1);
  const hi = Math.floor(ex / 100);
  const lo = ex - hi * 100;
  const order = [2, 5, 3, 9, 4].filter((d) => lab.divisors.includes(d));
  return (
    <div className="space-y-2 text-sm font-bold text-emerald-950" data-dc-formal>
      <p>{k('formal.def')}</p>
      <p className="flex justify-center"><Formula className="font-extrabold text-indigo-950">{L.equationWithRemainder(ex, 2)}</Formula></p>
      <ul className="space-y-1.5">
        {order.map((d) => {
          if (d === 3 || d === 9) {
            return line(k(`formal.rule${d}`), d, (
              <>
                <Formula>{`${L.digitsOf(ex).join(' + ')} = ${L.digitSum(ex)}`}</Formula>
                <Formula>{L.equationText(L.digitSum(ex), d)}</Formula>
              </>
            ));
          }
          if (d === 4) {
            return line(k('formal.rule4'), d, (
              <>
                <span className="text-xs text-slate-700">{k('formal.why4')}</span>
                <Formula>{`${ex} = ${hi} × 100 + ${lo}`}</Formula>
                <Formula>100 = 4 × 25</Formula>
                <Formula>{L.equationText(lo, 4)}</Formula>
              </>
            ));
          }
          return line(k(`formal.rule${d}`), d, null);
        })}
      </ul>
    </div>
  );
}
