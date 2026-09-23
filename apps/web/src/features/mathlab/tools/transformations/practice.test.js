/**
 * Les tests de l'ENTRAÎNEMENT, des PUZZLES et des MOTIFS.
 *
 * Le générateur reçoit son `random` : chaque question est donc reproductible,
 * et on peut affirmer des choses sur MILLE questions plutôt que sur une.
 */

import { describe, it, expect } from 'vitest';
import * as M from './transformMath.js';
import {
  CHALLENGE_KINDS, generateChallenge, applySteps, checkAnswer,
  PUZZLES, getPuzzle, puzzleTarget, isPuzzleSolved,
  EXPERIMENTS, getExperiment, PRESETS, patternCopies, MAX_PATTERN_COPIES,
} from './practice.js';
import { matrixFor } from './transformModel.js';
import { normalizeScene } from './transformState.js';

const at = (x, y) => ({ x, y });

/** Un générateur déterministe : les tests ne dépendent pas de la chance. */
function seeded(seed = 1) {
  let state = seed;

  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;

    return state / 2147483648;
  };
}

describe('generateChallenge — prédire (§38, §39, §40)', () => {
  it('produit une question complète, quel que soit le tirage', () => {
    const random = seeded(7);
    for (let i = 0; i < 300; i += 1) {
      const challenge = generateChallenge(random);
      expect(CHALLENGE_KINDS).toContain(challenge.kind);
      expect(M.isPoint(challenge.point)).toBe(true);
      expect(M.isPoint(challenge.answer)).toBe(true);
      expect(challenge.steps.length).toBeGreaterThan(0);
    }
  });

  it('la réponse est bien l’image du point par les pas — toujours', () => {
    const random = seeded(11);
    for (let i = 0; i < 300; i += 1) {
      const challenge = generateChallenge(random);
      expect(M.samePoint(challenge.answer, applySteps(challenge.point, challenge.steps))).toBe(true);
    }
  });

  it('une question « à plusieurs pas » en a bien plusieurs (§40)', () => {
    const challenge = generateChallenge(seeded(3), { kind: 'multiStep' });
    expect(challenge.kind).toBe('multiStep');
    expect(challenge.steps).toHaveLength(2);
  });

  it('une question à choix propose QUATRE positions distinctes, dont la bonne (§39)', () => {
    const random = seeded(5);
    for (let i = 0; i < 200; i += 1) {
      const challenge = generateChallenge(random, { kind: 'choosePosition' });
      expect(challenge.choices).toHaveLength(4);
      // La bonne réponse y est.
      expect(challenge.choices.some((choice) => M.samePoint(choice, challenge.answer))).toBe(true);
      // Et une seule fois : sinon deux cases seraient justes.
      expect(challenge.choices.filter((choice) => M.samePoint(choice, challenge.answer))).toHaveLength(1);
      // Toutes distinctes.
      for (let a = 0; a < 4; a += 1) {
        for (let b = a + 1; b < 4; b += 1) {
          expect(M.samePoint(challenge.choices[a], challenge.choices[b])).toBe(false);
        }
      }
    }
  });

  it('les coordonnées proposées restent des ENTIERS lisibles', () => {
    const random = seeded(13);
    for (let i = 0; i < 200; i += 1) {
      const challenge = generateChallenge(random, { kind: 'choosePosition' });
      for (const choice of challenge.choices) {
        expect(Number.isFinite(choice.x)).toBe(true);
        expect(Number.isFinite(choice.y)).toBe(true);
      }
    }
  });

  it('les pas générés décrivent tous une VRAIE transformation', () => {
    const random = seeded(17);
    for (let i = 0; i < 300; i += 1) {
      for (const step of generateChallenge(random).steps) {
        expect(matrixFor(step, [])).not.toBeNull();
      }
    }
  });

  it('les pas générés survivent à la relecture du document', () => {
    const random = seeded(19);
    for (let i = 0; i < 100; i += 1) {
      const { steps } = generateChallenge(random);
      expect(normalizeScene({ figures: [], steps }).steps).toHaveLength(steps.length);
    }
  });
});

