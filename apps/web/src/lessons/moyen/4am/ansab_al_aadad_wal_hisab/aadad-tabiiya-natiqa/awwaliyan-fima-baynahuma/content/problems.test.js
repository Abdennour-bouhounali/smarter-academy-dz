import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const common = (a, b) => divisors(Math.min(a, b)).filter((d) => a % d === 0 && b % d === 0);
/** Les restes successifs de خوارزمية إقليدس sur (a ; b), a > b : [r1, r2, …, 0]. */
const euclidRemainders = (a, b) => { const rs = []; while (b) { const r = a % b; rs.push(r); a = b; b = r; } return rs; };
const stepsOf = (id, part) => PROBLEM[id].parts[part].steps;
const expectedOf = (id, part) => stepsOf(id, part).filter((s) => s.kind === 'numeric').map((s) => s.expected);
const linesOf = (id, part) => stepsOf(id, part).at(-1).lines.join(' ');

/** Chaque égalité « $a \times b + c = …$ » / « $a = b \times q + r$ » d'un texte, vérifiée. */
function checkEqualities(text) {
  const islands = [...text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
  let checked = 0;
  for (const raw of islands) {
    if (!raw.includes('=') || raw.includes('PGCD') || raw.includes('\\ldots') || /[a-z]/i.test(raw.replace(/\\times|\\neq/g, ''))) continue;
    const sides = raw.replace(/\\times/g, '*').split('=').map((s) => s.trim());
    const values = sides.map((s) => Function(`"use strict"; return (${s});`)());
    for (const v of values) expect(v, raw).toBe(values[0]);
    checked += 1;
  }
  return checked;
}

describe('les مسائل du درس 7 (أوليان فيما بينهما)', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test 7)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.id, m.slug, m.stage, m.estimatedMin])).toEqual([
      [4, '04', 'masala-1', 'practice_lab', 8], [5, '05', 'masala-2', 'practice_lab', 8], [6, '06', 'masala-3', 'practice_lab', 8],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ id: '07', number: 7, slug: 'itqan', stage: 'evaluation' });
    expect(LESSON_CONFIG.modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(LESSON_CONFIG.modules.reduce((t, m) => t + m.estimatedMin, 0)).toBe(70);
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(PROBLEMS.map((p) => p.id)).toEqual(['masala-1', 'masala-2', 'masala-3']);
    const situations = LESSON_CONFIG.resources.filter((r) => r.kind === 'situation');
    expect(situations.map((r) => [r.code, r.module])).toEqual([['masala-1', 4], ['masala-2', 5], ['masala-3', 6]]);
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('the data to sort hold a numeric decoy', () => {
    for (const p of PROBLEMS) expect(p.data.some((d) => !d.useful && /\d/.test(d.text)), p.id).toBe(true);
  });

  it('every equality written in explanations, options and solutions is true', () => {
    let n = 0;
    for (const p of PROBLEMS) for (const part of p.parts) for (const s of part.steps) {
      for (const t of [s.explain, s.prompt, ...(s.options ?? []), ...(s.lines ?? [])]) if (typeof t === 'string') n += checkEqualities(t);
    }
    expect(n).toBeGreaterThan(40);
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const start = 100, win = 50, lose = 20;
    // 1) 26 et 45 : diviseurs du plus petit confrontés à l'autre.
    expect(divisors(26)).toEqual([1, 2, 13, 26]);
    expect(common(26, 45)).toEqual([1]);
    expect(gcd(45, 26)).toBe(1);
    expect(expectedOf('masala-1', 0)).toEqual([divisors(26).length, div(45, 13).r, start + win]);
    expect(div(45, 13)).toEqual({ q: 3, r: 6 });
    // 2) 39 et 65, tous deux impairs, ont 13 en commun ; les règles 2, 3, 5 ne le voient pas.
    expect(39 % 2 && 65 % 2).toBeTruthy();
    for (const d of [2, 3, 5]) expect(39 % d === 0 && 65 % d === 0).toBe(false);
    expect(divisors(39)).toEqual([1, 3, 13, 39]);
    expect(common(39, 65)).toEqual([1, 13]);
    expect(gcd(65, 39)).toBe(13);
    expect(expectedOf('masala-1', 1)).toEqual([div(65, 3).r, div(65, 13).r, div(65, 39).r, gcd(65, 39)]);
    expect(PROBLEM['masala-1'].parts[1].steps.find((s) => s.ask === 0 && s.kind === 'choice').correct).toBe(0);
    // 3) avec 39 : seule 64 gagne.
    const cards = [52, 64, 78];
    expect(cards.filter((c) => gcd(c, 39) === 1)).toEqual([64]);
    expect(gcd(52, 39)).toBe(13);
    expect(gcd(78, 39)).toBe(39);
    const choose = stepsOf('masala-1', 2).find((s) => s.ask === 0);
    expect(choose.options[choose.correct]).toBe('64');
    expect(expectedOf('masala-1', 2)).toEqual([div(52, 13).r, div(64, 13).r, start - lose, start - lose + win]);
    expect((6 + 4) % 3).not.toBe(0);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    const novels = 91, comics = 120, gift = 14, pNovel = 1100, pComic = 650;
    // 1) 91 et 120 premiers entre eux : un seul lot possible.
    expect(euclidRemainders(comics, novels)).toEqual([29, 4, 1, 0]);
    expect(gcd(comics, novels)).toBe(1);
    expect(common(novels, comics)).toEqual([1]);
    expect(expectedOf('masala-2', 0)).toEqual(euclidRemainders(comics, novels).slice(0, 3));
    expect(comics % 7).not.toBe(0); // le distracteur « 7 حصص »
    expect(novels % 10).not.toBe(0); // le distracteur « 10 حصص »
    expect(novels % 12 === 0 && comics % 12 === 0).toBe(false); // le leurre « 12 موظّفًا »
    // 2) 105 et 120 : 5 commun (règle), PGCD 15.
    const novels2 = novels + gift;
    expect(novels2 % 5 === 0 && comics % 5 === 0).toBe(true);
    expect(novels2 % 2).not.toBe(0);
    const g = gcd(comics, novels2);
    expect(g).toBe(15);
    expect(expectedOf('masala-2', 1)).toEqual([novels2, ...euclidRemainders(comics, novels2), g]);
    // 3) contenu et valeur d'un lot.
    const perNovel = novels2 / g, perComic = comics / g;
    expect([perNovel, perComic]).toEqual([7, 8]);
    expect(expectedOf('masala-2', 2)).toEqual([perNovel, perComic, perNovel * pNovel, perComic * pComic, perNovel * pNovel + perComic * pComic]);
    expect(perNovel * pNovel + perComic * pComic).toBe(12900);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const a = 391, b = 323, c = 255, price = 120;
    // 1) le piège de ليلى : aucune des règles 2, 3, 5, 9 ne voit le diviseur commun 17.
    for (const d of [2, 3, 4, 5, 9, 10]) expect(a % d === 0 && b % d === 0, `règle ${d}`).toBe(false);
    expect(euclidRemainders(a, b)).toEqual([68, 51, 17, 0]);
    const g = gcd(a, b);
    expect(g).toBe(17);
    expect(expectedOf('masala-3', 0)).toEqual([...euclidRemainders(a, b), g]);
    expect(a % b).not.toBe(0); // « 323 يقسم 391 » est faux
    // 2) plus longue pièce et nombre de pièces.
    expect(expectedOf('masala-3', 1)).toEqual([g, a / g, b / g, a / g + b / g]);
    expect(a / g + b / g).toBe(42);
    // 3) troisième planche et recette.
    expect(c % g).toBe(0);
    const total = a / g + b / g + c / g;
    expect(expectedOf('masala-3', 2)).toEqual([c % g, total, total * price]);
    expect(total * price).toBe(6840);
  });

  it('the written solutions state the answers', () => {
    expect(linesOf('masala-1', 0)).toContain('150');
    expect(linesOf('masala-1', 1)).toContain('= 13');
    expect(linesOf('masala-1', 2)).toContain('130');
    expect(linesOf('masala-2', 1)).toContain('15 حصة');
    expect(linesOf('masala-2', 2)).toContain('12900 دج');
    expect(linesOf('masala-3', 0)).toContain('= 17');
    expect(linesOf('masala-3', 1)).toContain('42');
    expect(linesOf('masala-3', 2)).toContain('6840 دج');
  });
});
