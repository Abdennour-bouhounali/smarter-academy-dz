<?php

namespace Tests\Feature;

use App\Domain\Books\OrderPush;
use App\Domain\Push\PushSender;
use App\Models\Book;
use App\Models\BookOrder;
use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Notifications « طلب جديد » (BOOKS_STORE.md §6quater) — l'envoi réel est remplacé. */
class BookOrderPushTest extends TestCase
{
    use RefreshDatabase;

    private FakePushSender $sender;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sender = new FakePushSender;
        $this->app->instance(PushSender::class, $this->sender);
    }

    private function token(string $role): array
    {
        $user = User::factory()->create(['role' => $role, 'email_verified_at' => now()]);

        return [$user, $user->createToken('t')->plainTextToken];
    }

    private function subscribe(string $token, string $endpoint): void
    {
        // Les gardes d'authentification gardent l'utilisateur d'une requête à l'autre dans un
        // même test : sans ceci, un second compte serait enregistré sous le premier.
        $this->app['auth']->forgetGuards();
        $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/v1/admin/book-orders/push/subscriptions', [
            'endpoint' => $endpoint, 'keys' => ['p256dh' => 'pk', 'auth' => 'au'],
        ])->assertCreated();
    }

    private function order(): void
    {
        Book::create(['slug' => 'smart-protocol', 'title' => 'SMART', 'price' => 1000, 'status' => 'published', 'content' => [], 'gallery' => []]);
        $this->postJson('/api/v1/books/smart-protocol/orders', [
            'customerName' => 'Samir Benali', 'phone' => '0555123456', 'wilaya' => 'الجزائر - Alger',
            'commune' => 'باب الزوار', 'quantity' => 2,
        ])->assertCreated();
    }

    public function test_le_gestionnaire_abonne_son_appareil_et_recoit_la_nouvelle_commande(): void
    {
        [, $token] = $this->token(User::ROLE_BOOK_MANAGER);
        $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/admin/book-orders/push')
            ->assertOk()->assertJson(['enabled' => true, 'publicKey' => 'PUBLIC', 'devices' => 0]);

        $this->subscribe($token, 'https://fcm.googleapis.com/fcm/send/device-1');
        $this->subscribe($token, 'https://fcm.googleapis.com/fcm/send/device-1'); // même appareil : pas de doublon
        $this->assertSame(1, PushSubscription::count());

        $this->order();

        $this->assertCount(1, $this->sender->sent);
        [$endpoints, $payload] = $this->sender->sent[0];
        $this->assertSame(['https://fcm.googleapis.com/fcm/send/device-1'], $endpoints);
        $this->assertStringStartsWith('طلب جديد · BK-', $payload['title']);
        $this->assertSame('الجزائر · 2 نسخ · 2000دج', $payload['body']);
        $this->assertSame('/admin/livres/commandes/'.BookOrder::firstOrFail()->id, $payload['url']);
        // Écran verrouillé : ni le nom ni le téléphone du client.
        $this->assertStringNotContainsString('Samir', json_encode($payload, JSON_UNESCAPED_UNICODE));
        $this->assertStringNotContainsString('0555', json_encode($payload));
    }

    public function test_seuls_les_comptes_librairie_actifs_recoivent(): void
    {
        [, $adminToken] = $this->token(User::ROLE_ADMIN);
        [$suspended, $suspendedToken] = $this->token(User::ROLE_BOOK_MANAGER);
        $this->subscribe($adminToken, 'https://push.example/admin');
        $this->subscribe($suspendedToken, 'https://push.example/suspended');
        $suspended->update(['account_status' => User::STATUS_SUSPENDED]);

        $this->order();

        $this->assertSame(['https://push.example/admin'], $this->sender->sent[0][0]);
    }

    public function test_un_eleve_n_atteint_pas_les_notifications(): void
    {
        [, $token] = $this->token(User::ROLE_STUDENT);
        $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/admin/book-orders/push')->assertForbidden();
        $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/v1/admin/book-orders/push/subscriptions', [
            'endpoint' => 'https://push.example/x', 'keys' => ['p256dh' => 'pk', 'auth' => 'au'],
        ])->assertForbidden();
    }

    public function test_desabonner_et_nettoyer_un_appareil_expire(): void
    {
        [$user, $token] = $this->token(User::ROLE_BOOK_MANAGER);
        $this->subscribe($token, 'https://push.example/a');
        $this->subscribe($token, 'https://push.example/b');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/v1/admin/book-orders/push/subscriptions', ['endpoint' => 'https://push.example/a'])->assertOk();
        $this->assertSame(['https://push.example/b'], PushSubscription::pluck('endpoint')->all());

        // Un appareil que le service de notification déclare expiré est supprimé à l'envoi.
        $this->sender->expire = ['https://push.example/b'];
        $this->assertSame(1, app(OrderPush::class)->test($user));
        $this->assertSame(0, PushSubscription::count());
    }

    public function test_sans_cles_rien_n_est_envoye_et_la_commande_passe(): void
    {
        $this->sender->on = false;
        [, $token] = $this->token(User::ROLE_ADMIN);
        $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/v1/admin/book-orders/push/subscriptions', [
            'endpoint' => 'https://push.example/x', 'keys' => ['p256dh' => 'pk', 'auth' => 'au'],
        ])->assertStatus(409);

        $this->order();
        $this->assertSame([], $this->sender->sent);
    }
}

class FakePushSender implements PushSender
{
    public bool $on = true;

    /** @var array<int, array{0: array<int,string>, 1: array}> */
    public array $sent = [];

    /** @var array<int, string> */
    public array $expire = [];

    public function enabled(): bool
    {
        return $this->on;
    }

    public function publicKey(): ?string
    {
        return $this->on ? 'PUBLIC' : null;
    }

    public function send(iterable $subscriptions, array $payload): array
    {
        $endpoints = collect($subscriptions)->pluck('endpoint')->sort()->values()->all();
        $this->sent[] = [$endpoints, $payload];

        return array_values(array_intersect($this->expire, $endpoints));
    }
}
