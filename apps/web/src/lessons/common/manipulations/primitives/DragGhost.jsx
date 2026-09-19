import React from 'react';
import { createPortal } from 'react-dom';

/**
 * L'objet porté, dessiné SOUS LE DOIGT pendant le glisser. Un portail vers
 * <body> : la copie ne dépend d'aucun `overflow` ni `transform` du module.
 * `pointer-events: none` pour ne jamais masquer la zone visée. Rendu en
 * `transform` (pas left/top animés) : une seule propriété composée, fluide
 * sur un téléphone d'entrée de gamme.
 */
export default function DragGhost({ ghost, children }) {
  if (!ghost || typeof document === 'undefined') return null;
  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] will-change-transform"
      style={{ transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0) translate(-50%, -50%) scale(1.08)` }}
    >
      <div className="rounded-xl shadow-2xl">{children}</div>
    </div>,
    document.body,
  );
}
