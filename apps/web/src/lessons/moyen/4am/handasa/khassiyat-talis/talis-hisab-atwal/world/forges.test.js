/**
 * THE FORGES of lesson `talis-hisab-atwal`: the shared checks (`describeForges` — kit/authoring/test/suites.js; a case
 * here is a Thalès figure of the world), then what is this lesson's own — the false rules its students really hold and
 * the computed case where each one falls (PYRAMIDS_WORLD_PLAN §3.3–§3.6), every case drawn by the world's mirror and
 * line, the last steps' numbers, and the mirror's new numbers against the bank and the other stories.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { runOn, testsOf, ruleKey } from '../../../../../../common/gameworld/kit/forge';
import { allRules, describeForges, plain } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { collisions, readBank, storiesOf } from '../../../../../../common/gameworld/kit/authoring/test/bank.js';
import { Mirror, Line, UseFigure } from '../../../../../../common/gameworld/nilePyramids/forgeParts';
import { thalesCase, caseId, segName } from '../../../../../../common/gameworld/nilePyramids/ruleForge';
import { canalReading, riverFigure } from '../../../../../../common/gameworld/nilePyramids/logic';
import {
  figureSpec,
  gauge,
  lastStepFigure,
  mirrorFigure,
} from '../../../../../../common/gameworld/nilePyramids/figure';
import { layoutGeoFigure } from '../../../../../../common/components/geoFigure';
import { laidFact } from '../../../../../../common/gameworld/nilePyramids/plan';
import { copyOf } from '../../../../../../common/gameworld/nilePyramids/scale';
import {
  FORGES,
  FIGS,
  F1_CASES,
  F2_HARD,
  F3_CASES,
  F4_CASES,
  CAPSTONE_CASE,
  USE1,
  USE2,
  USE3,
  USE4,
  USE1_FIG,
  USE2_FIG,
  USE3_FIG,
  USE4_FIG,
  RIVER_CASE,
  chainValues,
  planValue,
  values3,
  kOf,
} from './forges';
import { PLAN_INQUIRY, SCALE_INQUIRY } from './inquiries';
import { KEYS } from './journey';
import { FIELD, K1, K2, K3, K4, RIVER, equal, over, read, times, write } from './math';
import { FACE } from '../../../../../../common/gameworld/nilePyramids/logic';

// the experiments' screens expose their state to the walks on `window` (dev only)
globalThis.window = globalThis.window ?? {};

// ───────── what the WORLD logs (Game.forgeLog), stage by stage ─────────
const canalRow = (canal, typed) =>
  thalesCase({
    id: `canal:${canal.id}`,
    names: { V: 'A', M: canal.ends[0], B: 'B', N: canal.ends[1], C: 'C' },
    len: {
      VM: canal.AM,
      VB: FIELD.AB,
      VN: canal.AN,
      VC: FIELD.AC,
      MN: canalReading(FIELD, canal),
      BC: FIELD.BC,
    },
    canal: canal.id,
    typed,
  });
const [NEW, OLD] = FIELD.canals;
const courseRow = (sm, typed, held) =>
  thalesCase({
    names: { V: 'S', M: 'M', B: 'B', N: 'N', C: 'C' },
    len: { VM: sm, VB: FACE.edge, VN: sm, VC: FACE.edge, MN: typed, BC: FACE.base },
    held,
  });
/** The river as the world logs it (`Game.forgeLog('river')`): whole — SR = √2785, SF = 8√2785 — his ferry rope kept. */
const riverRow = (typed, ferry) => thalesCase({ ...riverFigure(RIVER), typed, ferry });
const capRow = (k, held) => {
  const side = (x) => write(times(x, k));
  return thalesCase({
    names: { V: 'S', M: 'M', B: 'B', N: 'N', C: 'C' },
    len: {
      VM: side(FACE.edge),
      VB: FACE.edge,
      VN: side(FACE.edge),
      VC: FACE.edge,
      MN: side(FACE.base),
      BC: FACE.base,
    },
    held,
    k,
  });
};

