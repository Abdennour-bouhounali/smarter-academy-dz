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
  // ── 1AM, unité 1 — le كسر عشري et l'écriture à virgule (2026-10-15) ──
  // LA VIRGULE SOUS LA MAIN (decimal-comma) : les chiffres du bon de commande sont fixes, la main tient la virgule.
  // مبتدئ : l'atelier de zellige (plateforme, thème mosaic) — la table du client montre 2 panneaux, 3 bandes et 5 carreaux :
  // les chiffres 2 3 5 sans virgule ne disent pas « 2,35 » (235 panneaux, 23,5, 2,35, 0,235) ; puis 0,37 et 0,05 (le zéro
  // garde la place des dixièmes vides) ; متقدم : le bon est un كسر عشري donné (3125/1000 puis 605/100 — le nombre de chiffres
  // après la virgule est le nombre de zéros du dénominateur), puis le zéro inutile de 2,50 = 2,5. Le monde `machine`
  // (×10, ×100, ×1000, ÷10 … — `shift`) se pose dans le module de la طريقة avec ses propres `world` et `tasks` : voir le brief
  // docs/sources/1am/unit1/brief-authors.md.
  'decimal-comma': {
    beginner: { numbers: { world: 'mosaic', tasks: [{ kind: 'match', digits: '235', target: '2,35' }, { kind: 'match', digits: '37', target: '0,37' }, { kind: 'match', digits: '05', target: '0,05' }] }, ...P },
    advanced: { numbers: { world: 'mosaic', tasks: [{ kind: 'fraction', digits: '3125', target: '3125/1000' }, { kind: 'fraction', digits: '605', target: '605/100' }, { kind: 'match', digits: '250', target: '2,5' }] }, ...T('act-3') },
  },
  // ── 1AM, unité 1 — comparer et ranger des décimaux (2026-10-15) ──
  // LA GRADUATION SOUS LA MAIN (ruler-compare) : sauts en longueur (monde `jump`, thème sandpit) ; la main tient la graduation de la
  // règle. مبتدئ : quatre COMPARAISONS (4,6 contre 4,35 — le piège « 35 > 6 » ; 8,05 contre 8,5 — le zéro qui garde la place ;
  // 12,70 contre 12,7 — l'égalité ; 9,87 contre 10,2 — les parties entières décident, la règle la plus grossière suffit) ;
  // متقدم : RANGER des suites (croissant, puis décroissant avec des égaux et un nombre entier).
  'ruler-compare': {
    beginner: { numbers: { world: 'jump', tasks: [
      { kind: 'compare', a: '4,6', b: '4,35' },
      { kind: 'compare', a: '8,05', b: '8,5' },
      { kind: 'compare', a: '12,70', b: '12,7' },
      { kind: 'compare', a: '9,87', b: '10,2' },
    ] }, ...P },
    advanced: { numbers: { world: 'jump', tasks: [
      { kind: 'order', values: ['7,4', '7,04', '7,45', '6,98', '7,405'], dir: 'asc' },
      { kind: 'order', values: ['2,5', '2,05', '0,75', '2,500', '3'], dir: 'desc' },
    ] }, ...T('act-5') },
  },
  // ── 1AM, unité 11 — surface, périmètre, aire (2026-10-15) ──
  // LE CARREAU SOUS LA MAIN (tile-yard) : la main tient un carreau de zellige (thème courtyard). مبتدئ : la cour de la maison du grand-père,
  // 12 carreaux seulement DÉPLACÉS (mode fence) : l'aire ne bouge pas, la clôture change — d'abord la plus courte, puis 20 bâtons ;
  // متقدم : un rouleau de corde de 12 bâtons et des carreaux libres (mode rope) : la même clôture, des aires différentes — le plus de carreaux
  // (9), puis le moins (5). Le monde `floor` (demi-carreaux, unité double) se pose dans le module de la طريقة avec ses propres `world`,
  // `tasks` et `levels={false}`.
  'tile-yard': {
    beginner: { numbers: { world: 'yard', mode: 'fence' }, ...P },
    advanced: { numbers: { world: 'yard', mode: 'rope' }, ...T('act-1') },
  },
  // ── 3AM, unité 4 « الحساب الحرفي » — réduire une somme, supprimer des parenthèses (2026-10-20) ──
  // LE TERME SOUS LA MAIN (like-terms, thème workbench) : chaque terme est une pile de pièces de bois à sa forme (x², x, 1), la main la
  // porte dans la صينية de sa forme. مبتدئ (plateforme) : des x et des nombres seulement, lectures visibles, la forme réduite s'écrit
  // seule — 2x + 3 + 4x + 1 + x, puis 5x + 6 − 2x − 4 (des pièces opposées s'annulent). متقدم (نشاط 1 du manuel) : des x² entrent,
  // plus de lecture : l'élève écrit le coefficient de chaque صينية et « تحقّق » juge — 4x² + 7 − x − 2x² + 5x − 9, puis
  // 3x² − 4x + 6 + x − 3x² − 2 (la صينية x² se vide : le terme disparaît). Le monde `brackets` (caisses « +( ) » / « −( ) ») se pose
  // dans le module de la طريقة avec `world="brackets"` et `levels={false}`.
  'like-terms': {
    beginner: { numbers: { world: 'collect', tasks: [
      { id: 'collect-1', expr: [{ c: 2, p: 1 }, { c: 3, p: 0 }, { c: 4, p: 1 }, { c: 1, p: 0 }, { c: 1, p: 1 }] },
      { id: 'collect-2', expr: [{ c: 5, p: 1 }, { c: 6, p: 0 }, { c: -2, p: 1 }, { c: -4, p: 0 }] },
    ] }, ...P },
    advanced: { numbers: { world: 'collect', tasks: [
      { id: 'collect-3', expr: [{ c: 4, p: 2 }, { c: 7, p: 0 }, { c: -1, p: 1 }, { c: -2, p: 2 }, { c: 5, p: 1 }, { c: -9, p: 0 }] },
      { id: 'collect-4', expr: [{ c: 3, p: 2 }, { c: -4, p: 1 }, { c: 6, p: 0 }, { c: 1, p: 1 }, { c: -3, p: 2 }, { c: -2, p: 0 }] },
    ] }, ...T('act-1') },
  },
  // ── 3AM, unité 4 « الحساب الحرفي » — développer (2026-10-21) ──
  // LA COUPURE SOUS LA MAIN (area-split, thème schoolgarden) : un terrain du jardin de l'école dont les côtés sont les facteurs ;
  // la main fait glisser la coupure puis DÉCIDE le signe de chaque parcelle (l'aire comptée du terrain est le juge). مبتدئ (plateforme) :
  // k(x + 4) puis k(x − 3) — un massif, puis une allée dallée ôtée ; accolades, aires écrites et ligne réduite qui s'écrit seule.
  // متقدم (نشاط 3 du manuel) : (x + 3)(x + 2) — quatre parcelles, deux coupures, deux parcelles semblables —, puis (x − 2)(x − 3) :
  // deux allées qui se croisent, le COIN ôté deux fois se rend ; plus d'accolades ni d'aires, la main écrit le coefficient de chaque
  // puissance. Le monde `arrows` (flèches du facteur vers chaque terme) se pose seul dans la طريقة avec `world="arrows"`, ses `tasks`
  // et `levels={false}`.
  'area-split': {
    beginner: { numbers: { world: 'plot', tasks: [
      { id: 'p1', h: { m: 0, n: 3 }, w: { m: 1, n: 4 } },
      { id: 'p2', h: { m: 0, n: 2 }, w: { m: 1, n: -3 } },
    ] }, ...P },
    advanced: { numbers: { world: 'plot', tasks: [
      { id: 'p3', h: { m: 1, n: 3 }, w: { m: 1, n: 2 } },
      { id: 'p4', h: { m: 1, n: -2 }, w: { m: 1, n: -3 } },
    ] }, ...T('act-3') },
  },
  // ── 3AM, unité 11 « خاصية فيثاغورس، جيب تمام زاوية » (2026-10-20) ──
  // LES BASSINS CARRÉS SOUS LA MAIN (pythagoras-tanks, thème sciencefair). مبتدئ (plateforme) : bras 3 et 4, la main tient l'ANGLE
  // en A ; « اسكب » : plein juste à 90° seulement, puis un angle plus petit (déborde) et plus grand (vide). متقدم (تمرين 6 : 5 et 12) :
  // la main tient la LONGUEUR BC sur un ruban au dixième — il faut la PRÉVOIR (13) ; puis 2 et 3 : aucun dixième ne remplit, la touche
  // √ donne √13 (une décision de plus, des nombres plus grands).
  'pythagoras-tanks': {
    beginner: { numbers: { mode: 'angle', b: 3, c: 4 }, ...P },
    advanced: { numbers: { mode: 'length', b: 5, c: 12 }, ...T('ex-6') },
  },
  // ── 3AM, unité 3 « القوى ذات أسس نسبية صحيحة » (2026-10-21) ──
  // L'EXPOSANT SOUS LA MAIN (power-train, thème railway) : un train part en portant 1, chaque wagon « × a » (ou « ÷ a » sous
  // zéro) agit sur sa charge ; la main tient n, la longueur signée du train. مبتدئ (plateforme) : base −2, les charges 16, −32
  // puis 1 (aucun wagon), charges écrites au-dessus de chaque wagon et paires de wagons négatifs liées. متقدم (معارف 6 : a⁻ⁿ) :
  // base −3, −27, 81, 1/9 et −1/27 — des wagons « ÷ » sous zéro, et plus aucune charge intermédiaire écrite. Le monde `couple`
  // (deux trains attelés) se pose seul dans معارف avec `world="couple"`, ses `tasks` et `levels={false}`.
  'power-train': {
    beginner: { numbers: { world: 'build', base: '-2', targets: ['16', '-32', '1'] }, ...P },
    advanced: { numbers: { world: 'build', base: '-3', targets: ['-27', '81', '1/9', '-1/27'] }, ...T('know-6') },
  },
  // ── 3AM, unité 5 « المساويات – المتباينات – المعادلات » (2026-10-21) ──
  // LE NOMBRE D'UNE OPÉRATION SOUS LA MAIN (equality-lanes, thème stadium) : x est un nombre caché ; deux coureurs se tiennent chacun à la
  // valeur d'un membre. La main règle c et l'opération et choisit qui la reçoit. مبتدئ (plateforme : 10 = 4x − 2, x = 3) : quatre tâches d'une
  // seule opération (−2, +2, ×3, ÷2). متقدم (c négatifs, deux opérations) : 5 = −3x + 1 (x = −4/3) — ×(−2), puis ×2 et −3, puis −1 et ÷(−3), jusqu'à
  // x seul. Le test des niveaux mesure ces presets par leur nombre d'opérations.
  'equality-lanes': {
    beginner: { numbers: { left: '10', right: '4x-2', x: '3', tasks: [[['add', -2]], [['add', 2]], [['mul', 3]], [['div', 2]]] }, ...P },
    advanced: { numbers: { left: '5', right: '-3x+1', x: '-4/3', tasks: [[['mul', -2]], [['mul', 2], ['add', -3]], [['add', -1], ['div', -3]]] }, ...T('method-1b') },
  },
  // LE SIGNE D'UN TERME SOUS LA MAIN (term-ferry, thème river) : l'équation a une solution CACHÉE ; la main porte chaque caisse (terme) d'une rive à
  // l'autre en choisissant son signe, puis le diviseur. مبتدئ (plateforme) : 3x + 2 = x + 8 (x = 3) puis 4x − 3 = 2x + 7 (x = 5), x se rassemble à gauche.
  // متقدم (طريقة p. 77) : 9x + 1 = 5x − 7 (x = −2), puis −2x + 5 = 3x − 10 (un coefficient NÉGATIF : on divise par −5), puis 7x − 190 = 6x + 110 (x = 300).
  // Le test des niveaux mesure ces presets par leur nombre de tâches.
  'term-ferry': {
    beginner: { numbers: { tasks: [{ left: '3x+2', right: 'x+8' }, { left: '4x-3', right: '2x+7' }] }, ...P },
    advanced: { numbers: { tasks: [{ left: '9x+1', right: '5x-7' }, { left: '-2x+5', right: '3x-10' }, { left: '7x-190', right: '6x+110' }] }, ...T('method-4') },
  },
  // ── 3AM, unité 1 « الأعداد النسبية » (2026-10-26) ──
  // LE TEMPS SIGNÉ SOUS LA MAIN (elevator-reel, thème mallElevator) : un ascenseur passe par l'étage 0 à l'instant 0 d'un film, à vitesse r (étages/minute,
  // signée) ; à l'instant t (signé) il est à l'étage r × t. مبتدئ (plateforme, pas 1, r imposée) : m1 r = −2 → étage −6, m2 r = −2 → étage 4 (le film est
  // REMBOBINÉ : t = −2), m3 r = 3 → 6, m4 r = 3 → −9. متقدم (know-1, pas 0,5, la main tient AUSSI r) : a1 prédire l'étage de (−3, −2) AVANT de voir (cartes), a2 l'étage −6
  // en montant PUIS en descendant, a3 r = −2 → 3 (t = −1,5), a4 r = 2 → −5 (t = −2,5). Le test des niveaux mesure la paire par la finesse du pas et la prédiction.
  'elevator-reel': {
    beginner: { numbers: { step: '1', tasks: [
      { id: 'm1', r: '-2', floor: '-6' }, { id: 'm2', r: '-2', floor: '4' }, { id: 'm3', r: '3', floor: '6' }, { id: 'm4', r: '3', floor: '-9' },
    ] }, ...P },
    advanced: { numbers: { step: '0,5', tasks: [
      { id: 'a1', kind: 'predict', r: '-3', t: '-2', options: ['6', '-6', '-5', '1'], key: '6' },
      { id: 'a2', kind: 'both', floor: '-6' }, { id: 'a3', r: '-2', floor: '3' }, { id: 'a4', r: '2', floor: '-5' },
    ] }, ...T('know-1') },
  },
  // ── 3AM, unité 4 « الحساب الحرفي », leçon 3 (2026-10-26) ──
  // LA VALEUR SOUS LA MAIN (marble-run, thème marblerun) : un mur de billes calcule une expression ; la main lâche une bille dans le réservoir de la lettre, ÉCRIT la ligne de la
  // substitution (× et parenthèses) puis lance. مبتدئ (plateforme, les puces des stations pendant la course) : r1 4x + 7 en 3 (le × manquant fond 4 et 3 en 43), r2 4x + 7 en −2 (parenthèses),
  // r3 x² − 3x en −2 (la copieuse : (−2)² et non −2²). متقدم (know-4 : deux lettres, des valeurs rationnelles) : la valeur est PRÉDITE avant le lancement, pas de puces pendant la course :
  // r4 5 − 2x² en −3, r5 6x − 1 en −1/2, r6 3x − 2y en (−1 ; 4). Le monde `twins` (deux murs, un contre-exemple) se pose seul dans la طريقة avec `world="twins"`, ses `tasks` et `levels={false}`.
  // Le test des niveaux mesure la paire par la PRÉDICTION (متقدم seul) et par les deux lettres.
  'marble-run': {
    beginner: { numbers: { world: 'run', predict: false, tasks: [
      { id: 'r1', expr: '4x+7', target: { x: '3' } }, { id: 'r2', expr: '4x+7', target: { x: '-2' } }, { id: 'r3', expr: 'x²-3x', target: { x: '-2' } },
    ] }, ...P },
    advanced: { numbers: { world: 'run', predict: true, tasks: [
      { id: 'r4', expr: '5-2x²', target: { x: '-3' } }, { id: 'r5', expr: '6x-1', target: { x: '-1/2' } }, { id: 'r6', expr: '3x-2y', target: { x: '-1', y: '4' } },
    ] }, ...T('know-4') },
  },
  // LE CODE MANQUANT SOUS LA MAIN (code-lockers, thème libraryLockers, 3AM unité 1, leçon 3, 2026-10-26) : le cadenas d'un casier de la bibliothèque municipale porte une règle « b × ? = a » ;
  // la main roule les MOLETTES du code (signe + chiffres) et tire la poignée. مبتدئ (plateforme, l'écran multiplie en direct) : m1 (−6) × ? = 48 → −8, m2 9 × ? = −54 → −6, m3 ? × (−7) = −63 → 9
  // (l'inconnue écrite en premier), m4 (−12) × ? = −60 → 5 (−5 refusé avec 60). متقدم (know-8 : le SIGNE est posé et « ثبّت » pressé avant que les molettes de chiffres se débloquent ; l'écran ne
  // multiplie qu'après un essai) : a1 (−8) × ? = −2 → 0,25, a2 2,5 × ? = −7,5 → −3, a3 (−0,4) × ? = 1,2 → −3, a4 ? × (−5) = 0 → 0 (l'une ou l'autre signe). Le monde `fraction` (معارف) est posé par la leçon.
  // Le test des niveaux mesure la paire par le SIGNE POSÉ AVANT les chiffres (commit, متقدم seul) et par le code DÉCIMAL.
  'code-lockers': {
    beginner: { numbers: { world: 'lockers', tasks: [
      { id: 'm1', b: '-6', a: '48' }, { id: 'm2', b: '9', a: '-54' }, { id: 'm3', b: '-7', a: '-63', qFirst: true }, { id: 'm4', b: '-12', a: '-60' },
    ] }, ...P },
    advanced: { numbers: { world: 'lockers', tasks: [
      { id: 'a1', b: '-8', a: '-2', layout: 'dec', commit: true }, { id: 'a2', b: '2,5', a: '-7,5', layout: 'dec', commit: true },
      { id: 'a3', b: '-0,4', a: '1,2', layout: 'dec', commit: true }, { id: 'a4', b: '-5', a: '0', qFirst: true, layout: 'dec', commit: true },
    ] }, ...T('know-8') },
  },
  // ── 2AM, unité 3 « الأعداد النسبية » (2026-10-21) ──
  // LA DISTANCE À ZÉRO SOUS LA MAIN (zero-probe, thème researchBoat) : la main tient la longueur d'un câble qui descend (ou monte)
  // du zéro, le côté est un interrupteur à part, le nombre relatif de B est leur sortie. مبتدئ (plateforme, pas 1) : A=−3 sous le zéro,
  // plus de câble rend B plus BAS puis moins de câble le rend plus haut ; A=4 au-dessus du zéro, plus de câble rend B plus haut ;
  // puis A=2 : aucune longueur ne rend B plus haut (le bouton « لا يوجد طول »). متقدم (method-1, pas 0,1) : la zone étroite −4,5 < B <
  // −4,3 (une seule dixième), « plus bas que 1,2 » des DEUX côtés, puis −0,4 < B < −0,2.
  'zero-probe': {
    beginner: { numbers: { world: 'sea', step: '1', tasks: [
      { kind: 'beat', a: '-3', side: 'below', want: 'lower' },
      { kind: 'beat', a: '-3', side: 'below', want: 'higher' },
      { kind: 'beat', a: '4', side: 'above', want: 'lower' },
      { kind: 'beat', a: '2', side: 'below', want: 'higher' },
    ] }, ...P },
    advanced: { numbers: { world: 'sea', step: '0,1', tasks: [
      { kind: 'between', lo: '-4,5', hi: '-4,3', side: null },
      { kind: 'beat', a: '1,2', side: null, want: 'lower', both: true },
      { kind: 'between', lo: '-0,4', hi: '-0,2', side: null },
    ] }, ...T('method-1') },
  },
  // ── 3AM, unité 6 « التناسبية » (2026-10-21) ──
  // LES SIGNES ET L'ORDRE DES CARTES SOUS LA MAIN (robot-track, thème roboticsClub, 3AM unité 1, leçon 2) : un robot part de 1 ; chaque carte multiplie sa position.
  // مبتدئ (plateforme, le produit courant et les arcs visibles) : m1 placer −1 → −5, m2 une seule carte ramène à 5 (2 → −10, −5 → 25 refusées), m3 les cartes 2, 3, 4
  // au drapeau −24 (signes à la main : un ou trois négatifs), m4 le drapeau 24 avec au moins deux négatives. متقدم (know-5, ni produit ni arcs avant « شغّل ») : a1 prédire
  // le côté et la distance d'un programme fixe, a2 ordonner −5, 4, −0,5, 2 pour être à −2 après deux cartes (l'arrêt final reste 20), a3 la carte 3 puis (−1) répétée n fois
  // (prédire n = 15, puis −3 et 3). Le monde `square` (module 2) est posé par la leçon. Le test des niveaux mesure la paire par la PRÉDICTION écrite avant « شغّل ».
  'robot-track': {
    beginner: { numbers: { world: 'track', tasks: [
      { id: 'm1', flag: '-5', placed: ['5'], tray: ['-1'], need: 2, lock: true },
      { id: 'm2', flag: '5', placed: ['5', '-1'], tray: ['-1', '2', '-5'], need: 3, lock: true },
      { id: 'm3', flag: '-24', placed: ['2', '3', '4'], tray: [], need: 3, flip: true },
      { id: 'm4', flag: '24', placed: ['2', '3', '4'], tray: [], need: 3, flip: true, minNeg: 2 },
    ] }, ...P },
    advanced: { numbers: { world: 'track', tasks: [
      { id: 'a1', kind: 'predict', cards: ['-2', '3', '-1', '-4', '0,5'] },
      { id: 'a2', flag: '-2', placed: [], tray: ['-5', '4', '-0,5', '2'], need: 4, at: 2 },
      { id: 'a3', kind: 'repeat', card: '3', unit: '-1', goals: ['-3', '3'], predictN: 15 },
    ] }, ...T('know-5') },
  },
  // ── 3AM, unité 2 « العمليات على الكسور والأعداد الناطقة » (2026-10-25) ──
  // LA DIVISION PAR UN RAPPORT SOUS LA MAIN (gear-crank, thème bikestand) : la manivelle d'une درّاجة ; une tâche est `{ id, F, R, target, predict? }` (F dents au plateau,
  // R au pignon, target = tours de roue jusqu'au drapeau). مبتدئ (plateforme, compteurs ouverts) : m1 48/24 → 3 (3/2 tour de pédale), m2 24/32 → 6 (8 tours de pédale :
  // PLUS que 6), m3 24/32 → 1 (4/3). متقدم (method : le texte du manuel sur la division, prédiction écrite AVANT de partir, compteurs voilés) : a1 36/48 → 9/2, a2 40/24 → 5/2,
  // a3 30/42 → 10/3, puis a4 : 42/30 → 1 et, la chaîne déplacée, 30/42 → 1. Le monde `reverse` (module 2) est posé par la leçon (`tasks` r1, r2). Le test des niveaux mesure la paire par
  // le nombre de tâches et par la prédiction demandée.
  'gear-crank': {
    beginner: { numbers: { tasks: [
      { id: 'm1', F: 48, R: 24, target: '3' }, { id: 'm2', F: 24, R: 32, target: '6' }, { id: 'm3', F: 24, R: 32, target: '1' },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { id: 'a1', F: 36, R: 48, target: '9/2', predict: true }, { id: 'a2', F: 40, R: 24, target: '5/2', predict: true },
      { id: 'a3', F: 30, R: 42, target: '10/3', predict: true }, { id: 'a4a', F: 42, R: 30, target: '1', predict: true },
      { id: 'a4b', F: 30, R: 42, target: '1', predict: true },
    ] }, ...T('know-2') },
  },
  // LE NUMÉRATEUR SOUS LA MAIN (shade-match, thème paintshop, 2026-10-26) : la main verse c mesures de bleu dans un seau de d blancs pour égaler (ou comparer) la teinte
  // d'une référence a/b ; une tâche est `{ id, a, b, d, veil? }` (ou `{ kind: 'compare', a, b, c, d }`). مبتدئ (plateforme, mesureur visible) : s1 3/4 sur 8 → 6, s2 2/3 sur 9 → 6,
  // s3 3/4 sur 10 → AUCUN entier (7 plus clair, 8 plus foncé). متقدم (method : le manuel compare des fractions « par la méthode qui convient », mesureur VOILÉ jusqu'à l'engagement) :
  // a1 5/6 sur 18 → 15, a2 4/7 sur 12 → aucun (6 et 7), a3 9/12 sur 8 → 6, a4 compare 7/9 et 10/13. Le monde `equal` (معارف) est posé par la leçon. Le test des niveaux mesure la
  // paire par le NOMBRE DE TÂCHES et par le VOILE.
  'shade-match': {
    beginner: { numbers: { tasks: [
      { id: 's1', a: 3, b: 4, d: 8 }, { id: 's2', a: 2, b: 3, d: 9 }, { id: 's3', a: 3, b: 4, d: 10 },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { id: 'a1', a: 5, b: 6, d: 18, veil: true }, { id: 'a2', a: 4, b: 7, d: 12, veil: true },
      { id: 'a3', a: 9, b: 12, d: 8, veil: true }, { id: 'a4', kind: 'compare', a: 7, b: 9, c: 10, d: 13, veil: true },
    ] }, ...T('method-4') },
  },
  // L'ESPACEMENT SOUS LA MAIN (seed-rake, thème seedbed, 2026-10-26) : la main étire un râteau (espacement 1/N m) sur un حوض de 1 m peint de zones ; une tâche est
  // `{ id, kind?, terms: [{ p, sub? }], need?, needRefusal?, widest? }`. مبتدئ (plateforme, décomptes visibles) : g1 1/4 + 1/6 (deux espacements et un refus → 5/12), g2 2/3 + 1/5,
  // g3 3/4 puis 1/6 récolté. متقدم (method-6 : le manuel cherche un multiple commun, râteau BLOQUÉ, on écrit N et le total) : a1 5/6 + 3/8, a2 7/10 − 4/15, a3 1/2 + 1/3 + 1/4,
  // a4 3/8 + 5/12 « أوسع مسافة ». Le monde `fewest` (معارف) est posé par la leçon. Le test des niveaux mesure la paire par le NOMBRE DE TÂCHES et par la PRÉDICTION.
  'seed-rake': {
    beginner: { numbers: { tasks: [
      { id: 'g1', terms: [{ p: '1/4' }, { p: '1/6' }], need: 2, needRefusal: true },
      { id: 'g2', terms: [{ p: '2/3' }, { p: '1/5' }] },
      { id: 'g3', terms: [{ p: '3/4' }, { p: '1/6', sub: true }] },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { id: 'a1', kind: 'predict', terms: [{ p: '5/6' }, { p: '3/8' }] },
      { id: 'a2', kind: 'predict', terms: [{ p: '7/10' }, { p: '4/15', sub: true }] },
      { id: 'a3', kind: 'predict', terms: [{ p: '1/2' }, { p: '1/3' }, { p: '1/4' }] },
      { id: 'a4', kind: 'predict', terms: [{ p: '3/8' }, { p: '5/12' }], widest: true },
    ] }, ...T('method-6') },
  },
  // LE SIGNE PRÉDIT SOUS LA MAIN (merge-board, thème arcade, 3AM unité 2, leçon 5, 2026-10-26) : une chaîne de calcul est une rangée de tuiles ; la main PRÉDIT le signe de chaque fusion, RETOURNE le diviseur d'une division
  // et choisit l'ORDRE des fusions (aimants = priorité, bulles = parenthèses). Une tâche est `{ id, chain, hidden?, signOnly? }`. مبتدئ (plateforme, barres et aimants visibles) : c1 −5/4 + 11/6, c2 7/13 × (−8/5), c3 −9/8 ÷ (−3/4),
  // c4 7/3 − 8/15 ÷ 11/20 (l'aimant force la division d'abord). متقدم (method-9 : une chaîne à priorité ; barres CACHÉES jusqu'à la fusion, trois fautes les ramènent) : a1 (2/3 − 5/2) × (−6/11), a2 −3/4 + 5/6 × (−9/10),
  // a3 la fraction composée, a4 4/5 − 3/5 ÷ (−9/10) + (−2). Le monde `signs` (معارف) est posé par la leçon. Le test des niveaux mesure la paire par le NOMBRE DE TÂCHES et par les BARRES CACHÉES (متقدم seul).
  'merge-board': {
    beginner: { numbers: { tasks: [
      { id: 'c1', chain: '-5/4 + 11/6' },
      { id: 'c2', chain: '7/13 × -8/5' },
      { id: 'c3', chain: '-9/8 ÷ -3/4' },
      { id: 'c4', chain: '7/3 - 8/15 ÷ 11/20' },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { id: 'a1', chain: '(2/3 - 5/2) × -6/11', hidden: true },
      { id: 'a2', chain: '-3/4 + 5/6 × -9/10', hidden: true },
      { id: 'a3', chain: '(1/2 - 4/3)@(5/6 + -3/4)', hidden: true },
      { id: 'a4', chain: '4/5 - 3/5 ÷ -9/10 + -2', hidden: true },
    ] }, ...T('method-9') },
  },
  // L'AIGUILLE QUI LIT UNE DIFFÉRENCE (difference-meter, thème physicslab, 3AM unité 4, leçon 4, 2026-10-26) : une rail de verre graduée porte deux perles a et b ; un galvanomètre à deux sondes lit « rouge MOINS noir » ; la main
  // BRANCHE chaque sonde (quel nombre est soustrait), lit UNE aiguille et choisit la carte d'ordre. مبتدئ (plateforme, aiguille visible dès que les deux sondes sont branchées) : d1 5/4 et 3/4 (loin l'une de l'autre),
  // d2 −3/2 et −1/2 (l'aiguille va à GAUCHE ; « بدّل المجسّين » exigé une fois), d3 9/11 et 13/16 (0,85 px : les perles se chevauchent). متقدم (know-5 : « de la différence seule ») : un VOLET couvre l'aiguille tant que la
  // différence n'est pas ÉCRITE (d4 17/12 et 10/7, d5 −7/6 et −9/8) ; d6 le RIDEAU : seule la carte « a − b = −0,3 » est donnée. Le monde `race` (deux expressions, la main tient x) se pose seul dans la طريقة (`levels={false}`).
  // Le test des niveaux mesure la paire par le VOLET d'écriture et le RIDEAU (متقدم seul).
  'difference-meter': {
    beginner: { numbers: { world: 'rail', tasks: [
      { id: 'd1', a: '5/4', b: '3/4', range: [-2, 2] },
      { id: 'd2', a: '-3/2', b: '-1/2', range: [-2, 2], mustSwap: true },
      { id: 'd3', a: '9/11', b: '13/16', range: [-2, 2] },
    ] }, ...P },
    advanced: { numbers: { world: 'rail', tasks: [
      { id: 'd4', a: '17/12', b: '10/7', range: [-2, 2], write: true },
      { id: 'd5', a: '-7/6', b: '-9/8', range: [-2, 2], write: true },
      { id: 'd6', a: '2/5', b: '7/10', range: [-2, 2], curtain: { left: 'a', value: '-0,3' } },
    ] }, ...T('ex-27') },
  },
  // LA BAGUE QUI ZOOME PAR DIX (ten-zoom, thème science-lens, 3AM unité 3, leçon 1, 2026-10-26) : la main tient le nombre de crans n d'un cadre carré qui part de la table (1 m) ; chaque cran ×10 ou ÷10 ; la plaque lit le côté en
  // décimal. مبتدئ (plateforme, « tally » 1 × 10 × 10 sous la plaque) : z1 « 1 000 م » (3 crans) · z2 « 1 000 000 م » avec la PRÉDICTION « كم نقرة ؟ » 6 / 7 / 1 000 000 · z3 « 0,001 م » · z4 retour à « 1 م ». متقدم (act-2 :
  // 10⁻¹ … 10⁻⁴ par ÷10, sans tally ; la carte est un nom ou une autre unité) : z5 « مليار متر » · z6 « ميكرومتر » défini · z7 « 0,0000001 م » avec la prédiction 6 / 7 / 8 · z8 « 10 كم ». Le monde `prefixes` (cartes = unités)
  // se pose seul dans معارف (`levels={false}`). Le test des niveaux mesure l'absence de tally et les cartes en NOMS / UNITÉS (متقدم seul).
  'ten-zoom': {
    beginner: { numbers: { world: 'zoom', tally: true, discovery: 'count', tasks: [
      { id: 'z1', target: 3, card: { dec: 3 } },
      { id: 'z2', target: 6, card: { dec: 6 }, predict: { q: 'out', options: [6, 7, 1000000], correct: 0 } },
      { id: 'z3', target: -3, card: { dec: -3 } },
      { id: 'z4', target: 0, card: { dec: 0 }, startAt: 'prev' },
    ] }, ...P },
    advanced: { numbers: { world: 'zoom', tally: false, discovery: 'rank', tasks: [
      { id: 'z5', target: 9, card: { name: 9 } },
      { id: 'z6', target: -6, card: { unit: -6, def: true } },
      { id: 'z7', target: -7, card: { dec: -7 }, predict: { q: 'in', options: [6, 7, 8], correct: 1 } },
      { id: 'z8', target: 4, card: { km: 10 } },
    ] }, ...T('act-2') },
  },
  // LA POSITION D'UNE ÉCRITURE SOUS LA MAIN (number-line-pegs, thème clothesline, 3AM unité 2, leçon 4, 2026-10-26) : la main PORTE une carte d'écriture a/b et l'ACCROCHE sur un حبل gradué ; le vent la fait
  // glisser à son vrai piquet. Une tâche est `{ id, kind?: 'hang' | 'order', cards: ['6/-8', …], range?: [lo, hi] }`. مبتدئ (plateforme, pas 1/12, loupe ×3, « تحقّق » à volonté) : w1 6/(−8), (−3)/4, 3/4,
  // (−9)/(−12) → deux piles ; w2 −7/3, 7/(−3), −14/6, 14/6 (−28 douzièmes ×3, +28) ; w3 −1,5, 2, (−20)/(−8), −3. متقدم (method-10 : ordre par un même dénominateur ; pas 1/48, ni graduation entre les
  // entiers ni loupe, TOUTES les cartes puis UN verdict d'ordre) : a1 six cartes, a2 −9/4, −11/4, −10/4, a3 15/(−20), −6/8, −5/6. Le monde `writings` (معارف) est posé par la leçon. Le test des niveaux mesure la
  // paire par le NOMBRE DE TÂCHES et par le VERDICT D'ORDRE (متقدم seul).
  'number-line-pegs': {
    beginner: { numbers: { tasks: [
      { id: 'w1', cards: ['6/-8', '-3/4', '3/4', '-9/-12'], range: [-2, 2] },
      { id: 'w2', cards: ['-7/3', '7/-3', '-14/6', '14/6'], range: [-3, 3] },
      { id: 'w3', cards: ['-1,5', '2', '-20/-8', '-3'], range: [-4, 4] },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { id: 'a1', kind: 'order', cards: ['-7/4', '5/6', '-2/3', '-13/6', '3/2', '-1/12'], range: [-3, 3] },
      { id: 'a2', kind: 'order', cards: ['9/-4', '-11/4', '-10/4'], range: [-4, 0] },
      { id: 'a3', kind: 'order', cards: ['15/-20', '-6/8', '-5/6'], range: [-2, 1] },
    ] }, ...T('method-10') },
  },
  // LE POURCENTAGE SOUS LA MAIN (hundred-grid, thème pantry) : un stock coupé en 100 paquets égaux (10 × 10 cases) ; la main PEINT t cases, le panier
  // reçoit t paquets (x × t/100). مبتدئ (plateforme) : 15 % de 240 (la réponse écrite AVANT l'ouverture), le taux qui remplit un panier de 60 sur 150, +15 %
  // de 200 puis −20 % de 250. متقدم (platform + method-2) : 70 % de 75 et 25 % de 32 (taux cherchés), 84 est 60 % de ? (le stock entier), puis la chaîne
  // +20 % puis −20 % qui ne ramène pas à 200. Le test des niveaux mesure ces presets par leur nombre de tâches.
  'hundred-grid': {
    beginner: { numbers: { tasks: [
      { kind: 'of', x: '240', t: 15 }, { kind: 'rate', x: '150', part: '60' },
      { kind: 'change', x: '200', dir: 'up', t: 15 }, { kind: 'change', x: '250', dir: 'down', t: 20 },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { kind: 'rate', x: '75', part: '52.5' }, { kind: 'rate', x: '32', part: '8' }, { kind: 'whole', part: '84', t: 60 },
      { kind: 'change', x: '200', dir: 'up', t: 20 }, { kind: 'change', carry: true, dir: 'down', t: 20 },
    ] }, ...T('method-2') },
  },
  // LA PUNAISE SUR SA RAINURE ET LA RÈGLE SUR DEUX NŒUDS (pin-rails, thème stall) : مبتدئ (plateforme) : trois boutiques de punaises à 2, 6, 12 et 14 boîtes — 5 DA
  // la boîte (la main LÈVE les quatre punaises à leur prix, la règle par O les touche toutes), 2,5 DA + 10 DA de livraison (alignées, O dehors), 5 DA
  // les 8 premières puis 2 DA (brisées). متقدم (platform + method-1b) : des « photos » de points sans tableau — des sacs de 1,5 kg (la règle par O) et un
  // caisson vide de 4 kg + 0,5 kg par sac (alignées sans O) — puis trois LECTURES sur la droite : 1 sac, 7 sacs, la masse 15 kg. Le test des niveaux
  // mesure ces presets par leur nombre de tâches et par les lectures.
  'pin-rails': {
    beginner: { numbers: { tasks: [
      { mode: 'plot', shop: 'one', xs: [2, 6, 12, 14], rule: { a: '5' }, frame: { xMax: 16, yMax: 80, xStep: 2, yStep: 10, unit: 5 } },
      { mode: 'given', shop: 'two', xs: [2, 6, 12, 14], rule: { a: '2.5', b: '10' }, frame: { xMax: 16, yMax: 80, xStep: 2, yStep: 10, unit: 5 } },
      { mode: 'given', shop: 'three', xs: [2, 6, 12, 14], rule: { a: '5', k: 8, a2: '2' }, frame: { xMax: 16, yMax: 80, xStep: 2, yStep: 10, unit: 5 } },
    ] }, ...P },
    advanced: { numbers: { tasks: [
      { mode: 'given', shop: 'bags', xs: [2, 4, 6, 8], rule: { a: '1.5' }, frame: { xMax: 12, yMax: 18, xStep: 2, yStep: 2, unit: 0.5 } },
      { mode: 'given', shop: 'crate', xs: [2, 4, 6, 8], rule: { a: '0.5', b: '4' }, frame: { xMax: 12, yMax: 18, xStep: 2, yStep: 2, unit: 0.5 } },
      { mode: 'read', shop: 'unit', xs: [2, 4, 6, 8], rule: { a: '1.5' }, ask: { x: '1' }, frame: { xMax: 12, yMax: 18, xStep: 2, yStep: 2, unit: 0.5 } },
      { mode: 'read', shop: 'seven', xs: [2, 4, 6, 8], rule: { a: '1.5' }, ask: { x: '7' }, frame: { xMax: 12, yMax: 18, xStep: 2, yStep: 2, unit: 0.5 } },
      { mode: 'read', shop: 'mass', xs: [2, 4, 6, 8], rule: { a: '1.5' }, ask: { y: '15' }, frame: { xMax: 12, yMax: 18, xStep: 2, yStep: 2, unit: 0.5 } },
    ] }, ...T('method-1b') },
  },
  // ── 2AM, unité 5 « التناسبية » (2026-10-21) ──
  // LE NOMBRE QUI MANQUE SOUS LA MAIN (fourth-gauges, thème souk) : un tableau 2×2 de cartes de prix dont UNE case manque ; la main
  // tient ce nombre, trois balances d'égalité (« في الكيلو », « بين العمودين », « الجداءان ») ne s'équilibrent ENSEMBLE que pour un seul.
  // مبتدئ (plateforme, balances ouvertes) : 4 kg → 520 DA / 6 kg → ? (780) ; la QUANTITÉ à trouver (3 kg → 840 DA, ? kg → 1400 DA : 5) ; puis
  // 8 kg → 400 DA / 12 kg → ? où la balance « الفرق » ment (404 au lieu de 600). متقدم (method-1, balances VOILÉES, le nombre se calcule
  // AVANT de lâcher) : décimaux (2,5 kg), un trou en b, un trou en a (pas 0,1), puis le dernier avec des décimaux (4,5).
  'fourth-gauges': {
    beginner: { numbers: { world: 'market', tasks: [
      { hole: 'd', a: '4', b: '520', c: '6', rows: ['التفاح (kg)', 'الثمن (DA)'], step: '1', max: '1560' },
      { hole: 'c', a: '3', b: '840', d: '1400', rows: ['التمر (kg)', 'الثمن (DA)'], step: '1', max: '10' },
      { hole: 'd', a: '8', b: '400', c: '12', rows: ['البطاطا (kg)', 'الثمن (DA)'], step: '1', max: '1200', decoy: true },
    ] }, ...P },
    advanced: { numbers: { world: 'market', tasks: [
      { hole: 'd', a: '2,5', b: '325', c: '4', rows: ['الجزر (kg)', 'الثمن (DA)'], step: '1', max: '1000', covered: true },
      { hole: 'b', a: '6', c: '9', d: '2700', rows: ['الكتلة (kg)', 'الثمن (DA)'], step: '10', max: '5400', covered: true },
      { hole: 'a', b: '720', c: '7,5', d: '1800', rows: ['الكتلة (kg)', 'الثمن (DA)'], step: '0,1', max: '15', covered: true },
      { hole: 'd', a: '12', b: '3', c: '18', rows: ['مساحة الجدار (m²)', 'الدهان (L)'], step: '0,1', max: '10', covered: true },
    ] }, ...T('method-1') },
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
