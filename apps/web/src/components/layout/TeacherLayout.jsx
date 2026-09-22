import { Outlet } from 'react-router-dom';
import TeacherNavbar from '../teacher/TeacherNavbar';
import BackgroundLayer from '../common/BackgroundLayer';
import ScrollToTop from '../common/ScrollToTop';

/**
 * La coquille de l'espace ENSEIGNANT (« فضاء الأستاذ ») — le même espace de
 * travail que StudentLayout (barre latérale + contenu, pas de pied de page
 * visiteur), avec sa propre navigation.
 *
 * Pas de garde de classe scolaire : un enseignant n'a pas de `grade`, il
 * possède des classes qui ont chacune la leur. Le rôle est vérifié par
 * ProtectedRoute en amont ; la vraie porte reste le serveur (can:teacher).
 */
export default function TeacherLayout() {
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