/** Right at once; with misses everywhere; and a log that lost the field's canals (the story guarantees both). */
const ROADS = {
  AT_ONCE: {
    [K1]: [canalRow(NEW, '18'), canalRow(OLD, '50,1')],
    [K2]: [courseRow('80', '88', true), courseRow('70', '77', true)],
    [K3]: [riverRow('416', 'ties')],
    [K4]: [capRow('1/36', true)],
  },
  MISSED: {
    [K1]: [canalRow(NEW, '20'), canalRow(OLD, '31,5'), canalRow(NEW, '18')],
    [K2]: [courseRow('80', '11', false), courseRow('80', '88', true), courseRow('70', '77', true)],
    [K3]: [riverRow('6,5', 'short'), riverRow('416', 'ties')],
    [K4]: [capRow('36', false), capRow('1/36', true)],
  },
  LOST: { [K1]: [], [K2]: [], [K3]: [], [K4]: [] },
};

// ───────── what each experiment hands back (its own reducer's result shape) ─────────
const planRow = (round, typed) => {
  const r = PLAN_INQUIRY.rounds[round];
  const truth = planValue({ ...thalesCase({ ...r.fig }), given: r.given, unknown: r.unknown }).value;
  return { round, unknown: r.unknown, typed, ...laidFact(typed, truth), picked: [], joins: [] };
};
const PLAN_RESULT = {
  rows: [planRow(0, '11'), planRow(0, '88'), planRow(1, '63'), planRow(2, '89'), planRow(2, '81'), planRow(3, '12')],
  plan: { cards: ['VB', 'BC'], joins: [] },
};
const HALFTURN_RESULT = {
  rows: [
    { round: 0, predicted: 'B', landed: 'B', right: true, parallel: true },
    { round: 1, predicted: 'C', landed: 'B', right: false, parallel: true },
    { round: 2, predicted: 'B', landed: 'B', right: true, parallel: false },
  ],
};
const scaleRow = (round, feed, k, said = null) => {
  const copy = copyOf(SCALE_INQUIRY, feed, k);
  return { round, feed, k, image: copy.image, said, right: true, perimeter: copy.perimeter };
};
const SCALE_RESULT = {
  rows: [
    scaleRow(1, 'small', '6/5', 'larger'),
    scaleRow(2, 'big', '6/5', 'exact'),
    scaleRow(3, 'big', '1/2'),
    scaleRow(3, 'big', '5/6'),
    scaleRow(4, 'small', '6/5', 'times'),
  ],
};

/** The right answer of each last step, computed from its case. */
const SOLVE = {
  [K1]: (c) => {
    const s = (k) => segName(c, k);
    return { cond: 'par', an: s('VM'), ad: s('VB'), bn: s('VN'), bd: s('VC'), cn: s('MN'), cd: s('BC') };
  },
  [K2]: (c) => ({ p1: c.len.VM, p2: c.len.MB, ab: c.len.VB, af: c.len.VN, ef: c.len.MN }),
  [K3]: (c) => ({ od: c.len.VC, ab: c.len.MN }),
  [K4]: (c) => {
    const [n, d] = [read(c.k).n, read(c.k).d].map(String);
    return { kn: n, kd: d, kind: 'reduction', mn: c.MN, bn: d, bd: n };
  },
};
/** The words of each key's NAME and of what it states: no sentence of its forge says them before its last step. */
const FORBIDDEN = {
  [K1]: /طالس|وضعية/,
  [K2]: /الرابع المتناسب|متناسب|متصالب/,
  [K3]: /فراشة|وضعية|طالس/,
  [K4]: /معامل|تناسبية|تكبير|تصغير/,
};

const suite = describeForges({
  forges: FORGES,
  keys: KEYS,
  roads: ROADS,
  inquiry: { [K2]: PLAN_RESULT, [K3]: HALFTURN_RESULT, [K4]: SCALE_RESULT },
  solve: SOLVE,
  forbidden: FORBIDDEN,
  bank: 'talis-hisab-atwal',
  tiles: { [K1]: 16, [K2]: 1, [K3]: 16, [K4]: 16 },
});

// ───────── the lesson's own ─────────

const F = FORGES;
const rule = (key, r) => allRules(F[key]).find((x) => ruleKey(F[key], x) === ruleKey(F[key], r));
/** Where a rule falls on a road: the first case of his evidence, or the mirror's attack. */
const fallOf = (key, r, road = ROADS.AT_ONCE) => suite.refutedBy(key, rule(key, r), road);

