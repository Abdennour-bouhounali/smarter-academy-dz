import React from 'react';

/**
 * La vignette de la carte d'activité : la projection en plein air du quartier — le projecteur, sa
 * lumière, la grande toile sur le mur, une toile mobile dans le faisceau, le public, la guirlande.
 * Décor DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function CinemaVignette() {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#1E1B4B" />
      <path d="M8 10 Q120 30 232 10" fill="none" stroke="#64748B" />
      {[20, 46, 72, 98, 124, 150, 176, 202, 224].map((x, i) => <circle key={x} cx={x} cy={14 + (i % 3) * 3} r="3" fill={['#FBBF24', '#F472B6', '#4ADE80'][i % 3]} />)}
      <rect x="182" y="26" width="46" height="66" fill="#F8FAFC" stroke="#CBD5E1" />
      <polygon points="40,64 182,26 182,92" fill="#FDE68A" opacity="0.35" />
      <line x1="118" y1="43" x2="118" y2="80" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <rect x="18" y="56" width="22" height="16" rx="3" fill="#94A3B8" />
      <circle cx="40" cy="64" r="4" fill="#FBBF24" />
      {[70, 94, 140, 164].map((x) => <path key={x} d={`M${x - 10} 120 q10 -22 20 0 z`} fill="#334155" />)}
    </svg>
  );
}
