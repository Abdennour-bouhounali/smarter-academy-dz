import React from 'react';

/**
 * La vignette de la carte d'activité : le ملعب الحي en gazon synthétique, trois plots d'entraînement reliés par un
 * ruban, un téléphone sur trépied qui filme le défi et l'écran du « فار ». Décor DESSINÉ (jamais une image), aria-hidden,
 * sans aucun nombre : le même monde que le laboratoire.
 */
export default function PitchVignette() {
  const cones = [[70, 84], [150, 66], [96, 34]];
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#15803D" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 30} y="0" width="15" height="120" fill="#16A34A" />)}
      <rect x="8" y="8" width="224" height="104" rx="8" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" />
      {Array.from({ length: 7 }, (_, i) => <line key={`v${i}`} x1={40 + i * 24} y1="14" x2={40 + i * 24} y2="106" stroke="#FFFFFF" strokeOpacity="0.18" />)}
      {Array.from({ length: 4 }, (_, i) => <line key={`h${i}`} x1="14" y1={24 + i * 24} x2="226" y2={24 + i * 24} stroke="#FFFFFF" strokeOpacity="0.18" />)}
      <polygon points={cones.map((c) => c.join(',')).join(' ')} fill="#FEF08A" fillOpacity="0.2" stroke="#FDE047" strokeWidth="2.5" />
      {cones.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 7} ${y + 6} L${x} ${y - 9} L${x + 7} ${y + 6} Z`} fill={i === 2 ? '#F97316' : '#FACC15'} stroke="#7C2D12" strokeWidth="1" />
          <path d={`M${x - 4} ${y - 1} L${x + 4} ${y - 1}`} stroke="#FFFFFF" strokeWidth="2" />
        </g>
      ))}
      <circle cx="124" cy="96" r="6" fill="#FFFFFF" stroke="#111827" />
      <path d="M124 92 L127 94.5 L126 98 L122 98 L121 94.5 Z" fill="#111827" />
      <g>
        <rect x="186" y="20" width="40" height="28" rx="4" fill="#0F172A" stroke="#94A3B8" />
        <rect x="190" y="24" width="32" height="20" rx="2" fill="#1E3A8A" />
        <path d="M193 40 L201 31 L207 36 L219 27" stroke="#34D399" strokeWidth="2" fill="none" />
        <line x1="206" y1="48" x2="206" y2="56" stroke="#94A3B8" strokeWidth="2" />
      </g>
      <g>
        <line x1="34" y1="34" x2="28" y2="50" stroke="#1F2937" strokeWidth="1.5" />
        <line x1="34" y1="34" x2="40" y2="50" stroke="#1F2937" strokeWidth="1.5" />
        <rect x="27" y="16" width="14" height="19" rx="3" fill="#111827" stroke="#9CA3AF" />
        <circle cx="34" cy="24" r="2.6" fill="#1E3A8A" />
        <circle cx="38" cy="19" r="1.6" fill="#EF4444" />
      </g>
    </svg>
  );
}
