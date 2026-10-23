<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Mastery V2 — chaque nuit, un échantillon de couples (élève, point) est
// rejoué et comparé à l'état enregistré. Un écart est journalisé
// (`state.verify_mismatch`) ; la commande ne corrige rien.
\Illuminate\Support\Facades\Schedule::command('smarter:mastery:verify')->dailyAt('03:30')->withoutOverlapping();

// Photos de copie (prototype BEM, 2026-10-06) : effacées au bout de 12 mois.
\Illuminate\Support\Facades\Schedule::command('smarter:answer-images:purge')->dailyAt('04:10')->withoutOverlapping();

// « فضاء الوليّ » : le résumé de la semaine écoulée, chaque dimanche matin à Alger
// (PARENT_SPACE.md §5). La commande est idempotente.
\Illuminate\Support\Facades\Schedule::command('smarter:family:weekly-reports')
    ->weeklyOn(0, '08:00')->timezone('Africa/Algiers')->withoutOverlapping();
