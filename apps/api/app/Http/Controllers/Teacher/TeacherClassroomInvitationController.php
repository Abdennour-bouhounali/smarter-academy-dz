<?php

namespace App\Http\Controllers\Teacher;

use App\Domain\Classroom\ClassroomInvitationService;
use App\Http\Controllers\Controller;
use App\Models\ClassroomInvitation;
use DomainException;
use Illuminate\Http\Request;

class TeacherClassroomInvitationController extends Controller
{
    public function __construct(private ClassroomInvitationService $invitations) {}

    public function index(Request $request, int $id)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);

        return response()->json([
            'success' => true,
            'invitations' => $classroom->invitations()->orderByDesc('id')->get()->map(fn (ClassroomInvitation $i) => self::serialize($i))->values(),
        ]);
    }

    public function store(Request $request, int $id)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id, 'manage');

        $validated = $request->validate(['email' => 'required|email|max:190']);

        try {
            $result = $this->invitations->create($request->user(), $classroom, strtolower($validated['email']));
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json([
            'success' => true,
            'invitation' => self::serialize($result['invitation']),
            // Le lien, rendu UNE fois à l'enseignant pour qu'il puisse aussi
            // le transmettre lui-même (WhatsApp, papier) : la base n'en garde
            // que l'empreinte.
            'joinUrl' => ClassroomInvitationService::urlFor($result['token']),
        ], 201);
    }

    public function destroy(Request $request, int $id, int $invitationId)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id, 'manage');

        try {
            $invitation = $this->invitations->revoke($request->user(), $classroom, $invitationId);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true, 'invitation' => self::serialize($invitation)]);
    }

    /** @return array<string, mixed> */
    public static function serialize(ClassroomInvitation $i): array
    {
        return [
            'id' => $i->id,
            'email' => $i->email,
            'hint' => $i->token_hint,
            'status' => $i->effectiveStatus(),
            'expiresAt' => optional($i->expires_at)->toIso8601String(),
            'acceptedAt' => optional($i->accepted_at)->toIso8601String(),
            'acceptedBy' => $i->accepted_by,
            'createdAt' => optional($i->created_at)->toIso8601String(),
        ];
    }
}