describe('the forges’ ids are the lesson’s', () => {
  it('one forge per key, in the order of the story; each id quoted in forges.js (the status script)', () => {
    expect(Object.keys(F)).toEqual(KEYS);
    expect(KEYS).toEqual([K1, K2, K3, K4]);
    const src = readFileSync(new URL('./forges.js', import.meta.url), 'utf8');
    for (const k of KEYS) expect(src.includes(`'${k}'`), k).toBe(true);
  });
});

describe('🔑 the false rules students hold fall where the plan says (§3.3)', () => {
  const rows = suite.rowsOf(K1, ROADS.AT_ONCE);
  const byId = (id) => rows.find((c) => c.id === id);

  it('the field: the new canal holds 2/9 three times, the old one does not; its pieces 49 and 56', () => {
    const fresh = byId('canal:new');
    const old = byId('canal:old');
    expect(chainValues('whole', fresh)).toEqual(['2/9', '2/9', '2/9']);
    expect(fresh.len.MB).toBe('49');
    expect(fresh.len.NC).toBe('56');
    expect(chainValues('whole', old)).toEqual([
      write(over('39', '63')),
      write(over('28', '72')),
      write(over('41', '81')),
    ]);
    expect(fresh.held).toBe(true);
    expect(old.held).toBe(false);
  });

  it('« cuts both sides » falls on the old canal; « midpoint », « AM = AN » with the whole chain on the new one', () => {
    for (const [r, at] of [
      [{ cond: 'cut', chain: 'whole' }, 'canal:old'],
      [{ cond: 'mid', chain: 'whole' }, 'canal:new'],
      [{ cond: 'same', chain: 'whole' }, 'canal:new'],
    ]) {
      const f = fallOf(K1, r);
      expect(f.on, JSON.stringify(r)).toBe('evidence');
      expect(f.c.id).toBe(at);
    }
  });

  it('the parallel with a wrong chain falls on the new canal: the piece 2/7, 2/7, 2/9; the difference; one upside down', () => {
    const fresh = byId('canal:new');
    expect(chainValues('piece', fresh)).toEqual(['2/7', '2/7', '2/9']);
    expect(chainValues('diff', fresh)).toEqual(['49', '56', '63']);
    expect(chainValues('flip', fresh)).toEqual(['2/9', '9/2', '2/9']);
    for (const chain of ['piece', 'diff', 'flip']) {
      const f = fallOf(K1, { cond: 'par', chain });
      expect(f.on, chain).toBe('evidence');
      expect(f.c.id).toBe('canal:new');
    }
  });

  it('« midpoint » or « AM = AN » with a wrong chain survives his canals and falls on the midpoint field (attack 1)', () => {
    for (const cond of ['mid', 'same'])
      for (const chain of ['piece', 'diff', 'flip']) {
        const f = fallOf(K1, { cond, chain });
        expect(f.on, `${cond} ${chain}`).toBe('attack');
        expect(caseId(f.c)).toBe(caseId(F1_CASES.A1));
      }
    expect(chainValues('whole', F1_CASES.A1)).toEqual(['1/2', '1/2', '1/2']);
    expect(chainValues('piece', F1_CASES.A1)).toEqual(['1', '1', '1/2']);
    expect(chainValues('diff', F1_CASES.A1)).toEqual(['19', '19', '16']);
  });

  it('the right rule meets another field (k = 8/11) and a crooked canal on it (48/66 ≠ 63/77)', () => {
    const right = allRules(F[K1]).find(F[K1].isTheRule);
    const list = F[K1].attacks(right, rows);
    expect(list.map(caseId)).toEqual([caseId(F1_CASES.R), caseId(F1_CASES.RX)]);
    expect(chainValues('whole', F1_CASES.R)).toEqual(['8/11', '8/11', '8/11']);
    expect(list.map((c) => c.held)).toEqual([true, false]);
    // the crooked canal's lengths are exact: UV² = 48² + 63² − 2 × 48 × 63 × 1/4 = 69², with cos R = 1/4 from RST
    expect(48 * 48 + 63 * 63 - (2 * 48 * 63) / 4).toBe(69 * 69);
    expect(66 * 66 + 77 * 77 - (2 * 66 * 77) / 4).toBe(88 * 88);
  });

  it('a refutation says his rule and the three values, as plain text and as a formula', () => {
    const r = rule(K1, { cond: 'par', chain: 'piece' });
    const run = runOn(F[K1], r, testsOf(F[K1], r, rows));
    const m = run.marks[run.bad];
    plain(F[K1].text.refuted(m));
    expect(F[K1].explain(r, m)).toContain('\\dfrac{2}{7}');
    expect(F[K1].explain(r, m)).toContain('\\dfrac{2}{9}');
  });
});

