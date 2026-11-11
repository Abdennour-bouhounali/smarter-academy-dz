import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
const TABLE_Y = 170;
const BAGS = 5;
const PEN = ['#2563EB', '#DC2626', '#16A34A'];

/** Un cartable fermé (rempli) ou ouvert et vide. */
function Bag({ x, filled }) {
  const y = TABLE_Y - 44;
  return (
    <g data-bag={filled ? 'full' : 'empty'}>
      <path d={`M ${x + 9} ${y} Q ${x + 21} ${y - 13} ${x + 33} ${y}`} fill="none" stroke={filled ? '#7C2D12' : '#CBD5E1'} strokeWidth="3" />
      <rect x={x} y={y} width="42" height="44" rx="7" fill={filled ? '#F97316' : 'none'} stroke={filled ? '#C2410C' : '#CBD5E1'} strokeWidth="2" strokeDasharray={filled ? undefined : '4 3'} />
      {filled && (
        <>
          <rect x={x + 4} y={y + 14} width="34" height="16" rx="3" fill="#FDBA74" />
          {/* ce qui dépasse : deux stylos et un cahier, dans CHAQUE cartable */}
          <rect x={x + 8} y={y - 9} width="3" height="14" rx="1" fill={PEN[0]} />
          <rect x={x + 13} y={y - 7} width="3" height="12" rx="1" fill={PEN[1]} />
          <rect x={x + 21} y={y - 8} width="14" height="10" rx="1" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
        </>
      )}
    </g>
  );
}

/**
 * La salle de la mission « حقائب التضامن » (leçon tayin-pgcd, rollout 2026-11-08) — dessinée en code (CLAUDE.md : aucune image générée dans
 * les leçons). Une table où des cartables IDENTIQUES se remplissent un à un (chacun avec les mêmes stylos et le même cahier), une pile de
 * stylos et de cahiers qui diminue, un bénévole dessiné par `KidFigure`. `fill` ∈ [0, 1] suit les outils gagnés. Aucun nombre de la مسألة
 * (ni 90, ni 126, ni le nombre de cartables) n'est dessiné ; le texte arabe reste dans le DOM, hors du SVG.
 */
export default function SchoolBagsScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const filled = Math.round(f * BAGS);
  const pile = Math.round((1 - f * 0.8) * 6);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="school-bags">
      <rect x="0" y="0" width="480" height={GROUND} fill="#FEF9C3" />
      {/* le tableau de la salle */}
      <rect x="170" y="22" width="270" height="80" rx="6" fill="#166534" stroke="#A16207" strokeWidth="5" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#E7E5E4" />
      {/* la table */}
      <rect x="150" y={TABLE_Y} width="318" height="10" rx="3" fill="#92400E" />
      <rect x="164" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      <rect x="446" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      {/* la pile à répartir : cahiers et stylos */}
      {Array.from({ length: pile }, (_, i) => (
        <rect key={`n${i}`} x="158" y={TABLE_Y - 6 - i * 6} width="40" height="6" rx="1" fill={i % 2 ? '#BAE6FD' : '#E0F2FE'} stroke="#0284C7" strokeWidth="0.8" />
      ))}
      {Array.from({ length: pile }, (_, i) => (
        <rect key={`p${i}`} x={206 + i * 5} y={TABLE_Y - 22} width="3" height="22" rx="1" fill={PEN[i % PEN.length]} />
      ))}
      {Array.from({ length: BAGS }, (_, i) => <Bag key={i} x={248 + i * 44} filled={i < filled} />)}
      <KidFigure cx={86} top={84} foot={GROUND} outfit="blue" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
