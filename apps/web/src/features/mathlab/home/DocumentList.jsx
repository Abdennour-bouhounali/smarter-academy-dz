import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2, FileText } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { LOCALE } from '../../../locale';
import { deleteMathLabDocument, fetchMathLabDocuments } from '../../../services/mathLabService';
import ConfirmDialog from '../../practice/notebook/space/ConfirmDialog';
import { getMathLabTool } from '../toolRegistry';
import { mathLabToolPath, mathLabBasePath, fromApiDocument } from '../mathLabDocument';
import { useWorkspaceBase } from '../../learning/learningViewer';

const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

/**
 * « أعمالي » : tout ce que l'élève a enregistré dans le مختبر, tous
 * instruments confondus, le plus récent d'abord. Ouvrir, supprimer (avec
 * confirmation) — et c'est tout : le but est un travail rapide, pas une
 * gestion de fichiers.
 *
 * Un document dont l'instrument n'est plus dans le registre (un outil
 * retiré) reste listé mais ne s'ouvre pas : on ne perd pas silencieusement
 * le travail d'un élève.
 */
export default function DocumentList() {
  const { t } = useTranslation('mathlab');
  const { token } = useContext(AuthContext);
  const labRoot = mathLabBasePath(useWorkspaceBase());
  const [state, setState] = useState({ status: 'loading', documents: [] });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(false);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading' }));
    try {
      const { documents } = await fetchMathLabDocuments(token);
      setState({ status: 'ready', documents: documents.map(fromApiDocument) });
    } catch {
      setState({ status: 'error', documents: [] });
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = useCallback(async () => {
    const doc = pendingDelete;
    setPendingDelete(null);
    if (!doc) return;
    setDeleteError(false);
    try {
      await deleteMathLabDocument(token, doc.id);
      setState((s) => ({ ...s, documents: s.documents.filter((d) => d.id !== doc.id) }));
    } catch {
      setDeleteError(true);
    }
  }, [pendingDelete, token]);

  if (state.status === 'loading') {
    return (
      <p className="flex items-center gap-2 font-inter text-sm text-slate-500" aria-busy="true" data-ml-docs-loading>
        <Loader2 size={16} className="animate-spin" aria-hidden="true" /> {t('myWorkLoading')}
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3 flex-wrap" data-ml-docs-error>
        <p className="font-inter text-sm text-rose-900">{t('myWorkError')}</p>
        <button type="button" onClick={load} className="sa-ml-btn sa-ml-btn--primary">{t('retry', { ns: 'common' })}</button>
      </div>
    );
  }

  if (state.documents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 font-inter text-sm text-slate-500" data-ml-docs-empty>
        {t('myWorkEmpty')}
      </p>
    );
  }

  return (
    <>
      {deleteError && <p role="alert" className="mb-3 font-inter text-sm text-rose-700">{t('deleteError')}</p>}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2" data-ml-docs>
        {state.documents.map((doc) => {
          const tool = getMathLabTool(doc.tool);
          const Icon = tool?.icon ?? FileText;
          const toolName = tool ? t(tool.labelKey) : doc.tool;
          const title = doc.title || t('untitled');
          const updated = doc.updatedAt ? dateFormat.format(new Date(doc.updatedAt)) : '';

          return (
            <li key={doc.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 ps-4" data-ml-doc={doc.id}>
              <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                {tool ? (
                  <Link
                    to={mathLabToolPath(tool, doc.id, labRoot)}
                    className="block truncate font-space font-bold text-slate-900 hover:text-blue-700 focus:outline-none focus-visible:underline"
                    aria-label={t('openDocument', { title })}
                    data-ml-doc-open
                  >
                    {title}
                  </Link>
                ) : (
                  <span className="block truncate font-space font-bold text-slate-500">{title}</span>
                )}
                <p className="font-inter text-xs text-slate-500 truncate">
                  {toolName}{updated ? ` · ${t('updatedAt', { date: updated })}` : ''}
                </p>
              </div>
              <button
                type="button"
                className="sa-ml-btn sa-ml-btn--icon sa-ml-btn--danger"
                onClick={() => setPendingDelete(doc)}
                aria-label={t('deleteDocument', { title })}
                title={t('deleteDocument', { title })}
                data-ml-doc-delete
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <ConfirmDialog
        open={pendingDelete != null}
        title={t('deleteTitle', { title: pendingDelete?.title || t('untitled') })}
        body={t('deleteBody')}
        confirmLabel={t('delete', { ns: 'common' })}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
