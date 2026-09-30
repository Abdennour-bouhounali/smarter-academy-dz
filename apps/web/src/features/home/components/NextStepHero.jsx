import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Play, Sparkles, Trophy, Compass, BookOpen, GraduationCap } from 'lucide-react';
import { ArrowForward } from '../../../components/common/DirectionalIcons';
import { MASTERY_STATES } from '../../../lessons/common/components/LearningPointMastery';
import { bidi } from '../../../utils/bidi';

/**
 * « 🎯 خطوتك التالية » — LE héros de l'accueil, l'élément qui répond à
 * « que dois-je faire maintenant ? ». Une seule carte, une seule action.
 *
 * Le CHOIX de ce qu'elle montre n'est pas fait ici mais dans
 * pickHomeNextStep.js (règle déterministe, testée) ; ce composant ne fait
 * que RENDRE l'une des formes :
 *
 *   continue / next  — une leçon à reprendre (ou la suivante, à 0 %)
 *   mastery          — une compétence réelle à retravailler
 *   start            — la première leçon de la classe
 *   done             — tout est terminé
 *   empty            — rien n'est disponible pour cette classe
 *   loading          — on attend le profil avant de trancher
 *
 * Toutes les données viennent du catalogue et de la progression réelle :
 * aucun titre, aucun pourcentage n'est écrit ici.
 */
const TONE = {
  blue: {
    line: 'from-blue-500 to-purple-500',
    glow: 'bg-blue-200/50',
    tile: 'bg-blue-50 text-blue-600 ring-blue-100',
    eyebrow: 'text-blue-600',
    cta: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    bar: 'bg-blue-500',
  },
  emerald: {
    line: 'from-emerald-500 to-teal-500',
    glow: 'bg-emerald-200/50',
    tile: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    eyebrow: 'text-emerald-600',
    cta: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
    bar: 'bg-emerald-500',
  },
  rose: {
    line: 'from-rose-500 to-amber-400',
    glow: 'bg-rose-200/50',
    tile: 'bg-rose-50 text-rose-600 ring-rose-100',
    eyebrow: 'text-rose-600',
    cta: 'bg-slate-900 hover:bg-slate-800 focus-visible:ring-blue-500',
    bar: 'bg-rose-500',
  },
  slate: {
    line: 'from-slate-300 to-slate-200',
    glow: 'bg-slate-200/60',
    tile: 'bg-slate-100 text-slate-500 ring-slate-200',
    eyebrow: 'text-slate-500',
    cta: 'bg-slate-900 hover:bg-slate-800 focus-visible:ring-blue-500',
    bar: 'bg-slate-400',
  },
};

const PILL = {
  gap: 'bg-rose-100 text-rose-800',
  reinforce: 'bg-amber-100 text-amber-800',
};

function Cta({ to, icon: Icon, label, tone }) {
  return (
    <Link
      to={to}
      data-home-cta
      className={`group inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl font-space font-bold text-base text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full sm:w-auto ${tone.cta}`}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {label}
      <ArrowForward size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1" />
    </Link>
  );
}

function ProgressBlock({ percent, tone, label, aria }) {
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
  return (
    <div className="mt-6" data-home-hero-progress>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="font-inter text-xs font-semibold text-slate-500">{label}</span>
        <span dir="ltr" className="font-space font-black text-2xl leading-none text-slate-900 tabular-nums" aria-hidden="true">{p}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={aria}
        className="h-2.5 rounded-full bg-slate-100 overflow-hidden"
      >
        {/* scaleX (une transformation) plutôt que width : Framer la coupe
            sous prefers-reduced-motion, l'état final reste identique. */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ width: `${p}%` }}
          className={`h-full rounded-full origin-left rtl:origin-right ${tone.bar}`}
        />
      </div>
    </div>
  );
}

function Shell({ tone, kind, children }) {
  return (
    <section
      aria-labelledby="home-next-step-title"
      data-home-hero
      data-kind={kind}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-32px_rgba(59,130,246,0.35)]"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.line}`} aria-hidden="true" />
      <div className={`pointer-events-none absolute -top-20 -end-20 h-56 w-56 rounded-full blur-3xl ${tone.glow}`} aria-hidden="true" />
      <div className="relative p-6 sm:p-8 lg:p-10">{children}</div>
    </section>
  );
}

function Eyebrow({ icon: Icon, tone, children }) {
  return (
    <p className={`font-mono-jetbrains text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 ${tone.eyebrow}`}>
      <Icon size={13} aria-hidden="true" /> {children}
    </p>
  );
}

