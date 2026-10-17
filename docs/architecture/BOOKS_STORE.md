# La librairie — livres papier vendus par la plateforme

> **Faisant autorité pour** : le catalogue public `/books`, la page d'un livre
> (`/books/:slug`), la commande SANS paiement en ligne, le formulaire de
> contact d'un livre, et le suivi administrateur (commandes, livraison,
> encaissements, messages). Établi le 2026-10-17 par l'intégration du site
> autonome du premier livre (« بروتوكول SMART لحل المسائل الرياضية »).
> Le code est la source de vérité ; ce fichier le décrit.

## 1. Décision d'architecture

La librairie est un **module de la plateforme** (`smarter-academy.com/books`),
pas un site à part (`books.…`). Un compte, une API (Laravel), une base, un
panneau d'administration. Le livre n'est PAS lu en ligne : la page est une
vitrine + une demande de commande.

L'ancien site (React + Express + Postgres) n'est pas repris tel quel : son
contenu (textes, FAQ, chiffres, images, wilayas, champs du formulaire de
contact) est porté ; son backend est remplacé par l'API Laravel.

## 2. Modèle de données (migration `2026_10_17_000001`)

| Table | Rôle |
|---|---|
| `books` | un livre : `slug`, titre, prix (DA, entier), `status` (`draft` \| `published`), `content` JSON (badge, stats, steps, highlights, faq), `gallery` JSON |
| `book_orders` | une commande : client, wilaya/commune/adresse, `quantity`, `unit_price` **figé**, `delivery_fee` **NULLABLE** (fixé plus tard), `status` |
| `book_order_payments` | un encaissement = UNE ligne (`payment` ou `refund`, montant, méthode, date) |
| `book_order_events` | l'historique d'une commande (création, états, livraison, paiements) |
| `book_messages` | la boîte de réception des formulaires de contact des pages livres |

Règles :
- **Total et état du paiement sont CALCULÉS** (`BookOrder::total()`,
  `paymentStatus()` : `unpaid | partial | paid | overpaid`), jamais stockés.
- Le prix d'une commande est figé : modifier le prix du livre ne réécrit pas
  les commandes reçues.
- États : `pending → confirmed → in_way → delivered`, `→ cancelled` (avant
  l'expédition), `→ returned` (depuis `in_way`/`delivered`). Transitions
  contrôlées par `BookOrder::TRANSITIONS` (422 sinon). Seule une commande
  annulée ou retournée peut être supprimée.
- Un remboursement ne peut dépasser l'encaissé.
- Aucun frais de livraison n'est calculé : le formulaire dit « تُحدَّد لاحقًا »,
  l'administrateur le saisit sur la commande (`PATCH /admin/book-orders/{id}`).

## 3. API (`/api/v1`)

Public (`BookStoreController`) : `GET /books`, `GET /books/{slug}`,
`GET /books/wilayas`, `POST /books/{slug}/orders` (limiteur nommé `book-orders` : 8 / 10 min / IP),
`POST /books/messages` (`book-messages` : 5 / 10 min / IP). Limiteurs NOMMÉS
(`AppServiceProvider`) : un `throttle:8,10` en ligne partagerait sa clé « domaine|IP »
avec les autres routes publiques et la navigation l'épuiserait. Un livre en brouillon répond 404.
Les deux POST ont un **pot de miel** (champ caché `website`) : rempli → faux
succès, rien d'enregistré. Le téléphone est validé (format algérien) et la
wilaya doit appartenir à `App\Domain\Books\Wilayas`.

Admin (`can:admin`, `/admin/…`) : `books` (liste, création, mise à jour),
`book-orders` (liste filtrable `status|bookId|wilaya|paymentStatus|search`,
`stats`, fiche, `PATCH` livraison/note, `PATCH …/status`, `POST …/payments`,
`DELETE`), `book-order-payments/{id}` (DELETE), `book-messages` (liste, PATCH
état/note). Gestes journalisés (`ActivityLogger::BOOK_*`). Les formes JSON
sont dans `Domain/Books/BookPresenter.php` (camelCase).

## 4. Frontend

- Public (lots paresseux sous `MainLayout`) : `features/books/` —
  `BooksPage` (catalogue), `BookDetailPage` (présentation, étapes SMART,
  galerie, commande, FAQ, contact), `OrderForm`, `ContactForm`,
  `bookService.js`.
- Chaînes arabes : `features/books/strings.js` (module local, **pas** un
  namespace i18n : rien de la librairie n'entre dans le lot d'entrée).
- Contenu d'une page livre : entièrement tiré de la fiche (`content` JSON,
  éditable dans « الكتب »). Un nouveau livre = une ligne, aucun code.
- Admin : `pages/admin/books/` — `BookOrders` (chiffres + liste),
  `BookOrderDetail` (état, livraison, paiements, historique),
  `BookCatalog` (fiches), `BookMessages`. Routes `/admin/livres/*`, section
  « الكتب » de la barre latérale. Images : `public/images/books/<slug>/`.
