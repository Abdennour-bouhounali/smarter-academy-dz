import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildOrder } from '../../../../scripts/generate-lab-order.mjs';
import ORDER from './lessonOrder.generated.json';
import { placeOf, isReached, GRADES } from './order';
import { TOOLS, toolsFor, hasLab, clampFor } from './registry';
import {
  rowsLayout,
  jumpsOf,
  sentences,
  digitRules,
  rollDigit,
  euclidSquares,
  euclidLines,
  divisorPairs,
  divisorsOf,
  gcd,
  plankRows,
  bracketOf,
  twoLists,
  QUESTS,
  observe,
  luckyPair,
} from './logic';

const catalogue = (g) =>
  JSON.parse(
    readFileSync(
      new URL(`../../../../../../packages/core/curriculum/dz/lessons_${g}_2026_2027.json`, import.meta.url),
      'utf8',
    ),
  ).lessons;

describe('مختبري — the order of the lessons', () => {
  it('is the catalogue order of the four grades (run `npm run generate:lab-order` when this fails)', () => {
    expect(ORDER).toEqual(buildOrder());
    expect(GRADES.reduce((n, g) => n + ORDER[g].length, 0)).toBeGreaterThan(250);
  });
  it('puts every earlier grade before a later one, and a lesson before the next of its unit', () => {
    expect(isReached('qisma-iqlidiya-baqi', 'qasim-adad-tabii')).toBe(true); // 1AM before 4AM
    expect(isReached('qasim-adad-tabii', 'qasim-adad-tabii')).toBe(true);
    expect(isReached('bahth-pgcd', 'qasim-adad-tabii')).toBe(false); // a later lesson of the same unit
    expect(isReached('qasim-adad-tabii', 'qisma-iqlidiya-baqi')).toBe(false);
    expect(isReached('unknown-lesson', 'qasim-adad-tabii')).toBe(false);
    expect(placeOf('jidaa-adadayn-nisbiyayn').grade).toBe('3am');
  });
});

