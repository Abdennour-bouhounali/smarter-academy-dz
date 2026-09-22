# Le cahier de l'élève (📓 كرّاسي)

Le cahier est **la représentation de l'élève** de ce qu'il veut garder : ses
mots, ses erreurs, ses explications. Il n'est ni une seconde carte des
connaissances, ni une copie de la leçon.

| Surface | Rôle | Écrit par |
|---|---|---|
| 🧠 Carte des connaissances (`lessons/common/knowledge`) | le savoir de la plateforme, cumulé au fil des modules | la leçon (`knowledge.jsx`) — **lecture seule** pour l'élève |
| ⭐ À retenir (`KnowledgeSnapshot`) | présentation de la carte en fin de module | la leçon |
| 📈 Maîtrise (`LearningPointMastery`, `/practice/overview`) | l'état démontré de l'apprentissage | le moteur d'exercices |
| 📓 Cahier (`features/practice/notebook`) | les notes personnelles, rattachées à l'endroit où elles ont été prises | **l'élève** |

**Personne d'autre que l'élève ne lit le cahier.** Ni la fiche élève de
l'administration (`StudentDossier`), ni l'enseignant d'un قسم (progression de
classe ou d'élève, `TEACHER_CLASSROOM_ARCHITECTURE.md` §4) n'y accèdent :
quitter ou être retiré d'une classe ne touche pas une note.

**L'enseignant a SON cahier.** Les mêmes pages (`NotebookSpace`, `NoteDetail`,
`ReviewSession`) et la même fenêtre flottante servent l'enseignant sous
`/enseignant/cahier[/revision|/:noteId]` ; les liens se construisent depuis
`useWorkspaceBase()` (`notebookPaths(base)` dans `noteMeta.js`), jamais en dur.
Le serveur ne sert que les notes du compte authentifié : un enseignant ne
voit ni la note d'un élève ni celle d'un autre enseignant (404). Une note
d'exercice ouverte depuis le cahier de l'enseignant renvoie à la leçon, la
pratique étant une surface d'élève (`TEACHER_CLASSROOM_ARCHITECTURE.md` §8b).

Rien ne passe de la carte au cahier tout seul : « أضف إلى كرّاسي »
(`AddToNotebookButton`) dépose le titre et le résumé d'une connaissance comme
*point de départ*, que l'élève réécrit. La carte n'est jamais modifiée depuis
le cahier ; le cahier ne touche ni à la maîtrise ni à la progression.

## Trois surfaces, une table

| | Répond à | Où |
|---|---|---|
| Cahier **flottant** (`NotebookWindow`) | « j'apprends, je note ça maintenant » | dans la leçon et l'exercice |
| **Mon cahier** (`/espace/cahier`, `notebook/space/`) | « j'ai écrit beaucoup : retrouver, ranger, imprimer, réviser » | espace élève |
| Ma progression (`/espace/progression`) | « où en suis-je ? » | espace élève — ne liste plus les notes, y renvoie |

`Mon cahier` lit les mêmes `notebook_notes` avec recherche, filtres, tri et
pagination **côté serveur** (`NotebookService::search`) ; les vues (toutes,
à revoir, erreurs, questions, importantes, archivées) sont des filtres. Les
colonnes ajoutées pour l'espace : `title`, `note_type`, `is_pinned`,
`archived_at`, la file de révision (`next_review_at`, `last_reviewed_at`,
`review_count` — l'intervalle double, prêt pour une répétition espacée) et
`content_text`, le texte nu qui sert la recherche (chercher « span » ne
trouve rien). La hiérarchie classe → domaine → leçon vient des facettes du
serveur + du catalogue, jamais d'une seconde structure.

## Une seule fenêtre

```
App
└── NotebookProvider            ← LA fenêtre (NotebookWindow), au-dessus du routeur
    └── Router
        ├── leçon (buildLessonRoutes → LazyLessonKnowledgeProvider)
        │   ├── <Module />
        │   └── <LessonNotebookAnchor config module />   publie la POSITION + déclencheur « 📓 كرّاسي »
        ├── pratique (PracticeSession → NotebookButton)  ouvre sur le contexte exercice/question
        └── Mon cahier (NotebookSpace / NoteDetail)       retrouve, rouvre, révise
```

`NotebookProvider` porte deux états **indépendants** :

- `location` — où l'élève est (publiée par la coquille de la leçon, retirée
  au démontage). C'est ce que le prochain « ouvrir » capturera.
- `session` — le contexte **capturé au moment de l'ouverture**, la note
  rouverte s'il y en a une, le contenu de départ. La session ne suit pas la
  navigation : une note commencée dans le module A reste du module A si
  l'élève passe au module B. Il ferme et rouvre pour écrire « ici ».

La fenêtre est un **compagnon non modal** : pas de voile, pas de gel du
défilement, pas de piège à Tab. La leçon reste utilisable, on change de module
avec le cahier ouvert. Échap ferme depuis l'intérieur seulement.

Ouvrir ne crée **rien** en base. La note naît au premier « حفظ » (POST) ;
les suivants modifient la même note (PATCH). Le brouillon local
(`useNoteDraft`, localStorage) est un filet, pas une source de vérité ; sa clé
est l'endroit complet (leçon/module/point/exercice/question) et il porte
l'id de la note dès qu'elle existe, pour qu'une restauration ne crée jamais
de doublon.

## Le contexte (`noteContext.js`)

```
{ lessonCode, moduleNumber, learningPointCode, exerciseId, questionId }   ← la donnée, envoyée au serveur
{ lessonTitle, moduleTitle, moduleSlug, learningPointTitle, …Path }        ← affichage, résolus côté client / API
```

Priorité du plus précis au plus large : question → exercice → point → module
→ leçon ; **le plus précis n'efface jamais le plus large**. Rien n'est
inventé : un module qui enseigne plusieurs points n'en désigne aucun ; la
page d'accueil de la leçon n'a pas de module.

Le serveur (`NotebookService::resolveContext`) refuse (422) tout contexte
incohérent : point hors de sa leçon, module inconnu de la leçon, exercice
d'une autre leçon, question absente de l'exercice. **Modifier une note ne
change jamais son contexte** — `update()` n'accepte que le contenu, le type
d'erreur et l'état « traitée ».

Colonnes : `lesson_id`, `learning_point_id`, `module_number` (numéro, pas FK :
même règle que `exercise_id`/`question_id`, chaînes de contenu versionné),
`exercise_id`, `question_id`. L'état d'interface (position à l'écran, taille)
n'y entre jamais.

## Contenu

`content` : texte brut (notes antérieures) ou HTML restreint (éditeur).
`isRichContent()` distingue les deux ; `sanitizeHtml()` (liste blanche) passe
à l'enregistrement **et** au rendu ; KaTeX dessine les `$…$` après. Voir
`noteContent.js`.

## Vérifications

- `apps/web/src/features/practice/notebook/*.test.js` — logique pure.
- `apps/api/tests/Feature/NotebookFlowTest.php` — propriété, contexte, refus.
- `apps/web/e2e/notebook.mjs` — l'exercice, huit tailles d'écran, glisser.
- `apps/web/e2e/notebook-lesson.mjs` — la leçon : contexte, navigation, brique, retour, sécurité.
- `apps/web/e2e/notebook-space.mjs` — Mon cahier : compteurs, vues, recherche, filtres, carte, page, groupé, impression, révision, mobile.
