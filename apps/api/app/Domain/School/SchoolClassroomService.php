<?php

namespace App\Domain\School;

use App\Domain\Admin\ActivityLogger;
use App\Domain\Classroom\ClassroomException;
use App\Domain\Classroom\ClassroomService;
use App\Domain\Classroom\StudyContextService;
use App\Domain\Classroom\TeacherCapacityService;
use App\Domain\Plans\PlanEntitlementResolver;
use App\Models\Classroom;
use App\Models\ClassroomMembership;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Les CLASSES d'un établissement (SCHOOL_ADMIN_SPACE.md §7, phase 3).
 *
 * Une classe reste la classe de son ENSEIGNANT. La direction peut :
 *   - créer une classe pour un enseignant de l'établissement (même service,
 *     mêmes règles d'offre que si l'enseignant la créait) ;
 *   - la confier à un autre enseignant de l'établissement (ses sièges comptent).
 * L'enseignant, lui, rattache ou détache une de SES classes.
 *
 * Tant que la licence d'établissement n'existe pas (phase 7), les élèves d'une
 * classe d'établissement occupent les sièges de son enseignant.
 */
class SchoolClassroomService
{
    public function __construct(
        private ClassroomService $classrooms,
        private SchoolTeacherService $teachers,
        private TeacherCapacityService $capacity,
        private PlanEntitlementResolver $entitlements,
        private StudyContextService $context,
        private ActivityLogger $logger,
    ) {}

    /** @return array<int, array<string, mixed>> */
    public function list(School $school): array
    {
        $rows = Classroom::with('teacher:id,first_name,last_name')
            ->where('school_id', $school->id)
            ->where('status', Classroom::STATUS_ACTIVE)
            ->withCount(['activeMemberships as members_count'])
            ->orderBy('grade')
            ->orderBy('name')
            ->get();

        $readable = SchoolAccess::consentedMemberships($school)
            ->selectRaw('classroom_memberships.classroom_id, count(*) as c')
            ->groupBy('classroom_memberships.classroom_id')
            ->pluck('c', 'classroom_memberships.classroom_id');

        return $rows->map(fn (Classroom $c) => [
            'id' => $c->id,
            'name' => $c->name,
            'grade' => $c->grade,
            'academicYear' => $c->academic_year,
            'teacher' => $c->teacher ? SchoolAccess::identity($c->teacher) : null,
            // Deux comptes, jamais confondus : les membres, et ceux que
            // l'établissement peut lire (le reste attend leur « oui »).
            'membersCount' => (int) $c->members_count,
            'readableCount' => (int) ($readable[$c->id] ?? 0),
        ])->all();
    }

    /**
     * @param  array{name: string, grade: string, academicYear?: ?string, teacherId: int}  $attrs
     *
     * @throws SchoolException|ClassroomException
     */
    public function create(User $director, School $school, array $attrs): Classroom
    {
        $teacher = $this->teachers->activeTeacher($school, (int) $attrs['teacherId']);

        return DB::transaction(function () use ($director, $school, $teacher, $attrs) {
            $classroom = $this->classrooms->create($teacher, [
                'name' => $attrs['name'],
                'grade' => $attrs['grade'],
                'academicYear' => $attrs['academicYear'] ?? $school->current_academic_year,
            ]);
            $classroom->school_id = $school->id;
            $classroom->save();

            $this->logger->log($director, ActivityLogger::SCHOOL_CLASSROOM_CREATED, 'classroom', $classroom->id, null, [
                'schoolId' => $school->id, 'teacherId' => $teacher->id,
            ]);

            return $classroom;
        });
    }

