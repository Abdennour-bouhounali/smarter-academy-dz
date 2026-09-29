import { useTranslation } from 'react-i18next';
import { ChevronBack, ChevronForward } from './DirectionalIcons';
import { useWorkspaceLayout } from '../../context/WorkspaceLayoutContext';

/**
 * La bascule « ouvrir / réduire la barre latérale » — UNE seule, partagée par
 * l'espace élève (StudentNavbar) et l'espace enseignant (TeacherNavbar).
 *
 * OÙ : posée SUR le bord de la barre (moitié dehors, moitié dedans), à la
 * hauteur de la rangée du logo (h-16 → centre à 32 px) : c'est la frontière
 * qu'elle déplace, et le premier endroit où l'œil la cherche. Elle ne bouge
 * pas quand la barre se comprime : elle suit son bord.
 *
 * TAILLE : un disque de 32 px visible, une zone de clic de 44 px (le pseudo-
 * élément `after:` l'étend sans l'alourdir visuellement).
 *
 * ÉTAT : l'état est dérivé dans WorkspaceLayoutContext. En mode colonne de
 * « Ma carte », rouvrir la barre recalcule la colonne à côté d'elle ; la
 * bascule n'est verrouillée que sur un écran où la leçon passerait sous sa
 * largeur minimale — et elle le DIT (désactivée + libellé), au lieu de
 * proposer une action sans effet.
 *
 * `accent` : la couleur de l'espace (bleu élève, sarcelle enseignant) au
 * survol et au focus. Classes écrites en entier pour Tailwind.
 */
const ACCENT = {
  blue: 'hover:text-blue-600 hover:border-blue-300 focus-visible:ring-blue-400',
  teal: 'hover:text-teal-700 hover:border-teal-300 focus-visible:ring-teal-400',
};

export default function SidebarToggle({ accent = 'blue' }) {
  const { t } = useTranslation('nav');
  const { sidebarCollapsed, sidebarToggleLocked, toggleSidebar } = useWorkspaceLayout();
  const label = sidebarToggleLocked
    ? t('sidebarLockedByMap')
    : sidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse');

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      disabled={sidebarToggleLocked}
      aria-label={label}
      aria-expanded={!sidebarCollapsed}
      title={sidebarToggleLocked ? t('sidebarLockedByMapHint') : label}
      data-sidebar-toggle="true"
      className={[
        'absolute top-4 -end-4 z-50 w-8 h-8 rounded-full',
        "after:absolute after:-inset-1.5 after:content-['']",
        'flex items-center justify-center',
        'bg-white border border-slate-200 text-slate-500 shadow-md shadow-slate-900/10',
        'transition-[color,border-color,box-shadow,transform] duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        sidebarToggleLocked
          ? 'opacity-40 cursor-not-allowed'
          : `cursor-pointer hover:shadow-lg active:scale-95 ${ACCENT[accent] ?? ACCENT.blue}`,
      ].join(' ')}
    >
      {/* La barre est ancrée au bord de DÉBUT : la réduire la pousse vers
          lui, l'ouvrir l'en éloigne. Le chevron nomme le sens de l'ACTION ;
          DirectionalIcons choisit le glyphe selon la direction. */}
      {sidebarCollapsed
        ? <ChevronForward className="w-4 h-4" aria-hidden="true" />
        : <ChevronBack className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
