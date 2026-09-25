import { Suspense, lazy, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { describeLearningViewer } from '../../features/learning/learningViewer';
import StudentLayout from './StudentLayout';
import MainLayout from './MainLayout';

// La coquille ENSEIGNANT est un lot à part, comme dans App.jsx : ce fichier
// est importé statiquement par App.jsx, et un import statique ici remettait
// l'espace enseignant dans le lot d'entrée de chaque élève et visiteur.
// Voir docs/architecture/BUNDLE_BOUNDARIES.md.
const TeacherLayout = lazy(() => import('./TeacherLayout'));

/**
 * La coquille d'une leçon dépend de QUI la regarde (learningViewer) :
 *
 *   élève        StudentLayout — son espace de travail (barre latérale,
 *                garde de classe : sans `grade`, retour à l'accueil) ;
 *   enseignant   TeacherLayout — le MÊME moteur de leçon dans SON espace,
 *                tous les modules ouverts, rien d'écrit dans une progression ;
 *   visiteur et administrateur   la coquille visiteur, dont la Navbar
 *                connaît déjà le rôle.
 *
 * `usesStudentShell` / `usesWorkspaceShell` sont exportés pour que le bandeau
 * de leçon (useLessonChromeLayout) dérive ses décalages de la MÊME décision.
 */
export function usesStudentShell(user) {
  return user?.role === 'student';
}

/** Élève ou enseignant : une barre latérale et un en-tête mobile, pas de Navbar visiteur. */
export function usesWorkspaceShell(user) {
  return describeLearningViewer(user).usesWorkspaceShell;
}

export default function CourseLayout() {
  const { user } = useContext(AuthContext);
  const viewer = describeLearningViewer(user);

  if (viewer.role === 'student') {
    return <StudentLayout />;
  }
  if (viewer.role === 'teacher') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
        <TeacherLayout />
      </Suspense>
    );
  }

  return <MainLayout />;
}
