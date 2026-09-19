import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

/**
 * OÙ SUIS-JE, ET COMBIEN RESTE-T-IL ?
 *
 * Une séance, c'est deux échelles emboîtées — les QUESTIONS d'un exercice, et
 * les EXERCICES d'un niveau — et l'élève doit lire les deux d'un coup d'œil,
 * à tout moment. L'ancienne version n'en montrait qu'une (« Exercice 2 / 3 »,
 * en français), et le numéro de question vivait ailleurs, plus bas dans la
 * page : il fallait donc assembler soi-même sa position, et rien ne disait ce
 * qu'il restait à faire.
 *
 * Ce composant répond aux quatre questions dans un seul bandeau :
 *
 *   التمرين 2 من 3        ●●○        ← où j'en suis dans le niveau
 *   السؤال 1 من 2         ▪▪         ← où j'en suis dans l'exercice
 *   بقي سؤال واحد… ثم تمرين واحد…    ← ce qu'il me reste
 *
 * Les pastilles sont décoratives (`aria-hidden`) : le texte porte déjà
 * l'information, et un lecteur d'écran n'a pas à compter des points. Le
 * bandeau est `aria-live="polite"` pour annoncer chaque changement de
 * position sans interrompre la lecture.
 *
 * Pas de minuteur : la pratique entraîne, elle ne chronomètre pas.
 */
export default function SessionProgress({
  index, total, correctCount, questionIndex = 0, questionTotal = 1,
}) {
  const { t } = useTranslation('student');

  // Ce qu'il RESTE, jamais négatif : l'élève est sur la question courante,
  // donc ce qui reste après elle est `total - index - 1`.
  const questionsLeft = Math.max(0, questionTotal - questionIndex - 1);
  const exercisesLeft = Math.max(0, total - index - 1);

  const questionsNote = questionsLeft === 0
    ? t('practice.progress.lastQuestion')
    : questionsLeft === 1
      ? t('practice.progress.remainingQuestionsOne')
      : t('practice.progress.remainingQuestions', { count: questionsLeft });

  const exercisesNote = exercisesLeft === 0
    ? t('practice.progress.lastExercise')
    : exercisesLeft === 1
      ? t('practice.progress.remainingExercisesOne')
      : t('practice.progress.remainingExercises', { count: exercisesLeft });

  return (
    <div
      data-session-progress
      data-exercise-index={index}
      data-question-index={questionIndex}
      className="space-y-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* ── Les EXERCICES du niveau ─────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-800" data-exercise-position>
            {t('practice.progress.exerciseOf', { current: index + 1, total })}
          </span>
          <span className="flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${i < index ? 'bg-emerald-500' : i === index ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-200'}`}
              />
            ))}
          </span>
        </div>

        {correctCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t('practice.progress.correctSoFar', { count: correctCount })}
          </span>
        )}
      </div>

      {/* ── Les QUESTIONS de l'exercice courant ───────────────────────── */}
      {questionTotal > 1 && (
        <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
          <span className="font-mono text-xs font-bold text-indigo-700" data-question-position>
            {t('practice.progress.questionOfShort', { current: questionIndex + 1, total: questionTotal })}
          </span>
          <span className="flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: questionTotal }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-5 rounded-full ${i < questionIndex ? 'bg-emerald-400' : i === questionIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
              />
            ))}
          </span>
        </div>
      )}

      {/* ── CE QU'IL RESTE, en une phrase ─────────────────────────────── */}
      <p className="text-xs text-slate-600" data-remaining>
        {questionTotal > 1 ? `${questionsNote} · ` : ''}{exercisesNote}
      </p>
    </div>
  );
}