    /**
     * Confier la classe à un autre enseignant de l'établissement. Ses élèves
     * occupent ses sièges : s'il n'en a pas assez, refus `seats_exhausted`.
     *
     * @throws SchoolException|ClassroomException
     */
    public function reassign(User $director, School $school, int $classroomId, int $teacherId): Classroom
    {
        $classroom = $this->schoolClassroom($school, $classroomId);
        $newTeacher = $this->teachers->activeTeacher($school, $teacherId);
        if ($classroom->teacher_id === $newTeacher->id) {
            return $classroom;
        }

        return DB::transaction(function () use ($director, $school, $classroom, $newTeacher) {
            User::whereKey($newTeacher->id)->lockForUpdate()->first();
            $this->entitlements->forget($newTeacher);

            $students = User::whereIn('id', ClassroomMembership::where('classroom_id', $classroom->id)->active()->pluck('student_id'))->get();
            // Une classe couverte par la licence de l'établissement ne prend
            // aucun siège à l'enseignant (D1).
            $newSeats = $classroom->isCoveredBySchool() ? 0
                : $students->reject(fn (User $s) => $this->capacity->isSeated($newTeacher, $s))->count();
            $remaining = $this->capacity->remainingSeats($newTeacher);
            if ($remaining !== null && $newSeats > $remaining) {
                throw new ClassroomException(ClassroomException::SEATS_EXHAUSTED, 'L\'enseignant n\'a pas assez de places pour cette classe.');
            }

            $previous = $classroom->teacher_id;
            $classroom->teacher_id = $newTeacher->id;
            $classroom->save();

            $this->logger->log($director, ActivityLogger::SCHOOL_CLASSROOM_REASSIGNED, 'classroom', $classroom->id,
                ['teacherId' => $previous], ['teacherId' => $newTeacher->id]);

            $this->entitlements->forget($newTeacher);
            foreach ($students as $s) {
                $this->context->forget($s);
            }

            return $classroom;
        });
    }

    /**
     * L'enseignant rattache (ou détache) une de SES classes à son établissement.
     * Rattacher n'ouvre RIEN sur les élèves déjà membres : chacun le
     * confirmera dans « قسمي ». Détacher efface leur consentement envers
     * l'établissement.
     *
     * @throws SchoolException
     */
    public function setAttached(User $teacher, Classroom $classroom, bool $attached): Classroom
    {
        if (! $attached) {
            if ($classroom->school_id === null) {
                return $classroom;
            }
            $schoolId = $classroom->school_id;
            DB::transaction(function () use ($teacher, $classroom, $schoolId) {
                ClassroomMembership::where('classroom_id', $classroom->id)
                    ->update(['school_consent_at' => null, 'school_consent_by' => null]);
                $classroom->school_id = null;
                $classroom->save();
                $this->logger->log($teacher, ActivityLogger::SCHOOL_CLASSROOM_DETACHED, 'classroom', $classroom->id, ['schoolId' => $schoolId], null);
            });
            $this->forgetMembers($classroom);

            return $classroom;
        }

        $school = SchoolTeacherService::schoolOfTeacher($teacher);
        if ($school === null) {
            throw new SchoolException(SchoolException::NOT_IN_SCHOOL, 'Vous n\'êtes rattaché à aucun établissement.');
        }
        if ($classroom->school_id !== $school->id) {
            $classroom->school_id = $school->id;
            $classroom->save();
            $this->logger->log($teacher, ActivityLogger::SCHOOL_CLASSROOM_ATTACHED, 'classroom', $classroom->id, null, ['schoolId' => $school->id]);
            $this->forgetMembers($classroom);
        }

        return $classroom;
    }

    /**
     * Une classe ACTIVE de cet établissement.
     *
     * @throws SchoolException
     */
    public function schoolClassroom(School $school, int $classroomId): Classroom
    {
        $classroom = Classroom::where('id', $classroomId)
            ->where('school_id', $school->id)
            ->where('status', Classroom::STATUS_ACTIVE)
            ->first();
        if ($classroom === null) {
            throw new SchoolException(SchoolException::CLASS_NOT_IN_SCHOOL, 'Cette classe n\'est pas dans l\'établissement.');
        }

        return $classroom;
    }

    private function forgetMembers(Classroom $classroom): void
    {
        foreach (User::whereIn('id', ClassroomMembership::where('classroom_id', $classroom->id)->active()->pluck('student_id'))->get() as $s) {
            $this->context->forget($s);
        }
    }
}
