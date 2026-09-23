import { describe, it, expect } from 'vitest';
import * as S from './numberState.js';
import { numberLabTool } from './index.js';

/** Le document : ce qu'il vaut neuf, ce qu'il devient abîmé, ce qu'il pèse. */

describe('un document neuf', () => {
  it('ouvre sur l’EXPLORATEUR et sur 360', () => {
    const data = S.createNumberLabData();
    expect(data.mode).toBe('explorer');
    expect(data.explorer.value).toBe(360);
  });

  it('a les treize modes de §3, chacun avec ses propres nombres', () => {
    const data = S.createNumberLabData();
    for (const mode of S.MODES) expect(data[mode], mode).toBeTruthy();
    expect(S.MODES).toHaveLength(13);
  });

  it('ne garde AUCUN état transitoire (§43)', () => {
    const data = S.createNumberLabData();
    const serialized = JSON.stringify(data);
    for (const forbidden of ['animation', 'playing', 'panelOpen', 'challenge', 'verdict', 'hover', 'dragging']) {
      expect(serialized, forbidden).not.toContain(forbidden);
    }
  });

  it('se relit à l’identique — normaliser est idempotent', () => {
    const data = S.createNumberLabData();
    expect(S.normalizeNumberLabData(data)).toEqual(data);
    expect(S.normalizeNumberLabData(S.normalizeNumberLabData(data))).toEqual(data);
  });
});

describe('relire un document abîmé', () => {
  it.each([
    null, undefined, {}, [], 0, 'x', { mode: 'inconnu' },
    { explorer: null }, { line: { points: 'pas un tableau' } },
    { fractions: { left: { n: 1, d: 0 } } }, { primes: { limit: 1e9 } },
    { proportion: { rows: [{ x: 'a' }] } }, { notes: [1, 2, null] },
    { practice: { level: 99, solved: -5 } }, { gcdLcm: { a: -3, b: 0 } },
  ])('cas %# s’ouvre sur quelque chose de sensé', (raw) => {
    const data = S.normalizeNumberLabData(raw);
    expect(S.MODES).toContain(data.mode);
    expect(data.fractions.left.d).toBeGreaterThan(0);
    expect(data.practice.level).toBeGreaterThanOrEqual(1);
    expect(data.practice.level).toBeLessThanOrEqual(5);
    expect(data.gcdLcm.a).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(data.notes)).toBe(true);
  });

  it('une fraction n’est JAMAIS réduite en silence (§9)', () => {
    expect(S.normalizeNumberLabData({ fractions: { left: { n: 2, d: 4 } } }).fractions.left).toEqual({ n: 2, d: 4 });
  });

  it('un crible plus grand que ce qu’on sait dessiner est ramené à la borne', () => {
    expect(S.normalizeNumberLabData({ primes: { limit: 999999 } }).primes.limit).toBe(10000);
  });

  it('une fenêtre dégénérée est refusée', () => {
    const view = S.normalizeNumberLabData({ line: { view: { center: 0, span: 0 } } }).line.view;
    expect(view.span).toBeGreaterThan(0);
  });
});

describe('l’arbre de factorisation (§24)', () => {
  it('garde un arbre COHÉRENT : le produit des fils fait le père', () => {
    const tree = S.normalizeTree({ n: 12, left: { n: 3 }, right: { n: 4 } });
    expect(tree).toEqual({ n: 12, left: { n: 3 }, right: { n: 4 } });
  });

  it('REFUSE une décomposition fausse — 12 ≠ 3 × 5', () => {
    expect(S.normalizeTree({ n: 12, left: { n: 3 }, right: { n: 5 } })).toEqual({ n: 12 });
  });

  it('refuse un nœud à un seul fils', () => {
    expect(S.normalizeTree({ n: 12, left: { n: 3 } })).toEqual({ n: 12 });
  });

  it('borne la profondeur : un arbre venu du serveur ne fait pas exploser la pile', () => {
    let deep = { n: 2 };
    for (let i = 0; i < 200; i += 1) deep = { n: 2, left: deep, right: deep };
    expect(() => S.normalizeTree(deep)).not.toThrow();
  });
});

