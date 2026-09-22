<?php

namespace App\Http\Controllers\Teacher;

use App\Domain\Classroom\ClassroomMembershipService;
use App\Domain\Classroom\ClassroomProgressService;
use App\Http\Controllers\Controller;
use App\Models\ClassroomMembership;
use App\Models\User;
use DomainException;
use Illuminate\Http\Request;

/**
 * Les élèves d'une classe : la liste avec leur progression, le dossier de
 * l'un d'eux, le retrait. L'élève est toujours résolu PAR la classe
 * possédée — jamais par un identifiant libre.
 */
class TeacherClassroomStudentController extends Controller
{
    public function __construct(
        private ClassroomProgressService $progress,
        private ClassroomMembershipService $memberships,
    ) {}

    public function index(Request $request, int $id)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);

        return response()->json(['success' => true, 'students' => $this->progress->studentList($classroom)]);
    }

    public function progress(Request $request, int $id, int $studentId)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);
        $student = $this->memberOf($classroom->id, $studentId);

        try {
            $detail = $this->progress->studentDetail($classroom, $student);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true, ...$detail]);
    }

    public function destroy(Request $request, int $id, int $studentId)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id, 'manage');

        try {
            $this->memberships->remove($request->user(), $classroom, $studentId);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true]);
    }

    /** Un élève de CETTE classe (adhésion présente, quel que soit son état), sinon 404. */
    private function memberOf(int $classroomId, int $studentId): User
    {
        $member = ClassroomMembership::where('classroom_id', $classroomId)->where('student_id', $studentId)->exists();
        $student = $member ? User::find($studentId) : null;
        if ($student === null) {
            abort(404);
        }

        return $student;
    }
}
