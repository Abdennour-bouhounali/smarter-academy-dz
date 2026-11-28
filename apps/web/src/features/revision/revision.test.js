import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { getUnitById } from '@smarter-academy/core';
import { getBuiltLessons, lessonPackFlags, lessonsWithPack } from '../../lessons/registry';
import { validateGeoFigure } from '../../lessons/common/components/geoFigure';
import { keepTogether, loadUnitSummary, summaryLessons, unitSummaryPath } from './unitSummary';
import { hasRevision, revisionPath, toolHasContent } from '../classSession/boardLessons';

/** Every revision page written, by the folder it is in — found on disk, so a page is checked before its pack names it. */
const PAGES = import.meta.glob('../../lessons/moyen/**/revision.js', { eager: true });
const pages = Object.entries(PAGES).map(([file, module]) => ({
  id: file.split('/').at(-2),
  dir: file.slice(0, file.lastIndexOf('/')),
  page: module.REVISION,
}));

const STEPS = ['recall', 'lesson', 'examples', 'traps', 'exercises', 'summary', 'quiz'];
const KINDS = ['text', 'note', 'table', 'figure', 'rule', 'example', 'trap', 'task'];

/*
 * A safety net for the numbers (REVISION_PAGE.md §3): every equality between NUMBERS written in a formula is computed.
 * A side holding a letter or a command this reader does not know is not judged — a miss, never a false alarm.
 */
const SEPARATORS =
  /\\quad|\\qquad|\\text\s*\{[^{}]*\}|\\(?:Rightarrow|Leftrightarrow|iff|implies|wedge|vee|mid|in|neq|ne|approx|leq|le|geq|ge)(?![a-zA-Z])|\\[;,:!](?![a-zA-Z])|\\ |[<>≤≥;&]|\\\\|,(?!\})|:/;

/** A side of an equality as a JavaScript expression, or null when it is not made of numbers only. */
const expression = (side) => {
  let s = side.replace(/\{,\}/g, '.').replace(/\\left|\\right|\\displaystyle|~/g, '');
  // innermost groups first: fractions, roots and powers
  for (let before = null; before !== s; ) {
    before = s;
    s = s
      .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '(($1)/($2))')
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, 'Q($1)')
      .replace(/\^\s*\{([^{}]*)\}/g, '**($1)');
  }
  s = s
    .replace(/\^\s*(\d)/g, '**($1)')
    .replace(/\\times|\\cdot|×/g, '*')
    .replace(/\\div|÷/g, '/')
    .replace(/−/g, '-')
    .replace(/(\d|\))\s*(?=Q\(|\()/g, '$1*')
    .trim();
  if (!s || !/\d/.test(s) || !/^(?:[\d.\s()+\-*/]|Q)+$/.test(s)) return null;
  return s.replace(/Q/g, 'Math.sqrt');
};

const value = (side) => {
  const js = expression(side);
  if (!js) return null;
  try {
    // only digits, operators and Math.sqrt reach this point (the pattern above)
    const v = new Function(`"use strict"; return (${js});`)();
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};

/** @returns {string[]} the statements of this formula whose numbers are not equal. */
const falseEqualities = (tex) =>
  String(tex)
    // a thousands space is part of its number, not the end of a statement
    .replace(/(\d)\\,(?=\d)/g, '$1')
    .replace(/\\(?:textcolor|color)\s*\{[^{}]*\}\s*(\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})/g, '$1')
    .split(SEPARATORS)
    .map((statement) => statement.trim())
    .filter((statement) => {
      const v = statement.split('=').map(value);
      return v.some(
        (x, i) => i > 0 && x !== null && v[i - 1] !== null && Math.abs(x - v[i - 1]) > 1e-9 * Math.max(1, Math.abs(x)),
      );
    });

const strings = (v) =>
  typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];