describe('§46 — envoyer une valeur d’un mode à l’autre est un GESTE', () => {
  it('envoyer 360 au crible pose l’arbre et CHANGE de mode', () => {
    const data = S.sendTo(S.createNumberLabData(), 'primes', 360);
    expect(data.mode).toBe('primes');
    expect(data.primes.factorTree).toEqual({ n: 360 });
  });

  it('envoyer aux facteurs remet le curseur de couples à zéro', () => {
    const start = S.patchMode(S.createNumberLabData(), 'factors', { pairIndex: 3 });
    expect(S.sendTo(start, 'factors', 36).factors).toEqual({ value: 36, pairIndex: 0 });
  });

  it('envoyer à la droite CADRE la valeur — elle n’est jamais hors champ', () => {
    const data = S.sendTo(S.createNumberLabData(), 'line', 0.75);
    expect(data.line.points[0]).toEqual({ n: 3, d: 4 });
    const { center, span } = data.line.view;
    expect(0.75).toBeGreaterThanOrEqual(center - span / 2);
    expect(0.75).toBeLessThanOrEqual(center + span / 2);
  });

  it('un nombre trop grand pour la valeur de position change de mode sans mentir', () => {
    const data = S.sendTo(S.createNumberLabData(), 'place', 9_000_000);
    expect(data.mode).toBe('place');
    expect(Math.abs(data.place.value)).toBeLessThanOrEqual(S.MAX_PLACE_VALUE);
  });

  it('changer de mode ne touche à AUCUN nombre — chaque mode garde les siens', () => {
    let data = S.patchMode(S.createNumberLabData(), 'gcdLcm', { a: 120, b: 45 });
    data = S.setMode(data, 'primes');
    data = S.setMode(data, 'gcdLcm');
    expect(data.gcdLcm).toMatchObject({ a: 120, b: 45 });
  });

  it('envoyer une fraction à la droite règle aussi la subdivision', () => {
    const data = S.sendFracTo(S.createNumberLabData(), 'line', { n: 5, d: 8 });
    expect(data.line.points[0]).toEqual({ n: 5, d: 8 });
    expect(data.line.denominator).toBe(8);
  });
});

describe('l’amorce d’une leçon (openMathLab)', () => {
  it('pose un mode et un nombre dans TOUS les modes qui l’acceptent', () => {
    const data = S.createNumberLabData({ mode: 'divisibility', value: 144 });
    expect(data.mode).toBe('divisibility');
    expect(data.divisibility.value).toBe(144);
    expect(data.explorer.value).toBe(144);
    expect(data.factors.value).toBe(144);
  });

  it('pose deux nombres pour le PGCD', () => {
    expect(S.createNumberLabData({ a: 120, b: 45 }).gcdLcm).toMatchObject({ a: 120, b: 45 });
  });

  it('une amorce absurde ne casse RIEN', () => {
    for (const seed of [null, 'x', 42, { mode: 'inconnu' }, { value: Infinity }, { a: NaN, b: 1 }]) {
      expect(() => S.createNumberLabData(seed)).not.toThrow();
      expect(S.MODES).toContain(S.createNumberLabData(seed).mode);
    }
  });
});

describe('les notes et l’entraînement', () => {
  it('une note se garde une seule fois (§55)', () => {
    let data = S.addNote(S.createNumberLabData(), 'كل عدد يقبل القسمة على 6 يقبل القسمة على 2 وعلى 3.');
    data = S.addNote(data, 'كل عدد يقبل القسمة على 6 يقبل القسمة على 2 وعلى 3.');
    expect(data.notes).toHaveLength(1);
  });

  it('une note vide n’existe pas, et les notes sont bornées', () => {
    expect(S.addNote(S.createNumberLabData(), '   ').notes).toHaveLength(0);
    let data = S.createNumberLabData();
    for (let i = 0; i < 50; i += 1) data = S.addNote(data, `note ${i}`);
    expect(data.notes).toHaveLength(S.MAX_NOTES);
  });

  it('§56 — on compte les résolues et les tentatives, RIEN d’autre', () => {
    const data = S.recordAttempt(S.recordAttempt(S.createNumberLabData(), { solved: true }), { hint: true });
    expect(data.practice).toEqual({ level: 1, solved: 1, attempts: 2, hintsUsed: 1 });
    expect(Object.keys(data.practice)).toHaveLength(4);
  });
});

describe('le document tient dans ce que le serveur accepte', () => {
  it('le PIRE cas reste très en dessous de la borne', () => {
    let data = S.createNumberLabData();
    data = S.patchMode(data, 'proportion', {
      rows: Array.from({ length: S.MAX_ROWS }, (_, i) => ({ x: -123456.789, y: 987654.321 - i })),
    });
    // Un arbre de factorisation complet et profond.
    let tree = { n: 2 };
    for (let i = 0; i < 20; i += 1) tree = { n: 2 ** (i + 2), left: tree, right: { n: 2 } };
    data = { ...data, primes: { ...data.primes, limit: 10000, factorTree: S.normalizeTree(tree) } };
    for (let i = 0; i < S.MAX_NOTES; i += 1) data = S.addNote(data, 'ن'.repeat(200) + i);

    const bytes = new TextEncoder().encode(JSON.stringify(S.serializeNumberLabData(data))).length;
    expect(bytes, `${bytes} octets`).toBeLessThan(20_000);
  });

  it('un document neuf pèse quelques centaines d’octets', () => {
    const bytes = new TextEncoder().encode(JSON.stringify(S.createNumberLabData())).length;
    expect(bytes).toBeLessThan(1_200);
  });
});

describe('l’instrument lui-même', () => {
  it('est défini, et son identité est stable', () => {
    expect(numberLabTool.id).toBe('numberLab');
    expect(numberLabTool.slug).toBe('nombres');
    expect(numberLabTool.schemaVersion).toBe(S.NUMBER_LAB_SCHEMA_VERSION);
    expect(typeof numberLabTool.summarize).toBe('function');
    expect(typeof numberLabTool.load).toBe('function');
  });
});
