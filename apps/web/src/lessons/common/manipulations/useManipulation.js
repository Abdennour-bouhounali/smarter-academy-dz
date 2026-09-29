import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStepSequence } from './useStepSequence';
import { resolveManipulationLevels } from './levels';
import { useWorkspaceLevel } from './workspaceContext';

/**
 * L'état d'une manipulation, UNE SEULE FOIS pour tous les types.
 *
 * Ce que le hook porte (et que chaque type n'a donc pas à réinventer) :
 *
 *   numbers / setNumbers   les nombres courants ; en changer remet tout à zéro
 *   steps                  la séquence d'étapes canonique (useStepSequence)
 *   phase                  où l'élève en est dans le flux pédagogique :
 *                          'act' (il manipule) → 'discover' (la relation est
 *                          apparue, il la formule) → 'formal' (la règle est lue)
 *   mode                   'student' | 'class' (voir ManipulationTeacherMode)
 *   hints                  indices PROGRESSIFS : `hintLevel` monte d'un cran à
 *                          chaque demande, jamais au-delà du dernier ; aucun
 *                          indice ne contient la réponse (règle §19)
 *   level                  'beginner' | 'advanced' — les DEUX niveaux, rien
 *                          d'autre (levels.js). Dans un workspace, c'est le
 *                          niveau du panneau et `levels` vaut null (le
 *                          workspace porte le seul sélecteur) ; seule, la
 *                          manipulation reçoit la paire { beginner, advanced }
 *                          dont l'un est TOUJOURS les nombres de la leçon
 *   isAuthoredLevel        l'élève est sur les nombres écrits par la leçon
 *   report(fn, …args)      appelle un rappel de la leçon (onVerdict,
 *                          onFinished) SEULEMENT sur le niveau de la leçon :
 *                          réussir l'autre niveau ne coche pas l'étape qui
 *                          parle des nombres de la leçon
 *   freeLab                « مختبر حر » : nombres choisis dans les contraintes
 *   answerHidden           mode classe : la conclusion est masquée pour que la
 *                          classe la formule (« إخفاء النتيجة »)
 *   showExplanation        le panneau « الشرح », à la demande, jamais d'office
 *   playing                mode classe : rejouer les étapes une à une (§20)
 *
 * Le hook ne connaît AUCUNE mathématique : `stepCount` est calculé par le type
 * à partir de `numbers`, et le geste canonique de « الخطوة التالية » (mode
 * classe) est fourni par le type via `autoStep` (voir ManipulationShell).
 */
