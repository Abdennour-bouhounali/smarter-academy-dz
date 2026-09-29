import { lazy, Suspense, useCallback, useContext, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Archive, ArchiveRestore } from 'lucide-react';
import { ArrowBack } from '../../components/common/DirectionalIcons';
import { getAllGrades } from '@smarter-academy/core';
import { AuthContext } from '../../context/AuthContext';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { ConfirmDialog } from '../../components/admin/ui/Modal';
import { fetchClassGroup, fetchTeacherEntitlements, updateClassGroup, archiveClassGroup, restoreClassGroup, rotateJoinCode, rotateJoinLink } from '../../services/teacher/classGroupService';
import JoinAccessCard from '../../features/teacher/members/JoinAccessCard';
import MembersTab from '../../features/teacher/members/MembersTab';
import LessonsTab from '../../features/teacher/classGroupLessons/LessonsTab';
import LearningPointsTab from '../../features/teacher/learningPoints/LearningPointsTab';
import OverviewTab from '../../features/teacher/overview/OverviewTab';
import InterventionsTab from '../../features/teacher/interventions/InterventionsTab';
// « التحدّي اليومي » : lot et catalogue `challenge` chargés à l'ouverture de l'onglet.
const DailyChallengeTab = lazy(() => import('../../features/teacher/dailyChallenge/DailyChallengeTab'));
import { TeacherPage, Loading, ErrorBox, useTableLabels, btnSecondary, btnPrimary, btnDanger, input } from './teacherUi';

const TABS = ['overview', 'students', 'learningPoints', 'interventions', 'dailyChallenge', 'lessons', 'settings'];

/**
 * La page d'une classe, et la façon d'y entrer toujours visible en haut : le
 * LIEN de classe d'abord (la voie recommandée), le CODE juste en dessous
 * (le repli manuel) — JoinAccessCard. Elle s'ouvre
 * sur « نظرة عامة » : ce qui mérite un regard, ce qui a changé, la carte —
 * DÉTECTER d'abord. Les autres onglets servent à COMPRENDRE (نقاط التعلّم),
 * INTERVENIR et MESURER (التدخّلات), et administrer (التلاميذ, الدروس,
 * الإعدادات).
 */
export default function ClassGroupDetail() {
  const { t } = useTranslation('teacher');
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const labels = useTableLabels();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'overview';
  const [focusPoint, setFocusPoint] = useState(null);

  const loader = useCallback(async (tk) => {
    const [classroom, entitlements] = await Promise.all([fetchClassGroup(tk, id), fetchTeacherEntitlements(tk)]);
    return { classroom, entitlements };
  }, [id]);
  const { data, loading, error, reload, setData } = useAdminResource(loader, [loader]);
  const classGroup = data?.classroom;
  useDocumentMeta(classGroup?.name ?? t('classes.title'));

  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const clearFocus = useCallback(() => setFocusPoint(null), []);
  const setTab = (next) => { const p = new URLSearchParams(searchParams); p.set('tab', next); setSearchParams(p, { replace: true }); };
  const replaceClassroom = (classroom) => setData((cur) => ({ ...cur, classroom: { ...cur.classroom, ...classroom } }));

  const run = async (kind) => {
    setBusy(true);
    setActionError(null);
    try {
      if (kind === 'rotate') replaceClassroom(await rotateJoinCode(token, id));
      if (kind === 'rotateLink') replaceClassroom(await rotateJoinLink(token, id));
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
      actions={(
        <>
          {classGroup && <span className={`rounded-full px-2.5 py-1 font-mono-jetbrains text-[10px] font-bold ${classGroup.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{t(`classes.status.${classGroup.status}`)}</span>}
          <Link to="/enseignant/classes" className={btnSecondary}><ArrowBack size={14} /> {t('common.back')}</Link>
        </>
      )}
    >
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {classGroup && (
        <div className="space-y-5">
          <JoinAccessCard classGroup={classGroup} onRotateLink={() => setConfirm('rotateLink')} onRotateCode={() => setConfirm('rotate')} />

          <div role="tablist" className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden">
            {TABS.map((key) => (
              <button key={key} role="tab" aria-selected={tab === key} type="button" onClick={() => setTab(key)} data-tab={key}
                className={`shrink-0 px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors ${tab === key ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {t(`classes.tabs.${key}`)}
              </button>
            ))}
          </div>

          {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{actionError}</p>}

          {tab === 'overview' && (data.entitlements?.features?.['progress.class'] === false
            ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p>
            : <OverviewTab classGroup={classGroup} onOpenTab={setTab} onOpenPoint={(code) => { setFocusPoint(code); setTab('learningPoints'); }} />)}
          {tab === 'interventions' && (data.entitlements?.features?.['progress.student'] === false
            ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p>
            : <InterventionsTab classGroup={classGroup} onOpenPoint={(code) => { setFocusPoint(code); setTab('learningPoints'); }} />)}
          {tab === 'dailyChallenge' && (
            <Suspense fallback={<Loading />}>
              <DailyChallengeTab classGroup={classGroup} onOpenPoint={(code) => { setFocusPoint(code); setTab('learningPoints'); }} />
            </Suspense>
          )}
          {tab === 'students' && <MembersTab classGroup={classGroup} entitlements={data.entitlements} onChanged={reload} />}
          {tab === 'lessons' && <LessonsTab classGroup={classGroup} entitlements={data.entitlements} />}
          {tab === 'learningPoints' && (data.entitlements?.features?.['progress.class'] === false
            ? <p className="glass-card p-8 text-center text-sm text-slate-500">{t('progress.unavailable')}</p>
            : <LearningPointsTab classGroup={classGroup} focusCode={focusPoint} onFocusConsumed={clearFocus} />)}
          {tab === 'settings' && <SettingsTab classGroup={classGroup} onSaved={replaceClassroom} onArchive={() => setConfirm(classGroup.status === 'archived' ? 'restore' : 'archive')} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => (busy ? null : setConfirm(null))}
        onConfirm={() => run(confirm)}
        busy={busy}
        tone={confirm === 'archive' ? 'danger' : 'default'}
        title={confirm === 'rotate' ? t('classes.rotateConfirmTitle') : confirm === 'rotateLink' ? t('classes.rotateLinkConfirmTitle') : confirm === 'archive' ? t('classes.archiveConfirmTitle', { name: classGroup?.name ?? '' }) : t('classes.restore')}
        message={<p>{confirm === 'rotate' ? t('classes.rotateConfirmBody') : confirm === 'rotateLink' ? t('classes.rotateLinkConfirmBody') : confirm === 'archive' ? t('classes.archiveConfirmBody') : ''}</p>}
        confirmLabel={confirm === 'rotate' ? t('classes.rotateJoinCode') : confirm === 'rotateLink' ? t('classes.rotateJoinLink') : confirm === 'archive' ? t('classes.archive') : t('classes.restore')}
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
        {/* Un seul interrupteur ferme le LIEN et le CODE : les membres restent. */}
        <label className="flex items-start gap-2 text-sm text-slate-800" data-joining-toggle>
          <input type="checkbox" checked={joinCodeEnabled} onChange={(e) => setJoinCodeEnabled(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span><span className="font-semibold">{t('classes.joiningEnabled')}</span><span className="block text-xs text-slate-500">{t('classes.joiningEnabledHint')}</span></span>
        </label>
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
