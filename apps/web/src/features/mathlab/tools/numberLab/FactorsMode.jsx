import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ValueInput from './ValueInput.jsx';
import SendToMenu from './SendToMenu.jsx';
import {
  divisors, factorPairs, multiples, primeFactorization, factorizationToText, isPrime,
} from './numberTheory.js';
import { formatNumber } from './numberValue.js';

/**
 * §25, §26 — LES QAWĀSIM, LES MUDĀ'AFĀT, et le RECTANGLE.
 *
 * §26 est l'idée forte : `24` dessiné en `4 × 6` est un rectangle, et changer
 * de couple change sa FORME sans changer son AIRE. L'élève passe de `1 × 24`
 * (un ruban) à `4 × 6` (presque un carré) et voit que la multiplication et
 * les diviseurs sont la même chose regardée de deux côtés.
 *
 * Un nombre premier n'a qu'un rectangle — le ruban `1 × n` — et c'est
 * exactement ce que « premier » veut dire. Le mode le dit à ce moment-là,
 * quand l'élève vient de le constater.
 */
export default function FactorsMode({ state, onChange, onSend, compact }) {
  const { t } = useTranslation('mathlab');
  const { value, pairIndex } = state;

  const pairs = useMemo(() => factorPairs(value), [value]);
  const divisorList = useMemo(() => divisors(value), [value]);
  const multipleList = useMemo(() => multiples(value, 12), [value]);
  const factors = useMemo(() => (value >= 2 ? primeFactorization(value) : null), [value]);

  const index = Math.min(Math.max(0, pairIndex), Math.max(0, pairs.length - 1));
  const pair = pairs[index] ?? [1, value];
  const prime = isPrime(value);

  return (
    <div className="sa-ml-nb__mode sa-ml-nb__mode--factors">
      <div className="sa-ml-nb__row">
        <ValueInput
          value={value}
          onChange={(next) => onChange({ value: Math.max(1, next), pairIndex: 0 })}
          label={t('tools.numberLab.valueLabel')}
          integer
          min={1}
          stepper
        />
        <SendToMenu value={value} onSend={onSend} exclude="factors" />
      </div>

      <h3 className="sa-ml-nb__heading">{t('tools.numberLab.factors.heading', { value: formatNumber(value) })}</h3>

      {/* §26 : le rectangle qui change de forme. */}
      <section className="sa-ml-nb__panel">
        <header className="sa-ml-nb__panel-head">
          <h4>{t('tools.numberLab.factors.rectangle')}</h4>
          <div className="sa-ml-nb__controls">
            <button
              type="button" className="sa-ml-nb__mini"
              onClick={() => onChange({ pairIndex: Math.max(0, index - 1) })}
              disabled={index === 0}
              aria-label={t('tools.numberLab.factors.previousPair')}
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
            <span className="sa-ml-nb__count">
              {t('tools.numberLab.factors.pairCount', { index: index + 1, total: pairs.length })}
            </span>
            <button
              type="button" className="sa-ml-nb__mini"
              onClick={() => onChange({ pairIndex: Math.min(pairs.length - 1, index + 1) })}
              disabled={index >= pairs.length - 1}
              aria-label={t('tools.numberLab.factors.nextPair')}
            >
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
          </div>
        </header>

        <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
          {t('tools.numberLab.factors.pairLabel', { a: pair[0], b: pair[1], value })}
        </p>

        <Rectangle rows={pair[0]} cols={pair[1]} value={value} compact={compact} />

        <p className="sa-ml-nb__muted">
          {t('tools.numberLab.factors.rectangleHint', { value: formatNumber(value) })}
        </p>
        {prime && <p className="sa-ml-nb__callout">{t('tools.numberLab.factors.primeNote', { value })}</p>}
        {pair[0] === pair[1] && (
          <p className="sa-ml-nb__callout">{t('tools.numberLab.factors.square', { a: pair[0] })}</p>
        )}
      </section>

      {/* §25 : tous les couples, cliquables. */}
      <section className="sa-ml-nb__panel">
        <h4>{t('tools.numberLab.factors.pairs')}</h4>
        <ul className="sa-ml-nb__chiplist" dir="ltr">
          {pairs.map(([a, b], i) => (
            <li key={`${a}x${b}`}>
              <button
                type="button"
                className={`sa-ml-nb__chip${i === index ? ' is-current' : ''}`}
                onClick={() => onChange({ pairIndex: i })}
              >
                {a} × {b}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="sa-ml-nb__cards">
        <section className="sa-ml-nb__card sa-ml-nb__card--wide">
          <h4>
            {t('tools.numberLab.factors.divisors')}
            <span className="sa-ml-nb__count">{t('tools.numberLab.factors.divisorCount', { count: divisorList.length })}</span>
          </h4>
          <ul className="sa-ml-nb__chiplist" dir="ltr">
            {divisorList.slice(0, 48).map((d) => (
              <li key={d}>
                <button type="button" className="sa-ml-nb__chip" onClick={() => onChange({ value: d, pairIndex: 0 })}>{d}</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="sa-ml-nb__card sa-ml-nb__card--wide">
          <h4>{t('tools.numberLab.factors.multiples')}</h4>
          <ul className="sa-ml-nb__chiplist" dir="ltr">
            {multipleList.map((m) => (
              <li key={m}>
                <button type="button" className="sa-ml-nb__chip" onClick={() => onChange({ value: m, pairIndex: 0 })}>{m}</button>
              </li>
            ))}
          </ul>
        </section>

        {factors && (
          <section className="sa-ml-nb__card sa-ml-nb__card--wide">
            <h4>{t('tools.numberLab.factors.primeFactors')}</h4>
            <p className="sa-ml-nb__formula" dir="ltr">
              {formatNumber(value)} = {factorizationToText(factors)}
            </p>
            <button type="button" className="sa-ml-nb__link" onClick={() => onSend('primes', value)}>
              {t('tools.numberLab.primes.tree')}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

/** §26 — Le rectangle : `rows × cols` carrés, l'aire toujours égale au nombre. */
function Rectangle({ rows, cols, value, compact }) {
  const { t } = useTranslation('mathlab');
  if (value > 400) {
    return (
      <p className="sa-ml-nb__muted">
        {t('tools.numberLab.factors.rectangleLabel', { a: rows, b: cols, value })}
      </p>
    );
  }

  const max = compact ? 240 : 380;
  const cell = Math.max(4, Math.min(26, Math.floor(max / Math.max(rows, cols))));

  return (
    <div
      className="sa-ml-nb__rectangle"
      role="img"
      aria-label={t('tools.numberLab.factors.rectangleLabel', { a: rows, b: cols, value })}
      style={{ '--cols': cols, '--cell': `${cell}px` }}
      dir="ltr"
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} className="sa-ml-nb__rect-cell" />
      ))}
    </div>
  );
}
