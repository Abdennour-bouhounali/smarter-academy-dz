import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { MANIPULATION_TYPE_IDS, MANIPULATION_TYPES } from '@smarter-academy/core/curriculum/manipulationTypes.js';
import * as linearSystem from '@smarter-academy/core/arithmetic/linearSystem.js';
import * as levelsModule from './levels';
import { LEVELS, levelsFor, levelMatching, resolveManipulationLevels } from './levels';
import { STORIES } from './logic/storyBars';

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
    const manipulation = JSON.parse(readFileSync(new URL('../../../i18n/locales/ar/lesson.manipulation.json', import.meta.url), 'utf8'));
    expect(manipulation.levels).toBeUndefined();
    expect(Object.keys(manipulation.level)).toEqual(expect.arrayContaining(['label', 'beginner', 'advanced', 'practiceTitle']));
  });

  it('les deux niveaux diffèrent, l’avancé demande plus, et cite le manuel', () => {
    for (const type of MANIPULATION_TYPE_IDS) {
      const { beginner, advanced } = LEVELS[type];
      expect(advanced.numbers, type).not.toEqual(beginner.numbers);
      // Une expression algébrique (unité 3, `expr: '3x-1|3+x'`) se mesure par son
      // nombre de termes plus sa plus haute puissance : plus de zones à porter,
      // ou des carrés à faire apparaître, c'est une demande plus lourde.
      const algebraic = (e) => (e.match(/[^+\-|]+/g) ?? []).length + Math.max(1, ...[...e.matchAll(/\^(\d)/g)].map((m) => Number(m[1])));
      // Une jumla (unité 5, `system: '2x+y=7|3x-2y=4,2'`) se mesure par ce qu'elle demande à la main :
      // coefficients autres que ±1 après réduction, parenthèses à développer, décimaux, solution non
      // entière, et la taille des constantes (chiffres de la plus grande).
      const jumla = (v) => {
        const sys = linearSystem.system(...v.split('|'));
        const nonUnit = sys.flatMap((e) => [e.a, e.b]).filter((c) => Math.abs(c.n) !== c.d).length;
        const sol = linearSystem.classify(sys);
        const fractional = sol.kind === 'unique' && (sol.x.d !== 1 || sol.y.d !== 1) ? 1 : 0;
        const digits = Math.max(...sys.map((e) => String(Math.abs(Math.round(e.c.n / e.c.d))).length));
        return nonUnit + (v.match(/\(/g) ?? []).length + (v.match(/,/g) ?? []).length + fractional + digits;
      };
      const scalar = (v) => (typeof v !== 'string' ? v : v.includes('=') && v.includes('|') ? jumla(v) : algebraic(v));
      // Unité 10 : des listes et des objets (angles du tableau, cibles { ratio, value: '7/3' }) se mesurent par leurs
      // feuilles ; À L'INTÉRIEUR d'eux, un rapport écrit « 7/3 » ou « 0,52 » vaut le plus grand de ses entiers.
      const nested = (v) => (Array.isArray(v) ? Math.max(...v.map(nested))
        : v && typeof v === 'object' ? Math.max(...Object.values(v).map(nested))
          : typeof v === 'string' && /^\d+(?:[.,]\d+)?(?:\/\d+)?$/.test(v) ? Math.max(...v.split(/[/.,]/).map(Number))
            : scalar(v));
      const size = (n) => Math.max(...Object.values(n).map((v) => (v && typeof v === 'object' ? nested(v) : scalar(v))));
      // Unité 2 de 1AM : une HISTOIRE (`story: 'act1'`) se mesure par son nombre d'items (logic/storyBars.js).
      if (type === 'story-bars') expect(STORIES[advanced.numbers.story].items.length, type).toBeGreaterThan(STORIES[beginner.numbers.story].items.length);
      else expect(size(advanced.numbers), type).toBeGreaterThan(size(beginner.numbers));
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
