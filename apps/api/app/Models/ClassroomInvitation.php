<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Une invitation nominative à rejoindre une classe. Le jeton n'existe qu'en
 * empreinte (voir la migration) ; `expired` est dérivé, jamais stocké.
 */
class ClassroomInvitation extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_REVOKED = 'revoked';

    /** Dérivé : pending dont expires_at est passé. */
    public const STATUS_EXPIRED = 'expired';

    public const STORED_STATUSES = [self::STATUS_PENDING, self::STATUS_ACCEPTED, self::STATUS_REVOKED];

    protected $fillable = [
        'email',
        'token_hash',
        'token_hint',
        'status',
        'expires_at',
        'accepted_at',
        'accepted_by',
        'revoked_at',
        'revoked_by',
        'invited_by',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    /** L'empreinte ne sort jamais dans une réponse. */
    protected $hidden = ['token_hash'];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function acceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }

    public function effectiveStatus(?Carbon $now = null): string
    {
        if ($this->status !== self::STATUS_PENDING) {
            return $this->status;
        }

        $now ??= Carbon::now();

        return $this->expires_at !== null && $this->expires_at->lessThanOrEqualTo($now)
            ? self::STATUS_EXPIRED
            : self::STATUS_PENDING;
    }

    public function isAcceptable(?Carbon $now = null): bool
    {
        return $this->effectiveStatus($now) === self::STATUS_PENDING;
    }

    /** Les invitations qui comptent dans la limite : en attente et non périmées. */
    public function scopeOpen(Builder $query, ?Carbon $now = null): Builder
    {
        $now ??= Carbon::now();

        return $query->where('status', self::STATUS_PENDING)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', $now));
    }
}
