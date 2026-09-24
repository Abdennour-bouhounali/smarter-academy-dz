import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Activity, TrendingUp, CircleCheckBig, Percent, Target } from 'lucide-react';
import { useAdminResource } from '../../../hooks/useAdminResource';
import StatTile from '../../../components/common/StatTile';
import PathProgress from '../../progression/components/PathProgress';
import { fetchClassProgress } from '../../../services/teacher/classGroupService';
import { Loading, ErrorBox, formatDate, btnSecondary } from '../../../pages/teacher/teacherUi';

/**
 * La progression d'une classe : un résumé, une ligne par élève. Tout est
 * dérivé. Les points faibles par élève ne sont PAS ici — ils demanderaient
 * un appel de plus par ligne ; l'onglet « نقاط التعلّم » les porte, et ce
 * bouton y mène (`onOpenLearningPoints`, fourni par la page).
 */
export default function ProgressTab({ classGroup, onOpenLearningPoints }) {
  const { t } = useTranslation('teacher');
  const loader = useCallback((tk) => fetchClassProgress(tk, classGroup.id), [classGroup.id]);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data) return null;
  const s = data.summary;
  const fullName = (r) => [r.firstName, r.lastName].filter(Boolean).join(' ') || r.email;

  return (
    <div className="space-y-6" data-progress-tab>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile icon={Users} value={s.students} label={t('progress.students')} accent="bg-teal-50 text-teal-700" />
        <StatTile icon={Activity} value={s.activeStudents} label={t('progress.activeStudents')} accent="bg-blue-50 text-blue-600" />
        <StatTile icon={TrendingUp} value={s.averageProgress === null ? '—' : <span dir="ltr">{s.averageProgress}%</span>} label={t('progress.averageProgress')} accent="bg-violet-50 text-violet-600" />
        <StatTile icon={CircleCheckBig} value={s.lessonsCompleted} label={t('progress.lessonsCompleted')} accent="bg-emerald-50 text-emerald-600" hint={`${t('progress.lessonsInScope')}: ${s.lessonsInScope}`} />
        <StatTile icon={Percent} value={s.averageSuccessRate === null ? '—' : <span dir="ltr">{s.averageSuccessRate}%</span>} label={t('progress.averageSuccess')} accent="bg-amber-50 text-amber-600" />
      </div>
      {onOpenLearningPoints && (
        <div className="flex justify-end">
          <button type="button" onClick={onOpenLearningPoints} className={btnSecondary} data-open-learning-points>
            <Target size={14} /> {t('progress.openLearningPoints')}
          </button>
        </div>
      )}
      {data.students.length === 0 ? (
        <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.noStudents')}</p>
      ) : (
        <ul className="glass-card divide-y divide-slate-100">
          {data.students.map((r) => (
            <li key={r.id} className="flex items-center gap-4 px-4 py-3">
              <Link to={`/enseignant/classes/${classGroup.id}/eleves/${r.id}`} className="w-40 shrink-0 truncate font-inter text-sm font-semibold text-teal-800 hover:underline">{fullName(r)}</Link>
              <PathProgress percent={r.progressPercent ?? 0} size="sm" className="flex-1" />
              <span className="w-20 shrink-0 text-xs text-slate-500 text-end">{r.lastActivityAt ? formatDate(r.lastActivityAt) : t('students.never')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
