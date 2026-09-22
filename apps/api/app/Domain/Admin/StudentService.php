<?php

namespace App\Domain\Admin;

use App\Domain\Progress\StudentDossier;
use App\Models\StudentLessonProgress;
use App\Models\User;
use DomainException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Les élèves vus par l'administration.
 *
 * Tout ce qui est affiché ici est DÉRIVÉ des tables d'apprentissage
 * existantes — progression, preuves, maîtrise, tentatives. Aucune colonne
 * « points faibles » n'est maintenue en double : la maîtrise a déjà un
 * propriétaire (ProgressEngine / student_learning_point_progress), et en
 * tenir une seconde copie garantirait qu'elles divergent.
 */
class StudentService
{
    public function __construct(private ActivityLogger $log) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = User::query()
            ->where('role', User::ROLE_STUDENT)
            ->withCount([
                'lessonProgress as lessons_started_count',
                'lessonProgress as lessons_completed_count' => fn ($q) => $q->where('status', StudentLessonProgress::STATUS_COMPLETED),
                'reports as reports_count',
            ])
            ->with(['subscriptions' => fn ($q) => $q->orderByDesc('started_at')->limit(1)]);

        if ($search = ($filters['search'] ?? null)) {
            $query->where(fn ($q) => $q
                ->where('email', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('id', $search));
        }

        if ($grade = ($filters['grade'] ?? null)) {
            $query->where('grade', $grade);
        }

        if ($status = ($filters['status'] ?? null)) {
            $query->where('account_status', $status);
        }

        if ($subscription = ($filters['subscription'] ?? null)) {
            $query->whereHas('subscriptions', fn ($q) => $q->where('status', $subscription));
        }

        // « Actif depuis » : une date, pas un booléen — le seuil appartient à
        // celui qui regarde, pas à ce service.
        if ($since = ($filters['activeSince'] ?? null)) {
            $query->where('last_activity_at', '>=', $since);
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = ($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $sortable = ['created_at', 'last_activity_at', 'email', 'grade', 'account_status', 'lessons_completed_count'];
        $query->orderBy(in_array($sort, $sortable, true) ? $sort : 'created_at', $direction);

        return $query->paginate(min((int) ($filters['perPage'] ?? 25), 100));
    }

    public function find(int $id): User
    {
        $student = User::where('role', User::ROLE_STUDENT)->find($id);

        if (! $student) {
            throw new DomainException('Élève introuvable.');
        }

        return $student;
    }

    /**
     * Le dossier d'apprentissage complet d'un élève — calculé par
     * App\Domain\Progress\StudentDossier, partagé avec l'enseignant.
     *
     * @return array<string, mixed>
     */
    public function profile(User $student): array
    {
        return StudentDossier::profile($student);
    }

    /** @return array<int, array<string, mixed>> */
    public function timeline(User $student, int $limit = 50): array
    {
        return StudentDossier::timeline($student, $limit);
    }

    /**
     * Change le statut d'un compte élève — par AccountStatusService, partagé
     * avec les enseignants : une seule règle « désactiver révoque les jetons,
     * suspendre les garde, rien ne touche l'apprentissage ».
     */
    public function changeStatus(User $admin, int $studentId, string $status): User
    {
        return app(AccountStatusService::class)->change($admin, $this->find($studentId), $status, ActivityLogger::STUDENT_STATUS, 'student');
    }
}
