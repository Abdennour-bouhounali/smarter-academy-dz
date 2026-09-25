import { useEffect } from 'react';

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
 */
export const loadLessonRuntime = () => import('./lessonRuntime');

let requested = false;

export function prefetchLessonRuntimeWhenIdle() {
  if (requested || typeof window === 'undefined') return;
  requested = true;
  const run = () => loadLessonRuntime().catch(() => { requested = false; });
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 200);
}

/** Pour une page qui liste des leçons : précharge le runtime après son premier rendu. */
export function usePrefetchLessonRuntime() {
  useEffect(() => { prefetchLessonRuntimeWhenIdle(); }, []);
}
