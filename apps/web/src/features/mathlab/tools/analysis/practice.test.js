import { describe, it, expect } from 'vitest';
import { generateChallenge, checkAnswer, parseStudentNumber, CHALLENGE_KINDS, EXPERIMENTS, PREDICTIONS } from './practice.js';
import { compileSource } from '../functionGrapher/expressionEvaluator.js';

describe('la saisie d’une réponse', () => {
  /**
   * Depuis que le champ est un champ MATHÉMATIQUE, la réponse arrive en
   * LaTeX : un élève qui tape ½ au clavier virtuel envoie `\\frac{1}{2}`.
   * Ne pas le lire aurait transformé une bonne réponse en « non compris ».
   */
  it.each([
    ['2,5', 2.5],
    ['2.5', 2.5],
    ['-3', -3],
    ['−3', -3],              // le vrai signe moins, U+2212
    ['1/2', 0.5],
    [' 7 ', 7],
    ['\\frac{1}{2}', 0.5],
    ['\\frac{7}{2}', 3.5],
    ['\\frac{-3}{4}', -0.75],
    ['-\\frac{1}{2}', -0.5],
    ['\\sqrt{4}', 2],
    ['\\pi', Math.PI],
    ['0', 0],
  ])('lit « %s »', (input, expected) => {
    expect(parseStudentNumber(input)).toBeCloseTo(expected, 9);
  });

  /** Une réponse doit être un NOMBRE : « 2x » n'en est pas une. */
  it.each([[''], ['abc'], ['x'], ['2x'], ['\\frac{1}{0}'], ['???'], [null], [undefined]])(
    'refuse « %s » sans jamais rendre NaN', (input) => {
      expect(parseStudentNumber(input)).toBeNull();
    },
  );
});

describe('les défis', () => {
  it('engendrent une famille connue, analysable et cohérente', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const challenge = generateChallenge(seed * 13);
      expect(CHALLENGE_KINDS).toContain(challenge.kind);
      expect(compileSource(challenge.source).ok, challenge.source).toBe(true);
      // Un énoncé ne montre jamais « x^2-4x+0 » : un terme nul ne s'écrit pas.
      expect(challenge.source, challenge.source).not.toMatch(/[+-]0$|\+-|--/);
      // Le défi se valide lui-même : sa réponse attendue est correcte.
      expect(checkAnswer(challenge, challenge.expected).correct, `${challenge.kind} ${challenge.source}`).toBe(true);
    }
  });

  /** §37 : au niveau « programme », on ne pose que ce qui relève de 4AM. */
  it('ne pose au niveau programme que le taux d’accroissement', () => {
    for (let seed = 1; seed <= 60; seed += 1) {
      const challenge = generateChallenge(seed * 13, { level: 'programme' });
      expect(challenge.kind).toBe('averageRate');
      // Et sa réponse est vérifiable indépendamment.
      const fn = compileSource(challenge.source).fn;
      const { a, b } = challenge.promptParams;
      expect(challenge.expected).toBeCloseTo((fn(b) - fn(a)) / (b - a), 9);
    }
  });

  it('porte trois indices gradués et une explication, jamais la réponse', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const challenge = generateChallenge(seed * 7);
      expect(challenge.hintKeys.length).toBe(3);
      expect(challenge.explainKey).toBeTruthy();
      for (const key of challenge.hintKeys) expect(typeof key).toBe('string');
    }
  });

  /** §30 : « adjust n until close enough » — tout n assez grand est juste. */
  it('accepte TOUT n suffisant pour le défi de Riemann', () => {
    const challenge = generateChallenge(5, { kinds: ['riemannClose'] });
    expect(checkAnswer(challenge, challenge.expected).correct).toBe(true);
    expect(checkAnswer(challenge, challenge.expected + 50).correct).toBe(true);
    expect(checkAnswer(challenge, 1).correct).toBe(false);
  });

  /** §43 : un verdict, jamais un verrou — rien dans le résultat ne bloque. */
  it('ne rend jamais d’état bloquant', () => {
    const challenge = generateChallenge(11);
    const wrong = checkAnswer(challenge, 999999);
    expect(wrong.correct).toBe(false);
    expect(Object.keys(wrong).sort()).toEqual(['correct', 'parsed']);
    expect(checkAnswer(challenge, '')).toMatchObject({ reason: 'empty' });
    expect(checkAnswer(challenge, 'abc')).toMatchObject({ reason: 'unparsed' });
  });
});

describe('les expériences et les prédictions', () => {
  it('nomment un laboratoire réel et une fonction analysable', () => {
    const labs = ['secant', 'tangent', 'derivative', 'limit', 'integral', 'study', 'transform'];
    for (const experiment of EXPERIMENTS) {
      expect(labs).toContain(experiment.lab);
      expect(compileSource(experiment.source, { variables: ['x', 'a', 'b', 'c'] }).ok, experiment.source).toBe(true);
      expect(experiment.questionKey).toBeTruthy();
      expect(experiment.observationKey).toBeTruthy();
    }
    for (const prediction of PREDICTIONS) {
      expect(labs).toContain(prediction.lab);
      expect(prediction.choices).toContain(prediction.expected);
    }
  });
});
