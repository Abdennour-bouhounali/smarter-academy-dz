import { describe, it, expect } from 'vitest';
import programme from './official_programme_moyen.json';
import lessons4am from '../lessons_4am_2026_2027.json';
import {
  ITEMS, LINKS, LESSONS, THREADS, UNITS,
  getItem, getLesson, homeLessonOf, itemRank,
  reviewLinksForLesson, forwardLinksForLesson, noRebuildForLesson,
  earlierYearReviewFor, lessonCodeOfLearningPoint,
} from './learningNet.js';

/**
 * Le RÉSEAU DES الكفاءات (docs/architecture/LEARNING_NET.md).
 *
 * Ce que ces tests protègent :
 *  - le programme officiel reste la seule autorité : chaque item a un id
 *    stable et une leçon (existante ou prévue) qui l'enseigne ;
 *  - le réseau ne remonte jamais le temps : un lien va d'un item antérieur
 *    vers un item postérieur, et il n'a pas de cycle ;
 *  - la règle anti-doublon est lisible : un item qui prolonge ou répète un
 *    item antérieur le DIT, avec sa valeur ajoutée.
 */

const GRADES = ['1am', '2am', '3am', '4am'];
const segmentOf = (id) => getItem(id).segment; // eslint-disable-line no-unused-vars
const gradeOf = (id) => getItem(id).grade;
const segNumber = (id) => programme.segments.find((s) => s.id === segmentOf(id)).number;

describe('programme officiel — items', () => {
  it('a sept مقاطع par année, et des ids d’item uniques au format stable', () => {
    for (const g of GRADES) {
      expect(programme.segments.filter((s) => s.grade === g).map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    }
    const ids = ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of ITEMS) {
      expect(i.id).toMatch(/^[1-4]am\.m[1-7]\.(r\d{2}|x\d)$/);
      expect(i.id.startsWith(`${i.segment}.`)).toBe(true);
      expect(i.textAr.trim().length).toBeGreaterThan(5);
    }
  });

  it('numérote les موارد du plan 1..n sans trou, dans l’ordre officiel', () => {
    for (const s of programme.segments) {
      const nums = ITEMS.filter((i) => i.segment === s.id && i.origin === 'plan-2022').map((i) => i.number);
      expect(nums).toEqual(nums.map((_, k) => k + 1));
    }
  });
});

describe('réseau — liens', () => {
  it('ne relie que des items qui existent, jamais un item à lui-même', () => {
    for (const k of LINKS) {
      expect(getItem(k.from), k.from).not.toBeNull();
      expect(getItem(k.to), k.to).not.toBeNull();
      expect(k.from).not.toBe(k.to);
      expect(['requires', 'extends', 'consolidates']).toContain(k.type);
    }
  });

  it('ne remonte jamais le temps : année puis مقطع de « from » ≤ ceux de « to »', () => {
    for (const k of LINKS) {
      const gf = GRADES.indexOf(gradeOf(k.from));
      const gt = GRADES.indexOf(gradeOf(k.to));
      expect(gf, `${k.from} → ${k.to}`).toBeLessThanOrEqual(gt);
      if (gf === gt) expect(segNumber(k.from), `${k.from} → ${k.to}`).toBeLessThanOrEqual(segNumber(k.to));
      // Prolonger ou consolider, c'est revenir sur un item STRICTEMENT antérieur.
      if (k.type !== 'requires') expect(itemRank(k.from)).toBeLessThan(itemRank(k.to));
    }
  });

  it('est sans cycle (tous types confondus)', () => {
    const out = new Map(ITEMS.map((i) => [i.id, []]));
    for (const k of LINKS) out.get(k.from).push(k.to);
    const state = new Map();
    const visit = (id, path) => {
      if (state.get(id) === 'done') return;
      expect(state.get(id), `cycle : ${[...path, id].join(' → ')}`).not.toBe('open');
      state.set(id, 'open');
      for (const next of out.get(id)) visit(next, [...path, id]);
      state.set(id, 'done');
    };
    for (const i of ITEMS) visit(i.id, []);
  });

  it('dit la valeur ajoutée de chaque prolongement, et la nature de chaque répétition', () => {
    for (const k of LINKS.filter((l) => l.type === 'extends')) expect(k.addedValueAr?.trim().length, k.to).toBeGreaterThan(5);
    for (const k of LINKS.filter((l) => l.type === 'consolidates')) expect(k.noteAr?.trim().length, k.to).toBeGreaterThan(5);
    // Un item repart d'UNE base au plus : sinon « ce qu'il ajoute » n'a plus de sens.
    const based = LINKS.filter((l) => l.type !== 'requires').map((l) => l.to);
    expect(new Set(based).size).toBe(based.length);
  });

  it('range chaque item dans exactement un fil conceptuel', () => {
    const all = THREADS.flatMap((t) => t.items);
    expect(new Set(all).size).toBe(all.length);
    expect(new Set(all)).toEqual(new Set(ITEMS.map((i) => i.id)));
  });
});

