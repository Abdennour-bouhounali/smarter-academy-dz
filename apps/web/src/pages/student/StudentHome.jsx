import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, MotionConfig } from 'framer-motion';
import { Compass } from 'lucide-react';
import { courseLevels, getAllGrades } from '@smarter-academy/core';
import { ArrowForward } from '../../components/common/DirectionalIcons';
import { AuthContext } from '../../context/AuthContext';
import { getResumeLesson } from '../../lessons/common/utils/progress/getResumeLesson';
import { getStudentActivity } from '../../lessons/common/utils/progress/getStudentActivity';
import { getModulePath } from '../../lessons/registry';
import { LESSON_PROGRESS_SYNCED_EVENT } from '../../hooks/useLessonProgressSync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { useContentAvailability } from '../../context/ContentAvailabilityContext';
import { useLearningProfile } from '../../lessons/common/hooks/useLearningProfile';
import { getDisplayName } from '../../utils/userDisplay';
import DiagnosticInviteBanner from '../../components/diagnostic/DiagnosticInviteBanner';
import { buildProgressionTree } from '../../features/progression/buildProgressionTree';
import { pickWorkNow } from '../../features/progression/pickWorkNow';
import { pickHomeNextStep } from '../../features/home/pickHomeNextStep';
import { pickCurriculumContext, indexTreeByLesson, indexCurriculum } from '../../features/home/curriculumContext';
import HomeGreeting from '../../features/home/components/HomeGreeting';
import NextStepHero from '../../features/home/components/NextStepHero';
import JourneyStats from '../../features/home/components/JourneyStats';
import CurriculumPreview from '../../features/home/components/CurriculumPreview';
import RecentLearning from '../../features/home/components/RecentLearning';
import LearningSpaceNav from '../../features/home/components/LearningSpaceNav';
import PremiumCard from '../../features/home/components/PremiumCard';
import ClassContextBanner from '../../features/home/components/ClassContextBanner';
import DailyChallengeCard from '../../features/home/components/DailyChallengeCard';
import MushafVerse from '../../features/islamic/MushafVerse';
import { HOME_VERSE } from '../../features/islamic/content/mushaf';
import { usePrefetchLessonRuntime } from '../../lessons/common/lessonRuntimeLoader';

/**
 * « 🏠 فضائي » — l'ACCUEIL de l'espace élève, qui répond à une seule
 * question : « que dois-je faire maintenant ? ». Dans l'ordre de lecture :
 *
 *   qui je suis, où je suis     → salutation + classe
 *                                 + « ٱقْرَأْ » (العلق 1), en mise en page مصحف
 *   ce qu'on me propose         → bilan diagnostique (quand il y en a un)
 *   ████ ce que je fais LÀ ████ → le héros « خطوتك التالية »
 *   comment j'avance            → quatre repères
 *   où j'en suis du programme   → الميدان ← الوحدة ← الدرس, une tranche
 *   ce que je viens de toucher  → trois leçons récentes
 *   mes autres espaces          → دروسي · تقدّمي · كرّاسي
 *   le reste                    → premium, autres classes
 *
 * La page N'INVENTE rien et ne DUPLIQUE rien : la reprise vient de
 * getResumeLesson (toutes classes, ARCHITECTURE.md §10 — le cadre courant
 * est annoncé en tête et sur la carte quand il diffère), l'activité de
 * getStudentActivity cadrée sur la classe (même cadrage que « تقدّمي »,
 * verrouillé par progressionGradeScope.test.js), la maîtrise du profil
 * serveur (useLearningProfile), l'arbre et « للعمل الآن » des mêmes modules
 * que la page de progression. Aucune requête nouvelle : le profil est la
 * seule donnée asynchrone, et tant qu'il n'est pas là la page le dit
 * (« — », squelette) au lieu d'afficher un zéro.
 */
