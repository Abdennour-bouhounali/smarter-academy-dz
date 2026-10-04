// @smarter-academy/core — platform-agnostic logic shared by every client
// (today: the web app; eventually: a React Native app too). Zero React,
// zero DOM, zero bundler-specific APIs (no `import.meta`, no `localStorage`).
// See README.md in this package for the boundary this enforces.

// `mathComparison.js` n'est VOLONTAIREMENT pas réexporté ici.
//
// Il tire @cortex-js/compute-engine (~2,6 Mo). Ce baril est importé par 299
// fichiers, dont les pages d'accueil, de cours et de tarifs : le réexporter
// plaçait le moteur symbolique dans le lot d'entrée, et donc dans le premier
// rendu de CHAQUE visiteur, y compris anonyme.
//
// Les deux seuls consommateurs réels l'importent par son chemin :
//   import { compareMathExpressions } from '@smarter-academy/core/mathComparison.js';
// ce qui laisse le moteur dans le lot de la page qui s'en sert.
export * from './numberFormat.js';
export * from './geometry.js';
export * from './algebra.js';
export * from './random.js';
export * from './lessonAccess.js';
export * from './errorClassifiers.js';
export * from './auth.js';
export * from './validation/validateChoiceAnswer.js';
// `validateNumericAnswer` n'est pas réexportée ici pour la même raison :
// elle importe `mathComparison.js`, et donc le moteur symbolique. Aucune page
// de l'application ne l'utilise aujourd'hui ; celles qui le feront
// l'importeront par son chemin, ce qui gardera le moteur hors du lot
// d'entrée :
//   import { validateNumericAnswer } from '@smarter-academy/core/validation/validateNumericAnswer.js';
export * from './validation/validateScientificNotation.js';
export * from './progress/calculateCompletionPercentage.js';
export * from './progress/getNextIncompleteModule.js';
export * from './progress/isValidModuleNumber.js';
export * from './progress/getNextLesson.js';
export * from './exercise/adaptiveExerciseState.js';
export * from './api/errors.js';
export * from './curriculum/coursesData.js';
export * from './curriculum/lessonStages.js';
export * from './curriculum/moduleRecommendations.js';
export * from './curriculum/activeGrades.js';
export * from './curriculum/manipulationTypes.js';
export * from './curriculum/manipulationLevels.js';
export * from './curriculum/textbookPages.js';
// Divisibilité, PGCD, réduction de fractions — le noyau de l'unité 1 de 4AM,
// partagé par les leçons, les manipulations et les tests de contenu.
export * as divisibility from './arithmetic/divisibility.js';
// Partage équitable — le modèle des situations « n objets en groupes égaux »,
// commun au rangement des livres du manuel et aux scènes de la plateforme.
export * as equalGrouping from './arithmetic/equalGrouping.js';
// Racines carrées exactes — le noyau de l'unité 2 « الحساب على الجذور » :
// carrés comparés en entiers, écritures décimales exactes, n = a² × b.
export * as squareRoots from './arithmetic/squareRoots.js';
export * as polynomials from './arithmetic/polynomials.js';
// Le premier degré exact de l'unité 4 « معادلات ومتراجحات » : équations, inéquations (sens
// inversé par un négatif), produits nuls — une seule source pour les quatre labs.
export * as linear from './arithmetic/linear.js';
// Les jumal de l'unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين » : deux équations en (x ; y),
// vérifier une ثنائية, les trois cas, isoler / substituer / combiner — exact, sur les fractions de linear.js.
export * as linearSystem from './arithmetic/linearSystem.js';
// La proportionnalité exacte de l'unité 6 « الدالة الخطية والتناسبية » : tableaux, quatrième proportionnel,
// coefficient depuis (m ; f(m)), droite par O, pourcentages et changements successifs, règles « machines ».
export * as proportional from './arithmetic/proportional.js';
// La fonction affine exacte de l'unité 7 « الدالة التآلفية » : image et antécédent, linéaire / constante, droite
// (b = الترتيب عند المبدأ), تناسب التغيّرات et deux points, ax + by = c écrite y = ax + b, deux droites, deux tarifs.
export * as affine from './arithmetic/affine.js';
// La statistique exacte de l'unité 8 « الإحصاء » : effectifs, التكرار / التواتر المجمع الصاعد والنازل, المدى,
// المتوسط (pondéré, مراكز الفئات), الوسيط (rangs) et الفئة الوسيطية, المنوال, groupes réunis et valeurs cachées.
export * as statistics from './arithmetic/statistics.js';
// Thalès exact de l'unité 9 « خاصية طالس » : rapports égaux, quatrième proportionnel, k (تكبير / تصغير), la
// réciproque sur abscisses SIGNÉES (rapports ET ordre), partage d'un segment, longueur construite, ombre, cylindre dans un cône.
export * as thales from './arithmetic/thales.js';
// La trigonométrie du triangle rectangle de l'unité 10 « حساب المثلثات في المثلث القائم » : côtés relatifs à un
// angle aigu, cos / sin / tan exacts (surds q·√r), relations, choix du rapport, calculatrice et arrondis.
export * as trigonometry from './arithmetic/trigonometry.js';

// Moteur d'exercices (pratique) — arithmétique exacte et évaluation des
// réponses. Exporté sous un espace de noms : `Rational.parse` et
// `parseDec` (numberFormat) ne font PAS la même chose, et la confusion
// coûterait cher. Voir packages/core/practice/rational.js.
export * as practice from './practice/index.js';
