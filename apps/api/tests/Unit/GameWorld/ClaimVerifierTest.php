<?php

namespace Tests\Unit\GameWorld;

use App\Domain\GameWorld\ClaimVerifier;
use PHPUnit\Framework\TestCase;

/** Le juge du monde de jeu, sans base de données : la fixture partagée avec le navigateur (evidence.test.js). */
class ClaimVerifierTest extends TestCase
{
    public function test_it_gives_the_verdict_of_the_shared_fixture(): void
    {
        $fixture = json_decode(file_get_contents(__DIR__.'/../../Fixtures/game-claims.json'), true);
        $this->assertGreaterThan(30, count($fixture['cases']));
        foreach ($fixture['cases'] as $case) {
            $this->assertSame($case['ok'], ClaimVerifier::verify($case['claim']), json_encode($case['claim']));
        }
    }

    public function test_it_refuses_what_is_not_a_natural_number(): void
    {
        $this->assertFalse(ClaimVerifier::verify(['kind' => 'division', 'a' => '756', 'b' => 36, 'q' => 21, 'r' => 0, 'fits' => true]));
        $this->assertFalse(ClaimVerifier::verify(['kind' => 'division', 'a' => 756, 'b' => 36, 'q' => 21.0, 'r' => 0, 'fits' => true]));
        $this->assertFalse(ClaimVerifier::verify(['kind' => 'division', 'a' => 756, 'b' => 36, 'q' => 21, 'r' => 0, 'fits' => 1]));
        $this->assertFalse(ClaimVerifier::verify(['kind' => 'containers', 'a' => 10 ** 9, 'b' => 3, 'count' => 1]));
        $this->assertFalse(ClaimVerifier::verify([]));
    }

    public function test_the_same_division_is_the_same_item(): void
    {
        $this->assertSame('division-756x36', ClaimVerifier::itemId(['kind' => 'division', 'a' => 756, 'b' => 36, 'q' => 21, 'r' => 0]));
        $this->assertSame('division-756x36', ClaimVerifier::itemId(['kind' => 'division', 'a' => 756, 'b' => 36, 'q' => 20, 'r' => 36]));
    }
}
