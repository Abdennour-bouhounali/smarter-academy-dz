<?php

namespace App\Domain\Access;

use App\Domain\Classroom\StudyContextService;
use App\Models\Lesson;
use App\Models\LessonModule;
use App\Models\PracticeExercise;
use App\Models\User;
use DomainException;
use Illuminate\Support\Collection;

/**
 * La porte d'accès au contenu — UN seul endroit.
 *
 * La spec (§24) demande que la décision d'accès soit centralisée plutôt que
 * dispersée en conditions dans des composants. C'est ici.
 *
 * L'ordre est celui du contrat :
 *
 *     état du compte  (middleware account.active, en amont de toute route)
 *          ↓
 *     droit d'accès / palier          ← EntitlementService
 *          ↓
 *     état de publication du contenu  ← ce fichier
 *
 * LES DEUX DOIVENT ÊTRE SATISFAITS, et ils ne se remplacent jamais l'un
 * l'autre. C'est l'invariant central de cette couche :
 *
 *     droit valide + leçon masquée  = REFUS
 *     leçon publiée + aucun droit   = REFUS
 *
 * En particulier, une dérogation d'administration n'est PAS un passe-droit
 * vers du contenu non publié (spec §29) : elle répond « cet élève a la
 * permission commerciale », pas « ce contenu peut être servi ». Un contenu
 * masqué l'est parce qu'il est faux ou en cours de relecture — le montrer à
 * quelqu'un qui a payé serait pire, pas mieux.
 *
 * Le palier est évalué AVANT la publication pour que le message rendu soit le
 * plus utile des deux : à un élève sans abonnement devant une leçon payante
 * et masquée, « il faut un accès premium » est actionnable là où « leçon
 * indisponible » ne l'est pas.
 *
 * Une leçon ABSENTE du registre reste accessible : la base est un miroir du
 * contenu, pas son autorité. Refuser ce qui n'est pas encore importé
 * fermerait la plateforme au premier oubli de synchronisation.
 *
 * ── Les RELECTEURS (2026-10-05) ──────────────────────────────────────────
 * L'administrateur et les AMBASSADEURS (« سفراء », User::canReviewAllContent)
 * relisent le contenu : la publication ne les arrête pas — c'est précisément
 * le brouillon et le masqué qu'ils doivent voir. Seul l'axe PUBLICATION est
 * levé pour eux : la classe active et le palier restent évalués (le palier
 * les laisse passer de lui-même, voir EntitlementService). L'inventaire leur
 * rend, au lieu des fermetures, l'ÉTAT de chaque contenu non publié, pour que
 * l'interface l'affiche. Aucune écriture ne s'ouvre : la progression reste
 * derrière le middleware `learner`.
 */
class ContentAccess
{
    /** Le relecteur passe outre la publication — et elle seule. */
    public static function bypassesPublication(?User $user): bool
    {
        return $user !== null && $user->canReviewAllContent();
    }

    /**
     * La leçon est-elle ouverte à CET élève ?
     *
     * $user est explicite plutôt que lu depuis auth() : une décision d'accès
     * qui va chercher son sujet dans un état global est une décision qu'on ne
     * peut pas tester en table de vérité, et c'est exactement ce que la
     * matrice de la spec §40 demande de couvrir. Null = visiteur anonyme.
     *
     * @throws DomainException si le palier n'est pas satisfait, ou si la
     *                         leçon est masquée, archivée ou en brouillon.
     */
    public static function assertLessonAvailable(string $lessonCode, ?User $user = null): void
    {
        $lessons = Lesson::with('chapter.grade')->where('code', $lessonCode)->get();

        // Inconnue du registre : on laisse passer (voir le docblock).
        if ($lessons->isEmpty()) {
            return;
        }

        self::assertGradeActive($lessons);
        self::assertEntitled($lessons, $user);

        // Un code de leçon se répète d'une classe à l'autre. Si AU MOINS une
        // des leçons portant ce code est publiée, l'accès reste ouvert :
        // masquer la version de 6e ne doit pas fermer celle de 3e.
        if (! self::bypassesPublication($user)
            && ! $lessons->contains(fn (Lesson $lesson) => $lesson->isVisibleToStudents())) {
            throw new DomainException('Cette leçon n\'est pas disponible pour le moment.');
        }

        // ── Le TROISIÈME axe : la classe de l'enseignant ─────────────────
        // Après la publication et le palier, jamais à leur place : masquer
        // pour une classe n'ouvre rien de non publié, et une leçon publiée
        // reste fermée à l'élève dont l'enseignant l'a masquée. La règle
        // « une porte ouverte = ouvert » vaut ici aussi (voir
        // StudyContextService::hiddenLessonCodes).
        self::assertNotHiddenByClass($lessonCode, $user);
    }

