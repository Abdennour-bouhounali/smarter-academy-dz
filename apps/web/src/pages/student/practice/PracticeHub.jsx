import { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Dumbbell, PlayCircle } from 'lucide-react';
import { ArrowBack, ArrowForward } from '../../../components/common/DirectionalIcons';
import { AuthContext } from '../../../context/AuthContext';
import { fetchPracticeOverview, startPracticeSession } from '../../../services/practiceService';
import LevelSelector from '../../../features/practice/LevelSelector';
import LearningPointProgress from '../../../features/practice/LearningPointProgress';
import { resolveMasteryState, reasonLabel, freshnessLabel } from '../../../lessons/common/components/LearningPointMastery';
import { getLessonPath } from '@smarter-academy/core';

/**
 * Le Hub de pratique d'une leçon : les niveaux, et l'état des connaissances
 * qu'ils travaillent.
 *
 * Rien de ludique ici — pas de pièces, pas de classement. La récompense
 * affichée est la seule qui compte : voir un point d'apprentissage passer de
 * « à renforcer » à « maîtrisé ».
 */
export default function PracticeHub() {
  const { t } = useTranslation('student');
  const { lessonCode } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);
  const [busyLevel, setBusyLevel] = useState(null);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    setError(null);
    fetchPracticeOverview(token, lessonCode)
      .then((data) => !cancelled && setOverview(data))
      .catch((e) => !cancelled && setError(e.message));

    return () => { cancelled = true; };
  }, [token, lessonCode]);

  const start = useCallback(async (level) => {
    setBusyLevel(level);
    setError(null);
    try {
      const sessionId = crypto.randomUUID();
      await startPracticeSession(token, lessonCode, sessionId, level);
      navigate(`/espace/pratique/${lessonCode}/session/${sessionId}`);
    } catch (e) {
      setError(e.message);
      setBusyLevel(null);
    }
  }, [token, lessonCode, navigate]);

  if (error && !overview) {
    return (
      <div className="sa-surface-plain sa-page sa-page--flush py-6 space-y-6">
        <p className="text-rose-700 bg-rose-50 border-2 border-rose-200 rounded-xl p-4">{error}</p>
        <Link to="/espace/cours" className="text-sm font-bold text-slate-600 hover:text-slate-900">
          ← {t('practice.backToMyCourses')}
        </Link>
      </div>
    );
  }

  if (!overview) {
    return <div className="sa-surface-plain sa-page sa-page--flush py-6"><div className="h-64 rounded-2xl bg-slate-100 animate-pulse" /></div>;
  }

  const { lesson, levels, recommendedLevel, learningPoints, openSession } = overview;
  // L'API de pratique ne renvoie que le code de la leçon ; le chemin de son
  // cours vient du catalogue, seule source de vérité des URLs de leçon.
  const lessonPath = getLessonPath(lessonCode);

  return (
    // Même cadre que le lecteur d'exercices : toute la largeur, 20 px de
    // chaque côté (`.sa-page--flush`), un rythme vertical serré.
    <div className="sa-surface-plain sa-page sa-page--flush py-4 sm:py-6 space-y-4">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-600" aria-label={t('nav.breadcrumb', { ns: 'lesson' })}>
        <Link to="/espace/cours" className="inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap hover:text-indigo-700">
          <ArrowBack className="h-4 w-4" aria-hidden="true" /> {t('practice.breadcrumbMyCourses')}
        </Link>
        {lessonPath && (
          <>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <Link to={lessonPath} className="min-w-0 truncate hover:text-indigo-700">{lesson.title}</Link>
          </>
        )}
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2" data-practice-hub-header>
        <div className="min-w-0 space-y-1">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700">
            <Dumbbell className="h-4 w-4" aria-hidden="true" /> {t('practice.eyebrow')}
          </p>
          <h1 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{lesson.title}</h1>
          <p className="text-sm text-slate-600">{t('practice.hubSubtitle')}</p>
        </div>
        {/* Le retour au cours. La pratique n'est pas une impasse : l'élève qui
            butte sur un niveau doit pouvoir relire la leçon en un geste, sans
            repasser par « Mes cours ». `lessonPath` est nul quand la leçon
            n'est pas (encore) au catalogue — on n'affiche alors aucun lien
            plutôt qu'un lien mort. Action TERTIAIRE : le choix du niveau est
            l'action de la page. */}
        {lessonPath && (
          <Link
            to={lessonPath}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-bold text-slate-700 hover:bg-white hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {t('practice.reviewLesson')}
          </Link>
        )}
      </header>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {/* Une séance ouverte : UNE rangée, l'action principale de la page
          quand elle existe. */}
      {openSession && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-s-4 border-indigo-600 bg-white px-4 py-3 ring-1 ring-slate-200" data-open-session>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <PlayCircle className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            {t('practice.openSession', { level: openSession.level })}
          </p>
          <Link
            to={`/espace/pratique/${lessonCode}/session/${openSession.sessionId}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {t('practice.resume')}
            <ArrowForward className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* Grand écran : les points d'apprentissage en colonne au DÉBUT (à droite
          en RTL, comme dans le lecteur), les niveaux prennent le reste. Plus
          petit : les niveaux d'abord — choisir un niveau est l'action. */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[30.6rem_minmax(0,1fr)] xl:items-start xl:[grid-template-areas:'side_main']">
        <section className="space-y-2 xl:[grid-area:main]" aria-labelledby="practice-levels-title">
          <h2 id="practice-levels-title" className="text-base font-bold text-slate-900">{t('practice.levelsTitle')}</h2>
          <LevelSelector levels={levels} recommendedLevel={recommendedLevel} onSelect={start} busyLevel={busyLevel} />
        </section>

        {learningPoints.length > 0 && (
          <section className="space-y-2 xl:sticky xl:top-4 xl:[grid-area:side]" aria-labelledby="practice-lps-title" data-practice-hub-lps>
            <div>
              <h2 id="practice-lps-title" className="text-base font-bold text-slate-900">{t('practice.whatYouShowed')}</h2>
              <p className="text-xs text-slate-600">{t('practice.whatYouShowedHint')}</p>
            </div>
            {/* Le MÊME module que dans le lecteur : chemin d'étoiles (l'état
                Mastery V2) et compteurs exercices / questions. Sous `xl`,
                deux par rangée sur tablette. */}
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {learningPoints.map((lp) => {
                const stateKey = resolveMasteryState(lp);
                const reason = stateKey === 'reinforce' ? reasonLabel(lp, t) : '';
                const freshness = stateKey === 'mastered' && lp.freshness && lp.freshness !== 'fresh' ? freshnessLabel(lp, t) : '';

                return (
                  <li key={lp.code} data-mastery-state={stateKey} className="space-y-1">
                    <LearningPointProgress point={lp} eyebrow={false} headingTag="h3" />
                    {(reason || freshness) && (
                      <p className="px-1 text-xs text-slate-600">
                        {reason}{reason && freshness ? ' · ' : ''}{freshness && `⏳ ${freshness}`}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
