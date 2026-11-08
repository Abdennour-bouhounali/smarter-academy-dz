import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const SPINES = ['#4F46E5', '#0EA5E9', '#F59E0B', '#10B981', '#E11D48', '#8B5CF6', '#14B8A6', '#F97316'];
const PER_SHELF = 12;
const SHELVES = [76, 124, 172, 220];

/**
 * Le mur de la bibliothèque de la mission « 96 كتابًا » (leçon qawasim-adad-tabii, rollout 2026-11-08) — dessiné en code
 * (CLAUDE.md : aucune image générée dans les leçons). La bibliothécaire est `KidFigure` (fille en hijab et tunique longue).
 * `fill` ∈ [0, 1] : la part du mur déjà garnie — elle SUIT les outils gagnés ; le chariot de cartons s'efface d'autant.
 * Les rangées dessinées sont celles d'un mur ordinaire : la scène ne donne aucun nombre de la مسألة (ni le nombre de rangées
 * demandé, ni les capacités des rayons). Le texte arabe reste dans le DOM, hors du SVG.
 */
export default function LibraryWallScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const books = Math.round(f * PER_SHELF * SHELVES.length);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="library-wall">
      <rect x="0" y="0" width="480" height="232" fill="#FEF3C7" />
      <rect x="0" y="232" width="480" height="28" fill="#E2E8F0" />
      {/* le mur à garnir : quatre planches vides au départ */}
      <rect x="262" y="34" width="196" height="198" rx="6" fill="#92400E" />
      <rect x="272" y="44" width="176" height="184" fill="#FFFBEB" />
      {SHELVES.map((y, s) => (
        <g key={y}>
          <rect x="272" y={y} width="176" height="7" fill="#B45309" />
          {Array.from({ length: Math.max(0, Math.min(PER_SHELF, books - s * PER_SHELF)) }, (_, i) => (
            <rect key={i} x={277 + i * 14.2} y={y - 36 + (i % 3) * 2} width="11" height={36 - (i % 3) * 2} rx="1.5"
              fill={SPINES[(i + s * 3) % SPINES.length]} />
          ))}
        </g>
      ))}
      {/* le chariot de cartons : 96 livres à ranger */}
      <g opacity={1 - f * 0.85} data-library-pile>
        <rect x="150" y="176" width="100" height="56" rx="5" fill="#D97706" />
        <rect x="160" y="136" width="80" height="40" rx="4" fill="#FBBF24" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={168 + i * 16} y={118 - (i % 2) * 5} width="11" height={20 + (i % 2) * 5} rx="1.5" fill={SPINES[i + 2]} />)}
        <rect x="150" y="200" width="100" height="5" fill="#92400E" opacity="0.3" />
        <text x="200" y="196" textAnchor="middle" fontSize="26" fontWeight="900" fill="#FFFBEB" direction="ltr">96</text>
        <circle cx="166" cy="236" r="7" fill="#475569" /><circle cx="234" cy="236" r="7" fill="#475569" />
      </g>
      {/* la bibliothécaire, qui compte sur le mur */}
      <KidFigure cx={86} top={84} foot={232} hairStyle="hijab" scarf="rose" outfit="green" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
