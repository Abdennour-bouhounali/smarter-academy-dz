import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { isolateMathRuns } from '../../../utils/bidi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowBack, ArrowForward } from '../../../components/common/DirectionalIcons';
import { BarChart3, Check, CheckCircle2, Clock, Lightbulb, RotateCcw } from 'lucide-react';

import { practice } from '@smarter-academy/core';
import { AuthContext } from '../../../context/AuthContext';
import {
  fetchPracticeSession, fetchPracticeOverview, openQuestion, requestHint, submitAnswer,
  completeExercise, completeSession, createNote, updateNote, fetchNextExercise,
} from '../../../services/practiceService';
import { exerciseIdsFor, loadExercise } from '../../../features/practice/practiceContent';
import { decideNextExercise, selectionHintReason } from '../../../features/practice/nextExercise';
import ExerciseStatement from '../../../features/practice/ExerciseStatement';
import QuestionRenderer from '../../../features/practice/QuestionRenderer';
import HintPanel from '../../../features/practice/HintPanel';
import FeedbackPanel from '../../../features/practice/FeedbackPanel';
import SessionProgress from '../../../features/practice/SessionProgress';
import NotebookButton from '../../../features/practice/NotebookButton';
import ReportButton from '../../../features/reports/ReportButton';
import RichText from '../../../features/practice/RichText';
import QuestionHistory from '../../../features/practice/QuestionHistory';
import QuestionArrival from '../../../features/practice/QuestionArrival';
import QuestionContextPanel from '../../../features/practice/QuestionContextPanel';
import LearningPointProgress from '../../../features/practice/LearningPointProgress';
import { currentLearningPoint } from '../../../features/practice/learningPointProgress';
import { historyEntry, recordQuestion, exerciseScore, outcomeTone } from '../../../features/practice/questionHistory';
import { ClassroomPresentation, ClassroomEntryButton, ClassroomFrame, ClassroomHidden } from '../../../lessons/common/classroom';
import MISCONCEPTIONS from '../../../../../../content/practice/misconceptions.json';

const { evaluateAnswer, feedbackFor, isSuccessOutcome } = practice;

// L'action principale de la carte — vérifier, puis passer à la suite. Même
// forme pour les deux : l'élève a UN bouton plein à chercher à chaque étape.
// La taille de texte est EXPLICITE : dans le cadre de وضع القسم, un bouton
// qui l'hérite prend `1rem × échelle` et devient minuscule.
// (Pas `ValidateButton` de LessonUI : petit, en chasse fixe, sans `type` —
// il sert les 132 leçons et n'est pas modifié ici.)
const PRIMARY_BUTTON = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none motion-reduce:transition-none';

// Secondaire : contour, jamais plein — « أعِد المحاولة », « السؤال التالي »
// tant qu'aucune réponse n'est vérifiée.
const SECONDARY_BUTTON = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-700 transition-colors hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 motion-reduce:transition-none';

// Tertiaire : du texte avec une icône, sans fond — « إرشاد », « السؤال السابق ».
const TERTIARY_BUTTON = 'inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60 motion-reduce:transition-none';

