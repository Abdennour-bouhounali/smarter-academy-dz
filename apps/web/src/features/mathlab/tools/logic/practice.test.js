/**
 * L'entraînement (§37-39), éprouvé sur beaucoup de graines.
 *
 * L'épreuve qui compte le plus : la réponse ATTENDUE est TOUJOURS acceptée.
 * Un instrument qui refuse la bonne réponse enseigne une fausseté que
 * l'élève n'a aucun moyen de contester.
 */

import { describe, it, expect } from 'vitest';
import {
  CHALLENGE_KINDS, DIFFICULTY_KINDS, generateChallenge, checkAnswer,
  parseNumericAnswer, inDomain, revealTarget, kindsForLevel, verdictOfSearch,
} from './practice.js';
import { COUNTEREXAMPLE_CHALLENGES, FALLACIES, PROOFS, QUANTIFIER_STATEMENTS, findPreset, sampleOf } from './presets.js';
import { anyValidOrder } from './proofMath.js';
import { evaluate } from './logicMath.js';

const SEEDS = Array.from({ length: 400 }, (_, i) => i + 1);

describe('generateChallenge — toujours bien formé', () => {
  it('rend un défi complet pour 400 graines', () => {
    for (const seed of SEEDS) {
      const challenge = generateChallenge(seed);
      expect(CHALLENGE_KINDS).toContain(challenge.kind);
      expect(typeof challenge.promptKey).toBe('string');
      expect(Array.isArray(challenge.hintKeys)).toBe(true);
      expect(challenge.hintKeys.length).toBeGreaterThanOrEqual(2);
      expect(typeof challenge.explainKey).toBe('string');
    }
  });

  it('couvre toutes les familles', () => {
    const seen = new Set(SEEDS.map((seed) => generateChallenge(seed).kind));
    for (const kind of CHALLENGE_KINDS) expect(seen).toContain(kind);
  });

  it('est reproductible : même graine, même défi', () => {
    expect(generateChallenge(42)).toEqual(generateChallenge(42));
  });

  it('respecte la restriction de familles', () => {
    for (const seed of SEEDS.slice(0, 50)) {
      expect(generateChallenge(seed, ['counterexample']).kind).toBe('counterexample');
    }
  });

  it('§38 — les quatre niveaux ne tirent que des familles réelles', () => {
    for (const level of [1, 2, 3, 4]) {
      expect(kindsForLevel(level).every((kind) => CHALLENGE_KINDS.includes(kind))).toBe(true);
    }
    expect(kindsForLevel(99)).toEqual(CHALLENGE_KINDS);
  });

  it('un niveau bas ne pose pas de preuve à ordonner', () => {
    expect(DIFFICULTY_KINDS[1]).not.toContain('orderProof');
    expect(DIFFICULTY_KINDS[4]).toContain('orderProof');
  });

  it('les choix d’une question à choix ne sont jamais vides', () => {
    for (const seed of SEEDS) {
      const challenge = generateChallenge(seed);
      if (challenge.answerType !== 'choice') continue;
      expect(Array.isArray(challenge.choices)).toBe(true);
      expect(challenge.choices.length).toBeGreaterThanOrEqual(2);
      expect(challenge.choices).toContain(challenge.expected);
    }
  });
});

