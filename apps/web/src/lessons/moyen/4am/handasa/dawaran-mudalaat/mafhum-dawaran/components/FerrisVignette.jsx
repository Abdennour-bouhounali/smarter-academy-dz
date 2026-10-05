import React, { useId } from 'react';

/**
 * La vignette de la carte d'activité : la grande roue du parc d'attractions de Ben Aknoun au crépuscule — la jante, ses
 * rayons, six nacelles (l'une dorée, celle de la tâche), un arc fléché qui la fait tourner autour du moyeu, les
 * collines d'Alger allumées. Décor DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function FerrisVignette() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const c = [150, 56]; const R = 38;
  const at = (deg, r = R) => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] - r * Math.sin((deg * Math.PI) / 180)];
  const arc = (a1, a2, r) => { const [x1, y1] = at(a1, r); const [x2, y2] = at(a2, r); return `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`; };
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`fv-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E1B4B" /><stop offset="0.6" stopColor="#6D28D9" /><stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="120" rx="12" fill={`url(#fv-${uid})`} />
      {[[18, 14], [60, 10], [212, 18], [196, 40], [96, 22], [36, 34]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1" fill="#E0E7FF" />)}
      <path d="M 26 14 a 7 7 0 1 0 6 11 a 6 6 0 1 1 -6 -11 Z" fill="#FEF3C7" />
      <path d="M0 104 Q 50 90 100 100 T 240 98 V 120 H 0 Z" fill="#1E1B4B" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={8 + i * 19} y={102 - (i % 3) * 2} width="2" height="2" fill="#FDE68A" />)}
      <line x1={c[0]} y1={c[1]} x2={c[0] - 20} y2={110} stroke="#94A3B8" strokeWidth="2.4" />
      <line x1={c[0]} y1={c[1]} x2={c[0] + 20} y2={110} stroke="#94A3B8" strokeWidth="2.4" />
      <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke="#E2E8F0" strokeWidth="2.2" />
      {Array.from({ length: 12 }, (_, i) => { const [x, y] = at(i * 30); return <line key={i} x1={c[0]} y1={c[1]} x2={x} y2={y} stroke="#CBD5E1" strokeWidth="0.8" />; })}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = at(i * 60);
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + 3} stroke="#E2E8F0" strokeWidth="0.8" />
            <rect x={x - 5} y={y + 3} width="10" height="8" rx="2.5" fill={i === 0 ? '#F59E0B' : '#6366F1'} stroke="#F8FAFC" strokeWidth="0.8" />
            <circle cx={x} cy={y} r="1.8" fill="#FDE68A" />
          </g>
        );
      })}
      <path d={arc(8, 52, R + 9)} fill="none" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" />
      {(() => { const [x, y] = at(56, R + 9); return <circle cx={x} cy={y} r="3" fill="#FB7185" />; })()}
      <circle cx={c[0]} cy={c[1]} r="3.4" fill="#F8FAFC" />
    </svg>
  );
}
