import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { LazyLessonKnowledgeProvider } from '../../../../../common/knowledge/LazyKnowledgeProvider';
import LessonNotebookAnchor from '../../../../../common/notebook/LessonNotebookAnchor';
import { PRINT_SUBJECT } from './unitMeta';

/**
 * Fabrique les routes d'une leçon de l'unité : la page d'accueil de la leçon
 * et un module par fichier `modules/Module<NN>*.jsx` (résolu par le NUMÉRO
 * lu dans le nom du fichier). Chaque `routes.jsx` de leçon garde son
 * `import.meta.glob` (Vite exige un littéral) et son export nommé (lu par
 * scripts/check-routes.mjs) ; le reste vit ici, une seule fois.
 */
export function buildLessonRoutes({ config, basePath, moduleFiles, loadKnowledge, loadIndex }) {
  const LessonHome = lazy(loadIndex);
  const components = Object.entries(moduleFiles).reduce((acc, [path, loader]) => {
    const match = path.match(/Module(\d+)/);
    if (match) acc[Number(match[1])] = lazy(loader);
    return acc;
  }, {});
  // `module` : l'entrée de config.modules de la page (null pour l'accueil).
  // C'est ce que le cahier reçoit comme position — la coquille sait où
  // l'élève est, le module n'a rien à déclarer.
  const withSuspense = (Component, module = null) => (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LazyLessonKnowledgeProvider load={loadKnowledge} lessonId={config.id} printTitle={config.title} printSubject={PRINT_SUBJECT}>
        <Component />
        <LessonNotebookAnchor config={config} module={module} />
      </LazyLessonKnowledgeProvider>
    </Suspense>
  );
  return [
    <Route key={`${config.id}-index`} path={basePath} element={withSuspense(LessonHome)} />,
    ...config.modules
      .map((m) => (components[m.number] ? <Route key={`${config.id}-${m.id}`} path={m.path} element={withSuspense(components[m.number], m)} /> : null))
      .filter(Boolean),
  ];
}
