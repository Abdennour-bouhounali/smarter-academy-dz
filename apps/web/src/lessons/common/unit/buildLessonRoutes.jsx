import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { loadLessonRuntime } from '../lessonRuntimeLoader';

// Le runtime de leçon (coquille du mode classe, porte de palier, carte des
// connaissances, ancre du cahier) est UN lot paresseux partagé par toutes les
// leçons : ce fichier est importé par App.jsx, donc tout ce qu'il importe
// statiquement part dans le lot d'entrée. Voir common/lessonRuntime.jsx et
// docs/architecture/BUNDLE_BOUNDARIES.md.
const LessonClassroomShell = lazy(() => loadLessonRuntime().then((m) => ({ default: m.LessonClassroomShell })));
const LessonPageFrame = lazy(() => loadLessonRuntime().then((m) => ({ default: m.LessonPageFrame })));
const LESSON_FALLBACK = <div className="min-h-screen bg-slate-50" />;

/**
 * La fabrique des routes d'une leçon, commune à TOUTES les unités : chaque
 * unité la lie à sa matière imprimée dans `_unit/lessonRoutes.jsx` —
 *
 *   export const buildLessonRoutes = createLessonRoutesBuilder({ printSubject: PRINT_SUBJECT });
 *
 * Ce fichier est importé (via les routes.jsx) par App.jsx : il ne doit rien
 * importer de lourd (docs/architecture/BUNDLE_BOUNDARIES.md).
 *
 * Fabrique les routes d'une leçon de l'unité : la page d'accueil de la leçon
 * et un module par fichier `modules/Module<NN>*.jsx` (résolu par le NUMÉRO
 * lu dans le nom du fichier). Chaque `routes.jsx` de leçon garde son
 * `import.meta.glob` (Vite exige un littéral) et son export nommé (lu par
 * scripts/check-routes.mjs) ; le reste vit ici, une seule fois.
 */
export function createLessonRoutesBuilder({ printSubject }) {
  return function buildLessonRoutes({ config, basePath, moduleFiles, loadKnowledge, loadIndex }) {
    const LessonHome = lazy(loadIndex);
    const components = Object.entries(moduleFiles).reduce((acc, [path, loader]) => {
      const match = path.match(/Module(\d+)/);
      if (match) acc[Number(match[1])] = lazy(loader);
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
