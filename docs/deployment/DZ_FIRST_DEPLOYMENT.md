# Premier déploiement algérien — `smarter-academy.com`

> Ce document décrit le **BOOTSTRAP**, c'est-à-dire le premier dépôt de
> fichiers sur un compte Hostinger vide. Il ne se fait qu'**une seule fois**.
>
> Les déploiements SUIVANTS sont automatiques : `.github/workflows/deploy.yml`
> part à chaque poussée sur `main`. Ce workflow refuse délibérément de
> s'exécuter tant que le bootstrap n'a pas eu lieu — voir §6.
>
> Ne pas confondre avec `HOSTINGER_FILE_MANAGER_DEPLOYMENT.md`, qui décrit
> une MISE À JOUR du serveur **français** déjà en service.

---

## 0. État constaté (2026-09-16)

Vérifié en interrogeant le domaine, pas supposé :

| | |
|---|---|
| Domaine | `smarter-academy.com` (IP ≠ celle du produit français — master spec §2 ✅) |
| PHP servi | **8.4.19** (relevé après correction ; voir §1) |
| Contenu servi | page « Page par défaut » de Hostinger → **compte vide** |
| `/api/v1/...` | `404` → aucun backend déployé |
| Base de données | `u181216890_smarter_dz_db` créée, **vide** |
| Clé SSH de déploiement | `smarter-academy-dz`, autorisée ✅ |
| Secrets GitHub | les 5 `HOSTINGER_*` posés ✅ |
| Variables GitHub | `PRODUCTION_URL`, `VITE_API_URL` posées ✅ |

---

## 1. PHP 8.4 — non négociable

`composer.json` annonce `php ^8.3`, mais `composer.lock` épingle
`symfony/* 8.1.x`, qui exige `php >=8.4.1`.

Un serveur en 8.3 ne peut **pas** installer ce backend : `composer install`
s'arrête sur 17 conflits. Pire, un `vendor/` construit ailleurs en 8.4 se
copie sans la moindre erreur sur un hôte en 8.3 — et le site répond **500**
après coup, sans rien dans les journaux de déploiement.

hPanel → **Avancé → Configuration PHP → 8.4**.

`deploy.yml` lit désormais l'en-tête `x-powered-by` du domaine avant de
construire `vendor/`, et s'arrête avec ce remède écrit en clair.

---

## 2. Ordre des opérations

L'ordre compte : le SPA qui arrive avant l'API afficherait une interface dont
chaque appel échoue.

```
1. PHP 8.4 dans hPanel                    (§1)
2. Schéma de la base dans phpMyAdmin      (§3)
3. Téléverser l'API      → public_html/api/     (§4)
4. Écrire le .env        → public_html/api/.env (§5)
5. Téléverser le SPA     → public_html/          (§6)
6. Tests                                   (§7)
```

---

## 3. La base de données

`u181216890_smarter_dz_db` est vide. Le dépôt applique le schéma par **SQL
relu dans phpMyAdmin**, jamais par migration automatique : c'est une règle du
projet, pas une commodité (voir `HOSTINGER_FILE_MANAGER_DEPLOYMENT.md` §3).

Le schéma doit exister **avant** que l'API ne réponde, sinon toute route
touchant la base renvoie 500.

> ⚠️ Le mot de passe MySQL communiqué pendant la mise en place doit être
> **changé** : il a transité par un canal de discussion. hPanel → Bases de
> données → Modifier le mot de passe, puis reporter la nouvelle valeur dans
> `.env` (§5).

---

## 4. Téléverser l'API

Archive : **`2-api.zip`**

hPanel → **Gestionnaire de fichiers** → `domains/smarter-academy.com/public_html/`
→ créer le dossier **`api`** → y téléverser l'archive → **Extraire**.

L'archive est produite exactement avec les exclusions du workflow, donc elle
ne contient **ni** `.env`, **ni** `tests/`, **ni** `phpunit.xml`, **ni**
`node_modules/`, **ni** `bootstrap/cache/`, et son `vendor/` est construit en
`--no-dev` (ni PHPUnit, ni Pail, ni Mockery — vérifié).

