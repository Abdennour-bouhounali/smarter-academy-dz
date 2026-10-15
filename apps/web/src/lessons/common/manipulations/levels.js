import { MANIPULATION_LEVEL_IDS, resolveLevelId } from '@smarter-academy/core/curriculum/manipulationLevels.js';

/**
 * Les DEUX NIVEAUX de chaque type de manipulation — مبتدئ / متقدم, et rien
 * d'autre (décision du propriétaire, 2026-09-24 : l'ancienne échelle à quatre
 * paliers اكتشاف · موجّه · استقلالية · تحدّ est supprimée, pas cachée).
 *
 *   beginner   l'entrée : des nombres petits ou familiers, la relation
 *              visible d'un coup d'œil, l'outil qu'on découvre
 *   advanced   le MÊME outil, une demande mathématique plus forte : des
 *              nombres moins évidents, plus d'étapes, une stratégie à choisir
 *              — jamais une interface plus compliquée
 *
 * Ces paires sont celles d'une manipulation POSÉE SEULE dans un module. Dans
 * un `ManipulationWorkspace`, c'est la leçon qui déclare sa propre paire
 * (lesson.config.js, `level` + `autonomy`) et le workspace qui porte le
 * sélecteur : la manipulation n'en affiche pas un second.
 *
 * La difficulté suit la DEMANDE COGNITIVE. Les nombres sont ceux du manuel
 * (`ref` = identifiant dans l'extraction) ; un niveau ajouté par la
 * plateforme est marqué `source: 'platform'` et rendu avec « مثال تفاعلي
 * إضافي » (rien d'ajouté sans le dire). Aucun texte arabe ici : les libellés
 * sont dans lesson.json (`manipulation.level.*`).
 *
 * CONVERSION depuis les quatre paliers (choix par type, pas « 1-2 → مبتدئ,
 * 3-4 → متقدم ») — la raison est notée sur chaque paire.
 */
const T = (ref) => ({ source: 'textbook', ref });
const P = { source: 'platform' };

