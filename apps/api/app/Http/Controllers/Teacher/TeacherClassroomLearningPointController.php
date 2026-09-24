<?php

namespace App\Http\Controllers\Teacher;

use App\Domain\Classroom\ClassroomLearningPointService;
use App\Domain\Progress\Explain\MasteryExplainer;
use App\Http\Controllers\Controller;
use App\Models\ClassroomMembership;
use App\Models\LearningPoint;
use DomainException;
use Illuminate\Http\Request;

/**
 * Classe × learning point, en LECTURE SEULE : l'agrégation par leçon, le
 * détail d'un point élève par élève, et l'explication d'un état pour un
 * élève de la classe. Rien n'est écrit, rien n'est copié : chaque réponse
 * est une requête sur l'état canonique.
 */
class TeacherClassroomLearningPointController extends Controller
{
    public function __construct(
        private ClassroomLearningPointService $points,
        private MasteryExplainer $explainer,
    ) {}

    public function index(Request $request, int $id)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);
        $validated = $request->validate(['lesson' => 'required|string|max:120']);

        try {
            $overview = $this->points->lessonOverview($classroom, $validated['lesson']);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true, ...$overview]);
    }

    public function show(Request $request, int $id, string $code)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);

        try {
            $detail = $this->points->learningPointDetail($classroom, $code);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true, ...$detail]);
    }

    public function explanation(Request $request, int $id, int $studentId, string $code)
    {
        $classroom = TeacherClassroomController::ownedClassroom($request, $id);

        $isMember = ClassroomMembership::where('classroom_id', $classroom->id)->where('student_id', $studentId)->exists();
        $point = LearningPoint::where('code', $code)->first();
        if (! $isMember || $point === null) {
            abort(404);
        }

        try {
            // Le même périmètre que le détail : un point hors des leçons
            // effectives de la classe n'est pas lisible par l'enseignant.
            $this->points->learningPointDetail($classroom, $code);
        } catch (DomainException $e) {
            return TeacherClassroomController::refuse($e);
        }

        return response()->json(['success' => true, 'explanation' => $this->explainer->explain($studentId, $point)]);
    }
}
