import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Scissors, Hand, CheckCircle2, XCircle, Lock, Undo2, ChevronsLeftRight } from 'lucide-react';
import { resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';
import { frac, mul, fracText } from '@smarter-academy/core/arithmetic/linear.js';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useStretchInteraction from '../useStretchInteraction';
import LabFold from '../primitives/LabFold';
import { LabCard, StageFrame, PromptCard, RoundButton, VerdictBanner } from '../primitives/LabKit';
import { SvgPill } from '../primitives/SvgPill';
import { Loaf } from '../primitives/BreadFigure';
import KidFigure from '../primitives/KidFigure';
import { useLabCoach } from '../primitives/LabCoach';
import { LEVELS } from '../levels';
import * as L from '../logic/fairShare';

/**
 * fair-share — LE PARTAGE ÉQUITABLE (1AM, unité 4 « الكتابات الكسرية », درس « حاصل القسمة والكسر », manuel نشاط 1 p. 53 et
 * معارف 1 p. 55). La logique, exacte, est dans `logic/fairShare.js` (fractions du core, importées par chemin).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. Des pains sont posés pour b enfants. L'élève TIENT la PART x d'UN enfant : il tire un curseur sur une règle (glisser, toucher
 *    la règle, ← → ±1, Page ±10, boutons ronds −/+). Le labo met b parts bout à bout contre les a pains. L'élève choisit aussi la
 *    RÈGLE : le pas du curseur est un dixième, un centième, un millième de pain — ou un MORCEAU (chaque pain coupé en b morceaux).
 *    Ce n'est ni `division-jumps` (b donné, la main tient le nombre de groupes), ni `fraction-knife` (la part est fixe, la main tient
 *    le nombre de morceaux) : ici la main tient la PART, la grandeur inconnue du quotient.
 * B. Le nombre x tel que b × x = a existe pour tout a et b ≠ 0 ; il s'écrit a/b ; il n'est décimal que parfois.
 * C. Le labo juge b × x contre a : du pain reste (rose clair, un reste sur la table), du pain manque (rose pointillé au-delà du
 *    dernier pain : il n'existe pas), ou tout est partagé (les enfants sourient). La règle des morceaux n'est pas donnée : elle
 *    s'ouvre après deux essais décimaux qui n'ont pas tombé juste.
 * D. a ÷ b = a/b et b × a/b = a, écrits avec les demandes de l'élève ; la valeur décimale quand elle existe, sinon deux valeurs
 *    décimales encadrantes (SES essais) : « 0,66 est approchée, 2/3 est la valeur exacte ».
 * E. Avant la règle : le contraste 3 ÷ 4 (tombe juste en décimal) puis 2 ÷ 3 (ne tombe jamais). Les fausses conjectures
 *    (« la division décimale donne toujours la part exacte », « la fraction renversée ») sont réfutées avec SES nombres.
 *
 * FICHE (DNA §7)
 *   CONCEPT       la fraction a/b est le quotient a ÷ b : le nombre qui multiplié par b donne a
 *   OBJECT        a pains sur une table, b parts de l'élève bout à bout, une règle de la part, b enfants (KidFigure)
 *   VARIABLE      la part x d'un enfant (curseur) et la règle (pas décimal ou morceau)
 *   INVARIANT     a et b ; toutes les parts sont égales
 *   TRANSFORMATION x bouge : les b segments suivent d'un coup ; le total b × x avance
 *   CONSTRAINT    le pain ne dépasse pas la table ; on ne coupe qu'en b morceaux égaux
 *   RESISTANCE    la graduation décimale ne tombe pas juste pour 2/3, 5/6, 7/3 : il reste ou il manque un peu, toujours
 *   EVIDENCE      le reste / le manque dessinés et écrits avec les chiffres de l'élève ; les enfants réagissent
 *   CONTRAST      3 ÷ 4 puis 2 ÷ 3 (مبتدئ) ; 5 ÷ 6 puis 7 ÷ 3 (متقدم)
 *   PREDICTION    les graduations décimales ne sont pas étiquetées par la part juste ; aucune règle n'annonce le résultat
 *   DISCOVERY     « on écrit la part par une fraction : numérateur = pains, dénominateur = enfants »
 *   FORMALIZATION a ÷ b = a/b ; b × a/b = a ; décimal ou valeur approchée
 *   TRANSFER      les exercices 4–5 p. 57, معارف 1 (7/3), la banque
 *
 * « جرّب كل الإمكانيات » : NON (chaque relâchement EST la réponse de l'élève). Pas d'auto-complétion.
 *
 * LE KIT (§8ter, DNA §17) : `PromptCard` §17.9 (contexte avec les nombres, UNE question qui nomme l'état final et sa lampe, les
 * pilules de lecture), scène dans un `StageFrame`, carte de commande (règles + −/+), `VerdictBanner` à place fixe, LabCoach.
 * D'UN SEUL REGARD : `[data-fs-glance]` enveloppe consigne, scène, commandes et verdict.
 *
 * Props : `scene` ('canteen' | 'family'), `orders` [[a, b], …] (la première demande, puis le contraste), `level`, `levels`, `title`,
 * `lead`, `onTrial({ order, ruler, m, x, kind, ok })` à chaque essai VALIDÉ, `onFinished({ orders })` à la règle — par `state.report`.
 *
 * CONTRAT DOM : [data-fair-share][data-scene][data-order][data-ruler][data-solved][data-layout], [data-fs-glance],
 * [data-fs-prompt][data-lit], [data-fs-scene], [data-fs-handle] (slider), [data-fs-rulers], [data-fs-ruler=<d1|d2|d3|cut>][data-active],
 * [data-fs-less], [data-fs-more], [data-fs-read=<share|total>], [data-fs-loaf=<i>], [data-fs-share=<i>], [data-fs-gap], [data-fs-over],
 * [data-fs-kid=<i>][data-mood], [data-fs-verdict=<kind>], [data-fs-next], [data-fs-next-button], [data-fs-back], [data-fs-formal],
 * [data-lab-fold=fair-share.trials].
 */
const NS = 'manipulation.fairShare';
const WIDE_MIN = 560;
const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#F43F5E', '#0EA5E9', '#A855F7'];
const LOOKS = [
  { hairStyle: 'hijab', scarf: 'rose', outfit: 'pink', skin: 'light' },
  { hairStyle: 'short', hair: 'black', outfit: 'blue', skin: 'wheat' },
  { hairStyle: 'hijab', scarf: 'mint', outfit: 'teal', skin: 'brown' },
  { hairStyle: 'curly', hair: 'brown', outfit: 'orange', skin: 'light' },
  { hairStyle: 'hijab', scarf: 'lavender', outfit: 'violet', skin: 'wheat' },
  { hairStyle: 'short', hair: 'chestnut', outfit: 'green', skin: 'deep' },
];
const MOTION_CSS = '@keyframes fs-pop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}'
  + '@keyframes fs-hop{0%{transform:translateY(0)}45%{transform:translateY(-7px)}100%{transform:translateY(0)}}'
  + '.fs-pop{transform-box:fill-box;transform-origin:50% 50%;animation:fs-pop .28s cubic-bezier(.34,1.56,.64,1) both}'
  + '.fs-hop{animation:fs-hop .45s ease-out 1}'
  + '@media (prefers-reduced-motion: reduce){.fs-pop,.fs-hop{animation:none}}';

/** Une fraction écrite en colonne — un îlot LTR. */
function Frac({ n, d, className = '', ...rest }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono font-black leading-none tabular-nums ${className}`} dir="ltr" {...rest}>
      <span className="px-0.5">{n}</span>
      <span className="my-[2px] block h-[2px] w-full min-w-[1.1em] rounded bg-current" aria-hidden="true" />
      <span className="px-0.5">{d}</span>
    </span>
  );
}
const Row = ({ children, className = '', ...rest }) => (
  <bdi dir="ltr" className={`inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 ${className}`} {...rest}>{children}</bdi>
);
function StatPill({ label, value, tone = 'indigo', small = false, ...rest }) {
  const tones = { indigo: 'border-indigo-100 bg-white text-indigo-900', rose: 'border-rose-200 bg-rose-50 text-rose-900', emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900' };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border font-bold ${small ? 'gap-1 px-2 text-[11px]' : 'gap-1.5 px-2.5 py-0.5 text-xs'} ${tones[tone] ?? tones.indigo}`} {...rest}>
      {label}
      <span className={`font-black tabular-nums ${small ? 'text-sm' : 'text-base'}`}>{value}</span>
    </span>
  );
}

