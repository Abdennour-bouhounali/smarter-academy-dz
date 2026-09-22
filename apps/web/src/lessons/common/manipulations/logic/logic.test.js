import { describe, it, expect } from 'vitest';
import * as DE from './divisorExplorer';
import * as FP from './factorPairs';
import * as DP from './divisorProperties';
import * as CD from './commonDivisors';
import * as AL from './algorithms';
import * as CP from './coprime';
import * as FR from './fraction';
import * as TB from './teamBuilder';
import { plausibleChoices } from '../useManipulation';
import { LEVELS, levelMatching } from '../levels';
import { MANIPULATION_TYPE_IDS } from '@smarter-academy/core';

/* Les nombres sont ceux du manuel (§29) : 420/26/28, 60, 105, 18-12-3,
   90/54, 42/60, 252/140, 765/135, 1938/836, 17/18, 27/36, 84/48, 595/560. */

describe('divisor-explorer (420 livres)', () => {
  it('poser 26 laisse 4 livres, poser 28 range tout — le verdict EST le reste', () => {
    let s = DE.init({ a: 420 });
    s = DE.place(s, 26);
    expect([s.q, s.r, s.divides]).toEqual([16, 4, false]);
    s = DE.place(s, 28);
    expect([s.q, s.r, s.divides]).toEqual([15, 0, true]);
    expect(DE.summary(s)).toEqual({ yes: [28], no: [26] });
  });
  it('la découverte attend un reste nul ET un reste non nul', () => {
    let s = DE.place(DE.init({ a: 420 }), 28);
    expect(DE.discoveryReady(s)).toBe(false);
    s = DE.place(s, 26);
    expect(DE.discoveryReady(s)).toBe(true);
  });
  it('refuse une taille plus grande que le stock ou non naturelle', () => {
    const s = DE.init({ a: 420 });
    expect(DE.canPlace(s, 421)).toBe('largerThanA');
    expect(DE.canPlace(s, 0)).toBe('notNatural');
    expect(DE.place(s, 421)).toBe(s);
  });
});

describe('factor-pairs (60 et 105)', () => {
  it('60 en 4 colonnes : rectangle parfait, couple 4 × 15', () => {
    const s = FP.test(FP.init({ n: 60 }), 4);
    expect([s.rows, s.rest]).toEqual([15, 0]);
    expect(s.pairs.map((p) => p.key)).toEqual(['4x15']);
  });
  it('60 en 7 colonnes : dernière ligne incomplète, aucun couple', () => {
    const s = FP.test(FP.init({ n: 60 }), 7);
    expect(s.rest).toBe(4);
    expect(s.pairs).toEqual([]);
  });
  it('au-delà de √105 = 10, tester 15 REDONNE le couple 7 × 15 : la règle d’arrêt se voit', () => {
    let s = FP.init({ n: 105 });
    for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) s = FP.test(s, d);
    expect(FP.complete(s)).toBe(true);
    expect(FP.discoveryReady(s)).toBe(false);
    s = FP.test(s, 15);
    expect(s.tested.find((t) => t.d === 15)).toMatchObject({ divides: true, repeat: true, beyondBound: true });
    expect(FP.discoveryReady(s)).toBe(true);
    expect(FP.foundDivisors(s)).toEqual([1, 3, 5, 7, 15, 21, 35, 105]);
    expect(FP.foundDivisors(s)).toEqual(FP.allDivisors(s));
  });
});

