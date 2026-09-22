import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { fetchClassGroups } from '../../services/teacher/classGroupService';
import ProgressTab from '../../features/teacher/progress/ProgressTab';
import { TeacherPage, Loading, ErrorBox, input } from './teacherUi';

/** La progression, classe par classe : on choisit, on lit. */
export default function ProgressOverview() {
  const { t } = useTranslation('teacher');
  useDocumentMeta(t('progress.metaTitle'));
  const loader = useCallback((tk) => fetchClassGroups(tk), []);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);
  const [selected, setSelected] = useState('');
  const classrooms = (data?.classrooms ?? []).filter((c) => c.status !== 'archived');
  const current = classrooms.find((c) => String(c.id) === String(selected)) ?? classrooms[0];
  const unavailable = data?.entitlements?.features?.['progress.class'] === false;

  return (
    <TeacherPage eyebrow={t('space')} title={t('progress.title')} subtitle={t('progress.subtitle')}>
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && (unavailable ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p> : classrooms.length === 0 ? (
        <p className="glass-card p-8 text-center text-sm text-slate-500">{t('home.noClassesTitle')}</p>
      ) : (
        <div className="space-y-5">
          <label className="block max-w-sm">
            <span className="mb-1 block text-sm font-semibold text-slate-800">{t('progress.pickClass')}</span>
            <select value={current?.id ?? ''} onChange={(e) => setSelected(e.target.value)} className={input}>
              {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          {current && <ProgressTab key={current.id} classGroup={current} />}
        </div>
      ))}
    </TeacherPage>
  );
}