export default function FairShare({
  scene: scene0, orders: orders0, title, lead, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onTrial, onFinished, coach: coachOn = true,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`${NS}.${key}`, o), [t]);
  const preset = LEVELS['fair-share'][resolveLevelId(level ?? 'beginner')].numbers;
  const initialNumbers = useMemo(() => ({ scene: scene0 ?? preset.scene, orders: orders0 ?? preset.orders }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const state = useManipulation({ type: 'fair-share', initialNumbers, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { scene, orders } = state.numbers;
  const sceneKey = `${scene}|${JSON.stringify(orders)}|${state.epoch}`;
  const [lab, setLab] = useState(() => L.init({ orders }));
  const [seen, setSeen] = useState(sceneKey);
  if (seen !== sceneKey) { setSeen(sceneKey); setLab(L.init({ orders })); }

  const { a, b, ruler, m } = lab;
  const ready = L.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, L.finishedEvidence(lab)); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps
  const coachStep = coachOn ? L.coachOf(lab) : null;
  const coach = useLabCoach({
    lab: 'fair-share', step: coachStep, text: coachStep ? k(`coach.${coachStep.id}`) : '',
    labels: { hide: k('coach.hide'), show: k('coach.show'), ok: k('coach.ok'), stop: k('coach.stop') },
  });
  const nTrials = lab.trials.length;
  useEffect(() => { if (nTrials > 0) state.report(onTrial, L.trialEvidence(lab.trials.at(-1))); }, [nTrials]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── les noms comptés ── */
  const loaves = (n) => k('loaves', { count: n });
  const kidsOf = (n) => k(scene === 'family' ? 'persons' : 'kids', { count: n });
  const pieces = (n) => k('pieces', { count: n });
  /** Une quantité de pains : un entier se dit « 3 أرغفة », un décimal « 0,75 رغيف ». */
  const amount = (x) => (x.d === 1 ? loaves(x.n) : k('loafDec', { x: L.decimalText(x) }));

  /* ── mesure ── */
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
  const compact = width < 380;
  const tiny = width < 300;
  const wide = width >= WIDE_MIN;
  const W = Math.min(width, 760);

  /* ── la géométrie ── */
  const rail = L.railMax(a, b);
  const tbl = useMemo(() => L.tableLayout({ width: W, a, b }), [W, a, b]);
  const rl = useMemo(() => L.rulerLayout({ width: W, rail, ruler, b }), [W, rail, ruler, b]);
  const kd = useMemo(() => L.kidsLayout({ width: W, b }), [W, b]);
  const mMax = L.mMaxOf(a, b, ruler);
  const Y = compact
    ? { loaf: 33, loafH: 20, lane: 61, laneH: 18, bar: 107, barH: 18, kidTop: 147, kidFoot: 193, badge: 206, H: 220 }
    : { loaf: 34, loafH: 32, lane: 76, laneH: 26, bar: 146, barH: 24, kidTop: 212, kidFoot: 276, badge: 290, H: 304 };
  const pillSize = compact ? 10.5 : 12;

  const st = useStretchInteraction({
    value: m, range: { min: 0, max: mMax },
    toValue: (cx, cy, rect) => rl.valueAt(cx - rect.left),
    direction: 'ltr', pageStep: 10,
    onChange: (v) => setLab((s) => L.setM(s, v)),
    onCommit: (v) => setLab((s) => L.commitM(s, v)),
  });

  const v = L.shownVerdict(lab);
  const x = v ? v.x : L.judge(a, b, ruler, m).x;
  const total = mul(x, frac(b));
  const sharePill = ruler === 'cut' ? pieces(m) : L.decimalText(x);

  const verdictText = useMemo(() => {
    if (!v) return '';
    const o = { kids: kidsOf(b), per: pieces(b), pieces: pieces(v.m), share: amount(v.x), total: amount(v.total), have: loaves(a), gap: amount(v.left ?? v.missing ?? frac(0)) };
    const mode = v.ruler === 'cut' ? 'cut' : 'dec';
    return k(`v.${mode}.${v.kind}`, o);
  }, [v, scene]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── la découverte ── */
  const ref = useMemo(() => L.refutations(lab, orders.length - 1), [lab, orders]);
  const lastA = orders.at(-1)[0];
  const lastB = orders.at(-1)[1];
  const discoveryOptions = useMemo(() => {
    const o = { loaves: loaves(lastA), kids: kidsOf(lastB), a: lastA, b: lastB };
    const dec = ref.decimal;
    const inv = ref.inverse;
    return [
      {
        text: k('discovery.dec'),
        why: dec ? k(`discovery.whyDec.${dec.kind}`, { ...o, x: dec.x, total: dec.total, gap: dec.gap }) : k('discovery.whyDecNone', o),
      },
      { text: k('discovery.right'), correct: true },
      { text: k('discovery.inv'), why: k(`discovery.whyInv.${inv.kind}`, { ...o, x: inv.x, total: inv.total }) },
    ];
  }, [ref, lastA, lastB, scene]); // eslint-disable-line react-hooks/exhaustive-deps

  const formal = (
    <div className="space-y-2" data-fs-formal>
      {L.formalOf(lab).map((f) => (
        <div key={f.i} className="space-y-1 rounded-2xl border border-emerald-200 bg-white/70 p-2 text-center text-indigo-950">
          <Row className="text-base font-extrabold">
            <span className="font-mono">{f.a} ÷ {f.b}</span><span>=</span><Frac n={f.a} d={f.b} />
          </Row>
          <Row className="text-sm font-bold text-slate-700">
            <span className="font-mono">{f.b} ×</span><Frac n={f.a} d={f.b} className="text-sm" /><span>= {f.a}</span>
          </Row>
          <p className="text-sm font-bold text-emerald-900" data-fs-formal-decimal={f.decimal ?? ''}>
            {f.decimal ? k('formal.decimal', { a: f.a, b: f.b, dec: f.decimal }) : k('formal.approx', { a: f.a, b: f.b, below: f.approx.below, above: f.approx.above })}
          </p>
        </div>
      ))}
      <p className="text-sm text-emerald-900">{k('formal.rule')}</p>
    </div>
  );

  /* ── les commandes ── */
  const cutOpen = L.canCut(lab);
  const chips = L.RULERS.map((r) => {
    const locked = r === 'cut' && !cutOpen;
    const active = r === ruler;
    const dsc = L.digitsOf(r);
    return (
      <button key={r} type="button" disabled={locked} data-fs-ruler={r} data-active={active ? 'true' : 'false'} aria-pressed={active}
        aria-label={r === 'cut' ? k('ruler.cutAria', { per: pieces(b) }) : k('ruler.decAria', { x: `0,${'0'.repeat(dsc - 1)}1` })}
        onClick={() => setLab((s) => L.setRuler(s, r))}
        className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 ${tiny ? 'px-1 text-xs' : 'px-2.5 text-sm'} font-black outline-none transition-colors focus-visible:ring-4 focus-visible:ring-indigo-300 disabled:opacity-50 ${active ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_4px_0_0_#3730A3]' : 'border-indigo-100 bg-white text-indigo-900 shadow-[0_4px_0_0_#E0E3FF]'}`}>
        {r === 'cut'
          ? <>{locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Scissors className="h-4 w-4" aria-hidden="true" />}{tiny ? <bdi dir="ltr" className="tabular-nums">{b}</bdi> : <span>{pieces(b)}</span>}</>
          : <bdi dir="ltr" className="tabular-nums">{`0,${'0'.repeat(dsc - 1)}1`}</bdi>}
      </button>
    );
  });
  const less = (
    <RoundButton size={compact ? 44 : 52} onClick={() => st.nudge(-1)} disabled={m <= 0} aria-label={k('step.less')} data-fs-less>
      <Minus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
    </RoundButton>
  );
  const more = (
    <RoundButton primary size={compact ? 44 : 52} onClick={() => st.nudge(1)} disabled={m >= mMax} aria-label={k('step.more')} data-fs-more>
      <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
    </RoundButton>
  );
  const controls = (
    <LabCard className={`space-y-2 ${compact ? 'p-2' : 'p-3'}`} data-fs-controls>
      <p className={`${compact ? 'text-xs' : 'text-sm'} font-black text-indigo-950`}>{k('rulerLabel')}</p>
      <div className={`flex ${wide ? 'items-center justify-between gap-4' : 'flex-col gap-2'}`}>
        <div className={tiny ? 'grid grid-cols-4 gap-1' : `flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`} data-fs-rulers>{chips}</div>
        <div className="flex items-center justify-center gap-3" dir="ltr">
          {less}
          <div className="flex min-w-[84px] items-baseline justify-center rounded-2xl border border-indigo-100 bg-[#F5F6FF] px-3 py-1" data-fs-read="share" data-fs-count={m}>
            <bdi dir="ltr" className={`${compact ? 'text-lg' : 'text-2xl'} whitespace-nowrap font-black tabular-nums text-indigo-900`}>{sharePill}</bdi>
          </div>
          {more}
        </div>
      </div>
    </LabCard>
  );

  const verdictTone = v ? (v.ok ? 'emerald' : 'rose') : 'indigo';
  const verdictLine = (
    <VerdictBanner tone={verdictTone} icon={v ? (v.ok ? CheckCircle2 : XCircle) : Hand} size={compact ? 'xs' : 'sm'}
      className={wide ? 'min-h-[3.5rem]' : compact ? 'min-h-[3.75rem]' : 'min-h-[4.75rem]'}
      data-fs-verdict={v?.kind ?? ''}>
      <p className={v ? '' : 'font-bold text-indigo-900'}>{v ? verdictText : k('instruction')}</p>
    </VerdictBanner>
  );
  const nextCard = L.canNext(lab) && (
    <LabCard className="space-y-2 border-amber-200 bg-amber-50/70 p-3" data-fs-next>
      <p className="text-sm font-bold leading-snug text-amber-950">
        <span className="font-black">{k('next.title')}</span> {k('next.text', { loaves: loaves(lab.orders[lab.i + 1][0]), kids: kidsOf(lab.orders[lab.i + 1][1]) })}
      </p>
      <button type="button" onClick={() => setLab(L.next)} data-fs-next-button
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 px-3 text-sm font-black text-amber-950 shadow-[0_4px_0_0_#D97706] outline-none transition-transform active:translate-y-0.5 active:shadow-none focus-visible:ring-4 focus-visible:ring-amber-300 motion-reduce:transition-none">
        {k('next.button')}
      </button>
    </LabCard>
  );
  const backButton = lab.i > 0 && (
    <button type="button" onClick={() => setLab((s) => L.back(s))} data-fs-back
      className="inline-flex min-h-[44px] items-center gap-1 rounded-full border-2 border-indigo-100 bg-white px-3 text-xs font-bold text-indigo-800">
      <Undo2 className="h-4 w-4" aria-hidden="true" /> {k('back', { loaves: loaves(lab.orders[lab.i - 1][0]), kids: kidsOf(lab.orders[lab.i - 1][1]) })}
    </button>
  );

  const readingPills = (
    <div className="flex flex-wrap items-center gap-1.5" data-fs-reading>
      <StatPill small={compact} label={k('read.share')} value={sharePill} data-fs-read="share-pill" />
      <StatPill small={compact} label={k('read.total')} value={amount(total)} tone={v ? (v.ok ? 'emerald' : 'rose') : 'indigo'} data-fs-read="total" />
    </div>
  );

  /* ── la scène ── */
  const mood = v?.kind === 'exact' ? 'proud' : v?.kind === 'over' ? 'wonder' : v ? 'neutral' : 'happy';
  const showGap = v && v.kind === 'short';
  const showOver = v && v.kind === 'over';
  const xv = x.n / x.d;
  const totalPx = tbl.total(xv);
  const kidH = Y.kidFoot - Y.kidTop;
  const kidScale = Math.min(1, (kd.slot * 1.55) / kidH);
  const kH = Math.max(compact ? 38 : 46, kidH * kidScale);
  const handleX = rl.handleX(m);
  const handleY = Y.bar + Y.barH / 2;
  const barEnd = rl.xAt(rail);
  const sceneNode = (
    <StageFrame className="overflow-hidden" style={{ width: W, height: Y.H }} data-fs-scene data-fs-rail={rail}>
      <svg width={W} height={Y.H} className="absolute inset-0" style={{ direction: 'ltr' }} role="img" aria-label={k('sceneAria', { a, b, kids: kidsOf(b) })}>
        {/* la table : un plateau de bois, le drapeau du dernier pain */}
        <rect x={tbl.x0 - 6} y={Y.loaf + Y.loafH + 2} width={tbl.tableEnd - tbl.x0 + 12} height={8} rx={3} fill="#D9BE90" stroke="#B89460" />
        {Array.from({ length: a }, (_, i) => (
          <Loaf key={i} x={tbl.loaf(i).x + 1} y={Y.loaf} w={tbl.u - 2} h={Y.loafH} cuts={ruler === 'cut' ? b : 1} data-fs-loaf={i} />
        ))}
        <g aria-hidden="true">
          <line x1={tbl.tableEnd} x2={tbl.tableEnd} y1={Y.loaf - 8} y2={Y.lane + Y.laneH + 4} stroke="#9F1239" strokeWidth={2} strokeDasharray="4 3" />
        </g>
        <SvgPill x={Math.min(W - 30, tbl.tableEnd)} y={Y.loaf - 12} pointer="down" text={loaves(a)} size={pillSize} fill="#E11D48" data-fs-flag={a} />

        {/* les parts de l'élève, bout à bout sous les pains */}
        <rect x={tbl.x0} y={Y.lane} width={tbl.x1 - tbl.x0} height={Y.laneH} rx={6} fill="#EEF0FF" opacity={0.7} />
        {xv > 0 && Array.from({ length: b }, (_, i) => {
          const seg = tbl.share(i, xv);
          const w = seg.x1 - seg.x0;
          const out = seg.x0 >= tbl.tableEnd - 0.5;
          return (
            <g key={`${i}-${m}-${ruler}`} data-fs-share={i} data-over={seg.x1 > tbl.tableEnd + 0.5 ? 'true' : undefined}>
              <rect x={seg.x0 + 0.8} y={Y.lane + 2} width={Math.max(1, w - 1.6)} height={Y.laneH - 4} rx={5}
                fill={out ? '#FFE4E6' : COLORS[i % COLORS.length]} fillOpacity={out ? 0.9 : 0.85} stroke={out ? '#E11D48' : COLORS[i % COLORS.length]} strokeWidth={1.2} strokeDasharray={out ? '4 3' : undefined} />
              {w >= 16 && (
                <text x={seg.x0 + w / 2} y={Y.lane + Y.laneH / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={out ? '#BE123C' : '#FFFFFF'}
                  style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{i + 1}</text>
              )}
            </g>
          );
        })}
        {showGap && totalPx < tbl.tableEnd - 0.5 && (
          <rect x={totalPx} y={Y.lane + 2} width={tbl.tableEnd - totalPx} height={Y.laneH - 4} rx={3} fill="#FFE4E6" stroke="#E11D48" strokeWidth={1.4} data-fs-gap />
        )}
        {showOver && totalPx > tbl.tableEnd + 0.5 && (
          <line x1={tbl.tableEnd} x2={totalPx} y1={Y.lane + Y.laneH + 5} y2={Y.lane + Y.laneH + 5} stroke="#E11D48" strokeWidth={4} strokeLinecap="round" strokeDasharray="3 3" data-fs-over />
        )}

        {/* la règle de la part : des pains mis bout à bout, ses graduations, le morceau */}
        {Array.from({ length: rail }, (_, i) => (
          <Loaf key={i} x={rl.xAt(i)} y={Y.bar} w={rl.u} h={Y.barH} cuts={ruler === 'cut' ? b : 1} data-fs-rail-loaf={i} />
        ))}
        {xv > 0 && <rect x={rl.x0} y={Y.bar} width={Math.max(0, handleX - rl.x0)} height={Y.barH} rx={5} fill={COLORS[0]} opacity={0.38} aria-hidden="true" />}
        {rl.ticks.map((tk) => (
          <g key={tk.j} aria-hidden="true">
            <line x1={tk.x} x2={tk.x} y1={Y.bar + Y.barH} y2={Y.bar + Y.barH + (tk.major ? 8 : 4)} stroke="#64748B" strokeWidth={tk.major ? 1.5 : 0.9} />
            {tk.label != null && (
              <text x={tk.x} y={Y.bar + Y.barH + 20} textAnchor="middle" fontSize={compact ? 10 : 11} fontWeight={700} fill="#475569" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{tk.label}</text>
            )}
          </g>
        ))}
        <SvgPill x={Math.max(26, Math.min(W - 26, handleX))} y={Y.bar - 4} pointer="down" text={sharePill} size={pillSize} fill="#4F46E5" data-fs-handle-pill />

        {/* les enfants */}
        {Array.from({ length: b }, (_, i) => {
          const cx = kd.cx(i);
          const top = Y.kidFoot - kH;
          return (
            <g key={i} data-fs-kid={i} data-mood={mood} className={v?.kind === 'exact' ? 'fs-hop' : undefined}>
              <KidFigure cx={cx} top={top} foot={Y.kidFoot} mood={mood} {...LOOKS[i % LOOKS.length]} />
              <circle cx={cx} cy={Y.badge} r={8} fill={COLORS[i % COLORS.length]} />
              <text x={cx} y={Y.badge + 3.8} textAnchor="middle" fontSize={11} fontWeight={800} fill="#FFFFFF" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{i + 1}</text>
            </g>
          );
        })}
      </svg>
      {/* la règle est la PISTE : toucher y pose le curseur ; le curseur est au bout de la part */}
      <div {...st.trackProps} className="absolute inset-x-0" style={{ ...st.trackProps.style, top: Y.bar - 22, height: Y.barH + 44 }}>
        <div {...st.handleProps({ label: k('handle'), valueText: k('handleValue', { share: sharePill }) })} data-fs-handle
          className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none"
          style={{ left: Math.min(barEnd + 8, handleX), top: handleY - (Y.bar - 22), cursor: st.dragging ? 'grabbing' : 'grab' }}>
          <span className={`flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-indigo-500 bg-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.9)] transition-transform group-focus-visible:ring-4 group-focus-visible:ring-indigo-300 motion-reduce:transition-none ${st.dragging ? 'scale-110' : ''}`}>
            <ChevronsLeftRight className="h-5 w-5 text-indigo-600" strokeWidth={2.6} aria-hidden="true" />
          </span>
        </div>
      </div>
    </StageFrame>
  );

  const ctxArgs = { loaves: loaves(a), kids: kidsOf(b) };
  return (
    <ManipulationShell
      type="fair-share"
      title={title ?? k('title')}
      titleHidden
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      coach={coachOn ? coach : null}
      hints={[0, 1, 2].map((i) => k(`hints.${i}`))}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      discovery={<ManipulationDiscovery state={state} prompt={k('discovery.prompt', { loaves: loaves(lastA), kids: kidsOf(lastB) })} options={discoveryOptions} formal={formal} />}
      explanation={k('explanation')}
    >
      <ManipulationStage className="bg-gradient-to-b from-indigo-50/40 to-white">
        <div ref={boxRef} className="space-y-2" data-fair-share data-scene={scene} data-order={`${a}/${b}`} data-ruler={ruler}
          data-solved={ready ? 'true' : 'false'} data-layout={wide ? 'wide' : 'narrow'}>
          <style dangerouslySetInnerHTML={{ __html: MOTION_CSS }} />
          <div className="space-y-2" data-fs-glance>
            <PromptCard
              size={compact ? 'md' : 'lg'}
              context={(state.isAuthoredLevel && lab.i === 0 && lead) || k(`context.${scene}`, ctxArgs)}
              contextProps={{ 'data-fs-context': scene }}
              aside={compact ? null : readingPills}
              title={<span className={tiny ? 'text-[15px] leading-snug' : compact ? 'text-base' : ''}>{k('question')}</span>}
              lamp={v?.kind === 'exact' ? 'on' : 'off'}
              titleProps={{ 'data-fs-prompt': true, 'data-lit': v?.kind === 'exact' ? 'true' : 'false' }}
            />
            {sceneNode}
            {controls}
            <div className={wide ? 'flex items-start gap-3' : 'space-y-2'}>
              <div className="min-w-0 flex-1">{verdictLine}</div>
              {(nextCard || backButton) && <div className="space-y-2" style={wide ? { width: 250 } : undefined}>{nextCard}{backButton}</div>}
            </div>
          </div>
          {lab.trials.length > 0 && (
            <LabFold id="fair-share.trials" title={k('trialsTitle')}>
              <ul className="space-y-0.5 text-xs" data-fs-trials={lab.trials.length}>
                {lab.trials.map((tr, i) => (
                  <li key={i} className={tr.ok ? 'text-emerald-800' : 'text-rose-800'} data-ok={String(tr.ok)}>
                    {k('trial', { order: `${tr.a} ÷ ${tr.b}`, x: tr.ruler === 'cut' ? pieces(tr.m) : tr.x, word: k(`kind.${tr.kind}`) })}
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
