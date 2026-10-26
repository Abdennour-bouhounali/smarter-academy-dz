import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Crown, ShieldCheck } from 'lucide-react';
import SettingsButton from '../../features/settings/SettingsButton';
import NotificationBell from '../../features/notifications/NotificationBell';
import TourReplayButton from '../../features/tours/TourReplayButton';
import { useTranslation } from 'react-i18next';
import SidebarToggle from '../common/SidebarToggle';
import { AuthContext } from '../../context/AuthContext';
import { studentNavLinks } from '../../data/studentNavigation';
import { getAllGradesSummary } from '../../utils/gradeSummary';
import { getDisplayName, getInitials } from '../../utils/userDisplay';
import { useWorkspaceLayout } from '../../context/WorkspaceLayoutContext';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';

/**
 * The student workspace's own navigation shell — a left sidebar on desktop,
 * a bottom tab bar on mobile. Deliberately NOT the visitor's top nav +
 * hamburger-drawer pattern: this is a workspace to live in, not a page to
 * scroll through.
 *
 * L'ENCART DU BAS suit le DROIT D'ACCÈS, il ne le suppose plus. Il fut un
 * temps un lien d'achat inconditionnel vers /tarifs — un abonné se voyait donc
 * proposer, à chaque page de son espace, d'acheter ce qu'il venait de payer.
 * Il a maintenant deux formes, choisies par `usePremiumStatus` (donc par le
 * serveur) : un ÉTAT pour qui a déjà accès, une INVITATION pour qui ne l'a
 * pas. Et rien du tout tant que la réponse n'est pas arrivée.
 *
 * BARRE COMPRIMÉE (w-64 → w-20) — l'élève doit continuer à voir OÙ est la
 * navigation : les icônes restent, à leur taille et avec leur zone de clic ;
 * seuls les libellés et l'encart Premium s'effacent. Le nom de chaque
 * destination reste porté par `title` + `aria-label` sur le lien, donc lisible
 * au survol, au clavier et par un lecteur d'écran.
 *
 * DEUX RAISONS de se comprimer, UN seul état (`sidebarCollapsed`, dérivé dans
 * WorkspaceLayoutContext) :
 *
 *   le repli MANUEL   — l'élève veut plus de place, carte ou pas
 *   le mode COLONNE   — « Ma carte » a besoin de la place, et l'emporte
 *
 * En mode colonne, la barre est comprimée par défaut mais peut être rouverte :
 * la colonne se recalcule à côté d'elle (voir SidebarToggle).
 */
