<?php

/**
 * Les réglages TECHNIQUES des classes d'enseignants. Aucune limite
 * commerciale ici : classes maximum, élèves par classe, etc. sont des
 * données d'offre (plan_entitlements), configurées par l'administration.
 */
return [
    // (Pas d'URL de lien de classe ici : le serveur ne rend que le jeton, et
    // le client compose /rejoindre/classe/{jeton} sur sa propre origine.
    // L'invitation par courriel et ses réglages ont été retirés le 2026-10-01.)

    // La version du TEXTE de partage que l'élève accepte en rejoignant un
    // قسم (student.json → qism.consent.*). Changer le texte = changer cette
    // version : les élèves qui ont accepté l'ancien se le voient redemander.
    'consent_version' => env('CLASSROOM_CONSENT_VERSION', '2026-09-25'),

    // Le fuseau des fenêtres « cette semaine », « les 14 derniers jours » que
    // lit l'enseignant. Le stockage reste en UTC.
    'timezone' => env('CLASSROOM_TIMEZONE', 'Africa/Algiers'),
];