export default function StudentHome() {
  // Cette page mène à des leçons : leur runtime partagé arrive pendant
  // l'inactivité, le clic ne l'attend pas (lessonRuntimeLoader.js).
  usePrefetchLessonRuntime();
  const { t } = useTranslation('student');
  const { t: tc } = useTranslation('common');
  useDocumentMeta(t('home.metaTitle'), t('home.metaDescription'));
  const { user } = useContext(AuthContext);
  const { isPremium, canSeeUpgrade } = usePremiumStatus();
  // Le palier vient du serveur (lessons.tier, décidé par l'administrateur) :
  // le catalogue embarqué n'en porte aucun.
  const { isLessonPremium } = useContentAvailability();

  // L'activité est lue dans le stockage local au montage. Deux moments la
  // rendent obsolète sans changer de classe : la fusion des lignes du
  // serveur (useLessonProgressSync, juste après le montage) et le retour sur
  // l'onglet après avoir travaillé une leçon. `tick` force le recalcul —
  // même réflexe que « تقدّمي ».
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    window.addEventListener(LESSON_PROGRESS_SYNCED_EVENT, bump);
    window.addEventListener('focus', bump);
    return () => {
      window.removeEventListener(LESSON_PROGRESS_SYNCED_EVENT, bump);
      window.removeEventListener('focus', bump);
    };
  }, []);

  const gradeId = user?.grade || null;
  const grade = useMemo(() => getAllGrades().find((g) => g.id === gradeId), [gradeId]);

  // Deliberately searches across all grades, matching getResumeLesson's
  // documented, considered behavior (ARCHITECTURE.md §10) — not re-scoped
  // to the student's current grade.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const continueCourse = useMemo(() => getResumeLesson(courseLevels), [tick]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gradeActivity = useMemo(() => getStudentActivity(courseLevels, { gradeId: user?.grade }), [user?.grade, tick]);

  // La maîtrise vient de l'API groupée par classe : on ne garde que la
  // sienne, sinon la tuile « كفاءات » compterait des acquis invisibles ici.
  const { profile, status, reload } = useLearningProfile();
  const currentMastery = useMemo(() => {
    const all = profile?.currentMastery || [];
    return gradeId ? all.filter((g) => g.grade === gradeId) : all;
  }, [profile, gradeId]);

  // Le MÊME arbre que « تقدّمي » (structure + progression + maîtrise). La
  // maîtrise n'y entre que quand le profil est prêt ; les pourcentages de
  // parcours, eux, ne dépendent pas de lui.
  const tree = useMemo(
    () => buildProgressionTree(courseLevels, gradeActivity, currentMastery, { gradeId, getModulePath }),
    [gradeActivity, currentMastery, gradeId],
  );
  const workItems = useMemo(
    () => (status === 'ready' ? pickWorkNow(tree, { limit: 1 }).items : []),
    [tree, status],
  );
  const nextStep = useMemo(
    () => pickHomeNextStep({ resume: continueCourse, workItems, profileStatus: status, lessons: gradeActivity.lessons }),
    [continueCourse, workItems, status, gradeActivity],
  );

  const curriculumIndex = useMemo(() => indexCurriculum(courseLevels), []);
  const treeIndex = useMemo(() => indexTreeByLesson(tree), [tree]);
  const focusLessonId =
    nextStep.kind === 'continue' || nextStep.kind === 'next' ? nextStep.resume.course.id
      : nextStep.kind === 'start' ? nextStep.entry.lesson.id
        : nextStep.kind === 'mastery' ? nextStep.item.lesson.id
          : null;
  const whereContext = useMemo(() => pickCurriculumContext(tree, focusLessonId), [tree, focusLessonId]);

  const recent = gradeActivity.recentlyActive.slice(0, 3);
  const premiumCount = gradeActivity.lessons.filter((l) => isLessonPremium(l.lesson.id)).length;

  const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <MotionConfig reducedMotion="user">
      {/* Même cadre que « تقدّمي » : `.sa-page`, sans colonne bornée. */}
      <div className="sa-page py-8 sm:py-10" aria-busy={status === 'loading'} data-student-home>
        <div>
          <motion.div {...enter(0)} className="mb-7 sm:mb-8">
            <HomeGreeting name={getDisplayName(user)} gradeName={grade?.name || null} />
            {/* La salutation, puis « ٱقْرَأْ » — le premier verset révélé, composé
                comme dans le مصحف (basmala, rasm ʿuthmānī, médaillon) : en
                code, jamais en image (features/islamic/MushafVerse.jsx). */}
            <div className="sa-islamic-surface mt-5 max-w-2xl rounded-2xl border border-emerald-100 px-4 py-4 sm:px-8" data-home-verse>
              <MushafVerse item={HOME_VERSE} />
            </div>
          </motion.div>

          {/* Le contexte d'étude : « tu es dans le قسم X avec l'enseignant Y ».
              Rien si l'élève étudie seul. */}
          <ClassContextBanner />

          <DiagnosticInviteBanner />

          {/* ── Le héros ─────────────────────────────────────────────── */}
          <motion.div {...enter(0.05)}>
            <NextStepHero step={nextStep} gradeId={gradeId} curriculumIndex={curriculumIndex} />
          </motion.div>

          {/* ── L'habitude du jour : « التحدّي اليومي » ─────────────────── */}
          <motion.div {...enter(0.08)}>
            <DailyChallengeCard />
          </motion.div>

          {/* ── Le profil n'a pas pu être chargé : on le dit, on ne met pas
                 zéro. La progression locale reste affichée. ─────────── */}
          {status === 'error' && (
            <div role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3 flex-wrap" data-home-error>
              <div className="min-w-0">
                <p className="font-space font-bold text-rose-900 text-sm">{t('home.masteryErrorTitle')}</p>
                <p className="font-inter text-rose-900/80 text-xs mt-0.5 max-w-xl">{t('home.masteryErrorBody')}</p>
              </div>
              <button
                type="button"
                onClick={reload}
                className="min-h-[44px] px-4 rounded-xl border-2 border-rose-200 bg-white text-xs font-mono-jetbrains font-bold text-rose-800 hover:border-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                🔄 {tc('retry')}
              </button>
            </div>
          )}

          {/* ── Les repères ──────────────────────────────────────────── */}
          <motion.div {...enter(0.1)} className="mt-8 sm:mt-10">
            <JourneyStats activity={gradeActivity} agg={tree.agg} profileStatus={status} />
          </motion.div>

          {/* ── Où j'en suis · ce que je viens de toucher ────────────── */}
          <motion.div {...enter(0.15)} className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <CurriculumPreview context={whereContext} />
            <RecentLearning items={recent} treeIndex={treeIndex} />
          </motion.div>

          {/* ── Mes espaces ──────────────────────────────────────────── */}
          <motion.div {...enter(0.2)} className="mt-10 sm:mt-12">
            <LearningSpaceNav />
          </motion.div>

          {/* ── Secondaire : premium, autres classes ─────────────────── */}
          <motion.div {...enter(0.25)} className="mt-8 sm:mt-10 space-y-6">
            <PremiumCard premiumCount={premiumCount} isPremium={isPremium} canSeeUpgrade={canSeeUpgrade} />
            <div className="text-center pt-2" data-home-explore>
              <Link
                to="/espace/explorer"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-white/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Compass size={15} aria-hidden="true" /> {t('home.exploreOtherGrades')} <ArrowForward size={14} aria-hidden="true" />
              </Link>
              <p className="font-inter text-xs text-slate-400 mt-1">{t('home.exploreOtherGradesHint')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
