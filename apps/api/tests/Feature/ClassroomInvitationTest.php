<?php

namespace Tests\Feature;

use App\Domain\Plans\EntitlementKeys as K;
use App\Models\Classroom;
use App\Models\ClassroomInvitation;
use App\Models\ClassroomMembership;
use App\Notifications\ClassroomInvitationNotification;
use Database\Factories\ClassroomInvitationFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\Support\CommercialFixtures;
use Tests\TestCase;

class ClassroomInvitationTest extends TestCase
{
    use CommercialFixtures;
    use RefreshDatabase;

    public function test_inviter_previsualiser_accepter(): void
    {
        Notification::fake();
        $this->defaultTeacherPlan([K::INVITATIONS_ACTIVE_MAX => 5]);
        $classroom = Classroom::factory()->create();
        $teacherToken = $this->tokenOf($classroom->teacher);

        $created = $this->withToken($teacherToken)
            ->postJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations", ['email' => 'Eleve@Example.dz'])
            ->assertCreated()->assertJsonPath('invitation.status', 'pending')->assertJsonPath('invitation.email', 'eleve@example.dz');

        Notification::assertSentOnDemand(ClassroomInvitationNotification::class);
        $token = basename($created->json('joinUrl'));

        // Publique : le nom de la classe, rien de plus.
        $preview = $this->getJson("/api/v1/invitations/{$token}")->assertOk()->json('invitation');
        $this->assertSame($classroom->name, $preview['classroomName']);
        $this->assertArrayNotHasKey('joinCode', $preview);

        $student = $this->student();
        $this->withToken($this->tokenOf($student))->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => $token])
            ->assertCreated()->assertJsonPath('studyContext.mode', 'classroom');
        $this->assertDatabaseHas('classroom_memberships', ['classroom_id' => $classroom->id, 'student_id' => $student->id, 'status' => 'active', 'joined_via' => 'invitation']);
        $this->assertDatabaseHas('classroom_invitations', ['id' => $created->json('invitation.id'), 'status' => 'accepted', 'accepted_by' => $student->id]);

        // Une deuxième acceptation est refusée, sans doublon.
        $this->withToken($this->tokenOf($this->student()))->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => $token])
            ->assertStatus(422)->assertJsonPath('reason', 'invalid');
        $this->assertSame(1, ClassroomMembership::where('classroom_id', $classroom->id)->count());
    }

    public function test_expiree_revoquee_ou_inconnue(): void
    {
        $this->defaultTeacherPlan();
        $expired = ClassroomInvitation::factory()->expired()->create();
        $revoked = ClassroomInvitation::factory()->revoked()->create();
        $token = $this->tokenOf($this->student());

        $this->withToken($token)->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => ClassroomInvitationFactory::plainTokenOf($expired)])->assertStatus(422)->assertJsonPath('reason', 'expired');
        $this->withToken($token)->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => ClassroomInvitationFactory::plainTokenOf($revoked)])->assertStatus(422)->assertJsonPath('reason', 'revoked');
        $this->withToken($token)->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => str_repeat('a', 40)])->assertStatus(422)->assertJsonPath('reason', 'invalid');
        $this->getJson('/api/v1/invitations/'.str_repeat('b', 40))->assertStatus(422);
        $this->assertDatabaseCount('classroom_memberships', 0);
    }

    public function test_la_limite_d_invitations_en_attente_vient_de_l_offre(): void
    {
        Notification::fake();
        $this->defaultTeacherPlan([K::INVITATIONS_ACTIVE_MAX => 1]);
        $classroom = Classroom::factory()->create();
        $token = $this->tokenOf($classroom->teacher);

        $this->withToken($token)->postJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations", ['email' => 'a@example.dz'])->assertCreated();
        $this->withToken($token)->postJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations", ['email' => 'b@example.dz'])
            ->assertStatus(422)->assertJsonPath('reason', 'limit_reached');
    }

    public function test_revoquer_et_l_appartenance_a_un_autre_enseignant(): void
    {
        Notification::fake();
        $this->defaultTeacherPlan();
        $classroom = Classroom::factory()->create();
        $token = $this->tokenOf($classroom->teacher);
        $id = $this->withToken($token)->postJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations", ['email' => 'a@example.dz'])->json('invitation.id');

        $this->withToken($this->tokenOf($this->teacher()))->deleteJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations/{$id}")->assertStatus(403);
        $this->withToken($token)->deleteJson("/api/v1/teacher/classrooms/{$classroom->id}/invitations/{$id}")->assertOk()->assertJsonPath('invitation.status', 'revoked');
    }

    public function test_un_enseignant_ne_peut_pas_accepter_une_invitation(): void
    {
        $this->defaultTeacherPlan();
        $invitation = ClassroomInvitation::factory()->create();
        $this->withToken($this->tokenOf($this->teacher()))->postJson('/api/v1/student/classrooms/join', ['consent' => true, 'token' => ClassroomInvitationFactory::plainTokenOf($invitation)])
            ->assertStatus(422)->assertJsonPath('reason', 'not_a_student');
        $this->assertSame('pending', $invitation->fresh()->status);
    }
}
