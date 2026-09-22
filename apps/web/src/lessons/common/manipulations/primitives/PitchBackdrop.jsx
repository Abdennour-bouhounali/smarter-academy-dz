import React from 'react';

/**
 * LE TERRAIN — un vrai terrain de football, dessiné.
 *
 * Vue de dessus, en SVG paramétré : pelouse tondue en bandes alternées,
 * ligne médiane, rond central, deux surfaces de réparation avec leur
 * demi-cercle et leur point de penalty, buts et corners. C'est le dessin de
 * référence demandé par le propriétaire (2026-09-20), rendu en vectoriel.
 *
 * POURQUOI PAS UNE IMAGE. Root CLAUDE.md : aucune image matricielle sous
 * `lessons/`. Ici la raison est aussi pratique — le terrain doit :
 *   • se redimensionner sans flou du téléphone au vidéoprojecteur ;
 *   • accepter les joueurs POSÉS dessus par-dessus, en DOM, donc rester un
 *     fond qui ne capte aucun événement de pointeur ;
 *   • suivre le thème sans nouveau fichier.
 * Une photo de pelouse ne fait rien de tout cela, et pèserait plus que le
 * reste de la leçon.
 *
 * C'EST UN DÉCOR, ET IL SE TIENT À SA PLACE. Le terrain ne porte aucune
 * information mathématique : il rend la scène reconnaissable, rien de plus.
 * Il est donc `aria-hidden`, `pointer-events: none`, et il ne change jamais
 * quand les nombres changent — ce qui change, ce sont les joueurs.
 *
 * ORIENTATION VERTICALE, PROPORTIONS RÉELLES : largeur = 2/3 de la hauteur,
 * comme la référence. Le terrain n'est JAMAIS étiré pour remplir sa boîte —
 * un rond central devenu ellipse se voit au premier coup d'œil. La boîte
 * s'adapte au terrain, pas l'inverse.
 *   `full` (défaut) — le terrain entier, vertical ;
 *   `half`          — une moitié de terrain, pour une petite zone.
 */
