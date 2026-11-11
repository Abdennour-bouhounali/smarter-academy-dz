import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
/** Le coin de jardin : un triangle rectangle (angle droit en A, à gauche), et le CARRÉ du bassin posé sur son hypoténuse, à l'extérieur. */
const A = [190, 214];
const B = [190, 136];
const C = [318, 214];
const ROWS = 4;

/** Un point du carré construit sur [BC] (côté extérieur) : u, v ∈ [0, 1] le long de BC et vers l'extérieur. */
function onSquare(u, v) {
  const dx = C[0] - B[0]; const dy = C[1] - B[1];
  // la normale EXTÉRIEURE au triangle (vers le haut-droite)
  const nx = dy; const ny = -dx;
  return [B[0] + u * dx + v * nx, B[1] + u * dy + v * ny];
}
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/**
 * Le jardin de la mission « حوض الأزهار على الوتر » (leçon jidhr-tarbii, rollout 2026-11-09) — dessiné en code (CLAUDE.md : aucune image générée
 * dans les leçons). Un coin de jardin en triangle rectangle ; sur son hypoténuse, à l'extérieur, le bassin CARRÉ se remplit de fleurs rangée après
 * rangée à mesure que les outils sont gagnés, et son cadre de pierres se ferme quand tout est gagné. Un jardinier dessiné par `KidFigure`.
 * `fill` ∈ [0, 1]. Aucun nombre de la مسألة n'est dessiné (ni côtés, ni aire) ; le texte arabe reste dans le DOM.
 */
export default function GardenBedScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const rows = Math.round(f * ROWS);
  const square = [onSquare(0, 0), onSquare(1, 0), onSquare(1, 1), onSquare(0, 1)];
  return (
    <svg viewBox="0 0 480 260" className={className} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} data-library-fill={f.toFixed(2)} data-scene="garden-bed">
      <rect x="0" y="0" width="480" height={GROUND} fill="#E0F2FE" />
      <circle cx="430" cy="44" r="22" fill="#FDE68A" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#86EFAC" />
      {/* le coin de jardin (triangle rectangle) et son angle droit */}
      <polygon points={pts([A, B, C])} fill="#BBF7D0" stroke="#15803D" strokeWidth="3" />
      <path d={`M ${A[0]} ${A[1] - 12} L ${A[0] + 12} ${A[1] - 12} L ${A[0] + 12} ${A[1]}`} fill="none" stroke="#15803D" strokeWidth="2" />
      {/* le bassin carré sur l'hypoténuse : la terre, puis les rangées de fleurs gagnées */}
      <polygon points={pts(square)} fill="#D6A77A" stroke={f >= 1 ? '#57534E' : '#A8A29E'} strokeWidth={f >= 1 ? 6 : 2} strokeDasharray={f >= 1 ? undefined : '6 5'} data-garden-frame={f >= 1 ? 'closed' : 'open'} />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r} data-garden-row>
          {Array.from({ length: 4 }, (_, c) => {
            const [x, y] = onSquare((c + 0.5) / 4, (r + 0.5) / ROWS);
            const tone = ['#F43F5E', '#F59E0B', '#A855F7', '#EC4899'][(r + c) % 4];
            return (
              <g key={c}>
                <circle cx={x} cy={y} r="7" fill={tone} />
                <circle cx={x} cy={y} r="2.6" fill="#FEF9C3" />
              </g>
            );
          })}
        </g>
      ))}
      <KidFigure cx={86} top={96} foot={GROUND} outfit="green" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
