import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
const COUNTER_Y = 176;
const BOUQUETS = 6;
const RED = '#E11D48';
const WHITE = '#FFFFFF';

/** Une fleur : cinq pétales autour d'un cœur jaune. */
function Flower({ x, y, color, r = 5 }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + r * 0.8 * Math.cos((a * Math.PI) / 180)} cy={y + r * 0.8 * Math.sin((a * Math.PI) / 180)} r={r * 0.62}
          fill={color} stroke={color === WHITE ? '#CBD5E1' : '#9F1239'} strokeWidth="0.6" />
      ))}
      <circle cx={x} cy={y} r={r * 0.38} fill="#FACC15" />
    </g>
  );
}

/** Un seau de fleurs d'une couleur : `full` ∈ [0, 1] dit combien il en reste. */
function Bucket({ x, color, full }) {
  const n = Math.round(full * 9);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const fx = x + 8 + (i % 3) * 13; const fy = COUNTER_Y - 30 - Math.floor(i / 3) * 10;
        return (
          <g key={i}>
            <line x1={fx} y1={fy} x2={x + 22} y2={COUNTER_Y - 10} stroke="#15803D" strokeWidth="1.5" />
            <Flower x={fx} y={fy} color={color} />
          </g>
        );
      })}
      <path d={`M ${x} ${COUNTER_Y - 18} L ${x + 44} ${COUNTER_Y - 18} L ${x + 38} ${COUNTER_Y} L ${x + 6} ${COUNTER_Y} Z`} fill="#64748B" />
      <rect x={x - 2} y={COUNTER_Y - 21} width="48" height="5" rx="2" fill="#94A3B8" />
    </g>
  );
}

/** Un bouquet identique aux autres : deux fleurs rouges, une blanche, dans un cornet. */
function Bouquet({ x }) {
  const y = COUNTER_Y - 4;
  return (
    <g data-bouquet>
      {[[-7, -30, RED], [7, -30, RED], [0, -40, WHITE]].map(([dx, dy, c], i) => (
        <g key={i}>
          <line x1={x + dx} y1={y + dy} x2={x} y2={y - 8} stroke="#15803D" strokeWidth="1.4" />
          <Flower x={x + dx} y={y + dy} color={c} r={5.5} />
        </g>
      ))}
      <path d={`M ${x - 13} ${y - 22} L ${x + 13} ${y - 22} L ${x} ${y} Z`} fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    </g>
  );
}

/**
 * L'atelier du fleuriste de la mission « محلّ الورود » (leçon qasim-mushtarak-akbar, rollout 2026-11-08) — dessiné en code (CLAUDE.md :
 * aucune image générée dans les leçons). Deux seaux (fleurs rouges, fleurs blanches), un comptoir où les bouquets IDENTIQUES
 * apparaissent un à un, une fleuriste dessinée par `KidFigure` (hijab). `fill` ∈ [0, 1] : la part des bouquets faits — elle SUIT
 * les outils gagnés ; les seaux se vident d'autant. Aucun nombre de la مسألة (ni 120, ni 84, ni le nombre de bouquets) n'est
 * dessiné ; le texte arabe reste dans le DOM, hors du SVG.
 */
export default function FlowerShopScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const made = Math.round(f * BOUQUETS);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="flower-shop">
      <rect x="0" y="0" width="480" height={GROUND} fill="#FCE7F3" />
      {/* la vitrine */}
      <rect x="150" y="26" width="300" height="96" rx="8" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="3" />
      <line x1="300" y1="26" x2="300" y2="122" stroke="#BAE6FD" strokeWidth="3" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#E7E5E4" />
      {/* le comptoir */}
      <rect x="140" y={COUNTER_Y} width="330" height={GROUND - COUNTER_Y} fill="#B45309" />
      <rect x="134" y={COUNTER_Y - 4} width="342" height="8" rx="3" fill="#92400E" />
      <Bucket x={150} color={RED} full={1 - f * 0.8} />
      <Bucket x={206} color={WHITE} full={1 - f * 0.8} />
      {/* les bouquets identiques, posés un à un */}
      {Array.from({ length: made }, (_, i) => <Bouquet key={i} x={286 + i * 31} />)}
      {Array.from({ length: BOUQUETS - made }, (_, i) => (
        <path key={`e${i}`} d={`M ${286 + (made + i) * 31 - 13} ${COUNTER_Y - 26} L ${286 + (made + i) * 31 + 13} ${COUNTER_Y - 26} L ${286 + (made + i) * 31} ${COUNTER_Y - 4} Z`}
          fill="none" stroke="#D97706" strokeDasharray="3 3" />
      ))}
      <KidFigure cx={76} top={84} foot={GROUND} hairStyle="hijab" scarf="mint" outfit="green" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
