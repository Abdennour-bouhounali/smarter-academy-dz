import React from 'react';

/**
 * LES VIGNETTES DE CONTEXTE — la scène de chaque « monde » de l'unité, en
 * paysage, pour la carte d'activité (`MissionBrief.visual`).
 *
 * Même rôle que `PitchScene` (PitchBackdrop.jsx), même règles : décoratives
 * au sens strict (`aria-hidden`, aucune information mathématique), dessinées
 * et jamais générées (root CLAUDE.md), sans texte — les mots sont dans la
 * carte. Chaque vignette montre les MÊMES objets que le laboratoire du
 * module, pour que la carte et l'instrument racontent une seule scène :
 *
 *   LibraryScene       les rayons de la bibliothèque (leçons 1 et 2)
 *   ConstructionScene  un mur en briques et sa truelle (leçon 3)
 *   GardenScene        l'étal du fleuriste (leçon 4)
 *   SchoolBagScene     la trousse : stylos et cahiers (leçons 5 et 7)
 *   WorkshopScene      l'atelier de couture : rubans et ciseaux (leçon 6)
 *   KitchenScene       la recette : bol, cuillères et tasses (leçon 8)
 *
 * viewBox 160 × 90, `slice` : la vignette remplit son cadre sans blanc.
 */
const frame = (className) => ({
  viewBox: '0 0 160 90', preserveAspectRatio: 'xMidYMid slice',
  className: `h-full w-full ${className}`, 'aria-hidden': 'true', focusable: 'false',
});

export function LibraryScene({ className = '' }) {
  const palette = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F97316'];
  const shelf = (y, seed) => (
    <g key={y}>
      {Array.from({ length: 13 }, (_, i) => {
        const h = 16 + ((i * 7 + seed) % 6);
        return <rect key={i} x={12 + i * 10.4} y={y - h} width="8.2" height={h} rx="1" fill={palette[(i + seed) % palette.length]} />;
      })}
      <rect x="8" y={y} width="144" height="4" rx="1" fill="#A86D3D" />
      <rect x="8" y={y + 4} width="144" height="2" fill="#70401F" />
    </g>
  );
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#F4F7FF" />
      <rect x="0" y="70" width="160" height="20" fill="#E2E8F0" />
      {shelf(38, 2)}
      {shelf(66, 5)}
    </svg>
  );
}

export function ConstructionScene({ className = '' }) {
  const rows = 5;
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#E0F2FE" />
      <rect x="0" y="72" width="160" height="18" fill="#D6D3D1" />
      {Array.from({ length: rows }, (_, r) => {
        const y = 72 - (r + 1) * 12;
        const offset = r % 2 ? 12 : 0;
        return Array.from({ length: 8 }, (_, i) => (
          <rect key={`${r}-${i}`} x={6 + i * 24 - offset} y={y + 1} width="22" height="10" rx="1.2" fill="#F97316" stroke="#9A3412" strokeWidth="1" />
        ));
      })}
      {/* la truelle */}
      <g transform="translate(118 20) rotate(25)">
        <path d="M0 0 L22 0 L11 18 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1" />
        <rect x="9" y="-14" width="4" height="14" rx="1.5" fill="#92400E" />
      </g>
    </svg>
  );
}

export function GardenScene({ className = '' }) {
  const flower = (x, y, red, k) => (
    <g key={k} transform={`translate(${x} ${y})`}>
      <path d="M0 8 L0 26" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-3" rx="3" ry="5" fill={red ? '#E11D48' : '#FFFFFF'} stroke={red ? '#9F1239' : '#CBD5E1'} strokeWidth=".8" transform={`rotate(${deg} 0 2)`} />
      ))}
      <circle cx="0" cy="2" r="2.6" fill="#FBBF24" />
    </g>
  );
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#ECFDF5" />
      <rect x="0" y="62" width="160" height="28" fill="#A16207" />
      <rect x="0" y="62" width="160" height="4" fill="#CA8A04" />
      {/* deux seaux, l'un rouge, l'autre blanc */}
      <path d="M18 40 L52 40 L48 70 L22 70 Z" fill="#64748B" stroke="#334155" strokeWidth="1.2" />
      <path d="M98 40 L132 40 L128 70 L102 70 Z" fill="#64748B" stroke="#334155" strokeWidth="1.2" />
      {[0, 1, 2, 3, 4].map((i) => flower(24 + i * 6, 22 + (i % 2) * 4, true, `r${i}`))}
      {[0, 1, 2, 3].map((i) => flower(106 + i * 7, 24 + (i % 2) * 4, false, `w${i}`))}
    </svg>
  );
}

