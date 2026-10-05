import React from 'react';

/**
 * La vignette de la carte d'activité (module 1) : un téléphone tenu en paysage, et dans l'écran deux tours de blocs du jeu
 * de construction — une petite et sa grande sœur. DÉCORATIVE (`aria-hidden`) : aucune mesure, aucun nombre de cubes à lire.
 */
const C = ['#f97316', '#facc15'];
function Cube({ x, y, s, c }) {
  const h = s * 0.5;
  return (
    <g>
      <polygon points={`${x},${y} ${x + s},${y - h} ${x + 2 * s},${y} ${x + s},${y + h}`} fill={c} />
      <polygon points={`${x},${y} ${x + s},${y + h} ${x + s},${y + h + s} ${x},${y + s}`} fill={c} opacity="0.75" />
      <polygon points={`${x + s},${y + h} ${x + 2 * s},${y} ${x + 2 * s},${y + s} ${x + s},${y + h + s}`} fill={c} opacity="0.55" />
    </g>
  );
}

export default function VoxelVignette() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full max-w-[220px]" aria-hidden="true" focusable="false">
      <rect x="6" y="10" width="208" height="100" rx="16" fill="#0f172a" />
      <rect x="16" y="18" width="188" height="84" rx="8" fill="#bae6fd" />
      <rect x="16" y="78" width="188" height="24" fill="#4ade80" />
      <rect x="170" y="24" width="18" height="18" fill="#fde047" />
      <Cube x={36} y={66} s={10} c={C[0]} />
      <Cube x={36} y={56} s={10} c={C[1]} />
      {[[0, 2], [1, 2], [0, 1], [1, 1]].map(([i, j]) => <Cube key={`${i}${j}`} x={96 + i * 20 - j * 0} y={70 - j * 20 + i * 10} s={20} c={C[(i + j) % 2]} />)}
      <circle cx="198" cy="60" r="4" fill="#334155" />
    </svg>
  );
}
