import React from 'react';
import LibraryScene from './LibraryScene';
import LibraryWallScene from './LibraryWallScene';

/**
 * LA SCÈNE d'une mission (rollout 2026-11-08) : chaque leçon dessine la sienne, choisie par `mission.scene` dans sa config
 * (`'library'` — la bibliothèque de 756 livres, valeur par défaut —, `'library-wall'` — le mur de 96 livres). Une nouvelle scène =
 * un composant `<Nom>Scene({ fill, label, className })` dessiné en code, ajouté à ce registre ; `fill` ∈ [0, 1] suit les outils gagnés.
 */
const SCENES = {
  library: LibraryScene,
  'library-wall': LibraryWallScene,
};

export default function MissionScene({ scene, ...props }) {
  const Scene = SCENES[scene] ?? LibraryScene;
  return <Scene {...props} />;
}