    /** Motif rendu au client quand l'enseignant a masqué la leçon. */
    public const HIDDEN_BY_TEACHER = 'hidden_by_teacher';

    /**
     * @throws DomainException si l'enseignant de l'élève a masqué la leçon.
     */
    private static function assertNotHiddenByClass(string $lessonCode, ?User $user): void
    {
        if ($user === null || ! $user->isStudent()) {
            return;
        }

        if (in_array($lessonCode, app(StudyContextService::class)->hiddenLessonCodesFor($user), true)) {
            throw new DomainException('Cette leçon n\'est pas disponible dans votre classe.');
        }
    }

    /**
     * Le MODULE est-il ouvert ?
     *
     * Pas de cascade : un module en brouillon reste inaccessible sous une
     * leçon publiée, et publier une leçon ne publie aucun module. Chaque
     * niveau porte son propre état — c'est ce qui permet de retirer UN module
     * cassé sans fermer la leçon entière (spec §10), et ce qui évite qu'une
     * publication de leçon ouvre par surprise du contenu jamais relu.
     *
     * @throws DomainException si le module est masqué, archivé ou en brouillon.
     */
    public static function assertModuleAvailable(string $lessonCode, int|string $moduleRef, ?User $user = null): void
    {
        // La leçon d'abord : inutile de dire « module indisponible » quand
        // c'est toute la leçon qui est fermée. C'est aussi ce qui fait porter
        // le palier au module sans qu'il ait à le redemander — le module
        // hérite du palier de sa leçon, il n'en a pas un à lui.
        self::assertLessonAvailable($lessonCode, $user);

        $modules = LessonModule::whereHas('lesson', fn ($q) => $q->where('code', $lessonCode))
            ->where(function ($q) use ($moduleRef) {
                // Le client désigne un module par son NUMÉRO (la progression
                // stocke des numéros) ou par son CODE ('00', '07'). Les deux
                // sont acceptés parce que les deux circulent déjà.
                $q->where('code', (string) $moduleRef);
                if (is_numeric($moduleRef)) {
                    $q->orWhere('number', (int) $moduleRef);
                }
            })
            ->whereNull('retired_at')
            ->get();

        // Inconnu du registre : on laisse passer, même raison que pour la
        // leçon — la base miroite le contenu, elle n'en est pas l'autorité.
        if ($modules->isEmpty()) {
            return;
        }

        if (self::bypassesPublication($user)
            || $modules->contains(fn (LessonModule $module) => $module->isVisibleToStudents())) {
            return;
        }

        throw new DomainException('Ce module n\'est pas disponible pour le moment.');
    }

    /** Variante non levante, pour filtrer une liste. */
    public static function isModuleAvailable(string $lessonCode, int|string $moduleRef, ?User $user = null): bool
    {
        try {
            self::assertModuleAvailable($lessonCode, $moduleRef, $user);

            return true;
        } catch (DomainException) {
            return false;
        }
    }