export function SchoolBagScene({ className = '' }) {
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#FEF3C7" />
      <rect x="0" y="66" width="160" height="24" fill="#D97706" opacity=".25" />
      {/* le cartable */}
      <rect x="20" y="30" width="60" height="44" rx="8" fill="#0EA5E9" stroke="#075985" strokeWidth="1.5" />
      <rect x="28" y="24" width="44" height="14" rx="6" fill="#0369A1" />
      <rect x="30" y="48" width="40" height="18" rx="4" fill="#BAE6FD" />
      {/* les cahiers empilés */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={96} y={58 - i * 8} width="42" height="9" rx="2" fill={['#10B981', '#F59E0B', '#8B5CF6'][i]} stroke="#1E293B" strokeWidth=".8" />
      ))}
      {/* les stylos */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${100 + i * 9} 22) rotate(-20)`}>
          <rect x="0" y="0" width="5" height="26" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth=".8" />
          <path d="M0 26 L2.5 32 L5 26 Z" fill="#FDE68A" stroke="#B45309" strokeWidth=".8" />
        </g>
      ))}
    </svg>
  );
}

export function WorkshopScene({ className = '' }) {
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#FDF2F8" />
      <rect x="0" y="58" width="160" height="32" fill="#A16207" opacity=".35" />
      {/* deux rubans déroulés, de longueurs différentes */}
      <path d="M10 30 L118 30 L114 36 L118 42 L10 42 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.2" />
      <path d="M10 50 L70 50 L66 56 L70 62 L10 62 Z" fill="#A78BFA" stroke="#5B21B6" strokeWidth="1.2" />
      <line x1="14" y1="34" x2="112" y2="34" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="14" y1="54" x2="64" y2="54" stroke="#DDD6FE" strokeWidth="1" strokeDasharray="2 2" />
      {/* les ciseaux */}
      <g transform="translate(126 52) rotate(-35)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#0F172A" strokeWidth="2" />
        <circle cx="0" cy="12" r="5" fill="none" stroke="#0F172A" strokeWidth="2" />
        <path d="M4 3 L30 8 M4 9 L30 4" stroke="#475569" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      {/* le mètre ruban */}
      <rect x="12" y="70" width="60" height="8" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={16 + i * 5} y1="70" x2={16 + i * 5} y2={i % 2 ? 73 : 75} stroke="#B45309" strokeWidth=".8" />)}
    </svg>
  );
}

export function KitchenScene({ className = '' }) {
  return (
    <svg {...frame(className)}>
      <rect width="160" height="90" fill="#FFF7ED" />
      <rect x="0" y="64" width="160" height="26" fill="#FED7AA" />
      {/* le bol */}
      <path d="M40 46 L104 46 Q100 70 72 70 Q44 70 40 46 Z" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.4" />
      <path d="M46 46 Q72 38 98 46" fill="#FDE68A" />
      {/* les cuillères de sucre */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${14 + i * 11} 30) rotate(-30)`}>
          <rect x="1.5" y="8" width="3" height="18" rx="1.5" fill="#CBD5E1" stroke="#64748B" strokeWidth=".8" />
          <ellipse cx="3" cy="5" rx="5" ry="6" fill="#CBD5E1" stroke="#64748B" strokeWidth=".9" />
          <ellipse cx="3" cy="4.4" rx="3.4" ry="3.8" fill="#FFFFFF" />
        </g>
      ))}
      {/* les tasses de farine */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${112 + i * 22} 30)`}>
          <path d="M0 0 L18 0 L15.5 24 L2.5 24 Z" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.2" />
          <path d="M2 12 L16 12 L15 23 L3 23 Z" fill="#FEF3C7" />
          <path d="M18 4 Q24 6 22 12 Q21 15 18 15" stroke="#0369A1" strokeWidth="1.2" fill="none" />
        </g>
      ))}
    </svg>
  );
}
