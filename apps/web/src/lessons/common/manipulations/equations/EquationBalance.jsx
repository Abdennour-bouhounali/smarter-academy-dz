import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Scissors, SearchCheck } from 'lucide-react';
import ManipulationShell from '../ManipulationShell';
import ManipulationStage from '../ManipulationStage';
import ManipulationDiscovery from '../ManipulationDiscovery';
import { useManipulation } from '../useManipulation';
import useDragInteraction from '../useDragInteraction';
import useStretchInteraction from '../useStretchInteraction';
import DraggableObject from '../primitives/DraggableObject';
import DropZone from '../primitives/DropZone';
import EquationDisplay from '../primitives/EquationDisplay';
import MathText from '../../components/MathText';
import { bidi } from '../../../../utils/bidi';
import * as B from '../logic/equationBalance';

/**
 * equation-balance — LA BALANCE DU VESTIAIRE (unité 4 « معادلات ومتراجحات من الدرجة الأولى
 * بمجهول واحد », leçon « حل معادلة من الدرجة الأولى بمجهول واحد »).
 *
 * LES CINQ QUESTIONS (MANIPULATION_CONTRACT §1)
 * A. L'élève PORTE des objets sur les plateaux d'une balance (ballons +1, baudruches −1,
 *    sacs fermés de x ballons, « sacs volants » −x) ou les en RETIRE vers la réserve ;
 *    puis il ÉTIRE k, le nombre de parts égales de chaque plateau. Toucher-toucher et
 *    clavier font les mêmes gestes.
 * B. Idée : une équation est une balance en équilibre ; on obtient une équation
 *    ÉQUIVALENTE en faisant la MÊME opération sur les deux membres (ajouter, retrancher,
 *    diviser par k ≠ 0), jusqu'à la forme ax = b, puis x = b/a.
 * C. Le fléau penche (selon le VRAI contenu caché des sacs) dès qu'un seul plateau
 *    change ; il revient à l'horizontale quand l'autre a reçu la même chose ; un ballon
 *    et une baudruche s'annulent sur un plateau.
 * D. Sous la balance s'écrit, après chaque étape faite des deux côtés, la ligne
 *    d'opération du manuel (« 9x + 1 − 1 = −26 − 1 ») puis « أي 9x = −27 ».
 * E. À découvrir avant la règle : on garde l'équilibre en faisant la même chose aux deux
 *    plateaux — un geste d'un seul côté fait pencher (vu), une balance résolue puis
 *    vérifiée par substitution (les sacs ouverts) le confirment.
 *
 * FICHE (MANIPULATION_DNA §7)
 *   CONCEPT        équations équivalentes : même opération sur les deux membres → ax = b → b/a
 *   OBJECT         une balance de Roberval dans le vestiaire, ses deux plateaux
 *   VARIABLE       le CONTENU de chaque plateau (objets portés / retirés) ; k, le nombre de parts
 *   INVARIANT      le contenu caché d'un sac (la solution) ; l'équilibre après chaque étape
 *   TRANSFORMATION l'équation écrite sous la balance, ligne après ligne
 *   CONSTRAINT     tant que le fléau penche, seul le même effet (ou se reprendre) est accepté
 *   RESISTANCE     le fléau PENCHE (« الميزان مال: ما فعلته بكفّة افعله بالأخرى ») ; porter un objet
 *                  d'un plateau à l'autre est refusé (il change les deux plateaux en sens
 *                  contraires) ; 9 sacs ne se partagent pas en 4 parts égales (9 = 4 × 2 + 1, le sac
 *                  restant dessiné en rose)
 *   EVIDENCE       le fléau horizontal, la liste d'équations, les sacs ouverts : 9 × (−3) + 1 = −26
 *   CONTRAST       un geste d'un seul côté (fléau penché) ET une balance résolue et vérifiée
 *   PREDICTION     « combien pèse un sac ? » — les ballons d'une part, avant d'ouvrir les sacs
 *   DISCOVERY      « نجري العملية نفسها على الطرفين » — choisie parmi des conjectures réfutables
 *   FORMALIZATION  معارف 1 (p. 46) : ax = b, a ≠ 0, a pour solution unique b/a
 *   TRANSFER       طرائق p. 47 (2x − 5 = 8 ; 2,5x + 4,6 = 1,3x − 0,2), تمارين 1–9 p. 50
 *
 * AUTO-COMPLÉTION : NON (§6bis). Chaque geste est une décision (quoi retirer, de quel
 * côté, combien de parts) : « compléter » voudrait dire « résoudre à la place de l'élève ».
 *
 * DÉCOR (demande du propriétaire) : un ballon posé au sol du vestiaire que l'on peut taper
 * (il rebondit). Il ne porte AUCUNE information, est `aria-hidden`, hors du clavier
 * (`tabIndex=-1`), ne touche jamais l'état du laboratoire, et `prefers-reduced-motion`
 * l'immobilise.
 */

