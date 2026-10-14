import { describe, it, expect } from 'vitest';
import { ACTIVITY, CARDS, METHOD, NOW_42, LEAP } from './textbook';
import { EX, SELF_12 } from './exercises';

const SELF_NUMBERS = SELF_12.numbers;

const div = (n, d) => n % d === 0;
const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p])));
const leap = (y) => (div(y, 4) && !div(y, 100)) || div(y, 400);
const choice = (rows) => rows.map((r) => r.options[r.correct]);

describe('« قواعد قابلية القسمة » — chaque clé décidée par n % d', () => {
  it('نشاط 4 : les multiples de 2, 5, 3 de la table 0–48', () => {
    const { from, to } = ACTIVITY.numbers;
    const range = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    expect(new Set(range.filter((n) => div(n, 2)).map((n) => n % 10))).toEqual(new Set([0, 2, 4, 6, 8]));
    expect(new Set(range.filter((n) => div(n, 5)).map((n) => n % 10))).toEqual(new Set([0, 5]));
    for (const n of range.filter((k) => div(k, 3))) expect(div(String(n).split('').reduce((a, c) => a + Number(c), 0), 3)).toBe(true);
  });

  it('تمرين 26 : les plus grands arrangements de 4, 5, 9, 3 — et aucun pour 4 ni 9', () => {
    const nums = perms(CARDS.digits).map((p) => Number(p.join(''))).sort((a, b) => b - a);
    for (const d of [2, 3, 5]) expect(nums.find((n) => div(n, d))).toBe(CARDS.answers[d]);
    expect(nums.filter((n) => div(n, 4) || div(n, 9))).toEqual([]);
    expect(choice(EX['ex-26'].question.rows)).toEqual(['9534', '9543', '9435']);
  });

  it('exercices 22, 23, 24 et دوري الآن', () => {
    const cls25 = (n) => (div(n, 2) && div(n, 5) ? 'على 2 وعلى 5' : div(n, 2) ? 'على 2 فقط' : div(n, 5) ? 'على 5 فقط' : 'لا على 2 ولا على 5');
    expect(choice(EX['ex-22'].question.rows)).toEqual(EX['ex-22'].question.rows.map((r) => cls25(Number(r.label))));
    const cls39 = (n) => (div(n, 9) ? 'على 3 وعلى 9' : div(n, 3) ? 'على 3 فقط' : 'لا على 3 ولا على 9');
    expect(choice(EX['ex-23'].question.rows)).toEqual(EX['ex-23'].question.rows.map((r) => cls39(Number(r.label))));
    const cls24 = (n) => (div(n, 4) ? 'على 2 وعلى 4' : div(n, 2) ? 'على 2 فقط' : 'لا على 2 ولا على 4');
    expect(choice(EX['ex-24'].question.rows)).toEqual(EX['ex-24'].question.rows.map((r) => cls24(Number(r.label))));
    expect(EX['now-42'].question.rows.map((r) => r.correct === 0)).toEqual(NOW_42.numbers.map((n) => div(n, 4)));
  });

  it('les bijoux (90), la طريقة p. 42 et les années bissextiles', () => {
    const jewels = Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => div(n, 2) && div(n, 3) && div(n, 5) && n % 7 === 6);
    expect(jewels).toEqual([EX['ex-32'].question.expected]);
    expect([100, 200, 500, 116, 224].every((n) => div(n, 4))).toBe(true);
    expect(103 % 4).toBe(3);
    expect(LEAP.years.filter(leap)).toEqual(EX['deep-8'].question.expected);
    expect([leap(2000), leap(2012), leap(1900)]).toEqual([true, true, false]);
    expect(METHOD.solution).toHaveLength(4);
  });
});

describe('the إختبار أولي (module 9) keys', () => {
  it('every literal key is decided by n % d', async () => {
    const raw = (await import('../modules/Module09Itqan.jsx?raw')).default;
    const label = (n, [a, b]) => {
      const A = n % a === 0; const B = n % b === 0;
      if (A && B) return `على ${a} وعلى ${b}`;
      if (A) return `على ${a} فقط`;
      if (B) return `على ${b} فقط`;
      return `لا على ${a} ولا على ${b}`;
    };
    const epreuve = (id) => {
      const block = raw.slice(raw.indexOf(`id: '${id}'`));
      const options = JSON.parse(block.match(/options: (\[[^\]]*\])/)[1].replace(/'/g, '"'));
      return options[Number(block.match(/correct: (\d)/)[1])];
    };
    expect(epreuve('E1')).toBe(label(4805, [2, 5]));
    expect(epreuve('E2')).toBe(label(918, [3, 9]));
    expect(epreuve('E3')).toBe(label(3216, [2, 4]));
    expect(epreuve('E5')).toBe(label(4805, [3, 9]));
    expect(SELF_NUMBERS).toEqual([918, 4805, 120, 3216]);
    expect(120 % 4).toBe(0);
  });
});
