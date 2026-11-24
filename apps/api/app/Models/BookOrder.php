<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Une commande de livre. Le total et l'état du paiement sont CALCULÉS (jamais
 * stockés) : le frais de livraison peut changer après coup (l'admin le corrige
 * à l'appel de confirmation) et les paiements sont des lignes — une valeur
 * stockée serait fausse dès le premier changement. Le frais lui-même est figé à
 * la commande par le tarif du transporteur (DeliveryFees) quand un mode est choisi.
 *
 * Deux états indépendants, corrigibles librement (2026-11-24) : l'appel
 * (`call_status`) et le colis (`delivery_status`, NULL tant qu'il n'est pas expédié).
 */
class BookOrder extends Model
{
    // L'appel de confirmation (call_status).
    public const CALL_NEW = 'new';

    public const CALL_CONTACTED = 'contacted';

    public const CALL_NO_ANSWER = 'no_answer';

    public const CALL_CONFIRMED = 'confirmed';

    public const CALL_CANCELLED = 'cancelled';

    public const CALL_STATUSES = [self::CALL_NEW, self::CALL_CONTACTED, self::CALL_NO_ANSWER, self::CALL_CONFIRMED, self::CALL_CANCELLED];

    // Le colis (delivery_status) ; NULL = pas encore expédié.
    public const SHIPPED = 'shipped';

    public const IN_TRANSIT = 'in_transit';

    public const DELIVERED = 'delivered';

    public const RETURNED = 'returned';

    public const DELIVERY_STATUSES = [self::SHIPPED, self::IN_TRANSIT, self::DELIVERED, self::RETURNED];

    protected $fillable = [
        'reference', 'book_id', 'customer_name', 'phone', 'email', 'wilaya', 'commune',
        'address', 'customer_note', 'quantity', 'unit_price', 'delivery_fee', 'delivery_mode', 'call_status', 'delivery_status', 'admin_note',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'delivery_fee' => 'integer',
        ];
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(BookOrderPayment::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(BookOrderEvent::class);
    }

    public function subtotal(): int
    {
        return $this->unit_price * $this->quantity;
    }

    public function total(): int
    {
        return $this->subtotal() + (int) $this->delivery_fee;
    }

    /** Encaissé net : paiements moins remboursements. */
    public function paidAmount(): int
    {
        $payments = $this->relationLoaded('payments') ? $this->payments : $this->payments()->get();

        return (int) $payments->sum(fn (BookOrderPayment $p) => $p->kind === BookOrderPayment::REFUND ? -$p->amount : $p->amount);
    }

    /** unpaid | partial | paid | overpaid */
    public function paymentStatus(): string
    {
        $paid = $this->paidAmount();

        return match (true) {
            $paid <= 0 => 'unpaid',
            $paid < $this->total() => 'partial',
            $paid === $this->total() => 'paid',
            default => 'overpaid',
        };
    }

    /** Une commande vivante : ni annulée à l'appel, ni retournée. */
    public function isLive(): bool
    {
        return $this->call_status !== self::CALL_CANCELLED && $this->delivery_status !== self::RETURNED;
    }

    /** Seule une commande annulée ou retournée peut être supprimée. */
    public function isDeletable(): bool
    {
        return ! $this->isLive();
    }
}
