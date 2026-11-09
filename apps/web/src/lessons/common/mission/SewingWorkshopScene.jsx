import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const GROUND = 232;
const TABLE_Y = 176;
const X0 = 168;
const UNIT = 40;
/** Deux rubans en unités de la plus longue pièce commune (dessin symbolique, ni 210 ni 150). */
const LONG = 7;
const SHORT = 5;
const STEPS = LONG + SHORT;

/** Un ruban : `cut` pièces séparées (avec un petit jour entre elles), le reste encore d'un seul tenant. */
function Ribbon({ y, units, cut, color, edge }) {
  return (
    <g>
      {Array.from({ length: units }, (_, i) => {
        const piece = i < cut;
        return (
          <rect key={i} x={X0 + i * UNIT + (piece ? 2 : 0)} y={y} width={piece ? UNIT - 4 : UNIT} height="16" rx={piece ? 3 : 0}
            fill={color} stroke={edge} strokeWidth="1" data-piece={piece ? 'cut' : 'whole'} />
        );
      })}
      {/* la broderie dorée */}
      <line x1={X0} y1={y + 8} x2={X0 + units * UNIT} y2={y + 8} stroke="#FACC15" strokeWidth="1.5" strokeDasharray="5 4" />
    </g>
  );
}

/**
 * L'atelier de la mission « ورشة الخياطة » (leçon bahth-pgcd, rollout 2026-11-08) — dessiné en code (CLAUDE.md : aucune image générée dans les
 * leçons). Deux rubans brodés sur la table de coupe, qui se coupent en pièces TOUTES ÉGALES à mesure que les outils sont gagnés ; des ciseaux ;
 * une couturière dessinée par `KidFigure` (hijab). `fill` ∈ [0, 1]. Aucun nombre de la مسألة (ni 210, ni 150, ni la longueur des pièces) n'est
 * dessiné ; le texte arabe reste dans le DOM, hors du SVG.
 */
export default function SewingWorkshopScene({ fill = 0, label, className = '' }) {
  const f = Math.max(0, Math.min(1, fill));
  const cuts = Math.round(f * STEPS);
  const cutLong = Math.min(LONG, cuts);
  const cutShort = Math.max(0, Math.min(SHORT, cuts - LONG));
  return (
    <svg viewBox="0 0 480 260" className={className} role="img" aria-label={label} data-library-fill={f.toFixed(2)} data-scene="sewing-workshop">
      <rect x="0" y="0" width="480" height={GROUND} fill="#F5F3FF" />
      {/* l'étagère des bobines */}
      <rect x="180" y="40" width="270" height="6" rx="2" fill="#A16207" />
      {['#E11D48', '#2563EB', '#16A34A', '#F59E0B', '#7C3AED', '#0891B2'].map((c, i) => (
        <g key={c}>
          <rect x={196 + i * 42} y="18" width="18" height="22" rx="3" fill={c} />
          <rect x={193 + i * 42} y="16" width="24" height="4" rx="1" fill="#D6D3D1" />
          <rect x={193 + i * 42} y="38" width="24" height="4" rx="1" fill="#D6D3D1" />
        </g>
      ))}
      <rect x="0" y={GROUND} width="480" height={260 - GROUND} fill="#E7E5E4" />
      {/* la table de coupe */}
      <rect x="150" y={TABLE_Y} width="322" height="10" rx="3" fill="#92400E" />
      <rect x="162" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      <rect x="452" y={TABLE_Y + 10} width="8" height={GROUND - TABLE_Y - 10} fill="#78350F" />
      <Ribbon y={TABLE_Y - 58} units={LONG} cut={cutLong} color="#F472B6" edge="#BE185D" />
      <Ribbon y={TABLE_Y - 30} units={SHORT} cut={cutShort} color="#60A5FA" edge="#1D4ED8" />
      {/* les ciseaux */}
      <g transform={`translate(${X0 + SHORT * UNIT + 30} ${TABLE_Y - 26})`}>
        <circle cx="0" cy="0" r="6" fill="none" stroke="#475569" strokeWidth="2.5" />
        <circle cx="0" cy="14" r="6" fill="none" stroke="#475569" strokeWidth="2.5" />
        <line x1="5" y1="3" x2="34" y2="12" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <line x1="5" y1="11" x2="34" y2="2" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      </g>
      <KidFigure cx={86} top={84} foot={GROUND} hairStyle="hijab" scarf="sky" outfit="violet" mood={f >= 1 ? 'proud' : 'wonder'} />
    </svg>
  );
}
