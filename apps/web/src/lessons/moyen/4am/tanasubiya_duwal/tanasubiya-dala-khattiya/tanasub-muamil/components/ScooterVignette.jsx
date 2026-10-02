import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : le kornich des Sablettes, la mer, un
 * palmier, une trottinette et sa borne de location. DÉCORATIVE (`aria-hidden`), dessinée en SVG : la
 * même trottinette que le lab ratio-ride.
 */
export default function ScooterVignette({ className = '' }) {
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#E0F2FE" />
      <circle cx="170" cy="22" r="11" fill="#FDE047" />
      <rect x="0" y="44" width="200" height="26" fill="#0EA5E9" />
      <path d="M0 54 q 8 -4 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" fill="none" stroke="#BAE6FD" strokeWidth="1.4" />
      <rect x="0" y="70" width="200" height="40" fill="#E7D7BC" />
      <rect x="0" y="68" width="200" height="3" fill="#F8FAFC" />
      <path d="M26 104 Q24 80 28 58" stroke="#92400E" strokeWidth="4" fill="none" />
      <path d="M28 58 Q14 52 8 60 M28 58 Q42 50 46 60 M28 58 Q20 44 12 46 M28 58 Q36 42 44 46" stroke="#15803D" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* la borne de location : 15DA للدقيقة (aucun texte : le prix est dans la carte) */}
      <rect x="150" y="66" width="18" height="34" rx="4" fill="#0F766E" />
      <rect x="153" y="70" width="12" height="9" rx="2" fill="#A7F3D0" />
      {/* la trottinette */}
      <g transform="translate(86 62)">
        <circle cx="12" cy="9" r="6" fill="#F2C9A0" />
        <path d="M6 16 Q12 13 18 16 L19 32 L7 32 Z" fill="#7C3AED" />
        <path d="M9 32 L7 44 M16 32 L15 44" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
        <path d="M27 12 L25 46" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <rect x="-4" y="44" width="32" height="4" rx="2" fill="#0F766E" />
        <circle cx="-1" cy="51" r="5.5" fill="#1E293B" /><circle cx="26" cy="51" r="5.5" fill="#1E293B" />
      </g>
    </svg>
  );
}
