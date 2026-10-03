import React from 'react';

/**
 * La vignette de l'activité (MissionBrief.visual) : une tribune, des supporters et la banderole du tifo en trois
 * bandes égales — DESSINÉE, jamais générée ; décorative (`aria-hidden`), elle ne porte aucune réponse.
 */
export default function TifoVignette() {
  const fans = [18, 42, 66, 90, 114, 138, 162, 186, 210];
  return (
    <svg viewBox="0 0 240 110" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="110" rx="12" fill="#0f172a" />
      {[0, 1, 2].map((r) => (
        <rect key={r} x="0" y={58 + r * 16} width="240" height="10" fill="#334155" />
      ))}
      {fans.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={52 + (i % 2) * 4} r="6" fill="#fcd34d" />
          <rect x={x - 6} y={58 + (i % 2) * 4} width="12" height="12" rx="3" fill={['#059669', '#f8fafc', '#e11d48'][i % 3]} />
        </g>
      ))}
      <g>
        <rect x="30" y="12" width="60" height="28" fill="#059669" />
        <rect x="90" y="12" width="60" height="28" fill="#f8fafc" />
        <rect x="150" y="12" width="60" height="28" fill="#e11d48" />
        <rect x="30" y="12" width="180" height="28" fill="none" stroke="#f8fafc" strokeWidth="2" />
        <line x1="30" y1="44" x2="210" y2="44" stroke="#fde68a" strokeWidth="2" strokeDasharray="4 3" />
      </g>
    </svg>
  );
}