    /**
     * L'exercice est-il ouvert à CET élève ?
     *
     * Deux dimensions, comme partout : la publication et le palier.
     *
     * Le palier de la LEÇON a déjà été tranché en amont — les deux points
     * d'entrée qui ouvrent un exercice (ouvrir une séance, ouvrir une
     * question) passent par assertLessonAvailable. Ce qui reste à vérifier
     * ici, c'est le palier PROPRE à l'exercice : un exercice explicitement
     * payant sous une leçon gratuite. Sans ce contrôle, il suffirait d'une
     * leçon gratuite pour servir gratuitement tout exercice premium qu'elle
     * contient.
     *
     * Le contrôle ne coûte rien quand il n'y a rien à contrôler : `tier` est
     * null pour tout le registre actuel, donc la branche premium n'est même
     * pas atteinte et aucune requête de droits n'est faite.
     */
    public static function isExerciseAvailable(string $lessonCode, string $exerciseCode, ?User $user = null): bool
    {
        $exercise = PracticeExercise::with('lesson:id,tier')
            ->whereHas('lesson', fn ($q) => $q->where('code', $lessonCode))
            ->where('exercise_code', $exerciseCode)
            ->first();

        // Inconnu du registre : servi. La base miroite le contenu, elle n'en
        // est pas l'autorité — même règle qu'aux deux niveaux au-dessus.
        if ($exercise === null) {
            return true;
        }

        if (! self::bypassesPublication($user) && ! $exercise->isVisibleToStudents()) {
            return false;
        }

        $tier = AccessTier::effective($exercise->tier, $exercise->lesson?->tier);

        if ($tier === AccessTier::FREE) {
            return true;
        }

        return app(EntitlementService::class)->satisfies($user, AccessTier::PREMIUM);
    }

    /**
     * Isolement des classes dormantes (docs/ALGERIA_MIGRATION_AUDIT.md §15,
     * ALGERIA_PLATFORM_MASTER_SPEC.md §3, §10).
     *
     * Le catalogue frontend (coursesData.js, filtré par activeGrades.js) et
     * le registre de leçons (registry.js) empêchent déjà la navigation vers
     * une classe française désactivée. Ce contrôle est le PENDANT côté
     * serveur : un client qui appelle directement /api/v1/lessons/{code}/*
     * avec un code de leçon français connu ne doit pas contourner
     * l'isolement simplement parce qu'il n'utilise pas la navigation.
     *
     * Même règle de composition qu'ailleurs dans ce fichier : un code peut
     * porter plusieurs leçons (une par classe). L'accès reste ouvert si
     * AU MOINS une porte une classe active — désactiver la version de
     * seconde ne doit pas fermer une future version 4AM du même code.
     *
     * L'autorité est `grades.is_active`, alimenté par l'import du catalogue
     * depuis packages/core/curriculum/activeGrades.js (une seule liste pour
     * le frontend ET l'API). Tant qu'aucune classe algérienne n'existe
     * (Phase 7 de la feuille de route), toute classe héritée du français est
     * fermée — y compris si sa publication_status vaut 'published', hérité
     * de France et sans rapport avec l'activation pour l'Algérie.
     *
     * @param  Collection<int, Lesson>  $lessons
     *
     * @throws DomainException si AUCUNE classe portée par ce code n'est active.
     */
    private static function assertGradeActive($lessons): void
    {
        if (! config('curriculum.enforce_active_grades', true)) {
            return;
        }

        if ($lessons->contains(fn (Lesson $l) => (bool) $l->chapter?->grade?->is_active)) {
            return;
        }

        throw new DomainException('Cette leçon n\'est pas disponible pour le moment.');
    }

    /**
     * Le palier exigé par un code de leçon est-il satisfait ?
     *
     * Un code peut porter plusieurs leçons (le même intitulé en 6e et en 3e).
     * On retient le palier le MOINS restrictif : si une seule des versions est
     * gratuite, l'accès reste ouvert — même règle que pour la publication
     * juste au-dessus, et pour la même raison. Rendre payante la version de 3e
     * ne doit pas fermer celle de 6e.
     *
     * @param  Collection<int, Lesson>  $lessons
     *
     * @throws DomainException si aucun palier porté par ce code n'est satisfait.
     */
    private static function assertEntitled($lessons, ?User $user): void
    {
        $tiers = $lessons->map(fn (Lesson $l) => AccessTier::normalize($l->tier))->unique();

        // Le cas de très loin le plus fréquent — tout le catalogue actuel.
        // Traité en premier et sans injection de service : le gratuit ne pose
        // aucune question à la base.
        if ($tiers->contains(AccessTier::FREE)) {
            $entitlements = app(EntitlementService::class);
            $decision = $entitlements->decide($user, AccessTier::FREE);
            if (! $decision->allowed) {
                throw new DomainException($decision->studentMessage());
            }

            return;
        }

        $decision = app(EntitlementService::class)->decide($user, AccessTier::PREMIUM);

        if (! $decision->allowed) {
            throw new DomainException($decision->studentMessage());
        }
    }