describe('📐 the procedure — run on what is GIVEN only', () => {
  it('every round of the experiment, its attacks and its last step can be computed from their data, and give the figure’s length', () => {
    for (const r of PLAN_INQUIRY.rounds) {
      const c = { ...thalesCase({ ...r.fig }), given: r.given, unknown: r.unknown };
      expect(planValue(c)?.value, r.unknown).toBe(c.len[r.unknown]);
    }
    expect(PLAN_INQUIRY.rounds.map((r) => thalesCase({ ...r.fig }).len[r.unknown])).toEqual(['88', '63', '81', '12']);
    for (const c of F2_HARD) expect(planValue(c).value).toBe(c.len[c.unknown]);
    expect(F2_HARD.map((c) => [c.unknown, c.typed, c.held])).toEqual([
      ['NC', '56', true],
      ['NC', '29', false],
    ]);
    // the « difference » the mirror lays: RS − RU = RT − RV, so NC = 77 − (66 − 18) — it is 21
    expect(77 - (66 - 18)).toBe(29);
    expect(F2_HARD[1].len.NC).toBe('21');
    const use = { ...USE2, given: ['VM', 'MB', 'VC', 'BC'], unknown: 'VN' };
    expect(planValue(use).value).toBe('54');
    expect([USE2.len.VB, USE2.len.VN, USE2.len.MN]).toEqual(['55', '54', '63']);
  });

  it('the plan he built IS his rule: the experiment hands the forge its one rule, and the attacks of the mirror', () => {
    const out = F[K2].fromInquiry(PLAN_RESULT);
    expect(F[K2].isTheRule(out.rule)).toBe(true);
    expect(out.rows.map((c) => [c.unknown, c.typed, c.held])).toEqual([
      ['MN', '11', false],
      ['MN', '88', true],
      ['MN', '63', true],
      ['BC', '89', false],
      ['BC', '81', true],
      ['MB', '12', true],
    ]);
    expect(F[K2].evidence([...out.rows, ...ROADS.MISSED[K2]])).toEqual(out.rows);
  });
});

