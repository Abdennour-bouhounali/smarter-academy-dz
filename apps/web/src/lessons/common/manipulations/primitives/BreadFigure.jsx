import React, { useId } from 'react';

/**
 * UN PAIN DESSINÉ (2026-10-15, labo `fair-share`, 1AM) — des `<g>` à poser DANS une scène SVG.
 *
 * `Loaf` : une baguette dans la boîte (x, y, w, h) — croûte dorée dégradée, mie claire sur le dessus, trois entailles
 * (deux quand le pain est court). `cuts` (n ≥ 2) trace n − 1 traits de couteau également espacés : le pain coupé en n morceaux
 * égaux. `ghost` le dessine en pointillés roses (du pain qui n'existe pas). Dessin seulement : la longueur du pain EST `w`.
 */
export function Loaf({ x, y, w, h, cuts = 1, ghost = false, ...rest }) {
  const id = useId().replace(/:/g, '');
  const r = Math.min(h / 2, w / 2.2);
  if (ghost) {
    return (
      <g {...rest}>
        <rect x={x + 1} y={y} width={Math.max(2, w - 2)} height={h} rx={r} fill="#FFF1F2" fillOpacity={0.7} stroke="#E11D48" strokeWidth={1.4} strokeDasharray="4 3" />
      </g>
    );
  }
  const marks = w < 34 ? 2 : 3;
  return (
    <g {...rest}>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6C976" />
          <stop offset="0.55" stopColor="#DE9B3E" />
          <stop offset="1" stopColor="#B86E1E" />
        </linearGradient>
      </defs>
      <rect x={x + 1} y={y + 2.5} width={Math.max(2, w - 2)} height={h} rx={r} fill="#1E1B4B" opacity={0.12} />
      <rect x={x + 1} y={y} width={Math.max(2, w - 2)} height={h} rx={r} fill={`url(#b${id})`} stroke="#9A5A14" strokeWidth={1.2} />
      <rect x={x + 1 + r * 0.5} y={y + h * 0.1} width={Math.max(1, w - 2 - r)} height={h * 0.22} rx={h * 0.11} fill="#FFF3D1" opacity={0.55} />
      {Array.from({ length: marks }, (_, i) => {
        const cx = x + (w * (i + 1)) / (marks + 1);
        return <path key={i} d={`M${cx - h * 0.2} ${y + h * 0.72} L${cx + h * 0.2} ${y + h * 0.28}`} stroke="#FBE3A8" strokeWidth={Math.max(1.4, h * 0.09)} strokeLinecap="round" />;
      })}
      {cuts >= 2 && Array.from({ length: cuts - 1 }, (_, i) => {
        const cx = x + 1 + ((w - 2) * (i + 1)) / cuts;
        return <line key={`c${i}`} x1={cx} x2={cx} y1={y - 2} y2={y + h + 2} stroke="#5B3208" strokeWidth={1.4} strokeDasharray="3 2" data-loaf-cut />;
      })}
    </g>
  );
}
