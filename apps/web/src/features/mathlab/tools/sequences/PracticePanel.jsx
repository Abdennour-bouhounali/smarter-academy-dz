import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Eye, Check, ChevronRight, X } from 'lucide-react';
import { explainTerms } from './practice.js';
import { formatTerm, termName } from './sequenceFormat.js';

/**
 * L'ENTRAÎNEMENT à l'écran : prédire → vérifier → révéler (§27, §28, §29).
 *
 * ── Ce panneau ne bloque JAMAIS ──────────────────────────────────────────
 * §27 : « The student can always retry. Wrong answers must not block
 * exploration. » Concrètement, après une réponse fausse :
 *   - le champ reste modifiable ;
 *   - « révéler » reste actif ;
 *   - « question suivante » reste actif ;
 *   - la suite derrière le panneau reste entièrement manipulable.
 * Il n'existe aucun état où l'élève doive trouver la bonne réponse pour
 * continuer. C'est vérifié par l'e2e, qui répond faux exprès.
 *
 * ── L'explication d'une erreur (§29) ─────────────────────────────────────
 * §29 interdit le simple « Incorrect » et demande de montrer le raisonnement
 * avec l'état réel de la suite. À la révélation, on affiche donc les VRAIS
 * termes — 2, 5, 8, 11, 14 — calculés par le moteur, le terme attendu mis en
 * évidence. L'élève voit où son calcul a bifurqué au lieu de lire un verdict.
 */
