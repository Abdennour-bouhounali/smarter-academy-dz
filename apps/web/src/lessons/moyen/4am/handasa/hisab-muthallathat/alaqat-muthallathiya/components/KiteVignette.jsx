import React from 'react';

/**
 * La vignette de l'activité (MissionBrief.visual) : la plage, la mer, un enfant et son cerf-volant au bout d'un fil
 * tendu — le fil, la hauteur et le sable dessinent un triangle rectangle. DESSINÉE, jamais générée ; décorative
 * (`aria-hidden`), elle ne porte aucune réponse (aucune longueur, aucun angle).
 */
export default function KiteVignette() {
  return (
    <svg viewBox="0 0 240 110" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="110" rx="12" fill="#bae6fd" />
      <circle cx="206" cy="22" r="12" fill="#fde68a" />
      <rect x="0" y="62" width="240" height="18" fill="#38bdf8" opacity="0.55" />
      <path d="M 0 66 q 15 -4 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="#e0f2fe" strokeWidth="1.5" />
      <rect x="0" y="80" width="240" height="30" fill="#fde68a" />
      <line x1="62" y1="22" x2="62" y2="86" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <line x1="62" y1="86" x2="168" y2="86" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <polyline points="62,80 68,80 68,86" fill="none" stroke="#e11d48" strokeWidth="1.2" />
      <line x1="62" y1="24" x2="166" y2="74" stroke="#7c3aed" strokeWidth="1.6" />
      <g transform="translate(62 24)">
        <path d="M 0 -18 L 9 -6 L 0 6 L -9 -6 Z" fill="#059669" stroke="#0f172a" strokeWidth="1" />
        <path d="M 0 -18 L 9 -6 L 0 -6 Z" fill="#f8fafc" />
        <circle cx="1" cy="-6" r="2.4" fill="#e11d48" />
        <path d="M 0 6 q 4 5 0 9 q -4 4 1 9" fill="none" stroke="#e11d48" strokeWidth="1.2" />
      </g>
      <g transform="translate(170 86)">
        <circle cx="0" cy="-26" r="4.5" fill="#92400e" />
        <path d="M 0 -22 L 0 -10 M 0 -10 L -4 0 M 0 -10 L 4 0 M 0 -18 L -5 -12" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="-3.5" y="-22" width="7" height="9" rx="2" fill="#e11d48" />
      </g>
    </svg>
  );
}
