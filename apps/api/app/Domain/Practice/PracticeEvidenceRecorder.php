<?php

namespace App\Domain\Practice;

use App\Domain\Practice\Support\AnswerEvaluator;
use App\Domain\Progress\Engine\EvidenceEvent;
use App\Domain\Progress\Outcome;
use App\Domain\Progress\ProgressEngine;
use App\Models\PracticeSession;
use App\Models\QuestionAttempt;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Le seul endroit où la pratique touche à la maîtrise.
 *
 * Il n'écrit jamais student_learning_point_progress lui-même : il appelle
 * ProgressEngine, comme le test final. C'est ce qui fait converger les deux
 * sources sur une seule évaluation — non par discipline, mais parce qu'il n'y
 * a pas d'autre porte.
 *
 * Frontière de confiance (Mastery V2, phase 4) : l'issue est calculée par le
 * SERVEUR (AnswerEvaluator, port exact de packages/core/practice) à partir de
 * la réponse brute et du contenu. Ce que le client déclare n'est qu'une
 * prévision pour son affichage ; un désaccord est journalisé et la vérité
 * est celle du serveur. Le repli `mastery.server_evaluation=false` reprend
 * l'issue du client en le disant (`evaluated_by = client`).
 *
 * Deux enregistrements, deux concepts : question_attempts est le journal de
 * la SÉANCE ; learning_evidence est la preuve IMMUABLE de maîtrise. Ils
 * partagent attempt_uuid pour que l'idempotence soit la même des deux côtés.
 */
class PracticeEvidenceRecorder
{
    public function __construct(
        private ProgressEngine $progress,
        private ExerciseRepository $exercises,
        private AnswerEvaluator $evaluator,
    ) {}

    /**
     * @param  array{outcome?: ?string, answer?: array|null, normalizedAnswer?: ?string, misconceptionId?: ?string}  $payload
     * @return array{attempt: QuestionAttempt, duplicate: bool, recorded: bool, evaluation: array<string, mixed>}
     */
    public function record(
        User $user,
        PracticeSession $session,
        QuestionAttempt $attempt,
        string $exerciseId,
        array $payload,
    ): array {
        if ($attempt->user_id !== $user->id) {
            throw new DomainException('Tentative invalide.');
        }

        $lessonCode = $session->lesson->code;
        $question = $this->exercises->findQuestion($lessonCode, $exerciseId, $attempt->question_id);
        if ($question === null) {
            throw new DomainException('Question inconnue.');
        }

        // La tentative a déjà sa réponse. Deux cas, et ils ne se confondent pas :
        //
        //  - le MÊME envoi rejoué (connexion coupée, double appui) : idempotent,
        //    on renvoie le verdict enregistré ;
        //  - « أعِد المحاولة » : une AUTRE réponse sur la même tentative. Elle
        //    est JUGÉE — l'élève doit lire le verdict de ce qu'il vient de
        //    répondre — mais rien n'est enregistré : la preuve de maîtrise ne
        //    retient que la première issue (EXERCISE_CONTRACT.md § 0).
        //
        // Renvoyer le verdict enregistré pour une réponse différente faisait
        // refuser la bonne réponse après une première erreur : aucun choix
        // n'était plus jamais accepté (constaté le 2026-09-24 sur
        // qasim-adad-tabii l3-001 q2).
        if ($attempt->submitted_at !== null) {
            $sameAnswer = ($payload['answer'] ?? null) == $attempt->submitted_answer;
            $evaluation = $sameAnswer || ! array_key_exists('answer', $payload)
                ? [
                    'outcome' => $attempt->outcome,
                    'misconceptionId' => $attempt->misconception_id,
                    'normalized' => $attempt->normalized_answer,
                    'isCorrect' => in_array($attempt->outcome, Outcome::successValues(), true),
                    'feedbackKey' => null,
                ]
                : $this->evaluator->evaluate($payload['answer'], $question);

            return ['attempt' => $attempt, 'duplicate' => true, 'recorded' => false, 'evaluation' => $evaluation];
        }

        // Les learning points viennent du CONTENU (et du registre, dans
        // ProgressEngine), jamais du corps de la requête : un client ne
        // choisit pas quelles compétences il crédite.
        $refs = array_values(array_map(
            fn ($lp) => ['code' => $lp['code'], 'role' => $lp['role'] ?? 'primary'],
            $question['learningPoints'] ?? [],
        ));
        if ($refs === []) {
            throw new DomainException('Cette question ne déclare aucun point d\'apprentissage.');
        }

        [$evaluation, $evaluatedBy, $clientOutcome] = $this->evaluate($payload, $question, $attempt);
        $outcome = Outcome::fromString($evaluation['outcome']);

        DB::transaction(function () use ($attempt, $payload, $outcome, $evaluation, $evaluatedBy, $clientOutcome, $user, $lessonCode, $refs, $session, $exerciseId, $question) {
            $attempt->update([
                'submitted_answer' => $payload['answer'] ?? null,
                'normalized_answer' => $evaluation['normalized'] !== '' ? $evaluation['normalized'] : ($payload['normalizedAnswer'] ?? null),
                'outcome' => $outcome->value,
                'evaluated_by' => $evaluatedBy,
                'client_outcome' => $clientOutcome !== null && $clientOutcome !== $outcome->value ? $clientOutcome : null,
                'misconception_id' => $evaluation['misconceptionId'] ?? ($payload['misconceptionId'] ?? null),
                'submitted_at' => now(),
            ]);

            $this->progress->recordEvidence($user, $lessonCode, [
                'questionCode' => "{$exerciseId}:{$attempt->question_id}",
                'exerciseCode' => $exerciseId,
                'questionId' => $attempt->question_id,
                // La même clé d'idempotence des deux côtés : une preuve et sa
                // tentative ne peuvent pas diverger sur un rejeu.
                'attemptId' => $attempt->attempt_uuid,
                'outcome' => $outcome->value,
                'learningPointRefs' => $refs,
                'assessmentType' => ProgressEngine::SOURCE_PRACTICE,
                'level' => $session->level,
                'difficulty' => isset($question['difficulty']) ? (int) $question['difficulty'] : (int) $session->level,
                'templateKey' => $question['templateId'] ?? null,
                'hintsUsed' => $attempt->hints_used,
                'evaluatedBy' => $evaluatedBy,
                'misconceptionId' => $evaluation['misconceptionId'] ?? ($payload['misconceptionId'] ?? null),
                'sourceId' => $session->session_id,
                'answer' => $payload['answer'] ?? null,
            ]);

            $session->increment('questions_answered');
            if ($outcome->isSuccess()) {
                $session->increment('correct_count');
            }
        });

        return ['attempt' => $attempt->fresh(), 'duplicate' => false, 'recorded' => true, 'evaluation' => $evaluation];
    }

