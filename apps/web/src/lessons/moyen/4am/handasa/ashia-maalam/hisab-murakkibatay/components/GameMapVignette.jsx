import React from 'react';

/**
 * La vignette de la carte d'activité : l'île d'un jeu mobile — la mer, l'herbe en tuiles, deux portails violets reliés
 * par la trajectoire pointillée du héros à casquette, un palmier de l'oasis, un phare et un coffre de pièces. Décor
 * DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab `component-calc`.
 */
export default function GameMapVignette() {
  const tiles = [];
  for (let x = 30; x <= 210; x += 20) tiles.push(<line key={`v${x}`} x1={x} y1={18} x2={x} y2={102} stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />);
  for (let y = 18; y <= 102; y += 20) tiles.push(<line key={`h${y}`} x1={22} y1={y} x2={218} y2={y} stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />);
  const portal = (cx, cy) => (
    <g>
      <circle cx={cx} cy={cy} r="11" fill="#A78BFA" stroke="#6D28D9" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="6.5" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeDasharray="3 3" />
    </g>
  );
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#38BDF8" />
      <rect x="14" y="10" width="212" height="100" rx="20" fill="#FDE68A" />
      <rect x="20" y="15" width="200" height="90" rx="16" fill="#86EFAC" />
      {tiles}
      <path d="M70 78 L150 78 L150 38" fill="none" stroke="#E11D48" strokeWidth="2" strokeDasharray="5 4" />
      {portal(70, 78)}
      {portal(150, 38)}
      <g transform="translate(62 46)">
        <rect x="3" y="13" width="12" height="13" rx="4" fill="#2563EB" />
        <circle cx="9" cy="9" r="6" fill="#FDBA74" />
        <path d="M2.5 7 Q9 -1 15.5 7 Z" fill="#DC2626" />
      </g>
      <g transform="translate(196 92)" opacity="0.8">
        <path d="M0 0 Q3 -14 1 -26" stroke="#92400E" strokeWidth="3" fill="none" />
        <path d="M1 -26 Q-10 -30 -16 -22 M1 -26 Q12 -31 17 -22 M1 -26 Q-4 -36 -12 -36" stroke="#15803D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(36 40)" opacity="0.85">
        <rect x="-5" y="-22" width="10" height="22" fill="#F8FAFC" stroke="#64748B" />
        <rect x="-5" y="-16" width="10" height="4" fill="#DC2626" />
        <path d="M-7 -22 L0 -29 L7 -22 Z" fill="#DC2626" />
      </g>
      <g transform="translate(176 66)">
        <rect x="0" y="6" width="22" height="13" rx="2" fill="#92400E" />
        <path d="M0 8 Q11 -2 22 8 Z" fill="#B45309" />
        <circle cx="6" cy="2" r="3" fill="#FCD34D" /><circle cx="15" cy="0" r="3" fill="#FCD34D" />
      </g>
    </svg>
  );
}
