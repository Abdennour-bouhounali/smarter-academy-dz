import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import TeacherNavbar from '../teacher/TeacherNavbar';
import BackgroundLayer from '../common/BackgroundLayer';
import ScrollToTop from '../common/ScrollToTop';
import { AuthContext } from '../../context/AuthContext';
import { useWorkspaceLayout } from '../../context/WorkspaceLayoutContext';
import { needsName } from '../../utils/personName';
import PageTourProvider from '../../features/tours/PageTourProvider';

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
 *
 * MÊME ESPACE DE TRAVAIL que l'élève (2026-09-29) : <main> porte
 * `.sa-workspace-main` et les variables `--sa-sidebar-w` / `--sa-gutter-w`,
 * donc un enseignant qui lit une leçon obtient la même colonne « Ma carte »
 * (la leçon fait de la place au lieu d'être recouverte) et la même barre
 * latérale repliable. Avant, `lg:ps-64` en dur : la carte en colonne se
 * posait PAR-DESSUS 380 px de leçon.
 */
export default function TeacherLayout() {
  const { user } = useContext(AuthContext);
  const { isPrior, contentGutter, sidebarWidth } = useWorkspaceLayout();
  const location = useLocation();

  if (needsName(user)) {
    return <Navigate to="/enseignant/bienvenue" replace state={{ from: location.pathname + location.search }} />;
  }

  // « جولة تعريفية » : la visite guidée de la première visite de chaque page
  // (features/tours, docs/architecture/PAGE_TOURS.md).
  return (
    <PageTourProvider>
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <ScrollToTop />
      <BackgroundLayer />
      <TeacherNavbar />
      <main
        className="sa-workspace-main relative z-10 pt-14 pb-20 lg:pt-0 lg:pb-0 min-h-screen"
        style={{
          '--sa-sidebar-w': `${sidebarWidth}px`,
          '--sa-gutter-w': `${contentGutter}px`,
        }}
        data-workspace-prior={isPrior ? 'true' : undefined}
      >
        <Outlet />
      </main>
    </div>
    </PageTourProvider>
  );
}
