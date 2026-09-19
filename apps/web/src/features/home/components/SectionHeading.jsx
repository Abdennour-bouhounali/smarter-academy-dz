import { Link } from 'react-router-dom';
import { ArrowForward } from '../../../components/common/DirectionalIcons';

const TONE = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
};

/**
 * L'en-tête d'une section SECONDAIRE de l'accueil : un titre court, une
 * icône qui dit de quoi on parle, et au plus UN lien de sortie sur le bord
 * de fin. Tout ce qui n'est pas le héros passe par ici, pour que les
 * sections se ressemblent entre elles et se distinguent de lui.
 */
export default function SectionHeading({ id, icon: Icon, tone = 'blue', title, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 id={id} className="font-space font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2.5 min-w-0">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${TONE[tone]}`} aria-hidden="true">
          <Icon size={16} />
        </span>
        <span className="truncate">{title}</span>
      </h2>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1 min-h-[36px] px-1.5 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {action.label} <ArrowForward size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
