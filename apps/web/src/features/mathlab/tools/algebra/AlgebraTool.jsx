import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Undo2, Redo2, Shuffle, Eye, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import './algebra.css';
import MathText from '../../../../lessons/common/components/MathText.jsx';
import * as R from './rational.js';
import {
  parseEquation,
  applyOperation,
  classify,
  solve,
  equationToLatex,
  equationToText,
  isInequality,
  RELATION_TEXT,
} from './equation.js';
import { makeLinear } from './linearForm.js';
import {
  normalizeAlgebraData,
  currentEquation,
  pushStep,
  resetTo,
  undo,
  redo,
  canUndo,
  canRedo,
  createAlgebraData,
} from './algebraState.js';
import { suggestOperations, parseOperationValue } from './operationHints.js';
import { verifyResolution } from './verify.js';
import { generateEquation, LEVELS, DEFAULT_LEVEL } from './generator.js';
import BalanceScale from './BalanceScale.jsx';
import NumberLine from './NumberLine.jsx';
import OperationControls from './OperationControls.jsx';
import StepHistory from './StepHistory.jsx';
import ParameterPanel from './ParameterPanel.jsx';

/** Le délai entre un changement et sa remise à la coquille (qui attend encore avant d'enregistrer). */
const SERIALIZE_MS = 300;

/**
 * Le مختبر الجبر dans la coquille du مختبر (MathLabToolProps — toolContract.js).
 *
 * L'état du document (algebraState.js) vit ICI ; toute la mathématique est
 * dans les modules purs (equation.js, linearForm.js, rational.js) que ce
 * composant se contente d'appeler. Aucun calcul symbolique dans le JSX —
 * c'est la règle §27 du cahier des charges, et celle de tout le laboratoire.
 *
 *     une équation → une opération sur LES DEUX membres → observer → recommencer
 *
 * L'écran n'ouvre JAMAIS sur la solution (§8) : `showSolution` part à faux,
 * et « إظهار الحل » reste une commande secondaire.
 */
