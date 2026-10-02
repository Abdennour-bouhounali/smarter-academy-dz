import { Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClipboardList, GraduationCap, NotebookPen, Printer, BookOpen } from 'lucide-react';
import { getLessonById, getUnitOfLesson } from '@smarter-academy/core';
import { getLessonConfig } from '../../lessons/registry';
import { useContentAvailability } from '../../context/ContentAvailabilityContext';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { ArrowBack } from '../../components/common/DirectionalIcons';
import { Loading, ErrorBox } from './teacherUi';
import { buildLessonMemo } from '../../features/teacher/lessonMemo/buildLessonMemo';
import { loadLessonMemoSources } from '../../features/teacher/lessonMemo/loadLessonMemoSources';
import { CLASSROOM_START_STATE, TEACHER_COURSES_PATH } from '../../features/teacher/lessonMemo/memoRoutes';
import {
  MemoOverview, MemoObjectives, MemoStart, MemoTimeline, MemoExamples, MemoErrors,
  MemoDifferentiation, MemoTrace, MemoEvaluation, MemoNext,
} from '../../features/teacher/lessonMemo/MemoSections';
import MemoNotes from '../../features/teacher/lessonMemo/MemoNotes';
import '../../features/teacher/lessonMemo/memo.css';
import MathLabel from '../../lessons/common/components/MathLabel';

/**
 * « مذكرة الدرس » — /enseignant/cours/:lessonId/memoire.
 *
 * Le document d'ORCHESTRATION d'une séance : une seule page continue, qu'on
 * garde ouverte pendant toute la classe. Rien n'y est écrit à la main : le
 * modèle est construit par buildLessonMemo à partir du catalogue, de
 * lesson.config.js et du contenu de la leçon ; seules les notes (« كرّاسي »)
 * appartiennent à l'enseignant, et elles vivent dans son cahier.
 *
 * Portes : la route est sous ProtectedRoute(teacher) — un élève, un visiteur
 * ou un administrateur n'y entre pas, même par l'URL. La page refuse en plus
 * une leçon inconnue, non construite ou fermée par l'administration. Les
 * notes sont servies par le serveur au seul propriétaire.
 *
 * Le namespace `memo` est chargé à la demande : la <Suspense> est ici.
 */
export default function LessonMemoPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LessonMemo />
    </Suspense>
  );
}

/** Les ancres de la barre : seulement les sections que la leçon remplit. */
function sectionsOf(memo) {
  const d = memo.differentiation;
  const hasTier = ['support', 'core', 'extension'].some((k) => d[k].exercises.length + d[k].manipulations.length > 0);
  const e = memo.evaluation;
  return [
    ['overview', true],
    ['objectives', true],
    ['start', !!memo.start],
    ['timeline', memo.phases.length > 0],
    ['examples', memo.examples.length > 0],
    ['errors', true],
    ['differentiation', hasTier],
    ['trace', !!memo.trace.observation || memo.trace.bricks.length > 0],
    ['evaluation', !!e.phase || e.oral.length > 0 || e.indicators.length > 0 || !!e.exitTicket],
    ['next', true],
    ['notes', true],
  ].filter(([, shown]) => shown).map(([key]) => key);
}

