import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { ArrowBack } from '../../../components/common/DirectionalIcons';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { fetchClassLearningPoint } from '../../../services/teacher/classGroupService';
import { Loading, ErrorBox, formatDate, btnSecondary } from '../../../pages/teacher/teacherUi';
import MasteryPill, { ReasonChip, FreshnessMark, ConfidenceBar } from './MasteryPill';
import MasteryExplanationPanel from './MasteryExplanationPanel';

/**
 * UN point d'apprentissage × les élèves de la classe — un panneau dans le
 * même onglet, jamais une route : l'enseignant descend et remonte sans
 * perdre la leçon choisie. Le serveur livre les élèves déjà triés du plus
 * faible au plus fort ; l'écran ne réordonne rien.
 */
export default function LearningPointDrilldown({ classGroup, code, onBack }) {
  const { t } = useTranslation('teacher');
  const loader = useCallback((tk) => fetchClassLearningPoint(tk, classGroup.id, code), [classGroup.id, code]);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);
  const [explain, setExplain] = useState(null);
  const fullName = (s) => [s.firstName, s.lastName].filter(Boolean).join(' ') || s.email;

  return (
    <section className="glass-card p-4 sm:p-5 space-y-4" data-lp-drilldown={code}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono-jetbrains text-[11px] uppercase tracking-widest text-teal-700">{data?.lesson?.title ?? ''}</p>
          <h3 className="font-space text-lg font-bold text-slate-900">{data?.learningPoint?.title ?? '…'}</h3>
          <p className="text-xs text-slate-500">{t('learningPoints.drilldownHint')}</p>
        </div>
        <button type="button" onClick={onBack} className={btnSecondary} data-lp-back><ArrowBack size={14} /> {t('learningPoints.backToList')}</button>
      </div>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && !loading && (data.students.length === 0
        ? <p className="py-6 text-center text-sm text-slate-500">{t('progress.noStudents')}</p>
        : (
          <ul className="divide-y divide-slate-100">
            {data.students.map((s) => (
              <li key={s.id} className="py-2.5" data-lp-student={s.id}>
                <button
                  type="button"
                  onClick={() => setExplain(s)}
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-1 py-1 text-start hover:bg-slate-50"
                  aria-label={t('learningPoints.explainFor', { name: fullName(s) })}
                >
                  <span className="w-40 shrink-0 truncate font-inter text-sm font-semibold text-slate-800">{fullName(s)}</span>
                  <MasteryPill status={s.status} />
                  <ReasonChip reason={s.statusReason} />
                  <ConfidenceBar confidence={s.confidence} />
                  <span className="text-xs text-slate-600">{t('learningPoints.distinctSuccess', { count: Number(s.distinctItemsSuccess) || 0 })}</span>
                  <span className="text-xs text-slate-600">{t('learningPoints.assessmentSuccess', { count: Number(s.assessmentSuccessCount) || 0 })}</span>
                  <FreshnessMark freshness={s.freshness} />
                  <span className="ms-auto inline-flex items-center gap-1.5 text-xs text-slate-400">
                    {s.lastEvidenceAt ? formatDate(s.lastEvidenceAt) : t('students.never')}
                    <HelpCircle size={13} className="text-teal-700" aria-hidden="true" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ))}

      <MasteryExplanationPanel
        open={Boolean(explain)}
        onClose={() => setExplain(null)}
        classGroupId={classGroup.id}
        studentId={explain?.id}
        code={code}
        studentName={explain ? fullName(explain) : ''}
      />
    </section>
  );
}