describe('checkAnswer — la bonne réponse est TOUJOURS acceptée', () => {
  it('pour les questions à choix et numériques, sur 400 graines', () => {
    for (const seed of SEEDS) {
      const challenge = generateChallenge(seed);
      if (challenge.answerType === 'order' || challenge.answerType === 'fallacy') continue;
      const answer = challenge.answerType === 'number' ? String(challenge.expected) : challenge.expected;
      expect(checkAnswer(challenge, answer), `${challenge.kind} @ ${seed}`).toMatchObject({ correct: true, readable: true });
    }
  });

  it('pour une preuve à ordonner : un ordre valide passe, l’inverse non', () => {
    for (const seed of SEEDS.slice(0, 40)) {
      const challenge = generateChallenge(seed, ['orderProof']);
      const proof = findPreset(PROOFS, challenge.proofId);
      const order = anyValidOrder(proof);
      expect(checkAnswer(challenge, order).correct).toBe(true);
      expect(checkAnswer(challenge, [...order].reverse()).correct).toBe(false);
    }
  });

  it('pour un sophisme : nommer ET réfuter', () => {
    const challenge = generateChallenge(1, ['fallacy']);
    const preset = findPreset(FALLACIES, challenge.fallacyId);
    expect(checkAnswer(challenge, { kind: preset.kind, value: String(preset.counterexample) }).correct).toBe(true);
    // Nommer juste sans réfuter ne suffit pas : c'est réciter (§33).
    const notRefuting = sampleOf(preset.domain).find((v) => !preset.refutes(v));
    expect(checkAnswer(challenge, { kind: preset.kind, value: String(notRefuting) }).correct).toBe(false);
    // Réfuter sans nommer ne suffit pas non plus.
    const otherKind = challenge.choices.find((k) => k !== preset.kind);
    expect(checkAnswer(challenge, { kind: otherKind, value: String(preset.counterexample) }).correct).toBe(false);
  });

  it('§10 — TOUT contre-exemple valide est accepté, pas seulement celui attendu', () => {
    const challenge = generateChallenge(1, ['counterexample']);
    const preset = findPreset(COUNTEREXAMPLE_CHALLENGES, challenge.challengeId);
    const allValid = sampleOf(preset.domain).filter((v) => evaluate(preset.predicate, v) === false);
    expect(allValid.length).toBeGreaterThan(0);
    for (const value of allValid) {
      expect(checkAnswer(challenge, String(value)).correct, `${value} réfute pourtant`).toBe(true);
    }
  });

  it('une valeur hors domaine n’est pas un contre-exemple', () => {
    const challenge = generateChallenge(1, ['counterexample']);
    expect(checkAnswer(challenge, '99999').correct).toBe(false);
  });

  it('§39 — une saisie illisible n’est PAS une réponse fausse', () => {
    const challenge = generateChallenge(1, ['counterexample']);
    expect(checkAnswer(challenge, 'peut-être')).toEqual({ correct: false, readable: false });
    expect(checkAnswer(challenge, '')).toEqual({ correct: false, readable: false });
  });

  it('ne lève jamais, quelle que soit l’entrée', () => {
    const challenge = generateChallenge(1);
    for (const answer of [undefined, null, {}, [], 0, NaN, { kind: 1 }]) {
      expect(() => checkAnswer(challenge, answer)).not.toThrow();
    }
    expect(() => checkAnswer(null, 'x')).not.toThrow();
    expect(() => checkAnswer(undefined, undefined)).not.toThrow();
  });
});

describe('parseNumericAnswer — accepter large, car la question porte sur la logique', () => {
  it('lit les entiers, les décimaux à virgule, les fractions et le vrai signe moins', () => {
    expect(parseNumericAnswer('4')).toBe(4);
    expect(parseNumericAnswer('-3')).toBe(-3);
    expect(parseNumericAnswer('−3')).toBe(-3);
    expect(parseNumericAnswer('2,5')).toBeCloseTo(2.5);
    expect(parseNumericAnswer('1/2')).toBeCloseTo(0.5);
    expect(parseNumericAnswer(' 7 ')).toBe(7);
    expect(parseNumericAnswer(6)).toBe(6);
  });

  it('lit les chiffres arabes-indiens', () => {
    expect(parseNumericAnswer('٤')).toBe(4);
    expect(parseNumericAnswer('٢٠')).toBe(20);
  });

  it('rend NaN sur une saisie illisible, sans lever', () => {
    for (const bad of ['abc', '', '  ', '1/0', null, undefined, {}]) {
      expect(Number.isNaN(parseNumericAnswer(bad))).toBe(true);
    }
  });
});

describe('inDomain', () => {
  it('refuse un décimal dans un domaine entier', () => {
    expect(inDomain(2.5, { min: 0, max: 10, integer: true })).toBe(false);
    expect(inDomain(2, { min: 0, max: 10, integer: true })).toBe(true);
  });

  it('refuse hors bornes', () => {
    expect(inDomain(11, { min: 0, max: 10, integer: true })).toBe(false);
  });
});

describe('§37 — la révélation sait quoi MONTRER', () => {
  it('chaque défi désigne une aire du laboratoire et un préréglage', () => {
    for (const seed of SEEDS.slice(0, 120)) {
      const target = revealTarget(generateChallenge(seed));
      expect(target).not.toBeNull();
      expect(typeof target.area).toBe('string');
      expect(target.id).toBeTruthy();
    }
  });

  it('rend null sans défi, plutôt que de lever', () => {
    expect(revealTarget(null)).toBeNull();
  });
});

describe('verdictOfSearch — le laboratoire ne se ment pas à lui-même (§22)', () => {
  it('« pas de contre-exemple trouvé » n’est pas « prouvé »', () => {
    const preset = findPreset(QUANTIFIER_STATEMENTS, 'squareNonNegative');
    const verdict = verdictOfSearch('forall', preset.predicate, preset.domain);
    expect(verdict.status).toBe('notFound');
  });

  it('un contre-exemple réfute pour de bon', () => {
    const preset = findPreset(QUANTIFIER_STATEMENTS, 'naturalPositive');
    const verdict = verdictOfSearch('forall', preset.predicate, preset.domain);
    expect(verdict.status).toBe('disproved');
    expect(verdict.value).toBe(0);
  });

  it('un témoin prouve un ∃', () => {
    const preset = findPreset(QUANTIFIER_STATEMENTS, 'existsSquareFour');
    expect(verdictOfSearch('exists', preset.predicate, preset.domain).status).toBe('proved');
  });
});
