import { Suspense } from 'react';
import LessonClassroomShell from './classroom/LessonClassroomShell';
import LessonAccessGate from './components/LessonAccessGate';
import { LazyLessonKnowledgeProvider } from './knowledge/LazyKnowledgeProvider';
import LessonNotebookAnchor from './notebook/LessonNotebookAnchor';

/**
 * LE RUNTIME DE LEÇON — un seul lot, partagé par toutes les leçons montées.
 *
 * Ce qui enveloppe chaque page de leçon (la coquille du mode classe, la porte
 * de palier, la carte des connaissances, l'ancre du cahier) était importé
 * statiquement par la fabrique de routes, elle-même importée par App.jsx :
 * il partait donc dans le lot d'entrée de CHAQUE visiteur, y compris sur
 * « / ». La fabrique (`_unit/lessonRoutes.jsx`) le charge maintenant
 * paresseusement, depuis CE module, pour que Rollup en fasse un seul lot que
 * les neuf leçons se partagent.
 *
 * L'échelle de chargement d'une leçon est donc :
 *
 *   entrée      → métadonnées (lesson.config.js, via registry.js)
 *   leçon       → ce runtime (une fois pour toutes les leçons)
 *   page        → index.jsx ou Module<NN>.jsx de la leçon
 *   instrument  → la manipulation / le moteur du module (ses propres imports)
 *
 * Voir docs/architecture/BUNDLE_BOUNDARIES.md.
 */
export { LessonClassroomShell };

/**
 * Une page de leçon (sommaire ou module) dans son cadre : porte de palier
 * AVANT le chargement du code de la page — une leçon premium que ce compte ne
 * peut pas ouvrir ne télécharge pas ses modules —, puis la carte des
 * connaissances, la page et l'ancre du cahier. Composition inchangée depuis
 * `withSuspense` ; seul l'endroit où elle vit a changé.
 */
export function LessonPageFrame({ config, Component, module = null, loadKnowledge, printSubject }) {
  return (
    <LessonAccessGate lessonId={config.id} title={config.title}>
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <LazyLessonKnowledgeProvider load={loadKnowledge} lessonId={config.id} printTitle={config.title} printSubject={printSubject}>
          <Component />
          <LessonNotebookAnchor config={config} module={module} />
        </LazyLessonKnowledgeProvider>
      </Suspense>
    </LessonAccessGate>
  );
}
