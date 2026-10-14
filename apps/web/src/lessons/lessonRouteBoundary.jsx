import { Suspense, useMemo, useSyncExternalStore } from 'react';
import { Route } from 'react-router-dom';
import { getBuiltLessons, loadLessonRoutesFactory } from './registry';
import { loadLessonManipulationStrings } from '../i18n/lessonManipulationStrings';

/**
 * LA FRONTIÈRE DE ROUTES DES LEÇONS — une seule pour toutes les leçons (2026-10-14).
 *
 * Avant : App.jsx importait STATIQUEMENT le routes.jsx de chaque leçon (74
 * imports), et chacun sa lesson.config.js — chaque leçon publiée coûtait
 * ≈ 4,5 Ko gzip à CHAQUE visiteur, page d'accueil comprise.
 *
 * Maintenant, App.jsx appelle `useLessonRoutes()` et monte ce qu'il rend :
 *
 *   - une leçon PAS ENCORE CHARGÉE → UNE route `<basePath>/*` (son chemin vient
 *     de l'index léger, registry.js) dont l'élément charge son routes.jsx (et
 *     donc sa config) ET les textes des manipulations, sous un <Suspense> ;
 *   - une leçon CHARGÉE → SES PROPRES routes, exactement celles que son
 *     routes.jsx fabrique (buildLessonRoutes) : coquille du mode classe en
 *     route « layout », sommaire, un module par fichier. La route `/*` d'attente
 *     disparaît.
 *
 * Le passage de l'une à l'autre est un nouveau rendu des routes d'App
 * (useSyncExternalStore) : l'URL ne change pas, la route réelle prend le
 * relais. D'où les garanties d'avant, inchangées : liens profonds, une URL de
 * module inconnue retombe sur `*` (une fois la leçon chargée, plus rien
 * n'attrape `/*`), la coquille du mode classe reste montée d'un module à
 * l'autre, l'ancre du cahier et la carte des connaissances lisent la config
 * déjà chargée. scripts/check-routes.mjs vérifie le montage.
 *
 * Ce fichier est importé par App.jsx : il n'importe rien de lourd (l'index
 * léger, React Router, le chargeur de textes). Voir
 * docs/architecture/BUNDLE_BOUNDARIES.md (§3 « Lesson route boundary »).
 */

const LESSON_FALLBACK = <div className="min-h-screen bg-slate-50" />;

const loadedRoutes = new Map(); // id → l'arbre <Route> de la leçon
const pending = new Map(); // id → Promise
const failures = new Map(); // id → Error (rendue une fois, comme un lazy() en échec)
const listeners = new Set();
let version = 0;

function notify() {
  version += 1;
  for (const listener of listeners) listener();
}
const subscribe = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
const getVersion = () => version;

/**
 * Charge les routes d'une leçon (et les textes des manipulations). Idempotent ;
 * utilisable comme préchargement (survol d'une carte de leçon).
 * @returns {Promise<void>}
 */
export function loadLessonRoutes(lessonId) {
  if (loadedRoutes.has(lessonId)) return Promise.resolve();
  if (!pending.has(lessonId)) {
    const promise = Promise.all([loadLessonRoutesFactory(lessonId), loadLessonManipulationStrings()])
      .then(([factory]) => {
        if (typeof factory !== 'function') throw new Error(`Lesson routes not found: ${lessonId}`);
        loadedRoutes.set(lessonId, factory());
        notify();
      })
      .catch((error) => { failures.set(lessonId, error); })
      .finally(() => pending.delete(lessonId));
    pending.set(lessonId, promise);
  }
  return pending.get(lessonId);
}

/** L'élément de la route d'attente : suspend jusqu'à l'arrivée des routes réelles. */
function LessonRoutesLoader({ lessonId }) {
  if (loadedRoutes.has(lessonId)) return LESSON_FALLBACK; // App remonte les routes réelles
  if (failures.has(lessonId)) {
    const error = failures.get(lessonId);
    failures.delete(lessonId);
    throw error; // comme un lazy() dont le lot n'arrive pas
  }
  throw loadLessonRoutes(lessonId);
}

/**
 * Les <Route> de toutes les leçons construites, à placer dans <Routes> là où
 * étaient les 74 appels `{xxxRoutes()}` (sous CourseLayout › RequireAccount).
 * @returns {JSX.Element[]}
 */
export function useLessonRoutes() {
  const current = useSyncExternalStore(subscribe, getVersion, getVersion);
  return useMemo(
    () => getBuiltLessons().map(({ id, basePath }) => loadedRoutes.get(id) ?? (
      <Route
        key={`${id}-lazy`}
        path={`${basePath}/*`}
        element={<Suspense fallback={LESSON_FALLBACK}><LessonRoutesLoader lessonId={id} /></Suspense>}
      />
    )),
    // `current` : un nouveau tableau à chaque leçon chargée.
    [current],
  );
}
