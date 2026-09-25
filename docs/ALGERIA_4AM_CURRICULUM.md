# Programme 4AM — inventaire de curriculum

**Classe** : السنة الرابعة متوسط (4AM) · **Matière** : الرياضيات · **Année** : 2026/2027 · **Génération** : الجيل الثاني

## 0. Statut et autorité de ce document

Ce document est l'**inventaire de curriculum** du projet pour la 4AM. Il ne
contient aucune leçon : il décrit ce qui doit être construit, dans quel ordre,
et ce qui reste à décider.

| Élément | Statut |
|---|---|
| Programme officiel (4 domaines, ci-dessous) | **FOURNI par le propriétaire du projet** (2026-09-16) |
| Découpage en leçons | **FAIT (phase 7)** — un sujet = une leçon, soit 28 leçons |
| Points d'apprentissage (LP) | **FOURNIS par le propriétaire (phase 7)** — 185, en arabe |
| Contenu des leçons | **EN COURS (phase 8)** — unité 1 du manuel (8 leçons + synthèse) écrite ; voir `ALGERIA_PHASE8_UNIT1_TEXTBOOK_REPORT.md` |
| Terminologie arabe officielle | PARTIELLE — celle du programme fourni est reprise telle quelle |

**Note de lecture (phase 7).** Les mentions `À DÉCOMPOSER` et `NOT STARTED`
des tableaux §2 à §5 ci-dessous datent d'avant le découpage. Elles sont
conservées telles quelles comme trace de ce qui était ouvert à ce moment ;
l'état courant est celui de `dz/lessons_4am_2026_2027.json` et du rapport
`ALGERIA_PHASE7_CURRICULUM_DECOMPOSITION_REPORT.md`.

**Source d'autorité.** Le programme des §2 à §5 est celui que le propriétaire
du projet a fourni comme spécification officielle pour l'année 2026/2027. Il
remplace, pour ce projet, toute inférence tirée du curriculum français.

**Ce qui n'est PAS établi.** Le document d'accompagnement officiel, la
répartition horaire, la progression annuelle recommandée et les attendus de fin
de cycle n'ont pas été fournis. Tout ce qui en dépendrait porte le marqueur
`[À VÉRIFIER DANS LE PROGRAMME OFFICIEL]`. Les rubriques suivantes en
dépendent et restent donc ouvertes :

- l'ordre d'enseignement des domaines dans l'année ;
- le volume horaire par domaine, donc le nombre de leçons ;
- le niveau d'exigence attendu en fin de 4AM pour chaque notion ;
- les prérequis supposés acquis des années 1AM–3AM.

**Règle de fabrication.** Aucun sujet n'est ajouté à ce programme, aucun n'en
est retiré. Un sujet du curriculum français qui n'apparaît pas ci-dessous
n'entre pas dans la 4AM, même s'il en est mathématiquement proche.

---

## 1. Les quatre domaines

```
4AM
 ├── ميدان أنساب الأعداد والحساب      (§2)
 ├── ميدان الحساب الحرفي               (§3)
 ├── ميدان الهندسة                     (§4)
 └── ميدان تنظيم المعطيات              (§5)
```

---

## 2. ميدان أنساب الأعداد والحساب — الأعداد الطبيعية، الناطقة والحساب على الجذور

| # | الموضوع (sujet) | Décomposition en LP | Dépendances | Statut |
|---|---|---|---|---|
| 2.1 | قواسم عدد طبيعي والقاسم المشترك الأكبر (PGCD) باستخدام خوارزمية أقليدس أو الفروق المتتالية | **FAIT (phase 8)** — couvert par les leçons 1–6 de l'unité 1 du manuel (`aadad-tabiiya-natiqa`) | aucune intra-programme | DONE |
| 2.2 | الأعداد الأولية وكيفية كتابة كسر غير قابل للاختزال | **PARTIEL (phase 8)** — « كسر غير قابل للاختزال » couvert par les leçons 7–8 de l'unité 1 ; « الأعداد الأولية » attend son unité du manuel (`aadad-awwaliya`, `coming_soon`) | 2.1 (le PGCD sert à réduire) | PARTIAL |
| 2.3 | الحساب على الجذور التربيعية : الجمع · الضرب · القسمة · تبسيط عبارة | **Quatre LP au moins, nommés par le programme lui-même** : الجمع, الضرب, القسمة, تبسيط عبارة. L'introduction de la notion de جذر تربيعي elle-même `À DÉCOMPOSER` | aucune intra-programme | NOT STARTED |
| 2.4 | ناطقة مقام نسبة وجذر تربيعي لعدد موجب | `À DÉCOMPOSER` | 2.3 | NOT STARTED |

