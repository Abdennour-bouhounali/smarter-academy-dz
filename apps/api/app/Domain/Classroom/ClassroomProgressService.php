<?php

namespace App\Domain\Classroom;

use App\Domain\Plans\EntitlementKeys;
use App\Domain\Plans\PlanEntitlementResolver;
use App\Domain\Progress\StudentDossier;
use App\Models\Classroom;
use App\Models\ClassroomLesson;
use App\Models\ClassroomMembership;
use App\Models\Grade;
use App\Models\Lesson;
use App\Models\StudentLessonProgress;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * La progression VUE PAR L'ENSEIGNANT — une agrégation, jamais un stockage.
 *
 * Tout vient des tables d'apprentissage de l'élève (student_lesson_progress,
 * question_attempts ⋈ practice_sessions, users.last_activity_at), cadrées
 * sur les leçons EFFECTIVES de la classe : publiées ET non masquées. Rien
 * n'est recopié dans une table de classe ; retirer un élève ne détruit rien.
 *
 * Le cahier de l'élève (كرّاسي) n'apparaît nulle part ici.
 */
class ClassroomProgressService
{
    public function __construct(private PlanEntitlementResolver $entitlements) {}

    /**
     * Le tableau de la classe : un résumé, et une ligne par élève.
     *
     * @return array<string, mixed>
     */
    public function classSummary(Classroom $classroom): array
    {
        $this->assertFeature($classroom->teacher, EntitlementKeys::PROGRESS_CLASS);

        $lessonIds = $this->effectiveLessonIds($classroom);
        $members = $this->members($classroom);
        $rows = $this->studentRows($members, $lessonIds);

        $count = $rows->count();
        $window = Carbon::now()->subDays((int) config('classroom.active_window_days', 7));

        return [
            'lessonsInScope' => count($lessonIds),
            'students' => $count,
            'activeStudents' => $rows->filter(fn ($r) => $r['lastActivityAt'] !== null && Carbon::parse($r['lastActivityAt'])->greaterThan($window))->count(),
            'averageProgress' => $count > 0 ? round($rows->avg('progressPercent'), 1) : null,
            'lessonsCompleted' => $rows->sum('lessonsCompleted'),
            'averageSuccessRate' => $rows->whereNotNull('successRate')->isEmpty() ? null : round($rows->whereNotNull('successRate')->avg('successRate'), 1),
            'students_rows' => $rows->values()->all(),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public function studentList(Classroom $classroom): array
    {
        $lessonIds = $this->effectiveLessonIds($classroom);

        return $this->studentRows($this->members($classroom), $lessonIds)->values()->all();
    }

    /**
     * Le dossier d'UN élève de la classe, cadré sur les leçons effectives.
     *
     * @return array<string, mixed>
     */
    public function studentDetail(Classroom $classroom, User $student): array
    {
        $this->assertFeature($classroom->teacher, EntitlementKeys::PROGRESS_STUDENT);

        $lessonIds = $this->effectiveLessonIds($classroom);
        $profile = StudentDossier::profile($student, $lessonIds);
        $membership = ClassroomMembership::where('classroom_id', $classroom->id)->where('student_id', $student->id)->first();

        return [
            'student' => [
                'id' => $student->id,
                'firstName' => $student->first_name,
                'lastName' => $student->last_name,
                'email' => $student->email,
                'grade' => $student->grade,
                'lastActivityAt' => optional($student->last_activity_at)->toIso8601String(),
                'joinedAt' => optional($membership?->joined_at)->toIso8601String(),
                'membershipStatus' => $membership?->status,
            ],
            'scope' => ['lessonsInScope' => count($lessonIds)],
            'learning' => [
                'lessonsStarted' => $profile['lessonsStarted'],
                'lessonsCompleted' => $profile['lessonsCompleted'],
                'modulesCompleted' => $profile['modulesCompleted'],
                'exerciseAttempts' => $profile['exerciseAttempts'],
                'questionsAnswered' => $profile['questionsAnswered'],
                'correctAnswers' => $profile['correctAnswers'],
                'successRate' => $profile['successRate'],
                'hintsUsed' => $profile['hintsUsed'],
                'evidenceCount' => $profile['evidenceCount'],
                'masteryCounts' => $profile['masteryCounts'],
                'progressPercent' => count($lessonIds) > 0 ? round($profile['lessonsCompleted'] / count($lessonIds) * 100) : null,
            ],
            'progress' => $profile['progress']->map(fn ($p) => [
                'lessonCode' => $p->lesson?->code,
                'lessonTitle' => $p->lesson?->title,
                'status' => $p->status,
                'currentModule' => $p->current_module,
                'completedModules' => $p->completed_modules,
                'lastActivityAt' => optional($p->last_activity_at)->toIso8601String(),
                'completedAt' => optional($p->completed_at)->toIso8601String(),
            ])->values()->all(),
            'mastery' => $profile['mastery']->map(fn ($m) => [
                'code' => $m->learningPoint?->code,
                'title' => $m->learningPoint?->title,
                'status' => $m->status,
                'confidence' => (float) $m->confidence,
                'attempts' => $m->attempts,
                'correctCount' => $m->correct_count,
                'lastEvidenceAt' => optional($m->last_evidence_at)->toIso8601String(),
            ])->values()->all(),
            'timeline' => StudentDossier::timeline($student, 30, $lessonIds),
        ];
    }

    /**
     * Les leçons que les élèves de cette classe voient VRAIMENT : celles de
     * la classe scolaire, publiées, non masquées par l'enseignant.
     *
     * @return int[]
     */
    public function effectiveLessonIds(Classroom $classroom): array
    {
        $gradeId = Grade::where('code', $classroom->grade)->value('id');
        if ($gradeId === null) {
            return [];
        }

        $hidden = ClassroomLesson::where('classroom_id', $classroom->id)
            ->where('status', ClassroomLesson::STATUS_HIDDEN)
            ->pluck('lesson_id');

        return Lesson::whereHas('chapter', fn ($q) => $q->where('grade_id', $gradeId))
            ->visibleToStudents()
            ->whereNotIn('id', $hidden)
            ->pluck('id')
            ->all();
    }

    /** @return Collection<int, ClassroomMembership> */
    private function members(Classroom $classroom): Collection
    {
        return ClassroomMembership::where('classroom_id', $classroom->id)
            ->active()
            ->with('student:id,first_name,last_name,email,grade,last_activity_at')
            ->orderBy('joined_at')
            ->get();
    }

    /**
     * Une ligne par élève, calculée en DEUX requêtes groupées (progression,
     * réponses) et non une par élève.
     *
     * @param  Collection<int, ClassroomMembership>  $members
     * @param  int[]  $lessonIds
     * @return Collection<int, array<string, mixed>>
     */
    private function studentRows(Collection $members, array $lessonIds): Collection
    {
        $studentIds = $members->pluck('student_id')->all();
        $total = count($lessonIds);

        $progressByStudent = collect();
        $answersByStudent = collect();

        if ($studentIds !== [] && $lessonIds !== []) {
            $progressByStudent = StudentLessonProgress::whereIn('user_id', $studentIds)
                ->whereIn('lesson_id', $lessonIds)
                ->get(['user_id', 'lesson_id', 'status', 'completed_modules', 'last_activity_at'])
                ->groupBy('user_id');

            $answersByStudent = DB::table('question_attempts')
                ->join('exercise_attempts', 'exercise_attempts.id', '=', 'question_attempts.exercise_attempt_id')
                ->join('practice_sessions', 'practice_sessions.id', '=', 'exercise_attempts.practice_session_id')
                ->whereIn('question_attempts.user_id', $studentIds)
                ->whereIn('practice_sessions.lesson_id', $lessonIds)
                ->groupBy('question_attempts.user_id')
                ->select('question_attempts.user_id')
                ->selectRaw('COUNT(*) as answered')
                ->selectRaw('SUM(CASE WHEN question_attempts.outcome = ? THEN 1 ELSE 0 END) as correct', ['correct'])
                ->get()
                ->keyBy('user_id');
        }

        return $members->map(function (ClassroomMembership $m) use ($progressByStudent, $answersByStudent, $total) {
            $student = $m->student;
            $progress = $progressByStudent->get($m->student_id, collect());
            $completed = $progress->where('status', StudentLessonProgress::STATUS_COMPLETED)->count();
            $answers = $answersByStudent->get($m->student_id);
            $answered = (int) ($answers->answered ?? 0);

            return [
                'id' => $m->student_id,
                'firstName' => $student?->first_name,
                'lastName' => $student?->last_name,
                'email' => $student?->email,
                'grade' => $student?->grade,
                'joinedAt' => optional($m->joined_at)->toIso8601String(),
                'joinedVia' => $m->joined_via,
                'lastActivityAt' => optional($student?->last_activity_at)->toIso8601String(),
                'lessonsStarted' => $progress->count(),
                'lessonsCompleted' => $completed,
                'modulesCompleted' => $progress->sum(fn ($row) => count($row->completed_modules ?? [])),
                'progressPercent' => $total > 0 ? round($completed / $total * 100) : null,
                'questionsAnswered' => $answered,
                'successRate' => $answered > 0 ? round((int) $answers->correct / $answered * 100, 1) : null,
            ];
        });
    }

    private function assertFeature(?User $teacher, string $key): void
    {
        if ($teacher === null || ! $this->entitlements->allows($teacher, $key)) {
            throw new ClassroomException(ClassroomException::FEATURE_UNAVAILABLE, 'Votre offre ne comprend pas cette fonctionnalité.');
        }
    }
}
