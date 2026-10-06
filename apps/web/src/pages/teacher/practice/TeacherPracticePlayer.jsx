import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { BarChart3, Check, Clock, Eye, RotateCcw } from 'lucide-react';
import { practice } from '@smarter-academy/core';
import { ArrowBack, ArrowForward } from '../../../components/common/DirectionalIcons';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { exerciseIdsFor, loadExercise } from '../../../features/practice/practiceContent';
import ExerciseStatement from '../../../features/practice/ExerciseStatement';
import QuestionRenderer from '../../../features/practice/QuestionRenderer';
import HintPanel from '../../../features/practice/HintPanel';
import FeedbackPanel from '../../../features/practice/FeedbackPanel';
import SessionProgress from '../../../features/practice/SessionProgress';
import RichText from '../../../features/practice/RichText';
import ReportButton from '../../../features/reports/ReportButton';
import { outcomeTone } from '../../../features/practice/questionHistory';
import { checkLocally, expectedAnswerText, localHint, teacherBankPath } from '../../../features/practice/teacherBank';
import { ClassroomPresentation, ClassroomEntryButton, ClassroomFrame, ClassroomHidden } from '../../../lessons/common/classroom';
import StudentResponsesPanel from './StudentResponsesPanel';
import SideColumnToggle from '../../../features/practice/SideColumnToggle';
import { useSideColumn, practiceGridClass } from '../../../features/practice/useSideColumn';
import MISCONCEPTIONS from '../../../../../../content/practice/misconceptions.json';

const { feedbackFor } = practice;

// Les MÊMES boutons que le lecteur de l'élève (PracticeSession).
const PRIMARY_BUTTON = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none motion-reduce:transition-none';
const SECONDARY_BUTTON = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-700 transition-colors hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 motion-reduce:transition-none';

/**
 * L'exercice, côté ENSEIGNANT — la même page que le lecteur de l'élève
 * (PracticeSession : grille, colonne latérale, en-tête, carte de question,
 * mêmes boutons, même mode classe), SANS AUCUN SUIVI : vérification locale
 * (teacherBank.checkLocally), indices tirés du contenu, réponse attendue
 * dévoilable. La colonne latérale, qui porte chez l'élève son point
 * d'apprentissage, porte ici « إجابات تلاميذي » : qui, parmi SES élèves, a
 * fait cet exercice, et ce que chacun a répondu.
 */