    /**
     * L'inventaire d'accès destiné à l'élève : ce qui est FERMÉ.
     *
     * Renvoyé en liste de fermetures plutôt qu'en liste d'ouvertures : le
     * catalogue vit dans le frontend (coursesData.js), la base n'en est que
     * le miroir. Envoyer « voici les 132 leçons ouvertes » ferait de la base
     * une seconde définition du catalogue, qui dériverait. Envoyer « voici
     * les 3 choses fermées » laisse une seule source de vérité au contenu, et
     * une seule autorité à la publication.
     *
     * Conséquence voulue : une leçon absente du registre reste ouverte.
     *
     * Pour un RELECTEUR (bypassesPublication), rien n'est fermé par la
     * publication : `lessons` et `modules` sont vides, et `statuses` dit
     * l'état de ce qui n'est pas publié — l'interface l'affiche en badge.
     *
     * @return array{lessons: string[], modules: array<string, int[]>, locked: string[], statuses?: array}
     */
    public static function closedInventory(?User $user = null): array
    {
        if (self::bypassesPublication($user)) {
            $premium = self::premiumLessonCodes();

            return [
                'lessons' => [],
                'modules' => [],
                'premium' => $premium,
                'locked' => self::lockedLessonCodes($user, $premium),
                'hiddenByClass' => [],
                'statuses' => self::publicationStatuses(),
            ];
        }

        $closedLessons = Lesson::where('publication_status', '!=', Lesson::PUB_PUBLISHED)
            ->pluck('code')
            // Un code peut porter deux leçons (6e et 3e) : il n'est fermé que
            // si AUCUNE des deux n'est publiée. Même règle qu'assertLessonAvailable.
            ->unique()
            ->filter(fn (string $code) => ! Lesson::where('code', $code)
                ->where('publication_status', Lesson::PUB_PUBLISHED)
                ->exists())
            ->values()
            ->all();

        $closedModules = [];
        $rows = LessonModule::query()
            ->join('lessons', 'lessons.id', '=', 'lesson_modules.lesson_id')
            ->where('lesson_modules.publication_status', '!=', LessonModule::PUB_PUBLISHED)
            ->whereNull('lesson_modules.retired_at')
            ->get(['lessons.code as lesson_code', 'lesson_modules.number']);

        foreach ($rows as $row) {
            $closedModules[$row->lesson_code][] = (int) $row->number;
        }

        $premium = self::premiumLessonCodes();

        return [
            'lessons' => $closedLessons,
            'modules' => $closedModules,
            // Ce qui est PAYANT, et ce qui est payant ET fermé à cet élève.
            // Les deux listes, parce que les deux questions sont distinctes :
            // un abonné doit continuer de voir le badge « Premium » sur ce à
            // quoi il a accès (sinon le contenu vendu se déguise en gratuit,
            // et sa disparition à l'échéance devient incompréhensible), mais
            // rien ne doit lui être verrouillé.
            'premium' => $premium,
            'locked' => self::lockedLessonCodes($user, $premium),
            // Le troisième axe : ce que l'ENSEIGNANT a masqué pour cet
            // élève. Vide pour un élève indépendant — et pour un visiteur.
            'hiddenByClass' => $user !== null && $user->isStudent()
                ? app(StudyContextService::class)->hiddenLessonCodesFor($user)
                : [],
        ];
    }