describe('مختبري — the instruments a lesson may show', () => {
  it('tags every instrument with a real lesson and its exact catalogue title, a module and quests', () => {
    const titles = new Map(
      GRADES.flatMap((g) => catalogue(g).map((l) => [l.code, typeof l.title === 'string' ? l.title : l.title.ar])),
    );
    for (const t of TOOLS) {
      expect(titles.get(t.lesson), `${t.id} → ${t.lesson}`).toBe(t.lessonTitle);
      expect(typeof t.load).toBe('function');
      expect(QUESTS[t.id].length).toBeGreaterThanOrEqual(2);
      expect(t.range.a[0]).toBeLessThan(t.range.a[1]);
    }
    expect(new Set(TOOLS.map((t) => t.id)).size).toBe(TOOLS.length);
  });

  it('the first lesson of 4AM: its three instruments, the cabinet of 1AM, and NOTHING of the lessons after it', () => {
    const lab = toolsFor('qasim-adad-tabii');
    expect(lab.mine.map((t) => t.id)).toEqual(['rows', 'jumps', 'sentences']);
    expect(lab.cabinet.map((g) => g.grade)).toEqual(['1am', '2am']);
    expect(lab.cabinet[0].lessons.map((l) => [l.code, l.tools.map((t) => t.id)])).toEqual([
      ['qisma-iqlidiya-baqi', ['paper']],
      ['qawaid-qabiliyat-qisma', ['rules']],
    ]);
    expect(lab.cabinet[1].lessons.map((l) => [l.code, l.tools.map((t) => t.id)])).toEqual([
      ['qisma-iqlidiya-hasr', ['bracket']],
    ]);
    expect(lab.all.map((t) => t.id)).not.toContain('euclid');
    expect(lab.all.map((t) => t.id)).not.toContain('divisors');
  });

  it('the PGCD lesson: its own instrument, and every instrument of the lessons before it — of this year and of the earlier ones', () => {
    const lab = toolsFor('bahth-pgcd');
    expect(lab.mine.map((t) => t.id)).toEqual(['euclid']);
    expect(lab.cabinet.map((g) => g.grade)).toEqual(['1am', '2am', '4am']);
    expect(lab.cabinet[2].lessons.map((l) => l.code)).toEqual([
      'qasim-adad-tabii',
      'qawasim-adad-tabii',
      'khawass-qawasim',
      'qasim-mushtarak-akbar',
      'tayin-pgcd',
    ]);
    expect(lab.all.length).toBe(TOOLS.length);
  });

  it('« تعيين القاسم المشترك الأكبر »: its own instrument (the two lists BUILT), lesson 4’s beside it in the cabinet', () => {
    const lab = toolsFor('tayin-pgcd');
    expect(lab.mine.map((t) => t.id)).toEqual(['lists']);
    expect(lab.cabinet.find((g) => g.grade === '4am').lessons.map((l) => l.code)).toContain('qasim-mushtarak-akbar');
    expect(lab.all.map((t) => t.id)).not.toContain('euclid'); // lesson 6
    expect(toolsFor('qasim-mushtarak-akbar').all.map((t) => t.id)).not.toContain('lists');
    const before = toolsFor('tayin-pgcd', { earlierOnly: true });
    expect(before.all.map((t) => t.id)).not.toContain('lists'); // never before the lesson: it does what the lesson finds
    expect(before.all.map((t) => t.id)).toContain('common');
    // its tile names no key of the lesson (BATCH_2_DESIGN.md §7)
    const tile = TOOLS.find((t) => t.id === 'lists');
    expect(`${tile.name} ${tile.hint}`).not.toMatch(/احصر|قاطع|نتائج مباشرة|يقسم الأصغر/);
  });

  it('« خواص قواسم عدد طبيعي »: its own instrument, and the instruments of the two 4AM lessons before it', () => {
    const lab = toolsFor('khawass-qawasim');
    expect(lab.mine.map((t) => t.id)).toEqual(['planks']);
    expect(lab.cabinet.find((g) => g.grade === '4am').lessons.map((l) => l.code)).toEqual([
      'qasim-adad-tabii',
      'qawasim-adad-tabii',
    ]);
    expect(lab.all.map((t) => t.id)).not.toContain('common');
    expect(toolsFor('qawasim-adad-tabii').all.map((t) => t.id)).not.toContain('planks');
  });

  it('the division road: each of its three lessons has an instrument of its own, and finds the ones before it', () => {
    expect(toolsFor('qisma-iqlidiya-baqi').mine.map((t) => t.id)).toEqual(['paper']);
    expect(toolsFor('qisma-iqlidiya-baqi').cabinet).toEqual([]);
    expect(toolsFor('qawaid-qabiliyat-qisma').mine.map((t) => t.id)).toEqual(['rules']);
    const hasr = toolsFor('qisma-iqlidiya-hasr');
    expect(hasr.mine.map((t) => t.id)).toEqual(['bracket']);
    expect(hasr.cabinet.map((g) => [g.grade, g.lessons.map((l) => l.code)])).toEqual([
      ['1am', ['qisma-iqlidiya-baqi', 'qawaid-qabiliyat-qisma']],
    ]);
    expect(toolsFor('qawaid-qabiliyat-qisma').all.map((t) => t.id)).not.toContain('bracket'); // 2AM comes later
  });

  it('opened BEFORE the lesson (« عُدّة الانطلاق », `earlierOnly`): only the instruments of the lessons before it', () => {
    const before = toolsFor('qasim-mushtarak-akbar', { earlierOnly: true });
    expect(before.mine).toEqual([]);
    expect(before.all.map((t) => t.id)).not.toContain('common'); // « 🤝 القواسم المشتركة » names the lesson's first key
    expect(before.all.map((t) => t.id)).toContain('divisors');
    expect(before.cabinet).toEqual(toolsFor('qasim-mushtarak-akbar').cabinet); // the cabinet is the same
    for (const g of GRADES)
      for (const code of ORDER[g])
        for (const t of toolsFor(code, { earlierOnly: true }).all)
          expect(t.lesson, `${t.id} in ${code}`).not.toBe(code);
  });

  it('never shows an instrument of the future, for ANY lesson of the cycle', () => {
    for (const g of GRADES)
      for (const code of ORDER[g]) {
        const lab = toolsFor(code);
        for (const t of lab.all)
          expect(placeOf(t.lesson).rank, `${t.id} in ${code}`).toBeLessThanOrEqual(placeOf(code).rank);
        expect(lab.cabinet.flatMap((x) => x.lessons).every((l) => l.code !== code)).toBe(true);
      }
    expect(hasLab('kitabat-adad-tabii')).toBe(false); // the very first lesson of 1AM: nothing before it yet
    expect(hasLab('qawaid-qabiliyat-qisma')).toBe(true);
    expect(hasLab('silsila-bidun-aqwas')).toBe(true); // 2AM finds the tools of 1AM
    expect(toolsFor('nope')).toEqual({ mine: [], cabinet: [], all: [] });
  });

  it('brings the shared numbers inside the ranges of the instrument', () => {
    const rows = TOOLS.find((t) => t.id === 'rows');
    expect(clampFor(rows, 756, 36)).toEqual({ a: 144, b: 24 });
    expect(
      clampFor(
        TOOLS.find((t) => t.id === 'paper'),
        756,
        1,
      ),
    ).toEqual({ a: 756, b: 2 });
  });
});

