import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, Lock, Crown, EyeOff } from 'lucide-react';
import { ArrowForward } from '../common/DirectionalIcons';
import MathLabel from '../../lessons/common/components/MathLabel';
import PublicationBadge from '../content/PublicationBadge';
import { useLessonTileState } from './useLessonTileState';

/**
 * La LIGNE d'une leçon — le dessin compact de `LessonCard`, pour la
 * disposition « قائمة » du catalogue (catalogueView.js). Mêmes quatre états
 * que la carte (masquée par l'enseignant, verrouillée, ouverte, bientôt),
 * lus par le même `useLessonTileState` : la ligne ne décide rien que la
 * carte ne décide pas.
 *
 * Une ligne tient sur un écran de téléphone : icône, titre, état, flèche ;
 * la description et la durée n'apparaissent qu'à partir de `sm`.
 */
const LessonRow = forwardRef(function LessonRow({ lesson, onClick, eyebrow = null }, ref) {
  const { t } = useTranslation('common');
  const { state, isPremiumLesson, progressPercent, publication } = useLessonTileState(lesson);

  const motionProps = {
    ref,
    layout: true,
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  };

  const body = (badge, cta, { muted = false } = {}) => (
    <>
      <span className={`text-2xl shrink-0 ${muted ? 'grayscale opacity-50' : ''}`} aria-hidden="true">{lesson.icon}</span>
      <div className="min-w-0 flex-1">
        {eyebrow && <div className="text-[11px] font-semibold text-indigo-600">{eyebrow}</div>}
        <div className="flex items-center gap-2">
          <h4 className={`truncate font-space font-bold text-[15px] ${muted ? 'text-slate-600' : 'text-slate-900'}`}>
            <MathLabel>{lesson.title}</MathLabel>
          </h4>
          <PublicationBadge status={publication} />
        </div>
        {lesson.description && (
          <p className="hidden sm:block truncate font-inter text-xs text-slate-500"><MathLabel>{lesson.description}</MathLabel></p>
        )}
      </div>
      {badge}
      <span className="hidden sm:flex shrink-0 items-center gap-1 text-xs font-mono-jetbrains text-slate-400"><Clock size={13} aria-hidden="true" /> <span dir="ltr">{lesson.duration}</span></span>
      {cta}
    </>
  );

  const rowClass = 'relative flex items-center gap-3 rounded-xl border px-3 py-2.5 sm:px-4 overflow-hidden';

  if (state === 'hidden') {
    return (
      <motion.div {...motionProps} className={`${rowClass} bg-teal-50/40 border-teal-200/60`} data-hidden-by-teacher={lesson.id} data-lesson-row={lesson.id}>
        {body(
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 font-mono-jetbrains text-[10px] font-semibold text-teal-800" title={t('hiddenByTeacherHint', { ns: 'access' })}>
            <EyeOff size={10} aria-hidden="true" /> {t('hiddenByTeacherBadge', { ns: 'access' })}
          </span>,
          null,
          { muted: true },
        )}
      </motion.div>
    );
  }

  if (state === 'locked') {
    return (
      <motion.div {...motionProps}>
        <Link to="/espace/activation" className={`sa-premium-card-locked group ${rowClass} hover:shadow-sm transition-shadow`} data-lesson-row={lesson.id}>
          {body(
            <span className="sa-premium-badge shrink-0"><Lock size={10} aria-hidden="true" /> {t('premiumBadge')}</span>,
            <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-violet-700 transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1">
              <span className="hidden md:inline">{t('lockedCta', { ns: 'access' })}</span> <ArrowForward size={14} />
            </span>,
          )}
        </Link>
      </motion.div>
    );
  }

  if (state === 'open') {
    const ctaLabel = progressPercent >= 100 ? t('lessonDone') : progressPercent > 0 ? t('lessonContinue') : t('lessonStart');
    const ctaColor = progressPercent >= 100 ? 'text-emerald-600' : progressPercent > 0 ? 'text-blue-600' : isPremiumLesson ? 'text-violet-700' : 'text-blue-600';
    return (
      <motion.div {...motionProps}>
        <Link
          to={lesson.path}
          onClick={onClick}
          aria-label={`${lesson.title} — ${ctaLabel}`}
          className={`group ${rowClass} bg-white hover:shadow-sm transition-all ${isPremiumLesson ? 'sa-premium-card' : 'border-slate-200 hover:border-blue-300'}`}
          data-lesson-row={lesson.id}
        >
          {body(
            progressPercent > 0 ? (
              <span dir="ltr" className={`shrink-0 rounded-full px-2 py-0.5 font-mono-jetbrains text-[10px] font-bold ${progressPercent >= 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                {progressPercent >= 100 ? '✓ ' : ''}{progressPercent}%
              </span>
            ) : isPremiumLesson ? (
              <span className="sa-premium-badge shrink-0" title={t('premiumHasAccess')}><Crown size={10} aria-hidden="true" /> {t('premiumBadge')}</span>
            ) : (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" title={t('freeBadge', { ns: 'access' })} />
            ),
            <span className={`flex shrink-0 items-center gap-1 text-sm font-bold transition-transform group-hover:translate-x-1 group-hover:rtl:-translate-x-1 ${ctaColor}`}>
              <span className="hidden md:inline">{ctaLabel}</span> <ArrowForward size={14} />
            </span>,
          )}
          {progressPercent > 0 && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-100" aria-hidden="true">
              <span className={`block h-full ${progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progressPercent}%` }} />
            </span>
          )}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps} className={`${rowClass} bg-slate-50/50 border-slate-200/50 opacity-75`} data-lesson-row={lesson.id}>
      {body(
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-200/50 px-2 py-0.5 font-mono-jetbrains text-[10px] font-semibold text-slate-500">
          <Lock size={10} aria-hidden="true" /> {t('lessonComingSoonBadge')}
        </span>,
        null,
        { muted: true },
      )}
    </motion.div>
  );
});

export default LessonRow;
