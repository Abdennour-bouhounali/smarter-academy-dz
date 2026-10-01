import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : la balance du vestiaire, en
 * équilibre, avec des sacs fermés d'un côté et des ballons de l'autre. DÉCORATIVE
 * (`aria-hidden`), dessinée en SVG — les mêmes objets que le laboratoire au-dessous.
 */
export default function BalanceVignette({ className = '' }) {
  const bag = (x) => (
    <g key={`b${x}`} transform={`translate(${x} 52)`}>
      <path d="M-5 -9 Q-10 -3 -10 4 Q-10 10 0 10 Q10 10 10 4 Q10 -3 5 -9 Z" fill="#B45309" stroke="#78350F" strokeWidth="1" />
      <rect x="-4" y="-11" width="8" height="3" rx="1" fill="#92400E" />
      <text x="0" y="6" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FEF3C7" fontFamily="ui-monospace, monospace">x</text>
    </g>
  );
  const ball = (x, y) => (
    <g key={`c${x}${y}`} transform={`translate(${x} ${y})`}>
      <circle r="5.5" fill="#fff" stroke="#0F172A" strokeWidth="1" />
      <path d="M0 -2.3 L2.2 -0.7 L1.4 2 L-1.4 2 L-2.2 -0.7 Z" fill="#0F172A" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#E0F2FE" />
      <rect x="0" y="96" width="200" height="14" fill="#CBD5E1" />
      <rect x="80" y="96" width="40" height="6" rx="2" fill="#475569" />
      <rect x="97" y="72" width="6" height="25" fill="#64748B" />
      <rect x="28" y="70" width="144" height="5" rx="2.5" fill="#334155" />
      <circle cx="100" cy="72" r="4" fill="#0F172A" />
      <rect x="47" y="62" width="4" height="9" fill="#94A3B8" />
      <rect x="149" y="62" width="4" height="9" fill="#94A3B8" />
      <rect x="22" y="60" width="56" height="4" rx="2" fill="#475569" />
      <rect x="122" y="60" width="56" height="4" rx="2" fill="#475569" />
      {[36, 50, 64].map(bag)}
      {[[133, 54], [145, 54], [157, 54], [169, 54], [139, 44], [151, 44], [163, 44]].map(([x, y]) => ball(x, y))}
    </svg>
  );
}
