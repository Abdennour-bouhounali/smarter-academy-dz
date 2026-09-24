import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleCheckBig, Target, Dumbbell, Percent, Lock, NotebookPen } from 'lucide-react';
import { ArrowBack } from '../../components/common/DirectionalIcons';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import StatTile from '../../components/common/StatTile';
import PathProgress from '../../features/progression/components/PathProgress';
import { fetchClassStudentProgress } from '../../services/teacher/classGroupService';
import { TeacherPage, Loading, ErrorBox, btnPrimary, btnSecondary, formatDate } from './teacherUi';

/** Le dossier d'UN élève, cadré sur la classe. Le cahier a son propre écran, en lecture seule. */
export default function StudentProgressPage() {
  const { t } = useTranslation('teacher');
  const { id, studentId } = useParams();
  const loader = useCallback((tk) => fetchClassStudentProgress(tk, id, studentId), [id, studentId]);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);
  const name = data ? ([data.student.firstName, data.student.lastName].filter(Boolean).join(' ') || data.student.email) : '';
  useDocumentMeta(name ? t('students.detailTitle', { name }) : t('students.title'));

  return (
    <TeacherPage
      eyebrow={t('students.title')}
      title={name || '…'}
      subtitle={data ? `${data.student.email}` : undefined}
      actions={(
        <>
          {/* Le cahier est une DESTINATION, pas une note de bas de page : il
              était sous la frise d'activité, ce qui obligeait à dérouler tout
              le dossier pour l'atteindre. Ici, il est visible à l'ouverture.
              En `btnPrimary` parce que c'est l'action de la page — « revenir
              au قسم » n'est qu'une sortie. */}
          <Link to={`/enseignant/classes/${id}/eleves/${studentId}/cahier`} className={btnPrimary}>
            <NotebookPen size={14} /> {t('notebook.open')}
          </Link>
          <Link to={`/enseignant/classes/${id}`} className={btnSecondary}>
            <ArrowBack size={14} /> {t('students.backToClass')}
          </Link>
        </>
      )}
    >
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && (
        <div className="space-y-6" data-student-progress>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile icon={CircleCheckBig} value={data.learning.lessonsCompleted} label={t('students.lessonsCompleted')} accent="bg-emerald-50 text-emerald-600" hint={`${data.scope.lessonsInScope} ${t('students.lessonsInScope')}`} />
            <StatTile icon={Target} value={data.learning.modulesCompleted} label={t('students.modulesCompleted')} accent="bg-blue-50 text-blue-600" />
            <StatTile icon={Dumbbell} value={data.learning.questionsAnswered} label={t('students.questionsAnswered')} accent="bg-violet-50 text-violet-600" hint={`${data.learning.hintsUsed} ${t('students.hints')}`} />
            <StatTile icon={Percent} value={data.learning.successRate === null ? '—' : <span dir="ltr">{data.learning.successRate}%</span>} label={t('students.successRate')} accent="bg-amber-50 text-amber-600" />
          </div>
          <div className="glass-card p-4"><PathProgress percent={data.learning.progressPercent ?? 0} /></div>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="glass-card p-5">
              <h2 className="font-space font-bold text-slate-900 mb-3">{t('students.progressTitle')}</h2>
              {data.progress.length === 0 ? <p className="text-sm text-slate-400">{t('students.never')}</p> : (
                <ul className="divide-y divide-slate-100">
                  {data.progress.map((p) => (
                    <li key={p.lessonCode} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="min-w-0 truncate text-slate-800">{p.lessonTitle ?? p.lessonCode}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{t(`students.lessonStatus.${p.status}`)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="glass-card p-5">
              <h2 className="font-space font-bold text-slate-900 mb-3">{t('students.masteryTitle')}</h2>
              {data.mastery.length === 0 ? <p className="text-sm text-slate-400">{t('common.noData')}</p> : (
                <ul className="divide-y divide-slate-100">
                  {data.mastery.slice(0, 20).map((m) => (
                    <li key={m.code} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="min-w-0 truncate text-slate-800">{m.title}</span>
                      <span className="shrink-0 text-[11px] font-semibold text-slate-500">{t(`students.masteryStatus.${m.status}`, { defaultValue: m.status })} · <span dir="ltr">{m.correctCount}/{m.attempts}</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="glass-card p-5">
            <h2 className="font-space font-bold text-slate-900 mb-3">{t('students.timelineTitle')}</h2>
            {data.timeline.length === 0 ? <p className="text-sm text-slate-400">{t('students.noActivity')}</p> : (
              <ol className="space-y-2">
                {data.timeline.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{e.lesson ?? '—'}</p>
                      <p className="text-xs text-slate-500" dir="auto">{e.type === 'practice_session' && e.answered !== undefined ? <span dir="ltr">{e.correct}/{e.answered}</span> : e.type === 'final_test' ? <span dir="ltr">{e.score}/{e.total}</span> : e.modulesCompleted}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{formatDate(e.at)}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
          {/* Le cahier n'est pas DANS ce dossier : il a son écran et sa
              propre autorisation (« où en est-il ? » et « qu'a-t-il noté ? »
              sont deux questions). Le bouton est en HAUT, dans les actions
              de la page ; ici il ne reste que le rappel. */}
          <p className="flex items-center gap-2 text-xs text-slate-400"><Lock size={12} /> {t('students.privacy')}</p>
        </div>
      )}
    </TeacherPage>
  );
}
