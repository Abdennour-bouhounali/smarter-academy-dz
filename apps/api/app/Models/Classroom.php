<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * La classe d'un professeur (« القسم »). Voir la migration.
 *
 * `teacher_id` n'est PAS assignable en masse : c'est ClassroomService qui le
 * pose, depuis l'utilisateur authentifié, jamais depuis un corps de requête.
 */
class Classroom extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_ARCHIVED = 'archived';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUSES = [self::STATUS_ACTIVE, self::STATUS_ARCHIVED, self::STATUS_SUSPENDED];

    protected $fillable = [
        'name',
        'description',
        'grade',
        'academic_year',
        'status',
        'join_code',
        'join_code_enabled',
        'archived_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
        'join_code_enabled' => true,
    ];

    protected function casts(): array
    {
        return [
            'join_code_enabled' => 'boolean',
            'archived_at' => 'datetime',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(ClassroomMembership::class);
    }

    public function activeMemberships(): HasMany
    {
        return $this->hasMany(ClassroomMembership::class)->where('status', ClassroomMembership::STATUS_ACTIVE);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(ClassroomInvitation::class);
    }

    public function lessonSettings(): HasMany
    {
        return $this->hasMany(ClassroomLesson::class);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /** Compte dans la limite de classes : tout ce qui n'est pas archivé. */
    public function scopeCountingTowardsLimit(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('status'), '!=', self::STATUS_ARCHIVED);
    }

    public function scopeOwnedBy(Builder $query, User $teacher): Builder
    {
        return $query->where($query->qualifyColumn('teacher_id'), $teacher->id);
    }
}
