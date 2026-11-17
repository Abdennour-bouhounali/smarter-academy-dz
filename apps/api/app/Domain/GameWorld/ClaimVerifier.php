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
 * Même règle que `verifyClaim()` de apps/web/src/lessons/common/gameworld/kit/claims.js :
 * une seule fixture pour les deux (tests/Fixtures/game-claims.json).
 *
 * Un GENRE d'affirmation n'appartient à aucune leçon : c'est un énoncé sur des entiers naturels, que toute leçon peut
 * employer. POUR EN AJOUTER UN : l'écrire ICI (`KINDS` et `verify`) et dans `kit/claims.js`, puis ajouter à la fixture des
 * lignes vraies et des lignes fausses. `claims.test.js` (web) échoue si les deux listes diffèrent ou si un genre n'a pas
 * ses deux verdicts ; `ClaimVerifierTest` rejoue la fixture ici.
 */
final class ClaimVerifier
{
    public const KINDS = ['division', 'product', 'phrase', 'sure', 'containers', 'pair', 'divisors', 'stop', 'divisible'];

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
            case 'pair':
                // a = b × e : un produit de deux facteurs — les deux sont des diviseurs
                [$a, $b, $e] = [$n('a'), $n('b'), $n('e')];
                if ($a === null || $b === null || $e === null || $b === 0 || $e === 0) {
                    return false;
                }

                return $b * $e === $a;
            case 'divisors':
                // TOUS les diviseurs de a, chacun une fois (l'ordre n'importe pas) ; b = leur nombre annoncé
                [$a, $b] = [$n('a'), $n('b')];
                $list = $c['list'] ?? null;
                if ($a === null || $a === 0 || $b === null || ! is_array($list) || count($list) > 400) {
                    return false;
                }
                foreach ($list as $d) {
                    if (! is_int($d) || $d < 1) {
                        return false;
                    }
                }
                $all = [];
                for ($d = 1; $d * $d <= $a; $d++) {
                    if ($a % $d === 0) {
                        $all[] = $d;
                        $all[] = intdiv($a, $d);
                    }
                }
                $all = array_values(array_unique($all));
                sort($all);
                $mine = array_values($list);
                sort($mine);

                return $mine === $all && $b === count($all);
            case 'stop':
                // jusqu'où tester : le plus grand b dont le carré ne dépasse pas a
                [$a, $b] = [$n('a'), $n('b')];
                if ($a === null || $b === null) {
                    return false;
                }

                return $b * $b <= $a && $a < ($b + 1) * ($b + 1);
            case 'divisible':
                // « a est divisible par b » dit juste (une règle de divisibilité, sans poser la division)
                [$a, $b] = [$n('a'), $n('b')];
                if ($a === null || $b === null || $b === 0 || ! is_bool($c['fits'] ?? null)) {
                    return false;
                }

                return $c['fits'] === ($a % $b === 0);
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
