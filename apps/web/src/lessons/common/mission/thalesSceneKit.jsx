import React from 'react';

/**
 * LES PRIMITIVES DES SCÈNES DE L'UNITÉ 9 « خاصية طالس » (rollout 2026-11-10 ; conseil du 2026-11-10, verdict « Scenes: shared SVG primitives + one
 * thin scene file per lesson ») — dessinées en code, sans aucun nombre. Chaque leçon de l'unité a SA scène, mince, qui compose ces pièces :
 * `PaintWallScene` (leçon 2) aujourd'hui ; les leçons 1 et 3 les reprendront (jamais un « variant » à trois branches).
 *
 *   <SceneBackdrop width height ground sky? />           le ciel et le sol (une bande)
 *   <XTrestle cx foot height spread plankAt level? />     le tréteau en X : deux barres croisées en A, la planche entre elles
 *   <BubbleLevel x y w level? deg? />                     le niveau à bulle (bulle au centre quand `level`)
 *   <PaintRoller x y color? /> · <PaintBucket x y color? />
 * Les personnes ne sont JAMAIS dessinées ici : KidFigure seulement (filles en hijab), posé par la scène.
 */
export function SceneBackdrop({ width = 480, height = 260, ground = 232, sky = '#E0F2FE', soil = '#D6D3D1' }) {
  return (
    <g data-scene-backdrop>
      <rect x="0" y="0" width={width} height={ground} fill={sky} />
      <rect x="0" y={ground} width={width} height={height - ground} fill={soil} />
      <line x1="0" x2={width} y1={ground} y2={ground} stroke="#78716C" strokeWidth="2" />
    </g>
  );
}

/** Le niveau à bulle : un tube, deux repères, une bulle — au centre quand `level`, poussée vers un bout sinon. */
export function BubbleLevel({ x, y, w = 46, level = true, deg = 0 }) {
  const off = level ? 0 : (w / 2 - 8);
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg})`} data-bubble-level={level ? 'level' : 'tilted'}>
      <rect x={-w / 2 - 3} y={-6} width={w + 6} height={12} rx={3} fill="#1E293B" />
      <rect x={-w / 2} y={-4} width={w} height={8} rx={4} fill={level ? '#BBF7D0' : '#FEF08A'} />
      <line x1={-6} x2={-6} y1={-4} y2={4} stroke="#334155" strokeWidth="1" />
      <line x1={6} x2={6} y1={-4} y2={4} stroke="#334155" strokeWidth="1" />
      <ellipse cx={off} cy={0} rx={5} ry={3} fill="#FFFFFF" stroke="#64748B" strokeWidth="0.8" />
    </g>
  );
}

/**
 * Le tréteau en X : deux barres croisées en A (au-dessus du sol `foot`), écartées de `spread` au sol et qui CONTINUENT au-delà de A ;
 * la planche posée à la hauteur `plankAt` ∈ [0, 1] du bas (0 au sol, 1 en A) — horizontale quand `level`, penchée sinon.
 */
export function XTrestle({ cx, foot, height = 120, spread = 120, plankAt = 0.55, level = true }) {
  const A = { x: cx, y: foot - height * 0.72 };
  const B = { x: cx - spread / 2, y: foot };
  const C = { x: cx + spread / 2, y: foot };
  const over = 0.38; // la part des barres au-delà de A
  const beyond = (P) => ({ x: A.x + (A.x - P.x) * over, y: A.y + (A.y - P.y) * over });
  const TB = beyond(B); const TC = beyond(C);
  const at = (P, t) => ({ x: P.x + (A.x - P.x) * t, y: P.y + (A.y - P.y) * t });
  const L = at(B, plankAt);
  const R = at(C, level ? plankAt : Math.max(0.1, plankAt - 0.22));
  const deg = (Math.atan2(R.y - L.y, R.x - L.x) * 180) / Math.PI;
  return (
    <g data-x-trestle={level ? 'level' : 'tilted'}>
      <line x1={B.x} y1={B.y} x2={TB.x} y2={TB.y} stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
      <line x1={C.x} y1={C.y} x2={TC.x} y2={TC.y} stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
      <circle cx={A.x} cy={A.y} r="4" fill="#451A03" />
      <line x1={L.x - 10} y1={L.y} x2={R.x + 10} y2={R.y} stroke="#A16207" strokeWidth="8" strokeLinecap="round" />
      <BubbleLevel x={(L.x + R.x) / 2} y={(L.y + R.y) / 2 - 9} level={level} deg={deg} />
    </g>
  );
}

/** Un rouleau de peinture (manche + rouleau coloré). */
export function PaintRoller({ x, y, color = '#0EA5E9' }) {
  return (
    <g data-paint-roller>
      <line x1={x} y1={y} x2={x + 2} y2={y + 34} stroke="#57534E" strokeWidth="3" strokeLinecap="round" />
      <rect x={x - 12} y={y - 9} width="24" height="10" rx="4" fill={color} stroke="#0F172A" strokeWidth="1" />
    </g>
  );
}

/** Un seau de peinture. */
export function PaintBucket({ x, y, color = '#0EA5E9' }) {
  return (
    <g data-paint-bucket>
      <path d={`M ${x - 13} ${y - 22} L ${x + 13} ${y - 22} L ${x + 10} ${y} L ${x - 10} ${y} Z`} fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
      <ellipse cx={x} cy={y - 22} rx="13" ry="3.5" fill={color} />
      <path d={`M ${x - 12} ${y - 22} Q ${x} ${y - 38} ${x + 12} ${y - 22}`} fill="none" stroke="#475569" strokeWidth="1.5" />
    </g>
  );
}
