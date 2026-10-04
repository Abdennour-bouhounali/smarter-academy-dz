import React from 'react';

/**
 * La vignette de la carte d'activité : un spectacle de drones lumineux au-dessus de la baie d'Alger — une formation et
 * sa copie glissée (même flèche pour chaque drone), le minaret de جامع الجزائر au loin, la foule qui filme. Décor
 * DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function DroneShowVignette() {
  const formation = [[40, 46], [62, 36], [58, 62]];
  const u = [96, -14];
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dsv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#020617" /><stop offset="1" stopColor="#312E81" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="120" rx="12" fill="url(#dsv-sky)" />
      {[[18, 14], [120, 10], [200, 22], [160, 40], [90, 20], [226, 52]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1" fill="#E0E7FF" />)}
      <rect x="0" y="92" width="240" height="28" fill="#0C4A6E" />
      <path d="M0 92 Q120 86 240 92" fill="#0F172A" />
      <rect x="206" y="58" width="6" height="34" fill="#0B1120" /><rect x="204" y="54" width="10" height="5" fill="#0B1120" /><rect x="208" y="48" width="2" height="6" fill="#0B1120" />
      {formation.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x + u[0] - 6} y2={y + u[1] + 1} stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="3 3" />
          <circle cx={x} cy={y} r="5" fill="#22D3EE" opacity="0.5" />
          <circle cx={x + u[0]} cy={y + u[1]} r="6" fill="#F472B6" />
          <circle cx={x + u[0]} cy={y + u[1]} r="10" fill="#F472B6" opacity="0.25" />
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <circle cx={12 + i * 26} cy={110} r="5" fill="#020617" />
          {i % 2 === 0 && <rect x={16 + i * 26} y={98} width="4" height="6" rx="1" fill="#A5F3FC" />}
        </g>
      ))}
    </svg>
  );
}