function IconTile({ tone, children }) {
  return (
    <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-1 flex items-center justify-center text-4xl sm:text-5xl leading-none ${tone.tile}`} aria-hidden="true">
      {children}
    </div>
  );
}

function Skeleton() {
  const b = 'rounded-full bg-slate-200/70 animate-pulse motion-reduce:animate-none';
  return (
    <div data-home-hero data-kind="loading" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10" aria-hidden="true">
      <span className={`block h-3.5 w-32 ${b}`} />
      <div className="mt-6 flex items-start gap-5">
        <span className="block w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/70 animate-pulse motion-reduce:animate-none flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <span className={`block h-3.5 w-24 ${b}`} />
          <span className={`block h-7 w-3/4 ${b}`} />
          <span className={`block h-3.5 w-1/2 ${b}`} />
        </div>
      </div>
      <span className={`block h-2.5 w-full mt-8 ${b}`} />
      <span className="block h-12 w-full sm:w-40 mt-7 rounded-xl bg-slate-200/70 animate-pulse motion-reduce:animate-none sm:ms-auto" />
    </div>
  );
}

export default function NextStepHero({ step, gradeId, curriculumIndex }) {
  const { t } = useTranslation('student');

  if (step.kind === 'loading') {
    return (
      <>
        <Skeleton />
        <p className="sr-only" role="status">{t('home.heroLoading')}</p>
      </>
    );
  }

  if (step.kind === 'continue' || step.kind === 'next') {
    const { resume } = step;
    const tone = TONE.blue;
    const ctx = curriculumIndex.get(resume.course.id);
    const contextLine = [ctx?.unit?.title || ctx?.field?.title || resume.chapter?.title].filter(Boolean).join('');
    const otherGrade = gradeId && resume.grade?.id && resume.grade.id !== gradeId ? resume.grade.name : null;
    const isNext = step.kind === 'next';
    return (
      <Shell tone={tone} kind={step.kind}>
        <Eyebrow icon={Target} tone={tone}>{t('home.nextStep')}</Eyebrow>
        <div className="mt-5 flex items-start gap-4 sm:gap-5">
          <IconTile tone={tone}>{resume.course.icon}</IconTile>
          <div className="flex-1 min-w-0">
            <p className="font-inter text-slate-500 text-sm">{isNext ? t('home.heroNextLead') : t('home.heroContinueLead')}</p>
            <h2 id="home-next-step-title" className="font-space font-bold text-slate-900 text-2xl sm:text-3xl leading-tight mt-1 text-balance">
              {bidi(resume.course.title)}
            </h2>
            {(contextLine || otherGrade) && (
              <p className="font-inter text-slate-500 text-sm mt-2 flex items-center gap-2 flex-wrap">
                {contextLine && <span className="min-w-0">{contextLine}</span>}
                {otherGrade && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-mono-jetbrains font-bold" data-home-other-grade>
                    <GraduationCap size={12} aria-hidden="true" /> {t('home.fromOtherGrade', { grade: otherGrade })}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <ProgressBlock percent={resume.progress} tone={tone} label={t('home.yourProgress')} aria={t('home.whereProgressAria', { percent: Math.round(resume.progress) })} />
        <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-mono-jetbrains text-xs text-slate-500">
            {t('home.moduleOf', { current: resume.resumeModule, total: resume.totalModules })}
          </p>
          <Cta to={resume.resumePath} icon={Play} label={isNext ? t('home.start') : t('home.continue')} tone={tone} />
        </div>
      </Shell>
    );
  }

  if (step.kind === 'mastery') {
    const { point, lesson, group } = step.item;
    const tone = TONE.rose;
    const state = MASTERY_STATES[point.state];
    return (
      <Shell tone={tone} kind="mastery">
        <Eyebrow icon={Target} tone={tone}>{t('home.nextStep')}</Eyebrow>
        <div className="mt-5 flex items-start gap-4 sm:gap-5">
          <IconTile tone={tone}>{lesson.lesson.icon}</IconTile>
          <div className="flex-1 min-w-0">
            <p className="font-inter text-slate-500 text-sm">{t('home.heroMasteryLead')}</p>
            <h2 id="home-next-step-title" className="font-space font-bold text-slate-900 text-2xl sm:text-3xl leading-tight mt-1 text-balance">
              {bidi(point.title)}
            </h2>
            <p className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono-jetbrains text-xs font-bold ${PILL[point.state]}`} data-state={point.state}>
                <span aria-hidden="true">{state.emoji}</span> {t(state.labelKey)}
              </span>
            </p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2 min-w-0">
            <dt className="text-slate-400 font-mono-jetbrains text-xs flex-shrink-0 pt-0.5">{t('progression.workNow.lesson')}</dt>
            <dd className="font-semibold text-slate-800 truncate">{bidi(lesson.lesson.title)}</dd>
          </div>
          {group.kind === 'unit' && (
            <div className="flex gap-2 min-w-0">
              <dt className="text-slate-400 font-mono-jetbrains text-xs flex-shrink-0 pt-0.5">{t('progression.workNow.unit')}</dt>
              <dd className="text-slate-700 truncate">{bidi(group.title)}</dd>
            </div>
          )}
        </dl>
        <div className="mt-7 flex sm:justify-end">
          <Cta to={lesson.lesson.path} icon={BookOpen} label={t('home.reviewLesson')} tone={tone} />
        </div>
      </Shell>
    );
  }

  if (step.kind === 'start') {
    const { lesson } = step.entry;
    const tone = TONE.emerald;
    const ctx = curriculumIndex.get(lesson.id);
    const contextLine = ctx?.unit?.title || ctx?.field?.title || null;
    return (
      <Shell tone={tone} kind="start">
        <Eyebrow icon={Sparkles} tone={tone}>{t('home.heroStartEyebrow')}</Eyebrow>
        <div className="mt-5 flex items-start gap-4 sm:gap-5">
          <IconTile tone={tone}>{lesson.icon}</IconTile>
          <div className="flex-1 min-w-0">
            <p className="font-inter text-slate-500 text-sm">{t('home.heroStartLead')}</p>
            <h2 id="home-next-step-title" className="font-space font-bold text-slate-900 text-2xl sm:text-3xl leading-tight mt-1 text-balance">
              {bidi(lesson.title)}
            </h2>
            {contextLine && <p className="font-inter text-slate-500 text-sm mt-2">{contextLine}</p>}
          </div>
        </div>
        {lesson.description && (
          <p className="font-inter text-slate-600 text-sm sm:text-base leading-relaxed mt-6 max-w-2xl line-clamp-3">{bidi(lesson.description)}</p>
        )}
        <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-inter text-xs text-slate-500">{t('home.heroStartHint')}</p>
          <Cta to={lesson.path} icon={Play} label={t('home.start')} tone={tone} />
        </div>
      </Shell>
    );
  }

  if (step.kind === 'done') {
    const tone = TONE.emerald;
    return (
      <Shell tone={tone} kind="done">
        <Eyebrow icon={Target} tone={tone}>{t('home.nextStep')}</Eyebrow>
        <div className="mt-5 flex items-start gap-4 sm:gap-5">
          <IconTile tone={tone}><Trophy size={34} /></IconTile>
          <div className="flex-1 min-w-0">
            <h2 id="home-next-step-title" className="font-space font-bold text-slate-900 text-2xl sm:text-3xl leading-tight text-balance">
              {t('home.heroDoneTitle')}
            </h2>
            <p className="font-inter text-slate-600 text-sm sm:text-base mt-2 max-w-xl">{t('home.heroDoneBody')}</p>
          </div>
        </div>
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Link
            to="/espace/explorer"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Compass size={15} aria-hidden="true" /> {t('home.exploreOtherGrades')}
          </Link>
          <Cta to="/espace/progression" label={t('home.seeProgression')} tone={tone} />
        </div>
      </Shell>
    );
  }

  // empty — rien n'est disponible pour cette classe : on le dit, sans
  // barre à 0 % ni chiffre inventé.
  const tone = TONE.slate;
  return (
    <Shell tone={tone} kind="empty">
      <Eyebrow icon={Target} tone={tone}>{t('home.nextStep')}</Eyebrow>
      <div className="mt-5 flex items-start gap-4 sm:gap-5">
        <IconTile tone={tone}><BookOpen size={32} /></IconTile>
        <div className="flex-1 min-w-0">
          <h2 id="home-next-step-title" className="font-space font-bold text-slate-900 text-2xl sm:text-3xl leading-tight text-balance">
            {t('home.heroEmptyTitle')}
          </h2>
          <p className="font-inter text-slate-600 text-sm sm:text-base mt-2 max-w-xl">{t('home.heroEmptyBody')}</p>
        </div>
      </div>
      <div className="mt-7 flex sm:justify-end">
        <Cta to="/espace/explorer" icon={Compass} label={t('home.exploreOtherGrades')} tone={tone} />
      </div>
    </Shell>
  );
}
