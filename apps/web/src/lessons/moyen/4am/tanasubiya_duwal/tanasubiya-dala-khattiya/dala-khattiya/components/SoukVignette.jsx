import React from 'react';

/**
 * La vignette de la carte d'activité du نشاط 1 : un étal du souk à l'Aïd — auvent rayé, lanterne,
 * étiquettes de prix barrées. DESSINÉE (jamais raster), décorative (`aria-hidden`), sans nombre :
 * elle ne porte aucune réponse.
 */
export default function SoukVignette() {
  return (
    <svg viewBox="0 0 160 90" width="100%" height="90" aria-hidden="true" focusable="false" data-souk-vignette>
      <rect x="0" y="0" width="160" height="90" rx="12" fill="#FFF7ED" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${10 + i * 17.5} 14 h17.5 v12 q-8.75 7 -17.5 0 z`} fill={i % 2 ? '#F8FAFC' : '#DC2626'} />
      ))}
      <rect x="10" y="10" width="140" height="5" fill="#7C2D12" />
      <line x1="24" y1="26" x2="24" y2="84" stroke="#7C2D12" strokeWidth="3" />
      <line x1="136" y1="26" x2="136" y2="84" stroke="#7C2D12" strokeWidth="3" />
      <rect x="20" y="62" width="120" height="22" rx="3" fill="#B45309" />
      <g>
        <line x1="80" y1="26" x2="80" y2="34" stroke="#92400E" strokeWidth="1.5" />
        <path d="M74 34 H86 L84 50 H76 Z" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
        <path d="M77 39 H83 M77 44 H83" stroke="#B45309" strokeWidth="1" />
      </g>
      {[[40, 46], [104, 44], [120, 50]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i % 2 ? 8 : -8})`}>
          <path d="M0 0 h16 l5 6 l-5 6 h-16 z" fill="#FEF3C7" stroke="#B45309" />
          <circle cx="17" cy="6" r="1.4" fill="#B45309" />
          <line x1="2" y1="6" x2="13" y2="6" stroke="#DC2626" strokeWidth="1.6" />
        </g>
      ))}
      <path d="M44 62 q8 -12 16 0 z" fill="#F59E0B" />
      <path d="M100 62 q10 -14 20 0 z" fill="#16A34A" />
    </svg>
  );
}
