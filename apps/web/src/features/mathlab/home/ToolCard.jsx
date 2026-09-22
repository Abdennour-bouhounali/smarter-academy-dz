import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowForward } from '../../../components/common/DirectionalIcons';
import { mathLabToolPath } from '../mathLabDocument';

/**
 * La carte d'un instrument DISPONIBLE : nom, ce qu'on y fait, et UN geste —
 * ouvrir un document neuf. Toute la carte est le lien : pas de zone morte
 * sous le doigt.
 */
export default function ToolCard({ tool }) {
  const { t } = useTranslation('mathlab');
  const Icon = tool.icon;

  return (
    <Link
      to={mathLabToolPath(tool)}
      className="group flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-colors hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      data-ml-tool-card={tool.id}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={24} aria-hidden="true" />
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
