import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import StudentLayout from './StudentLayout';
import MainLayout from './MainLayout';

/**
 * La coquille d'une leçon dépend de QUI la regarde — et c'est un compte
 * ÉLÈVE qui décide, pas la seule authentification. StudentLayout est l'espace
 * de travail de l'élève (barre latérale, garde de classe : sans `grade`, il
 * renvoie vers l'accueil). Un administrateur — le seul rôle présentateur du
 * mode classe aujourd'hui (core/auth.js) — n'a pas de classe et n'a rien à
 * faire dans cet espace : il verrait la leçon lui échapper vers /admin. Il
 * la lit donc dans la coquille visiteur, dont la Navbar connaît déjà son rôle.
 *
 * `usesStudentShell` est exporté pour que le bandeau de leçon
 * (useLessonChromeLayout) dérive ses décalages de la MÊME décision.
 */
export function usesStudentShell(user) {
  return user?.role === 'student';
}

export default function CourseLayout() {
  const { user } = useContext(AuthContext);

  if (usesStudentShell(user)) {
    return <StudentLayout />;
  }

  return <MainLayout />;
}
