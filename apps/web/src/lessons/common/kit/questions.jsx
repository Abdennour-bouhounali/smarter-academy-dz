import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatFr, parseFr } from '@smarter-academy/core';
import { Feedback, ChoiceGrid, ValidateButton, NumberField, XPBurst } from '../components/LessonUI';
import { useKit } from './kitContext';
import MathLabel from '../components/MathLabel';
import { MoreToggle, useStudentFocus } from '../components/StudentFocus';
import { useSavedAnswer } from '../answers/useSavedAnswer';
import SavedAnswerChip from '../answers/SavedAnswerChip';

/**
 * Les réponses gardées pour l'élève (pilote 2026-11-07) : une question RETROUVE sa réponse quand l'élève revient — une seule
 * fois, à l'arrivée, sans son ni fête ; `onAnswered` est rappelé pour que l'étape reprenne où il en était. Inactif hors pilote.
 */
function useRestore(saved, apply) {
  const done = useRef(false);
  useEffect(() => {
    if (!saved || done.current) return;
    done.current = true;
    apply(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);
}

/**
 * Lesson kit — les trois formes de question formative.
 *
 * Politique commune (LESSON_INTEGRATION_GUIDE.md §6), appliquée par
 * construction — impossible à violer depuis un module appelant :
 *  - un tap/une validation = la réponse : révélation immédiate ;
 *  - `onAnswered(isCorrect)` est TOUJOURS appelé, jamais conditionné à la
 *    justesse — l'élève n'est jamais bloqué ;
 *  - en cas d'erreur : sa réponse, la bonne réponse, et le rappel de la
 *    règle (explain) sont affichés — pas de boucle « Réessayer » ;
 *  - son/série/burst branchés via useKit(), sans câblage par module.
 *
 * `requires` — le CONTRAT de dépendance de la question : les ids des
 * connaissances qu'elle suppose acquises. Sans effet à l'exécution ; il est lu
 * par scripts/audit-knowledge-dependencies.mjs, qui vérifie que chacune a bien
 * été établie AVANT elle (une <KnowledgeBrick> plus haut, ou le
 * `priorKnowledge` de la leçon). Voir docs/architecture/KNOWLEDGE_DEPENDENCY.md.
 */

/* ── QCM à un choix : le tap EST la réponse ───────────────────────── */
export function TapQuestion({
  prompt,          // ReactNode au-dessus de la grille (optionnel)
  above,           // ReactNode ou (revealed) => ReactNode — visuel (droite graduée, tableau…)
  options,
  correct,
  cols = 2,
  renderOption,    // (opt) => ReactNode — pour des cartes riches
  correctionLabel, // libellé de la bonne réponse si options[correct] n'est pas affichable tel quel
  explain,         // rappel de la règle, affiché juste ou faux
  explainWrong,    // remplace `explain` en cas d'erreur (optionnel)
  requires,        // string[] — connaissances supposées acquises (contrat d'audit, sans effet runtime)
  xp = 10,
  solved = false,  // revisite : grille figée, pas de re-réponse
  onAnswered,      // (isCorrect, index) => void — inconditionnel
}) {
  const { react } = useKit();
  const { t } = useTranslation('lesson');
  const [pick, setPick] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);
  const isCorrect = pick === correct;
  const focus = useStudentFocus();
  const memory = useSavedAnswer([prompt, options]);
  const [restoredAt, setRestoredAt] = useState(null);
  useRestore(memory.saved, (m) => {
    if (pick !== null || typeof m.v !== 'number' || m.v < 0 || m.v >= options.length) return;
    setPick(m.v); setRevealed(true); setRestoredAt(m.at); onAnswered?.(m.v === correct, m.v);
  });

  return (
    <div className="space-y-3">
      {prompt && <p className="text-sm font-semibold text-slate-700">{typeof prompt === 'string' ? <MathLabel>{prompt}</MathLabel> : prompt}</p>}
      {typeof above === 'function' ? above(revealed || solved) : above}
      <div className="relative">
        <ChoiceGrid
          options={options}
          selected={pick}
          onSelect={(i) => {
            setPick(i);
            setRevealed(true);
            setRestoredAt(null);
            memory.save(i);
            const ok = i === correct;
            const id = react(ok);
            if (ok) setBurst(id);
            onAnswered?.(ok, i);
          }}
          revealed={revealed || solved}
          correctIndex={correct}
          cols={cols}
          disabled={solved}
          renderOption={renderOption}
        />
        <XPBurst amount={xp} tick={burst} />
      </div>
      {restoredAt && <SavedAnswerChip at={restoredAt} />}
      {revealed && (
        <Feedback tone={isCorrect ? 'ok' : 'ko'}>
          {!isCorrect && (
            <>
              {t('question.correctAnswer')} <strong>{correctionLabel ?? options[correct]}</strong>. {' '}
            </>
          )}
          {/* Regard « focus » : une bonne réponse dit « ✓ صحيح » ; le pourquoi est à un geste. Une erreur garde sa correction ouverte. */}
          {!isCorrect && explainWrong ? explainWrong : (isCorrect && focus && explain ? <>{t('focus.correct')} <MoreToggle label={t('focus.why')}>{explain}</MoreToggle></> : explain)}
        </Feedback>
      )}
    </div>
  );
}

/* ── Vérification par lot à taille fixe : N lignes, une correction ── */
/**
 * Chaque ligne propose ses options ; la correction se révèle toute seule au
 * DERNIER choix posé (pas de bouton Vérifier). À la révélation, la bonne
 * option de CHAQUE ligne passe en vert — la correction se voit, elle ne se
 * déduit pas.
 */
export function BatchChoiceQuestion({
  intro,          // ReactNode au-dessus des lignes
  rows,           // [{ id, label, options: [ReactNode], correct, correction? }]
  feedback,       // ({ allRight, nCorrect, total }) => ReactNode — un seul bloc de feedback
  requires,       // string[] — connaissances supposées acquises (contrat d'audit, sans effet runtime)
  xp = 10,
  solved = false,
  onAnswered,     // (allRight) => void — inconditionnel
  rowCols = 1,    // 2 : les lignes sur deux colonnes (lecteur de mission, une longue liste tient dans l'écran — rollout 2026-11-09)
}) {
  const { react } = useKit();
  const [picks, setPicks] = useState({});
  const [checked, setChecked] = useState(false);
  const [burst, setBurst] = useState(0);
  const memory = useSavedAnswer([intro, rows.map((r) => [r.label, r.options])]);
  const [restoredAt, setRestoredAt] = useState(null);
  useRestore(memory.saved, (m) => {
    const v = m.v && typeof m.v === 'object' ? m.v : null;
    if (checked || !v || !rows.every((r) => typeof v[r.id] === 'number')) return;
    setPicks(v); setChecked(true); setRestoredAt(m.at); onAnswered?.(rows.every((r) => v[r.id] === r.correct));
  });

  const nCorrect = rows.filter((r) => picks[r.id] === r.correct).length;
  const allRight = nCorrect === rows.length;

  return (
    <div className="space-y-4">
      {intro}
      {restoredAt && <SavedAnswerChip at={restoredAt} />}
      {/* deux colonnes : UN écran dessiné pour tenir ensemble — la pagination du lecteur ne l'ouvre pas ligne par ligne (`data-paging-keep`) */}
      <div className={rowCols === 2 ? 'grid grid-cols-1 gap-3 lg:grid-cols-2' : 'space-y-3'} data-batch-cols={rowCols} data-paging-keep={rowCols === 2 ? '' : undefined}>
        {rows.map((r) => {
          const pick = picks[r.id];
          const rowRight = checked && pick === r.correct;
          const rowWrong = checked && pick !== undefined && pick !== r.correct;
          return (
            <div
              key={r.id}
              className={`rounded-2xl border-2 p-3.5 flex flex-wrap gap-3 flex-row items-center ${
                rowRight ? 'border-emerald-300 bg-emerald-50/50' : rowWrong ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-white'
              }`}
            >
              {/* L'étiquette garde 14rem au moins mais GRANDIT avec son contenu (jusqu'à 55 % de la ligne) : à largeur fixe,
                  trois formules « EF² = 20 ، FG² = 20 ، EG² = 40 » se cassaient après « = » et débordaient sur les choix
                  (vu par le propriétaire, unité 12, 2026-10-04). Une formule ne se coupe jamais à l'intérieur. */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-[14rem] max-w-[55%] shrink-0 text-sm font-semibold text-slate-700 [&_.katex]:whitespace-nowrap">
                {typeof r.label === 'string' ? <MathLabel>{r.label}</MathLabel> : r.label}
              </div>
              <div className="flex min-w-0 flex-1 gap-1.5 flex-wrap" role="group">
                {r.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    disabled={solved || checked}
                    onClick={() => {
                      if (solved || checked) return;
                      const next = { ...picks, [r.id]: oi };
                      setPicks(next);
                      // Dernier choix posé → correction immédiate, sans bouton.
                      if (rows.every((row) => next[row.id] !== undefined)) {
                        setChecked(true);
                        memory.save(next);
                        const allR = rows.every((row) => next[row.id] === row.correct);
                        const id = react(allR);
                        if (allR) setBurst(id);
                        onAnswered?.(allR);
                      }
                    }}
                    aria-pressed={pick === oi}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg border-2 font-mono text-xs font-bold min-h-[40px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      checked
                        ? oi === r.correct
                          ? 'bg-emerald-600 border-emerald-700 text-white'
                          : pick === oi
                          ? 'bg-rose-600 border-rose-700 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                        : pick === oi
                        ? 'bg-blue-600 border-blue-700 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                    }`}
                  >
                    {typeof opt === 'string' ? <MathLabel>{opt}</MathLabel> : opt}
                  </button>
                ))}
              </div>
              {rowWrong && r.correction && (
                // sa PROPRE ligne sous la rangée (la rangée passe à la ligne) : dans la même ligne, la correction écrasait les choix
                // en colonne et se superposait à eux (propriétaire, 2026-11-07)
                <span className="basis-full text-sm font-mono text-rose-600">{r.correction}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="relative">
        <XPBurst amount={xp} tick={burst} />
      </div>
      {/* `checked` = réponse posée dans cette session (picks réels) ; sinon
          c'est une revisite d'un module déjà complété (picks vides) → on
          affiche le feedback « tout juste ». Ne pas tester `solved` en
          premier : onAnswered étant inconditionnel, il devient vrai dès la
          révélation et masquerait le retour d'erreur. */}
      {(checked || solved) && feedback && (
        <div>{feedback({ allRight: checked ? allRight : true, nCorrect, total: rows.length })}</div>
      )}
    </div>
  );
}

/* ── Saisie numérique : un bouton OK + Entrée, jamais bloquante ──── */
export function NumericQuestion({
  prompt,          // ReactNode
  above,           // ReactNode ou (revealed) => ReactNode
  prefix, suffix,  // ex. prefix="Nombre de milliers :" suffix="cL"
  expected,        // number, ou (n) => boolean
  parse = parseFr,
  display,         // affichage de la bonne réponse (déf. formatFr(expected))
  explain,         // rappel de règle, juste ou faux
  explainFor,      // (n) => ReactNode — feedback ciblé selon l'erreur (pièges)
  requires,        // string[] — connaissances supposées acquises (contrat d'audit, sans effet runtime)
  width = 'w-32',
  size = 'sm',
  solved = false,
  onAnswered,      // (isCorrect, n) => void — inconditionnel
}) {
  const { react } = useKit();
  const { t } = useTranslation('lesson');
  const [val, setVal] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const memory = useSavedAnswer([prompt, prefix, suffix, typeof expected === 'number' ? expected : 'fn']);
  const [restoredAt, setRestoredAt] = useState(null);
  useRestore(memory.saved, (m) => {
    if (revealed || typeof m.v !== 'string' || m.v === '') return;
    const n = parse(m.v);
    const ok = typeof expected === 'function' ? expected(n) : n === expected;
    setVal(m.v); setWasCorrect(ok); setRevealed(true); setRestoredAt(m.at); onAnswered?.(ok, n);
  });

  const correctDisplay = display ?? (typeof expected === 'number' ? formatFr(expected) : null);

  const check = () => {
    if (val === '') return;
    const n = parse(val);
    const ok = typeof expected === 'function' ? expected(n) : n === expected;
    react(ok);
    setWasCorrect(ok);
    setRevealed(true);
    memory.save(val);
    onAnswered?.(ok, n);
  };

  const done = revealed || solved;

  return (
    <div className="space-y-3">
      {prompt && <p className="text-sm font-semibold text-slate-700">{typeof prompt === 'string' ? <MathLabel>{prompt}</MathLabel> : prompt}</p>}
      {typeof above === 'function' ? above(done) : above}
      {restoredAt && <SavedAnswerChip at={restoredAt} />}
      {!done ? (
        <div className="flex items-center gap-2 flex-wrap">
          {prefix && <span className="text-sm font-mono text-slate-600">{prefix}</span>}
          <NumberField
            value={val}
            onChange={setVal}
            onEnter={check}
            ariaLabel={typeof prompt === 'string' ? prompt : t('question.answer')}
            width={width}
            size={size}
          />
          {suffix && <span className="font-mono text-sm text-slate-500">{suffix}</span>}
          <ValidateButton onClick={check} disabled={!val}>
            {t('question.ok')}
          </ValidateButton>
        </div>
      ) : (
        <Feedback tone={revealed && !wasCorrect ? 'ko' : 'ok'}>
          {revealed && !wasCorrect && (
            <>
              {t('question.yourAnswer')} <strong className="font-mono">{val || '—'}</strong>. {t('question.correctAnswer')}{' '}
            </>
          )}
          <strong className="font-mono">{correctDisplay}</strong>
          {' — '}
          {revealed && !wasCorrect && explainFor ? explainFor(parse(val)) : explain}
        </Feedback>
      )}
    </div>
  );
}