export default function PracticePanel({
  practice, onAnswer, onSubmit, onHint, onReveal, onNext, onClose,
}) {
  const { t } = useTranslation('mathlab');
  const { challenge, phase, answer, verdict, hintsUsed } = practice;

  const explanation = useMemo(
    () => (phase === 'reveal' && challenge ? explainTerms(challenge) : null),
    [phase, challenge],
  );

  if (!challenge) return null;

  const hintKey = hintsUsed > 0
    ? challenge.hintKeys[Math.min(hintsUsed - 1, challenge.hintKeys.length - 1)]
    : null;
  const revealed = phase === 'reveal';

  return (
    <section className="sa-ml-seq__practice" data-ml-seq-practice data-ml-seq-practice-phase={phase}>
      <header className="sa-ml-seq__practicehead">
        <h3 className="sa-ml-seq__cardtitle">{t('tools.sequences.practice.heading')}</h3>
        <span className="sa-ml-seq__score" dir="ltr" data-ml-seq-practice-score>
          {`${practice.solved} / ${practice.seen}`}
        </span>
        <button
          type="button"
          className="sa-ml-seq__btn sa-ml-seq__btn--icon"
          onClick={onClose}
          aria-label={t('tools.sequences.practice.close')}
          title={t('tools.sequences.practice.close')}
          data-ml-seq-practice-close
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      <p className="sa-ml-seq__question" data-ml-seq-practice-question>
        {t(challenge.promptKey, challenge.promptParams)}
      </p>

      {/* La réponse. Un choix ou un nombre — un seul rendu pour les deux. */}
      {challenge.answerType === 'choice' ? (
        <div className="sa-ml-seq__choices" role="group" aria-label={t('tools.sequences.practice.yourPrediction')}>
          {challenge.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className={`sa-ml-seq__chip${answer === choice ? ' sa-ml-seq__chip--active' : ''}`}
              onClick={() => onAnswer(choice)}
              aria-pressed={answer === choice}
              data-ml-seq-practice-choice={choice}
            >
              {t(`tools.sequences.trend.${choice}`)}
            </button>
          ))}
        </div>
      ) : (
        <div className="sa-ml-seq__answerrow">
          <label className="sa-ml-seq__label-inline" htmlFor="sa-ml-seq-answer">
            {t('tools.sequences.practice.yourPrediction')}
          </label>
          <input
            id="sa-ml-seq-answer"
            className="sa-ml-seq__field sa-ml-seq__field--answer"
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={answer}
            placeholder={t('tools.sequences.practice.answerPlaceholder')}
            onChange={(event) => onAnswer(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }}
            data-ml-seq-practice-answer
          />
        </div>
      )}

      {/* Le verdict : trois formulations pour trois situations distinctes. */}
      {verdict && (
        <p
          className={`sa-ml-seq__verdict sa-ml-seq__verdict--${verdict.correct ? 'ok' : verdict.readable ? 'no' : 'unreadable'}`}
          role="status"
          data-ml-seq-practice-verdict={verdict.correct ? 'correct' : verdict.readable ? 'incorrect' : 'unreadable'}
        >
          {verdict.correct
            ? t('tools.sequences.practice.correct')
            : verdict.readable
              ? t('tools.sequences.practice.incorrect')
              : t('tools.sequences.practice.unreadable')}
        </p>
      )}

      {/* L'indice courant : un seul à la fois, du plus général au plus précis (§28). */}
      {hintKey && (
        <p className="sa-ml-seq__hintbox" data-ml-seq-practice-hint={hintsUsed}>
          <Lightbulb size={15} aria-hidden="true" />
          <span>{t(hintKey)}</span>
        </p>
      )}

      {/* La révélation : les VRAIS termes, et le terme attendu mis en avant (§29). */}
      {revealed && explanation && (
        <div className="sa-ml-seq__explain" data-ml-seq-practice-explain>
          <p className="sa-ml-seq__explaintext">{t(challenge.explainKey, challenge.explainParams)}</p>

          <ol className="sa-ml-seq__explainterms" dir="ltr">
            {explanation.terms.map((term) => {
              /**
               * Le terme mis en évidence.
               *
               * Une question à terme cible (« combien vaut u₅ ? ») met u₅ en
               * avant. Mais une question de COMPORTEMENT n'a pas de terme
               * cible : ce qu'elle veut montrer, c'est où la suite ARRIVE.
               * Sans ce second cas, la révélation d'une question sur le
               * comportement n'éclairait rien du tout — elle affichait huit
               * termes tous pareils, et c'est ce que la QA a vu.
               */
              const isTarget = Number.isFinite(challenge.targetIndex)
                ? term.n === challenge.targetIndex
                : term.n === explanation.terms[explanation.terms.length - 1].n;

              return (
                <li
                  key={term.n}
                  className={`sa-ml-seq__explainterm${isTarget ? ' sa-ml-seq__explainterm--target' : ''}${term.far ? ' sa-ml-seq__explainterm--far' : ''}`}
                  data-ml-seq-explain-term={term.n}
                >
                  <span className="sa-ml-seq__num">{`${termName(term.n)} = ${formatTerm(term.value)}`}</span>
                </li>
              );
            })}
          </ol>

          {explanation.truncated && (
            <p className="sa-ml-seq__note">{t('tools.sequences.practice.farTermNote')}</p>
          )}

          {/**
            * La réponse attendue, TOUJOURS nommée.
            *
            * Elle était écrite nue pour les questions numériques : sur une
            * question « quelle est la raison ? », la révélation finissait par
            * un « 2 » solitaire sous la liste des termes, que rien ne
            * rattachait à la question — la QA visuelle l'a vu. Le libellé
            * « الجواب : … » lève l'ambiguïté quelle que soit la famille.
            */}
          <p
            className="sa-ml-seq__explainanswer"
            data-ml-seq-practice-expected
          >
            <span>{t('tools.sequences.practice.answerLabel')}</span>
            <span dir="ltr" className="sa-ml-seq__num">
              {' '}
              {challenge.answerType === 'choice'
                ? t(`tools.sequences.trend.${challenge.expected}`)
                : formatTerm(challenge.expected)}
            </span>
          </p>
        </div>
      )}

      {/* Les actions. Aucune ne se désactive parce qu'une réponse était fausse.
          Seul « indice » s'épuise quand il n'y a plus d'indice à donner. */}
      <div className="sa-ml-seq__practiceactions">
        {!revealed && (
          <button
            type="button"
            className="sa-ml-seq__btn sa-ml-seq__btn--primary"
            onClick={onSubmit}
            data-ml-seq-practice-check
          >
            <Check size={16} aria-hidden="true" />
            <span>{t('tools.sequences.practice.check')}</span>
          </button>
        )}

        <button
          type="button"
          className="sa-ml-seq__btn"
          onClick={onHint}
          disabled={hintsUsed >= challenge.hintKeys.length}
          data-ml-seq-practice-hint-btn
        >
          <Lightbulb size={16} aria-hidden="true" />
          <span>{t('tools.sequences.practice.hint')}</span>
        </button>

        {!revealed && (
          <button
            type="button"
            className="sa-ml-seq__btn"
            onClick={onReveal}
            data-ml-seq-practice-reveal
          >
            <Eye size={16} aria-hidden="true" />
            <span>{t('tools.sequences.practice.reveal')}</span>
          </button>
        )}

        <button
          type="button"
          className="sa-ml-seq__btn"
          onClick={onNext}
          data-ml-seq-practice-next
        >
          <ChevronRight size={16} aria-hidden="true" />
          <span>{t('tools.sequences.practice.next')}</span>
        </button>
      </div>

      <p className="sa-ml-seq__note">{t('tools.sequences.practice.retryFreely')}</p>
    </section>
  );
}