// ── Géométrie de la scène (unités du viewBox) ────────────────────────────
const W = 640;
const PIVOT = 320;
const ARM = 210;
const PW = 200; // largeur d'un plateau
const CX = { L: PIVOT - ARM, R: PIVOT + ARM };
const KINDS = ['bag', 'anti', 'ball', 'balloon'];

/**
 * La géométrie du fléau pour un déplacement s des plateaux (s > 0 : le plateau GAUCHE descend
 * de s, le droit monte de s). En SVG un angle positif tourne dans le sens horaire et abaisse
 * l'extrémité DROITE : le fléau prend donc −atan(s / ARM), pour que chaque extrémité suive sa
 * tige (ARM·sin θ ≈ s). Le signe a été inversé à la première version (vu par le propriétaire).
 */
export function beamGeometry(s) {
  const angle = -(Math.atan2(s, ARM) * 180) / Math.PI;
  const rad = (angle * Math.PI) / 180;
  return { angle, leftEndDy: -ARM * Math.sin(rad), rightEndDy: ARM * Math.sin(rad) };
}

/** La place de chaque objet sur un plateau (coordonnées locales : origine au centre du plateau, y vers le haut négatif). */
export function layoutPan(c) {
  const ground = [
    ...Array.from({ length: c.bags }, () => 'bag'),
    ...Array.from({ length: c.balls }, () => 'ball'),
    ...(c.part && !c.part.negative ? ['partBall'] : []),
  ];
  const float = [
    ...Array.from({ length: c.antis }, () => 'anti'),
    ...Array.from({ length: c.balloons }, () => 'balloon'),
    ...(c.part && c.part.negative ? ['partBalloon'] : []),
  ];
  const place = (list, cell, yStart) => {
    const cols = Math.max(1, Math.floor(PW / cell));
    const rows = Math.ceil(list.length / cols);
    const items = list.map((kind, i) => {
      const row = Math.floor(i / cols); const col = i % cols;
      const inRow = Math.min(cols, list.length - row * cols);
      const x0 = -(inRow * cell) / 2 + cell / 2;
      return { kind, x: x0 + col * cell, y: yStart - cell / 2 - row * cell, size: cell };
    });
    return { items, h: rows * cell };
  };
  const gCell = ground.length <= 28 ? 30 : ground.length <= 45 ? 22 : 18;
  const g = place(ground, gCell, -4);
  const fCell = float.length <= 32 ? 26 : float.length <= 50 ? 20 : 16;
  const fStart = -4 - g.h - (float.length ? 34 : 0);
  const f = place(float, fCell, fStart);
  return { ground: g.items, float: f.items, height: 4 + g.h + (float.length ? 34 + f.h : 0), knotY: -4 - g.h - 8 };
}

