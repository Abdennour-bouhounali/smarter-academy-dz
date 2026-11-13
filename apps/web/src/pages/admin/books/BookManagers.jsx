import { useCallback, useContext, useState } from 'react';
import { KeyRound, UserCheck, UserPlus } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { AdminPage, AdminCard, formatDate, input, label, btnPrimary, btnSecondary, btnGhost } from '../adminUi';
import DataTable from '../../../components/admin/ui/DataTable';
import { EmptyState } from '../../../components/admin/ui/states';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { fetchBookManagers, createBookManager, setBookManagerStatus, resetBookManagerPassword } from '../../../features/books/bookService';
import { S } from '../../../features/books/strings';
import { Pill } from './BookOrders';

const A = S.admin;
const M = S.admin.managers;
const EMPTY = { firstName: '', lastName: '', email: '' };

/**
 * « مسيّرو المكتبة » — l'administrateur crée ici les comptes `book_manager`
 * (BOOKS_STORE.md §6ter). Le mot de passe n'est montré qu'UNE fois, à la création
 * ou à la réinitialisation : l'administrateur le remet lui-même.
 */
export default function AdminBookManagers() {
  useDocumentMeta(M.title);
  const { token } = useContext(AuthContext);
  const loader = useCallback((t) => fetchBookManagers(t), []);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);
  const [secret, setSecret] = useState(null); // { email, password }
  const [copied, setCopied] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      const res = await createBookManager(token, form);
      setSecret({ email: res.manager.email, password: res.password });
      setForm(null);
      reload();
    } catch (err) {
      setFormError(err.reason === 'email_taken' ? M.emailTaken : err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (m) => {
    await setBookManagerStatus(token, m.id, m.status === 'active' ? 'suspended' : 'active');
    reload();
  };

  const reset = async (m) => {
    if (!window.confirm(M.confirmReset)) return;
    const res = await resetBookManagerPassword(token, m.id);
    setSecret({ email: m.email, password: res.password });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secret.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* le mot de passe reste lisible à l'écran */ }
  };

  return (
    <AdminPage
      eyebrow={A.eyebrow}
      title={M.title}
      subtitle={M.subtitle}
      actions={!form && (
        <button type="button" className={btnPrimary} onClick={() => { setForm(EMPTY); setSecret(null); setFormError(null); }}>
          <UserPlus size={16} /> {M.add}
        </button>
      )}
    >
      <div className="space-y-4">
        {secret && (
          <AdminCard title={M.passwordTitle} className="border-amber-300 bg-amber-50">
            <p className="mb-3 font-inter text-sm text-slate-700">{M.passwordHint}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span dir="ltr" className="font-mono-jetbrains text-sm text-slate-600">{secret.email}</span>
              <code dir="ltr" className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-mono-jetbrains text-base font-bold text-slate-900 select-all">{secret.password}</code>
              <button type="button" className={btnSecondary} onClick={copy}>{copied ? M.copied : M.copy}</button>
              <button type="button" className={btnGhost} onClick={() => setSecret(null)}>{M.done}</button>
            </div>
            <p className="mt-2 font-inter text-xs text-slate-500">{M.loginAt}</p>
          </AdminCard>
        )}

        {form && (
          <AdminCard title={M.add}>
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="bm-first">{M.firstName}</label>
                <input id="bm-first" required maxLength={80} className={input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="bm-last">{M.lastName}</label>
                <input id="bm-last" required maxLength={80} className={input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="bm-email">{M.email}</label>
                <input id="bm-email" type="email" dir="ltr" required maxLength={190} className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {formError && <p className="sm:col-span-3 font-inter text-sm text-rose-600">{formError}</p>}
              <div className="flex gap-2 sm:col-span-3">
                <button type="submit" disabled={busy} className={btnPrimary}>{busy ? M.creating : M.create}</button>
                <button type="button" className={btnSecondary} onClick={() => setForm(null)}>{M.cancel}</button>
              </div>
            </form>
          </AdminCard>
        )}

        <DataTable
          rows={data?.managers ?? []}
          loading={loading}
          error={error}
          onRetry={reload}
          empty={<EmptyState icon={UserCheck} title={M.none} />}
          columns={[
            { key: 'name', label: M.name, render: (m) => (
              <div>
                <span className="font-semibold text-slate-900">{m.firstName} {m.lastName}</span>
                <span dir="ltr" className="block text-xs text-slate-500">{m.email}</span>
              </div>
            ) },
            { key: 'status', label: M.status, render: (m) => (
              <Pill tone={m.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                {m.status === 'active' ? M.active : M.suspended}
              </Pill>
            ) },
            { key: 'created', label: M.created, render: (m) => <span className="whitespace-nowrap text-slate-500">{formatDate(m.createdAt)}</span> },
            { key: 'last', label: M.lastActivity, render: (m) => <span className="whitespace-nowrap text-slate-500">{m.lastActivityAt ? formatDate(m.lastActivityAt, { withTime: true }) : '—'}</span> },
            { key: 'actions', label: '', render: (m) => (
              <div className="flex flex-wrap gap-1">
                <button type="button" className={btnGhost} onClick={() => toggle(m)}>{m.status === 'active' ? M.suspend : M.reactivate}</button>
                <button type="button" className={btnGhost} onClick={() => reset(m)}><KeyRound size={14} /> {M.resetPassword}</button>
              </div>
            ) },
          ]}
        />
      </div>
    </AdminPage>
  );
}