export default function StudentNavbar() {
  const { t } = useTranslation('nav');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { sidebarCollapsed } = useWorkspaceLayout();
  const { isPremium, hasSubscription, canSeeUpgrade } = usePremiumStatus();

  const grade = user?.grade ? getAllGradesSummary().find((g) => g.id === user.grade) : null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = getInitials(user);
  // Un bouton de la barre des outils du compte : carré de 32px réduite, case
  // pleine largeur de la grille ouverte (la zone de clic suit la case).
  const toolButton = `${sidebarCollapsed ? 'w-8' : 'w-full'} h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm transition-colors`;

  return (
    <>
      {/* Desktop sidebar — anchored to the START edge (`start-0`, `border-e`):
          the visual left in LTR, the visual right under the platform's RTL
          default (src/locale.js). Logical utilities, so no per-direction
          override is needed. */}
      <aside
        className={`sa-workspace-sidebar hidden lg:flex lg:flex-col fixed top-0 start-0 bottom-0 bg-white border-e border-slate-200 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
        data-sidebar-collapsed={sidebarCollapsed ? 'true' : undefined}
      >
        {/* Bascule ouvrir / réduire — partagée avec l'espace enseignant
            (components/common/SidebarToggle.jsx : position, taille, états). */}
        <SidebarToggle accent="blue" />

        {/* L'EN-TÊTE EST UNE MARQUE, PAS UNE PORTE.
            C'était un lien vers « / », c'est-à-dire vers le site vitrine :
            l'élève qui cliquait sur le logo de son espace de travail en
            sortait sans l'avoir demandé. Un espace de travail ne se quitte
            pas par son propre titre — la navigation, elle, est juste en
            dessous, et « Accueil » y mène à /espace, qui est l'accueil que
            cet élève attend. */}
        <div className={`flex items-center h-16 border-b border-slate-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'px-5'}`}>
          {/* Ouverte : le logo en ligne (marque + nom). Réduite : la marque seule. */}
          {sidebarCollapsed ? (
            <img src="/brand/mark-color.svg" width="200" height="200" decoding="async" alt="Smarter Academy" className="h-9 w-9 flex-shrink-0" />
          ) : (
            <img src="/brand/logo-inline-color.svg" width="928" height="160" decoding="async" alt="Smarter Academy" className="h-9 w-auto" />
          )}
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" data-tour="workspace.nav">
          {studentNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              title={t(link.labelKey)}
              aria-label={t(link.labelKey)}
              className={({ isActive }) =>
                // Comprimée, la pastille reste un carré de 44px : la zone de
                // clic ne rétrécit pas avec le libellé (min-h-[44px] + w-full).
                `flex items-center rounded-xl font-inter text-sm font-medium transition-all duration-150 min-h-[44px] ${
                  sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
                } py-2.5 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
              style={({ isActive }) => (isActive ? { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' } : {})}
            >
              <link.icon size={18} className="flex-shrink-0" />
              {!sidebarCollapsed && t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Trois sorties, et le silence en fait partie : tant que le serveur
            n'a pas répondu, ni état ni invitation — on ne vend rien dans le
            doute, et on n'annonce pas un abonnement qu'on n'a pas vérifié. */}
        {(isPremium || canSeeUpgrade) && (
          <div className="px-3 pb-3">
            {isPremium ? (
              // UN ÉTAT, PAS UN BOUTON. L'élève a payé : il n'y a rien à
              // obtenir ici. Le lien mène à la GESTION de son abonnement,
              // jamais à une seconde souscription. Un accès accordé par
              // l'administration n'est pas un abonnement — il le voit dit
              // autrement, et n'a pas de portail à ouvrir.
              // Le produit algérien n'a NI abonnement NI portail de
              // paiement : les deux branches disent donc le même état, et
              // aucune ne mène à un moyen de paiement en ligne. La distinction
              // reste lue depuis le serveur pour le jour où elle existera.
              hasSubscription ? (
                <div
                  title="وصول كامل"
                  className={`flex items-center rounded-xl bg-violet-50 border border-violet-200 mb-3 min-h-[44px] ${
                    sidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-2.5 px-3.5 py-3'
                  }`}
                >
                  <ShieldCheck size={16} className="text-violet-600 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="min-w-0">
                      <p className="font-space font-bold text-slate-800 text-xs">وصول كامل</p>
                      <p className="font-inter text-slate-500 text-[11px] leading-tight">كل الدروس متاحة</p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  title="وصول كامل"
                  className={`flex items-center rounded-xl bg-violet-50 border border-violet-200 mb-3 min-h-[44px] ${
                    sidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-2.5 px-3.5 py-3'
                  }`}
                >
                  <ShieldCheck size={16} className="text-violet-600 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="min-w-0">
                      <p className="font-space font-bold text-slate-800 text-xs">وصول كامل</p>
                      <p className="font-inter text-slate-500 text-[11px] leading-tight">كل الدروس متاحة</p>
                    </div>
                  )}
                </div>
              )
            ) : (
              // L'INVITATION — intacte pour qui n'a pas encore accès : lui
              // retirer l'offre lui retirerait le moyen de la découvrir.
              // Elle mène à la SAISIE D'UN CODE, et non à un tarif : le
              // produit algérien se paie en espèces, hors de l'application
              // (master spec §17, §18).
              <Link
                to="/espace/activation"
                title="تفعيل الوصول"
                aria-label="تفعيل الوصول"
                className={`flex items-center rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 mb-3 hover:border-amber-300 transition-colors min-h-[44px] ${
                  sidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-2.5 px-3.5 py-3'
                }`}
              >
                <Crown size={16} className="text-amber-500 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="font-space font-bold text-slate-800 text-xs">تفعيل الوصول</p>
                    <p className="font-inter text-slate-500 text-[11px] leading-tight">أدخل رمز بطاقتك</p>
                  </div>
                )}
              </Link>
            )}
          </div>
        )}

        {/* LE BLOC D'IDENTITÉ EST LA PORTE DU PROFIL. Avatar, nom et classe
            forment un seul lien vers /espace/profil ; l'entrée « Profil » de
            la liste de navigation a disparu, elle disait deux fois la même
            chose. La déconnexion reste un bouton séparé, hors du lien. */}
        <div className={`border-t border-slate-100 flex-shrink-0 ${sidebarCollapsed ? 'py-3 px-0 flex flex-col items-center gap-2' : 'p-3 space-y-2'}`}>
          <NavLink
            to="/espace/profil"
            title={sidebarCollapsed ? `${getDisplayName(user)} — ${grade ? grade.name : 'Classe non définie'}` : t('profile')}
            aria-label={t('profile')}
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-colors min-h-[44px] ${
                sidebarCollapsed ? 'justify-center w-11' : 'w-full min-w-0 gap-3 px-2 py-2'
              } ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'}`
            }
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-space font-bold text-sm flex-shrink-0 ring-2 ring-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              {initials}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 text-start">
                <p className="font-space font-bold text-slate-800 text-sm truncate">{getDisplayName(user)}</p>
                <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 font-inter text-[11px] font-semibold text-blue-700 whitespace-nowrap">
                  {grade ? grade.name : 'Classe non définie'}
                </span>
              </div>
            )}
          </NavLink>
          {/* LES OUTILS DU COMPTE (cloche, « الإعدادات », « جولة في الصفحة »,
              déconnexion) : ouverte, une BARRE segmentée SOUS l'identité — la
              ligne d'identité garde toute sa largeur (la classe n'est plus
              tronquée) et les quatre icônes ne forment plus une colonne plus
              haute que le bloc qu'elles accompagnent. Réduite : empilées. */}
          <div
            className={sidebarCollapsed
              ? 'flex flex-col items-center gap-2'
              : 'grid grid-cols-4 gap-1 rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100'}
            data-account-tools
          >
            {/* La cloche : « صحّح أستاذك إجابتك » (2026-10-06), dans l'application seulement. */}
            <NotificationBell direction="up" className={toolButton} />
            <SettingsButton iconOnly className={toolButton} testId="sidebar" />
            {/* « جولة في الصفحة » : rejoue la visite guidée de la page ouverte. */}
            <TourReplayButton className={`${toolButton} disabled:opacity-40`} />
            <button
              onClick={handleLogout}
              aria-label={t('logout')}
              title={t('logout')}
              className={`${toolButton} hover:!text-rose-600 hover:!bg-rose-50`}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header id="app-header" className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        {/* Même règle que la barre latérale : marque, pas lien. */}
        <div className="flex items-center gap-2 min-w-0">
          <img src="/brand/mark-color.svg" width="200" height="200" decoding="async" alt="Smarter Academy" className="h-8 w-8 flex-shrink-0" />
          <span className="font-mono-jetbrains text-[10px] text-blue-500 font-semibold tracking-wider uppercase whitespace-nowrap">{t('studentSpace')}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Sur mobile le profil n'a plus d'onglet en bas : c'est l'avatar
              (avec la classe) qui y mène, comme le bloc d'identité du bas de
              la barre latérale sur grand écran. */}
          <Link
            to="/espace/profil"
            aria-label={t('profile')}
            title={t('profile')}
            className="flex items-center gap-1.5 ps-1 pe-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-space font-bold text-[10px] flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              {initials}
            </span>
            {grade && (
              <span className="text-blue-700 font-space font-bold text-[11px]">{grade.name}</span>
            )}
          </Link>
          {/* Pas de roue « الإعدادات » ici : sur téléphone elle serrait la barre (la
              classe passait sur deux lignes). On y arrive par le profil (l'avatar). */}
          <NotificationBell
            align="end"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          />
          <TourReplayButton className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-40" />
          <button
            onClick={handleLogout}
            aria-label={t('logout')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav data-tour="workspace.nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-stretch" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {studentNavLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 font-inter text-[10px] font-semibold transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`
            }
          >
            <link.icon size={19} />
            {/* La barre mobile est étroite : un libellé court quand il existe. */}
            {t(link.shortLabelKey ?? link.labelKey)}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
