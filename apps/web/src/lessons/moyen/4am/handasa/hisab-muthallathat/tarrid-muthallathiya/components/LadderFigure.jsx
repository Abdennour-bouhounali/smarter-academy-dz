import React from 'react';

/**
 * « اعتمادا على الشكل » du تحدّ (p. 115) : un mur vertical, une échelle posée contre lui, son sommet à 1,60 m du sol,
 * l'angle de 59° avec le sol horizontal. AUCUNE réponse : la longueur de l'échelle n'est ni écrite ni graduée (c'est la
 * question). Le même dessin sert la page d'unité (pages/unit/UnitOpenerFigure.jsx, clé « hisab-muthallathat:challenge »)
 * et le module 1. Le dessin respecte l'angle donné (sommet à `height`, pied à height ÷ tan angle — échelle de dessin).
 *
 * Props : `height` (« 1,60 »), `angle` (59), `label` (ariaLabel arabe) — écrits comme le manuel.
 */
const num = (s) => Number(String(s).replace(',', '.'));

export default function LadderFigure({ height = '1,60', angle = 59, label }) {
  const H = num(height); const a = (num(angle) * Math.PI) / 180;
  const W = 320; const yG = 178; const xWall = 112;
  const k = 120 / H;
  const top = [xWall, yG - H * k];
  const foot = [xWall + (H / Math.tan(a)) * k, yG];
  const tp = { style: { direction: 'ltr', unicodeBidi: 'isolate' }, fontFamily: 'ui-monospace, monospace' };
  const r = 26;
  const rungs = 6;
  const aria = label ?? `سلّم مستند إلى جدار شاقولي: رأس السلّم على الجدار على ارتفاع ${height} m من الأرض، والسلّم يصنع مع الأرض الأفقية زاوية قيسها ${angle} درجة`;
  return (
    <figure className="mx-auto w-full max-w-sm rounded-xl border-2 border-slate-200 bg-white p-2" data-figure="ladder">
      <svg viewBox={`0 0 ${W} 206`} className="h-auto w-full" style={{ direction: 'ltr' }} role="img" aria-label={aria}>
        <rect x={0} y={0} width={W} height={yG} fill="#F0F9FF" />
        {/* le mur (vu en perspective, comme le manuel) */}
        <path d={`M${xWall - 70} ${yG} L${xWall - 70} 28 L${xWall - 48} 14 L${xWall + 0} 14 L${xWall} ${yG} Z`} fill="#A5B4FC" stroke="#4338CA" strokeWidth={1.2} />
        <rect x={xWall - 70} y={28} width={70} height={yG - 28} fill="#818CF8" stroke="#4338CA" strokeWidth={1.2} />
        {/* la hauteur 1,60 m sur le mur */}
        <line x1={xWall - 10} y1={top[1]} x2={xWall - 10} y2={yG} stroke="#F8FAFC" strokeWidth={1.5} markerStart="url(#lf-arrow)" markerEnd="url(#lf-arrow)" />
        <text x={xWall - 15} y={(top[1] + yG) / 2} textAnchor="end" fontSize={13} fontWeight="bold" fill="#FFFFFF" {...tp}>{`${height}m`}</text>
        {/* l'échelle */}
        {[-3, 3].map((o) => <line key={o} x1={foot[0] + o} y1={foot[1]} x2={top[0] + o + 3} y2={top[1] + o * 0.5} stroke="#B45309" strokeWidth={3.5} strokeLinecap="round" />)}
        {Array.from({ length: rungs }, (_, j) => {
          const f = (j + 0.7) / (rungs + 0.4);
          const x = foot[0] + (top[0] - foot[0]) * f; const y = foot[1] + (top[1] - foot[1]) * f;
          return <line key={j} x1={x - 4} y1={y - 2} x2={x + 5} y2={y + 2} stroke="#D97706" strokeWidth={2.5} />;
        })}
        {/* l'angle au sol */}
        <path d={`M${foot[0] - r} ${foot[1]} A${r} ${r} 0 0 1 ${foot[0] - r * Math.cos(a)} ${foot[1] - r * Math.sin(a)}`} fill="none" stroke="#0F172A" strokeWidth={1.5} />
        <text x={foot[0] - r - 6} y={foot[1] - 8} textAnchor="end" fontSize={13} fontWeight="bold" fill="#0F172A" {...tp}>{`${angle}°`}</text>
        <path d={`M${xWall + 10} ${yG} L${xWall + 10} ${yG - 10} L${xWall} ${yG - 10}`} fill="none" stroke="#0F172A" strokeWidth={1.2} />
        <line x1={6} y1={yG} x2={W - 6} y2={yG} stroke="#57534E" strokeWidth={2.5} />
        <defs>
          <marker id="lf-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#F8FAFC" />
          </marker>
        </defs>
      </svg>
    </figure>
  );
}
