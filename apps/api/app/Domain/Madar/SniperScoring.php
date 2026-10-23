<?php

namespace App\Domain\Madar;

/**
 * La borne d'un score de « قنّاص القيم » (pure).
 *
 * Le calendrier est FIXE : la manche k commence à un instant connu, ses
 * `cards_per_round` cartes tombent à intervalle connu ; personne ne peut
 * l'accélérer. Donc, pour une durée réelle T (posée par le serveur) :
 *
 *   manche atteinte ≤ max { k : début(k) ≤ T }
 *   score ≤ Σ cartes apparues (début(k) + j·écart(k) ≤ T)  points × niveau(k) × multiplicateur max
 *         + Σ manches commencées                            bonus × niveau(k)
 *
 * puis × tolérance + marge. Au-delà : ramené à la borne, partie signalée.
 * MIROIR de apps/web/src/features/madar/sniper/bound.js.
 */
class SniperScoring
{
    /** @param  array<string, float|int>  $c  config('madar.sniper') */
    public function __construct(private array $c) {}

    public function gap(int $k): float
    {
        return max((float) $this->c['gap_min'], (float) $this->c['gap_start'] - (float) $this->c['gap_step'] * $k);
    }

    public function fall(int $k): float
    {
        return max((float) $this->c['fall_min'], (float) $this->c['fall_start'] - (float) $this->c['fall_step'] * $k);
    }

    /** Le niveau (1…max_level) d'une manche k (0, 1, …) : il fixe les points. */
    public function level(int $k): int
    {
        return min((int) $this->c['max_level'], 1 + intdiv($k, (int) $this->c['rounds_per_level']));
    }

    /** L'instant (s) où commence la manche k. */
    public function roundStart(int $k): float
    {
        $t = (float) $this->c['first_at'];
        $n = (int) $this->c['cards_per_round'];
        for ($j = 0; $j < $k; $j++) {
            $t += ($n - 1) * $this->gap($j) + $this->fall($j) + (float) $this->c['breather'];
        }

        return $t;
    }

    /** Le nombre de manches commencées en T ms. */
    public function maxRound(int $durationMs): int
    {
        $t = max(0, $durationMs) / 1000;
        $k = 0;
        while ($k < 1000 && $this->roundStart($k) <= $t) {
            $k++;
        }

        return $k;
    }

    public function perfectScore(int $durationMs): int
    {
        $t = max(0, $durationMs) / 1000;
        $n = (int) $this->c['cards_per_round'];
        $perHit = (int) $this->c['points_per_level'] * (int) $this->c['max_multiplier'];
        $score = 0;
        for ($k = 0; $k < 1000 && ($start = $this->roundStart($k)) <= $t; $k++) {
            $level = $this->level($k);
            for ($j = 0; $j < $n && $start + $j * $this->gap($k) <= $t; $j++) {
                $score += $perHit * $level;
            }
            $score += (int) $this->c['perfect_bonus'] * $level;
        }

        return $score;
    }

    public function maxPlausible(int $durationMs): int
    {
        return (int) ceil($this->perfectScore($durationMs) * (float) ($this->c['tolerance'] ?? 1.1)) + (int) ($this->c['slack'] ?? 100);
    }

    /** @return array{score: int, wave: int, flagged: bool} `wave` = la manche atteinte */
    public function settle(int $claimed, int $claimedRound, int $durationMs): array
    {
        $bound = $this->maxPlausible($durationMs);
        $maxRound = $this->maxRound($durationMs);
        $claimed = max(0, $claimed);
        $claimedRound = max(0, $claimedRound);

        return [
            'score' => min($claimed, $bound),
            'wave' => min($claimedRound, $maxRound),
            'flagged' => $claimed > $bound || $claimedRound > $maxRound,
        ];
    }
}
