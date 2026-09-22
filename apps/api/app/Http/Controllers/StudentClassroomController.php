<?php

namespace App\Http\Controllers;

use App\Domain\Access\EntitlementService;
use App\Domain\Classroom\ClassroomException;
use App\Domain\Classroom\ClassroomInvitationService;
use App\Domain\Classroom\ClassroomMembershipService;
use App\Domain\Classroom\StudyContextService;
use App\Models\Classroom;
use DomainException;
use Illuminate\Http\Request;

/**
 * L'élève et sa classe : « où j'étudie », rejoindre (code ou invitation),
 * quitter. L'élève est toujours `$request->user()` ; rejoindre ne prend
 * qu'un code ou un jeton, jamais un identifiant de classe.
 */
class StudentClassroomController extends Controller
{
    public function __construct(
        private StudyContextService $context,
        private ClassroomMembershipService $memberships,
        private ClassroomInvitationService $invitations,
        private EntitlementService $access,
    ) {}

    public function context(Request $request)
    {
        return response()->json(['success' => true, 'studyContext' => $this->context->resolve($request->user())]);
    }

    public function join(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:16',
            'token' => 'nullable|string|max:64',
        ]);

        if (empty($validated['code']) && empty($validated['token'])) {
            return response()->json(['success' => false, 'reason' => ClassroomException::INVALID, 'message' => 'Code ou invitation manquant.'], 422);
        }

        try {
            $membership = ! empty($validated['token'])
                ? $this->invitations->accept($request->user(), $validated['token'])
                : $this->memberships->joinByCode($request->user(), $validated['code']);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'reason' => $e instanceof ClassroomException ? $e->reason : null,
                'message' => $e->getMessage(),
            ], 422);
        }

        $this->context->forget($request->user());

        return response()->json([
            'success' => true,
            'classroomId' => $membership->classroom_id,
            'studyContext' => $this->context->resolve($request->user()),
            'access' => $this->access->summarize($request->user()),
        ], 201);
    }

    public function leave(Request $request, int $id)
    {
        $classroom = Classroom::find($id);
        if ($classroom === null) {
            abort(404);
        }

        try {
            $this->memberships->leave($request->user(), $classroom);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'reason' => $e instanceof ClassroomException ? $e->reason : null,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'studyContext' => $this->context->resolve($request->user()),
            'access' => $this->access->summarize($request->user()),
        ]);
    }
}