describe('divisor-properties (n = 3, a = 18, b = 12)', () => {
  const s0 = DP.init({ n: 3, a: 18, b: 12 });
  it('a + b, a − b et le reste sont des nombres entiers de blocs de 3', () => {
    expect(DP.blocks(s0, 'sum')).toMatchObject({ value: 30, count: 10 });
    expect(DP.blocks(s0, 'diff')).toMatchObject({ value: 6, count: 2 });
    expect(DP.blocks(s0, 'rem')).toMatchObject({ value: 6, count: 2 });
  });
  it('les trois constructions déclenchent la découverte ; une seconde fois est refusée', () => {
    let s = DP.build(DP.build(s0, 'sum'), 'diff');
    expect(DP.discoveryReady(s)).toBe(false);
    expect(DP.canBuild(s, 'sum')).toBe('alreadyBuilt');
    s = DP.build(s, 'rem');
    expect(DP.discoveryReady(s)).toBe(true);
  });
  it('la preuve se construit dans l’ordre du manuel, une mauvaise ligne est signalée sans bloquer', () => {
    let p = DP.proofInit();
    expect(p.pool).toHaveLength(5);
    expect(DP.proofCanPlace(p, 'sum', 0)).toBe('wrongLine');
    p = DP.proofPlace(p, 'sum', 0);
    expect(p.wrong).toBe('sum');
    expect(p.placed).toEqual([]);
    for (const id of ['hyp-a', 'hyp-b', 'sum', 'factor', 'concl']) p = DP.proofPlace(p, id, p.placed.length);
    expect(DP.proofDone(p)).toBe(true);
    expect(p.pool).toEqual([]);
  });
});

describe('common-divisors', () => {
  it('bouquets 90/54 : 9 bouquets marchent (10 rouges, 6 blanches), 7 non', () => {
    let s = CD.choose(CD.initBouquets({ a: 90, b: 54 }), 9);
    expect([s.qa, s.qb, s.works]).toEqual([10, 6, true]);
    s = CD.choose(s, 7);
    expect(s.works).toBe(false);
    expect(s.tried).toEqual({ 9: 'common', 7: 'no' });
    s = CD.choose(s, 5);
    expect(s.tried[5]).toBe('single');
    expect(CD.bouquetsDiscoveryReady(s)).toBe(false);
    s = CD.choose(s, 18);
    expect(CD.bouquetsDiscoveryReady(s)).toBe(true);
  });
  it('listes 42/60 : seuls 1, 2, 3, 6 vont au milieu ; 6 seul va dans PGCD, et seulement à la fin', () => {
    let s = CD.initLists({ a: 42, b: 60 });
    expect(s.common).toEqual([1, 2, 3, 6]);
    expect(CD.canPlaceCommon(s, 7)).toBe('dividesOnlyA');
    expect(CD.canPlaceCommon(s, 5)).toBe('dividesOnlyB');
    expect(CD.canPlacePgcd(s, 6)).toBe('notAllCommon');
    for (const d of [1, 2, 3]) s = CD.placeCommon(s, d);
    expect(CD.allCommonPlaced(s)).toBe(false);
    s = CD.placeCommon(s, 6);
    expect(CD.canPlacePgcd(s, 3)).toBe('notGreatest');
    s = CD.placePgcd(s, 6);
    expect(CD.listsDiscoveryReady(s)).toBe(true);
    expect(s.pgcd).toBe(6);
  });
});

describe('pgcd-differences (252 et 140)', () => {
  it('seul « le petit sur le grand » soustrait ; la chaîne va jusqu’au fruit nul ; PGCD = 28', () => {
    let s = AL.initDifferences({ a: 252, b: 140 });
    expect(AL.canSubtract(s, 'big', 'small')).toBe('bigOnSmall');
    expect(AL.canSubtract(s, 'small', 'big')).toBe(true);
    expect(AL.currentPair(s)).toEqual({ big: 252, small: 140 });
    s = AL.subtract(s);
    expect(AL.currentPair(s)).toEqual({ big: 140, small: 112 });
    while (!AL.isDifferencesFinished(s)) s = AL.subtract(s);
    expect(s.steps[s.steps.length - 1].diff).toBe(0);
    expect(AL.lastNonZeroDiff(s)).toBe(28);
    expect(AL.canPlaceDifferencePgcd(s, 56)).toBe('notLastNonZero');
    expect(AL.canPlaceDifferencePgcd(s, 28)).toBe(true);
    expect(AL.canSubtract(s, 'small', 'big')).toBe('finished');
  });
});

