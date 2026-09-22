import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { ArrowForward } from '../../../components/common/DirectionalIcons';
import { useStudyContext } from '../../../context/StudyContextContext';
import { useContentAvailability } from '../../../context/ContentAvailabilityContext';

/**
 * « Tu étudies dans le قسم X, avec l'enseignant Y. » — l'accueil dit à
 * l'élève que son étude est cadrée par une classe, et combien de leçons son
 * enseignant a masquées. Rien n'apparaît pour un élève indépendant : la
 * politique d'ouverture du contexte le traite ainsi tant que le serveur n'a
 * pas répondu.
 */
export default function ClassContextBanner() {
  const { t } = useTranslation('student');
  const { studyContext } = useStudyContext();
  const { hiddenByClassCount } = useContentAvailability();

  if (studyContext.mode !== 'classroom' || !studyContext.primary) return null;
  const { name, teacherName } = studyContext.primary;

  return (
    <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5 flex items-start gap-3" data-class-context-banner>
      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
        <Users size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-space font-bold text-slate-900 text-sm">{t('home.classBannerTitle', { name })}</p>
        {teacherName && <p className="font-inter text-slate-600 text-xs mt-0.5">{t('home.classBannerTeacher', { teacher: teacherName })}</p>}
        <p className="font-inter text-slate-500 text-xs mt-1">
          {t('qism.hiddenLessons', { count: hiddenByClassCount })} {t('home.classBannerHint')}
        </p>
      </div>
      <Link to="/espace/qism" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-900 whitespace-nowrap">
        {t('home.classBannerLink')} <ArrowForward size={13} />
      </Link>
    </div>
  );
}