---

## 3. ميدان الحساب الحرفي — الجبر

| # | الموضوع | Décomposition en LP | Dépendances | Statut |
|---|---|---|---|---|
| 3.1 | النشر والتبسيط | `À DÉCOMPOSER` | aucune intra-programme | NOT STARTED |
| 3.2 | تحليل عبارة جبرية إلى منتوج عوامل من الدرجة الأولى | `À DÉCOMPOSER` | 3.1 | NOT STARTED |
| 3.3 | حل معادلات من الدرجة الأولى بمجهول واحد | `À DÉCOMPOSER` | 3.1 | NOT STARTED |
| 3.4 | المعادلات جذاء معدوم | `À DÉCOMPOSER` | 3.2, 3.3 | NOT STARTED |
| 3.5 | حل متراجحات من الدرجة الأولى بمجهول واحد وتمثيلها بيانيا | Le sujet énumère **deux gestes** : la résolution, et la représentation graphique. Le détail `À DÉCOMPOSER` | 3.3 | NOT STARTED |
| 3.6 | جمل معادلتين من الدرجة الأولى بمجهولين : طريقة التعويض · طريقة الجمع | **Deux LP au moins, nommés par le programme** : طريقة التعويض, طريقة الجمع | 3.3 | NOT STARTED |
| 3.7 | الدوال الخطية | `À DÉCOMPOSER` | 3.1 | NOT STARTED |
| 3.8 | الدوال التآلفية | `À DÉCOMPOSER` | 3.7 | NOT STARTED |
| 3.9 | التمثيل البياني | `À DÉCOMPOSER` — son rattachement (aux fonctions seules, ou aussi aux inéquations de 3.5) `[À VÉRIFIER DANS LE PROGRAMME OFFICIEL]` | 3.7, 3.8 | NOT STARTED |

---

## 4. ميدان الهندسة — المهندس والقياس

| # | الموضوع | Décomposition en LP | Dépendances | Statut |
|---|---|---|---|---|
| 4.1 | خاصية طالس وعكسيتها في المثلث المستوي وحساب الأطوال | Le sujet énumère **trois gestes** : la propriété, sa réciproque, le calcul de longueurs | aucune intra-programme | NOT STARTED |
| 4.2 | النسب المثلثية في مثلث قائم : جيب · جيب تمام · ظل زاوية حادة | **Trois LP au moins, nommés par le programme** : جيب, جيب تمام, ظل | aucune intra-programme | NOT STARTED |
| 4.3 | العلاقات بين النسب المثلثية | `À DÉCOMPOSER` | 4.2 | NOT STARTED |
| 4.4 | المعلم في المستوي : إحداثيتا نقطة · إحداثيتا شعاع · المسافة بين نقطتين | **Trois LP au moins, nommés par le programme** | aucune intra-programme | NOT STARTED |
| 4.5 | الانسحاب والشعاع : مركبة شعاع · مجموع شعاعين | **Deux LP au moins, nommés par le programme**, plus la notion d'انسحاب elle-même `À DÉCOMPOSER` | 4.4 | NOT STARTED |
| 4.6 | الدوران والزوايا | `À DÉCOMPOSER` | aucune intra-programme | NOT STARTED |

---

## 5. ميدان تنظيم المعطيات — الإحصاء

