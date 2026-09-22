<?php

namespace App\Domain\Classroom;

use RuntimeException;

/**
 * Le JETON d'une invitation nominative : un secret à usage unique porté par
 * un lien. Jamais stocké en clair — empreinte HMAC, comme les codes
 * d'activation, avec une clé DÉRIVÉE d'APP_KEY propre à cet usage.
 */
final class InvitationToken
{
    private const LENGTH = 40;

    public static function generate(): string
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $max = strlen($alphabet) - 1;
        $token = '';
        for ($i = 0; $i < self::LENGTH; $i++) {
            $token .= $alphabet[random_int(0, $max)];
        }

        return $token;
    }

    public static function hash(string $token): string
    {
        return hash_hmac('sha256', $token, self::key());
    }

    public static function hint(string $token): string
    {
        return substr($token, -4);
    }

    /** Un jeton bien formé : 40 symboles alphanumériques, rien d'autre. */
    public static function isWellFormed(?string $raw): bool
    {
        return is_string($raw) && preg_match('/^[A-Za-z0-9]{'.self::LENGTH.'}$/', $raw) === 1;
    }

    private static function key(): string
    {
        $appKey = (string) config('app.key');
        if ($appKey === '') {
            throw new RuntimeException('APP_KEY est vide : impossible de hacher un jeton d\'invitation.');
        }
        if (str_starts_with($appKey, 'base64:')) {
            $decoded = base64_decode(substr($appKey, 7), true);
            if ($decoded !== false) {
                $appKey = $decoded;
            }
        }

        return hash_hmac('sha256', 'classroom-invitation-v1', $appKey, true);
    }
}