describe('euclidean-algorithm (1938 et 836, 765 et 135)', () => {
  it('deux copies de 836 tiennent dans 1938, la troisième déborde ; le reste 266 passe à la ligne suivante', () => {
    let s = AL.initEuclid({ a: 1938, b: 836 });
    s = AL.addCopy(s); s = AL.addCopy(s);
    expect(AL.canAddCopy(s)).toBe('overflow');
    expect(AL.quotientReached(s)).toBe(true);
    expect(AL.remainderOf(s)).toBe(266);
    expect(AL.canCarryRemainder(s, 266)).toBe(true);
    s = AL.carryRemainder(s);
    expect(AL.currentDivision(s)).toMatchObject({ a: 836, b: 266, q: 3, r: 38 });
  });
  it('le geste canonique termine la chaîne : 3 divisions pour 765/135 contre 8 différences', () => {
    let s = AL.initEuclid({ a: 765, b: 135 });
    let guard = 0;
    while (!AL.isEuclidFinished(s) && guard++ < 20) s = AL.euclidAutoStep(s);
    expect(AL.isEuclidFinished(s)).toBe(true);
    expect(s.gcd).toBe(45);
    expect(AL.canPlaceEuclidPgcd(s, 45)).toBe(true);
    expect(AL.comparison(765, 135)).toEqual({ differences: 8, divisions: 3 });
  });
});

describe('coprime-explorer (17/18 et 27/36)', () => {
  it('17 et 18 : seul 1 va dans la zone partagée', () => {
    let s = CP.init({ a: 17, b: 18 });
    expect(CP.canShare(s, CP.chipId('a', 17))).toBe('dividesOnlyA');
    s = CP.share(s, CP.chipId('a', 1));
    expect(CP.verdict(s)).toBe('coprime');
  });
  it('27 et 36 : 3 et 9 sont communs, مريم a tort', () => {
    let s = CP.init({ a: 27, b: 36 });
    s = CP.share(s, CP.chipId('a', 1));
    expect(CP.verdict(s)).toBe('missing');
    s = CP.share(s, CP.chipId('b', 3)); s = CP.share(s, CP.chipId('a', 9));
    expect(CP.verdict(s)).toBe('notCoprime');
    expect(s.g).toBe(9);
    expect(CP.canShare(s, CP.chipId('b', 4))).toBe('dividesOnlyB');
  });
});

describe('fraction-reduction (84/48 et 595/560)', () => {
  it('le chemin de سمير : ÷4 puis ÷3 → 7/4, puis le PGCD 12 en une fois', () => {
    let s = FR.init({ n: 84, d: 48 });
    expect(FR.candidatesA(s)).toEqual([2, 3, 4, 6, 12]);
    expect(FR.canReduceB(s, 12)).toBe('pathANotFinished');
    s = FR.reduceA(s, 4);
    expect(FR.currentA(s)).toEqual({ n: 21, d: 12 });
    expect(FR.canReduceA(s, 4)).toBe('dividesOnlyDenominator');
    s = FR.reduceA(s, 3);
    expect(FR.currentA(s)).toEqual({ n: 7, d: 4 });
    expect(FR.pathAFinished(s)).toBe(true);
    expect(FR.candidatesA(s)).toEqual([]);
    expect(FR.canReduceB(s, 4)).toBe('notPgcd');
    s = FR.reduceB(s, 12);
    expect(FR.discoveryReady(s)).toBe(true);
    expect(FR.chainA(s).map((c) => `${c.n}/${c.d}`)).toEqual(['84/48', '21/12', '7/4']);
  });
  it('595/560 : PGCD 35, forme irréductible 17/16', () => {
    const s = FR.init({ n: 595, d: 560 });
    expect(s.gcd).toBe(35);
    expect(s.final).toEqual({ n: 17, d: 16 });
  });
});