| # | الموضوع | Décomposition en LP | Dépendances | Statut |
|---|---|---|---|---|
| 5.1 | سلسلة إحصائية ذات فئات | `À DÉCOMPOSER` | aucune intra-programme | NOT STARTED |
| 5.2 | حساب التكرار | `À DÉCOMPOSER` | 5.1 | NOT STARTED |
| 5.3 | التكرار النسبي | `À DÉCOMPOSER` | 5.2 | NOT STARTED |
| 5.4 | التكرار المجمع الصاعد | `À DÉCOMPOSER` | 5.2 | NOT STARTED |
| 5.5 | التكرار المجمع النازل | `À DÉCOMPOSER` | 5.2 | NOT STARTED |
| 5.6 | الوسط الحسابي / المعدل | `À DÉCOMPOSER` | 5.2 | NOT STARTED |
| 5.7 | التواتر | `À DÉCOMPOSER` — sa distinction d'avec التكرار النسبي (5.3) `[À VÉRIFIER DANS LE PROGRAMME OFFICIEL]` | 5.2 | NOT STARTED |
| 5.8 | المدى | `À DÉCOMPOSER` | 5.1 | NOT STARTED |
| 5.9 | الوسيط لسلسلة إحصائية | `À DÉCOMPOSER` | 5.1 | NOT STARTED |

---

## 6. Registre terminologique

La terminologie arabe du programme est **la** terminologie de l'interface
élève. Elle n'est jamais retraduite depuis le français, et le français ne figure
ci-dessous que comme repère pour l'équipe technique.

| Arabe (programme) | Repère technique français |
|---|---|
| ميدان أنساب الأعداد والحساب | domaine « nombres et calcul » |
| ميدان الحساب الحرفي | domaine « calcul littéral » |
| ميدان الهندسة | domaine « géométrie » |
| ميدان تنظيم المعطيات | domaine « organisation de données » |
| القاسم المشترك الأكبر (PGCD) | plus grand commun diviseur |
| خوارزمية أقليدس | algorithme d'Euclide |
| الفروق المتتالية | différences successives |
| الأعداد الأولية | nombres premiers |
| كسر غير قابل للاختزال | fraction irréductible |
| الجذور التربيعية | racines carrées |
| النشر والتبسيط | développement et réduction |
| التحليل | factorisation |
| المعادلات | équations |
| المتراجحات | inéquations |
| جذاء معدوم | produit nul |
| الدوال الخطية | fonctions linéaires |
| الدوال التآلفية | fonctions affines |
| خاصية طالس | théorème de Thalès |
| النسب المثلثية | rapports trigonométriques |
| جيب / جيب تمام / ظل | sinus / cosinus / tangente |
| المعلم | repère |
| الشعاع | vecteur |
| الانسحاب | translation |
| الدوران | rotation |
| التكرار | effectif |
| التكرار النسبي | fréquence |
| التكرار المجمع الصاعد / النازل | effectifs cumulés croissants / décroissants |
| الوسط الحسابي | moyenne arithmétique |
| الوسيط | médiane |
| المدى | étendue |
| التواتر | `[À VÉRIFIER DANS LE PROGRAMME OFFICIEL]` — distinct de التكرار النسبي ? |

---

## 7. Comparaison avec le référentiel technique français

Le dépôt hérite de 133 leçons françaises, **dormantes**. Elles ne sont
**jamais** une source de contenu : le tableau ci-dessous sert uniquement à
estimer l'effort d'ingénierie (un composant interactif existe-t-il déjà ? une
architecture de module est-elle réutilisable ?).

**Une proximité mathématique n'est pas une équivalence pédagogique.** La
classification finale se fait LP par LP, en phase 7, contre le programme
algérien — pas contre le titre d'une leçon française.

