import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Copy, Check, X } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { fetchClassInvitations, sendClassInvitation, revokeClassInvitation } from '../../../services/teacher/classGroupService';
import { btnPrimary, input, formatDate } from '../../../pages/teacher/teacherUi';

/** Inviter par courriel ; la liste des invitations et leur état. */
export default function InvitationsPanel({ classGroup }) {
  const { t } = useTranslation('teacher');
  const { token } = useContext(AuthContext);
  const loader = useCallback((tk) => fetchClassInvitations(tk, classGroup.id), [classGroup.id]);
  const { data: invitations, reload } = useAdminResource(loader, [loader]);
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async (event) => {
    event.preventDefault();
    if (pending || !email.trim()) return;
    setPending(true);
    setError(null);
    setSent(null);
    try {
      const result = await sendClassInvitation(token, classGroup.id, email.trim());
      setSent({ email: result.invitation.email, joinUrl: result.joinUrl });
      setEmail('');
      reload();
    } catch (err) {
      setError(t(`invitations.errors.${err?.reason ?? 'generic'}`, { defaultValue: t('invitations.errors.generic') }));
    } finally {
      setPending(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(sent.joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* le lien reste affiché */ }
  };

  const revoke = async (id) => {
    try {
      await revokeClassInvitation(token, classGroup.id, id);
      reload();
    } catch (err) {
      setError(t('invitations.errors.generic'));
    }
  };

  return (
    <section className="glass-card p-5" data-invitations>
      <h3 className="font-space font-bold text-slate-900 flex items-center gap-2"><Mail size={16} /> {t('invitations.title')}</h3>
      <p className="mt-1 text-sm text-slate-500">{t('invitations.hint')}</p>
      <form onSubmit={handleSend} className="mt-3 flex flex-col sm:flex-row gap-2">
        <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eleve@example.dz" aria-label={t('invitations.emailLabel')} className={input} required />
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? t('invitations.sending') : t('invitations.send')}</button>
      </form>
      {error && <p role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}
      {sent && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm" role="status">
          <p className="font-semibold text-emerald-900">{t('invitations.sent', { email: sent.email })}</p>
          <p className="mt-1 text-xs text-slate-600">{t('invitations.link')}</p>
          <div className="mt-1 flex items-center gap-2">
            <code dir="ltr" className="flex-1 min-w-0 truncate rounded-lg bg-white px-2 py-1 text-[11px] text-slate-700 border border-slate-200">{sent.joinUrl}</code>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800">{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t('classes.copied') : t('invitations.copyLink')}</button>
          </div>
        </div>
      )}
      {invitations && invitations.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {invitations.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span dir="ltr" className="min-w-0 truncate text-slate-700">{inv.email}</span>
              <span className="flex items-center gap-3 shrink-0">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${inv.status === 'pending' ? 'bg-amber-50 text-amber-700' : inv.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{t(`invitations.status.${inv.status}`)}</span>
                {inv.status === 'pending' && inv.expiresAt && <span className="text-xs text-slate-400">{t('invitations.expiresAt', { date: formatDate(inv.expiresAt) })}</span>}
                {inv.status === 'pending' && <button type="button" onClick={() => revoke(inv.id)} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-700"><X size={12} /> {t('invitations.revoke')}</button>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
