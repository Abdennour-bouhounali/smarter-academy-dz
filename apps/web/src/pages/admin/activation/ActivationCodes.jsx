import React, { useCallback, useContext, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Download, Plus, AlertTriangle } from 'lucide-react';
import AdminPage from '../../../components/admin/AdminPage';
import DataTable from '../../../components/admin/ui/DataTable';
import StatusBadge from '../../../components/admin/ui/StatusBadge';
import Modal from '../../../components/admin/ui/Modal';
import { EmptyState } from '../../../components/admin/ui/states';
import { FilterBar, SearchInput, SelectFilter, Pagination } from '../../../components/admin/ui/FilterBar';
import { useAdminResource } from '../../../hooks/useAdminResource';
import { useDebounced } from '../../../hooks/useDebounced';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { AuthContext } from '../../../context/AuthContext';
import {
  fetchActivationCodes,
  fetchActivationBatches,
  generateActivationBatch,
  downloadActivationCodesCsv,
  downloadGeneratedCodesCsv,
} from '../../../services/admin/activationCodeService';

const DATE = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' });
const formatDate = (iso) => (iso ? DATE.format(new Date(iso)) : '—');

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'activated', label: 'Activé' },
  { value: 'expired', label: 'Expiré' },
  { value: 'revoked', label: 'Révoqué' },
];

/**
 * La liste des codes d'activation.
 *
 * Le code lui-même n'apparaît JAMAIS ici : la base n'en garde qu'une
 * empreinte, et cet écran ne montre que l'indice de 4 symboles — assez pour
 * rapprocher une carte physique d'une ligne, pas assez pour s'en servir.
 * Les codes en clair n'existent qu'une fois, dans le panneau de génération
 * ci-dessous, et seulement pour le lot qu'on vient de produire.
 */