    /**
     * L'état de publication de ce qui N'EST PAS publié, pour le relecteur.
     *
     * Même règle de composition que les fermetures : un code porté par AU
     * MOINS une leçon publiée est publié, il n'apparaît pas ici. Pour un code
     * dont aucune version n'est publiée, on rend l'état le plus « proche » de
     * la publication (masqué avant brouillon avant archivé).
     *
     * @return array{lessons: array<string, string>, modules: array<string, array<int, string>>}
     */
    private static function publicationStatuses(): array
    {
        $rank = [Lesson::PUB_HIDDEN => 0, Lesson::PUB_DRAFT => 1, Lesson::PUB_ARCHIVED => 2];

        $lessons = [];
        foreach (Lesson::query()->get(['code', 'publication_status'])->groupBy('code') as $code => $rows) {
            $states = $rows->pluck('publication_status');
            if ($states->contains(Lesson::PUB_PUBLISHED)) {
                continue;
            }
            $lessons[$code] = $states->sortBy(fn ($s) => $rank[$s] ?? 9)->first();
        }

        $modules = [];
        $rows = LessonModule::query()
            ->join('lessons', 'lessons.id', '=', 'lesson_modules.lesson_id')
            ->where('lesson_modules.publication_status', '!=', LessonModule::PUB_PUBLISHED)
            ->whereNull('lesson_modules.retired_at')
            ->get(['lessons.code as lesson_code', 'lesson_modules.number', 'lesson_modules.publication_status']);
        foreach ($rows as $row) {
            $modules[$row->lesson_code][(int) $row->number] = $row->publication_status;
        }

        return ['lessons' => (object) $lessons, 'modules' => (object) $modules];
    }

    /**
     * Les codes de leçon PAYANTS, indépendamment de qui regarde.
     *
     * Le catalogue vit dans le bundle et peut être en retard sur la base :
     * une leçon rendue payante aujourd'hui y reste « gratuite » jusqu'au
     * prochain déploiement. Cette liste est donc la seule source à jour du
     * palier, et c'est pourquoi elle est servie même à un élève qui a accès
     * à tout.
     *
     * @return string[]
     */
    private static function premiumLessonCodes(): array
    {
        $premium = Lesson::query()
            ->where('tier', AccessTier::PREMIUM)
            ->pluck('code')
            ->unique();

        if ($premium->isEmpty()) {
            return [];
        }

        // Un code porté par AU MOINS une leçon gratuite n'est pas payant —
        // même règle que partout ailleurs dans ce fichier.
        $free = Lesson::query()
            ->whereIn('code', $premium)
            ->where('tier', '!=', AccessTier::PREMIUM)
            ->pluck('code')
            ->unique()
            ->flip();

        return $premium->reject(fn (string $code) => $free->has($code))->values()->all();
    }

    /**
     * Les leçons PUBLIÉES que cet élève n'a pas le droit d'ouvrir.
     *
     * Volontairement séparé de `lessons` (les fermetures de publication),
     * parce que les deux appellent des interfaces différentes : une leçon
     * non publiée n'existe pas pour l'élève, une leçon verrouillée existe et
     * lui dit ce qui lui manque. Les confondre afficherait « indisponible »
     * là où il fallait proposer un abonnement (spec §26).
     *
     * Renvoyé vide si l'élève a un accès premium : dans ce cas il n'y a rien
     * à verrouiller, et la réponse reste courte. Le badge, lui, reste porté
     * par `premium`.
     *
     * @param  string[]  $premiumCodes
     * @return string[]
     */
    private static function lockedLessonCodes(?User $user, array $premiumCodes): array
    {
        // Le catalogue est intégralement gratuit : rien à verrouiller, et
        // aucune question posée aux droits d'accès.
        if ($premiumCodes === []) {
            return [];
        }

        if (app(EntitlementService::class)->satisfies($user, AccessTier::PREMIUM)) {
            return [];
        }

        return $premiumCodes;
    }

    /**
     * Les identifiants d'exercice à retirer d'un inventaire, pour une leçon.
     *
     * Renvoyé en liste plutôt qu'interrogé exercice par exercice : le tirage
     * d'une séance en examine une quinzaine, et quinze requêtes là où une
     * suffit se paierait à chaque ouverture.
     *
     * @return string[]
     */
    public static function hiddenExerciseCodes(string $lessonCode): array
    {
        return PracticeExercise::whereHas('lesson', fn ($q) => $q->where('code', $lessonCode))
            ->where('publication_status', '!=', PracticeExercise::PUB_PUBLISHED)
            ->pluck('exercise_code')
            ->all();
    }
}
