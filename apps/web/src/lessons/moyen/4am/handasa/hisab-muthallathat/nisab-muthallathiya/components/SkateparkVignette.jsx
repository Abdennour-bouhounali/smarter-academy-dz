import React from 'react';

/**
 * La vignette de la carte d'activité : le skatepark du quartier — trois rampes de tailles différentes AU MÊME
 * angle (le نشاط 2), le mur de graffitis, un skateur, un téléphone qui filme. Décor DESSINÉ (jamais une image),
 * aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function SkateparkVignette() {
  const ramps = [[28, 34], [92, 52], [168, 70]];
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#FDF4FF" />
      <rect x="6" y="8" width="228" height="48" rx="8" fill="#F1F5F9" />
      {[['#F472B6', 30], ['#60A5FA', 92], ['#FBBF24', 150], ['#34D399', 200]].map(([c, x]) => (
        <path key={x} d={`M${x} 34 q12 -16 26 -2 q10 12 -6 16 q-20 6 -20 -14 z`} fill={c} opacity="0.35" />
      ))}
      <rect x="0" y="104" width="240" height="16" fill="#E2E8F0" />
      {ramps.map(([x, s]) => (
        <polygon key={x} points={`${x},104 ${x + s},104 ${x + s},${104 - s * 0.84}`} fill="#E9D5FF" stroke="#A21CAF" strokeWidth="2" />
      ))}
      <g transform="translate(205 63) rotate(-40)">
        <rect x="-11" y="-4" width="22" height="3" rx="1.5" fill="#111827" />
        <rect x="-4" y="-22" width="8" height="12" rx="3" fill="#22C55E" />
        <circle cx="0" cy="-27" r="4" fill="#FCD34D" />
      </g>
      <rect x="10" y="78" width="12" height="18" rx="2" fill="#0F172A" />
      <circle cx="18" cy="81" r="1.6" fill="#EF4444" />
    </svg>
  );
}
