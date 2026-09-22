import { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, UserMinus } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useAdminResource } from '../../../hooks/useAdminResource';
import DataTable from '../../../components/admin/ui/DataTable';
import { ConfirmDialog } from '../../../components/admin/ui/Modal';
import PathProgress from '../../progression/components/PathProgress';
import { fetchClassStudents, removeClassStudent } from '../../../services/teacher/classGroupService';
import { useTableLabels, formatDate, btnDanger } from '../../../pages/teacher/teacherUi';
import InvitationsPanel from './InvitationsPanel';

/** Les élèves d'une classe : progression, dernière activité, retrait. */
export default function MembersTab({ classGroup, entitlements, onChanged }) {
  const { t } = useTranslation('teacher');
  const { token } = useContext(AuthContext);
  const labels = useTableLabels();
  const loader = useCallback((tk) => fetchClassStudents(tk, classGroup.id), [classGroup.id]);
  const { data: students, loading, error, reload } = useAdminResource(loader, [loader]);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const confirmRemove = async () => {
    setBusy(true);
    setRemoveError(null);
    try {
      await removeClassStudent(token, classGroup.id, removing.id);
      setRemoving(null);
      reload();
      onChanged?.();
    } catch (err) {
      setRemoveError(t(`classes.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('classes.errors.generic') }));
    } finally {
      setBusy(false);
    }
  };

  const fullName = (s) => [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email;

  const seats = entitlements?.students;
  const seatsFull = seats && seats.maximum != null && seats.current >= seats.maximum;

  return (
    <div className="space-y-6">
      {seats && (
        <p className={`rounded-xl border p-3 text-sm ${seatsFull ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`} role="status" data-seats-hint>
          {seatsFull ? t('students.seatsFull') : t('students.seatsHint', { current: seats.current, limit: seats.maximum ?? '∞' })}
          {seatsFull && <> <Link to="/enseignant/offre" className="font-semibold text-teal-800 hover:underline">{t('subscription.title')}</Link></>}
        </p>
      )}
      <DataTable
        rows={students ?? []}
        loading={loading}
        error={error}
        onRetry={reload}
        labels={labels.table}
        empty={(
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <Users size={26} className="mx-auto mb-3 text-slate-400" />
            <p className="font-space font-bold text-slate-800">{t('students.empty')}</p>
          </div>
        )}
        columns={[
          { key: 'name', label: t('students.name'), render: (s) => (
            <Link to={`/enseignant/classes/${classGroup.id}/eleves/${s.id}`} className="font-semibold text-teal-800 hover:underline">{fullName(s)}</Link>
          ) },
          { key: 'progress', label: t('students.progress'), render: (s) => (s.progressPercent === null ? <span className="text-slate-400">—</span> : <PathProgress percent={s.progressPercent} size="sm" className="min-w-[120px]" />) },
          { key: 'lessonsCompleted', label: t('students.lessonsCompleted'), cellClassName: 'tabular-nums', render: (s) => <span dir="ltr">{s.lessonsCompleted}</span> },
          { key: 'successRate', label: t('students.successRate'), render: (s) => (s.successRate === null ? <span className="text-slate-400">—</span> : <span dir="ltr">{s.successRate}%</span>) },
          { key: 'lastActivityAt', label: t('students.lastActivity'), render: (s) => (s.lastActivityAt ? formatDate(s.lastActivityAt) : t('students.never')) },
          { key: 'via', label: '', render: (s) => <span className="text-slate-400 text-[11px]">{t(`students.joinedVia.${s.joinedVia}`, { defaultValue: '' })}</span> },
          { key: 'actions', label: '', render: (s) => (
            classGroup.status === 'active' ? (
              <button type="button" onClick={() => { setRemoving(s); setRemoveError(null); }} className={btnDanger}><UserMinus size={13} /> {t('students.remove')}</button>
            ) : null
          ) },
        ]}
      />

      {classGroup.status === 'active' && <InvitationsPanel classGroup={classGroup} />}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
        busy={busy}
        tone="danger"
        title={t('students.removeConfirmTitle', { name: removing ? fullName(removing) : '' })}
        message={<div className="space-y-2"><p>{t('students.removeConfirmBody')}</p>{removeError && <p role="alert" className="text-rose-700">{removeError}</p>}</div>}
        confirmLabel={t('students.remove')}
        {...labels.dialog}
      />
    </div>
  );
}