describe('🦋 the pairs students write fall on HIS river — the third ratio is named (gate P4)', () => {
  const rows = suite.rowsOf(K3, ROADS.AT_ONCE);
  const [river, parallel] = rows;

  it('his river comes first, whole and exact: SE/SA = SR/SF = ER/AF = 1/8; RF = SR + SF = 9√2785', () => {
    expect(caseId(river)).toBe(caseId(RIVER_CASE));
    expect(river.len).toMatchObject({ VM: '9', VB: '72', VN: '√2785', VC: '8√2785', MN: '52', BC: '416' });
    expect(river.held).toBe(true);
    expect(values3({ one: 'se_sa', two: 'sr_sf' }, river)).toEqual(['1/8', '1/8', '1/8']);
    expect(values3({ one: 'sa_se', two: 'sf_sr' }, river)).toEqual(['8', '8', '1/8']);
    expect(values3({ one: 'se_ea', two: 'sr_rf' }, river)).toEqual(['1/9', '1/9', '1/8']);
    expect(values3({ one: 'se_sf', two: 'sr_sa' }, river)).toEqual(['9/22280√2785', '1/72√2785', '1/8']);
    // the world's log, with what he typed for the ferry, gives that same case
    for (const road of [ROADS.AT_ONCE, ROADS.MISSED])
      expect(F[K3].evidence(road[K3]).map(caseId)).toEqual([caseId(RIVER_CASE)]);
  });

  it('two wrong pairs are true equalities between themselves; the third ratio ER/AF = 1/8 is not theirs', () => {
    expect(values3({ one: 'sa_se', two: 'sf_sr' }, parallel)).toEqual(['10/7', '10/7', '7/10']);
    expect(values3({ one: 'se_ea', two: 'sr_rf' }, parallel)).toEqual(['7/17', '7/17', '7/10']);
    for (const r of [
      { one: 'sa_se', two: 'sf_sr' },
      { one: 'se_ea', two: 'sr_rf' },
      { one: 'se_sf', two: 'sr_sa' },
    ]) {
      const f = fallOf(K3, r);
      expect(f.on).toBe('evidence');
      expect(caseId(f.c)).toBe(caseId(river));
      expect(F[K3].text.refuted({ ...f.c, says: false, held: true })).toContain('ER/AF');
      // without his river, the parallel round refutes it, naming 7/10
      expect(runOn(F[K3], rule(K3, r), rows.slice(1)).bad, JSON.stringify(r)).toBe(0);
      expect(F[K3].text.refuted({ ...parallel, says: false, held: true })).toContain('KL/PQ');
    }
    // a root is written as a root in a formula, never as a float
    expect(F[K3].explain(rule(K3, { one: 'se_sf', two: 'sr_sa' }), river)).toContain('\\sqrt{2785}');
    expect(F[K3].text.eq(river)).toContain('\\tfrac{1}{8}');
  });

  it('every case the mirror draws lies low enough to leave the question and its button in the window (the walk)', () => {
    for (const key of [K1, K2, K3, K4])
      for (const c of suite.rowsOf(key, ROADS.AT_ONCE)) {
        if (!c.names || !c.len) continue;
        const spec = figureSpec(c, { show: c.show ?? 'all', parallel: c.parallel ?? null, turn: mirrorFigure(c).turn });
        const [, , vw, vh] = layoutGeoFigure(spec).viewBox;
        // drawn at its width (the mirror's 300 px, or wider when it lies flat): at most 380 px tall
        expect(((mirrorFigure(c).width ?? 300) * vh) / vw, `${key} ${caseId(c)}`).toBeLessThanOrEqual(380);
      }
  });

  it('the line under the mirror is a formula between dollars, its fractions at text size (MathText; the walk saw it raw)', () => {
    for (const key of [K1, K2, K3, K4])
      for (const c of suite.rowsOf(key, ROADS.AT_ONCE)) {
        const eq = F[key].text.eq?.(c);
        if (eq == null) continue;
        expect(eq, key).toMatch(/^\$[^$]+\$$/);
        expect(eq, key).not.toContain('\\dfrac');
      }
  });

  it('the crooked round is exact (PQ = 92) and refuses the chain; the attacks: other letters, then a crooked pair', () => {
    expect(60 * 60 + 64 * 64 + (2 * 60 * 64) / 10).toBe(92 * 92);
    const crooked = rows[2];
    expect(crooked.held).toBe(false);
    const right = allRules(F[K3]).find(F[K3].isTheRule);
    expect(F[K3].says(right, crooked)).toBe(false);
    expect(F[K3].attacks(right, rows).map(caseId)).toEqual([caseId(F3_CASES.O), caseId(F3_CASES.OX)]);
    expect(33 * 33 + 56 * 56).toBe(65 * 65);
    expect(24 * 24 + 32 * 32).toBe(40 * 40);
  });

  it('the river of the world is drawn whole by the mirror, its measured lengths only (no root written)', () => {
    const out = textOf(renderToString(createElement(Mirror, { c: riverRow('416', 'ties'), stage: 'done' })));
    for (const x of ['72', '9', '52', '416']) expect(out).toContain(x);
    expect(out).not.toContain('√');
    expect(renderToString(createElement(Line, { c: RIVER_CASE }))).toContain('data-np-line="aligned"');
  });

  it('the last step: OD = 56 and AB = 33 (k = 3/8); the trap OA + OC = 66 is answered', () => {
    expect(write(over(times(USE3.len.VN, USE3.len.VB), USE3.len.VM))).toBe('56');
    expect(write(over(times(USE3.len.BC, USE3.len.VM), USE3.len.VB))).toBe('33');
    expect(F[K3].use.check(USE3, { od: '66', ab: '33' })).toBe('sum');
  });
});

