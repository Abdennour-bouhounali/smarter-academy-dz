import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
const TABLE_Y = 176;
const PORTIONS = 7;

/** Une portion de pâte, toutes identiques : la même part de sucre et de farine. */
function Portion({ x }) {
  const y = TABLE_Y - 14;
  return (
    <g data-portion>
      <ellipse cx={x} cy={y} rx="16" ry="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      <path d={`M ${x - 9} ${y - 2} Q ${x} ${y - 7} ${x + 9} ${y - 2}`} fill="none" stroke="#F59E0B" strokeWidth="1.5" />
    </g>
  );
}

/**
 * La boulangerie de la mission « عجينة الخبّاز » (leçon ikhtizal-kasr, rollout 2026-11-09) — dessinée en code (CLAUDE.md : aucune image générée
 * dans les leçons). Deux sacs (sucre, farine) qui baissent, et sur le plateau des PORTIONS IDENTIQUES qui apparaissent une à une à mesure que les
 * outils sont gagnés ; un boulanger dessiné par `KidFigure`. `fill` ∈ [0, 1]. Aucun nombre de la مسألة (ni 105, ni 147, ni le nombre de portions)
 * n'est dessiné ; le texte arabe reste dans le DOM, hors du SVG.
 */
export default function BakeryScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const made = Math.round(f * PORTIONS);
  const level = 1 - f * 0.7;
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="bakery">
      <rect x="0" y="0" width="480" height={GROUND} fill="#FFF7ED" />
      {/* le four */}
      <rect x="330" y="24" width="120" height="96" rx="10" fill="#78350F" />
      <rect x="346" y="44" width="88" height="56" rx="8" fill="#F97316" opacity="0.8" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#E7E5E4" />
      {/* les deux sacs : sucre (blanc) et farine (crème), qui baissent */}
      {[{ x: 150, c: '#FFFFFF' }, { x: 196, c: '#FEF3C7' }].map(({ x, c }) => (
        <g key={x}>
          <path d={`M ${x} ${TABLE_Y} L ${x + 4} ${TABLE_Y - 60} L ${x + 36} ${TABLE_Y - 60} L ${x + 40} ${TABLE_Y} Z`} fill="#D6D3D1" stroke="#A8A29E" />
          <rect x={x + 4} y={TABLE_Y - 58 * level} width="32" height={58 * level} fill={c} opacity="0.95" />
        </g>
      ))}
      {/* la table et le plateau */}
      <rect x="140" y={TABLE_Y} width="332" height="10" rx="3" fill="#92400E" />
      <rect x="152" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      <rect x="452" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      <rect x="248" y={TABLE_Y - 4} width="214" height="5" rx="2" fill="#94A3B8" />
      {Array.from({ length: made }, (_, i) => <Portion key={i} x={266 + i * 29} />)}
      {Array.from({ length: PORTIONS - made }, (_, i) => (
        <ellipse key={`e${i}`} cx={266 + (made + i) * 29} cy={TABLE_Y - 14} rx="16" ry="10" fill="none" stroke="#D6D3D1" strokeDasharray="3 3" />
      ))}
      <KidFigure cx={80} top={84} foot={GROUND} outfit="orange" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
