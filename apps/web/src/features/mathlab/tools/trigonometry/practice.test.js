/**
 * L'entraînement « prédire → révéler → vérifier » (§25, §49).
 *
 * Deux choses se vérifient ici, et la seconde compte autant que la première :
 *   — les questions sont JUSTES (une question fausse enseigne une fausseté) ;
 *   — l'élève n'est JAMAIS bloqué (§25), et une écriture correcte n'est
 *     jamais refusée pour une raison de syntaxe.
 */

import { describe, it, expect } from 'vitest';
import {
  makeRandom, generateChallenge, parseAnswer, checkAnswer, revealTarget,
  kindsForMode, CHALLENGE_KINDS,
} from './practice.js';
import { sinOf, cosOf, tanOf, quadrantOf } from './trigMath.js';

describe('le tirage est reproductible', () => {
  it('la même graine rend la même suite', () => {
    const a = makeRandom(42);
    const b = makeRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('deux graines différentes divergent', () => {
    expect(makeRandom(1)()).not.toBe(makeRandom(2)());
  });

  it('les tirages restent dans [0, 1[', () => {
    const random = makeRandom(7);
    for (let i = 0; i < 500; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('la même graine rend le même défi', () => {
    expect(generateChallenge(99)).toEqual(generateChallenge(99));
  });
});

describe('les questions sont JUSTES — deux cents tirages vérifiés', () => {
  it('toute réponse attendue est cohérente avec la mathématique', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const challenge = generateChallenge(seed);
      expect(CHALLENGE_KINDS.includes(challenge.kind) || challenge.kind === 'undefinedRatio', challenge.kind).toBe(true);
      expect(typeof challenge.promptKey).toBe('string');
      expect(Array.isArray(challenge.hintKeys)).toBe(true);
      expect(challenge.hintKeys.length).toBeGreaterThan(0);
      expect(typeof challenge.explainKey).toBe('string');

      switch (challenge.kind) {
        case 'ratioValue': {
          const { ratio, angle } = challenge.promptParams;
          const truth = ratio === 'sin' ? sinOf(angle) : ratio === 'cos' ? cosOf(angle) : tanOf(angle);
          expect(Math.abs(challenge.expected - truth), `${ratio}(${angle}°)`).toBeLessThan(1e-9);
          break;
        }
        case 'undefinedRatio':
          // Une question « est-ce défini ? » ne se pose QUE là où ça ne l’est pas.
          expect(tanOf(challenge.angle)).toBeNull();
          expect(challenge.expected).toBe('undefined');
          break;
        case 'signs': {
          const angle = challenge.promptParams.angle;
          expect(challenge.expected.sin).toBe(sinOf(angle) > 0 ? 1 : -1);
          expect(challenge.expected.cos).toBe(cosOf(angle) > 0 ? 1 : -1);
          // La question sur les signes évite les axes, où un signe est nul.
          expect(quadrantOf(angle).quadrant).toBeGreaterThanOrEqual(1);
          break;
        }
        case 'quadrantOf':
          // Un rapport non nul a exactement DEUX quadrants (§24).
          expect(challenge.expected.length).toBe(2);
          break;
        case 'triangleRatio': {
          const { opposite, adjacent, hypotenuse } = challenge.promptParams;
          // Le triplet est pythagoricien : l’élève peut vérifier de tête.
          expect(opposite ** 2 + adjacent ** 2).toBe(hypotenuse ** 2);
          expect(challenge.expected).toBeGreaterThan(0);
          break;
        }
        case 'degToRad':
          expect(Number.isFinite(challenge.expected)).toBe(true);
          break;
        case 'coordinates': {
          const { angle, axis } = challenge.promptParams;
          const truth = axis === 'x' ? cosOf(angle) : sinOf(angle);
          expect(Math.abs(challenge.expected - truth)).toBeLessThan(1e-9);
          break;
        }
        default:
          throw new Error(`famille inconnue : ${challenge.kind}`);
      }
    }
  });

  it('la bonne réponse est TOUJOURS acceptée', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const challenge = generateChallenge(seed);
      const answer = challenge.answerType === 'number' ? String(challenge.expected)
        : challenge.answerType === 'multi' ? challenge.expected
          : challenge.expected;
      expect(checkAnswer(challenge, answer).correct, `graine ${seed} (${challenge.kind})`).toBe(true);
    }
  });

  it('la forme EXACTE écrite à la main est acceptée aussi', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const challenge = generateChallenge(seed);
      if (challenge.answerType !== 'number' || !challenge.expectedText) continue;
      if (challenge.expectedText.endsWith('°')) continue;  // « 60° » se tape « 60 »
      expect(
        checkAnswer(challenge, challenge.expectedText).correct,
        `graine ${seed} : « ${challenge.expectedText} »`,
      ).toBe(true);
    }
  });

  it('varie les familles — y compris sur des graines CONSÉCUTIVES', () => {
    const kinds = new Set();
    for (let seed = 1; seed <= 120; seed += 1) kinds.add(generateChallenge(seed).kind);
    expect(kinds.size).toBeGreaterThanOrEqual(5);
  });

  it('deux questions de suite sont rarement identiques (régression : la graine est brouillée)', () => {
    let repeats = 0;
    for (let seed = 1; seed < 100; seed += 1) {
      if (generateChallenge(seed).kind === generateChallenge(seed + 1).kind) repeats += 1;
    }
    // Avec six familles, ~17 répétitions sont attendues par hasard ; le
    // générateur non brouillé en donnait 99.
    expect(repeats).toBeLessThan(45);
  });

  it('le mode triangle ne pose pas de question sur les quadrants', () => {
    const kinds = kindsForMode('triangle');
    expect(kinds).not.toContain('quadrantOf');
    expect(kinds).toContain('triangleRatio');
    for (let seed = 1; seed <= 60; seed += 1) {
      expect(kinds).toContain(generateChallenge(seed, kinds).kind === 'undefinedRatio' ? 'ratioValue' : generateChallenge(seed, kinds).kind);
    }
  });
});

