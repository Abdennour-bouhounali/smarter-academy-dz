<?php

namespace App\Http\Controllers\Teacher;

use App\Domain\Classroom\ClassroomProgressService;
use App\Http\Controllers\Controller;
use DomainException;
use Illuminate\Http\Request;

class TeacherClassroomProgressController extends Controller
{
    public function __construct(private ClassroomProgressService $progress) {}

    public function show(Request $request, int $id)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);

        try {
            $summary = $this->progress->classSummary($classroom);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        $students = $summary['students_rows'];
        unset($summary['students_rows']);

        return response()->json(['success' => true, 'summary' => $summary, 'students' => $students]);
    }
}