- Lien « الكتب » dans la navigation visiteur (`data/navigation.js`).
- **Chargement sans cascade (2026-10-17)** : `features/books/bookCache.js` (importé par `App.jsx`,
  ne dépend que d'`apiClient`) lance `/books` ou `/books/:slug` DANS le `lazy()` de la route — les
  données partent avec le lot de la page, pas après lui. Une carte de la liste précharge la fiche et le
  lot `BookDetailPage` au survol / focus (`prefetchBookPage`). Une réponse reçue est rendue tout de suite
  au retour (`peekBook`, `peekBooks`), gardée 5 min puis redemandée en arrière-plan. Les pages publiques
  lisent `bookCache` ; `bookService.js` garde les écritures (commande, message) et l'admin.
- **Conversion, téléphone d'abord (2026-10-17)** — le lien arrive par WhatsApp : la page d'achat
  est la SEULE surface de la plateforme conçue aussi pour le téléphone (le reste : tablette et
  ordinateur). `BookHero` : sur téléphone l'image compacte d'abord, puis titre, prix « للنسخة »,
  bouton pleine largeur et trois garanties vérifiées (`S.detail.trust` : sans paiement en ligne,
  appel de confirmation, 58 wilayas) — résumé et auteur APRÈS (`order-last`), pour que l'achat
  tienne au-dessus du pli. `StickyOrderBar` (< lg) : prix + « اطلب نسختك » collés en bas dès que
  le bouton du haut sort de la vue, effacés quand le formulaire est à l'écran. Étapes SMART en
  cartes compactes, galerie en carrousel glissé au pouce, espacements resserrés. Formulaire :
  courriel et note repliés (« + بريد إلكتروني أو ملاحظة »), `autocomplete` adresse.
- **Aucun saut de mise en page** : squelettes à la forme des cartes / de la présentation pendant le
  chargement ; l'image de présentation est dans une boîte de hauteur fixe (`h-[420px] lg:h-[540px]`,
  `fetchpriority="high"`). CLS de la fiche mesuré 0,44 avant ce changement.

## 5. Premier livre et mise en service

`php artisan db:seed --class=BookSeeder` crée `smart-protocol` (idempotent,
n'écrase jamais une fiche existante ; aussi appelé par `DatabaseSeeder`).

## 6. Non implémenté / à venir

- Frais de livraison par wilaya et transporteur (« set later » par le
  propriétaire) : aujourd'hui saisis à la main, commande par commande.
- Paiement en ligne : volontairement absent.
- Stock, export CSV des commandes, notification (e-mail/WhatsApp) à la
  réception d'une commande.

## 6bis. Aperçu de partage (WhatsApp / Facebook / Telegram)

Les robots de partage lisent le HTML sans exécuter React. Le build écrit donc,
pour chaque entrée de `apps/web/src/features/books/shareCards.json`, un fichier
`dist/share/<path>.html` (`share/books.html`, `share/books/smart-protocol.html`) = l'`index.html` du build dont `<title>`, description,
`og:*`, `twitter:*` et `canonical` parlent de CETTE page
(`apps/web/vite-plugin-share-pages.js`, testé par `vite-plugin-share-pages.test.js`), et remplace
le marqueur `# @share-pages` de `dist/.htaccess` par UNE règle explicite par page
(`RewriteRule ^books/smart-protocol/?$ share/books/smart-protocol.html [L]`, avec ou sans « / » final).
**Aucun dossier ni fichier ne porte le chemin public** : LiteSpeed (Hostinger) redirige tout dossier
existant vers « …/ » AVANT les règles de réécriture et ignore `DirectorySlash` — jusqu'au 2026-10-17,
`dist/books/smart-protocol/index.html` coûtait un 301 avant tout affichage. Le déploiement efface les
restes des anciens builds (`books/`, `books.html` à la racine ; rsync ne supprime rien) et vérifie que
`/books/smart-protocol` répond 200 avec sa page de partage (`deploy.yml`, « Verify the assets and SPA routing »).

**Le premier écran de la fiche est dans le HTML (2026-10-17).** Pour une carte de livre, le
plugin lit le livre à l'API (`VITE_API_URL`, délai 8 s) pendant le build et écrit :
- le composant RÉEL `features/books/BookHero.jsx` rendu par `react-dom/server` (aucune copie à
  maintenir : BookHero doit rester pur — ni hook, ni contexte, ni routeur ; le lien « كل الكتب »
  est une prop `LinkComponent`), dans un calque `#sa-static-shell` posé AU-DESSUS de `#root`
  (avec une barre de navigation réduite) ; l'écran « جارٍ تحميل Smarter Academy » est retiré ;
- `window.__SA_BOOK_SNAPSHOT__` (lu par `bookCache.js` : la fiche React s'affiche sans attendre
  l'API, puis se met à jour — prix compris — si le livre a changé depuis le build) ;
- `<link rel="preload">` de l'image et `<link rel="modulepreload">` du lot `BookDetailPage` et
  de ses imports.
`BookDetailPage` retire le calque (`removeStaticBookShell`) une fois la vraie fiche montée :
jamais d'écran blanc. Si l'API ne répond pas au build, la page reste une simple page de partage
(avertissement dans le log du build). Mesuré (téléphone 390×844 et tablette, 1,6 Mbit/s, 4× CPU) :
contenu visible à ≈ 1,0 s au lieu de 4,8 s, sans écran de chargement. **Un nouveau livre** : une entrée dans `shareCards.json`,
sa carte 1200×630 dans `public/og/` (`python3 scripts/og-book-card.py <couverture>.webp "<titre>"
--eyebrow "…" -o apps/web/public/og/<slug>.png` : la VRAIE couverture + le titre ;
`scripts/og-card.py` reste le gabarit texte seul) et une ligne dans
`public/sitemap.xml`. Le premier livre : `og/smart-protocol.png`.
Limite : titre/description de partage sont figés au build — les modifier dans
l'admin ne change pas l'aperçu avant un nouveau build.

## 7. Tests

`apps/api/tests/Feature/BookStoreTest.php` (vitrine, prix figé, validation,
pot de miel, états, livraison, paiements, statistiques, interdiction élève) ;
le balayage `AdminAuthorizationTest` couvre les routes `/admin/book*`.