describe('paliers et propositions', () => {
  it('chaque type a quatre paliers, dont au plus un ajouté par la plateforme, et ils sont reconnus', () => {
    for (const type of MANIPULATION_TYPE_IDS) {
      const lv = LEVELS[type];
      expect(lv, type).toHaveLength(4);
      expect(lv.filter((l) => l.source === 'platform').length).toBeLessThanOrEqual(1);
      expect(levelMatching(type, lv[1].numbers)?.id).toBe(2);
    }
  });
  it('plausibleChoices est déterministe, sans doublon, et contient la bonne réponse', () => {
    const c = plausibleChoices(112, [392, 28, 113]);
    expect(c).toHaveLength(3);
    expect(new Set(c).size).toBe(3);
    expect(c).toContain(112);
    expect(plausibleChoices(112, [392, 28, 113])).toEqual(c);
  });
});

/* ── team-builder — le partage équitable rendu physique (15 et 16 joueurs) ──
   Le contexte est de la plateforme (act-1, réhabillé) ; la mathématique est
   celle du manuel : a = b × q + r, et le reste est un nombre d'objets. */
describe('team-builder (15 et 16 joueurs, 3 équipes)', () => {
  it('15 joueurs en 3 équipes : tout le monde joue, 5 par équipe', () => {
    let s = TB.init({ total: 15, groups: 3 });
    s = TB.fill(s);
    expect(s.teams.map((t) => t.length)).toEqual([5, 5, 5]);
    expect(s.bench).toEqual([]);
    const v = TB.verdict(s);
    expect([v.perGroup, v.leftOver, v.exact, v.settled]).toEqual([5, 0, true, true]);
  });

  it('16 joueurs en 3 équipes : 5 par équipe et UN joueur reste dehors, dessinable', () => {
    let s = TB.init({ total: 16, groups: 3 });
    s = TB.fill(s);
    expect(s.teams.map((t) => t.length)).toEqual([5, 5, 5]);
    expect(s.bench).toHaveLength(1);
    const v = TB.verdict(s);
    expect([v.perGroup, v.leftOver, v.exact]).toEqual([5, 1, false]);
    expect(v.benched).toEqual(s.bench);
    expect(v.equality).toEqual({ a: 16, b: 3, q: 5, r: 1 });
    // Ce que l'élève se demande tout seul : +2 ou −1.
    expect(v.fix).toEqual({ add: 2, remove: 1 });
  });

  it('les équipes restent ÉGALES : remplir une équipe avant les autres est refusé, avec sa raison', () => {
    let s = TB.init({ total: 15, groups: 3 });
    s = TB.place(s, 0, 0);
    expect(TB.canPlace(s, 1, 0)).toBe('teamsMustStayEqual');
    expect(TB.canPlace(s, 1, 1)).toBe(true);
    // Le refus ne consomme pas le joueur : il reste sur le banc.
    const after = TB.place(s, 1, 0);
    expect(after.bench).toContain(1);
    expect(after.attempts).toBe(1);
  });

  it('une équipe n’accepte jamais plus que sa part', () => {
    let s = TB.fill(TB.init({ total: 16, groups: 3 }));
    const leftover = s.bench[0];
    // Le seizième ne peut aller NULLE PART : c'est cela, le reste.
    for (let t = 0; t < 3; t += 1) expect(TB.canPlace(s, leftover, t)).toBe('teamIsFull');
    expect(TB.isSettled(s)).toBe(true);
  });

  it('on peut reprendre un joueur : il revient sur le banc, l’erreur ne coûte rien', () => {
    let s = TB.place(TB.init({ total: 15, groups: 3 }), 0, 0);
    s = TB.unplace(s, 0);
    expect(s.bench).toContain(0);
    expect(s.teams.every((t) => t.length === 0)).toBe(true);
  });

  it('la découverte attend le CONTRASTE : un partage juste ET un partage avec reste', () => {
    let s = TB.remember(TB.init({ total: 15, groups: 3 }));
    expect(TB.discoveryReady(s)).toBe(false);
    s = TB.remember(TB.setTotal(s, 16));
    expect(TB.discoveryReady(s)).toBe(true);
  });

  it('changer d’effectif ou d’équipes rouvre la question sans perdre la mémoire des essais', () => {
    let s = TB.remember(TB.init({ total: 15, groups: 3 }));
    s = TB.setGroups(s, 5);
    expect(s.teams).toHaveLength(5);
    expect(s.bench).toHaveLength(15);
    expect(s.tried['15:3']).toBe(true);
    expect(TB.setTotal(s, 0)).toBe(s);
  });

  it('les nombres d’équipes qui tombent juste sont exactement les diviseurs', () => {
    expect(TB.exactChoices(24, 8)).toEqual([2, 3, 4, 6, 8]);
    expect(TB.exactChoices(420, 8)).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it('le geste canonique du mode classe avance puis s’arrête', () => {
    let s = TB.init({ total: 15, groups: 3 });
    expect(TB.nextMove(s)).toEqual({ playerId: 0, team: 0 });
    s = TB.fill(s);
    expect(TB.nextMove(s)).toBeNull();
  });
});

/* Déplacer un joueur DÉJÀ PLACÉ vers une autre équipe : l'élève change d'avis,
   et l'interface ne doit pas se battre avec lui (MANIPULATION_CONTRACT §4). */
describe('team-builder — changer d’avis', () => {
  it('un joueur placé peut passer dans une autre équipe sans repasser par le banc', () => {
    let s = TB.init({ total: 15, groups: 3 });
    s = TB.place(s, 0, 0);
    expect(TB.teamOf(s, 0)).toBe(0);
    // Les équipes 1 et 2 sont vides : y déplacer le joueur garde l'égalité.
    expect(TB.canPlace(s, 0, 1)).toBe(true);
    s = TB.place(s, 0, 1);
    expect(TB.teamOf(s, 0)).toBe(1);
    expect(s.teams[0]).toEqual([]);
    // Il n'est pas dupliqué : il est dans UNE seule équipe, et pas sur le banc.
    expect(s.teams.flat().filter((p) => p === 0)).toHaveLength(1);
    expect(s.bench).not.toContain(0);
  });

  it('le reposer dans sa propre équipe ne fait rien, et le dit', () => {
    const s = TB.place(TB.init({ total: 15, groups: 3 }), 0, 0);
    expect(TB.canPlace(s, 0, 0)).toBe('sameTeam');
  });

  it('un déplacement qui romprait l’égalité reste refusé', () => {
    let s = TB.init({ total: 15, groups: 3 });
    s = TB.place(s, 0, 0); s = TB.place(s, 1, 1); s = TB.place(s, 2, 2);
    s = TB.place(s, 3, 0); s = TB.place(s, 4, 1); s = TB.place(s, 5, 2);
    // Déplacer 3 (équipe 0 → équipe 1) donnerait 1 · 3 · 2 : inégal.
    expect(TB.canPlace(s, 3, 1)).toBe('teamsMustStayEqual');
  });

  it('une fois les équipes égales et pleines, un déplacement les déséquilibrerait : refusé, avec la BONNE raison', () => {
    const s = TB.fill(TB.init({ total: 16, groups: 3 }));
    const placed = s.teams[0][0];
    // Sortir ce joueur laisserait 4 · 5 · 5 : l'égalité est ce qui casse en
    // premier, et c'est donc ce que l'élève doit lire — pas « équipe pleine ».
    expect(TB.canPlace(s, placed, 1)).toBe('teamsMustStayEqual');
    // La scène reste stabilisée, avec son joueur dehors : le reste demeure.
    expect(TB.isSettled(s)).toBe(true);
    expect(TB.verdict(s).leftOver).toBe(1);
  });
});
