<?php

use App\Http\Controllers\AccessController;
use App\Http\Controllers\ActivationCodeController;
use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\AdminActivationCodeController;
use App\Http\Controllers\Admin\AdminActivityLogController;
use App\Http\Controllers\Admin\AdminClassroomController;
use App\Http\Controllers\Admin\AdminContentController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEntitlementController;
use App\Http\Controllers\Admin\AdminHealthController;
use App\Http\Controllers\Admin\AdminManualSubscriptionController;
use App\Http\Controllers\Admin\AdminMasteryReplayController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminProviderEventController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminTeacherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingCheckoutController;
use App\Http\Controllers\BillingSubscriptionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContentAvailabilityController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\DiagnosticController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\InvitationPreviewController;
use App\Http\Controllers\LearningEvidenceController;
use App\Http\Controllers\LearningPointExplanationController;
use App\Http\Controllers\LearningProfileController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\LessonFinalTestAttemptController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\MathLabDocumentController;
use App\Http\Controllers\MathLabFileController;
use App\Http\Controllers\MeSubscriptionController;
use App\Http\Controllers\PracticeAnswerController;
use App\Http\Controllers\PracticeNotebookController;
use App\Http\Controllers\PracticeSessionController;
use App\Http\Controllers\ProviderWebhookController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\StudentClassroomController;
use App\Http\Controllers\StudentReportController;
use App\Http\Controllers\Teacher\TeacherClassroomController;
use App\Http\Controllers\Teacher\TeacherClassroomInsightController;
use App\Http\Controllers\Teacher\TeacherClassroomInterventionController;
use App\Http\Controllers\Teacher\TeacherClassroomInvitationController;
use App\Http\Controllers\Teacher\TeacherClassroomLearningPointController;
use App\Http\Controllers\Teacher\TeacherClassroomLessonController;
use App\Http\Controllers\Teacher\TeacherClassroomNotebookController;
use App\Http\Controllers\Teacher\TeacherClassroomProgressController;
use App\Http\Controllers\Teacher\TeacherClassroomStudentController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/contact', [ContactController::class, 'store']);

    // ── Webhooks de fournisseur de paiement ─────────────────────────────
    // La SEULE route publique en écriture, et la seule authentifiée
    // autrement que par un jeton : un fournisseur de paiement n'a ni
    // session, ni compte, ni jeton CSRF. Sa signature est son identité.
    //
    // Les intergiciels de session sont retirés EXPLICITEMENT : `statefulApi()`
    // (bootstrap/app.php) les applique à tout /api, et une livraison serait
    // sinon rejetée avant d'atteindre la vérification de signature.
    //
    // La limite de débit protège la table d'évènements d'un flot de corps
    // non signés — qui ne laissent aucune trace, mais coûtent un calcul de
    // signature chacun.
    Route::post('/webhooks/{provider}', [ProviderWebhookController::class, 'handle'])
        ->withoutMiddleware([
            AuthenticateSession::class,
            EncryptCookies::class,
            StartSession::class,
            ValidateCsrfToken::class,
        ])
        ->middleware('throttle:120,1')
        ->where('provider', '[a-z_]+');

    // Les versions des documents légaux. Publiques : la page d'inscription
    // les affiche avant toute authentification. Lecture seule — le serveur
    // fait autorité sur les versions, le client ne fait que les montrer.
    Route::get('/legal/versions', [LegalController::class, 'versions']);

    // Ce qu'un lien d'invitation révèle AVANT tout compte (nom de la classe,
    // enseignant) : publique, limitée en débit, sans aucun secret en retour.
    Route::get('/invitations/{token}', [InvitationPreviewController::class, 'show'])
        ->middleware('throttle:30,1')
        ->where('token', '[A-Za-z0-9]{1,64}');

    Route::middleware('throttle:6,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // ── Vérification d'adresse ───────────────────────────────────────────
    // PAS de jeton ici, volontairement : on clique ce lien depuis sa boîte
    // mail, souvent dans un autre navigateur que celui de l'inscription.
    // Ce qui protège la route n'est donc pas une session mais la SIGNATURE
    // de l'URL (`signed`), qui prouve que le lien vient de nous et n'a pas
    // été modifié — l'identifiant compris. Elle expire (voir
    // EmailVerificationLink). La limite de débit couvre le tâtonnement.
    Route::get('/auth/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:12,1'])
        ->whereNumber('id')
        ->name('verification.verify');

    // ── Google ───────────────────────────────────────────────────────────
    // Publiques par nature : personne n'est encore authentifié quand la
    // connexion commence. Le secret client reste sur le serveur — aucune de
    // ces routes ne l'expose, ni ne l'accepte.
    Route::middleware('throttle:20,1')->group(function () {
        Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
        Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
        // Création du compte APRÈS consentement (§22). Le seul point d'entrée
        // qui crée un compte Google, et il exige la case cochée.
        Route::post('/auth/google/complete', [GoogleAuthController::class, 'complete']);
    });

    // Protected routes — any authenticated user (admin or student).
    // `account.active` fait respecter users.account_status côté serveur :
    // un compte suspendu ou désactivé n'appelle plus rien, même avec un
    // jeton encore en main (voir EnsureAccountIsActive).
    Route::middleware(['auth:sanctum', 'account.active'])->group(function () {
        // ── Accessible SANS adresse vérifiée ─────────────────────────────
        // Le strict nécessaire pour sortir de cet état : savoir qui l'on est,
        // redemander le courriel, s'en aller. Tout le reste du groupe porte
        // `email.verified` (voir plus bas).
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        // Limité en débit : c'est le seul point d'entrée élève qui provoque
        // l'envoi d'un courriel. Sans cette limite, un script en enverrait
        // mille à la même adresse — et ce serait NOTRE serveur qui la
        // harcèlerait. L'adresse vient du compte authentifié, jamais de la
        // requête : on ne peut donc pas s'en servir pour arroser un tiers.
        Route::post('/auth/email/resend', [EmailVerificationController::class, 'resend'])
            ->middleware('throttle:5,10');

        Route::patch('/auth/grade', [AuthController::class, 'updateGrade'])
            ->middleware('email.verified');

        // ── L'ESPACE D'APPRENTISSAGE — adresse vérifiée exigée ───────────
        //
        //     authentifié  ET  compte actif  ET  adresse vérifiée
        //
        // Le middleware est posé sur le GROUPE, et non route par route :
        // c'est ce qui garantit qu'une route ajoutée demain hérite de la
        // règle au lieu de l'oublier. Les seules routes authentifiées qui
        // restent en dehors sont celles qui permettent de sortir de l'état
        // « non vérifié » (/auth/me, /auth/logout, /auth/email/resend).
        //
        // Les administrateurs en sont exemptés par le middleware lui-même :
        // leur compte est créé par `make:admin`, sans aucun courriel.
        Route::middleware('email.verified')->group(function () {
            Route::post('/diagnostic/sessions', [DiagnosticController::class, 'start']);
            Route::get('/diagnostic/sessions/current', [DiagnosticController::class, 'current']);
            Route::post('/diagnostic/sessions/{sessionId}/responses', [DiagnosticController::class, 'respond']);

            // Le TRAJET D'APPRENTISSAGE — progression, preuves, test final —
            // est celui d'un ÉLÈVE (`learner`). Un enseignant lit la même
            // leçon, tous les modules ouverts, sans jamais y écrire une ligne.
            Route::middleware('learner')->group(function () {
                Route::post('/lessons/{lessonCode}/evidence', [LearningEvidenceController::class, 'store']);
                Route::put('/lessons/{lessonCode}/progress', [LessonProgressController::class, 'upsert']);
                Route::put('/lessons/{lessonCode}/final-test-attempt', [LessonFinalTestAttemptController::class, 'store']);
                Route::delete('/lessons/{lessonCode}/final-test-attempt', [LessonFinalTestAttemptController::class, 'destroy']);
            });
            Route::get('/lessons/{lessonCode}/final-test-attempt', [LessonFinalTestAttemptController::class, 'show']);
            // Moteur d'exercices. Activé leçon par leçon
            // (content/practice/active.json) : PracticeCapability refuse en 422
            // une leçon sans contenu, sur les deux seuls points d'entrée qui
            // créent quelque chose — le reste exige une séance, donc en hérite.
            Route::get('/lessons/{lessonCode}/practice/overview', [PracticeSessionController::class, 'overview']);
            Route::post('/lessons/{lessonCode}/practice/sessions', [PracticeSessionController::class, 'store']);
            Route::get('/practice/sessions/{sessionId}', [PracticeSessionController::class, 'show']);
            // Le prochain exercice conseillé — le sélecteur lit la maîtrise, ne l'écrit jamais.
            Route::get('/practice/sessions/{sessionId}/next', [PracticeSessionController::class, 'next']);
            Route::post('/practice/sessions/{sessionId}/questions', [PracticeAnswerController::class, 'openQuestion']);
            Route::post('/practice/sessions/{sessionId}/answers', [PracticeAnswerController::class, 'store']);
            Route::post('/practice/sessions/{sessionId}/exercise-completions', [PracticeAnswerController::class, 'completeExercise']);
            Route::post('/practice/sessions/{sessionId}/complete', [PracticeSessionController::class, 'complete']);
            Route::post('/practice/question-attempts/{attemptUuid}/hints', [PracticeAnswerController::class, 'storeHint']);
            Route::get('/practice/notes', [PracticeNotebookController::class, 'index']);
            Route::post('/practice/notes', [PracticeNotebookController::class, 'store']);
            // « Mon cahier » : actions groupées AVANT `{id}` pour que « bulk »
            // ne soit pas lu comme un identifiant.
            Route::post('/practice/notes/bulk', [PracticeNotebookController::class, 'bulk']);
            Route::get('/practice/notes/{id}', [PracticeNotebookController::class, 'show']);
            Route::patch('/practice/notes/{id}', [PracticeNotebookController::class, 'update']);
            Route::post('/practice/notes/{id}/review', [PracticeNotebookController::class, 'review']);
            Route::delete('/practice/notes/{id}', [PracticeNotebookController::class, 'destroy']);

            // ── Le مختبر الرياضيات (Math Lab) ────────────────────────────
            // Le travail LIBRE de l'élève, hors de toute leçon : une table pour
            // tous les instruments, `tool` dit lequel, `data` reste opaque
            // (docs/architecture/MATH_LAB.md). Le propriétaire est l'élève
            // authentifié — aucun identifiant d'utilisateur n'est lu dans la
            // requête. La création est limitée en débit : la sauvegarde
            // automatique modifie (PATCH) un document existant, elle n'en
            // crée pas, donc cette limite ne la touche pas.
            Route::get('/math-lab/documents', [MathLabDocumentController::class, 'index']);
            Route::post('/math-lab/documents', [MathLabDocumentController::class, 'store'])
                ->middleware('throttle:30,1');
            // Les gestes GROUPÉS de « أعمالي » — avant `{id}`, qui ne prend que des nombres.
            Route::post('/math-lab/documents/bulk', [MathLabDocumentController::class, 'bulk']);
            Route::get('/math-lab/documents/{id}', [MathLabDocumentController::class, 'show'])->whereNumber('id');
            Route::post('/math-lab/documents/{id}/duplicate', [MathLabDocumentController::class, 'duplicate'])->whereNumber('id');
            Route::patch('/math-lab/documents/{id}', [MathLabDocumentController::class, 'update'])->whereNumber('id');
            Route::delete('/math-lab/documents/{id}', [MathLabDocumentController::class, 'destroy'])->whereNumber('id');
            // Les FICHIERS d'une سبّورة (images, SVG, PDF) : une ligne par
            // fichier, les octets sur le disque privé, et des quotas tenus sous
            // verrou (MathLabFileService — 1 Mo, 3 par document, 50 par élève).
            // Le contenu ne se sert qu'au propriétaire, en pièce jointe.
            Route::get('/math-lab/quota', [MathLabFileController::class, 'quota']);
            Route::get('/math-lab/documents/{id}/files', [MathLabFileController::class, 'index'])->whereNumber('id');
            Route::post('/math-lab/documents/{id}/files', [MathLabFileController::class, 'store'])
                ->whereNumber('id')
                ->middleware('throttle:60,1');
            Route::get('/math-lab/files/{id}/content', [MathLabFileController::class, 'content'])->whereNumber('id');
            Route::delete('/math-lab/files/{id}', [MathLabFileController::class, 'destroy'])->whereNumber('id');

            // « Signaler un problème ». Limité en débit : un signalement est un
            // geste rare, et cette limite empêche qu'un script en produise mille.
            // Deux temps : le clic pose le signal, l'envoi le complète. La
            // limite couvre les deux — un signalement est un geste rare.
            Route::post('/reports', [StudentReportController::class, 'store'])
                ->middleware('throttle:30,1');
            Route::patch('/reports/{id}', [StudentReportController::class, 'update'])
                ->whereNumber('id')
                ->middleware('throttle:30,1');

            // L'autorité de publication, servie au frontend : le catalogue vit
            // dans le bundle, donc sans ces deux appels l'élève continuerait
            // d'afficher une leçon masquée jusqu'à buter dessus.
            Route::get('/content/availability', [ContentAvailabilityController::class, 'index']);
            Route::get('/lessons/{lessonCode}/exercises', [ContentAvailabilityController::class, 'exercises']);

            // Le curriculum en lecture (phase 8) : classe → ميادين → وحدات →
            // دروس → نقاط التعلّم, prérequis et ressources déclarées. Codes et
            // structure ; le client garde son catalogue arabe.
            Route::get('/curriculum/grades/{gradeCode}', [CurriculumController::class, 'grade']);
            Route::get('/lessons/{lessonCode}/structure', [CurriculumController::class, 'lesson']);

            // « À quoi ai-je droit ? » — lecture seule. Aucun point d'entrée ne
            // permet à un élève de modifier ses droits d'accès… à une exception
            // près, juste en dessous, et qui exige un titre acheté.
            Route::get('/me/access', [AccessController::class, 'show']);

            // ── Le code d'activation (ALGERIA_PLATFORM_MASTER_SPEC.md §17) ──
            // Le modèle commercial algérien : l'élève paie en espèces, reçoit
            // une carte, saisit son code ici. C'est le SEUL geste par lequel
            // un élève ouvre ses propres droits — et il n'ouvre rien qu'un
            // administrateur n'ait préalablement produit.
            //
            // Limite de débit NOMMÉE, à la différence de tout le reste de ce
            // fichier : il faut deux compteurs (par compte ET par IP), et deux
            // `throttle:` successifs partageraient la même clé de cache, donc
            // le second n'en serait pas un. Voir AppServiceProvider.
            Route::post('/activation-codes/redeem', [ActivationCodeController::class, 'redeem'])
                ->middleware('throttle:activation-redeem');

            // ── Entrée en paiement ───────────────────────────────────────────
            // N'accorde AUCUN accès : rend une URL vers la page de paiement du
            // fournisseur. L'accès s'ouvrira au webhook signé, pas ici.
            //
            // Le client n'envoie qu'une clé d'offre ; le tarif, le montant, la
            // devise et l'identité de l'élève viennent tous du serveur.
            Route::get('/billing/plans', [BillingCheckoutController::class, 'plans']);
            // Limité en débit : ouvrir une session appelle le fournisseur, donc
            // c'est le seul point d'entrée élève qui coûte un appel sortant.
            Route::post('/billing/checkout', [BillingCheckoutController::class, 'start'])
                ->middleware('throttle:10,1');

            // ── Gestion de l'abonnement (phase 7) ────────────────────────────
            // Aucun de ces points d'entrée ne lit d'identifiant dans la requête :
            // l'abonnement est retrouvé depuis l'élève AUTHENTIFIÉ. Il n'y a donc
            // aucun contrôle d'appartenance à oublier — rien à faire correspondre.
            //
            // Aucun n'accorde ni ne retire un accès : résilier exprime une
            // intention chez le fournisseur, et seul le webhook signé fait foi.
            Route::get('/billing/subscription', [BillingSubscriptionController::class, 'show']);
            // Les trois mutations appellent le fournisseur : limitées en débit,
            // comme l'ouverture d'une session de paiement.
            Route::post('/billing/portal', [BillingSubscriptionController::class, 'portal'])
                ->middleware('throttle:10,1');
            Route::post('/billing/subscription/cancel', [BillingSubscriptionController::class, 'cancel'])
                ->middleware('throttle:10,1');
            Route::post('/billing/subscription/resume', [BillingSubscriptionController::class, 'resume'])
                ->middleware('throttle:10,1');

            Route::get('/students/me/learning-profile', [LearningProfileController::class, 'show']);
            // « Pourquoi ce statut ? » — l'explication d'un point, pour soi (Mastery V2).
            Route::get('/students/me/learning-points/{code}/explanation', [LearningPointExplanationController::class, 'show']);
            // Que faire ensuite dans une leçon — dérivé de l'état canonique, jamais bloquant.
            Route::get('/students/me/lessons/{lessonCode}/recommendations', [RecommendationController::class, 'show']);
            Route::get('/students/me/lesson-progress', [LessonProgressController::class, 'index']);

            // ── L'élève et sa CLASSE (« قسمي ») ─────────────────────────
            // « Où j'étudie », rejoindre par code ou par invitation, quitter.
            // L'élève est toujours l'utilisateur authentifié ; rejoindre ne
            // prend qu'un code ou un jeton, jamais un identifiant de classe.
            // Limite NOMMÉE à deux compteurs, comme la saisie d'un code
            // d'activation : un code de classe est court.
            Route::get('/student/study-context', [StudentClassroomController::class, 'context']);
            Route::post('/student/classrooms/join', [StudentClassroomController::class, 'join'])
                ->middleware('throttle:classroom-join');
            Route::post('/student/classrooms/{id}/leave', [StudentClassroomController::class, 'leave'])->whereNumber('id');
            Route::post('/student/classrooms/{id}/consent', [StudentClassroomController::class, 'consent'])->whereNumber('id');
            // Les suggestions de l'enseignant (interventions visibles) — jamais un verrou.
            Route::get('/student/teacher-recommendations', [StudentClassroomController::class, 'recommendations']);

            // ── « Mon offre » — élève comme enseignant ───────────────────
            // AUCUN paiement en ligne : ces routes montrent les offres (prix
            // informatif), enregistrent une DEMANDE et rendent l'état. Elles
            // n'activent rien ; l'activation vient de l'administration.
            Route::get('/me/plans', [MeSubscriptionController::class, 'plans']);
            Route::get('/me/plans/{planId}/quote', [MeSubscriptionController::class, 'quote'])->whereNumber('planId');
            Route::get('/me/subscription', [MeSubscriptionController::class, 'show']);
            Route::get('/me/subscription-requests', [MeSubscriptionController::class, 'requests']);
            Route::post('/me/subscription-requests', [MeSubscriptionController::class, 'storeRequest'])
                ->middleware('throttle:10,1');
            Route::post('/me/subscription-requests/{requestId}/cancel', [MeSubscriptionController::class, 'cancelRequest'])
                ->whereNumber('requestId');
        });
    });

    // ── L'ESPACE ENSEIGNANT ──────────────────────────────────────────────
    //
    //     authentifié  ET  compte actif  ET  adresse vérifiée  ET  rôle enseignant
    //
    // La première couche d'autorisation (le rôle) est ici, sur le groupe.
    // La deuxième (la propriété d'une classe) est ClassroomPolicy, appelée
    // par chaque contrôleur. La troisième (l'offre) vit dans les services.
    // Un administrateur n'y entre pas : il a ses propres routes de consultation.
    Route::middleware(['auth:sanctum', 'account.active', 'email.verified', 'can:teacher'])
        ->prefix('teacher')
        ->group(function () {
            Route::get('/dashboard', [TeacherDashboardController::class, 'index']);
            Route::get('/entitlements', [TeacherDashboardController::class, 'entitlements']);

            // « Mon offre », vue de l'enseignant : mêmes points d'entrée que /me.
            Route::get('/plans', [MeSubscriptionController::class, 'plans']);
            Route::get('/plans/{planId}/quote', [MeSubscriptionController::class, 'quote'])->whereNumber('planId');
            Route::get('/capacity', [TeacherDashboardController::class, 'capacity']);
            Route::get('/subscription', [MeSubscriptionController::class, 'show']);
            Route::get('/subscription-requests', [MeSubscriptionController::class, 'requests']);
            Route::post('/subscription-requests', [MeSubscriptionController::class, 'storeRequest'])
                ->middleware('throttle:10,1');
            Route::post('/subscription-requests/{requestId}/cancel', [MeSubscriptionController::class, 'cancelRequest'])
                ->whereNumber('requestId');

            Route::get('/classrooms', [TeacherClassroomController::class, 'index']);
            Route::post('/classrooms', [TeacherClassroomController::class, 'store']);
            Route::get('/classrooms/{id}', [TeacherClassroomController::class, 'show'])->whereNumber('id');
            Route::patch('/classrooms/{id}', [TeacherClassroomController::class, 'update'])->whereNumber('id');
            Route::post('/classrooms/{id}/archive', [TeacherClassroomController::class, 'archive'])->whereNumber('id');
            Route::post('/classrooms/{id}/restore', [TeacherClassroomController::class, 'restore'])->whereNumber('id');
            Route::post('/classrooms/{id}/join-code/rotate', [TeacherClassroomController::class, 'rotateJoinCode'])->whereNumber('id');

            Route::get('/classrooms/{id}/students', [TeacherClassroomStudentController::class, 'index'])->whereNumber('id');
            Route::get('/classrooms/{id}/students/{studentId}/progress', [TeacherClassroomStudentController::class, 'progress'])
                ->whereNumber('id')->whereNumber('studentId');
            Route::delete('/classrooms/{id}/students/{studentId}', [TeacherClassroomStudentController::class, 'destroy'])
                ->whereNumber('id')->whereNumber('studentId');

            // Le cahier d'un élève, EN LECTURE SEULE, borné aux leçons de la
            // classe. Aucune route d'écriture ici : un enseignant lit, il
            // n'annote pas (TeacherClassroomNotebookController).
            Route::get('/classrooms/{id}/students/{studentId}/notebook', [TeacherClassroomNotebookController::class, 'index'])
                ->whereNumber('id')->whereNumber('studentId');
            Route::get('/classrooms/{id}/students/{studentId}/notebook/{noteId}', [TeacherClassroomNotebookController::class, 'show'])
                ->whereNumber('id')->whereNumber('studentId')->whereNumber('noteId');

            Route::get('/classrooms/{id}/invitations', [TeacherClassroomInvitationController::class, 'index'])->whereNumber('id');
            Route::post('/classrooms/{id}/invitations', [TeacherClassroomInvitationController::class, 'store'])
                ->whereNumber('id')->middleware('throttle:30,1');
            Route::delete('/classrooms/{id}/invitations/{invitationId}', [TeacherClassroomInvitationController::class, 'destroy'])
                ->whereNumber('id')->whereNumber('invitationId');

            // Le lot AVANT `{lessonId}`, pour que « bulk » ne soit pas lu comme un identifiant.
            Route::get('/classrooms/{id}/lessons', [TeacherClassroomLessonController::class, 'index'])->whereNumber('id');
            Route::post('/classrooms/{id}/lessons/bulk', [TeacherClassroomLessonController::class, 'bulk'])->whereNumber('id');
            Route::patch('/classrooms/{id}/lessons/{lessonId}', [TeacherClassroomLessonController::class, 'update'])
                ->whereNumber('id')->whereNumber('lessonId');

            Route::get('/classrooms/{id}/progress', [TeacherClassroomProgressController::class, 'show'])->whereNumber('id');

            // Classe × learning point (Mastery V2, phase 7) — agrégation de
            // l'état canonique, en lecture seule, cadrée sur les leçons
            // effectives de la classe. `?lesson=` est obligatoire sur l'index.
            Route::get('/classrooms/{id}/learning-points', [TeacherClassroomLearningPointController::class, 'index'])->whereNumber('id');
            Route::get('/classrooms/{id}/learning-points/{code}', [TeacherClassroomLearningPointController::class, 'show'])->whereNumber('id');
            Route::get('/classrooms/{id}/students/{studentId}/learning-points/{code}/explanation', [TeacherClassroomLearningPointController::class, 'explanation'])
                ->whereNumber('id')->whereNumber('studentId');

            // DÉTECTER : « تستحقّ نظرة » et « ما الذي تغيّر؟ » — calculés à la
            // lecture depuis l'état canonique, jamais stockés.
            Route::get('/classrooms/{id}/attention', [TeacherClassroomInsightController::class, 'attention'])->whereNumber('id');

            // INTERVENIR puis MESURER — le geste de l'enseignant et ce qui a suivi.
            Route::get('/classrooms/{id}/interventions', [TeacherClassroomInterventionController::class, 'index'])->whereNumber('id');
            Route::post('/classrooms/{id}/interventions', [TeacherClassroomInterventionController::class, 'store'])
                ->whereNumber('id')->middleware('throttle:60,1');
            Route::get('/classrooms/{id}/interventions/{interventionId}', [TeacherClassroomInterventionController::class, 'show'])
                ->whereNumber('id')->whereNumber('interventionId');
            Route::patch('/classrooms/{id}/interventions/{interventionId}', [TeacherClassroomInterventionController::class, 'update'])
                ->whereNumber('id')->whereNumber('interventionId');
        });

    // Protected routes — admin only
    Route::middleware(['auth:sanctum', 'account.active', 'can:admin'])->group(function () {
        Route::get('/contact', [ContactController::class, 'index']);

        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            Route::get('/analytics/platform', [AdminDashboardController::class, 'platform']);
            Route::get('/analytics/learning', [AdminDashboardController::class, 'learning']);
            Route::get('/analytics/content', [AdminDashboardController::class, 'content']);
            Route::get('/analytics/learning-points', [AdminDashboardController::class, 'learningPoints']);

            // Rejeux de maîtrise (Mastery V2) : reconstruire l'état depuis la
            // preuve immuable, dans une version donnée — dry-run par défaut.
            Route::get('/mastery/replays', [AdminMasteryReplayController::class, 'index']);
            Route::post('/mastery/replays', [AdminMasteryReplayController::class, 'store']);
            Route::get('/mastery/replays/{id}', [AdminMasteryReplayController::class, 'show'])->whereNumber('id');

            Route::get('/content/lessons', [AdminContentController::class, 'lessons']);
            Route::get('/content/lessons/{code}', [AdminContentController::class, 'lesson']);
            // Vues transversales : la vue par leçon oblige à savoir OÙ
            // chercher, ce que « tous les modules masqués » n'a pas.
            Route::get('/content/modules', [AdminContentController::class, 'modules']);
            Route::get('/content/exercises', [AdminContentController::class, 'exercises']);
            // Un seul point d'entrée pour les trois niveaux de contenu :
            // {type} vaut lesson | module | exercise.
            Route::patch('/content/{type}/{id}/status', [AdminContentController::class, 'changeStatus'])
                ->whereIn('type', ['lesson', 'module', 'exercise'])
                ->whereNumber('id');
            // Le PALIER commercial, sur une route distincte de la
            // publication : deux dimensions indépendantes. Pas de module —
            // un module suit le palier de sa leçon.
            Route::patch('/content/{type}/{id}/tier', [AdminContentController::class, 'changeTier'])
                ->whereIn('type', ['lesson', 'exercise'])
                ->whereNumber('id');

            // Les MÊMES deux gestes, sur une liste. Les contraintes de type
            // sont recopiées à l'identique : ce qui est interdit à l'unité
            // (le palier d'un module) reste interdit en lot.
            Route::post('/content/{type}/bulk-status', [AdminContentController::class, 'bulkChangeStatus'])
                ->whereIn('type', ['lesson', 'module', 'exercise']);
            Route::post('/content/{type}/bulk-tier', [AdminContentController::class, 'bulkChangeTier'])
                ->whereIn('type', ['lesson', 'exercise']);

            Route::get('/reports', [AdminReportController::class, 'index']);
            Route::get('/reports/clusters', [AdminReportController::class, 'clusters']);
            Route::get('/reports/{id}', [AdminReportController::class, 'show'])->whereNumber('id');
            Route::patch('/reports/{id}', [AdminReportController::class, 'update'])->whereNumber('id');
            Route::post('/reports/{id}/notes', [AdminReportController::class, 'addNote'])->whereNumber('id');

            Route::get('/students', [AdminStudentController::class, 'index']);
            Route::get('/students/{id}', [AdminStudentController::class, 'show'])->whereNumber('id');
            Route::patch('/students/{id}/status', [AdminStudentController::class, 'changeStatus'])->whereNumber('id');

            // Droits d'accès : consulter, accorder une dérogation, la retirer.
            // Strictement admin_override — un abonnement ne se crée pas à la
            // main (voir EntitlementAdminService).
            Route::get('/students/{id}/entitlements', [AdminEntitlementController::class, 'show'])->whereNumber('id');
            Route::post('/students/{id}/entitlements/override', [AdminEntitlementController::class, 'grant'])->whereNumber('id');
            Route::delete('/students/{id}/entitlements/override', [AdminEntitlementController::class, 'revoke'])->whereNumber('id');
            // Réconcilier abonnements → droits. Ni encaissement, ni création
            // d'abonnement : sans abonnement, cette route ne produit rien.
            Route::post('/students/{id}/entitlements/sync', [AdminEntitlementController::class, 'syncSubscriptions'])->whereNumber('id');

            // ── Les codes d'activation ───────────────────────────────────
            // L'ordre des routes est LOAD-BEARING : `/batches` et `/export`
            // sont déclarées AVANT `/{id}`, sinon le paramètre numérique les
            // avalerait. `whereNumber` protège déjà, mais l'ordre dit
            // l'intention sans dépendre de lui.
            Route::get('/activation-codes', [AdminActivationCodeController::class, 'index']);
            Route::get('/activation-codes/export', [AdminActivationCodeController::class, 'export']);
            Route::get('/activation-codes/batches', [AdminActivationCodeController::class, 'batches']);
            // Le SEUL point d'entrée qui rend des codes en clair, et
            // seulement ceux qu'il vient de créer.
            Route::post('/activation-codes/batches', [AdminActivationCodeController::class, 'generate']);
            Route::post('/activation-codes/batches/{id}/revoke', [AdminActivationCodeController::class, 'revokeBatch'])
                ->whereNumber('id');
            Route::get('/activation-codes/{id}', [AdminActivationCodeController::class, 'show'])
                ->whereNumber('id');
            Route::post('/activation-codes/{id}/revoke', [AdminActivationCodeController::class, 'revoke'])
                ->whereNumber('id');

            Route::get('/subscriptions', [AdminSubscriptionController::class, 'index']);
            Route::get('/payments', [AdminSubscriptionController::class, 'payments']);

            // Les évènements de fournisseur : le journal qui répond à
            // « l'élève dit avoir payé, que s'est-il passé ? ».
            // En lecture, plus un seul geste — rejouer, qui repasse par la
            // chaîne normale et ne fabrique aucun abonnement.
            Route::get('/provider-events', [AdminProviderEventController::class, 'index']);
            Route::get('/provider-events/{id}', [AdminProviderEventController::class, 'show'])->whereNumber('id');
            Route::post('/provider-events/{id}/replay', [AdminProviderEventController::class, 'replay'])->whereNumber('id');

            // ── Les ENSEIGNANTS et leurs CLASSES ─────────────────────────
            Route::get('/teachers', [AdminTeacherController::class, 'index']);
            Route::get('/teachers/{id}', [AdminTeacherController::class, 'show'])->whereNumber('id');
            Route::patch('/teachers/{id}/status', [AdminTeacherController::class, 'changeStatus'])->whereNumber('id');
            Route::get('/teachers/{id}/entitlements', [AdminTeacherController::class, 'entitlements'])->whereNumber('id');
            Route::post('/teachers/{id}/entitlements/overrides', [AdminTeacherController::class, 'grantOverride'])->whereNumber('id');
            Route::delete('/teachers/{id}/entitlements/overrides/{overrideId}', [AdminTeacherController::class, 'revokeOverride'])
                ->whereNumber('id')->whereNumber('overrideId');

            Route::get('/classrooms', [AdminClassroomController::class, 'index']);
            Route::get('/classrooms/{id}', [AdminClassroomController::class, 'show'])->whereNumber('id');

            // ── L'ACTIVATION MANUELLE — élèves et enseignants ────────────
            // Aucun paiement en ligne : l'argent est reçu hors plateforme,
            // puis l'administrateur active l'offre sur le compte, ou lui
            // envoie UN code unique lié à l'offre. Les demandes ne sont
            // qu'une file d'attente ; elles n'activent jamais rien.
            Route::get('/{role}/{id}/subscription', [AdminManualSubscriptionController::class, 'show'])
                ->whereIn('role', ['teachers', 'students'])->whereNumber('id');
            Route::post('/{role}/{id}/subscriptions', [AdminManualSubscriptionController::class, 'activate'])
                ->whereIn('role', ['teachers', 'students'])->whereNumber('id');
            Route::post('/{role}/{id}/activation-codes', [AdminManualSubscriptionController::class, 'issueCode'])
                ->whereIn('role', ['teachers', 'students'])->whereNumber('id');

            Route::get('/subscription-requests', [AdminManualSubscriptionController::class, 'requests']);
            Route::post('/subscription-requests/{requestId}/reject', [AdminManualSubscriptionController::class, 'rejectRequest'])
                ->whereNumber('requestId');
            Route::post('/subscriptions/{subscriptionId}/suspend', [AdminManualSubscriptionController::class, 'suspend'])->whereNumber('subscriptionId');
            Route::post('/subscriptions/{subscriptionId}/resume', [AdminManualSubscriptionController::class, 'resume'])->whereNumber('subscriptionId');
            Route::post('/subscriptions/{subscriptionId}/cancel', [AdminManualSubscriptionController::class, 'cancel'])->whereNumber('subscriptionId');
            Route::post('/subscriptions/{subscriptionId}/extend', [AdminManualSubscriptionController::class, 'extend'])->whereNumber('subscriptionId');
            Route::post('/subscriptions/{subscriptionId}/change-plan', [AdminManualSubscriptionController::class, 'changePlan'])->whereNumber('subscriptionId');

            // ── Les OFFRES : le modèle commercial, sans déploiement ──────
            // `/keys` et `/plan-versions` AVANT `/plans/{id}`, par clarté.
            Route::get('/entitlements/keys', [AdminPlanController::class, 'keys']);
            Route::get('/plans', [AdminPlanController::class, 'index']);
            Route::post('/plans', [AdminPlanController::class, 'store']);
            Route::get('/plans/{id}', [AdminPlanController::class, 'show'])->whereNumber('id');
            Route::patch('/plans/{id}', [AdminPlanController::class, 'update'])->whereNumber('id');
            Route::patch('/plans/{id}/status', [AdminPlanController::class, 'changeStatus'])->whereNumber('id');
            Route::post('/plans/{id}/duplicate', [AdminPlanController::class, 'duplicate'])->whereNumber('id');
            Route::post('/plans/{id}/versions', [AdminPlanController::class, 'storeVersion'])->whereNumber('id');
            Route::get('/plans/{id}/subscriptions', [AdminPlanController::class, 'subscriptions'])->whereNumber('id');
            Route::patch('/plan-versions/{id}', [AdminPlanController::class, 'updateVersion'])->whereNumber('id');
            Route::post('/plan-versions/{id}/publish', [AdminPlanController::class, 'publishVersion'])->whereNumber('id');
            // La grille de prix par élève (sièges) : lecture, remplacement (brouillon), aperçu.
            Route::get('/plan-versions/{id}/pricing', [AdminPlanController::class, 'pricing'])->whereNumber('id');
            Route::put('/plan-versions/{id}/pricing', [AdminPlanController::class, 'replacePricing'])->whereNumber('id');
            Route::get('/plan-versions/{id}/pricing/quote', [AdminPlanController::class, 'quote'])->whereNumber('id');

            Route::get('/account', [AdminAccountController::class, 'show']);
            Route::patch('/account/profile', [AdminAccountController::class, 'updateProfile']);
            Route::patch('/account/email', [AdminAccountController::class, 'updateEmail']);
            Route::patch('/account/password', [AdminAccountController::class, 'updatePassword']);

            Route::get('/activity-log', [AdminActivityLogController::class, 'index']);

            // Diagnostic de cohérence source ↔ registre. Admin uniquement.
            Route::get('/health', [AdminHealthController::class, 'index']);
        });
    });
});
