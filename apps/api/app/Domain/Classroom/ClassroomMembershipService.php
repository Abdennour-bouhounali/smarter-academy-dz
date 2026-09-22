<?php

namespace App\Domain\Classroom;

use App\Domain\Access\EntitlementService;
use App\Domain\Admin\ActivityLogger;
use App\Domain\Plans\EntitlementKeys;
use App\Domain\Plans\PlanEntitlementResolver;
use App\Models\Classroom;
use App\Models\ClassroomInvitation;
use App\Models\ClassroomMembership;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * L'appartenance : rejoindre, quitter, retirer.
 *
 * La CAPACITÉ est vérifiée ICI, au moment de rejoindre, sous verrou de la
 * classe ET de l'enseignant — jamais dans un contrôleur, jamais avec un
 * nombre en dur. Deux limites de nature différente :
 *   — les sièges (TeacherCapacityService) : la capacité COMMERCIALE, comptée
 *     en élèves DISTINCTS chez cet enseignant, toutes classes confondues ;
 *   — les élèves par classe : un garde-fou technique, s'il est configuré.
 * Le verrou sur la ligne de l'enseignant sérialise les adhésions de toutes
 * ses classes : deux élèves qui rejoignent deux classes au même instant ne
 * franchissent pas la capacité ensemble.
 *
 * Retirer ou quitter ne touche à RIEN d'autre que la ligne d'adhésion :
 * progression, tentatives, maîtrise, cahier restent à l'élève.
 */
class ClassroomMembershipService
{
    public function __construct(
        private PlanEntitlementResolver $entitlements,
        private TeacherCapacityService $capacity,
        private EntitlementService $access,
        private StudyContextService $context,
        private ActivityLogger $log,
    ) {}

    /** @throws ClassroomException */
    public function joinByCode(User $student, ?string $rawCode): ClassroomMembership
    {
        $code = JoinCode::normalize($rawCode);
        if ($code === null) {
            throw new ClassroomException(ClassroomException::INVALID, 'Code de classe invalide.');
        }

        $classroom = Classroom::where('join_code', $code)->first();
        if ($classroom === null || ! $classroom->join_code_enabled) {
            throw new ClassroomException(ClassroomException::INVALID, 'Code de classe invalide.');
        }

        return $this->join($student, $classroom, ClassroomMembership::VIA_JOIN_CODE, null);
    }

    /**
     * Rejoindre — le geste commun au code et à l'invitation.
     *
     * @throws ClassroomException
     */
    public function join(User $student, Classroom $classroom, string $via, ?ClassroomInvitation $invitation): ClassroomMembership
    {
        if (! $student->isStudent()) {
            throw new ClassroomException(ClassroomException::NOT_A_STUDENT, 'Seul un compte élève peut rejoindre une classe.');
        }

        return DB::transaction(function () use ($student, $classroom, $via, $invitation) {
            // Verrou sur la classe, puis sur l'ENSEIGNANT : la capacité se
            // compte sur toutes ses classes, donc deux adhésions simultanées
            // dans deux classes différentes doivent aussi se sérialiser.
            $classroom = Classroom::whereKey($classroom->id)->lockForUpdate()->firstOrFail();
            User::whereKey($classroom->teacher_id)->lockForUpdate()->first();

            if (! $classroom->isActive()) {
                throw new ClassroomException(ClassroomException::CLASS_INACTIVE, 'Cette classe n\'accepte plus d\'élèves.');
            }

            $existing = ClassroomMembership::where('classroom_id', $classroom->id)
                ->where('student_id', $student->id)
                ->first();

            if ($existing !== null && $existing->isActive()) {
                throw new ClassroomException(ClassroomException::ALREADY_MEMBER, 'Vous êtes déjà dans cette classe.');
            }

            $teacher = $classroom->teacher;
            $this->assertCapacity($teacher, $classroom, $student);

            $now = Carbon::now();

            if ($existing !== null) {
                // Revenir réactive la ligne : l'histoire « parti en mars,
                // revenu en avril » reste lisible, sans doublon.
                $existing->forceFill([
                    'status' => ClassroomMembership::STATUS_ACTIVE,
                    'joined_at' => $now,
                    'left_at' => null,
                    'joined_via' => $via,
                    'invitation_id' => $invitation?->id,
                    'removed_by' => null,
                ])->save();
                $membership = $existing;
            } else {
                $membership = new ClassroomMembership([
                    'status' => ClassroomMembership::STATUS_ACTIVE,
                    'joined_at' => $now,
                    'joined_via' => $via,
                    'invitation_id' => $invitation?->id,
                ]);
                $membership->classroom_id = $classroom->id;
                $membership->student_id = $student->id;
                $membership->save();
            }

            $this->log->log($student, ActivityLogger::CLASSROOM_MEMBER_JOINED, 'classroom', $classroom->id, null, [
                'student_id' => $student->id, 'via' => $via,
            ]);

            $this->afterChange($student, $teacher);

            return $membership;
        });
    }

