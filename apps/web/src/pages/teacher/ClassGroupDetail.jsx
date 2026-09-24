import { useCallback, useContext, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, RefreshCw, Archive, ArchiveRestore } from 'lucide-react';
import { ArrowBack } from '../../components/common/DirectionalIcons';
import { getAllGrades } from '@smarter-academy/core';
import { AuthContext } from '../../context/AuthContext';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { ConfirmDialog } from '../../components/admin/ui/Modal';
import { fetchClassGroup, fetchTeacherEntitlements, updateClassGroup, archiveClassGroup, restoreClassGroup, rotateJoinCode } from '../../services/teacher/classGroupService';
import MembersTab from '../../features/teacher/members/MembersTab';
import LessonsTab from '../../features/teacher/classGroupLessons/LessonsTab';
import ProgressTab from '../../features/teacher/progress/ProgressTab';
import LearningPointsTab from '../../features/teacher/learningPoints/LearningPointsTab';
import { TeacherPage, Loading, ErrorBox, useTableLabels, btnSecondary, btnPrimary, btnDanger, input } from './teacherUi';

const TABS = ['students', 'lessons', 'progress', 'learningPoints', 'settings'];

/** La page d'une classe : cinq onglets, et le code de classe toujours visible. */
export default function ClassGroupDetail() {
  const { t } = useTranslation('teacher');
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const labels = useTableLabels();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'students';

  const loader = useCallback(async (tk) => {
    const [classroom, entitlements] = await Promise.all([fetchClassGroup(tk, id), fetchTeacherEntitlements(tk)]);
    return { classroom, entitlements };
  }, [id]);
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);
  const classGroup = data?.classroom;
  useDocumentMeta(classGroup?.name ?? t('classes.title'));

  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const setTab = (next) => { const p = new URLSearchParams(searchParams); p.set('tab', next); setSearchParams(p, { replace: true }); };
  const replaceClassroom = (classroom) => setData((cur) => ({ ...cur, classroom: { ...cur.classroom, ...classroom } }));

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(classGroup.joinCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* code visible */ }
  };

  const run = async (kind) => {
    setBusy(true);
    setActionError(null);
    try {
      if (kind === 'rotate') replaceClassroom(await rotateJoinCode(token, id));
      if (kind === 'archive') { const r = await archiveClassGroup(token, id); replaceClassroom(r.classroom); }
      if (kind === 'restore') { const r = await restoreClassGroup(token, id); replaceClassroom(r.classroom); }
      setConfirm(null);
    } catch (err) {
      setActionError(t(`classes.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('classes.errors.generic') }));
    } finally {
      setBusy(false);
    }
  };

  const gradeName = classGroup ? (getAllGrades().find((g) => g.id === classGroup.grade)?.name ?? classGroup.grade) : '';

  return (
    <TeacherPage
      eyebrow={gradeName}
      title={classGroup?.name ?? '…'}
      subtitle={classGroup?.description || undefined}
      actions={<Link to="/enseignant/classes" className={btnSecondary}><ArrowBack size={14} /> {t('common.back')}</Link>}
    >
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {classGroup && (
        <div className="space-y-5">
          <div className="glass-card p-4 flex flex-wrap items-center gap-3" data-join-code-card>
            <div className="min-w-0">
              <p className="font-inter text-xs text-slate-500">{t('classes.joinCode')}</p>
              <p dir="ltr" className="font-mono-jetbrains text-2xl font-black tracking-[0.35em] text-teal-800" data-join-code>{classGroup.joinCodeEnabled ? classGroup.joinCode : '······'}</p>
              <p className="text-[11px] text-slate-400">{classGroup.joinCodeEnabled ? t('classes.joinCodeHint') : t('classes.joinCodeDisabled')}</p>
            </div>
            <div className="ms-auto flex flex-wrap gap-2">
              <button type="button" onClick={copyCode} className={btnSecondary}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('classes.copied') : t('classes.copy')}</button>
              {classGroup.status === 'active' && <button type="button" onClick={() => setConfirm('rotate')} className={btnSecondary}><RefreshCw size={14} /> {t('classes.rotateJoinCode')}</button>}
            </div>
            <span className={`rounded-full px-2.5 py-1 font-mono-jetbrains text-[10px] font-bold ${classGroup.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{t(`classes.status.${classGroup.status}`)}</span>
          </div>

          <div role="tablist" className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden">
            {TABS.map((key) => (
              <button key={key} role="tab" aria-selected={tab === key} type="button" onClick={() => setTab(key)} data-tab={key}
                className={`shrink-0 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${tab === key ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {t(`classes.tabs.${key}`)}
              </button>
            ))}
          </div>

          {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{actionError}</p>}

          {tab === 'students' && <MembersTab classGroup={classGroup} entitlements={data.entitlements} onChanged={reload} />}
          {tab === 'lessons' && <LessonsTab classGroup={classGroup} entitlements={data.entitlements} />}
          {tab === 'progress' && (data.entitlements?.features?.['progress.class'] === false
            ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p>
            : <ProgressTab classGroup={classGroup} onOpenLearningPoints={() => setTab('learningPoints')} />)}
          {tab === 'learningPoints' && (data.entitlements?.features?.['progress.class'] === false
            ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p>
            : <LearningPointsTab classGroup={classGroup} />)}
          {tab === 'settings' && <SettingsTab classGroup={classGroup} onSaved={replaceClassroom} onArchive={() => setConfirm(classGroup.status === 'archived' ? 'restore' : 'archive')} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => (busy ? null : setConfirm(null))}
        onConfirm={() => run(confirm)}
        busy={busy}
        tone={confirm === 'archive' ? 'danger' : 'default'}
        title={confirm === 'rotate' ? t('classes.rotateConfirmTitle') : confirm === 'archive' ? t('classes.archiveConfirmTitle', { name: classGroup?.name ?? '' }) : t('classes.restore')}
        message={<p>{confirm === 'rotate' ? t('classes.rotateConfirmBody') : confirm === 'archive' ? t('classes.archiveConfirmBody') : ''}</p>}
        confirmLabel={confirm === 'rotate' ? t('classes.rotateJoinCode') : confirm === 'archive' ? t('classes.archive') : t('classes.restore')}
        {...labels.dialog}
      />
    </TeacherPage>
  );
}

function SettingsTab({ classGroup, onSaved, onArchive }) {
  const { t } = useTranslation('teacher');
  const { token } = useContext(AuthContext);
  const [name, setName] = useState(classGroup.name);
  const [description, setDescription] = useState(classGroup.description ?? '');
  const [academicYear, setAcademicYear] = useState(classGroup.academicYear ?? '');
  const [joinCodeEnabled, setJoinCodeEnabled] = useState(classGroup.joinCodeEnabled);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateClassGroup(token, classGroup.id, { name: name.trim(), description: description.trim() || null, academicYear: academicYear.trim() || null, joinCodeEnabled });
      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setError(t(`classes.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('classes.errors.generic') }));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-5 max-w-xl">
      <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
        <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-800">{t('classes.nameLabel')}</span><input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className={input} /></label>
        <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-800">{t('classes.descriptionLabel')}</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} maxLength={500} className={input} /></label>
        <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-800">{t('classes.academicYearLabel')}</span><input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} dir="ltr" pattern="\d{4}-\d{4}" placeholder={t('classes.academicYearPlaceholder')} className={input} /></label>
        <label className="flex items-center gap-2 text-sm text-slate-800"><input type="checkbox" checked={joinCodeEnabled} onChange={(e) => setJoinCodeEnabled(e.target.checked)} className="h-4 w-4" /> {t('classes.joinCode')}</label>
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
        {saved && <p role="status" className="text-sm text-emerald-700">{t('common.save')} ✓</p>}
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? t('common.saving') : t('common.save')}</button>
      </form>
      <div className="glass-card p-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{classGroup.status === 'archived' ? t('classes.status.archived') : t('classes.archiveConfirmBody')}</p>
        <button type="button" onClick={onArchive} className={classGroup.status === 'archived' ? btnSecondary : btnDanger}>
          {classGroup.status === 'archived' ? <><ArchiveRestore size={14} /> {t('classes.restore')}</> : <><Archive size={14} /> {t('classes.archive')}</>}
        </button>
      </div>
    </div>
  );
}
