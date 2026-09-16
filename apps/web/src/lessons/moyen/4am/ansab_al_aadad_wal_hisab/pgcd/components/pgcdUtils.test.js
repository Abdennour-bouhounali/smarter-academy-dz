import { describe, it, expect } from 'vitest';
import {
  divisors, commonDivisors, gcdByDefinition,
  euclidSteps, differenceSteps, divmod, isDivisor, areCoprime,
  euclidStepTex, differenceStepTex,
} from './pgcdUtils';

describe('divisors', () => {
  it('rend les diviseurs par ordre croissant', () => {
    expect(divisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(divisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
  });

  it('ne compte le carré qu\'une fois', () => {
    expect(divisors(49)).toEqual([1, 7, 49]);
    expect(divisors(16)).toEqual([1, 2, 4, 8, 16]);
  });

  it('rend [1] pour 1, et [] pour une entrée non valide', () => {
    expect(divisors(1)).toEqual([1]);
    expect(divisors(0)).toEqual([]);
    expect(divisors(-6)).toEqual([]);
    expect(divisors(2.5)).toEqual([]);
  });

  it('un nombre premier n\'a que deux diviseurs', () => {
    expect(divisors(13)).toEqual([1, 13]);
  });
});

describe('commonDivisors', () => {
  it('rend les diviseurs communs', () => {
    expect(commonDivisors(12, 18)).toEqual([1, 2, 3, 6]);
    expect(commonDivisors(60, 36)).toEqual([1, 2, 3, 4, 6, 12]);
  });

  it('rend [1] pour deux nombres premiers entre eux', () => {
    expect(commonDivisors(8, 15)).toEqual([1]);
  });
});

describe('gcdByDefinition', () => {
  it('est le plus grand des diviseurs communs', () => {
    expect(gcdByDefinition(12, 18)).toBe(6);
    expect(gcdByDefinition(60, 36)).toBe(12);
    expect(gcdByDefinition(264, 60)).toBe(12);
    expect(gcdByDefinition(8, 15)).toBe(1);
  });

  it('gère le cas où l\'un divise l\'autre', () => {
    expect(gcdByDefinition(7, 21)).toBe(7);
    expect(gcdByDefinition(25, 5)).toBe(5);
  });

  it('est symétrique', () => {
    expect(gcdByDefinition(18, 12)).toBe(gcdByDefinition(12, 18));
  });
});

describe('euclidSteps — خوارزمية أقليدس', () => {
  it('produit les divisions successives et le bon PGCD', () => {
    const { steps, gcd } = euclidSteps(264, 60);
    expect(gcd).toBe(12);
    expect(steps).toEqual([
      { a: 264, b: 60, q: 4, r: 24 },
      { a: 60, b: 24, q: 2, r: 12 },
      { a: 24, b: 12, q: 2, r: 0 },
    ]);
  });

  it('s\'arrête sur un reste nul, et le PGCD est le dernier reste non nul', () => {
    const { steps, gcd } = euclidSteps(48, 18);
    expect(steps[steps.length - 1].r).toBe(0);
    expect(gcd).toBe(6);
    // le PGCD est le diviseur de la dernière étape
    expect(steps[steps.length - 1].b).toBe(gcd);
  });

  it('chaque étape vérifie a = b × q + r', () => {
    const { steps } = euclidSteps(1071, 462);
    steps.forEach(({ a, b, q, r }) => {
      expect(a).toBe(b * q + r);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(b);
    });
  });

  it('accepte les arguments dans n\'importe quel ordre', () => {
    expect(euclidSteps(60, 264).gcd).toBe(12);
  });

  it('s\'accorde avec la définition sur un balayage', () => {
    for (let a = 1; a <= 60; a += 1) {
      for (let b = 1; b <= 60; b += 1) {
        expect(euclidSteps(a, b).gcd).toBe(gcdByDefinition(a, b));
      }
    }
  });
});

describe('differenceSteps — الفروق المتتالية', () => {
  it('remplace le plus grand par la différence, jusqu\'à l\'égalité', () => {
    const { steps, gcd } = differenceSteps(18, 12);
    expect(gcd).toBe(6);
    expect(steps).toEqual([
      { big: 18, small: 12, diff: 6 },
      { big: 12, small: 6, diff: 6 },
    ]);
  });

  it('donne le même PGCD qu\'Euclide', () => {
    for (const [a, b] of [[264, 60], [48, 18], [36, 60], [8, 15], [21, 7]]) {
      expect(differenceSteps(a, b).gcd).toBe(euclidSteps(a, b).gcd);
    }
  });

  it('s\'accorde avec la définition sur un balayage', () => {
    for (let a = 1; a <= 40; a += 1) {
      for (let b = 1; b <= 40; b += 1) {
        expect(differenceSteps(a, b).gcd).toBe(gcdByDefinition(a, b));
      }
    }
  });

  it('ne produit aucune étape quand les deux nombres sont déjà égaux', () => {
    const { steps, gcd } = differenceSteps(15, 15);
    expect(steps).toEqual([]);
    expect(gcd).toBe(15);
  });
});

describe('divmod', () => {
  it('rend le quotient et le reste', () => {
    expect(divmod(264, 60)).toEqual({ q: 4, r: 24 });
    expect(divmod(24, 12)).toEqual({ q: 2, r: 0 });
  });
});

describe('isDivisor / areCoprime', () => {
  it('reconnaît un diviseur', () => {
    expect(isDivisor(6, 18)).toBe(true);
    expect(isDivisor(5, 18)).toBe(false);
  });

  it('reconnaît deux nombres premiers entre eux', () => {
    expect(areCoprime(8, 15)).toBe(true);
    expect(areCoprime(12, 18)).toBe(false);
  });
});

describe('mise en forme LaTeX', () => {
  it('écrit une étape d\'Euclide', () => {
    expect(euclidStepTex({ a: 264, b: 60, q: 4, r: 24 }))
      .toBe('264 = 60 \\times 4 + 24');
  });

  it('écrit une étape de différences', () => {
    expect(differenceStepTex({ big: 264, small: 60, diff: 204 }))
      .toBe('264 - 60 = 204');
  });
});

/**
 * LES INVARIANTS DU LABORATOIRE D'OUVERTURE (FairShareLab / Module 1).
 *
 * Le composant ne calcule rien qu'il stocke : tout son affichage dérive de
 * `a`, `b` et `size`. Ces tests fixent donc les propriétés dont le module
 * dépend pour sa pédagogie — si l'une cassait, la découverte visée
 * (« plusieurs tailles marchent, et l'une est la plus grande ») cesserait
 * d'être vraie à l'écran.
 */
describe('invariants du laboratoire d\'ouverture (24 ; 36)', () => {
  const A = 24;
  const B = 36;

  it('le rail borné à min(a, b) contient bien TOUS les diviseurs communs', () => {
    // Le module borne le rail à min(A, B). Si un diviseur commun tombait
    // au-delà de cette borne, il serait inatteignable et la question « quel
    // est le plus grand ? » n'aurait pas de réponse atteignable.
    const maxSize = Math.min(A, B);
    for (const d of commonDivisors(A, B)) {
      expect(d).toBeLessThanOrEqual(maxSize);
    }
  });

  it('la taille d\'ouverture 5 laisse un reste des DEUX côtés', () => {
    // C'est le déclencheur : l'élève voit d'emblée qu'il y a quelque chose
    // à réparer. Si 5 tombait juste, le module s'ouvrirait sur un succès et
    // n'aurait plus de question.
    expect(A % 5).not.toBe(0);
    expect(B % 5).not.toBe(0);
  });

  it('il existe au moins deux diviseurs communs autres que 1', () => {
    // L'étape 1 se valide à DEUX trouvailles. Avec un seul diviseur commun
    // non trivial, l'élève resterait bloqué.
    expect(commonDivisors(A, B).filter((d) => d > 1).length).toBeGreaterThanOrEqual(2);
  });

  it('le plus grand diviseur commun est bien le dernier du rail allumé', () => {
    // Ce que le rail montre (le plus grand ✓) doit être le PGCD : c'est
    // exactement l'égalité que le module fait découvrir.
    const common = commonDivisors(A, B);
    expect(Math.max(...common)).toBe(gcdByDefinition(A, B));
  });

  it('une taille qui divise un seul des deux nombres existe (le cas « orange »)', () => {
    // Sans ce cas, la distinction « diviseur » / « diviseur commun » — qui
    // est tout le sujet — n'aurait aucune incarnation visible sur le rail.
    const onlyOne = [];
    for (let n = 1; n <= Math.min(A, B); n += 1) {
      const okA = A % n === 0;
      const okB = B % n === 0;
      if (okA !== okB) onlyOne.push(n);
    }
    expect(onlyOne.length).toBeGreaterThan(0);
    expect(onlyOne).toContain(8); // 8 divise 24, pas 36
  });
});
