/**
 * THE STORY of lesson `talis-hisab-atwal` in « الأهرامات »: the forge of each stage, the legs, the final mission and the
 * box at noon — every number re-computed, every wrong line answered with a FACT, the mission impossible without the
 * keys; what the robot and the card « من المرسى السابق » say before each seal names no rule; the tablets carry the
 * board's recall words. (`describeStory` is the islands' suite — bridges and convoys —: this world has none; its checks
 * that apply are written here.)
 */
import { describe, it, expect } from 'vitest';
import {
  said,
  agreementErrors,
  looseComma,
  equalitiesHold,
} from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { collisions, readBank, storiesOf } from '../../../../../../common/gameworld/kit/authoring/test/bank.js';
import { boxesOf } from '../../../../../../common/gameworld/kit/authoring/forgeBlocks';
import { WORLD_TEXT } from '../../../../../../common/gameworld/nilePyramids/strings';
import { BOX_H, BOX_OB, HALF, MISSION_AB, MISSION_H, MISSION_K, SAY, STORY } from './story';
import { FORGES } from './forges';
import { TABLETS } from './tablets';
import { KEYS } from './journey';
import { LEGS } from './run';
import { CAMERA_BOX, K1, K2, K3, K4, PLATEAU, NUMBERS, equal, over, times } from './math';

const MI = NUMBERS.mission;
/** The words of each key: no sentence played before its seal says them. */
const WORDS = {
  [K1]: /طالس|وضعية|متوازي|توازي|موازي/,
  [K2]: /الرابع المتناسب|متناسب|متصالب/,
  [K3]: /فراشة|نصف دورة/,
  [K4]: /معامل|تناسبية|تكبير|تصغير/,
};
const RIGHT_MISSION = {
  ah: MI.shadow,
  hb: HALF,
  ab: MISSION_AB,
  why: 'vertical',
  rn: '3',
  rd: '219',
  mn: '2',
  h: '146',
  k: '73',
};
const RIGHT_BOX = { o1: CAMERA_BOX.fromEdge, o2: HALF, ob: BOX_OB, bc: BOX_H };

/** A game that records what the story makes it say. */
const fakeGame = ({ done = {}, log = [] } = {}) => {
  const says = [];
  return { says, done, log, T: WORLD_TEXT, say: (t) => says.push(t) };
};

describe('the story hands the world what it asks (GAME_WORLD.md §2ter-4)', () => {
  it('one forge per stage table, the keys in the order of the story, each one a forge of the lesson', () => {
    expect(Object.values(STORY.forges)).toEqual(KEYS);
    expect(Object.keys(STORY.forges)).toEqual(['field', 'workshop', 'river', 'summit']);
    for (const k of KEYS) expect(FORGES[k].key).toBe(k);
  });
  it('the felucca’s four legs are the written world’s', () => {
    expect(STORY.legs).toBe(LEGS);
    expect(STORY.legs).toHaveLength(4);
  });
});

describe('the final mission « ظلّ الهرم الأكبر » needs the four keys (plan §3.7)', () => {
  it('its numbers: AB = 104 + 115 = 219; 3/219 = 2/h gives h = 146 — the world’s pyramid; k = 73', () => {
    expect(HALF).toBe('115');
    expect(MISSION_AB).toBe(MI.AB);
    expect(MISSION_H).toBe(MI.h);
    expect(MISSION_H).toBe(PLATEAU.h);
    expect(MISSION_K).toBe(MI.k);
    expect(equal(times(MI.stickShadow, MISSION_K), MISSION_AB)).toBe(true);
    // the distractors: 104 alone gives 69,3…; the ratio upside down 328,5
    expect(over(times(MI.shadow, MI.stick), MI.stickShadow)).toEqual(over('208', '3'));
    expect(equal(over(times(MISSION_AB, MI.stickShadow), MI.stick), '328,5')).toBe(true);
  });

  it('the right card is accepted, and Zero flies to the h he wrote', () => {
    expect(STORY.mission.check(RIGHT_MISSION)).toBe('ok');
    expect(STORY.mission.height({ ...RIGHT_MISSION, h: '328,5' })).toBe('328,5');
    const names = STORY.mission.lines().flatMap((l) => boxesOf(l.tokens).map((t) => t.slot ?? t.choice));
    expect(names.sort()).toEqual(Object.keys(RIGHT_MISSION).sort());
  });

  it('every wrong line is answered with a fact — the base side for the half, a reason, the ratio upside down, h, k', () => {
    const wrong = [
      { hb: PLATEAU.base },
      { ah: '0', hb: MI.shadow },
      { ab: '220' },
      { why: 'length' },
      { why: 'shadow' },
      { rn: '219', rd: '3' },
      { rn: '3', rd: '104' },
      { mn: '3' },
      { h: '328,5' },
      { h: '69' },
      { k: '72' },
    ];
    for (const w of wrong) {
      const out = STORY.mission.check({ ...RIGHT_MISSION, ...w });
      expect(out, JSON.stringify(w)).not.toBe('ok');
      said(out);
      expect(out).not.toMatch(/خطأ|خاطئ|غلط/);
    }
    // an equal fraction of the ratio is right too
    expect(STORY.mission.check({ ...RIGHT_MISSION, rn: '1', rd: '73' })).toBe('ok');
  });

  it('the box at noon gives the same height another way: 0,25 × 292 / 0,5 = 146', () => {
    expect(BOX_OB).toBe('292');
    expect(BOX_H).toBe(MISSION_H);
    expect(STORY.box.check(RIGHT_BOX)).toBe('ok');
    for (const w of [{ o2: PLATEAU.base }, { ob: '291' }, { bc: '73' }]) {
      const out = STORY.box.check({ ...RIGHT_BOX, ...w });
      expect(out).not.toBe('ok');
      said(out);
    }
  });

  it('the cards: at most four lines, four boxes a line; a schematic figure each', () => {
    for (const card of [STORY.mission, STORY.box]) {
      const lines = card.lines();
      expect(lines.length).toBeLessThanOrEqual(4);
      for (const l of lines) expect(l.tokens.filter((t) => typeof t === 'object').length).toBeLessThanOrEqual(4);
      expect(card.figure.points).toBeTruthy();
      for (const s of [card.title, ...card.lead]) said(s);
    }
  });

  it('its numbers are the platform’s own (the stick’s 2 and 3 excepted: single digits, the owner’s mock-up)', () => {
    const bank = readBank('talis-hisab-atwal');
    const stories = storiesOf({ exceptId: 'talis-hisab-atwal' });
    const nums = [104, 115, 219, 230, 146, 73, 177, 292];
    for (let i = 0; i < nums.length; i += 1)
      for (let j = i + 1; j < nums.length; j += 1)
        expect(collisions(bank, [nums[i], nums[j]], { stories }).clear, `${nums[i]} ; ${nums[j]}`).toBe(true);
  });
});