export default function TeacherPracticePlayer() {
  const { t } = useTranslation('teacher');
  const { t: ts } = useTranslation('student');
  const { lessonCode, level, exerciseId } = useParams();
  // « إجابات تلاميذي » se replie : l'exercice prend toute la largeur.
  const [sideHidden, toggleSide] = useSideColumn();
  const [exercise, setExercise] = useState(undefined);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [hintCount, setHintCount] = useState(0);
  const [showExpected, setShowExpected] = useState(false);
  // L'issue de chaque question déjà vérifiée — pour les pastilles de SessionProgress.
  const [tones, setTones] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setExercise(undefined);
    setIndex(0);
    setTones([]);
    loadExercise(lessonCode, level, exerciseId)
      .then((data) => { if (!cancelled) setExercise(data); })
      .catch(() => { if (!cancelled) setExercise(null); });
    return () => { cancelled = true; };
  }, [lessonCode, level, exerciseId]);

  // Une nouvelle question repart d'une page blanche.
  useEffect(() => {
    setAnswer(null);
    setEvaluation(null);
    setHintCount(0);
    setShowExpected(false);
  }, [index, exerciseId]);

  const exerciseTitle = exercise?.metadata?.title ?? exerciseId;
  useDocumentMeta(exercise?.metadata?.title ?? t('practice.metaTitle'));

  const ids = exerciseIdsFor(lessonCode, level);
  const position = Math.max(0, ids.indexOf(exerciseId));
  const nextId = ids[position + 1] ?? null;
  const questions = exercise?.questions ?? [];
  const question = questions[index] ?? null;
  const hints = useMemo(
    () => Array.from({ length: hintCount }, (_, i) => localHint(question, i)).filter(Boolean),
    [question, hintCount],
  );
  const hintsTotal = question?.hints?.length ?? 0;
  const hubPath = teacherBankPath(lessonCode);

  if (exercise === undefined) {
    return <div className="sa-surface-plain sa-page sa-page--flush py-6 sm:py-8"><div className="h-64 animate-pulse rounded-2xl bg-slate-100" /></div>;
  }
  if (exercise === null || !question) {
    return (
      <div className="sa-surface-plain sa-page sa-page--flush space-y-4 py-6 sm:py-8">
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">{t('practice.notFound')}</p>
        <Link to={hubPath} className="text-sm font-bold text-indigo-700 hover:underline">{ts('practice.backToLevels')}</Link>
      </div>
    );
  }

  const answered = evaluation !== null;
  const expected = expectedAnswerText(question);
  const isLast = index >= questions.length - 1;
  const levelName = ts(`practice.levelNames.${level}`, { defaultValue: '' });
  const minutes = exercise.metadata?.estimatedMinutes;
  const tags = exercise.metadata?.tags ?? [];
  const nextClass = answered ? `${PRIMARY_BUTTON} min-w-[10rem]` : SECONDARY_BUTTON;

  const check = () => {
    if (answered || answer == null) return;
    const verdict = checkLocally(answer, question);
    setEvaluation(verdict);
    setTones((list) => { const next = [...list]; next[index] = outcomeTone(verdict.outcome); return next; });
  };

  return (
    <div className="sa-surface-plain sa-page sa-page--flush py-6 sm:py-8">
      <MotionConfig reducedMotion="user">
      <ClassroomPresentation scope="exercise" title={exerciseTitle} entry="none" className="w-full space-y-3">
      <ClassroomHidden><nav className="flex flex-wrap items-center justify-between gap-3" aria-label={ts('nav.breadcrumb', { ns: 'lesson' })}>
        <Link
          to={hubPath}
          className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg px-1 text-sm font-bold text-slate-700 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <ArrowBack className="h-4 w-4" aria-hidden="true" /> {ts('practice.backToLevels')}
        </Link>
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200" data-no-tracking>{t('practice.noTracking')}</span>
          <SideColumnToggle hidden={sideHidden} onToggle={toggleSide} label={t('practice.responses.short')} />
          <ClassroomEntryButton scope="exercise" title={exerciseTitle} tone="quiet" />
        </span>
      </nav></ClassroomHidden>

      <div className={practiceGridClass(sideHidden)}>
        <ClassroomHidden><aside className={`space-y-3 xl:sticky xl:top-4 ${sideHidden ? 'xl:hidden' : ''}`} data-practice-side>
          <StudentResponsesPanel lessonCode={lessonCode} exerciseId={exerciseId} questions={questions} />
        </aside></ClassroomHidden>

        <div className="min-w-0 space-y-3">
          <ClassroomHidden><header className="space-y-1" data-exercise-header>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-slate-600" data-exercise-level>
              <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                {ts('practice.levelLabel', { level })}{levelName ? ` · ${levelName}` : ''}
              </span>
              {minutes ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {ts('practice.meta.minutes', { count: minutes })}
                </span>
              ) : null}
              {tags.length > 0 && <span>{tags.join(' ، ')}</span>}
            </p>
            <h1 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">{exerciseTitle}</h1>
          </header></ClassroomHidden>

          <ClassroomFrame maxWidth={1080}>
          <div className="space-y-3" data-exercise-workspace>
            {(exercise.statement?.content || exercise.statement?.visual || exercise.statement?.figure || exercise.statement?.support) && (
              <section className="rounded-xl bg-white/70 px-3.5 py-3 ring-1 ring-slate-200 sm:px-4">
                <p className="mb-1 text-xs font-bold text-slate-600">{ts('practice.statementLabel')}</p>
                <ExerciseStatement
                  content={exercise.statement?.content}
                  visual={exercise.statement?.visual}
                  figure={exercise.statement?.figure}
                  support={exercise.statement?.support}
                />
              </section>
            )}

            <section
              key={`${exerciseId}:${question.id}`}
              aria-labelledby="teacher-question-heading"
              data-current-question={index + 1}
              className="relative overflow-hidden rounded-2xl border-s-4 border-indigo-600 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_28px_-16px_rgba(15,23,42,0.22)] ring-1 ring-slate-200"
            >
              <header className="border-b border-indigo-100 bg-indigo-50/50 px-4 py-2.5 sm:px-5">
                <SessionProgress
                  index={position}
                  total={ids.length}
                  questionIndex={index}
                  questionTotal={questions.length}
                  questionTones={tones}
                  currentTone={answered ? outcomeTone(evaluation.outcome) : null}
                  headingId="teacher-question-heading"
                />
              </header>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="space-y-3">
                  <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl" data-question-statement>
                    <RichText>{question.statement}</RichText>
                  </p>
                  {question.visual && <ExerciseStatement visual={question.visual} support={question.support} />}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); check(); }} className="space-y-3" data-answer-form>
                  <div className="flex flex-col gap-1.5">
                    <span className="shrink-0 text-sm font-bold text-slate-700" aria-hidden="true">{ts('practice.yourAnswerLabel')}</span>
                    <QuestionRenderer question={question} value={answer} onChange={setAnswer} disabled={answered} />
                  </div>
                  {!answered && (
                    <button type="submit" disabled={answer == null} className={`${PRIMARY_BUTTON} w-full sm:w-auto sm:min-w-[14rem]`} data-validate>
                      <Check className="h-5 w-5" aria-hidden="true" /> {ts('practice.checkMyAnswer')}
                    </button>
                  )}
                </form>

                {answered && <FeedbackPanel evaluation={evaluation} message={feedbackFor(question, evaluation, MISCONCEPTIONS)} />}
                {answered && !evaluation.isCorrect && (
                  <button type="button" onClick={() => { setEvaluation(null); setAnswer(null); }} className={SECONDARY_BUTTON} data-retry>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> {ts('practice.retry')}
                  </button>
                )}

                <HintPanel
                  key={`hints-${exerciseId}:${question.id}`}
                  hints={hints}
                  remaining={hintsTotal - hintCount}
                  hintTypes={question.hints?.map((h) => h.type) ?? []}
                  onRequest={() => setHintCount((n) => Math.min(n + 1, hintsTotal))}
                  busy={false}
                  disabled={false}
                />

                {expected && (
                  <ClassroomHidden><div className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200">
                    {showExpected ? (
                      <p className="text-sm text-slate-800" data-expected-answer>
                        <span className="font-bold">{t('practice.expectedAnswer')}</span>{' '}<RichText>{expected}</RichText>
                      </p>
                    ) : (
                      <button type="button" onClick={() => setShowExpected(true)} className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-bold text-indigo-700 hover:underline" data-show-expected>
                        <Eye className="h-4 w-4" aria-hidden="true" /> {t('practice.showExpected')}
                      </button>
                    )}
                  </div></ClassroomHidden>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <ClassroomHidden>
                    <ReportButton
                      key={`report-${question.id}`}
                      source="question"
                      variant="link"
                      context={{ lessonCode, exerciseCode: exerciseId, questionId: question.id }}
                    />
                  </ClassroomHidden>
                  {!isLast ? (
                    <button type="button" onClick={() => setIndex((i) => i + 1)} className={nextClass} data-next-question>
                      {ts('practice.nextQuestion')} <ArrowForward className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : nextId ? (
                    <Link to={teacherBankPath(lessonCode, level, nextId)} className={nextClass} data-next-exercise>
                      {ts('practice.nextExercise')} <ArrowForward className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <Link to={hubPath} className={nextClass}>{ts('practice.backToLevels')}</Link>
                  )}
                </div>
              </div>
            </section>
          </div>
          </ClassroomFrame>
        </div>
      </div>
      </ClassroomPresentation>
      </MotionConfig>
    </div>
  );
}
