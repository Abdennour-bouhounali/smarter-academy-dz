import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { teacherNavLinks } from '../../data/teacherNavigation';
import { getDisplayName, getInitials } from '../../utils/userDisplay';

/**
 * La navigation de l'espace enseignant — le patron de StudentNavbar (barre
 * latérale sur grand écran, barre d'onglets basse sur mobile), en livrée
 * sarcelle pour qu'on voie d'un coup d'œil qu'on n'est pas dans l'espace
 * élève. Toutes les chaînes viennent du catalogue arabe.
 */
export default function TeacherNavbar() {
  const { t } = useTranslation('nav');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = getInitials(user);
  const gradient = 'linear-gradient(135deg, #0F766E, #3B82F6)';

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col fixed top-0 start-0 bottom-0 w-64 bg-white border-e border-slate-200 z-40">
        <div className="flex items-center h-16 border-b border-slate-100 flex-shrink-0 gap-2.5 px-6">
          <img src="/smarter-academy-logo.webp" alt="Smarter Academy" className="h-9 w-auto rounded-lg object-contain flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-space font-bold text-slate-900 text-sm">Smarter Academy</span>
            <span className="font-mono-jetbrains text-[10px] text-teal-700 font-semibold tracking-wider uppercase mt-0.5">{t('teacherSpace')}</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {teacherNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              title={t(link.labelKey)}
              aria-label={t(link.labelKey)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-sm font-medium transition-all duration-150 min-h-[44px] ${
                  isActive ? 'text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
              style={({ isActive }) => (isActive ? { background: gradient } : {})}
            >
              <link.icon size={18} className="flex-shrink-0" />
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="py-3 border-t border-slate-100 flex flex-shrink-0 px-3 items-center gap-1">
          <Link to="/enseignant/profil" className="flex-1 min-w-0 flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 min-h-[44px]" aria-label={t('profile')}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-space font-bold text-xs flex-shrink-0" style={{ background: gradient }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-start">
              <p className="font-space font-semibold text-slate-800 text-xs truncate">{getDisplayName(user)}</p>
              <p className="font-inter text-slate-400 text-[11px] truncate" dir="ltr">{user?.email}</p>
            </div>
          </Link>
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
          <img src="/smarter-academy-logo.webp" alt="Smarter Academy" className="h-8 w-auto rounded-md object-contain flex-shrink-0" />
          <span className="font-mono-jetbrains text-[10px] text-teal-700 font-semibold tracking-wider uppercase whitespace-nowrap">{t('teacherSpace')}</span>
        </div>
        <button onClick={handleLogout} aria-label={t('logout')} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <LogOut size={15} />
        </button>
      </header>

      {/* La barre basse mobile ne tient pas huit onglets lisibles : elle
          garde les destinations marquées `mobile` (data/teacherNavigation) ;
          l'offre et le profil restent dans la barre latérale et l'en-tête. */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {teacherNavLinks.filter((link) => link.mobile !== false).map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 font-inter text-[10px] font-semibold transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400'}`
            }
          >
            <link.icon size={19} />
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
