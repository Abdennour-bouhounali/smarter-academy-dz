import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Compass, Layers, Wand2, ListChecks, Landmark } from 'lucide-react';
import { getUnitById, getLessonById, formatTextbookPages } from '@smarter-academy/core';
import { getLessonProgress } from '../lessons/common/utils/progress/getLessonProgress';
import { getTotalModules, getLessonConfig } from '../lessons/registry';
import { useLearningProfile } from '../lessons/common/hooks/useLearningProfile';
import { useLessonChromeLayout } from '../lessons/common/hooks/useLessonChrome';
import { resolveMasteryState, masteryTooltip } from '../lessons/common/components/LearningPointMastery';
import { useContentAvailability } from '../context/ContentAvailabilityContext';
import { ArrowForward } from '../components/common/DirectionalIcons';
import { usePrefetchLessonRuntime } from '../lessons/common/lessonRuntimeLoader';
import { useLearningViewer } from '../features/learning/learningViewer';
import { LessonModuleChips, TeacherLessonActions } from '../components/teacher/TeacherLessonActions';
import MathLabel from '../lessons/common/components/MathLabel';
import UnitOpenerFigure from './unit/UnitOpenerFigure';

/**
 * La page d'une UNITÉ du manuel (الوحدة) — le niveau entre le ميدان et le درس.
 *
 * Elle montre ce que le manuel place en tête d'unité (les objectifs
 * « سأتعلّم في هذا الباب », le défi « تحدّ », l'aparté historique), puis les
 * leçons DANS L'ORDRE DU MANUEL, chacune avec : sa progression, ses points
 * d'apprentissage et leur état de maîtrise (profil serveur), ses prérequis
 * PÉDAGOGIQUES (affichés, jamais bloquants), ses manipulations et méthodes ;
 * enfin la synthèse « أدمج تعلّماتي », à part, jamais comptée comme un درس.
 *
 * Tout vient du catalogue (packages/core) et des lesson.config.js (registre) :
 * la page n'écrit aucun contenu pédagogique.
 */
const MASTERY_DOT = { unassessed: 'bg-slate-300', gap: 'bg-rose-500', reinforce: 'bg-amber-400', mastered: 'bg-emerald-500' };

function masteryIndex(profile) {
  // Le profil est imbriqué par classe puis par leçon (cf. findLessonMasteryRows) ; on l'aplatit par code de point.
  const rows = [];
  for (const g of profile?.currentMastery ?? []) for (const l of g.lessons ?? []) for (const lp of l.learningPoints ?? []) rows.push(lp);
  const map = new Map();
  for (const row of rows) {
    const code = row.code ?? row.learningPointCode ?? row.learning_point_code;
    if (code) map.set(code, row);
  }
  return map;
}

