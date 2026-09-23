import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, FlaskConical, ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react';
import ValueInput from './ValueInput.jsx';
import {
  gcd, lcm, euclideanAlgorithm, factorMethod, commonDivisors, multiples,
  gcdLcmRelation, factorizationToText, areCoprime,
} from './numberTheory.js';
import { runExperiment } from './practice.js';
import { formatNumber } from './numberValue.js';

/**
 * §27 à §31 — Q.M.A et M.M.A.
 *
 * ── §28 : la géométrie d'Euclide ────────────────────────────────────────
 * §28 est explicite : « do NOT only display equations ». Le rectangle
 * 84 × 36 se remplit donc de carrés de 36, puis le reste 36 × 12 de carrés
 * de 12 — et il n'en reste rien. Le dernier carré EST le PGCD, et on le
 * voit : c'est le plus grand carré qui pave le rectangle. L'équation à côté
 * dit la même chose en chiffres.
 *
 * ── §31 : une loi qu'on MESURE ──────────────────────────────────────────
 * `PGCD × PPCM = a × b` n'est pas affirmée : les deux membres sont calculés
 * séparément et comparés à l'écran (`gcdLcmRelation.holds`). L'élève change
 * a et b autant qu'il veut ; l'égalité tient, et c'est lui qui le constate.
 */