describe('checkAnswer — juger sans jamais bloquer', () => {
  const challenge = { answer: at(3, -2) };

  it('accepte la bonne réponse', () => {
    expect(checkAnswer(challenge, at(3, -2)).correct).toBe(true);
  });

  it('tolère l’imprécision d’un CLIC sur le plan', () => {
    expect(checkAnswer(challenge, at(3.01, -1.98)).correct).toBe(true);
  });

  it('refuse une vraie erreur', () => {
    expect(checkAnswer(challenge, at(3, 2)).correct).toBe(false);
    expect(checkAnswer(challenge, at(-3, -2)).correct).toBe(false);
  });

  it('rend TOUJOURS la réponse attendue, même quand c’est faux — on ne bloque pas', () => {
    const verdict = checkAnswer(challenge, at(0, 0));
    expect(verdict.correct).toBe(false);
    expect(verdict.expected).toEqual(at(3, -2));
  });

  it('une réponse absente ou cassée est fausse, pas une exception', () => {
    expect(checkAnswer(challenge, null).correct).toBe(false);
    expect(checkAnswer(challenge, { x: Number.NaN, y: 0 }).correct).toBe(false);
    expect(checkAnswer(null, at(1, 1)).correct).toBe(false);
  });
});

describe('les puzzles (§42)', () => {
  it('chaque puzzle est résolu par SA solution', () => {
    for (const puzzle of PUZZLES) {
      const solved = puzzle.solution.reduce((vertices, step) => {
        const matrix = matrixFor(step, puzzle.figure);

        return vertices.map((vertex) => M.cleanPoint(M.applyMatrix(matrix, vertex)));
      }, puzzle.figure);
      expect(isPuzzleSolved(puzzle, solved)).toBe(true);
    }
  });

  it('aucun puzzle n’est résolu AVANT d’avoir été joué', () => {
    for (const puzzle of PUZZLES) {
      expect(isPuzzleSolved(puzzle, puzzle.figure)).toBe(false);
    }
  });

  it('la solution n’est pas UNIQUE — une autre route est acceptée (§42)', () => {
    const puzzle = getPuzzle('slide');
    // La même image, obtenue par deux انسحاب successifs au lieu d'un.
    const twoHops = [
      { kind: 'translation', enabled: true, vx: 4, vy: -1 },
      { kind: 'translation', enabled: true, vx: 3, vy: -1 },
    ].reduce((vertices, step) => vertices.map((v) => M.cleanPoint(M.applyMatrix(matrixFor(step, vertices), v))), puzzle.figure);
    expect(isPuzzleSolved(puzzle, twoHops)).toBe(true);
  });

  it('une figure RENVERSÉE mais superposée compte comme résolue', () => {
    const puzzle = getPuzzle('mirror');
    expect(isPuzzleSolved(puzzle, [...puzzleTarget(puzzle)].reverse())).toBe(true);
  });

  it('presque résolu n’est pas résolu', () => {
    const puzzle = getPuzzle('quarter');
    const nearly = puzzleTarget(puzzle).map((v) => at(v.x + 0.5, v.y));
    expect(isPuzzleSolved(puzzle, nearly)).toBe(false);
  });

  it('tolère le flottant d’une rotation, pas un écart visible', () => {
    const puzzle = getPuzzle('quarter');
    const jittered = puzzleTarget(puzzle).map((v) => at(v.x + 1e-9, v.y - 1e-9));
    expect(isPuzzleSolved(puzzle, jittered)).toBe(true);
  });

  it('les identifiants sont uniques et retrouvables', () => {
    const ids = PUZZLES.map((puzzle) => puzzle.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getPuzzle(id)).not.toBeNull();
    expect(getPuzzle('inconnu')).toBeNull();
  });

  it('un puzzle absent n’est jamais « résolu »', () => {
    expect(isPuzzleSolved(null, [at(0, 0)])).toBe(false);
  });
});

