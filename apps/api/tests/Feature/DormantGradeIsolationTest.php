<?php

namespace Tests\Feature;

use App\Domain\Access\ContentAccess;
use App\Models\Chapter;
use App\Models\Grade;
use App\Models\Lesson;
use DomainException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Isolement des classes dormantes — pendant SERVEUR du filtre frontend
 * (coursesData.js / registry.js, voir activeGrades.js).
 *
 * config('curriculum.enforce_active_grades') est désactivé pour le reste de
 * la suite (phpunit.xml) parce que les fixtures héritées du français créent
 * des classes ad hoc sans rapport avec l'activation Algérie — ce test
 * l'active explicitement pour vérifier CE mécanisme précis, indépendamment
 * du reste de la suite. Voir docs/ALGERIA_MIGRATION_AUDIT.md §15.
 */
class DormantGradeIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['curriculum.enforce_active_grades' => true]);
    }

    private function createLesson(string $gradeCode, string $lessonCode): Lesson
    {
        $grade = Grade::firstOrCreate(['code' => $gradeCode], ['name' => $gradeCode, 'level' => 'college']);
        $chapter = Chapter::create(['grade_id' => $grade->id, 'code' => 'ch', 'title' => 'Chapitre', 'order' => 0]);

        return Lesson::create([
            'chapter_id' => $chapter->id, 'code' => $lessonCode,
            'title' => 'Leçon', 'status' => 'available', 'order' => 0,
            'publication_status' => Lesson::PUB_PUBLISHED,
        ]);
    }

    public function test_une_lecon_sous_une_classe_dormante_est_fermee_meme_publiee(): void
    {
        config(['curriculum.active_grades' => []]);
        $this->createLesson('seconde', 'fonction-affine-2nde');

        $this->expectException(DomainException::class);
        ContentAccess::assertLessonAvailable('fonction-affine-2nde');
    }

    public function test_une_lecon_sous_une_classe_active_reste_ouverte(): void
    {
        config(['curriculum.active_grades' => ['4am']]);
        $this->createLesson('4am', 'fractions-4am');

        ContentAccess::assertLessonAvailable('fractions-4am');
        $this->assertTrue(true, 'aucune exception attendue');
    }

    /**
     * Même règle de composition que la publication/le palier : un code
     * partagé entre une classe dormante et une classe active reste ouvert.
     */
    public function test_un_code_partage_entre_classe_dormante_et_active_reste_ouvert(): void
    {
        config(['curriculum.active_grades' => ['4am']]);
        $this->createLesson('seconde', 'code-partage');
        $this->createLesson('4am', 'code-partage');

        ContentAccess::assertLessonAvailable('code-partage');
        $this->assertTrue(true, "la version active garde l'accès ouvert malgré l'homonyme dormant");
    }

    public function test_desactiver_le_controle_laisse_passer_toute_classe(): void
    {
        config(['curriculum.enforce_active_grades' => false, 'curriculum.active_grades' => []]);
        $this->createLesson('seconde', 'fonction-affine-2nde');

        ContentAccess::assertLessonAvailable('fonction-affine-2nde');
        $this->assertTrue(true);
    }

    public function test_une_lecon_inconnue_du_registre_reste_accessible_independamment_du_filtre(): void
    {
        config(['curriculum.active_grades' => []]);

        // Même invariant que partout ailleurs dans ContentAccess : la base
        // miroite le contenu, elle n'en est pas l'autorité.
        ContentAccess::assertLessonAvailable('lecon-jamais-importee');
        $this->assertTrue(true);
    }
}
