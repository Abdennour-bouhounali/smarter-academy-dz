import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ArrowUpRight, ArrowDownRight, Sparkles, Map as MapIcon, HandHelping } from 'lucide-react';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { fetchClassAttention, fetchClassLearningMap, fetchClassInterventions } from '../../../services/teacher/classGroupService';
import { Loading, ErrorBox } from '../../../pages/teacher/teacherUi';
import SignalCard from '../insights/SignalCard';
import InterventionForm from '../interventions/InterventionForm';
import { interventionDefaults, studentName } from '../insights/insights';
import { barSegments, LP_STATUS_BAR } from '../learningPoints/lpBar';
import MathLabel from '../../../lessons/common/components/MathLabel';

const VISIBLE_SIGNALS = 4;

/**
 * « نظرة عامة » — ce que l'enseignant voit EN PREMIER en ouvrant son قسم.
 *
 * Dans l'ordre des questions qu'il se pose, et rien d'autre :
 *   1. qu'est-ce qui mérite mon regard ?     (« تستحقّ نظرة », les signaux)
 *   2. qu'est-ce qui a changé ?               (« ما الذي تغيّر؟ »)
 *   3. où en est la classe, point par point ? (la carte : des effectifs, pas
 *                                              une moyenne)
 *   4. qu'ai-je déjà entrepris ?               (les interventions ouvertes)
 *
 * Tout vient du serveur, déjà décidé ; l'écran met en forme. Aucune moyenne
 * de classe n'est affichée : elle cacherait le groupe en difficulté.
 */
export default function OverviewTab({ classGroup, onOpenPoint, onOpenTab }) {
  const { t } = useTranslation('teacher');
  const attentionLoader = useCallback((tk) => fetchClassAttention(tk, classGroup.id), [classGroup.id]);
  const mapLoader = useCallback((tk) => fetchClassLearningMap(tk, classGroup.id), [classGroup.id]);
  const openLoader = useCallback((tk) => fetchClassInterventions(tk, classGroup.id, { status: 'open', perPage: 1 }), [classGroup.id]);
  const attention = useAdminResource(attentionLoader, [attentionLoader]);
  const map = useAdminResource(mapLoader, [mapLoader]);
  const openInterventions = useAdminResource(openLoader, [openLoader]);
  const [acting, setActing] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const learning = (attention.data?.signals ?? []).filter((s) => s.category === 'learning');
  const engagement = (attention.data?.signals ?? []).filter((s) => s.category === 'engagement');
  const openCount = Number(openInterventions.data?.meta?.total) || 0;

  return (
    <div className="space-y-6" data-overview-tab>
      <section aria-labelledby="attention-title" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="attention-title" className="font-space text-lg font-bold text-slate-900">{t('attention.title')}</h2>
            {attention.data && <p className="text-xs text-slate-500">{t('attention.subtitle', { days: attention.data.window?.days ?? 14 })}</p>}
          </div>
          {openCount > 0 && (
            <button type="button" onClick={() => onOpenTab('interventions')} className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100" data-open-interventions>
              <HandHelping size={13} /> {t('attention.openInterventions', { count: openCount })}
            </button>
          )}
        </div>

        {attention.loading && <Loading />}
        {attention.error && <ErrorBox message={attention.error} onRetry={attention.reload} />}
        {attention.data && !attention.loading && (learning.length === 0 ? (
          <div className="glass-card flex items-start gap-3 p-5" data-attention-empty>
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{t('attention.empty')}</p>
              <p className="text-xs text-slate-500">{t('attention.emptyHint')}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Les plus PARTAGÉS d'abord (ordre du serveur) ; le reste à la
                demande — une liste de dix cartes ne se lit pas d'un regard. */}
            <div className="grid gap-3 lg:grid-cols-2" data-attention-list>
              {(showAll ? learning : learning.slice(0, VISIBLE_SIGNALS)).map((signal) => (
                <SignalCard key={signal.key} signal={signal} classGroupId={classGroup.id} onOpenPoint={onOpenPoint} onAct={setActing} compact />
              ))}
            </div>
            {learning.length > VISIBLE_SIGNALS && (
              <button type="button" onClick={() => setShowAll((v) => !v)} className="text-xs font-semibold text-teal-800 hover:underline" data-attention-more>
                {showAll ? t('attention.showLess') : t('attention.showAll', { count: learning.length })}
              </button>
            )}
          </>
        ))}
      </section>

      {attention.data && <RecentChanges changes={attention.data.recentChanges} classGroupId={classGroup.id} onOpenPoint={onOpenPoint} />}

      <LearningMapSummary map={map} onOpenPoint={onOpenPoint} onOpenTab={onOpenTab} />

      {engagement.length > 0 && (
        <section aria-labelledby="engagement-title" className="space-y-2">
          <h2 id="engagement-title" className="font-space text-base font-bold text-slate-900">{t('attention.engagementTitle')}</h2>
          <p className="text-xs text-slate-500">{t('attention.engagementHint')}</p>
          {engagement.map((signal) => <SignalCard key={signal.key} signal={signal} classGroupId={classGroup.id} onAct={setActing} />)}
        </section>
      )}

      <InterventionForm
        open={Boolean(acting)}
        onClose={() => setActing(null)}
        onCreated={() => { openInterventions.reload(); }}
        classGroupId={classGroup.id}
        candidates={acting?.students ?? []}
        prefill={acting ? interventionDefaults(acting) : null}
        point={acting?.learningPoint ? { code: acting.learningPoint.code, title: acting.learningPoint.title } : null}
      />
    </div>
  );
}

