import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBack } from '../../../components/common/DirectionalIcons';

import { practice } from '@smarter-academy/core';
import { AuthContext } from '../../../context/AuthContext';
import {
  fetchPracticeSession, openQuestion, requestHint, submitAnswer,
  completeExercise, completeSession, createNote, updateNote,
} from '../../../services/practiceService';
import { exerciseIdsFor, loadExercise } from '../../../features/practice/practiceContent';
import ExerciseStatement from '../../../features/practice/ExerciseStatement';
import QuestionRenderer from '../../../features/practice/QuestionRenderer';
import HintPanel from '../../../features/practice/HintPanel';
import FeedbackPanel from '../../../features/practice/FeedbackPanel';
import SessionProgress from '../../../features/practice/SessionProgress';
import NotebookButton from '../../../features/practice/NotebookButton';
import ReportButton from '../../../features/reports/ReportButton';
import RichText from '../../../features/practice/RichText';
import { ValidateButton } from '../../../lessons/common/components/LessonUI';
import { ClassroomPresentation, ClassroomEntryButton, ClassroomFrame, ClassroomHidden } from '../../../lessons/common/classroom';
import MISCONCEPTIONS from '../../../../../../content/practice/misconceptions.json';

const { evaluateAnswer, feedbackFor } = practice;

/**
 * Le lecteur d'exercices.
 *
 * La justesse est calculée ici, par @smarter-academy/core — même frontière de
 * confiance que le test final. Le serveur, lui, enregistre la tentative, lit
 * dans le CONTENU quels points d'apprentissage la question mesure, et fait
 * l'arithmétique de la maîtrise.
 *
 * Une réponse fausse ne bloque jamais : « Continuer » est toujours là. On
 * peut réessayer, mais on n'y est jamais obligé — c'est l'invariant de
 * progression non bloquante que tout le dépôt applique.
 */