describe('🔍 the false rules about k fall on his copies (§3.6)', () => {
  const rows = suite.rowsOf(K4, ROADS.AT_ONCE);

  it('his copies: the capstone (1/36), 6/5 fed AMN covers ABC, fed ABC goes beyond, 5/6 brings ABC back', () => {
    expect(rows[0]).toBe(CAPSTONE_CASE);
    expect(rows.map((c) => [c.one, c.x, c.held])).toEqual([
      ['big', '1/36', true],
      ['small', '6/5', true],
      ['big', '6/5', false],
      ['big', '1/2', false],
      ['big', '5/6', true],
    ]);
    expect(copyOf(SCALE_INQUIRY, 'small', '6/5').perimeter).toBe('138');
  });

  it('(1) ÷ (2) gives 5/6, the difference 4, longest ÷ shortest 33/10 on round 2 — each falls on the capstone already, and there', () => {
    const r2 = rows[1];
    expect(kOf({ k: 'one_two', big: 'gt' }, r2)).toBe('5/6');
    expect(kOf({ k: 'minus', big: 'gt' }, r2)).toBe('4');
    expect(kOf({ k: 'long', big: 'gt' }, r2)).toBe('33/10');
    expect(kOf({ k: 'one_two', big: 'gt' }, CAPSTONE_CASE)).toBe('36');
    for (const k of ['one_two', 'minus', 'long']) {
      const r = rule(K4, { k, big: 'gt' });
      const f = fallOf(K4, r);
      expect(f.on).toBe('evidence');
      expect(caseId(f.c)).toBe(caseId(CAPSTONE_CASE));
      // without the capstone, round 2 refutes it
      expect(runOn(F[K4], r, rows.slice(1)).bad, k).toBe(0);
    }
  });

  it('« k < 1 » falls on the capstone (1/36 makes it smaller), « natural » on round 2 (6/5), « always » on the capstone', () => {
    expect(caseId(fallOf(K4, { k: 'two_one', big: 'lt' }).c)).toBe(caseId(CAPSTONE_CASE));
    expect(caseId(fallOf(K4, { k: 'two_one', big: 'nat' }).c)).toBe(caseId(rows[1]));
    expect(caseId(fallOf(K4, { k: 'two_one', big: 'always' }).c)).toBe(caseId(CAPSTONE_CASE));
  });

  it('the last step: k = 5/8, a reduction, MN = 57,5, back 8/5 — any equal fraction is right, the inverted k is not', () => {
    expect(USE4.k).toBe('5/8');
    expect(equal(times(USE4.BC, USE4.k), USE4.MN)).toBe(true);
    const ok = { kn: '85', kd: '136', kind: 'reduction', mn: '57,5', bn: '8', bd: '5' };
    expect(F[K4].use.check(USE4, ok)).toBe('ok');
    expect(F[K4].use.check(USE4, { ...ok, kn: '8', kd: '5' })).toBe('kInv');
    expect(F[K4].use.check(USE4, { ...ok, bn: '5', bd: '8' })).toBe('back');
    expect(F[K4].use.check(USE4, { ...ok, mn: '147,2' })).toBe('mnInv');
  });
});

describe('🔑 the last step: the reason, then the three ratios', () => {
  it('« the canal cuts both sides » is answered with the old canal; the ratios upside down all three are right too', () => {
    const v = SOLVE[K1](USE1);
    expect(F[K1].use.check(USE1, { ...v, cond: 'cut' })).toBe('cut');
    const flip = { ...v, an: v.ad, ad: v.an, bn: v.bd, bd: v.bn, cn: v.cd, cd: v.cn };
    expect(F[K1].use.check(USE1, flip)).toBe('ok');
    expect(F[K1].use.check(USE1, { ...v, ad: 'GE' })).toBe('piece');
  });
});

/** The text a rendered element shows (its tags and the formulas' annotations left out). */
const textOf = (html) => html.replace(/<annotation[^>]*>.*?<\/annotation>/g, '').replace(/<[^>]+>/g, ' ');

