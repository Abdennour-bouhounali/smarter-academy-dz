<?php

namespace App\Domain\Progress;

use App\Domain\Progress\Engine\MasteryState;
use App\Domain\Progress\Replay\ReplayService;
use App\Models\User;

/**
 * Façade historique de Replay\ReplayService — gardée pour les appelants qui
 * la connaissent (PracticeEvidenceConvergenceTest). La logique est dans le
 * service ; rien n'est dupliqué ici.
 *
 * L'invariant qu'elle exprime : « l'état courant doit être explicable à
 * partir de la preuve stockée » — un rejeu redonne l'agrégat enregistré.
 */
class MasteryRecalculator
{
    public function __construct(private ReplayService $replay) {}

    /**
     * @return array{confidence: float, status: string, attempts: int, correct_count: int, state: MasteryState}
     */
    public function replay(User $user, int $learningPointId): array
    {
        $state = $this->replay->replay($user->id, $learningPointId);

        return [
            'confidence' => $state->confidence,
            'status' => $state->status,
            'attempts' => $state->attempts,
            'correct_count' => $state->correctCount,
            'state' => $state,
        ];
    }

    public function matchesStored(User $user, int $learningPointId): bool
    {
        return $this->replay->matchesStored($user->id, $learningPointId);
    }
}
