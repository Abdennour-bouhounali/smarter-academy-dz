import React from 'react';

/**
 * La vignette de la carte d'activité : un téléphone ouvert sur une appli de localisation — la mer en haut, les rues en
 * quadrillage, deux épingles d'amis qui partagent leur position, la ligne droite entre eux et le drapeau du rendez-vous
 * à mi-chemin ; une bulle de discussion. Décor DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même
 * monde que le lab (midpoint-distance, `gps-meet`). Aucun identifiant SVG (la vignette peut figurer deux fois).
 */
export default function GpsVignette() {
  const A = [70, 86]; const B = [150, 40]; const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const pin = ([x, y], c) => (
    <g>
      <path d={`M${x} ${y} C${x - 2} ${y - 6} ${x - 8} ${y - 9} ${x - 8} ${y - 15} A8 8 0 1 1 ${x + 8} ${y - 15} C${x + 8} ${y - 9} ${x + 2} ${y - 6} ${x} ${y} Z`} fill={c} stroke="#fff" strokeWidth="1.2" />
      <circle cx={x} cy={y - 15} r="4.5" fill="#FDE68A" />
    </g>
  );
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#E0F2FE" />
      <rect x="40" y="6" width="150" height="108" rx="14" fill="#0F172A" />
      <rect x="46" y="14" width="138" height="92" rx="8" fill="#F8FAFC" />
      <rect x="46" y="14" width="138" height="16" rx="8" fill="#7DD3FC" />
      <path d="M46 30 Q115 34 184 30 V34 H46 Z" fill="#FEF3C7" />
      {[60, 80, 100, 120, 140, 160].map((x) => <line key={`v${x}`} x1={x} y1={34} x2={x} y2={106} stroke="#CBD5E1" strokeWidth="1" />)}
      {[46, 62, 78, 94].map((y) => <line key={`h${y}`} x1={46} y1={y} x2={184} y2={y} stroke="#CBD5E1" strokeWidth="1" />)}
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#0284C7" strokeWidth="2" strokeDasharray="4 3" />
      <path d={`M${A[0]} ${A[1]} H${B[0]} V${B[1]}`} fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.6" />
      {pin(A, '#4F46E5')}
      {pin(B, '#E11D48')}
      <g transform={`translate(${M[0]} ${M[1]})`}>
        <line x1="0" y1="0" x2="0" y2="-16" stroke="#0F172A" strokeWidth="1.6" />
        <path d="M0 -16 L12 -12 L0 -8 Z" fill="#D97706" />
        <circle r="3" fill="#D97706" />
      </g>
      <g transform="translate(196 22)">
        <rect x="-4" y="0" width="40" height="22" rx="8" fill="#FFFFFF" stroke="#94A3B8" />
        <path d="M4 22 L0 30 L12 22 Z" fill="#FFFFFF" stroke="#94A3B8" />
        <circle cx="8" cy="11" r="2.4" fill="#4F46E5" /><circle cx="16" cy="11" r="2.4" fill="#D97706" /><circle cx="24" cy="11" r="2.4" fill="#E11D48" />
      </g>
      <g transform="translate(14 70)">
        <circle cx="10" cy="30" r="5" fill="#0F172A" /><circle cx="28" cy="30" r="5" fill="#0F172A" />
        <path d="M10 30 L24 30 L28 12 L32 12" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