    /** L'élève s'en va de lui-même. Son historique reste. */
    public function leave(User $student, Classroom $classroom): ClassroomMembership
    {
        $membership = ClassroomMembership::where('classroom_id', $classroom->id)
            ->where('student_id', $student->id)
            ->where('status', ClassroomMembership::STATUS_ACTIVE)
            ->first();

        if ($membership === null) {
            throw new ClassroomException(ClassroomException::NOT_MEMBER, 'Vous n\'êtes pas dans cette classe.');
        }

        $membership->forceFill(['status' => ClassroomMembership::STATUS_LEFT, 'left_at' => Carbon::now()])->save();

        $this->log->log($student, ActivityLogger::CLASSROOM_MEMBER_LEFT, 'classroom', $classroom->id, null, ['student_id' => $student->id]);

        $this->afterChange($student, $classroom->teacher);

        return $membership;
    }

    /** L'enseignant retire un élève. Son historique reste. */
    public function remove(User $teacher, Classroom $classroom, int $studentId): ClassroomMembership
    {
        $membership = ClassroomMembership::where('classroom_id', $classroom->id)
            ->where('student_id', $studentId)
            ->where('status', ClassroomMembership::STATUS_ACTIVE)
            ->first();

        if ($membership === null) {
            throw new ClassroomException(ClassroomException::NOT_MEMBER, 'Cet élève n\'est pas dans la classe.');
        }

        $membership->forceFill([
            'status' => ClassroomMembership::STATUS_REMOVED,
            'left_at' => Carbon::now(),
            'removed_by' => $teacher->id,
        ])->save();

        $this->log->log($teacher, ActivityLogger::CLASSROOM_MEMBER_REMOVED, 'classroom', $classroom->id, null, ['student_id' => $studentId]);

        $this->afterChange($membership->student, $teacher);

        return $membership;
    }

    /**
     * La classe (technique, si configuré) puis les sièges (commercial).
     *
     * @throws ClassroomException
     */
    private function assertCapacity(User $teacher, Classroom $classroom, User $student): void
    {
        $perClass = $this->entitlements->limit($teacher, EntitlementKeys::STUDENTS_PER_CLASSROOM_MAX);
        if ($perClass !== null) {
            $inClass = ClassroomMembership::where('classroom_id', $classroom->id)->active()->count();
            if ($inClass >= $perClass) {
                throw new ClassroomException(ClassroomException::CLASS_FULL, 'Cette classe est complète.');
            }
        }

        // Un élève déjà assis chez cet enseignant (une autre de ses classes)
        // n'occupe pas un second siège : les sièges se comptent par élève.
        $this->entitlements->forget($teacher);
        $this->capacity->assertCanSeat($teacher, $student);
    }

    /**
     * Ce qu'un changement d'adhésion PÉRIME dans les caches de requête :
     * l'usage de l'enseignant, le contexte d'étude de l'élève, et son droit
     * d'accès (couverture par l'enseignant, modèle B).
     */
    private function afterChange(?User $student, ?User $teacher): void
    {
        if ($teacher !== null) {
            $this->entitlements->forget($teacher);
        }
        if ($student !== null) {
            $this->context->forget($student);
            $this->access->forget($student);
        }
    }
}