    /**
     * L'issue : celle du serveur quand il peut juger, sinon celle du client,
     * dite comme telle. En mode serveur, la déclaration du client est
     * comparée et un désaccord journalisé (période d'observation, §31.4).
     *
     * @return array{0: array<string, mixed>, 1: string, 2: ?string} [évaluation, evaluated_by, issue déclarée par le client]
     */
    private function evaluate(array $payload, array $question, QuestionAttempt $attempt): array
    {
        $clientOutcome = isset($payload['outcome']) && $payload['outcome'] !== '' ? (string) $payload['outcome'] : null;
        if ($clientOutcome !== null && Outcome::tryFrom($clientOutcome) === null) {
            throw new DomainException('Issue de réponse inconnue.');
        }

        $serverMode = (bool) config('mastery.server_evaluation', true);
        $answer = array_key_exists('answer', $payload) ? $payload['answer'] : null;

        if ($serverMode) {
            $evaluation = $this->evaluator->evaluate($answer, $question);
            if ($clientOutcome !== null && $clientOutcome !== $evaluation['outcome']) {
                Log::channel(config('mastery.log_channel', 'mastery'))->warning('evidence.disagreement', [
                    'attempt_uuid' => $attempt->attempt_uuid,
                    'question_id' => $attempt->question_id,
                    'client' => $clientOutcome,
                    'server' => $evaluation['outcome'],
                ]);
            }

            return [$evaluation, EvidenceEvent::EVALUATED_BY_SERVER, $clientOutcome];
        }

        if ($clientOutcome === null) {
            throw new DomainException('Issue de réponse requise.');
        }

        return [[
            'outcome' => $clientOutcome,
            'misconceptionId' => $payload['misconceptionId'] ?? null,
            'normalized' => (string) ($payload['normalizedAnswer'] ?? ''),
            'isCorrect' => in_array($clientOutcome, Outcome::successValues(), true),
            'feedbackKey' => null,
        ], EvidenceEvent::EVALUATED_BY_CLIENT, $clientOutcome];
    }
}
