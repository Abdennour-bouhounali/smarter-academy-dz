import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { previewInvitation } from '../services/studyContextService';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getAllGrades } from '@smarter-academy/core';

/**
 * « /rejoindre/:token » — le lien d'une invitation, ouvert depuis un courriel,
 * souvent sans compte. On montre ce que le serveur révèle (nom de la classe,
 * enseignant), puis :
 *
 *   élève connecté   → /espace/qism?token=…  (accepté là, par l'API)
 *   sans compte      → se connecter / créer un compte élève, puis revenir
 *
 * Aucune adhésion n'est créée ici : la page n'a pas de jeton d'API.
 */
export default function JoinInvitation() {
  const { t } = useTranslation('student');
  const { token: inviteToken } = useParams();
  const { user, loading } = useContext(AuthContext);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);
  useDocumentMeta(t('qism.metaTitle'), t('qism.metaDescription'));

  useEffect(() => {
    let cancelled = false;
    previewInvitation(inviteToken)
      .then((data) => { if (!cancelled) setInvitation(data); })
      .catch((err) => { if (!cancelled) setError(t(`qism.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('qism.errors.generic') })); });
    return () => { cancelled = true; };
  }, [inviteToken, t]);

  if (!loading && user?.role === 'student') {
    return <Navigate to={`/espace/qism?token=${encodeURIComponent(inviteToken)}`} replace />;
  }

  const next = `/rejoindre/${encodeURIComponent(inviteToken)}`;
  const gradeName = (code) => getAllGrades().find((g) => g.id === code)?.name ?? code;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 pt-24 pb-12 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-white/50">
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-800">{error}</p>
          </div>
        )}
        {invitation && (
          <>
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4"><Users size={22} /></div>
            <h1 className="text-center text-2xl font-bold text-slate-900">{t('qism.invitationTitle', { name: invitation.classroomName })}</h1>
            <p className="mt-3 text-center text-sm text-slate-600">
              {t('qism.invitationBody', { teacher: invitation.teacherName || '—', grade: gradeName(invitation.grade) })}
            </p>
            {user && user.role !== 'student' ? (
              <p className="mt-6 text-center text-sm text-amber-800">{t('qism.errors.not_a_student')}</p>
            ) : (
              <>
                <p className="mt-6 text-center text-sm text-slate-600">{t('qism.invitationNeedsAccount')}</p>
                <div className="mt-4 grid gap-2">
                  <Link to={`/login?next=${encodeURIComponent(next)}`} className="flex w-full justify-center rounded-xl bg-teal-700 py-3 px-4 text-sm font-semibold text-white hover:bg-teal-800">{t('qism.invitationLogin')}</Link>
                  <Link to={`/register?next=${encodeURIComponent(next)}`} className="flex w-full justify-center rounded-xl border border-slate-300 bg-white py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">{t('qism.invitationRegister')}</Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
