import React from 'react';

/**
 * La vignette de la carte d'activité (décor, `aria-hidden`) : deux rampes parallèles d'une حديقة التزلّج — l'une
 * part du sol, l'autre d'une base de béton — et un skateur. Dessinée, jamais générée (CLAUDE.md racine) ; elle
 * ne porte aucune information mathématique.
 */
export default function SkateVignette() {
  return (
    <svg viewBox="0 0 160 90" width="100%" height="100%" aria-hidden="true" focusable="false">
      <rect width="160" height="90" rx="10" fill="#FFF7ED" />
      <rect x="0" y="74" width="160" height="16" fill="#D6D3D1" />
      <path d="M14 74 L74 44 L74 74 Z" fill="#E7E5E4" stroke="#A8A29E" />
      <line x1="14" y1="74" x2="74" y2="44" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="82" y="60" width="10" height="14" fill="#A8A29E" />
      <path d="M86 60 L146 30 L146 74 L86 74 Z" fill="#FED7AA" stroke="#C2410C" />
      <line x1="86" y1="60" x2="146" y2="30" stroke="#7C2D12" strokeWidth="3" />
      <g transform="translate(118 44) rotate(-26)">
        <rect x="-9" y="-4" width="18" height="3" rx="1.5" fill="#1F2937" />
        <circle cx="-5" cy="0" r="1.8" fill="#F59E0B" />
        <circle cx="5" cy="0" r="1.8" fill="#F59E0B" />
        <path d="M-3 -5 L0 -12 L3 -5" fill="none" stroke="#0F172A" strokeWidth="2" />
        <rect x="-3.5" y="-20" width="7" height="9" rx="2" fill="#16A34A" />
        <circle cx="0" cy="-24" r="3.4" fill="#F5D0A9" stroke="#0F172A" strokeWidth="0.8" />
        <path d="M-3.6 -25 Q0 -30 3.6 -25 Z" fill="#DC2626" />
      </g>
    </svg>
  );
}
