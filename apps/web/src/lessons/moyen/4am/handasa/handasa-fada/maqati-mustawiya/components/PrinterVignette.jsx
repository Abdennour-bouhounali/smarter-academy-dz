import React, { useId } from 'react';

/**
 * La vignette de la carte d'activité : l'imprimante 3D du fablab du lycée en train de construire une boule — les couches
 * déjà déposées (des disques empilés, de plus en plus étroits vers le haut), la buse sur son portique, la bobine de filament,
 * la bande LED. Décor DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab `section-slicer`.
 */
export default function PrinterVignette() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const cx = 120; const base = 98; const R = 34; const colors = ['#06b6d4', '#a855f7', '#f43f5e', '#22c55e', '#f59e0b', '#3b82f6'];
  // les couches d'une demi-boule : à la hauteur y au-dessus de l'équateur, la demi-largeur √(R² − y²)
  const layers = Array.from({ length: 9 }, (_, j) => { const y = (j / 9) * R; return { y, w: Math.sqrt(R * R - y * y) }; });
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`pv-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e0f2fe" /><stop offset="1" stopColor="#f8fafc" /></linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="120" rx="12" fill={`url(#pv-${uid})`} />
      {/* le cadre de l'imprimante */}
      <rect x="40" y="8" width="6" height="104" rx="2" fill="#64748b" />
      <rect x="194" y="8" width="6" height="104" rx="2" fill="#64748b" />
      <rect x="40" y="8" width="160" height="6" rx="2" fill="#94a3b8" />
      <rect x="50" y="102" width="140" height="7" rx="2" fill="#475569" />
      <rect x="48" y="16" width="144" height="2.5" rx="1" fill="#22d3ee" opacity="0.8" />
      {/* les couches imprimées : une demi-boule posée sur son équateur, du bas vers le haut */}
      {layers.map((l, j) => (
        <rect key={j} x={cx - l.w} y={base - 4 - l.y} width={2 * l.w} height={R / 9 - 0.6} rx="1.2" fill={colors[j % colors.length]} opacity="0.9" />
      ))}
      {/* le portique et la buse, juste au-dessus de la dernière couche */}
      <rect x="46" y={base - 4 - R - 10} width="148" height="3" fill="#334155" />
      <rect x={cx + 6} y={base - 4 - R - 16} width="12" height="10" rx="2" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
      <path d={`M ${cx + 9} ${base - 4 - R - 6} L ${cx + 15} ${base - 4 - R - 6} L ${cx + 12} ${base - R + 1} Z`} fill="#78350f" />
      {/* la bobine */}
      <circle cx="214" cy="30" r="12" fill="#a855f7" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx="214" cy="30" r="3.5" fill="#0f172a" />
      <path d={`M 205 36 Q 180 40 ${cx + 12} ${base - 4 - R - 16}`} fill="none" stroke="#a855f7" strokeWidth="1.2" />
    </svg>
  );
}