function LessonMemo() {
  const { t } = useTranslation('memo');
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLessonClosed } = useContentAvailability();

  const lesson = getLessonById(lessonId);
  const config = getLessonConfig(lessonId);
  const available = !!lesson && !!config && lesson.status === 'available' && !isLessonClosed(lessonId);
  useDocumentMeta(t('metaTitle', { title: lesson?.title ?? '' }), t('subtitle'));

  const [sources, setSources] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!available) return undefined;
    let alive = true;
    setSources(null);
    setError(false);
    loadLessonMemoSources(lessonId).then((s) => { if (alive) setSources(s); }, () => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [lessonId, available]);

  const memo = useMemo(() => {
    if (!available || !sources) return null;
    const unit = getUnitOfLesson(lessonId);
    const unitLessons = unit ? [...unit.lessons, ...(unit.synthesis ? [unit.synthesis] : [])] : [];
    return buildLessonMemo({ lesson, config, unit, ...sources, lessonById: getLessonById, unitLessons });
  }, [available, sources, lessonId, lesson, config]);

  // « رجوع » ramène au contexte d'où l'on vient (la page d'unité, le
  // catalogue…) ; sans historique dans l'application, au catalogue.
  const goBack = () => {
    const from = location.state?.from;
    if (typeof from === 'string' && from.startsWith('/')) navigate(from);
    else if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(TEACHER_COURSES_PATH);
  };

  if (!available) {
    return (
      <div className="sa-page py-10">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center" data-memo-not-found>
          <ClipboardList className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
          <h1 className="font-space text-xl font-bold text-slate-800">{t('notFoundTitle')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('notFoundBody')}</p>
          <Link to={TEACHER_COURSES_PATH} className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800">{t('backToCourses')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-surface-plain sa-page sa-page--flush sa-memo py-4 sm:py-6" data-lesson-memo={lessonId}>
      {/* La barre collante : retour, où l'on est, et les deux gestes de la séance. */}
      <div className="sa-memo-toolbar sticky top-14 z-30 -mx-4 mb-5 border-b border-slate-200 bg-[#FAFAFA]/95 px-4 py-2 backdrop-blur lg:top-0 sm:mx-0 sm:rounded-b-2xl" data-memo-toolbar>
        <div className="flex items-center gap-2">
          <button type="button" onClick={goBack} aria-label={t('backAria')} className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" data-memo-back>
            <ArrowBack className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{t('back')}</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-teal-700">{t('title')}</p>
            <p className="truncate text-sm font-bold text-slate-900"><MathLabel>{lesson.title}</MathLabel></p>
          </div>
          <a href="#memo-notes" className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-900 hover:border-amber-300" title={t('notes.title')}>
            <NotebookPen className="h-4 w-4" aria-hidden="true" /> <span className="hidden md:inline">{t('notesJump')}</span>
          </a>
          <button type="button" onClick={() => window.print()} aria-label={t('printAria')} title={t('print')} className="hidden min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-slate-300 sm:inline-flex">
            <Printer className="h-4 w-4" aria-hidden="true" /> <span className="hidden lg:inline">{t('print')}</span>
          </button>
          <Link to={lesson.path} className="hidden min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-slate-300 md:inline-flex">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> <span className="hidden xl:inline">{t('openLesson')}</span>
          </Link>
          <Link to={lesson.path} state={CLASSROOM_START_STATE} aria-label={t('classroomAria')} className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-indigo-700 bg-indigo-600 px-3 text-sm font-extrabold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" data-memo-classroom>
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{t('classroom')}</span>
          </Link>
        </div>
        {memo && (
          <nav aria-label={t('nav.label')} className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectionsOf(memo).map((key) => (
              <a key={key} href={`#memo-${key}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 hover:border-teal-300 hover:text-teal-800">{t(`nav.${key}`)}</a>
            ))}
          </nav>
        )}
      </div>

      {error && <ErrorBox message={t('loadError')} onRetry={() => { setError(false); loadLessonMemoSources(lessonId).then(setSources, () => setError(true)); }} />}
      {!memo && !error && <Loading label={t('loading')} />}

      {memo && (
        <div className="space-y-5">
          <MemoOverview header={memo.header} />
          <MemoObjectives objectives={memo.objectives} prerequisites={memo.prerequisites} />
          <MemoStart start={memo.start} />
          <MemoTimeline phases={memo.phases} />
          <MemoExamples examples={memo.examples} />
          <MemoErrors errors={memo.errors} />
          <MemoDifferentiation differentiation={memo.differentiation} />
          <MemoTrace trace={memo.trace} />
          <MemoEvaluation evaluation={memo.evaluation} />
          <MemoNext next={memo.next} />
          <MemoNotes lessonId={lessonId} />
          <p className="px-2 pb-6 text-center text-xs text-slate-400">{t('derivedNote')}</p>
        </div>
      )}
    </div>
  );
}
