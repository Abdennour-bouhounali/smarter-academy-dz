import { useTranslation } from 'react-i18next';
import { formatValue } from '../functionGrapher/grapherFormat.js';

/**
 * Le RÉSUMÉ de la série : n, minimum, maximum, étendue, moyenne, médiane.
 * Compact (§ 21) et `aria-live` — c'est la représentation textuelle complète
 * de ce que le graphique montre, celle qui suffit à comprendre le résultat
 * sans voir le dessin (§ 31).
 *
 * Les symboles (n, x̄, Me) restent en LTR : une notation mathématique ne se
 * renverse pas parce que la page est en arabe (ARABIC_RTL_CONTRACT, § 25).
 */
export default function StatisticsSummary({ summary }) {
  const { t } = useTranslation('mathlab');
  const empty = summary.n === 0;

  const entries = [
    { key: 'count', symbol: 'n', value: empty ? null : summary.n, decimals: 0 },
    { key: 'min', symbol: 'min', value: summary.min },
    { key: 'max', symbol: 'max', value: summary.max },
    { key: 'range', symbol: 'max − min', value: summary.range },
    { key: 'mean', symbol: 'x̄', value: summary.mean, strong: true },
    { key: 'median', symbol: 'Me', value: summary.median, strong: true },
  ];

  return (
    <dl className="sa-ml-ps__stats" aria-live="polite" data-ml-ps-summary>
      {entries.map((entry) => (
        <div
          key={entry.key}
          className={`sa-ml-ps__stat ${entry.strong ? 'sa-ml-ps__stat--strong' : ''}`}
          data-ml-ps-stat={entry.key}
        >
          <dt>
            {t(`tools.probabilityStats.stats.${entry.key}`)}
            <span className="sa-ml-ps__stat-symbol" dir="ltr">{entry.symbol}</span>
          </dt>
          <dd dir="ltr" data-ml-ps-stat-value={entry.key}>
            {entry.value === null || entry.value === undefined
              ? '—'
              : formatValue(entry.value, entry.decimals ?? 2)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