/* ── Les objets dessinés ───────────────────────────────────────────────── */
function Bag({ x, y, s, anti = false }) {
  const w = s * 0.82; const h = s * 0.86;
  return (
    <g transform={`translate(${x} ${y})`}>
      {anti && <ellipse cx={0} cy={-h / 2 - s * 0.18} rx={s * 0.16} ry={s * 0.2} fill="#FB7185" stroke="#BE123C" strokeWidth={1} />}
      <path d={`M${-w * 0.28} ${-h * 0.38} Q${-w / 2} ${-h * 0.1} ${-w / 2} ${h * 0.22} Q${-w / 2} ${h / 2} 0 ${h / 2} Q${w / 2} ${h / 2} ${w / 2} ${h * 0.22} Q${w / 2} ${-h * 0.1} ${w * 0.28} ${-h * 0.38} Z`}
        fill={anti ? '#FFE4E6' : '#B45309'} stroke={anti ? '#BE123C' : '#78350F'} strokeWidth={1.4} strokeDasharray={anti ? '3 2' : undefined} />
      <rect x={-w * 0.2} y={-h * 0.48} width={w * 0.4} height={h * 0.12} rx={2} fill={anti ? '#FDA4AF' : '#92400E'} />
      <text x={0} y={h * 0.26} textAnchor="middle" fontSize={s * 0.36} fontWeight="bold" fill={anti ? '#9F1239' : '#FEF3C7'} fontFamily="ui-monospace, monospace">{anti ? '−x' : 'x'}</text>
    </g>
  );
}
function Ball({ x, y, s, frac: part }) {
  const r = s * 0.4;
  return (
    <g transform={`translate(${x} ${y})`}>
      {part ? (
        <>
          <circle r={r} fill="#fff" stroke="#94A3B8" strokeDasharray="3 2" />
          <path d={pie(r, part.n / part.d)} fill="#F1F5F9" stroke="#0F172A" strokeWidth={1.2} />
        </>
      ) : (
        <>
          <circle r={r} fill="#fff" stroke="#0F172A" strokeWidth={1.2} />
          <path d={`M0 ${-r * 0.42} L${r * 0.4} ${-r * 0.13} L${r * 0.25} ${r * 0.36} L${-r * 0.25} ${r * 0.36} L${-r * 0.4} ${-r * 0.13} Z`} fill="#0F172A" />
        </>
      )}
    </g>
  );
}
function Balloon({ x, y, s, frac: part }) {
  const rx = s * 0.32; const ry = s * 0.4;
  return (
    <g transform={`translate(${x} ${y})`}>
      {part ? (
        <>
          <ellipse rx={rx} ry={ry} fill="#fff" stroke="#FDA4AF" strokeDasharray="3 2" />
          <path d={pie(Math.min(rx, ry), part.n / part.d)} fill="#F43F5E" stroke="#BE123C" strokeWidth={1} />
        </>
      ) : (
        <ellipse rx={rx} ry={ry} fill="#F43F5E" stroke="#BE123C" strokeWidth={1} />
      )}
      <path d={`M-2 ${ry} L2 ${ry} L0 ${ry + 3} Z`} fill="#BE123C" />
    </g>
  );
}
/** Un secteur de disque : la PART d'un ballon (1/2, 1/7 …). */
function pie(r, f) {
  if (f >= 1) return `M${-r} 0 A${r} ${r} 0 1 1 ${r} 0 A${r} ${r} 0 1 1 ${-r} 0 Z`;
  const a = 2 * Math.PI * f;
  const x = r * Math.sin(a); const y = -r * Math.cos(a);
  return `M0 0 L0 ${-r} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
}
function Item({ it, part }) {
  if (it.kind === 'bag') return <Bag x={it.x} y={it.y} s={it.size} />;
  if (it.kind === 'anti') return <Bag x={it.x} y={it.y} s={it.size} anti />;
  if (it.kind === 'ball') return <Ball x={it.x} y={it.y} s={it.size} />;
  if (it.kind === 'partBall') return <Ball x={it.x} y={it.y} s={it.size} frac={part} />;
  if (it.kind === 'partBalloon') return <Balloon x={it.x} y={it.y} s={it.size} frac={part} />;
  return <Balloon x={it.x} y={it.y} s={it.size} />;
}
/** Une icône seule (réserve, parts) : un petit SVG. */
function Icon({ kind, size = 30 }) {
  const it = { kind, x: size / 2, y: size / 2 + (kind === 'anti' ? 3 : 0), size: size * 0.95 };
  return <svg width={size} height={size} aria-hidden="true" focusable="false"><Item it={it} /></svg>;
}

export default function EquationBalance({
  eq: eq0 = '3x+2=11', title, lead, mission, level, levels: withLevels = true,
  initialMode = 'student', allowModeSwitch = false, onFinished, onTrial,
}) {
  const { t } = useTranslation('lesson');
  const k = useCallback((key, o) => t(`manipulation.equationBalance.${key}`, o), [t]);
  const state = useManipulation({ type: 'equation-balance', initialNumbers: { eq: eq0 }, initialMode, initialLevel: level, withLevels, hintCount: 3 });
  const { eq } = state.numbers;

  const sceneKey = `${eq}:${state.epoch}`;
  const [scene, setScene] = useState(sceneKey);
  const [lab, setLab] = useState(() => B.init(eq0));
  const [notice, setNotice] = useState(null);
  const [parts, setParts] = useState(1);
  const [liveParts, setLiveParts] = useState(null);
  const [hop, setHop] = useState(0);
  if (scene !== sceneKey) { setScene(sceneKey); setLab(B.init(eq)); setNotice(null); setParts(1); setLiveParts(null); }

  const ready = B.discoveryReady(lab);
  useEffect(() => { if (ready) state.discover(); }, [ready, state.epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.isFormal) state.report(onFinished, eq); }, [state.isFormal]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = (l) => ({
    steps: B.steps(l), solved: B.isSolved(l), value: B.isSolved(l) ? B.fracText(B.readValue(l)) : null,
    valueTex: B.isSolved(l) ? B.fracLatex(B.readValue(l)) : null, verified: l.verified, tippedSeen: l.tippedSeen,
    equation: B.equationTex(l.start),
  });
  const commit = (next) => {
    const grew = next.history.length !== lab.history.length || next.verified !== lab.verified;
    setLab(next);
    if (grew) state.report(onTrial, summary(next));
  };

  /* ── porter ── */
  const side = (zone) => zone.slice(4);
  const accepts = (src, zone) => {
    if (src.startsWith('r:') && zone.startsWith('pan:')) { const v = B.canGesture(lab, side(zone), `add:${src.slice(2)}`); return v === true ? true : v; }
    if (src.startsWith('p:') && zone === 'reserve') { const [, s, kind] = src.split(':'); const v = B.canGesture(lab, s, `remove:${kind}`); return v === true ? true : v; }
    if (src.startsWith('p:') && zone.startsWith('pan:')) return src.split(':')[1] === side(zone) ? '' : 'moveAcross';
    return '';
  };
  const drag = useDragInteraction({
    accepts,
    onDrop: (src, zone) => {
      const next = src.startsWith('r:')
        ? B.gesture(lab, side(zone), `add:${src.slice(2)}`)
        : B.gesture(lab, src.split(':')[1], `remove:${src.split(':')[2]}`);
      setNotice(next.pending ? { tone: 'tip', key: 'tipped', d: B.tippedDetails(next) }
        : next.zero ? { tone: 'info', key: next.zero.kind === 'bag' ? 'zeroBag' : 'zeroUnit' }
          : next.history.length > lab.history.length ? { tone: 'ok', key: 'balanced' } : null);
      commit(next);
    },
    onReject: (_s, _z, reason) => {
      if (reason === 'tipped') setLab((l) => ({ ...l, refusals: l.refusals + 1 }));
      setNotice(reason ? { tone: 'ko', key: reason, d: B.tippedDetails(lab) } : null);
    },
  });
  // Toucher un objet d'un plateau en TENANT un objet de la réserve, c'est viser ce plateau
  // (et toucher un objet de la réserve en tenant un objet d'un plateau, c'est viser la réserve).
  const targetFor = (id) => {
    const held = drag.held;
    if (!held || drag.dragging || held === id) return null;
    if (held.startsWith('r:') && id.startsWith('p:')) return `pan:${id.split(':')[1]}`;
    if (held.startsWith('p:') && id.startsWith('r:')) return 'reserve';
    return null;
  };
  const intercept = (id) => ({
    onPointerDownCapture: (e) => { if (targetFor(id)) { e.stopPropagation(); e.preventDefault(); } },
    onPointerUpCapture: (e) => { if (targetFor(id)) { e.stopPropagation(); e.preventDefault(); } },
    onClickCapture: (e) => { const z = targetFor(id); if (z) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); } },
    onKeyDownCapture: (e) => { const z = targetFor(id); if (z && (e.key === 'Enter' || e.key === ' ')) { e.stopPropagation(); e.preventDefault(); drag.dropHere(z); } },
  });

  /* ── partager : k parts ── */
  const kMax = 12;
  const kk = liveParts ?? parts;
  const divOk = B.canDivide(lab, kk);
  const stretch = useStretchInteraction({
    value: kk, range: { min: 1, max: kMax },
    toValue: (clientX, _y, rect) => 1 + ((clientX - rect.left - 22) / Math.max(1, rect.width - 44)) * (kMax - 1),
    onChange: setLiveParts,
    onCommit: (v) => {
      setLiveParts(null); setParts(v);
      const verdict = B.canDivide(lab, v);
      setNotice(verdict === true || !verdict.reason ? null : { tone: 'ko', key: verdict.reason, d: verdict });
    },
    direction: 'ltr',
  });
  const doDivide = () => {
    if (B.canDivide(lab, parts) !== true) return;
    const next = B.divide(lab, parts);
    setParts(1);
    setNotice(B.isSolved(next) ? { tone: 'ok', key: 'oneBag', v: B.fracLatex(B.readValue(next)) } : { tone: 'ok', key: 'divided' });
    commit(next);
  };
  const doVerify = () => { const next = B.verify(lab); setNotice(null); commit(next); };

  /* ── la scène ── */
  const counts = { L: B.drawCounts(lab.pans.L), R: B.drawCounts(lab.pans.R) };
  const lay = { L: layoutPan(counts.L), R: layoutPan(counts.R) };
  const contentH = Math.max(150, lay.L.height, lay.R.height);
  const SWING = 22;
  const plateY = 18 + contentH + SWING;
  const beamY = plateY + 46;
  const H = beamY + 86;
  const tilt = B.tilt(lab);
  const diff = B.toNumber(B.weight(lab, 'L')) - B.toNumber(B.weight(lab, 'R'));
  const s = tilt === 0 ? 0 : Math.sign(diff) * Math.min(SWING, 9 + Math.abs(diff) * 1.5);
  const py = { L: plateY + s, R: plateY - s };
  const { angle } = beamGeometry(s);

  const boxOf = (sd, kind) => {
    const items = [...lay[sd].ground, ...lay[sd].float].filter((it) => it.kind === kind || it.kind === `part${kind[0].toUpperCase()}${kind.slice(1)}`);
    if (!items.length) return null;
    const xs = items.map((it) => CX[sd] + it.x); const ys = items.map((it) => py[sd] + it.y);
    const pad = items[0].size / 2;
    return { x0: Math.min(...xs) - pad, x1: Math.max(...xs) + pad, y0: Math.min(...ys) - pad, y1: Math.max(...ys) + pad };
  };
  const pct = (v, total) => `${(v / total) * 100}%`;
  const has = (sd, kind) => {
    const c = counts[sd];
    return { bag: c.bags > 0, anti: c.antis > 0, ball: c.balls > 0, balloon: c.balloons > 0 }[kind];
  };
  const panWords = (sd) => {
    const c = counts[sd]; const p = lab.pans[sd];
    const words = [];
    if (c.bags) words.push(k('nBags', { count: c.bags }));
    if (c.antis) words.push(k('nAntis', { count: c.antis }));
    if (c.balls || (c.part && !c.part.negative)) words.push(k('unitsBalls', { v: B.fracText(p.u).replace('-', '') }));
    if (c.balloons || (c.part && c.part.negative)) words.push(k('unitsBalloons', { v: B.fracText(p.u).replace('-', '') }));
    return words.length ? words.join(k('and')) : k('emptyPan');
  };

  const steps = B.steps(lab);
  const solved = B.isSolved(lab);
  const sub = solved ? B.substitution(lab) : null;
  const groups = kk >= 2 ? B.groupsOf(lab, kk) : null;

  const noticeText = (n) => {
    if (!n) return null;
    const d = n.d ?? {};
    switch (n.key) {
      case 'tipped': return k('tipped', { effect: k(`eff${d.effect?.replace('+', 'P').replace('-', 'M')}`), side: k(d.missing === 'L' ? 'sideL' : 'sideR') });
      case 'moveAcross': return k('moveAcross');
      case 'noneHere': return k('noneHere');
      case 'full': return k('full');
      case 'bagsUneven': return k('bagsUneven', { n: d.n, k: d.k, q: d.q, r: d.r, side: k(d.side === 'L' ? 'sideL' : 'sideR') });
      case 'cutMixed': return k('cutMixed', { k: d.k, side: k(d.side === 'L' ? 'sideL' : 'sideR') });
      case 'noBags': return k('noBags');
      case 'zeroUnit': return k('zeroUnit');
      case 'zeroBag': return k('zeroBag');
      case 'balanced': return k('balanced');
      case 'divided': return k('divided');
      case 'oneBag': return k('oneBag', { v: n.v });
      default: return null;
    }
  };
  const toneClass = { ko: 'text-rose-800', tip: 'text-amber-800', ok: 'text-emerald-800', info: 'text-sky-800' };
  const last = steps.at(-1);

  return (
    <ManipulationShell
      type="equation-balance"
      title={bidi(title ?? k('title'))}
      mission={mission ?? <MathText>{k('mission', { eq: B.equationTex(lab.start) })}</MathText>}
      lead={typeof lead === 'string' ? bidi(lead) : lead}
      state={state}
      allowModeSwitch={allowModeSwitch}
      allowFreeLab={false}
      hints={[k('hint1'), k('hint2'), k('hint3')].map((h) => <MathText key={h}>{h}</MathText>)}
      controller={{ autoStep: () => false, canAutoStep: () => false }}
      representation={last && (
        <EquationDisplay tone={solved ? 'ok' : 'neutral'} tex={last.result} note={<MathText>{k('equivalentNote')}</MathText>} />
      )}
      discovery={(
        <ManipulationDiscovery
          state={state}
          prompt={k('discoveryPrompt')}
          options={[
            { text: <MathText>{k('opt2')}</MathText>, why: <MathText>{k('why2')}</MathText> },
            { text: <MathText>{k('opt1')}</MathText>, correct: true },
            { text: <MathText>{k('opt3')}</MathText>, why: <MathText>{k('why3')}</MathText> },
          ]}
          formal={(
            <div className="space-y-2" data-balance-formal>
              <EquationDisplay tone="result" tex={k('rule')} note={<MathText>{k('ruleNote')}</MathText>} />
              {sub && <EquationDisplay tone="neutral" tex={`${B.equationTex(lab.start)} \\;\\Rightarrow\\; x = ${B.fracLatex(sub.x)}`} note={<MathText>{k('yourCase')}</MathText>} />}
            </div>
          )}
        />
      )}
      explanation={<MathText>{k('explanation')}</MathText>}
    >
      <ManipulationStage className="bg-gradient-to-b from-sky-50/70 to-white" data-dragging={drag.dragging || stretch.dragging ? 'true' : undefined}>
        <div className="space-y-3" data-equation-balance data-eq={eq} data-tilt={tilt} data-solved={String(solved)}>
          {/* ── la balance ── */}
          <div className="mx-auto w-full max-w-[720px]" dir="ltr">
            <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} data-balance-scene>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
                {/* vestiaire : mur, casiers, sol */}
                <rect x={0} y={0} width={W} height={H} fill="#F8FAFC" />
                {Array.from({ length: 8 }, (_, i) => (
                  <g key={i} opacity={0.5}>
                    <rect x={8 + i * 79} y={6} width={70} height={Math.min(120, H * 0.35)} rx={4} fill="#E0F2FE" stroke="#BAE6FD" />
                    <circle cx={8 + i * 79 + 60} cy={6 + Math.min(120, H * 0.35) / 2} r={2.5} fill="#7DD3FC" />
                  </g>
                ))}
                <rect x={0} y={H - 24} width={W} height={24} fill="#CBD5E1" />
              </svg>
              {/* zones des plateaux (sous les objets saisissables) */}
              {B.SIDES.map((sd) => (
                <div key={sd} className="absolute" style={{ left: pct(CX[sd] - PW / 2 - 6, W), width: pct(PW + 12, W), top: pct(Math.max(0, py[sd] - contentH - 10), H), height: pct(contentH + 22, H) }}>
                  <DropZone drag={drag} id={`pan:${sd}`} tone="emerald" minHeight="min-h-0"
                    label={k('panZone', { side: k(sd === 'L' ? 'sideL' : 'sideR'), content: panWords(sd) })}
                    className="h-full w-full border-transparent bg-transparent" data-balance-zone={sd} />
                </div>
              ))}
              <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" role="img"
                aria-label={k('ariaScene', { left: panWords('L'), right: panWords('R'), state: k(tilt === 0 ? 'stateLevel' : tilt > 0 ? 'stateLeftDown' : 'stateRightDown') })}>
                {/* pied et socle */}
                <rect x={PIVOT - 70} y={H - 34} width={140} height={14} rx={5} fill="#475569" />
                <rect x={PIVOT - 9} y={beamY} width={18} height={H - 34 - beamY} fill="#64748B" />
                {/* le fléau */}
                <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${PIVOT}px ${beamY}px`, transition: 'transform 500ms cubic-bezier(.3,1.4,.5,1)' }} className="motion-reduce:transition-none" data-balance-beam>
                  <rect x={PIVOT - ARM - 8} y={beamY - 5} width={2 * ARM + 16} height={10} rx={5} fill="#334155" />
                  <polygon points={`${PIVOT},${beamY - 26} ${PIVOT - 6},${beamY - 4} ${PIVOT + 6},${beamY - 4}`} fill={tilt === 0 ? '#10B981' : '#F59E0B'} data-balance-needle />
                </g>
                <circle cx={PIVOT} cy={beamY} r={8} fill="#0F172A" />
                {/* les plateaux (Roberval : ils restent horizontaux, montent ou descendent) */}
                {B.SIDES.map((sd) => (
                  <g key={sd} style={{ transform: `translateY(${py[sd] - plateY}px)`, transition: 'transform 500ms cubic-bezier(.3,1.4,.5,1)' }} className="motion-reduce:transition-none" data-balance-pan={sd}>
                    <rect x={CX[sd] - 5} y={plateY + 6} width={10} height={beamY - plateY - 6} fill="#94A3B8" />
                    <rect x={CX[sd] - PW / 2 - 6} y={plateY} width={PW + 12} height={9} rx={4} fill="#475569" />
                    {lay[sd].float.length > 0 && lay[sd].float.map((it, i) => (
                      <line key={`s${i}`} x1={CX[sd] + it.x} y1={plateY + it.y + it.size * 0.4} x2={CX[sd]} y2={plateY + lay[sd].knotY} stroke="#94A3B8" strokeWidth={0.8} />
                    ))}
                    <g transform={`translate(${CX[sd]} ${plateY})`}>
                      {[...lay[sd].ground, ...lay[sd].float].map((it, i) => <Item key={i} it={it} part={counts[sd].part} />)}
                    </g>
                  </g>
                ))}
              </svg>
              {/* objets saisissables : un par sorte et par plateau, posé sur son groupe */}
              {B.SIDES.flatMap((sd) => KINDS.filter((kind) => has(sd, kind)).map((kind) => {
                const b = boxOf(sd, kind);
                const id = `p:${sd}:${kind}`;
                return (
                  <div key={id} className="absolute flex items-center justify-center" {...intercept(id)}
                    style={{ left: pct((b.x0 + b.x1) / 2, W), top: pct((b.y0 + b.y1) / 2, H), width: pct(b.x1 - b.x0, W), height: pct(b.y1 - b.y0, H), transform: 'translate(-50%, -50%)', minWidth: 44, minHeight: 44 }}>
                    <DraggableObject drag={drag} id={id} label={k('takeFrom', { what: k(`kind_${kind}`), side: k(sd === 'L' ? 'sideL' : 'sideR') })}
                      className="h-full w-full rounded-xl bg-transparent hover:bg-white/30" />
                  </div>
                );
              }))}
              {/* décor : un ballon au sol qu'on peut taper (aucun effet mathématique) */}
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setHop((n) => n + 1)} data-decor-ball
                className="absolute h-8 w-8 -translate-x-1/2 rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ left: pct(W - 40, W), top: pct(H - 46, H), transform: `translate(-50%, ${hop % 2 ? '-60%' : '0'}) rotate(${hop * 90}deg)` }}>
                <svg viewBox="-12 -12 24 24" className="h-full w-full" aria-hidden="true" focusable="false"><Ball x={0} y={0} s={26} /></svg>
              </button>
            </div>
          </div>

          {/* ── contenus lisibles (et leurs comptes) ── */}
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm" data-balance-counts>
            {B.SIDES.map((sd) => (
              <p key={sd} className="rounded-lg bg-white px-2 py-1 text-slate-700" data-balance-count={sd}>
                <strong>{k(sd === 'L' ? 'sideL' : 'sideR')}:</strong> {panWords(sd)}
              </p>
            ))}
          </div>

          {/* ── la réserve ── */}
          <DropZone drag={drag} id="reserve" tone="slate" label={k('reserveZone')} minHeight="min-h-[64px]" className="p-2" data-balance-reserve>
            <p className="mb-1 text-xs font-bold text-slate-600">{k('reserve')}</p>
            <div className="flex flex-wrap gap-2">
              {['ball', 'balloon', 'bag', 'anti'].map((kind) => (
                <span key={kind} {...intercept(`r:${kind}`)}>
                  <DraggableObject drag={drag} id={`r:${kind}`} label={k('takeReserve', { what: k(`kind_${kind}`) })}
                    className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-2 py-1 text-sm font-bold text-slate-800">
                    <Icon kind={kind} size={32} />
                    <span>{k(`kind_${kind}`)}</span>
                    <span dir="ltr" className="font-mono text-xs text-slate-500">{k(`value_${kind}`)}</span>
                  </DraggableObject>
                </span>
              ))}
            </div>
          </DropZone>

          {/* ── partager chaque plateau en k parts égales ── */}
          <div className="space-y-2 rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-2" data-balance-divide>
            <p className="text-sm font-bold text-violet-900">{k('divideTitle')}</p>
            <div className="flex items-center gap-2" dir="ltr">
              <button type="button" onClick={() => stretch.nudge(-1)} aria-label={k('fewer')} disabled={kk <= 1}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Minus className="h-5 w-5" aria-hidden="true" /></button>
              <div {...stretch.trackProps} className="relative h-11 flex-1" style={{ ...stretch.trackProps.style }} data-balance-parts-track>
                <div className="absolute inset-x-[22px] top-1/2 h-1.5 -translate-y-1/2 rounded bg-violet-300" />
                <div {...stretch.handleProps({ label: k('partsHandle'), valueText: k('partsValue', { k: kk }) })}
                  className={`absolute top-0 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-xl border-2 font-mono font-extrabold outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${stretch.dragging ? 'border-blue-500 bg-blue-50' : 'border-violet-500 bg-white'}`}
                  style={{ left: `calc(22px + (100% - 44px) * ${(kk - 1) / (kMax - 1)})` }} data-balance-k>{kk}</div>
              </div>
              <button type="button" onClick={() => stretch.nudge(1)} aria-label={k('more')} disabled={kk >= kMax}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-300 bg-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            {groups && (
              <div className="grid grid-cols-2 gap-2" data-balance-groups data-k={kk} data-ok={String(divOk === true)}>
                {B.SIDES.map((sd) => {
                  const g = groups[sd]; const p = lab.pans[sd];
                  const unitKind = B.toNumber(p.u) < 0 ? 'balloon' : 'ball';
                  return (
                    <div key={sd} className="rounded-xl border border-violet-200 bg-white p-1.5 text-xs" data-balance-group={sd}>
                      <p className="font-bold text-slate-600">{k('onePart', { side: k(sd === 'L' ? 'sideL' : 'sideR'), k: kk })}</p>
                      <div className="flex flex-wrap items-center gap-1" dir="ltr">
                        {g.a !== 0 && <span className="inline-flex items-center"><Icon kind={g.bagKind} size={22} /><span className="font-mono">×{Math.abs(g.a)}</span></span>}
                        {!B.toNumber(p.u) ? null : <span className="inline-flex items-center"><Icon kind={unitKind} size={22} /><span className="font-mono"><MathText>{`$\\times ${B.fracLatex(g.u).replace('-', '')}$`}</MathText></span></span>}
                        {g.a === 0 && !B.toNumber(p.u) && <span className="text-slate-400">—</span>}
                        {g.leftoverBags > 0 && (
                          <span className="inline-flex items-center rounded bg-rose-100 px-1 text-rose-800" data-balance-leftover>
                            <Icon kind={g.bagKind} size={20} /><span className="font-mono">×{g.leftoverBags}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button type="button" onClick={doDivide} disabled={parts < 2 || liveParts != null || B.canDivide(lab, parts) !== true} data-balance-divide-go
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-violet-600 px-4 font-bold text-white disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300">
              <Scissors className="h-5 w-5" aria-hidden="true" /> <span>{k('keepOne', { k: parts })}</span>
            </button>
          </div>

          <p className="min-h-[1.25rem] text-sm font-semibold" aria-live="polite" data-balance-notice={notice?.key}>
            {notice && <span className={toneClass[notice.tone]}><MathText>{noticeText(notice)}</MathText></span>}
          </p>

          {/* ── les équations équivalentes, écrites après chaque étape faite des DEUX côtés ── */}
          <ol className="space-y-1 rounded-xl border-2 border-slate-200 bg-white p-2 text-sm" data-balance-steps>
            <li className="font-bold text-slate-800"><MathText>{`${k('startLine')} $${B.equationTex(lab.start)}$`}</MathText></li>
            {steps.map((st, i) => (
              <li key={i} className="space-y-0.5 border-t border-slate-100 pt-1" data-balance-step={i}>
                <p className="text-xs text-slate-500"><MathText>{k(st.key, { term: st.term })}</MathText></p>
                <p dir="ltr" className="text-start"><MathText>{`$${st.op}$`}</MathText></p>
                <p className="font-bold text-slate-900"><MathText>{`${k('ay')} $${st.result}$`}</MathText></p>
              </li>
            ))}
          </ol>

          {solved && (
            <div className="space-y-2" data-balance-verify>
              {!lab.verified ? (
                <button type="button" onClick={doVerify} data-balance-verify-go
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300">
                  <SearchCheck className="h-5 w-5" aria-hidden="true" /> <span>{k('verify')}</span>
                </button>
              ) : (
                <EquationDisplay tone="ok"
                  tex={`${B.substitutedTex(lab.start.L, sub.x)} = ${B.fracLatex(sub.left)} \\qquad ${B.substitutedTex(lab.start.R, sub.x)} = ${B.fracLatex(sub.right)}`}
                  note={<MathText>{k('verifiedNote', { v: B.fracLatex(sub.x) })}</MathText>} />
              )}
            </div>
          )}
        </div>
      </ManipulationStage>
    </ManipulationShell>
  );
}