export default function PracticeSession() {
  const { t } = useTranslation('student');
  const { lessonCode, sessionId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [index, setIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [attemptUuid, setAttemptUuid] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [hints, setHints] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(0);
  const [busy, setBusy] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState(null);

  // Le niveau vient du serveur à la première réponse ; en attendant, l'ordre
  // des exercices se lit dans l'index du contenu.
  const exerciseIds = useMemo(
    () => (session ? exerciseIdsFor(lessonCode, session.level) : []),
    [lessonCode, session],
  );

  // Ouvre la séance (idempotent) puis charge le premier exercice.
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    fetchPracticeSession(token, sessionId)
      .then((data) => {
        if (cancelled) return;
        // Une séance déjà close se relit : on renvoie vers son bilan plutôt
        // que de faire rejouer des exercices déjà comptés.
        if (data.session.status === 'completed') {
          navigate(`/espace/pratique/${lessonCode}/bilan/${sessionId}`, { replace: true });

          return;
        }
        setSession(data.session);
      })
      .catch((e) => !cancelled && setError(e.message));

    return () => { cancelled = true; };
  }, [token, lessonCode, sessionId, navigate]);

  // Charge l'exercice courant dès que la séance et l'index sont connus.
  useEffect(() => {
    if (!session || exerciseIds.length === 0) return undefined;
    let cancelled = false;
    const id = exerciseIds[index];
    if (!id) return undefined;

    loadExercise(lessonCode, session.level, id).then((data) => {
      if (cancelled) return;
      setExercise(data);
      setQuestionIndex(0);
      setAnswer(null);
      setEvaluation(null);
      setHints([]);
    });

    return () => { cancelled = true; };
  }, [session, exerciseIds, index, lessonCode]);

  const question = exercise?.questions?.[questionIndex] ?? null;

  // Le titre de l'exercice, AUGMENTÉ du numéro de question :
  //   « تمرين 2 — القسمة على 6 »  →  « تمرين 2 — السؤال 1 : القسمة على 6 »
  //   « 420 كتابًا في رفوف »      →  « 420 كتابًا في رفوف — السؤال 1 »
  // Les titres du manuel ont la forme « تمرين n — <sujet> » : on glisse donc
  // le numéro après le tiret, devant le sujet. Sans tiret, il s'ajoute à la
  // fin — les deux lectures restent naturelles en arabe.
  const exerciseHeading = (() => {
    // Le numéro s'affiche MÊME pour un exercice à une seule question : c'est
    // un repère de position, pas un compteur — l'élève doit lire la même
    // forme partout, sans avoir à se demander pourquoi elle disparaît ici.
    const title = exercise?.metadata?.title ?? '';
    if (!title) return title;
    const label = t('practice.questionNumber', { n: questionIndex + 1 });
    const dash = title.indexOf('—');
    if (dash === -1) return `${title} — ${label}`;
    return `${title.slice(0, dash + 1)} ${label} : ${title.slice(dash + 1).trim()}`;
  })();

  // Ouvre la question côté serveur : c'est cette tentative qui portera les
  // indices, demandés avant la réponse.
  useEffect(() => {
    if (!token || !session || !exercise || !question) return undefined;
    let cancelled = false;
    const uuid = crypto.randomUUID();

    openQuestion(token, sessionId, exercise.id, question.id, uuid)
      .then((data) => {
        if (cancelled) return;
        setAttemptUuid(uuid);
        setHints([]);
        setHintsRemaining(question.hints?.length ?? 0);
        setEvaluation(data.attempt?.answered ? { outcome: 'correct' } : null);
      })
      .catch((e) => !cancelled && setError(e.message));

    return () => { cancelled = true; };
  }, [token, session, sessionId, exercise, question]);

  const askHint = useCallback(async () => {
    if (!attemptUuid) return;
    setBusy(true);
    try {
      const { hint } = await requestHint(token, attemptUuid);
      setHints((h) => [...h, hint]);
      setHintsRemaining(hint.remaining);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, [token, attemptUuid]);

  const validate = useCallback(async () => {
    if (!question || !attemptUuid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = evaluateAnswer(answer, question);
      setEvaluation(result);
      if (result.isCorrect) setCorrectCount((n) => n + 1);

      await submitAnswer(token, sessionId, {
        attemptUuid,
        outcome: result.outcome,
        answer: answer ?? null,
        normalizedAnswer: result.normalized || null,
        misconceptionId: result.misconceptionId,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, [question, attemptUuid, answer, token, sessionId, busy]);

  const next = useCallback(async () => {
    const lastQuestion = questionIndex >= (exercise?.questions?.length ?? 1) - 1;

    if (!lastQuestion) {
      setQuestionIndex((i) => i + 1);
      setAnswer(null);
      setEvaluation(null);
      setHints([]);

      return;
    }

    setBusy(true);
    try {
      await completeExercise(token, sessionId, exercise.id);
      if (index >= exerciseIds.length - 1) {
        await completeSession(token, sessionId);
        navigate(`/espace/pratique/${lessonCode}/bilan/${sessionId}`);
      } else {
        setIndex((i) => i + 1);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, [questionIndex, exercise, token, sessionId, index, exerciseIds.length, navigate, lessonCode]);

  const saveNote = useCallback(
    (note) => createNote(token, {
      ...note,
      lessonCode,
      exerciseId: exercise?.id,
      questionId: question?.id,
      learningPointCode: question?.learningPoints?.find((lp) => lp.role === 'primary')?.code,
    }),
    [token, lessonCode, exercise, question],
  );
  const patchNote = useCallback((id, patch) => updateNote(token, id, patch), [token]);

  // Ce que le cahier sait de la question au moment où il s'ouvre : l'énoncé,
  // la question, et — seulement si l'élève a validé — sa réponse et le
  // verdict. Le cahier n'invente pas d'erreur : sans validation, pas de bloc
  // « خطئي ».
  const feedbackMessage = evaluation && question ? feedbackFor(question, evaluation, MISCONCEPTIONS) : '';
  const notebookContext = {
    lessonCode, exercise, question, answer, evaluation, feedbackMessage,
  };

  if (error) {
    return (
      <div className="sa-surface-plain sa-page py-8 sm:py-10 space-y-6">
        <p className="text-rose-700 bg-rose-50 border-2 border-rose-200 rounded-xl p-4">{error}</p>
        <Link to={`/espace/pratique/${lessonCode}`} className="text-sm font-bold text-slate-600 hover:text-slate-900">
          ← {t('practice.backToPractice')}
        </Link>
      </div>
    );
  }

  if (!exercise || !question) {
    return <div className="sa-surface-plain sa-page py-8 sm:py-10 space-y-6"><div className="h-64 rounded-2xl bg-slate-100 animate-pulse" /></div>;
  }

  const answered = evaluation !== null;
  const totalQuestions = exercise.questions.length;

  return (
    <div className="sa-surface-plain sa-page py-8 sm:py-10 space-y-6">
      {/* MODE CLASSE (وضع القسم) : la coquille enveloppe TOUTE la page pour que
          le bouton d'entrée (dans la rangée de navigation) et le contenu
          présenté partagent la même session ; en présentation, le chrome de
          séance (retour, progression, en-tête, cahier, signalement) est
          retiré et seul l'exercice reste, cadré. Rien ne se remonte : la
          réponse en cours, les indices demandés et la correction restent. */}
      <ClassroomPresentation scope="exercise" title={exerciseHeading} entry="none" className="space-y-6">
      {/* La sortie de séance. Sans elle, l'élève engagé dans un niveau n'a
          aucun chemin de retour : ni bandeau, ni fil d'Ariane sur cette page.
          Le travail déjà validé est enregistré côté serveur à chaque réponse,
          donc quitter ne perd rien — et la séance reste ouverte, le Hub
          propose de la « Reprendre ». */}
      <ClassroomHidden><nav className="flex items-center justify-between gap-3 flex-wrap" aria-label={t('nav.breadcrumb', { ns: 'lesson' })}>
        <Link
          to={`/espace/pratique/${lessonCode}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-indigo-600 whitespace-nowrap"
        >
          <ArrowBack className="w-3 h-3" aria-hidden="true" /> {t('practice.backToLevels')}
        </Link>
        {/* ⛶ عرض التمرين — le mode classe de CET exercice (présentateur
            seulement). Le bouton est hors de la coquille, le contenu dedans :
            entrer ne remonte rien, la réponse en cours et la correction
            restent. */}
        <ClassroomEntryButton scope="exercise" title={exerciseHeading} tone="quiet" />
      </nav></ClassroomHidden>

      <ClassroomHidden><SessionProgress
        index={index}
        total={exerciseIds.length}
        correctCount={correctCount}
        questionIndex={questionIndex}
        questionTotal={totalQuestions}
      /></ClassroomHidden>

      <ClassroomHidden><header className="space-y-1">
        {/* « المستوى 2 · تمرين 2 — السؤال 1 : القسمة على 6 ».
            Le NUMÉRO DE QUESTION s'insère dans le titre de l'exercice, juste
            après « تمرين n — », là où l'élève lit déjà où il se trouve. Les
            titres du manuel ont tous la forme « تمرين n — <sujet> » : on coupe
            donc sur le tiret cadratin pour glisser le numéro entre les deux.
            Un titre sans tiret (ou un exercice à une seule question) reste
            affiché tel quel, sans numéro postiche. */}
        <p className="text-xs font-mono font-bold text-indigo-600 uppercase">
          {t('practice.levelLabel', { level: session.level })} · {exerciseHeading}
        </p>
      </header></ClassroomHidden>

      <ClassroomFrame maxWidth={1080}>
      <section className="rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <ExerciseStatement
          content={exercise.statement?.content}
          visual={exercise.statement?.visual}
          support={exercise.statement?.support}
        />

        <hr className="border-slate-100" />

        <div className="space-y-4">
          <p className="text-[15px] sm:text-base text-slate-900 font-medium">
            <RichText>{question.statement}</RichText>
          </p>

          {question.visual && <ExerciseStatement visual={question.visual} support={question.support} />}

          <QuestionRenderer question={question} value={answer} onChange={setAnswer} disabled={answered} />

          {/* Valider et noter cohabitent : la remarque vient souvent PENDANT
              la recherche, pas seulement après le verdict. Le carnet reste
              donc atteignable tant que la question est ouverte — et il l'est
              encore après, dans le bloc de correction ci-dessous. */}
          <div className="flex items-center gap-3 flex-wrap">
            {!answered && (
              <ValidateButton onClick={validate} disabled={answer == null || busy} tone="indigo">
                {t('practice.checkMyAnswer')}
              </ValidateButton>
            )}
            <ClassroomHidden>{!answered && <NotebookButton key={`note-${question.id}`} context={notebookContext} onSave={saveNote} onUpdate={patchNote} compact />}</ClassroomHidden>
            {/* Même barre d'outils que le carnet : ce sont les deux gestes
                « à propos de cette question ». `key` par question pour que le
                panneau se referme en changeant de question — et attemptUuid
                peut être null au tout premier rendu, ce que le serveur
                accepte (le champ est facultatif). */}
            <ClassroomHidden><ReportButton
              key={`report-${question.id}`}
              source="question"
              variant="icon"
              context={{
                lessonCode,
                sessionId,
                exerciseCode: exercise?.id,
                questionId: question?.id,
                attemptUuid,
              }}
            /></ClassroomHidden>
          </div>

          <HintPanel
            hints={hints}
            remaining={hintsRemaining}
            onRequest={askHint}
            busy={busy}
            disabled={answered}
          />

          {answered && (
            <div className="space-y-4">
              <FeedbackPanel
                evaluation={evaluation}
                message={feedbackMessage}
              />

              <ClassroomHidden><NotebookButton key={`note-answered-${question.id}`} context={notebookContext} onSave={saveNote} onUpdate={patchNote} /></ClassroomHidden>

              <div className="flex gap-3 flex-wrap">
                {/* Réessayer est PROPOSÉ, jamais imposé : une réponse fausse
                    ne verrouille pas la suite. */}
                {!evaluation.isCorrect && (
                  <button
                    type="button"
                    onClick={() => { setEvaluation(null); setAnswer(null); }}
                    className="px-5 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-bold min-h-[48px]"
                  >
                    {t('practice.retry')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={busy}
                  className="flex-1 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold min-h-[48px] disabled:opacity-60"
                >
                  {questionIndex < totalQuestions - 1
                    ? t('practice.nextQuestion')
                    : index < exerciseIds.length - 1 ? t('practice.nextExercise') : t('practice.finishSession')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      </ClassroomFrame>
      </ClassroomPresentation>
    </div>
  );
}
