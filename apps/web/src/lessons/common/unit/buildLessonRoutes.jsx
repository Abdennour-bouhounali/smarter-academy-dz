import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { loadLessonRuntimeCore, withLessonStrings } from '../lessonRuntimeLoader';
import { rememberLessonConfig } from '../../registry';

// Le runtime de leçon (coquille du mode classe, porte de palier, carte des
// connaissances, ancre du cahier) est UN lot paresseux partagé par toutes les
// leçons. Ce fichier est chargé avec le routes.jsx d'une leçon, à travers la
// frontière de routes (lessons/lessonRouteBoundary.jsx) — plus par App.jsx
// depuis le 2026-10-14 — mais il reste partagé par toutes les leçons : rien de
// lourd ici. Voir common/lessonRuntime.jsx et docs/architecture/BUNDLE_BOUNDARIES.md.
const LessonClassroomShell = lazy(() => loadLessonRuntimeCore().then((m) => ({ default: m.LessonClassroomShell })));
const LessonPageFrame = lazy(() => loadLessonRuntimeCore().then((m) => ({ default: m.LessonPageFrame })));
const LESSON_FALLBACK = <div className="min-h-screen bg-slate-50" />;

/**
 * Un `lazy()` qui se PRÉCHARGE : `LessonPageFrame` appelle `Component.preload()`
 * dès son rendu. Sans cela, la page (sommaire ou module) n'était demandée
 * qu'APRÈS la carte des connaissances (`knowledge.jsx` + KaTeX, ≈ 80 Ko), qui
 * suspend au-dessus d'elle : deux téléchargements en série au lieu de deux en
 * parallèle (≈ 0,9 s sur tablette à 1,6 Mbit/s, mesuré le 2026-10-17).
 */
function lazyWithPreload(loader) {
  let promise = null;
  const load = () => (promise ??= loader().catch((error) => { promise = null; throw error; }));
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}

/**
 * La fabrique des routes d'une leçon, commune à TOUTES les unités : chaque
 * unité la lie à sa matière imprimée dans `_unit/lessonRoutes.jsx` —
 *
 *   export const buildLessonRoutes = createLessonRoutesBuilder({ printSubject: PRINT_SUBJECT });
 *
 * Ce fichier est chargé (via les routes.jsx) par la frontière de routes des
 * leçons : il ne doit rien importer de lourd (docs/architecture/BUNDLE_BOUNDARIES.md).
 *
 * Fabrique les routes d'une leçon de l'unité : la page d'accueil de la leçon
 * et un module par fichier `modules/Module<NN>*.jsx` (résolu par le NUMÉRO
 * lu dans le nom du fichier). Chaque `routes.jsx` de leçon garde son
 * `import.meta.glob` (Vite exige un littéral) et son export nommé (lu par
 * scripts/check-routes.mjs) ; le reste vit ici, une seule fois.
 */
export function createLessonRoutesBuilder({ printSubject }) {
  return function buildLessonRoutes({ config, basePath, moduleFiles, loadKnowledge, loadIndex }) {
    // La config complète est désormais lisible SYNCHRONEMENT par les pages de
    // la leçon (registry.getLoadedLessonConfig : carte des connaissances…).
    rememberLessonConfig(config);
    const LessonHome = lazyWithPreload(loadIndex);
    const components = Object.entries(moduleFiles).reduce((acc, [path, loader]) => {
      const match = path.match(/Module(\d+)/);
      // Un module (et ses labs) lit `lesson:manipulation.*` : il attend ces textes.
      // Le sommaire, non — il s'affiche sans eux (lessonRuntimeLoader.js).
      if (match) acc[Number(match[1])] = lazyWithPreload(withLessonStrings(loader));
      return acc;
    }, {});
    // `module` : l'entrée de config.modules de la page (null pour l'accueil).
    // C'est ce que le cahier reçoit comme position — la coquille sait où
    // l'élève est, le module n'a rien à déclarer.

    //
    // LA PORTE DE PALIER entoure chaque page — sommaire ET modules — AVANT le
    // chargement paresseux du module : une leçon premium que ce compte ne peut
    // pas ouvrir ne télécharge même pas le code de ses modules, et une URL de
    // module tapée directement tombe sur le même panneau que le sommaire. Le
    // palier vient du serveur (lessons.tier, décidé par l'administrateur).
    // (La composition porte → connaissances → page → ancre vit dans
    // LessonPageFrame, common/lessonRuntime.jsx.)
    const withSuspense = (Component, module = null) => (
      <Suspense fallback={LESSON_FALLBACK}>
        <LessonPageFrame
          config={config}
          Component={Component}
          module={module}
          loadKnowledge={loadKnowledge}
          printSubject={printSubject}
        />
      </Suspense>
    );
    // La coquille du MODE CLASSE (وضع القسم) est une route « layout » sans
    // chemin, au-dessus du sommaire et des modules : elle reste montée quand
    // une présentation de leçon passe d'un module au suivant, et le plein écran
    // natif — qui est sur sa racine — survit à la navigation. Hors présentation
    // elle n'est qu'un <div> transparent.
    return (
      <Route
        key={`${config.id}-classroom`}
        element={(
          <Suspense fallback={LESSON_FALLBACK}>
            <LessonClassroomShell config={config} basePath={basePath} />
          </Suspense>
        )}
      >
        <Route key={`${config.id}-index`} path={basePath} element={withSuspense(LessonHome)} />
        {config.modules
          .map((m) => (components[m.number] ? <Route key={`${config.id}-${m.id}`} path={m.path} element={withSuspense(components[m.number], m)} /> : null))
          .filter(Boolean)}
      </Route>
    );
  };
}
