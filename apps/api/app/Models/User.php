<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * `role` is a free-text string, not an enum: 'admin', 'student' ("Élève") and
 * 'teacher' ("Enseignant", added without any migration — exactly the additive
 * path this note used to promise). "Famille" remains a future account type;
 * this is a note on the existing column, not a speculative table.
 */
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    /**
     * Valeurs par défaut au niveau du MODÈLE, et pas seulement de la colonne.
     *
     * Le défaut SQL ne s'applique qu'à la relecture : une instance tout juste
     * créée (inscription, usine de test) porterait sinon account_status =
     * NULL en mémoire, et hasActiveAccount() — écrit en liste blanche — la
     * lirait comme inactive. Le défaut appartient donc ici.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'account_status' => self::STATUS_ACTIVE,
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'grade',
        'account_status',
        'suspended_at',
        'last_activity_at',
        'terms_accepted_version',
        'privacy_policy_accepted_version',
        'legal_consent_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'suspended_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'legal_consent_at' => 'datetime',
        ];
    }

    public const ROLE_ADMIN = 'admin';

    public const ROLE_STUDENT = 'student';

    /**
     * Le compte ENSEIGNANT (« الأستاذ »). Un rôle de plus dans la même
     * colonne libre — aucune migration, comme la note ci-dessus l'annonçait.
     * Il possède des classes (Classroom), jamais du contenu.
     */
    public const ROLE_TEACHER = 'teacher';

    /** Les rôles qu'une inscription publique peut choisir. Jamais admin. */
    public const SELF_REGISTERABLE_ROLES = [self::ROLE_STUDENT, self::ROLE_TEACHER];

    /**
     * Statut de COMPTE — distinct du statut d'abonnement, qui vit dans
     * subscriptions. « Compte actif, abonnement expiré » est valide.
     *
     * active    : accès normal.
     * suspended : accès refusé, temporairement. Les données restent.
     * disabled  : accès refusé, et les jetons sont révoqués. Les données
     *             restent AUSSI — désactiver un compte n'efface jamais un
     *             historique d'apprentissage (spec §2.4).
     */
    public const STATUS_ACTIVE = 'active';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUS_DISABLED = 'disabled';

    public const ACCOUNT_STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_SUSPENDED,
        self::STATUS_DISABLED,
    ];

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isTeacher(): bool
    {
        return $this->role === self::ROLE_TEACHER;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT;
    }

    /**
     * Liste blanche, comme pour la publication : un statut inconnu ferme
     * l'accès, il ne l'ouvre pas.
     */
    public function hasActiveAccount(): bool
    {
        return $this->account_status === self::STATUS_ACTIVE;
    }

    /**
     * Les identités externes (Google) rattachées à ce compte.
     *
     * Une relation, et non une colonne `google_id` : voir la migration
     * create_user_identities_table.
     */
    public function identities(): HasMany
    {
        return $this->hasMany(UserIdentity::class);
    }

    /**
     * L'adresse est-elle prouvée ?
     *
     * Nommée comme le contrat MustVerifyEmail de Laravel (que ce modèle
     * n'implémente pas : il n'y a pas de route web à qui renvoyer un
     * visiteur, cette API ne rend que du JSON), afin que le vocabulaire
     * reste celui que tout le monde connaît.
     */
    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }

    public function getEmailForVerification(): string
    {
        return (string) $this->email;
    }

    /**
     * Marque l'adresse comme prouvée. IDEMPOTENT : vérifier deux fois n'est
     * pas une erreur, et la date du PREMIER passage est celle qui compte —
     * la réécrire effacerait l'information utile.
     */
    public function markEmailAsVerified(): bool
    {
        if ($this->hasVerifiedEmail()) {
            return false;
        }

        $this->forceFill(['email_verified_at' => now()])->save();

        return true;
    }

    /**
     * Ce compte peut-il se connecter par mot de passe ?
     *
     * Faux pour un compte créé par Google, qui n'en a pas (NULL, et non un
     * secret aléatoire — voir la migration qui rend la colonne facultative).
     */
    public function hasPassword(): bool
    {
        return $this->password !== null && $this->password !== '';
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Les droits d'accès — distincts des abonnements.
     *
     * subscriptions retrace ce qui a été VENDU (et le sera un jour par un
     * fournisseur de paiement) ; entitlements dit ce qui est OUVERT
     * aujourd'hui. Les deux se ressemblent assez pour qu'on soit tenté de les
     * fusionner, et diffèrent sur le cas qui compte : une dérogation
     * d'administration ouvre l'accès sans qu'aucun abonnement n'existe, et un
     * remboursement ferme l'accès sans effacer l'abonnement.
     */
    public function entitlements(): HasMany
    {
        return $this->hasMany(Entitlement::class);
    }

    /**
     * L'abonnement qui fait foi : le plus récemment commencé. Il n'y a pas
     * de contrainte d'unicité en base — un renouvellement crée une ligne —
     * donc « l'abonnement de l'élève » se choisit, il ne se suppose pas.
     */
    public function currentSubscription(): ?Subscription
    {
        return $this->subscriptions()
            ->orderByRaw('started_at IS NULL')
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->first();
    }

    /**
     * L'abonnement qui COURT — celui dont découlent les limites d'offre.
     *
     * Distinct de currentSubscription() (le plus récent, quel que soit son
     * état) : ici on ne retient qu'un abonnement qui ouvre encore quelque
     * chose, rattaché à une version d'offre. Sans lui, l'utilisateur est sur
     * l'offre par défaut de son type — le gratuit, sans aucune ligne.
     */
    public function runningSubscription(): ?Subscription
    {
        $now = now();

        return $this->subscriptions()
            ->whereNotNull('plan_version_id')
            ->orderByRaw('started_at IS NULL')
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->get()
            ->first(fn (Subscription $s) => $s->isRunning($now));
    }

    /** Les classes que ce compte POSSÈDE (enseignant). */
    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'teacher_id');
    }

    /** Les classes que ce compte a REJOINTES (élève). */
    public function classroomMemberships(): HasMany
    {
        return $this->hasMany(ClassroomMembership::class, 'student_id');
    }

    public function planEntitlementOverrides(): HasMany
    {
        return $this->hasMany(PlanEntitlementOverride::class);
    }

    public function subscriptionRequests(): HasMany
    {
        return $this->hasMany(SubscriptionRequest::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(StudentReport::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(StudentLessonProgress::class);
    }

    public function diagnosticSessions(): HasMany
    {
        return $this->hasMany(DiagnosticSession::class);
    }

    /** Le travail libre de l'élève dans le مختبر الرياضيات (Math Lab). */
    public function mathLabDocuments(): HasMany
    {
        return $this->hasMany(MathLabDocument::class);
    }
}
