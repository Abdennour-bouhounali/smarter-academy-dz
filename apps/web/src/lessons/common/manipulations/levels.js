import { MANIPULATION_LEVEL_IDS, resolveLevelId } from '@smarter-academy/core';

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
