import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const BRICKS = ['#C2410C', '#EA580C', '#B45309', '#DC2626', '#D97706'];
const COURSES = 6;
const PER_COURSE = 7;
const BRICK_W = 26;
const BRICK_H = 14;
const WALL_X = 262;
const GROUND = 232;

/** Les briques du mur dans l'ordre où on les pose : rangée par rangée de bas en haut, une rangée sur deux décalée d'une demi-brique. */
const SLOTS = Array.from({ length: COURSES }, (_, row) => Array.from({ length: PER_COURSE - (row % 2) }, (_, col) => ({
  row, col, x: WALL_X + col * BRICK_W + (row % 2 ? BRICK_W / 2 : 0), y: GROUND - (row + 1) * BRICK_H,
}))).flat();

/**
 * Le chantier de la mission « ورشة البناء » (leçon khawass-qawasim, rollout 2026-11-08) — dessiné en code (CLAUDE.md : aucune image
 * générée dans les leçons). Un mur en briques posées en quinconce, une pile de briques, un apprenti dessiné par `KidFigure`.
 * `fill` ∈ [0, 1] : la part du mur déjà bâtie — elle SUIT les outils gagnés ; la pile s'efface d'autant. La scène ne montre aucun
 * nombre de la مسألة (ni les longueurs des murs, ni leur nombre de rangées) ; seule la brique de 25 porte son nom. Le texte arabe
 * reste dans le DOM, hors du SVG.
 */
export default function ConstructionWallScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const laid = Math.round(f * SLOTS.length);
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="construction-wall">
      <rect x="0" y="0" width="480" height={GROUND} fill="#E0F2FE" />
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#D6D3D1" />
      {/* le mur en construction : le cadre pointillé, puis les briques posées une à une */}
      <rect x={WALL_X - 6} y={GROUND - COURSES * BRICK_H - 8} width={PER_COURSE * BRICK_W + 12} height={COURSES * BRICK_H + 8} fill="none" stroke="#94A3B8" strokeDasharray="4 4" />
      {SLOTS.slice(0, laid).map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={BRICK_W - 2} height={BRICK_H - 2} rx="1.5" fill={BRICKS[(s.col * 3 + s.row) % BRICKS.length]} />
      ))}
      {/* la pile de briques à poser */}
      <g opacity={1 - f * 0.85} data-library-pile>
        {[0, 1, 2].map((r) => Array.from({ length: 4 - r }, (_, c) => (
          <rect key={`${r}-${c}`} x={150 + c * 30 + r * 15} y={GROUND - (r + 1) * 16} width="28" height="14" rx="1.5" fill={BRICKS[(r + c) % BRICKS.length]} />
        )))}
        <text x="195" y={GROUND - 58} textAnchor="middle" fontSize="20" fontWeight="900" fill="#7C2D12" direction="ltr">25</text>
      </g>
      <KidFigure cx={86} top={84} foot={GROUND} outfit="orange" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