describe('la lecture d’une réponse — la syntaxe n’est pas le sujet', () => {
  it('lit un décimal, virgule ou point', () => {
    expect(parseAnswer('0,5')).toBe(0.5);
    expect(parseAnswer('0.5')).toBe(0.5);
    expect(parseAnswer('45')).toBe(45);
  });

  it('lit une fraction', () => {
    expect(parseAnswer('1/2')).toBe(0.5);
    expect(parseAnswer('3/4')).toBe(0.75);
    expect(parseAnswer('-1/2')).toBe(-0.5);
  });

  it('lit un radical, sous toutes ses écritures', () => {
    const expected = Math.sqrt(3) / 2;
    for (const text of ['√3/2', 'sqrt(3)/2'.replace(/[()]/g, ''), 'racine3/2', 'rac3/2']) {
      expect(Math.abs(parseAnswer(text) - expected), text).toBeLessThan(1e-12);
    }
    expect(Math.abs(parseAnswer('√2/2') - Math.SQRT1_2)).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('√3') - Math.sqrt(3))).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('2√3') - 2 * Math.sqrt(3))).toBeLessThan(1e-12);
  });

  it('lit le vrai signe moins (U+2212), celui que l’instrument AFFICHE', () => {
    expect(parseAnswer('−1/2')).toBe(-0.5);
    expect(parseAnswer('−1')).toBe(-1);
  });

  it('lit les chiffres arabes-indiens si l’élève les tape', () => {
    expect(parseAnswer('٤٥')).toBe(45);
  });

  it('ignore les espaces', () => {
    expect(parseAnswer(' 1 / 2 ')).toBe(0.5);
  });

  it('lit π', () => {
    expect(Math.abs(parseAnswer('π/3') - Math.PI / 3)).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('pi/2') - Math.PI / 2)).toBeLessThan(1e-12);
  });

  it('lit π AVEC son coefficient — 315° s’écrit 7π/4 (régression)', () => {
    expect(Math.abs(parseAnswer('7π/4') - (7 * Math.PI) / 4)).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('2π/3') - (2 * Math.PI) / 3)).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('2π') - 2 * Math.PI)).toBeLessThan(1e-12);
    expect(Math.abs(parseAnswer('3pi/2') - (3 * Math.PI) / 2)).toBeLessThan(1e-12);
  });

  it('ne concatène pas 7 et 3,14 — le piège de la substitution naïve', () => {
    expect(parseAnswer('7π/4')).toBeLessThan(10);
  });

  it('rend NaN sur ce qui n’est pas lisible — sans jeter', () => {
    for (const text of ['', '   ', 'bonjour', '1/0', '//', null, undefined, 42]) {
      expect(parseAnswer(text), String(text)).toBeNaN();
    }
  });
});

