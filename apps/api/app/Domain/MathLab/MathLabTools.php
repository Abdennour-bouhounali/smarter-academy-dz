<?php

namespace App\Domain\MathLab;

/**
 * Le registre SERVEUR des instruments du مختبر الرياضيات.
 *
 * Le client a le sien (apps/web/src/features/mathlab/toolRegistry.js) : il
 * décide de l'interface, des routes et du rendu. Celui-ci ne décide que de ce
 * que le serveur accepte d'ENREGISTRER : un identifiant connu, et une taille
 * bornée. Un document d'un outil inconnu est refusé (422) — on ne stocke pas
 * ce qu'aucun instrument ne saura rouvrir.
 *
 * Ajouter un instrument = une ligne ici ET une entrée dans le registre client.
 */
final class MathLabTools
{
    /**
     * @var array<string, array{maxBytes: int}>
     */
    private const TOOLS = [
        // La سبّورة : un dessin Excalidraw sérialisé. 2 Mo couvrent des
        // centaines de traits ; l'outil image est désactivé côté client, donc
        // aucune photo n'y entre.
        'whiteboard' => ['maxBytes' => 2_000_000],
        // Le grapheur : six fonctions au plus, un point, une fenêtre, des
        // réglages — quelques kilo-octets. 100 Ko laissent de la marge aux
        // versions futures (paramètres, plusieurs points).
        'functionGrapher' => ['maxBytes' => 100_000],
        // La géométrie dans l'espace : un solide, ses dimensions, trois
        // options, une caméra — quelques centaines d'octets. 20 Ko laissent
        // de la marge aux versions futures (patrons, sections, plusieurs solides).
        'geometry3d' => ['maxBytes' => 20_000],
        // Les probabilités et statistiques : une expérience, ses paramètres,
        // des EFFECTIFS (jamais les tirages : cent mille lancers de dé, c'est
        // six nombres), une trajectoire bornée à soixante points, et une
        // série saisie bornée à cinq cents valeurs. 60 Ko couvrent tout cela
        // très largement et laissent de la marge aux versions futures.
        'probabilityStats' => ['maxBytes' => 60_000],
    ];

    public static function exists(string $tool): bool
    {
        return array_key_exists($tool, self::TOOLS);
    }

    public static function maxBytes(string $tool): int
    {
        return self::TOOLS[$tool]['maxBytes'];
    }

    /** @return string[] */
    public static function ids(): array
    {
        return array_keys(self::TOOLS);
    }
}
