import { Box } from 'lucide-react';
import { defineMathLabTool } from '../../toolContract.js';
import { GEOMETRY3D_SCHEMA_VERSION, createGeometry3DData } from './geometryState.js';
import { summarizeGeometry3D } from './summarize.js';

/**
 * La géométrie dans l'espace (الهندسة ثلاثية الأبعاد) — le troisième
 * instrument du مختبر الرياضيات.
 *
 * Choisir un solide (cube, pavé droit, sphère, cylindre, cône), le voir en
 * trois dimensions, le tourner, zoomer, changer ses dimensions et lire
 * aussitôt son volume et son aire. Le rendu est three.js (MIT), piloté
 * directement (solidScene.js) — pas de React Three Fiber : l'état du moteur
 * reste hors de React, comme pour Excalidraw et la fenêtre du grapheur.
 * Chargé PARESSEUSEMENT par `load`. Le choix est documenté dans
 * docs/architecture/MATH_LAB.md.
 */
export const geometry3dTool = defineMathLabTool({
  id: 'geometry3d',
  slug: 'geometrie-3d',
  labelKey: 'tools.geometry3d.name',
  descriptionKey: 'tools.geometry3d.description',
  newLabelKey: 'tools.geometry3d.new',
  defaultTitleKey: 'tools.geometry3d.defaultTitle',
  icon: Box,
  schemaVersion: GEOMETRY3D_SCHEMA_VERSION,
  createInitialData: createGeometry3DData,
  summarize: summarizeGeometry3D,
  load: () => import('./Geometry3DTool.jsx'),
});
