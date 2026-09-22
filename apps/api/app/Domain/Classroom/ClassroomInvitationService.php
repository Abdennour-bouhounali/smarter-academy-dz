<?php

namespace App\Domain\Classroom;

use App\Domain\Admin\ActivityLogger;
use App\Domain\Plans\EntitlementKeys;
use App\Domain\Plans\PlanEntitlementResolver;
use App\Models\Classroom;
use App\Models\ClassroomInvitation;
use App\Models\ClassroomMembership;
use App\Models\User;
use App\Notifications\ClassroomInvitationNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

/**
 * Les invitations nominatives : créer (et envoyer), révoquer, prévisualiser,
 * accepter. Le jeton est le secret ; l'adresse n'est qu'une destination.
 */
class ClassroomInvitationService
{
    public function __construct(
        private PlanEntitlementResolver $entitlements,
        private ClassroomMembershipService $memberships,
        private ActivityLogger $log,
    ) {}

    /**
     * @return array{invitation: ClassroomInvitation, token: string}
     *
     * @throws ClassroomException
     */
    public function create(User $teacher, Classroom $classroom, string $email): array
    {
        if (! $classroom->isActive()) {
            throw new ClassroomException(ClassroomException::CLASS_INACTIVE, 'Cette classe n\'accepte plus d\'élèves.');
        }

        return DB::transaction(function () use ($teacher, $classroom, $email) {
            $max = $this->entitlements->limit($teacher, EntitlementKeys::INVITATIONS_ACTIVE_MAX);
            if ($max !== null) {
                $open = ClassroomInvitation::whereIn('classroom_id', Classroom::ownedBy($teacher)->countingTowardsLimit()->select('id'))
                    ->open()
                    ->lockForUpdate()
                    ->count();
                if ($open >= $max) {
                    throw new ClassroomException(ClassroomException::LIMIT_REACHED, 'Votre offre ne permet pas d\'invitation supplémentaire en attente.');
                }
            }

            // Une invitation en attente pour la même adresse dans la même
            // classe est remplacée : deux liens valides pour une personne
            // n'apportent rien et compliquent la révocation.
            ClassroomInvitation::where('classroom_id', $classroom->id)
                ->where('email', $email)
                ->where('status', ClassroomInvitation::STATUS_PENDING)
                ->update(['status' => ClassroomInvitation::STATUS_REVOKED, 'revoked_at' => Carbon::now(), 'revoked_by' => $teacher->id]);

            $token = InvitationToken::generate();

            $invitation = new ClassroomInvitation([
                'email' => $email,
                'token_hash' => InvitationToken::hash($token),
                'token_hint' => InvitationToken::hint($token),
                'status' => ClassroomInvitation::STATUS_PENDING,
                'expires_at' => Carbon::now()->addDays((int) config('classroom.invitation_ttl_days', 14)),
                'invited_by' => $teacher->id,
            ]);
            $invitation->classroom_id = $classroom->id;
            $invitation->save();

            $this->log->log($teacher, ActivityLogger::CLASSROOM_INVITATION_CREATED, 'classroom', $classroom->id, null, [
                'invitation_id' => $invitation->id, 'email' => $email,
            ]);

            Notification::route('mail', $email)->notify(new ClassroomInvitationNotification(
                $classroom->name,
                trim(($teacher->first_name ?? '').' '.($teacher->last_name ?? '')),
                self::urlFor($token),
                $invitation->expires_at,
            ));

            return ['invitation' => $invitation, 'token' => $token];
        });
    }

    public function revoke(User $teacher, Classroom $classroom, int $invitationId): ClassroomInvitation
    {
        $invitation = $classroom->invitations()->whereKey($invitationId)->first();

        if ($invitation === null) {
            throw new ClassroomException(ClassroomException::INVALID, 'Invitation introuvable.');
        }

        if ($invitation->status === ClassroomInvitation::STATUS_PENDING) {
            $invitation->forceFill([
                'status' => ClassroomInvitation::STATUS_REVOKED,
                'revoked_at' => Carbon::now(),
                'revoked_by' => $teacher->id,
            ])->save();

            $this->log->log($teacher, ActivityLogger::CLASSROOM_INVITATION_REVOKED, 'classroom', $classroom->id, null, [
                'invitation_id' => $invitation->id,
            ]);
        }

        return $invitation;
    }

    /**
     * Ce qu'un visiteur peut savoir d'une invitation AVANT d'avoir un compte :
     * le nom de la classe, la classe scolaire, le nom de l'enseignant. Rien
     * d'autre — et rien du tout si le jeton n'est pas acceptable.
     *
     * @return array{classroomName: string, grade: string, teacherName: string, email: string, expiresAt: ?string}
     *
     * @throws ClassroomException
     */
    public function preview(?string $token): array
    {
        $invitation = $this->acceptable($token);
        $classroom = $invitation->classroom;
        $teacher = $classroom->teacher;

        return [
            'classroomName' => $classroom->name,
            'grade' => $classroom->grade,
            'teacherName' => trim(($teacher?->first_name ?? '').' '.($teacher?->last_name ?? '')),
            'email' => $invitation->email,
            'expiresAt' => optional($invitation->expires_at)->toIso8601String(),
        ];
    }

    /**
     * Accepter : une seule fois, par un compte élève. L'adhésion naît ici.
     *
     * @throws ClassroomException
     */
    public function accept(User $student, ?string $token): ClassroomMembership
    {
        return DB::transaction(function () use ($student, $token) {
            $invitation = $this->acceptable($token, lock: true);

            $membership = $this->memberships->join($student, $invitation->classroom, ClassroomMembership::VIA_INVITATION, $invitation);

            $invitation->forceFill([
                'status' => ClassroomInvitation::STATUS_ACCEPTED,
                'accepted_at' => Carbon::now(),
                'accepted_by' => $student->id,
            ])->save();

            $this->log->log($student, ActivityLogger::CLASSROOM_INVITATION_ACCEPTED, 'classroom', $invitation->classroom_id, null, [
                'invitation_id' => $invitation->id,
            ]);

            return $membership;
        });
    }

    public static function urlFor(string $token): string
    {
        return str_replace('{token}', $token, (string) config('classroom.invitation_url'));
    }

    /** @throws ClassroomException */
    private function acceptable(?string $token, bool $lock = false): ClassroomInvitation
    {
        if (! InvitationToken::isWellFormed($token)) {
            throw new ClassroomException(ClassroomException::INVALID, 'Invitation invalide.');
        }

        $query = ClassroomInvitation::where('token_hash', InvitationToken::hash($token))->with('classroom.teacher');
        $invitation = $lock ? $query->lockForUpdate()->first() : $query->first();

        if ($invitation === null) {
            throw new ClassroomException(ClassroomException::INVALID, 'Invitation invalide.');
        }

        return match ($invitation->effectiveStatus()) {
            ClassroomInvitation::STATUS_REVOKED => throw new ClassroomException(ClassroomException::REVOKED, 'Cette invitation a été retirée.'),
            ClassroomInvitation::STATUS_ACCEPTED => throw new ClassroomException(ClassroomException::INVALID, 'Cette invitation a déjà été utilisée.'),
            ClassroomInvitation::STATUS_EXPIRED => throw new ClassroomException(ClassroomException::EXPIRED, 'Cette invitation a expiré.'),
            default => $invitation,
        };
    }
}
