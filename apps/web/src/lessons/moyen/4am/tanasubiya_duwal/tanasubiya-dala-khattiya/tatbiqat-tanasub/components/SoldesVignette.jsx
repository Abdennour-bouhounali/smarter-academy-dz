import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : la vitrine des soldes du centre
 * commercial — l'auvent vert-blanc-rouge, une paire de baskets, le maillot de l'équipe nationale
 * et une étiquette « % » qui pend. DÉCORATIVE (`aria-hidden`), dessinée en SVG — le même monde que
 * le laboratoire au-dessous ; aucun prix n'y figure (les nombres se lisent dans le texte).
 */
export default function SoldesVignette({ className = '' }) {
  return (
    <svg viewBox="0 0 200 110" className={`h-24 w-auto ${className}`} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="200" height="110" rx="12" fill="#FFFBEB" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={10 + i * 15} y="8" width="15" height="14" fill={['#16A34A', '#FFFFFF', '#DC2626'][i % 3]} />)}
      <rect x="10" y="22" width="180" height="78" rx="4" fill="#E0F2FE" stroke="#94A3B8" strokeWidth="2" />
      {/* le maillot */}
      <g transform="translate(26 34)">
        <path d="M10 2 L16 0 Q20 5 24 0 L30 2 L40 10 L34 18 L31 15 L31 40 L9 40 L9 15 L6 18 L0 10 Z" fill="#FFFFFF" stroke="#15803D" strokeWidth="1.6" />
        <path d="M9 15 L9 40 L20 40 L20 1.6 Q18 4 16 0 L10 2 Z" fill="#16A34A" />
      </g>
      {/* les baskets */}
      <g transform="translate(84 62)">
        <path d="M0 18 Q0 10 8 10 L16 2 Q20 0 22 4 L26 10 Q36 11 40 16 L40 21 L0 21 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" />
        <path d="M0 21 L40 21 L40 25 L0 25 Z" fill="#F97316" />
      </g>
      {/* l'étiquette « % » qui pend */}
      <line x1="160" y1="22" x2="160" y2="34" stroke="#64748B" />
      <g transform="rotate(-8 160 34)">
        <path d="M146 34 L174 34 L180 48 L174 62 L146 62 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
        <circle cx="151" cy="48" r="2.5" fill="#FFFFFF" stroke="#B45309" />
        <text x="166" y="53" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#B45309" fontFamily="ui-monospace, monospace">%</text>
      </g>
      {/* des pièces */}
      <circle cx="140" cy="88" r="7" fill="#FBBF24" stroke="#B45309" strokeWidth="1.4" />
      <circle cx="154" cy="90" r="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.2" />
    </svg>
  );
}