describe('the gauge agrees with what each case is TRUE of (`held`)', () => {
  it('🔑: a canal run through a wrong chain shows HIS three values; the parallel canal through « piece » stands apart', () => {
    const r = rule(K1, { cond: 'par', chain: 'piece' });
    const shown = testsOf(F[K1], r, suite.rowsOf(K1, ROADS.AT_ONCE));
    const fresh = shown.find((c) => c.id === 'canal:new');
    expect(fresh.tested.values).toEqual(['2/7', '2/7', '2/9']);
    expect(gauge(fresh).aligned).toBe(false);
    expect(fresh.held).toBe(false);
    for (const chain of ['whole', 'piece', 'diff', 'flip'])
      for (const c of testsOf(F[K1], rule(K1, { cond: 'par', chain }), suite.rowsOf(K1, ROADS.AT_ONCE)))
        expect(gauge(c).aligned, `${chain} ${c.id}`).toBe(c.held);
  });
  it('🔍: a copy at the wrong number stands apart from its target 1, at its k it reaches it — every frame', () => {
    const cases = [...suite.rowsOf(K4, ROADS.AT_ONCE), ...Object.values(F4_CASES), CAPSTONE_CASE];
    for (const c of cases) expect(gauge(c).aligned, caseId(c)).toBe(c.held);
    expect(cases.some((c) => !c.held)).toBe(true);
    const out = renderToString(createElement(Mirror, { c: F4_CASES.OF, stage: 'done' }));
    expect(out).toContain('data-rf-aligned="no"');
    expect(out).toContain('data-rf-gauge-target');
  });
  it('🦋: the gauge of every pair he turned, his river first, is its `held` (parallel or not)', () => {
    for (const c of suite.rowsOf(K3, ROADS.AT_ONCE)) expect(gauge(c).aligned, caseId(c)).toBe(c.held);
  });
});

describe('the last steps draw their figure beside their lines', () => {
  const FIGS_OF = { [K1]: USE1_FIG, [K2]: USE2_FIG, [K3]: USE3_FIG, [K4]: USE4_FIG };
  it('each forge gives its figure; it fits beside the lines at its 12 px label floor', () => {
    for (const key of KEYS) {
      const c = F[key].use.figure(F[key].use.make());
      expect(c).toBe(FIGS_OF[key]);
      const f = lastStepFigure(c);
      expect(f.fits, `${key} ${f.width}×${f.height}`).toBe(true);
    }
  });
  it('a figure writes what the question gives and « ? » for what it asks — nothing else', () => {
    const text = (c) => textOf(renderToString(createElement(UseFigure, { c })));
    expect(text(USE1_FIG)).not.toMatch(/\d/);
    const two = text(USE2_FIG);
    for (const x of ['45', '10', 'AC = 66', '77', '?']) expect(two).toContain(x);
    expect(two).not.toMatch(/55|54|63/);
    const three = text(USE3_FIG);
    for (const x of ['18', '48', '21', '88', '?']) expect(three).toContain(x);
    expect(three).not.toMatch(/56|33/);
    const four = text(USE4_FIG);
    for (const x of ['42,5', 'AB = 68', '92', '?']) expect(four).toContain(x);
    expect(four).not.toMatch(/57|80|50/);
  });
});

describe('every case the forges show is drawn by the world', () => {
  it('the mirror and a line of evidence render each case of each forge, built or not', () => {
    for (const key of KEYS)
      for (const c of suite.shownCases(F[key])) {
        expect(renderToString(createElement(Mirror, { c, stage: 'done' })), caseId(c)).toContain('data-rf-gauge');
        expect(renderToString(createElement(Line, { c })), caseId(c)).toContain('data-np-line');
      }
  });
});

describe('the mirror’s new numbers are the platform’s own', () => {
  const bank = readBank('talis-hisab-atwal');
  const stories = storiesOf({ exceptId: 'talis-hisab-atwal' });
  const groupOf = (f) =>
    Object.values(f.len)
      .filter((x) => x != null && /^\d+$/.test(x))
      .map(Number);
  const groups = {
    RX: groupOf(FIGS.RX),
    OX: groupOf(FIGS.OX),
    'the difference course': [...groupOf(FIGS.R), 18, 21, 29],
    R: groupOf(FIGS.R),
    O: groupOf(FIGS.O),
    'the capstone': [90, 99],
  };
  it.each(Object.entries(groups))('%s: no pair on a line of the bank or of another story', (_, nums) => {
    const uniq = [...new Set(nums)];
    for (let i = 0; i < uniq.length; i += 1)
      for (let j = i + 1; j < uniq.length; j += 1) {
        const r = collisions(bank, [uniq[i], uniq[j]], { stories });
        expect(r.clear, `${uniq[i]} ; ${uniq[j]}`).toBe(true);
      }
  });
  it('the frames of 🔍 hold the k of their figure', () => {
    expect(F4_CASES.OT.held && F4_CASES.RT.held && F4_CASES.OU.held && F4_CASES.RU.held).toBe(true);
    expect(F4_CASES.OF.held || F4_CASES.RF.held || F4_CASES.OB.held || F4_CASES.RB.held).toBe(false);
  });
});
