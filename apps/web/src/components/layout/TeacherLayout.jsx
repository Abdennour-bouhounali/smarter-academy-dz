import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import TeacherNavbar from '../teacher/TeacherNavbar';
import BackgroundLayer from '../common/BackgroundLayer';
import ScrollToTop from '../common/ScrollToTop';
import { AuthContext } from '../../context/AuthContext';
import { needsName } from '../../utils/personName';

/**
 * La coquille de l'espace ENSEIGNANT (« فضاء الأستاذ ») — le même espace de
 * travail que StudentLayout (barre latérale + contenu, pas de pied de page
 * visiteur), avec sa propre navigation.
 *
 * Pas de garde de classe scolaire : un enseignant n'a pas de `grade`, il
 * possède des classes qui ont chacune la leur. Le rôle est vérifié par
 * ProtectedRoute en amont ; la vraie porte reste le serveur (can:teacher).
 *
 * UNE garde, en revanche : « الاسم و اللقب ». Les élèves d'un enseignant le
 * lisent sous ce nom ; un compte qui n'en a pas encore passe par l'étape
 * /enseignant/bienvenue, puis revient à la page qu'il visait.
 */
export default function TeacherLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (needsName(user)) {
    return <Navigate to="/enseignant/bienvenue" replace state={{ from: location.pathname + location.search }} />;
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <ScrollToTop />
      <BackgroundLayer />
      <TeacherNavbar />
      <main className="relative z-10 pt-14 pb-20 lg:pt-0 lg:pb-0 lg:ps-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