function RecentChanges({ changes, classGroupId, onOpenPoint }) {
  const { t } = useTranslation('teacher');
  if (!changes) return null;
  const unnamed = t('common.unnamedStudent');
  const nothing = changes.improved + changes.declined + changes.firstAssessed === 0;

  return (
    <section aria-labelledby="changes-title" className="glass-card p-5 space-y-3" data-recent-changes>
      <div>
        <h2 id="changes-title" className="font-space text-base font-bold text-slate-900">{t('attention.changes.title')}</h2>
        <p className="text-xs text-slate-500">{t('attention.changes.subtitle')}</p>
      </div>
      {nothing ? <p className="text-sm text-slate-400">{t('attention.changes.none')}</p> : (
        <>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[['improved', ArrowUpRight, 'text-emerald-700 bg-emerald-50'], ['declined', ArrowDownRight, 'text-rose-700 bg-rose-50'], ['firstAssessed', Sparkles, 'text-sky-700 bg-sky-50']].map(([key, Icon, tone]) => (
              <div key={key} className={`rounded-xl px-2 py-2 ${tone}`} data-change={key}>
                <dt className="flex items-center justify-center gap-1 text-[11px] font-semibold"><Icon size={12} /> {t(`attention.changes.${key}`)}</dt>
                <dd className="font-mono-jetbrains text-lg font-bold tabular-nums" dir="ltr">{changes[key]}</dd>
              </div>
            ))}
          </dl>
          {changes.byLearningPoint?.length > 0 && (
            <div>
              <h3 className="mb-1 text-xs font-semibold text-slate-700">{t('attention.changes.byPoint')}</h3>
              <ul className="divide-y divide-slate-100 text-xs">
                {changes.byLearningPoint.map((p) => (
                  <li key={p.code} className="flex items-center gap-3 py-1.5">
                    <button type="button" onClick={() => onOpenPoint(p.code)} className="min-w-0 flex-1 truncate text-start font-semibold text-teal-800 hover:underline"><MathLabel>{p.title}</MathLabel></button>
                    {p.improved > 0 && <span className="text-emerald-700">↑ {p.improved}</span>}
                    {p.declined > 0 && <span className="text-rose-700">↓ {p.declined}</span>}
                    {p.firstAssessed > 0 && <span className="text-sky-700">• {p.firstAssessed}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {[['studentsImproved', changes.studentsImproved], ['studentsDeclined', changes.studentsDeclined]].map(([key, list]) => list?.length > 0 && (
            <p key={key} className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-slate-600">{t(`attention.changes.${key}`)}:</span>
              {list.map((s) => <Link key={s.id} to={`/enseignant/classes/${classGroupId}/eleves/${s.id}`} className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-700 hover:bg-teal-50">{studentName(s, unnamed)}</Link>)}
            </p>
          ))}
        </>
      )}
    </section>
  );
}

function LearningMapSummary({ map, onOpenPoint, onOpenTab }) {
  const { t } = useTranslation('teacher');
  return (
    <section aria-labelledby="map-title" className="glass-card p-5 space-y-3" data-learning-map-summary>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="map-title" className="font-space text-base font-bold text-slate-900">{t('attention.map.title')}</h2>
          <p className="text-xs text-slate-500">{t('attention.map.subtitle')}</p>
        </div>
        <button type="button" onClick={() => onOpenTab('learningPoints')} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline"><MapIcon size={13} /> {t('attention.map.open')}</button>
      </div>
      {map.loading && <Loading />}
      {map.error && <ErrorBox message={map.error} onRetry={map.reload} />}
      {map.data && !map.loading && (map.data.lessons?.length === 0
        ? <p className="text-sm text-slate-400">{t('learningPoints.noLessons')}</p>
        : (
          <div className="space-y-4">
            {map.data.lessons.map((lesson) => (
              <div key={lesson.code}>
                <h3 className="mb-1 text-xs font-semibold text-teal-800"><MathLabel>{lesson.title}</MathLabel></h3>
                <ul className="space-y-1">
                  {lesson.learningPoints.map((lp) => {
                    const segments = barSegments(lp.counts);
                    const label = segments.map((s) => `${t(`students.masteryStatus.${s.key}`)} ${s.count}`).join(' · ');
                    return (
                      <li key={lp.code}>
                        <button type="button" onClick={() => onOpenPoint(lp.code)} className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-start hover:bg-slate-50" data-map-point={lp.code}>
                          <span className="min-w-0 flex-1 truncate text-xs text-slate-700"><MathLabel>{lp.title}</MathLabel></span>
                          <span className="flex h-2 w-40 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:w-56" role="img" aria-label={label} title={label}>
                            {segments.map((s) => s.percent > 0 && <span key={s.key} className={`h-full ${LP_STATUS_BAR[s.key]}`} style={{ width: `${s.percent}%` }} />)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
    </section>
  );
}
