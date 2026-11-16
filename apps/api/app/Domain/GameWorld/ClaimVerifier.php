<?php

namespace App\Domain\GameWorld;

/**
 * Le juge des réponses du MONDE DE JEU (« أرخبيل القواسم », 2026-11-15).
 *
 * Les questions du jeu sont de l'arithmétique générée dans le navigateur : il
 * n'existe aucune clé stockée à comparer. Le client envoie donc une
 * AFFIRMATION (`claim`) — les nombres de la question et ce que l'élève a
 * écrit — et le serveur RECALCULE le verdict. La parole du navigateur n'est
 * jamais crue (frontière de confiance, LEARNING_ARCHITECTURE.md).
 *
 * Même règle que `verify()` de apps/web/.../gameworld/divisorIsles/evidence.js :
 * une seule fixture pour les deux (tests/Fixtures/game-claims.json).
 */
final class ClaimVerifier
{
    public const KINDS = ['division', 'product', 'phrase', 'sure', 'containers'];

    /** Les nombres admis : des entiers naturels de taille scolaire. */
    public const MAX = 1000000;

    public static function verify(array $c): bool
    {
        $n = static fn (string $k): ?int => isset($c[$k]) && is_int($c[$k]) && $c[$k] >= 0 && $c[$k] <= self::MAX ? $c[$k] : null;

        switch ($c['kind'] ?? null) {
            case 'division':
                [$a, $b, $q, $r] = [$n('a'), $n('b'), $n('q'), $n('r')];
                if ($a === null || $b === null || $q === null || $r === null || $b === 0 || ! is_bool($c['fits'] ?? null)) {
                    return false;
                }

                return $b * $q + $r === $a && $r < $b && $c['fits'] === ($r === 0);
            case 'product':
                [$a, $b, $q, $o] = [$n('a'), $n('b'), $n('q'), $n('other')];
                if ($a === null || $b === null || $q === null || $o === null || $b === 0 || $o === 0) {
                    return false;
                }

                // « un AUTRE diviseur » : pas celui qu'on vient de montrer (sauf a = b × b)
                return $b * $q === $a && $a % $o === 0 && ($o !== $b || $b === $q);
            case 'phrase':
                [$a, $b, $first] = [$n('a'), $n('b'), $n('first')];
                if ($a === null || $b === null || $first === null) {
                    return false;
                }
                $divisorFirst = $first === min($a, $b);

                return match ($c['phrase'] ?? null) {
                    'qasim', 'yaqsim' => $divisorFirst,
                    'mudaaf', 'yaqbal' => ! $divisorFirst,
                    default => false,
                };
            case 'sure':
                [$a, $x, $y] = [$n('a'), $n('x'), $n('y')];
                if ($a === null || $x === null || $y === null) {
                    return false;
                }

                return $x !== $y && in_array(1, [$x, $y], true) && in_array($a, [$x, $y], true);
            case 'containers':
                [$a, $b, $count] = [$n('a'), $n('b'), $n('count')];
                if ($a === null || $b === null || $count === null || $b === 0) {
                    return false;
                }

                return $count === intdiv($a + $b - 1, $b);
            default:
                return false;
        }
    }

    /** L'identité d'un item généré : la même division posée deux fois est le MÊME item (règle des items distincts). */
    public static function itemId(array $c): string
    {
        $parts = array_map(static fn ($k) => isset($c[$k]) && is_int($c[$k]) ? (string) $c[$k] : '-', ['a', 'b']);

        return ($c['kind'] ?? 'x').'-'.implode('x', $parts);
    }
}
