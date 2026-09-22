<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\ClassroomMembership;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ClassroomMembership> */
class ClassroomMembershipFactory extends Factory
{
    protected $model = ClassroomMembership::class;

    public function definition(): array
    {
        return [
            'classroom_id' => Classroom::factory(),
            'student_id' => User::factory()->state(['role' => User::ROLE_STUDENT, 'grade' => '4am']),
            'status' => ClassroomMembership::STATUS_ACTIVE,
            'joined_at' => now()->subDay(),
            'joined_via' => ClassroomMembership::VIA_JOIN_CODE,
        ];
    }

    public function in(Classroom $classroom): static
    {
        return $this->state(['classroom_id' => $classroom->id]);
    }

    public function of(User $student): static
    {
        return $this->state(['student_id' => $student->id]);
    }

    public function left(): static
    {
        return $this->state(['status' => ClassroomMembership::STATUS_LEFT, 'left_at' => now()]);
    }
}
