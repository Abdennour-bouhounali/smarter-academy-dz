import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import { ClassroomPresentation, ClassroomEntryButton, useClassroomMode } from '../../classroom';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import EquationDisplay from '../primitives/EquationDisplay';
import DivisionRoles from '../primitives/DivisionRoles';
import { BOOK_PALETTE } from '../primitives/BookFigure';
import { useLabCoach } from '../primitives/LabCoach';
import * as S from '../logic/bookshelf';

/**
 * divisor-explorer-books — LE RAYON QU'ON ÉTIRE.
 *
 * A. Ce que l'élève MANIPULE : le serre-livres d'un rayon. Il le tire vers
 *    la gauche ou le repousse : le rayon s'allonge ou se raccourcit d'un livre
 *    à la fois. (Au clavier : les flèches ; au doigt sans glisser : − / +, ou
 *    toucher la réglette.)
 * B. Idée : ranger a livres par rayons de b, c'est a = b × q + r (QUOTITION :
 *    on fixe la TAILLE d'un groupe, le NOMBRE de groupes en résulte). b est
 *    la grandeur que le doigt tient ; q et r en sont la conséquence.
 * C. Ce qui change, PENDANT le geste : tous les rayons de la bibliothèque
 *    prennent la longueur du rayon tiré (un seul serre-livres pour tous —
 *    l'égalité des parts est physique, on ne peut pas faire un rayon plus
 *    long que les autres) ; les livres se rangent en q rayons pleins ; ceux
 *    qui restent tombent dans un RAYON FANTÔME au sol, dont les places vides
 *    montrent combien il en manquerait pour un rayon de plus. C'est la
 *    RÉSISTANCE : r livres ne font pas un rayon, et le dessin le prouve.
 * D. Représentation qui ÉMERGE, au relâchement : a = b × q + r, et les trois
 *    rôles nommés (b : tu l'as choisi · q : il en résulte · r < b).
 * E. À découvrir AVANT la règle : le sol se vide pour certaines longueurs
 *    seulement — exactement quand le reste est nul, c'est-à-dire quand b est
 *    un قاسم de a. (En معارف, `discovery="symmetry"` : 11 PUIS 13 vident le
 *    sol, donc le quotient aussi est un قاسم — 143 = 11 × 13 = 13 × 11.)
 *
 * POURQUOI UN RAYON ET PAS DES BOUTONS. Jusqu'au 2026-09-29 l'élève touchait
 * un NOMBRE parmi dix-sept et regardait la page recalculer (audit, M2) : le
 * doigt ne tenait aucune grandeur, la conséquence tombait hors de l'écran, et
 * le verdict « قاسم » s'affichait au premier essai. Ici le doigt TIENT b : la
 * bibliothèque se réorganise sous ses yeux, et le rayon fantôme se remplit,
 * se vide, se remplit — la régularité apparaît dans le geste lui-même.
 *
 * COMPRESSION HONNÊTE. Les 420 livres sont TOUS dessinés, un dos par livre
 * (`bookcaseLayout`, balayé par ses tests) : un rayon = une rangée, jamais
 * une grille défilante. Un dos fait quelques pixels : on ne compte pas les
 * livres un à un, on lit les compteurs — et chaque compteur dit un nombre
 * qu'on VOIT (q rangées, r dos au sol).
 *
 * UN ESSAI EST UN GESTE VALIDÉ. Pendant le glisser, tout se redessine ; au
 * relâchement (ou à la touche, au bouton) l'essai est retenu. La découverte
 * demande trois longueurs, dont une qui vide le sol et une qui en laisse
 * (`remainderDiscoveryReady`) — le contraste, pas une longueur chanceuse.
 *
 * ONBOARDING (prop `coach`, défaut true — `LabCoach`, §8quater) : `logic/bookshelf.js › coachOf` montre la poignée du serre-livres
 * (glisser), puis les boutons « + / − » (le chemin sans glisser) ; jamais une longueur. Le guide se tait quand la découverte est méritée.
 *
 * Même coquille que les autres laboratoires (ManipulationShell) : indices,
 * conjecture, règle, « إعادة ». Le mode classe de la PLATEFORME (⛶ عرض
 * المناولة) enveloppe le tout sans rien remonter.
 */