| Sujet 4AM | Leçon(s) française(s) la/les plus proche(s) | Classification provisoire | Décision d'ingénierie provisoire |
|---|---|---|---|
| 2.1 PGCD | `multiples-diviseurs` (3e) | PARTIAL — l'algorithme d'Euclide et les différences successives sont nommés par le programme algérien, pas par le français | ADAPTER l'architecture |
| 2.2 Nombres premiers, fraction irréductible | `multiples-diviseurs` (3e), `nombres-rationnels` (3e) | PARTIAL | ADAPTER |
| 2.3 Calcul sur les racines | `racines-carrees-3e` (3e), `racines-carrees-4e` (4e) | PARTIAL — les 4 opérations sont explicitement nommées côté algérien | ADAPTER |
| 2.4 Rationaliser un dénominateur | aucune | MISSING | CONSTRUIRE |
| 3.1 Développement / réduction | `calcul-litteral-algebrique` (3e), `calcul-litteral-4e` (4e) | MATCHING probable | ADAPTER |
| 3.2 Factorisation | `calcul-litteral-algebrique` (3e) | PARTIAL | ADAPTER |
| 3.3 Équations 1er degré | `equations-4e` (4e) | MATCHING probable | ADAPTER |
| 3.4 Équations produit nul | `equations-produit` (3e) | MATCHING probable | ADAPTER |
| 3.5 Inéquations + représentation | aucune au collège ; `equations-et-inequations-2nde` (2nde) | DIFFERENT — le français traite les inéquations au lycée | CONSTRUIRE |
| 3.6 Systèmes de deux équations | aucune | MISSING — absent du collège français | CONSTRUIRE |
| 3.7 Fonctions linéaires | `fonctions-lineaires-3e` (3e) | MATCHING probable | ADAPTER |
| 3.8 Fonctions affines | `fonctions-affines-3e` (3e) | MATCHING probable | ADAPTER |
| 3.9 Représentation graphique | `representation-graphique-3e`, `lecture-graphique-3e` (3e) | PARTIAL | ADAPTER |
| 4.1 Thalès et réciproque | `thales-3e` (3e) | MATCHING probable | ADAPTER |
| 4.2 Rapports trigonométriques | `trigonometrie-triangle-rectangle-3e` (3e) | MATCHING probable | ADAPTER |
| 4.3 Relations entre rapports | `trigonometrie-triangle-rectangle-3e` (3e) | PARTIAL | ADAPTER |
| 4.4 Repère, coordonnées, distance | `reperage-droite-plan-3e` (3e), `vecteurs-2nde` (2nde) | PARTIAL — la distance entre deux points est au lycée côté français | ADAPTER + CONSTRUIRE |
| 4.5 Translation et vecteur | `translations-vecteurs-3e` (3e) | MATCHING probable | ADAPTER |
| 4.6 Rotation et angles | `transformations-4e` (4e) | PARTIAL | ADAPTER |
| 5.1 Série à classes | `series-regroupees-classes-2nde` (2nde) | DIFFERENT — au lycée côté français | ADAPTER depuis le lycée |
| 5.2–5.3 Effectifs, fréquences | `statistiques-3e` (3e) | MATCHING probable | ADAPTER |
| 5.4–5.5 Effectifs cumulés | `statistiques-une-variable-2nde` (2nde) | PARTIAL | ADAPTER |
| 5.6 Moyenne | `statistiques-3e` (3e) | MATCHING probable | ADAPTER |
| 5.7 التواتر | `[À VÉRIFIER]` | UNKNOWN | à trancher en phase 7 |
| 5.8 Étendue | `statistiques-3e` (3e) | MATCHING probable | ADAPTER |
| 5.9 Médiane | `statistiques-une-variable-2nde` (2nde) | PARTIAL | ADAPTER |

**Lecture de ce tableau.** « MATCHING probable » veut dire que l'architecture
de module française est vraisemblablement réutilisable, pas que la leçon peut
être traduite. Quatre sujets (2.4, 3.5, 3.6, et partiellement 4.4) n'ont
aucun équivalent au collège français et seront construits de zéro.

---

## 8. Architecture de contenu retenue

```
apps/web/src/lessons/moyen/4am/<domaine>/<unite>/<lecon>/      ← phase 8 : l'UNITÉ du manuel entre le domaine et la leçon
    lesson.config.js        ← id, kind (lesson|synthesis), unit, modules, stages, LP enseignés, resources[]
    content/textbook.js     ← le MANUEL au mot près, chaque bloc avec sa `source` (docs/sources/<classe>/<unité>/extraction.json)
    content/exercises.js    ← les exercices du manuel rattachés à la leçon
    index.jsx               ← LessonIndex
    routes.jsx              ← montage + fournisseur de carte
    moduleContext.js
    knowledge.jsx           ← source unique des connaissances
    modules/Module<NN><Descripteur>.jsx
```