/** The words of a page: every string but those of a figure's data. */
const words = (page) => [
  page.intro,
  page.next,
  ...strings(page.quiz),
  ...page.steps.flatMap((s) => [s.title, s.short, ...s.blocks.filter((b) => b.kind !== 'figure').flatMap(strings)]),
];

const maths = (text) => [...String(text).matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
const renders = (tex) => () => katex.renderToString(tex, { throwOnError: true, strict: false });

/** A sentence as its Arabic words alone: what two statements share when one copies the other. */
const arabic = (text) =>
  String(text)
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[ً-ٟ]/g, '')
    .replace(/[^ء-ي]+/g, ' ')
    .trim();

const bankSentences = (grade, id) => {
  const root = path.resolve(process.cwd(), '../../content/practice', grade, id);
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { recursive: true })
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => strings(JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))))
    .map(arabic)
    .filter((s) => s.split(' ').length >= 9);
};

/** The lessons that teach rules in a game world: each owes a revision page. (A unit's last lesson has no sheets.) */
const ruleLessons = () =>
  getBuiltLessons().filter((l) => lessonPackFlags(l.id).world && lessonPackFlags(l.id).knowledge);

describe('« صفحة المراجعة » (REVISION_PAGE.md)', () => {
  it('EVERY lesson with a game world and knowledge sheets has its revision page (owner, 2026-11-26)', () => {
    const missing = ruleLessons()
      .map((l) => l.id)
      .filter((id) => !lessonPackFlags(id).revision);
    expect(missing, 'write its revision.js and name it in its pack — docs/architecture/REVISION_PAGE.md §2').toEqual(
      [],
    );
  });

  it('has its tab and its two addresses where a pack gives it', () => {
    expect(lessonsWithPack('revision')).toContain('qasim-adad-tabii');
    expect(hasRevision('qasim-adad-tabii')).toBe(true);
    expect(toolHasContent('qasim-adad-tabii', 'revision')).toBe(true);
    // a unit's last lesson teaches no rule: no page, no tab
    expect(toolHasContent('wadiya-idmajiya-aadad', 'revision')).toBe(false);
    expect(revisionPath('qasim-adad-tabii')).toBe('/espace/muraja/qasim-adad-tabii');
    expect(revisionPath('qasim-adad-tabii', 'enseignant')).toBe('/enseignant/muraja/qasim-adad-tabii');
  });

  for (const { id, dir, page } of pages) {
    describe(id, () => {
      it('has the seven steps, in order, each with blocks of a known kind', () => {
        expect(page.intro && page.next).toBeTruthy();
        expect(page.steps.map((s) => s.id)).toEqual(STEPS);
        for (const step of page.steps) {
          expect(step.title && step.short, step.id).toBeTruthy();
          if (step.id !== 'quiz') expect(step.blocks.length, step.id).toBeGreaterThan(0);
          for (const block of step.blocks) {
            expect(KINDS, `${step.id}: kind ${block.kind}`).toContain(block.kind);
            if (block.kind === 'task') expect(block.title && block.solution?.length, step.id).toBeTruthy();
            if (block.kind === 'figure') expect(validateGeoFigure(block.figure)).toEqual([]);
            if (block.kind === 'table')
              for (const row of block.rows) expect(row.length, row.join('|')).toBe(block.head.length);
            for (const line of block.body ?? [])
              expect(['p', 'concl', 'formula', 'list', 'steps'], JSON.stringify(line)).toContain(Object.keys(line)[0]);
          }
        }
        const count = (stepId, kind) => page.steps.find((s) => s.id === stepId).blocks.filter((b) => b.kind === kind);
        expect(count('examples', 'example').length).toBeGreaterThanOrEqual(3);
        expect(count('traps', 'trap').length).toBeGreaterThanOrEqual(3);
        expect(count('exercises', 'task').length).toBeGreaterThanOrEqual(6);
        expect(count('summary', 'table').length).toBeGreaterThan(0);
      });

      it('asks at least six questions, each with one answer among different options', () => {
        expect(page.quiz.length).toBeGreaterThanOrEqual(6);
        expect(new Set(page.quiz.map((q) => q.q)).size).toBe(page.quiz.length);
        for (const question of page.quiz) {
          expect(question.options[question.correct], question.q).toBeTruthy();
          expect(new Set(question.options).size, question.q).toBe(question.options.length);
          expect(question.why, question.q).toBeTruthy();
        }
        // the right answer is not always in the same place
        expect(new Set(page.quiz.map((q) => q.correct)).size).toBeGreaterThan(1);
      });

      it('writes maths that renders, and no false equality between numbers', () => {
        for (const text of words(page)) {
          expect((text.match(/\$/g) ?? []).length % 2, text).toBe(0);
          for (const tex of maths(text)) {
            expect(renders(tex), tex).not.toThrow();
            expect(falseEqualities(tex), text).toEqual([]);
          }
        }
      });

      it('copies no sentence of the exercise bank', () => {
        const grade = dir.split('/moyen/')[1].split('/')[0];
        const mine = words(page).map(arabic);
        for (const sentence of bankSentences(grade, id))
          expect(
            mine.find((s) => s.includes(sentence)),
            sentence,
          ).toBeUndefined();
      });
    });
  }

  it('« ملخّص الوحدة » exists only once every lesson of the unit is complete, « أدمج تعلّماتي » apart', () => {
    const unit = getUnitById('aadad-tabiiya-natiqa');
    const lessons = summaryLessons(unit);
    expect(lessons.map((l) => l.id)).toHaveLength(8);
    expect(lessons.map((l) => l.id)).not.toContain(unit.synthesis.id);
    // unit 2 and unit 9 still have lessons without a world: no summary yet
    expect(summaryLessons(getUnitById('hisab-judhur'))).toEqual([]);
    expect(summaryLessons(getUnitById('khassiyat-talis'))).toEqual([]);
    expect(summaryLessons(null)).toEqual([]);
    expect(unitSummaryPath(unit.id)).toBe('/espace/muraja/wahda/aadad-tabiiya-natiqa');
  });

  it('every lesson with knowledge sheets gives the summary complete rows whose formulas render', async () => {
    const lessons = ruleLessons();
    const summary = await loadUnitSummary(lessons);
    expect(summary).toHaveLength(lessons.length);
    for (const lesson of summary)
      for (const row of lesson.rows) {
        expect(row.title && row.rule.length && row.example.length && row.trap, `${lesson.id} ${row.id}`).toBeTruthy();
        for (const line of [...row.rule, ...row.example])
          for (const tex of maths(line)) expect(renders(tex), `${row.id}: ${tex}`).not.toThrow();
      }
  });

  it('a calculation typed in a sentence cannot break across two lines', () => {
    expect(keepTogether('يقسم 42 = 22 + 20 ولا')).toBe('يقسم ⁦42 = 22 + 20⁩ ولا');
    expect(keepTogether('العدد 7 فقط')).toBe('العدد 7 فقط');
  });

  it('reads an equality between numbers and says when it is false', () => {
    expect(falseEqualities('42 = 6 \\times 7 + \\textcolor{#e11d48}{0}')).toEqual([]);
    expect(falseEqualities('42 = 6 \\times 8')).toEqual(['42 = 6 \\times 8']);
    expect(falseEqualities('\\dfrac{66}{78} = \\dfrac{11}{13} \\quad \\sqrt{49} = 7 = \\sqrt{7^{2}}')).toEqual([]);
    expect(falseEqualities('\\sqrt{9+16} = 3+4')).toHaveLength(1);
    expect(falseEqualities('\\mathrm{PGCD}(40 ; 56) = 8 \\ ,\\ a = 2 \\times 4')).toEqual([]);
    expect(falseEqualities('x^{2} = 9 \\Rightarrow x = 3')).toEqual([]);
    expect(falseEqualities('\\sqrt{2} \\approx 1{,}41 \\neq 1{,}5')).toEqual([]);
  });
});
