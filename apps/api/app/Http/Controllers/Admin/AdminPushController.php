<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Books\OrderPush;
use App\Domain\Push\PushSender;
use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Notifications des nouvelles commandes de livres sur l'appareil du compte connecté
 * (porte `books` : administrateur ou « مسيّر المكتبة », BOOKS_STORE.md §6quater).
 * Chaque compte ne voit et ne gère QUE ses propres appareils.
 */
class AdminPushController extends Controller
{
    public function __construct(private PushSender $sender) {}

    /** La clé publique VAPID (pour s'abonner) et le nombre d'appareils de CE compte. */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'enabled' => $this->sender->enabled(),
            'publicKey' => $this->sender->publicKey(),
            'devices' => PushSubscription::where('user_id', $request->user()->id)->count(),
        ]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        abort_unless($this->sender->enabled(), 409, 'Notifications are not configured on the server.');

        $data = $request->validate([
            'endpoint' => 'required|url|starts_with:https://|max:2000',
            'keys.p256dh' => 'required|string|max:255',
            'keys.auth' => 'required|string|max:255',
        ]);

        // Un appareil = un abonnement. Repris par un autre compte (même navigateur), il change de main.
        PushSubscription::updateOrCreate(
            ['endpoint_hash' => PushSubscription::hashOf($data['endpoint'])],
            [
                'user_id' => $request->user()->id,
                'endpoint' => $data['endpoint'],
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
                'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
            ],
        );

        return response()->json(['success' => true], 201);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $data = $request->validate(['endpoint' => 'required|string|max:2000']);
        PushSubscription::where('user_id', $request->user()->id)
            ->where('endpoint_hash', PushSubscription::hashOf($data['endpoint']))
            ->delete();

        return response()->json(['success' => true]);
    }

    public function test(Request $request, OrderPush $push): JsonResponse
    {
        abort_unless($this->sender->enabled(), 409, 'Notifications are not configured on the server.');

        return response()->json(['sent' => $push->test($request->user())]);
    }
}
