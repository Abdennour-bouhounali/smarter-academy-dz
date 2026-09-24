import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb, Check, Circle, FlaskConical, BookOpen, Sparkles,
} from 'lucide-react';
import { formatValue } from '../functionGrapher/grapherFormat.js';
import { isDefinitionOf } from './investigations.js';

/**
 * Ce que l'instrument RÉPOND à une règle proposée (§7, §20, §21, §24, §25).
 *
 * Quatre choses, dans cet ordre, et jamais un verdict sec :
 *
 *   1. le CONTRE-EXEMPLE, quand la règle tombe — la ligne où elle prédit 7
 *      alors que la mesure donne 12, et la question « pourquoi ? » ;
 *   2. la PREUVE qui manque encore, quand elle tient — trois observations,
 *      variées, et une épreuve sur un objet non choisi (§25) ;
 *   3. l'INDICE, si l'élève le demande — trois paliers, jamais la réponse ;
 *   4. l'EXPLICATION géométrique, une fois la règle trouvée : pourquoi elle
 *      DOIT valoir, ce qu'aucun tableau de mesures ne dira jamais (§21).
 *
 * Le mot « démontré » n'apparaît nulle part. « صمدت » (elle a tenu) oui.
 */
export default function DiscoveryPanel({
  investigation, record, evidence, solved, onHint, onUnseenTest, onExplained, onReset,
}) {
  const { t } = useTranslation('mathlab');
  const [storyOpen, setStoryOpen] = useState(false);
  const stage = record.stage;
  const check = evidence.check;

  return (
    <section className="sa-ml-ms__panelSection" aria-labelledby="sa-ml-ms-disc">
      <header className="sa-ml-ms__panelHead">
        <h3 id="sa-ml-ms-disc" className="sa-ml-ms__panelTitle">
          {t('tools.measurement.test.heading')}
        </h3>
        <span className={`sa-ml-ms__phase sa-ml-ms__phase--${stage}`}>
          {t(`tools.measurement.stages.${stage}`)}
        </span>
      </header>

      <p className="sa-ml-ms__phaseHint">{t(`tools.measurement.stages.${stage}Hint`)}</p>

      {/* ── 1. Le résultat de l'épreuve ──────────────────────────────── */}
      {check.verdict === 'empty' && (
        <p className="sa-ml-ms__note">{t('tools.measurement.test.needObservations')}</p>
      )}

      {check.verdict === 'fails' && check.counterexample && (
        <div className="sa-ml-ms__counter" role="status">
          <h4 className="sa-ml-ms__counterTitle">
            {t('tools.measurement.test.counterexampleHeading')}
          </h4>
          <dl className="sa-ml-ms__counterRows" dir="ltr">
            {Object.entries(check.counterexample.values)
              .filter(([key]) => key !== investigation.target)
              .slice(0, 4)
              .map(([key, value]) => (
                <div key={key} className="sa-ml-ms__counterRow">
                  <dt>{symbolFor(investigation, key)}</dt>
                  <dd>{formatValue(value, 2)}</dd>
                </div>
              ))}
          </dl>
          <p className="sa-ml-ms__counterLine">
            {t('tools.measurement.test.counterexampleMeasured', {
              value: formatValue(check.counterexample.measured, 2),
            })}
          </p>
          <p className="sa-ml-ms__counterLine sa-ml-ms__counterLine--mine">
            {t('tools.measurement.test.counterexamplePredicted', {
              value: formatValue(check.counterexample.predicted, 2),
            })}
          </p>
          <p className="sa-ml-ms__counterAsk">
            {t('tools.measurement.test.counterexampleAsk')}
          </p>
        </div>
      )}

      {check.verdict === 'holds' && (
        <div className="sa-ml-ms__holds" role="status">
          <p className="sa-ml-ms__holdsLine">
            <Check size={16} aria-hidden="true" />
            {t('tools.measurement.test.holds', { count: check.passed })}
          </p>
          {/* §21 : ce n'est PAS une démonstration, et on le dit. */}
          {/* Â + B̂ + Ĉ tient toujours : c'est la définition de S, pas encore
              la découverte. On le dit, au lieu de laisser l'élève attendre un
              « trouvé » qui ne viendra pas. */}
          {isDefinitionOf(investigation, record.rule) ? (
            <p className="sa-ml-ms__notProof" data-ml-ms-definition>{t('tools.measurement.test.isDefinition')}</p>
          ) : !solved || !evidence.satisfied ? (
            <p className="sa-ml-ms__notProof">{t('tools.measurement.test.holdsNotProof')}</p>
          ) : null}
        </div>
      )}

      {/* ── 2. La preuve qui manque (§25) ────────────────────────────── */}
      {record.rule && check.verdict !== 'empty' && (
        <div className="sa-ml-ms__evidence">
          <h4 className="sa-ml-ms__evidenceTitle">{t('tools.measurement.evidence.heading')}</h4>
          <ul className="sa-ml-ms__evidenceList">
            {[
              ['enough', evidence.enough],
              ['varied', evidence.varied],
              ['holds', evidence.holds],
              ...(evidence.requirement.requiresUnseenTest ? [['tested', evidence.tested]] : []),
            ].map(([key, done]) => (
              <li key={key} className={done ? 'is-done' : undefined}>
                {done
                  ? <Check size={15} aria-hidden="true" />
                  : <Circle size={15} aria-hidden="true" />}
                <span>{t(`tools.measurement.evidence.${key}`)}</span>
                <span className="sa-ml-ms__sr">
                  {done ? t('tools.measurement.evidence.done') : t('tools.measurement.evidence.todo')}
                </span>
              </li>
            ))}
          </ul>

          {/* Toute la grille déjà mesurée (`exhaustive`) : il n'existe plus
              d'objet jamais vu, et c'est ce bouton qui constate la découverte. */}
          {evidence.holds && (!evidence.tested || (evidence.exhaustive && stage !== 'found' && stage !== 'explained')) && (
            <button type="button" className="sa-ml-ms__primaryBtn" onClick={onUnseenTest}>
              <FlaskConical size={16} aria-hidden="true" />
              {t('tools.measurement.rule.testAgain')}
            </button>
          )}
        </div>
      )}

      {/* Les épreuves déjà passées, sur des objets non choisis. */}
      {record.tests.length > 0 && (
        <div className="sa-ml-ms__unseen">
          <h4 className="sa-ml-ms__evidenceTitle">{t('tools.measurement.test.unseenHeading')}</h4>
          <ul className="sa-ml-ms__unseenList" dir="ltr">
            {record.tests.slice(-3).map((row, index) => {
              const result = evidence.testCheck.results.find((entry) => entry.id === row.id);

              return (
                <li key={row.id} className={result?.matches ? 'is-match' : 'is-mismatch'}>
                  <span className="sa-ml-ms__unseenValues">
                    {Object.entries(row.values)
                      .filter(([key]) => key !== investigation.target)
                      .slice(0, 3)
                      .map(([key, value]) => `${symbolFor(investigation, key)} = ${formatValue(value, 2)}`)
                      .join('  ·  ')}
                  </span>
                  {result && (
                    <span className="sa-ml-ms__unseenResult">
                      {t('tools.measurement.test.measured')} {formatValue(result.measured, 2)}
                      {' · '}
                      {t('tools.measurement.test.predicted')} {formatValue(result.predicted, 2)}
                      {' · '}
                      {result.matches
                        ? t('tools.measurement.test.match')
                        : t('tools.measurement.test.mismatch')}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── 3. Les indices (§24) ─────────────────────────────────────── */}
      <div className="sa-ml-ms__hints">
        {record.hintsUsed > 0 && (
          <ol className="sa-ml-ms__hintList">
            {Array.from({ length: record.hintsUsed }, (unused, index) => (
              <li key={index}>
                {t(`tools.measurement.hints.${investigation.id}.${index + 1}`)}
              </li>
            ))}
          </ol>
        )}
        {record.hintsUsed < investigation.hintCount ? (
          <button type="button" className="sa-ml-ms__ghostBtn" onClick={onHint}>
            <Lightbulb size={15} aria-hidden="true" />
            {t('tools.measurement.hints.ask')}
            <span className="sa-ml-ms__hintCount">
              {t('tools.measurement.hints.used', {
                used: record.hintsUsed, total: investigation.hintCount,
              })}
            </span>
          </button>
        ) : (
          <p className="sa-ml-ms__note">{t('tools.measurement.hints.exhausted')}</p>
        )}
      </div>

      {/* ── 4. L'explication géométrique — SEULEMENT une fois trouvée ── */}
      {(stage === 'found' || stage === 'explained') && (
        <div className="sa-ml-ms__explain">
          <h4 className="sa-ml-ms__evidenceTitle">
            <Sparkles size={15} aria-hidden="true" />
            {t('tools.measurement.explain.heading')}
          </h4>
          <p className="sa-ml-ms__explainBody">
            {t(`tools.measurement.explain.${investigation.explanation}`)}
          </p>
          {stage === 'found' && (
            <button type="button" className="sa-ml-ms__primaryBtn" onClick={onExplained}>
              {t('tools.measurement.explain.understood')}
            </button>
          )}
        </div>
      )}

      {/* « كيف ظهرت هذه القاعدة؟ » (§22) — le chemin, pas la formule. */}
      <div className="sa-ml-ms__story">
        <button
          type="button"
          className="sa-ml-ms__ghostBtn"
          onClick={() => setStoryOpen((open) => !open)}
          aria-expanded={storyOpen}
        >
          <BookOpen size={15} aria-hidden="true" />
          {t('tools.measurement.story.open')}
        </button>
        {storyOpen && (
          <div className="sa-ml-ms__storyBody">
            <p className="sa-ml-ms__note">{t('tools.measurement.story.intro')}</p>
            <ol className="sa-ml-ms__storySteps">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <li key={step}>
                  {t(`tools.measurement.story.${investigation.id}.${step}`, {
                    defaultValue: t(`tools.measurement.story.generic.${step}`),
                  })}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <button type="button" className="sa-ml-ms__ghostBtn sa-ml-ms__resetInv" onClick={onReset}>
        {t('tools.measurement.reset')}
      </button>
    </section>
  );
}

/** Le symbole d'une grandeur, pour une ligne de contre-exemple. */
function symbolFor(investigation, key) {
  return investigation.quantities.find((entry) => entry.key === key)?.symbol ?? key;
}
