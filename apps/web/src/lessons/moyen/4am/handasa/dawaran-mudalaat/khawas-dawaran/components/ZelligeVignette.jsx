import React from 'react';

/**
 * La vignette de la carte d'activité (MissionBrief.visual) : une rosace de zellige de Tlemcen, six pétales tournés de
 * 60° autour d'une épingle, et la feuille calque de l'artisan posée en biais. Décor pur (aria-hidden) : aucun nombre,
 * aucune réponse. Dessinée en SVG, jamais générée.
 */
const COLORS = ['#047857', '#1D4ED8', '#B45309', '#0F766E', '#7C2D12', '#4338CA'];
const petal = (deg) => {
  const r = (a) => (a * Math.PI) / 180;
  const pt = (x, y) => [x * Math.cos(r(deg)) - y * Math.sin(r(deg)), x * Math.sin(r(deg)) + y * Math.cos(r(deg))];
  return [pt(10, 0), pt(40, 0), pt(20, 20)].map(([x, y]) => `${(60 + x).toFixed(1)},${(60 - y).toFixed(1)}`).join(' ');
};

export default function ZelligeVignette() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden="true" data-deco="zellige-vignette">
      <rect x="2" y="2" width="116" height="116" rx="14" fill="#F0FDFA" stroke="#0F766E" strokeWidth="2" />
      <path d="M60 8 L68 34 L94 26 L80 50 L106 60 L80 70 L94 94 L68 86 L60 112 L52 86 L26 94 L40 70 L14 60 L40 50 L26 26 L52 34 Z" fill="none" stroke="#99F6E4" strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((d, i) => <polygon key={d} points={petal(d)} fill={COLORS[i]} stroke="#0F172A" strokeWidth="1" />)}
      <g transform="rotate(-18 60 60)">
        <rect x="52" y="42" width="52" height="34" rx="4" fill="#E0F2FE" fillOpacity="0.55" stroke="#0284C7" strokeWidth="1.2" />
      </g>
      <circle cx="60" cy="60" r="4.5" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.2" />
    </svg>
  );
}