describe('leçons — existantes et prévues', () => {
  it('donne à CHAQUE item officiel une leçon d’accueil (existante ou prévue)', () => {
    const orphans = ITEMS.filter((i) => !homeLessonOf(i.id)).map((i) => i.id);
    expect(orphans).toEqual([]);
  });

  it('couvre tout le programme 4AM avec des leçons qui existent', () => {
    const items4am = ITEMS.filter((i) => i.grade === '4am');
    for (const i of items4am) expect(homeLessonOf(i.id)?.status, i.id).toBe('available');
  });

  it('fait déclarer à chaque leçon 4AM (hors synthèse) des items de son année — ou un RAPPEL nommé', () => {
    // Une leçon de RAPPEL (le manuel reprend une notion d'une année antérieure
    // sans item 4AM propre) déclare l'item d'origine. La liste est fermée : un
    // nouveau rappel est une décision, pas un glissement.
    const RECALL_LESSONS = ['muadala-ula'];
    const recalls = [];
    for (const l of lessons4am.lessons) {
      if (l.kind === 'synthesis') {
        expect(l.programmeItems ?? []).toEqual([]);
        continue;
      }
      expect(l.programmeItems?.length, l.code).toBeGreaterThan(0);
      if (!l.programmeItems.some((id) => gradeOf(id) === '4am')) recalls.push(l.code);
    }
    expect(recalls).toEqual(RECALL_LESSONS);
  });

  it('a des codes de leçon uniques, prévues comprises', () => {
    const codes = LESSONS.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const l of LESSONS) expect(l.code).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('range chaque leçon dans SON année, une synthèse en fin de chaque unité', () => {
    for (const u of UNITS) {
      const lessons = LESSONS.filter((l) => l.unit === u.code);
      expect(lessons.length, u.code).toBeGreaterThan(1);
      expect(lessons.at(-1)).toMatchObject({ code: u.synthesisLessonCode, kind: 'synthesis' });
      for (const l of lessons) {
        expect(l.grade).toBe(u.grade);
        // Une leçon de RAPPEL 4AM déclare l'item d'une année antérieure (test ci-dessus) ; ailleurs, l'année de l'item.
        if (u.grade !== '4am') for (const id of l.programmeItems) expect(gradeOf(id), `${l.code} › ${id}`).toBe(u.grade);
      }
    }
  });

  it('n’a plus de couche « prévue » dans le réseau : les leçons 1AM–3AM sont au catalogue, à générer', async () => {
    const net = (await import('./learning_net_moyen.json')).default;
    expect(net.plannedLessons).toBeUndefined();
    expect(net.plannedUnits).toBeUndefined();
    for (const g of ['1am', '2am', '3am']) {
      expect(LESSONS.filter((l) => l.grade === g).length, g).toBeGreaterThan(50);
      expect(UNITS.filter((u) => u.grade === g).length, g).toBeGreaterThan(10);
    }
  });

  it('respecte l’ordre des années : la leçon d’accueil d’un prérequis n’est jamais d’une année postérieure', () => {
    for (const k of LINKS) {
      const a = homeLessonOf(k.from);
      const b = homeLessonOf(k.to);
      expect(GRADES.indexOf(a.grade), `${k.from} (${a.code}) → ${k.to} (${b.code})`).toBeLessThanOrEqual(GRADES.indexOf(b.grade));
    }
  });

  it('respecte l’ordre du manuel en 4AM (leçons publiées)', () => {
    // Dans une année, l'ordre est celui du manuel. Pour les leçons PRÉVUES, un prérequis de la même année placé
    // plus loin dans le manuel est un « renvoi en avant » LISTÉ (GENERATION_QUEUE.md) : la leçon le rappelle
    // elle-même. Pour les leçons publiées (4AM), aucun renvoi en avant n'est admis.
    const pos = new Map(LESSONS.map((l, k) => [l.code, k]));
    for (const k of LINKS) {
      const a = homeLessonOf(k.from);
      const b = homeLessonOf(k.to);
      // 1AM–3AM sont générées le long de la file (les « renvois en avant » sont listés, ex. hasil-qisma-kasr → kusur-ashriya-kitaba) :
      // la règle ne vaut que pour les leçons 4AM, écrites d'un bloc dans l'ordre du manuel.
      if (a.grade !== '4am' || b.grade !== '4am' || a.status !== 'available' || b.status !== 'available') continue;
      expect(pos.get(a.code), `${k.from} (${a.code}) → ${k.to} (${b.code})`).toBeLessThanOrEqual(pos.get(b.code));
    }
  });
});

describe('résolveur — navigation', () => {
  it('renvoie la leçon sur la racine carrée vers فيثاغورس (3AM) et les puissances (3AM)', () => {
    const groups = reviewLinksForLesson('jidhr-tarbii');
    const items = groups.flatMap((g) => g.items.map((i) => i.id));
    expect(items).toContain('3am.m4.r03');
    expect(items).toContain('3am.m3.r06');
    const pyth = groups.find((g) => g.items.some((i) => i.id === '3am.m4.r03'));
    // khassiyat-fitaghuras est publiée depuis 2026-10-20 (phase 3, file A entrée 2) : le lien « راجع » mène à une leçon disponible.
    expect(pyth.lesson).toMatchObject({ code: homeLessonOf('3am.m4.r03').code, grade: '3am', status: 'available' });
  });

  it('n’envoie jamais une leçon vers elle-même, et groupe du plus ancien au plus récent', () => {
    for (const l of LESSONS) {
      const groups = reviewLinksForLesson(l.code);
      for (const g of groups) expect(g.lesson?.code).not.toBe(l.code);
      const ranks = groups.flatMap((g) => g.items.map((i) => itemRank(i.id)));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it('montre où sert une leçon de 1AM jusqu’en 4AM', () => {
    const forward = forwardLinksForLesson(homeLessonOf('1am.m3.r02').code);
    expect(forward.map((g) => g.lesson.code)).toContain('qasim-adad-tabii');
  });

  it('dit à « اختزال كسر » ce qu’il ne doit pas reconstruire', () => {
    const rules = noRebuildForLesson('ikhtizal-kasr');
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatchObject({ type: 'extends', base: { id: '1am.m5.r02' }, baseLesson: { code: homeLessonOf('1am.m5.r02').code } });
    expect(rules[0].addedValueAr).toBeTruthy();
    // la leçon de base existe au catalogue, quel que soit son avancement (publiée le 2026-10-14 : ikhtizal-kitaba-kasriya)
    expect(['planned', 'coming_soon', 'available']).toContain(getLesson(homeLessonOf('1am.m5.r02').code).status);
  });

  it('« راجع » après une erreur : de la الكفاءة à sa leçon, puis aux SEULES années antérieures', () => {
    expect(lessonCodeOfLearningPoint('4am_jidhr-tarbii_P1')).toBe('jidhr-tarbii');
    expect(lessonCodeOfLearningPoint('4am_n-existe-pas_P1')).toBeNull();
    const groups = earlierYearReviewFor({ learningPointCode: '4am_jidhr-tarbii_P1' });
    expect(groups.map((g) => g.lesson.code)).toEqual(expect.arrayContaining([homeLessonOf('3am.m4.r03').code]));
    for (const g of groups) for (const i of g.items) expect(['1am', '2am', '3am']).toContain(i.grade);
    // Sans الكفاءة reconnue : la leçon de l'exercice.
    expect(earlierYearReviewFor({ learningPointCode: null, lessonCode: 'jidhr-tarbii' })).toEqual(groups);
    // 1AM n'a pas d'année antérieure dans le cycle.
    expect(earlierYearReviewFor({ lessonCode: LESSONS.find((l) => l.grade === '1am').code })).toEqual([]);
    expect(earlierYearReviewFor({})).toEqual([]);
  });
});