describe('مختبري — the mathematics the instruments draw', () => {
  it('lays a counters in rows of b: q full rows, r counters left', () => {
    for (let a = 1; a <= 144; a += 5)
      for (let b = 1; b <= 24; b += 1) {
        const L = rowsLayout(a, b);
        expect(L.cells.length).toBe(a);
        expect(L.cells.filter((c) => c.rest).length).toBe(a % b);
        expect(L.q * b + L.r).toBe(a);
        expect(Math.max(...L.cells.map((c) => c.col))).toBeLessThan(b);
      }
  });
  it('jumps of b from 0: lands on the flag exactly when b divides a', () => {
    expect(jumpsOf(42, 6)).toEqual({ q: 7, r: 0, landings: [6, 12, 18, 24, 30, 36, 42], hit: true, over: null });
    expect(jumpsOf(42, 5).landings.at(-1)).toBe(40);
    expect(jumpsOf(42, 5).over).toBe(45);
    expect(jumpsOf(3, 5).landings).toEqual([]);
  });
  it('the four sentences are true together or false together, with a proof that is true', () => {
    expect(sentences(42, 6).ok).toBe(true);
    expect(sentences(42, 6).proof).toBe('$42 = 6 \\times 7$');
    expect(sentences(42, 5).ok).toBe(false);
    expect(sentences(42, 5).proof).toContain('42 = 5 \\times 8 + 2');
    expect(sentences(6, 42).proof).toContain('6 < 42');
    expect(sentences(42, 6).list).toHaveLength(4);
  });
  it('reads the rules of divisibility on the digits, never against the truth', () => {
    for (let n = 0; n <= 9999; n += 7)
      for (const r of digitRules(n)) expect(r.ok, `${n} by ${r.by}`).toBe(n % r.by === 0);
    expect(digitRules(756).find((r) => r.by === 9).reads).toBe('مجموع الأرقام 18: مضاعف للعدد 9');
    expect(digitRules(756).find((r) => r.by === 4).digits).toEqual([1, 2]);
    expect(rollDigit(756, 0, 1, 3)).toBe(856);
    expect(rollDigit(756, 2, -1, 3)).toBe(755);
    expect(rollDigit(900, 0, 1, 3)).toBe(0);
    expect(rollDigit(7, 0, -1, 2)).toBe(97);
  });
  it('Euclid by squares: the squares tile the rectangle exactly and the last side is the PGCD', () => {
    for (let a = 1; a <= 60; a += 3)
      for (let b = 1; b <= 60; b += 4) {
        const e = euclidSquares(a, b);
        expect(
          e.squares.reduce((t, s) => t + s.side * s.side, 0),
          `${a}×${b}`,
        ).toBe(a * b);
        expect(e.pgcd).toBe(gcd(a, b));
        const lines = euclidLines(a, b);
        expect(lines.at(-1).r).toBe(0);
        expect(lines.at(-1).b).toBe(gcd(a, b));
        for (const l of lines) expect(l.b * l.q + l.r).toBe(l.a);
      }
    expect(euclidSquares(48, 18).squares.map((s) => s.side)).toEqual([18, 18, 12, 6, 6]);
  });
  it('lays one plank along the six lengths: what it fills is computed, and a plank that fills both numbers fills them all', () => {
    const bad = [];
    for (let a = 1; a <= 60; a += 1)
      for (let b = 1; b <= 60; b += 1)
        for (let d = 1; d <= 60; d += 1) {
          const rows = plankRows(a, b, d);
          const [big, small] = [Math.max(a, b), Math.min(a, b)];
          const want = [a, b, a + b, big - small, big % small, 3 * a];
          const ok =
            rows.map((r) => r.id).join() === 'a,b,sum,diff,rest,triple' &&
            rows.every(
              (r, i) => r.n === want[i] && r.planks * d + r.left === r.n && r.left < d && r.fits === (r.n % d === 0),
            ) &&
            (!(rows[0].fits && rows[1].fits) || rows.every((r) => r.fits)) &&
            (!rows[0].fits || rows[5].fits);
          if (!ok) bad.push(`${a} ${b} ${d}`);
        }
    expect(bad).toEqual([]);
    expect(plankRows(22, 20, 7).map((r) => r.fits)).toEqual([false, false, true, false, false, false]); // the sum alone
    expect(plankRows(35, 21, 7)[4].label).toBe('35 = 21 × 1 + 14');
    expect(plankRows(21, 35, 7)[3].label).toBe('35 − 21 = 14');
  });
  it('lays n planks of b along a: what is left or what passes, the full planks and the planks needed — for every pair', () => {
    const bad = [];
    for (let a = 1; a <= 200; a += 1)
      for (let b = 1; b <= 60; b += 1) {
        const q = Math.floor(a / b);
        for (let n = -2; n <= q + 3; n += 1) {
          const x = bracketOf(a, b, n);
          const k = Math.max(0, Math.min(q + 1, n));
          const ok =
            x.q === q &&
            x.r === a - q * b &&
            x.top === q + 1 &&
            x.n === k &&
            x.laid === k * b &&
            (k * b <= a ? x.left === a - k * b && x.over === 0 : x.left === null && x.over === k * b - a) &&
            x.exact === (k * b === a) &&
            // the full planks do not pass a, one more does; the planks needed cover a, one fewer does not
            q * b <= a &&
            (q + 1) * b > a &&
            x.need * b >= a &&
            (x.need - 1) * b < a &&
            (x.r === 0 ? x.need === q : x.need === q + 1);
          if (!ok) bad.push(`${a} ${b} ${n}`);
        }
      }
    expect(bad).toEqual([]);
    expect(bracketOf(438, 16, 27)).toMatchObject({ q: 27, r: 6, left: 6, over: 0, need: 28 });
    expect(bracketOf(438, 16, 28)).toMatchObject({ left: null, over: 10 });
    expect(bracketOf(438, 16, 99).n).toBe(28); // never more than one plank past the full ones
    expect(bracketOf(9, 14, 5)).toMatchObject({ q: 0, top: 1, n: 1, over: 5, need: 1 }); // a shorter than one plank
    expect(bracketOf(9999, 2, 4999).left).toBe(1);
  });
  it('the two lists: written by pairs up to the last number to try, then what is in both and the greatest', () => {
    const open = twoLists(40, 56, 0);
    expect([open.A.all, open.B.all, open.done, open.step]).toEqual([[], [], false, null]);
    expect(open.steps).toBe(7); // 7 × 7 = 49 ≤ 56; 8 × 8 = 64 > 56
    const four = twoLists(40, 56, 4);
    expect(four.A.smalls).toEqual([1, 2, 4]);
    expect(four.A.partners).toEqual([40, 20, 10]);
    expect(four.A.all).toEqual([1, 2, 4, 10, 20, 40]);
    expect(four.step).toEqual({ d: 4, a: { d: 4, q: 10, r: 0 }, b: { d: 4, q: 14, r: 0 } });
    expect(four.common).toEqual([]); // nothing is read before both lists are closed
    const six = twoLists(40, 56, 6);
    expect(six.A.done).toBe(true); // 7 × 7 > 40
    expect(six.B.done).toBe(false);
    const seven = twoLists(40, 56, 7);
    expect(seven.step).toEqual({ d: 7, a: null, b: { d: 7, q: 8, r: 0 } }); // 40 is no longer tried
    expect(seven.done).toBe(true);
    expect(seven.A.all).toEqual([1, 2, 4, 5, 8, 10, 20, 40]);
    expect(seven.B.all).toEqual([1, 2, 4, 7, 8, 14, 28, 56]);
    expect([seven.common, seven.g]).toEqual([[1, 2, 4, 8], 8]);
    // a square root is its own partner: written once
    expect(twoLists(36, 36, 6).A.all).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
    expect(twoLists(1, 1, 1)).toMatchObject({ done: true, common: [1], g: 1 });
    // for every pair the instrument can show: closed lists ARE the divisors, the greatest in both IS the PGCD, and the
    // lists close at the last number whose square does not pass the greater
    for (let a = 1; a <= 120; a += 1)
      for (let b = 1; b <= 120; b += 7) {
        const L = twoLists(a, b, Math.floor(Math.sqrt(Math.max(a, b))));
        expect(L.done).toBe(true);
        expect(L.A.all).toEqual(divisorsOf(a));
        expect(L.B.all).toEqual(divisorsOf(b));
        expect(L.g).toBe(gcd(a, b));
        expect(L.A.all.length).toBeLessThanOrEqual(16); // 16 slots in the drawing
        expect(twoLists(a, b, L.steps - 1).done).toBe(false); // one number fewer: a list is still open
      }
  });

  it('pairs every divisor with its partner', () => {
    expect(divisorPairs(36)).toEqual([
      [1, 36],
      [2, 18],
      [3, 12],
      [4, 9],
      [6, 6],
    ]);
    expect(divisorsOf(13)).toEqual([1, 13]);
  });
});

