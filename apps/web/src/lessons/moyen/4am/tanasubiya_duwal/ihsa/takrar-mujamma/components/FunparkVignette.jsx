import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : la grande roue d'une حديقة التسلية, la toise
 * de l'entrée du manège et deux enfants dans la file. DÉCORATIVE (`aria-hidden`), dessinée en SVG : la même
 * toise et les mêmes personnes que le lab cumul-gate.
 */
export default function FunparkVignette({ className = '' }) {
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#FDF4FF" />
      <g transform="translate(142 46)">
        <circle r="34" fill="none" stroke="#A855F7" strokeWidth="3" />
        <path d="M0 -34 V34 M-34 0 H34 M-24 -24 L24 24 M24 -24 L-24 24" stroke="#C4B5FD" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={34 * Math.cos((i * Math.PI) / 4) - 5} y={34 * Math.sin((i * Math.PI) / 4) - 2} width="10" height="7" rx="2" fill={['#F472B6', '#FACC15', '#22D3EE', '#A3E635'][i % 4]} />
        ))}
        <path d="M-12 76 L0 0 L12 76" stroke="#7C3AED" strokeWidth="3" fill="none" />
      </g>
      <rect x="0" y="96" width="200" height="14" fill="#E9D5FF" />
      {/* la toise : 130cm على الأقل */}
      <rect x="20" y="28" width="6" height="68" rx="2" fill="#FDE68A" stroke="#94A3B8" />
      <rect x="20" y="48" width="30" height="5" rx="2" fill="#C2410C" />
      {/* deux enfants */}
      {[[56, 46, '#6366F1'], [76, 56, '#10B981']].map(([x, top, c]) => (
        <g key={x}>
          <circle cx={x} cy={top + 6} r="5" fill="#F2C9A0" />
          <path d={`M${x - 6} ${top + 13} Q${x} ${top + 10} ${x + 6} ${top + 13} L${x + 7} ${top + 28} L${x - 7} ${top + 28} Z`} fill={c} />
          <path d={`M${x - 3} ${top + 28} V96 M${x + 3} ${top + 28} V96`} stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
