import React, { useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClassroomPresentation from './ClassroomPresentation';
import { lessonNeighbours } from './classroomUnits';

/**
 * La coquille de présentation d'une LEÇON — un élément de route « layout »
 * posé au-dessus du sommaire et des modules (buildLessonRoutes). Il reste
 * monté quand on passe d'un module à l'autre : c'est ce qui permet à la
 * session (et au plein écran natif, qui est sur SA racine) de survivre à la
 * navigation « module suivant » d'une présentation de leçon.
 *
 * Elle sert les deux portées supérieures :
 *   🎓 وضع القسم   (sommaire → module 0 → … → dernier module)
 *   ⛶ عرض          (le module courant, ses unités seulement) — bouton flottant
 *
 * Elle ne connaît rien du contenu : les pages présentées déclarent leur
 * titre et leurs gestes (useClassroomStage) ; elle ne fournit que la
 * navigation entre pages, dérivée de LESSON_CONFIG.modules et de l'URL.
 */
export default function LessonClassroomShell({ config, basePath }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');

  const neighbours = useMemo(() => lessonNeighbours(config, basePath, pathname), [config, basePath, pathname]);
  const goPrevious = useCallback(() => { if (neighbours.previous) navigate(neighbours.previous); }, [navigate, neighbours.previous]);
  const goNext = useCallback(() => { if (neighbours.next) navigate(neighbours.next); }, [navigate, neighbours.next]);
  // Le libellé du saut NOMME sa cible (« المحور 2 ») plutôt que de répéter
  // « المحور التالي » : l'enseignant voit où il va avant de cliquer. Le
  // retour au sommaire garde son nom à lui.
  const labelFor = useCallback((module, fallbackKey) => (module
    ? `${t('nav.module')} ${module.number}`
    : t(fallbackKey)), [t]);
  const lessonNavigation = useMemo(() => ({
    previous: neighbours.previous ? goPrevious : null,
    next: neighbours.next ? goNext : null,
    previousLabel: neighbours.previous ? labelFor(neighbours.previousModule, 'classroom.positionOverview') : undefined,
    nextLabel: neighbours.next ? labelFor(neighbours.nextModule, 'classroom.nextModule') : undefined,
    position: neighbours.position,
    total: neighbours.total,
  }), [neighbours, goPrevious, goNext, labelFor]);

  return (
    <ClassroomPresentation
      scope="lesson"
      title={config.title}
      entry="none"
      routeScope={basePath}
      lessonNavigation={lessonNavigation}
      className="sa-classroom-lesson"
    >
      <Outlet />
    </ClassroomPresentation>
  );
}
