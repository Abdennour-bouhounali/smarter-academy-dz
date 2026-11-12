import React from 'react';
import KidFigure from '../manipulations/primitives/KidFigure';

const W = 480;
const H = 260;
const FLOOR = 214;

/** Une pile de tabliers pliés (une couleur), vue de face. */
function Stack({ x, color, edge, n }) {
  return (
    <g data-apron-stack={color}>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x} y={150 - i * 9} width="46" height="8" rx="2" fill={color} stroke={edge} strokeWidth="1" />
      ))}
    </g>
  );
}

/** Une caisse d'école IDENTIQUE aux autres : un toit d'école dessiné dessus, une rangée rose et une bleue — jamais un nombre. */
function Crate({ x }) {
  return (
    <g data-apron-crate transform={`translate(${x} 160)`}>
      <rect x="0" y="10" width="54" height="40" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      <path d="M14 10 L27 0 L40 10 Z" fill="#B45309" />
      <rect x="6" y="18" width="42" height="7" rx="2" fill="#F9A8D4" stroke="#BE185D" />
      <rect x="6" y="29" width="42" height="7" rx="2" fill="#93C5FD" stroke="#1D4ED8" />
    </g>
  );
}

/**
 * LE MAGASIN DE LA COMMUNE (la synthèse de l'unité 1 `wadiya-idmajiya-aadad`, `mission.scene = 'apron-store'`, 2026-11-12) — une scène MINCE
 * dessinée en code : deux piles de tabliers pliés (rose, bleu) sur une étagère et, au sol, des caisses d'école IDENTIQUES qui reçoivent chacune
 * la même rangée de chaque couleur (le partage égal sur le plus grand nombre d'écoles) — aucun nombre, aucune lettre. Les élèves sont le
 * personnage partagé `KidFigure` : une fille en hijab (tenue islamique) qui range, un garçon qui compte du regard. Une synthèse n'a rien à
 * gagner (les clés sont à l'élève dès le départ) : la scène est pleine ; `fill` éclaire seulement les caisses.
 */
export default function ApronStoreScene({ fill = 1, label, className = '', scene = 'apron-store' }) {
  const f = Math.max(0, Math.min(1, fill));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-scene={scene} data-apron-fill={f.toFixed(2)}>
      <rect x="0" y="0" width={W} height={H} fill="#ECFDF5" />
      <rect x="0" y={FLOOR} width={W} height={H - FLOOR} fill="#E7E5E4" />
      <line x1="0" x2={W} y1={FLOOR} y2={FLOOR} stroke="#A8A29E" strokeWidth="2" />
      {/* l'étagère et ses deux piles */}
      <g data-apron-shelf>
        <rect x="24" y="158" width="150" height="8" rx="2" fill="#92400E" />
        <rect x="30" y="166" width="6" height={FLOOR - 166} fill="#78350F" />
        <rect x="162" y="166" width="6" height={FLOOR - 166} fill="#78350F" />
        <Stack x={38} color="#F9A8D4" edge="#BE185D" n={9} />
        <Stack x={112} color="#93C5FD" edge="#1D4ED8" n={8} />
      </g>
      {/* les caisses identiques des écoles */}
      <g opacity={0.55 + 0.45 * f}>
        {[196, 258, 320].map((x) => <Crate key={x} x={x} />)}
      </g>
      <KidFigure cx={400} top={FLOOR - 92} foot={FLOOR + 6} hairStyle="hijab" scarf="mint" outfit="violet" mood="happy" />
      <KidFigure cx={448} top={FLOOR - 96} foot={FLOOR + 8} outfit="orange" mood="wonder" />
    </svg>
  );
}
