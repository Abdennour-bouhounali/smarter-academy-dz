import React from 'react';

const SPINES = ['#4F46E5', '#0EA5E9', '#F59E0B', '#10B981', '#E11D48', '#8B5CF6', '#14B8A6', '#F97316'];
const PER_SHELF = 14;
const SHELVES = [92, 148, 204];

/**
 * La bibliothèque de la mission « 756 كتابًا » — dessinée en code (CLAUDE.md : aucune image générée dans les leçons).
 * `fill` ∈ [0, 1] : la part des rayons déjà garnie. Elle SUIT les outils gagnés : la scène se lit, elle ne décore pas.
 * Les rayons se remplissent, la pile de cartons s'efface d'autant. Le texte arabe reste dans le DOM, hors du SVG.
 */
export default function LibraryScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const books = Math.round(f * PER_SHELF * SHELVES.length);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)}>
      <rect x="0" y="0" width="480" height="226" fill="#EEF2FF" />
      <rect x="0" y="226" width="480" height="34" fill="#E2E8F0" />
      {/* l'étagère, vide au départ */}
      <rect x="262" y="34" width="190" height="192" rx="6" fill="#92400E" />
      <rect x="272" y="44" width="170" height="178" fill="#FEF3C7" />
      {SHELVES.map((y, s) => (
        <g key={y}>
          <rect x="272" y={y} width="170" height="8" fill="#B45309" />
          {Array.from({ length: Math.max(0, Math.min(PER_SHELF, books - s * PER_SHELF)) }, (_, i) => (
            <rect key={i} x={276 + i * 11.8} y={y - 40 + (i % 3) * 2} width="10" height={40 - (i % 3) * 2} rx="1.5"
              fill={SPINES[(i + s * 3) % SPINES.length]} />
          ))}
        </g>
      ))}
      {/* la pile de cartons : 756 livres à ranger */}
      <g opacity={1 - f * 0.85} data-library-pile>
        <rect x="40" y="166" width="96" height="60" rx="4" fill="#D97706" />
        <rect x="136" y="176" width="80" height="50" rx="4" fill="#F59E0B" />
        <rect x="70" y="116" width="90" height="50" rx="4" fill="#FBBF24" />
        {[44, 144, 74].map((x, i) => <rect key={x} x={x + 4} y={[194, 199, 139][i]} width={[88, 72, 82][i]} height="4" fill="#92400E" opacity="0.35" />)}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={80 + i * 14} y={100 - (i % 2) * 6} width="10" height={22 + (i % 2) * 6} rx="1.5" fill={SPINES[i]} />
        ))}
        <text x="88" y="208" textAnchor="middle" fontSize="26" fontWeight="900" fill="#FFFBEB" direction="ltr">756</text>
      </g>
    </svg>
  );
}