Ce qu'elle contient et qu'il ne faut pas toucher :

- **`api/.htaccess`** — réécrit tout vers `public/`. C'est CE fichier qui
  empêche le web de servir `.env`, `vendor/`, `app/`. Ne pas le modifier.
- `api/public/.htaccess` — le routage interne de Laravel.

Après extraction, créer les dossiers d'état que l'archive n'emporte pas
(ils appartiennent au serveur) :

```
api/storage/framework/cache/
api/storage/framework/sessions/
api/storage/framework/views/
api/storage/logs/
api/bootstrap/cache/
```

Permissions : `storage/` et `bootstrap/cache/` doivent être **inscriptibles**
(755, ou 775 si le serveur l'exige).

---

## 5. Le fichier `.env`

Fichier : **`3-env-template.txt`** → à enregistrer sous `public_html/api/.env`

Il contient déjà une **`APP_KEY` générée pour l'Algérie** (différente de
celle du produit français : deux clés distinctes, master spec §2).

Six valeurs sont à remplacer, marquées `REMPLACER` :

| Clé | Valeur |
|---|---|
| `DB_PASSWORD` | le mot de passe MySQL (le NOUVEAU, après rotation) |
| `MAIL_HOST` / `MAIL_USERNAME` / `MAIL_PASSWORD` | le SMTP Hostinger |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console |

Points déjà réglés dans le modèle :

- `APP_DEBUG=false` — un `true` ici afficherait la trace complète, secrets
  compris, à n'importe quel visiteur.
- `APP_LOCALE=ar` — les messages rendus par Laravel lui-même (validation,
  réinitialisation) suivent l'interface arabe.
- `SESSION_DOMAIN` / `SANCTUM_STATEFUL_DOMAINS` sur `smarter-academy.com`.
- Stripe n'est pas configuré : l'accès payant algérien passe par les codes
  d'activation (§17/§18). Ne pas poser `BILLING_MODE=live`.

Pour Google, l'URI de redirection à déclarer côté Google Cloud est
exactement :

```
https://smarter-academy.com/api/v1/auth/google/callback
```

**Ce fichier ne doit jamais entrer dans le dépôt.** Le workflow ne l'écrit
pas, ne le remplace pas, et vérifie par empreinte md5 qu'il est identique
avant et après chaque déploiement.

---

## 6. Téléverser le SPA

Archive : **`1-spa-public_html.zip`** → à extraire dans `public_html/`
(à côté de `api/`, pas dedans).

Le lot a été construit avec `VITE_API_URL=https://smarter-academy.com/api/v1`,
valeur **compilée dans le bundle** — vérifié présent, et sans repli
`localhost`.

Il emporte `public_html/.htaccess`, qui renvoie toutes les routes vers
`index.html` **sauf `/api`**. Sans lui, un lien profond (`/courses`,
`/espace/...`) renvoie 404.

---

## 7. Tests après bootstrap

```bash
# Le SPA répond et monte React
curl -s https://smarter-academy.com/ | grep -c 'id="root"'

# Laravel s'exécute réellement (route publique, sans base)
curl -s https://smarter-academy.com/api/v1/legal/versions   # attendu : {"success":true,...}

# Le repli SPA fonctionne sur un lien profond
curl -o /dev/null -w '%{http_code}\n' https://smarter-academy.com/courses   # attendu : 200

# Les internes de Laravel NE sont PAS servis
curl -o /dev/null -w '%{http_code}\n' https://smarter-academy.com/api/.env          # attendu : 403 ou 404
curl -o /dev/null -w '%{http_code}\n' https://smarter-academy.com/api/composer.json # attendu : 403 ou 404
```

L'interface doit s'afficher **en arabe, de droite à gauche**, en police Cairo.

---

## 8. Ensuite : plus jamais à la main

Une fois `api/artisan` et `api/.env` en place, la garde de `deploy.yml` est
satisfaite et **chaque poussée sur `main` déploie**.

Le workflow reste volontairement prudent :