describe('no rule before its key: the robot and the card « من المرسى السابق »', () => {
  /** A game log through the four stages, as the world writes it. */
  const game = fakeGame({
    done: { 'MN?': '18', MN: '18', 'PQ?': '50,1', PQ: '41' },
    log: [
      { stage: 'workshop', step: 'course', kind: 'course', typed: '11', fact: 'gap' },
      { stage: 'workshop', step: 'course', kind: 'course', typed: '88', fact: 'fits' },
      { stage: 'workshop', step: 'course2', kind: 'course', typed: '77', fact: 'fits' },
      { stage: 'workshop', step: 'mark', kind: 'mark', typed: '40', fact: 'fits' },
      { stage: 'river', step: 'ferry', kind: 'ferry', typed: '416', fact: 'ties' },
      { stage: 'summit', step: 'capstone', kind: 'capstone', typed: '1/36', fact: 'sits' },
    ],
  });
  /** The keys still missing when a stage is reached. */
  const missing = { field: KEYS, workshop: [K2, K3, K4], river: [K3, K4], summit: [K4], plateau: [] };

  it('each stage’s card says what the stage before gave — facts, at most three lines', () => {
    expect(STORY.recall(game, 'field')).toEqual([]);
    expect(STORY.recall(game, 'workshop')).toHaveLength(2);
    expect(STORY.recall(game, 'river')).toHaveLength(3);
    expect(STORY.recall(game, 'summit')).toHaveLength(2);
    expect(STORY.recall(game, 'plateau')).toHaveLength(1);
    expect(STORY.recall(fakeGame(), 'workshop')).toEqual([]);
  });

  it('what is said at each stage names no key still missing; after a seal, no later key', () => {
    for (const [id, keys] of Object.entries(missing)) {
      const g = fakeGame(game);
      g.done = game.done;
      g.log = game.log;
      STORY.onArrive(g, id);
      STORY.onArrive(g, id);
      expect(g.says[0]).toBe(g.says[1]);
      for (const line of [...g.says, ...STORY.recall(g, id)]) {
        said(line);
        expect(agreementErrors(line), line).toEqual([]);
        expect(looseComma(line), line).toBe(false);
        for (const k of keys) expect(line, `${id} / ${k}: ${line}`).not.toMatch(WORDS[k]);
      }
    }
    KEYS.forEach((key, i) => {
      const g = fakeGame();
      STORY.afterKey[key](g);
      for (const later of KEYS.slice(i + 1)) expect(g.says[0], `${key}`).not.toMatch(WORDS[later]);
    });
  });

  it('the robot’s sentences are whole and plain', () => {
    for (const s of Object.values(SAY)) {
      said(s);
      expect(s).not.toMatch(/\$|\\/);
    }
  });
});

describe('the tablets — the board’s recall words, in the words of the lines', () => {
  const RECALL = {
    [K1]: ['خاصية طالس', 'وضعية طالس'],
    [K2]: ['الرابع المتناسب', 'الجداء المتصالب'],
    [K3]: ['وضعية الفراشة', 'نصف دورة'],
    [K4]: ['معامل التناسبية', 'تكبير', 'تصغير'],
  };
  it('one tablet per key: its recall words outside a formula; four lines at most, two formulas at most', () => {
    expect(Object.keys(TABLETS)).toEqual(KEYS);
    for (const k of KEYS) {
      const t = TABLETS[k];
      const words = t.lines.join(' ').replace(/\$[^$]+\$/g, ' ');
      for (const w of RECALL[k]) expect(words, `${k}: ${w}`).toContain(w);
      expect(t.math.length).toBeLessThanOrEqual(2);
      expect(t.lines.length).toBeLessThanOrEqual(2);
      expect(t.lines.length + t.math.length + t.notes.length).toBeLessThanOrEqual(4);
      for (const s of [t.title, ...t.lines, ...t.math]) said(s);
    }
  });
  it('their formulas of numbers are true', () => {
    expect(equalitiesHold(TABLETS[K1].math[1])).toBe(1);
    expect(equalitiesHold(TABLETS[K4].math[0].replace(/^k = /, ''))).toBe(1);
    expect(TABLETS[K4].math[1]).toBe('\\dfrac{2{,}5}{90} = \\dfrac{1}{36}');
    expect(equal(over('2,5', '90'), '1/36')).toBe(true);
    expect(equal(over(times('99', '80'), '90'), '88')).toBe(true);
    expect(equal(over(times('72', '52'), '9'), '416')).toBe(true);
  });
});
