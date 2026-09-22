import { Suspense, lazy, useCallback, useContext, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { AuthContext } from '../../context/AuthContext';
import { fetchMathLabFileBlob } from '../../services/mathLabService';
import { useMathLabAttachments } from './attachments/useMathLabAttachments';
import { getMathLabToolBySlug } from './toolRegistry';
import { MATH_LAB_BASE_PATH, parseDocumentId } from './mathLabDocument';
import { readMathLabLaunch } from './openMathLab';
import { useMathLabDocument } from './useMathLabDocument';
import MathLabShell from './MathLabShell';

// Un composant paresseux par instrument, créé UNE fois par module : `lazy`
// dans le rendu recréerait le composant — et remonterait l'outil — à chaque rendu.
const lazyComponents = new Map();
function lazyToolComponent(tool) {
  if (!lazyComponents.has(tool.id)) lazyComponents.set(tool.id, lazy(tool.load));

  return lazyComponents.get(tool.id);
}

/**
 * /espace/atelier/:toolSlug            un document neuf dans cet instrument
 * /espace/atelier/:toolSlug/:documentId  un document enregistré
 *
 * La page résout l'instrument par son segment d'URL, charge son composant
 * paresseusement, ouvre le document et rend la coquille. Elle ne sait RIEN
 * de l'outil lui-même : un instrument de plus n'y change pas une ligne.
 */
export default function MathLabToolPage() {
  const { toolSlug, documentId: rawId } = useParams();
  const tool = getMathLabToolBySlug(toolSlug);

  if (!tool) return <Navigate to={MATH_LAB_BASE_PATH} replace />;

  return <ToolPage key={tool.id} tool={tool} documentId={parseDocumentId(rawId)} />;
}

function ToolPage({ tool, documentId }) {
  const { t } = useTranslation('mathlab');
  const location = useLocation();
  const toolName = t(tool.labelKey);
  useDocumentMeta(`${toolName} — ${t('title')}`);

  const launch = useMemo(() => readMathLabLaunch(location.state, tool.id), [location.state, tool.id]);
  const model = useMathLabDocument(tool, documentId, { launch, defaultTitle: t(tool.defaultTitleKey) });
  const [toolApi, setToolApi] = useState(null);
  const ToolComponent = lazyToolComponent(tool);

  // Les fichiers du document (serveur) et le panneau qui les montre. La
  // coquille et l'outil lisent la même liste ; l'outil reçoit aussi de quoi
  // lire les octets pour recharger ses images.
  const { token } = useContext(AuthContext);
  const [filesOpen, setFilesOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const attachments = useMathLabAttachments({
    documentId: model.document?.id ?? documentId,
    initialFiles: model.files,
    initialQuota: model.quota,
    loadKey: model.loadKey,
    ensurePersisted: model.ensurePersisted,
  });
  const loadBlob = useCallback((file) => fetchMathLabFileBlob(token, file.id), [token]);
  const toolAttachments = useMemo(() => ({ files: attachments.files, loadBlob }), [attachments.files, loadBlob]);
  const toggleFiles = useCallback(() => setFilesOpen((open) => !open), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  return (
    <MathLabShell
      tool={tool}
      title={model.title}
      onTitleChange={model.updateTitle}
      saveState={model.saveState}
      isPersisted={model.isPersisted}
      onSave={model.saveNow}
      toolApi={toolApi}
      attachments={attachments}
      filesOpen={filesOpen}
      onToggleFiles={toggleFiles}
      notice={notice}
      onNoticeDismiss={dismissNotice}
    >
      {model.status === 'loading' && (
        <div className="sa-ml-placeholder" aria-busy="true" data-ml-loading>
          <Loader2 size={22} className="animate-spin text-blue-500" aria-hidden="true" />
          <span>{t('shell.loading')}</span>
        </div>
      )}
      {model.status === 'error' && (
        <div className="sa-ml-placeholder" role="alert" data-ml-error>
          <p className="font-space font-bold text-slate-900">
            {model.error?.status === 404 ? t('shell.notFound') : t('shell.loadError')}
          </p>
          <Link to={MATH_LAB_BASE_PATH} className="sa-ml-btn sa-ml-btn--primary mt-2">{t('shell.backToLab')}</Link>
        </div>
      )}
      {model.status === 'ready' && (
        <Suspense
          fallback={(
            <div className="sa-ml-placeholder" aria-busy="true" data-ml-loading>
              <Loader2 size={22} className="animate-spin text-blue-500" aria-hidden="true" />
              <span>{t('shell.loading')}</span>
            </div>
          )}
        >
          <ToolComponent
            key={model.loadKey}
            initialData={model.document.data}
            title={model.title}
            onChange={model.updateData}
            onReady={setToolApi}
            attachments={toolAttachments}
            onNotice={setNotice}
          />
        </Suspense>
      )}
    </MathLabShell>
  );
}
