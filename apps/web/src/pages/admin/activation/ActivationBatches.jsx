import React, { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import DataTable from '../../../components/admin/ui/DataTable';
import { ConfirmDialog } from '../../../components/admin/ui/Modal';
import { EmptyState } from '../../../components/admin/ui/states';
import { FilterBar, SearchInput, Pagination } from '../../../components/admin/ui/FilterBar';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useDebounced } from '../../../hooks/useDebounced';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { AuthContext } from '../../../context/AuthContext';
import { fetchActivationBatches, revokeActivationBatch } from '../../../services/admin/activationCodeService';

const DATE = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' });
const formatDate = (iso) => (iso ? DATE.format(new Date(iso)) : '—');

/**
 * Les LOTS : ce qui a été imprimé d'un coup, et ce qu'il en reste.
 *
 * La vue opérationnelle du stock physique — « le lot d'Oran, 100 cartes, 37
 * activées, 2 révoquées ». C'est aussi d'ici qu'on neutralise un lot égaré,
 * ce qui ne touche que les codes ENCORE DISPONIBLES : fermer d'un clic
 * l'accès de trente élèves ayant payé serait un geste bien trop lourd pour
 * être groupé.
 */
export default function AdminActivationBatches() {
  useDocumentMeta('Lots de codes — Administration');

  const { token } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounced(search, 300);

  const [pendingRevoke, setPendingRevoke] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [revokeError, setRevokeError] = useState(null);

  const loader = useCallback(
    (authToken) => fetchActivationBatches(authToken, { search: debouncedSearch, page }),
    [debouncedSearch, page],
  );
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  const confirmRevoke = async () => {
    if (!reason.trim()) {
      setRevokeError('Indiquez le motif de la révocation.');
      return;
    }

    setBusy(true);
    setRevokeError(null);
    try {
      await revokeActivationBatch(token, pendingRevoke.id, reason.trim());
      setPendingRevoke(null);
      setReason('');
      reload();
    } catch (caught) {
      setRevokeError(caught.message || 'Impossible de révoquer ce lot.');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: 'label',
      header: 'Lot',
      render: (row) => (
        <Link to={`/admin/codes-activation?batch=${row.id}`} className="font-semibold text-blue-700 hover:underline">
          {row.label}
        </Link>
      ),
    },
    { key: 'quantity', header: 'Produits', render: (row) => row.quantity },
    { key: 'available', header: 'Disponibles', render: (row) => row.codeCounts?.available ?? 0 },
    { key: 'activated', header: 'Activés', render: (row) => row.codeCounts?.activated ?? 0 },
    { key: 'expired', header: 'Expirés', render: (row) => row.codeCounts?.expired ?? 0 },
    { key: 'revoked', header: 'Révoqués', render: (row) => row.codeCounts?.revoked ?? 0 },
    {
      key: 'access',
      header: 'Accès ouvert',
      render: (row) => {
        if (row.accessEndsAt) return `jusqu’au ${formatDate(row.accessEndsAt)}`;
        if (row.accessDays) return `${row.accessDays} jour(s)`;
        return 'sans fin';
      },
    },
    { key: 'redeemBy', header: 'Utilisable jusqu’au', render: (row) => formatDate(row.redeemBy) },
    { key: 'createdAt', header: 'Créé le', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        (row.codeCounts?.available ?? 0) > 0 ? (
          <button
            type="button"
            onClick={() => { setPendingRevoke(row); setReason(''); setRevokeError(null); }}
            className="font-inter text-xs font-semibold text-rose-700 hover:underline"
          >
            Révoquer les disponibles
          </button>
        ) : null
      ),
    },
  ];

  return (
    <AdminPage
      eyebrow="Accès"
      title="Lots de codes"
      subtitle="Ce qui a été imprimé, et ce qu’il en reste."
    >
      <div className="space-y-3">
        <FilterBar>
          <SearchInput
            value={search}
            onChange={(value) => { setSearch(value); setPage(1); }}
            placeholder="Nom du lot…"
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={data?.batches?.data ?? []}
          loading={loading}
          error={error}
          onRetry={reload}
          empty={<EmptyState title="Aucun lot" hint="Générez un lot depuis la liste des codes." />}
        />

        <Pagination meta={data?.batches} onPage={setPage} />
      </div>

      <ConfirmDialog
        open={pendingRevoke !== null}
        onClose={() => setPendingRevoke(null)}
        onConfirm={confirmRevoke}
        title={`Révoquer les codes disponibles de « ${pendingRevoke?.label ?? ''} » ?`}
        tone="danger"
        confirmLabel="Révoquer"
        busy={busy}
        message={(
          <div className="space-y-3">
            <p className="font-inter text-xs text-slate-600">
              {pendingRevoke?.codeCounts?.available ?? 0} code(s) encore disponible(s) seront neutralisés
              définitivement. Les {pendingRevoke?.codeCounts?.activated ?? 0} code(s) déjà activé(s) ne sont
              PAS touchés : l’accès des élèves qui ont payé reste ouvert.
            </p>
            <label className="block">
              <span className="mb-1 block font-inter text-xs font-semibold text-slate-700">Motif (obligatoire)</span>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={255}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-inter text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Lot égaré pendant la distribution"
              />
            </label>
            {revokeError && (
              <p role="alert" className="font-inter text-xs text-rose-700">{revokeError}</p>
            )}
          </div>
        )}
      />
    </AdminPage>
  );
}
