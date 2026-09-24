<?php

namespace App\Domain\Classroom;

use App\Domain\Plans\EntitlementKeys;
use App\Domain\Plans\PlanEntitlementResolver;
use App\Domain\Progress\Engine\MasteryState;
use App\Domain\Progress\Support\Freshness;
use App\Models\Classroom;
use App\Models\ClassroomMembership;
use App\Models\LearningPoint;
use App\Models\Lesson;
use App\Models\StudentLearningPointProgress;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;

/**
 * Classe × learning point — ce que les élèves d'un قسم savent de chaque
 * point d'une leçon (Mastery V2, phase 7).
 *
 * Une AGRÉGATION de l'état canonique (student_learning_point_progress),
 * jamais un stockage : une requête GROUP BY par leçon, bornée par
 * (membres × learning points de la leçon). Cadrée sur les leçons EFFECTIVES
 * de la classe (publiées, non masquées) comme le reste de la progression.
 */
class ClassroomLearningPointService
{
    public function __construct(
        private PlanEntitlementResolver $entitlements,
        private ClassroomProgressService $progress,
    ) {}

    /**
     * Par learning point de la leçon : les quatre effectifs, et les
     * « maîtrisé mais périmé ».
     *
     * @return array{lesson: array, learningPoints: array<int, array<string, mixed>>, students: int}
     */
    public function lessonOverview(Classroom $classroom, string $lessonCode): array
    {
        $this->assertFeature($classroom->teacher, EntitlementKeys::PROGRESS_CLASS);
        $lesson = $this->effectiveLesson($classroom, $lessonCode);
        $memberIds = $this->memberIds($classroom);

        $rows = $memberIds === [] ? collect() : DB::table('learning_points as lp')
            ->leftJoin('student_learning_point_progress as s', function ($join) use ($memberIds) {
                $join->on('s.learning_point_id', '=', 'lp.id')->whereIn('s.user_id', $memberIds);
            })
            ->where('lp.lesson_id', $lesson->id)
            ->whereNull('lp.retired_at')
            ->groupBy('lp.id', 'lp.code', 'lp.title', 'lp.order')
            ->orderBy('lp.order')
            ->select('lp.id', 'lp.code', 'lp.title', 'lp.order')
            ->selectRaw('SUM(CASE WHEN s.status = ? THEN 1 ELSE 0 END) as mastered', [MasteryState::STATUS_MASTERED])
            ->selectRaw('SUM(CASE WHEN s.status = ? THEN 1 ELSE 0 END) as reinforce', [MasteryState::STATUS_REINFORCE])
            ->selectRaw('SUM(CASE WHEN s.status = ? THEN 1 ELSE 0 END) as gap', [MasteryState::STATUS_GAP])
            ->selectRaw('SUM(CASE WHEN s.status = ? AND s.status_reason = ? THEN 1 ELSE 0 END) as insufficient_evidence', [MasteryState::STATUS_REINFORCE, MasteryState::REASON_INSUFFICIENT_EVIDENCE])
            ->selectRaw('SUM(CASE WHEN s.status = ? AND s.status_reason = ? THEN 1 ELSE 0 END) as needs_assessment', [MasteryState::STATUS_REINFORCE, MasteryState::REASON_NEEDS_ASSESSMENT])
            ->selectRaw('SUM(CASE WHEN s.status = ? AND COALESCE(s.last_success_at, s.last_evidence_at) < ? THEN 1 ELSE 0 END) as stale_mastered', [MasteryState::STATUS_MASTERED, Freshness::staleCutoff()])
            ->selectRaw('COUNT(s.id) as assessed')
            ->get();

        // Une leçon sans membre : ses points, tous « non évalués ».
        if ($memberIds === []) {
            $rows = LearningPoint::where('lesson_id', $lesson->id)->whereNull('retired_at')->orderBy('order')->get()
                ->map(fn ($lp) => (object) ['id' => $lp->id, 'code' => $lp->code, 'title' => $lp->title, 'order' => $lp->order,
                    'mastered' => 0, 'reinforce' => 0, 'gap' => 0, 'insufficient_evidence' => 0, 'needs_assessment' => 0, 'stale_mastered' => 0, 'assessed' => 0]);
        }

        $students = count($memberIds);

        return [
            'lesson' => ['code' => $lesson->code, 'title' => $lesson->title],
            'students' => $students,
            'learningPoints' => $rows->map(fn ($r) => [
                'code' => $r->code,
                'title' => $r->title,
                'order' => (int) $r->order,
                'counts' => [
                    'mastered' => (int) $r->mastered,
                    'reinforce' => (int) $r->reinforce,
                    'gap' => (int) $r->gap,
                    'unassessed' => $students - (int) $r->assessed,
                ],
                'reasons' => [
                    'insufficientEvidence' => (int) $r->insufficient_evidence,
                    'needsAssessment' => (int) $r->needs_assessment,
                ],
                'staleMastered' => (int) $r->stale_mastered,
            ])->values()->all(),
        ];
    }

