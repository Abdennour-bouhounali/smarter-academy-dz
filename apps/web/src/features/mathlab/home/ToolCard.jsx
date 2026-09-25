import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowForward } from '../../../components/common/DirectionalIcons';
import { mathLabToolPath, mathLabBasePath } from '../mathLabDocument';
import { useWorkspaceBase } from '../../learning/learningViewer';
import { Lock } from 'lucide-react';

/**
 * La carte d'un instrument DISPONIBLE : nom, ce qu'on y fait, et UN geste —
 * ouvrir un document neuf. Toute la carte est le lien : pas de zone morte
 * sous le doigt.
 */
export default function ToolCard({ tool, locked = false }) {
  const { t } = useTranslation('mathlab');
  const { t: ta } = useTranslation('access');
  const Icon = tool.icon;
  const root = mathLabBasePath(useWorkspaceBase());

  return (
    <Link
      to={mathLabToolPath(tool, null, root)}
      className="group flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-colors hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      data-ml-tool-card={tool.id}
      data-ml-tool-locked={locked ? 'true' : undefined}
      aria-label={locked ? `${t(tool.labelKey)} — ${ta('feature.lockedLabel')}` : undefined}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={24} aria-hidden="true" />
        </span>
        {locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-inter text-[11px] font-bold text-amber-800">
            <Lock size={11} aria-hidden="true" /> {ta('feature.badgePremium')}
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-space font-bold text-lg text-slate-900">{t(tool.labelKey)}</span>
        <span className="block font-inter text-sm text-slate-500 mt-1">{t(tool.descriptionKey)}</span>
      </span>
      <span className="mt-auto inline-flex items-center gap-1.5 font-mono-jetbrains text-xs font-bold text-blue-600 group-hover:text-blue-700">
        {t(tool.newLabelKey)}
        <ArrowForward size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}