- `rsync` **sans `--delete`** — rien n'est jamais supprimé du serveur ;
- `.env`, `storage/`, `bootstrap/cache/` exclus du transfert ;
- **aucune migration automatique** — le SQL reste relu à la main ;
- les caches sont vidés, jamais chauffés (`config:cache` écrirait un
  `config.php` qui prendrait le pas sur `.env`) ;
- il refuse de partir si un domaine `smarter-academy.fr` apparaît dans ses
  variables (master spec §2).


## Unité 1 du manuel (phase 8) — à appliquer sur Hostinger

1. **Schéma** : `docs/deployment/HOSTINGER_UNIT1_MIGRATION.sql` (cinq migrations additives + lignes `migrations`). Sauvegarder, relire, exécuter dans phpMyAdmin.
2. **Données** : `docs/deployment/HOSTINGER_UNIT1_CURRICULUM_DATA.sql`, généré par `php artisan smarter:curriculum-sql --grade=4am --retire-lesson=pgcd` — upserts PAR CODE, rejouables, sans DELETE, sans toucher `publication_status`. Les nouveaux modules/ressources/exercices naissent `draft`.
3. **Pratique** : synchroniser `content/practice/` (dossier `4am/`, `policy.json`, `misconceptions.json`, `index.generated.json`) à côté de l'API.

## Enseignants, classes et offres configurables — à appliquer sur Hostinger

1. **Schéma + offres initiales** : `docs/deployment/HOSTINGER_TEACHER_PLANS_MIGRATION.sql`
   (douze migrations additives `2026_09_26_*` puis quatre `2026_09_27_*`
   — tarification par sièges —, lignes `migrations`, puis le miroir de
   `PlanSeeder` en upserts rejouables). Sauvegarder, relire, exécuter dans
   phpMyAdmin. Le bloc « VÉRIFICATION » doit rendre 11 tables, 10 + 3 + 4
   colonnes, 16 lignes de migration, 3 offres (dont la grille de 6 paliers de
   `teacher-seats`) et **exactement une** offre enseignant par défaut. Si `artisan` est disponible, l'équivalent est
   `php artisan migrate --force && php artisan db:seed --class=PlanSeeder --force`.
2. **`.env`** : `FRONTEND_URL` doit être l'URL publique du SPA — les liens
   d'invitation (`/rejoindre/{token}`) en dérivent. Facultatif :
   `CLASSROOM_INVITATION_TTL_DAYS` (14), `CLASSROOM_INVITATION_URL`,
   `CLASSROOM_ACTIVE_WINDOW_DAYS` (7). Aucune limite commerciale n'est dans
   `.env` : elles sont dans les offres, modifiables depuis le panneau.
3. **Courriel** : les invitations de classe et les codes d'activation
   individuels partent par le pipeline mail existant (`MAIL_*`). Sans mail
   fonctionnel, un enseignant peut toujours donner son رمز الانضمام à l'oral,
   et l'administrateur voit le code individuel une fois à l'écran.
4. **Rien à faire pour les élèves existants** : sans classe, ils sont
   « indépendants » et `/content/availability` ne change pas ; leurs codes et
   droits actuels restent valides (colonnes ajoutées nullable).
5. **Après** : ouvrir `/admin/offres` et relire `teacher-free` (5 sièges,
   classes illimitées), la grille de `teacher-seats` (1–5 gratuit, 6–20 →
   1 000 DA, 21–30 → 800 DA, 31–50 → 700 DA, 51–100 → 600 DA, 101+ → 500 DA
   par élève) et `student-premium` — ce sont des valeurs de départ, pas des
   règles : elles se changent en publiant une nouvelle version. Une base
   Les noms et descriptions d'offre sont en ARABE (c'est ce que l'enseignant
   lit) ; une base semée avant cette règle garde ses anciens noms français et
   doit être corrigée depuis `/admin/offres`, offres archivées comprises.
   Une base semée AVANT le modèle par sièges garde son ancien `teacher-free` : publier
   une nouvelle version de cette offre (capacité 5, limites techniques vides)
   et archiver `teacher-basic` / `teacher-pro`. Contrat :
   `docs/architecture/TEACHER_CLASSROOM_ARCHITECTURE.md`.