export default function AdminActivationCodes() {
  useDocumentMeta('Codes d’activation — Administration');

  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') ?? undefined);
  const [batch, setBatch] = useState(undefined);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounced(search, 300);

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const filters = { search: debouncedSearch, status, batch, page };

  const loader = useCallback(
    (authToken) => fetchActivationCodes(authToken, filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, status, batch, page],
  );
  const { data, loading, error, reload } = useAdminResource(loader, [loader]);

  const batchLoader = useCallback((authToken) => fetchActivationBatches(authToken, { perPage: 100 }), []);
  const { data: batchData } = useAdminResource(batchLoader, [batchLoader]);

  const batchOptions = (batchData?.batches?.data ?? []).map((b) => ({
    value: String(b.id),
    label: `${b.label} (${b.quantity})`,
  }));

  const applyStatus = (next) => {
    setStatus(next);
    setPage(1);
    // Le filtre voyage dans l'URL : un lien « les codes révoqués » doit
    // pouvoir être partagé et rechargé, comme sur la liste des élèves.
    const params = new URLSearchParams(searchParams);
    if (next) params.set('status', next);
    else params.delete('status');
    setSearchParams(params, { replace: true });
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (generating) return;

    const form = new FormData(event.currentTarget);
    const payload = {
      label: form.get('label'),
      quantity: Number(form.get('quantity')),
    };

    const accessDays = form.get('accessDays');
    const accessEndsAt = form.get('accessEndsAt');
    const redeemBy = form.get('redeemBy');
    const notes = form.get('notes');

    if (accessDays) payload.accessDays = Number(accessDays);
    if (accessEndsAt) payload.accessEndsAt = accessEndsAt;
    if (redeemBy) payload.redeemBy = redeemBy;
    if (notes) payload.notes = notes;

    setGenerating(true);
    setFormError(null);
    try {
      const result = await generateActivationBatch(token, payload);
      setGenerated(result);
      setFormOpen(false);
      reload();
    } catch (caught) {
      setFormError(caught.message || 'Impossible de générer le lot.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadActivationCodesCsv(token, { search: debouncedSearch, status, batch });
    } catch {
      /* l'échec est visible : aucun fichier ne descend */
    } finally {
      setExporting(false);
    }
  };

  const counts = data?.counts ?? {};

  const columns = [
    {
      key: 'hint',
      header: 'Indice',
      render: (row) => (
        <Link to={`/admin/codes-activation/${row.id}`} className="font-mono-jetbrains text-xs text-blue-700 hover:underline">
          ••••-••••-{row.hint}
        </Link>
      ),
    },
    { key: 'batchLabel', header: 'Lot', render: (row) => row.batchLabel ?? '—' },
    { key: 'status', header: 'Statut', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'activatedBy',
      header: 'Élève',
      render: (row) => (row.activatedBy
        ? <Link to={`/admin/eleves/${row.activatedBy.id}`} className="text-blue-700 hover:underline">{row.activatedBy.email}</Link>
        : '—'),
    },
    { key: 'activatedAt', header: 'Activé le', render: (row) => formatDate(row.activatedAt) },
    { key: 'expiresAt', header: 'Expire le', render: (row) => formatDate(row.expiresAt) },
    { key: 'createdAt', header: 'Créé le', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <AdminPage
      eyebrow="Accès"
      title="Codes d’activation"
      subtitle="Les cartes vendues en espèces. Un code ouvre un droit d’accès ; il ne s’active qu’une fois."
      actions={(
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 font-inter text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <Download size={14} />
            {exporting ? 'Export…' : 'Exporter (CSV)'}
          </button>
          <button
            type="button"
            onClick={() => { setFormOpen(true); setFormError(null); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 font-inter text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={14} />
            Générer un lot
          </button>
        </div>
      )}
    >
      <div className="space-y-3">
        {/* Les codes tout juste produits — montrés UNE fois. */}
        {generated && (
          <GeneratedCodesPanel
            batch={generated.batch}
            codes={generated.codes}
            onClose={() => setGenerated(null)}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 font-inter text-xs text-slate-600">
          <span className="font-semibold text-slate-800">{counts.total ?? 0} code(s)</span>
          <span>· {counts.available ?? 0} disponible(s)</span>
          <span>· {counts.activated ?? 0} activé(s)</span>
          <span>· {counts.expired ?? 0} expiré(s)</span>
          <span>· {counts.revoked ?? 0} révoqué(s)</span>
        </div>

        <FilterBar>
          <SearchInput
            value={search}
            onChange={(value) => { setSearch(value); setPage(1); }}
            placeholder="Indice (4 symboles), élève, lot…"
          />
          <SelectFilter value={status} onChange={applyStatus} options={STATUS_OPTIONS} label="Statut" />
          <SelectFilter
            value={batch}
            onChange={(value) => { setBatch(value); setPage(1); }}
            options={batchOptions}
            label="Lot"
            allLabel="Tous les lots"
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={data?.codes?.data ?? []}
          loading={loading}
          error={error}
          onRetry={reload}
          empty={<EmptyState title="Aucun code" hint="Générez un lot pour commencer à distribuer des cartes." />}
        />

        <Pagination meta={data?.codes} onPage={setPage} />
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Générer un lot de codes">
        <form onSubmit={handleGenerate} className="space-y-4">
          <Field label="Nom du lot" hint="Sert à le retrouver plus tard : « cartes Alger janvier ».">
            <input name="label" required maxLength={120} className={INPUT} />
          </Field>

          <Field label="Nombre de codes" hint="Entre 1 et 500.">
            <input name="quantity" type="number" min={1} max={500} defaultValue={50} required className={INPUT} />
          </Field>

          <fieldset className="rounded-lg border border-slate-200 p-3">
            <legend className="px-1 font-inter text-xs font-semibold text-slate-700">Durée d’accès</legend>
            <p className="mb-2 font-inter text-xs text-slate-500">
              Choisissez UNE des deux formes. Laissez les deux vides pour un accès sans fin.
            </p>
            <Field label="Durée en jours" hint="À compter de la saisie par l’élève.">
              <input name="accessDays" type="number" min={1} max={3650} className={INPUT} />
            </Field>
            <Field label="ou date de fin d’accès" hint="Fixe, quelle que soit la date de saisie.">
              <input name="accessEndsAt" type="date" className={INPUT} />
            </Field>
          </fieldset>

          <Field label="Utilisable jusqu’au" hint="Date limite de SAISIE. Vide = sans limite.">
            <input name="redeemBy" type="date" className={INPUT} />
          </Field>

          <Field label="Notes">
            <textarea name="notes" rows={2} maxLength={2000} className={INPUT} />
          </Field>

          {formError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 font-inter text-xs text-rose-800">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-300 px-3 py-2 font-inter text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={generating} className="rounded-lg bg-blue-600 px-3 py-2 font-inter text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {generating ? 'Génération…' : 'Générer'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}

const INPUT = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-inter text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function Field({ label, hint, children }) {
  return (
    <label className="mb-3 block last:mb-0">
      <span className="mb-1 block font-inter text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block font-inter text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

/**
 * Les codes en clair, montrés UNE SEULE FOIS.
 *
 * La base n'en garde qu'une empreinte : ni cet écran, ni aucun autre, ne
 * pourra les réafficher. L'avertissement n'est donc pas une précaution de
 * style — c'est la description exacte de ce qui se passe si l'administrateur
 * ferme ce panneau sans enregistrer le fichier.
 */
function GeneratedCodesPanel({ batch, codes, onClose }) {
  return (
    <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
      <div className="mb-3 flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <h2 className="font-space text-sm font-bold text-amber-900">
            {codes.length} code(s) générés — « {batch?.label} »
          </h2>
          <p className="mt-0.5 font-inter text-xs text-amber-800">
            Ces codes ne seront plus jamais affichés : seule leur empreinte est conservée.
            Téléchargez le fichier maintenant, avant de fermer ce panneau.
          </p>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 font-inter text-xs font-semibold text-amber-900 hover:underline">
          Fermer
        </button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => downloadGeneratedCodesCsv(batch, codes)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 font-inter text-xs font-semibold text-white hover:bg-amber-700"
        >
          <Download size={14} />
          Télécharger le CSV
        </button>
      </div>

      <div className="max-h-56 overflow-auto rounded-lg border border-amber-200 bg-white p-3">
        <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
          {codes.map((code) => (
            <li key={code.id} className="font-mono-jetbrains text-xs text-slate-800" dir="ltr">
              {code.code}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
