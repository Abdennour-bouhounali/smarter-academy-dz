import React from 'react';

/**
 * La vignette de la carte d'activité (décor, `aria-hidden`) : le téléphérique de قسنطينة — un câble
 * droit tendu depuis la station, une cabine rouge, le pont et les falaises. Dessinée, jamais générée
 * (CLAUDE.md racine) ; elle ne porte aucune information mathématique.
 */
export default function CableCarVignette() {
  return (
    <svg viewBox="0 0 160 90" width="100%" height="100%" aria-hidden="true" focusable="false">
      <rect width="160" height="90" rx="10" fill="#E0F2FE" />
      <path d="M0 90 L0 58 Q18 48 30 60 L30 90 Z" fill="#A8A29E" />
      <path d="M160 90 L160 40 Q140 34 128 46 L128 90 Z" fill="#A8A29E" />
      <path d="M30 66 Q79 50 128 66" fill="none" stroke="#78716C" strokeWidth="3" />
      <rect x="10" y="44" width="16" height="14" rx="2" fill="#F8FAFC" stroke="#334155" />
      <line x1="18" y1="44" x2="150" y2="14" stroke="#1E293B" strokeWidth="2.2" />
      <g transform="translate(88 28)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#1E293B" strokeWidth="1.4" />
        <rect x="-10" y="8" width="20" height="14" rx="3" fill="#DC2626" stroke="#7F1D1D" />
        <rect x="-7" y="11" width="6" height="5" rx="1" fill="#E0F2FE" />
        <rect x="1" y="11" width="6" height="5" rx="1" fill="#E0F2FE" />
      </g>
      <circle cx="18" cy="44" r="3" fill="#FBBF24" stroke="#0F172A" />
    </svg>
  );
}