    /**
     * Un learning point, élève par élève — les plus fragiles d'abord.
     *
     * @return array{learningPoint: array, lesson: array, students: array<int, array<string, mixed>>}
     */
    public function learningPointDetail(Classroom $classroom, string $learningPointCode): array
    {
        $this->assertFeature($classroom->teacher, EntitlementKeys::PROGRESS_STUDENT);

        $point = LearningPoint::with('lesson:id,code,title')->where('code', $learningPointCode)->whereNull('retired_at')->first();
        if ($point === null || ! in_array($point->lesson_id, $this->progress->effectiveLessonIds($classroom), true)) {
            throw new DomainException('Ce point d\'apprentissage n\'est pas dans le périmètre de la classe.');
        }

        $members = ClassroomMembership::where('classroom_id', $classroom->id)->active()
            ->with('student:id,first_name,last_name,email')
            ->get();
        $states = StudentLearningPointProgress::where('learning_point_id', $point->id)
            ->whereIn('user_id', $members->pluck('student_id'))
            ->get()->keyBy('user_id');

        $order = [MasteryState::STATUS_GAP => 0, MasteryState::STATUS_REINFORCE => 1, MasteryState::STATUS_UNASSESSED => 2, MasteryState::STATUS_MASTERED => 3];

        $students = $members->map(function (ClassroomMembership $m) use ($states) {
            $s = $states->get($m->student_id);

            return [
                'id' => $m->student_id,
                'firstName' => $m->student?->first_name,
                'lastName' => $m->student?->last_name,
                'email' => $m->student?->email,
                'status' => $s?->status ?? MasteryState::STATUS_UNASSESSED,
                'statusReason' => $s?->status_reason,
                'confidence' => $s ? (float) $s->confidence : null,
                'attempts' => (int) ($s?->attempts ?? 0),
                'distinctItemsSuccess' => (int) ($s?->distinct_items_success ?? 0),
                'assessmentSuccessCount' => (int) ($s?->assessment_success_count ?? 0),
                'maxDifficultySuccess' => (int) ($s?->max_difficulty_success ?? 0),
                'lastEvidenceAt' => optional($s?->last_evidence_at)->toIso8601String(),
                'freshness' => $s ? Freshness::of($s->last_evidence_at) : Freshness::STALE,
            ];
        })->sortBy([
            fn ($a, $b) => ($order[$a['status']] ?? 9) <=> ($order[$b['status']] ?? 9),
            fn ($a, $b) => ($a['confidence'] ?? 1) <=> ($b['confidence'] ?? 1),
        ])->values()->all();

        return [
            'learningPoint' => ['code' => $point->code, 'title' => $point->title],
            'lesson' => ['code' => $point->lesson->code, 'title' => $point->lesson->title],
            'students' => $students,
        ];
    }

    /** La leçon, si elle est EFFECTIVE pour la classe ; sinon refus. */
    private function effectiveLesson(Classroom $classroom, string $lessonCode): Lesson
    {
        $lesson = Lesson::where('code', $lessonCode)->first();
        if ($lesson === null || ! in_array($lesson->id, $this->progress->effectiveLessonIds($classroom), true)) {
            throw new DomainException('Cette leçon n\'est pas dans le périmètre de la classe.');
        }

        return $lesson;
    }

    /** @return int[] */
    private function memberIds(Classroom $classroom): array
    {
        return ClassroomMembership::where('classroom_id', $classroom->id)->active()->pluck('student_id')->all();
    }

    private function assertFeature(?User $teacher, string $key): void
    {
        if ($teacher === null || ! $this->entitlements->allows($teacher, $key)) {
            throw new ClassroomException(ClassroomException::FEATURE_UNAVAILABLE, 'Votre offre ne comprend pas cette fonctionnalité.');
        }
    }
}
