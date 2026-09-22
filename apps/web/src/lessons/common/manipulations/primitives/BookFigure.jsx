import React from 'react';

/**
 * UN LIVRE — un objet dessiné, pas un rectangle.
 *
 * Le dessin vient du laboratoire de la bibliothèque (`DivisorExplorerBooks`),
 * où il a été adopté tel quel par le propriétaire. Il vit ici pour que
 * PLUSIEURS manipulations de l'unité montrent le MÊME livre : la leçon 1
 * range 420 livres sur des rayons, la leçon 2 dispose 60 livres en
 * rectangles, et l'élève reconnaît l'objet d'un module à l'autre au lieu de
 * réapprendre une nouvelle abstraction.
 *
 * Dessiné, jamais généré (root CLAUDE.md) : il prend la couleur de sa
 * position, se réduit sans flou, et 420 exemplaires ne coûtent aucun octet
 * de réseau.
 *
 * `index` choisit la teinte de façon DÉTERMINISTE : deux élèves voient la
 * même bibliothèque, et un test aussi.
 */

/** Les teintes de couverture, dans l'ordre où elles se répètent. */
export const BOOK_PALETTE = [
  ['#4F46E5', '#312E81', '#EEF2FF'],
  ['#0EA5E9', '#075985', '#E0F2FE'],
  ['#10B981', '#047857', '#ECFDF5'],
  ['#F59E0B', '#B45309', '#FFFBEB'],
  ['#EC4899', '#9D174D', '#FDF2F8'],
  ['#8B5CF6', '#5B21B6', '#F5F3FF'],
  ['#F97316', '#C2410C', '#FFF7ED'],
];

/**
 * @param index   la position du livre (choisit sa teinte)
 * @param width   largeur en px ; la hauteur suit le viewBox (ratio 38:72)
 * @param muted   livre « en trop » : grisé, il attend hors du rangement
 */
export default function BookFigure({ index = 0, width = 22, muted = false, title, className = '' }) {
  const [cover, spine, page] = muted
    ? ['#CBD5E1', '#94A3B8', '#F8FAFC']
    : BOOK_PALETTE[index % BOOK_PALETTE.length];
  const uid = `bk${muted ? 'm' : ''}${index % BOOK_PALETTE.length}`;

  return (
    <svg
      width={width}
      height={Math.round((width * 72) / 38)}
      viewBox="0 0 38 72"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${uid}-c`} x1="0" x2="1">
          <stop offset="0" stopColor={spine} />
          <stop offset="0.18" stopColor={cover} />
          <stop offset="1" stopColor={cover} />
        </linearGradient>
        <linearGradient id={`${uid}-p`} x1="0" x2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={page} />
        </linearGradient>
      </defs>

      {/* pages */}
      <path d="M7 5 Q10 3 13 5 L34 10 L34 66 Q31 69 27 67 L8 62 Q6 61 6 58 Z"
        fill={`url(#${uid}-p)`} stroke="#CBD5E1" strokeWidth="1.2" />
      {/* couverture */}
      <path d="M4 3 Q6 1 9 3 L29 8 Q33 9 33 12 L33 64 Q33 68 29 67 L8 62 Q4 61 4 58 Z"
        fill={`url(#${uid}-c)`} stroke={spine} strokeWidth="1.5" />
      {/* dos */}
      <path d="M4 5 Q6 3 9 4 L9 62 Q6 61 4 59 Z" fill={spine} />
      {/* titre décoratif */}
      <path d="M13 18 L26 21" stroke="#fff" strokeWidth="2" opacity=".9" />
      <path d="M13 23 L28 27" stroke="#fff" strokeWidth="1.5" opacity=".65" />
      <circle cx="21" cy="39" r="6" fill="#fff" opacity=".9" />
      <path d="M18 39 L21 36 L24 39 L21 42 Z" fill={cover} />
      {/* tranches */}
      <path d="M12 57 L29 61" stroke="#94A3B8" strokeWidth="1" opacity=".7" />
      <path d="M12 59 L28 63" stroke="#94A3B8" strokeWidth="1" opacity=".5" />
    </svg>
  );
}