export default function PitchBackdrop({ variant = 'full', stripes = 9, className = '', rounded = 14 }) {
  // PROPORTIONS RÉELLES : largeur = 2/3 de la hauteur. Un terrain de football
  // vu de dessus est plus haut que large dans ce cadrage, et c'est ce rapport
  // qui le rend reconnaissable — on ne l'étire jamais pour remplir une boîte.
  const W = 300;
  const H = variant === 'half' ? W : Math.round((W * 3) / 2);
  const band = H / stripes;  // hauteur d'une bande de tonte (cadrages verticaux)
  const line = '#FFFFFF';
  const lw = 2.2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Le grain de la pelouse : un bruit très doux, sinon le vert paraît plastique. */}
        <filter id="pitch-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="d" />
          <feComponentTransfer in="d" result="soft">
            <feFuncA type="linear" slope="0.10" />
          </feComponentTransfer>
          <feComposite in="soft" in2="SourceGraphic" operator="over" />
        </filter>
        <clipPath id={`pitch-clip-${variant}`}>
          <rect x="0" y="0" width={W} height={H} rx={rounded} />
        </clipPath>
      </defs>

      <g clipPath={`url(#pitch-clip-${variant})`}>
        {/* pelouse + bandes de tonte alternées */}
        <rect x="0" y="0" width={W} height={H} fill="#2E9E4F" />
        {Array.from({ length: stripes }, (_, i) => (
          <rect key={i} x="0" y={i * band} width={W} height={band}
            fill={i % 2 === 0 ? '#35AB58' : '#2A9149'} />
        ))}
        <rect x="0" y="0" width={W} height={H} fill="#FFFFFF" opacity="0.04" filter="url(#pitch-grain)" />

        {/* ── les tracés ─────────────────────────────────────────────── */}
        <g fill="none" stroke={line} strokeWidth={lw} opacity="0.92">
          {/* touche */}
          <rect x="10" y="10" width={W - 20} height={H - 20} />

          {variant === 'full' ? (
            <>
              {/* médiane + rond central */}
              <line x1="10" y1={H / 2} x2={W - 10} y2={H / 2} />
              <circle cx={W / 2} cy={H / 2} r="46" />
              <circle cx={W / 2} cy={H / 2} r="2.6" fill={line} stroke="none" />
              {/* surface haute */}
              <rect x={(W - 170) / 2} y="10" width="170" height="66" />
              <rect x={(W - 78) / 2} y="10" width="78" height="26" />
              <path d={`M ${(W - 56) / 2} 76 A 28 24 0 0 0 ${(W + 56) / 2} 76`} />
              <circle cx={W / 2} cy="52" r="2.2" fill={line} stroke="none" />
              {/* surface basse */}
              <rect x={(W - 170) / 2} y={H - 76} width="170" height="66" />
              <rect x={(W - 78) / 2} y={H - 36} width="78" height="26" />
              <path d={`M ${(W - 56) / 2} ${H - 76} A 28 24 0 0 1 ${(W + 56) / 2} ${H - 76}`} />
              <circle cx={W / 2} cy={H - 52} r="2.2" fill={line} stroke="none" />
            </>
          ) : (
            <>
              {/* moitié de terrain, même rapport, pour les petites zones */}
              <line x1="10" y1={H - 10} x2={W - 10} y2={H - 10} />
              <path d={`M ${W / 2 - 40} ${H - 10} A 40 34 0 0 1 ${W / 2 + 40} ${H - 10}`} />
              <rect x={(W - 170) / 2} y="10" width="170" height="60" />
              <rect x={(W - 78) / 2} y="10" width="78" height="24" />
              <path d={`M ${(W - 52) / 2} 70 A 26 22 0 0 0 ${(W + 52) / 2} 70`} />
              <circle cx={W / 2} cy="48" r="2.2" fill={line} stroke="none" />
            </>
          )}

          {/* corners */}
          <path d="M 10 20 A 10 10 0 0 0 20 10" />
          <path d={`M ${W - 20} 10 A 10 10 0 0 0 ${W - 10} 20`} />
          {variant === 'full' && (
            <>
              <path d={`M 10 ${H - 20} A 10 10 0 0 1 20 ${H - 10}`} />
              <path d={`M ${W - 20} ${H - 10} A 10 10 0 0 1 ${W - 10} ${H - 20}`} />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

/**
 * LA SCÈNE — la vignette PAYSAGE d'une carte d'activité football.
 *
 * Ce n'est pas une aire de jeu : rien ne s'y pose, elle situe la situation en
 * un coup d'œil (gradins, pelouse tondue, but, ballon). Elle remplit son
 * cadre sans laisser de blanc, ce qu'un terrain vertical ne peut pas faire
 * dans une vignette large — d'où un dessin distinct plutôt qu'un recadrage.
 *
 * Décorative au sens strict : `aria-hidden`, aucune information
 * mathématique. Dessinée, jamais générée (root CLAUDE.md).
 */
export function PitchScene({ className = '' }) {
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pitch-scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFDBFE" /><stop offset="1" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>

      {/* ciel et gradins — ils cadrent, ils ne racontent rien */}
      <rect x="0" y="0" width="160" height="34" fill="url(#pitch-scene-sky)" />
      <rect x="0" y="23" width="160" height="11" fill="#CBD5E1" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 10 + 1.5} y="25.5" width="7.5" height="6" rx="1" fill="#94A3B8" />
      ))}

      {/* pelouse en bandes de tonte */}
      <rect x="0" y="34" width="160" height="56" fill="#2F9E4F" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={i * 23} y="34" width="23" height="56" fill={i % 2 === 0 ? '#36AC59' : '#2C9349'} />
      ))}

      {/* tracés, vus de côté */}
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9">
        <line x1="0" y1="41" x2="160" y2="41" />
        <line x1="80" y1="41" x2="80" y2="90" />
        <ellipse cx="80" cy="67" rx="20" ry="10" />
        <rect x="6" y="49" width="26" height="30" />
        <rect x="128" y="49" width="26" height="30" />
      </g>

      {/* le but, au fond */}
      <rect x="12" y="29" width="26" height="12" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="1.4" />

      {/* le ballon, posé sur la pelouse */}
      <g transform="translate(108 62)">
        <ellipse cx="0" cy="9" rx="9" ry="2.4" fill="#0F172A" opacity="0.2" />
        <circle cx="0" cy="0" r="8.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.2" />
        <path d="M0 -4.6 L3 -2.4 L1.8 1.2 L-1.8 1.2 L-3 -2.4 Z" fill="#1E293B" />
        <path d="M0 -8.5 L0 -4.6 M8.3 -2.2 L3 -2.4 M5.2 6.8 L1.8 1.2 M-5.2 6.8 L-1.8 1.2 M-8.3 -2.2 L-3 -2.4"
          stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