describe('مختبري — « جرّب »', () => {
  it('ticks a quest only when the student has MADE the thing', () => {
    const seen = new Set();
    expect(observe('rows', { a: 42, b: 5 }, seen)).toEqual([]);
    expect(observe('rows', { a: 42, b: 6 }, seen)).toEqual(['zero']);
    expect(observe('rows', { a: 42, b: 6 }, seen)).toEqual([]); // once
    expect(observe('rows', { a: 42, b: 7 }, seen)).toEqual(['two']);
    expect(observe('rows', { a: 41, b: 6 }, seen)).toEqual(['max']);
    expect(observe('rows', { a: 42, b: 1 }, new Set())).toEqual([]); // rows of one counter prove nothing
    expect(observe('jumps', { a: 41, b: 5 }, new Set())).toEqual(['miss1']); // lands on 40, one step before the flag
    expect(observe('jumps', { a: 44, b: 5 }, new Set())).toEqual([]);
    expect(observe('sentences', { a: 12, b: 12, swapped: true }, new Set())).toEqual(['swap']);
    expect(observe('divisors', { a: 36, found: [1, 2, 3, 4, 6, 9, 12, 18, 36] }, new Set())).toEqual(['all', 'odd']);
    expect(observe('divisors', { a: 36, found: [1, 2, 3] }, new Set())).toEqual([]);
    expect(observe('euclid', { a: 48, b: 18, cut: 5 }, new Set())).toEqual(['one', 'three']);
    expect(observe('euclid', { a: 48, b: 18, cut: 4 }, new Set())).toEqual([]);
    expect(observe('rules', { a: 180 }, new Set())).toEqual(['three', 'nine', 'all']);
    expect(observe('paper', { a: 612, b: 6, done: true }, new Set())).toEqual(['end', 'zero', 'exact']);
    expect(observe('common', { a: 18, b: 12 }, new Set())).toEqual(['six']);
    expect(observe('lists', { a: 60, b: 90 }, new Set())).toEqual([]); // the lists were not written: nothing reported
    expect(observe('lists', { a: 60, b: 90, done: false }, new Set())).toEqual([]);
    expect(observe('lists', { a: 60, b: 90, done: true }, new Set())).toEqual(['full', 'six']); // 1, 2, 3, 5, 6, 10, 15, 30
    expect(observe('lists', { a: 14, b: 70, done: true }, new Set())).toEqual(['inside']);
    expect(observe('lists', { a: 1, b: 70, done: true }, new Set())).toEqual([]); // 1 is in every list: proves nothing
    expect(observe('lists', { a: 35, b: 35, done: true }, new Set())).toEqual([]); // the same number twice
    expect(observe('planks', { a: 21, b: 35, d: 7 }, new Set())).toEqual(['both', 'rest']);
    expect(observe('planks', { a: 22, b: 20, d: 7 }, new Set())).toEqual(['sum']);
    expect(observe('planks', { a: 24, b: 12, d: 6 }, new Set())).toEqual(['both']); // 24 = 12 × 2: no remainder
    expect(observe('planks', { a: 21, b: 35, d: 1 }, new Set())).toEqual([]); // a plank of 1 fills anything
    expect(observe('planks', { a: 21, b: 35 }, new Set())).toEqual([]); // the plank was never moved: nothing reported
    expect(observe('bracket', { a: 100, b: 7 }, new Set())).toEqual([]); // no plank laid by the hand: nothing reported
    expect(observe('bracket', { a: 100, b: 7, n: 14 }, new Set())).toEqual([]); // 98: the full planks, still inside
    expect(observe('bracket', { a: 100, b: 7, n: 15 }, new Set())).toEqual(['over']); // 105: the last plank alone passes
    expect(observe('bracket', { a: 100, b: 7, n: 16 }, new Set())).toEqual(['over']); // brought back to 15: never two past
    expect(observe('bracket', { a: 120, b: 8, n: 15 }, new Set())).toEqual(['exact']);
    expect(observe('bracket', { a: 120, b: 12, n: 10 }, new Set())).toEqual([]); // exactly 10 planks: not more than 10
    expect(observe('bracket', { a: 120, b: 8, n: 16 }, new Set())).toEqual([]); // 128 > 120 but 120 = 8 × 15: nothing to pass
    expect(observe('bracket', { a: 2615, b: 42, n: 63, lo: true, hi: true }, new Set())).toEqual(['over', 'big']);
    expect(observe('bracket', { a: 2615, b: 42, n: 62, lo: true, hi: false }, new Set())).toEqual([]);
    expect(observe('bracket', { a: 2615, b: 7, n: 373, lo: true, hi: true }, new Set())).toEqual([]); // a one-digit plank
  });
  it('the dice always gives numbers the instrument can show', () => {
    let s = 7;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (const t of TOOLS)
      for (let i = 0; i < 200; i += 1) {
        const p = luckyPair(t, rand);
        expect(clampFor(t, p.a, p.b), t.id).toEqual(p);
      }
  });
});

