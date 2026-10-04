import React, { useId } from 'react';

/**
 * La vignette de la carte d'activité : à gauche la fenêtre de Descartes en petits carreaux, une mouche posée sur un
 * carreau (deux nombres suffisent à dire où) ; à droite un téléphone et son appli de livraison — le même quadrillage
 * devenu un quartier, un scooter qui va d'un restaurant à une maison en marches horizontale puis verticale. Décor
 * DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function DeliveryVignette() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`dv-sky-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFEDD5" /><stop offset="1" stopColor="#FED7AA" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="120" rx="12" fill={`url(#dv-sky-${uid})`} />
      {/* la fenêtre de Descartes et sa mouche */}
      <rect x="14" y="16" width="78" height="88" rx="4" fill="#E0F2FE" stroke="#92400E" strokeWidth="4" />
      {[1, 2, 3].map((i) => <line key={`v${i}`} x1={14 + i * 19.5} y1="16" x2={14 + i * 19.5} y2="104" stroke="#92400E" strokeWidth="1.6" />)}
      {[1, 2, 3].map((i) => <line key={`h${i}`} x1="14" y1={16 + i * 22} x2="92" y2={16 + i * 22} stroke="#92400E" strokeWidth="1.6" />)}
      <g transform="translate(62 46)">
        <ellipse cx="-3" cy="-3" rx="4" ry="2.4" fill="#BFDBFE" opacity="0.9" transform="rotate(-30)" />
        <ellipse cx="3" cy="-3" rx="4" ry="2.4" fill="#BFDBFE" opacity="0.9" transform="rotate(30)" />
        <circle cx="0" cy="0" r="3" fill="#0F172A" />
      </g>
      {/* le téléphone et l'appli de livraison */}
      <rect x="132" y="8" width="92" height="104" rx="14" fill="#0F172A" />
      <rect x="138" y="18" width="80" height="84" rx="6" fill="#F5EBDD" />
      {[0, 1, 2, 3, 4].map((i) => <line key={`gv${i}`} x1={138 + i * 20} y1="18" x2={138 + i * 20} y2="102" stroke="#FFFFFF" strokeWidth="2.4" />)}
      {[0, 1, 2, 3, 4].map((i) => <line key={`gh${i}`} x1="138" y1={18 + i * 21} x2="218" y2={18 + i * 21} stroke="#FFFFFF" strokeWidth="2.4" />)}
      <polyline points="158,81 198,81 198,39" fill="none" stroke="#0EA5E9" strokeWidth="3.4" strokeLinejoin="round" strokeDasharray="5 4" />
      <line x1="158" y1="81" x2="196" y2="42" stroke="#7C3AED" strokeWidth="2.6" />
      <path d="M198 39 C 192 33, 193 26, 198 26 C 203 26, 204 33, 198 39 Z" fill="#7C3AED" />
      <rect x="151" y="76" width="14" height="9" rx="1.5" fill="#FFFFFF" stroke="#E11D48" strokeWidth="1.2" />
      <g transform="translate(184 79)">
        <circle cx="-5" cy="4" r="2.4" fill="#0F172A" /><circle cx="5" cy="4" r="2.4" fill="#0F172A" />
        <rect x="-8" y="-6" width="7" height="7" rx="1" fill="#F97316" />
        <circle cx="1.5" cy="-6" r="2.6" fill="#1E293B" />
      </g>
      <rect x="160" y="11" width="36" height="4" rx="2" fill="#F97316" />
    </svg>
  );
}
