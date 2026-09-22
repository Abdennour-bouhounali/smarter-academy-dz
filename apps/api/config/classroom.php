<?php

/**
 * Les réglages TECHNIQUES des classes d'enseignants. Aucune limite
 * commerciale ici : classes maximum, élèves par classe, etc. sont des
 * données d'offre (plan_entitlements), configurées par l'administration.
 */
return [
    // Combien de jours une invitation par courriel reste acceptable.
    'invitation_ttl_days' => (int) env('CLASSROOM_INVITATION_TTL_DAYS', 14),

    // Où le lien d'invitation envoie l'élève. Le frontend accepte ensuite le
    // jeton via l'API ; le serveur reste l'autorité.
    'invitation_url' => env('CLASSROOM_INVITATION_URL', env('FRONTEND_URL', 'http://localhost:5173').'/rejoindre/{token}'),

    // « Actif ces N derniers jours » pour la progression de classe.
    'active_window_days' => (int) env('CLASSROOM_ACTIVE_WINDOW_DAYS', 7),
];
