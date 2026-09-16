import React, { useCallback, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import AdminPage from '../../../components/admin/AdminPage';
import StatusBadge from '../../../components/admin/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/admin/ui/Modal';
import { LoadingState, ErrorState } from '../../../components/admin/ui/states';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { AuthContext } from '../../../context/AuthContext';
import { fetchActivationCode, revokeActivationCode } from '../../../services/admin/activationCodeService';

const DATE_TIME = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
const formatDateTime = (iso) => (iso ? DATE_TIME.format(new Date(iso)) : '—');

const ACTION_LABELS = {
  'activation_codes.generated': 'Lot généré',
  'activation_code.revoked': 'Code révoqué',
  'activation_code_batch.revoked': 'Lot révoqué',
  'activation_codes.exported': 'Codes exportés',
};

/**
 * Un code, et l'histoire qui explique son état.
 *
 * Le code en clair n'est pas ici, et ne peut pas y être : la base n'en garde
 * qu'une empreinte. Ce que cet écran montre — l'indice, les dates, l'élève,
 * le droit ouvert, le journal — est tout ce qui permet de répondre à
 * « que s'est-il passé avec cette carte ? ».
 */
export default function AdminActivationCodeDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  useDocumentMeta('Code d’activation — Administration');

  const loader = useCallback((authToken) => fetchActivationCode(authToken, id), [id]);
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [revokeError, setRevokeError] = useState(null);

  const code = data?.code;
  const batch = data?.batch;
  const entitlement = data?.entitlement;
  const history = data?.history ?? [];

  const confirmRevoke = async () => {
    if (!reason.trim()) {
      setRevokeError('Indiquez le motif de la révocation.');
      return;
    }

    setBusy(true);
    setRevokeError(null);
    try {
      await revokeActivationCode(token, id, reason.trim());
      setConfirming(false);
      setReason('');
      reload();
    } catch (caught) {
      setRevokeError(caught.message || 'Impossible de révoquer ce code.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <AdminPage eyebrow="Accès" title="Code d’activation"><LoadingState rows={5} /></AdminPage>;
  if (error) return <AdminPage eyebrow="Accès" title="Code d’activation"><ErrorState message={error} onRetry={reload} /></AdminPage>;
  if (!code) return null;

  const isActivated = code.status === 'activated';
  const canRevoke = code.status !== 'revoked';

  return (
    <AdminPage
      eyebrow={<Link to="/admin/codes-activation" className="hover:underline">Codes d’activation</Link>}
      title={`Code ••••-••••-${code.hint}`}
      subtitle={batch?.label ? `Lot « ${batch.label} »` : undefined}
      actions={canRevoke ? (
        <button
          type="button"
          onClick={() => { setConfirming(true); setReason(''); setRevokeError(null); }}
          className="rounded-lg border border-rose-300 bg-white px-3 py-2 font-inter text-xs font-semibold text-rose-700 hover:bg-rose-50"
        >
          Révoquer
        </button>
      ) : null}
    >
      <div className="space-y-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-space text-sm font-bold text-slate-800">Le code</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <Row label="Statut"><StatusBadge status={code.status} /></Row>
            <Row label="Indice">
              <span className="font-mono-jetbrains text-xs" dir="ltr">••••-••••-{code.hint}</span>
            </Row>
            <Row label="Créé le">{formatDateTime(code.createdAt)}</Row>
            <Row label="Utilisable jusqu’au">{formatDateTime(code.expiresAt)}</Row>
            <Row label="Activé le">{formatDateTime(code.activatedAt)}</Row>
            <Row label="Activé par">
              {code.activatedBy
                ? <Link to={`/admin/eleves/${code.activatedBy.id}`} className="text-blue-700 hover:underline">{code.activatedBy.email}</Link>
                : '—'}
            </Row>
            {code.revokedAt && (
              <>
                <Row label="Révoqué le">{formatDateTime(code.revokedAt)}</Row>
                <Row label="Révoqué par">{code.revokedBy ?? '—'}</Row>
                <Row label="Motif">{code.revokeReason ?? '—'}</Row>
              </>
            )}
          </dl>

          <p className="mt-3 font-inter text-[11px] text-slate-500">
            Le code lui-même n’est pas conservé : seule son empreinte l’est. Il ne peut donc être
            ni réaffiché, ni retrouvé — c’est ce qui fait qu’une fuite de la base ne donne aucun
            code utilisable.
          </p>
        </section>

        {batch && (
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 font-space text-sm font-bold text-slate-800">Le lot</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Row label="Nom">{batch.label}</Row>
              <Row label="Codes produits">{batch.quantity}</Row>
              <Row label="Accès ouvert">
                {batch.accessEndsAt
                  ? `jusqu’au ${formatDateTime(batch.accessEndsAt)}`
                  : batch.accessDays
                    ? `${batch.accessDays} jour(s) à compter de la saisie`
                    : 'sans fin'}
              </Row>
              <Row label="Créé par">{batch.createdBy ?? '—'}</Row>
              {batch.notes && <Row label="Notes">{batch.notes}</Row>}
            </dl>
          </section>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-space text-sm font-bold text-slate-800">Le droit d’accès</h2>
          {entitlement ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <Row label="État">
                <StatusBadge status={entitlement.status === 'active' ? 'active' : 'revoked'} />
                {entitlement.valid ? ' · ouvre l’accès' : ' · n’ouvre plus l’accès'}
              </Row>
              <Row label="Depuis">{formatDateTime(entitlement.startsAt)}</Row>
              <Row label="Jusqu’au">{entitlement.expiresAt ? formatDateTime(entitlement.expiresAt) : 'sans fin'}</Row>
              {entitlement.revokedAt && <Row label="Révoqué le">{formatDateTime(entitlement.revokedAt)}</Row>}
            </dl>
          ) : (
            <p className="font-inter text-xs text-slate-500">
              Aucun droit : ce code n’a pas encore été saisi.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-space text-sm font-bold text-slate-800">Journal</h2>
          {history.length === 0 ? (
            <p className="font-inter text-xs text-slate-500">Aucune action d’administration sur ce code.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {history.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                  <span className="font-inter text-xs font-semibold text-slate-800">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </span>
                  <span className="font-inter text-xs text-slate-500">
                    {entry.admin ?? '—'} · {formatDateTime(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={confirmRevoke}
        title="Révoquer ce code ?"
        tone="danger"
        confirmLabel="Révoquer"
        busy={busy}
        message={(
          <div className="space-y-3">
            {isActivated && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="font-inter text-xs text-amber-900">
                  Ce code a déjà été activé. Le révoquer FERMERA l’accès de
                  {code.activatedBy ? ` ${code.activatedBy.email}` : ' l’élève concerné'}.
                </p>
              </div>
            )}
            <p className="font-inter text-xs text-slate-600">
              La ligne n’est jamais supprimée : l’historique reste lisible.
            </p>
            <label className="block">
              <span className="mb-1 block font-inter text-xs font-semibold text-slate-700">Motif (obligatoire)</span>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={255}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-inter text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Carte revendue deux fois"
              />
            </label>
            {revokeError && <p role="alert" className="font-inter text-xs text-rose-700">{revokeError}</p>}
          </div>
        )}
      />
    </AdminPage>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <dt className="font-inter text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="font-inter text-xs text-slate-800">{children}</dd>
    </div>
  );
}
