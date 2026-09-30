import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import SelectionCheckbox from '../../../components/admin/ui/SelectionCheckbox';
import { fetchClassLessons, setClassLessonStatus, bulkSetClassLessonStatus } from '../../../services/teacher/classGroupService';
import { flattenCurriculum, idsNeeding, applyBulkOutcome, countByStatus } from './lessonSelection';
import { Loading, ErrorBox, btnSecondary } from '../../../pages/teacher/teacherUi';
import { bidi } from '../../../utils/bidi';

/**
 * Les leçons de la classe : afficher / masquer, une par une ou en lot.
 * Le lot ne touche que les leçons dont l'état diffère de la cible, et ne
 * change à l'écran que ce que le serveur dit avoir appliqué. Jamais un mot
 * sur la publication globale — elle appartient à la plateforme, et l'écran
 * la montre comme un fait.
 */
export default function LessonsTab({ classGroup, entitlements }) {
  const { t } = useTranslation('teacher');
  const { token } = useContext(AuthContext);
  const loader = useCallback((tk) => fetchClassLessons(tk, classGroup.id), [classGroup.id]);
  const { data: curriculum, loading, error, reload, setData } = useAdminResource(loader, [loader]);
  const rows = useMemo(() => flattenCurriculum(curriculum), [curriculum]);
  const selection = useBulkSelection(rows);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [rowError, setRowError] = useState(null);

  const canBulk = entitlements?.features?.['lessons.bulk_actions'] === true;
  const canToggle = entitlements?.features?.['lessons.visibility'] !== false;
  const counts = countByStatus(rows);

  const patch = (updater) => setData((current) => {
    const flat = updater(flattenCurriculum(current));
    const byId = new Map(flat.map((r) => [r.id, r]));
    return { ...current, chapters: current.chapters.map((ch) => ({ ...ch, lessons: ch.lessons.map((l) => byId.get(l.id) ?? l) })) };
  });

  const toggleOne = async (row) => {
    const status = row.classStatus === 'hidden' ? 'visible' : 'hidden';
    setRowError(null);
    try {
      const result = await setClassLessonStatus(token, classGroup.id, row.id, status);
      patch((flat) => applyBulkOutcome(flat, { applied: result.changed ? [row.id] : [] }, result.classStatus));
    } catch (err) {
      setRowError(t(`classes.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('classes.errors.generic') }));
    }
  };

  const runBulk = async (status) => {
    const ids = idsNeeding(rows, selection.selectedIds, status);
    setNotice(null);
    setRowError(null);
    if (ids.length === 0) {
      setNotice({ applied: 0, unchanged: selection.count, failed: 0 });
      return;
    }
    setBusy(true);
    try {
      const outcome = await bulkSetClassLessonStatus(token, classGroup.id, ids, status);
      patch((flat) => applyBulkOutcome(flat, outcome, status));
      setNotice({ applied: outcome.applied.length, unchanged: outcome.unchanged.length + (selection.count - ids.length), failed: outcome.failed.length });
      if (outcome.failed.length === 0) selection.clear();
    } catch (err) {
      setRowError(t(`classes.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('classes.errors.generic') }));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!curriculum || rows.length === 0) return <p className="glass-card p-8 text-center text-sm text-slate-500">{t('lessons.empty')}</p>;

  return (
    <div className="space-y-4" data-lessons-tab>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-inter text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{t('lessons.effective')}</span> <span dir="ltr">{counts.effective} / {rows.length}</span>
        </p>
        <p className="text-xs text-slate-400">{t('lessons.subtitle')}</p>
      </div>

      {canBulk ? (
        <div className="sticky top-14 lg:top-0 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2" role="region" aria-label={t('lessons.select')}>
          <p className="font-inter text-xs font-semibold text-teal-900" aria-live="polite">{t('lessons.selectedCount', { count: selection.count })}</p>
          {!selection.allSelected && (
            <button type="button" onClick={selection.toggleAll} disabled={busy} className="rounded-lg border border-teal-300 bg-white px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100">{t('lessons.selectAll')}</button>
          )}
          <button type="button" onClick={() => runBulk('visible')} disabled={busy || selection.count === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40"><Eye size={13} /> {t('lessons.showSelected')}</button>
          <button type="button" onClick={() => runBulk('hidden')} disabled={busy || selection.count === 0} className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"><EyeOff size={13} /> {t('lessons.hideSelected')}</button>
          {selection.count > 0 && <button type="button" onClick={selection.clear} className="ms-auto text-xs font-semibold text-slate-600">{t('lessons.clearSelection')}</button>}
          {notice && (
            <p className="w-full text-xs text-slate-700" role="status">
              {notice.applied > 0 && <span className="text-emerald-800 font-semibold">{t('lessons.applied', { count: notice.applied })} </span>}
              {notice.unchanged > 0 && <span>{t('lessons.unchanged', { count: notice.unchanged })} </span>}
              {notice.failed > 0 && <span className="text-amber-800">{t('lessons.failed', { count: notice.failed })}</span>}
            </p>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">{t('lessons.bulkUnavailable')}</p>
      )}

      {rowError && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"><AlertTriangle size={14} /> {rowError}</p>}

      {curriculum.chapters.map((chapter) => (
        <section key={chapter.code} className="glass-card p-4 sm:p-5">
          <h3 className="font-space font-bold text-slate-900 mb-3">{bidi(chapter.title)}</h3>
          <ul className="divide-y divide-slate-100">
            {chapter.lessons.map((row) => (
              <li key={row.id} className="flex items-center gap-3 py-2.5" data-lesson-row={row.code}>
                {canBulk && <SelectionCheckbox checked={selection.isSelected(row.id)} onChange={() => selection.toggle(row.id)} label={t('common.selectRow', { title: row.title })} />}
                <div className="min-w-0 flex-1">
                  <p className="font-inter text-sm font-semibold text-slate-800 truncate">{bidi(row.title)}</p>
                  <p className="text-[11px] text-slate-400 flex flex-wrap gap-2">
                    {row.publicationStatus !== 'published' && <span className="text-amber-700" title={t('lessons.notPublishedHint')}>{t('lessons.notPublished')}</span>}
                    {row.tier === 'premium' && <span>{t('lessons.premium')}</span>}
                    <span className={row.effectiveForStudents ? 'text-emerald-700' : 'text-slate-400'}>{row.effectiveForStudents ? t('lessons.effective') : t('lessons.notEffective')}</span>
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${row.classStatus === 'hidden' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>{t(`lessons.status.${row.classStatus}`)}</span>
                {canToggle && classGroup.status === 'active' && (
                  <button type="button" onClick={() => toggleOne(row)} className={btnSecondary} data-toggle-lesson={row.code}>
                    {row.classStatus === 'hidden' ? <><Eye size={13} /> {t('lessons.show')}</> : <><EyeOff size={13} /> {t('lessons.hide')}</>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
