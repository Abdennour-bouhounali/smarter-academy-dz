import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
const TABLE_Y = 172;
const PAIRS = 4;

/** Une PAIRE de tuiles (deux nombres cachés) : grise tant qu'on ne sait pas la juger, liée par un trait vert « ✓ » quand l'outil est gagné. */
function TilePair({ x, judged }) {
  const tile = (dx) => (
    <rect x={x + dx} y={TABLE_Y - 34} width="22" height="30" rx="4" fill={judged ? '#ECFDF5' : '#F8FAFC'} stroke={judged ? '#10B981' : '#CBD5E1'} strokeWidth="2" />
  );
  return (
    <g data-tile-pair data-judged={judged ? 'true' : 'false'}>
      {tile(0)}
      {tile(28)}
      {judged ? (
        <>
          <path d={`M ${x + 22} ${TABLE_Y - 19} L ${x + 28} ${TABLE_Y - 19}`} stroke="#10B981" strokeWidth="3" />
          <circle cx={x + 25} cy={TABLE_Y - 46} r="8" fill="#10B981" />
          <path d={`M ${x + 21} ${TABLE_Y - 46} L ${x + 24} ${TABLE_Y - 43} L ${x + 29} ${TABLE_Y - 50}`} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <text x={x + 25} y={TABLE_Y - 42} textAnchor="middle" fontSize="14" fontWeight="900" fill="#94A3B8">?</text>
      )}
    </g>
  );
}

/**
 * Le club de mathématiques de la mission « لعبة الزوج الرابح » (leçon awwaliyan-fima-baynahuma, rollout 2026-11-09) — dessiné en code
 * (CLAUDE.md : aucune image générée dans les leçons). Un tableau, une table ; sur la table, des PAIRES de tuiles numérotées (jamais des cartes
 * à jouer) qui passent du « ? » au « ✓ » à mesure que les outils sont gagnés : on sait de mieux en mieux JUGER une paire. Une élève du club
 * dessinée par `KidFigure` (tenue islamique). `fill` ∈ [0, 1]. Aucun nombre de la مسألة n'est dessiné ; le texte arabe reste dans le DOM.
 */
export default function MathClubScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const judged = Math.round(f * PAIRS);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="math-club">
      <rect x="0" y="0" width="480" height={GROUND} fill="#EEF2FF" />
      {/* le tableau du club : PGCD = 1, écrit à la craie */}
      <rect x="196" y="22" width="250" height="96" rx="8" fill="#1E3A2F" stroke="#A16207" strokeWidth="6" />
      <text x="321" y="80" textAnchor="middle" fontSize="26" fontWeight="800" fill="#F8FAFC" fontFamily="monospace" opacity={0.35 + 0.65 * f}>PGCD = 1</text>
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#E2E8F0" />
      {/* la table */}
      <rect x="170" y={TABLE_Y} width="296" height="10" rx="3" fill="#7C3AED" />
      <rect x="182" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#5B21B6" />
      <rect x="446" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#5B21B6" />
      {Array.from({ length: PAIRS }, (_, i) => <TilePair key={i} x={190 + i * 68} judged={i < judged} />)}
      <KidFigure cx={96} top={84} foot={GROUND} hairStyle="hijab" scarf="lavender" outfit="teal" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
