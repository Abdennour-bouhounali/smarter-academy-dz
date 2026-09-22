import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, KeyRound, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useStudyContext } from '../../context/StudyContextContext';
import { useContentAvailability } from '../../context/ContentAvailabilityContext';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { joinClassGroup, leaveClassGroup } from '../../services/studyContextService';
import { ConfirmDialog } from '../../components/admin/ui/Modal';
import { getAllGrades } from '@smarter-academy/core';
import { LOCALE } from '../../locale';

/**
 * « قسمي » — la classe de l'enseignant que l'élève a rejointe, ou peut
 * rejoindre par code (six symboles, en LTR comme un code d'activation) ou
 * par le jeton d'une invitation (`?token=`).
 *
 * Cette page n'AUTORISE rien : elle transmet un code et affiche ce que le
 * serveur a décidé. Quitter une classe ne touche à aucune donnée
 * d'apprentissage, et la confirmation le dit.
 */
function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCodeInput(raw) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

export default function Qism() {
  const { t } = useTranslation('student');
  useDocumentMeta(t('qism.metaTitle'), t('qism.metaDescription'));
  const { token } = useContext(AuthContext);
  const { studyContext, refresh } = useStudyContext();
  const { refresh: refreshAvailability, hiddenByClassCount } = useContentAvailability();
  const [searchParams, setSearchParams] = useSearchParams();

  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [busy, setBusy] = useState(false);

  const invitationToken = searchParams.get('token');

  const messageFor = (err) => {
    if (err?.type === 'RATE_LIMITED') return t('qism.errors.rate_limited');
    return t(`qism.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('qism.errors.generic') });
  };

  const afterJoin = async (result) => {
    setSuccess(result?.studyContext?.primary?.name ?? '');
    setCode('');
    await Promise.all([refresh().catch(() => {}), refreshAvailability().catch(() => {})]);
  };

  // Un jeton d'invitation dans l'URL : on l'accepte une fois, puis on nettoie.
  useEffect(() => {
    if (!invitationToken || !token) return;
    let cancelled = false;
    (async () => {
      setPending(true);
      setError(null);
      try {
        const result = await joinClassGroup(token, { token: invitationToken });
        if (!cancelled) await afterJoin(result);
      } catch (err) {
        if (!cancelled) setError(messageFor(err));
      } finally {
        if (!cancelled) {
          setPending(false);
          const next = new URLSearchParams(searchParams);
          next.delete('token');
          setSearchParams(next, { replace: true });
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationToken, token]);

  const handleJoin = async (event) => {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setSuccess(null);
    if (!code.trim()) {
      setError(t('qism.errors.invalid'));
      return;
    }
    setPending(true);
    try {
      const result = await joinClassGroup(token, { code });
      await afterJoin(result);
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setPending(false);
    }
  };

  const handleLeave = async () => {
    if (!leaving) return;
    setBusy(true);
    try {
      await leaveClassGroup(token, leaving.id);
      setLeaving(null);
      await Promise.all([refresh().catch(() => {}), refreshAvailability().catch(() => {})]);
    } catch (err) {
      setError(messageFor(err));
      setLeaving(null);
    } finally {
      setBusy(false);
    }
  };

  const gradeName = (code) => getAllGrades().find((g) => g.id === code)?.name ?? code;

  return (
    <div className="sa-page py-8 sm:py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('qism.title')}</h1>
          <p className="text-slate-600">{t('qism.subtitle')}</p>
        </header>

        {success !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="glass-card p-5 border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold text-emerald-900">{t('qism.joinSuccess', { name: success })}</p>
          </motion.div>
        )}

        <section className="glass-card p-5 sm:p-6" aria-label={t('qism.currentTitle')} data-qism-current>
          {studyContext.mode === 'classroom' ? (
            <>
              <h2 className="font-semibold text-slate-900 mb-3">{t('qism.currentTitle')}</h2>
              <ul className="space-y-3">
                {studyContext.classrooms.map((c) => (
                  <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0"><Users size={18} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-space font-bold text-slate-900">{c.name}</p>
                      <p className="text-sm text-slate-600">{t('qism.teacherLabel')}: {c.teacherName || '—'} · {t('qism.gradeLabel')}: {gradeName(c.grade)}</p>
                      {c.joinedAt && <p className="text-xs text-slate-400 mt-0.5">{t('qism.joinedAt', { date: formatDate(c.joinedAt) })}</p>}
                    </div>
                    <button type="button" onClick={() => setLeaving(c)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-700">
                      <LogOut size={13} /> {t('qism.leave')}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-500">{t('qism.hiddenLessons', { count: hiddenByClassCount })}</p>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-slate-900">{t('qism.independentTitle')}</h2>
              <p className="text-sm text-slate-600 mt-1">{t('qism.independentBody')}</p>
            </>
          )}
        </section>

        <section className="glass-card p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900">{t('qism.joinTitle')}</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{t('qism.joinBody')}</p>
          <form onSubmit={handleJoin} noValidate className="space-y-4">
            <div className="relative">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3 text-slate-400 pointer-events-none"><KeyRound className="w-5 h-5" /></span>
              <input
                id="join-code"
                name="code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                dir="ltr"
                value={code}
                onChange={(e) => setCode(formatCodeInput(e.target.value))}
                placeholder={t('qism.codePlaceholder')}
                aria-label={t('qism.codeLabel')}
                aria-invalid={error ? 'true' : undefined}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-mono tracking-[0.3em] text-lg text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>
            {error && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800">{error}</p>
              </div>
            )}
            <button type="submit" disabled={pending} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed">
              {pending ? t('qism.joining') : t('qism.join')}
            </button>
          </form>
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(leaving)}
        onClose={() => setLeaving(null)}
        onConfirm={handleLeave}
        busy={busy}
        tone="danger"
        title={t('qism.leaveConfirmTitle', { name: leaving?.name ?? '' })}
        message={<p>{t('qism.leaveConfirmBody')}</p>}
        confirmLabel={t('qism.leaveConfirm')}
        cancelLabel={t('qism.cancel')}
        busyLabel={t('qism.joining')}
        closeLabel={t('qism.cancel')}
      />
    </div>
  );
}