| Décision | Valeur | Raison |
|---|---|---|
| Identifiant de niveau | `moyen` | Le collège algérien est « المتوسط », pas « collège » ; réutiliser `college` mélangerait les deux catalogues |
| Identifiant de classe | `4am` | Celui qui entrera dans `ACTIVE_GRADE_IDS` |
| Identifiants de chapitre | un par domaine (§1) | Le programme est structuré en ميادين ; les chapitres doivent en être le reflet |
| Frontières de leçon | `À DÉCOMPOSER` | Elles doivent suivre la cohérence pédagogique, jamais la commodité d'implémentation |

**Point technique à traiter en phase 7.** `scripts/check-routes.mjs` déduit la
classe d'un chemin par l'expression `lessons/(?:college|lycee)/([^/]+)/`. Un
niveau `moyen` n'y répond pas : la leçon serait vue comme sans classe, et le
contrôle de montage échouerait. L'expression doit accueillir `moyen` **avant**
que la première leçon 4AM soit montée.

---

## 9. Standard pédagogique

Toute leçon 4AM suit la boucle de la plateforme :

```
Concret → Visuel → Numérique → Symbolique → Automatisation
```

et la progression :

```
situation réelle → pourquoi → manipulation → observation →
découverte de la règle → pratique guidée → pratique autonome → mémoire d'examen
```

Interdits, repris de `ALGERIA_PLATFORM_MASTER_SPEC.md` §9 :

- terminologie prématurée ; symbole avant l'idée ; formule non expliquée ;
- trop de variables à la fois ; abstraction avant l'intuition ;
- blocage sur une réponse fausse ; diagnostic qui empêche d'avancer.

L'élève ne doit jamais se demander quoi faire.

---

## 10. Ce qu'il reste à faire

**Fait en phase 8 (2026-09-18)** : l'unité 1 du manuel (8 leçons + synthèse), le système de manipulation réutilisable, la hiérarchie الوحدة en catalogue/base/API, la traçabilité manuel → plateforme. **Ouvert** : fournir les unités suivantes du manuel ; arbitrer le recouvrement `aadad-awwaliya` ↔ leçons 7–8 ; choisir la surface enseignant qui activera le mode classe des manipulations.

**Fait en phase 6F** (voir `ALGERIA_PHASE6F_DATA_SCOPE_IMPLEMENTATION_REPORT.md`) :

- ~~Produire le fichier source du catalogue 4AM et l'intégrer à `coursesData.js`~~
  — fait, via `buildDzCourseLevels()`, sous forme de chapitres portant les 28
  sujets (`chapters.topics`), sans leçon.
- ~~Étendre `check-routes.mjs` au niveau `moyen`~~ — fait (§8).
- ~~Ajouter `4am` à `ACTIVE_GRADE_IDS`, relancer l'export et l'import, vérifier
  l'absence de dérive~~ — fait ; `4am` et `terminale_dz` sont actifs, la base
  ne contient plus que ces deux classes.

**Fait en phase 7** (voir `ALGERIA_PHASE7_CURRICULUM_DECOMPOSITION_REPORT.md`) :

- ~~Trancher les frontières de leçons~~ — fait : **un sujet = une leçon**,
  règle arrêtée par le propriétaire. 28 sujets → 28 leçons.
- ~~Décomposer chaque sujet en LP~~ — fait : **185 points d'apprentissage**,
  intitulés arabes fournis par le propriétaire. Les `À DÉCOMPOSER` des §2 à §5
  ci-dessus sont donc résolus, sauf mention contraire.

**Reste à faire** :

1. Classer chaque LP algérien contre le français, LP par LP (phase 8).
2. ~~Choisir les trois leçons gratuites dans `freeLessons.js`~~ — **caduc
   (2026-09-25)** : le palier est une décision d'administration
   (`lessons.tier`, modifié dans le panneau), il n'existe plus de liste
   figée. Voir `architecture/ADMIN_PANEL_ARCHITECTURE.md` « Le palier du
   contenu ».
3. Faire relire le découpage par une autorité curriculaire externe.
