<?php

namespace App\Domain\Books;

use App\Domain\Push\PushSender;
use App\Models\BookOrder;
use App\Models\PushSubscription;
use App\Models\User;

/**
 * La notification « طلب جديد » envoyée aux appareils des comptes de la librairie
 * (administrateurs et « مسيّرو المكتبة » ACTIFS) à chaque nouvelle commande de livre
 * (BOOKS_STORE.md §6quater).
 *
 * Elle s'affiche sur l'écran verrouillé : elle porte la référence, la wilaya, le nombre
 * de copies et le montant — JAMAIS le nom ni le téléphone du client.
 */
class OrderPush
{
    public function __construct(private PushSender $sender) {}

    /** @return array{title:string, body:string, url:string, tag:string} */
    public static function payloadFor(BookOrder $order): array
    {
        // « الجزائر - Alger » → « الجزائر » (le libellé enregistré garde les deux noms).
        $wilaya = trim(explode(' - ', (string) $order->wilaya)[0]);
        $copies = $order->quantity === 1 ? 'نسخة واحدة' : $order->quantity.' نسخ';
        // Argent : « دج » collé, sans espace de milliers (règle de la plateforme).
        $amount = ($order->unit_price * $order->quantity).'دج';

        return [
            'title' => 'طلب جديد · '.$order->reference,
            'body' => "{$wilaya} · {$copies} · {$amount}",
            'url' => '/admin/livres/commandes/'.$order->id,
            'tag' => 'book-order-'.$order->id,
        ];
    }

    public function newOrder(int $orderId): void
    {
        $order = BookOrder::find($orderId);
        if (! $order || ! $this->sender->enabled()) {
            return;
        }
        $this->deliver($this->recipients()->get(), self::payloadFor($order));
    }

    /** Une notification d'essai vers les appareils d'UN compte (bouton « جرّب »). Rend leur nombre. */
    public function test(User $user): int
    {
        $subs = PushSubscription::where('user_id', $user->id)->get();
        $this->deliver($subs, [
            'title' => 'الإشعارات تعمل',
            'body' => 'ستصلك هنا رسالة عند كل طلب كتاب جديد.',
            'url' => '/admin/livres/commandes',
            'tag' => 'book-order-test',
        ]);

        return $subs->count();
    }

    private function recipients()
    {
        return PushSubscription::query()->whereHas('user', fn ($q) => $q
            ->whereIn('role', [User::ROLE_ADMIN, User::ROLE_BOOK_MANAGER])
            ->where('account_status', User::STATUS_ACTIVE));
    }

    private function deliver($subs, array $payload): void
    {
        if ($subs->isEmpty()) {
            return;
        }
        $expired = $this->sender->send($subs, $payload);
        if ($expired) {
            PushSubscription::whereIn('endpoint_hash', array_map([PushSubscription::class, 'hashOf'], $expired))->delete();
        }
    }
}
