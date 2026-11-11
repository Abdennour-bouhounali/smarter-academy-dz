import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
/** Le métier à tisser : deux montants, une ensouple en haut et une en bas ; le tapis carré se tisse entre elles, rangée après rangée. */
const LOOM = { x: 196, y: 30, w: 196, h: 196 };
const CARPET = { x: LOOM.x + 18, y: LOOM.y + 18, s: LOOM.w - 36 };
const ROWS = 5;
const TONES = ['#B91C1C', '#1E3A8A', '#B45309', '#065F46', '#7C2D12'];

/** Un losange (motif géométrique des tapis du pays) centré en (x, y), demi-diagonales rx, ry. */
const diamond = (x, y, rx, ry) => `${x},${y - ry} ${x + rx},${y} ${x},${y + ry} ${x - rx},${y}`;

/**
 * L'atelier de la mission « ورشة الزرابي » (leçon natiqa-ghayr-natiqa, rollout 2026-11-09) — dessiné en code (CLAUDE.md : aucune image générée
 * dans les leçons). Un métier à tisser : le tapis CARRÉ se tisse rangée après rangée, de bas en haut, à mesure que les outils sont gagnés ; quand
 * tout est gagné, la bordure se ferme et les franges apparaissent. Une tisserande dessinée par `KidFigure` (hijab, tenue islamique) tient le ruban
 * métrique. `fill` ∈ [0, 1]. Aucun nombre de la مسألة n'est dessiné (ni aires, ni côtés, ni prix) ; le texte arabe reste dans le DOM.
 */
export default function CarpetLoomScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const rows = Math.round(f * ROWS);
  const rowH = CARPET.s / ROWS;
  const done = f >= 1;
  return (
    <svg viewBox="0 0 480 260" className={className} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} data-carpet-fill={f.toFixed(2)} data-scene="carpet-loom">
      <rect x="0" y="0" width="480" height={GROUND} fill="#FEF3C7" />
      {/* la fenêtre de l'atelier, en arc */}
      <path d="M 410 120 L 410 64 A 26 26 0 0 1 462 64 L 462 120 Z" fill="#BAE6FD" stroke="#92400E" strokeWidth="4" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#D6A77A" />
      {/* le métier : montants et ensouples */}
      <rect x={LOOM.x - 6} y={LOOM.y - 8} width="10" height={LOOM.h + 16 + (GROUND - LOOM.y - LOOM.h - 8)} fill="#78350F" rx="3" />
      <rect x={LOOM.x + LOOM.w - 4} y={LOOM.y - 8} width="10" height={LOOM.h + 16 + (GROUND - LOOM.y - LOOM.h - 8)} fill="#78350F" rx="3" />
      <rect x={LOOM.x - 12} y={LOOM.y - 2} width={LOOM.w + 24} height="10" fill="#92400E" rx="4" />
      <rect x={LOOM.x - 12} y={LOOM.y + LOOM.h - 8} width={LOOM.w + 24} height="10" fill="#92400E" rx="4" />
      {/* les fils de chaîne, tendus sur toute la hauteur */}
      {Array.from({ length: 21 }, (_, i) => {
        const x = CARPET.x + (i * CARPET.s) / 20;
        return <line key={i} x1={x} x2={x} y1={LOOM.y + 8} y2={LOOM.y + LOOM.h - 8} stroke="#E7E5E4" strokeWidth="1.5" />;
      })}
      {/* le carré à tisser, en pointillés, puis les rangées tissées (de bas en haut) */}
      <rect x={CARPET.x} y={CARPET.y} width={CARPET.s} height={CARPET.s} fill="none" stroke={done ? '#7F1D1D' : '#A8A29E'} strokeWidth={done ? 6 : 2} strokeDasharray={done ? undefined : '6 5'} data-carpet-border={done ? 'closed' : 'open'} />
      {Array.from({ length: rows }, (_, r) => {
        const y = CARPET.y + CARPET.s - (r + 1) * rowH;
        const tone = TONES[r % TONES.length];
        return (
          <g key={r} data-carpet-row>
            <rect x={CARPET.x} y={y} width={CARPET.s} height={rowH} fill={tone} />
            {Array.from({ length: 4 }, (_, c) => {
              const x = CARPET.x + ((c + 0.5) * CARPET.s) / 4;
              return <polygon key={c} points={diamond(x, y + rowH / 2, rowH * 0.45, rowH * 0.38)} fill="#FDE68A" stroke="#FFFBEB" strokeWidth="1.5" />;
            })}
          </g>
        );
      })}
      {done && Array.from({ length: 13 }, (_, i) => {
        const x = CARPET.x + (i * CARPET.s) / 12;
        return <line key={i} x1={x} x2={x} y1={CARPET.y + CARPET.s} y2={CARPET.y + CARPET.s + 10} stroke="#FDE68A" strokeWidth="2" data-carpet-fringe />;
      })}
      {/* le ruban métrique déroulé au sol : des graduations, aucun nombre */}
      <rect x="40" y={GROUND - 6} width="140" height="10" fill="#FACC15" stroke="#A16207" rx="2" />
      {Array.from({ length: 15 }, (_, i) => (
        <line key={i} x1={44 + i * 9.5} x2={44 + i * 9.5} y1={GROUND - 6} y2={GROUND - (i % 5 === 0 ? 0 : 2)} stroke="#713F12" strokeWidth="1" />
      ))}
      <KidFigure cx={110} top={96} foot={GROUND - 6} hairStyle="hijab" scarf="rose" outfit="teal" mood={done ? 'proud' : 'wonder'} />
    </svg>
  );
}
