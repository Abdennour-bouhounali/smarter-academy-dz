import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { LazyLessonKnowledgeProvider } from '../../../../../common/knowledge/LazyKnowledgeProvider';
import LessonNotebookAnchor from '../../../../../common/notebook/LessonNotebookAnchor';
import LessonClassroomShell from '../../../../../common/classroom/LessonClassroomShell';
import LessonAccessGate from '../../../../../common/components/LessonAccessGate';
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

  //
  // LA PORTE DE PALIER entoure chaque page — sommaire ET modules — AVANT le
  // chargement paresseux du module : une leçon premium que ce compte ne peut
  // pas ouvrir ne télécharge même pas le code de ses modules, et une URL de
  // module tapée directement tombe sur le même panneau que le sommaire. Le
  // palier vient du serveur (lessons.tier, décidé par l'administrateur).
  const withSuspense = (Component, module = null) => (
    <LessonAccessGate lessonId={config.id} title={config.title}>
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <LazyLessonKnowledgeProvider load={loadKnowledge} lessonId={config.id} printTitle={config.title} printSubject={PRINT_SUBJECT}>
          <Component />
          <LessonNotebookAnchor config={config} module={module} />
        </LazyLessonKnowledgeProvider>
      </Suspense>
    </LessonAccessGate>
  );
  // La coquille du MODE CLASSE (وضع القسم) est une route « layout » sans
  // chemin, au-dessus du sommaire et des modules : elle reste montée quand
  // une présentation de leçon passe d'un module au suivant, et le plein écran
  // natif — qui est sur sa racine — survit à la navigation. Hors présentation
  // elle n'est qu'un <div> transparent.
  return (
    <Route key={`${config.id}-classroom`} element={<LessonClassroomShell config={config} basePath={basePath} />}>
      <Route key={`${config.id}-index`} path={basePath} element={withSuspense(LessonHome)} />
      {config.modules
        .map((m) => (components[m.number] ? <Route key={`${config.id}-${m.id}`} path={m.path} element={withSuspense(components[m.number], m)} /> : null))
        .filter(Boolean)}
    </Route>
  );
}