export default function AlgebraTool({ initialData, onChange, onReady }) {
  const { t } = useTranslation('mathlab');
  const [data, setData] = useState(() => normalizeAlgebraData(initialData));
  const [draft, setDraft] = useState(() => normalizeAlgebraData(initialData).source);
  const [inputError, setInputError] = useState(null);
  const [operationError, setOperationError] = useState(null);
  const [verification, setVerification] = useState(null);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [announcement, setAnnouncement] = useState('');

  const timerRef = useRef(null);
  const dataRef = useRef(data);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  dataRef.current = data;

  /** Une modification voulue : appliquée tout de suite, remise à la coquille après SERIALIZE_MS. */
  const commit = useCallback((updater) => {
    setData((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (next === current) return current;
      dataRef.current = next;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        onChangeRef.current?.(dataRef.current);
      }, SERIALIZE_MS);

      return next;
    });
  }, []);

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      onChangeRef.current?.(dataRef.current);
    }
  }, []);

  const equation = currentEquation(data);
  const verdict = useMemo(() => classify(equation), [equation]);
  const suggestions = useMemo(() => suggestOperations(equation), [equation]);
  const inequality = isInequality(equation.relation);

  // ── La coquille : « مسح الكل » remet une équation neuve ────────────────
  useEffect(() => {
    onReady?.({
      clear: () => {
        const fresh = createAlgebraData();
        setDraft(fresh.source);
        setInputError(null);
        setOperationError(null);
        setVerification(null);
        commit(fresh);
      },
    });

    return () => onReady?.(null);
  }, [onReady, commit]);

  /** Une opération, d'un raccourci ou de la saisie. Rend true si elle a été appliquée. */
  const applyKind = useCallback(({ kind, value, text }) => {
    setVerification(null);
    let rational = value;
    if (!rational) {
      const parsed = parseOperationValue(text);
      if (!parsed.ok) {
        setOperationError(t(`tools.algebra.valueErrors.${parsed.error.code}`, { defaultValue: t('tools.algebra.valueErrors.notANumber') }));

        return false;
      }
      rational = parsed.value;
    }

    const result = applyOperation(currentEquation(dataRef.current), { kind, value: rational });
    if (!result.ok) {
      setOperationError(t(`tools.algebra.operationErrors.${result.error.code}`, { defaultValue: t('tools.algebra.operationErrors.unsupported') }));

      return false;
    }

    setOperationError(null);
    commit((current) => pushStep(current, result.equation, { kind, value: rational }, result.flipped));
    setAnnouncement(result.flipped
      ? t('tools.algebra.announceFlipped', { equation: equationToText(result.equation) })
      : t('tools.algebra.announceStep', { equation: equationToText(result.equation) }));

    return true;
  }, [commit, t]);

  /** « استكشاف » : lire la saisie et repartir de cette équation. */
  const explore = useCallback((event) => {
    event?.preventDefault();
    const parsed = parseEquation(draft);
    if (!parsed.ok) {
      const { code, side } = parsed.error;
      setInputError(t(`tools.algebra.parseErrors.${code}`, {
        defaultValue: t('tools.algebra.parseErrors.syntax'),
        symbol: parsed.error.symbol ?? '',
        side: side ? t(`tools.algebra.${side}Side`) : '',
      }));

      return;
    }
    setInputError(null);
    setOperationError(null);
    setVerification(null);
    commit((current) => resetTo(current, parsed.equation, draft));
    setAnnouncement(t('tools.algebra.announceNew', { equation: equationToText(parsed.equation) }));
  }, [draft, commit, t]);

  /** « معادلة جديدة » : un exercice du niveau choisi. */
  const generate = useCallback(() => {
    const relation = inequality && Math.random() < 0.5 ? equation.relation : '=';
    const { equation: next, source } = generateEquation({ level, relation });
    setDraft(source);
    setInputError(null);
    setOperationError(null);
    setVerification(null);
    commit((current) => resetTo(current, next, source));
    setAnnouncement(t('tools.algebra.announceNew', { equation: source }));
  }, [level, commit, t, inequality, equation.relation]);

  const toggleSolution = useCallback(() => {
    commit((current) => ({ ...current, showSolution: !current.showSolution }));
  }, [commit]);

  /**
   * « التحقق » : confronter la solution à la relation de DÉPART. Pour une
   * متراجحة, on ne substitue PAS la borne seule (elle rend les membres
   * égaux, et `<`/`>` y seraient faussement « ✗ ») : une valeur de
   * l'ensemble, puis l'égalité en la borne (`verifyResolution`).
   */
  const verify = useCallback(() => {
    if (!verdict.solution) return;
    setVerification(verifyResolution(data.steps[0].equation, verdict.solution, verdict.relation ?? '='));
  }, [verdict.solution, verdict.relation, data.steps]);

  const goToStep = useCallback((index) => {
    setVerification(null);
    commit((current) => ({ ...current, cursor: Math.max(0, Math.min(current.steps.length - 1, index)) }));
  }, [commit]);

  const doUndo = useCallback(() => { setVerification(null); commit(undo); }, [commit]);
  const doRedo = useCallback(() => { setVerification(null); commit(redo); }, [commit]);

  /** Le panneau `ax + b = c` : changer un paramètre repart d'une équation neuve. */
  const changeParameters = useCallback((next) => {
    const equationFromParams = {
      left: makeLinear(R.makeRational(next.a), R.makeRational(next.b)),
      right: makeLinear(R.ZERO, R.makeRational(next.c)),
      relation: '=',
    };
    setVerification(null);
    setDraft(equationToText(equationFromParams));
    commit((current) => ({ ...resetTo(current, equationFromParams), parameters: next }));
  }, [commit]);

  const toggleParameters = useCallback(() => {
    commit((current) => ({ ...current, parameters: current.parameters ? null : { a: 2, b: 3, c: 11 } }));
  }, [commit]);

  const changeNumberLine = useCallback((view) => {
    commit((current) => ({ ...current, numberLine: { ...current.numberLine, ...view } }));
  }, [commit]);

  // Le verdict en toutes lettres — ce que l'élève lit, et ce qu'un lecteur
  // d'écran annonce. Chaque état a SA phrase : jamais un faux nombre.
  const solutionLine = useMemo(() => {
    if (verdict.kind === 'none') return { tone: 'none', text: t('tools.algebra.noSolution') };
    if (verdict.kind === 'infinite') return { tone: 'infinite', text: t('tools.algebra.infiniteSolutions') };
    const solved = solve(equation);
    if (!solved.equation) return null;

    return { tone: 'unique', latex: equationToLatex(solved.equation), relation: solved.relation, solution: solved.solution };
  }, [verdict, equation, t]);

  return (
    <div className="sa-ml-alg" role="region" aria-label={t('tools.algebra.name')} data-ml-algebra>
      <div className="sa-ml-alg__stage">
        {/* L'équation courante, en grand — la seule chose qui compte */}
        <div className="sa-ml-alg__current" dir="ltr" data-ml-current-equation>
          <MathText>{`$$${equationToLatex(equation)}$$`}</MathText>
        </div>

        <BalanceScale equation={equation} verdict={verdict} />

        {/* La droite graduée ne DONNE pas la réponse : tant que l'élève n'a
            pas isolé l'inconnue (ou demandé « إظهار الحل »), elle montre la
            graduation sans placer la borne — sinon elle trahirait §8. */}
        {inequality && (
          <NumberLine
            solution={verdict.solved || data.showSolution ? verdict.solution : null}
            relation={verdict.relation ?? equation.relation}
            view={data.numberLine}
            onChangeView={changeNumberLine}
          />
        )}

        {/* Le verdict : secondaire, jamais à l'ouverture */}
        <div className="sa-ml-alg__verdict">
          {solutionLine?.tone === 'unique' && !data.showSolution && verdict.kind !== 'solved' && (
            <button type="button" className="sa-ml-alg__ghost" onClick={toggleSolution}>
              <Eye size={15} aria-hidden="true" />
              {t('tools.algebra.showSolution')}
            </button>
          )}
          {solutionLine && (solutionLine.tone !== 'unique' || data.showSolution || verdict.kind === 'solved') && (
            <p className={`sa-ml-alg__solution sa-ml-alg__solution--${solutionLine.tone}`} data-ml-solution>
              <span className="sa-ml-alg__solution-label">{t('tools.algebra.solution')}</span>
              {solutionLine.latex
                ? <MathText>{`$${solutionLine.latex}$`}</MathText>
                : <span>{solutionLine.text}</span>}
            </p>
          )}
          {solutionLine?.tone === 'unique' && (data.showSolution || verdict.kind === 'solved') && (
            <button type="button" className="sa-ml-alg__ghost" onClick={verify}>
              <CheckCircle2 size={15} aria-hidden="true" />
              {t('tools.algebra.verify')}
            </button>
          )}
        </div>

        {verification?.kind === 'equation' && (
          <div className="sa-ml-alg__verification" data-ml-verification="equation">
            <p className="sa-ml-alg__verification-title">
              {t('tools.algebra.verificationTitle', { value: R.toPlainText(verification.value) })}
            </p>
            <MathText>{`$$${verification.check.lines.substituted}$$`}</MathText>
            <MathText>{`$$${verification.check.lines.evaluated}$$`}</MathText>
            <p className={`sa-ml-alg__verification-verdict${verification.holds ? '' : ' sa-ml-alg__verification-verdict--false'}`}>
              {verification.holds ? t('tools.algebra.verificationTrue') : t('tools.algebra.verificationFalse')}
            </p>
          </div>
        )}
        {verification?.kind === 'inequality' && (
          <div className="sa-ml-alg__verification" data-ml-verification="inequality" data-ml-verification-holds={String(verification.holds)}>
            {/* 1. Une valeur DE l'ensemble des solutions vérifie la متراجحة. */}
            <p className="sa-ml-alg__verification-title">
              {t('tools.algebra.verificationInequalityTitle', { value: R.toPlainText(verification.sample) })}
            </p>
            <MathText>{`$$${verification.inside.lines.substituted}$$`}</MathText>
            <MathText>{`$$${verification.inside.lines.evaluated}$$`}</MathText>
            <p className={`sa-ml-alg__verification-verdict${verification.inside.holds ? '' : ' sa-ml-alg__verification-verdict--false'}`}>
              {verification.inside.holds
                ? t('tools.algebra.verificationInequalityTrue', { value: R.toPlainText(verification.sample) })
                : t('tools.algebra.verificationInequalityFalse')}
            </p>
            {/* 2. En la borne, les deux membres sont égaux : la relation y bascule. */}
            <p className="sa-ml-alg__verification-title">
              {t('tools.algebra.verificationBoundaryTitle', { value: R.toPlainText(verification.boundary.value) })}
            </p>
            <MathText>{`$$${verification.boundary.check.lines.substituted}$$`}</MathText>
            <MathText>{`$$${verification.boundary.check.lines.evaluated}$$`}</MathText>
            <p className={`sa-ml-alg__verification-verdict${verification.holds ? '' : ' sa-ml-alg__verification-verdict--false'}`}>
              {boundaryMessage(verification, t)}
            </p>
          </div>
        )}
      </div>

      <div className="sa-ml-alg__panel">
        <div className="sa-ml-alg__panel-body">
          {/* La saisie */}
          <section className="sa-ml-alg__section">
            <h3 className="sa-ml-alg__heading">{t('tools.algebra.equationHeading')}</h3>
            <form className="sa-ml-alg__equation-form" onSubmit={explore}>
              <label className="sa-ml-alg__sr" htmlFor="sa-ml-alg-input">{t('tools.algebra.inputLabel')}</label>
              <input
                id="sa-ml-alg-input"
                className="sa-ml-alg__input"
                type="text"
                dir="ltr"
                lang="en"
                inputMode="text"
                autoComplete="off"
                spellCheck="false"
                value={draft}
                onChange={(event) => { setDraft(event.target.value); setInputError(null); }}
                placeholder="2x + 3 = 11"
                aria-invalid={inputError ? 'true' : undefined}
                aria-describedby={inputError ? 'sa-ml-alg-input-error' : undefined}
                data-ml-equation-input
              />
              <button type="submit" className="sa-ml-alg__explore">{t('tools.algebra.explore')}</button>
            </form>
            {inputError && <p className="sa-ml-alg__error" id="sa-ml-alg-input-error" role="alert">{inputError}</p>}

            <div className="sa-ml-alg__generate">
              <label className="sa-ml-alg__sr" htmlFor="sa-ml-alg-level">{t('tools.algebra.levelLabel')}</label>
              <select
                id="sa-ml-alg-level"
                className="sa-ml-alg__level"
                value={level}
                onChange={(event) => setLevel(Number(event.target.value))}
              >
                {LEVELS.map((value) => (
                  <option key={value} value={value}>{t(`tools.algebra.levels.${value}`)}</option>
                ))}
              </select>
              <button type="button" className="sa-ml-alg__new" onClick={generate}>
                <Shuffle size={15} aria-hidden="true" />
                {t('tools.algebra.newEquation')}
              </button>
            </div>
          </section>

          <OperationControls
            suggestions={suggestions}
            onApply={applyKind}
            disabled={verdict.kind === 'none' || verdict.kind === 'infinite'}
            error={operationError}
          />

          {/* تراجع / إعادة */}
          <div className="sa-ml-alg__history-actions">
            <button type="button" className="sa-ml-alg__mini-action" onClick={doUndo} disabled={!canUndo(data)} data-ml-undo>
              <Undo2 size={15} aria-hidden="true" />
              {t('tools.algebra.undo')}
            </button>
            <button type="button" className="sa-ml-alg__mini-action" onClick={doRedo} disabled={!canRedo(data)} data-ml-redo>
              <Redo2 size={15} aria-hidden="true" />
              {t('tools.algebra.redo')}
            </button>
            <button
              type="button"
              className={`sa-ml-alg__mini-action${data.parameters ? ' sa-ml-alg__mini-action--active' : ''}`}
              onClick={toggleParameters}
              aria-pressed={Boolean(data.parameters)}
            >
              <SlidersHorizontal size={15} aria-hidden="true" />
              {t('tools.algebra.parameters')}
            </button>
          </div>

          {data.parameters && <ParameterPanel values={data.parameters} onChange={changeParameters} />}

          <StepHistory steps={data.steps} cursor={data.cursor} onSelect={goToStep} />
        </div>
      </div>

      {/* Tout état mathématique a une forme TEXTUELLE (§34) */}
      <p className="sa-ml-alg__sr" role="status" aria-live="polite">{announcement}</p>
      <p className="sa-ml-alg__sr">
        {t('tools.algebra.stateSummary', {
          equation: equationToText(equation),
          step: data.cursor + 1,
          total: data.steps.length,
        })}
      </p>
    </div>
  );
}

/**
 * Ce que dit la borne d'une متراجحة : égale ou non, solution ou non — selon
 * le symbole de DÉPART, seul juge de l'égalité.
 */
function boundaryMessage(verification, t) {
  const { boundary } = verification;
  const params = {
    value: R.toPlainText(boundary.value),
    symbol: RELATION_TEXT[verification.startRelation],
  };
  if (!boundary.equal) return t('tools.algebra.verificationBoundaryFalse');
  if (boundary.included !== boundary.claimedIncluded) return t('tools.algebra.verificationBoundaryMismatch', params);

  return t(boundary.included ? 'tools.algebra.verificationBoundaryIncluded' : 'tools.algebra.verificationBoundaryExcluded', params);
}