describe('les expériences guidées (§41)', () => {
  it('chaque expérience pose une scène VALIDE', () => {
    for (const experiment of EXPERIMENTS) {
      expect(experiment.figure.length).toBeGreaterThanOrEqual(3);
      expect(experiment.steps.length).toBeGreaterThan(0);
      for (const step of experiment.steps) expect(matrixFor(step, experiment.figure)).not.toBeNull();
      // Et sa scène survit à la relecture du document.
      const scene = normalizeScene({ figures: [{ kind: 'polygon', vertices: experiment.figure }], steps: experiment.steps });
      expect(scene.steps).toHaveLength(experiment.steps.length);
      expect(scene.figures[0].vertices).toHaveLength(experiment.figure.length);
    }
  });

  it('chaque expérience CHANGE quelque chose — sinon il n’y a rien à observer', () => {
    for (const experiment of EXPERIMENTS) {
      const image = experiment.steps.reduce((vertices, step) => {
        const matrix = matrixFor(step, experiment.figure);

        return vertices.map((vertex) => M.cleanPoint(M.applyMatrix(matrix, vertex)));
      }, experiment.figure);
      expect(M.figuresCoincide(experiment.figure, image)).toBe(false);
    }
  });

  it('les identifiants sont uniques et retrouvables', () => {
    const ids = EXPERIMENTS.map((experiment) => experiment.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getExperiment(id)).not.toBeNull();
    expect(getExperiment('inconnu')).toBeNull();
  });

  it('l’expérience « ordre » a bien DEUX pas, sans quoi il n’y a pas d’ordre', () => {
    expect(getExperiment('order').steps).toHaveLength(2);
  });
});

describe('les préréglages (§35)', () => {
  it('chacun pose un pas valide', () => {
    for (const preset of PRESETS) {
      expect(matrixFor(preset.step, [])).not.toBeNull();
      expect(normalizeScene({ figures: [], steps: [preset.step] }).steps).toHaveLength(1);
    }
  });

  it('les quarts de tour font bien ce qu’ils annoncent', () => {
    const imageOf = (id) => M.applyMatrix(matrixFor(PRESETS.find((p) => p.id === id).step, []), at(1, 0));
    expect(imageOf('rotate90')).toEqual(at(0, 1));
    expect(imageOf('rotate180')).toEqual(at(-1, 0));
    expect(imageOf('rotate270')).toEqual(at(0, -1));
  });

  it('les identifiants sont uniques', () => {
    const ids = PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('les motifs (§37)', () => {
  const triangle = [at(0, 0), at(1, 0), at(0, 1)];
  const slide = { kind: 'translation', enabled: true, vx: 2, vy: 0 };

  it('répète la transformation n fois', () => {
    const copies = patternCopies(triangle, slide, 3);
    expect(copies).toHaveLength(3);
    expect(copies[0][0]).toEqual(at(2, 0));
    expect(copies[1][0]).toEqual(at(4, 0));
    expect(copies[2][0]).toEqual(at(6, 0));
  });

  it('une rotation répétée ferme le motif', () => {
    const copies = patternCopies(triangle, { kind: 'rotation', enabled: true, angle: 90, center: { type: 'origin' } }, 4);
    // Quatre quarts de tour ramènent la figure sur elle-même.
    expect(M.figuresCoincide(copies[3], triangle)).toBe(true);
  });

  it('borne le nombre de copies (§37 — « do not turn this into a CAD editor »)', () => {
    expect(patternCopies(triangle, slide, 1000)).toHaveLength(MAX_PATTERN_COPIES);
  });

  it('zéro copie, une figure vide ou un pas invalide ne rendent rien', () => {
    expect(patternCopies(triangle, slide, 0)).toEqual([]);
    expect(patternCopies([], slide, 3)).toEqual([]);
    expect(patternCopies(triangle, { kind: 'shear' }, 3)).toEqual([]);
    expect(patternCopies(triangle, slide, Number.NaN)).toEqual([]);
  });
});