export const LEVELS = Object.freeze({
  // 24 : six diviseurs visibles d'un coup ; 1512 : il faut les règles de
  // divisibilité (le calcul direct n'est plus praticable) — l'ex-« تحدّ ».
  'divisor-explorer': {
    beginner: { numbers: { a: 24, b: 0 }, candidates: [3, 4, 5, 6, 8, 12], ...P },
    advanced: { numbers: { a: 1512, b: 0 }, candidates: [21, 72, 25, 9], ...T('ex-1') },
  },
  // Le RAYON QU'ON ÉTIRE (quotition). 24 livres, rayons de 2 à 12 : six
  // longueurs qui vident le sol sur onze, des rayons qu'on compte d'un
  // regard. 420 : l'activité du manuel — le serre-livres de 10 à 60, sans
  // longueur proposée, les deux propositions du libraire (26, 28) marquées
  // sur la réglette comme dans l'énoncé, et 11 longueurs sur 51 qui vident
  // le sol : il faut chercher.
  'divisor-explorer-books': {
    beginner: { numbers: { total: 24 }, range: { min: 2, max: 12 }, marks: [], ...P },
    advanced: { numbers: { total: 420 }, range: { min: 10, max: 60 }, marks: [26, 28], ...T('act-1') },
  },
  // 15 en 3 : le partage tombe juste ; 42 en 5 : plus grand, et il reste
  // deux joueurs — le contraste se construit seul, sans choix proposés.
  'team-builder': {
    beginner: { numbers: { total: 15, groups: 3 }, ...P },
    advanced: { numbers: { total: 42, groups: 5 }, ...T('act-1') },
  },
  // 24 : pair, des couples évidents ; 105 : impair (3 × 5 × 7), il faut
  // tester jusqu'à √105 — la méthode du manuel. 910 (ancien palier 4)
  // restait un exercice de calcul, pas une manipulation lisible.
  'factor-pairs': {
    beginner: { numbers: { n: 24 }, ...P },
    advanced: { numbers: { n: 105 }, ...T('method-divisors') },
  },
  // n = 3 sur 18 et 12 ; n = 9 sur 900 et 90 : même propriété, des nombres
  // qu'on ne peut plus « voir » — la paire que la leçon déclare déjà.
  'divisor-properties': {
    beginner: { numbers: { n: 3, a: 18, b: 12 }, ...T('act-3') },
    advanced: { numbers: { n: 9, a: 900, b: 90 }, ...T('know-2') },
  },
  // 12 et 18 : PGCD 6, des listes courtes ; 65 et 78 : PGCD 13, un diviseur
  // commun qu'aucun réflexe (2, 3, 5) ne trouve.
  'common-divisors': {
    beginner: { numbers: { a: 12, b: 18 }, ...T('know-3') },
    advanced: { numbers: { a: 65, b: 78 }, ...T('try-1a') },
  },
  // 21 et 14 : trois soustractions ; 378 et 315 : le second calcul de
  // l'activité 6, une longue suite de différences à mener seul.
  'pgcd-differences': {
    beginner: { numbers: { a: 21, b: 14 }, ...T('know-4') },
    advanced: { numbers: { a: 378, b: 315 }, ...T('act-6a') },
  },
  // 45 et 18 : deux divisions ; 3356 et 1528 : le second calcul de
  // l'activité 6, des restes qu'on ne devine pas.
  'euclidean-algorithm': {
    beginner: { numbers: { a: 45, b: 18 }, ...T('know-4') },
    advanced: { numbers: { a: 3356, b: 1528 }, ...T('act-6b') },
  },
  // 17 et 18 : consécutifs, premiers entre eux « à vue » ; 27 et 36 : le
  // piège de l'activité (« هل مريم على صواب؟ ») — ils ne le sont pas.
  'coprime-explorer': {
    beginner: { numbers: { a: 17, b: 18 }, ...T('act-7') },
    advanced: { numbers: { a: 27, b: 36 }, ...T('act-7') },
  },
  // 28/42 : une simplification par 14 qui se voit ; 595/560 : PGCD 35, il
  // faut le chercher avant de simplifier — l'exemple de la méthode.
  'fraction-reduction': {
    beginner: { numbers: { n: 28, d: 42 }, ...T('know-6') },
    advanced: { numbers: { n: 595, d: 560 }, ...T('method-reduce') },
  },
  // ── Unité 2 (2026-09-30). `scale` est la graduation la plus fine de la
  // règle (1/scale) : c'est elle qui porte la demande du niveau avancé.
  // 36 : le côté tombe juste sur une graduation entière (نشاط 1، س 3) ;
  // 5 : l'aire du carré construit sur BC (نشاط 1) — aucun décimal jusqu'au
  // millième, il faut encadrer à chaque graduation.
  'square-root-side': {
    beginner: { numbers: { num: 36, den: 1, scale: 10 }, ...T('act-1') },
    advanced: { numbers: { num: 5, den: 1, scale: 1000 }, ...T('act-1') },
  },
  // 9 au pas de 1/2 (مراد و عمر) ; 25 au pas de 0,1 avec 3, 0,04, 0 et −9 :
  // la liste de l'activité 3, dont √3 qu'aucune graduation n'atteint.
  'square-fold': {
    beginner: { numbers: { a: 9, scale: 2 }, targets: [9, 0, -9], ...T('act-3') },
    advanced: { numbers: { a: 25, scale: 10 }, targets: [25, 3, 0.04, 0, -9], ...T('act-3') },
  },
  // 28 = 2² × 7 (معارف 4 : √28 = 2√7), deux pavages seulement ; 288 (تمرين
  // 18) : six pavages possibles, il faut trouver celui dont la dalle est la
  // plus petite.
  'square-tiling': {
    beginner: { numbers: { n: 28 }, ...T('know-4') },
    advanced: { numbers: { n: 288 }, ...T('ex-18') },
  },
  // ── Unité 3 (2026-10-01). `expr` écrit les deux facteurs « f1|f2 ».
  // 3(x + 5) : une seule distributivité, deux zones ; (3x − 1)(3 + x)
  // (نشاط 1، س 3) : quatre zones dont deux RETRANCHÉES, et des termes à réunir.
  'pitch-expansion': {
    beginner: { numbers: { expr: '3|x+5' }, ...T('know-1') },
    advanced: { numbers: { expr: '3x-1|3+x' }, ...T('act-1') },
  },
  // Mode rows. 9x + 3 (نشاط 3، س 2) : rangées de hauteur 1, un seul r > 1
  // juste ; 6x² + 4x (معارف 3) : rangées de hauteur x, le facteur 2x à trouver
  // entier (le plus grand r ET la hauteur x).
  'turf-factoring': {
    beginner: { numbers: { expr: '9x+3' }, ...T('act-3') },
    advanced: { numbers: { expr: '6x^2+4x' }, ...T('know-3') },
  },
  // ── Unité 4 « معادلات ومتراجحات » (2026-10-01) — `ref` = docs/sources/4am/unit4/extraction.json.
  // Balance. 3x + 2 = 11 : des sacs et des ballons seulement, un partage en 3 ;
  // 9x + 1 = −26 (نشاط 1، فاطمة) : 26 baudruches face à 9 sacs — le −1 de droite ne
  // peut pas être « ôter un ballon » (il n'y en a pas) : c'est POSER une baudruche, la
  // même opération par son effet ; puis 9 parts, et le sac contient des baudruches (−3).
  'equation-balance': {
    beginner: { numbers: { eq: '3x+2=11' }, ...P },
    advanced: { numbers: { eq: '9x+1=-26' }, ...T('act-1') },
  },
  // Terrain qui s'annule. 3(x − 5) (نشاط 2، س 1، إلياس وأمين) : un côté constant ne
  // s'écrase jamais, un seul zéro ; (x − 2)(x + 5) (نشاط 2، س 3) : les DEUX côtés
  // varient, deux zéros à trouver, et un côté qui se RETOURNE entre −5 et 2.
  'vanishing-pitch': {
    beginner: { numbers: { expr: '3|x-5' }, ...T('act-2b') },
    advanced: { numbers: { expr: 'x-2|x+5' }, ...T('act-2b') },
  },
  // Rayon des solutions. x < 3 (جدول النشاط 3) : la borne se lit, seul le crochet est à
  // décider ; −3x + 5 ≤ 20 (نشاط 3) : la trace des essais est à droite de −5 alors
  // que le coefficient est négatif — la division par −3 doit inverser le sens.
  'solution-ray': {
    beginner: { numbers: { ineq: 'x<3' }, ...T('act-3b') },
    advanced: { numbers: { ineq: '-3x+5<=20' }, ...T('act-3b') },
  },
  // Course. Un père (30 ans) et son fils (6 ans) : deux personnes, un seul « +x » chacune ;
  // le manuel (ترييض مشكلة) : le père (36) face à TROIS enfants (4, 6, 8) — trois « +x »
  // à porter, la somme grandit trois fois plus vite.
  'growth-race': {
    beginner: { numbers: { left: '30+x', right: '2(6+x)' }, ...P },
    advanced: { numbers: { left: '36+x', right: '4+x+6+x+8+x' }, ...T('method-modelling') },
  },
  // ── Unité 5 « جمل معادلتين » (2026-10-01) — `ref` = docs/sources/4am/unit5/extraction.json.
  // Une jumla s'écrit « équation 1|équation 2 » (linearSystem.system).
  // Tableau des deux conditions. Une saison : 10 matchs sans défaite, 22 points (3 par victoire,
  // 1 par nul) — deux petits nombres que la main fixe d'un regard ; le manuel (نشاط 1) : 32 agents,
  // et la seconde condition porte sur l'APRÈS (5 hommes et 3 femmes partis) — il faut la traduire.
  'pair-scoreboard': {
    beginner: { numbers: { system: 'x+y=10|3x+y=22' }, ...P },
    advanced: { numbers: { system: 'x+y=32|2(x-5)=y-3' }, ...T('act-1') },
  },
  // Cartes d'élimination. x + y = 10 et x − y = 2 : les y sont DÉJÀ opposés, poser une carte sur
  // l'autre suffit ; le manuel (نشاط 2) : 2x + y = 7 et 3x − 2y = 4,2 — il faut décider : isoler
  // y = 7 − 2x (التلميذ 1) ou multiplier (1) par 2 (التلميذ 2).
  'elimination-cards': {
    beginner: { numbers: { system: 'x+y=10|x-y=2' }, ...P },
    advanced: { numbers: { system: '2x+y=7|3x-2y=4,2' }, ...T('act-2') },
  },
  // Modéliser une histoire. Un derby : 20 supporters, billets 300 et 150 DA, 4800 DA de recette —
  // les inconnues déjà nommées ; le manuel (نشاط 3, le musée) : 140 visiteurs et 30 300 DA,
  // l'élève choisit lui-même les inconnues et chaque donnée à porter.
  'story-modeller': {
    // `theme` / `named` : l'histoire intégrée du type (lesson.json › storyModeller.themes) que
    // l'AUTRE niveau d'une manipulation posée seule raconte — les mots ne sont jamais ici.
    beginner: { numbers: { system: 'x+y=20|300x+150y=4800' }, theme: 'stadium', named: true, ...P },
    advanced: { numbers: { system: 'x+y=140|300x+150y=30300' }, theme: 'museum', named: false, ...T('act-3') },
  },
  // ── Unité 6 « الدالة الخطية والتناسبية » (2026-10-02) — `ref` = docs/sources/4am/unit6/extraction.json.
  // Une règle s'écrit comme le manuel (proportional.rule) ; plusieurs règles « r1|r2 ».
  // Compteur de trajet. Un seul tarif, 15 DA la minute : les quotients se lisent égaux d'un coup ;
  // متقدم : DEUX tarifs (15x et 10x + 50) — le forfait casse la proportionnalité, à décider seul.
  'ratio-ride': {
    beginner: { numbers: { plans: '15x' }, ...P },
    // متقدم cite ex-18 (« أي بيان منهما يمثل وضعية تناسبية؟ ») : décider SEUL entre une situation
    // proportionnelle et une qui ne l'est pas (le forfait part de 50 comme la courbe du manuel part de 0,3).
    advanced: { numbers: { plans: '15x|10x+50' }, ...T('ex-18') },
  },
  // Machine à règle cachée. La remise de l'Aïd (نشاط 1, 20 % → × 0,8) ; le manuel (نشاط 2) :
  // trois machines x², 2x, 2x − 1 — laquelle est linéaire, et son a depuis un seul couple.
  'linear-machine': {
    beginner: { numbers: { rules: '0,8x' }, ...T('act-1') },
    advanced: { numbers: { rules: 'x^2|2x|2x-1' }, ...T('act-2') },
  },
  // Droite épinglée à O. f(x) = 0,5x (نشاط 3 : O, A(1 ; 0,5), B(4 ; 2)) ; le manuel (طرائق ص 69) :
  // lire f(4) ET l'antécédent de 3,5 sur la droite de coefficient 0,4 — deux lectures dans les deux sens,
  // la formule cachée (le manuel donne le graphe), un antécédent non entier (8,75).
  'origin-line': {
    beginner: { numbers: { a: '0,5', mode: 'draw' }, ...T('act-3') },
    advanced: { numbers: { a: '0,4', mode: 'read', reads: 'x:4|y:3,5' }, ...T('method-read') },
  },
  // Étiquette étirée. +5 % sur 1200 DA (نشاط 5) ; le réservoir (طرائق ص 71) : −30 % puis +15 %.
  'percent-tag': {
    beginner: { numbers: { price: '1200', steps: '+5' }, ...T('act-5') },
    advanced: { numbers: { price: '30', steps: '-30|+15' }, ...T('method-percent') },
  },
  // ── Unité 7 « الدالة التآلفية » (2026-10-02) — `ref` = docs/sources/4am/unit7/extraction.json.
  // Une fonction s'écrit comme le manuel (affine.affine) ; un système comme linearSystem.eq2.
  // Compteur à partie fixe. مبتدئ : une course en taxi-application (100 DA de prise en charge + 40 DA
  // le km), une image à la fois ; متقدم : la paie du نشاط 1 (35000 + 185 par heure) — image de 10 heures,
  // l'heure qui donne 37775 DA (antécédent : ax + b = m), puis b = 0 / a = 0 aux boutons.
  'affine-meter': {
    beginner: { numbers: { rule: '40x+100', mode: 'image' }, ...P },
    advanced: { numbers: { rule: '185x+35000', mode: 'image|antecedent|classify', target: '37775' }, ...T('act-1') },
  },
  // La droite qui ne passe plus par O. مبتدئ : x ⟼ ½x montée de 2 ; متقدم (نشاط 3) : (d) de 3/2·x
  // montée de 1, puis a et b à LIRE sur la droite (formule cachée).
  'affine-line': {
    beginner: { numbers: { a: '1/2', b: '2', mode: 'shift' }, ...P },
    // متقدم : le نشاط 3 (g = 3/2 x → f = 3/2 x + 1, la translation), PUIS une seconde rampe dont la formule est
    // cachée (−1/2 x + 3, qui DESCEND) : l'élève lit b et a lui-même — deux laboratoires, enchaînés par son bouton.
    advanced: { numbers: { a: '3/2', b: '1', mode: 'shift|identify', find: '-1/2:3' }, ...T('act-3') },
  },
  // L'escalier. مبتدئ : trois marques sur x ⟼ 50x + 100 ; متقدم (نشاط 4) : f(x) = 200x + 2000 et ses
  // six marches 0→1→4→6→10→12→15 à compléter. Le تحدّ (deux couples lus) est un montage de la leçon.
  'slope-stairs': {
    beginner: { numbers: { rule: '50x+100', marks: '0|2|4' }, ...P },
    advanced: { numbers: { rule: '200x+2000', marks: '0|1|4|6|10|12|15' }, ...T('act-4') },
  },
  // Deux droites. مبتدئ : deux équations faciles à écrire y = ax + b, solution entière ; متقدم (نشاط 5) : la
  // cagnotte (43 pièces, 5000 DA) à écrire y = … puis (36 ; 7), et les trois cas.
  'line-crossing': {
    // مبتدئ (plateforme, spectacle laser) : deux équations à coefficients ±1 / 2, déjà presque sous la forme y = …,
    // solution (2 ; 3) lisible sur une grille d'unités ; متقدم (نشاط 5) : 100x + 200y = 5000 à diviser par 200,
    // des nombres qu'on ne compte pas d'un regard, puis l'étape des trois cas (cases).
    beginner: { numbers: { system: '2x-y=1|x+y=5' }, ...P },
    advanced: { numbers: { system: 'x+y=43|100x+200y=5000', cases: 'true' }, ...T('act-5') },
  },
  // Deux tarifs. مبتدئ : UNE formule à modéliser (500 + 150 par séance) ; متقدم (نشاط 4 question 1) :
  // l'abonnement (2000 + 200 par match) contre le billet seul (400 par match) — égalité à 10 matchs.
  'plan-compare': {
    beginner: { numbers: { plans: '150x+500', mode: 'model' }, ...P },
    advanced: { numbers: { plans: '200x+2000|400x', mode: 'model|compare' }, ...T('act-4') },
  },
  // ── Unité 8 « الإحصاء » (2026-10-02) — `ref` = docs/sources/4am/unit8/extraction.json.
  // Une série s'écrit « valeur:effectif|… » (valeurs décimales à virgule).
  // La barre de taille. مبتدئ : 8 enfants devant un manège (4 tailles) ; متقدم (نشاط 1) : les 20 tailles du
  // manuel, « 159cm على الأقل », « 160cm على الأكثر », les deux colonnes du tableau à remplir.
  'cumul-gate': {
    beginner: { numbers: { series: '120:2|130:3|140:2|150:1', mode: 'up|down' }, ...P },
    advanced: { numbers: { series: '154:3|157:4|159:5|160:5|165:3', mode: 'up|down|table' }, ...T('act-1') },
  },
  // La balance. مبتدئ : cinq scores d'un mini-tournoi ; متقدم (نشاط 4) : les 10 températures d'El Oued —
  // étendue, moyenne 39,3 et médiane 38,5 (N pair) sur la même poutre.
  'stat-balance': {
    beginner: { numbers: { series: '2|3|3|4|8', mode: 'mean|median' }, ...P },
    advanced: { numbers: { series: '40|35|34|41|48|37|35|46|37|40', mode: 'range|mean|median' }, ...T('act-4') },
  },
  // Le majdoul. مبتدئ : cinq valeurs, deux دساتير ; متقدم (تمرين 7) : la série 4, 10, 8, 4, 3, 2, 4 et les
  // quatre دساتير du manuel, puis le graphique à choisir.
  'sheet-lab': {
    beginner: { numbers: { cells: '5|8|6|9|7', ask: 'MAX-MIN|MOYENNE' }, ...P },
    advanced: { numbers: { cells: '4|10|8|4|3|2|4', ask: 'MAX-MIN|MEDIANE|MOYENNE|MODE', chart: 'bars|pie|histogram' }, ...T('ex-7') },
  },
  // Les réservoirs. مبتدئ : deux groupes d'amis (4 de moyenne 12, 6 de moyenne 7) ; متقدم (تحدّ) : les deux
  // classes du manuel, garçons et filles (`classes: '2|2'` : les deux premiers groupes font la classe أ, les deux suivants la classe ب) — même total 384 sur 33.
  'group-tanks': {
    beginner: { numbers: { groups: '4:12|6:7' }, ...P },
    advanced: { numbers: { groups: '15:10|18:13|14:12,5|19:11', classes: '2|2' }, ...T('challenge') },
  },
  // ── Unité 9 « خاصية طالس » (2026-10-02) ──
  // Le faisceau. مبتدئ : un projecteur, des rayons gradués en unités entières (k lisible) ; متقدم (نشاط 1) : AB = 6,
  // AC = 7, BC = 6,1, l'écran à AB′ = 3,2 (AC′ = 56/15), puis la chambre noire (وضعية الفراشة).
  'thales-beam': {
    beginner: { numbers: { AB: 4, AC: 5, BC: 3, mode: 'projector' }, ...P },
    advanced: { numbers: { AB: 6, AC: 7, BC: 6.1, ABp: 3.2, mode: 'projector|butterfly' }, ...T('act-1') },
  },
  // Le niveau à bulle. مبتدئ : l'échelle double aux montants inégaux (AB = 6, AC = 9, une encoche par unité) — deux
  // planches de niveau (1/3 et 2/3, aucune au milieu, pour que « les milieux » soit réfutable) ; متقدم (نشاط 2) : le
  // tréteau en X, deux droites sécantes graduées des DEUX côtés de A (AB = 9, AC = 12 : l'élève calcule le tiers,
  // 3 et 4, aucune position proposée), le rapport 1/3 imposé, les trois figures des élèves dont l'ordre inversé.
  'parallel-level': {
    beginner: { numbers: { AB: 6, AC: 9, mode: 'ladder' }, ...P },
    advanced: { numbers: { AB: 9, AC: 12, ratio: '1/3', mode: 'crossing' }, ...T('act-2') },
  },
  // L'éventail. مبتدئ : [AB] en 3 parts égales ; متقدم (طرائق ص 109) : le point M de [AB] tel que MA/MB = 3/2.
  'segment-divider': {
    beginner: { numbers: { parts: 3, mode: 'equal' }, ...P },
    advanced: { numbers: { p: 3, q: 2, marks: 5, mode: 'ratio' }, ...T('method-ratio-point') },
  },
  // Le bâton et l'ombre. مبتدئ : un bâton de 1 m, ombres entières (h = 5 m) ; متقدم (تحدّ) : bâton à 10 m, ombre
  // commune à 11,6 m (h = 7,25 m).
  'shadow-stick': {
    beginner: { numbers: { stick: 1, stickAt: 4, tip: 5 }, ...P },
    advanced: { numbers: { stick: 1, stickAt: 10, tip: 11.6 }, ...T('challenge') },
  },
  // La place du quartier (2026-10-13). مبتدئ : une minaret de 5 m (ombres à deux décimales au plus) ; متقدم (تحدّ) : la
  // minaret de 7,25 m — à 15:00 son ombre finit à 11,6 m et le bâton de 1 m y fait 1,6 m.
  'shadow-world': {
    beginner: { numbers: { minaret: 5 }, ...P },
    advanced: { numbers: { minaret: 7.25 }, ...T('challenge') },
  },
  // La coupe du cône. مبتدئ : un cône de 12 sur 4 (h = r ⇒ r = 3) ; متقدم (أدمج تعلّماتي) : 18 sur 6 (r = 4,5).
  'cone-cylinder': {
    beginner: { numbers: { H: 12, R: 4 }, ...P },
    advanced: { numbers: { H: 18, R: 6 }, ...T('situation') },
  },
  // ── Unité 10 « حساب المثلثات في المثلث القائم » (2026-10-04) — paires PROVISOIRES semées par le lead, les auteurs
  // les affinent (sous verrou). La rampe : مبتدئ un angle de 30° et une planche de 4 m ; متقدم (نشاط 2) l'angle de 40°,
  // trois rampes de tailles différentes (hypoténuses 4, 6, 8) pour que l'élève constate l'invariance.
  'ramp-ratios': {
    beginner: { numbers: { angle: 30, hyp: 4, mode: 'name' }, ...P },
    advanced: { numbers: { angle: 40, hyps: [4, 6, 8], mode: 'scale' }, ...T('act-2') },
  },
  // La calculatrice : مبتدئ trois angles (30°, 45°, 60°) au centième ; متقدم (نشاط 4) le tableau 10°…75° puis les trois
  // angles inverses sin x = 0,52, cos x = 0,25, tan x = 1,33 aux trois précisions.
  'trig-calculator': {
    beginner: { numbers: { angles: [30, 45, 60], digits: 2 }, ...P },
    advanced: { numbers: { angles: [10, 20, 30, 40, 45, 60, 75], inverse: { sin: 0.52, cos: 0.25, tan: 1.33 }, digits: 2 }, ...T('act-4') },
  },
  // Le compas : مبتدئ sin x = 3/5 (un 3-4-5 qui se lit) ; متقدم (طرائق ص 121) sin x = 2/5 puis tan x = 7/3.
  'angle-compass': {
    beginner: { numbers: { targets: [{ ratio: 'sin', value: '3/5' }] }, ...P },
    advanced: { numbers: { targets: [{ ratio: 'sin', value: '2/5' }, { ratio: 'tan', value: '7/3' }] }, ...T('method-construct') },
  },
  // Le clinomètre : مبتدئ le projecteur du stade (hauteur 24 m, distance choisie 10…40 m) ; متقدم (تحدّ) l'échelle des
  // graffeurs : 1,60 m de mur, 59° au sol — la longueur de l'échelle (sin, division).
  'clinometer': {
    beginner: { numbers: { height: 24, minDistance: 10, maxDistance: 40, mode: 'height' }, ...P },
    advanced: { numbers: { height: 1.6, angle: 59, mode: 'ladder' }, ...T('challenge') },
  },
  // ── Unités 11 « الأشعة والانسحاب » et 12 « الأشعة في معلم » (2026-10-04) — paires PROVISOIRES semées par le lead
  // (les auteurs les affinent sous verrou ; les `ref` suivent les extractions).
  // Le spectacle de drones (insihab-shuaa). مبتدئ : trois drones A(1 ; 1), B(3 ; 1), C(2 ; 3) sur un ciel 9 × 6 ; l'élève
  // CHOISIT la flèche du meneur A (la balise du plan, (3 ; 1), n'oriente que), pose B′ et C′, puis répare le drone égaré
  // (−u). متقدم (نشاط 1, p. 128) : la figure du manuel REDESSINÉE sur 14 × 8 (A, B, C, K ; images séparées) et ses QUATRE
  // translations données A ↦ G, C ↦ R, A ↦ M, A ↦ A′ — neuf images à poser sans voyants pendant le geste.
  'translation-glide': {
    beginner: { numbers: { scene: 'show', grid: [9, 6], drones: { A: [1, 1], B: [3, 1], C: [2, 3] }, vector: [3, 1] }, ...P },
    advanced: { numbers: { scene: 'act1', grid: [14, 8] }, ...T('act-1') },
  },
  // La banderole du tifo (shuaayn-mutasawiyayn). مبتدئ : I tenu sur [AB] coupé en 8 parts égales (A(0 ; 0), B(4 ; 2)),
  // AI = IB au seul milieu ; متقدم (طرائق p. 131) : le triangle du manuel sur la ورقة مرصوفة (translaté d'une maille),
  // D image de C par le انسحاب de vecteur AB, puis E tel que EB = AC — deux points à poser, deux pièges d'ordre.
  'parallelogram-pin': {
    beginner: { numbers: { mode: 'midpoint', A: [0, 0], B: [4, 2] }, ...P },
    advanced: { numbers: { mode: 'parallelogram', A: [1, 4], B: [2, 1], C: [5, 3] }, ...T('method-image') },
  },
  // La somme de deux vecteurs (majmu-shuaayn) : مبتدئ (plateforme) la trottinette dans Alger — AB = (3 ; 1) fait, trois
  // cartes de second trajet (virage, même direction, retour −AB) dont la QUEUE se pose sur une station (A, B ou deux
  // autres) ; متقدم (تحدّ p. 127) le nageur : 4 km/h dont l'élève tourne la direction, courant 2 km/h, rivière de 60 m
  // (donnée de la plateforme pour lire l'écart en mètres) — la cible exacte 30°, plus lourde : un angle à trouver, aucune case.
  'vector-sum': {
    beginner: { numbers: { mode: 'chasles', A: [1, 1], u: [3, 1], legs: [[1, 3], [3, 1], [-3, -1]], decoys: [[1, 4], [6, 0]] }, ...P },
    advanced: { numbers: { mode: 'parallelogram', swim: 4, current: 2, width: 60 }, ...T('challenge') },
  },
  // Le métro (barahin-ashia) : مبتدئ un parallélogramme de 4 stations, deux tickets à réduire (BC + AB → AC par
  // l'ordre de Chasles ; AB + AD qui ne se raccorde pas → l'égalité AD = BC donnée par ABCD) ; متقدم (ex-18) huit
  // stations, six données, et deux PREUVES à mener jusqu'au vecteur demandé (OL = AC, HK = AC) — une égalité vraie
  // sur la figure mais non donnée y est refusée. Plus de stations, de données et de gestes : la demande monte.
  'vector-chain': {
    beginner: {
      numbers: {
        mode: 'reduce', stations: { A: [0, 0], B: [5, 1], C: [7, 4], D: [2, 3] },
        segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']],
        givens: [{ para: 'ABCD' }],
        missions: [{ start: ['BC', 'AB'] }, { start: ['AB', 'AD'] }],
      },
      ...P,
    },
    advanced: {
      numbers: {
        mode: 'reduce',
        stations: { A: [0, 0], B: [6, 0], C: [2, 4], D: [-4, 4], O: [1, 2], H: [7, 2], L: [3, 6], K: [9, 6] },
        segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C'], ['B', 'D']],
        givens: [{ mid: ['O', 'A', 'C'] }, { sym: ['D', 'B', 'O'] }, { para: 'ABCD' }, { eq: ['BH', 'AO'] }, { eq: ['CL', 'OC'] }, { def: 'CK', sum: ['AB', 'AO'] }],
        missions: [
          { lhs: 'OL', start: ['OC', 'CL'], target: 'AC' },
          { lhs: 'HK', pre: ['HB', 'BC', 'CK'], start: ['HB', 'BC', 'AB', 'AO'], target: 'AC' },
        ],
      },
      ...T('ex-18'),
    },
  },
  // LE PLUS COURT PASSAGE (« أدمج تعلّماتي », وضعية « ممر الراجلين »). مبتدئ : une passerelle sur la gorge du Rhummel,
  // A 1 carreau au-dessus, B 2 carreaux au-dessous, écart 3 — la place optimale (x = 1) n'est PAS au milieu de A et B,
  // 11 places, un fantôme de NM attaché à B guide la translation. متقدم : la وضعية du manuel avec les nombres de
  // l'extraction (A(−3 ; 5), B(4 ; −3), largeur 2, minimum √85 + 2), 19 places, aucune aide pour poser B′.
  'bridge-path': {
    beginner: { numbers: { width: 2, A: [0, 3], B: [3, -2] }, ...P },
    advanced: { numbers: { width: 2, A: [-3, 5], B: [4, -3] }, ...T('situation') },
  },
  // L'APPLI DE LIVRAISON (murakkibata-shuaa). مبتدئ (plateforme) : un quartier 8 × 7 autour du dépôt O ; cinq commandes —
  // CONDUIRE le livreur de A à B (compteurs signés en direct : (3 ; 2)), puis trois CODES écrits avant de partir (C → D le
  // même (3 ; 2) depuis un autre restaurant ; E → F vers la gauche et le bas (−2 ; −3) ; O → M : le code = l'adresse), puis
  // POSER la destination d'un code donné (3 ; −2) depuis P. متقدم (نشاط 1, p. 140) : la figure du manuel (A, B, C) sur
  // 10 × 8, le trajet A → B SANS compteurs (« +8 puis −2 » écrit après coup), B → D vers D(3 ; −2) qu'on ne voit pas,
  // OA et OD depuis le dépôt, puis u(3 ; −4) à représenter depuis A — plus grand, sans aide, des signes partout.
  'component-steps': {
    beginner: {
      numbers: {
        grid: [-4, 4, -3, 4],
        points: { A: [-4, -3], B: [-1, -1], C: [1, 1], D: [4, 3], E: [3, 1], F: [1, -2], M: [-3, 2], P: [-4, 4], Q: [-1, 2] },
        orders: [
          { id: '1', kind: 'walk', from: 'A', to: 'B' },
          { id: '2', kind: 'code', from: 'C', to: 'D' },
          { id: '3', kind: 'code', from: 'E', to: 'F' },
          { id: '4', kind: 'code', from: 'O', to: 'M' },
          { id: '5', kind: 'pin', from: 'P', u: [3, -2], to: 'Q' },
        ],
        live: true,
      },
      ...P,
    },
    advanced: {
      numbers: {
        grid: [-3, 7, -3, 5],
        points: { A: [-2, 4], B: [6, 2], C: [6, 4], D: [3, -2], E: [1, 0] },
        orders: [
          { id: 'AB', kind: 'walkCode', from: 'A', to: 'B' },
          { id: 'BD', kind: 'code', from: 'B', to: 'D', hidden: true },
          { id: 'OA', kind: 'code', from: 'O', to: 'A' },
          { id: 'OD', kind: 'code', from: 'O', to: 'D' },
          { id: 'u', kind: 'pin', from: 'A', u: [3, -4], to: 'E' },
        ],
        live: false,
      },
      ...T('act-1'),
    },
  },
  // LES PORTAILS DE LA CARTE DE JEU (hisab-murakkibatay). مبتدئ (plateforme, coordonnées positives) : le code du portail
  // A(1 ; 2) → B(4 ; 3) PRÉDIT au pavé signé, puis D posé pour que AB = DC (le piège CD = AB croise ABCD, sur la carte) ;
  // voyants des composantes en direct. متقدم (نشاط 2 p. 140) : le code de CD, E tel que DE(3 ; 4), le code de CF comparé
  // à DE (portails jumeaux) — trois missions, des négatifs, et les voyants seulement à la validation (`live: false`).
  'component-calc': {
    beginner: {
      numbers: {
        points: { A: [1, 2], B: [4, 3], C: [5, 5] },
        missions: [{ kind: 'calc', from: 'A', to: 'B' }, { kind: 'place', point: 'D', vec: ['D', 'C'], ref: ['A', 'B'] }],
      },
      ...P,
    },
    advanced: {
      numbers: {
        points: { C: [3, 1], D: [2, -5], F: [6, 5] },
        missions: [
          { kind: 'calc', from: 'C', to: 'D' },
          { kind: 'place', point: 'E', vec: ['D', 'E'], ref: [3, 4] },
          { kind: 'calc', from: 'C', to: 'F', compare: ['D', 'E'] },
        ],
        live: false,
      },
      ...T('act-2'),
    },
  },
  // LE RENDEZ-VOUS GPS (muntasaf-masafa). مبتدئ (plateforme) : deux amis A(1 ; −1) et B(4 ; 3) aux Sablettes — le milieu
  // (2,5 ; 1) n'est pas un nœud, l'escalier 3 puis 4 donne 5 ; projections et composantes lues en direct. متقدم : le نشاط 3
  // (K(5 ; 3), L(−3 ; 1) → J(1 ; 2), KJ = JL) puis le نشاط 4 (L(1 ; −2), K(5 ; 1), le coin M(5 ; −2), 4, 3, 5) sur le front
  // de mer d'Oran — deux paires de points, des coordonnées négatives, aucune lecture avant la validation.
  'midpoint-distance': {
    beginner: { numbers: { A: [1, -1], B: [4, 3] }, ...P },
    advanced: { numbers: { A: [5, 3], B: [-3, 1], names: ['K', 'L', 'J'], dist: { A: [1, -2], B: [5, 1], names: ['L', 'K', 'M'] } }, ...T('act-3') },
  },
  // LE فار DU ملعب الحي (درس « توظيف الحساب الشعاعي والإحداثيات لإثبات الخواص الهندسية »). مبتدئ : A, B fixes, C tenu ; le
  // départ C(−1 ; 2) a l'AIR droit en A (98°) et le فار le refuse (10 + 5 ≠ 17) ; objectifs « قائم في A » puis « متساوي
  // الساقين رأسه C ». متقدم : la طريقة p. 145 « حساب مسافات » — C(−2 ; y) glisse sur sa droite (y de −5 à 4, l'inconnue à
  // trouver : −4), puis l'étape ouverte par l'élève : D tenu, ABCD مربع et B, D sur le cercle de diamètre [AC] ; plus
  // d'étapes, des cartes-preuves à choisir sans aide, un départ D(2 ; 2) piège (diagonales égales, pas de parallélogramme).
  'shape-prover': {
    beginner: { numbers: { mode: 'triangle', A: [0, 0], B: [3, 1], C: [-1, 2] }, ...P },
    advanced: { numbers: { mode: 'unknown', A: [0, 2], B: [-4, 0], rail: { x: -2, min: -5, max: 4, start: 4 }, D: [2, 2] }, ...T('method-unknown') },
  },
  // DEUX PARCOURS (wadiya-idmajiya-maalam, « أدمج تعلّماتي »). Chaque parcours : un départ et des morceaux — droits (une
  // balise) ou DEMI-CERCLES de diamètre [from, to] (`arc`, le sens vu sur la figure). مبتدئ (rallye au Sahara, plateforme) :
  // deux morceaux par parcours, A et B communs — un demi-cercle autour d'une dune (centre I(−1 ; 0), 2π) puis 2, contre deux
  // lignes droites par le puits D (2√2 + 2√5 ≈ 7,30 : la ligne brisée gagne). متقدم (وضعية p. 148, cross des Sablettes) :
  // TROIS demi-cercles de A à B (3π ≈ 9,42) contre la ligne brisée M → P → Q → N (√13 + √5 + √17 ≈ 9,96 : les arcs gagnent),
  // trois centres à trouver sans balise aux jonctions, deux départs différents.
  'route-compare': {
    beginner: {
      numbers: {
        routes: [
          { start: [-3, 0], pieces: [{ to: [1, 0], arc: 'cw' }, { to: [3, 0] }], names: ['A', 'C', 'B'], centres: ['I'] },
          { start: [-3, 0], pieces: [{ to: [-1, -2] }, { to: [3, 0] }], names: ['A', 'D', 'B'] },
        ],
        unit: 'km',
      },
      ...P,
    },
    advanced: {
      numbers: {
        routes: [
          { start: [-2, 0], pieces: [{ to: [0, 0], arc: 'cw' }, { to: [2, 0], arc: 'ccw' }, { to: [4, 0], arc: 'cw' }], names: ['A', 'O', 'E', 'B'], centres: ['I', 'J', 'K'] },
          { start: [-2, 3], pieces: [{ to: [1, 1] }, { to: [3, 2] }, { to: [4, -2] }], names: ['M', 'P', 'Q', 'N'] },
        ],
        unit: 'km',
      },
      ...T('situation'),
    },
  },
  // ── Unité 13 « الدوران - الزوايا - المضلّعات المنتظمة » (2026-10-04) — paires PROVISOIRES semées par le lead ; chaque
  // auteur les affine (refs = ids de docs/sources/4am/unit13/extraction.json). Angles en degrés, orientation 'direct' | 'indirect'.
  // LA GRANDE ROUE (mafhum-dawaran, affiné par l'auteur) : six nacelles, des rotations d'un ou deux PAS de 60° (60°, 120°),
  // chacune dans les deux sens (le jumeau horaire est le contraste), l'image posée sur un nœud EXACT de la roue ; متقدم : le
  // نشاط 2 (70°, un point puis un autre) et le نشاط 3 (72° : une قطعة, une دائرة) sur une feuille, au compas et à la منقلة —
  // des angles qui ne tombent sur aucun rayon, trois gestes par point, aucun voyant pendant le geste.
  'rotation-dial': {
    beginner: { numbers: { scene: 'wheel', r: 3, inner: 1.8, gondolas: 6, step: 60, tasks: [['A', 1, 'direct'], ['A', 1, 'indirect'], ['C', 2, 'direct'], ['C', 2, 'indirect']] }, ...P },
    advanced: {
      numbers: {
        scene: 'plane',
        missions: [
          { id: 'point', alpha: 70, direction: 'direct', points: { A: [3, 1], B: [-1, 2.5] } },
          { id: 'segment', alpha: 72, direction: 'direct', points: { A: [-3, 2], B: [1, 2] } },
          { id: 'circle', alpha: 72, direction: 'direct', points: { W: [-2.5, 2], A: [-2.5, 3.5] } },
        ],
      },
      ...T('act-2'),
    },
  },
  // LE PAPIER CALQUE épinglé en O (khawas-dawaran). مبتدئ : une rosace de zellige de Tlemcen — un pétale ABC tourné de 60°
  // dans le sens direct, cinq copies imprimées de proche en proche (60° plutôt que 90° : le 90° ⇒ ⊥ reste la découverte du
  // manuel au niveau متقدم). متقدم : la طريقة p. 155 — OAB, OCD rectangles isocèles en O, la copie de [AC] tombe sur [BD]
  // pour (O, 90°, direct) seulement ; AC = BD et (AC) ⊥ (BD) prouvés par cartes ; puis le centre W de l'exercice 18.
  'shape-turn': {
    beginner: { numbers: { mode: 'rosette', center: [0, 0], alpha: 60, direction: 'direct', shape: { A: [1, 0], B: [4, 0], C: [2, 2] } }, ...P },
    advanced: {
      numbers: {
        mode: 'prove', center: [0, 0], alpha: 90, direction: 'direct', points: { A: [4, -2], B: [2, 4], C: [-1, 2], D: [-2, -1] },
        centerTask: { M: [1, 3], N: [0, 2], P: [2, 2], "M'": [3, 3], "N'": [4, 2], "P'": [4, 4], grid: 5, start: [0, 0] },
      },
      ...T('method-properties'),
    },
  },
  // L'ANGLE DE TIR (zawiya-muhitiya, affiné par son auteur) : مبتدئ = les poteaux A (150°) et B (30°) sur un cercle de rayon 4,
  // angle au centre 120°, le tireur M part de 250° — un PARI puis deux positions du grand arc et un contraste ; متقدم = le
  // نشاط 4 (A 140°, B 40° : la figure du manuel tournée de 10° pour que la ligne de but soit horizontale, angle au centre 100°),
  // D part de 280° et TROIS étapes ouvertes par l'élève (le diamètre de مزيان, la relation choisie, les trois D de هوارية avec O
  // dedans et dehors, puis le D intérieur de l'exercice 12) : plus d'étapes, aucune valeur donnée d'avance.
  'inscribed-angle': {
    beginner: { numbers: { r: 4, A: 150, B: 30, M: 250 }, ...P },
    advanced: { numbers: { r: 5, A: 140, B: 40, D: 280, stages: ['mezian', 'houaria', 'interior'] }, ...T('act-4') },
  },
  // LA FORGE DE POLYGONES (mudalaat-muntazama). مبتدئ (plateforme) : une alvéole de ruche de Kabylie — l'élève cherche
  // l'angle α qui referme un HEXAGONE de rayon 3 cm (60°, côté = rayon : l'astuce des abeilles) ; départ à 50° (360 ÷ 50 =
  // 7,2 : la figure ne se ferme jamais). متقدم (le تحدّ p. 151) : l'étoile du drapeau sur un tifo — cinq pointes (72°),
  // puis le rayon qui met deux pointes consécutives à 10 cm (R = 5 / sin 36° ≈ 8,51, au centième près), puis les branches
  // (un sommet sur deux) : trois étapes ouvertes par l'élève, aucune lecture avant le geste, départ à 60° (une ruche).
  'polygon-forge': {
    beginner: { numbers: { n: 6, r: 3 }, ...P },
    advanced: { numbers: { n: 5, tip: 10, star: 2 }, ...T('challenge') },
  },
  // LES LAMPADAIRES DU MASSIF (wadiya-idmajiya-dawaran, « أدمج تعلّماتي »). مبتدئ (plateforme) : 4 poteaux sur un massif de
  // 2 m — un carré, l'angle au centre droit, 2√2 ≈ 2,83 m par Pythagore ou le sinus de 45°. متقدم (وضعية p. 160) : 6 poteaux sur
  // 3 m — l'hexagone, 60°, d = r = 3 m ; six poteaux à placer à la main au lieu de quatre, et un dernier écart qui ne se voit plus
  // à l'œil ; `extra` : le nombre de poteaux proposé APRÈS la règle (12 : 30°, d = 6·sin 15° ≈ 1,55 m, approché seulement — jamais les 8 poteaux du إختبار).
  'lamp-ring': {
    beginner: { numbers: { n: 4, r: 2 }, ...P },
    advanced: { numbers: { n: 6, r: 3, extra: 12 }, ...T('situation') },
  },
  // Unité 14 « الهندسة في الفضاء » — paires PROVISOIRES semées par le lead (2026-10-05) ; chaque auteur les affine.
  // LA SONDE (kura-julla, affinée par l'auteur) : مبتدئ (plateforme) = la lampe-globe de verre de rayon 3 et trois sondes à
  // classer, A(1 ; 2 ; 2), B(1 ; 1 ; 1), C(2 ; 2 ; 2) — OM = 3, √3, 2√3 (sur / dans / hors), OM² lu en direct ; متقدم = le نشاط 1
  // (r = 4) et l'exemple de معارف 1 : l'élève PLACE M sur la كرة, P dans la جلة, Q dehors sans lecture de OM pendant le geste
  // (il la calcule), puis ouvre le قطر [MM′] et les دوائر كبرى / صغرى (plan z = h). Nœuds entiers de [−bound ; bound]³.
  'sphere-probe': {
    beginner: { numbers: { R: 3, bound: 4, probes: [[1, 2, 2], [1, 1, 1], [2, 2, 2]] }, ...P },
    advanced: { numbers: { R: 4, bound: 5, tasks: ['surface', 'inside', 'outside', 'diameter', 'great-circle', 'small-circle'] }, ...T('act-1') },
  },
  // ARCHIMÈDE ET L'ORANGE (misaha-hajm-kura) : مبتدئ = une orange de rayon 3 cm (peau = 4 disques, 36π) ; متقدم = l'introduction
  // d'Archimède (cylindre de hauteur 2R) puis l'exemple de معارف 2 (R = 1,4 cm : 24,63 cm² et 11,494 cm³).
  'orange-peel': {
    beginner: { numbers: { R: 3 }, ...P },
    advanced: { numbers: { R: 5, example: '1,4', rounding: [2, 3] }, ...T('intro-archimedes') },
  },
  // LA TRANCHEUSE (maqati-mustawiya) — l'imprimante 3D du fablab dépose le solide couche par couche, chaque couche est une
  // section plane. مبتدئ (plateforme) : une sphère de rayon 5, des couches au centimètre (h = 0 … 6) ; les marques 0, 3, 4, 5
  // donnent les rayons entiers 5, 4, 3 et le contact. متقدم (le manuel) : le نشاط 2 (R = 3, x = OI au vingtième pour atteindre
  // 0 ; 1,25 ; 2 ; 2,8 ; 3 — des rayons irrationnels √119/4, √5, √29/5), puis, ouverts par l'élève, la بلاطة 25 × 20 × 6 du
  // نشاط 3 (parallèle à CBFG, puis à [CG] avec DM = 21, BN = 17), la أسطوانة r = 1,7, h = 6 du نشاط 4 (d = 0,8) et le هرم
  // AB = 4, SE = 3/4 SA du نشاط 5 : plus de solides, des racines, et chaque prédiction sans marque d'aide.
  'section-slicer': {
    beginner: { numbers: { solids: ['sphere'], R: 5, step: 1, stops: [0, 3, 4, 5], start: 2 }, ...P },
    advanced: { numbers: { solids: ['sphere', 'cuboid', 'cylinder', 'pyramid'], R: 3, step: '1/20', stops: [0, 1.25, 2, 2.8, 3], start: 1.5, foot: 'I', cuboid: { dims: [25, 20, 6], dm: 21, bn: 17 }, cylinder: { r: 1.7, h: 6, d: 0.8 }, pyramid: { side: 4, height: 6, ratio: '3/4' } }, ...T('act-2') },
  },
  // LES BLOCS (takbir-tasghir) : مبتدئ = un cube d'arête 1 agrandi k = 2, 3 (8, 27 cubes) ; متقدم = le نشاط 6 (pavé 5 × 4 × 3,
  // réduction k = 3/5 : 3 ; 2,4 ; 1,8 ; 𝒱′ = 12,96 ; 𝒜′ = 33,84).
  'scale-blocks': {
    beginner: { numbers: { dims: [1, 1, 1], ks: [2, 3] }, ...P },
    advanced: { numbers: { dims: [5, 4, 3], ks: ['3/5', 2] }, ...T('act-6') },
  },
  // LE SEAU (wadiya-idmajiya-fada) : مبتدئ = un gobelet tronc de cône (r 3, R 4, H 6) ; متقدم = le تحدّ (fond 30 cm, ouverture
  // 40 cm ; lecture de l'extraction : 7 cm du bord à l'eau + 28 cm de l'eau au fond ⇒ H = 35, eau profonde de 28 cm, V = 24388π/3).
  'bucket-fill': {
    beginner: { numbers: { r: 3, R: 4, H: 6, depth: 6 }, ...P },
    advanced: { numbers: { r: 15, R: 20, H: 35, depth: 28 }, ...T('challenge') },
  },
  // ── 1AM, unité 2 « الجمع والطرح » (2026-10-14) ──
  // LE MODÈLE EN BARRES (story-bars). مبتدئ : la toise du الفحص الطبي (سارة 130 cm, quatre enfants, entiers, deux
  // pièges « تزيد / تنقص ») — la main TIRE l'inconnue, la taille se voit ; متقدم : نشاط 1 du manuel (six textes, six
  // cartes, décimaux) — plus de toise ni de lecture : l'élève DÉCIDE l'opération avant de voir la bande. Le mode vient de
  // l'histoire (STORIES[id].mode, logic/storyBars.js) ; `method29` (la méthode p. 29) se pose seule, levels={false}.
  'story-bars': {
    beginner: { numbers: { story: 'checkup' }, ...P },
    advanced: { numbers: { story: 'act1' }, ...T('act-1') },
  },
  // ── 1AM, unité 3 « الضرب والقسمة » (2026-10-14) ──
  // LA DIVISION EUCLIDIENNE TIRÉE (division-jumps) : b est DONNÉ, la main tient q. مبتدئ : 47 fleurs dessinées, bouquets
  // de 6 (plateforme, thème garden) — chaque fleur se voit, puis le contraste 48 ; متقدم : نشاط 3 du manuel, 279 fleurs
  // en bouquets de 14 sur une droite graduée (sauts de 14) — trop pour les dessiner, les multiples ne sont pas écrits :
  // l'élève estime 14 × 10, 14 × 20 et encadre 279. `world: 'line'` seul (253 ÷ 17, معارف 2) se pose avec levels={false}.
  'division-jumps': {
    beginner: { numbers: { a: 47, b: 6, world: 'flowers', then: 48 }, ...P },
    advanced: { numbers: { a: 279, b: 14, world: 'line' }, ...T('act-3') },
  },
  // LES CRITÈRES DE DIVISIBILITÉ (digit-cards). مبتدئ : la table 0–48 en 7 colonnes du نشاط 4 (rouge ÷2, bleu ÷5, vert ÷3) —
  // chaque case touchée est jugée par son reste ; متقدم : les cartes 4, 5, 9, 3 du تمرين 26 — plus difficile : quatre chiffres
  // à disposer, CINQ diviseurs au lieu de trois, des cibles « le plus grand » et deux cibles impossibles (4 et 9, « لا يوجد »).
  'digit-cards': {
    beginner: { numbers: { mode: 'grid', from: 0, to: 48, columns: 7, divisors: [2, 5, 3] }, ...T('act-4') },
    advanced: { numbers: { mode: 'cards', digits: [4, 5, 9, 3], divisors: [2, 3, 5, 4, 9] }, ...T('ex-26') },
  },
  // ── 1AM, unité 4 « الكتابات الكسرية » (2026-10-14) ──
  // LE COUTEAU ET LA PART (fraction-knife) : la part p/q est FIXE, la main tient d (le nombre de morceaux du tout). مبتدئ :
  // le plateau de قلب اللوز (plateforme, thème sweets-tray), 3/5 pour les voisins, d de 1 à 20, et la proposition d'Amine
  // « 3/5 = 4/6 » jugée au couteau ; متقدم : les trois rectangles du نشاط 4 (3/5, 6/10, 12/20) puis le cadeau du grand-père
  // 27/45 — d jusqu'à 45, des épingles de prédiction AVANT que le couteau bouge (logic/fractionKnife.js).
  'fraction-knife': {
    beginner: { numbers: { world: 'tray', share: [3, 5], start: 5, max: 20, claim: [4, 6] }, ...P },
    advanced: { numbers: { world: 'paper', share: [3, 5], start: 5, max: 20, targets: [[6, 10], [12, 20]], then: { share: [27, 45], start: 45, max: 45, predict: true } }, ...T('act-4') },
  },
  // ── 1AM, unité 1 « الأعداد الطبيعية والأعداد العشرية » (2026-10-14) ──
  // L'ÉCHANGE DIX POUR UN (rank-exchange). مبتدئ : l'atelier d'emballage des crayons (plateforme, thème packing) — 1 carton,
  // 13 boîtes, 24 paquets, 37 crayons à emballer (2577, pas « 1132437 »), puis 2017 à déballer en paquets de 10 (201, pas
  // 1) ; متقدم : les jetons de rang du نشاط 1 ③ et de معارف 1 — 999 + 1 en cascade, 999 − 1, 1000 − 1 (il faut ouvrir), et
  // les dictées 7065 et 4 908 732 sur le tableau à 7 colonnes par classes. `world: 'money'` (1345 DA en billets de 100, تمرين 2)
  // se pose seul, levels={false}.
  'rank-exchange': {
    beginner: { numbers: { world: 'pencils', tasks: ['pack', 'unpack'], start: { 3: 1, 2: 13, 1: 24, 0: 37 }, n: 2017, rank: 1 }, ...P },
    advanced: { numbers: { world: 'tokens', tasks: ['next', 'previous', 'borrow', 'dictation'], next: 999, borrow: 1000, dictation: [7065, 4908732] }, ...T('act-1') },
  },
  // ── 2AM, unité 2 « الكسور والعمليات عليها » (2026-10-14) ──
  // LE TAPIS ET LA RÈGLE DES PLATEAUX (egg-trays) : b est DONNÉ, la main tient a (les œufs emballés). مبتدئ : le panier de
  // Salma (plateforme, thème farm) — 50 œufs en boîtes de 12, chaque œuf dessiné, règle 0 … 7, puis le contraste 60 ;
  // متقدم : نشاط 1 du manuel — 2145 œufs en plateaux de 30, palettes de 10, règle 0 … 74 et son zoom, le contraste 2160,
  // puis la division du fils « 2145 = 30 × 70 + 45 » à juger.
  'egg-trays': {
    beginner: { numbers: { a: 50, b: 12, then: 60, world: 'carton' }, ...P },
    advanced: { numbers: { a: 2145, b: 30, then: 2160, claim: { q: 70, r: 45 }, world: 'tray' }, ...T('act-1') },
  },
  // ── 1AM, unité 4 « الكتابات الكسرية » — la fraction est le quotient (2026-10-15) ──
  // LE PARTAGE ÉQUITABLE (fair-share) : a pains pour b enfants, la main tient la part x d'un enfant. مبتدئ : la cantine de
  // l'école (plateforme, thème bakery) — 3 pains pour 4 enfants (la règle décimale tombe juste : 0,75) puis 2 pains pour 3
  // (jamais juste en décimal, la règle des morceaux tombe juste) ; متقدم : نشاط 1 du manuel — 5 pains pour 6 personnes puis
  // 7 pains pour 3 (la part dépasse un pain : 7/3 = 2 pains et un tiers), jamais de part décimale juste.
  'fair-share': {
    beginner: { numbers: { scene: 'canteen', orders: [[3, 4], [2, 3]] }, ...P },
    advanced: { numbers: { scene: 'family', orders: [[5, 6], [7, 3]] }, ...T('act-1') },
  },
});

