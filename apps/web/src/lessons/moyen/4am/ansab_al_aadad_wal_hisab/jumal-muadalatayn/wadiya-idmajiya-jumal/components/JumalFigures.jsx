import React from 'react';

/**
 * Les figures de la synthèse, DESSINÉES (jamais une image) :
 *
 *   PartyScene  vignette DÉCORATIVE de la carte d'activité (aria-hidden) : la
 *               table du حفل البلدية — une guirlande, des briques de jus
 *               d'orange et des parts de gâteau sur des plateaux. Le manuel n'a
 *               pas de photographie pour cette situation ; la vignette n'a
 *               aucune mesure et ne porte AUCUNE information mathématique (ni
 *               150, ni 24, ni 30 : les nombres sont dans le texte).
 */
export function PartyScene() {
  const flags = Array.from({ length: 9 }, (_, i) => i);
  const juices = [0, 1, 2, 3];
  const cakes = [0, 1, 2];
  const flagColors = ['#16A34A', '#F8FAFC', '#DC2626'];
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="160" height="90" fill="#FEF3C7" />
      {/* la guirlande */}
      <path d="M0 8 Q80 26 160 8" fill="none" stroke="#92400E" strokeWidth=".8" />
      {flags.map((i) => {
        const x = 8 + i * 18; const t = x / 160; const y = 8 + 72 * t * (1 - t);
        return <path key={i} d={`M${x - 5} ${y} L${x + 5} ${y} L${x} ${y + 9} Z`} fill={flagColors[i % 3]} stroke="#78350F" strokeWidth=".4" />;
      })}
      {/* la table et sa nappe */}
      <rect x="6" y="56" width="148" height="6" rx="2" fill="#F8FAFC" stroke="#CBD5E1" />
      <path d="M8 62 L152 62 L148 86 L12 86 Z" fill="#E0F2FE" stroke="#94A3B8" strokeWidth=".6" />
      {/* les briques de jus d'orange, avec leur paille */}
      {juices.map((i) => {
        const x = 14 + i * 15;
        return (
          <g key={i}>
            <rect x={x} y="36" width="11" height="20" rx="1.2" fill="#FB923C" stroke="#9A3412" strokeWidth=".6" />
            <rect x={x} y="36" width="11" height="4" fill="#FDBA74" />
            <circle cx={x + 5.5} cy="48" r="3" fill="#FDE68A" stroke="#C2410C" strokeWidth=".4" />
            <path d={`M${x + 8} 36 L${x + 10} 28`} stroke="#0EA5E9" strokeWidth="1.2" />
          </g>
        );
      })}
      {/* les plateaux de gâteaux */}
      {cakes.map((i) => {
        const x = 86 + i * 22;
        return (
          <g key={i}>
            <ellipse cx={x + 9} cy="55" rx="11" ry="2.2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth=".5" />
            <path d={`M${x} 53 L${x + 18} 53 L${x + 16} 43 L${x + 2} 43 Z`} fill="#FCE7F3" stroke="#9D174D" strokeWidth=".6" />
            <rect x={x + 2} y="41" width="14" height="3" rx="1.5" fill="#F9A8D4" />
            <circle cx={x + 9} cy="39.5" r="2" fill="#DC2626" />
          </g>
        );
      })}
    </svg>
  );
}
