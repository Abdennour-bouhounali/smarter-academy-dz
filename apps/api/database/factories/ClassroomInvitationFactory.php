<?php

namespace Database\Factories;

use App\Domain\Classroom\InvitationToken;
use App\Models\Classroom;
use App\Models\ClassroomInvitation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Usine de TEST. Même astuce que ActivationCodeFactory : le jeton en clair
 * n'existe que dans la mémoire du test qui l'a tiré (`plainTokenOf`).
 *
 * @extends Factory<ClassroomInvitation>
 */
class ClassroomInvitationFactory extends Factory
{
    protected $model = ClassroomInvitation::class;

    /** @var array<string, string> */
    private static array $plainByHash = [];

    public function definition(): array
    {
        $plain = InvitationToken::generate();
        $hash = InvitationToken::hash($plain);
        self::$plainByHash[$hash] = $plain;

        return [
            'classroom_id' => Classroom::factory(),
            'invited_by' => User::factory()->state(['role' => User::ROLE_TEACHER]),
            'email' => fake()->unique()->safeEmail(),
            'token_hash' => $hash,
            'token_hint' => InvitationToken::hint($plain),
            'status' => ClassroomInvitation::STATUS_PENDING,
            'expires_at' => now()->addDays(14),
        ];
    }

    public static function plainTokenOf(ClassroomInvitation $invitation): ?string
    {
        return self::$plainByHash[$invitation->token_hash] ?? null;
    }

    public function expired(): static
    {
        return $this->state(['expires_at' => now()->subDay()]);
    }

    public function revoked(): static
    {
        return $this->state(['status' => ClassroomInvitation::STATUS_REVOKED, 'revoked_at' => now()]);
    }
}
