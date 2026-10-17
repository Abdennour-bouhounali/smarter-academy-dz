import { useEffect } from 'react';
import { loadLessonManipulationStrings } from '../../i18n/lessonManipulationStrings';
import { loadLessonLoaders } from '../registry';

/**
 * Le chargeur UNIQUE du runtime de leçon (common/lessonRuntime.jsx).
 *
 * Un seul `import()` pour la fabrique de routes et pour les préchargements :
 * le navigateur mémoïse le module, donc précharger puis naviguer ne
 * télécharge rien deux fois.
 *
 * Pourquoi précharger : le runtime est un lot paresseux (≈ 13 Ko gzip). Une
 * leçon ouverte par URL directe coûte donc un aller-retour de plus (entrée →
 * runtime → page du module). Les pages qui LISTENT des leçons — la page
 * d'unité, l'accueil de l'élève, « دروسي » — le demandent au premier moment
 * d'inactivité : le clic sur une leçon ne l'attend plus. « / » ne le demande
 * jamais. Voir docs/architecture/BUNDLE_BOUNDARIES.md.
 *
 * Depuis le 2026-10-14, le runtime attend aussi les textes des manipulations
 * (`lesson:manipulation.*`, chargés à la demande) — une page de leçon ne
 * montre jamais une clé brute — et le préchargement demande, avec lui, ces
 * textes et la petite table des chargeurs de leçons (lessonLoaders.js) : le
 * clic sur une leçon n'attend plus que SES routes.
 */
export const loadLessonRuntime = () => Promise.all([import('./lessonRuntime'), loadLessonManipulationStrings()]).then(([runtime]) => runtime);

/**
 * Le runtime SEUL, sans attendre les textes des manipulations (2026-10-17).
 *
 * La coquille et le cadre de page (common/unit/buildLessonRoutes.jsx) n'en lisent
 * aucun ; seules les pages de MODULE (et leurs labs) en ont besoin — elles les
 * attendent elles-mêmes (`withLessonStrings`). Le SOMMAIRE d'une leçon ne paie
 * donc plus ≈ 137 Ko gzip de textes de 133 labs avant de s'afficher (mesuré :
 * 7,5 s à froid sur tablette 1,6 Mbit/s avant ce changement).
 */
export const loadLessonRuntimeCore = () => import('./lessonRuntime');

/** Un chargeur de page de module qui n'aboutit qu'avec `lesson:manipulation.*` lisible. */
export const withLessonStrings = (loader) => () =>
  Promise.all([loader(), loadLessonManipulationStrings()]).then(([module]) => module);

/**
 * Précharge les textes des labs APRÈS l'affichage du sommaire (appelé par
 * LessonIndex), pour que le clic sur un module ne les attende plus. Un délai,
 * puis un moment libre : lancés plus tôt, ces 137 Ko disputaient la bande
 * passante aux lots du sommaire lui-même (mesuré le 2026-10-17).
 */
export function prefetchLessonStringsWhenIdle(delayMs = 2000) {
  if (typeof window === 'undefined') return;
  const run = () => { loadLessonManipulationStrings().catch(() => {}); };
  window.setTimeout(() => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
    else run();
  }, delayMs);
}

let requested = false;

export function prefetchLessonRuntimeWhenIdle() {
  if (requested || typeof window === 'undefined') return;
  requested = true;
  const run = () => Promise.all([loadLessonRuntime(), loadLessonLoaders()]).catch(() => { requested = false; });
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 200);
}

/** Pour une page qui liste des leçons : précharge le runtime après son premier rendu. */
export function usePrefetchLessonRuntime() {
  useEffect(() => { prefetchLessonRuntimeWhenIdle(); }, []);
}
