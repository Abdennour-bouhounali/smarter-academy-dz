/**
 * Lesson kit — système de composants réutilisables pour générer des leçons.
 *
 * Extrait de la leçon de référence « Nombres entiers » (6e), validée. Voir
 * docs/architecture/LESSON_INTEGRATION_GUIDE.md pour les politiques que ces
 * composants appliquent par construction.
 *
 *  - ContentModule / useKit : shell d'un module de contenu formatif
 *    (progression, verrouillage, effets, auto-scroll, auto-avance).
 *  - TapQuestion / BatchChoiceQuestion / NumericQuestion : les trois formes
 *    de question formative — jamais bloquantes, correction toujours montrée.
 *  - BossFinal : moteur du test final évaluatif (silencieux → submit unique
 *    → correction → profil → synthèse, evidence + persistance).
 *  - PrerequisiteDiagnostic : moteur du module 0 « Mission de départ ».
 *
 * Les briques plus bas niveau restent dans components/LessonUI.jsx et les
 * manipulations spécifiques (blocs base 10, droites graduées, récipients…)
 * restent des composants de leçon — le kit orchestre, il ne remplace pas le
 * contenu pédagogique.
 */
export { default as ContentModule, useKit } from './ContentModule';
export { TapQuestion, BatchChoiceQuestion, NumericQuestion } from './questions';
export { default as BossFinal } from './BossFinal';
export { default as PrerequisiteDiagnostic } from './PrerequisiteDiagnostic';
// La PRÉSENTATION D'UN TEST (وضع القسم) : une question à la fois, السابق /
// التالي, « تحقّق من الإجابة » sur la question courante, « كشف النتائج », puis
// la revue une à une. Les deux moteurs ci-dessus la consomment — une leçon
// n'a RIEN à faire pour en hériter, et ne doit jamais écrire la sienne.
// Voir docs/architecture/CLASSROOM_MODE.md §5 « Test ».
export { default as TestPresentation, useTestPresentation } from './TestPresentation';
export {
  QUESTION_STATE, questionState, testQuestionStates, revealAll, revealOne,
  allRevealed, clampQuestion, resolveTestNavigation, revealedTally,
} from './testPresentation';
// Recueil d'une prédiction SANS verdict (§6ter.3). Fichier byte-identique
// dans les seize leçons antérieures, qui gardent leur copie ; les leçons
// construites à partir du 2026-09-06 l'importent d'ici.
export { default as PredictionChips } from './PredictionChips';
// Position d'enseignement du contrat « connaissances avant la demande »
// (docs/architecture/KNOWLEDGE_DEPENDENCY.md) : pose UNE connaissance de
// knowledge.jsx à l'instant où l'élève en a besoin, et la fait entrer dans la
// carte à ce moment-là.
export { default as KnowledgeBrick } from './KnowledgeBrick';
// « أتوقّع القاعدة » : l'élève écrit la règle avant de la lire (KnowledgeBrick l'applique
// d'office ; PredictRule enveloppe une règle qui n'est pas une brique).
export { default as PeerSheet } from './PeerSheet';
export { default as PredictRule, usePredictGate, PredictPanel, PredictionEcho } from './PredictRule';
