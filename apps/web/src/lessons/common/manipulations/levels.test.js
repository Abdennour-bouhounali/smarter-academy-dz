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
      // Unité 3 de 1AM : les critères (`digit-cards`) se mesurent par le nombre de DIVISEURS à juger (la table va jusqu'à 48,
      // les cartes ne portent que des chiffres : la taille des nombres ne dit pas la difficulté).
      else if (type === 'digit-cards') expect(advanced.numbers.divisors.length, type).toBeGreaterThan(beginner.numbers.divisors.length);
      // Unité 11 de 1AM : `tile-yard` change de MODE, pas de nombres — la corde (aires libres) demande plus que les carreaux déplacés (aire fixe).
      else if (type === 'tile-yard') expect(['fence', 'rope'].indexOf(advanced.numbers.mode), type).toBeGreaterThan(['fence', 'rope'].indexOf(beginner.numbers.mode));
      // Unité 5 de 3AM : `equality-lanes` se mesure par le NOMBRE D'OPÉRATIONS à enchaîner (4 tâches d'une opération, puis 3 tâches de 1 + 2 + 2).
      else if (type === 'equality-lanes') {
        const ops = (n) => n.tasks.flat().length;
        expect(ops(advanced.numbers), type).toBeGreaterThan(ops(beginner.numbers));
      }
      // Unité 5 de 3AM : `term-ferry` se mesure par le NOMBRE DE TÂCHES (2 équations, puis 3 dont un coefficient négatif et un grand nombre).
      else if (type === 'term-ferry') expect(advanced.numbers.tasks.length, type).toBeGreaterThan(beginner.numbers.tasks.length);
      // Unité 3 de 2AM : `zero-probe` se mesure par la FINESSE du pas (1 puis 0,1) et le nombre de décimales des nombres à juger.
      else if (type === 'zero-probe') {
        const decimals = (n) => Math.max(...n.tasks.flatMap((t) => [t.a, t.lo, t.hi].filter(Boolean)).map((v) => (String(v).split(',')[1] ?? '').length));
        expect(decimals(advanced.numbers), type).toBeGreaterThan(decimals(beginner.numbers));
      }
      // Unité 5 de 2AM : `fourth-gauges` se mesure par ce que la main doit FAIRE SANS VOIR : au niveau متقدم toutes les balances sont voilées
      // (le nombre se calcule avant de lâcher), il y a plus de tâches, des trous dans les quatre cases et un pas plus fin.
      else if (type === 'fourth-gauges') {
        const covered = (n) => n.tasks.filter((tk) => tk.covered).length;
        expect(covered(advanced.numbers), type).toBe(advanced.numbers.tasks.length);
        expect(covered(beginner.numbers), type).toBe(0);
        expect(advanced.numbers.tasks.length, type).toBeGreaterThan(beginner.numbers.tasks.length);
        expect(new Set(advanced.numbers.tasks.map((tk) => tk.hole)).size, type).toBeGreaterThan(new Set(beginner.numbers.tasks.map((tk) => tk.hole)).size);
      }
      // Unité 6 de 3AM : `hundred-grid` se mesure par le NOMBRE DE TÂCHES et par les sortes demandées (le taux et le stock entier se CHERCHENT).
      else if (type === 'hundred-grid') {
        expect(advanced.numbers.tasks.length, type).toBeGreaterThan(beginner.numbers.tasks.length);
        expect(new Set(advanced.numbers.tasks.map((tk) => tk.kind)).has('whole'), type).toBe(true);
        expect(advanced.numbers.tasks.some((tk) => tk.carry), type).toBe(true);
      }
      // Unité 1 de 3AM : `elevator-reel` se mesure par la FINESSE du pas (1 puis 0,5), la PRÉDICTION écrite avant de voir (متقدم seul) et les missions où la main tient aussi la vitesse.
      else if (type === 'elevator-reel') {
        const stepOf = (n) => Number(String(n.step).replace(',', '.'));
        expect(stepOf(advanced.numbers), type).toBeLessThan(stepOf(beginner.numbers));
        expect(advanced.numbers.tasks.some((tk) => tk.kind === 'predict'), type).toBe(true);
        expect(beginner.numbers.tasks.some((tk) => tk.kind === 'predict'), type).toBe(false);
        expect(advanced.numbers.tasks.some((tk) => tk.kind === 'both'), type).toBe(true);
      }
      // Unité 2 de 3AM : `gear-crank` se mesure par le NOMBRE DE TÂCHES et par la PRÉDICTION écrite avant de partir (متقدم seul : manivelle bloquée, compteurs voilés).
      else if (type === 'gear-crank') {
        expect(advanced.numbers.tasks.length, type).toBeGreaterThan(beginner.numbers.tasks.length);
        expect(advanced.numbers.tasks.every((tk) => tk.predict), type).toBe(true);
        expect(beginner.numbers.tasks.some((tk) => tk.predict), type).toBe(false);
      }
      // Unité 6 de 3AM : `pin-rails` se mesure par le NOMBRE DE TÂCHES et par les LECTURES sur la droite (متقدم seul).
      else if (type === 'pin-rails') {
        expect(advanced.numbers.tasks.length, type).toBeGreaterThan(beginner.numbers.tasks.length);
        expect(advanced.numbers.tasks.filter((tk) => tk.mode === 'read').length, type).toBeGreaterThan(beginner.numbers.tasks.filter((tk) => tk.mode === 'read').length);
      }
      // Unité 4 de 3AM : `area-split` se mesure par le NOMBRE DE PARCELLES à décider (côté constant : 2 parcelles ; deux côtés à deux termes : 4,
      // dont le coin ôté deux fois) et par le nombre de coupures à faire.
      else if (type === 'area-split') {
        const pieces = (n) => Math.max(...n.tasks.map((tk) => [tk.h, tk.w].reduce((a, sd) => a * ((sd.m ? 1 : 0) + (sd.n ? 1 : 0)), 1)));
        expect(pieces(advanced.numbers), type).toBeGreaterThan(pieces(beginner.numbers));
        expect(advanced.numbers.world, type).toBe('plot');
      }
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
