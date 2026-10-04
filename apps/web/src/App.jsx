import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomeRedirect from './components/auth/HomeRedirect';
import StudentLayout from './components/layout/StudentLayout';
import CourseLayout from './components/layout/CourseLayout';
import Home from './pages/Home';
const Methode = lazy(() => import('./pages/Methode'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
// ── Stripe : DÉMONTÉ du produit algérien (master spec §18) ─────────────
// Tarifs.jsx, Abonnement.jsx et AbonnementRetour.jsx restent PHYSIQUEMENT
// présents sur le disque : le produit algérien ne les sert pas, mais un
// paiement en ligne algérien autorisé pourrait un jour réutiliser cette
// mécanique. Ce qui compte est qu'aucune route ne les atteigne : sans
// import ni montage, elles ne sont ni navigables ni même incluses au lot.
// L'accès payant passe par /espace/activation.
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
import Login from './pages/Login';
import Register from './pages/Register';
const VerificationEmail = lazy(() => import('./pages/VerificationEmail'));
const AuthGoogle = lazy(() => import('./pages/AuthGoogle'));
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
const AdminProfile = lazy(() => import('./pages/admin/account/Account').then((m) => ({ default: m.AdminProfile })));
const AdminSecurity = lazy(() => import('./pages/admin/account/Account').then((m) => ({ default: m.AdminSecurity })));
const AdminActivationCodes = lazy(() => import('./pages/admin/activation/ActivationCodes'));
const AdminActivationBatches = lazy(() => import('./pages/admin/activation/ActivationBatches'));
const AdminActivationCodeDetail = lazy(() => import('./pages/admin/activation/ActivationCodeDetail'));
const AdminActivityLog = lazy(() => import('./pages/admin/system/ActivityLog'));
const AdminRegistryHealth = lazy(() => import('./pages/admin/system/RegistryHealth'));
const AdminContactMessages = lazy(() => import('./pages/admin/system/ContactMessages'));
// Les ENSEIGNANTS, leurs CLASSES et les OFFRES — le modèle commercial
// configuré depuis le panneau, sans déploiement ni paiement en ligne.
const AdminTeacherList = lazy(() => import('./pages/admin/teachers/TeacherList'));
const AdminTeacherDetail = lazy(() => import('./pages/admin/teachers/TeacherDetail'));
const AdminClassroomList = lazy(() => import('./pages/admin/classrooms/ClassroomList'));
const AdminClassroomDetail = lazy(() => import('./pages/admin/classrooms/ClassroomDetail'));
const AdminPlanList = lazy(() => import('./pages/admin/plans/PlanList'));
const AdminPlanEditor = lazy(() => import('./pages/admin/plans/PlanEditor'));
const AdminAccessLimits = lazy(() => import('./pages/admin/access/AccessLimits'));
const AdminSubscriptionRequests = lazy(() => import('./pages/admin/requests/SubscriptionRequests'));
const AdminSubscriptions = lazy(() => import('./pages/admin/subscriptions/Subscriptions').then((m) => ({ default: m.AdminSubscriptions })));
// L'ESPACE ENSEIGNANT (« فضاء الأستاذ ») : arabe, RTL, sa propre coquille.
const TeacherLayout = lazy(() => import('./components/layout/TeacherLayout'));
const TeacherHome = lazy(() => import('./pages/teacher/TeacherHome'));
const TeacherClassGroupList = lazy(() => import('./pages/teacher/ClassGroupList'));
const TeacherClassGroupCreate = lazy(() => import('./pages/teacher/ClassGroupCreate'));
const TeacherClassGroupDetail = lazy(() => import('./pages/teacher/ClassGroupDetail'));
const TeacherStudentProgress = lazy(() => import('./pages/teacher/StudentProgressPage'));
const TeacherStudentNotebook = lazy(() => import('./pages/teacher/StudentNotebookPage'));
const TeacherSubscription = lazy(() => import('./pages/teacher/SubscriptionPage'));
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile'));
const TeacherLessonMemo = lazy(() => import('./pages/teacher/LessonMemoPage'));
// L'élève et sa classe (« قسمي »), et le lien public d'une classe.
const Qism = lazy(() => import('./pages/student/Qism'));
const JoinClassLink = lazy(() => import('./pages/JoinClassLink'));
// Les pages de l'espace élève sont des lots À PART, comme l'admin et
// l'enseignant : un visiteur de « / » ne paie ni le cahier (KaTeX), ni la
// progression, ni l'explorateur. Les layouts (StudentLayout, MainLayout)
// posent leur propre <Suspense> autour de <Outlet/> : la barre latérale reste
// à l'écran pendant qu'une page arrive. Voir docs/architecture/BUNDLE_BOUNDARIES.md.
const StudentHome = lazy(() => import('./pages/student/StudentHome'));
const MesCours = lazy(() => import('./pages/student/MesCours'));
const Explorer = lazy(() => import('./pages/student/Explorer'));
const Progression = lazy(() => import('./pages/student/Progression'));
const Notebook = lazy(() => import('./pages/student/Notebook'));
const NotebookNotePage = lazy(() => import('./pages/student/Notebook').then((m) => ({ default: m.NotebookNotePage })));
const NotebookReviewPage = lazy(() => import('./pages/student/Notebook').then((m) => ({ default: m.NotebookReviewPage })));
const Profil = lazy(() => import('./pages/student/Profil'));
const ChooseGrade = lazy(() => import('./pages/student/ChooseGrade'));
// « عرّفنا بنفسك » : l'étape qui demande الاسم و اللقب à un compte qui n'en a
// pas encore (élève ET enseignant — pages/onboarding/CompleteName.jsx).
const CompleteName = lazy(() => import('./pages/onboarding/CompleteName'));
const Activation = lazy(() => import('./pages/student/Activation'));
const DiagnosticIntro = lazy(() => import('./pages/student/diagnostic/DiagnosticIntro'));
const DiagnosticRun = lazy(() => import('./pages/student/diagnostic/DiagnosticRun'));
const DiagnosticResult = lazy(() => import('./pages/student/diagnostic/DiagnosticResult'));
// Moteur d'exercices. Trois routes paramétrées, pas une par leçon : la
// pratique est indépendante de l'arbre des leçons, et `lessonCode` suffit
// puisque les codes de leçon sont globalement uniques.
const PracticeHub = lazy(() => import('./pages/student/practice/PracticeHub'));
const PracticeSession = lazy(() => import('./pages/student/practice/PracticeSession'));
const PracticeSummary = lazy(() => import('./pages/student/practice/PracticeSummary'));
// « التحدّي اليومي » : l'écran du jour, l'historique, la revue d'un jour.
const DailyChallengePage = lazy(() => import('./pages/student/challenge/DailyChallengePage'));
const ChallengeHistoryPage = lazy(() => import('./pages/student/challenge/ChallengeHistoryPage'));
const ChallengeReviewPage = lazy(() => import('./pages/student/challenge/ChallengeReviewPage'));
const TeacherChallengeDisplay = lazy(() => import('./pages/teacher/ChallengeDisplayPage'));
const AdminDailyChallenge = lazy(() => import('./pages/admin/dailyChallenge/DailyChallengeConfig'));
// Le مختبر الرياضيات (Math Lab) : les instruments LIBRES de l'élève, hors de
// toute leçon. Paresseux, comme la pratique — et la سبّورة charge son moteur
// (Excalidraw) paresseusement à son tour : aucune autre page ne le paie.
const MathLabHome = lazy(() => import('./pages/student/MathLab'));
const MathLabToolPage = lazy(() => import('./pages/student/MathLab').then((m) => ({ default: m.MathLabToolPage })));
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * La surface de QA est-elle montée ?
 *
 * Deux portes, et les deux sont des CONSTANTES à la construction : Vite
 * remplace `import.meta.env.*` par des littéraux avant que Rollup ne passe.
 */
const QA_FIXTURES_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_QA_FIXTURES === 'true';

/**
 * Le chargement de la surface de QA — PARESSEUX, et c'est ce qui la tient
 * hors du lot de production.
 *
 * Un `import` statique ne suffisait PAS : Rollup ne peut pas prouver qu'un
 * module importé pour ses exports n'a aucun effet de bord, et il le gardait
 * dans le lot d'entrée même quand la branche qui l'utilise était morte
 * (constaté : 'qa-rtl-fixture' se retrouvait dans index-*.js).
 *
 * Avec `lazy(() => import(...))` DERRIÈRE la condition littérale, la branche
 * entière — appel compris — disparaît à la construction, et avec elle le
 * point d'entrée du fragment. Le test d'isolement le vérifie sur le lot
 * réellement construit.
 */
const RtlLessonFixture = QA_FIXTURES_ENABLED
  ? lazy(() => import('./qa/rtlLessonFixture/FixtureRoutes.jsx'))
  : null;
import { AuthProvider } from './context/AuthContext';
import { WorkspaceLayoutProvider } from './context/WorkspaceLayoutContext';
import { NotebookProvider } from './features/practice/notebook/NotebookProvider';
import { MathLabOverlayProvider } from './features/mathlab/overlay/MathLabOverlayProvider';
import { ContentAvailabilityProvider } from './context/ContentAvailabilityContext';
import { StudyContextProvider } from './context/StudyContextContext';
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
// Les leçons FRANÇAISES héritées ont été supprimées du dépôt (2026-09-25) :
// seules les leçons 4AM écrites sous lessons/moyen/4am/ existent, et elles
// sont toutes montées ici.
// Les neuf leçons de l'unité 1 du manuel (phase 8), dans l'ordre du manuel.
// Chaque fabrique est importée ET appelée ici : c'est ce que scripts/check-routes.mjs relit.
const UnitPage = lazy(() => import('./pages/UnitPage'));
import qasimAdadTabiiRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/routes';
import qawasimAdadTabiiRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qawasim-adad-tabii/routes';
import khawassQawasimRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/khawass-qawasim/routes';
import qasimMushtarakAkbarRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-mushtarak-akbar/routes';
import tayinPgcdRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/tayin-pgcd/routes';
import bahthPgcdRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/bahth-pgcd/routes';
import awwaliyanFimaBaynahumaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/awwaliyan-fima-baynahuma/routes';
import ikhtizalKasrRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/ikhtizal-kasr/routes';
import wadiyaIdmajiyaAadadRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/routes';
// Unité 2 « الحساب على الجذور » (2026-09-30).
import jidhrTarbiiRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/jidhr-tarbii/routes';
import natiqaGhayrNatiqaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/natiqa-ghayr-natiqa/routes';
import muadalatXMurabbaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/muadalat-x-murabba/routes';
import amaliyatJudhurRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/amaliyat-judhur/routes';
import tawzifKhawassJudhurRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/tawzif-khawass-judhur/routes';
import wadiyaIdmajiyaJudhurRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-judhur/wadiya-idmajiya-judhur/routes';
import nashrTabsitRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/nashr-tabsit/routes';
import mutatabiqatShahiraRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/mutatabiqat-shahira/routes';
import tahlilIbaraRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/tahlil-ibara/routes';
import wadiyaIdmajiyaHarfiRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/hisab-harfi/wadiya-idmajiya-harfi/routes';
import muadalaUlaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/muadala-ula/routes';
import jidaaMaadumRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/jidaa-maadum/routes';
import mutarajihaUlaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/mutarajiha-ula/routes';
import tarridMushkilaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/tarrid-mushkila/routes';
import wadiyaIdmajiyaMuadalatRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/muadalat-mutarajihat/wadiya-idmajiya-muadalat/routes';
import mafhumJumlaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/jumal-muadalatayn/mafhum-jumla/routes';
import hallJabriRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/jumal-muadalatayn/hall-jabri/routes';
import mushkilatJumlaRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/jumal-muadalatayn/mushkilat-jumla/routes';
import wadiyaIdmajiyaJumalRoutes from './lessons/moyen/4am/ansab_al_aadad_wal_hisab/jumal-muadalatayn/wadiya-idmajiya-jumal/routes';
// Unité 6 « الدالة الخطية والتناسبية » — ميدان d'affichage « ميدان التناسبية والدوال » (2026-10-02).
import tanasubMuamilRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/tanasub-muamil/routes';
import dalaKhattiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/dala-khattiya/routes';
import tamthilBayaniKhattiRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/tamthil-bayani-khatti/routes';
import tatbiqatTanasubRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/tatbiqat-tanasub/routes';
import tarridKhattiRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/tarrid-khatti/routes';
import wadiyaIdmajiyaKhattiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/tanasubiya-dala-khattiya/wadiya-idmajiya-khattiya/routes';
// Unité 7 « الدالة التآلفية » — même ميدان d'affichage (2026-10-02).
import mafhumTaalufiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/mafhum-taalufiya/routes';
import tamthilBayaniTaalufiRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/tamthil-bayani-taalufi/routes';
import tanasubTaghayyuratRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/tanasub-taghayyurat/routes';
import tafsirBayaniJumlaRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/tafsir-bayani-jumla/routes';
import tarridTaalufiRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/tarrid-taalufi/routes';
import wadiyaIdmajiyaTaalufiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/dala-taalufiya/wadiya-idmajiya-taalufiya/routes';
// Unité 8 « الإحصاء » — même ميدان d'affichage (2026-10-02).
import takrarMujammaRoutes from './lessons/moyen/4am/tanasubiya_duwal/ihsa/takrar-mujamma/routes';
import madaWasitMutawassitRoutes from './lessons/moyen/4am/tanasubiya_duwal/ihsa/mada-wasit-mutawassit/routes';
import majdulatIhsaiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/ihsa/majdulat-ihsaiya/routes';
import qiraatWadiyatIhsaiyaRoutes from './lessons/moyen/4am/tanasubiya_duwal/ihsa/qiraat-wadiyat-ihsaiya/routes';
import wadiyaIdmajiyaIhsaRoutes from './lessons/moyen/4am/tanasubiya_duwal/ihsa/wadiya-idmajiya-ihsa/routes';
// Unité 9 « خاصية طالس » (2026-10-02), ميدان الهندسة du programme.
import talisHisabAtwalRoutes from './lessons/moyen/4am/handasa/khassiyat-talis/talis-hisab-atwal/routes';
import aksiyaTalisRoutes from './lessons/moyen/4am/handasa/khassiyat-talis/aksiya-talis/routes';
import inshaatTalisRoutes from './lessons/moyen/4am/handasa/khassiyat-talis/inshaat-talis/routes';
import wadiyaIdmajiyaTalisRoutes from './lessons/moyen/4am/handasa/khassiyat-talis/wadiya-idmajiya-talis/routes';
import nisabMuthallathiyaRoutes from './lessons/moyen/4am/handasa/hisab-muthallathat/nisab-muthallathiya/routes';
import hasibaMuthallathiyaRoutes from './lessons/moyen/4am/handasa/hisab-muthallathat/hasiba-muthallathiya/routes';
import alaqatMuthallathiyaRoutes from './lessons/moyen/4am/handasa/hisab-muthallathat/alaqat-muthallathiya/routes';
import tarridMuthallathiyaRoutes from './lessons/moyen/4am/handasa/hisab-muthallathat/tarrid-muthallathiya/routes';
import wadiyaIdmajiyaMuthallathatRoutes from './lessons/moyen/4am/handasa/hisab-muthallathat/wadiya-idmajiya-muthallathat/routes';
import insihabShuaaRoutes from './lessons/moyen/4am/handasa/ashia-insihab/insihab-shuaa/routes';
import shuaaynMutasawiyaynRoutes from './lessons/moyen/4am/handasa/ashia-insihab/shuaayn-mutasawiyayn/routes';
import majmuShuaaynRoutes from './lessons/moyen/4am/handasa/ashia-insihab/majmu-shuaayn/routes';
import barahinAshiaRoutes from './lessons/moyen/4am/handasa/ashia-insihab/barahin-ashia/routes';
import wadiyaIdmajiyaAshiaRoutes from './lessons/moyen/4am/handasa/ashia-insihab/wadiya-idmajiya-ashia/routes';
import murakkibataShuaaRoutes from './lessons/moyen/4am/handasa/ashia-maalam/murakkibata-shuaa/routes';
import hisabMurakkibatayRoutes from './lessons/moyen/4am/handasa/ashia-maalam/hisab-murakkibatay/routes';
import muntasafMasafaRoutes from './lessons/moyen/4am/handasa/ashia-maalam/muntasaf-masafa/routes';
import ithbatKhawasMaalamRoutes from './lessons/moyen/4am/handasa/ashia-maalam/ithbat-khawas-maalam/routes';
import wadiyaIdmajiyaMaalamRoutes from './lessons/moyen/4am/handasa/ashia-maalam/wadiya-idmajiya-maalam/routes';

export default function App() {
  return (
    <AuthProvider>
      <LessonProgressSync />
      <ContentAvailabilityProvider>
      <StudyContextProvider>
      <WorkspaceLayoutProvider>
      {/* LE cahier de l'élève : une seule fenêtre pour toute l'application,
          au-dessus du routeur pour survivre au changement de module. Les
          pages de leçon lui publient leur position (LessonNotebookAnchor). */}
      <NotebookProvider>
      {/* LE مختبر posé SUR la leçon : un seul calque pour toute
          l'application, au-dessus du routeur lui aussi — ouvrir un
          instrument ne doit jamais démonter la leçon, sinon l'élève perd sa
          place (features/mathlab/overlay/). */}
      <MathLabOverlayProvider>
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

              {/* Les codes d'activation remplacent les abonnements Stripe :
                  c'est par eux que l'accès payant est accordé (master spec
                  §17). Les écrans Subscriptions.jsx/Payments restent sur le
                  disque, démontés. */}
              <Route path="codes-activation" element={<AdminActivationCodes />} />
              <Route path="codes-activation/lots" element={<AdminActivationBatches />} />
              <Route path="codes-activation/:id" element={<AdminActivationCodeDetail />} />

              {/* Les enseignants, leurs classes, les offres et les demandes :
                  la surface de contrôle du modèle commercial — activation
                  MANUELLE, jamais un paiement en ligne. */}
              <Route path="enseignants" element={<AdminTeacherList />} />
              <Route path="enseignants/:id" element={<AdminTeacherDetail />} />
              <Route path="classes" element={<AdminClassroomList />} />
              <Route path="classes/:id" element={<AdminClassroomDetail />} />
              <Route path="offres" element={<AdminPlanList />} />
              <Route path="offres/demandes" element={<AdminSubscriptionRequests />} />
              <Route path="offres/abonnements" element={<AdminSubscriptions />} />
              <Route path="offres/acces" element={<AdminAccessLimits />} />
              <Route path="offres/defi-quotidien" element={<AdminDailyChallenge />} />
              <Route path="offres/:id" element={<AdminPlanEditor />} />

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
          <Route path="/espace" element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="bienvenue/nom" element={<CompleteName />} />
            <Route path="bienvenue" element={<ChooseGrade />} />
            <Route path="diagnostic" element={<DiagnosticIntro />} />
            <Route path="diagnostic/run" element={<DiagnosticRun />} />
            <Route path="diagnostic/resultat" element={<DiagnosticResult />} />
            <Route element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="cours" element={<MesCours />} />
              <Route path="explorer" element={<Explorer />} />
              <Route path="progression" element={<Progression />} />
              {/* « Mon cahier » : l'espace de TOUTES les notes de l'élève —
                  retrouver, ranger, imprimer, réviser. La progression, elle,
                  ne parle plus que de progression. */}
              <Route path="cahier" element={<Notebook />} />
              <Route path="cahier/revision" element={<NotebookReviewPage />} />
              <Route path="cahier/:noteId" element={<NotebookNotePage />} />
              <Route path="profil" element={<Profil />} />
              {/* La saisie d'un code d'activation — le seul geste par lequel
                  un élève ouvre ses propres droits (master spec §17). */}
              <Route path="activation" element={<Activation />} />
              {/* La pratique vit DANS l'espace élève, avec la même barre
                  latérale que les leçons : les routes de leçon passent par
                  CourseLayout, qui rend StudentLayout dès qu'on est connecté.
                  La pratique exige un compte, donc elle s'y branche
                  directement. */}
              <Route path="pratique/:lessonCode" element={<PracticeHub />} />
              <Route path="pratique/:lessonCode/session/:sessionId" element={<PracticeSession />} />
              <Route path="pratique/:lessonCode/bilan/:sessionId" element={<PracticeSummary />} />
              {/* « التحدّي اليومي » : le serveur tient la tentative ; ces
                  routes ne font que l'afficher (DAILY_CHALLENGE.md). */}
              <Route path="defi" element={<DailyChallengePage />} />
              <Route path="defi/historique" element={<ChallengeHistoryPage />} />
              <Route path="defi/:attemptId" element={<ChallengeReviewPage />} />
              {/* Le مختبر الرياضيات : l'accueil, puis un instrument par
                  segment d'URL (résolu dans le registre, features/mathlab),
                  avec ou sans document enregistré. Un instrument de plus
                  n'ajoute pas de route ici. */}
              <Route path="atelier" element={<MathLabHome />} />
              <Route path="atelier/:toolSlug" element={<MathLabToolPage />} />
              <Route path="atelier/:toolSlug/:documentId" element={<MathLabToolPage />} />
              {/* « قسمي » : la classe de l'enseignant que l'élève a rejointe, ou
                  peut rejoindre par code / lien de classe. Un contexte, pas un
                  contenu : le serveur reste l'autorité sur ce qui est visible. */}
              <Route path="qism" element={<Qism />} />
            </Route>
          </Route>

          {/* L'ESPACE ENSEIGNANT. Rôle vérifié ici par ProtectedRoute ; la vraie
              porte reste le serveur : chaque /api/v1/teacher/* est derrière
              can:teacher (TeacherAuthorizationTest), et la propriété d'une
              classe derrière ClassroomPolicy. */}
          <Route path="/enseignant" element={<ProtectedRoute allowedRoles={['teacher']} />}>
            {/* Le mode d'AFFICHAGE du défi : plein écran, hors de la coquille
                enseignant — c'est ce que la classe voit au tableau. */}
            <Route path="classes/:id/defi/affichage" element={<TeacherChallengeDisplay />} />
            <Route path="bienvenue" element={<CompleteName />} />
            <Route element={<TeacherLayout />}>
              <Route index element={<TeacherHome />} />
              <Route path="classes" element={<TeacherClassGroupList />} />
              <Route path="classes/nouveau" element={<TeacherClassGroupCreate />} />
              <Route path="classes/:id" element={<TeacherClassGroupDetail />} />
              <Route path="classes/:id/eleves/:studentId" element={<TeacherStudentProgress />} />
              {/* Le cahier d'un élève, en LECTURE SEULE. La vraie porte est
                  le serveur : ClassroomPolicy + appartenance au قسم
                  (TeacherClassroomNotebookTest). */}
              <Route path="classes/:id/eleves/:studentId/cahier" element={<TeacherStudentNotebook />} />
              <Route path="offre" element={<TeacherSubscription />} />
              <Route path="profil" element={<TeacherProfile />} />
              {/* L'ENSEIGNANT APPREND COMME UN ÉLÈVE — mêmes pages, même
                  moteur, dans SON espace : le catalogue (Explorer), le
                  مختبر et son cahier (à lui : le serveur ne sert que les
                  notes et documents du compte). Les leçons elles-mêmes
                  restent sur /courses/… et CourseLayout rend TeacherLayout
                  pour lui ; ce qui change n'est pas la page mais le LECTEUR
                  (features/learning/learningViewer) : tous les modules
                  ouverts, aucune progression écrite. */}
              <Route path="cours" element={<Explorer />} />
              {/* « مذكرة الدرس » : le guide d'orchestration d'une séance,
                  construit depuis la leçon (features/teacher/lessonMemo).
                  Enseignant seulement — la porte est ce ProtectedRoute ;
                  les notes « كرّاسي » qu'elle affiche sont servies par le
                  serveur au seul propriétaire. */}
              <Route path="cours/:lessonId/memoire" element={<TeacherLessonMemo />} />
              <Route path="atelier" element={<MathLabHome />} />
              <Route path="atelier/:toolSlug" element={<MathLabToolPage />} />
              <Route path="atelier/:toolSlug/:documentId" element={<MathLabToolPage />} />
              <Route path="cahier" element={<Notebook />} />
              <Route path="cahier/revision" element={<NotebookReviewPage />} />
              <Route path="cahier/:noteId" element={<NotebookNotePage />} />
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

            {/* Le LIEN DE CLASSE (رابط الانضمام), ouvert depuis WhatsApp, souvent
                sans compte. Publique ; l'adhésion reste une requête de l'élève
                authentifié, après son consentement. L'ancienne adresse des
                invitations par courriel (/rejoindre/:token) aboutit à la même
                page, qui la dit invalide — aucun chemin mort. */}
            <Route path="/rejoindre/classe/:token" element={<JoinClassLink />} />
            <Route path="/rejoindre/:token" element={<JoinClassLink />} />

            {/* ── Les pages légales ───────────────────────────────────
                Publiques et accessibles SANS compte : on doit pouvoir lire
                ce que l'on accepte avant de l'accepter. Elles sont liées
                depuis le pied de page et depuis la case de consentement. */}
            <Route path="/confidentialite"  element={<Confidentialite />} />
            <Route path="/cgu"              element={<CGU />} />

            <Route path="*" element={<HomeRedirect />} />
          </Route>

          <Route element={<CourseLayout />}>
            {/* Un élève connecté n'atterrit pas sur la page de vente : il
                est renvoyé vers /espace (voir HomeRedirect). */}
            <Route path="/"         element={<HomeRedirect />} />
            <Route path="/courses"  element={<Courses />} />
            {/* La page d'une UNITÉ du manuel (الوحدة) : le niveau entre le ميدان et le درس (phase 8). */}
            <Route path="/courses/:levelId/:gradeId/:chapterId/units/:unitId" element={<UnitPage />} />

            {/* Les leçons 4AM montées — les seules du dépôt depuis le
                2026-09-25. check-routes.mjs vérifie que chacune est branchée,
                check-dormant-isolation.mjs qu'aucun dossier français ne
                revient. */}
            {qasimAdadTabiiRoutes()}
            {qawasimAdadTabiiRoutes()}
            {khawassQawasimRoutes()}
            {qasimMushtarakAkbarRoutes()}
            {tayinPgcdRoutes()}
            {bahthPgcdRoutes()}
            {awwaliyanFimaBaynahumaRoutes()}
            {ikhtizalKasrRoutes()}
            {wadiyaIdmajiyaAadadRoutes()}
            {jidhrTarbiiRoutes()}
            {natiqaGhayrNatiqaRoutes()}
            {muadalatXMurabbaRoutes()}
            {amaliyatJudhurRoutes()}
            {tawzifKhawassJudhurRoutes()}
            {wadiyaIdmajiyaJudhurRoutes()}
            {nashrTabsitRoutes()}
            {mutatabiqatShahiraRoutes()}
            {tahlilIbaraRoutes()}
            {wadiyaIdmajiyaHarfiRoutes()}
            {muadalaUlaRoutes()}
            {jidaaMaadumRoutes()}
            {mutarajihaUlaRoutes()}
            {tarridMushkilaRoutes()}
            {wadiyaIdmajiyaMuadalatRoutes()}
            {mafhumJumlaRoutes()}
            {hallJabriRoutes()}
            {mushkilatJumlaRoutes()}
            {wadiyaIdmajiyaJumalRoutes()}
            {tanasubMuamilRoutes()}
            {dalaKhattiyaRoutes()}
            {tamthilBayaniKhattiRoutes()}
            {tatbiqatTanasubRoutes()}
            {tarridKhattiRoutes()}
            {wadiyaIdmajiyaKhattiyaRoutes()}
            {mafhumTaalufiyaRoutes()}
            {tamthilBayaniTaalufiRoutes()}
            {tanasubTaghayyuratRoutes()}
            {tafsirBayaniJumlaRoutes()}
            {tarridTaalufiRoutes()}
            {wadiyaIdmajiyaTaalufiyaRoutes()}
            {takrarMujammaRoutes()}
            {madaWasitMutawassitRoutes()}
            {majdulatIhsaiyaRoutes()}
            {qiraatWadiyatIhsaiyaRoutes()}
            {wadiyaIdmajiyaIhsaRoutes()}
            {talisHisabAtwalRoutes()}
            {aksiyaTalisRoutes()}
            {inshaatTalisRoutes()}
            {wadiyaIdmajiyaTalisRoutes()}
            {nisabMuthallathiyaRoutes()}
            {hasibaMuthallathiyaRoutes()}
            {alaqatMuthallathiyaRoutes()}
            {tarridMuthallathiyaRoutes()}
            {wadiyaIdmajiyaMuthallathatRoutes()}
            {insihabShuaaRoutes()}
            {shuaaynMutasawiyaynRoutes()}
            {majmuShuaaynRoutes()}
            {barahinAshiaRoutes()}
            {wadiyaIdmajiyaAshiaRoutes()}
            {murakkibataShuaaRoutes()}
            {hisabMurakkibatayRoutes()}
            {muntasafMasafaRoutes()}
            {ithbatKhawasMaalamRoutes()}
            {wadiyaIdmajiyaMaalamRoutes()}

            {/* ── SURFACE DE QA — jamais en production ────────────────
                Le moteur de leçon n'a jamais été rendu sous RTL, faute de
                leçon montée (rapport de reprise §17/§18). Cette surface
                monte les VRAIS composants du moteur avec du texte arabe,
                pour qu'on puisse le regarder.

                La condition est littérale et statiquement analysable : dans
                un lot de production ordinaire, `import.meta.env.DEV` vaut
                false et `VITE_QA_FIXTURES` n'est pas 'true', donc Rollup
                élimine la branche ET le module qu'elle appelle. Le test
                d'isolement le vérifie sur le lot réellement construit.

                Hors de src/lessons/ : le glob de registry.js,
                check-routes, validate-lessons et check-dormant-isolation
                n'y voient rien, et elle n'est dans aucun catalogue. */}
            {QA_FIXTURES_ENABLED && (
              <Route path="/__qa/rtl-lesson/*" element={<RtlLessonFixture />} />
            )}
          </Route>
        </Routes>
        </Suspense>
      </Router>
      </MathLabOverlayProvider>
      </NotebookProvider>
      </WorkspaceLayoutProvider>
      </StudyContextProvider>
      </ContentAvailabilityProvider>
    </AuthProvider>
  );
}
