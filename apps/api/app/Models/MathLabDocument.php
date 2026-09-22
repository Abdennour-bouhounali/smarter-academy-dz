<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un document du مختبر الرياضيات : le travail d'un élève dans UN instrument
 * (سبّورة, et demain d'autres). `tool` nomme l'instrument, `data` porte son
 * état sérialisé — opaque pour le serveur, versionné par `schema_version`.
 */
class MathLabDocument extends Model
{
    protected $fillable = [
        'user_id',
        'tool',
        'title',
        'schema_version',
        'data',
        'data_bytes',
    ];

    protected $casts = [
        'schema_version' => 'integer',
        'data' => 'array',
        'data_bytes' => 'integer',
    ];

    /** Les colonnes d'une LISTE : tout sauf `data`, qui peut peser lourd. */
    public const SUMMARY_COLUMNS = ['id', 'user_id', 'tool', 'title', 'schema_version', 'data_bytes', 'created_at', 'updated_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
