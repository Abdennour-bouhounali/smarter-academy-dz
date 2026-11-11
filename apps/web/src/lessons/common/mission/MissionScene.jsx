import React from 'react';
import LibraryScene from './LibraryScene';
import LibraryWallScene from './LibraryWallScene';
import ConstructionWallScene from './ConstructionWallScene';
import FlowerShopScene from './FlowerShopScene';
import SchoolBagsScene from './SchoolBagsScene';
import SewingWorkshopScene from './SewingWorkshopScene';
import BakeryScene from './BakeryScene';
import MathClubScene from './MathClubScene';
import GardenBedScene from './GardenBedScene';
import CarpetLoomScene from './CarpetLoomScene';
import FoldStripScene from './FoldStripScene';
import CourtyardSlabsScene from './CourtyardSlabsScene';
import PaintWallScene from './PaintWallScene';
import TifoBannerScene from './TifoBannerScene';
import NightCinemaScene from './NightCinemaScene';
import ShadowSquareScene from './ShadowSquareScene';
import NeighbourhoodPitchScene from './NeighbourhoodPitchScene';
import TurfRollsScene from './TurfRollsScene';

/**
 * LA SCÈNE d'une mission (rollout 2026-11-08) : chaque leçon dessine la sienne, choisie par `mission.scene` dans sa config
 * (`'library'` — la bibliothèque de 756 livres, valeur par défaut —, `'library-wall'` — le mur de 96 livres —, `'construction-wall'` — le chantier de la leçon khawass-qawasim, `'flower-shop'` — l'atelier du fleuriste de la leçon qasim-mushtarak-akbar, `'school-bags'` — les cartables de la leçon tayin-pgcd, `'sewing-workshop'` — l'atelier de couture de la leçon bahth-pgcd, `'bakery'` — la boulangerie de la leçon ikhtizal-kasr, `'math-club'` — le club de mathématiques de la leçon awwaliyan-fima-baynahuma, `'garden-bed'` — le bassin carré sur l'hypoténuse de la leçon jidhr-tarbii, `'carpet-loom'` — le métier à tisser de la leçon natiqa-ghayr-natiqa, `'fold-strip'` — la bande pliée de la foire scientifique de la leçon muadalat-x-murabba, `'courtyard-slabs'` — la cour de l'école pavée de dalles carrées de la leçon amaliyat-judhur, `'courtyard-big'` — la même cour repavée de dalles plus grandes, leçon tawzif-khawass-judhur, `'paint-wall'` — le mur du stade repeint devant un tréteau en X, leçon aksiya-talis, `'tifo-banner'` — la banderole du derby étendue dans la salle des jeunes, leçon inshaat-talis, `'night-cinema'` — le ciné-club de nuit de la place du quartier, leçon talis-hisab-atwal, `'shadow-square'` — la place à l'heure de l'ombre, la synthèse wadiya-idmajiya-talis). Une nouvelle scène =
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
  'math-club': MathClubScene,
  'garden-bed': GardenBedScene,
  'carpet-loom': CarpetLoomScene,
  'fold-strip': FoldStripScene,
  'courtyard-slabs': CourtyardSlabsScene,
  // la MÊME cour, repavée de dalles plus GRANDES (leçon tawzif-khawass-judhur, conseil du 2026-11-10) : une variante, pas une scène de plus
  'courtyard-big': CourtyardBigScene,
  // unité 9, leçon 2 aksiya-talis (conseil du 2026-11-10, L2.8) : le mur du stade repeint, le tréteau en X et son niveau — primitives communes de
  // l'unité dans thalesSceneKit.jsx, une scène mince par leçon
  'paint-wall': PaintWallScene,
  // unité 9, leçon 3 inshaat-talis (2026-11-10) : la banderole du « tifo » au sol, le compas et la règle non graduée — mêmes primitives
  'tifo-banner': TifoBannerScene,
  // unité 9, leçon 1 talis-hisab-atwal (2026-11-10) : le ciné-club de nuit — le projecteur, son faisceau, la planche blanche, le grand écran
  'night-cinema': NightCinemaScene,
  // unité 9, la synthèse wadiya-idmajiya-talis (2026-11-10) : la place à l'heure de l'ombre — une tour SANS symbole, la perche, un rayon
  'shadow-square': ShadowSquareScene,
  // unité 3, leçon 1 nashr-tabsit (2026-11-11) : le terrain du quartier et les bancs le long du couloir coupé — primitives communes de l'unité
  // dans pitchSceneKit.jsx, une scène mince par leçon
  'neighbourhood-pitch': NeighbourhoodPitchScene,
  // unité 3, leçon 3 tahlil-ibara (conseil du 2026-11-11) : les rouleaux de gazon empilés le long du grillage, des RANGÉES de gazon posées au fil
  // des outils — primitives communes de l'unité dans pitchSceneKit.jsx, une scène mince par leçon
  'turf-rolls': TurfRollsScene,
};

function CourtyardBigScene(props) {
  return <CourtyardSlabsScene {...props} slabs={3} scene="courtyard-big" />;
}

export default function MissionScene({ scene, ...props }) {
  const Scene = SCENES[scene] ?? LibraryScene;
  return <Scene {...props} />;
}