describe('مختبري — the sounds', () => {
  const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
  const FILES = [
    './LessonLab.jsx',
    './kit.jsx',
    ...[
      'Rows',
      'Jumps',
      'Sentences',
      'Divisors',
      'Planks',
      'Common',
      'Lists',
      'Euclid',
      'PaperDivision',
      'Rules',
      'Bracket',
    ].map((n) => `./tools/${n}.jsx`),
  ];
  /** Every sound name written in the lab's code: play('x'…), useChime(play, 'x'…), and the two names of a « a ? 'x' : 'y' ». */
  const namesIn = (src) =>
    [...src.matchAll(/(?:play|playRef\.current\??\.?|useChime)\((?:play, )?([^)]*?)[,)]/g)].flatMap((m) =>
      [...m[1].matchAll(/'([a-zA-Z]+)'/g)].map((x) => x[1]),
    );

  it('every sound an instrument plays exists in the palette, and every sound of the palette is played', async () => {
    const { SOUND_NAMES } = await import('./sound');
    const used = new Set(FILES.flatMap((f) => namesIn(read(f))));
    for (const name of used) expect(SOUND_NAMES, `« ${name} » is played but not in sound.js`).toContain(name);
    for (const name of SOUND_NAMES) expect([...used], `« ${name} » is in sound.js but never played`).toContain(name);
    expect(used.size).toBeGreaterThanOrEqual(25);
  });

  it('every instrument has its sounds, and none borrows the game world’s', () => {
    for (const f of FILES.slice(2)) expect(namesIn(read(f)).length, f).toBeGreaterThanOrEqual(1);
    expect(read('./LessonLab.jsx')).not.toMatch(/gameworld\/engine\/audio/);
  });

  it('a number has a note: neighbours differ, the notes stay in a singable range', async () => {
    const { pitchOf, noteOf, GAP, SOUNDS } = await import('./sound');
    for (let n = 0; n < 200; n += 1) {
      expect(pitchOf(n)).not.toBe(pitchOf(n + 1));
      expect(pitchOf(n)).toBeGreaterThanOrEqual(261);
      expect(pitchOf(n)).toBeLessThanOrEqual(1761);
    }
    expect(noteOf(0)).toBe(0);
    expect(noteOf(5)).toBe(12);
    expect(noteOf(15)).toBe(0);
    expect(noteOf(-3)).toBe(0);
    expect(pitchOf('7')).toBe(pitchOf(7));
    for (const k of Object.keys(GAP)) expect(Object.keys(SOUNDS)).toContain(k);
  });

  it('a sound is made of short, quiet notes — and the same sound does not rattle', async () => {
    const { LabSound, SOUNDS } = await import('./sound');
    const s = new LabSound();
    const made = [];
    let now = 0;
    s.wake = () => {
      s.ctx = {
        get currentTime() {
          return now;
        },
        state: 'running',
      };
    };
    s.tone = (o) => made.push({ kind: 'tone', ...o });
    s.noise = (o) => made.push({ kind: 'noise', ...o });
    for (const name of Object.keys(SOUNDS)) {
      made.length = 0;
      now += 5;
      expect(s.play(name, 12, 3), name).toBe(true);
      expect(made.length, name).toBeGreaterThan(0);
      for (const o of made) {
        expect((o.t ?? 0) + (o.d ?? 0.2), name).toBeLessThanOrEqual(1.3);
        expect(o.g ?? 0.2, name).toBeLessThanOrEqual(0.3);
        if (o.kind === 'tone') expect(Number.isFinite(o.f) && o.f >= 80 && o.f <= 4200, `${name}: ${o.f}`).toBe(true);
      }
    }
    now += 5;
    expect(s.play('tick', 4)).toBe(true);
    now += 0.01;
    expect(s.play('tick', 5)).toBe(false);
    now += 0.04;
    expect(s.play('tick', 6)).toBe(true);
    expect(s.play('nothing')).toBe(false);
  });
});
