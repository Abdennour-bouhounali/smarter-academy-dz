import React from 'react';
import LibraryScene from './LibraryScene';
import LibraryWallScene from './LibraryWallScene';
import ConstructionWallScene from './ConstructionWallScene';
import FlowerShopScene from './FlowerShopScene';
import SchoolBagsScene from './SchoolBagsScene';
import SewingWorkshopScene from './SewingWorkshopScene';
import BakeryScene from './BakeryScene';

/**
 * LA SCÈNE d'une mission (rollout 2026-11-08) : chaque leçon dessine la sienne, choisie par `mission.scene` dans sa config
 * (`'library'` — la bibliothèque de 756 livres, valeur par défaut —, `'library-wall'` — le mur de 96 livres —, `'construction-wall'` — le chantier de la leçon khawass-qawasim, `'flower-shop'` — l'atelier du fleuriste de la leçon qasim-mushtarak-akbar, `'school-bags'` — les cartables de la leçon tayin-pgcd, `'sewing-workshop'` — l'atelier de couture de la leçon bahth-pgcd, `'bakery'` — la boulangerie de la leçon ikhtizal-kasr). Une nouvelle scène =
 * un composant `<Nom>Scene({ fill, label, className })` dessiné en code, ajouté à ce registre ; `fill` ∈ [0, 1] suit les outils gagnés.
 */
const SCENES = {
  library: LibraryScene,
  'library-wall': LibraryWallScene,
  'construction-wall': ConstructionWallScene,
  'flower-shop': FlowerShopScene,
  'school-bags': SchoolBagsScene,
  'sewing-workshop': SewingWorkshopScene,
  bakery: BakeryScene,
};

export default function MissionScene({ scene, ...props }) {
  const Scene = SCENES[scene] ?? LibraryScene;
  return <Scene {...props} />;
}
