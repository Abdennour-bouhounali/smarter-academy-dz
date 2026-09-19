import { useTranslation } from 'react-i18next';
import { Feedback } from '../../lessons/common/components/LessonUI';
import RichText from './RichText';

/**
 * Ce qu'on dit à l'élève après sa réponse.
 *
 * Jamais « Faux ». Quand l'évaluateur a reconnu une erreur de raisonnement
 * précise, c'est SON explication qui s'affiche — pas le message générique.
 * Et une réponse à moitié juste est nommée comme telle : « ton coefficient
 * directeur est bon » n'est ni un succès ni un échec.
 */
const TONE = {
  correct: 'ok',
  equivalent_correct: 'ok',
  partially_correct: 'info',
  incorrect: 'ko',
  syntax_error: 'info',
  abandoned: 'info',
};

// Le VERDICT est la phrase la plus lue de tout l'espace d'exercices : elle
// s'affiche après CHAQUE réponse. Elle était en français sur une plateforme
// arabophone. Les clés vivent dans student.json (`practice.verdict.*`).
const TITLE_KEY = {
  correct: 'practice.verdict.correct',
  equivalent_correct: 'practice.verdict.equivalent_correct',
  partially_correct: 'practice.verdict.partially_correct',
  incorrect: 'practice.verdict.incorrect',
  syntax_error: 'practice.verdict.syntax_error',
  abandoned: 'practice.verdict.abandoned',
};

export default function FeedbackPanel({ evaluation, message }) {
  const { t } = useTranslation('student');
  if (!evaluation) return null;

  return (
    <Feedback tone={TONE[evaluation.outcome] ?? 'info'}>
      <span className="font-bold">{TITLE_KEY[evaluation.outcome] ? t(TITLE_KEY[evaluation.outcome]) : ''}</span>
      {message ? (
        <>
          {' — '}
          <RichText>{message}</RichText>
        </>
      ) : null}
    </Feedback>
  );
}