export default function GcdLcmMode({ state, onChange, compact, onSaveNote }) {
  const { t } = useTranslation('mathlab');
  const { a, b, method } = state;
  const [step, setStep] = useState(null);
  const [experiment, setExperiment] = useState(null);
  // §28 : le pas MIS EN AVANT — survolé dans la liste, ou dans le dessin.
  // C'est lui qui relie « 84 = 2 × 36 + 12 » aux deux carrés de 36.
  const [activeStep, setActiveStep] = useState(null);

  const euclid = useMemo(() => euclideanAlgorithm(a, b), [a, b]);
  const factors = useMemo(() => factorMethod(a, b), [a, b]);
  const relation = useMemo(() => gcdLcmRelation(a, b), [a, b]);
  const common = useMemo(() => commonDivisors(a, b), [a, b]);
  const multiplesA = useMemo(() => multiples(a, 14), [a]);
  const multiplesB = useMemo(() => multiples(b, 14), [b]);
  const theLcm = lcm(a, b);
  const shownSteps = step === null ? euclid?.steps.length ?? 0 : step;

  return (
    <div className="sa-ml-nb__mode sa-ml-nb__mode--gcdlcm">
      <div className="sa-ml-nb__row sa-ml-nb__row--wrap">
        <ValueInput value={a} onChange={(next) => { onChange({ a: Math.max(1, next) }); setStep(null); }} label={t('tools.numberLab.gcdLcm.a')} integer min={1} stepper />
        <ValueInput value={b} onChange={(next) => { onChange({ b: Math.max(1, next) }); setStep(null); }} label={t('tools.numberLab.gcdLcm.b')} integer min={1} stepper />
        <label className="sa-ml-nb__field">
          <span className="sa-ml-nb__label">{t('tools.numberLab.gcdLcm.method')}</span>
          <select className="sa-ml-nb__select" value={method} onChange={(event) => onChange({ method: event.target.value })}>
            {['euclid', 'factors', 'lists'].map((m) => (
              <option key={m} value={m}>{t(`tools.numberLab.gcdLcm.methods.${m}`)}</option>
            ))}
          </select>
        </label>
      </div>

      {/* §29 : les curseurs — on fait varier et on regarde. */}
      <div className="sa-ml-nb__slider-row">
        <input
          type="range" className="sa-ml-nb__slider" min={1} max={200} value={Math.min(200, a)}
          onChange={(event) => { onChange({ a: Number(event.target.value) }); setStep(null); }}
          aria-label={t('tools.numberLab.gcdLcm.sliderA')}
        />
        <input
          type="range" className="sa-ml-nb__slider" min={1} max={200} value={Math.min(200, b)}
          onChange={(event) => { onChange({ b: Number(event.target.value) }); setStep(null); }}
          aria-label={t('tools.numberLab.gcdLcm.sliderB')}
        />
      </div>

      {/* Les deux résultats, toujours visibles. */}
      <div className="sa-ml-nb__results">
        <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
          {t('tools.numberLab.gcdLcm.gcdValue', { a, b, value: gcd(a, b) })}
        </p>
        <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
          {t('tools.numberLab.gcdLcm.lcmValue', { a, b, value: theLcm })}
        </p>
      </div>

      {areCoprime(a, b) && <p className="sa-ml-nb__callout">{t('tools.numberLab.gcdLcm.coprime')}</p>}
      {a !== b && (a % b === 0 || b % a === 0) && (
        <p className="sa-ml-nb__callout">
          {t('tools.numberLab.gcdLcm.divides', { a: Math.min(a, b), b: Math.max(a, b) })}
        </p>
      )}

      {/* ── §27, §28 : Euclide ──────────────────────────────────────── */}
      {method === 'euclid' && euclid && (
        <section className="sa-ml-nb__panel">
          <header className="sa-ml-nb__panel-head">
            <h4>{t('tools.numberLab.gcdLcm.methods.euclid')}</h4>
            <div className="sa-ml-nb__controls">
              <button
                type="button" className="sa-ml-nb__button sa-ml-nb__button--ghost"
                onClick={() => setStep((s) => Math.min(euclid.steps.length, (s ?? 0) + 1))}
              >
                <Play size={14} aria-hidden="true" />
                {t('tools.numberLab.gcdLcm.euclidStepButton')}
              </button>
              <button type="button" className="sa-ml-nb__button sa-ml-nb__button--ghost" onClick={() => setStep(null)}>
                {t('tools.numberLab.showMore')}
              </button>
            </div>
          </header>
          <p className="sa-ml-nb__muted">{t('tools.numberLab.gcdLcm.euclidHint')}</p>

          {/* §28 : chaque ligne est LIÉE à ses carrés. La survoler les
              allume dans le dessin ; survoler un carré allume sa ligne. Le
              calcul et la figure cessent d'être deux objets. */}
          <ol className="sa-ml-nb__steps sa-ml-nb__steps--linked" dir="ltr">
            {euclid.steps.slice(0, shownSteps).map((s, index) => (
              <li
                key={index}
                className={`${s.remainder === 0 ? 'is-final' : ''}${activeStep === index ? ' is-active' : ''}`}
              >
                <button
                  type="button"
                  className="sa-ml-nb__step-link"
                  onPointerEnter={() => setActiveStep(index)}
                  onPointerLeave={() => setActiveStep(null)}
                  onFocus={() => setActiveStep(index)}
                  onBlur={() => setActiveStep(null)}
                  aria-pressed={activeStep === index}
                >
                  <span className="sa-ml-nb__step-swatch" data-depth={index % 4} aria-hidden="true" />
                  {t('tools.numberLab.gcdLcm.euclidStep', s)}
                  <span className="sa-ml-nb__step-note">
                    {t('tools.numberLab.gcdLcm.squareCount', { count: s.quotient, side: s.divisor })}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {shownSteps >= euclid.steps.length && (
            <p className="sa-ml-nb__result-line">{t('tools.numberLab.gcdLcm.euclidLast', { gcd: euclid.gcd })}</p>
          )}

          {/* §28 : LE MÊME calcul, en rectangles. */}
          <h5 className="sa-ml-nb__subheading">{t('tools.numberLab.gcdLcm.geometric')}</h5>
          <p className="sa-ml-nb__muted">{t('tools.numberLab.gcdLcm.geometricHint')}</p>
          <EuclidRectangles
            steps={euclid.steps.slice(0, shownSteps)}
            a={a} b={b} gcd={euclid.gcd} compact={compact}
            activeStep={activeStep}
            onHoverStep={setActiveStep}
          />
        </section>
      )}

      {/* ── §27 : par les facteurs premiers ─────────────────────────── */}
      {method === 'factors' && factors && (
        <section className="sa-ml-nb__panel">
          <h4>{t('tools.numberLab.gcdLcm.methods.factors')}</h4>
          <p className="sa-ml-nb__muted">{t('tools.numberLab.gcdLcm.columnsHint')}</p>
          <table className="sa-ml-nb__table" dir="ltr">
            <thead>
              <tr>
                <th scope="col" />
                {factors.primes.map((p) => <th key={p} scope="col">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              <FactorRow label={String(a)} factors={factors.a} primes={factors.primes} />
              <FactorRow label={String(b)} factors={factors.b} primes={factors.primes} />
              <FactorRow label={t('tools.numberLab.gcdLcm.gcdShort')} factors={factors.gcd} primes={factors.primes} tone="gcd" />
              <FactorRow label={t('tools.numberLab.gcdLcm.lcmShort')} factors={factors.lcm} primes={factors.primes} tone="lcm" />
            </tbody>
          </table>
          <p className="sa-ml-nb__formula" dir="ltr">
            {t('tools.numberLab.gcdLcm.gcdShort')} = {factorizationToText(factors.gcd) || '1'}
            {' = '}{gcd(a, b)}
          </p>
          <p className="sa-ml-nb__formula" dir="ltr">
            {t('tools.numberLab.gcdLcm.lcmShort')} = {factorizationToText(factors.lcm)} = {theLcm}
          </p>
        </section>
      )}

      {/* ── §27, §30 : les listes ───────────────────────────────────── */}
      {method === 'lists' && (
        <section className="sa-ml-nb__panel">
          <h4>{t('tools.numberLab.gcdLcm.methods.lists')}</h4>

          <h5 className="sa-ml-nb__subheading">{t('tools.numberLab.gcdLcm.commonDivisors')}</h5>
          <ul className="sa-ml-nb__chiplist" dir="ltr">
            {common.map((d) => (
              <li key={d}>
                <span className={`sa-ml-nb__chip${d === gcd(a, b) ? ' is-current' : ''}`}>{d}</span>
              </li>
            ))}
          </ul>
          <p className="sa-ml-nb__muted">{t('tools.numberLab.gcdLcm.commonDivisorsHint')}</p>

          {/* §30 : les deux listes de multiples, et leur PREMIÈRE rencontre. */}
          <h5 className="sa-ml-nb__subheading">{t('tools.numberLab.gcdLcm.firstCommon')}</h5>
          <div className="sa-ml-nb__multiples">
            <MultipleRow label={t('tools.numberLab.gcdLcm.multiplesOfA', { value: a })} list={multiplesA} target={theLcm} />
            <MultipleRow label={t('tools.numberLab.gcdLcm.multiplesOfB', { value: b })} list={multiplesB} target={theLcm} />
          </div>
        </section>
      )}

      {/* ── §31 : la relation, MESURÉE ──────────────────────────────── */}
      {relation && (
        <section className="sa-ml-nb__panel sa-ml-nb__panel--result">
          <h4>{t('tools.numberLab.gcdLcm.relation')}</h4>
          <p className="sa-ml-nb__formula sa-ml-nb__formula--big" dir="ltr">
            {t('tools.numberLab.gcdLcm.relationFormula')}
          </p>
          <p className="sa-ml-nb__formula" dir="ltr">
            {t('tools.numberLab.gcdLcm.relationCheck', {
              gcd: relation.gcd, lcm: relation.lcm, product: relation.product,
              a: relation.a, b: relation.b, ab: relation.abProduct,
            })}
          </p>
          {relation.holds && (
            <>
              <p className="sa-ml-nb__verdict is-prime">{t('tools.numberLab.gcdLcm.relationHolds')}</p>
              <p className="sa-ml-nb__muted">{t('tools.numberLab.gcdLcm.relationHint')}</p>
            </>
          )}
          <div className="sa-ml-nb__controls">
            <button
              type="button" className="sa-ml-nb__button sa-ml-nb__button--ghost"
              onClick={() => setExperiment(runExperiment('gcdLcmProduct', Date.now() % 100000))}
            >
              <FlaskConical size={14} aria-hidden="true" />
              {t('tools.numberLab.practice.experiments.run')}
            </button>
            <button
              type="button" className="sa-ml-nb__link"
              onClick={() => onSaveNote?.(t('tools.numberLab.practice.law.gcdLcmProduct'))}
            >
              {t('tools.numberLab.notes.add')}
            </button>
          </div>

          {experiment && (
            <table className="sa-ml-nb__table" dir="ltr">
              <thead>
                <tr>
                  <th scope="col">a</th><th scope="col">b</th>
                  <th scope="col">{t('tools.numberLab.gcdLcm.gcdShort')}</th>
                  <th scope="col">{t('tools.numberLab.gcdLcm.lcmShort')}</th>
                  <th scope="col">×</th><th scope="col">a × b</th>
                </tr>
              </thead>
              <tbody>
                {experiment.rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.a}</td><td>{row.b}</td><td>{row.gcd}</td>
                    <td>{row.lcm}</td><td>{row.product}</td><td>{row.ab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}

function FactorRow({ label, factors, primes, tone = null }) {
  const map = new Map(factors.map(({ p, e }) => [p, e]));

  return (
    <tr className={tone ? `is-${tone}` : undefined}>
      <th scope="row">{label}</th>
      {primes.map((p) => <td key={p}>{map.get(p) ? `${p}^${map.get(p)}` : '—'}</td>)}
    </tr>
  );
}

function MultipleRow({ label, list, target }) {
  return (
    <div className="sa-ml-nb__multiple-row">
      <span className="sa-ml-nb__bar-label">{label}</span>
      <ul className="sa-ml-nb__chiplist" dir="ltr">
        {list.map((value) => (
          <li key={value}>
            <span className={`sa-ml-nb__chip${value === target ? ' is-current' : ''}`}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * §28 — LE RECTANGLE D'EUCLIDE.
 *
 * Chaque pas pose `quotient` carrés de côté `divisor` dans ce qui reste du
 * rectangle, en alternant horizontal/vertical comme le fait l'algorithme.
 * Le dernier carré posé a pour côté le PGCD : c'est la démonstration, pas
 * une illustration.
 */
function EuclidRectangles({ steps, a, b, gcd: result, compact, activeStep, onHoverStep }) {
  const { t } = useTranslation('mathlab');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef(null);
  const svgRef = useRef(null);

  // La GOUTTIÈRE où s'écrivent les dimensions : au-dessus et à gauche du
  // rectangle, JAMAIS dedans — un nombre posé sur un carré se confond avec
  // le côté de ce carré, et le dessin ment.
  const GUTTER = 24;
  const width = compact ? 300 : 460;
  const long = Math.max(a, b);
  const short = Math.min(a, b);
  const scale = width / long;
  const height = short * scale;

  /**
   * On rejoue le découpage pour placer les carrés — la même récurrence
   * qu'Euclide, mais en pixels. Chaque carré GARDE l'indice de son pas :
   * c'est ce qui permet de relier une ligne de calcul à ses carrés, et
   * inversement (§28 : le dessin et l'équation doivent être LE MÊME objet).
   */
  const squares = useMemo(() => {
    const out = [];
    let originX = 0;
    let originY = 0;
    let horizontal = true;
    steps.forEach((step, index) => {
      for (let i = 0; i < step.quotient && out.length < 500; i += 1) {
        const side = step.divisor * scale;
        out.push({
          x: horizontal ? originX + i * side : originX,
          y: horizontal ? originY : originY + i * side,
          side,
          step: index,
          value: step.divisor,
          // Le rang du carré dans son pas : « le 2ᵉ des 2 carrés de 36 ».
          ordinal: i + 1,
        });
      }
      if (horizontal) originX += step.quotient * step.divisor * scale;
      else originY += step.quotient * step.divisor * scale;
      horizontal = !horizontal;
    });

    return out;
  }, [steps, scale]);

  /** Le RESTE de chaque pas : le rectangle qui part au pas suivant. */
  const remainders = useMemo(() => {
    const out = [];
    let originX = 0;
    let originY = 0;
    let horizontal = true;
    steps.forEach((step, index) => {
      if (horizontal) {
        originX += step.quotient * step.divisor * scale;
        if (step.remainder > 0) {
          out.push({
            step: index,
            x: originX, y: originY,
            w: step.remainder * scale,
            h: step.divisor * scale,
          });
        }
      } else {
        originY += step.quotient * step.divisor * scale;
        if (step.remainder > 0) {
          out.push({
            step: index,
            x: originX, y: originY,
            w: step.divisor * scale,
            h: step.remainder * scale,
          });
        }
      }
      horizontal = !horizontal;
    });

    return out;
  }, [steps, scale]);

  /* ── Le zoom et le déplacement (pour voir les DERNIERS carrés) ──────── */

  const zoomBy = useCallback((factor) => {
    setZoom((current) => Math.min(12, Math.max(1, current * factor)));
  }, []);

  const reset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  /** Cadrer le DERNIER pas : les plus petits carrés, ceux du PGCD. */
  const focusLast = useCallback(() => {
    const last = squares.filter((sq) => sq.step === steps.length - 1);
    if (last.length === 0) return;
    const minX = Math.min(...last.map((s) => s.x));
    const maxX = Math.max(...last.map((s) => s.x + s.side));
    const minY = Math.min(...last.map((s) => s.y));
    const maxY = Math.max(...last.map((s) => s.y + s.side));
    const boxW = Math.max(1, maxX - minX);
    const boxH = Math.max(1, maxY - minY);
    const next = Math.min(12, Math.max(1, Math.min(width / boxW, height / boxH) * 0.8));
    setZoom(next);
    setPan({
      x: width / 2 - ((minX + maxX) / 2) * next,
      y: height / 2 - ((minY + maxY) / 2) * next,
    });
  }, [squares, steps.length, width, height]);

  const onPointerDown = useCallback((event) => {
    if (zoom <= 1) return;
    panRef.current = { x: event.clientX, y: event.clientY, pan };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [zoom, pan]);

  const onPointerMove = useCallback((event) => {
    const drag = panRef.current;
    if (!drag) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (width + GUTTER) / rect.width;
    setPan({
      x: drag.pan.x + (event.clientX - drag.x) * ratio,
      y: drag.pan.y + (event.clientY - drag.y) * ratio,
    });
  }, [width]);

  const endPan = useCallback((event) => {
    panRef.current = null;
    event.currentTarget?.releasePointerCapture?.(event.pointerId);
  }, []);

  const onWheel = useCallback((event) => {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? 1 / 1.2 : 1.2);
  }, [zoomBy]);

  const lastStep = steps.length - 1;

  return (
    <div className="sa-ml-nb__euclid">
      <div className="sa-ml-nb__euclid-actions">
        <button type="button" className="sa-ml-nb__mini" onClick={() => zoomBy(1.4)} aria-label={t('tools.numberLab.line.zoomIn')}>
          <ZoomIn size={15} aria-hidden="true" />
        </button>
        <button type="button" className="sa-ml-nb__mini" onClick={() => zoomBy(1 / 1.4)} aria-label={t('tools.numberLab.line.zoomOut')}>
          <ZoomOut size={15} aria-hidden="true" />
        </button>
        <button type="button" className="sa-ml-nb__button sa-ml-nb__button--ghost" onClick={focusLast}>
          <Search size={14} aria-hidden="true" />
          {t('tools.numberLab.gcdLcm.focusLast')}
        </button>
        <button type="button" className="sa-ml-nb__button sa-ml-nb__button--ghost" onClick={reset}>
          <RotateCcw size={14} aria-hidden="true" />
          {t('tools.numberLab.gcdLcm.resetView')}
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width + GUTTER} ${height + GUTTER}`}
        width="100%"
        role="img"
        aria-label={t('tools.numberLab.gcdLcm.geometricLabel', { a: long, b: short })}
        preserveAspectRatio="xMidYMid meet"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
      >
        {/* Les DIMENSIONS, dans la gouttière : le rectangle reste intact. */}
        <text x={GUTTER + width / 2} y={13} className="sa-ml-nb__euclid-dim" textAnchor="middle">{long}</text>
        <text
          x={11} y={GUTTER + height / 2}
          className="sa-ml-nb__euclid-dim"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(-90 11 ${GUTTER + height / 2})`}
        >
          {short}
        </text>

        {/* Le dessin est FENÊTRÉ : on zoome dedans sans déborder du cadre. */}
        <clipPath id="sa-ml-nb-euclid-clip">
          <rect x={0} y={0} width={width} height={height} />
        </clipPath>

        <g transform={`translate(${GUTTER} ${GUTTER})`}>
          <g clipPath="url(#sa-ml-nb-euclid-clip)">
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              <rect x={0} y={0} width={width} height={height} className="sa-ml-nb__euclid-frame" />

              {/* Le RESTE de chaque pas, hachuré : c'est lui qui devient le
                  rectangle du pas suivant — le lien entre deux lignes. */}
              {remainders.map((rest) => (
                <rect
                  key={`rest-${rest.step}`}
                  x={rest.x} y={rest.y} width={rest.w} height={rest.h}
                  className={`sa-ml-nb__euclid-rest${activeStep === rest.step ? ' is-active' : ''}`}
                />
              ))}

              {squares.map((square, index) => {
                const dim = activeStep !== null && activeStep !== square.step;
                const fits = square.side * zoom >= 22;

                return (
                  <g
                    key={index}
                    className={`sa-ml-nb__euclid-group${dim ? ' is-dimmed' : ''}${activeStep === square.step ? ' is-active' : ''}`}
                    onPointerEnter={() => onHoverStep?.(square.step)}
                    onPointerLeave={() => onHoverStep?.(null)}
                  >
                    <rect
                      x={square.x} y={square.y}
                      width={Math.max(0.5, square.side - 1 / zoom)}
                      height={Math.max(0.5, square.side - 1 / zoom)}
                      className={`sa-ml-nb__euclid-square is-depth${square.step % 4}${square.step === lastStep ? ' is-gcd' : ''}`}
                      strokeWidth={1 / zoom}
                    />
                    {/* Le côté ÉCRIT dans le carré — seulement s'il y tient.
                        Le zoom le fait apparaître : c'est à cela qu'il sert. */}
                    {fits && (
                      <text
                        x={square.x + square.side / 2}
                        y={square.y + square.side / 2}
                        className="sa-ml-nb__euclid-label"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: `${Math.min(13, Math.max(7, square.side * zoom * 0.3)) / zoom}px` }}
                      >
                        {square.value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </g>
      </svg>

      {/* §28 : le dernier carré EST le PGCD — dit en toutes lettres. */}
      {steps.length > 0 && steps[steps.length - 1].remainder === 0 && (
        <p className="sa-ml-nb__result-line" dir="ltr">
          {t('tools.numberLab.gcdLcm.geometricResult', { gcd: result })}
        </p>
      )}
    </div>
  );
}