export default function DivisorExplorerBooks(props) {
  const { t } = useTranslation('lesson');
  const total = props.total ?? 420;
  const title = props.title ?? t('manipulation.bookshelf.presentTitle', { books: t('manipulation.bookshelf.books', { count: total }) });
  return (
    <ClassroomPresentation scope="manipulation" title={title} entry="none">
      <BookshelfLab {...props} />
    </ClassroomPresentation>
  );
}

const bookColor = (id) => BOOK_PALETTE[id % BOOK_PALETTE.length][0];
const bookSpine = (id) => BOOK_PALETTE[id % BOOK_PALETTE.length][1];

/** Place (px) laissée de chaque côté du rayon modèle pour la poignée. */
const EDGE = 26;
/** Hauteur des livres du rayon modèle (px) : on les voit de dos, hauts et fins. */
const MODEL_BOOK_H = 46;

function BookshelfLab({
  total: total0 = 420,
  min, max,
  marks: marks0 = [],
  level,
  levels: withLevels = true,
  discovery = 'remainder',
  title, lead, mission,
  onVerdict, onFinished, coach: coachOn = true,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.bookshelf.${key}`, o), [t]);
  const books = useCallback((n) => k('books', { count: n }), [k]);
  const { isClassroomMode: presentation, area } = useClassroomMode();

  const state = useManipulation({
    type: 'divisor-explorer-books',
    initialNumbers: { total: total0 },
    initialLevel: level,
    hintCount: 3,
    withLevels,
  });
  const { total } = state.numbers;
  // L'autre niveau (le préréglage du type) apporte sa réglette et ses marques.
  const preset = state.isAuthoredLevel ? null : state.levelPreset;
  const range = useMemo(
    () => S.shelfRange(total, preset?.range ?? { min, max }),
    [total, preset, min, max],
  );
  const marks = (preset ? preset.marks : marks0) ?? [];

  // ── L'état du laboratoire : la longueur VIVANTE et les essais VALIDÉS ──
  // Un rayon PAR DÉFAUT (jamais un diviseur de a : première longueur qui laisse des livres) : jamais vide à l'ouverture, et ce n'est pas un essai (2026-10-09).
  const [b, setB] = useState(() => S.defaultShelf(total, range));
  const [tried, setTried] = useState({});
  // Nouvelle scène (niveau, « إعادة ») : le rayon est vide. Ajusté PENDANT le
  // rendu, comme TeamBuilder — jamais une frame avec l'ancien rayon.
  const sceneKey = `${total}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  if (scene !== sceneKey) { setScene(sceneKey); setB(S.defaultShelf(total, range)); }
  // La mémoire des essais part avec « إعادة » et avec un autre stock de livres.
  const memoryKey = `${total}:${state.resetCount}`;
  const [memory, setMemory] = useState(memoryKey);
  if (memory !== memoryKey) { setMemory(memoryKey); setTried({}); }

  // Miroir synchrone des essais : « جرّب كل الإمكانيات » enchaîne des pas plus vite qu'un rendu.
  const triedRef = useRef(tried);
  triedRef.current = tried;
  const commit = useCallback((v) => {
    setB(v);
    triedRef.current = S.commit(triedRef.current, total, v);
    setTried((prev) => S.commit(prev, total, v));
    const a = S.arrange(total, v);
    state.report(onVerdict, { b: v, divides: a.exact, quotient: a.shelves, remainder: a.leftOver });
  }, [total, state, onVerdict]);

  // ── La découverte : méritée par le contraste (ou la symétrie en معارف) ──
  const pair = discovery === 'symmetry' ? S.symmetryPair(tried, total) : null;
  const ready = discovery === 'symmetry' ? pair != null : S.remainderDiscoveryReady(tried);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, { tried }); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── La place réelle : la bibliothèque se dessine pour SA largeur ──
  const boxRef = useRef(null);
  const [width, setWidth] = useState(320);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.max(200, Math.floor(el.clientWidth)));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // MODE CLASSE : le rayon qu'on tire et la bibliothèque côte à côte — sur un
  // projecteur la largeur abonde et la hauteur manque ; empilés, ils
  // débordaient de l'écran présenté. Sinon : l'un sous l'autre, pleine largeur.
  const modelW = presentation ? Math.floor(width * 0.45) : width;
  const caseW = presentation ? width - modelW - 16 : width;

  // Le rayon MODÈLE (celui qu'on tire) : un livre = `mu` px, le mur à droite.
  const mu = Math.max(3, Math.min(presentation ? 16 : 14, (modelW - 2 * EDGE) / range.max));
  const x0 = modelW - EDGE;
  const xOf = (v) => x0 - v * mu;
  const toValue = useCallback((clientX, _y, rect) => (x0 - (clientX - rect.left)) / mu, [x0, mu]);
  const stretch = useStretchInteraction({ value: b, range, toValue, onChange: setB, onCommit: commit, direction: 'rtl' });

  // MODE CLASSE — le BUDGET DE HAUTEUR de la bibliothèque. Un laboratoire
  // présenté n'est pas zoomé par la présentation : il doit tenir SEUL dans la
  // zone offerte (CLASSROOM_MODE §8). On mesure, dans la boîte de contenu de
  // la présentation, ce qui reste sous le haut de la bibliothèque une fois
  // retirés tout ce qui est dessous (rôles, bas de la scène, égalité,
  // découverte). Aucun de ces termes ne dépend de la hauteur de la
  // bibliothèque elle-même : la mesure ne s'auto-entretient pas.
  const caseRef = useRef(null);
  const rolesRef = useRef(null);
  const [budget, setBudget] = useState(null);
  useLayoutEffect(() => {
    if (!presentation) { setBudget(null); return undefined; }
    const svg = caseRef.current;
    const box = svg?.closest('.sa-classroom-content');
    const stage = svg?.closest('[data-manipulation-stage]');
    if (!svg || !box || !stage) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const br = box.getBoundingClientRect();
      const cs = getComputedStyle(box);
      const boxBottom = br.bottom - (parseFloat(cs.paddingBottom) || 0);
      const realBottom = Math.max(...[...box.children].map((c) => c.getBoundingClientRect().bottom));
      const below = realBottom - stage.getBoundingClientRect().bottom;
      const pad = parseFloat(getComputedStyle(stage).paddingBottom) || 0;
      const roles = rolesRef.current ? rolesRef.current.offsetHeight + 12 : 0;
      const h = Math.floor(boxBottom - svg.getBoundingClientRect().top - roles - pad - below - 4);
      setBudget((prev) => (prev === h ? prev : h));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(schedule);
    ro.observe(box);
    const root = svg.closest('[data-manipulation]');
    if (root) ro.observe(root);
    return () => { ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [presentation, area?.height, area?.width]);

  // Le dos d'un livre : le plus grand qui tient. En présentation, on descend
  // la taille jusqu'à ce que TOUS les rayons tiennent dans le budget — tous
  // restent dessinés, aucun n'est caché dans un défilement interne.
  const unit = useMemo(() => {
    const top = S.unitFor(caseW, range.max, { ceiling: presentation ? 11 : 7 });
    if (!presentation || budget == null) return top;
    for (let u = top; u > 2; u -= 0.5) {
      if (S.bookcaseLayout({ total, b, width: caseW, unit: u }).height <= budget) return u;
    }
    return 2;
  }, [presentation, budget, caseW, range.max, total, b]);
  const layout = S.bookcaseLayout({ total, b, width: caseW, unit });
  const a = b == null ? null : S.arrange(total, b);
  const settled = a != null && !stretch.dragging;

  // Réglette : graduation lisible pour la place disponible.
  const labelStep = [1, 2, 5, 10, 20].find((s) => s * mu >= 30) ?? 20;
  const ticks = [];
  for (let v = 0; v <= range.max; v += 1) {
    if (v % labelStep === 0 || v % 5 === 0) ticks.push(v);
  }
  const handleX = xOf(b ?? range.min);

  // ── Les conjectures fausses se réfutent par des essais RÉELS de la plage ──
  const cx = useMemo(() => S.counterExamples(total, range, marks), [total, range, marks]);
  const remainderOptions = [
    cx.even && { text: k('opt2'), why: k('why2', { b: cx.even.b, left: books(cx.even.leftOver) }) },
    { text: k('opt1', { total }), correct: true },
    cx.small && cx.big && { text: k('opt3'), why: k('why3', { small: cx.small.b, left: books(cx.small.leftOver), big: cx.big.b }) },
  ].filter(Boolean);

  // Pour la règle : un essai qui a vidé le sol, et dont le quotient est
  // lui-même une longueur que le rayon peut prendre (28 → 15).
  const exactTrial = useMemo(() => {
    const exact = Object.keys(tried).map(Number).filter((v) => tried[v].exact);
    const reachable = exact.filter((v) => total / v >= range.min && total / v <= range.max);
    const preferred = reachable.find((v) => marks.includes(v)) ?? reachable[reachable.length - 1];
    return preferred == null ? null : { b: preferred, q: total / preferred };
  }, [tried, total, range, marks]);

  const coachStep = coachOn ? S.coachOf({ tried, b, range, discovery, total }) : null;
  const coach = useLabCoach({
    lab: 'divisor-explorer-books', step: coachStep, text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });
  const hints = [k('hint1'), marks.length ? k('hint2') : k('hint2NoMarks'), k('hint3')];

  const discoveryBlock = discovery === 'symmetry' ? (
    <ManipulationDiscovery
      state={state}
      prompt={pair ? k('symPrompt', { b: pair[0], q: pair[1] }) : null}
      options={pair ? [
        { text: k('symOpt2', { b: pair[0], q: pair[1] }), why: k('symWhy2', { q: pair[1] }) },
        { text: k('symOpt1', { b: pair[0], q: pair[1], total }), correct: true },
        { text: k('symOpt3'), why: k('symWhy3', { b: pair[0], q: pair[1] }) },
      ] : []}
      formal={pair && (
        <div className="space-y-2">
          <EquationDisplay tex={`${total} = ${pair[0]} \\times ${pair[1]} = ${pair[1]} \\times ${pair[0]}`} tone="result" note={k('symFormalNote')} />
          <p className="text-sm text-slate-700">{k('conclusion')}</p>
        </div>
      )}
    />
  ) : (
    <ManipulationDiscovery
      state={state}
      prompt={k('discoverPrompt')}
      options={remainderOptions}
      formal={(
        <div className="space-y-2">
          <EquationDisplay tex={'a = b \\times q + r'} tone="result" note={k('formalNote')} />
          <p className="text-sm text-slate-700">{k('conclusion')}</p>
          {exactTrial && (
            <>
              <p className="text-sm text-slate-700">{k('quotientToo', { q: exactTrial.q, shelves: k('shelvesIn', { count: exactTrial.b }) })}</p>
              <EquationDisplay tex={`${total} = ${exactTrial.b} \\times ${exactTrial.q} = ${exactTrial.q} \\times ${exactTrial.b}`} tone="ok" />
            </>
          )}
        </div>
      )}
    />
  );

  // Le rayon modèle est moins haut en présentation : la hauteur y est comptée.
  const modelH = presentation ? 34 : MODEL_BOOK_H;
  const roles = a && (
    <DivisionRoles roles={[
      { key: 'b', text: k('roleB', { b }) },
      { key: 'q', text: k('roleQ', { q: a.shelves }) },
      { key: 'r', text: k('roleR', { r: a.leftOver, b }) },
    ]} />
  );
  // Le sol, en mots : la résistance, pas un verdict.
  const floorNote = a == null
    ? <p className="text-sm font-bold text-slate-600" data-floor-note="pile">{k('pile', { total })}</p>
    : a.exact
      ? (
        <p className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900" data-floor-note="empty">
          {k('floorEmpty')}
        </p>
      ) : (
        <p className="rounded-xl border-2 border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-900" data-floor-note="ghost">
          <span className="me-1 rounded bg-rose-600 px-1.5 py-0.5 text-xs text-white">{k('ghost')}</span>
          {k('ghostNote', { missing: books(a.missing) })}
        </p>
      );

  return (
    <ManipulationShell
      type="divisor-explorer-books"
      controller={{
        autoComplete: {
          label: t('manipulation.autoComplete.tryAll'),
          ready: true,
          remaining: Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).filter((v) => !(v in tried)).length,
          intervalMs: 480,
          maxTicks: 80,
          step: () => {
            const next = Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i).find((v) => !(v in triedRef.current));
            if (next !== undefined) commit(next);
          },
          finish: () => {
            for (let v = range.min; v <= range.max; v += 1) if (!(v in triedRef.current)) commit(v);
          },
        },
      }}
      title={title ?? k('title', { books: books(total) })}
      // Au projecteur, la consigne est DITE par l'enseignant : la place va au
      // laboratoire (il doit tenir seul dans l'écran, CLASSROOM_MODE §8).
      mission={presentation ? null : (mission ?? k('mission'))}
      lead={presentation ? null : lead}
      state={state}
      coach={coachOn ? coach : null}
      hints={hints}
      headerAction={<ClassroomEntryButton />}
      representation={settled && (
        <div className="space-y-2" data-bookshelf-verdict={a.exact ? 'exact' : 'remainder'}>
          <EquationDisplay tex={`${total} = ${b} \\times ${a.shelves} + ${a.leftOver}`} tone={a.exact ? 'ok' : 'result'} />
          {!presentation && roles}
        </div>
      )}
      discovery={discoveryBlock}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-amber-50/60 to-white" data-dragging={stretch.dragging ? 'true' : undefined}>
        <div ref={boxRef} className={presentation ? 'flex items-start gap-4' : 'space-y-3'} data-bookshelf data-presentation={presentation ? 'true' : 'false'}>
          <div className="space-y-3" style={presentation ? { width: modelW, flex: 'none' } : undefined}>
          {/* ── LE RAYON MODÈLE : la grandeur que le doigt tient ───────────── */}
          <div
            {...stretch.trackProps}
            className="relative"
            style={{ ...stretch.trackProps.style, height: modelH + 74 }}
            data-model-shelf
          >
            <svg width={modelW} height={modelH + 74} className="absolute inset-0" aria-hidden="true" focusable="false">
              {/* la zone que la réglette n'atteint pas (trop de rayons à dessiner) */}
              {range.min > 1 && (
                <rect x={xOf(range.min - 0.5)} y={modelH + 36} width={(range.min - 0.5) * mu} height={10} fill="#E2E8F0" rx={2} />
              )}
              {/* le mur et la planche */}
              <rect x={x0} y={20} width={6} height={modelH + 18} fill="#92400E" rx={1} />
              <rect x={xOf(range.max) - 6} y={modelH + 30} width={range.max * mu + 12} height={6} fill="#B45309" rx={2} />
              {/* les livres du rayon : b dos, contre le mur */}
              {b != null && Array.from({ length: b }, (_, j) => (
                <g key={j}>
                  <rect x={x0 - (j + 1) * mu + 0.4} y={30 - (j % 3) * 2} width={Math.max(1, mu - 0.8)} height={modelH + (j % 3) * 2} fill={bookColor(j)} rx={Math.min(2, mu / 4)} />
                  {mu >= 7 && <rect x={x0 - (j + 1) * mu + 0.4} y={40 - (j % 3) * 2} width={Math.max(1, mu - 0.8)} height={3} fill={bookSpine(j)} opacity={0.6} />}
                </g>
              ))}
              {/* la réglette */}
              {ticks.map((v) => (
                <g key={v}>
                  <line x1={xOf(v)} x2={xOf(v)} y1={modelH + 38} y2={modelH + (v % 10 === 0 ? 48 : 44)} stroke="#94A3B8" strokeWidth={1} />
                  {v % labelStep === 0 && v > 0 && !marks.some((m) => Math.abs(m - v) * mu < 16) && (
                    <text x={xOf(v)} y={modelH + 60} textAnchor="middle" fontSize={11} fill="#475569" fontFamily="ui-monospace, monospace">{v}</text>
                  )}
                </g>
              ))}
              {/* les nombres du manuel : des repères SUR la réglette, pas des
                  réponses. Deux repères voisins (26, 28 sur un téléphone)
                  s'écrivent en quinconce pour ne pas se chevaucher. */}
              {marks.map((m, i) => (
                <g key={`m${m}`} data-shelf-mark={m}>
                  <path d={`M ${xOf(m)} ${modelH + 37} l -4 7 h 8 z`} fill="#D97706" />
                  <text x={xOf(m)} y={modelH + (i % 2 && marks.length > 1 && Math.abs(marks[i] - marks[i - 1]) * mu < 22 ? 68 : 58)} textAnchor="middle" fontSize={11} fontWeight={800} fill="#B45309" fontFamily="ui-monospace, monospace">{m}</text>
                </g>
              ))}
              {/* le serre-livres */}
              <path
                d={`M ${handleX - 1} ${24} h -5 v ${modelH + 12} h 16 v -5 h -11 z`}
                fill={b == null ? '#94A3B8' : '#334155'}
              />
            </svg>
            {/* La poignée : 44 × 64, focalisable, un vrai curseur. */}
            <div
              {...stretch.handleProps({ label: k('handle'), valueText: b == null ? k('notSet') : k('valueText', { books: books(b) }) })}
              className={`absolute top-3 flex h-16 w-11 -translate-x-1/2 items-start justify-center rounded-xl border-2 outline-none transition-colors focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:border-slate-300'}`}
              style={{ left: handleX, cursor: stretch.dragging ? 'grabbing' : 'grab' }}
            >
              <span dir="ltr" className="-mt-3 rounded-full bg-slate-800 px-2 py-0.5 font-mono text-sm font-extrabold text-white shadow" data-shelf-capacity>
                {b ?? '?'}
              </span>
            </div>
          </div>

          {/* ── Le chemin sans glisser : − / + (la réglette se touche aussi) ── */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('shorter')} data-shelf-nudge="-1" disabled={b != null && b <= range.min}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-800 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Minus className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="min-w-[7rem] text-center text-sm font-bold text-slate-700" data-shelf-readout>
              {b == null ? k('notSet') : k('valueText', { books: books(b) })}
            </p>
            <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('longer')} data-shelf-nudge="1" disabled={b != null && b >= range.max}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-800 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* ── Les compteurs : ce qu'on voit, en nombres ─────────────────── */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold" data-bookshelf-counters>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-900">
              {k('shelvesLabel')}: <b dir="ltr" data-shelves-count>{a ? a.shelves : 0}</b>
            </span>
            <span className={`rounded-full px-3 py-1 ${a && a.exact ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
              {k('floorLabel')}: <b dir="ltr" data-floor-count>{a ? a.leftOver : total}</b>
            </span>
          </div>
          </div>

          <div className="space-y-3" style={presentation ? { width: caseW, flex: 'none' } : undefined}>
          {/* ── LA BIBLIOTHÈQUE : tous les rayons, tous les livres ─────────── */}
          <svg
            ref={caseRef}
            width={caseW} height={layout.height} viewBox={`0 0 ${caseW} ${layout.height}`}
            role="img"
            aria-label={a ? `${k('shelvesLabel')}: ${a.shelves} · ${k('floorLabel')}: ${a.leftOver}` : k('pile', { total })}
            data-bookcase data-capacity={b ?? ''} data-shelves={a ? a.shelves : 0} data-floor={a ? a.leftOver : total}
          >
            {layout.pile && (
              <g data-pile>
                {layout.pile.books.map((bk) => (
                  <rect key={bk.id} data-floor-book x={bk.x + 0.3} y={bk.y} width={Math.max(1, unit - 0.6)} height={layout.bookH} fill={bookColor(bk.id)} opacity={0.85} rx={0.8} />
                ))}
              </g>
            )}
            {layout.shelves.map((s) => (
              <g key={s.index} data-shelf>
                <rect x={s.x} y={s.y} width={layout.shelfW} height={layout.bookH + S.PLANK} fill="#FFF7ED" stroke="#E7C9A5" rx={2} />
                {s.books.map((bk) => (
                  <rect key={bk.id} data-book x={bk.x + 0.3} y={s.y + 1 + (bk.id % 3)} width={Math.max(1, unit - 0.6)} height={layout.bookH - 1 - (bk.id % 3)} fill={bookColor(bk.id)} rx={0.8} />
                ))}
                <rect x={s.x} y={s.y + layout.bookH} width={layout.shelfW} height={S.PLANK} fill="#B45309" rx={1} />
              </g>
            ))}
            {layout.ghost && (
              <g data-ghost-shelf>
                <rect x={layout.ghost.x} y={layout.ghost.y} width={layout.ghost.w} height={layout.bookH + S.PLANK} fill="#FFF1F2" stroke="#F43F5E" strokeDasharray="4 3" rx={2} />
                {layout.ghost.slots.map((x, j) => (
                  <rect key={`s${j}`} data-empty-slot x={x + 0.6} y={layout.ghost.y + 2} width={Math.max(1, unit - 1.2)} height={layout.bookH - 3} fill="none" stroke="#FDA4AF" strokeWidth={0.8} strokeDasharray="2 2" />
                ))}
                {layout.ghost.books.map((bk) => (
                  <rect key={bk.id} data-floor-book x={bk.x + 0.3} y={layout.ghost.y + 1 + (bk.id % 3)} width={Math.max(1, unit - 0.6)} height={layout.bookH - 1 - (bk.id % 3)} fill={bookColor(bk.id)} rx={0.8} />
                ))}
              </g>
            )}
          </svg>

          {/* En présentation, les rôles et le sol accompagnent la bibliothèque :
              la colonne du rayon reste courte, et l'égalité tient à l'écran. */}
          {presentation && <div ref={rolesRef} className="space-y-3">{settled && roles}{floorNote}</div>}
          {!presentation && floorNote}
          </div>
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
