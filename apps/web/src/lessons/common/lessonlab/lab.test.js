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
    expect(lab.cabinet.map((g) => g.grade)).toEqual(['1am']);
    expect(lab.cabinet[0].lessons.map((l) => [l.code, l.tools.map((t) => t.id)])).toEqual([
      ['qisma-iqlidiya-baqi', ['paper']],
      ['qawaid-qabiliyat-qisma', ['rules']],
    ]);
    expect(lab.all.map((t) => t.id)).not.toContain('euclid');
    expect(lab.all.map((t) => t.id)).not.toContain('divisors');
  });

  it('the PGCD lesson: its own instrument, and every instrument of the lessons before it — of this year and of the earlier ones', () => {
    const lab = toolsFor('bahth-pgcd');
    expect(lab.mine.map((t) => t.id)).toEqual(['euclid']);
    expect(lab.cabinet.map((g) => g.grade)).toEqual(['1am', '4am']);
    expect(lab.cabinet[1].lessons.map((l) => l.code)).toEqual([
      'qasim-adad-tabii',
      'qawasim-adad-tabii',
      'qasim-mushtarak-akbar',
    ]);
    expect(lab.all.length).toBe(TOOLS.length);
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
    ...['Rows', 'Jumps', 'Sentences', 'Divisors', 'Common', 'Euclid', 'PaperDivision', 'Rules'].map(
      (n) => `./tools/${n}.jsx`,
    ),
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
