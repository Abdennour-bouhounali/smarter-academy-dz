import React from 'react';

/**
 * `n` points rangés en `cols` colonnes : des lignes complètes et, s'il en
 * reste, une dernière ligne incomplète en ambre. Quand la dernière ligne est
 * pleine, le rectangle est parfait — c'est `n = cols × rows`, vu.
 *
 * Un point = un nœud (au plus `maxDots`, sinon on retombe sur des bandes) :
 * pour 60 ou 105 c'est le bon niveau de détail, l'élève peut compter.
 */
export default function RectangleArray({ n, cols, maxDots = 220, dotPx = 12, ariaLabel }) {
  const c = Math.max(1, cols | 0);
  const rows = Math.floor(n / c);
  const rest = n - rows * c;
  const dense = n > maxDots;
  const cell = dense ? 6 : dotPx;
  const gap = dense ? 1 : 3;
  const width = c * (cell + gap);
  return (
    <div role="img" aria-label={ariaLabel} dir="ltr" className="inline-block max-w-full overflow-x-auto rounded-xl border-2 border-slate-200 bg-white p-2">
      <div style={{ width: `${width}px`, display: 'grid', gridTemplateColumns: `repeat(${c}, ${cell}px)`, gap: `${gap}px` }}>
        {Array.from({ length: rows * c }, (_, i) => (
          <span key={i} className="rounded-full bg-indigo-500" style={{ width: cell, height: cell }} />
        ))}
        {Array.from({ length: rest }, (_, i) => (
          <span key={`r${i}`} className="rounded-full bg-amber-400 ring-1 ring-amber-600" style={{ width: cell, height: cell }} />
        ))}
      </div>
    </div>
  );
}
