import React from 'react';

/**
 * La vignette de la carte d'activité : les gradins du stade du 5-Juillet, quatre ultras tenant une banderole de tifo
 * (un متوازي أضلاع vert et blanc, le croissant rouge), un foulard tendu entre deux supporters et les lampes des
 * téléphones. Décor DESSINÉ (jamais une image), aria-hidden, sans aucun nombre : le même monde que le lab.
 */
export default function TifoVignette() {
  const fans = [[30, 88], [70, 92], [112, 86], [150, 90], [192, 88], [222, 92]];
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full max-w-[260px]" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="240" height="120" rx="12" fill="#F0FDF4" />
      {[0, 1, 2, 3].map((r) => <rect key={r} x="0" y={14 + r * 22} width="240" height="10" fill={r % 2 ? '#DCFCE7' : '#FFFFFF'} />)}
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={8 + i * 13} cy={10 + (i % 4) * 22} r="1.8" fill="#FACC15" opacity="0.8" />)}
      <polygon points="58,22 168,14 190,62 80,70" fill="#16A34A" opacity="0.85" stroke="#14532D" strokeWidth="2" />
      <polygon points="113,18 168,14 190,62 135,66" fill="#FFFFFF" opacity="0.9" />
      <circle cx="124" cy="42" r="9" fill="#DC2626" />
      <circle cx="128" cy="42" r="7.5" fill="#FFFFFF" />
      <line x1="20" y1="104" x2="110" y2="96" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 6" />
      {fans.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y - 8} r="4.5" fill="#7C2D12" />
          <path d={`M${x - 6} ${y + 10} L${x} ${y - 3} L${x + 6} ${y + 10} Z`} fill={x % 2 ? '#DC2626' : '#16A34A'} />
        </g>
      ))}
    </svg>
  );
}