export { MANIPULATION_LEVEL_IDS };

/** La paire { beginner, advanced } d'un type, ou `null` s'il n'en déclare pas. */
export function levelsFor(type) {
  return LEVELS[type] ?? null;
}

const sameNumbers = (preset, numbers) =>
  !!preset && Object.keys(preset.numbers).every((k) => preset.numbers[k] === numbers?.[k]);

/** Le niveau dont les nombres sont exactement ceux passés, ou `null`. */
export function levelMatching(type, numbers) {
  const pair = levelsFor(type);
  if (!pair) return null;
  return MANIPULATION_LEVEL_IDS.find((id) => sameNumbers(pair[id], numbers)) ?? null;
}

/**
 * Les deux niveaux d'UNE manipulation posée par un module.
 *
 * Les nombres écrits par la leçon (`authored`) sont TOUJOURS l'un des deux
 * niveaux — l'élève arrive sur l'exemple de la leçon, jamais sur autre chose.
 * Lequel ? Celui demandé (`requested`), sinon celui dont la paire du type a
 * exactement ces nombres, sinon `beginner`. L'autre niveau est celui du type.
 *
 *   authored 27/36 (coprime)  → advanced = 27/36 (la leçon), beginner = 17/18
 *   authored 28/42 (common)   → beginner = 28/42 (la leçon), advanced = 65/78
 *
 * Retourne `{ initial, levels }` ou `null` si le type n'a pas de paire.
 */
export function resolveManipulationLevels(type, authored, requested) {
  const pair = levelsFor(type);
  if (!pair) return null;
  const matched = levelMatching(type, authored);
  const initial = requested != null ? resolveLevelId(requested) : (matched ?? MANIPULATION_LEVEL_IDS[0]);
  const base = matched === initial ? pair[initial] : { source: 'lesson' };
  return {
    initial,
    levels: { ...pair, [initial]: { ...base, numbers: authored, authored: true } },
  };
}
