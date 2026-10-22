import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import TourReplayButton from '../../features/tours/TourReplayButton';
import { teacherNavLinks } from '../../data/teacherNavigation';
import { getDisplayName, getInitials } from '../../utils/userDisplay';
import { useWorkspaceLayout } from '../../context/WorkspaceLayoutContext';
import SidebarToggle from '../common/SidebarToggle';
import { useReviewCount } from '../../features/teacher/reviews/useReviewCount';

/**
 * La navigation de l'espace enseignant — le patron de StudentNavbar (barre
 * latérale sur grand écran, barre d'onglets basse sur mobile), en livrée
 * sarcelle pour qu'on voie d'un coup d'œil qu'on n'est pas dans l'espace
 * élève. Toutes les chaînes viennent du catalogue arabe.
 *
 * BARRE REPLIABLE (w-64 → w-20), comme l'espace élève : même état dérivé
 * (`sidebarCollapsed`, WorkspaceLayoutContext), même bascule
 * (SidebarToggle). Comprimée, les icônes gardent leur zone de clic de 44 px
 * et chaque destination garde son nom en `title` + `aria-label`.
 */
export default function TeacherNavbar() {
  const { t } = useTranslation('nav');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { sidebarCollapsed } = useWorkspaceLayout();
  const reviewCount = useReviewCount();
  // La pastille d'un lien qui en porte une (« تصحيح الإجابات » : copies en attente).
  const badge = (link, className) => (link.badge === 'reviews' && reviewCount > 0 ? (
    <span
      className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-5 text-white ${className}`}
      aria-label={t('notifications.pendingReviews', { count: reviewCount })}
      data-nav-badge={link.badge}
    >
      <bdi dir="ltr">{reviewCount > 99 ? '99+' : reviewCount}</bdi>
    </span>
  ) : null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = getInitials(user);
  const gradient = 'linear-gradient(135deg, #0F766E, #3B82F6)';

  return (
    <>
      <aside
        className={`sa-workspace-sidebar hidden lg:flex lg:flex-col fixed top-0 start-0 bottom-0 bg-white border-e border-slate-200 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        data-sidebar-collapsed={sidebarCollapsed ? 'true' : undefined}
      >
        <SidebarToggle accent="teal" />

        <div className={`flex items-center h-16 border-b border-slate-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'px-5'}`}>
          {/* Ouverte : le logo en ligne (marque + nom). Réduite : la marque seule. */}
          {sidebarCollapsed ? (
            <img src="/brand/mark-color.svg" width="200" height="200" decoding="async" alt="Smarter Academy" className="h-9 w-9 flex-shrink-0" />
          ) : (
            <img src="/brand/logo-inline-color.svg" width="928" height="160" decoding="async" alt="Smarter Academy" className="h-9 w-auto" />
          )}
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" data-tour="workspace.nav">
          {teacherNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              title={t(link.labelKey)}
              aria-label={t(link.labelKey)}
              className={({ isActive }) =>
                `flex items-center rounded-xl font-inter text-sm font-medium transition-all duration-150 min-h-[44px] py-2.5 ${
                  sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
                } ${
                  isActive ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
              style={({ isActive }) => (isActive ? { background: gradient } : {})}
            >
              <span className="relative flex-shrink-0">
                <link.icon size={18} />
                {sidebarCollapsed && badge(link, 'absolute -end-2 -top-2')}
              </span>
              {!sidebarCollapsed && t(link.labelKey)}
              {!sidebarCollapsed && badge(link, 'ms-auto')}
            </NavLink>
          ))}
        </nav>

        <div className={`py-3 border-t border-slate-100 flex flex-shrink-0 ${
          sidebarCollapsed ? 'px-0 flex-col items-center gap-2' : 'px-3 items-center gap-1'
        }`}>
          <Link
            to="/enseignant/profil"
            className={`flex items-center rounded-xl hover:bg-slate-50 min-h-[44px] ${sidebarCollapsed ? 'justify-center w-11' : 'flex-1 min-w-0 gap-3 px-2 py-1.5'}`}
            aria-label={t('profile')}
            title={sidebarCollapsed ? getDisplayName(user) : t('profile')}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-space font-bold text-xs flex-shrink-0" style={{ background: gradient }}>
              {initials}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 text-start">
                <p className="font-space font-semibold text-slate-800 text-xs truncate">{getDisplayName(user)}</p>
                <p className="font-inter text-slate-400 text-[11px] truncate" dir="ltr">{user?.email}</p>
              </div>
            )}
          </Link>
          {/* « جولة في الصفحة » : rejoue la visite guidée de la page ouverte. */}
          <TourReplayButton className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0 disabled:opacity-40" />
          <button
            onClick={handleLogout}
            aria-label={t('logout')}
            title={t('logout')}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/brand/mark-color.svg" width="200" height="200" decoding="async" alt="Smarter Academy" className="h-8 w-8 flex-shrink-0" />
          <span className="font-mono-jetbrains text-[10px] text-teal-700 font-semibold tracking-wider uppercase whitespace-nowrap">{t('teacherSpace')}</span>
        </div>
        <div className="flex items-center gap-1">
          <TourReplayButton className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-40" />
          <button onClick={handleLogout} aria-label={t('logout')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* La barre basse mobile ne tient pas huit onglets lisibles : elle
          garde les destinations marquées `mobile` (data/teacherNavigation) ;
          l'offre et le profil restent dans la barre latérale et l'en-tête. */}
      <nav data-tour="workspace.nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {teacherNavLinks.filter((link) => link.mobile !== false).map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 font-inter text-[10px] font-semibold transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400'}`
            }
          >
            <span className="relative">
              <link.icon size={19} />
              {badge(link, 'absolute -end-2.5 -top-1.5')}
            </span>
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
