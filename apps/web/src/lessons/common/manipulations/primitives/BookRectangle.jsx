import React from 'react';
import BookFigure from './BookFigure';

/**
 * `n` LIVRES rangés en `cols` colonnes — le rectangle, en vrais objets.
 *
 * C'est le pendant illustré de `RectangleArray` (des points) : même
 * mathématique, même état, mais l'élève voit les livres de la bibliothèque
 * qu'il range depuis le module 1. Le dessin EST l'argument — un rectangle
 * PARFAIT (dernière rangée pleine) dit `n = cols × rows` ; une rangée
 * incomplète dit qu'il reste `rest` livres, et ceux-là sont dessinés à part,
 * grisés, sur une étagère qui n'est pas pleine.
 *
 * DENSITÉ. Chaque livre est un nœud SVG ; au-delà de `maxBooks` on réduit la
 * taille plutôt que le nombre, parce que la leçon compte réellement les
 * objets (60 et 105 tiennent largement). Le dernier recours, pour un très
 * grand `n`, est une taille minimale : on ne tronque jamais silencieusement,
 * puisque le compte est ce que l'élève lit.
 *
 * ACCESSIBILITÉ : un seul `role="img"` pour toute la grille, avec l'égalité
 * en texte. 60 livres ne font pas 60 annonces.
 */
export default function BookRectangle({ n, cols, ariaLabel, maxBooks = 260 }) {
  const c = Math.max(1, cols | 0);
  const rows = Math.floor(n / c);
  const rest = n - rows * c;

  // La largeur d'un livre suit la charge : plus il y en a, plus ils sont
  // petits — jamais l'inverse, et jamais moins que lisible.
  const width = n > maxBooks ? 9 : n > 120 ? 12 : c > 14 ? 14 : 18;
  const gap = width < 12 ? 1 : 2;

  const shelf = (books, key, incomplete = false) => (
    <div
      key={key}
      className={`rounded-lg px-1.5 pb-1 pt-1.5 ${incomplete
        ? 'border-2 border-dashed border-amber-400 bg-amber-50'
        : 'border border-slate-200 bg-white'}`}
    >
      <div className="flex items-end" style={{ gap: `${gap}px` }}>
        {books.map((i) => <BookFigure key={i} index={i} width={width} muted={incomplete} />)}
      </div>
      {/* la planche : ce qui fait lire « rayon » plutôt que « ligne » */}
      <div className={`mt-1 h-1.5 rounded-sm ${incomplete ? 'bg-amber-300' : 'bg-amber-700/70'}`} />
    </div>
  );

  // Un grand `n` fait beaucoup de rayons (105 livres par 7 en font 15) : la
  // grille DÉFILE en interne plutôt que d'étirer la page sur mille pixels et
  // de pousser l'égalité hors de l'écran. Rien n'est tronqué — le compte est
  // ce que l'élève lit — mais le laboratoire garde une taille d'instrument.
  // Les rayons se rangent CÔTE À CÔTE et retournent à la ligne, comme dans
  // la bibliothèque du module 1 (`.be-shelves`, une grille auto-fit) : un
  // rayon est horizontal, et douze rayons empilés en une seule colonne
  // faisaient une tour, pas une bibliothèque. La largeur d'une piste suit
  // celle d'un rayon (ses `c` livres), donc la grille en met autant que
  // l'écran permet — une seule colonne sur un téléphone.
  const shelfWidth = c * (width + gap) + 14;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      dir="ltr"
      tabIndex={0}
      className="grid max-h-[22rem] w-full gap-1.5 overflow-auto overscroll-contain rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${shelfWidth}px), max-content))` }}
    >
      {Array.from({ length: rows }, (_, r) =>
        shelf(Array.from({ length: c }, (_, i) => r * c + i), `r${r}`))}
      {rest > 0 && shelf(Array.from({ length: rest }, (_, i) => rows * c + i), 'rest', true)}
    </div>
  );
}
