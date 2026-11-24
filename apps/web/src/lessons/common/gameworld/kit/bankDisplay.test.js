// « الامتحان الأبيض » on the REAL banks of every v2 lesson (content/practice/<grade>/<id>/, served as they are): EVERY sheet
// of every level is drawn (the DEV hook names it) and every string the sitting shows is read — the statement, its formulas
// and table, each step, the widgets' words (choices, answer format), the model copy, the hints, the answer written back.
// Money reads « دج »: no « DA » after an amount survives. A segment named DA stays a segment.
import { describe, it, expect, afterAll, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { rng } from './random';
import { DEV_SHEET_KEY, cashDj, createBankSittings, namesAsMath } from './bankSitting';
import ExamSitting from './ExamSitting';
import { LessonProvider } from './LessonContext';
import { sheetFigure } from './sheetFigure';
import { validateStatementFigure } from '../../components/statementFigure';

/** Every v2 lesson's sitting (a lesson is v2 when its world serves its bank: `world/sitting.js`). */
const LESSONS = import.meta.glob('../../../moyen/**/world/sitting.js', { eager: true });

/** « DA » that is still MONEY: after a number (glued or not, or the formula that holds it), in a unit « (DA) », « بالـ DA ». */
const MONEY_DA = /(?:\d\$?|\\,|\\text\{|\\mathrm\{)\s*DA(?![A-Za-z])|\(\s*DA\s*\)|بال(?:ـ|دينار)\s*DA(?![A-Za-z])/;

const right = (q) =>
  q.answerType === 'choice'
    ? { choiceId: q.bank.choices.find((c) => c.isCorrect)?.id }
    : q.paper
      ? undefined
      : { value: String(q.bank.expectedAnswer) };

/** Every string of a subject that reaches the screen. */
function shownStrings(sittings, s) {
  const out = [];
  for (const e of s.exercises) {
    out.push(e.title, e.topic, e.statement, ...e.formulas);
    if (e.table) out.push(...e.table.head, ...e.table.rows.flat());
    for (const q of e.questions) {
      out.push(q.text, q.lead, q.shown.statement, q.shown.lead, q.shown.answerFormat);
      out.push(...(q.shown.choices ?? []).map((c) => c.content));
      out.push(...sittings.model(q), ...sittings.guide(q), ...sittings.scheme(q));
      if (!q.paper) out.push(sittings.written(q, right(q)));
    }
  }
  return out.filter((x) => typeof x === 'string');
}

const store = {};
globalThis.localStorage = { getItem: (k) => store[k] ?? null };
afterAll(() => {
  delete globalThis.localStorage;
});

describe('the sittings of every v2 lesson, on their real banks — money is « دج »', () => {
  const entries = Object.entries(LESSONS);

  it('finds the v2 lessons', () => {
    expect(entries.length).toBeGreaterThanOrEqual(11);
  });

  for (const [file, mod] of entries) {
    // a world not wired to its bank yet (`sittings = []`): its bank is read through the same adapter all the same
    const id = file.split('/').at(-3);
    const sittings = typeof mod.sittings?.prepare === 'function' ? mod.sittings : createBankSittings({ lesson: id });
    it(`${id}: every sheet of every level shows no « DA » of money`, async () => {
      await sittings.prepare();
      let sheets = 0;
      for (const L of sittings.levels) {
        for (const id of sittings.sheetIds(L.n)) {
          store[DEV_SHEET_KEY] = id;
          const s = sittings.makeSubject(rng(1), L.n, [], {});
          if (!s) continue; // a sheet on paper only, alone at its level: nothing to sit
          expect(s.exercises[0].bankId, file).toBe(id);
          sheets += 1;
          for (const line of shownStrings(sittings, s)) {
            expect(line, `${id}: ${line}`).not.toMatch(MONEY_DA);
            // these banks are arithmetic: no segment is named DA, so not one « DA » is left at all
            expect(line, `${id}: ${line}`).not.toMatch(/(?<![A-Za-z])DA(?![A-Za-z])/);
          }
        }
      }
      delete store[DEV_SHEET_KEY];
      expect(sheets, file).toBeGreaterThan(0);
    });
  }

  it('leaves a name alone: a segment DA is not money', () => {
    expect(cashDj('$AB + DA = 7$')).toBe('$AB + DA = 7$');
    expect(cashDj('القطعة $[DA]$ طولها $5$ cm')).toBe('القطعة $[DA]$ طولها $5$ cm');
  });
});

describe('a PGCD written in the words of a bank line is drawn as a formula', () => {
  it('the run and its « = n » become ONE formula, upright; inside a formula the name gets upright letters', () => {
    expect(namesAsMath('أكبرها هو 36، إذن أكبر عدد هو PGCD(252 ; 180) = 36.')).toBe(
      'أكبرها هو 36، إذن أكبر عدد هو $\\mathrm{PGCD}(252 ; 180) = 36$.',
    );
    expect(namesAsMath('نحسب PGCD(a ; b) أوّلًا')).toBe('نحسب $\\mathrm{PGCD}(a ; b)$ أوّلًا');
    expect(namesAsMath('$PGCD(252 ; 180) = 36$')).toBe('$\\mathrm{PGCD}(252 ; 180) = 36$');
    // already upright, or a word of the text without brackets: left as it is
    expect(namesAsMath('$\\mathrm{PGCD}(8 ; 12) = 4$')).toBe('$\\mathrm{PGCD}(8 ; 12) = 4$');
    expect(namesAsMath('نحسب PGCD للعددين')).toBe('نحسب PGCD للعددين');
  });
  it('the bank of `qasim-mushtarak-akbar`: no plain « PGCD( » is left in what its sitting shows', async () => {
    const mod = Object.entries(LESSONS).find(([f]) => f.includes('/qasim-mushtarak-akbar/'))[1];
    const { sittings } = mod;
    await sittings.prepare();
    for (const L of sittings.levels) {
      for (const id of sittings.sheetIds(L.n)) {
        store[DEV_SHEET_KEY] = id;
        const s = sittings.makeSubject(rng(1), L.n, [], {});
        if (!s) continue;
        // the answer format is the template the widget parses, not a sentence it shows: it keeps the bank's own writing
        const formats = new Set(s.exercises.flatMap((e) => e.questions.map((q) => q.shown.answerFormat)));
        for (const line of shownStrings(sittings, s).filter((x) => !formats.has(x))) {
          const words = line.split(/\$[^$]*\$/).join(' ');
          expect(words, `${id}: ${line}`).not.toMatch(/PGCD\s*\(/);
        }
      }
    }
    delete store[DEV_SHEET_KEY];
  });
});

describe("the FIGURES of a bank on the sitting's paper — every sheet of `talis-hisab-atwal`", () => {
  globalThis.window = globalThis.window ?? {};
  const sittings = createBankSittings({ lesson: 'talis-hisab-atwal' });
  const game = { paperMode: () => {} };
  const lesson = { sittings, rules: {}, keys: [], evidence: null };

  it('every one of its 50 sheets is served; the 38 that carry a figure draw it, valid, with no error, labels ≥ 12 px', async () => {
    await sittings.prepare();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    let sheets = 0;
    let drawn = 0;
    const kinds = new Set();
    for (const L of sittings.levels) {
      for (const id of sittings.sheetIds(L.n)) {
        store[DEV_SHEET_KEY] = id;
        const s = sittings.makeSubject(rng(1), L.n, [], {});
        expect(s, id).not.toBeNull();
        const e = s.exercises[0];
        expect(e.bankId).toBe(id);
        sheets += 1;
        const html = renderToString(
          createElement(LessonProvider, { lesson }, createElement(ExamSitting, { game, level: L.n })),
        );
        expect(html, id).toContain(`data-xs-bank="${id}"`);
        if (!e.figure) {
          expect(html.split(`data-xs-bank="${id}"`)[1].split('data-xs-bank')[0], id).not.toContain('data-xs-figure');
          continue;
        }
        drawn += 1;
        expect(validateStatementFigure(e.figure), id).toEqual([]);
        const f = sheetFigure(e.figure);
        expect(f, id).not.toBeNull();
        kinds.add(f.kind);
        // the sheet's own figure box: its SVG, its aria label, every point name
        const box = html.split(`data-xs-bank="${id}"`)[1].split('data-xs-bank')[0];
        expect(box, id).toContain(`data-xs-figure="${f.kind}"`);
        const svg = box.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
        expect(svg, id).not.toBeNull();
        const vbW = Number(svg[1].split(' ')[2]);
        expect(vbW, id).toBeGreaterThan(0);
        expect(svg[0]).not.toContain('NaN');
        const hidden = new Set(e.figure.hidden ?? []);
        for (const name of Object.keys(e.figure.points).filter((n) => !hidden.has(n)))
          expect(svg[2], `${id}: ${name}`).toContain(`>${name.replaceAll("'", '&#x27;')}</text>`);
        // the 12 px floor: drawn at no less than k × 12 px wide, its SMALLEST text reads 12 px or more
        const sizes = [...svg[2].matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]));
        expect(sizes.length, id).toBeGreaterThan(0);
        expect((Math.min(...sizes) * 12 * f.k) / vbW, id).toBeGreaterThanOrEqual(12 - 1e-9);
      }
    }
    delete store[DEV_SHEET_KEY];
    // a server render warns that Fit's layout effect does not run there (the kit's, not the figure's): every other error fails
    const real = errors.mock.calls.map((c) => String(c[0])).filter((m) => !m.includes('useLayoutEffect does nothing'));
    expect(real).toEqual([]);
    errors.mockRestore();
    expect(sheets).toBe(50);
    expect(drawn).toBe(38);
    expect([...kinds]).toEqual(['plane']);
  });
});
