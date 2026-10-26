import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, ClipboardList, GraduationCap, Presentation, School, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { fetchSchoolOverview } from '../../services/schoolService';

const COMING = [
  { key: 'structure', icon: Users },
  { key: 'tracking', icon: BarChart3 },
  { key: 'reports', icon: ClipboardList },
  { key: 'meeting', icon: Presentation },
];

function Figure({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5" data-school-figure>
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={18} aria-hidden="true" />
        <p className="font-inter text-sm">{label}</p>
      </div>
      <p className="mt-2 font-space text-3xl font-bold text-slate-900" dir="ltr">{value}</p>
      {hint && <p className="mt-1 font-inter text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/**
 * « لوحة المؤسسة » — l'accueil du directeur (SCHOOL_ADMIN_SPACE.md §6).
 *
 * Des COMPTES, jamais une moyenne. Les élèves comptés sont ceux qui ont
 * consenti à la lecture de l'établissement — le texte le dit sous le chiffre.
 * Les sections à venir sont annoncées « قيد الإعداد », non cliquables.
 */
export default function SchoolHome() {
  const { t } = useTranslation('idara');
  useDocumentMeta(t('meta.home'));
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchSchoolOverview(token)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setProblem(e.reason ? t(`errors.${e.reason}`, { defaultValue: t('errors.generic') }) : e.message));
    return () => { alive = false; };
  }, [token, t]);

  if (problem) {
    return <p role="alert" className="rounded-xl bg-red-50 p-4 font-inter text-sm text-red-700">{problem}</p>;
  }
  if (!data) {
    return <div className="h-64" aria-busy="true" />;
  }

  const { school, counts } = data;
  return (
    <div className="space-y-8">
      <header className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <School size={28} aria-hidden="true" />
        </div>
        <div>
          <p className="font-inter text-sm text-slate-500">{t('home.eyebrow')}</p>
          <h1 className="font-space text-2xl font-bold text-slate-900">{school.name}</h1>
          <p className="mt-1 font-inter text-sm text-slate-600">
            {[school.wilaya, school.commune].filter(Boolean).join(' · ')}
            {' — '}
            {t('home.yearLabel')}: <span dir="ltr">{school.currentAcademicYear || t('home.noYear')}</span>
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Figure icon={School} label={t('home.classes')} value={counts.classes} />
        <Figure icon={GraduationCap} label={t('home.teachers')} value={counts.teachers} />
        <Figure icon={Users} label={t('home.students')} value={counts.students} hint={t('home.studentsHint')} />
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="font-space text-lg font-bold text-slate-900">{t('home.comingTitle')}</h2>
        <p className="mt-1 font-inter text-sm text-slate-600">{t('home.comingText')}</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {COMING.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 font-inter text-sm text-slate-500" aria-disabled="true">
              <Icon size={18} aria-hidden="true" />
              {t(`home.coming.${key}`)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