const reducedMotion = () => typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Le lecteur d'exercices.
 *
 * La justesse est JUGÉE PAR LE SERVEUR (Mastery V2). @smarter-academy/core
 * évalue encore la réponse ici, mais seulement pour un retour instantané :
 * ce verdict local est une PRÉDICTION, envoyée au serveur pour comparaison
 * (`outcome`), puis REMPLACÉE par `evaluation` de sa réponse — c'est elle
 * qui s'affiche, et elle qui compte les bonnes réponses. Quand les deux
 * divergent, le serveur gagne, le retour se réaffiche et une petite note le
 * dit (« تم التحقق من إجابتك على الخادم »).
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
  // L'exercice courant, par son IDENTIFIANT (plus un index) : depuis la
  // phase 9, le serveur choisit l'ordre (GET /practice/sessions/{id}/next) ;
  // l'ordre du contenu n'est plus qu'un repli (features/practice/nextExercise.js).
  const [currentId, setCurrentId] = useState(null);
  // Les exercices terminés dans CETTE visite : ils comptent la position
  // (« التمرين n من total ») et excluent le repli par ordre du contenu.
  const [completedIds, setCompletedIds] = useState([]);
  // La décision qui a ouvert l'exercice courant — sa raison nourrit la
  // petite phrase « اخترنا لك هذا التمرين… ».
  const [selection, setSelection] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [attemptUuid, setAttemptUuid] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  // Vrai quand le verdict du serveur a contredit la prédiction locale : la
  // note « تم التحقق من إجابتك على الخادم » s'affiche sous le retour.
  const [serverOverrode, setServerOverrode] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // L'HISTORIQUE des questions déjà quittées dans l'exercice courant — des
  // photographies de l'état ci-dessus (questionHistory.js), pas un second
  // état d'exercice : le serveur reste la vérité des tentatives. Remis à
  // zéro à chaque nouvel exercice.
  const [history, setHistory] = useState([]);
  // Validations faites sur la question courante (1 = du premier coup) :
  // l'historique dit « صُحّحت بعد إعادة المحاولة ».
  const [tries, setTries] = useState(0);
  // Posé par « السؤال التالي » / « التمرين التالي » : QuestionArrival amène
  // le regard et le focus sur la nouvelle question, une fois affichée.
  const [arrival, setArrival] = useState(null);
  const clearArrival = useCallback(() => setArrival(null), []);
  // Les points d'apprentissage de la leçon, tels que l'aperçu de pratique les
  // renvoie : état de maîtrise (Mastery V2) + compteurs d'activité
  // (`practice`). Relu après chaque réponse enregistrée et chaque exercice
  // terminé — les étoiles et les barres avancent sous les yeux de l'élève.
  const [learningPoints, setLearningPoints] = useState([]);
  const refreshLearningPoints = useCallback(() => {
    if (!token) return;
    fetchPracticeOverview(token, lessonCode)
      .then((data) => setLearningPoints(data?.learningPoints ?? []))
      .catch(() => {}); // Un module d'information : son échec ne bloque jamais la séance.
  }, [token, lessonCode]);
  useEffect(() => { refreshLearningPoints(); }, [refreshLearningPoints]);

  const workspaceRef = useRef(null);
  const cardRef = useRef(null);
  const questionHeadingRef = useRef(null);
  const feedbackRef = useRef(null);

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

  // Le PREMIER exercice : demandé au sélecteur, avec le même repli que les
  // suivants (échec ou `disabled` → ordre du contenu). Un niveau déjà épuisé
  // pour cette séance (reprise) se clôt comme après le dernier exercice.
  useEffect(() => {
    if (!token || !session || exerciseIds.length === 0 || currentId !== null) return undefined;
    let cancelled = false;

    fetchNextExercise(token, sessionId)
      .catch(() => null)
      .then(async (response) => {
        if (cancelled) return;
        const decision = decideNextExercise({ response, fallbackIds: exerciseIds, completedIds: [] });
        if (decision.exerciseId) {
          setSelection(decision);
          setCurrentId(decision.exerciseId);
          return;
        }
        try {
          await completeSession(token, sessionId);
          if (!cancelled) navigate(`/espace/pratique/${lessonCode}/bilan/${sessionId}`, { replace: true });
        } catch (e) {
          if (!cancelled) setError(e.message);
        }
      });

    return () => { cancelled = true; };
  }, [token, session, sessionId, exerciseIds, currentId, lessonCode, navigate]);

  // Charge l'exercice courant dès que la séance et son identifiant sont connus.
  useEffect(() => {
    if (!session || !currentId) return undefined;
    let cancelled = false;

    loadExercise(lessonCode, session.level, currentId).then((data) => {
      if (cancelled) return;
      setExercise(data);
      setQuestionIndex(0);
      setAnswer(null);
      setEvaluation(null);
      setHints([]);
      setHistory([]);
      setTries(0);
    });

    return () => { cancelled = true; };
  }, [session, currentId, lessonCode]);

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
    // Un titre peut contenir une égalité ou une fraction (« 120 = 6 × 20 », « 28/42 ») :
    // isolée LTR, sinon le RTL l'affiche à l'envers (« 20 × 6 = 120 »).
    const title = isolateMathRuns(exercise?.metadata?.title ?? '');
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
        setServerOverrode(false);
        setTries(0);
        // Une question déjà répondue (tentative rouverte) se relit avec le
        // verdict du SERVEUR quand il le renvoie.
        if (data.attempt?.answered) {
          const outcome = data.attempt.outcome ?? 'correct';
          setEvaluation({ outcome, isCorrect: isSuccessOutcome(outcome), misconceptionId: null, feedbackKey: null });
        } else {
          setEvaluation(null);
        }
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
      // 1. Prédiction locale — affichée tout de suite, jamais comptée.
      const predicted = evaluateAnswer(answer, question);
      setEvaluation(predicted);
      setServerOverrode(false);
      setTries((n) => n + 1);
      // Le bouton qui avait le focus disparaît : le focus va au retour
      // (focalisable, `role="status"`), d'où Tab mène à « la suite ».
      requestAnimationFrame(() => {
        const box = feedbackRef.current;
        if (!box) return;
        box.focus({ preventScroll: true });
        box.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
      });

      // 2. Le serveur juge. `outcome` n'est que la prédiction du client,
      //    envoyée pour la comparaison en ombre ; la réponse porte
      //    `evaluation`, le verdict qui s'affiche et qui compte.
      const data = await submitAnswer(token, sessionId, {
        attemptUuid,
        answer: answer ?? null,
        outcome: predicted.outcome,
      });
      const verdict = data?.evaluation ?? null;
      const shown = verdict
        ? {
          outcome: verdict.outcome,
          isCorrect: typeof verdict.isCorrect === 'boolean' ? verdict.isCorrect : isSuccessOutcome(verdict.outcome),
          misconceptionId: verdict.misconceptionId ?? null,
          normalized: verdict.normalized ?? '',
          feedbackKey: verdict.feedbackKey ?? predicted.feedbackKey,
        }
        : predicted;
      setEvaluation(shown);
      if (verdict && verdict.outcome !== predicted.outcome) setServerOverrode(true);
      // « أعِد المحاولة » : le serveur juge la nouvelle réponse sans
      // l'enregistrer (`recorded: false`) — rien n'a bougé côté compteurs.
      if (data?.recorded !== false) refreshLearningPoints();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, [question, attemptUuid, answer, token, sessionId, busy, refreshLearningPoints]);

  const next = useCallback(async () => {
    const lastQuestion = questionIndex >= (exercise?.questions?.length ?? 1) - 1;
    const from = `${exercise?.id}:${question?.id}`;

    if (!lastQuestion) {
      // La question quittée entre dans l'historique, telle que l'élève la
      // laisse : sa réponse, le verdict affiché, le retour, les indices.
      setHistory((h) => recordQuestion(h, historyEntry({
        question,
        index: questionIndex,
        answer,
        evaluation,
        feedbackMessage: evaluation ? feedbackFor(question, evaluation, MISCONCEPTIONS) : '',
        hintsUsed: hints.length,
        tries,
      })));
      setArrival({ type: 'question', from });
      setQuestionIndex((i) => i + 1);
      setAnswer(null);
      setEvaluation(null);
      setServerOverrode(false);
      setHints([]);

      return;
    }

    setBusy(true);
    try {
      await completeExercise(token, sessionId, exercise.id);
      refreshLearningPoints();
      const completed = completedIds.includes(exercise.id) ? completedIds : [...completedIds, exercise.id];
      setCompletedIds(completed);
      // Le sélecteur choisit la suite ; son échec n'est jamais une erreur
      // affichée : on reprend l'ordre du contenu (nextExercise.js).
      const response = await fetchNextExercise(token, sessionId).catch(() => null);
      const decision = decideNextExercise({ response, fallbackIds: exerciseIds, completedIds: completed });
      if (!decision.exerciseId) {
        await completeSession(token, sessionId);
        navigate(`/espace/pratique/${lessonCode}/bilan/${sessionId}`);
      } else {
        setArrival({ type: 'exercise', from });
        setSelection(decision);
        setCurrentId(decision.exerciseId);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, [questionIndex, exercise, question, answer, evaluation, hints, tries, token, sessionId, completedIds, exerciseIds, navigate, lessonCode, refreshLearningPoints]);

  // « أعِد المحاولة » GARDE la réponse : l'élève corrige ce qu'il a écrit
  // (une faute de frappe, un signe) au lieu de tout retaper. Le focus revient
  // au champ — ou au choix sélectionné d'un QCM.
  const retry = useCallback(() => {
    setEvaluation(null);
    setServerOverrode(false);
    requestAnimationFrame(() => {
      cardRef.current
        ?.querySelector('input:not([disabled]), textarea:not([disabled]), button[aria-pressed="true"]:not([disabled])')
        ?.focus();
    });
  }, []);

  // « السؤال السابق » : ramène la carte de la question précédente sous les
  // yeux (et le focus dessus). Relire, pas rejouer.
  const showPrevious = useCallback(() => {
    const card = workspaceRef.current?.querySelector('[data-previous-question]');
    if (!card) return;
    card.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
    card.focus({ preventScroll: true });
  }, []);

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
      <div className="sa-surface-plain sa-page sa-page--flush py-6 space-y-6">
        <p className="text-rose-700 bg-rose-50 border-2 border-rose-200 rounded-xl p-4">{error}</p>
        <Link to={`/espace/pratique/${lessonCode}`} className="text-sm font-bold text-slate-600 hover:text-slate-900">
          ← {t('practice.backToPractice')}
        </Link>
      </div>
    );
  }

  if (!exercise || !question) {
    return <div className="sa-surface-plain sa-page sa-page--flush py-6"><div className="h-64 rounded-2xl bg-slate-100 animate-pulse" /></div>;
  }

  const answered = evaluation !== null;
  const totalQuestions = exercise.questions.length;
  const isLastQuestion = questionIndex >= totalQuestions - 1;
  // La position dans le niveau = les exercices TERMINÉS, plus un index : le
  // sélecteur ne suit pas l'ordre du contenu. Le total reste celui du niveau.
  const position = Math.min(completedIds.length, Math.max(0, exerciseIds.length - 1));
  const selectedBecause = selectionHintReason(selection);
  const currentTone = answered ? outcomeTone(evaluation.outcome) : null;
  const levelName = t(`practice.levelNames.${session.level}`, { defaultValue: '' });
  const score = answered && isLastQuestion ? exerciseScore(history, evaluation) : null;
  // Une réponse fausse garde l'aide ouverte : l'indice suivant sert à la
  // nouvelle tentative. Une réponse juste la referme.
  const hintsClosed = answered && evaluation.isCorrect;

  const questionTones = history.map((e) => e.tone);
  const isChoice = question.answerType === 'choice' || question.answerType === 'multiChoice';
  // Le titre seul, pour le h1 ; `exerciseHeading` (titre + « السؤال n »)
  // reste le titre de la présentation en classe, où le chrome est retiré.
  const exerciseTitle = isolateMathRuns(exercise.metadata?.title ?? '');

  const nextLabel = !isLastQuestion
    ? t('practice.nextQuestion')
    : completedIds.length < exerciseIds.length - 1 ? t('practice.nextExercise') : t('practice.finishSession');

  // Le point d'apprentissage de la QUESTION courante (un exercice peut en
  // mêler plusieurs), avec son état et ses compteurs.
  const point = currentLearningPoint(question, exercise, learningPoints);
  const minutes = exercise.metadata?.estimatedMinutes;
  const tags = exercise.metadata?.tags ?? [];
  // Avant la réponse, « السؤال التالي » est secondaire (contour, inactif) ;
  // après, il devient L'action — un seul bouton plein à la fois.
  const nextClass = answered ? `${PRIMARY_BUTTON} min-w-[10rem]` : SECONDARY_BUTTON;

  return (
    // Toute la largeur de l'écran, 20 px de marge de chaque côté, à tous les
    // formats (demande du propriétaire, 2026-09-24) : le cadre partagé
    // `.sa-page` avec sa variante `--flush` (index.css), sans largeur
    // maximale — l'exercice prend tout ce que la colonne latérale laisse.
    <div className="sa-surface-plain sa-page sa-page--flush py-4 sm:py-6">
      <MotionConfig reducedMotion="user">
      {/* MODE CLASSE (وضع القسم) : la coquille enveloppe TOUTE la page pour que
          le bouton d'entrée (dans la rangée de navigation) et le contenu
          présenté partagent la même session ; en présentation, le chrome de
          séance (retour, colonne latérale, en-tête, cahier, signalement)
          est retiré et seul l'exercice reste, cadré. Rien ne se remonte : la
          réponse en cours, les indices demandés, la correction et
          l'historique des questions restent. */}
      <ClassroomPresentation scope="exercise" title={exerciseHeading} entry="none" className="w-full space-y-3">
      <QuestionArrival
        arrival={arrival}
        questionKey={`${exercise.id}:${question.id}`}
        workspaceRef={workspaceRef}
        cardRef={cardRef}
        headingRef={questionHeadingRef}
        titleId="practice-exercise-title"
        onArrived={clearArrival}
      />
      {/* La sortie de séance. Sans elle, l'élève engagé dans un niveau n'a
          aucun chemin de retour : ni bandeau, ni fil d'Ariane sur cette page.
          Le travail déjà validé est enregistré côté serveur à chaque réponse,
          donc quitter ne perd rien — et la séance reste ouverte, le Hub
          propose de la « Reprendre ». */}
      <ClassroomHidden><nav className="flex items-center justify-between gap-3 flex-wrap" aria-label={t('nav.breadcrumb', { ns: 'lesson' })}>
        <Link
          to={`/espace/pratique/${lessonCode}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-1 text-sm font-bold text-slate-700 hover:text-indigo-700 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <ArrowBack className="w-4 h-4" aria-hidden="true" /> {t('practice.backToLevels')}
        </Link>
        {/* ⛶ عرض التمرين — le mode classe de CET exercice (présentateur
            seulement). Le bouton est hors de la coquille, le contenu dedans :
            entrer ne remonte rien, la réponse en cours et la correction
            restent. */}
        <ClassroomEntryButton scope="exercise" title={exerciseHeading} tone="quiet" />
      </nav></ClassroomHidden>

      {/* ── L'ESPACE DE TRAVAIL ─────────────────────────────────────────────
          Téléphone/tablette : une colonne — point d'apprentissage, puis
          l'exercice. À partir de `xl` : UNE colonne latérale étroite (point
          d'apprentissage + « سياق السؤال ») au début (à droite en RTL), et
          l'exercice qui prend tout le reste — la tâche mathématique est ce
          qui compte. En وضع القسم (`data-sa-classroom` sur <html>), la grille
          redevient un bloc et la colonne est retirée. */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[28rem_minmax(0,1fr)] xl:items-start xl:gap-5 2xl:grid-cols-[30.6rem_minmax(0,1fr)] [[data-sa-classroom]_&]:block">

      <ClassroomHidden><aside className="space-y-3 xl:sticky xl:top-4" data-practice-side>
        {/* ── 1 — CE QUE J'ENTRAÎNE, et où j'en suis : toujours en tête. ── */}
        <LearningPointProgress point={point} />
        {/* ── « سياق السؤال » — grand écran seulement ─────────────────── */}
        <div className="hidden xl:block" data-question-context-column>
          <QuestionContextPanel questions={exercise.questions} questionIndex={questionIndex} history={history} />
        </div>
      </aside></ClassroomHidden>

      <div className="min-w-0 space-y-3">
      {/* ── 2 — QUEL exercice : niveau (surtitre), titre (h1), méta. ────── */}
      <ClassroomHidden><header className="space-y-1" data-exercise-header>
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-slate-600" data-exercise-level>
          <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            {t('practice.levelLabel', { level: session.level })}{levelName ? ` · ${levelName}` : ''}
          </span>
          {minutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('practice.meta.minutes', { count: minutes })}
            </span>
          ) : null}
          {tags.length > 0 && <span>{tags.join(' ، ')}</span>}
        </p>
        <h1
          id="practice-exercise-title"
          tabIndex={-1}
          className="text-lg font-bold leading-snug text-slate-900 focus:outline-none sm:text-xl"
        >
          {exerciseTitle}
        </h1>
        {/* Pourquoi CET exercice — une phrase discrète, jamais un blocage. */}
        {selectedBecause && (
          <p className="text-sm text-slate-600" data-selected-because={selectedBecause}>
            {t(`practice.selectedBecause.${selectedBecause}`)}
          </p>
        )}
      </header></ClassroomHidden>

      <ClassroomFrame maxWidth={1080}>
      <div ref={workspaceRef} className="space-y-3" data-exercise-workspace>
        {/* ── les DONNÉES du problème : le contexte, pas la question. ───── */}
        {(exercise.statement?.content || exercise.statement?.visual || exercise.statement?.support) && (
          <section aria-labelledby="practice-statement-label" className="rounded-xl bg-white/70 px-3.5 py-3 ring-1 ring-slate-200 sm:px-4">
            <p id="practice-statement-label" className="mb-1 text-xs font-bold text-slate-600">{t('practice.statementLabel')}</p>
            <ExerciseStatement
              content={exercise.statement?.content}
              visual={exercise.statement?.visual}
              support={exercise.statement?.support}
            />
          </section>
        )}

        {/* ── ce que l'élève a DÉJÀ fait : « السؤال السابق » + les anciennes ── */}
        <QuestionHistory entries={history} total={totalQuestions} />

        {/* ── LA QUESTION COURANTE : la seule surface en relief, filet
            indigo sur le bord de début. ─────────────────────────────────── */}
        <motion.section
          key={`${exercise.id}:${question.id}`}
          ref={cardRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-labelledby="practice-question-heading"
          aria-current="step"
          data-current-question={questionIndex + 1}
          className="relative scroll-mt-20 overflow-hidden rounded-2xl border-s-4 border-indigo-600 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_28px_-16px_rgba(15,23,42,0.22)] ring-1 ring-slate-200 lg:scroll-mt-6"
        >
          {/* « السؤال n من N » (N = les questions de CET exercice) et
              « التمرين n من N » : la position, une seule fois, ici. */}
          <header className="border-b border-indigo-100 bg-indigo-50/50 px-4 py-2.5 sm:px-5">
            <SessionProgress
              index={position}
              total={exerciseIds.length}
              questionIndex={questionIndex}
              questionTotal={totalQuestions}
              questionTones={questionTones}
              currentTone={currentTone}
              headingId="practice-question-heading"
              headingRef={questionHeadingRef}
            />
          </header>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="space-y-3">
              <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl" data-question-statement>
                <RichText>{question.statement}</RichText>
              </p>
              {question.visual && <ExerciseStatement visual={question.visual} support={question.support} />}
            </div>

            {/* La réponse. Un <form> : Entrée dans un champ valide, comme
                partout sur le web ; les choix et les crochets sont des
                `type="button"` et ne soumettent rien. */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!answered && answer != null && !busy) validate();
              }}
              className="space-y-3"
              data-answer-form
            >
              <div className={`flex flex-col gap-1.5 ${isChoice ? '' : 'sm:flex-row sm:items-center sm:gap-3'}`}>
                <span className="shrink-0 text-sm font-bold text-slate-700" aria-hidden="true">{t('practice.yourAnswerLabel')}</span>
                <div className="min-w-0 flex-1">
                  <QuestionRenderer question={question} value={answer} onChange={setAnswer} disabled={answered} />
                </div>
              </div>

              {!answered && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={answer == null || busy}
                    className={`${PRIMARY_BUTTON} w-full sm:w-auto sm:min-w-[14rem]`}
                    data-validate
                  >
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {t('practice.checkMyAnswer')}
                  </button>
                  {/* Raccourci TERTIAIRE vers l'indice suivant (il ouvre le
                      panneau). Masqué sur téléphone : le panneau juste dessous
                      porte le même geste. */}
                  {hintsRemaining > 0 && (
                    <button
                      type="button"
                      onClick={askHint}
                      disabled={busy}
                      className={`${TERTIARY_BUTTON} hidden sm:inline-flex`}
                      data-hint-shortcut
                    >
                      <Lightbulb className="h-4 w-4 text-amber-600" aria-hidden="true" />
                      {t('practice.hint.short')}
                    </button>
                  )}
                </div>
              )}
            </form>

            {/* Le verdict, et ce qu'il enseigne. */}
            {answered && (
              <FeedbackPanel ref={feedbackRef} evaluation={evaluation} message={feedbackMessage}>
                {/* Le serveur a tranché autrement que la prédiction locale :
                    on le dit, sans bloquer — le verdict affiché est déjà le sien. */}
                {serverOverrode && (
                  <p className="flex items-center gap-1.5 pt-1 text-xs text-slate-600" data-server-verdict>
                    <span aria-hidden="true">☁</span> {t('practice.serverVerdict')}
                  </p>
                )}
              </FeedbackPanel>
            )}

            {/* Réessayer est PROPOSÉ, jamais imposé. Désactivé le temps que le
                serveur réponde : son verdict ne doit pas réapparaître
                par-dessus une question déjà rouverte. */}
            {answered && !evaluation.isCorrect && (
              <button type="button" disabled={busy} onClick={retry} className={SECONDARY_BUTTON} data-retry>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('practice.retry')}
              </button>
            )}

            {/* L'aide : une ligne tant qu'on n'en veut pas. Une réponse fausse
                la garde ouverte ; une réponse juste la referme. `key` par
                question : repliée à chaque nouvelle question. */}
            <HintPanel
              key={`hints-${exercise.id}:${question.id}`}
              hints={hints}
              remaining={hintsRemaining}
              hintTypes={question.hints?.map((h) => h.type) ?? []}
              onRequest={askHint}
              busy={busy}
              disabled={hintsClosed}
            />

            {/* Fin d'exercice : le seul moment qui mérite plus qu'une coche. */}
            {score && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3.5 py-2.5 ring-1 ring-indigo-100"
                data-exercise-done
              >
                <CheckCircle2 className="h-6 w-6 shrink-0 text-indigo-600" aria-hidden="true" />
                <p className="text-sm text-indigo-950">
                  <span className="font-bold">{t('practice.exerciseDone')}</span>
                  {totalQuestions > 1 && (
                    <>
                      {' · '}{t('practice.exerciseScore')}{' '}
                      <bdi dir="ltr" className="font-bold tabular-nums">{score.correct} / {score.total}</bdi>
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Le geste TERTIAIRE « à propos de cette question » : signaler.
                `key` par question pour que le panneau se referme en
                changeant de question. Le cahier, lui, n'est plus ici : c'est
                la pastille flottante « 📓 كرّاسي », la même qu'en leçon. */}
            <ClassroomHidden><div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-2.5" data-question-tools>
              <ReportButton
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
              />
            </div></ClassroomHidden>
          </div>
        </motion.section>

        {/* Le cahier : LA pastille flottante « 📓 كرّاسي » de la leçon, au
            même étage (au-dessus de la barre « السؤال التالي »). Atteignable
            à tout moment — pendant la recherche comme après le verdict.
            `key` par question ET par verdict : une réponse validée ouvre une
            nouvelle note, pré-remplie de la réponse et du verdict (c'est le
            moment d'y garder une erreur). */}
        <ClassroomHidden>
          <NotebookButton
            key={`note-${answered ? 'answered-' : ''}${question.id}`}
            context={notebookContext}
            onSave={saveNote}
            onUpdate={patchNote}
          />
        </ClassroomHidden>

        {/* ── LA SUITE — pied de colonne. « السؤال التالي » est TOUJOURS là,
            actif dès qu'une réponse est vérifiée, juste ou fausse (invariant
            non bloquant) — secondaire avant, principal après. « السؤال
            السابق » ramène à la question précédente — on la relit ; on ne
            rouvre pas une tentative déjà jugée par le serveur. Sur téléphone
            la barre colle au bas de l'écran, au-dessus de la barre d'onglets,
            sous le pouce — sauf sur un écran très bas (téléphone en paysage) :
            collée, elle ne laisserait plus voir le champ de réponse. Sur
            ordinateur, `lg:pe-36` laisse à sa fin (la gauche, en RTL) la
            place de la pastille « 📓 كرّاسي », posée au même étage. */}
        <div
          className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-10 -mx-5 flex items-center gap-2 border-t border-slate-200 bg-slate-50/95 px-5 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-white/95 sm:px-3 lg:bottom-4 lg:pe-36 [@media(max-height:520px)]:static"
          data-question-footer
        >
          {history.length > 0 ? (
            <button type="button" onClick={showPrevious} className={TERTIARY_BUTTON} data-show-previous>
              <ArrowBack className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('practice.previousQuestion')}</span>
              <span className="sr-only sm:hidden">{t('practice.previousQuestion')}</span>
            </button>
          ) : <span />}

          <p className="flex flex-1 items-center justify-center gap-1.5 text-xs font-semibold text-slate-600" aria-live="polite" data-save-state>
            {answered && !busy && (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                {t('practice.answerSaved')}
              </>
            )}
          </p>

          <button type="button" onClick={next} disabled={!answered || busy} className={nextClass} data-next>
            {nextLabel}
            <ArrowForward className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      </ClassroomFrame>
      </div>
      </div>
      </ClassroomPresentation>
      </MotionConfig>
    </div>
  );
}
