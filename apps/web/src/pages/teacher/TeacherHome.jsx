import { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Plus, BadgeCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { fetchTeacherDashboard } from '../../services/teacher/classGroupService';
import { getDisplayName } from '../../utils/userDisplay';
import UsageMeter from '../../features/teacher/usage/UsageMeter';
import { isDefaultPlan } from '../../features/teacher/entitlementSummary';
import { TeacherPage, Loading, ErrorBox, btnPrimary, formatDate } from './teacherUi';
import ClassGroupCard from '../../features/teacher/members/ClassGroupCard';

/** L'accueil de l'espace enseignant : ses classes, son usage, son offre. */
export default function TeacherHome() {
  const { t } = useTranslation('teacher');
  useDocumentMeta(t('home.metaTitle'), t('home.metaDescription'));
  const { user } = useContext(AuthContext);
  const loader = useCallback((token) => fetchTeacherDashboard(token), []);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  const ent = data?.entitlements;
  const plan = ent?.plan;

  return (
    <TeacherPage eyebrow={t('space')} title={t('home.greeting', { name: getDisplayName(user) })} subtitle={t('home.tagline')}>
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && (
        <div className="space-y-8">
          <section data-tour="teacher-home.usage">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-space font-bold text-slate-900">{t('home.usageTitle')}</h2>
              <Link to="/enseignant/offre" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 hover:underline">
                <BadgeCheck size={14} /> {isDefaultPlan(plan) ? t('home.planDefault') : plan?.name}
                {plan?.endsAt && !isDefaultPlan(plan) && <span className="text-slate-400 font-normal">· {t('home.planUntil', { date: formatDate(plan.endsAt) })}</span>}
              </Link>
            </div>
            {/* Les SIÈGES d'abord : c'est l'unité de l'offre. Les classes ne
                sont que des contenants (∞ sauf limite technique). */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UsageMeter label={t('home.seats')} meter={ent.students} hint={ent.classes.maximum == null ? t('home.classesUnlimited') : undefined} />
              <UsageMeter label={t('home.classes')} meter={ent.classes} />
            </div>
            {ent.students.overLimit || ent.classes.overLimit ? (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">{t('home.overLimit')}</p>
            ) : (ent.students.maximum != null && ent.students.current >= ent.students.maximum) ? (
              <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700" role="status" data-seats-full>
                {t('home.seatsFull', { count: ent.students.maximum })} <Link to="/enseignant/offre" className="font-semibold text-teal-800 hover:underline">{t('home.plan')}</Link>
              </p>
            ) : null}
            {ent.request && (
              <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900" role="status">{t('home.pendingRequest', { plan: ent.request.planName })}</p>
            )}
          </section>

          <section data-tour="teacher-home.classes">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-space font-bold text-slate-900">{t('home.classesTitle')}</h2>
              <Link to="/enseignant/classes/nouveau" className={btnPrimary} aria-disabled={!ent.classes.canCreate} data-new-class>
                <Plus size={15} /> {t('home.newClass')}
              </Link>
            </div>
            {data.classrooms.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <Users size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="font-space font-bold text-slate-800">{t('home.noClassesTitle')}</p>
                <p className="mt-1 font-inter text-sm text-slate-500">{t('home.noClassesBody')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.classrooms.slice(0, 4).map((c) => <ClassGroupCard key={c.id} classGroup={c} />)}
              </div>
            )}
            {data.classrooms.length > 4 && (
              <Link to="/enseignant/classes" className="mt-3 inline-block text-sm font-semibold text-teal-800 hover:underline">{t('home.seeAll')}</Link>
            )}
          </section>
        </div>
      )}
    </TeacherPage>
  );
}
