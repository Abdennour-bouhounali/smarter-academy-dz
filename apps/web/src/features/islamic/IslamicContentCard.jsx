import { useTranslation } from 'react-i18next';
import IslamicContentRenderer, { renderKind } from './IslamicContentRenderer';

/**
 * Une CARTE de rappel, posée dans le flux de la page — jamais par-dessus.
 * Le style reste celui du système (rayon, bordure, typographie) avec un
 * accent vert discret et un motif géométrique à peine visible
 * (`.sa-islamic-surface`, index.css). Pas d'or, pas d'ornement, pas
 * d'animation.
 *
 *   compact — une ligne de texte court, sans تأمّل (en-tête, après erreur).
 */
export default function IslamicContentCard({ item, compact = false, title, className = '' }) {
  const { t } = useTranslation('common');
  if (!renderKind(item)) return null;
  return (
    <aside
      dir="rtl"
      aria-label={t('islamic.cardAria')}
      className={`sa-islamic-surface rounded-2xl border border-emerald-100 ${compact ? 'px-4 py-3' : 'p-4 sm:p-5'} ${className}`}
      data-islamic-card={compact ? 'compact' : 'card'}
    >
      {!compact && (
        <p className="mb-2 text-xs font-semibold text-emerald-800">
          <span aria-hidden="true">🌿 </span>{title ?? t('islamic.cardTitle')}
        </p>
      )}
      <IslamicContentRenderer item={item} compact={compact} />
    </aside>
  );
}