function LessonBlock({ lesson, index, mastery, t }) {
  const { isLessonClosed, isLessonHiddenByClass } = useContentAvailability();
  // L'enseignant voit, sur chaque leçon de l'unité, ses محاور et ses deux
  // gestes (مذكرة الدرس · وضع القسم). Le catalogue reste au niveau de la
  // وحدة ; c'est ici, une fois l'unité ouverte, qu'il choisit une leçon.
  const { isTeacher } = useLearningViewer();
  // Masquée par l'enseignant : traitée comme indisponible pour l'élève de
  // cette classe, sans toucher à la publication.
  const available = lesson.status === 'available' && !isLessonClosed(lesson.id) && !isLessonHiddenByClass(lesson.id);
  const total = getTotalModules(lesson.id);
  const { progressPercent } = available ? getLessonProgress(lesson.id, total) : { progressPercent: 0 };
  const config = getLessonConfig(lesson.id);
  const resources = config?.resources ?? [];
  const manipulations = resources.filter((r) => r.kind === 'manipulation');
  const methods = resources.filter((r) => r.kind === 'method');
  const prereqLessons = (lesson.prerequisiteLessonCodes ?? []).map((code) => getLessonById(code)).filter(Boolean);
  const isSynthesis = lesson.kind === 'synthesis';
  const mastered = lesson.learningPoints.filter((lp) => resolveMasteryState(mastery.get(lp.id)) === 'mastered').length;
  const textbookPages = formatTextbookPages(lesson.textbookRef?.pages);

  return (
    <article className={`rounded-3xl border-2 bg-white p-5 sm:p-6 space-y-4 ${isSynthesis ? 'border-amber-300' : 'border-slate-200'}`} data-unit-lesson={lesson.id}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${isSynthesis ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`} aria-hidden="true">
            {isSynthesis ? <Landmark className="h-5 w-5" /> : index}
          </span>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{isSynthesis ? t('unit.synthesisTag') : t('unit.lessonTag', { n: index })}</div>
            <h3 className="text-lg font-bold text-slate-900"><MathLabel>{lesson.title}</MathLabel></h3>
            <p className="mt-1 text-sm text-slate-600"><MathLabel>{lesson.description}</MathLabel></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
          <span dir="ltr" className={`rounded-full px-2.5 py-1 font-mono font-bold ${progressPercent >= 100 ? 'bg-emerald-50 text-emerald-700' : progressPercent > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{progressPercent}%</span>
          <span>{lesson.duration}</span>
          {lesson.learningPoints.length > 0 && <span dir="ltr">{mastered}/{lesson.learningPoints.length} ✓</span>}
        </div>
      </header>

      {isTeacher && <LessonModuleChips lessonId={lesson.id} />}

      <div className="grid gap-4 md:grid-cols-2">
        <section>
          <h4 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-800"><ListChecks className="h-4 w-4" aria-hidden="true" /> {t('unit.learningPoints')}</h4>
          <ul className="space-y-1">
            {lesson.learningPoints.map((lp) => {
              const row = mastery.get(lp.id);
              const state = resolveMasteryState(row);
              // UN seul vocabulaire (`mastery.*`) ; le tooltip ajoute la raison
              // (`statusReason`) et la fraîcheur d'un acquis qui vieillit.
              const tooltip = masteryTooltip(state, row, t);
              return (
                <li key={lp.id} className="flex items-start gap-2 text-sm text-slate-700" title={tooltip}>
                  <span className={`mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${MASTERY_DOT[state]}`} aria-label={tooltip} data-mastery-state={state} />
                  <span><MathLabel>{lp.title}</MathLabel></span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="space-y-3">
          {(prereqLessons.length > 0 || (lesson.prerequisites ?? []).length > 0) && (
            <div>
              <h4 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-800"><Compass className="h-4 w-4" aria-hidden="true" /> {t('unit.prerequisites')}</h4>
              <ul className="flex flex-wrap gap-1.5">
                {prereqLessons.map((p) => (
                  <li key={p.id}><Link to={p.path} className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-800 hover:border-indigo-400"><MathLabel>{p.title}</MathLabel></Link></li>
                ))}
                {(lesson.prerequisites ?? []).map((txt) => (
                  <li key={txt} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"><MathLabel>{txt}</MathLabel></li>
                ))}
              </ul>
              <p className="mt-1 text-[11px] text-slate-500">{t('unit.prerequisitesNote')}</p>
            </div>
          )}
          {(manipulations.length > 0 || methods.length > 0) && (
            <div>
              <h4 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-800"><Wand2 className="h-4 w-4" aria-hidden="true" /> {t('unit.manipulationsAndMethods')}</h4>
              <ul className="flex flex-wrap gap-1.5">
                {manipulations.map((r) => <li key={r.code} className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs text-violet-800">🧪 <MathLabel>{r.title}</MathLabel></li>)}
                {methods.map((r) => <li key={r.code} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-800">📐 <MathLabel>{r.title}</MathLabel></li>)}
              </ul>
            </div>
          )}
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          {config ? t('unit.modulesCount', { count: total ?? 0 }) : t('unit.comingSoon')}
          {/* `pages` est une carte section → page(s), pas un nombre : sans
              mise en forme, « الكتاب ص {{pages}} » rendait « [object Object] ». */}
          {textbookPages && <> · {t('unit.textbookPages', { pages: textbookPages })}</>}
        </span>
        {available && isTeacher && config && (
          <div className="flex flex-wrap items-center gap-2">
            <TeacherLessonActions lesson={lesson} />
            <Link to={lesson.path} className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:text-teal-700">
              {t('unit.start')} <ArrowForward className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
        {available && !(isTeacher && config) && (
          <Link to={lesson.path} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            {progressPercent > 0 ? t('unit.continue') : t('unit.start')} <ArrowForward className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </footer>
    </article>
  );
}

export default function UnitPage() {
  // Cette page mène à des leçons : leur runtime partagé arrive pendant
  // l'inactivité, le clic ne l'attend pas (lessonRuntimeLoader.js).
  usePrefetchLessonRuntime();
  const { t } = useTranslation('student');
  const { levelId, gradeId, chapterId, unitId } = useParams();
  const unit = getUnitById(unitId);
  // Le profil de CETTE unité seulement (`?unit=`, Mastery V2).
  const { profile } = useLearningProfile({ unit: unitId });
  // Même contrat de décalage haut que le sommaire et les modules de leçon.
  const chrome = useLessonChromeLayout();
  const mastery = useMemo(() => masteryIndex(profile), [profile]);

  if (!unit || unit.levelId !== levelId || unit.gradeId !== gradeId || unit.chapterId !== chapterId) return <Navigate to="/courses" replace />;

  const lessons = unit.lessons;
  const done = lessons.filter((l) => l.status === 'available' && getLessonProgress(l.id, getTotalModules(l.id)).progressPercent >= 100).length;

  return (
    <div className={`min-h-screen bg-slate-50 ${chrome.contentOffsetClass}`}>
      <main className="sa-page space-y-8 py-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500" aria-label={t('unit.breadcrumb')}>
          <Link to="/courses" className="hover:text-blue-600">{t('unit.home')}</Link><span>/</span>
          <Link to={`/courses?level=${levelId}&grade=${gradeId}`} className="hover:text-blue-600">{unit.gradeName}</Link><span>/</span>
          <Link to={`/courses?level=${levelId}&grade=${gradeId}&chapter=${chapterId}`} className="hover:text-blue-600">{unit.chapterTitle}</Link><span>/</span>
          <span className="font-semibold text-slate-900"><MathLabel>{unit.title}</MathLabel></span>
        </nav>

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" data-unit={unit.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" /> {t('unit.unitNumber', { n: unit.number })}
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"><MathLabel>{unit.title}</MathLabel></h1>
              {unit.subtitle && <p className="max-w-2xl text-slate-600">{unit.subtitle}</p>}
              {unit.textbook && <p className="flex items-center gap-1.5 text-xs text-slate-500"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {t('unit.textbookRef', { title: unit.textbook.title, unit: unit.textbook.unit, pages: formatTextbookPages(unit.textbook.pages) })}</p>}
            </div>
            <div className="w-full shrink-0 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center md:w-52">
              <div className="text-xs font-mono font-bold uppercase text-slate-500">{t('unit.progress')}</div>
              <div dir="ltr" className="text-3xl font-extrabold text-blue-600">{done} / {lessons.length}</div>
              <div className="text-xs text-slate-500">{t('unit.lessonsDone')}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/60 p-4">
              <h2 className="mb-2 text-sm font-bold text-orange-900">📌 {t('unit.objectives')}</h2>
              <ul className="space-y-1 text-sm text-slate-800">{unit.objectives.map((o) => <li key={o}>• <MathLabel>{o}</MathLabel></li>)}</ul>
            </div>
            {unit.challenge?.textAr && (
              <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-4" data-unit-challenge>
                <h2 className="mb-2 text-sm font-bold text-rose-900">🏁 {unit.challenge.titleAr ?? t('unit.challenge')}</h2>
                <p className="text-sm leading-relaxed text-slate-800"><MathLabel>{unit.challenge.textAr}</MathLabel></p>
                <UnitOpenerFigure code={unit.id} slot="challenge" />
                <p className="mt-2 text-[11px] text-slate-500">{t('unit.challengeNote')}</p>
              </div>
            )}
          </div>
          {unit.aside?.textAr && (
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <summary className="cursor-pointer font-bold text-slate-800">{unit.aside.titleAr} — {unit.aside.captionAr}</summary>
              <p className="mt-2 leading-relaxed"><MathLabel>{unit.aside.textAr}</MathLabel></p>
              <UnitOpenerFigure code={unit.id} slot="aside" />
            </details>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{t('unit.lessons', { count: lessons.length })}</h2>
          <div className="space-y-4">
            {lessons.map((lesson, i) => <LessonBlock key={lesson.id} lesson={lesson} index={i + 1} mastery={mastery} t={t} />)}
          </div>
        </section>

        {unit.synthesis && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">{t('unit.synthesisTitle')}</h2>
            <LessonBlock lesson={unit.synthesis} index={lessons.length + 1} mastery={mastery} t={t} />
          </section>
        )}
      </main>
    </div>
  );
}
