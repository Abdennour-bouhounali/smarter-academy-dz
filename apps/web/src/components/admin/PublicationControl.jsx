import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { changeContentStatus } from '../../services/admin/contentService';
import StatusBadge from './ui/StatusBadge';
import { ConfirmDialog } from './ui/Modal';

/** Les quatre états, et la CLÉ de leur geste — le libellé se traduit au rendu. */
const STATUSES = [
  { value: 'published', labelKey: 'bulk.publish' },
  { value: 'hidden', labelKey: 'bulk.hide' },
  { value: 'draft', labelKey: 'bulk.draft' },
  { value: 'archived', labelKey: 'bulk.archive' },
];

/**
 * Publier / masquer / archiver un contenu, depuis n'importe quelle liste.
 *
 * Toute sortie de « publié » passe par une confirmation : c'est un geste qui
 * retire du contenu à des élèves en train de travailler, et la spec (§33)
 * demande une confirmation pour les opérations conséquentes. Republier, à
 * l'inverse, ne demande rien — ça ne casse rien.
 *
 * L'état affiché vient du SERVEUR après l'appel, jamais d'une supposition
 * optimiste : si le serveur refuse, l'interface ne doit pas raconter le
 * contraire.
 */
export default function PublicationControl({ type, id, status, onChanged, compact = false }) {
  const { t } = useTranslation('admin');
  const { token } = useContext(AuthContext);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const apply = async (next) => {
    setBusy(true);
    setError(null);
    try {
      const result = await changeContentStatus(token, type, id, next);
      onChanged?.(result.publicationStatus);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  const request = (next) => {
    if (!next || next === status) return;
    // Retirer du contenu aux élèves se confirme ; le remettre, non.
    if (next === 'published') apply(next);
    else setPending(next);
  };

  return (
    <div className={compact ? 'flex items-center gap-2' : 'flex flex-wrap items-center gap-2'}>
      <StatusBadge status={status} />

      <select
        aria-label={t('bulk.changePublicationLabel')}
        value=""
        disabled={busy}
        onChange={(event) => request(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 font-inter text-xs text-slate-700 disabled:opacity-50"
      >
        <option value="">{t('bulk.changePlaceholder')}</option>
        {STATUSES.filter((option) => option.value !== status).map((option) => (
          <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
        ))}
      </select>

      {error && <span className="font-inter text-xs text-rose-600">{error}</span>}

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={() => apply(pending)}
        busy={busy}
        tone="danger"
        cancelLabel={t('common.cancel')}
        busyLabel={t('common.busy')}
        closeLabel={t('common.close')}
        title={pending === 'archived' ? t('bulk.confirmArchiveOneTitle') : t('bulk.confirmWithdrawOneTitle')}
        confirmLabel={pending === 'archived' ? t('bulk.archive') : t('bulk.withdraw')}
        message={
          <>
            <p>
              {t('bulk.withdrawOneMessage')} <strong>{t('bulk.noLearningDataLost')}</strong>
              {t('bulk.noLearningDataLostHide')}
            </p>
          </>
        }
      />
    </div>
  );
}
