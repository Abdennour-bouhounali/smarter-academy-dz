<?php

namespace Tests\Feature;

use App\Domain\Madar\SniperScoring;
use App\Models\Classroom;
use App\Models\MadarProfile;
use App\Models\MadarRun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\Support\CommercialFixtures;
use Tests\Support\DailyChallengeFixtures;
use Tests\Support\LearningFixtures;
use Tests\TestCase;

/**
 * « قنّاص القيم », le jeu de mathématiques de « فضاء الألعاب » : gratuit (aucun
 * cœur, aucune reprise), mais compté dans la limite de parties du jour ; les
 * cibles de la semaine communes à la classe ; la manche et le score bornés par
 * la durée ; son propre classement. Et la fermeture d'un jeu pour UN élève.
 */
class MadarSniperTest extends TestCase
{
    use CommercialFixtures;
    use DailyChallengeFixtures;
    use LearningFixtures;
    use RefreshDatabase;

    private Classroom $classroom;

    /** @var User[] */
    private array $students;

    protected function setUp(): void
    {
        parent::setUp();
        $this->onChallengeDay();
        $this->challengeCurriculum();
        $this->classroom = Classroom::factory()->create(['grade' => '4am']);
        $this->students = [$this->student(['first_name' => 'Amine', 'last_name' => 'Benali']), $this->student(['first_name' => 'Sara', 'last_name' => 'Haddad'])];
        $this->enrol($this->classroom, $this->students);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function as(User $user, string $method, string $uri, array $body = [])
    {
        return $this->withToken($this->tokenOf($user))->json($method, "/api/v1{$uri}", $body);
    }

    private function asTeacher(string $method, string $uri, array $body = [])
    {
        return $this->withToken($this->tokenOf($this->classroom->teacher))->json($method, "/api/v1/teacher/classrooms/{$this->classroom->id}{$uri}", $body);
    }

    private function snipe(User $student, int $seconds, int $score, int $round, int $hits = 0)
    {
        $id = $this->as($student, 'POST', '/madar/runs', ['game' => 'sniper'])->assertCreated()->assertJsonPath('run.game', 'sniper')->json('run.id');
        $now = now();
        Carbon::setTestNow($now->copy()->addSeconds($seconds));
        $res = $this->as($student, 'POST', "/madar/runs/{$id}/finish", ['score' => $score, 'stars' => $hits, 'wave' => $round]);
        Carbon::setTestNow($now->copy()->addSeconds($seconds + 1));

        return $res;
    }

    public function test_it_is_a_free_math_game(): void
    {
        $games = collect($this->as($this->students[0], 'GET', '/madar')->assertOk()->json('games'))->keyBy('id');
        $this->assertSame('math', $games['sniper']['category']);
        $this->assertTrue($games['sniper']['free']);
        $this->assertSame('fun', $games['orbit']['category']);
        $this->assertFalse($games['orbit']['free']);

        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertCreated()->assertJsonPath('hearts', 3);
        MadarProfile::where('user_id', $this->students[0]->id)->update(['hearts' => 0]);
        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertCreated()->assertJsonPath('hearts', 0);
        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'orbit'])->assertStatus(422)->assertJsonPath('reason', 'no_hearts');
    }

    public function test_it_has_no_revive_and_counts_in_the_daily_cap(): void
    {
        $id = $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->json('run.id');
        $this->as($this->students[0], 'POST', "/madar/runs/{$id}/revive")->assertStatus(422)->assertJsonPath('reason', 'revive_limit');
        $this->assertSame(3, (int) MadarProfile::where('user_id', $this->students[0]->id)->value('hearts'));

        $this->asTeacher('PATCH', '/madar/settings', ['dailyRunCap' => 5])->assertOk();
        for ($i = 1; $i < 5; $i++) {
            $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertCreated();
        }
        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertStatus(422)->assertJsonPath('reason', 'daily_cap');
    }

    public function test_the_week_targets_are_the_same_for_the_whole_class(): void
    {
        $a = $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->json('run.seed');
        $b = $this->as($this->students[1], 'POST', '/madar/runs', ['game' => 'sniper'])->json('run.seed');
        $defense = $this->as($this->students[1], 'POST', '/madar/runs', ['game' => 'defense'])->json('run.seed');
        $this->assertSame($a, $b);
        $this->assertNotSame($a, $defense, 'chaque jeu a sa propre graine de la semaine');

        Carbon::setTestNow(now()->addWeek());
        $this->assertNotSame($a, $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->json('run.seed'));
    }

    public function test_a_plausible_result_is_kept_and_sets_the_record(): void
    {
        $scoring = new SniperScoring(config('madar.sniper'));
        $seconds = (int) ceil($scoring->roundStart(2)) + 1;
        $this->snipe($this->students[0], $seconds, 400, 3, 20)->assertOk()
            ->assertJsonPath('run.game', 'sniper')
            ->assertJsonPath('run.score', 400)
            ->assertJsonPath('run.wave', 3)
            ->assertJsonPath('run.stars', 20)
            ->assertJsonPath('run.flagged', false)
            ->assertJsonPath('best', 400)
            ->assertJsonPath('bestWave', 3)
            ->assertJsonPath('newBest', true);
        $this->snipe($this->students[0], $seconds, 300, 3)->assertOk()->assertJsonPath('newBest', false)->assertJsonPath('best', 400);

        $this->as($this->students[0], 'GET', '/madar')->assertOk()
            ->assertJsonPath('sniper.best', 400)->assertJsonPath('sniper.bestRound', 3)->assertJsonPath('sniper.runsCount', 2)
            ->assertJsonPath('best', 0)->assertJsonPath('defense.best', 0);
    }

    public function test_an_impossible_round_or_score_is_clamped_and_flagged(): void
    {
        $scoring = new SniperScoring(config('madar.sniper'));
        $this->snipe($this->students[0], 20, 50, 30)->assertOk()
            ->assertJsonPath('run.wave', $scoring->maxRound(20_000))->assertJsonPath('run.flagged', true);
        $this->snipe($this->students[0], 20, 999_999, 1, 999)->assertOk()
            ->assertJsonPath('run.score', $scoring->maxPlausible(20_000))->assertJsonPath('run.flagged', true);
        $this->assertLessThanOrEqual(intdiv($scoring->maxPlausible(20_000), 10), MadarRun::latest('id')->value('stars'));
    }

    public function test_it_has_its_own_week_leaderboard_and_teacher_view(): void
    {
        $this->snipe($this->students[1], 60, 500, 3);
        $state = $this->as($this->students[0], 'GET', '/madar')->assertOk();
        $this->assertSame(0, $state->json('competition.participants'));
        $this->assertSame(1, $state->json('sniper.competition.participants'));
        $this->assertSame('Sara H.', $state->json('sniper.competition.top.0.name'));

        $this->asTeacher('GET', '/madar/results?game=sniper')->assertOk()
            ->assertJsonPath('game', 'sniper')->assertJsonPath('summary.players', 1)
            ->assertJsonPath('students.0.allTimeBest', 500)->assertJsonPath('students.0.weekWave', 3);
        $this->asTeacher('GET', '/madar/settings')->assertOk()->assertJsonPath('options.gameCategories.sniper', 'math');
    }

    public function test_the_teacher_closes_a_game_for_one_student_only(): void
    {
        $sara = $this->students[1];
        $this->asTeacher('PUT', "/madar/students/{$sara->id}/games", ['disabledGames' => ['orbit', 'sniper']])
            ->assertOk()->assertJsonPath('disabledGames', ['orbit', 'sniper']);

        $this->as($sara, 'POST', '/madar/runs', ['game' => 'sniper'])->assertStatus(422)->assertJsonPath('reason', 'game_disabled_for_student');
        $this->as($sara, 'POST', '/madar/runs', ['game' => 'orbit'])->assertStatus(422)->assertJsonPath('reason', 'game_disabled_for_student');
        $this->as($sara, 'POST', '/madar/runs', ['game' => 'defense'])->assertCreated();
        $games = collect($this->as($sara, 'GET', '/madar')->json('games'))->keyBy('id');
        $this->assertFalse($games['sniper']['enabled']);
        $this->assertSame('student', $games['sniper']['closedBy']);
        $this->assertTrue($games['defense']['enabled']);

        // Les autres élèves ne changent pas.
        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertCreated();

        // La classe entière : « class » l'emporte.
        $this->asTeacher('PATCH', '/madar/settings', ['disabledGames' => ['sniper']])->assertOk();
        $this->assertSame('class', collect($this->as($sara, 'GET', '/madar')->json('games'))->firstWhere('id', 'sniper')['closedBy']);
        $this->as($this->students[0], 'POST', '/madar/runs', ['game' => 'sniper'])->assertStatus(422)->assertJsonPath('reason', 'game_disabled');

        $this->asTeacher('GET', '/madar/results')->assertOk();
        $row = collect($this->asTeacher('GET', '/madar/results')->json('students'))->firstWhere('student.id', $sara->id);
        $this->assertSame(['orbit', 'sniper'], $row['disabledGames']);

        // Rouvrir : la liste entière est remplacée.
        $this->asTeacher('PUT', "/madar/students/{$sara->id}/games", ['disabledGames' => []])->assertOk()->assertJsonPath('disabledGames', []);
        $this->as($sara, 'POST', '/madar/runs', ['game' => 'orbit'])->assertCreated();
    }

    public function test_a_student_game_block_is_checked(): void
    {
        $outsider = $this->student(['first_name' => 'Nour']);
        $this->asTeacher('PUT', "/madar/students/{$outsider->id}/games", ['disabledGames' => ['orbit']])->assertStatus(422)->assertJsonPath('reason', 'student_not_in_class');
        $this->asTeacher('PUT', "/madar/students/{$this->students[0]->id}/games", ['disabledGames' => ['chess']])->assertStatus(422)->assertJsonPath('reason', 'unknown_game');

        $other = $this->teacher();
        $this->withToken($this->tokenOf($other))->json('PUT', "/api/v1/teacher/classrooms/{$this->classroom->id}/madar/students/{$this->students[0]->id}/games", ['disabledGames' => []])
            ->assertStatus(403);
    }
}