export function useManipulation({
  type,
  stepCount = 0,
  initialNumbers,
  initialMode = 'student',
  hintCount = 3,
  answerHiddenByDefault = false,
  initialLevel,
}) {
  const workspaceLevel = useWorkspaceLevel();
  // Figé au montage : la paire décrit les nombres ÉCRITS par la leçon ; un
  // changement de nombres (free lab, mode classe) ne la réécrit pas.
  const [setup] = useState(() => (workspaceLevel
    ? { initial: workspaceLevel, levels: null }
    : resolveManipulationLevels(type, initialNumbers, initialLevel) ?? { initial: initialLevel ?? 'beginner', levels: null }));
  const [numbers, setNumbersState] = useState(initialNumbers);
  const [mode, setMode] = useState(initialMode);
  const [phase, setPhase] = useState('act');
  const [hintLevel, setHintLevel] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerHidden, setAnswerHidden] = useState(answerHiddenByDefault);
  const [level, setLevelState] = useState(setup.initial);
  const [freeLab, setFreeLab] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Un compteur qui change à chaque « إعادة » : les types s'en servent comme
  // clé pour remettre leur état local à zéro (positions, sélections…).
  const [epoch, setEpoch] = useState(0);
  const playTimer = useRef(null);

  const steps = useStepSequence(stepCount);
  const levels = setup.levels;
  const authoredLevel = setup.initial;

  const stopPlaying = useCallback(() => {
    if (playTimer.current) { clearInterval(playTimer.current); playTimer.current = null; }
    setPlaying(false);
  }, []);

  // Le rejeu du mode classe ne survit pas au démontage (changement de page
  // pendant « شغّل ») : sans cela l'intervalle continuait d'appeler un
  // `autoStep` sur un composant démonté.
  useEffect(() => () => {
    if (playTimer.current) { clearInterval(playTimer.current); playTimer.current = null; }
  }, []);

  const reset = useCallback(() => {
    stopPlaying();
    steps.reset();
    setPhase('act');
    setHintLevel(0);
    setShowExplanation(false);
    setAnswerHidden(answerHiddenByDefault);
    setEpoch((e) => e + 1);
  }, [steps, answerHiddenByDefault, stopPlaying]);

  const setNumbers = useCallback((n) => {
    setNumbersState(n);
    reset();
  }, [reset]);

  const setLevel = useCallback((id) => {
    const preset = levels?.[id];
    if (!preset) return;
    setLevelState(id);
    setFreeLab(false);
    setNumbers(preset.numbers);
  }, [levels, setNumbers]);

  const isAuthoredLevel = level === authoredLevel;
  const report = useCallback((fn, ...args) => {
    if (isAuthoredLevel) fn?.(...args);
  }, [isAuthoredLevel]);

  const requestHint = useCallback(() => setHintLevel((h) => Math.min(h + 1, hintCount)), [hintCount]);

  /** Le type appelle `discover()` quand la relation est VISIBLE, `formalize()` quand la règle est lue. */
  const discover = useCallback(() => setPhase((p) => (p === 'act' ? 'discover' : p)), []);
  const formalize = useCallback(() => setPhase('formal'), []);

  /** Mode classe : rejouer — `autoStep` est le geste canonique du type. */
  const play = useCallback((autoStep, intervalMs = 1400) => {
    stopPlaying();
    setPlaying(true);
    playTimer.current = setInterval(() => {
      const advanced = autoStep?.();
      if (!advanced) stopPlaying();
    }, intervalMs);
  }, [stopPlaying]);

  return useMemo(() => ({
    type, numbers, setNumbers, epoch,
    steps, revealed: steps.index, total: steps.total, next: steps.next, prev: steps.prev, isFinished: steps.isDone,
    reset,
    phase, discover, formalize, isDiscovered: phase !== 'act', isFormal: phase === 'formal',
    mode, setMode, isClass: mode === 'class',
    hintLevel, hintCount, requestHint, hintsExhausted: hintLevel >= hintCount,
    showExplanation, toggleExplanation: () => setShowExplanation((s) => !s),
    answerHidden, toggleAnswer: () => setAnswerHidden((s) => !s),
    levels, level, setLevel, levelPreset: levels?.[level] ?? null, isAuthoredLevel, report, inWorkspace: workspaceLevel != null,
    freeLab, setFreeLab,
    playing, play, stopPlaying,
  }), [type, numbers, setNumbers, epoch, steps, reset, phase, discover, formalize, mode, hintLevel, hintCount, requestHint, showExplanation, answerHidden, levels, level, setLevel, isAuthoredLevel, report, workspaceLevel, freeLab, playing, play, stopPlaying]);
}

/**
 * Trois propositions PLAUSIBLES pour une étape : la bonne et deux confusions
 * réelles de la méthode — jamais des nombres au hasard, qui feraient deviner
 * par élimination. Dédupliquées, positives, mélangées de façon déterministe
 * (l'ordre dépend des valeurs : deux élèves voient le même écran, un test aussi).
 */
export function plausibleChoices(correct, distractors, count = 3) {
  const out = [correct];
  for (const d of distractors) {
    if (out.length >= count) break;
    if (Number.isInteger(d) && d >= 0 && !out.includes(d)) out.push(d);
  }
  let k = 1;
  while (out.length < count) {
    const cand = correct + k;
    if (!out.includes(cand)) out.push(cand);
    k += 1;
  }
  const shift = out.reduce((s, v) => s + v, 0) % out.length;
  return [...out.slice(shift), ...out.slice(0, shift)];
}
