import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scissors, Merge, Sparkles } from 'lucide-react';
import FractionShape from './FractionShape.jsx';
import NumberLineStage from './NumberLineStage.jsx';
import ValueInput from './ValueInput.jsx';
import {
  makeFrac, simplify, isSimplified, simplifyFactor, fracToNumber, fracToText,
  addFrac, subtractFrac, multiplyFrac, divideFrac, compareFrac, crossProducts,
  comparisonSign, commonDenominator, equivalents, expand, fracToDecimal,
  MAX_DENOMINATOR,
} from './fraction.js';
import { fracToPercent } from './proportion.js';
import { decimalTextOf, formatNumber, frameValues } from './numberValue.js';

/**
 * §8 à §13 — LES KUSŪR, vues de cinq façons à la fois.
 *
 * Toute la difficulté des fractions tient en une phrase : la même valeur
 * s'écrit de plusieurs manières, et deux écritures différentes peuvent être
 * le même nombre. Ce mode ne l'explique pas — il le MONTRE, en gardant
 * barre, disque, droite, décimal et pourcentage synchronisés en permanence.
 *
 * ── Le geste central : COUPER (§9) ──────────────────────────────────────
 * On clique une part et elle se coupe en deux. La barre passe de 2 à 4
 * parts, le numérateur suit, et l'élève lit `1/2 = 2/4` sans qu'on le lui
 * ait dit. C'est la découverte de l'équivalence par le doigt, et c'est
 * pourquoi le moteur ne réduit JAMAIS tout seul (fraction.js) : réduire
 * automatiquement effacerait exactement ce qu'on veut faire voir.
 *
 * ── §12 : le dénominateur commun se CONSTRUIT ───────────────────────────
 * Pour `1/3 + 1/4`, les deux barres se subdivisent jusqu'à douze, et les
 * nouvelles coupures s'éclairent (`highlight`). On voit d'où viennent les
 * douzièmes avant de voir `4/12 + 3/12 = 7/12`.
 */