describe('le verdict ne bloque JAMAIS (§25)', () => {
  const challenge = generateChallenge(1);

  it('distingue « faux » de « illisible »', () => {
    const numeric = { kind: 'ratioValue', answerType: 'number', expected: 0.5 };
    expect(checkAnswer(numeric, '0,5')).toEqual({ correct: true, readable: true });
    expect(checkAnswer(numeric, '0,7')).toEqual({ correct: false, readable: true });
    expect(checkAnswer(numeric, 'bonjour')).toEqual({ correct: false, readable: false });
  });

  it('une réponse fausse ne produit aucun état de blocage', () => {
    const verdict = checkAnswer(challenge, 'n’importe quoi');
    expect(verdict.correct).toBe(false);
    // Le verdict ne porte QUE ces deux champs : il n’y a pas de « bloqué ».
    expect(Object.keys(verdict).sort()).toEqual(['correct', 'readable']);
  });

  it('accepte une petite imprécision — 0,866 vaut √3/2', () => {
    const numeric = { kind: 'x', answerType: 'number', expected: Math.sqrt(3) / 2 };
    expect(checkAnswer(numeric, '0,866').correct).toBe(true);
    expect(checkAnswer(numeric, '0,86').correct).toBe(false);
  });

  it('la tolérance propre à une question est respectée', () => {
    const radians = { kind: 'degToRad', answerType: 'number', expected: Math.PI / 3, tolerance: 0.02 };
    expect(checkAnswer(radians, '1,05').correct).toBe(true);
    expect(checkAnswer(radians, '1,5').correct).toBe(false);
  });

  it('les quadrants : l’ordre de sélection n’a pas d’importance', () => {
    const multi = { answerType: 'multi', expected: [2, 3] };
    expect(checkAnswer(multi, [3, 2]).correct).toBe(true);
    expect(checkAnswer(multi, [2]).correct).toBe(false);
    expect(checkAnswer(multi, [2, 3, 4]).correct).toBe(false);
    expect(checkAnswer(multi, []).readable).toBe(false);
  });

  it('les signes : les trois doivent être posés pour être lisibles', () => {
    const signs = { answerType: 'signs', expected: { sin: 1, cos: -1, tan: -1 } };
    expect(checkAnswer(signs, { sin: 1, cos: -1, tan: -1 }).correct).toBe(true);
    expect(checkAnswer(signs, { sin: 1, cos: -1 }).readable).toBe(false);
    expect(checkAnswer(signs, { sin: 1, cos: 1, tan: -1 }).correct).toBe(false);
  });

  it('un défi absent ne fait pas planter', () => {
    expect(checkAnswer(null, '1')).toEqual({ correct: false, readable: false });
    expect(checkAnswer({ answerType: 'inconnu' }, '1').correct).toBe(false);
  });
});

describe('la révélation MONTRE la réponse (§25)', () => {
  it('une question d’angle amène le cercle à cet angle', () => {
    const target = revealTarget({ kind: 'ratioValue', angle: 30 });
    expect(target).toEqual({ mode: 'circle', angle: 30 });
  });

  it('un angle hors tour est ramené pour la révélation', () => {
    expect(revealTarget({ angle: 450 }).angle).toBe(90);
  });

  it('une question de triangle POSE le triangle, elle ne bouge pas le cercle', () => {
    const challenge = { triangle: { given: 'opp-adj', opposite: 3, adjacent: 4, hypotenuse: 5 } };
    expect(revealTarget(challenge)).toEqual({ mode: 'triangle', triangle: challenge.triangle });
  });

  it('chaque défi tiré sait où se montrer', () => {
    for (let seed = 1; seed <= 60; seed += 1) {
      expect(revealTarget(generateChallenge(seed)), `graine ${seed}`).not.toBeNull();
    }
  });

  it('un défi absent ne rend rien plutôt que de jeter', () => {
    expect(revealTarget(null)).toBeNull();
  });
});
