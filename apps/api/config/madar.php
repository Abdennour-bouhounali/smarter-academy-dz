<?php

/*
|--------------------------------------------------------------------------
| « مدار » — le jeu de l'espace élève
|--------------------------------------------------------------------------
|
| docs/architecture/MADAR_GAME.md. L'enseignant affine `hearts.daily_free`,
| `runs.daily_cap` et la portée des questions pour SA classe
| (madar_class_settings) ; ces valeurs-ci sont les défauts.
|
| `physics` est le MIROIR des constantes du moteur client
| (apps/web/src/features/madar/engine/constants.js). Le serveur ne rejoue pas
| la partie : il borne le score annoncé par ce que la durée réelle rend
| possible (MadarScoring::maxPlausible). Une constante du client qui augmente
| le score possible doit être reportée ici, sinon de vrais scores seraient
| ramenés à la borne.
|
*/

return [
    'enabled' => (bool) env('MADAR_ENABLED', true),

    'timezone' => 'Africa/Algiers',

    'hearts' => [
        'max' => 5,
        // Versés au premier passage du jour (jamais au-delà de ce nombre).
        'daily_free' => 3,
        // Cœurs rendus par une réponse juste à la « محطة التزوّد ».
        'per_correct' => 1,
    ],

    'runs' => [
        // Parties par jour et par élève — la limite de temps d'écran.
        'daily_cap' => 30,
        // Reprises après un crash, par partie (chacune coûte un cœur).
        'max_revives' => 2,
        // Au-delà, une partie ouverte est abandonnée.
        'max_minutes' => 30,
    ],

    'refuel' => [
        // Combien de candidats le sélecteur classe à chaque service.
        'pool' => 8,
        // Un item déjà servi en approvisionnement ces jours-ci attend son tour.
        'cooldown_days' => 3,
        // Une question servie et non répondue reste la même pendant ce temps.
        'open_minutes' => 30,
        // Le temps de réponse (secondes) selon la difficulté de l'item (1–5).
        // L'enseignant l'affine pour sa classe, puis question par question.
        'time_limits' => [1 => 45, 2 => 60, 3 => 90, 4 => 120, 5 => 150],
        'default_time_limit' => 90,
        'time_limit_range' => [15, 600],
        // La latence du réseau : une réponse arrivée dans ce délai en plus compte encore.
        'grace_seconds' => 3,
        // « Trop rapide » : juste, difficulté ≥ min, en moins de max(seconds, ratio × délai).
        'fast' => ['min_difficulty' => 3, 'seconds' => 5, 'ratio' => 0.12],
        // Une absence de la page plus courte n'est pas comptée (notification, clavier).
        'leave_min_ms' => 1500,
    ],

    // Les cœurs que l'enseignant donne ou retire en une fois.
    'adjustments' => ['max_delta' => 5],

    // « دفاع الكوكب » — MIROIR de apps/web/src/features/madar/defense/constants.js
    // › SCHEDULE. Le calendrier des vagues est FIXE (pas d'appel anticipé) :
    // la vague k commence à un instant connu, donc la durée réelle borne la
    // vague atteinte et le score (DefenseScoring).
    'defense' => [
        'first_wave_at' => 4,
        'spawn_base' => 10,
        'spawn_per_wave' => 1,
        'spawn_max' => 22,
        'breather' => 5,
        'enemies_base' => 6,
        'enemies_per_wave' => 2,
        'enemies_cap' => 40,
        'max_enemy_points' => 15,
        'boss_every' => 5,
        'boss_points' => 150,
        'wave_points' => 100,
        'tolerance' => 1.1,
        'slack' => 100,
    ],

    // « المستكشف » : les niveaux, la physique et le barème vivent dans UN
    // fichier commun au moteur web et à l'API (ExplorerLevels).
    'explorer' => [
        'levels_path' => resource_path('games/explorer/levels.json'),
        // Un niveau ne se traverse pas plus vite que distance / vitesse × ce facteur.
        'min_duration_factor' => 0.8,
        'slack' => 50,
    ],

    // « قنّاص القيم » — MIROIR de apps/web/src/features/madar/sniper/constants.js
    // › SCHEDULE. Les manches suivent un calendrier FIXE : la durée réelle borne
    // la manche atteinte et le score (SniperScoring). Le jeu est GRATUIT : il ne
    // coûte aucun cœur (ses mathématiques sont le jeu lui-même) et n'a pas de reprise.
    'sniper' => [
        'first_at' => 2.5,
        'cards_per_round' => 8,
        'gap_start' => 1.6,
        'gap_min' => 0.85,
        'gap_step' => 0.05,
        'fall_start' => 7.5,
        'fall_min' => 4,
        'fall_step' => 0.2,
        'breather' => 2.5,
        'rounds_per_level' => 3,
        'max_level' => 6,
        'points_per_level' => 10,
        'max_multiplier' => 4,
        'perfect_bonus' => 50,
        'tolerance' => 1.1,
        'slack' => 100,
    ],

    'physics' => [
        'omega_start' => 1.25,
        'omega_accel' => 0.018,
        'omega_max' => 3.6,
        'points_per_rad' => 8,
        'star_points' => 3,
        'max_multiplier' => 4,
        'star_min_gap_rad' => 0.35,
        'near_miss_points' => 10,
        'obstacle_min_gap_rad' => 0.85,
        // Marge de la borne (latence, arrondis) — ×1,25 puis + slack.
        'tolerance' => 1.25,
        'slack' => 200,
    ],
];
