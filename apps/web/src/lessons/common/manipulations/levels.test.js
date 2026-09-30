import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { MANIPULATION_TYPE_IDS, MANIPULATION_TYPES } from '@smarter-academy/core';
import * as levelsModule from './levels';
import { LEVELS, levelsFor, levelMatching, resolveManipulationLevels } from './levels';

/**
 * Le contrat À DEUX NIVEAUX de chaque manipulation (MANIPULATION_CONTRACT §7).
 * Un type ajouté au registre sans sa paire { beginner, advanced } échoue ici.
 */
describe('niveaux de manipulation — beginner / advanced, rien d’autre', () => {
  it('chaque type du registre a EXACTEMENT les deux niveaux', () => {
    for (const type of MANIPULATION_TYPE_IDS) {
      expect(Object.keys(LEVELS[type] ?? {}), type).toEqual(['beginner', 'advanced']);
    }
    expect(Object.keys(LEVELS).sort()).toEqual([...MANIPULATION_TYPE_IDS].sort());
  });

  it('l’ancienne échelle à quatre paliers n’existe plus', () => {
    expect(levelsModule.LEVEL_KEYS).toBeUndefined();
    const lesson = JSON.parse(readFileSync(new URL('../../../i18n/locales/ar/lesson.json', import.meta.url), 'utf8'));
    expect(lesson.manipulation.levels).toBeUndefined();
    expect(Object.keys(lesson.manipulation.level)).toEqual(expect.arrayContaining(['label', 'beginner', 'advanced', 'practiceTitle']));
  });

  it('les deux niveaux diffèrent, l’avancé demande plus, et cite le manuel', () => {
    for (const type of MANIPULATION_TYPE_IDS) {
      const { beginner, advanced } = LEVELS[type];
      expect(advanced.numbers, type).not.toEqual(beginner.numbers);
      const size = (n) => Math.max(...Object.values(n));
      expect(size(advanced.numbers), type).toBeGreaterThan(size(beginner.numbers));
      expect(advanced.source, type).toBe('textbook');
      expect(typeof advanced.ref, type).toBe('string');
      expect(['textbook', 'platform'], type).toContain(beginner.source);
    }
  });

  it('les nombres des niveaux respectent les bornes du registre', () => {
    for (const type of MANIPULATION_TYPE_IDS) {
      const bounds = MANIPULATION_TYPES[type].controls?.changeNumbers;
      if (!bounds) continue;
      for (const id of ['beginner', 'advanced']) {
        for (const [k, v] of Object.entries(LEVELS[type][id].numbers)) {
          if (!Array.isArray(bounds[k]) || v === 0) continue;
          expect(v, `${type}.${id}.${k}`).toBeGreaterThanOrEqual(bounds[k][0]);
          expect(v, `${type}.${id}.${k}`).toBeLessThanOrEqual(bounds[k][1]);
        }
      }
    }
  });

  it('la réglette des livres contient les marques du manuel, et le niveau avancé n’en propose pas d’autres', () => {
    for (const id of ['beginner', 'advanced']) {
      const lv = LEVELS['divisor-explorer-books'][id];
      expect(lv.range.min).toBeLessThan(lv.range.max);
      for (const m of lv.marks) expect(m >= lv.range.min && m <= lv.range.max, `${id} ${m}`).toBe(true);
      expect(lv.candidates, id).toBeUndefined();
    }
    expect(LEVELS['divisor-explorer-books'].advanced.marks).toEqual([26, 28]);
  });

  it('levelMatching reconnaît un niveau par ses nombres', () => {
    expect(levelMatching('coprime-explorer', { a: 27, b: 36 })).toBe('advanced');
    expect(levelMatching('coprime-explorer', { a: 17, b: 18 })).toBe('beginner');
    expect(levelMatching('coprime-explorer', { a: 22, b: 15 })).toBeNull();
    expect(levelsFor('inconnu')).toBeNull();
  });
});

describe('resolveManipulationLevels — les nombres de la leçon sont toujours un des deux niveaux', () => {
  it('des nombres propres à la leçon deviennent le niveau débutant', () => {
    const r = resolveManipulationLevels('common-divisors', { a: 28, b: 42 });
    expect(r.initial).toBe('beginner');
    expect(r.levels.beginner).toMatchObject({ numbers: { a: 28, b: 42 }, authored: true, source: 'lesson' });
    expect(r.levels.advanced.numbers).toEqual({ a: 65, b: 78 });
  });

  it('des nombres égaux au niveau avancé du type ouvrent sur l’avancé', () => {
    const r = resolveManipulationLevels('coprime-explorer', { a: 27, b: 36 });
    expect(r.initial).toBe('advanced');
    expect(r.levels.advanced).toMatchObject({ authored: true, source: 'textbook' });
    expect(r.levels.beginner.numbers).toEqual({ a: 17, b: 18 });
  });

  it('un niveau demandé l’emporte, un niveau inconnu retombe sur beginner', () => {
    expect(resolveManipulationLevels('factor-pairs', { n: 48 }, 'advanced').initial).toBe('advanced');
    expect(resolveManipulationLevels('factor-pairs', { n: 48 }, 'challenge').initial).toBe('beginner');
    expect(resolveManipulationLevels('inconnu', { n: 1 })).toBeNull();
  });
});
