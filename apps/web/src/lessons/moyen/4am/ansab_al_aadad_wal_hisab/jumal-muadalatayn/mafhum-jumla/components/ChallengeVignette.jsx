import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : le تحدّ de la page d'ouverture — un
 * bocal de pièces de 20DA et 10DA sous la guirlande d'une classe qu'on décore. DÉCORATIVE
 * (`aria-hidden`), dessinée en SVG : les mêmes pièces que le monde « coins » du lab.
 */
export default function ChallengeVignette({ className = '' }) {
  const coin = (x, y, big, i) => (
    <g key={i} transform={`translate(${x} ${y})`}>
      <circle r={big ? 7 : 6} fill={big ? '#FBBF24' : '#CBD5E1'} stroke={big ? '#B45309' : '#64748B'} strokeWidth="1.2" />
      <text y="2.6" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1F2937" fontFamily="ui-monospace, monospace">{big ? 20 : 10}</text>
    </g>
  );
  const coins = [[82, 86, 1], [96, 88, 0], [110, 86, 1], [124, 88, 1], [89, 74, 0], [103, 75, 1], [117, 74, 0], [96, 62, 1], [110, 63, 1]];
  const flags = ['#16A34A', '#F8FAFC', '#DC2626', '#16A34A', '#F8FAFC', '#DC2626', '#16A34A', '#F8FAFC'];
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#FEF3C7" />
      <rect x="0" y="98" width="200" height="12" fill="#E7D7B5" />
      <path d="M6 10 Q100 34 194 10" stroke="#78350F" strokeWidth="1.2" fill="none" />
      {flags.map((c, i) => {
        const x = 18 + i * 22;
        const y = 10 + Math.sin((i + 0.5) / flags.length * Math.PI) * 11;
        return <path key={i} d={`M${x - 6} ${y} L${x + 6} ${y} L${x} ${y + 12} Z`} fill={c} stroke="#94A3B8" strokeWidth="0.5" />;
      })}
      <rect x="14" y="40" width="44" height="30" rx="3" fill="#1E3A2F" stroke="#78350F" strokeWidth="2.5" />
      <path d="M20 50 h20 M20 57 h30" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M74 50 Q72 98 80 98 L130 98 Q138 98 136 50 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" opacity="0.9" />
      <rect x="76" y="44" width="58" height="7" rx="3" fill="#0284C7" />
      {coins.map(([x, y, big], i) => coin(x, y, big, i))}
      <rect x="150" y="62" width="34" height="36" rx="3" fill="#B45309" />
      <rect x="146" y="58" width="42" height="6" rx="2" fill="#92400E" />
    </svg>
  );
}
