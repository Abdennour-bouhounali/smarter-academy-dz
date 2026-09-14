import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomeRedirect from './components/auth/HomeRedirect';
import StudentLayout from './components/layout/StudentLayout';
import CourseLayout from './components/layout/CourseLayout';
import Home from './pages/Home';
const Methode = lazy(() => import('./pages/Methode'));
const About = lazy(() => import('./pages/About'));
import Courses from './pages/Courses';
import Tarifs from './pages/Tarifs';
const AbonnementRetour = lazy(() => import('./pages/AbonnementRetour'));
const Abonnement = lazy(() => import('./pages/Abonnement'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
import Login from './pages/Login';
import Register from './pages/Register';
const VerificationEmail = lazy(() => import('./pages/VerificationEmail'));
const AuthGoogle = lazy(() => import('./pages/AuthGoogle'));
const MentionsLegales = lazy(() => import('./pages/legal/MentionsLegales'));
const Confidentialite = lazy(() => import('./pages/legal/Confidentialite'));
const CGU = lazy(() => import('./pages/legal/CGU'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLessons = lazy(() => import('./pages/admin/content/Lessons'));
const AdminLessonDetail = lazy(() => import('./pages/admin/content/LessonDetail'));
const AdminModules = lazy(() => import('./pages/admin/content/Modules'));
const AdminExercises = lazy(() => import('./pages/admin/content/Exercises'));
const AdminReportList = lazy(() => import('./pages/admin/reports/ReportList'));
const AdminReportDetail = lazy(() => import('./pages/admin/reports/ReportDetail'));
const AdminStudentList = lazy(() => import('./pages/admin/students/StudentList'));
const AdminStudentDetail = lazy(() => import('./pages/admin/students/StudentDetail'));
const PlatformAnalytics = lazy(() => import('./pages/admin/analytics/Platform').then((m) => ({ default: m.PlatformAnalytics })));
const LearningAnalytics = lazy(() => import('./pages/admin/analytics/Platform').then((m) => ({ default: m.LearningAnalytics })));
const ContentAnalytics = lazy(() => import('./pages/admin/analytics/ContentAnalytics').then((m) => ({ default: m.ContentAnalytics })));
const LearningPointAnalytics = lazy(() => import('./pages/admin/analytics/ContentAnalytics').then((m) => ({ default: m.LearningPointAnalytics })));
const AdminSubscriptions = lazy(() => import('./pages/admin/subscriptions/Subscriptions').then((m) => ({ default: m.AdminSubscriptions })));
const AdminPayments = lazy(() => import('./pages/admin/subscriptions/Subscriptions').then((m) => ({ default: m.AdminPayments })));
const AdminProfile = lazy(() => import('./pages/admin/account/Account').then((m) => ({ default: m.AdminProfile })));
const AdminSecurity = lazy(() => import('./pages/admin/account/Account').then((m) => ({ default: m.AdminSecurity })));
const AdminActivityLog = lazy(() => import('./pages/admin/system/ActivityLog'));
const AdminRegistryHealth = lazy(() => import('./pages/admin/system/RegistryHealth'));
const AdminContactMessages = lazy(() => import('./pages/admin/system/ContactMessages'));
import StudentHome from './pages/student/StudentHome';
import MesCours from './pages/student/MesCours';
import Explorer from './pages/student/Explorer';
import Progression from './pages/student/Progression';
import Profil from './pages/student/Profil';
import ChooseGrade from './pages/student/ChooseGrade';
const DiagnosticIntro = lazy(() => import('./pages/student/diagnostic/DiagnosticIntro'));
const DiagnosticRun = lazy(() => import('./pages/student/diagnostic/DiagnosticRun'));
const DiagnosticResult = lazy(() => import('./pages/student/diagnostic/DiagnosticResult'));
// Moteur d'exercices. Trois routes paramétrées, pas une par leçon : la
// pratique est indépendante de l'arbre des leçons, et `lessonCode` suffit
// puisque les codes de leçon sont globalement uniques.
const PracticeHub = lazy(() => import('./pages/student/practice/PracticeHub'));
const PracticeSession = lazy(() => import('./pages/student/practice/PracticeSession'));
const PracticeSummary = lazy(() => import('./pages/student/practice/PracticeSummary'));
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceLayoutProvider } from './context/WorkspaceLayoutContext';
import { ContentAvailabilityProvider } from './context/ContentAvailabilityContext';
import { useLessonProgressSync } from './hooks/useLessonProgressSync';

// ---- PREMIÈRE SPÉCIALITÉ ----

// Hydrates local lesson progress from the server on login and flushes the
// offline queue — must live inside AuthProvider, hence this null component.
function LessonProgressSync() {
  useLessonProgressSync();
  return null;
}

// Lesson routes: registered per lesson via a routes.jsx in the lesson's own
// directory (lazy-loaded), imported here and spread into <Routes> — see
// docs/architecture/LESSON_CONTRACT.md. An unmatched /courses/... URL falls
// through to the catch-all below.
//
// None are currently imported: every inherited French grade is dormant for
// Algeria (see the CourseLayout <Route> block below and activeGrades.js).

export default function App() {
  return (
    <AuthProvider>
      <LessonProgressSync />
      <ContentAvailabilityProvider>
      <WorkspaceLayoutProvider>
      <Router>
        {/* Frontière d'attente UNIQUE pour les routes découpées (admin,
            moteur d'exercices, pages légales, diagnostic). Elle est posée
            AUTOUR du routeur : la coquille (barre de navigation, pied de
            page) est rendue par les layouts à l'intérieur de chaque route,
            et un repli neutre évite un écran blanc pendant le téléchargement
            du lot de la page. Les leçons gardent en plus le <Suspense> que
            leur routes.jsx pose déjà autour de leur propre contenu. */}
        <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
        <Routes>
          {/* Le panneau d'administration. `allowedRoles` est explicite ici :
              c'était le défaut de ProtectedRoute, mais l'écrire rend la porte
              lisible sur place. La vraie protection reste serveur — chaque
              /api/v1/admin/* est derrière can:admin (voir AdminAuthorizationTest). */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="analytics/plateforme" element={<PlatformAnalytics />} />
              <Route path="analytics/apprentissage" element={<LearningAnalytics />} />
              <Route path="analytics/contenu" element={<ContentAnalytics />} />
              <Route path="analytics/points" element={<LearningPointAnalytics />} />

              <Route path="contenu/lecons" element={<AdminLessons />} />
              <Route path="contenu/lecons/:code" element={<AdminLessonDetail />} />
              <Route path="contenu/modules" element={<AdminModules />} />
              <Route path="contenu/exercices" element={<AdminExercises />} />

              <Route path="signalements" element={<AdminReportList />} />
              <Route path="signalements/:id" element={<AdminReportDetail />} />

              <Route path="eleves" element={<AdminStudentList />} />
              <Route path="eleves/:id" element={<AdminStudentDetail />} />

              <Route path="abonnements" element={<AdminSubscriptions />} />
              <Route path="abonnements/paiements" element={<AdminPayments />} />

              <Route path="compte" element={<AdminProfile />} />
              <Route path="compte/securite" element={<AdminSecurity />} />

              <Route path="systeme/journal" element={<AdminActivityLog />} />
              <Route path="systeme/coherence" element={<AdminRegistryHealth />} />
              <Route path="systeme/messages" element={<AdminContactMessages />} />
            </Route>
          </Route>

          {/* La gestion de l'abonnement (phase 7). AUTHENTIFIÉE : elle parle
              d'argent et d'un compte précis, contrairement à /tarifs et à la
              page de retour. Hors de /espace parce que le serveur y renvoie
              l'élève depuis le portail du fournisseur, et qu'une URL de retour
              se doit d'être courte et stable. */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/abonnement" element={<Abonnement />} />
            </Route>
          </Route>

          <Route path="/espace" element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="bienvenue" element={<ChooseGrade />} />
            <Route path="diagnostic" element={<DiagnosticIntro />} />
            <Route path="diagnostic/run" element={<DiagnosticRun />} />
            <Route path="diagnostic/resultat" element={<DiagnosticResult />} />
            <Route element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="cours" element={<MesCours />} />
              <Route path="explorer" element={<Explorer />} />
              <Route path="progression" element={<Progression />} />
              <Route path="profil" element={<Profil />} />
              {/* La pratique vit DANS l'espace élève, avec la même barre
                  latérale que les leçons : les routes de leçon passent par
                  CourseLayout, qui rend StudentLayout dès qu'on est connecté.
                  La pratique exige un compte, donc elle s'y branche
                  directement. */}
              <Route path="pratique/:lessonCode" element={<PracticeHub />} />
              <Route path="pratique/:lessonCode/session/:sessionId" element={<PracticeSession />} />
              <Route path="pratique/:lessonCode/bilan/:sessionId" element={<PracticeSummary />} />
            </Route>
          </Route>

          <Route element={<MainLayout />}>
            {/* Connexion et inscription SOUS la coquille visiteur : ce sont
                des pages publiques, et arriver sur « Se connecter » sans
                barre de navigation laissait le visiteur sans retour vers le
                site — le seul chemin était le bouton « retour » du
                navigateur. Elles se redirigent d'elles-mêmes une fois la
                session ouverte, donc aucun risque de les montrer ici. */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/methode"  element={<Methode />} />
            <Route path="/about"    element={<About />} />
            <Route path="/tarifs"   element={<Tarifs />} />
            {/* Le retour depuis la page de paiement. Publique : l'élève
                revient d'un domaine tiers, et une redirection vers la
                connexion lui ferait perdre le fil. La page n'accorde rien —
                elle interroge le serveur et affiche sa réponse. */}
            <Route path="/abonnement/retour" element={<AbonnementRetour />} />
            <Route path="/faq"      element={<FAQ />} />

            {/* L'écran d'attente entre l'inscription et l'espace élève.
                Publique : l'élève y arrive aussi en revenant du lien reçu
                par courriel, éventuellement dans un autre navigateur, donc
                sans session. Elle ne garde aucune porte — c'est le serveur
                qui ferme l'espace tant que l'adresse n'est pas prouvée. */}
            <Route path="/verification-email" element={<VerificationEmail />} />

            {/* Le retour de Google. Publique par nature : personne n'est
                encore authentifié quand la connexion commence. */}
            <Route path="/auth/google" element={<AuthGoogle />} />

            {/* ── Les pages légales ───────────────────────────────────
                Publiques et accessibles SANS compte : on doit pouvoir lire
                ce que l'on accepte avant de l'accepter. Elles sont liées
                depuis le pied de page et depuis la case de consentement. */}
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite"  element={<Confidentialite />} />
            <Route path="/cgu"              element={<CGU />} />

            <Route path="*" element={<HomeRedirect />} />
          </Route>

          <Route element={<CourseLayout />}>
            {/* Un élève connecté n'atterrit pas sur la page de vente : il
                est renvoyé vers /espace (voir HomeRedirect). */}
            <Route path="/"         element={<HomeRedirect />} />
            <Route path="/courses"  element={<Courses />} />

            {/* No lesson routes are mounted: every inherited French grade
                is dormant (packages/core/curriculum/activeGrades.js —
                ACTIVE_GRADE_IDS is empty pending the Algerian curriculum,
                see docs/ALGERIA_MIGRATION_AUDIT.md §15 and roadmap Phase 7).
                Lesson folders/routes.jsx stay on disk unimported; add a
                grade's imports back here once it is added to
                ACTIVE_GRADE_IDS. */}
          </Route>
        </Routes>
        </Suspense>
      </Router>
      </WorkspaceLayoutProvider>
      </ContentAvailabilityProvider>
    </AuthProvider>
  );
}
