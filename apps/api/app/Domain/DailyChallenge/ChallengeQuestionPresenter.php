<?php

namespace App\Domain\DailyChallenge;

use App\Domain\Practice\ExerciseRepository;
use App\Models\DailyChallengeQuestion;

/**
 * La question d'un défi telle que le CLIENT la reçoit — servie par le
 * serveur, SANS clé de réponse.
 *
 * C'est la différence avec la pratique (D5 : la banque de pratique livre
 * encore ses réponses attendues dans le JSON du client) : un défi est une
 * compétition, donc rien de ce qui permettrait de répondre sans savoir ne
 * quitte le serveur avant la réponse — ni `expectedAnswer`, ni `isCorrect`
 * des choix, ni les signatures de misconception, ni les indices, ni le
 * retour. La correction (`reveal`) n'est servie qu'une fois la réponse
 * enregistrée.
 */
class ChallengeQuestionPresenter
{
    /** Les seules clés d'une question que le client voit avant de répondre. */
    private const PUBLIC_KEYS = ['id', 'statement', 'answerType', 'answerFormat', 'evaluationPolicy'];

    public function __construct(private ExerciseRepository $exercises) {}

    /** Le contenu complet (serveur seulement). */
    public function content(DailyChallengeQuestion $q, string $lessonCode): ?array
    {
        return $this->exercises->findQuestion($lessonCode, $q->exercise_code, $q->question_id);
    }

    /** @return array<string, mixed>|null ce que l'élève voit pour répondre */
    public function public(DailyChallengeQuestion $q, string $lessonCode): ?array
    {
        $exercise = $this->exercises->find($lessonCode, $q->exercise_code);
        $question = $this->content($q, $lessonCode);
        if ($exercise === null || $question === null) {
            return null;
        }

        $public = array_intersect_key($question, array_flip(self::PUBLIC_KEYS));
        // La requiredForm (« irréductible ») est une consigne visible, le reste de
        // la politique d'évaluation ne regarde que le serveur.
        if (isset($public['evaluationPolicy'])) {
            $public['evaluationPolicy'] = array_intersect_key($public['evaluationPolicy'], ['requiredForm' => true]);
        }
        if (isset($question['choices'])) {
            $public['choices'] = array_map(
                fn ($c) => ['id' => $c['id'], 'content' => $c['content']],
                $question['choices'],
            );
        }

        return [
            'statement' => [
                'content' => $exercise['statement']['content'] ?? '',
                'visual' => $exercise['statement']['visual'] ?? null,
            ],
            'question' => $public,
        ];
    }

    /**
     * La correction, après la réponse : la bonne réponse et UNE phrase
     * d'explication (le retour « correct » du contenu). Le défi n'est pas une
     * leçon : la remédiation détaillée se fait ensuite, en pratique.
     *
     * @return array{correctAnswer: mixed, correctChoiceIds: string[], explanation: ?string}
     */
    public function reveal(DailyChallengeQuestion $q, string $lessonCode): array
    {
        $question = $this->content($q, $lessonCode) ?? [];
        $correctChoiceIds = [];
        foreach ($question['choices'] ?? [] as $c) {
            if (! empty($c['isCorrect'])) {
                $correctChoiceIds[] = $c['id'];
            }
        }

        return [
            'correctAnswer' => $correctChoiceIds === [] ? ($question['expectedAnswer'] ?? null) : null,
            'correctChoiceIds' => $correctChoiceIds,
            'explanation' => $question['feedback']['correct'] ?? null,
        ];
    }
}