export default function FractionsMode({ state, onChange, compact }) {
  const { t } = useTranslation('mathlab');
  const { left, right, operation, model } = state;
  const [showCommon, setShowCommon] = useState(false);

  const setLeft = useCallback((frac) => onChange({ left: frac }), [onChange]);
  const setRight = useCallback((frac) => onChange({ right: frac }), [onChange]);

  /** §9 — couper chaque part en deux : la valeur ne bouge pas, l'écriture oui. */
  const split = useCallback((which) => {
    const frac = which === 'left' ? left : right;
    if (frac.d * 2 > MAX_DENOMINATOR) return;
    (which === 'left' ? setLeft : setRight)(expand(frac, 2));
  }, [left, right, setLeft, setRight]);

  const merge = useCallback((which) => {
    const frac = which === 'left' ? left : right;
    // On ne recolle que si les deux nombres sont pairs : sinon la part
    // n'existe pas, et mentir ici serait pire que refuser.
    if (frac.n % 2 !== 0 || frac.d % 2 !== 0) return;
    (which === 'left' ? setLeft : setRight)(makeFrac(frac.n / 2, frac.d / 2));
  }, [left, right, setLeft, setRight]);

  const result = useMemo(() => {
    switch (operation) {
      case 'add': return addFrac(left, right);
      case 'subtract': return subtractFrac(left, right);
      case 'multiply': return multiplyFrac(left, right);
      case 'divide': return divideFrac(left, right);
      default: return null;
    }
  }, [left, right, operation]);

  const common = useMemo(() => commonDenominator(left, right), [left, right]);
  const order = compareFrac(left, right);
  const cross = crossProducts(left, right);

  const leftValue = fracToNumber(left);
  const rightValue = fracToNumber(right);
  const view = useMemo(
    () => frameValues([0, 1, leftValue, rightValue], { minSpan: 1.4 }),
    [leftValue, rightValue],
  );

  /** Les parts NOUVELLES après mise au dénominateur commun (§12). */
  const highlightOf = useCallback((converted, factor) => {
    if (!converted || factor <= 1) return null;
    const out = [];
    for (let i = 0; i < converted.n; i += 1) if (i % factor !== 0) out.push(i);

    return out;
  }, []);

  return (
    <div className="sa-ml-nb__mode sa-ml-nb__mode--fractions">
      {/* Les deux fractions, et ce qu'on en fait. */}
      <div className="sa-ml-nb__row sa-ml-nb__row--wrap">
        <ValueInput value={left} onChange={setLeft} label={t('tools.numberLab.fractions.left')} fraction />
        <label className="sa-ml-nb__field">
          <span className="sa-ml-nb__label">{t('tools.numberLab.fractions.operation')}</span>
          <select
            className="sa-ml-nb__select"
            value={operation}
            onChange={(event) => onChange({ operation: event.target.value })}
          >
            {['add', 'subtract', 'multiply', 'divide', 'compare'].map((op) => (
              <option key={op} value={op}>{t(`tools.numberLab.fractions.operations.${op}`)}</option>
            ))}
          </select>
        </label>
        <ValueInput value={right} onChange={setRight} label={t('tools.numberLab.fractions.right')} fraction />
        <label className="sa-ml-nb__field">
          <span className="sa-ml-nb__label">{t('tools.numberLab.fractions.model')}</span>
          <select
            className="sa-ml-nb__select"
            value={model}
            onChange={(event) => onChange({ model: event.target.value })}
          >
            {['bar', 'circle', 'line'].map((m) => (
              <option key={m} value={m}>{t(`tools.numberLab.fractions.models.${m}`)}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="sa-ml-nb__hint">{t('tools.numberLab.fractions.hint')}</p>

      {/* §8 : les représentations, côte à côte et synchronisées. */}
      <div className="sa-ml-nb__fraction-pair">
        <section className="sa-ml-nb__fraction-card">
          <FractionShape
            frac={showCommon && common ? common.left : left}
            model={model}
            tone="primary"
            highlight={showCommon && common ? highlightOf(common.left, common.leftFactor) : null}
            onSplit={() => split('left')}
          />
          <div className="sa-ml-nb__fraction-actions">
            <button type="button" className="sa-ml-nb__tiny" onClick={() => split('left')} disabled={left.d * 2 > MAX_DENOMINATOR}>
              <Scissors size={12} aria-hidden="true" /> {t('tools.numberLab.fractions.split')}
            </button>
            <button type="button" className="sa-ml-nb__tiny" onClick={() => merge('left')} disabled={left.n % 2 !== 0 || left.d % 2 !== 0}>
              <Merge size={12} aria-hidden="true" /> {t('tools.numberLab.fractions.merge')}
            </button>
          </div>
          <FractionFacts frac={left} />
        </section>

        {/* L'opérateur, et SOUS LUI le résultat : c'est là que l'œil le
            cherche — `1/3 + 1/4` doit se lire comme au tableau, avec sa
            réponse au bout, pas dans un panneau plus bas. La forme non
            réduite reste visible au-dessus de la réduite (§11). */}
        <div className="sa-ml-nb__fraction-operator" aria-hidden="true">
          {operation === 'compare' ? (comparisonSign(order) ?? '?') : OPERATOR_SIGNS[operation]}
        </div>

        <section className="sa-ml-nb__fraction-card">
          <FractionShape
            frac={showCommon && common ? common.right : right}
            model={model}
            tone="secondary"
            highlight={showCommon && common ? highlightOf(common.right, common.rightFactor) : null}
            onSplit={() => split('right')}
          />
          <div className="sa-ml-nb__fraction-actions">
            <button type="button" className="sa-ml-nb__tiny" onClick={() => split('right')} disabled={right.d * 2 > MAX_DENOMINATOR}>
              <Scissors size={12} aria-hidden="true" /> {t('tools.numberLab.fractions.split')}
            </button>
            <button type="button" className="sa-ml-nb__tiny" onClick={() => merge('right')} disabled={right.n % 2 !== 0 || right.d % 2 !== 0}>
              <Merge size={12} aria-hidden="true" /> {t('tools.numberLab.fractions.merge')}
            </button>
          </div>
          <FractionFacts frac={right} />
        </section>

        {/* Le RÉSULTAT, pleine largeur sous les deux opérandes : sa barre se
            compare part pour part à celles du dessus, ce qu'une colonne
            étroite au milieu rendait impossible. Il est frère des deux
            cartes dans la grille, jamais enfant du signe. */}
        {operation !== 'compare' && result && (
          <output className="sa-ml-nb__fraction-answer">
            <span className="sa-ml-nb__fraction-equals" aria-hidden="true">=</span>
            <FractionShape
              frac={result.simplified ?? result.raw}
              model={model}
              tone="result"
              width={model === 'circle' ? 116 : 640}
              showLabel={false}
            />
            <span className="sa-ml-nb__fraction-numbers">
              <span className="sa-ml-nb__fraction-raw">{fracToText(result.raw)}</span>
              {result.simplified && fracToText(result.simplified) !== fracToText(result.raw) && (
                <span className="sa-ml-nb__fraction-reduced">{fracToText(result.simplified)}</span>
              )}
            </span>
          </output>
        )}
      </div>

      {/* §7, §10 : les deux fractions sur la même droite — la comparaison VISUELLE. */}
      <NumberLineStage
        view={view}
        points={[
          { value: leftValue, frac: left, tone: 'primary', draggable: false },
          { value: rightValue, frac: right, tone: 'secondary', draggable: false },
        ]}
        subdivisions={Math.min(24, common?.denominator ?? left.d)}
        height={compact ? 112 : 128}
      />

      {/* §12 : le dénominateur commun, construit devant l'élève. */}
      {(operation === 'add' || operation === 'subtract' || operation === 'compare') && common && (
        <section className="sa-ml-nb__panel">
          <header className="sa-ml-nb__panel-head">
            <h4>{t('tools.numberLab.fractions.commonDenominator')}</h4>
            <button
              type="button"
              className="sa-ml-nb__button sa-ml-nb__button--ghost"
              onClick={() => setShowCommon((v) => !v)}
              aria-pressed={showCommon}
            >
              <Sparkles size={14} aria-hidden="true" />
              {showCommon ? t('tools.numberLab.showLess') : t('tools.numberLab.showMore')}
            </button>
          </header>
          <p className="sa-ml-nb__muted">
            {t('tools.numberLab.fractions.commonDenominatorHint', { denominator: common.denominator })}
          </p>
          <ul className="sa-ml-nb__steps" dir="ltr">
            <li>{t('tools.numberLab.fractions.commonDenominatorStep', {
              frac: fracToText(left), converted: fracToText(common.left), factor: common.leftFactor,
            })}</li>
            <li>{t('tools.numberLab.fractions.commonDenominatorStep', {
              frac: fracToText(right), converted: fracToText(common.right), factor: common.rightFactor,
            })}</li>
          </ul>
        </section>
      )}

      {/* §11 : le résultat — le modèle d'abord, le calcul ensuite. */}
      {operation !== 'compare' && result && (
        <section className="sa-ml-nb__panel sa-ml-nb__panel--result">
          <h4>{t('tools.numberLab.fractions.result')}</h4>
          {operation === 'divide' && result.reciprocal && (
            <p className="sa-ml-nb__muted">
              {t('tools.numberLab.fractions.reciprocal', {
                frac: fracToText(right), reciprocal: fracToText(result.reciprocal),
              })}
              {' — '}
              {t('tools.numberLab.fractions.divideHint')}
            </p>
          )}
          <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
            {fracToText(left)} {OPERATOR_SIGNS[operation]} {fracToText(right)} = {fracToText(result.raw)}
          </p>
          {result.simplified && fracToText(result.simplified) !== fracToText(result.raw) && (
            <p className="sa-ml-nb__formula" dir="ltr">
              {fracToText(result.raw)} = {fracToText(result.simplified)}
              <span className="sa-ml-nb__muted"> ({t('tools.numberLab.fractions.simplified', { factor: simplifyFactor(result.raw) })})</span>
            </p>
          )}
        </section>
      )}

      {/* §10 : la comparaison, expliquée par le jadā' tabādulī. */}
      {operation === 'compare' && cross && (
        <section className="sa-ml-nb__panel sa-ml-nb__panel--result">
          <h4>{t('tools.numberLab.fractions.crossProducts')}</h4>
          <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
            {fracToText(left)} {comparisonSign(order)} {fracToText(right)}
          </p>
          <p className="sa-ml-nb__formula" dir="ltr">
            {cross.leftLabel} = {cross.left} &nbsp;·&nbsp; {cross.rightLabel} = {cross.right}
          </p>
          <p className="sa-ml-nb__muted">
            {t('tools.numberLab.fractions.crossHint', { left: cross.left, right: cross.right })}
          </p>
        </section>
      )}

      {/* §9 : les équivalentes, toutes la même valeur. */}
      <section className="sa-ml-nb__panel">
        <h4>{t('tools.numberLab.fractions.equivalents')}</h4>
        <p className="sa-ml-nb__muted">{t('tools.numberLab.fractions.equivalentHint')}</p>
        <ul className="sa-ml-nb__chiplist" dir="ltr">
          {equivalents(left, 8).map((frac) => (
            <li key={`${frac.n}/${frac.d}`}>
              <button
                type="button"
                className={`sa-ml-nb__chip${frac.n === left.n && frac.d === left.d ? ' is-current' : ''}`}
                onClick={() => setLeft(frac)}
              >
                {fracToText(frac)}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const OPERATOR_SIGNS = Object.freeze({ add: '+', subtract: '−', multiply: '×', divide: '÷', compare: '?' });

/**
 * §46, §47 — ce qu'une fraction est AUSSI : un décimal, un pourcentage.
 *
 * Affiché sous chaque fraction, en permanence : c'est ainsi que « une valeur,
 * plusieurs représentations » devient une habitude de lecture plutôt qu'un
 * chapitre.
 */
function FractionFacts({ frac }) {
  const { t } = useTranslation('mathlab');
  const decimal = fracToDecimal(frac);
  const percent = fracToPercent(frac);
  const reduced = simplify(frac);

  return (
    <dl className="sa-ml-nb__facts" dir="ltr">
      <div>
        <dt>{t('tools.numberLab.decimals.toDecimal')}</dt>
        <dd>{decimalTextOf(decimal)}</dd>
      </div>
      <div>
        <dt>%</dt>
        <dd>{Number.isFinite(percent) ? `${formatNumber(percent, 4)} %` : '—'}</dd>
      </div>
      <div>
        <dt>{t('tools.numberLab.fractions.simplify')}</dt>
        <dd>
          {isSimplified(frac)
            ? t('tools.numberLab.fractions.alreadySimplified')
            : fracToText(reduced)}
        </dd>
      </div>
    </dl>
  );
}
